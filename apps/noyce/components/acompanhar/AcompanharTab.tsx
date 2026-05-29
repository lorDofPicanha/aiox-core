import type { Opportunity } from "@/lib/noyce-model";

export function AcompanharTab({ opportunity }: { opportunity: Opportunity }) {
  return (
    <section className="area area-acompanhar">
      <section className="legal-process" aria-labelledby="windows-title">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Janelas processuais</p>
            <h3 id="windows-title">Prazo, risco e consequência</h3>
          </div>
          <span>Movimentação = dor #1</span>
        </div>
        <div className="legal-panel">
          {opportunity.legalProcess.events.map((event) => (
            <div className={`legal-event ${event.riskLevel}`} key={event.id}>
              <div>
                <strong>{event.label}</strong>
                <p>{event.consequenceIfMissed}</p>
              </div>
              <span>{event.riskLevel}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="timeline">
        <h3>Linha do tempo</h3>
        {opportunity.timeline.map((event) => (
          <div className={`time-row ${event.status}`} key={event.label}>
            <span />
            <div>
              <strong>{event.label}</strong>
              <p>{event.date}</p>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}
