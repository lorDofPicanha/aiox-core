/**
 * PAR-7 — Radar de Transação Tributária (engine PURO, complementar ao parcelamentos-model).
 *
 * INTELIGÊNCIA, NÃO AUTOMAÇÃO. A transação tributária (Lei 13.988/2020; editais PGFN /
 * Regularize; feirões de desconto) é matéria JURÍDICA e a adesão é ato MANUAL conduzido por
 * tributarista — NÃO há API de adesão (doc 55 §C; handoff 57 §3/§6). Este engine apenas
 * SINALIZA quais clientes da carteira são POTENCIALMENTE elegíveis a um edital de transação
 * em tese, e estima um GANCHO DE HONORÁRIO (modelo D6 — success-fee do escritório/tributarista,
 * linha separada), nunca "economia garantida" nem "redução da dívida".
 *
 * Por que um engine NOVO e não uma extensão do parcelamentos-model (portão handoff 57 §6):
 *   - parcelamentos-model classifica RISCO DE RESCISÃO de parcelamento ATIVO do Simples (regra
 *     dos 3 atrasos). É outro domínio: ali o cliente JÁ está parcelado; aqui ele tem DÍVIDA
 *     ATIVA inscrita (PGFN) e pode ou não vir a NEGOCIAR via transação. Domínios, regras e
 *     fontes distintos → arquivo próprio, sem tocar o model de rescisão (que segue intacto).
 *
 * Pureza (handoff 57 §5): sem rede, sem FS, sem Date.now(). "Hoje" entra por parâmetro
 * (`refIso`) — toda data (idade da dívida, prazo de edital) é derivada dele, determinística.
 *
 * G6 EXTRA-RIGOROSO (frente legal): nada aqui afirma desconto/quitação/regularização. As
 * faixas de desconto são as PERMITIDAS PELO EDITAL EM TESE (teto legal), nunca CONCEDIDAS.
 * O resultado é um INDÍCIO de elegibilidade + um GANCHO de honorário potencial. O tributarista
 * conduz a adesão; não há promessa de resultado nem de aprovação (depende de análise de
 * capacidade de pagamento e do edital vigente).
 */
import type { StatusView } from "@/lib/status";

// ===========================================================================
// Parâmetros NOMEADOS (heurística documentada — não há número mágico solto).
// Calibração inicial; recalibração com tributarista é FOLLOW-UP (ver page/relatório).
// Fontes: doc 55 §C (Lei 13.988/2020, Edital 6/2026 capacidade de pagamento, prazo 30/09/2026,
// descontos PERMITIDOS de até ~65% sobre o crédito / até 100% sobre juros-multa-encargos em
// teses do contencioso) + CONTEXT D6 (success-fee em linha separada).
// ===========================================================================

/**
 * Limiares de VALOR de dívida ativa (R$) que separam as faixas de porte. A modalidade
 * "capacidade de pagamento" (Edital 6/2026) e o "pequeno valor" têm tratamento distinto por
 * porte — por isso o radar usa o valor como eixo primário de triagem. Valores ILUSTRATIVOS
 * de calibração (recalibrar com o edital vigente + tributarista).
 */
export const FAIXA_VALOR_DA = {
  /** Abaixo disto: dívida muito pequena — gancho de honorário tende a não compensar (DM). */
  pisoMaterialidade: 5_000,
  /** [piso, tetoPequeno): pequeno valor / capacidade de pagamento típica. */
  tetoPequeno: 1_000_000,
  /** [tetoPequeno, tetoMedio): médio porte. */
  tetoMedio: 2_000_000,
  // ≥ tetoMedio: grande devedor (proposta individual; gancho alto, mais complexo).
} as const;

/**
 * Idade da dívida ativa (em dias) acima da qual a inscrição é "consolidada/antiga" — perfil
 * mais clássico de transação por capacidade de pagamento (débito maduro em DA, difícil de
 * quitar à vista). Abaixo disso a inscrição é RECENTE: pode ainda comportar parcelamento
 * ordinário ou estar sub judice → requer análise antes de tratar como transação.
 * ~540 dias ≈ 18 meses. Calibração ilustrativa.
 */
export const IDADE_DA_CONSOLIDADA_DIAS = 540;

/** Idade mínima (dias) para a dívida ser tratada como inscrita em DA "de fato" no radar. */
export const IDADE_DA_MINIMA_DIAS = 90;

