"use client";

// UI do fluxo "Interesse → Dossiê → Revisão humana" (owner 12/Jun).
// Cada item pré-preenchido pelo motor tem [Aprovar] e [Corrigir]; correção humana
// TRAVA o item (motor nunca sobrescreve) e exibe o valor original como histórico.
import { useEffect, useMemo, useState } from "react";
import type { Opportunity } from "@/lib/noyce-model";
import { eniacCcp } from "@/lib/noyce-data";
import { useLiveChecklist } from "@/components/shell/useLiveChecklist";
import {
  buildReviewDossier,
  mergeReview,
  reviewProgress,
  type ReviewState,
} from "@/lib/noyce-review";
import { canGenerate, declarationFileName, generateDeclarationBlob } from "@/lib/noyce-docgen";
import { buildDossierHtml, buildProposalCsv, isPackageFinal } from "@/lib/noyce-package";
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

export function ReviewDossier({ opportunity }: { opportunity: Opportunity }) {
  const [state, setState] = useState<ReviewState>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setState(loadState(opportunity.id));
    setEditing(null);
  }, [opportunity.id]);

  const liveChecklist = useLiveChecklist(opportunity);
  const dossier = useMemo(
    () => buildReviewDossier({ ...opportunity, habilitationChecklist: liveChecklist }, eniacCcp),
    [opportunity, liveChecklist],
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
                        onClick={() => {
                          setEditing(item.id);
                          setDraft(item.valorMotor);
                        }}
                      >
                        ✎ Corrigir
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
                    <textarea
                      aria-label={`Corrigir ${item.label}`}
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      rows={3}
                    />
                    <div>
                      <button
                        type="button"
                        className="approve"
                        onClick={() =>
                          decide(item.id, { status: "corrigido", valorHumano: draft.trim(), em: new Date().toISOString() })
                        }
                        disabled={!draft.trim()}
                      >
                        Salvar correção
                      </button>
                      <button type="button" onClick={() => setEditing(null)}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
        </div>
      ))}
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
