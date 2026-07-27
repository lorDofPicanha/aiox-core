// Demanda por SERVIÇO / LOCAÇÃO / SEMINOVO — vias de caixa curto p/ Tocks e Bretda
// Mesma metodologia do harvest de acessórios: amplitude da árvore de autocomplete = proxy de demanda.

const SEEDS = [
  // locação — caixa mais rápido, usa ativo existente
  'aluguel de mesa de sinuca',
  'locacao de mesa de sinuca',
  'aluguel de mesa de pebolim',
  'aluguel de jogos para festa',
  'aluguel de fliperama',
  // seminovo / usado — giro rápido
  'mesa de sinuca usada',
  'mesa de sinuca seminova',
  'comprar mesa de sinuca usada',
  // serviço — margem alta, ciclo de dias, público que JÁ tem mesa
  'reforma de mesa de sinuca',
  'troca de pano de mesa de sinuca',
  'manutencao de mesa de sinuca',
  'conserto de mesa de sinuca',
  'nivelamento de mesa de sinuca',
  'montagem de mesa de sinuca',
  'transporte de mesa de sinuca',
  // B2B — ticket maior, ciclo médio
  'mesa de sinuca para bar',
  'mesa de sinuca comercial',
  'mesa de sinuca para condominio',
];

const MODS = [' preco', ' quanto custa', ' perto de mim'];
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
      await sleep(100);
    }
    console.error('seed OK:', seed, '→', bySeed[seed].length);
  }

  const all = [...seen.values()].sort((a, b) => (b.rel || 0) - (a.rel || 0));
  console.error('calls:', calls, '| únicas:', all.length);
  console.log(JSON.stringify({ totalUnique: all.length, calls, all, bySeed }, null, 1));
})();
