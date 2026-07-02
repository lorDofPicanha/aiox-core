"use client";

// UI do fluxo "Interesse → Dossiê → Revisão humana" (owner 12/Jun).
// Cada item pré-preenchido pelo motor tem [Aprovar] e [Corrigir]; correção humana
// TRAVA o item (motor nunca sobrescreve) e exibe o valor original como histórico.
import { useEffect, useMemo, useState } from "react";
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
import { buildDossierHtml, buildIndividualDocHtml, buildProposalCsv, isPackageFinal } from "@/lib/noyce-package";
import type { HabilitationRequirementCategory } from "@/lib/noyce-model";
import { IndividualDocsPanel } from "@/components/analisar/IndividualDocsPanel";
import { DocChat } from "@/components/analisar/DocChat";
import { buildVictoryPlan } from "@/lib/noyce-victory-plan";
import { SCORE_AS_OF } from "@/lib/noyce-data";
import { loadVaultMeta } from "@/lib/noyce-vault";

const STORAGE_PREFIX = "noyce.review.v1.";
// E2 (Norman, conclave 12/Jun): reabrir um item CORRIGIDO não pode destruir a correção
// humana sem volta. A última decisão descartada por item fica aqui, restaurável com 1 clique.
const TRASH_PREFIX = "noyce.review.trash.v1.";
// E4 (Norman): QUEM revisou — identidade leve por navegador (4 usuárias compartilham o app).
// Vira coluna real quando a Story 30.6 (Supabase/auth) entrar; até lá, carimbo por decisão.
const REVIEWER_KEY = "noyce.reviewer.v1";

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

function loadTrash(opportunityId: string): ReviewState {
  try {
    return JSON.parse(globalThis.localStorage?.getItem(TRASH_PREFIX + opportunityId) ?? "{}");
  } catch {
    return {};
  }
}

function saveTrash(opportunityId: string, trash: ReviewState) {
  globalThis.localStorage?.setItem(TRASH_PREFIX + opportunityId, JSON.stringify(trash));
}

