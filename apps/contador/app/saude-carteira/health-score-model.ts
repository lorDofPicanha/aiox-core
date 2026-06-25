/**
 * S12 — Engine PURO do Health Score cross-módulo (o diferencial nº1 da frente e-CAC).
 *
 * "Só nós temos os 2 lados" (handoff 58 §4 / §6): este engine CRUZA, por cliente, os dois
 * sinais que ninguém mais junta numa leitura só —
 *   • LADO A (core/auditoria): divergências de cClassTrib + apontamentos por cliente
 *     (nº de indícios abertos, materialidade em disputa, baixa confiança / disputado).
 *   • LADO B (e-CAC/saúde fiscal): situação fiscal da carteira (intimações com prazo,
 *     CNDs vencidas/a vencer, mensagens não lidas) — já modelada em app/ecac/.
 *
 * O resultado é um SCORE DE EXPOSIÇÃO 0–100 (quanto MAIOR, mais saudável; quanto MENOR, mais
 * atenção) + uma BANDA (saudável / atenção / crítico) + um BREAKDOWN EXPLICÁVEL: cada fator que
 * puxou o score pra baixo, com o seu PESO nomeado e o NÚMERO-FONTE de cada um. Nada de número
 * mágico — os pesos são constantes documentadas (PESOS_FATOR).
 *
 * ┌─ O QUE ESTE SCORE É (e o que NÃO é) — G6 / human-in-loop / D9 ───────────────────────────┐
 * │ É um INDICADOR DE ATENÇÃO que prioriza a carteira. NÃO promete desfecho fiscal, NÃO       │
 * │ afirma "regularizado / em dia / sem risco / garantido / aprovado" e NÃO decide nem age.   │
 * │ É uma LEITURA cross-módulo READ-ONLY (D9): compõe os dois lados na CAMADA DE SCORE, sem    │
 * │ acoplar as trilhas/write-paths de nenhum deles (não chama registrarAnalise do core nem o  │
 * │ evento de trilha do e-CAC). Vocabulário: "indício", "situação fiscal", "atenção",         │
 * │ "score de exposição". A ação (revisar, renovar, responder) é do contador.                 │
 * └──────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * Pureza (CONTEXT §5): nenhuma função consulta rede/filesystem nem chama Date.now(). Os sinais
 * dos dois lados entram JÁ AGREGADOS por parâmetro (SinalCoreCliente / SinalEcacCliente), de
 * modo que o "hoje" — quando relevante — já foi resolvido pelos engines de origem (a triagem de
 * prazos do e-CAC roda com refIso na camada de dados). Determinístico e testável.
 */

// ===========================================================================
// Sinais de entrada — já agregados por cliente (os dois lados, sem dialeto)
// ===========================================================================

/**
 * Sinal do LADO A (core/auditoria) para UM cliente. É a SÍNTESE por cliente do que a Fila do
 * dia / a Carteira do core já expõem — derivado dos apontamentos pendentes (FilaLinha) na
 * camada de dados, não recalculado aqui. Sem jargão de coluna SQL.
 */
export interface SinalCoreCliente {
  /** Nº de apontamentos (indícios) pendentes de revisão do cliente. */
  indiciosAbertos: number;
  /** Indícios em banda "disputado" ou "baixa" (bloqueiam auto-aprovação — DESIGN §6.3). */
  indiciosBaixaConfianca: number;
  /** Materialidade total (R$) em disputa nos indícios pendentes do cliente. */
  materialidadeEmDisputa: number;
  /** Quantos dos indícios são divergência de cClassTrib (o eixo da Reforma — CONTEXT §3). */
  divergenciasCclasstrib: number;
}

/**
 * Sinal do LADO B (e-CAC/saúde fiscal) para UM cliente. É a SÍNTESE por cliente da triagem da
 * caixa postal (S3) e da fila de renovação de CND (S5) — derivada dos engines do e-CAC na
 * camada de dados (que já rodaram com o "hoje" por parâmetro). Aqui só entram contagens.
 */
