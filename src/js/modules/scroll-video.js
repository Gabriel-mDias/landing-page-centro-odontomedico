import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SITE_CONFIG } from '../../config/site.js';

gsap.registerPlugin(ScrollTrigger);

export function initScrollVideo() {
  const section = document.querySelector('.experience');
  const video = section?.querySelector('[data-experience-video]');
  const status = section?.querySelector('[data-video-status]');
  const counter = section?.querySelector('[data-experience-counter]');
  const progress = section?.querySelector('[data-experience-progress]');
  const deck = section?.querySelector('[data-experience-deck]');
  const steps = Array.from(section?.querySelectorAll('[data-experience-step]') || []);

  if (!section || !video) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData === true;

  video.src = SITE_CONFIG.media.experienceVideo;
  video.preload = reducedMotion || saveData ? 'metadata' : 'auto';

  video.addEventListener('error', () => {
    if (status) status.textContent = 'Vídeo indisponível. O conteúdo permanece acessível.';
    video.hidden = true;
  }, { once: true });

  if (reducedMotion || saveData) {
    video.controls = !saveData;
    if (deck) deck.classList.add('is-static');
    steps.forEach((step) => {
      step.classList.add('is-active');
      step.style.opacity = '1';
      step.style.transform = 'none';
      step.style.pointerEvents = 'auto';
    });
    return;
  }

  function setupAnimation() {
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;

    // Reset initial step states
    steps.forEach((step, idx) => {
      if (idx === 0) {
        step.style.opacity = '1';
        step.style.transform = 'translateY(0)';
        step.style.pointerEvents = 'auto';
      } else {
        step.style.opacity = '0';
        step.style.transform = 'translateY(35px)';
        step.style.pointerEvents = 'none';
      }
    });

    const scrollDistance = () => Math.max(window.innerHeight * 2.4, 1800);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${scrollDistance()}`,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          const activeStep = p >= 0.64 ? 3 : p >= 0.32 ? 2 : 1;
          if (counter && counter.textContent !== `0${activeStep}`) {
            counter.textContent = `0${activeStep}`;
          }
          steps.forEach((step, idx) => {
            step.style.pointerEvents = idx === (activeStep - 1) ? 'auto' : 'none';
          });
        }
      }
    });

    // Scrub video smoothly across entire scroll
    tl.fromTo(video, 
      { currentTime: 0.01 }, 
      { currentTime: Math.max(0.04, video.duration - 0.06), ease: 'none', duration: 3 }, 
      0
    );

    // Progress bar fill from 15% to 100%
    if (progress) {
      tl.fromTo(progress, 
        { width: '15%' }, 
        { width: '100%', ease: 'none', duration: 3 }, 
        0
      );
    }

    // Step 0: starts visible, exits upwards around t=0.75 - 1.05
    if (steps[0]) {
      tl.to(steps[0], { opacity: 0, y: -35, ease: 'power2.inOut', duration: 0.3 }, 0.75);
    }

    // Step 1: enters from bottom t=0.95 - 1.25, stays until t=1.75, exits upwards t=1.75 - 2.05
    if (steps[1]) {
      tl.fromTo(steps[1], 
        { opacity: 0, y: 35 }, 
        { opacity: 1, y: 0, ease: 'power2.inOut', duration: 0.3 }, 
        0.95
      );
      tl.to(steps[1], { opacity: 0, y: -35, ease: 'power2.inOut', duration: 0.3 }, 1.75);
    }

    // Step 2: enters from bottom t=1.95 - 2.25, remains in focus till the end
    if (steps[2]) {
      tl.fromTo(steps[2], 
        { opacity: 0, y: 35 }, 
        { opacity: 1, y: 0, ease: 'power2.inOut', duration: 0.3 }, 
        1.95
      );
    }
  }

  if (video.readyState >= 1) {
    setupAnimation();
  } else {
    video.addEventListener('loadedmetadata', setupAnimation, { once: true });
    // Fallback in case loadedmetadata already fired or cached
    video.addEventListener('canplay', setupAnimation, { once: true });
  }
}
