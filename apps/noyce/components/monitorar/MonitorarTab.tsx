"use client";

import { useMemo, useState } from "react";
import { opportunities } from "@/lib/noyce-data";
import { formatCurrency, formatDateTime } from "@/lib/noyce-model";
import { deadlineTime, operationalState, sourceClass, sourceLabel } from "@/lib/noyce-operational";
import { ScorePill } from "@/components/shell/bits";

type SortMode = "triagem" | "best" | "worst" | "deadline";
type VerdictFilter = "all" | "vai" | "olha" | "pula";
const RANK: Record<string, number> = { vai: 0, olha: 1, pula: 2 };
const VERDICT_LABEL: Record<string, string> = { vai: "Vai", olha: "Olha", pula: "Pula" };

export function MonitorarTab({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [sortMode, setSortMode] = useState<SortMode>("triagem");
  const [cityFilter, setCityFilter] = useState("all");
  const [verdict, setVerdict] = useState<VerdictFilter>("all");

  const cities = useMemo(
    () => Array.from(new Set(opportunities.map((o) => o.city))).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [],
  );

  const counts = useMemo(
    () => ({
      vai: opportunities.filter((o) => o.triage.verdict === "vai").length,
      olha: opportunities.filter((o) => o.triage.verdict === "olha").length,
      pula: opportunities.filter((o) => o.triage.verdict === "pula").length,
    }),
    [],
  );

  const filtered = useMemo(() => {
    let scoped = cityFilter === "all" ? opportunities : opportunities.filter((o) => o.city === cityFilter);
    if (verdict !== "all") scoped = scoped.filter((o) => o.triage.verdict === verdict);
    return [...scoped].sort((a, b) => {
      if (sortMode === "triagem") {
        if (RANK[a.triage.verdict] !== RANK[b.triage.verdict]) return RANK[a.triage.verdict] - RANK[b.triage.verdict];
        return b.triage.score - a.triage.score;
      }
      if (sortMode === "worst") return a.opportunityScore - b.opportunityScore;
      if (sortMode === "deadline") return deadlineTime(a.proposalDeadline) - deadlineTime(b.proposalDeadline);
      return b.opportunityScore - a.opportunityScore;
    });
  }, [cityFilter, sortMode, verdict]);

  return (
    <section className="area area-monitorar">
      <div className="opportunity-list">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Inbox priorizado</p>
            <h2>O que olhar agora</h2>
          </div>
          <button type="button">Dry-run</button>
        </div>

        <div className="analysis-filters" aria-label="Filtros de analise">
          <label>
            <span>Ordenar por</span>
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
              <option value="triagem">Triagem (Vai primeiro)</option>
              <option value="deadline">Prazo mais próximo</option>
              <option value="best">Maior chance primeiro</option>
              <option value="worst">Maior risco primeiro</option>
            </select>
          </label>
          <label>
            <span>Triagem</span>
            <select value={verdict} onChange={(event) => setVerdict(event.target.value as VerdictFilter)}>
              <option value="all">Todas ({counts.vai + counts.olha + counts.pula})</option>
              <option value="vai">Vai ({counts.vai})</option>
              <option value="olha">Olha ({counts.olha})</option>
              <option value="pula">Pula ({counts.pula})</option>
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
          {filtered.length} editais · <strong className="triage-vai">{counts.vai} Vai</strong> ·{" "}
          {counts.olha} Olha · {counts.pula} Pula <span className="filter-src">(PNCP, raio GO ≤170km)</span>
        </div>

        {filtered.map((opportunity) => (
          <article
            aria-label={`Abrir licitacao ${opportunity.title}`}
            aria-pressed={selectedId === opportunity.id}
            className={`opportunity-card ${operationalState(opportunity).tone} ${selectedId === opportunity.id ? "selected" : ""}`}
            key={opportunity.id}
            onClick={() => onSelect(opportunity.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(opportunity.id);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="card-main">
              <div className="card-badges">
                <span className={`triage-badge triage-${opportunity.triage.verdict}`}>
                  {VERDICT_LABEL[opportunity.triage.verdict]}
                </span>
                <span className={`source source-${sourceClass(opportunity.source)}`}>{sourceLabel(opportunity.source)}</span>
                <span className={`state-badge ${operationalState(opportunity).tone}`}>{operationalState(opportunity).label}</span>
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
                <strong>{opportunity.triage.reason}</strong>
                <small>
                  {formatCurrency(opportunity.estimatedValue)} · {opportunity.distanceKm} km · {opportunity.buyer}
                </small>
              </div>
              <span>{formatDateTime(opportunity.proposalDeadline)}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
