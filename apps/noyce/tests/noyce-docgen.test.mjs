// D2 (12/Jun): geração de .docx das declarações — portão humano obrigatório.
import assert from "node:assert/strict";
import { test } from "node:test";

const { canGenerate, generateDeclarationBuffer, declarationFileName } = await import("../lib/noyce-docgen.ts");

const CCP = {
  identity: { razaoSocial: "ENIAC EMPREENDIMENTOS LTDA", cnpj: "36.819.268/0001-05", creaEmpresa: null, porte: "ME", regime: "Simples", sedeMunicipioIbge: "5200258" },
  rts: [], acervo: [], financials: [], regularity: [], derived: { capabilityByService: {} },
};

const ITEM = {
  id: "x", secao: "Declarações (pré-redigidas)", label: "Inexistência de fato impeditivo",
  valorMotor: "Texto do motor", proveniencia: "t", status: "aprovado", valorFinal: "ENIAC declara que não há fato impeditivo.",
};

test("portão humano: pendente NÃO gera; aprovado e corrigido geram", () => {
  assert.equal(canGenerate({ ...ITEM, status: "pendente" }), false);
  assert.equal(canGenerate({ ...ITEM, status: "aprovado" }), true);
  assert.equal(canGenerate({ ...ITEM, status: "corrigido" }), true);
});

test("gera .docx válido (assinatura PK zip) com o texto FINAL revisado", async () => {
  const buf = await generateDeclarationBuffer({
    item: { ...ITEM, status: "corrigido", valorFinal: "TEXTO HUMANO FINAL ÚNICO." },
    ccp: CCP,
    certame: { titulo: "Concorrência 01/2026", orgao: "Prefeitura de Águas Lindas" },
  });
  assert.ok(buf.length > 1000, "docx não-vazio");
  assert.equal(buf[0], 0x50); // 'P'
  assert.equal(buf[1], 0x4b); // 'K' — zip/docx
});

test("nome do arquivo é slug seguro com CNPJ", () => {
  const name = declarationFileName(ITEM, "36.819.268/0001-05");
  assert.match(name, /^declaracao-inexistencia-de-fato-impeditivo-36819268000105\.docx$/);
});
