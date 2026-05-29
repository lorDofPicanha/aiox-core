#!/usr/bin/env node
// READ-ONLY probe of the public PNCP consulta API to ground the competitor-intelligence design.
// No auth, no login, no credentials. Just GETs against pncp.gov.br/api/consulta/v1.
// Captures the REAL shape of winner/price/recurrence data we can mine for Stage 2/3.

const BASE = "https://pncp.gov.br/api/consulta/v1";

function ymd(d) {
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text.slice(0, 400); }
  return { status: res.status, body };
}

function fieldShape(obj, prefix = "", out = {}) {
  if (obj === null || typeof obj !== "object") return out;
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      fieldShape(v, key, out);
    } else {
      out[key] = Array.isArray(v) ? `array[${v.length}]` : (v === null ? "null" : typeof v);
    }
  }
  return out;
}

async function main() {
  const today = new Date("2026-05-29T00:00:00Z");
  const sixMonthsAgo = new Date(today.getTime() - 182 * 86400000);
  const di = ymd(sixMonthsAgo);
  const df = ymd(today);

  console.log(`# PNCP competitor probe — window ${di}..${df}\n`);

  // ---- PROBE 1: contratos nacional (winner structure + count) ----
  console.log("## PROBE 1 — /contratos (nacional, primeira página) — estrutura do VENCEDOR");
  const p1 = await getJson(`${BASE}/contratos?dataInicial=${di}&dataFinal=${df}&pagina=1&tamanhoPagina=10`);
  console.log("status:", p1.status);
  if (p1.status === 200 && p1.body?.data?.length) {
    console.log("totalRegistros:", p1.body.totalRegistros, "| totalPaginas:", p1.body.totalPaginas);
    console.log("campos do registro de contrato (vencedor/preço/órgão):");
    console.log(JSON.stringify(fieldShape(p1.body.data[0]), null, 1));
    const r = p1.body.data[0];
    console.log("\nexemplo real:", JSON.stringify({
      fornecedor: r.nomeRazaoSocialFornecedor, ni: r.niFornecedor,
      valorInicial: r.valorInicial, valorGlobal: r.valorGlobal,
      objeto: (r.objetoContrato || "").slice(0, 90),
      orgao: r?.orgaoEntidade?.razaoSocial,
      municipio: r?.unidadeOrgao?.municipioNome, uf: r?.unidadeOrgao?.ufSigla,
      dataAssinatura: r.dataAssinatura, ncpCompra: r.numeroControlePncpCompra,
    }, null, 1));
  } else {
    console.log("body:", JSON.stringify(p1.body).slice(0, 400));
  }

  // ---- PROBE 2: contratações publicacao Águas Lindas (achar CNPJ do órgão) ----
  console.log("\n## PROBE 2 — /contratacoes/publicacao Águas Lindas (IBGE 5200258, modalidade 4=concorrência)");
  const p2 = await getJson(`${BASE}/contratacoes/publicacao?dataInicial=${di}&dataFinal=${df}&codigoModalidadeContratacao=4&codigoMunicipioIbge=5200258&pagina=1&tamanhoPagina=10`);
  console.log("status:", p2.status);
  let buyerCnpj = null;
  if (p2.status === 200 && p2.body?.data?.length) {
    console.log("totalRegistros:", p2.body.totalRegistros);
    const sample = p2.body.data.slice(0, 5).map((r) => ({
      orgao: r?.orgaoEntidade?.razaoSocial, cnpj: r?.orgaoEntidade?.cnpj,
      municipio: r?.unidadeOrgao?.municipioNome, uf: r?.unidadeOrgao?.ufSigla,
      objeto: (r.objetoCompra || "").slice(0, 70), valor: r.valorTotalEstimado,
      modalidade: r.modalidadeNome, situacao: r.situacaoCompraNome,
    }));
    console.log(JSON.stringify(sample, null, 1));
    buyerCnpj = p2.body.data[0]?.orgaoEntidade?.cnpj;
  } else {
    console.log("body:", JSON.stringify(p2.body).slice(0, 400));
  }

  // ---- PROBE 3: contratos do órgão (cnpjOrgao) — histórico de vencedores ----
  if (buyerCnpj) {
    console.log(`\n## PROBE 3 — /contratos?cnpjOrgao=${buyerCnpj} — HISTÓRICO de vencedores do órgão`);
    const p3 = await getJson(`${BASE}/contratos?dataInicial=${di}&dataFinal=${df}&cnpjOrgao=${buyerCnpj}&pagina=1&tamanhoPagina=50`);
    console.log("status:", p3.status);
    if (p3.status === 200 && p3.body?.data?.length) {
      console.log("totalRegistros (contratos do órgão em 6m):", p3.body.totalRegistros);
      // concorrência: ranking de fornecedores
      const bySupplier = {};
      for (const r of p3.body.data) {
        const key = `${r.niFornecedor} · ${r.nomeRazaoSocialFornecedor}`;
        bySupplier[key] = bySupplier[key] || { n: 0, total: 0 };
        bySupplier[key].n += 1;
        bySupplier[key].total += Number(r.valorGlobal || r.valorInicial || 0);
      }
      const ranked = Object.entries(bySupplier).sort((a, b) => b[1].total - a[1].total);
      console.log("ranking de fornecedores vencedores (CNPJ · nome → nº contratos · R$ total):");
      for (const [k, v] of ranked.slice(0, 10)) {
        console.log(`  ${k} → ${v.n}x · R$ ${v.total.toLocaleString("pt-BR")}`);
      }
    } else {
      console.log("body:", JSON.stringify(p3.body).slice(0, 400));
    }
  }

  // ---- PROBE 4: Anápolis (drenagem) — confirma multi-município ----
  console.log("\n## PROBE 4 — /contratacoes/publicacao Anápolis (IBGE 5201108, modalidade 6=pregão)");
  const p4 = await getJson(`${BASE}/contratacoes/publicacao?dataInicial=${di}&dataFinal=${df}&codigoModalidadeContratacao=6&codigoMunicipioIbge=5201108&pagina=1&tamanhoPagina=5`);
  console.log("status:", p4.status, "| totalRegistros:", p4.body?.totalRegistros ?? "n/a");
}

main().catch((e) => { console.error("PROBE ERROR:", e.message); process.exit(1); });
