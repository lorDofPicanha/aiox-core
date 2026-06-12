// Checklist de habilitação CALCULADO (pedido do owner 12/Jun): as 4 frentes — fiscal/trabalhista,
// técnica, econômico-financeira e proposta — deixam de ser texto estático e passam a ser conferidas
// pelo motor com os dados reais do CCP (certidões, acervo, balanço) e do edital quando parseado.
// Invariante mantida: proveniência na nota + revisão humana obrigatória (o Noyce confere, não envia).
import type {
  CompanyCapabilityProfile,
  FinancialSnapshot,
  HabilitationResult,
  HabilitationStatus,
} from "./noyce-model";

export interface ChecklistItem {
  label: string;
  status: "ok" | "warning" | "missing";
  note: string;
}

export interface ChecklistInput {
  estimatedValue: number | null;
  proposalDeadline: string | null;
  habilitationResult: HabilitationResult | null;
  /** Relógio determinístico do app (mesmo asOf dos scores) — nada de new Date() aqui. */
  asOf: string;
}

// Lei 14.133 art. 69: exigência de PL limitada a até 10% do valor estimado (doc 26 §1.3).
const DEFAULT_PL_PERCENT = 0.1;

const BLOCK_TO_STATUS: Record<HabilitationStatus, ChecklistItem["status"]> = {
  ATENDE: "ok",
  ATENDE_COM_RESSALVA: "warning",
  PARCIAL: "warning",
  NAO_ATENDE: "missing",
  INDETERMINADO: "warning",
};

function latestFinancial(financials: readonly FinancialSnapshot[]): FinancialSnapshot | null {
  return [...financials].sort((a, b) => b.exercicio - a.exercicio)[0] ?? null;
}

