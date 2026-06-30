"use client";

// UI do fluxo "Interesse → Dossiê → Revisão humana" (owner 12/Jun).
// Cada item pré-preenchido pelo motor tem [Aprovar] e [Corrigir]; correção humana
// TRAVA o item (motor nunca sobrescreve) e exibe o valor original como histórico.
import { useEffect, useMemo, useRef, useState } from "react";
import type { EditalRequirementsModel, Opportunity } from "@/lib/noyce-model";
import { eniacCcp } from "@/lib/noyce-data";
import { useLiveChecklist } from "@/components/shell/useLiveChecklist";
import {
  buildReviewDossier,
  mergeReview,
  reviewProgress,
  type ReviewState,
} from "@/lib/noyce-review";
import { useEditalErm } from "@/components/shell/useEditalErm";
import { canGenerate, declarationFileName, generateDeclarationBlob } from "@/lib/noyce-docgen";
import { buildDossierHtml, buildProposalCsv, isPackageFinal } from "@/lib/noyce-package";
import { IndividualDocsPanel } from "@/components/analisar/IndividualDocsPanel";
import { DocChat } from "@/components/analisar/DocChat";
import { buildVictoryPlan } from "@/lib/noyce-victory-plan";
import { SCORE_AS_OF } from "@/lib/noyce-data";
import { loadVaultMeta } from "@/lib/noyce-vault";

const STORAGE_PREFIX = "noyce.review.v1.";

function loadState(opportunityId: string): ReviewState {
  try {
    return JSON.parse(globalThis.localStorage?.getItem(STORAGE_PREFIX + opportunityId) ?? "{}");
  } catch {
    return {};
  }
}

function saveState(opportunityId: string, state: ReviewState) {
  globalThis.localStorage?.setItem(STORAGE_PREFIX + opportunityId, JSON.stringify(state));
}

