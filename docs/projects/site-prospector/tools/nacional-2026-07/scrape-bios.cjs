#!/usr/bin/env node
/**
 * Raspa bio-links (Linktree/Beacons/etc) e classifica a lacuna digital.
 * Site-Prospector — rodada nacional 26/Jul/2026.
 *
 * Saída: bios-scraped.json  [{handle,url,brand,bio,links[],verdict,signals{}}]
 */
const fs = require('fs');
const path = require('path');

const SP = __dirname;
const IN = path.join(SP, 'candidates.json');
const OUT = path.join(SP, 'bios-scraped.json');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const CONC = 8;

// plataformas de loja "pronta" — tem loja, mas travada em tema default
const PLATFORMS = /nuvemshop|lojaintegrada|loja\.integrada|tray\.com|wix\.com|wixsite|shopify|cartpanda|yampi|montink|hotmart|kiwify|linktr\.ee|beacons|bio\.link/i;
// marketplaces — demanda provada, sem casa propria
const MARKETPLACE = /shopee|elo7|mercadolivre|mercadolibre|amazon\.com\.br|magazineluiza|americanas|shein|etsy/i;
const SOCIAL = /instagram\.com|facebook\.com|tiktok\.com|youtube\.com|twitter\.com|x\.com|pinterest|linkedin|threads\.net|kwai/i;
const CONTACT = /wa\.me|whatsapp|api\.whatsapp|t\.me|telegram|mailto:|tel:|maps\.google|goo\.gl\/maps|waze/i;

function classifyLink(u) {
  if (!u) return 'vazio';
  if (CONTACT.test(u)) return 'contato';
  if (SOCIAL.test(u)) return 'social';
  if (MARKETPLACE.test(u)) return 'marketplace';
  if (PLATFORMS.test(u)) return 'plataforma';
  try {
    const h = new URL(u).hostname.replace(/^www\./, '');
    // dominio proprio = ja tem site
    if (h && h.split('.').length >= 2) return 'site-proprio';
  } catch { /* url quebrada */ }
  return 'outro';
}

async function fetchOne(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.text();
}

function parseLinktree(html) {
  const m = html.match(/__NEXT_DATA__[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  let j;
  try { j = JSON.parse(m[1]); } catch { return null; }
  const p = (j.props && j.props.pageProps) || {};
  const acc = p.account || {};
  const links = (p.links || [])
    .map(l => ({ title: (l.title || '').trim(), url: (l.url || '').trim() }))
    .filter(l => l.url);
  return {
    brand: (acc.pageTitle || acc.username || '').trim(),
    handle: acc.username || '',
    bio: (acc.description || '').trim(),
    links,
  };
}

function parseGeneric(html) {
  // fallback: <title> + hrefs
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const hrefs = [...html.matchAll(/href="(https?:\/\/[^"]+)"/gi)].map(x => x[1]);
  const seen = new Set();
  const links = [];
  hrefs.forEach(u => { if (!seen.has(u)) { seen.add(u); links.push({ title: '', url: u }); } });
  return { brand: t ? t[1].trim().slice(0, 80) : '', handle: '', bio: '', links: links.slice(0, 25) };
}

function verdict(sig) {
  // regra de triagem — lacuna digital
  if (sig['site-proprio'] > 0) return 'TEM_SITE';           // avaliar se e ruim, mas nao e lacuna pura
  if (sig.marketplace > 0) return 'MARKETPLACE_SEM_SITE';    // demanda provada, sem casa
  if (sig.plataforma > 0) return 'PLATAFORMA_PRONTA';        // loja em tema default
  if (sig.contato > 0 || sig.social > 0) return 'SO_CONTATO'; // lacuna maxima
  return 'INDEFINIDO';
}

(async () => {
  const cands = JSON.parse(fs.readFileSync(IN, 'utf8'));
  console.log('candidatos a raspar:', cands.length);

  const out = [];
  let done = 0, fail = 0;
  const queue = [...cands];

  async function worker(id) {
    while (queue.length) {
      const c = queue.shift();
      const url = c.url.split('?')[0];
      try {
        const html = await fetchOne(url);
        const isLT = /linktr\.ee/.test(url);
        const parsed = (isLT && parseLinktree(html)) || parseGeneric(html);
        const sig = {};
        parsed.links.forEach(l => {
          const k = classifyLink(l.url);
          sig[k] = (sig[k] || 0) + 1;
        });
        const ig = parsed.links.find(l => /instagram\.com/.test(l.url));
        out.push({
          url,
          brand: parsed.brand,
          handle: parsed.handle || url.split('/').pop(),
          bio: parsed.bio,
          nLinks: parsed.links.length,
          instagram: ig ? ig.url : '',
          links: parsed.links,
          signals: sig,
          verdict: verdict(sig),
          srcQuery: c.term,
        });
      } catch (e) {
        fail++;
        out.push({ url, brand: '', handle: url.split('/').pop(), error: String(e.message), verdict: 'ERRO', srcQuery: c.term });
      }
      done++;
      if (done % 25 === 0) process.stderr.write(`  ...${done}/${cands.length}\n`);
      await new Promise(r => setTimeout(r, 120));
    }
  }

  await Promise.all(Array.from({ length: CONC }, (_, i) => worker(i)));

  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  const byV = {};
  out.forEach(o => { byV[o.verdict] = (byV[o.verdict] || 0) + 1; });
  console.log('\n=== VEREDITO ===');
  Object.entries(byV).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(String(v).padStart(4), k));
  console.log('\nfalhas:', fail, '| salvo em', OUT);
})();
