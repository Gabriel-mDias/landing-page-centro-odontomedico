import { SITE_CONFIG } from '../../config/site.js';
import { openDetail } from './detail-dialog.js';

const required = ['id', 'title', 'cover', 'mp4', 'webm', 'alt', 'source', 'professional', 'cro', 'tcle_confirmed', 'publication_state', 'enabled'];

export function isPublishable(item) {
  return required.every((key) => Object.hasOwn(item, key))
    && item.enabled === true
    && item.tcle_confirmed === true
    && typeof item.professional === 'string' && item.professional.trim().length > 0
    && typeof item.cro === 'string' && item.cro.trim().length > 0
    && item.publication_state === 'ready';
}

export async function initCases() {
  const section = document.querySelector('[data-cases-section]');
  const list = section?.querySelector('[data-cases-list]');
  if (!section || !list) return;
  try {
    const response = await fetch(SITE_CONFIG.media.casesCatalog);
    if (!response.ok) return;
    const catalog = await response.json();
    const active = Array.isArray(catalog.cases) ? catalog.cases.filter(isPublishable) : [];
    if (!catalog.enabled || active.length === 0) return;
    list.innerHTML = active.map((item) => `<article class="case-card"><img src="${item.cover}" alt="${item.alt}" loading="lazy"><h3>${item.title}</h3><button class="button" type="button" data-open-case="${item.id}">Ver detalhes</button></article>`).join('');
    section.hidden = false;
    list.querySelectorAll('[data-open-case]').forEach((button) => {
      const item = active.find((candidate) => candidate.id === button.dataset.openCase);
      button.addEventListener('click', () => openDetail({
        trigger: button,
        html: `<span class="dialog-kicker">Caso clínico</span><h2 id="detail-title">${item.title}</h2><video controls muted playsinline poster="${item.cover}" preload="none" data-case-video><source data-src="${item.webm}" type="video/webm"><source data-src="${item.mp4}" type="video/mp4"></video><p>Responsável: ${item.professional} · ${item.cro}</p>`,
        onOpen: (content) => {
          const video = content.querySelector('[data-case-video]');
          video.querySelectorAll('source').forEach((source) => { source.src = source.dataset.src; });
          video.load();
        }
      }));
    });
  } catch {
    section.hidden = true;
  }
}
