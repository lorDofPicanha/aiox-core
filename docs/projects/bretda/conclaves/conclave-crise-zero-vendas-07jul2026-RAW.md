# Conclave Bretda 07/Jul — material bruto por agente



================================================================
ad5ff629e2e715960
================================================================

# Bretda — 1 mês sem venda — Diagnóstico Pedro Sobral

**TL;DR:** A venda que não aconteceu em julho morreu em junho. O funil foi estrangulado no fim de maio (196→86 leads, −56%), e alto-ticket de ciclo longo cobra essa conta com 30-60 dias de atraso — exatamente como foi alertado em 29/Jun. O lead lixo do Nordeste é sintoma NOVO (3 dias de campanha), não a causa do mês. E tem um detalhe que puxei ao vivo hoje que ninguém colocou na mesa: **o Google está com QS 2 na keyword campeã e as campanhas "Alta Intenção" estão com teto de CPC abaixo do preço do leilão — dinheiro alocado que nunca entra no jogo.**

---

## 1. Causa raiz ranqueada

**#1 — Lag do colapso de volume de junho (peso ~50%).**
Matemática de funil, não mistério: taxa lead→venda ~1,5% estável (dossiê 29/Jun). Junho gerou 86 leads → esperança matemática de **1,3 vendas** → junho fez 1. Julho está colhendo o pipeline de junho, que era metade do de maio. Venda de mesa de R$30k não nasce no mês do clique; nasce do lead de 4-8 semanas atrás. O próprio diagnóstico interno de 29/Jun previu: "o colapso de junho bate em jul/ago". Bateu. Engajamento ≠ compra, e lead de ontem ≠ venda de hoje.

**#2 — O plano de 29/Jun durou 5 dias (peso ~20%).**
Foi aprovado: 1 adset consolidado, janela limpa 10-14 dias SEM MEXER. Em 04/Jul (dia 5) mexeu-se em tudo: form pausado, campanha nova, objetivo novo, criativo novo destino. Essa conta está em Learning perpétuo desde o fim de maio (3-13 eventos/sem vs régua 50). Cada pivô zera o relógio. A Operação Diária existe pra decidir com baseline — aqui não existe baseline há 6 semanas porque ninguém deixa a máquina rodar.

**#3 — Geo Brasil-inteiro no CTWA (peso ~15%, mas 100% da queixa "Nordeste R$5k").**
Puxei o targeting ao vivo: adset `120249597117640737` está com `geo_locations: {countries: [BR]}` — **zero cidade, zero bairro, zero pin**. Diverge de TODAS as campanhas de qualidade desde 18/Jun (28 cidades + 10 bairros nobres). E pior: objetivo CONVERSATIONS entrega pra conversa mais barata do país — CPM e custo por conversa no Nordeste popular são fração do de Itaim/Jurerê, então o leilão arrasta a entrega pra lá sozinho. LAL 1% = 1,3-1,6M pessoas espalhadas; sem recorte geográfico, a semente premium de 102 contatos vira estatística. **CPMsg R$10,20 com 0 qualificados = Vanity CPMsg clássico** (mesmo padrão Tocks C007). Mas atenção: essa campanha tem 3 dias e R$265 gastos — ela explica os leads horríveis DE AGORA, não o mês sem venda.

**#4 — Google: rank quebrado onde a intenção é perfeita (peso ~10%).**
Dado ao vivo de hoje: a keyword campeã `"mesa de sinuca e jantar"` está com **Quality Score 2** (238 impr, 23 clicks, R$134 em 14d, a ÚNICA com conversão). QS 2 × CPC teto R$6 = Ad Rank no chão = IS 10%. Você compra 10% de um leilão onde os search terms são ouro puro ("sinuca sob medida", "madeira maciça", "de luxo" — zero lixo). E as duas campanhas "Alta Intenção" reativadas em 04/Jul: puxei os detalhes — Bilhar tem **CPC médio histórico de R$9,83** e o teto da conta é R$6. Tradução: o lance nunca alcança o leilão, por isso 0 impressões em 30 dias. Não é review, não é bug — **é R$40/dia de orçamento fictício**. Dezenas de keywords dessas campanhas com QS 0 e 0 impressões confirmam: elas simplesmente não participam.

**#5 — Os 76 leads do form "que não respondem" (peso: recuperável).**
CPL R$28,32 de público premium. Faz a conta comigo: CPL alvo = margem por venda × taxa de close ÷ fator segurança BR = (R$30.000 × ~30%) × 1,5% ÷ 5... dá **~R$27**. O CPL do form estava NO alvo. Lead de Instant Form esfria em HORAS — se o primeiro contato demora e a cadência é de 1-2 toques, "não respondem" é o resultado esperado, não prova de lead ruim.

## 2. O que eu REFUTO

**Refuto a narrativa implícita do founder de que "a otimização recente" (CTWA) explica o mês sem venda.** Impossível: a campanha tem 3 dias. O mês sem venda foi decidido em junho, quando alguém trocou volume por "qualidade" e cortou o funil pela metade sem nunca sair do Learning. O CTWA mal-configurado é a PRÓXIMA crise (a de agosto), não a atual. Confundir as duas leva a consertar a coisa errada.

**Refuto também que "os 76 leads são lixo porque não respondem".** Lead premium a CPL no alvo matemático não vira lixo coletivamente da noite pro dia. CPL isolado é caixa preta — sem sales feedback loop ninguém aqui sabe: quanto tempo levou o 1º contato? Quantos toques? Que mensagem? Em ciclo de semanas, parte dessas vendas ainda está viva. O problema mora no inbox, não no Ads Manager.

**E refuto parcialmente que "o form com perguntas era estruturalmente superior" ao CTWA.** O form qualificava, sim — mas o que matou não foi o formato, foi volume estrangulado + learning nunca fechado. CTWA com geo premium + pergunta-filtro na boas-vindas é recuperável e ainda tira o atrito do formulário. O erro do CTWA não é conceitual, é de configuração (geo) e de processo (nenhum filtro na conversa).

## 3. Três ações P0 (14 dias)

**P0-1 — Consertar o geo do CTWA HOJE + filtro de qualificação na conversa. Custo: R$0 incremental (mantém R$100/d).**
- O quê: no adset `120249597117640737`, restaurar o recorte premium (28 cidades + 10 bairros nobres + pins micro-enclave, padrão 18/Jun), manter LAL 1% e idade 35-65. Na mensagem de boas-vindas do WhatsApp, ancorar preço e triar: *"Nossas mesas são feitas sob medida em madeira maciça, projetos a partir de R$25 mil. Quer receber o catálogo e falar com o atelier?"* — quem quer mesa de R$5k se auto-elimina de graça.
- Número esperado em 14d: CPMsg sobe de R$10,20 para **R$18-30 (e é PRA subir — barato estava comprando lixo)**; 40-60 conversas, das quais **8-15 qualificadas** (aceitam a âncora de R$25k+) e **2-4 orçamentos formais**.
- Como medir: planilha Sheets diária conversa → qualificado → orçamento → venda (Operação Diária, 10 min/manhã). Gate: se em 14d CPMsg-qualificado > R$150, revisar criativo, não o geo.
- Depois de mexer: **janela limpa de 14 dias de verdade desta vez.** Mexeu de novo antes do dia 14, o diagnóstico morre.

**P0-2 — Necromancia dos 76 leads do form. Custo: R$0 de mídia, ~2h/dia do vendedor por 10 dias.**
- O quê: cadência de 5 toques/10 dias, priorizando quem declarou maior orçamento no form: D0 mensagem curta + foto de mesa REAL entregue em casa de cliente; D+2 pergunta binária ("o projeto era pra casa ou pra área de lazer de empreendimento?"); D+5 áudio de 30s do atelier; D+7 ligação; D+10 break-up ("vou encerrar seu projeto por aqui, se retomar me chama").
- Número esperado em 14d: 15-25% de resposta em recontato bem feito de alto ticket = **11-19 conversas reais, 1-2 orçamentos, e a venda mais provável do mês está AQUI** — mais do que em qualquer campanha nova, porque esses leads já pagaram por si.
- Como medir: coluna de status por lead na mesma planilha do P0-1. Anotar o motivo de cada "morto" — isso vira insumo de criativo.

**P0-3 — Google: bid cirúrgico onde converte + matar o orçamento fictício. Custo: R$0 (realocação dos mesmos R$140/d).**
- O quê: (a) pausar as 2 campanhas "Alta Intenção" como estão — teto R$6 contra leilão de R$9,83 é teatro, 30 dias/0 impressões provam; realocar os R$40/d pra campanha Aquisição; (b) subir o CPC máx **só no ad group "Bilhar + Jantar (dupla função)"** para R$9-10 — não é "subir CPC sem consertar rank" que o founder vetou: é lance no ÚNICO termo com conversão, junto do fix de QS; (c) o QS 2 é post-click → **deployar o fix do configurador que já está pronto e parado** (custo zero, só decisão).
- Número esperado em 14d: IS 10% → **25-35%** no ad group campeão; clicks no termo bom de ~23/14d para **50-70/14d**; **4-8 cliques-WhatsApp/sem** vindos de intenção perfeita.
- Como medir: IS semanal + search terms + conversas WhatsApp marcadas por origem ("veio do Google?") na planilha. Se QS não sair de 2 em 14d pós-deploy, o problema é a LP inteira, não o lance.

**Total: R$0 de budget novo. Tudo realocação + processo.** Pré-condição inegociável: founder garante **saldo Meta contínuo** — os R$265 em 3 dias (~88% de entrega/d) já cheiram a limitação de saldo, e buraco de saldo no meio da janela limpa invalida tudo de novo, igual junho.

## 4. Blind spot que aposto que o painel vai deixar passar

**Ninguém mede o que acontece DEPOIS do clique — e sem isso, daqui a 30 dias tem outro conclave igualzinho a este.** O painel vai debater geo, LAL, CPC, criativo... e a conta não tem **sales feedback loop**: não existe registro de speed-to-lead (quantos minutos até o 1º contato?), de cadência (quantos toques por lead?), nem de qual campanha/termo gerou cada conversa qualificada. "Os leads não respondem" e "vieram clientes horríveis" são hoje frases de sentimento, não dados. Uma planilha Sheets com 6 colunas (data, origem, lead, 1º contato em X min, status, motivo-morte), preenchida na Operação Diária, custa zero e é o único instrumento que vai dizer se o problema de agosto é mídia ou é inbox. CPL sem close rate é mentira — e essa conta está inteira gerenciada por CPL.

*Atrair, Bater, Captar. Mata loser, escala winner — mas primeiro deixa o placar existir.*

— **Pedro Sobral**

================================================================
a85adfe7e45376eb2
================================================================

# Diagnóstico Bretda — 1 mês sem venda | Larry Kim (PPC/Paid Media)

Vamos direto ao ponto, porque os dados gritam. Eu procuro unicórnios e mato burros — e nessa conta tem UM unicórnio sendo estrangulado e DOIS burros vestidos de estratégia.

---

## 1. Causa raiz ranqueada

**#1 — O zero de julho foi assinado em junho: colapso de volume + lag do alto-ticket (peso ~50%).**
Matemática de pipeline, não opinião: taxa lead→venda ~1,5% estável (dossiê, 29/Jun). Maio = 196 leads → 3 vendas. Junho = 86 leads (−56%) → 1 venda. Ciclo de venda = semanas. A venda de julho nasce dos leads de junho — e junho gerou ~86 × 1,5% ≈ 1,3 vendas *esperadas*, com variância de Poisson enorme em n=1. Zero vendas em 30 dias com esse volume não é anomalia, é a distribuição fazendo o que distribuição faz. O próprio dossiê registrou o alerta em 29/Jun ("colapso de junho bate em jul/ago") — e batia. **Evidência: leads 196→86, CPM R$21→R$43, adsets presos em Learning com 3-13 eventos/sem vs régua de 50.**

