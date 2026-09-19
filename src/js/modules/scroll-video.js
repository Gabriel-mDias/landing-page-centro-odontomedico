import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SITE_CONFIG } from '../../config/site.js';

gsap.registerPlugin(ScrollTrigger);

export function initScrollVideo() {
  const section = document.querySelector('.experience');
  const video = section?.querySelector('[data-experience-video]');
  const status = section?.querySelector('[data-video-status]');
  if (!section || !video) return;

  const desktop = matchMedia('(min-width: 981px)').matches;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData === true;
  video.src = desktop && !reducedMotion && !saveData
    ? SITE_CONFIG.media.experienceVideo
    : SITE_CONFIG.media.experienceMobileVideo;
  video.preload = desktop && !reducedMotion && !saveData ? 'auto' : 'metadata';

  video.addEventListener('error', () => {
    if (status) status.textContent = 'Vídeo indisponível. O conteúdo permanece acessível.';
    video.hidden = true;
  }, { once: true });

  if (!desktop || reducedMotion || saveData) {
    video.controls = !saveData;
    return;
  }

  video.addEventListener('loadedmetadata', () => {
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    gsap.fromTo(video, { currentTime: .01 }, {
      currentTime: Math.max(.02, video.duration - .04),
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true }
    });
    document.querySelectorAll('[data-experience-step]').forEach((step) => {
      gsap.fromTo(step, { opacity: .24, y: 28 }, {
        opacity: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: step, start: 'top 75%', end: 'top 43%', scrub: .6 }
      });
    });
  }, { once: true });
}
