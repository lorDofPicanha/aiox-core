import type { Opportunity, PortalAccess, SourceCode, WorkflowStage } from '@/lib/noyce-model';
import { buildAnalysisRun, classifyAction } from '@/lib/noyce-model';
import type { CompanyCapabilityProfile } from '@/lib/noyce-model';
import type { EditalRequirementsModel } from '@/lib/noyce-model';
import { withComputedCapabilities } from '@/lib/noyce-capability';
import { buildHabilitationResult } from '@/lib/noyce-habilitation';
import { getMarketForOrgao } from '@/lib/noyce-market';
import { buildTriage } from '@/lib/noyce-operational';
import { buildSuspicionSignals, type HolidayCalendar, type LegalConstants } from '@/lib/noyce-suspicion';
import { noyceSources } from './noyce-source-registry';
import discoverySnapshot from '@/lib/data/discovery-snapshot.json';
import eniacCcpSeed from '@/lib/data/eniac-ccp.json';
import feriadosNacionais from '@/lib/data/feriados-nacionais.json';
import legalConstants from '@/lib/data/legal-constants.json';

export const portalAccess: PortalAccess[] = noyceSources.map((source) => ({
  source: source.source,
  name: source.label,
  portalUrl: source.portalUrl,
  status: source.allowedNow ? 'publico' : source.accessMode === 'manual_import' ? 'dry_run' : 'aguarda_vault',
  requiresLogin: source.requiresLogin,
  requires2fa: source.requires2fa,
  tosStatus: source.tosStatus === 'ok_public_only' ? 'ok' : 'pending',
}));

function hasMissingData(item: { missingData: readonly string[] }, field: string) {
  return item.missingData.includes(field);
}

const SCORE_AS_OF = '2026-05-23T00:00:00Z';

// Real opportunities sourced from the PNCP discovery snapshot (scripts/noyce/build-discovery-snapshot.js).
// Each is triaged (Vai/Olha/Pula) and enriched below; market comes from the competitor snapshot
// when the órgão CNPJ matches, else null (honest "dados insuficientes").
interface DiscoveryItem {
  id: string;
  source: string;
  title: string;
  buyer: string;
  buyerCnpj: string | null;
  city: string;
  uf: string;
  ibge: string;
  distanceKm: number;
  estimatedValue: number | null;
  publicationDate: string | null;
  proposalDeadline: string | null;
  modality: string;
  situacao: string | null;
  sourceUrl: string | null;
  editalRequirements?: EditalRequirementsModel | null;
}

const KNOWN_SOURCES = noyceSources.map((source) => source.source);
function normalizeSource(value: string): SourceCode {
  return (KNOWN_SOURCES as readonly string[]).includes(value) ? (value as SourceCode) : 'pncp';
}

const discovery = discoverySnapshot as unknown as { items: DiscoveryItem[] };
const eniacCcp = withComputedCapabilities(eniacCcpSeed as CompanyCapabilityProfile);
const TRIAGE_RANK: Record<string, number> = { vai: 0, olha: 1, pula: 2 };

const baseOpportunities = discovery.items
  .map((d) => ({
    id: d.id,
    orgaoCnpj: d.buyerCnpj,
    source: normalizeSource(d.source),
    title: d.title,
    buyer: d.buyer,
    city: d.city,
    uf: d.uf,
    distanceKm: d.distanceKm,
    estimatedValue: d.estimatedValue,
    proposalDeadline: d.proposalDeadline,
    stage: 'monitorar' as WorkflowStage,
    hasConflict: false,
    risks: d.situacao ? [`Situação PNCP: ${d.situacao}.`] : [],
    missingData: [] as string[],
    editalRequirements: d.editalRequirements ?? null,
    triage: buildTriage({
      title: d.title,
      distanceKm: d.distanceKm,
      estimatedValue: d.estimatedValue,
      proposalDeadline: d.proposalDeadline,
    }),
  }))
  .sort((a, b) => {
    const rankDelta = TRIAGE_RANK[a.triage.verdict] - TRIAGE_RANK[b.triage.verdict];
    if (rankDelta !== 0) return rankDelta;
    return b.triage.score - a.triage.score;
  })
  .slice(0, 80);

