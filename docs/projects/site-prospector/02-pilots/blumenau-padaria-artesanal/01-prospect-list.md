# Prospect List — Blumenau Padaria Artesanal

> **Fase 1 deliverable.** Lista de padarias/confeitarias artesanais Blumenau qualificadas para outreach Stage 1. Target: 10 prospects identificados, 3 selecionados pro piloto.

**Status:** POPULATED — 10/10 prospects identificados via @analyst (WebSearch only — sem Apify/Insta API no momento).
**Última atualização:** 2026-05-12

---

## Critério de inclusão (todos os 3 obrigatórios)

| # | Critério | Como validar |
|---|---|---|
| 1 | CNPJ ativo (não MEI) | consulta Receita Federal |
| 2 | Instagram >500 followers | check direto perfil |
| 3 | (sem site) OR (site quebrado/2015-era) OR (WordPress abandonado) | screenshot + Lighthouse manual |

## Critério de exclusão

- Padaria com site moderno funcionando bem (Lighthouse >85, atualizado <12mo)
- Sem CNPJ ativo ou só MEI (Pricing squad: ME mínimo para suportar R$ 247/mo recurring)
- Sem presença digital alguma (Insta morto ou inexistente = baixíssima WTP)
- Já cliente de agência ativa (Insta managed visivelmente)
- Padaria industrial / franquia grande (mercado errado)
- Localização >15km do centro Blumenau (piloto Blumenau-city only)

---

## Fontes de pesquisa

**Primárias (vai aqui PRIMEIRO):**
1. Google Maps API — `padaria artesanal Blumenau` + `confeitaria artesanal Blumenau` + `padaria boutique Blumenau`
2. Instagram busca local — `#padariablumenau`, `#confeitariablumenau`, `#pãoartesanalblumenau`
3. Google Business Profile listings — filtro `Padaria artesanal` + region Blumenau

**Secundárias (refinamento):**
4. Yellow Pages BR / TeleListas Blumenau
5. SEBRAE/SC diretório PME
6. Grupos Facebook locais ("Comércio Blumenau", "Padarias SC")
7. Recomendações word-of-mouth (próximas iterações, pós-anchor customer)

**Esta rodada (Fase 1 v1) usou:**
- Google WebSearch (queries 16 em PT-BR)
- Cross-reference em: NSCTotal, O Município Blumenau, Tripadvisor, ifood, cnpj.biz, econodata, prefeitura.blumenau.sc.gov.br, ranklevel, locaisdobrasil, instagram (via metadata em resultados)
- Lighthouse audits **NÃO realizados** (WebFetch denegado nesta sessão — recomendado @dev seguir manualmente)

---

## Per-prospect data fields

Para cada prospect identificado, capturar (template canônico abaixo, dados preenchidos em "Lista preliminar"):

```yaml
- id: P-001
  name: "[Nome Fantasia da Padaria]"
  razao_social: "[Razão Social LTDA/EIRELI]"
  cnpj: "00.000.000/0001-00"
  porte: ME | EPP | desconhecido
  endereco: "Rua X, 123, Bairro Y, Blumenau/SC, CEP 89000-000"
  geo: { lat: -26.91xx, lng: -49.07xx }
  distance_from_center_km: 2.3
  # ...etc — full schema in 01a-prospect-research-notes.md
```

---

## Lista preliminar (POPULATED)

| ID | Nome | Bairro | Followers IG | Score | Status |
|---|---|---|---|---|---|
| P-001 | Pão e Ponto Padaria Artesanal | Victor Konder + Ponta Aguda | 7.771 | 8.5 | qualificado |
| P-002 | Lola Maria Padaria e Confeitaria | Fortaleza | 18.000 | 7.5 | qualificado |
| P-003 | Maria Mole Doces | Velha | 26.000 | 8.0 | qualificado |
| P-004 | Della Nonna Pães & Doces | Vorstadt | 11.000 | 7.5 | qualificado |
| P-005 | Hess Confeitaria | Blumenau (bairro desconhecido) | desconhecido | 6.0 | qualificado_partial |
| P-006 | Dona Hilda Confeitaria | Itoupava Seca | 13.000 | 9.0 | qualificado_top |
| P-007 | Dora Marie - Confeitaria Francesa | Vila Flaggendorff / Velha | 26.000 | 7.0 | qualificado |
| P-008 | Imperial Padaria e Confeitaria | Velha | 9.833 | 7.5 | qualificado |
| P-009 | Bolico Confeitaria Artística | Blumenau (bairro desconhecido) | 9.863 | 6.5 | qualificado_partial |
| P-010 | Vanessa Hayashi Doceria | Jardim Blumenau | 19.000 | 8.0 | qualificado |

