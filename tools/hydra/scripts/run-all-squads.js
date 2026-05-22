#!/usr/bin/env node
/**
 * run-all-squads.js
 * Orchestrates 36 sequential HYDRA runs, one per squad.
 * Each run uses a squad-specific config dir with targeted sources,
 * keywords, and forced_routes for the squad's clones.
 *
 * Usage:
 *   node tools/hydra/scripts/run-all-squads.js
 *   node tools/hydra/scripts/run-all-squads.js --resume squad-design  # continue from squad
 *   node tools/hydra/scripts/run-all-squads.js --only squad-ai        # run only one
 *   node tools/hydra/scripts/run-all-squads.js --dry-run              # simulate
 *
 * Output:
 *   docs/projects/aios-evolution/02-departments/per-squad-runs/{squad}/
 *     - sources.yaml         (squad-specific config used)
 *     - run.log              (full pipeline output)
 *     - digest.md            (distribution digest)
 *     - summary.md           (auto-generated top insights)
 *
 * Strategy:
 * - Each squad has its own sources subset (filtered from base sources.yaml + targeted additions)
 * - Cache layer SQLite is GLOBAL across runs (intentional — avoids re-processing same items)
 * - Sources NEW to each squad will fetch fresh content
 * - Sources OVERLAPPING with prior runs will skip-as-duplicate (expected)
 */

