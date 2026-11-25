import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const apiRoot = "https://servicodados.ibge.gov.br/api";
const [municipalityResponse, populationResponse] = await Promise.all([
  fetch(`${apiRoot}/v1/localidades/municipios?orderBy=nome`),
  fetch(`${apiRoot}/v3/agregados/6579/periodos/2024/variaveis/9324?localidades=N6[all]`)
]);
if (!municipalityResponse.ok) throw new Error(`IBGE localidades: HTTP ${municipalityResponse.status}`);
if (!populationResponse.ok) throw new Error(`IBGE população: HTTP ${populationResponse.status}`);

const rawMunicipalities = await municipalityResponse.json();
const populationData = await populationResponse.json();
const populations = new Map();
for (const series of populationData[0]?.resultados?.[0]?.series ?? []) {
  const raw = series.serie?.["2024"];
  if (/^\d+$/.test(raw ?? "")) populations.set(String(series.localidade.id), Number(raw));
}
const municipalities = rawMunicipalities.map((item) => {
  const uf = item.microrregiao?.mesorregiao?.UF ?? item["regiao-imediata"]?.["regiao-intermediaria"]?.UF;
  if (!uf?.sigla || !uf?.nome) throw new Error(`UF ausente no registro IBGE ${item.id}`);
  return {
    id: item.id,
    name: item.nome,
    stateCode: uf.sigla,
    stateName: uf.nome,
    region: uf.regiao?.nome ?? "Brasil",
    population2024: populations.get(String(item.id)) ?? null
  };
});
municipalities.sort((a, b) => a.stateName.localeCompare(b.stateName, "pt-BR") || a.name.localeCompare(b.name, "pt-BR"));

const output = join(root, "src", "data", "municipalities.json");
await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify({
  source: `${apiRoot}/v1/localidades/municipios`,
  populationSource: `${apiRoot}/v3/agregados/6579/periodos/2024/variaveis/9324?localidades=N6[all]`,
  populationYear: 2024,
  downloadedAt: new Date().toISOString().slice(0, 10),
  count: municipalities.length,
  municipalities
}, null, 2) + "\n", "utf8");
console.log(`Salvas ${municipalities.length} localidades IBGE em ${output}`);