export const opportunities: Opportunity[] = baseOpportunities.map((item) => {
  const analysisRun = buildAnalysisRun({
    source: item.source,
    city: item.city,
    distanceKm: item.distanceKm,
    estimatedValue: item.estimatedValue,
    proposalDeadline: item.proposalDeadline,
    stage: item.stage,
    hasConflict: item.hasConflict,
    missingData: item.missingData,
    asOf: SCORE_AS_OF,
  });
  const opportunityScore = analysisRun.opportunity.score;
  const confidenceScore = analysisRun.confidence.score;
  const suspicionSignals = item.editalRequirements
    ? buildSuspicionSignals(item.editalRequirements, legalConstants as LegalConstants, feriadosNacionais as HolidayCalendar)
    : null;
  const habilitationResult = item.editalRequirements ? buildHabilitationResult(eniacCcp, item.editalRequirements) : null;

  return {
    ...item,
    ...(item.editalRequirements ? { suspicionSignals: suspicionSignals ?? [] } : {}),
    habilitationResult,
    opportunityScore,
    confidenceScore,
    analysisRun,
    action: classifyAction(opportunityScore, confidenceScore, item.hasConflict, Boolean(item.proposalDeadline)),
    evidence: [
      { kind: 'fato', label: 'Fonte confirmada', value: 'Objeto, valor e prazo encontrados em fonte oficial.', source: item.source, confidence: 'confirmed' },
      { kind: 'fato', label: 'Raio de cobertura', value: String(item.distanceKm) + ' km da sede, dentro do raio operacional de 500 km.', source: item.source, confidence: 'strong' },
      { kind: 'inferencia', label: 'Score determinístico', value: analysisRun.opportunity.components.map((component) => `${component.label}: ${component.value}/${component.max}`).join(' · '), source: item.source, confidence: 'strong' },
      { kind: 'lacuna', label: 'Pendências', value: item.missingData.length ? item.missingData.join(', ') : 'Sem lacunas críticas no fixture.', source: item.source, confidence: item.missingData.length ? 'missing' : 'confirmed' },
    ],
    // Real competitor intelligence from PNCP snapshot (replaces the fake Alfa/Beta + ×0.86/×1.14).
    // null when the órgão is outside the radius seed or is a coverage hole (honest "dados insuficientes").
    market: getMarketForOrgao(item.orgaoCnpj),
    habilitationChecklist: [
      { label: 'Fiscal e trabalhista', status: 'ok', note: 'Certidões devem ser conferidas antes da proposta.' },
      { label: 'Qualificação técnica', status: hasMissingData(item, 'anexos_tecnicos') ? 'missing' : 'warning', note: hasMissingData(item, 'anexos_tecnicos') ? 'Anexos técnicos dependem do portal.' : 'Validar acervo e exigências específicas.' },
      { label: 'Econômico-financeira', status: 'warning', note: 'Conferir índices e balanço exigidos no edital.' },
      { label: 'Proposta e planilha', status: item.stage === 'acompanhar' ? 'warning' : 'ok', note: 'Revisar composição antes de sessão ou envio.' },
    ],
    timeline: [
      { label: 'Publicação', date: 'Confirmada na fonte', status: 'done' },
      { label: 'Preclusão', date: 'Monitorar prazo de impugnação e esclarecimentos', status: opportunityScore >= 81 ? 'open' : 'risk' },
      { label: 'Sessão', date: item.proposalDeadline ?? 'Prazo ausente', status: item.proposalDeadline ? 'open' : 'missing' },
      { label: 'Manifestar intenção', date: 'Stage 5 ativo após resultado declarado', status: item.stage === 'acompanhar' ? 'risk' : 'open' },
    ],
    legalProcess: buildLegalProcess(item, opportunityScore, confidenceScore),
  };
});

