"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { opportunities, portalAccess } from "@/lib/noyce-data";
import { formatCurrency, formatDateTime, legalReviewLabel, scoreHealth } from "@/lib/noyce-model";
import { buildReadinessReport } from "@/lib/noyce-readiness";
import type { Opportunity } from "@/lib/noyce-model";

type SortMode = "best" | "worst" | "deadline";

export default function Home() {
  const vaultPending = portalAccess.filter((portal) => portal.status === "aguarda_vault").length;
  const accessBlocked = portalAccess.filter((portal) => portal.requiresLogin && portal.status !== "publico").length;
  const readyNow = opportunities.filter((opportunity) => operationalState(opportunity).tone === "ready").length;
  const fastReview = opportunities.filter((opportunity) => operationalState(opportunity).tone === "review").length;
  const blockedByEvidence = opportunities.filter((opportunity) => operationalState(opportunity).tone === "blocked").length;
  const urgentDeadlines = opportunities.filter((opportunity) => daysUntil(opportunity.proposalDeadline) <= 14).length;
  const cities = useMemo(
    () => Array.from(new Set(opportunities.map((opportunity) => opportunity.city))).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [],
  );
  const [sortMode, setSortMode] = useState<SortMode>("best");
  const [cityFilter, setCityFilter] = useState("all");

  const filteredOpportunities = useMemo(() => {
    const cityScoped =
      cityFilter === "all"
        ? opportunities
        : opportunities.filter((opportunity) => opportunity.city === cityFilter);

    return [...cityScoped].sort((a, b) => {
      if (sortMode === "worst") return a.opportunityScore - b.opportunityScore;
      if (sortMode === "deadline") {
        return deadlineTime(a.proposalDeadline) - deadlineTime(b.proposalDeadline);
      }
      return b.opportunityScore - a.opportunityScore;
    });
  }, [cityFilter, sortMode]);

  const selectedOpportunity = filteredOpportunities[0] ?? opportunities[0];
  const selectedState = operationalState(selectedOpportunity);
  const selectedBlockers = operationalBlockers(selectedOpportunity);
  const readiness = useMemo(() => buildReadinessReport(), []);

  return (
    <main className="shell">
      <aside className="rail" aria-label="Noyce navigation">
        <div className="brand">
          <div className="brand-chip">
            <Image src="/noyce-mark.svg" width={48} height={48} alt="Noyce" priority />
          </div>
          <div>
            <span>Noyce</span>
            <strong>ENIAC</strong>
          </div>
        </div>

        <nav className="nav">
          {["Monitorar", "Analisar", "Habilitar", "Acompanhar", "Recorrer"].map((item, index) => (
            <a className={index === 1 ? "active" : ""} href={`#${item.toLowerCase()}`} key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item}
            </a>
          ))}
        </nav>

        <section className="access-panel" aria-labelledby="access-title">
          <p id="access-title">Acessos</p>
          <strong>{vaultPending} portais aguardam vault</strong>
          <span>PNCP publico ativo. Demais fontes em dry-run ate login seguro.</span>
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Mesa operacional</p>
            <h1>Licitacoes da ENIAC</h1>
          </div>
          <div className="status-strip" aria-label="Sprint status">
            <span>Fixtures: 7</span>
            <span>Dedupe links: 1</span>
            <span>Automacao: bloqueada</span>
          </div>
        </header>

        <section className="metric-row" aria-label="Operational metrics">
          <Metric label="Prontas para proposta" value={String(readyNow)} tone="green" note="score e confianca fortes" />
          <Metric label="Revisao rapida" value={String(fastReview)} tone="amber" note="boa chance, mas exige checagem" />
          <Metric label="Bloqueios de decisao" value={String(blockedByEvidence)} tone="red" note="lacunas ou confianca baixa" />
          <Metric label="Acessos pendentes" value={String(accessBlocked)} tone="blue" note={`${urgentDeadlines} prazos em ate 14 dias`} />
        </section>

        <section className="content-grid">
          <div className="opportunity-list" id="monitorar">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Inbox priorizado</p>
                <h2>O que olhar agora</h2>
              </div>
              <button type="button">Dry-run</button>
            </div>

            <div className="analysis-filters" aria-label="Filtros de analise">
              <label>
                <span>Prioridade operacional</span>
                <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
                  <option value="best">Maior chance primeiro</option>
                  <option value="worst">Maior risco primeiro</option>
                  <option value="deadline">Prazo mais proximo</option>
                </select>
              </label>
              <label>
                <span>Cidade</span>
                <select value={cityFilter} onChange={(event) => setCityFilter(event.target.value)}>
                  <option value="all">Todas as cidades</option>
                  {cities.map((city) => (
                    <option value={city} key={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="filter-summary" aria-live="polite">
              {filteredOpportunities.length} oportunidades na analise
            </div>

            {filteredOpportunities.map((opportunity) => (
              <article className={`opportunity-card ${operationalState(opportunity).tone}`} key={opportunity.id}>
                <div className="card-main">
                  <div className="card-badges">
                    <span className={`source source-${sourceClass(opportunity.source)}`}>
                      {sourceLabel(opportunity.source)}
                    </span>
                    <span className={`state-badge ${operationalState(opportunity).tone}`}>
                      {operationalState(opportunity).label}
                    </span>
                  </div>
                  <h3>{opportunity.title}</h3>
                  <p>
                    {opportunity.buyer} · {opportunity.city}/{opportunity.uf} · {opportunity.distanceKm} km
                  </p>
                </div>
                <div className="card-scores">
                  <ScorePill label="Score" value={opportunity.opportunityScore} />
                  <ScorePill label="Conf." value={opportunity.confidenceScore} />
                </div>
                <div className="card-footer">
                  <div>
                    <strong>{operationalState(opportunity).nextStep}</strong>
                    <small>{opportunity.analysisRun.blockers.length ? `${opportunity.analysisRun.blockers.length} bloqueio(s)` : "sem bloqueio critico"}</small>
                  </div>
                  <span>{formatDateTime(opportunity.proposalDeadline)}</span>
                </div>
              </article>
            ))}
          </div>

          <article className="detail" id="analisar">
            <div className="detail-header">
              <div>
                <p className="eyebrow">Decisao Noyce</p>
                <h2>{selectedOpportunity.title}</h2>
                <span>
                  {selectedOpportunity.buyer} · {selectedOpportunity.city}/{selectedOpportunity.uf}
                </span>
              </div>
              <div className={`decision ${scoreHealth(selectedOpportunity.opportunityScore)}`}>
                <strong>{selectedOpportunity.opportunityScore}</strong>
                <span>{selectedState.label}</span>
              </div>
            </div>

            <section className={`decision-summary ${selectedState.tone}`} aria-labelledby="decision-summary-title">
              <div>
                <p className="eyebrow">Proximo passo</p>
                <h3 id="decision-summary-title">{selectedState.nextStep}</h3>
                <span>{selectedState.reason}</span>
              </div>
              <div className="blocker-list" aria-label="Bloqueios para decisao">
                {selectedBlockers.map((blocker) => (
                  <span key={blocker}>{blocker}</span>
                ))}
              </div>
            </section>

            <div className="detail-band">
              <div>
                <span>Valor</span>
                <strong>{formatCurrency(selectedOpportunity.estimatedValue)}</strong>
              </div>
              <div>
                <span>Prazo</span>
                <strong>{formatDateTime(selectedOpportunity.proposalDeadline)}</strong>
              </div>
              <div>
                <span>Confianca</span>
                <strong>{selectedOpportunity.confidenceScore}%</strong>
              </div>
            </div>

            <section className="evidence" aria-labelledby="evidence-title">
              <h3 id="evidence-title">Fatos, inferencias e lacunas</h3>
              {selectedOpportunity.evidence.map((item) => (
                <div className={`evidence-row ${item.kind}`} key={`${item.label}-${item.kind}`}>
                  <span>{item.kind}</span>
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.value}</p>
                  </div>
                  <em>{item.confidence}</em>
                </div>
              ))}
            </section>

            <section className="decision-grid" aria-label="Preco e concorrencia">
              <div className="analysis-panel">
                <div className="panel-heading">
                  <p className="eyebrow">Preco</p>
                  <h3>Faixa de referencia</h3>
                </div>
                {selectedOpportunity.priceReferences.map((reference) => (
                  <div className="price-row" key={reference.label}>
                    <span>{reference.label}</span>
                    <strong>{formatCurrency(reference.value)}</strong>
                    <small>{reference.note}</small>
                  </div>
                ))}
              </div>

              <div className="analysis-panel">
                <div className="panel-heading">
                  <p className="eyebrow">Concorrencia</p>
                  <h3>Sinais por evidencia</h3>
                </div>
                {selectedOpportunity.competitors.map((competitor) => (
                  <div className="competitor-row" key={competitor.name}>
                    <strong>{competitor.name}</strong>
                    <span>{competitor.level}</span>
                    <p>{competitor.note}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="score-breakdown" aria-labelledby="score-breakdown-title">
              <div className="section-heading compact">
                <div>
                  <p className="eyebrow">{selectedOpportunity.analysisRun.model}</p>
                  <h3 id="score-breakdown-title">Componentes do score</h3>
                </div>
                <span>{selectedOpportunity.analysisRun.blockers.length} bloqueios</span>
              </div>
              <div className="score-grid">
                <ScoreBreakdownList title="Oportunidade" items={selectedOpportunity.analysisRun.opportunity.components} />
                <ScoreBreakdownList title="Confianca" items={selectedOpportunity.analysisRun.confidence.components} />
              </div>
            </section>

            <section className="habilitation" id="habilitar" aria-labelledby="habilitation-title">
              <div className="section-heading compact">
                <div>
                  <p className="eyebrow">Habilitacao</p>
                  <h3 id="habilitation-title">Checklist operacional</h3>
                </div>
                <span>Revisao humana obrigatoria</span>
              </div>
              <div className="checklist-grid">
                {selectedOpportunity.habilitationChecklist.map((item) => (
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

            <section className="legal-process" id="recorrer" aria-labelledby="legal-process-title">
              <div className="section-heading compact">
                <div>
                  <p className="eyebrow">Fase 5 juridico/processo</p>
                  <h3 id="legal-process-title">Atos externos bloqueados</h3>
                </div>
                <span>Copiloto, nao representante</span>
              </div>

              <div className="legal-grid">
                <div className="legal-panel">
                  <div className="panel-heading">
                    <p className="eyebrow">Habilitacao por requisito</p>
                    <h4>Documento, evidencia e dono</h4>
                  </div>
                  {selectedOpportunity.legalProcess.requirements.map((requirement) => (
                    <div className={`legal-row ${requirement.criticality}`} key={requirement.id}>
                      <div>
                        <strong>{requirement.label}</strong>
                        <p>{requirement.note}</p>
                        <small>{requirement.evidenceLabel}</small>
                        <small>Dono: {requirement.humanOwner}</small>
                        {selectedOpportunity.legalProcess.documents
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

                <div className="legal-panel">
                  <div className="panel-heading">
                    <p className="eyebrow">Janelas processuais</p>
                    <h4>Prazo, risco e consequencia</h4>
                  </div>
                  {selectedOpportunity.legalProcess.events.map((event) => (
                    <div className={`legal-event ${event.riskLevel}`} key={event.id}>
                      <div>
                        <strong>{event.label}</strong>
                        <p>{event.consequenceIfMissed}</p>
                      </div>
                      <span>{event.riskLevel}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="appeal-box">
                <div>
                  <p className="eyebrow">Recurso</p>
                  <h4>Intencao separada das razoes</h4>
                  <span>{selectedOpportunity.legalProcess.appealIntent.groundsSummary}</span>
                </div>
                <div className="appeal-status">
                  <strong>{selectedOpportunity.legalProcess.appealIntent.submissionStatus}</strong>
                  <small>Intencao: {selectedOpportunity.legalProcess.appealIntent.windowStatus}</small>
                  <small>Razoes: {selectedOpportunity.legalProcess.appealReasons.draftStatus}</small>
                </div>
              </div>

              <div className="decision-points">
                {selectedOpportunity.legalProcess.decisionPoints.map((decision) => (
                  <div className="decision-point" key={decision.id}>
                    <div>
                      <strong>{decision.recommendedAction}</strong>
                      <p>{legalReviewLabel(decision)}</p>
                    </div>
                    <span>{decision.externalActBlocked ? "ato externo bloqueado" : "preparo interno"}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="timeline" id="acompanhar">
              <h3>Linha do tempo</h3>
              {selectedOpportunity.timeline.map((event) => (
                <div className={`time-row ${event.status}`} key={event.label}>
                  <span />
                  <div>
                    <strong>{event.label}</strong>
                    <p>{event.date}</p>
                  </div>
                </div>
              ))}
            </section>
          </article>
        </section>

        <section className="portal-matrix" aria-labelledby="portal-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Onboarding ENIAC</p>
              <h2 id="portal-title">Portais confirmados</h2>
            </div>
            <span>Credenciais somente via vault</span>
          </div>

          <div className="portal-grid">
            {portalAccess.map((portal) => (
              <div className="portal" key={portal.source}>
                <span className={`source source-${sourceClass(portal.source)}`}>{sourceLabel(portal.source)}</span>
                <strong>{portal.name}</strong>
                <p>{portal.requiresLogin ? "Login pendente" : "Consulta publica"}</p>
                <small>ToS: {portal.tosStatus} · 2FA: {portal.requires2fa}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="readiness-matrix" aria-labelledby="readiness-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Fases 6-10</p>
              <h2 id="readiness-title">Readiness do piloto</h2>
            </div>
            <span>{readiness.validation.ok ? "offline PASS" : "revisar gates"}</span>
          </div>

          <div className="readiness-grid">
            {Object.entries(readiness.phases).map(([phase, status]) => (
              <div className={`readiness-card ${status}`} key={phase}>
                <span>{phase.toUpperCase()}</span>
                <strong>{status}</strong>
              </div>
            ))}
          </div>

          <div className="morning-grid">
            <div className="morning-panel">
              <h3>Bloqueios para amanha</h3>
              {readiness.humanBlockers.map((blocker) => (
                <div className="morning-row" key={blocker.id}>
                  <strong>{blocker.label}</strong>
                  <p>{blocker.reason}</p>
                  <span>{blocker.requiredFrom}</span>
                </div>
              ))}
            </div>

            <div className="morning-panel">
              <h3>Jobs liberados em dry-run</h3>
              {readiness.jobs.map((job) => (
                <div className="morning-row" key={job.id}>
                  <strong>{job.label}</strong>
                  <p>{job.idempotencyKey}</p>
                  <span>{job.mode}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
  tone,
  note,
}: {
  label: string;
  value: string;
  tone: "blue" | "amber" | "red" | "green";
  note?: string;
}) {
  return (
    <div className={`metric ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {note ? <small>{note}</small> : null}
    </div>
  );
}

function ScorePill({ label, value }: { label: string; value: number }) {
  return (
    <div className={`score ${scoreHealth(value)}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ScoreBreakdownList({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; value: number; max: number; reason: string }>;
}) {
  return (
    <div className="score-breakdown-list">
      <h4>{title}</h4>
      {items.map((item) => (
        <div className="score-factor" key={`${title}-${item.label}`}>
          <div>
            <strong>{item.label}</strong>
            <p>{item.reason}</p>
          </div>
          <span>
            {item.value}/{item.max}
          </span>
        </div>
      ))}
    </div>
  );
}

function deadlineTime(value: string | null) {
  return value ? new Date(value).getTime() : Number.MAX_SAFE_INTEGER;
}

function daysUntil(value: string | null) {
  if (!value) return Number.MAX_SAFE_INTEGER;
  return Math.ceil((new Date(value).getTime() - new Date("2026-05-23T00:00:00Z").getTime()) / 86_400_000);
}

function operationalState(opportunity: Opportunity) {
  if (opportunity.analysisRun.blockers.length > 0 || opportunity.confidenceScore < 70) {
    return {
      label: "Bloqueada por evidencia",
      nextStep: "Completar lacunas antes de decidir",
      reason: "A oportunidade pode ser boa, mas ainda falta dado para uma recomendacao forte.",
      tone: "blocked" as const,
    };
  }

  if (opportunity.opportunityScore >= 70 && opportunity.confidenceScore >= 70) {
    return {
      label: "Pronta para proposta",
      nextStep: "Priorizar proposta agora",
      reason: "Score e confianca sustentam acao operacional imediata.",
      tone: "ready" as const,
    };
  }

  return {
    label: "Revisao rapida",
    nextStep: "Validar criterio critico",
    reason: "Ha sinal positivo, mas a decisao precisa de uma checagem curta.",
    tone: "review" as const,
  };
}

function operationalBlockers(opportunity: Opportunity) {
  const blockers = [
    ...opportunity.analysisRun.blockers,
    ...(opportunity.confidenceScore < 70 ? ["confianca abaixo do minimo"] : []),
    ...(daysUntil(opportunity.proposalDeadline) <= 14 ? ["prazo operacional proximo"] : []),
  ];

  return blockers.length ? blockers : ["sem bloqueio critico"];
}

function sourceLabel(source: string) {
  if (source.startsWith("candidate:")) return "CAND";
  return source.toUpperCase();
}

function sourceClass(source: string) {
  if (source.startsWith("candidate:")) return "candidate";
  return source;
}
