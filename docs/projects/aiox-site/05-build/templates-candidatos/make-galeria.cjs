// make-galeria.cjs — monta galeria.html a partir de shots.json + shots/
const fs = require('fs');
const path = require('path');

const meta = JSON.parse(fs.readFileSync(path.join(__dirname, 'shots.json'), 'utf8'));
const urls = JSON.parse(fs.readFileSync(path.join(__dirname, 'urls.json'), 'utf8'));
const mk = Object.fromEntries(urls.map(u => [u.slug, u.marketplace]));

const ok = meta.filter(m => m.ok);
const falhou = meta.filter(m => !m.ok);

const ordem = { referencia: 0, framer: 1, codigo: 2 };
ok.sort((a, b) => (ordem[a.kind] - ordem[b.kind]) || a.id.localeCompare(b.id));

const rotulo = { referencia: 'RÉGUA', framer: 'Framer · grátis', codigo: 'Código · grátis' };

// templates que entraram nos roundups mas não servem a uma agência de tecnologia
const FORA = { qitchen: 'restaurante' }; // só o que eu conferi na imagem, não por suposição

const cards = ok.map(m => {
  const shots = [0, 1, 2]
    .map(i => `shots/${m.id}-${i}.png`)
    .filter(p => fs.existsSync(path.join(__dirname, p)));
  const thumbs = shots.map((s, i) =>
    `<img src="${s}" loading="lazy" alt="${m.id} scroll ${i}" data-full="${s}">`).join('');
  return `<article class="card" data-kind="${m.kind}" data-id="${m.id}">
  <header>
    <div class="tit">
      <button class="star" title="marcar candidato">☆</button>
      <h2>${m.id.replace(/^00-REGUA-/, '').replace(/^code-/, '')}</h2>
    </div>
    <span class="badge b-${m.kind}">${rotulo[m.kind]}</span>
    ${FORA[m.id] ? `<span class="badge b-fora">fora de escopo · ${FORA[m.id]}</span>` : ''}
  </header>
  <div class="strip">${thumbs}</div>
  <footer>
    <a href="${m.url}" target="_blank" rel="noopener">ver ao vivo ↗</a>
    ${mk[m.id] ? `<a href="${mk[m.id]}" target="_blank" rel="noopener">marketplace ↗</a>` : ''}
    <span class="alt">${m.altura ? m.altura.toLocaleString('pt-BR') + 'px' : ''}</span>
  </footer>
</article>`;
}).join('\n');

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Templates candidatos — site Talos</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  :root{--bg:#0e0e10;--surf:#131316;--line:#26262b;--ink:#fafafa;--ink2:#fafafaa8;--ink3:#fafafa7d;--acc:#E9A23B}
  body{background:var(--bg);color:var(--ink);font:15px/1.5 ui-sans-serif,Inter,system-ui,sans-serif;padding:32px 28px 80px}
  h1{font-size:26px;font-weight:800;letter-spacing:-.03em}
  .sub{color:var(--ink2);margin:8px 0 4px;max-width:70ch}
  .warn{color:var(--ink3);font-size:13px;margin-bottom:22px;max-width:70ch}
  .bar{position:sticky;top:0;z-index:20;background:var(--bg);padding:14px 0;margin-bottom:18px;
       border-bottom:1px solid var(--line);display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .bar button{background:var(--surf);color:var(--ink2);border:1px solid var(--line);border-radius:999px;
       padding:7px 15px;cursor:pointer;font:inherit;font-size:13px}
  .bar button.on{background:var(--acc);color:#0e0e10;border-color:var(--acc);font-weight:600}
  #copiar{margin-left:auto;background:transparent;border-color:var(--acc);color:var(--acc)}
  .grid{display:grid;gap:22px}
  .card{background:var(--surf);border:1px solid var(--line);border-radius:14px;overflow:hidden}
  .card.mark{border-color:var(--acc);box-shadow:0 0 0 1px var(--acc)}
  .card header{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:13px 16px}
  .tit{display:flex;align-items:center;gap:10px}
  .star{background:none;border:0;color:var(--ink3);font-size:19px;cursor:pointer;line-height:1}
  .card.mark .star{color:var(--acc)}
  h2{font-size:15px;font-weight:600;letter-spacing:-.01em}
  .badge{font-size:11px;letter-spacing:.08em;text-transform:uppercase;padding:4px 9px;border-radius:5px;
       border:1px solid var(--line);color:var(--ink3);white-space:nowrap}
  .b-referencia{background:var(--acc);color:#0e0e10;border-color:var(--acc);font-weight:700}
  .b-codigo{border-color:#3d6b52;color:#7fd1a3}
  .b-fora{border-color:#6b3d3d;color:#d18f8f}
  .strip{display:flex;gap:2px;overflow-x:auto;background:#000}
  .strip img{height:280px;width:auto;display:block;cursor:zoom-in;flex:0 0 auto}
  .card footer{display:flex;gap:16px;align-items:center;padding:11px 16px;font-size:13px}
  .card footer a{color:var(--acc);text-decoration:none}
  .card footer a:hover{text-decoration:underline}
  .alt{margin-left:auto;color:var(--ink3);font-size:12px}
  .falhou{margin-top:36px;color:var(--ink3);font-size:13px}
  #lb{position:fixed;inset:0;background:#000d;display:none;place-items:center;z-index:50;cursor:zoom-out;padding:20px}
  #lb img{max-width:100%;max-height:100%;border-radius:8px}
  #lb.on{display:grid}
</style></head><body>
<h1>Templates candidatos — site Talos</h1>
<p class="sub">${ok.length} capturados em ${new Date().toLocaleDateString('pt-BR')}. Cada card mostra 3 alturas de scroll do site ao vivo (1440×900). O primeiro card é o <strong>leanware.co</strong> — a régua que você escolheu.</p>
<p class="warn">Marque com ☆ os que te interessam e clique em “copiar marcados”. Framer = grátis para remix, mas o site vive no Framer (<strong>sem export de código</strong>). Código = você é dono, mas o design de partida é mais simples.</p>
<p class="warn" style="border-left:2px solid var(--acc);padding-left:12px">⚠️ O selo <strong>“Made in Framer”</strong> no canto inferior direito de todas as capturas do Framer é a marca d’água do plano grátis. Tirar exige plano pago de site. Para quem <em>vende</em> construção de site, isso não é detalhe.<br>
⚠️ As capturas são de <strong>1440×900 em 3 alturas de scroll</strong> — não substituem abrir o site. Seis templates precisaram de recaptura porque a intro animada deles demorava mais que a espera inicial e saíam pretos.</p>

<div class="bar">
  <button data-f="todos" class="on">todos</button>
  <button data-f="framer">Framer</button>
  <button data-f="codigo">código</button>
  <button data-f="mark">☆ marcados</button>
  <button id="copiar">copiar marcados</button>
</div>

<div class="grid">
${cards}
</div>

${falhou.length ? `<p class="falhou">Não capturaram (${falhou.length}): ${falhou.map(f => f.id).join(', ')}</p>` : ''}

<div id="lb"><img alt=""></div>
<script>
  const LS = 'talos-templates-marcados';
  const marcados = new Set(JSON.parse(localStorage.getItem(LS) || '[]'));
  const salvar = () => localStorage.setItem(LS, JSON.stringify([...marcados]));

  document.querySelectorAll('.card').forEach(c => {
    if (marcados.has(c.dataset.id)) c.classList.add('mark');
    c.querySelector('.star').onclick = () => {
      c.classList.toggle('mark');
      c.classList.contains('mark') ? marcados.add(c.dataset.id) : marcados.delete(c.dataset.id);
      salvar();
    };
  });

  document.querySelectorAll('.bar [data-f]').forEach(b => b.onclick = () => {
    document.querySelectorAll('.bar [data-f]').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    const f = b.dataset.f;
    document.querySelectorAll('.card').forEach(c => {
      const vis = f === 'todos' ? true
        : f === 'mark' ? c.classList.contains('mark')
        : c.dataset.kind === f || c.dataset.kind === 'referencia';
      c.style.display = vis ? '' : 'none';
    });
  });

  document.getElementById('copiar').onclick = async () => {
    const txt = [...marcados].join(', ') || '(nenhum marcado)';
    await navigator.clipboard.writeText(txt);
    document.getElementById('copiar').textContent = 'copiado: ' + txt.slice(0, 40);
  };

  const lb = document.getElementById('lb');
  document.querySelectorAll('.strip img').forEach(i => i.onclick = () => {
    lb.querySelector('img').src = i.dataset.full; lb.classList.add('on');
  });
  lb.onclick = () => lb.classList.remove('on');
  addEventListener('keydown', e => e.key === 'Escape' && lb.classList.remove('on'));
</script>
</body></html>`;

fs.writeFileSync(path.join(__dirname, 'galeria.html'), html);
console.log(`galeria.html — ${ok.length} cards${falhou.length ? `, ${falhou.length} falharam` : ''}`);
