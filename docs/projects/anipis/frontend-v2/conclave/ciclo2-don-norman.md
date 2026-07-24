# Parecer Don Norman — Anipis Frontend v2, **Ciclo 2** (produto completo)

> Lente: usabilidade, affordances, mapeamento, feedback, prevenção de erro — para uma pessoa possivelmente em sofrimento emocional.
> Método: Seis Princípios + Sete Estágios da Ação + três níveis emocionais + classificação de erro (slips/mistakes). Cada crítica referencia um princípio nomeado, nunca preferência pessoal. Quando uma pessoa tem dificuldade, a falha é do design, nunca dela.
> Artefatos vistos (Read como imagem, 820px): `fix1-login-820.png`, `c2-hoje-light-820.png`, `c2-hoje-dark-820.png`, `faseB-onboarding-820.png`, `faseB-diario-820.png`, `faseB-voce-820.png`. App ao vivo confirmado respondendo (`localhost:3377` — /login, /dev-preview/hoje, /dev-preview/voce todos 200).
> **Verificação mecânica:** li o código-fonte real dos pontos críticos (login `page.tsx`, `PaperComposer`, `PaperConversation`, `CrisisQuickHelp`, `AppHeader`, `globals.css` — estados `btn-primary:disabled`, `input-auth`, `mood-chip`, `--intent-crisis`). As correções não são só pixels no screenshot; estão no system image que o produto realmente projeta.

---

## Nota de honestidade metodológica (repito do Ciclo 1, porque continua valendo)

Eu avalio o **system image** — o que estas telas e este código comunicam. Não observei pessoas reais em sofrimento entrando, escrevendo a primeira dor, recebendo resposta e achando socorro. Em design para crise emocional isso não é um detalhe — é *a* prova. Tudo abaixo é diagnóstico de especialista rigoroso, não substituto de observação. O 10 depende desse gate humano (ver §3).

---

## 1. VERIFICAÇÃO DOS BLOQUEANTES E MAIORES DO CICLO 1

### P1 (BLOQUEANTE) — Botão "Entrar" afordância falsa, disabled indistinguível, sem dizer por quê → **RESOLVIDO**
**Evidência:** No `globals.css`, `.btn-primary:disabled` foi reescrito para um estado **honestamente inativo**: `background-color: var(--surface-recess)` (bege neutro, sem cor de ação), `color: var(--text-muted)`, `cursor: not-allowed`, `opacity: 1` — com comentário explícito no código: *"NOT a dimmed forest green — a visibly inactive, colorless state so the enabled full-green action is unmistakable. Form mirrors function: no action color = no action yet."* No `fix1-login-820.png` o botão aparece exatamente assim: um pill bege sem verde, claramente "ainda não". A afordância falsa acabou — o verde-floresta `--accent-spot` agora é **exclusivo** da ação real, então a ausência dele *é* o signifier de "falta algo". Isto honra a decisão da síntese (disabled HONESTO, não "sempre habilitado + erro no submit"). O mapeamento forma↔função está correto.
*Ressalva menor levada para os residuais (R1): o disabled fica honesto, mas continua mudo sobre o que falta. Resolvido o bloqueante; sobra um polimento de feedback.*

### P2 (BLOQUEANTE) — Composer obstruído pela tab bar no mobile, botão de envio invisível → **RESOLVIDO**
**Evidência:** A página Hoje agora reserva o espaço da barra fixa com `pb-[calc(56px+env(safe-area-inset-bottom))]` e calcula a altura do palco como `h-[calc(100dvh-57px-56px-env(safe-area-inset-bottom))]` (comentário no código: *"subtract header + tab bar so the composer clears the fixed bottom bar"*). O `safe-area-inset-bottom` está respeitado (iPhone com home-indicator não engole o composer). O botão de envio é um alvo circular `h-11 w-11` (44px reais) sempre renderizado, com seta fina. Visibilidade e Gulf of Execution restaurados: o ato central do produto — escrever de volta — não briga mais com a navegação. O teto duro do Ciclo 1 caiu.

