import { access, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const catalogPath = resolve(root, 'public/assets/cases/cases.json');
const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
const errors = [];
const required = ['id', 'title', 'cover', 'mp4', 'webm', 'alt', 'source', 'professional', 'cro', 'tcle_confirmed', 'publication_state', 'enabled'];

if (!Array.isArray(catalog.cases) || catalog.cases.length !== 8) errors.push('O catálogo deve conter exatamente os oito casos locais.');
for (const item of catalog.cases || []) {
  for (const key of required) if (!Object.hasOwn(item, key)) errors.push(`${item.id || 'caso sem id'}: campo ${key} ausente.`);
  const complete = typeof item.professional === 'string' && item.professional.trim()
    && typeof item.cro === 'string' && item.cro.trim()
    && item.tcle_confirmed === true && item.publication_state === 'ready';
  if (item.enabled && !complete) errors.push(`${item.id}: ativação recusada; autoria, CRO, TCLE e estado ready são obrigatórios.`);
  for (const field of ['cover', 'mp4', 'webm']) {
    if (!item[field]) continue;
    const local = resolve(root, 'public', item[field].replace(/^\//, ''));
    try {
      await access(local);
      if (field !== 'cover' && (await stat(local)).size > 2.5 * 1024 * 1024) errors.push(`${item.id}: ${field} excede 2,5 MB.`);
    } catch { errors.push(`${item.id}: arquivo ausente ${item[field]}.`); }
  }
}
if (catalog.enabled && !(catalog.cases || []).some((item) => item.enabled)) errors.push('Catálogo global ativo sem casos ativos.');
if (errors.length) {
  console.error(`Validação de casos recusada:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('Catálogo clínico validado: oito casos derivados e publicação regulatória bloqueada enquanto incompleta.');
