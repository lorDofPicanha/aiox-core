# Auditoria Bretda — 2 meses sem venda
**Data:** 23/Jul/2026 · **Autor:** traffic-masters-chief (squad `marketing-traffic`) · **Modo:** READ-ONLY, zero alteração nas contas
**Dado ao vivo:** puxado por Orion (aios-master) via mcp-ads-bridge + Graph API em 23/Jul. Google Ads: indisponível (OAuth 401).
**Contas:** Meta `act_381618241134624` ("Bretda Ads 01") · Google Ads `8167636084`

> Regra dura vigente: PROIBIDO valor de mesa em criativo Bretda; todo texto passa pelo founder antes de publicar
> (`feedback_bretda_copy_gate_sem_preco`, 07/Jul).

---

## 0. Sentença brutal — se só der pra fazer UMA coisa nas próximas 24h

**Entre no Gerenciador de Anúncios e SUBA O LIMITE DE GASTO DA CONTA — não é o saldo, é o `spend_cap` vitalício, hoje travado em R$36.344,66, exatamente igual ao total já gasto — e recarregue em seguida. A Bretda não anuncia desde 21/Jul; enquanto isso não for feito, nenhuma outra linha deste relatório existe.**

São **duas** ações separadas (cap E saldo). Recarregar sem subir o cap não destrava nada — é a terceira vez que isso acontece nesta conta (29/Jun, 18/Jul na Tocks, 23/Jul aqui). Gotcha `G-016`/`G-001`.

---

## 1. Estado das contas HOJE (23/Jul)

### Meta `act_381618241134624` — MORTA desde 21/Jul
| Campo | Valor | Leitura |
|---|---|---|
| `account_status` | 1 (ativa) | Não há bloqueio de política |
| `disable_reason` | 0 | Idem |
| `balance` | R$0,58 | — |
| `funding display_string` | "Saldo disponível (R$0,00 BRL)" | **Fonte de verdade** (G-016) |
| `spend_cap` | R$36.344,66 | **== `amount_spent` R$36.344,66** → teto vitalício cravado |
| Entrega 21/Jul | R$0,58 / 18 impressões / 0 conv | Agonia |
| Entrega 22–23/Jul | R$0,00 | Blackout total |

Campanhas seguem com status `ACTIVE` — isso **mascara** a conta morta. Ninguém vê "pausado" no painel; vê zero.

**Blackout no período 09–23/Jul (15 dias): 6 dias sem entrega efetiva** (11, 12, 13, 21 quase-zero, 22, 23) = **40% do tempo desligado**.

### Google Ads `8167636084` — CEGA
`ads_connection_test` em 23/Jul 12:28 UTC = **401 UNAUTHENTICATED**. OAuth morto desde ~14/Jul (9 dias). Gotcha `G-002`.
Consequência: **não sei se as campanhas do Google ainda estão gastando.** Estado conhecido em 04/Jul: Aquisição `23917032705` R$100/d + Bilhar Alta Intenção `23816403561` R$25/d + Jantar Alta Intenção `23821730147` R$15/d + Defesa de Marca R$10/d = **até R$150/d de potencial**, todos com URL final `api.whatsapp.com/...` (o que já matou a conversão web dessas campanhas).
→ **PENDENTE_DADO crítico: até R$1.350 podem ter sido queimados às cegas nos últimos 9 dias, ou zero.** Só o founder, olhando o faturamento no navegador, resolve isso. Ver F2.

---

## 2. Veredito — causa dos 2 meses sem venda

Antes dos pesos, uma separação que muda tudo e que os diagnósticos anteriores misturavam:

- **Pergunta A — o que fez as vendas PARAREM?** (causa da mudança)
- **Pergunta B — por que não conseguimos consertar?** (causa da cegueira)

Sinal de conversão inexistente é resposta de **B**, não de **A**: em maio o sinal já era igualmente cego e a Bretda vendeu 3 mesas. Cegueira não derruba venda — ela impede diagnosticar e impede o otimizador melhorar. Tratá-la como causa da queda foi um erro de ênfase meu nos relatórios de 07/Jul e 18/Jul; corrijo aqui.

