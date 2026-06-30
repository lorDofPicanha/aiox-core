"use client";

// Painel "Sugestões p/ vencer (histórico do órgão)" (30/Jun): mostra, agrupado por aba, o que a
// licitante pode ADICIONAR para aumentar a chance de vencer — derivado dos últimos meses de
// contratações parecidas do mesmo órgão. Cada item traz impacto, proveniência (grounding) e fonte.
import type { EditalRequirementsModel, Opportunity } from "@/lib/noyce-model";
import { WIN_TABS, WIN_TAB_LABEL, type WinSuggestion } from "@/lib/noyce-win-intel";
import { useWinIntel } from "@/components/analisar/useWinIntel";

const IMPACT_CHIP: Record<WinSuggestion["impacto"], string> = {
  alto: "⬆ alto",
  medio: "• médio",
  baixo: "▽ baixo",
};

const GROUNDING_CHIP: Record<WinSuggestion["grounding"], string> = {
  grounded: "dado real",
  inferred: "inferência",
  gap: "a confirmar",
};

export function WinIntelPanel({
  opportunity,
  erm,
  enabled = true,
}: {
  opportunity: Pick<Opportunity, "id" | "title" | "buyer" | "estimatedValue" | "market">;
  erm: EditalRequirementsModel | undefined;
  enabled?: boolean;
}) {
  const { byTab, status, llm, error, total, run } = useWinIntel(opportunity, erm, enabled);
  const market = opportunity.market ?? null;
  const tabsComItens = WIN_TABS.filter((t) => byTab[t].length > 0);

  return (
    <section className="win-intel" aria-labelledby="win-intel-title">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Inteligência competitiva — histórico do órgão</p>
          <h3 id="win-intel-title">O que adicionar para aumentar a chance de vencer</h3>
        </div>
        <span>
          {total} sugestão(ões)
          {status === "loading" ? " · lendo vencedores…" : llm ? " · IA ✓" : " · grounded"}
        </span>
      </div>

      {market ? (
        <p className="win-intel-coverage">
          Base: {market.contractCount} contrato(s) de {market.orgaoName} em {market.windowMonths} meses ·{" "}
          {market.distinctWinners} vencedor(es) · concentração {market.concentration}
          {market.coveragePct != null ? ` · cobertura ${market.coveragePct}%` : ""}.
        </p>
      ) : (
        <p className="win-intel-coverage">
          Sem histórico do órgão no raio amostrado — sugestões derivadas só das exigências do edital.
        </p>
      )}

      {error ? <p className="win-intel-note">{error}</p> : null}

      {total === 0 ? (
        <p className="win-intel-note">
          {status === "loading"
            ? "Analisando o padrão dos vencedores…"
            : "Sem sinal competitivo suficiente. Extraia o ERM do edital e confirme a cobertura do órgão."}
        </p>
      ) : (
        tabsComItens.map((tab) => (
          <div className="win-intel-tab" key={tab}>
            <h4>{WIN_TAB_LABEL[tab]}</h4>
            {byTab[tab].map((s, i) => (
              <div className={`victory-row ${s.impacto === "alto" ? "urgente" : "no_prazo"}`} key={`${tab}-${i}`}>
                <span className={`win-chip impacto-${s.impacto}`}>{IMPACT_CHIP[s.impacto]}</span>
                <div>
                  <strong>{s.titulo}</strong>
                  <p>{s.detalhe}</p>
                  {s.porque ? <p className="win-intel-why">Por quê: {s.porque}</p> : null}
                  <p className="win-intel-fonte">
                    <span className={`win-chip grounding-${s.grounding}`}>{GROUNDING_CHIP[s.grounding]}</span> {s.fonte}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      <div className="win-intel-actions">
        <button type="button" className="interest-btn" onClick={() => void run()} disabled={status === "loading"}>
          {status === "loading" ? "Analisando…" : llm ? "Re-analisar histórico" : "Analisar histórico do órgão"}
        </button>
      </div>
    </section>
  );
}
