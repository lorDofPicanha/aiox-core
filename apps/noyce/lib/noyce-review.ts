// Fluxo "Interesse → Dossiê → Revisão humana" (owner 12/Jun):
// ao marcar interesse no Monitorar, o motor pré-preenche TUDO que a licitação vai precisar;
// o humano revisa item a item; o que o humano CORRIGIR fica travado — o motor nunca
// sobrescreve um valor humano (proveniência vira "humano", com registro do valor original).
import type {
  CompanyCapabilityProfile,
  EditalRequirementsModel,
  HabilitationBlockResult,
  HabilitationResult,
  HabilitationStatus,
  Opportunity,
  RequirementEvaluation,
} from "./noyce-model";
import { derivePorte } from "./noyce-porte.ts";
import { getTemplate, mapDeclaracaoLabel, type DeclaracaoTipo } from "./noyce-declaracoes.ts";
import { buildHabilitationResult } from "./noyce-habilitation.ts";

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

// ───────────────────────── Documentos por bloco de habilitação (Fase 2) ─────────────────────────
// Cada bloco do HabilitationResult (cruzamento ACERVO REAL × ERM do edital) vira um DOCUMENTO no
// dossiê — não mais uma simples nota. Conteúdo 100% grounded no motor; requer correção humana quando
// o requisito não é plenamente coberto (não se assina capacidade que não se tem — Justen/Niebuhr).

const HAB_STATUS_PT: Record<HabilitationStatus, string> = {
  ATENDE: "atende",
  ATENDE_COM_RESSALVA: "atende com ressalva",
  PARCIAL: "parcial",
  NAO_ATENDE: "não atende",
  INDETERMINADO: "indeterminado",
};

const STATUS_FRACO = new Set<HabilitationStatus>(["NAO_ATENDE", "INDETERMINADO", "PARCIAL"]);

function evalLinha(ev: RequirementEvaluation): string {
  const un = ev.unidade ? ` ${ev.unidade}` : "";
  const partes: string[] = [`Status: ${HAB_STATUS_PT[ev.status]}.`];
  if (ev.qtdMin !== undefined && ev.qtdMin !== null) partes.push(`Exigido: ${ev.qtdMin}${un}.`);
  if (ev.disponivel !== undefined && ev.disponivel !== null) {
    const cons =
      ev.disponivelConservador !== undefined &&
      ev.disponivelConservador !== null &&
      ev.disponivelConservador !== ev.disponivel
        ? ` (conservador: ${ev.disponivelConservador}${un})`
        : "";
    partes.push(`ENIAC dispõe: ${ev.disponivel}${un}${cons}.`);
  }
  if (ev.evidencia.length) partes.push(`Evidência: ${ev.evidencia.join(" ")}`);
  return partes.join(" ");
}

/** Converte um bloco do motor numa lista de itens-documento (1 por requisito avaliado). */
function blockToDocs(oid: string, secao: string, block: HabilitationBlockResult): ReviewItem[] {
  return block.evaluations.map((ev) => {
    const fraco = STATUS_FRACO.has(ev.status);
    return {
      id: `${oid}-${slug(secao)}-${slug(ev.requisito)}`,
      secao,
      label: ev.requisito.slice(0, 90),
      valorMotor: evalLinha(ev),
      proveniencia: "Motor Noyce — acervo real da ENIAC × exigência do edital (ERM)",
      requerCorrecao: fraco || undefined,
      aviso: fraco ? "Requisito não plenamente coberto pelo acervo — ver lacuna/consórcio na aba Habilitar." : undefined,
      editalLabel: ev.requisito,
    };
  });
}

