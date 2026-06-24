"use client";

/**
 * PAR-4 — Feed de alertas proativos de rescisão ("Alertas — revisar primeiro").
 *
 * Fica no TOPO da página de Parcelamentos e destaca os parcelamentos em risco de rescisão,
 * cada um com a mensagem concreta de boa-fé (indício + desconto potencialmente em risco +
 * janela de salvamento ~30d + sugestão de revisão). Os que viraram risco DESDE a última
 * leitura (vindos do monitor PAR-3) recebem o selo "NOVO hoje".
 *
 * Ação human-in-loop (CONTEXT §5 #1; handoff 57 §5): o único verbo disponível é "sugerir
 * revisão ao contador" — SINALIZA em memória, NUNCA regulariza/adere/promete. Não existe
 * adesão via API (handoff 57 §3/§6); o sistema orienta, o contador decide.
 *
 * ┌─ NOTA DE ARQUITETURA — central de alertas / Fila do dia (FOLLOW-UP) ──────────────────┐
 * │ A unificação destes alertas numa CENTRAL DE ALERTAS GLOBAL (ou na "Fila do dia" do      │
 * │ contador, junto com os apontamentos da Auditoria) é FOLLOW-UP — a decisão de            │
 * │ arquitetura de alertas (de quem é a fila, como dedupe entre módulos, prioridade         │
 * │ cross-domínio) está PENDENTE. Por ora o feed VIVE DENTRO do módulo Parcelamentos        │
 * │ (bounded context FF-1) justamente para NÃO poluir a Fila de auditoria com um tipo de    │
 * │ evento de outro domínio antes dessa decisão. Quando a central existir, este componente   │
 * │ vira um PRODUTOR de eventos para ela, não a dona da apresentação.                        │
 * └────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * Linguagem G6: "indício", "potencialmente em risco", "sugerimos" — nunca "evita
 * cancelamento" / "garante o desconto". Auto-contido: só lê Card/StatusBadge + CSS local.
 */
import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { brl } from "@/lib/format";
import { JANELA_SALVAMENTO_DIAS, type ParcelamentoView } from "./parcelamentos-model";
import styles from "./parcelamentos.module.css";

/** Um alerta do feed: o parcelamento em risco + se é novidade desde a última leitura. */
export interface AlertaRescisao {
  parc: ParcelamentoView;
  /** true = entrou/avançou em risco de rescisão desde a última leitura (monitor PAR-3). */
  novoHoje: boolean;
}

export function AlertasRescisao({ alertas }: { alertas: AlertaRescisao[] }) {
  if (alertas.length === 0) return null;

  const novos = alertas.filter((a) => a.novoHoje).length;

  return (
    <Card
      title="Alertas — revisar primeiro"
      sub="Parcelamentos com indício de risco de rescisão, priorizados. Sugerimos revisar com o cliente. A plataforma sinaliza; a decisão de regularizar é do contador."
    >
      {novos > 0 ? (
        <p className={styles.alertasResumo} role="status">
          <span className={styles.alertaNovoSelo}>NOVO hoje</span>
          <span>
            <strong className="num">{novos}</strong> parcelamento(s) entraram ou avançaram em
            indício de risco de rescisão desde a última leitura.
          </span>
        </p>
      ) : null}

      <ul className={styles.alertasList} aria-label="Alertas de risco de rescisão">
        {alertas.map((a) => (
          <AlertaItem key={a.parc.id} alerta={a} />
        ))}
      </ul>
    </Card>
  );
}

/** Um item do feed: mensagem de boa-fé + ação human-in-loop (sinaliza, não age). */
function AlertaItem({ alerta }: { alerta: AlertaRescisao }) {
  // Ação human-in-loop: idle → sinalizado (demo, em memória). NÃO é automação.
  const [sinalizado, setSinalizado] = useState(false);
  const { parc, novoHoje } = alerta;
  const { risco } = parc;
  const limiteAtingido = risco.nivel.nivel === "rescindido";

  // Mensagem concreta de boa-fé (G6) montada uma vez por item.
  const mensagem = useMemo(() => montarMensagem(parc), [parc]);

  return (
    <li className={`${styles.alertaItem} ${novoHoje ? styles.alertaItemNovo : ""}`}>
      <span className="semaforo-dot dot-risco" aria-hidden="true" />
      <div className={styles.alertaCorpo}>
        <div className={styles.alertaHead}>
          <strong>{parc.clienteNome}</strong>
          <StatusBadge view={risco.nivel} />
          {novoHoje ? (
            <span className={styles.alertaNovoSelo} aria-label="Novo indício de risco hoje">
              NOVO hoje
            </span>
          ) : null}
        </div>

        <p className={styles.alertaMsg}>{mensagem}</p>

        {parc.descontoEmRisco > 0 ? (
          <p className={styles.alertaDesconto}>
            Programa especial ({parc.programa}): caso o parcelamento seja rescindido, há
            indício de perda de cerca de{" "}
            <strong className="num">{brl(parc.descontoEmRisco)}</strong> em desconto
            potencialmente em risco (estimativa ilustrativa — confirmar na consolidação).
          </p>
        ) : null}

        {risco.parcelasNaJanela > 0 && !limiteAtingido ? (
          <p className={styles.alertaJanela}>
            <span aria-hidden="true">⧗</span> Janela de salvamento: há{" "}
            <strong className="num">{risco.parcelasNaJanela}</strong> parcela(s) com atraso
            recente (até ~{JANELA_SALVAMENTO_DIAS} dias). Pela regra, regularizar dentro dessa
            janela tende a não contar como descumprimento — a conferência é do contador.
          </p>
        ) : null}

        <div className={styles.alertaAcao}>
          {sinalizado ? (
            <p className={styles.alertaSinalizado} role="status" aria-live="polite">
              <span aria-hidden="true">✓</span> Sinalizado para revisão do contador (demo — em
              memória). A plataforma apenas registra o indício; regularizar é decisão do
              profissional, junto ao cliente.
            </p>
          ) : (
            <>
              <button
                type="button"
                className={styles.alertaBtn}
                onClick={() => setSinalizado(true)}
              >
                <span aria-hidden="true">⚑</span> Sugerir revisão ao contador
              </button>
              <span className="muted" style={{ fontSize: 11 }}>
                Não regulariza nem promete evitar o cancelamento — só marca o caso para a
                decisão do contador.
              </span>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

/**
 * Monta a frase de boa-fé concreta (G6) do alerta. Descreve o INDÍCIO e a janela; nunca
 * afirma que a rescisão vai ou não acontecer, nem promete evitar o cancelamento.
 */
function montarMensagem(parc: ParcelamentoView): string {
  const { risco } = parc;
  if (risco.nivel.nivel === "rescindido") {
    return (
      "Indício: o nº de parcelas em atraso atingiu o limite indicado para o cancelamento do " +
      "parcelamento — o desconto fica potencialmente em risco. Sugerimos conferir a situação " +
      "no Fisco e revisar com o cliente."
    );
  }
  const faltam = risco.parcelasAteRescisao ?? 0;
  return (
    `Indício: faltam ${faltam} parcela(s) em atraso para o limite que pode levar ao ` +
    `cancelamento do parcelamento — o desconto fica potencialmente em risco. ` +
    `Janela de salvamento de ~${JANELA_SALVAMENTO_DIAS} dias. Sugerimos revisar com o cliente.`
  );
}