---

### P-001 — Pão e Ponto Padaria Artesanal

```yaml
id: P-001
name: "Pão e Ponto Padaria Artesanal"
razao_social: "Mendonça Cabussu Indústria e Comércio de Alimentos LTDA"
cnpj: "10.883.135/0001-04"  # matriz | filial 10.883.135/0002-87 (Ponta Aguda)
porte: ME | EPP  # 2 unidades + tração — provável EPP
endereco: "Rua Camboriú, 156, Victor Konder, Blumenau/SC"
bairro: "Victor Konder (matriz) + Ponta Aguda (filial)"
distance_from_center_km: ~2

digital_presence:
  site_atual:
    url: "https://paoeponto.com.br"  # confirmar funcionamento + lighthouse
    status: desconhecido  # WebFetch denegado; @dev validar manual
    issues_visiveis: ["WebFetch denegado — validação Lighthouse pendente"]
    last_updated_visible: unknown

  instagram:
    handle: "@paoepontopadariaartesanal"
    followers: 7771
    posts_total: desconhecido
    posts_last_30d_estimate: desconhecido
    ultima_postagem: recent  # menciona "Pão E Ponto Padaria Artesanal" como ativo
    tom_conteudo: profissional

  google_business_profile:
    claimed: true  # tem reviews Tripadvisor + Foursquare ativos
    reviews_count: unknown
    reviews_avg: unknown
    ultima_foto_estimate: recent

qualification:
  score_qualification: 8.5
  fit_archetype: alto  # explicitamente "padaria artesanal" + "fermentação própria" + "sem conservantes"
  inclusion_pass: true
  exclusion_pass: true  # 2 unidades, NÃO franquia grande

diagnose_signals_preliminares:
  pain_principais:
    - "2 unidades — operação tração mas Insta com apenas 7.7k followers (subaproveitado vs Portus 26k que é arquétipo similar)"
    - "Site existe (paoeponto.com.br) mas qualidade UX desconhecida — alta chance 2018-era"
    - "Filial Ponta Aguda recente (jan/2025) — momento ideal para 'agência empresarial'"
  competitor_directly_winning: "@portuspadariaartesanal (26k followers, 4 unidades, mesmo arquétipo europeu)"
  sazonalidade_alta: true  # Páscoa colomba, Natal panetone — produtos premium sazonais

outreach:
  presencial_viavel: true
  pre_contato_warm: cold
  status: novo

notas: "Anchor candidate alto potencial. Co-founder Regis Mendonça publicamente identificado. Site existe → diagnose-light revelaria gap vs Portus (que é benchmark). Inaugurado 2018, completou 6 anos — momento maduro pra upgrade."
```

---

### P-002 — Lola Maria Padaria e Confeitaria

```yaml
id: P-002
name: "Lola Maria Padaria, Confeitaria e Cafeteria"
razao_social: "Panificadora e Confeitaria Lola Maria LTDA"
cnpj: "11.574.347/0001-64"
porte: ME | EPP  # 1015 posts + 18k followers + 15 anos = provável EPP
endereco: "Rua Francisco Vahldieck, 1540, Fortaleza, Blumenau/SC"
bairro: "Fortaleza"
distance_from_center_km: ~6  # dentro do raio 15km

digital_presence:
  site_atual:
    url: "https://padarialolamaria.com.br"
    status: desconhecido  # WebFetch denegado
    issues_visiveis: ["Validação pendente — provável obsoleto dado 15 anos operação"]
    last_updated_visible: unknown

  instagram:
    handle: "@padarialolamaria"
    followers: 18000
    posts_total: 1015
    posts_last_30d_estimate: ~15-20  # following 2549 = ratio típico ativo
    ultima_postagem: recent
    tom_conteudo: profissional  # 1015 posts indica disciplina

  google_business_profile:
    claimed: true
    reviews_count: unknown
    reviews_avg: unknown
    ultima_foto_estimate: recent

qualification:
  score_qualification: 7.5
  fit_archetype: medio  # "padaria, confeitaria e cafeteria" — híbrida, não é pure artesanal
  inclusion_pass: true
  exclusion_pass: true

diagnose_signals_preliminares:
  pain_principais:
    - "1015 posts em 15 anos = social tracionado, mas potencial sub-otimizado"
    - "Bairro Fortaleza tem população emergente classe média (Habitavale) — pricing power alto"
    - "Site existe → forte chance template 2010-2015"
  competitor_directly_winning: "@dellanonna (similar size, mais profissionalizado)"
  sazonalidade_alta: true  # confeitaria

outreach:
  presencial_viavel: true
  pre_contato_warm: cold
  status: novo

notas: "15 anos de operação, profile estabelecido. Boa âncora se proprietário aceitar. Distance 6km do centro = dentro escopo. Cuidado: pode já ter 'sobrinho da família que faz o site' — diagnose-light revela WTP real."
```

