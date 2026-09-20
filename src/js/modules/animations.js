import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData === true;
  if (reducedMotion || saveData) {
    document.querySelectorAll('[data-reveal]').forEach((element) => element.classList.add('is-visible'));
    return null;
  }

  const lenis = new Lenis({ duration: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  gsap.utils.toArray('[data-reveal]').forEach((element) => {
    gsap.fromTo(element, { opacity: 0, y: 28 }, {
      opacity: 1,
      y: 0,
      duration: .9,
      ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 91%', once: true }
    });
  });

  gsap.to('.hero-media', {
    yPercent: 7,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 }
  });
  return lenis;
}
