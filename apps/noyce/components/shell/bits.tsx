// Shared presentational bits used across area tabs.
import { formatCurrency, scoreHealth } from "@/lib/noyce-model";
import type { Grounding, MarketStructure } from "@/lib/noyce-model";

export function Metric({
  label,
  value,
  tone,
  note,
}: {
  label: string;
  value: string;
  tone: "blue" | "amber" | "red" | "green";
  note?: string;
}) {
  return (
    <div className={`metric ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {note ? <small>{note}</small> : null}
    </div>
  );
}

export function ScorePill({ label, value }: { label: string; value: number }) {
  return (
    <div className={`score ${scoreHealth(value)}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function ScoreBreakdownList({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; value: number; max: number; reason: string }>;
}) {
  return (
    <div className="score-breakdown-list">
      <h4>{title}</h4>
      {items.map((item) => (
        <div className="score-factor" key={`${title}-${item.label}`}>
          <div>
            <strong>{item.label}</strong>
            <p>{item.reason}</p>
          </div>
          <span>
            {item.value}/{item.max}
          </span>
        </div>
      ))}
    </div>
  );
}

export function GroundingChip({ grounding }: { grounding: Grounding }) {
  const label = grounding === "grounded" ? "dado real" : grounding === "inferred" ? "inferência" : "fora do PNCP";
  return <em className={`grounding ${grounding}`}>{label}</em>;
}

export function MarketSection({ market }: { market: MarketStructure | null }) {
  if (!market) {
    return (
      <section className="decision-grid" aria-label="Preco e concorrencia">
        <div className="analysis-panel market-empty">
          <div className="panel-heading">
            <p className="eyebrow">Concorrência</p>
            <h3>Dados insuficientes neste órgão</h3>
          </div>
          <p className="market-foot">
            Sem histórico recuperável no PNCP — órgão fora do raio mapeado ou fonte com valor sigiloso (ex.: bolsa
            privada/estatal). Não inventamos concorrente.
          </p>
          <p className="market-action">
            <strong>Próximo passo:</strong> cadastrar o CNPJ do órgão no monitoramento e rodar o ingestor PNCP em lote
            para reconstruir o histórico de vencedores.
          </p>
        </div>
      </section>
    );
  }

  const { priceBand, competitors } = market;
  const covLabel = market.coveragePct === null ? "n/d" : `${Math.round(market.coveragePct * 100)}%`;

  return (
    <section className="decision-grid" aria-label="Preco e concorrencia">
      <div className="analysis-panel">
        <div className="panel-heading">
          <p className="eyebrow">Preço · faixa real do órgão</p>
          <h3>Mediana {formatCurrency(priceBand.medianBRL)}</h3>
        </div>
        <div className="price-row">
          <span>P25 · piso de disputa</span>
          <strong>{formatCurrency(priceBand.p25BRL)}</strong>
        </div>
        <div className="price-row">
          <span>Mediana · abertura sugerida</span>
          <strong>{formatCurrency(priceBand.medianBRL)}</strong>
        </div>
        <div className="price-row">
          <span>P75 · teto histórico</span>
          <strong>{formatCurrency(priceBand.p75BRL)}</strong>
        </div>
        <p className="market-foot">
          Base: {priceBand.sampleSize} contratos de obras vencidos <GroundingChip grounding={priceBand.grounding} />
        </p>
        <p className="market-action">
          <strong>Ação:</strong> abra na mediana, fixe o piso em P25 e valide a composição de custo antes da sessão —
          abaixo do P25 a margem aperta.
        </p>
      </div>

      <div className="analysis-panel">
        <div className="panel-heading">
          <p className="eyebrow">Concorrência · quem vence obras aqui</p>
          <h3>
            <span className={`conc-badge ${market.concentration}`}>{market.concentration}</span>
          </h3>
          <small className="market-sub">
            HHI {market.hhi} · {market.distinctWinners} concorrentes · cobertura {covLabel}
            {market.coverageProvisional ? "*" : ""}
          </small>
        </div>
        {competitors.map((competitor) => (
          <div className="competitor-row" key={competitor.cnpj}>
            <span>{competitor.sharePct}%</span>
            <strong>
              {competitor.isIncumbent ? "★ " : ""}
              {competitor.name}
            </strong>
            <p className="competitor-meta">
              CNPJ {competitor.cnpj} · {competitor.winCount}× · {formatCurrency(competitor.totalWonBRL)}{" "}
              <GroundingChip grounding={competitor.grounding} />
            </p>
            <p>{competitor.howToBeat}</p>
          </div>
        ))}
        <p className="market-foot">
          {market.obrasShareOfOrgao != null
            ? `${market.contractCount} de ${market.allContractCount} contratos do órgão são obras (${market.obrasShareOfOrgao}%). `
            : ""}
          Vencedores reais do PNCP ({market.windowMonths}m). Desconto e derrota-ENIAC = lacuna (PNCP expõe só o vencedor).
        </p>
        <p className="market-action">
          <strong>Invariante:</strong> concorrência é contexto de preço e estratégia — existe em todo lugar e{" "}
          <strong>nunca desclassifica</strong> uma oportunidade. Quem decide GO/NO-GO é a habilitação (acervo, PL,
          certidões), não o HHI.
        </p>
      </div>
    </section>
  );
}
