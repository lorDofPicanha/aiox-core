/**
 * Testes do engine PURO do Radar de Transação Tributária (PAR-7).
 *
 * Runner sem framework (espelha app/saude-carteira/health-score-model.test.mjs): importa o
 * model .ts DIRETO — Node ≥ 24 faz type-stripping nativo, sem tsx/ts-node. As funções são
 * puras e determinísticas ("hoje" por parâmetro), então cada caso monta um perfil e checa
 * nível/porte/gancho/breakdown.
 *
 * Rodar:  node app/transacao/transacao-model.test.mjs   (a partir de apps/contador)
 * Exit 0 = tudo verde · Exit 1 = ao menos uma asserção falhou.
 *
 * G6: o teste descreve INDÍCIOS de elegibilidade e ganchos de honorário; não afirma desfecho
 * fiscal, desconto concedido nem aprovação.
 */
import {
  FAIXA_VALOR_DA,
  IDADE_DA_CONSOLIDADA_DIAS,
  IDADE_DA_MINIMA_DIAS,
  classificarCarteiraTransacao,
  classificarElegibilidade,
  ehOportunidade,
  porteDaDivida,
  resumirTransacao,
} from "./transacao-model.ts";

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

// Data de referência fixa — determinismo total.
const HOJE = "2026-06-25T12:00:00.000Z";

/** Subtrai dias de HOJE (helper de teste, ISO). */
function diasAtras(n) {
  const d = new Date(HOJE);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString();
}

/** Monta um perfil fiscal com defaults sensatos (sobrescreve o que o caso precisa). */
function perfil(over = {}) {
  return {
    clienteId: "cli-teste-x",
    clienteNome: "Cliente Teste",
    segmento: "Teste",
    regime: "presumido",
    inscritoDividaAtiva: true,
    valorDividaAtiva: 200_000,
    inscricaoMaisAntigaIso: diasAtras(IDADE_DA_CONSOLIDADA_DIAS + 60),
    situacaoParcelamento: "sem_parcelamento",
    capacidadePagamento: "moderada",
    ...over,
  };
}

// ===========================================================================
// 1. Cliente SEM dívida ativa → NÃO ELEGÍVEL
// ===========================================================================
{
  const r = classificarElegibilidade(
    perfil({ inscritoDividaAtiva: false, valorDividaAtiva: 0, inscricaoMaisAntigaIso: null }),
    HOJE,
  );
  eq(r.nivel.nivel, "nao_elegivel", "sem DA → nao_elegivel");
  eq(r.gancho.estimavel, false, "sem DA → gancho não estimável");
  eq(r.porte, null, "sem DA → sem porte");
  eq(r.descontoPermitidoEmTese, null, "sem DA → sem desconto em tese");
  ok(r.caveats.length >= 3, "sem DA → caveats presentes");
}

// ===========================================================================
// 2. Dívida abaixo do piso de materialidade → NÃO ELEGÍVEL
// ===========================================================================
{
  const r = classificarElegibilidade(
    perfil({ valorDividaAtiva: FAIXA_VALOR_DA.pisoMaterialidade - 1 }),
    HOJE,
  );
  eq(r.nivel.nivel, "nao_elegivel", "DA abaixo do piso → nao_elegivel");
  eq(r.gancho.estimavel, false, "DA abaixo do piso → sem gancho");
  ok(
    r.breakdown.some((f) => f.efeito === "bloqueia"),
    "DA abaixo do piso → breakdown marca bloqueio",
  );
}

// ===========================================================================
// 3. Dívida ativa PEQUENA vs GRANDE → faixa de honorário escala (pequena < grande)
// ===========================================================================
{
  const pequena = classificarElegibilidade(perfil({ valorDividaAtiva: 40_000 }), HOJE);
  const grande = classificarElegibilidade(perfil({ valorDividaAtiva: 3_000_000 }), HOJE);
  ok(pequena.gancho.estimavel, "DA pequena → gancho estimável");
  ok(grande.gancho.estimavel, "DA grande → gancho estimável");
  eq(porteDaDivida(40_000), "pequeno", "porte de 40k = pequeno");
  eq(porteDaDivida(3_000_000), "grande", "porte de 3M = grande");
  ok(
    grande.gancho.meio > pequena.gancho.meio,
    "gancho de honorário da DA grande > da DA pequena (em R$)",
  );
  // Faixa coerente: min ≤ meio ≤ max e min < max.
  ok(pequena.gancho.min < pequena.gancho.max, "faixa pequena: min < max");
  ok(
    pequena.gancho.min <= pequena.gancho.meio && pequena.gancho.meio <= pequena.gancho.max,
    "faixa pequena: min ≤ meio ≤ max",
  );
}