function buildLegalProcess(
  item: (typeof baseOpportunities)[number],
  opportunityScore: number,
  confidenceScore: number,
) {
  const requirementPrefix = `req-${item.id}`;
  const needsTechnicalDocs = hasMissingData(item, 'anexos_tecnicos') || hasMissingData(item, 'visita_tecnica');
  const isLiveProcess = item.stage === 'acompanhar';
  const hasDeadline = Boolean(item.proposalDeadline);

  const requirements = [
    {
      id: `${requirementPrefix}-fiscal`,
      category: 'fiscal' as const,
      label: 'Regularidade fiscal e trabalhista',
      requirementText: 'Conferir certidoes vigentes antes de proposta, sessao ou habilitacao.',
      criticality: 'high' as const,
      status: 'ready_for_review' as const,
      confidence: 'strong' as const,
      humanOwner: 'Operacao ENIAC',
      evidenceLabel: 'Fixture de edital + checklist padrao Sprint 0.',
      note: 'Noyce apenas organiza a revisao; nao envia documento.',
    },
    {
      id: `${requirementPrefix}-tecnica`,
      category: 'tecnica' as const,
      label: 'Qualificacao tecnica',
      requirementText: 'Validar atestado, acervo e anexos tecnicos exigidos pelo edital.',
      criticality: needsTechnicalDocs ? ('blocker' as const) : ('medium' as const),
      status: needsTechnicalDocs ? ('gap' as const) : ('needs_document' as const),
      confidence: needsTechnicalDocs ? ('missing' as const) : ('inferred' as const),
      humanOwner: 'Engenharia ENIAC',
      evidenceLabel: needsTechnicalDocs ? 'Lacuna declarada no fixture.' : 'Inferencia por objeto de obra/engenharia.',
      note: needsTechnicalDocs ? 'Revisao obrigatoria antes de recomendar proposta.' : 'Exige checagem humana do acervo.',
    },
  ];

  const documents = [
    {
      id: `doc-${item.id}-certidoes`,
      requirementId: requirements[0].id,
      label: 'Pacote de certidoes',
      documentType: 'certidao',
      status: 'needs_review' as const,
      validUntil: null,
      source: 'vault_pending' as const,
      sensitive: true,
      redactionRequired: true,
    },
    {
      id: `doc-${item.id}-atestado`,
      requirementId: requirements[1].id,
      label: 'Atestado tecnico compativel',
      documentType: 'atestado',
      status: needsTechnicalDocs ? ('missing' as const) : ('needs_review' as const),
      validUntil: null,
      source: 'vault_pending' as const,
      sensitive: true,
      redactionRequired: true,
    },
  ];

  const events = [
    {
      id: `event-${item.id}-proposal`,
      stage: 'habilitar' as const,
      eventType: 'proposal_deadline' as const,
      label: 'Prazo de proposta',
      eventTime: item.proposalDeadline,
      status: hasDeadline ? ('observed' as const) : ('expected' as const),
      requiresHumanAction: true,
      riskLevel: hasDeadline ? ('watch' as const) : ('critical' as const),
      consequenceIfMissed: 'Perda da janela operacional de envio ou preparacao.',
      evidenceLabel: hasDeadline ? 'Prazo extraido do fixture.' : 'Prazo ausente; fonte precisa ser revisada.',
    },
    {
      id: `event-${item.id}-appeal-intent`,
      stage: 'recorrer' as const,
      eventType: 'appeal_intent_window' as const,
      label: 'Janela de intencao de recurso',
      eventTime: null,
      status: isLiveProcess ? ('expected' as const) : ('inferred' as const),
      requiresHumanAction: true,
      riskLevel: isLiveProcess ? ('urgent' as const) : ('watch' as const),
      consequenceIfMissed: 'Risco de preclusao da discussao recursal.',
      evidenceLabel: isLiveProcess ? 'Processo em acompanhamento no fixture.' : 'Evento futuro inferido pelo workflow.',
    },
  ];

  const decisionPoints = [
    {
      id: `decision-${item.id}-documents`,
      decisionType: 'prepare_documents' as const,
      recommendedAction: needsTechnicalDocs ? 'Resolver lacuna tecnica antes de proposta.' : 'Separar documentos para revisao humana.',
      basis: needsTechnicalDocs ? ('missing_data' as const) : ('inference' as const),
      confidenceScore,
      blockingLacunas: needsTechnicalDocs ? ['documento tecnico pendente'] : [],
      humanApprovalRequired: true,
      externalActBlocked: false,
    },
    {
      id: `decision-${item.id}-appeal-intent`,
      decisionType: 'manifest_appeal_intent' as const,
      recommendedAction: 'Preparar criterio de decisao, mas manter manifestacao bloqueada ate acao humana no portal.',
      basis: isLiveProcess ? ('legal_review_needed' as const) : ('inference' as const),
      confidenceScore: Math.min(confidenceScore, opportunityScore),
      blockingLacunas: isLiveProcess ? [] : ['janela de recurso ainda nao observada'],
      humanApprovalRequired: true,
      externalActBlocked: true,
    },
  ];

  return {
    requirements,
    documents,
    events,
    decisionPoints,
    appealIntent: {
      id: `intent-${item.id}`,
      windowStatus: isLiveProcess ? ('unknown' as const) : ('not_open' as const),
      groundsSummary: isLiveProcess
        ? 'Possivel discussao deve ser registrada como intencao separada das razoes.'
        : 'Sem evento de resultado declarado no fixture.',
      humanDecision: isLiveProcess ? ('needs_lawyer_review' as const) : ('undecided' as const),
      submissionStatus: 'blocked_not_automated' as const,
    },
    appealReasons: {
      id: `reasons-${item.id}`,
      intentId: `intent-${item.id}`,
      draftStatus: isLiveProcess ? ('outline' as const) : ('not_started' as const),
      argumentTopics: isLiveProcess ? ['habilitacao', 'diligencia/saneamento', 'preclusao'] : ['monitorar resultado'],
      reviewOwner: 'Revisao juridica humana',
      externalSubmissionStatus: 'blocked_not_automated' as const,
    },
  };
}
