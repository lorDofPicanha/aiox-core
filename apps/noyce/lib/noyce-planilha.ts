// Planilha de preços — the "número fora da LLM" core. The LLM (Escriba) decides the line items
// (descrição, unidade, quantidade, preço unitário); THIS code computes every total/BDI/grand-total
// deterministically. The .xlsx binary renderer (exceljs) is optional and layered on top of this
// pure model; the CSV renderer here has zero dependencies and is always available.

export interface PlanilhaItem {
  descricao: string;
  unidade: string; // m², m³, un, vb, ...
  quantidade: number;
  precoUnitario: number; // R$
  fonte: string; // origem do número (edital/CCP/análise) — proveniência obrigatória
}

export interface PlanilhaLinha extends PlanilhaItem {
  subtotal: number; // quantidade * precoUnitario (calculado aqui, nunca pela LLM)
}

export interface PlanilhaComputada {
  linhas: PlanilhaLinha[];
  subtotalDireto: number; // soma dos subtotais
  bdiPct: number;
  bdiValor: number;
  total: number; // subtotalDireto + bdiValor
}

const r2 = (n: number) => Math.round(n * 100) / 100;

// Recompute ALL numbers from the line items. Any "total" the LLM may have emitted is ignored —
// the planilha total is a function of the items, computed here.
export function computePlanilha(items: PlanilhaItem[], bdiPct: number): PlanilhaComputada {
  const linhas: PlanilhaLinha[] = items.map((it) => ({
    ...it,
    quantidade: Number(it.quantidade) || 0,
    precoUnitario: Number(it.precoUnitario) || 0,
    subtotal: r2((Number(it.quantidade) || 0) * (Number(it.precoUnitario) || 0)),
  }));
  const subtotalDireto = r2(linhas.reduce((s, l) => s + l.subtotal, 0));
  const bdi = Number.isFinite(bdiPct) ? bdiPct : 0;
  const bdiValor = r2(subtotalDireto * (bdi / 100));
  return { linhas, subtotalDireto, bdiPct: bdi, bdiValor, total: r2(subtotalDireto + bdiValor) };
}

function csvCell(v: string | number): string {
  const s = String(v);
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Dependency-free CSV of the computed planilha (always available; .xlsx via exceljs is optional).
export function renderPlanilhaCsv(p: PlanilhaComputada): string {
  const header = ["Item", "Descrição", "Unidade", "Quantidade", "Preço unitário (R$)", "Subtotal (R$)", "Fonte"];
  const rows = p.linhas.map((l, i) =>
    [i + 1, l.descricao, l.unidade, l.quantidade, l.precoUnitario.toFixed(2), l.subtotal.toFixed(2), l.fonte].map(csvCell).join(";"),
  );
  const footer = [
    `;;;;;Subtotal direto;${p.subtotalDireto.toFixed(2)}`,
    `;;;;;BDI (${p.bdiPct.toFixed(2)}%);${p.bdiValor.toFixed(2)}`,
    `;;;;;TOTAL;${p.total.toFixed(2)}`,
  ];
  return [header.map(csvCell).join(";"), ...rows, ...footer].join("\n");
}