function brl(value: number): string {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(2).replace(".", ",")} mi`;
  if (value >= 1_000) return `R$ ${Math.round(value / 1_000)} mil`;
  return `R$ ${Math.round(value)}`;
}

function daysBetween(deadline: string | null, asOf: string): number | null {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline).getTime() - new Date(asOf).getTime()) / 86_400_000);
}

function fiscalTrabalhista(ccp: CompanyCapabilityProfile, input: ChecklistInput): ChecklistItem {
  const label = "Fiscal e trabalhista";
  const fromEdital = input.habilitationResult?.porBloco.juridica_fiscal_trabalhista ?? null;
  if (fromEdital) {
    const pend = fromEdital.evaluations.filter((ev) => ev.status !== "ATENDE").length;
    return {
      label,
      status: BLOCK_TO_STATUS[fromEdital.status] ?? "warning",
      note:
        pend === 0
          ? `Motor conferiu ${fromEdital.evaluations.length} exigência(s) do edital contra o vault: todas atendidas.`
          : `Motor conferiu o edital: ${pend} de ${fromEdital.evaluations.length} exigência(s) pendente(s) — ver dossiê acima.`,
    };
  }
  const docs = ccp.regularity;
  if (docs.length === 0) {
    return {
      label,
      status: "missing",
      note: "Vault sem certidões — anexe CND Federal/Estadual/Municipal, CRF-FGTS e CNDT para o Noyce conferir vigência contra a data da sessão automaticamente.",
    };
  }
  const sessionDate = input.proposalDeadline ?? input.asOf;
  const vencidas = docs.filter(
    (doc) => doc.status === "vencido" || (doc.validade !== null && new Date(doc.validade) < new Date(sessionDate)),
  );
  const desconhecidas = docs.filter((doc) => doc.status === "pendente" || doc.status === "desconhecido");
  if (vencidas.length > 0) {
    return {
      label,
      status: "missing",
      note: `${vencidas.length} certidão(ões) vencida(s) na data da sessão: ${vencidas.map((d) => d.tipo).join(", ")} — renovar antes da proposta.`,
    };
  }
  if (desconhecidas.length > 0) {
    return {
      label,
      status: "warning",
      note: `${docs.length - desconhecidas.length} certidão(ões) vigente(s); ${desconhecidas.length} sem validade confirmada (${desconhecidas.map((d) => d.tipo).join(", ")}).`,
    };
  }
  return {
    label,
    status: "ok",
    note: `${docs.length} certidão(ões) vigente(s) na data da sessão — conferência automática do vault.`,
  };
}

function qualificacaoTecnica(ccp: CompanyCapabilityProfile, input: ChecklistInput): ChecklistItem {
  const label = "Qualificação técnica";
  const result = input.habilitationResult;
  if (result) {
    const blocks = [result.porBloco.tecnico_profissional, result.porBloco.tecnico_operacional];
    const worst = blocks.reduce<ChecklistItem["status"]>((acc, block) => {
      const mapped = BLOCK_TO_STATUS[block.status] ?? "warning";
      if (mapped === "missing" || acc === "missing") return "missing";
      if (mapped === "warning" || acc === "warning") return "warning";
      return "ok";
    }, "ok");
    const gaps = blocks.flatMap((block) => block.gaps);
    return {
      label,
      status: worst,
      note:
        gaps.length === 0
          ? "Motor casou acervo (CATs) × exigências do edital: cobre as parcelas de maior relevância."
          : `Motor casou acervo × edital: ${gaps.length} lacuna(s) — ${gaps
              .slice(0, 2)
              .map((gap) => gap.descricao)
              .join("; ")}${gaps.length > 2 ? "…" : ""}`,
    };
  }
  const classes = Object.keys(ccp.derived.capabilityByService).length;
  return {
    label,
    status: "warning",
    note: `Acervo pronto no vault (${ccp.acervo.length} documentos, ${classes} classes de serviço, RTs ${ccp.rts
      .map((rt) => rt.nome.split(" ")[0])
      .join("/")}). Falta o edital parseado para casar exigências — anexar o PDF.`,
  };
}

function economicoFinanceira(ccp: CompanyCapabilityProfile, input: ChecklistInput): ChecklistItem {
  const label = "Econômico-financeira";
  const fromEdital = input.habilitationResult?.porBloco.economico_financeira ?? null;
  const fin = latestFinancial(ccp.financials);
  if (fromEdital && fin) {
    const teto = input.habilitationResult?.solo.tetoSolo;
    return {
      label,
      status: BLOCK_TO_STATUS[fromEdital.status] ?? "warning",
      note: `Motor aplicou os índices/PL do edital: ${fromEdital.status}${
        teto ? ` · teto solo ${brl(teto)} (PL ${fin.exercicio})` : ""
      }.`,
    };
  }
  if (!fin || fin.patrimonioLiquido === null) {
    return { label, status: "missing", note: "Sem balanço no vault — anexar para calcular teto solo e índices." };
  }
  const teto = fin.patrimonioLiquido / DEFAULT_PL_PERCENT;
  const lc =
    fin.ativoCirc !== null && fin.passivoCirc !== null && fin.passivoCirc > 0
      ? (fin.ativoCirc / fin.passivoCirc).toFixed(1).replace(".", ",")
      : null;
  const base = `PL ${fin.exercicio} ${brl(fin.patrimonioLiquido)} → teto solo ${brl(teto)} (10% art. 69)${
    lc ? ` · LC ${lc}` : ""
  }`;
  if (input.estimatedValue === null) {
    return { label, status: "warning", note: `${base}. Valor do edital ausente — confirmar para fechar a conta.` };
  }
  if (input.estimatedValue <= teto) {
    const folga = (teto / input.estimatedValue).toFixed(1).replace(".", ",");
    return { label, status: "ok", note: `${base}. Este edital ${brl(input.estimatedValue)} = folga ${folga}× — habilita solo.` };
  }
  return {
    label,
    status: "missing",
    note: `${base}. Este edital ${brl(input.estimatedValue)} EXCEDE o teto solo — avaliar consórcio (técnica soma integral, art. 15 §2º).`,
  };
}

// A4 (conclave 12/Jun, Niebuhr): garantia de proposta (art. 58, ~1%) leva DIAS para emitir —
// todo edital do corpus exige; alertar em D-7, não em D-1. Visita técnica/declaração de pleno
// conhecimento idem: quem não visitou e não declarou está fora.
function garantiaEVisita(input: ChecklistInput): ChecklistItem {
  const label = "Garantia de proposta e visita técnica";
  const days = daysBetween(input.proposalDeadline, input.asOf);
  const valorGarantia = input.estimatedValue !== null ? brl(input.estimatedValue * 0.01) : null;
  const base = valorGarantia
    ? `Se o edital exigir (típico em obras): garantia ~1% = ${valorGarantia} (art. 58)`
    : "Se o edital exigir: garantia de até 1% do estimado (art. 58)";
  if (days !== null && days < 0) {
    return { label, status: "missing", note: "Prazo encerrado — sem janela para garantia ou visita." };
  }
  if (days !== null && days <= 7) {
    return {
      label,
      status: "missing",
      note: `JANELA CRÍTICA (${days}d): ${base} precisa estar EMITIDA já — seguro/fiança leva dias. Conferir também visita técnica/declaração de pleno conhecimento do local.`,
    };
  }
  return {
    label,
    status: "warning",
    note: `${base} — emitir até D-7 da sessão (emissão leva dias). Conferir no edital: visita técnica obrigatória OU declaração de pleno conhecimento do local (clássico de obra municipal).`,
  };
}

function propostaPlanilha(input: ChecklistInput): ChecklistItem {
  const label = "Proposta e planilha";
  const days = daysBetween(input.proposalDeadline, input.asOf);
  if (days !== null && days < 0) {
    return { label, status: "missing", note: `Prazo encerrado há ${Math.abs(days)} dia(s) — sem envio possível.` };
  }
  if (days !== null && days < 5) {
    return {
      label,
      status: "warning",
      note: `Sessão em ${days} dia(s) — revisar composição de custo/BDI AGORA (revisão humana; Noyce não compõe proposta).`,
    };
  }
  return {
    label,
    status: "ok",
    note:
      days === null
        ? "Prazo a confirmar na fonte. Composição/BDI é revisão humana antes do envio."
        : `${days} dia(s) até a sessão — janela confortável para compor planilha/BDI (revisão humana antes do envio).`,
  };
}

export function buildHabilitationChecklist(
  ccp: CompanyCapabilityProfile,
  input: ChecklistInput,
): ChecklistItem[] {
  return [
    fiscalTrabalhista(ccp, input),
    qualificacaoTecnica(ccp, input),
    economicoFinanceira(ccp, input),
    garantiaEVisita(input),
    propostaPlanilha(input),
  ];
}
