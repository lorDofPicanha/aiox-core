import assert from "node:assert/strict";
import { test } from "node:test";

const { transition, flagOpenSanavelBlockingGap, clearSanavelBlockingGap } = await import(
  "../lib/agents/orchestrator.ts"
);
const { initialMaestroState, maestroToWorkflowStage, MAESTRO_BINDING_ACTS } = await import(
  "../lib/agents/maestro-types.ts"
);

const NOW = "2026-06-18T12:00:00.000Z";
const human = { actor: "human", now: NOW };
const pipeline = { actor: "pipeline", now: NOW };
const scheduler = { actor: "scheduler", now: NOW };

// State factory: a MaestroState parked at `stage` with optional overrides.
function at(stage, overrides = {}) {
  return { ...initialMaestroState("hash-v1"), stage, ...overrides };
}

function clock(kind, fatalOnMiss = true, dateConfidence = "observed") {
  return {
    kind,
    basis: "uteis_horacheia",
    dueAt: "2026-06-25T12:00:00.000Z",
    armedBy: "dataSessao",
    status: "armado",
    fatalOnMiss,
    dateConfidence,
  };
}

function ok(res) {
  assert.equal(res.ok, true, res.ok ? "" : `expected ok, got: ${res.ok === false ? res.reason : ""}`);
  return res.next;
}
function rejected(res) {
  assert.equal(res.ok, false, `expected REJECTED, but transition succeeded → ${res.ok ? res.next?.stage : ""}`);
  return res.reason;
}

// ════════════════════════════════════════════════════════════════════════════
// HAPPY PATHS — the spine of the state machine (§11.1)
// ════════════════════════════════════════════════════════════════════════════

test("happy: descoberto → triado → analisado → habilitado → entregando → pronto → protocolada → em-sessao → vencedora-provisoria → vencido", () => {
  let s = initialMaestroState("hash-v1");
  s = ok(transition(s, { type: "faro_triou", verdict: "vai" }, pipeline));
  assert.equal(s.stage, "triado");
  s = ok(transition(s, { type: "faro_triou", verdict: "vai" }, pipeline));
  assert.equal(s.stage, "analisado");
  s = ok(transition(s, { type: "prisma_analisou", ok: true }, pipeline));
  assert.equal(s.stage, "habilitado");
  s = ok(transition(s, { type: "forja_veredito", verdict: "GO" }, pipeline));
  assert.equal(s.stage, "entregando");
  s = ok(transition(s, { type: "humano_aprovou_dossie" }, human));
  assert.equal(s.stage, "pronto-protocolo");
  s = ok(transition(s, { type: "humano_confirmou_protocolo", numeroProcesso: "PROC-1", protocolAt: NOW }, human));
  assert.equal(s.stage, "protocolada");
  s = ok(transition(s, { type: "sentinela_armou_sessao", clock: clock("intencao_recurso") }, pipeline));
  assert.equal(s.stage, "em-sessao");
  s = ok(
    transition(
      s,
      {
        type: "sessao_resultado",
        result: {
          editalId: "e1",
          editalVersionHash: "hash-v1",
          sessionAt: NOW,
          eniacOutcome: "vencedora",
          source: "portal",
          confidence: "observed",
          thirdPartyAppealWindow: clock("contrarrazoes"),
        },
      },
      pipeline,
    ),
  );
  assert.equal(s.stage, "vencedora-provisoria");
  s = ok(transition(s, { type: "homologacao_sem_recurso" }, pipeline));
  assert.equal(s.stage, "vencido");
});

test("happy: triado Pula → arquivado", () => {
  const s = ok(transition(at("triado"), { type: "faro_triou", verdict: "pula" }, pipeline));
  assert.equal(s.stage, "arquivado");
});

test("happy: perdeu por inabilitação → avaliar-recurso-inabilitacao → minuta com fundamento → recurso-protocolado", () => {
  let s = at("em-sessao");
  s = ok(
    transition(
      s,
      {
        type: "sessao_resultado",
        result: { editalId: "e", editalVersionHash: "hash-v1", sessionAt: NOW, eniacOutcome: "inabilitada", source: "portal", confidence: "observed" },
      },
      pipeline,
    ),
  );
  assert.equal(s.stage, "avaliar-recurso-inabilitacao");
  s = ok(transition(s, { type: "tribuno_com_fundamento" }, pipeline));
  assert.equal(s.stage, "avaliar-recurso-inabilitacao"); // permanece até gate advogado
  s = ok(transition(s, { type: "humano_aprovou_minuta" }, human));
  assert.equal(s.stage, "recurso-protocolado");
});

