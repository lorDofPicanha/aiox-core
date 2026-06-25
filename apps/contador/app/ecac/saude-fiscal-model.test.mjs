/**
 * Testes dos engines PUROS de saúde fiscal (S3 triarMensagens + S5 detectarCndsAVencer).
 *
 * Runner sem framework (espelha os scripts run-*.mjs dos packages do projeto): importa o
 * model .ts DIRETO — Node ≥ 24 faz type-stripping nativo, sem tsx/ts-node. As funções são
 * puras e recebem o "hoje" por parâmetro, então cada caso fixa uma data e checa a saída.
 *
 * Rodar:  node app/ecac/saude-fiscal-model.test.mjs   (a partir de apps/contador)
 * Exit 0 = tudo verde · Exit 1 = ao menos uma asserção falhou.
 *
 * G6: este arquivo de teste descreve INDÍCIOS e níveis de triagem; não afirma desfecho
 * fiscal nem usa vocabulário proibido como promessa.
 */
import {
  detectarCndsAVencer,
  gerarSugestoesTrilha,
  montarSugestaoRenovacao,
  prioridadeRenovacao,
  resumirRenovacao,
  resumirTriagem,
  situacaoPrazo,
  triarMensagens,
} from "./saude-fiscal-model.ts";

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

// "Hoje" fixo de referência para todos os casos (determinístico).
const HOJE = "2026-06-25T12:00:00.000Z";

/** Soma dias ao HOJE e devolve ISO (para construir prazos/validades relativos no teste). */
function maisDias(n) {
  const d = new Date(HOJE);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString();
}

/** Constrói uma mensagem bruta com defaults sãos (sobrescreve o que o caso precisa). */
function msg(over) {
  return {
    id: "m",
    clienteId: "c1",
    clienteNome: "Cliente 1",
    assunto: "Assunto",
    remetente: "Receita Federal do Brasil",
    recebidaEmIso: maisDias(-3),
    lida: false,
    marcaReceita: false,
    intimacao: false,
    prazoLimiteIso: null,
    ...over,
  };
}

/** Constrói uma CND bruta com defaults sãos. */
function cnd(over) {
  return {
    id: "cnd",
    clienteId: "c1",
    clienteNome: "Cliente 1",
    documento: "11222333000181",
    esfera: "federal",
    situacao: "regular",
    validadeIso: maisDias(90),
    ...over,
  };
}

// ===========================================================================
// S3 — situacaoPrazo (cálculo de janela de prazo)
// ===========================================================================
console.log("── S3 · situacaoPrazo ──");

eq(situacaoPrazo(null, HOJE), "sem_prazo", "prazo null → sem_prazo");
eq(situacaoPrazo(maisDias(-1), HOJE), "expirado", "prazo no passado → expirado");
eq(situacaoPrazo(HOJE, HOJE), "no_limite", "prazo = hoje → no_limite (vence hoje)");
eq(situacaoPrazo(maisDias(5), HOJE), "urgente", "prazo em 5 dias → urgente (≤7)");
eq(situacaoPrazo(maisDias(7), HOJE), "urgente", "prazo em 7 dias → urgente (limite da janela)");
eq(situacaoPrazo(maisDias(8), HOJE), "folgado", "prazo em 8 dias → folgado (>7)");
eq(situacaoPrazo(maisDias(30), HOJE), "folgado", "prazo em 30 dias → folgado");

// ===========================================================================
// S3 — triarMensagens (níveis + ordenação + bordas)
// ===========================================================================
console.log("── S3 · triarMensagens ──");

// Lista vazia → saída vazia.
eq(triarMensagens([], HOJE), [], "lista vazia → []");

// Intimação (mesmo com prazo folgado) é sempre CRÍTICA.
{
  const t = triarMensagens([msg({ id: "i", intimacao: true, prazoLimiteIso: maisDias(20) })], HOJE);
  eq(t[0].nivel.nivel, "critico", "intimação (prazo folgado) → crítico");
  eq(t[0].situacaoPrazo.situacao, "folgado", "intimação com prazo folgado → situacaoPrazo folgado");
  eq(t[0].diasRestantes, 20, "diasRestantes calculado a partir do hoje");
}

