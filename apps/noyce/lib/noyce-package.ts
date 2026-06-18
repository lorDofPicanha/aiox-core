// Pacote do certame (Sprint E1, 12/Jun): o Noyce gera a DOCUMENTAÇÃO COMPLETA pronta pra uso —
// um HTML A4 autocontido (imprime → PDF pelo navegador) com capa, frentes, plano de vitória,
// declarações revisadas e a lista de anexos do vault; + planilha CSV de proposta na faixa legal.
// PORTÃO HUMANO: revisão incompleta → marca d'água "RASCUNHO — NÃO REVISADO" em todas as páginas;
// declarações pendentes entram SÓ como pendência listada, nunca com texto pronto pra assinar.
import type { CompanyCapabilityProfile, HabilitationRequirementCategory, Opportunity } from "./noyce-model";
import type { ChecklistItem } from "./noyce-checklist.ts";
import type { ReviewedItem } from "./noyce-review.ts";
import type { VictoryAction } from "./noyce-victory-plan.ts";
import type { VaultDocMeta } from "./noyce-vault.ts";

/**
 * Seção de consórcio no dossiê (Story 30.2 — ADIADA nesta story 30.4).
 * Esqueleto NÃO renderizado: o parâmetro existe em PackageInput para que a UI
 * já possa passá-lo, mas buildDossierHtml ainda NÃO emite a seção (no-op) até a
 * Story 30.2 entregar a estrutura real dos documentos da empresa parceira.
 */
export interface ConsortiumDocSection {
  partnerLabel: string;
  docs: ReadonlyArray<{ label: string; categoria: string; origem: string }>;
}