export interface SinalEcacCliente {
  /** Intimações com prazo EXPIRADO ou vencendo HOJE (o subconjunto mais urgente da caixa). */
  prazosNoLimite: number;
  /** Intimações com prazo CURTO (dentro da janela urgente, ainda não no limite). */
  prazosUrgentes: number;
  /** CNDs com validade já vencida (indício de pendência sem certidão vigente). */
  cndsVencidas: number;
  /** CNDs a vencer dentro da janela monitorada (renovação sugerida). */
  cndsAVencer: number;
  /** Mensagens "!" (intimação/comunicado da Receita) ainda não lidas na caixa postal. */
  mensagensCriticasNaoLidas: number;
}

/** Os dois lados de um cliente, prontos para o score (já reconciliados por cliente). */
export interface EntradaHealthScore {
  clienteId: string;
  clienteNome: string;
  documento: string;
  /** Sinal do core (auditoria). null quando o cliente não existe no lado do core. */
  core: SinalCoreCliente | null;
  /**
   * Sinal do e-CAC. null quando NÃO há leitura e-CAC reconciliada para este cliente —
   * caso honesto (a reconciliação de carteira é explícita; ver health-score-data.ts).
   */
  ecac: SinalEcacCliente | null;
}

// ===========================================================================
// Pesos nomeados (NÃO mágicos) — quanto cada fator subtrai do score base 100
// ===========================================================================

/**
 * Identidade de cada FATOR que deprecia o score. Cada fator é um motivo explicável e ligado a
 * um número-fonte do breakdown. A ordem aqui é a ordem de exibição quando os impactos empatam.
 */
export type FatorId =
  // --- LADO A (core/auditoria) ---
  | "indicios_abertos"
  | "indicios_baixa_confianca"
  | "materialidade_em_disputa"
  | "divergencias_cclasstrib"
  // --- LADO B (e-CAC/saúde fiscal) ---
  | "prazos_no_limite"
  | "prazos_urgentes"
  | "cnds_vencidas"
  | "cnds_a_vencer"
  | "mensagens_criticas_nao_lidas";

/** De qual lado o fator vem (rótulo da seção no breakdown da UI). */
export type LadoFator = "core" | "ecac";

/** Definição de um fator: peso por unidade, teto de pontos e metadados de exibição. */
export interface DefinicaoFator {
  id: FatorId;
  lado: LadoFator;
  /** Rótulo curto e G6-safe (o "o quê"). */
  rotulo: string;
  /**
   * Pontos subtraídos POR UNIDADE do sinal. Para a materialidade (R$), a unidade é definida
   * por `unidadeMaterialidade` (ver baixo); para os demais, a unidade é "1 ocorrência".
   */
  pesoPorUnidade: number;
  /** Teto de pontos que este fator sozinho pode subtrair (evita um único fator zerar o score). */
  tetoPontos: number;
}

/**
 * Para a materialidade, "1 unidade" = R$ 5.000 em disputa (cada R$5k subtrai `pesoPorUnidade`).
 * Documentado e nomeado — não é número mágico. Escolhido para que materialidades de carteira
 * realistas (dezenas de milhares) movam o score de forma perceptível, mas com teto.
 */
export const UNIDADE_MATERIALIDADE_RS = 5000;

/**
 * Tabela de PESOS (doc-friendly). Calibração inicial (heurística honesta, não calibrada com
 * golden-set real — gate): os fatores de PRAZO FISCAL CORRENDO (intimação no limite, CND
 * vencida) pesam mais que indícios de auditoria pendentes, porque têm relógio externo; os
 * indícios de baixa confiança pesam mais que os de alta porque exigem revisão antes de aprovar.
 *
 * ⚠️ Os pesos são uma régua de PRIORIZAÇÃO, não um veredito fiscal. Recalibração com dados
 * reais é gate (adapters S1/S4 + golden-set — CONTEXT §5 #3).
 */
