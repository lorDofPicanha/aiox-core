// GATE DE COMPLETUDE DOCUMENTAL — a medida de "muito bom" da parte documental: dado o que o
// edital EXIGE (ERM), o Noyce surfou TUDO? Numa licitação, documento exigido que ficou
// invisível = inabilitação. Este gate FALHA se qualquer declaração/certidão exigida não tiver
// sequer um item no dossiê (omissão silenciosa = o erro fatal). Função PURA → testável.
//
// Distinção importante:
//   - coberto  = o Noyce gerou/sinalizou o item (não some). É o que o gate exige.
//   - pendente = existe, mas falta ação humana (revisar texto) ou anexar o doc no vault.
//   - faltando = NEM foi surfado (omissão silenciosa) → FALHA o gate.
// "Pronto p/ submeter" (submissionReady) é mais forte: coberto + revisado + vault válido.

import type { EditalRequirementsModel } from "../noyce-model";
import { mapDeclaracaoLabel } from "../noyce-declaracoes.ts";

export interface ReviewedLike {
  editalLabel?: string;
  secao: string;
  status: string; // "pendente" | "aprovado" | "corrigido"
  requerCorrecao?: boolean;
}
export interface VaultLike {
  tipo: string;
  validade: string | null;
}

export interface CoverageEntry {
  required: string;
  covered: boolean;
  pending: boolean;
  via: string;
}
export interface CoverageBlock {
  required: number;
  covered: number;
  missing: string[];
  pending: string[];
  entries: CoverageEntry[];
}
export interface DocCompletenessReport {
  declaracoes: CoverageBlock;
  certidoes: CoverageBlock;
  coveragePass: boolean; // 0 omissões silenciosas (declaração e certidão)
  submissionReady: boolean; // coberto + nada pendente
  coveragePct: number;
}

// Mapeia um rótulo de CND do edital → tipo de doc no vault que o satisfaz.
function cndLabelToVaultTipo(label: string): string | null {
  if (/fal[êe]ncia|concordata|recupera[çc][ãa]o\s+judicial/i.test(label)) return "Certidão de Falência";
  if (/FGTS|CRF/i.test(label)) return "CRF-FGTS";
  if (/trabalhista|CNDT|\bTST\b/i.test(label)) return "CNDT";
  if (/estadual|estado/i.test(label)) return "CND Estadual";
  if (/municipal|munic[íi]pio/i.test(label)) return "CND Municipal";
  if (/federal|uni[ãa]o|receita|PGFN|conjunta/i.test(label)) return "CND Federal";
  return null;
}

function vaultValido(v: VaultLike, asOf: string): boolean {
  return v.validade === null || new Date(v.validade).getTime() >= new Date(asOf).getTime();
}

export function evaluateDocCompleteness(args: {
  erm: EditalRequirementsModel;
  reviewed: readonly ReviewedLike[];
  vault: readonly VaultLike[];
  asOf: string;
}): DocCompletenessReport {
  const { erm, reviewed, vault, asOf } = args;

  // ── Declarações ──
  const declItems = reviewed.filter((r) => r.secao.startsWith("Declarações"));
  const declEntries: CoverageEntry[] = erm.juridica.declaracoes.map((req) => {
    const tipo = mapDeclaracaoLabel(req);
    // casa por rótulo original do edital OU pelo tipo canônico (rede de segurança praxe).
    const item =
      declItems.find((d) => d.editalLabel === req) ??
      (tipo ? declItems.find((d) => d.editalLabel && mapDeclaracaoLabel(d.editalLabel) === tipo) : undefined) ??
      (tipo ? declItems.find((d) => mapDeclaracaoLabel(d.secao + " " + (d.editalLabel ?? "")) === tipo) : undefined);
    const covered = Boolean(item);
    const pending = covered ? item!.status === "pendente" || Boolean(item!.requerCorrecao) : false;
    return { required: req, covered, pending, via: covered ? (item!.editalLabel === req ? "item-edital" : "item-praxe") : "—" };
  });

  // ── Certidões ──
  const cndItems = reviewed.filter((r) => r.secao.startsWith("Certidões"));
  const certEntries: CoverageEntry[] = erm.fiscalTrabalhista.CNDs.map((req) => {
    const tipo = cndLabelToVaultTipo(req);
    const vaultDoc = tipo ? vault.find((v) => v.tipo === tipo) : undefined;
    const vaultOk = vaultDoc ? vaultValido(vaultDoc, asOf) : false;
    const flagged = cndItems.some((c) => c.editalLabel === req) || Boolean(tipo && vaultDoc);
    const covered = flagged; // surfado (item de exigência) OU já tem doc
    const pending = covered && !vaultOk; // falta o doc válido no vault
    return {
      required: req,
      covered,
      pending,
      via: vaultOk ? `vault:${tipo}` : flagged ? "item-exigencia" : "—",
    };
  });

  const block = (entries: CoverageEntry[]): CoverageBlock => ({
    required: entries.length,
    covered: entries.filter((e) => e.covered).length,
    missing: entries.filter((e) => !e.covered).map((e) => e.required),
    pending: entries.filter((e) => e.covered && e.pending).map((e) => e.required),
    entries,
  });

  const declaracoes = block(declEntries);
  const certidoes = block(certEntries);
  const totalReq = declaracoes.required + certidoes.required;
  const totalCov = declaracoes.covered + certidoes.covered;
  const coveragePass = declaracoes.missing.length === 0 && certidoes.missing.length === 0;
  const submissionReady =
    coveragePass && declaracoes.pending.length === 0 && certidoes.pending.length === 0;

  return {
    declaracoes,
    certidoes,
    coveragePass,
    submissionReady,
    coveragePct: totalReq === 0 ? 100 : Math.round((totalCov / totalReq) * 100),
  };
}
