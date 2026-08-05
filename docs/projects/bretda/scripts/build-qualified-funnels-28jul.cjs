#!/usr/bin/env node
'use strict';

/**
 * Bretda Meta — build two ICP-specific lead funnels.
 *
 * Default is dry-run. Writes require --execute.
 * Every created campaign, ad set and ad remains PAUSED.
 * Re-runs are idempotent by exact object/form name.
 */

const path = require('path');
const crypto = require('crypto');
const { request } = require(
  'D:/jarvis/mcp-ads-bridge/node_modules/undici',
);

require('D:/jarvis/mcp-ads-bridge/node_modules/dotenv').config({
  path: path.resolve('D:/jarvis/mcp-ads-bridge/.env'),
});

const EXECUTE = process.argv.includes('--execute');
const API_VERSION = 'v21.0';
const GRAPH_BASE = `https://graph.facebook.com/${API_VERSION}`;
const ACCOUNT_ID = `act_${String(
  process.env.META_ADS_ACCOUNT_BRETDA_ID || '381618241134624',
).replace(/^act_/, '')}`;
const USER_TOKEN =
  process.env.META_ADS_ACCOUNT_BRETDA_TOKEN ||
  process.env.META_ADS_ACCESS_TOKEN;
const PAGE_ID = '249440611589045';
const INSTAGRAM_USER_ID = '17841465690590299';
const PRIVACY_URL = 'https://bretda.com.br/politicas-privacidade';

const FORM_BUYER_NAME =
  '[ICP-BUYER] Projeto Residencial — Alta Intencao — 2026-07-28';
const FORM_ARCH_NAME =
  '[ICP-ARCH] Especificacao Profissional — Projeto Ativo — 2026-07-28';
const CAMPAIGN_BUYER_NAME =
  '[ICP-BUYER] Projeto Residencial — Form Qualificado — 2026-07-28';
const CAMPAIGN_ARCH_NAME =
  '[ICP-ARCH] Especificacao Profissional — Form Qualificado — 2026-07-28';
const ADSET_BUYER_NAME =
  '[BUYER] Residencia/Obra Ativa — Geo Premium [35-65]';
const ADSET_ARCH_NAME =
  '[ARCH] Projeto Cliente Ativo — Arquitetura/Interiores [30-60]';
const AD_BUYER_NAME =
  '[BUYER]-AD-Aurora-PreFrame-ProjetoAtivo-2026-07-28';
const AD_ARCH_NAME =
  '[ARCH]-AD-Citrino-PreFrame-Especificacao-2026-07-28';

const SOURCE_CREATIVE_BUYER = '1514278620068728';
const SOURCE_CREATIVE_ARCH = '1456178162274487';

const GEO_CITIES = [
  ['242122', 'Angra dos Reis'],
  ['243550', 'Balneário Camboriú'],
  ['244661', 'Belo Horizonte'],
  ['244754', 'Bento Gonçalves'],
  ['244795', 'Bertioga'],
  ['244887', 'Blumenau'],
  ['245655', 'Bragança Paulista'],
  ['245683', 'Brasília'],
  ['246059', 'Búzios'],
  ['246197', 'Cabo Frio'],
  ['248639', 'Caxias do Sul'],
  ['248896', 'Chapecó'],
  ['250158', 'Criciúma'],
  ['253188', 'Flores da Cunha'],
  ['253249', 'Florianópolis'],
  ['253823', 'Garibaldi'],
  ['254172', 'Gramado'],
  ['254526', 'Guarujá'],
  ['255675', 'Itajaí'],
  ['261275', 'Niterói'],
  ['263483', 'Pelotas'],
  ['266876', 'Ribeirão Preto'],
  ['268284', 'Santana de Parnaíba'],
  ['2685617', 'Xangri-Lá'],
  ['268965', 'São Bernardo do Campo'],
  ['269036', 'São Carlos'],
  ['269661', 'São José do Rio Preto'],
  ['271407', 'Sorocaba'],
  ['274325', 'Vinhedo'],
].map(([key, name]) => ({
  key,
  name,
  country: 'BR',
  distance_unit: 'mile',
}));

