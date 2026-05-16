# Synkra CRM — Pitch interno para a equipe Tocks

**Para:** Equipe de vendas Tocks (Marcus + Cristina + Breno)
**De:** Breno (founder)
**Data:** 2026-05-16
**Duração estimada da leitura:** 90 segundos

---

## A dor que estamos pagando hoje

Em 30 dias rolando ads no Google + Meta + WhatsApp inbox + planilha de leads + Sales AI:

- **0 conversões registradas no Google Ads** apesar de R$1.300+ gastos em maio. As campanhas estão otimizando às cegas — o algoritmo não sabe quais cliques viraram vendas.
- **Sales AI desativado em 15/Mai** (você lembra). Que era o pedaço que deveria ligar "lead que respondeu no WhatsApp" com "venda fechada" e mandar pro Google.
- **3 sistemas diferentes** pra rastrear a mesma venda: Meta Ads Manager, Google Ads, planilha. Cada um conta diferente porque nenhum conversa com os outros. Você fala "fechei 4 vendas essa semana" — Meta diz que foram 2, Google diz 0, planilha diz 5.
- **Atribuição perdida = budget queimado.** Se a gente não sabe qual ad fez a venda, a gente paga mais caro pelo próximo lead. CPL Bretda dobrou de R$11 pra R$25-50 nas últimas 4 semanas em parte por isso.

## A solução em uma frase

**Um CRM próprio que entende WhatsApp e fala com Meta + Google nativamente, sem perder venda no meio do caminho.**

Não é mais um Pipedrive / RD Station / Bling. É uma ferramenta feita pra como **você** trabalha: leads chegam pelo WhatsApp via anúncio, você responde, qualifica, fecha — e o sistema, sozinho, conta isso pro Google e pro Meta com o valor real da venda.

## O que muda no seu dia-a-dia

| Hoje | Com o CRM novo |
|---|---|
| WhatsApp Web + planilha + Ads Manager separados | 1 inbox unificado com lead history + status |
| Você lembra de cabeça quem é hot | Pipeline kanban visual: leads → qualified → won/lost |
| Marca lead como "fechou" no celular, depois esquece de atualizar a planilha | Marcou no app, sistema fecha tudo: planilha + Google + Meta |
| "Quanto a gente gastou pra esse cliente?" — ninguém sabe | Cada deal mostra: ad de origem, custo do clique, ROI |
| Sales AI prometia automação, deu trabalho | Você no controle, IA opcional (não bloqueia trabalho manual) |

## Resultado mensurável que estamos perseguindo

| Métrica | Hoje | Meta 12 semanas | Meta 6 meses |
|---|---|---|---|
| % de vendas atribuídas corretamente Google | 0% | 80% | 95% |
| CPL Bretda (proxy de qualidade da atribuição) | R$35 | R$20 | R$12 |
| Tempo entre lead chegar e vendedor responder | ~hora | <5 min (notif push) | <2 min |
| Vendas que você fechou e esqueceu de marcar | "umas 2-3 por semana?" | 0 (notificação no fim do dia) | 0 |
| Sistemas pra abrir todo dia | 3+ | 1 | 1 |

**Conservador (50% de chance):** atribuição Google sobe pra 50%, CPL cai 15%. **Target (70%):** 80% atribuição, CPL cai 30%. **Agressivo (30%):** 95% atribuição, CPL cai 50% E descobrimos 2-3 vendedores podem virar 5 sem perder o controle.

## A parte do "moat" (por que isso vale o esforço)

Todo CRM brasileiro fala em "integração com Meta e Google". Quase ninguém faz direito. O que estamos construindo tem 3 coisas que ninguém mais entrega:

1. **Idempotência** — se o sistema cair no meio do envio, não duplica a conversão quando voltar
2. **Dead-letter queue** — se a venda não conseguir ser enviada pro Google na hora, ela vai pra fila de retry, e a gente sabe que está lá
3. **Reconcile diário** — toda noite o sistema compara "vendas que registramos" com "conversões que o Google viu" e dispara alerta se algo divergir mais de 5%

Isso é o que diferencia "CRM com integração Meta" de "CRM que confiavelmente alimenta o Google sem perder dado". A diferença vale a operação inteira.

## O que eu preciso de vocês na próxima semana

**5 conversas de 30 minutos**, uma pessoa por vez:

1. Como você acompanha um lead hoje, do clique até a venda? (Me mostra na tela)
2. Quais 3 coisas mais te irritam no fluxo atual?
3. Se você pudesse apertar UM botão e isso melhorasse uma coisa, qual seria?
4. Quando uma venda fecha, em quais lugares você precisa anotar?
5. Tem alguma coisa que você esperaria de um CRM moderno que nenhum tem?

Quero entender **antes de programar** o que importa pra vocês. Se sair daqui que vocês preferem o sistema atual com pequenos ajustes — eu paro o projeto e foco em outra coisa. Sério. É a única forma de não construir mais um sistema que ninguém usa.

## Cronograma resumido

- **Esta semana (Week 0):** 5 entrevistas + eu rodo eu mesmo o protótipo da Bridge por 1 dia pra sentir na pele
- **Week 1-2:** Fundação (database + auth + segurança multi-tenant)
- **Week 3-4:** WhatsApp inbox funcionando
- **Week 5-7:** Bridge Meta + Google (o "moat") + pipeline kanban
- **Week 8:** Pilot com Tocks — vocês rodam 5 dias, eu seguro a fila atrás
- **Week 9-12:** Migrar Bretda + melhorias + relatórios

Total: **12 semanas pra ter algo que substitui tudo o que usamos hoje.** 4 semanas extras de margem (a real é 16). Se passar de 16 semanas sem entregar valor, mato o projeto e vamos pra um Pipedrive bem configurado.

## Custo estimado mensal pós-launch

~R$400/mês infraestrutura + WhatsApp variável (R$0,05-0,10 por conversa). Para comparação: RD Station Marketing Lite seria R$2.700/mês pra esse uso, e ainda assim não resolveria o problema da Bridge.

## O que pode dar errado (e o plano)

- **Meta não aprova Business Verification** em 4 semanas → atrasa lançamento. Plano: começo pela API, escala depois.
- **Eu queimo (solo dev)** → cap de 30h/semana no projeto, aceito 16 semanas em vez de 12.
- **Vocês usam por 1 semana e voltam pro WhatsApp Web** → mato o projeto na Week 8. Se não é melhor, não é melhor.

## Próximo passo

Posso agendar as 5 entrevistas pra essa semana? **30 min cada, qualquer horário entre quarta e sexta serve.** Manda no WhatsApp os horários que cabem.

---

*Este pitch foi escrito porque você não tem (ainda) uma demo pra mostrar. Se tudo der certo, daqui a 8 semanas eu tô mostrando o pilot ao invés de pedindo paciência.*
