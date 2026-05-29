#!/usr/bin/env node
// Follow-up READ-ONLY probe: characterize cnpjOrgao flakiness + the bid->outcome join path.
const BASE = "https://pncp.gov.br/api/consulta/v1";
const ymd = (d) => d.toISOString().slice(0, 10).replace(/-/g, "");
async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const t = await res.text();
  let body; try { body = JSON.parse(t); } catch { body = t.slice(0, 300); }
  return { status: res.status, body };
}
function shape(o, p = "", out = {}) {
  if (o === null || typeof o !== "object") return out;
  for (const [k, v] of Object.entries(o)) {
    const key = p ? `${p}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) shape(v, key, out);
    else out[key] = Array.isArray(v) ? `array[${v.length}]` : (v === null ? "null" : typeof v);
  }
  return out;
}

async function main() {
  const today = new Date("2026-05-29T00:00:00Z");
  const win = (days) => ({ di: ymd(new Date(today.getTime() - days * 86400000)), df: ymd(today) });

  // A) cnpjOrgao on /contratos with NARROW window (30d) — transient vs broken?
  const w30 = win(30);
  console.log("## A — /contratos?cnpjOrgao=01616520000196 (30d window) retry x3");
  for (let i = 1; i <= 3; i++) {
    const r = await getJson(`${BASE}/contratos?dataInicial=${w30.di}&dataFinal=${w30.df}&cnpjOrgao=01616520000196&pagina=1&tamanhoPagina=20`);
    console.log(`  try${i}: status=${r.status} total=${r.body?.totalRegistros ?? "-"} ${r.status !== 200 ? JSON.stringify(r.body).slice(0, 120) : ""}`);
    await new Promise((res) => setTimeout(res, 800));
  }

  // B) Full shape of a contratacao record — find join keys (ano/sequencial/numeroControle)
  console.log("\n## B — /contratacoes/publicacao Águas Lindas — shape completo (chaves de join p/ desfecho)");
  const w182 = win(182);
  const b = await getJson(`${BASE}/contratacoes/publicacao?dataInicial=${w182.di}&dataFinal=${w182.df}&codigoModalidadeContratacao=4&codigoMunicipioIbge=5200258&pagina=1&tamanhoPagina=5`);
  if (b.status === 200 && b.body?.data?.length) {
    console.log(JSON.stringify(shape(b.body.data[0]), null, 1));
    const r = b.body.data[0];
    console.log("\njoin keys:", JSON.stringify({
      numeroControlePNCP: r.numeroControlePNCP, anoCompra: r.anoCompra,
      sequencialCompra: r.sequencialCompra, orgaoCnpj: r?.orgaoEntidade?.cnpj,
      situacao: r.situacaoCompraNome,
    }, null, 1));
  } else {
    console.log("status:", b.status, JSON.stringify(b.body).slice(0, 200));
  }

  // C) Anápolis correct IBGE 5201108 — modalidade 4 and 6, find why 400
  console.log("\n## C — Anápolis 5201108 modalidades 4 e 6");
  for (const mod of [4, 6]) {
    const r = await getJson(`${BASE}/contratacoes/publicacao?dataInicial=${w182.di}&dataFinal=${w182.df}&codigoModalidadeContratacao=${mod}&codigoMunicipioIbge=5201108&pagina=1&tamanhoPagina=3`);
    console.log(`  mod${mod}: status=${r.status} total=${r.body?.totalRegistros ?? "-"} ${r.status !== 200 ? JSON.stringify(r.body).slice(0, 150) : ""}`);
  }

  // D) Contratos nacional 30d — can we filter winners by codigoIbge our side at scale?
  console.log("\n## D — /contratos nacional 30d: volume + 1 página filtrável por codigoIbge");
  const d = await getJson(`${BASE}/contratos?dataInicial=${w30.di}&dataFinal=${w30.df}&pagina=1&tamanhoPagina=50`);
  if (d.status === 200) {
    const goItems = (d.body.data || []).filter((r) => r?.unidadeOrgao?.ufSigla === "GO");
    console.log(`  total nacional 30d: ${d.body.totalRegistros} | nesta página(50): GO=${goItems.length}`);
  }
}
main().catch((e) => console.error("ERR", e.message));