// Intimação com prazo EXPIRADO segue crítica, com prazo expirado.
{
  const t = triarMensagens([msg({ id: "x", intimacao: true, prazoLimiteIso: maisDias(-2) })], HOJE);
  eq(t[0].nivel.nivel, "critico", "intimação com prazo expirado → crítico");
  eq(t[0].situacaoPrazo.situacao, "expirado", "intimação com prazo no passado → expirado");
  ok(t[0].diasRestantes < 0, "intimação expirada → diasRestantes negativo");
}

// Intimação NO LIMITE (vence hoje).
{
  const t = triarMensagens([msg({ id: "l", intimacao: true, prazoLimiteIso: HOJE })], HOJE);
  eq(t[0].situacaoPrazo.situacao, "no_limite", "intimação vencendo hoje → no_limite");
  eq(t[0].diasRestantes, 0, "intimação no limite → 0 dias restantes");
}

// Marca "!" da Receita SEM ser intimação → atenção (não crítico).
{
  const t = triarMensagens([msg({ id: "a", marcaReceita: true, intimacao: false })], HOJE);
  eq(t[0].nivel.nivel, "atencao", "marca '!' Receita sem intimação → atenção");
}

// Recibo comum (sem marca, sem intimação) → informativo.
{
  const t = triarMensagens(
    [msg({ id: "r", marcaReceita: false, intimacao: false, assunto: "Recibo de entrega" })],
    HOJE,
  );
  eq(t[0].nivel.nivel, "informativo", "recibo comum → informativo");
}

// Ordenação: crítico antes de atenção antes de informativo; dentro do crítico, prazo mais
// apertado primeiro (expirado < urgente < folgado).
{
  const entrada = [
    msg({ id: "info", marcaReceita: false, intimacao: false }),
    msg({ id: "crit-folgado", intimacao: true, prazoLimiteIso: maisDias(20) }),
    msg({ id: "aten", marcaReceita: true, intimacao: false }),
    msg({ id: "crit-expirado", intimacao: true, prazoLimiteIso: maisDias(-5) }),
    msg({ id: "crit-urgente", intimacao: true, prazoLimiteIso: maisDias(3) }),
  ];
  const ordem = triarMensagens(entrada, HOJE).map((m) => m.id);
  eq(
    ordem,
    ["crit-expirado", "crit-urgente", "crit-folgado", "aten", "info"],
    "ordenação: crítico(prazo apertado→folgado) > atenção > informativo",
  );
}

// resumirTriagem conta os níveis e os prazos no limite (expirado + vence hoje).
{
  const entrada = [
    msg({ id: "c-exp", intimacao: true, prazoLimiteIso: maisDias(-1) }),
    msg({ id: "c-hoje", intimacao: true, prazoLimiteIso: HOJE }),
    msg({ id: "c-fut", intimacao: true, prazoLimiteIso: maisDias(10) }),
    msg({ id: "a", marcaReceita: true }),
    msg({ id: "i" }),
  ];
  const r = resumirTriagem(triarMensagens(entrada, HOJE));
  eq(r.criticas, 3, "resumo: 3 críticas");
  eq(r.atencao, 1, "resumo: 1 atenção");
  eq(r.informativas, 1, "resumo: 1 informativa");
  eq(r.prazosNoLimite, 2, "resumo: 2 prazos no limite (expirado + vence hoje)");
}

// ===========================================================================
// S5 — prioridadeRenovacao (bordas de validade)
// ===========================================================================
console.log("── S5 · prioridadeRenovacao ──");

eq(
  prioridadeRenovacao(cnd({ validadeIso: maisDias(-5) }), HOJE).prioridade,
  "vencida",
  "validade no passado → vencida",
);
eq(
  prioridadeRenovacao(cnd({ validadeIso: HOJE }), HOJE).prioridade,
  "vence_em_breve",
  "validade = hoje (0 dias) → vence_em_breve",
);
eq(
  prioridadeRenovacao(cnd({ validadeIso: maisDias(30) }), HOJE).prioridade,
  "vence_em_breve",
  "validade em 30 dias (limite da janela) → vence_em_breve",
);
eq(
  prioridadeRenovacao(cnd({ validadeIso: maisDias(31) }), HOJE).prioridade,
  "vigente",
  "validade em 31 dias (>janela) → vigente",
);
// Sem validade + situação não-regular → vencida (indício de pendência sem certidão vigente).
eq(
  prioridadeRenovacao(cnd({ validadeIso: null, situacao: "pendente" }), HOJE).prioridade,
  "vencida",
  "sem validade + pendente → vencida",
);
// Sem validade + regular → vigente (nada a renovar).
eq(
  prioridadeRenovacao(cnd({ validadeIso: null, situacao: "regular" }), HOJE).prioridade,
  "vigente",
  "sem validade + regular → vigente",
);

