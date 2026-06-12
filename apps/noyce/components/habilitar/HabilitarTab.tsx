import type { Opportunity } from "@/lib/noyce-model";

const VERDICT_LABEL: Record<string, string> = {
  GO: "GO",
  GO_COM_TAREFAS: "GO com tarefas",
  PENDENTE_DADO: "Pendente de dado",
  NO_GO: "NO-GO",
};

export function HabilitarTab({ opportunity }: { opportunity: Opportunity }) {
  const result = opportunity.habilitationResult ?? null;
  const blocks = result ? Object.values(result.porBloco) : [];
  const sanaveis = result?.lacunas.filter((gap) => gap.sanabilidade === "SANAVEL") ?? [];
  const insanaveis = result?.lacunas.filter((gap) => gap.sanabilidade === "INSANAVEL") ?? [];

  return (
    <section className="area area-habilitar">
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
