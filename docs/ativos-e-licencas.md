# Ativos visuais, origem e autorização

Inventário revisado em 19/09/2026 para a direção editorial clínica aprovada.

| Ativo publicado | Origem | Tratamento | Estado de uso |
|---|---|---|---|
| `public/assets/logo/logo-centro-odontomedico.svg` | `media/Instagram/logo_1/logo_2.svg` | arte vetorial oficial; remoção exclusiva de metadados Inkscape e fundo técnico | autorizado |
| `public/favicon.svg` | `media/Instagram/logo_1/logo_2.svg` | mesma arte vetorial oficial e mesmo tratamento técnico | autorizado |
| `public/assets/video/hero_1.mp4` | `media/Instagram/hero_1/hero_1.mp4` | sem áudio, 30 fps, H.264, faststart, até 720px | autorizado |
| `public/assets/video/hero_1_poster.jpg` | vídeo da hero | poster estático | autorizado |
| `public/assets/journey/escuta.{avif,webp}` | `media/home/dr_mayson_com_atencao.png` | recorte 4:3 do retrato atento do Dr. Mayson; presença e escuta | autorizado pelo usuário para a seção de cultura/jornada |
| `public/assets/journey/direcionamento.{avif,webp}` | `media/home/recepção.png` | recorte 4:3 da recepção; acolhimento e orientação inicial | autorizado pelo usuário para a seção de cultura/jornada |
| `public/assets/journey/integracao.{avif,webp}` | `media/home/consultorio_2.png` | recorte 4:3 do consultório com áreas de conversa e atendimento; integração | autorizado pelo usuário para a seção de cultura/jornada |
| `public/assets/journey/continuidade.{avif,webp}` | `media/home/consultorio_1.png` | recorte 4:3 do consultório preparado; continuidade do cuidado | autorizado pelo usuário para a seção de cultura/jornada |
| `public/assets/team/*` | `media/funcionarios/*` | onze cópias byte a byte das versões revisadas, 1055 × 1491 px; igualdade conferida por SHA-256 | autorizado para a página |
| `public/assets/fonts/manrope-latin-wght-normal.woff2` | Fontsource, família Manrope | arquivo variável latino auto-hospedado | SIL Open Font License 1.1 |

## Resultados e catálogo clínico

Os cinco comparativos estáticos exibidos em `#resultados` tiveram autorização confirmada pelo usuário e são atribuídos institucionalmente ao Centro Odontológico Muzi Ltda., CNPJ 26.721.825/0001-99. A interface informa que os resultados são individuais e podem variar. A confirmação do usuário em 19/09/2026 é o registro documental desta publicação de protótipo.

O catálogo detalhado em vídeo abaixo continua bloqueado enquanto não houver profissional e CRO individuais. Os arquivos derivados podem existir para preparação técnica, mas não são renderizados.

Os oito conjuntos abaixo geram poster, MP4 e WebM em `public/assets/cases/`. Todos permanecem com `enabled: false` em `cases.json` e a seção não é renderizada. A presença do derivado não constitui autorização de publicação.

| ID | Origem local | Derivados | Pendência obrigatória |
|---|---|---|---|
| `clareamento-01` | `media/Instagram/clareamento_1` | JPG, MP4, WebM | autoria, CRO e TCLE |
| `clareamento-02` | `media/Instagram/clareamento_2` | JPG, MP4, WebM | autoria, CRO e TCLE |
| `preenchimento-facial-01` | `media/Instagram/preenchimento_facial_1` | JPG, MP4, WebM | autoria, CRO e TCLE |
| `preenchimento-labial-01` | `media/Instagram/preenchimento_labial_1` | JPG, MP4, WebM | autoria, CRO e TCLE |
| `preenchimento-labial-02` | `media/Instagram/preenchimento_labial_2` | JPG, MP4, WebM | autoria, CRO e TCLE |
| `reabilitacao-protese-01` | `media/Instagram/reabilitacao_protese_1` | JPG, MP4, WebM | autoria, CRO e TCLE |
| `rinomodelacao-01` | `media/Instagram/rineomodelacao_1` | JPG, MP4, WebM | autoria, CRO e TCLE |
| `tratamento-dental-01` | `media/Instagram/tratamento_dental_1` | JPG, MP4, WebM | autoria, CRO e TCLE |

Os derivados são silenciosos, 30 fps, com dimensão máxima de 1080px, reprodução desacelerada para 0,75x, H.264 com `faststart` e WebM VP9. `scripts/validate-cases.mjs` impede a ativação de qualquer item sem os campos regulatórios completos.

## Restrições operacionais

- O deploy do protótipo no GitHub Pages está autorizado. Não há autorização para domínio definitivo, indexação, analytics ou serviço externo de formulário.
- Contatos e caminhos de mídia publicados vêm de `SITE_CONFIG`.
- Os quatro derivados da jornada têm 720 × 540 px, AVIF/WebP e menos de 50 KB cada. Vieram do acervo `media/home`, fornecido pelo usuário para esta seção, não vêm do Google Maps e não exibem pacientes. O retrato identifica o Dr. Mayson conforme a indicação explícita do usuário.
- O site permanece com `noindex,nofollow` e `Disallow: /` durante a publicação do protótipo.
- Nenhum e-mail, horário, CRO ou claim não confirmado foi publicado.

Referências regulatórias registradas no plano aprovado: [Resolução CFO 196/2019](https://website.cfo.org.br/wp-content/uploads/2019/01/Resolu%C3%A7%C3%A3o-CFO-196-2019.pdf) e [orientação ética do CFO](https://website.cfo.org.br/etica-para-cirurgioes-dentistas-recem-formados-principais-pontos-de-atencao/).