/**
 * Faixa de DESCONTO PERMITIDA PELO EDITAL EM TESE (teto legal), por porte. NÃO é desconto
 * concedido — é o intervalo que o edital ADMITE em tese, sujeito à capacidade de pagamento
 * apurada e ao edital vigente (doc 55 §C). Usado só para CONTEXTUALIZAR a oportunidade, nunca
 * para prometer número. Fração de 0..1.
 */
export const DESCONTO_PERMITIDO_EM_TESE: Record<PorteDivida, { min: number; max: number }> = {
  pequeno: { min: 0.3, max: 0.65 },
  medio: { min: 0.2, max: 0.55 },
  grande: { min: 0.1, max: 0.4 },
};

/**
 * Percentual de GANCHO DE HONORÁRIO (success-fee do escritório/tributarista — D6) sobre o
 * VALOR DA DÍVIDA ATIVA, por porte. É a remuneração potencial do PROFISSIONAL pela condução
 * da negociação — NÃO "o que o cliente economiza". Faixa (min..max) por porte; quanto maior a
 * dívida, menor o % (escala). Calibração ilustrativa do mercado de honorário de êxito (opaco,
 * doc 55 §C / CONTEXT D6) — recalibrar com tributarista. Fração de 0..1.
 */
export const HONORARIO_SOBRE_DA: Record<PorteDivida, { min: number; max: number }> = {
  pequeno: { min: 0.05, max: 0.1 },
  medio: { min: 0.03, max: 0.07 },
  grande: { min: 0.015, max: 0.04 },
};

// ===========================================================================
// Tipos do domínio
// ===========================================================================

/** Porte da dívida ativa (eixo de triagem por valor). */
export type PorteDivida = "pequeno" | "medio" | "grande";

/** Situação do cliente quanto a parcelamento corrente — afeta a leitura da oportunidade. */
export type SituacaoParcelamento =
  | "sem_parcelamento" // não tem parcelamento ativo — perfil mais limpo p/ negociar a DA
  | "parcelamento_ativo" // já está em parcelamento em dia — transação pode não ser a via agora
  | "parcelamento_inadimplente"; // parcelamento em atraso/rompendo — DA pode reabrir

/** Regime tributário do cliente (contexto; não decide elegibilidade sozinho). */
export type RegimeTributario = "simples" | "presumido" | "real" | "mei";

/**
 * Capacidade de pagamento estimada do cliente — entra como FAIXA (não número fechado), pois
 * a CAPAG real é apurada na adesão pelo tributarista (doc 55 §C). É um INDÍCIO grosseiro do
 * fôlego do cliente, não a CAPAG oficial.
 */
export type CapacidadePagamento = "restrita" | "moderada" | "boa" | "desconhecida";

/** Nível de elegibilidade a editais de transação (semáforo). SEMPRE redundante (cor+glyph+label). */
export type NivelElegibilidade =
  | "forte" // perfil clássico: DA consolidada, porte que compensa o gancho, sem trava óbvia
  | "condicional" // elegível EM TESE, mas com ressalva (ex.: parcelamento ativo, CAPAG restrita)
  | "requer_analise" // dado insuficiente / sinais conflitantes → o tributarista precisa olhar
  | "nao_elegivel"; // sem dívida ativa relevante, ou dívida abaixo do piso de materialidade

export interface NivelElegibilidadeView extends StatusView {
  nivel: NivelElegibilidade;
  /** Frase curta G6-safe (o "onde estamos" da oportunidade). */
  hint: string;
}

