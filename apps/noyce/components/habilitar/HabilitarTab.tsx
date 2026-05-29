import type { Opportunity } from "@/lib/noyce-model";

export function HabilitarTab({ opportunity }: { opportunity: Opportunity }) {
  return (
    <section className="area area-habilitar">
      <section className="habilitation" aria-labelledby="habilitation-title">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Habilitação</p>
            <h3 id="habilitation-title">Checklist operacional</h3>
          </div>
          <span>Revisão humana obrigatória</span>
        </div>
        <div className="checklist-grid">
          {opportunity.habilitationChecklist.map((item) => (
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
