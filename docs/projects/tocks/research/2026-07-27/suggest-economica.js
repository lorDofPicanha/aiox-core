// Demanda: mesa de linha ECONÔMICA (R$200-800) + ângulo PRESENTE / Dia dos Pais
const SEEDS = [
  'mesa de sinuca infantil',
  'mini mesa de sinuca',
  'mesa de sinuca pequena',
  'mesa de sinuca dobravel',
  'mesa de sinuca 3 em 1',
  'mesa multijogos',
  'mesa de sinuca barata',
  'mesa de sinuca de brinquedo',
  'mesa de sinuca portatil',
  'mesa de jogos infantil',
  'presente dia dos pais',
  'presente criativo para pai',
  'mesa de sinuca para apartamento',
  'mesa de sinuca com tampo',
];
const MODS = [' preco', ' comprar', ' mercado livre'];
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
    return terms.map((t, i) => ({ q: t, rel: rel[i] ?? null }));
  } catch {
    return null;
  }
}

(async () => {
  const seen = new Map();
  const bySeed = {};
  let calls = 0;
  for (const seed of SEEDS) {
    bySeed[seed] = [];
    const probes = [seed, ...MODS.map((m) => seed + m), ...ALPHA.map((a) => seed + ' ' + a)];
    for (const p of probes) {
      const r = await suggest(p);
      calls++;
      if (r)
        for (const it of r) {
          const k = it.q.toLowerCase().trim();
          const prev = seen.get(k);
          if (!prev || (it.rel || 0) > (prev.rel || 0)) seen.set(k, { ...it, seed });
          if (!bySeed[seed].includes(it.q)) bySeed[seed].push(it.q);
        }
      await sleep(100);
    }
    console.error('seed OK:', seed, '→', bySeed[seed].length);
  }
  const all = [...seen.values()].sort((a, b) => (b.rel || 0) - (a.rel || 0));
  console.error('calls:', calls, '| únicas:', all.length);
  console.log(JSON.stringify({ totalUnique: all.length, calls, all, bySeed }, null, 1));
})();