test("happy: derrota de julgamento → Tribuno sem fundamento → encerrado-sem-recurso (honesto)", () => {
  let s = at("em-sessao");
  s = ok(
    transition(
      s,
      { type: "sessao_resultado", result: { editalId: "e", editalVersionHash: "hash-v1", sessionAt: NOW, eniacOutcome: "derrotada_julgamento", source: "portal", confidence: "observed" } },
      pipeline,
    ),
  );
  assert.equal(s.stage, "avaliar-recurso-julgamento");
  s = ok(transition(s, { type: "tribuno_sem_fundamento" }, pipeline));
  assert.equal(s.stage, "encerrado-sem-recurso");
});

test("happy: suspeição alta → impugnacao-edital → gate advogado → volta a analisado", () => {
  let s = at("analisado");
  s = ok(transition(s, { type: "suspeicao_alta", clock: clock("impugnacao_edital") }, pipeline));
  assert.equal(s.stage, "impugnacao-edital");
  assert.equal(s.clocks.length, 1);
  s = ok(transition(s, { type: "humano_aprovou_impugnacao" }, human));
  assert.equal(s.stage, "analisado");
});

test("happy: A5 consórcio — NO_GO + rota → aguardando-dado(parceiro_consorcio) → parceiro_cadastrado → habilitado", () => {
  let s = at("habilitado");
  s = ok(transition(s, { type: "forja_veredito", verdict: "NO_GO", consorcioRota: true }, pipeline));
  assert.equal(s.stage, "aguardando-dado");
  assert.equal(s.waitingFor, "parceiro_consorcio");
  s = ok(transition(s, { type: "parceiro_cadastrado" }, human));
  assert.equal(s.stage, "habilitado");
  assert.equal(s.waitingFor, null);
});

test("happy: A2 PENDENTE_DADO → aguardando-dado(analise) → dado_recebido(analise) → analisado", () => {
  let s = at("habilitado");
  s = ok(transition(s, { type: "forja_veredito", verdict: "PENDENTE_DADO" }, pipeline));
  assert.equal(s.waitingFor, "analise");
  s = ok(transition(s, { type: "dado_recebido", waitingFor: "analise" }, human));
  assert.equal(s.stage, "analisado");
});

test("happy: diligência abre de em-sessao e RETORNA a em-sessao (C2)", () => {
  let s = at("em-sessao");
  s = ok(transition(s, { type: "pregoeiro_abriu_diligencia", clock: clock("diligencia", false) }, pipeline));
  assert.equal(s.stage, "em-diligencia");
  assert.equal(s.returnTo, "em-sessao");
  s = ok(transition(s, { type: "respondeu_diligencia" }, human));
  assert.equal(s.stage, "em-sessao");
  assert.equal(s.returnTo, null);
});

test("happy: diligência abre de aguardando-resultado e RETORNA a aguardando-resultado (C2)", () => {
  let s = at("aguardando-resultado");
  s = ok(transition(s, { type: "pregoeiro_abriu_diligencia", clock: clock("diligencia", false) }, pipeline));
  assert.equal(s.returnTo, "aguardando-resultado");
  s = ok(transition(s, { type: "respondeu_diligencia" }, human));
  assert.equal(s.stage, "aguardando-resultado");
});

test("happy: empate ficto ME/EPP permanece em-sessao (C-NOVO-4, sub-evento não estado)", () => {
  const s = ok(
    transition(
      at("em-sessao"),
      { type: "sessao_resultado", result: { editalId: "e", editalVersionHash: "hash-v1", sessionAt: NOW, eniacOutcome: "empate_ficto_meepp", source: "portal", confidence: "observed" } },
      pipeline,
    ),
  );
  assert.equal(s.stage, "em-sessao");
  assert.match(s.stepFailed.reason, /empate_ficto/);
});

// ════════════════════════════════════════════════════════════════════════════
// §13.1 — 7 TESTES NEGATIVOS OBRIGATÓRIOS (caminho proibido → asserção)
// ════════════════════════════════════════════════════════════════════════════

test("§13.1#1 — em-diligencia sem returnTo → REJEITADO (C2)", () => {
  // caminho proibido: responder diligência sem destino determinístico setado
  const reason = rejected(transition(at("em-diligencia", { returnTo: null }), { type: "respondeu_diligencia" }, human));
  assert.match(reason, /returnTo/);
});