export const NIVEL_ELEGIBILIDADE: Record<NivelElegibilidade, NivelElegibilidadeView> = {
  forte: {
    nivel: "forte",
    variant: "info",
    glyph: "◈",
    // Verbo de OBSERVAÇÃO, não de conclusão jurídica (subsunção = ato privativo de advogado).
    // "Indício de oportunidade" sinaliza; "elegível" concluiria — revisão legal Heleno (🔴-L1).
    label: "Indício forte de oportunidade",
    hint: "Perfil que, em tese, costuma comportar uma modalidade de transação. Não é juízo de elegibilidade — sujeito à análise de capacidade de pagamento e ao edital vigente; o tributarista é quem avalia e conduz a adesão.",
  },
  condicional: {
    nivel: "condicional",
    variant: "warning",
    glyph: "◇",
    label: "Indício de oportunidade (condicional)",
    hint: "Pode haver oportunidade em tese, mas há ressalva (ex.: parcelamento ativo ou fôlego restrito). Não é juízo de elegibilidade — depende da análise do tributarista e do edital vigente.",
  },
  requer_analise: {
    nivel: "requer_analise",
    variant: "neutral",
    glyph: "?",
    label: "Requer análise",
    hint: "Sinais insuficientes ou conflitantes para indicar uma oportunidade. O tributarista precisa analisar caso a caso. Sem promessa de resultado.",
  },
  nao_elegivel: {
    nivel: "nao_elegivel",
    variant: "neutral",
    glyph: "—",
    label: "Sem indício de oportunidade agora",
    hint: "Sem dívida ativa relevante (ou abaixo do piso de materialidade) no perfil sintético. Nada a sinalizar para transação no momento.",
  },
};

/**
 * Perfil fiscal de um cliente — a ENTRADA do radar, antes de classificar a elegibilidade.
 *
 * Este é o CONTRATO de domínio (handoff 57 §1, item 1). A dívida ativa REAL viria de um
 * adapter S6 (Infosimples / PGFN-Regularize — gate do founder); aqui é seed sintético. O
 * contrato é modelado para que o adapter real preencha depois SEM mexer no engine/UI (FF-1:
 * o dialeto SERPRO/Infosimples/PGFN fica isolado no adapter futuro, não vaza pra cá).
 *
 * clienteId reusa o ESQUEMA do parcelamentos ("cli-*") — NÃO inventamos um 4º esquema de id
 * (handoff 57 item 2). A unificação por CNPJ entre core(UUID)/e-CAC(curto)/parcelamento(cli-*)
 * é FOLLOW-UP explícito; aqui só reusamos o do parcelamento.
 */
export interface PerfilFiscalSeed {
  /** ID estável do perfil/cliente (mesmo esquema do parcelamentos: "cli-*"). */
  clienteId: string;
  clienteNome: string;
  segmento: string;
  regime: RegimeTributario;
  /** True se o cliente tem débito INSCRITO em dívida ativa (PGFN). Eixo central do radar. */
  inscritoDividaAtiva: boolean;
  /** Valor TOTAL em dívida ativa (R$). 0 quando não inscrito. Sintético/ilustrativo. */
  valorDividaAtiva: number;
  /** ISO da inscrição mais antiga em DA (idade da dívida). null quando não inscrito. */
  inscricaoMaisAntigaIso: string | null;
  situacaoParcelamento: SituacaoParcelamento;
  capacidadePagamento: CapacidadePagamento;
}

/** Um item do breakdown explicável (por que é elegível / qual a ressalva). */
export interface FatorBreakdown {
  /** Rótulo curto do fator (ex.: "Dívida ativa", "Idade da inscrição"). */
  rotulo: string;
  /** Valor legível do fator (ex.: "R$ 84.000", "≈ 22 meses"). */
  valor: string;
  /** Direção do fator na decisão. */
  efeito: "favorece" | "ressalva" | "neutro" | "bloqueia";
  /** Explicação G6-safe (em tese / indício / depende). */
  nota: string;
}

/** Gancho de honorário POTENCIAL (faixa) — modelo D6. NÃO é "economia do cliente". */
export interface GanchoHonorario {
  /** True quando há gancho estimável (porte acima do piso e elegível ≠ não-elegível). */
  estimavel: boolean;
  /** Piso da faixa de honorário potencial (R$). */
  min: number;
  /** Teto da faixa de honorário potencial (R$). */
  max: number;
  /** Ponto médio (R$) — usado só para RANKING, nunca exibido como "valor certo". */
  meio: number;
}

/** Resultado da classificação de um perfil (puro). */
export interface OportunidadeTransacao {
  perfil: PerfilFiscalSeed;
  nivel: NivelElegibilidadeView;
  porte: PorteDivida | null;
  /** Idade da inscrição em dias (na refIso). null quando não inscrito. */
  idadeDividaDias: number | null;
  /** Faixa de desconto PERMITIDA PELO EDITAL EM TESE (teto legal) — contexto, não promessa. */
  descontoPermitidoEmTese: { min: number; max: number } | null;
  /** Gancho de honorário potencial (D6 — success-fee do profissional). */
  gancho: GanchoHonorario;
  /** Breakdown explicável (por que / ressalvas). */
  breakdown: FatorBreakdown[];
  /** Caveats sempre presentes (frente legal — disclaimers por item). */
  caveats: string[];
}

