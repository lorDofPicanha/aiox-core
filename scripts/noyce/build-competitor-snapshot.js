#!/usr/bin/env node
'use strict';
/**
 * Slice 1 — Real competitor-intelligence snapshot from PNCP (batch, READ-ONLY, no auth).
 *
 * For each órgão in the ENIAC radius seed, reconstructs the REAL market structure from
 * /contratos (winners + values), in MONTHLY windows with retry/backoff (the /contratos
 * cnpjOrgao filter is intermittently HTTP 500), deduped by numeroControlePNCP, and
 * computes: winner ranking, R$ share, HHI/concentration, incumbent, price band, coverage.
 *
 * Output: a versioned JSON snapshot the app consumes (no live API call in-request).
 * Every numeric field traces to PNCP contracts; provenance is labelled grounded/inferred/gap.
 *
 * Usage: node scripts/noyce/build-competitor-snapshot.js [--months 12] [--out <path>]
 */
const fs = require('node:fs');
const path = require('node:path');

const PNCP_BASE = 'https://pncp.gov.br/api/consulta/v1';
const ROOT = path.resolve(__dirname, '..', '..');

// Seed órgãos (deduped from the 11 real editais; CNPJ confirmed via /contratacoes).
const ORGAOS = [
  { cnpj: '01616520000196', name: 'Município de Águas Lindas de Goiás', municipio: 'Águas Lindas', uf: 'GO', ibge: '5200258', distanceKm: 0 },
  { cnpj: '01629276000104', name: 'Município de Novo Gama', municipio: 'Novo Gama', uf: 'GO', ibge: '5214887', distanceKm: 30 },
  { cnpj: '01067941000105', name: 'Município de Pirenópolis', municipio: 'Pirenópolis', uf: 'GO', ibge: '5217302', distanceKm: 100 },
  { cnpj: '01067479000146', name: 'Prefeitura de Anápolis', municipio: 'Anápolis', uf: 'GO', ibge: '5201108', distanceKm: 120 },
  { cnpj: '01098797000174', name: 'CEASA/GO', municipio: 'Goiânia', uf: 'GO', ibge: '5208707', distanceKm: 170 },
];

// Big obras-relevant órgãos in the wider ~500km radius (Estado GO, DF obras, DNIT, Goiânia,
// saneamento) — CNPJs confirmed from the live discovery snapshot. Added only with --radius500
// so the app's default market-snapshot scope (ENIAC's immediate cluster) stays intact. These
// surface the LARGEST construtoras (big state/capital contracts), the "model" companies.
const RADIUS500_ORGAOS = [
  { cnpj: '01409580000138', name: 'Estado de Goiás', municipio: 'Goiânia', uf: 'GO', ibge: '5208707', distanceKm: 170 },
  { cnpj: '00394742000149', name: 'Secretaria de Estado de Obras e Infraestrutura (DF)', municipio: 'Brasília', uf: 'DF', ibge: '5300108', distanceKm: 50 },
  { cnpj: '04892707000100', name: 'DNIT', municipio: 'Brasília', uf: 'DF', ibge: '5300108', distanceKm: 50 },
  { cnpj: '32295411000148', name: 'Fundo Municipal de Saneamento Ambiental (Águas Lindas)', municipio: 'Águas Lindas', uf: 'GO', ibge: '5200258', distanceKm: 0 },
  { cnpj: '17577524000142', name: 'Secretaria Municipal de Administração (Goiânia)', municipio: 'Goiânia', uf: 'GO', ibge: '5208707', distanceKm: 170 },
  { cnpj: '18443577000133', name: 'Consórcio Intermunicipal Brasil Central', municipio: 'Goiânia', uf: 'GO', ibge: '5208707', distanceKm: 170 },
];

const ARGS = parseArgs(process.argv.slice(2));
const ORGAOS_TO_RUN = ARGS.radius500 ? ORGAOS.concat(RADIUS500_ORGAOS) : ORGAOS;
const CACHE_DIR = path.join(ROOT, 'apps', 'noyce', 'lib', 'data', '.cache');

// Obras/engenharia filter — ENIAC competes in construction (CNAE 41/42/43), not energy/payments/health.
const OBRAS_RE = /\b(obra|engenharia|constru|reforma|pavimenta|drenagem|edifica|recupera|ampliac|amplia|infraestrutura|calcada|calçada|ponte|terraplan|saneamento|esgoto|asfalt|recapeamento|revitaliz|urbaniza|cobertura met|quadra|praca|praça)/i;
function isObras(c) {
  const cat = String(c.categoriaProcesso?.nome || '').toLowerCase();
  if (cat.includes('obras')) return true;
  return OBRAS_RE.test(String(c.objetoContrato || ''));
}

