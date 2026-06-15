import test from "node:test";
import assert from "node:assert/strict";

const { validateHabilitation } = await import("../lib/agents/guardrails.ts");
const { runHabilitation, FORJA_DEFINITION } = await import("../lib/agents/habilitation-agent.ts");

function fakeClient(json, opts = {}) {
  return {
    id: "fake",
    async complete() {
      if (opts.throws) throw new Error("boom");
      if (opts.refusal) return { text: "", json: null, model: "fake", refusal: true };
      return { text: JSON.stringify(json), json, model: "fake" };
    },
  };
}

const SOLO_OK = {
  decisao: "GO",
  resumo: "ENIAC qualifica solo: CAT de escola casa o atestado operacional; teto solo cobre o valor.",
  matchingAtestados: [{ requisito: "edificação escolar", catCasado: "CAT Escola Ednalda Guedes", confianca: "alta", alerta: null, fonte: "TR 11.2 + acervo" }],
  lacunas: [{ label: "Téc. Segurança do Trabalho", bloco: "tecnico_profissional", sanavel: true, comoSanar: "comprovar vínculo", fonte: "edital 9.5.1 e" }],
  consorcio: { necessario: false, motivo: "qualifica solo", perfilParceiro: null, fonte: "análise acervo×edital" },
  fonte: ["edital 9.5.1", "acervo ENIAC"],
};

const CONSORCIO_OK = {
  decisao: "CONSORCIO",
  resumo: "Acervo de reforma não cobre construção nova de CAPS — recomendado consórcio como líder.",
  matchingAtestados: [{ requisito: "construção nova de unidade de saúde", catCasado: null, confianca: "baixa", alerta: "acervo de reforma não casa construção nova", fonte: "TR 11.2" }],
  lacunas: [{ label: "quantitativo técnico", bloco: "tecnico_operacional", sanavel: true, comoSanar: "somar acervo via consórcio", fonte: "TR 11.2" }],
  consorcio: { necessario: true, motivo: "acervo insuficiente solo", perfilParceiro: "construtora ME/EPP com CAT de construção de saúde", fonte: "edital 4.4 / art. 15" },
  fonte: ["edital 4.4", "art. 15"],
};

// ── guardrail ──
test("validateHabilitation: solo válido passa", () => {
  assert.equal(validateHabilitation(SOLO_OK).ok, true);
});

test("validateHabilitation: consórcio coerente passa", () => {
  assert.equal(validateHabilitation(CONSORCIO_OK).ok, true);
});

test("validateHabilitation: matching sem fonte → viola proveniência", () => {
  const bad = { ...SOLO_OK, matchingAtestados: [{ ...SOLO_OK.matchingAtestados[0], fonte: "" }] };
  const r = validateHabilitation(bad);
  assert.equal(r.ok, false);
  assert.ok(r.violations.some((v) => v.rule === "provenance"));
});

test("validateHabilitation: decisão CONSORCIO sem necessario=true → incoerente", () => {
  const bad = { ...CONSORCIO_OK, consorcio: { ...CONSORCIO_OK.consorcio, necessario: false } };
  assert.equal(validateHabilitation(bad).ok, false);
});

test("validateHabilitation: resumo que EXECUTA ato vinculante → bloqueado", () => {
  const bad = { ...SOLO_OK, resumo: "Protocolei o recurso e enviei a proposta." };
  assert.equal(validateHabilitation(bad).ok, false);
});

// ── runHabilitation ──
const input = { objeto: "Construção de UBS", editalExcerpt: "9.5.1 ... 11.2 ...", comConsorcio: false };

test("runHabilitation: happy path solo (source=llm)", async () => {
  const res = await runHabilitation(input, fakeClient(SOLO_OK));
  assert.equal(res.source, "llm");
  assert.equal(res.decisao, "GO");
  assert.equal(res.matchingAtestados[0].catCasado, "CAT Escola Ednalda Guedes");
});

test("runHabilitation: caso consórcio (source=llm, decisao=CONSORCIO)", async () => {
  const res = await runHabilitation(input, fakeClient(CONSORCIO_OK));
  assert.equal(res.source, "llm");
  assert.equal(res.decisao, "CONSORCIO");
  assert.equal(res.consorcio.necessario, true);
  assert.match(res.consorcio.perfilParceiro, /ME\/EPP/);
});

test("runHabilitation: recusa → INDETERMINADO (sem afirmação sem fonte)", async () => {
  const res = await runHabilitation(input, fakeClient(null, { refusal: true }));
  assert.equal(res.source, "guardrail_fallback");
  assert.equal(res.decisao, "INDETERMINADO");
  assert.ok(res.pendencias.length > 0);
});

test("runHabilitation: erro do cliente → INDETERMINADO", async () => {
  const res = await runHabilitation(input, fakeClient(null, { throws: true }));
  assert.equal(res.decisao, "INDETERMINADO");
});

test("runHabilitation: violação de guardrail → INDETERMINADO", async () => {
  const bad = { ...SOLO_OK, matchingAtestados: [{ ...SOLO_OK.matchingAtestados[0], fonte: "" }] };
  const res = await runHabilitation(input, fakeClient(bad));
  assert.equal(res.source, "guardrail_fallback");
  assert.equal(res.decisao, "INDETERMINADO");
});

test("FORJA_DEFINITION usa Opus (raciocínio)", () => {
  assert.equal(FORJA_DEFINITION.model, "claude-opus-4-8");
});
