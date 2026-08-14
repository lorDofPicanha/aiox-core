import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const {
  captureText,
  emptyRule,
  evaluateRule,
  findTermSpans,
  foldText,
  foldToken,
  probeRule,
  segmentByHits,
  validateRule,
} = await import("../lib/noyce-keywords.ts");

const here = path.dirname(fileURLToPath(import.meta.url));
const readJson = (...parts) => JSON.parse(readFileSync(path.join(here, "..", ...parts), "utf8"));
const config = readJson("lib", "data", "keyword-groups.json");
const snapshot = readJson("lib", "data", "discovery-snapshot.json");

const rule = (over = {}) => ({ ...emptyRule("r1"), term: "obra", ...over });

// ---------------------------------------------------------------------------
// Dobra PT-BR — as 4 dimensões que o motor promete cobrir
// ---------------------------------------------------------------------------

test("dobra une singular e plural, inclusive nos plurais irregulares", () => {
  const pairs = [
    ["obra", "obras"],
    ["ponte", "pontes"],
    ["material", "materiais"],
    ["nível", "níveis"],
    ["luz", "luzes"],
    ["cor", "cores"],
    ["homem", "homens"],
    ["construção", "construções"],
    ["cidade", "cidades"],
    ["creche", "creches"],
  ];
  for (const [singular, plural] of pairs) {
    assert.equal(foldToken(singular), foldToken(plural), `${singular} deveria dobrar junto com ${plural}`);
  }
});

test("dobra une gênero e ignora acento e caixa", () => {
  assert.equal(foldToken("asfáltico"), foldToken("ASFALTICAS"));
  assert.equal(foldToken("público"), foldToken("pública"));
  assert.equal(foldToken("Praça"), foldToken("pracas"));
});

test("dobra NÃO funde palavras de raízes diferentes", () => {
  // Regressão: "escola" (o prédio) não pode casar com "escolar" (o adjetivo) — senão
  // "material escolar" entraria como obra.
  assert.notEqual(foldToken("escola"), foldToken("escolar"));
  assert.notEqual(foldToken("obra"), foldToken("obrigatório"));
});

test("dobra preserva tokens curtos em vez de destruí-los", () => {
  assert.equal(foldToken("ala"), "ala");
  assert.equal(foldToken("ubs"), "ubs");
});

// ---------------------------------------------------------------------------
// Casamento por token inteiro + spans no texto original
// ---------------------------------------------------------------------------

test("casa por token inteiro, nunca por substring", () => {
  const folded = foldText("Serviço de obraria e obrigações diversas");
  assert.equal(findTermSpans(folded, "obra").length, 0, '"obra" não pode casar dentro de outra palavra');
});

test("termo multi-palavra casa através da pontuação", () => {
  const spans = findTermSpans(foldText("Execução de meio-fio e sarjeta"), "meio fio");
  assert.equal(spans.length, 1);
  assert.equal("Execução de meio-fio e sarjeta".slice(spans[0].start, spans[0].end), "meio-fio");
});

test("spans apontam para o texto ORIGINAL, com acento e caixa preservados", () => {
  const text = "REFORMA E AMPLIAÇÃO DA ESCOLA MUNICIPAL";
  const spans = findTermSpans(foldText(text), "ampliações");
  assert.equal(spans.length, 1);
  assert.equal(text.slice(spans[0].start, spans[0].end), "AMPLIAÇÃO");
});

// ---------------------------------------------------------------------------
// Semântica das três listas
// ---------------------------------------------------------------------------

test("complementarMode 'todas' exige TODAS as complementares", () => {
  const folded = foldText("Execução de obra de pavimentação asfáltica");
  assert.equal(evaluateRule(rule({ complementares: ["pavimentação"] }), folded).matched, true);
  assert.equal(evaluateRule(rule({ complementares: ["pavimentação", "drenagem"] }), folded).matched, false);
});

test("complementarMode 'qualquer' basta UMA complementar", () => {
  const folded = foldText("Execução de obra de pavimentação asfáltica");
  const verdict = evaluateRule(
    rule({ complementares: ["drenagem", "pavimentação"], complementarMode: "qualquer" }),
    folded,
  );
  assert.equal(verdict.matched, true);
});