const GEO_NEIGHBORHOODS = [
  ['258161', 'Leblon'],
  ['266292', 'Recreio dos Bandeirantes'],
  ['2775032', 'Copacabana'],
  ['2775063', 'Ipanema'],
  ['2775086', 'Itaim Bibi'],
  ['2775146', 'Barra da Tijuca'],
  ['2777009', 'Morumbi'],
  ['2778292', 'Jardim Indianópolis'],
  ['2786409', 'Alphaville Industrial'],
].map(([key, name]) => ({ key, name, country: 'BR' }));

const BUYER_QUESTIONS = [
  {
    type: 'CUSTOM',
    key: 'estagio_ambiente',
    label: 'Em que estágio está o ambiente onde a mesa será instalada?',
    options: [
      { key: 'obra', value: 'Obra ou reforma em andamento' },
      { key: 'ambiente_pronto', value: 'Ambiente pronto para receber a mesa' },
      { key: 'projeto_definido', value: 'Projeto definido, aguardando execução' },
      { key: 'pesquisa', value: 'Ainda estou apenas pesquisando referências' },
    ],
  },
  {
    type: 'CUSTOM',
    key: 'prazo_instalacao',
    label: 'Para quando você pretende ter a mesa instalada?',
    options: [
      { key: '30_dias', value: 'Nos próximos 30 dias' },
      { key: '3_meses', value: 'Nos próximos 3 meses' },
      { key: '4_6_meses', value: 'Daqui a 4 a 6 meses' },
      { key: 'sem_data', value: 'Ainda não tenho uma data definida' },
    ],
  },
  {
    type: 'CUSTOM',
    key: 'decisor',
    label: 'Qual é o seu papel na decisão desta compra?',
    options: [
      { key: 'decisor', value: 'A decisão é minha' },
      { key: 'conjunto', value: 'Decido em conjunto com família ou sócio' },
      { key: 'influenciador', value: 'Apenas indico; outra pessoa decide' },
    ],
  },
  {
    type: 'CUSTOM',
    key: 'medidas',
    label: 'Você já possui as medidas aproximadas do ambiente?',
    options: [
      { key: 'sim', value: 'Sim, já tenho as medidas' },
      { key: 'levantamento', value: 'O arquiteto está levantando as medidas' },
      { key: 'nao', value: 'Ainda não tenho as medidas' },
    ],
  },
  {
    type: 'CUSTOM',
    key: 'investimento',
    label: 'Qual faixa de investimento foi prevista para esta peça sob encomenda?',
    options: [
      { key: 'ate_20k', value: 'Até R$20.000' },
      { key: '20_30k', value: 'De R$20.000 a R$30.000' },
      {
        key: 'acima_30k',
        value: 'Acima de R$30.000 se fizer sentido para o projeto',
      },
      { key: 'nao_definido', value: 'Ainda não defini investimento' },
    ],
  },
];

