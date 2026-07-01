// Discovery 500km REAL (30/Jun) — substitui o cluster manual de 9 municípios (≤170km) pela busca
// efetiva no raio de 500km de Águas Lindas. Fonte: PNCP /contratacoes/publicacao (público, read-only).
// Pipeline: municípios dentro de 500km (IBGE+haversine) → query PNCP por UF×modalidade → filtra obras
// + município no raio → distância haversine → dedupe por id → snapshot.
//
// Uso:
//   node scripts/noyce/build-discovery-500km.mjs            (uma vez, janela 60 dias)
//   node scripts/noyce/build-discovery-500km.mjs 30         (uma vez, janela 30 dias)
//   node scripts/noyce/build-discovery-500km.mjs --watch    (refresh automático a cada 1h — daemon)

import { readFileSync, writeFileSync } from "node:fs";

const BASE = "https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
// Obras/serviços de engenharia: Concorrência (4 elet, 5 pres) + parte em Pregão (6, capado).
const MODALIDADES = [4, 5, 6];
const PAGE_SIZE = 50;
const MAX_PAGES = { 4: 200, 5: 200, 6: 40 };
const DELAY_MS = 1500; // educado: o PNCP rate-limita bursts curtos.
const RETRIES = 5;
const REFRESH_MS = 60 * 60 * 1000; // 1 hora (modo --watch).

const OBRAS_RE = /obra|engenharia|reforma|constru|pavimenta|edifica|amplia|recupera[çc][ãa]o|drenagem|terraplan|saneamento|infraestrutura|quadra|gin[áa]sio|ponte|cal[çc]ament|muro|pra[çc]a|ubs\b|creche|escola/i;

const args = process.argv.slice(2);
const watch = args.includes("--watch");
const days = Number.parseInt(args.find((a) => /^\d+$/.test(a)) ?? "60", 10);

// Base de municípios no raio (estática) + helpers (carregados uma vez).
const geo = JSON.parse(readFileSync(new URL("../../lib/data/municipios-raio-500km.json", import.meta.url), "utf8"));
const distByIbge = new Map(geo.municipios.map((m) => [String(m.ibge), m]));
const UFS = [...new Set(geo.municipios.map((m) => m.uf))];
const OUT = new URL("../../lib/data/discovery-snapshot.json", import.meta.url);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const BACKOFF = [5000, 12000, 25000, 45000];
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

function yyyymmdd(d) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

async function buildOnce() {
  const hoje = new Date();
  const dataInicial = yyyymmdd(new Date(hoje.getTime() - days * 86_400_000));
  const dataFinal = yyyymmdd(hoje);
  console.log(`\n[${hoje.toISOString()}] Raio 500km de ${geo.origem.nome}: ${geo.municipios.length} municípios, ${UFS.length} UFs. Janela ${dataInicial}→${dataFinal} (${days}d). Mod ${MODALIDADES.join(",")}.`);

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
          const m = distByIbge.get(String(it.unidadeOrgao?.codigoIbge ?? ""));
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
    }
    process.stdout.write(`  ${uf}: ${seen.size} editais de obra no raio\n`);
  }

  const items = [...seen.values()].sort((a, b) => a.distanceKm - b.distanceKm);
  const byUf = {};
  for (const i of items) byUf[i.uf] = (byUf[i.uf] || 0) + 1;
  const snapshot = {
    generatedAt: new Date().toISOString(),
    source: "PNCP /contratacoes/publicacao (público, read-only)",
    pipeline: "build-discovery-500km.mjs → IBGE haversine 500km → filtro obras → dedupe id",
    windowDays: days, windowStart: dataInicial, windowEnd: dataFinal, raioKm: 500,
    origem: geo.origem, municipiosNoRaio: geo.municipios.length, ufs: UFS,
    itensPorUf: byUf, queryStats: stats,
    note: `Raio 500km REAL (${geo.municipios.length} municípios, ${UFS.length} UFs).`,
    items,
  };
  writeFileSync(OUT, JSON.stringify(snapshot));
  console.log(`✅ ${items.length} editais de obra no raio (por UF: ${JSON.stringify(byUf)}). stats ${JSON.stringify(stats)} → lib/data/discovery-snapshot.json`);
  return items.length;
}

if (watch) {
  console.log(`Modo --watch: refresh a cada ${REFRESH_MS / 60000} min. Ctrl+C para parar.`);
  // Loop perpétuo: build, dorme 1h, repete. Cada run usa a janela rolante (data atual).
  for (;;) {
    try { await buildOnce(); } catch (e) { console.error("build falhou:", e?.message ?? e); }
    console.log(`Próximo refresh em ${REFRESH_MS / 60000} min…`);
    await sleep(REFRESH_MS);
  }
} else {
  await buildOnce();
}