// Janela customizada respeitada.
eq(
  prioridadeRenovacao(cnd({ validadeIso: maisDias(40) }), HOJE, 60).prioridade,
  "vence_em_breve",
  "janela custom 60d: validade em 40d → vence_em_breve",
);

// ===========================================================================
// S5 — detectarCndsAVencer (fila priorizada + filtro de vigentes)
// ===========================================================================
console.log("── S5 · detectarCndsAVencer ──");

// Lista vazia → fila vazia.
eq(detectarCndsAVencer([], HOJE), [], "lista vazia → []");

// Vigentes NÃO entram na fila.
{
  const fila = detectarCndsAVencer([cnd({ id: "vig", validadeIso: maisDias(120) })], HOJE);
  eq(fila.length, 0, "CND vigente não entra na fila");
}

// Ordenação: vencidas primeiro (mais vencida antes), depois a vencer (vence mais cedo antes).
{
  const entrada = [
    cnd({ id: "venc-em-breve-10", clienteNome: "B", validadeIso: maisDias(10) }),
    cnd({ id: "vencida-recente", clienteNome: "C", validadeIso: maisDias(-2) }),
    cnd({ id: "venc-em-breve-3", clienteNome: "A", validadeIso: maisDias(3) }),
    cnd({ id: "vencida-antiga", clienteNome: "D", validadeIso: maisDias(-30) }),
    cnd({ id: "vigente", validadeIso: maisDias(200) }),
  ];
  const ordem = detectarCndsAVencer(entrada, HOJE).map((i) => i.cnd.id);
  eq(
    ordem,
    ["vencida-antiga", "vencida-recente", "venc-em-breve-3", "venc-em-breve-10"],
    "fila: vencidas(mais antiga→recente) antes de a-vencer(cedo→tarde); vigente fora",
  );
}

// resumirRenovacao agrega contagens e clientes distintos.
{
  const entrada = [
    cnd({ id: "x1", clienteId: "c1", validadeIso: maisDias(-1) }),
    cnd({ id: "x2", clienteId: "c1", validadeIso: maisDias(5) }),
    cnd({ id: "x3", clienteId: "c2", validadeIso: maisDias(-10) }),
    cnd({ id: "x4", clienteId: "c3", validadeIso: maisDias(300) }), // vigente (fora da fila)
  ];
  const r = resumirRenovacao(detectarCndsAVencer(entrada, HOJE));
  eq(r.naFila, 3, "resumo renovação: 3 na fila");
  eq(r.vencidas, 2, "resumo renovação: 2 vencidas");
  eq(r.aVencer, 1, "resumo renovação: 1 a vencer");
  eq(r.clientesAfetados, 2, "resumo renovação: 2 clientes afetados (c1, c2)");
}

// ===========================================================================
// S5 — trilha (evento de SUGESTÃO, não execução)
// ===========================================================================
console.log("── S5 · trilha (sugestão) ──");

// Item da fila → evento de sugestão com tipo correto e ator = motor.
{
  const fila = detectarCndsAVencer([cnd({ id: "cnd-fed", validadeIso: maisDias(-3) })], HOJE);
  const ev = montarSugestaoRenovacao(fila[0], HOJE);
  ok(ev !== null, "item da fila → evento não-nulo");
  eq(ev.tipo, "renovacao_cnd_sugerida", "tipo do evento = renovacao_cnd_sugerida (SUGERIDA)");
  eq(ev.atorTipo, "motor", "ator do evento = motor (detecção; humano confirma)");
  eq(ev.referenteTipo, "cnd", "referente do evento = cnd");
  eq(ev.referenteId, "cnd-fed", "referenteId = id da CND");
  eq(ev.prioridade, "vencida", "prioridade da sugestão preserva a banda (vencida)");
  ok(ev.descricao.toLowerCase().includes("sugerida"), "descrição usa 'sugerida' (G6)");
}