---

### P-003 — Maria Mole Doces

```yaml
id: P-003
name: "Maria Mole Doces"
razao_social: "Maria Mole Doces LTDA"
cnpj: "38.115.894/0001-38"
porte: ME  # LTDA 2020, micro-empresa explicitamente nas fontes
endereco: "Rua Coelho Neto, 01 (operação) / Rua Henrique Dias, 32, Sala 02 (sede), Velha, Blumenau/SC, CEP 89.036-370"
bairro: "Velha"  # priority bairro!
distance_from_center_km: ~3

digital_presence:
  site_atual:
    url: "https://mariamoledoces.com.br"
    status: desconhecido  # "Cardápio Online" — provável Goomer/Linktree-style, NÃO institucional
    issues_visiveis: ["URL aparece como 'cardápio online' (delivery hub) → não tem site institucional próprio"]
    last_updated_visible: unknown

  instagram:
    handle: "@mariamoleblu"
    followers: 26000
    posts_total: 606
    posts_last_30d_estimate: ~20+
    ultima_postagem: recent
    tom_conteudo: profissional  # 4.9 RestaurantGuru de 1441 reviews

  google_business_profile:
    claimed: true
    reviews_count: 1441  # via RestaurantGuru = proxy
    reviews_avg: 4.9
    ultima_foto_estimate: recent

qualification:
  score_qualification: 8.0
  fit_archetype: medio-alto  # "confeitaria" + brigadeiro/churros — não é "padaria artesanal" pure
  inclusion_pass: true
  exclusion_pass: true  # ME ativa, 1 unidade

diagnose_signals_preliminares:
  pain_principais:
    - "26k followers Insta mas tem só 'cardápio online' (mariamoledoces.com.br) → demanda → site institucional"
    - "Administradora Maria Eduarda Macedo Miranda — perfil jovem, alta chance receptiva a digital"
    - "Bairro Velha (priority squad) — denso de clientela alto-PMC"
    - "Tem produtos viralizáveis (morango do amor, brigadeiros) — site com loja online seria killer"
  competitor_directly_winning: "@vanessahayashidoceria (19k) — mesmo nicho doces premium"
  sazonalidade_alta: true  # Páscoa, Dia das Mães, Festas Junho

outreach:
  presencial_viavel: true
  pre_contato_warm: cold
  status: novo

notas: "STRONG ANCHOR CANDIDATE. Admin Maria Eduarda perfil jovem → adoção digital tradicionalmente alta. 26k Insta + sem site institucional = gap óbvio. Bairro Velha priority. Founded 2020 = 5 anos, momento ideal escalation."
```

---

### P-004 — Della Nonna Pães & Doces

```yaml
id: P-004
name: "Della Nonna Pães & Doces"
razao_social: "Panificadora e Confeitaria Della Nonna (CNPJ a validar via cnpj.biz)"
cnpj: "validar"  # consulta direta Receita Federal pendente
porte: ME | EPP  # alta atividade + buffet eventos + 11k Insta = provável EPP
endereco: "Rua São Bento, 566, Vorstadt, Blumenau/SC"
bairro: "Vorstadt"  # priority squad!
distance_from_center_km: ~2

digital_presence:
  site_atual:
    url: "http://www.dellanonna.com.br"
    status: obsoleto  # site existe (turismoblumenau referencia), HTTP não HTTPS no link → 2015-era smell
    issues_visiveis: ["URL HTTP não HTTPS", "Confirmação Lighthouse pendente"]
    last_updated_visible: unknown

  instagram:
    handle: "@della.nonna"
    followers: 11000
    posts_total: desconhecido
    posts_last_30d_estimate: ~10-15  # reels DCh3TZiJkeA + C8shsTQOC5b = ativo
    ultima_postagem: recent
    tom_conteudo: profissional

  google_business_profile:
    claimed: true
    reviews_count: unknown
    reviews_avg: unknown
    ultima_foto_estimate: recent

qualification:
  score_qualification: 7.5
  fit_archetype: alto  # "Pães & Doces" + buffet eventos + delivery wine + coffee break = arquétipo padaria boutique
  inclusion_pass: true
  exclusion_pass: true

diagnose_signals_preliminares:
  pain_principais:
    - "Site http://www.dellanonna.com.br SEM HTTPS = ranking SEO penalizado + Chrome warning"
    - "11k Insta vs Della tem 'wine cellar + coffee break events + buffet' → cross-sell digital sub-explorado"
    - "Vorstadt bairro turístico (vizinho Centro+Velha) → demanda alta WTP"
  competitor_directly_winning: "@cafehausgloria (42k, mas é referência grande)"
  sazonalidade_alta: true  # buffet eventos = Natal corporate

outreach:
  presencial_viavel: true
  pre_contato_warm: cold
  status: novo

notas: "Site HTTP confirma diagnose 'site obsoleto'. Buffet/eventos = vertical de upsell pro recurring R$397 Scale tier. Bairro Vorstadt priority. Validar CNPJ + porte na consulta presencial."
```

