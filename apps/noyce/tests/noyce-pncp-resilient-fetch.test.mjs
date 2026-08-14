import assert from "node:assert/strict";
import { test } from "node:test";

const { backoffFor, classifyResponse, fetchPncpAllPages, fetchPncpPage, judgeCoverage, PNCP_DEFAULTS } = await import(
  "../lib/sources/pncp-resilient-fetch.ts"
);

const noSleep = async () => {};
const url = "https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao?pagina=1";

/** fetch falso que devolve uma resposta por chamada, na ordem. */
function scriptedFetch(steps) {
  let index = 0;
  const calls = [];
  const impl = async (requestedUrl) => {
    calls.push(requestedUrl);
    const step = steps[Math.min(index++, steps.length - 1)];
    if (step.throw) {
      const error = new Error(step.throw === "abort" ? "The operation was aborted" : "network down");
      error.name = step.throw === "abort" ? "AbortError" : "TypeError";
      throw error;
    }
    return { status: step.status, text: async () => step.body ?? "" };
  };
  impl.calls = calls;
  return impl;
}

const okBody = JSON.stringify({ data: [{ id: 1 }, { id: 2 }], totalPaginas: 1 });

// ---------------------------------------------------------------------------
// Classificação — o coração do módulo
// ---------------------------------------------------------------------------

test("204 e corpo vazio são AUSÊNCIA, não falha", () => {
  assert.equal(classifyResponse(204, "").kind, "empty");
  assert.equal(classifyResponse(200, "   ").kind, "empty");
});

test("HTTP 200 com corpo HTML é RETENTÁVEL, não 'não achado'", () => {
  // Este é o bug que custou 3 dos 6 misses do kill-gate: o WAF do PNCP devolve
  // "<html>…" com status 200 e o JSON.parse ingênuo virava ausência.
  const verdict = classifyResponse(200, "<html><head><title>Error</title></head></html>");
  assert.equal(verdict.kind, "retryable");
  assert.equal(verdict.failure, "html_body");
});

test("5xx, 408 e 429 são retentáveis", () => {
  for (const status of [500, 502, 503, 504, 408, 429]) {
    assert.equal(classifyResponse(status, "erro").kind, "retryable", `status ${status}`);
  }
});

test("4xx de cliente é FATAL — repetir não conserta query inválida", () => {
  const verdict = classifyResponse(422, "unprocessable");
  assert.equal(verdict.kind, "fatal");
  assert.equal(verdict.failure, "client_error");
});

test("JSON sem 'data' não quebra e vira lista vazia", () => {
  const verdict = classifyResponse(200, JSON.stringify({ totalPaginas: 0 }));
  assert.equal(verdict.kind, "ok");
  assert.deepEqual(verdict.data, []);
});

// ---------------------------------------------------------------------------
// Backoff
// ---------------------------------------------------------------------------

test("backoff cresce exponencialmente e respeita o teto", () => {
  const values = [1, 2, 3, 4, 5, 6].map((attempt) => backoffFor(attempt, 1000, 20000));
  for (let i = 1; i < values.length; i++) assert.ok(values[i] >= values[i - 1], "não pode diminuir");
  assert.ok(values.at(-1) <= 20000, "teto respeitado");
});

test("timeout padrão comporta a latência real medida no PNCP (62,6 s)", () => {
  assert.ok(PNCP_DEFAULTS.timeoutMs > 62_600, "o gate antigo usava 12s e abortava respostas legítimas");
});

// ---------------------------------------------------------------------------
// Retry e telemetria
// ---------------------------------------------------------------------------

test("retenta o 500 e devolve o dado quando a API se recupera", async () => {
  const impl = scriptedFetch([{ status: 500 }, { status: 500 }, { status: 200, body: okBody }]);
  const page = await fetchPncpPage(url, { fetchImpl: impl, sleep: noSleep });
  assert.equal(page.data.length, 2);
  assert.equal(page.telemetry.outcome, "ok");
  assert.equal(page.telemetry.attempts, 3);
});

test("timeout é retentado e reportado como timeout, não como ausência", async () => {
  const impl = scriptedFetch([{ throw: "abort" }, { throw: "abort" }, { status: 200, body: okBody }]);
  const page = await fetchPncpPage(url, { fetchImpl: impl, sleep: noSleep });
  assert.equal(page.telemetry.outcome, "ok");
  assert.equal(page.telemetry.attempts, 3);
});

