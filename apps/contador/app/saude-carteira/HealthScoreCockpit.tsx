"use client";

/**
 * S12 — Cockpit interativo da carteira por Health Score (cliente). Tabela data-dense com o
 * ranking por risco (pior score primeiro) + drill-down do BREAKDOWN por cliente: o que está
 * puxando o score pra baixo, separado por lado (auditoria do core × situação fiscal do e-CAC),
 * com peso e número-fonte de cada fator.
 *
 * Client component fino: recebe os scores JÁ CALCULADOS pelo engine puro (server) e só cuida da
 * interação (abrir/fechar o breakdown). Nenhuma regra de score aqui — só apresentação.
 *
 * G6: nada afirma "regularizado/em dia/sem risco". O score é um INDICADOR DE ATENÇÃO; a banda
 * "Saudável" significa "poucos indícios na leitura", não "situação fiscal garantida".
 */
import { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { brl } from "@/lib/format";
import type { StatusView } from "@/lib/status";
import type { HealthScoreCliente, LadoFator } from "./health-score-model";
import styles from "./saude-carteira.module.css";

const LADO_ROTULO: Record<LadoFator, string> = {
  core: "Auditoria (core) — cClassTrib / indícios",
  ecac: "Situação fiscal (e-CAC) — caixa postal / CNDs",
};

/** Banda como mostrada na tela + chave da classe de cor + hint. */
interface BandaExibida {
  view: StatusView;
  hint: string;
  key: string;
}

/**
 * Banda EXIBIDA (🟡-2): quando o score considera só UM lado (semLadoEcac/semLadoCore), um
 * "Saudável" verde seria enganoso — a outra metade não foi lida/reconciliada. Rebaixa a
 * APRESENTAÇÃO desse caso para uma banda neutra "Parcial" (número e badge não vendem
 * confiança verde). Atenção/Crítico já mostram preocupação e ficam como estão; o caso perigoso
 * é só o falso-verde. NÃO altera o score nem a banda do engine — é só apresentação honesta.
 */
function bandaExibida(c: HealthScoreCliente): BandaExibida {
  const parcial = c.semLadoEcac || c.semLadoCore;
  if (parcial && c.banda.banda === "saudavel") {
    return {
      view: { variant: "neutral", glyph: "◐", label: "Parcial" },
      hint: c.semLadoEcac
        ? "Score considera só a auditoria do core — a situação fiscal (e-CAC) deste cliente não foi reconciliada. Não conclua situação saudável."
        : "Score considera só a situação fiscal (e-CAC) — sem contraparte de auditoria no core. Não conclua situação saudável.",
      key: "parcial",
    };
  }
  return { view: c.banda, hint: c.banda.hint, key: c.banda.banda };
}

/** Formata o número-fonte de um fator para leitura (ocorrências vs R$). */
function valorFonteLegivel(valorFonte: number, unidade: "ocorrencias" | "reais"): string {
  if (unidade === "reais") return brl(valorFonte);
  return `${valorFonte} ocorrência${valorFonte === 1 ? "" : "s"}`;
}

function Breakdown({ cliente }: { cliente: HealthScoreCliente }) {
  if (cliente.breakdown.length === 0) {
    return (
      <p className={styles.semFatores}>
        Nenhum indício de atenção na leitura cross-módulo deste cliente. O score é um indicador —
        não atesta situação fiscal; a revisão segue sendo do contador.
      </p>
    );
  }

  // Agrupa por lado, preservando a ordem (maior impacto primeiro) dentro de cada lado.
  const porLado: Record<LadoFator, typeof cliente.breakdown> = { core: [], ecac: [] };
  for (const f of cliente.breakdown) porLado[f.lado].push(f);

  return (
    <div className={styles.breakdownGrid}>
      {(["core", "ecac"] as LadoFator[]).map((lado) =>
        porLado[lado].length === 0 ? null : (
          <div key={lado} className={styles.breakdownLado}>
            <h4 className={styles.breakdownLadoTitulo}>{LADO_ROTULO[lado]}</h4>
            <ul className={styles.fatorList}>
              {porLado[lado].map((f) => (
                <li key={f.id} className={styles.fatorRow}>
                  <span className={styles.fatorRotulo}>{f.rotulo}</span>
                  <span className={styles.fatorFonte}>
                    {valorFonteLegivel(f.valorFonte, f.unidade)}
                  </span>
                  <span className={`num ${styles.fatorPontos}`} title="Pontos subtraídos do score">
                    −{Math.round(f.pontosSubtraidos)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ),
      )}
    </div>
  );
}

export function HealthScoreCockpit({ scores }: { scores: HealthScoreCliente[] }) {
  const [aberto, setAberto] = useState<string | null>(null);

  if (scores.length === 0) {
    return <p className="muted">Nenhum cliente na carteira para pontuar.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="tbl">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Score de exposição</th>
            <th>Banda</th>
            <th className="num">Materialidade / fatores</th>
            <th aria-label="Ações" />
          </tr>
        </thead>
        <tbody>
          {scores.map((c) => {
            const isAberto = aberto === c.clienteId;
            const banda = bandaExibida(c);
            const rowClass =
              banda.key === "critico" ? "risco" : banda.key === "atencao" ? "revisar" : "";
            return (
              <FragmentRow
                key={c.clienteId}
                cliente={c}
                banda={banda}
                aberto={isAberto}
                rowClass={rowClass}
                onToggle={() => setAberto(isAberto ? null : c.clienteId)}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function FragmentRow({
  cliente,
  banda,
  aberto,
  rowClass,
  onToggle,
}: {
  cliente: HealthScoreCliente;
  banda: BandaExibida;
  aberto: boolean;
  rowClass: string;
  onToggle: () => void;
}) {
  // nº de fatores de impacto (proxy de "quantas frentes puxam o score").
  const nFatores = cliente.breakdown.length;
  return (
    <>
      <tr className={rowClass}>
        <td>
          <div className={styles.cli}>
            <span className={styles.cliNome}>{cliente.clienteNome}</span>
            <span className={styles.cliDoc}>
              {cliente.documento || "—"}
              {cliente.semLadoEcac ? (
                <span className={styles.tagSemLado} title="Sem leitura e-CAC reconciliada para este cliente">
                  · só auditoria
                </span>
              ) : null}
              {cliente.semLadoCore ? (
                <span className={styles.tagSemLado} title="Sem contraparte no core (apenas e-CAC)">
                  · só e-CAC
                </span>
              ) : null}
            </span>
          </div>
        </td>
        <td>
          <div className={styles.scoreCell}>
            <span className={`num ${styles.scoreNum} ${styles[`score_${banda.key}`]}`}>
              {cliente.score}
            </span>
            <div className={styles.scoreBarTrack} aria-hidden="true">
              <span
                className={`${styles.scoreBarFill} ${styles[`fill_${banda.key}`]}`}
                style={{ width: `${cliente.score}%` }}
              />
            </div>
          </div>
        </td>
        <td>
          <StatusBadge view={banda.view} />
        </td>
        <td className="num">
          {nFatores > 0 ? `${nFatores} fator${nFatores === 1 ? "" : "es"}` : "—"}
        </td>
        <td className="num">
          <button
            type="button"
            className={styles.btnAbrir}
            onClick={onToggle}
            aria-expanded={aberto}
          >
            {aberto ? "Fechar" : "Ver breakdown"}
          </button>
        </td>
      </tr>
      {aberto ? (
        <tr className={styles.detalheRow}>
          <td colSpan={5}>
            <div className={styles.detalhe}>
              <div className={styles.detalheHead}>
                <StatusBadge view={banda.view} />
                <span className={styles.detalheHint}>{banda.hint}</span>
              </div>
              <Breakdown cliente={cliente} />
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}