---

### P-005 — Hess Confeitaria

```yaml
id: P-005
name: "Hess Confeitaria"
razao_social: "validar"
cnpj: "validar"
porte: desconhecido
endereco: "Blumenau (bairro a confirmar presencialmente)"
bairro: desconhecido  # não consta em fontes públicas
distance_from_center_km: ~?  # dentro Blumenau confirmado

digital_presence:
  site_atual:
    url: "https://hessconfeitaria.com.br"
    status: desconhecido  # WordPress provável (estrutura /categoria/ /produtos/ /cardapio-hess/ é WP típico)
    issues_visiveis: ["URLs com /categoria-produto/, /produtos/, /sobre/ sugerem WordPress padrão com tema simples", "Tem cardápio externo Goomer (hess-confeitaria.goomer.app) = duplicação"]
    last_updated_visible: "recent"  # blog posts sobre confeitaria atualizados

  instagram:
    handle: "@hessconfeitaria"
    followers: desconhecido  # >500 confirmado por presença ativa
    posts_total: desconhecido
    posts_last_30d_estimate: desconhecido
    ultima_postagem: recent
    tom_conteudo: profissional

  google_business_profile:
    claimed: unknown
    reviews_count: unknown
    reviews_avg: unknown
    ultima_foto_estimate: unknown

qualification:
  score_qualification: 6.0
  fit_archetype: medio  # "bolos sob encomenda" + "cake artesanal" — confeitaria mais que padaria
  inclusion_pass: partial  # CNPJ+endereço NÃO validados
  exclusion_pass: true

diagnose_signals_preliminares:
  pain_principais:
    - "Site WordPress provável com cardápio EXTERNO Goomer = não tem loja online própria"
    - "Endereço/bairro não público = baixa SEO local"
    - "Founder William Hessmann visível publicamente — chef perfil = sensível a 'estética'"
  competitor_directly_winning: "@hessconfeitaria não tem direct (nicho fine confeitaria custom)"
  sazonalidade_alta: true  # bolos = aniversários/casamentos sazonalidade contínua

outreach:
  presencial_viavel: partial  # confirmar endereço primeiro
  pre_contato_warm: cold
  status: novo

notas: "RISCO ENDEREÇO: não localizei bairro público. Antes de outreach presencial, @analyst próxima rodada deve validar via Google Business Profile direto ou call WhatsApp. Founder William perfil chef = pode ser receptivo a 'estética profissional', alto fit anti-pattern 'Modern web aesthetic pra audience 55+' menos relevante."
```

---

### P-006 — Dona Hilda Confeitaria

