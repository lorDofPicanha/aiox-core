#!/usr/bin/env node
'use strict';
/**
 * Enriquecimento de prospects por CNPJ (dados públicos da Receita Federal).
 *
 * Fecha as duas lacunas que o PNCP não cobre e que decidem se vale abordar:
 *   - SEDE (UF/município) → o PNCP filtra pela UF do COMPRADOR, não do fornecedor.
 *   - PORTE (ME / EPP / Demais) → volume de contrato ≠ capacidade de pagar.
 *     Caso real: SEBOLD, 109 contratos em jul/26, mas micro de 1-10 pessoas.
 *
 * Fonte primária: publica.cnpj.ws (traz e-mail). Fallback: brasilapi.com.br.
 * Ambas exigem user-agent de browser — sem ele, HTTP 403.
 *
 * Uso: node scripts/prospect/enrich-cnpj.js --in <prospects.json> --top 20 --out <path.md>
 */
const fs = require('node:fs');
const path = require('node:path');

const ARGS = parseArgs(process.argv.slice(2));

function parseArgs(argv) {
  const a = {
    in: path.resolve('docs/projects/iox-services/_outreach/prospects-pncp-sc.json'),
    out: path.resolve('docs/projects/iox-services/_outreach/prospects-enriquecidos.md'),
    top: 20, delayMs: 2500, skip: 0,
  };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--in') a.in = path.resolve(argv[++i]);
    else if (argv[i] === '--out') a.out = path.resolve(argv[++i]);
    else if (argv[i] === '--top') a.top = Number(argv[++i]);
    else if (argv[i] === '--skip') a.skip = Number(argv[++i]);
    else if (argv[i] === '--delay-ms') a.delayMs = Number(argv[++i]);
  }
  return a;
}

const UA = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', accept: 'application/json' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function tryFetch(url) {
  for (let i = 1; i <= 3; i++) {
    try {
      const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(25000) });
      if (r.ok) return JSON.parse(await r.text());
      if (r.status === 429) await sleep(20000 * i); // rate limit da API pública
    } catch { /* tenta de novo */ }
    await sleep(1500 * i);
  }
  return null;
}

async function lookup(cnpj) {
  const w = await tryFetch(`https://publica.cnpj.ws/cnpj/${cnpj}`);
  if (w) {
    const est = w.estabelecimento || {};
    return {
      fonte: 'cnpj.ws',
      razao: w.razao_social,
      fantasia: est.nome_fantasia || null,
      uf: est.estado?.sigla || null,
      municipio: est.cidade?.nome || null,
      porte: w.porte?.descricao || null,
      capital: w.capital_social != null ? Number(w.capital_social) : null,
      email: est.email || null,
      fone: [est.ddd1, est.telefone1].filter(Boolean).join(' ') || null,
      cnae: est.atividade_principal?.descricao || null,
      abertura: est.data_inicio_atividade || null,
      situacao: est.situacao_cadastral || null,
    };
  }
  const b = await tryFetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
  if (b) {
    return {
      fonte: 'brasilapi',
      razao: b.razao_social,
      fantasia: b.nome_fantasia || null,
      uf: b.uf || null,
      municipio: b.municipio || null,
      porte: b.porte || b.descricao_porte || null,
      capital: b.capital_social != null ? Number(b.capital_social) : null,
      email: b.email || null,
      fone: b.ddd_telefone_1 || null,
      cnae: b.cnae_fiscal_descricao || null,
      abertura: b.data_inicio_atividade || null,
      situacao: b.descricao_situacao_cadastral || null,
    };
  }
  return null;
}

// ICP: precisa sustentar R$15k de setup (piso do iox-services/00-context/CONTEXT.md).
// ME = micro → reprova. EPP = pequeno → avaliar. Demais = médio/grande → aprova.
function veredito(e, p) {
  if (!e) return { status: '❓', nota: 'lookup falhou — checar na mão' };
  const porte = String(e.porte || '').toUpperCase();
  if (porte.includes('MICRO')) return { status: '❌', nota: 'micro (ME) — não sustenta R$15k' };
  if (String(e.situacao || '').toUpperCase().includes('BAIXAD')) return { status: '❌', nota: 'CNPJ baixado' };
  const sc = e.uf === 'SC';
  if (porte.includes('PEQUENO') || porte.includes('EPP')) {
    return { status: sc ? '🟡' : '🟡', nota: `EPP${sc ? ' + SC (presencial)' : ` — sede ${e.uf}`} — confirmar faturamento` };
  }
  return { status: sc ? '⭐' : '✅', nota: sc ? `porte maior + SC (${e.municipio}) — presencial viável` : `porte maior — sede ${e.uf}, só remoto` };
}

