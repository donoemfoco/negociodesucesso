# Dono em Foco

Site estático em português com nove calculadoras originais e guias de conteúdo para negócios locais.

## Desenvolvimento

Requer Node.js 22 ou mais recente. O projeto não usa dependências externas.

    node scripts/build.mjs

O site gerado fica em `dist/`. A publicação é feita pelo GitHub Actions em cada atualização da branch `main`.
Todas as páginas oferecem o plano grátis do AgendZap e também têm links contextuais para `agendzap.com.br`.

## Publicação

O repositório público é `donoemfoco/negociodesucesso`; o endereço do projeto é:

https://donoemfoco.github.io/negociodesucesso/

O endereço base pertence ao usuário do GitHub `donoemfoco`. Para mudar a base do projeto, ajuste `src/site.mjs` e publique novamente.

## Privacidade

As entradas das calculadoras são processadas no navegador do visitante. O projeto não envia nem armazena os valores calculados. O botão de cadastro externo leva ao AgendZap e informa que o serviço gratuito exibe anúncios.
