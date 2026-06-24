/**
 * Engine de REPASSE / COMISSIONAMENTO do success-fee (overlay Recuperação — módulo #4).
 *
 * Transforma a calculadora ilustrativa 70/15/15 (`recuperacao-model.ts` → calcularSplit)
 * no SPLIT MULTI-PARTE real, em VALORES ABSOLUTOS, descrito na pesquisa
 * `docs/projects/contador/55-feature-research/10-comissionamento-repasse-ux.md`.
 *
 * Modelo adotado = INTERPRETAÇÃO B (recomendada, §2.3 do doc 10):
 *   o fee da plataforma incide sobre o SUCCESS-FEE (honorário de êxito), NÃO sobre o
 *   valor recuperado. A plataforma fica deliberadamente magra (recuperação é isca de
 *   aquisição — D6 do CONTEXT, não o ativo de LTV); o canal (escritório/contador) fica
 *   com a maior fatia → preserva o moat de distribuição (Renan).
 *
 * ⚠️ PENDÊNCIA P0 (C10.8 do doc 10) — base do fee da plataforma:
 *   A reunião precisa CRAVAR se o "5-7%" do Breno incide sobre o RECUPERADO (Interpretação A)
 *   ou sobre o SUCCESS-FEE (Interpretação B). Aqui implementamos B porque é a única leitura
 *   coerente com (a) os números absolutos da reunião (R$7.000 / R$2.000 / R$900), (b) D6
 *   (recuperação não precisa extrair LTV), (c) preservar o canal. Confirmar com founder/Renan
 *   antes de qualquer uso comercial.  [Interpretação B — pendente confirmação founder/Renan]
 *
 * Os 4 papéis canônicos (§2.1 do doc 10):
 *   1. Empresa cliente — recebe o valor recuperado LÍQUIDO (recuperado − success-fee total).
 *   2. Escritório/contador — o que sobra do success-fee após plataforma e indicador (a "mão-de-obra").
 *   3. Indicador — fatia da mão-de-obra (opcional; só quando houve indicação).
 *   4. Plataforma (nós) — fee fino sobre o success-fee.
 *
 * G6 (CONTEXT §5 #4): tudo aqui é ESTIMATIVA ILUSTRATIVA sobre base SINTÉTICA. Nada é
 * crédito assegurado nem promessa de valor — o success-fee só existe NO ÊXITO (restituição
 * confirmada), em linha separada (D6), e quem assina a PER/DCOMP é o tributarista habilitado.
 *
 * Função PURA e determinística (sem efeitos colaterais): a UI a chama para renderizar.
 * Auto-contido em app/recuperacao/ — não toca lib/, packages/* nem outros módulos.
 */

/** Papel canônico do split (ordem de exibição: empresa → contador → indicador → plataforma). */
export type PapelRepasse = "empresa" | "escritorio" | "indicador" | "plataforma";

/**
 * Configuração do split. Constantes por enquanto (Fase 1), mas ESTRUTURADAS para virar
 * config por contrato de escritório (fee da plataforma, travado na assinatura — §5.6 nunca
 * descontar) e por caso (success-fee, divisão mão-de-obra, indicador) — §5.3 do doc 10.
 */
export interface ConfigRepasse {
  /** % do success-fee TOTAL sobre o valor recuperado (por caso, dentro de 1-20% — §1.1). Ex.: 0.10 = 10%. */
  successFeeTotalPct: number;
  /**
   * % do fee da PLATAFORMA sobre o SUCCESS-FEE (Interpretação B — §2.3). Ex.: 0.09 = 9%
   * do honorário de êxito (≈ 0,9% do recuperado no exemplo da reunião → R$900 sobre R$10.000).
   * Travado na assinatura do contrato do escritório.
   */
  feePlataformaSobreSuccessFeePct: number;
  /**
   * Divisão da MÃO-DE-OBRA: fatia do ESCRITÓRIO sobre o que sobra do success-fee depois da
   * plataforma (eixo "mão-de-obra" do Renan — §2.4). Ex.: 0.70 (70/30) ou 0.60 (60/40).
   * O complemento (1 − este) é a fatia do indicador QUANDO há indicador.
   */
  divisaoEscritorioPct: number;
  /** Houve indicação? Se false, a fatia do indicador = R$0 e o escritório fica com a parte cheia. */
  temIndicador: boolean;
}

