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

// ── Qualificação TÉCNICA — profissionais exigidos (responsável técnico/acervo) ──
// Tipos canônicos de profissional que o edital costuma exigir no quadro da empresa.
const PROF_PATTERNS: { servico: string; re: RegExp }[] = [
  { servico: "Engenheiro Civil", re: /engenheir[oa]\s+civil/i },
  { servico: "Arquiteto e Urbanista", re: /arquitet[oa]/i },
  { servico: "Engenheiro Eletricista", re: /engenheir[oa]\s+eletricista/i },
  { servico: "Engenheiro Mecânico", re: /engenheir[oa]\s+mec[âa]nic/i },
  { servico: "Engenheiro/Técnico em Segurança do Trabalho", re: /(engenheir[oa]|t[ée]cnic[oa])\s+(?:de|em)\s+seguran[çc]a\s+do\s+trabalho/i },
  { servico: "Responsável técnico", re: /respons[áa]vel\s+t[ée]cnic[oa]/i },
];

// Quadro técnico = TÍTULOS exigidos (casa contra RTs da empresa, não contra acervo).
function extractQuadroTecnico(tecnicaText: string): string[] {
  const out: string[] = [];
  if (!tecnicaText) return out;
  for (const p of PROF_PATTERNS) {
    if (p.re.test(tecnicaText)) out.push(p.servico);
  }
  return out;
}

// ── Qualificação TÉCNICA — atestados técnico-operacionais com quantitativo ──
// Capacidade operacional: "atestado(s)" + quantitativo (número + unidade de obra). O edital às vezes
// remete os quantitativos ao Termo de Referência (anexo) — quando não vêm no texto, fica vazio (honesto).
const QTD_UN_RE = /([\d][\d.]*(?:,\d+)?)\s*(m²|m2|metros\s+quadrados|m³|m3|metros\s+c[úu]bicos|km|quil[ôo]metros|metros\s+lineares|\bml\b|unidades?|vagas?|le?itos?)/gi;

