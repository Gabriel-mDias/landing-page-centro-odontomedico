import Swiper from 'swiper';
import { A11y, FreeMode, Keyboard, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { SITE_CONFIG } from '../../config/site.js';
import { openDetail } from './detail-dialog.js';

let professionals = [];

const escapeHtml = (value = '') => String(value).replace(/[&<>"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
}[character]));

function openProfessional(id, trigger) {
  const person = professionals.find((item) => item.id === id);
  if (!person) return;
  const name = `${person.tratamento} ${person.nome}`;
  const message = `Olá! Gostaria de agendar uma consulta com ${name} no Centro Odontomédico.`;
  const whatsapp = `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(message)}`;
  openDetail({
    trigger,
    html: `
      <img class="dialog-image" src="./assets/team/${encodeURIComponent(person.imagem)}" alt="${escapeHtml(person.nome_exibicao)}">
      <span class="dialog-kicker">Corpo clínico</span>
      <h2 id="detail-title">${escapeHtml(name)}</h2>
      <p>${escapeHtml(person.descricao)}</p>
      <ul class="dialog-list">${person.funcoes.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      <a class="button" href="${whatsapp}" target="_blank" rel="noopener noreferrer">Agendar Consulta</a>
    `
  });
}

export async function initProfessionalPreview() {
  const wrapper = document.getElementById('team-wrapper');
  if (!wrapper) return;
  try {
    const response = await fetch('./assets/team/funcionarios.json');
    if (!response.ok) throw new Error('Catálogo da equipe indisponível');
    const data = await response.json();
    professionals = Array.isArray(data.funcionarios) ? data.funcionarios : [];
    wrapper.innerHTML = professionals.map((person, index) => `
      <div class="swiper-slide">
        <article class="team-card">
          <div class="team-card__image-box">
            <img class="team-card__image" src="./assets/team/${encodeURIComponent(person.imagem)}" alt="${escapeHtml(person.nome_exibicao)}" loading="lazy" width="520" height="650">
            <button class="team-card__action" type="button" data-open-professional="${escapeHtml(person.id)}" aria-label="Ver perfil: ${escapeHtml(person.nome_exibicao)}">
              <svg width="20" height="20" viewBox="0 0 256 256" fill="none" aria-hidden="true"><path d="M128 56C48 56 16 128 16 128s32 72 112 72 112-72 112-72-32-72-112-72Z" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><circle cx="128" cy="128" r="32" stroke="currentColor" stroke-width="16"/></svg>
              <span class="team-card__action-text">Ver perfil</span>
            </button>
          </div>
          <div class="team-card__content"><span class="team-card__index">${String(index + 1).padStart(2, '0')}</span><h3 class="team-card__name">${escapeHtml(person.nome_exibicao)}</h3><p class="team-card__role">${escapeHtml(person.funcoes[0])}</p></div>
        </article>
      </div>
    `).join('');

    wrapper.querySelectorAll('[data-open-professional]').forEach((button) => {
      button.addEventListener('click', () => openProfessional(button.dataset.openProfessional, button));
    });
    new Swiper('[data-team-carousel]', {
      modules: [A11y, FreeMode, Keyboard, Navigation, Pagination],
      slidesPerView: 'auto',
      spaceBetween: 18,
      freeMode: { enabled: true, momentum: true },
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: { nextEl: '[data-team-next]', prevEl: '[data-team-prev]' },
      pagination: { el: '[data-team-pagination]', clickable: true },
      breakpoints: { 700: { spaceBetween: 24 }, 1100: { spaceBetween: 32 } }
    });
  } catch {
    wrapper.innerHTML = '<p>Não foi possível carregar o corpo clínico agora.</p>';
  }
}
