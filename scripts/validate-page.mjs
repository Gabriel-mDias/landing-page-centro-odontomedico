import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const root = resolve(import.meta.dirname, '..');
const required = [
  'index.html', 'src/config/site.js', 'src/js/main.js', 'src/styles/main.css',
  'public/robots.txt', 'public/site.webmanifest', 'public/404.html',
  '.github/workflows/quality.yml', '.github/workflows/deploy.yml',
  '.agents/skills/landing-page-builder/SKILL.md',
  '.agents/skills/landing-page-builder/references/strategy-creative-direction.md',
  '.agents/skills/landing-page-builder/scripts/cleanup-sample.bat',
  '.agents/skills/landing-page-builder/scripts/cleanup-sample.sh',
  '.agents/skills/landing-page-builder/scripts/cleanup-sample.mjs',
  '.agents/skills/instagram-profile-intake/SKILL.md', '.agents/skills/web-profile-intake/SKILL.md',
  '.agents/skills/landing-page-workflow/SKILL.md', '.agents/skills/landing-page-workflow/references/workflow.md',
  'contracts/manifest.template.json', 'contracts/manifest.schema.json',
  'scripts/manifest.py', 'scripts/asset_utils.py', 'scripts/workflow.py', 'tests/test_manifest.py',
  'requisitos/briefing-template.md', 'requisitos/direcao-criativa-template.md',
  'scripts/validate-strategy.mjs', 'CLAUDE.md', 'GEMINI.md', 'AGENTS.md'
];
const failures = [];
for (const file of required) {
  try { await access(resolve(root, file)); }
  catch { failures.push(`Arquivo obrigatório ausente: ${file}`); }
}

const html = await readFile(resolve(root, 'index.html'), 'utf8');
const config = await readFile(resolve(root, 'src/config/site.js'), 'utf8');
const skill = await readFile(resolve(root, '.agents/skills/landing-page-builder/SKILL.md'), 'utf8').catch(() => '');
const manifestSchema = await readFile(resolve(root, 'contracts/manifest.schema.json'), 'utf8').catch(() => '');
const gitignore = await readFile(resolve(root, '.gitignore'), 'utf8').catch(() => '');
const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const digest = (value) => createHash('sha256').update(value).digest('hex');

for (const hook of ['data-contact="whatsapp"', 'data-contact-form', 'aria-live="polite"']) if (!html.includes(hook)) failures.push(`Hook genérico ausente: ${hook}`);
for (const field of ['whatsapp:', 'email:', 'instagramUrl:', 'accessKey:']) if (!config.includes(field)) failures.push(`Configuração genérica ausente: ${field}`);

// Marca, mídia e narrativa da Clínica Aurora só são obrigatórias no sample intacto.
if (packageJson.name === 'landing-page-sample') {
  for (const file of ['public/favicon.svg', 'public/assets/logo/aurora-symbol.svg', 'public/assets/images/hero-clinica.webp', 'public/assets/images/consulta.webp', 'public/assets/images/consultorio.webp', 'public/assets/images/acolhimento.webp']) {
    try { await access(resolve(root, file)); } catch { failures.push(`Fixture exclusiva do sample ausente: ${file}`); }
  }
  for (const section of ['inicio', 'sobre', 'especialidades', 'jornada', 'duvidas', 'contato']) if (!html.includes(`id="${section}"`)) failures.push(`Seção da demo Aurora ausente: #${section}`);
}