export const PESOS_FATOR: Record<FatorId, DefinicaoFator> = {
  // --- LADO A (core/auditoria) ---
  indicios_abertos: {
    id: "indicios_abertos",
    lado: "core",
    rotulo: "Indícios de auditoria pendentes de revisão",
    pesoPorUnidade: 4,
    tetoPontos: 24,
  },
  indicios_baixa_confianca: {
    id: "indicios_baixa_confianca",
    lado: "core",
    rotulo: "Indícios disputados / de baixa confiança (revisar antes de aprovar)",
    pesoPorUnidade: 7,
    tetoPontos: 28,
  },
  materialidade_em_disputa: {
    id: "materialidade_em_disputa",
    lado: "core",
    rotulo: "Materialidade em disputa (a cada R$ 5.000)",
    pesoPorUnidade: 3,
    tetoPontos: 18,
  },
  divergencias_cclasstrib: {
    id: "divergencias_cclasstrib",
    lado: "core",
    rotulo: "Divergências de cClassTrib (eixo da Reforma)",
    pesoPorUnidade: 5,
    tetoPontos: 20,
  },
  // --- LADO B (e-CAC/saúde fiscal) ---
  prazos_no_limite: {
    id: "prazos_no_limite",
    lado: "ecac",
    rotulo: "Intimações com prazo no limite (expirado ou vence hoje)",
    pesoPorUnidade: 16,
    tetoPontos: 40,
  },
  prazos_urgentes: {
    id: "prazos_urgentes",
    lado: "ecac",
    rotulo: "Intimações com prazo curto na caixa postal",
    pesoPorUnidade: 9,
    tetoPontos: 27,
  },
  cnds_vencidas: {
    id: "cnds_vencidas",
    lado: "ecac",
    rotulo: "CNDs vencidas (indício de pendência sem certidão vigente)",
    pesoPorUnidade: 8,
    tetoPontos: 32,
  },
  cnds_a_vencer: {
    id: "cnds_a_vencer",
    lado: "ecac",
    rotulo: "CNDs a vencer na janela (renovação sugerida)",
    pesoPorUnidade: 3,
    tetoPontos: 18,
  },
  mensagens_criticas_nao_lidas: {
    id: "mensagens_criticas_nao_lidas",
    lado: "ecac",
    rotulo: "Mensagens da Receita ainda não lidas",
    pesoPorUnidade: 2,
    tetoPontos: 12,
  },
};

/** Ordem canônica dos fatores no breakdown (lado core primeiro, depois e-CAC). */
export const FATOR_ORDER: FatorId[] = [
  "prazos_no_limite",
  "cnds_vencidas",
  "prazos_urgentes",
  "indicios_baixa_confianca",
  "divergencias_cclasstrib",
  "indicios_abertos",
  "materialidade_em_disputa",
  "cnds_a_vencer",
  "mensagens_criticas_nao_lidas",
];

// ===========================================================================
// Bandas do score (semáforo) — sempre redundante (cor + glyph + label)
// ===========================================================================

/** Banda do health score. NUNCA "regularizado/em dia/sem risco" — bandas de ATENÇÃO. */
export type BandaHealth = "saudavel" | "atencao" | "critico";

export interface BandaHealthView {
  banda: BandaHealth;
  variant: "success" | "warning" | "danger";
  glyph: string;
  label: string;
  /** Frase curta e G6-safe (o "por quê" da banda). */
  hint: string;
}

/**
 * Cortes das bandas (sobre o score 0–100):
 *  - score ≥ 80 → saudável  : poucos indícios de atenção na leitura cross-módulo.
 *  - 50 ≤ score < 80 → atenção : há indícios que merecem revisão priorizada.
 *  - score < 50 → crítico   : concentração de indícios com prazo/exposição — revisar primeiro.
 */
export const CORTE_SAUDAVEL = 80;
export const CORTE_ATENCAO = 50;

export const BANDA_HEALTH: Record<BandaHealth, BandaHealthView> = {
  saudavel: {
    banda: "saudavel",
    variant: "success",
    glyph: "▲",
    label: "Saudável",
    hint: "Poucos indícios de atenção na leitura cross-módulo. Indicador, não desfecho fiscal.",
  },
  atencao: {
    banda: "atencao",
    variant: "warning",
    glyph: "◆",
    label: "Atenção",
    hint: "Há indícios (auditoria e/ou situação fiscal) que merecem revisão priorizada do contador.",
  },
  critico: {
    banda: "critico",
    variant: "danger",
    glyph: "▼",
    label: "Crítico",
    hint: "Concentração de indícios com prazo/exposição. Sugerimos revisar primeiro — a ação é do contador.",
  },
};

/** Severidade (pior primeiro) — ordenação do ranking e KPIs. */
const PESO_BANDA: Record<BandaHealth, number> = {
  critico: 0,
  atencao: 1,
  saudavel: 2,
};

export function bandaDoScore(score: number): BandaHealth {
  if (score >= CORTE_SAUDAVEL) return "saudavel";
  if (score >= CORTE_ATENCAO) return "atencao";
  return "critico";
}