### Pesos

| # | Causa | Peso | Confiança |
|---|---|---|---|
| 1 | Colapso de volume + instabilidade de entrega (blackout operacional) | **40%** | ALTA — dado direto |
| 2 | Downgrade do tipo de contato: form → CTWA sem requalificação | **20%** | MÉDIA — inferência fundamentada |
| 3 | Fadiga de criativo/audiência + fragmentação de aprendizado | **15%** | ALTA no dado, MÉDIA no peso |
| 4 | Funil WhatsApp / comercial (pós-clique) | **15%** | **BAIXA — chute informado, declarado como tal** |
| 5 | Cegueira de sinal de venda (multiplicador, não gatilho) | **10%** | ALTA no fato, o peso é arbitragem minha |

---

### (a) Blackout operacional e colapso de volume — **40%**

Este é o item com dado mais duro e é o maior.

**Aritmética que fecha o caso:**
- Maio: 196 leads → 3 vendas = **1,5% lead→venda** (`session_bretda_vendas_caem_3para1_29jun`).
- Junho: 86 leads (−56%) → 1 venda. **110 leads perdidos × 1,5% = 1,65 venda perdida.** É exatamente o tamanho da seca.
- Julho (30d 23/Jun–22/Jul): 99 conversas + 12 leads de form = **111 contatos**. A 1,5%, expectativa ≈ 1,7 venda; se a conversa CTWA converter a metade da taxa de um lead de form, expectativa ≈ 0,8.
- Gasto 30d R$2.178,76 = **R$72,63/d**, contra R$100–140/d de intenção orçamentária.

**Instabilidade documentada:** buracos 06–10/Jun, 24/Jun, 28/Jun, 11–13/Jul, 21–23/Jul. Somando só a janela de julho: 6 de 15 dias mortos.

**Consequência estatística que o founder precisa ouvir:** com ~111 contatos/mês e taxa 1,5%, a máquina está **dimensionada para 1 a 2 vendas/mês, sem margem para um mês ruim**. Zero venda em dois meses, com expectativa de ~1/mês, tem probabilidade de ~13,5% só por azar (Poisson λ=1/mês, e⁻²). **Não dá para distinguir "quebrado" de "azarado" nesse volume** — e é exatamente por isso que a resposta certa é volume estável, não mais um pivô.

---

### (b) Downgrade do tipo de contato (form → CTWA) — **20%**

Série 90d, custo por CONTATO por motor:
| Motor | Gasto 90d | Contatos | Custo unitário |
|---|---|---|---|
| `[C] CP2` form nativo | R$2.379,66 | 192 leads | R$12,39 |
| `[QUALIDADE]` Alta Intenção form | R$3.123,82 | 119 leads | R$26,25 |
| `[CTWA]` WhatsApp | R$1.493,19 | 99 conversas | R$15,08 |
| `[C] CP1` | R$199,33 | 8 leads | R$24,92 |
| BRETDA Coleção Website | R$192,71 | 591 LPV / **0 lead** | — |

Uma "conversa iniciada" é um **toque no botão do WhatsApp**: sem nome, sem qualificação, sem intenção declarada. Um lead de form nativo chega com nome, telefone e respostas. **Os dois custam quase o mesmo (R$15,08 vs R$12,39) mas não valem o mesmo.** O pivô de 04/Jul trocou o motor por um de intenção mais rasa pelo mesmo preço, e a expectativa de venda por contato caiu junto.

⚠️ **Honestidade:** não temos taxa conversa→venda histórica da Bretda (PENDENTE_DADO). O peso de 20% é **inferência fundamentada, não medição**. Pode ser 10% (se conversa converter igual a lead) ou 30% (se converter a 1/3).

---

### (c) Fadiga de criativo/audiência + fragmentação — **15%**

**Tendência 7d (16–22/Jul) vs 30d — está piorando enquanto se gasta mais por dia:**
| Métrica | 30d | 7d | Δ |
|---|---|---|---|
| Custo/conversa | R$15,08 | **R$20,25** | **+34%** |
| CPC | R$1,68 | R$2,28 | +36% |
| CTR | 2,89% | 2,35% | −19% |
| Frequência | 1,68 (30d) | **1,62 em 7 dias** | saturação |
| depth_3msg | 37 (30d) | 5 | −86% |

