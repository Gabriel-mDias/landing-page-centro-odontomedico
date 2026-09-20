import '../styles/main.css';
import { initAnimations } from './modules/animations.js';
import { initNavigation } from './modules/navigation.js';
import { initContact } from './modules/contact.js';
import { initFaq } from './modules/faq.js';
import { initHeroMedia } from './modules/hero-media.js';
import { initDialog } from './modules/detail-dialog.js';
import { initProfessionalPreview } from './modules/professional-preview.js';
import { initSpecialties } from './modules/specialties.js';
import { initCases } from './modules/cases.js';
import { initBeforeAfter } from './modules/before-after.js';

async function bootstrap() {
  initDialog();
  const lenis = initAnimations();
  initNavigation(lenis);
  initContact();
  initFaq();
  initHeroMedia();
  await initProfessionalPreview();
  initSpecialties();
  initBeforeAfter();
  await initCases();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootstrap);
else bootstrap();
