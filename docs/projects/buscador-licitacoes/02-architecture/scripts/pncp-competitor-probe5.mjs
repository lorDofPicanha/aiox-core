#!/usr/bin/env node
// Authoritative per-bid result drill-down: enumerate Aguas Lindas concorrencias (reliable),
// then fetch the WINNER per item via the PNCP detail API. READ-ONLY.
const CONSULTA = "https://pncp.gov.br/api/consulta/v1";
const PNCP = "https://pncp.gov.br/api/pncp/v1";
const ymd = (d) => d.toISOString().slice(0, 10).replace(/-/g, "");
async function get(url, retries = 3) {
  for (let a = 0; a <= retries; a++) {
    const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), 12000);
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" }, signal: ctrl.signal });
      clearTimeout(to);
      if ([500, 502, 503, 429].includes(res.status)) { await new Promise(r => setTimeout(r, 500 * 2 ** a)); continue; }
      const t = await res.text(); let b; try { b = JSON.parse(t); } catch { b = t.slice(0, 150); }
      return { status: res.status, body: b };
    } catch { clearTimeout(to); await new Promise(r => setTimeout(r, 500 * 2 ** a)); }
  }
  return { status: 0, body: null };
}
const brl = (n) => "R$ " + Number(n || 0).toLocaleString("pt-BR", { maximumFractionDigits: 0 });

async function main() {
  const today = new Date("2026-05-29T00:00:00Z");
  const di = ymd(new Date(today.getTime() - 182 * 86400000)), df = ymd(today);
  console.log("# PROVA — vencedor real via drill-down de resultado (Águas Lindas)\n");

  const c = await get(`${CONSULTA}/contratacoes/publicacao?dataInicial=${di}&dataFinal=${df}&codigoModalidadeContratacao=4&codigoMunicipioIbge=5200258&pagina=1&tamanhoPagina=10`);
  if (c.status !== 200 || !c.body?.data?.length) { console.log("enum falhou:", c.status); return; }
  console.log(`concorrências enumeradas: ${c.body.totalRegistros}\n`);
  // keys for drill-down
  const sample = c.body.data.slice(0, 3).map(r => ({
    cnpj: r?.orgaoEntidade?.cnpj, ano: r.anoCompra, seq: r.sequencialCompra,
    ncp: r.numeroControlePNCP, obj: (r.objetoCompra || "").slice(0, 50), est: r.valorTotalEstimado,
  }));
  console.log("amostra (chaves de drill-down):", JSON.stringify(sample, null, 1));

  for (const s of sample) {
    if (!s.cnpj || !s.ano || !s.seq) continue;
    console.log(`\n--- compra ${s.cnpj}/${s.ano}/${s.seq} · est ${brl(s.est)} · ${s.obj}`);
    // items
    const it = await get(`${PNCP}/orgaos/${s.cnpj}/compras/${s.ano}/${s.seq}/itens?pagina=1&tamanhoPagina=20`);
    console.log("  itens status:", it.status, Array.isArray(it.body) ? `(${it.body.length} itens)` : "");
    if (it.status === 200 && Array.isArray(it.body) && it.body.length) {
      for (const item of it.body.slice(0, 3)) {
        const num = item.numeroItem;
        const rs = await get(`${PNCP}/orgaos/${s.cnpj}/compras/${s.ano}/${s.seq}/itens/${num}/resultados`);
        if (rs.status === 200 && Array.isArray(rs.body) && rs.body.length) {
          for (const r of rs.body.slice(0, 2)) {
            console.log(`    item ${num}: VENCEDOR ${r.nomeRazaoSocialFornecedor || r.niFornecedor} · ${brl(r.valorTotalHomologado || r.valorUnitarioHomologado)} · CNPJ ${r.niFornecedor}`);
          }
        } else {
          console.log(`    item ${num}: resultado status ${rs.status} (${Array.isArray(rs.body) ? rs.body.length + " linhas" : "sem array"})`);
        }
      }
    }
  }
}
main().catch(e => console.error("ERR", e.message));
