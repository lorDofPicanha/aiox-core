// One-shot: add 12 missing CRM-relevant clones to jarvis-mind-clone-index.json
// Run: node scripts/temp/add-crm-clones.js
const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(__dirname, '..', '..', '.aios-core', 'data', 'jarvis-mind-clone-index.json');

const newClones = [
  {
    id: 'nick-mehta', name: 'nick-mehta', department: 'aios-agent', source: 'aios-agent',
    role: 'CEO Gainsight — Customer Success Industry Pioneer, NRR/Churn/Expansion Expert',
    keywords: ['customer success','csm','churn','retention','nrr','expansion','onboarding','playbook','qbr','health score','gainsight','saas','b2b','crm','customer','support'],
    frameworks: [], commands: [], filePath: ''
  },
  {
    id: 'lincoln-murphy', name: 'lincoln-murphy', department: 'aios-agent', source: 'aios-agent',
    role: 'Customer Success Strategist — Customer-Centric Growth, Scaling CS, Engagement, Retention',
    keywords: ['customer success','retention','engagement','customer-centric','scaling','onboarding','adoption','churn','health score','playbook','crm','saas','b2b','customer'],
    frameworks: [], commands: [], filePath: ''
  },
  {
    id: 'patrick-campbell', name: 'patrick-campbell', department: 'aios-agent', source: 'aios-agent',
    role: 'CEO ProfitWell — SaaS Pricing & Retention Data Expert, Revenue Operations',
    keywords: ['saas','pricing','retention','revenue','mrr','arr','churn','ltv','cac','payback','revops','profitwell','pricing strategy','willingness-to-pay','wtp','metrics'],
    frameworks: [], commands: [], filePath: ''
  },
  {
    id: 'julie-zhuo', name: 'julie-zhuo', department: 'aios-agent', source: 'aios-agent',
    role: 'Former VP Design Facebook — Product Design Leadership, Manager Path, Building Teams',
    keywords: ['design','product','management','leadership','team','manager','feedback','craft','ux','ui','product design','culture'],
    frameworks: [], commands: [], filePath: ''
  },
  {
    id: 'martin-fowler', name: 'martin-fowler', department: 'aios-agent', source: 'aios-agent',
    role: 'Chief Scientist ThoughtWorks — Software Architecture Patterns, Refactoring, DDD, Microservices',
    keywords: ['architecture','patterns','refactoring','ddd','domain-driven design','microservices','monolith','enterprise','design','solid','clean code','design patterns','agile','xp','tdd','software engineering','typescript','java','api','rest'],
    frameworks: [], commands: [], filePath: ''
  },
  {
    id: 'sarah-drasner', name: 'sarah-drasner', department: 'aios-agent', source: 'aios-agent',
    role: 'Director Engineering Google — Frontend Architecture, Vue/React, DX, SVG Animation',
    keywords: ['frontend','react','vue','next.js','dx','developer experience','svg','animation','css','javascript','typescript','design system','component','accessibility','performance','web'],
    frameworks: [], commands: [], filePath: ''
  },
  {
    id: 'simon-willison', name: 'simon-willison', department: 'aios-agent', source: 'aios-agent',
    role: 'Co-creator Django — Pragmatic Engineering, Datasette, LLMs, Tool Building, Python',
    keywords: ['python','django','llm','ai','tool building','pragmatic engineering','datasette','sqlite','prompt','agent','open source','indie hacker','blog','engineering'],
    frameworks: [], commands: [], filePath: ''
  },
  {
    id: 'guillermo-rauch', name: 'guillermo-rauch', department: 'aios-agent', source: 'aios-agent',
    role: 'CEO Vercel — Next.js Creator, Edge Computing, DX, Frontend Cloud',
    keywords: ['vercel','next.js','react','edge','frontend','dx','serverless','deployment','ssr','isr','app router','server components','typescript','javascript','cloud','performance'],
    frameworks: [], commands: [], filePath: ''
  },
  {
    id: 'paul-copplestone', name: 'paul-copplestone', department: 'aios-agent', source: 'aios-agent',
    role: 'CEO Supabase — Open Source Firebase Alternative, Postgres, RLS, Realtime, Auth',
    keywords: ['supabase','postgres','postgresql','rls','row-level security','realtime','auth','auth0','firebase','open source','multi-tenant','edge function','database','backend-as-a-service','baas'],
    frameworks: [], commands: [], filePath: ''
  },
  {
    id: 'patty-mccord', name: 'patty-mccord', department: 'aios-agent', source: 'aios-agent',
    role: 'Former Chief Talent Officer Netflix — High-Performance Culture, Hiring, Feedback, Remote',
    keywords: ['culture','hiring','team','performance','feedback','netflix','remote','leadership','talent','firing','compensation','high-performance','candor'],
    frameworks: [], commands: [], filePath: ''
  },
  {
    id: 'patricia-peck', name: 'patricia-peck', department: 'aios-agent', source: 'aios-agent',
    role: 'Brazilian Digital Law Pioneer — LGPD, ANPD, CDC, Compliance, Data Privacy BR',
    keywords: ['lgpd','anpd','gdpr','privacy','privacidade','compliance','cdc','codigo defesa consumidor','direito digital','data protection','dpo','encarregado','ropa','dpa','consent','consentimento','brasil','brazil','legal','contracts'],
    frameworks: [], commands: [], filePath: ''
  },
  {
    id: 'heather-meeker', name: 'heather-meeker', department: 'aios-agent', source: 'aios-agent',
    role: 'Tech Transactions Lawyer — SaaS Contracts, OSS Licensing, IP, B2B Agreements',
    keywords: ['saas','contracts','licensing','open source','oss','license','copyright','ip','intellectual property','b2b','terms of service','tos','privacy policy','msa','dpa','agreement','legal'],
    frameworks: [], commands: [], filePath: ''
  }
];

const idx = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));
const existing = new Set(idx.map(c => c.id));

let added = 0;
for (const c of newClones) {
  if (!existing.has(c.id)) {
    idx.push(c);
    added++;
    console.log('Added:', c.id);
  } else {
    console.log('Skipped (exists):', c.id);
  }
}

fs.writeFileSync(INDEX_PATH, JSON.stringify(idx, null, 2));
console.log(`\nTotal clones now: ${idx.length} (+${added})`);
