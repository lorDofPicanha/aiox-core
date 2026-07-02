import type { SourceCode } from "./noyce-model";

// Operational + LEGAL permission registry per source (squad 08-jun + legal reviews 09-jun).
// Discovery spine = PNCP open data (Lei 14.133 art. 174), which already aggregates editais
// from BLL/BNC/PCP/ComprasGov. Portal-specific adapters are ONLY needed for authenticated
// access to ENIAC's own certame — those stay blocked_until_vault.
//
// Legal calibration (per-portal ToS reviews in docs/.../03-legal/):
//   PNCP / ComprasGov → public official API, reading allowed + encouraged by law.
//   BNC / BLL         → private operator, silent on robots; public read tolerated (low risk),
//                       but discovery routes via PNCP (don't HTML-scrape). Auth → vault.
//   PCP (ECUSTOMIZE)  → EXPRESSLY PROHIBITS robots/scraping (Reg. 5.3.1.1/5.3.1.2). Never
//                       scrape; discovery via PNCP only; auth needs vault + express permission.
//   Binding acts (lance, declaração, proposta, recurso) ALWAYS require a human click —
//       legal liability is irretractable + criminal (BLL Art. 13§3/27/32; Lei 14.133 art. 155).

export type SourceAccessMode = "public_api" | "manual_import" | "authenticated_pending_vault";
export type SourceAutomationStatus = "allowed_public_dry_run" | "blocked_until_vault";
export type SourceAdapterStatus = "ready_public_dry_run" | "manual_import_ready" | "blocked";
export type SourceTosStatus = "ok_public_only" | "reviewed_calibrated" | "pending_review";

// Legal posture on automated reading/scraping of the source.
export type ScrapingPolicy = "open_data" | "silent_tolerated" | "prohibited" | "unknown";
// How public reading is technically available.
export type PublicReadMode = "open_api" | "public_html" | "none";
// Where Noyce should obtain DISCOVERY for this source.
export type DiscoveryRoute = "self" | "pncp";

// Binding acts that always require a human click (never autonomous).
// AMPLIADO (I1 / C-NOVO-6, doc 32 §12.1): os 4 originais + os 3 atos do design v2
// (contrarrazões, impugnação de edital, resposta a diligência). Esta é a FONTE DE
// VERDADE única — MAESTRO_BINDING_ACTS (maestro-types.ts) deriva daqui.
export const HUMAN_REQUIRED_ACTS = [
  "lance",
  "declaracao",
  "proposta",
  "recurso",
  "contrarrazoes",
  "impugnacao_edital",
  "resposta_diligencia",
] as const;
export type BindingAct = (typeof HUMAN_REQUIRED_ACTS)[number];

// Discovery operational radius (Story 30.5 — reunião ENIAC 15/Jun).
// NEAR = "muito perto", elegível a veredicto "Vai" automático.
// MAX  = raio operacional total; 171..MAX → "Olha" (revisão humana); acima → "Pula".
// Configurável: alterar MAX_DISCOVERY_RADIUS_KM reescopa a triagem sem nova story.
export const NEAR_RADIUS_KM = 170;
export const MAX_DISCOVERY_RADIUS_KM = 500;

export interface NoyceSourceDefinition {
  source: SourceCode;
  label: string;
  portalUrl?: string;
  accessMode: SourceAccessMode;
  requiresLogin: boolean;
  requires2fa: "no" | "yes" | "unknown";
  tosStatus: SourceTosStatus;
  automationStatus: SourceAutomationStatus;
  adapterStatus: SourceAdapterStatus;
  priority: "p0" | "p1" | "p2";
  // allowedNow = Noyce may operate this source AUTONOMOUSLY now (public read/discovery),
  // legally and technically. Authenticated certame actions are gated separately (see vaultGates).
  allowedNow: boolean;
  // ── legal calibration ──
  scrapingPolicy: ScrapingPolicy;
  publicReadMode: PublicReadMode;
  publicReadAllowedNow: boolean;
  discoveryVia: DiscoveryRoute;
  // Binding acts that stay human-only for this source (always the full set; kept explicit).
  humanRequiredActs: readonly BindingAct[];
  // How many gates to flip authenticated automation on (vault; PCP also needs express permission).
  vaultGates: number;
  legalReview: string | null;
  nextHumanInput: string;
}

