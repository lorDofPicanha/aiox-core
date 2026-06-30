"use client";

// Painel "Piso de preço (SINAPI/BDI)" (30/Jun): valida a zona exequível cruzando o art. 59 (75%/85%)
// com a estrutura de custo (TCU 2622 BDI), e diz o LANCE SEGURO sem vender abaixo do custo direto.
import { buildPriceFloorAnalysis } from "@/lib/noyce-bdi";
import type { Opportunity } from "@/lib/noyce-model";

function brl(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function PriceFloorPanel({
  opportunity,
}: {
  opportunity: Pick<Opportunity, "estimatedValue" | "title">;
}) {
  const a = buildPriceFloorAnalysis({ valorEstimado: opportunity.estimatedValue, objeto: opportunity.title });
  if (!a) return null;

  return (
    <section className="price-floor" aria-labelledby="price-floor-title">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Piso de preço — SINAPI / BDI (TCU 2622)</p>
          <h3 id="price-floor-title">Até onde dá para descontar sem ser desclassificado</h3>
        </div>
        <span>{a.tipoLabel}</span>
      </div>

      <div className="pf-bands">
        <div className="pf-band">
          <span>Custo direto estimado</span>
          <strong>{brl(a.custoDiretoEstimado)}</strong>
          <em>BDI ref. {a.band.p25}–{a.band.p75}%</em>
        </div>
        <div className="pf-band crit">
          <span>Piso legal (75%, art. 59)</span>
          <strong>{brl(a.pisoLegal)}</strong>
          <em>{(a.pisoSobreCusto * 100).toFixed(0)}% do custo direto</em>
        </div>
        <div className="pf-band warn">
          <span>Garantia adicional &lt; 85%</span>
          <strong>{brl(a.faixaGarantia)}</strong>
          <em>art. 59 §5º</em>
        </div>
        <div className="pf-band ok">
          <span>Lance seguro (recomendado)</span>
          <strong>{brl(a.lanceSeguro)}</strong>
          <em>≥ break-even {brl(a.breakEvenEniac)}</em>
        </div>
      </div>

      <p className="pf-resumo">{a.resumo}</p>
      {a.alertas.map((al, i) => (
        <p className="pf-alerta" key={i}>⚠️ {al}</p>
      ))}
      <small className="pf-fonte">{a.fonte}</small>
    </section>
  );
}