/**
 * Configuração-padrão do split (Fase 1 — Interpretação B). Com recuperado R$100.000:
 *   success-fee total (10%) = R$10.000
 *   ├─ plataforma (9% do success-fee) ...... R$   900   ← bate com o exemplo da reunião
 *   ├─ escritório (70% da mão-de-obra) ..... R$ 6.370
 *   └─ indicador  (30% da mão-de-obra) ..... R$ 2.730
 *   empresa cliente (líquido) .............. R$90.000
 *
 * Os R$7.000 / R$2.000 citados na reunião eram valores ILUSTRATIVOS de ordem de grandeza,
 * não um split fechado — implicariam uma divisão da mão-de-obra ≈77/23 em vez de 70/30. Aqui
 * usamos 70/30 (o exemplo pedido), com a plataforma cravada em R$900. A divisão exata da
 * mão-de-obra é configurável por caso (eixo do Renan) e deve ser cravada com founder/Renan.
 *
 * Estruturada como objeto para, na Fase 2, virar config por contrato/indicador (§5.3).
 */
export const CONFIG_REPASSE_PADRAO: ConfigRepasse = {
  successFeeTotalPct: 0.1, // 10% do recuperado (didático — §2.3; faixa de mercado 1-20%)
  feePlataformaSobreSuccessFeePct: 0.09, // 9% do success-fee ≈ R$900 sobre R$10.000 (Interpretação B)
  divisaoEscritorioPct: 0.7, // 70/30 escritório/indicador (eixo mão-de-obra do Renan)
  temIndicador: true,
};

/** Uma fatia do split, em VALOR ABSOLUTO (herói) + % (legenda secundária). */
export interface FatiaRepasse {
  papel: PapelRepasse;
  /** Rótulo curto exibido (G6-safe). */
  rotulo: string;
  /** Frase de uma linha que explica o que a parte recebe (legenda). */
  descricao: string;
  /** VALOR ABSOLUTO em R$ (o número-herói — §3.1 do doc 10). */
  valor: number;
  /** % SOBRE O RECUPERADO (legenda secundária — §3.2). Ex.: 0.07 = 7% do recuperado. */
  pctDoRecuperado: number;
  /** É a linha do usuário (escritório/contador) → destaque visual (§3.2). */
  destaque: boolean;
}

/** Resultado completo do cálculo de repasse (valores absolutos + invariantes verificados). */
export interface ResultadoRepasse {
  /** Valor recuperado-base usado no cálculo (R$, já corrigido SELIC — sintético/ilustrativo). */
  valorRecuperado: number;
  /** Success-fee total absoluto (R$) — o bolo do qual saem plataforma/escritório/indicador. */
  successFeeTotal: number;
  /** As fatias na ORDEM de exibição: empresa → escritório → indicador → plataforma. */
  fatias: FatiaRepasse[];
  /**
   * Guarda de "escritório-negativo" (§5.1): se a config deixaria o escritório no vermelho
   * (plataforma + indicador > success-fee), `valido=false` e a UI deve BLOQUEAR/alertar.
   */
  valido: boolean;
  /** Mensagem de alerta quando inválido (config tóxica — cenário da Interpretação A). */
  alerta?: string;
  /** Eco da config usada (para a legenda/tooltip de transparência). */
  config: ConfigRepasse;
}

/** Arredonda para reais inteiros (sem centavos — coerente com a UI sintética). */
function reais(n: number): number {
  return Math.round(n);
}

