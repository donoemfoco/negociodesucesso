import { mkdir, readFile, rm, writeFile, copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { site } from "../src/site.mjs";
import { tools } from "../src/catalog.mjs";
import { guides } from "../src/guides.mjs";
import { niches } from "../src/niches.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = join(root, "dist");
const esc = (s) => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const slugify = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const origin = (process.env.SITE_ORIGIN || site.origin).replace(/\/$/, "");
const base = (process.env.SITE_BASE_PATH ?? site.basePath).replace(/\/$/, "");
const url = (path) => origin + base + path;
const primaryUrl = "https://agendzap.com.br/";
const trackedFree = (medium, campaign) => site.freeUrl + "?utm_source=donoemfoco&utm_medium=" + encodeURIComponent(medium) + "&utm_campaign=" + encodeURIComponent(campaign);
const footer = '<footer class="footer"><div class="wrap footer-inner"><a href="' + base + '/">Dono em Foco</a><span><a href="' + primaryUrl + '">Conheça o AgendZap</a> · <a href="' + esc(trackedFree("footer", "site")) + '">Plano grátis</a> · Ferramentas gratuitas para negócios locais.</span></div></footer>';
const head = (title, description, canonical) => '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f6f5ef"><title>' + esc(title) + '</title><meta name="description" content="' + esc(description) + '"><link rel="canonical" href="' + esc(canonical) + '"><link rel="stylesheet" href="' + base + '/assets/styles.css"><link rel="stylesheet" href="' + base + '/assets/promo.css"></head>';
function header(campaign) {
  const href = trackedFree("header", campaign);
  return '<header class="topbar"><div class="wrap navrow"><a class="brand" href="' + base + '/"><span class="brand-mark">D</span><span>Dono em Foco</span></a><nav class="navlinks" aria-label="Navegação principal"><a class="navlink" href="' + base + '/#ferramentas">Ferramentas</a><a class="navlink" href="' + base + '/nichos/">Por nicho</a><a class="navlink" href="' + base + '/br/">Por cidade</a><a class="navlink" href="' + base + '/guias/' + '">Guias</a><a class="nav-cta" href="' + esc(href) + '">Plano grátis AgendZap</a></nav></div></header>';
}
function cta(tool) {
  const href = trackedFree("site", tool.slug);
  return '<section class="wrap cta"><div><h2>Organize seus atendimentos com o plano grátis</h2><p>Conheça a agenda online do AgendZap. O plano gratuito exibe anúncios.</p></div><a class="button" href="' + esc(href) + '" rel="noopener">Conhecer plano grátis</a></section><p class="wrap disclosure">A ferramenta desta página é aberta e não exige cadastro. O botão leva ao AgendZap, serviço independente com plano grátis e anúncios.</p>';
}
function promo(campaign) {
  const href = trackedFree("popup", campaign);
  return '<div class="promo-backdrop" id="promo-modal" aria-hidden="true"><section class="promo-dialog" role="dialog" aria-modal="true" aria-labelledby="promo-title" aria-describedby="promo-description" tabindex="-1"><button class="promo-close" type="button" aria-label="Fechar oferta">×</button><span class="eyebrow">AgendZap · plano grátis</span><h2 id="promo-title">Mais tempo para cuidar do seu negócio.</h2><p id="promo-description">Organize seus agendamentos online com o plano grátis do AgendZap. O plano gratuito exibe anúncios.</p><a class="button promo-action" href="' + esc(href) + '">Conhecer plano grátis</a><button class="promo-dismiss" type="button">Continuar usando a ferramenta</button></section></div>';
}
function page(tool) {
  const fields = tool.fields.map((f) => '<div class="field"><label for="' + esc(f.id) + '">' + esc(f.label) + '</label><div class="inputbox"><input id="' + esc(f.id) + '" name="' + esc(f.id) + '" type="number" inputmode="decimal" min="' + (f.min ?? 0) + '" ' + (f.max != null ? 'max="' + f.max + '"' : "") + ' step="' + (f.step || 1) + '" value="' + f.value + '"><span class="unit">' + esc(f.unit) + '</span></div><small class="hint">' + esc(f.hint) + '</small></div>').join("");
  const faqs = tool.faqs.map((f) => '<div class="faq"><h3>' + esc(f[0]) + '</h3><p>' + esc(f[1]) + '</p></div>').join("");
  const json = JSON.stringify({ kind: tool.kind }).replaceAll("<", "\\u003c");
  const canonical = url("/tools/" + tool.slug + "/");
  return head(tool.name + " | Dono em Foco", tool.description, canonical) +
    '<body>' + header(tool.slug) + '<main><div class="wrap tool-hero"><a class="crumb" href="' + base + '/">← Todas as ferramentas</a><div><span class="eyebrow">' + esc(tool.category) + '</span><h1>' + esc(tool.name) + '</h1><p>' + esc(tool.description) + '</p></div></div>' +
    '<div class="wrap tool-layout"><section class="panel"><h2>Informe seus números</h2><form id="calculator">' + fields + '</form><p class="disclosure">Valores processados neste navegador. Os números informados não são enviados ao site.</p></section>' +
    '<aside class="panel result-panel"><h2>Estimativa</h2><div id="results" aria-live="polite"></div><div class="privacy">Use o resultado como referência de planejamento e revise os dados antes de tomar uma decisão.</div></aside></div>' +
    '<article class="wrap content"><h2>Como usar esta calculadora</h2><p>' + esc(tool.description) + '</p><h2>Como a conta é feita</h2><p class="formula">' + esc(tool.formula) + '</p><h2>Perguntas frequentes</h2>' + faqs + '</article>' +
    cta(tool) + '</main>' + footer + promo(tool.slug) + '<script>window.TOOL=' + json + ';</script><script src="' + base + '/assets/app.js" defer></script></body></html>';
}
function guidePage(guide) {
  const sections = guide.sections.map((section) => '<section><h2>' + esc(section.heading) + '</h2>' + section.paragraphs.map((p) => '<p>' + esc(p) + '</p>').join("") +
    (section.bullets ? '<ul>' + section.bullets.map((item) => '<li>' + esc(item) + '</li>').join("") + '</ul>' : '') + '</section>').join("");
  const faqs = guide.faqs.map((f) => '<div class="faq"><h3>' + esc(f[0]) + '</h3><p>' + esc(f[1]) + '</p></div>').join("");
  const freeHref = site.freeUrl + "?utm_source=donoemfoco&utm_medium=guia&utm_campaign=" + encodeURIComponent(guide.slug);
  const canonical = url("/guias/" + guide.slug + "/");
  const related = guides.find((item) => item.slug === guide.related);
  return head(guide.title + " | Dono em Foco", guide.description, canonical) +
    '<body>' + header(guide.slug) + '<main><div class="wrap tool-hero"><a class="crumb" href="' + base + '/">← Dono em Foco</a><div><span class="eyebrow">' + esc(guide.category) + '</span><h1>' + esc(guide.title) + '</h1><p class="guide-lead">' + esc(guide.lead) + '</p></div></div>' +
    '<article class="wrap content guide-content">' + sections + '<section><h2>Conheça o AgendZap</h2><p>Para ver uma solução de agenda e atendimento para negócios locais, <a class="inline-link" href="' + esc(guide.productPath) + '">' + esc(guide.productAnchor) + '</a>.</p><p>Para experimentar sem pagar, acesse o <a class="inline-link" href="' + esc(freeHref) + '">plano grátis do AgendZap</a>. O plano gratuito exibe anúncios.</p></section><section><h2>Perguntas frequentes</h2>' + faqs + '</section>' + (related ? '<section class="related-guide"><h2>Leia também</h2><p><a class="inline-link" href="' + base + '/guias/' + related.slug + '/">' + esc(related.title) + ' →</a></p></section>' : '') + '</article>' +
    '<section class="wrap cta"><div><h2>Experimente o plano grátis do AgendZap</h2><p>Conheça a agenda online e os recursos de atendimento para negócios locais. O plano gratuito exibe anúncios.</p></div><a class="button" href="' + esc(freeHref) + '">Conhecer plano grátis</a></section>' +
    '<p class="wrap disclosure">Conteúdo informativo para ajudar a comparar opções. A ferramenta e o cadastro do AgendZap são serviços independentes do Dono em Foco.</p></main>' + footer + promo(guide.slug) + '<script src="' + base + '/assets/app.js" defer></script></body></html>';
}
const cityData = JSON.parse(await readFile(join(root, "src", "data", "municipalities.json"), "utf8"));
const stateSlug = (name) => slugify(name);
const citySlug = (city) => slugify(city.name) + "-" + city.id;
const cityPath = (city) => "/br/" + city.stateCode.toLowerCase() + "/" + citySlug(city) + "/";
const stateGroups = new Map();
for (const city of cityData.municipalities) {
  city.path = cityPath(city);
  const key = city.stateCode;
  if (!stateGroups.has(key)) stateGroups.set(key, { code: key, name: city.stateName, slug: stateSlug(city.stateName), region: city.region, cities: [] });
  stateGroups.get(key).cities.push(city);
}
const states = [...stateGroups.values()].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
const cityDirectoryHref = base + "/br/";
const nicheHubHref = base + "/nichos/";
const ibgeSource = (city) => "https://servicodados.ibge.gov.br/api/v1/localidades/municipios/" + city.id;
const moneyInputs = (fields) => fields.map((f) => '<div class="field"><label for="' + esc(f.id) + '">' + esc(f.label) + '</label><div class="inputbox"><input id="' + esc(f.id) + '" name="' + esc(f.id) + '" type="number" inputmode="decimal" min="0" ' + (f.max != null ? 'max="' + f.max + '"' : '') + ' step="' + (f.step || 1) + '" value="' + f.value + '"><span class="unit">' + esc(f.unit) + '</span></div><small class="hint">' + esc(f.hint) + '</small></div>').join("");
const statesCards = (list) => list.map((state) => '<a class="card" href="' + base + '/br/' + state.code.toLowerCase() + '/"><span class="tag">' + esc(state.region) + ' · ' + state.cities.length + ' localidades</span><h3>' + esc(state.name) + ' (' + state.code + ')</h3><p>Encontre municípios e orientações de agenda para negócios locais.</p><span class="open">Ver municípios →</span></a>').join("");
const nicheCards = (list) => list.map((niche) => '<a class="card" href="' + base + '/nichos/' + niche.slug + '/"><span class="tag">' + esc(niche.emoji + " " + niche.name) + '</span><h3>' + esc(niche.intent) + '</h3><p>' + esc(niche.focus) + '</p><span class="open">Ver orientações →</span></a>').join("");

function nichePage(niche) {
  const product = primaryUrl + "agendamento-online/" + niche.slug;
  const freeHref = trackedFree("nicho", niche.slug);
  const checklist = niche.checklist.map((item) => '<li>' + esc(item) + '</li>').join("");
  const canonical = url("/nichos/" + niche.slug + "/");
  const description = niche.focus + " Veja um roteiro para organizar a agenda e comparar opções para seu negócio.";
  return head(niche.intent + " | Dono em Foco", description, canonical) +
    '<body>' + header(niche.slug) + '<main><div class="wrap tool-hero"><a class="crumb" href="' + nicheHubHref + '">← Todos os nichos</a><div><span class="eyebrow">' + esc(niche.emoji + " " + niche.name) + '</span><h1>' + esc(niche.intent) + '</h1><p class="guide-lead">' + esc(niche.focus) + ' Este roteiro ajuda a revisar duração, disponibilidade e o caminho entre a primeira mensagem e o horário confirmado.</p></div></div>' +
    '<article class="wrap content guide-content"><section><h2>Revise a agenda antes de automatizar</h2><p>' + esc(niche.workflow) + ' Comece com uma semana real e anote quais horários geram mais perguntas, encaixes ou remarcações. Use esses registros para configurar os serviços, em vez de escolher durações no chute.</p><ul>' + checklist + '</ul></section><section><h2>Como oferecer horários claros para clientes na sua cidade</h2><p>Cadastre o nome do serviço, a duração, quem atende e os horários disponíveis. Confira o fluxo no celular e explique como confirmar, cancelar ou remarcar. Para buscas locais, mantenha o nome, endereço e horário de funcionamento do negócio atualizados nos seus canais.</p><p>Não há uma duração ou preço universal por município. Compare o seu histórico de atendimento e os custos reais antes de fazer mudanças.</p></section><section><h2>Encontre uma localidade</h2><p>Escolha uma cidade para abrir o roteiro local com ferramenta de capacidade semanal e dados municipais oficiais do IBGE.</p><p><a class="inline-link" href="' + cityDirectoryHref + '">Abrir o diretório de estados e cidades →</a></p></section><section><h2>Conheça a opção do AgendZap</h2><p><a class="inline-link" href="' + esc(product) + '">Veja o agendamento online do AgendZap para ' + esc(niche.label) + '</a> ou <a class="inline-link" href="' + esc(freeHref) + '">experimente o plano grátis com anúncios</a>.</p></section></article>' +
    '<section class="wrap cta"><div><h2>Teste o plano grátis do AgendZap</h2><p>Veja como organizar agendamentos e atendimento para ' + esc(niche.label) + '. O plano grátis exibe anúncios.</p></div><a class="button" href="' + esc(freeHref) + '">Conhecer plano grátis</a></section></main>' + footer + promo(niche.slug) + '<script src="' + base + '/assets/app.js" defer></script></body></html>';
}

function nichesIndexPage() {
  const canonical = url("/nichos/");
  return head("Agendamento online por nicho de negócio | Dono em Foco", "Orientações de agenda online para barbearia, salão de beleza, manicure, estética, pet shop, lava-car, tatuagem e outros negócios locais.", canonical) +
    '<body>' + header("nichos") + '<main><section class="wrap hero"><span class="eyebrow">Agenda para cada rotina</span><h1>Orientações por tipo de negócio local.</h1><p>Revise a duração dos serviços, a capacidade de atendimento e as etapas entre o pedido pelo WhatsApp e a reserva confirmada.</p></section><section class="wrap section"><div class="grid">' + nicheCards(niches) + '</div></section><section class="wrap cta"><div><h2>Organize seus horários com o AgendZap</h2><p>Conheça o plano grátis com anúncios para negócios locais.</p></div><a class="button" href="' + esc(trackedFree("nicho", "indice")) + '">Acessar plano grátis</a></section></main>' + footer + promo("nichos") + '<script src="' + base + '/assets/app.js" defer></script></body></html>';
}

function cityIndexPage() {
  const canonical = url("/br/");
  const count = cityData.municipalities.length.toLocaleString("pt-BR");
  return head("Cidades do Brasil: ferramentas para negócios locais | Dono em Foco", "Escolha um estado para encontrar municípios brasileiros e usar a calculadora de capacidade da agenda.", canonical) +
    '<body>' + header("cidades") + '<main><section class="wrap hero"><span class="eyebrow">Diretório local · dados do IBGE</span><h1>Ferramentas para negócios nas cidades do Brasil.</h1><p>Escolha o estado para encontrar a sua cidade. Cada roteiro local inclui uma calculadora de capacidade semanal e orientações para diferentes tipos de atendimento.</p><div class="badge-row"><span class="badge">' + count + ' localidades na fonte consultada</span><span class="badge">27 unidades da Federação</span></div></section><section class="wrap section"><div class="grid">' + statesCards(states) + '</div></section></main>' + footer + promo("diretorio-cidades") + '<script src="' + base + '/assets/app.js" defer></script></body></html>';
}

function statePage(state) {
  const canonical = url("/br/" + state.code.toLowerCase() + "/");
  const cityLinks = state.cities.map((city) => '<a class="city-link" href="' + base + city.path + '"><span>' + esc(city.name) + '</span><small>' + (city.population2024 ? Number(city.population2024).toLocaleString("pt-BR") + ' habitantes · ' : '') + 'código ' + city.id + '</small></a>').join("");
  const description = "Encontre " + state.cities.length + " localidades em " + state.name + " e consulte orientações de agenda para negócios locais.";
  return head("Cidades de " + state.name + ": guia para negócios locais | Dono em Foco", description, canonical) +
    '<body>' + header("estado-" + state.code.toLowerCase()) + '<main><div class="wrap tool-hero"><a class="crumb" href="' + cityDirectoryHref + '">← Estados do Brasil</a><div><span class="eyebrow">' + esc(state.region + " · " + state.code) + '</span><h1>Agenda e atendimento para negócios locais em ' + esc(state.name) + '</h1><p>Escolha um município para abrir a calculadora de capacidade da agenda, os dados locais do IBGE e recomendações para os nove nichos atendidos pelo AgendZap.</p></div></div><section class="wrap state-summary"><strong>' + state.cities.length + ' localidades</strong><span>Listadas por nome; códigos municipais consultados no IBGE. A estimativa populacional é de 2024 quando disponível.</span></section><section class="wrap city-list" aria-label="Municípios de ' + esc(state.name) + '">' + cityLinks + '</section><section class="wrap cta"><div><h2>Atenda seus clientes com uma agenda organizada</h2><p>Conheça o AgendZap e o plano grátis com anúncios.</p></div><a class="button" href="' + esc(trackedFree("cidade", "estado-" + state.code.toLowerCase())) + '">Conhecer plano grátis</a></section></main>' + footer + promo("estado-" + state.code.toLowerCase()) + '<script src="' + base + '/assets/app.js" defer></script></body></html>';
}

const capacityFields = [
  { id: "days", label: "Dias de atendimento por semana", unit: "dias", value: 5, step: 1, hint: "Informe os dias em que sua agenda realmente abre." },
  { id: "hours", label: "Horas disponíveis por dia", unit: "h/dia", value: 8, step: 0.5, hint: "Use o horário da equipe ou do espaço." },
  { id: "pause", label: "Pausas e bloqueios por dia", unit: "h/dia", value: 1, step: 0.25, hint: "Inclua almoço, preparação e períodos sem atendimento." },
  { id: "duration", label: "Duração média de cada horário", unit: "min", value: 45, step: 5, hint: "Use um serviço comum; serviços diferentes devem ter durações próprias." },
  { id: "booked", label: "Horários já reservados por semana", unit: "horários", value: 24, step: 1, hint: "Conte as reservas da sua agenda atual." }
];
function cityPage(city) {
  const canonical = url(city.path);
  const populationText = city.population2024 ? "A estimativa populacional do IBGE para 2024 é de " + Number(city.population2024).toLocaleString("pt-BR") + " habitantes. Esse número descreve o município; não é uma estimativa de procura por serviços." : "A API consultada não trouxe estimativa populacional para esta localidade.";
  const cityTitle = "Agenda online e WhatsApp para negócios em " + city.name + " (" + city.stateCode + ")";
  const description = "Calcule a capacidade semanal da agenda do seu negócio em " + city.name + ", " + city.stateCode + ". Orientações para barbearia, salão, beleza, estética, pet shop e outros serviços locais.";
  const nicheSections = niches.map((niche) => '<section class="local-niche"><span class="eyebrow">' + esc(niche.emoji + " " + niche.name) + '</span><h3>Agenda de ' + esc(niche.label) + ' em ' + esc(city.name) + '</h3><p>' + esc(niche.focus) + ' Em ' + esc(city.name) + ', comece revendo os horários mais pedidos e os intervalos que a equipe precisa entre serviços. ' + esc(niche.workflow) + '</p><ul>' + niche.checklist.map((item) => '<li>' + esc(item) + '</li>').join("") + '</ul><p><a class="inline-link" href="' + base + '/nichos/' + niche.slug + '/">Guia de agenda para ' + esc(niche.label) + ' →</a> · <a class="inline-link" href="' + esc(primaryUrl + "agendamento-online/" + niche.slug) + '">AgendZap para este nicho</a></p></section>').join("");
  const inputs = moneyInputs(capacityFields);
  const json = JSON.stringify({ kind: "capacity" }).replaceAll("<", "\\u003c");
  const source = '<p class="source-note">Fonte da localidade: <a href="' + ibgeSource(city) + '" rel="nofollow">IBGE, código municipal ' + city.id + '</a>. ' + esc(populationText) + '</p>';
  const localDetails = '<section class="local-facts"><h2>O que os dados locais informam</h2><p>' + esc(city.name) + ' pertence a ' + esc(city.stateName) + ' (' + esc(city.stateCode) + '), na região ' + esc(city.region) + '. O código IBGE permite distinguir este município de outros com nomes parecidos.</p><p>' + esc(populationText) + ' Use as buscas e o histórico do seu próprio negócio para entender a procura local; não deduza demanda apenas pelo tamanho da população.</p>' + source + '</section>';
  const seoChecklist = '<section><h2>Roteiro local para organizar sua agenda</h2><ol><li>Escreva os serviços e a duração que sua equipe realmente pratica.</li><li>Atualize endereço, área de atendimento e horário nos perfis que o negócio já utiliza.</li><li>Compartilhe um caminho direto para pedir horário pelo WhatsApp ou pela agenda.</li><li>Registre reservas, cancelamentos e faltas por algumas semanas antes de mudar a operação.</li><li>Revise as perguntas recebidas em ' + esc(city.name) + ' e transforme respostas repetidas em informações fáceis de encontrar.</li></ol><p>Essas etapas ajudam a comunicar a rotina real do negócio. Não existe um preço, volume de procura ou resultado garantido para toda empresa do município.</p></section>';
  const freeHref = trackedFree("cidade", city.id);
  return head(cityTitle + " | Dono em Foco", description, canonical) +
    '<body>' + header("cidade-" + city.id) + '<main><div class="wrap tool-hero"><a class="crumb" href="' + base + '/br/' + city.stateCode.toLowerCase() + '/">← Municípios de ' + esc(city.stateName) + '</a><div><span class="eyebrow">' + esc(city.region + " · " + city.stateCode) + '</span><h1>' + esc(cityTitle) + '</h1><p class="guide-lead">Roteiro para quem administra um negócio de serviços em ' + esc(city.name) + ': calcule quantos horários cabem na semana, revise os serviços e escolha um fluxo claro entre WhatsApp e agendamento.</p><div class="badge-row"><span class="badge">Código IBGE ' + city.id + '</span>' + (city.population2024 ? '<span class="badge">' + Number(city.population2024).toLocaleString("pt-BR") + ' habitantes · estimativa 2024</span>' : '') + '</div></div></div>' +
    '<div class="wrap tool-layout"><section class="panel"><h2>Calcule a capacidade semanal da agenda</h2><p>Use o número real de dias, horas e serviços do seu estabelecimento. A conta fica neste navegador.</p><form id="calculator">' + inputs + '</form><p class="disclosure">Os dados digitados não são enviados. A capacidade é uma estimativa de horários, não uma previsão de clientes.</p></section><aside class="panel result-panel"><h2>Estimativa semanal</h2><div id="results" aria-live="polite"></div><div class="privacy">Compare o resultado com a agenda real e ajuste as durações por serviço e profissional.</div></aside></div>' +
    '<article class="wrap content guide-content local-content"><section><h2>Como usar o resultado em ' + esc(city.name) + '</h2><p>Se sobra capacidade em alguns períodos e falta em outros, compare os horários pedidos com a disponibilidade que você publica. Mostre horários atualizados e crie um processo simples para confirmar, cancelar e remarcar. A calculadora não conhece a procura de ' + esc(city.name) + ': ela usa somente os dados que você informou.</p></section>' + localDetails + seoChecklist + '<section><h2>Orientações por tipo de negócio</h2><p>Os tempos e as etapas variam. Abra o bloco do seu nicho para ver uma lista de revisão específica.</p>' + nicheSections + '</section><section><h2>Usar agenda online ou automatizar o WhatsApp?</h2><p>Uma agenda online mostra disponibilidade e registra reservas; o WhatsApp pode continuar como canal de dúvidas e acompanhamento. Antes de automatizar, escreva respostas que sua equipe consegue manter e deixe uma opção para falar com uma pessoa. Compare as funções e condições diretamente.</p><p><a class="inline-link" href="' + esc(primaryUrl + "agendamento-online") + '">Conheça o agendamento online no AgendZap</a> · <a class="inline-link" href="' + esc(freeHref) + '">Acesse o plano grátis com anúncios</a>.</p></section><section><h2>Perguntas frequentes</h2><div class="faq"><h3>A população informa quantos clientes vou conseguir?</h3><p>Não. A estimativa populacional é apenas um dado municipal. Use registros de pedidos, reservas e cancelamentos do próprio negócio para avaliar procura.</p></div><div class="faq"><h3>Qual duração devo cadastrar?</h3><p>Use o tempo observado para cada serviço, incluindo preparação e finalização. Ajuste após comparar a agenda planejada com os atendimentos concluídos.</p></div><div class="faq"><h3>Esta página representa uma empresa local?</h3><p>Não. É um roteiro e uma calculadora para o responsável por um negócio em ' + esc(city.name) + '. Não é uma listagem de estabelecimentos nem uma afirmação de presença local do AgendZap.</p></div></section></article>' +
    '<section class="wrap cta"><div><h2>Experimente o plano grátis do AgendZap</h2><p>Conheça recursos de agenda e atendimento para negócios locais. O plano grátis exibe anúncios.</p></div><a class="button" href="' + esc(freeHref) + '">Acessar plano grátis</a></section></main>' + footer + promo("cidade-" + city.id) + '<script>window.TOOL=' + json + ';</script><script src="' + base + '/assets/app.js" defer></script></body></html>';
}

function guidesIndexPage() {
  const canonical = url("/guias/");
  return head("Guias de agenda online e WhatsApp | Dono em Foco", "Guias para escolher sistemas de agendamento e planejar automações úteis no WhatsApp para negócios locais.", canonical) +
    '<body>' + header("guias") + '<main><section class="wrap hero"><span class="eyebrow">Guias práticos</span><h1>Escolha e organize as ferramentas do seu negócio.</h1><p>Critérios para testar agenda online e automações de atendimento pelo WhatsApp.</p></section><section class="wrap section"><div class="grid">' + guideCards + '</div></section><section class="wrap cta"><div><h2>Conheça o AgendZap</h2><p>Agenda online e atendimento para negócios locais, com opção de plano grátis que exibe anúncios.</p></div><a class="button" href="' + esc(trackedFree("guia", "indice")) + '">Ver plano grátis</a></section></main>' + footer + promo("guias") + '<script src="' + base + '/assets/app.js" defer></script></body></html>';
}
await rm(out, { recursive: true, force: true });
await mkdir(join(out, "assets"), { recursive: true });
await copyFile(join(root, "src", "styles.css"), join(out, "assets", "styles.css"));
await copyFile(join(root, "src", "promo.css"), join(out, "assets", "promo.css"));
await copyFile(join(root, "src", "app.js"), join(out, "assets", "app.js"));
const cards = tools.map((t) => '<a class="card" href="' + base + '/tools/' + t.slug + '/"><span class="tag">' + esc(t.category) + '</span><h3>' + esc(t.name) + '</h3><p>' + esc(t.short) + '</p><span class="open">Abrir ferramenta →</span></a>').join("");
const guideCards = guides.map((g) => '<a class="card" href="' + base + '/guias/' + g.slug + '/"><span class="tag">' + esc(g.category) + '</span><h3>' + esc(g.title) + '</h3><p>' + esc(g.description) + '</p><span class="open">Ler guia →</span></a>').join("");
const homeNicheCards = niches.map((n) => '<a class="niche-chip" href="' + base + '/nichos/' + n.slug + '/">' + esc(n.emoji + " " + n.name) + '</a>').join("");
const homeCanonical = url("/");
const home = head("Dono em Foco | Ferramentas para negócios locais", "Calculadoras gratuitas para quem administra um negócio local: custos, preço, caixa, divulgação e operação.", homeCanonical) +
  '<body>' + header("home") + '<main><section class="wrap hero"><span class="eyebrow">Decisões do negócio, com números</span><h1>Ferramentas práticas para quem toca um negócio local.</h1><p>Faça contas rápidas sobre preço, custos, caixa, divulgação e operação. Informe seus próprios números e veja uma estimativa no navegador.</p><div class="badge-row"><span class="badge">Grátis e sem cadastro</span><span class="badge">Seus dados ficam no navegador</span><span class="badge">Feito para decisões do dia a dia</span></div></section><section class="wrap section" id="ferramentas"><div class="section-heading"><h2>Calculadoras gratuitas</h2><p>Simulações para planejar uma próxima decisão do seu negócio.</p></div><div class="grid">' + cards + '</div></section><section class="wrap section" id="nichos"><div class="section-heading"><h2>Orientações para cada nicho</h2><p>Rotinas de agenda, atendimento e organização específicas para negócios locais.</p></div><div class="niche-chips">' + homeNicheCards + '</div><p><a class="inline-link" href="' + nicheHubHref + '">Ver todos os guias por nicho →</a></p></section><section class="wrap city-promo"><div><span class="eyebrow">Busca local · 5.571 localidades</span><h2>Encontre sua cidade</h2><p>Use a calculadora de capacidade da agenda e consulte informações municipais do IBGE.</p></div><a class="button" href="' + cityDirectoryHref + '">Abrir diretório de cidades</a></section><section class="wrap section" id="guias"><div class="section-heading"><h2>Guias para escolher ferramentas e organizar o atendimento</h2><p>Conteúdo prático para quem administra um negócio local.</p></div><div class="grid">' + guideCards + '</div><p><a class="inline-link" href="' + base + '/guias/">Ver todos os guias →</a></p></section><section class="wrap cta"><div><h2>Quer organizar os agendamentos com o plano grátis?</h2><p>O AgendZap tem agenda online para negócios locais. O plano gratuito exibe anúncios.</p></div><a class="button" href="' + esc(trackedFree("site", "home")) + '" rel="noopener">Conhecer plano grátis</a></section></main>' + footer + promo("home") + '</body></html>';
await writeFile(join(out, "index.html"), home, "utf8");
for (const tool of tools) {
  const dir = join(out, "tools", tool.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), page(tool), "utf8");
}
for (const guide of guides) {
  const dir = join(out, "guias", guide.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), guidePage(guide), "utf8");
}
await mkdir(join(out, "guias"), { recursive: true });
await writeFile(join(out, "guias", "index.html"), guidesIndexPage(), "utf8");
await mkdir(join(out, "nichos"), { recursive: true });
await writeFile(join(out, "nichos", "index.html"), nichesIndexPage(), "utf8");
for (const niche of niches) {
  const dir = join(out, "nichos", niche.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), nichePage(niche), "utf8");
}
await mkdir(join(out, "br"), { recursive: true });
await writeFile(join(out, "br", "index.html"), cityIndexPage(), "utf8");
for (const state of states) {
  const stateDir = join(out, "br", state.code.toLowerCase());
  await mkdir(stateDir, { recursive: true });
  await writeFile(join(stateDir, "index.html"), statePage(state), "utf8");
}
for (const city of cityData.municipalities) {
  const dir = join(out, city.path.replace(/^\//, ""));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), cityPage(city), "utf8");
}
const urls = ["/", ...tools.map((t) => "/tools/" + t.slug + "/"), "/guias/", ...guides.map((g) => "/guias/" + g.slug + "/"), "/nichos/", ...niches.map((n) => "/nichos/" + n.slug + "/"), "/br/", ...states.map((s) => "/br/" + s.code.toLowerCase() + "/"), ...cityData.municipalities.map((c) => c.path)];
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map((path) => "  <url><loc>" + esc(url(path)) + "</loc></url>").join("\n") + "\n</urlset>\n";
await writeFile(join(out, "sitemap.xml"), sitemap, "utf8");
await writeFile(join(out, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: " + url("/sitemap.xml") + "\n", "utf8");
await writeFile(join(out, "404.html"), head("Página não encontrada | Dono em Foco", "Não encontramos esta página.", url("/404.html")) + '<body>' + header("404") + '<main class="wrap notfound"><span class="eyebrow">Erro 404</span><h1>Esta página não está aqui.</h1><p>Volte à página inicial para encontrar uma ferramenta.</p><a class="button" href="' + base + '/">Ver ferramentas</a><section class="cta"><div><h2>Experimente o plano grátis do AgendZap</h2><p>Agenda online para negócios locais. O plano gratuito exibe anúncios.</p></div><a class="button" href="' + esc(trackedFree("site", "404")) + '">Conhecer plano grátis</a></section></main>' + footer + promo("404") + '</body></html>', "utf8");
await writeFile(join(out, ".nojekyll"), "", "utf8");
console.log("Geradas " + urls.length + " páginas públicas para " + cityData.municipalities.length + " localidades do IBGE em " + out);
