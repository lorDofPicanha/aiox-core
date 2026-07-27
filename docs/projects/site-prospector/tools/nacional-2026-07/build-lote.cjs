#!/usr/bin/env node
/**
 * Monta a pasta de cada cliente do lote: fotos + brand-kit.md + perfil.json
 * uso: node build-lote.cjs <numeroDoLote>
 */
const fs = require('fs'); const path = require('path');
const SP = __dirname;
const LOTE = process.argv[2] || '1';
const OUT = `D:/AIOS/docs/projects/site-prospector/03-proposal-mockups/_nacional-2026-07/_clientes/lote-0${LOTE}`;

const lote = JSON.parse(fs.readFileSync(path.join(SP, `lote${LOTE}.json`), 'utf8'));
const posts = JSON.parse(fs.readFileSync(path.join(SP, `lote${LOTE}-posts.json`), 'utf8'));

const NICHO_PT = {
  'food-gourmet': 'Food gourmet', bebida: 'Bebida artesanal', moda: 'Moda',
  'couro-bolsa': 'Couro & bolsas', joia: 'Joias', 'casa-deco': 'Casa & decoração',
  movel: 'Móveis', cosmetico: 'Cosméticos', pet: 'Pet', infantil: 'Infantil',
  papelaria: 'Papelaria', 'cutelaria-edc': 'Cutelaria & EDC', musica: 'Instrumentos',
};
const REF_POR_NICHO = {
  moda: 'Adanola · VISIONNAIRE · Numbered · HNST Studio · Everlane',
  'food-gourmet': 'Alison Roman · Hartzler Family Dairy · GRAZA · Busy Bee Honey · Assembly Coffee',
  cosmetico: '2.AG · Ashleyandco · UY Studio · Pa\'lais · Seed',
  bebida: 'Fallen Grape · Altitude Beverages · Touchy Coffee · Little Amps · Escape Coffee',
  'casa-deco': 'Forner · Concrete Club Studio · Palette Supply · Anuc Home · INO',
  'couro-bolsa': 'MAKR · Abetterlou · Shelby · Everlane · Bang & Olufsen',
  movel: 'Relieve Furniture · Nornorm · Oakâme · Bang & Olufsen · Programa',
  musica: 'teenage engineering · Elektron · Superlative · Bang & Olufsen · New Genre',
  'cutelaria-edc': 'teenage engineering · Superlative · New Genre · Elektron · Three',
  joia: 'Franco Maria Ricci · Numbered · Ada · Adanola · MAKR',
  papelaria: 'Agronomy Workshop · Concrete Club · Palette Supply · Helloivy · Paper',
  pet: 'Busy Bee Honey · Hartzler Dairy · GRAZA · Adanola · MAKR',
  infantil: 'Adanola · Busy Bee Honey · Palette Supply',
};
const LACUNA_PT = {
  SITE_PLACEHOLDER: 'site no ar mostrando só "em breve/em construção"',
  SITE_MORTO: 'domínio morto (DNS/conexão falha)',
  SITE_ERRO: 'site retorna erro HTTP',
  SITE_VAZIO: 'site praticamente vazio',
  PLATAFORMA_FRACA: 'site em plataforma/tema default',
  SO_CONTATO: 'nenhum site — só WhatsApp/redes',
  MARKETPLACE_SEM_SITE: 'vende em marketplace, sem site próprio',
  PLATAFORMA_PRONTA: 'só loja de plataforma, sem site de marca',
};

const slug = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 34) || 'sem-nome';

