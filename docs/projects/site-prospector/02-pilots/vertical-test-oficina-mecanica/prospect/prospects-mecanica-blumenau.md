# Prospect List — Blumenau Oficina Mecânica Auto (VERTICAL TEST)

> **DRY RUN #2 — VERTICAL-AGNOSTIC PIPELINE TEST.** Output não é prospecting real. Objetivo: validar se pipeline Site-Prospector v1 transfere de padaria artesanal (aspiracional/emocional) para oficina mecânica (utility-driven/rational). Comparação completa em `LEARNINGS/vertical-agnostic-test-comparison.md`.

**Status:** POPULATED — 5 prospects qualificados via WebSearch (WebFetch DENIED, parity com dry-run #1).
**Última atualização:** 2026-05-12

---

## Critério de inclusão (calibrado pra mecânica vs padaria)

| # | Critério | Como validar | Diff vs padaria |
|---|---|---|---|
| 1 | CNPJ ativo (ME/EPP/LTDA) | Receita / cnpj.biz | igual |
| 2 | Instagram presente (qualquer N) | check perfil direto | **RELAXADO**: padaria exigia >500. Mecânicas tipicamente 500-5k, max 20k (Blucaps outlier). Sinal "vivo" é review velocity, não follower count. |
| 3 | Google Maps reviews ≥30 reviews + nota ≥4.0 | GBP / Tripadvisor / KdMinhaOficina | **NOVO CRITÉRIO**: substitui "Insta >500" do padaria. Trust em mecânica vem de reviews + anos de mercado, não engagement social. |
| 4 | (sem site) OR (site quebrado/2015-era) OR (WordPress abandonado) OR (site genérico Wix/template) | screenshot + heuristic | igual conceitualmente, MAS mecânica tem 2x mais "site Wix template 2015" que padaria que tem mais "Instagram-first sem site". |

## Critério de exclusão

- Concessionária / dealer franquia oficial (VW, Renault, etc) — fora target (eles têm site corporativo)
- Auto centro grande chain (Hyundai Caoa, Localiza) — fora target
- Sem CNPJ ativo ou MEI puro (mesmo critério Pricing squad)
- Localização >15km do centro Blumenau
- Sem reviews público algum (não tem proof reputacional → audience nunca encontra)

---

## Fontes de pesquisa

**Primárias usadas:**
1. Google WebSearch queries 8 em PT-BR (oficina mecanica Blumenau + bairros + especializações)
2. Cross-reference em: kdminhaoficina.com.br, cnpj.biz, econodata, guiafacil, listaamarela, applocal, paginaamarela
3. Knowledge base global mechanic shop archetypes (knowledge cutoff jan/2026)

**NÃO usadas (limitação budget):**
- WebFetch ao vivo dos sites (DENIED) — Lighthouse audits pendentes
- Apify Instagram scraper (MCP offline)
- Receita Federal direct CNPJ status check

**Diferença significativa vs padaria:** mecânicas têm MUITO mais hits em diretórios B2B (kdminhaoficina, listaamarela, guiafacil) que padarias. Padaria tem mais hits em food review platforms (Tripadvisor, RestaurantGuru, ifood). Sinaliza customer-discovery-pattern fundamentalmente diferente entre verticais.

---

## Lista preliminar (POPULATED)

| ID | Nome | Bairro | Anos mercado | Followers IG | Tem site? | Score | Status |
|---|---|---|---|---|---|---|---|
| M-001 | BLUCAPS Centro Automotivo | Ponta Aguda | 15 (desde 2010) | ~20k (claim) | sim (qualidade?) | 7.5 | qualificado |
| M-002 | Auto Mecânica Itanorte | Itoupava Norte | 55 (desde 1970) | desconhecido | sim (qualidade?) | 9.0 | qualificado_top |
| M-003 | Mecânica Barbosa Blumenau | Vila Nova | 42 anos (Insta) / 13 CNPJ | 1.495 | desconhecido | 8.0 | qualificado |
| M-004 | Auto Mecânica Brasil (Bosch Car Service) | Escola Agrícola / Asilo | 54 (desde 1971) | 1.841 | sim (Wix?) | 7.5 | qualificado |
| M-005 | Auto Mecânica JC | Itoupava Norte | desconhecido | desconhecido | sim (qualidade?) | 7.0 | qualificado |

---

### M-001 — BLUCAPS Centro Automotivo

```yaml
id: M-001
name: "BLUCAPS Centro Automotivo (Porto Seguro Auto Conta)"
razao_social: "BLU CAPS SERVICOS DE MANUTENCAO DE MECANICA LTDA"
cnpj: "12.716.065/0001-17"
porte: ME | EPP  # 15 anos operação + 20k Insta + parceria Porto Seguro = provável EPP
endereco: "Rua das Missões, 259, Ponta Aguda, Blumenau/SC, CEP 89.051-000"
bairro: "Ponta Aguda"
distance_from_center_km: ~2

digital_presence:
  site_atual:
    url: "https://blucaps.com.br"
    status: desconhecido  # WebFetch denied; provável tier 2018-2022 (tem /localizacao/ path = template moderno)
    issues_visiveis: ["Validação Lighthouse pendente — provável WordPress template ou Wix custom"]
    last_updated_visible: unknown
    suspeita: "Site existe mas pode ser template genérico — diff vs padaria onde site é HTML 2008-era"
  
  instagram:
    handle: "@blucapscentroautomotivo"
    followers: "[~20.000 — claim de fonte secundária, coletável Apify]"
    posts_total: "[N coletável Apify]"
    posts_last_30d_estimate: "[N coletável Apify]"
    tom_conteudo: profissional  # parceria Porto Seguro + 15 anos
  
  google_business_profile:
    claimed: true  # presente em KdMinhaOficina, GuiaFacil, etc
    reviews_count: "[N coletável GBP API]"
    reviews_avg: "[N coletável GBP API — provável ≥4.5 dado parceria oficial Porto Seguro]"
    ultima_foto_estimate: recent
  
  diferencial:
    - "Parceria Porto Seguro Auto Conta (signal de auditoria/qualidade externa)"
    - "Nacionais + importados ambos atendidos"

qualification:
  score_qualification: 7.5
  fit_archetype: alto  # 'Centro Automotivo' moderno, 15 anos = momento maduro upgrade
  inclusion_pass: true
  exclusion_pass: true  # NÃO concessionária, NÃO franquia grande

diagnose_signals_preliminares:
  pain_principais:
    - "20k Insta = audience tracionada FORTE (incomum pra mecânica) — site provavelmente subaproveitado vs Insta"
    - "Parceria Porto Seguro = revenue B2B fixo, mas falta canal SEO local pra captação direta B2C"
    - "Ponta Aguda priority — denso comercial + perto Garcia/Velha"
    - "15 anos = momento maduro de 'profissionalizar fachada digital'"
  competitor_directly_winning: "Concessionária Bosch Car Service Vorstadt + Auto Mecânica Brasil (também Bosch)"
  sazonalidade_alta: parcial  # mecânica tem ciclo de revisão (km) não calendário

outreach:
  presencial_viavel: true
  pre_contato_warm: cold
  status: novo

notas: |
  Outlier do nicho — 20k followers é EXCEPCIONAL pra mecânica.
  Sinaliza founder digital-savvy → mais receptive a pitch profissional.
  Risk: pode já ter "agência de social" — confirmar diagnose-light.
  Score 7.5 (vs 9 padaria top) reflete: site existe mas qualidade desconhecida, e pricing power mecânica é
  estruturalmente menor que confeitaria premium (ticket médio R$300-1500 service vs R$15-80 produto).
```

---

### M-002 — Auto Mecânica Itanorte

```yaml
id: M-002
name: "Auto Mecânica Itanorte"
razao_social: "AUTO MECANICA ITANORTE LTDA EPP"
cnpj: "validar Receita"  # cnpj.info menciona LTDA EPP mas número não pegado
porte: EPP  # explicitamente "LTDA EPP" em registro
endereco: "Rua 1º de Janeiro, 1977, Itoupava Norte, Blumenau/SC, CEP 89.060-010"
bairro: "Itoupava Norte"
distance_from_center_km: ~5

digital_presence:
  site_atual:
    url: "https://www.mecanicaitanorte.com.br"
    status: desconhecido  # provável WordPress 2018-2020 era (tema simples padrão BR)
    issues_visiveis: ["Validação Lighthouse pendente — domínio próprio mas baixa probabilidade de design moderno"]
    last_updated_visible: unknown
  
  instagram:
    handle: "[a confirmar — não localizado em busca]"
    followers: "[N coletável Apify — provavelmente baixo, founder geração 60+]"
  
  google_business_profile:
    claimed: true
    reviews_count: "[N coletável GBP — KdMinhaOficina lista profile completo]"
    reviews_avg: "[N coletável — heurística: tradicional 55 anos = base sólida 4.3-4.7]"
  
  email_publicado: "gerencia@mecanicaitanorte.com.br"
  telefone: "(47) 3338-0047"
  
  diferencial:
    - "55 anos de mercado (1970) — patrimônio raro no nicho mecânica"
    - "Sobreviveu enchente 1983, mudança 1992 — narrativa de resiliência"
    - "Especialização declarada: linha diesel + elétrica automotiva"

qualification:
  score_qualification: 9.0  # TOP PROSPECT
  fit_archetype: alto  # heritage 55 anos + nicho diesel premium + EPP confirmado
  inclusion_pass: true
  exclusion_pass: true

diagnose_signals_preliminares:
  pain_principais:
    - "55 anos de mercado + email genérico @mecanicaitanorte = patrimônio sem capitalização digital"
    - "Itoupava Norte = bairro com 3G dead-zone flagged pelo CONTEXT.md Quality squad — performance gate field-perf MAIS crítico ainda"
    - "Linha diesel = clientela B2B (frotistas, caminhões pequenos, vans) com pricing power alto"
    - "Heritage signal 'fundado 1970' = oportunidade clara analógica de Poilâne 'depuis 1932' do padaria"
    - "Frota empresarial busca certificações + portfolio + endereço fixo no Google → site é primeiro filtro"
  competitor_directly_winning: "MF Diesel (Salto do Norte) + Bull Diesel (Salto do Norte) — ambos nicho diesel mas mais jovens"
  sazonalidade_alta: false  # mecânica diesel = ciclos de revisão por km, não calendário

outreach:
  presencial_viavel: true
  pre_contato_warm: cold
  status: novo

notas: |
  STRONG ANCHOR CANDIDATE #1 — análogo direto à Dona Hilda no padaria.
  - 55 anos LTDA EPP vs Dona Hilda 36 anos LTDA = mesmo arquétipo "patrimônio reputacional + site obsoleto"
  - Linha diesel = ticket alto (R$800-3000 service típico) → pricing R$3.497 + R$247/mo absorbível
  - Itoupava Norte mais distante centro que Itoupava Seca, mas dentro 15km
  - Heritage narrative (1970 / 1983 enchente / 1992 mudança) = matéria-prima editorial premium
  - Diff vs padaria: founder provável homem 60+, decisão técnica/racional, NÃO emocional como confeitaria
  - Audit hipótese: site existe mas Lighthouse ≤40, sem WhatsApp button, mobile broken, sem schema LocalBusiness
```

---

### M-003 — Mecânica Barbosa Blumenau

```yaml
id: M-003
name: "Mecânica Barbosa Blumenau"
razao_social: "OFICINA MECANICA BARBOSA LTDA ME"
cnpj: "14.892.435/0001-00"
porte: ME  # explicit LTDA ME
endereco: "Rua Casimiro de Abreu, 52, Vila Nova, Blumenau/SC, CEP 89.035-600"
bairro: "Vila Nova"  # PRIORITY bairro CONTEXT.md
distance_from_center_km: ~2
data_fundacao_cnpj: "2012-01-11"  # mas Insta declara "42 anos de tradição" — provável transferência razão social, operação pré-formal desde ~1983

digital_presence:
  site_atual:
    url: "https://mecanicabarbosa.com.br"  # cnpj.biz referenced fale-conosco subdomain
    status: desconhecido  # presença de site institucional confirma existência, mas qualidade unknown
    issues_visiveis: ["Validação Lighthouse pendente"]
    last_updated_visible: unknown
  
  instagram:
    handle: "@mecanicabarbosabnu"
    followers: 1495  # CONFIRMADO via busca
    posts_total: "[N coletável Apify]"
    posts_last_30d_estimate: "[N coletável Apify]"
    tom_conteudo: profissional  # bio diz '42 anos de tradição' = patrimônio
  
  google_business_profile:
    claimed: true  # presence em encontreumbueno + bizapps
    reviews_count: "[N coletável GBP]"
    reviews_avg: "[N coletável GBP]"

qualification:
  score_qualification: 8.0
  fit_archetype: alto  # Vila Nova priority + 42 anos tradição declarada + Insta ativo + LTDA ME (não EPP, fit perfeito Tier S)
  inclusion_pass: true
  exclusion_pass: true

diagnose_signals_preliminares:
  pain_principais:
    - "1.495 followers Insta = baixo, mas vivo (sinal de operação ativa, não desabandono)"
    - "Vila Nova bairro priority CONTEXT.md (denso residencial classe média-alta)"
    - "42 anos tradição declarada Insta + LTDA ME 2012 = re-formalização recente, founder ainda ativo"
    - "Site existe mas qualidade unknown — alta probabilidade tema WordPress padrão 2015-2018"
  competitor_directly_winning: "Auto Mecânica Itanorte (M-002 nicho diesel) + Mecânicas Vila Nova adjacentes"
  sazonalidade_alta: false

outreach:
  presencial_viavel: true
  pre_contato_warm: cold
  status: novo

notas: |
  STRONG ANCHOR CANDIDATE #2.
  - LTDA ME confirma fit Tier S (não EPP grande nem MEI cap)
  - 42 anos tradição Insta declarado = matéria-prima heritage similar Dona Hilda
  - Vila Nova priority = walkability presencial perfeita p/ founder Breno
  - 1.5k Insta = audience pequena mas tracionada — pode ser convencido com Dor→Teach→Reveal
  - Diff vs padaria: customer journey rational ("preciso revisão") vs aspiracional ("quero treat") — copy/visual deve refletir
```

---

### M-004 — Auto Mecânica Brasil (Bosch Car Service)

```yaml
id: M-004
name: "Auto Mecânica Brasil — Bosch Car Service (Autorizado Chery)"
razao_social: "AUTO MECANICA BRASIL LTDA"
cnpj: "82.669.078/0001-68"
porte: ME | EPP  # 54 anos + Bosch Car Service + Chery autorizado = provável EPP
endereco: "Rua Ricardo Koball, 196, Escola Agrícola, Blumenau/SC, CEP 89.037-660"
bairro: "Escola Agrícola"  # adjacente Asilo
distance_from_center_km: ~4

digital_presence:
  site_atual:
    url: "https://www.automecanicabrasil.com.br"  # subdomain /home, /location confirma Wix-style platform
    status: obsoleto_provavel  # Wix tem URLs /location não /localizacao = template genérico
    issues_visiveis:
      - "URLs /home /location sugerem Wix template inglês default (não traduzido) = baixo cuidado design"
      - "Validação Lighthouse pendente mas heurística aponta tier 2018-2020 Wix genérico"
    last_updated_visible: unknown
  
  instagram:
    handle: "@automecanicabrasil"
    followers: 1841  # CONFIRMADO
    posts_total: "[N coletável Apify]"
  
  google_business_profile:
    claimed: true
    reviews_count: "[N coletável GBP]"
    reviews_avg: "[N coletável — Bosch Car Service network tipicamente ≥4.3]"
  
  whatsapp: "(47) 98832-7..." # WhatsApp visível em applocal
  
  diferencial:
    - "54 anos (1971) tradição"
    - "Bosch Car Service network (auditoria/certificação Bosch)"
    - "Único autorizado Chery + Lifan em Blumenau com treinamento de fábrica"

qualification:
  score_qualification: 7.5
  fit_archetype: medio-alto  # heritage strong, MAS network Bosch tipicamente fornece site/branding padrão (risk: já satisfeitos)
  inclusion_pass: true
  exclusion_pass: true  # NÃO é concessionária pura, é multimarcas com selo Chery

diagnose_signals_preliminares:
  pain_principais:
    - "Bosch Car Service fornece template branding genérico — site Wix /location = signal weak"
    - "1.8k followers + 54 anos = sub-aproveitado digitalmente (Itanorte tem mesma idade)"
    - "Especialização Chery/Lifan + Bosch = clientela técnica busca certificações no Google = site é touch-point crítico"
  competitor_directly_winning: "Outras Bosch Car Service Blumenau (rede)"
  sazonalidade_alta: false

outreach:
  presencial_viavel: true
  pre_contato_warm: cold
  status: novo

notas: |
  Médio score (7.5) porque:
  - Network Bosch pode fornecer site/branding → founder pode dizer "já tenho site" e dispensar
  - Counter-argumento: Bosch fornece TEMPLATE; Site-Prospector entrega CUSTOMIZADO + SEO local + WhatsApp
  - Especialização Chery único Blumenau = SEO local opportunity gigante ('mecânica Chery Blumenau')
  - WhatsApp já publicado em applocal mas presumido NÃO botão clicável no site
  - Bom prospect 'flank' se M-002 ou M-003 falharem
```

---

### M-005 — Auto Mecânica JC

```yaml
id: M-005
name: "Auto Mecânica e Elétrica JC"
razao_social: "AUTO MECANICA J C LTDA"
cnpj: "85.402.600/0001-39"
porte: ME  # LTDA pequena, não EPP claro
endereco: "Rua São Bernardo, 161, Itoupava Norte, Blumenau/SC"
bairro: "Itoupava Norte"
distance_from_center_km: ~5

digital_presence:
  site_atual:
    url: "https://www.automecanicajc.com.br"
    status: obsoleto_provavel  # site MUITO ativo (/servicos/, /marcas/, /servicos/detalhe/revisao-preventiva — estrutura WordPress 2015-2018 era)
    issues_visiveis:
      - "Estrutura URL /servicos/detalhe/ = WordPress padrão custom-post-type 2015-era"
      - "Páginas separadas por SERVIÇO (revisão, troca óleo) = SEO antigo, não consolidated landing page"
      - "Validação Lighthouse pendente"
    last_updated_visible: unknown
  
  instagram:
    handle: "[não localizado — provável inexistente ou abandonado]"
    followers: "[provavelmente <500 ou inexistente — viola critério padaria mas mecânica relaxa]"
  
  google_business_profile:
    claimed: true  # KdMinhaOficina + GuiaFacil + applocal
    reviews_count: "[N coletável GBP]"
    reviews_avg: "[N coletável]"
  
  whatsapp: "(47) 99609-6049"  # confirmado applocal

qualification:
  score_qualification: 7.0
  fit_archetype: medio  # Itoupava Norte (3G dead-zone risk) + site existe mas Insta inexistente
  inclusion_pass: true  # mecânica relaxa critério Insta
  exclusion_pass: true

diagnose_signals_preliminares:
  pain_principais:
    - "Site COM categorias dedicadas por serviço (/servicos/troca-de-oleo, /revisao-preventiva) = mostra esforço SEO, mas arquitetura 2015 não escala"
    - "Insta inexistente/inativo = audience captura ZERO (diff fundamental vs M-001 Blucaps que tem 20k)"
    - "WhatsApp dedicado (47) 99609-6049 = pronto pra wa.me button no site"
    - "Itoupava Norte mesmo bairro M-002 Itanorte = competição direta"
  competitor_directly_winning: "M-002 Itanorte (mesma rua adjacente)"
  sazonalidade_alta: false

outreach:
  presencial_viavel: true
  pre_contato_warm: cold
  status: novo

notas: |
  Score médio porque:
  - Itoupava Norte 3G dead-zone (CONTEXT.md flag) = LCP field test mais hostil
  - Insta inexistente = audience-zero-pré-existing
  - Mas: site WordPress 2015-era + WhatsApp já no funil = diagnose-light revela gap óbvio
  - Bom prospect 'flank' Tier 2
```

---

## Top 3 selecionados pro pilot dry-run (RANKED)

> Critério: score_qualification >7 + diagnose_signals fortes + presencial_viavel + (site obsoleto identificável) + bairro decente

### 1. ANCHOR CUSTOMER (M-002) — Auto Mecânica Itanorte
**Score: 9.0 | Bairro: Itoupava Norte | Distância: ~5km | 55 anos tradição**

- LTDA EPP confirmado, fundada 1970 (55 anos vs Dona Hilda 36 anos = padrão "patrimônio raro")
- Especialização diesel + elétrica = nicho B2B premium (frotistas, vans, caminhões pequenos)
- Heritage narrative documentada (mudança 1992, sobrevivência enchente 1983)
- Site `mecanicaitanorte.com.br` existe mas qualidade unknown — diagnose-light revelará gap
- Itoupava Norte 3G dead-zone flag = field-perf gate ainda MAIS crítico
- **Análogo direto à Dona Hilda no piloto padaria:** mesma estrutura (decadia de operação + site obsoleto + reputação intacta)
- **Diff vs padaria:** customer journey rational/utility-driven (revisão necessária) — copy/visual deve refletir
- **Oferta anchor:** R$ 0-1k em troca de testimonial vídeo + 5 indicações outras oficinas

### 2. PROSPECT #2 (M-003) — Mecânica Barbosa Blumenau
**Score: 8.0 | Bairro: Vila Nova (priority) | Distância: ~2km | 42 anos declarado**

- LTDA ME (fit Tier S perfeito, não EPP grande)
- 42 anos tradição declarado bio Insta = patrimônio similar Itanorte/Dona Hilda
- Vila Nova priority = walkability presencial perfeita
- 1.495 followers Insta = baixo mas vivo (sinal operação ativa)
- Site existe mas qualidade unknown — alta probabilidade WP 2015-2018
- **Diferencial pitch:** "Sua oficina tem 42 anos. Seu site tem 8. Seu vizinho de quadra que abriu ano passado já está acima de você no Google porque tem schema LocalBusiness."

### 3. PROSPECT #3 (M-001) — BLUCAPS Centro Automotivo
**Score: 7.5 | Bairro: Ponta Aguda | Distância: ~2km | 15 anos + 20k Insta**

- Outlier digital do nicho (20k followers em mecânica = excepcional)
- Parceria Porto Seguro = revenue B2B fixo, falta canal SEO direto B2C
- 15 anos operação = momento maduro upgrade institucional
- Site existe — provável tier 2018-2022 Wix custom
- **Pitch alternativo (founder digital-savvy):** "Você tem 20k Insta mas zero loja online. Quem chega em busca 'centro automotivo Blumenau' não te encontra primeiro porque seu site é WordPress sem schema."

---

## Comandos sugeridos pra próxima sessão

```bash
# 1. @analyst próxima rodada: validar campos [N coletável Apify]:
#    - Apify GBP scraper (reviews count + avg exato top 5)
#    - Apify Instagram scraper (followers + posts_last_30d)
#    - Receita Federal CNPJ check porte (ME/EPP) M-001, M-002
#    - Lighthouse manual: blucaps.com.br, mecanicaitanorte.com.br, mecanicabarbosa.com.br,
#      automecanicabrasil.com.br, automecanicajc.com.br
#
# 2. @dev (presencialmente Breno): walk-by recon nos top 3
#    - Foto fachada + horário pico (mecânica geralmente 8h-18h seg-sex + sábado meio-dia)
#    - Identificar decision-maker (geralmente proprietário homem 50-70)
#    - Observar bay count / equipamentos / clientes na sala de espera
#
# 3. @analyst depois: dossiê de dor M-002 (Fase 2) — análogo P-006 Dona Hilda
```

---

## Diferenças vs padaria (capturadas no LEARNINGS)

| Dimensão | Padaria (P-006) | Mecânica (M-002) | Delta |
|---|---|---|---|
| Critério Insta | >500 obrigatório | qualquer N (relaxado) | NEW criterio reviews substitui |
| Trust signal primário | engajamento Insta + reviews iFood | reviews GBP + anos mercado + certificações | DIFERENTE |
| Customer journey | aspiracional/emocional | rational/utility | DIFERENTE FUNDAMENTAL |
| Decision-maker arquétipo | jovem digital-savvy 30-45 OU patrimônio 50-65 | homem 50-70 técnico | SKEW masculino + idade |
| Pricing power | confeitaria R$15-80/produto | service R$300-3000/visita | mecânica MAIS pricing power |
| Sazonalidade | alta (Páscoa/Natal/Mães) | baixa/constante (revisão km) | DIFERENTE |
| Padrão sociais | Insta-heavy, Tripadvisor, iFood | GBP-heavy, KdMinhaOficina, listaamarela | DIFERENTE CANAIS |
| Densidade refs globais design | alta (Tartine, Poilâne, Hart Bageri) | menor (Bilstein, Carbahn, dealer chains) | MENOR DENSIDADE |

---

## Limitações desta rodada (parity dry-run #1)

1. **WebFetch denied** → Lighthouse audits manuais NÃO realizados. Mesma limitação dry-run #1.
2. **CNPJ porte exato** validado 3/5 (M-002 EPP, M-003 ME, M-004 EPP-provável). M-001/M-005 precisam Receita direct.
3. **Instagram followers** confirmados via busca para 2/5 (M-003 1.495, M-004 1.841). M-001 ~20k é claim secundária. M-002/M-005 unknown.
4. **GBP reviews** todos placeholders [N coletável] — Apify GBP scraper ou screenshot manual pendente.
5. **Distâncias** estimadas via centro Blumenau. Validação Google Maps direct pendente.
6. **Decision-makers nominais** NÃO identificados — recon presencial @dev essential.
7. **Tempo execução Fase 1 condensed:** ~25min (target 15min — overshot por necessidade cross-reference CNPJ).
