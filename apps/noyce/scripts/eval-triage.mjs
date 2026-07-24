// Eval-gate (seed) da triagem: compara o VEREDITO do LLM (provider atual) contra a
// lógica DETERMINÍSTICA (buildTriage, o baseline confiável) sobre editais REAIS do
// snapshot de discovery. Mede taxa de concordância e lista divergências p/ revisão.
//
// NÃO é parte da suíte de testes (faz chamadas reais de API, consome crédito).
//   cd apps/noyce && OPENAI_API_KEY=sk-... node --experimental-strip-types scripts/eval-triage.mjs [N]
//
// Referência injetável mantém a avaliação reproduzível sem divergir do relógio de produção.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createLlmClient } from "../lib/agents/clients/client-factory.ts";
import { runTriage } from "../lib/agents/triage-agent.ts";
import { buildTriage } from "../lib/noyce-operational.ts";

const TRIAGE_TODAY = process.env.NOYCE_EVAL_AS_OF ?? new Date().toISOString();

if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
  console.error("\n✗ Defina OPENAI_API_KEY (ou ANTHROPIC_API_KEY).\n");
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const snapshot = JSON.parse(readFileSync(join(here, "../lib/data/discovery-snapshot.json"), "utf8"));
const all = snapshot.items ?? [];

const N = Math.max(1, Math.min(Number(process.argv[2]) || 12, all.length));
// Amostra determinística espaçada (cobre o snapshot inteiro, não só o começo).
const step = Math.max(1, Math.floor(all.length / N));
const sample = [];
for (let i = 0; i < all.length && sample.length < N; i += step) sample.push(all[i]);

const client = createLlmClient();
console.log(`provider: ${client.id} · amostra: ${sample.length}/${all.length} editais · ref: ${TRIAGE_TODAY.slice(0, 10)}\n`);

let agree = 0;
const rows = [];
for (const it of sample) {
  const input = {
    title: it.title,
    proposalDeadline: it.proposalDeadline ?? null,
    estimatedValue: it.estimatedValue ?? null,
    distanceKm: it.distanceKm,
  };
  const det = buildTriage(input);
  let llm;
  try {
    llm = await runTriage(it, client, TRIAGE_TODAY);
  } catch (e) {
    llm = { verdict: "ERRO", score: 0, source: "erro", reason: String(e?.message ?? e) };
  }
  const ok = det.verdict === llm.verdict;
  if (ok) agree++;
  rows.push({
    id: String(it.id).slice(0, 22),
    det: det.verdict,
    detS: det.score,
    llm: llm.verdict,
    llmS: llm.score,
    src: llm.source,
    ok,
    title: String(it.title).slice(0, 48),
  });
  process.stdout.write(ok ? "·" : "✗");
}

console.log("\n");
console.log("ID".padEnd(24) + "DET".padEnd(7) + "LLM".padEnd(7) + "scoreD/L".padEnd(12) + "src".padEnd(8) + "ok");
for (const r of rows) {
  console.log(
    r.id.padEnd(24) +
      r.det.padEnd(7) +
      r.llm.padEnd(7) +
      `${r.detS}/${r.llmS}`.padEnd(12) +
      String(r.src).padEnd(8) +
      (r.ok ? "✓" : "✗ DIVERGE"),
  );
}

const pct = ((agree / rows.length) * 100).toFixed(0);
console.log(`\n→ concordância de veredito: ${agree}/${rows.length} (${pct}%)`);
const llmCount = rows.filter((r) => r.src === "llm").length;
console.log(`→ vieram do LLM (não fallback): ${llmCount}/${rows.length}`);
const diverge = rows.filter((r) => !r.ok);
if (diverge.length) {
  console.log("\nDIVERGÊNCIAS (revisar):");
  for (const r of diverge) console.log(`  [${r.det} ✗ ${r.llm}] ${r.title}`);
}
