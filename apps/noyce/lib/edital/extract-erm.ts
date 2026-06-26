// Extração do ERM (o que o edital EXIGE) a partir do texto parseado — o elo que faz a parte
// documental valer em QUALQUER edital, não só nos 2 curados à mão. Foco: a lista de
// DECLARAÇÕES e de CERTIDÕES (CNDs) exigidas — o que dirige a completude do dossiê.
//
// 100% DETERMINÍSTICO (sem LLM, sem custo, sem alucinação). Princípio de segurança: melhor
// SOBRAR (declaração a mais não inabilita) do que FALTAR (faltar inabilita). Por isso detecta
// por (a) palavras-chave dos tipos canônicos + (b) frases "declaração de/que..." do edital.
// Confiança sinalizada: se as seções de habilitação/declarações não foram achadas, cai p/ baixa.

import type { EditalRequirementsModel } from "../noyce-model";
import type { EditalSections } from "./extract-edital.ts";
import { DECLARACAO_TEMPLATES } from "../noyce-declaracoes.ts";

export type Confianca = "alta" | "media" | "baixa";

export interface ErmExtraction {
  erm: EditalRequirementsModel;
  confidence: {
    declaracoes: Confianca;
    cnds: Confianca;
    foundSections: (keyof EditalSections)[];
    note: string;
  };
}

// Certidões canônicas + como reconhecê-las no texto do edital.
const CND_PATTERNS: { label: string; re: RegExp }[] = [
  { label: "Certidão Negativa de Débitos Federais (União/PGFN)", re: /(uni[ãa]o|federa|PGFN|tributos\s+federais|d[ée]bitos\s+relativos\s+a\s+cr[ée]ditos\s+tribut|conjunta)/i },
  { label: "Certidão Negativa de Débitos Estaduais", re: /(estadual|fazenda\s+estadual|d[ée]bitos?\s+estaduais|tributos\s+estaduais)/i },
  { label: "Certidão Negativa de Débitos Municipais", re: /(municipal|fazenda\s+municipal|d[ée]bitos?\s+municipais|tributos\s+municipais)/i },
  { label: "Certificado de Regularidade do FGTS (CRF)", re: /(FGTS|\bCRF\b|regularidade\s+do\s+fundo)/i },
  { label: "Certidão Negativa de Débitos Trabalhistas (CNDT)", re: /(CNDT|d[ée]bitos\s+trabalhistas|justi[çc]a\s+do\s+trabalho|TST)/i },
  { label: "Certidão Negativa de Falência/Recuperação Judicial", re: /(fal[êe]ncia|concordata|recupera[çc][ãa]o\s+judicial|insolv[êe]ncia)/i },
];

const DECL_PHRASE_RE = /declara[çc][ãa]o\s+(?:de\s+que|de|que)\s+([^\n.;:]{6,90})/gi;

