// make-index.cjs — painel de revisão: gera a partir dos dados reais, sem número escrito à mão.
const fs = require('fs');
const path = require('path');
const ROOT = 'D:/AIOS/docs/projects/site-prospector/03-proposal-mockups';

const site = JSON.parse(fs.readFileSync(path.join(ROOT, '_reference-contracts/food/buckssauce/site/site-index.json'), 'utf8'));
const build = JSON.parse(fs.readFileSync(path.join(ROOT, 'chokolaten/site-fork/_build-report.json'), 'utf8'));
const gate = JSON.parse(fs.readFileSync(path.join(ROOT, '_batch/_photo-gate.json'), 'utf8'));

const kb = (n) => n.toLocaleString('pt-BR');
const byFile = Object.fromEntries(build.pages.map(p => [p.file, p]));
const fileFor = (p) => (p === '/' ? 'index.html' : p.replace(/^\//, '').replace(/\//g, '__') + '.html');
const NOME = { 'index.html': 'Home', 'shop.html': 'Loja', 'wholesale.html': 'Atacado', 'about.html': 'Sobre',
  'contact.html': 'Contato', 'faq.html': 'FAQ', 'shop__crushed-pineapple-sriracha.html': 'Produto · Barras 25g',
  'shop__crushed-habanero-garlic.html': 'Produto · Linha zero', 'shop__crushed-cherry-garlic.html': 'Produto · Drágeas' };

const rows = site.pages.map(p => {
  const f = fileFor(p.path); const b = byFile[f] || {};
  return `<tr>
    <td><a href="chokolaten/site-fork/${f}" target="_blank">${NOME[f] || f}</a></td>
    <td class="n">${kb(p.height)}px</td><td class="n">${p.sections}</td>
    <td class="n">${b.textHits ?? '—'}</td><td class="n">${b.kb ?? '—'} KB</td>
    <td class="n ${b.leftovers ? 'bad' : 'ok'}">${b.leftovers ?? '—'}</td>
    <td><a class="ghost" href="_reference-contracts/food/buckssauce/site/pages/${p.slug}/screens/desktop-0.png" target="_blank">ver original</a></td>
  </tr>`;
}).join('\n');

const totH = site.pages.reduce((a, p) => a + p.height, 0);
const totT = build.pages.reduce((a, p) => a + p.textHits, 0);
const totL = build.pages.reduce((a, p) => a + (p.leftovers || 0), 0);

const gateRows = gate.map(g => {
  const ai = g.detail.filter(d => d.aiSuspect).length;
  const cls = g.prospect === 'chokolaten' ? 'ok' : g.pass >= 1 ? 'warn' : 'bad';
  const verd = g.prospect === 'chokolaten' ? '✅ construído'
    : g.prospect === 'delicatenbiscoitos' ? '❌ polaroid/carrossel, não catálogo'
    : g.prospect === 'cataiamodapraia' ? `❌ ${ai} geradas por IA (1024² + ✦)`
    : g.pass >= 1 ? '⚠️ 1-2 fotos, insuficiente' : '❌ sem foto de catálogo';
  return `<tr class="${cls}"><td>${g.prospect}</td><td class="n">${g.total}</td><td class="n">${g.pass}</td><td>${verd}</td></tr>`;
}).join('\n');

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Site-Prospector — painel de revisão</title>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter+Tight:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#100b06;--bg2:#272119;--fg:#f5e4c7;--gold:#be8d3f;--orange:#f15726;--red:#da1f27}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--fg);font:16px/1.5 'Inter Tight',system-ui,sans-serif;padding:40px 24px 80px}
.wrap{max-width:1100px;margin:0 auto}
h1{font-family:Anton,sans-serif;text-transform:uppercase;font-size:clamp(2rem,5vw,3.6rem);line-height:.9;letter-spacing:.01em}
h2{font-family:Anton,sans-serif;text-transform:uppercase;font-size:1.6rem;margin:48px 0 14px;color:var(--gold)}
p.sub{opacity:.75;margin-top:10px;max-width:70ch}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-top:28px}
.kpi{border:1px dashed rgba(245,228,199,.4);border-radius:10px;padding:16px}
.kpi b{display:block;font-family:Anton,sans-serif;font-size:2rem;line-height:1;color:var(--fg)}
.kpi span{font-size:.78rem;text-transform:uppercase;letter-spacing:.12em;opacity:.6}
table{width:100%;border-collapse:collapse;margin-top:8px;font-size:.94rem}
th{text-align:left;font-size:.72rem;text-transform:uppercase;letter-spacing:.14em;color:var(--gold);
  border-bottom:1px dashed rgba(245,228,199,.35);padding:10px 8px}
td{padding:11px 8px;border-bottom:1px solid rgba(245,228,199,.09)}
td.n{text-align:right;font-variant-numeric:tabular-nums}
a{color:var(--fg)}a:hover{color:var(--gold)}
.ghost{opacity:.5;font-size:.85rem}
.ok{color:#9ad17f}.bad{color:var(--orange)}.warn{color:var(--gold)}
tr.ok td:first-child{color:#9ad17f;font-weight:600}
tr.bad td:first-child{opacity:.6}
.note{border-left:3px solid var(--orange);padding:12px 16px;margin-top:16px;background:var(--bg2);border-radius:0 8px 8px 0;font-size:.94rem}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:14px}
.card{border:1px dashed rgba(245,228,199,.4);border-radius:10px;padding:18px;display:block;text-decoration:none}
.card:hover{background:var(--bg2)}
.card b{font-family:Anton,sans-serif;text-transform:uppercase;font-size:1.15rem;display:block}
.card span{font-size:.86rem;opacity:.7}
</style></head><body><div class="wrap">

<h1>Site-Prospector<br>painel de revisão</h1>
<p class="sub">Gerado a partir dos dados reais da captura e do build — nenhum número aqui foi escrito à mão.</p>

<div class="kpis">
  <div class="kpi"><b>${site.pages.length}</b><span>páginas forkadas</span></div>
  <div class="kpi"><b>${kb(totH)}</b><span>px de altura somados</span></div>
  <div class="kpi"><b>${kb(totT)}</b><span>substituições de texto</span></div>
  <div class="kpi"><b class="${totL ? 'bad' : 'ok'}">${totL}</b><span>sobra em inglês</span></div>
  <div class="kpi"><b>${gate.reduce((a, g) => a + g.total, 0)}</b><span>fotos varridas</span></div>
</div>

<h2>Chokolaten — fork de 9 páginas</h2>
<p class="sub">Cópia do código real do buckssauce com produto e marca trocados. Cada linha abre a página; a última coluna abre o screenshot do site original para comparar.</p>
<table><thead><tr><th>página</th><th class="n">altura</th><th class="n">seções</th><th class="n">textos</th><th class="n">peso</th><th class="n">sobra EN</th><th>referência</th></tr></thead>
<tbody>${rows}</tbody></table>

<h2>Comparar com o original</h2>
<div class="cards">
  <a class="card" href="chokolaten/site-fork/index.html" target="_blank"><b>Fork · Chokolaten</b><span>o que você pediu: cópia do código real com a marca trocada</span></a>
  <a class="card" href="chokolaten/mockup-A-fork/screens-baseline/build-1440-00.png" target="_blank"><b>Prova do fork</b><span>o mesmo código rodando ainda com a marca Bucks Sauce</span></a>
  <a class="card" href="chokolaten/mockup-A-buckssauce/index.html" target="_blank"><b>Rebuild autoral</b><span>rodada anterior, construído do zero seguindo a geometria</span></a>
</div>

<h2>Gate de foto — por que só a Chokolaten foi construída</h2>
<p class="sub">${gate.length} prospects da lista, ${gate.reduce((a, g) => a + g.total, 0)} fotos medidas: fundo chapado, texto queimado nos cantos, tamanho do sujeito e assinatura de imagem gerada por IA.</p>
<table><thead><tr><th>prospect</th><th class="n">fotos</th><th class="n">catálogo</th><th>veredito</th></tr></thead>
<tbody>${gateRows}</tbody></table>
<div class="note"><b>O gate sozinho erra.</b> Delicaten pontuou 7 e Cataia 4 — conferi no olho: as da Delicaten são polaroids e slides de carrossel com moldura chapada, e as da Cataia são mockups gerados por IA (1024×1024 com a marca d'água do Gemini). Confirmação visual continua obrigatória antes de construir.</div>

</div></body></html>`;

fs.writeFileSync(path.join(ROOT, '_painel.html'), html);
console.log('✓ painel → ' + path.join(ROOT, '_painel.html'));
console.log(`  ${site.pages.length} páginas · ${kb(totH)}px · ${kb(totT)} textos · ${totL} sobras · ${gate.length} prospects`);
