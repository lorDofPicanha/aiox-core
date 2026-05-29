import type { SourceCode } from "@/lib/noyce-model";

export type PhaseId = "fase6" | "fase7" | "fase8" | "fase9" | "fase10" | "fase11";

export interface HumanBlocker {
  id: string;
  phase: PhaseId;
  owner: string;
  label: string;
  reason: string;
  requiredFrom: "Founder" | "ENIAC" | "Legal" | "Security" | "DevOps";
}

export interface SourceGovernance {
  source: SourceCode;
  label: string;
  portalUrl?: string;
  accessMode: "public" | "manual_import" | "pending_vault";
  tosStatus: "ok_public_only" | "pending_review";
  automationStatus: "allowed_public_dry_run" | "blocked_until_vault";
  adapterStatus: "ready_fixture" | "ready_public_dry_run" | "manual_import_ready" | "blocked";
  nextHumanInput: string;
}

export interface DryRunJob {
  id: string;
  label: string;
  mode: "dry_run_only";
  idempotencyKey: string;
  reads: string[];
  writes: string[];
  blockedExternalEffects: string[];
}

export interface PilotStep {
  id: string;
  label: string;
  successSignal: string;
  allowedNow: boolean;
  blockerId?: string;
}

export interface EniacOnboardingProfile {
  company: {
    tradeName: "ENIAC";
    cnpj: string;
    legalName: string;
    legalNameStatus: "founder_provided";
  };
  users: {
    totalExpected: number;
    accessModel: "equivalent_operational_access";
    masterProfile: string;
    remainingUsersStatus: "deferred_by_founder";
  };
  prioritySources: SourceCode[];
  publicDryRunAuthorized: boolean;
  tosRiskOwner: string;
  vaultRecommendation: string;
  recordedAt: string;
  securityNote: string;
}

export interface ReadinessReport {
  generatedFrom: "noyce.fases6_10.offline.v0";
  phases: Record<PhaseId, "ready_offline" | "blocked_human" | "ready_for_dry_run">;
  onboarding: EniacOnboardingProfile;
  sourceGovernance: SourceGovernance[];
  humanBlockers: HumanBlocker[];
  jobs: DryRunJob[];
  pilotSteps: PilotStep[];
  validation: {
    ok: boolean;
    errors: string[];
  };
}

export const eniacOnboarding: EniacOnboardingProfile = {
  company: {
    tradeName: "ENIAC",
    cnpj: "38.417.933/0001-05",
    legalName: "ENIAC",
    legalNameStatus: "founder_provided",
  },
  users: {
    totalExpected: 4,
    accessModel: "equivalent_operational_access",
    masterProfile: "Stafani",
    remainingUsersStatus: "deferred_by_founder",
  },
  prioritySources: ["bll", "bnc", "pcp"],
  publicDryRunAuthorized: true,
  tosRiskOwner: "Stafani",
  vaultRecommendation: "Use 1Password or Bitwarden/Vaultwarden with MFA, per-portal items, least privilege and audit history.",
  recordedAt: "2026-05-29",
  securityNote: "No credentials, tokens, cookies, certificates or 2FA codes are stored here.",
};

