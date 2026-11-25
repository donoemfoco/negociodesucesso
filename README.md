# Dono em Foco

Site estático em português com calculadoras originais para negócios locais.

## Desenvolvimento

Requer Node.js 22 ou mais recente. O projeto não usa dependências externas.

    node scripts/build.mjs

O site gerado fica em `dist/`. A publicação é feita pelo GitHub Actions em cada atualização da branch `main`.

## Publicação

O nome do repositório é `dono-em-foco`; com o perfil `tonibuch23`, o endereço do projeto é:

https://tonibuch23.github.io/dono-em-foco/

O domínio personalizado deve ser configurado somente depois de registrar e controlar o domínio. Para trocar o domínio, ajuste `src/site.mjs` e publique novamente.

## Privacidade

As entradas das calculadoras são processadas no navegador do visitante. O projeto não envia nem armazena os valores calculados. O botão de cadastro externo leva ao AgendZap e informa que o serviço gratuito exibe anúncios.