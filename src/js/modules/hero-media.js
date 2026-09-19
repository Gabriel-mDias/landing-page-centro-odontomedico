import { SITE_CONFIG } from '../../config/site.js';

export function initHeroMedia() {
  const wrapper = document.querySelector('[data-hero-media]');
  const video = wrapper?.querySelector('[data-hero-video]');
  if (!wrapper || !video) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smallScreen = matchMedia('(max-width: 700px)').matches;
  const saveData = navigator.connection?.saveData === true;
  if (reduceMotion || smallScreen || saveData) {
    wrapper.classList.add('is-fallback');
    return;
  }

  video.src = SITE_CONFIG.media.heroVideo;
  video.addEventListener('error', () => wrapper.classList.add('is-fallback'), { once: true });
  video.play().catch(() => wrapper.classList.add('is-fallback'));
}