Frequência de 1,62 acumulada em **7 dias** contra 1,68 em **30 dias** significa que quase toda a repetição aconteceu na última semana: o público efetivamente alcançável é pequeno e foi varrido rápido. CPM R$52,04 hoje contra R$21,62 em maio e R$43,73 em junho — **o público está 2,4× mais caro que em maio.**

**Fragmentação: 9 criativos num adset de R$50/d.**
| Ad | Gasto 30d | Conv | Custo/conv |
|---|---|---|---|
| Citrino | R$800,32 | 48 | R$16,67 |
| Aurora-WhatsApp | R$297,79 | 30 | **R$9,93** ← melhor com volume |
| Carrossel-Modelos | R$296,39 | 11 | **R$26,94** ← pior com volume |
| Opal-WhatsApp | R$47,25 | 8 | R$5,91 (subamostrado) |
| Zurita-Modelos | R$25,10 | **0** | — |
| Opal-Modelos | R$11,77 | 1 | — |
| Aurora-Modelos | R$9,94 | **0** | CTR 0,65% — pior da conta |
| Aurora-Ancora30k | R$1,63 | 0 | — |
| Opal-Ancora30k | R$3,00 | 0 | — |

Citrino levou **36,7% do gasto da conta inteira** e 53,6% do adset. Se aqueles R$800,32 tivessem rodado à eficiência do Aurora (R$9,93), teriam produzido ~80 conversas em vez de 48 — **~R$324 e ~32 contatos deixados na mesa** (direcional; n=30 vs n=48 tem ruído, mas o gap de 68% é grande demais para ser só ruído). Isso é o padrão `G-008` invertido: o Meta elegeu um herói mediano e matou de fome os dois mais eficientes.

**O adset zumbi (achado novo):** campanha `120249740513770737` / adset `120249740546070737`, criada 09/Jul, `ACTIVE`, R$50/d, `effective_status` ACTIVE, 2 ads ACTIVE não reprovados → **R$0,00 e ZERO impressão em 14 dias.** Ou seja: **desde 09/Jul metade da intenção orçamentária da conta simplesmente não existia** (~R$700 de capacidade alocada e nunca usada). Hipótese mais provável: audiência empilhada (LAL 1% ∩ 29 cidades ∩ 9 bairros ∩ 40–65) + auto-canibalização com o adset LAL Brasil, que contém integralmente o público do novo (`G-009`). É a **terceira** vez que empilhar filtro mata entrega nesta conta — em 29/Jun isso dobrou o CPM e cortou 66% do alcance.

⚠️ Os 2 ads desse adset (`Aurora-Ancora30k`, `Opal-Ancora30k`) carregam **"a partir de R$30 mil" no corpo** — criados/copiados em 09/Jul, **2 dias depois** do gate de copy do founder (07/Jul). Violação de governança, além de inúteis (R$4,63 somados, 0 conv).

**Reset de aprendizado auto-infligido:** `last_sig_edit` dos DOIS adsets = 22/Jul ~12:37 e ~12:46 BRT — edições significativas feitas **em cima de uma conta que já não entregava desde 21/Jul**. Quando o dinheiro voltar, os dois adsets recomeçam a fase de aprendizado do zero. Custo: 5–7 dias (`G-004`).

---

### (d) Funil WhatsApp / comercial — **15%, e este número é CHUTE**

Declaro explicitamente: **este é o único peso do relatório que não se apoia em dado suficiente.** Pode ser 5% (se as 99 conversas eram todas fora de perfil) ou 35% (se havia comprador real mal atendido). O que sustenta um peso não-zero é apenas: 66 conversas chegaram a 2+ mensagens e 37 a 3+ em 30 dias, e nenhuma virou venda nem orçamento rastreado; e os 12 leads de form do período não têm cadência documentada. Ver §3 para por que os números disponíveis não permitem acusar nem absolver.

