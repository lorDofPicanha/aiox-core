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
}

export interface BaseReferencia {
  baseVersaoId: string;
  regras: RegraClassificacao[];
}

export interface ContextoMotor {
  motorVersaoId: string;
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
  fundamento: string[];
  criteriosDesempate: {
    regraId: string;
    criterio: "ncm_exato" | "ncm_prefixo";
  };
}

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
      confianca: calcularConfianca(item, regra),
      fundamento: regra.fundamento ?? [],
      criteriosDesempate: {
        regraId: regra.id,
        criterio: regra.ncmExato ? "ncm_exato" : "ncm_prefixo"
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

function calcularConfianca(item: ItemFiscal, regra: RegraClassificacao): number {
  if (regra.ncmExato) {
    return 0.95;
  }

  if (item.ncm && regra.ncmPrefixo) {
    return 0.82;
  }

  return 0.6;
}
