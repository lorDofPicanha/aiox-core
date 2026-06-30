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
import { sentinelaWatch, clockKindLabel, type SentinelaAlert } from "@/lib/agents/maestro-runtime";
import type { SessionResult } from "@/lib/agents/maestro-types";

const SESSION_RESULT_PREFIX = "noyce.session-result.v1.";
const ALERT_RANK: Record<SentinelaAlert["level"], number> = { vencido: 0, "t-0": 1, "t-1": 2, "t-3": 3, ok: 4 };
const ALERT_LABEL: Record<SentinelaAlert["level"], string> = { vencido: "VENCIDO", "t-0": "VENCE HOJE", "t-1": "vence amanhã", "t-3": "≤ 3 dias", ok: "no prazo" };
function remaining(ms: number): string {
  const abs = Math.abs(ms), d = Math.floor(abs / 86_400_000), h = Math.floor((abs % 86_400_000) / 3_600_000);
  const c = d > 0 ? `${d}d ${h}h` : `${h}h`;
  return ms <= 0 ? `há ${c}` : `faltam ${c}`;
}

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
  // Relógio real (cliente) p/ a vigilância de prazo viver; atualiza a cada minuto.
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date().toISOString());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // Licitações que o operador SEGUE (marcou interesse) — o pipeline do processo.
  const followed = useMemo(() => opportunities.filter((o) => interested.has(o.id)), [interested]);

  // Vigilância de prazo AGREGADA: relógios preclusivos de todas as seguidas, por urgência.
  const aggregatedAlerts = useMemo(() => {
    if (!now) return [] as Array<{ opp: Opportunity; alert: SentinelaAlert }>;
    const rows: Array<{ opp: Opportunity; alert: SentinelaAlert }> = [];
    for (const o of followed) {
      let sr: SessionResult | null = null;
      try {
        const raw = globalThis.localStorage?.getItem(SESSION_RESULT_PREFIX + o.id);
        sr = raw ? (JSON.parse(raw) as SessionResult) : null;
      } catch {
        sr = null;
      }
      for (const a of sentinelaWatch(o, now, sr)) rows.push({ opp: o, alert: a });
    }
    return rows.sort((a, b) => ALERT_RANK[a.alert.level] - ALERT_RANK[b.alert.level] || a.alert.msUntil - b.alert.msUntil);
  }, [followed, now]);
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
      {/* PROCESSO — pipeline das licitações que você segue (info da análise puxada pra cá). */}
      {followed.length > 0 ? (
        <section className="processo-pipeline">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Em andamento — processo</p>
              <h2>Licitações que você segue</h2>
            </div>
            <span>{followed.length} em andamento</span>
          </div>
          {followed.map((o) => {
            const next = buildNextStep(o);
            const st = operationalState(o);
            const top = aggregatedAlerts.find((r) => r.opp.id === o.id)?.alert ?? null;
            return (
              <div
                key={o.id}
                className="processo-row"
                role="button"
                tabIndex={0}
                onClick={() => onSelect(o.id)}
                onKeyDown={(e) => { if (e.key === "Enter") onSelect(o.id); }}
              >
                <div className="proc-main">
                  <strong>{o.title}</strong>
                  <p>{o.buyer} · {o.city}/{o.uf}</p>
                  <p className="proc-next">▸ {next.headline} — <strong>{next.owner}</strong>{next.why ? ` · ${next.why}` : ""}</p>
                </div>
                <div className="proc-side">
                  <span className={`state-badge ${st.tone}`}>{st.label}</span>
                  {top ? (
                    <span className={`proc-prazo lvl-${top.level}`}>⏱ {clockKindLabel(top.kind)}: {ALERT_LABEL[top.level]} ({remaining(top.msUntil)})</span>
                  ) : (
                    <span className="proc-prazo">sem prazo armado</span>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      ) : null}

      {/* VIGILÂNCIA DE PRAZO — Sentinela agregado de todas as seguidas (dor #1). */}
      {aggregatedAlerts.length > 0 ? (
        <section className="vigilancia-agregada">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">🛡️ Vigilância de prazo — Sentinela</p>
              <h3>Relógios preclusivos armados</h3>
            </div>
            <span>{aggregatedAlerts.filter((r) => r.alert.level === "vencido" || r.alert.level === "t-0").length} crítico(s)</span>
          </div>
          {aggregatedAlerts.slice(0, 10).map((r, i) => (
            <div
              key={`${r.opp.id}-${r.alert.kind}-${i}`}
              className={`vig-row lvl-${r.alert.level}`}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(r.opp.id)}
              onKeyDown={(e) => { if (e.key === "Enter") onSelect(r.opp.id); }}
            >
              <div>
                <strong>{clockKindLabel(r.alert.kind)}</strong>
                <p>{r.opp.title}</p>
              </div>
              <span>{ALERT_LABEL[r.alert.level]} · {remaining(r.alert.msUntil)}{r.alert.fatalOnMiss ? " · FATAL" : ""}</span>
            </div>
          ))}
        </section>
      ) : null}

      <div className="opportunity-list">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Radar — descobrir &amp; triar</p>
            <h2>Novos editais no raio</h2>
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
