// Orquestração do WORKFLOW DE PARTICIPAÇÃO (estágios 1–4) como função reutilizável — a mesma
// cadeia provada nos scripts (run-edital / eval-workflow), agora chamável pelo APP (rota de API)
// e não só pela CLI. Faro (triagem) → Prisma (análise) → Forja (habilitação) → Escriba (pacote).
//
// Invariante mantido: número/valor = código (guardrails), raciocínio = LLM, e o sistema PREPARA
// o dossiê — assinar/submeter é ato humano (nunca automatizado aqui).

import { extractEdital, type EditalExtract } from "../edital/extract-edital.ts";
import { extractErm, type ErmExtraction } from "../edital/extract-erm.ts";
import { fetchAndExtractEdital } from "../edital/pncp-source.ts";
import { createLlmClient } from "../agents/clients/client-factory.ts";
import { runTriage, type TriageResult } from "../agents/triage-agent.ts";
import { runAnalysis, type AnalysisResult } from "../agents/analysis-agent.ts";
import { runHabilitation, type ForjaResult } from "../agents/habilitation-agent.ts";
import { runDocumentDraft, type DocumentPackage } from "../agents/document-agent.ts";
import { validateAnalysis, validateHabilitation } from "../agents/guardrails.ts";
import type { LlmClient } from "../agents/agent-types.ts";

// Metadados de triagem (distância/prazo/valor) — vêm do buscador (snapshot) quando há; senão
// são inferidos do parser. distanceKm/prazo afetam o veredito do Faro.
export interface TriageMeta {
  id?: string;
  title?: string;
  city?: string;
  uf?: string;
  distanceKm?: number;
  estimatedValue?: number | null;
  proposalDeadline?: string | null;
  modality?: string;
  buyer?: string;
}

// 3 formas de alimentar o workflow:
//   - { pncpId }            → baixa Edital + anexos da API do PNCP (multi-doc) e parseia
//   - { pdfBuffer }         → 1 PDF já em memória
//   - { objeto, editalExcerpt } → texto já extraído (rápido, sem rede/parser)
export type WorkflowSource =
  | { pncpId: string; triageMeta?: TriageMeta }
  | { pdfBuffer: Uint8Array; triageMeta?: TriageMeta }
  | { objeto: string; editalExcerpt: string; triageMeta?: TriageMeta };

export interface ParticipationResult {
  objeto: string;
  parser: { sections: string[]; valorEstimadoHint: number | null; excerptChars: number; docs?: string[] } | null;
  /** Exigências documentais extraídas do edital (declarações + CNDs) p/ dirigir a completude
   *  do dossiê. null no modo excerpt (sem seções parseadas). */
  erm: ErmExtraction | null;
  triage: TriageResult;
  analysis: AnalysisResult & { guardrailOk: boolean };
  habilitation: ForjaResult & { guardrailOk: boolean };
  package: DocumentPackage;
  summary: {
    verdict: TriageResult["verdict"];
    decisao: ForjaResult["decisao"];
    stagesLlm: { faro: boolean; prisma: boolean; forja: boolean; escriba: boolean };
    allLlm: boolean;
    packageComplete: boolean;
  };
}

export async function runParticipationWorkflow(
  source: WorkflowSource,
  opts: { client?: LlmClient; comConsorcio?: boolean } = {},
): Promise<ParticipationResult> {
  const client = opts.client ?? createLlmClient();
  const meta = source.triageMeta ?? {};

  // 0) edital → objeto + excerpt (do PNCP, de um PDF, ou já fornecido).
  let extract: (EditalExtract & { docs?: string[] }) | null = null;
  let objeto: string;
  let excerpt: string;
  if ("editalExcerpt" in source) {
    objeto = source.objeto;
    excerpt = source.editalExcerpt;
  } else if ("pncpId" in source) {
    extract = await fetchAndExtractEdital(source.pncpId);
    objeto = (extract.sections.objeto || meta.title || "").replace(/\s+/g, " ").slice(0, 220);
    excerpt = extract.excerpt;
  } else {
    extract = await extractEdital({ pdfBuffer: source.pdfBuffer });
    objeto = (extract.sections.objeto || meta.title || "").replace(/\s+/g, " ").slice(0, 220);
    excerpt = extract.excerpt;
  }

  const triageItem = {
    id: meta.id ?? ("pncpId" in source ? source.pncpId : "edital"),
    title: meta.title ?? objeto,
    city: meta.city ?? "?",
    uf: meta.uf ?? "?",
    distanceKm: meta.distanceKm ?? 0,
    estimatedValue: meta.estimatedValue ?? extract?.valorEstimadoHint ?? null,
    proposalDeadline: meta.proposalDeadline ?? null,
    modality: meta.modality ?? "?",
    buyer: meta.buyer ?? "?",
  };

  // 1) FARO — triagem · 2) PRISMA — análise · 3) FORJA — habilitação · 4) ESCRIBA — pacote.
  const triage = await runTriage(triageItem, client);
  const analysis = await runAnalysis({ objeto, editalExcerpt: excerpt }, client);
  const aG = validateAnalysis(analysis);
  const habilitation = await runHabilitation({ objeto, editalExcerpt: excerpt, comConsorcio: opts.comConsorcio ?? true }, client);
  const hG = validateHabilitation(habilitation);
  const pkg = await runDocumentDraft({ objeto, editalExcerpt: excerpt, comConsorcio: habilitation.decisao === "CONSORCIO" }, client);

  const stagesLlm = {
    faro: triage.source === "llm",
    prisma: analysis.source === "llm" && aG.ok,
    forja: habilitation.source === "llm" && hG.ok,
    escriba: pkg.source === "llm" && Boolean(pkg.planilha),
  };

  // Exigências documentais (declarações + CNDs) extraídas do edital parseado — dirige a
  // completude do dossiê. Só quando há seções (modos pncp/pdf); excerpt puro não tem.
  const erm = extract ? extractErm(extract.sections, extract.fullText) : null;

  return {
    objeto,
    parser: extract
      ? { sections: extract.encontradas, valorEstimadoHint: extract.valorEstimadoHint ?? null, excerptChars: excerpt.length, docs: extract.docs }
      : null,
    erm,
    triage,
    analysis: { ...analysis, guardrailOk: aG.ok },
    habilitation: { ...habilitation, guardrailOk: hG.ok },
    package: pkg,
    summary: {
      verdict: triage.verdict,
      decisao: habilitation.decisao,
      stagesLlm,
      allLlm: Object.values(stagesLlm).every(Boolean),
      packageComplete: Boolean(pkg.planilha) && (pkg.declaracoes ?? []).length > 0,
    },
  };
}