test("§13.1#2a — aguardando-dado sem waitingFor → REJEITADO (C3)", () => {
  const reason = rejected(transition(at("aguardando-dado", { waitingFor: null }), { type: "dado_recebido", waitingFor: "analise" }, human));
  assert.match(reason, /waitingFor/);
});

test("§13.1#2b — aguardando-dado(parceiro_consorcio) recebendo dado_recebido → no-op (não avança)", () => {
  const reason = rejected(
    transition(at("aguardando-dado", { waitingFor: "parceiro_consorcio" }), { type: "dado_recebido", waitingFor: "certidao" }, human),
  );
  assert.match(reason, /parceiro_consorcio/);
});

test("§13.1#3 — NO_GO + needsConsorcioPartner indo a arquivado-motivo → REJEITADO; deve ir a aguardando-dado(parceiro_consorcio) (C4)", () => {
  // O caminho PROIBIDO seria arquivar; provamos que com consorcioRota=true NÃO arquiva.
  const s = ok(transition(at("habilitado"), { type: "forja_veredito", verdict: "NO_GO", consorcioRota: true }, pipeline));
  assert.notEqual(s.stage, "arquivado-motivo");
  assert.equal(s.stage, "aguardando-dado");
  assert.equal(s.waitingFor, "parceiro_consorcio");
  // E que NÃO existe ramo de verdict "CONSORCIO" (dead branch): só os 4 reais.
  const reasonGo = rejected(transition(at("habilitado"), { type: "faro_triou", verdict: "vai" }, pipeline));
  assert.match(reasonGo, /forja_veredito/);
});

test("§13.1#4 — pronto-protocolo com gap SANÁVEL bloqueante aberto → confirmar protocolo REJEITADO (C4-ii)", () => {
  let s = at("pronto-protocolo");
  s = flagOpenSanavelBlockingGap(s, NOW);
  const reason = rejected(
    transition(s, { type: "humano_confirmou_protocolo", numeroProcesso: "P", protocolAt: NOW }, human),
  );
  assert.match(reason, /sanável bloqueante|SANAVEL|sanavel/i);
  // E depois de resolver o gap, passa:
  s = clearSanavelBlockingGap(s);
  const after = ok(transition(s, { type: "humano_confirmou_protocolo", numeroProcesso: "P", protocolAt: NOW }, human));
  assert.equal(after.stage, "protocolada");
});

test("§13.1#5 — defendendo-vitoria com recurso de 3º provido indo a vencido → REJEITADO; deve ir a avaliar-recurso-julgamento (C-NOVO-3)", () => {
  const s = ok(transition(at("defendendo-vitoria", { clocks: [clock("contrarrazoes")] }), { type: "recurso_terceiro_provido" }, pipeline));
  assert.notEqual(s.stage, "vencido");
  assert.equal(s.stage, "avaliar-recurso-julgamento");
  // recurso negado → vencido (o outro ramo):
  const negado = ok(transition(at("defendendo-vitoria"), { type: "recurso_terceiro_negado" }, pipeline));
  assert.equal(negado.stage, "vencido");
});

test("§13.1#6 — congelado-edital-mudou avançando sem re-triagem humana → REJEITADO (C1)", () => {
  const reason = rejected(transition(at("congelado-edital-mudou"), { type: "faro_triou", verdict: "vai" }, pipeline));
  assert.match(reason, /re-triagem|humano_retriou_edital/);
  // E que a re-triagem humana FUNCIONA (única saída) com novo hash:
  const retriado = ok(transition(at("congelado-edital-mudou"), { type: "humano_retriou_edital", novoEditalVersionHash: "hash-v2" }, human));
  assert.equal(retriado.stage, "triado");
  assert.equal(retriado.editalVersionHash, "hash-v2");
  assert.equal(retriado.humanLayer.length, 1); // humanLayer antigo preservado + marca da re-triagem
});

test("§13.1#7 — clock fatalOnMiss=false vencido levando a prazo-perdido → REJEITADO; deve gerar alerta e manter estado (C1)", () => {
  const s = at("em-diligencia", { returnTo: "em-sessao", clocks: [clock("diligencia", false)] });
  const next = ok(transition(s, { type: "prazo_venceu", clockKind: "diligencia" }, pipeline));
  assert.notEqual(next.stage, "prazo-perdido");
  assert.equal(next.stage, "em-diligencia"); // estado mantido
  assert.match(next.stepFailed.reason, /não-fatal|nao-fatal|CRÍTICO|CRITICO/i);
});

