import { mkdir, readFile, rm, writeFile, copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { site } from "../src/site.mjs";
import { tools } from "../src/catalog.mjs";
import { guides } from "../src/guides.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = join(root, "dist");
const esc = (s) => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const base = site.basePath.replace(/\/$/, "");
const url = (path) => site.origin.replace(/\/$/, "") + base + path;
const footer = '<footer class="footer"><div class="wrap footer-inner"><a href="' + base + '/">Dono em Foco</a><span><a href="https://agendzap.com.br/">Conheça o AgendZap</a> · <a href="' + esc(site.freeUrl + "?utm_source=donoemfoco&utm_medium=footer&utm_campaign=site") + '">Plano grátis</a> · Ferramentas gratuitas para negócios locais.</span></div></footer>';
const head = (title, description, canonical) => '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f6f5ef"><title>' + esc(title) + '</title><meta name="description" content="' + esc(description) + '"><link rel="canonical" href="' + esc(canonical) + '"><link rel="stylesheet" href="' + base + '/assets/styles.css"><link rel="stylesheet" href="' + base + '/assets/promo.css"></head>';
function header(campaign) {
  const href = site.freeUrl + "?utm_source=donoemfoco&utm_medium=header&utm_campaign=" + encodeURIComponent(campaign);
  return '<header class="topbar"><div class="wrap navrow"><a class="brand" href="' + base + '/"><span class="brand-mark">D</span><span>Dono em Foco</span></a><nav class="navlinks"><a class="navlink" href="' + base + '/#ferramentas">Ver ferramentas</a><a class="nav-cta" href="' + esc(href) + '">Plano grátis AgendZap</a></nav></div></header>';
}
function cta(tool) {
  const href = site.freeUrl + "?utm_source=donoemfoco&utm_medium=site&utm_campaign=" + encodeURIComponent(tool.slug);
  return '<section class="wrap cta"><div><h2>Organize seus atendimentos com o plano grátis</h2><p>Conheça a agenda online do AgendZap. O plano gratuito exibe anúncios.</p></div><a class="button" href="' + esc(href) + '" rel="noopener">Conhecer plano grátis</a></section><p class="wrap disclosure">A ferramenta desta página é aberta e não exige cadastro. O botão leva ao AgendZap, serviço independente com plano grátis e anúncios.</p>';
}
function promo(campaign) {
  const href = site.freeUrl + "?utm_source=donoemfoco&utm_medium=popup&utm_campaign=" + encodeURIComponent(campaign);
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
await rm(out, { recursive: true, force: true });
await mkdir(join(out, "assets"), { recursive: true });
await copyFile(join(root, "src", "styles.css"), join(out, "assets", "styles.css"));
await copyFile(join(root, "src", "promo.css"), join(out, "assets", "promo.css"));
await copyFile(join(root, "src", "app.js"), join(out, "assets", "app.js"));
const cards = tools.map((t) => '<a class="card" href="' + base + '/tools/' + t.slug + '/"><span class="tag">' + esc(t.category) + '</span><h3>' + esc(t.name) + '</h3><p>' + esc(t.short) + '</p><span class="open">Abrir ferramenta →</span></a>').join("");
const guideCards = guides.map((g) => '<a class="card" href="' + base + '/guias/' + g.slug + '/"><span class="tag">' + esc(g.category) + '</span><h3>' + esc(g.title) + '</h3><p>' + esc(g.description) + '</p><span class="open">Ler guia →</span></a>').join("");
const homeCanonical = url("/");
const home = head("Dono em Foco | Ferramentas para negócios locais", "Calculadoras gratuitas para quem administra um negócio local: custos, preço, caixa, divulgação e operação.", homeCanonical) +
  '<body>' + header("home") + '<main><section class="wrap hero"><span class="eyebrow">Decisões do negócio, com números</span><h1>Ferramentas práticas para quem toca um negócio local.</h1><p>Faça contas rápidas sobre preço, custos, caixa, divulgação e operação. Informe seus próprios números e veja uma estimativa no navegador.</p><div class="badge-row"><span class="badge">Grátis e sem cadastro</span><span class="badge">Seus dados ficam no navegador</span><span class="badge">Feito para decisões do dia a dia</span></div></section><section class="wrap section" id="ferramentas"><div class="section-heading"><h2>Calculadoras gratuitas</h2><p>Simulações para planejar uma próxima decisão do seu negócio.</p></div><div class="grid">' + cards + '</div></section><section class="wrap section" id="guias"><div class="section-heading"><h2>Guias para escolher ferramentas e organizar o atendimento</h2><p>Conteúdo prático para quem administra um negócio local.</p></div><div class="grid">' + guideCards + '</div></section><section class="wrap cta"><div><h2>Quer organizar os agendamentos com o plano grátis?</h2><p>O AgendZap tem agenda online para negócios locais. O plano gratuito exibe anúncios.</p></div><a class="button" href="' + esc(site.freeUrl + "?utm_source=donoemfoco&utm_medium=site&utm_campaign=home") + '" rel="noopener">Conhecer plano grátis</a></section></main>' + footer + promo("home") + '</body></html>';
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
const urls = ["/", ...tools.map((t) => "/tools/" + t.slug + "/"), ...guides.map((g) => "/guias/" + g.slug + "/")];
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map((path) => "  <url><loc>" + esc(url(path)) + "</loc></url>").join("\n") + "\n</urlset>\n";
await writeFile(join(out, "sitemap.xml"), sitemap, "utf8");
await writeFile(join(out, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: " + url("/sitemap.xml") + "\n", "utf8");
await writeFile(join(out, "404.html"), head("Página não encontrada | Dono em Foco", "Não encontramos esta página.", url("/404.html")) + '<body>' + header("404") + '<main class="wrap notfound"><span class="eyebrow">Erro 404</span><h1>Esta página não está aqui.</h1><p>Volte à página inicial para encontrar uma ferramenta.</p><a class="button" href="' + base + '/">Ver ferramentas</a><section class="cta"><div><h2>Experimente o plano grátis do AgendZap</h2><p>Agenda online para negócios locais. O plano gratuito exibe anúncios.</p></div><a class="button" href="' + esc(site.freeUrl + "?utm_source=donoemfoco&utm_medium=site&utm_campaign=404") + '">Conhecer plano grátis</a></section></main>' + footer + promo("404") + '</body></html>', "utf8");
await writeFile(join(out, ".nojekyll"), "", "utf8");
console.log("Geradas " + (tools.length + guides.length + 1) + " páginas em " + out);