function extractOperacional(
  tecnicaText: string,
  objetoText: string,
  broadScan: string,
): Array<{ servico: string; qtdMin: number | null; qtdObjeto: number | null; un: string | null }> {
  const out: Array<{ servico: string; qtdMin: number | null; qtdObjeto: number | null; un: string | null }> = [];
  const exigeOperacional = /capacidade\s+t[ée]cnico-?operacional|atestado[s]?\s+t[ée]cnico-?operacional|acervo\s+t[ée]cnico/i.test(tecnicaText);
  const exigeAtestado = exigeOperacional || /atestado[s]?\s+(?:de\s+)?(?:capacidade\s+)?t[ée]cnic/i.test(tecnicaText);
  if (!exigeAtestado) return out;
  // Remete ao Termo de Referência? Então amplia a busca de quantitativo p/ o texto cheio.
  const remeteTR = /termo\s+de\s+refer|item\s+11|anexo/i.test(tecnicaText);
  const scope = `${tecnicaText}\n${objetoText}` + (remeteTR ? `\n${broadScan}` : "");
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  QTD_UN_RE.lastIndex = 0;
  while ((m = QTD_UN_RE.exec(scope)) !== null && out.length < 6) {
    const n = Number.parseFloat(m[1].replace(/\./g, "").replace(",", "."));
    const un = clean(m[2]).toLowerCase();
    if (!Number.isFinite(n) || n < 10) continue; // descarta números soltos (datas/itens) — quantitativo de obra é >= 10
    const ctx = clean(scope.slice(Math.max(0, m.index - 60), m.index)).slice(-50);
    if (!/atestado|comprova|execu[çc]|servi[çc]o|obra|[áa]rea|constru/i.test(ctx)) continue; // só perto de contexto de capacidade
    const key = `${un}-${n}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ servico: ctx ? `Atestado: …${ctx}` : "Atestado de capacidade técnico-operacional", qtdMin: n, qtdObjeto: null, un });
  }
  // Atestado exigido mas sem quantitativo legível (geralmente está no TR/anexo não-textual): registra honesto.
  if (out.length === 0) {
    out.push({
      servico: exigeOperacional
        ? "Atestado de capacidade técnico-operacional (quantitativo no Termo de Referência)"
        : "Atestado(s) técnico-profissional(is) exigido(s) — ver Termo de Referência",
      qtdMin: null,
      qtdObjeto: null,
      un: null,
    });
  }
  return out;
}

// ── Qualificação ECONÔMICO-FINANCEIRA — PL, índices, garantia ──
function num(s: string | undefined): number | null {
  if (!s) return null;
  const n = Number.parseFloat(s.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function extractIndice(scan: string, nome: RegExp): number | null {
  const re = new RegExp(`(?:${nome.source})[^\\n]{0,60}?(?:[≥>=]|maior\\s+ou\\s+igual\\s+a|igual\\s+ou\\s+superior\\s+a|superior\\s+a|de)\\s*(\\d+(?:[.,]\\d+)?)`, "i");
  const m = scan.match(re);
  return m ? num(m[1]) : null;
}

// ── meta — critério de julgamento, modalidade, valor, órgão ──
function extractCriterio(scan: string): string | null {
  const m = scan.match(/menor\s+pre[çc]o(?:\s+(?:global|por\s+lote|por\s+item|unit[áa]rio))?|t[ée]cnica\s+e\s+pre[çc]o|maior\s+desconto|maior\s+lance|maior\s+retorno\s+econ[ôo]mico/i);
  return m ? clean(m[0]).toLowerCase().replace(/^./, (c) => c.toUpperCase()) : null;
}

function extractModalidade(scan: string): string | null {
  const m = scan.match(/preg[ãa]o\s+eletr[ôo]nico|preg[ãa]o\s+presencial|concorr[êe]ncia(?:\s+eletr[ôo]nica)?|concurso|leil[ãa]o|di[áa]logo\s+competitivo/i);
  return m ? clean(m[0]) : null;
}

function extractValorEstimado(scan: string): number | null {
  const m = scan.match(/valor\s+(?:total\s+)?(?:global\s+)?estimad[oa][^\n]{0,60}?R\$\s*([\d.]+,\d{2})/i);
  return m ? num(m[1]) : null;
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

  // ── Extração de técnica / econômica / meta (escopo: seção certa quando há, senão texto cheio) ──
  const tecnicaScope = sections.habilitacaoTecnica || scan;
  const econScope = sections.habilitacaoEconomica || scan;
  const quadroTecnico = extractQuadroTecnico(tecnicaScope);
  const operacional = extractOperacional(tecnicaScope, sections.objeto || "", scan);

  const exigePL = /patrim[ôo]nio\s+l[íi]quido|capital\s+social\s+m[íi]nimo/i.test(scan);
  const plMatch = scan.match(/patrim[ôo]nio\s+l[íi]quido[^\n]{0,80}?(\d{1,2}(?:[.,]\d+)?)\s*%/i) || scan.match(/(\d{1,2})\s*%\s+do\s+valor\s+(?:total\s+)?(?:estimad|contrat)/i);
  const garMatch = scan.match(/garantia\s+(?:da\s+)?(?:de\s+)?proposta[^\n]{0,90}?(\d+(?:[.,]\d+)?)\s*%/i);
  const indices = {
    LC: extractIndice(econScope, /liquidez\s+corrente|[íi]ndice\s+de\s+liquidez\s+corrente|\bILC\b/),
    LG: extractIndice(econScope, /liquidez\s+geral|[íi]ndice\s+de\s+liquidez\s+geral|\bILG\b/),
    SG: extractIndice(econScope, /solv[êe]ncia\s+geral|[íi]ndice\s+de\s+solv[êe]ncia|\bISG\b/),
  };

  const erm: EditalRequirementsModel = {
    meta: {
      orgao: "",
      cnpjOrgao: null,
      municipioIbge: null,
      modalidade: extractModalidade(scan),
      valorEstimado: extractValorEstimado(scan),
      dataPublicacao: null,
      dataSessao: null,
      criterioJulgamento: extractCriterio(scan),
      regimeExecucao: null,
      objetoComum: null,
    },
    economicoFinanceira: {
      exigePL: exigePL ? true : null,
      percentualPL: num(plMatch?.[1]),
      indices,
      justificativaPresente: null,
      garantiaPropostaPct: num(garMatch?.[1]),
      clausula: null,
    },
    tecnica: {
      quadroTecnico,
      profissional: [],
      operacional,
      parcelasMaiorRelevancia: null,
      tetoQuantitativo: null,
      somatorio: { permitido: /somat[óo]rio\s+de\s+atestados|permitid[ao]\s+(?:o\s+)?somat/i.test(scan) ? true : null },
      aceitaAcervoConsorcio: /acervo[^\n]{0,40}cons[óo]rcio|cons[óo]rcio[^\n]{0,40}acervo/i.test(scan) ? true : null,
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