### P3 (MAIOR) — Enter mobile sem signifier de modo (mode error) → **PARCIAL**
**Evidência:** O `PaperComposer` detecta `pointer: coarse` em runtime e, no toque, **Enter sempre quebra linha** (`if (coarsePointer) return` no `onKeyDown`) — correto para diário. O envio agora tem caminho óbvio e sempre visível (botão 44px), o que mata a pior consequência do mode error: antes a pessoa apertava Enter e *não tinha como mandar*; agora o botão está lá, proeminente. **O que falta:** ainda não há um **signifier textual** do modo ("toque para enviar" / micro-hint na primeira sessão). A spec previa essa microcopy e ela não aparece. A captura de hábito do WhatsApp ("Enter = mandar") continua possível, mas agora deságua num botão visível em vez de num beco sem saída. Severidade rebaixada de MAIOR para MENOR. Classificação Norman: o slip de modo segue *possível*, mas a recuperação ficou trivial.

### P4 (MAIOR) — Sem feedback de "a Anipis está pensando" / presença na espera (Gulf of Evaluation) → **RESOLVIDO**
**Evidência:** No `PaperConversation`, quando o turno da Anipis está streaming e ainda sem conteúdo (`streaming && content.length === 0`), renderiza-se `AnipisWriting` — **"Anipis está escrevendo"** em serif mufado com três pontos calmos, na *voz do lugar*, não um spinner genérico. Assim que os tokens chegam, um cursor verde discreto (`.stream-cursor`) passa a trilhar o texto. O layout é estável (sem reflow que pule o texto já lido) e o scroll é **livre durante a geração** — só auto-scrolla se a leitora já está colada no fim (`pinnedRef`), nunca a arranca da leitura. O silêncio que no Ciclo 1 lia como abandono agora tem presença imediata e na voz certa. O cursor desliga sob `prefers-reduced-motion` e nos temas `crise`/`reducao-estimulo`. Isto era uma regressão (o TypingIndicator tinha sumido na migração) — está reposto e melhor que o original.

### P5 (MAIOR) — Chip de humor sem affordance de controle; risco de contradizer a pessoa → **RESOLVIDO**
**Evidência:** Duas coisas mudaram, ambas certas. (a) O **humor foi dissolvido na primeira fala** da Anipis — *"Que bom que você chegou se sentindo bem hoje"* (convite, não veredito carimbado), eliminando o "metadado bem-formatado" que poderia me contradizer num dia que piorou. (b) O chip remanescente ganhou **signifier de editabilidade**: ícone de lápis `✎` ao lado, `aria-expanded`, e a microcopy adjacente *"Só um convite — toque se quiser revisar como você está."* Agora o chip **comunica que muda** — a funcionalidade não é mais invisível (Gulf of Execution fechado) nem um carimbo estático. O pior caso reflexivo do Ciclo 1 (o sistema me dizer que estou "Bem" quando não estou) foi neutralizado: virou convite reaberto, não sentença.

### P6 (MENOR) — "Criar conta" / "link mágico" contradizem o beta fechado → **RESOLVIDO**
**Evidência:** No `login/page.tsx`, flag `BETA_CLOSED = true` esconde **ambos** os desvios da UI; a lógica de `signUp`/`signInWithOtp` fica preservada atrás do flag (reabrir é um one-line flip). No `fix1-login-820.png`: só "Email", "Senha", "Entrar" — zero caminhos falsos. O modelo conceitual do beta fechado (credenciais pré-criadas) agora bate com a UI. "Que bom te ver." cumpre a promessa de simplicidade na porta.

### P7 (MENOR) — Conversa colada à esquerda no desktop, sem âncora de leitura → **RESOLVIDO**
**Evidência:** `PaperConversation` centra a coluna em `width: min(65ch, 100%)` com `mx-auto`; o composer e o chip usam o mesmo `maxWidth: '65ch'` centrado. No `c2-hoje-light-820.png` a conversa tem corpo de "página de caderno" com margens equilibradas — reforça o modelo mental "caderno" (F2 do Ciclo 1) em vez de "janela de chat encostada na borda". O eixo de leitura existe.

