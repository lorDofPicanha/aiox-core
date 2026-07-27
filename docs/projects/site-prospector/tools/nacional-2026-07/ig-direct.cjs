#!/usr/bin/env node
/**
 * Coleta fotos do Instagram SEM Apify — endpoint publico web_profile_info.
 * Substitui o pipeline pago depois que o credito Apify acabou.
 * uso: node ig-direct.cjs <loteInicial> <loteFinal>
 */
const fs = require('fs'); const path = require('path');
const SP = __dirname;
const BASE = 'D:/AIOS/docs/projects/site-prospector/03-proposal-mockups/_nacional-2026-07/_clientes';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
// Sec-Fetch-* sao obrigatorios: sem eles o IG devolve 400 "SecFetch Policy violation"
const HEADERS = {
  'User-Agent': UA,
  'x-ig-app-id': '936619743392459',
  'Accept': '*/*',
  'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Dest': 'empty',
  'X-Requested-With': 'XMLHttpRequest',
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

const NICHO_PT = {
  'food-gourmet': 'Food gourmet', bebida: 'Bebida artesanal', moda: 'Moda',
  'couro-bolsa': 'Couro & bolsas', joia: 'Joias', 'casa-deco': 'Casa & decoração',
  movel: 'Móveis', cosmetico: 'Cosméticos', pet: 'Pet', infantil: 'Infantil',
  papelaria: 'Papelaria', 'cutelaria-edc': 'Cutelaria & EDC', musica: 'Instrumentos',
};
const REF = {
  moda: 'Adanola · VISIONNAIRE · Numbered · HNST Studio · Everlane',
  'food-gourmet': 'Alison Roman · Hartzler Dairy · GRAZA · Busy Bee Honey · Assembly Coffee',
  cosmetico: "2.AG · Ashleyandco · UY Studio · Pa'lais · Seed",
  bebida: 'Fallen Grape · Altitude Beverages · Touchy Coffee · Little Amps · Escape Coffee',
  'casa-deco': 'Forner · Concrete Club Studio · Palette Supply · Anuc Home · INO',
  'couro-bolsa': 'MAKR · Abetterlou · Shelby · Everlane · Bang & Olufsen',
  movel: 'Relieve Furniture · Nornorm · Oakâme · Bang & Olufsen · Programa',
  musica: 'teenage engineering · Elektron · Superlative · Bang & Olufsen · New Genre',
  'cutelaria-edc': 'teenage engineering · Superlative · New Genre · Elektron · Three',
  joia: 'Franco Maria Ricci · Numbered · Ada · Adanola · MAKR ⚠️ ref de outro setor',
  papelaria: 'Agronomy Workshop · Concrete Club · Palette Supply · Helloivy · Paper ⚠️ ref de outro setor',
  pet: 'Busy Bee Honey · Hartzler Dairy · GRAZA · Adanola · MAKR ⚠️ ref de outro setor',
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

async function perfilRaw(user) {
  const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(user)}`;
  // Referer precisa apontar para o proprio perfil — faz parte da politica Sec-Fetch
  const res = await fetch(url, { headers: { ...HEADERS, Referer: `https://www.instagram.com/${user}/` } });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const j = await res.json();
  const u = j && j.data && j.data.user;
  if (!u) throw new Error('perfil sem dados');
  return u;
}

// retry com backoff — o IG devolve 400 quando o ritmo aperta
async function perfil(user) {
  const esperas = [0, 8000, 25000];
  let ultimo;
  for (let t = 0; t < esperas.length; t++) {
    if (esperas[t]) { process.stderr.write(`      rate-limit — aguardando ${esperas[t] / 1000}s\n`); await sleep(esperas[t]); }
    try { return await perfilRaw(user); }
    catch (e) { ultimo = e; if (!/HTTP 4[0-9][0-9]/.test(e.message)) throw e; }
  }
  throw ultimo;
}

function extrairImagens(u) {
  const m = u.edge_owner_to_timeline_media;
  const out = [];
  if (!m || !m.edges) return out;
  m.edges.forEach((e, i) => {
    const n = e.node;
    const tag = `post${String(i + 1).padStart(2, '0')}`;
    if (n.display_url) out.push({ url: n.display_url, tag });
    const kids = n.edge_sidecar_to_children;
    if (kids && kids.edges) {
      kids.edges.forEach((k, ki) => {
        if (ki === 0) return;
        if (k.node.display_url) out.push({ url: k.node.display_url, tag: `${tag}-img${ki + 1}` });
      });
    }
  });
  return out;
}

async function baixar(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const b = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, b);
  return b.length;
}

