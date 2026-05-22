// Build script: AIOX-branded HTML + PDF from consolidated legal .md
// Usage: node .build-report.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'RELATORIO-CONSOLIDADO-SITE-PROSPECTOR-LEGAL-V1.md');
const OUT_HTML = path.join(ROOT, 'RELATORIO-CONSOLIDADO-SITE-PROSPECTOR-LEGAL-V1.html');
const OUT_PDF = path.join(ROOT, 'RELATORIO-CONSOLIDADO-SITE-PROSPECTOR-LEGAL-V1.pdf');

// Resolve marked from the @google/design.md transitive dep
let marked;
try {
  marked = require('marked');
} catch (e) {
  marked = require(path.join(ROOT, '..', '..', 'node_modules', '@google', 'design.md', 'node_modules', '@json-render', 'ink', 'node_modules', 'marked'));
}
const { marked: md } = marked;

// Read source, strip YAML frontmatter
const raw = fs.readFileSync(SRC, 'utf-8');
const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
const frontmatter = fmMatch ? fmMatch[1] : '';
const body = fmMatch ? fmMatch[2] : raw;

// Configure marked: GFM tables, code fences, no extra HTML escaping
md.setOptions({
  gfm: true,
  breaks: false,
  headerIds: true,
  mangle: false,
});

const bodyHtml = md.parse(body);

