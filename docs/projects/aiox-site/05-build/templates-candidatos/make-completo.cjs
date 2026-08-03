// make-completo.cjs — galeria de cobertura TOTAL: cada template do topo ao rodapé.
// A galeria anterior mostrava 5 paradas fixas e deixava 54,9% do conicorn fora.
const fs = require('fs');
const path = require('path');

const meta = JSON.parse(fs.readFileSync(path.join(__dirname, 'cobertura-completa.json'), 'utf8'));
const NOME = {
  'wf-conicorn': ['Conicorn', 'Webflow', 'automação IA'],
  'fr-stackgrid': ['Stackgrid', 'Framer', 'agentes de IA'],
  'fr-agenciy': ['Agenciy', 'Framer', 'agência de marca'],
  'wf-idesignerlite': ['iDesigner Lite', 'Webflow', 'portfólio'],
};

const blocos = meta.filter(m => !m.erro).map(m => {
  const [nome, plat, espinha] = NOME[m.id] || [m.id, '', ''];
  const lum = m.luminanciaMedia;
  const claro = lum > 0.5;
  const frames = Array.from({ length: m.frames }, (_, i) =>
    `shots-completo/${m.id}-${String(i).padStart(2, '0')}.png`)
    .filter(p => fs.existsSync(path.join(__dirname, p)))
    .map((p, i) => `<figure><img src="${p}" loading="lazy" alt="${nome} tela ${i + 1}"><figcaption>${i + 1}</figcaption></figure>`)
    .join('');
  return `<section>
  <header>
    <h2>${nome}</h2>
    <span class="tag">${plat}</span>
    <span class="tag">espinha: ${espinha}</span>
    <span class="tag ${claro ? 'claro' : 'escuro'}">${claro ? 'CLARO' : 'ESCURO'} · lum ${lum.toFixed(2)} · ${m.paradasClaras}/${m.paradasTotal} paradas claras</span>
    <span class="tag">${m.altura.toLocaleString('pt-BR')}px · ${m.frames} telas</span>
    <a href="${m.demo}" target="_blank" rel="noopener">ao vivo ↗</a>
  </header>
  <div class="tira">${frames}</div>
</section>`;
}).join('\n');

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cobertura completa — 4 finalistas</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  :root{--bg:#0e0e10;--surf:#131316;--line:#26262b;--ink:#fafafa;--ink2:#fafafaa8;--ink3:#fafafa7d;--acc:#E9A23B}
  body{background:var(--bg);color:var(--ink);font:15px/1.55 ui-sans-serif,Inter,system-ui,sans-serif;padding:30px 26px 80px}
  h1{font-size:25px;font-weight:800;letter-spacing:-.03em}
  .sub{color:var(--ink2);max-width:80ch;margin-top:9px}
  .achado{border-left:2px solid var(--acc);padding:10px 0 10px 14px;margin:20px 0 4px;color:var(--ink);max-width:80ch}
  section{margin-top:34px;border:1px solid var(--line);border-radius:12px;background:var(--surf);overflow:hidden}
  section header{display:flex;align-items:center;gap:9px;flex-wrap:wrap;padding:13px 16px}
  h2{font-size:17px;font-weight:700;letter-spacing:-.01em}
  .tag{font-size:11.5px;color:var(--ink3);border:1px solid var(--line);border-radius:5px;padding:3px 8px;white-space:nowrap}
  .tag.claro{border-color:#c9b58a;color:#e8d5aa}
  .tag.escuro{border-color:#3d5a6b;color:#8fb8cf}
  header a{margin-left:auto;color:var(--acc);font-size:12.5px;text-decoration:none}
  header a:hover{text-decoration:underline}
  .tira{display:flex;gap:2px;overflow-x:auto;background:#000;padding-bottom:2px}
  figure{flex:0 0 auto;position:relative}
  figure img{height:300px;width:auto;display:block;cursor:zoom-in}
  figcaption{position:absolute;left:5px;top:5px;background:#000a;color:#fff;font-size:10.5px;
             padding:2px 6px;border-radius:4px;font-variant-numeric:tabular-nums}
  #lb{position:fixed;inset:0;background:#000d;display:none;place-items:center;z-index:60;cursor:zoom-out;padding:18px}
  #lb img{max-width:100%;max-height:100%;border-radius:6px}
  #lb.on{display:grid}
</style></head><body>

<h1>Cobertura completa — os 4 finalistas inteiros</h1>
<p class="sub">Cada tira é o template do topo ao rodapé, uma tela de 1440×900 por quadro. A captura
anterior parava em 5 quadros e deixava mais da metade do Conicorn fora — isto corrige.
Luminância medida no fundo real a cada parada, não estimada no olho.</p>

<p class="achado"><b>O achado:</b> os dois templates com a espinha certa (Conicorn, Stackgrid)
são <b>brancos</b>. Os dois escuros (Agenciy, iDesigner) têm espinha de <b>portfólio</b> — e não
existe portfólio. <b>Nenhum dos quatro atende D3 (escuro) e a proibição de case ao mesmo tempo.</b>
A escolha real é: repintar um site branco, ou reestruturar um site escuro.</p>

${blocos}

<div id="lb"><img alt=""></div>
<script>
  const lb = document.getElementById('lb');
  document.querySelectorAll('.tira img').forEach(i => i.onclick = () => {
    lb.querySelector('img').src = i.getAttribute('src'); lb.classList.add('on');
  });
  lb.onclick = () => lb.classList.remove('on');
  addEventListener('keydown', e => e.key === 'Escape' && lb.classList.remove('on'));
</script>
</body></html>`;

fs.writeFileSync(path.join(__dirname, 'galeria-completa.html'), html);
console.log(`galeria-completa.html — ${meta.filter(m => !m.erro).length} templates, ${meta.reduce((s, m) => s + (m.frames || 0), 0)} telas`);