const ARCH_QUESTIONS = [
  {
    type: 'CUSTOM',
    key: 'tipo_projeto',
    label: 'Para qual tipo de projeto você está especificando?',
    options: [
      { key: 'residencial', value: 'Residencial com cliente ativo' },
      { key: 'condominio', value: 'Condomínio ou área de lazer' },
      { key: 'hospitality', value: 'Hotelaria, clube ou empreendimento' },
      { key: 'sem_projeto', value: 'Ainda não tenho um projeto ativo' },
    ],
  },
  {
    type: 'CUSTOM',
    key: 'fase_projeto',
    label: 'Em qual fase o projeto está?',
    options: [
      { key: 'conceito', value: 'Conceito ou anteprojeto' },
      { key: 'executivo', value: 'Projeto executivo' },
      { key: 'compras', value: 'Especificação e compras' },
      { key: 'sem_cronograma', value: 'Sem cronograma definido' },
    ],
  },
  {
    type: 'CUSTOM',
    key: 'papel_profissional',
    label: 'Qual é o seu papel neste projeto?',
    options: [
      { key: 'titular', value: 'Arquiteto(a) ou designer responsável' },
      { key: 'equipe', value: 'Faço parte da equipe responsável' },
      { key: 'fornecedor', value: 'Sou fornecedor ou parceiro comercial' },
      { key: 'estudante', value: 'Sou estudante ou pesquisador' },
    ],
  },
  {
    type: 'CUSTOM',
    key: 'prazo_especificacao',
    label: 'Quando a mesa precisa estar especificada ou instalada?',
    options: [
      { key: '60_dias', value: 'Nos próximos 60 dias' },
      { key: '3_6_meses', value: 'Entre 3 e 6 meses' },
      { key: '6_12_meses', value: 'Entre 6 e 12 meses' },
      { key: 'sem_data', value: 'Sem data definida' },
    ],
  },
  {
    type: 'CUSTOM',
    key: 'investimento_cliente',
    label: 'Qual faixa o cliente reservou para esta peça sob encomenda?',
    options: [
      { key: 'ate_20k', value: 'Até R$20.000' },
      { key: '20_30k', value: 'De R$20.000 a R$30.000' },
      {
        key: 'acima_30k',
        value: 'Acima de R$30.000 se fizer sentido para o projeto',
      },
      { key: 'nao_validado', value: 'O investimento ainda não foi validado' },
    ],
  },
];

const PII_QUESTIONS = [
  { type: 'FULL_NAME', key: 'full_name' },
  { type: 'PHONE', key: 'phone_number' },
  { type: 'EMAIL', key: 'email' },
];

const BUYER_COPY = {
  message:
    'Este atendimento é para quem já está definindo uma mesa autoral para uma residência, condomínio ou casa de lazer.\n\nA Aurora é produzida sob encomenda no atelier Bretda, em Blumenau, com briefing técnico de ambiente, medidas, madeira e acabamentos. O prazo de produção é de aproximadamente 60 dias.\n\nSe o ambiente já está pronto ou o projeto está em andamento, solicite uma avaliação personalizada. Se você ainda busca apenas referências, conheça primeiro a coleção no site.',
  headline: 'Solicite a avaliação do seu projeto',
  description: 'Peça autoral sob encomenda. Atendimento técnico personalizado.',
  link: 'https://bretda.com.br/colecao/aurora-sinuca',
};

const ARCH_COPY = {
  message:
    'Canal de especificação Bretda para arquitetos e designers com projeto ativo.\n\nDesenvolvemos mesas autorais sob encomenda para residências, condomínios e projetos de hospitalidade, com suporte técnico para dimensões, materiais, acabamentos e cronograma de instalação.\n\nSe existe um cliente e um projeto em andamento, solicite atendimento de especificação. Para pesquisa de referências ou portfólio, consulte primeiro a coleção no site.',
  headline: 'Atendimento para especificação profissional',
  description: 'Suporte técnico Bretda para projetos ativos.',
  link: 'https://bretda.com.br/',
};

function assertConfig() {
  if (!USER_TOKEN) {
    throw new Error('META_ADS_ACCOUNT_BRETDA_TOKEN ausente.');
  }
  if (BUYER_QUESTIONS.length !== 5 || ARCH_QUESTIONS.length !== 5) {
    throw new Error('Cada formulário deve ter exatamente 5 qualificadores.');
  }
  for (const text of [
    BUYER_COPY.message,
    BUYER_COPY.headline,
    ARCH_COPY.message,
    ARCH_COPY.headline,
  ]) {
    if (/R\$\s*\d|a partir de\s+R\$/i.test(text)) {
      throw new Error('Gate sem preço violado no criativo.');
    }
  }
}

