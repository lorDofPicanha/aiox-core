// Workflow REAL end-to-end: PDF de edital (do buscador) → parser → Faro→Prisma→Forja→Escriba.
// Fecha o loop com dado REAL (sem trecho sintetizado).
//
//   cd apps/noyce && OPENAI_API_KEY=… node --experimental-strip-types scripts/run-edital.mjs <pdf> [pncpId]
//
// <pdf>    caminho do PDF do edital (ex.: baixado da API do PNCP)
// [pncpId] id no snapshot p/ pegar metadados de triagem (distância/prazo); senão usa defaults.
// ⚠️ 3 chamadas gpt-5.5 (~2-3 min cada) → ~8-10 min.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { extractEdital } from "../lib/edital/extract-edital.ts";
import { fetchAndExtractEdital } from "../lib/edital/pncp-source.ts";
import { createLlmClient } from "../lib/agents/clients/client-factory.ts";
import { runTriage } from "../lib/agents/triage-agent.ts";
import { runAnalysis } from "../lib/agents/analysis-agent.ts";
import { runHabilitation } from "../lib/agents/habilitation-agent.ts";
import { runDocumentDraft } from "../lib/agents/document-agent.ts";
import { validateAnalysis, validateHabilitation } from "../lib/agents/guardrails.ts";

// Modos:
//   node run-edital.mjs --pncp <pncpId>   → baixa Edital + anexos da API (multi-doc)
//   node run-edital.mjs <pdf> [pncpId]    → um PDF local
const multiPncp = process.argv[2] === "--pncp" ? process.argv[3] : null;
const pdfPath = multiPncp ? null : process.argv[2];
const pncpId = multiPncp ?? process.argv[3];
if (!multiPncp && !pdfPath) {
  console.error("uso: node scripts/run-edital.mjs (--pncp <pncpId> | <pdf> [pncpId])");
  process.exit(1);
}
if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
  console.error("✗ defina OPENAI_API_KEY (ou ANTHROPIC_API_KEY).");
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const snap = JSON.parse(readFileSync(join(here, "../lib/data/discovery-snapshot.json"), "utf8"));
const item = (snap.items ?? []).find((x) => x.pncpId === pncpId);

const box = (t) => console.log(`\n${"═".repeat(66)}\n${t}\n${"═".repeat(66)}`);
const ms = (t0) => `${((Date.now() - t0) / 1000).toFixed(0)}s`;

// 0) PARSER — PDF(s) real(is) → seções + excerpt
box("0/4 · PARSER — edital → seções estruturadas");
let ed;
if (multiPncp) {
  ed = await fetchAndExtractEdital(multiPncp);
  console.log(`documentos ingeridos: ${ed.docs.join(" · ")}`);
} else {
  const buf = readFileSync(pdfPath);
  ed = await extractEdital({ pdfBuffer: new Uint8Array(buf) });
}
const objeto = (ed.sections.objeto || item?.title || "").replace(/\s+/g, " ").slice(0, 220);
console.log(`seções: ${ed.encontradas.join(", ")}`);
console.log(`valor estimado (parser): ${ed.valorEstimadoHint ? "R$ " + ed.valorEstimadoHint.toLocaleString("pt-BR") : "n/i"}`);
console.log(`excerpt: ${ed.excerpt.length} chars`);
console.log(`objeto: ${objeto.slice(0, 90)}...`);

const client = createLlmClient();
console.log(`provider: ${client.id}`);

// item de triagem: real do snapshot, ou montado a partir do parser
const triageItem = item ?? {
  id: pncpId ?? "edital",
  title: objeto,
  city: "?",
  uf: "?",
  distanceKm: 0,
  estimatedValue: ed.valorEstimadoHint,
  proposalDeadline: null,
  modality: "?",
  buyer: "?",
};

// 1) FARO
box("1/4 · FARO — triagem");
let t0 = Date.now();
const triage = await runTriage(triageItem, client);
console.log(`veredito: ${triage.verdict.toUpperCase()} (score ${triage.score}) · ${triage.source} · ${ms(t0)}`);
console.log(`razão: ${triage.reason}`);

// 2) PRISMA
box("2/4 · PRISMA — análise de oportunidade");
t0 = Date.now();
const analysis = await runAnalysis({ objeto, editalExcerpt: ed.excerpt }, client);
const aG = validateAnalysis(analysis);
console.log(`${analysis.source} · guardrail ${aG.ok ? "✓" : "✗"} · ${ms(t0)}`);
console.log(`opp ${analysis.opportunityScore} · conf ${analysis.confidenceScore} · riscos ${(analysis.riscos ?? []).length} · impugnação ${(analysis.pontosImpugnacao ?? []).length}`);

// 3) FORJA
box("3/4 · FORJA — habilitação");
t0 = Date.now();
const hab = await runHabilitation({ objeto, editalExcerpt: ed.excerpt, comConsorcio: true }, client);
const hG = validateHabilitation(hab);
console.log(`decisão ${hab.decisao} · ${hab.source} · guardrail ${hG.ok ? "✓" : "✗"} · ${ms(t0)}`);
console.log(`atestados ${(hab.matchingAtestados ?? []).length} · lacunas ${(hab.lacunas ?? []).length} · consórcio.necessário ${hab.consorcio?.necessario}`);

// 4) ESCRIBA
box("4/4 · ESCRIBA — pacote de participação");
t0 = Date.now();
const pkg = await runDocumentDraft({ objeto, editalExcerpt: ed.excerpt, comConsorcio: hab.decisao === "CONSORCIO" }, client);
console.log(`${pkg.source} (guardrail interno ${pkg.source === "llm" ? "✓" : "✗→fallback"}) · ${ms(t0)}`);
console.log(`proposta: validade ${pkg.proposta?.validadeDias ?? "?"}d · prazo ${pkg.proposta?.prazoExecucao ?? "?"}`);
console.log(`planilha: ${pkg.planilha ? `${pkg.planilha.linhas?.length} itens · BDI ${pkg.planilha.bdiPct}% · total R$ ${Number(pkg.planilha.total).toLocaleString("pt-BR")}` : "(não gerada)"}`);
console.log(`declarações: ${(pkg.declaracoes ?? []).length}`);
(pkg.declaracoes ?? []).forEach((d) => console.log(`  - ${d.tipo}`));
if (pkg.pendencias?.length) console.log(`pendências: ${JSON.stringify(pkg.pendencias).slice(0, 200)}`);

box("RESUMO — pacote de participação (edital REAL)");
const ok = [triage.source === "llm", analysis.source === "llm" && aG.ok, hab.source === "llm" && hG.ok, pkg.source === "llm" && Boolean(pkg.planilha)];
console.log(`Faro ${ok[0] ? "✓" : "✗"} · Prisma ${ok[1] ? "✓" : "✗"} · Forja ${ok[2] ? "✓" : "✗"} · Escriba ${ok[3] ? "✓" : "✗"}`);
console.log(`4 etapas no LLM: ${ok.every(Boolean) ? "SIM ✓" : "parcial"}`);
console.log(`Pacote (planilha + declarações): ${pkg.planilha && (pkg.declaracoes ?? []).length ? "montado ✓" : "parcial"}`);
console.log(`\nO sistema PREPARA o dossiê; humano decide/assina/submete (ato humano).`);
