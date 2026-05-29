import { opportunities, portalAccess } from "@/lib/noyce-data";
import { formatDateTime } from "@/lib/noyce-model";
import { buildNextStep, daysUntil, operationalState } from "@/lib/noyce-operational";
import { Metric } from "@/components/shell/bits";
import type { TabId } from "@/components/shell/tabs";

// Mesa = the router. It does not execute a stage; it shows the day's prioritized work
// and deep-links the operator into the tab that owns the next action.
export function MesaTab({ onOpen }: { onOpen: (id: string, tab: TabId) => void }) {
  const readyNow = opportunities.filter((o) => operationalState(o).tone === "ready").length;
  const fastReview = opportunities.filter((o) => operationalState(o).tone === "review").length;
  const blockedByEvidence = opportunities.filter((o) => operationalState(o).tone === "blocked").length;
  const accessBlocked = portalAccess.filter((p) => p.requiresLogin && p.status !== "publico").length;
  const urgentDeadlines = opportunities.filter((o) => daysUntil(o.proposalDeadline) <= 14).length;

  // Day queue: the actionable ones (drop "Pula"), Vai first, then closest deadline. Capped.
  const RANK: Record<string, number> = { vai: 0, olha: 1, pula: 2 };
  const today = [...opportunities]
    .filter((o) => o.triage.verdict !== "pula")
    .sort((a, b) => {
      if (RANK[a.triage.verdict] !== RANK[b.triage.verdict]) return RANK[a.triage.verdict] - RANK[b.triage.verdict];
      return daysUntil(a.proposalDeadline) - daysUntil(b.proposalDeadline);
    })
    .slice(0, 12);

  return (
    <section className="area area-mesa">
      <section className="metric-row" aria-label="Operational metrics">
        <Metric label="Prontas para proposta" value={String(readyNow)} tone="green" note="score e confiança fortes" />
        <Metric label="Revisão rápida" value={String(fastReview)} tone="amber" note="boa chance, mas exige checagem" />
        <Metric label="Bloqueios de decisão" value={String(blockedByEvidence)} tone="red" note="lacunas ou confiança baixa" />
        <Metric label="Acessos pendentes" value={String(accessBlocked)} tone="blue" note={`${urgentDeadlines} prazos em até 14 dias`} />
      </section>

      <section className="day-queue" aria-labelledby="day-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Trabalho do dia</p>
            <h2 id="day-title">Precisa de você — em ordem de urgência</h2>
          </div>
          <span>{today.length} oportunidades</span>
        </div>

        {today.map((opportunity) => {
          const action = buildNextStep(opportunity);
          return (
            <div className={`day-row ${action.tone}`} key={opportunity.id}>
              <div>
                <strong>
                  <span className={`triage-badge triage-${opportunity.triage.verdict}`}>
                    {opportunity.triage.verdict === "vai" ? "Vai" : "Olha"}
                  </span>{" "}
                  {opportunity.title}
                </strong>
                <p>
                  {action.headline} · <strong>{action.owner}</strong>
                  {action.deadline ? ` · prazo ${formatDateTime(action.deadline)}` : ""}
                </p>
              </div>
              <button type="button" onClick={() => onOpen(opportunity.id, "analisar")}>
                Abrir análise
              </button>
            </div>
          );
        })}
      </section>
    </section>
  );
}
