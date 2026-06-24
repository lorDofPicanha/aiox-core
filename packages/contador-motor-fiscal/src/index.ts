export type TipoInferencia = "regra_deterministica";

export type TipoDivergencia =
  | "cclasstrib_divergente"
  | "ncm_suspeito"
  | "monofasico_tributado"
  | "aliquota_divergente"
  | "cst_divergente"
  | "credito_potencial"
  | "outro";

export interface ItemFiscal {
  id: string;
  descricao: string;
  ncm?: string;
  cfop?: string;
  cst?: string;
  cclasstribInformado?: string;
  valor: number;
}

export interface RegraClassificacao {
  id: string;
  ncmPrefixo?: string;
  ncmExato?: string;
  cclasstribEsperado: string;
  descricao: string;
  tipoDivergencia?: TipoDivergencia;
  materialidadeMinima?: number;
  fundamento?: string[];
  /**
   * Marca a regra como DRAFT / disputada — entra como FATOR de penalizacao na
   * confianca calibrada. Default (ausente) = nao penaliza por este fator.
   * "draft" = base ainda nao validada por tributarista; "disputado" = ha
   * controversia interpretativa real (NCM residual, regime variavel).
   */
  statusRegra?: "validada" | "draft" | "disputado";
}

export interface BaseReferencia {
  baseVersaoId: string;
  regras: RegraClassificacao[];
}

export interface ContextoMotor {
  motorVersaoId: string;
  /**
   * Threshold abaixo do qual o apontamento e marcado como baixa confianca e
   * BLOQUEIA auto-aprovacao (empurra para revisao humana / fila do contador).
   * Default 0.7 (coerente com a banda de confianca da fila e com §5.3
   * evaluation: "onde NAO sei" abstem e vai pro humano).
   */
  thresholdAutoAprovacao?: number;
  /**
   * Materialidade (R$) considerada "alta" para o fator de materialidade da
   * confianca. Default 1000. Item materialmente relevante reforca a confianca
   * (mais sinal), item irrisorio nao.
   */
  materialidadeReferencia?: number;
}

/** Banda de confianca derivada do score + threshold (explicabilidade da fila). */
export type BandaConfianca = "alta" | "media" | "baixa";

/**
 * Fatores explicitos que compoem a confianca calibrada (A3 — explicabilidade).
 * O numero final NAO e magico: deriva destes fatores e fica auditavel na trilha.
 */
export interface FatoresConfianca {
  /** Base do score por especificidade do match. */
  especificidadeMatch: "ncm_exato" | "ncm_prefixo" | "sem_ncm";
  /** Contribuicao (delta) de cada fator ao score final. */
  contribuicoes: {
    /** Ponto de partida pela especificidade do match NCM. */
    base: number;
    /** Coerencia do CST observado com o regime esperado (+ coerente / - incoerente). */
    cstCoerente: number;
    /** Penalizacao quando a regra/lista e DRAFT ou disputada. */
    statusRegra: number;
    /** Reforco por materialidade relevante do item. */
    materialidade: number;
  };
  /** Score final (clamp 0..1). */
  score: number;
}

export interface ApontamentoCandidato {
  itemId: string;
  baseVersaoId: string;
  motorVersaoId: string;
  tipoInferencia: TipoInferencia;
  tipoDivergencia: TipoDivergencia;
  cclasstribReferencia: string;
  descricao: string;
  valorEnvolvido: number;
  confianca: number;
  /** Fatores explicitos por tras de `confianca` (A3 — nao so um numero). */
  fatoresConfianca: FatoresConfianca;
  /** Banda derivada (alta/media/baixa) para a UI/fila. */
  bandaConfianca: BandaConfianca;
  /**
   * true quando a confianca esta abaixo do threshold: BLOQUEIA auto-aprovacao
   * e empurra para revisao humana (CRC). O apontamento NAO some — vira fila.
   */
  bloqueiaAutoAprovacao: boolean;
  fundamento: string[];
  criteriosDesempate: {
    regraId: string;
    criterio: "ncm_exato" | "ncm_prefixo";
  };
}