// ===========================================================================
// Helpers determinísticos
// ===========================================================================

/** Diferença em dias corridos (b - a), truncada. Determinístico. */
function diffDias(aIso: string, bIso: string): number {
  const a = new Date(aIso).getTime();
  const b = new Date(bIso).getTime();
  return Math.floor((b - a) / (1000 * 60 * 60 * 24));
}

/** Classifica o porte pela faixa de valor da dívida ativa. null se abaixo do piso. */
export function porteDaDivida(valor: number): PorteDivida | null {
  if (valor < FAIXA_VALOR_DA.pisoMaterialidade) return null;
  if (valor < FAIXA_VALOR_DA.tetoPequeno) return "pequeno";
  if (valor < FAIXA_VALOR_DA.tetoMedio) return "medio";
  return "grande";
}

/** Caveats fixos da frente (sempre acompanham a oportunidade — disclaimers por item). */
const CAVEATS_BASE: string[] = [
  "A adesão à transação é ato MANUAL conduzido por tributarista habilitado; o sistema apenas sinaliza a oportunidade.",
  "Faixas de desconto são as PERMITIDAS pelo edital em tese (teto legal), não concedidas — dependem da capacidade de pagamento apurada e do edital vigente.",
  "Sem promessa de resultado nem de aprovação. O gancho de honorário é remuneração potencial do profissional (modelo de êxito), não economia do cliente.",
];

// ===========================================================================
// Núcleo: classificação de elegibilidade + gancho de honorário (PURO)
// ===========================================================================

/**
 * Calcula o gancho de honorário potencial (D6) a partir do valor da DA e do porte. Faixa
 * (min..max) = valorDA × percentual do porte. Só estimável quando há porte (acima do piso)
 * e a oportunidade não é "não elegível". NÃO é o que o cliente economiza.
 */
function calcularGancho(valorDA: number, porte: PorteDivida | null, elegivel: boolean): GanchoHonorario {
  if (!porte || !elegivel) {
    return { estimavel: false, min: 0, max: 0, meio: 0 };
  }
  const pct = HONORARIO_SOBRE_DA[porte];
  const min = Math.round(valorDA * pct.min);
  const max = Math.round(valorDA * pct.max);
  return { estimavel: true, min, max, meio: Math.round((min + max) / 2) };
}

/** Formata R$ inteiro de forma simples (o componente usa brl() na UI; aqui é só p/ breakdown). */
function rs(v: number): string {
  return `R$ ${Math.round(v).toLocaleString("pt-BR")}`;
}

/** Formata idade em meses aproximados para o breakdown. */
function meses(dias: number): string {
  return `≈ ${Math.round(dias / 30)} meses`;
}

/**
 * Classifica a elegibilidade de UM perfil fiscal a editais de transação + estima o gancho de
 * honorário (PURO). Heurística com regras NOMEADAS e breakdown explicável.
 *
 * Regras (ordem):
 *  1. Sem inscrição em DA, ou valor abaixo do piso de materialidade → NÃO ELEGÍVEL.
 *  2. Inscrição muito RECENTE (< IDADE_DA_MINIMA) → REQUER ANÁLISE (pode ser parcelável /
 *     sub judice; não tratar como DA consolidada para transação).
 *  3. CAPAG desconhecida em dívida relevante → REQUER ANÁLISE (falta sinal p/ indicar).
 *  4. Demais: começa em FORTE e REBAIXA por ressalvas:
 *       - parcelamento ATIVO em dia → condicional (a via pode ser manter o parcelamento);
 *       - parcelamento INADIMPLENTE → favorece (DA tende a reabrir — perfil de negociação);
 *       - CAPAG restrita → condicional (capacidade de pagamento apurada pode limitar);
 *       - dívida RECENTE (< consolidada) porém ≥ mínima → condicional (maturidade parcial).
 *
 * @param refIso data de referência (passada pela page) — idade da dívida e prazos derivam dela.
 */