---

### (e) Cegueira de sinal — **10% como gatilho, multiplicador de todo o resto**

- 90d: **R$7.388,71 → 0 venda rastreada.** As 4 vendas conhecidas (3 mai + 1 jun) são offline e invisíveis.
- `Sale Closed (Offline OC)` no Google nunca casou upload (tentativa 18/Jun: 33/33 recebidas, match não confirmado).
- O Meta otimiza para "conversa iniciada barata" — nunca recebe de volta quem comprou (`G-007`, `G-017`).
- **Isto explica a degradação progressiva do custo por contato ao longo do trimestre: R$12,39 → R$58,76 = 4,74×.** Sem sinal de valor, cada reotimização desce um degrau na escala de intenção, buscando o clique mais barato.

Não derrubou a venda. Garante que a gente não consiga provar nem consertar nada — e que a conta piore sozinha com o tempo.

---

## 3. O que mudou desde meu diagnóstico de 18/Jul

**A conclusão de 18/Jul segue de pé, mas foi REBAIXADA de prioridade operacional. O blackout de 21/Jul reordena tudo.**

| 18/Jul dizia | 23/Jul |
|---|---|
| "LAL não é o culpado — entrega saudável a R$14/conversa" | **CONFIRMADO e reforçado.** O adset LAL é o único que entrega. 30d R$15,08/conversa, CTR 2,89%. |
| "Causa-raiz = sinal inexistente + funil WhatsApp" | **Correto como doença crônica, errado como prioridade.** Reclassificado: sinal = causa da cegueira (B), não da queda (A). |
| "Cortar R$120–170/d de Google cego" | **Parcialmente sem efeito.** Não posso cortar nada: OAuth 401. E se o Google estiver gastando, é o founder quem tem que pausar no navegador. |
| Conta viva a ~R$135/d | **MORTA desde 21/Jul.** Cap vitalício batido + saldo R$0,58. |

**Três achados que não existiam em 18/Jul:**

1. **Blackout de conta (21/Jul).** Não é falta de saldo apenas — é `spend_cap` vitalício cravado. Sem isso, todo o resto é teatro.
2. **Adset zumbi desde 09/Jul.** A conta operava com **metade** da intenção orçamentária havia 14 dias e ninguém viu, porque o painel mostrava `ACTIVE`.
3. **Reset de aprendizado em 22/Jul** sobre conta morta — dano que ainda vai ser cobrado quando o dinheiro voltar.

**Nova ordem de prioridade:** (1) restaurar entrega e estancar vazamento cego no Google → (2) parar de resetar aprendizado → (3) consolidar criativo/adset → (4) sinal de venda e WhatsApp.

---

## 4. Leitura crítica do funil de conversa

Sequência reportada: **99 conversas → 98 first_reply → 66 depth_2 → 37 depth_3 → 41 depth_5 → 1 `messaging_conversation_replied_7d` → 0 venda.**

### Isto NÃO é um funil. Não apresente como funil.
**`depth_5msg` (41) é MAIOR que `depth_3msg` (37).** Um funil não pode alargar. A violação de monotonicidade prova que essas métricas não são "conversas únicas que atingiram profundidade X" — são contagens de evento que podem inflar com a mesma pessoa (mesmo padrão que documentei na Tocks em `session_tocks_meta_sangria_18jun`). Qualquer conclusão baseada na cadeia 99→66→37→41 é inválida.

### O que `messaging_conversation_replied_7d = 1` PERMITE concluir
Praticamente nada sobre o comercial. Motivo: no **mesmo pull**, `first_reply = 98` sobre 99 conversas. Duas métricas que supostamente medem "alguém respondeu" não podem valer 98 e 1 sob a mesma definição. Uma das duas mede outra coisa, ou está quebrada/deprecada. **`replied_7d=1` é evidência inutilizável, não é evidência de abandono.**

