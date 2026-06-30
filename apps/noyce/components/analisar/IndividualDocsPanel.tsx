"use client";

// Story 30.4 (AC3/4/5/6/7): modo "Documentos Individuais por categoria".
// Lista os documentos do certame agrupados por categoria de habilitação; cada item baixa
// SOZINHO — declarações/proposta como HTML autocontido gerado pela IA (buildIndividualDocHtml),
// certidões/balanço/CAT/contrato como blob do vault (download local, nunca via rede).
// Documento pendente/sem arquivo → botão "Baixar" DESABILITADO com tooltip (AC6).
import { useMemo } from "react";
import type { EditalRequirementsModel, HabilitationRequirementCategory, Opportunity } from "@/lib/noyce-model";
import type { ReviewedItem } from "@/lib/noyce-review";
import {
  buildIndividualDocList,
  buildIndividualDocHtml,
  buildTabDossierHtml,
  type IndividualDoc,
} from "@/lib/noyce-package";
import { WIN_TABS, WIN_TAB_LABEL, type WinByTab } from "@/lib/noyce-win-intel";
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
  erm,
  winByTab,
}: {
  opportunity: Opportunity;
  reviewed: readonly ReviewedItem[];
  /** Exigências extraídas do edital — alimentam o "documento completo por aba". */
  erm?: EditalRequirementsModel;
  /** Sugestões competitivas por aba — entram no rodapé do documento da aba. */
  winByTab?: WinByTab;
}) {
  const vaultMeta = useVaultMeta();

  // Documento COMPLETO por aba: junta exigências do edital (ERM) + peças preparadas + sugestões.
  function baixarAba(tab: (typeof WIN_TABS)[number]) {
    const html = buildTabDossierHtml({
      tab,
      opportunity,
      ccp: eniacCcp,
      erm: erm ?? null,
      reviewed,
      winSuggestions: winByTab?.[tab] ?? [],
      generatedAtLabel: new Date().toLocaleString("pt-BR"),
    });
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dossie-${tab}-${opportunity.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }
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

  // Seção "documento completo por aba" — sempre disponível (lista as exigências do edital mesmo sem
  // peças geradas), pronta p/ revisão humana e uso direto nos lances.
  const tabSection = (
    <section className="tab-docs" aria-labelledby="tab-docs-title">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Documento completo por aba</p>
          <h3 id="tab-docs-title">Tudo que o edital pede — pronto para revisar e usar</h3>
        </div>
        <span>{WIN_TABS.length} aba(s)</span>
      </div>
      <p className="review-foot">
        Cada aba gera UM documento com todas as exigências do edital, as peças preparadas e as sugestões do histórico do
        órgão. Aprovado na revisão, é o material usado direto para dar os lances.
      </p>
      <div className="tab-docs-grid">
        {WIN_TABS.map((tab) => (
          <button key={tab} type="button" className="docgen" onClick={() => baixarAba(tab)} aria-label={`Baixar dossiê ${WIN_TAB_LABEL[tab]}`}>
            ⬇ {WIN_TAB_LABEL[tab]}
          </button>
        ))}
      </div>
    </section>
  );

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
        {tabSection}
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

      {tabSection}
    </section>
  );
}