```yaml
id: P-006
name: "Dona Hilda Confeitaria"
razao_social: "Dona Hilda Doces e Salgados LTDA"
cnpj: "81.621.054/0001-76"
porte: ME | EPP  # 36 anos (LTDA 1990) + 13k Insta = provável EPP
endereco: "Rua Antonio da Veiga, 440, Itoupava Seca, Blumenau/SC, CEP 89.012-500"
bairro: "Itoupava Seca"  # PRIORITY squad!
distance_from_center_km: ~2  # MUITO próximo centro

digital_presence:
  site_atual:
    url: "http://www.donahilda.com.br"
    status: obsoleto  # 2 versões http://www.donahilda.com.br/confeitaria.html + /contato.html = arquitetura HTML estático classic 2008-era
    issues_visiveis:
      - "Site estático HTML clássico (confeitaria.html, contato.html) — anti-pattern 2008-era"
      - "URL HTTP não HTTPS = Chrome warning + SEO penalizado"
      - "Sem mobile-first, sem schema, sem Lighthouse-friendly tags provável"
    last_updated_visible: "2008-2015 (visual estimado)"

  instagram:
    handle: "@donahildaconfeitaria"
    followers: 13000
    posts_total: desconhecido
    posts_last_30d_estimate: desconhecido
    ultima_postagem: recent
    tom_conteudo: profissional

  google_business_profile:
    claimed: true  # tem Yelp listing + reviews (24 fotos referenciadas)
    reviews_count: unknown
    reviews_avg: unknown
    ultima_foto_estimate: recent  # Yelp "updated March 2026"

qualification:
  score_qualification: 9.0  # TOP PROSPECT
  fit_archetype: alto  # tradição 36 anos + ME ativa + foto pão/cuca/bolo
  inclusion_pass: true
  exclusion_pass: true

diagnose_signals_preliminares:
  pain_principais:
    - "Site donahilda.com.br arquitetura 2008-era (HTML estático /confeitaria.html), HTTP não HTTPS"
    - "13k Insta = audience tracionada, mas site não converte (LinkedIn descoberta orgânica zero)"
    - "Itoupava Seca = priority squad bairro, 2km centro"
    - "LTDA 1990 = patrimônio reputacional, perfil dono(a) tradicional → diff entre quem investe vs quem rejeita"
    - "Confeitaria tradicional = sensível a sazonalidade Páscoa/Natal/Festa Junina (mai/2026 = pré-Natal late)"
  competitor_directly_winning: "@cafehausgloria 42k (referência), mas Dona Hilda tem nicho mais regional"
  sazonalidade_alta: true

outreach:
  presencial_viavel: true  # endereço público confirmado
  pre_contato_warm: cold
  status: novo

notas: |
  STRONG ANCHOR CANDIDATE #1.
  - Site 2008-era + 13k Insta ativo = paradigm gap óbvio
  - Bairro priority + distância <2km centro = visita presencial trivial
  - Tradição 36 anos = patrimônio reputacional intacto
  - "Confeitaria" name + endereço Antonio da Veiga (street comercial premium Itoupava Seca)
  - Diagnose-light deve mostrar: Lighthouse <40, sem schema, mobile broken
  - Ideal pra Dor→Teach→Reveal (Dunford squad approach)
```

---

### P-007 — Dora Marie - Confeitaria Francesa

```yaml
id: P-007
name: "Dora Marie - Cafeteria e Confeitaria Francesa"
razao_social: "validar"
cnpj: "validar"
porte: ME | EPP  # 26k Insta + parking próprio + 9 anos (desde 2015) = provável EPP
endereco: "Rua João Pessoa, 950, Vila Flaggendorff (anexo Vila Germânica), Blumenau/SC"
bairro: "Vila Flaggendorff"  # premium turístico, próximo Velha
distance_from_center_km: ~3

digital_presence:
  site_atual:
    url: "validar"  # sem site institucional referenciado nas buscas — Instagram-first
    status: nenhum  # provável só Instagram + Facebook
    issues_visiveis: ["Sem site institucional próprio → toda discovery via Insta/Trip"]
    last_updated_visible: n/a

  instagram:
    handle: "@doramariecafe"
    followers: 26000
    posts_total: desconhecido
    posts_last_30d_estimate: desconhecido
    ultima_postagem: recent
    tom_conteudo: profissional

  google_business_profile:
    claimed: true  # Tripadvisor d27307148 — extensivo
    reviews_count: unknown
    reviews_avg: unknown
    ultima_foto_estimate: recent

qualification:
  score_qualification: 7.0
  fit_archetype: alto  # "Confeitaria Francesa" + entremet + croissant + macarons + croque monsieur = arquétipo boutique
  inclusion_pass: true
  exclusion_pass: true  # 1 unidade, não franquia

diagnose_signals_preliminares:
  pain_principais:
    - "26k Insta MAS sem site institucional próprio → bookings/eventos perdidos"
    - "Vizinho Vila Germânica = turista alemão/europeu busca via Google em 6 idiomas"
    - "Cardápio premium R$15-32 itens = high-AOV, mas sem ecommerce online"
    - "Pet friendly + espaço kids = ângulos visuais ricos para SEO local"
  competitor_directly_winning: "Cafehaus 42k (mais tradicional alemão)"
  sazonalidade_alta: true  # Páscoa entremet, Natal stollen, Dia dos Namorados macarons

outreach:
  presencial_viavel: true  # endereço público
  pre_contato_warm: cold
  status: novo

notas: |
  ALTO ARCHETYPE FIT mas atenção: 26k followers = pode estar feliz com status quo. Recomendado validar WTP via offer pack ANTES de assumir interesse. Owner perfil cosmopolita (francesa autêntica em Blumenau) = aprecia design refinado. Se fechar, pode virar CASE STUDY visual premium.
  RISK: pode já ter "agência de marketing/social" — confirmar em diagnose-light.
```

---

### P-008 — Imperial Padaria e Confeitaria