export function classificarElegibilidade(
  perfil: PerfilFiscalSeed,
  refIso: string,
): OportunidadeTransacao {
  const breakdown: FatorBreakdown[] = [];
  const caveats = [...CAVEATS_BASE];

  // --- Regra 1: precisa de dívida ativa relevante ---
  const semDA = !perfil.inscritoDividaAtiva || perfil.valorDividaAtiva <= 0;
  const porte = semDA ? null : porteDaDivida(perfil.valorDividaAtiva);

  if (semDA) {
    breakdown.push({
      rotulo: "Dívida ativa (PGFN)",
      valor: "não inscrita",
      efeito: "neutro",
      nota: "Sem débito inscrito em dívida ativa no perfil sintético — transação não se aplica agora.",
    });
    return naoElegivel(perfil, breakdown, caveats);
  }

  if (porte === null) {
    breakdown.push({
      rotulo: "Dívida ativa (PGFN)",
      valor: rs(perfil.valorDividaAtiva),
      efeito: "bloqueia",
      nota: `Abaixo do piso de materialidade (${rs(FAIXA_VALOR_DA.pisoMaterialidade)}) — o gancho de honorário tende a não compensar. Sem sinalização agora.`,
    });
    return naoElegivel(perfil, breakdown, caveats);
  }

  // A partir daqui há dívida ativa acima do piso — registra o fator base.
  breakdown.push({
    rotulo: "Dívida ativa (PGFN)",
    valor: rs(perfil.valorDividaAtiva),
    efeito: "favorece",
    nota: `Débito inscrito em dívida ativa de porte "${porte}" — base para uma modalidade de transação aplicável em tese (edital vigente).`,
  });

  // --- Idade da inscrição ---
  const idadeDias = perfil.inscricaoMaisAntigaIso
    ? Math.max(0, diffDias(perfil.inscricaoMaisAntigaIso, refIso))
    : null;

  // --- Regra 2: inscrição muito recente → requer análise ---
  if (idadeDias !== null && idadeDias < IDADE_DA_MINIMA_DIAS) {
    breakdown.push({
      rotulo: "Idade da inscrição",
      valor: meses(idadeDias),
      efeito: "ressalva",
      nota: "Inscrição muito recente — pode ainda comportar parcelamento ordinário ou estar em discussão. O tributarista precisa analisar antes de tratar como transação.",
    });
    return requerAnalise(perfil, porte, idadeDias, breakdown, caveats);
  }

  // --- Regra 2b: dívida relevante SEM data de inscrição → requer análise (QA H1) ---
  // Sem a data, não há sinal de maturidade. O adapter S6 real (Infosimples/PGFN) pode devolver
  // DA inscrita sem data parseável; nesse caso NÃO promover a "forte" — coerente com as Regras
  // 2/3 (sinal insuficiente → o tributarista analisa). O seed nunca gera este caso.
  if (idadeDias === null) {
    breakdown.push({
      rotulo: "Idade da inscrição",
      valor: "não informada",
      efeito: "ressalva",
      nota: "A fonte não trouxe a data de inscrição em dívida ativa — sem esse sinal de maturidade, o tributarista precisa analisar antes de cogitar transação.",
    });
    return requerAnalise(perfil, porte, idadeDias, breakdown, caveats);
  }

  // --- Regra 3: CAPAG desconhecida em dívida relevante → requer análise ---
  if (perfil.capacidadePagamento === "desconhecida") {
    if (idadeDias !== null) {
      breakdown.push({
        rotulo: "Idade da inscrição",
        valor: meses(idadeDias),
        efeito: idadeDias >= IDADE_DA_CONSOLIDADA_DIAS ? "favorece" : "neutro",
        nota:
          idadeDias >= IDADE_DA_CONSOLIDADA_DIAS
            ? "Inscrição consolidada (madura em dívida ativa) — perfil clássico de transação por capacidade de pagamento, em tese."
            : "Inscrição em maturação.",
      });
    }
    breakdown.push({
      rotulo: "Capacidade de pagamento",
      valor: "desconhecida",
      efeito: "ressalva",
      nota: "Sem indício de fôlego financeiro — a capacidade de pagamento (CAPAG) é apurada na adesão pelo tributarista. Requer análise antes de sinalizar.",
    });
    return requerAnalise(perfil, porte, idadeDias, breakdown, caveats);
  }

  // --- Regra 4: tem DA relevante + CAPAG conhecida → começa FORTE, rebaixa por ressalvas ---
  let nivel: NivelElegibilidade = "forte";

  // Idade da inscrição.
  if (idadeDias !== null) {
    if (idadeDias >= IDADE_DA_CONSOLIDADA_DIAS) {
      breakdown.push({
        rotulo: "Idade da inscrição",
        valor: meses(idadeDias),
        efeito: "favorece",
        nota: "Inscrição consolidada (madura em dívida ativa) — perfil clássico de transação por capacidade de pagamento, em tese.",
      });
    } else {
      breakdown.push({
        rotulo: "Idade da inscrição",
        valor: meses(idadeDias),
        efeito: "ressalva",
        nota: "Inscrição ainda em maturação (não consolidada) — pode comportar outras vias; depende da análise do tributarista.",
      });
      if (nivel === "forte") nivel = "condicional";
    }
  }

  // Situação de parcelamento.
  if (perfil.situacaoParcelamento === "parcelamento_ativo") {
    breakdown.push({
      rotulo: "Parcelamento",
      valor: "ativo (em dia)",
      efeito: "ressalva",
      nota: "Já há parcelamento ativo — a via pode ser mantê-lo; transação da DA pode não ser o caminho agora. Depende da análise do tributarista.",
    });
    if (nivel === "forte") nivel = "condicional";
  } else if (perfil.situacaoParcelamento === "parcelamento_inadimplente") {
    breakdown.push({
      rotulo: "Parcelamento",
      valor: "inadimplente",
      efeito: "favorece",
      nota: "Parcelamento em atraso — a dívida tende a reabrir em cobrança; perfil em que negociar a DA por transação faz sentido em tese.",
    });
  } else {
    breakdown.push({
      rotulo: "Parcelamento",
      valor: "sem parcelamento",
      efeito: "favorece",
      nota: "Sem parcelamento ativo — perfil mais direto para negociar a dívida ativa via transação, em tese.",
    });
  }

  // Capacidade de pagamento.
  if (perfil.capacidadePagamento === "restrita") {
    breakdown.push({
      rotulo: "Capacidade de pagamento",
      valor: "restrita (indício)",
      efeito: "ressalva",
      nota: "Fôlego financeiro aparentemente restrito — a modalidade por capacidade de pagamento pode se aplicar, mas o desconto efetivo depende da CAPAG apurada. Depende de análise.",
    });
    if (nivel === "forte") nivel = "condicional";
  } else {
    breakdown.push({
      rotulo: "Capacidade de pagamento",
      valor: `${perfil.capacidadePagamento} (indício)`,
      efeito: "neutro",
      nota: "Indício de fôlego financeiro — a capacidade de pagamento oficial é apurada na adesão pelo tributarista.",
    });
  }

  const desconto = DESCONTO_PERMITIDO_EM_TESE[porte];
  const gancho = calcularGancho(perfil.valorDividaAtiva, porte, true);

  return {
    perfil,
    nivel: NIVEL_ELEGIBILIDADE[nivel],
    porte,
    idadeDividaDias: idadeDias,
    descontoPermitidoEmTese: desconto,
    gancho,
    breakdown,
    caveats,
  };
}

