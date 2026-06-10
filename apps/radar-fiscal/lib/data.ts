// Camada de dados local (seed). Roda sem banco — substituível por Supabase depois.
// Server-only: importe em Server Components / route handlers.

import type {
  Cliente,
  Escritorio,
  StatusTarefa,
  Tarefa,
  Usuario,
} from "./domain";
import { estaVencida } from "./domain";
import { obrigacoesDoRegime } from "./obligations";

export const ESCRITORIO: Escritorio = {
  id: "esc-1",
  nome: "Contabilidade Modelo",
};

export const USUARIOS: Usuario[] = [
  { id: "u-1", escritorioId: "esc-1", nome: "Ana (dona)", papel: "dono" },
  { id: "u-2", escritorioId: "esc-1", nome: "Bruno", papel: "contador" },
  { id: "u-3", escritorioId: "esc-1", nome: "Carla", papel: "contador" },
  { id: "u-4", escritorioId: "esc-1", nome: "Diego", papel: "assistente" },
];

const NOMES: Array<[string, "MEI" | "SIMPLES"]> = [
  ["Padaria Pão Quente ME", "SIMPLES"],
  ["Studio Bella Estética", "MEI"],
  ["TechNova Soluções Ltda", "SIMPLES"],
  ["Marcenaria do Zé", "MEI"],
  ["Clínica Vida Plena", "SIMPLES"],
  ["Fotografia Luz & Cor", "MEI"],
  ["Restaurante Sabor Caseiro", "SIMPLES"],
  ["Auto Peças Veloz", "SIMPLES"],
  ["Doces da Vó Maria", "MEI"],
  ["Construtora Alicerce", "SIMPLES"],
  ["Pet Shop Amigo Fiel", "MEI"],
  ["Consultoria Norte ME", "SIMPLES"],
];

function cnpjFake(i: number): string {
  const n = (12345678000100 + i * 137).toString().padStart(14, "0");
  return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8, 12)}-${n.slice(12)}`;
}

export const CLIENTES: Cliente[] = NOMES.map(([razaoSocial, regime], i) => ({
  id: `c-${i + 1}`,
  escritorioId: "esc-1",
  razaoSocial,
  cnpj: cnpjFake(i),
  regime,
  responsavelId: USUARIOS[1 + (i % 3)].id, // distribui entre Bruno/Carla/Diego
  ativo: true,
}));

// --- Geração de tarefas (mensais) p/ 2 competências: abril e maio/2026 ---
// abril (venc 2026-05-20) = passado → maioria entregue, algumas em risco
// maio  (venc 2026-06-20) = ciclo atual → mix de status
const STATUS_ABRIL: StatusTarefa[] = [
  "entregue", "entregue", "entregue", "risco", "entregue", "entregue",
  "entregue", "risco", "entregue", "entregue", "entregue", "pendente_cliente",
];
const STATUS_MAIO: StatusTarefa[] = [
  "a_fazer", "pendente_cliente", "em_revisao", "pendente_contador", "a_fazer",
  "pendente_cliente", "em_revisao", "a_fazer", "pendente_cliente", "entregue",
  "a_fazer", "pendente_contador",
];

function tarefasMensais(): Tarefa[] {
  const out: Tarefa[] = [];
  CLIENTES.forEach((cli, i) => {
    const ob = obrigacoesDoRegime(cli.regime).find((o) => o.periodicidade === "mensal");
    if (!ob) return;
    out.push({
      id: `t-abr-${cli.id}`,
      escritorioId: "esc-1",
      clienteId: cli.id,
      obrigacaoCodigo: ob.codigo,
      competencia: "2026-04",
      vencimento: "2026-05-20",
      status: STATUS_ABRIL[i % STATUS_ABRIL.length],
      responsavelId: cli.responsavelId,
      documentoRecebido: STATUS_ABRIL[i % STATUS_ABRIL.length] !== "pendente_cliente",
    });
    out.push({
      id: `t-mai-${cli.id}`,
      escritorioId: "esc-1",
      clienteId: cli.id,
      obrigacaoCodigo: ob.codigo,
      competencia: "2026-05",
      vencimento: "2026-06-20",
      status: STATUS_MAIO[i % STATUS_MAIO.length],
      responsavelId: cli.responsavelId,
      documentoRecebido: !["pendente_cliente", "a_fazer"].includes(
        STATUS_MAIO[i % STATUS_MAIO.length]
      ),
    });
  });
  return out;
}

export const TAREFAS: Tarefa[] = tarefasMensais();

// ---------------- Queries ----------------

export function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function clientePorId(id: string): Cliente | undefined {
  return CLIENTES.find((c) => c.id === id);
}

export function usuarioPorId(id: string): Usuario | undefined {
  return USUARIOS.find((u) => u.id === id);
}

export interface DashboardKpis {
  totalClientes: number;
  pendenciasVencidas: number;
  clientesEmRisco: number;
  documentosFaltantes: number;
  entreguesNoCiclo: number;
  totalCiclo: number;
}

export function dashboardKpis(hoje = hojeISO()): DashboardKpis {
  const vencidas = TAREFAS.filter((t) => estaVencida(t, hoje));
  const clientesRisco = new Set(
    TAREFAS.filter((t) => t.status === "risco" || estaVencida(t, hoje)).map((t) => t.clienteId)
  );
  const docsFaltando = TAREFAS.filter(
    (t) => !t.documentoRecebido && t.status !== "entregue"
  );
  const ciclo = TAREFAS.filter((t) => t.competencia === "2026-05");
  return {
    totalClientes: CLIENTES.filter((c) => c.ativo).length,
    pendenciasVencidas: vencidas.length,
    clientesEmRisco: clientesRisco.size,
    documentosFaltantes: docsFaltando.length,
    entreguesNoCiclo: ciclo.filter((t) => t.status === "entregue").length,
    totalCiclo: ciclo.length,
  };
}

export interface SlaResponsavel {
  usuario: Usuario;
  total: number;
  entregues: number;
  vencidas: number;
  emRisco: number;
}

export function slaPorResponsavel(hoje = hojeISO()): SlaResponsavel[] {
  return USUARIOS.filter((u) => u.papel !== "dono" || true).map((u) => {
    const minhas = TAREFAS.filter((t) => t.responsavelId === u.id);
    return {
      usuario: u,
      total: minhas.length,
      entregues: minhas.filter((t) => t.status === "entregue").length,
      vencidas: minhas.filter((t) => estaVencida(t, hoje)).length,
      emRisco: minhas.filter((t) => t.status === "risco" || estaVencida(t, hoje)).length,
    };
  });
}

export interface LinhaRisco {
  tarefa: Tarefa;
  cliente: Cliente;
  responsavel?: Usuario;
  diasAtraso: number;
}

export function clientesEmRisco(hoje = hojeISO()): LinhaRisco[] {
  const ms = 1000 * 60 * 60 * 24;
  return TAREFAS.filter((t) => t.status === "risco" || estaVencida(t, hoje))
    .map((t) => {
      const dias = Math.round(
        (new Date(hoje).getTime() - new Date(t.vencimento).getTime()) / ms
      );
      return {
        tarefa: t,
        cliente: clientePorId(t.clienteId)!,
        responsavel: usuarioPorId(t.responsavelId),
        diasAtraso: Math.max(0, dias),
      };
    })
    .sort((a, b) => b.diasAtraso - a.diasAtraso);
}
