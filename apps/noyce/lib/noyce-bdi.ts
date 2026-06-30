// Validação do piso de preço com SINAPI/BDI (30/Jun) — fecha a open question da pesquisa.
// Fontes primárias: TCU Acórdão 2622/2013-Plenário (faixas de BDI por tipo de obra) + art. 23 da
// Lei 14.133/2021 (orçamento base = custo unitário ≤ mediana SINAPI) + art. 59 §§4-5 (exequibilidade).
//
// Insight central: orçamento = Custo Direto × (1 + BDI). Logo o piso de 75% (art. 59 §4º) equivale a
// receber 0,75×(1+BDI) do custo direto — com BDI ~22% isso é ~91,5% do custo direto (ABAIXO do custo).
// Por isso <75% é "presumido inexequível": só é seguro se o custo REAL da ENIAC < custo SINAPI de ref.
// 100% DETERMINÍSTICO.

export interface BdiBand {
  p25: number; // 1º quartil (%)
  medio: number; // mediano (%)
  p75: number; // 3º quartil — teto prático (%)
}

export type ObraTipo =
  | "edificios"
  | "rodovias"
  | "saneamento"
  | "energia"
  | "portuaria"
  | "fornecimento";

// TCU Acórdão 2622/2013-Plenário, BDI de referência (% sobre o custo direto).
export const TCU_BDI_2622: Record<ObraTipo, BdiBand> = {
  edificios: { p25: 20.34, medio: 22.12, p75: 25.0 },
  rodovias: { p25: 19.6, medio: 20.97, p75: 24.23 },
  saneamento: { p25: 20.76, medio: 24.18, p75: 26.44 },
  energia: { p25: 24.0, medio: 25.84, p75: 27.86 },
  portuaria: { p25: 22.8, medio: 27.48, p75: 30.95 },
  fornecimento: { p25: 11.1, medio: 14.02, p75: 16.8 },
};

const TIPO_LABEL: Record<ObraTipo, string> = {
  edificios: "Construção/reforma de edifícios",
  rodovias: "Rodovias e ferrovias",
  saneamento: "Água, esgoto e correlatas",
  energia: "Redes/estações de energia elétrica",
  portuaria: "Obras portuárias/marítimas/fluviais",
  fornecimento: "Fornecimento de materiais/equipamentos",
};

/** Classifica o tipo de obra pelo objeto (default: edifícios — o nicho da ENIAC). */
export function classifyObra(objeto: string | null | undefined): ObraTipo {
  const t = (objeto ?? "").toLowerCase();
  if (/rodovi|pavimenta|asfalt|ferrovi|estrada|terraplen|drenagem\s+via/.test(t)) return "rodovias";
  if (/esgoto|[áa]gua|saneamento|adutora|drenagem|ete\b|eta\b|reservat[óo]rio\s+de\s+[áa]gua/.test(t)) return "saneamento";
  if (/energia|el[ée]tric|subesta|linha\s+de\s+transmiss|rede\s+de\s+distribui/.test(t)) return "energia";
  if (/port[ouá]|mar[íi]tim|fluvial|dragagem|cais|atracaç/.test(t)) return "portuaria";
  if (/aquisi[çc][ãa]o|fornecimento\s+de\s+(material|equipamento|bem)/.test(t)) return "fornecimento";
  return "edificios";
}

