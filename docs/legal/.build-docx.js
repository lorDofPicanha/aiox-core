// Build DOCX from the same HTML (preserving styles where DOCX supports them)
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC_HTML = path.join(ROOT, 'RELATORIO-CONSOLIDADO-SITE-PROSPECTOR-LEGAL-V1.html');
const OUT_DOCX = path.join(ROOT, 'RELATORIO-CONSOLIDADO-SITE-PROSPECTOR-LEGAL-V1.docx');

const htmlToDocx = require('C:/Users/kingp/AppData/Local/Temp/node_modules/html-to-docx');

const html = fs.readFileSync(SRC_HTML, 'utf-8');

// Strip the dark-theme CSS — Word handles light-mode best.
// Replace inline body styles with a print-friendly version that Word respects.
const lightHtml = html
  .replace(/--void-dark:\s*#0A0A0A/g, '--void-dark: #FFFFFF')
  .replace(/--surface:\s*#141414/g, '--surface: #F5F2EC')
  .replace(/--surface-overlay:\s*#1F1F1F/g, '--surface-overlay: #FAFAFA')
  .replace(/--warm-white:\s*#F5F2EC/g, '--warm-white: #0A0A0A')
  .replace(/--warm-white-muted:\s*#A8A39A/g, '--warm-white-muted: #555555')
  .replace(/--ink-muted:\s*#6B6862/g, '--ink-muted: #777777')
  .replace(/--border-subtle:\s*#2A2A2A/g, '--border-subtle: #CCCCCC')
  .replace(/--kinetic-limon:\s*#D1FF00/g, '--kinetic-limon: #6B7A00');

(async () => {
  const buffer = await htmlToDocx(lightHtml, null, {
    table: { row: { cantSplit: true } },
    footer: false,
    pageNumber: true,
    orientation: 'portrait',
    margins: { top: 1134, right: 907, bottom: 1134, left: 907 }, // ~2cm/1.6cm in twips
    font: 'Calibri',
    fontSize: 22, // 11pt in half-points
    title: 'Site-Prospector — Pacote Jurídico Consolidado v1',
    creator: 'AIOX Squad — legal-chief',
    description: 'AIOX Brand v2.0 — Dark Cockpit Edition (light-mode export)',
  });
  fs.writeFileSync(OUT_DOCX, buffer);
  const sizeKB = (fs.statSync(OUT_DOCX).size / 1024).toFixed(1);
  console.log(`✓ DOCX: ${OUT_DOCX} (${sizeKB} KB)`);
})().catch(e => { console.error('✗ DOCX error:', e.message); process.exit(1); });