if (packageJson.name === 'centro-odontomedico') {
  const publicTextFiles = ['index.html', 'README.md', 'public/404.html', 'public/site.webmanifest', 'public/robots.txt', 'media/README.md'];
  for (const file of publicTextFiles) {
    const content = await readFile(resolve(root, file), 'utf8');
    if (/Clínica Aurora|Aurora Demo|template demonstrativo/i.test(content)) failures.push(`Resíduo público do template em ${file}.`);
  }
  for (const fragment of ['meta name="author" content="G&amp;Ms Soluções Tecnológicas"', 'id="resultados"', 'data-contact="additional-phone"', 'class="whatsapp-float"', 'Centro Odontológico Muzi Ltda.', '26.721.825/0001-99', 'https://gems.tec.br/']) {
    if (!html.includes(fragment)) failures.push(`Conteúdo final obrigatório ausente: ${fragment}`);
  }
  for (const anchor of ['#hero', '#jornada', '#especialidades', '#resultados', '#equipe', '#duvidas', '#contato']) {
    if (!html.includes(`href="${anchor}"`)) failures.push(`Link de footer/navegação ausente: ${anchor}`);
  }
  if (!html.includes('noindex,nofollow')) failures.push('Protótipo perdeu noindex,nofollow.');
  const robots = await readFile(resolve(root, 'public/robots.txt'), 'utf8');
  if (!/^Disallow: \/$/m.test(robots)) failures.push('robots.txt não bloqueia a indexação do protótipo.');

  const sourceLogo = await readFile(resolve(root, 'media/Instagram/logo_1/logo_2.svg'), 'utf8');
  const publishedLogo = await readFile(resolve(root, 'public/assets/logo/logo-centro-odontomedico.svg'), 'utf8');
  const expectedLogo = sourceLogo.replace(/<path\s+style="fill:#fefefe"[^>]*id="path100"[^>]*\/>/i, '')
    .replace(/<\?xml[^>]*>\s*/i, '').replace(/<!--[^]*?-->\s*/g, '')
    .replace(/<sodipodi:namedview\b[^>]*(?:\/>|>[^]*?<\/sodipodi:namedview>)\s*/gi, '').replace(/<defs\b[^>]*(?:\/>|>\s*<\/defs>)\s*/gi, '')
    .replace(/\s+xmlns:(?:inkscape|sodipodi|svg)="[^"]*"/gi, '').replace(/\s+(?:sodipodi|inkscape):[a-z0-9-]+="[^"]*"/gi, '')
    .replace(/\s+(?:version|id|width|height)="[^"]*"/gi, '').replace(/[ \t]+$/gm, '').trim();
  if (digest(publishedLogo) !== digest(expectedLogo)) failures.push('Logo publicada diverge da arte oficial após a limpeza técnica permitida.');
  const favicon = await readFile(resolve(root, 'public/favicon.svg'), 'utf8');
  if (digest(favicon) !== digest(publishedLogo)) failures.push('Favicon não usa a mesma arte oficial da navegação e do footer.');

  const teamFiles = ['anna-luiza.png', 'cinthya.png', 'fernando-basilio.png', 'gabrielly.png', 'guilherme.png', 'kesia.png', 'mayson.png', 'nayara.png', 'ravenna.png', 'vinicius.png', 'viviane.png'];
  for (const file of teamFiles) {
    const [source, published] = await Promise.all([readFile(resolve(root, 'media/funcionarios', file)), readFile(resolve(root, 'public/assets/team', file))]);
    if (digest(source) !== digest(published)) failures.push(`Retrato revisado diverge da cópia pública: ${file}`);
  }
  for (const obsolete of ['patch.json', 'src/js/modules/carousel.js', 'public/assets/logo/logo-centro-odontomedico-mono.svg', 'public/assets/video/culture_smile_poster.jpg', 'public/assets/video/culture_smile_scrub.mp4', 'public/assets/video/hero_2.mp4', 'public/assets/video/hero_2_poster.jpg', 'public/assets/video/hero_2_scrub.mp4']) {
    try { await access(resolve(root, obsolete)); failures.push(`Artefato obsoleto ainda presente: ${obsolete}`); } catch { /* esperado */ }
  }
}

if (!skill.includes('Claude') || !skill.includes('Gemini') || !skill.includes('Codex')) failures.push('A skill não declara compatibilidade com Codex, Gemini e Claude.');
if (!skill.includes('landing_page.*') || !skill.includes('$landing-page-workflow')) failures.push('O builder não documenta ownership e retorno ao workflow.');
if (!manifestSchema.includes('https://json-schema.org/draft/2020-12/schema') || !manifestSchema.includes('"const": "1.0"')) failures.push('O contrato não declara JSON Schema 2020-12 e schema_version 1.0.');
const ignored = gitignore.split(/\r?\n/);
if (!ignored.includes('.assets/')) failures.push('.assets/ não está no .gitignore.');
if (!ignored.includes('__pycache__/') || !ignored.includes('*.pyc')) failures.push('Caches Python não estão ignorados.');
if (failures.length) { console.error(failures.map((item) => `- ${item}`).join('\n')); process.exit(1); }
console.log(`Validação concluída: ${required.length} arquivos e invariantes genéricos confirmados.`);