import { execSync, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HYDRA_ROOT = resolve(__dirname, '..');
const PROJECT_ROOT = resolve(HYDRA_ROOT, '../..');
const BASE_CONFIG = join(HYDRA_ROOT, 'src/config');
const SQUAD_CONFIGS = join(HYDRA_ROOT, 'configs/squads');
const OUTPUT_ROOT = join(PROJECT_ROOT, 'docs/projects/aios-evolution/02-departments/per-squad-runs');
const HYDRA_BIN = join(HYDRA_ROOT, 'bin/hydra.js');

// ============================================================================
// SQUAD MAPPING (36 squads → domain + clones + keywords boost + sources targeted)
// ============================================================================

const SQUADS = [
  // ─── Squad-* novos (21) ────────────────────────────────────────────────
  {
    name: 'squad-ai',
    domain: 'ai-ml',
    clones: ['ilya-sutskever', 'yann-lecun', 'demis-hassabis', 'fei-fei-li', 'architect', 'dev', 'aios-master'],
    keywords: ['agent architecture', 'LLM orchestration', 'multi-agent', 'AI safety', 'alignment', 'AGI', 'AI engineering'],
    sources: [
      { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml', authority: 5 },
      { name: 'ArXiv AI (cs.AI)', url: 'http://export.arxiv.org/rss/cs.AI', authority: 4 },
      { name: 'Lilian Weng Blog', url: 'https://lilianweng.github.io/index.xml', authority: 5 },
      { name: 'Sebastian Raschka Magazine', url: 'https://magazine.sebastianraschka.com/feed', authority: 5 },
      { name: 'Latent Space (swyx)', url: 'https://www.latent.space/feed', authority: 5 },
    ],
  },
  {
    name: 'squad-behavioral',
    domain: 'ai-ml',
    clones: ['bj-fogg', 'daniel-kahneman', 'richard-thaler', 'brene-brown'],
    keywords: ['behavioral science', 'cognitive bias', 'habit formation', 'nudge', 'psychology', 'decision making'],
    sources: [
      { name: 'Behavioral Scientist', url: 'https://behavioralscientist.org/feed/', authority: 4 },
      { name: 'The Decision Lab', url: 'https://thedecisionlab.com/feed/', authority: 4 },
      { name: 'Center for Humane Tech', url: 'https://www.humanetech.com/podcast?format=rss', authority: 4 },
    ],
  },
  {
    name: 'squad-community',
    domain: 'marketing',
    clones: ['neil-patel', 'russell-brunson', 'community-manager', 'social-media-manager'],
    keywords: ['community building', 'engagement', 'creator economy', 'social capital', 'forum dynamics'],
    sources: [
      { name: 'Community Roundtable', url: 'https://communityroundtable.com/feed/', authority: 4 },
      { name: 'CMX Hub Blog', url: 'https://cmxhub.com/feed/', authority: 4 },
    ],
  },
  {
    name: 'squad-content',
    domain: 'marketing',
    clones: ['joe-pulizzi', 'ann-handley', 'seth-godin', 'copy-specialist', 'seo-content-strategist'],
    keywords: ['content marketing', 'editorial calendar', 'brand voice', 'storytelling', 'long-form', 'distribution'],
    sources: [
      { name: 'Content Marketing Institute', url: 'https://contentmarketinginstitute.com/feed/', authority: 5 },
      { name: 'Animalz Blog', url: 'https://www.animalz.co/blog/feed/', authority: 5 },
      { name: 'HubSpot Marketing Blog', url: 'https://blog.hubspot.com/marketing/rss.xml', authority: 4 },
    ],
  },
  {
    name: 'squad-customer-success',
    domain: 'customer-ops',
    clones: ['lincoln-murphy', 'nick-mehta', 'customer-success-manager', 'retention-specialist', 'churn-prevention'],
    keywords: ['customer success', 'churn', 'retention', 'NPS', 'health score', 'onboarding', 'expansion'],
    sources: [
      { name: 'ChurnZero Blog', url: 'https://churnzero.com/blog/feed/', authority: 4 },
      { name: 'Gainsight Blog', url: 'https://www.gainsight.com/feed/', authority: 4 },
      { name: 'Customer Success Magazine', url: 'https://customersuccessm.com/feed/', authority: 3 },
    ],
  },
  {
    name: 'squad-data',
    domain: 'engenharia',
    clones: ['joe-reis', 'chip-huyen', 'data-engineer', 'analytics-agent'],
    keywords: ['data engineering', 'ETL', 'ELT', 'data warehouse', 'data lake', 'lakehouse', 'dbt', 'airflow', 'spark', 'kafka', 'streaming'],
    sources: [
      { name: 'Joe Reis Practical Data', url: 'https://practicaldataeng.substack.com/feed', authority: 5 },
      { name: 'dbt Labs Blog', url: 'https://www.getdbt.com/feed.xml', authority: 5 },
      { name: 'Tristan Handy Roundup', url: 'https://roundup.getdbt.com/feed', authority: 4 },
      { name: 'Data Engineering Weekly', url: 'https://www.dataengineeringweekly.com/feed', authority: 5 },
    ],
  },
  {
    name: 'squad-design',
    domain: 'design-systems',
    clones: ['brad-frost', 'don-norman', 'dieter-rams', 'design-lead', 'ui-designer', 'ux-designer', 'design-systems-engineer'],
    keywords: ['design system', 'design tokens', 'atomic design', 'component library', 'design ops', 'accessibility', 'WCAG'],
    sources: [
      { name: 'UX Collective', url: 'https://uxdesign.cc/feed', authority: 5 },
      { name: 'A List Apart', url: 'https://alistapart.com/main/feed/', authority: 5 },
      { name: 'Brad Frost', url: 'https://bradfrost.com/blog/feed/', authority: 5 },
      { name: 'Sara Soueidan Blog', url: 'https://www.sarasoueidan.com/feed.xml', authority: 5 },
      { name: 'Refactoring UI', url: 'https://www.refactoringui.com/feed.xml', authority: 5 },
    ],
  },
  {
    name: 'squad-education',
    domain: 'customer-ops',
    clones: ['sal-khan', 'sugata-mitra', 'anders-ericsson', 'onboarding-specialist'],
    keywords: ['edtech', 'instructional design', 'spaced repetition', 'mastery learning', 'deliberate practice', 'cognitive load'],
    sources: [
      { name: 'EdSurge', url: 'https://www.edsurge.com/articles_rss', authority: 4 },
      { name: 'Class Central', url: 'https://www.classcentral.com/report/feed/', authority: 4 },
    ],
  },
  {
    name: 'squad-engineering',
    domain: 'engenharia',
    clones: ['kent-beck', 'martin-fowler', 'uncle-bob-martin', 'linus-torvalds', 'scott-hanselman', 'architect', 'dev', 'devops', 'qa'],
    keywords: ['software architecture', 'refactoring', 'TDD', 'XP', 'clean code', 'system design', 'distributed systems', 'microservices'],
    sources: [
      { name: 'Martin Fowler', url: 'https://martinfowler.com/feed.atom', authority: 5 },
      { name: 'InfoQ', url: 'https://feed.infoq.com/', authority: 5 },
      { name: 'Hacker News - Best', url: 'https://hnrss.org/best', authority: 4 },
      { name: 'High Scalability', url: 'http://highscalability.com/blog/rss.xml', authority: 5 },
    ],
  },
  {
    name: 'squad-executive',
    domain: 'negocios',
    clones: ['warren-buffett', 'ray-dalio', 'morgan-housel', 'ceo', 'cfo', 'cmo'],
    keywords: ['leadership', 'strategy', 'capital allocation', 'org design', 'M&A', 'governance'],
    sources: [
      { name: 'Stratechery', url: 'https://stratechery.com/feed/', authority: 5 },
      { name: 'Lenny\'s Newsletter', url: 'https://www.lennysnewsletter.com/feed', authority: 5 },
      { name: 'a16z Future', url: 'https://future.com/feed/', authority: 4 },
    ],
  },
  {
    name: 'squad-finance',
    domain: 'negocios',
    clones: ['warren-buffett', 'aswath-damodaran', 'morgan-housel', 'david-ebersman', 'cfo'],
    keywords: ['valuation', 'unit economics', 'LTV/CAC', 'pricing', 'SaaS metrics', 'capital efficiency', 'burn rate'],
    sources: [
      { name: 'A Wealth of Common Sense', url: 'https://awealthofcommonsense.com/feed/', authority: 4 },
      { name: 'Damodaran Online', url: 'http://aswathdamodaran.blogspot.com/feeds/posts/default', authority: 5 },
      { name: 'Of Dollars and Data', url: 'https://ofdollarsanddata.com/feed/', authority: 4 },
    ],
  },
  {
    name: 'squad-growth',
    domain: 'marketing',
    clones: ['neil-patel', 'sean-ellis', 'andrew-chen', 'molly-pittman', 'growth-strategist'],
    keywords: ['growth loops', 'PLG', 'virality', 'activation', 'AARRR', 'funnel optimization', 'experimentation'],
    sources: [
      { name: 'Growth.Design', url: 'https://growth.design/feed', authority: 5 },
      { name: 'GrowthHackers', url: 'https://growthhackers.com/posts/rss', authority: 4 },
      { name: 'Reforge Blog', url: 'https://www.reforge.com/blog/rss.xml', authority: 5 },
    ],
  },
  {
    name: 'squad-health',
    domain: 'saude-mental',
    clones: ['halle-tecco', 'sean-duffy', 'atul-butte', 'alison-darcy', 'dena-bravata'],
    keywords: ['digital health', 'mental health', 'SaMD', 'wellbeing', 'telehealth', 'biomarker', 'patient outcomes'],
    sources: [
      { name: 'STAT News', url: 'https://www.statnews.com/feed/', authority: 5 },
      { name: 'MobiHealthNews', url: 'https://www.mobihealthnews.com/feed', authority: 4 },
      { name: 'Rock Health Blog', url: 'https://rockhealth.com/feed/', authority: 5 },
    ],
  },
  {
    name: 'squad-legal',
    domain: 'legal',
    clones: ['lawrence-lessig', 'bakul-patel', 'lucia-savage', 'patricia-peck', 'heather-meeker'],
    keywords: ['privacy law', 'LGPD', 'GDPR', 'IP law', 'compliance', 'data protection', 'contracts'],
    sources: [
      { name: 'IAPP News', url: 'https://iapp.org/news/rss/all', authority: 5 },
      { name: 'EFF Deeplinks', url: 'https://www.eff.org/rss/updates.xml', authority: 5 },
      { name: 'Lawfare', url: 'https://www.lawfaremedia.org/feeds/rss/all-content.rss', authority: 5 },
    ],
  },
  {
    name: 'squad-operations',
    domain: 'negocios',
    clones: ['eliyahu-goldratt', 'gene-kim', 'jez-humble', 'nicole-forsgren', 'will-larson', 'coo'],
    keywords: ['operations excellence', 'lean', 'theory of constraints', 'DORA metrics', 'flow', 'incident response'],
    sources: [
      { name: 'Gene Kim Library', url: 'https://itrevolution.com/feed/', authority: 5 },
      { name: 'StaffEng', url: 'https://staffeng.com/rss.xml', authority: 5 },
      { name: 'Will Larson', url: 'https://lethain.com/feeds/', authority: 5 },
    ],
  },
  {
    name: 'squad-people',
    domain: 'negocios',
    clones: ['patty-mccord', 'laszlo-bock', 'josh-bersin', 'amy-edmondson'],
    keywords: ['talent management', 'high performance teams', 'psychological safety', 'culture', 'compensation', 'org design'],
    sources: [
      { name: 'Josh Bersin Blog', url: 'https://joshbersin.com/feed/', authority: 5 },
      { name: 'First Round Review', url: 'https://review.firstround.com/feed', authority: 5 },
      { name: 'Harvard Business Review Leadership', url: 'https://hbr.org/topic/subject/leadership/rss', authority: 4 },
    ],
  },
  {
    name: 'squad-platform',
    domain: 'engenharia',
    clones: ['werner-vogels', 'charity-majors', 'kelsey-hightower', 'mitchell-hashimoto', 'guillermo-rauch'],
    keywords: ['platform engineering', 'IaC', 'kubernetes', 'observability', 'SRE', 'edge computing', 'serverless'],
    sources: [
      { name: 'Cloud Native Computing Foundation', url: 'https://www.cncf.io/feed/', authority: 5 },
      { name: 'Charity Majors', url: 'https://charity.wtf/feed/', authority: 5 },
      { name: 'Werner Vogels All Things Distributed', url: 'https://www.allthingsdistributed.com/atom.xml', authority: 5 },
    ],
  },
  {
    name: 'squad-product',
    domain: 'product',
    clones: ['marty-cagan', 'teresa-torres', 'julie-zhuo', 'lenny-rachitsky', 'eric-ries', 'pm', 'po', 'sm'],
    keywords: ['product management', 'discovery', 'PRD', 'roadmap', 'OKR', 'product-market fit', 'JTBD'],
    sources: [
      { name: 'Lenny\'s Newsletter', url: 'https://www.lennysnewsletter.com/feed', authority: 5 },
      { name: 'Continuous Discovery (Teresa Torres)', url: 'https://www.producttalk.org/feed/', authority: 5 },
      { name: 'SVPG Articles', url: 'https://www.svpg.com/feed/', authority: 5 },
    ],
  },
  {
    name: 'squad-research',
    domain: 'product',
    clones: ['teresa-torres', 'cassie-kozyrkov', 'audience-researcher', 'market-analyst'],
    keywords: ['UX research', 'user interviews', 'usability', 'survey design', 'qualitative analysis', 'discovery sprints'],
    sources: [
      { name: 'Nielsen Norman Group', url: 'https://www.nngroup.com/feed/articles/', authority: 5 },
      { name: 'ReOps Community', url: 'https://www.researchops.community/feed', authority: 4 },
      { name: 'Tomer Sharon', url: 'https://medium.com/feed/@tsharon', authority: 4 },
    ],
  },
  {
    name: 'squad-sales',
    domain: 'marketing',
    clones: ['grant-cardone', 'jeb-blount', 'chris-voss', 'matt-dixon', 'sales-strategist', 'sales-closer'],
    keywords: ['sales methodology', 'enterprise sales', 'discovery calls', 'negotiation', 'sales enablement', 'MEDDIC'],
    sources: [
      { name: 'Sales Hacker', url: 'https://www.saleshacker.com/feed/', authority: 4 },
      { name: 'Predictable Revenue', url: 'https://predictablerevenue.com/feed', authority: 4 },
      { name: 'Gong Sales Blog', url: 'https://www.gong.io/blog/feed/', authority: 5 },
    ],
  },
  {
    name: 'squad-security',
    domain: 'cybersecurity',
    clones: ['kevin-mitnick', 'bruce-schneier', 'troy-hunt', 'mikko-hypponen', 'daniel-miessler', 'liran-tal'],
    keywords: ['threat modeling', 'CVE', 'OWASP', 'zero-day', 'incident response', 'red team', 'supply chain attack'],
    sources: [
      { name: 'KrebsOnSecurity', url: 'https://krebsonsecurity.com/feed/', authority: 5 },
      { name: 'Schneier on Security', url: 'https://www.schneier.com/feed/atom/', authority: 5 },
      { name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews', authority: 4 },
      { name: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml', authority: 4 },
    ],
  },
  // ─── Legacy (15) ──────────────────────────────────────────────────────
  {
    name: 'ai-science',
    domain: 'ai-ml',
    clones: ['demis-hassabis', 'fei-fei-li', 'yann-lecun', 'ilya-sutskever', 'andrej-karpathy', 'andrew-ng', 'jim-fan'],
    keywords: ['foundation model', 'multimodal', 'reasoning', 'reinforcement learning', 'embodied AI', 'scaling laws'],
    sources: [
      { name: 'DeepMind Blog', url: 'https://deepmind.google/blog/rss.xml', authority: 5 },
      { name: 'Google AI Blog', url: 'https://ai.googleblog.com/feeds/posts/default', authority: 5 },
      { name: 'The Gradient', url: 'https://thegradient.pub/rss/', authority: 4 },
    ],
  },
  {
    name: 'customer-ops',
    domain: 'customer-ops',
    clones: ['lincoln-murphy', 'nick-mehta', 'customer-success-manager', 'customer-support-t1', 'voice-of-customer'],
    keywords: ['customer experience', 'support operations', 'SLA', 'ticketing', 'CSAT', 'voice of customer'],
    sources: [
      { name: 'Intercom Blog', url: 'https://www.intercom.com/blog/feed/', authority: 5 },
      { name: 'Zendesk Blog', url: 'https://www.zendesk.com/blog/feed/', authority: 4 },
    ],
  },
  {
    name: 'design-terapeutico',
    domain: 'saude-mental',
    clones: ['alison-darcy', 'rafael-calvo', 'cathy-pearl', 'bj-fogg'],
    keywords: ['therapeutic UX', 'conversational AI', 'mental health UI', 'patient experience design', 'voice interface'],
    sources: [
      { name: 'Mad in Brazil', url: 'https://madinbrazil.org/feed/', authority: 4 },
      { name: 'Cathy Pearl Medium', url: 'https://medium.com/feed/@cpearl42', authority: 4 },
    ],
  },
  {
    name: 'executive-team',
    domain: 'negocios',
    clones: ['warren-buffett', 'ray-dalio', 'morgan-housel', 'ceo', 'cco', 'coo', 'conclave-coordinator'],
    keywords: ['executive leadership', 'board governance', 'investor relations', 'strategy execution', 'transformation'],
    sources: [
      { name: 'McKinsey Quarterly', url: 'https://www.mckinsey.com/insights/quarterly/rss', authority: 5 },
      { name: 'HBR All Articles', url: 'https://hbr.org/the-latest/rss', authority: 5 },
    ],
  },
  {
    name: 'expert-council',
    domain: 'ai-ml',
    clones: ['conclave-coordinator', 'demis-hassabis', 'martin-fowler', 'werner-vogels', 'marty-cagan', 'eric-ries'],
    keywords: ['advisory frameworks', 'expert consultation', 'cross-functional', 'strategic advisory', 'mentor patterns'],
    sources: [
      { name: 'Simon Willison Blog', url: 'https://simonwillison.net/atom/everything/', authority: 5 },
      { name: 'Eugene Yan Blog', url: 'https://eugeneyan.com/rss/', authority: 5 },
    ],
  },
  {
    name: 'growth',
    domain: 'marketing',
    clones: ['neil-patel', 'sean-ellis', 'andrew-chen', 'molly-pittman', 'depesh-mandalia', 'pedro-sobral'],
    keywords: ['growth marketing', 'paid acquisition', 'CAC', 'creative testing', 'ad fatigue', 'media buying'],
    sources: [
      { name: 'AdExchanger', url: 'https://www.adexchanger.com/feed/', authority: 4 },
      { name: 'Marketing Brew', url: 'https://www.marketingbrew.com/feed', authority: 4 },
    ],
  },
  {
    name: 'health-data',
    domain: 'health-tech',
    clones: ['atul-butte', 'eric-topol', 'micky-tripathi', 'data-engineer'],
    keywords: ['EHR data', 'FHIR', 'clinical data', 'health informatics', 'medical AI', 'genomics data'],
    sources: [
      { name: 'Health IT Analytics', url: 'https://healthitanalytics.com/news/rss.xml', authority: 5 },
      { name: 'NEJM AI', url: 'https://ai.nejm.org/rss.xml', authority: 5 },
    ],
  },
  {
    name: 'health-tech',
    domain: 'health-tech',
    clones: ['halle-tecco', 'sean-duffy', 'kate-ryder', 'atul-butte', 'eric-topol', 'stephen-hahn'],
    keywords: ['digital therapeutics', 'remote monitoring', 'wearables', 'telehealth', 'healthtech investment'],
    sources: [
      { name: 'Rock Health Blog', url: 'https://rockhealth.com/feed/', authority: 5 },
      { name: 'TechCrunch Health', url: 'https://techcrunch.com/category/health/feed/', authority: 4 },
    ],
  },
  {
    name: 'innovation',
    domain: 'ai-ml',
    clones: ['eric-ries', 'werner-vogels', 'ray-dalio', 'peter-diamandis', 'clayton-christensen'],
    keywords: ['disruption theory', 'jobs to be done', 'innovation accounting', 'exponential tech', 'frontier R&D'],
    sources: [
      { name: 'Singularity Hub', url: 'https://singularityhub.com/feed/', authority: 4 },
      { name: 'Future Tools', url: 'https://www.futuretools.io/feeds/news.xml', authority: 4 },
    ],
  },
  {
    name: 'legal',
    domain: 'legal',
    clones: ['lawrence-lessig', 'bakul-patel', 'lucia-savage', 'richard-susskind', 'patricia-peck'],
    keywords: ['legal tech', 'compliance automation', 'access to justice', 'digital health regulation', 'AI law'],
    sources: [
      { name: 'Above the Law', url: 'https://abovethelaw.com/feed/', authority: 4 },
      { name: 'Artificial Lawyer', url: 'https://www.artificiallawyer.com/feed/', authority: 4 },
    ],
  },
  {
    name: 'marketing-ops',
    domain: 'marketing',
    clones: ['scott-brinker', 'patrick-campbell', 'campaign-manager', 'analytics-agent'],
    keywords: ['martech stack', 'attribution', 'marketing automation', 'CDP', 'lead scoring', 'revenue operations'],
    sources: [
      { name: 'Chief Martec', url: 'https://chiefmartec.com/feed/', authority: 5 },
      { name: 'MarTech Today', url: 'https://martech.org/feed/', authority: 4 },
    ],
  },
  {
    name: 'product-research',
    domain: 'product',
    clones: ['teresa-torres', 'julie-zhuo', 'cassie-kozyrkov', 'kat-holmes', 'audience-researcher'],
    keywords: ['product discovery', 'opportunity solution tree', 'inclusive design', 'mixed methods research'],
    sources: [
      { name: 'Product Talk', url: 'https://www.producttalk.org/feed/', authority: 5 },
      { name: 'IDEO Journal', url: 'https://www.ideo.com/feed', authority: 4 },
    ],
  },
  {
    name: 'sales-ops',
    domain: 'marketing',
    clones: ['matt-dixon', 'patrick-campbell', 'sales-ops-analyst', 'pricing-strategist'],
    keywords: ['sales operations', 'forecasting', 'territory planning', 'comp design', 'pipeline analytics'],
    sources: [
      { name: 'SalesOps Foundation', url: 'https://www.salesopsfoundation.org/feed', authority: 4 },
      { name: 'Gong Sales Blog', url: 'https://www.gong.io/blog/feed/', authority: 5 },
    ],
  },
  {
    name: 'therapy',
    domain: 'saude-mental',
    clones: ['alison-darcy', 'acacia-parks', 'johannes-thrul', 'christian-dunker'],
    keywords: ['psychotherapy', 'CBT', 'ACT', 'evidence-based therapy', 'therapeutic alliance', 'digital therapy'],
    sources: [
      { name: 'Psychology Today Therapy', url: 'https://www.psychologytoday.com/intl/rss/therapy', authority: 4 },
      { name: 'APA Psychotherapy', url: 'https://www.apa.org/news/feed', authority: 5 },
    ],
  },
  {
    name: 'traffic-masters',
    domain: 'marketing',
    clones: ['molly-pittman', 'depesh-mandalia', 'kasim-aslam', 'tom-breeze', 'nicholas-kusmich', 'ralph-burns', 'pedro-sobral'],
    keywords: ['paid traffic', 'Meta ads', 'Google ads', 'creative testing', 'CBO', 'ad fatigue', 'YouTube ads'],
    sources: [
      { name: 'Search Engine Land', url: 'https://searchengineland.com/feed', authority: 5 },
      { name: 'Search Engine Journal', url: 'https://www.searchenginejournal.com/feed/', authority: 4 },
      { name: 'Smart Marketer', url: 'https://smartmarketer.com/feed/', authority: 4 },
    ],
  },
];

// ============================================================================
// HELPERS
// ============================================================================

function logMaster(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  console.log(line);
  writeFileSync(join(OUTPUT_ROOT, 'master.log'), line + '\n', { flag: 'a' });
}

function buildSquadConfig(squad) {
  const configDir = join(SQUAD_CONFIGS, squad.name);
  mkdirSync(configDir, { recursive: true });

  // sources.yaml — only squad-specific sources
  const sourcesYaml = `# Auto-generated for ${squad.name}\nsources:\n  rss:\n${squad.sources.map(s => `    - name: "${s.name}"\n      url: "${s.url}"\n      frequency: "daily"\n      domains: ["${squad.domain}"]\n      authority: ${s.authority}\n      max_items: 30`).join('\n\n')}\n`;
  writeFileSync(join(configDir, 'sources.yaml'), sourcesYaml);

  // domains.yaml — single domain with boosted keywords
  const baseDomains = readFileSync(join(BASE_CONFIG, 'domains.yaml'), 'utf-8');
  writeFileSync(join(configDir, 'domains.yaml'), baseDomains); // keep full domains for cross-reference

  // routing.yaml — focus forced_routes on this squad's clones for its domain
  const baseRouting = readFileSync(join(BASE_CONFIG, 'routing.yaml'), 'utf-8');
  writeFileSync(join(configDir, 'routing.yaml'), baseRouting); // keep full routing

  // thresholds.yaml — copy from base
  const baseThresh = readFileSync(join(BASE_CONFIG, 'thresholds.yaml'), 'utf-8');
  writeFileSync(join(configDir, 'thresholds.yaml'), baseThresh);

  // scheduler.yaml — copy
  const baseSched = readFileSync(join(BASE_CONFIG, 'scheduler.yaml'), 'utf-8');
  writeFileSync(join(configDir, 'scheduler.yaml'), baseSched);

  return configDir;
}

function runSquad(squad) {
  const outDir = join(OUTPUT_ROOT, squad.name);
  mkdirSync(outDir, { recursive: true });

  const configDir = buildSquadConfig(squad);
  // mirror config used to output for traceability
  copyFileSync(join(configDir, 'sources.yaml'), join(outDir, 'sources.yaml'));

  const logFile = join(outDir, 'run.log');
  const startedAt = Date.now();
  logMaster(`▶ START ${squad.name} (domain=${squad.domain}, sources=${squad.sources.length})`);

  const env = {
    ...process.env,
    HYDRA_SKIP_VECTOR_STORE: '1',
    NODE_OPTIONS: '--max-old-space-size=4096',
  };

  const result = spawnSync('node', [HYDRA_BIN, 'run', '--config-dir', configDir, '--sources', 'rss', '--verbose'], {
    env,
    encoding: 'utf-8',
    timeout: 30 * 60 * 1000, // 30min max per squad
    maxBuffer: 50 * 1024 * 1024, // 50MB
  });

  writeFileSync(logFile, (result.stdout || '') + '\n---STDERR---\n' + (result.stderr || ''));

  const durationMin = ((Date.now() - startedAt) / 60000).toFixed(1);
  const exitCode = result.status ?? 'timeout';
  logMaster(`◼ END   ${squad.name} (exit=${exitCode}, duration=${durationMin}min)`);

  // capture digest
  try {
    const today = new Date().toISOString().slice(0, 10);
    const digestResult = spawnSync('node', [HYDRA_BIN, 'digest', '--date', today], { encoding: 'utf-8' });
    writeFileSync(join(outDir, 'digest.md'), digestResult.stdout || 'no digest');
  } catch (e) {
    writeFileSync(join(outDir, 'digest.md'), 'digest fetch failed: ' + e.message);
  }

  return { squad: squad.name, exitCode, durationMin };
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const resumeFrom = args.includes('--resume') ? args[args.indexOf('--resume') + 1] : null;
  const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
  const dryRun = args.includes('--dry-run');

  mkdirSync(OUTPUT_ROOT, { recursive: true });

  let queue = SQUADS;
  if (only) {
    queue = SQUADS.filter(s => s.name === only);
    if (queue.length === 0) {
      console.error(`Squad "${only}" not found`);
      process.exit(1);
    }
  } else if (resumeFrom) {
    const idx = SQUADS.findIndex(s => s.name === resumeFrom);
    if (idx === -1) {
      console.error(`Resume squad "${resumeFrom}" not found`);
      process.exit(1);
    }
    queue = SQUADS.slice(idx);
  }

  logMaster(`════ HYDRA per-squad runner started ════`);
  logMaster(`Total squads to run: ${queue.length} of 36`);
  logMaster(`Output: ${OUTPUT_ROOT}`);
  logMaster(`Dry run: ${dryRun}`);

  const results = [];
  for (const squad of queue) {
    if (dryRun) {
      logMaster(`[dry-run] would run ${squad.name}`);
      results.push({ squad: squad.name, exitCode: 'dry-run', durationMin: '0' });
      continue;
    }
    const r = runSquad(squad);
    results.push(r);
  }

  // Write final summary
  const summary = `# Per-Squad Runs Master Summary\n\n**Started:** ${new Date().toISOString()}\n**Total squads:** ${results.length}\n\n| # | Squad | Exit | Duration |\n|---|---|---|---|\n${results.map((r, i) => `| ${i + 1} | ${r.squad} | ${r.exitCode} | ${r.durationMin}min |`).join('\n')}\n`;
  writeFileSync(join(OUTPUT_ROOT, 'MASTER-SUMMARY.md'), summary);
  logMaster(`════ DONE — ${results.length} squads processed ════`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  writeFileSync(join(OUTPUT_ROOT, 'master.log'), `\n[FATAL] ${err.stack}\n`, { flag: 'a' });
  process.exit(1);
});