export const humanBlockers: HumanBlocker[] = [
  {
    id: "eniac-cnpj-razao-social",
    phase: "fase6",
    owner: "@pm",
    label: "Validacao cadastral formal da ENIAC",
    reason: "CNPJ e nome ENIAC foram informados pelo founder; validacao cadastral formal pode ser feita depois, sem bloquear dry-run publico.",
    requiredFrom: "ENIAC",
  },
  {
    id: "eniac-user-roles",
    phase: "fase6",
    owner: "@pm",
    label: "Identidade dos 3 usuarios operadores restantes",
    reason: "Stafani foi definida como admin; nomes/e-mails dos demais operadores foram explicitamente adiados pelo founder.",
    requiredFrom: "ENIAC",
  },
  {
    id: "portal-credentials-vault",
    phase: "fase7",
    owner: "@cyber-chief",
    label: "Credenciais somente via vault",
    reason: "Nenhum login, senha, token, cookie ou certificado pode entrar em docs, chat, git ou log.",
    requiredFrom: "Founder",
  },
  {
    id: "portal-tos-review",
    phase: "fase7",
    owner: "@cyber-chief",
    label: "Revisao de ToS por portal",
    reason: "Automacao autenticada depende de autorizacao, ToS e consentimento documentados.",
    requiredFrom: "Legal",
  },
  {
    id: "prod-db-approval",
    phase: "fase9",
    owner: "@devops",
    label: "Banco de producao bloqueado",
    reason: "Jobs reais precisam de ambiente, rollback, observabilidade e aprovacao DevOps.",
    requiredFrom: "DevOps",
  },
  {
    id: "prod-release-approval",
    phase: "fase11",
    owner: "@devops",
    label: "Go/no-go de producao controlada",
    reason: "Producao exige regressao, seguranca, observabilidade, suporte e aprovacao executiva.",
    requiredFrom: "Founder",
  },
];

export const sourceGovernance: SourceGovernance[] = [
  {
    source: "pncp",
    label: "PNCP",
    accessMode: "public",
    tosStatus: "ok_public_only",
    automationStatus: "allowed_public_dry_run",
    adapterStatus: "ready_public_dry_run",
    nextHumanInput: "Confirmar filtros ENIAC antes de rodar coleta real.",
  },
  {
    source: "pcp",
    label: "Portal de Compras Publicas",
    portalUrl: "https://operacao.portaldecompraspublicas.com.br/4/Pregoes/",
    accessMode: "manual_import",
    tosStatus: "pending_review",
    automationStatus: "blocked_until_vault",
    adapterStatus: "manual_import_ready",
    nextHumanInput: "Prioritario. URL, tipo de acesso, 2FA e permissao de uso.",
  },
  {
    source: "bll",
    label: "BLL",
    portalUrl: "https://bllcompras.com/Participant/ProcessSearch?param1=0",
    accessMode: "manual_import",
    tosStatus: "pending_review",
    automationStatus: "blocked_until_vault",
    adapterStatus: "manual_import_ready",
    nextHumanInput: "Prioritario. Confirmar login/certificado via vault e limites de uso.",
  },
  {
    source: "bnc",
    label: "BNC",
    portalUrl: "https://bnccompras.com/Participant/ProcessSearch?param1=0",
    accessMode: "manual_import",
    tosStatus: "pending_review",
    automationStatus: "blocked_until_vault",
    adapterStatus: "manual_import_ready",
    nextHumanInput: "Prioritario. Confirmar login/certificado via vault e limites de uso.",
  },
  {
    source: "comprasgov",
    label: "ComprasGov",
    accessMode: "manual_import",
    tosStatus: "pending_review",
    automationStatus: "blocked_until_vault",
    adapterStatus: "manual_import_ready",
    nextHumanInput: "Confirmar escopo publico versus autenticado.",
  },
  {
    source: "sislog",
    label: "SISLOG",
    accessMode: "manual_import",
    tosStatus: "pending_review",
    automationStatus: "blocked_until_vault",
    adapterStatus: "manual_import_ready",
    nextHumanInput: "Confirmar URL, perfil, 2FA e ToS.",
  },
  {
    source: "candidate:portal-regional-fixture",
    label: "Portal regional candidato",
    accessMode: "manual_import",
    tosStatus: "pending_review",
    automationStatus: "blocked_until_vault",
    adapterStatus: "ready_fixture",
    nextHumanInput: "Decidir se entra no backlog de adapter.",
  },
];

