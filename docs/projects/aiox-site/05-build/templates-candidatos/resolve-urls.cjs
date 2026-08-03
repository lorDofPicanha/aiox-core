// resolve-urls.cjs — descobre a URL de demo ao vivo de cada template do marketplace Framer
// Uso: node resolve-urls.cjs   → escreve urls.json
const fs = require('fs');
const path = require('path');

// slugs colhidos dos roundups (todos marcados como GRÁTIS na fonte)
const SLUGS = [
  'formix-co', 'jorge', 'qitchen', 'landio', 'nitro', 'porto', 'arik',
  'synk', 'dashfolio', 'agenciy', 'aixor', 'palmer', 'darkfolio',
  'kajo', 'viper', 'other', 'hanzo', 'zup', 'prolab', 'bruce',
  'frame-studio', 'twin-x', 'rauten', 'modullo', 'caladan',
  'elian', 'drago', 'jet', 'villo',
];

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';

async function tryFetch(url) {
  try {
    const r = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow' });
    if (!r.ok) return null;
    return await r.text();
  } catch { return null; }
}

(async () => {
  const out = [];
  for (const slug of SLUGS) {
    const pages = [
      `https://www.framer.com/marketplace/templates/${slug}/`,
      `https://www.framer.com/community/marketplace/templates/${slug}/`,
    ];
    let html = null, from = null;
    for (const p of pages) { html = await tryFetch(p); if (html) { from = p; break; } }
    if (!html) { out.push({ slug, ok: false, why: 'marketplace 404' }); process.stdout.write(`✗ ${slug}\n`); continue; }

    // preview ao vivo aparece como <slug>.framer.website / .framer.ai / .framer.media
    const hits = [...html.matchAll(/https:\/\/([a-z0-9-]+)\.framer\.(website|ai|media)/gi)]
      .map(m => m[0])
      .filter(u => !/^https:\/\/(www|framer|marketplace|events|academy)\./i.test(u));
    const demo = [...new Set(hits)][0] || null;

    // preço: procura marcador de grátis
    const free = /\bFree\b/i.test(html) && !/\$\d/.test(html.slice(0, 4000));

    out.push({ slug, ok: !!demo, demo, marketplace: from, freeHint: free });
    process.stdout.write(`${demo ? '✓' : '·'} ${slug.padEnd(14)} ${demo || '(sem demo no HTML)'}\n`);
  }
  fs.writeFileSync(path.join(__dirname, 'urls.json'), JSON.stringify(out, null, 2));
  const ok = out.filter(o => o.ok).length;
  console.log(`\n${ok}/${SLUGS.length} com demo resolvida → urls.json`);
})();
