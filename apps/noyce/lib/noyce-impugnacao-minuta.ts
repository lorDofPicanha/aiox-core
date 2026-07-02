// Minuta de IMPUGNAÇÃO ao edital (Tier 3, 30/Jun) — quando o motor de suspeição detecta uma
// cláusula restritiva/ilegal, o Noyce PREPARA a peça de impugnação fundamentada (art. 164 da Lei
// 14.133), pronta para o advogado/representante revisar, assinar e protocolar no prazo.
// Fundamentação ancorada na pesquisa verificada (docs/.../estrategia-vitoria-14133-research.md).
// SEMPRE requerCorrecao: o ato de protocolar é humano; o Noyce não inventa fato, só fundamenta o direito.

import type { CompanyCapabilityProfile, SuspicionSignal, SuspicionType } from "./noyce-model.ts";

export interface ImpugnacaoMinutaInput {
  signal: SuspicionSignal;
  ccp: Pick<CompanyCapabilityProfile, "identity">;
  certame: { titulo: string; orgao: string };
  /** Data limite p/ impugnar (até 3 dias úteis antes da sessão, art. 164) — se conhecida. */
  dataLimite?: string | null;
}

export interface ImpugnacaoMinuta {
  titulo: string;
  texto: string;
  requerCorrecao: true;
  avisos: string[];
}

// Fundamento jurídico por tipo de sinal (o "porquê" da ilegalidade).
const FUNDAMENTO: Record<SuspicionType, string> = {
  QUANTITATIVO_ACIMA_TETO:
    "A exigência de quantitativo mínimo superior a 50% das parcelas de maior relevância afronta o art. 67, §2º, da Lei nº 14.133/2021 e a Súmula TCU nº 263, restringindo indevidamente a competitividade.",
  RESTRICAO_TEMPO_LOCAL:
    "A limitação de tempo ou de locais específicos para a comprovação de capacidade técnica é VEDADA pelo art. 67, §2º, da Lei nº 14.133/2021, configurando restrição ilegal ao caráter competitivo do certame.",
  QUANTITATIVO_ATESTADO_SEM_PARCELA:
    "A exigência de atestados sem a prévia definição das parcelas de maior relevância e valor significativo (≥ 4% do valor estimado) viola o art. 67, §1º, da Lei nº 14.133/2021, por carecer de critério objetivo.",
  GARANTIA_PROPOSTA_ACIMA_LIMITE:
    "A exigência de garantia de proposta em percentual superior a 1% do valor estimado afronta o art. 58, §1º, da Lei nº 14.133/2021, que fixa esse teto.",
  VEDACAO_SOMATORIO_SEM_MOTIVO:
    "A vedação ao somatório de atestados é medida EXCEPCIONAL que, conforme o Acórdão TCU 1153/2024-Plenário, só se admite mediante motivação técnica que demonstre, de forma incontestável, que o maior quantitativo altera a natureza/complexidade do objeto. Imposta genericamente, restringe a competitividade (art. 67, §2º).",
  EXIGE_PROPRIEDADE_EQUIP:
    "A exigência de comprovação de PROPRIEDADE de equipamentos/instalações viola o art. 67, III, da Lei nº 14.133/2021 — que admite apenas a INDICAÇÃO de sua disponibilidade — e a Súmula TCU nº 272, sendo verificável por diligência, não por prova de titularidade.",
  MARCA_SEM_SIMILAR:
    "A indicação de marca sem a cláusula 'ou similar/equivalente' e sem justificativa técnica afronta os arts. 41 e 67 da Lei nº 14.133/2021, direcionando o certame.",
  INDICE_ECON_FIN_SEM_JUSTIFICATIVA:
    "A exigência de índices econômico-financeiros sem justificativa nos autos contraria o art. 69 da Lei nº 14.133/2021, que condiciona tais índices à demonstração de pertinência.",
  PRAZO_EXIGUO:
    "O prazo de publicação inferior ao mínimo legal afronta o art. 55 da Lei nº 14.133/2021, comprometendo a elaboração adequada das propostas.",
  PARCELA_RELEVANCIA_ABAIXO_4PCT:
    "A definição de parcela de maior relevância com corte inferior a 4% do valor total estimado viola o art. 67, §1º, da Lei nº 14.133/2021, permitindo a exigência de atestados sobre parcelas sem relevância técnica ou valor significativo — restrição indevida à competitividade.",
};

export function buildImpugnacaoMinuta(input: ImpugnacaoMinutaInput): ImpugnacaoMinuta {
  const { signal, ccp, certame, dataLimite } = input;
  const empresa = `${ccp.identity.razaoSocial}, CNPJ ${ccp.identity.cnpj}`;
  const clausula = signal.evidenciaEdital.numero || "cláusula impugnada";
  const trecho = signal.evidenciaEdital.trecho ?? signal.evidenciaEdital.texto ?? "";
  const fundamento = FUNDAMENTO[signal.tipo] ?? `Cláusula em desacordo com ${signal.hookLegal.artigo}.`;

  const avisos: string[] = [
    "Peça de impugnação PREPARADA pelo Noyce — revisão e assinatura por advogado/representante antes de protocolar.",
  ];
  if (dataLimite) avisos.push(`Prazo p/ impugnar: até ${dataLimite} (art. 164 — 3 dias úteis antes da sessão).`);

  const texto = [
    `À COMISSÃO DE CONTRATAÇÃO / AUTORIDADE SUBSCRITORA DO EDITAL`,
    `${certame.orgao}`,
    "",
    `Ref.: IMPUGNAÇÃO AO EDITAL — ${certame.titulo}`,
    "",
    `${empresa}, por seu representante legal, vem, TEMPESTIVAMENTE e com fundamento no art. 164 da Lei nº 14.133/2021, apresentar IMPUGNAÇÃO ao instrumento convocatório, quanto à ${clausula}${trecho ? ` ("${trecho}")` : ""}, pelas razões de fato e de direito a seguir.`,
    "",
    `I. DA CLÁUSULA IMPUGNADA`,
    `O edital, na ${clausula}, ${trecho ? `dispõe: "${trecho}". ` : "contém exigência "}que se mostra restritiva à competitividade.`,
    "",
    `II. DO FUNDAMENTO JURÍDICO`,
    fundamento,
    `Fundamento legal: ${signal.hookLegal.artigo} — ${signal.hookLegal.descricao}`,
    "",
    `III. DO PEDIDO`,
    `Requer-se o conhecimento e provimento desta impugnação para que a Administração CORRIJA ou SUPRIMA a cláusula apontada, adequando o edital à Lei nº 14.133/2021, com a consequente republicação e reabertura do prazo legal, nos termos do art. 55, §1º.`,
    "",
    `Nestes termos, pede deferimento.`,
  ].join("\n");

  return {
    titulo: `Impugnação ao edital — ${signal.tipo.replace(/_/g, " ").toLowerCase()}`,
    texto,
    requerCorrecao: true,
    avisos,
  };
}