const brl = (n) => (n == null ? '—' : n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }));

async function main() {
  const src = JSON.parse(fs.readFileSync(ARGS.in, 'utf8'));
  const lote = src.suppliers.slice(ARGS.skip, ARGS.skip + ARGS.top);
  console.log(`# Enriquecendo ${lote.length} prospects (a partir do #${ARGS.skip + 1}) via Receita Federal\n`);

  const rows = [];
  for (const [i, p] of lote.entries()) {
    process.stdout.write(`${ARGS.skip + i + 1}. ${p.name.slice(0, 42)}... `);
    const e = await lookup(p.cnpj);
    const v = veredito(e, p);
    rows.push({ p, e, v });
    console.log(e ? `${v.status} ${e.uf || '??'}/${e.municipio || '??'} · ${e.porte || '?'}` : '❓ falhou');
    await sleep(ARGS.delayMs);
  }

  const ord = { '⭐': 0, '✅': 1, '🟡': 2, '❓': 3, '❌': 4 };
  rows.sort((a, b) => (ord[a.v.status] - ord[b.v.status]) || (b.p.wins - a.p.wins));

  const L = [];
  L.push('# Prospects enriquecidos — fornecedores do poder público (SC)');
  L.push('');
  L.push(`**Base:** \`${path.basename(ARGS.in)}\` (PNCP jul/2026) · **Enriquecido:** ${new Date().toISOString().slice(0, 10)}`);
  L.push('**Fonte do enriquecimento:** Receita Federal via publica.cnpj.ws / brasilapi (dados públicos)');
  L.push('');
  L.push('| Legenda | Significado |');
  L.push('|---|---|');
  L.push('| ⭐ | Porte maior **e** sede em SC — presencial viável, prioridade máxima |');
  L.push('| ✅ | Porte maior, sede fora de SC — abordar remoto |');
  L.push('| 🟡 | EPP — confirmar faturamento antes de investir tempo |');
  L.push('| ❌ | Reprovado (micro, ou CNPJ baixado) |');
  L.push('| ❓ | Lookup falhou — checar manualmente |');
  L.push('');
  L.push('| | Empresa | Sede | Porte | Contratos jul | E-mail | Telefone |');
  L.push('|---|---|---|---|---|---|---|');
  for (const { p, e, v } of rows) {
    const nome = (e?.fantasia || e?.razao || p.name).slice(0, 42);
    L.push(`| ${v.status} | ${nome} | ${e ? `${e.municipio}/${e.uf}` : '—'} | ${e?.porte || '—'} | ${p.wins} | ${e?.email || '—'} | ${e?.fone || '—'} |`);
  }
  L.push('');
  L.push('---');
  L.push('');
  L.push('## Detalhe');
  L.push('');
  for (const { p, e, v } of rows) {
    L.push(`### ${v.status} ${e?.razao || p.name}`);
    L.push(`- **CNPJ:** ${p.cnpj} · **Veredito:** ${v.nota}`);
    if (e) {
      L.push(`- **Sede:** ${e.municipio}/${e.uf} · **Porte:** ${e.porte} · **Capital social:** ${brl(e.capital)}`);
      L.push(`- **Contato:** ${e.email || '(sem e-mail na Receita)'} · ${e.fone || '(sem telefone)'}`);
      L.push(`- **CNAE:** ${e.cnae || '—'} · **Aberta em:** ${e.abertura || '—'}`);
    }
    L.push(`- **PNCP jul/26:** ${p.wins} contratos · ${brl(Math.round(p.totalBRL))} · ${p.municipios.length} municípios`);
    L.push(`- **Gancho:** "${p.wins} contratos com ${p.municipios.length} municípios diferentes em julho — quantos editais vocês leram pra chegar neles?"`);
    L.push('');
  }
  fs.mkdirSync(path.dirname(ARGS.out), { recursive: true });
  fs.writeFileSync(ARGS.out, `${L.join('\n')}\n`, 'utf8');

  const c = (s) => rows.filter((r) => r.v.status === s).length;
  console.log(`\n⭐ SC+porte: ${c('⭐')} · ✅ fora: ${c('✅')} · 🟡 EPP: ${c('🟡')} · ❌ reprovado: ${c('❌')} · ❓ falhou: ${c('❓')}`);
  console.log(`\nmd: ${ARGS.out}`);
}

main().catch((e) => { console.error(e.stack || e.message); process.exitCode = 1; });
