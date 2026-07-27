// Demanda por LOCAÇÃO de mesas/jogos em SANTA CATARINA, cidade a cidade.
// Duas sondagens:
//  (A) descoberta: "aluguel de mesa de sinuca em {a..z}" → que cidades o Google sugere sozinho
//  (B) confirmação: probe direto por cidade de SC

const CIDADES = [
  'florianopolis', 'joinville', 'blumenau', 'sao jose', 'itajai', 'balneario camboriu',
  'chapeco', 'criciuma', 'jaragua do sul', 'lages', 'palhoca', 'brusque', 'tubarao',
  'navegantes', 'itapema', 'camboriu', 'biguacu', 'gaspar', 'indaial', 'rio do sul',
  'concordia', 'sao bento do sul', 'caçador', 'araranguá', 'porto belo', 'bombinhas',
];

const FORMAS = [
  'aluguel de mesa de sinuca em ',
  'aluguel de jogos para festa ',
  'locacao de mesa de sinuca ',
  'aluguel de pebolim ',
  'aluguel de fliperama ',
  'aluguel de mesa de sinuca ',
];

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
  const descoberta = new Map();
  let calls = 0;

  // (A) descoberta de cidades por prefixo
  for (const forma of FORMAS) {
    for (const a of ALPHA) {
      const r = await suggest(forma + a);
      calls++;
      if (r)
        for (const it of r) {
          const k = it.q.toLowerCase().trim();
          if (!descoberta.has(k) || (it.rel || 0) > (descoberta.get(k).rel || 0))
            descoberta.set(k, it);
        }
      await sleep(90);
    }
    console.error('forma OK:', forma.trim());
  }

  // (B) confirmação por cidade de SC
  const porCidade = {};
  for (const c of CIDADES) {
    const set = new Set();
    for (const forma of FORMAS.slice(0, 5)) {
      const r = await suggest(forma + c);
      calls++;
      if (r) for (const it of r) set.add(it.q);
      await sleep(90);
    }
    porCidade[c] = [...set];
    console.error('cidade OK:', c, '→', set.size);
  }

  const all = [...descoberta.values()].sort((a, b) => (b.rel || 0) - (a.rel || 0));
  console.error('calls:', calls);
  console.log(JSON.stringify({ calls, descoberta: all, porCidade }, null, 1));
})();
