/**
 * S6 — Testes do engine PURO de DÍVIDA ATIVA (alertaExclusao + agregação por cliente).
 *
 * Runner sem framework (espelha saude-fiscal-model.test.mjs): importa o model .ts DIRETO —
 * Node ≥ 24 faz type-stripping nativo. As funções são puras e recebem o "hoje" por parâmetro.
 *
 * Rodar:  node app/ecac/divida-ativa-model.test.mjs   (a partir de apps/contador)
 * Exit 0 = tudo verde · Exit 1 = ao menos uma asserção falhou.
 *
 * G6: descreve INDÍCIOS e níveis de alerta; não afirma desfecho fiscal.
 */
import {
  agregarDividasPorCliente,
  alertaExclusao,
  analisarDividasAtivas,
  filtrarComAlertaExclusao,
  JANELA_EXCLUSAO_AVISO_DIAS,
  JANELA_EXCLUSAO_CRITICA_DIAS,
  resumirDividaAtiva,
} from "./divida-ativa-model.ts";

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

const HOJE = "2026-07-09T12:00:00.000Z";

function maisDias(n) {
  const d = new Date(HOJE);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString();
}

/** Constrói uma DividaAtivaBruta com defaults sãos; `prazoExclusaoDias` controla o countdown. */
function divida(over = {}) {
  const {
    prazoExclusaoDias,
    inadimplente = true,
    parcelamento = true,
    ...rest
  } = over;
  return {
    id: "da",
    clienteId: "c1",
    clienteNome: "Cliente 1",
    documento: "11222333000181",
    inscricao: "70.6.26.000000-00",
    natureza: "uniao",
    situacao: "parcelada",
    valorConsolidado: 1000,
    dataInscricaoIso: maisDias(-300),
    parcelamentoVinculado: parcelamento
      ? {
          numero: "SISPAR-0001",
          programa: "Negociação PGFN (SISPAR)",
          inadimplente,
          prazoExclusaoIso: prazoExclusaoDias == null ? null : maisDias(prazoExclusaoDias),
        }
      : null,
    ...rest,
  };
}

// ===========================================================================
// S6 — alertaExclusao: cortes de prazo (6, 7, 8, 74, 75, 76 dias)
// ===========================================================================
console.log("── S6 · alertaExclusao (cortes de prazo) ──");

eq(JANELA_EXCLUSAO_CRITICA_DIAS, 7, "corte crítico = 7 dias");
eq(JANELA_EXCLUSAO_AVISO_DIAS, 75, "corte aviso = 75 dias");

eq(alertaExclusao(divida({ prazoExclusaoDias: 6 }), HOJE).nivel, "critico", "6 dias → crítico");
eq(alertaExclusao(divida({ prazoExclusaoDias: 7 }), HOJE).nivel, "critico", "7 dias (limite) → crítico");
eq(alertaExclusao(divida({ prazoExclusaoDias: 8 }), HOJE).nivel, "aviso", "8 dias → aviso");
eq(alertaExclusao(divida({ prazoExclusaoDias: 74 }), HOJE).nivel, "aviso", "74 dias → aviso");
eq(alertaExclusao(divida({ prazoExclusaoDias: 75 }), HOJE).nivel, "aviso", "75 dias (limite) → aviso");
eq(alertaExclusao(divida({ prazoExclusaoDias: 76 }), HOJE).nivel, "monitorado", "76 dias → monitorado (>75)");

// diasAteExclusao devolvido corretamente.
eq(alertaExclusao(divida({ prazoExclusaoDias: 6 }), HOJE).diasAteExclusao, 6, "diasAteExclusao = 6");

// Prazo já vencido → excluido (banda visível).
eq(alertaExclusao(divida({ prazoExclusaoDias: -1 }), HOJE).nivel, "excluido", "prazo vencido → excluido");
ok(alertaExclusao(divida({ prazoExclusaoDias: -3 }), HOJE).diasAteExclusao < 0, "excluido → dias negativos");

// Prazo hoje (0 dias) → crítico (≤7).
eq(alertaExclusao(divida({ prazoExclusaoDias: 0 }), HOJE).nivel, "critico", "0 dias (hoje) → crítico");

// ===========================================================================
// S6 — casos sem parcelamento / em dia / ilegível
// ===========================================================================
console.log("── S6 · sem parcelamento / em dia / ilegível ──");

// Sem parcelamento vinculado → sem_parcelamento (nada a monitorar).
{
  const r = alertaExclusao(divida({ parcelamento: false }), HOJE);
  eq(r.nivel, "sem_parcelamento", "sem parcelamento → sem_parcelamento");
  eq(r.diasAteExclusao, null, "sem parcelamento → diasAteExclusao null");
}

// Parcelamento em dia (sem prazo de exclusão) → monitorado.
{
  const r = alertaExclusao(divida({ prazoExclusaoDias: null, inadimplente: false }), HOJE);
  eq(r.nivel, "monitorado", "parcelamento em dia (sem countdown) → monitorado");
  eq(r.diasAteExclusao, null, "monitorado → diasAteExclusao null");
}