// agrupa posts por dono
const byUser = new Map();
posts.forEach(p => {
  const u = (p.ownerUsername || '').toLowerCase();
  if (!u) return;
  if (!byUser.has(u)) byUser.set(u, []);
  byUser.get(u).push(p);
});

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36';
async function baixar(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

(async () => {
  const relatorio = [];
  for (let i = 0; i < lote.length; i++) {
    const c = lote[i];
    const u = (c.ig || '').toLowerCase();
    const meus = byUser.get(u) || [];
    const dir = path.join(OUT, `${String(i + 1).padStart(2, '0')}-${slug(c.brand)}`);
    const fdir = path.join(dir, 'fotos');
    fs.mkdirSync(fdir, { recursive: true });

    // coletar URLs de imagem (post + carrossel)
    const imgs = [];
    meus.forEach((p, pi) => {
      if (p.displayUrl) imgs.push({ url: p.displayUrl, tag: `post${String(pi + 1).padStart(2, '0')}`, cap: p.caption || '', likes: p.likesCount || 0 });
      (p.images || []).forEach((im, ii) => imgs.push({ url: im, tag: `post${String(pi + 1).padStart(2, '0')}-img${ii + 2}`, cap: p.caption || '', likes: p.likesCount || 0 }));
    });

    let baixadas = 0, bytes = 0;
    for (const im of imgs.slice(0, 40)) {
      try {
        const n = await baixar(im.url, path.join(fdir, `${im.tag}.jpg`));
        bytes += n; baixadas++;
      } catch { /* segue */ }
    }

    // brand-kit
    const nichoLabel = NICHO_PT[c.nicho] || c.nicho;
    let md = `---\nmarca: ${c.brand}\ninstagram: "@${c.ig}"\nnicho: ${c.nicho}\nseguidores: ${c.followers}\nposts_no_perfil: ${c.posts}\nlote: ${LOTE}\ndata: 2026-07-26\n---\n\n`;
    md += `# ${c.brand}\n\n`;
    md += `**Instagram:** [@${c.ig}](https://instagram.com/${c.ig}) · ${(c.followers || 0).toLocaleString('pt-BR')} seguidores · ${c.posts} posts\n`;
    md += `**Nicho:** ${nichoLabel}\n\n`;
    md += `## A lacuna\n\n**${LACUNA_PT[c.lacuna] || c.lacuna}**\n\n`;
    if (c.site) md += `- Site atual: ${c.site}\n`;
    if (c.evidencia) md += `- Evidência: \`${String(c.evidencia).slice(0, 160)}\`\n`;
    if (c.bioLink) md += `- Bio-link: ${c.bioLink}\n`;
    md += `\n## Material visual disponível\n\n`;
    md += `- **${baixadas} fotos** baixadas em \`fotos/\` (${(bytes / 1048576).toFixed(1)} MB)\n`;
    md += `- Acervo total no perfil: **${c.posts} posts**\n\n`;
    md += `> ⚠️ **As fotos ainda não foram inspecionadas.** Rodar \`photo-gate.cjs\` antes de construir.\n`;
    md += `> O gate tem falso-positivo conhecido com moldura chapada (polaroid, slide de carrossel) —\n`;
    md += `> confirmar no olho. Ver [[feedback-site-prospector-real-code-photo-gate]].\n\n`;
    md += `## Referências do nicho\n\n`;
    md += `${REF_POR_NICHO[c.nicho] || 'n/d'}\n\n`;
    md += `DESIGN.md completo de cada uma em \`../../_referencias/\`.\n\n`;
    md += `## Pipeline de imagem\n\n`;
    md += `Sem sessão de fotos presencial, vale o guardrail da regra Bretda:\n`;
    md += `**a IA gera o ambiente/cenário, nunca o produto.** O produto sai destas fotos reais,\n`;
    md += `recortado (\`photo-gate.cjs\` + keyer). Produto 100% sintético é proibido —\n`;
    md += `precedente: Cataia Moda Praia foi reprovada por marca d'água do Gemini.\n\n`;
    md += `## Pendências antes de qualquer contato\n\n`;
    md += `- [ ] Verificar CNPJ (situação cadastral) — **não foi feito**\n`;
    md += `- [ ] Inspecionar as fotos no olho + rodar photo-gate\n`;
    md += `- [ ] Identificar decisor\n`;
    md += `- [ ] Confirmar que a lacuna não é migração temporária\n`;
    md += `- [ ] Revalidar site/perfil (pesquisa tem validade de 30 dias)\n`;

    fs.writeFileSync(path.join(dir, 'brand-kit.md'), md);
    fs.writeFileSync(path.join(dir, 'perfil.json'), JSON.stringify({ ...c, fotosBaixadas: baixadas, bytes }, null, 1));
    relatorio.push({ n: i + 1, marca: c.brand, ig: c.ig, fotos: baixadas, mb: +(bytes / 1048576).toFixed(1) });
    process.stderr.write(`  ${String(i + 1).padStart(2)}/20 ${c.brand.slice(0, 28).padEnd(28)} ${baixadas} fotos\n`);
  }

  fs.writeFileSync(path.join(OUT, '_relatorio.json'), JSON.stringify(relatorio, null, 1));
  const tot = relatorio.reduce((a, b) => a + b.fotos, 0);
  const mb = relatorio.reduce((a, b) => a + b.mb, 0);
  console.log(`\nlote ${LOTE}: ${relatorio.length} clientes · ${tot} fotos · ${mb.toFixed(1)} MB`);
  console.log('sem foto:', relatorio.filter(r => !r.fotos).map(r => r.marca).join(', ') || 'nenhum');
})();
