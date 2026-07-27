#!/usr/bin/env node
/**
 * Gera a biblioteca de referencias a partir de uma lista CURADA a mao
 * (o catalogo do Refero e majoritariamente SaaS — filtro automatico nao serve).
 * Cada ref sai com cores + fontes reais do catalogo local.
 */
const fs = require('fs'); const path = require('path');
const CACHE = 'C:/Users/kingp/.refero-cache';
const OUT = 'D:/AIOS/docs/projects/site-prospector/03-proposal-mockups/_nacional-2026-07/_referencias';
const SP = __dirname;

const cat = JSON.parse(fs.readFileSync(path.join(CACHE, 'catalog.json'), 'utf8'));
const curated = JSON.parse(fs.readFileSync(path.join(SP, 'curated.json'), 'utf8'));

const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
const byName = new Map();
cat.styles.forEach(s => byName.set(norm(s.siteName), s));

const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

const NICHO_PT = {
  '01-moda': 'Moda', '02-food-gourmet': 'Food gourmet', '03-cosmetico': 'Cosméticos',
  '04-bebida': 'Bebida artesanal', '05-casa-deco': 'Casa & decoração', '06-couro-bolsa': 'Couro & bolsas',
  '07-movel': 'Móveis', '08-musica': 'Instrumentos', '09-cutelaria-edc': 'Cutelaria & EDC',
  '10-joia': 'Joias', '11-papelaria': 'Papelaria', '12-pet': 'Pet',
};

let escritos = 0; const faltando = []; const resumo = [];

Object.entries(curated).forEach(([nicho, nomes]) => {
  const ok = [];
  nomes.forEach((nome, i) => {
    const s = byName.get(norm(nome));
    if (!s) { faltando.push(`${nicho}: ${nome}`); return; }
    const dir = path.join(OUT, nicho, `${String(ok.length + 1).padStart(2, '0')}-${slug(s.siteName)}`);
    fs.mkdirSync(dir, { recursive: true });

    let md = `---\nsource_url: ${s.url}\nsite_name: ${s.siteName}\ntheme: ${s.colorScheme || 'n/d'}\n`;
    md += `nicho: ${nicho} (${NICHO_PT[nicho]})\nfonte: refero (curadoria manual)\ndata: 2026-07-26\n---\n\n`;
    md += `# ${s.siteName}\n\n`;
    md += `**Site:** ${s.url}\n\n`;
    if (s.northStar) md += `## North Star\n\n> ${s.northStar}\n\n`;

    if (s.colors && s.colors.length) {
      md += `## Paleta\n\n| Hex | Nome | Papel |\n|---|---|---|\n`;
      s.colors.forEach(c => {
        const hex = c.hex || c.value || c.color || '';
        const role = (c.role || c.description || c.usage || '').toString().replace(/\|/g, '/').replace(/\n/g, ' ').slice(0, 180);
        md += `| \`${hex}\` | ${c.name || ''} | ${role} |\n`;
      });
      md += `\n`;
    }
    if (s.fonts && s.fonts.length) {
      md += `## Tipografia\n\n| Família | Uso |\n|---|---|\n`;
      s.fonts.forEach(f => {
        const fam = f.family || f.name || f.fontFamily || '';
        const use = (f.role || f.usage || f.description || '').toString().replace(/\|/g, '/').replace(/\n/g, ' ').slice(0, 140);
        md += `| ${fam} | ${use} |\n`;
      });
      md += `\n`;
    }

    md += `## Como usar este blueprint\n\n`;
    md += `Referência estrutural para o nicho **${NICHO_PT[nicho]}**. Padrão ADR-0004: a composição\n`;
    md += `aprovada é preservada; troca-se a identidade (tokens da marca), o conteúdo real e a mídia\n`;
    md += `first-party do cliente.\n\n`;
    md += `**Gate anti-clone (não-negociável):** similaridade máxima com esta referência —\n`;
    md += `cor ≤85% · tipografia ≤75% · layout ≤60%. É por isso que o nicho tem 5 referências:\n`;
    md += `cruzar fontes independentes é o que impede virar cópia de uma só.\n\n`;
    md += `**Teste de forkability antes de usar como fork:** medir o CSS externo. CSS minúsculo =\n`;
    md += `layout JS-driven que colapsa sem os bundles (caso \`nueno\`). Ver [[reference-forkability-test]].\n\n`;
    md += `**Screenshot:** ${s.screenshotUrl || 'n/d'}\n`;

    fs.writeFileSync(path.join(dir, 'DESIGN.md'), md);
    fs.writeFileSync(path.join(dir, 'style.json'), JSON.stringify(s, null, 1));
    ok.push(s.siteName); escritos++;
  });
  resumo.push({ nicho, label: NICHO_PT[nicho], escritos: ok.length, marcas: ok });
});

fs.writeFileSync(path.join(OUT, '_index.json'), JSON.stringify(resumo, null, 1));
console.log('DESIGN.md escritos:', escritos);
console.log('\n=== por nicho ===');
resumo.forEach(r => {
  const flag = r.escritos < 5 ? ` ⚠️ faltam ${5 - r.escritos}` : '';
  console.log(`${r.nicho.padEnd(18)} ${String(r.escritos)}/5${flag}`);
  if (r.marcas.length) console.log('   ' + r.marcas.join(' · '));
});
if (faltando.length) {
  console.log('\n=== nao achados no catalogo (' + faltando.length + ') ===');
  faltando.forEach(f => console.log('  ' + f));
}
