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
 * Prestador (emitente) demo — o escritório/empresa que emite a NFS-e pelo emissor.
 * SINTÉTICO; em produção viria do tenant credenciado (Fase 7).
 */
export const PRESTADOR_DEMO = {
  nome: "Synkra Serviços Contábeis Ltda (demo)",
  documento: "44555666000154",
  municipio: "Lages / SC",
  inscricaoMunicipal: "DEMO-IM-90211",
  regime: "Lucro Presumido",
} as const;

/**
 * Catálogo de serviços demo (lista LC 116 + cClassTrib sugerido por item). Cada
 * entrada ancora a SUGESTÃO do motor: ao escolher um serviço do catálogo, o fluxo
 * pré-preenche descrição/valor e a heurística usa o item como dica. É SINTÉTICO —
 * a régua real virá do motor fiscal com golden-set (Fase 2+).
 */
export interface ServicoCatalogo {
  id: string;
  /** Rótulo curto exibido no seletor de catálogo. */
  rotulo: string;
  /** Descrição que preenche o campo do fluxo. */
  descricao: string;
  /** Item LC 116 sugerido para o serviço. */
  itemServico: string;
  /** Valor de referência (apenas pré-preenche; o contador ajusta). */
  valorReferencia: number;
  /** Dica de família (alimenta a heurística de sugestão). */
  familia:
    | "manutencao"
    | "consultoria"
    | "treinamento"
    | "limpeza"
    | "transporte"
    | "tecnologia"
    | "saude"
    | "obra";
}

export const CATALOGO_SERVICOS: ReadonlyArray<ServicoCatalogo> = [
  {
    id: "svc-manutencao",
    rotulo: "Manutenção e conservação de equipamento",
    descricao: "Manutenção de equipamento de refrigeração",
    itemServico: "14.01 — manutenção e conservação",
    valorReferencia: 1240,
    familia: "manutencao",
  },
  {
    id: "svc-consultoria",
    rotulo: "Consultoria / assessoria empresarial",
    descricao: "Consultoria de layout e exposição de produtos",
    itemServico: "17.01 — assessoria ou consultoria",
    valorReferencia: 3500,
    familia: "consultoria",
  },
  {
    id: "svc-treinamento",
    rotulo: "Treinamento e capacitação de equipe",
    descricao: "Treinamento de equipe sobre dispensação",
    itemServico: "08.02 — instrução e treinamento",
    valorReferencia: 950,
    familia: "treinamento",
  },
  {
    id: "svc-limpeza",
    rotulo: "Limpeza, higienização e conservação",
    descricao: "Lavagem e higienização de frota",
    itemServico: "07.10 — limpeza e conservação",
    valorReferencia: 680.5,
    familia: "limpeza",
  },
  {
    id: "svc-transporte",
    rotulo: "Transporte de bens / logística municipal",
    descricao: "Transporte e entrega de mercadorias no município",
    itemServico: "16.01 — transporte municipal",
    valorReferencia: 1480,
    familia: "transporte",
  },
  {
    id: "svc-tecnologia",
    rotulo: "Licenciamento de software (SaaS / PDV)",
    descricao: "Licenciamento de software de PDV (serviço misto)",
    itemServico: "01.05 — licenciamento de programa de computador",
    valorReferencia: 2200,
    familia: "tecnologia",
  },
  {
    id: "svc-saude",
    rotulo: "Serviço de saúde / aplicação farmacêutica",
    descricao: "Aplicação de medicamento injetável e aferição de pressão",
    itemServico: "04.07 — serviços farmacêuticos",
    valorReferencia: 320,
    familia: "saude",
  },
  {
    id: "svc-obra",
    rotulo: "Execução de obra / instalação predial",
    descricao: "Instalação de bancada e adequação predial do estabelecimento",
    itemServico: "07.02 — execução de obras de construção civil",
    valorReferencia: 5400,
    familia: "obra",
  },
];

export function servicoCatalogoById(id: string): ServicoCatalogo | undefined {
  return CATALOGO_SERVICOS.find((s) => s.id === id);
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
  /** Quebra dos tributos sugeridos por componente (apresentação no rascunho). */
  tributos: TributoComponente[];
  /** Base normativa citada (fundamento da régua sintética). */
  fundamento: string[];
  /** Resultado da auto-auditoria contra a base de referência. */
  autoAuditoria: "confere" | "revisar";
  /** Frase G6-safe explicando o resultado da auto-auditoria. */
  autoAuditoriaNota: string;
  /** Checagens individuais da auto-auditoria (✓ confere / ⚠ revisar + porquê). */
  checks: AuditoriaCheck[];
}

/** Componente de tributo sugerido (CBS/IBS/ISS de transição) — apresentação. */
export interface TributoComponente {
  /** Sigla do tributo (CBS, IBS, ISS). */
  sigla: string;
  /** Nome legível do tributo. */
  nome: string;
  /** Alíquota do componente sobre o valor do serviço [0..1]. */
  aliquota: number;
}

