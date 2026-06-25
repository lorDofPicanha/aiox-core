/**
 * Testes do engine PURO do Health Score cross-módulo (S12).
 *
 * Runner sem framework (espelha app/ecac/saude-fiscal-model.test.mjs): importa o model .ts
 * DIRETO — Node ≥ 24 faz type-stripping nativo, sem tsx/ts-node. As funções são puras e
 * determinísticas (sem relógio), então cada caso monta sinais e checa o score/banda/breakdown.
 *
 * Rodar:  node app/saude-carteira/health-score-model.test.mjs   (a partir de apps/contador)
 * Exit 0 = tudo verde · Exit 1 = ao menos uma asserção falhou.
 *
 * G6: o teste descreve INDÍCIOS e score de exposição; não afirma desfecho fiscal.
 */
import {
  PESOS_FATOR,
  UNIDADE_MATERIALIDADE_RS,
  bandaDoScore,
  calcularHealthScore,
  rankearCarteira,
  resumirHealth,
} from "./health-score-model.ts";

// ---------------------------------------------------------------------------
// Mini-harness de asserção
// ---------------------------------------------------------------------------
let falhas = 0;
let total = 0;

function ok(cond, nome) {
  total += 1;
  if (!cond) {
    falhas += 1;
    console.error(`  FAIL  ${nome}`);
  }
}

function eq(actual, expected, nome) {
  total += 1;
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    falhas += 1;
    console.error(`  FAIL  ${nome}\n        esperado: ${e}\n        obtido:   ${a}`);
  }
}

/** Sinal do core com defaults zerados (sobrescreve o que o caso precisa). */
function core(over = {}) {
  return {
    indiciosAbertos: 0,
    indiciosBaixaConfianca: 0,
    materialidadeEmDisputa: 0,
    divergenciasCclasstrib: 0,
    ...over,
  };
}

/** Sinal do e-CAC com defaults zerados. */
function ecac(over = {}) {
  return {
    prazosNoLimite: 0,
    prazosUrgentes: 0,
    cndsVencidas: 0,
    cndsAVencer: 0,
    mensagensCriticasNaoLidas: 0,
    ...over,
  };
}

/** Monta uma entrada do score (com defaults de identidade). */
function entrada(over = {}) {
  return {
    clienteId: "c1",
    clienteNome: "Cliente 1",
    documento: "11222333000181",
    core: null,
    ecac: null,
    ...over,
  };
}

// ===========================================================================
// bandaDoScore — cortes
// ===========================================================================
console.log("── bandaDoScore ──");
eq(bandaDoScore(100), "saudavel", "score 100 → saudável");
eq(bandaDoScore(80), "saudavel", "score 80 (corte) → saudável");
eq(bandaDoScore(79), "atencao", "score 79 → atenção");
eq(bandaDoScore(50), "atencao", "score 50 (corte) → atenção");
eq(bandaDoScore(49), "critico", "score 49 → crítico");
eq(bandaDoScore(0), "critico", "score 0 → crítico");

// ===========================================================================
// calcularHealthScore — casos do brief
// ===========================================================================
console.log("── calcularHealthScore ──");

// (1) Cliente SEM nenhum problema (ambos os lados zerados) → score 100, saudável, breakdown vazio.
{
  const r = calcularHealthScore(entrada({ core: core(), ecac: ecac() }));
  eq(r.score, 100, "sem problema → score 100");
  eq(r.banda.banda, "saudavel", "sem problema → banda saudável");
  eq(r.breakdown.length, 0, "sem problema → breakdown vazio");
  eq(r.semLadoCore, false, "core presente → semLadoCore false");
  eq(r.semLadoEcac, false, "ecac presente → semLadoEcac false");
}

// (2) Cliente só com divergência do CORE (e-CAC zerado).
{
  const r = calcularHealthScore(
    entrada({ core: core({ indiciosAbertos: 2, divergenciasCclasstrib: 2 }), ecac: ecac() }),
  );
  // 2 indícios × 4 = 8 ; 2 divergências × 5 = 10 → subtrai 18 → score 82.
  eq(r.score, 82, "só core (2 indícios + 2 cClassTrib) → score 82");
  ok(
    r.breakdown.every((f) => f.lado === "core"),
    "só core → breakdown só com fatores do lado core",
  );
}

