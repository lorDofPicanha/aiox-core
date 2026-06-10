import assert from "node:assert/strict";
import { test } from "node:test";

const { createPncpPublicAdapter, assertPublicReadOnly, buildPncpUrl } = await import(
  "../lib/sources/pncp-public-adapter.ts"
);

const FAKE_PNCP = {
  data: [
    {
      numeroControlePNCP: "00000000000191-1-000123/2026",
      objetoCompra: "Reforma e ampliação de escola municipal",
      orgaoEntidade: { razaoSocial: "MUNICIPIO DE EXEMPLO", cnpj: "00.000.000/0001-91" },
      unidadeOrgao: { municipioNome: "Goiânia", ufSigla: "GO", codigoIbge: "5208707" },
      modalidadeId: 6,
      numeroCompra: "123/2026",
      valorTotalEstimado: 850000,
      dataPublicacaoPncp: "2026-05-20T08:00:00",
      dataEncerramentoProposta: "2026-06-15T09:00:00",
      linkSistemaOrigem: "https://exemplo.gov.br/edital/123",
    },
  ],
};

test("PNCP adapter só faz GET contra host público pncp.gov.br", async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    return { ok: true, status: 200, json: async () => FAKE_PNCP };
  };
  const adapter = createPncpPublicAdapter();
  const result = await adapter.run({ capturedBy: "tester", fetchImpl, query: { tamanhoPagina: 10 } });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].init.method, "GET");
  assert.ok(calls[0].url.startsWith("https://pncp.gov.br/api/consulta/v1/"));
  // nenhum header de autenticação
  const headerKeys = Object.keys(calls[0].init.headers ?? {}).map((k) => k.toLowerCase());
  assert.ok(!headerKeys.includes("authorization"));
  assert.ok(!headerKeys.includes("cookie"));

  assert.equal(result.ok, true);
  assert.equal(result.candidates.length, 1);
});

test("normaliza item PNCP com evidência jsonPointer nos campos críticos", async () => {
  const fetchImpl = async () => ({ ok: true, status: 200, json: async () => FAKE_PNCP });
  const adapter = createPncpPublicAdapter();
  const { candidates } = await adapter.run({ capturedBy: "tester", fetchImpl });
  const c = candidates[0];

  assert.equal(c.title, "Reforma e ampliação de escola municipal");
  assert.equal(c.buyerCnpj, "00000000000191");
  assert.equal(c.uf, "GO");
  const titleEv = c.evidence.find((e) => e.field === "title");
  assert.equal(titleEv.locatorKind, "jsonPointer");
  assert.equal(titleEv.locator, "/objetoCompra");
  // críticos presentes ⇒ não fica PENDENTE_DADO
  assert.notEqual(c.decision, "PENDENTE_DADO");
});

test("assertPublicReadOnly recusa método não-GET e host não-público", () => {
  assert.throws(() => assertPublicReadOnly(buildPncpUrl(), "POST"), /somente GET/);
  assert.throws(() => assertPublicReadOnly("https://evil.example/api/consulta/v1/x", "GET"), /host nao publico/);
  assert.throws(() => assertPublicReadOnly("http://pncp.gov.br/api/consulta/v1/x", "GET"), /HTTPS/);
});

test("query com credencial é rejeitada antes de qualquer fetch", async () => {
  let fetched = false;
  const fetchImpl = async () => {
    fetched = true;
    return { ok: true, status: 200, json: async () => FAKE_PNCP };
  };
  const adapter = createPncpPublicAdapter();
  await assert.rejects(
    adapter.run({ capturedBy: "tester", fetchImpl, query: { token: "abc123" } }),
    /assertNoSecrets/,
  );
  assert.equal(fetched, false);
});

test("dry-run não toca a rede e ainda produz snapshot público", async () => {
  const adapter = createPncpPublicAdapter();
  const result = await adapter.run({ capturedBy: "tester", dryRun: true, query: { uf: "GO" } });
  assert.equal(result.ok, true);
  assert.equal(result.candidates.length, 0);
  assert.equal(result.snapshot.accessMode, "public_api");
  assert.ok(result.snapshot.originalUrl.startsWith("https://pncp.gov.br/"));
});