// ===========================================================================
// 4. Dívida muito ANTIGA (consolidada) vs RECENTE → maturidade muda o nível/ressalva
// ===========================================================================
{
  // Antiga/consolidada, sem outras ressalvas → FORTE.
  const antiga = classificarElegibilidade(
    perfil({ inscricaoMaisAntigaIso: diasAtras(IDADE_DA_CONSOLIDADA_DIAS + 100) }),
    HOJE,
  );
  eq(antiga.nivel.nivel, "forte", "DA consolidada sem ressalva → forte");
  ok(
    antiga.breakdown.some((f) => f.rotulo === "Idade da inscrição" && f.efeito === "favorece"),
    "DA consolidada → idade favorece no breakdown",
  );

  // Recente (≥ mínima, < consolidada) → rebaixa para CONDICIONAL (maturidade parcial).
  const recente = classificarElegibilidade(
    perfil({ inscricaoMaisAntigaIso: diasAtras(IDADE_DA_MINIMA_DIAS + 30) }),
    HOJE,
  );
  eq(recente.nivel.nivel, "condicional", "DA recente (não consolidada) → condicional");

  // Muito recente (< mínima) → REQUER ANÁLISE (pode ser outra via).
  const muitoRecente = classificarElegibilidade(
    perfil({ inscricaoMaisAntigaIso: diasAtras(IDADE_DA_MINIMA_DIAS - 10) }),
    HOJE,
  );
  eq(muitoRecente.nivel.nivel, "requer_analise", "DA muito recente (< mínima) → requer_analise");
  eq(muitoRecente.gancho.estimavel, false, "requer_analise → sem gancho estimável");

  // QA H1: DA relevante SEM data de inscrição (adapter pode devolver assim) → requer_analise,
  // NUNCA "forte" (sem sinal de maturidade não se promove). Mesmo com CAPAG conhecida.
  const semData = classificarElegibilidade(
    perfil({ inscricaoMaisAntigaIso: null }),
    HOJE,
  );
  eq(semData.nivel.nivel, "requer_analise", "H1: DA relevante sem data de inscrição → requer_analise");
  eq(semData.gancho.estimavel, false, "H1: sem data → gancho não estimável (não promove a forte)");
}

// ===========================================================================
// 5. Parcelamento ATIVO vs INADIMPLENTE → ativo rebaixa, inadimplente favorece
// ===========================================================================
{
  const ativo = classificarElegibilidade(perfil({ situacaoParcelamento: "parcelamento_ativo" }), HOJE);
  eq(ativo.nivel.nivel, "condicional", "parcelamento ativo → condicional (ressalva)");
  ok(
    ativo.breakdown.some((f) => f.rotulo === "Parcelamento" && f.efeito === "ressalva"),
    "parcelamento ativo → ressalva no breakdown",
  );

  const inadimplente = classificarElegibilidade(
    perfil({ situacaoParcelamento: "parcelamento_inadimplente" }),
    HOJE,
  );
  eq(inadimplente.nivel.nivel, "forte", "parcelamento inadimplente → mantém forte");
  ok(
    inadimplente.breakdown.some((f) => f.rotulo === "Parcelamento" && f.efeito === "favorece"),
    "parcelamento inadimplente → favorece no breakdown",
  );
}

// ===========================================================================
// 6. CAPAG restrita → condicional · CAPAG desconhecida → requer análise
// ===========================================================================
{
  const restrita = classificarElegibilidade(perfil({ capacidadePagamento: "restrita" }), HOJE);
  eq(restrita.nivel.nivel, "condicional", "CAPAG restrita → condicional");

  const desconhecida = classificarElegibilidade(
    perfil({ capacidadePagamento: "desconhecida" }),
    HOJE,
  );
  eq(desconhecida.nivel.nivel, "requer_analise", "CAPAG desconhecida → requer_analise");
  eq(desconhecida.gancho.estimavel, false, "CAPAG desconhecida → sem gancho");
}