### O que `first_reply = 98` também NÃO permite concluir
Que o comercial responde. Em 07/Jul instalamos `page_welcome_message` VISUAL_EDITOR com 4 ice breakers no fluxo CTWA. **Uma mensagem de boas-vindas automática pode estar registrando como "primeira resposta do negócio" em praticamente toda conversa** — o que explicaria 98/99 (99%), um número alto demais para atendimento humano real. Se for isso, `first_reply` mede a automação, não uma pessoa.

**Conclusão honesta: os dados de plataforma não convictam nem absolvem o comercial. Empate técnico. Quem afirmar qualquer das duas coisas está inventando.**

### O que o dado permite dizer (direcional, fraco)
Um terço das conversas morre antes do segundo turno. Isso é compatível com pelo menos três hipóteses mutuamente exclusivas que a plataforma não distingue: (i) clique de curiosidade sem intenção (típico de CTWA), (ii) abertura/welcome message fraca, (iii) primeira resposta humana lenta demais para um impulso de R$30k.

### A verificação que CRAVA (única, barata, definitiva)
Exportar as conversas do WhatsApp `5547992259554` da janela de 30d e classificar as ~99 em **4 colunas**:
1. **Respondeu por humano?** (S/N — ignorar a automática)
2. **Tempo até a 1ª resposta humana** (minutos)
3. **Perfil** (comprador real / curioso / fora de faixa / arquiteto / revenda)
4. **Desfecho** (orçamento enviado / sumiu / não-fit / em andamento)

N=99 é amostra suficiente para encerrar o debate em uma tarde. Complemento gratuito: a taxa e o tempo de resposta que o próprio Meta mostra na Caixa de Entrada da Página. **Esta é a 4ª vez que a auditoria de conversas aparece como P0 e nunca foi feita** (07/Jul, 18/Jul na Tocks, 18/Jul aqui, agora). Enquanto não for feita, 15 pontos percentuais do meu diagnóstico continuam sendo chute — e eu vou continuar dizendo que são.

---

## 5. Plano priorizado

### [FOUNDER-ONLY] — nada abaixo disso pode ser feito por mim

| # | Ação exata | Objeto | Número esperado | Sucesso / Kill |
|---|---|---|---|---|
| **F1** | **Subir o `spend_cap` vitalício E recarregar saldo.** São 2 ações distintas no Gerenciador. | `act_381618241134624` | Cap ≥ R$46.000 (folga ~R$10k) e saldo ≥ R$1.400 (runway 14d a R$100/d) | ✅ `spend_cap − amount_spent ≥ R$1.400` **E** `display_string > R$0,00`. ❌ Se só recarregar sem mexer no cap: entrega segue zero — teste imediato = impressões > 0 em 2h |
| **F2** | **Abrir a conta Google no navegador** e verificar: campanhas ainda ENABLED? Gasto dos últimos 9 dias? | `8167636084` — Aquisição `23917032705`, Bilhar `23816403561`, Jantar `23821730147`, Defesa de Marca | Até R$150/d de exposição. Real: PENDENTE_DADO | Se estiver gastando: **pausar tudo exceto Defesa de Marca R$10/d** (`G-018`: Defesa é a ÚLTIMA a pausar). ✅ Print do gasto 30d + status de cada campanha |
| **F3** | **Reautenticar OAuth Google Ads** (fluxo no navegador) | conta `8167636084` | — | ✅ `ads_connection_test` retorna 200. Sem isso não existe ação minha no Google |
| **F4** | **Passar datas + canal + valor das vendas conhecidas** (3 mai + 1 jun) e a **data exata da última venda** | — | 4 linhas de planilha | ✅ Permite (i) confirmar se são mesmo 2 meses, (ii) semear upload offline, (iii) calcular o lag real. Hoje "2 meses" conflita com "1 venda em junho" — PENDENTE_DADO |
| **F5** | **Auditar as ~99 conversas do WhatsApp** conforme §4 (4 colunas) | `5547992259554` | 99 linhas | ✅ Fecha os 15% de chute do diagnóstico. ❌ Não fazer = continuar decidindo no escuro pelo 4º mês |
| **F6** | **Definir e informar:** quem atende, horário, e tempo-alvo de 1ª resposta humana | — | — | ✅ SLA escrito. Referência: impulso de alto ticket morre em minutos, não horas |
| **F7** | **Aprovar a exceção à regra dos 5 criativos** (ver O3 — conflito real, decisão dele) | — | — | ✅ Sim/não explícito |

