# Buscador de Licitações DF + Águas Lindas-GO

> **Status:** Em definição. Pronto para construir. Pronto para debate.
> **Data:** 15 de maio de 2026
> **Para quem este documento serve:** o amigo (a pessoa que vai usar), o Breno (que vai construir), e qualquer pessoa que entre na conversa.

---

## 🎯 EM 30 SEGUNDOS

Existe um portal nacional do governo que publica TODAS as licitações públicas do Brasil — chama-se PNCP. Hoje, quem trabalha com licitação fica refrescando esse site, ou paga R$400-1.500/mês para softwares como Effecti que "vasculham" tudo pra você. O problema: essas ferramentas são pensadas pra empresas grandes nacionais. Microempresa que vende pro governo de Brasília + região não tem ferramenta feita pra ela.

Estamos construindo essa ferramenta. Foco em DF + Águas Lindas-GO. Avisa por WhatsApp e email. Resume cada edital em 5 linhas pro fornecedor decidir rápido se vale ou não participar. Não pretende competir com ferramentas grandes — pretende ser **a melhor ferramenta para o nicho regional**.

---

## 📖 EM 2 MINUTOS — A história do problema

### O cenário do amigo hoje

Imagine que você tem uma empresa pequena ou média que vende pro governo. Pode ser obra, pode ser produto, pode ser serviço — não importa.

Todo dia o governo abre licitações novas. Algumas servem pra você, a maioria não. Pra saber quais servem, hoje você tem 3 opções:

**Opção 1 — Manual.** Entrar no site do PNCP, no Compras.gov, no portal de Compras DF, no portal da prefeitura de Águas Lindas, e ficar caçando à mão. Demora horas, e você sempre perde alguma. Estima-se que 50-70% dos fornecedores fazem assim.

**Opção 2 — Pagar uma ferramenta nacional.** Effecti, ConLicitação, LicitaNet, Sollicita. Custam de R$45 a R$1.500 por mês. Funcionam — mas foram feitas pra empresa grande, com filtros genéricos, pricing alto, suporte que demora. Quem é microempresa paga muito por feature que não usa.

**Opção 3 — Grupos de WhatsApp.** Indicação informal. "Olha, saiu edital de X no município Y." Útil, mas espalhado, sem busca, sem filtro, depende dos contatos.

### A dor real

Quando você perde uma licitação que daria certo, você não sabe. Ela passou. O prazo de inscrição já fechou. Custo da oportunidade perdida pode ser R$5.000, R$50.000, R$500.000 — depende do tamanho.

E o pior: **as ferramentas grandes não cobrem direito municípios pequenos**. Águas Lindas-GO publica licitação? Provavelmente sim, mas espalhada entre o portal próprio da prefeitura e o PNCP. Nenhuma ferramenta nacional foca em destrinchar isso.

---

## 🧭 EM 5 MINUTOS — O que estamos construindo

### Em uma frase

**Um buscador de licitações públicas hiper-regional, focado em DF + Águas Lindas-GO + entorno, que avisa o fornecedor pelos canais que ele já usa (WhatsApp, email), com resumo em 5 linhas de cada edital relevante.**

### Em uma analogia

É como se você tivesse um **assistente que acorda 6 da manhã todo dia, lê o jornal oficial da União, da Câmara, dos órgãos do DF, da Prefeitura de Águas Lindas, escolhe só as oportunidades que importam pra você, escreve um resuminho de cada uma, e te manda no WhatsApp no horário que você combinar**.

A diferença pra um assistente humano: este assistente não dorme, custa R$0-99/mês em vez de R$3.000/mês de salário, e nunca esquece de checar a Câmara Legislativa enquanto checa o PNCP.

### Como funciona pro usuário (uma manhã típica)

**6h30 da manhã.** Você acorda. Toma café.

**7h00.** Você recebe um email com 3 oportunidades novas de ontem-pra-hoje. Cada uma tem:
- **O que é** (em uma frase): "Compra de 200 cadeiras escritório para Secretaria de Saúde DF"
- **Quanto vale**: "Valor estimado: R$ 145.000"
- **Quando**: "Prazo para enviar proposta: 22/05/2026 às 14h"
- **Requisitos críticos**: "Precisa de certidão SICAF, capital social mínimo R$ 50.000, mostra atestado de 3 anos de experiência"
- **Match**: "85% match com seu perfil (CNAE certo, valor na sua faixa, geo DF)"
- **Link**: "Abrir edital completo no PNCP →"

