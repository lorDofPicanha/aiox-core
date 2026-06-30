// Fase 3 (29/Jun): CORRIGIR por chat com a IA. Testa o módulo PURO (sem rede): o prompt carrega
// o documento + instrução + invariantes, e o parser rejeita saída vazia. A chamada ao LLM em si
// (/api/doc-chat) não é testada aqui (depende de provider), igual aos demais agentes.
import assert from "node:assert/strict";
import { test } from "node:test";

const { buildDocChatRequest, parseDocChatResponse, DOC_CHAT_SCHEMA } = await import("../lib/noyce-doc-chat.ts");

const INPUT = {
  docLabel: "Declaração de capacidade técnica",
  secao: "Qualificação Técnica (documento)",
  currentText: "A empresa declara que executou reforma predial de 208,90 m².",
  proveniencia: "Motor Noyce — CAT reforma-ceo",
  instruction: "esse atestado é só corresponsável, ajuste o texto",
  certame: { titulo: "Reforma de escola", orgao: "Prefeitura de Águas Lindas", empresa: "ENIAC LTDA" },
};

test("buildDocChatRequest carrega documento, instrução, fonte e dados do certame", () => {
  const req = buildDocChatRequest(INPUT);
  assert.equal(req.schema, DOC_CHAT_SCHEMA);
  assert.ok(req.system.length > 50, "system prompt presente");
  assert.match(req.user, /208,90/); // o texto atual entra no prompt
  assert.match(req.user, /corresponsável/); // a instrução entra
  assert.match(req.user, /reforma-ceo/); // a proveniência entra
  assert.match(req.user, /ENIAC LTDA/); // dados do certame entram
  assert.ok(typeof req.model === "string" && req.model.length > 0, "model definido");
});

test("system prompt veda inventar número e exige documento completo", () => {
  const req = buildDocChatRequest(INPUT);
  assert.match(req.system, /NUNCA invente/i);
  assert.match(req.system, /COMPLETO/i);
});

test("histórico de conversa entra no prompt quando presente", () => {
  const req = buildDocChatRequest({
    ...INPUT,
    history: [
      { role: "user", content: "tire a menção ao valor" },
      { role: "assistant", content: "removi o valor monetário" },
    ],
  });
  assert.match(req.user, /CONVERSA ANTERIOR/);
  assert.match(req.user, /removi o valor monetário/);
});

test("parseDocChatResponse aceita saída válida e rejeita vazia", () => {
  assert.deepEqual(
    parseDocChatResponse({ correctedText: "texto novo", explanation: "ajustei X" }),
    { correctedText: "texto novo", explanation: "ajustei X" },
  );
  assert.equal(parseDocChatResponse({ correctedText: "  ", explanation: "x" }), null, "texto vazio = null");
  assert.equal(parseDocChatResponse(null), null);
  assert.equal(parseDocChatResponse("nope"), null);
});
