#!/usr/bin/env node
/**
 * Limpeza v3 — corrige os falsos-matches da v2:
 *  - fronteira de palavra (\b) em todo termo curto ambiguo
 *  - nicho decidido PELO NOME da marca; bio so desempata
 *  - filtro de espanhol reforcado
 */
const fs = require('fs'); const path = require('path'); const SP = __dirname;
const pool = JSON.parse(fs.readFileSync(path.join(SP, 'validated.json'), 'utf8'));

const ESTABELECIMENTO = /\bpub\b|\bbar\b|barzinho|restaurante|bistr[ôo]|cafeteria|lanchonete|pizzaria|hamburgueria|choperia|food ?truck|buffet|\bhotel\b|pousada|hostel|shopping|open ?mall|\bmall\b|sal[ãa]o de beleza|espa[çc]o de beleza|studio de (beleza|cabelo|cachos)|barbearia|\bspa\b|academia|cl[íi]nica|especialista em cabelos|unidades? - /i;
const MLM = /doterra|d[oô]terra|hinode|herbalife|mary ?kay|\bnatura\b|\bavon\b|botic[áa]rio|jequiti|polishop|omnilife|forever ?living|amway|racco|abelha ?rainha|eudora|\bconsultora?\b|\brevendedora?\b/i;
const INSTITUICAO = /\binstituto\b|\bong\b|associa[çc][ãa]o|funda[çc][ãa]o|igreja|minist[ée]rio|sindicato|projeto social/i;
const ACADEMICO = /\bmsed\b|\bphd\b|\bmsc\b|\bdra?\.\s|prof(a|essor)?\.\s|\bcoach\b|\bterapeuta\b|aromaterapeuta|nutricionista|psic[óo]loga?/i;
const NAOPRODUTO = /logistic|log[íi]stica|transportadora|\bbazar\b|brech[óo]|assessoria|ag[êe]ncia|marketing|contabilidade|corretora|imobili[áa]ria|curadoria de|links? que/i;
const CONTEUDO = /dicas de|receitas de|tudo sobre|mundo do|universo do|apaixonad[ao]s? por|comunidade de|\bclube de\b|em fam[íi]lia$|compras inteligentes/i;
// espanhol / estrangeiro
const ESPANHOL = /\bsin\b|\bcon\b .*\bde\b|porcentaje|\baditivos\b|\bnatural(es)?\b.*\blo\b|\bpor lo\b|\by m[áa]s\b|\bhecho\b|\bnuestr[oa]|\benv[íi]os\b|\bpedidos al\b|puerto rico|argentina|chile\b|paraguay|uruguay|colombia|m[ée]xico|espa[ñn]a/i;

// ---- nicho: termos com fronteira segura ----
const NICHOS = [
  ['musica', /\bluthier\w*|\bviol[ãa]o\b|\bguitarra?s?\b|\bviola\b|\bcavaquinho\b|\bpercuss[ãa]o\b|instrumento musical|\bukulele\b|\bcontrabaixo\b/i],
  ['cutelaria-edc', /\bcutelaria\b|\bfacas?\b|\bcanivetes?\b|\bt[áa]bua de corte\b|\bedc\b|bushcraft|\bmachado\b/i],
  ['joia', /\bjoias?\b|\bj[óo]ias?\b|joalher\w*|ourives\w*|\bprata\b|\b925\b|semi-?joias?\b|bijuteria|\ban[ée]is\b|alian[çc]as?\b/i],
  ['bebida', /cacha[çc]a|alambique|vin[íi]cola|\bvinhos?\b|cervej\w*|\bgin\b|destilaria|\blicor\w*|kombucha|hidromel|espumante|\bchopp\b|\bdrink\b/i],
  ['cosmetico', /cosm[ée]tic\w*|skincare|sabonete|saboaria|perfum\w*|maquiagem|shampoo|[óo]leos? essenci\w*|aromaterapia|\baromas?\b|cachead\w*|\bcrespo\b|dermocosm\w*/i],
  ['pet', /\bpet\b|\bpets\b|coleiras?\b|petiscos?\b|\bra[çc][ãa]o\b|\bc[ãa]es\b|\bgatos\b|\bcachorros?\b/i],
  ['infantil', /brinquedos?\b|montessori\w*|\binfantil\b|\bbeb[êe]s?\b|enxovais?\b|\benxoval\b|\bkids\b|pedag[óo]gic\w*|maternidade/i],
  ['papelaria', /papelaria|\bplanners?\b|cadernos?\b|encaderna\w*|adesivos?\b|\bstickers?\b|convites?\b|scrapbook/i],
  ['movel', /marcenaria|\bm[óo]veis\b|\bm[óo]vel\b|mobili[áa]rio|estofados?\b|poltronas?\b|\bber[çc]o\b|mesa de jantar|\brack\b/i],
  ['couro-bolsa', /\bbolsas?\b|\bcouro\b|marroquin\w*|\bsapatos?\b|sand[áa]lias?\b|cal[çc]ados?\b|chap[ée]us?\b|\bcintos?\b|carteiras?\b|mochilas?\b|\bt[êe]nis\b/i],
  ['casa-deco', /cer[âa]mica|porcelana|\bgr[ée]s\b|\bvelas?\b|aromatizador\w*|difusor\w*|macram[êe]|tape[çc]aria|\btear\b|lumin[áa]rias?\b|vidro soprado|\bresina\b|decora[çc][ãa]o|home ?decor|\bpanos\b|\btecidos?\b/i],
  ['food-gourmet', /chocolat\w*|\bcacau\b|confeit\w*|\bdoces?\b|padaria|panific\w*|fermenta[çc][ãa]o natural|queij\w*|geleias?\b|conservas?\b|\bmel\b|api[áa]rio|azeites?\b|temperos?\b|\bcaf[ée]s?\b|torref\w*|\bbolos?\b|biscoitos?\b|\bp[ãa]es?\b|gourmet|hidromel/i],
  ['moda', /\bmoda\b|fashion|autoral|\bpraia\b|swimwear|croch[êe]|tric[oôõ]t?\b|bordados?\b|alfaiat\w*|\bnoivas?\b|vestidos?\b|camisetas?\b|estampa\w*|lingerie|plus size|\bblusas?\b|\bsaias?\b|\bjeans\b|\bmalha\b|\bternos?\b/i],
];