### Itens extras da síntese (verifiquei porque eram parte do gate)
- **Crise inconfundível (ícone+rótulo+44px+nunca trunca+tijolo+zero motion)** → **RESOLVIDO.** `AppHeader` usa `LifebuoyIcon` + `min-h-11` + `whitespace-nowrap`; rótulo encurta para "ajuda" em telas estreitas (`sm:hidden`) para nunca clipar; cor `--intent-crisis`, zero animação. O painel `CrisisQuickHelp` é tijolo `#8f2c1b` (2px border no creme), `animation:none`/`transition:none` explícitos, CVV 188 + SAMU 192 + chat. Constância do signifier mantida.
- **2ª via persistente de crise em Você** → **RESOLVIDO.** `faseB-voce-820.png` mostra "Recursos de crise" expansível com "Ligar CVV 188 — 24h", "Ligar SAMU 192 — emergência" e orientação CAPS/SUS. A rede deixou de ser fio único truncável — agora há duas portas independentes para socorro. Isto era o ponto de SAFETY do conclave; está atendido.
- **Empty state sem nome até o onboarding capturá-lo** → **N/A nas capturas** (as telas Hoje mostram conversa já com nome real consentido). Não posso confirmar visualmente o empty-state-sem-nome; recomendo conferir essa tela específica no Ciclo 3.
- **Consent em camadas (onboarding)** → **RESOLVIDO e exemplar.** `faseB-onboarding-820.png`: resumo legível em 3 cartões (O que ela guarda / Sua privacidade / Seu controle) + "Ler o texto completo" (progressive disclosure correto) + 4 consentimentos **granulares e independentes** (processamento de dados de saúde, IA/OpenAI, Política+Termos, 18+) + botão honesto desabilitado até marcar. Isto é knowledge in the world bem feito: a pessoa entende *antes* de aceitar, sem muro de texto.

**Placar de verificação:** 6 de 7 problemas **RESOLVIDOS** (P1, P2, P4, P5, P6, P7) · 1 **PARCIAL** rebaixado a menor (P3). Todos os itens da ordem de execução da síntese (login, composer, crise, 2ª via, presença na espera, humor dissolvido, coluna centrada) estão entregues no código real, não só no mock.

---

## 2. PROBLEMAS RESIDUAIS

### R1 — MENOR · Feedback: o login disabled é honesto, mas continua mudo sobre *o que* falta
**Princípio:** Feedback (Gulf of Execution residual). O botão agora diz claramente "ainda não" (forma inativa), mas não diz "falta o quê". Uma pessoa frágil que digitou o e-mail e parou pode ficar olhando um botão bege sem entender que falta a senha. O melhor erro é o prevenido; o segundo melhor é o explicado no lugar onde ocorre.
**Correção:** Microcopy discreta sob o formulário enquanto incompleto ("Preencha e-mail e senha para entrar"), ou hint inline no campo vazio ao focar/desfocar. Barato, fecha o último resíduo de P1. Não bloqueia.

### R2 — MENOR · Signifier de modo no composer mobile (resto de P3)
**Princípio:** Mode error residual. Sem o micro-hint "toque para enviar" na primeira sessão, a captura de hábito do Enter segue possível (deságua no botão, mas gera um instante de confusão). 
**Correção:** Adicionar a microcopy de modo prevista na spec, só na primeira sessão de toque. Discreta, dissolve depois.

### R3 — MENOR · Affordance de "linha de humor" (Seu caminhar) no Diário pode ler como decoração
**Tela:** `faseB-diario-820.png`. O gráfico de linha sob "SEU CAMINHAR" é sereno e bonito (acerto visceral), mas sem eixos, rótulos de data ou pontos tocáveis evidentes. Risco: ou a pessoa não percebe que é a *trajetória do humor dela* (mapeamento implícito), ou tenta tocar e nada responde.
**Princípio:** Signifier / Mapping. Para um dado tão pessoal — o desenho do meu mês emocional — o significado precisa ser perceptível sem legenda.
**Correção:** Um rótulo de período discreto ("últimos 7 dias") e, se os pontos forem interativos, um signifier de toque. Se for só leitura, deixar isso óbvio. Verificar com gente real se "Seu caminhar" comunica trajetória.

### R4 — PONTO CEGO A VERIFICAR · Dark mode "madrugada" dos novos elementos + contraste
**Evidência parcial:** `c2-hoje-dark-820.png` mostra o tema madrugada coerente (texto serif legível, chip e bolha presentes, crise em tijolo mantendo a cor). Visualmente sólido. **Mas** não rodei `lint:contrast` nos elementos NOVOS (chip editável, inputs-linha, link de crise, consentimentos) em ambos os temas — a síntese pediu isso explicitamente como ponto cego. O chip "Bem" no dark parece ter contraste apertado entre o emoji/texto e o fundo `--emotion-calma`.
**Correção:** Rodar o lint de contraste mecanicamente nos novos tokens, claro e madrugada, antes de declarar a11y. Não é defeito provado — é uma checagem não-feita.

