import { SITE_CONFIG } from '../../config/site.js';

function whatsappUrl(message = SITE_CONFIG.contact.whatsappMessage) {
  return `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function initContact() {
  document.querySelectorAll('[data-contact="whatsapp"]').forEach((link) => { link.href = whatsappUrl(); });
  document.querySelectorAll('[data-contact="phone"]').forEach((link) => { link.href = `tel:+${SITE_CONFIG.contact.phone}`; });
  document.querySelectorAll('[data-contact="additional-phone"]').forEach((link) => { link.href = `tel:+${SITE_CONFIG.contact.additionalPhone}`; });
  document.querySelectorAll('[data-contact="instagram"]').forEach((link) => { link.href = SITE_CONFIG.contact.instagramUrl; });
  document.querySelectorAll('[data-contact="maps"]').forEach((link) => { link.href = SITE_CONFIG.contact.mapsUrl; });
  document.querySelectorAll('[data-contact="address"]').forEach((element) => { element.textContent = SITE_CONFIG.contact.address; });
  document.querySelectorAll('[data-contact-label="whatsapp"]').forEach((element) => { element.textContent = SITE_CONFIG.contact.whatsappLabel; });
  document.querySelectorAll('[data-contact-label="phone"]').forEach((element) => { element.textContent = SITE_CONFIG.contact.phoneLabel; });
  document.querySelectorAll('[data-contact-label="additional-phone"]').forEach((element) => { element.textContent = SITE_CONFIG.contact.additionalPhoneLabel; });
  document.querySelectorAll('[data-contact-label="address"]').forEach((element) => { element.textContent = SITE_CONFIG.contact.address; });
  document.querySelectorAll('[data-contact-label="instagram"]').forEach((element) => { element.textContent = `@${SITE_CONFIG.contact.instagram}`; });
  document.querySelectorAll('[data-brand="legal-name"]').forEach((element) => { element.textContent = SITE_CONFIG.brand.legalName; });
  document.querySelectorAll('[data-brand="cnpj"]').forEach((element) => { element.textContent = SITE_CONFIG.brand.cnpj; });
  document.querySelectorAll('[data-developer="name"]').forEach((element) => { element.textContent = SITE_CONFIG.developer.name; });
  document.querySelectorAll('[data-developer="link"]').forEach((element) => { element.href = SITE_CONFIG.developer.url; });
  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  const floatingButton = document.querySelector('.whatsapp-float');
  const floatingObstructions = document.querySelectorAll('.contact, .footer');
  if (floatingButton && floatingObstructions.length && 'IntersectionObserver' in window) {
    const visibleObstructions = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting ? visibleObstructions.add(entry.target) : visibleObstructions.delete(entry.target));
      floatingButton.classList.toggle('is-hidden', visibleObstructions.size > 0);
    }, { threshold: 0.08 });
    floatingObstructions.forEach((element) => observer.observe(element));
  }

  const form = document.querySelector('[data-contact-form]');
  const status = form?.querySelector('[data-form-status]');
  if (!form || !status) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.botcheck) return;
    const interest = data.interesse || 'uma avaliação inicial';
    const message = `Olá! Meu nome é ${data.nome}. Gostaria de agendar uma consulta sobre ${interest}. Meu telefone é ${data.telefone}.`;
    status.dataset.state = '';
    status.textContent = 'Abrindo o WhatsApp para concluir o agendamento…';
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
  });
}
