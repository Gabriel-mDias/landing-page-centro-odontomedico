---
tipo_documento: direção_criativa
versão_esquema: 2
nome_cliente: Centro Odontomédico
arquétipo_primário: institucional
arquétipo_secundário: não_aplicável
objetivo_de_conversão: agendamento_whatsapp
cta_primário: Agendar Consulta
tipo_cta_primário: falar_com_empresa
modelo_narrativo: posicionamento > capacidade > reputação
foco_de_prova: história, liderança, operação, números confirmados
cta_acima_da_dobra_quantidade: 1
cta_secundário_compete: false
hero_solicitada: híbrida
hero_modalidade: híbrida
hero_justificativa: Vídeo demonstra a experiência no desktop e poster preserva desempenho e conforto no mobile
hero_autorização: aprovado
hero_poster: public/assets/video/hero_1_poster.jpg
hero_sem_áudio: true
hero_muted: true
hero_playsinline: true
hero_duração_curta: true
hero_overlay_contraste: true
hero_fallback_erro: true
hero_redução_movimento: true
hero_mobile_estático: true
hero_tamanho_mb: 5.5
hero_fallback_motivo: Poster no mobile, economia de dados, movimento reduzido e falha de vídeo
paleta_estado: inferido
paleta_fonte: Proposta editorial clínica aprovada pelo usuário
paleta_consultado_em: 2026-09-19
paleta_contexto: Refatoração premium
paleta_autorização: aprovado
tipografia_estado: inferido
tipografia_fonte: Manrope via Fontsource
tipografia_consultado_em: 2026-09-19
tipografia_contexto: Arquivo variável auto-hospedado
tipografia_licença: OFL-1.1
tipografia_autorização: aprovado
frase_central_estado: confirmado
frase_central_fonte: Usuário
frase_central_consultado_em: 2026-09-19
frase_central_contexto: Briefing aprovado
frase_central_autorização: aprovado
aprovação_arquétipo: aprovado
aprovação_hero: aprovado
aprovação_paleta: aprovado
aprovação_tipografia: aprovado
aprovação_frase_central: aprovado
aprovação_seções: aprovado
aprovação_cta: aprovado
aprovado_por: Usuário
aprovado_em: 2026-09-19
---

# Direção criativa — editorial clínico

## Parâmetros

- `DESIGN_VARIANCE: 7`
- `MOTION_INTENSITY: 6`
- `VISUAL_DENSITY: 4`
- Linguagem: preto mineral, grafite, dourado fosco, composição assimétrica e movimento controlado.

## Narrativa aprovada

1. Hero híbrida assimétrica.
2. Faixa de prova.
3. “Jornada do cuidado”: quatro painéis editoriais em zigue-zague, em fluxo normal, com fotografias derivadas de mídia própria autorizada.
4. Especialidades em índice interativo.
5. Equipe em carrossel de largura variável.
6. Casos clínicos tecnicamente prontos, mas não renderizados enquanto incompletos.
7. FAQ.
8. Contato.
9. Footer.

A navegação permanece fora da contagem e conserva as âncoras `#hero`, `#jornada`, `#especialidades`, `#equipe`, `#duvidas` e `#contato`.

## Hero

- Frase central: “Invista no seu sorriso!”
- Um único CTA acima da dobra: “Agendar Consulta”.
- Desktop/tablet: vídeo otimizado, máscara lateral e overlay sólido de fallback.
- Mobile, economia de dados e movimento reduzido: poster, fade vertical e nenhum download do vídeo.
- Falha de mídia: poster continua legível; conteúdo nunca depende do autoplay.

## Sistema visual

| Papel | Valor |
|---|---|
| Fundo | `#0A0A0A` |
| Superfície | `#151515` |
| Acento único | `#C6A15B` |
| Texto principal | `#F2F0EA` |
| Texto secundário | `#AAA69D` |
| Raio | `12px` |
| Fonte | Manrope variável auto-hospedada, fallback de sistema |

## Interações

- Especialidades: hover/foco atualiza painel no desktop; ativação abre detalhe; “Ver detalhes” permanece visível no mobile.
- Equipe: scroll fluido, controles acessíveis, ação permanente no mobile e Eye da linguagem Phosphor no desktop.
- Detalhes: controlador compartilhado com `<dialog>`, painel lateral à direita no desktop e tela cheia no mobile.
- Jornada: quatro painéis editoriais em fluxo normal; imagem e texto alternam os lados no desktop e tablet, enquanto no mobile o texto ocupa o fade escuro na base da fotografia. Há somente fade de entrada pelo sistema global, sem pinning, scrub, parallax, órbitas, contador ou troca de mídia por scroll.
- Movimento reduzido: sem smooth scroll, scrub, parallax ou autoplay.

## Jornada do cuidado

- Introdução: “A jornada do cuidado”.
- Título: “Tudo começa quando você é ouvido.”
- Sequência aprovada: Escuta / Presença, Direcionamento / Clareza, Cuidado integrado / Integração e Continuidade / Responsabilidade.
- Seleção visual aprovada por tópico a partir de `media/home`: retrato atento do Dr. Mayson em Escuta; recepção em Direcionamento; consultório com áreas de conversa e atendimento em Cuidado integrado; e consultório preparado em Continuidade.
- Os derivados 4:3 preservam AVIF/WebP, lazy loading e recorte responsivo; no mobile, o enquadramento central mantém o assunto legível sob o fade escuro.
- Nenhum vídeo antigo do sorriso integra ou é requisitado pela seção.

## Casos clínicos

O catálogo e os derivados MP4/WebM/poster serão entregues, mas a seção permanece oculta. Cada item exige autoria, CRO, confirmação de TCLE e `publication_state: ready` antes de poder ser habilitado. A validação de publicação recusa qualquer caso incompleto ou indiscriminadamente ativado.

## Aprovação formal

A revisão editorial clínica, sua paleta, Manrope, frase central, hero híbrida, reconstrução fiel do símbolo, ordem de seções, CTA “Agendar Consulta” e a substituição da cena orbital pela jornada em zigue-zague foram aprovadas pelo usuário em 19/09/2026.