export function ReviewDossier({
  opportunity,
  winByTab,
}: {
  opportunity: Opportunity;
  /** Sugestões competitivas por aba (do useWinIntel no AnalisarTab) — alimentam o doc por aba. */
  winByTab?: import("@/lib/noyce-win-intel").WinByTab;
}) {
  const [state, setState] = useState<ReviewState>({});
  const [editing, setEditing] = useState<string | null>(null);
  // Story 30.4: alterna entre o dossiê consolidado (default) e os documentos individuais.
  const [exportMode, setExportMode] = useState<"dossier" | "individual">("dossier");

  useEffect(() => {
    setState(loadState(opportunity.id));
    setEditing(null);
  }, [opportunity.id]);

  const liveChecklist = useLiveChecklist(opportunity);
  // ERM CURADO (hand-verified) tem prioridade; senão o usuário PUXA do PNCP. Hook compartilhado
  // com a HabilitarTab — mesma origem, mesma extração, mesma mensagem de erro (sem duplicar lógica).
  const erm = useEditalErm(opportunity);
  // AUTO-PULL (30/Jun): ao abrir o dossiê, o motor puxa as exigências do edital SOZINHO — sem
  // exigir clique. Só dispara quando não há ERM curado nem extração em cache (status "idle"), uma
  // vez por edital. O resultado é cacheado no hook (não re-baixa). Botão "reextrair" segue manual.
  const autoPulled = useRef<string | null>(null);
  useEffect(() => {
    if (erm.curated) return;
    if (erm.status !== "idle") return; // já carregando, pronto (cache) ou em erro
    if (autoPulled.current === opportunity.id) return;
    autoPulled.current = opportunity.id;
    void erm.pull();
  }, [opportunity.id, erm.curated, erm.status, erm.pull]);

  const dossier = useMemo(
    () => buildReviewDossier({ ...opportunity, habilitationChecklist: liveChecklist }, eniacCcp, erm.erm),
    [opportunity, liveChecklist, erm.erm],
  );
  const reviewed = useMemo(() => mergeReview(dossier, state), [dossier, state]);
  const progress = reviewProgress(reviewed);

  function decide(itemId: string, decision: ReviewState[string]) {
    const next = { ...state, [itemId]: decision };
    setState(next);
    saveState(opportunity.id, next);
    setEditing(null);
  }

  function reopen(itemId: string) {
    const next = { ...state };
    delete next[itemId];
    setState(next);
    saveState(opportunity.id, next);
  }

  // D2: gerar .docx — SÓ de item revisado (portão humano do conclave).
  async function downloadDocx(item: (typeof reviewed)[number]) {
    if (!canGenerate(item)) return;
    const blob = await generateDeclarationBlob({
      item,
      ccp: eniacCcp,
      certame: { titulo: opportunity.title, orgao: opportunity.buyer },
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = declarationFileName(item, eniacCcp.identity.cnpj);
    a.click();
    URL.revokeObjectURL(url);
  }

  const declaracoesProntas = reviewed.filter((i) => i.secao.startsWith("Declarações") && canGenerate(i));

  // E1: pacote completo do certame — HTML A4 (imprime → PDF) + planilha CSV de proposta.
  function downloadBlobAs(content: string, mime: string, fileName: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  function gerarPacote() {
    const html = buildDossierHtml({
      opportunity: { ...opportunity, habilitationChecklist: liveChecklist },
      ccp: eniacCcp,
      checklist: liveChecklist,
      victoryPlan: buildVictoryPlan({
        checklist: liveChecklist,
        proposalDeadline: opportunity.proposalDeadline,
        asOf: SCORE_AS_OF,
        reviewProgress: progress,
      }),
      reviewed,
      vaultMeta: loadVaultMeta(),
      generatedAtLabel: new Date().toLocaleString("pt-BR"),
    });
    downloadBlobAs(html, "text/html;charset=utf-8", `dossie-${opportunity.id}.html`);
    // abre pra imprimir → "Salvar como PDF" do navegador
    const win = globalThis.open?.("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  }

  function gerarPlanilha() {
    downloadBlobAs("﻿" + buildProposalCsv(opportunity), "text/csv;charset=utf-8", `proposta-${opportunity.id}.csv`);
  }

  const sections = Array.from(new Set(reviewed.map((item) => item.secao)));

  return (
    <section className="review-dossier" aria-labelledby="review-dossier-title">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">⭐ Em análise — dossiê pré-preenchido pelo motor</p>
          <h3 id="review-dossier-title">Revisão humana: {progress.done}/{progress.total} itens</h3>
        </div>
        <span className={progress.ready ? "review-ready" : "review-pending"}>
          {progress.ready ? "✓ Revisado — pronto p/ habilitar" : "Revisão pendente"}
        </span>
      </div>

      {/* Origem das EXIGÊNCIAS do edital (o que dirige a completude do dossiê). */}
      <div className="review-erm-source" style={{ margin: "8px 0", padding: "8px 12px", borderRadius: 8, background: "#f6f5f0", fontSize: 13 }}>
        {erm.curated ? (
          <span>📋 Exigências do <strong>edital curado</strong> (verificado à mão) — dossiê dirigido pelo edital.</span>
        ) : erm.erm ? (
          <span>
            📋 Exigências <strong>extraídas do edital (PNCP)</strong>
            {erm.confidence ? ` — confiança declarações: ${erm.confidence.declaracoes} · certidões: ${erm.confidence.cnds}` : ""}.{" "}
            <button type="button" onClick={erm.pull} disabled={erm.status === "loading"} style={{ marginLeft: 6 }}>
              {erm.status === "loading" ? "puxando…" : "reextrair"}
            </button>
            {(erm.confidence?.declaracoes === "baixa" || erm.confidence?.cnds === "baixa") && (
              <small style={{ display: "block", color: "#8a6516" }}>⚠️ confiança baixa — conferir manualmente contra o edital.</small>
            )}
          </span>
        ) : (
          <span>
            📋 Sem edital estruturado — dossiê no conjunto-<strong>praxe</strong> (pode faltar exigência específica deste edital).{" "}
            <button type="button" onClick={erm.pull} disabled={erm.status === "loading"}>
              {erm.status === "loading" ? "puxando do PNCP… (até ~2 min)" : "Puxar exigências do edital (PNCP)"}
            </button>
            {erm.status === "error" && erm.errorMsg && <small style={{ display: "block", color: "#a33" }}>⚠️ {erm.errorMsg}</small>}
          </span>
        )}
      </div>

      {sections.map((secao) => (
        <div className="review-section" key={secao}>
          <h4>{secao}</h4>
          {reviewed
            .filter((item) => item.secao === secao)
            .map((item) => (
              <div className={`review-row ${item.status}`} key={item.id}>
                <div className="review-main">
                  <strong>{item.label}</strong>
                  <p>{item.valorFinal}</p>
                  {item.aviso && item.status !== "corrigido" ? (
                    <small className="review-warning">⚠️ {item.aviso}</small>
                  ) : null}
                  {item.status === "corrigido" ? (
                    <small className="review-history">
                      🔒 corrigido por humano — motor dizia: “{item.valorMotor}”. O motor não sobrescreve este item.
                    </small>
                  ) : (
                    <small>{item.proveniencia}</small>
                  )}
                </div>
                <div className="review-actions">
                  {item.status === "pendente" ? (
                    <>
                      <button
                        type="button"
                        className="approve"
                        disabled={Boolean(item.requerCorrecao)}
                        title={item.requerCorrecao ? "Este item exige correção humana — não pode ser aprovado como está." : undefined}
                        onClick={() => decide(item.id, { status: "aprovado", em: new Date().toISOString() })}
                      >
                        ✓ Aprovar
                      </button>
                      <button
                        type="button"
                        className="correct"
                        onClick={() => setEditing(item.id)}
                      >
                        💬 Corrigir com IA
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="reopen" onClick={() => reopen(item.id)}>
                        {item.status === "aprovado" ? "✓ aprovado" : "🔒 corrigido"} · reabrir
                      </button>
                      {item.secao.startsWith("Declarações") ? (
                        <button type="button" className="docgen" onClick={() => downloadDocx(item)}>
                          ⬇ gerar .docx
                        </button>
                      ) : null}
                    </>
                  )}
                </div>
                {editing === item.id ? (
                  <div className="review-edit">
                    <DocChat
                      item={{
                        id: item.id,
                        label: item.label,
                        secao: item.secao,
                        valorFinal: item.valorFinal,
                        proveniencia: item.proveniencia,
                      }}
                      certame={{
                        titulo: opportunity.title,
                        orgao: opportunity.buyer,
                        empresa: `${eniacCcp.identity.razaoSocial} (CNPJ ${eniacCcp.identity.cnpj})`,
                      }}
                      onSave={(correctedText) =>
                        decide(item.id, { status: "corrigido", valorHumano: correctedText, em: new Date().toISOString() })
                      }
                      onCancel={() => setEditing(null)}
                    />
                  </div>
                ) : null}
              </div>
            ))}
        </div>
      ))}
      <div className="export-mode-switch" role="tablist" aria-label="Modo de exportação">
        <button
          type="button"
          role="tab"
          aria-selected={exportMode === "dossier"}
          className={exportMode === "dossier" ? "active" : ""}
          onClick={() => setExportMode("dossier")}
        >
          📦 Dossiê Completo
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={exportMode === "individual"}
          className={exportMode === "individual" ? "active" : ""}
          onClick={() => setExportMode("individual")}
        >
          📄 Documentos Individuais
        </button>
      </div>

      {exportMode === "dossier" ? (
        <div className="docgen-bar package-bar">
          <span>
            <strong>Pacote do certame:</strong> dossiê completo (HTML → imprimir como PDF) + planilha de proposta na faixa
            legal.{" "}
            {isPackageFinal(reviewed)
              ? "Revisão 100% — sai como PACOTE FINAL."
              : `Revisão ${progress.done}/${progress.total} — sai com marca d'água RASCUNHO até concluir.`}
          </span>
          <span className="package-actions">
            <button type="button" className="docgen" onClick={gerarPacote}>
              ⬇ Dossiê (HTML/PDF)
            </button>
            <button type="button" className="docgen" onClick={gerarPlanilha}>
              ⬇ Planilha (CSV)
            </button>
          </span>
        </div>
      ) : (
        <IndividualDocsPanel opportunity={opportunity} reviewed={reviewed} erm={erm.erm} winByTab={winByTab} />
      )}

      {declaracoesProntas.length > 0 ? (
        <div className="docgen-bar">
          <span>
            {declaracoesProntas.length} declaração(ões) revisada(s) pronta(s) para gerar — arquivo sai exatamente com o
            texto que você aprovou/corrigiu.
          </span>
          <button
            type="button"
            className="docgen"
            onClick={async () => {
              for (const item of declaracoesProntas) await downloadDocx(item);
            }}
          >
            ⬇ Gerar todas (.docx)
          </button>
        </div>
      ) : null}
      <p className="review-foot">
        Correções ficam gravadas neste navegador (Sprint atual) e valem sobre o motor. Arquivos .docx só são gerados de
        itens REVISADOS. Nada é enviado a portal — o envio e a assinatura continuam humanos.
      </p>
    </section>
  );
}
