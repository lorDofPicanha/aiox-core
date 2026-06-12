"use client";

// UI do fluxo "Interesse → Dossiê → Revisão humana" (owner 12/Jun).
// Cada item pré-preenchido pelo motor tem [Aprovar] e [Corrigir]; correção humana
// TRAVA o item (motor nunca sobrescreve) e exibe o valor original como histórico.
import { useEffect, useMemo, useState } from "react";
import type { Opportunity } from "@/lib/noyce-model";
import { eniacCcp } from "@/lib/noyce-data";
import {
  buildReviewDossier,
  mergeReview,
  reviewProgress,
  type ReviewState,
} from "@/lib/noyce-review";

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

  const dossier = useMemo(() => buildReviewDossier(opportunity, eniacCcp), [opportunity]);
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
                    <button type="button" className="reopen" onClick={() => reopen(item.id)}>
                      {item.status === "aprovado" ? "✓ aprovado" : "🔒 corrigido"} · reabrir
                    </button>
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
      <p className="review-foot">
        Correções ficam gravadas neste navegador (Sprint atual) e valem sobre o motor. Nada é enviado a portal — revisão
        é preparação; o ato vinculante continua humano.
      </p>
    </section>
  );
}