/** Resultado de uma checagem individual da auto-auditoria (item a item). */
export interface AuditoriaCheck {
  /** Rótulo do que foi checado (ex.: "cClassTrib bate com o ramo"). */
  rotulo: string;
  /** ✓ confere = ok; ⚠ revisar = divergência que o contador precisa olhar. */
  resultado: "confere" | "revisar";
  /** Explicação curta e G6-safe do porquê do resultado. */
  detalhe: string;
}

/** Soma das alíquotas dos componentes (alíquota efetiva estimada). */
export function aliquotaTotal(tributos: TributoComponente[]): number {
  return tributos.reduce((acc, t) => acc + t.aliquota, 0);
}

/**
 * Motor de SUGESTÃO sintético. Heurística determinística por ramo + palavras-chave
 * da descrição. Não consulta API nem promete acerto: produz um indício auto-auditado
 * que o contador confirma. (Em produção, isto vem do motor fiscal com golden-set.)
 */
export function sugerirTributacao(
  cliente: ClienteEmissor,
  descricao: string,
  valor: number,
): SugestaoTributaria {
  const desc = descricao.toLowerCase();

  // Sinais que levantam a flag de "revisar" na auto-auditoria (divergência potencial).
  const indicioImportacao = desc.includes("import") || desc.includes("exterior");
  const indicioLicenca =
    desc.includes("software") || desc.includes("licen") || desc.includes("saas");
  const indicioMisto = desc.includes("misto") || desc.includes("locac");
  const descricaoMagra = descricao.trim().length < 8;
  const indicioDivergencia =
    indicioImportacao || indicioLicenca || indicioMisto || descricaoMagra;

  // Valor fora de faixa típica do ramo também merece um olhar humano (≥ R$ 25 mil).
  const valorAtipico = valor >= 25000;

  // ---- Régua base por regime (heurística determinística, SINTÉTICA) ----
  const base: SugestaoTributaria =
    cliente.regime === "Simples Nacional"
      ? {
          cclasstrib: "000001",
          enquadramento: "Operação tributável integralmente (regra geral · Simples)",
          itemServico: "14.01 — manutenção e conservação",
          aliquotaEstimada: 0.06,
          tributos: [
            { sigla: "DAS", nome: "Simples Nacional (guia única)", aliquota: 0.06 },
          ],
          fundamento: [
            "LC 214/2025 — cClassTrib base da Reforma (CBS/IBS)",
            "LC 116/2003 — lista de serviços (ISS de transição)",
            "LC 123/2006 — Simples Nacional (recolhimento unificado)",
          ],
          autoAuditoria: "confere",
          autoAuditoriaNota:
            "Sugestão bate com a base de referência sintética do ramo. Sujeito à confirmação do contador.",
          checks: [],
        }
      : cliente.regime === "Lucro Real"
        ? {
            cclasstrib: "000004",
            enquadramento: "Operação tributável com crédito (regra geral · não-cumulativo)",
            itemServico: "17.01 — assessoria / consultoria",
            aliquotaEstimada: 0.0925,
            tributos: [
              { sigla: "CBS", nome: "Contribuição sobre Bens e Serviços", aliquota: 0.0265 },
              { sigla: "IBS", nome: "Imposto sobre Bens e Serviços", aliquota: 0.066 },
            ],
            fundamento: [
              "LC 214/2025 — cClassTrib base da Reforma (CBS/IBS)",
              "Regime não-cumulativo — apropriação de crédito na entrada",
            ],
            autoAuditoria: "confere",
            autoAuditoriaNota:
              "Sugestão bate com a base de referência sintética do ramo. Sujeito à confirmação do contador.",
            checks: [],
          }
        : {
            cclasstrib: "000002",
            enquadramento: "Operação tributável integralmente (regra geral · Presumido)",
            itemServico: "07.02 — execução de serviços",
            aliquotaEstimada: 0.0779,
            tributos: [
              { sigla: "CBS", nome: "Contribuição sobre Bens e Serviços", aliquota: 0.0265 },
              { sigla: "IBS", nome: "Imposto sobre Bens e Serviços", aliquota: 0.0514 },
            ],
            fundamento: [
              "LC 214/2025 — cClassTrib base da Reforma (CBS/IBS)",
              "LC 116/2003 — lista de serviços (ISS de transição)",
            ],
            autoAuditoria: "confere",
            autoAuditoriaNota:
              "Sugestão bate com a base de referência sintética do ramo. Sujeito à confirmação do contador.",
            checks: [],
          };

  // ---- Auto-auditoria item a item (✓ confere / ⚠ revisar + porquê) ----
  const checks: AuditoriaCheck[] = [];

  checks.push(
    descricaoMagra
      ? {
          rotulo: "Descrição do serviço",
          resultado: "revisar",
          detalhe:
            "Descrição muito curta para ancorar o item de serviço com segurança — detalhe o serviço antes de confirmar.",
        }
      : {
          rotulo: "Descrição do serviço",
          resultado: "confere",
          detalhe: "Descrição suficiente para ancorar o item LC 116 sugerido.",
        },
  );

  checks.push(
    indicioImportacao || indicioLicenca || indicioMisto
      ? {
          rotulo: "cClassTrib vs. base do ramo",
          resultado: "revisar",
          detalhe: indicioImportacao
            ? "Indício de operação com o exterior — pode haver regra específica de importação de serviço fora da régua geral."
            : indicioLicenca
              ? "Indício de licenciamento de software — enquadramento pode mudar (bem digital vs. serviço); sem referência fixa na base sintética."
              : "Indício de serviço misto/locação — pode exigir desmembramento da base de cálculo.",
        }
      : {
          rotulo: "cClassTrib vs. base do ramo",
          resultado: "confere",
          detalhe: `Compatível com a régua geral do ramo "${cliente.ramo}" no regime ${cliente.regime}.`,
        },
  );

  checks.push(
    valorAtipico
      ? {
          rotulo: "Materialidade do valor",
          resultado: "revisar",
          detalhe:
            "Valor acima da faixa típica da base sintética do ramo — confira se não há item agregado ou retenção aplicável.",
        }
      : {
          rotulo: "Materialidade do valor",
          resultado: "confere",
          detalhe: "Valor dentro da faixa típica da base de referência do ramo.",
        },
  );

  checks.push({
    rotulo: "Município de competência",
    resultado: "confere",
    detalhe: `Competência ${cliente.municipio} compatível com o estabelecimento do tomador.`,
  });

  // ---- Divergência → reescreve a sugestão para "revisar" (régua em controvérsia) ----
  if (indicioDivergencia) {
    return {
      ...base,
      cclasstrib: "999999",
      enquadramento:
        "Enquadramento indefinido — possível regra específica (importação / licença / misto)",
      autoAuditoria: "revisar",
      autoAuditoriaNota:
        "A descrição sugere uma regra específica que a base sintética não fixa (importação, licenciamento ou serviço misto). Régua em controvérsia — revisão humana antes de confirmar.",
      fundamento: [
        ...base.fundamento,
        "Indício de regra específica — sem referência fixa na base sintética (G6)",
      ],
      checks,
    };
  }

  // Sem divergência de régua, mas valor atípico ainda pede um olhar humano.
  if (valorAtipico) {
    return {
      ...base,
      autoAuditoria: "revisar",
      autoAuditoriaNota:
        "A régua do ramo confere, mas o valor está acima da faixa típica da base sintética — revisão humana antes de confirmar.",
      checks,
    };
  }

  return { ...base, checks };
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

/**
 * Cria uma NotaEmitida a partir do que o fluxo confirmou (estado client da sessão).
 * Determinístico nos campos vindos do fluxo; `geradoEm` usa o instante da confirmação.
 */
export function criarNotaEmitida(args: {
  id: string;
  numero: string;
  clienteNome: string;
  servico: string;
  valor: number;
  cclasstrib: string;
  confirmadoPor: string;
}): NotaEmitida {
  return {
    id: args.id,
    numero: args.numero,
    clienteNome: args.clienteNome,
    servico: args.servico,
    valor: args.valor,
    cclasstrib: args.cclasstrib,
    status: "emitida_demo",
    confirmadoPor: args.confirmadoPor,
    geradoEm: new Date().toISOString(),
  };
}

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

/** Faixas e limites da calculadora de revenda (ilustrativos — não preço fechado). */
export const REVENDA_LIMITES = {
  emissores: { min: 1, max: 50, passo: 1 },
  precoRevenda: { min: 0, max: 300, passo: 5 },
} as const;

/**
 * Resultado completo da calculadora de revenda interativa: receita, custo, margem,
 * margem por emissor e margem percentual. Tudo ILUSTRATIVO (CONTEXT §3 / G6).
 */
export interface ResultadoRevenda {
  receitaRevenda: number;
  custo: number;
  margem: number;
  margemPorEmissor: number;
  margemPercentual: number;
}

/**
 * Calcula a economia ilustrativa de um cenário de revenda arbitrário (calculadora
 * interativa). Números são exemplo comercial, não um preço fechado.
 */
export function calcularRevenda(
  emissores: number,
  precoRevendaMes: number,
  custoPacoteMes: number,
): ResultadoRevenda {
  const n = Math.max(0, Math.round(emissores));
  const receitaRevenda = n * Math.max(0, precoRevendaMes);
  const margem = receitaRevenda - custoPacoteMes;
  return {
    receitaRevenda,
    custo: custoPacoteMes,
    margem,
    margemPorEmissor: n > 0 ? margem / n : 0,
    margemPercentual: receitaRevenda > 0 ? margem / receitaRevenda : 0,
  };
}

/**
 * Custo do pacote escalonado por nº de emissores (degrau ilustrativo): mais emissores
 * = custo unitário menor. SINTÉTICO — preço real é definido na contratação.
 */
export function custoPacotePorEmissores(emissores: number): number {
  const n = Math.max(1, Math.round(emissores));
  const unitario = n <= 5 ? 50 : n <= 15 ? 42 : n <= 30 ? 36 : 30;
  return n * unitario;
}
