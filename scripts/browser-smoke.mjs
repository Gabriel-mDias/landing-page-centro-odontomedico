import { chromium } from 'playwright-core';
import { existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const baseUrl = process.argv[2] || 'http://127.0.0.1:4173/';
const candidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium'
];
const executablePath = candidates.find(existsSync);
if (!executablePath) throw new Error('Chrome/Chromium não encontrado para o smoke test local.');

const mainSource = readFileSync('src/js/main.js', 'utf8');
const journeyStyles = readFileSync('src/styles/components.css', 'utf8');
if (existsSync('src/js/modules/journey.js') || /initJourney|modules\/journey/.test(mainSource)) throw new Error('controlador dedicado da jornada ainda está presente');
if (/journey-(?:sticky|orbit|glass|core|visual)|journey\.is-enhanced/.test(journeyStyles)) throw new Error('CSS da antiga cena orbital/sticky ainda está presente');

const browser = await chromium.launch({ executablePath, headless: true });
const cases = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 }
];

async function exerciseDialog(page, trigger) {
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const dialog = page.locator('#detail-dialog');
  if (!(await dialog.evaluate((element) => element.open))) throw new Error('diálogo não abriu');
  await page.keyboard.press('Escape');
  if (await dialog.evaluate((element) => element.open)) throw new Error('Escape não fechou o diálogo');
  if (!(await trigger.evaluate((element) => element === document.activeElement))) throw new Error('foco não retornou ao acionador');
}

