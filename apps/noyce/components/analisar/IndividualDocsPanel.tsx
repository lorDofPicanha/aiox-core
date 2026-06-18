"use client";

// Story 30.4 (AC3/4/5/6/7): modo "Documentos Individuais por categoria".
// Lista os documentos do certame agrupados por categoria de habilitação; cada item baixa
// SOZINHO — declarações/proposta como HTML autocontido gerado pela IA (buildIndividualDocHtml),
// certidões/balanço/CAT/contrato como blob do vault (download local, nunca via rede).
// Documento pendente/sem arquivo → botão "Baixar" DESABILITADO com tooltip (AC6).
import { useMemo } from "react";
import type { HabilitationRequirementCategory, Opportunity } from "@/lib/noyce-model";
import type { ReviewedItem } from "@/lib/noyce-review";
import {
  buildIndividualDocList,
  buildIndividualDocHtml,
  type IndividualDoc,
} from "@/lib/noyce-package";
import { downloadVaultDoc } from "@/lib/noyce-vault";
import { useVaultMeta } from "@/components/shell/useLiveChecklist";
import { eniacCcp, SCORE_AS_OF } from "@/lib/noyce-data";

const PENDING_TOOLTIP = "Documento não disponível — pendente de envio manual.";

const STATUS_META: Record<IndividualDoc["status"], { icon: string; label: string }> = {
  ok: { icon: "✔", label: "OK" },
  pendente: { icon: "•", label: "Pendente" },
  expirado: { icon: "⚠", label: "Expirado" },
};

export function IndividualDocsPanel({
  opportunity,
  reviewed,
}: {
  opportunity: Opportunity;
  reviewed: readonly ReviewedItem[];
}) {
  const vaultMeta = useVaultMeta();
  const docs = useMemo(
    () => buildIndividualDocList({ reviewed, vaultMeta, asOf: SCORE_AS_OF }),
    [reviewed, vaultMeta],
  );

  // Agrupa preservando a ordem de inserção das categorias.
  const grouped = useMemo(() => {
    const map = new Map<HabilitationRequirementCategory, IndividualDoc[]>();
    for (const doc of docs) {
      const list = map.get(doc.categoria) ?? [];
      list.push(doc);
      map.set(doc.categoria, list);
    }
    return [...map.entries()];
  }, [docs]);

  async function baixar(doc: IndividualDoc) {
    if (doc.disabled) return;
    if (doc.origem === "vault") {
      await downloadVaultDoc(doc.id, doc.fileName ?? `${doc.nome}.bin`);
      return;
    }
    // Gerado pela IA: HTML autocontido do documento específico (AC4).
    const item = reviewed.find((r) => r.id === doc.id);
    const html = buildIndividualDocHtml({
      docType: doc.categoria,
      opportunity,
      ccp: eniacCcp,
      item,
      generatedAtLabel: new Date().toLocaleString("pt-BR"),
    });
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `documento-${doc.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (docs.length === 0) {
    return (
      <section className="individual-docs" aria-labelledby="individual-docs-title">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Documentos individuais</p>
            <h3 id="individual-docs-title">Baixar um documento por vez</h3>
          </div>
          <span>0 documento(s)</span>
        </div>
        <p className="review-foot">
          Nenhum documento individual disponível ainda — revise declarações/proposta no dossiê acima ou suba certidões no
          vault (aba Governança).
        </p>
      </section>
    );
  }

  return (
    <section className="individual-docs" aria-labelledby="individual-docs-title">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Documentos individuais</p>
          <h3 id="individual-docs-title">Baixar um documento por vez</h3>
        </div>
        <span>{docs.length} documento(s)</span>
      </div>
      <p className="review-foot">
        Reenvie um documento pontual quando o portal devolver um item com defeito. Declarações e proposta saem como HTML
        (imprimir → PDF); certidões e balanço baixam direto do vault (somente neste navegador).
      </p>

      {grouped.map(([categoria, list]) => (
        <div className="review-section" key={categoria}>
          <h4>{list[0]?.categoriaLabel ?? categoria}</h4>
          {list.map((doc) => {
            const meta = STATUS_META[doc.status];
            return (
              <div className={`review-row ${doc.status}`} key={doc.id}>
                <div className="review-main">
                  <strong>{doc.nome}</strong>
                  <p>
                    <span className={`doc-status ${doc.status}`}>
                      {meta.icon} {meta.label}
                    </span>
                    {" · "}
                    {doc.categoriaLabel}
                    {doc.validade ? ` · validade ${doc.validade}` : ""}
                    {doc.origem === "vault" ? " · anexo do vault" : " · gerado pelo Noyce"}
                  </p>
                </div>
                <div className="review-actions">
                  <button
                    type="button"
                    className="docgen"
                    disabled={doc.disabled}
                    title={doc.disabled ? PENDING_TOOLTIP : undefined}
                    aria-label={`Baixar ${doc.nome}`}
                    onClick={() => baixar(doc)}
                  >
                    ⬇ Baixar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </section>
  );
}