function parseArgs(argv) {
  const a = { months: 12, retries: 5, delayMs: 450, timeoutMs: 14000, fromCache: false, all: false, radius500: false, out: path.join(ROOT, 'apps', 'noyce', 'lib', 'data', 'market-snapshot.json') };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--months') a.months = Number(argv[++i]);
    else if (argv[i] === '--retries') a.retries = Number(argv[++i]);
    else if (argv[i] === '--delay-ms') a.delayMs = Number(argv[++i]);
    else if (argv[i] === '--out') a.out = path.resolve(argv[++i]);
    else if (argv[i] === '--from-cache') a.fromCache = true; // re-aggregate from cached raw contracts (no network)
    else if (argv[i] === '--all') a.all = true; // do not filter to obras (full market)
    else if (argv[i] === '--radius500') a.radius500 = true; // add the big ~500km obras órgãos
  }
  return a;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ymd = (d) => `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;

function monthlyWindows(months, refIso = '2026-05-29T00:00:00Z') {
  const out = [];
  const end = new Date(refIso);
  for (let i = 0; i < months; i++) {
    const df = new Date(end.getTime() - i * 30 * 86400000);
    const di = new Date(df.getTime() - 30 * 86400000);
    out.push({ di: ymd(di), df: ymd(df) });
  }
  return out;
}

function buildUrl(endpoint, params) {
  const url = new URL(`${PNCP_BASE}/${endpoint}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== null && v !== undefined && v !== '') url.searchParams.set(k, String(v));
  }
  return url.toString();
}

async function fetchJson(url) {
  let lastErr;
  for (let attempt = 1; attempt <= ARGS.retries; attempt++) {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), ARGS.timeoutMs);
    try {
      const res = await fetch(url, { signal: ctrl.signal, headers: { accept: 'application/json', 'user-agent': 'noyce-competitor-snapshot/0.1' } });
      clearTimeout(to);
      if (res.status === 204) return { empty: true, data: [], totalRegistros: 0, totalPaginas: 0 };
      if (res.ok) {
        const body = await res.text();
        return body.trim() ? JSON.parse(body) : { data: [], totalRegistros: 0, totalPaginas: 0 };
      }
      lastErr = new Error(`HTTP ${res.status}`);
      if (![408, 429, 500, 502, 503, 504].includes(res.status)) throw lastErr;
    } catch (e) { clearTimeout(to); lastErr = e; }
    await sleep(ARGS.delayMs * attempt * 2);
  }
  throw lastErr;
}

const num = (v) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
const contractValue = (r) => num(r.valorGlobal || r.valorInicial || 0);

async function pullContracts(orgao) {
  const all = new Map(); // numeroControlePNCP -> row
  let windowsOk = 0, windowsFail = 0, windowsEmpty = 0;
  for (const w of monthlyWindows(ARGS.months)) {
    let pagina = 1, totalPaginas = 1, anyFail = false;
    do {
      const url = buildUrl('contratos', { dataInicial: w.di, dataFinal: w.df, cnpjOrgao: orgao.cnpj, pagina, tamanhoPagina: 50 });
      try {
        const payload = await fetchJson(url);
        if (payload.empty) { windowsEmpty++; break; }
        const rows = Array.isArray(payload.data) ? payload.data : [];
        for (const r of rows) all.set(r.numeroControlePNCP || `${r.niFornecedor}-${r.sequencialContrato}-${pagina}`, r);
        totalPaginas = payload.totalPaginas || 1;
        pagina++;
      } catch (e) { anyFail = true; break; }
      await sleep(ARGS.delayMs);
    } while (pagina <= totalPaginas);
    if (anyFail) windowsFail++; else if (!windowsEmpty) windowsOk++;
  }
  return { contracts: [...all.values()], windowsOk, windowsFail, windowsEmpty };
}