const THRESHOLD_AUTO_APROVACAO_PADRAO = 0.7;
const MATERIALIDADE_REFERENCIA_PADRAO = 1000;

// ---------------------------------------------------------------------------
// A1 — Deteccao de monofasico (NCM monofasico tributado como normal)
// ---------------------------------------------------------------------------

/**
 * Bloco de tributo PIS/COFINS de um item (subtipagem estrutural — espelha
 * `TributoPisCofins` do parser sem criar dependencia de build entre pacotes).
 */
export interface TributoPisCofinsRef {
  cst?: string;
  baseCalculo?: number;
  aliquota?: number;
  valor?: number;
}

/**
 * Item com bloco de tributo PIS/COFINS — o que o parser entrega em
 * `ItemFiscalRecuperacao.recuperacao` (subtipagem estrutural). A deteccao de
 * monofasico CONSOME estes campos (NCM + CST PIS/COFINS), nao inventa entrada.
 */
export interface ItemComTributo extends ItemFiscal {
  recuperacao: {
    pis: TributoPisCofinsRef;
    cofins: TributoPisCofinsRef;
    /** Sinal do parser: CST PIS ou COFINS indica monofasico/ST/aliq. zero. */
    ehMonofasico: boolean;
  };
}

/** Familia NCM de regime monofasico (espelha monofasico-ncm-v0-draft.json). */
export interface FamiliaMonofasica {
  id: string;
  familia: string;
  ncmPrefixos: string[];
  /** CSTs PIS/COFINS coerentes com o regime monofasico na revenda. */
  cstEsperadoRevenda: string[];
  confiancaBase: "alta" | "media" | "baixa-disputado";
  materialidadeMinima?: number;
  fundamento?: string[];
}

export interface ReferenciaMonofasico {
  listaVersao: string;
  familias: FamiliaMonofasica[];
}

/** CSTs de PIS/COFINS de regime NORMAL (apuracao/cumulativo) — o indicio. */
const CST_REGIME_NORMAL = new Set(["01", "02"]);

/**
 * CFOPs de saida de PRODUCAO PROPRIA / industrializacao — o ELO CONCENTRADOR da
 * cadeia monofasica (industrial/importador). Nesses casos o CST de regime normal
 * (01/02) e CORRETO: e o inicio da cadeia que concentra o tributo. So a REVENDA
 * de mercadoria adquirida de terceiros gera credito monofasico. Excluir esses
 * CFOPs evita o falso-positivo classico do monofasico (QA 24/Jun, finding F1).
 * CFOP ausente NAO exclui (indicio segue, com revisao humana).
 */
const CFOP_PRODUCAO_PROPRIA = new Set([
  "5101", "6101", "7101", // venda de producao do estabelecimento
  "5109", "6109",          // venda de producao do estabelecimento (ZFM/ALC)
  "5651", "6651", "7651",  // combustivel/lubrificante de PRODUCAO -> industrializacao
  "5652", "6652", "7652",  // combustivel/lubrificante de PRODUCAO -> comercializacao
  "5653", "6653", "7653"   // combustivel/lubrificante de PRODUCAO -> consumidor final
]);

/**
 * A1 — Detecta o caso monofasico: item cujo NCM e de FAMILIA monofasica
 * (combustiveis, bebidas frias, autopecas, farmaceuticos, pneus, cosmeticos)
 * mas tributado com CST PIS/COFINS de regime NORMAL (ex.: 01) em vez de
 * monofasico (04/05/06) -> indicio de `credito_potencial` (PIS/COFINS pago
 * indevidamente). O caso inverso (monofasico CORRETAMENTE tributado) NAO gera
 * apontamento.
 *
 * Funcao PURA: consome o item tipado + a referencia DRAFT; sem rede/fs/Date.
 */