function fmtIdx(n: number | null): string {
  return n === null ? "—" : n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Qualificação Técnica = DOCUMENTO PREENCHIDO com os RTs e o acervo REAL da ENIAC, mais a matriz de
 * atendimento exigência-a-exigência. Pronto para conferência humana e uso — não uma lista do que falta.
 */
// Casa um título exigido no quadro (ex.: "Engenheiro Civil") contra os RTs reais da empresa.
const QUADRO_KEY: { re: RegExp; titulo: RegExp }[] = [
  { re: /civil/i, titulo: /civil/i },
  { re: /arquitet/i, titulo: /arquitet/i },
  { re: /seguran/i, titulo: /seguran/i },
  { re: /eletric/i, titulo: /eletric/i },
  { re: /mec[âa]nic/i, titulo: /mec[âa]nic/i },
];
function quadroAtende(titulo: string, ccp: CompanyCapabilityProfile): { ok: boolean; quem: string | null } {
  if (/respons[áa]vel\s+t[ée]cnic/i.test(titulo)) {
    const rt = ccp.rts.find((r) => r.vinculo?.tipo === "responsavel_tecnico") ?? ccp.rts[0];
    return { ok: Boolean(rt), quem: rt ? rt.nome : null };
  }
  const key = QUADRO_KEY.find((k) => k.re.test(titulo));
  const rt = key ? ccp.rts.find((r) => key.titulo.test(r.titulo)) : ccp.rts.find((r) => r.titulo && titulo.toLowerCase().includes(r.titulo.toLowerCase().replace(/eng\.?\s*/i, "")));
  return { ok: Boolean(rt), quem: rt ? `${rt.nome} (${rt.titulo}${rt.crea ? `, ${rt.crea}` : ""})` : null };
}

function buildQualificacaoTecnica(
  oid: string,
  ccp: CompanyCapabilityProfile,
  erm: EditalRequirementsModel | undefined,
  result: HabilitationResult,
): ReviewItem[] {
  const rtNome = new Map(ccp.rts.map((r) => [r.id, r.nome]));
  // Quadro técnico (títulos) casa contra os RTs; atestados operacionais, contra o acervo (motor).
  const quadro = erm?.tecnica.quadroTecnico ?? [];
  const quadroAval = quadro.map((t) => ({ titulo: t, ...quadroAtende(t, ccp) }));
  const evals: RequirementEvaluation[] = [
    ...result.porBloco.tecnico_profissional.evaluations,
    ...result.porBloco.tecnico_operacional.evaluations,
  ];
  const naoAtende = [...quadroAval.filter((q) => !q.ok), ...evals.filter((e) => STATUS_FRACO.has(e.status))];

  const L: string[] = [];
  L.push(`RELAÇÃO DE QUALIFICAÇÃO TÉCNICA — ${ccp.identity.razaoSocial}, CNPJ ${ccp.identity.cnpj}${ccp.identity.creaEmpresa ? `, registrada no ${ccp.identity.creaEmpresa}` : ""}.`);
  L.push("");
  L.push("1. RESPONSÁVEIS TÉCNICOS:");
  if (ccp.rts.length === 0) L.push("   • (nenhum responsável técnico cadastrado)");
  for (const rt of ccp.rts) {
    const v = rt.vinculo ? ` — ${rt.vinculo.tipo.replace(/_/g, " ")}${rt.vinculo.desde ? ` desde ${rt.vinculo.desde}` : ""}` : "";
    L.push(`   • ${rt.nome} — ${rt.titulo}${rt.crea ? ` — ${rt.crea}` : ""}${v}`);
  }
  L.push("");
  L.push("2. ACERVO TÉCNICO (atestados/CAT registrados):");
  if (ccp.acervo.length === 0) L.push("   • (nenhum atestado no acervo)");
  for (const a of ccp.acervo) {
    const itens = a.itens.map((i) => `${i.servicoCanonico.replace(/_/g, " ").toLowerCase()} ${i.qtd}${i.unidade}`).join("; ");
    const val = a.valor != null ? ` — ${fmtBRL(a.valor)}` : "";
    L.push(`   • ${a.tipo.replace(/_/g, " ")} ${a.numero ?? "(s/nº)"} — RT ${rtNome.get(a.rtId) ?? "—"} — ${a.contratante}${a.tipoContratante ? ` (${a.tipoContratante})` : ""}${val} — ${itens}`);
  }
  L.push("");
  L.push("3. ATENDIMENTO ÀS EXIGÊNCIAS DO EDITAL:");
  if (quadroAval.length === 0 && evals.length === 0)
    L.push("   • (edital sem exigência técnica extraída — conferir Termo de Referência)");
  for (const q of quadroAval) {
    L.push(`   • ${q.titulo}: ${q.ok ? "ATENDE" : "NÃO ATENDE"}${q.ok && q.quem ? ` (${q.quem})` : q.ok ? "" : " — sem profissional no quadro"}`);
  }
  for (const ev of evals) {
    const un = ev.unidade ? ` ${ev.unidade}` : "";
    const detalhe = [
      ev.qtdMin != null ? `exigido ${ev.qtdMin}${un}` : null,
      ev.disponivel != null ? `ENIAC dispõe ${ev.disponivel}${un}` : null,
    ].filter(Boolean).join(", ");
    L.push(`   • ${ev.requisito}: ${HAB_STATUS_PT[ev.status].toUpperCase()}${detalhe ? ` (${detalhe})` : ""}`);
  }

  return [
    {
      id: `${oid}-qualtecnica-doc`,
      secao: "Qualificação Técnica (documento)",
      label: "Relação de qualificação técnica (RTs + acervo)",
      valorMotor: L.join("\n"),
      proveniencia: "Motor Noyce — RTs e acervo reais da ENIAC × exigências do edital (ERM)",
      requerCorrecao: naoAtende.length > 0 || undefined,
      aviso: naoAtende.length > 0
        ? `${naoAtende.length} exigência(s) não plenamente coberta(s) pelo acervo — ver lacuna/consórcio na aba Habilitar.`
        : undefined,
    },
  ];
}

/**
 * Qualificação Econômico-Financeira = DOCUMENTO PREENCHIDO com os índices REAIS calculados do balanço
 * da ENIAC (LC/LG/SG, PL), comparados ao exigido no edital. O balanço assinado é anexo do vault.
 */
function buildEconomicoFinanceira(
  oid: string,
  ccp: CompanyCapabilityProfile,
  erm: EditalRequirementsModel | undefined,
  result: HabilitationResult,
): ReviewItem[] {
  const fin = [...ccp.financials].sort((a, b) => b.exercicio - a.exercicio)[0];
  if (!fin) return blockToDocs(oid, "Qualificação Econômico-Financeira (documento)", result.porBloco.economico_financeira);

  const ac = fin.ativoCirc, pc = fin.passivoCirc, at = fin.ativoTotal;
  const rlp = fin.realizavelLongoPrazo ?? 0, elp = fin.exigivelLongoPrazo ?? 0;
  const lc = ac != null && pc != null && pc !== 0 ? ac / pc : null;
  const lg = ac != null && pc != null && pc + elp !== 0 ? (ac + rlp) / (pc + elp) : null;
  const sg = at != null && pc != null && pc + elp !== 0 ? at / (pc + elp) : null;
  const exig = erm?.economicoFinanceira.indices ?? {};
  const cmp = (val: number | null, min: number | null | undefined) =>
    min == null ? "" : val == null ? " (exigido ≥ " + fmtIdx(min) + ": pendente de dado)" : ` (exigido ≥ ${fmtIdx(min)}: ${val >= min ? "ATENDE" : "NÃO ATENDE"})`;

  const falhas: string[] = [];
  for (const [k, val] of [["LC", lc], ["LG", lg], ["SG", sg]] as const) {
    const min = (exig as Record<string, number | null | undefined>)[k];
    if (min != null && val != null && val < min) falhas.push(k);
  }

  const L: string[] = [];
  L.push(`QUALIFICAÇÃO ECONÔMICO-FINANCEIRA — ${ccp.identity.razaoSocial}, CNPJ ${ccp.identity.cnpj}.`);
  L.push(`Base: Balanço Patrimonial do exercício ${fin.exercicio}.`);
  L.push("");
  L.push(`   • Patrimônio Líquido: ${fmtBRL(fin.patrimonioLiquido)}`);
  if (ac != null && pc != null) L.push(`   • Ativo Circulante: ${fmtBRL(ac)} | Passivo Circulante: ${fmtBRL(pc)}`);
  L.push(`   • Liquidez Corrente (LC = AC/PC): ${fmtIdx(lc)}${cmp(lc, exig.LC)}`);
  L.push(`   • Liquidez Geral (LG = (AC+RLP)/(PC+ELP)): ${fmtIdx(lg)}${cmp(lg, exig.LG)}`);
  L.push(`   • Solvência Geral (SG = AT/(PC+ELP)): ${fmtIdx(sg)}${cmp(sg, exig.SG)}`);
  const plPct = erm?.economicoFinanceira.percentualPL ?? null;
  if (plPct != null) L.push(`   • Patrimônio líquido mínimo exigido: ${plPct}% do valor estimado.`);
  L.push("");
  L.push("Observação: anexar o Balanço Patrimonial e a DRE assinados pelo contador (CRC) e registrados na Junta Comercial.");

  return [
    {
      id: `${oid}-econfin-doc`,
      secao: "Qualificação Econômico-Financeira (documento)",
      label: `Qualificação econômico-financeira — índices do balanço ${fin.exercicio}`,
      valorMotor: L.join("\n"),
      proveniencia: fin.fonte || "CCP da ENIAC (balanço real)",
      requerCorrecao: falhas.length > 0 || undefined,
      aviso: falhas.length > 0
        ? `Índice(s) abaixo do exigido: ${falhas.join(", ")} — risco de inabilitação; revisar.`
        : "Índices atendem; anexar o balanço assinado pelo contador no vault (aba Governança).",
    },
  ];
}

// ── Valor por extenso (pt-BR, reais/centavos) — exigência do Modelo F (proposta vencedora) ──
const UNI = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
const DEZ = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
const CEM = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];
function trio(n: number): string {
  if (n === 0) return "";
  if (n === 100) return "cem";
  const c = Math.floor(n / 100), d = Math.floor((n % 100) / 10), u = n % 10;
  const parts: string[] = [];
  if (c) parts.push(CEM[c]);
  if (d === 1) parts.push(UNI[10 + u]);
  else {
    if (d) parts.push(DEZ[d]);
    if (u) parts.push(UNI[u]);
  }
  return parts.join(" e ");
}
function inteiroExtenso(n: number): string {
  if (n === 0) return "zero";
  const mi = Math.floor(n / 1_000_000), mil = Math.floor((n % 1_000_000) / 1000), r = n % 1000;
  const p: string[] = [];
  if (mi) p.push(`${mi === 1 ? "um milhão" : trio(mi) + " milhões"}`);
  if (mil) p.push(`${mil === 1 ? "mil" : trio(mil) + " mil"}`);
  if (r) p.push(trio(r));
  return p.join(" e ");
}
export function valorPorExtenso(valor: number): string {
  const reais = Math.floor(valor);
  const centavos = Math.round((valor - reais) * 100);
  // "de reais" quando o valor termina em milhão/milhões exatos (um milhão DE reais).
  const moeda = reais === 1 ? "real" : reais >= 1_000_000 && reais % 1_000_000 === 0 ? "de reais" : "reais";
  const ri = `${inteiroExtenso(reais)} ${moeda}`;
  if (centavos === 0) return ri;
  return `${ri} e ${inteiroExtenso(centavos)} ${centavos === 1 ? "centavo" : "centavos"}`;
}

