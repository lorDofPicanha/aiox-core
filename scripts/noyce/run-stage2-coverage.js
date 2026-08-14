#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const PNCP_BASE_URL = 'https://pncp.gov.br/api/consulta/v1';
const ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_OUTPUT_DIR = path.join(
  ROOT,
  'docs',
  'projects',
  'buscador-licitacoes',
  'outputs'
);

const EDITAIS = [
  {
    edital: 'edital-01-2026',
    orgao: 'Pref. Aguas Lindas',
    municipio: 'Aguas Lindas/GO',
    cnpjOrgao: '01616520000196',
    codigoMunicipioIbge: '5200258',
    modalidade: 4,
    dataInicial: '20260101',
    dataFinal: '20260131',
    valorEstimado: 2252849.2,
    plataforma: 'PCP',
  },
  {
    edital: 'edital-04052026',
    orgao: 'Pref. Aguas Lindas',
    municipio: 'Aguas Lindas/GO',
    cnpjOrgao: '01616520000196',
    codigoMunicipioIbge: '5200258',
    modalidade: 4,
    dataInicial: '20260101',
    dataFinal: '20260531',
    valorEstimado: 174823.04,
    plataforma: 'PCP',
  },
  {
    edital: 'edital-05-2026-republic',
    orgao: 'Pref. Aguas Lindas (Cultura)',
    municipio: 'Aguas Lindas/GO',
    cnpjOrgao: '01616520000196',
    codigoMunicipioIbge: '5200258',
    modalidade: 4,
    dataInicial: '20260101',
    dataFinal: '20260531',
    valorEstimado: 2140134.13,
    plataforma: 'PCP',
  },
  {
    edital: 'edital-ubs-ii',
    orgao: 'Pref. Aguas Lindas',
    municipio: 'Aguas Lindas/GO',
    cnpjOrgao: '01616520000196',
    codigoMunicipioIbge: '5200258',
    modalidade: 4,
    dataInicial: '20260101',
    dataFinal: '20260531',
    valorEstimado: 2831789.56,
    plataforma: 'PCP',
  },
  {
    edital: 'edital-2',
    orgao: 'Pref. Novo Gama',
    municipio: 'Novo Gama/GO',
    cnpjOrgao: '01629276000104',
    codigoMunicipioIbge: '5215231',
    modalidade: 4,
    dataInicial: '20260401',
    dataFinal: '20260430',
    valorEstimado: 1090203.96,
    plataforma: 'BLL',
    metadataNotes: 'Valor extraido de edital-2.txt:3739.',
  },
  {
    edital: 'edital-3',
    orgao: 'Pref. Novo Gama',
    municipio: 'Novo Gama/GO',
    cnpjOrgao: '01629276000104',
    codigoMunicipioIbge: '5215231',
    modalidade: 4,
    dataInicial: '20260101',
    dataFinal: '20260531',
    valorEstimado: 1049075.84,
    plataforma: 'BLL',
    metadataNotes: 'Valor extraido de edital-3.txt:3724.',
  },
  {
    edital: 'edital-base',
    orgao: 'Camara de Abadiania',
    municipio: 'Abadiania/GO',
    cnpjOrgao: null,
    // CORRECAO 13/Ago: estava 5200050 = "Abadia de Goias" (166 km da sede), municipio
    // DIFERENTE de Abadiania (5200100, 66 km). O miss deste edital vinha sendo atribuido
    // a "BNC nao publica no PNCP" quando a causa era este digito no nosso proprio fixture.
    codigoMunicipioIbge: '5200100',
    modalidade: 4,
    dataInicial: '20260101',
    dataFinal: '20260531',
    valorEstimado: 670864.32,
    plataforma: 'BNC',
    metadataNotes: 'Valor extraido de edital-base.txt:80; CNPJ do orgao nao localizado no TXT.',
  },
  {
    edital: 'edital-4',
    orgao: 'Municipio de Pirenopolis',
    municipio: 'Pirenopolis/GO',
    cnpjOrgao: '01067941000105',
    codigoMunicipioIbge: '5217302',
    modalidade: 4,
    dataInicial: '20260301',
    dataFinal: '20260331',
    valorEstimado: 1035758.22,
    plataforma: 'BNC',
  },
  {
    edital: 'ce002-2026',
    orgao: 'Pref. Anapolis',
    municipio: 'Anapolis/GO',
    cnpjOrgao: '01067479000146',
    codigoMunicipioIbge: '5201108',
    modalidade: 4,
    dataInicial: '20260301',
    dataFinal: '20260331',
    valorEstimado: 522317.09,
    plataforma: 'ComprasGov',
    metadataNotes: 'Valor extraido de ce002-2026.txt:18-20 e confirmado em anexos.',
  },
  {
    edital: 'edital-1',
    orgao: 'CEASA/GO',
    municipio: 'Goiania/GO',
    cnpjOrgao: '01098797000174',
    codigoMunicipioIbge: '5208707',
    modalidade: 6,
    dataInicial: '20260101',
    dataFinal: '20260531',
    valorEstimado: null,
    plataforma: 'BLL',
    metadataNotes: 'Valor estimado sigiloso no TXT: edital-1.txt:240-243.',
  },
  {
    edital: 'sei-governadoria-59297613',
    orgao: 'CEASA/GO',
    municipio: 'Goiania/GO',
    cnpjOrgao: '01098797000174',
    codigoMunicipioIbge: '5208707',
    modalidade: 6,
    dataInicial: '20260101',
    dataFinal: '20260531',
    valorEstimado: null,
    plataforma: 'BLL',
    metadataNotes: 'Valor estimado sigiloso no TXT: sei-governadoria-59297613.txt:236-239 e 886-888.',
  },
];