**8h00.** Você abre a primeira. Tem 80 páginas de PDF jurídico. Você clica em "fazer pergunta" e digita: *"qual o prazo de entrega e onde é a entrega?"*. O assistente responde em 2 segundos: *"Prazo: 30 dias após assinatura. Entrega: Setor Comercial Sul, Brasília-DF, no almoxarifado central."*

**Você decide:** vou participar dessa, vou ignorar a outra. Em 15 minutos você fez o que antes te tomava 2 horas.

### Sobre o WhatsApp

Algumas oportunidades são "Tier S" — combinação perfeita do seu perfil + alto valor + prazo curto. Essas o assistente manda também no WhatsApp na hora que aparecem. Limite: 1 mensagem por dia no máximo. Sem spam.

---

## 🏗️ COMO FUNCIONA POR TRÁS (sem código)

### Os ingredientes

**1. As fontes de dados** — de onde tiramos os editais:
- PNCP (Portal Nacional, obrigatório por lei desde 2021) — é a fonte principal, cobre ~80% do volume
- Compras.gov (federal) — complemento
- Portal de Compras DF (governo do DF) — específico do DF
- Portal da Prefeitura de Águas Lindas — específico municipal
- Outros portais menores conforme aparecerem

**2. O filtro inteligente** — o que decide o que mostrar pra você:
- O seu **perfil** (CNAE da sua empresa, valor de licitação que faz sentido pra você, geografia, palavras-chave positivas e negativas)
- O **conteúdo do edital** (o que está sendo comprado, valor, prazo, requisitos)
- O **match** (combinação dos dois — usa IA + busca tradicional)

**3. A IA que lê os PDFs** — usamos o **Claude Haiku 4.5** (modelo da Anthropic) pra ler o edital completo e te dar:
- Resumo executivo em 5 bullets
- Resposta a perguntas que você faz sobre o edital ("qual a garantia exigida?", "tem que ter sede no DF?")

**4. Os canais de aviso:**
- Email diário (todo dia 7h)
- WhatsApp (só Tier S, máximo 1/dia)
- Notificação no navegador (opcional)
- Dashboard web pra acessar histórico, filtros, edital completo

### O fluxo simplificado

```
Governo publica edital → Nosso assistente ingere via API/scraping (5-15 min depois)
→ Filtra por perfil de cada usuário
→ Pra Tier S: roda IA pra fazer resumo + tags
→ Manda email/WhatsApp pro usuário relevante
→ Usuário decide se participa
```

Tudo isso roda automático, 24/7. Não precisa de ninguém apertando botão.

---

## ⚔️ POR QUE VAI SER MELHOR QUE O QUE EXISTE

### Comparação direta

| O que você precisa | Manual (PNCP refresh) | Effecti (R$400-1.500/mês) | Sollicita (R$45/mês) | NOSSO BUSCADOR |
|---|---|---|---|---|
| **Cobertura DF + Águas Lindas** | Você que tem que olhar 5 portais | Cobre federal/estadual, municipal raro | Foco volume nacional | **Foco regional explícito** |
| **WhatsApp como canal** | Não tem | Não nativo, suporte ineficiente | Não | **Sim, dia 1** |
| **Resumo IA do edital** | Não tem (você lê o PDF) | Em testes (novo) | Não | **Sim, Claude Haiku 4.5** |
| **Chat com o edital** | Não existe | Não tem | Não | **Sim** (você pergunta, IA responde) |
| **Preço** | "Grátis" mas custa tempo | R$400-1.500/mês | R$45/mês | **R$0 (foco qualidade, não monetização agora)** |
| **Privacidade (CPF de sócios)** | Você nem vê o problema | Não tratado | Não tratado | **Mascarado automaticamente** |
| **Padrão global (OCDS)** | N/A | Não | Não | **Sim** (compatível padrão internacional) |
| **Tempo perdido por dia** | 1-2 horas | 30 min | 30 min | **5-10 minutos** |

### Por que existem essas ferramentas grandes e ainda assim cabe espaço

