/**
 * EMISSOR de NFS-e (módulo #4 · CONTEXT §3) — read model + dados SINTÉTICOS.
 *
 * Co-localizado em app/emissor/ DE PROPÓSITO: este módulo é um add-on autocontido
 * (gancho de margem, modelo de revenda) e NÃO toca lib/api.ts, packages/* nem nada
 * fora de app/emissor/. Tudo aqui é demo navegável com base sintética — a emissão
 * real (credenciamento ADN / NFS-e Nacional) é Fase 7.
 *
 * G6 (doc 45 §5): a tributação é SUGERIDA pelo motor contra uma base de referência
 * sintética e fica SUJEITA À CONFIRMAÇÃO do contador (ato humano). Nada aqui afirma
 * "tributação correta", "apuração correta" nem "crédito garantido": é um indício
 * com auto-auditoria que o contador revisa e confirma antes de gerar o rascunho.
 */

/** Cliente demo do emissor (IDs idênticos ao seed do core — CONTEXT §4). */
export interface ClienteEmissor {
  id: string;
  nome: string;
  documento: string;
  /** Município de competência do ISS/NFS-e (apresentação). */
  municipio: string;
  /** Regime tributário (informa a sugestão de cClassTrib). */
  regime: string;
  /** Atividade predominante — ancora a base de referência sugerida. */
  ramo: string;
}

/** Os 3 clientes demo (mesmos IDs do seed: ...a1 / ...a2 / ...a3). */
export const CLIENTES_EMISSOR: ReadonlyArray<ClienteEmissor> = [
  {
    id: "00000000-0000-4000-8000-0000000000a1",
    nome: "Farmácia Aurora Ltda (demo)",
    documento: "11222333000181",
    municipio: "Lages / SC",
    regime: "Lucro Presumido",
    ramo: "Comércio varejista de medicamentos",
  },
  {
    id: "00000000-0000-4000-8000-0000000000a2",
    nome: "Posto Brasa Combustíveis ME (demo)",
    documento: "22333444000172",
    municipio: "Chapecó / SC",
    regime: "Simples Nacional",
    ramo: "Comércio de combustíveis e serviços de lavagem",
  },
  {
    id: "00000000-0000-4000-8000-0000000000a3",
    nome: "Mercado Cedro — Bebidas SA (demo)",
    documento: "33444555000163",
    municipio: "Florianópolis / SC",
    regime: "Lucro Real",
    ramo: "Comércio varejista de bebidas",
  },
];

export function clienteEmissorById(id: string): ClienteEmissor | undefined {
  return CLIENTES_EMISSOR.find((c) => c.id === id);
}

/**
 * Sugestão de tributação para um serviço (saída do motor, SINTÉTICA).
 *
 * É o que o sistema PROPÕE — não um veredito. `confere` indica se a sugestão bate
 * com a base de referência do ramo (auto-auditoria); `revisar` sinaliza divergência
 * que o contador precisa olhar antes de confirmar.
 */
export interface SugestaoTributaria {
  /** Código de Classificação Tributária da Reforma (CBS/IBS). */
  cclasstrib: string;
  /** Descrição legível do enquadramento sugerido. */
  enquadramento: string;
  /** Código do serviço (lista LC 116) sugerido. */
  itemServico: string;
  /** Alíquota efetiva estimada sobre o valor do serviço [0..1]. */
  aliquotaEstimada: number;
  /** Base normativa citada (fundamento da régua sintética). */
  fundamento: string[];
  /** Resultado da auto-auditoria contra a base de referência. */
  autoAuditoria: "confere" | "revisar";
  /** Frase G6-safe explicando o resultado da auto-auditoria. */
  autoAuditoriaNota: string;
}

/**
 * Motor de SUGESTÃO sintético. Heurística determinística por ramo + palavras-chave
 * da descrição. Não consulta API nem promete acerto: produz um indício auto-auditado
 * que o contador confirma. (Em produção, isto vem do motor fiscal com golden-set.)
 */
export function sugerirTributacao(
  cliente: ClienteEmissor,
  descricao: string,
  _valor: number,
): SugestaoTributaria {
  const desc = descricao.toLowerCase();

  // Sinais que levantam a flag de "revisar" na auto-auditoria (divergência potencial).
  const indicioDivergencia =
    desc.includes("import") ||
    desc.includes("exterior") ||
    desc.includes("software") ||
    desc.includes("licen") ||
    desc.includes("misto") ||
    desc.length < 8;

  const base: SugestaoTributaria =
    cliente.regime === "Simples Nacional"
      ? {
          cclasstrib: "000001",
          enquadramento: "Operação tributável integralmente (regra geral · Simples)",
          itemServico: "14.01 — manutenção e conservação",
          aliquotaEstimada: 0.06,
          fundamento: [
            "LC 214/2025 — cClassTrib base da Reforma (CBS/IBS)",
            "LC 116/2003 — lista de serviços (ISS de transição)",
          ],
          autoAuditoria: "confere",
          autoAuditoriaNota:
            "Sugestão bate com a base de referência sintética do ramo. Sujeito à confirmação do contador.",
        }
      : cliente.regime === "Lucro Real"
        ? {
            cclasstrib: "000004",
            enquadramento: "Operação tributável com crédito (regra geral · não-cumulativo)",
            itemServico: "17.01 — assessoria / consultoria",
            aliquotaEstimada: 0.0925,
            fundamento: [
              "LC 214/2025 — cClassTrib base da Reforma (CBS/IBS)",
              "Regime não-cumulativo — apropriação de crédito na entrada",
            ],
            autoAuditoria: "confere",
            autoAuditoriaNota:
              "Sugestão bate com a base de referência sintética do ramo. Sujeito à confirmação do contador.",
          }
        : {
            cclasstrib: "000002",
            enquadramento: "Operação tributável integralmente (regra geral · Presumido)",
            itemServico: "07.02 — execução de serviços",
            aliquotaEstimada: 0.0779,
            fundamento: [
              "LC 214/2025 — cClassTrib base da Reforma (CBS/IBS)",
              "LC 116/2003 — lista de serviços (ISS de transição)",
            ],
            autoAuditoria: "confere",
            autoAuditoriaNota:
              "Sugestão bate com a base de referência sintética do ramo. Sujeito à confirmação do contador.",
          };

  if (indicioDivergencia) {
    return {
      ...base,
      cclasstrib: "999999",
      enquadramento: "Enquadramento indefinido — possível regra específica (importação/licença/misto)",
      autoAuditoria: "revisar",
      autoAuditoriaNota:
        "A descrição sugere uma regra específica que a base sintética não fixa (importação, licenciamento ou serviço misto). Régua em controvérsia — revisão humana antes de confirmar.",
      fundamento: [
        ...base.fundamento,
        "Indício de regra específica — sem referência fixa na base sintética (G6)",
      ],
    };
  }

  return base;
}

