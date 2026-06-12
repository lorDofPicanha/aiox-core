// A2 (conclave 12/Jun, Justen): porte ME/EPP DERIVADO do balanço, nunca constante.
// Receita ENIAC 2025 = R$314.963 = 87% do teto ME → alerta obrigatório; desenquadramento → trava da declaração.
import assert from "node:assert/strict";
import { test } from "node:test";

const { derivePorte, TETO_ME } = await import("../lib/noyce-porte.ts");
const { buildReviewDossier } = await import("../lib/noyce-review.ts");

function ccp({ receita, porteDeclarado = "ME" }) {
  return {
    identity: {
      razaoSocial: "ENIAC EMPREENDIMENTOS LTDA",
      cnpj: "36.819.268/0001-05",
      creaEmpresa: null,
      porte: porteDeclarado,
      regime: "Simples",
      sedeMunicipioIbge: "5200258",
    },
    rts: [],
    acervo: [],
    financials:
      receita === null
        ? []
        : [{ exercicio: 2025, patrimonioLiquido: 919170.54, receitaBruta: receita, ativoCirc: null, passivoCirc: null, ativoTotal: null, realizavelLongoPrazo: null, exigivelLongoPrazo: null, capitalSocial: null, resultado: null, fonte: "teste" }],
    regularity: [],
    derived: { capabilityByService: {} },
  };
}

test("receita ENIAC real (314.963) = ME com alerta de desenquadramento iminente (87%)", () => {
  const p = derivePorte(ccp({ receita: 314963.26 }));
  assert.equal(p.porte, "ME");
  assert.equal(p.alerta, "desenquadramento_iminente");
  assert.ok(p.pctTeto > 0.85 && p.pctTeto < 0.9);
});

test("receita acima do teto ME com cadastro ME = desenquadrado → declaração TRAVADA no dossiê", () => {
  const company = ccp({ receita: TETO_ME + 50_000 });
  const p = derivePorte(company);
  assert.equal(p.porte, "EPP");
  assert.equal(p.alerta, "desenquadrado_do_declarado");

  const items = buildReviewDossier(
    { id: "o1", source: "pncp", title: "Obra", buyer: "Pref", city: "X", uf: "GO", estimatedValue: 1, proposalDeadline: null, market: null, habilitationChecklist: [] },
    company,
  );
  const decl = items.find((i) => i.label === "Enquadramento ME/EPP");
  assert.equal(decl.requerCorrecao, true);
  assert.match(decl.valorMotor, /NÃO PRÉ-REDIGIDA/);
  assert.match(decl.valorMotor, /155/);
});

test("receita confortável (50% do teto) = ME sem alerta, declaração redigida com porte DERIVADO", () => {
  const company = ccp({ receita: 180_000 });
  const p = derivePorte(company);
  assert.equal(p.alerta, null);
  const items = buildReviewDossier(
    { id: "o2", source: "pncp", title: "Obra", buyer: "Pref", city: "X", uf: "GO", estimatedValue: 1, proposalDeadline: null, market: null, habilitationChecklist: [] },
    company,
  );
  const decl = items.find((i) => i.label === "Enquadramento ME/EPP");
  assert.ok(!decl.requerCorrecao);
  assert.match(decl.proveniencia, /derivado da receita/);
});

test("sem receita no vault = porte do cadastro NÃO confirmado → declaração exige correção", () => {
  const p = derivePorte(ccp({ receita: null }));
  assert.equal(p.alerta, "sem_receita");
  const items = buildReviewDossier(
    { id: "o3", source: "pncp", title: "Obra", buyer: "Pref", city: "X", uf: "GO", estimatedValue: 1, proposalDeadline: null, market: null, habilitationChecklist: [] },
    ccp({ receita: null }),
  );
  const decl = items.find((i) => i.label === "Enquadramento ME/EPP");
  assert.equal(decl.requerCorrecao, true);
});