export function detectarMonofasico(
  item: ItemComTributo,
  refMonofasico: ReferenciaMonofasico,
  contexto: ContextoMotor
): ApontamentoCandidato[] {
  const familia = selecionarFamiliaMonofasica(item, refMonofasico.familias);

  if (!familia) {
    return [];
  }

  if (familia.materialidadeMinima !== undefined && item.valor < familia.materialidadeMinima) {
    return [];
  }

  // F1: so a REVENDA gera credito monofasico. Producao propria / industrializacao
  // (elo concentrador) tributa CST normal CORRETAMENTE -> nao e indicio de credito.
  const cfop = normalizarCodigo(item.cfop);
  if (CFOP_PRODUCAO_PROPRIA.has(cfop)) {
    return [];
  }

  const cstPis = normalizarCst(item.recuperacao.pis.cst);
  const cstCofins = normalizarCst(item.recuperacao.cofins.cst);

  // Item monofasico CORRETAMENTE tributado (algum CST monofasico/ST/aliq. zero)
  // -> nenhum apontamento. So apontamos quando ha CST de regime NORMAL.
  const tributadoNormal =
    CST_REGIME_NORMAL.has(cstPis) || CST_REGIME_NORMAL.has(cstCofins);

  const tributadoMonofasico =
    familia.cstEsperadoRevenda.includes(cstPis) ||
    familia.cstEsperadoRevenda.includes(cstCofins);

  if (!tributadoNormal || tributadoMonofasico) {
    return [];
  }

  const cstObservado = CST_REGIME_NORMAL.has(cstPis) ? cstPis : cstCofins;

  const fatores = calcularConfiancaCalibrada({
    especificidade: "ncm_prefixo",
    // CST incoerente com o regime esperado e justamente o indicio -> o motor
    // tem ALTA certeza de que ha divergencia de CST (nao de cClassTrib).
    cstCoerenteComRegra: false,
    statusRegra: mapearConfiancaBaseParaStatus(familia.confiancaBase),
    valor: item.valor,
    materialidadeReferencia: contexto.materialidadeReferencia ?? MATERIALIDADE_REFERENCIA_PADRAO
  });

  const threshold = contexto.thresholdAutoAprovacao ?? THRESHOLD_AUTO_APROVACAO_PADRAO;

  return [
    {
      itemId: item.id,
      baseVersaoId: refMonofasico.listaVersao,
      motorVersaoId: contexto.motorVersaoId,
      tipoInferencia: "regra_deterministica",
      tipoDivergencia: "credito_potencial",
      cclasstribReferencia: familia.id,
      descricao: montarDescricaoMonofasico(item, familia, cstObservado),
      valorEnvolvido: item.valor,
      confianca: fatores.score,
      fatoresConfianca: fatores,
      bandaConfianca: derivarBanda(fatores.score, threshold),
      bloqueiaAutoAprovacao: fatores.score < threshold,
      fundamento: familia.fundamento ?? [],
      criteriosDesempate: {
        regraId: familia.id,
        criterio: "ncm_prefixo"
      }
    }
  ];
}

export function detectarMonofasicoLote(
  itens: ItemComTributo[],
  refMonofasico: ReferenciaMonofasico,
  contexto: ContextoMotor
): ApontamentoCandidato[] {
  return itens.flatMap((item) => detectarMonofasico(item, refMonofasico, contexto));
}

function selecionarFamiliaMonofasica(
  item: ItemFiscal,
  familias: FamiliaMonofasica[]
): FamiliaMonofasica | undefined {
  const ncm = normalizarCodigo(item.ncm);
  if (ncm === "") {
    return undefined;
  }

  // Match por prefixo mais longo (mais especifico) entre todas as familias.
  let melhor: FamiliaMonofasica | undefined;
  let melhorPrefixo = -1;

  for (const familia of familias) {
    for (const prefixo of familia.ncmPrefixos) {
      const p = normalizarCodigo(prefixo);
      if (p !== "" && ncm.startsWith(p) && p.length > melhorPrefixo) {
        melhor = familia;
        melhorPrefixo = p.length;
      }
    }
  }

  return melhor;
}

function montarDescricaoMonofasico(
  item: ItemComTributo,
  familia: FamiliaMonofasica,
  cstObservado: string
): string {
  return (
    `Item "${item.descricao}" (NCM ${item.ncm ?? "?"}) e da familia monofasica ` +
    `"${familia.familia}" mas foi tributado com CST PIS/COFINS ${cstObservado} ` +
    `(regime normal). Indicio de credito potencialmente recuperavel — sugerimos ` +
    `revisao por contador habilitado (CRC). Nao e credito garantido.`
  );
}

