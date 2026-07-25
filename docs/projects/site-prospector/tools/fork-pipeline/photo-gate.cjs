#!/usr/bin/env node
/**
 * photo-gate.cjs — mede se as fotos de um prospect servem para hero de produto recortado.
 * Uso: node photo-gate.cjs <dirComPastasDeProspect>
 *
 * Testa o que quebrou os builds anteriores:
 *  A) fundo CHAPADO (desvio da moldura baixo)  → dá para recortar
 *  B) sem TEXTO QUEIMADO nos cantos            → não é post de campanha
 *  C) sujeito ocupa área razoável              → é foto de produto, não retrato/ambiente
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ROOT = process.argv[2];

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
  const pg = await b.newPage();
  const rows = [];

  for (const prospect of fs.readdirSync(ROOT)) {
    const dir = path.join(ROOT, prospect, 'instagram');
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => /\.jpg$/i.test(f) && !f.startsWith('_'));
    let pass = 0; const detail = [];

    for (const f of files) {
      const b64 = fs.readFileSync(path.join(dir, f)).toString('base64');
      const r = await pg.evaluate(async (b64) => {
        const img = new Image(); img.src = 'data:image/jpeg;base64,' + b64;
        try { await img.decode(); } catch { return null; }
        const W = img.naturalWidth, H = img.naturalHeight;
        const S = 260;
        const c = document.createElement('canvas'); c.width = S; c.height = Math.round(S * H / W);
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, c.width, c.height);
        const d = ctx.getImageData(0, 0, c.width, c.height).data;
        const w = c.width, h = c.height;
        const px = (x, y) => { const i = (y * w + x) * 4; return [d[i], d[i + 1], d[i + 2]]; };

        // A) desvio-padrão da moldura (fundo chapado?)
        const border = [];
        for (let x = 0; x < w; x += 2) { border.push(px(x, 0), px(x, h - 1)); }
        for (let y = 0; y < h; y += 2) { border.push(px(0, y), px(w - 1, y)); }
        const mean = [0, 1, 2].map(k => border.reduce((a, p) => a + p[k], 0) / border.length);
        const sd = Math.sqrt(border.reduce((a, p) => a + [0, 1, 2].reduce((s, k) => s + (p[k] - mean[k]) ** 2, 0), 0) / (border.length * 3));

        // B) contraste local nos cantos (texto/logo queimado gera bordas duras)
        const cornerEdge = (x0, y0, cw, ch) => {
          let e = 0, n = 0;
          for (let y = y0 + 1; y < y0 + ch - 1; y++) for (let x = x0 + 1; x < x0 + cw - 1; x++) {
            const a = px(x, y), b2 = px(x + 1, y), c2 = px(x, y + 1);
            e += Math.abs(a[0] - b2[0]) + Math.abs(a[0] - c2[0]); n++;
          }
          return n ? e / n : 0;
        };
        const cw = Math.floor(w * 0.3), ch = Math.floor(h * 0.18);
        const corners = [cornerEdge(0, 0, cw, ch), cornerEdge(w - cw, 0, cw, ch),
                         cornerEdge(0, h - ch, cw, ch), cornerEdge(w - cw, h - ch, cw, ch)];
        const maxCorner = Math.max(...corners);

        // C) fração de pixels distantes do fundo (tamanho do sujeito)
        let subj = 0, tot = 0;
        for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) {
          const p = px(x, y); tot++;
          if (Math.hypot(p[0] - mean[0], p[1] - mean[1], p[2] - mean[2]) > 60) subj++;
        }
        return { sd: +sd.toFixed(1), corner: +maxCorner.toFixed(1), subj: +(subj / tot).toFixed(2), W, H };
      }, b64);
      if (!r) continue;
      // D) suspeita de imagem GERADA por IA: saída quadrada de gerador (1024/1408/1536),
      //    enquanto foto real de IG vem 1080x1080 ou 1080x1350. Cataia caiu nisso.
      r.aiSuspect = r.W === r.H && [1024, 1408, 1536, 2048].includes(r.W);
      // limiares calibrados no Chokolaten (que passou no olho do founder)
      const ok = r.sd < 18 && r.corner < 12 && r.subj > 0.08 && r.subj < 0.72 && !r.aiSuspect;
      if (ok) pass++;
      detail.push({ f, ...r, ok });
    }
    rows.push({ prospect, total: files.length, pass, pct: files.length ? Math.round(pass / files.length * 100) : 0, detail });
  }

  rows.sort((a, b2) => b2.pass - a.pass);
  console.log('\nprospect'.padEnd(26) + 'fotos  recortáveis   %   veredito');
  for (const r of rows) {
    const ai = r.detail.filter(d=>d.aiSuspect).length;
    const v = (r.pass >= 3 ? '✅ dá para construir' : r.pass >= 1 ? '⚠️  1-2 fotos, insuficiente' : '❌ sem foto de catálogo') + (ai ? '  (+' + ai + ' suspeita de IA)' : '');
    console.log(r.prospect.padEnd(26) + String(r.total).padStart(5) + String(r.pass).padStart(12) + String(r.pct).padStart(5) + '   ' + v);
  }
  fs.writeFileSync(path.join(ROOT, '_photo-gate.json'), JSON.stringify(rows, null, 2));
  console.log('\ndetalhe por foto → ' + path.join(ROOT, '_photo-gate.json'));
  await b.close();
})().catch(e => { console.error('FALHOU:', e.message); process.exit(1); });
