# Ativos visuais, origem e autorização

Inventário revisado em 19/09/2026 para a direção editorial clínica aprovada.

| Ativo publicado | Origem | Tratamento | Estado de uso |
|---|---|---|---|
| `public/assets/logo/logo-centro-odontomedico.svg` | `media/Instagram/logo_1/logo_2.png` | reconstrução vetorial fiel, dourada, sem autotrace | autorizado |
| `public/assets/logo/logo-centro-odontomedico-mono.svg` | mesma referência | variante monocromática | autorizado |
| `public/favicon.svg` | símbolo vetorial reconstruído | favicon simplificado | autorizado |
| `public/assets/video/hero_1.mp4` | `media/Instagram/hero_1/hero_1.mp4` | sem áudio, 30 fps, H.264, faststart, até 720px | autorizado |
| `public/assets/video/hero_1_poster.jpg` | vídeo da hero | poster estático | autorizado |
| `public/assets/video/hero_2_scrub.mp4` | `media/Instagram/hero_2/sugestao_hero_2.mp4` | sem áudio, 30 fps, GOP curto para scrub | autorizado |
| `public/assets/video/hero_2.mp4` | mesma origem | versão proporcional para telas menores | autorizado |
| `public/assets/team/*` | `media/funcionarios/*` | cópias fornecidas para o corpo clínico | autorizado para a página |
| `public/assets/fonts/manrope-latin-wght-normal.woff2` | Fontsource, família Manrope | arquivo variável latino auto-hospedado | SIL Open Font License 1.1 |

## Casos clínicos — derivados não publicados

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

- Não há autorização de domínio, deploy, analytics ou serviço externo de formulário.
- Contatos e caminhos de mídia publicados vêm de `SITE_CONFIG`.
- O site permanece com `noindex,nofollow` até uma autorização de publicação separada.
- Nenhum e-mail, horário, CRO ou claim não confirmado foi publicado.

Referências regulatórias registradas no plano aprovado: [Resolução CFO 196/2019](https://website.cfo.org.br/wp-content/uploads/2019/01/Resolu%C3%A7%C3%A3o-CFO-196-2019.pdf) e [orientação ética do CFO](https://website.cfo.org.br/etica-para-cirurgioes-dentistas-recem-formados-principais-pontos-de-atencao/).