test("esgotadas as tentativas, o resultado é 'failed' — jamais 'empty'", async () => {
  const impl = scriptedFetch([{ status: 500 }]);
  const page = await fetchPncpPage(url, { fetchImpl: impl, sleep: noSleep, retries: 4 });
  assert.equal(page.telemetry.outcome, "failed");
  assert.equal(page.telemetry.failureKind, "server_error");
  assert.equal(page.telemetry.attempts, 4);
  assert.deepEqual(page.data, [], "falha devolve lista vazia, mas o outcome impede lê-la como ausência");
});

test("erro fatal não gasta as tentativas restantes", async () => {
  const impl = scriptedFetch([{ status: 422, body: "bad param" }]);
  const page = await fetchPncpPage(url, { fetchImpl: impl, sleep: noSleep, retries: 6 });
  assert.equal(page.telemetry.attempts, 1, "422 não deve ser repetido 6×");
  assert.equal(page.telemetry.failureKind, "client_error");
});

test("204 encerra na primeira tentativa e é ausência legítima", async () => {
  const impl = scriptedFetch([{ status: 204 }]);
  const page = await fetchPncpPage(url, { fetchImpl: impl, sleep: noSleep });
  assert.equal(page.telemetry.outcome, "empty");
  assert.equal(page.telemetry.attempts, 1);
});

test("nenhuma falha de rede escapa como exceção", async () => {
  const impl = scriptedFetch([{ throw: "network" }]);
  const page = await fetchPncpPage(url, { fetchImpl: impl, sleep: noSleep, retries: 2 });
  assert.equal(page.telemetry.outcome, "failed");
  assert.equal(page.telemetry.failureKind, "network");
});

// ---------------------------------------------------------------------------
// Paginação
// ---------------------------------------------------------------------------

test("paginação junta as páginas e marca complete", async () => {
  const impl = scriptedFetch([
    { status: 200, body: JSON.stringify({ data: [{ id: 1 }], totalPaginas: 2 }) },
    { status: 200, body: JSON.stringify({ data: [{ id: 2 }], totalPaginas: 2 }) },
  ]);
  const result = await fetchPncpAllPages((pagina) => `${url}&p=${pagina}`, { fetchImpl: impl, sleep: noSleep });
  assert.equal(result.data.length, 2);
  assert.equal(result.complete, true);
});

test("página que falha torna a coleta INCOMPLETA em vez de silenciosamente parcial", async () => {
  const impl = scriptedFetch([
    { status: 200, body: JSON.stringify({ data: [{ id: 1 }], totalPaginas: 3 }) },
    { status: 500 },
  ]);
  const result = await fetchPncpAllPages((pagina) => `${url}&p=${pagina}`, {
    fetchImpl: impl,
    sleep: noSleep,
    retries: 2,
  });
  assert.equal(result.complete, false, "coleta parcial apresentada como completa contamina a cobertura");
  assert.equal(result.data.length, 1);
});

// ---------------------------------------------------------------------------
// O julgamento de cobertura — a correção conceitual
// ---------------------------------------------------------------------------

test("achou é 'found'", () => {
  assert.equal(judgeCoverage(true, [{ outcome: "ok" }]), "found");
});

test("não achou COM consulta bem-sucedida é ausência de verdade", () => {
  assert.equal(judgeCoverage(false, [{ outcome: "empty" }, { outcome: "ok" }]), "not_published");
});

test("não achou porque a consulta FALHOU é 'unknown', nunca ausência", () => {
  // Esta é a linha que muda o número do kill-gate: 4 dos 6 misses eram consultas
  // que nunca voltaram, contadas como se o edital não existisse no PNCP.
  assert.equal(judgeCoverage(false, [{ outcome: "failed" }, { outcome: "failed" }]), "unknown");
});

test("sem telemetria nenhuma o veredito é 'unknown', não ausência", () => {
  assert.equal(judgeCoverage(false, []), "unknown");
});

test("MISTO — uma rota respondeu vazia e outra falhou: é 'unknown', não ausência", () => {
  // Regressão medida em produção (13/Ago): `edital-01-2026` levou `not_published` numa
  // rodada com 22 tentativas e 2 falhas, e na rodada seguinte foi ACHADO em 3 tentativas.
  // A rota que falha pode ser justamente a que tem a resposta — afirmar ausência com
  // qualquer consulta pendente é fabricar um fato.
  assert.equal(judgeCoverage(false, [{ outcome: "empty" }, { outcome: "failed" }]), "unknown");
  assert.equal(judgeCoverage(false, [{ outcome: "failed" }, { outcome: "ok" }]), "unknown");
});

test("ausência só é afirmada quando TODAS as rotas responderam", () => {
  assert.equal(judgeCoverage(false, [{ outcome: "empty" }, { outcome: "empty" }]), "not_published");
  assert.equal(judgeCoverage(false, [{ outcome: "ok" }, { outcome: "empty" }]), "not_published");
});
