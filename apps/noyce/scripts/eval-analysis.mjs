// Eval-gate (qualidade) — Prisma (análise) + Forja (habilitação). Diferente da triagem,
// NÃO há baseline de veredito; o critério é QUALIDADE: guardrail PASS, veio do LLM (não
// fallback), e — o teste-chave — NÃO inventa número. De propósito NÃO passamos dados de
// mercado: um modelo honesto deve devolver faixaPreco/concorrência nulos com "PENDENTE_DADO",
// nunca um número fabricado.
//
//   cd apps/noyce && OPENAI_API_KEY=… node --experimental-strip-types scripts/eval-analysis.mjs [N]
//
// ⚠️ usa o tier de análise (gpt-5.5, raciocínio) → ~160s por chamada. N pequeno (default 2).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createLlmClient } from "../lib/agents/clients/client-factory.ts";
import { runAnalysis } from "../lib/agents/analysis-agent.ts";
import { runHabilitation } from "../lib/agents/habilitation-agent.ts";
import { buildTriage } from "../lib/noyce-operational.ts";
import { validateAnalysis, validateHabilitation } from "../lib/agents/guardrails.ts";

if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
  console.error("\n✗ Defina OPENAI_API_KEY (ou ANTHROPIC_API_KEY).\n");
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const snapshot = JSON.parse(readFileSync(join(here, "../lib/data/discovery-snapshot.json"), "utf8"));
const all = snapshot.items ?? [];

const N = Math.max(1, Math.min(Number(process.argv[2]) || 2, 6));

// Seleciona editais que o determinístico tria como vai/olha (valem análise) — grátis.
const candidates = all.filter((it) => {
  const t = buildTriage({
    title: it.title,
    proposalDeadline: it.proposalDeadline ?? null,
    estimatedValue: it.estimatedValue ?? null,
    distanceKm: it.distanceKm,
  });
  return t.verdict === "vai" || t.verdict === "olha";
});
const sample = candidates.slice(0, N);

// editalExcerpt sintetizado dos campos do headline (snapshot não tem texto integral).
// Requisitos de habilitação genéricos (típicos de obra pública). SEM dados de mercado.
function excerpt(it) {
  const val = it.estimatedValue ? `R$ ${it.estimatedValue.toLocaleString("pt-BR")}` : "não informado";
  return `Objeto: ${it.title}. Comprador: ${it.buyer ?? "?"} (${it.city}/${it.uf}). Modalidade: ${it.modality ?? "?"}. Valor estimado: ${val}. Prazo de proposta: ${it.proposalDeadline ?? "não informado"}. Requisitos de habilitação (conforme edital): atestado de capacidade técnica compatível com o objeto; regularidade fiscal (CND federal, FGTS, trabalhista); qualificação econômico-financeira com índices de liquidez; garantia de proposta quando exigida.`;
}

const client = createLlmClient();
console.log(`provider: ${client.id} · amostra: ${sample.length} editais (vai/olha) · SEM dados de mercado (testa anti-alucinação)\n`);

let prismaPass = 0;
let forjaPass = 0;
let prismaLlm = 0;
let forjaLlm = 0;
let inventedNumbers = 0;

for (const it of sample) {
  console.log("═".repeat(64));
  console.log(String(it.title).slice(0, 62));
  const ex = excerpt(it);

  // PRISMA (análise) — sem marketResumo de propósito.
  let analysis, aGuard;
  try {
    analysis = await runAnalysis({ objeto: it.title, editalExcerpt: ex }, client);
    aGuard = validateAnalysis(analysis);
  } catch (e) {
    analysis = { source: "erro" };
    aGuard = { ok: false, violations: [{ rule: "schema", detail: String(e?.message ?? e) }] };
  }
  if (aGuard.ok) prismaPass++;
  if (analysis?.source === "llm") prismaLlm++;
  // Anti-alucinação: sem dados de mercado, a mediana de preço DEVE ser null.
  const mediana = analysis?.faixaPreco?.mediana ?? null;
  const numberInvented = mediana !== null;
  if (numberInvented) inventedNumbers++;
  console.log(
    `  PRISMA  guard:${aGuard.ok ? "✓" : "✗"} src:${analysis?.source ?? "?"} ` +
      `opp:${analysis?.opportunityScore ?? "?"} conf:${analysis?.confidenceScore ?? "?"} ` +
      `faixaPreco.mediana:${mediana === null ? "null ✓(honesto)" : `${mediana} ✗(INVENTOU)`}`,
  );
  if (!aGuard.ok) console.log("    violações:", JSON.stringify(aGuard.violations).slice(0, 200));
  if (analysis?.source !== "llm" && analysis?.pendencias?.length)
    console.log("    motivo fallback:", JSON.stringify(analysis.pendencias).slice(0, 260));

  // FORJA (habilitação).
  let hab, hGuard;
  try {
    hab = await runHabilitation({ objeto: it.title, editalExcerpt: ex }, client);
    hGuard = validateHabilitation(hab);
  } catch (e) {
    hab = { source: "erro" };
    hGuard = { ok: false, violations: [{ rule: "schema", detail: String(e?.message ?? e) }] };
  }
  if (hGuard.ok) forjaPass++;
  if (hab?.source === "llm") forjaLlm++;
  console.log(
    `  FORJA   guard:${hGuard.ok ? "✓" : "✗"} src:${hab?.source ?? "?"} ` +
      `decisao:${hab?.decisao ?? "?"} fontes:${Array.isArray(hab?.fonte) ? hab.fonte.length : 0}`,
  );
  if (!hGuard.ok) console.log("    violações:", JSON.stringify(hGuard.violations).slice(0, 200));
  if (hab?.source !== "llm" && hab?.pendencias?.length)
    console.log("    motivo fallback:", JSON.stringify(hab.pendencias).slice(0, 260));
}

const n = sample.length;
console.log("\n" + "═".repeat(64));
console.log(`PRISMA  guardrail PASS: ${prismaPass}/${n} · do LLM: ${prismaLlm}/${n}`);
console.log(`FORJA   guardrail PASS: ${forjaPass}/${n} · do LLM: ${forjaLlm}/${n}`);
console.log(`Anti-alucinação (números inventados sem dado de mercado): ${inventedNumbers}/${n} ${inventedNumbers === 0 ? "✓" : "🔴"}`);
