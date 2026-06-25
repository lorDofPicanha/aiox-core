// Smoke-test dos agentes LLM REAIS (Faro → Prisma) contra o cliente Claude de produção.
// NÃO é parte da suíte de testes (que usa fake client, zero custo). Este script FAZ chamadas
// de API reais e CONSOME crédito do pool metered (pós-15/Jun). Use só pra validar a fiação.
//
//   cd apps/noyce && npm i @anthropic-ai/sdk     # uma vez
//   ANTHROPIC_API_KEY=sk-ant-... node --experimental-strip-types scripts/smoke-agents.mjs
//
// Flags:  --faro-only   roda só a triagem (Faro=haiku, mais barato)
//
// Faro usa claude-haiku-4-5 (barato, alto volume); Prisma usa claude-opus-4-8.

import { createLlmClient } from "../lib/agents/clients/client-factory.ts";
import { runTriage, FARO_DEFINITION } from "../lib/agents/triage-agent.ts";
import { runAnalysis } from "../lib/agents/analysis-agent.ts";
import { validateTriage } from "../lib/agents/guardrails.ts";

if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
  console.error("\n✗ Defina OPENAI_API_KEY (provider OpenAI) ou ANTHROPIC_API_KEY (Claude). Ex.:\n  OPENAI_API_KEY=sk-... node --experimental-strip-types scripts/smoke-agents.mjs\n");
  process.exit(1);
}

const faroOnly = process.argv.includes("--faro-only");

// Edital real de exemplo (perfil ENIAC: obra, dentro do raio, prazo aberto).
const item = {
  id: "smoke-1",
  title: "Reforma e ampliação de escola municipal de ensino fundamental",
  city: "Águas Lindas de Goiás",
  uf: "GO",
  distanceKm: 42,
  estimatedValue: 1_350_000,
  proposalDeadline: new Date(Date.now() + 18 * 86400000).toISOString(),
  modality: "Pregão Eletrônico",
  buyer: "Prefeitura de Águas Lindas de Goiás",
};

const client = createLlmClient();
console.log(`provider: ${client.id}`);

function box(title) { console.log(`\n${"═".repeat(60)}\n${title}\n${"═".repeat(60)}`); }

box(`FARO (triagem) — ${FARO_DEFINITION.model}`);
console.log("Input:", item.title, `· ${item.distanceKm}km · R$${item.estimatedValue.toLocaleString("pt-BR")}`);
const t0 = Date.now();
const triage = await runTriage(item, client);
console.log(`\n→ veredito: ${triage.verdict}  (score ${triage.score})  [${Date.now() - t0}ms]`);
console.log("  razão:", triage.reason);
console.log("  pontos de atenção:", triage.pontosAtencao);
// M7 — se o resultado NÃO veio da LLM, é fallback determinístico (a fiação real
// não rodou): a API errou/recusou ou o guardrail reprovou. Avisar alto.
console.log(`  origem: ${triage.source}`);
if (triage.source !== "llm") {
  console.warn(
    `  ⚠️  AVISO: source="${triage.source}" — a triagem caiu no fallback determinístico, NÃO veio da LLM.\n` +
      "     Verifique a chamada à API (modelo/effort/thinking), recusa do classificador ou violação de guardrail.",
  );
}
const gr = validateTriage(triage, item);
console.log(`  guardrails: ${gr.ok ? "✓ PASS" : "✗ VIOLAÇÕES → " + JSON.stringify(gr.violations)}`);

if (!faroOnly && (triage.verdict === "vai" || triage.verdict === "olha")) {
  box("PRISMA (análise de oportunidade) — claude-opus-4-8");
  const t1 = Date.now();
  const analysis = await runAnalysis(
    {
      objeto: item.title,
      editalExcerpt:
        "Objeto: reforma e ampliação de escola municipal (1.350 m²). Exige atestado de capacidade técnica em obra escolar/edificação pública, CND federal/FGTS/trabalhista, balanço com índices de liquidez ≥ 1,0, garantia de proposta de 1%. Prazo de execução: 180 dias.",
      marketResumo: "Mercado regional de obras públicas DF/Entorno; concorrência por construtoras de pequeno/médio porte.",
    },
    client,
  );
  console.log(`\n→ análise concluída [${Date.now() - t1}ms]`);
  console.log(JSON.stringify(analysis, null, 2));
}

console.log("\n✓ smoke-test concluído.\n");