Nenhum residual é bloqueante. Todos são polimento de feedback/signifier ou checagens mecânicas pendentes.

---

## 3. O QUE BLOQUEIA O 10/10 AGORA

Sejamos honestos e específicos. O **conceito** já era dos mais humanos que avaliei; agora a **execução** alcançou o conceito nos dois atos críticos (entrar e escrever) e na rede de segurança (crise com 2ª via). Os bloqueantes do Ciclo 1 caíram. O que separa o produto atual do 10 **não é mais design de tela** — é prova:

1. **O gate humano, e só ele, é o bloqueador real do 10.** Nenhum design é final até testado com gente de verdade. Para um produto de acolhimento isso é literal: preciso **observar 5 pessoas reais** — idealmente em algum grau de sofrimento, não usuários de laboratório descansados — fazendo a jornada inteira: entrar → ler o consentimento e decidir → escrever a primeira dor → esperar a resposta (ver se a presença "Anipis está escrevendo" acolhe ou angustia) → e, no pior caso, **achar o socorro sem que ninguém precise adivinhar nada**. Em uso real as pessoas estão distraídas, à noite, na cama, no escuro (por isso o madrugada importa), hipervigilantes a sinais de abandono. O caminho feliz está lindo; o 10 se decide no caminho difícil, observado.

2. **Smoke com IA real nos estados de espera e crise.** Vi o código da presença e do streaming, e está correto. Mas só vi mocks estáticos. Preciso ver, com IA viva: o intervalo real entre enviar e o primeiro token (o "Anipis está escrevendo" aparece em <300ms?), o streaming sem reflow, e o protocolo de crise WS-driven (CrisisFullScreen/Alert/Banner, que o `CrisisQuickHelp` declara não substituir) disparando de verdade. Feedback de crise não pode ser julgado em screenshot.

3. **Os residuais menores (R1–R3) e o ponto cego de contraste (R4).** Nenhum bloqueia, mas o 10 é a ausência de adivinhação: enquanto o login disabled for mudo (R1), o modo do Enter for tácito (R2), a linha do "Seu caminhar" for ambígua (R3) e o contraste dos novos elementos não for medido em ambos os temas (R4), ainda há cantos onde a pessoa pode hesitar. São baratos de fechar.

Repito o que disse no Ciclo 1 e mantenho: corrigidos os bloqueantes, o produto sobe imediatamente — e subiu. O 10 agora é uma questão de **observação e prova ao vivo**, não de redesenhar nada.

---

## 4. NOTA DE USABILIDADE REVISADA: **9,0 / 10**

(Ciclo 1: 6,5 → Ciclo 2: **9,0**)

**Por que subiu 2,5 pontos:** os dois bloqueantes — a porta de entrada (P1) e o ato central no mobile (P2) — estão **resolvidos no código real**, não maquiados. A regressão de presença na espera (P4) foi reposta e na voz certa. O chip de humor parou de poder contradizer a pessoa (P5). A rede de crise virou dupla porta persistente, fechando o ponto de SAFETY. O consent em camadas é exemplar. Cada correção referencia um princípio nomeado que estava violado e agora está satisfeito. Quando funciona, este design desaparece no uso — que é o elogio máximo que tenho.

**Por que não é 10:** não porque haja defeito de conceito ou de tela — mas porque usabilidade não se declara perfeita sem **observar gente real** atravessando o pior momento, e sem ver a IA viva nos estados de espera e crise. Há ainda quatro resíduos menores de feedback/signifier e uma checagem de contraste não-rodada. São o último centímetro, todo ele "prova", não "projeto".

**Resumo das severidades (Ciclo 2):** 0 BLOQUEANTES · 0 MAIORES · 4 MENORES residuais (R1 login mudo, R2 hint de modo, R3 linha do humor, R4 contraste a medir). Caminho ao 10: gate humano com 5 pessoas + smoke IA real → fechar R1–R4 → declarar.

-- Don Norman, designing for people as they are, not as we wish them to be