### [OPERADOR com aval 1×1] — **NADA roda antes de F1 concluído**

Regra de ouro desta fase: **enquanto a conta estiver sem saldo, toda edição é um reset de aprendizado que só será cobrado depois.** Foi o erro de 22/Jul. Não repetir.

| # | Ação exata | Objeto | Número esperado | Sucesso / Kill |
|---|---|---|---|---|
| **O1** | **PAUSE do adset zumbi + sua campanha.** Motivos: R$0/14d, 0 impressão, e os 2 ads violam o gate de preço | camp `120249740513770737` + adset `120249740546070737` + ads `Aurora-Ancora30k`, `Opal-Ancora30k` | Devolve R$50/d de intenção orçamentária ao adset que entrega | ✅ Ambos `PAUSED`; 100% do budget efetivo no adset vivo |
| **O2** | **Consolidar em UM adset, R$100/d** | adset `120249597117640737` (LAL 1% + 37 cidades + 10 bairros, `home`) | A R$15,08/conversa → 6,6 conv/d → **46/semana**. A R$20,25 (7d atual) → 4,9/d → **34/semana** | ⚠️ **Aviso honesto: R$100/d NÃO garante sair do Learning.** A régua do Meta é 50 eventos/semana; ao custo dos últimos 7 dias seriam necessários **R$145/d**. Founder decide: R$100/d aceitando Learning permanente, ou R$145/d para fechar o aprendizado. Ambos exigem F1 com runway |
| **O3** | **Enxugar 9 → 4 criativos** no adset. **Manter:** Aurora-WhatsApp (R$9,93/30 conv), Citrino (R$16,67/48 conv), Opal-WhatsApp (R$5,91/8 conv, challenger). **Pausar:** Carrossel-Modelos (R$26,94), Zurita-Modelos (0 conv), Aurora-Modelos (0 conv, CTR 0,65%), Opal-Modelos (1 conv), 2× Ancora30k (preço) | ads do adset `120249597117640737` | Realoca ~R$330/mês dos piores para os melhores | ✅ 7d após reinício: custo/conversa ≤ R$15 **e** CTR ≥ 2,8%. ❌ Kill: custo/conversa > R$22 por 5 dias com entrega ≥ R$80/d → criativo esgotado, precisa material novo do founder (não mais ajuste) |
| **O4** | **CADEADO DE APRENDIZADO: zero edições por 10–14 dias** após O1–O3 | conta inteira | — | ✅ `last_sig_edit` inalterado até 06/Ago. Cada edição = −5 a 7 dias |
| **O5** | **Necromancia dos leads mortos** — cadência 1:1 manual (zero mídia): 12 leads de form dos últimos 30d + os 76 antigos. Texto passa pelo founder | — | Custo R$0 | ✅ É a **única** fonte de venda possível nos próximos 14 dias enquanto a mídia reinicia. Gate: <8% de resposta = o form não sustenta este ticket |
| **O6** | **Instrumentação mínima de venda** — planilha 5 colunas (data, nome, telefone/email, canal, valor) → base para upload offline no Meta (Custom Audience de compradores + evento offline) e ECL no Google quando F3 voltar | — | ≥ 4 linhas iniciais (F4) | ✅ Sem isso, agosto repete julho. É o conserto da cegueira (`G-007`, `G-017`) |

**Sequência obrigatória:** F1 → O1 → O2+O3 no MESMO dia (uma única janela de edição) → O4 cadeado 10–14d. F2/F3 e F5 correm em paralelo, não bloqueiam. O5 começa hoje, independe de tudo.

### ⚠️ Conflito de regra que precisa da decisão do founder (F7)
Em 07/Jul o founder determinou: **"APENAS estes 5 criativos rodando"** (Carrossel geral + Citrino + Opal + Aurora + Zurita). Mas na conta rodam 9, e **o melhor anúncio da conta — Aurora-WhatsApp, R$9,93/conversa, 30 conversas — NÃO está nessa lista de 5** (é o original CTWA de 04/Jul). Aplicar a regra ao pé da letra **mata o melhor anúncio** e mantém o Carrossel-Modelos, que é o pior com volume (R$26,94). Não executo O3 sem que ele decida isso explicitamente.