/**
 * Proposta Comercial (Modelo F do padrão vencedor): documento formal com considerandos, valor por
 * extenso, validade e cláusula de vinculação — não só o número. `valorProposta` é o valor sugerido.
 */
function buildPropostaComercial(
  oid: string,
  ccp: CompanyCapabilityProfile,
  opportunity: Opportunity,
  valorProposta: number | null,
): ReviewItem[] {
  const empresa = `${ccp.identity.razaoSocial}, CNPJ ${ccp.identity.cnpj}`;
  const semValor = valorProposta === null;
  const L: string[] = [];
  L.push(`PROPOSTA COMERCIAL — ${opportunity.title} (${opportunity.buyer}).`);
  L.push("");
  L.push("Prezados Senhores,");
  L.push(`Nos termos do Edital e seus Anexos, ${empresa}, por seu representante legal, apresenta sua PROPOSTA COMERCIAL para o objeto licitado, declarando que:`);
  L.push("I. esta proposta é firme, vinculante, irrevogável e incondicional, observado o prazo de validade abaixo;");
  L.push("II. considerou todos os custos diretos e indiretos, tributos, encargos e o BDI necessários à integral execução do objeto, conforme projeto básico e planilhas do Edital;");
  L.push("III. concorda integralmente com as condições do Edital e seus Anexos e tem pleno conhecimento do objeto e do local de execução;");
  L.push("IV. o preço proposto observa o piso de exequibilidade do art. 59, §4º, da Lei 14.133/2021.");
  L.push("");
  if (semValor) {
    L.push("PREÇO GLOBAL OFERTADO: a definir pela ENIAC (valor estimado do edital não recuperado) — preencher antes de submeter.");
  } else {
    L.push(`PREÇO GLOBAL OFERTADO: ${fmtBRL(valorProposta)} (${valorPorExtenso(valorProposta)}).`);
  }
  L.push("VALIDADE DA PROPOSTA: 60 (sessenta) dias contados da data de abertura (art. 90, §4º — conferir prazo do Edital).");
  L.push("");
  L.push("O preço será sustentado pela planilha de composição de custo unitário e BDI anexa.");

  return [
    {
      id: `${oid}-proposta-comercial`,
      secao: "Proposta",
      label: "Proposta Comercial (peça formal)",
      valorMotor: L.join("\n"),
      proveniencia: "Modelo F (padrão vencedor Lei 14.133) + valor sugerido do motor",
      requerCorrecao: semValor || undefined,
      aviso: semValor
        ? "Valor estimado não recuperado — definir o preço global antes de submeter."
        : "Confira o preço final (decisão humana) e anexe a planilha de custo/BDI; valor por extenso gerado automaticamente.",
    },
  ];
}