export interface PackageInput {
  opportunity: Opportunity;
  ccp: CompanyCapabilityProfile;
  checklist: readonly ChecklistItem[];
  victoryPlan: readonly VictoryAction[];
  reviewed: readonly ReviewedItem[];
  vaultMeta: readonly VaultDocMeta[];
  generatedAtLabel: string;
  /** ADIADO (Story 30.2): documentos da empresa parceira no consórcio. Hoje no-op. */
  consortiumDocs?: ConsortiumDocSection;
}

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function brl(value: number | null): string {
  if (value === null) return "—";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const STATUS_LABEL: Record<string, string> = { ok: "✔ OK", warning: "⚠ Atenção", missing: "✖ Pendente" };

// Estilo A4 compartilhado entre o dossiê consolidado e os documentos individuais (AC4):
// mantém a mesma identidade visual (cabeçalho, declaração, assinatura, marca d'água).
const DOSSIER_STYLE = `@page{size:A4;margin:18mm}
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
.foot{font-size:9pt;color:#777;margin-top:14pt;border-top:1px solid #ccc;padding-top:6pt}`;

const DISCLAIMER_FOOT =
  "Noyce organiza evidências e lacunas para revisão humana; não substitui análise jurídica nem decisão da ENIAC. Todo ato vinculante (assinatura, envio, lance) é humano.";

export function isPackageFinal(reviewed: readonly ReviewedItem[]): boolean {
  return reviewed.length > 0 && reviewed.every((item) => item.status !== "pendente");
}

const CATEGORY_LABEL: Record<HabilitationRequirementCategory, string> = {
  juridica: "Jurídica",
  fiscal: "Fiscal e trabalhista",
  trabalhista: "Trabalhista",
  economico_financeira: "Econômico-financeira",
  tecnica: "Qualificação técnica",
  proposta: "Proposta de preços",
  outro: "Declarações",
};

/**
 * AC4: HTML autocontido de UM documento individual (declaração/proposta gerada pela IA).
 *
 * Reaproveita a mesma estrutura de seção que o `buildDossierHtml` já usa para declarações
 * (cabeçalho ENIAC, corpo, assinatura) + a mesma regra de marca d'água do `isPackageFinal`
 * aplicada ao item individual: se o item alvo está `pendente`, sai com a tarja
 * "RASCUNHO — NÃO ASSINAR" e SEM texto assinável (apenas a indicação de pendência).
 *
 * `item` é o `ReviewedItem` específico a exportar (uma declaração ou a proposta). Quando
 * omitido (ex.: categoria fiscal = certidão do vault), retorna uma folha de capa informando
 * que o documento é um anexo do vault, baixado diretamente do navegador.
 */
export function buildIndividualDocHtml(args: {
  docType: HabilitationRequirementCategory;
  opportunity: Opportunity;
  ccp: CompanyCapabilityProfile;
  item?: ReviewedItem;
  generatedAtLabel: string;
}): string {
  const { docType, opportunity, ccp, item, generatedAtLabel } = args;
  const categoria = CATEGORY_LABEL[docType] ?? docType;
  const pendente = !item || item.status === "pendente";
  const titulo = item ? item.label : categoria;

  const watermark = pendente
    ? `<div class="watermark">RASCUNHO — NÃO ASSINAR</div>`
    : "";

  const corpo = pendente
    ? `<div class="decl">
    <h3>${esc(titulo.toUpperCase())} <span class="chip">pendente de revisão humana</span></h3>
    <p class="meta">Ref.: ${esc(opportunity.title)} — ${esc(opportunity.buyer)}</p>
    <p class="texto">Documento ainda não revisado/aprovado pelo operador da ENIAC. O texto assinável só é
    emitido após a revisão humana — pendente de envio manual.</p>
  </div>`
    : `<div class="decl">
    <h3>${esc(titulo.toUpperCase())} <span class="chip">${item!.status === "corrigido" ? "texto do revisor humano" : "aprovado em revisão humana"}</span></h3>
    <p class="meta">Ref.: ${esc(opportunity.title)} — ${esc(opportunity.buyer)}</p>
    <p class="texto">${esc(item!.valorFinal)}</p>
    <div class="assinatura">
      <div class="linha"></div>
      <strong>${esc(ccp.identity.razaoSocial)}</strong><br>CNPJ ${esc(ccp.identity.cnpj)}
    </div>
  </div>`;

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>${esc(categoria)} — ${esc(opportunity.title)}</title>
<style>
${DOSSIER_STYLE}
</style></head><body>
${watermark}

<div class="page">
  <h1>${esc(categoria)}</h1>
  <p class="meta">Documento individual gerado pelo Noyce em ${esc(generatedAtLabel)} · ${esc(ccp.identity.razaoSocial)} · CNPJ ${esc(ccp.identity.cnpj)}${pendente ? " · RASCUNHO" : ""}</p>
  ${corpo}
  <p class="foot">${DISCLAIMER_FOOT}</p>
</div>

</body></html>`;
}

export function buildDossierHtml(input: PackageInput): string {
  const { opportunity, ccp, checklist, victoryPlan, reviewed, vaultMeta } = input;
  // AC2 (seção de consórcio) ADIADA — depende da Story 30.2. `input.consortiumDocs` é aceito
  // como esqueleto (no-op): NÃO renderizamos a "Seção de Documentos da Empresa Parceira" aqui.
  // void evita o lint de variável não usada sem alterar a saída do dossiê consolidado (AC1).
  void input.consortiumDocs;
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
${DOSSIER_STYLE}
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
  <p class="foot">${DISCLAIMER_FOOT}</p>
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

// ── Modo "Documentos Individuais por categoria" (Story 30.4, AC3/6/7) ─────────────
// Inventário puro (testável em node): agrupa os documentos exportáveis por categoria,
// com status visual (OK/Pendente/Expirado), validade quando aplicável, e a forma de
// download (HTML gerado pela IA × blob do vault). A UI (IndividualDocsPanel) apenas renderiza.

export type IndividualDocStatus = "ok" | "pendente" | "expirado";

export type IndividualDocOrigin = "generated" | "vault";

export interface IndividualDoc {
  /** id estável: itemId do reviewed (generated) ou VaultDocMeta.id (vault). */
  id: string;
  categoria: HabilitationRequirementCategory;
  categoriaLabel: string;
  nome: string;
  status: IndividualDocStatus;
  /** ISO date quando aplicável (certidões do vault); null para gerados. */
  validade: string | null;
  origem: IndividualDocOrigin;
  /** true quando o download está bloqueado (pendente de envio manual — AC6). */
  disabled: boolean;
  /** vault: nome do arquivo a baixar; generated: undefined (HTML é montado on demand). */
  fileName?: string;
}

/** Mapeia o tipo do vault → categoria de habilitação para o agrupamento individual. */
function vaultTypeToCategory(tipo: string): HabilitationRequirementCategory {
  switch (tipo) {
    case "CND Federal":
    case "CND Estadual":
    case "CND Municipal":
    case "CRF-FGTS":
    case "CNDT":
      return "fiscal";
    case "Certidão de Falência":
    case "Balanço Patrimonial":
      return "economico_financeira";
    case "Contrato Social":
      return "juridica";
    case "CAT / Atestado":
      return "tecnica";
    default:
      return "outro";
  }
}

function vaultStatus(validade: string | null, asOf: string): IndividualDocStatus {
  if (validade === null) return "ok";
  return new Date(validade).getTime() >= new Date(asOf).getTime() ? "ok" : "expirado";
}

/**
 * AC3/6/7: monta a lista de documentos individuais por categoria.
 * - Declarações + proposta (gerados pela IA): vêm de `reviewed`; status `pendente` ⇒ disabled (AC6).
 * - Certidões/balanço/CAT/contrato (vault): vêm de `vaultMeta`; status OK/Expirado pela validade (AC7).
 * `asOf` define a data de referência para vencimento (igual ao motor fiscal).
 */
export function buildIndividualDocList(args: {
  reviewed: readonly ReviewedItem[];
  vaultMeta: readonly VaultDocMeta[];
  asOf: string;
}): IndividualDoc[] {
  const { reviewed, vaultMeta, asOf } = args;
  const docs: IndividualDoc[] = [];

  // Gerados pela IA: declarações (secao "Declarações…") + proposta (secao "Proposta").
  for (const item of reviewed) {
    const isDecl = item.secao.startsWith("Declarações");
    const isProposta = item.secao.startsWith("Proposta");
    if (!isDecl && !isProposta) continue;
    const categoria: HabilitationRequirementCategory = isProposta ? "proposta" : "outro";
    const pendente = item.status === "pendente";
    docs.push({
      id: item.id,
      categoria,
      categoriaLabel: CATEGORY_LABEL[categoria],
      nome: item.label,
      status: pendente ? "pendente" : "ok",
      validade: null,
      origem: "generated",
      disabled: pendente,
    });
  }

  // Vault: certidões/balanço/CAT/contrato subidos pelo usuário (edital e "Outro" ficam de fora).
  for (const meta of vaultMeta) {
    if (meta.tipo === "Edital (PDF)" || meta.tipo === "Outro") continue;
    const categoria = vaultTypeToCategory(meta.tipo);
    const status = vaultStatus(meta.validade, asOf);
    docs.push({
      id: meta.id,
      categoria,
      categoriaLabel: CATEGORY_LABEL[categoria],
      nome: `${meta.tipo} · ${meta.fileName}`,
      status,
      validade: meta.validade,
      origem: "vault",
      disabled: false, // o arquivo existe no vault — sempre baixável (mesmo expirado, é o doc real)
      fileName: meta.fileName,
    });
  }

  return docs;
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