// gerarSugestoesTrilha: um evento por item da fila (vigentes já excluídos).
{
  const entrada = [
    cnd({ id: "a", validadeIso: maisDias(-1) }),
    cnd({ id: "b", validadeIso: maisDias(10) }),
    cnd({ id: "vig", validadeIso: maisDias(120) }),
  ];
  const fila = detectarCndsAVencer(entrada, HOJE);
  const eventos = gerarSugestoesTrilha(fila, HOJE);
  eq(eventos.length, 2, "gerarSugestoesTrilha: 1 evento por item da fila (vigente fora)");
  ok(
    eventos.every((e) => e.tipo === "renovacao_cnd_sugerida" && e.refIso === HOJE),
    "todos os eventos: tipo sugestão + refIso determinístico",
  );
}

// ===========================================================================
// 🟡 QA fixes — fronteira de data (dia-calendário BRT) + guarda NaN
// ===========================================================================
console.log("── QA · fronteira de data + NaN ──");

// 🟡-1: prazo em -03:00 (meia-noite BRT) deve ser dia-calendário, não delta-de-hora.
// hoje 25/06 09:00 BRT; prazo 26/06 00:00 BRT (=26T03:00Z) → vence AMANHÃ = urgente.
eq(situacaoPrazo("2026-06-26T00:00:00-03:00", HOJE), "urgente", "🟡-1 prazo -03:00 amanhã → urgente (não no_limite)");

// 🟡-1: a hora-do-dia do "hoje" NÃO pode mudar a classe (off-by-one). Dois refs no
// mesmo dia-calendário BRT, mesmo prazo → mesma classificação.
{
  const refCedo = "2026-06-25T03:00:00.000Z"; // 25/06 00:00 BRT
  const refTarde = "2026-06-25T23:00:00.000Z"; // 25/06 20:00 BRT (mesmo dia BRT)
  const prazo = "2026-06-26T12:00:00.000Z"; // 26/06 09:00 BRT
  eq(
    situacaoPrazo(prazo, refCedo),
    situacaoPrazo(prazo, refTarde),
    "🟡-1 hora-do-dia do ref não desloca a classe (mesmo dia BRT)",
  );
  eq(situacaoPrazo(prazo, refTarde), "urgente", "🟡-1 prazo amanhã BRT → urgente independente da hora");
}

// 🟡-1: vence no mesmo dia-calendário BRT → no_limite, qualquer que seja a hora.
eq(situacaoPrazo("2026-06-25T20:00:00.000Z", HOJE), "no_limite", "🟡-1 prazo mesmo dia BRT → no_limite");

// 🟡-2: data ILEGÍVEL não degrada para 'folgado' — vira banda visível 'ilegivel'.
eq(situacaoPrazo("data-quebrada", HOJE), "ilegivel", "🟡-2 prazo ilegível → 'ilegivel' (não folgado)");

// 🟡-2: na triagem, intimação com prazo ilegível → banda 'ilegivel' + diasRestantes null.
{
  const [t] = triarMensagens([msg({ id: "ileg", intimacao: true, prazoLimiteIso: "31/13/2026" })], HOJE);
  eq(t.situacaoPrazo.situacao, "ilegivel", "🟡-2 triagem: prazo ilegível → banda 'ilegivel'");
  eq(t.diasRestantes, null, "🟡-2 triagem: prazo ilegível → diasRestantes null (não NaN)");
}

// 🟡-2: CND com validade ilegível → fail-safe 'vencida' (entra na fila), nunca 'vigente'.
{
  const r = prioridadeRenovacao(cnd({ validadeIso: "sem-validade-real", situacao: "regular" }), HOJE);
  eq(r.prioridade, "vencida", "🟡-2 CND validade ilegível → 'vencida' (fail-safe, não 'vigente')");
  const fila = detectarCndsAVencer([cnd({ id: "x", validadeIso: "lixo", situacao: "regular" })], HOJE);
  eq(fila.length, 1, "🟡-2 CND validade ilegível ENTRA na fila (não some como vigente)");
}

// ---------------------------------------------------------------------------
// Resultado
// ---------------------------------------------------------------------------
console.log("");
if (falhas > 0) {
  console.error(`✗ saude-fiscal-model: ${falhas}/${total} asserção(ões) FALHARAM.`);
  process.exit(1);
}
console.log(`✓ saude-fiscal-model: ${total}/${total} asserções OK (S3 triagem + S5 renovação/trilha).`);
process.exit(0);
