// Story 30.1 — flag permiteConsorcio no discovery: normalização (true|false|null) + sugestão de parceiro.
import assert from "node:assert/strict";
import { test } from "node:test";

const { normalizeConsorcio, normalizePncpRaw } = await import("../lib/sources/source-normalizer.ts");
const { needsConsorcioPartner } = await import("../lib/noyce-operational.ts");

const SNAPSHOT = {
  snapshotId: "pncp-test",
  source: "pncp",
  accessMode: "public_api",
  capturedAt: "2026-06-18T00:00:00Z",
  capturedBy: "test",
  originalFileName: "pncp-test.json",
  contentType: "application/json",
  sha256: "0".repeat(64),
  byteLength: 0,
  parserVersion: "noyce-sources/0.1.0",
  status: "captured",
};

// ── normalizeConsorcio: AC1/AC5 ──────────────────────────────────────────────

test("campo booleano dedicado tem prioridade (permiteConsorcio=true → true)", () => {
  assert.equal(normalizeConsorcio({ permiteConsorcio: true }), true);
  assert.equal(normalizeConsorcio({ admiteConsorcio: "Sim" }), true);
  assert.equal(normalizeConsorcio({ consorcioPermitido: false }), false);
});

test("subcontratação permitida + menção a consórcio no texto → true", () => {
  const raw = {
    indicadorSubcontratacao: true,
    informacaoComplementar: "É admitida a participação em consórcio de empresas, conforme art. 15.",
  };
  assert.equal(normalizeConsorcio(raw), true);
});

test("texto que veda consórcio → false (não cai em menção positiva)", () => {
  assert.equal(
    normalizeConsorcio({ informacaoComplementar: "Não será admitida a participação em consórcio." }),
    false,
  );
  assert.equal(
    normalizeConsorcio({ objetoCompra: "Obra X — vedada a participação em consórcio de empresas." }),
    false,
  );
  assert.equal(
    normalizeConsorcio({ informacoesComplementares: "A participação em consórcio é vedada neste certame." }),
    false,
  );
});

test("ausência de qualquer sinal → null (NUNCA false — AC5)", () => {
  assert.equal(normalizeConsorcio({}), null);
  assert.equal(normalizeConsorcio({ objetoCompra: "Pavimentação asfáltica de vias urbanas" }), null);
  // subcontratação true mas SEM menção a consórcio não basta para inferir true.
  assert.equal(normalizeConsorcio({ indicadorSubcontratacao: true, objetoCompra: "Reforma de creche" }), null);
});

// ── normalizePncpRaw: o campo chega no candidato canônico + evidência só quando há sinal ──

test("normalizePncpRaw popula permiteConsorcio e adiciona evidência quando há sinal", () => {
  const raw = {
    objetoCompra: "Construção de praça",
    orgaoEntidade: { razaoSocial: "PREFEITURA X", cnpj: "01000000000100" },
    unidadeOrgao: { municipioNome: "Catalão", ufSigla: "GO" },
    dataEncerramentoProposta: "2026-07-01T09:00:00",
    permiteConsorcio: true,
  };
  const c = normalizePncpRaw(raw, SNAPSHOT);
  assert.equal(c.permiteConsorcio, true);
  const ev = c.evidence.find((e) => e.field === "permiteConsorcio");
  assert.ok(ev, "deve existir evidência derivada para permiteConsorcio");
  assert.equal(ev.locatorKind, "derived");
});

test("normalizePncpRaw mantém permiteConsorcio=null e SEM evidência quando edital é silente (AC5/AC6)", () => {
  const raw = {
    objetoCompra: "Pavimentação de vias",
    orgaoEntidade: { razaoSocial: "PREFEITURA Y", cnpj: "02000000000100" },
    unidadeOrgao: { municipioNome: "Rio Verde", ufSigla: "GO" },
    dataEncerramentoProposta: "2026-07-05T14:00:00",
  };
  const c = normalizePncpRaw(raw, SNAPSHOT);
  assert.equal(c.permiteConsorcio, null);
  assert.equal(c.evidence.find((e) => e.field === "permiteConsorcio"), undefined);
});

// ── needsConsorcioPartner: AC4 ───────────────────────────────────────────────

function opportunityWith(permiteConsorcio, tecnicoStatus) {
  return {
    permiteConsorcio,
    habilitationResult: tecnicoStatus
      ? { porBloco: { tecnico_profissional: { status: tecnicoStatus }, tecnico_operacional: { status: "ATENDE" } } }
      : null,
  };
}

test("AC4: permite consórcio + bloco técnico NAO_ATENDE → sugere parceiro", () => {
  assert.equal(needsConsorcioPartner(opportunityWith(true, "NAO_ATENDE")), true);
});

test("AC4: não sugere parceiro quando edital não permite consórcio", () => {
  assert.equal(needsConsorcioPartner(opportunityWith(false, "NAO_ATENDE")), false);
  assert.equal(needsConsorcioPartner(opportunityWith(null, "NAO_ATENDE")), false);
});

test("AC4: não sugere parceiro quando técnica solo atende (sem NAO_ATENDE)", () => {
  assert.equal(needsConsorcioPartner(opportunityWith(true, "ATENDE")), false);
  assert.equal(needsConsorcioPartner(opportunityWith(true, null)), false);
});