function clean(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Extrai declarações + CNDs exigidas das seções parseadas do edital.
 * Escopo de busca = seções de habilitação/declarações (contexto certo); cai p/ texto cheio
 * só se essas seções não foram achadas (com confiança menor).
 */
export function extractErm(sections: EditalSections, fullText = ""): ErmExtraction {
  const foundSections = (Object.keys(sections) as (keyof EditalSections)[]).filter((k) => sections[k]);

  const habScope = [sections.declaracoes, sections.habilitacaoFiscal, sections.habilitacaoTecnica, sections.habilitacaoEconomica, sections.objeto]
    .filter(Boolean)
    .join("\n");
  // SCAN PRINCIPAL = texto cheio (editais reais são enormes e as âncoras de seção casam o
  // ÍNDICE primeiro → fatia errada e sub-detecta). Detecção canônica usa detectRe ESTRITO p/
  // não pegar falso-positivo no texto cheio (ex.: "menor preço"). Cai p/ habScope se não houver texto.
  const scan = (fullText && fullText.length > habScope.length ? fullText : habScope) || fullText;

  // ── Declarações ──
  const declaracoes: string[] = [];
  const seenTipos = new Set<string>();
  // (a) tipos canônicos (detectRe estrito sobre o texto cheio)
  for (const t of DECLARACAO_TEMPLATES) {
    const re = t.detectRe ?? t.match;
    if (re.test(scan)) {
      declaracoes.push(t.label);
      seenTipos.add(t.tipo);
    }
  }
  // (b) frases "declaração de/que ..." da SEÇÃO de declarações (precisão: exige "declaração";
  //     limitado à seção p/ evitar ruído do texto cheio). Captura os específicos do edital.
  const declSearch = sections.declaracoes || sections.habilitacaoFiscal || "";
  let m: RegExpExecArray | null;
  DECL_PHRASE_RE.lastIndex = 0;
  const rawPhrases = new Set<string>();
  while ((m = DECL_PHRASE_RE.exec(declSearch)) !== null && rawPhrases.size < 30) {
    const frag = clean(m[1]);
    if (frag.length >= 6) rawPhrases.add(`Declaração ${m[0].toLowerCase().startsWith("declaração de que") ? "de que" : "de"} ${frag}`.slice(0, 100));
  }
  for (const phrase of rawPhrases) {
    const jaCoberta = DECLARACAO_TEMPLATES.some((t) => seenTipos.has(t.tipo) && t.match.test(phrase));
    if (!jaCoberta) declaracoes.push(phrase);
  }

  // ── CNDs (padrões específicos sobre o texto cheio) ──
  const CNDs: string[] = [];
  for (const c of CND_PATTERNS) {
    if (c.re.test(scan)) CNDs.push(c.label);
  }

  // ── Confiança ── alta = muitos itens E seção corroborou; media = detectou via texto cheio
  // sem seção; baixa = quase nada (provável que tenha escapado → conferir manualmente).
  const temSecaoDecl = Boolean(sections.declaracoes);
  const temSecaoFiscal = Boolean(sections.habilitacaoFiscal);
  const declConf: Confianca = declaracoes.length >= 4 && temSecaoDecl ? "alta" : declaracoes.length >= 2 ? "media" : "baixa";
  const cndConf: Confianca = CNDs.length >= 4 && temSecaoFiscal ? "alta" : CNDs.length >= 2 ? "media" : "baixa";

  const erm: EditalRequirementsModel = {
    meta: {
      orgao: "",
      cnpjOrgao: null,
      municipioIbge: null,
      modalidade: null,
      valorEstimado: null,
      dataPublicacao: null,
      dataSessao: null,
      criterioJulgamento: null,
      regimeExecucao: null,
      objetoComum: null,
    },
    economicoFinanceira: {
      exigePL: /patrim[ôo]nio\s+l[íi]quido|capital\s+social/i.test(scan) ? true : null,
      percentualPL: null,
      indices: {},
      justificativaPresente: null,
      garantiaPropostaPct: null,
      clausula: null,
    },
    tecnica: {
      profissional: [],
      operacional: [],
      parcelasMaiorRelevancia: null,
      tetoQuantitativo: null,
      somatorio: { permitido: null },
      aceitaAcervoConsorcio: null,
      restricaoTempoLocal: null,
      marcaSemSimilar: null,
      clausula: null,
    },
    juridica: { declaracoes, clausula: null },
    fiscalTrabalhista: { CNDs, SICAF: /SICAF/i.test(scan) ? true : null, clausula: null },
  };

  return {
    erm,
    confidence: {
      declaracoes: declConf,
      cnds: cndConf,
      foundSections,
      note: declConf === "baixa" || cndConf === "baixa"
        ? "Extração de baixa confiança em pelo menos um eixo — conferir manualmente contra o edital."
        : `Extraído (texto cheio + seções: ${foundSections.join(", ") || "—"}).`,
    },
  };
}
