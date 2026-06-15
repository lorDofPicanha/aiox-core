// Fluxo "Interesse → Dossiê → Revisão humana" (owner 12/Jun):
// ao marcar interesse no Monitorar, o motor pré-preenche TUDO que a licitação vai precisar;
// o humano revisa item a item; o que o humano CORRIGIR fica travado — o motor nunca
// sobrescreve um valor humano (proveniência vira "humano", com registro do valor original).
import type { CompanyCapabilityProfile, Opportunity } from "./noyce-model";
import { derivePorte } from "./noyce-porte.ts";

export interface ReviewItem {
  id: string;
  secao: string;
  label: string;
  /** Valor pré-preenchido pelo motor, sempre com proveniência. */
  valorMotor: string;
  proveniencia: string;
  /** Item NÃO pode ser aprovado como está — só corrigido (placeholder, porte desenquadrado, dado faltante).
   *  Conclave 12/Jun (Niebuhr: reticências assinadas; Justen: declaração falsa art. 155 VIII). */
  requerCorrecao?: boolean;
  /** Aviso exibido junto ao item (ex.: desenquadramento iminente) — não bloqueia, exige atenção. */
  aviso?: string;
}

export type ReviewDecision =
  | { status: "aprovado"; em: string }
  | {
      status: "corrigido";
      valorHumano: string;
      em: string;
      /** E2: correção pode ser um ARQUIVO subido pelo humano (blob no vault) — ele vira o documento oficial do item. */
      arquivoId?: string;
      arquivoNome?: string;
    };

/** Estado de revisão por item — persiste fora do motor (localStorage hoje, DB depois). */
export type ReviewState = Record<string, ReviewDecision>;

export interface ReviewedItem extends ReviewItem {
  status: "pendente" | "aprovado" | "corrigido";
  /** Valor que vale: humano quando corrigido, senão o do motor. */
  valorFinal: string;
  valorHumano?: string;
  revisadoEm?: string;
  /** E2: arquivo do revisor humano (substitui a geração .docx deste item). */
  arquivoId?: string;
  arquivoNome?: string;
}

