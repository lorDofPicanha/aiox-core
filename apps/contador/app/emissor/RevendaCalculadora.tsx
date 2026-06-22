"use client";

/**
 * RevendaCalculadora — calculadora interativa do modelo de revenda do emissor.
 *
 * O contador compra um PACOTE de emissores e revende aos clientes dele. Aqui ele
 * mexe em (nº de emissores) × (preço de revenda/mês) e vê receita, custo do pacote
 * (escalonado por volume) e margem ilustrativa atualizarem ao vivo. Autocontido em
 * app/emissor/ — não toca lib/* nem outros módulos.
 *
 * G6 / honestidade: os números são EXEMPLO COMERCIAL, não um preço fechado. O preço
 * real escala por volume de nota / nº de CNPJ e é definido na contratação.
 */

import { useId, useMemo, useState } from "react";
import { brl, pct } from "@/lib/format";
import {
  REVENDA_LIMITES,
  calcularRevenda,
  custoPacotePorEmissores,
} from "./emissor-model";
import styles from "./emissor.module.css";

export function RevendaCalculadora() {
  const [emissores, setEmissores] = useState(5);
  const [precoRevenda, setPrecoRevenda] = useState(50);

  const emissoresId = useId();
  const precoId = useId();

  const custo = useMemo(() => custoPacotePorEmissores(emissores), [emissores]);
  const res = useMemo(
    () => calcularRevenda(emissores, precoRevenda, custo),
    [emissores, precoRevenda, custo],
  );

  const margemPositiva = res.margem >= 0;

  return (
    <div className={styles.calc}>
      <div className={styles.calcCampo}>
        <label htmlFor={emissoresId} className={styles.calcLabel}>
          <span>Emissores no pacote</span>
          <span className="num" style={{ fontWeight: 700 }}>
            {emissores}
          </span>
        </label>
        <input
          id={emissoresId}
          type="range"
          className={styles.calcRange}
          min={REVENDA_LIMITES.emissores.min}
          max={REVENDA_LIMITES.emissores.max}
          step={REVENDA_LIMITES.emissores.passo}
          value={emissores}
          onChange={(e) => setEmissores(Number(e.target.value))}
        />
      </div>

      <div className={styles.calcCampo}>
        <label htmlFor={precoId} className={styles.calcLabel}>
          <span>Revende cada por (mês)</span>
          <span className="num" style={{ fontWeight: 700 }}>
            {brl(precoRevenda)}
          </span>
        </label>
        <input
          id={precoId}
          type="range"
          className={styles.calcRange}
          min={REVENDA_LIMITES.precoRevenda.min}
          max={REVENDA_LIMITES.precoRevenda.max}
          step={REVENDA_LIMITES.precoRevenda.passo}
          value={precoRevenda}
          onChange={(e) => setPrecoRevenda(Number(e.target.value))}
        />
      </div>

      <div className={styles.revendaQuadro}>
        <div className={styles.revendaLinha}>
          <span>Custo do pacote (escalonado)</span>
          <span className="num">{brl(custo)}/mês</span>
        </div>
        <div className={styles.revendaLinha}>
          <span>Receita de revenda</span>
          <span className="num">{brl(res.receitaRevenda)}/mês</span>
        </div>
        <div className={`${styles.revendaLinha} ${styles.revendaMargem}`}>
          <span>Margem ilustrativa</span>
          <span className="num">{brl(res.margem)}/mês</span>
        </div>
        <div className={styles.revendaLinha}>
          <span>Margem por emissor</span>
          <span className="num">
            {brl(res.margemPorEmissor)}/mês
            {margemPositiva ? (
              <span className="muted"> · {pct(res.margemPercentual)}</span>
            ) : null}
          </span>
        </div>
      </div>

      {!margemPositiva ? (
        <p className={styles.calcAlerta} role="note">
          Neste cenário o preço de revenda não cobre o custo do pacote — ajuste o preço ou
          o volume. (Exemplo ilustrativo.)
        </p>
      ) : null}

      <p className={styles.revendaNota}>
        Exemplo comercial. Preços reais escalam por volume de nota / nº de CNPJ e serão
        definidos na contratação.
      </p>
    </div>
  );
}
