import type { Opportunity } from "@/lib/noyce-model";
import { legalDecisionAction } from "@/lib/noyce-operational";

export function RecorrerTab({ opportunity }: { opportunity: Opportunity }) {
  const { appealIntent, appealReasons, decisionPoints } = opportunity.legalProcess;
  return (
    <section className="area area-recorrer">
      <section className="legal-process" aria-labelledby="recorrer-title">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Fase 5 jurídico/processo</p>
            <h3 id="recorrer-title">Atos externos bloqueados</h3>
          </div>
          <span>Copiloto, não representante</span>
        </div>

        <div className="appeal-box">
          <div>
            <p className="eyebrow">Recurso</p>
            <h4>Intenção separada das razões</h4>
            <span>{appealIntent.groundsSummary}</span>
          </div>
          <div className="appeal-status">
            <strong>{appealIntent.submissionStatus}</strong>
            <small>Intenção: {appealIntent.windowStatus}</small>
            <small>Razões: {appealReasons.draftStatus}</small>
          </div>
        </div>

        <div className="decision-points">
          {decisionPoints.map((decision) => {
            const da = legalDecisionAction(decision);
            return (
              <div className="decision-point" key={decision.id}>
                <div>
                  <strong>{da.action}</strong>
                  <p>
                    <strong>{da.owner}</strong> — {da.note}
                  </p>
                </div>
                <span>{da.externalBlocked ? "ato externo bloqueado" : "preparo interno"}</span>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}
