export const SITE_CONFIG = {
  brand: {
    name: 'Centro Odontomédico',
    legalName: 'Centro Odontológico Muzi Ltda.',
    cnpj: '26.721.825/0001-99',
    niche: 'Odontologia multidisciplinar',
    city: 'Bom Jesus do Itabapoana',
    state: 'RJ'
  },
  contact: {
    whatsapp: '5522998155861',
    whatsappLabel: '(22) 99815-5861',
    whatsappMessage: 'Olá! Conheci o Centro Odontomédico pelo site e gostaria de agendar uma consulta.',
    phone: '552238311733',
    phoneLabel: '(22) 3831-1733',
    additionalPhone: '5522999179701',
    additionalPhoneLabel: '(22) 99917-9701',
    address: 'Rua XV de Novembro, 360, Centro, Bom Jesus do Itabapoana - RJ, 28360-000',
    instagram: 'centroodontomedico_',
    instagramUrl: 'https://www.instagram.com/centroodontomedico_/',
    mapsUrl: 'https://share.google/fBMa2KjSdsbvcKEAP',
    email: null
  },
  media: {
    heroVideo: './assets/video/hero_1.mp4',
    heroPoster: './assets/video/hero_1_poster.jpg',
    journey: [
      { role: 'escuta', principle: 'Presença', src: './assets/journey/escuta.webp', source: 'media/home/dr_mayson_com_atencao.png', alt: 'Dr. Mayson em retrato atento no Centro Odontomédico' },
      { role: 'direcionamento', principle: 'Clareza', src: './assets/journey/direcionamento.webp', source: 'media/home/recepção.png', alt: 'Recepção do Centro Odontomédico, ponto inicial de orientação para o atendimento' },
      { role: 'cuidado-integrado', principle: 'Integração', src: './assets/journey/integracao.webp', source: 'media/home/consultorio_2.png', alt: 'Consultório do Centro Odontomédico com áreas de conversa e atendimento integradas' },
      { role: 'continuidade', principle: 'Responsabilidade', src: './assets/journey/continuidade.webp', source: 'media/home/consultorio_1.png', alt: 'Consultório preparado para dar continuidade ao cuidado no Centro Odontomédico' }
    ],
    casesCatalog: './assets/cases/cases.json'
  },
  form: {
    provider: 'whatsapp',
    accessKey: '',
    subject: 'Novo contato pelo site — Centro Odontomédico'
  },
  developer: {
    name: 'G&Ms Soluções Tecnológicas',
    url: 'https://gems.tec.br/'
  }
};
