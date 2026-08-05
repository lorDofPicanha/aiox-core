#!/usr/bin/env node
'use strict';
/**
 * Prospect sourcing — fornecedores do poder público por UF, a partir do PNCP (READ-ONLY, sem auth).
 *
 * POR QUE ESTE SCRIPT EXISTE (e não reusa scripts/noyce/build-competitor-snapshot.js):
 * aquele script puxa /contratos filtrando por `cnpjOrgao`. Em 01/Ago/2026 esse filtro — e
 * qualquer outro filtro (uf, codigoMunicipioIbge) — retorna HTTP 500 "Erro na comunicação com
 * o banco de dados" de forma determinística. O MESMO endpoint SEM filtro responde 200.
 * Então a estratégia aqui é: varrer /contratos sem filtro em janelas curtas e filtrar a UF
 * do lado do cliente. O script da ENIAC fica intocado.
 *
 * Saída: JSON + Markdown com fornecedores agregados (nº de contratos, valor, órgãos, objetos).
 *
 * Uso:
 *   node scripts/prospect/pncp-sc-suppliers.js --from 20260701 --to 20260731 --uf SC
 *   [--window-days 5] [--min-wins 2] [--out <path>] [--page-size 500]
 */
const fs = require('node:fs');
const path = require('node:path');

const PNCP_BASE = 'https://pncp.gov.br/api/consulta/v1';
const ROOT = path.resolve(__dirname, '..', '..');

const ARGS = parseArgs(process.argv.slice(2));

function parseArgs(argv) {
  const a = {
    from: '20260701', to: '20260731', uf: 'SC',
    windowDays: 5, pageSize: 500, minWins: 2,
    retries: 5, delayMs: 400, timeoutMs: 45000, concurrency: 8,
    out: path.join(ROOT, 'docs', 'projects', 'iox-services', '_outreach', 'prospects-pncp'),
  };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--from') a.from = String(argv[++i]);
    else if (k === '--to') a.to = String(argv[++i]);
    else if (k === '--uf') a.uf = String(argv[++i]).toUpperCase();
    else if (k === '--window-days') a.windowDays = Number(argv[++i]);
    else if (k === '--page-size') a.pageSize = Number(argv[++i]);
    else if (k === '--min-wins') a.minWins = Number(argv[++i]);
    else if (k === '--retries') a.retries = Number(argv[++i]);
    else if (k === '--delay-ms') a.delayMs = Number(argv[++i]);
    else if (k === '--concurrency') a.concurrency = Number(argv[++i]);
    else if (k === '--out') a.out = path.resolve(argv[++i]);
  }
  return a;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const num = (v) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
const contractValue = (r) => num(r.valorGlobal || r.valorInicial || 0);
const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

function parseYmd(s) {
  return new Date(Date.UTC(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8)));
}
function ymd(d) {
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
}
function windows(from, to, days) {
  const out = [];
  let cur = parseYmd(from);
  const end = parseYmd(to);
  while (cur <= end) {
    const stop = new Date(Math.min(cur.getTime() + (days - 1) * 86400000, end.getTime()));
    out.push({ di: ymd(cur), df: ymd(stop) });
    cur = new Date(stop.getTime() + 86400000);
  }
  return out;
}

function buildUrl(params) {
  const url = new URL(`${PNCP_BASE}/contratos`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  return url.toString();
}

// The endpoint is intermittently 500 ("Erro na comunicação com o banco de dados").
// Observed: unfiltered requests succeed roughly every other attempt. Retry hard.
async function fetchJson(url) {
  let lastErr;
  for (let attempt = 1; attempt <= ARGS.retries; attempt++) {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), ARGS.timeoutMs);
    try {
      const res = await fetch(url, { signal: ctrl.signal, headers: { accept: 'application/json', 'user-agent': 'prospect-sourcing/0.1' } });
      clearTimeout(to);
      if (res.status === 204) return { data: [], totalPaginas: 0, totalRegistros: 0 };
      if (res.ok) {
        const body = await res.text();
        return body.trim() ? JSON.parse(body) : { data: [], totalPaginas: 0, totalRegistros: 0 };
      }
      lastErr = new Error(`HTTP ${res.status}`);
      if (![408, 429, 500, 502, 503, 504].includes(res.status)) throw lastErr;
    } catch (e) { clearTimeout(to); lastErr = e; }
    await sleep(ARGS.delayMs * attempt);
  }
  throw lastErr;
}

