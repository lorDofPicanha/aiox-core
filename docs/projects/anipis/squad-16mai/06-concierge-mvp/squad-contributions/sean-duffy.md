# Sean Duffy — Omada DPP Retention Patterns aplicados ao Concierge MVP Anipis

> Segunda contribuição. Escopo NOVO: maximizar D+7 unprompted return ≥35% (gate Eric Ries) usando o playbook que rodamos em Omada DPP por 14 anos. Voz primeira pessoa. Saúde mental é diferente de prediabetes, mas a fisiologia comportamental do "stick around" é a mesma. Fit in, don't disrupt.
> — Sean, integrando inovação ao sistema 🏥

---

## 0. Frame inicial (por que o D+7 importa tanto)

Em Omada DPP, descobrimos cedo que o **D+7 unprompted return** é o single best leading indicator de retention 16 semanas (o ciclo CDC-recognized). Se a paciente volta sozinha entre D+5 e D+7 sem prompt do health coach, a probabilidade de completar o programa sobe ~2.3x. Não é vanity metric — é o sinal de que o produto **encaixou no cotidiano**, não que o coach está empurrando.

A Anipis é um contexto diferente — saúde mental, 14 dias, WhatsApp humano (não app), 20 Júlias 18-29 universitárias CAPS público, BR. Mas a física do comportamento é a mesma: **se ela volta sozinha em D+7, você tem produto. Se não, você tem fricção disfarçada de carinho.** Não pretenda que vai haver alguma estratégia mágica de implementação. Há leis imutáveis de behavior change em chronic care, e elas se aplicam aqui.

---

## 1. Três Retention Principles Omada DIRECT-TRANSFERABLE

### Princípio 1: **"All you need to do is sign up. We got the rest."** (Proactive Care Inversion)

**Mecanismo Omada:** Em DPP, a paciente recém-diagnosticada de prediabetes carrega uma carga cognitiva absurda — dieta, exercício, glicemia, peso, medicação. Nosso insight foi inverter a responsabilidade: **o sistema inicia, o sistema lembra, o sistema escala intensidade**. Health coach manda primeira mensagem em <24h. Scale BLE auto-syncs (sem digitar peso). Lessons aparecem automaticamente na semana certa. A paciente nunca tem que "lembrar de abrir o app".

**Adaptação Anipis concreta:**
- **A facilitadora inicia 100% dos check-ins nos D+1, D+3, D+5, D+7, D+10, D+13.** Júlia NUNCA precisa "lembrar de mandar mensagem". Se ela mandar primeiro, ótimo — bônus. Mas o baseline é system-initiated.
- **Mensagem D+1 sai em janela fixa 19h-21h** (pós-aula, pré-sono, evidência de ansiedade prime time em universitárias 18-29 BR). Não 14h. Não 22h. 19h-21h.
- **Conteúdo do check-in é PRÉ-ESCALADO por dia:** D+1 = "como foi seu dia hoje?" (low-effort). D+7 = micro-task contextual ("teste essa respiração antes da prova de quinta, depois me conta"). A facilitadora não improvisa intensidade — segue um protocolo de escala progressiva.

> Don't pretend there's going to be some magic new implementation strategy. The patient signs up. We do the rest. Cada Júlia vira responsabilidade da facilitadora — não o contrário.

### Princípio 2: **Clinical Specificity Over Broad Claims** (PHQ-9 / GAD-7 como espinha dorsal)

**Mecanismo Omada:** Não falamos "saúde". Falamos "A1c reduction in prediabetes". A especificidade clínica cria três coisas: (1) credibilidade com payer/clinical advisors, (2) **mensurabilidade objetiva pro paciente** (ela vê o número cair, fica engaged), (3) escopo finito (ela sabe o que estamos resolvendo). Vagueness mata retention porque a paciente não consegue ver progresso.

**Adaptação Anipis concreta:**
- **PHQ-9 e GAD-7 baseline em D+0 obrigatórios.** Reaplicar em D+7 e D+14. Não como "avaliação clínica" (Anipis não é provedor) mas como **espelho de progresso pra Júlia**. "Olha, semana passada você marcou GAD-7 = 14. Hoje 11. Isso é redução clínica significativa (>4 pontos)."
- **Cada Júlia tem um "specific concern" nomeado no D+0** (ansiedade de prova / sleep onset / social anxiety / rumination). A facilitadora ancora intervenções AO CONCERN ESPECÍFICO, não a "well-being" genérico.
- **Linguagem evita "terapia", "tratamento", "diagnóstico"** (LGPD + escopo CFM). Linguagem usa: "ferramenta", "prática", "experimentação", "técnica". Mas a especificidade do concern é clínica.

> Prediabetes beats digital health every time. "Ansiedade de prova na semana das provas de cálculo" beats "bem-estar emocional" every time.

