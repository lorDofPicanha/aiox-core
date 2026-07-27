// Aftermarket Tocks: (1) mesa usada/seminova (2) manutenção/reforma (3) acessórios
// Foco: ONDE está a demanda de serviço (é geográfica) e como o mercado busca cada linha.

const SEEDS = [
  // manutenção — a linha mais geográfica
  'reforma de mesa de sinuca',
  'troca de pano de mesa de sinuca em',
  'conserto de mesa de sinuca em',
  'manutencao de mesa de sinuca em',
  'montador de mesa de sinuca',
  'nivelar mesa de sinuca',
  'quem reforma mesa de sinuca',
  // usada / seminova
  'mesa de sinuca usada',
  'vendo mesa de sinuca',
  'mesa de sinuca usada olx',
  // acessórios — canal
  'comprar taco de sinuca',
  'comprar bolas de sinuca',
  'loja de acessorios para sinuca',
  'pano para mesa de sinuca comprar',
];

const MODS = [' perto de mim', ' sc', ' preco'];
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
    for (const p of [seed, ...MODS.map((m) => seed + m), ...ALPHA.map((a) => seed + ' ' + a)]) {
      const r = await suggest(p);
      calls++;
      if (r)
        for (const it of r) {
          const k = it.q.toLowerCase().trim();
          if (!seen.has(k) || (it.rel || 0) > (seen.get(k).rel || 0))
            seen.set(k, { ...it, seed });
          if (!bySeed[seed].includes(it.q)) bySeed[seed].push(it.q);
        }
      await sleep(100);
    }
    console.error(String(bySeed[seed].length).padStart(4), seed);
  }
  const all = [...seen.values()].sort((a, b) => (b.rel || 0) - (a.rel || 0));
  console.error('calls:', calls, '| únicas:', all.length);
  console.log(JSON.stringify({ all, bySeed }, null, 1));
})();