// Prazo de exclusão ILEGÍVEL → excluido (fail-safe, nunca some).
{
  const d = divida({ prazoExclusaoDias: 5 });
  d.parcelamentoVinculado.prazoExclusaoIso = "data-quebrada";
  const r = alertaExclusao(d, HOJE);
  eq(r.nivel, "excluido", "prazo ilegível → excluido (fail-safe)");
  eq(r.diasAteExclusao, null, "prazo ilegível → diasAteExclusao null");
}

// ===========================================================================
// S6 — analisarDividasAtivas: ordenação + filtro
// ===========================================================================
console.log("── S6 · analisarDividasAtivas ──");

eq(analisarDividasAtivas([], HOJE), [], "lista vazia → []");

{
  const entrada = [
    divida({ id: "monit", clienteNome: "D", prazoExclusaoDias: null, inadimplente: false }),
    divida({ id: "aviso", clienteNome: "C", prazoExclusaoDias: 40 }),
    divida({ id: "sem", clienteNome: "E", parcelamento: false }),
    divida({ id: "critico", clienteNome: "B", prazoExclusaoDias: 3 }),
    divida({ id: "excluido", clienteNome: "A", prazoExclusaoDias: -2 }),
  ];
  const ordem = analisarDividasAtivas(entrada, HOJE).map((i) => i.divida.id);
  eq(
    ordem,
    ["excluido", "critico", "aviso", "monit", "sem"],
    "ordenação: excluído > crítico > aviso > monitorado > sem_parcelamento",
  );
  const comAlerta = filtrarComAlertaExclusao(analisarDividasAtivas(entrada, HOJE)).map((i) => i.divida.id);
  eq(comAlerta, ["excluido", "critico", "aviso"], "filtro: só excluído/crítico/aviso");
}

// ===========================================================================
// S6 — agregarDividasPorCliente + resumo
// ===========================================================================
console.log("── S6 · agregação por cliente ──");

{
  const entrada = [
    divida({ id: "c1-a", clienteId: "c1", clienteNome: "Alfa", valorConsolidado: 1000, prazoExclusaoDias: 3 }),
    divida({ id: "c1-b", clienteId: "c1", clienteNome: "Alfa", valorConsolidado: 500, natureza: "fgts", prazoExclusaoDias: 40 }),
    divida({ id: "c2-a", clienteId: "c2", clienteNome: "Beta", valorConsolidado: 2000, prazoExclusaoDias: null, inadimplente: false }),
  ];
  const agg = agregarDividasPorCliente(entrada, HOJE);
  eq(agg.length, 2, "agregação: 2 clientes");

  const alfa = agg.find((a) => a.clienteId === "c1");
  eq(alfa.inscricoes, 2, "Alfa: 2 inscrições");
  eq(alfa.valorConsolidadoTotal, 1500, "Alfa: valor consolidado somado");
  eq(alfa.criticas, 1, "Alfa: 1 crítica");
  eq(alfa.avisos, 1, "Alfa: 1 aviso");
  eq(alfa.naturezas.sort(), ["fgts", "uniao"], "Alfa: naturezas distintas (uniao + fgts)");
  eq(alfa.piorAlerta.nivel, "critico", "Alfa: pior alerta = crítico");

  // Ordenação: Alfa (crítico) antes de Beta (monitorado).
  eq(agg[0].clienteId, "c1", "agregação ordenada: pior alerta primeiro");

  const r = resumirDividaAtiva(entrada, HOJE);
  eq(r.inscricoes, 3, "resumo: 3 inscrições");
  eq(r.valorConsolidadoTotal, 3500, "resumo: valor total 3500");
  eq(r.criticas, 1, "resumo: 1 crítica");
  eq(r.avisos, 1, "resumo: 1 aviso");
  eq(r.clientesAfetados, 2, "resumo: 2 clientes afetados");
}

// FGTS é natureza possível (migração Caixa→PGFN 01/06/2026).
{
  const [item] = analisarDividasAtivas([divida({ natureza: "fgts", prazoExclusaoDias: 40 })], HOJE);
  ok(item.naturezaRotulo.toLowerCase().includes("fgts"), "natureza fgts reconhecida (rótulo FGTS)");
  ok(item.naturezaOrgao.includes("01/06/2026"), "natureza fgts cita a data da migração p/ PGFN");
}

// ---------------------------------------------------------------------------
// Resultado
// ---------------------------------------------------------------------------
console.log("");
if (falhas > 0) {
  console.error(`✗ divida-ativa-model: ${falhas}/${total} asserção(ões) FALHARAM.`);
  process.exit(1);
}
console.log(`✓ divida-ativa-model: ${total}/${total} asserções OK (S6 alerta de exclusão + agregação).`);
process.exit(0);
