// Pacote do certame (Sprint E1, 12/Jun): o Noyce gera a DOCUMENTAÇÃO COMPLETA pronta pra uso —
// um HTML A4 autocontido (imprime → PDF pelo navegador) com capa, frentes, plano de vitória,
// declarações revisadas e a lista de anexos do vault; + planilha CSV de proposta na faixa legal.
// PORTÃO HUMANO: revisão incompleta → marca d'água "RASCUNHO — NÃO REVISADO" em todas as páginas;
// declarações pendentes entram SÓ como pendência listada, nunca com texto pronto pra assinar.
import type { CompanyCapabilityProfile, Opportunity } from "./noyce-model";
import type { ChecklistItem } from "./noyce-checklist.ts";
import type { ReviewedItem } from "./noyce-review.ts";
import type { VictoryAction } from "./noyce-victory-plan.ts";
import type { VaultDocMeta } from "./noyce-vault.ts";

export interface PackageInput {
  opportunity: Opportunity;
  ccp: CompanyCapabilityProfile;
  checklist: readonly ChecklistItem[];
  victoryPlan: readonly VictoryAction[];
  reviewed: readonly ReviewedItem[];
  vaultMeta: readonly VaultDocMeta[];
  generatedAtLabel: string;
}

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function brl(value: number | null): string {
  if (value === null) return "—";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const STATUS_LABEL: Record<string, string> = { ok: "✔ OK", warning: "⚠ Atenção", missing: "✖ Pendente" };

export function isPackageFinal(reviewed: readonly ReviewedItem[]): boolean {
  return reviewed.length > 0 && reviewed.every((item) => item.status !== "pendente");
}

export function buildDossierHtml(input: PackageInput): string {
  const { opportunity, ccp, checklist, victoryPlan, reviewed, vaultMeta } = input;
  const final = isPackageFinal(reviewed);
  const declaracoes = reviewed.filter((i) => i.secao.startsWith("Declarações"));
  const declaracoesRevisadas = declaracoes.filter((i) => i.status !== "pendente");
  const pendentes = reviewed.filter((i) => i.status === "pendente");
  const progress = `${reviewed.length - pendentes.length}/${reviewed.length}`;

  const watermark = final
    ? ""
    : `<div class="watermark">RASCUNHO — REVISÃO ${esc(progress)} — NÃO ASSINAR</div>`;

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>Dossiê — ${esc(opportunity.title)}</title>
<style>
@page{size:A4;margin:18mm}
body{font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;line-height:1.5;font-size:12pt;margin:0}
.watermark{position:fixed;top:40%;left:0;right:0;text-align:center;font-size:34pt;color:rgba(180,40,40,.18);transform:rotate(-22deg);font-weight:bold;z-index:0;pointer-events:none}
.page{position:relative;z-index:1;page-break-after:always;padding:0 4mm}
.page:last-child{page-break-after:auto}
h1{font-size:20pt;margin:0 0 4pt}h2{font-size:14pt;border-bottom:2px solid #1a1a1a;padding-bottom:3pt;margin:18pt 0 8pt}
.meta{color:#555;font-size:10.5pt}
table{width:100%;border-collapse:collapse;font-size:10.5pt;margin:8pt 0}
th,td{border:1px solid #999;padding:5pt 7pt;text-align:left;vertical-align:top}
th{background:#f0ede6}
.ok{color:#1c6c44}.warning{color:#8a6516}.missing,.atrasado{color:#a33}.urgente{color:#8a6516}
.decl{border:1px solid #999;padding:12pt;margin:10pt 0;page-break-inside:avoid}
.decl h3{margin:0 0 8pt;font-size:12pt}
.decl .texto{text-align:justify;white-space:pre-wrap}
.assinatura{margin-top:28pt;text-align:center}
.assinatura .linha{border-top:1px solid #1a1a1a;width:70%;margin:0 auto 4pt}
.chip{font-size:9pt;color:#555;border:1px solid #aaa;border-radius:4px;padding:1pt 5pt}
.foot{font-size:9pt;color:#777;margin-top:14pt;border-top:1px solid #ccc;padding-top:6pt}
</style></head><body>
${watermark}

<div class="page">
  <h1>Dossiê de Participação</h1>
  <p class="meta">Gerado pelo Noyce em ${esc(input.generatedAtLabel)} · revisão humana ${esc(progress)} ${final ? "· PACOTE FINAL" : "· RASCUNHO"}</p>
  <h2>Certame</h2>
  <table>
    <tr><th>Objeto</th><td>${esc(opportunity.title)}</td></tr>
    <tr><th>Órgão</th><td>${esc(opportunity.buyer)} · ${esc(opportunity.city)}/${esc(opportunity.uf)}</td></tr>
    <tr><th>Valor estimado</th><td>${brl(opportunity.estimatedValue)}</td></tr>
    <tr><th>Prazo / sessão</th><td>${esc(opportunity.proposalDeadline ?? "a confirmar no portal")}</td></tr>
    <tr><th>Licitante</th><td>${esc(ccp.identity.razaoSocial)} · CNPJ ${esc(ccp.identity.cnpj)} · ${esc(ccp.identity.creaEmpresa ?? "")}</td></tr>
  </table>

  <h2>Frentes de habilitação (conferência do motor)</h2>
  <table>
    <tr><th>Frente</th><th>Status</th><th>Detalhe</th></tr>
    ${checklist
      .map(
        (c) =>
          `<tr><td>${esc(c.label)}</td><td class="${c.status}">${STATUS_LABEL[c.status] ?? c.status}</td><td>${esc(c.note)}</td></tr>`,
      )
      .join("\n    ")}
  </table>

  <h2>Plano de Vitória</h2>
  <table>
    <tr><th>Até quando</th><th>Ação</th><th>Dono</th><th>Status</th></tr>
    ${victoryPlan
      .map(
        (a) =>
          `<tr><td>${esc(a.dueLabel)}</td><td>${esc(a.acao)}</td><td>${esc(a.dono)}</td><td class="${a.status}">${esc(a.status.replace("_", " "))}</td></tr>`,
      )
      .join("\n    ")}
  </table>

  ${
    pendentes.length
      ? `<h2>Pendências de revisão humana (bloqueiam o pacote final)</h2><ul>${pendentes
          .map((p) => `<li>${esc(p.secao)} — ${esc(p.label)}</li>`)
          .join("")}</ul>`
      : ""
  }

  <h2>Anexos do vault (subir no portal junto com as declarações)</h2>
  ${
    vaultMeta.length
      ? `<table><tr><th>Tipo</th><th>Arquivo</th><th>Validade</th></tr>${vaultMeta
          .map((d) => `<tr><td>${esc(d.tipo)}</td><td>${esc(d.fileName)}</td><td>${esc(d.validade ?? "—")}</td></tr>`)
          .join("")}</table>`
      : `<p class="meta">Nenhum documento no vault — subir certidões/balanço na aba Governança.</p>`
  }
  <p class="foot">Noyce organiza evidências e lacunas para revisão humana; não substitui análise jurídica nem decisão da ENIAC. Todo ato vinculante (assinatura, envio, lance) é humano.</p>
</div>

${declaracoesRevisadas
  .map(
    (decl) => `
<div class="page">
  <div class="decl">
    <h3>${esc(decl.label.toUpperCase())} <span class="chip">${decl.status === "corrigido" ? "texto do revisor humano" : "aprovado em revisão humana"}</span></h3>
    <p class="meta">Ref.: ${esc(opportunity.title)} — ${esc(opportunity.buyer)}</p>
    <p class="texto">${esc(decl.valorFinal)}</p>
    <div class="assinatura">
      <div class="linha"></div>
      <strong>${esc(ccp.identity.razaoSocial)}</strong><br>CNPJ ${esc(ccp.identity.cnpj)}
    </div>
  </div>
</div>`,
  )
  .join("\n")}

</body></html>`;
}

/** Planilha de proposta (CSV — abre no Excel): faixa legal + esqueleto de composição/BDI. */
export function buildProposalCsv(opportunity: Opportunity): string {
  const est = opportunity.estimatedValue;
  const piso = est !== null ? est * 0.75 : null;
  const faixa = est !== null ? est * 0.85 : null;
  const n = (v: number | null) => (v === null ? "" : v.toFixed(2).replace(".", ","));
  const lines = [
    `Planilha de Proposta;${opportunity.title.replace(/;/g, ",")}`,
    `Órgão;${opportunity.buyer.replace(/;/g, ",")}`,
    "",
    "REFERÊNCIAS LEGAIS;Valor (R$)",
    `Valor estimado (teto);${n(est)}`,
    `Piso de exequibilidade — 75% (art. 59 §4º);${n(piso)}`,
    `Limite de garantia adicional — 85% (art. 59 §5º);${n(faixa)}`,
    "",
    "COMPOSIÇÃO DE CUSTO;Valor (R$)",
    "Materiais;",
    "Mão de obra;",
    "Equipamentos;",
    "Custo direto total;",
    "",
    "BDI;%",
    "Administração central;",
    "Riscos e seguros;",
    "Garantias;",
    "Despesas financeiras;",
    "Lucro;",
    "Tributos (ISS/PIS/COFINS conforme regime);",
    "BDI total;",
    "",
    "PROPOSTA FINAL;Valor (R$)",
    "Custo direto × (1 + BDI);",
    "Conferência: dentro da faixa legal? (>= piso 75% e <= estimado);",
  ];
  return lines.join("\r\n");
}