// ════════════════════════════════════════════════════════════════════════════
// §10.7 — caminhos PROIBIDOS adicionais (cada um prova {ok:false})
// ════════════════════════════════════════════════════════════════════════════

test("§10.7 — ir de entregar a acompanhar/protocolada sem confirmação de protocolo → REJEITADO (B1)", () => {
  // De entregando, só humano_aprovou_dossie leva a pronto-protocolo; pular para
  // protocolada (acompanhar) sem o gate é proibido.
  const reason = rejected(transition(at("entregando"), { type: "sentinela_armou_sessao", clock: clock("intencao_recurso") }, pipeline));
  assert.match(reason, /humano_aprovou_dossie/);
  // E de pronto-protocolo, só a confirmação humana arma a sessão:
  const reason2 = rejected(transition(at("pronto-protocolo"), { type: "sentinela_armou_sessao", clock: clock("intencao_recurso") }, pipeline));
  assert.match(reason2, /humano_confirmou_protocolo/);
});

test("§10.7 — scheduler tenta mover edital com decisão humana (intend_to_appeal) → REJEITADO (I6)", () => {
  const locked = at("avaliar-recurso-julgamento", {
    humanLayer: [{ kind: "intend_to_appeal", at: NOW, by: "operador-eniac" }],
  });
  const reason = rejected(transition(locked, { type: "tribuno_sem_fundamento" }, scheduler));
  assert.match(reason, /read-only|scheduler/i);
});

test("§10.7 — alerta de intenção de recurso dispara SEM ata ingerida → PASSA (I9, proativo pela dataSessao)", () => {
  // protocolada → em-sessao é armado pelo Sentinela a partir da dataSessao,
  // sem depender da ata. O alerta proativo é o relógio armado.
  const s = ok(
    transition(
      at("protocolada", { humanLayer: [{ kind: "confirmou_protocolo", at: NOW, by: "operador-eniac" }] }),
      { type: "sentinela_armou_sessao", clock: { ...clock("intencao_recurso"), armedBy: "dataSessao" } },
      pipeline,
    ),
  );
  assert.equal(s.stage, "em-sessao");
  const armed = s.clocks.find((c) => c.kind === "intencao_recurso");
  assert.ok(armed, "relógio de intenção de recurso armado proativamente");
  assert.equal(armed.armedBy, "dataSessao");
});

// ════════════════════════════════════════════════════════════════════════════
// Guardas globais adicionais (saltos de estado, terminais, edital mudou, fatal)
// ════════════════════════════════════════════════════════════════════════════

test("salto de estado: descoberto direto a habilitado → REJEITADO (sem análise)", () => {
  const reason = rejected(transition(initialMaestroState("h"), { type: "forja_veredito", verdict: "GO" }, pipeline));
  assert.match(reason, /descoberto/);
});

test("terminal: vencido é imutável → qualquer evento REJEITADO (I10)", () => {
  const reason = rejected(transition(at("vencido"), { type: "terceiro_recorreu", clock: clock("contrarrazoes") }, pipeline));
  assert.match(reason, /terminal/);
});

test("edital mudou de QUALQUER estado → congelado-edital-mudou, clocks limpos (B5/I11)", () => {
  const s = ok(transition(at("entregando", { clocks: [clock("proposta")] }), { type: "evento_edital_mudou", tipo: "republicacao" }, pipeline));
  assert.equal(s.stage, "congelado-edital-mudou");
  assert.equal(s.clocks.length, 0);
});

test("prazo_venceu fatal em estado de proposta → prazo-perdido (A4/C1)", () => {
  const s = ok(transition(at("entregando", { clocks: [clock("proposta", true)] }), { type: "prazo_venceu", clockKind: "proposta" }, pipeline));
  assert.equal(s.stage, "prazo-perdido");
});

test("prazo_venceu fatal em fase de recurso → encerrado-sem-recurso (C1)", () => {
  const s = ok(transition(at("avaliar-recurso-julgamento", { clocks: [clock("razoes_recurso", true)] }), { type: "prazo_venceu", clockKind: "razoes_recurso" }, pipeline));
  assert.equal(s.stage, "encerrado-sem-recurso");
});

test("scheduler prazo_venceu sobre edital human-locked → downgrade para alerta, estado mantido (I5/I6)", () => {
  const locked = at("em-sessao", {
    humanLayer: [{ kind: "confirmou_protocolo", at: NOW, by: "op" }],
    clocks: [clock("intencao_recurso", true)],
  });
  const s = ok(transition(locked, { type: "prazo_venceu", clockKind: "intencao_recurso" }, scheduler));
  assert.equal(s.stage, "em-sessao"); // não mudou de estado
  assert.match(s.stepFailed.reason, /alerta|read-only/i);
});

