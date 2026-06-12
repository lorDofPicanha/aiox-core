#!/usr/bin/env node
// Run with: node --experimental-strip-types scripts/noyce/build-discovery-snapshot.mjs [--days 90] [--asof 2026-06-10] [--out <path>]
/**
 * DISCOVERY snapshot from PNCP — now WIRED through the legal-calibrated sources layer
 * (lib/sources/, squad 08-jun + portal ToS reviews 09-jun). Replaces the old inline
 * fetch+normalize+Map dedupe.
 *
 * Pipeline (every step from lib/sources/, not ad-hoc):
 *   1. Registry guardrail  — canReadPublicNow('pncp') gates the whole run (legal panel).
 *   2. pncp-public-adapter — each GET passes assertPublicReadOnly + assertNoSecrets
 *                            (host pncp.gov.br, GET-only, no credentials) and is
 *                            normalized via source-normalizer (per-field jsonPointer
 *                            evidence, critical-field → PENDENTE_DADO).
 *   3. source-dedupe       — 3-tier dedupe (exact / semantic / possible), nothing
 *                            silently dropped; only `unique` candidates reach the app.
 *
 * READ-ONLY, no auth — same proven STABLE /contratacoes/publicacao endpoint. Triage
 * (Vai/Olha/Pula) stays app-side. App-display fields (distanceKm, modality label,
 * situação, source inference) are enriched from the raw row alongside the canonical core.
 *
 * NOTE: full 500km radius (444 municípios via IBGE haversine) is a follow-up; this seeds
 * the real GO cluster (≤170km) where ENIAC actually disputes, proven by the real editais.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPncpPublicAdapter } from '../../apps/noyce/lib/sources/pncp-public-adapter.ts';
import { dedupeCandidates } from '../../apps/noyce/lib/sources/source-dedupe.ts';
import { canReadPublicNow } from '../../apps/noyce/lib/noyce-source-registry.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

// Real radius cluster (IBGE 7-dígitos + distância aprox. da sede Águas Lindas-GO).
const MUNICIPIOS = [
  { ibge: '5200258', name: 'Águas Lindas de Goiás', uf: 'GO', distanceKm: 0 },
  { ibge: '5300108', name: 'Brasília', uf: 'DF', distanceKm: 50 },
  { ibge: '5214887', name: 'Novo Gama', uf: 'GO', distanceKm: 30 },
  { ibge: '5212501', name: 'Luziânia', uf: 'GO', distanceKm: 64 },
  { ibge: '5208004', name: 'Formosa', uf: 'GO', distanceKm: 82 },
  { ibge: '5200050', name: 'Abadiânia', uf: 'GO', distanceKm: 90 },
  { ibge: '5217302', name: 'Pirenópolis', uf: 'GO', distanceKm: 100 },
  { ibge: '5201108', name: 'Anápolis', uf: 'GO', distanceKm: 120 },
  { ibge: '5208707', name: 'Goiânia', uf: 'GO', distanceKm: 170 },
];
const MODALITIES = [
  { code: 4, label: 'Concorrência eletrônica' },
  { code: 6, label: 'Pregão eletrônico' },
];

const ARGS = parseArgs(process.argv.slice(2));

function parseArgs(argv) {
  const a = {
    days: 90,
    asof: null,
    retries: 5,
    delayMs: 350,
    timeoutMs: 13000,
    out: path.join(ROOT, 'apps', 'noyce', 'lib', 'data', 'discovery-snapshot.json'),
  };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--days') a.days = Number(argv[++i]);
    else if (argv[i] === '--asof') a.asof = argv[++i];
    else if (argv[i] === '--out') a.out = path.resolve(argv[++i]);
  }
  return a;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ymd = (d) => `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;

// Retry-resilient fetch (the /contratacoes/publicacao endpoint is stable but the PNCP
// backend 500s intermittently — see doc 22). Returns the parsed payload.
async function fetchJson(url) {
  let lastErr;
  for (let attempt = 1; attempt <= ARGS.retries; attempt++) {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), ARGS.timeoutMs);
    try {
      const res = await fetch(url, { signal: ctrl.signal, headers: { accept: 'application/json', 'user-agent': 'noyce-discovery/0.2' } });
      clearTimeout(to);
      if (res.status === 204) return { data: [], totalPaginas: 0 };
      if (res.ok) { const t = await res.text(); return t.trim() ? JSON.parse(t) : { data: [], totalPaginas: 0 }; }
      lastErr = new Error(`HTTP ${res.status}`);
      if (![408, 429, 500, 502, 503, 504].includes(res.status)) throw lastErr;
    } catch (e) { clearTimeout(to); lastErr = e; }
    await sleep(ARGS.delayMs * attempt * 2);
  }
  throw lastErr;
}

// Portal-of-origin inference (PNCP aggregates editais from PCP/BLL/BNC/ComprasGov).
function inferSource(raw) {
  const obj = String(raw.objetoCompra || '').toLowerCase();
  const link = String(raw.linkSistemaOrigem || raw.linkProcessoEletronico || '').toLowerCase();
  const blob = `${obj} ${link}`;
  if (blob.includes('portaldecompras') || obj.includes('[portal de compras')) return 'pcp';
  if (blob.includes('bllcompras') || blob.includes('bll')) return 'bll';
  if (blob.includes('bnccompras') || blob.includes('bnc')) return 'bnc';
  if (blob.includes('comprasnet') || blob.includes('comprasgov') || blob.includes('gov.br/compras')) return 'comprasgov';
  return 'pncp';
}

function cleanTitle(t) {
  return String(t || 'Objeto não informado').replace(/^\[[^\]]+\]\s*-?\s*/, '').replace(/\s+/g, ' ').trim().slice(0, 140);
}