function normalizarCst(cst: string | undefined): string {
  return (cst ?? "").trim();
}

function mapearConfiancaBaseParaStatus(
  base: FamiliaMonofasica["confiancaBase"]
): RegraClassificacao["statusRegra"] {
  if (base === "alta") return "validada";
  if (base === "media") return "draft";
  return "disputado";
}

// ---------------------------------------------------------------------------
// Classificacao cClassTrib (existente) — agora com confianca calibrada (A3)
// ---------------------------------------------------------------------------

export function classificar(
  item: ItemFiscal,
  base: BaseReferencia,
  contexto: ContextoMotor
): ApontamentoCandidato[] {
  const regra = selecionarRegra(item, base.regras);

  if (!regra) {
    return [];
  }

  if (regra.materialidadeMinima !== undefined && item.valor < regra.materialidadeMinima) {
    return [];
  }

  if (item.cclasstribInformado === regra.cclasstribEsperado) {
    return [];
  }

  const criterio: "ncm_exato" | "ncm_prefixo" = regra.ncmExato ? "ncm_exato" : "ncm_prefixo";
  const especificidade = especificidadeDoMatch(item, regra);

  const fatores = calcularConfiancaCalibrada({
    especificidade,
    // Na classificacao cClassTrib o CST informado NAO e o eixo da divergencia;
    // tratamos como coerencia neutra (nao reforca nem penaliza por CST aqui).
    cstCoerenteComRegra: undefined,
    statusRegra: regra.statusRegra,
    valor: item.valor,
    materialidadeReferencia: contexto.materialidadeReferencia ?? MATERIALIDADE_REFERENCIA_PADRAO
  });

  const threshold = contexto.thresholdAutoAprovacao ?? THRESHOLD_AUTO_APROVACAO_PADRAO;

  return [
    {
      itemId: item.id,
      baseVersaoId: base.baseVersaoId,
      motorVersaoId: contexto.motorVersaoId,
      tipoInferencia: "regra_deterministica",
      tipoDivergencia: regra.tipoDivergencia ?? "cclasstrib_divergente",
      cclasstribReferencia: regra.cclasstribEsperado,
      descricao: montarDescricao(item, regra),
      valorEnvolvido: item.valor,
      confianca: fatores.score,
      fatoresConfianca: fatores,
      bandaConfianca: derivarBanda(fatores.score, threshold),
      bloqueiaAutoAprovacao: fatores.score < threshold,
      fundamento: regra.fundamento ?? [],
      criteriosDesempate: {
        regraId: regra.id,
        criterio
      }
    }
  ];
}

export function classificarLote(
  itens: ItemFiscal[],
  base: BaseReferencia,
  contexto: ContextoMotor
): ApontamentoCandidato[] {
  return itens.flatMap((item) => classificar(item, base, contexto));
}

function selecionarRegra(
  item: ItemFiscal,
  regras: RegraClassificacao[]
): RegraClassificacao | undefined {
  const ncm = normalizarCodigo(item.ncm);

  const exata = regras.find((regra) => {
    return regra.ncmExato !== undefined && normalizarCodigo(regra.ncmExato) === ncm;
  });

  if (exata) {
    return exata;
  }

  const porPrefixo = regras
    .filter((regra) => regra.ncmPrefixo !== undefined)
    .filter((regra) => ncm.startsWith(normalizarCodigo(regra.ncmPrefixo)))
    .sort((a, b) => normalizarCodigo(b.ncmPrefixo).length - normalizarCodigo(a.ncmPrefixo).length);

  return porPrefixo[0];
}

function normalizarCodigo(codigo: string | undefined): string {
  return (codigo ?? "").replace(/\D/g, "");
}

function montarDescricao(item: ItemFiscal, regra: RegraClassificacao): string {
  const informado = item.cclasstribInformado ?? "nao informado";
  return `Item "${item.descricao}" informado como ${informado}; referencia deterministica indica ${regra.cclasstribEsperado}.`;
}

