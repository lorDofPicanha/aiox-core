// D3 (12/Jun): Plano de Vitória — ações com prazos reais derivados do checklist.
import assert from "node:assert/strict";
import { test } from "node:test";

const { buildVictoryPlan } = await import("../lib/noyce-victory-plan.ts");

const CHECKLIST = [
  { label: "Fiscal e trabalhista", status: "missing", note: "Vault sem certidões — anexe..." },
  { label: "Qualificação técnica", status: "warning", note: "Acervo pronto; falta o edital parseado" },
  { label: "Econômico-financeira", status: "ok", note: "folga 3,2×" },
  { label: "Garantia de proposta e visita técnica", status: "warning", note: "garantia ~1% — emitir até D-7" },
  { label: "Proposta e planilha", status: "ok", note: "67 dias" },
];

test("plano ordena por lead time: atestado/edital → certidões → garantia → sessão D-0", () => {
  const plan = buildVictoryPlan({
    checklist: CHECKLIST,
    proposalDeadline: "2026-06-30T13:00:00Z",
    asOf: "2026-05-23T00:00:00Z",
    reviewProgress: { done: 3, total: 13 },
  });
  const ids = plan.map((a) => a.id);
  assert.deepEqual(ids, ["atestado-empresa", "certidoes", "garantia", "revisao", "sessao-d0"]);
  // datas: garantia D-7 da sessão de 30/Jun = 23/Jun
  assert.equal(plan.find((a) => a.id === "garantia").due, "2026-06-23");
  // alarme da sessão sempre presente e cita preclusão
  const d0 = plan.find((a) => a.id === "sessao-d0");
  assert.match(d0.acao, /PRECLUEM|empate ficto/i);
});

test("prazo estourado vira atrasado; sem deadline vira 'a confirmar' sem data", () => {
  const atrasado = buildVictoryPlan({
    checklist: CHECKLIST,
    proposalDeadline: "2026-05-25T13:00:00Z",
    asOf: "2026-05-23T00:00:00Z",
    reviewProgress: null,
  });
  assert.equal(atrasado.find((a) => a.id === "atestado-empresa").status, "atrasado");

  const semPrazo = buildVictoryPlan({ checklist: CHECKLIST, proposalDeadline: null, asOf: "2026-05-23T00:00:00Z", reviewProgress: null });
  assert.equal(semPrazo.find((a) => a.id === "garantia").due, null);
  assert.match(semPrazo.find((a) => a.id === "sessao-d0").dueLabel, /confirmar/);
});

test("checklist todo ok → só o alarme da sessão fica", () => {
  const ok = CHECKLIST.map((c) => ({ ...c, status: "ok" }));
  const plan = buildVictoryPlan({ checklist: ok, proposalDeadline: "2026-06-30T13:00:00Z", asOf: "2026-05-23T00:00:00Z", reviewProgress: { done: 13, total: 13 } });
  assert.deepEqual(plan.map((a) => a.id), ["sessao-d0"]);
});