function classificar(r) {
  const nome = `${r.brand || ''} ${r.ig || ''}`;
  // 1a passada: SO o nome da marca/handle
  for (const [k, re] of NICHOS) if (re.test(nome)) return { nicho: k, base: 'nome' };
  // 2a passada: bio como desempate
  const bio = r.bio || '';
  for (const [k, re] of NICHOS) if (re.test(bio)) return { nicho: k, base: 'bio' };
  return { nicho: r.nicho || 'outro', base: 'herdado' };
}

const aprovados = [], removidos = [];
pool.forEach(r => {
  const blob = `${r.brand || ''} ${r.bio || ''} ${r.ig || ''}`;
  let motivo = null;
  if (ESTABELECIMENTO.test(blob)) motivo = 'estabelecimento de serviço (consumo/atendimento no local)';
  else if (MLM.test(blob)) motivo = 'revenda / MLM de marca de terceiro';
  else if (INSTITUICAO.test(blob)) motivo = 'instituição, não empresa de produto';
  else if (ACADEMICO.test(blob)) motivo = 'pessoa física prestadora de serviço';
  else if (NAOPRODUTO.test(blob)) motivo = 'não vende produto próprio';
  else if (CONTEUDO.test(blob)) motivo = 'perfil de conteúdo/curadoria';
  else if (ESPANHOL.test(blob)) motivo = 'perfil em espanhol — provavelmente não é brasileiro';
  else if ((r.posts || 0) < 60) motivo = `acervo insuficiente (${r.posts} posts)`;
  if (motivo) { removidos.push({ ...r, motivo }); return; }

  const c = classificar(r);
  if (c.nicho !== r.nicho) r.nichoAntes = r.nicho;
  r.nicho = c.nicho; r.nichoBase = c.base;
  aprovados.push(r);
});

aprovados.sort((a, b) => b.score - a.score);
fs.writeFileSync(path.join(SP, 'validated-v3.json'), JSON.stringify(aprovados, null, 1));
fs.writeFileSync(path.join(SP, 'removidos-v3.json'), JSON.stringify(removidos, null, 1));

console.log('pool             :', pool.length);
console.log('removidos        :', removidos.length);
console.log('APROVADOS        :', aprovados.length);
const m = {}; removidos.forEach(r => { const k = r.motivo.replace(/\(\d+ posts\)/, '(N posts)'); m[k] = (m[k] || 0) + 1; });
console.log('\n=== motivos ===');
Object.entries(m).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(String(v).padStart(4), k));
const base = {}; aprovados.forEach(r => base[r.nichoBase] = (base[r.nichoBase] || 0) + 1);
console.log('\nnicho decidido por:', JSON.stringify(base));
console.log('ainda "outro"     :', aprovados.filter(r => r.nicho === 'outro').length);
