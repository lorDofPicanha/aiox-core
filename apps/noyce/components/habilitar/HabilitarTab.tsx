"use client";

import type { Opportunity } from "@/lib/noyce-model";
import { useLiveChecklist } from "@/components/shell/useLiveChecklist";
import { useLiveHabilitationResult } from "@/components/shell/useEditalErm";

const VERDICT_LABEL: Record<string, string> = {
  GO: "GO",
  GO_COM_TAREFAS: "GO com tarefas",
  PENDENTE_DADO: "Pendente de dado",
  NO_GO: "NO-GO",
};

export function HabilitarTab({ opportunity }: { opportunity: Opportunity }) {
  const liveChecklist = useLiveChecklist(opportunity);
  // Destrave: o dossiê roda AO VIVO contra o acervo real da ENIAC para QUALQUER edital — usa o ERM
  // curado/extraído (não só o seed dos 2 editais). Fallback no seed quando ainda não há ERM.
  const { result: liveResult, erm } = useLiveHabilitationResult(opportunity);
  const result = liveResult ?? opportunity.habilitationResult ?? null;
  const blocks = result ? Object.values(result.porBloco) : [];
  const sanaveis = result?.lacunas.filter((gap) => gap.sanabilidade === "SANAVEL") ?? [];
  const insanaveis = result?.lacunas.filter((gap) => gap.sanabilidade === "INSANAVEL") ?? [];

  return (
    <section className="area area-habilitar">
      {/* Origem das EXIGÊNCIAS que dirigem o dossiê — curado, extraído do PNCP, ou ainda por puxar. */}
      <div className="review-erm-source" style={{ margin: "0 0 12px", padding: "8px 12px", borderRadius: 8, background: "#f6f5f0", fontSize: 13 }}>
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
            📋 Sem exigências estruturadas — o motor está rodando no conjunto-<strong>praxe</strong>. Puxe o edital pra cruzar o acervo da ENIAC com o que ESTE edital exige.{" "}
            <button type="button" onClick={erm.pull} disabled={erm.status === "loading"}>
              {erm.status === "loading" ? "puxando do PNCP… (até ~2 min)" : "Puxar exigências do edital (PNCP)"}
            </button>
            {erm.status === "error" && erm.errorMsg && <small style={{ display: "block", color: "#a33", marginTop: 4 }}>⚠️ {erm.errorMsg}</small>}
          </span>
        )}
      </div>

      {result ? (
        <section className="legal-process" aria-labelledby="habilitation-dossier-title">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Dossie de habilitacao</p>
              <h3 id="habilitation-dossier-title">Elegibilidade ENIAC</h3>
            </div>
            <span>{VERDICT_LABEL[result.verdict] ?? result.verdict}</span>
          </div>

          <div className="detail-band">
            <div>
              <span>Veredito solo</span>
              <strong>{VERDICT_LABEL[result.solo.verdict] ?? result.solo.verdict}</strong>
            </div>
            <div>
              <span>Exercicio PL</span>
              <strong>{result.solo.exercicio ?? "pendente"}</strong>
            </div>
            <div>
              <span>Consorcio</span>
              <strong>{result.consorcio?.vantagemMeEpp ? "ME/EPP sem +30%" : "avaliar edital"}</strong>
            </div>
          </div>

          <div className="legal-panel">
            {blocks.map((block) => (
              <div className={`legal-row ${block.status === "NAO_ATENDE" ? "blocker" : "medium"}`} key={block.id}>
                <div>
                  <strong>
                    {block.label} · {block.status}
                  </strong>
                  {block.evaluations.map((evaluation) => (
                    <p key={evaluation.id}>
                      {evaluation.requisito}: {evaluation.status}
                      {evaluation.disponivel !== undefined ? ` · tese ${evaluation.disponivel}` : ""}
                      {evaluation.disponivelConservador !== undefined && evaluation.disponivelConservador !== evaluation.disponivel
                        ? ` · conservador ${evaluation.disponivelConservador}`
                        : ""}
                      {evaluation.qtdMin !== undefined ? ` · exigido ${evaluation.qtdMin}` : ""}
                      {evaluation.proveniencia === "inferred" ? " · proxy inferred" : ""}
                    </p>
                  ))}
                  {block.tarefas.map((task) => (
                    <small key={task}>Tarefa: {task}</small>
                  ))}
                </div>
                <span>{block.status}</span>
              </div>
            ))}
          </div>

          <div className="score-grid">
            <section className="lacuna-tasks" aria-labelledby="sanavel-title">
              <div className="section-heading compact">
                <div>
                  <p className="eyebrow">Sanavel</p>
                  <h3 id="sanavel-title">Tarefas</h3>
                </div>
                <span>{sanaveis.length}</span>
              </div>
              {sanaveis.length ? (
                sanaveis.map((gap) => (
                  <div className="lacuna-row" key={`${gap.bloco}-${gap.classe}-${gap.descricao}`}>
                    <div>
                      <strong>{gap.classe}</strong>
                      <p>{gap.descricao}</p>
                    </div>
                    <span>{gap.sanabilidade}</span>
                  </div>
                ))
              ) : (
                <p>Sem lacunas sanaveis no dossie atual.</p>
              )}
            </section>

            <section className="lacuna-tasks" aria-labelledby="insanavel-title">
              <div className="section-heading compact">
                <div>
                  <p className="eyebrow">Insanavel</p>
                  <h3 id="insanavel-title">Bloqueios reais</h3>
                </div>
                <span>{insanaveis.length}</span>
              </div>
              {insanaveis.length ? (
                insanaveis.map((gap) => (
                  <div className="lacuna-row blocking" key={`${gap.bloco}-${gap.classe}-${gap.descricao}`}>
                    <div>
                      <strong>{gap.classe}</strong>
                      <p>
                        {gap.descricao}
                        {gap.faltante !== null ? ` · falta ${gap.faltante} ${gap.unidade ?? ""}` : ""}
                      </p>
                    </div>
                    <span>{gap.sanabilidade}</span>
                  </div>
                ))
              ) : (
                <p>Sem lacunas insanaveis no dossie atual.</p>
              )}
            </section>
          </div>

          <p>{result.disclaimer}</p>
        </section>
      ) : null}

      <section className="habilitation" aria-labelledby="habilitation-title">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Habilitação</p>
            <h3 id="habilitation-title">Checklist operacional</h3>
          </div>
          <span>Revisão humana obrigatória</span>
        </div>
        <div className="checklist-grid">
          {liveChecklist.map((item) => (
            <div className={`habilitation-item ${item.status}`} key={item.label}>
              <span aria-hidden="true" />
              <div>
                <strong>{item.label}</strong>
                <p>{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="legal-process" aria-labelledby="habilitation-req-title">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Habilitação por requisito</p>
            <h3 id="habilitation-req-title">Documento, evidência e dono</h3>
          </div>
          <span>Copiloto, não representante</span>
        </div>

        <div className="legal-panel">
          {opportunity.legalProcess.requirements.map((requirement) => (
            <div className={`legal-row ${requirement.criticality}`} key={requirement.id}>
              <div>
                <strong>{requirement.label}</strong>
                <p>{requirement.note}</p>
                <small>{requirement.evidenceLabel}</small>
                <small>Dono: {requirement.humanOwner}</small>
                {opportunity.legalProcess.documents
                  .filter((document) => document.requirementId === requirement.id)
                  .map((document) => (
                    <small key={document.id}>
                      Documento: {document.label} · {document.status}
                    </small>
                  ))}
              </div>
              <span>{requirement.status}</span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