/** Monta um resultado NÃO ELEGÍVEL (sem gancho, sem desconto em tese). */
function naoElegivel(
  perfil: PerfilFiscalSeed,
  breakdown: FatorBreakdown[],
  caveats: string[],
): OportunidadeTransacao {
  return {
    perfil,
    nivel: NIVEL_ELEGIBILIDADE.nao_elegivel,
    porte: null,
    idadeDividaDias: null,
    descontoPermitidoEmTese: null,
    gancho: { estimavel: false, min: 0, max: 0, meio: 0 },
    breakdown,
    caveats,
  };
}

/** Monta um resultado REQUER ANÁLISE — há DA relevante, mas falta sinal para indicar. */
function requerAnalise(
  perfil: PerfilFiscalSeed,
  porte: PorteDivida,
  idadeDias: number | null,
  breakdown: FatorBreakdown[],
  caveats: string[],
): OportunidadeTransacao {
  // Em "requer análise" NÃO estimamos gancho (seria sugerir uma oportunidade que ainda não
  // se confirmou) — só contextualizamos o teto de desconto permitido em tese.
  return {
    perfil,
    nivel: NIVEL_ELEGIBILIDADE.requer_analise,
    porte,
    idadeDividaDias: idadeDias,
    descontoPermitidoEmTese: DESCONTO_PERMITIDO_EM_TESE[porte],
    gancho: { estimavel: false, min: 0, max: 0, meio: 0 },
    breakdown,
    caveats,
  };
}

