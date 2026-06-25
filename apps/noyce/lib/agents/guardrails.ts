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

// Validate a Forja habilitation output: decisão coerente, matching de atestados e lacunas com
// fonte, consórcio justificado, e nenhum ato vinculante executado.
const DECISOES = ["GO", "NO_GO", "CONSORCIO", "INDETERMINADO"] as const;

export function validateHabilitation(result: unknown): GuardrailResult {
  const v: GuardrailViolation[] = [];
  const r = (result ?? {}) as Record<string, unknown>;

  if (typeof r.decisao !== "string" || !DECISOES.includes(r.decisao as (typeof DECISOES)[number])) {
    v.push({ rule: "schema", field: "decisao", detail: `decisão inválida: ${String(r.decisao)}` });
  }
  if (typeof r.resumo !== "string" || r.resumo.trim().length < 5) {
    v.push({ rule: "provenance", field: "resumo", detail: "resumo ausente/curto" });
  }
  if (!Array.isArray(r.fonte) || r.fonte.length === 0) {
    v.push({ rule: "provenance", field: "fonte", detail: "sem fontes (proveniência)" });
  }

  const matching = Array.isArray(r.matchingAtestados) ? (r.matchingAtestados as Array<Record<string, unknown>>) : [];
  matching.forEach((m, i) => {
    if (typeof m.fonte !== "string" || m.fonte.trim().length === 0) {
      v.push({ rule: "provenance", field: `matchingAtestados[${i}].fonte`, detail: "matching sem fonte" });
    }
  });

  const lacunas = Array.isArray(r.lacunas) ? (r.lacunas as Array<Record<string, unknown>>) : [];
  lacunas.forEach((l, i) => {
    if (typeof l.fonte !== "string" || l.fonte.trim().length === 0) {
      v.push({ rule: "provenance", field: `lacunas[${i}].fonte`, detail: "lacuna sem fonte" });
    }
  });

  // Coerência: decisão CONSORCIO exige consorcio.necessario = true.
  const cons = (r.consorcio ?? {}) as Record<string, unknown>;
  if (r.decisao === "CONSORCIO" && cons.necessario !== true) {
    v.push({ rule: "schema", field: "consorcio.necessario", detail: "decisão CONSORCIO sem consorcio.necessario=true" });
  }

  const human = enforceHumanActs(String(r.resumo ?? ""));
  if (!human.ok) v.push(...human.violations);

  return { ok: v.length === 0, violations: v };
}

