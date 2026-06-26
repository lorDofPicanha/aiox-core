// Fluxo "Interesse → Dossiê → Revisão humana" (owner 12/Jun):
// ao marcar interesse no Monitorar, o motor pré-preenche TUDO que a licitação vai precisar;
// o humano revisa item a item; o que o humano CORRIGIR fica travado — o motor nunca
// sobrescreve um valor humano (proveniência vira "humano", com registro do valor original).
import type { CompanyCapabilityProfile, EditalRequirementsModel, Opportunity } from "./noyce-model";
import { derivePorte } from "./noyce-porte.ts";
import { getTemplate, mapDeclaracaoLabel, type DeclaracaoTipo } from "./noyce-declaracoes.ts";

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
  /** Quando o item nasce de uma exigência do edital (ERM), o rótulo ORIGINAL do edital —
   *  usado pelo gate de completude p/ casar exigência ↔ item gerado (1:1). */
  editalLabel?: string;
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

// Declarações praxe que QUASE todo edital de obra 14.133 exige — rede de segurança quando o
// ERM vem incompleto (parser pode não listar todas). Incluir extra não inabilita; FALTAR sim.
const DECLARACOES_PRAXE: DeclaracaoTipo[] = ["menor", "elaboracao_independente", "cumprimento_requisitos_habilitacao"];

function slug(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
}

/** Item ME/EPP — porte DERIVADO do balanço, nunca do cadastro (A2 — conclave 12/Jun, Justen). */
function buildMeEppItem(oid: string, ccp: CompanyCapabilityProfile, empresa: string, editalLabel?: string): ReviewItem {
  const porteInfo = derivePorte(ccp);
  const desenquadrado = porteInfo.alerta === "desenquadrado_do_declarado";
  return {
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
    editalLabel,
  };
}

/** Item de declaração a partir de um template canônico. */
function buildTemplateItem(oid: string, tipo: DeclaracaoTipo, empresa: string, editalLabel?: string, praxe = false): ReviewItem {
  const tpl = getTemplate(tipo)!;
  return {
    id: `${oid}-decl-${tipo}`,
    secao: "Declarações (pré-redigidas)",
    label: tpl.label,
    valorMotor: tpl.texto(empresa),
    proveniencia: `Template (${tpl.citacao}) + identidade do CCP — o modelo anexo do edital prevalece`,
    aviso: praxe
      ? "Declaração de praxe (não confirmada no ERM deste edital) — conferir o edital; o modelo anexo prevalece."
      : "O modelo anexo do edital prevalece sobre este template — conferir antes de assinar.",
    editalLabel,
  };
}

/**
 * Declarações do dossiê. Com ERM: dirigidas pelo que o edital EXIGE (juridica.declaracoes),
 * + rede de segurança praxe, + slot p/ declaração específica sem template (decisão owner: usar
 * modelo anexo do edital via IA + revisão humana → aqui entra como pendência bloqueada, nunca
 * silenciosamente ausente). Sem ERM: conjunto fixo (compatibilidade).
 */
function buildDeclaracoes(
  oid: string,
  ccp: CompanyCapabilityProfile,
  empresa: string,
  erm?: EditalRequirementsModel,
): ReviewItem[] {
  if (!erm || erm.juridica.declaracoes.length === 0) {
    // Compatibilidade: conjunto fixo praxe (impeditivo, ME/EPP, menor, elaboração independente).
    return [
      buildTemplateItem(oid, "fato_impeditivo", empresa),
      buildMeEppItem(oid, ccp, empresa),
      buildTemplateItem(oid, "menor", empresa),
      buildTemplateItem(oid, "elaboracao_independente", empresa),
    ];
  }

  const out: ReviewItem[] = [];
  const cobertos = new Set<DeclaracaoTipo>();
  for (const editalLabel of erm.juridica.declaracoes) {
    const tipo = mapDeclaracaoLabel(editalLabel);
    if (tipo === "me_epp") {
      out.push(buildMeEppItem(oid, ccp, empresa, editalLabel));
      cobertos.add("me_epp");
    } else if (tipo) {
      out.push(buildTemplateItem(oid, tipo, empresa, editalLabel));
      cobertos.add(tipo);
    } else {
      // Exigida pelo edital, sem template → NÃO some; vira pendência bloqueada p/ o modelo do edital.
      out.push({
        id: `${oid}-decl-edital-${slug(editalLabel)}`,
        secao: "Declarações (pré-redigidas)",
        label: editalLabel.slice(0, 90),
        valorMotor: `⛔ Declaração exigida por ESTE edital, sem template no Noyce. Usar o MODELO ANEXO do edital (adaptação assistida + revisão humana). Não assinar sem o texto do edital.`,
        proveniencia: "Exigida pelo ERM do edital — sem template canônico",
        requerCorrecao: true,
        aviso: "Declaração específica deste edital — preencher com o modelo anexo do edital.",
        editalLabel,
      });
    }
  }
  // Rede de segurança: declarações praxe não cobertas pelo ERM entram como praxe (extra ≠ fatal).
  for (const tipo of DECLARACOES_PRAXE) {
    if (!cobertos.has(tipo)) out.push(buildTemplateItem(oid, tipo, empresa, undefined, true));
  }
  return out;
}

/** Certidões fiscais/trabalhistas EXIGIDAS pelo edital (anexar do vault). Visibilidade de completude. */
function buildCertidoesExigidas(oid: string, erm: EditalRequirementsModel): ReviewItem[] {
  return erm.fiscalTrabalhista.CNDs.map((label) => ({
    id: `${oid}-cnd-${slug(label)}`,
    secao: "Certidões exigidas (anexar do vault)",
    label: label.slice(0, 90),
    valorMotor: "Exigida pelo edital — anexar a certidão VÁLIDA na data da sessão (aba Governança/vault).",
    proveniencia: "ERM do edital (regularidade fiscal/trabalhista)",
    requerCorrecao: true, // não é assinável pelo motor: depende do documento real no vault
    aviso: "Conferir validade da certidão na data da sessão — vencida = inabilitação.",
    editalLabel: label,
  }));
}

/** Monta o dossiê pré-preenchido de uma oportunidade marcada como interesse. */
export function buildReviewDossier(
  opportunity: Opportunity,
  ccp: CompanyCapabilityProfile,
  erm?: EditalRequirementsModel,
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

  // 3. Declarações — dirigidas pelo edital (ERM) quando disponível; senão o conjunto-praxe fixo.
  const empresa = `${ccp.identity.razaoSocial} (CNPJ ${ccp.identity.cnpj})`;
  items.push(...buildDeclaracoes(oid, ccp, empresa, erm));

  // 3b. Certidões fiscais/trabalhistas EXIGIDAS pelo edital (anexar do vault) — só com ERM.
  if (erm) items.push(...buildCertidoesExigidas(oid, erm));

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