function ingest(rows, suppliers, stats) {
  for (const r of rows) {
    if (String(r.unidadeOrgao?.ufSigla || '').toUpperCase() !== ARGS.uf) continue;
    stats.rowsUf++;
    const cnpj = String(r.niFornecedor || '');
    if (cnpj.length !== 14) continue; // 11 = CPF (pessoa física) — fora do ICP
    const e = suppliers.get(cnpj) || {
      cnpj, name: r.nomeRazaoSocialFornecedor || '(sem nome)',
      wins: 0, totalBRL: 0, orgaos: new Set(), municipios: new Set(), objetos: [], lastWin: null,
    };
    e.wins++; e.totalBRL += contractValue(r);
    if (r.orgaoEntidade?.razaoSocial) e.orgaos.add(r.orgaoEntidade.razaoSocial);
    if (r.unidadeOrgao?.municipioNome) e.municipios.add(r.unidadeOrgao.municipioNome);
    if (e.objetos.length < 4 && r.objetoContrato) e.objetos.push(String(r.objetoContrato).slice(0, 160));
    const d = r.dataAssinatura || r.dataPublicacaoPncp || null;
    if (d && (!e.lastWin || d > e.lastWin)) e.lastWin = d;
    suppliers.set(cnpj, e);
  }
}

// Pages are fetched in parallel batches: the endpoint fails ~50% of the time and the
// retry backoff dominates wall-clock, so serial paging is unusably slow.
async function sweep() {
  const suppliers = new Map();
  const stats = { pagesOk: 0, pagesFail: 0, rowsSeen: 0, rowsUf: 0 };

  for (const w of windows(ARGS.from, ARGS.to, ARGS.windowDays)) {
    process.stdout.write(`\n[${w.di}-${w.df}] `);
    const pageUrl = (p) => buildUrl({ dataInicial: w.di, dataFinal: w.df, pagina: p, tamanhoPagina: ARGS.pageSize });

    // Page 1 carries totalPaginas — if it dies, the whole window is silently skipped.
    // So it gets its own retry budget on top of fetchJson's, with a longer cooldown.
    let totalPaginas = 0;
    for (let round = 1; round <= 4 && totalPaginas === 0; round++) {
      try {
        const first = await fetchJson(pageUrl(1));
        totalPaginas = first.totalPaginas || 1;
        const rows = Array.isArray(first.data) ? first.data : [];
        stats.pagesOk++; stats.rowsSeen += rows.length;
        ingest(rows, suppliers, stats);
        process.stdout.write(`1/${totalPaginas} `);
      } catch {
        process.stdout.write(`x1(r${round}) `);
        if (round < 4) await sleep(3000 * round);
      }
    }
    if (totalPaginas === 0) {
      stats.pagesFail++;
      stats.windowsLost = (stats.windowsLost || 0) + 1;
      process.stdout.write(`JANELA-PERDIDA `);
      continue;
    }

    const pending = [];
    for (let p = 2; p <= totalPaginas; p++) pending.push(p);

    for (let i = 0; i < pending.length; i += ARGS.concurrency) {
      const batch = pending.slice(i, i + ARGS.concurrency);
      const results = await Promise.allSettled(batch.map((p) => fetchJson(pageUrl(p))));
      results.forEach((res, k) => {
        if (res.status === 'fulfilled') {
          const rows = Array.isArray(res.value.data) ? res.value.data : [];
          stats.pagesOk++; stats.rowsSeen += rows.length;
          ingest(rows, suppliers, stats);
          process.stdout.write(`${batch[k]} `);
        } else {
          stats.pagesFail++;
          process.stdout.write(`x${batch[k]} `);
        }
      });
      await sleep(ARGS.delayMs);
    }
  }
  return { suppliers, stats };
}

