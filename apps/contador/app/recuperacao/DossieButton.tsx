"use client";

/**
 * Botão "gerar dossiê de evidências" (DEMO — synthetic).
 *
 * Não executa nada real: simula a montagem do dossiê e mostra um aviso honesto de que
 * o software entrega o DOSSIÊ, mas quem analisa e assina a PER/DCOMP é o tributarista
 * habilitado (D6 — execução real na Fase 7). G6: nenhuma promessa de resultado.
 *
 * Auto-contido em app/recuperacao/: reusa apenas as classes/tokens globais do CSS,
 * mais o CSS module local. Não toca componentes nem libs compartilhadas.
 */
import { useState } from "react";
import styles from "./recuperacao.module.css";

type Estado = "idle" | "gerando" | "pronto";

export function DossieButton({
  clienteNome,
  indicios,
}: {
  clienteNome: string;
  indicios: number;
}) {
  const [estado, setEstado] = useState<Estado>("idle");

  function gerar() {
    if (estado === "gerando") return;
    setEstado("gerando");
    // Demo: simula a montagem do dossiê (synthetic). Nenhuma chamada real.
    setTimeout(() => setEstado("pronto"), 700);
  }

  return (
    <div className={styles.dossie}>
      <button
        type="button"
        className={styles.dossieBtn}
        onClick={gerar}
        disabled={estado === "gerando"}
      >
        <span aria-hidden="true">▤</span>
        {estado === "gerando" ? "Montando dossiê…" : "Gerar dossiê de evidências (demo)"}
      </button>

      {estado === "pronto" ? (
        <p className={styles.dossiePronto} role="status">
          <span aria-hidden="true">✓</span> Dossiê demo montado para <strong>{clienteNome}</strong>{" "}
          ({indicios} indício(s) organizados). É uma demonstração com base sintética: o
          dossiê reúne evidências técnicas para revisão. Quem analisa e assina a PER/DCOMP é o
          tributarista habilitado (Fase 7).
        </p>
      ) : null}
    </div>
  );
}
