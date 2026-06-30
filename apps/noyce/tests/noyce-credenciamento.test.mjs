// Carta de credenciamento (Modelo E) + Termo de aceitação (Modelo A) — padrão vencedor Lei 14.133.
import assert from "node:assert/strict";
import { test } from "node:test";

const { buildReviewDossier } = await import("../lib/noyce-review.ts");

const OPP = { id: "cr-1", source: "pncp", title: "Reforma de escola", buyer: "Município de X", city: "X", uf: "GO", estimatedValue: 1000000, proposalDeadline: "2026-07-10T13:00:00Z", market: null, habilitationChecklist: [] };
const REP = { nome: "Lucas Cardoso Fernandes", cpf: "028.045.341-89", cargo: "Administrador", rg: null };
const CCP = { identity: { razaoSocial: "ENIAC EMPREENDIMENTOS LTDA", cnpj: "36.819.268/0001-05", creaEmpresa: "CREA-GO 39711", porte: "ME", regime: "Simples", sedeMunicipioIbge: "5200258", sedeMunicipio: "Águas Lindas de Goiás-GO", nire: "52600939599", representanteLegal: REP }, rts: [], acervo: [], financials: [], regularity: [], derived: { capabilityByService: {} } };

test("gera Carta de credenciamento com o representante real e poderes do certame", () => {
  const items = buildReviewDossier(OPP, CCP);
  const c = items.find((i) => i.label === "Carta de credenciamento");
  assert.ok(c, "deve gerar a carta de credenciamento");
  assert.match(c.valorMotor, /CARTA DE CREDENCIAMENTO/);
  assert.match(c.valorMotor, /Lucas Cardoso Fernandes/);
  assert.match(c.valorMotor, /CPF 028\.045\.341-89/);
  assert.match(c.valorMotor, /interpor.*recursos|formular lances/i);
  assert.match(c.valorMotor, /Reforma de escola/); // referência ao certame
  assert.ok(!c.requerCorrecao, "com representante, não exige correção");
});

test("gera Termo de aceitação às condições do edital", () => {
  const items = buildReviewDossier(OPP, CCP);
  const t = items.find((i) => i.label === "Termo de aceitação às condições do edital");
  assert.ok(t, "deve gerar o termo de aceitação");
  assert.match(t.valorMotor, /aceita integralmente as condições/);
  assert.match(t.valorMotor, /sob as penas da legislação/);
  assert.match(t.valorMotor, /sem qualquer ressalva/);
});

test("sem representante no perfil → peças saem como pendência (não inventam quem assina)", () => {
  const ccpSemRep = { ...CCP, identity: { ...CCP.identity, representanteLegal: undefined } };
  const items = buildReviewDossier(OPP, ccpSemRep);
  const c = items.find((i) => i.label === "Carta de credenciamento");
  assert.ok(c.requerCorrecao, "sem representante deve exigir correção");
  assert.match(c.valorMotor, /\[representante legal/);
});
