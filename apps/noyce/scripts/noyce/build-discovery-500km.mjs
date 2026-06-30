// Discovery 500km REAL (30/Jun) — substitui o cluster manual de 9 municípios (≤170km) pela busca
// efetiva no raio de 500km de Águas Lindas. Fonte: PNCP /contratacoes/publicacao (público, read-only).
// Pipeline: municípios dentro de 500km (IBGE+haversine) → query PNCP por UF×modalidade → filtra obras
// + município no raio → distância haversine → dedupe por id → snapshot.
//
// Uso: node scripts/noyce/build-discovery-500km.mjs            (janela padrão: últimos 60 dias)
//      node scripts/noyce/build-discovery-500km.mjs 30         (últimos 30 dias)

import { readFileSync, writeFileSync } from "node:fs";

const BASE = "https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
// Obras/serviços de engenharia vivem majoritariamente em Concorrência (4 elet, 5 pres). Pregão (6)
// é volume de mercadoria — fica fora p/ não estourar o rate-limit do PNCP (entra em fase 2 se preciso).
const MODALIDADES = [4, 5];
const PAGE_SIZE = 50;
const MAX_PAGES = { 4: 200, 5: 200, 6: 50 };
const DELAY_MS = 1500; // educado: o PNCP rate-limita bursts curtos.
const RETRIES = 5; // backoff longo p/ atravessar a janela de rate-limit.

// Filtro de obras/engenharia (nicho ENIAC). Conservador — borderline entra (a triagem app-side decide).
const OBRAS_RE = /obra|engenharia|reforma|constru|pavimenta|edifica|amplia|recupera[çc][ãa]o|drenagem|terraplan|saneamento|infraestrutura|quadra|ginasio|gin[áa]sio|ponte|calçament|cal[çc]ament|muro|pra[çc]a|ubs\b|creche|escola/i;

const days = Number.parseInt(process.argv[2] ?? "60", 10);
function yyyymmdd(d) { return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`; }
const hoje = new Date();
const inicio = new Date(hoje.getTime() - days * 86_400_000);
const dataInicial = yyyymmdd(inicio), dataFinal = yyyymmdd(hoje);

const geo = JSON.parse(readFileSync(new URL("../../lib/data/municipios-raio-500km.json", import.meta.url), "utf8"));
const distByIbge = new Map(geo.municipios.map((m) => [String(m.ibge), m]));
const UFS = [...new Set(geo.municipios.map((m) => m.uf))];
console.log(`Raio 500km de ${geo.origem.nome}: ${geo.municipios.length} municípios em ${UFS.length} UFs (${UFS.join(",")}).`);
console.log(`Janela: ${dataInicial}→${dataFinal} (${days}d). Modalidades: ${MODALIDADES.join(",")}.`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const BACKOFF = [5000, 12000, 25000, 45000]; // ride out the rate-limit window
async function fetchJson(url) {
  for (let i = 0; i < RETRIES; i++) {
    try {
      const res = await fetch(url, { headers: { accept: "application/json", "user-agent": UA } });
      if (res.status === 204) return { data: [], totalPaginas: 0, totalRegistros: 0 };
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status} (rate/again)`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === RETRIES - 1) throw e;
      await sleep(BACKOFF[Math.min(i, BACKOFF.length - 1)]);
    }
  }
}

const seen = new Map();
const stats = { okQueries: 0, failQueries: 0, brutos: 0, foraRaio: 0, naoObra: 0 };

for (const uf of UFS) {
  for (const mod of MODALIDADES) {
    let page = 1, totalPaginas = 1;
    do {
      const url = `${BASE}?dataInicial=${dataInicial}&dataFinal=${dataFinal}&codigoModalidadeContratacao=${mod}&uf=${uf}&pagina=${page}&tamanhoPagina=${PAGE_SIZE}`;
      let j;
      try { j = await fetchJson(url); stats.okQueries++; }
      catch { stats.failQueries++; break; }
      totalPaginas = j.totalPaginas ?? 0;
      for (const it of j.data ?? []) {
        stats.brutos++;
        const ibge = String(it.unidadeOrgao?.codigoIbge ?? "");
        const m = distByIbge.get(ibge);
        if (!m) { stats.foraRaio++; continue; }
        const objeto = String(it.objetoCompra ?? "");
        if (!OBRAS_RE.test(objeto)) { stats.naoObra++; continue; }
        const id = it.numeroControlePNCP;
        if (!id || seen.has(id)) continue;
        seen.set(id, {
          id,
          buyerCnpj: it.orgaoEntidade?.cnpj ?? null,
          source: "pncp",
          title: objeto.replace(/\s+/g, " ").trim().slice(0, 220),
          buyer: it.orgaoEntidade?.razaoSocial ?? it.unidadeOrgao?.nomeUnidade ?? "Órgão",
          city: it.unidadeOrgao?.municipioNome ?? m.nome,
          uf: it.unidadeOrgao?.ufSigla ?? m.uf,
          distanceKm: m.distanceKm,
          estimatedValue: typeof it.valorTotalEstimado === "number" ? it.valorTotalEstimado : null,
          proposalDeadline: it.dataEncerramentoProposta ?? null,
          situacao: it.situacaoCompraNome ?? null,
          modality: it.modalidadeNome ?? null,
          editalRequirements: null,
        });
      }
      await sleep(DELAY_MS);
      page++;
    } while (page <= totalPaginas && page <= MAX_PAGES[mod]);
    process.stdout.write(`  ${uf}/mod${mod}: ${seen.size} acumulados\r`);
  }
  console.log(`UF ${uf} ok — ${seen.size} editais de obra no raio até agora.`);
}

const items = [...seen.values()].sort((a, b) => a.distanceKm - b.distanceKm);
const byUf = {};
for (const i of items) byUf[i.uf] = (byUf[i.uf] || 0) + 1;

const snapshot = {
  generatedAt: new Date().toISOString(),
  source: "PNCP /contratacoes/publicacao (público, read-only)",
  pipeline: "build-discovery-500km.mjs → IBGE haversine 500km → filtro obras → dedupe id",
  windowDays: days,
  windowStart: dataInicial,
  windowEnd: dataFinal,
  raioKm: 500,
  origem: geo.origem,
  municipiosNoRaio: geo.municipios.length,
  ufs: UFS,
  itensPorUf: byUf,
  queryStats: stats,
  note: `Raio 500km REAL (${geo.municipios.length} municípios, ${UFS.length} UFs). Substitui o cluster manual de 9 munis ≤170km.`,
  items,
};
const out = new URL("../../lib/data/discovery-snapshot.json", import.meta.url);
writeFileSync(out, JSON.stringify(snapshot));
console.log(`\n✅ ${items.length} editais de obra no raio de 500km (por UF: ${JSON.stringify(byUf)}).`);
console.log(`stats: ${JSON.stringify(stats)}`);
console.log(`escrito: lib/data/discovery-snapshot.json`);
