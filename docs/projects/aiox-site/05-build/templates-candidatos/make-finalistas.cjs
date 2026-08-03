// make-finalistas.cjs — comparação dos 4 finalistas: linha = altura de scroll, coluna = template.
// Julgar hero contra hero é mais honesto que julgar site inteiro contra site inteiro.
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'shots-finalistas');
const COLS = [
  { id: 'wf-idesignerlite', nome: 'iDesigner Lite', plat: 'Webflow', tema: 'escuro', espinha: 'portfólio', altura: '6.287px', demo: 'https://idesigner-lite-template.webflow.io/' },
  { id: 'wf-conicorn', nome: 'Conicorn', plat: 'Webflow', tema: 'claro no hero', espinha: 'automação IA', altura: '13.962px', demo: 'https://conicorn.webflow.io/' },
  { id: 'fr-stackgrid', nome: 'Stackgrid', plat: 'Framer', tema: 'CLARO', espinha: 'agentes de IA', altura: '8.227px', demo: 'https://stackgrid.framer.website/' },
  { id: 'fr-agenciy', nome: 'Agenciy', plat: 'Framer', tema: 'escuro', espinha: 'agência de marca', altura: '12.852px', demo: 'https://agenciy.framer.website/' },
];
const LINHAS = ['hero', '1,5 telas', '3 telas', '4,5 telas', '6 telas'];

const cabecalho = COLS.map(c => `<th>
  <div class="n">${c.nome}</div>
  <div class="m">${c.plat} · ${c.tema}</div>
  <div class="m">espinha: <b>${c.espinha}</b></div>
  <div class="m">${c.altura}</div>
  <a href="${c.demo}" target="_blank" rel="noopener">ver ao vivo ↗</a>
</th>`).join('');

const linhas = LINHAS.map((rot, i) => {
  const tds = COLS.map(c => {
    const p = `shots-finalistas/${c.id}-live-${i}.png`;
    return fs.existsSync(path.join(__dirname, p))
      ? `<td><img src="${p}" loading="lazy" alt="${c.nome} ${rot}"></td>`
      : `<td class="vazio">—</td>`;
  }).join('');
  return `<tr><th class="rot">${rot}</th>${tds}</tr>`;
}).join('\n');

const regua = [0, 1, 2].map(i => `<img src="shots/00-REGUA-leanware-${i}.png" loading="lazy" alt="leanware ${i}">`).join('');

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>4 finalistas — site Talos</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  :root{--bg:#0e0e10;--surf:#131316;--line:#26262b;--ink:#fafafa;--ink2:#fafafaa8;--ink3:#fafafa7d;--acc:#E9A23B}
  body{background:var(--bg);color:var(--ink);font:15px/1.55 ui-sans-serif,Inter,system-ui,sans-serif;padding:30px 26px 80px}
  h1{font-size:25px;font-weight:800;letter-spacing:-.03em}
  h2{font-size:16px;font-weight:700;margin:34px 0 12px;letter-spacing:-.01em}
  p{color:var(--ink2);max-width:78ch;margin-top:8px}
  .wrap{overflow-x:auto;margin-top:20px;border:1px solid var(--line);border-radius:12px}
  table{border-collapse:collapse;min-width:100%}
  th,td{border:1px solid var(--line);vertical-align:top}
  thead th{background:var(--surf);padding:12px 14px;text-align:left;min-width:330px;position:sticky;top:0;z-index:5}
  .n{font-size:15px;font-weight:700}
  .m{font-size:12px;color:var(--ink3);margin-top:3px}
  thead th a{display:inline-block;margin-top:7px;color:var(--acc);font-size:12px;text-decoration:none}
  thead th a:hover{text-decoration:underline}
  .rot{background:var(--surf);color:var(--ink3);font-size:12px;font-weight:600;padding:10px;
       writing-mode:vertical-rl;transform:rotate(180deg);white-space:nowrap;position:sticky;left:0;z-index:4}
  td{padding:0;background:#000}
  td img{display:block;width:100%;height:auto;cursor:zoom-in}
  .vazio{color:var(--ink3);text-align:center;padding:34px;font-size:13px}
  .regua{display:flex;gap:3px;overflow-x:auto;background:#000;border:1px solid var(--acc);border-radius:12px;padding:3px}
  .regua img{height:240px;width:auto;cursor:zoom-in}
  .nota{border-left:2px solid var(--acc);padding-left:13px;margin-top:18px;font-size:13.5px;color:var(--ink2)}
  #lb{position:fixed;inset:0;background:#000d;display:none;place-items:center;z-index:60;cursor:zoom-out;padding:18px}
  #lb img{max-width:100%;max-height:100%;border-radius:6px}
  #lb.on{display:grid}
</style></head><body>

<h1>Os 4 finalistas, na mesma altura de scroll</h1>
<p>Cada linha é a mesma profundidade de rolagem em todos os quatro. Julgar hero contra hero é mais
honesto do que julgar site inteiro contra site inteiro. Clique para ampliar.</p>

<h2>A régua — leanware.co (a referência que você escolheu)</h2>
<div class="regua">${regua}</div>

<h2>Comparação</h2>
<div class="wrap"><table>
<thead><tr><th class="rot">scroll</th>${cabecalho}</tr></thead>
<tbody>${linhas}</tbody>
</table></div>

<div class="nota">
<b>O que está em jogo, em uma linha por template:</b><br>
<b>iDesigner Lite</b> — escuro, robô 3D (combina com o nome Talos), mas a nav é HOME/ABOUT/<b>WORKS</b>/CONTACT: espinha de portfólio, e não existe portfólio.<br>
<b>Conicorn</b> — o hero diz literalmente <i>"Intelligent Automation for Modern Teams… eliminate manual work"</i>: é o negócio do Talos. Mais alto dos quatro (13.962px).<br>
<b>Stackgrid</b> — discurso certo (<i>"eliminate your manual workflows"</i>) mas é <b>claro</b>, contra a decisão D3, e tem <b>Pricing</b> e <b>Case Studies</b> na nav — duas seções que o projeto proibiu.<br>
<b>Agenciy</b> — o mais bonito de tipografia, mas é agência de marca: nav com <b>Projects</b> e <b>Blog</b>, espinha de portfólio outra vez.<br><br>
⚠️ Framer (Stackgrid, Agenciy) mostra <b>"Made in Framer"</b> no plano grátis e <b>não exporta código</b>.
Webflow (iDesigner, Conicorn) exporta, mas roda em <b>jQuery 3.5.1</b> e o export exige plano pago.
</div>

<div id="lb"><img alt=""></div>
<script>
  const lb = document.getElementById('lb');
  document.querySelectorAll('td img, .regua img').forEach(i => i.onclick = () => {
    lb.querySelector('img').src = i.getAttribute('src'); lb.classList.add('on');
  });
  lb.onclick = () => lb.classList.remove('on');
  addEventListener('keydown', e => e.key === 'Escape' && lb.classList.remove('on'));
</script>
</body></html>`;

fs.writeFileSync(path.join(__dirname, 'galeria-finalistas.html'), html);
const n = fs.readdirSync(DIR).filter(f => f.endsWith('.png') && f.includes('-live-')).length;
console.log(`galeria-finalistas.html — ${COLS.length} colunas × ${LINHAS.length} linhas, ${n} capturas`);
