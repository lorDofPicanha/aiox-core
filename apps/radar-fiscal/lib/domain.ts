// Radar Fiscal — modelo de domínio (multi-tenant)
// Desenhado para mapear 1:1 a tabelas Postgres/Supabase com RLS por escritorio_id.
// IMPORTANTE (Trust C3): este domínio rastreia EXISTÊNCIA e PRAZO de obrigações.
// NUNCA calcula imposto, apuração, crédito ou enquadramento. Só visibilidade e controle.

export type Regime = "MEI" | "SIMPLES";

export type Periodicidade = "mensal" | "anual";

/** Status operacional da tarefa (matriz do conclave / status doc §60). */
export type StatusTarefa =
  | "a_fazer"
  | "pendente_cliente"
  | "pendente_contador"
  | "em_revisao"
  | "entregue"
  | "risco";

export const STATUS_LABEL: Record<StatusTarefa, string> = {
  a_fazer: "A fazer",
  pendente_cliente: "Pendente cliente",
  pendente_contador: "Pendente contador",
  em_revisao: "Em revisão",
  entregue: "Entregue",
  risco: "Risco",
};

/** Ordem das colunas no kanban. */
export const KANBAN_ORDER: StatusTarefa[] = [
  "a_fazer",
  "pendente_cliente",
  "pendente_contador",
  "em_revisao",
  "entregue",
  "risco",
];

export interface Escritorio {
  id: string;
  nome: string;
}

export type Papel = "dono" | "contador" | "assistente";

export interface Usuario {
  id: string;
  escritorioId: string;
  nome: string;
  papel: Papel;
}

export interface Cliente {
  id: string;
  escritorioId: string;
  razaoSocial: string;
  cnpj: string;
  regime: Regime;
  responsavelId: string; // Usuario.id
  ativo: boolean;
}

/** Template de obrigação (matriz fiscal). Ver lib/obligations.ts */
export interface Obrigacao {
  codigo: string;
  nome: string;
  regimes: Regime[];
  periodicidade: Periodicidade;
  /** dia do vencimento (1-31) */
  diaVencimento: number;
  /** para anuais: mês de vencimento (1-12) */
  mesVencimento?: number;
  /** quantos meses após a competência ela vence (mensais: normalmente 1) */
  offsetMeses?: number;
  descricao: string;
}

/** Instância de uma obrigação para um cliente, numa competência. Vira card no kanban. */
export interface Tarefa {
  id: string;
  escritorioId: string;
  clienteId: string;
  obrigacaoCodigo: string;
  /** competência de referência YYYY-MM */
  competencia: string;
  /** data de vencimento ISO YYYY-MM-DD */
  vencimento: string;
  status: StatusTarefa;
  responsavelId: string;
  /** documento do cliente recebido? (proxy de "documento faltante") */
  documentoRecebido: boolean;
}

/** True se a tarefa está vencida e ainda não entregue. */
export function estaVencida(t: Tarefa, hojeISO: string): boolean {
  return t.status !== "entregue" && t.vencimento < hojeISO;
}