// ════════════════════════════════════════════════════════════════════════════
// Tipos / mapeamento / constantes
// ════════════════════════════════════════════════════════════════════════════

test("maestroToWorkflowStage mapeia todos os estágios sem cair no default", () => {
  const samples = [
    ["descoberto", "monitorar"],
    ["analisado", "analisar"],
    ["impugnacao-edital", "analisar"],
    ["aguardando-dado", "habilitar"],
    ["entregando", "indicar"],
    ["protocolada", "acompanhar"],
    ["em-diligencia", "acompanhar"],
    ["vencedora-provisoria", "acompanhar"],
    ["avaliar-recurso-inabilitacao", "recorrer"],
    ["vencido", "acompanhar"],
    ["arquivado", "monitorar"],
    ["prazo-perdido", "monitorar"],
    ["encerrado-sem-recurso", "recorrer"],
    ["congelado-edital-mudou", "acompanhar"],
  ];
  for (const [maestro, expected] of samples) {
    assert.equal(maestroToWorkflowStage(maestro), expected, `${maestro} → ${expected}`);
  }
});

test("MAESTRO_BINDING_ACTS amplia os 4 reais com os 3 novos (I1/C-NOVO-6)", () => {
  for (const act of ["lance", "declaracao", "proposta", "recurso", "contrarrazoes", "impugnacao_edital", "resposta_diligencia"]) {
    assert.ok(MAESTRO_BINDING_ACTS.includes(act), `${act} em MAESTRO_BINDING_ACTS`);
  }
});

test("idempotência: humanLayer é append-only (transições humanas só adicionam)", () => {
  let s = at("entregando");
  s = ok(transition(s, { type: "humano_aprovou_dossie" }, human));
  assert.equal(s.humanLayer.length, 1);
  s = ok(transition(s, { type: "humano_confirmou_protocolo", numeroProcesso: "P", protocolAt: NOW }, human));
  assert.equal(s.humanLayer.length, 2);
  // a primeira decisão permanece intocada
  assert.equal(s.humanLayer[0].kind, "aprovou_dossie");
});

test("history registra cada transição com actor e evento (auditoria Lastro)", () => {
  let s = initialMaestroState("h");
  s = ok(transition(s, { type: "faro_triou", verdict: "vai" }, pipeline));
  s = ok(transition(s, { type: "faro_triou", verdict: "olha" }, pipeline));
  assert.equal(s.history.length, 2);
  assert.equal(s.history[0].from, "descoberto");
  assert.equal(s.history[0].to, "triado");
  assert.equal(s.history[1].actor, "pipeline");
});

// ════════════════════════════════════════════════════════════════════════════
// A3 — veto de protocolo TIPADO não é apagado por prazo não-fatal no slot stepFailed
// ════════════════════════════════════════════════════════════════════════════

test("A3: prazo não-fatal vencendo NÃO apaga o veto de protocolo (gap bloqueante segue vetando)", () => {
  // Arma o veto de gap sanável bloqueante em pronto-protocolo.
  let s = flagOpenSanavelBlockingGap(at("pronto-protocolo", { clocks: [clock("diligencia", false)] }), NOW);
  assert.equal(s.openBlockingGap, true);

  // Um prazo NÃO-fatal vence → o engine grava stepFailed (slot volátil/alerta).
  // ANTES do A3 isso apagava o veto (que morava em stepFailed por prefixo de string).
  s = ok(transition(s, { type: "prazo_venceu", clockKind: "diligencia" }, scheduler));
  assert.match(s.stepFailed.reason, /não-fatal|nao-fatal|alerta/i);
  assert.equal(s.openBlockingGap, true, "veto TIPADO sobrevive ao overwrite do stepFailed");

  // Confirmar protocolo continua REJEITADO pelo veto de gap.
  const reason = rejected(
    transition(s, { type: "humano_confirmou_protocolo", numeroProcesso: "P", protocolAt: NOW }, human),
  );
  assert.match(reason, /sanável bloqueante|SANAVEL|sanavel/i);

  // Resolvido o gap → typed flag limpa → protocolo passa.
  const cleared = clearSanavelBlockingGap(s);
  assert.equal(cleared.openBlockingGap, false);
  const after = ok(
    transition(cleared, { type: "humano_confirmou_protocolo", numeroProcesso: "P", protocolAt: NOW }, human),
  );
  assert.equal(after.stage, "protocolada");
});
