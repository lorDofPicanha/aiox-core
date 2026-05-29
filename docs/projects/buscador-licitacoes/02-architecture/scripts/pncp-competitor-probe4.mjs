#!/usr/bin/env node
// ROBUST proof: real competitor ranking for one órgão, with timeout + retry/backoff
// (validates the exact resilience logic the real Stage-2 job will need). READ-ONLY.
const BASE = "https://pncp.gov.br/api/consulta/v1";
const ymd = (d) => d.toISOString().slice(0, 10).replace(/-/g, "");

async function getJson(url, { retries = 4 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 12000);
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" }, signal: ctrl.signal });
      clearTimeout(to);
      if (res.status === 204) return { status: 204, body: { data: [], totalPaginas: 0, totalRegistros: 0 } };
      if (res.status === 500 || res.status === 429 || res.status === 503) {
        await new Promise((r) => setTimeout(r, 600 * Math.pow(2, attempt))); // backoff
        continue;
      }
      const t = await res.text();
      let body; try { body = JSON.parse(t); } catch { body = t.slice(0, 200); }
      return { status: res.status, body };
    } catch (e) {
      clearTimeout(to);
      await new Promise((r) => setTimeout(r, 600 * Math.pow(2, attempt)));
    }
  }
  return { status: 0, body: { data: [], totalPaginas: 0, totalRegistros: 0 }, failed: true };
}

function monthlyWindows(months) {
  const out = []; const end = new Date("2026-05-29T00:00:00Z");
  for (let i = 0; i < months; i++) {
    const df = new Date(end.getTime() - i * 30 * 86400000);
    const di = new Date(df.getTime() - 30 * 86400000);
    out.push({ di: ymd(di), df: ymd(df) });
  }
  return out;
}
const brl = (n) => "R$ " + Number(n || 0).toLocaleString("pt-BR", { maximumFractionDigits: 0 });

async function main() {
  const ORG = { cnpj: "01616520000196", name: "Município de Águas Lindas de Goiás" };
  console.log(`# PROVA ROBUSTA — concorrência real: ${ORG.name} (6 meses, retry+backoff)\n`);
  const all = []; let win500 = 0, winEmpty = 0, winOk = 0;
  for (const w of monthlyWindows(6)) {
    const r = await getJson(`${BASE}/contratos?dataInicial=${w.di}&dataFinal=${w.df}&cnpjOrgao=${ORG.cnpj}&pagina=1&tamanhoPagina=50`);
    if (r.failed) { win500++; continue; }
    if ((r.body.data || []).length === 0) { winEmpty++; continue; }
    winOk++;
    for (const c of r.body.data) all.push(c);
  }
  const seen = new Map(); for (const c of all) seen.set(c.numeroControlePNCP, c);
  const contracts = [...seen.values()];
  console.log(`janelas: ok=${winOk} vazias=${winEmpty} falhas=${win500} | contratos(dedup)=${contracts.length}\n`);

  const bySupplier = {}; let grand = 0;
  for (const c of contracts) {
    const v = Number(c.valorGlobal || c.valorInicial || 0); grand += v;
    const key = c.niFornecedor || "sem-cnpj";
    bySupplier[key] = bySupplier[key] || { name: c.nomeRazaoSocialFornecedor, n: 0, total: 0, obj: "" };
    bySupplier[key].n++; bySupplier[key].total += v;
    if (!bySupplier[key].obj) bySupplier[key].obj = (c.objetoContrato || "").slice(0, 55);
  }
  const ranked = Object.entries(bySupplier).sort((a, b) => b[1].total - a[1].total);
  const hhi = grand > 0 ? ranked.reduce((s, [, v]) => s + Math.pow((v.total / grand) * 100, 2), 0) : 0;
  const conc = hhi > 2500 ? "ALTAMENTE CONCENTRADO" : hhi > 1500 ? "MODERADO" : "PULVERIZADO";

  console.log(`volume 6m: ${brl(grand)} · fornecedores distintos: ${ranked.length} · HHI=${Math.round(hhi)} (${conc})\n`);
  console.log("RANKING REAL de concorrentes vencedores:");
  for (const [cnpj, v] of ranked.slice(0, 10)) {
    console.log(`  ${v.name} (${cnpj}) → ${v.n}x · ${brl(v.total)} · ${((v.total / grand) * 100).toFixed(1)}% · ${v.obj}`);
  }
  if (!ranked.length) console.log("  (nenhum contrato recuperado — cnpjOrgao instável neste período; fallback = Dados Abertos bulk)");
}
main().catch((e) => console.error("ERR", e.message));
