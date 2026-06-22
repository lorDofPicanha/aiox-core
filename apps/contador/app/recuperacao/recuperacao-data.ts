/**
 * Dados SINTÉTICOS do overlay Recuperação (demo navegável — Fase 1).
 *
 * Auto-contido em app/recuperacao/: não importa do mock real (lib/api.ts) para deixar
 * óbvio que é base sintética e não tocar o acesso único. 3 clientes de foco alto-SKU /
 * monofásico (farmácia, posto, mercado — doc 05 §4), IDs canônicos exatos (…a1/…a2/…a3).
 *
 * Os valores são ESTIMATIVAS ILUSTRATIVAS. Nada aqui é crédito assegurado nem promessa
 * de recebimento — cada linha é um INDÍCIO ligado à auditoria, sujeito a análise e
 * revisão do tributarista habilitado (G6 — CONTEXT §5 #4).
 */
import {
  ANOS_RETROATIVOS,
  BANDA_RECUPERACAO,
  ESTAGIO_RECUPERACAO,
  VIA_RECEBIMENTO,
  calcularSplit,
  type AnoEstimativa,
  type BandaRecuperacao,
  type CasoRecuperacao,
  type EvidenciaItem,
  type IndicioRecuperacao,
} from "./recuperacao-model";

/**
 * Ano-base sintético do drill-down. Fixo (não usa Date.now()) para que os dados
 * SINTÉTICOS sejam determinísticos e reproduzíveis — a quebra ano a ano cobre os
 * 5 anos retroativos terminando em ANO_BASE (2025–2021). ILUSTRATIVO.
 */
export const ANO_BASE = 2025;

/** Pesos (mais recente → mais antigo) da distribuição sintética do retroativo por ano. */
const PESOS_ANO = [0.27, 0.23, 0.2, 0.17, 0.13];

/**
 * Deriva a quebra ano a ano (5 anos) de um indício a partir da estimativa total.
 * Distribuição sintética determinística: anos recentes concentram mais valor e
 * têm mais notas/maior confiança; anos antigos rebaixam a banda (menos evidência).
 * Os valores são ESTIMATIVAS ILUSTRATIVAS.
 */
function derivarPorAno(
  estimativaTotal: number,
  bandaIndicio: BandaRecuperacao,
): AnoEstimativa[] {
  const severidade: Record<BandaRecuperacao, number> = { baixa: 0, media: 1, alta: 2 };
  const escala: BandaRecuperacao[] = ["baixa", "media", "alta"];
  const anos: AnoEstimativa[] = [];
  let alocado = 0;
  for (let k = 0; k < ANOS_RETROATIVOS; k++) {
    const ano = ANO_BASE - k;
    const ultimo = k === ANOS_RETROATIVOS - 1;
    // O último ano absorve o resto para a soma fechar exatamente no total.
    const estimativa = ultimo
      ? Math.max(0, estimativaTotal - alocado)
      : Math.round(estimativaTotal * PESOS_ANO[k]);
    alocado += estimativa;
    // Anos antigos perdem 1 grau de confiança (mín. "baixa") — menos evidência.
    const degrau = k >= 3 ? 1 : 0;
    const idx = Math.max(0, severidade[bandaIndicio] - degrau);
    anos.push({
      ano,
      estimativa,
      // Mais notas nos anos recentes (sintético): 18 → 6 ao longo da janela.
      notas: 18 - k * 3,
      banda: escala[idx],
    });
  }
  return anos;
}

/** Helper: monta o caso somando estimativas e derivando banda/split/anos do conjunto. */
function montarCaso(args: {
  clienteId: string;
  clienteNome: string;
  segmento: string;
  estagio: keyof typeof ESTAGIO_RECUPERACAO;
  via: keyof typeof VIA_RECEBIMENTO;
  indicios: Array<Omit<IndicioRecuperacao, "porAno"> & { porAno?: AnoEstimativa[] }>;
}): CasoRecuperacao {
  const indicios: IndicioRecuperacao[] = args.indicios.map((i) => ({
    ...i,
    porAno: i.porAno ?? derivarPorAno(i.estimativaRetroativo, i.banda),
  }));
  const estimativaTotal = indicios.reduce((acc, i) => acc + i.estimativaRetroativo, 0);
  const severidade: Record<string, number> = { baixa: 0, media: 1, alta: 2 };
  let pior: keyof typeof BANDA_RECUPERACAO = "alta";
  for (const i of indicios) {
    if (severidade[i.banda] < severidade[pior]) pior = i.banda;
  }
  return {
    clienteId: args.clienteId,
    clienteNome: args.clienteNome,
    segmento: args.segmento,
    estagio: ESTAGIO_RECUPERACAO[args.estagio],
    bandaCaso: BANDA_RECUPERACAO[pior],
    indicios,
    estimativaTotal,
    viaSugerida: VIA_RECEBIMENTO[args.via],
    // Split ilustrativo ancorado na própria estimativa retroativa do caso.
    split: calcularSplit(estimativaTotal),
  };
}