Effecti, ConLicitação e similares são **horizontais** — atendem fornecedor de móveis em SP, de uniforme em Recife, de obra em Manaus. A ferramenta deles é genérica. Funciona, mas não conhece a peculiaridade do DF (que é uma capital com economia muito orientada ao governo) nem cobre municípios pequenos como Águas Lindas-GO (54 mil habitantes, mas vizinha do DF, com fornecedores que vendem pros dois).

**A aposta é simples:** uma ferramenta hiper-regional bem feita resolve melhor a vida de um fornecedor DF do que uma ferramenta nacional genérica. Vertical > horizontal quando o vertical tem características próprias.

---

## 🧪 O QUE TORNA ESTE PROJETO DIFERENTE

### 1. Foco regional explícito (não é "filtro geo", é posicionamento)
Hoje, **nenhum competidor** declara foco regional DF/Centro-Oeste. Existem 5+ players nacionais (Effecti, ConLicitação, LicitaNet, Sollicita, Licitar Digital) e 6+ startups novas de IA (Licitei, LicitaIA, LicitaFree). Nenhum tem "Brasília" no posicionamento.

### 2. WhatsApp como canal principal (não emergência)
Em pesquisa global, NENHUM player europeu ou americano usa WhatsApp como notificação primária — Mercell (líder do norte da Europa) só usa email. **Mas no Brasil/LATAM, WhatsApp é cultural.** Usar WhatsApp não é "exótico", é a diferenciação cultural certa.

### 3. Compatível com padrão global (OCDS)
OCDS (Open Contracting Data Standard) é o padrão mundial pra dados de licitação pública. UK, Colômbia, Ucrânia, África do Sul — todos usam. O Brasil usa parcialmente. **Vamos expor nossos dados nesse padrão desde o dia 1**. Isso significa que outros desenvolvedores podem integrar com a gente facilmente, e ganhamos credibilidade internacional de graça.

### 4. Privacidade real, não teatro
A LGPD obriga proteção de CPF. Muitos editais antigos têm CPF de sócios visível (descuido do órgão público). **Vamos mascarar automaticamente** todos os CPFs antes de salvar qualquer coisa. A IA é instruída a nunca preservar CPF no resumo. Princípio do mínimo necessário.

### 5. Open data devolvido
Os dados que coletamos vieram do governo (são públicos por lei). Vamos devolver pra comunidade via API pública gratuita. Outros devs podem construir em cima. Diferente do Effecti que cobra pra você acessar dados que já são públicos.

### 6. Free real, não bait
Free tier honesto: 1 perfil + 5 alertas/dia + email diário. Sem "te liga em 7 dias pra fechar". Sem "pague pra ver mais resultados". Free é produto real para uso pessoal e microempresário que ainda não decidiu pagar.

---

## ✅ O QUE JÁ SABEMOS QUE VAI FUNCIONAR

Fizemos 4 pesquisas completas antes de começar a construir. Resumo de cada:

### Pesquisa 1 — Técnica (28 fontes, 6 perguntas)
- ✅ PNCP API é pública, sem autenticação, sem rate limit documentado, paginação até 500/página → **viável construir solo**
- ✅ Postgres + busca semântica (pgvector) escala até ~100.000 editais nos planos baratos
- ✅ A IA Claude Haiku custa entre $0.005 e $0.02 por edital — orçamento operacional realista é **$30-50/mês**
- ⚠️ Descoberta: scraping de portais foi **superestimado** — 80% dos dados vêm via API oficial

### Pesquisa 2 — Regulatória (38 fontes, 5 perguntas)
- ✅ Lei 14.133 + LAI + Decreto 8.777 amparam explicitamente o consumo automatizado de dados — confiança 92%
- ✅ Nenhum risco TCU/TCDF para "agregador de licitações" (o risco existe pra "robô de lance", que é coisa diferente)
- ✅ Como microempresa solo: dispensado de DPO formal, ROPA simplificado (8 campos)
- ⚠️ Única pendência: ler o footer "Termos de Uso" do portal Compras DF (1h) — provavelmente OK, mas precisa validar

### Pesquisa 3 — Mercado (30 fontes, 6 perguntas)
- ✅ **Zero competidor com foco regional declarado DF/Centro-Oeste** — 5 buscas confirmaram (confiança 90%)
- ✅ Em DF, ~50.000-90.000 microempresas potencialmente alvo (SEBRAE-DF + IBGE)
- ⚠️ Mercado de IA já está mexido — 6 startups novas nos últimos 12 meses. Janela é curta. Diferenciação tem que ser regional + WhatsApp, não IA pura.