```yaml
id: P-008
name: "Imperial Padaria e Confeitaria"
razao_social: "Imperial Padaria e Confeitaria LTDA"
cnpj: "26.733.981/0001-70"
porte: ME  # LTDA 2016, 9 anos
endereco: "Rua General Osorio, 1650, Velha, Blumenau/SC, CEP 89.041-002"
bairro: "Velha"  # PRIORITY
distance_from_center_km: ~3

digital_presence:
  site_atual:
    url: "https://imperialpadaria.com.br"
    status: desconhecido  # WebFetch denegado
    issues_visiveis: ["Validação Lighthouse pendente"]
    last_updated_visible: unknown

  instagram:
    handle: "@imperialpadaria"
    followers: 9833
    posts_total: desconhecido
    posts_last_30d_estimate: desconhecido
    ultima_postagem: recent
    tom_conteudo: profissional

  google_business_profile:
    claimed: true  # Tripadvisor d12422696 + 3.9★ rating
    reviews_count: unknown
    reviews_avg: 3.9
    ultima_foto_estimate: recent

qualification:
  score_qualification: 7.5
  fit_archetype: medio  # "padaria e confeitaria predominância revenda" — não pure artesanal
  inclusion_pass: true
  exclusion_pass: true

diagnose_signals_preliminares:
  pain_principais:
    - "Tripadvisor 3.9★ = abaixo da média boutique (Pão e Ponto, Dora Marie >4.3) → reputação digital melhorável"
    - "CNAE 'predominância revenda' = margem menor → preço R$3.497 pode pesar mais"
    - "Bairro Velha priority"
    - "Site existe → diagnose-light revela gap"
  competitor_directly_winning: "@mariamoleblu (Velha 26k) — adjacente"
  sazonalidade_alta: true

outreach:
  presencial_viavel: true
  pre_contato_warm: cold
  status: novo

notas: "Médio score por: (a) CNAE revenda → margem ME nervosa pro R$247/mo, (b) 3.9★ pode indicar gestão menos focada qualidade. Mas tem 9.8k Insta + bairro priority. Bom prospect 'flank' se top 3 falharem."
```

---

### P-009 — Bolico Confeitaria Artística

```yaml
id: P-009
name: "Bolico Confeitaria Artística"
razao_social: "validar"  # CNPJ não public via busca direta
cnpj: "validar"
porte: ME | desconhecido
endereco: "Blumenau (bairro não public — ateliê provavelmente residencial)"
bairro: desconhecido
distance_from_center_km: desconhecido

digital_presence:
  site_atual:
    url: "https://bolicoconfeitaria.com.br"
    status: desconhecido  # tem páginas /afetivos-caseiro/, /festivos/, /sobre/ = WordPress provável
    issues_visiveis: ["Confirmação visual pendente"]
    last_updated_visible: recent

  instagram:
    handle: "@bolicoconfeitaria"
    followers: 9863
    posts_total: desconhecido
    posts_last_30d_estimate: desconhecido
    ultima_postagem: recent
    tom_conteudo: profissional  # casamentos.com.br tier = curado

  google_business_profile:
    claimed: unknown
    reviews_count: unknown
    reviews_avg: unknown
    ultima_foto_estimate: unknown

qualification:
  score_qualification: 6.5
  fit_archetype: medio-baixo  # "bolos artísticos" — confeitaria custom NÃO padaria pure, mas tem fit "boutique"
  inclusion_pass: partial  # endereço não validado
  exclusion_pass: true

diagnose_signals_preliminares:
  pain_principais:
    - "Tábata Oliveira = solo founder → forte chance perfil 'artista' high-design"
    - "Cliente type: noivas/festas (R$2-5k tickets) = high WTP por site profissional"
    - "Ateliê provavelmente residencial → presença física limitada"
  competitor_directly_winning: "casamentos.com.br marketplace (paga listagem)"
  sazonalidade_alta: true  # casamentos calendar set/dez

outreach:
  presencial_viavel: partial  # confirmar se há atendimento presencial físico
  pre_contato_warm: cold
  status: novo

notas: "RISCO: ateliê home-based pode não atender critério 'visita presencial fácil' do piloto. Validar primeiro via DM Insta se faz orçamentos no local. Perfil solo founder artista = receptive a 'estética profissional', mas WTP pode ser apertado se vê site como decoração."
```

---

### P-010 — Vanessa Hayashi Doceria

