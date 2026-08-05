/**
 * Serve o mockup e captura POR VIEWPORT (nunca fullPage).
 * Mede: altura, contraste no render, erros de console, e o estado sem JS.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ROOT = 'D:/AIOS/docs/projects/aiox-site/05-build/mockup';
const OUT = 'D:/AIOS/docs/projects/aiox-site/05-build/shots';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 8919;

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.woff2': 'font/woff2', '.css': 'text/css' };

const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]);
  const file = path.resolve(ROOT, '.' + (rel === '/' ? '/index.html' : rel));
  if (!file.startsWith(path.resolve(ROOT)) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); return res.end('nope');
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

// ---------- WCAG 2.1, mesma fórmula do contrast-provider do design-studio ----------
function lum(r, g, b) {
  const f = (c) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(a, b) {
  const l1 = lum(...a), l2 = lum(...b);
  return Math.round(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)) * 100) / 100;
}

(async () => {
  await new Promise((r) => server.listen(PORT, r));
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--font-render-hinting=none'] });

  const erros = [];
  const shootSet = async (label, w, h, comJs) => {
    const page = await browser.newPage();
    if (!comJs) await page.setJavaScriptEnabled(false);
    page.on('console', (m) => { if (m.type() === 'error') erros.push(`[${label}] ${m.text()}`); });
    page.on('requestfailed', (r) => erros.push(`[${label}] REQ FALHOU ${r.url()}`));
    page.on('response', (r) => { if (r.status() >= 400) erros.push(`[${label}] HTTP ${r.status()} ${r.url()}`); });
    page.on('pageerror', (e) => erros.push(`[${label}] PAGEERROR ${e.message}`));
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 700));

    const alturaTotal = await page.evaluate(() => document.documentElement.scrollHeight);
    const viewports = Math.ceil(alturaTotal / h);
    for (let i = 0; i < viewports; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), i * h);
      await new Promise((r) => setTimeout(r, 260));
      await page.screenshot({ path: path.join(OUT, `mk-${label}-${String(i).padStart(2, '0')}.png`) });
    }
    return { page, alturaTotal, viewports };
  };

  console.log('=== CAPTURA POR VIEWPORT (nunca fullPage) ===');
  const d = await shootSet('1440', 1440, 900, true);
  console.log(`desktop 1440x900  · altura ${d.alturaTotal}px · ${d.viewports} telas`);

  // ---------- medições no render, com o desktop ainda aberto ----------
  const medidas = await d.page.evaluate(() => {
    const rgb = (s) => (s.match(/[\d.]+/g) || []).map(Number);
    // Fundo OPACO efetivo: sobe a árvore compondo cada camada semitransparente.
    const fundoReal = (el) => {
      const pilha = [];
      let n = el;
      while (n && n !== document.documentElement) {
        const p = rgb(getComputedStyle(n).backgroundColor);
        if (p.length >= 3) {
          const a = p[3] === undefined ? 1 : p[3];
          if (a > 0) pilha.push([p[0], p[1], p[2], a]);
          if (a >= 0.999) break;
        }
        n = n.parentElement;
      }
      let base = [15, 15, 15];
      for (let i = pilha.length - 1; i >= 0; i--) {
        const [r, g, b, a] = pilha[i];
        base = [0, 1, 2].map((k) => Math.round([r, g, b][k] * a + base[k] * (1 - a)));
      }
      return base;
    };
    // 🔴 A regra que o conclave cobrou: cor de texto com alfa TEM que ser
    // composta sobre o fundo real antes de virar número. Sem isto,
    // --ink-2 (#fafafaa8) mede como se fosse #fafafa e o número é fantasia.
    const compor = (fgArr, bgArr) => {
      const a = fgArr[3] === undefined ? 1 : fgArr[3];
      return [0, 1, 2].map((k) => Math.round(fgArr[k] * a + bgArr[k] * (1 - a)));
    };
    const alvos = [
      ['H1 display', 'h1.display'],
      ['subhead do hero', '.hero__sub'],
      ['eyebrow bronze', '.eyebrow'],
      ['linha de honestidade', '.honesto__frase'],
      ['micro-checks (ink-3)', '.honesto__checks'],
      ['H2 de seção', '#problema-t'],
      ['corpo de card', '.card__p'],
      ['carimbo bronze', '.carimbo'],
      ['ponte da §3', '.ponte'],
      ['tag (ink-3)', '.tag'],
      ['texto de etapa', '.etapa__texto'],
      ['motivo da etapa (ink-3)', '.etapa__motivo'],
      ['minutos da etapa', '.etapa__min'],
      ['total em bronze', '.total__valor'],
      ['premissa (ink-3)', '.total__premissa'],
      ['ponte de dinheiro', '.total__ponte'],
      ['trace detalhe', '.trace__det'],
      ['trace ms (ink-3)', '.trace__ms'],
      ['pergunta do FAQ', '.faq__q'],
      ['resposta do FAQ', '.faq__r p'],
      ['celula da matriz', '.matriz__cel--dim'],
      ['rotulo da matriz (ink-3)', '.matriz__rot'],
      ['texto da matriz', '.matriz__txt'],
      ['botao primario', '.btn--primary'],
      ['botao ghost', '.btn--ghost'],
      ['cta-mini bronze', '.cta-mini'],
      ['label do rodape', '.rodape__legal'],
      ['link do rodape', '.rodape__cols a'],
      ['frase do rodape', '.rodape__frase'],
      ['nao renderizado (ink-4)', '.matriz__vazio'],
    ];
    const out = [];
    for (const [nome, sel] of alvos) {
      const el = document.querySelector(sel);
      if (!el) { out.push({ nome, sel, falta: true }); continue; }
      const cs = getComputedStyle(el);
      const fgBruto = rgb(cs.color);
      const bg = fundoReal(el);
      const fg = compor(fgBruto, bg);
      out.push({
        nome, sel,
        fg, bg,
        alfa: fgBruto[3] === undefined ? 1 : fgBruto[3],
        fgBruto: fgBruto.slice(0, 3),
        px: parseFloat(cs.fontSize), peso: cs.fontWeight,
        lh: cs.lineHeight, ls: cs.letterSpacing,
        familia: cs.fontFamily.split(',')[0].replace(/"/g, ''),
        opsz: cs.fontOpticalSizing,
      });
    }
    const est = {
      altura: document.documentElement.scrollHeight,
      secoes: document.querySelectorAll('section').length,
      invisiveis: [...document.querySelectorAll('section')].filter((s) => getComputedStyle(s).opacity !== '1' || getComputedStyle(s).visibility === 'hidden').length,
      h1: document.querySelectorAll('h1').length,
      bodyBg: getComputedStyle(document.body).backgroundColor,
      setasTexto: (document.body.innerText.match(/[\u2192\u2190\u2191\u2193\u2605\u2713\u2714\u2197]/g) || []).length,
      svgs: document.querySelectorAll('svg').length,
      imgs: document.querySelectorAll('img').length,
      camadasFx: document.querySelectorAll('.fx').length,
      tokensCor: getComputedStyle(document.documentElement).getPropertyValue('--br').trim(),
      vetadosNoTextoRenderizado: (() => {
        const t = document.body.innerText.toLowerCase();
        const veto = ['trabalho repetitivo','mapear','automatizável','redigit','workflow','webhook','chatbot','dashboard',' crm','no-code','transformação digital','otimizar','eficiência','alguém','talos','gmt-3'];
        return veto.filter((w) => t.includes(w)).join(' | ') || '(nenhum)';
      })(),
    };
    return { alvos: out, est };
  });

  console.log('');
  console.log('=== ESTADO DO RENDER ===');
  for (const [k, v] of Object.entries(medidas.est)) console.log('  ' + k.padEnd(14) + ' ' + v);

  console.log('');
  console.log('=== CONTRASTE MEDIDO NO RENDER (composição real, não hex de token) ===');
  console.log('  ' + 'elemento'.padEnd(25) + 'px  peso  alfa  fonte          composto     fundo        ratio   AA   AAA');
  console.log('  ' + '-'.repeat(108));
  let falhasAA = 0;
  for (const a of medidas.alvos) {
    if (a.falta) { console.log('  ' + a.nome.padEnd(25) + 'AUSENTE (' + a.sel + ')'); continue; }
    const r = ratio(a.fg, a.bg);
    const grande = a.px >= 24 || (a.px >= 18.66 && Number(a.peso) >= 700);
    const aa = r >= (grande ? 3 : 4.5), aaa = r >= (grande ? 4.5 : 7);
    const decorativo = /ink-4|nao renderizado/.test(a.nome);
    if (!aa && !decorativo) falhasAA++;
    console.log('  ' + a.nome.padEnd(25) +
      String(Math.round(a.px)).padStart(3) + '  ' + String(a.peso).padStart(4) + '  ' +
      a.alfa.toFixed(2).padStart(4) + '  ' +
      a.familia.padEnd(14) +
      ('rgb(' + a.fg.join(',') + ')').padEnd(13) + ('rgb(' + a.bg.join(',') + ')').padEnd(13) +
      (r + ':1').padStart(8) + '  ' + (aa ? ' ok ' : 'FALHA') + ' ' + (aaa ? ' ok' : ' --') +
      (decorativo ? '  [decorativo]' : ''));
  }
  console.log('  ' + '-'.repeat(100));
  console.log('  falhas AA em texto de leitura: ' + falhasAA);

  await d.page.close();

  const m = await shootSet('390', 390, 844, true);
  console.log('');
  console.log(`mobile 390x844    · altura ${m.alturaTotal}px · ${m.viewports} telas`);
  await m.page.close();

  // ---------- sem JS ----------
  const s = await shootSet('semjs', 1440, 900, false);
  const semJs = await s.page.evaluate(() => ({
    caracteres: document.body.innerText.replace(/\s+/g, ' ').trim().length,
    escondidos: [...document.querySelectorAll('section,article,li,details')].filter((e) => {
      const cs = getComputedStyle(e);
      return cs.opacity === '0' || cs.visibility === 'hidden';
    }).length,
    faixaItens: document.querySelectorAll('.marquee__item').length,
    faqItens: document.querySelectorAll('.faq__item').length,
    abaVisivel: [...document.querySelectorAll('.abas__painel')].filter((p) => getComputedStyle(p).display !== 'none').length,
    processosNoHtml: document.querySelectorAll('[data-demo]').length,
    demoTemResultado: document.querySelectorAll('#demo-saida .etapa').length,
    totalSemJs: (document.querySelector('.total__valor') || {}).textContent || '(ausente)',
    altura: document.documentElement.scrollHeight,
  }));
  console.log('');
  console.log('=== SEM JAVASCRIPT ===');
  for (const [k, v] of Object.entries(semJs)) console.log('  ' + k.padEnd(20) + ' ' + v);
  await s.page.close();

  console.log('');
  console.log('=== CONSOLE ===');
  console.log(erros.length ? erros.join('\n') : '  0 erros, 0 exceções');

  const files = fs.readdirSync(OUT).filter((f) => f.startsWith('mk-'));
  console.log('');
  console.log('=== ARQUIVOS (' + files.length + ') ===');
  console.log('  ' + files.join('\n  '));

  await browser.close();
  server.close();
})();
