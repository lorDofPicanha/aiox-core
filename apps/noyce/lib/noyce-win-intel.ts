// Win-Intel (30/Jun): ao selecionar uma licitação para análise, o Noyce não só diz "vai/não-vai" —
// ele olha os ÚLTIMOS MESES de contratações PARECIDAS DO MESMO ÓRGÃO (vencedores, preço, recorrência,
// exigências repetidas) e devolve, POR ABA (fiscal, técnica, econômico-financeira, jurídica, proposta),
// SUGESTÕES DO QUE ADICIONAR para aumentar a chance de vencer.
//
// Duas camadas, na disciplina de proveniência do projeto:
//   1. Determinística (PURA): sinais grounded extraídos do MarketStructure real — cada linha cita o
//      contrato/estatística de onde veio. Nunca inventa número.
//   2. IA (este módulo só MONTA o LlmRequest; a chamada vive em /api/win-intel): lê o padrão dos
//      vencedores + as exigências do ERM atual e enriquece com sugestões qualitativas, schema-locked.
//
// REGRA-MÃE (anti-alucinação): VALOR/PERCENTUAL/PRAZO/QUANTITATIVO só saem do dado fornecido. Sem dado,
// a sugestão é qualitativa e marcada como "inferred"/"gap" — nunca um palpite numérico.

import type { LlmRequest } from "./agents/agent-types.ts";
import type {
  EditalRequirementsModel,
  Grounding,
  MarketStructure,
} from "./noyce-model.ts";

/** As abas do dossiê de participação. Mapeiam 1:1 nas seções do ERM (+ proposta). */
export type WinTab = "fiscal" | "tecnica" | "economico_financeira" | "juridica" | "proposta";

export const WIN_TABS: readonly WinTab[] = [
  "fiscal",
  "tecnica",
  "economico_financeira",
  "juridica",
  "proposta",
];

export const WIN_TAB_LABEL: Record<WinTab, string> = {
  fiscal: "Fiscal e trabalhista",
  tecnica: "Qualificação técnica",
  economico_financeira: "Qualificação econômico-financeira",
  juridica: "Habilitação jurídica / documentação",
  proposta: "Proposta e planilha",
};

export interface WinSuggestion {
  tab: WinTab;
  /** Ação curta — o "o que adicionar". */
  titulo: string;
  /** Como fazer / o que anexar, em texto acionável. */
  detalhe: string;
  /** Por que isso aumenta a chance de vencer NESTE órgão (ligado ao histórico). */
  porque: string;
  /** Proveniência: contrato(s), estatística ou cláusula que sustenta a sugestão. */
  fonte: string;
  impacto: "alto" | "medio" | "baixo";
  grounding: Grounding;
}

export interface WinIntelInput {
  /** Estrutura de mercado real do órgão × classe-de-objeto (do snapshot/cache PNCP). null = sem cobertura. */
  market: MarketStructure | null;
  /** Exigências reais extraídas do edital selecionado. null = ERM ainda não extraído. */
  erm: EditalRequirementsModel | null;
  /** Identificação do certame, para a IA manter dados corretos. */
  certame?: { titulo?: string; orgao?: string; valorEstimado?: number | null };
}

// ──────────────────────────────────────────────────────────────────────────────
// Camada 1 — DETERMINÍSTICA (pura, grounded). Cada sugestão cita a fonte real.
// ──────────────────────────────────────────────────────────────────────────────

function fmtBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

/** Cita até 3 contratos reais (numeroControlePncpCompra) para rastreabilidade. */
function citeContracts(ids: readonly string[]): string {
  const take = ids.slice(0, 3);
  if (take.length === 0) return "PNCP /contratos do órgão";
  return `PNCP contratos ${take.join(", ")}${ids.length > take.length ? " …" : ""}`;
}

/**
 * Deriva sinais grounded por aba a partir do histórico real do órgão.
 * NÃO chama IA. Toda linha que traz número cita o contrato/estatística de origem.
 */