### Pesquisa 4 — Comparativa Global (34 fontes, UE + LATAM)
- ✅ Nossa arquitetura está **75% alinhada com o state-of-the-art mundial**
- ✅ ProZorro (Ucrânia) prova que Postgres escala bem em escala nacional
- ✅ TED (UE) processa 740 mil editais/ano com stack similar
- 💡 Lição: **expor padrão OCDS desde o dia 1** é gap explorável (Brasil PNCP só faz parcial)
- ⚠️ Lição negativa: OpenTender.eu falhou em virar produto comercial porque focou em transparência/jornalistas em vez de fornecedor pragmático. **A gente NÃO comete esse erro.**

---

## ❓ O QUE AINDA NÃO SABEMOS (e vamos descobrir)

São 4 incertezas honestas. Cada uma pode mudar o projeto.

### Incerteza 1: Águas Lindas-GO publica de verdade no PNCP?
A lei OBRIGA, mas a realidade pode estar atrasada. Se a prefeitura publica raramente, nosso município-âncora fica fraco. **Como descobrir:** rodar um curl na API PNCP filtrando IBGE 5200175, ver quantos editais aparecem em 365 dias.

### Incerteza 2: A IA realmente faz resumo bom de PDF jurídico denso?
Em teoria sim. Na prática, editais brasileiros têm linguagem específica que pode ser difícil. **Como descobrir:** baixar 3 editais reais (1 grande 100p, 1 médio 30p, 1 pequeno 10p) e rodar a IA. Avaliar com você se o resumo bate o que importa.

### Incerteza 3: Você vai usar diariamente?
Construir uma ferramenta que você não usa é o pior cenário (o OpenTender.eu syndrome). **Como descobrir:** conversa de 1 hora com você: enumera 3 licitações que você perdeu ou quase perdeu nos últimos 6 meses. Engenharia reversa: que filtro teria pego? Isso vira o teste real do produto.

### Incerteza 4: Quanto custa de verdade rodar isso por mês?
Estimativa atual: $30-50. Mas a IA pode ficar mais cara, ou o volume pode ser maior do que estimamos. **Como descobrir:** começar pequeno, medir, ajustar. Sem queimar dinheiro.

---

## 🚀 COMO VAMOS DESCOBRIR — SPRINT 0 (1 semana)

Antes de construir qualquer linha de código de produção, vamos gastar 1 semana validando essas 4 incertezas. Custa ~18 horas no total.

### Bloco 1 — Você (3 horas)
1. **Conversa de 1h:** as 3 licitações perdidas (Incerteza 3)
2. **Conversa de 30min:** seu perfil de CNAE, valor, geografia, palavras-chave
3. **30 min de leitura:** validar termos de uso do portal Compras DF (Incerteza regulatória)

### Bloco 2 — Dev (6 horas)
1. **2h:** baixar 1.000 editais reais do PNCP via API, ver volume e cobertura (Incertezas 1 e 4 parcial)
2. **2h:** rodar IA Haiku em 3 PDFs reais e avaliar qualidade + custo (Incerteza 2)
3. **2h:** testar fontes secundárias (dados.df.gov.br, padrão Megasoft pra municípios pequenos)

### Bloco 3 — Decisão (1 hora)
- **Você + Breno** sentam e decidem: começa Sprint 1? Ajusta plano? Adia? Mata?

---

## 📅 SE PASSAR O SPRINT 0, COMO VAMOS CONSTRUIR

Total honesto: **12-14 semanas, ~180-220 horas** distribuídas em pequenos blocos.

| Sprint | O que adiciona | Duração |
|--------|----------------|---------|
| **0** | Validação das 4 incertezas | 1 semana |
| **1** | Esqueleto do banco + começa a ingerir editais do PNCP | 1 semana |
| **2** | A IA começa a resumir editais (assíncrono) + match engine simples | 1 semana |
| **3** | Email diário com top 5 oportunidades + interface básica web | 1 semana |
| **4** | Robustez infra (fallbacks, observabilidade, retry) | 1 semana |
| **5** | WhatsApp integrado | 1 semana |
| **6** | Compliance LGPD completo (política privacidade, cookies, ROPA) | 1 semana |
| **7** | API pública gratuita no padrão OCDS internacional | 1 semana |
| **8** | Chat com o edital (você pergunta, IA responde) | 1 semana |
| **9** | Busca semântica avançada + buscas salvas + recomendações | 1 semana |
| **10** | Polimento + onboarding + validação qualidade IA + docs | 1-2 semanas |

