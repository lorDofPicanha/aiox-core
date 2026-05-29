#!/usr/bin/env node
'use strict';
/**
 * PR2 — Real DISCOVERY snapshot from PNCP (batch, READ-ONLY, no auth).
 *
 * Pulls recent contratações (modalidade 4 Concorrência + 6 Pregão eletrônico) for the
 * ENIAC radius cluster (municípios with known distance from the Águas Lindas base) via the
 * STABLE /contratacoes/publicacao endpoint, normalizes, dedups, and writes a snapshot the
 * app reads (no live API call in-request). Triage (Vai/Olha/Pula) is computed app-side.
 *
 * NOTE: full 500km radius (444 municípios via IBGE haversine) is a follow-up; this seeds the
 * real cluster where ENIAC actually disputes (GO, ≤170km), proven by the 11 real editais.
 *
 * Usage: node scripts/noyce/build-discovery-snapshot.js [--days 90] [--out <path>]
 */
const fs = require('node:fs');
const path = require('node:path');

const BASE = 'https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao';
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
  const a = { days: 90, retries: 5, delayMs: 350, timeoutMs: 13000, out: path.join(ROOT, 'apps', 'noyce', 'lib', 'data', 'discovery-snapshot.json') };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--days') a.days = Number(argv[++i]);
    else if (argv[i] === '--out') a.out = path.resolve(argv[++i]);
  }
  return a;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ymd = (d) => `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;

async function fetchJson(url) {
  let lastErr;
  for (let attempt = 1; attempt <= ARGS.retries; attempt++) {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), ARGS.timeoutMs);
    try {
      const res = await fetch(url, { signal: ctrl.signal, headers: { accept: 'application/json', 'user-agent': 'noyce-discovery/0.1' } });
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

function normalize(raw, muni, modalityLabel) {
  const cleanTitle = String(raw.objetoCompra || raw.objetoContratacao || 'Objeto não informado').replace(/^\[[^\]]+\]\s*-?\s*/, '').replace(/\s+/g, ' ').trim();
  return {
    id: raw.numeroControlePNCP || raw.numeroControlePncp || `${muni.ibge}-${raw.sequencialCompra}`,
    pncpId: raw.numeroControlePNCP || null,
    source: inferSource(raw),
    title: cleanTitle.slice(0, 140),
    buyer: raw.orgaoEntidade?.razaoSocial || raw.unidadeOrgao?.nomeUnidade || 'Órgão não informado',
    buyerCnpj: (raw.orgaoEntidade?.cnpj || '').replace(/\D/g, '') || null,
    city: raw.unidadeOrgao?.municipioNome || muni.name,
    uf: raw.unidadeOrgao?.ufSigla || muni.uf,
    ibge: String(raw.unidadeOrgao?.codigoIbge || muni.ibge),
    distanceKm: muni.distanceKm,
    modality: raw.modalidadeNome || modalityLabel,
    modalityCode: raw.modalidadeId ?? null,
    estimatedValue: typeof raw.valorTotalEstimado === 'number' ? raw.valorTotalEstimado : null,
    publicationDate: raw.dataPublicacaoPncp || raw.dataPublicacaoPNCP || null,
    proposalDeadline: raw.dataEncerramentoProposta || raw.dataAberturaProposta || null,
    situacao: raw.situacaoCompraNome || null,
    sourceUrl: raw.linkSistemaOrigem || raw.linkProcessoEletronico || null,
  };
}

async function main() {
  const now = new Date('2026-05-29T00:00:00Z');
  const start = new Date(now.getTime() - ARGS.days * 86400000);
  const di = ymd(start), df = ymd(now);
  console.log(`# Discovery snapshot — ${MUNICIPIOS.length} municípios × ${MODALITIES.length} modalidades, ${di}..${df}\n`);

  const byId = new Map();
  let okQueries = 0, failQueries = 0;
  for (const muni of MUNICIPIOS) {
    let total = 0;
    for (const mod of MODALITIES) {
      let pagina = 1, totalPaginas = 1;
      do {
        const url = `${BASE}?dataInicial=${di}&dataFinal=${df}&codigoModalidadeContratacao=${mod.code}&codigoMunicipioIbge=${muni.ibge}&pagina=${pagina}&tamanhoPagina=50`;
        try {
          const payload = await fetchJson(url);
          const rows = Array.isArray(payload.data) ? payload.data : [];
          for (const r of rows) { const n = normalize(r, muni, mod.label); byId.set(n.id, n); total++; }
          totalPaginas = payload.totalPaginas || 1;
          okQueries++;
          pagina++;
        } catch (e) { failQueries++; break; }
        await sleep(ARGS.delayMs);
      } while (pagina <= totalPaginas);
    }
    console.log(`- ${muni.name} (${muni.ibge}): ${total} contratações`);
  }

  const items = [...byId.values()];
  const snapshot = {
    generatedAt: new Date().toISOString(),
    source: 'PNCP /contratacoes/publicacao (public, read-only)',
    windowDays: ARGS.days,
    municipios: MUNICIPIOS,
    note: 'Cluster real (GO ≤170km). Raio completo 500km via IBGE haversine = follow-up. Triagem Vai/Olha/Pula é app-side.',
    queryStats: { okQueries, failQueries },
    items,
  };
  fs.mkdirSync(path.dirname(ARGS.out), { recursive: true });
  fs.writeFileSync(ARGS.out, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  console.log(`\nsnapshot: ${ARGS.out}\nitens (dedup): ${items.length} · queries ok=${okQueries} fail=${failQueries}`);
}
main().catch((e) => { console.error(e.stack || e.message); process.exitCode = 1; });
