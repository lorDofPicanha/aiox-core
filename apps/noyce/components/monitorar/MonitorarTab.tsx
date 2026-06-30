"use client";

import { useEffect, useMemo, useState } from "react";
import { opportunities } from "@/lib/noyce-data";
import { formatCurrency, formatDateTime } from "@/lib/noyce-model";
import type { Opportunity, SuspicionSignal } from "@/lib/noyce-model";
import { buildNextStep, deadlineTime, operationalState, sourceClass, sourceLabel } from "@/lib/noyce-operational";
import { MAX_DISCOVERY_RADIUS_KM } from "@/lib/noyce-source-registry";
import { ScorePill } from "@/components/shell/bits";
import { ConsorcioChip } from "@/components/shell/ConsorcioChip";
import { needsConsorcioPartner } from "@/lib/noyce-operational";

type SortMode = "triagem" | "best" | "worst" | "deadline";
type VerdictFilter = "all" | "vai" | "olha" | "pula";
type ConsorcioFilter = "qualquer" | "sim" | "nao";
const RANK: Record<string, number> = { vai: 0, olha: 1, pula: 2 };
const VERDICT_LABEL: Record<string, string> = { vai: "Vai", olha: "Olha", pula: "Pula" };
type OpportunityWithSuspicion = Opportunity & { suspicionSignals?: SuspicionSignal[] };

export function MonitorarTab({
  selectedId,
  onSelect,
  interested,
  onToggleInterest,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  interested: Set<string>;
  onToggleInterest: (id: string) => void;
}) {
  const [sortMode, setSortMode] = useState<SortMode>("triagem");
  const [cityFilter, setCityFilter] = useState("all");
  const [verdict, setVerdict] = useState<VerdictFilter>("all");
  // Story 30.1 AC3 — filtro de consórcio, hidratado do query param `consorcio=sim|nao|qualquer`.
  const [consorcio, setConsorcio] = useState<ConsorcioFilter>("qualquer");

  // Hidrata o filtro a partir da URL na montagem (consistente com o padrão localStorage do app).
  useEffect(() => {
    const param = new URLSearchParams(globalThis.location?.search ?? "").get("consorcio");
    if (param === "sim" || param === "nao" || param === "qualquer") setConsorcio(param);
  }, []);

  // Persiste o filtro na URL sem recarregar (history.replaceState — não há router de query no app).
  useEffect(() => {
    if (!globalThis.location || !globalThis.history) return;
    const url = new URL(globalThis.location.href);
    if (consorcio === "qualquer") url.searchParams.delete("consorcio");
    else url.searchParams.set("consorcio", consorcio);
    globalThis.history.replaceState(null, "", url.toString());
  }, [consorcio]);

  // Licitações que você SEGUE (marcou interesse) — pra gerenciar várias em paralelo num lugar só.
  const followed = useMemo(() => opportunities.filter((o) => interested.has(o.id)), [interested]);

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
    // Story 30.1 AC3 — "Sim" só os que permitem; "Não" só os que vedam. N/I (null) cai fora de ambos.
    if (consorcio === "sim") scoped = scoped.filter((o) => o.permiteConsorcio === true);
    else if (consorcio === "nao") scoped = scoped.filter((o) => o.permiteConsorcio === false);
    return [...scoped].sort((a, b) => {
      if (sortMode === "triagem") {
        if (RANK[a.triage.verdict] !== RANK[b.triage.verdict]) return RANK[a.triage.verdict] - RANK[b.triage.verdict];
        return b.triage.score - a.triage.score;
      }
      if (sortMode === "worst") return a.opportunityScore - b.opportunityScore;
      if (sortMode === "deadline") return deadlineTime(a.proposalDeadline) - deadlineTime(b.proposalDeadline);
      return b.opportunityScore - a.opportunityScore;
    });
  }, [cityFilter, sortMode, verdict, consorcio]);

  return (
    <section className="area area-monitorar">
      {/* EM ANDAMENTO — as licitações que você segue, pra tocar várias ao mesmo tempo. */}
      {followed.length > 0 ? (
        <section className="em-andamento">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Em andamento</p>
              <h2>Licitações que você segue ({followed.length})</h2>
            </div>
            <span>clique p/ abrir</span>
          </div>
          {followed.map((o) => {
            const next = buildNextStep(o);
            const st = operationalState(o);
            return (
              <div
                key={o.id}
                className={`andamento-row ${selectedId === o.id ? "selected" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(o.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(o.id); } }}
              >
                <div className="andamento-main">
                  <strong>{o.title}</strong>
                  <p>{o.buyer} · {o.city}/{o.uf} · {o.distanceKm} km</p>
                  <p className="andamento-next">▸ {next.headline} — <strong>{next.owner}</strong>{next.why ? ` · ${next.why}` : ""}</p>
                </div>
                <div className="andamento-side">
                  <span className={`state-badge ${st.tone}`}>{st.label}</span>
                  <span className="andamento-prazo">prazo {formatDateTime(o.proposalDeadline)}</span>
                  <button
                    type="button"
                    className="interest-btn active"
                    onClick={(e) => { e.stopPropagation(); onToggleInterest(o.id); }}
                    aria-label="Parar de seguir"
                    title="Parar de seguir"
                  >
                    ⭐ seguindo
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      ) : null}

      <div className="opportunity-list">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{followed.length > 0 ? "Radar — descobrir mais" : "Inbox priorizado"}</p>
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
            <span>Permite Consórcio</span>
            <select value={consorcio} onChange={(event) => setConsorcio(event.target.value as ConsorcioFilter)}>
              <option value="qualquer">Qualquer</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
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
          {counts.olha} Olha · {counts.pula} Pula <span className="filter-src">(PNCP, raio GO ≤{MAX_DISCOVERY_RADIUS_KM}km)</span>
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
                <ConsorcioChip value={opportunity.permiteConsorcio} />
                {((opportunity as OpportunityWithSuspicion).suspicionSignals?.length ?? 0) > 0 ? (
                  <span className="state-badge review">⚠️ exigência atípica</span>
                ) : null}
              </div>
              <h3>{opportunity.title}</h3>
              <p>
                {opportunity.buyer} · {opportunity.city}/{opportunity.uf} · {opportunity.distanceKm} km
              </p>
              {needsConsorcioPartner(opportunity) ? (
                <p className="consorcio-alert" role="note">
                  Consórcio pode ser necessário — cadastre empresa parceira no Vault para análise completa.
                </p>
              ) : null}
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
              <button
                type="button"
                className={`interest-btn ${interested.has(opportunity.id) ? "active" : ""}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleInterest(opportunity.id);
                  if (!interested.has(opportunity.id)) onSelect(opportunity.id);
                }}
                aria-pressed={interested.has(opportunity.id)}
              >
                {interested.has(opportunity.id) ? "⭐ Em análise" : "☆ Tenho interesse"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