(async () => {
  const L0 = parseInt(process.argv[2] || '2', 10);
  const L1 = parseInt(process.argv[3] || '5', 10);
  const todos = JSON.parse(fs.readFileSync(path.join(SP, 'final100.json'), 'utf8'));
  const relatorioGeral = [];
  let processados = 0;

  for (let L = L0; L <= L1; L++) {
    const ini = (L - 1) * 20;
    const lote = todos.slice(ini, ini + 20);
    const OUT = path.join(BASE, `lote-0${L}`);
    fs.mkdirSync(OUT, { recursive: true });
    console.log(`\n===== LOTE ${L} (clientes ${ini + 1}-${ini + 20}) =====`);
    const rel = [];

    for (let i = 0; i < lote.length; i++) {
      const c = lote[i];
      const ig = (c.ig || '').replace('@', '');
      const dir = path.join(OUT, `${String(i + 1).padStart(2, '0')}-${slug(c.brand)}`);
      const fdir = path.join(dir, 'fotos');
      fs.mkdirSync(fdir, { recursive: true });

      // ja tem fotos? pula (idempotente)
      const jaTem = fs.existsSync(fdir) ? fs.readdirSync(fdir).filter(f => f.endsWith('.jpg')).length : 0;
      if (jaTem >= 10) {
        console.log(`  ${String(i + 1).padStart(2)}/20 ${c.brand.slice(0, 28).padEnd(28)} ja tem ${jaTem} — pulando`);
        rel.push({ n: i + 1, marca: c.brand, ig, fotos: jaTem, status: 'ja-existia' });
        continue;
      }

      let baixadas = 0, bytes = 0, erro = '';
      let u = null;
      try {
        u = await perfil(ig);
        const imgs = extrairImagens(u);
        for (const im of imgs) {
          try { bytes += await baixar(im.url, path.join(fdir, `${im.tag}.jpg`)); baixadas++; }
          catch { /* segue */ }
          await sleep(350);
        }
      } catch (e) { erro = e.message; }

      // brand-kit
      const nicho = c.nicho;
      let md = `---\nmarca: ${c.brand}\ninstagram: "@${ig}"\nnicho: ${nicho}\nseguidores: ${c.followers}\nposts_no_perfil: ${c.posts}\nlote: ${L}\ndata: 2026-07-26\nfonte_fotos: instagram web_profile_info (direto, sem Apify)\n---\n\n`;
      md += `# ${c.brand}\n\n`;
      md += `**Instagram:** [@${ig}](https://instagram.com/${ig}) · ${(c.followers || 0).toLocaleString('pt-BR')} seguidores · ${c.posts} posts\n`;
      md += `**Nicho:** ${NICHO_PT[nicho] || nicho}\n\n`;
      md += `## A lacuna\n\n**${LACUNA_PT[c.lacunaTipo] || c.lacunaTipo}**\n\n`;
      if (c.site) md += `- Site atual: ${c.site}\n`;
      if (c.evidencia) md += `- Evidência: \`${String(c.evidencia).slice(0, 160)}\`\n`;
      if (c.bioLink) md += `- Bio-link: ${c.bioLink}\n`;
      md += `\n## Material visual\n\n`;
      if (erro) {
        md += `> ❌ **Coleta falhou:** ${erro}\n> Re-rodar \`ig-direct.cjs\` para este perfil.\n\n`;
      } else {
        md += `- **${baixadas} fotos** em \`fotos/\` (${(bytes / 1048576).toFixed(1)} MB)\n`;
        md += `- Acervo total no perfil: **${c.posts} posts** (o endpoint público devolve as ~12 mais recentes)\n\n`;
      }
      md += `> ⚠️ **Fotos não inspecionadas.** Rodar \`photo-gate.cjs\` antes de construir.\n`;
      md += `> O gate tem falso-positivo com moldura chapada — confirmar no olho.\n\n`;
      md += `## Referências do nicho\n\n${REF[nicho] || 'n/d'}\n\nDESIGN.md em \`../../_referencias/\`.\n\n`;
      md += `## Pipeline de imagem\n\nRegra Bretda: **a IA gera o ambiente, nunca o produto.**\n`;
      md += `O produto sai destas fotos reais, recortado. Produto sintético é proibido.\n\n`;
      md += `## Pendências antes de contato\n\n- [ ] Verificar CNPJ — **não foi feito**\n- [ ] Inspecionar fotos + photo-gate\n- [ ] Identificar decisor\n- [ ] Confirmar que não é migração temporária\n- [ ] Revalidar (validade 30 dias)\n`;

      fs.writeFileSync(path.join(dir, 'brand-kit.md'), md);
      fs.writeFileSync(path.join(dir, 'perfil.json'), JSON.stringify({ ...c, fotosBaixadas: baixadas, bytes, erro }, null, 1));
      rel.push({ n: i + 1, marca: c.brand, ig, fotos: baixadas, mb: +(bytes / 1048576).toFixed(1), erro });
      console.log(`  ${String(i + 1).padStart(2)}/20 ${c.brand.slice(0, 28).padEnd(28)} ${baixadas} fotos ${erro ? '❌ ' + erro : ''}`);
      processados++;
            await sleep(4000);   // respeitar o rate limit do Instagram
    }

    fs.writeFileSync(path.join(OUT, '_relatorio.json'), JSON.stringify(rel, null, 1));
    const tot = rel.reduce((a, b) => a + (b.fotos || 0), 0);
    console.log(`  --> lote ${L}: ${tot} fotos · ${rel.filter(r => !r.fotos).length} sem foto`);
    relatorioGeral.push({ lote: L, fotos: tot, semFoto: rel.filter(r => !r.fotos).map(r => r.marca) });
  }

  console.log('\n===== RESUMO =====');
  relatorioGeral.forEach(r => console.log(`lote ${r.lote}: ${r.fotos} fotos | sem foto: ${r.semFoto.length}`));
})();
