"use client";

/**
 * S3 + S5 — Feed proativo de SAÚDE FISCAL ("Revisar primeiro" do e-CAC).
 *
 * Fica no TOPO do módulo e-CAC e une os dois achados desta fatia [build]:
 *   - S3 (caixa postal): intimações com prazo + comunicados da Receita (marca "!"), triados
 *     por relevância — crítico/atenção primeiro, com a situação do prazo (expirado/no
 *     limite/curto/folgado).
 *   - S5 (CND): a fila de renovação priorizada — CNDs vencidas e a vencer, por cliente/esfera.
 *
 * Espelha AlertasRescisao.tsx (módulo parcelamentos): mesmo padrão de cartão soft + ação
 * human-in-loop "sugerir revisão/renovação" (SINALIZA em memória, NUNCA age).
 *
 * Ação human-in-loop (CONTEXT §5 #1; handoff 58 §5): o único verbo disponível é "sugerir ao
 * contador". A plataforma TRIA e SUGERE; responder à intimação / renovar a CND é decisão do
 * contador. Não existe renovação/emissão via esta fatia (adapters S1/S2/S4 são gate do
 * founder — fora do escopo).
 *
 * Linguagem G6: "indício", "CND a vencer", "renovação sugerida" — nunca "regularizado",
 * "garantido", "resolvido" nem "em dia" como promessa. Auto-contido: só lê Card/StatusBadge
 * + o CSS local do e-CAC.
 */
import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { dataHora } from "@/lib/format";
import type { ItemRenovacaoCnd, MensagemTriada, SituacaoPrazo } from "./saude-fiscal-model";
import styles from "./ecac.module.css";

/** Mapeia a situação do prazo → classe da faixa de prazo (visual). */
const PRAZO_CLASSE: Record<SituacaoPrazo, string> = {
  expirado: styles.feedPrazoExpirado,
  no_limite: styles.feedPrazoLimite,
  urgente: styles.feedPrazoUrgente,
  folgado: styles.feedPrazoFolgado,
  sem_prazo: styles.feedPrazoFolgado,
  ilegivel: styles.feedPrazoExpirado,
};

export interface AlertasSaudeFiscalProps {
  /** Mensagens triadas (S3) — só as relevantes (crítico/atenção) chegam aqui. */
  mensagens: MensagemTriada[];
  /** Fila de renovação de CND (S5) — vencidas + a vencer, priorizadas. */
  renovacoes: ItemRenovacaoCnd[];
  /** Nº de intimações com prazo expirado ou vencendo hoje (para o selo de urgência). */
  prazosNoLimite: number;
  /** Nº de CNDs já vencidas (para o selo de urgência). */
  cndsVencidas: number;
}

export function AlertasSaudeFiscal({
  mensagens,
  renovacoes,
  prazosNoLimite,
  cndsVencidas,
}: AlertasSaudeFiscalProps) {
  if (mensagens.length === 0 && renovacoes.length === 0) return null;

  return (
    <Card
      title="Saúde fiscal — revisar primeiro"
      sub="Intimações com prazo, comunicados da Receita e CNDs a vencer/vencidas, priorizados. A plataforma sinaliza o indício; responder ou renovar é decisão do contador."
    >
      {prazosNoLimite > 0 || cndsVencidas > 0 ? (
        <p className={styles.feedResumo} role="status">
          <span className={styles.feedSelo}>Urgente</span>
          <span>
            {prazosNoLimite > 0 ? (
              <>
                <strong className="num">{prazosNoLimite}</strong> intimação(ões) com prazo
                expirado ou vencendo hoje
              </>
            ) : null}
            {prazosNoLimite > 0 && cndsVencidas > 0 ? " · " : null}
            {cndsVencidas > 0 ? (
              <>
                <strong className="num">{cndsVencidas}</strong> CND(s) vencida(s)
              </>
            ) : null}
            . Sugerimos revisar com prioridade.
          </span>
        </p>
      ) : null}

      {/* S3 — caixa postal triada. */}
      {mensagens.length > 0 ? (
        <section className={styles.feedSecao}>
          <h3 className={styles.feedSecaoTitulo}>
            <span aria-hidden="true">✉</span> Caixa postal — mensagens relevantes
            <span className={styles.feedConta}>({mensagens.length})</span>
          </h3>
          <ul className={styles.feedList} aria-label="Mensagens da caixa postal triadas">
            {mensagens.map((m) => (
              <MensagemItem key={m.id} msg={m} />
            ))}
          </ul>
        </section>
      ) : null}

      {/* S5 — fila de renovação de CND. */}
      {renovacoes.length > 0 ? (
        <section className={styles.feedSecao}>
          <h3 className={styles.feedSecaoTitulo}>
            <span aria-hidden="true">⧗</span> Renovação de CND — fila sugerida
            <span className={styles.feedConta}>({renovacoes.length})</span>
          </h3>
          <ul className={styles.feedList} aria-label="Fila de renovação de CND">
            {renovacoes.map((item) => (
              <RenovacaoItem key={item.cnd.id} item={item} />
            ))}
          </ul>
        </section>
      ) : null}
    </Card>
  );
}

