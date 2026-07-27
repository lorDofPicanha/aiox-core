// Google Trends BR — demanda por acessórios de sinuca
// Metodologia: cada lote compara 4 termos + 1 ÂNCORA comum ("mesa de sinuca"),
// permitindo reescalar os lotes entre si (Trends normaliza 0-100 por comparação).

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const ANCHOR = 'mesa de sinuca';
const TIME = 'today 12-m';
const GEO = 'BR';

const BATCHES = [
  ['taco de sinuca', 'bolas de sinuca', 'pano para mesa de sinuca', 'acessorios para sinuca'],
  ['taco de sinuca profissional', 'giz de sinuca', 'triangulo de sinuca', 'porta taco'],
  ['taco de bilhar', 'bola de bilhar', 'sinuca profissional', 'bolas de sinuca aramith'],
  ['sola de taco', 'capa para mesa de sinuca', 'cacapa de sinuca', 'kit sinuca'],
];

let COOKIE = '';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, extra = {}) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      'Accept-Language': 'pt-BR,pt;q=0.9',
      Referer: 'https://trends.google.com/',
      ...(COOKIE ? { Cookie: COOKIE } : {}),
      ...extra,
    },
  });
  const sc = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  if (sc.length) COOKIE = sc.map((c) => c.split(';')[0]).join('; ');
  const text = await res.text();
  return { status: res.status, text };
}

function stripPrefix(t) {
  const i = t.indexOf('{');
  return t.slice(i);
}

async function explore(keywords) {
  const req = {
    comparisonItem: keywords.map((k) => ({ keyword: k, geo: GEO, time: TIME })),
    category: 0,
    property: '',
  };
  const url =
    'https://trends.google.com/trends/api/explore?hl=pt-BR&tz=180&req=' +
    encodeURIComponent(JSON.stringify(req));
  const { status, text } = await get(url);
  if (status !== 200) throw new Error('explore HTTP ' + status);
  return JSON.parse(stripPrefix(text)).widgets;
}

async function widget(w, path) {
  const url =
    `https://trends.google.com/trends/api/widgetdata/${path}?hl=pt-BR&tz=180&req=` +
    encodeURIComponent(JSON.stringify(w.request)) +
    '&token=' +
    encodeURIComponent(w.token);
  const { status, text } = await get(url);
  if (status !== 200) return null;
  try {
    return JSON.parse(stripPrefix(text));
  } catch {
    return null;
  }
}

(async () => {
  // handshake p/ pegar cookie NID
  await get(
    'https://trends.google.com/trends/explore?geo=BR&hl=pt-BR&q=' + encodeURIComponent(ANCHOR)
  );
  await sleep(1500);

  const out = { batches: [], related: {}, geo: {} };

  for (const b of BATCHES) {
    const kws = [ANCHOR, ...b];
    let widgets;
    try {
      widgets = await explore(kws);
    } catch (e) {
      console.error('FALHA lote', b[0], e.message);
      await sleep(8000);
      continue;
    }
    await sleep(2500);

    const ts = widgets.find((w) => w.id === 'TIMESERIES');
    const data = ts ? await widget(ts, 'multiline') : null;
    await sleep(2500);

    const avgs = kws.map(() => []);
    if (data && data.default && data.default.timelineData) {
      for (const p of data.default.timelineData) {
        p.value.forEach((v, i) => avgs[i].push(v));
      }
    }
    const means = avgs.map(
      (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : null)
    );
    out.batches.push({
      keywords: kws,
      meanInterest: means.map((m) => (m === null ? null : +m.toFixed(2))),
      peak: kws.map((_, i) => (avgs[i].length ? Math.max(...avgs[i]) : null)),
    });
    console.error('OK lote:', b[0]);

    // related queries só do 1o lote (mais barato) — para todos os termos
    if (!Object.keys(out.related).length) {
      const rqs = widgets.filter((w) => w.id && w.id.startsWith('RELATED_QUERIES'));
      for (let i = 0; i < rqs.length; i++) {
        const r = await widget(rqs[i], 'relatedsearches');
        await sleep(2500);
        const kw = kws[i] || 'idx' + i;
        const rank = r?.default?.rankedList || [];
        out.related[kw] = {
          top: (rank[0]?.rankedKeyword || []).slice(0, 12).map((x) => ({
            q: x.query,
            v: x.value,
          })),
          rising: (rank[1]?.rankedKeyword || []).slice(0, 12).map((x) => ({
            q: x.query,
            v: x.formattedValue,
          })),
        };
      }
      const gm = widgets.find((w) => w.id === 'GEO_MAP');
      if (gm) {
        const g = await widget(gm, 'comparisongeo');
        await sleep(2000);
        out.geo = (g?.default?.geoMapData || [])
          .filter((x) => x.hasData && x.hasData.some(Boolean))
          .slice(0, 12)
          .map((x) => ({ uf: x.geoName, v: x.value }));
      }
    }
    await sleep(4000);
  }

  console.log(JSON.stringify(out, null, 1));
})();
