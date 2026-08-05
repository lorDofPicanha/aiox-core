import assert from "node:assert/strict";
import { test } from "node:test";

const { hasValidBasicAuth } = await import("../lib/http/basic-auth.ts");
const { HttpInputError, assertJsonLimits, expectObject, optionalString, readJsonBody } = await import(
  "../lib/http/request-validation.ts"
);
const { PNCP_LIMITS, isZipExpansionWithinLimits, readBoundedResponseBytes } = await import(
  "../lib/edital/pncp-source.ts"
);

test("Basic Auth falha fechado sem secrets e aceita credencial exata", () => {
  const header = `Basic ${Buffer.from("pilot:senha:com:dois-pontos").toString("base64")}`;
  assert.equal(hasValidBasicAuth(header, undefined, undefined), false);
  assert.equal(hasValidBasicAuth(header, "pilot", "senha:com:dois-pontos"), true);
  assert.equal(hasValidBasicAuth(header, "pilot", "senha-errada"), false);
  assert.equal(hasValidBasicAuth("Bearer token", "pilot", "senha"), false);
  assert.equal(hasValidBasicAuth("Basic !!!", "pilot", "senha"), false);
});

test("readJsonBody exige JSON e respeita content-length", async () => {
  await assert.rejects(
    readJsonBody(new Request("https://noyce.test", { method: "POST", body: "{}" }), 10),
    (error) => error instanceof HttpInputError && error.status === 415,
  );
  const oversized = new Request("https://noyce.test", {
    method: "POST",
    headers: { "content-type": "application/json", "content-length": "100" },
    body: "{}",
  });
  await assert.rejects(readJsonBody(oversized, 10), (error) => error instanceof HttpInputError && error.status === 413);
});

test("readJsonBody corta stream que ultrapassa o limite real", async () => {
  const request = new Request("https://noyce.test", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ text: "x".repeat(100) }),
  });
  await assert.rejects(readJsonBody(request, 32), (error) => error instanceof HttpInputError && error.status === 413);
});

test("helpers rejeitam propriedades inesperadas, tipo e complexidade excessiva", () => {
  assert.throws(() => expectObject({ ok: true, extra: true }, ["ok"]), HttpInputError);
  assert.throws(() => optionalString({ value: 42 }, "value", { maxLength: 10 }), HttpInputError);
  assert.throws(() => assertJsonLimits({ values: [1, 2, 3] }, { maxArrayLength: 2 }), HttpInputError);
});

test("download PNCP rejeita tamanho declarado e tamanho transmitido acima do cap", async () => {
  assert.ok(PNCP_LIMITS.maxDownloadBytes > 0);
  const declared = new Response("ok", { headers: { "content-length": "99" } });
  await assert.rejects(readBoundedResponseBytes(declared, 10), /download limit/);
  const streamed = new Response(new Uint8Array(11));
  await assert.rejects(readBoundedResponseBytes(streamed, 10), /download limit/);
  const accepted = await readBoundedResponseBytes(new Response(new Uint8Array([1, 2, 3])), 3);
  assert.deepEqual([...accepted], [1, 2, 3]);
});

test("limites ZIP cobrem quantidade, arquivo individual e total expandido", () => {
  assert.equal(isZipExpansionWithinLimits(PNCP_LIMITS.maxZipEntries, [1, 2]), true);
  assert.equal(isZipExpansionWithinLimits(PNCP_LIMITS.maxZipEntries + 1, [1]), false);
  assert.equal(isZipExpansionWithinLimits(1, [PNCP_LIMITS.maxZipPdfBytes + 1]), false);
  assert.equal(
    isZipExpansionWithinLimits(4, [
      PNCP_LIMITS.maxZipPdfBytes,
      PNCP_LIMITS.maxZipPdfBytes,
      PNCP_LIMITS.maxZipPdfBytes,
      PNCP_LIMITS.maxZipPdfBytes,
    ]),
    false,
  );
  assert.equal(isZipExpansionWithinLimits(21, Array(21).fill(1)), false);
});
