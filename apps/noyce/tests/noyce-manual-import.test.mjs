import assert from "node:assert/strict";
import { test } from "node:test";

const { createManualImportAdapter, parseCsv } = await import("../lib/sources/manual-import-adapter.ts");

const BLL_CSV = [
  "orgao;cnpj;objeto;municipio;uf;edital;valor;encerramento",
  "PREFEITURA DE ITUMBIARA;01.234.567/0001-00;Pavimentação asfáltica de vias urbanas;Itumbiara;GO;045/2026;1200000,50;2026-07-01T09:00:00",
  "PREFEITURA DE RIO VERDE;02.345.678/0001-11;Construção de creche municipal;Rio Verde;GO;046/2026;980000,00;2026-07-05T14:00:00",
].join("\n");

const MAPPING = {
  buyer: "orgao",
  buyerCnpj: "cnpj",
  title: "objeto",
  city: "municipio",
  uf: "uf",
  numeroEdital: "edital",
  estimatedValue: "valor",
  proposalDeadline: "encerramento",
};

test("parseCsv respeita delimitador e cabeçalho", () => {
  const rows = parseCsv(BLL_CSV, ";");
  assert.equal(rows.length, 2);
  assert.equal(rows[0].orgao, "PREFEITURA DE ITUMBIARA");
  assert.equal(rows[1].uf, "GO");
});

test("import manual de BLL normaliza sem login e gera snapshot com sha256", async () => {
  const adapter = createManualImportAdapter({ source: "bll", mapping: MAPPING, csvDelimiter: ";" });
  const result = await adapter.run({
    capturedBy: "stafani",
    originalFileName: "Downloads/bll-itumbiara.csv",
    contentType: "text/csv",
    content: BLL_CSV,
  });

  assert.equal(result.ok, true);
  assert.equal(result.accessMode, "manual_import");
  assert.equal(result.candidates.length, 2);
  // snapshot obrigatório
  assert.match(result.snapshot.sha256, /^[0-9a-f]{64}$/);
  assert.ok(result.snapshot.byteLength > 0);
  assert.equal(result.snapshot.originalFileName, "Downloads/bll-itumbiara.csv");
  // evidência por coluna
  const c = result.candidates[0];
  assert.equal(c.buyer, "PREFEITURA DE ITUMBIARA");
  assert.equal(c.estimatedValue, 1200000.5);
  const buyerEv = c.evidence.find((e) => e.field === "buyer");
  assert.equal(buyerEv.locatorKind, "csvColumn");
  assert.equal(buyerEv.locator, "orgao");
});

test("import manual com JSON array também normaliza", async () => {
  const json = JSON.stringify([
    { orgao: "MUNICIPIO X", cnpj: "03000000000100", objeto: "Obra Y", municipio: "Catalão", uf: "GO", edital: "10/2026", valor: 500000, encerramento: "2026-08-01T10:00:00" },
  ]);
  const adapter = createManualImportAdapter({ source: "bnc", mapping: MAPPING });
  const result = await adapter.run({
    capturedBy: "alice",
    originalFileName: "bnc.json",
    contentType: "application/json",
    content: json,
  });
  assert.equal(result.ok, true);
  assert.equal(result.candidates[0].city, "Catalão");
});

test("caminho absoluto é rejeitado pelo import manual", async () => {
  const adapter = createManualImportAdapter({ source: "bll", mapping: MAPPING, csvDelimiter: ";" });
  await assert.rejects(
    adapter.run({ capturedBy: "x", originalFileName: "C:/Users/kingp/Downloads/x.csv", contentType: "text/csv", content: BLL_CSV }),
    /absoluto/,
  );
});

test("linha com coluna credencial é bloqueada", async () => {
  const csv = ["orgao;senha;objeto", "PREF;1234;Obra"].join("\n");
  const adapter = createManualImportAdapter({ source: "bll", mapping: { buyer: "orgao", title: "objeto" }, csvDelimiter: ";" });
  await assert.rejects(
    adapter.run({ capturedBy: "x", originalFileName: "x.csv", contentType: "text/csv", content: csv }),
    /credential-shaped/,
  );
});