// ===========================================================================
// 7. RANKING por gancho de honorário (maior primeiro) + resumo coerente
// ===========================================================================
{
  const carteira = [
    perfil({ clienteId: "cli-pequeno", valorDividaAtiva: 40_000 }),
    perfil({ clienteId: "cli-grande", valorDividaAtiva: 3_000_000 }),
    perfil({ clienteId: "cli-medio", valorDividaAtiva: 500_000 }),
    perfil({ clienteId: "cli-nao", inscritoDividaAtiva: false, valorDividaAtiva: 0, inscricaoMaisAntigaIso: null }),
  ];
  const ops = classificarCarteiraTransacao(carteira, HOJE);
  eq(ops[0].perfil.clienteId, "cli-grande", "ranking: maior gancho (DA grande) primeiro");
  ok(
    ops[0].gancho.meio >= ops[1].gancho.meio,
    "ranking: gancho do 1º ≥ gancho do 2º",
  );
  eq(
    ops[ops.length - 1].perfil.clienteId,
    "cli-nao",
    "ranking: não-elegível (sem gancho) por último",
  );

  const resumo = resumirTransacao(ops);
  eq(resumo.total, 4, "resumo: total = 4");
  eq(resumo.naoElegiveis, 1, "resumo: 1 não-elegível");
  // ganchoPotencialTotal = soma dos meios dos 3 elegíveis.
  const somaMeios = ops.filter((o) => o.gancho.estimavel).reduce((s, o) => s + o.gancho.meio, 0);
  eq(resumo.ganchoPotencialTotal, somaMeios, "resumo: gancho total = soma dos meios dos elegíveis");
  eq(
    resumo.fortes + resumo.condicionais + resumo.requerAnalise + resumo.naoElegiveis,
    resumo.total,
    "resumo: contagens somam o total",
  );
}

// ===========================================================================
// 8. BREAKDOWN coerente: sempre tem o fator "Dívida ativa (PGFN)" quando há DA
// ===========================================================================
{
  const r = classificarElegibilidade(perfil({ valorDividaAtiva: 200_000 }), HOJE);
  ok(
    r.breakdown.some((f) => f.rotulo === "Dívida ativa (PGFN)"),
    "breakdown: contém fator Dívida ativa",
  );
  ok(r.breakdown.length >= 3, "breakdown: pelo menos 3 fatores num caso elegível");
  ok(
    r.breakdown.every((f) => typeof f.nota === "string" && f.nota.length > 0),
    "breakdown: todo fator tem nota explicável",
  );
  ok(ehOportunidade(r.nivel.nivel), "forte conta como oportunidade");
}

// ===========================================================================
// 9. Carteira VAZIA → resumo zerado, sem erro
// ===========================================================================
{
  const ops = classificarCarteiraTransacao([], HOJE);
  eq(ops.length, 0, "carteira vazia → zero oportunidades");
  const resumo = resumirTransacao(ops);
  eq(resumo.total, 0, "carteira vazia → resumo total 0");
  eq(resumo.ganchoPotencialTotal, 0, "carteira vazia → gancho total 0");
}

// ===========================================================================
// 10. DETERMINISMO: mesmo perfil + mesma refIso → resultado idêntico
// ===========================================================================
{
  const p = perfil({ valorDividaAtiva: 750_000 });
  const a = classificarElegibilidade(p, HOJE);
  const b = classificarElegibilidade(p, HOJE);
  eq(JSON.stringify(a), JSON.stringify(b), "determinismo: duas chamadas iguais → mesmo resultado");

  // "Hoje" por parâmetro: avançar a refIso envelhece a dívida (idade muda), comprovando que
  // não há Date.now() embutido — a idade é função pura de (inscricao, refIso).
  const futuro = "2027-06-25T12:00:00.000Z";
  const aFut = classificarElegibilidade(p, futuro);
  ok(
    aFut.idadeDividaDias > a.idadeDividaDias,
    "hoje por parâmetro: refIso futura → idade da dívida maior (sem Date.now embutido)",
  );
}

// ---------------------------------------------------------------------------
// Resultado
// ---------------------------------------------------------------------------
if (falhas > 0) {
  console.error(`\n✗ transacao-model: ${falhas}/${total} asserção(ões) FALHARAM.`);
  process.exit(1);
}
console.log(`✓ transacao-model: ${total} asserções verdes (PAR-7 — radar de transação).`);
process.exit(0);
