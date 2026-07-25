// recolor.cjs — converte o logo escuro em monocromático CREME (#f5e4c7) para fundo near-black,
// invertendo a luminância para não perder o detalhe interno das vagens de cacau.
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const SRC = 'D:/AIOS/docs/projects/site-prospector/03-proposal-mockups/chokolaten/assets/cutout/logo-chokolaten.png';
const DST = 'D:/AIOS/docs/projects/site-prospector/03-proposal-mockups/chokolaten/assets/cutout/logo-chokolaten-cream.png';

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
  const pg = await b.newPage();
  const b64 = fs.readFileSync(SRC).toString('base64');
  const out = await pg.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const W = img.naturalWidth, H = img.naturalHeight;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const im = ctx.getImageData(0, 0, W, H), d = im.data;
    const CREAM = [245, 228, 199];
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 6) continue;
      const L = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
      const k = 1 - 0.45 * L;                 // escuro → creme cheio; claro → creme atenuado
      d[i] = Math.round(CREAM[0] * k);
      d[i + 1] = Math.round(CREAM[1] * k);
      d[i + 2] = Math.round(CREAM[2] * k);
    }
    ctx.putImageData(im, 0, 0);
    return { data: c.toDataURL('image/png').split(',')[1], W, H };
  }, b64);
  fs.writeFileSync(DST, Buffer.from(out.data, 'base64'));
  console.log(`✓ logo creme ${out.W}x${out.H} → ${DST}`);
  await b.close();
})().catch(e => { console.error('FALHOU:', e.message); process.exit(1); });