// ---------------------------------------------------------------------------
// A3 — Confianca calibrada (fatores explicitos + abstencao "onde NAO sei")
// ---------------------------------------------------------------------------

interface EntradaConfianca {
  /** Especificidade do match NCM (eixo principal). */
  especificidade: "ncm_exato" | "ncm_prefixo" | "sem_ncm";
  /**
   * Coerencia do CST observado com o regime esperado:
   *  - true  = CST coerente (reforca);
   *  - false = CST incoerente (este E o indicio; reforca a certeza da divergencia);
   *  - undefined = CST nao e o eixo da divergencia (neutro).
   */
  cstCoerenteComRegra: boolean | undefined;
  /** Status da regra/lista (draft/disputado penaliza). */
  statusRegra: RegraClassificacao["statusRegra"];
  /** Valor do item (entra no fator materialidade). */
  valor: number;
  /** Materialidade considerada "alta". */
  materialidadeReferencia: number;
}

/**
 * Substitui a heuristica fixa (0.95/0.82/0.6) por FATORES explicitos e
 * combinados. Cada fator e exposto em `contribuicoes` (explicabilidade — o
 * numero nunca e magico; deriva e fica auditavel na trilha de boa-fe).
 *
 * Abaixo do threshold (aplicado pelo chamador), o apontamento e marcado como
 * baixa confianca que BLOQUEIA auto-aprovacao -> empurra para revisao humana.
 * Funcao PURA, deterministica (sem Date/rede/fs).
 */
export function calcularConfiancaCalibrada(entrada: EntradaConfianca): FatoresConfianca {
  // Fator 1 — base por especificidade do match NCM.
  const base =
    entrada.especificidade === "ncm_exato"
      ? 0.8
      : entrada.especificidade === "ncm_prefixo"
        ? 0.62
        : 0.4;

  // Fator 2 — coerencia do CST.
  //  CST incoerente E o indicio de divergencia de CST -> reforca (+).
  //  CST coerente reforca levemente; neutro/undefined nao mexe.
  let cstCoerente = 0;
  if (entrada.cstCoerenteComRegra === false) {
    cstCoerente = 0.12;
  } else if (entrada.cstCoerenteComRegra === true) {
    cstCoerente = 0.05;
  }

  // Fator 3 — status da regra/lista (DRAFT/disputado puxa a confianca pra baixo,
  // sustentando o "onde NAO sei" de bases ainda nao validadas por tributarista).
  let statusRegra = 0;
  if (entrada.statusRegra === "draft") {
    statusRegra = -0.1;
  } else if (entrada.statusRegra === "disputado") {
    statusRegra = -0.3;
  }

  // Fator 4 — materialidade: item relevante reforca; irrisorio nao (mas nunca
  // penaliza abaixo de zero — materialidade baixa e ausencia de reforco).
  const razao = entrada.materialidadeReferencia > 0
    ? entrada.valor / entrada.materialidadeReferencia
    : 0;
  const materialidade = clamp(razao, 0, 1) * 0.08;

  const score = clamp(base + cstCoerente + statusRegra + materialidade, 0, 1);

  return {
    especificidadeMatch: entrada.especificidade,
    contribuicoes: {
      base: round(base),
      cstCoerente: round(cstCoerente),
      statusRegra: round(statusRegra),
      materialidade: round(materialidade)
    },
    score: round(score)
  };
}

function especificidadeDoMatch(
  item: ItemFiscal,
  regra: RegraClassificacao
): "ncm_exato" | "ncm_prefixo" | "sem_ncm" {
  if (regra.ncmExato) {
    return "ncm_exato";
  }
  if (item.ncm && regra.ncmPrefixo) {
    return "ncm_prefixo";
  }
  return "sem_ncm";
}

function derivarBanda(score: number, threshold: number): BandaConfianca {
  if (score < threshold) {
    return "baixa";
  }
  // Banda "alta" a partir de um patamar acima do threshold (margem de seguranca).
  if (score >= threshold + 0.15) {
    return "alta";
  }
  return "media";
}

function clamp(valor: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, valor));
}

function round(valor: number): number {
  return Math.round(valor * 1000) / 1000;
}
