/**
 * Catálogo dos SEEDS de notas-amostra do overlay Recuperação (Fase atual: MOTOR REAL
 * sobre notas-amostra). Cada cliente de foco alto-SKU/monofásico (farmácia, posto,
 * mercado — doc 05 §4) aponta para 1+ XML em `app/recuperacao/seeds/` que o engine
 * server-side parseia e roda no `detectarMonofasicoLote`.
 *
 * É metadata PURA (sem fs, sem server-only): só descreve QUAIS notas-amostra existem e
 * a identidade do cliente. O valor envolvido, a confiança, a banda e o fundamento do
 * indício são COMPUTADOS pelo motor a partir do XML (recuperacao-engine.ts) — não ficam
 * aqui hard-coded. Os campos *fallback são usados apenas se o motor abstiver/falhar.
 *
 * IDs canônicos exatos dos clientes (…a1/…a2/…a3 — CONTEXT). G6: nada aqui afirma
 * crédito garantido; cada item é uma nota-amostra sintética que o motor analisa.
 */
import {
  ESTAGIO_RECUPERACAO,
  VIA_RECEBIMENTO,
  type RegimeTributario,
} from "./recuperacao-model";

/** Um item-seed = uma nota-amostra XML que o motor vai analisar. */
export interface ItemSeed {
  /** Nome do produto exibido (rótulo legível do item da nota-amostra). */
  produto: string;
  /** Arquivo XML em app/recuperacao/seeds/ (lido server-side pelo engine). */
  arquivo: string;
  /** NCM esperado (fallback de exibição; o motor lê o NCM real do XML). */
  ncmEsperado: string;
  /** Fundamento de fallback caso o motor abstenha (sem apontamento → sem fundamento). */
  fundamentoFallback: string;
  /** Frase extra de natureza, anexada à descrição do motor (opcional). */
  naturezaExtra?: string;
}

/** Um cliente do dossiê e suas notas-amostra. */
export interface ClienteSeed {
  /** ID canônico exato do cliente (CONTEXT). */
  clienteId: string;
  clienteNome: string;
  segmento: string;
  /**
   * Regime tributário — define a alíquota da projeção ILUSTRATIVA (real=9,25% /
   * presumido=3,65%) ou, no Simples, marca "requer apuração" (segregação de receita).
   * O público da demo é majoritariamente Simples/Presumido, então variamos os 3 regimes.
   */
  regime: RegimeTributario;
  estagio: keyof typeof ESTAGIO_RECUPERACAO;
  via: keyof typeof VIA_RECEBIMENTO;
  itens: ItemSeed[];
}

/** 3 clientes demo (IDs exatos). Foco alto-SKU/monofásico (doc 05 §4). */
export const CLIENTES_SEED: ClienteSeed[] = [
  {
    clienteId: "cli-aurora-a1",
    clienteNome: "Farmácia Aurora",
    segmento: "Farmácia · alto SKU monofásico",
    regime: "real", // Lucro Real (não-cumulativo 9,25%)
    estagio: "com_tributarista",
    via: "rt",
    itens: [
      {
        produto: "Medicamento de referência (lista positiva)",
        arquivo: "cli-aurora-a1-medicamento.xml",
        ncmEsperado: "30049069",
        fundamentoFallback:
          "Lei 10.147/2000 · regime monofásico de medicamentos (sujeito a revisão do tributarista)",
      },
      {
        produto: "Perfumaria e cosméticos (revenda)",
        arquivo: "cli-aurora-a1-perfumaria.xml",
        ncmEsperado: "33049990",
        fundamentoFallback:
          "Lei 10.147/2000 Anexo · cosméticos monofásicos (a confirmar item a item)",
      },
      {
        produto: "Itens de conveniência (alíquota a verificar)",
        arquivo: "cli-aurora-a1-conveniencia.xml",
        ncmEsperado: "21069090",
        fundamentoFallback:
          "Sem referência fixa — depende de enquadramento do item (revisão obrigatória)",
      },
    ],
  },
  {
    clienteId: "cli-brasa-a2",
    clienteNome: "Posto Brasa",
    segmento: "Posto de combustíveis · monofásico",
    regime: "presumido", // Lucro Presumido (cumulativo 3,65%)
    estagio: "em_dossie",
    via: "rt",
    itens: [
      {
        produto: "Combustível para revenda (gasolina C)",
        arquivo: "cli-brasa-a2-combustivel.xml",
        ncmEsperado: "27101259",
        fundamentoFallback:
          "Lei 9.718/1998 art. 4º · combustíveis monofásicos (sujeito a análise)",
      },
      {
        produto: "Lubrificantes (revenda)",
        arquivo: "cli-brasa-a2-lubrificante.xml",
        ncmEsperado: "27101932",
        fundamentoFallback: "Lei 9.718/1998 · lubrificantes (a confirmar período a período)",
      },
    ],
  },
  {
    clienteId: "cli-cedro-a3",
    clienteNome: "Mercado Cedro",
    segmento: "Mercado/varejo · alto SKU misto",
    regime: "simples", // Simples Nacional → crédito por segregação de receita (não projeta por alíquota)
    estagio: "analise_previa",
    via: "rt",
    itens: [
      {
        produto: "Bebidas frias (refrigerantes e cervejas)",
        arquivo: "cli-cedro-a3-bebidas.xml",
        ncmEsperado: "22021000",
        fundamentoFallback: "Lei 13.097/2015 · bebidas frias monofásicas (sujeito a revisão)",
        naturezaExtra: "Família disputada (ST de ICMS varia por UF) — confiança rebaixada de propósito.",
      },
      {
        produto: "Higiene pessoal e perfumaria",
        arquivo: "cli-cedro-a3-higiene.xml",
        ncmEsperado: "34011190",
        fundamentoFallback: "Lei 10.147/2000 Anexo · higiene/perfumaria (item a item)",
      },
      {
        produto: "Mercearia seca (alíquota a verificar)",
        arquivo: "cli-cedro-a3-mercearia.xml",
        ncmEsperado: "19059090",
        fundamentoFallback:
          "Sem referência fixa — depende do enquadramento (revisão obrigatória)",
      },
    ],
  },
];
