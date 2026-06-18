// E1 (12/Jun): pacote do certame — dossiê HTML completo + planilha CSV, com portão humano.
import assert from "node:assert/strict";
import { test } from "node:test";

const { buildDossierHtml, buildProposalCsv, isPackageFinal, buildIndividualDocHtml, buildIndividualDocList } = await import("../lib/noyce-package.ts");

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

// ── Story 30.4: modo individual por categoria ────────────────────────────────

test("buildIndividualDocHtml: documento aprovado sai autocontido, com texto, assinatura e SEM marca d'água", () => {
  const html = buildIndividualDocHtml({
    docType: "outro",
    opportunity: OPP,
    ccp: CCP,
    item: DECL_OK,
    generatedAtLabel: "18/06/2026 20:00",
  });
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /ENIAC declara X\./, "corpo da declaração aprovada");
  assert.match(html, /36\.819\.268\/0001-05/, "CNPJ na assinatura");
  assert.match(html, /Declarações/, "rótulo da categoria");
  assert.ok(!html.includes("NÃO ASSINAR"), "aprovado não leva marca d'água");
  assert.match(html, /aprovado em revisão humana/, "chip de revisão aprovada");
});

test("buildIndividualDocHtml: documento pendente leva RASCUNHO — NÃO ASSINAR e NÃO emite texto assinável", () => {
  const html = buildIndividualDocHtml({
    docType: "outro",
    opportunity: OPP,
    ccp: CCP,
    item: DECL_PEND,
    generatedAtLabel: "18/06/2026 20:00",
  });
  assert.match(html, /RASCUNHO — NÃO ASSINAR/);
  assert.match(html, /pendente de envio manual/);
  assert.ok(!html.includes("texto motor"), "texto do motor pendente não vaza");
});

test("buildIndividualDocHtml: sem item (categoria de vault) trata como pendente/rascunho", () => {
  const html = buildIndividualDocHtml({
    docType: "fiscal",
    opportunity: OPP,
    ccp: CCP,
    generatedAtLabel: "18/06/2026 20:00",
  });
  assert.match(html, /RASCUNHO — NÃO ASSINAR/);
  assert.match(html, /Fiscal e trabalhista/);
});

test("buildIndividualDocList: agrupa por categoria, pendente fica disabled, vault expirado é detectado", () => {
  const VAULT = [
    { id: "v1", tipo: "CND Municipal", fileName: "cnd-mun.pdf", byteLength: 1000, validade: "2099-01-01", uploadedAt: "2026-06-01" },
    { id: "v2", tipo: "CND Federal", fileName: "cnd-fed.pdf", byteLength: 1000, validade: "2020-01-01", uploadedAt: "2026-06-01" },
    { id: "v3", tipo: "Contrato Social", fileName: "contrato.pdf", byteLength: 1000, validade: null, uploadedAt: "2026-06-01" },
    { id: "v4", tipo: "Edital (PDF)", fileName: "edital.pdf", byteLength: 1000, validade: null, uploadedAt: "2026-06-01" },
  ];
  const PROPOSTA_OK = { id: "p1", secao: "Proposta", label: "Valor de abertura sugerido", valorMotor: "m", proveniencia: "t", status: "aprovado", valorFinal: "R$ X" };
  const list = buildIndividualDocList({
    reviewed: [DECL_OK, DECL_PEND, PROPOSTA_OK],
    vaultMeta: VAULT,
    asOf: "2026-06-18",
  });

  // Edital fica de fora; demais entram.
  assert.equal(list.find((d) => d.id === "v4"), undefined, "edital não é documento individual");

  const declPend = list.find((d) => d.id === DECL_PEND.id);
  assert.equal(declPend.status, "pendente");
  assert.equal(declPend.disabled, true, "pendente = botão desabilitado (AC6)");
  assert.equal(declPend.categoria, "outro");

  const declOk = list.find((d) => d.id === DECL_OK.id);
  assert.equal(declOk.disabled, false);

  const proposta = list.find((d) => d.id === "p1");
  assert.equal(proposta.categoria, "proposta");

  const cndMun = list.find((d) => d.id === "v1");
  assert.equal(cndMun.status, "ok");
  assert.equal(cndMun.origem, "vault");
  assert.equal(cndMun.categoria, "fiscal");
  assert.equal(cndMun.disabled, false, "doc do vault é sempre baixável");

  const cndFed = list.find((d) => d.id === "v2");
  assert.equal(cndFed.status, "expirado", "validade no passado = expirado (AC7)");

  const contrato = list.find((d) => d.id === "v3");
  assert.equal(contrato.status, "ok", "sem validade = ok");
  assert.equal(contrato.categoria, "juridica");
});