try {
  for (const current of cases) {
    const context = await browser.newContext({ viewport: { width: current.width, height: current.height } });
    const page = await context.newPage();
    const errors = [];
    const externalFonts = [];
    const oldJourneyMedia = [];
    await page.addInitScript(() => {
      window.__pageQuality = { cls: 0, longestTask: 0 };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__pageQuality.cls += entry.value;
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) window.__pageQuality.longestTask = Math.max(window.__pageQuality.longestTask, entry.duration);
      }).observe({ type: 'longtask', buffered: true });
    });
    await page.route(/fonts\.(googleapis|gstatic)\.com/, async (route) => {
      externalFonts.push(route.request().url());
      await route.abort();
    });
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('request', (request) => {
      if (/culture_smile|hero_2_(?:scrub|poster)/.test(request.url())) oldJourneyMedia.push(request.url());
    });

    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.locator('#team-wrapper .team-card').first().waitFor();
    await page.evaluate(() => { window.__pageQuality.longestTask = 0; });
    for (const step of await page.locator('[data-journey-step]').all()) {
      await step.scrollIntoViewIfNeeded();
      await page.waitForTimeout(80);
    }
    for (const section of await page.locator('main > section:not([hidden])').all()) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(80);
    }
    await page.locator('#hero').scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);

    const result = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      imagesBroken: [...document.images].filter((image) => image.currentSrc && image.getClientRects().length > 0 && (!image.complete || image.naturalWidth === 0)).map((image) => image.currentSrc),
      h1Count: document.querySelectorAll('h1').length,
      menuDisplay: getComputedStyle(document.querySelector('[data-menu-button]')).display,
      font: getComputedStyle(document.body).fontFamily,
      manropeLoaded: document.fonts.check('16px Manrope'),
      casesHidden: document.querySelector('[data-cases-section]').hidden,
      heroSource: document.querySelector('[data-hero-video]').getAttribute('src') || '',
      journeySteps: document.querySelectorAll('[data-journey-step]').length,
      journeyOrder: [...document.querySelectorAll('[data-journey-step]')].map((step) => step.dataset.journeyStep).join(','),
      journeyLayout: [...document.querySelectorAll('[data-journey-step]')].map((step) => {
        const image = step.querySelector('.journey-step-image').getBoundingClientRect();
        const content = step.querySelector('.journey-step-content').getBoundingClientRect();
        return {
          imageCenter: image.left + image.width / 2,
          contentCenter: content.left + content.width / 2,
          overlaps: image.left < content.right && image.right > content.left && image.top < content.bottom && image.bottom > content.top,
          position: getComputedStyle(step).position,
          opacity: Number(getComputedStyle(step).opacity)
        };
      }),
      journeyImagesLazy: [...document.querySelectorAll('[data-journey-step] img')].every((image) => image.loading === 'lazy' && image.getAttribute('width') === '720' && image.getAttribute('height') === '540'),
      oldJourneyHooks: document.querySelectorAll('[data-journey-image], [data-journey-counter], [data-journey-visual], .is-enhanced').length,
      journeyStickyDescendants: [...document.querySelectorAll('[data-journey], [data-journey] *')].filter((element) => getComputedStyle(element).position === 'sticky').length,
      cls: window.__pageQuality?.cls || 0,
      longestTask: window.__pageQuality?.longestTask || 0,
      headingsOutside: [...document.querySelectorAll('h1,h2')].filter((heading) => {
        const rect = heading.getBoundingClientRect();
        return rect.left < -1 || rect.right > window.innerWidth + 1;
      }).map((heading) => heading.textContent.trim()),
      whatsapp: (() => {
        const button = document.querySelector('.whatsapp-float');
        const rect = button.getBoundingClientRect();
        const footer = document.querySelector('.footer').getBoundingClientRect();
        return { href: button.href, label: button.getAttribute('aria-label'), right: rect.right, bottom: rect.bottom, overlapsFooterContent: footer.top < window.innerHeight && rect.top < footer.bottom };
      })(),
      footerComplete: ['#hero', '#jornada', '#especialidades', '#resultados', '#equipe', '#duvidas', '#contato'].every((href) => document.querySelector(`.footer a[href="${href}"]`))
        && document.querySelector('.footer').textContent.includes('26.721.825/0001-99')
        && document.querySelector('.footer').textContent.includes('G&Ms Soluções Tecnológicas')
    }));

    if (result.scrollWidth > result.innerWidth) errors.push(`overflow horizontal: ${result.scrollWidth}px > ${result.innerWidth}px`);
    if (result.imagesBroken.length) errors.push(`imagem(ns) quebrada(s): ${result.imagesBroken.join(', ')}`);
    if (result.h1Count !== 1) errors.push(`esperado 1 H1, encontrado ${result.h1Count}`);
    if (!result.manropeLoaded || !result.font.includes('Manrope')) errors.push('Manrope auto-hospedada não foi aplicada');
    if (!result.casesHidden) errors.push('casos clínicos incompletos foram renderizados');
    if (result.journeySteps !== 4) errors.push(`jornada: esperadas 4 etapas, encontradas ${result.journeySteps}`);
    if (result.journeyOrder !== '0,1,2,3') errors.push(`ordem da jornada incorreta: ${result.journeyOrder}`);
    if (!result.journeyImagesLazy) errors.push('jornada: dimensões ou lazy loading das imagens incorretos');
    if (result.oldJourneyHooks) errors.push('jornada: hooks da antiga cena dinâmica ainda presentes');
    if (result.journeyStickyDescendants) errors.push('jornada: position sticky ainda presente');
    if (result.journeyLayout.some((step) => step.position === 'sticky' || step.opacity === 0)) errors.push('jornada: painel sticky ou invisível');
    if (result.cls >= 0.1) errors.push(`CLS acima do orçamento: ${result.cls.toFixed(3)}`);
    if (result.longestTask > 50) errors.push(`tarefa longa durante a interação: ${result.longestTask.toFixed(1)}ms`);
    if (oldJourneyMedia.length) errors.push('jornada requisitou mídia antiga do sorriso');
    if (result.headingsOutside.length) errors.push(`título(s) fora do viewport: ${result.headingsOutside.join(' | ')}`);
    if (!result.whatsapp.href.startsWith('https://wa.me/5522998155861?text=') || !result.whatsapp.label) errors.push('botão flutuante do WhatsApp não usa configuração ou rótulo acessível');
    if (result.whatsapp.right > result.innerWidth + 1 || result.whatsapp.bottom > current.height + 1) errors.push('botão flutuante saiu do viewport');
    if (!result.footerComplete) errors.push('footer final incompleto');
    if (externalFonts.length) errors.push('fonte externa requisitada');
    if (current.name === 'mobile' && result.heroSource) errors.push('hero mobile baixou vídeo em vez de usar poster');
    if (current.name !== 'mobile' && !result.heroSource) errors.push('hero desktop/tablet não recebeu fonte de vídeo');

    if (current.name === 'mobile') {
      if (result.journeyLayout.some((step) => !step.overlaps)) errors.push('jornada mobile: texto não está sobre a fotografia');
      if (result.menuDisplay === 'none') errors.push('botão do menu mobile não está visível');
      await page.locator('[data-menu-button]').click();
      if (await page.locator('[data-menu-button]').getAttribute('aria-expanded') !== 'true') errors.push('menu mobile não atualizou aria-expanded');
      await page.keyboard.press('Escape');
    } else {
      const alternates = result.journeyLayout.every((step, index) => index % 2 === 0 ? step.imageCenter < step.contentCenter : step.imageCenter > step.contentCenter);
      if (!alternates) errors.push('jornada: alternância esquerda/direita incorreta');
    }

    try {
      await exerciseDialog(page, page.locator('[data-specialty]').first());
      await exerciseDialog(page, page.locator('[data-open-professional]').first());
    } catch (error) { errors.push(error.message); }

    await page.locator('.footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
    if (!await page.locator('.whatsapp-float').evaluate((element) => element.classList.contains('is-hidden'))) errors.push('botão flutuante sobrepõe contato/footer');

    const screenshot = join(tmpdir(), `centro-odontomedico-${current.name}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    await context.close();
    if (errors.length) throw new Error(`${current.name}: ${errors.join('; ')}`);
    console.log(`${current.name}: ${result.innerWidth}px, CLS ${result.cls.toFixed(3)}, maior tarefa ${result.longestTask.toFixed(1)}ms, screenshot ${screenshot}`);
  }

  const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(baseUrl, { waitUntil: 'networkidle' });
  const reduced = await reducedPage.evaluate(() => ({
    heroSource: document.querySelector('[data-hero-video]').getAttribute('src') || '',
    journeyStepsVisible: [...document.querySelectorAll('[data-journey-step]')].every((element) => getComputedStyle(element).opacity !== '0'),
    revealVisible: [...document.querySelectorAll('[data-reveal]')].every((element) => getComputedStyle(element).opacity !== '0')
  }));
  await reducedContext.close();
  if (reduced.heroSource || !reduced.journeyStepsVisible || !reduced.revealVisible) throw new Error('reduced-motion: fallback estático ou conteúdo falhou');
  console.log('reduced-motion: poster e jornada estática completa confirmados');

  const dataSaverContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await dataSaverContext.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } });
  });
  const dataSaverPage = await dataSaverContext.newPage();
  await dataSaverPage.goto(baseUrl, { waitUntil: 'networkidle' });
  if (await dataSaverPage.locator('[data-hero-video]').getAttribute('src')) throw new Error('economia de dados: vídeo da hero foi solicitado');
  if (!await dataSaverPage.locator('[data-journey-step]').evaluateAll((steps) => steps.length === 4 && steps.every((step) => getComputedStyle(step).opacity !== '0'))) throw new Error('economia de dados: jornada completa não ficou visível');
  await dataSaverContext.close();
  console.log('economia de dados: hero estática confirmada');

  const failureContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await failureContext.route('**/hero_1.mp4', (route) => route.abort());
  const failurePage = await failureContext.newPage();
  await failurePage.goto(baseUrl, { waitUntil: 'networkidle' });
  await failurePage.locator('[data-hero-media].is-fallback').waitFor();
  await failureContext.close();
  console.log('falha de vídeo: poster de fallback confirmado');

  const noScriptContext = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const noScriptPage = await noScriptContext.newPage();
  await noScriptPage.goto(baseUrl, { waitUntil: 'networkidle' });
  const noScriptJourney = await noScriptPage.locator('[data-journey-step]').evaluateAll((steps) => steps.length === 4 && steps.every((step) => getComputedStyle(step).opacity !== '0' && step.textContent.trim().length > 0));
  await noScriptContext.close();
  if (!noScriptJourney) throw new Error('JavaScript indisponível: conteúdo completo da jornada não ficou visível');
  console.log('JavaScript indisponível: quatro painéis da jornada permanecem legíveis');

  const imageFailureContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const imageFailurePage = await imageFailureContext.newPage();
  await imageFailurePage.route(/\/assets\/journey\/.+\.(?:avif|webp)$/, (route) => route.abort());
  await imageFailurePage.goto(baseUrl, { waitUntil: 'networkidle' });
  const failureReadable = await imageFailurePage.locator('[data-journey-step]').evaluateAll((steps) => steps.length === 4 && steps.every((step) => {
    const copy = step.querySelector('.journey-step-copy');
    return getComputedStyle(copy).color !== 'rgba(0, 0, 0, 0)' && copy.getBoundingClientRect().height > 0;
  }));
  if (!failureReadable) throw new Error('falha de imagem ocultou conteúdo da jornada');
  await imageFailureContext.close();
  console.log('falha de imagem: fundo escuro e quatro etapas legíveis');
} finally {
  await browser.close();
}