// ===========================================================================
// Breakdown explicável — cada fator com peso e número-fonte
// ===========================================================================

/** Um item do breakdown: o fator, o valor-fonte e quantos pontos ele subtraiu (após teto). */
export interface FatorImpacto {
  id: FatorId;
  lado: LadoFator;
  rotulo: string;
  /** O número-fonte que originou o impacto (nº de ocorrências, ou R$ para materialidade). */
  valorFonte: number;
  /** Unidade legível do valorFonte (para a UI: "ocorrência(s)" ou "R$"). */
  unidade: "ocorrencias" | "reais";
  /** Pontos subtraídos do score por este fator (já com o teto aplicado). */
  pontosSubtraidos: number;
}

/** Resultado completo do score de UM cliente — score + banda + breakdown explicável. */
export interface HealthScoreCliente {
  clienteId: string;
  clienteNome: string;
  documento: string;
  /** Score 0–100 (maior = mais saudável). Inteiro. */
  score: number;
  banda: BandaHealthView;
  /** Total de pontos subtraídos do base 100 (soma dos pontosSubtraidos, antes do clamp em 0). */
  totalSubtraido: number;
  /** Fatores que puxaram o score pra baixo, do maior impacto pro menor. Só os com impacto > 0. */
  breakdown: FatorImpacto[];
  /** true quando NÃO há leitura e-CAC reconciliada (score considera só o lado do core). */
  semLadoEcac: boolean;
  /** true quando NÃO há sinal do core (cliente só no e-CAC). */
  semLadoCore: boolean;
}

/** Quantidade-fonte de um fator a partir dos sinais (a "unidade" antes do peso). */
function valorFonteDoFator(
  id: FatorId,
  core: SinalCoreCliente | null,
  ecac: SinalEcacCliente | null,
): { valor: number; unidade: "ocorrencias" | "reais" } {
  switch (id) {
    case "indicios_abertos":
      return { valor: core?.indiciosAbertos ?? 0, unidade: "ocorrencias" };
    case "indicios_baixa_confianca":
      return { valor: core?.indiciosBaixaConfianca ?? 0, unidade: "ocorrencias" };
    case "materialidade_em_disputa":
      return { valor: core?.materialidadeEmDisputa ?? 0, unidade: "reais" };
    case "divergencias_cclasstrib":
      return { valor: core?.divergenciasCclasstrib ?? 0, unidade: "ocorrencias" };
    case "prazos_no_limite":
      return { valor: ecac?.prazosNoLimite ?? 0, unidade: "ocorrencias" };
    case "prazos_urgentes":
      return { valor: ecac?.prazosUrgentes ?? 0, unidade: "ocorrencias" };
    case "cnds_vencidas":
      return { valor: ecac?.cndsVencidas ?? 0, unidade: "ocorrencias" };
    case "cnds_a_vencer":
      return { valor: ecac?.cndsAVencer ?? 0, unidade: "ocorrencias" };
    case "mensagens_criticas_nao_lidas":
      return { valor: ecac?.mensagensCriticasNaoLidas ?? 0, unidade: "ocorrencias" };
  }
}

/** Converte o valor-fonte de um fator no nº de "unidades de peso" (materialidade → R$5k/unid). */
function unidadesDePeso(id: FatorId, valorFonte: number): number {
  if (id === "materialidade_em_disputa") {
    // Cada R$ 5.000 (UNIDADE_MATERIALIDADE_RS) = 1 unidade de peso (proporcional, não em degraus).
    return valorFonte / UNIDADE_MATERIALIDADE_RS;
  }
  return valorFonte;
}

/**
 * Calcula o health score de UM cliente (PURO). Começa em 100 e subtrai, por fator, o peso ×
 * unidades (com teto por fator). Faz clamp em [0, 100] e arredonda. O breakdown lista só os
 * fatores com impacto > 0, do maior pro menor (empate → FATOR_ORDER).
 *
 * Determinístico: nenhuma dependência de relógio. O "hoje" já foi resolvido a montante (os
 * sinais e-CAC chegam contados).
 */
