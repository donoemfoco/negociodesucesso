# Dono em Foco

Portal em português com calculadoras gratuitas, guias por nicho e diretório local para negócios de serviços.

## Conteúdo gerado

- 9 calculadoras nacionais e 2 guias editoriais;
- 9 guias para os nichos atendidos pelo AgendZap;
- diretório de 27 unidades da Federação;
- uma página por localidade retornada pela API do IBGE (5.571 na consulta registrada), com dados de localidade e população de 2024 quando disponíveis;
- calculadora de capacidade semanal da agenda nas páginas locais;
- links para `agendzap.com.br` e para o plano grátis, que exibe anúncios.

Os dados municipais são salvos em `src/data/municipalities.json`. Para atualizá-los, rode `node scripts/download-municipalities.mjs` e depois gere o site.

## Desenvolvimento

Requer Node.js 22 ou mais recente. Não há dependências de aplicação.

    node scripts/build.mjs

O resultado fica em `dist/`. O build gera as rotas, HTML, arquivos de navegação e `sitemap.xml`.

É possível informar o endereço público antes do build, para que canônicos, sitemap e links usem o host correto:

    $env:SITE_ORIGIN = "https://SEU-PROJETO.pages.dev"
    $env:SITE_BASE_PATH = ""
    node scripts/build.mjs

## Hospedagem

O domínio `donoemfoco.github.io/negociodesucesso/` continua apontando para a implantação anterior. O GitHub Pages não permite que o plano gratuito seja usado como hospedagem de um site voltado principalmente à captação comercial ou SaaS; por isso, esta versão grande não deve ser implantada por aquele fluxo.

Para publicar em Cloudflare Pages, autentique o Wrangler com `npx wrangler login`, crie um projeto Pages e publique a pasta `dist` com `npx wrangler pages deploy dist --project-name=SEU-PROJETO`. O plano Free da Cloudflare Pages permite até 20.000 arquivos por site; o build atual gera 5.629 arquivos. Defina `SITE_ORIGIN` para o domínio Pages escolhido antes de gerar o sitemap final.

## Privacidade e fontes

As calculadoras processam valores no navegador; não os enviam ao site. As localidades vêm da API de Localidades do IBGE e a população, quando informada, da estimativa municipal 2024 do IBGE. Nenhuma página afirma uma procura, preço, concorrência ou presença comercial local que não esteja documentada.