// AIOX brand-styled HTML template
const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Site-Prospector — Pacote Jurídico Consolidado v1 · AIOX Squad</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;900&family=Roboto+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  :root {
    --kinetic-limon: #D1FF00;
    --void-dark: #0A0A0A;
    --surface: #141414;
    --surface-overlay: #1F1F1F;
    --warm-white: #F5F2EC;
    --warm-white-muted: #A8A39A;
    --ink-muted: #6B6862;
    --border-subtle: #2A2A2A;
    --critical: #FF3B2E;
    --caution: #FFB800;
    --go: #00D97E;
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0;
    background: var(--void-dark);
    color: var(--warm-white);
    font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 16px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    max-width: 980px;
    margin: 0 auto;
    padding: 72px 64px;
  }
  /* ─── Header bar ─── */
  .brand-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 24px;
    margin-bottom: 56px;
    border-bottom: 1px solid var(--border-subtle);
  }
  .brand-bar .logo {
    font-family: 'Geist', sans-serif;
    font-weight: 900;
    font-size: 22px;
    letter-spacing: -0.02em;
    color: var(--warm-white);
  }
  .brand-bar .logo .x { color: var(--kinetic-limon); }
  .brand-bar .meta {
    font-family: 'Roboto Mono', monospace;
    font-size: 11px;
    color: var(--warm-white-muted);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  /* ─── Typography ─── */
  h1 {
    font-family: 'Geist', sans-serif;
    font-weight: 900;
    font-size: 44px;
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin: 56px 0 24px;
    color: var(--warm-white);
  }
  h1:first-of-type { margin-top: 0; }
  h2 {
    font-family: 'Geist', sans-serif;
    font-weight: 900;
    font-size: 28px;
    line-height: 1.15;
    letter-spacing: -0.015em;
    margin: 64px 0 20px;
    color: var(--warm-white);
    padding-top: 24px;
    border-top: 1px solid var(--border-subtle);
  }
  h2:first-of-type { border-top: none; padding-top: 0; }
  h3 {
    font-family: 'Geist', sans-serif;
    font-weight: 700;
    font-size: 20px;
    line-height: 1.25;
    margin: 40px 0 12px;
    color: var(--kinetic-limon);
  }
  h4 {
    font-family: 'Geist', sans-serif;
    font-weight: 700;
    font-size: 16px;
    line-height: 1.3;
    margin: 28px 0 8px;
    color: var(--warm-white);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  h5, h6 {
    font-family: 'Geist', sans-serif;
    font-weight: 700;
    font-size: 14px;
    margin: 20px 0 6px;
    color: var(--warm-white-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  p {
    margin: 0 0 16px;
    color: var(--warm-white);
    font-size: 16px;
    line-height: 1.65;
  }
  strong { color: var(--warm-white); font-weight: 700; }
  em { font-style: italic; color: var(--warm-white-muted); }
  a {
    color: var(--kinetic-limon);
    text-decoration: none;
    border-bottom: 1px solid rgba(209,255,0,0.3);
    transition: border-color 0.2s;
  }
  a:hover { border-bottom-color: var(--kinetic-limon); }
  hr {
    border: none;
    border-top: 1px solid var(--border-subtle);
    margin: 48px 0;
  }
  ul, ol { margin: 0 0 20px; padding-left: 24px; }
  li { margin-bottom: 6px; color: var(--warm-white); }
  li::marker { color: var(--kinetic-limon); }
  /* ─── Blockquote ─── */
  blockquote {
    margin: 24px 0;
    padding: 16px 24px;
    border-left: 3px solid var(--kinetic-limon);
    background: var(--surface);
    color: var(--warm-white-muted);
    font-style: italic;
  }
  blockquote p:last-child { margin-bottom: 0; }
  /* ─── Tables ─── */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0 32px;
    font-size: 14px;
  }
  thead { border-bottom: 2px solid var(--kinetic-limon); }
  th {
    text-align: left;
    padding: 10px 12px;
    font-family: 'Geist', sans-serif;
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--kinetic-limon);
    background: var(--surface);
  }
  td {
    padding: 10px 12px;
    border-bottom: 1px solid var(--border-subtle);
    vertical-align: top;
    color: var(--warm-white);
    line-height: 1.5;
  }
  tbody tr:hover { background: var(--surface); }
  /* ─── Code ─── */
  code {
    font-family: 'Roboto Mono', monospace;
    font-size: 13px;
    background: var(--surface);
    color: var(--kinetic-limon);
    padding: 2px 6px;
    border-radius: 2px;
  }
  pre {
    background: var(--surface);
    border: 1px solid var(--border-subtle);
    border-left: 3px solid var(--kinetic-limon);
    padding: 20px 24px;
    overflow-x: auto;
    margin: 24px 0;
    line-height: 1.55;
  }
  pre code {
    background: transparent;
    color: var(--warm-white);
    padding: 0;
    font-size: 13px;
  }
  /* ─── Badge-style emoji indicators ─── */
  p:has(> strong:first-child:contains("VERDICT")),
  td:contains("🔴"), td:contains("🟡"), td:contains("🟢"),
  td:contains("🟠") { font-weight: 500; }
  /* ─── Print/PDF optimizations ─── */
  @media print {
    @page {
      size: A4;
      margin: 18mm 16mm;
    }
    html, body {
      background: white;
      color: #0A0A0A;
      font-size: 11pt;
      line-height: 1.5;
    }
    .page {
      max-width: 100%;
      margin: 0;
      padding: 0;
    }
    .brand-bar {
      border-bottom-color: #0A0A0A;
    }
    .brand-bar .logo { color: #0A0A0A; }
    .brand-bar .logo .x { color: #6B7A00; }
    .brand-bar .meta { color: #555; }
    h1, h2, h4 { color: #0A0A0A; }
    h2 { border-top-color: #ccc; page-break-after: avoid; page-break-inside: avoid; }
    h3 { color: #6B7A00; page-break-after: avoid; }
    p, li { color: #1A1A1A; }
    a { color: #6B7A00; border-bottom-color: #999; }
    table { page-break-inside: avoid; }
    th { background: #F5F2EC; color: #0A0A0A; border-bottom: 2px solid #0A0A0A; }
    td { color: #1A1A1A; border-bottom-color: #ddd; }
    tbody tr:hover { background: transparent; }
    blockquote {
      background: #F5F2EC;
      border-left-color: #6B7A00;
      color: #1A1A1A;
    }
    code {
      background: #F5F2EC;
      color: #6B7A00;
      border: 1px solid #ddd;
    }
    pre {
      background: #F5F2EC;
      border-color: #ccc;
      border-left-color: #6B7A00;
      page-break-inside: avoid;
    }
    pre code { color: #1A1A1A; }
    h2 { page-break-before: auto; }
    hr { border-top-color: #ccc; }
  }
  /* ─── Footer ─── */
  .doc-footer {
    margin-top: 96px;
    padding-top: 24px;
    border-top: 1px solid var(--border-subtle);
    font-family: 'Roboto Mono', monospace;
    font-size: 11px;
    color: var(--warm-white-muted);
    letter-spacing: 0.04em;
  }
  .doc-footer .arrow { color: var(--kinetic-limon); }
  @media print {
    .doc-footer { color: #555; border-top-color: #ccc; }
    .doc-footer .arrow { color: #6B7A00; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="brand-bar">
    <div class="logo">AIO<span class="x">X</span> · Legal Brief</div>
    <div class="meta">v1 · 2026-05-15 · Confidential</div>
  </div>
  ${bodyHtml}
  <div class="doc-footer">
    <span class="arrow">A → I → O → X</span> · AIOX Squad v2.0 — Dark Cockpit Edition · brand.aioxsquad.ai/brandbook
  </div>
</div>
</body>
</html>`;

fs.writeFileSync(OUT_HTML, html, 'utf-8');
console.log(`✓ HTML: ${OUT_HTML} (${(fs.statSync(OUT_HTML).size / 1024).toFixed(1)} KB)`);

// Generate PDF via Chrome headless
const chromeExe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const fileUrl = 'file:///' + OUT_HTML.replace(/\\/g, '/');
const cmd = `"${chromeExe}" --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --print-to-pdf-no-header --print-to-pdf="${OUT_PDF}" "${fileUrl}"`;
try {
  execSync(cmd, { stdio: 'inherit', timeout: 120000 });
  if (fs.existsSync(OUT_PDF)) {
    console.log(`✓ PDF:  ${OUT_PDF} (${(fs.statSync(OUT_PDF).size / 1024).toFixed(1)} KB)`);
  } else {
    console.error('✗ PDF generation failed silently');
  }
} catch (e) {
  console.error('✗ Chrome PDF generation error:', e.message);
}