async function countContratacoes(orgao) {
  // coverage denominator: published bids (the stable endpoint), modalidades 4+6
  let total = 0; const modalityMix = {};
  const w = monthlyWindows(ARGS.months);
  const di = w[w.length - 1].di, df = w[0].df;
  for (const mod of [4, 6, 8]) {
    try {
      const payload = await fetchJson(buildUrl('contratacoes/publicacao', { dataInicial: di, dataFinal: df, codigoModalidadeContratacao: mod, codigoMunicipioIbge: orgao.ibge, pagina: 1, tamanhoPagina: 10 }));
      const n = payload.totalRegistros || (Array.isArray(payload.data) ? payload.data.length : 0);
      if (n) { modalityMix[String(mod)] = n; total += n; }
      await sleep(ARGS.delayMs);
    } catch { /* leave as-is; coverage stays provisional */ }
  }
  return { contratacoesCount: total, modalityMix };
}

function percentile(sorted, p) {
  if (!sorted.length) return null;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return Math.round(sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo));
}

function buildMarketStructure(orgao, allContracts, contratacoesCount, modalityMix, fetchStats) {
  // ENIAC competes in obras → rank the obras-relevant set, not the órgão's whole spend.
  const contracts = ARGS.all ? allContracts : allContracts.filter(isObras);
  const bySupplier = new Map();
  let grandTotal = 0;
  for (const c of contracts) {
    const v = contractValue(c);
    grandTotal += v;
    const key = c.niFornecedor || 'sem-cnpj';
    const e = bySupplier.get(key) || { cnpj: key, name: c.nomeRazaoSocialFornecedor || '(sem nome)', winCount: 0, totalWonBRL: 0, lastWinDate: null, sources: [] };
    e.winCount++; e.totalWonBRL += v;
    const d = c.dataAssinatura || c.dataPublicacaoPncp || null;
    if (d && (!e.lastWinDate || d > e.lastWinDate)) e.lastWinDate = d;
    if (e.sources.length < 5 && c.numeroControlePncpCompra) e.sources.push(c.numeroControlePncpCompra);
    bySupplier.set(key, e);
  }
  const ranked = [...bySupplier.values()].sort((a, b) => b.totalWonBRL - a.totalWonBRL);
  const incumbentDate = ranked.reduce((m, s) => (s.lastWinDate && s.lastWinDate > m ? s.lastWinDate : m), '');
  const competitors = ranked.map((s) => ({
    cnpj: s.cnpj,
    name: s.name,
    winCount: s.winCount,
    totalWonBRL: Math.round(s.totalWonBRL),
    sharePct: grandTotal > 0 ? Number(((s.totalWonBRL / grandTotal) * 100).toFixed(1)) : 0,
    avgTicketBRL: Math.round(s.totalWonBRL / s.winCount),
    avgDiscountPct: null, // INFERENCE: needs valorTotalEstimado join — left null (honest)
    isIncumbent: Boolean(s.lastWinDate && s.lastWinDate === incumbentDate),
    lastWinDate: s.lastWinDate,
    objectAffinity: 'media', // INFERENCE placeholder until CNAE/text match
    vsEniac: { encounters: 0, eniacWins: 0, lostByPct: null, grounding: 'gap' },
    howToBeat: buildHowToBeat(s, grandTotal, ranked.length),
    grounding: 'grounded',
    sourceContractIds: s.sources,
  }));
  const hhi = grandTotal > 0 ? Math.round(ranked.reduce((sum, s) => sum + Math.pow((s.totalWonBRL / grandTotal) * 100, 2), 0)) : 0;
  const concentration = hhi > 2500 ? 'concentrado' : hhi > 1500 ? 'moderado' : 'pulverizado';
  const values = contracts.map(contractValue).filter((v) => v > 0).sort((a, b) => a - b);
  const coveragePct = contratacoesCount > 0 ? Number((contracts.length / contratacoesCount).toFixed(2)) : null;

  return {
    orgaoCnpj: orgao.cnpj,
    orgaoName: orgao.name,
    municipio: orgao.municipio,
    uf: orgao.uf,
    objetoClass: ARGS.all ? 'todos os objetos' : 'obras/engenharia', // INFERENCE: keyword/CNAE filter
    windowMonths: ARGS.months,
    distinctWinners: ranked.length,
    contractCount: contracts.length, // obras-filtered (the ENIAC-relevant set)
    allContractCount: allContracts.length, // every category at the órgão (context)
    obrasShareOfOrgao: allContracts.length ? Number(((contracts.length / allContracts.length) * 100).toFixed(0)) : 0,
    totalContractedBRL: Math.round(grandTotal),
    hhi,
    concentration, // band = INFERENCE convention; read with coveragePct
    modalityMix,
    recurrenceMonths: null, // INFERENCE: needs >=2 cycles / backfill
    outsiderWinRatePct: null, // INFERENCE
    coveragePct, // measured-with-confidence; gates the UI
    coverageProvisional: fetchStats.windowsFail > 0 || contratacoesCount === 0,
    priceBand: {
      p25BRL: percentile(values, 0.25),
      medianBRL: percentile(values, 0.5),
      p75BRL: percentile(values, 0.75),
      sampleSize: values.length,
      grounding: values.length >= 5 ? 'grounded' : 'inferred',
    },
    competitors,
    fetchStats,
    grounding: 'grounded',
  };
}