/** Conjuntos de evidência reutilizáveis (sintéticos) — o que o dossiê reúne. */
const EV_XML: EvidenciaItem = {
  rotulo: "Notas de entrada (XML)",
  detalhe: "NF-e de aquisição com CST/NCM legíveis — base de 1ª classe para o indício.",
  banda: "alta",
};
const EV_APURACAO: EvidenciaItem = {
  rotulo: "Memória de apuração PIS/COFINS",
  detalhe: "Recolhimento do período cruzado com o regime do item (indício de duplicidade).",
  banda: "media",
};
const EV_NCM: EvidenciaItem = {
  rotulo: "Enquadramento de NCM",
  detalhe: "Classificação do item conferida contra a lista monofásica — a confirmar item a item.",
  banda: "media",
};
const EV_OCR: EvidenciaItem = {
  rotulo: "Cupons/relatórios (OCR)",
  detalhe: "Evidência de 2ª classe (extraída por OCR) — menor confiança, requer conferência.",
  banda: "baixa",
};

/** 3 clientes demo (IDs exatos). Foco alto-SKU/monofásico (doc 05 §4). */
export const CASOS_RECUPERACAO: CasoRecuperacao[] = [
  montarCaso({
    clienteId: "cli-aurora-a1",
    clienteNome: "Farmácia Aurora",
    segmento: "Farmácia · alto SKU monofásico",
    estagio: "com_tributarista",
    via: "rt",
    indicios: [
      {
        produto: "Medicamento de referência (lista positiva)",
        ncm: "3004.90.69",
        natureza: "Item monofásico aparentemente tributado como tributação normal na revenda",
        banda: "alta",
        estimativaRetroativo: 84_500,
        fundamento: "Lei 10.147/2000 · regime monofásico de medicamentos (sujeito a revisão do tributarista)",
        evidencias: [EV_XML, EV_APURACAO, EV_NCM],
      },
      {
        produto: "Perfumaria e cosméticos (revenda)",
        ncm: "3304.99.90",
        natureza: "Indício de PIS/COFINS recolhido em etapa já tributada na origem",
        banda: "media",
        estimativaRetroativo: 31_200,
        fundamento: "Lei 10.147/2000 Anexo · cosméticos monofásicos (a confirmar item a item)",
        evidencias: [EV_XML, EV_NCM],
      },
      {
        produto: "Itens de conveniência (alíquota a verificar)",
        ncm: "2106.90.90",
        natureza: "Classificação tributária a revisar — pode não ser monofásico",
        banda: "baixa",
        estimativaRetroativo: 6_900,
        fundamento: "Sem referência fixa — depende de enquadramento do item (revisão obrigatória)",
        evidencias: [EV_OCR, EV_NCM],
      },
    ],
  }),
  montarCaso({
    clienteId: "cli-brasa-a2",
    clienteNome: "Posto Brasa",
    segmento: "Posto de combustíveis · monofásico",
    estagio: "em_dossie",
    via: "rt",
    indicios: [
      {
        produto: "Combustível para revenda (gasolina C)",
        ncm: "2710.12.59",
        natureza: "Combustível em regime monofásico com indício de recolhimento em duplicidade",
        banda: "alta",
        estimativaRetroativo: 118_700,
        fundamento: "Lei 9.718/1998 art. 4º · combustíveis monofásicos (sujeito a análise)",
        evidencias: [EV_XML, EV_APURACAO, EV_NCM],
      },
      {
        produto: "Lubrificantes (revenda)",
        ncm: "2710.19.32",
        natureza: "Item monofásico aparentemente tributado de novo na saída",
        banda: "media",
        estimativaRetroativo: 22_400,
        fundamento: "Lei 9.718/1998 · lubrificantes (a confirmar período a período)",
        evidencias: [EV_XML, EV_NCM],
      },
    ],
  }),
  montarCaso({
    clienteId: "cli-cedro-a3",
    clienteNome: "Mercado Cedro",
    segmento: "Mercado/varejo · alto SKU misto",
    estagio: "analise_previa",
    via: "rt",
    indicios: [
      {
        produto: "Bebidas frias (refrigerantes e cervejas)",
        ncm: "2202.10.00",
        natureza: "Bebidas em regime monofásico com indício de tributação normal indevida",
        banda: "media",
        estimativaRetroativo: 47_300,
        fundamento: "Lei 10.833/2003 · bebidas frias monofásicas (sujeito a revisão)",
        evidencias: [EV_XML, EV_APURACAO, EV_NCM],
      },
      {
        produto: "Higiene pessoal e perfumaria",
        ncm: "3401.11.90",
        natureza: "Indício de itens monofásicos misturados com tributados normais",
        banda: "media",
        estimativaRetroativo: 18_600,
        fundamento: "Lei 10.147/2000 Anexo · higiene/perfumaria (item a item)",
        evidencias: [EV_XML, EV_NCM],
      },
      {
        produto: "Mercearia seca (alíquota a verificar)",
        ncm: "1905.90.90",
        natureza: "Classificação a revisar — provável tributação normal, não monofásico",
        banda: "baixa",
        estimativaRetroativo: 4_100,
        fundamento: "Sem referência fixa — depende do enquadramento (revisão obrigatória)",
        evidencias: [EV_OCR, EV_NCM],
      },
    ],
  }),
];