export function calcularHealthScore(entrada: EntradaHealthScore): HealthScoreCliente {
  const { core, ecac } = entrada;
  const breakdown: FatorImpacto[] = [];
  let totalSubtraido = 0;

  for (const id of FATOR_ORDER) {
    const def = PESOS_FATOR[id];
    const { valor, unidade } = valorFonteDoFator(id, core, ecac);
    if (valor <= 0) continue;

    const bruto = unidadesDePeso(id, valor) * def.pesoPorUnidade;
    const pontos = Math.min(bruto, def.tetoPontos);
    if (pontos <= 0) continue;

    totalSubtraido += pontos;
    breakdown.push({
      id,
      lado: def.lado,
      rotulo: def.rotulo,
      valorFonte: valor,
      unidade,
      pontosSubtraidos: pontos,
    });
  }

  // Maior impacto primeiro; empate → ordem canônica (estável).
  breakdown.sort((a, b) => {
    if (b.pontosSubtraidos !== a.pontosSubtraidos) {
      return b.pontosSubtraidos - a.pontosSubtraidos;
    }
    return FATOR_ORDER.indexOf(a.id) - FATOR_ORDER.indexOf(b.id);
  });

  const score = Math.max(0, Math.min(100, Math.round(100 - totalSubtraido)));

  return {
    clienteId: entrada.clienteId,
    clienteNome: entrada.clienteNome,
    documento: entrada.documento,
    score,
    banda: BANDA_HEALTH[bandaDoScore(score)],
    totalSubtraido: Math.round(totalSubtraido * 100) / 100,
    breakdown,
    semLadoEcac: ecac == null,
    semLadoCore: core == null,
  };
}

// ===========================================================================
// Agregação da carteira — ranking por risco + resumo
// ===========================================================================

/** Resumo da carteira por health score (KPIs do cockpit). */
export interface ResumoHealth {
  total: number;
  criticos: number;
  atencao: number;
  saudaveis: number;
  /** Score médio da carteira (inteiro). null quando a carteira está vazia. */
  scoreMedio: number | null;
  /** Nº de clientes sem leitura e-CAC reconciliada (score só com o lado do core). */
  semLadoEcac: number;
}

/**
 * Calcula o ranking da carteira por RISCO (pior score primeiro) — PURO. Empate de score →
 * mais fatores de impacto primeiro, depois alfabético (estável).
 *
 * @param entradas os dois lados já reconciliados por cliente (de health-score-data.ts).
 */
export function rankearCarteira(entradas: EntradaHealthScore[]): HealthScoreCliente[] {
  const scores = entradas.map(calcularHealthScore);
  scores.sort((a, b) => {
    // Pior banda primeiro (crítico < atenção < saudável), depois menor score.
    const db = PESO_BANDA[a.banda.banda] - PESO_BANDA[b.banda.banda];
    if (db !== 0) return db;
    if (a.score !== b.score) return a.score - b.score;
    // Empate de score: maior EXPOSIÇÃO saturada primeiro (totalSubtraido pré-clamp). Dois
    // clientes no piso 0 com exposição muito diferente (ex.: 200 vs 105 pts) não empatam por
    // nome — o mais exposto sobe. Só então cai no nº de fatores e no nome (estável). (🟡-3)
    if (b.totalSubtraido !== a.totalSubtraido) return b.totalSubtraido - a.totalSubtraido;
    if (b.breakdown.length !== a.breakdown.length) return b.breakdown.length - a.breakdown.length;
    return a.clienteNome.localeCompare(b.clienteNome, "pt-BR");
  });
  return scores;
}

/** Agrega o resumo da carteira (PURO). */
export function resumirHealth(scores: HealthScoreCliente[]): ResumoHealth {
  if (scores.length === 0) {
    return { total: 0, criticos: 0, atencao: 0, saudaveis: 0, scoreMedio: null, semLadoEcac: 0 };
  }
  let criticos = 0;
  let atencao = 0;
  let saudaveis = 0;
  let semLadoEcac = 0;
  let somaScore = 0;
  for (const s of scores) {
    if (s.banda.banda === "critico") criticos += 1;
    else if (s.banda.banda === "atencao") atencao += 1;
    else saudaveis += 1;
    if (s.semLadoEcac) semLadoEcac += 1;
    somaScore += s.score;
  }
  return {
    total: scores.length,
    criticos,
    atencao,
    saudaveis,
    scoreMedio: Math.round(somaScore / scores.length),
    semLadoEcac,
  };
}
