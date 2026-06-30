// Proposta Comercial (Modelo F do padrão vencedor Lei 14.133) + valor por extenso.
import assert from "node:assert/strict";
import { test } from "node:test";

const { buildReviewDossier, valorPorExtenso } = await import("../lib/noyce-review.ts");

const CCP = { identity: { razaoSocial: "ENIAC EMPREENDIMENTOS LTDA", cnpj: "36.819.268/0001-05", creaEmpresa: "CREA-GO 39711", porte: "ME", regime: "Simples", sedeMunicipioIbge: "5200258" }, rts: [], acervo: [], financials: [], regularity: [], derived: { capabilityByService: {} } };
const OPP = { id: "pc-1", source: "pncp", title: "Reforma de escola", buyer: "Município de X", city: "X", uf: "GO", estimatedValue: 1000000, proposalDeadline: "2026-07-10T13:00:00Z", market: null, habilitationChecklist: [] };

test("valorPorExtenso: reais e centavos, plural e 'de reais' em milhões exatos", () => {
  assert.equal(valorPorExtenso(1), "um real");
  assert.equal(valorPorExtenso(2680), "dois mil e seiscentos e oitenta reais");
  assert.equal(valorPorExtenso(1000000), "um milhão de reais");
  assert.match(valorPorExtenso(174823.04), /^cento e setenta e quatro mil.*quatro centavos$/);
});

test("Proposta Comercial: peça formal com considerandos, valor por extenso e validade", () => {
  const items = buildReviewDossier(OPP, CCP);
  const pc = items.find((i) => i.label === "Proposta Comercial (peça formal)");
  assert.ok(pc, "deve gerar a Proposta Comercial");
  assert.match(pc.valorMotor, /Prezados Senhores/);
  assert.match(pc.valorMotor, /vinculante, irrevogável/);
  assert.match(pc.valorMotor, /PREÇO GLOBAL OFERTADO/);
  assert.match(pc.valorMotor, /\(.*reais\)/, "deve trazer o valor por extenso entre parênteses");
  assert.match(pc.valorMotor, /VALIDADE DA PROPOSTA: 60/);
  assert.match(pc.valorMotor, /art\.?\s*59/i, "cita o piso de exequibilidade");
});

test("Proposta Comercial: sem valor estimado → marca pendência (não inventa preço)", () => {
  const items = buildReviewDossier({ ...OPP, estimatedValue: null }, CCP);
  const pc = items.find((i) => i.label === "Proposta Comercial (peça formal)");
  assert.ok(pc.requerCorrecao, "sem valor deve exigir correção humana");
  assert.match(pc.valorMotor, /a definir|preencher/i);
});