function parseArgs(argv) {
  const args = {
    dryRun: false,
    outputDir: DEFAULT_OUTPUT_DIR,
    delayMs: 350,
    // 13/Ago: medimos uma resposta legitima do PNCP em 62,6s. Com 12s/3x o gate abortava
    // e contava ausencia. Ver lib/sources/pncp-resilient-fetch.ts.
    retries: 6,
    timeoutMs: 75000,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--output-dir') args.outputDir = path.resolve(argv[++index]);
    else if (arg === '--delay-ms') args.delayMs = Number(argv[++index]);
    else if (arg === '--retries') args.retries = Number(argv[++index]);
    else if (arg === '--timeout-ms') args.timeoutMs = Number(argv[++index]);
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage: node scripts/noyce/run-stage2-coverage.js [options]

Options:
  --dry-run              Print dataset and planned PNCP requests without network calls.
  --output-dir <path>    Output directory for CSV and JSON files.
  --delay-ms <number>    Delay between PNCP requests. Default: 350.
  --retries <number>     Retry attempts per PNCP request. Default: 6.
  --timeout-ms <number>  Timeout per PNCP request. Default: 75000.
`);
}

function buildUrl(endpoint, params) {
  const url = new URL(`${PNCP_BASE_URL}/${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

// Carregado em main() via import() dinamico (o modulo e TS/ESM e este script e CJS).
let resilient = null;

/**
 * CORRECAO 13/Ago — antes esta funcao tratava timeout, HTTP 500 e corpo HTML como se
 * fossem "nao achado". Medimos uma chamada legitima do PNCP levando 62,6s e devolvendo
 * 500; com timeout de 12s e 3 tentativas, o gate abortava e registrava ausencia.
 *
 * Agora a leitura passa por lib/sources/pncp-resilient-fetch.ts (19 testes) e a telemetria
 * de cada consulta e empilhada em `sink`, para o gate poder separar "o PNCP nao tem" de
 * "nao conseguimos perguntar".
 */
async function fetchJson(url, options, sink) {
  const page = await resilient.fetchPncpPage(url, {
    retries: options.retries,
    timeoutMs: options.timeoutMs,
    backoffMs: Math.max(options.delayMs, 800),
  });
  if (Array.isArray(sink)) sink.push(page.telemetry);

  if (page.telemetry.outcome === 'failed') {
    const error = new Error(`${page.telemetry.failureKind}: ${page.telemetry.detail}`);
    error.telemetry = page.telemetry;
    throw error;
  }
  return { data: page.data, totalPaginas: page.totalPaginas };
}

function normalizeCnpj(value) {
  return String(value || '').replace(/\D/g, '');
}

function asNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getRows(payload) {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
}

function extractPublicationValue(row) {
  return asNumber(
    row.valorTotalEstimado ??
      row.valorTotalHomologado ??
      row.valorEstimado ??
      row.valorGlobal
  );
}

function extractPublicationOutcomeValue(row) {
  return asNumber(row?.valorTotalHomologado);
}

function extractContractValue(row) {
  return asNumber(row.valorGlobal ?? row.valorInicial ?? row.valorTotal ?? row.valorContrato);
}

function extractPurchaseControl(row) {
  return (
    row?.numeroControlePNCP ||
    row?.numeroControlePncpCompra ||
    row?.numeroControlePNCPCompra ||
    row?.numeroControlePNCPContratacao ||
    ''
  );
}

function extractContractControl(row) {
  return row?.numeroControlePNCP || row?.numeroControlePncp || '';
}

function extractSequential(row) {
  const value =
    row?.sequencialCompra ??
    row?.sequencialContratacao ??
    row?.compraSequencial;
  return value === null || value === undefined || value === '' ? '' : String(value);
}

function scorePublication(row, edital) {
  let score = 0;
  const rowCnpj = normalizeCnpj(row?.orgaoEntidade?.cnpj ?? row?.orgaoEntidade?.cnpjOrgao);

  if (edital.cnpjOrgao && rowCnpj === normalizeCnpj(edital.cnpjOrgao)) score += 4;
  if (String(row?.unidadeOrgao?.codigoMunicipioIbge || '') === edital.codigoMunicipioIbge) score += 2;

  const rowValue = extractPublicationValue(row);
  if (rowValue && edital.valorEstimado) {
    const delta = Math.abs(rowValue - edital.valorEstimado) / edital.valorEstimado;
    if (delta <= 0.02) score += 4;
    else if (delta <= 0.15) score += 2;
  }

  const object = String(row.objetoCompra || row.objeto || '').toLowerCase();
  const org = String(edital.orgao || '').toLowerCase();
  if (object.includes('obra') || object.includes('engenharia') || object.includes('construcao')) score += 1;
  if (org.includes('ceasa') && object.includes('ceasa')) score += 1;

  return score;
}

function pickBestPublication(rows, edital) {
  let best = null;

  for (const row of rows) {
    const score = scorePublication(row, edital);
    if (!best || score > best.score) {
      best = { row, score };
    }
  }

  return best && best.score >= 3 ? best : null;
}

function pickOutcome(rows, edital, publicationRow) {
  const values = rows
    .map((row) => ({ row, value: extractContractValue(row) }))
    .filter((item) => item.value !== null);

  if (values.length === 0) return null;

  const publicationControl = extractPurchaseControl(publicationRow);
  if (publicationControl) {
    const exact = values.find(
      (item) =>
        extractPurchaseControl(item.row) === publicationControl ||
        extractContractControl(item.row) === publicationControl
    );
    if (exact) {
      return {
        ...exact,
        matchMethod: 'numeroControlePNCP',
        preliminary: false,
      };
    }
  }

  const publicationSequential = extractSequential(publicationRow);
  if (publicationSequential) {
    const exact = values.find(
      (item) => extractSequential(item.row) && extractSequential(item.row) === publicationSequential
    );
    if (exact) {
      return {
        ...exact,
        matchMethod: 'sequencial',
        preliminary: false,
      };
    }
  }

  if (!edital.valorEstimado) {
    const fallback = values.sort((a, b) => b.value - a.value)[0];
    return {
      ...fallback,
      matchMethod: 'aproximacao_cnpj_sem_valor_estimado',
      preliminary: true,
    };
  }

  const fallback = values
    .map((item) => ({
      ...item,
      delta: Math.abs(item.value - edital.valorEstimado) / edital.valorEstimado,
    }))
    .sort((a, b) => a.delta - b.delta)[0];

  return {
    ...fallback,
    matchMethod: 'aproximacao_valor_cnpj',
    preliminary: true,
  };
}

async function collectPublication(edital, options) {
  const byCnpj = edital.cnpjOrgao
    ? buildUrl('contratacoes/publicacao', {
        dataInicial: edital.dataInicial,
        dataFinal: edital.dataFinal,
        codigoModalidadeContratacao: edital.modalidade,
        cnpj: edital.cnpjOrgao,
        pagina: 1,
        tamanhoPagina: 50,
      })
    : null;

  const byMunicipio = buildUrl('contratacoes/publicacao', {
    dataInicial: edital.dataInicial,
    dataFinal: edital.dataFinal,
    codigoModalidadeContratacao: edital.modalidade,
    codigoMunicipioIbge: edital.codigoMunicipioIbge,
    pagina: 1,
    tamanhoPagina: 50,
  });

  const payloads = [];
  const errors = [];
  if (byCnpj) {
    try {
      payloads.push({ source: 'cnpj', url: byCnpj, payload: await fetchJson(byCnpj, options, options.telemetrySink) });
    } catch (error) {
      errors.push(`publicacao:cnpj:${error.message}`);
    }
    await sleep(options.delayMs);
  }

  try {
    payloads.push({
      source: 'codigoMunicipioIbge',
      url: byMunicipio,
      payload: await fetchJson(byMunicipio, options, options.telemetrySink),
    });
  } catch (error) {
    errors.push(`publicacao:codigoMunicipioIbge:${error.message}`);
  }

  const rows = payloads.flatMap((item) =>
    getRows(item.payload).map((row) => ({ ...row, __source: item.source, __url: item.url.toString() }))
  );

  return {
    rows,
    best: pickBestPublication(rows, edital),
    errors,
  };
}

async function collectOutcome(edital, options, publicationRow) {
  const publicationOutcomeValue = extractPublicationOutcomeValue(publicationRow);
  if (publicationOutcomeValue !== null) {
    return {
      rows: [],
      best: {
        row: publicationRow,
        value: publicationOutcomeValue,
        matchMethod: 'publicacao_valorTotalHomologado',
        preliminary: false,
      },
      url: publicationRow?.__url || null,
    };
  }

  if (!edital.cnpjOrgao) return { rows: [], best: null, url: null };

  const url = buildUrl('contratos', {
    dataInicial: edital.dataInicial,
    dataFinal: '20260531',
    cnpjOrgao: edital.cnpjOrgao,
    pagina: 1,
    tamanhoPagina: 500,
  });

  const payload = await fetchJson(url, options, options.telemetrySink);
  const rows = getRows(payload);

  return {
    rows,
    best: pickOutcome(rows, edital, publicationRow),
    url: url.toString(),
  };
}

async function run(options) {
  if (options.dryRun) {
    console.log(`Noyce Stage 2 dry-run: ${EDITAIS.length} editais`);
    for (const edital of EDITAIS) {
      console.log(
        `- ${edital.edital}: municipio=${edital.codigoMunicipioIbge} cnpj=${edital.cnpjOrgao || 'MISSING'} modalidade=${edital.modalidade} janela=${edital.dataInicial}-${edital.dataFinal} valorEstimado=${edital.valorEstimado ?? 'MISSING'}`
      );
    }
    return;
  }

  fs.mkdirSync(options.outputDir, { recursive: true });

  const results = [];

  for (const edital of EDITAIS) {
    process.stdout.write(`Running ${edital.edital}... `);
    // Telemetria por edital: zerada a cada iteracao para o veredito refletir SO as
    // consultas deste edital.
    options.telemetrySink = [];

    try {
      const publication = await collectPublication(edital, options);
      await sleep(options.delayMs);
      let outcome;
      const errors = [...publication.errors];
      try {
        outcome = await collectOutcome(edital, options, publication.best?.row);
      } catch (error) {
        errors.push(`contratos:cnpjOrgao:${error.message}`);
        outcome = { rows: [], best: null, url: null };
      }

      // VEREDITO DE COBERTURA (13/Ago) — a correcao conceitual do gate.
      // `unknown` = as consultas falharam, entao nao sabemos se o PNCP tem ou nao.
      // Contar isso como ausencia media a NOSSA rede, nao a cobertura do PNCP.
      const queryOutcome = resilient.judgeCoverage(Boolean(publication.best), options.telemetrySink || []);

      const publicationValue = publication.best ? extractPublicationValue(publication.best.row) : null;
      const outcomeValue = outcome.best ? outcome.best.value : null;
      const mape =
        edital.valorEstimado && outcomeValue
          ? Math.abs(outcomeValue - edital.valorEstimado) / edital.valorEstimado
          : null;

      results.push({
        edital: edital.edital,
        orgao: edital.orgao,
        municipio: edital.municipio,
        plataforma: edital.plataforma,
        metadataCompleta: Boolean(edital.cnpjOrgao && edital.valorEstimado),
        metadataNotes: edital.metadataNotes || '',
        achado: Boolean(publication.best),
        queryOutcome,
        queryAttempts: (options.telemetrySink || []).reduce((sum, entry) => sum + entry.attempts, 0),
        queryFailures: (options.telemetrySink || []).filter((entry) => entry.outcome === 'failed').length,
        discoverySource: publication.best?.row.__source || '',
        discoveryCandidates: publication.rows.length,
        discoveryScore: publication.best?.score ?? '',
        vencedor: Boolean(outcome.best),
        valorEstimado: edital.valorEstimado,
        valorPublicacao: publicationValue,
        valorHomologado: outcomeValue,
        mape,
        mapePreliminar: Boolean(outcome.best?.preliminary && mape !== null),
        outcomeMatchMethod: outcome.best?.matchMethod || '',
        pncpCompraId:
          extractPurchaseControl(publication.best?.row) ||
          publication.best?.row.numeroCompra ||
          '',
        pncpContratoId: extractContractControl(outcome.best?.row),
        fornecedor:
          outcome.best?.row.nomeRazaoSocialFornecedor ||
          outcome.best?.row.nomeFornecedor ||
          '',
        fonte: publication.best?.row.__url || outcome.url || '',
        error: errors.join('; '),
      });

      console.log('ok');
    } catch (error) {
      results.push({
        edital: edital.edital,
        orgao: edital.orgao,
        municipio: edital.municipio,
        plataforma: edital.plataforma,
        metadataCompleta: Boolean(edital.cnpjOrgao && edital.valorEstimado),
        metadataNotes: edital.metadataNotes || '',
        achado: false,
        // Excecao no fluxo = nao conseguimos concluir a consulta. Nunca afirmar ausencia.
        queryOutcome: 'unknown',
        queryAttempts: (options.telemetrySink || []).reduce((sum, entry) => sum + entry.attempts, 0),
        queryFailures: (options.telemetrySink || []).filter((entry) => entry.outcome === 'failed').length,
        discoverySource: '',
        discoveryCandidates: 0,
        discoveryScore: '',
        vencedor: false,
        valorEstimado: edital.valorEstimado,
        valorPublicacao: null,
        valorHomologado: null,
        mape: null,
        mapePreliminar: false,
        outcomeMatchMethod: '',
        pncpCompraId: '',
        pncpContratoId: '',
        fornecedor: '',
        fonte: '',
        error: error.message,
      });
      console.log(`failed: ${error.message}`);
    }

    await sleep(options.delayMs);
  }

  writeOutputs(results, options.outputDir);
}

function summarize(results) {
  const total = results.length;
  const found = results.filter((row) => row.achado).length;
  const outcomeBase = results.filter((row) => row.achado);
  const outcomes = outcomeBase.filter((row) => row.vencedor).length;
  const exactOutcomeRows = results.filter((row) => row.vencedor && !row.mapePreliminar).length;
  const mapeRows = results.filter((row) => row.mape !== null && Number.isFinite(row.mape));
  const preliminaryMapeRows = mapeRows.filter((row) => row.mapePreliminar);
  const avgMape =
    mapeRows.length > 0
      ? mapeRows.reduce((sum, row) => sum + row.mape, 0) / mapeRows.length
      : null;
  const incompleteMetadata = results.filter((row) => !row.metadataCompleta).length;

  // COBERTURA COM DENOMINADOR HONESTO (13/Ago).
  // `unknown` = a consulta nunca voltou. Mante-lo no denominador faz a metrica medir a
  // estabilidade do PNCP e a nossa rede em vez de medir se o edital esta publicado la.
  // Reportamos as duas: `coverage` (so o que foi respondido) e `coverageRaw` (a antiga).
  const unknown = results.filter((row) => row.queryOutcome === 'unknown').length;
  const notPublished = results.filter((row) => row.queryOutcome === 'not_published').length;
  const answered = total - unknown;
  const coverage = answered > 0 ? found / answered : 0;
  const coverageRaw = found / total;
  const outcomeHitRate = outcomeBase.length > 0 ? outcomes / outcomeBase.length : 0;
  const passesCoverage = coverage >= 0.5;
  const passesOutcome = outcomeHitRate >= 0.5;
  const passesMape = avgMape !== null && avgMape <= 0.15;
  const thresholdPass = passesCoverage && passesOutcome && passesMape;
  const recommendation =
    thresholdPass && preliminaryMapeRows.length === 0
      ? 'GO'
      : thresholdPass
        ? 'PIVOT'
        : 'PIVOT_OR_KILL';

  return {
    total,
    found,
    // Decomposicao do que antes era so "nao achado".
    answered,
    notPublished,
    unknown,
    outcomes,
    exactOutcomeRows,
    incompleteMetadata,
    preliminaryMapeRows: preliminaryMapeRows.length,
    coverage,
    coverageRaw,
    outcomeHitRate,
    avgMape,
    thresholds: {
      coverage: 0.5,
      outcomeHitRate: 0.5,
      avgMapeMax: 0.15,
    },
    passes: {
      coverage: passesCoverage,
      outcomeHitRate: passesOutcome,
      avgMape: passesMape,
    },
    recommendation,
  };
}

function writeOutputs(results, outputDir) {
  const csvPath = path.join(outputDir, 'stage2-coverage-resultado.csv');
  const jsonPath = path.join(outputDir, 'stage2-coverage-summary.json');
  const summary = summarize(results);

  fs.writeFileSync(csvPath, toCsv(results), 'utf8');
  fs.writeFileSync(jsonPath, JSON.stringify({ summary, results }, null, 2), 'utf8');

  console.log(`CSV: ${csvPath}`);
  console.log(`JSON: ${jsonPath}`);
  console.log(JSON.stringify(summary, null, 2));
}

function toCsv(rows) {
  const headers = [
    'edital',
    'achado',
    'query_outcome',
    'query_attempts',
    'query_failures',
    'modalidade_usada',
    'vencedor',
    'valor_homologado',
    'mape',
    'fonte',
    'metadata_completa',
    'discovery_candidates',
    'discovery_score',
    'fornecedor',
    'outcome_match_method',
    'mape_preliminar',
    'pncp_compra_id',
    'pncp_contrato_id',
    'metadata_notes',
    'error',
  ];

  const lines = [headers.join(',')];

  for (const row of rows) {
    lines.push(
      [
        row.edital,
        row.achado ? 's' : 'n',
        row.queryOutcome,
        row.queryAttempts,
        row.queryFailures,
        row.discoverySource,
        row.vencedor ? 's' : 'n',
        formatNumber(row.valorHomologado),
        formatNumber(row.mape),
        row.fonte,
        row.metadataCompleta ? 's' : 'n',
        row.discoveryCandidates,
        row.discoveryScore,
        row.fornecedor,
        row.outcomeMatchMethod,
        row.mapePreliminar ? 's' : 'n',
        row.pncpCompraId,
        row.pncpContratoId,
        row.metadataNotes,
        row.error,
      ]
        .map(csvEscape)
        .join(',')
    );
  }

  return `${lines.join('\n')}\n`;
}

function formatNumber(value) {
  if (value === null || value === undefined || value === '') return '';
  return Number.isFinite(value) ? String(value) : '';
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  // Modulo TS/ESM testado (19 testes) carregado dinamicamente a partir deste script CJS.
  resilient = await import(
    new URL('../../apps/noyce/lib/sources/pncp-resilient-fetch.ts', `file://${__filename.replace(/\\/g, '/')}`).href
  );
  await run(options);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