function fmtBRL(value: number | null): string {
  if (value === null) return "valor não extraído da fonte";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Monta o dossiê pré-preenchido de uma oportunidade marcada como interesse. */
export function buildReviewDossier(
  opportunity: Opportunity,
  ccp: CompanyCapabilityProfile,
): ReviewItem[] {
  const items: ReviewItem[] = [];
  const oid = opportunity.id;

  // 1. Dados do certame (grounded no snapshot da fonte)
  items.push(
    {
      id: `${oid}-certame-orgao`,
      secao: "Dados do certame",
      label: "Órgão / comprador",
      valorMotor: `${opportunity.buyer} · ${opportunity.city}/${opportunity.uf}`,
      proveniencia: `Fonte ${opportunity.source.toUpperCase()} (snapshot discovery)`,
    },
    {
      id: `${oid}-certame-valor`,
      secao: "Dados do certame",
      label: "Valor estimado",
      valorMotor: fmtBRL(opportunity.estimatedValue),
      proveniencia: `Fonte ${opportunity.source.toUpperCase()}`,
    },
    {
      id: `${oid}-certame-prazo`,
      secao: "Dados do certame",
      label: "Prazo / sessão",
      valorMotor: opportunity.proposalDeadline ?? "prazo não extraído — confirmar no portal",
      proveniencia: `Fonte ${opportunity.source.toUpperCase()}`,
    },
  );

  // 2. As 4 frentes calculadas (motor de checklist)
  for (const check of opportunity.habilitationChecklist) {
    items.push({
      id: `${oid}-frente-${check.label.toLowerCase().replace(/[^a-z]+/g, "-")}`,
      secao: "Habilitação — 4 frentes",
      label: check.label,
      valorMotor: check.note,
      proveniencia: "Motor Noyce (CCP × edital quando parseado)",
    });
  }

  // 3. Declarações padrão da Lei 14.133 — pré-redigidas com os dados da ENIAC
  const empresa = `${ccp.identity.razaoSocial} (CNPJ ${ccp.identity.cnpj})`;
  items.push(
    {
      id: `${oid}-decl-impeditivo`,
      secao: "Declarações (pré-redigidas)",
      label: "Inexistência de fato impeditivo",
      // Citação corrigida (conclave 12/Jun, Justen): art. 63, I da 14.133 é a declaração SUBSTITUTIVA;
      // a de fato impeditivo é praxe editalícia herdada do art. 32, §2º, da Lei 8.666/93.
      valorMotor: `${empresa} declara, sob as penas da lei, que não há fato impeditivo à sua habilitação, ciente da obrigação de declarar ocorrências posteriores (praxe editalícia herdada do art. 32, §2º, Lei 8.666/93 — o modelo anexo do edital prevalece).`,
      proveniencia: "Template praxe editalícia + identidade do CCP — conferir modelo do edital",
      aviso: "O modelo anexo do edital prevalece sobre este template — conferir antes de assinar.",
    },
    // Porte DERIVADO do balanço, nunca do cadastro (A2 — conclave 12/Jun, Justen).
    ...(() => {
      const porteInfo = derivePorte(ccp);
      const desenquadrado = porteInfo.alerta === "desenquadrado_do_declarado";
      return [
        {
          id: `${oid}-decl-meepp`,
          secao: "Declarações (pré-redigidas)",
          label: "Enquadramento ME/EPP",
          valorMotor: desenquadrado
            ? `⛔ NÃO PRÉ-REDIGIDA. ${porteInfo.nota}`
            : `${empresa} declara que cumpre os requisitos legais para qualificação como ${porteInfo.porte ?? "ME/EPP"}, nos termos da LC 123/2006, estando apta a usufruir do tratamento favorecido.`,
          proveniencia: desenquadrado
            ? "Motor RECUSOU redigir — porte calculado diverge do cadastro"
            : `Porte ${porteInfo.porte} derivado da receita ${porteInfo.exercicio ?? "?"} (não do cadastro)`,
          requerCorrecao: desenquadrado || porteInfo.alerta === "sem_receita",
          aviso: porteInfo.alerta ? porteInfo.nota : undefined,
        },
      ];
    })(),
    {
      id: `${oid}-decl-menor`,
      secao: "Declarações (pré-redigidas)",
      label: "Art. 7º, XXXIII, CF (menor)",
      valorMotor: `${empresa} declara que não emprega menor de 18 anos em trabalho noturno, perigoso ou insalubre, nem menor de 16 anos, salvo na condição de aprendiz a partir de 14 anos (art. 68, VI, Lei 14.133/2021).`,
      proveniencia: "Template 14.133",
    },
    {
      id: `${oid}-decl-proposta`,
      secao: "Declarações (pré-redigidas)",
      label: "Elaboração independente de proposta",
      // Placeholder com reticências MORTO (conclave 12/Jun, Niebuhr: "texto-placeholder dentro de
      // documento que será assinado é bomba armada"). Texto completo; modelo do edital prevalece.
      valorMotor: `${empresa} declara, sob as penas da lei, que a proposta apresentada foi elaborada de maneira independente, que seu conteúdo não foi, no todo ou em parte, direta ou indiretamente, informado, discutido ou recebido de qualquer outro participante potencial ou de fato deste certame, e que não tentou influenciar a decisão de qualquer outro participante quanto a participar ou não da licitação.`,
      proveniencia: "Template praxe consolidada (declaração de elaboração independente) — o modelo anexo do edital prevalece",
      aviso: "Conferir o modelo anexo do edital — a redação do edital prevalece sobre este template.",
    },
  );

  // 4. Proposta — valor de abertura sugerido com CLAMP de exequibilidade (A4 — conclave 12/Jun, Justen).
  // Art. 59, §4º: em obras/engenharia, proposta < 75% do orçado é PRESUMIDAMENTE INEXEQUÍVEL (desclassificável).
  // §5º: abaixo de 85% pode ser exigida garantia adicional. O P25 histórico pode estar sob o piso legal.
  const median = opportunity.market?.priceBand.medianBRL ?? null;
  const est = opportunity.estimatedValue;
  const pisoLegal = est !== null ? est * 0.75 : null;
  const faixaGarantiaAdicional = est !== null ? est * 0.85 : null;
  let propostaTexto: string;
  let propostaAviso: string | undefined;
  if (median !== null && est !== null && pisoLegal !== null) {
    const sugerido = Math.min(Math.max(median, pisoLegal), est);
    const clampado = sugerido !== median;
    propostaTexto = clampado
      ? `${fmtBRL(sugerido)} — mediana histórica deste órgão (${fmtBRL(median)}) está ${median < pisoLegal ? "ABAIXO do piso legal de exequibilidade" : "acima do estimado"}; sugerido o limite legal. Piso art. 59 §4º: ${fmtBRL(pisoLegal)} (75% do estimado).`
      : `${fmtBRL(sugerido)} (mediana real de obras deste órgão). Piso legal de exequibilidade: ${fmtBRL(pisoLegal)} (75%, art. 59 §4º) — abaixo disso, desclassificação presumida.`;
    if (faixaGarantiaAdicional !== null && sugerido < faixaGarantiaAdicional) {
      propostaAviso = `Valor sugerido abaixo de 85% do estimado (${fmtBRL(faixaGarantiaAdicional)}) — o órgão pode exigir garantia adicional (art. 59 §5º).`;
    }
  } else if (est !== null && pisoLegal !== null) {
    propostaTexto = `Sem histórico de preço deste órgão no PNCP — teto: estimado ${fmtBRL(est)}; piso legal de exequibilidade: ${fmtBRL(pisoLegal)} (75%, art. 59 §4º). Compor BDI próprio dentro dessa faixa.`;
  } else {
    propostaTexto = "Valor estimado não extraído — confirmar no edital antes de compor proposta (sem ele não há piso de exequibilidade calculável).";
  }
  items.push({
    id: `${oid}-proposta-abertura`,
    secao: "Proposta",
    label: "Valor de abertura sugerido",
    valorMotor: propostaTexto,
    proveniencia: median !== null ? "Vencedores reais PNCP + clamp art. 59 §§4º-5º" : "Faixa legal art. 59 — sem histórico recuperável",
    aviso: propostaAviso,
  });

  // Guarda anti-placeholder (A3): nenhum texto com reticências/colchetes-de-preenchimento em
  // DECLARAÇÃO pode ser aprovável como está — placeholder assinado é bomba armada (Niebuhr).
  const PLACEHOLDER_RE = /\.\.\.|\[[^\]]*(preencher|confirmar|conferir|xxx|tbd)[^\]]*\]|\bTBD\b|\bXXX\b/i;
  for (const item of items) {
    if (item.secao.startsWith("Declarações") && PLACEHOLDER_RE.test(item.valorMotor)) {
      item.requerCorrecao = true;
      item.aviso = `${item.aviso ? item.aviso + " " : ""}Texto contém trecho a preencher — corrija antes; aprovação bloqueada.`;
    }
  }

  return items;
}

/** Aplica o estado de revisão humana sobre o dossiê do motor. Valor humano SEMPRE prevalece. */
export function mergeReview(items: ReviewItem[], state: ReviewState): ReviewedItem[] {
  return items.map((item) => {
    const decision = state[item.id];
    if (!decision) return { ...item, status: "pendente", valorFinal: item.valorMotor };
    if (decision.status === "corrigido") {
      return {
        ...item,
        status: "corrigido",
        valorFinal: decision.valorHumano,
        valorHumano: decision.valorHumano,
        revisadoEm: decision.em,
      };
    }
    return { ...item, status: "aprovado", valorFinal: item.valorMotor, revisadoEm: decision.em };
  });
}

export function reviewProgress(items: ReviewedItem[]): { done: number; total: number; ready: boolean } {
  const done = items.filter((item) => item.status !== "pendente").length;
  return { done, total: items.length, ready: done === items.length && items.length > 0 };
}
