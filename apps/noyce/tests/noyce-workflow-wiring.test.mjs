// Fiação app→workflow: a orquestração runParticipationWorkflow roda as 4 etapas e monta o
// ParticipationResult. Usa um LlmClient FAKE (json:null → cada agente cai no fallback
// determinístico), então valida a ESTRUTURA/wiring sem chamar API. A QUALIDADE do LLM é o
// eval-gate quem mede; aqui é só o encanamento.
import assert from "node:assert/strict";
import { test } from "node:test";

const { runParticipationWorkflow } = await import("../lib/workflow/run-participation.ts");

// Fake: nunca retorna json válido → agentes usam o caminho determinístico.
const fakeClient = { id: "fake", async complete() { return { text: "", json: null, model: "fake" }; } };

const EXCERPT =
  "Objeto: Reforma e ampliação de escola municipal. Modalidade: Concorrência Eletrônica. Valor estimado: R$ 1.200.000,00. Prazo de execução: 180 dias. HABILITAÇÃO TÉCNICA: atestado CAT/CREA. GARANTIA: 1%.";

test("orquestra as 4 etapas e devolve ParticipationResult completo (modo excerpt, sem rede)", async () => {
  const r = await runParticipationWorkflow(
    {
      objeto: "Reforma e ampliação de escola municipal",
      editalExcerpt: EXCERPT,
      triageMeta: { distanceKm: 40, estimatedValue: 1200000, proposalDeadline: null, city: "Águas Lindas de Goiás", uf: "GO" },
    },
    { client: fakeClient },
  );

  assert.equal(r.objeto, "Reforma e ampliação de escola municipal");
  assert.equal(r.parser, null); // modo excerpt não usa parser
  // 4 estágios presentes
  assert.ok(["vai", "olha", "pula"].includes(r.triage.verdict));
  assert.ok(typeof r.analysis.guardrailOk === "boolean");
  assert.ok(typeof r.habilitation.decisao === "string");
  assert.ok(r.package && typeof r.package === "object");
  // summary montado
  assert.deepEqual(Object.keys(r.summary.stagesLlm).sort(), ["escriba", "faro", "forja", "prisma"]);
  assert.equal(r.summary.allLlm, false); // fake → tudo fallback, nada veio do LLM
  assert.equal(typeof r.summary.packageComplete, "boolean");
});

test("triageMeta alimenta o veredito (obra perto, prazo ok → não é pula por escopo/raio)", async () => {
  const r = await runParticipationWorkflow(
    {
      objeto: "Construção de creche",
      editalExcerpt: "Objeto: Construção de creche. Valor: R$ 900.000,00.",
      triageMeta: { distanceKm: 30, estimatedValue: 900000, proposalDeadline: new Date(Date.now() + 7 * 86_400_000).toISOString() },
    },
    { client: fakeClient },
  );
  // determinístico: obra (creche) no raio, valor na faixa → vai/olha, nunca pula por escopo.
  assert.notEqual(r.triage.verdict, "pula");
});
