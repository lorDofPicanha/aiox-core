import assert from "node:assert/strict";
import { test } from "node:test";

const { guardSource, assertAutomationAllowed, assertNoSecrets, redactSecrets, sanitizeImportPath } = await import(
  "../lib/sources/authenticated-source-guard.ts"
);

test("fontes autenticadas retornam blocked_until_vault", () => {
  for (const source of ["bll", "bnc", "pcp"]) {
    const verdict = guardSource(source);
    assert.equal(verdict.allowed, false);
    assert.equal(verdict.status, "blocked_until_vault");
  }
});

test("PNCP público é liberado agora", () => {
  const verdict = guardSource("pncp");
  assert.equal(verdict.allowed, true);
  assert.equal(verdict.status, "allowed");
});

test("assertAutomationAllowed lança para fonte bloqueada e passa para PNCP", () => {
  assert.throws(() => assertAutomationAllowed("bll"), /blocked_until_vault/);
  assert.doesNotThrow(() => assertAutomationAllowed("pncp"));
});

test("assertNoSecrets bloqueia chaves credenciais (rasas e aninhadas)", () => {
  assert.throws(() => assertNoSecrets({ password: "x" }), /credential-shaped/);
  assert.throws(() => assertNoSecrets({ login: { token: "x" } }), /credential-shaped/);
  assert.throws(() => assertNoSecrets({ Cookie: "abc" }), /credential-shaped/);
  assert.doesNotThrow(() => assertNoSecrets({ uf: "GO", valor: 1000 }));
});

test("redactSecrets mascara valores sensíveis sem quebrar o resto", () => {
  const out = redactSecrets({ uf: "GO", senha: "segredo", nested: { apiKey: "k" } });
  assert.equal(out.uf, "GO");
  assert.equal(out.senha, "[REDACTED]");
  assert.equal(out.nested.apiKey, "[REDACTED]");
});

test("sanitizeImportPath rejeita caminho absoluto e normaliza para Downloads/", () => {
  assert.throws(() => sanitizeImportPath("C:/Users/kingp/edital.csv"), /absoluto/);
  assert.throws(() => sanitizeImportPath("/home/user/edital.csv"), /absoluto/);
  assert.throws(() => sanitizeImportPath("../../etc/passwd"), /absoluto/);
  assert.equal(sanitizeImportPath("Downloads/bll-export.csv"), "Downloads/bll-export.csv");
  assert.equal(sanitizeImportPath("bll-export.csv"), "Downloads/bll-export.csv");
});
