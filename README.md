# Centro Odontomédico — landing page

Protótipo público da landing page do Centro Odontomédico, em Bom Jesus do Itabapoana — RJ. A experiência apresenta a jornada de cuidado, especialidades, corpo clínico, cinco comparativos institucionais e contato centralizado pelo WhatsApp.

## Estado da publicação

- Publicação: GitHub Pages em `https://gabriel-mdias.github.io/landing-page-centro-odontomedico/`.
- Indexação: desativada por `noindex,nofollow` e `robots.txt` com `Disallow: /` enquanto o endereço for um protótipo.
- Conversão principal: “Agendar Consulta” pelo WhatsApp.
- Formulário: prepara uma mensagem localmente e abre o WhatsApp; não envia dados a serviço externo.
- Analytics, pixels e backend de formulário: desativados.

## Desenvolvimento

Requisitos: Node.js 22, npm, Python 3.10+ e Chrome ou Chromium para o smoke test.

```bash
npm install
npm run dev
```

Validação completa:

```bash
npm test
npm run validate:publication
npm run build
npm run preview
npm run smoke -- http://127.0.0.1:4173/
```

O smoke test cobre 390, 768 e 1440 px, teclado, diálogos, mídia reduzida, economia de dados, fallbacks e integridade visual básica. As fontes e autorizações dos ativos estão em [docs/ativos-e-licencas.md](docs/ativos-e-licencas.md).

## Estrutura

- `src/config/site.js`: identidade legal, contatos, WhatsApp, desenvolvedora e caminhos de mídia.
- `index.html`: conteúdo semântico, SEO e estrutura da página.
- `src/styles/`: sistema visual e responsividade.
- `src/js/modules/`: interações acessíveis e integrações locais.
- `public/assets/`: derivados autorizados para publicação.
- `media/`: fontes brutas fornecidas pelo cliente; nem todo arquivo é publicado.
- `requisitos/`: briefing e direção criativa aprovados.
- `.assets/`: manifest e caches locais do workflow, ignorados pelo Git.

## Publicação

Pull requests executam o workflow `Quality`. Após merge na `main`, `Deploy GitHub Pages` valida novamente, gera `dist/` e publica o artefato. O protótipo deve permanecer sem indexação até nova autorização explícita.
