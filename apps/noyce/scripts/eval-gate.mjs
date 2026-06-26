// GATE DE ACEITE do squad LLM (Noyce) — roda as 3 dimensões de eval (triagem, análise,
// workflow E2E), coleta métricas estruturadas, aplica os critérios objetivos de
// lib/eval/gate-criteria.ts e emite um VEREDITO PASS/FAIL + relatório JSON. Exit code
// 0=PASS, 1=FAIL/PARTIAL → usável como gate de CI ou pré-promoção do provider.
//
//   cd apps/noyce && OPENAI_API_KEY=… node --experimental-strip-types scripts/eval-gate.mjs [opções]
//
// Opções:
//   --dim=all|triage|analysis|workflow   dimensões a rodar (default: all)
//   --triage-n=12                        tamanho da amostra de triagem
//   --analysis-n=2                       editais de análise (gpt-5.5 ~160s cada → pequeno)
//   --no-write                           não grava o JSON em disco
//
// ⚠️ Faz chamadas reais de API (consome crédito). 'all' leva ~10-12 min (análise/workflow
// usam o tier de raciocínio). Para um check rápido e barato: --dim=triage.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createLlmClient } from "../lib/agents/clients/client-factory.ts";
import { runTriage } from "../lib/agents/triage-agent.ts";
import { runAnalysis } from "../lib/agents/analysis-agent.ts";
import { runHabilitation } from "../lib/agents/habilitation-agent.ts";
import { runDocumentDraft } from "../lib/agents/document-agent.ts";
import { buildTriage } from "../lib/noyce-operational.ts";
import { validateAnalysis, validateHabilitation } from "../lib/agents/guardrails.ts";
import { evaluateGate, isHardDivergence, GATE_CRITERIA } from "../lib/eval/gate-criteria.ts";

const TRIAGE_TODAY = "2026-05-29T00:00:00Z"; // mesma ref do baseline (buildTriage)

if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
  console.error("\n✗ Defina OPENAI_API_KEY (ou ANTHROPIC_API_KEY).\n");
  process.exit(1);
}

// ── args ──
const args = process.argv.slice(2);
const getArg = (k, def) => {
  const hit = args.find((a) => a.startsWith(`--${k}=`));
  return hit ? hit.split("=")[1] : def;
};
const dim = getArg("dim", "all");
const triageN = Math.max(1, Number(getArg("triage-n", 12)));
const analysisN = Math.max(1, Math.min(Number(getArg("analysis-n", 2)), 6));
const noWrite = args.includes("--no-write");
const runTri = dim === "all" || dim === "triage";
const runAna = dim === "all" || dim === "analysis";
const runWf = dim === "all" || dim === "workflow";

const here = dirname(fileURLToPath(import.meta.url));
const snapshot = JSON.parse(readFileSync(join(here, "../lib/data/discovery-snapshot.json"), "utf8"));
const all = snapshot.items ?? [];
const client = createLlmClient();

const triKey = (it) => ({
  title: it.title,
  proposalDeadline: it.proposalDeadline ?? null,
  estimatedValue: it.estimatedValue ?? null,
  distanceKm: it.distanceKm,
});

const box = (t) => console.log(`\n${"═".repeat(66)}\n${t}\n${"═".repeat(66)}`);
const ms = (t0) => `${((Date.now() - t0) / 1000).toFixed(0)}s`;

console.log(`GATE DE ACEITE — Noyce squad LLM`);
console.log(`provider: ${client.id} · dimensões: ${[runTri && "triagem", runAna && "análise", runWf && "workflow"].filter(Boolean).join(", ")}`);
console.log(`snapshot: ${all.length} editais · ref triagem: ${TRIAGE_TODAY.slice(0, 10)}`);

const gateInput = {};

// ── 1) TRIAGEM ──────────────────────────────────────────────────────────────
if (runTri) {
  box(`TRIAGEM (Faro) — amostra ${triageN}`);
  const step = Math.max(1, Math.floor(all.length / triageN));
  const sample = [];
  for (let i = 0; i < all.length && sample.length < triageN; i += step) sample.push(all[i]);

  let agree = 0, llmCount = 0, errors = 0, hard = 0;
  const diverge = [];
  const fallbacks = [];
  for (const it of sample) {
    const det = buildTriage(triKey(it));
    let llm;
    try {
      llm = await runTriage(it, client, TRIAGE_TODAY);
    } catch (e) {
      llm = { verdict: "ERRO", score: 0, source: "erro", reason: String(e?.message ?? e) };
      errors++;
    }
    if (llm.source === "llm") llmCount++;
    else if (llm.source !== "erro") fallbacks.push({ cause: llm.fallbackCause ?? "?", title: String(it.title).slice(0, 50) });
    const ok = det.verdict === llm.verdict;
    if (ok) agree++;
    else {
      const isHard = llm.verdict !== "ERRO" && isHardDivergence(det.verdict, llm.verdict);
      if (isHard) hard++;
      diverge.push({ det: det.verdict, llm: llm.verdict, hard: isHard, title: String(it.title).slice(0, 50) });
    }
    process.stdout.write(ok ? "·" : "✗");
  }
  console.log("");
  gateInput.triage = { total: sample.length, agree, llmCount, errors, hardDivergences: hard };
  console.log(`concordância ${agree}/${sample.length} · do LLM ${llmCount}/${sample.length} · erros ${errors} · duras ${hard}`);
  if (diverge.length) {
    console.log("divergências:");
    for (const d of diverge) console.log(`  [${d.det} ✗ ${d.llm}]${d.hard ? " 🔴DURA" : " (suave)"} ${d.title}`);
  }
  if (fallbacks.length) {
    console.log("fallbacks (não vieram do LLM — causa):");
    for (const f of fallbacks) console.log(`  [${f.cause}] ${f.title}`);
  }
}

