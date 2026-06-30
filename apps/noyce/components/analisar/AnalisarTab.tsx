"use client";

import { formatCurrency, formatDateTime, scoreHealth } from "@/lib/noyce-model";
import { SCORE_AS_OF } from "@/lib/noyce-data";
import { buildVictoryPlan } from "@/lib/noyce-victory-plan";
import { useLiveChecklist } from "@/components/shell/useLiveChecklist";
import type { Opportunity, SuspicionSignal } from "@/lib/noyce-model";
import { buildNextStep, lacunaTasks, operationalBlockers, operationalState } from "@/lib/noyce-operational";
import { MarketSection, ScoreBreakdownList } from "@/components/shell/bits";
import { ReviewDossier } from "@/components/analisar/ReviewDossier";
import { WinIntelPanel } from "@/components/analisar/WinIntelPanel";
import { useWinIntel } from "@/components/analisar/useWinIntel";
import { useEditalErm } from "@/components/shell/useEditalErm";

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

export function AnalisarTab({
  opportunity,
  interested = false,
  onToggleInterest,
}: {
  opportunity: Opportunity;
  interested?: boolean;
  onToggleInterest?: () => void;
}) {
  const state = operationalState(opportunity);
  const liveChecklist = useLiveChecklist(opportunity);
  const victoryPlan = buildVictoryPlan({
    checklist: liveChecklist,
    proposalDeadline: opportunity.proposalDeadline,
    asOf: SCORE_AS_OF,
    reviewProgress: null,
  });
  const nextAction = buildNextStep(opportunity);
  const lacunas = lacunaTasks(opportunity);
  const blockers = operationalBlockers(opportunity);
  const suspicionSignals = (opportunity as OpportunityWithSuspicion).suspicionSignals ?? [];
  const habilitationResult = opportunity.habilitationResult ?? null;
  const { erm } = useEditalErm(opportunity);
  const winIntel = useWinIntel(opportunity, erm, interested);

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

      {interested ? (
        <ReviewDossier opportunity={opportunity} winByTab={winIntel.byTab} />
      ) : (
        <section className="review-invite" role="note">
          <p>
            Sem dossiê de revisão: esta licitação ainda não foi marcada como interesse.
            {onToggleInterest ? " Marque para o motor pré-preencher tudo que o certame vai precisar." : ""}
          </p>
          {onToggleInterest ? (
            <button type="button" className="interest-btn" onClick={onToggleInterest}>
              ☆ Tenho interesse — gerar dossiê
            </button>
          ) : null}
        </section>
      )}

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

      <section className="victory-plan" aria-labelledby="victory-plan-title">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Plano de Vitória</p>
            <h3 id="victory-plan-title">O que fazer, quem faz e até quando</h3>
          </div>
          <span>{victoryPlan.filter((a) => a.status === "atrasado" || a.status === "urgente").length} crítico(s)</span>
        </div>
        {victoryPlan.map((action) => (
          <div className={`victory-row ${action.status}`} key={action.id}>
            <span className={`victory-due ${action.status}`}>{action.dueLabel}</span>
            <div>
              <strong>{action.acao}</strong>
              <p>
                {action.dono} · {action.fonte}
              </p>
            </div>
            <em>{action.status === "atrasado" ? "⛔ atrasado" : action.status === "urgente" ? "⚠️ urgente" : "no prazo"}</em>
          </div>
        ))}
      </section>

      <MarketSection market={opportunity.market} />

      {interested ? <WinIntelPanel opportunity={opportunity} intel={winIntel} /> : null}

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
