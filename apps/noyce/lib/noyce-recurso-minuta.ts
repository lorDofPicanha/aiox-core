// Minuta do TRIBUNO — a peça de recurso administrativo / contrarrazões (Lei 14.133, art. 165).
// DETERMINÍSTICA: estrutura jurídica + tempestividade calculada + identidade da ENIAC + os
// FUNDAMENTOS que o humano/advogado fornece. NÃO inventa fundamentação: sem os fundamentos, a
// seção "DO DIREITO" sai como pendência BLOQUEADA (placeholder assinado = bomba armada — Niebuhr).
// SEMPRE requerCorrecao (advogado revisa/assina/protocola — ato humano). O LLM (enriquecer a
// fundamentação com Lei/TCU) é camada futura (Fase C); aqui é o esqueleto seguro e real.

import type { CompanyCapabilityProfile } from "./noyce-model";
import type { SessionResult } from "./agents/maestro-types";
import type { RecursoPlan } from "./agents/maestro-runtime";

export interface RecursoMinutaInput {
  result: SessionResult;
  plan: RecursoPlan;
  ccp: CompanyCapabilityProfile;
  certame: { titulo: string; orgao: string };
  /** Fundamentos jurídicos fornecidos pelo humano/advogado (o cerne da peça). */
  fundamentos?: string;
  /** Para contrarrazões: quem interpôs o recurso de terceiro. */
  recorrenteTerceiro?: string;
}

export interface RecursoMinuta {
  tipo: "recurso" | "contrarrazoes";
  titulo: string;
  texto: string;
  requerCorrecao: true;
  avisos: string[];
}

const FUNDAMENTOS_PENDENTE =
  "⛔ FUNDAMENTAÇÃO A DESENVOLVER PELO ADVOGADO — descrever o vício da decisão recorrida (ilegalidade/irregularidade), com a base legal (Lei 14.133/2021, jurisprudência TCU) e as provas. Não assinar sem esta seção.";

function objetoDaDecisao(r: SessionResult): string {
  switch (r.eniacOutcome) {
    case "inabilitada":
      return "inabilitou a ora recorrente na fase de habilitação";
    case "desclassificada":
      return "desclassificou a proposta da ora recorrente";
    case "derrotada_julgamento":
      return r.winner?.nome
        ? `julgou vencedora a empresa ${r.winner.nome}${r.winner.cnpj ? ` (CNPJ ${r.winner.cnpj})` : ""}`
        : "julgou vencedora outra licitante";
    default:
      return "proferida na sessão";
  }
}

function pedido(r: SessionResult): string {
  switch (r.eniacOutcome) {
    case "inabilitada":
      return "seja reformada a decisão recorrida para HABILITAR a recorrente, com o regular prosseguimento do certame";
    case "desclassificada":
      return "seja reformada a decisão para CLASSIFICAR a proposta da recorrente";
    case "derrotada_julgamento":
      return "seja reformada a decisão para INABILITAR/DESCLASSIFICAR a licitante declarada vencedora e classificar a recorrente";
    default:
      return "seja reformada a decisão recorrida";
  }
}

