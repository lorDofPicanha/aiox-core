import { formatCurrency, formatDateTime, scoreHealth } from "@/lib/noyce-model";
import type { Opportunity, SuspicionSignal } from "@/lib/noyce-model";
import { buildNextStep, lacunaTasks, operationalBlockers, operationalState } from "@/lib/noyce-operational";
import { MarketSection, ScoreBreakdownList } from "@/components/shell/bits";

const SUSPICION_DISCLAIMER =
  "Sinal baseado em dados públicos e na Lei 14.133 — indício para avaliação, não afirmação de irregularidade. Não substitui análise jurídica.";

type OpportunityWithSuspicion = Opportunity & { suspicionSignals?: SuspicionSignal[] };

const HABILITATION_LABEL: Record<string, string> = {
  GO: "GO",
  GO_COM_TAREFAS: "GO com tarefas",
  PENDENTE_DADO: "Pendente de dado",
  NO_GO: "NO-GO",
};

function impugnationWindowLabel(action: string): string {
  const match = /até (\d{4}-\d{2}-\d{2})/.exec(action);
  return match?.[1] ?? "conforme art. 164";
}

export function AnalisarTab({ opportunity }: { opportunity: Opportunity }) {
  const state = operationalState(opportunity);
  const nextAction = buildNextStep(opportunity);
  const lacunas = lacunaTasks(opportunity);
  const blockers = operationalBlockers(opportunity);
  const suspicionSignals = (opportunity as OpportunityWithSuspicion).suspicionSignals ?? [];
  const habilitationResult = opportunity.habilitationResult ?? null;

  return (
    <section className="area area-analisar">
      <div className="detail-header">
        <div>
          <p className="eyebrow">Decisão Noyce</p>
          <h2>{opportunity.title}</h2>
          <span>
            {opportunity.buyer} · {opportunity.city}/{opportunity.uf}
          </span>
        </div>
        <div className={`decision ${scoreHealth(opportunity.opportunityScore)}`}>
          <strong>{opportunity.opportunityScore}</strong>
          <span>{state.label}</span>
        </div>
      </div>

      <section className={`decision-summary ${nextAction.tone}`} aria-labelledby="decision-summary-title">
        <div>
          <p className="eyebrow">Próximo passo</p>
          <h3 id="decision-summary-title">{nextAction.headline}</h3>
          <span>
            <strong>{nextAction.owner}</strong>
            {nextAction.deadline ? ` · prazo ${formatDateTime(nextAction.deadline)}` : ""} — {nextAction.why}
          </span>
        </div>
        <div className="blocker-list" aria-label="Bloqueios para decisao">
          {blockers.map((blocker) => (
            <span key={blocker}>{blocker}</span>
          ))}
        </div>
      </section>

      <div className="detail-band">
        <div>
          <span>Elegibilidade</span>
          <strong>
            {habilitationResult ? HABILITATION_LABEL[habilitationResult.verdict] ?? habilitationResult.verdict : "ERM pendente"}
          </strong>
        </div>
        <div>
          <span>Valor</span>
          <strong>{formatCurrency(opportunity.estimatedValue)}</strong>
        </div>
        <div>
          <span>Prazo</span>
          <strong>{formatDateTime(opportunity.proposalDeadline)}</strong>
        </div>
        <div>
          <span>Confiança</span>
          <strong>{opportunity.confidenceScore}%</strong>
        </div>
      </div>

      <section className="evidence" aria-labelledby="evidence-title">
        <h3 id="evidence-title">Fatos, inferências e lacunas</h3>
        {opportunity.evidence.map((item) => (
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

      {lacunas.length > 0 ? (
        <section className="lacuna-tasks" aria-labelledby="lacuna-title">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Pendências → tarefas</p>
              <h3 id="lacuna-title">O que resolver antes de decidir</h3>
            </div>
            <span>{lacunas.filter((task) => task.blocking).length} bloqueante(s)</span>
          </div>
          {lacunas.map((task) => (
            <div className={`lacuna-row ${task.blocking ? "blocking" : ""}`} key={task.key}>
              <div>
                <strong>
                  {task.blocking ? "⛔ " : "• "}
                  {task.action}.
                </strong>
                <p>
                  {task.label} · <strong>{task.owner}</strong> · {task.impact}
                </p>
              </div>
              <span>{task.blocking ? "bloqueia" : "reduz confiança"}</span>
            </div>
          ))}
        </section>
      ) : null}

      {suspicionSignals.length > 0 ? (
        <section className="lacuna-tasks" aria-labelledby="suspicion-title">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Risco/Armadilha</p>
              <h3 id="suspicion-title">Exigências atípicas para revisão</h3>
            </div>
            <span>{suspicionSignals.length} sinal(is)</span>
          </div>
          {suspicionSignals.map((signal) => (
            <div className="lacuna-row blocking" key={`${signal.tipo}-${signal.evidenciaEdital.numero}`}>
              <div>
                <strong>
                  Risco/Armadilha: cláusula {signal.evidenciaEdital.numero} · {signal.hookLegal.artigo}.
                </strong>
                <p>
                  {signal.evidenciaEdital.trecho ?? signal.evidenciaEdital.texto} · Ação: {signal.acao} · Janela de
                  impugnação: {impugnationWindowLabel(signal.acao)}.
                </p>
                <p>{SUSPICION_DISCLAIMER}</p>
              </div>
              <span>{signal.severidade}</span>
            </div>
          ))}
        </section>
      ) : null}

      <MarketSection market={opportunity.market} />

      <section className="score-breakdown" aria-labelledby="score-breakdown-title">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">{opportunity.analysisRun.model}</p>
            <h3 id="score-breakdown-title">Componentes do score</h3>
          </div>
          <span>{opportunity.analysisRun.blockers.length} bloqueios</span>
        </div>
        <div className="score-grid">
          <ScoreBreakdownList title="Oportunidade" items={opportunity.analysisRun.opportunity.components} />
          <ScoreBreakdownList title="Confianca" items={opportunity.analysisRun.confidence.components} />
        </div>
      </section>
    </section>
  );
}