test("indesejada veta e o motor DIZ qual palavra vetou", () => {
  const verdict = evaluateRule(
    rule({ term: "construção", indesejadas: ["material de construção"] }),
    foldText("Aquisição de materiais de construção para a prefeitura"),
  );
  assert.equal(verdict.matched, false);
  assert.equal(verdict.blockedBy, "material de construção");
  assert.match(verdict.reason, /indesejada/);
});

test("veto tem precedência sobre complementar satisfeita", () => {
  const verdict = evaluateRule(
    rule({ term: "construção", complementares: ["escola"], indesejadas: ["material de construção"] }),
    foldText("Aquisição de material de construção para a escola municipal"),
  );
  assert.equal(verdict.matched, false);
  assert.equal(verdict.blockedBy, "material de construção");
});

test("ausência do termo principal não conta como veto", () => {
  const verdict = evaluateRule(rule({ term: "drenagem", indesejadas: ["aquisição"] }), foldText("Aquisição de café"));
  assert.equal(verdict.matched, false);
  assert.equal(verdict.blockedBy, null, "sem o principal, o edital nem é candidato — não é descarte");
});

test("toda decisão vem com motivo legível", () => {
  const folded = foldText("Reforma da quadra poliesportiva");
  for (const candidate of [
    rule({ term: "reforma" }),
    rule({ term: "drenagem" }),
    rule({ term: "reforma", complementares: ["drenagem"] }),
    rule({ term: "reforma", indesejadas: ["quadra"] }),
  ]) {
    const verdict = evaluateRule(candidate, folded);
    assert.ok(verdict.reason.length > 10, "motivo não pode ser vazio");
  }
});

// ---------------------------------------------------------------------------
// Regras desabilitadas e validação
// ---------------------------------------------------------------------------

test("regra desligada não captura", () => {
  const cfg = {
    groups: [{ id: "g", name: "G", rules: [rule({ term: "reforma", enabled: false })] }],
    profiles: [{ id: "p", name: "P", groupIds: ["g"], enabled: true }],
  };
  assert.equal(captureText("Reforma da escola", cfg).primary, null);
});

test("perfil desligado não captura", () => {
  const cfg = {
    groups: [{ id: "g", name: "G", rules: [rule({ term: "reforma" })] }],
    profiles: [{ id: "p", name: "P", groupIds: ["g"], enabled: false }],
  };
  assert.equal(captureText("Reforma da escola", cfg).primary, null);
});

test("validação pega a regra que nunca capturaria nada", () => {
  assert.ok(validateRule(rule({ term: "" })).length > 0);
  assert.ok(validateRule(rule({ term: "obra", indesejadas: ["obras"] })).length > 0, "principal == indesejada é contradição");
  assert.ok(validateRule(rule({ term: "obra", complementares: ["escola"], indesejadas: ["escolas"] })).length > 0);
  assert.deepEqual(validateRule(rule({ term: "obra", complementares: ["escola"] })), []);
});

// ---------------------------------------------------------------------------
// Atribuição — o equivalente auditável do "Perfil de busca"
// ---------------------------------------------------------------------------

test("captura credita perfil, grupo, regra e termo", () => {
  const result = captureText("Contratação para execução de obra de pavimentação asfáltica", config);
  assert.ok(result.primary, "deveria capturar");
  assert.equal(result.primary.profileId, "eniac-obras");
  assert.ok(result.primary.groupId.length > 0);
  assert.ok(result.primary.ruleId.length > 0);
  assert.ok(result.primary.hits.length > 0, "sem hits não há como destacar nem auditar");
});

test("atribuição é determinística na ordem perfil → grupo → regra", () => {
  const text = "Execução de obra de pavimentação asfáltica em escola municipal";
  const first = captureText(text, config).primary;
  for (let i = 0; i < 5; i++) {
    assert.deepEqual(captureText(text, config).primary, first);
  }
});

test("um edital pego por vários grupos reporta todos os créditos", () => {
  const result = captureText("Execução de obra de pavimentação asfáltica e drenagem", config);
  assert.ok(result.matches.length >= 2, "obras-civis + pavimentação deveriam ambos casar");
});