// Canonical (from source-normalizer) + raw display fields → the DiscoveryItem shape the app reads.
function toAppItem(c, raw, muni, mod) {
  return {
    id: c.candidateId,
    pncpId: raw.numeroControlePNCP ?? raw.numeroControlePncp ?? c.candidateId ?? null,
    source: inferSource(raw),
    title: cleanTitle(c.title),
    buyer: c.buyer ?? 'Órgão não informado',
    buyerCnpj: c.buyerCnpj,
    city: c.city ?? muni.name,
    uf: c.uf ?? muni.uf,
    ibge: c.ibge ?? String(muni.ibge),
    distanceKm: muni.distanceKm,
    modality: raw.modalidadeNome || mod.label,
    modalityCode: c.modalityCode,
    estimatedValue: c.estimatedValue,
    publicationDate: c.publicationDate,
    proposalDeadline: c.proposalDeadline,
    situacao: raw.situacaoCompraNome ?? null,
    sourceUrl: c.sourceUrl,
  };
}

async function main() {
  // 1. Legal guardrail — registry is the source of truth for what may be read now.
  if (!canReadPublicNow('pncp')) {
    throw new Error('Guardrail: registry marca PNCP como leitura NÃO permitida agora — abortando discovery.');
  }

  const adapter = createPncpPublicAdapter();
  const asOf = ARGS.asof ? new Date(ARGS.asof) : new Date();
  const start = new Date(asOf.getTime() - ARGS.days * 86400000);
  const di = ymd(start), df = ymd(asOf);
  console.log(`# Discovery (via lib/sources) — ${MUNICIPIOS.length} municípios × ${MODALITIES.length} modalidades, ${di}..${df}\n`);

  const appById = new Map();
  const allCanon = [];
  let okQueries = 0, failQueries = 0;

  for (const muni of MUNICIPIOS) {
    let total = 0;
    for (const mod of MODALITIES) {
      let pagina = 1, totalPaginas = 1;
      do {
        const query = {
          dataInicial: di,
          dataFinal: df,
          codigoModalidadeContratacao: mod.code,
          codigoMunicipioIbge: muni.ibge,
          pagina,
          tamanhoPagina: 50,
        };
        // fetchImpl wraps the retry-resilient fetch and captures the raw payload so we can
        // read totalPaginas + display-only fields the canonical schema doesn't carry.
        let captured = null;
        const fetchImpl = async (url) => {
          const json = await fetchJson(url);
          captured = json;
          return { ok: true, status: 200, json: async () => json };
        };
        try {
          const result = await adapter.run({ capturedBy: 'discovery-build', query, fetchImpl, asOf: asOf.toISOString() });
          if (!result.ok) { failQueries++; break; }
          const rows = Array.isArray(captured?.data) ? captured.data : [];
          const rawByCtrl = new Map(
            rows.map((r) => [String(r.numeroControlePNCP ?? r.numeroControlePncp ?? ''), r]),
          );
          for (const c of result.candidates) {
            const raw = rawByCtrl.get(String(c.candidateId)) ?? {};
            appById.set(c.candidateId, toAppItem(c, raw, muni, mod));
            allCanon.push(c);
            total++;
          }
          totalPaginas = captured?.totalPaginas || 1;
          okQueries++;
          pagina++;
        } catch (e) {
          failQueries++;
          break;
        }
        await sleep(ARGS.delayMs);
      } while (pagina <= totalPaginas);
    }
    console.log(`- ${muni.name} (${muni.ibge}): ${total} contratações`);
  }

  // 3. Dedupe via lib/sources (3-tier). Only `unique` reaches the app; dupes are reported.
  const dedupe = dedupeCandidates(allCanon);
  const uniqueIds = new Set(dedupe.unique.map((c) => c.candidateId));
  const items = [...appById.values()].filter((it) => uniqueIds.has(it.id));

  const snapshot = {
    generatedAt: new Date().toISOString(),
    source: 'PNCP /contratacoes/publicacao (public, read-only)',
    pipeline: 'lib/sources: pncp-public-adapter → source-normalizer → source-dedupe (legal-calibrated 09-jun)',
    windowDays: ARGS.days,
    windowStart: di,
    windowEnd: df,
    municipios: MUNICIPIOS,
    note: 'Cluster real (GO ≤170km). Raio completo 500km via IBGE haversine = follow-up. Triagem Vai/Olha/Pula é app-side. Discovery roteado pela camada legal-calibrada lib/sources.',
    queryStats: { okQueries, failQueries },
    dedupe: {
      total: dedupe.report.total,
      unique: dedupe.report.unique,
      exact: dedupe.report.exact,
      semantic: dedupe.report.semantic,
      possible: dedupe.report.possible,
    },
    items,
  };
  // Guard: um run bloqueado por WAF (0 itens) NÃO pode sobrescrever um snapshot bom.
  // Em 10-11/Jun isso apagou silenciosamente o snapshot real de 29/Mai (150 itens) e
  // derrubou todas as abas de detalhe do app. Para forçar, use --allow-empty.
  if (items.length === 0 && !process.argv.includes('--allow-empty')) {
    console.error(
      `\nABORTADO sem escrever: 0 itens (queries ok=${okQueries} fail=${failQueries}).` +
      `\nSnapshot existente preservado em ${ARGS.out}.` +
      `\nSe o vazio for intencional, repita com --allow-empty.`,
    );
    process.exitCode = 1;
    return;
  }
  fs.mkdirSync(path.dirname(ARGS.out), { recursive: true });
  fs.writeFileSync(ARGS.out, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  console.log(
    `\nsnapshot: ${ARGS.out}` +
    `\nitens únicos: ${items.length} · canônicos: ${dedupe.report.total} ` +
    `(dup exato=${dedupe.report.exact} semântico=${dedupe.report.semantic} possível=${dedupe.report.possible})` +
    `\nqueries ok=${okQueries} fail=${failQueries}`,
  );
}
main().catch((e) => { console.error(e.stack || e.message); process.exitCode = 1; });