/**
 * Carta de Credenciamento (Modelo E) + Termo de Aceitação (Modelo A) — peças que todo vencedor
 * anexa. Geradas a partir do representante legal real. Sem representante → rascunho.
 */
function buildCredenciamentoEAceitacao(oid: string, ccp: CompanyCapabilityProfile, opportunity: Opportunity): ReviewItem[] {
  const rep = ccp.identity.representanteLegal;
  const empresa = `${ccp.identity.razaoSocial}, CNPJ ${ccp.identity.cnpj}`;
  const sede = ccp.identity.sedeMunicipio ? `, com sede em ${ccp.identity.sedeMunicipio}` : "";
  const certame = `${opportunity.title} (${opportunity.buyer})`;
  const semRep = !rep?.nome;
  const repDesc = rep ? `${rep.nome}, ${rep.cargo}, CPF ${rep.cpf}${rep.rg ? `, RG ${rep.rg}` : ""}` : "[representante legal — completar no perfil]";
  const aviso = semRep ? "Defina o representante legal no perfil da empresa antes de assinar." : undefined;

  const credenciamento =
    `CARTA DE CREDENCIAMENTO — Ref.: ${certame}.\n\n` +
    `Prezados Senhores,\n` +
    `${empresa}${sede}, por seu administrador legalmente investido nos termos do contrato social${ccp.identity.nire ? ` (NIRE ${ccp.identity.nire})` : ""}, CREDENCIA o(a) Sr(a). ${repDesc}, conferindo-lhe poderes para representar a empresa em todos os atos da presente licitação, podendo, em especial: apresentar e assinar a proposta, formular lances e propostas verbais, negociar preços, prestar esclarecimentos, manifestar intenção de recurso, interpor e desistir de recursos, assinar atas e demais documentos, e praticar todos os atos necessários ao fiel cumprimento do Edital e seus Anexos.`;

  const aceitacao =
    `TERMO DE ACEITAÇÃO ÀS CONDIÇÕES DO EDITAL — Ref.: ${certame}.\n\n` +
    `Prezados Senhores,\n` +
    `${empresa}, por seu representante legal ${repDesc}, DECLARA, sob as penas da legislação aplicável, que aceita integralmente as condições estabelecidas no Edital e seus Anexos, que tem pleno conhecimento do objeto e das condições locais para a execução, que recebeu todos os elementos e informações necessários à elaboração de sua proposta, e que a ela adere sem qualquer ressalva, reserva ou condição.`;

  return [
    {
      id: `${oid}-credenciamento`,
      secao: "Credenciamento e aceitação (documento)",
      label: "Carta de credenciamento",
      valorMotor: credenciamento,
      proveniencia: "Modelo E (padrão vencedor Lei 14.133) + representante do perfil",
      requerCorrecao: semRep || undefined,
      aviso,
    },
    {
      id: `${oid}-termo-aceitacao`,
      secao: "Credenciamento e aceitação (documento)",
      label: "Termo de aceitação às condições do edital",
      valorMotor: aceitacao,
      proveniencia: "Modelo A (padrão vencedor Lei 14.133) + representante do perfil",
      requerCorrecao: semRep || undefined,
      aviso,
    },
  ];
}

