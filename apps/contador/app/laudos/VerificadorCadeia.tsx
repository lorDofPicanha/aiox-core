"use client";

/**
 * F1.6 — Botão "verificar cadeia" (client) que dispara verificarCadeia() no SERVIDOR.
 *
 * O verificador (@synkra/contador-trilha-verifier) usa node:crypto e é server-only —
 * por isso a recomputação roda via Server Action (./actions verificarCadeiaTenant),
 * não no bundle do browser. Re-verificação ≠ re-execução (não toca o motor).
 *
 * Recebe o resultado INICIAL já computado no server (primeiro paint, sem clique) e o
 * substitui pelo resultado fresco quando o usuário clica em "verificar cadeia".
 *
 * G6: confirma INTEGRIDADE TÉCNICA da trilha (hash-chain recomputável). Não é prova
 * jurídica plena; o carimbo de tempo formal (ACT ICP-Brasil) é Fase 4.
 */

import { useState, useTransition } from "react";
import type { VerificacaoResultado } from "@synkra/contador-trilha-verifier";
import { StatusBadge } from "@/components/StatusBadge";
import { verificarCadeiaTenant } from "./actions";
import styles from "./laudo.module.css";

export function VerificadorCadeia({
  inicial,
  verifierVersion,
}: {
  inicial: VerificacaoResultado;
  verifierVersion: string;
}) {
  const [resultado, setResultado] = useState<VerificacaoResultado>(inicial);
  const [reverificado, setReverificado] = useState(false);
  const [pending, startTransition] = useTransition();

  function verificar() {
    startTransition(async () => {
      const r = await verificarCadeiaTenant();
      setResultado(r);
      setReverificado(true);
    });
  }

  return (
    <div className={styles.verificador}>
      <div className={styles.verificadorActions}>
        <button
          type="button"
          className={styles.btnVerificar}
          onClick={verificar}
          disabled={pending}
        >
          <span aria-hidden="true">⟳</span>{" "}
          {pending ? "verificando…" : "verificar cadeia"}
        </button>
        <span className="muted" style={{ fontSize: 11 }}>
          Recomputa o hash-chain no servidor. Re-verificação ≠ re-execução.
        </span>
      </div>

      <div className={styles.verificadorResult} role="status" aria-live="polite">
        <p style={{ margin: "0 0 var(--space-2)" }}>
          {resultado.ok ? (
            <StatusBadge view={{ variant: "success", glyph: "✓", label: "Cadeia íntegra" }} />
          ) : (
            <StatusBadge
              view={{ variant: "danger", glyph: "!", label: "Cadeia inconsistente" }}
            />
          )}{" "}
          {reverificado ? (
            <span className="muted" style={{ fontSize: 11 }}>
              reconferido agora
            </span>
          ) : null}
        </p>
        <dl className="verif-dl">
          <div>
            <dt>Eventos verificados</dt>
            <dd className="num mono">{resultado.checked}</dd>
          </div>
          <div>
            <dt>Falhas</dt>
            <dd className="num mono">{resultado.failures.length}</dd>
          </div>
          <div>
            <dt>Verificador</dt>
            <dd className="mono" style={{ fontSize: 11 }}>
              {verifierVersion}
            </dd>
          </div>
          <div>
            <dt>Hash da cabeça</dt>
            <dd className="mono num" style={{ fontSize: 11, wordBreak: "break-all" }}>
              {resultado.headHash ?? "—"}
            </dd>
          </div>
        </dl>
        {!resultado.ok ? (
          <ul className="list-reset" style={{ marginTop: "var(--space-3)" }}>
            {resultado.failures.map((f) => (
              <li key={`${f.seq}-${f.code}`} className="verif-fail">
                <strong className="mono">#{f.seq}</strong> {f.code}: {f.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted" style={{ fontSize: 11, marginTop: "var(--space-2)" }}>
            Integridade técnica confirmada. Prova jurídica plena depende de gates
            posteriores (carimbo de tempo ACT ICP-Brasil — Fase 4).
          </p>
        )}
      </div>
    </div>
  );
}
