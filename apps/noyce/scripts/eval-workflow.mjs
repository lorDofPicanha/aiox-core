// Teste END-TO-END do workflow de participação: Faro (triagem) → Prisma (análise) →
// Forja (habilitação) → Escriba (documentos). Roda a cadeia inteira sobre UM edital real
// e reporta se o "pacote de participação" sai completo + o que ainda bloquearia a submissão.
//
//   cd apps/noyce && OPENAI_API_KEY=… node --experimental-strip-types scripts/eval-workflow.mjs
//
// ⚠️ 3 chamadas gpt-5.5 (análise/habilitação/documentos) ~2-3 min cada → ~8-10 min total.
// O snapshot só tem o headline do edital; aqui injetamos um TRECHO realista (habilitação +
// orçamento de referência + declarações + prazos) p/ simular o edital integral. Em produção,
// esse trecho vem do PDF real do edital (parser).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createLlmClient } from "../lib/agents/clients/client-factory.ts";
import { runTriage } from "../lib/agents/triage-agent.ts";
import { runAnalysis } from "../lib/agents/analysis-agent.ts";
import { runHabilitation } from "../lib/agents/habilitation-agent.ts";
import { runDocumentDraft } from "../lib/agents/document-agent.ts";
import { buildTriage } from "../lib/noyce-operational.ts";
import { validateAnalysis, validateHabilitation, validateDocumentPackage } from "../lib/agents/guardrails.ts";

if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
  console.error("\n✗ Defina OPENAI_API_KEY (ou ANTHROPIC_API_KEY).\n");
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const snapshot = JSON.parse(readFileSync(join(here, "../lib/data/discovery-snapshot.json"), "utf8"));
const all = snapshot.items ?? [];

// Pega um edital real que o determinístico tria como "vai" (obra dentro do perfil).
const item =
  all.find((it) => {
    const t = buildTriage({ title: it.title, proposalDeadline: it.proposalDeadline ?? null, estimatedValue: it.estimatedValue ?? null, distanceKm: it.distanceKm });
    return t.verdict === "vai";
  }) ?? all[0];

// Trecho de edital REALISTA (stand-in do PDF integral) — habilitação + orçamento de
// referência + declarações exigidas + prazos. Em produção vem do parser do edital.
const editalExcerpt = `Objeto: ${item.title}. Comprador: ${item.buyer ?? "Município"} (${item.city}/${item.uf}). Modalidade: ${item.modality ?? "Concorrência Eletrônica"}. Valor estimado: ${item.estimatedValue ? `R$ ${item.estimatedValue.toLocaleString("pt-BR")}` : "R$ 1.350.000,00"}. Prazo de execução: 180 dias. Validade da proposta: 60 dias.

HABILITAÇÃO TÉCNICA: atestado de capacidade técnica (CAT/CREA) comprovando execução de obra de edificação pública / escolar de área compatível; profissional responsável (RT) com CAT; admite-se soma de até 2 atestados.
HABILITAÇÃO ECONÔMICO-FINANCEIRA: balanço patrimonial do último exercício com índices de Liquidez Geral, Liquidez Corrente e Solvência Geral ≥ 1,0; capital social ou patrimônio líquido mínimo de 10% do valor estimado; certidão negativa de falência.
HABILITAÇÃO FISCAL: CND federal, FGTS, trabalhista (CNDT), estadual e municipal.
GARANTIA DE PROPOSTA: 1% do valor estimado. Admite-se participação em CONSÓRCIO (art. 15 Lei 14.133/2021).

ORÇAMENTO DE REFERÊNCIA (planilha do edital, preços-teto):
1) Demolição de alvenaria — m³ — qtd 60 — R$ 95,00/m³;
2) Alvenaria de vedação bloco cerâmico — m² — qtd 420 — R$ 88,00/m²;
3) Revestimento/reboco — m² — qtd 850 — R$ 52,00/m²;
4) Pintura látex acrílica — m² — qtd 1.500 — R$ 28,00/m²;
5) Cobertura metálica (telha + estrutura) — m² — qtd 400 — R$ 240,00/m²;
6) Piso cerâmico — m² — qtd 600 — R$ 78,00/m².
BDI de referência do edital: 22%.

DECLARAÇÕES EXIGIDAS (modelos anexos): elaboração independente de proposta; inexistência de fato impeditivo; cumprimento do art. 7º, XXXIII, CF (não emprega menor); enquadramento ME/EPP (se aplicável); inexistência de parentesco (nepotismo).`;

const client = createLlmClient();
const box = (t) => console.log(`\n${"═".repeat(66)}\n${t}\n${"═".repeat(66)}`);
const ms = (t0) => `${((Date.now() - t0) / 1000).toFixed(0)}s`;

console.log(`provider: ${client.id}`);
console.log(`EDITAL: ${String(item.title).slice(0, 70)}`);
console.log(`  ${item.city}/${item.uf} · ${item.distanceKm}km · ${item.estimatedValue ? "R$ " + item.estimatedValue.toLocaleString("pt-BR") : "valor n/i"} · prazo ${item.proposalDeadline ?? "n/i"}`);

const report = { stages: {} };

