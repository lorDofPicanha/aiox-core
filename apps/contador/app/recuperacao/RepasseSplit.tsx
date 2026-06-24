"use client";

/**
 * RepasseSplit — card de DISTRIBUIÇÃO DO ÊXITO em VALORES ABSOLUTOS (overlay Recuperação).
 *
 * Substitui a calculadora ilustrativa 70/15/15 pela visão multi-parte recomendada na
 * pesquisa `docs/projects/contador/55-feature-research/10-comissionamento-repasse-ux.md`
 * (§3.2). Princípios de UI aplicados:
 *   - VALOR ABSOLUTO em destaque (o número-herói); % como legenda secundária.
 *   - Ordem: empresa cliente (herói, o valor que volta) → você/escritório (destaque visual,
 *     é o usuário) → indicador → plataforma (por último e magra — sinaliza que não extraímos do canal).
 *   - Slider opcional para "e se o êxito fosse X?" — recalcula tudo em tempo real (demo navegável).
 *   - Disclaimer G6 sempre presente (no êxito / estimativa / tributarista assina / faturado em separado).
 *
 * COSIT 107/2024 (§4 do doc 10): a restituição (RT) vai DIRETO ao cliente; o honorário é
 * faturado em SEPARADO. Deixado explícito na UI (selo + legenda).
 *
 * Selo de pendência (§2.3 / C10.8): a base do fee da plataforma = sobre o SUCCESS-FEE
 * (Interpretação B), pendente confirmação founder/Renan. Sinalizado discretamente na UI.
 *
 * 100% client-side, base SINTÉTICA, sem persistência. Reusa Card/StatusBadge + CSS module
 * local. Não toca lib/, packages/*, globals.css nem Nav.tsx (CONSTRAINT autocontido).
 */

import { useId, useMemo, useState } from "react";
import { brl } from "@/lib/format";
import {
  CONFIG_REPASSE_PADRAO,
  calcularRepasse,
  pctLegenda,
  type ConfigRepasse,
  type FatiaRepasse,
} from "./repasse-model";
import styles from "./recuperacao.module.css";

export function RepasseSplit({
  baseInicial,
  config = CONFIG_REPASSE_PADRAO,
}: {
  /** Valor recuperado inicial (estimativa do caso — ilustrativa). */
  baseInicial: number;
  /** Config do split (constante na Fase 1; estruturada p/ virar config por contrato/caso). */
  config?: ConfigRepasse;
}) {
  const [base, setBase] = useState(baseInicial);
  const inputId = useId();
  const rangeId = useId();

  // Limites do slider em torno da estimativa do caso (faixa ilustrativa).
  const min = 0;
  const max = Math.max(10_000, Math.ceil((baseInicial * 1.5) / 1000) * 1000);

  const resultado = useMemo(() => calcularRepasse(base, config), [base, config]);

  return (
    <div className={styles.repasseBox}>
      <div className={styles.repasseHead}>
        <span className={styles.repasseTitulo}>Distribuição do êxito</span>
        <span className={styles.repasseSeloPend} title="Base do fee da plataforma sob revisão">
          base: sobre o success-fee · a confirmar
        </span>
      </div>
      <p className={styles.repasseSub}>
        Quanto cada parte recebe <strong>no êxito</strong>, em valores absolutos. Os números
        são <strong>estimativas ilustrativas</strong> sobre base sintética — não são promessa
        de valor. O success-fee só existe quando a restituição é confirmada.
      </p>

      {/* Slider "e se o êxito fosse X?" — recalcula tudo em tempo real (demo). */}
      <div className={styles.calcCampo}>
        <label htmlFor={inputId} className={styles.calcLabel}>
          Valor recuperado hipotético (R$, sem centavos)
        </label>
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          className={styles.calcInput}
          value={resultado.valorRecuperado.toLocaleString("pt-BR")}
          onChange={(e) => {
            const n = Number(e.target.value.replace(/\D/g, ""));
            setBase(Number.isFinite(n) ? n : 0);
          }}
          aria-describedby={rangeId}
        />
        <input
          id={rangeId}
          type="range"
          className={styles.calcRange}
          min={min}
          max={max}
          step={500}
          value={Math.min(resultado.valorRecuperado, max)}
          onChange={(e) => setBase(Number(e.target.value))}
          aria-label="Ajustar valor recuperado hipotético"
        />
      </div>

      {/* Guarda de escritório-negativo (§5.1): bloqueia/alerta config tóxica. */}
      {!resultado.valido ? (
        <p className={styles.repasseAlerta} role="alert">
          <span aria-hidden="true">⚠</span> {resultado.alerta}
        </p>
      ) : (
        <ul className={styles.repasseFatias}>
          {resultado.fatias.map((f) => (
            <FatiaLinha key={f.papel} fatia={f} />
          ))}
        </ul>
      )}

      {/* Linha-resumo do success-fee total (o bolo do qual saem as fatias internas). */}
      <div className={styles.repasseTotal}>
        <span className="muted" style={{ fontSize: 11 }}>
          Honorário de êxito (success-fee total){" "}
          <span className="muted">· {pctLegenda(resultado.config.successFeeTotalPct)} do recuperado</span>
        </span>
        <span className={`num ${styles.repasseTotalValor}`}>{brl(resultado.successFeeTotal)}</span>
      </div>

      {/* COSIT 107/2024 + disclaimer G6 — sempre presente. */}
      <p className={styles.repasseNota}>
        <span aria-hidden="true">ⓘ</span> A restituição (RT) vai <strong>direto ao cliente</strong>;
        o honorário de êxito é <strong>faturado em separado</strong> (COSIT 107/2024), em linha
        própria, fora da mensalidade recorrente. Valores ilustrativos sobre base sintética ·
        success-fee só <strong>no êxito</strong> · o tributarista habilitado é quem analisa e
        assina a PER/DCOMP.
      </p>
    </div>
  );
}

/** Uma linha do split: valor absoluto em destaque (herói) + rótulo + % como legenda. */
function FatiaLinha({ fatia }: { fatia: FatiaRepasse }) {
  return (
    <li className={`${styles.repasseFatia} ${fatia.destaque ? styles.repasseFatiaDestaque : ""}`}>
      <div className={styles.repasseFatiaIdent}>
        <span className={styles.repasseFatiaRotulo}>{fatia.rotulo}</span>
        <span className={styles.repasseFatiaDesc}>{fatia.descricao}</span>
      </div>
      <div className={styles.repasseFatiaValores}>
        <span className={`num ${styles.repasseFatiaValor}`}>{brl(fatia.valor)}</span>
        <span className={styles.repasseFatiaPct}>{pctLegenda(fatia.pctDoRecuperado)}</span>
      </div>
    </li>
  );
}