function toMarkdown(ranked, stats) {
  const lines = [];
  lines.push(`# Prospects — fornecedores do poder público (${ARGS.uf})`);
  lines.push('');
  lines.push(`**Fonte:** PNCP \`/contratos\` (público, read-only) · janela ${ARGS.from}–${ARGS.to}`);
  lines.push(`**Gerado:** ${new Date().toISOString()}`);
  lines.push(`**Cobertura:** ${stats.pagesOk} páginas ok / ${stats.pagesFail} falhas · ${stats.rowsSeen} contratos varridos · ${stats.rowsUf} em ${ARGS.uf}`);
  lines.push('');
  if (stats.pagesFail > 0 || stats.windowsLost) {
    lines.push(`> ⚠️ ${stats.pagesFail} páginas falharam (HTTP 500 do PNCP)${stats.windowsLost ? ` e ${stats.windowsLost} janela(s) foram perdidas por inteiro` : ''}. A lista está INCOMPLETA — é piso, não total.`);
    lines.push('');
  }
  lines.push(`**Filtro:** apenas CNPJ (14 díg., pessoa jurídica) com ≥ ${ARGS.minWins} contratos na janela.`);
  lines.push('');
  lines.push('> Empresa com múltiplos contratos = participa de licitação de forma recorrente =');
  lines.push('> tem custo mensal de triagem de edital. Esse é o gancho da abordagem.');
  lines.push('');
  lines.push('| # | Empresa | CNPJ | Contratos | Valor total | Municípios |');
  lines.push('|---|---|---|---|---|---|');
  ranked.forEach((s, i) => {
    const mun = [...s.municipios].slice(0, 3).join(', ') + (s.municipios.size > 3 ? ` +${s.municipios.size - 3}` : '');
    lines.push(`| ${i + 1} | ${s.name} | ${s.cnpj} | ${s.wins} | ${brl(s.totalBRL)} | ${mun} |`);
  });
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Detalhe por prospect (gancho de abordagem)');
  lines.push('');
  ranked.forEach((s, i) => {
    lines.push(`### ${i + 1}. ${s.name}`);
    lines.push(`- **CNPJ:** ${s.cnpj} · **Contratos na janela:** ${s.wins} · **Valor:** ${brl(s.totalBRL)}`);
    lines.push(`- **Compradores:** ${[...s.orgaos].slice(0, 4).join(' · ')}`);
    lines.push(`- **Municípios:** ${[...s.municipios].join(', ')}`);
    if (s.lastWin) lines.push(`- **Último contrato:** ${String(s.lastWin).slice(0, 10)}`);
    lines.push(`- **O que fornece:**`);
    s.objetos.forEach((o) => lines.push(`  - ${o}`));
    lines.push(`- **E-mail / decisor:** _(pendente — buscar no site/CNPJ)_`);
    lines.push('');
  });
  return lines.join('\n');
}

async function main() {
  console.log(`# Prospect sweep — UF=${ARGS.uf} · ${ARGS.from}→${ARGS.to} · janelas de ${ARGS.windowDays}d · page=${ARGS.pageSize}`);
  console.log('# (PNCP /contratos sem filtro; UF filtrada no cliente — filtro server-side está em HTTP 500)');

  const { suppliers, stats } = await sweep();

  const ranked = [...suppliers.values()]
    .filter((s) => s.wins >= ARGS.minWins)
    .sort((a, b) => b.wins - a.wins || b.totalBRL - a.totalBRL);

  console.log(`\n\n== varridos: ${stats.rowsSeen} contratos · ${ARGS.uf}: ${stats.rowsUf} ==`);
  console.log(`== páginas ok/falha: ${stats.pagesOk}/${stats.pagesFail} ==`);
  console.log(`== fornecedores PJ distintos em ${ARGS.uf}: ${suppliers.size} ==`);
  console.log(`== com >= ${ARGS.minWins} contratos: ${ranked.length} ==`);

  fs.mkdirSync(path.dirname(ARGS.out), { recursive: true });
  const json = ranked.map((s) => ({ ...s, orgaos: [...s.orgaos], municipios: [...s.municipios] }));
  fs.writeFileSync(`${ARGS.out}.json`, `${JSON.stringify({ generatedAt: new Date().toISOString(), uf: ARGS.uf, from: ARGS.from, to: ARGS.to, stats, suppliers: json }, null, 2)}\n`, 'utf8');
  fs.writeFileSync(`${ARGS.out}.md`, `${toMarkdown(ranked, stats)}\n`, 'utf8');
  console.log(`\njson: ${ARGS.out}.json`);
  console.log(`md:   ${ARGS.out}.md`);
}

main().catch((e) => { console.error(e.stack || e.message); process.exitCode = 1; });