async function graphGet(resource, params = {}, token = USER_TOKEN) {
  const query = new URLSearchParams({
    ...params,
    access_token: token,
  }).toString();
  const { statusCode, body } = await request(
    `${GRAPH_BASE}/${resource}?${query}`,
  );
  const data = await body.json();
  if (data.error) {
    throw new Error(
      `GET ${resource} HTTP ${statusCode}: ${data.error.message}`,
    );
  }
  return data;
}

async function graphPost(resource, params, token = USER_TOKEN) {
  if (!EXECUTE) {
    return { dry_run: true, resource, request_id: crypto.randomUUID() };
  }
  const requestId = crypto.randomUUID();
  const form = new URLSearchParams({
    ...params,
    access_token: token,
  }).toString();
  const { statusCode, body } = await request(`${GRAPH_BASE}/${resource}`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form,
  });
  const data = await body.json();
  if (data.error) {
    throw new Error(
      `POST ${resource} HTTP ${statusCode}: ${JSON.stringify(data.error)}`,
    );
  }
  return { ...data, request_id: requestId };
}

async function resolvePageToken() {
  const direct = await graphGet(PAGE_ID, {
    fields: 'id,name,access_token',
  });
  if (direct.access_token) return direct.access_token;

  const pages = await graphGet('me/accounts', {
    fields: 'id,name,access_token,tasks',
    limit: '200',
  });
  const page = (pages.data || []).find((item) => item.id === PAGE_ID);
  if (!page?.access_token) {
    throw new Error('Page Access Token da Bretda indisponível.');
  }
  return page.access_token;
}

async function findByName(resource, name, fields, token = USER_TOKEN) {
  const result = await graphGet(resource, { fields, limit: '200' }, token);
  return (result.data || []).find((item) => item.name === name) || null;
}

async function ensureForm(pageToken, spec) {
  const existing = await findByName(
    `${PAGE_ID}/leadgen_forms`,
    spec.name,
    'id,name,status,is_optimized_for_quality,questions',
    pageToken,
  );
  if (existing) return { ...existing, reused: true };

  const created = await graphPost(
    `${PAGE_ID}/leadgen_forms`,
    {
      name: spec.name,
      locale: 'pt_BR',
      is_optimized_for_quality: 'true',
      block_display_for_non_targeted_viewer: 'true',
      question_page_custom_headline: spec.headline,
      questions: JSON.stringify([...spec.questions, ...PII_QUESTIONS]),
      privacy_policy: JSON.stringify({
        url: PRIVACY_URL,
        link_text: 'Política de Privacidade',
      }),
      follow_up_action_url: spec.followUp,
    },
    pageToken,
  );
  return { ...created, name: spec.name, reused: false };
}

async function ensureCampaign(name) {
  const existing = await findByName(
    `${ACCOUNT_ID}/campaigns`,
    name,
    'id,name,status,objective',
  );
  if (existing) return { ...existing, reused: true };
  const created = await graphPost(`${ACCOUNT_ID}/campaigns`, {
    name,
    objective: 'OUTCOME_LEADS',
    status: 'PAUSED',
    special_ad_categories: JSON.stringify([]),
    is_adset_budget_sharing_enabled: 'false',
  });
  return { ...created, name, status: 'PAUSED', reused: false };
}

async function ensureAdset(campaignId, spec) {
  if (!EXECUTE) {
    return {
      id: `dry-adset-${spec.slug}`,
      name: spec.name,
      status: 'PAUSED',
      reused: false,
    };
  }
  const existing = await findByName(
    `${campaignId}/adsets`,
    spec.name,
    'id,name,status,daily_budget,targeting',
  );
  if (existing) return { ...existing, reused: true };
  const created = await graphPost(`${ACCOUNT_ID}/adsets`, {
    name: spec.name,
    campaign_id: campaignId,
    daily_budget: String(spec.dailyBudgetCents),
    billing_event: 'IMPRESSIONS',
    optimization_goal: 'LEAD_GENERATION',
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    destination_type: 'ON_AD',
    promoted_object: JSON.stringify({ page_id: PAGE_ID }),
    targeting: JSON.stringify(spec.targeting),
    status: 'PAUSED',
  });
  return { ...created, name: spec.name, status: 'PAUSED', reused: false };
}

