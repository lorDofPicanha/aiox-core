# -*- coding: utf-8 -*-
"""Reescreve TUDO que depende do endereco do site: og:url, canonical, og:image,
sitemap.xml, robots.txt e o JSON-LD. Rodar de novo quando o dominio mudar.

Uso:  python configurar-dominio.py https://talos.ia.br
"""
import os, re, sys, datetime

BASE = r"D:/AIOS/docs/projects/aiox-site/05-build/talos-site"
DOM = (sys.argv[1] if len(sys.argv) > 1 else "https://talos-site-neon.vercel.app").rstrip("/")
FONE = "+5547992789991"
# O e-mail NAO entra no JSON-LD: dado estruturado e texto puro no fonte, e robo de spam
# le. O telefone pode, porque ja esta publico nos links wa.me.
HOJE = datetime.date.today().isoformat()

PAGS = [("index.html", ""), ("licenca.html", "/licenca")]
log = []

JSONLD = """<script type="application/ld+json">{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Talos",
  "url": "%DOM%",
  "image": "%DOM%/assets/img/og-talos.jpg",
  "description": "Automacao de processos com IA aplicada na operacao: diagnostico, desenho, construcao e medicao do antes e depois.",
  "telephone": "%FONE%",
  "areaServed": { "@type": "Country", "name": "Brasil" },
  "address": { "@type": "PostalAddress", "addressRegion": "SC", "addressCountry": "BR" },
  "knowsLanguage": ["pt-BR"],
  "sameAs": []
}</script>"""


def aplicar(h, sufixo):
    # og:url / canonical / og:image apontam para o dominio atual
    h = re.sub(r'(<meta content=")[^"]*(" property="og:url">)', rf'\1{DOM}{sufixo}\2', h)
    h = re.sub(r'(<link rel="canonical" href=")[^"]*(">)', rf'\1{DOM}{sufixo}\2', h)
    h = re.sub(r'(<meta content=")https?://[^"]*(/assets/img/og-talos\.[a-z]+" property="og:image">)',
               rf'\1{DOM}\2', h)
    h = re.sub(r'(<meta content=")https?://[^"]*(/assets/img/og-talos\.[a-z]+" name="twitter:image">)',
               rf'\1{DOM}\2', h)
    return h


for nome, sufixo in PAGS:
    p = os.path.join(BASE, nome)
    h = open(p, encoding="utf-8").read()
    h = aplicar(h, sufixo)

    # medicao da Vercel: sem cookie, so precisa do painel ligado
    if "_vercel/insights" not in h:
        h = h.replace("</body>", '<script defer src="/_vercel/insights/script.js"></script></body>', 1)
        log.append(f"{nome}: script do Vercel Analytics adicionado")

    # dados estruturados so na home
    if sufixo == "":
        bloco = JSONLD.replace("%DOM%", DOM).replace("%FONE%", FONE)
        if "application/ld+json" in h:
            h = re.sub(r'<script type="application/ld\+json">.*?</script>', bloco, h, flags=re.S)
            log.append(f"{nome}: JSON-LD atualizado")
        else:
            h = h.replace("</head>", bloco + "</head>", 1)
            log.append(f"{nome}: JSON-LD (ProfessionalService) adicionado")

    open(p, "w", encoding="utf-8").write(h)
    log.append(f"{nome}: og:url, canonical e og:image -> {DOM}{sufixo}")

# sitemap
sm = ('<?xml version="1.0" encoding="UTF-8"?>\n'
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
      f'  <url><loc>{DOM}/</loc><lastmod>{HOJE}</lastmod><priority>1.0</priority></url>\n'
      '</urlset>\n')
open(os.path.join(BASE, "sitemap.xml"), "w", encoding="utf-8").write(sm)
log.append(f"sitemap.xml gerado (so a home — /licenca e noindex de proposito)")

# robots aponta para o sitemap
rb = f"User-agent: *\nAllow: /\nDisallow: /licenca\n\nSitemap: {DOM}/sitemap.xml\n"
open(os.path.join(BASE, "robots.txt"), "w", encoding="utf-8").write(rb)
log.append("robots.txt aponta para o sitemap")

print("\n".join("  " + x for x in log))
print(f"\n  dominio configurado: {DOM}")
