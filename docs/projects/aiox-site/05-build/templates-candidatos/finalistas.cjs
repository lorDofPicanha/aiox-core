// finalistas.cjs — levanta dado real dos 4 finalistas escolhidos pelo founder
// Webflow "HTML templates" = download de código (não hospedado) — confirmar preço/licença.
const fs = require('fs');
const path = require('path');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';

const ALVOS = [
  { id: 'wf-idesignerlite', plataforma: 'webflow-html', url: 'https://webflow.com/templates/html/idesignerlite-portfolio-website-template' },
  { id: 'wf-conicorn',      plataforma: 'webflow-html', url: 'https://webflow.com/templates/html/conicorn-website-template' },
  { id: 'fr-stackgrid',     plataforma: 'framer',       url: 'https://www.framer.com/community/marketplace/templates/stackgrid/' },
  { id: 'fr-agenciy',       plataforma: 'framer',       url: 'https://www.framer.com/community/marketplace/templates/agenciy/' },
];

const pega = (html, re) => { const m = html.match(re); return m ? m[1].trim() : null; };

(async () => {
  const out = [];
  for (const a of ALVOS) {
    let html = '';
    try {
      const r = await fetch(a.url, { headers: { 'user-agent': UA, accept: 'text/html' } });
      html = await r.text();
      a.http = r.status;
    } catch (e) { a.erro = e.message; out.push(a); console.log(`✗ ${a.id}: ${e.message}`); continue; }

    // preço: JSON-LD, og:description, ou marcador textual
    const ld = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
    let preco = null;
    for (const bloco of ld) {
      try {
        const j = JSON.parse(bloco);
        const arr = Array.isArray(j) ? j : [j];
        for (const o of arr) {
          const of_ = o.offers || (o['@graph'] || []).flatMap(g => g.offers || []);
          const offers = Array.isArray(of_) ? of_ : of_ ? [of_] : [];
          for (const off of offers) if (off.price !== undefined) preco = `${off.priceCurrency || ''} ${off.price}`.trim();
        }
      } catch {}
    }
    if (!preco) preco = pega(html, /"price"\s*:\s*"?(\d+(?:\.\d+)?)"?/i);
    if (!preco && /\bFree\b/i.test(pega(html, /<title>([^<]*)<\/title>/i) || '')) preco = 'Free (title)';

    // preview ao vivo
    const preview = [...html.matchAll(/https:\/\/([a-z0-9-]+)\.(framer\.website|framer\.ai|webflow\.io)/gi)]
      .map(m => m[0]).filter(u => !/\/\/(www|framer|marketplace)\./i.test(u));

    a.titulo = (pega(html, /<title>([^<]*)<\/title>/i) || '').replace(/\s+/g, ' ').slice(0, 110);
    a.preco = preco || '(não achei no HTML)';
    a.preview = [...new Set(preview)];
    a.mencionaHtmlDownload = /\.zip|download|HTML5|source files|static files/i.test(html);
    a.mencionaGsap = /gsap|greensock/i.test(html);
    out.push(a);
    console.log(`✓ ${a.id.padEnd(18)} ${a.preco.padEnd(14)} ${a.preview[0] || '(sem preview no HTML)'}`);
    console.log(`   ${a.titulo}`);
  }
  fs.writeFileSync(path.join(__dirname, 'finalistas.json'), JSON.stringify(out, null, 2));
  console.log('\n→ finalistas.json');
})();