**#2 — CTWA sem geo = comprar conversa no inventário mais barato do Brasil (peso ~25%, mas explica 100% da queixa "Nordeste R$5k").**
Dado ao vivo: adset `120249597117640737` com `geo_locations: {countries: [BR]}` — Brasil inteiro, zero cidades, zero pins, quando TODA campanha de qualidade desde 18/Jun usava 28 cidades + 10 bairros nobres. LAL 1% = 1,3-1,6M pessoas espalhadas pelo país; sem recorte geográfico, o leilão entrega onde o CPM é mais barato — e CPM barato correlaciona com renda baixa. Some a isso o formato de fricção ZERO (1 clique → WhatsApp, sem nenhuma pergunta qualificadora, sem preço no anúncio) e você fabricou a máquina perfeita de curioso de R$5k. R$10,20/conversa parece bom até você perceber que só 9 de 26 (35%) passaram de 5 mensagens. Boas práticas de CTWA confirmam: broad sem qualificação embutida = lead lixo; a qualificação tem que estar no anúncio e na primeira mensagem ([respond.io](https://respond.io/blog/click-to-message-ads), [WhatsApp Business](https://business.whatsapp.com/blog/click-to-whatsapp-ad-guide)).

**#3 — Google: um anúncio unicórnio preso num rank de burro (peso ~15%, e é o desperdício mais estúpido da conta).**
CTR 13,4% em Search. Benchmark de Search fica em 3-6%. Isso é CTR de unicórnio — top 2% — em termos com a MELHOR intenção que já vi nessa vertical ("mesa de sinuca que vira mesa de jantar", zero lixo nos search terms). E o que fazemos com ele? **Impression Share de 10%**. Noventa por cento do leilão perfeito jogado fora. Por quê? Dado ao vivo: QS 2 na única keyword que converte ("mesa de sinuca e jantar"), QS 0-5 no resto — e o histórico da campanha Alta Intenção mostra CPC médio de R$9,83 quando ela entregava; o teto atual de R$6 não paga a entrada do leilão com QS baixo. Ad Rank = QS × lance: vocês travaram os DOIS fatores ao mesmo tempo. E o fix de landing page (QS post-click era 2) está PRONTO E NÃO DEPLOYADO. Lost IS by rank se conserta exatamente assim: QS + lance ([Adalysis](https://adalysis.com/blog/ppc-kpi-monitoring-how-to-diagnose-lost-search-impression-share-rank-top-impression-share-changes/), [Optmyzr](https://www.optmyzr.com/blog/google-ads-quality-score/)).

**#4 — Alta Intenção "reativada" com entrega zero = dinheiro alocado em campanha morta (peso ~10%).**
Dado ao vivo: keywords das Alta Intenção estão ENABLED (dezenas delas, todas com 0 impressões), campanha ENABLED, geo = Brasil (criterion 2076). Keywords vivas + campanha viva + 0 impressões = problema no NÍVEL DO ANÚNCIO: os 16 RSAs novos de 04/Jul apontando para `wa.me` estão ou em review, ou reprovados por política de destino (URL final wa.me é terreno minado de "destino não funcional/desalinhado" no Google), ou o ad group ficou sem anúncio ativo. R$40/d alocados, R$0 entregues.

---

## 2. O que eu REFUTO

**Refuto a leitura do founder de que "a otimização mais recente" causou o mês sem venda.** O CTWA está no ar há TRÊS DIAS. Ele não teve tempo de causar nada no placar de vendas — ele explica os leads ruins de *hoje*, não o zero de *julho*. O zero de julho foi causado pelo pivô de fim de maio que cortou o volume pela metade. São dois problemas diferentes com dois culpados diferentes, e misturá-los leva a consertar a coisa errada.

**Refuto também o enterro precoce do form nativo.** "Os 76 leads não respondem" está sendo tratado como prova de que o form era ruim. CPL R$28 com perguntas qualificadoras não produz 76 leads 100% mortos — produz leads que ESFRIAM. Ninguém no dossiê mediu speed-to-lead: quanto tempo entre o lead cair e o primeiro WhatsApp? Lead de form nativo (que nem saiu do Instagram) esfria em horas, não em semanas. Se o contato demorou 1-2 dias, o defunto é o processo de atendimento, não o formato. Matar o único mecanismo de qualificação estruturada da conta com base nesse dado é decisão de pânico, não de dados. O CTWA pode COEXISTIR com form — não era um ou outro.

**E refuto a regra "não subir CPC" como dogma.** Ela foi correta quando a landing tinha QS 2 e subir lance era pagar mais caro pela mesma multa. Mas com CTR 13,4%, o problema NUNCA foi relevância do anúncio — é rank. Deploy da landing + lance cirúrgico nos 3 termos unicórnio muda a equação inteira.

---

## 3. Três ações P0 (minhas, executáveis essa semana)

**P0-1 — Devolver o geo premium ao CTWA + qualificação de fricção no anúncio (HOJE, custo R$0).**
O quê: aplicar no adset CTWA o recorte comprovado (28 cidades + 10 bairros nobres, ou no mínimo excluir os estados fora do fit logístico/ticket) e reescrever o primary text + saudação automática do WhatsApp com âncora de preço explícita: "mesas sob medida a partir de R$30.000". Fricção é FEATURE em alto-ticket — quem se assusta com o preço no anúncio era clique desperdiçado.
Custo: R$0 (mesmos R$100/d).
Número esperado em 14 dias: conversas caem de ~9/d para 4-6/d; custo/conversa sobe para R$15-25 (aceitável — o gate histórico de R$15 foi calibrado sem âncora de preço); % de conversas com 5+ mensagens sobe de 35% para 60%+; 2-4 orçamentos formais de ticket R$30k emitidos.
Como medir: planilha diária — conversas iniciadas, conversas 5+ msgs, tag manual fit/não-fit no WhatsApp, orçamentos emitidos. Se em 7 dias o custo/conversa passar de R$30 sem melhora de fit, o problema é criativo, não geo.

**P0-2 — Destravar o unicórnio do Google: deploy da landing + lance R$9-10 cirúrgico + autópsia das Alta Intenção (48h, custo incremental ~R$0 — verba já alocada).**
O quê: (a) deployar o fix de landing JÁ PRONTO (isso sozinho ataca o QS 2); (b) subir teto de CPC de R$6 para R$9-10 SOMENTE nas keywords com CTR >10% e intenção dupla-função — "mesa de sinuca e jantar", "mesa de sinuca que vira mesa de jantar", "mesa de bilhar para sala de jogos" (a única com 2 conversões: 965 impr, 115 clicks, R$644) — o CPC médio histórico de R$9,83 da Alta Intenção diz qual é o preço real de entrada nesse leilão; (c) abrir a conta e checar o status de aprovação dos 16 RSAs wa.me — aposto em reprovação/review por política de destino; se for isso, trocar URL final para a landing do configurador com botão WhatsApp acima da dobra (resolve política E melhora QS de landing).
Custo: dentro dos R$140/d já alocados; realoco os R$40/d mortos das Alta Intenção para os termos unicórnio até elas entregarem.
Número esperado em 14 dias: IS 10% → 30-40% nos termos core; clicks de ~110/14d para ~250-300/14d; 8-12 conversas WhatsApp originadas do Google; QS da keyword-mãe de 2 → 4-5 (QS demora, mas a direção aparece em 2 semanas).
Como medir: IS e Lost IS (rank) semanais por keyword, CPC médio real vs teto, conversões clique-WhatsApp por search term.

**P0-3 — Necropsia com desfibrilador nos 76 leads do form (custo: R$280 de mídia + 2h/dia de atendimento por 5 dias).**
O quê: sequência de 3 toques em 7 dias, 1:1, não-massa — toque 1: foto/vídeo de mesa REAL em produção no atelier + pergunta binária ("o projeto da sua sala de jogos ainda está de pé pra este ano?"); toque 2 (D+3): âncora de escassez verdadeira ("agenda de produção de agosto: 2 vagas"); toque 3 (D+7): break-up message. Em paralelo, Custom Audience dos 76 + engajadores IG 90d num adset de remarketing R$20/d com o criativo do atelier.
Custo: R$280 em mídia/14d + tempo de atendimento.
Número esperado em 14 dias: 10-15% de resposta (8-11 conversas reativadas), 1-2 orçamentos qualificados. Leads de form de 30 dias não estão mortos em ciclo de compra de meses — estão desatendidos.
Como medir: taxa de resposta por toque, conversas reativadas, orçamentos. Bônus diagnóstico: se a taxa de resposta do toque 1 for >10%, está PROVADO que o form não era o problema — e ele volta ao ar ao lado do CTWA.

---

## 4. O blind spot que o resto do painel vai deixar passar

**Ninguém está medindo o que acontece DEPOIS do clique — e o placar que o founder olha tem 45 dias de atraso.** Todo mundo vai debater Meta vs Google, form vs CTWA, geo vs LAL. Mas a conta inteira despeja num buraco negro chamado "atendimento no WhatsApp" onde não existe UMA métrica: speed-to-lead (minutos até a primeira resposta), taxa de resposta por origem, % conversa→orçamento, tempo médio até orçamento. "Os leads não respondem" e "vieram clientes horríveis" são impressões de memória, não dados — e impressões de memória já causaram um pivô de pânico (matar o form) nesta semana. Segundo: enquanto o placar for VENDAS (lag de 30-60 dias), cada mudança de mídia será julgada pelo resultado da mídia de dois meses atrás — é dirigir olhando o retrovisor. O placar dos próximos 14 dias tem que ser **orçamentos qualificados de R$30k+ emitidos por semana** (leading indicator), com meta explícita: 3-5/semana. Sem isso, em agosto estaremos aqui de novo, culpando a otimização errada.

Fontes: [Adalysis — Lost IS by rank](https://adalysis.com/blog/ppc-kpi-monitoring-how-to-diagnose-lost-search-impression-share-rank-top-impression-share-changes/) · [Optmyzr — Quality Score 2026](https://www.optmyzr.com/blog/google-ads-quality-score/) · [respond.io — Click-to-Message best practices](https://respond.io/blog/click-to-message-ads) · [WhatsApp Business — CTWA guide](https://business.whatsapp.com/blog/click-to-whatsapp-ad-guide)

-- Kim. Kill the donkeys, scale the unicorns.

================================================================
af18258c7d0b4f454
================================================================

# Bretda — Mês Sem Venda — Diagnóstico Depesh Mandalia

*Puxei dado ao vivo agora (07/Jul): `meta_ads_overview` 30d + `meta_ads_insights` adset-level 7d na act_381618241134624, além do dossiê. NNC math is the truth — vamos aos números.*

---

## TL;DR

O mês sem venda **não foi causado pelo CTWA de 04/Jul** — ele tem 3 dias e R$265 gastos. Foi causado pelo **colapso de volume de junho (196→86 leads) batendo agora com o lag do alto-ticket**, exatamente como o alerta de 29/Jun previu — agravado por **indisciplina de janela** (o plano de 10-14d sem mexer foi quebrado no dia 5) e por **76 leads pagos a R$28 sendo dados como mortos sem processo de follow-up auditável**. O geo Brasil-inteiro do CTWA é um defeito real, mas é o sintoma da semana, não a doença do mês.

---

## 1. Causa raiz ranqueada

### #1 — Colapso de volume de junho + lag do ciclo (peso ~60%)

A matemática é brutal e simples. Taxa lead→venda histórica ~1,5% (dossiê, estável). Isso significa **~67 leads para produzir 1 venda**.

- Maio: ~196 leads → 3 vendas (1,53% ✓)
- Junho: 86 leads → expectativa ~1,3 vendas → 1 venda real ✓
- Pipeline de julho: alimentado pelos leads de junho (ciclo de semanas) → **expectativa <1 venda**

Com λ≈1 venda esperada/mês, a probabilidade de um mês ZERO por puro acaso é ~35% (Poisson). **O mês sem venda era o resultado mais provável dado o volume — não precisa de vilão novo.** Evidência no dado vivo: spend Meta 30d = apenas R$2.417 (média R$80/d), 76 leads no período. A conta está sub-alimentada para o próprio funil.

E o motor do colapso segue ativo: o pivô de qualidade de fim de maio prendeu tudo em Learning Limited (3-13 eventos/sem vs régua 50) e o CPM do adset premium **está a R$82 nos últimos 7d** (dado vivo — dobro dos R$43 do Brasil-inteiro, 4× os R$21 pré-pivô). Leilão punindo sinal fraco.

### #2 — Indisciplina de janela: 3 pivôs estruturais em 6 semanas (peso ~25%)

Fim de maio: pivô qualidade. 29/Jun: plano aprovado de "1 adset consolidado, janela limpa 10-14 dias SEM MEXER". **04/Jul — dia 5 da janela — pivô completo de novo** (form pausado, CTWA criado). A conta nunca acumula as ~50 conversões/semana que tiram um adset do Learning; cada pivô reseta o relógio. Isso é o primo do budget chicken: pânico gerencial destruindo winners antes de existirem. Evidência: nenhum adset da conta saiu do Learning desde maio (dossiê); o form adset [QUALIDADE] LAL+Pins ainda gastou R$219 nos últimos 7d gerando 5 leads @ R$43,97 — estava melhorando o custo por lead qualificado quando foi pausado.

### #3 — 76 leads @ R$28 dados como mortos sem processo (peso ~10%)

R$2.152 investidos em 76 leads de form com perguntas qualificadoras — e o veredito é "não respondem". Não há no dossiê **nenhum dado de cadência**: quando foram contatados, por qual canal, quantos toques, qual mensagem. Em alto-ticket, speed-to-lead de 5 min vs 24h muda taxa de resposta em 5-10×. Esses 76 leads = **~1,1 venda esperada sentada no CRM**. Escrever "leads mortos" sem 3 toques documentados é jogar R$2.152 e a venda do mês no lixo.

### #4 — Geo Brasil-inteiro no CTWA (peso ~5% do mês, mas 100% da queixa "Nordeste R$5k")

Confirmado ao vivo: `geo_locations: {countries: [BR]}`, zero cidades/pins. LAL 1% = 1,3-1,6M pessoas espalhadas pelo país; otimização por CONVERSAS entrega para quem conversa mais barato → CPM baixo → Nordeste, curiosos de R$5k. E o anúncio não tem âncora de preço, então nada filtra. É um defeito real e consertável em 1 dia — mas com 3 dias e R$265, **matematicamente não pode explicar um mês sem venda**. Aliás, o CTWA está entregando sinal decente: 26 conversas @ R$10,20, 9 usuários em profundidade 5+ (dado vivo). O motor funciona; o alvo está errado.

---

## 2. O que eu REFUTO

**Refuto a narrativa implícita do founder de que "a otimização mais recente" causou o mês sem venda.** Cronologia não fecha: o mês sem venda começou ANTES do CTWA existir. O CTWA trouxe os leads de R$5k do Nordeste (verdade, 3 dias de dano), mas a venda que não aconteceu em junho/julho morreu em MAIO, quando o funil foi estrangulado de 196 para 86 leads. Culpar a mudança de 04/Jul leva à conclusão errada ("volta o form e pronto") quando o problema estrutural é **volume insuficiente para a própria taxa de conversão + zero disciplina de janela**.

**Refuto também "os leads do form não respondem = o form falhou".** 76 leads a R$28 num ticket de R$30k é CPL de sonho (0,09% do ticket). Blended ROAS é mentira, mas aqui nem ROAS temos — temos um funil sem instrumentação de follow-up. Antes de declarar o form morto, quero ver: horário do 1º contato vs horário do lead, canal, script, nº de toques. Aposto que a maioria recebeu 1 mensagem genérica, tarde.

**E refuto parcialmente a dicotomia da pergunta 2 do dossiê ("CTWA vs form").** Falso dilema. O form qualificava por FRICÇÃO; o CTWA pode qualificar por ÂNCORA (preço no criativo + geo premium + pergunta de qualificação na 1ª mensagem). Os dois são recuperáveis; nenhum funciona com 3 pivôs em 6 semanas.

---

## 3. Três ações P0 (Meta — minha praia)

### P0-1 — Consertar o geo do CTWA HOJE + travar janela de 14 dias

- **O quê:** `meta_ads_update_targeting` no adset `120249597117640737`: restaurar o recorte premium validado (28 cidades + 10 bairros nobres + pins micro-enclave, PRESENCE) sobre a LAL 1%. Manter R$100/d — zero mexida de budget (soft cap +20%/d se for mexer depois). Depois disso, **calendário na parede: nada muda até 21/Jul.** Uma mudança, uma janela, uma leitura.
- **Custo:** R$0 incremental (mesmos R$100/d).
- **Número esperado em 14d:** conversas caem de ~8,7/d para **4-6/d** (volume menor, geo mais caro — CPM deve ir de R$43 para R$70-90 como o histórico do adset premium mostra), custo/conversa sobe para **R$18-28**, mas o mix Nordeste-R$5k vai a ~zero. 56-84 conversas qualificáveis no período.
- **Como medir:** founder tagueia cada conversa (lixo / curioso / qualificada ≥R$20k). Meta: **≥40% qualificadas** vs ~0% hoje. Segundo sinal: `messaging_user_depth_5` por conversa (hoje 9/26 = 35% — manter ou subir).

### P0-2 — Âncora de preço no criativo (qualificação DENTRO do anúncio)

- **O quê:** 2 variantes novas de Aurora/Opal no mesmo adset (max 5 ads/adset) com **"Sob medida a partir de R$30.000"** no texto primário + overlay na imagem + "feita à mão em SC, entrega em ~90 dias". Creative pillars, não hooks aleatórios: Pilar 1 (produto/desfecho) + Pilar 2 (atelier/origem). Em ticket R$30k, o anúncio É o filtro — targeting sozinho nunca segura curioso de R$5k, porque a LAL foi semeada também com engajadores de IG, não só compradores.
- **Custo:** R$0 de mídia (mesmo budget); só produção do criativo.
- **Número esperado em 14d:** CTR cai de 3,76% para **~1,8-2,5%** (e isso é BOM — clique barato de curioso saindo), % de conversas mencionando orçamento compatível sobe para ≥50%, custo/conversa qualificada ≤ **R$60** (num ticket de R$30k, eu pagaria R$300 sem piscar — nCAC máximo aqui é ~R$3.000 assumindo 30% de margem).
- **Como medir:** breakdown por ad no `meta_ads_insights` + tagueamento do founder. O ad sem âncora vs com âncora = teste A/B natural dentro do adset.

### P0-3 — Ressuscitar os 76 leads (bucket Existing/Engaged — o pipeline JÁ PAGO)

- **O quê:** os 76 leads são a venda do mês escondida (76 × 1,5% ≈ 1,1 venda esperada). Cadência de 3 toques via WhatsApp 1:1 em 10 dias, do founder/atelier — não mensagem genérica: toque 1 = foto real de mesa em produção no atelier + "posso te mandar o catálogo com valores?"; toque 2 (D+3) = vídeo de 20s do acabamento; toque 3 (D+7) = pergunta direta de timing ("projeto pra esse ano?"). Em paralelo: subir os 76 como Custom Audience e criar 1 adset de retargeting **Engaged** (R$20/d de dentro dos R$100, criativo Pilar 2 — atelier/prova social) para aquecer quem não responde. Isso finalmente monta os 3 buckets: Cold (CTWA geo-fixado) / Engaged (76 + engajadores) / Existing (33 compradores — indicação/upsell).
- **Custo:** R$0 de mídia nova (realocação) + ~2h do founder.
- **Número esperado em 14d:** taxa de resposta **15-25%** (11-19 respostas), **3-6 conversas reais de projeto**, e probabilidade ~60% de destravar 1 venda em 30-45d (o lag não perdoa: a venda de julho já se decide agora).
- **Como medir:** planilha simples — lead / data do toque / resposta S/N / estágio. Se após 3 toques bem executados a resposta ficar <8%, aí sim eu aceito "leads de form são fracos para esse ticket" e o CTWA vira canal único.

**O que eu explicitamente NÃO faria agora:** escalar budget (o gargalo é sinal e follow-up, não spend — escalar antes disso é encher balde furado), voltar o form em paralelo ao CTWA (dois eventos de otimização diferentes com <50 conversões/sem cada = dois Learnings eternos), ou qualquer pivô estrutural antes de 21/Jul.

---

## 4. O blind spot que o painel vai deixar passar

**Ninguém vai auditar o que acontece DEPOIS do clique — a operação de conversa/velocidade de atendimento.** O painel vai brigar sobre geo, LAL, IS de 10% no Google, CPC teto de R$6 — tudo em cima da mídia. Mas o dado vivo mostra **26 conversas iniciadas em 3 dias, 26 first-replies, 9 pessoas trocando 5+ mensagens** — e zero informação sobre: tempo até a 1ª resposta do atelier, script de qualificação, quem atende, se existe pergunta de orçamento no minuto 1. Num ciclo consultivo de R$30k, a plataforma entrega a CONVERSA; a venda nasce nos primeiros 5 minutos do WhatsApp. Se o atendimento demora 6h ou abre com "oi, tudo bem?" em vez de qualificar, tanto faz o geo — o funil morre no mesmo lugar. E o corolário desconfortável: **com expectativa de ~1 venda/mês no volume atual, um mês zero é cara-ou-coroa estatístico** — o maior risco da conta não é o Nordeste, é o painel prescrever mais um pivô de pânico para "consertar" ruído de números pequenos. Disciplina de janela é a intervenção mais barata e mais ignorada da lista.

---

*Cost cap dancing vem depois — primeiro a conta precisa sobreviver a 14 dias sem ninguém mexer nela.*

**— Depesh Mandalia** · SM Commerce · BPM Method

================================================================
a7043f8b30eb043fc
================================================================

# Diagnóstico Bretda — Mês Sem Venda
### Alex Hormozi (mind clone) · 07/Jul/2026

Vou direto ao ponto: **vocês não têm um problema de "clientes horríveis do Nordeste". Vocês têm um problema de volume que vocês mesmos criaram em maio, mais um problema de oferta que nunca resolveram.** A mesa de R$5k é sintoma, não doença. Deixa eu mapear os inputs e outputs.

---

## 1. Causa raiz ranqueada

**#1 — O lag do corte de volume de junho (peso ~60%).**
Olhem os números, porque eles fecham redondos: maio = 196 leads → 3 vendas (1,5%). Junho = 86 leads → 1 venda (1,2%). A taxa lead→venda **não caiu** — o input caiu 56%. Com ciclo de venda de semanas, as vendas de julho são função dos leads de junho: 86 leads × 1,5% = **expectativa de ~1,3 vendas**. Com número esperado de 1,3, a chance de dar ZERO num mês é ~27% — puro dado de Poisson. Não é mistério, não é maldição, não é o Nordeste. É matemática: vocês cortaram o combustível no fim de maio e o motor apagou com o atraso previsto — que, aliás, **estava escrito no diagnóstico de 29/Jun** ("o colapso de junho vai bater em jul/ago"). Bateu.

**#2 — Follow-up morto nos 76 leads do form (peso ~25%).**
R$2.152 pagos, 76 pessoas levantaram a mão há menos de 30 dias para uma mesa de R$30 mil, e a queixa é "não respondem". Não respondem A QUÊ? Se a mensagem foi "oi, vi que você preencheu o formulário" — isso não é follow-up, é spam educado. Lead de alto-ticket não morre em 30 dias; o que morre é a razão para ele responder. Vocês compraram atenção e não deram nada em troca dela.

**#3 — Geo Brasil-inteiro no CTWA sem âncora de preço (peso ~15%).**
O dado ao vivo mostra `geo_locations: {countries: [BR]}` — sem cidade, sem bairro, sem pin — numa LAL de 1,3-1,6M espalhada pelo país, com anúncio que não fala preço. Claro que veio gente querendo mesa de R$5k. Mas atenção: essa campanha tem **3 dias e R$265 gastos**. Ela explica a queixa de hoje, não o mês sem venda. E os R$10,20/conversa com 9 pessoas passando de 5 mensagens dizem que o canal tem pulso.

**Bônus (dinheiro na mesa, não causa):** Google com Search IS de 10% em termos como "mesa de sinuca que vira mesa de jantar" — isso é uma multidão faminta na porta do restaurante e vocês atendendo 1 em cada 10. E duas campanhas "Alta Intenção" ENABLED com **0 impressões em 30 dias** — budget alocado, entrega zero. Isso é vazamento operacional puro.

---

## 2. O que eu REFUTO

**Refuto a hipótese do founder de que "a otimização trouxe clientes horríveis" é a causa do mês sem venda.** Cronologicamente impossível: o CTWA nasceu dia 04/Jul; o mês sem venda foi construído em junho. O founder está confundindo o incômodo mais recente com a causa raiz — erro clássico de quem mexe em três coisas ao mesmo tempo (pivô qualidade → consolidação → CTWA) e nunca deixa uma janela limpa fechar. O plano de 29/Jun dizia "10-14 dias SEM MEXER". Durou 5 dias.

**E refuto a premissa por trás do pivô de maio: que se compra qualidade de lead com TARGETING.** Errado. Qualidade se compra com OFERTA. Pin de bairro nobre encareceu o CPM de R$21 para R$43-50, matou o volume, prendeu tudo em Learning — e ainda assim o lead de R$5k apareceu. Por quê? Porque o anúncio não diz o preço. Quem qualifica um comprador de mesa de R$30k não é o CEP dele — é a frase "peças sob medida a partir de R$28 mil" no criativo. O cara de R$5k se auto-elimina de graça, e o algoritmo aprende com quem sobra. Vocês pagaram CPM dobrado para fazer o trabalho que uma linha de copy faz por R$0.

---

## 3. Três ações P0 (lente de oferta — minha praia)

**P0-1: Âncora de preço + qualificação estruturada no CTWA (hoje, custo R$0 de mídia).**
- **O quê:** (a) editar os criativos Aurora/Opal para incluir a âncora — "mesas sob medida em madeira maciça, projetos a partir de R$28 mil"; (b) restaurar recorte geográfico intermediário (as 37 cidades — sem pins micro que mataram a entrega, o meio-termo entre Brasil-inteiro e enclave); (c) mensagem de boas-vindas com qualificação em 2-3 perguntas, **uma por mensagem**: cidade → é para casa própria ou projeto de arquitetura? → prazo. Os dados de mercado confirmam: CTWA bem implementado converte conversa em lead qualificado a taxas de 45-60% quando o fluxo qualifica cedo, e responder em <60s multiplica conversão.
- **Custo:** R$0 além dos R$100/d já rodando.
- **Número esperado em 14 dias:** conversas caem de ~8,7/d para 4-6/d, mas ≥15 conversas *qualificadas* (cidade-alvo + ciente do ticket) a ≤R$35/conversa qualificada, 2-4 orçamentos enviados.
- **Como medir:** % de conversas que respondem a pergunta de prazo/projeto; custo por conversa qualificada (não por conversa). Parem de medir conversa bruta — é métrica de vaidade nesse ticket.

**P0-2: Ressuscitar os 76 leads com uma OFERTA, não com um "oi" (hoje, custo R$0).**
- **O quê:** sequência de 3 toques em 7 dias no WhatsApp. D1: 9 palavras — *"Ainda procurando sua mesa de sinuca sob medida?"* (só isso; pergunta curta reabre conversa). D3: valor — projeto 3D personalizado gratuito da mesa no ambiente dele + 1 foto de mesa entregue com nome da cidade. D7: takeaway real — "fechando a agenda de produção de agosto, X vagas". Escassez de produção artesanal é VERDADEIRA no negócio de vocês — usem.
- **Custo:** R$0 (tempo de quem atende).
- **Número esperado em 14 dias:** 10-20% de resposta = 8-15 respostas, 3-5 conversas quentes, 1-2 orçamentos; 1 venda em 30-45 dias (que sozinha paga ~4 meses de toda a mídia atual).
- **Como medir:** respostas/76 por toque; orçamentos enviados. Se D1 der <5% de resposta, o problema é o número/canal, não a copy — testar e-mail.

**P0-3: Destravar a multidão faminta do Google (esta semana, custo R$0 novo).**
- **O quê:** (a) auditar POR QUE Alta Intenção Bilhar+Jantar têm 0 impressões (anúncio em review? ad group sem RSA aprovado? keywords pausadas?) — são R$40/d alocados entregando nada; (b) enquanto não destrava, mover esses R$40/d para a Aquisição que entrega (IS 10% por budget/rank = cada real a mais compra leilão que vocês JÁ vencem em CTR 13,4%); (c) **deployar o fix de CRO do configurador que está pronto e parado** — QS post-click 2 é o que segura o rank sob teto de R$6; e expor o preço no configurador pelo mesmo motivo do P0-1.
- **Custo:** R$0 incremental (realocação + deploy de código pronto).
- **Número esperado em 14 dias:** IS 10% → 20-25%; ~90-110 clicks; 10-14 conversas WhatsApp vindas do Google; primeiro lead Google qualificado com ticket ciente.
- **Como medir:** Search IS semanal; conversões wa.me por campanha; QS pós-deploy.

Uma regra: **façam na ordem e não mexam em mais nada por 14 dias.** O histórico dessa conta é morrer de otimização, não de falta dela.

---

## 4. O blind spot que o painel vai deixar passar

**Todo mundo vai debater targeting, plataforma e criativo — e ninguém vai olhar o que acontece DEPOIS que a conversa começa.** O funil inteiro de vocês termina numa caixa de WhatsApp sem script, sem SLA de resposta, sem oferta de próxima etapa e sem CRM. 26 conversas em 3 dias, 9 passaram de 5 mensagens — e daí? Quem respondeu? Em quantos minutos? Perguntou o quê? Ofereceu qual próximo passo? Num negócio de R$30k com ciclo de semanas, o "appointment" de vocês deveria ser o **projeto 3D gratuito** — um compromisso nomeado, com data, que transforma curioso em pipeline. Sem isso, cada melhoria de mídia que esse painel recomendar vai vazar pelo mesmo buraco. E o corolário: a métrica que ninguém rastreia — **orçamentos enviados por semana** — é o único leading indicator honesto de venda nesse negócio. Leads é input, venda é lag de 30-45 dias; orçamento enviado é o pulso. Se essa linha não subir nos próximos 14 dias, nada do resto importa.

Vocês não têm um problema de tráfego. Vocês têm um problema de oferta e de conversa. O tráfego só está cobrando por isso.

— Hormozi. Agora vai fazer o trabalho. 💰

---

**Fontes:**
- [AsisteClick — Click-to-WhatsApp Ads (CTWA): 2026 guide](https://asisteclick.com/en/blog/click-to-whatsapp-ads-ctwa-conversion-2026/) (taxas de conversão CTWA 45-60% com fluxo qualificado; casos LATAM/Brasil)
- [Flowcart — WhatsApp Lead Qualification](https://www.flowcart.ai/blog/whatsapp-lead-qualification) (resposta <60s multiplica conversão; qualificar sem interrogar, 1 pergunta por mensagem)
- [LeadSync — WhatsApp Flows for Lead Generation & Qualification](https://leadsync.me/blog/whatsapp-flows-lead-qualification/) (fluxo estruturado corrige a fraqueza do chat aberto; handoff humano para alto-ticket)

================================================================
aaae88e0db29f43fa
================================================================

# Diagnóstico Bretda — mês sem venda | April Dunford

*Dados: dossiê 07/Jul + pull ao vivo que eu mesma fiz hoje (Meta insights adset-level últimos 7d; amostra dos search terms Google 30d — li a amostra do topo do relatório, não as 2.102 linhas, e ela confirma o que o dossiê diz sobre intenção).*

A primeira pergunta que eu sempre faço: **o que o seu cliente de R$30k faria se a Bretda não existisse?** Ele NÃO compraria uma mesa de R$5k. Ele contrataria um marceneiro de alto padrão, pediria pro arquiteto especificar uma peça importada, ou — o inimigo real — **não decidiria nada** e deixaria o espaço vazio mais seis meses. O comprador de R$5k nunca foi seu cliente. Se ele está chegando, o problema não é ele. É o contexto que você está criando.

---

## 1. Causa raiz ranqueada

**#1 — Lag do colapso de leads de junho (peso ~50%).** Isto é aritmética, não mistério. Taxa lead→venda ~1,5% estável (o próprio dossiê confirma). Maio: 196 leads → 3 mesas. Junho: 86 leads → 1,3 mesas esperadas → saiu 1. Ciclo de semanas significa que **julho vende com o pipeline de junho** — e o pipeline de junho tinha metade do tamanho. O alerta de 29/Jun previu exatamente isso ("colapso de junho bate em jul/ago"). O mês zerado de julho foi assinado em junho. Evidência: linha do tempo do dossiê + a régua de 1,5%.

**#2 — O pivô CTWA de 04/Jul removeu TODO o posicionamento operacional de uma vez (peso ~30%, e crescendo).** Antes, duas camadas faziam o trabalho de contexto: (a) geo premium (28 cidades + bairros nobres + pins) dizia *para quem*; (b) o form nativo com perguntas qualificadoras dizia *o que isto é e o que custa*. Em 04/Jul as duas foram removidas — targeting ao vivo hoje é `countries: [BR]`, nada mais — e **nada foi colocado no lugar**: nem âncora de preço no criativo, nem qualificação na primeira mensagem. Resultado: o anúncio joga a Bretda na categoria genérica "mesa de sinuca", head-to-head com a mesa de loja de R$5k. Mesma mesa, contexto diferente, comprador completamente diferente. Evidência ao vivo: 26 conversas @ R$10,20 com CTR 3,76% — **a máquina está funcionando com eficiência admirável para atrair o comprador errado**. Isso não é campanha ruim; é campanha boa com posicionamento ausente.

**#3 — Os 76 leads do form não estão mortos; estão sem motivo para decidir (peso ~15%).** 40-60% dos deals de ticket alto morrem em *no decision*, não para um concorrente. Esses 76 vieram de segmentação premium a CPL R$28 — eram o público certo. Se não respondem, aposto que o follow-up é "oi, vi que você preencheu o formulário" — que não ensina nada, não cria urgência e não ajuda ninguém a decidir. Silêncio não é rejeição; é indecisão.

**#4 — Google: você está ausente do único lugar onde o cliente declara intenção (peso ~5% no mês zerado, mas o maior desperdício estrutural).** IS 10% = você aparece em 1 de cada 10 buscas de gente digitando "mesa de sinuca e jantar", "sinuca sob medida", "mesa de sinuca madeira maciça". Confirmei na amostra: "mesa de sinuca e jantar" tem 13 clicks, CTR 14,3% e a ÚNICA conversão da conta. E as duas campanhas Alta Intenção estão ENABLED com **0 impressões em 30 dias** — dinheiro alocado, entrega zero.

---

## 2. O que eu REFUTO

**"Depois da otimização mais recente vieram clientes horríveis do Nordeste."** Duas coisas erradas aqui, founder.

Primeira: o CTWA tem **3 dias de vida**. Ele não pode ter causado um mês sem venda. Você está ancorando na mudança mais recente porque ela é visível no WhatsApp, mas o zero de julho foi produzido pelo colapso de leads de junho (causa #1). São dois problemas diferentes com dois remédios diferentes — misturá-los leva a "otimizar" a coisa errada de novo.

Segunda: **o problema não é o Nordeste, é a ausência de contexto.** Restaurar o geo premium sem consertar o criativo vai te entregar o mesmo comprador de R$5k — só que morando em bairro nobre. Gente rica também compra mesa barata quando o anúncio não diz que aquilo é peça de atelier a partir de R$30k. O anúncio hoje compete na categoria errada; a categoria é que filtra, o CEP só ajuda.

Também refuto parcialmente a leitura de que "os leads do form são lixo/não respondem, logo o form falhou". O form nativo com perguntas qualificadoras era estruturalmente CORRETO para ticket R$30k — ele fazia o trabalho de contexto que o CTWA não faz. O que falhou foi o que acontece *depois* do lead, não o mecanismo de captura.

---

## 3. Três ações P0 (posicionamento — minha praia)

**P0-1: Colocar o posicionamento DENTRO do anúncio CTWA — âncora de categoria + preço + qualificação na primeira mensagem. HOJE.**
- **O quê:** reescrever copy dos ads Aurora/Opal para categoria "big fish, small pond": *"Mesa de sinuca que vira mesa de jantar. Feita em atelier, madeira maciça, sob medida. Projetos a partir de R$30 mil."* E a mensagem de saudação do WhatsApp pergunta contexto, não pede pedido: *"Para eu te orientar melhor: o projeto é para casa, área gourmet ou condomínio? Nossos projetos partem de R$30 mil."* O preço no anúncio é o form qualificador que você removeu — só que mais barato.
- **Custo:** R$0 (edição de criativo + mensagem). Sem tocar em budget.
- **Número esperado em 14 dias:** conversas caem de ~60/sem para ~25-35/sem (bom — você quer menos), mas % que passa da âncora de preço e chega a 5+ mensagens sobe dos atuais 35% (9/26) para ≥55%, e zero "mesa de 5k". 
- **Como medir:** conversas iniciadas vs `messaging_user_depth_5` no adset `120249597117640737` + contagem manual de "pedintes de R$5k" no WhatsApp (hoje é a métrica que o founder sente na pele; formalize-a).

**P0-2: Resgatar os 76 leads com um pitch que ENSINA, não um follow-up que cobra.**
- **O quê:** sequência de 3 mensagens WhatsApp/email construída no meu 8 passos, começando pelo Insight, não pelo produto. Msg 1: *"Quem procura mesa de sinuca hoje encontra 3 caminhos: mesa de loja (R$5-8k, MDF, some em 5 anos), importada (bonita, mas não cabe no seu vão nem combina com sua marcenaria), ou peça de atelier sob medida. A maioria trava porque ninguém explica a diferença — deixa eu te mostrar em 3 fotos."* Msg 2: prova (mesa entregue + nome da cidade/condomínio). Msg 3: ask pequeno (*"quer que eu monte uma simulação 3D com as medidas do seu espaço?"* — o configurador vira ferramenta de venda, não de site).
- **Custo:** R$0 de mídia; ~2h de redação + envio manual 1:1 (24 leads/dia, 3 dias).
- **Número esperado em 14 dias:** benchmark de reativação de lead frio de 30-60 dias em alto ticket = 10-15% de resposta → **8-11 respostas, 2-4 conversas qualificadas, 1 proposta**. Com pipeline zerado, 1 proposta é infinitamente mais que o atual.
- **Como medir:** taxa de resposta por mensagem da sequência; qual das 3 alternativas o lead se identifica (isso vira dado de posicionamento de graça).

**P0-3: Google — dominar o pond que os seus dados já escolheram: "mesa de sinuca e jantar".**
- **O quê:** o ad group "Bilhar + Jantar (dupla função)" tem CTR 14,3% e a única conversão da conta — o mercado está te dizendo qual é a sua categoria. Concentrar: (i) subir CPC teto **só nesse ad group** de R$6 → R$9-10 (não é "subir CPC sem consertar rank" — é comprar share no único lugar onde o rank já é bom, CTR 14% prova isso); (ii) RSA com a mesma âncora de categoria+preço do P0-1; (iii) destravar as 2 campanhas Alta Intenção com 0 impressões — diagnóstico de 30 min (ads em review? grupo sem ad ativo?) antes de qualquer centavo novo.
- **Custo:** +R$10-15/dia de CPC efetivo dentro do budget já alocado (R$140/d Google, sendo R$40/d hoje comprando literalmente nada nas Alta Intenção).
- **Número esperado em 14 dias:** IS do ad group nicho 10%→25-35%; +12-20 clicks/sem de intenção declarada; 3-5 conversas WhatsApp de gente que DIGITOU o que você vende.
- **Como medir:** Search IS semanal por ad group + conversões wa.me por termo de busca.

---

## 4. O blind spot que o painel vai deixar passar

Todo mundo vai discutir mídia — geo, budget, CPC, CPL. **Ninguém vai perguntar o que é dito DENTRO das conversas de WhatsApp.** Nos últimos 7 dias, 9 pessoas chegaram a 5+ mensagens no CTWA e não existe pitch estruturado documentado — cada conversa é improvisada. Em venda consultiva de R$30k, a conversa É o funil: sem estrutura (insight → alternativas → mundo perfeito → produto → prova → ask), toda conversa converge para "quanto custa?" → choque → silêncio → *no decision*. Você pode consertar 100% da mídia e continuar vendendo zero se a conversa não ensinar o comprador a escolher com confiança. Peça os transcripts das últimas 10 conversas de 5+ mensagens e leia. Aposto que o pitch morre na primeira pergunta de preço — porque o preço está sendo revelado como surpresa no minuto 3, em vez de âncora no segundo 0 do anúncio (P0-1).

(Bônus do blind spot: a lista de 24 arquitetos parada é o pond mais pequeno e mais rico que vocês têm — especificadores que trazem o cliente de R$30k já qualificado. Não é "mídia", então ninguém vai priorizar. Deveria ser a P0-4 na semana que a mídia estabilizar.)

Mesmo produto, contexto diferente, resultado completamente diferente. O produto está pronto. O contexto foi desligado em 04/Jul. Religue-o.

— Dunford. Same product, different context, completely different outcome. 🎯

================================================================
ac056ccccd5e2bc60
================================================================

# Bretda — Um mês sem venda: diagnóstico de conversão
**Jo (Joanna Wiebe) · Conversion Copywriting · 07/Jul/2026**

Antes de qualquer palavra: eu li os anúncios ao vivo. Os dois criativos CTWA (Aurora e Opal), os 16 RSAs novos do Google, o pre-fill do WhatsApp. E aqui está o que os dados mostram: vocês não têm um problema de "clientes horríveis do Nordeste". Vocês têm um problema de List-Offer-Copy — nessa ordem — e o copy de vocês está fazendo zero trabalho de portaria.

---

## 1. Causa raiz ranqueada

**#1 — LIST: o pipeline de julho foi esvaziado em junho (peso ~50%).**
Ciclo de venda de semanas + leads 196→86/mês (−56%) a partir de fim de maio + taxa lead→venda ~1,5% estável = a matemática já tinha cravado o zero de julho lá atrás. 86 leads × 1,5% ≈ 1,3 vendas/mês — e o próprio diagnóstico de 29/Jun previu: "o colapso de junho bate em jul/ago". Bateu. Isso não é mistério, é lag. Nenhum headline conserta um funil que ficou 5 semanas sem gente entrando. List antes de Offer, Offer antes de Copy.

**#2 — COPY sem âncora de preço + geo Brasil inteiro = leads de R$5k (peso ~30%).**
Eu li o anúncio Aurora palavra por palavra: "feita sob encomenda", "madeira maciça nobre", "peça única", "projeto autoral". Bonito. E **nenhum número em lugar nenhum** — nem no title, nem no body, nem no pre-fill do WhatsApp ("Olá! Quero desenhar minha mesa Bretda sob encomenda"). Junte isso ao targeting ao vivo que eu confirmei no dossiê: `geo_locations: {countries: [BR]}` — Brasil inteiro, sem cidade, sem bairro, sem pin. Resultado previsível: para quem sonha com mesa de R$5k, "sob encomenda" e "peça única" soam como *aspiração acessível*, não como R$30k+. O anúncio antigo tinha DOIS filtros (form com perguntas qualificadoras + geo premium). O de 04/Jul removeu os dois no mesmo dia e não colocou nada no lugar. As 26 conversas a R$10,20 são baratas porque estão compradas do leitor errado. Regra de Um violada: esse anúncio não tem UM leitor — tem 1,4 milhão.

**#3 — Os 76 leads do form não estão mortos; estão mal contatados (peso ~15%).**
76 leads @ R$28 CPL que preencheram um form nativo de alta intenção há menos de 30 dias, num ciclo de compra de semanas, **não são uma lista morta** — são um pipeline sem sequência. "Não respondem" a quê, exatamente? Quantos toques? Com que copy? Se foi um "Olá, vimos seu interesse" genérico, isso não é copy — é filler. Lead de alto-ticket em fase de consideração ignora o primeiro ping e responde ao terceiro toque que traz algo novo (projeto, prazo, prova).

**#4 — GOOGLE: dinheiro alocado, entrega zero (peso ~5% no mês, mas grátis de consertar).**
Eu chequei: os RSAs novos apontando pro wa.me estão ENABLED com **0 impressões** — todos eles. E os RSAs bons antigos (o de "Mesa de Sinuca e Jantar", 10,6% CTR, 1 conv) estão PAUSED. Search terms impecáveis ("mesa de sinuca que vira mesa de jantar" — isso é VOC puro, aliás) com IS de 10%. Intenção excelente batendo na porta e 90% do leilão perdido.

---

## 2. O que eu REFUTO

**"Vieram clientes horríveis do Nordeste" como diagnóstico de audiência.** O founder está lendo isso como problema de *quem* (região/targeting). Errado — ou pelo menos incompleto. É problema de *o que o anúncio diz*. Um anúncio de luxo sem âncora de preço atrai sonhadores em Balneário Camboriú tanto quanto em Fortaleza; o geo Brasil-inteiro só aumentou o volume do erro. Corrigir só o geo e manter o copy sem número = leads de R$5k dos Jardins em vez de leads de R$5k do Nordeste. Mais elegante, igualmente sem venda.

**"Os antigos do formulário não respondem" = lista queimada.** Refuto até me mostrarem a sequência que foi enviada. Vocês pagaram R$2.152 por esses 76 nomes. Numa categoria onde a decisão leva semanas, "silêncio aos 20 dias" é o comportamento NORMAL do comprador de R$30k — não um veredito. A hipótese barata de testar é: o follow-up era genérico e sem trabalho novo. Isso se conserta com copy, não com mídia nova.

**E parcialmente refuto o pânico com o CTWA em si.** R$10,20/conversa com CTR 3,76% e 9 de 26 conversas passando de 5 mensagens não é um canal quebrado — é um canal sem portaria. O form nativo qualificava com perguntas; o CTWA pode qualificar com copy + pre-fill + primeira resposta do atendente. O mecanismo é recuperável; o que não é recuperável é rodar mais 14 dias sem filtro.

---

## 3. Três ações P0 (meu domínio: as palavras)

### P0-A — Âncora de preço no anúncio + pre-fill autoqualificador (HOJE, custo R$0)
**O quê:** reescrever o body dos 2 ads CTWA e o texto pre-fill. O leitor precisa se desqualificar sozinho ANTES de gastar o tempo do consultor.

- Body (Aurora), acrescentar uma linha: *"Projetos partem de R$30 mil. Prazo de atelier: sob consulta."* — especificidade é filtro E é prova de categoria.
- Pre-fill atual: "Olá! Quero desenhar minha mesa Bretda sob encomenda." → **"Olá! Quero um projeto Bretda sob medida (sei que os projetos partem de R$30 mil)."** O botão é um portal de conversão: quem aperta esse, já disse sim ao preço.

**Custo:** R$0 (mesma verba de R$100/d). **Número esperado em 14 dias:** conversas caem de ~8-9/dia para ~3-4/dia; % de conversas com 5+ mensagens sobe de 35% (9/26) para 55%+; ≥8 orçamentos formais de R$30k+ enviados; **zero** conversa "tem de 5 mil?". **Como medir:** conversas iniciadas + profundidade (5+ msgs) via insights, e uma planilha manual do atendente: fit/no-fit por conversa. Se em 7 dias o custo/conversa passar de R$25 mas o fit for >60%, está funcionando — conversa cara e certa vale mais que conversa barata e errada.

### P0-B — Sequência de reativação dos 76 leads do form (48h, custo R$0)
**O quê:** 3 toques por WhatsApp em 10 dias, escritos em PAS, cada mensagem com UM trabalho:

1. **Toque 1 (novidade, não cobrança):** "Oi {nome} — aqui é {consultor}, do atelier Bretda em Blumenau. Você configurou uma mesa {linha} há algumas semanas. Montei duas opções de projeto no seu estilo antes de liberar a agenda de produção de agosto. Quer que eu te mande?" — traz trabalho novo + escassez real de atelier.
2. **Toque 2 (dia 4, prova):** foto/vídeo de uma peça saindo do atelier + "essa levou 7 semanas, madeira {espécie}". Especificidade vende.
3. **Toque 3 (dia 10, breakup honesto):** "Vou arquivar seu projeto — me diz só se ainda faz sentido pra este ano?" Breakup messages historicamente puxam as maiores taxas de resposta da sequência.

**Custo:** R$0 de mídia (tempo do atendente + eventualmente centavos de template WhatsApp API). **Número esperado em 14 dias:** 10-15 respostas (13-20% — normal para lista <60 dias com toque personalizado), 3-5 orçamentos reativados, 0-1 venda dentro dos 14d (o ciclo é longo; a venda desses leads fecha em 30-45d — mas é a venda mais barata disponível no negócio hoje). **Como medir:** planilha toque→resposta→orçamento→venda, por variação de mensagem. Escrevam 2 versões do Toque 1 e dividam 38/38. Testem, não assumam.

### P0-C — Disparar o outreach dos 24 arquitetos que já está PRONTO (esta semana, custo R$0)
**O quê:** a copy Hopkins-88 existe, a lista tier S (Fernanda Marques, Sig Bergamin, Guilherme Torres, Brunete) existe, e está tudo parado esperando 3 inputs do founder (nome/cargo, link do catálogo, nº de residências). Isso é o único canal da Bretda onde o leitor JÁ vive no mundo dos R$30k+ — o arquiteto de alto padrão não precisa de âncora de preço, ele É a âncora. Mais perto da transação do que qualquer anúncio.
**Custo:** R$0 + 30 minutos do founder. **Número esperado em 14 dias:** 24 emails 1:1 → 4-7 respostas (15-30% é a faixa normal de outreach genuinamente personalizado a essa senioridade), 1-2 conversas de specificação abertas. Uma única especificação de arquiteto paga o trimestre. **Como medir:** resposta por email, por variação de copy (as 2 variações já existem — usem as duas, 12/12).

*(Fora do meu domínio mas registro: os RSAs wa.me com 0 impressões e IS 10% no Google são o vazamento de mídia mais barato de consertar — os search terms mostram gente digitando exatamente o produto. Passem isso pro especialista de tráfego HOJE.)*

---

## 4. O blind spot que aposto que o painel vai deixar passar

**Ninguém vai auditar o copy DENTRO do WhatsApp — e é lá que o dinheiro troca de mãos.**

O painel inteiro vai discutir geo, budget, Learning Phase, lag, IS. Mas olhem este número do dossiê: **26 conversas iniciadas → só 9 passaram de 5 mensagens.** 65% das conversas morrem nas primeiras trocas. O que o atendente responde quando chega "Olá! Quero desenhar minha mesa"? Essa primeira resposta é o headline mais importante do funil da Bretda hoje — e ninguém a escreveu de propósito, ninguém a testou, e ninguém tem o script na mão.

E o segundo tesouro escondido no mesmo lugar: **essas 26 conversas + as objeções dos leads de "R$5k" são message mining puro.** As palavras exatas que os prospects usam para perguntar preço, prazo, madeira, entrega — isso é o material do próximo anúncio, da próxima landing, do próximo follow-up. Vocês estão sentados em cima da pesquisa de voz-do-cliente mais barata do mundo e tratando como lixo de atendimento. Peçam os transcripts. Antes de escrever a próxima palavra.

A melhor copy que a Bretda vai escrever já está na boca do cliente. Alguém só precisa parar de olhar pro gerenciador de anúncios por uma hora e ir ler.

— Jo. Agora vá testar.

================================================================
a0983dd243fc50c75
================================================================

Note: claude-opus-4-8[1m] (the safety classifier) was unavailable when reviewing this subagent's work. Please carefully verify the subagent's actions and output before acting on them.

# Relatório de Pesquisa — Fontes Primárias | Conclave Bretda (07/Jul/2026)

Escopo: 5 frentes pedidas. Cada achado tem fonte(s) e veredito de confiança (alta = doc oficial ou estudo primário; média = múltiplas fontes de praticantes convergentes; baixa = fonte única/inferência).

---

## Frente 1 — CTWA vs formulário qualificador para alto ticket

**1.1 — Existe filtro de qualificação nativo em CTWA, e a campanha atual da Bretda NÃO o usa.** A Meta suporta: (a) `page_welcome_message` (saudação customizada no criativo, configurável via API no `object_story_spec`), (b) **ice breakers** — até 4 perguntas pré-escritas que o lead toca para iniciar a conversa, e (c) o **objetivo "Leads" estendido a CTWA** com fluxo de Q&A ramificado (perguntas de qualificação automáticas dentro do chat, configuradas no Ads Manager) — nesse modo o algoritmo otimiza para quem *completa o fluxo de perguntas*, não para quem apenas inicia conversa. O adset atual da Bretda roda objetivo CONVERSATIONS puro (otimiza "conversa iniciada"), sem welcome message estruturada nem Q&A — ou seja, paga por qualquer um que mande "oi".
Fontes: [Meta for Developers — Ads that Click to WhatsApp](https://developers.facebook.com/documentation/ads-commerce/marketing-api/ad-creative/messaging-ads/click-to-whatsapp) · [Zoko — Setup Icebreakers via Meta Business Manager](https://www.zoko.io/learning-article/setup-icebreakers) · [Rework — Meta Added the Lead Objective to WhatsApp Ads](https://resources.rework.com/news/chat-conversational/meta-click-to-whatsapp-performance-marketer)
**Confiança: ALTA** (doc oficial Meta + reportagem sobre feature oficial; ressalva: Q&A do objetivo Leads em CTWA ainda em rollout "select advertisers").

**1.2 — Otimizar por "conversas" (não "conversões") é causa documentada de lead lixo em CTWA.** Praticantes convergem: campanhas otimizadas para *maximizar conversas* atraem curiosos de baixa intenção ("low-intent clicks waste budget and clog your inbox"); mudar para otimização por conversão/lead qualificado (idealmente com sinal via CAPI) melhora qualidade. Audiência ampla demais é o segundo agravante citado.
Fontes: [Respond.io — Click to Message Ads best practices](https://respond.io/blog/click-to-message-ads) · [Kommo — Click-to-WhatsApp](https://www.kommo.com/blog/click-to-whatsapp/) · [WANotifier — CTWA guide](https://wanotifier.com/click-to-whatsapp-ads-guide/)
**Confiança: MÉDIA** (múltiplos praticantes, sem estudo controlado).

**1.3 — CTWA não é estruturalmente pior que form para alto ticket — pode ser melhor, SE tiver qualificação na conversa.** Benchmarks de praticantes: CPC de CTWA 10-30% maior, mas CPL 40-70% menor; taxa clique→mensagem 3-5× maior que clique→form; CTWA supera form em categorias de alta consideração (imóveis, educação, high-ticket D2C). A vantagem-chave é o timing: qualificação começa "no momento da intenção", e a janela de 72h de mensagens grátis permite conduzir o funil. A condição é desenhar o fluxo (perguntas de orçamento/prazo/cidade nos 2-3 primeiros toques) — sem isso vira balcão de "quanto custa?".
Fontes: [Sbl.so — CTWA + AI Lead Qualification](https://sbl.so/blog/click-to-whatsapp-ads/) · [AsisteClick — CTWA 2026 guide](https://asisteclick.com/en/blog/click-to-whatsapp-ads-ctwa-conversion-2026/) · [Flowcart — WhatsApp Lead Qualification](https://www.flowcart.ai/blog/whatsapp-lead-qualification)
**Confiança: MÉDIA** (números de vendors do ecossistema WhatsApp — viés pró-CTWA; direção consistente entre fontes independentes).

**1.4 — Form nativo com perguntas qualificadoras + otimização "Conversion Leads" é o mecanismo oficial da Meta para qualidade.** A Meta documenta que o performance goal "Conversion leads" prioriza qualidade (mostra o ad a quem tende a virar *cliente*, não a quem preenche form), e perguntas de múltipla escolha sobre orçamento/prazo filtram curiosos. Ou seja: o form da Bretda tinha o mecanismo certo; o problema documentado de forms é outro — velocidade de contato (ver Frente 5).
Fontes: [LeadsBridge — Conversion Leads optimization](https://leadsbridge.com/blog/conversion-leads-optimization-facebook/) · [Meta Business Help — Lead Ads metrics](https://www.facebook.com/business/help/1544628789462866/) · [Jon Loomer — Instant Forms vs Website quality test](https://www.jonloomer.com/testing-quality-leads/)
**Confiança: ALTA** para o mecanismo (doc/help oficial); MÉDIA para comparações de qualidade.

---

## Frente 2 — Lookalike 1% × geo aberto Brasil

**2.1 — LAL não se distribui uniformemente no território; a entrega vai para onde o leilão é mais barato.** Doc da Meta sobre lookalikes multi-região: o público semelhante "pode não ser distribuído uniformemente" entre as localizações — o sistema concentra onde há mais matches. E o delivery empurra budget para onde a otimização sai mais barata ("Meta's algorithm will prioritize cheaper impressions"). Aplicado dentro do Brasil: otimizando por *conversa iniciada* a R$100/d país-inteiro, o leilão entrega onde CPM e custo-por-conversa são menores — regiões de renda média menor —, exatamente o padrão "clientes do Nordeste querendo mesa de R$5k". A recomendação documentada é separar ad sets por região quando controle regional importa.
Fontes: [Meta Business Help — Best Practices for Multi-country Lookalike Audiences](https://www.facebook.com/business/help/1589915247700182) · [Meta Business Help — About How Lookalike Audiences Work](https://www.facebook.com/business/help/1108247545961158) · [AdAmigo — Meta Ads Geographic Expansion](https://www.adamigo.ai/blog/ultimate-guide-to-meta-ads-geographic-expansion) · [Bigeye — Geographic Targeting for Meta Ads](https://www.bigeyeagency.com/insights/geographic-targeting-for-meta-ads-guide-2026)
**Confiança: ALTA** para o princípio (doc oficial multi-país + mecânica de leilão); **MÉDIA** para a transposição intra-Brasil (não achei doc Meta específico sobre skew regional BR; é inferência mecânica forte + bate com o sintoma observado). Nota: CPM médio BR R$15-35 no feed ([Trafius — CPM Brasil 2026](https://trafius.com.br/blog/cpm-medio-facebook-ads-brasil-2026)); o CPM de R$43,50 da campanha atual já está acima da média nacional, indicando que a LAL em si é cara — o barateamento vem do *quem* responde, não do *onde* o ad é caro.

**2.2 — LAL 1% é "os mais parecidos com a seed", mas a seed de 102 contatos é pequena e o recorte geográfico anterior era o que segurava a qualidade.** O 1% (~1,3-1,6M no BR) é o tier mais preciso, porém com seed pequena a semelhança é grosseira (demografia/comportamento genérico de "engajador de móveis"), e sem o recorte de 28 cidades + bairros nobres o filtro socioeconômico implícito do geo desaparece. A própria recomendação da Meta de "usar país em vez de cidades" ([Optmyzr](https://www.optmyzr.com/blog/meta-ads-targeting-strategies/)) é para *performance de entrega/volume*, não para qualidade de ticket — para alto ticket os guias recomendam o oposto: geo estreito como proxy de renda.
Fontes: [Jon Loomer — Meta Ads Lookalike Audiences](https://www.jonloomer.com/meta-ads-lookalike-audiences/) · [Coinis — 1% vs 5% Lookalike](https://coinis.com/how-to/1-vs-5-facebook-lookalike)
**Confiança: MÉDIA.**

**2.3 — Caso BR documentado de distorção de entrega:** relato de campanha com público amplo onde "70% da entrega foi para técnicos urbanos e consultores" em vez do perfil-alvo, gerando "leads com perfil de ticket menor" — mesmo padrão da queixa Bretda.
Fonte: [LeadCultura — 5 estratégias de segmentos Meta Ads](https://leadcultura.com.br/meta-ads-segmentos-publico/) · [Jadson — Por que sua campanha gera leads ruins](https://jadsonempreendedor.com/meta-ads-por-que-sua-campanha-gera-leads-ruins-e-como-corrigir/)
**Confiança: BAIXA** (anedótico, nicho diferente; serve como padrão ilustrativo, não prova).

---

## Frente 3 — Mercado de mesas de bilhar de luxo BR

**3.1 — Concorrente nº1 (BlackBall) confirma o posicionamento e a faixa de preço.** BlackBall (desde 2005) domina o SEO da categoria ("mesa de sinuca de luxo", "preço de mesa de sinuca", "mesa de sinuca e jantar" — todas páginas próprias rankeando) e publica que o mercado vai "de R$1.000 a R$150.000". Estratégia deles = conteúdo educacional de preço + design/materiais (Jequitibá Rosa, ardósia Minar, inox 304) — ou seja, capturam a demanda orgânica que a Bretda disputa via paid com IS de 10%.
Fontes: [BlackBall — mesa de sinuca de luxo](https://www.blackball.com.br/mesa-de-sinuca-de-luxo/) · [BlackBall — preço de mesa de sinuca](https://www.blackball.com.br/preco-de-mesa-de-sinuca/) · [BlackBall — home](https://www.blackball.com.br/)
**Confiança: ALTA** (site do próprio concorrente).

**3.2 — Sazonalidade: jun/jul é vale histórico do varejo de móveis BR; a alta vem no 2º semestre.** Dados setoriais (Abimóvel/Brazilian Furniture/IBGE PMC) mostram o varejo de móveis fraco no meio do ano com recuperação puxada por Dia dos Pais → Black Friday → Natal. Ou seja, parte do "mês sem venda" tem componente sazonal — mas NÃO explica sozinho a queda 3→1→0, que acompanha o colapso de leads (−56%).
Fontes: [Brazilian Furniture — vendas de móveis sobem no 2º semestre](https://www.brazilianfurniture.org.br/noticias/detalhe/vendas-no-varejo-de-moveis-e-colchoes-apresentam-alta-no-segundo-semestre) · [Abimóvel — Panorama mai/jun](https://abimovel.com/panorama-do-mercado-de-moveis-traz-indicadores-atualizados-dos-meses-de-maio-e-junho-de-2024/) · [IBGE PMC](https://www.ibge.gov.br/estatisticas/economicas/comercio/9227-pesquisa-mensal-de-comercio.html)
**Confiança: MÉDIA** (dados são do varejo de móveis geral, não do nicho bilhar de luxo; não achei série específica de sinuca).

**3.3 — Arquiteto/especificador é canal real e remunerado no alto padrão BR (Reserva Técnica).** A RT é prática consolidada: fornecedor paga 5-12% (às vezes mais) ao arquiteto que especifica mobiliário/marcenaria — "indicações de mobiliário e marcenaria são as principais fontes de pagamento de RT". É polêmica eticamente (CAU/BR considera infração receber comissão; pesquisa do CAU documenta o racha da categoria), mas mostra que o canal especificador MOVE ticket alto no Brasil — e programas de relacionamento com arquitetos (modelo showroom: Ornare, Artefacto etc.) são o mecanismo padrão de venda de peça de R$30k+. Isso valida o ativo parado da Bretda (lista de 35 escritórios) como canal de venda, não só de branding. Estruturar como "programa de relacionamento/condição comercial para especificadores" evita a zona cinzenta da RT oculta.
Fontes: [Zhen Home — RT para arquitetos (3%+)](https://zhenhome.com/rt-para-arquitetos-como-funciona-a-reserva-tecnica/) · [BORAnaOBRA — Tudo sobre RT](https://boranaobra.com.br/tudo-sobre-reserva-tecnica-rt-aquela-comissao-que-existe-no-mercado-de-projetos-ou-obras/) · [CAU/BR — Arquitetos pela Ética](https://www.caubr.gov.br/arquitetospelaetica/?page_id=9) · [CAU/MG — pesquisa sobre RT](https://www.caumg.gov.br/resultados-pesquisa-cau-reserva-tecnica) · [Arquicast 259 — polêmica da RT e programas de relacionamento](https://www.arquicast.com/2025/09/22/arquicast-259-a-polemica-da-reserva-tecnica-e-dos-programas-de-relacionamento/)
**Confiança: ALTA** para existência/percentuais do canal; a implicação estratégica é interpretação minha.

---

## Frente 4 — Google Ads: ENABLED com 0 impressões

**4.1 — Checklist oficial do Google (ordem de diagnóstico).** A doc oficial de troubleshooting lista, nesta ordem prática: (1) **status de revisão dos anúncios** — RSAs novos levam 24-48h, até 5 dias úteis em alguns casos (as Alta Intenção foram reativadas 04/Jul com 16 RSAs novos → review é o suspeito nº1, mas 30 dias de zero impressão é longo demais para ser só isso se a reativação foi há 3 dias e o histórico de 30d inclui o período pausado — checar se o "0 em 30d" é pré-reativação); (2) **ad group ativo COM anúncio ativo dentro** (grupo sem anúncio elegível = zero silencioso); (3) **keywords pausadas/removidas ou "low search volume"** (keyword marcada low search volume fica inativa sem aviso); (4) conta/billing suspensos; (5) **budget baixo**; (6) **bid/Ad Rank insuficiente** — "com bid muito baixo sua campanha não entra nem vence leilões e pode não ter impressão nenhuma" (com teto Manual CPC R$6 e a campanha irmã perdendo 90% de IS, rank é causa plausível para as Alta Intenção também); (7) targeting restritivo demais. Regra prática das fontes: zero impressão após 48-72h da mudança = problema estrutural, investigar. Ferramentas oficiais: **Ad Preview & Diagnosis** e Diagnostic Insights mostram o motivo exato por keyword.
Fontes: [Google Ads Help — How to fix Search campaign not running or low traffic](https://support.google.com/google-ads/answer/9208915?hl=en) (fetch direto, oficial) · [White Peak — 12 causas de 0 impressões](https://whitepeak.io/no-impressions-google-ads/) · [ConvertLab360 — approved but no impressions](https://convertlab360.com/blog/google-ads-approved-but-no-impressions-fix.html)
**Confiança: ALTA** (doc oficial do Google fetchada).

**4.2 — IS 10% na Aquisição:** a mesma doc oficial enquadra: bid baixo → perde leilões (budget-lost 90% do dossiê). Subir CPC sem consertar QS/rank só encarece — consistente com o veto do founder; a alavanca documentada é qualidade (QS post-click, já endereçado no fix de CRO não-deployado) + IS por termo exato onde converte.
Fonte: [Google Ads Help idem](https://support.google.com/google-ads/answer/9208915?hl=en)
**Confiança: ALTA.**

---

## Frente 5 — Speed-to-lead e taxa de resposta (form em alto ticket)

**5.1 — A demora mata a taxa de contato em ordens de magnitude (estudos primários).** MIT/InsideSales (Oldroyd, 15.000+ leads): contatar em 5 min vs 30 min = **21× mais chance de qualificar** e **100× mais chance de sequer falar com o lead**. HBR 2011 (2.241 empresas auditadas): tempo médio de resposta 42h, **23% nunca respondem**; responder em 1h = 60× mais chance de qualificar vs 24h. Compilações 2026: contato em 5 min converte até 8× mais; ~78% dos compradores fecham com quem responde primeiro.
Fontes: [MIT Lead Response Management Study (PDF original)](https://25649.fs1.hubspotusercontent-na2.net/hub/25649/file-13535879-pdf/docs/mit_study.pdf) · [AInora — todos os estudos (MIT, HBR, Drift)](https://ainora.lt/blog/lead-response-time-statistics-every-study-2026) · [Apten — Speed-to-lead benchmarks 2026](https://www.apten.ai/blog/speed-to-lead-benchmarks-2026)
**Confiança: ALTA** para MIT/HBR (estudos primários, ainda que antigos e B2B-céticos); MÉDIA para os agregados 2026.

**5.2 — Implicação para os 76 leads "mortos" do form Bretda:** o silêncio dos leads é o comportamento *esperado* quando o contato não é imediato — intenção decai a partir do minuto do preenchimento ("intent decay"), e lead de instant form (preenchido em 2 toques com autofill, sem sair do feed) tem intenção mais rasa que lead de landing page, exigindo follow-up ainda mais rápido e multi-toque. Não achei benchmark BR publicado específico de "taxa de resposta de lead de form Meta em alto ticket" (lacuna real de dado público); os proxies internacionais indicam taxa de contato de 20-40% quando o follow-up demora horas, e o dado interno da própria Bretda (lead→venda ~1,5% estável) já é o benchmark mais confiável disponível.
Fontes: [Aimdoc — Speed to lead: why 5 minutes matters](https://aimdoc.ai/blog/speed-to-lead-and-why-it-matters) · [Jon Loomer — Instant Forms quality test](https://www.jonloomer.com/testing-quality-leads/) · [CaseyResponse — Lead response time statistics](https://caseyresponse.com/blog/lead-response-time-statistics)
**Confiança: MÉDIA** (benchmark BR alto ticket inexistente publicamente — declarado como lacuna; inferência de estudos internacionais).

---

## Síntese para o conclave (leitura do pesquisador)

- **A causa dos "leads horríveis do Nordeste" tem mecanismo documentado**: objetivo CONVERSATIONS (otimiza volume de conversa barata) + geo Brasil-inteiro (leilão entrega onde é barato) + LAL sem o recorte socioeconômico que o geo premium fazia. Os três fixes têm suporte em doc oficial: recolocar geo recortado, migrar para objetivo com otimização de conversão/lead, e ativar welcome message + ice breakers/Q&A de qualificação (achados 1.1, 1.2, 2.1).
- **CTWA é recuperável** — a literatura o favorece para alto ticket justamente pela velocidade (achados 1.3 + 5.1); o que faltou foi a camada de qualificação nativa.
- **Google Alta Intenção 0 impressões**: diagnosticável em minutos com Ad Preview/Diagnostic Insights; suspeitos em ordem: review dos 16 RSAs novos → ad group sem anúncio elegível → keywords low-volume/pausadas → Ad Rank sob teto R$6 (achado 4.1).
- **Jun/jul é vale sazonal de móveis no BR** (achado 3.2) — agrava mas não explica o zero; o lag do colapso de leads de junho (previsto em 29/Jun) continua sendo a explicação dominante.
- **Canal arquiteto é o único canal documentado que vende R$30k+ de forma consistente no BR** (RT/programas de relacionamento, achado 3.3) — o ativo parado dos 35 escritórios é a alavanca não-mídia mais validada pela pesquisa.

================================================================
aa119f629111e1c99
================================================================

# RODADA ADVERSARIAL — Larry Kim (PPC) | Conclave Bretda 07/Jul/2026

Li os quatro. Boa notícia: ninguém disputou a causa raiz — o painel inteiro convergiu no lag de junho. Má notícia: tem gente vestindo burro de unicórnio e unicórnio de burro nas prescrições. Vamos ao pente fino.

---

## 1. ATAQUE

### Pedro Sobral — o veredito precipitado das Alta Intenção

**"Não é review, não é bug — é R$40/dia de orçamento fictício. Pausar as 2 campanhas como estão."** Sobral, você cravou diagnóstico sem abrir a ferramenta que dá o diagnóstico. Os 16 RSAs wa.me têm **3 dias de vida** — a doc oficial do Google (Frente 4.1 da pesquisa, confiança ALTA) põe **status de revisão como suspeito nº1** para anúncio novo, com até 5 dias úteis de fila, e URL final `wa.me` é campo minado de política de destino. Seu "0 impressões em 30 dias prova Ad Rank" tem um furo de janela: **esses 30 dias incluem o período em que as campanhas estavam PAUSADAS** — zero impressão de campanha pausada não prova nada sobre leilão. Seu CPC histórico R$9,83 vs teto R$6 é um co-suspeito legítimo para o zero PRÉ-reativação; não é veredito para os RSAs de 04/Jul. Pausar antes de 30 minutos de Ad Preview & Diagnosis é matar um paciente sem exame. E se o problema for reprovação por política wa.me, sua pausa não realoca nada — ela só esconde o defeito que vai voltar na próxima campanha.

Segundo: sua conta de CPL alvo ("margem × close ÷ fator segurança... dá ~R$27") é engenharia reversa vestida de matemática. O fator "÷5" foi escolhido para o resultado bater no R$28 do form. Numerologia bonita não é benchmark.

### Depesh Mandalia — o médico que diagnostica anemia e proíbe transfusão

Depesh, você é o mais rigoroso do painel nos dados Meta — e por isso sua contradição central é a mais grave. **Causa #1 com peso 60%: "colapso de volume, conta sub-alimentada (R$2.417/30d)". Prescrição: "o que eu explicitamente NÃO faria: escalar budget."** Então a doença é fome e o remédio é jejum disciplinado? Seu P0-1 ainda REDUZ volume (geo premium = CPM R$70-90 pelo seu próprio número = menos conversas pelo mesmo R$100/d). Se o pipeline de julho morreu porque junho teve 86 leads, um agosto alimentado por um julho de 40-60 conversas geo-recortadas repete o zero — com disciplina de janela impecável e caixão bem fechado. Disciplina de janela é necessária; ela não substitui restaurar o INPUT que você mesmo apontou como causa dominante.

Segundo: **"o form adset gastou R$219/7d gerando 5 leads @ R$43,97 — estava melhorando o custo por lead qualificado quando foi pausado."** Melhorando em relação a quê? R$43,97 é **57% ACIMA** do CPL R$28 histórico do form. Você usou o dado que enfraquece sua tese como se a fortalecesse. n=5 em 7 dias não sustenta nem "melhorando" nem "piorando" — sustenta silêncio.

Terceiro: você declarou o Google "não é minha praia" e deixou **R$140/d — a maior alocação da conta — fora da sua análise inteira**, incluindo o único termo com conversão e CTR de 13-14%. Conclave não é buffet; ignorar o canal com a melhor intenção declarada da conta é um buraco do tamanho de um adset.

### Alex Hormozi — a falsa dicotomia "oferta vs targeting" e um erro de linha do tempo

**"Refuto a premissa de que se compra qualidade com TARGETING. Qualidade se compra com OFERTA."** Hormozi, a pesquisa refuta VOCÊ com doc oficial da Meta (Frente 2.1, confiança ALTA): a entrega **não é uniforme** e o leilão empurra budget para a impressão mais barata. Âncora de preço filtra quem CLICA; geo filtra quem VÊ. Sem geo, você paga CPM para exibir "a partir de R$28 mil" a um público que o leilão selecionou por ser barato — o curioso se auto-elimina DEPOIS da impressão paga. Auto-eliminação não é grátis; ela custa exatamente o CPM do inventário errado. A resposta não é oferta OU targeting — é os dois, e sempre foi.

E o seu argumento-prova está factualmente errado: **"pin de bairro nobre encareceu o CPM... e AINDA ASSIM o lead de R$5k apareceu."** Não apareceu. O dossiê é claro: sob geo premium a queixa era VOLUME (leads caros, Learning preso); o lead de R$5k do Nordeste nasceu em **04/Jul, com o CTWA Brasil-inteiro**. Você fundiu duas eras da conta para sustentar a tese de que geo não qualifica. A cronologia diz o oposto.

Bônus: suas taxas "CTWA converte 45-60% com fluxo qualificado" vêm de vendors do ecossistema WhatsApp — a própria pesquisa marcou viés pró-CTWA, confiança MÉDIA. Usar número de vendedor de martelo para provar que tudo é prego é abaixo do seu padrão.

### April Dunford — 30% de peso para uma campanha de 3 dias

April, você cometeu no ranking o erro que você mesma refutou no founder. **Sua refutação: "o CTWA tem 3 dias de vida, ele não pode ter causado um mês sem venda." Seu ranking: causa #2, peso 30%, para... o pivô CTWA de 04/Jul.** Uma campanha de R$265 não carrega 30% de um mês-zero que foi selado em junho — ela carrega ~100% da queixa de qualidade de lead e ~0% do placar de vendas. Você escreveu a acusação e a absolvição no mesmo documento. O peso honesto é o que Depesh e eu demos: ~5% do mês, 100% do sintoma.

E o **"restaurar geo premium vai te entregar o mesmo comprador de R$5k, só que morando em bairro nobre"** — meia-verdade perigosa. Geo premium não é só proxy de renda do lead individual; é correção do **skew de entrega do leilão** (Frente 2.1). E o histórico da própria conta desmente você: o form sob geo premium produziu leads a R$28 que fecharam a 1,5% — vendas REAIS de R$30k saíram exatamente desse recorte. O contexto que você quer no criativo, eu assino; usá-lo para rebaixar o geo é jogar fora o único filtro com track record de venda na conta.

### Joanna Wiebe — funil que não fecha a própria conta

Jo, seu pull dos criativos ao vivo foi o melhor trabalho primário do painel — e o P0-C dos arquitetos foi o único P0 genuinamente novo da rodada. Mas seu P0-A promete o impossível: **conversas caindo para 3-4/dia E "≥8 orçamentos formais de R$30k+ em 14 dias"**. Faça a conta que você não fez: ~45-55 conversas no período × 8 orçamentos = 15-18% de conversão conversa→orçamento formal, numa operação que você mesma descreveu como "sem script, sem portaria, 65% morrem antes da 5ª mensagem" — e cujo conserto de processo NÃO está no seu P0-A. Copy com âncora não quadruplica a competência do atendimento em duas semanas. Meu 2-4 orçamentos é o número que não constrange ninguém no dia 14.

E o **"leads de R$5k dos Jardins, igualmente sem venda"** — mesmo golpe do Hormozi/Dunford, mesma resposta: o geo premium + form fechou 3 mesas em maio. O dado da conta refuta a frase.

---

## 2. DEFESA E REVISÃO

**Onde me acertaram / a pesquisa me corrigiu — admito e reviso:**

1. **Meu P0-1 estava incompleto.** Eu prescrevi geo + âncora de preço + saudação. A Frente 1.1 (confiança ALTA, doc Meta) mostra que existe camada ESTRUTURAL que eu tratei como camada de copy: o adset roda **objetivo CONVERSATIONS puro** — o algoritmo otimiza para "qualquer um que manda oi". A pesquisa e o Depesh estão certos: o defeito não é só onde entrega e o que diz, é **para quê a máquina otimiza**. Revisado: welcome message estruturada via `object_story_spec` + ice breakers qualificadores + migração para o objetivo Leads/Q&A de CTWA quando disponível na conta.
2. **Meu #4 (Alta Intenção) precisava de caveat de janela.** Eu li "keywords ENABLED + 0 impressões em 30d" como prova de problema no nível do anúncio — mas o Sobral está certo que a janela de 30d inclui o período pausado, então o dado é ambíguo entre política/review (minha aposta, para os RSAs de 3 dias) e Ad Rank sob teto R$6 (aposta dele, para o histórico). A diferença prática é zero: **Ad Preview & Diagnosis resolve em 30 minutos** — e é isso que vai no P0, não o veredito de nenhum de nós dois. Onde mantenho a divergência: pausar antes de diagnosticar (prescrição dele) é errado.
3. **Deixei os arquitetos de fora.** A Frente 3.3 (confiança ALTA) mostra que especificador é **o único canal documentado que move R$30k+ de forma consistente no BR** — e a Wiebe apontou que a copy e a lista já existem, paradas por 3 inputs do founder. Um canal de custo R$0, leitor pré-qualificado, sem Learning Phase, sem leilão. Isso é um unicórnio fora do Ads Manager e eu, viciado em leilão, não olhei. Entra na minha posição final.
4. **Sazonalidade (Frente 3.2):** jun/jul é vale do varejo de móveis BR. Não muda meu ranking (não explica 3→1→0, que acompanha o corte de leads), mas muda a leitura do dia 14: comparar contra baseline sazonal, não contra maio.

**Onde me atacaram sem razão — defendo:**

- **"Geo não qualifica, oferta qualifica" (Hormozi/Dunford/Wiebe):** refutaram um espantalho. Meu P0-1 original já era geo **E** âncora — nunca geo-only. E o mecanismo é doc oficial: sem geo, o leilão compra a impressão mais barata do país ANTES de qualquer palavra do criativo trabalhar (Frente 2.1). Quem quiser derrubar isso precisa derrubar a doc da Meta, não a mim.
- **Meu lance cirúrgico R$9-10 nos termos unicórnio:** ninguém refutou — Sobral, Dunford e Hormozi convergiram (Sobral no ad group, eu por keyword; keyword-level é mais cirúrgico, mantenho o meu). CTR 13-14% + única conversão da conta + fix de landing pronto = as três condições que tornam subir lance investimento e não multa.
- **Coexistência form + CTWA:** o Depesh me acertou de raspão aqui — dois eventos de otimização com <50 conv/sem cada = dois Learnings eternos é um ponto técnico correto. Reviso a forma, não o fundo: o form não volta em PARALELO; ele volta como **substituto testável** se a necropsia dos 76 provar que o lead de form fecha (meu bônus diagnóstico original), ou é substituído pelo objetivo Leads/Q&A do CTWA, que entrega a qualificação do form dentro de uma campanha só.

---

## 3. POSIÇÃO FINAL

**Causa raiz nº1 (uma frase):** o zero de julho foi assinado no pivô de fim de maio que cortou o funil de 196→86 leads/mês — com taxa lead→venda ~1,5% estável e ciclo de semanas, 86 leads geram expectativa de ~1,3 vendas e um mês zero vira cara-ou-coroa de Poisson; o CTWA de 3 dias explica os leads de R$5k de hoje, não o placar de julho.

**P0-1 — CTWA: geo premium + âncora + qualificação NATIVA (hoje, R$0).**
Restaurar o recorte comprovado (28 cidades + 10 bairros nobres) no adset `120249597117640737`; âncora "projetos a partir de R$30 mil" no primary text E no pre-fill do botão; welcome message estruturada + ice breakers qualificadores via `object_story_spec` (cidade → casa/projeto de arquitetura → prazo); migrar para objetivo Leads/Q&A de CTWA se disponível na conta. Depois: **janela travada até 21/Jul, calendário na parede.** Medir: custo por conversa QUALIFICADA (fit tagueado pelo founder), profundidade 5+ msgs (de 35% para 55%+), 2-4 orçamentos formais em 14d.

**P0-2 — Google: autópsia de 30 min ANTES de qualquer pausa + destravar o unicórnio (48h, R$0 novo).**
(a) Ad Preview & Diagnosis nas 2 Alta Intenção — review/política wa.me vs Ad Rank sob teto R$6; se wa.me reprovado, URL final vira configurador com WhatsApp acima da dobra; (b) **deploy da landing pronta e parada** (ataca o QS 2); (c) lance R$9-10 SOMENTE nas keywords com CTR >10% e a conversão ("mesa de sinuca e jantar" e irmãs) — CPC histórico R$9,83 é o preço real de entrada desse leilão; (d) só realocar os R$40/d se a autópsia condenar as campanhas — não antes. Medir: IS 10%→30-40% nos termos core, conversas WhatsApp por search term, QS direcional em 14d.

**P0-3 — Os dois pipelines já pagos: necropsia dos 76 + disparo dos 24 arquitetos (esta semana, ~R$0).**
Consenso quíntuplo do painel nos 76 leads: 3 toques/7dias 1:1 (trabalho novo no toque 1, prova no 2, break-up no 3) + Custom Audience de remarketing R$20/d. Gate diagnóstico mantido: resposta >10% no toque 1 = o form está absolvido e volta como candidato a substituto do CTWA. **Adicionado (crédito Wiebe + Frente 3.3):** destravar os 24 emails de arquitetos tier S — único canal com prova documentada de mover R$30k+ no BR, custo 30 min do founder. Medir tudo num placar único: **orçamentos qualificados R$30k+/semana, meta 3-5** — o leading indicator que substitui o retrovisor de 45 dias.

**Uma regra transversal, inegociável:** saldo Meta contínuo garantido pelo founder ANTES do dia 1 da janela — sem isso, os três P0s viram o buraco de junho de novo, e em agosto o conclave se reúne para escrever o mesmo documento.

Kill the donkeys, scale the unicorns — mas primeiro deixem o unicórnio sair da jaula: ele está preso num teto de R$6 e num geo de país inteiro há uma semana.

— Kim.

================================================================
a3bb262ad899f4053
================================================================

# Rodada Adversarial — Bretda | Pedro Sobral

Li os quatro pareceres e a pesquisa. Boa notícia: ninguém discorda da causa #1 (o lag de junho) — o conclave convergiu no diagnóstico. Má notícia: nos P0s tem gente propondo coisa que **viola a própria tese que defendeu três parágrafos antes**. E o meu papel aqui é ser o cara da Operação Diária: quem já viu conta BR morrer exatamente desses "detalhes de execução". Vamos por partes. Mata loser, escala winner — inclusive entre argumentos.

---

## 1. ATAQUES

### Larry Kim — o unicórnio é real, mas o CTR de 13,4% é sobrevivente de leilão

**a) "CTR 13,4% prova que relevância nunca foi o problema" — cuidado, isso é viés de sobrevivência.** Com IS de 10%, você só aparece nos leilões que consegue vencer — os mais baratos e mais relevantes pro seu Ad Rank capado. CTR alto em 10% de share NÃO prevê CTR alto nos outros 90% de impressões que você vai comprar a R$9-10. Quando o IS subir pra 30-40%, o CTR VAI cair (e deve cair). Se o Kim usar o CTR de hoje como baseline do gate de 14 dias, ele vai "matar" uma campanha saudável no dia 10. O baseline correto pós-mudança é conversa-WhatsApp por termo, não CTR.

**b) "Aposto em reprovação dos RSAs wa.me" — aposta, não dado.** Ele afirma com convicção o que não puxou. O dado que EU puxei mostra dezenas de keywords com QS 0/sem histórico e CPC médio histórico de R$9,83 contra teto de R$6 — rank insuficiente produz exatamente o mesmo sintoma (zero silencioso) sem nenhuma reprovação. A pesquisa (Frente 4.1, doc oficial Google) coloca review como suspeito nº1 *e* bid/Ad Rank como causa plausível — a resposta honesta é "Ad Preview & Diagnosis em 30 minutos", não "aposto". Dito isso: o alerta dele sobre política de destino wa.me é legítimo e eu incorporo (ver Defesa).

**c) P0-3 dele: Custom Audience de 76 pessoas num adset de R$20/d — isso não entrega.** Audiência de 76 uploads casa MENOS que 76 (match rate 50-70% típico BR); Meta precisa de ~100 matched pra rodar decente. Resultado: adset em "audiência muito pequena" ou entrega errática. E pior: **criar adset novo no meio da janela limpa é EXATAMENTE o pecado que ele mesmo diagnosticou na causa #1 do Depesh** — mais um evento de otimização, mais fragmentação de learning. Regra minha de anos de conta BR: adset abaixo de R$30/d nem sai da cama. A necromancia dos 76 é trabalho de INBOX (1:1, manual, R$0), não de Ads Manager.

### Depesh Mandalia — o mais alinhado comigo, e ainda assim se contradiz no P0-3

**a) Mesmo erro do Kim, com a agravante de ser ele o autor da tese da janela.** Causa #2 dele: "indisciplina de janela, 3 pivôs em 6 semanas, nada muda até 21/Jul". P0-3 dele: "criar 1 adset de retargeting Engaged R$20/d de dentro dos R$100". Depesh: **tirar R$20/d do adset CTWA no meio da janela É mexer na janela.** Muda o budget efetivo do adset em -20%, muda a leitura dos 14 dias, e cria um segundo evento de learning com R$20/d — abaixo do piso de R$30/d que qualquer conta BR precisa pra aprender. Escolhe: ou janela travada, ou bucket Engaged agora. Eu escolho janela; o Engaged entra dia 21/Jul.

**b) "O form estava melhorando o custo por lead qualificado quando foi pausado" — o dado dele mesmo diz o contrário.** 5 leads @ R$43,97 nos últimos 7d vs CPL médio R$28,32 do período. Isso é 55% PIOR, não melhor. E "lead qualificado"? Não existe UMA linha de dado de qualificação nessa conta — é exatamente o buraco do sales feedback loop que todos apontamos. Ele projetou melhoria em cima de 5 leads e um adjetivo. Com n=5, isso é leitura de borra de café.

**c) CPM R$82 do adset premium: verdade parcial, amostra suja.** O adset foi pausado dia 04/Jul; o "últimos 7d" dele mistura dias ativos e mortos com R$219 de spend total. CPM de amostra desse tamanho balança 40% pra qualquer lado. A direção (geo premium = CPM 2-4×) está certa e eu assino; o número específico não sustenta decisão.

### Alex Hormozi — "qualidade se compra com OFERTA, não com targeting" é a frase mais perigosa do conclave

**a) A linha do tempo REFUTA a tese dele.** Hormozi diz que o pin de bairro nobre "matou o volume e ainda assim o lead de R$5k apareceu". Errado na cronologia: durante TODA a fase de geo premium + form (18/Jun→04/Jul), a queixa era volume e leads que esfriam — **nenhum registro de "quero mesa de R$5k"**. O comprador de R$5k apareceu em 72h de geo Brasil-inteiro. O geo FILTRAVA, e o dado prova. A pesquisa (Frente 2.1, doc oficial Meta) explica o mecanismo: otimização por CONVERSAS entrega onde a conversa é barata — a âncora de preço filtra quem CLICA, mas o leilão decide quem VÊ antes de qualquer palavra ser lida. Copy sem geo = você continua PAGANDO impressão no pool errado; o custo por conversa qualificada explode do mesmo jeito. Não é oferta OU targeting — em CTM no Brasil, é geo (decide quem vê) + âncora (decide quem aperta o botão). Executar só a metade do Hormozi = queimar 14 dias provando o óbvio.

**b) "37 cidades sem pins" como meio-termo — aceitável, mas ele apresenta como correção do meu plano sem dado de que os pins mataram a entrega.** O que matou a entrega em junho foi saldo intermitente + learning resetado (spend médio R$80/d contra R$130 planejado — dado vivo do Depesh). Os pins são suspeito conveniente. Concedo o meio-termo como configuração inicial válida (37 cidades, PRESENCE, sem micro-pins) porque destrava volume — mas que fique registrado: é hipótese, não veredito.

**c) "Projeto 3D gratuito" como appointment — boa ideia com bomba-relógio operacional.** Oferecer 3D pra TODA conversa = atelier virando fábrica de render pra curioso. O 3D é o prêmio de quem PASSA da âncora de R$30k, não a isca de entrada. Sequência: âncora → qualifica → 3D. Na ordem dele, o gargalo só muda do WhatsApp pro designer.

### April Dunford — contradição interna de 30 pontos percentuais

**a) Ela refuta o founder ("o CTWA tem 3 dias, não pode ter causado o mês") e depois dá ao MESMO CTWA peso ~30% na causa raiz DO MÊS.** Não fecha. R$265 e 72h não carregam 30% de um mês zerado — carregam ~100% da queixa da semana, que é outra coisa. Ela cometeu, com números, o erro que apontou no founder: deixar o incômodo recente inflar o peso da causa.

**b) "Restaurar o geo sem mexer no criativo te entrega o comprador de R$5k dos Jardins" — refutado pelo próprio histórico da conta.** Semanas de geo premium + criativo SEM âncora de preço (Aurora/Opal de sempre) produziram 76 leads premium a CPL no alvo e zero pedinte de R$5k. Se a tese dela fosse verdadeira, o form teria enchido de sonhador de bairro nobre — não encheu. Gente rica até compra mesa barata, mas o dado desta conta diz que o CEP segurou a régua sozinho por semanas. A âncora no criativo é upgrade que eu compro (ver Defesa) — mas como REFORÇO, não como substituto da tese do geo.

**c) O pedido de transcripts é a melhor contribuição individual do conclave** — registro isso sem ironia. Vai direto pro meu P0-2.

### Joanna Wiebe — copy afiada, mecânica de leilão errada

**a) "Um anúncio sem âncora atrai sonhador em Balneário Camboriú tanto quanto em Fortaleza" — não em campanha CONVERSATIONS.** O anúncio não é distribuído uniformemente pra depois o copy filtrar: o leilão entrega ONDE a conversa custa menos (pesquisa 2.1, mecânica documentada). Sem geo, Fortaleza vê 10× mais o anúncio que Balneário — o copy nem chega a disputar. Corrigir só o copy e manter Brasil-inteiro = pagar CPM pra educar quem nunca vai comprar. Mesma correção que fiz na Dunford: copy filtra o clique, geo filtra a exibição. Precisa dos dois.

**b) O pre-fill "sei que os projetos partem de R$30 mil" — ninguém digita isso, e pre-fill é editável.** Colocar declaração de consciência de preço na boca do lead é VOC fabricada — e o lead apaga o pre-fill em 1 segundo. A âncora tem que estar onde o lead NÃO edita: no body do anúncio e na primeira resposta do atendente. E um alerta que só quem já perdeu R$437 em conta BR dá: **mexeu em criativo/pre-fill de CTM = smoke test manual do sender ANTES de reativar** (padrão KR 12/Mai: wa.me apontando pro número errado, 99 conversas pro vazio em 12 dias). Nenhum dos quatro mencionou o smoke test. É gate obrigatório, não paranoia.

**c) "≥8 orçamentos formais de R$30k+ em 14 dias" com 3-4 conversas/dia = promessa de ~20% conversa→orçamento em público frio recém-ancorado.** Meu range (2-4) e o do Kim (2-4) saem da taxa histórica da conta. O dela sai do otimismo. Quando o dia 14 chegar com 4 orçamentos, o founder vai achar que falhou — e aí vem o quarto pivô de pânico. Meta inflada é gatilho de indisciplina; calibrem pra baixo.

**d) P0-C dos arquitetos: endosso com uma trava jurídica.** A pesquisa (3.3) valida o canal — e documenta que RT/comissão oculta é infração no CAU. Estruturar como programa de relacionamento/condição comercial transparente, nunca "RT por fora". Dito isso, é o único canal validado que vende R$30k+ no BR e depende de 30 minutos do founder. Deveria estar no P0 de todo mundo.

---

## 2. DEFESA E REVISÕES (onde me acertaram, admito)

**REVISO minha P0-1: a âncora de preço entra no CRIATIVO, não só na saudação.** Hormozi, Dunford e Wiebe têm razão neste ponto e minha versão original era incompleta — eu coloquei a âncora só na mensagem de boas-vindas, ou seja, DEPOIS do clique pago. Âncora no body do anúncio filtra ANTES do clique, custa R$0 e ainda vira teste A/B natural (ad com âncora vs sem, no mesmo adset — ideia do Depesh, boa). Também **reviso o número: R$25 mil → R$30 mil.** Minha âncora original convidava lead abaixo do ticket real. Errei por conservadorismo de copy; o painel me corrigiu.

**REVISO minha P0-3(a): não pauso as Alta Intenção às cegas — diagnostico em 30 minutos primeiro.** Kim e a pesquisa (4.1) me pegaram numa inferência apressada: o "0 impressões em 30 dias" que citei inclui o período PAUSADO das campanhas — elas foram reativadas dia 04/Jul com 16 RSAs novos, e review de RSA leva até 5 dias úteis. Meu "30 dias/0 impressões provam que não participam" misturou janelas. O rank sob teto R$6 continua sendo minha aposta principal (CPC histórico R$9,83 não mente), mas a sequência correta é: Ad Preview & Diagnosis → se review/política wa.me, trocar URL final pra LP do configurador com botão WhatsApp (o Kim está certo TAMBÉM porque wa.me como URL final mata o GCLID — e sem GCLID o sales feedback loop do Google morre no nascimento; isso é doutrina minha e eu deixei passar); se for rank, aí sim pausar e realocar.

**DEFENDO meu peso de ~15% no geo contra o ~30% da Dunford e o "oferta resolve" do Hormozi.** O dado da conta (semanas de geo premium sem UM lead de R$5k) sustenta que o geo era o filtro operante. E defendo contra o Depesh (5%): ele subestima o custo COMPOSTO de deixar o CTWA errado rodando — R$100/d comprando sinal de conversa-barata por 14 dias ensina o algoritmo a buscar exatamente o lead errado; o estrago não é os R$265 passados, é o aprendizado futuro.

**DEFENDO minha P0-2 (necromancia 100% manual) contra os adsets de retargeting do Kim e do Depesh.** Os dois querem resolver com mídia um problema de inbox — e ambos violam a janela limpa que defenderam. 76 leads se trabalham com 5 toques 1:1 e uma planilha. R$0, zero impacto no learning, e a venda mais provável do mês mora ali (76 × 1,5% ≈ 1,1 venda já paga).

**Sobre meu "blind spot" (sales feedback loop): o conclave inteiro convergiu nele — ótimo.** Cinco analistas, cinco versões da mesma frase: "ninguém mede o pós-clique". Quando todo o painel aponta o mesmo buraco, ele deixa de ser blind spot e vira o P0 MAIS validado da mesa. A planilha de 6 colunas (data, origem, lead, minutos-até-1º-contato, status, motivo-morte) + a métrica-farol do Hormozi (**orçamentos R$30k+ emitidos/semana**) + os transcripts da Dunford/Wiebe = um único instrumento. Sem ele, agosto tem outro conclave idêntico. CPL sem close rate é mentira — e essa conta segue inteira gerenciada por CPL.

---

## 3. POSIÇÃO FINAL

**Causa raiz nº1 (uma frase):** O mês sem venda de julho foi assinado no fim de maio, quando o pivô de qualidade estrangulou o funil de 196→86 leads/mês sem nunca fechar o Learning — e o ciclo de 30-60 dias do alto-ticket entregou a conta agora, exatamente como o alerta de 29/Jun previu; o lead de R$5k do Nordeste é a crise da SEMANA (geo Brasil-inteiro + zero âncora), não a do mês.

**P0-1 (revisada) — CTWA: geo + âncora no criativo, UMA mudança, janela travada.**
No adset `120249597117640737`: restaurar geo premium (versão de destravamento: 37 cidades + PRESENCE, sem micro-pins — meio-termo do Hormozi aceito) mantendo LAL 1% e R$100/d. Âncora **no body dos ads** Aurora/Opal ("projetos sob medida a partir de R$30 mil, madeira maciça, atelier em SC") E na saudação do WhatsApp. **Smoke test manual do sender antes de reativar** (gate F5 — inegociável). Depois disso, calendário na parede: **nada muda até 21/Jul** — nenhum adset novo, nenhum retargeting, nenhum budget shift. Esperado 14d: 4-6 conversas/d, CPMsg R$18-30 (e é PRA subir), ≥40% qualificadas na âncora, 2-4 orçamentos. Gate: CPMsg-qualificado >R$150 → revisa criativo, não o geo.

**P0-2 (mantida, turbinada) — Necromancia dos 76 leads FORA do Ads Manager + o placar único.**
Cadência 5 toques/10 dias, 1:1, priorizando maior orçamento declarado no form (D0 foto de mesa real entregue; D+2 pergunta binária; D+5 áudio 30s do atelier; D+7 ligação; D+10 break-up). Zero mídia, zero adset — inbox puro. Junto, nasce a planilha sales feedback (6 colunas + minutos-até-1º-contato) com a métrica-farol: **orçamentos R$30k+/semana, meta 3-5**. E o founder puxa os transcripts das 10 conversas de 5+ mensagens (Dunford/Wiebe estão certas: o pitch do WhatsApp é o headline mais importante da conta e ninguém o escreveu). Esperado: 11-19 respostas, 1-2 orçamentos, a venda mais provável de agosto.

**P0-3 (revisada) — Google: diagnóstico de 30 min ANTES da faca + lance cirúrgico + deploy.**
(a) Ad Preview & Diagnosis nas 2 Alta Intenção: se os 16 RSAs wa.me estão em review/reprovados → trocar URL final pra LP do configurador com botão WhatsApp (restaura GCLID = restaura rastreio; wa.me como destino final morre aqui pra sempre); se for rank (CPC R$9,83 vs teto R$6) → pausar e realocar os R$40/d pra Aquisição. (b) Subir CPC pra R$9-10 **só no ad group "Bilhar + Jantar"** — o único com conversão; e baseline do gate = conversas-WhatsApp por termo, NÃO o CTR de 13-14% (que vai cair quando o IS subir, e deve). (c) **Deployar o fix do configurador que está pronto e parado** — ataca o QS 2 na raiz, custa uma decisão. Esperado 14d: IS 10%→25-35% no ad group campeão, 4-8 cliques-WhatsApp/sem de intenção declarada.

**Pré-condição que engole as três: saldo Meta contínuo garantido pelo founder.** Spend médio de R$80/d contra R$130 planejado (dado vivo do Depesh — obrigado) diz que a conta segue sub-alimentada. Buraco de saldo no dia 6 da janela invalida tudo e nos devolve pro junho. E registro o endosso: **o outreach dos 24 arquitetos (P0-C da Wiebe) destrava com 30 minutos do founder e é o único canal validado pela pesquisa que vende R$30k+ no Brasil** — estruturado como programa transparente, nunca RT por fora.

*Atrair, Bater, Captar. A mídia atrai; quem bate e capta é a conversa — e a partir de hoje, ela tem placar.*

— **Pedro Sobral**

================================================================
af4ab9c0c85fcba1e
================================================================

# RODADA ADVERSARIAL — Bretda | Depesh Mandalia

*Reli o dossiê, as quatro análises e a pesquisa de fontes primárias. Boa notícia: o painel inteiro convergiu na causa #1 (lag do colapso de junho) — ninguém comprou a narrativa do founder. A briga real está nos pesos, nas promessas numéricas e, sobretudo, na EXECUÇÃO. E é aí que metade do painel está prescrevendo exatamente a doença que diagnosticou. NNC math is the truth — vamos ao ataque.*

---

## 1. ATAQUE

### Pedro Sobral — prega janela limpa e prescreve 6 mudanças simultâneas

Sobral, você escreveu "Mexeu de novo antes do dia 14, o diagnóstico morre" — e no parágrafo seguinte prescreveu: geo fix no Meta + welcome message nova + pausar 2 campanhas Google + subir CPC no ad group campeão + deploy de landing page + cadência de 5 toques. **São seis variáveis mudando na mesma janela de 14 dias.** Quando o placar mudar (pra melhor ou pior), qual delas você vai creditar? Isso é o pecado que você mesmo chamou de "Learning perpétuo desde maio" — só que agora com a sua assinatura. No Google especificamente: **subir CPC para R$9-10 E deployar o fix de QS na mesma semana = duas variáveis no mesmo leilão.** Se o IS subir, foi o lance ou a landing? Você acabou de queimar o teste. Sequência correta: deploy da LP primeiro (custo zero, decisão parada), lê 7 dias, DEPOIS lance.

Segundo: "R$265 em 3 dias (~88%/d) cheiram a limitação de saldo". Não-suportado. Campanha nova em ramp de learning entrega 85-90% do budget nos primeiros dias rotineiramente — é comportamento normal de pacing, não fumaça de saldo. O histórico de saldo da conta é real (por isso concordo com a pré-condição), mas você está lendo padrão onde tem ruído. Dado vivo não confirma spend cap ativo nesses 3 dias.

Terceiro: pausar as Alta Intenção "como estão" ANTES da autópsia. Kim tem razão contra você aqui: se o zero-impressão for review/política dos 16 RSAs wa.me (têm 3 dias de vida!), você está matando campanhas por um atraso de aprovação. Diagnóstico de 30 minutos no Ad Preview custa menos que reconstruir histórico de campanha depois.

### Larry Kim — o unicórnio está certo, a matemática da promessa não fecha

Kim, seu P0-2 promete **250-300 clicks/14d** nos termos core com lance de R$9-10. Faz a conta comigo: 275 clicks × R$9,50 = **R$2.612 em 14 dias = R$187/dia** — num orçamento Google total de R$140/d, do qual a Aquisição tem R$100/d e você quer concentrar num ad group. Sua promessa custa mais que o budget inteiro da conta. Isso não é otimismo, é erro aritmético — e promessa numérica que não fecha é exatamente como se perde a confiança de um founder que já está em pânico.

Segundo: "aposto em reprovação por política de destino wa.me" — você APOSTOU e depois realocou budget em cima da aposta. Puxa o status de aprovação ANTES de mover um real. A ordem do checklist oficial (pesquisa, achado 4.1) existe por um motivo.

Terceiro: seu P0-3 cria um adset novo de remarketing (76 + engajadores IG 90d) — eu propus o mesmo, então o ataque é em nós dois: audiência de 76 pessoas + engajadores num adset novo é **mais um evento de learning numa conta que não fecha nenhum**. R$20/d sobre seed minúscula vai viver em Learning Limited para sempre. Revisão conjunta: o retargeting pago dos 76 é dispensável nos primeiros 14 dias — o toque 1:1 manual carrega 90% do valor esperado. Corto do meu plano também (ver seção 2).

### Alex Hormozi — "qualidade se compra com oferta, não com targeting" está ERRADO no nível do delivery

Hormozi, sua frase mais citável é sua frase mais errada: *"Vocês pagaram CPM dobrado para fazer o trabalho que uma linha de copy faz por R$0."* Não faz. **O leilão da Meta não lê o seu copy.** Objetivo CONVERSATIONS otimiza para quem tem maior probabilidade de INICIAR conversa ao menor custo — a âncora de R$30k no criativo filtra quem CLICA, mas não muda para QUEM a Meta entrega a impressão. Com `countries: [BR]` e otimização por conversa, o sistema continua despejando impressão onde a conversa é barata (pesquisa, achado 2.1, doc oficial Meta: delivery vai onde há match barato, não uniforme). Você troca "curioso de R$5k que conversa" por "curioso de R$5k que vê o preço e não clica" — o CPM continua comprado no lugar errado, o CTR desaba, o custo por conversa qualificada explode. **Âncora É necessária (está no meu P0-2 desde a primeira rodada) — mas como complemento do geo, não substituto.** Geo filtra a impressão; copy filtra o clique; welcome message filtra a conversa. Três portarias, três camadas. Tirar qualquer uma delas é pagar as outras duas mais caro.

E cuidado com o corolário histórico que você desenhou: "o pivô de maio provou que targeting não compra qualidade". Não provou — o pivô de maio morreu de **volume estrangulado + Learning nunca fechado** (CPM R$82 no dado vivo de 7d do adset premium é sintoma de sinal fraco, não de tese errada). O adset premium com form estava a R$43,97/lead E melhorando quando foi pausado no dia 5 da janela. A tese do geo nunca teve 14 dias limpos para ser julgada. Você está enterrando um teste que nunca terminou.

Onde você me move: os pins micro. Concedo abaixo.

### April Dunford — seu peso #2 contradiz sua própria refutação

April, você refuta o founder com precisão cirúrgica ("o CTWA tem 3 dias, não pode ter causado o mês") e três parágrafos antes atribui ao pivô de 04/Jul **30% do peso causal do mês sem venda**. Não dá para ter os dois. R$265 e 3 dias não carregam 30% de um zero de 30 dias — carregam ~5% (meu número) e 100% da queixa da semana. "E crescendo" é verdade prospectiva, mas peso causal é retrospectivo. Sua estrutura de causa está certa; sua aritmética de peso está torta, e peso torto vira prioridade torta na mesa do founder.

Segundo: "40-60% dos deals de ticket alto morrem em no decision" — benchmark solto, sem fonte no dossiê nem na pesquisa. Pode ser verdade (é da literatura de sales B2B — JOLT/Dixon), mas num conclave onde cobramos dado vivo do founder, não podemos citar número de memória sem rótulo.

Terceiro: "zero mesa de 5k" em 14 dias como resultado esperado do P0-1. Overpromise. Com LAL semeada também por engajadores de IG, algum vazamento persiste mesmo com geo+âncora. Prometa redução de 80-90% e entregue; prometa zero e o founder conta o primeiro curioso como falha do plano.

### Joanna Wiebe — "teste, não assuma" com n=38 não é teste, é teatro

Jo, seu P0-B manda dividir os 76 leads em **38/38 por variação de mensagem**. Com taxa de resposta esperada de 13-20%, cada braço devolve 5-7 respostas. A diferença entre 5 e 7 respostas não distingue nada de nada — é ruído puro, poder estatístico zero. Você — logo você — está prescrevendo um split test ilegível e chamando de rigor. O certo com n=76: UMA mensagem melhor (a sua toque-1 é boa), executada 100%, e a variação fica para quando houver lista de 500+. Mesmo pecado no 12/12 dos arquitetos. Testar É a religião certa; fingir que 38 pessoas são uma amostra é heresia da mesma religião.

Segundo: "**≥8 orçamentos formais de R$30k+** enviados em 14 dias" só do CTWA corrigido. Base rate: a conta inteira produziu ~1-3 vendas/mês no MELHOR momento, e não existe série histórica de orçamentos/semana (é justamente a métrica que ninguém mede — seu próprio blind spot!). Prometer 8 de um canal com 3 dias de vida é tirar número do bolso. 2-4 orçamentos é defensável; 8 é setup para o founder declarar fracasso no dia 15.

Terceiro (menor): seu P0-C dos arquitetos está certo em tese, mas "esta semana, custo R$0" ignora que está travado há 8 dias em 3 inputs do founder. Ação bloqueada por terceiro não é P0 — é P0 CONDICIONAL, e o plano precisa dizer isso, senão vira mais uma linha morta no checklist.

### Ataque coletivo — o painel está prescrevendo a doença que diagnosticou

Somando os cinco planos: 3 cadências diferentes para os 76 leads (3 toques/7d, 3/10d, 5/10d), 3 versões de copy de âncora, welcome message, geo fix, ice breakers, CPC up, LP deploy, autópsia Google, adset de retargeting novo, outreach de arquitetos, planilha de 6 colunas. **Quem executa é um founder sozinho, que não mantém saldo na conta e não respondeu 3 inputs em 8 dias.** A causa #2 unânime deste conclave foi "3 pivôs em 6 semanas / ninguém deixa a máquina rodar" — e a resposta do painel é uma lista de 12 intervenções. Se entregarmos isso sem hierarquia brutal, o founder vai executar 30% de cada coisa, e em agosto tem outro conclave. Budget chicken tem um primo: **checklist chicken** — morrer de excesso de recomendação.

---

## 2. DEFESA E REVISÃO

**Onde eu ERREI e reviso:**

1. **Qualificação nativa do CTWA — a pesquisa me pegou (achado 1.1).** Eu propus âncora no criativo e parei aí. Existe camada nativa que eu não usei: `page_welcome_message` estruturada + ice breakers (até 4 perguntas prontas). Incorporo ao P0-1/P0-2: welcome message com âncora + pergunta de qualificação no toque zero. **NÃO migro o objetivo para Leads-CTWA agora** — trocar objetivo = campanha/learning novos = quebrar a janela de novo. Fica agendado como decisão do dia 14, com os dados de tagueamento na mão.

2. **Pins micro — Hormozi tem meio ponto.** O histórico da conta registra pins conflitando com cidades (erro 100/1487756) e entrega estrangulada. Reviso meu P0-1: restaurar **28-37 cidades + 10 bairros nobres com PRESENCE**, SEM os pins micro-enclave na primeira onda. Pins são refinamento do dia 14 se o mix ainda vazar. Cidades+bairros capturam ~85% do filtro socioeconômico com um décimo do risco de entrega.

3. **Retargeting pago dos 76 — corto.** Meu próprio argumento contra mim: adset novo de audiência minúscula = mais um Learning Limited numa conta que não fecha nenhum. O 1:1 manual carrega o valor; o adset Engaged entra só quando houver massa (engajadores 90d + conversas CTWA acumuladas), depois da janela.

4. **Sazonalidade — lacuna admitida.** Não pesei o vale jun/jul do varejo de móveis BR (achado 3.2). Não muda nenhuma ação, mas muda a LEITURA da janela: parte da fraqueza de 14 dias em julho é maré, não motor. Vai no caderno de calibração para não punir o plano por sazonalidade.

5. **Arquitetos — blind spot meu.** Wiebe e a pesquisa (achado 3.3: canal especificador é O canal documentado de R$30k+ no BR) estão certas em elevar isso. Não é Meta, não é minha praia, não entra nas MINHAS 3 P0 — mas assino embaixo como P0-4 do plano consolidado, condicionada aos 3 inputs do founder, com prazo: se os inputs não vierem até D+3, escala como bloqueio explícito.

**Onde DEFENDO sem ceder:**

1. **Geo é insubstituível (contra Hormozi).** Doc oficial + mecânica de leilão (achado 2.1): a entrega vai onde é barato, e copy não altera entrega — só clique. Âncora sozinha sobre Brasil-inteiro = mesmo CPM mal comprado com CTR pior. As três portarias (geo → copy → welcome message) ficam, nessa ordem.

2. **Meu peso de ~5% para o CTWA no mês (contra Dunford).** R$265/3 dias não explicam 30 dias de zero. A cronologia é o dado mais duro do dossiê e ninguém a refutou — o próprio painel a confirmou por unanimidade.

3. **Meus números de expectativa ficam onde estão.** Conversas 4-6/d, custo/conversa R$18-28, ≥40% qualificadas, resposta 15-25% nos 76. Kim promete 250-300 clicks que o budget não paga, Wiebe promete 8 orçamentos sem base rate, Dunford promete zero curioso. Eu prefiro bater meta a impressionar no papel — expectativa inflada é a semente do próximo pivô de pânico.

4. **Disciplina de janela como intervenção #1 (contra o painel inteiro, na prática).** Todos concordaram em tese e empilharam mudanças na prática. Mantenho: **uma onda de mudanças em 24h, depois 14 dias de mão amarrada.** Tudo que não couber na onda vai para o backlog do dia 14 — inclusive as boas ideias. Principalmente as boas ideias.

---

## 3. POSIÇÃO FINAL

**Causa raiz #1 (uma frase):** O mês sem venda foi assinado em junho — o colapso de volume 196→86 leads (pivô de fim de maio + Learning nunca fechado + saldo intermitente) batendo agora com o lag natural do ciclo alto-ticket, exatamente como previsto em 29/Jun; o CTWA Brasil-inteiro é o defeito da semana, não a doença do mês.

**Minhas 3 ações P0 finais (revisadas):**

**P0-1 — Geo premium de volta no CTWA + qualificação nativa, numa ÚNICA onda de edição (24h), e janela travada até 21/Jul.**
No adset `120249597117640737`: restaurar 28-37 cidades + 10 bairros nobres com PRESENCE (**sem pins micro** — revisado), manter LAL 1%, manter R$100/d intocado. Na mesma onda: `page_welcome_message` estruturada com âncora ("Projetos sob medida a partir de R$30 mil — o seu é para casa, área gourmet ou projeto de arquitetura?") + ice breakers (**adotado da pesquisa**). Depois disso, NADA muda até 21/Jul — nem budget, nem objetivo, nem criativo extra. Migração para objetivo Leads-CTWA = decisão do dia 14, com dados. Esperado em 14d: conversas 4-6/d, custo/conversa R$18-28, **≥40% qualificadas** (tagueadas pelo founder: lixo/curioso/≥R$20k), mix R$5k caindo 80-90%. Medição: tagueamento manual + `messaging_user_depth_5` por breakdown de ad.

**P0-2 — Âncora de preço em 2 variantes novas de criativo (mesma onda de 24h).**
Aurora/Opal com "Sob medida a partir de R$30.000" no primary text + overlay, Pilar 1 (produto/desfecho) e Pilar 2 (atelier/origem). Max 5 ads/adset. O ad sem âncora vs com âncora = A/B natural dentro do adset — esse teste TEM poder estatístico porque roda em impressões, não em 38 pessoas. Esperado: CTR cai para 1,8-2,5% (bom — curioso saindo antes do clique), custo/conversa qualificada ≤R$60 (nCAC máximo teórico ~R$3.000 num ticket de R$30k a 30% de margem — estamos pagando 2% disso; o problema nunca foi preço da conversa, é o que se faz com ela).

**P0-3 — Ressuscitar os 76 leads: UMA cadência, executada 100%, com instrumentação.**
3 toques/10 dias, 1:1, mensagem única (sem split de n=38 — **revisado contra Wiebe**): D0 foto de mesa real em produção + "posso te mandar o catálogo com valores?"; D+3 vídeo de 20s do acabamento; D+7 pergunta de timing + break-up honesto. **Sem adset de retargeting pago nesta janela** (revisado — corta um evento de learning inútil). Planilha obrigatória de 6 colunas: lead / data-hora do toque / canal / resposta S-N / estágio / motivo-morte — e para TODA conversa nova do CTWA: **minutos até a 1ª resposta do atelier**. Esperado: 15-25% resposta (11-19), 3-6 conversas reais, ~60% de chance de 1 venda em 30-45d. Gate honesto: <8% de resposta após 3 toques bem executados = eu aceito publicamente que lead de form não sustenta esse ticket.

**Assino como P0-4 do plano consolidado (dono: não-Meta):** destravar os 3 inputs dos arquitetos (prazo D+3 ou vira bloqueio escalado) + deploy da LP do configurador ANTES de qualquer mexida de lance no Google — uma variável por vez, Sobral. E a pré-condição de tudo, acima de qualquer P0: **saldo contínuo verificado via `display_string`, runway ≥14 dias.** Sem isso, este conclave inteiro é literatura.

**O placar da janela:** não é venda (lag de 30-45d), não é CPL, não é conversa bruta. É **conversas qualificadas/semana + orçamentos enviados/semana + minutos-até-primeira-resposta**. Três números, uma planilha, dez minutos por dia. Se em 21/Jul esses três números existirem e estiverem melhorando, a conta está viva — mesmo que a venda ainda não tenha caído. Se não existirem, o problema nunca foi a mídia.

*A conta não vai morrer de falta de ideia — este painel produziu doze. Ela morre se mexerem nela de novo no dia 5. Cost cap dancing vem depois; primeiro, 14 dias de mão amarrada e um placar que finalmente existe.*

**— Depesh Mandalia** · SM Commerce · BPM Method · NNC math is the truth

================================================================
a525233edd3847127
================================================================

# Rodada Adversarial — Bretda | Alex Hormozi (mind clone) · 07/Jul/2026

Boa notícia: o painel convergiu no que importa (o zero de julho nasceu em junho). Má notícia: convergência não paga boleto, e tem erro factual, número inventado e recomendação perigosa em cima da mesa. Vamos limpar.

---

## 1. ATAQUES

### Pedro Sobral

**Seu diagnóstico das Alta Intenção é uma aposta vestida de certeza.** Você cravou: "não é review, não é bug — é teto R$6 contra leilão de R$9,83, teatro". Só que as campanhas foram REATIVADAS em 04/Jul com 16 RSAs novos apontando para `wa.me` — os "0 impressões em 30 dias" incluem ~27 dias em que elas estavam PAUSADAS. Três dias de RSA novo é a janela clássica de review (a pesquisa, Frente 4.1, coloca review como suspeito nº1; e a Wiebe confirmou ao vivo: RSAs novos ENABLED com 0 impressões, RSAs bons antigos PAUSED). E `wa.me` como URL final é campo minado de política de destino — o Kim está mais perto da verdade que você aqui. Seu CPC R$9,83 histórico é o segundo blocker provável, não o primeiro. A diferença importa: seu remédio é "pausar e realocar"; se for review/política, o remédio é trocar a URL final — e pausar mata a campanha que ia destravar sozinha. **Diagnóstico de 30 min no Ad Preview ANTES de qualquer pausa.** Você mesmo prega "deixa o placar existir" — então não decrete óbito sem autópsia.

**Seu gate de R$150 por conversa qualificada contradiz seu próprio CPL alvo de R$27.** Se o lead qualificado vale R$27 no seu cálculo de margem, por que a conversa qualificada pode custar 5,5×? Um dos dois números está errado (spoiler: o R$27 — ver minha revisão abaixo).

### Larry Kim

**Seu P0-3 quebra a disciplina que você mesmo assinou.** Adset de remarketing novo a R$20/d sobre uma Custom Audience de **76 pessoas** tem dois problemas: (1) Meta exige mínimo de match para entregar em audiência custom — 76 nomes com match parcial provavelmente nem roda, e se rodar, a frequência explode em 48h; (2) é MAIS um evento de otimização numa conta que não fecha Learning desde maio. O Depesh te refutou antes de você escrever: dois eventos com <50 conv/sem cada = dois Learnings eternos. Você está prescrevendo o pivô nº4 em 6 semanas enquanto diagnostica que pivôs mataram a conta.

**E o "form volta ao ar ao lado do CTWA se o toque 1 der >10%"** — mesma doença. Taxa de resposta de reativação prova que os LEADS eram bons; não prova que a conta suporta dois funis simultâneos em Learning. São inferências diferentes.

**Seu bid de R$9-10 sem sequenciamento é pagar 50% a mais pela mesma multa.** Ad Rank = lance × QS. Com QS 2, subir o lance antes do deploy da landing (que está PRONTA, custo zero) é queimar dinheiro para comprar a mesma penalidade. Ordem: deploy → 5-7 dias de re-crawl → lance cirúrgico. Você até menciona o deploy, mas coloca lance e deploy no mesmo dia. Sequência não é detalhe em leilão — é a diferença entre R$6 efetivo e R$10 efetivo pelo mesmo clique.

### Depesh Mandalia

**Você contradisse seu próprio dado.** "O form adset gastou R$219 em 7d gerando 5 leads @ R$43,97 — *estava melhorando* o custo por lead qualificado quando foi pausado." Melhorando em relação a QUÊ? O CPL histórico do form era R$28,32. R$43,97 é **55% PIOR**. O dado que você puxou ao vivo enfraquece sua narrativa de "pausaram o form na hora errada" — o form estava encarecendo quando foi pausado. Isso não salva a decisão de pausar (que foi pânico mesmo), mas o seu número não diz o que você disse que ele diz.

**E seu P0-3 comete o crime que seu TL;DR proíbe.** "Nada muda até 21/Jul" + "criar 1 adset de retargeting Engaged R$20/d" na mesma análise. Adset novo É mudança, fragmenta os R$100/d em dois sinais fracos, e a audiência de 76 tem o mesmo problema de mínimo de match do Kim. Escolhe: ou disciplina de janela, ou bucket-completo. Os dois ao mesmo tempo, agora, não.

### April Dunford

**Seus pesos não fecham com a sua própria cronologia.** Você refuta o founder dizendo "o CTWA tem 3 dias, não pode ter causado o mês sem venda" — correto — e três parágrafos antes atribui ao pivô de 04/Jul **peso ~30% na causa raiz do mês sem venda**. Não dá. Ou ele causou o mês (não causou) ou ele pesa ~0% no zero de julho e 100% na crise de AGOSTO. Rigor nos pesos importa porque o founder vai alocar atenção proporcional a eles.

**E "o CEP só ajuda, a categoria é que filtra" está meio certo — e o meio errado é caro.** A pesquisa (Frente 2.1, doc oficial Meta) mostra a mecânica que seu argumento ignora: o objetivo CONVERSATIONS otimiza para quem **inicia** conversa barata, e o leilão empurra entrega para onde isso custa menos. A âncora de preço filtra quem *responde depois de ler*; ela não muda para quem a Meta *entrega*. Sem geo, o algoritmo continua caçando iniciador barato de conversa Brasil afora — você só recebe menos mensagens do lugar errado, pagando o mesmo. Copy e geo não são substitutos; são filtros em camadas diferentes do funil. (Eu errei na direção oposta — admito abaixo.)

### Joanna Wiebe

**"≥8 orçamentos formais de R$30k+ em 14 dias" é número de pitch, não de planilha.** Com ~3-4 conversas/dia qualificadas (~50 no período) isso exige 16% de conversa→orçamento numa operação que hoje não mede NADA pós-clique e não tem script. O resto do painel estimou 2-4. Prometer 8+ para o founder é armar a próxima decepção — e decepção nessa conta vira pivô de pânico, que é a doença nº2.

**Seu Toque 1 é uma mentira operacional.** "Montei duas opções de projeto no seu estilo" × 76 leads = 152 projetos que ninguém montou. Ou o atelier faz o trabalho real (dias de projeto) ou a mensagem é fake — e fake em venda de R$30k mata a confiança que é o único ativo da conversa. Versão honesta: fazer o trabalho REAL para os top 15-20 por orçamento declarado no form, e mensagem mais simples para o resto. Escassez e personalização só funcionam quando são verdade — regra que você mesma prega.

**E seu teste 38/38 não é teste.** Com 10-15% de resposta esperada, cada braço dá 4-6 respostas. Você não distingue 10% de 20% com n=38 — é ruído com cara de ciência. Escreva as 2 versões, use as duas, mas não chame de A/B nem tome decisão com esse dado.

### Ataque ao PAINEL inteiro (o mais importante)

Somem as recomendações: 5 experts × 3 P0s = **~15 mudanças simultâneas** propostas para uma conta cujo diagnóstico unânime é "morreu de mexer demais". Se o founder executar tudo, este conclave terá causado o maior pivô da história da conta na mesma semana em que prescreveu janela limpa. A síntese precisa ser: **UM lote de mudanças, UM dia, depois 14 dias de mão amarrada.** Qualquer expert cuja ação não couber no lote de dia 1 perde a vez até 21/Jul.

---

## 2. DEFESA E REVISÃO

**Onde eu errei — revisão 1 (a maior):** Eu escrevi "vocês pagaram CPM dobrado para fazer o trabalho que uma linha de copy faz por R$0". **Overstatement, e a pesquisa me corrigiu.** A Frente 2.1 mostra que a entrega segue o leilão, não a copy: com objetivo CONVERSATIONS e geo aberto, a Meta continua comprando iniciador de conversa barato mesmo com âncora de preço no criativo. Copy filtra a PESSOA; geo direciona o LEILÃO. Precisa dos dois. Meu P0-1 já incluía restaurar o geo intermediário (então a ação estava certa), mas a retórica da minha refutação subestimou o mecanismo — e retórica errada vira decisão errada dois meses depois. Corrigido: o erro de maio não foi "usar geo", foi usar **pins micro** que estrangularam entrega; o erro de julho foi jogar o geo fora inteiro. O acerto está no meio, com âncora de preço junto.

**Revisão 2:** Meu gate de "≤R$35/conversa qualificada" estava apertado demais — inconsistente com a minha própria matemática de oferta. Ticket R$30k, margem ~30% = R$9.000; a 1,5% lead→venda, uma conversa qualificada vale centenas de reais. O Depesh está certo: **≤R$150/conversa qualificada é folgado e ainda imprime dinheiro.** Gate revisado. (Sobral: seu R$27 de CPL alvo sofre do mesmo aperto — divide a margem por um "fator segurança 5" arbitrário que transforma um negócio de 4× de retorno num teto que sufoca volume. Foi esse tipo de conta que gerou o pivô de maio.)

**Revisão 3:** Sazonalidade (Frente 3.2) — jun/jul é vale do varejo de móveis BR. Eu não tinha isso. Não muda a causa #1 (o colapso de leads é −56%, a sazonalidade não explica isso), mas muda a LEITURA dos próximos 60 dias: parte da recuperação de ago-dez vem de graça com o 2º semestre, e o founder não deve creditar tudo ao fix — nem desesperar se julho continuar fraco.

**Revisão 4:** Meu "blind spot que o painel vai deixar passar"... o painel não deixou passar. Os cinco apontaram o pós-clique. Erro de previsão, admitido — e é a melhor notícia do conclave: quando 5 lentes diferentes acham o mesmo buraco, o buraco é real. Mas noto o que AINDA falta: todo mundo disse "qualifique e meça a conversa"; **só eu nomeei a OFERTA da próxima etapa** — o projeto 3D gratuito como appointment com nome e data. Qualificar sem ter para onde convidar é interrogatório. Mantenho e dobro a aposta.

**Onde eu defendo sem ceder:** (a) Cronologia e lag — ninguém refutou, todos confirmaram; causa #1 de pé. (b) "Qualidade se compra com oferta" continua sendo a frase mais importante do diagnóstico — a Dunford chegou ao mesmo lugar pela lente de posicionamento, e a correção da pesquisa refina o COMO, não o QUÊ. (c) Meu peso de ~25% no follow-up dos 76 leads foi o mais alto do painel e a Frente 5 (MIT: 21× qualificação em 5 min vs 30 min; HBR: 23% nunca respondem) me deu razão: o pipeline mais barato do negócio está no CRM, não no Ads Manager.

**Concessão com upgrade:** Wiebe e Dunford estão certas sobre os 24 arquitetos, e eu deixei isso fora dos meus P0s — erro meu de escopo. A pesquisa (Frente 3.3) cravou: **canal especificador é o único canal documentado que move R$30k+ de forma consistente no Brasil** (RT de 5-12%, programas de relacionamento tipo Ornare/Artefacto). É a jogada mais Hormozi da mesa — leverage, warm, custo zero, comprador que já vive no mundo do ticket — e estava PRONTA esperando 30 minutos do founder. Entra no meu P0 final.

---

## 3. POSIÇÃO FINAL

**Causa raiz nº1 (uma frase):** O zero de julho é o lag matemático do estrangulamento de volume de junho (196→86 leads, taxa lead→venda estável em ~1,5%) — previsto por escrito em 29/Jun — agravado por 3 pivôs em 6 semanas que nunca deixaram uma janela fechar; os "leads horríveis do Nordeste" são a crise de agosto sendo fabricada agora, não a causa do mês.

**P0-1 — Lote único no CTWA HOJE, depois cadeado até 21/Jul (R$0 incremental).**
Num só dia: (a) geo intermediário de volta (28-37 cidades + bairros nobres, SEM pins micro); (b) âncora de preço nos criativos Aurora/Opal — "peças de atelier sob medida, projetos a partir de R$28 mil"; (c) welcome message com qualificação estruturada, 1 pergunta por mensagem (cidade → casa própria ou projeto de arquiteto → prazo), usando o mecanismo nativo da Meta (Frente 1.1). NÃO trocar objetivo agora, NÃO criar adset de retargeting, NÃO voltar o form — um funil, um sinal. Gate revisado: **custo por conversa QUALIFICADA ≤R$150**; esperado 4-6 conversas/dia com ≥40% qualificadas. Depois disso, **ninguém toca em nada por 14 dias** — mexeu, o diagnóstico morre.

**P0-2 — Pipeline já pago: 76 leads + placar de orçamentos (R$0 de mídia).**
Três toques em 7-10 dias. Trabalho REAL, não teatro: projeto 3D gratuito de verdade para os top 15-20 por orçamento declarado no form (o appointment nomeado — "seu projeto fica pronto quinta, te mando às 18h"); mensagem curta de reabertura para o resto; escassez só a verdadeira (agenda de produção de agosto). Esperado: 8-15 respostas, 2-4 orçamentos, e a venda mais provável dos próximos 45 dias. E a métrica-mestra do negócio nasce aqui: **orçamentos enviados por semana** (meta honesta: 2-4/sem), numa planilha de 6 colunas preenchida diariamente. É o único leading indicator que não mente com lag de 45 dias.

**P0-3 — Canal que já mora nos R$30k: arquitetos + destravar o Google sem chute (R$0 novo).**
(a) Founder gasta os 30 minutos: nome/cargo, link do catálogo, nº de residências → disparam os 24 e-mails 1:1 que estão prontos há uma semana — único canal validado pela pesquisa para ticket R$30k+ no BR, e uma especificação paga o trimestre. (b) Google, na ordem certa: **deploy do fix de CRO que está pronto** (ataca o QS 2 de graça) → diagnóstico de 30 min das Alta Intenção no Ad Preview ANTES de pausar ou realocar (suspeito nº1: review/política dos RSAs wa.me — se for isso, trocar URL final para a landing com botão WhatsApp resolve política E QS) → só DEPOIS do re-crawl, lance R$9-10 exclusivamente no ad group "Bilhar + Jantar". Nessa ordem. Fora dela, é dinheiro queimado comprando a mesma multa.

Regra de fechamento para o founder: este conclave só tem valor se virar **um dia de execução e treze dias de paciência**. A conta não morreu de falta de ideia — morreu de excesso de mão. Tira a mão, deixa o placar existir, e a matemática que te derrubou em julho te levanta em setembro.

— Hormozi. O trabalho está mapeado; agora é fazer. 💰

================================================================
a0025b6e100c6d2e5
================================================================

# Rodada Adversarial — April Dunford | Conclave Bretda 07/Jul

Li os quatro. Boa notícia: ninguém discorda da causa #1 — o zero de julho foi assinado em junho. Má notícia: o consenso parou aí, e tem gente prescrevendo remédio que recria a doença. Vamos por partes.

---

## 1. ATAQUE

### Pedro Sobral

**Sua âncora de R$25 mil é um erro de posicionamento que custa R$5 mil por mesa.** Você escreveu a saudação com "projetos a partir de R$25 mil" num negócio cujo piso real é R$30k+. Âncora abaixo do piso não é filtro — é convite para negociar a partir da referência errada. O primeiro número que o cliente ouve vira o teto mental dele. Hormozi cometeu o mesmo deslize com R$28k. O número é R$30 mil. Preço é declaração de categoria; arredondar para baixo diz "somos quase-luxo", e quase-luxo compete com todo mundo.

**Você decretou a morte das Alta Intenção sem autópsia.** "Não é review, não é bug — é orçamento fictício" é uma conclusão que os seus próprios dados não sustentam: os 16 RSAs foram criados em **04/Jul** — três dias atrás — e a pesquisa primária (doc oficial do Google, Frente 4.1) coloca **review de RSA novo (24-48h, até 5 dias úteis) como suspeito nº1**, antes de Ad Rank. O "0 impressões em 30 dias" que você cita inclui o período em que as campanhas estavam PAUSADAS. Seu diagnóstico de CPC R$9,83 vs teto R$6 é valioso e provavelmente é PARTE da resposta — mas pausar antes dos 30 minutos de Ad Preview & Diagnosis é exatamente o tipo de mexida-sem-dado que você mesmo condena no seu ponto #2. Coerência, Pedro.

**E o seu peso de 15% pro geo trata o problema como só entrega, não como categoria.** Restaurar geo sem consertar o que o anúncio DIZ te devolve o comprador de R$5k com CEP melhor. Você incluiu a âncora, sim — mas como acessório da saudação, não como o mecanismo central. É o mecanismo central.

### Larry Kim

**Seu P0-3 contradiz a janela limpa que você mesmo defende.** Criar um adset novo de remarketing R$20/d no meio da janela de 14 dias, numa conta que você descreveu como "presa em Learning perpétuo com 3-13 eventos/sem", é adicionar mais um evento de otimização faminto a uma conta que não alimenta nem os que já tem. Depesh está certo contra você aqui: dois (agora três) Learnings simultâneos com <50 conversões/sem cada = nenhum fecha nunca.

**"O CTWA pode coexistir com o form" é a frase mais perigosa do seu texto.** Pelo mesmo motivo: o sinal da conta não sustenta dois eventos de conversão diferentes. Escolhe um, posiciona ele direito, fecha a janela. A pergunta "form vs CTWA" é falsa (nisso Depesh acertou), mas a resposta não é "os dois" — é "um de cada vez, bem posicionado".

**E "aposto em reprovação por política de destino wa.me" é aposta, não dado.** Plausível? Sim. Mas você apresentou como quase-fato e construiu o P0-2(c) em cima. A pesquisa lista quatro suspeitos antes desse. Abra a conta, olhe o status, DEPOIS prescreva.

### Depesh Mandalia

**Seu peso de 5% pro CTWA é retrovisor puro — e o seu remédio principal tranca o erro por 14 dias.** Concordo que 3 dias e R$265 não explicam o mês zerado (eu mesma disse isso). Mas o conclave não existe só para explicar julho — existe para impedir agosto. Se a sua "janela travada até 21/Jul" for aplicada a uma campanha cujo anúncio não diz o que a Bretda é nem o que custa, você tranca 14 dias de pipeline enchendo de comprador de R$5k. Disciplina de janela é virtude SOMENTE depois que o posicionamento dentro da janela está certo. Você até sequencia certo (geo primeiro, depois trava) — mas dá 5% de peso à única coisa que determina QUEM entra no pipeline dos próximos 60 dias. Contexto errado travado com disciplina continua sendo contexto errado.

**E o seu P0-3 viola o seu próprio mandamento.** "Nada muda até 21/Jul" — e três parágrafos depois você cria um adset novo de retargeting Engaged R$20/d dentro da janela. É a mesma incoerência do Kim. Escolhe: ou a janela é sagrada, ou não é.

**"Eu pagaria R$300 por conversa sem piscar" é matematicamente verdade e operacionalmente tóxico.** Dizer isso a um founder que está há 30 dias sem vender é dar licença para tolerar custo crescente sem exigir a contrapartida (fit). O nCAC de R$3.000 só fecha se a conversa for da categoria certa — que é exatamente o que a campanha atual não compra.

### Alex Hormozi

**"Qualidade se compra com OFERTA, não com targeting" é a sua melhor frase e o seu maior erro — porque é meia verdade.** A pesquisa primária te refuta na metade que falta: a doc da Meta (Frente 2.1) documenta que **a entrega vai para onde o leilão é mais barato, independente do que o anúncio diz**. Âncora de preço no copy filtra quem CLICA; não muda onde a Meta EXIBE. Com otimização por CONVERSAS, o algoritmo vai continuar caçando a conversa mais barata do Brasil — e sempre haverá curioso suficiente em CPM barato para alimentá-lo, âncora ou não. Copy e geo não são alternativas; são duas camadas do mesmo contexto. Você quer tirar uma porque a outra "faz o trabalho de graça". Não faz.

**"Os pins micro mataram a entrega" também não está nos dados.** CPM R$21→R$43 (e R$82 no adset premium, dado vivo do Depesh) é entrega CARA, não morta — e cara era o preço de comprar o comprador certo. O adset premium estava gerando lead a R$44 quando foi pausado. O problema de maio não foi o geo apertado; foi apertar o geo SEM aceitar que volume menor exige janela maior e funil de follow-up impecável. Vocês compraram o público certo e desperdiçaram no atendimento — e a sua causa #2 (follow-up morto) prova que você sabe disso.

### Joanna Wiebe

**Seu pre-fill autoqualificador é uma boa ideia calibrada forte demais.** Obrigar o prospect a declarar *"sei que os projetos partem de R$30 mil"* na primeira mensagem DELE é fazer o cliente assinar um termo antes de dizer oi. Ninguém fala assim — e você, logo você, sabe que pre-fill tem que soar como voz do cliente. Efeito colateral técnico que você não considerou: com objetivo CONVERSATIONS, se quase ninguém aperta o botão, o evento de otimização seca, o custo/conversa explode e a entrega desestabiliza no meio do Learning. Âncora vai no anúncio e na saudação DO ATELIER (minha P0-1); o pre-fill pode sinalizar ("projeto sob medida"), não exigir confissão. E seus "≥8 orçamentos formais em 14 dias" saindo de 3-4 conversas/dia é o número mais otimista do painel — todo mundo mais está em 2-4, e o histórico da conta não sustenta o seu.

**Onde você me venceu, admito abaixo.**

---

## 2. DEFESA E REVISÃO

**Revisão 1 — Eu subpesei o mecanismo de OTIMIZAÇÃO; a pesquisa me corrigiu.** Minha análise tratou o problema do CTWA como copy + geo. A Frente 1.1/1.2 mostra que é mais fundo: o objetivo CONVERSATIONS **define "sucesso" como conversa iniciada** — o algoritmo está sendo pago para achar curioso barato. E existe maquinário nativo que eu não citei: `page_welcome_message`, ice breakers e o objetivo Leads com Q&A ramificado. Posicionamento, na Meta de 2026, inclui o que você manda o algoritmo otimizar. Minha P0-1 sai mais forte: não é só reescrever o anúncio — é reconfigurar o evento de sucesso. Contexto para o cliente E contexto para a máquina.

**Revisão 2 — Meu peso de 30% no CTWA misturou dois relógios.** Depesh e Hormozi têm razão: para o MÊS ZERADO, 3 dias de campanha pesam quase nada. Eu escrevi "30%, e crescendo" — a metade honesta é o "crescendo". Reformulo: julho = ~5% de culpa do CTWA; **agosto = 60%+ se ninguém mexer**. É a distinção que o founder precisa ouvir para não consertar a coisa errada.

**Revisão 3 — Wiebe me venceu nos arquitetos, e a pesquisa cravou.** Eu deixei os 24 arquitetos como "P0-4 quando a mídia estabilizar". A Frente 3.3 mostra que o canal especificador é **o único mecanismo documentado que move R$30k+ de forma consistente no Brasil** (RT/programas de relacionamento — Ornare, Artefacto). Está pronto, custa R$0, e o arquiteto é o único leitor que não precisa de âncora de preço porque ele É a âncora. Condicionar o canal mais validado à estabilização do canal menos validado foi erro meu de sequenciamento. Promovido para esta semana.

**Defesa 1 — Minha âncora de R$30k estava certa; as dos outros, não.** Sobral (R$25k) e Hormozi (R$28k) suavizaram o número. Não suavizem. O preço é o enunciado de categoria mais barato que existe.

**Defesa 2 — Meu "blind spot" foi atacado por convergência, não refutado.** Cinco de cinco apontaram "ninguém olha dentro do WhatsApp" como blind spot — o que significa que o painel NÃO vai deixar passar, e minha contribuição específica continua de pé e não-duplicada: não é só medir speed-to-lead e taguear fit (Sobral/Kim/Depesh) — é **estruturar o pitch da conversa** (insight → alternativas → produto → prova → ask) e **ler os transcripts como pesquisa de posicionamento** (aqui Wiebe e eu somos aliadas). Métrica sem script mede a agonia com precisão.

**E o blind spot que SOBROU, que ninguém — nem eu — colocou na mesa 1ª rodada:** a Frente 3.1 mostra a **BlackBall dominando organicamente exatamente as buscas que a Bretda paga caro para disputar** ("mesa de sinuca e jantar", "preço de mesa de sinuca") — com páginas educacionais de preço e material. A alternativa competitiva não é só "mesa de R$5k" ou "não decidir": é o concorrente que EDUCA a categoria de graça enquanto a Bretda briga por 10% de um leilão. Médio prazo, a jogada de posicionamento mais barata do negócio é uma página que faça o que a BlackBall faz — só que ancorada em atelier e R$30k. Registro para o backlog; não é P0.

---

## 3. POSIÇÃO FINAL

**Causa raiz nº1 (uma frase):** O zero de julho é aritmética de lag — o pivô de fim de maio cortou os leads de 196→86 e, com taxa lead→venda ~1,5% estável e ciclo de semanas, julho apenas colheu o pipeline pela metade que junho plantou — enquanto o pivô de 04/Jul, inocente do zero atual, está fabricando o zero de agosto ao remover todo o contexto (geo, qualificação, preço) sem repor nada.

**P0-1 (revisada) — Reposicionar o CTWA por inteiro: mensagem + máquina + geo, e SÓ ENTÃO travar a janela.**
(a) Âncora de categoria e preço no criativo: *"Mesa de sinuca que vira mesa de jantar. Feita em atelier, madeira maciça, sob medida. Projetos a partir de R$30 mil"* — R$30k, sem desconto de âncora; (b) `page_welcome_message` + ice breakers nativos qualificando em 2 toques (casa/área gourmet/projeto de arquitetura? prazo?); (c) restaurar geo recortado (cidades premium; pins micro opcionais — o meio-termo do Hormozi é aceitável, a ausência total não); (d) avaliar migração CONVERSATIONS → objetivo Leads/Q&A (o algoritmo precisa otimizar para quem COMPLETA a qualificação, não para quem diz oi). Feito isso, **adoto a disciplina do Sobral/Depesh: 14 dias sem tocar — e sem adsets novos dentro da janela, ao contrário do que Kim e o próprio Depesh propuseram**. Medir: % conversas 5+ msgs (de 35% para ≥55%), % qualificadas ≥R$20k (meta ≥40%), zero pedinte de R$5k.

**P0-2 (revisada) — Os dois pipelines já pagos: 76 leads + 24 arquitetos, esta semana.**
(a) Sequência de 3 toques nos 76 leads começando por insight que ensina as 3 alternativas (loja R$5-8k / importada / atelier sob medida), prova com cidade nomeada, ask pequeno (simulação 3D — o configurador como ferramenta de venda). Adoto a régua de falsificação do Depesh: <8% de resposta após 3 toques bem executados = aceito que lead de form é fraco para esse ticket. (b) **Arquitetos promovidos de P0-4 para agora** (concessão à Wiebe, validada pela Frente 3.3): 30 minutos do founder destravam os 24 rascunhos prontos do único canal que comprovadamente vende R$30k+ no Brasil. Esperado 14d: 8-11 respostas dos leads + 4-7 respostas de arquitetos = 1-2 orçamentos reais com mídia a R$0.

**P0-3 (mantida, com a ordem endurecida) — Google: diagnóstico ANTES de veredito, depois dominar o pond que os dados escolheram.**
(a) 30 minutos de Ad Preview & Diagnosis + status de aprovação dos 16 RSAs wa.me — **ninguém pausa nem realoca nada antes disso** (contra o Sobral; a doc oficial põe review de RSA de 3 dias como suspeito nº1); (b) confirmado o diagnóstico, CPC R$9-10 SÓ no ad group "Bilhar + Jantar" (CTR 14,3%, única conversão — o mercado já nomeou a categoria da Bretda; o CPC histórico de R$9,83 do Sobral diz o preço de entrada); (c) deploy do fix de landing que está pronto e parado — QS post-click 2 é a multa que trava tudo sob o teto; (d) RSAs com a MESMA âncora de categoria+preço do P0-1 — um posicionamento, todos os canais. Medir: IS do ad group 10%→25-35%, conversas WhatsApp taggeadas por origem.

O painel convergiu no diagnóstico e divergiu na hierarquia. Minha hierarquia final: **volume explica julho; contexto decide agosto; e a conversa dentro do WhatsApp decide se qualquer um dos dois vira venda.** O produto está pronto. O contexto foi desligado em 04/Jul — religuem as três camadas dele (o que o anúncio diz, o que o algoritmo otimiza, onde ele entrega), e não uma só.

— Dunford. Same product, different context, completely different outcome. 🎯

================================================================
a8246091596c58368
================================================================

# Rodada adversarial — Jo (Joanna Wiebe) · Conclave Bretda · 07/Jul/2026

Li os quatro. Boa notícia: o painel convergiu no que importa (lag de junho = causa #1; os 76 leads não estão mortos; a conversa do WhatsApp é o buraco). Má notícia: se o founder executar este conclave ao pé da letra, o funil da Bretda vai falar **quatro preços diferentes em quatro vozes diferentes** — e isso, senhores, é problema MEU. Vamos aos ataques.

---

## 1. Ataques

### Pedro Sobral — você escreveu a âncora errada e colocou ela no lugar errado

**"Projetos a partir de R$25 mil" na mensagem de boas-vindas.** Dois erros numa frase só:

1. **R$25 mil não é o preço.** O dossiê inteiro diz R$30k+. Ancorar ABAIXO do piso real não filtra — fabrica a negociação "então dá pra fazer por 25?" e o choque de preço no minuto 3, exatamente o momento onde April mostrou que o pitch morre. Âncora é promessa; prometer 25 e cobrar 30 é quebra de promessa no primeiro contato.
2. **A boas-vindas chega DEPOIS do clique pago.** Você mesmo aceita CPMsg subindo pra R$18-30 — ou seja, aceita pagar R$18-30 pelo curioso de R$5k *e só então* mostrar o preço pra ele ir embora. O filtro tem que estar no anúncio e no pre-fill, ANTES do leilão cobrar. Sua própria tese ("Vanity CPMsg") pede isso; sua execução contradiz.

E no P0-3(b): subir CPC pra R$9-10 no ad group campeão **simultaneamente** ao deploy do fix de QS é comprar mais tráfego pra uma página que o próprio Google nota 2 post-click. Sequência importa: deploy primeiro, 3-5 dias de recrawl, lance depois. Senão você escala o vazamento antes de tapar o furo — e paga R$9,83 pelo privilégio.

### Larry Kim — seu P0-3 quebra a janela que você mesmo exigiu

**O adset de remarketing R$20/d para os 76 leads é a ação mais perigosa do painel.** Três defeitos:

1. Custom Audience de **76 pessoas** está abaixo do mínimo prático de entrega da Meta (~100 matches) — ela não vai entregar, ou vai entregar errático.
2. Sua muleta pra isso — misturar "engajadores IG 90d" — dilui os 76 leads premium com exatamente o público de engajamento barato que semeou o problema da LAL. Você mata burros e aí convida uma manada deles pro adset.
3. Criar um adset NOVO no dia 3 da campanha é mais um evento de otimização — o quarto pivô em 6 semanas. Depesh está certo contra você aqui: <50 conversões/semana não sustenta nem UM learning, quanto mais dois. Os 76 leads se reativam com PALAVRAS a R$0, não com mídia.

Menor, mas registro: você afirmou "aposto em reprovação por política de destino wa.me" com confiança de fato consumado. A pesquisa (Frente 4.1) diz que isso se verifica em minutos no Ad Preview & Diagnosis — e o dado ao vivo do Sobral (CPC histórico R$9,83 vs teto R$6 = nunca entra no leilão) explica os 0 impressões sem precisar da sua aposta. Verifiquem antes de trocar URL final de 16 RSAs — trocar destino por palpite é mais um pivô cego.

### Depesh Mandalia — você está prescrevendo a recaída da doença que você mesmo diagnosticou

Seu diagnóstico é o mais rigoroso do painel (Poisson, CPM R$82 ao vivo, indisciplina de janela). E aí seu P0-1 manda **restaurar exatamente o recorte de pins micro-enclave que causou a causa #1**: foi esse targeting que dobrou o CPM (R$21→R$43→R$82 no seu próprio dado vivo), estrangulou o volume 196→86 e prendeu a conta em Learning eterno. Você projeta CPM R$70-90 e conversas caindo pra 4-6/d — isso é re-executar o pivô de maio com nome novo. Se a âncora de preço no criativo (seu próprio P0-2!) faz a triagem socioeconômica por R$0, o geo não precisa ser enclave cirúrgico — precisa ser o meio-termo (as 37 cidades, sem pins) que preserva volume de leilão. Você não pode cobrar 50 eventos/semana pro Learning fechar E comprimir a audiência pro CPM de R$90 ao mesmo tempo. Escolha um.

E seu P0-2 mede o filtro ("% conversas qualificadas ≥40%") sem escrever o filtro — quem redige a variante com âncora? Com que estrutura? "Overlay na imagem + linha no primary text" não é spec de copy, é wireframe. É por isso que copywriter senta no conclave.

### Alex Hormozi — seu Toque 1 é o spam educado que você mesmo condenou

Você escreveu, no seu #2: *"se a mensagem foi 'oi, vi que você preencheu o formulário' — isso não é follow-up, é spam educado. Vocês compraram atenção e não deram nada em troca."* Perfeito. Aí seu P0-2 D1 é: **"Ainda procurando sua mesa de sinuca sob medida?"** — nove palavras que não dão NADA em troca. É o mesmo spam educado, só que mais curto. O 9-word do Dean Jackson tem pedigree em lista de e-mail B2B morna; num WhatsApp 1:1 de compra de luxo considerada, o primeiro toque que reabre a porta é o que traz trabalho novo (projeto montado, vaga de agenda real). No mínimo: teste os dois, 38/38 — mas não apresente palpite de formato como P0 sem o teste que você cobra dos outros.

E "a partir de R$28 mil"? O painel agora tem TRÊS âncoras: R$25k (Sobral), R$28k (você), R$30k (eu e April). Preço exposto só funciona se for UM número, o piso verdadeiro, repetido em todo ponto de contato. Três números = o funil negociando contra si mesmo.

### April Dunford — sua Msg 1 ancora o leitor no preço do concorrente

Você é minha aliada em 80% disso (âncora no anúncio, categoria "sinuca e jantar", transcripts). Mas sua Msg 1 de reativação tem dois defeitos de execução:

1. **É uma aula de 60+ palavras como PRIMEIRO toque de WhatsApp.** Isso é estrutura de e-mail educacional colada num canal de chat. No WhatsApp, o toque 1 ganha a resposta; o toque 2 ensina. Seu framework de 8 passos é certo — a dosagem por canal está errada.
2. **Você abre citando "R$5-8k, MDF" antes de dizer o preço da Bretda.** Primeiro número que o leitor vê = âncora. Você ancora ele no preço da mesa de loja e só depois (implícito!) chega no atelier. Inverta: a peça de atelier primeiro, a alternativa descartável depois — ou o contraste trabalha contra você.

E rebaixar os 24 arquitetos pra "P0-4 quando a mídia estabilizar" é o erro de prioridade do painel: a pesquisa (Frente 3.3) mostra que especificador é **o único canal documentado que move R$30k+ de forma consistente no BR** — e é o único canal da Bretda com ZERO dependência da bagunça de mídia. Está bloqueado por 30 minutos do founder. Isso não espera a mídia; isso passa na frente da mídia.

---

## 2. Defesa e revisão

**REVISO (a pesquisa me pegou): meu P0-A estava incompleto.** Eu tratei o pre-fill como a única alavanca de qualificação do CTWA. A Frente 1.1 mostra que a Meta oferece estrutura nativa que eu ignorei: `page_welcome_message` configurável no criativo + **até 4 ice breakers** + o objetivo Leads com Q&A ramificado. Ice breakers são 4 CTAs auto-qualificadores que alguém precisa ESCREVER — isso é trabalho meu e eu não o especifiquei. Revisado abaixo. (E se o Q&A do objetivo Leads estiver disponível na conta, ele muda até o que o algoritmo otimiza — de "conversa iniciada" pra "fluxo completado". Isso é maior que copy; passem pro especialista de Meta validar elegibilidade.)

**REVISO parcialmente meu ceticismo com geo.** Eu escrevi "corrigir só o geo = leads de R$5k dos Jardins". Sustento a metade: copy sem âncora atrai sonhador em qualquer CEP (April provou o mesmo ponto). Mas a Frente 2.1 + o mecanismo que Sobral/Kim/Depesh documentaram é real: com objetivo CONVERSATIONS, o leilão **caça ativamente** a conversa mais barata do país — a melhor âncora do mundo não impede o delivery de concentrar onde o CPM é fração. Copy filtra quem clica; geo decide quem VÊ. Posição revisada: **os dois filtros voltam no mesmo dia** — âncora no criativo (meu) + geo intermediário 37 cidades (deles). Nem Brasil-inteiro, nem enclave de CPM R$90.

**DEFENDO meu #3 (76 leads) — agora com dado.** Eu escrevi "aposto que o follow-up era genérico" como aposta; a Frente 5.1 (MIT: 5 min vs 30 min = 21× qualificação, 100× contato; HBR: 23% nunca respondem) transforma a aposta em mecanismo documentado. O silêncio dos 76 é o comportamento ESPERADO de lead de instant form contatado tarde e pouco. Ninguém do painel refutou isso — todos aderiram. Consenso registrado.

**DEFENDO meu blind spot — e a convergência é a prova.** Eu previ que "ninguém vai auditar o copy dentro do WhatsApp"... e quatro de quatro experts apontaram a mesma caixa preta (Sobral: sales feedback loop; Kim: speed-to-lead; Depesh: operação de conversa; April: pitch estruturado). Quando o blind spot que eu aposto vira o consenso do painel, ele deixa de ser blind spot e vira **a prioridade nº1 não-atribuída**. Notem: todos mediram a conversa; nenhum escreveu a conversa. A primeira resposta do atendente continua sem dono. Eu reivindico ela — com o material de message mining das 26 conversas existentes, que segue sendo a pesquisa de VOC mais barata do negócio.

**DEFENDO R$30 mil como A âncora.** Contra o R$25k do Sobral e o R$28k do Hormozi: o ticket é R$30k+ (dossiê). Âncora abaixo do piso = desconto pré-concedido + choque adiado. Um número, o verdadeiro, em todo ponto de contato — anúncio, pre-fill, ice breaker, boas-vindas, follow-up. Regra de Um aplicada a preço.

---

## 3. Posição final

**Causa raiz nº1 (uma frase):** O zero de julho foi assinado pelo colapso de leads de junho (196→86) num ciclo de semanas — e a remoção simultânea dos dois filtros (form qualificador + geo premium) em 04/Jul, sem colocar UMA palavra de qualificação no lugar, garante que agosto repita o filme com elenco pior.

**P0-A (revisado) — Qualificação nativa completa no CTWA, com as palavras escritas por escrito (HOJE, R$0):**
- Body Aurora/Opal: acrescentar *"Projetos partem de R$30 mil. Prazo de atelier: sob consulta."*
- Pre-fill: *"Olá! Quero um projeto Bretda sob medida (sei que os projetos partem de R$30 mil)."*
- **NOVO — 4 ice breakers** (Frente 1.1): (1) *"Quero ver projetos a partir de R$30 mil"* (2) *"Como funciona o projeto sob medida?"* (3) *"Qual o prazo do atelier?"* (4) *"Sou arquiteto(a) — quero especificar"*. O quarto é uma porta de canal especificador dentro do anúncio, de graça.
- **NOVO — primeira resposta do atendente, escrita e fixada** (o headline mais importante do funil): *"Que bom te receber. Pra eu montar o caminho certo: o projeto é pra sua casa ou é especificação de projeto (arquitetura)? Nossos projetos partem de R$30 mil e cada mesa é única — te mostro 3 saindo do atelier agora."*
- Condição de contorno (domínio alheio, registro): geo volta pro intermediário de 37 cidades no mesmo dia — copy filtra o clique, geo corrige o delivery.
- Medir: % conversas 5+ msgs (35%→55%+), fit/no-fit taggeado por conversa, ≥8 orçamentos R$30k+ em 14d, zero "tem de 5 mil?".

**P0-B (mantido, com teste embutido) — Reativação dos 76 por palavras, não por mídia (48h, R$0):** 3 toques/10 dias — Toque 1 traz trabalho novo (2 opções de projeto + agenda de agosto), Toque 2 prova (peça real saindo do atelier, madeira nomeada), Toque 3 breakup honesto. **Duas versões do Toque 1, 38/38** — incluo a variante 9-palavras do Hormozi como desafiante contra minha versão trabalho-novo. Se a dele ganhar, eu como o chapéu publicamente; testem, não discutam. Veto mantido ao adset de remarketing do Kim (76 < mínimo de entrega + 4º pivô na janela). Medir: resposta por toque por variação → orçamento → venda em 30-45d.

**P0-C (mantido e ESCALADO em prioridade) — Disparar os 24 arquitetos (esta semana, R$0 + 30 min do founder):** a pesquisa confirmou (Frente 3.3) que especificador é o único canal com histórico documentado de mover R$30k+ consistentemente no BR — e é o único imune à bagunça de mídia. Copy Hopkins-88 pronta, 2 variações, 12/12. Não é "depois que a mídia estabilizar", April — é ANTES, porque não depende dela. Medir: resposta por variação, conversas de especificação abertas.

Uma última linha pro founder: este painel te entregou três números de âncora e quatro mensagens de boas-vindas. Escolha **um** número (R$30 mil), **uma** voz, e mande alguém ler os transcripts das 26 conversas antes de aprovar qualquer palavra nova. A melhor copy da Bretda já está na boca do cliente.

— Jo. Agora vá testar. E teste de verdade — 38/38, não no achômetro.

================================================================
ab15402ab2ef23562
================================================================

# SÍNTESE DO CONCLAVE — BRETDA: 1 MÊS SEM VENDA
**07/Jul/2026 · 6 experts (Sobral, Kim, Mandalia, Hormozi, Dunford, Wiebe) · análise original + rodada adversarial + pesquisa de fontes primárias**

---

## 1. CONSENSO (≥4 experts, com evidência)

**C1 — O zero de julho foi assinado em junho, não pela "otimização recente" (6/6, unânime).**
Matemática do funil: taxa lead→venda ~1,5% estável (dossiê 29/Jun). Maio = 196 leads → 3 vendas; junho = 86 leads (−56%) → expectativa ~1,3 vendas → saiu 1. Com ciclo de semanas, julho colhe o pipeline de junho, que era metade do de maio. Com λ≈1 venda esperada/mês, um mês ZERO tem ~27-35% de probabilidade por puro acaso (Poisson — Depesh/Hormozi/Kim). O alerta de 29/Jun ("colapso de junho bate em jul/ago") previu exatamente isto. Nenhum expert disputou.

**C2 — O CTWA de 04/Jul (3 dias, R$265) explica os leads de R$5k do Nordeste, não o mês sem venda (6/6).**
Mecanismo documentado (pesquisa, Frentes 1.1/1.2/2.1, doc oficial Meta): objetivo CONVERSATIONS otimiza para "qualquer um que manda oi" + `geo_locations: {countries: [BR]}` (dado ao vivo — zero cidade/bairro/pin) + entrega de leilão indo para onde a conversa é mais barata + zero âncora de preço no criativo. Três filtros removidos no mesmo dia (form qualificador, geo premium, e nada posto no lugar). É a crise de AGOSTO sendo fabricada agora — não a causa de julho.

**C3 — Os 76 leads do form não estão mortos; estão mal contatados — e são a venda mais provável do mês (6/6).**
CPL R$28,32 de público premium (0,09% do ticket). MIT/HBR (Frente 5.1, confiança alta): contato em 5 min vs 30 min = 21× mais qualificação; 23% das empresas nunca respondem. Não existe UM dado de cadência no dossiê (quando, quantos toques, qual mensagem). 76 × 1,5% ≈ 1,1 venda esperada sentada no CRM. Reativação = trabalho de INBOX 1:1 (R$0), **não** de Ads Manager — os dois que propuseram adset de retargeting (Kim, Depesh) retiraram a proposta na adversarial (76 contatos < mínimo de match da Meta + evento de learning novo).

**C4 — O fix do CTWA é um lote único, hoje, e depois janela travada até 21/Jul (6/6 na versão final).**
(a) Geo intermediário de volta: 37 cidades + 10 bairros nobres, PRESENCE, **sem pins micro** (meio-termo Hormozi, aceito por todos — pins têm histórico de conflito/estrangulamento; refinamento fica para o dia 14); (b) âncora de preço no body dos ads; (c) qualificação nativa: `page_welcome_message` + ice breakers (Frente 1.1, doc Meta — hoje a campanha não usa nada disso); (d) depois, **NADA muda até 21/Jul**. Histórico: 3 pivôs em 6 semanas, nenhum adset saiu do Learning desde maio (3-13 eventos/sem vs régua 50); o plano de 29/Jun ("10-14d sem mexer") durou 5 dias.

**C5 — A âncora é R$30 mil. Um número, em todos os pontos de contato (consenso após adversarial).**
Sobral abriu com R$25k, Hormozi com R$28k — ambos revisaram após Wiebe/Dunford: âncora abaixo do piso real (R$30k+, dossiê) é desconto pré-concedido e convite a negociar da referência errada. Anúncio, saudação, ice breaker, follow-up: R$30 mil.

**C6 — O blind spot é o mesmo para os 6: ninguém mede o que acontece DEPOIS do clique.**
"Leads não respondem" e "clientes horríveis" são frases de sentimento, não dados. Nasce o placar único: planilha de 6 colunas (data, origem, lead, **minutos-até-1ª-resposta**, status, motivo-morte) + métrica-farol **orçamentos formais R$30k+ emitidos/semana (meta 2-5)** — o único leading indicator honesto num negócio cujo placar de vendas tem lag de 30-60 dias.

**C7 — Google: diagnóstico de 30 min ANTES de qualquer faca + deploy do fix de CRO parado (5/6 na versão final).**
As 2 Alta Intenção (0 impressões): os 16 RSAs wa.me têm 3 dias de vida e o "0 em 30d" inclui o período pausado — Ad Preview & Diagnosis decide entre review/política de destino wa.me (suspeito nº1, Frente 4.1, doc oficial Google) e Ad Rank sob teto R$6 (CPC histórico R$9,83). O fix do configurador (QS post-click 2) está **pronto e não-deployado** — custo de uma decisão. Lance R$9-10 é cirúrgico e só no ad group/keywords "Bilhar + Jantar" (CTR 13-14%, única conversão da conta), nunca geral.

**C8 — Os 24 arquitetos são o canal mais validado da mesa e estão parados por 30 minutos do founder (6/6 na versão final).**
Frente 3.3 (confiança alta): especificador é o único canal documentado que move R$30k+ de forma consistente no BR (RT 5-12%, programas tipo Ornare/Artefacto). Lista tier S + copy Hopkins-88 prontas há dias, travadas em 3 inputs (nome/cargo, link catálogo, nº de residências). Zero dependência da mídia, zero Learning, zero leilão. Trava jurídica registrada (Sobral): estruturar como programa de relacionamento transparente — RT oculta é infração no CAU.

**C9 — Pré-condição que engole tudo: saldo Meta contínuo, runway ≥14 dias, verificado antes do dia 1 (6/6).**
Spend médio junho R$80/d contra R$130 planejado; histórico de spend_cap estourado e buracos de entrega. Buraco de saldo no dia 6 da janela invalida o diagnóstico inteiro — foi assim que junho morreu.

---

## 2. DISSENSO (divergências reais e quem tem mais dado)

**D1 — Peso do CTWA na causa do mês: 30% (Dunford) vs 15% (Sobral) vs ~5% (Depesh/Kim/Hormozi).**
Dunford foi atacada por 4 experts pela contradição (refutou o founder com "3 dias não causam um mês" e deu 30% ao mesmo pivô) e **cedeu na adversarial**: reformulou para "~5% de julho; 60%+ de agosto se ninguém mexer". *Vence o lado Depesh/Kim: R$265 e 72h não carregam um mês-zero. A contribuição da Dunford sobrevive como distinção de relógios: julho ≠ agosto.*

**D2 — "Qualidade se compra com OFERTA, não com targeting" (Hormozi) vs geo é insubstituível (Sobral/Kim/Depesh/Dunford + Frente 2.1).**
A doc oficial da Meta refuta a metade do Hormozi: o leilão não lê copy — com objetivo CONVERSATIONS e geo aberto, a entrega vai para onde a conversa é barata ANTES de qualquer palavra ser lida; âncora filtra o clique, geo filtra a exibição. E a cronologia da conta refuta o argumento-prova dele: sob geo premium (18/Jun→04/Jul) **não houve nenhum registro de pedinte de R$5k** — o comprador de R$5k apareceu em 72h de Brasil-inteiro. *Hormozi admitiu o overstatement. Vence: geo + âncora + welcome message, três portarias em camadas — não uma no lugar da outra.*

**D3 — Pausar as Alta Intenção já (Sobral original) vs diagnosticar primeiro (Kim/Dunford/Hormozi/Wiebe + doc Google).**
O "0 impressões em 30 dias" do Sobral misturou janelas (inclui período pausado); RSAs de 3 dias podem estar simplesmente em review. *Sobral reviu. Vence: Ad Preview & Diagnosis primeiro; a resposta muda o remédio (review → trocar URL final; rank → pausar e realocar).*

**D4 — Sequenciamento do lance Google: junto com o deploy (Kim/Sobral) vs deploy → recrawl 5-7d → lance (Hormozi/Wiebe/Depesh).**
Argumento do segundo grupo: Ad Rank = lance × QS; subir lance sobre QS 2 é pagar mais pela mesma multa, e duas variáveis no mesmo leilão queimam o teste. *Divergência residual, mas o dado favorece o sequenciamento: deploy da LP primeiro (custo R$0, decisão parada), lance depois.* Alerta adicional do Sobral incorporado: wa.me como URL final mata o GCLID — destino deve ser a LP do configurador com botão WhatsApp.

**D5 — Expectativa de orçamentos em 14d: ≥8 (Wiebe) vs 2-4 (Sobral/Kim/Depesh/Hormozi).**
Com ~3-6 conversas qualificadas/dia, ≥8 orçamentos exige 15-20% de conversão conversa→orçamento numa operação sem script onde 65% das conversas morrem antes da 5ª mensagem (9/26). *Vence 2-4: meta inflada é o gatilho do próximo pivô de pânico.*

**D6 — Split test 38/38 nos 76 leads (Wiebe) vs uma mensagem executada 100% (Depesh/Hormozi).**
Com 13-20% de resposta esperada, cada braço devolve 5-7 respostas — poder estatístico zero. *Vence Depesh: uma cadência, a melhor, executada por inteiro. A/B com poder real existe no adset (ad com âncora vs sem âncora, rodando em impressões).*

**D7 — Migrar objetivo CONVERSATIONS→Leads/Q&A agora (Dunford/Kim inclinam) vs decisão do dia 14 (Depesh).**
Trocar objetivo = campanha/Learning novos = quebrar a janela no dia 1; e o Q&A de CTWA ainda está em rollout "select advertisers" (Frente 1.1). *Vence Depesh: agendado para 21/Jul, com os dados de tagueamento na mão.*

**D8 — "O form estava melhorando quando foi pausado" (Depesh).**
Refutado por Kim e Hormozi com o próprio dado dele: 5 leads @ R$43,97/7d é 55% PIOR que o CPL histórico de R$28,32, e n=5 não sustenta leitura nenhuma. *O que sobrevive: a decisão de pausar foi pânico sem 14 dias limpos de teste — mas não porque o form "melhorava".*

---

## 3. BLIND SPOTS (o que só 1 viu — ou só a pesquisa)

1. **BlackBall domina organicamente as exatas buscas que a Bretda paga para disputar** (Dunford + Frente 3.1): páginas educacionais de preço/material rankeando em "mesa de sinuca de luxo", "preço de mesa de sinuca", "mesa de sinuca e jantar". A jogada de médio prazo mais barata: uma página que faz o que a BlackBall faz, ancorada em atelier e R$30k. Backlog 60 dias.
2. **Sazonalidade: jun/jul é vale histórico do varejo de móveis BR** (só a pesquisa, Frente 3.2). Não explica o 3→1→0 (que acompanha o −56% de leads), mas muda a régua do dia 14: comparar contra baseline sazonal, não contra maio — e parte da recuperação de ago-dez virá "de graça" com o 2º semestre.
3. **Smoke test manual do sender WhatsApp antes de reativar qualquer criativo CTWA** (só Sobral, padrão KR 12/Mai: wa.me errado = 99 conversas para o vazio em 12 dias). Gate obrigatório do lote de hoje.
4. **CTR de 13,4% no Google é sobrevivente de leilão** (só Sobral): com IS 10%, o CTR atual não é baseline válido — quando o IS subir, o CTR VAI cair e deve cair. O gate do dia 14 é conversa-WhatsApp por termo, não CTR.
5. **O appointment nomeado: projeto 3D gratuito com data de entrega** (só Hormozi) — transforma curioso em pipeline; mas na ordem âncora → qualifica → 3D (só para quem passa da âncora, top 15-20 por orçamento declarado), senão o atelier vira fábrica de render.
6. **A primeira resposta do atendente é o headline mais importante do funil e ninguém a escreveu** (só Wiebe) — ela entregou o script; e o 4º ice breaker "Sou arquiteto(a) — quero especificar" abre porta de especificador dentro do anúncio, de graça.
7. **Message mining: as 26 conversas + objeções dos leads de R$5k são a pesquisa de VOC mais barata do negócio** (Wiebe/Dunford) — founder puxa os transcripts das 10 conversas de 5+ mensagens antes de aprovar qualquer copy nova.
8. **Zona cinzenta jurídica da RT** (Sobral + Frente 3.3): comissão oculta a arquiteto é infração no CAU — o canal se estrutura como condição comercial transparente para especificadores.

---

## 4. VEREDITO — causa raiz ranqueada do mês sem venda

| # | Causa | Peso | Evidência |
|---|-------|------|-----------|
| **1ª** | **Lag do colapso de volume de junho** — pivô de fim de maio cortou leads 196→86 (−56%); taxa lead→venda ~1,5% estável → expectativa ~1,3 vendas em junho e <1 no pipeline de julho; mês zero tem ~27-35% de chance por Poisson | **~55%** | Dossiê (linha do tempo + taxa estável) + alerta escrito de 29/Jun que previu jul/ago. Unânime 6/6 |
| **2ª** | **Indisciplina de execução** — 3 pivôs estruturais em 6 semanas, nenhum adset saiu do Learning desde maio (3-13 ev/sem vs 50), plano de 29/Jun quebrado no dia 5, saldo intermitente (R$80/d real vs R$130 planejado) | **~25%** | Dossiê + dado vivo Meta (Depesh). O motor do colapso segue ativo |
| **3ª** | **76 leads @ R$28 abandonados sem cadência instrumentada** — ~1,1 venda esperada parada no CRM; silêncio é o comportamento documentado de lead de instant form contatado tarde e pouco | **~12%** | Dossiê + MIT/HBR (Frente 5.1) |
| **4ª** | **CTWA Brasil-inteiro sem âncora nem qualificação** — causa ~100% da queixa "Nordeste R$5k" da semana e está treinando o algoritmo no lead errado; se nada mudar, vira a causa nº1 de agosto | **~5-8% de julho** | Dado ao vivo (targeting BR-inteiro) + Frentes 1.1/2.1 |

**Resposta à pergunta 2 do dossiê:** falso dilema. O form qualificava por fricção; o CTWA qualifica por âncora + geo + fluxo nativo — e a literatura o favorece para alto ticket justamente pela velocidade (Frentes 1.3 + 5.1). CTWA é recuperável; o que não é recuperável é rodar qualquer formato com 3 pivôs em 6 semanas. Um funil por vez; a decisão form-vs-CTWA definitiva se toma em 21/Jul com dados tagueados.

---

## 5. PLANO DE RECUPERAÇÃO

### HOJE (lote único de execução — depois, cadeado)

| Ação | Dono | Custo | Esperado | Medir | Risco se não fizer |
|---|---|---|---|---|---|
| **H1. Fix CTWA em uma onda** no adset `120249597117640737`: geo 37 cidades + 10 bairros nobres (PRESENCE, sem pins micro), manter LAL 1% e R$100/d; 2 variantes novas de Aurora/Opal com âncora *"Projetos sob medida a partir de R$30 mil, madeira maciça, atelier em SC"* (A/B natural com/sem âncora); `page_welcome_message` com âncora + 4 ice breakers (incl. "Sou arquiteto(a) — quero especificar"); primeira resposta do atendente escrita e fixada (script Wiebe); **smoke test manual do sender antes de ativar** | Operador (copy aprovada pelo founder) | R$0 incremental | Conversas caem de ~8,7/d p/ 4-6/d; CPMsg sobe p/ R$18-30 (é para subir); ≥40% qualificadas (aceitam âncora); mix R$5k cai 80-90% | Tagueamento manual (lixo/curioso/≥R$20k) + `messaging_user_depth_5` (35%→55%+) por ad | Algoritmo segue 14 dias aprendendo a buscar o lead errado; agosto repete julho com elenco pior |
| **H2. Saldo Meta contínuo, runway ≥14 dias, verificado** | **FOUNDER** (bloqueador) | saldo | Spend real = 100% do budget | `display_string` diário na Operação Diária | Buraco de saldo no dia 6 invalida a janela — foi assim que junho morreu |
| **H3. Google: Ad Preview & Diagnosis nas 2 Alta Intenção (30 min)** — review/política wa.me vs Ad Rank sob teto R$6 | Operador | R$0 | Veredito em 30 min: se review/política → trocar URL final p/ LP do configurador c/ botão WhatsApp (restaura GCLID); se rank → pausar e realocar R$40/d p/ Aquisição | Status por RSA + motivo por keyword | R$40/d seguem alocados entregando zero |
| **H4. Deploy do fix de CRO do configurador (pronto, parado)** | **FOUNDER** (decisão de deploy) | R$0 | Ataca o QS 2 post-click na raiz; pré-requisito do lance | QS direcional em 14d | Teto de R$6 continua comprando 10% do leilão perfeito |
| **H5. Nasce o placar**: planilha 6 colunas (data, origem, lead, minutos-até-1ª-resposta, status, motivo-morte) + métrica-farol **orçamentos R$30k+/semana (meta 2-4)**; founder puxa transcripts das 10 conversas de 5+ msgs | Operador cria; founder alimenta tags e transcripts | R$0, 10 min/dia | O primeiro sales feedback loop da conta | Preenchimento diário na Operação Diária | Em agosto, outro conclave idêntico decidindo por sentimento |
| **H6. Founder passa os 3 inputs dos arquitetos** (nome/cargo, link catálogo, nº residências) — prazo D+3 ou vira bloqueio escalado | **FOUNDER** (30 min) | R$0 | Destrava o único canal documentado de R$30k+ no BR (Frente 3.3) | Inputs entregues S/N | O canal mais validado da mesa segue parado pela 2ª semana |

### 14 DIAS (07→21/Jul — janela TRAVADA: nada muda no Ads Manager)

| Ação | Dono | Custo | Esperado | Medir | Risco se não fizer |
|---|---|---|---|---|---|
| **Q1. Necromancia dos 76 leads** — UMA cadência 1:1, 3-5 toques/10d, priorizando maior orçamento declarado: D0 trabalho novo real (projeto/foto de mesa entregue; 3D verdadeiro só p/ top 15-20); D+3 prova (peça saindo do atelier, madeira nomeada); D+7 timing; D+10 break-up honesto. **Zero mídia, zero adset** | Founder/atendente (~2h/dia) | R$0 | 11-19 respostas (15-25%), 3-6 conversas reais, 1-2 orçamentos — **a venda mais provável dos próximos 45 dias** (76×1,5%≈1,1 venda já paga). Gate de falsificação: <8% de resposta após 3 toques bem executados = aceita-se que lead de form não sustenta o ticket | Planilha toque→resposta→orçamento | R$2.152 e ~1,1 venda esperada viram lixo por falta de 5 mensagens |
| **Q2. Disparar os 24 emails de arquitetos** (1:1, 2 variações existentes; programa transparente, nunca RT oculta) | Operador (pós-inputs H6) | R$0 | 4-7 respostas (15-30% em outreach personalizado a essa senioridade), 1-2 conversas de especificação — uma especificação paga o trimestre | Resposta por email/variação | Canal de R$0 imune à bagunça de mídia segue morto |
| **Q3. Google sequenciado**: executar o veredito do H3; após 5-7d de recrawl da LP deployada, lance R$9-10 SÓ no ad group/keywords "Bilhar + Jantar" (CPC histórico R$9,83 = preço real de entrada) | Operador (lance = aval founder, é exceção justificada ao veto: lance no único termo com conversão + QS em conserto) | Realocação dos R$140/d | IS 10%→25-35% no ad group campeão; 4-8 cliques-WhatsApp/sem de intenção declarada. **Baseline do gate = conversas WhatsApp por termo, NÃO o CTR 13,4%** (que vai cair quando o IS subir — e deve) | IS semanal + search terms + origem tagueada na planilha | 90% do melhor leilão da conta segue jogado fora |
| **Q4. Gates da janela**: CPMsg-qualificado >R$150 → revisa criativo (não o geo); QS não sai de 2 em 14d pós-deploy → problema é a LP inteira | Operador | — | — | Planilha H5 | Pivô de pânico no dia 8 mata o diagnóstico |
| **Q5. Reunião de 21/Jul** — decisões COM dados: migrar p/ objetivo Leads/Q&A CTWA? pins micro de volta? form retorna (se Q1 absolver os leads)? adset Engaged (com massa acumulada)? | Founder + operador | R$0 | Backlog do dia 14 executado por evidência, não sentimento | Os 3 números do placar: qualificadas/sem + orçamentos/sem + minutos-até-1ª-resposta | Repetir o ciclo pivô→pânico→pivô |

### 60 DIAS (até ~início de setembro)

| Ação | Dono | Custo | Esperado | Risco se não fizer |
|---|---|---|---|---|
| **S1. Restaurar volume até o funil sustentar 2-3 vendas/mês** — com taxa 1,5%, isso exige voltar a ~130-200 leads/mês; escalar budget SÓ depois de 14 dias limpos com placar melhorando (soft +20-30%/d) | Founder aprova | Budget incremental | Vendas voltam ao patamar de maio em ago-set (lembrando o lag: o que se planta em jul colhe-se em set) | Julho de 40-60 conversas repete o zero em setembro |
| **S2. Fechar o sales feedback loop nas plataformas** — vendas offline sobem como sinal (Sale Closed Google / CAPI Meta) com datas e canal reais | Founder (passa vendas) + operador | R$0 | Otimização por conversão qualificada em vez de conversa bruta; destrava MaxConv Value no Google | ML das duas plataformas segue rotulado por exemplos lixo |
| **S3. Página educacional de categoria** ("mesa de sinuca e jantar: loja vs importada vs atelier") ancorada em R$30k — a resposta orgânica à BlackBall (Frente 3.1) | Operador | Baixo | Capturar de graça a demanda que hoje se disputa a 10% de IS | Concorrente segue educando a categoria sozinho |
| **S4. Programa de relacionamento com especificadores** formalizado (condição comercial transparente, catálogo, prazo de atelier) escalando a lista de 35 escritórios | Founder + operador | Baixo | Canal recorrente de R$30k+ (modelo Ornare/Artefacto, Frente 3.3) | Depender só de leilão num ticket que o BR vende por relacionamento |
| **S5. Calibração sazonal** — não creditar toda recuperação ao fix (2º semestre puxa móveis, Frente 3.2), nem punir o plano por julho fraco | Ambos | R$0 | Leitura honesta do que funcionou | Atribuição errada gera o pivô errado em outubro |

---

## 6. O QUE NÃO FAZER (refutado pelo conclave)

1. **NÃO culpar o CTWA pelo mês sem venda** — 3 dias e R$265 não causam 30 dias de zero; consertar a coisa errada é o erro nº1 na mesa (6/6).
2. **NÃO tocar em nada no Ads Manager antes de 21/Jul** após o lote de hoje — nem adset novo, nem budget shift, nem troca de objetivo. O 4º pivô em 6 semanas é a única coisa capaz de garantir que agosto seja pior (6/6; a conta "não morre de falta de ideia — morre se mexerem nela de novo no dia 5").
3. **NÃO criar adset de retargeting para os 76 leads** — audiência abaixo do mínimo de match, learning novo, mídia para um problema de inbox (proposto por Kim e Depesh, retirado por ambos na adversarial).
4. **NÃO pausar as Alta Intenção sem Ad Preview & Diagnosis** — RSAs de 3 dias podem estar só em review; pausar por palpite esconde o defeito (Sobral reviu).
5. **NÃO subir CPC geral, nem antes do deploy+recrawl da LP** — Ad Rank = lance × QS; lance sobre QS 2 é pagar 50% a mais pela mesma multa. A exceção aprovada é cirúrgica: só o ad group com conversão, só após o deploy.
6. **NÃO ancorar abaixo de R$30 mil** (R$25k/R$28k foram refutados) e **não** usar três números diferentes no funil — âncora abaixo do piso fabrica a negociação errada.
7. **NÃO fazer split test 38/38** — 5-7 respostas por braço é ruído com cara de ciência. A/B real roda no adset (impressões), não em 76 pessoas.
8. **NÃO escalar budget agora** — o gargalo é sinal + follow-up; escalar antes é encher balde furado (Depesh, sem contestação).
9. **NÃO voltar o form em paralelo ao CTWA** — dois eventos de otimização com <50 conv/sem cada = dois Learnings eternos. Um funil por vez; decisão em 21/Jul.
10. **NÃO oferecer projeto 3D grátis a toda conversa** — 3D é o prêmio de quem passa da âncora, senão o gargalo só muda do WhatsApp para o designer.
11. **NÃO usar wa.me como URL final no Google** — mata o GCLID e o rastreio; destino é a LP com botão WhatsApp. E **não** reativar criativo CTWA sem smoke test do sender (precedente: 99 conversas para o número errado).
12. **NÃO julgar o dia 14 contra maio nem por CTR** — a régua é sazonal (jun/jul é vale) e o CTR 13,4% é sobrevivente de IS 10%; o placar válido são os 3 números: conversas qualificadas/sem, orçamentos R$30k+/sem, minutos-até-1ª-resposta.
13. **NÃO pagar RT oculta a arquitetos** — infração no CAU; o canal se estrutura como programa transparente.

---

**Frase de fechamento do conclave (síntese das 6 vozes):** o zero de julho é aritmética de lag assinada em junho; a crise de agosto está sendo fabricada agora no CTWA Brasil-inteiro; e a diferença entre os dois cenários é **um dia de execução, treze dias de paciência, e um placar que finalmente existe** — com a pré-condição inegociável de saldo contínuo e os dois pipelines já pagos (76 leads + 24 arquitetos) trabalhados por palavras, não por mídia.