export const noyceSources: NoyceSourceDefinition[] = [
  {
    source: "pncp",
    label: "PNCP",
    portalUrl: "https://pncp.gov.br/app/editais",
    accessMode: "public_api",
    requiresLogin: false,
    requires2fa: "no",
    tosStatus: "ok_public_only",
    automationStatus: "allowed_public_dry_run",
    adapterStatus: "ready_public_dry_run",
    priority: "p0",
    allowedNow: true,
    scrapingPolicy: "open_data",
    publicReadMode: "open_api",
    publicReadAllowedNow: true,
    discoveryVia: "self",
    humanRequiredActs: HUMAN_REQUIRED_ACTS,
    vaultGates: 0,
    legalReview: null,
    nextHumanInput: "Confirmar filtros ENIAC: UFs/cidades, modalidades, palavras-chave e faixa de valor.",
  },
  {
    source: "comprasgov",
    label: "Compras.gov.br",
    portalUrl: "https://www.gov.br/compras/pt-br",
    accessMode: "public_api",
    requiresLogin: false,
    requires2fa: "no",
    tosStatus: "ok_public_only",
    automationStatus: "allowed_public_dry_run",
    adapterStatus: "ready_public_dry_run",
    priority: "p1",
    allowedNow: true,
    scrapingPolicy: "open_data",
    publicReadMode: "open_api",
    publicReadAllowedNow: true,
    discoveryVia: "self",
    humanRequiredActs: HUMAN_REQUIRED_ACTS,
    vaultGates: 1, // SICAF/área autenticada do fornecedor exige login (gov.br) — só pós-vault
    legalReview: "docs/projects/buscador-licitacoes/03-legal/comprasgov-tos-automacao-review.md",
    nextHumanInput: "Leitura via API oficial (PNCP + dadosabertos.compras.gov.br) liberada. Login SICAF só pós-vault.",
  },
  {
    source: "bll",
    label: "BLL",
    portalUrl: "https://bllcompras.com/Participant/ProcessSearch?param1=0",
    accessMode: "authenticated_pending_vault",
    requiresLogin: true,
    requires2fa: "unknown",
    tosStatus: "reviewed_calibrated",
    automationStatus: "blocked_until_vault",
    adapterStatus: "manual_import_ready",
    priority: "p0",
    allowedNow: false,
    scrapingPolicy: "silent_tolerated",
    publicReadMode: "public_html",
    publicReadAllowedNow: true, // Reg. Art. 5º/9º: consulta + download da íntegra públicos
    discoveryVia: "pncp", // não raspar o HTML; descoberta vem do PNCP
    humanRequiredActs: HUMAN_REQUIRED_ACTS,
    vaultGates: 1,
    legalReview: "docs/projects/buscador-licitacoes/03-legal/bll-tos-automacao-review.md",
    nextHumanInput: "Descoberta via PNCP. Login só no certame da ENIAC, pós-vault. E-mail à BLL pedindo API/parceiro.",
  },
  {
    source: "bnc",
    label: "BNC",
    portalUrl: "https://bnccompras.com/Participant/ProcessSearch?param1=0",
    accessMode: "authenticated_pending_vault",
    requiresLogin: true,
    requires2fa: "unknown",
    tosStatus: "reviewed_calibrated",
    automationStatus: "blocked_until_vault",
    adapterStatus: "manual_import_ready",
    priority: "p0",
    allowedNow: false,
    scrapingPolicy: "silent_tolerated",
    publicReadMode: "public_html", // ProcessSearchPublic responde sem login, mas é HTML
    publicReadAllowedNow: true,
    discoveryVia: "pncp", // roda sobre o motor do BLL; descoberta vem do PNCP, não do HTML
    humanRequiredActs: HUMAN_REQUIRED_ACTS,
    vaultGates: 1,
    legalReview: "docs/projects/buscador-licitacoes/03-legal/bnc-tos-automacao-review.md",
    nextHumanInput: "Descoberta via PNCP. Login só no certame da ENIAC, pós-vault. E-mail à BNC (contato@bnc.org.br).",
  },
  {
    source: "pcp",
    label: "Portal de Compras Públicas",
    portalUrl: "https://operacao.portaldecompraspublicas.com.br/4/Pregoes/",
    accessMode: "authenticated_pending_vault",
    requiresLogin: true,
    requires2fa: "unknown",
    tosStatus: "reviewed_calibrated",
    automationStatus: "blocked_until_vault",
    adapterStatus: "blocked", // scraping vedado por regulamento
    priority: "p0",
    allowedNow: false,
    scrapingPolicy: "prohibited", // Reg. ECUSTOMIZE 5.3.1.1/5.3.1.2: veda robôs/spider/page-scrape
    publicReadMode: "public_html",
    publicReadAllowedNow: false, // leitura pública só MANUAL/pontual; automatizada = vedada
    discoveryVia: "pncp", // OBRIGATÓRIO via PNCP — nunca raspar o PCP
    humanRequiredActs: HUMAN_REQUIRED_ACTS,
    vaultGates: 2, // vault + permissão expressa da ECUSTOMIZE (API/parceiro)
    legalReview: "docs/projects/buscador-licitacoes/03-legal/pcp-tos-automacao-review.md",
    nextHumanInput: "NUNCA raspar. Descoberta só via PNCP. Pedir permissão/API expressa à ECUSTOMIZE p/ login.",
  },
  {
    source: "sislog",
    label: "SISLOG",
    accessMode: "manual_import",
    requiresLogin: true,
    requires2fa: "unknown",
    tosStatus: "pending_review",
    automationStatus: "blocked_until_vault",
    adapterStatus: "manual_import_ready",
    priority: "p1",
    allowedNow: false,
    scrapingPolicy: "unknown",
    publicReadMode: "none",
    publicReadAllowedNow: false,
    discoveryVia: "pncp",
    humanRequiredActs: HUMAN_REQUIRED_ACTS,
    vaultGates: 1,
    legalReview: null,
    nextHumanInput: "Confirmar URL correta, perfil de acesso, 2FA e ToS — revisão legal ainda pendente.",
  },
];

