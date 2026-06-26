// Minuta do Tribuno (recurso/contrarrazões) + ingestão de ata. Determinístico, sem API.
import assert from "node:assert/strict";
import { test } from "node:test";

const { buildRecursoMinuta } = await import("../lib/noyce-recurso-minuta.ts");
const { buildRecursoPlan } = await import("../lib/agents/maestro-runtime.ts");
const { parseAtaResult } = await import("../lib/noyce-ata.ts");

const CCP = { identity: { razaoSocial: "ENIAC EMPREENDIMENTOS LTDA", cnpj: "36.819.268/0001-05", sedeMunicipioIbge: "5200258" } };
const CERTAME = { titulo: "Reforma de escola", orgao: "Município de Águas Lindas/GO" };
const result = (outcome, extra = {}) => ({ editalId: "e1", editalVersionHash: "h1", sessionAt: "2026-06-10T14:00:00-03:00", eniacOutcome: outcome, source: "manual", confidence: "observed", ...extra });

// ── minuta de recurso ──
test("minuta: inabilitada com fundamentos → RECURSO completo, tempestivo, com CNPJ e art. 165", () => {
  const r = result("inabilitada", { motivo: "atestado recusado" });
  const m = buildRecursoMinuta({ result: r, plan: buildRecursoPlan(r), ccp: CCP, certame: CERTAME, fundamentos: "A decisão violou o art. 63 da Lei 14.133, pois o atestado apresentado é compatível com o objeto, conforme jurisprudência do TCU." });
  assert.equal(m.tipo, "recurso");
  assert.equal(m.requerCorrecao, true);
  assert.match(m.texto, /RECURSO ADMINISTRATIVO/);
  assert.match(m.texto, /36\.819\.268\/0001-05/);
  assert.match(m.texto, /art\. 165/);
  assert.match(m.texto, /TEMPESTIVO/i);
  assert.match(m.texto, /jurisprudência do TCU/); // fundamentos do humano entraram
  assert.ok(!/A DESENVOLVER/.test(m.texto), "com fundamentos não deve haver placeholder");
});

test("minuta: sem fundamentos → seção DO DIREITO bloqueada + aviso", () => {
  const r = result("inabilitada");
  const m = buildRecursoMinuta({ result: r, plan: buildRecursoPlan(r), ccp: CCP, certame: CERTAME });
  assert.match(m.texto, /A DESENVOLVER PELO ADVOGADO/);
  assert.ok(m.avisos.some((a) => /bloqueada/i.test(a)));
});

test("minuta: vencedora → CONTRARRAZÕES (defesa), não recurso", () => {
  const r = result("vencedora");
  const m = buildRecursoMinuta({ result: r, plan: buildRecursoPlan(r), ccp: CCP, certame: CERTAME, recorrenteTerceiro: "CONSTRUTORA RIVAL LTDA", fundamentos: "O recurso não merece provimento porque a habilitação da recorrente está integralmente comprovada." });
  assert.equal(m.tipo, "contrarrazoes");
  assert.match(m.texto, /CONTRARRAZÕES/);
  assert.match(m.texto, /CONSTRUTORA RIVAL LTDA/);
});

// ── parse de ata ──
test("ata: ENIAC inabilitada → outcome + data + motivo", () => {
  const a = parseAtaResult("Sessão realizada em 10/06/2026 às 14:00. A empresa ENIAC foi INABILITADA por não apresentar atestado de capacidade técnica compatível.");
  assert.equal(a.eniacOutcome, "inabilitada");
  assert.equal(a.sessionAt, "2026-06-10T14:00:00-03:00");
  assert.ok(a.motivo && /atestado|n[ãa]o apresentar/i.test(a.motivo));
});

test("ata: terceiro vencedor → derrotada_julgamento + nome do vencedor", () => {
  const a = parseAtaResult("Foi declarada vencedora a empresa CONSTRUTORA ALFA LTDA, com a melhor proposta.");
  assert.equal(a.eniacOutcome, "derrotada_julgamento");
  assert.ok(a.winnerNome && /ALFA/.test(a.winnerNome));
});

test("ata: ENIAC vencedora prevalece", () => {
  const a = parseAtaResult("A ENIAC foi declarada vencedora do certame.");
  assert.equal(a.eniacOutcome, "vencedora");
  assert.equal(a.winnerNome, null);
});
