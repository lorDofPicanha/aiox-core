#!/usr/bin/env node
// PROOF: build a REAL competitor-intelligence sample for one órgão from PNCP /contratos,
// paginating in monthly windows (avoids the 500 on wide windows). READ-ONLY, no auth.
const BASE = "https://pncp.gov.br/api/consulta/v1";
const ymd = (d) => d.toISOString().slice(0, 10).replace(/-/g, "");
async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const t = await res.text();
  let body; try { body = JSON.parse(t); } catch { body = t.slice(0, 200); }
  return { status: res.status, body };
}
function monthlyWindows(months) {
  const out = [];
  const end = new Date("2026-05-29T00:00:00Z");
  for (let i = 0; i < months; i++) {
    const df = new Date(end.getTime() - i * 30 * 86400000);
    const di = new Date(df.getTime() - 30 * 86400000);
    out.push({ di: ymd(di), df: ymd(df) });
  }
  return out;
}

async function contractsForOrg(cnpj, months = 12) {
  const all = [];
  for (const w of monthlyWindows(months)) {
    let pagina = 1, totalPaginas = 1;
    do {
      const r = await getJson(`${BASE}/contratos?dataInicial=${w.di}&dataFinal=${w.df}&cnpjOrgao=${cnpj}&pagina=${pagina}&tamanhoPagina=50`);
      if (r.status !== 200) { console.error(`  win ${w.di}-${w.df} p${pagina}: status ${r.status}`); break; }
      for (const c of r.body.data || []) all.push(c);
      totalPaginas = r.body.totalPaginas || 1;
      pagina++;
      await new Promise((res) => setTimeout(res, 400));
    } while (pagina <= totalPaginas);
  }
  // dedupe by numeroControlePNCP
  const seen = new Map();
  for (const c of all) seen.set(c.numeroControlePNCP, c);
  return [...seen.values()];
}

function brl(n) { return "R$ " + Number(n || 0).toLocaleString("pt-BR", { maximumFractionDigits: 0 }); }

async function main() {
  const ORG = { cnpj: "01616520000196", name: "Município de Águas Lindas de Goiás" };
  console.log(`# PROVA — Inteligência competitiva REAL: ${ORG.name} (12 meses)\n`);
  const contracts = await contractsForOrg(ORG.cnpj, 12);
  console.log(`Contratos recuperados (dedup): ${contracts.length}\n`);

  // Ranking de fornecedores (concorrentes que VENCEM aqui)
  const bySupplier = {};
  let grandTotal = 0;
  for (const c of contracts) {
    const v = Number(c.valorGlobal || c.valorInicial || 0);
    grandTotal += v;
    const key = c.niFornecedor || "sem-cnpj";
    bySupplier[key] = bySupplier[key] || { name: c.nomeRazaoSocialFornecedor, n: 0, total: 0, objs: [] };
    bySupplier[key].n += 1; bySupplier[key].total += v;
    if (bySupplier[key].objs.length < 2) bySupplier[key].objs.push((c.objetoContrato || "").slice(0, 50));
  }
  const ranked = Object.entries(bySupplier).sort((a, b) => b[1].total - a[1].total);

  // HHI (concentração de mercado) sobre R$
  const hhi = ranked.reduce((s, [, v]) => s + Math.pow((v.total / grandTotal) * 100, 2), 0);
  const concentration = hhi > 2500 ? "ALTAMENTE CONCENTRADO" : hhi > 1500 ? "MODERADO" : "PULVERIZADO";

  console.log(`Volume total contratado 12m: ${brl(grandTotal)} em ${contracts.length} contratos`);
  console.log(`Fornecedores distintos: ${ranked.length}`);
  console.log(`HHI (concentração): ${Math.round(hhi)} → ${concentration}\n`);
  console.log("TOP fornecedores vencedores (o que o app deveria chamar de 'concorrentes'):");
  for (const [cnpj, v] of ranked.slice(0, 8)) {
    const share = ((v.total / grandTotal) * 100).toFixed(1);
    console.log(`  ${v.name} (${cnpj})`);
    console.log(`    ${v.n} contrato(s) · ${brl(v.total)} · ${share}% do volume · ex: ${v.objs[0]}`);
  }

  // amostra crua p/ design
  console.log("\n# campos por contrato usados acima: niFornecedor, nomeRazaoSocialFornecedor, valorGlobal, objetoContrato, dataAssinatura, numeroControlePncpCompra");
}
main().catch((e) => console.error("ERR", e.message));