// ── 2) ANÁLISE (Prisma + Forja) ───────────────────────────────────────────────
function excerpt(it) {
  const val = it.estimatedValue ? `R$ ${it.estimatedValue.toLocaleString("pt-BR")}` : "não informado";
  return `Objeto: ${it.title}. Comprador: ${it.buyer ?? "?"} (${it.city}/${it.uf}). Modalidade: ${it.modality ?? "?"}. Valor estimado: ${val}. Prazo de proposta: ${it.proposalDeadline ?? "não informado"}. Requisitos de habilitação (conforme edital): atestado de capacidade técnica compatível com o objeto; regularidade fiscal (CND federal, FGTS, trabalhista); qualificação econômico-financeira com índices de liquidez; garantia de proposta quando exigida.`;
}

if (runAna) {
  box(`ANÁLISE (Prisma/Forja) — amostra ${analysisN} · SEM dados de mercado (anti-alucinação)`);
  const candidates = all.filter((it) => {
    const t = buildTriage(triKey(it));
    return t.verdict === "vai" || t.verdict === "olha";
  });
  const sample = candidates.slice(0, analysisN);
  let prismaPass = 0, forjaPass = 0, prismaLlm = 0, forjaLlm = 0, inventedNumbers = 0;

  for (const it of sample) {
    console.log("─".repeat(50));
    console.log(String(it.title).slice(0, 48));
    const ex = excerpt(it);
    let t0 = Date.now();
    let analysis, aG;
    try {
      analysis = await runAnalysis({ objeto: it.title, editalExcerpt: ex }, client);
      aG = validateAnalysis(analysis);
    } catch (e) {
      analysis = { source: "erro" };
      aG = { ok: false, violations: [{ rule: "schema", detail: String(e?.message ?? e) }] };
    }
    if (aG.ok) prismaPass++;
    if (analysis?.source === "llm") prismaLlm++;
    const mediana = analysis?.faixaPreco?.mediana ?? null;
    if (mediana !== null) inventedNumbers++;
    console.log(`  PRISMA guard:${aG.ok ? "✓" : "✗"} src:${analysis?.source ?? "?"} mediana:${mediana === null ? "null ✓" : `${mediana} 🔴INVENTOU`} ${ms(t0)}`);

    t0 = Date.now();
    let hab, hG;
    try {
      hab = await runHabilitation({ objeto: it.title, editalExcerpt: ex }, client);
      hG = validateHabilitation(hab);
    } catch (e) {
      hab = { source: "erro" };
      hG = { ok: false, violations: [{ rule: "schema", detail: String(e?.message ?? e) }] };
    }
    if (hG.ok) forjaPass++;
    if (hab?.source === "llm") forjaLlm++;
    console.log(`  FORJA  guard:${hG.ok ? "✓" : "✗"} src:${hab?.source ?? "?"} decisao:${hab?.decisao ?? "?"} ${ms(t0)}`);
  }
  gateInput.analysis = { n: sample.length, prismaPass, forjaPass, prismaLlm, forjaLlm, inventedNumbers };
  console.log(`\nPRISMA pass ${prismaPass}/${sample.length} · FORJA pass ${forjaPass}/${sample.length} · inventados ${inventedNumbers}`);
}