---

## 6. O que NÃO fazer — armadilhas que os dados desmentem

1. **NÃO culpar o Lookalike nem trocar por Advantage+/broad agora.** O adset LAL entrega a R$15,08/conversa com CTR 2,89% — é o único que entrega. Na Tocks, o público broad SEM lookalike (C007) foi o mais barato da conta **e também não fechou venda** (18/Jul). Público não é a variável.
2. **NÃO aumentar budget "pra compensar".** Com o cap batido não existe budget. E a R$20,25/conversa com frequência 1,62 em 7 dias, mais dinheiro no mesmo público só acelera a fadiga (`G-004`).
3. **NÃO ler 99→66→37→1 como funil, nem concluir que o comercial não responde.** `depth_5` (41) > `depth_3` (37) invalida a série; `first_reply=98` contradiz `replied_7d=1`; e a welcome message automática pode estar inflando o `first_reply`. Empate técnico — só o export do WhatsApp resolve.
4. **NÃO recriar o adset "premium" estreito.** O de 09/Jul (LAL ∩ 29 cidades ∩ 9 bairros ∩ 40–65) entregou **ZERO em 14 dias**. Terceira ocorrência do mesmo erro nesta conta — em 29/Jun empilhar filtro dobrou o CPM e cortou 66% do alcance.
5. **NÃO subir criativo com preço.** Viola o gate de 07/Jul, e os 2 que existem gastaram R$4,63 somados com 0 conversa — nem funcionam.
6. **NÃO editar nada enquanto a conta estiver sem saldo.** Cada edição carimba `last_sig_edit` e reseta o aprendizado, cobrado quando o dinheiro voltar. Foi literalmente o que aconteceu em 22/Jul.
7. **NÃO tocar em Google antes do OAuth voltar.** Ação cega em conta cega. E o que precisa ser feito lá agora (pausar possível vazamento) é do founder, no navegador.
8. **NÃO concluir "o CTWA não presta" a partir de 2 meses.** Ao volume atual a expectativa matemática é ~1 venda/mês; zero em dois meses acontece por puro azar em ~13,5% dos casos. O sistema é pequeno demais para distinguir quebrado de azarado. **O 5º pivô em 8 semanas é a armadilha mais cara deste caso** — 29/Jun já documentou que mudar 3 variáveis ao mesmo tempo tornou tudo indiagnosticável.
9. **NÃO reabrir o motor de form em paralelo ao CTWA agora.** Dividir R$100/d em dois motores garante que nenhum dos dois saia do Learning. Se for para voltar ao form, é **substituição** com janela limpa, decidida com os dados de F5 — não paralelo.

---

## 7. PENDENTE_DADO — o que eu não sei e não vou inventar

| # | Lacuna | Por que importa | Quem resolve |
|---|---|---|---|
| P1 | **Data exata da última venda.** "2 meses sem venda" (founder, 23/Jul → última ≈ 23/Mai) conflita com "1 mesa em junho" (`session_bretda_vendas_caem_3para1_29jun`) | Muda toda a matemática do lag e o ponto de corte do diagnóstico | F4 |
| P2 | **Gasto do Google Ads nos últimos 9 dias e status das campanhas** | Exposição de até R$150/d completamente cega desde ~14/Jul | F2 |
| P3 | **Gasto diário POR ADSET nos últimos 14d** | O dia-a-dia mostra R$113–173/d numa campanha cujo adset está listado a R$50/d. Ou o budget foi reduzido recentemente, ou o adset `[QUALIDADE] Pins` ainda rodava em 14–20/Jul. Determina se R$100/d é aumento ou corte | Orion (novo pull) |
| P4 | **Taxa conversa→venda histórica** da Bretda | Sem ela, o peso de 20% da causa (b) é inferência, não medição | F4 + F5 |
| P5 | **Motivo técnico do adset zumbi entregar zero** | Minha hipótese é sobreposição/canibalização com o adset LAL Brasil (`G-009`). Não confirmei — falta `meta_ads_audience_overlap` e o `delivery_status`/`recommendation` do adset | Orion (novo pull) ou irrelevante se O1 for aprovado (pausa resolve) |
| P6 | **Se a `page_welcome_message` conta como `first_reply`** | Determina se `first_reply=98` mede humano ou automação — muda a leitura do funil | F5 (o export mostra quem escreveu) |
| P7 | **Onde foram parar os 12 leads de form dos 30d** | 12 contatos com nome e telefone, ticket R$30k — nenhum registro de cadência | F5 / O5 |

