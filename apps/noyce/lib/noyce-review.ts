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
  | { status: "corrigido"; valorHumano: string; em: string };

/** Estado de revisão por item — persiste fora do motor (localStorage hoje, DB depois). */
export type ReviewState = Record<string, ReviewDecision>;

export interface ReviewedItem extends ReviewItem {
  status: "pendente" | "aprovado" | "corrigido";
  /** Valor que vale: humano quando corrigido, senão o do motor. */
  valorFinal: string;
  valorHumano?: string;
  revisadoEm?: string;
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
      valorMotor: `${empresa} declara, sob as penas da lei, que não há fato impeditivo à sua habilitação, ciente da obrigação de declarar ocorrências posteriores (art. 63, I, Lei 14.133/2021).`,
      proveniencia: "Template 14.133 + identidade do CCP",
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
      valorMotor: `${empresa} declara que a proposta foi elaborada de forma independente, sem conluio com outros licitantes (art. 63, §4º... conferir redação exata exigida no edital).`,
      proveniencia: "Template 14.133 — conferir redação do edital",
    },
  );

  // 4. Proposta — valor de abertura sugerido (mercado real quando existe)
  const median = opportunity.market?.priceBand.medianBRL ?? null;
  items.push({
    id: `${oid}-proposta-abertura`,
    secao: "Proposta",
    label: "Valor de abertura sugerido",
    valorMotor: median
      ? `${fmtBRL(median)} (mediana real de obras deste órgão; piso de disputa P25 ${fmtBRL(opportunity.market?.priceBand.p25BRL ?? null)})`
      : `Sem histórico de preço deste órgão no PNCP — usar o valor estimado ${fmtBRL(opportunity.estimatedValue)} como teto e compor BDI próprio.`,
    proveniencia: median ? "Vencedores reais PNCP (market snapshot)" : "Lacuna honesta — sem histórico recuperável",
  });

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
