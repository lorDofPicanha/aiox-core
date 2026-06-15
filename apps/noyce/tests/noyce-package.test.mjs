// E1 (12/Jun): pacote do certame — dossiê HTML completo + planilha CSV, com portão humano.
import assert from "node:assert/strict";
import { test } from "node:test";

const { buildDossierHtml, buildProposalCsv, isPackageFinal } = await import("../lib/noyce-package.ts");

const CCP = {
  identity: { razaoSocial: "ENIAC EMPREENDIMENTOS LTDA", cnpj: "36.819.268/0001-05", creaEmpresa: "CREA-GO 39711", porte: "ME", regime: "Simples", sedeMunicipioIbge: "5200258" },
  rts: [], acervo: [], financials: [], regularity: [], derived: { capabilityByService: {} },
};
const OPP = { id: "o1", source: "pncp", title: "UBS II — Jardim Santa Lúcia", buyer: "Prefeitura de Águas Lindas", city: "Águas Lindas de Goiás", uf: "GO", estimatedValue: 2831789.56, proposalDeadline: "2026-06-30T13:00:00Z", market: null, habilitationChecklist: [] };
const CHECKLIST = [{ label: "Fiscal e trabalhista", status: "missing", note: "Vault sem certidões" }];
const PLAN = [{ id: "x", ordem: 0, acao: "Subir certidões", dono: "Operação ENIAC", due: "2026-06-25", dueLabel: "até 2026-06-25 (D-5)", status: "no_prazo", fonte: "motor" }];
const DECL_OK = { id: "d1", secao: "Declarações (pré-redigidas)", label: "Inexistência de fato impeditivo", valorMotor: "m", proveniencia: "t", status: "aprovado", valorFinal: "ENIAC declara X." };
const DECL_PEND = { id: "d2", secao: "Declarações (pré-redigidas)", label: "Enquadramento ME/EPP", valorMotor: "m", proveniencia: "t", status: "pendente", valorFinal: "texto motor" };

function input(reviewed) {
  return { opportunity: OPP, ccp: CCP, checklist: CHECKLIST, victoryPlan: PLAN, reviewed, vaultMeta: [], generatedAtLabel: "12/06/2026 20:00" };
}

test("revisão incompleta → marca d'água RASCUNHO; declaração pendente NÃO sai com texto assinável", () => {
  const html = buildDossierHtml(input([DECL_OK, DECL_PEND]));
  assert.match(html, /RASCUNHO — REVISÃO 1\/2 — NÃO ASSINAR/);
  assert.match(html, /ENIAC declara X\./, "declaração aprovada entra com texto");
  assert.ok(!html.includes("texto motor"), "declaração PENDENTE não entra com texto");
  assert.match(html, /Pendências de revisão humana/);
  assert.match(html, /Enquadramento ME\/EPP/);
});

test("revisão 100% → PACOTE FINAL sem marca d'água", () => {
  const html = buildDossierHtml(input([DECL_OK, { ...DECL_PEND, status: "corrigido", valorFinal: "Texto humano." }]));
  assert.equal(isPackageFinal([DECL_OK, { ...DECL_PEND, status: "corrigido", valorFinal: "x" }]), true);
  assert.ok(!html.includes("NÃO ASSINAR"));
  assert.match(html, /PACOTE FINAL/);
  assert.match(html, /Texto humano\./);
});

test("dossiê carrega certame, frentes, plano e identificação ENIAC", () => {
  const html = buildDossierHtml(input([DECL_OK]));
  assert.match(html, /UBS II/);
  assert.match(html, /36\.819\.268\/0001-05/);
  assert.match(html, /Fiscal e trabalhista/);
  assert.match(html, /Plano de Vitória/);
});

test("planilha CSV traz faixa legal calculada (piso 75% e limite 85%)", () => {
  const csv = buildProposalCsv(OPP);
  assert.match(csv, /2123842,17/); // 75% de 2.831.789,56
  assert.match(csv, /2407021,13/); // 85%
  assert.match(csv, /BDI/);
  assert.match(csv, /art\. 59/);
});
