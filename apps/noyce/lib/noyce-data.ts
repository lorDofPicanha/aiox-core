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
  };
});