export function deriveDeterministicSignals(input: WinIntelInput): WinSuggestion[] {
  const { market } = input;
  const out: WinSuggestion[] = [];
  if (!market) return out;

  // — PROPOSTA: faixa de preço real dos vencedores (substitui qualquer palpite). —
  const band = market.priceBand;
  if (band && band.sampleSize > 0 && (band.medianBRL != null || band.p25BRL != null)) {
    const faixa =
      band.p25BRL != null && band.p75BRL != null
        ? `entre ${fmtBRL(band.p25BRL)} e ${fmtBRL(band.p75BRL)}`
        : band.medianBRL != null
          ? `em torno de ${fmtBRL(band.medianBRL)}`
          : "na faixa observada";
    out.push({
      tab: "proposta",
      titulo: "Posicione a proposta na faixa real dos vencedores",
      detalhe:
        `Contratos dessa classe foram fechados ${faixa}` +
        (band.medianBRL != null ? ` (mediana ${fmtBRL(band.medianBRL)}, n=${band.sampleSize})` : ` (n=${band.sampleSize})`) +
        ". Calibre a composição de custo para competir nessa faixa SEM violar o piso legal (75% do estimado, art. 59 §4º, Lei 14.133/2021).",
      porque: "Preço é o critério de julgamento na maioria desses certames; entrar fora da faixa histórica perde ou cai em inexequibilidade.",
      fonte: citeContracts([]) + ` — faixa de ${band.sampleSize} contrato(s)`,
      impacto: "alto",
      grounding: band.grounding,
    });
  }

  // — TÉCNICA: incumbente forte → reforçar acervo equivalente. —
  const incumbente = market.competitors?.find((c) => c.isIncumbent) ?? market.competitors?.[0];
  if (incumbente && incumbente.winCount > 0) {
    const ehConcentrado = market.concentration === "concentrado";
    out.push({
      tab: "tecnica",
      titulo: ehConcentrado ? "Quebre a vantagem do incumbente com acervo equivalente" : "Iguale o acervo dos vencedores recorrentes",
      detalhe:
        `${incumbente.name} venceu ${incumbente.winCount}× (${fmtBRL(incumbente.totalWonBRL)}, ${incumbente.sharePct.toFixed(0)}% do gasto). ` +
        "Garanta atestado de capacidade técnica EM NOME DA EMPRESA que cubra as parcelas de maior relevância — emissão leva semanas, comece já.",
      porque: ehConcentrado
        ? "Órgão concentrado tende a re-contratar quem já entregou; sem acervo equivalente a habilitação técnica vira o ponto de eliminação."
        : "Os vencedores recorrentes já têm o acervo casado com o objeto; empatar nessa frente é pré-condição para competir no preço.",
      fonte: citeContracts(incumbente.sourceContractIds),
      impacto: "alto",
      grounding: incumbente.grounding,
    });
  }

  // — Recorrência / janela: pista de timing (preparação antecipada). —
  if (market.recurrenceMonths != null && market.recurrenceMonths > 0) {
    out.push({
      tab: "tecnica",
      titulo: "Antecipe a documentação ao ciclo de recompra do órgão",
      detalhe:
        `Este órgão recontrata essa classe a cada ~${market.recurrenceMonths} meses. ` +
        "Mantenha vault de certidões e atestados sempre vigente para não perder janela de publicação.",
      porque: "Editais recorrentes abrem com prazo curto; quem já está documentado submete; quem corre atrás de certidão perde.",
      fonte: `Recorrência inferida do histórico (${market.contractCount} contratos, janela ${market.windowMonths} meses)`,
      impacto: "medio",
      grounding: "inferred",
    });
  }

  return out;
}

// ──────────────────────────────────────────────────────────────────────────────
// Camada 2 — IA. Este módulo só MONTA o request (puro/testável). A chamada é na rota.
// ──────────────────────────────────────────────────────────────────────────────

export const WIN_INTEL_SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  properties: {
    suggestions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          tab: { type: "string", enum: [...WIN_TABS] },
          titulo: { type: "string" },
          detalhe: { type: "string" },
          porque: { type: "string" },
          fonte: { type: "string" },
          impacto: { type: "string", enum: ["alto", "medio", "baixo"] },
          grounding: { type: "string", enum: ["grounded", "inferred", "gap"] },
        },
        required: ["tab", "titulo", "detalhe", "porque", "fonte", "impacto", "grounding"],
      },
    },
  },
  required: ["suggestions"],
};

