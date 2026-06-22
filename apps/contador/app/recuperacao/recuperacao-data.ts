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
  BANDA_RECUPERACAO,
  ESTAGIO_RECUPERACAO,
  VIA_RECEBIMENTO,
  calcularSplit,
  type CasoRecuperacao,
  type IndicioRecuperacao,
} from "./recuperacao-model";

/** Helper: monta o caso somando estimativas e derivando banda/split do conjunto. */
function montarCaso(args: {
  clienteId: string;
  clienteNome: string;
  segmento: string;
  estagio: keyof typeof ESTAGIO_RECUPERACAO;
  via: keyof typeof VIA_RECEBIMENTO;
  indicios: IndicioRecuperacao[];
}): CasoRecuperacao {
  const estimativaTotal = args.indicios.reduce((acc, i) => acc + i.estimativaRetroativo, 0);
  const severidade: Record<string, number> = { baixa: 0, media: 1, alta: 2 };
  let pior: keyof typeof BANDA_RECUPERACAO = "alta";
  for (const i of args.indicios) {
    if (severidade[i.banda] < severidade[pior]) pior = i.banda;
  }
  return {
    clienteId: args.clienteId,
    clienteNome: args.clienteNome,
    segmento: args.segmento,
    estagio: ESTAGIO_RECUPERACAO[args.estagio],
    bandaCaso: BANDA_RECUPERACAO[pior],
    indicios: args.indicios,
    estimativaTotal,
    viaSugerida: VIA_RECEBIMENTO[args.via],
    // Split ilustrativo ancorado na própria estimativa retroativa do caso.
    split: calcularSplit(estimativaTotal),
  };
}

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
      },
      {
        produto: "Perfumaria e cosméticos (revenda)",
        ncm: "3304.99.90",
        natureza: "Indício de PIS/COFINS recolhido em etapa já tributada na origem",
        banda: "media",
        estimativaRetroativo: 31_200,
        fundamento: "Lei 10.147/2000 Anexo · cosméticos monofásicos (a confirmar item a item)",
      },
      {
        produto: "Itens de conveniência (alíquota a verificar)",
        ncm: "2106.90.90",
        natureza: "Classificação tributária a revisar — pode não ser monofásico",
        banda: "baixa",
        estimativaRetroativo: 6_900,
        fundamento: "Sem referência fixa — depende de enquadramento do item (revisão obrigatória)",
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
      },
      {
        produto: "Lubrificantes (revenda)",
        ncm: "2710.19.32",
        natureza: "Item monofásico aparentemente tributado de novo na saída",
        banda: "media",
        estimativaRetroativo: 22_400,
        fundamento: "Lei 9.718/1998 · lubrificantes (a confirmar período a período)",
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
      },
      {
        produto: "Higiene pessoal e perfumaria",
        ncm: "3401.11.90",
        natureza: "Indício de itens monofásicos misturados com tributados normais",
        banda: "media",
        estimativaRetroativo: 18_600,
        fundamento: "Lei 10.147/2000 Anexo · higiene/perfumaria (item a item)",
      },
      {
        produto: "Mercearia seca (alíquota a verificar)",
        ncm: "1905.90.90",
        natureza: "Classificação a revisar — provável tributação normal, não monofásico",
        banda: "baixa",
        estimativaRetroativo: 4_100,
        fundamento: "Sem referência fixa — depende do enquadramento (revisão obrigatória)",
      },
    ],
  }),
];