export function ReviewDossier({
  opportunity,
  winByTab,
  erm: ermProp,
}: {
  opportunity: Opportunity;
  /** Sugestões competitivas por aba (do useWinIntel) — alimentam o doc por aba. */
  winByTab?: import("@/lib/noyce-win-intel").WinByTab;
  /** ERM controlado pelo dono (HabilitarTab) — UMA fonte de verdade. Se ausente, cria o seu (fallback). */
  erm?: import("@/components/shell/useEditalErm").UseEditalErm;
}) {
  const [state, setState] = useState<ReviewState>({});
  const [trash, setTrash] = useState<ReviewState>({});
  const [reviewer, setReviewer] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  // Story 30.4: alterna entre o dossiê consolidado (default) e os documentos individuais.
  const [exportMode, setExportMode] = useState<"dossier" | "individual">("dossier");

  useEffect(() => {
    setState(loadState(opportunity.id));
    setTrash(loadTrash(opportunity.id));
    setEditing(null);
  }, [opportunity.id]);

  useEffect(() => {
    setReviewer(globalThis.localStorage?.getItem(REVIEWER_KEY) ?? "");
  }, []);

  function updateReviewer(nome: string) {
    setReviewer(nome);
    globalThis.localStorage?.setItem(REVIEWER_KEY, nome);
  }

  const liveChecklist = useLiveChecklist(opportunity);
  // UMA fonte de verdade do ERM: usa o do dono (Habilitar) quando passado; senão cria o próprio.
  // O auto-pull e a habilitação ao vivo ficam no dono — aqui só consumimos.
  const ermLocal = useEditalErm(opportunity);
  const erm = ermProp ?? ermLocal;

  const dossier = useMemo(
    () => buildReviewDossier({ ...opportunity, habilitationChecklist: liveChecklist }, eniacCcp, erm.erm),
    [opportunity, liveChecklist, erm.erm],
  );
  const reviewed = useMemo(() => mergeReview(dossier, state), [dossier, state]);
  const progress = reviewProgress(reviewed);

  function decide(itemId: string, decision: ReviewState[string]) {
    // E4: carimba QUEM decidiu (quando o revisor se identificou) sem sobrescrever autor restaurado.
    const stamped = decision.por || !reviewer.trim() ? decision : { ...decision, por: reviewer.trim() };
    const next = { ...state, [itemId]: stamped };
    setState(next);
    saveState(opportunity.id, next);
    setEditing(null);
  }

  function reopen(itemId: string) {
    const discarded = state[itemId];
    // E2: correção humana descartada vai para a lixeira restaurável — nunca some sem volta.
    if (discarded?.status === "corrigido") {
      const nextTrash = { ...trash, [itemId]: discarded };
      setTrash(nextTrash);
      saveTrash(opportunity.id, nextTrash);
    }
    const next = { ...state };
    delete next[itemId];
    setState(next);
    saveState(opportunity.id, next);
  }

  function restaurarCorrecao(itemId: string) {
    const kept = trash[itemId];
    if (!kept) return;
    decide(itemId, kept);
    const nextTrash = { ...trash };
    delete nextTrash[itemId];
    setTrash(nextTrash);
    saveTrash(opportunity.id, nextTrash);
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

  // Quais seções são DOCUMENTOS (têm download próprio) vs. info (dados do certame / 4 frentes).
  function secaoToDocType(secao: string): HabilitationRequirementCategory {
    if (secao.startsWith("Qualificação Técnica")) return "tecnica";
    if (secao.startsWith("Qualificação Econômico")) return "economico_financeira";
    if (secao.startsWith("Proposta")) return "proposta";
    if (secao.startsWith("Credenciamento")) return "juridica";
    if (secao.startsWith("Declarações")) return "outro";
    return "outro";
  }
  function isDocumento(secao: string): boolean {
    return secao.startsWith("Declarações") || secao.includes("(documento)") || secao === "Proposta";
  }

  // Baixa UM documento (HTML autocontido, imprime → PDF). Resolve "baixar individualmente".
  // Aprovado/corrigido → peça formal com assinatura. Pendente → rascunho LEGÍVEL (conteúdo +
  // tarja RASCUNHO), para o usuário ler o documento inteiro antes de aprovar.
  function baixarDocumento(item: (typeof reviewed)[number]) {
    let html: string;
    if (item.status !== "pendente") {
      html = buildIndividualDocHtml({
        docType: secaoToDocType(item.secao),
        opportunity,
        ccp: eniacCcp,
        item,
        generatedAtLabel: new Date().toLocaleString("pt-BR"),
      });
    } else {
      const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(item.label)} — RASCUNHO</title>
<style>@page{size:A4;margin:18mm}body{font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;font-size:12pt;line-height:1.55}
.wm{position:fixed;top:42%;left:0;right:0;text-align:center;font-size:32pt;color:rgba(180,40,40,.16);transform:rotate(-22deg);font-weight:bold}
h1{font-size:18pt;margin:0 0 4pt}.meta{color:#555;font-size:10.5pt}.texto{white-space:pre-wrap;margin-top:12pt}
.foot{font-size:9pt;color:#777;margin-top:18pt;border-top:1px solid #ccc;padding-top:6pt}</style></head><body>
<div class="wm">RASCUNHO — NÃO REVISADO</div>
<h1>${esc(item.label)}</h1>
<p class="meta">Ref.: ${esc(opportunity.title)} — ${esc(opportunity.buyer)} · ${esc(eniacCcp.identity.razaoSocial)} (CNPJ ${esc(eniacCcp.identity.cnpj)}) · RASCUNHO (não aprovado em revisão)</p>
<div class="texto">${esc(item.valorFinal)}</div>
<p class="foot">Rascunho gerado pelo Noyce para leitura. O documento assinável só é emitido após a aprovação humana na revisão.</p>
</body></html>`;
    }
    downloadBlobAs(html, "text/html;charset=utf-8", `documento-${item.id}.html`);
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

      {/* E4: identidade do revisor — carimba QUEM aprovou/corrigiu cada item (trilha de auditoria). */}
      <div className="review-reviewer" style={{ margin: "6px 0", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
        <label htmlFor="review-reviewer-input">👤 Revisando como:</label>
        <input
          id="review-reviewer-input"
          type="text"
          value={reviewer}
          placeholder="seu nome (fica gravado em cada decisão)"
          onChange={(e) => updateReviewer(e.target.value)}
          style={{ padding: "3px 8px", borderRadius: 6, border: "1px solid #ccc", minWidth: 220 }}
        />
        {!reviewer.trim() && <small style={{ color: "#8a6516" }}>⚠️ sem nome, a decisão sai anônima na trilha.</small>}
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
                  {isDocumento(item.secao) && item.valorFinal.length > 280 ? (
                    <>
                      <p className={`review-text ${expanded.has(item.id) ? "" : "clamped"}`}>{item.valorFinal}</p>
                      <button type="button" className="ver-mais" onClick={() => toggleExpand(item.id)}>
                        {expanded.has(item.id) ? "▴ ver menos" : "▾ ver documento completo"}
                      </button>
                    </>
                  ) : (
                    <p>{item.valorFinal}</p>
                  )}
                  {item.aviso && item.status !== "corrigido" ? (
                    <small className="review-warning">⚠️ {item.aviso}</small>
                  ) : null}
                  {item.status === "corrigido" ? (
                    <small className="review-history">
                      🔒 corrigido por {item.revisadoPor ?? "humano (não identificado)"} — motor dizia: “{item.valorMotor}”. O motor não sobrescreve este item.
                    </small>
                  ) : item.status === "aprovado" && item.revisadoPor ? (
                    <small className="review-history">✓ aprovado por {item.revisadoPor} · {item.proveniencia}</small>
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
                      {trash[item.id] ? (
                        <button
                          type="button"
                          className="restore"
                          title="Restaurar a última correção humana descartada ao reabrir"
                          onClick={() => restaurarCorrecao(item.id)}
                        >
                          ↩ restaurar correção
                        </button>
                      ) : null}
                    </>
                  ) : (
                    <button type="button" className="reopen" onClick={() => reopen(item.id)}>
                      {item.status === "aprovado" ? "✓ aprovado" : "🔒 corrigido"} · reabrir
                    </button>
                  )}
                  {isDocumento(item.secao) ? (
                    <button type="button" className="docgen" onClick={() => baixarDocumento(item)} title="Baixar este documento (HTML — imprimir como PDF)">
                      ⬇ baixar
                    </button>
                  ) : null}
                  {item.status !== "pendente" && item.secao.startsWith("Declarações") ? (
                    <button type="button" className="docgen" onClick={() => downloadDocx(item)}>
                      .docx
                    </button>
                  ) : null}
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
