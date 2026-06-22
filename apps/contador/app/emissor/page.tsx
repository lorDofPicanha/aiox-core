/**
 * EMISSOR de NFS-e (módulo #4 · CONTEXT §3) — add-on / gancho de margem (revenda).
 *
 * Tela autocontida (dados sintéticos em app/emissor/), demo navegável. Estrutura:
 *  1. Subtítulo curto em português simples + selo de honestidade (não emite de verdade).
 *  2. Fluxo de emissão guiado (EmissorFluxo, client): cliente → serviço (catálogo) +
 *     valor → o sistema SUGERE cClassTrib/tributação → AUTO-AUDITORIA item a item
 *     (✓ confere / ⚠ revisar + porquê) → o contador CONFIRMA (ato humano) → gera um
 *     RASCUNHO de DANFSe sintético (prestador/tomador/serviço/valores/tributos).
 *  3. Painel de revenda interativo (calculadora: pacote × preço → margem ilustrativa).
 *  4. Lista de notas emitidas — emissões da SESSÃO entram na hora; KPIs atualizam.
 *
 * O estado partilhado (2 + 4) vive em EmissorApp (client). Esta página é Server
 * Component: monta o cabeçalho, os selos de honestidade e o disclaimer G6.
 *
 * G6 (doc 45): a tributação é SUGERIDA, sujeita à confirmação do contador. Nunca
 * "tributação correta" / "apuração correta" / "crédito garantido": indício
 * auto-auditado + revisão humana + base sintética (Fase 1). Emissão real = Fase 7.
 *
 * Server Component; NÃO toca lib/api.ts, components/*, globals.css, Nav.tsx nem
 * outros módulos — reusa Card/StatusBadge/Table e os tokens globais por leitura.
 */

import { TopBar } from "@/components/TopBar";
import { EmissorApp } from "./EmissorApp";
import styles from "./emissor.module.css";

export default function EmissorPage() {
  return (
    <>
      <TopBar
        title="Emissor de NFS-e"
        sub="Emita uma nota de serviço já com a tributação sugerida e auto-auditada — o contador confirma antes de gerar."
      />
      <div className="content">
        {/* 1 · Subtítulo simples + selo de honestidade. */}
        <p className={styles.intro}>
          Em vez de digitar a tributação na mão (e errar quando troca o funcionário que
          sabia o macete), o emissor <strong>sugere</strong> o cClassTrib e os tributos do
          serviço, <strong>confere</strong> contra uma base de referência e deixa o{" "}
          <strong>contador confirmar</strong>. É um add-on de revenda: o escritório compra
          um pacote de emissores e oferece aos clientes dele.
        </p>

        <div className={styles.selos}>
          <span className="badge badge-warning" role="note">
            <span className="badge-glyph" aria-hidden="true">
              !
            </span>
            rascunho / demonstração — não transmite ao fisco
          </span>
          <span className="badge badge-neutral" title="Credenciamento ADN / NFS-e Nacional">
            <span className="badge-glyph" aria-hidden="true">
              ⧗
            </span>
            emissão real chega na Fase 7 (precisa credenciamento ADN / NFS-e Nacional)
          </span>
        </div>

        {/* 2 + 3 + 4 · Parte interativa com estado compartilhado (client). */}
        <EmissorApp />

        {/* Disclaimer-credencial (G6). */}
        <div style={{ marginTop: 16 }}>
          <section className="card">
            <h2 className="card-title">Linguagem segura (G6)</h2>
            <p className="disclaimer">
              <strong>Demonstração com dados sintéticos.</strong> O emissor{" "}
              <strong>sugere</strong> a tributação e roda uma{" "}
              <strong>auto-auditoria</strong> contra uma base de referência; a decisão é um{" "}
              <strong>ato humano</strong> — o contador <strong>confirma</strong> antes de
              gerar o documento. Esta tela <strong>não emite</strong> nota de verdade e{" "}
              <strong>não promete</strong> tributação garantida, apuração correta nem
              ausência de multa. A emissão real depende de credenciamento ADN / NFS-e
              Nacional (Fase 7).
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
