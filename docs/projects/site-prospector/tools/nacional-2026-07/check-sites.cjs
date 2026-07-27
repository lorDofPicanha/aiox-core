#!/usr/bin/env node
/**
 * Testa a QUALIDADE do site dos bio-links classificados como TEM_SITE.
 * Site morto / "em breve" / plataforma default = lacuna material -> volta a ser prospect.
 */
const fs = require('fs'); const path = require('path'); const SP = __dirname;
const all = JSON.parse(fs.readFileSync(path.join(SP, 'bios-all.json'), 'utf8'));

const AFILIADO = /achadinh|achados|ofertas?|descont|promo[cç]|cupom|indica[cç]|divulga|garimp|variedades/i;
const EDUCACAO = /curso|aula|mentoria|treinamento|apostila|ebook|professor|escola\b|universidade|instituto\s+federal|senai|sebrae|senac|liceu|ufrgs|ucs\b/i;
const SERVICO = /consultoria|assessoria|advocacia|contabil|clinica|odonto|agendamento|psicolog|nutricion|personal|fisioterap|imobiliar|corretor|seguros|restaurante|pizzaria|hamburgueria|lanchonete|delivery/i;
const REVENDA = /revend|distribuidor|representante|multimarcas|informatica|eletronica|autopec/i;
const NICHO = /chocolat|cacau|confeit|doce|padaria|queij|geleia|conserva|mel\b|apiario|azeite|tempero|cafe|torref|cachac|alambique|vinicola|vinho|cervej|gin\b|destilaria|licor|kombucha|moda|autoral|praia|croche|tricot|bordado|alfaiat|noiva|bolsa|couro|marroquin|sapato|sandalia|chapeu|joia|joalher|ourives|prata|semijoia|bijuteria|ceramica|atelie|porcelana|vela|aromatiz|difusor|macrame|tapecaria|luminaria|marcenaria|movel|moveis|madeira|estofado|cosmetic|skincare|sabonete|saboaria|perfum|maquiagem|aroma|\bpet\b|coleira|petisco|brinquedo|montessori|infantil|bebe|enxoval|papelaria|planner|caderno|encaderna|cutelaria|faca|canivete|churrasco|camping|luthier|violao|instrumento|tabuleiro|artesanal|handmade/i;

// plataformas/sinais de site fraco
const PLAT_FRACA = /wix\.com|wixsite|weebly|webnode|blogspot|wordpress\.com|jimdo|google\s*sites|lojaintegrada|nuvemshop|montink|linktr/i;
const EM_BREVE = /em\s*breve|em\s*constru[çc][ãa]o|coming\s*soon|under\s*construction|site\s*suspenso|dom[íi]nio\s*(expirado|suspenso)|conta\s*suspensa|aguarde|volte\s*em\s*breve|parked|estamos\s*(chegando|preparando)/i;

const SOCIAL = /instagram\.com|facebook\.com|tiktok|youtube|twitter|x\.com|pinterest|linkedin|threads|kwai|wa\.me|whatsapp|t\.me|telegram|mailto:|tel:|maps\.google|linktr\.ee|beacons|bio\.link|shopee|elo7|mercadoliv|amazon\.|magazineluiza|americanas|shein|etsy|nuvemshop|lojaintegrada/i;

const cands = [];
all.forEach(x => {
  if (x.verdict !== 'TEM_SITE') return;
  const blob = `${x.brand || ''} ${x.bio || ''}`;
  if (AFILIADO.test(blob) || EDUCACAO.test(blob) || SERVICO.test(blob) || REVENDA.test(blob)) return;
  if (!NICHO.test(blob) && !NICHO.test(x.srcQuery || '')) return;
  const site = (x.links || []).find(l => l.url && !SOCIAL.test(l.url));
  if (!site) return;
  cands.push({ brand: x.brand, handle: x.handle, bioLink: x.url, site: site.url, bio: x.bio, srcQuery: x.srcQuery, links: x.links });
});

console.log('TEM_SITE que passam no filtro de marca/nicho:', cands.length);

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const out = [];

(async () => {
  const q = [...cands]; let done = 0;
  async function worker() {
    while (q.length) {
      const c = q.shift();
      let rec = { ...c, httpStatus: null, siteVerdict: '', evidencia: '' };
      try {
        const ctrl = new AbortController();
        const to = setTimeout(() => ctrl.abort(), 15000);
        const res = await fetch(c.site, { headers: { 'User-Agent': UA }, redirect: 'follow', signal: ctrl.signal });
        clearTimeout(to);
        rec.httpStatus = res.status;
        const html = (await res.text()).slice(0, 200000);
        const txt = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        if (!res.ok) { rec.siteVerdict = 'SITE_ERRO'; rec.evidencia = 'HTTP ' + res.status; }
        else if (EM_BREVE.test(txt)) {
          rec.siteVerdict = 'SITE_PLACEHOLDER';
          rec.evidencia = (txt.match(EM_BREVE) || [''])[0];
        } else if (html.length < 3000) { rec.siteVerdict = 'SITE_VAZIO'; rec.evidencia = html.length + ' bytes de HTML'; }
        else if (PLAT_FRACA.test(html)) {
          rec.siteVerdict = 'PLATAFORMA_FRACA';
          rec.evidencia = (html.match(PLAT_FRACA) || [''])[0];
        } else { rec.siteVerdict = 'SITE_OK'; rec.evidencia = html.length + ' bytes'; }
      } catch (e) {
        rec.siteVerdict = 'SITE_MORTO';
        rec.evidencia = String(e.message).slice(0, 60);
      }
      out.push(rec); done++;
      if (done % 40 === 0) process.stderr.write(`  ...${done}/${cands.length}\n`);
    }
  }
  await Promise.all(Array.from({ length: 10 }, worker));
  fs.writeFileSync(path.join(SP, 'site-checks.json'), JSON.stringify(out, null, 1));
  const v = {}; out.forEach(o => v[o.siteVerdict] = (v[o.siteVerdict] || 0) + 1);
  console.log('\n=== QUALIDADE DO SITE ===');
  Object.entries(v).sort((a, b) => b[1] - a[1]).forEach(([k, n]) => console.log(String(n).padStart(4), k));
  const rec = out.filter(o => o.siteVerdict !== 'SITE_OK');
  console.log('\nRECUPERADOS (site com lacuna material):', rec.length);
})();