const SYSTEM_PROMPT = `Você é o estrategista de licitações do Noyce. Recebe (1) o HISTÓRICO real de contratações parecidas do mesmo órgão (vencedores, preços, recorrência, concentração) e (2) as EXIGÊNCIAS do edital atual (ERM), organizadas por aba. Sua tarefa: gerar SUGESTÕES DO QUE A EMPRESA LICITANTE PODE ADICIONAR, POR ABA, para aumentar a chance de VENCER este certame.

ABAS válidas (campo "tab"): fiscal, tecnica, economico_financeira, juridica, proposta.

REGRAS INEGOCIÁVEIS:
- VALOR, PERCENTUAL, PRAZO, QUANTITATIVO e CNPJ só podem sair dos dados fornecidos. NUNCA invente nem estime um número. Sem dado numérico, a sugestão é qualitativa e o campo "grounding" deve ser "inferred" ou "gap".
- Cada sugestão cita em "fonte" a origem (contrato PNCP, estatística do histórico, ou cláusula do edital). Sugestão sem lastro não entra.
- "grounding": "grounded" só quando a sugestão se apoia num dado real e citável; "inferred" quando é dedução do padrão; "gap" quando aponta algo que falta confirmar.
- Foque no DIFERENCIAL: o que os vencedores desse órgão tipicamente apresentam e que a licitante deveria igualar/superar. Não repita obviedades do edital sem ligar ao histórico.
- Não prometa resultado nem afirme que algo foi protocolado. Você PREPARA a estratégia; quem decide preço e assina é o humano.
- Português jurídico-objetivo. 2 a 4 sugestões por aba relevante; pule aba sem sinal útil.`;

function summarizeMarket(m: MarketStructure | null): string {
  if (!m) return "HISTÓRICO DO ÓRGÃO: sem cobertura (órgão fora do raio amostrado ou dados sigilosos). Baseie-se só no ERM.";
  const linhas: string[] = [
    `Órgão: ${m.orgaoName} (${m.orgaoCnpj})${m.uf ? ` — ${m.municipio ?? ""}/${m.uf}` : ""}`,
    `Classe de objeto: ${m.objetoClass} · janela: ${m.windowMonths} meses`,
    `Contratos: ${m.contractCount} · vencedores distintos: ${m.distinctWinners} · concentração: ${m.concentration} (HHI ${m.hhi})`,
    m.totalContractedBRL ? `Total contratado: ${fmtBRL(m.totalContractedBRL)}` : null,
    m.priceBand?.sampleSize
      ? `Faixa de preço (n=${m.priceBand.sampleSize}): p25=${m.priceBand.p25BRL != null ? fmtBRL(m.priceBand.p25BRL) : "?"} · mediana=${m.priceBand.medianBRL != null ? fmtBRL(m.priceBand.medianBRL) : "?"} · p75=${m.priceBand.p75BRL != null ? fmtBRL(m.priceBand.p75BRL) : "?"}`
      : "Faixa de preço: sem amostra suficiente",
    m.recurrenceMonths != null ? `Recorrência: ~${m.recurrenceMonths} meses` : null,
    m.coveragePct != null ? `Cobertura dos dados: ${m.coveragePct}% (gate de confiança)` : null,
  ].filter(Boolean) as string[];

  const top = (m.competitors ?? []).slice(0, 5).map(
    (c, i) =>
      `${i + 1}. ${c.name} — ${c.winCount}× · ${fmtBRL(c.totalWonBRL)} · ${c.sharePct.toFixed(0)}%${c.isIncumbent ? " · INCUMBENTE" : ""}${c.lastWinDate ? ` · última ${c.lastWinDate}` : ""} [${citeContracts(c.sourceContractIds)}]`,
  );
  return [linhas.join("\n"), top.length ? `VENCEDORES (top):\n${top.join("\n")}` : "VENCEDORES: nenhum reconstruído"].join("\n");
}

function summarizeErm(erm: EditalRequirementsModel | null): string {
  if (!erm) return "EXIGÊNCIAS DO EDITAL (ERM): ainda não extraído. Gere sugestões a partir do histórico do órgão e marque-as como inferred.";
  const t = erm.tecnica;
  const ef = erm.economicoFinanceira;
  const prof = (t.profissional ?? []).map((p) => `${p.servico}${p.qtdMin ? ` (mín ${p.qtdMin}${p.un ?? ""})` : ""}`).join("; ");
  const oper = (t.operacional ?? []).map((o) => `${o.servico}${o.qtdMin ? ` (mín ${o.qtdMin}${o.un ?? ""})` : ""}`).join("; ");
  return [
    "EXIGÊNCIAS DO EDITAL (ERM), por aba:",
    `• fiscal: CNDs=[${(erm.fiscalTrabalhista.CNDs ?? []).join(", ") || "—"}]${erm.fiscalTrabalhista.SICAF ? " · SICAF" : ""}`,
    `• economico_financeira: PL=${ef.exigePL ? `sim${ef.percentualPL != null ? ` ${ef.percentualPL}%` : ""}` : "não/—"} · índices LC=${ef.indices.LC ?? "—"}/LG=${ef.indices.LG ?? "—"}/SG=${ef.indices.SG ?? "—"} · garantia proposta=${ef.garantiaPropostaPct != null ? `${ef.garantiaPropostaPct}%` : "—"}`,
    `• tecnica: profissional=[${prof || "—"}] · operacional=[${oper || "—"}] · parcelas relevância=[${(t.parcelasMaiorRelevancia ?? []).join(", ") || "—"}] · somatório=${t.somatorio?.permitido ? "permitido" : "—"} · acervo consórcio=${t.aceitaAcervoConsorcio ? "aceita" : "—"}`,
    `• juridica: declarações=[${(erm.juridica.declaracoes ?? []).join(", ") || "—"}]`,
  ].join("\n");
}

