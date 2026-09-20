export function initNavigation(lenis) {
  const header = document.querySelector('[data-header]');
  const button = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu]');

  const close = () => {
    menu?.removeAttribute('data-open');
    button?.setAttribute('aria-expanded', 'false');
  };
  const updateHeader = () => header?.classList.toggle('is-scrolled', scrollY > 12);
  addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  button?.addEventListener('click', () => {
    const opening = !menu?.hasAttribute('data-open');
    menu?.toggleAttribute('data-open', opening);
    button.setAttribute('aria-expanded', String(opening));
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const selector = link.getAttribute('href');
      if (!selector || selector === '#') return;
      const target = document.querySelector(selector);
      if (!target) return;
      event.preventDefault();
      close();
      if (lenis) lenis.scrollTo(target, { offset: -68, duration: .9 });
      else target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  });
}
