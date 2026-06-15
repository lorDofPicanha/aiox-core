// Deterministic guardrails (the "Lastro" layer). Every agent output is validated here BEFORE
// it reaches the app — this is what makes a cheaper model safe: provenance, deadline, schema and
// human-act invariants are enforced in code, not trusted to the LLM.

import { isDeadlinePassed } from "../noyce-operational.ts";
import { HUMAN_REQUIRED_ACTS } from "../noyce-source-registry.ts";
import type { GuardrailResult, GuardrailViolation } from "./agent-types.ts";

const VERDICTS = ["vai", "olha", "pula"] as const;

// Validate a triage (Faro) output against the invariants + the DiscoveryTriage shape.
export function validateTriage(
  result: unknown,
  item: { proposalDeadline: string | null },
): GuardrailResult {
  const v: GuardrailViolation[] = [];
  const r = (result ?? {}) as Record<string, unknown>;

  if (typeof r.verdict !== "string" || !VERDICTS.includes(r.verdict as (typeof VERDICTS)[number])) {
    v.push({ rule: "schema", field: "verdict", detail: `verdict inválido: ${String(r.verdict)}` });
  }
  if (typeof r.reason !== "string" || r.reason.trim().length < 5) {
    v.push({ rule: "provenance", field: "reason", detail: "razão ausente ou curta demais (sem proveniência)" });
  }
  if (typeof r.score !== "number" || r.score < 0 || r.score > 100) {
    v.push({ rule: "schema", field: "score", detail: "score fora de 0..100" });
  }
  // Edital com prazo vencido NÃO pode ser oportunidade aberta — força 'pula'.
  if (isDeadlinePassed(item.proposalDeadline) && r.verdict !== "pula") {
    v.push({ rule: "deadline", field: "verdict", detail: "prazo vencido deve resultar em 'pula'" });
  }
  return { ok: v.length === 0, violations: v };
}

// Generic: reject any factual claim object missing its `fonte`/source field.
export function requireProvenance(obj: Record<string, unknown>, field = "fonte"): GuardrailResult {
  const val = obj[field];
  const ok = (typeof val === "string" && val.trim().length > 0) || (Array.isArray(val) && val.length > 0);
  return ok
    ? { ok: true, violations: [] }
    : { ok: false, violations: [{ rule: "provenance", field, detail: "afirmação sem fonte" }] };
}

// Validate an Escriba document package: every planilha item must have a source + positive
// numbers, BDI in a sane range, every declaração sourced, and no executed binding act.
export function validateDocumentPackage(pkg: unknown): GuardrailResult {
  const v: GuardrailViolation[] = [];
  const p = (pkg ?? {}) as Record<string, unknown>;
  const itens = Array.isArray(p.planilhaItens) ? (p.planilhaItens as Array<Record<string, unknown>>) : [];

  if (itens.length === 0) {
    v.push({ rule: "schema", field: "planilhaItens", detail: "planilha sem itens" });
  }
  itens.forEach((it, i) => {
    if (typeof it.fonte !== "string" || it.fonte.trim().length === 0) {
      v.push({ rule: "provenance", field: `planilhaItens[${i}].fonte`, detail: "item sem fonte" });
    }
    if (typeof it.quantidade !== "number" || it.quantidade <= 0) {
      v.push({ rule: "number", field: `planilhaItens[${i}].quantidade`, detail: "quantidade inválida" });
    }
    if (typeof it.precoUnitario !== "number" || it.precoUnitario <= 0) {
      v.push({ rule: "number", field: `planilhaItens[${i}].precoUnitario`, detail: "preço unitário inválido" });
    }
  });

  const bdi = p.bdiPct;
  if (typeof bdi !== "number" || bdi < 0 || bdi > 60) {
    v.push({ rule: "number", field: "bdiPct", detail: "BDI fora de 0..60%" });
  }

  const decls = Array.isArray(p.declaracoes) ? (p.declaracoes as Array<Record<string, unknown>>) : [];
  decls.forEach((d, i) => {
    if (typeof d.fonte !== "string" || d.fonte.trim().length === 0) {
      v.push({ rule: "provenance", field: `declaracoes[${i}].fonte`, detail: "declaração sem fonte" });
    }
    const human = enforceHumanActs(String(d.texto ?? ""));
    if (!human.ok) v.push(...human.violations.map((hv) => ({ ...hv, field: `declaracoes[${i}].texto` })));
  });

  return { ok: v.length === 0, violations: v };
}

// Generic: block any agent output that claims to EXECUTE a binding act (must be human).
export function enforceHumanActs(text: string): GuardrailResult {
  const lowered = text.toLowerCase();
  const verbs = ["protocolei", "submeti", "dei o lance", "enviei a proposta", "assinei e enviei", "protocolar automaticamente"];
  const hit = verbs.find((x) => lowered.includes(x));
  if (hit && HUMAN_REQUIRED_ACTS.length > 0) {
    return { ok: false, violations: [{ rule: "human_act", detail: `ato vinculante executado pelo agente ("${hit}") — deve ser humano` }] };
  }
  return { ok: true, violations: [] };
}
