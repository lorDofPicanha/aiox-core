import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const { mergeDiscoveryItems, retentionStartFor, shouldAbortCollection } = await import(
  "../scripts/noyce/discovery-incremental-policy.mjs"
);

test("coleta incremental preserva itens dentro de 60 dias e atualiza os reconsultados", () => {
  const retentionStart = new Date("2026-06-06T00:00:00.000Z");
  const previousItems = [
    { id: "keep", publicationDate: "2026-07-01", distanceKm: 120, title: "original" },
    { id: "refresh", publicationDate: "2026-08-03", distanceKm: 90, title: "original" },
    { id: "expired", publicationDate: "2026-05-01", distanceKm: 10 },
  ];
  const freshItems = [
    { id: "refresh", publicationDate: "2026-08-03", distanceKm: 90, title: "corrigido" },
    { id: "new", publicationDate: "2026-08-05", distanceKm: 30 },
  ];

  const merged = mergeDiscoveryItems({ freshItems, previousItems, retentionStart });

  assert.deepEqual(merged.map((item) => item.id), ["new", "refresh", "keep"]);
  assert.equal(merged.find((item) => item.id === "refresh").title, "corrigido");
  assert.equal(merged.some((item) => item.id === "expired"), false);
});

test("janela de retenção é independente da janela curta consultada", () => {
  assert.equal(
    retentionStartFor(new Date("2026-08-05T12:00:00.000Z"), 60).toISOString(),
    "2026-06-06T12:00:00.000Z",
  );
});

test("primeira consulta esgotada torna a coleta não publicável e deve abortar", () => {
  assert.equal(shouldAbortCollection({ failQueries: 0 }), false);
  assert.equal(shouldAbortCollection({ failQueries: 1 }), true);
});

test("tarefa horária usa janela incremental e orçamento inferior ao limite externo", () => {
  const script = readFileSync(new URL("../../../scripts/noyce/register-discovery-task.ps1", import.meta.url), "utf8");
  const scheduler = readFileSync(new URL("../../../scripts/noyce/discovery-scheduler.mjs", import.meta.url), "utf8");
  assert.match(script, /--days 3/);
  assert.match(script, /--retention-days 60/);
  assert.match(script, /--max-runtime-min 40/);
  assert.match(script, /ExecutionTimeLimitMinutes = 45/);
  assert.match(scheduler, /process\.exitCode = Number\.isInteger\(result\.code\)/);
});