// Validate a Prisma opportunity analysis: sourced scores, sourced market/price blocks,
// sourced risks/challenges, and no binding act executed by the agent.
export function validateAnalysis(result: unknown): GuardrailResult {
  const v: GuardrailViolation[] = [];
  const r = (result ?? {}) as Record<string, unknown>;

  if (typeof r.opportunityScore !== "number" || r.opportunityScore < 0 || r.opportunityScore > 100) {
    v.push({ rule: "schema", field: "opportunityScore", detail: "opportunityScore fora de 0..100" });
  }
  if (typeof r.confidenceScore !== "number" || r.confidenceScore < 0 || r.confidenceScore > 100) {
    v.push({ rule: "schema", field: "confidenceScore", detail: "confidenceScore fora de 0..100" });
  }
  if (typeof r.resumo !== "string" || r.resumo.trim().length < 5) {
    v.push({ rule: "provenance", field: "resumo", detail: "resumo ausente/curto" });
  }
  if (!Array.isArray(r.fonte) || r.fonte.length === 0) {
    v.push({ rule: "provenance", field: "fonte", detail: "sem fontes (proveniência)" });
  }

  const faixaPreco = (r.faixaPreco ?? {}) as Record<string, unknown>;
  if (typeof faixaPreco.fonte !== "string" || faixaPreco.fonte.trim().length === 0) {
    v.push({ rule: "provenance", field: "faixaPreco.fonte", detail: "faixa de preço sem fonte" });
  }

  const concorrencia = (r.concorrencia ?? {}) as Record<string, unknown>;
  if (typeof concorrencia.fonte !== "string" || concorrencia.fonte.trim().length === 0) {
    v.push({ rule: "provenance", field: "concorrencia.fonte", detail: "concorrência sem fonte" });
  }

  const riscos = Array.isArray(r.riscos) ? (r.riscos as Array<Record<string, unknown>>) : [];
  riscos.forEach((risco, i) => {
    if (typeof risco.fonte !== "string" || risco.fonte.trim().length === 0) {
      v.push({ rule: "provenance", field: `riscos[${i}].fonte`, detail: "risco sem fonte" });
    }
  });

  const pontosImpugnacao = Array.isArray(r.pontosImpugnacao) ? (r.pontosImpugnacao as Array<Record<string, unknown>>) : [];
  pontosImpugnacao.forEach((ponto, i) => {
    if (typeof ponto.fonte !== "string" || ponto.fonte.trim().length === 0) {
      v.push({ rule: "provenance", field: `pontosImpugnacao[${i}].fonte`, detail: "ponto de impugnação sem fonte" });
    }
  });

  const human = enforceHumanActs(String(r.resumo ?? ""));
  if (!human.ok) v.push(...human.violations);

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
//
// I1 — ato vinculante = humano (responsabilidade administrativa/criminal, Lei
// 14.133 art. 155; BLL Art. 13§3/27/32). A blocklist de ~6 frases vazava por
// SINÔNIMO ("dei entrada no recurso", "peticionei", "interpus", "apresentei as
// contrarrazões"…). Aqui detectamos os VERBOS de ato vinculante por radical,
// cobrindo conjugações (1ª pessoa/3ª pessoa, passado/perfeito), em vez de casar
// frases inteiras.
//
// POSTURA (mantida): DESCREVER um ato para revisão humana é OK ("preparei a
// minuta para revisão", "minuta de recurso pronta para o advogado"); AFIRMAR um
// ato JÁ EXECUTADO é BLOQUEADO ("protocolei o recurso", "dei entrada na
// impugnação"). Por isso os radicais miram conjugações de ato CONSUMADO, e há
// um whitelist de contextos de preparo/revisão que neutraliza o match.
const BINDING_ACT_PATTERNS: { re: RegExp; label: string }[] = [
  // protocolar / protocolizar (protocolei, protocolizei, protocolou, protocolado, protocolizado)
  { re: /\bprotocol(iz)?(ei|ou|amos|aram|ado[as]?|izad[ao]s?)\b/, label: "protocolar" },
  // peticionar (peticionei, peticionou, peticionado)
  { re: /\bpeticion(ei|ou|amos|aram|ado[as]?)\b/, label: "peticionar" },
  // interpor recurso (interpus, interpôs/interpos, interposto, interpusemos, interpuseram)
  { re: /\binterp(us|ôs|os|usemos|useram|osto[as]?)\b/, label: "interpor" },
  // dar entrada (no recurso/na impugnação)
  { re: /\bdei entrada\b|\bdeu entrada\b|\bdemos entrada\b/, label: "dar entrada" },
  // apresentar contrarrazões / recurso / impugnação / defesa (ato consumado)
  { re: /\bapresent(ei|ou|amos|aram|ad[ao]s?)\s+(as?\s+)?(contrarraz|recurso|impugna|defesa|proposta|raz[õo]es)/, label: "apresentar (ato)" },
  // submeter / enviar / transmitir a proposta/recurso/lance (consumado)
  { re: /\bsubmet(i|eu|emos|eram|id[ao]s?)\s+(a\s+|o\s+)?(proposta|recurso|lance|impugna|contrarraz)/, label: "submeter" },
  { re: /\benvi(ei|ou|amos|aram|ad[ao]s?)\s+(a\s+|o\s+)?(proposta|recurso|lance|impugna|contrarraz)/, label: "enviar" },
  { re: /\btransmit(i|iu|imos|iram|id[ao]s?)\s+(a\s+|o\s+)?(proposta|recurso|lance|impugna|contrarraz)/, label: "transmitir" },
  // assinar e enviar / assinei e protocolei (assinatura como ato vinculante)
  { re: /\bassin(ei|ou|amos|aram|ad[ao]s?)\s+e\s+(envi|protocol|transmit)/, label: "assinar e enviar" },
  // dar lance (dei o lance, demos o lance)
  { re: /\bdei o lance\b|\bdeu o lance\b|\bdemos o lance\b|\blancei\b/, label: "dar lance" },
  // responder diligência (respondi a diligência, respondeu à diligência) — resposta
  // a diligência é ato vinculante humano (resposta_diligencia em MAESTRO_BINDING_ACTS).
  { re: /\brespond(i|eu|emos|eram|id[ao]s?)\s+(a|à|ao)\s+(diligên|diligen)/, label: "responder diligência" },
  // automação explícita de ato vinculante
  { re: /\b(protocol|peticion|submet|envi|transmit)\w*\s+automaticamente\b/, label: "automação de ato" },
];

// FONTE DE VERDADE: cada ato em MAESTRO_BINDING_ACTS (maestro-types.ts) — lance,
// declaracao, proposta, recurso, contrarrazoes, impugnacao_edital,
// resposta_diligencia — tem um padrão de execução acima. enforceHumanActs é o
// enforcement runtime desses atos; ampliar a lista lá implica ampliar aqui.

// Contextos de PREPARO/REVISÃO que neutralizam o match (descrever ≠ executar).
// Se a frase fala claramente de minuta/rascunho/preparo PARA revisão humana, é OK.
const REVIEW_CONTEXT_RE =
  /\b(minuta|rascunho|para (revis|aprova|o advogad|o humano|assinatura humana)|sugest|recomend|preparei .* para revis|pronto[as]? para (revis|o advogad|assinatura))/;

export function enforceHumanActs(text: string): GuardrailResult {
  const lowered = (text ?? "").toLowerCase();
  // Enforcement só faz sentido se há atos vinculantes registrados (sempre há hoje).
  if (HUMAN_REQUIRED_ACTS.length < 1) return { ok: true, violations: [] };

  const hit = BINDING_ACT_PATTERNS.find((p) => p.re.test(lowered));
  if (!hit) return { ok: true, violations: [] };

  // Match de verbo consumado, MAS o texto é claramente preparo/minuta p/ revisão
  // → não é afirmação de ato executado. Conservador: só perdoa se NÃO houver
  // verbo de execução isolado (ex.: "protocolei") fora de contexto de minuta.
  if (REVIEW_CONTEXT_RE.test(lowered) && !/\bprotocol(iz)?(ei|ou)\b|\binterp(us|ôs|os)\b|\bpeticion(ei|ou)\b|\bdei entrada\b/.test(lowered)) {
    return { ok: true, violations: [] };
  }

  return {
    ok: false,
    violations: [
      { rule: "human_act", detail: `ato vinculante executado pelo agente ("${hit.label}") — deve ser humano (I1)` },
    ],
  };
}