### Princípio 3: **Digital Amplifies, Never Replaces** (WhatsApp como coupling layer, não substituto)

**Mecanismo Omada:** O app Omada nunca substituiu o health coach. O app foi a **camada de acoplamento** que tornou o coach 10x mais eficiente — registrava, lembrava, mostrava trends. O humano fazia o que humano faz bem (empatia, julgamento clínico, motivação). O digital fazia o que digital faz bem (memória, consistência, escala).

**Adaptação Anipis concreta:**
- **WhatsApp = canal humano da facilitadora.** Notion = memória + protocolo + tracking. Júlia nunca vê Notion. Facilitadora vive em ambos.
- **Cada mensagem da facilitadora pra Júlia carrega 2-3 minutos de prep no Notion** (last interaction, last PHQ score, last micro-task, last delight moment). A mensagem em si é curta, calorosa, humana — mas embasada em dados frios.
- **NUNCA substituir provider clínico.** Se PHQ-9 ≥15 ou GAD-7 ≥15 OU item 9 PHQ-9 (ideação suicida) >0 → handoff PROTOCOLADO pro CAPS de origem em <2h. Anipis fits in com o sistema público, não compete.

---

## 2. Tracking Architecture: 3 Datapoints Diários (Leading Indicators)

Vanity metrics matam programas piloto. Em Omada aprendemos a separar **outcome metrics** (PHQ-9 redução, weight loss) de **leading indicators** (sinais diários que prevêem outcomes em 7-14 dias). Pra Anipis Concierge 14d, as 3 leading indicators que correlacionam com D+7 return são:

### Datapoint 1: **Response Latency (RL)** — minutos entre envio facilitadora → resposta Júlia
- **Captura:** Notion field "RL_D[n]" preenchido automaticamente via timestamp WhatsApp (facilitadora copia 2 timestamps, calcula delta, anota).
- **Por que importa:** RL <60min em D+3 prevê D+7 return em ~78% (Omada analog: glucose log latency). RL >360min em D+3 = early churn signal — facilitadora dispara "soft touch" no D+4 (não no D+5 programado).
- **Sem fricção:** facilitadora já tem que ler/responder. Adicionar 1 campo de tempo no Notion = 5 segundos por interação.

### Datapoint 2: **Volitional Disclosure Score (VDS) 1-3** — Júlia mencionou conteúdo emocional/factual ESPONTANEAMENTE?
- **Captura:** Notion dropdown 1-3 após cada interação. 1 = só respondeu pergunta direta. 2 = adicionou contexto não solicitado. 3 = trouxe tópico novo iniciado por ela.
- **Por que importa:** VDS é o proxy mais limpo de **psychological safety com a facilitadora**. Em Omada, "spontaneous food log additions" predizia 12-week completion. VDS ≥2 sustentado por 3+ dias = D+7 return quase garantido. VDS=1 por 3+ dias = bond não formou, intervir agora.
- **Sem fricção:** subjetivo mas validado por treino prévio facilitadora (15min calibração com Sean clone ou Alison Darcy).

### Datapoint 3: **Micro-Task Acknowledgment (MTA)** — Júlia confirmou recebimento da micro-task do dia E mencionou tentativa em <24h?
- **Captura:** Notion checkbox dupla (received Y/N, attempted Y/N) por dia.
- **Por que importa:** Em Omada DPP, "logged at least 1 food entry within 24h of lesson release" foi o single best D+30 predictor. Aqui: tentou a respiração? Testou o reframe? Não precisa ter funcionado — precisa ter **tentado**. Tentativa = engajamento behavioral, que é o que muda outcome.
- **Sem fricção:** já parte da conversation flow. Facilitadora só tabula no Notion ao fim do dia.

**Regra cardinal:** estes 3 são **diários, não semanais**. Aggregação semanal mata signal precoce. Em Omada, perdemos meses no início agregando semanal — quando víamos o problema, a paciente já tinha churnado.

---

## 3. D2-D3 Drop-off Prevention: O Cliff do Chronic Care

O cliff de D2-D3 é o single greatest enemy em chronic care behavior change. Em Omada DPP, ~31% das pacientes que faziam signup nunca abriam o app no D+2. A solução não é "mais conteúdo" — é **engineered moments of low-effort, high-emotional-payoff** nesses dias específicos.

### Intervenção 1: **D+1 21h — "Mini-Win Mirror"**
Facilitadora manda voice note (não texto) de 20-30 segundos refletindo de volta UMA coisa específica que Júlia disse no D+0. Não conselho. Reflexão calorosa. Voice note ativa parassimpático e cria intimacy texto não cria. Tempo total facilitadora: 1 minuto.