/** Garantia de proposta — só quando o ERM marca o percentual (condicional ao edital). */
function buildGarantiaProposta(oid: string, erm: EditalRequirementsModel, opportunity: Opportunity): ReviewItem[] {
  const raw = erm.economicoFinanceira.garantiaPropostaPct;
  if (raw === null || !Number.isFinite(raw)) return [];
  const pct = raw <= 0.2 ? raw * 100 : raw; // normaliza fração→pontos percentuais
  const est = opportunity.estimatedValue;
  const valor = est !== null ? (est * pct) / 100 : null;
  const acimaLimite = pct > 1; // art. 58, §1º: garantia de PROPOSTA limitada a 1% do valor estimado
  return [
    {
      id: `${oid}-garantia-proposta`,
      secao: "Garantia de Proposta (documento)",
      label: `Garantia de proposta — ${pct}% do valor estimado`,
      valorMotor: `Edital exige garantia de proposta de ${pct}%${valor !== null ? ` ≈ ${fmtBRL(valor)}` : ""}. Modalidades (art. 96, Lei 14.133): caução em dinheiro/títulos, seguro-garantia ou fiança bancária. Providenciar e anexar o comprovante válido na data da sessão.`,
      proveniencia: "ERM do edital (econômico-financeira) + art. 96, Lei 14.133/2021",
      requerCorrecao: true,
      aviso: acimaLimite
        ? "⚠️ Garantia acima de 1% do estimado — excede o limite do art. 58, §1º; avaliar impugnação."
        : "Anexar o comprovante da garantia no vault (aba Governança).",
      editalLabel: `Garantia de proposta ${pct}%`,
    },
  ];
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

  // 3a. Credenciamento + termo de aceitação (Modelos E/A do padrão vencedor) — sempre presentes.
  items.push(...buildCredenciamentoEAceitacao(oid, ccp, opportunity));

  // 3b. Certidões fiscais/trabalhistas EXIGIDAS pelo edital (anexar do vault) — só com ERM.
  if (erm) items.push(...buildCertidoesExigidas(oid, erm));

  // 3c. DOCUMENTOS por bloco de habilitação (Fase 2) — cruzamento ACERVO REAL × ERM ao vivo.
  // Cada bloco vira um documento, não uma nota: qualificação técnica (CATs casados), econômico-
  // financeira (índices + balanço) e garantia de proposta (condicional ao edital).
  // Guarda: só roda o motor com um ERM de forma completa (extractErm/curado sempre traz os arrays
  // técnicos); um ERM mínimo/parcial não dispara o motor (evita quebra com dado ausente).
  if (erm && Array.isArray(erm.tecnica?.profissional) && Array.isArray(erm.tecnica?.operacional)) {
    try {
      const result = buildHabilitationResult(ccp, erm);
      items.push(...buildQualificacaoTecnica(oid, ccp, erm, result));
      items.push(...buildEconomicoFinanceira(oid, ccp, erm, result));
      items.push(...buildGarantiaProposta(oid, erm, opportunity));
    } catch {
      /* ERM incompleto p/ o motor — documentos por bloco ficam de fora; declarações/certidões já cobertas acima */
    }
  }

  // 4. Proposta — valor de abertura sugerido com CLAMP de exequibilidade (A4 — conclave 12/Jun, Justen).
  // Art. 59, §4º: em obras/engenharia, proposta < 75% do orçado é PRESUMIDAMENTE INEXEQUÍVEL (desclassificável).
  // §5º: abaixo de 85% pode ser exigida garantia adicional. O P25 histórico pode estar sob o piso legal.
  const median = opportunity.market?.priceBand.medianBRL ?? null;
  const est = opportunity.estimatedValue;
  const pisoLegal = est !== null ? est * 0.75 : null;
  const faixaGarantiaAdicional = est !== null ? est * 0.85 : null;
  let propostaTexto: string;
  let propostaAviso: string | undefined;
  let valorProposta: number | null = null;
  if (median !== null && est !== null && pisoLegal !== null) {
    const sugerido = Math.min(Math.max(median, pisoLegal), est);
    valorProposta = sugerido;
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

  // 4b. Proposta Comercial formal (Modelo F do padrão vencedor) — peça pronta, não só o número.
  items.push(...buildPropostaComercial(oid, ccp, opportunity, valorProposta ?? (est !== null ? est : null)));

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
