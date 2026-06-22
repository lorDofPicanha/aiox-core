"use client";

/**
 * AprovacaoForm — cerimônia graduada de aprovação CRC (F1.4, DESIGN §6.4).
 *
 * O ato é PESADO e individual: para liberar Aprovar/Rejeitar o contador precisa
 * (1) marcar a revisão item-a-item e (2) digitar a confirmação (a palavra CONFIRMO
 * ou o nº do seu CRC). Não há botão de "aprovar em lote" — esta tela decide UM
 * apontamento. A rejeição exige um motivo curado (ck_rejeicao_motivada). A mesma
 * confirmação é re-validada no Server Action (defesa em profundidade).
 *
 * G6: linguagem de indício/revisão humana; nada promete crédito garantido.
 */

import { useActionState, useId, useState } from "react";
import { aprovarAction, rejeitarAction } from "@/app/aprovacao/actions";
import {
  ACAO_INICIAL,
  MOTIVOS_REJEICAO,
  type AcaoState,
} from "@/app/aprovacao/decision-config";
import styles from "@/app/aprovacao/aprovacao.module.css";

interface ContadorView {
  nome: string;
  crc: string;
  crcUf: string | null;
  habilitacao: string;
}

export function AprovacaoForm({
  apontamentoId,
  contador,
  bloqueiaAutoAprovacao,
  produto,
}: {
  apontamentoId: string;
  contador: ContadorView | null;
  bloqueiaAutoAprovacao: boolean;
  produto: string;
}) {
  const [modo, setModo] = useState<"aprovar" | "rejeitar">("aprovar");
  const [revisado, setRevisado] = useState(false);
  const [confirmacao, setConfirmacao] = useState("");
  const [motivo, setMotivo] = useState("");

  const action = modo === "aprovar" ? aprovarAction : rejeitarAction;
  const [state, formAction, pending] = useActionState<AcaoState, FormData>(
    action,
    ACAO_INICIAL,
  );

  const confirmaId = useId();
  const motivoId = useId();
  const textoId = useId();
  const revisaoId = useId();

  // Sem contador habilitado, o ato privativo fica indisponível (honesto).
  if (!contador) {
    return (
      <div className={styles.cerimoniaLocked} role="alert">
        <strong>Ato privativo indisponível.</strong> Nenhum contador com CRC ativo
        neste escritório — a aprovação/rejeição não pode ser exercida.
      </div>
    );
  }

  // Decisão concluída: mostra o carimbo do ato (quem · CRC · habilitação · quando).
  if (state.ok && state.carimbo) {
    const c = state.carimbo;
    const dataHora = new Date(c.quando).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
    const motivoLabel = c.motivoCodigo
      ? MOTIVOS_REJEICAO.find((m) => m.codigo === c.motivoCodigo)?.label ?? c.motivoCodigo
      : null;
    return (
      <div
        className={`${styles.carimbo} ${c.decisao === "aprovado" ? styles.carimboAprovado : styles.carimboRejeitado}`}
        role="status"
        aria-live="polite"
      >
        <div className={styles.carimboHead}>
          <span className={styles.carimboGlyph} aria-hidden="true">
            {c.decisao === "aprovado" ? "✓" : "✕"}
          </span>
          <span>
            {c.decisao === "aprovado" ? "Aprovado" : "Rejeitado"} — ato privativo do
            contador, registrado na trilha de boa-fé.
          </span>
        </div>
        <dl className={styles.carimboDl}>
          <div>
            <dt>Quem</dt>
            <dd>{c.nome}</dd>
          </div>
          <div>
            <dt>CRC</dt>
            <dd className="mono num">
              {c.crc}
              {c.crcUf ? `/${c.crcUf}` : ""}
            </dd>
          </div>
          <div>
            <dt>Habilitação</dt>
            <dd>{c.habilitacao}</dd>
          </div>
          <div>
            <dt>Quando</dt>
            <dd className="num">{dataHora}</dd>
          </div>
          {motivoLabel ? (
            <div>
              <dt>Motivo</dt>
              <dd>{motivoLabel}</dd>
            </div>
          ) : null}
        </dl>
        <p className={styles.carimboNota}>
          O evento foi anexado à <a href="/trilha">trilha de boa-fé</a> (hash-chain
          verificável). Esta tela agora é somente leitura para este indício.
        </p>
      </div>
    );
  }

  const motivoOk = modo === "rejeitar" ? motivo.length > 0 : true;
  const podeAssinar = revisado && confirmacao.trim().length > 0 && motivoOk;

  return (
    <form action={formAction} className={styles.cerimonia}>
      <input type="hidden" name="apontamentoId" value={apontamentoId} />

      <div className={styles.cerimoniaToggle} role="radiogroup" aria-label="Decisão">
        <button
          type="button"
          role="radio"
          aria-checked={modo === "aprovar"}
          className={`${styles.toggleBtn} ${modo === "aprovar" ? styles.toggleActive : ""}`}
          onClick={() => setModo("aprovar")}
        >
          <span aria-hidden="true">✓</span> Aprovar
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={modo === "rejeitar"}
          className={`${styles.toggleBtn} ${modo === "rejeitar" ? styles.toggleActive : ""}`}
          onClick={() => setModo("rejeitar")}
        >
          <span aria-hidden="true">✕</span> Rejeitar
        </button>
      </div>

      {bloqueiaAutoAprovacao ? (
        <p className={styles.bloqueio} role="note">
          <strong>Revisar antes de aprovar.</strong> Indício de baixa confiança /
          em disputa — <strong>auto-aprovação bloqueada</strong> (DESIGN §6.3). A
          decisão exige revisão humana explícita abaixo.
        </p>
      ) : null}

      {/* Passo 1 — revisão item-a-item (cerimônia graduada). */}
      <label className={styles.revisaoCheck} htmlFor={revisaoId}>
        <input
          id={revisaoId}
          type="checkbox"
          checked={revisado}
          onChange={(e) => setRevisado(e.target.checked)}
        />
        <span>
          Revisei <strong>este apontamento</strong> ({produto}) item-a-item —
          produto, NCM, cClassTrib aplicado vs. referência, natureza da divergência,
          confiança e base normativa.
        </span>
      </label>

      {/* Passo 2 — motivo curado (só na rejeição). */}
      {modo === "rejeitar" ? (
        <div className={styles.campo}>
          <label htmlFor={motivoId} className={styles.label}>
            Motivo da rejeição <span aria-hidden="true">*</span>
            <span className={styles.labelHint}> (rejeição motivada — obrigatório)</span>
          </label>
          <select
            id={motivoId}
            name="motivoCodigo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className={styles.select}
            required
          >
            <option value="">— selecione um motivo —</option>
            {MOTIVOS_REJEICAO.map((m) => (
              <option key={m.codigo} value={m.codigo}>
                {m.label}
              </option>
            ))}
          </select>
          <label htmlFor={textoId} className={styles.label} style={{ marginTop: 10 }}>
            Detalhe (opcional)
          </label>
          <textarea
            id={textoId}
            name="motivoTexto"
            rows={2}
            className={styles.textarea}
            placeholder="Complemento livre do motivo (opcional)."
          />
        </div>
      ) : null}

      {/* Passo 3 — confirmação pesada (digitar para confirmar). */}
      <div className={styles.campo}>
        <label htmlFor={confirmaId} className={styles.label}>
          Confirmação do ato <span aria-hidden="true">*</span>
          <span className={styles.labelHint}>
            {" "}
            digite <code>CONFIRMO</code> ou o número do seu CRC ({contador.crc})
          </span>
        </label>
        <input
          id={confirmaId}
          name="confirmacao"
          type="text"
          autoComplete="off"
          value={confirmacao}
          onChange={(e) => setConfirmacao(e.target.value)}
          className={styles.confirmInput}
          placeholder="CONFIRMO"
          aria-describedby={`${confirmaId}-hint`}
        />
        <p id={`${confirmaId}-hint`} className={styles.assinaturaLinha}>
          Assina como <strong>{contador.nome}</strong> · CRC{" "}
          <span className="mono num">
            {contador.crc}
            {contador.crcUf ? `/${contador.crcUf}` : ""}
          </span>{" "}
          · {contador.habilitacao}.
        </p>
      </div>

      {state.message && !state.ok ? (
        <p className={styles.erro} role="alert">
          {state.message}
        </p>
      ) : null}

      <div className={styles.acoes}>
        <button
          type="submit"
          disabled={!podeAssinar || pending}
          className={`${styles.btnAct} ${modo === "aprovar" ? styles.btnAprovar : styles.btnRejeitar}`}
        >
          {pending
            ? "Registrando…"
            : modo === "aprovar"
              ? "Assinar e aprovar este indício"
              : "Assinar e rejeitar este indício"}
        </button>
        <span className={styles.acoesNota}>
          Decisão individual · não há aprovação em lote nesta tela.
        </span>
      </div>
    </form>
  );
}
