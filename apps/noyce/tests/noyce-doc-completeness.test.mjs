// Parte documental (26/Jun): dossiê dirigido pelo edital (ERM) + gate de completude.
// Numa licitação, documento exigido que fica invisível = inabilitação. Estes testes travam:
// (1) o mapeamento rótulo-do-edital → template, (2) o dossiê gera item p/ CADA exigência
// (inclusive sem template, como pendência — nunca silenciosamente ausente), (3) o gate FALHA
// se algo exigido não foi surfado.
import assert from "node:assert/strict";
import { test } from "node:test";

const { buildReviewDossier, mergeReview } = await import("../lib/noyce-review.ts");
const { mapDeclaracaoLabel, DECLARACAO_TEMPLATES } = await import("../lib/noyce-declaracoes.ts");
const { evaluateDocCompleteness } = await import("../lib/eval/doc-completeness.ts");

const CCP = {
  identity: { razaoSocial: "ENIAC EMPREENDIMENTOS LTDA", cnpj: "36.819.268/0001-05", creaEmpresa: "CREA-GO 39711", porte: "ME", regime: "Simples", sedeMunicipioIbge: "5200258" },
  rts: [], acervo: [], financials: [], regularity: [], derived: { capabilityByService: {} },
};
const OPP = {
  id: "opp-1", source: "pncp", title: "Reforma de escola", buyer: "Prefeitura de Águas Lindas",
  city: "Águas Lindas de Goiás", uf: "GO", estimatedValue: 1350000, proposalDeadline: "2026-07-10T13:00:00Z",
  market: null, habilitationChecklist: [],
};
const ERM = {
  meta: {}, economicoFinanceira: {}, tecnica: {},
  juridica: {
    declaracoes: [
      "Declaração de que não emprega menor de idade",
      "Declaração de elaboração independente de proposta",
      "Declaração de inexistência de nepotismo (Súmula Vinculante 13)",
      "Declaração de reserva de cargos para pessoa com deficiência",
      "Declaração de visita técnica facultativa", // sem template → pendência (não some)
    ],
    clausula: null,
  },
  fiscalTrabalhista: {
    CNDs: [
      "Certidão Negativa de Débitos Federais (União/PGFN)",
      "Certificado de Regularidade do FGTS (CRF)",
      "Certidão Negativa de Débitos Trabalhistas (CNDT)",
    ],
    SICAF: null, clausula: null,
  },
};

// ── mapeamento rótulo → template ──────────────────────────────────────────────
test("mapDeclaracaoLabel casa rótulos livres do edital com o tipo canônico", () => {
  assert.equal(mapDeclaracaoLabel("Declaração de que não emprega menor de idade"), "menor");
  assert.equal(mapDeclaracaoLabel("elaboração independente de proposta"), "elaboracao_independente");
  assert.equal(mapDeclaracaoLabel("inexistência de nepotismo"), "nepotismo");
  assert.equal(mapDeclaracaoLabel("reserva de cargos para PCD"), "reserva_pcd");
  assert.equal(mapDeclaracaoLabel("cumprimento dos requisitos de habilitação"), "cumprimento_requisitos_habilitacao");
  assert.equal(mapDeclaracaoLabel("Declaração de visita técnica"), null); // sem template
});

test("todo template (exceto ME/EPP) produz texto não-vazio sem placeholder", () => {
  const PH = /\.\.\.|\bTBD\b|\bXXX\b|\[.*preencher.*\]/i;
  for (const t of DECLARACAO_TEMPLATES) {
    if (t.especial) continue;
    const txt = t.texto("ACME LTDA (CNPJ 00.000.000/0001-00)");
    assert.ok(txt.length > 40, `${t.tipo} vazio`);
    assert.ok(!PH.test(txt), `${t.tipo} contém placeholder`);
    assert.ok(t.citacao.length > 10, `${t.tipo} sem base/citação documentada`); // praxe ou estatuto
  }
});

// ── dossiê dirigido pelo ERM ──────────────────────────────────────────────────
test("sem ERM: mantém o conjunto fixo de 4 declarações (compatibilidade)", () => {
  const items = buildReviewDossier(OPP, CCP);
  const decl = items.filter((i) => i.secao.startsWith("Declarações"));
  assert.ok(decl.length >= 4);
});

