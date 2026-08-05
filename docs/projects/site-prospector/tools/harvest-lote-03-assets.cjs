const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "03-proposal-mockups", "_nacional-2026-07", "_clientes", "lote-03");
const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" };

const sources = [
  {
    source: "13-marias-moda-plus",
    url: "https://mariasmodaplus.com.br/",
    allow: /(?:dcdn|mitiendanube|mariasmodaplus\.com\.br)/i,
    deny: /(?:logo|icon|payment|visa|master|amex|diners|aura|elo|hiper|pix|shipping|avatar)/i,
  },
  {
    source: "11-olibiazeitesartesanais",
    url: "https://olibi.com.br/",
    allow: /olibi\.com\.br\/wp-content\/uploads/i,
    deny: /(?:logo|icon|favicon|avatar|depoimento)/i,
  },
];

function decode(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#038;", "&")
    .replaceAll("\\/", "/")
    .trim();
}

function collectUrls(html, base) {
  const values = [];
  for (const match of html.matchAll(/(?:src|data-src|srcset|data-srcset)=["']([^"']+)["']/gi)) {
    for (const candidate of decode(match[1]).split(",")) {
      const raw = candidate.trim().split(/\s+/)[0];
      if (!raw || raw.startsWith("data:")) continue;
      try { values.push(new URL(raw, base).href); } catch { /* ignore malformed */ }
    }
  }
  for (const match of html.matchAll(/url\((?:["']?)(https?:[^)"']+)(?:["']?)\)/gi)) {
    values.push(decode(match[1]));
  }
  return [...new Set(values)];
}

function extension(contentType) {
  if (/png/i.test(contentType)) return "png";
  if (/webp/i.test(contentType)) return "webp";
  return "jpg";
}

async function harvestSite(config) {
  const response = await fetch(config.url, { headers });
  if (!response.ok) throw new Error(`${config.source}: HTTP ${response.status}`);
  const html = await response.text();
  const candidates = collectUrls(html, config.url)
    .filter((url) => config.allow.test(url) && !config.deny.test(url));
  const output = path.join(root, config.source, "fotos");
  fs.mkdirSync(output, { recursive: true });
  const report = [];
  let index = 1;
  for (const url of candidates) {
    if (index > 50) break;
    try {
      const imageResponse = await fetch(url, { headers });
      const type = imageResponse.headers.get("content-type") || "";
      const bytes = Buffer.from(await imageResponse.arrayBuffer());
      if (!imageResponse.ok || !type.startsWith("image/") || bytes.length < 25000) continue;
      const file = `oficial-${String(index).padStart(2, "0")}.${extension(type)}`;
      fs.writeFileSync(path.join(output, file), bytes);
      report.push({ file, url, bytes: bytes.length, contentType: type });
      index += 1;
    } catch { /* continue with remaining official assets */ }
  }
  fs.writeFileSync(path.join(root, config.source, "official-assets.json"), JSON.stringify(report, null, 2));
  return { source: config.source, assets: report.length };
}

async function downloadSalamandra() {
  const url = "https://drive.google.com/uc?export=download&id=1z3d0pWwAHc6WRtSuNyV_suFlUbjTziJY";
  const response = await fetch(url, { headers, redirect: "follow" });
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!response.ok || bytes.subarray(0, 4).toString() !== "%PDF") {
    throw new Error(`Salamandra PDF inválido: HTTP ${response.status}`);
  }
  const output = path.join(root, "09-salamandra", "catalogo-oficial.pdf");
  fs.writeFileSync(output, bytes);
  return { source: "09-salamandra", pdfBytes: bytes.length };
}

(async () => {
  const results = [];
  for (const source of sources) results.push(await harvestSite(source));
  results.push(await downloadSalamandra());
  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
})().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