// (3) Cliente só com pendência do e-CAC (core zerado).
{
  const r = calcularHealthScore(
    entrada({ core: core(), ecac: ecac({ cndsVencidas: 1, cndsAVencer: 1 }) }),
  );
  // 1 CND vencida × 8 = 8 ; 1 a vencer × 3 = 3 → subtrai 11 → score 89.
  eq(r.score, 89, "só e-CAC (1 vencida + 1 a vencer) → score 89");
  ok(
    r.breakdown.every((f) => f.lado === "ecac"),
    "só e-CAC → breakdown só com fatores do lado ecac",
  );
}

// (4) 🔴 Cliente com OS DOIS lados → score deve ser PIOR que cada um isolado.
{
  const soCore = calcularHealthScore(
    entrada({ core: core({ indiciosAbertos: 2 }), ecac: ecac() }),
  ).score;
  const soEcac = calcularHealthScore(
    entrada({ core: core(), ecac: ecac({ cndsVencidas: 1 }) }),
  ).score;
  const ambos = calcularHealthScore(
    entrada({ core: core({ indiciosAbertos: 2 }), ecac: ecac({ cndsVencidas: 1 }) }),
  ).score;
  ok(ambos < soCore, "cross-módulo: ambos < só-core (o e-CAC piora o score)");
  ok(ambos < soEcac, "cross-módulo: ambos < só-e-CAC (o core piora o score)");
  // Aditivo: 2×4 + 1×8 = 16 → 84.
  eq(ambos, 84, "cross-módulo: subtração combinada (2 indícios + 1 CND vencida) → 84");
}

// (5) Breakdown SOMA coerente: 100 - Σ pontosSubtraidos = score (sem clamp neste caso).
{
  const r = calcularHealthScore(
    entrada({
      core: core({ indiciosAbertos: 1, divergenciasCclasstrib: 1 }),
      ecac: ecac({ cndsAVencer: 2 }),
    }),
  );
  const soma = r.breakdown.reduce((acc, f) => acc + f.pontosSubtraidos, 0);
  eq(Math.round(100 - soma), r.score, "breakdown soma coerente: 100 - Σpontos = score");
  eq(Math.round(soma), r.totalSubtraido, "totalSubtraido = soma dos pontos do breakdown");
}

// (6) Breakdown ordenado por MAIOR impacto primeiro.
{
  const r = calcularHealthScore(
    entrada({
      core: core({ indiciosAbertos: 1 }), // 1×4 = 4
      ecac: ecac({ prazosNoLimite: 1 }), // 1×16 = 16 (maior impacto)
    }),
  );
  eq(r.breakdown[0].id, "prazos_no_limite", "breakdown: maior impacto (prazo no limite) primeiro");
  ok(
    r.breakdown[0].pontosSubtraidos >= r.breakdown[1].pontosSubtraidos,
    "breakdown ordenado desc por pontosSubtraidos",
  );
}

// (7) Teto por fator respeitado (não estoura).
{
  const def = PESOS_FATOR.prazos_no_limite; // teto 40
  const r = calcularHealthScore(entrada({ ecac: ecac({ prazosNoLimite: 100 }) }));
  const fator = r.breakdown.find((f) => f.id === "prazos_no_limite");
  eq(fator.pontosSubtraidos, def.tetoPontos, "fator respeita o teto (não passa de tetoPontos)");
}

// (8) Score faz clamp em 0 (carteira muito exposta nunca fica negativa).
{
  const r = calcularHealthScore(
    entrada({
      core: core({ indiciosAbertos: 50, indiciosBaixaConfianca: 50, divergenciasCclasstrib: 50, materialidadeEmDisputa: 1_000_000 }),
      ecac: ecac({ prazosNoLimite: 50, cndsVencidas: 50, prazosUrgentes: 50, cndsAVencer: 50, mensagensCriticasNaoLidas: 50 }),
    }),
  );
  eq(r.score, 0, "exposição extrema → score clampa em 0 (nunca negativo)");
  eq(r.banda.banda, "critico", "score 0 → banda crítico");
}

// (9) Materialidade: unidade = R$5.000 (UNIDADE_MATERIALIDADE_RS), proporcional.
{
  const r = calcularHealthScore(
    entrada({ core: core({ materialidadeEmDisputa: UNIDADE_MATERIALIDADE_RS * 2 }) }),
  );
  // 2 unidades × peso 3 = 6 → score 94.
  eq(r.score, 94, "materialidade R$10k (2 unidades) × peso 3 → subtrai 6 → score 94");
}

