import type { Opportunity, PortalAccess } from '@/lib/noyce-model';
import { buildAnalysisRun, classifyAction } from '@/lib/noyce-model';

export const portalAccess: PortalAccess[] = [
  { source: 'pncp', name: 'PNCP', status: 'publico', requiresLogin: false, requires2fa: 'no', tosStatus: 'ok' },
  { source: 'pcp', name: 'Portal de Compras Públicas', status: 'dry_run', requiresLogin: true, requires2fa: 'unknown', tosStatus: 'ok' },
  { source: 'bll', name: 'BLL', status: 'dry_run', requiresLogin: true, requires2fa: 'unknown', tosStatus: 'ok' },
  { source: 'bnc', name: 'BNC', status: 'dry_run', requiresLogin: true, requires2fa: 'unknown', tosStatus: 'ok' },
  { source: 'comprasgov', name: 'ComprasGov', status: 'dry_run', requiresLogin: true, requires2fa: 'unknown', tosStatus: 'ok' },
  { source: 'sislog', name: 'SISLOG', status: 'dry_run', requiresLogin: true, requires2fa: 'unknown', tosStatus: 'ok' },
];

function hasMissingData(item: { missingData: readonly string[] }, field: string) {
  return item.missingData.includes(field);
}

const SCORE_AS_OF = '2026-05-23T00:00:00Z';

const baseOpportunities = [
  {
    id: 'pncp-aguas-lindas-90021',
    source: 'pncp' as const,
    title: 'Pregão 90021/2026 - material e manutenção predial',
    buyer: 'Município de Águas Lindas',
    city: 'Águas Lindas de Goiás',
    uf: 'GO',
    distanceKm: 38,
    estimatedValue: 248000,
    proposalDeadline: '2026-06-04T12:00:00Z',
    stage: 'monitorar' as const,
    hasConflict: false,
    risks: ['Fontes confirmadas: PNCP e ComprasGov convergem no objeto, valor e prazo.'],
    missingData: [],
  },
  {
    id: 'bll-anapolis-045',
    source: 'bll' as const,
    title: 'SRP 045/2026 - serviços de drenagem urbana',
    buyer: 'Prefeitura de Anápolis',
    city: 'Anápolis',
    uf: 'GO',
    distanceKm: 156,
    estimatedValue: 1380000,
    proposalDeadline: '2026-06-08T13:30:00Z',
    stage: 'acompanhar' as const,
    hasConflict: false,
    risks: ['Manifestar intenção em até 10 minutos após resultado declarado.'],
    missingData: ['ata', 'contrato_anterior'],
  },
  {
    id: 'comprasgov-formosa-778',
    source: 'comprasgov' as const,
    title: 'Concorrência 778/2026 - reforma de unidade pública',
    buyer: 'Governo do Distrito Federal',
    city: 'Formosa',
    uf: 'GO',
    distanceKm: 82,
    estimatedValue: 920000,
    proposalDeadline: '2026-06-12T17:00:00Z',
    stage: 'analisar' as const,
    hasConflict: false,
    risks: ['Checar preclusão antes de orientar recurso ou impugnação.'],
    missingData: ['visita_tecnica'],
  },
  {
    id: 'pcp-luziania-233',
    source: 'pcp' as const,
    title: 'Tomada 233/2026 - cobertura metálica em escola',
    buyer: 'Prefeitura de Luziânia',
    city: 'Luziânia',
    uf: 'GO',
    distanceKm: 64,
    estimatedValue: 510000,
    proposalDeadline: '2026-06-18T14:00:00Z',
    stage: 'monitorar' as const,
    hasConflict: false,
    risks: ['Fonte confirmada, mas edital completo depende de login no portal.'],
    missingData: ['anexos_tecnicos'],
  },
];

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

  return {
    ...item,
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
    competitors: [
      { name: 'Concorrente Alfa', level: opportunityScore >= 88 ? 'probable' : 'possible', note: 'Histórico do órgão nos últimos 6 meses indica presença recorrente.' },
      { name: 'Concorrente Beta', level: confidenceScore >= 85 ? 'possible' : 'no_evidence', note: 'Sinal parcial por objeto semelhante; não usar como fato confirmado.' },
    ],
    priceReferences: [
      { label: 'P25 histórico', value: item.estimatedValue ? Math.round(item.estimatedValue * 0.86) : null, note: 'Faixa inferior calculada no dry-run v0.', confidence: 'inferred' },
      { label: 'Mediana', value: item.estimatedValue, note: 'Valor estimado da oportunidade usado como centro da faixa.', confidence: item.estimatedValue ? 'strong' : 'missing' },
      { label: 'P75 histórico', value: item.estimatedValue ? Math.round(item.estimatedValue * 1.14) : null, note: 'Faixa superior para revisar margem e risco.', confidence: 'inferred' },
    ],
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