/** Um item da caixa postal triada (S3): assunto + nível + situação do prazo + ação. */
function MensagemItem({ msg }: { msg: MensagemTriada }) {
  const [sinalizado, setSinalizado] = useState(false);
  const critico = msg.nivel.nivel === "critico";
  const prazo = msg.situacaoPrazo;
  const temPrazo = prazo.situacao !== "sem_prazo";

  const textoPrazo = useMemo(() => montarTextoPrazo(msg), [msg]);

  return (
    <li className={`${styles.feedItem} ${critico ? styles.feedItemCritico : styles.feedItemAtencao}`}>
      <span
        className={`${styles.feedDot} ${critico ? styles.feedDotCritico : styles.feedDotAtencao}`}
        aria-hidden="true"
      />
      <div className={styles.feedCorpo}>
        <div className={styles.feedHead}>
          <strong>{msg.assunto}</strong>
          <StatusBadge view={msg.nivel} />
        </div>
        <p className={styles.feedCliente}>
          {msg.clienteNome} · {msg.remetente} · recebida em {dataHora(msg.recebidaEmIso)}
        </p>

        <p className={styles.feedMsg}>{msg.nivel.hint}</p>

        {temPrazo ? (
          <p className={`${styles.feedPrazo} ${PRAZO_CLASSE[prazo.situacao]}`}>
            <span aria-hidden="true">{prazo.glyph}</span> {textoPrazo}
          </p>
        ) : null}

        <div className={styles.feedAcao}>
          {sinalizado ? (
            <p className={styles.feedSinalizado} role="status" aria-live="polite">
              <span aria-hidden="true">✓</span> Sinalizado para revisão do contador (demo — em
              memória). A plataforma apenas registra o indício; responder à intimação é ato do
              profissional.
            </p>
          ) : (
            <>
              <button
                type="button"
                className={styles.feedBtn}
                onClick={() => setSinalizado(true)}
              >
                <span aria-hidden="true">⚑</span> Sugerir revisão ao contador
              </button>
              <span className={styles.feedNota}>
                Não responde nem protocola nada — só marca o caso para a decisão do contador.
              </span>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

/** Um item da fila de renovação de CND (S5): cliente/esfera + prioridade + ação. */
function RenovacaoItem({ item }: { item: ItemRenovacaoCnd }) {
  const [sugerido, setSugerido] = useState(false);
  const vencida = item.prioridade.prioridade === "vencida";

  const textoVencimento = useMemo(() => montarTextoVencimento(item), [item]);

  return (
    <li className={`${styles.feedItem} ${vencida ? styles.feedItemCritico : styles.feedItemAtencao}`}>
      <span
        className={`${styles.feedDot} ${vencida ? styles.feedDotCritico : styles.feedDotAtencao}`}
        aria-hidden="true"
      />
      <div className={styles.feedCorpo}>
        <div className={styles.feedHead}>
          <strong>{item.cnd.clienteNome}</strong>
          <StatusBadge view={item.prioridade} />
        </div>
        <p className={styles.feedCliente}>
          {item.esferaView.rotulo} · consulta sintética ({item.esferaView.provedor})
        </p>

        <p className={styles.feedMsg}>
          {item.prioridade.hint} {textoVencimento}
        </p>

        <div className={styles.feedAcao}>
          {sugerido ? (
            <p className={styles.feedSinalizado} role="status" aria-live="polite">
              <span aria-hidden="true">✓</span> Renovação sugerida e marcada para registro na
              trilha (demo — em memória; gravador da trilha do add-on = Fase). A plataforma
              sinaliza o indício; renovar/emitir a certidão é ato do contador.
            </p>
          ) : (
            <>
              <button
                type="button"
                className={styles.feedBtn}
                onClick={() => setSugerido(true)}
              >
                <span aria-hidden="true">⚑</span> Sugerir renovação ao contador
              </button>
              <span className={styles.feedNota}>
                Não renova nem emite certidão — gera um evento de sugestão na trilha de boa-fé.
              </span>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

/** Frase G6-safe do prazo de uma intimação (descreve a janela; não promete desfecho). */
function montarTextoPrazo(msg: MensagemTriada): string {
  const dias = msg.diasRestantes;
  if (dias == null) return msg.situacaoPrazo.label;
  if (dias < 0) {
    return `Prazo indicado expirado há ${Math.abs(dias)} dia(s) na base sintética — conferir a situação no portal.`;
  }
  if (dias === 0) return "Prazo indicado vence hoje na base sintética — sugerimos abrir com prioridade.";
  return `Prazo indicado: ${dias} dia(s) restante(s) na base sintética — sugerimos revisar.`;
}

/** Frase G6-safe do vencimento de uma CND (descreve o indício; não promete renovação). */
function montarTextoVencimento(item: ItemRenovacaoCnd): string {
  const dias = item.diasAteVencer;
  if (dias == null) {
    return "Sem validade vigente conhecida na consulta sintética.";
  }
  if (dias < 0) return `Validade vencida há ${Math.abs(dias)} dia(s) na base sintética.`;
  return `Vence em ${dias} dia(s) na base sintética.`;
}