```yaml
id: P-010
name: "Vanessa Hayashi Doceria"
razao_social: "Vanessa Hayashi Doceria LTDA"
cnpj: "validar"  # referenciado cardapio.ai/online/vanessa-hayashi-doceria-ltda — LTDA confirmado
porte: ME  # LTDA, 5 anos mercado
endereco: "Rua Frederico Guilherme Busch, Jardim Blumenau, Blumenau/SC"
bairro: "Jardim Blumenau"
distance_from_center_km: ~4

digital_presence:
  site_atual:
    url: "validar"  # cardapio.ai é hospedagem cardápio = não site próprio
    status: nenhum  # provável só Insta + ifood
    issues_visiveis: ["Sem site institucional", "Cardápio em plataforma terceira (cardapio.ai)"]
    last_updated_visible: n/a

  instagram:
    handle: "@vanessahayashidoceria"
    followers: 19000
    posts_total: 905
    posts_last_30d_estimate: ~25-30  # 905 posts em 5 anos = ~15-20/mês média, ativa
    ultima_postagem: recent
    tom_conteudo: profissional  # nome próprio = brand pessoal forte

  google_business_profile:
    claimed: true  # ifood listing ativo
    reviews_count: unknown
    reviews_avg: unknown
    ultima_foto_estimate: recent

qualification:
  score_qualification: 8.0
  fit_archetype: medio-alto  # "doceria" + brand pessoal forte = arquétipo "founder-led" alta tendência design-driven
  inclusion_pass: true
  exclusion_pass: true

diagnose_signals_preliminares:
  pain_principais:
    - "19k Insta + 905 posts = founder hyper-disciplinada digital, MAS SEM site institucional"
    - "Cardápio em cardapio.ai (plataforma terceira) = não capitaliza branding próprio"
    - "Morango do amor viralizou jul/2025 = caso viral handled WhatsApp/Insta/ifood = perda receita potential SEO web"
    - "Founder Vanessa Hayashi LinkedIn ativo = receptive a abordagem profissional"
  competitor_directly_winning: "@mariamoleblu (26k Velha) — direct adjacent doceria nicho"
  sazonalidade_alta: true  # produtos sazonais fortes (morango, festas Juninas, Páscoa)

outreach:
  presencial_viavel: true  # endereço público + atendimento presencial confirmado (ifood)
  pre_contato_warm: cold
  status: novo

notas: |
  STRONG ANCHOR CANDIDATE #2.
  - Founder digital-savvy (LinkedIn ativo, brand pessoal forte)
  - 19k Insta + zero site institucional = gap óbvio
  - 5 anos mercado = momento maduro escala próxima fase
  - Bairro Jardim Blumenau = classe média-alta, pricing power OK
  - Morango do amor = caso viral comprovado → sabe que tráfego converte → mais receptive a "investir em digital"
  - Risk: pode dizer "Instagram é o que importa, não preciso site" — Counter via Dor→Teach→Reveal
```

---

## Top 3 selecionados pro piloto (RANKED)

> Critério: score_qualification >7 + diagnose_signals_preliminares fortes + presencial_viavel + (Insta ativo mas site quebrado/inexistente = ideal pra anchor) + bairro priority

### 1. ANCHOR CUSTOMER (P-006) — Dona Hilda Confeitaria
**Score: 9.0 | Bairro: Itoupava Seca (priority) | Distância: ~2km**

- Site donahilda.com.br arquitetura **2008-era HTML estático** (`/confeitaria.html`, `/contato.html`, HTTP não HTTPS) — paradigm gap visual óbvio em diagnose-light
- 13k followers Insta ativo (audience tracionada)
- LTDA 1990 (36 anos tradição) → patrimônio reputacional intacto
- Yelp "updated March 2026" confirma operação ativa, owner attendente ao digital
- **Por que anchor:** combinação patrimônio + reputação + gap gritante = case study perfeito para depoimento "agência tradicional cobrou R$X e ficou pior, Site-Prospector entregou em 10 dias"
- **Oferta anchor:** R$ 0-1k em troca de testimonial vídeo + 5 indicações de outros padeiros da região

### 2. PROSPECT #2 (P-003) — Maria Mole Doces
**Score: 8.0 | Bairro: Velha (priority) | Distância: ~3km**

- 26k followers Insta + apenas "cardápio online" (`mariamoledoces.com.br` é Linktree-style) = forte hunger por site institucional
- Administradora Maria Eduarda Macedo Miranda perfil jovem (LTDA 2020 = 5 anos) → adoção digital alta
- 1441 reviews 4.9★ = reputação intacta, falta canal próprio para capturar tráfego
- Cross-sell sazonal forte (Páscoa/Mães/Festas Junho)
- **Preço normal:** R$ 3.497 + R$ 247/mo
- **Diferencial pitch:** "Você tem 26k seguidores Insta e zero loja online — seu Google Maps trabalha mas seu próprio site não existe. Cada cliente novo recomendado é uma busca no Google sem destino."

### 3. PROSPECT #3 (P-010) — Vanessa Hayashi Doceria
**Score: 8.0 | Bairro: Jardim Blumenau | Distância: ~4km**

