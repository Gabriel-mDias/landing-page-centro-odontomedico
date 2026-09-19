import { openDetail } from './detail-dialog.js';

export const SPECIALTIES_DATA = [
  { id: 'implantodontia-cirurgia', title: 'Implantodontia e cirurgia bucomaxilofacial', description: 'Áreas relacionadas a implantes, cirurgia oral e cirurgia e traumatologia bucomaxilofacial, conforme as formações apresentadas pela equipe.', professionals: ['Dr. Mayson Muzi', 'Dr. Guilherme Lengrubber', 'Dr. Vinicius Femeedes'] },
  { id: 'ortodontia', title: 'Ortodontia e ortopedia dos maxilares', description: 'Acompanhamento ortodôntico e áreas de ortopedia funcional dos maxilares apresentadas pelo corpo clínico.', professionals: ['Dra. Ravenna Souza', 'Dra. Cinthya Rangel', 'Dr. Mayson Muzi'] },
  { id: 'hof', title: 'Harmonização orofacial', description: 'Área de atuação em harmonização orofacial e saúde estética apresentada por profissionais da equipe.', professionals: ['Dr. Vinicius Femeedes', 'Dra. Anna Luiza Campos'] },
  { id: 'endodontia', title: 'Endodontia', description: 'Atendimento na área de endodontia, incluindo profissionais com especialização, mestrado e formação em andamento.', professionals: ['Dra. Viviane Couto', 'Dra. Késia Amorim', 'Dra. Anna Luiza Campos'] },
  { id: 'protese-dentistica', title: 'Prótese e dentística', description: 'Áreas relacionadas a prótese, dentística e reabilitação oral, conforme o catálogo do corpo clínico.', professionals: ['Dra. Nayara Salvato', 'Dra. Gabrielly', 'Dra. Cinthya Rangel'] },
  { id: 'odontopediatria', title: 'Odontopediatria', description: 'Atendimento odontológico voltado ao público infantil, apresentado como área de especialização e formação da equipe.', professionals: ['Dra. Cinthya Rangel'] },
  { id: 'anestesiologia', title: 'Anestesiologia', description: 'Acompanhamento médico anestésico relacionado aos procedimentos realizados pela clínica.', professionals: ['Dr. Fernando Basílio'] },
  { id: 'radiologia', title: 'Radiologia oral e imaginologia', description: 'Área relacionada a exames e laudos radiológicos para apoio ao diagnóstico e planejamento clínico.', professionals: ['Dra. Viviane Couto', 'Dra. Ravenna Souza'] }
].map((item, index) => ({ ...item, number: String(index + 1).padStart(2, '0') }));

function previewMarkup(item) {
  return `<span class="specialty-preview__number">${item.number} / ${String(SPECIALTIES_DATA.length).padStart(2, '0')}</span><h3>${item.title}</h3><p>${item.description}</p><ul>${item.professionals.map((name) => `<li>${name}</li>`).join('')}</ul>`;
}

function openSpecialty(item, trigger) {
  openDetail({
    trigger,
    html: `<span class="dialog-kicker">Especialidade · ${item.number}</span><h2 id="detail-title">${item.title}</h2><p>${item.description}</p><h3>Profissionais relacionados</h3><ul class="dialog-list">${item.professionals.map((name) => `<li>${name}</li>`).join('')}</ul>`
  });
}

export function initSpecialties() {
  const index = document.getElementById('specialties-index');
  const preview = document.getElementById('specialty-preview');
  if (!index || !preview) return;
  index.innerHTML = SPECIALTIES_DATA.map((item, position) => `<button class="specialty-row${position === 0 ? ' is-active' : ''}" type="button" data-specialty="${item.id}"><span class="specialty-row__number">${item.number}</span><span class="specialty-row__title">${item.title}</span><span class="specialty-row__action">Ver detalhes</span></button>`).join('');
  preview.innerHTML = previewMarkup(SPECIALTIES_DATA[0]);

  const activate = (item, button) => {
    index.querySelectorAll('.specialty-row').forEach((row) => row.classList.toggle('is-active', row === button));
    preview.innerHTML = previewMarkup(item);
  };
  index.querySelectorAll('[data-specialty]').forEach((button) => {
    const item = SPECIALTIES_DATA.find((candidate) => candidate.id === button.dataset.specialty);
    if (!item) return;
    button.addEventListener('mouseenter', () => activate(item, button));
    button.addEventListener('focus', () => activate(item, button));
    button.addEventListener('click', () => openSpecialty(item, button));
  });
}