test("com ERM: gera um item para CADA declaração exigida + rede de praxe", () => {
  const items = buildReviewDossier(OPP, CCP, ERM);
  const decl = items.filter((i) => i.secao.startsWith("Declarações"));
  // cada exigência do edital virou item (casado por editalLabel)
  for (const req of ERM.juridica.declaracoes) {
    assert.ok(decl.some((d) => d.editalLabel === req), `faltou item p/: ${req}`);
  }
  // a declaração sem template (visita técnica) entrou como pendência bloqueada, não sumiu
  const visita = decl.find((d) => d.editalLabel?.includes("visita"));
  assert.ok(visita && visita.requerCorrecao === true, "declaração sem template deve ser pendência bloqueada");
  // rede de praxe: cumprimento de requisitos entrou mesmo sem estar no ERM
  assert.ok(decl.some((d) => /cumpr/i.test(d.label)), "praxe (cumprimento habilitação) deveria entrar");
});

test("com ERM: cada certidão exigida vira item de anexo (visibilidade)", () => {
  const items = buildReviewDossier(OPP, CCP, ERM);
  const cnds = items.filter((i) => i.secao.startsWith("Certidões"));
  assert.equal(cnds.length, ERM.fiscalTrabalhista.CNDs.length);
});

// ── gate de completude ────────────────────────────────────────────────────────
test("gate PASS: dossiê do ERM cobre tudo (nada silenciosamente ausente)", () => {
  const reviewed = mergeReview(buildReviewDossier(OPP, CCP, ERM), {});
  const r = evaluateDocCompleteness({ erm: ERM, reviewed, vault: [], asOf: "2026-07-01T00:00:00Z" });
  assert.equal(r.declaracoes.missing.length, 0);
  assert.equal(r.certidoes.missing.length, 0);
  assert.equal(r.coveragePass, true);
  // mas NÃO está pronto p/ submeter: certidões sem doc no vault + declarações não revisadas
  assert.equal(r.submissionReady, false);
  assert.ok(r.certidoes.pending.length === 3, "3 certidões pendentes de vault");
});

test("gate FAIL: declaração exigida que não foi surfada (omissão silenciosa)", () => {
  const full = mergeReview(buildReviewDossier(OPP, CCP, ERM), {});
  // remove o item da declaração de nepotismo → simula omissão
  const semNepotismo = full.filter((i) => !/nepotismo/i.test(i.label) && i.editalLabel !== "Declaração de inexistência de nepotismo (Súmula Vinculante 13)");
  const r = evaluateDocCompleteness({ erm: ERM, reviewed: semNepotismo, vault: [], asOf: "2026-07-01T00:00:00Z" });
  assert.equal(r.coveragePass, false);
  assert.ok(r.declaracoes.missing.some((m) => /nepotismo/i.test(m)));
});

test("gate: certidão com doc válido no vault deixa de ser pendência", () => {
  const reviewed = mergeReview(buildReviewDossier(OPP, CCP, ERM), {});
  const vault = [
    { tipo: "CND Federal", validade: "2026-08-01T00:00:00Z" },
    { tipo: "CRF-FGTS", validade: "2026-08-01T00:00:00Z" },
    { tipo: "CNDT", validade: "2026-08-01T00:00:00Z" },
  ];
  const r = evaluateDocCompleteness({ erm: ERM, reviewed, vault, asOf: "2026-07-01T00:00:00Z" });
  assert.equal(r.certidoes.pending.length, 0, "todas as certidões cobertas por vault válido");
});

test("gate: certidão no vault VENCIDA continua pendente", () => {
  const reviewed = mergeReview(buildReviewDossier(OPP, CCP, ERM), {});
  const vault = [{ tipo: "CND Federal", validade: "2026-06-01T00:00:00Z" }]; // vencida em 01/07
  const r = evaluateDocCompleteness({ erm: ERM, reviewed, vault, asOf: "2026-07-01T00:00:00Z" });
  assert.ok(r.certidoes.pending.some((p) => /federa/i.test(p)), "CND federal vencida = pendente");
});
