# Offer Pack Template — Stage 1 Deliverable

> **Output da Fase 8 (parcial — Stage 1).** O agente AIOS prepara este pacote completo, Breno revisa, leva presencialmente ao prospect.
> Copy CDC-compliant per Patricia Peck (ADR-0002).

**Versão:** 1.0 (locked)
**Última atualização:** 2026-05-12

---

## Componentes do Offer Pack

```
offer-pack-{prospect-id}/
├── 01-dossier-de-dor.pdf            # PDF 1-2 páginas com diagnose
├── 02-keynote-5-slides.pdf          # apresentação Stage 1
├── 03-mockup-hand-drawn.png         # mockup low-fi pra mostrar direção
├── 04-proposta-comercial.pdf        # proposta formal (NÃO contrato)
├── 05-script-outreach.md            # roteiro presencial (Dor → Teach → Reveal)
└── 06-followup-templates.md         # WhatsApp + email follow-up
```

**Nota:** Stage 1 NÃO inclui preview URL nem contrato. Preview URL = Stage 2 trigger. Contrato (Patricia Peck 20 cláusulas) = pré-requisito Stage 2 paid.

---

## 01 — Dossiê de Dor (Rational Drowning — Dixon)

> 🚨 **ANTI-INVENÇÃO RULE (CDC compliance — Patricia Peck + dry-run learning):**
> **Cada bullet do dossiê tem que ter FONTE verificável citada OR ser OMITIDO.**
> Template tem 3 buracos estruturais que EMPURRAM invenção: `posts_last_30d`, `reviews_sem_resposta`, `posição_busca_local`. Esses campos SÓ entram se houver tracking direto (Apify) ou audit manual presencial.
> Bullets sem fonte = **NÃO entregar** ao prospect. Risco PROCON real.

**Formato:** PDF 1-2 páginas, design clean (mesmos tokens do design synthesis), branding Site-Prospector light.

**Marcador "evidence-or-omit"** em cada bullet:
- ✅ Dado coletável diretamente (URL fetched, GBP API, IG handle público) → INCLUI
- ⚠️ Dado inferido indireto (estrutura URL, ausência presumida) → INCLUI mas com qualificação ("inferido a partir de X")
- ❌ Dado que exigiria scraping/audit que não foi feito → **OMITIR** (não inventar)

**Estrutura:**

```
[Logo Site-Prospector]
DIAGNÓSTICO DIGITAL — {Nome da Padaria}
{Data}

1. PRESENÇA ATUAL (o que está vivo)
   ✓ Instagram @{handle} — {followers} seguidores
   ✓ Google Business Profile — {reviews_count} avaliações, nota {avg}/5
   ✓ Endereço listado: {address}
   ✗ Site: {url ou "não encontramos"}
   ✗ WhatsApp Business: {"sim" ou "não verificamos"}

2. ONDE VOCÊ ESTÁ PERDENDO CLIENTES AGORA
   📉 [SE coletável Apify/manual] Instagram: {posts_total} posts publicados
      ↳ Concorrente direto {@competitor} tem {Y} posts (cite ratio só se confirmado)
   📉 [SE site fetched] Site {url}: {issue_concreto_verificado}
      Exemplos verificáveis: "endereço listado X, real é Y" / "HTTP sem HTTPS" / "estrutura HTML estática .html típica 2008-era"
   📉 [SE GBP visível] Google Maps: {reviews_count} avaliações nota {avg}/5
      ⚠️ NÃO afirmar "X sem resposta" sem ter contado manualmente
   📉 [SE faltante confirmado] Ausência detectada: {wa.me não encontrado / mapa embed ausente / etc}
      Cliente que tenta {ação} no celular tem fricção
   📉 [SE GBP/Insta divergem em horário/endereço] Inconsistência: {Canal A diz X / Canal B diz Y}
      Cliente frustrado uma vez não volta

3. O CONCORRENTE DIRETO QUE ESTÁ GANHANDO
   {@competitor_padaria} em {bairro X}
      ├ Posta {X}× por semana
      ├ {Y} reviews vs seus {Z}
      ├ Aparece em 1º quando pesquiso "{nicho} {bairro}" agora
      └ Tem WhatsApp button + delivery

4. OPORTUNIDADE SAZONAL PRÓXIMA
   {Próxima data sazonal — Páscoa/Festa Junina/Natal}
   Padarias artesanais faturam {60-80%} extra em {data}.
   Sem preparação digital agora, você perde.

[Footer]
Quem é Site-Prospector?
{breve descrição}
Próximo passo: {data} às {hora}, visita presencial de 30 min.
```

