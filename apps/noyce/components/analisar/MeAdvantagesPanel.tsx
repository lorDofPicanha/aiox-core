"use client";

// Painel "Trunfos de ME/EPP" (Tier 1, 30/Jun): mostra as vantagens legais da ENIAC como ME e a
// AÇÃO concreta para usá-las (empate ficto, exclusividade ≤R$80k, regularização fiscal tardia).
import { eniacCcp } from "@/lib/noyce-data";
import { buildMeAdvantages } from "@/lib/noyce-me-advantages";
import type { EditalRequirementsModel, Opportunity } from "@/lib/noyce-model";

export function MeAdvantagesPanel({
  opportunity,
  erm,
}: {
  opportunity: Pick<Opportunity, "estimatedValue" | "market">;
  erm: EditalRequirementsModel | undefined;
}) {
  const adv = buildMeAdvantages({
    ccp: eniacCcp,
    estimatedValue: opportunity.estimatedValue,
    modalidade: erm?.meta.modalidade,
    market: opportunity.market,
  });
  if (adv.length === 0) return null;

  return (
    <section className="me-adv" aria-labelledby="me-adv-title">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Trunfos de ME/EPP — vantagens legais</p>
          <h3 id="me-adv-title">Usar a lei a seu favor para vencer</h3>
        </div>
        <span>{adv.length} trunfo(s)</span>
      </div>
      {adv.map((a, i) => (
        <div className={`me-adv-row ${a.impacto}`} key={a.kind + i}>
          <strong>{a.titulo}</strong>
          <p>{a.detalhe}</p>
          <p className="me-adv-acao">▸ {a.acao}</p>
          <small>{a.fonte}</small>
        </div>
      ))}
    </section>
  );
}