function patchCreative(source, copy, formId) {
  const objectStorySpec = structuredClone(source.object_story_spec || {});
  objectStorySpec.page_id = PAGE_ID;
  objectStorySpec.instagram_user_id = INSTAGRAM_USER_ID;
  const data = objectStorySpec.link_data || objectStorySpec.video_data;
  if (!data) {
    throw new Error('Creative fonte sem link_data/video_data.');
  }
  data.message = copy.message;
  data.link = copy.link;
  if (objectStorySpec.link_data) {
    data.name = copy.headline;
    data.description = copy.description;
    delete data.title;
    delete data.link_description;
  } else {
    data.title = copy.headline;
    data.link_description = copy.description;
    delete data.name;
    delete data.description;
  }
  data.call_to_action = {
    type: 'GET_QUOTE',
    value: {
      lead_gen_form_id: formId,
      link: copy.link,
    },
  };
  if (Array.isArray(data.child_attachments)) {
    delete data.child_attachments;
  }
  return {
    object_story_spec: objectStorySpec,
    degrees_of_freedom_spec: {
      creative_features_spec: {
        advantage_plus_creative: { enroll_status: 'OPT_OUT' },
      },
    },
  };
}

async function ensureAd(adsetId, spec) {
  if (!EXECUTE) {
    return {
      id: `dry-ad-${spec.slug}`,
      name: spec.name,
      status: 'PAUSED',
      reused: false,
    };
  }
  const existing = await findByName(
    `${adsetId}/ads`,
    spec.name,
    'id,name,status,effective_status,creative',
  );
  if (existing) return { ...existing, reused: true };

  const source = await graphGet(spec.sourceCreativeId, {
    fields: 'id,object_story_spec',
  });
  const creative = patchCreative(source, spec.copy, spec.formId);
  const created = await graphPost(`${ACCOUNT_ID}/ads`, {
    name: spec.name,
    adset_id: adsetId,
    creative: JSON.stringify(creative),
    status: 'PAUSED',
  });
  return { ...created, name: spec.name, status: 'PAUSED', reused: false };
}

async function verifyObject(id, fields) {
  if (!EXECUTE || !id || String(id).startsWith('dry-')) return null;
  return graphGet(id, { fields });
}