---

## 8. Anexo — aritmética verificável

```
30d (23/Jun–22/Jul)
  Gasto conta ............ R$2.178,76  (= 1.493,19 + 470,07 + 108,44 + 107,06 ✓ fecha)
  Gasto/dia .............. R$72,63
  Contatos ............... 99 conversas + 12 leads = 111
  Custo/contato médio .... R$19,63

Janela 09–23/Jul (15 dias)
  Dias com entrega ....... 9   (09,10,14,15,16,17,18,19,20)
  Dias mortos ............ 6   (11,12,13,21≈0,22,23)  = 40% do tempo
  Soma do dia-a-dia ...... R$1.043,61

7d (16–22/Jul)
  Gasto .................. R$567,09  (R$81/d)
  Conversas .............. 28 @ R$20,25   (vs R$15,08 nos 30d = +34%)

Matemática da venda (taxa histórica 1,5% lead→venda, maio: 196 leads → 3 vendas)
  Junho: 110 leads perdidos × 1,5% ........... = 1,65 venda perdida
  Julho: 111 contatos × 1,5% ................. = 1,7 venda esperada (0,8 se conversa valer metade)
  Para 3 vendas/mês ....... 200 contatos/mês × R$15,08 = R$3.016/mês = R$100,5/d SEM buracos
  P(0 venda em 2 meses | λ=1/mês) = e⁻² ...... = 13,5%   → não distinguível de azar

Learning phase (régua Meta: 50 eventos/semana por adset)
  A R$15,08/conversa → R$100/d = 46/sem  → ainda abaixo
  A R$20,25/conversa → R$100/d = 34/sem  → bem abaixo
  Para 50/sem a R$20,25 .................... = R$145/d

Realocação de criativo (direcional)
  Citrino:  R$800,32 / 48 conv @ R$16,67
  À eficiência do Aurora (R$9,93): 48 conv custariam R$476,64
  Diferença .......................... R$323,68 e ~32 conversas não geradas

90d (24/Abr–22/Jul)
  Gasto .................. R$7.388,71
  Vendas rastreadas ...... 0
  Degradação do custo por contato: R$12,39 → R$58,76 = 4,74×
```

---

## 9. Governança desta auditoria

- **Zero escrita.** Nenhuma chamada de API de escrita foi feita ou autorizada por este documento.
- **Gate Jarvis:** não disparado nesta sessão porque nenhuma operação de escrita está sendo executada. O gate de auto-consulta dispara no momento da aprovação de O1/O2/O3, não agora.
- **Gotchas aplicáveis:** `G-001` (saldo sem alarme), `G-002` (OAuth), `G-004` (reset de aprendizado), `G-007` (otimização cega), `G-008` (herói único), `G-009` (sobreposição de audiência), `G-016` (`display_string`, não `balance`), `G-017` (LAL deve ser de compradores), `G-018` (Defesa de Marca é a última a pausar).
- **Copy gate:** nenhum texto novo é proposto aqui. O5 (cadência 1:1) e qualquer criativo futuro passam pelo founder antes de publicar.

**Referências de contexto:** `session_crise_trafego_diag_18jul` · `session_bretda_conclave_zero_vendas_07jul` · `session_bretda_vendas_caem_3para1_29jun` · `project_bretda_meta_consolidacao_test_26jun` · `feedback_bretda_copy_gate_sem_preco`