A cada sprint, o produto fica mais completo, mas **funciona desde o final do Sprint 3**. Você (amigo) pode começar a usar com 4 semanas de construção.

---

## ⚠️ OS RISCOS HONESTOS (calibrados, sem hype)

Não vou esconder o que pode dar errado.

### Risco 1: O Breno tem 4 outros projetos simultaneamente
Tocks (negócio de móveis de luxo), Bretda (mesas de bilhar), KR Interiores, Vorza. Se algum desses entrar em emergência, este projeto **pausa imediatamente**. Probabilidade calibrada: ~68% de ter pelo menos 1 semana de pausa nas próximas 12 semanas. Não é mau presságio, é honestidade.

### Risco 2: A janela de competição IA está fechando
Já existem 6 startups novas no Brasil (Licitei R$3,5M Microsoft, LicitaIA, LicitaFree, etc). Alguma delas pode lançar "modo regional DF" em 6-12 meses. Defesa: ser primeiro a chegar, regional + WhatsApp + parceria local quando virar produto.

### Risco 3: A IA pode ficar mais cara
O preço da Claude Haiku 4.5 já mudou 2 vezes em 2 anos. Mitigação: ter um sistema que troca de provedor (Anthropic / OpenAI / DeepSeek) automaticamente se um ficar caro/lento.

### Risco 4: Águas Lindas pode publicar pouco
Se a prefeitura só publica 5 editais/ano no PNCP, o "município-âncora" não sustenta a narrativa. Mitigação: ampliar para "DF + outros municípios RIDE-DF" (a região metropolitana).

### Risco 5: Você (amigo) pode não usar
Esse é o pior cenário. Por isso o Sprint 0 começa com conversa de 1h. Se as 3 licitações perdidas não geram match óbvio, repensamos antes de construir.

### Os números de probabilidade (honestos, baseados em pesquisa)
- 52% de chance da validação PNCP de Águas Lindas dar resultado bom (≥10 editais)
- 48% de chance de você usar ≥3 vezes por semana por 30 dias
- 45% de chance do código ficar pronto até 22 de agosto (sem emergência nos outros projetos)
- 68% de chance de pelo menos 1 semana de pausa por emergência em outros projetos

Esses números vêm do trabalho de calibração de probabilidade (Tetlock — Superforecasting). Eles vão melhorando com dados reais.

---

## 💬 25 PERGUNTAS PARA DEBATERMOS

Estas são perguntas que abrem decisão. Cada uma pode mudar o produto. Quero a sua opinião.

### Sobre o uso
1. Que horas do dia faz mais sentido você receber o email diário? 6h? 7h? 8h?
2. Você prefere 1 mensagem WhatsApp por dia só com a melhor, ou 3 com as top 3?
3. Quando você abre o resumo de um edital, o que é o MAIS importante saber primeiro? Valor? Prazo? Requisitos?
4. Faz sentido ter um botão "isso não me interessa" pra a IA aprender o que você não quer ver?

### Sobre o perfil
5. Seu CNAE principal é qual? Tem outros secundários que importam?
6. Qual a faixa de valor de licitação que você participa? Tem mínimo? Tem máximo?
7. Quais 5 palavras-chave SEMPRE devem aparecer no edital? (ex: "móveis", "cadeiras", etc)
8. Quais 5 palavras-chave NUNCA devem aparecer? (pra cortar coisa irrelevante)
9. Você só DF, ou também Goiás estadual, ou Federal sediado em DF?

### Sobre as fontes
10. Além do PNCP, ComprasGov e portal DF, tem algum portal específico que você já usa hoje e funciona?
11. Vale a pena cobrir TCDF (Tribunal de Contas) e Câmara Legislativa DF? Ou esses raramente têm licitação?
12. Você ouviu falar do portal da Prefeitura de Águas Lindas? Funciona? Publica regularmente?

### Sobre a IA
13. Se a IA resume 80% bem mas erra 20% das vezes em detalhe (ex: prazo), você prefere: (a) confiar e perder algumas vezes, (b) só confiar e abrir o PDF pra confirmar, (c) ter um botão "validar com humano"?
14. Faz sentido a IA também responder perguntas tipo: "esse edital tem cláusula restritiva pra microempresa?" — análise mais profunda?

