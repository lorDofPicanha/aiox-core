// Plano de Vitória (Sprint D3, 12/Jun): a Analisar deixa de ser só diagnóstico e vira o
// roteiro acionável de "o que fazer, quem faz e até quando" para GANHAR o certame —
// derivado do checklist calculado + gaps do motor + alarmes preclusivos do conclave
// (Niebuhr: garantia D-7, janela de upload, intenção de recurso, empate ficto ME).
import type { ChecklistItem } from "./noyce-checklist.ts";

export interface VictoryAction {
  id: string;
  ordem: number;
  acao: string;
  dono: "Operação ENIAC" | "Engenharia ENIAC" | "Representante legal" | "Noyce";
  /** ISO date do limite, ou null = "prazo a confirmar". */
  due: string | null;
  dueLabel: string;
  status: "atrasado" | "urgente" | "no_prazo" | "feito";
  fonte: string;
}

export interface VictoryPlanInput {
  checklist: readonly ChecklistItem[];
  proposalDeadline: string | null;
  asOf: string;
  reviewProgress: { done: number; total: number } | null;
}

const DAY = 86_400_000;

function minusDays(deadline: string, days: number): string {
  return new Date(new Date(deadline).getTime() - days * DAY).toISOString().slice(0, 10);
}

function statusFor(due: string | null, asOf: string): VictoryAction["status"] {
  if (due === null) return "no_prazo";
  const diff = (new Date(due).getTime() - new Date(asOf).getTime()) / DAY;
  if (diff < 0) return "atrasado";
  if (diff <= 3) return "urgente";
  return "no_prazo";
}

export function buildVictoryPlan(input: VictoryPlanInput): VictoryAction[] {
  const { checklist, proposalDeadline, asOf } = input;
  const actions: VictoryAction[] = [];
  const due = (days: number) => (proposalDeadline ? minusDays(proposalDeadline, days) : null);
  const label = (days: number, fallback: string) =>
    proposalDeadline ? `até ${minusDays(proposalDeadline, days)} (D-${days})` : fallback;

  const find = (labelPart: string) => checklist.find((c) => c.label.includes(labelPart));

  // 1. Atestado em nome da empresa — lead time mais longo (semanas), vem primeiro.
  const tecnica = find("técnica") ?? find("Qualificação");
  if (tecnica && tecnica.status !== "ok") {
    actions.push({
      id: "atestado-empresa",
      ordem: 0,
      acao: tecnica.note.includes("edital")
        ? "Anexar o PDF do edital no vault para o motor casar acervo × exigências"
        : "Solicitar atestado de capacidade operacional em NOME DA EMPRESA aos contratantes (leva semanas)",
      dono: "Engenharia ENIAC",
      due: due(15),
      dueLabel: label(15, "o quanto antes — emissão leva semanas"),
      status: statusFor(due(15), asOf),
      fonte: "Qualificação técnica (motor)",
    });
  }

  // 2. Certidões do vault.
  const fiscal = find("Fiscal");
  if (fiscal && fiscal.status !== "ok") {
    actions.push({
      id: "certidoes",
      ordem: 1,
      acao:
        fiscal.status === "missing" && fiscal.note.includes("Vault sem")
          ? "Subir CNDs (Federal/Estadual/Municipal), CRF-FGTS e CNDT no vault (Governança) — o Noyce confere a vigência"
          : `Regularizar certidões: ${fiscal.note}`,
      dono: "Operação ENIAC",
      due: due(5),
      dueLabel: label(5, "antes da sessão"),
      status: statusFor(due(5), asOf),
      fonte: "Fiscal e trabalhista (motor)",
    });
  }

  // 3. Garantia art. 58 — D-7 (emissão leva dias).
  const garantia = find("Garantia");
  if (garantia && garantia.status !== "ok") {
    actions.push({
      id: "garantia",
      ordem: 2,
      acao: "Emitir garantia de proposta (~1%, art. 58) e confirmar visita técnica/declaração de pleno conhecimento",
      dono: "Operação ENIAC",
      due: due(7),
      dueLabel: label(7, "emitir com 7+ dias de antecedência"),
      status: garantia.note.includes("JANELA CRÍTICA") ? "urgente" : statusFor(due(7), asOf),
      fonte: "Garantia e visita (motor, art. 58)",
    });
  }

  // 4. Revisão humana do dossiê.
  if (input.reviewProgress && input.reviewProgress.done < input.reviewProgress.total) {
    actions.push({
      id: "revisao",
      ordem: 3,
      acao: `Concluir a revisão humana do dossiê (${input.reviewProgress.done}/${input.reviewProgress.total}) e gerar as declarações .docx`,
      dono: "Representante legal",
      due: due(3),
      dueLabel: label(3, "antes de compor a proposta"),
      status: statusFor(due(3), asOf),
      fonte: "Dossiê de revisão",
    });
  }

  // 5. Proposta/planilha — D-2.
  const proposta = find("Proposta");
  if (proposta && proposta.status !== "ok") {
    actions.push({
      id: "proposta",
      ordem: 4,
      acao: "Fechar composição de custo/BDI dentro da faixa legal (piso 75%, art. 59 §4º) e subir a proposta no portal",
      dono: "Operação ENIAC",
      due: due(2),
      dueLabel: label(2, "antes do prazo da sessão"),
      status: statusFor(due(2), asOf),
      fonte: "Proposta e planilha (motor)",
    });
  }

  // 6. Alarmes do dia da sessão (preclusivos — Niebuhr): sempre presentes.
  actions.push({
    id: "sessao-d0",
    ordem: 5,
    acao: "DIA DA SESSÃO: ficar logado no portal — janela de upload pós-convocação (pode ser de HORAS), empate ficto ME (10% em concorrência, LC 123 art. 44 §1º) e manifestação de intenção de recurso PRECLUEM na sessão",
    dono: "Operação ENIAC",
    due: proposalDeadline ? proposalDeadline.slice(0, 10) : null,
    dueLabel: proposalDeadline ? `sessão em ${proposalDeadline.slice(0, 10)}` : "data da sessão a confirmar",
    status: statusFor(proposalDeadline ? proposalDeadline.slice(0, 10) : null, asOf),
    fonte: "Alarmes preclusivos (conclave 12/Jun)",
  });

  return actions.sort((a, b) => a.ordem - b.ordem);
}