async function main() {
  assertConfig();
  const pageToken = await resolvePageToken();
  const waBuyer = encodeURIComponent(
    'Olá, concluí a triagem de projeto residencial da Bretda e quero avançar com a avaliação técnica.',
  );
  const waArch = encodeURIComponent(
    'Olá, concluí a triagem profissional da Bretda e quero avançar com a especificação de um projeto ativo.',
  );

  const forms = {
    buyer: await ensureForm(pageToken, {
      name: FORM_BUYER_NAME,
      headline: 'Conte-nos sobre o ambiente e o momento do seu projeto',
      questions: BUYER_QUESTIONS,
      followUp: `https://wa.me/5547992259554?text=${waBuyer}`,
    }),
    architect: await ensureForm(pageToken, {
      name: FORM_ARCH_NAME,
      headline: 'Conte-nos sobre o projeto que você está especificando',
      questions: ARCH_QUESTIONS,
      followUp: `https://wa.me/5547992259554?text=${waArch}`,
    }),
  };

  if (!EXECUTE) {
    forms.buyer.id = 'dry-form-buyer';
    forms.architect.id = 'dry-form-architect';
  }

  const campaigns = {
    buyer: await ensureCampaign(CAMPAIGN_BUYER_NAME),
    architect: await ensureCampaign(CAMPAIGN_ARCH_NAME),
  };
  if (!EXECUTE) {
    campaigns.buyer.id = 'dry-campaign-buyer';
    campaigns.architect.id = 'dry-campaign-architect';
  }

  const commonGeo = {
    cities: GEO_CITIES,
    neighborhoods: GEO_NEIGHBORHOODS,
    location_types: ['home'],
  };
  const commonPlacements = {
    publisher_platforms: ['facebook', 'instagram'],
    facebook_positions: ['feed', 'story'],
    instagram_positions: ['stream', 'story', 'reels'],
    targeting_automation: { advantage_audience: 0 },
  };

  const adsets = {
    buyer: await ensureAdset(campaigns.buyer.id, {
      slug: 'buyer',
      name: ADSET_BUYER_NAME,
      dailyBudgetCents: 6000,
      targeting: {
        age_min: 35,
        age_max: 65,
        geo_locations: commonGeo,
        ...commonPlacements,
      },
    }),
    architect: await ensureAdset(campaigns.architect.id, {
      slug: 'architect',
      name: ADSET_ARCH_NAME,
      dailyBudgetCents: 4000,
      targeting: {
        age_min: 30,
        age_max: 60,
        geo_locations: commonGeo,
        flexible_spec: [
          {
            industries: [
              {
                id: '6012903126783',
                name: 'Architecture and Engineering',
              },
            ],
            work_positions: [
              { id: '112517512096835', name: 'Interior design' },
              {
                id: '119802204737548',
                name: 'Interior Designer/Owner',
              },
              { id: '133262136711413', name: 'Arquiteta proprietária' },
              { id: '508189742607516', name: 'Arquiteta e Urbanista' },
              {
                id: '545100628965172',
                name: 'Interior Design Consultant',
              },
            ],
          },
        ],
        ...commonPlacements,
      },
    }),
  };
  if (!EXECUTE) {
    adsets.buyer.id = 'dry-adset-buyer';
    adsets.architect.id = 'dry-adset-architect';
  }

  const ads = {
    buyer: await ensureAd(adsets.buyer.id, {
      slug: 'buyer',
      name: AD_BUYER_NAME,
      sourceCreativeId: SOURCE_CREATIVE_BUYER,
      copy: BUYER_COPY,
      formId: forms.buyer.id,
    }),
    architect: await ensureAd(adsets.architect.id, {
      slug: 'architect',
      name: AD_ARCH_NAME,
      sourceCreativeId: SOURCE_CREATIVE_ARCH,
      copy: ARCH_COPY,
      formId: forms.architect.id,
    }),
  };

  const verification = {
    buyerCampaign: await verifyObject(
      campaigns.buyer.id,
      'id,name,status,effective_status,objective',
    ),
    architectCampaign: await verifyObject(
      campaigns.architect.id,
      'id,name,status,effective_status,objective',
    ),
    buyerAdset: await verifyObject(
      adsets.buyer.id,
      'id,name,status,effective_status,daily_budget,targeting',
    ),
    architectAdset: await verifyObject(
      adsets.architect.id,
      'id,name,status,effective_status,daily_budget,targeting',
    ),
    buyerAd: await verifyObject(
      ads.buyer.id,
      'id,name,status,effective_status,creative{id,object_story_spec}',
    ),
    architectAd: await verifyObject(
      ads.architect.id,
      'id,name,status,effective_status,creative{id,object_story_spec}',
    ),
  };

  const result = {
    mode: EXECUTE ? 'EXECUTE' : 'DRY_RUN',
    timestamp: new Date().toISOString(),
    account: ACCOUNT_ID,
    forms,
    campaigns,
    adsets,
    ads,
    verification,
    gates: {
      priceInCreative: false,
      realSourceCreatives: [
        SOURCE_CREATIVE_BUYER,
        SOURCE_CREATIVE_ARCH,
      ],
      allObjectsPaused: true,
      locationTypes: ['home'],
      totalPreparedDailyBudgetBrl: 100,
    },
  };
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`BLOCKED: ${error.message}\n`);
  process.exitCode = 1;
});