### Sobre o alerta
15. Quantos alertas por dia é tolerável? 3? 5? 10?
16. Faz sentido um "modo silencioso" no fim de semana?
17. Você quer alerta SOMENTE de Tier S (perfeitos), ou também Tier A (próximos), ou também Tier B (relevantes)?

### Sobre os recursos
18. Você usaria o "chat com o edital" toda hora ou raramente?
19. Vale a pena ter um histórico de "editais que eu participei" pra a IA aprender seu padrão?
20. Faz sentido um botão "exportar essa busca em CSV pro Excel"?

### Sobre o futuro
21. Se virasse produto comercial daqui a 1 ano, você indicaria pra outros fornecedores DF? Que você conhece e ajudaria a divulgar?
22. Se outras pessoas pagassem pra usar, qual preço FAZ SENTIDO pra você? R$30? R$50? R$99? R$150?
23. Você toparia ser "consultor" do produto, dando feedback regular em troca de uso vitalício gratuito?

### Sobre a marca/posicionamento
24. O nome "Buscador de Licitações DF" funciona, ou tem nome melhor? ("Radar", "Antena", "Editais DF", outro?)
25. Você se sentiria mais confortável usando algo posicionado como "ferramenta cívica/aberta" ou "ferramenta profissional/de negócio"?

---

## 📚 VOCABULÁRIO (pra qualquer pessoa entender)

| Termo | O que significa |
|-------|-----------------|
| **Licitação** | Procedimento que o governo usa pra comprar coisas (produtos, serviços, obras). Por lei, tem que ser transparente e competitivo. |
| **Edital** | Documento oficial que descreve a licitação (o que querem comprar, regras, prazos, requisitos). Geralmente PDF de 50-200 páginas. |
| **PNCP** | Portal Nacional de Contratações Públicas. Site obrigatório por lei desde 2021 onde todos os editais do Brasil têm que aparecer. |
| **CNAE** | Código que classifica o que uma empresa faz (ex: 4761-0 = comércio de livros). Importante porque licitação geralmente exige CNAE específico. |
| **Pregão eletrônico** | Modalidade mais comum de licitação. Acontece online, com lances de preço em tempo real. |
| **Dispensa de licitação** | Compra direta sem licitação completa. Permitido em valores baixos (Lei 14.133: até R$50k bens, R$100k obras). |
| **SICAF** | Sistema federal onde fornecedores ficam cadastrados. Quase toda licitação federal exige SICAF. |
| **ME / EPP** | Microempresa / Empresa de Pequeno Porte. Têm preferências legais em licitação (LC 123). |
| **OCDS** | Open Contracting Data Standard. Padrão internacional pra dados de licitação. Usado por UK, Colômbia, Ucrânia. |
| **API** | Endpoint técnico que permite um software conversar com outro. Ex: PNCP tem API pra buscar editais em formato de dados. |
| **LGPD** | Lei Geral de Proteção de Dados. Regula como dados pessoais (CPF, etc) podem ser tratados. |
| **WAHA** | Software que conecta o WhatsApp Web a um servidor pra mandar mensagens automatizadas. |

---

## 🏁 PRÓXIMO PASSO CONCRETO

Hoje ou amanhã, **bloco de 2 horas com você**:
1. Conversa de 1h: 3 licitações perdidas (a primeira incerteza que precisamos resolver)
2. 30min: detalhar seu perfil (CNAE, valor, palavras-chave)
3. 30min: validar este briefing — o que faz sentido, o que falta, o que está errado

Depois disso, Breno arruma 6 horas em dev pra rodar os experimentos técnicos do Sprint 0. Aí decidimos juntos se começa Sprint 1 ou ajusta antes.

---

> **Disclaimer honesto:** este projeto pode dar certo, pode dar errado, pode virar produto ou pode virar ferramenta-de-prateleira. O que NÃO vai acontecer: gastar dinheiro seu, prometer coisa que não cumpre, ou empurrar feature que você não pediu. Esse é o acordo.

**Documento v1 — pronto pra debate.**
*Síntese de 4 pesquisas (130+ fontes), 3 auditorias adversariais (Snowden Cynefin, Tetlock Calibration, Scott Alexander Dialectic), 1 plano de execução refinado.*