// ── 3) WORKFLOW E2E ───────────────────────────────────────────────────────────
if (runWf) {
  box(`WORKFLOW E2E (Faro→Prisma→Forja→Escriba) — 1 edital`);
  const item =
    all.find((it) => buildTriage(triKey(it)).verdict === "vai") ?? all[0];
  // Trecho realista (stand-in do PDF integral): habilitação + orçamento + declarações.
  const editalExcerpt = `Objeto: ${item.title}. Comprador: ${item.buyer ?? "Município"} (${item.city}/${item.uf}). Modalidade: ${item.modality ?? "Concorrência Eletrônica"}. Valor estimado: ${item.estimatedValue ? `R$ ${item.estimatedValue.toLocaleString("pt-BR")}` : "R$ 1.350.000,00"}. Prazo de execução: 180 dias. Validade da proposta: 60 dias.

HABILITAÇÃO TÉCNICA: atestado de capacidade técnica (CAT/CREA) de obra de edificação pública compatível; RT com CAT; admite soma de 2 atestados.
HABILITAÇÃO ECONÔMICO-FINANCEIRA: balanço com índices de liquidez ≥ 1,0; patrimônio líquido ≥ 10% do valor; certidão de falência.
HABILITAÇÃO FISCAL: CND federal, FGTS, CNDT, estadual e municipal.
GARANTIA DE PROPOSTA: 1% do valor. Admite CONSÓRCIO (art. 15 Lei 14.133/2021).

ORÇAMENTO DE REFERÊNCIA (preços-teto): 1) Demolição alvenaria m³ 60 R$95,00; 2) Alvenaria bloco m² 420 R$88,00; 3) Reboco m² 850 R$52,00; 4) Pintura m² 1500 R$28,00; 5) Cobertura metálica m² 400 R$240,00; 6) Piso cerâmico m² 600 R$78,00. BDI 22%.

DECLARAÇÕES EXIGIDAS: elaboração independente; inexistência de fato impeditivo; art. 7º XXXIII CF (menor); ME/EPP; nepotismo.`;

  console.log(`EDITAL: ${String(item.title).slice(0, 60)} · ${item.city}/${item.uf}`);
  const stagesLlm = {};

  let t0 = Date.now();
  const triage = await runTriage(item, client);
  stagesLlm.faro = triage.source === "llm";
  console.log(`FARO    ${triage.verdict} src:${triage.source} ${ms(t0)}`);

  t0 = Date.now();
  const analysis = await runAnalysis({ objeto: item.title, editalExcerpt, marketResumo: "Mercado regional de obras públicas DF/Entorno." }, client);
  stagesLlm.prisma = analysis.source === "llm" && validateAnalysis(analysis).ok;
  console.log(`PRISMA  src:${analysis.source} opp:${analysis.opportunityScore ?? "?"} ${ms(t0)}`);

  t0 = Date.now();
  const hab = await runHabilitation({ objeto: item.title, editalExcerpt, comConsorcio: true }, client);
  stagesLlm.forja = hab.source === "llm" && validateHabilitation(hab).ok;
  console.log(`FORJA   decisao:${hab.decisao} src:${hab.source} ${ms(t0)}`);

  t0 = Date.now();
  const pkg = await runDocumentDraft({ objeto: item.title, editalExcerpt, comConsorcio: hab.decisao === "CONSORCIO" }, client);
  stagesLlm.escriba = pkg.source === "llm" && Boolean(pkg.planilha);
  const packageComplete = Boolean(pkg.planilha) && (pkg.declaracoes ?? []).some((d) => d.fonte);
  console.log(`ESCRIBA src:${pkg.source} planilha:${pkg.planilha ? pkg.planilha.linhas?.length + " itens" : "não"} decl:${(pkg.declaracoes ?? []).length} ${ms(t0)}`);

  gateInput.workflow = { stagesLlm, packageComplete };
}

// ── VEREDITO ──────────────────────────────────────────────────────────────────
const result = evaluateGate(gateInput);
box("VEREDITO DO GATE DE ACEITE");
for (const d of result.dimensions) {
  console.log(`\n${d.pass ? "✅" : "❌"} ${d.dimension.toUpperCase()}`);
  for (const c of d.checks) {
    console.log(`   ${c.pass ? "✓" : "✗"} ${c.name.padEnd(46)} ${c.actual.padEnd(20)} (limite ${c.limit})`);
  }
}
if (result.skipped.length) console.log(`\n⏭️  puladas (não rodadas): ${result.skipped.join(", ")}`);

const verdict = result.pass ? "PASS ✅" : result.partial && result.dimensions.every((d) => d.pass) ? "PARCIAL (rodar dimensões faltantes) ⚠️" : "FAIL ❌";
console.log(`\n${"═".repeat(66)}\nGATE: ${verdict}\n${"═".repeat(66)}`);

// ── relatório JSON ──
if (!noWrite) {
  const report = {
    generatedAt: new Date().toISOString(),
    provider: client.id,
    snapshotGeneratedAt: snapshot.generatedAt ?? null,
    criteria: GATE_CRITERIA,
    metrics: gateInput,
    result,
  };
  const outDir = join(here, "../lib/data");
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, "eval-gate-report.json");
  writeFileSync(outFile, JSON.stringify(report, null, 2));
  console.log(`\nrelatório: ${outFile}`);
}

process.exit(result.pass ? 0 : 1);
