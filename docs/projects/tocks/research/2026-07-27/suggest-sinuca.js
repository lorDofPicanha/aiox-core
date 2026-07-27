// Mapa de demanda — Google Autocomplete BR (client=chrome traz suggestrelevance)
// Alphabet-soup: cada semente é expandida com sufixos a-z e modificadores comerciais.

const SEEDS = [
  'taco de sinuca',
  'taco de bilhar',
  'bolas de sinuca',
  'bola de bilhar',
  'acessorios para sinuca',
  'pano para mesa de sinuca',
  'giz de sinuca',
  'triangulo de sinuca',
  'porta taco',
  'sola de taco',
  'capa para mesa de sinuca',
  'cacapa de sinuca',
  'kit sinuca',
  'mesa de sinuca',
  'sinuca profissional',
  'taco profissional',
];

const MODS = ['', ' comprar', ' preco', ' profissional', ' onde comprar', ' melhor'];
const ALPHA = 'abcdefghijklmnopqrstuvwxyz'.split('');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function suggest(q) {
  const url =
    'https://suggestqueries.google.com/complete/search?client=chrome&hl=pt-BR&gl=br&q=' +
    encodeURIComponent(q);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (res.status !== 200) return null;
    const j = JSON.parse(await res.text());
    const terms = j[1] || [];
    const rel = (j[4] && j[4]['google:suggestrelevance']) || [];
    const types = (j[4] && j[4]['google:suggesttype']) || [];
    return terms.map((t, i) => ({ q: t, rel: rel[i] ?? null, type: types[i] || '' }));
  } catch {
    return null;
  }
}

(async () => {
  const seen = new Map(); // query -> best relevance
  const bySeed = {};
  let calls = 0;

  for (const seed of SEEDS) {
    bySeed[seed] = [];
    const probes = [seed, ...MODS.slice(1).map((m) => seed + m), ...ALPHA.map((a) => seed + ' ' + a)];
    for (const p of probes) {
      const r = await suggest(p);
      calls++;
      if (r) {
        for (const item of r) {
          const key = item.q.toLowerCase().trim();
          const prev = seen.get(key);
          if (!prev || (item.rel || 0) > (prev.rel || 0)) {
            seen.set(key, { q: item.q, rel: item.rel, seed });
          }
          if (!bySeed[seed].includes(item.q)) bySeed[seed].push(item.q);
        }
      }
      await sleep(120);
    }
    console.error('seed OK:', seed, '→', bySeed[seed].length, 'variantes');
  }

  const all = [...seen.values()].sort((a, b) => (b.rel || 0) - (a.rel || 0));
  console.error('total calls:', calls, '| queries únicas:', all.length);
  console.log(JSON.stringify({ totalUnique: all.length, calls, all, bySeed }, null, 1));
})();