function brl(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export interface PriceFloorInput {
  valorEstimado: number | null;
  objeto: string | null | undefined;
  /** Custo direto do orçamento (sem BDI), quando o orçamento analítico foi extraído. Senão estimado. */
  custoDireto?: number | null;
  /** BDI que a ENIAC consegue praticar (%). Default: 1º quartil do tipo (margem enxuta de ME). */
  bdiEniacPct?: number | null;
  pisoLegalPct?: number; // art. 59 §4º (default 0.75)
  garantiaPct?: number; // art. 59 §5º (default 0.85)
}

export interface PriceFloorAnalysis {
  tipo: ObraTipo;
  tipoLabel: string;
  band: BdiBand;
  /** BDI implícito do edital, se custoDireto conhecido; senão null. */
  bdiEditalPct: number | null;
  /** true se o BDI do edital está acima do 3º quartil (orçamento "gordo" — mais margem/impugnável). */
  bdiAcimaParadigma: boolean | null;
  custoDiretoEstimado: number;
  pisoLegal: number; // 75% do estimado
  faixaGarantia: number; // 85% do estimado
  /** Preço mínimo viável da ENIAC = custo direto × (1 + BDI ENIAC). Abaixo disso = prejuízo real. */
  breakEvenEniac: number;
  /** Quanto o piso legal representa do custo direto (×). <1 = piso abaixo do custo direto. */
  pisoSobreCusto: number;
  /** Lance competitivo seguro recomendado (entre o break-even e o piso legal, o que for maior). */
  lanceSeguro: number;
  resumo: string;
  alertas: string[];
  fonte: string;
}

/**
 * Valida o piso de preço cruzando exequibilidade (art. 59) com a estrutura de custo SINAPI/BDI (TCU 2622).
 * Diz onde a ENIAC pode lançar SEM vender abaixo do custo direto.
 */
export function buildPriceFloorAnalysis(input: PriceFloorInput): PriceFloorAnalysis | null {
  const { valorEstimado } = input;
  if (valorEstimado === null || !Number.isFinite(valorEstimado) || valorEstimado <= 0) return null;

  const tipo = classifyObra(input.objeto);
  const band = TCU_BDI_2622[tipo];
  const pisoLegalPct = input.pisoLegalPct ?? 0.75;
  const garantiaPct = input.garantiaPct ?? 0.85;

  // BDI de referência: o do edital (se custo direto conhecido) senão o mediano TCU do tipo.
  const bdiEditalPct =
    input.custoDireto && input.custoDireto > 0 ? (valorEstimado / input.custoDireto - 1) * 100 : null;
  const bdiRefPct = bdiEditalPct ?? band.medio;
  const custoDiretoEstimado = input.custoDireto && input.custoDireto > 0 ? input.custoDireto : valorEstimado / (1 + bdiRefPct / 100);

  const bdiEniacPct = input.bdiEniacPct ?? band.p25; // ME tende a BDI enxuto → 1º quartil
  const breakEvenEniac = custoDiretoEstimado * (1 + bdiEniacPct / 100);

  const pisoLegal = valorEstimado * pisoLegalPct;
  const faixaGarantia = valorEstimado * garantiaPct;
  const pisoSobreCusto = pisoLegal / custoDiretoEstimado;
  // Lance seguro: nunca abaixo do break-even da ENIAC, nunca abaixo do piso legal de exequibilidade.
  const lanceSeguro = Math.max(breakEvenEniac, pisoLegal);

  const bdiAcimaParadigma = bdiEditalPct === null ? null : bdiEditalPct > band.p75 + 0.01;

  const alertas: string[] = [];
  if (pisoSobreCusto < 1) {
    alertas.push(
      `O piso legal (${brl(pisoLegal)}, 75%) equivale a ${(pisoSobreCusto * 100).toFixed(0)}% do custo direto estimado — ABAIXO do custo. Só lance perto dele se seu custo real for menor que o SINAPI; do contrário, é prejuízo (e desclassificação por inexequibilidade, art. 59 §4º).`,
    );
  }
  if (bdiAcimaParadigma) {
    alertas.push(
      `BDI implícito do edital (${bdiEditalPct!.toFixed(1)}%) ACIMA do teto do paradigma TCU (${band.p75}%, ${tipo}) — orçamento possivelmente gordo: há margem maior para descontar (e fundamento para impugnar o orçamento, Súmula TCU 258).`,
    );
  }
  if (input.custoDireto == null) {
    alertas.push("Custo direto estimado por BDI mediano TCU (orçamento analítico do edital não extraído) — anexe a planilha orçamentária para precisão.");
  }

  const resumo =
    `Tipo: ${TIPO_LABEL[tipo]}. Orçamento ${brl(valorEstimado)} ≈ custo direto ${brl(custoDiretoEstimado)} × BDI ${bdiRefPct.toFixed(1)}%. ` +
    `Zona exequível: piso ${brl(pisoLegal)} (75%) · garantia adicional abaixo de ${brl(faixaGarantia)} (85%). ` +
    `Seu mínimo viável (custo + BDI ${bdiEniacPct.toFixed(1)}%): ${brl(breakEvenEniac)}. ` +
    `LANCE SEGURO recomendado: a partir de ${brl(lanceSeguro)}.`;

  return {
    tipo,
    tipoLabel: TIPO_LABEL[tipo],
    band,
    bdiEditalPct,
    bdiAcimaParadigma,
    custoDiretoEstimado: Math.round(custoDiretoEstimado),
    pisoLegal: Math.round(pisoLegal),
    faixaGarantia: Math.round(faixaGarantia),
    breakEvenEniac: Math.round(breakEvenEniac),
    pisoSobreCusto,
    lanceSeguro: Math.round(lanceSeguro),
    resumo,
    alertas,
    fonte: "TCU Acórdão 2622/2013 (BDI) + Lei 14.133 art. 23 (SINAPI) e art. 59 §§4-5 (exequibilidade)",
  };
}