// ===========================================================================
// Carteira: ranking + resumo (PURO)
// ===========================================================================

/** Peso de ordenação por nível (elegível-forte primeiro; não-elegível por último). */
const PESO_NIVEL: Record<NivelElegibilidade, number> = {
  forte: 0,
  condicional: 1,
  requer_analise: 2,
  nao_elegivel: 3,
};

/**
 * Classifica e ORDENA a carteira (PURO). Ordem: maior GANCHO DE HONORÁRIO POTENCIAL primeiro
 * (handoff 57 item 3), com o nível como desempate de prioridade. Determinístico a partir de
 * refIso.
 *
 * Critério primário = gancho.meio (ponto médio da faixa de honorário) DESC. Como "requer
 * análise" e "não elegível" não têm gancho estimável (meio=0), eles naturalmente afundam; o
 * nível desempata entre os de mesmo gancho (e ordena os sem-gancho entre si).
 */
export function classificarCarteiraTransacao(
  perfis: PerfilFiscalSeed[],
  refIso: string,
): OportunidadeTransacao[] {
  return perfis
    .map((p) => classificarElegibilidade(p, refIso))
    .sort((a, b) => {
      // 1) maior gancho de honorário potencial primeiro.
      const dg = b.gancho.meio - a.gancho.meio;
      if (dg !== 0) return dg;
      // 2) desempate: melhor nível de elegibilidade primeiro.
      const dn = PESO_NIVEL[a.nivel.nivel] - PESO_NIVEL[b.nivel.nivel];
      if (dn !== 0) return dn;
      // 3) desempate final: maior dívida ativa primeiro (estável).
      return b.perfil.valorDividaAtiva - a.perfil.valorDividaAtiva;
    });
}

/** Resumo agregado para os KPIs do topo. */
export interface ResumoTransacao {
  /** Total de perfis na carteira. */
  total: number;
  /** Potencialmente elegíveis (forte). */
  fortes: number;
  /** Potencialmente elegíveis (condicional). */
  condicionais: number;
  /** Requer análise. */
  requerAnalise: number;
  /** Não elegíveis agora. */
  naoElegiveis: number;
  /** Soma do PONTO MÉDIO do gancho de honorário potencial dos elegíveis (R$). Ilustrativo. */
  ganchoPotencialTotal: number;
}

/** Agrega os KPIs do topo (PURO). */
export function resumirTransacao(ops: OportunidadeTransacao[]): ResumoTransacao {
  let fortes = 0;
  let condicionais = 0;
  let requer = 0;
  let nao = 0;
  let ganchoTotal = 0;
  for (const o of ops) {
    switch (o.nivel.nivel) {
      case "forte":
        fortes += 1;
        break;
      case "condicional":
        condicionais += 1;
        break;
      case "requer_analise":
        requer += 1;
        break;
      case "nao_elegivel":
        nao += 1;
        break;
    }
    if (o.gancho.estimavel) ganchoTotal += o.gancho.meio;
  }
  return {
    total: ops.length,
    fortes,
    condicionais,
    requerAnalise: requer,
    naoElegiveis: nao,
    ganchoPotencialTotal: ganchoTotal,
  };
}

/** True se o nível indica oportunidade de transação a priorizar (forte ou condicional). */
export function ehOportunidade(nivel: NivelElegibilidade): boolean {
  return nivel === "forte" || nivel === "condicional";
}

/** Rótulo legível do regime (para a UI). */
export const REGIME_ROTULO: Record<RegimeTributario, string> = {
  simples: "Simples Nacional",
  presumido: "Lucro Presumido",
  real: "Lucro Real",
  mei: "MEI",
};

/** Rótulo legível do porte (para a UI). */
export const PORTE_ROTULO: Record<PorteDivida, string> = {
  pequeno: "pequeno valor / capacidade de pagamento",
  medio: "médio porte",
  grande: "grande devedor (proposta individual)",
};