/** Monta o LlmRequest do Win-Intel. Puro e testável. */
export function buildWinIntelRequest(input: WinIntelInput): LlmRequest {
  const certameLinhas = input.certame
    ? [
        input.certame.titulo ? `Certame: ${input.certame.titulo}` : null,
        input.certame.orgao ? `Órgão: ${input.certame.orgao}` : null,
        input.certame.valorEstimado != null ? `Valor estimado: ${fmtBRL(input.certame.valorEstimado)}` : null,
      ].filter(Boolean)
    : [];

  const deterministicas = deriveDeterministicSignals(input);
  const jaCobertas = deterministicas.length
    ? `JÁ HÁ SUGESTÕES DETERMINÍSTICAS (não repita; complemente com o que a leitura do padrão revela):\n${deterministicas
        .map((s) => `- [${s.tab}] ${s.titulo}`)
        .join("\n")}`
    : null;

  const user = [
    certameLinhas.length ? certameLinhas.join("\n") : null,
    summarizeMarket(input.market),
    summarizeErm(input.erm),
    jaCobertas,
    "Gere as sugestões por aba no schema (suggestions[]). Foque no diferencial competitivo deste órgão; respeite a regra anti-alucinação.",
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    system: SYSTEM_PROMPT,
    user,
    schema: WIN_INTEL_SCHEMA,
    model: process.env.WIN_INTEL_MODEL ?? "claude-opus-4-8",
    maxTokens: 4000,
    effort: "high",
  };
}

/** Normaliza a saída do LLM em WinSuggestion[], descartando itens malformados (anti-lixo). */
export function parseWinIntel(json: unknown): WinSuggestion[] {
  if (!json || typeof json !== "object") return [];
  const arr = (json as Record<string, unknown>).suggestions;
  if (!Array.isArray(arr)) return [];
  const valid: WinSuggestion[] = [];
  for (const raw of arr) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const tab = r.tab as WinTab;
    if (!WIN_TABS.includes(tab)) continue;
    const titulo = typeof r.titulo === "string" ? r.titulo.trim() : "";
    const detalhe = typeof r.detalhe === "string" ? r.detalhe.trim() : "";
    if (!titulo || !detalhe) continue;
    const impacto = (["alto", "medio", "baixo"] as const).includes(r.impacto as never)
      ? (r.impacto as WinSuggestion["impacto"])
      : "medio";
    const grounding = (["grounded", "inferred", "gap"] as const).includes(r.grounding as never)
      ? (r.grounding as Grounding)
      : "inferred";
    valid.push({
      tab,
      titulo,
      detalhe,
      porque: typeof r.porque === "string" ? r.porque.trim() : "",
      fonte: typeof r.fonte === "string" ? r.fonte.trim() : "",
      impacto,
      grounding,
    });
  }
  return valid;
}

/**
 * Combina sinais determinísticos (grounded, sempre presentes) com as sugestões da IA,
 * agrupando por aba na ordem canônica. Esta é a saída consumida pela UI / pelos documentos.
 */
export function mergeWinIntel(
  deterministicas: WinSuggestion[],
  iaSuggestions: WinSuggestion[],
): Record<WinTab, WinSuggestion[]> {
  const byTab = Object.fromEntries(WIN_TABS.map((t) => [t, [] as WinSuggestion[]])) as Record<WinTab, WinSuggestion[]>;
  // Determinísticas primeiro (lastro real), depois as da IA — sem duplicar título idêntico.
  for (const s of deterministicas) byTab[s.tab].push(s);
  for (const s of iaSuggestions) {
    const dup = byTab[s.tab].some((x) => x.titulo.toLowerCase() === s.titulo.toLowerCase());
    if (!dup) byTab[s.tab].push(s);
  }
  // Ordena cada aba por impacto (alto → baixo).
  const peso = { alto: 0, medio: 1, baixo: 2 };
  for (const t of WIN_TABS) byTab[t].sort((a, b) => peso[a.impacto] - peso[b.impacto]);
  return byTab;
}