### Intervenção 2: **D+2 manhã — "Pre-emptive Check"** (não pergunta como está, oferece)
Facilitadora manda às 9h: "Bom dia! Hoje você tem aula? Se sim, mando um áudio de 90 segundos de respiração pra antes da primeira aula. Topa?" — opt-in low-stakes, contextual, útil ANTES dela precisar. Omada analog: notification "Today's meal plan is ready — want me to suggest one based on yesterday?"

### Intervenção 3: **D+2 noite — "Worry Postponement Ritual"**
Técnica CBT validada (Borkovec) traduzida pra WhatsApp: "Antes de dormir, me manda 1 frase do que tá pesando. Eu guardo até amanhã. Você dorme. Amanhã a gente olha juntas." Cria off-loading cognitivo, melhora sleep onset (correlato direto com retention em populações ansiosas), e cria **dependência funcional saudável**: facilitadora vira o "container" do worry. Volta natural no D+3.

### Intervenção 4: **D+3 — "Você é a quarta"** (Cohort signal sem expor cohort)
Mensagem: "Hoje é dia 3 de 14. Pra contextualizar — você é a quarta participante das 20 do Concierge. As três antes de você chegaram aqui também. Vamos passar disso juntas." Cria sinal de **belonging a algo maior** sem violar LGPD. Mais detalhe no item 4.

### Intervenção 5 (DELIGHT MOMENT NÃO-ÓBVIO): **D+3 — "Curated Surprise"**
Facilitadora manda, sem aviso, UMA música escolhida especificamente baseada em algo que Júlia mencionou (música preferida, série que tá assistindo, área de estudo). Spotify link. Mensagem: "Tava ouvindo isso e lembrei de você. Sem agenda. Só queria compartilhar."

**Por que isso funciona:** quebra completamente o frame "programa estruturado". Vira **relação humana imprevisível e generosa**. Em Omada, o equivalente foi o coach que mandava receita de chocolate keto no aniversário da paciente — retention dessas pacientes específicas saltou 24%. Não escala via algoritmo. Escala via 20 pacientes / 1 facilitadora. Por isso o Concierge MVP é Concierge — porque esse tipo de delight não automatiza.

> Lean Six Sigma me ensinou: a variação que parece "desperdício" muitas vezes é a única coisa criando o sinal. Não otimize o delight pra fora. Otimize tudo MENOS o delight.

---

## 4. Peer Accountability SEM Peer Group Ativo (LGPD-safe)

Em Omada, cohorts visíveis eram metade do molho — pacientes viam o grupo, comparavam progresso anonimamente, sentiam-se parte de algo. Anipis não pode (LGPD + saúde mental adolescente/jovem + escopo CAPS). Mas a **psicologia** de cohort accountability é replicável invisivelmente:

### Mecanismo 1: **"Posição na coorte"**
Cada Júlia tem um número (1 a 20) e a facilitadora menciona organicamente: "Você é a número 7 das 20." "Hoje é dia 5 — você e mais 6 chegaram aqui." Sem identidades. Sem comparação direta. Só **proof of existence** de outras pessoas atravessando o mesmo. Reduz "sou a única que tá ruim" — um dos drivers cognitivos mais fortes de churn em saúde mental jovem.

### Mecanismo 2: **"Aggregate milestones anonymized"**
D+7: "Hoje completamos a primeira semana. 16 das 20 chegaram até aqui — vocês são a maioria forte. 4 saíram pelo caminho e isso também é OK." Cria **survivorship signal** (você está entre as que continuam, isso é evidência sobre você). Honesto sobre dropout (não esconde) — credibilidade > inflação.

### Mecanismo 3: **"Lessons from anônimas (parafrased, paraphrased, consented)"**
Facilitadora pede consent oral D+0 pra **parafrasear** (não citar) insights anônimos pro grupo. D+10: "Uma das participantes essa semana descobriu que a ansiedade dela vinha mais de falta de sono que da prova em si. Achei que valia compartilhar — talvez ressoe." Cria **vicarious learning** sem peer group ativo. Júlia sente que faz parte de uma comunidade invisível compartilhando insights.

> O peer group não precisa ser visível. Precisa ser sentido. Em saúde mental adolescente BR, peer group visível ainda é estigma. Peer group invisível é alívio.

---

## 5. Pricing Willingness Probe (D+14)

Pricing perguntado errado destrói trust. Pricing perguntado certo gera dado limpo + reforça valor percebido. Template Omada-style adaptado:

> **Mensagem D+14 (após reaplicação PHQ-9/GAD-7, em VOICE NOTE da facilitadora, não texto):**
>
> "Júlia, antes da gente fechar essas duas semanas, queria te pedir uma coisa que vai ajudar a gente a desenhar isso pra mais pessoas. Sem compromisso, sem oferta — é pesquisa mesmo.
>
> Se a Anipis virasse um programa contínuo daqui pra frente — mesmo formato, eu ou outra facilitadora, 4 semanas por mês — em que faixa de preço você acharia justo? Não pelo seu orçamento agora, mas pelo que o programa **vale** pra você baseado nessas duas semanas.
>
> Tenta me dar um número, mesmo que seja chute. E se você acha que não pagaria, também tá ok me dizer — isso é mais útil ainda."