**Princípios:**
- **Números reais.** Sem invenção. Se não tem dado, omite — não chuta.
- **Comparação local específica.** Não "agências grandes" — concorrente direto da rua.
- **Tom: diagnóstico médico, não vendedor.** Patricia Peck: evitar "vamos resolver" → usar "identificamos".
- **Sazonalidade sempre presente.** Datum real próximo (Páscoa: 31/mar; Festa Junina: jun; Natal: dez).

---

## 02 — Keynote 5 Slides

**Slide 1 — REFRAME (1min)**
> *"Sua maior ameaça não é a padaria do bairro vizinho.*
> *É o turista alemão de Pomerode que tá no celular agora procurando 'cuca artesanal Blumenau' — e nunca vê você porque sua ficha no Google Maps tá de 2019."*

[Visual: print do Google Maps mostrando concorrente em #1 e padaria-cliente sem aparecer]

---

**Slide 2 — TEACH (Rational Drowning — 2min)**

> Sua presença digital hoje:
> - Instagram: {dados reais}
> - Google Maps: {dados reais}
> - Site: {dados reais ou "não tem"}
>
> Sua concorrente {@xpto}:
> - Instagram: {dados reais}
> - Google Maps: {dados reais}
> - Aparece em 1º quando pesquiso seu próprio nicho

[Visual: lado-a-lado screenshot Insta + Maps]

---

**Slide 3 — EMOTIONAL IMPACT (1min)**

> *"A {padaria-referência-conhecida} passou de {X} clientes/sábado pra {Y} depois de arrumar isso. A esposa do {nome dono} viaja três vezes por ano agora. Você quer essa equação?"*

[Visual: foto de outdoor/loja da referência OR foto Instagram da referência mostrando movimento]

> ⚠️ Disclaimer: caso real público. Resultados variam por múltiplos fatores fora do controle da agência.

---

**Slide 4 — NEW WAY (1min)**

> A solução não é "fazer site".
>
> É construir presença que:
> ① O Google entende → você aparece quando o turista procura
> ② O turista encontra → toca no botão, fala com você
> ③ O cliente local volta → vê seu Insta vivo, lembra de voltar
>
> Três peças. Funcionando juntas.

[Visual: diagrama simples de 3 círculos sobrepostos]

---

**Slide 5 — REVEAL (5min, somente após Slide 4 absorvido)**

> *"Eu já comecei. Aqui está o que penso pra você."*

[Mostrar mockup hand-drawn — slide 03 do offer pack]

> *"Em 10 dias, isso vira realidade."*

[Visual: timeline 10 dias]

> *"R$ 3.497 à vista ou 6× R$ 583 no cartão."*

[NÃO mostrar pricing em tela ainda — verbal first. Mostrar slide só se prospect perguntar]

---

## 03 — Mockup Hand-Drawn

**Formato:** PNG/PDF, 1 página, **explicitamente hand-drawn** (não Figma polish).

**Razões (Strategy + Pricing squads):**
- Hand-drawn comunica "isso é PRELIMINAR, você pode mudar" (reduce ownership rejection — Dixon)
- Polish-level Figma = trigger FOMU "que mágico, mas quanto custa, e se eu não gostar"
- Hand-drawn é cheap (15min Procreate/iPad), permite N variações sem perda de horas

**Conteúdo:**
- Hero: foto da padaria (ou esboço de produto-âncora — pão, cuca)
- Headline: produto-âncora da padaria ("O melhor pão de fermentação natural de Blumenau", validar com dono primeiro)
- 3 seções rabiscadas: produtos / sobre / contato (WhatsApp button proeminente)
- Sazonal banner: "Páscoa 2026 — encomendas até DD/MM"
- Mapa mini com Google reviews score

---

## 04 — Proposta Comercial PDF

**NÃO É CONTRATO.** É documento de oferta formal com disclaimers CDC.

**Estrutura:**

```
PROPOSTA COMERCIAL Nº {ID}/2026
Data: {data}
Validade: 15 dias corridos

Contratante: {Nome da Padaria}
CNPJ: {CNPJ}
Endereço: {endereço completo}

Contratada: {Site-Prospector — qualificação completa}

OBJETO:
Pacote "Presença Local Premium para Padaria Artesanal" composto por:

1. **Sua loja achável no Google + Maps**
   - Reconstrução completa do Google Business Profile
   - 30 dias iniciais de fotos profissionais publicadas
   - Otimização SEO local para buscas geolocalizadas em Blumenau/SC
   - Schema.org LocalBusiness + Bakery
   - Disclaimer: previsão razoável de indexação em 30-60 dias.
     Sem garantia de posição específica (Google é independente).

2. **Site profissional que recebe e direciona pedidos 24/7**
   - Site Next.js mobile-first, 6-8 páginas
   - Padrões de performance: Lighthouse ≥90 (4 categorias)
   - Botão WhatsApp + telefone + endereço com mapa
   - Política de Privacidade + LGPD-compliant
   - Disclaimer: site recebe e direciona pedidos via WhatsApp e telefone,
     24/7. Não realiza transações automaticamente.

3. **Instagram que parece de marca grande**
   - Reescrita da bio + highlights organizados
   - 12 posts pillar agendados (one-shot, não recurring)
   - Tom de voz definido em manual simples para você usar depois

4. **Fotos suas, do seu produto, do seu jeito**
   - 1 sessão de fotografia profissional de 2h presencial
   - 30+ fotos editadas + cessão de direitos para uso comercial/digital

5. **Suporte humano em Blumenau, presencial sempre que precisar**
   - Atendimento presencial direto com {Breno} em Blumenau

PRAZO DE EXECUÇÃO:
10 dias úteis após pagamento da 1ª parcela.

PREÇO:
À vista: R$ 3.197,00 (8% de desconto)
Parcelado: 6× R$ 583,00 no cartão de crédito (sem juros, total R$ 3.498,00)
IOF cartão: por conta da operadora.

MENSALIDADE RECORRENTE (após go-live):
Plano Growth: R$ 247,00/mês — default
Plano Essential: R$ 149,00/mês — fallback
Plano Scale: R$ 397,00/mês — upgrade
Inclui no Growth:
- Hosting + SSL + uptime
- 1 edit/mês (cardápio sazonal, banner evento, foto nova)
- Google Business Guardian (resposta em <24h a reviews + 4 posts/mês)
- Relatório mensal visual em PDF (cliques GMB, ligações, pedidos WhatsApp, direções)
- Instagram: 4 posts/mês

GARANTIA PERFORMANCE LOCAL BLUMENAU:
Se em 60 dias corridos após o go-live o painel de analytics registrar
ZERO eventos de interesse atribuídos (definidos como: cliques únicos
de visitantes únicos no botão WhatsApp do site + cliques "Ligar" no
Google Business Profile com origem na busca local Blumenau/SC), a
Contratante terá direito a:
(a) 3 mensalidades subsequentes Growth sem custo (R$ 741)
(b) 1 sessão fotográfica sazonal extra sem custo (R$ 800)
Total em concessões: R$ 1.541

A propriedade dos entregáveis já produzidos permanece com a Contratante,
nos termos de licença perpétua e irrevogável.

Esta garantia é ADICIONAL à garantia legal de 90 dias prevista no art. 26,
II, do CDC, não a substituindo nem reduzindo.

CONDIÇÕES DETALHADAS DA GARANTIA: ver contrato anexo, cláusula X.

DISCLAIMER GERAL:
Os resultados de marketing digital dependem de múltiplos fatores fora
do controle da agência, incluindo qualidade do produto, atendimento,
sazonalidade e concorrência. Esta garantia cobre exclusivamente os
critérios técnicos descritos no contrato e não é promessa de aumento
de faturamento.

Site-Prospector não tem vínculo de exclusividade, parceria ou
representação com Google LLC ou Meta Platforms Inc.

Pacote equivalente em modelos tradicionais de agência costuma envolver
investimento substancialmente superior, conforme levantamentos públicos
de mercado (SEBRAE/ABRADi).

Política de Privacidade: {URL}
Canal LGPD: privacidade@{dominio}

ASSINATURAS:
[Espaço para assinatura presencial OR assinatura eletrônica DocuSign/ZapSign]

Esta proposta NÃO constitui contrato. Assinatura do contrato definitivo
(20 cláusulas conforme ADR-0002) é requisito para início dos trabalhos.
```

---

## 05 — Script Outreach Presencial (Dor → Teach → Reveal)

**Tempo total presencial:** 25-30 min (não passar disso).

### Minuto 0-1 — Warmer (Dixon Commercial Teaching)

> "Bom dia {dono}, sou Breno, agência local aqui de Blumenau. Posso te roubar 5 minutos? Trabalho com padarias artesanais aqui no Vale e tem um padrão que vejo em 8 de 10 — vocês ganham mais dinheiro nos eventos sazonais (Páscoa, Dia das Mães, Festa Junina) do que no fluxo normal. E é exatamente nesses picos que o Google Maps tá entregando seus concorrentes em vez de vocês. Posso te mostrar uma coisa rápida?"

→ *Se SIM:* continua
→ *Se "não tenho tempo":* "5 minutos. Vou te entregar isso impresso pra você ver depois também" — entrega dossiê de dor e marca retorno.

### Minuto 1-3 — Reframe

> "Sua maior ameaça não é a {padaria-vizinha-conhecida}. É o turista alemão de Pomerode que tá no celular agora procurando 'cuca artesanal Blumenau' — e nunca vê você porque sua ficha no Google Maps tá de 2019."

*[abre slide 1 no celular OU mostra impresso]*

### Minuto 3-8 — Rational Drowning (Dossiê de Dor)

> "Olha aqui — fiz um diagnóstico antes de vir. Você tem {X} reviews no Google, {Y} sem resposta há 6 meses. Seu Insta tem {Z} posts nos últimos 90 dias. Sua concorrente direta na {rua} tem {A} reviews, posta {B}× por semana, e aparece em 1º quando pesquiso 'padaria artesanal {bairro}' do meu celular agora — ó."

*[mostra prints do dossiê. Pausa. Deixa absorver.]*

### Minuto 8-10 — Emotional Impact

> "A {padaria-referência-conhecida} passou de {X} clientes/sábado pra {Y} depois de arrumar isso. {Nome do dono}, eu sei que tu conhece. A esposa dele viaja três vezes por ano agora. Tu quer essa equação?"

### Minuto 10-13 — New Way

> "A solução não é 'fazer site'. É construir presença que o Google entende, o turista encontra, e o cliente local volta. Três peças funcionando juntas. Em 10 dias eu deixo isso pronto pra você."

### Minuto 13-20 — THE REVEAL

> "Eu já comecei. Aqui está o que penso pra você."

*[abre mockup hand-drawn]*

> "Pode mudar tudo. Esse é só um esboço. Mas dá pra ver onde tá indo."

### Minuto 20-25 — JOLT close (Dixon)

> "{Dono}, vou te dar uma recomendação. Vamos com o pacote completo a R$ 3.497. Não tem outra escolha melhor pra sua situação agora. Tu não precisa pesquisar 5 agências. Tu precisa decidir se confia em mim e nesse trabalho que tá aqui na sua frente."

> "E pra zerar teu risco: se em 60 dias zero cliente clicar no botão WhatsApp do site ou ligar pela ficha do Google, tu recebe 3 meses do pacote mensal grátis mais uma sessão de fotos sazonais extras. Tu fica com o site, o Google, o Instagram. Vale R$ 1.541. Sem refund em dinheiro porque sou eu sozinho aqui — mas vale igual."

> "Tu paga R$ 583 hoje no cartão pra eu começar amanhã."

### Minuto 25-30 — Respostas e próximo passo

**Se SIM imediato:**
> "Beleza. Te mando o contrato por WhatsApp hoje à noite. Você assina amanhã via DocuSign (tem como?), eu começo dia DD."

**Se "deixa eu pensar / falar com a esposa":**
> "Claro. Quanto tempo? Eu volto aqui em 48h pessoalmente. Posso?"
> *[NÃO mandar email com proposta — perde momento. Volta presencial.]*

**Se "tá caro":**
> "Entendo. Olha — o que tá caro? O upfront ou o mensal? Posso parcelar em 6 vezes de R$ 583 sem juros. Pra você, isso seria viável?"
> *[Floor R$ 1.500 1ª parcela. Abaixo disso = NÃO.]*

**Se "não preciso":**
> "Entendido. Posso te perguntar uma coisa — o que tu acha que precisa? Pra eu aprender."
> *[Captura objeção real. Anota taxonomia em pilot-log.]*

**Se "manda proposta":**
> "Ok, te mando hoje. Mas eu volto aqui {dia} pessoalmente pra a gente conversar sobre. {Horário}, beleza?"
> *[Manda proposta-comercial.pdf por WhatsApp. Agenda retorno presencial.]*

---

## 06 — Follow-up Templates

### WhatsApp follow-up (24h pós-meeting)

```
Oi {Dono}, Breno aqui.

Obrigado pelo café hoje. Pensei mais sobre o que conversamos e juntei nesse link aqui o que faria pra {Padaria}: {link mockup OR resumo proposta}

Posso voltar {dia da semana} pra fechar?
```

### WhatsApp 7d follow-up (se sem resposta)

```
Oi {Dono}, Breno. Tu chegou a olhar a proposta?

Sem pressão. Só queria saber se tem alguma dúvida que eu posso responder rapidão.
```

### Email follow-up (se WhatsApp não responde 14d)

```
Assunto: {Padaria} — proposta digital + dossiê

Oi {Dono},

Te visitei dia {DD/MM} com o diagnóstico digital da {Padaria}. Anexo o material que te apresentei e a proposta comercial.

Sem pressão pra responder. Se mudar de ideia, é só chamar.

Abraço,
Breno
{contato}
```

### Email "manda proposta" pós-meeting

```
Assunto: Proposta {Padaria} — válida 15 dias

Oi {Dono},

Anexei a proposta comercial conforme conversamos. Validade 15 dias corridos.

Pontos principais:
- R$ 3.497 (à vista R$ 3.197) ou 6× R$ 583 cartão
- Recurring R$ 247/mês após go-live
- 10 dias úteis pra entrega
- Garantia Performance 60 dias

Volto {dia da semana} {data} {horário} pessoalmente como combinado.

Qualquer dúvida antes, é só chamar no WhatsApp.

Abraço,
Breno
```

---

## Princípios não-negociáveis

1. **Dossiê de dor SEMPRE entregue impresso.** Mesmo se não vender. É lead magnet.
2. **Pricing verbal primeiro.** Slide só se prospect pedir explicitamente.
3. **Hand-drawn mockup, NÃO Figma.** Reduce FOMU + ownership rejection.
4. **JOLT só se prospect engajou.** Se está frio, recua e marca presencial follow-up.
5. **Floor R$ 1.500 1ª parcela.** Abaixo = NÃO com price-ceiling note no pilot-log.
6. **Garantia sempre verbal antes de mostrar no papel.** Lock psicológico antes de detalhe legal.
7. **Recurring NUNCA "grátis primeiros 3 meses pra fechar"** (RF4 Pricing). Floor R$ 79/mo (mas Essential R$ 149 é o real floor).
8. **CDC disclaimers OBRIGATÓRIOS** em todo material escrito (Patricia Peck ADR-0002).
9. **Preview URL = Stage 2 trigger.** Nunca mostrar em Stage 1 (preview leakage RF6).
10. **Contrato definitivo só pós-revisão advogado OAB-SC** (ADR-0002 valida 20 cláusulas).
