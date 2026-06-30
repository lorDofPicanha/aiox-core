"use client";

// Painel "Estratégia de habilitação técnica" (Tier 2, 30/Jun): diz se a ENIAC habilita SOZINHA pelo
// somatório das CATs e, havendo lacuna, recomenda consórcio (somatório de acervo) ou subcontratação 25%.
import { eniacCcp } from "@/lib/noyce-data";
import { buildTecnicoStrategy } from "@/lib/noyce-tecnico-strategy";
import type { EditalRequirementsModel, Opportunity } from "@/lib/noyce-model";

const VERDICT: Record<string, { label: string; cls: string }> = {
  solo: { label: "HABILITA SOZINHA", cls: "ok" },
  consorcio: { label: "LACUNA — CONSÓRCIO/SUBCONTRATAÇÃO", cls: "gap" },
  subcontratacao: { label: "LACUNA — SUBCONTRATAÇÃO", cls: "gap" },
  indeterminado: { label: "INDETERMINADO", cls: "ind" },
};

export function TecnicoStrategyPanel({
  erm,
}: {
  opportunity?: Pick<Opportunity, "id">;
  erm: EditalRequirementsModel | undefined;
}) {
  const s = buildTecnicoStrategy({ erm: erm ?? null, ccp: eniacCcp });
  const v = VERDICT[s.modo];

  return (
    <section className="tec-strategy" aria-labelledby="tec-strategy-title">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Estratégia de habilitação técnica — o gargalo real</p>
          <h3 id="tec-strategy-title">A ENIAC habilita sozinha neste edital?</h3>
        </div>
        <span className={`tec-verdict ${v.cls}`}>{v.label}</span>
      </div>

      {s.gaps.length > 0 ? (
        <table className="tec-gaps">
          <thead>
            <tr><th>Serviço exigido</th><th>Exigido</th><th>Acervo ENIAC (somatório)</th><th>Faltam</th></tr>
          </thead>
          <tbody>
            {s.gaps.map((g, i) => (
              <tr key={i}>
                <td>{g.servico}</td>
                <td>{g.exigido} {g.un}</td>
                <td>{g.disponivel} {g.un}</td>
                <td className="faltam">{g.faltam} {g.un}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <p className="tec-reco">{s.recomendacao}</p>
      {s.modo === "consorcio" ? <p className="tec-nota">{s.consorcioNota}</p> : null}
      <small className="tec-fonte">{s.fonte}</small>
    </section>
  );
}