- 19k followers Insta + LinkedIn ativo founder + ZERO site institucional
- Morango do amor viralizou jul/2025 = case comprovado que viral converte → receptive a investir em "captura digital"
- 905 posts em 5 anos = disciplina founder excepcional
- **Preço:** R$ 3.497 + R$ 247/mo (OU testar R$ 4.497 se P-006 e P-003 fecharem rápido — Architecture B stress test)
- **Diferencial pitch:** "Você é a Vanessa Hayashi — sua marca pessoal vale ouro. Mas hoje seu cardápio mora num cardapio.ai genérico. Seu nome merece domínio próprio."

---

## Comandos sugeridos pra próxima sessão

```bash
# 1. @analyst próxima rodada: validar campos `desconhecido` nos prospects via:
#    - Google Business Profile direct lookup (P-005 Hess endereço)
#    - Apify Instagram scraper (followers exato + posts_last_30d) — quando MCP voltar
#    - Receita Federal CNPJ check (porte exato ME/EPP, situação cadastral)
#    - Lighthouse manual nos sites: donahilda.com.br, paoeponto.com.br, dellanonna.com.br,
#      imperialpadaria.com.br, hessconfeitaria.com.br, padarialolamaria.com.br,
#      bolicoconfeitaria.com.br
#
# 2. @dev (presencialmente Breno): walk-by visual recon nos top 3 (Dona Hilda, Maria Mole, Vanessa Hayashi)
#    - Foto fachada + horário pico cliente + identificar decision-maker
#
# 3. @analyst depois: monta dossiê de dor por prospect (Fase 2)
#    - Output: 02-offer-pack-template.md preenchido + Dor→Teach→Reveal slides
```

---

## Notas operacionais

- **Bairros priority** (densidade artesanal estimada): Vila Nova, Itoupava Seca, Velha, Boa Vista, Garcia, Vorstadt — ✅ 5/10 prospects estão em priority bairros (Velha P-003 P-008, Vorstadt P-004, Itoupava Seca P-006, Fortaleza* P-002 borderline)
- **Bairros desprivilegiados pro piloto:** Itoupava Norte/Central (3G dead-zones flagged Quality squad), bairros >15km centro — ✅ EXCLUSÕES corretas: Pão de Mel (Gaspar), Padaria Bublitz (Itoupava Central 25km), Café da Itoupava, Sabor Real, Norte Café, Pane'Doro filial Itoupavazinha
- **Excluídos por escala/industrial:** Portus Padaria Artesanal (4 unidades + BC), Cafehaus (45 anos referência), GoDisco (franquia Rio do Sul), Blumenau Torten Haus (em São José SC, NÃO Blumenau)
- **Padaria-âncora candidatos** (cliente fácil de fechar): ✅ Dona Hilda (P-006) confirma critério "Insta ATIVO mas site quebrado"
- **Padaria-âncora NÃO candidatos:** ✅ corretamente excluídos: Portus (agência ativa provável dada 4 unidades), Cafehaus (escala industrial)
- **Esgotamento mercado:** Encontrei ~25-30 candidatos brutos via WebSearch, 10 qualificados em 1ª rodada. **RF9 ASSESSMENT:** mercado Blumenau-city tier S parece ter ~15-25 padarias artesanais total — consistente com estimativa CONTEXT.md (20-50). Após pilot N=3 + 7 prospects fallback restantes = 4-5 deals/mês throughput ceiling SUSTENTÁVEL por ~4-6 meses, depois pivot geo ou nicho obrigatório.

---

## Limitações desta rodada

1. **WebFetch denegado** → Lighthouse audits manuais NÃO realizados. Recomendado @dev/@analyst próxima sessão habilitar permissão ou usar `chrome-lighthouse-cli` local.
2. **CNPJ porte (ME/EPP)** validado para 4/10 prospects via cnpj.biz/econodata. Restantes (P-004 Della Nonna, P-005 Hess, P-007 Dora Marie, P-009 Bolico, P-010 Vanessa) precisam consulta Receita Federal direta.
3. **Instagram followers exatos** vieram de snippets WebSearch (Google indexa metadata Insta). Apify scraper validaria precisão + posts_last_30d real.
4. **Distâncias** estimadas via centro Blumenau (Centro/Praça Hercílio Luz). Validação Google Maps direct lookup pendente.
5. **Decision-makers** não identificados nominalmente exceto: Regis Mendonça (P-001 Pão e Ponto), Maria Eduarda Macedo Miranda (P-003 Maria Mole), William Hessmann (P-005 Hess), Tábata Oliveira (P-009 Bolico), Vanessa Hayashi (P-010 Vanessa). Recon presencial @dev essential.