/** Estado de uma nota no emissor (demo: rascunho ou emitida-demo). */
export type StatusNota = "rascunho" | "emitida_demo";

/** Nota sintética da lista de emitidas. */
export interface NotaEmitida {
  id: string;
  numero: string;
  clienteNome: string;
  servico: string;
  valor: number;
  cclasstrib: string;
  status: StatusNota;
  /** Quem confirmou (ato humano) — null para rascunho ainda não confirmado. */
  confirmadoPor: string | null;
  /** ISO da geração do documento (rascunho/emitida-demo). */
  geradoEm: string;
}

/** Lista sintética de notas já passadas pelo fluxo (demo navegável). */
export const NOTAS_EMITIDAS: ReadonlyArray<NotaEmitida> = [
  {
    id: "nfse-demo-0001",
    numero: "DEMO-2026-000128",
    clienteNome: "Farmácia Aurora Ltda (demo)",
    servico: "Manutenção de equipamento de refrigeração",
    valor: 1240.0,
    cclasstrib: "000002",
    status: "emitida_demo",
    confirmadoPor: "Marina Reis · CRC SC-018432/O",
    geradoEm: "2026-06-18T14:22:00-03:00",
  },
  {
    id: "nfse-demo-0002",
    numero: "DEMO-2026-000127",
    clienteNome: "Posto Brasa Combustíveis ME (demo)",
    servico: "Lavagem e higienização de frota",
    valor: 680.5,
    cclasstrib: "000001",
    status: "emitida_demo",
    confirmadoPor: "Marina Reis · CRC SC-018432/O",
    geradoEm: "2026-06-17T09:05:00-03:00",
  },
  {
    id: "nfse-demo-0003",
    numero: "DEMO-2026-000126",
    clienteNome: "Mercado Cedro — Bebidas SA (demo)",
    servico: "Consultoria de layout e exposição de produtos",
    valor: 3500.0,
    cclasstrib: "000004",
    status: "emitida_demo",
    confirmadoPor: "Marina Reis · CRC SC-018432/O",
    geradoEm: "2026-06-16T16:48:00-03:00",
  },
  {
    id: "nfse-demo-0004",
    numero: "(rascunho)",
    clienteNome: "Mercado Cedro — Bebidas SA (demo)",
    servico: "Licenciamento de software de PDV (serviço misto)",
    valor: 2200.0,
    cclasstrib: "999999",
    status: "rascunho",
    confirmadoPor: null,
    geradoEm: "2026-06-19T11:12:00-03:00",
  },
  {
    id: "nfse-demo-0005",
    numero: "(rascunho)",
    clienteNome: "Farmácia Aurora Ltda (demo)",
    servico: "Treinamento de equipe sobre dispensação",
    valor: 950.0,
    cclasstrib: "000002",
    status: "rascunho",
    confirmadoPor: null,
    geradoEm: "2026-06-19T08:30:00-03:00",
  },
];

/** Apresentação do status da nota (cor + glyph + label) — espelha lib/status.ts. */
export const STATUS_NOTA: Record<
  StatusNota,
  { variant: "neutral" | "success"; glyph: string; label: string }
> = {
  rascunho: { variant: "neutral", glyph: "✎", label: "Rascunho" },
  emitida_demo: { variant: "success", glyph: "▤", label: "Emitida (demo)" },
};

/**
 * Contador habilitado (CRC ativo) que confirma o ato no fluxo. SINTÉTICO — espelha
 * o "ato privativo" do core (aprovacao-model). Em produção viria do tenant.
 */
export const CONTADOR_DEMO = {
  nome: "Marina Reis",
  crc: "SC-018432/O",
  habilitacao: "Contadora habilitada · CRC ativo",
} as const;

/**
 * Painel de revenda (CONTEXT §3: "contador compra pacote e revende"). Números são
 * ILUSTRAÇÃO COMERCIAL — não um preço fechado.
 */
export interface PacoteRevenda {
  emissores: number;
  custoPacoteMes: number;
  precoSugeridoRevendaMes: number;
}

export const PACOTE_REVENDA_EXEMPLO: PacoteRevenda = {
  emissores: 5,
  custoPacoteMes: 250,
  precoSugeridoRevendaMes: 50,
};

/** Margem ilustrativa do pacote de revenda (receita de revenda − custo do pacote). */
export function margemRevenda(p: PacoteRevenda): {
  receitaRevenda: number;
  custo: number;
  margem: number;
} {
  const receitaRevenda = p.emissores * p.precoSugeridoRevendaMes;
  return { receitaRevenda, custo: p.custoPacoteMes, margem: receitaRevenda - p.custoPacoteMes };
}