function buildHowToBeat(s, grandTotal, distinct) {
  const share = grandTotal > 0 ? (s.totalWonBRL / grandTotal) * 100 : 0;
  if (share >= 50) return `Incumbente dominante (${share.toFixed(0)}% do gasto). Para bater: ataque preço agressivo + diferencial técnico (atestado superior); órgão concentrado favorece o atual.`;
  if (distinct <= 2) return `Mercado fechado (${distinct} vencedores). Para entrar: qualifique-se forte e dispute preço; poucos competidores reais.`;
  return `Mercado disputado (${distinct} vencedores). Para ganhar: preço competitivo na faixa P25-mediana; sem incumbente dominante.`;
}

async function main() {
  console.log(`# Noyce competitor snapshot — ${ORGAOS_TO_RUN.length} órgãos${ARGS.radius500 ? ' (raio 500km)' : ''}, ${ARGS.months} meses\n`);
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const orgaos = [];
  for (const orgao of ORGAOS_TO_RUN) {
    process.stdout.write(`- ${orgao.name} (${orgao.cnpj})... `);
    try {
      const cachePath = path.join(CACHE_DIR, `contracts-${orgao.cnpj}.json`);
      let contracts, contratacoesCount, modalityMix, fetchStats;
      if (ARGS.fromCache && fs.existsSync(cachePath)) {
        const cached = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
        contracts = cached.contracts; contratacoesCount = cached.contratacoesCount; modalityMix = cached.modalityMix; fetchStats = cached.fetchStats;
        process.stdout.write('(cache) ');
      } else {
        const pulled = await pullContracts(orgao);
        contracts = pulled.contracts;
        fetchStats = { windowsOk: pulled.windowsOk, windowsFail: pulled.windowsFail, windowsEmpty: pulled.windowsEmpty };
        const cc = await countContratacoes(orgao);
        contratacoesCount = cc.contratacoesCount; modalityMix = cc.modalityMix;
        fs.writeFileSync(cachePath, JSON.stringify({ contracts, contratacoesCount, modalityMix, fetchStats }), 'utf8');
      }
      const ms = buildMarketStructure(orgao, contracts, contratacoesCount, modalityMix, fetchStats);
      orgaos.push(ms);
      console.log(`obras=${ms.contractCount}/${ms.allContractCount} winners=${ms.distinctWinners} hhi=${ms.hhi}(${ms.concentration}) cov=${ms.coveragePct ?? 'n/a'} [ok=${fetchStats.windowsOk} fail=${fetchStats.windowsFail} empty=${fetchStats.windowsEmpty}]`);
    } catch (e) {
      console.log(`FALHOU: ${e.message}`);
      orgaos.push({ orgaoCnpj: orgao.cnpj, orgaoName: orgao.name, error: e.message, competitors: [], grounding: 'gap' });
    }
  }

  const snapshot = {
    generatedAt: new Date().toISOString(),
    source: 'PNCP /contratos + /contratacoes (public, read-only)',
    windowMonths: ARGS.months,
    note: 'Batch snapshot. Live API not called in-request (cnpjOrgao is flaky). avgDiscount/recurrence/vsEniac are inference/gap by design.',
    orgaos,
  };
  fs.mkdirSync(path.dirname(ARGS.out), { recursive: true });
  fs.writeFileSync(ARGS.out, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  console.log(`\nsnapshot: ${ARGS.out}`);
  const withData = orgaos.filter((o) => o.competitors && o.competitors.length).length;
  console.log(`órgãos com dado real: ${withData}/${ORGAOS_TO_RUN.length}`);
}

main().catch((e) => { console.error(e.stack || e.message); process.exitCode = 1; });