export function buildRecursoMinuta(input: RecursoMinutaInput): RecursoMinuta {
  const { result: r, plan, ccp, certame, fundamentos, recorrenteTerceiro } = input;
  const empresa = `${ccp.identity.razaoSocial}, inscrita no CNPJ sob o nº ${ccp.identity.cnpj}`;
  const tempestividade = plan.fatalClock
    ? `A decisão foi proferida na sessão de ${new Date(r.sessionAt).toLocaleString("pt-BR")}; o prazo recursal de ${plan.fatalClock.label.toLowerCase()} encerra-se em ${new Date(plan.fatalClock.dueAt).toLocaleString("pt-BR")} (art. 165, Lei 14.133/2021 — conferir a modalidade/edital). O presente é, pois, TEMPESTIVO.`
    : `Conferir a tempestividade conforme o edital e a modalidade (art. 165, Lei 14.133/2021).`;

  const avisos = [
    "Peça preparada pelo Noyce (Tribuno) — REVISÃO E ASSINATURA por advogado/representante legal são obrigatórias.",
    "O modelo/forma do edital e do portal prevalecem sobre este esqueleto.",
  ];
  if (!fundamentos || fundamentos.trim().length < 20) avisos.push("Fundamentação ainda não fornecida — peça bloqueada para assinatura.");

  const ehContrarrazoes = plan.path === "defender_vitoria";
  const fund = fundamentos && fundamentos.trim().length >= 20 ? fundamentos.trim() : FUNDAMENTOS_PENDENTE;

  if (ehContrarrazoes) {
    const titulo = "CONTRARRAZÕES DE RECURSO ADMINISTRATIVO";
    const texto = [
      `À COMISSÃO DE CONTRATAÇÃO / AGENTE DE CONTRATAÇÃO`,
      `${certame.orgao}`,
      ``,
      `Ref.: ${certame.titulo}`,
      ``,
      `${empresa}, já qualificada nos autos do processo licitatório em epígrafe, vem, tempestivamente, apresentar CONTRARRAZÕES ao recurso interposto por ${recorrenteTerceiro || "licitante recorrente"}, pelas razões a seguir.`,
      ``,
      `I — DA TEMPESTIVIDADE`,
      tempestividade,
      ``,
      `II — DO MÉRITO`,
      fund,
      ``,
      `III — DO PEDIDO`,
      `Requer-se o conhecimento e o DESPROVIMENTO do recurso, mantendo-se a decisão que declarou a recorrente vencedora, com o regular prosseguimento à homologação e adjudicação.`,
      ``,
      `Termos em que pede deferimento.`,
      `${ccp.identity.sedeMunicipioIbge === "5200258" ? "Águas Lindas de Goiás/GO" : ""}, ____ de __________ de ______.`,
      ``,
      `_______________________________________`,
      `${ccp.identity.razaoSocial} — CNPJ ${ccp.identity.cnpj}`,
      `(assinatura do representante legal / advogado — OAB ____)`,
    ].join("\n");
    return { tipo: "contrarrazoes", titulo, texto, requerCorrecao: true, avisos };
  }

  const titulo = "RECURSO ADMINISTRATIVO";
  const texto = [
    `À COMISSÃO DE CONTRATAÇÃO / AGENTE DE CONTRATAÇÃO`,
    `${certame.orgao}`,
    ``,
    `Ref.: ${certame.titulo}`,
    ``,
    `${empresa}, já qualificada nos autos do processo licitatório em epígrafe, vem, tempestivamente e com fundamento no art. 165 da Lei nº 14.133/2021, interpor RECURSO ADMINISTRATIVO contra a decisão que ${objetoDaDecisao(r)}, pelas razões a seguir expostas.`,
    ``,
    `I — DA TEMPESTIVIDADE`,
    tempestividade,
    ``,
    `II — DOS FATOS`,
    r.motivo ? `Da decisão recorrida consta: ${r.motivo}.` : `Descrever sucintamente os fatos e a decisão recorrida (conforme a ata da sessão).`,
    ``,
    `III — DO DIREITO`,
    fund,
    ``,
    `IV — DO PEDIDO`,
    `Diante do exposto, requer-se o conhecimento e o PROVIMENTO do presente recurso, para que ${pedido(r)}.`,
    ``,
    `Termos em que pede deferimento.`,
    `${ccp.identity.sedeMunicipioIbge === "5200258" ? "Águas Lindas de Goiás/GO" : ""}, ____ de __________ de ______.`,
    ``,
    `_______________________________________`,
    `${ccp.identity.razaoSocial} — CNPJ ${ccp.identity.cnpj}`,
    `(assinatura do representante legal / advogado — OAB ____)`,
  ].join("\n");

  return { tipo: "recurso", titulo, texto, requerCorrecao: true, avisos };
}