// ---------------------------------------------------------------------------
// Painel de teste ao vivo
// ---------------------------------------------------------------------------

test("probe devolve denominador honesto e amostra destacada", () => {
  const targets = snapshot.items.slice(0, 300).map((item) => ({ id: item.id, text: item.title }));
  const result = probeRule(rule({ term: "obra" }), targets, 5);
  assert.equal(result.universe, targets.length, "o universo testado tem que ser explícito");
  assert.ok(result.total <= result.universe);
  assert.ok(result.sample.length <= 5);
  for (const row of result.sample) {
    assert.ok(row.hits.length > 0, "toda linha da amostra precisa mostrar POR QUE entrou");
  }
});

test("probe separa 'não tem o termo' de 'foi vetado' e de 'faltou complementar'", () => {
  const targets = [
    { id: "1", text: "Execução de obra de pavimentação" },
    { id: "2", text: "Aquisição de material de construção" },
    { id: "3", text: "Contratação de obra sem o termo refinador" },
    { id: "4", text: "Aquisição de café e açúcar" },
  ];
  const result = probeRule(
    rule({ term: "obra", complementares: ["pavimentação"], indesejadas: ["material de construção"] }),
    targets,
  );
  assert.equal(result.total, 1);
  assert.equal(result.missedByComplementar, 1, "o item 3 tem o principal mas não a complementar");
  assert.equal(result.universe, 4);
});

// ---------------------------------------------------------------------------
// Destaque
// ---------------------------------------------------------------------------

test("segmentação reconstrói o texto exato, sem perder nem duplicar caractere", () => {
  const text = "Execução de obra de pavimentação asfáltica na escola";
  const verdict = evaluateRule(rule({ term: "obra", complementares: ["pavimentação"] }), foldText(text));
  const segments = segmentByHits(text, verdict.hits);
  assert.equal(segments.map((s) => s.text).join(""), text);
  assert.ok(segments.some((s) => s.hit !== null));
});

test("segmentação tolera spans sobrepostos sem duplicar texto", () => {
  const text = "obra de obra";
  const hits = [
    { start: 0, end: 4, term: "obra", role: "principal" },
    { start: 0, end: 12, term: "obra de obra", role: "principal" },
    { start: 8, end: 12, term: "obra", role: "principal" },
  ];
  assert.equal(segmentByHits(text, hits).map((s) => s.text).join(""), text);
});

// ---------------------------------------------------------------------------
// Contrato do seed — protege a calibração feita com dado real
// ---------------------------------------------------------------------------

test("seed é válido: toda regra passa na validação e todo grupo do perfil existe", () => {
  const ids = new Set(config.groups.map((group) => group.id));
  for (const profile of config.profiles) {
    for (const groupId of profile.groupIds) {
      assert.ok(ids.has(groupId), `perfil ${profile.id} aponta para grupo inexistente ${groupId}`);
    }
  }
  for (const group of config.groups) {
    assert.ok(group.rules.length > 0, `grupo ${group.id} está vazio`);
    for (const item of group.rules) {
      assert.deepEqual(validateRule(item), [], `regra ${item.id} é inválida`);
    }
  }
});

test("toda regra do seed captura algo real no snapshot — nada de termo inventado", () => {
  const targets = snapshot.items.map((item) => ({ id: item.id, text: item.title }));
  for (const group of config.groups) {
    for (const item of group.rules) {
      const result = probeRule(item, targets, 0);
      assert.ok(result.total > 0, `regra "${item.term}" (${item.id}) não captura NADA — termo inventado?`);
    }
  }
});

test("o veto de material de construção não derruba obra de verdade", () => {
  // Regressão da calibração de 12/Ago: "aquisição" como veto amplo matava obras reais;
  // o veto correto é a expressão "material de construção".
  const cfg = { groups: config.groups, profiles: config.profiles };
  assert.ok(captureText("Execução de obra de construção de escola municipal", cfg).primary);
  assert.equal(captureText("Aquisição de materiais de construção para a prefeitura", cfg).primary, null);
});