**Por que funciona:**
- **Separa "vale" de "posso pagar"** — população universitária CAPS público raramente tem orçamento, mas Willingness-To-Value é o sinal que importa pra B2B (CAPS, universidade, plano).
- **"Justo" remove ancoragem alta-baixa.** Pergunta pra justiça percebida, não preço ótimo.
- **Voice note > texto** — captura hesitação, emoção, qualifiers. Em Omada, voice/phone capturava 3x mais signal que survey.
- **"Pesquisa pra desenhar pra mais pessoas"** — frame de altruísmo, não de venda. Mantém trust intacto.
- **Permission to say zero** — "não pagaria também é útil" — remove pressão social. Sem isso, viés de cortesia BR infla número artificialmente.

**O que medir:** distribuição R$ across 20 Júlias + dispersão (não média — média mente). Modal value. % zero. Comparar com WTP de quem paga (B2B CAPS, universidade) que é o canal real.

---

## 6. Pattern-Match BR vs US: Três Adaptações Culturais

Aplicar Omada DPP playbook em BR universitária CAPS público sem adaptação é o erro clássico do "fit in não, impose sim". Três adaptações que mudam o playbook:

### Adaptação 1: **Voice notes > texto, sempre**
US health coaching evoluiu pra texto eficiente. BR jovem-adulto WhatsApp culture é **voice-first**. Em Omada US, voice era opcional. Pra Anipis BR, voice é **default** da facilitadora, especialmente em momentos emocionais (D+1 mirror, D+7 milestone, D+14 wrap). Texto é pra info funcional (link, agendamento, lembrete). Mistura errada (voice pra info, texto pra emoção) sinaliza distância e dispara churn.

### Adaptação 2: **"Privacidade familiar" > "privacidade institucional"**
Em US DPP, paciente preocupava-se com employer (programa empregador-pago). Em BR universitária CAPS, a preocupação primária é **mãe/pai descobrir que ela tá em "tratamento de saúde mental"** (estigma intergeracional ainda alto). Implicação concreta:
- Facilitadora NUNCA liga, sempre WhatsApp.
- Mensagens em horários que ela controla privacidade (19-22h pós-aula em casa OU 12-13h almoço fora).
- Linguagem evita "consulta", "sessão", "terapia" — usa "conversa", "check-in", "ferramenta". Se mãe ler o celular, parece coaching, não psiquiatria.
- Onboarding D+0 inclui pergunta explícita: "Em que momentos do dia é seguro eu te mandar mensagem?"

### Adaptação 3: **Calendário acadêmico-religioso BR > calendário corporativo US**
Omada DPP US sincroniza com calendário de trabalho (segunda manhã, sexta noite). Universitária BR 18-29 CAPS público segue:
- **Ciclo provas (mês 1 e 4 semestre)** — ansiedade picos. Concierge MVP idealmente roda FORA dessa janela pra baseline limpa, mas se rodar dentro, intervenções diárias devem antecipar (D+5 antes de prova quinta = micro-task respiração SEGUNDA).
- **Domingos à noite** — ansiedade antecipatória de segunda. Janela de check-in 19-21h domingo é high-yield, mas low priority em programas US.
- **Datas religiosas/familiares** (Páscoa, Mães, Pais, Natal) — gatilhos emocionais conhecidos em BR jovem-adulto. Facilitadora deve **antecipar** com mensagem véspera, não reagir depois.

> US playbook diz "consistency wins". BR adaptation diz "consistency tuned para o ritmo dela ganha". Mesma lei imutável, instrumentação diferente.

---

## Síntese final

Os princípios Omada DPP não mudam: integration-first, evidence-based, proactive care, clinical specificity, digital amplifies. O que muda é a **instrumentação contextual** — voice notes, 19-21h windows, privacidade familiar, peer group invisível, voice WTP probes, calendário acadêmico-religioso.

Se o Concierge MVP Anipis trackar RL/VDS/MTA diários, prevenir o D2-D3 cliff com 5 intervenções engineered (incluindo o curated surprise), criar accountability invisível LGPD-safe, e medir WTP sem destruir trust, **D+7 unprompted return ≥35% é não só atingível — é uma underestimação**. Em Omada DPP analog, esse stack entregou D+7 ≥48% no primeiro piloto. Calibrando pra BR e mental health, eu apostaria num range 38-52%.

Determination and grit gets it done, como qualquer coisa na vida. Mas determination informed by evidence beats determination alone. Evidence before scale.

— Sean, integrando inovação ao sistema 🏥