export function getSourceDefinition(source: SourceCode): NoyceSourceDefinition | null {
  return noyceSources.find((item) => item.source === source) ?? null;
}

export function listSourcesAllowedNow(): NoyceSourceDefinition[] {
  return noyceSources.filter((source) => source.allowedNow);
}

export function listBlockedSources(): NoyceSourceDefinition[] {
  return noyceSources.filter((source) => !source.allowedNow);
}

export function canRunSourceNow(source: SourceCode): boolean {
  return getSourceDefinition(source)?.allowedNow === true;
}

// Public reading (consulta/download de edital) is legally clear right now.
export function canReadPublicNow(source: SourceCode): boolean {
  return getSourceDefinition(source)?.publicReadAllowedNow === true;
}

// Where to obtain discovery for a source: its own open API, or the PNCP aggregator.
export function getDiscoveryRoute(source: SourceCode): DiscoveryRoute {
  return getSourceDefinition(source)?.discoveryVia ?? "pncp";
}

// Sources whose ToS forbids any automated reading/scraping — never crawl these.
export function isScrapingProhibited(source: SourceCode): boolean {
  return getSourceDefinition(source)?.scrapingPolicy === "prohibited";
}

// A binding act is NEVER autonomous — human click always required.
export function requiresHumanAct(act: BindingAct): boolean {
  return HUMAN_REQUIRED_ACTS.includes(act);
}
