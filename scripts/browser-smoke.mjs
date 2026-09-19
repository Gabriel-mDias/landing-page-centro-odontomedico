import { chromium } from 'playwright-core';
import { existsSync } from 'node:fs';
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
    await page.route(/fonts\.(googleapis|gstatic)\.com/, async (route) => {
      externalFonts.push(route.request().url());
      await route.abort();
    });
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.locator('#team-wrapper .team-card').first().waitFor();
    for (const section of await page.locator('main > section:not([hidden])').all()) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(80);
    }
    await page.locator('#hero').scrollIntoViewIfNeeded();

    const result = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      imagesBroken: [...document.images].filter((image) => image.currentSrc && (!image.complete || image.naturalWidth === 0)).length,
      h1Count: document.querySelectorAll('h1').length,
      menuDisplay: getComputedStyle(document.querySelector('[data-menu-button]')).display,
      font: getComputedStyle(document.body).fontFamily,
      manropeLoaded: document.fonts.check('16px Manrope'),
      casesHidden: document.querySelector('[data-cases-section]').hidden,
      heroSource: document.querySelector('[data-hero-video]').getAttribute('src') || '',
      headingsOutside: [...document.querySelectorAll('h1,h2')].filter((heading) => {
        const rect = heading.getBoundingClientRect();
        return rect.left < -1 || rect.right > window.innerWidth + 1;
      }).map((heading) => heading.textContent.trim())
    }));

    if (result.scrollWidth > result.innerWidth) errors.push(`overflow horizontal: ${result.scrollWidth}px > ${result.innerWidth}px`);
    if (result.imagesBroken) errors.push(`${result.imagesBroken} imagem(ns) quebrada(s)`);
    if (result.h1Count !== 1) errors.push(`esperado 1 H1, encontrado ${result.h1Count}`);
    if (!result.manropeLoaded || !result.font.includes('Manrope')) errors.push('Manrope auto-hospedada não foi aplicada');
    if (!result.casesHidden) errors.push('casos clínicos incompletos foram renderizados');
    if (result.headingsOutside.length) errors.push(`título(s) fora do viewport: ${result.headingsOutside.join(' | ')}`);
    if (externalFonts.length) errors.push('fonte externa requisitada');
    if (current.name === 'mobile' && result.heroSource) errors.push('hero mobile baixou vídeo em vez de usar poster');
    if (current.name !== 'mobile' && !result.heroSource) errors.push('hero desktop/tablet não recebeu fonte de vídeo');

    if (current.name === 'mobile') {
      if (result.menuDisplay === 'none') errors.push('botão do menu mobile não está visível');
      await page.locator('[data-menu-button]').click();
      if (await page.locator('[data-menu-button]').getAttribute('aria-expanded') !== 'true') errors.push('menu mobile não atualizou aria-expanded');
      await page.keyboard.press('Escape');
    }

    try {
      await exerciseDialog(page, page.locator('[data-specialty]').first());
      await exerciseDialog(page, page.locator('[data-open-professional]').first());
    } catch (error) { errors.push(error.message); }

    const screenshot = join(tmpdir(), `centro-odontomedico-${current.name}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    await context.close();
    if (errors.length) throw new Error(`${current.name}: ${errors.join('; ')}`);
    console.log(`${current.name}: ${result.innerWidth}px, mídia/diálogos/foco/fontes sem regressões, screenshot ${screenshot}`);
  }

  const reducedContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(baseUrl, { waitUntil: 'networkidle' });
  const reduced = await reducedPage.evaluate(() => ({
    heroSource: document.querySelector('[data-hero-video]').getAttribute('src') || '',
    experienceControls: document.querySelector('[data-experience-video]').controls,
    revealVisible: [...document.querySelectorAll('[data-reveal]')].every((element) => getComputedStyle(element).opacity !== '0')
  }));
  await reducedContext.close();
  if (reduced.heroSource || !reduced.experienceControls || !reduced.revealVisible) throw new Error('reduced-motion: fallback de mídia ou conteúdo falhou');
  console.log('reduced-motion: poster, controles e conteúdo visível confirmados');

  const dataSaverContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await dataSaverContext.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } });
  });
  const dataSaverPage = await dataSaverContext.newPage();
  await dataSaverPage.goto(baseUrl, { waitUntil: 'networkidle' });
  if (await dataSaverPage.locator('[data-hero-video]').getAttribute('src')) throw new Error('economia de dados: vídeo da hero foi solicitado');
  await dataSaverContext.close();
  console.log('economia de dados: hero estática confirmada');

  const failureContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await failureContext.route('**/hero_1.mp4', (route) => route.abort());
  const failurePage = await failureContext.newPage();
  await failurePage.goto(baseUrl, { waitUntil: 'networkidle' });
  await failurePage.locator('[data-hero-media].is-fallback').waitFor();
  await failureContext.close();
  console.log('falha de vídeo: poster de fallback confirmado');
} finally {
  await browser.close();
}