// (10) Lado ausente sinalizado (cliente só no core → semLadoEcac true).
{
  const r = calcularHealthScore(entrada({ core: core({ indiciosAbertos: 1 }), ecac: null }));
  eq(r.semLadoEcac, true, "ecac null → semLadoEcac true");
  eq(r.semLadoCore, false, "core presente → semLadoCore false");
}

// ===========================================================================
// rankearCarteira — ordenação por risco (pior primeiro)
// ===========================================================================
console.log("── rankearCarteira ──");

// Carteira vazia → ranking vazio.
eq(rankearCarteira([]), [], "carteira vazia → []");

{
  const entradas = [
    entrada({ clienteId: "saudavel", clienteNome: "Saudável", core: core(), ecac: ecac() }),
    entrada({
      clienteId: "critico",
      clienteNome: "Crítico",
      core: core({ indiciosBaixaConfianca: 3 }),
      ecac: ecac({ prazosNoLimite: 2, cndsVencidas: 3 }),
    }),
    entrada({
      clienteId: "atencao",
      clienteNome: "Atenção",
      core: core({ indiciosAbertos: 2 }),
      ecac: ecac({ cndsAVencer: 2 }),
    }),
  ];
  const ranking = rankearCarteira(entradas).map((r) => r.clienteId);
  eq(ranking, ["critico", "atencao", "saudavel"], "ranking: pior score primeiro");
}

// Empate de banda → menor score primeiro.
{
  const entradas = [
    entrada({ clienteId: "menos-pior", clienteNome: "B", ecac: ecac({ cndsVencidas: 1 }) }), // -8 → 92
    entrada({ clienteId: "mais-pior", clienteNome: "A", ecac: ecac({ cndsVencidas: 2 }) }), // -16 → 84
  ];
  const ranking = rankearCarteira(entradas).map((r) => r.clienteId);
  eq(ranking, ["mais-pior", "menos-pior"], "empate de banda → menor score primeiro");
}

// ===========================================================================
// resumirHealth — contagens da carteira
// ===========================================================================
console.log("── resumirHealth ──");

// Carteira vazia → resumo zerado, scoreMedio null.
{
  const r = resumirHealth([]);
  eq(r.total, 0, "resumo vazio: total 0");
  eq(r.scoreMedio, null, "resumo vazio: scoreMedio null");
}

{
  const entradas = [
    entrada({ clienteId: "s", core: core(), ecac: ecac() }), // 100 saudável
    entrada({ clienteId: "a", ecac: ecac({ cndsVencidas: 3 }) }), // -24 → 76 atenção
    entrada({ clienteId: "c", core: core({ indiciosBaixaConfianca: 4 }), ecac: ecac({ prazosNoLimite: 3 }) }), // -28 -40(teto) → 32 crítico
    entrada({ clienteId: "x", core: core({ indiciosAbertos: 1 }), ecac: null }), // -4 → 96 saudável, semLadoEcac
  ];
  const scores = entradas.map(calcularHealthScore);
  const r = resumirHealth(scores);
  eq(r.total, 4, "resumo: total 4");
  eq(r.saudaveis, 2, "resumo: 2 saudáveis (100 + 96)");
  eq(r.atencao, 1, "resumo: 1 atenção (76)");
  eq(r.criticos, 1, "resumo: 1 crítico (32)");
  eq(r.semLadoEcac, 1, "resumo: 1 sem lado e-CAC reconciliado");
  ok(r.scoreMedio !== null && r.scoreMedio >= 0 && r.scoreMedio <= 100, "resumo: scoreMedio em [0,100]");
}

// ===========================================================================
// Determinismo — mesma entrada, mesma saída (sem relógio)
// ===========================================================================
console.log("── determinismo ──");
{
  const e = entrada({ core: core({ indiciosAbertos: 3 }), ecac: ecac({ cndsVencidas: 1 }) });
  const a = JSON.stringify(calcularHealthScore(e));
  const b = JSON.stringify(calcularHealthScore(e));
  eq(a, b, "calcularHealthScore é determinístico (sem Date.now)");
}

// ---------------------------------------------------------------------------
// Resultado
// ---------------------------------------------------------------------------
console.log("");
if (falhas > 0) {
  console.error(`✗ health-score-model: ${falhas}/${total} asserção(ões) FALHARAM.`);
  process.exit(1);
}
console.log(`✓ health-score-model: ${total}/${total} asserções OK (S12 score cross-módulo).`);
process.exit(0);
