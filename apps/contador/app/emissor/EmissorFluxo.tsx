"use client";

/**
 * EmissorFluxo — fluxo de emissão guiado de NFS-e (demo navegável, autocontido).
 *
 * Passos: (1) escolher cliente → (2) descrever o serviço + valor → (3) o sistema
 * SUGERE cClassTrib/tributação + roda a AUTO-AUDITORIA (✓ confere / ⚠ revisar) →
 * (4) o contador CONFIRMA (ato humano, espelha a cerimônia do AprovacaoForm do core:
 * exige uma confirmação explícita — digitar CONFIRMO ou o CRC) → "emitir" gera um
 * RASCUNHO de DANFSe SINTÉTICO (preview honesto; NÃO emite de verdade).
 *
 * 100% client-side e sem persistência: é uma demonstração. Não chama Server Actions,
 * não toca lib/api.ts nem packages/* — todo o estado vive aqui (CONSTRAINT autocontido).
 *
 * G6: a tributação é SUGERIDA e SUJEITA À CONFIRMAÇÃO do contador. Nada promete
 * "tributação correta" / "apuração correta" — é um indício auto-auditado, revisado
 * por humano, e o resultado é um rascunho de demonstração.
 */

import { useId, useMemo, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { brl, pct } from "@/lib/format";
import {
  CLIENTES_EMISSOR,
  CONTADOR_DEMO,
  clienteEmissorById,
  sugerirTributacao,
  type SugestaoTributaria,
} from "./emissor-model";
import styles from "./emissor.module.css";

type Etapa = "dados" | "sugestao" | "confirmado";

export function EmissorFluxo() {
  const [clienteId, setClienteId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valorTexto, setValorTexto] = useState("");
  const [etapa, setEtapa] = useState<Etapa>("dados");
  const [sugestao, setSugestao] = useState<SugestaoTributaria | null>(null);
  const [revisado, setRevisado] = useState(false);
  const [confirmacao, setConfirmacao] = useState("");
  const [numeroRascunho, setNumeroRascunho] = useState<string | null>(null);

  const clienteSelId = useId();
  const descId = useId();
  const valorId = useId();
  const revisaoId = useId();
  const confirmaId = useId();

  const cliente = clienteEmissorById(clienteId);
  const valor = useMemo(() => {
    const n = Number(valorTexto.replace(/\./g, "").replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }, [valorTexto]);

  const dadosOk = Boolean(cliente) && descricao.trim().length >= 3 && valor > 0;

  function gerarSugestao() {
    if (!cliente || !dadosOk) return;
    setSugestao(sugerirTributacao(cliente, descricao, valor));
    setRevisado(false);
    setConfirmacao("");
    setEtapa("sugestao");
  }

  function confirmarEEmitir() {
    if (!cliente) return;
    // Número de rascunho sintético determinístico (sem persistência real).
    const seq = String(120 + Math.floor(valor) % 800).padStart(6, "0");
    setNumeroRascunho(`DEMO-2026-${seq}`);
    setEtapa("confirmado");
  }

  function recomecar() {
    setClienteId("");
    setDescricao("");
    setValorTexto("");
    setSugestao(null);
    setRevisado(false);
    setConfirmacao("");
    setNumeroRascunho(null);
    setEtapa("dados");
  }

  const podeConfirmar = revisado && confirmacao.trim().length > 0;

  // ---- Etapa 3: rascunho de DANFSe sintético (preview honesto) ----
  if (etapa === "confirmado" && cliente && sugestao && numeroRascunho) {
    const dataHora = new Date().toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
    return (
      <div className={styles.danfse} role="status" aria-live="polite">
        <div className={styles.danfseHead}>
          <span className={styles.danfseGlyph} aria-hidden="true">
            ▤
          </span>
          <div>
            <strong>Rascunho de DANFSe gerado (demonstração).</strong>
            <p className={styles.danfseSub}>
              Pré-visualização sintética — <strong>não foi transmitida</strong> a nenhum
              fisco. A emissão real chega na Fase 7 (credenciamento ADN / NFS-e Nacional).
            </p>
          </div>
        </div>

        <dl className={styles.danfseDl}>
          <div>
            <dt>Número (rascunho)</dt>
            <dd className="mono num">{numeroRascunho}</dd>
          </div>
          <div>
            <dt>Tomador / cliente</dt>
            <dd>{cliente.nome}</dd>
          </div>
          <div>
            <dt>Município de competência</dt>
            <dd>{cliente.municipio}</dd>
          </div>
          <div>
            <dt>Serviço</dt>
            <dd>{descricao}</dd>
          </div>
          <div>
            <dt>Valor do serviço</dt>
            <dd className="num" style={{ fontWeight: 700 }}>
              {brl(valor)}
            </dd>
          </div>
          <div>
            <dt>cClassTrib (sugerido)</dt>
            <dd className="mono num">{sugestao.cclasstrib}</dd>
          </div>
          <div>
            <dt>Item de serviço</dt>
            <dd className="mono">{sugestao.itemServico}</dd>
          </div>
          <div>
            <dt>Tributos estimados</dt>
            <dd className="num">
              {brl(valor * sugestao.aliquotaEstimada)}{" "}
              <span className="muted">({pct(sugestao.aliquotaEstimada)})</span>
            </dd>
          </div>
          <div>
            <dt>Confirmado por (ato humano)</dt>
            <dd>
              {CONTADOR_DEMO.nome} · <span className="mono">CRC {CONTADOR_DEMO.crc}</span>
            </dd>
          </div>
          <div>
            <dt>Gerado em</dt>
            <dd className="num">{dataHora}</dd>
          </div>
        </dl>

        <p className={styles.danfseNota}>
          A tributação acima foi <strong>sugerida pelo motor</strong> e{" "}
          <strong>confirmada pelo contador</strong> — é um indício auto-auditado, não uma
          apuração definitiva. Demonstração com base sintética.
        </p>

        <button type="button" className={styles.btnSecundario} onClick={recomecar}>
          ✎ Emitir outro (demo)
        </button>
      </div>
    );
  }

  return (
    <form
      className={styles.fluxo}
      onSubmit={(e) => {
        e.preventDefault();
        if (etapa === "dados") gerarSugestao();
        else if (podeConfirmar) confirmarEEmitir();
      }}
    >
      {/* ---- Passo 1: cliente ---- */}
      <div className={styles.campo}>
        <label htmlFor={clienteSelId} className={styles.label}>
          1 · Cliente (tomador) <span aria-hidden="true">*</span>
        </label>
        <select
          id={clienteSelId}
          className={styles.select}
          value={clienteId}
          onChange={(e) => {
            setClienteId(e.target.value);
            setEtapa("dados");
            setSugestao(null);
          }}
          required
        >
          <option value="">— selecione um cliente demo —</option>
          {CLIENTES_EMISSOR.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
        {cliente ? (
          <p className={styles.clienteInfo}>
            {cliente.regime} · {cliente.ramo} · {cliente.municipio}
          </p>
        ) : null}
      </div>

      {/* ---- Passo 2: descrição + valor ---- */}
      <div className={styles.campo}>
        <label htmlFor={descId} className={styles.label}>
          2 · Descrição do serviço <span aria-hidden="true">*</span>
        </label>
        <textarea
          id={descId}
          className={styles.textarea}
          rows={2}
          value={descricao}
          onChange={(e) => {
            setDescricao(e.target.value);
            setEtapa("dados");
            setSugestao(null);
          }}
          placeholder="Ex.: Manutenção de equipamento de refrigeração"
          required
        />
      </div>

      <div className={styles.campo}>
        <label htmlFor={valorId} className={styles.label}>
          Valor do serviço (R$) <span aria-hidden="true">*</span>
        </label>
        <input
          id={valorId}
          type="text"
          inputMode="decimal"
          className={styles.input}
          value={valorTexto}
          onChange={(e) => {
            setValorTexto(e.target.value);
            setEtapa("dados");
            setSugestao(null);
          }}
          placeholder="1.240,00"
          required
        />
      </div>

      {etapa === "dados" ? (
        <button type="submit" className={styles.btnPrimario} disabled={!dadosOk}>
          Sugerir tributação e auto-auditar →
        </button>
      ) : null}

      {/* ---- Passo 3: sugestão + auto-auditoria + confirmação humana ---- */}
      {etapa !== "dados" && sugestao ? (
        <>
          <div className={styles.sugestaoBox}>
            <div className={styles.sugestaoHead}>
              <span className={styles.sugestaoTitle}>Tributação sugerida pelo motor</span>
              <StatusBadge
                view={
                  sugestao.autoAuditoria === "confere"
                    ? { variant: "success", glyph: "✓", label: "Auto-auditoria: confere" }
                    : { variant: "warning", glyph: "!", label: "Auto-auditoria: revisar" }
                }
              />
            </div>

            <dl className={styles.sugestaoDl}>
              <div>
                <dt>cClassTrib</dt>
                <dd className="mono num">{sugestao.cclasstrib}</dd>
              </div>
              <div>
                <dt>Enquadramento</dt>
                <dd>{sugestao.enquadramento}</dd>
              </div>
              <div>
                <dt>Item de serviço</dt>
                <dd className="mono">{sugestao.itemServico}</dd>
              </div>
              <div>
                <dt>Tributos estimados</dt>
                <dd className="num">
                  {brl(valor * sugestao.aliquotaEstimada)}{" "}
                  <span className="muted">({pct(sugestao.aliquotaEstimada)})</span>
                </dd>
              </div>
            </dl>

            <p
              className={
                sugestao.autoAuditoria === "confere"
                  ? styles.auditConfere
                  : styles.auditRevisar
              }
              role="note"
            >
              <strong>
                {sugestao.autoAuditoria === "confere"
                  ? "✓ A sugestão bate com a base de referência."
                  : "⚠ A sugestão diverge da base de referência."}
              </strong>{" "}
              {sugestao.autoAuditoriaNota}
            </p>

            <ul className={styles.fundamentoList}>
              {sugestao.fundamento.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          {/* Confirmação humana (espelha a cerimônia do AprovacaoForm). */}
          <div className={styles.confirmacaoBox}>
            <p className={styles.confirmacaoTitulo}>
              4 · Confirmação do contador <span aria-hidden="true">*</span>
            </p>
            <p className={styles.confirmacaoSub}>
              A tributação acima é uma <strong>sugestão sujeita à confirmação</strong> do
              contador. O ato é humano — sem esta confirmação nada é emitido.
            </p>

            <label className={styles.revisaoCheck} htmlFor={revisaoId}>
              <input
                id={revisaoId}
                type="checkbox"
                checked={revisado}
                onChange={(e) => setRevisado(e.target.checked)}
              />
              <span>
                Revisei a tributação sugerida — cClassTrib, item de serviço, valor e o
                resultado da auto-auditoria{" "}
                {sugestao.autoAuditoria === "revisar" ? (
                  <strong>(divergência marcada para revisar)</strong>
                ) : null}
                .
              </span>
            </label>

            <label htmlFor={confirmaId} className={styles.label}>
              Confirmação do ato
              <span className={styles.labelHint}>
                {" "}
                digite <code>CONFIRMO</code> ou o número do seu CRC ({CONTADOR_DEMO.crc})
              </span>
            </label>
            <input
              id={confirmaId}
              type="text"
              autoComplete="off"
              className={styles.confirmInput}
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              placeholder="CONFIRMO"
            />
            <p className={styles.assinaturaLinha}>
              Assina como <strong>{CONTADOR_DEMO.nome}</strong> · CRC{" "}
              <span className="mono num">{CONTADOR_DEMO.crc}</span> ·{" "}
              {CONTADOR_DEMO.habilitacao}.
            </p>

            <div className={styles.acoes}>
              <button type="submit" className={styles.btnPrimario} disabled={!podeConfirmar}>
                ▤ Confirmar e gerar rascunho (demo)
              </button>
              <button type="button" className={styles.btnSecundario} onClick={recomecar}>
                Cancelar
              </button>
            </div>
          </div>
        </>
      ) : null}
    </form>
  );
}