// 1) FARO — triagem
box("1/4 · FARO — triagem (vale a pena?)");
let t0 = Date.now();
const triage = await runTriage(item, client);
console.log(`veredito: ${triage.verdict.toUpperCase()} (score ${triage.score}) · origem: ${triage.source} · ${ms(t0)}`);
console.log(`razão: ${triage.reason}`);
report.stages.faro = { ok: triage.source === "llm", verdict: triage.verdict };

// 2) PRISMA — análise de oportunidade
box("2/4 · PRISMA — análise de oportunidade");
t0 = Date.now();
const analysis = await runAnalysis({ objeto: item.title, editalExcerpt, marketResumo: "Mercado regional de obras públicas DF/Entorno; concorrência por construtoras de pequeno/médio porte." }, client);
const aG = validateAnalysis(analysis);
console.log(`origem: ${analysis.source} · guardrail: ${aG.ok ? "✓" : "✗"} · ${ms(t0)}`);
console.log(`opportunityScore: ${analysis.opportunityScore} · confidence: ${analysis.confidenceScore}`);
console.log(`riscos: ${(analysis.riscos ?? []).length} · pontosImpugnação: ${(analysis.pontosImpugnacao ?? []).length} · fontes: ${(analysis.fonte ?? []).length}`);
if (analysis.pendencias?.length) console.log(`pendências: ${JSON.stringify(analysis.pendencias).slice(0, 200)}`);
report.stages.prisma = { ok: analysis.source === "llm" && aG.ok };

// 3) FORJA — habilitação
box("3/4 · FORJA — habilitação (consigo habilitar?)");
t0 = Date.now();
const hab = await runHabilitation({ objeto: item.title, editalExcerpt, comConsorcio: true }, client);
const hG = validateHabilitation(hab);
console.log(`decisão: ${hab.decisao} · origem: ${hab.source} · guardrail: ${hG.ok ? "✓" : "✗"} · ${ms(t0)}`);
console.log(`atestados casados: ${(hab.matchingAtestados ?? []).length} · lacunas: ${(hab.lacunas ?? []).length} · consórcio.necessário: ${hab.consorcio?.necessario}`);
if (hab.pendencias?.length) console.log(`pendências: ${JSON.stringify(hab.pendencias).slice(0, 200)}`);
report.stages.forja = { ok: hab.source === "llm" && hG.ok, decisao: hab.decisao };

// 4) ESCRIBA — pacote documental (proposta + planilha + declarações)
box("4/4 · ESCRIBA — pacote de participação (proposta + planilha + declarações)");
t0 = Date.now();
const pkg = await runDocumentDraft({ objeto: item.title, editalExcerpt, comConsorcio: hab.decisao === "CONSORCIO" }, client);
// NB: o guardrail é aplicado DENTRO de runDocumentDraft (sobre a saída crua do LLM). Aqui o
// pkg já vem COMPUTADO (planilha.linhas/total) — então source==="llm" já implica guardrail OK.
console.log(`origem: ${pkg.source} (guardrail interno ${pkg.source === "llm" ? "✓ passou" : "✗ → fallback"}) · ${ms(t0)}`);
console.log(`proposta: validade ${pkg.proposta?.validadeDias ?? "?"}d · prazo ${pkg.proposta?.prazoExecucao ?? "?"}`);
if (pkg.planilha) {
  console.log(`planilha: ${pkg.planilha.linhas?.length ?? 0} itens · BDI ${pkg.planilha.bdiPct}% · TOTAL R$ ${Number(pkg.planilha.total ?? 0).toLocaleString("pt-BR")}`);
} else {
  console.log("planilha: (não gerada)");
}
console.log(`declarações: ${(pkg.declaracoes ?? []).length}`);
(pkg.declaracoes ?? []).forEach((d) => console.log(`  - ${d.tipo ?? d.titulo ?? "decl"}: fonte ${d.fonte ? "✓" : "✗"}`));
if (pkg.pendencias?.length) console.log(`pendências: ${JSON.stringify(pkg.pendencias).slice(0, 300)}`);
report.stages.escriba = { ok: pkg.source === "llm" && Boolean(pkg.planilha) };

// ── Veredito do workflow ──
box("RESUMO DO WORKFLOW DE PARTICIPAÇÃO");
const stages = ["faro", "prisma", "forja", "escriba"];
for (const s of stages) console.log(`  ${s.toUpperCase().padEnd(8)} ${report.stages[s]?.ok ? "✓ LLM+guardrail" : "✗ caiu em fallback/violação"}`);
const allOk = stages.every((s) => report.stages[s]?.ok);
const pkgComplete = Boolean(pkg.planilha) && (pkg.declaracoes ?? []).length > 0;
console.log(`\nWorkflow rodou as 4 etapas no LLM: ${allOk ? "SIM ✓" : "NÃO (alguma etapa em fallback)"}`);
console.log(`Pacote de participação montado (planilha + declarações): ${pkgComplete ? "SIM ✓" : "PARCIAL/NÃO"}`);
console.log(`Decisão de habilitação: ${report.stages.forja?.decisao ?? "?"}`);
console.log(`\nNOTA: o sistema PREPARA tudo (análise, habilitação, planilha de preços, declarações) para a DECISÃO e ASSINATURA humanas — nunca submete (ato humano). Em produção o trecho do edital vem do PDF real; aqui foi simulado.`);
