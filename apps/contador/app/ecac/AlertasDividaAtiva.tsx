/**
 * S6 — Feed de DÍVIDA ATIVA (PGFN/Regularize) no cockpit e-CAC.
 *
 * Seção read-only, presentational (sem interatividade), que mostra as inscrições em dívida ativa
 * com INDÍCIO de risco de EXCLUSÃO AUTOMÁTICA de parcelamento por inadimplência (≤7d crítico /
 * ≤75d aviso — handoff 58 §4, S6). Espelha o padrão visual de AlertasSaudeFiscal (mesmo Card +
 * StatusBadge + classes feed*), reutilizando componentes existentes (UI mínima).
 *
 * Ação human-in-loop (CONTEXT §5 #1): a plataforma SINALIZA o indício; negociar/pagar/regularizar
 * é decisão do contador — feita no Regularize. Esta seção só LÊ e destaca.
 *
 * Linguagem G6: "indício de risco de exclusão", "consta inscrição", "a confirmar no Regularize" —
 * nunca "regularizado", "quitado" nem "sem pendências" como promessa.
 */
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { brl, dataHora } from "@/lib/format";
import type { ItemDividaAtiva, ResumoDividaAtiva } from "./divida-ativa-model";
import styles from "./ecac.module.css";

export interface AlertasDividaAtivaProps {
  /** Inscrições com alerta ativo (crítico/aviso/excluído), priorizadas. */
  itens: ItemDividaAtiva[];
  /** Resumo geral da dívida ativa da carteira. */
  resumo: ResumoDividaAtiva;
}

export function AlertasDividaAtiva({ itens, resumo }: AlertasDividaAtivaProps) {
  if (itens.length === 0) return null;

  return (
    <Card
      title="Dívida ativa — risco de exclusão de parcelamento"
      sub="Inscrições no PGFN/Regularize com indício de exclusão automática por inadimplência (≤7 dias crítico · ≤75 dias aviso). A plataforma sinaliza o indício; negociar ou pagar é decisão do contador, no Regularize."
    >
      {resumo.criticas > 0 || resumo.avisos > 0 ? (
        <p className={styles.feedResumo} role="status">
          <span className={styles.feedSelo}>Atenção</span>
          <span>
            {resumo.criticas > 0 ? (
              <>
                <strong className="num">{resumo.criticas}</strong> inscrição(ões) com exclusão
                iminente ou prazo vencido
              </>
            ) : null}
            {resumo.criticas > 0 && resumo.avisos > 0 ? " · " : null}
            {resumo.avisos > 0 ? (
              <>
                <strong className="num">{resumo.avisos}</strong> com janela de exclusão aberta
              </>
            ) : null}
            . Consolidado sob monitoramento: <strong className="num">{brl(resumo.valorConsolidadoTotal)}</strong>.
            A confirmar no Regularize.
          </span>
        </p>
      ) : null}

      <ul className={styles.feedList} aria-label="Inscrições em dívida ativa com alerta">
        {itens.map((item) => (
          <DividaItem key={item.divida.id} item={item} />
        ))}
      </ul>
    </Card>
  );
}

/** Uma inscrição com alerta: natureza + situação + alerta de exclusão + valor + prazo. */
function DividaItem({ item }: { item: ItemDividaAtiva }) {
  const critico = item.alerta.nivel === "critico" || item.alerta.nivel === "excluido";
  const parc = item.divida.parcelamentoVinculado;

  return (
    <li className={`${styles.feedItem} ${critico ? styles.feedItemCritico : styles.feedItemAtencao}`}>
      <span
        className={`${styles.feedDot} ${critico ? styles.feedDotCritico : styles.feedDotAtencao}`}
        aria-hidden="true"
      />
      <div className={styles.feedCorpo}>
        <div className={styles.feedHead}>
          <strong>{item.divida.clienteNome}</strong>
          <StatusBadge view={item.alerta} />
        </div>
        <p className={styles.feedCliente}>
          {item.naturezaRotulo} · inscrição {item.divida.inscricao} · {item.naturezaOrgao}
        </p>

        <p className={styles.feedMsg}>
          {item.alerta.hint} Valor consolidado que consta: <strong className="num">{brl(item.divida.valorConsolidado)}</strong>
          {parc ? <> · parcelamento {parc.programa} ({parc.numero})</> : null}.
        </p>

        <p className={styles.feedCliente}>{montarTextoExclusao(item)}</p>
      </div>
    </li>
  );
}

/** Frase G6-safe do prazo de exclusão (descreve o indício; não promete desfecho). */
function montarTextoExclusao(item: ItemDividaAtiva): string {
  const dias = item.diasAteExclusao;
  const parc = item.divida.parcelamentoVinculado;
  if (dias == null) {
    if (item.alerta.nivel === "excluido") {
      return "Prazo de exclusão indicado já vencido na consulta — a confirmar a situação do parcelamento no Regularize.";
    }
    return "Sem prazo de exclusão em curso na consulta.";
  }
  if (dias < 0) {
    return `Prazo de exclusão indicado vencido há ${Math.abs(dias)} dia(s) na consulta sintética — conferir no Regularize.`;
  }
  const prazoData = parc?.prazoExclusaoIso ? ` (até ${dataHora(parc.prazoExclusaoIso)})` : "";
  if (dias === 0) return `Prazo de exclusão indicado vence hoje na consulta sintética${prazoData}.`;
  return `Prazo de exclusão indicado: ${dias} dia(s) na consulta sintética${prazoData}.`;
}