export const dryRunJobs: DryRunJob[] = [
  {
    id: "discover-public-fixtures",
    label: "Discover em fontes publicas/fixtures",
    mode: "dry_run_only",
    idempotencyKey: "source+external_id+raw_hash",
    reads: ["fixtures/source-records.v0.json"],
    writes: ["dry-run memory only"],
    blockedExternalEffects: ["portal login", "database write", "message send"],
  },
  {
    id: "normalize-score",
    label: "Normalize, dedupe e score",
    mode: "dry_run_only",
    idempotencyKey: "canonical_key+analysis_model",
    reads: ["fixtures/canonical-candidates.v0.json", "outputs/sprint0-dry-run/*.json"],
    writes: ["analysis run export"],
    blockedExternalEffects: ["merge destructive", "prod write"],
  },
  {
    id: "deadline-watch",
    label: "Deadline watch fixture-based",
    mode: "dry_run_only",
    idempotencyKey: "opportunity_id+event_type+event_time",
    reads: ["apps/noyce fixture data"],
    writes: ["readiness report"],
    blockedExternalEffects: ["external notification", "portal action"],
  },
];

export const pilotSteps: PilotStep[] = [
  {
    id: "pilot-read-fixture-inbox",
    label: "ENIAC entende a inbox e escolhe uma oportunidade",
    successSignal: "Usuario explica por que olhar, preparar, acompanhar, recorrer ou ignorar.",
    allowedNow: true,
  },
  {
    id: "pilot-review-evidence",
    label: "ENIAC revisa fato, inferencia e lacuna",
    successSignal: "Usuario identifica pelo menos uma lacuna critica antes de decidir.",
    allowedNow: true,
  },
  {
    id: "pilot-vault-onboarding",
    label: "Coletar acessos via vault",
    successSignal: "Credenciais registradas fora de docs/chat/git/logs.",
    allowedNow: false,
    blockerId: "portal-credentials-vault",
  },
  {
    id: "pilot-public-pncp-dry-run",
    label: "Rodar dry-run publico PNCP autorizado",
    successSignal: "Uma oportunidade publica entra no fluxo sem login, segredo ou efeito externo.",
    allowedNow: true,
  },
  {
    id: "pilot-real-source-run",
    label: "Rodar primeira fonte real permitida",
    successSignal: "Uma oportunidade real entra no fluxo sem segredo exposto.",
    allowedNow: false,
    blockerId: "portal-tos-review",
  },
];

export function buildReadinessReport(): ReadinessReport {
  const report: ReadinessReport = {
    generatedFrom: "noyce.fases6_10.offline.v0",
    phases: {
      fase6: "ready_for_dry_run",
      fase7: "blocked_human",
      fase8: "ready_for_dry_run",
      fase9: "ready_for_dry_run",
      fase10: "ready_offline",
      fase11: "blocked_human",
    },
    onboarding: eniacOnboarding,
    sourceGovernance,
    humanBlockers,
    jobs: dryRunJobs,
    pilotSteps,
    validation: {
      ok: true,
      errors: [],
    },
  };

  report.validation.errors = validateReadinessReport(report);
  report.validation.ok = report.validation.errors.length === 0;

  return report;
}

export function validateReadinessReport(report: ReadinessReport): string[] {
  const errors: string[] = [];

  for (const source of report.sourceGovernance) {
    if (source.automationStatus === "blocked_until_vault" && source.accessMode !== "manual_import" && source.accessMode !== "pending_vault") {
      errors.push(`${source.source}: blocked automation must not be public live access`);
    }
    if (source.tosStatus === "pending_review" && source.automationStatus !== "blocked_until_vault") {
      errors.push(`${source.source}: pending ToS must block automation`);
    }
  }

  for (const job of report.jobs) {
    if (job.mode !== "dry_run_only") errors.push(`${job.id}: only dry-run jobs allowed`);
    if (!job.blockedExternalEffects.includes("portal login") && job.id === "discover-public-fixtures") {
      errors.push(`${job.id}: portal login must be blocked`);
    }
  }

  for (const step of report.pilotSteps) {
    if (!step.allowedNow && !step.blockerId) errors.push(`${step.id}: blocked pilot step needs blockerId`);
  }

  return errors;
}