/**
 * Calcula o split de repasse em VALORES ABSOLUTOS (Interpretação B).
 *
 * Fórmula (§5.1 do doc 10):
 *   successFeeTotal  = recuperado × successFeeTotalPct
 *   fatiaPlataforma  = successFeeTotal × feePlataformaSobreSuccessFeePct      (fee fino sobre o fee)
 *   maoDeObra        = successFeeTotal − fatiaPlataforma                       (o que sobra pro canal)
 *   fatiaIndicador   = temIndicador ? maoDeObra × (1 − divisaoEscritorioPct) : 0
 *   fatiaEscritorio  = maoDeObra − fatiaIndicador
 *   liquidoCliente   = recuperado − successFeeTotal
 *
 * Invariantes (verificados, não só assumidos):
 *   plataforma + escritorio + indicador == successFeeTotal
 *   liquidoCliente + successFeeTotal     == recuperado
 *   escritorio >= 0  (senão config inválida → bloquear)
 *
 * @param valorRecuperado  R$ recuperados (ilustrativo). Clampado a >= 0.
 * @param config           parâmetros do split (default = CONFIG_REPASSE_PADRAO).
 */
export function calcularRepasse(
  valorRecuperado: number,
  config: ConfigRepasse = CONFIG_REPASSE_PADRAO,
): ResultadoRepasse {
  const recuperado = Math.max(0, reais(valorRecuperado));

  const successFeeTotal = reais(recuperado * config.successFeeTotalPct);
  const fatiaPlataforma = reais(successFeeTotal * config.feePlataformaSobreSuccessFeePct);
  const maoDeObra = successFeeTotal - fatiaPlataforma;
  const fatiaIndicador = config.temIndicador
    ? reais(maoDeObra * (1 - config.divisaoEscritorioPct))
    : 0;
  // O escritório absorve o resto (e qualquer residual de arredondamento) → fecha o invariante.
  const fatiaEscritorio = maoDeObra - fatiaIndicador;
  const liquidoCliente = recuperado - successFeeTotal;

  // Guarda de escritório-negativo (§5.1): config tóxica (Interpretação A) deixaria o canal sem nada.
  const valido = fatiaEscritorio >= 0;
  const alerta = valido
    ? undefined
    : "Configuração deixa o escritório sem remuneração (a fatia da plataforma e/ou do indicador " +
      "supera o success-fee). Revise o success-fee ou o fee da plataforma antes de aplicar.";

  // % sobre o recuperado (legenda secundária). Evita divisão por zero quando recuperado = 0.
  const pctSobreRecuperado = (valor: number) =>
    recuperado > 0 ? valor / recuperado : 0;

  // Ordem de exibição (§3.2): empresa cliente primeiro (o herói), plataforma por último (magra).
  const fatias: FatiaRepasse[] = [
    {
      papel: "empresa",
      rotulo: "Empresa cliente",
      descricao: "o valor que volta pra ela (restituição vai direto ao cliente)",
      valor: liquidoCliente,
      pctDoRecuperado: pctSobreRecuperado(liquidoCliente),
      destaque: false,
    },
    {
      papel: "escritorio",
      rotulo: "Você (escritório/contador)",
      descricao: "sua remuneração de êxito (faturada em separado)",
      valor: fatiaEscritorio,
      pctDoRecuperado: pctSobreRecuperado(fatiaEscritorio),
      destaque: true,
    },
    {
      papel: "indicador",
      rotulo: "Indicador",
      descricao: config.temIndicador
        ? "repasse de indicação (sai da mão-de-obra)"
        : "sem indicação neste caso",
      valor: fatiaIndicador,
      pctDoRecuperado: pctSobreRecuperado(fatiaIndicador),
      destaque: false,
    },
    {
      papel: "plataforma",
      rotulo: "Plataforma",
      descricao: "fee da ferramenta (sobre o honorário de êxito)",
      valor: fatiaPlataforma,
      pctDoRecuperado: pctSobreRecuperado(fatiaPlataforma),
      destaque: false,
    },
  ];

  return {
    valorRecuperado: recuperado,
    successFeeTotal,
    fatias,
    valido,
    alerta,
    config,
  };
}

/** Formata uma fração (0.07) como percentual pt-BR para a legenda (ex.: "7%" / "0,9%"). */
export function pctLegenda(fracao: number): string {
  const v = fracao * 100;
  // Mostra 1 casa quando < 10% (ex.: 0,9%); inteiro acima disso (ex.: 7%, 90%).
  const casas = v > 0 && v < 10 ? 1 : 0;
  return `${v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas })}%`;
}
