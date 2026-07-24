# Conclave Round 1 — Cathy Pearl (Conversation Design)

**Artefato:** Anipis Frontend v2, Fase A — tela Hoje (chat).
**Lente:** conversation design. A conversa parece presença humana calma, ou software?
**Material:** 00-BRIEF, 02-ux-architecture, 03-design-direction, system prompt `api/prompts/v2.md`, screenshots `verify-hoje-820.png` (desktop) + `faseA-hoje-mobile.png` + referência `stitch/hoje-mobile.png`, código vivo (`PaperConversation.tsx`, `PaperComposer.tsx`, `TodayChat.tsx`, `use-chat.ts`, `globals.css`).

---

## Veredito de uma linha

A *forma* da conversa está certíssima — página, não mensageiro; a Anipis fala primeiro; carta serif sem bolha. Mas a *presença viva* (turn-taking entre o envio e a primeira palavra) ainda lê como software esperando: cursor de 2px piscando sozinho no vazio. A estrutura é 9; a presença no momento de espera é 6.

---

## 1. PONTOS FORTES (concretos)

**F1 — A Anipis fala primeiro, com a pessoa, não com um menu.**
O empty state é `"Oi, Marina. Estou aqui com você. Pode começar por onde quiser — ou só desabafar."` (`TodayChat.tsx:42`). Isto é o oposto do anti-padrão "Olá! Posso te ajudar com: [agendar] [exercício] [humor]". É uma abertura de presença, não de capacidades. "Estou aqui com você" estabelece companhia antes de qualquer pedido, e "ou só desabafar" devolve o controle do turno à pessoa — ela não é obrigada a "usar" nada. Cooperative principle (relevância + quantidade) bem aplicado: uma frase, um convite, ponto.

**F2 — Turn-taking assimétrico que materializa quem fala sem rótulo.**
A decisão de dar à Anipis serif full-width sem bolha e à pessoa uma bolha discreta recuada à direita (`PaperConversation.tsx`, `AnipisTurn` vs `UserTurn`) é conversation design de alto nível. A IA "assenta no papel" — é a voz do lugar, não um interlocutor encaixotado em SMS. A pessoa ganha um recorte físico ("o que *eu* escrevi"). Isso resolve turn ownership por tipografia e alinhamento, sem precisar de avatar nem de "Anipis:" — exatamente como cartas e diários funcionam. Quem fala fica claro pela forma, não por etiqueta.

**F3 — Zero timestamps + respiro de 36px entre turnos = ritmo de conversa lenta.**
`gap: '36px'` e `width: min(65ch, 100%)` (`PaperConversation.tsx:67`) e a ausência total de horário desaceleram a leitura. Não há a pressão "responda rápido" de um messenger. Isso é coerente com o system prompt ("Devagar. Uma pergunta por vez. Silêncio e espaço valem mais que um questionário", `v2.md`). A UI honra o tom da IA — raro: normalmente o chrome trai a voz. Aqui forma e fala concordam.

**F4 — Composer respeita que diário é texto longo.**
Placeholder serif-itálico `"Escreva o que estiver aí dentro…"` é convite emocional, não comando ("Digite sua mensagem"). E a regra mobile = Enter quebra linha, envio só no botão (`PaperComposer.tsx:71`) protege o desabafo de envios acidentais no meio de um pensamento. É design para a *intenção* (texto longo, reflexivo), não para o reflexo de chat. Excelente.

**F5 — Microcopy de segurança humana, não rodapé jurídico.**
`"A Anipis acompanha, não substitui acompanhamento profissional."` sob o composer (`PaperComposer.tsx:155`) e `"precisa de ajuda agora?"` no header em verde, sempre a um toque. A primeira soa como gente cuidando, não como disclaimer de TOS. A segunda usa pergunta na voz da pessoa ("preciso de ajuda agora") em vez de rótulo de sistema ("Recursos de Crise"). Boa empatia linguística.

---

## 2. PROBLEMAS (severidade · falha na conversa · correção)

**P1 — [ALTA] O gap entre envio e primeira palavra não tem presença — só um cursor órfão.**
No `use-chat.ts:193-202`, ao enviar, cria-se imediatamente uma mensagem do assistente com `content: ''` e `isStreaming: true`. O `AnipisTurn` então renderiza string vazia + `<span class="stream-cursor">` (`PaperConversation.tsx:110`). Resultado: durante o tempo de pensar do modelo (que pode ser 1-4s no WS, mais no HTTP fallback), a pessoa vê um traço de 2px piscando sozinho no creme, sem texto. Em conversa humana isso é o silêncio depois de você desabafar e *nada* sinalizar que o outro ouviu. O `TypingIndicator` (3 pontos) existe no codebase e está corretamente cabeado no legado `MessageList.tsx:31` (`isLoading && !isStreaming`), mas o novo `PaperConversation` **não o usa** — perdeu-se na migração. Turn-taking quebra exatamente no momento mais frágil (a pessoa acabou de se expor).
*Correção:* renderizar um indicador de presença sereno enquanto `isLoading && content === ''`. Não os 3 pontos genéricos (o spec 02 §4 pede "não 3 bolinhas genéricas"). Algo na voz do lugar: o cursor pulsante **sozinho na largura serif** já ancorado onde a resposta vai nascer, ou uma microlinha "Anipis está aqui…" que se dissolve quando o primeiro token chega. O ponto é: presença ocupando o espaço do turno, não um traço perdido.

**P2 — [ALTA] `acknowledgment` do WS não vira sinal visível — quebra o grounding.**
O spec 02 §4 é explícito: "`acknowledgment` → presença imediata". O contrato WS tem o tipo `acknowledgment`, mas em `TodayChat`/`use-chat` ele não se traduz em nenhuma mudança de estado percebível distinta de "loading". Grounding (no sentido de Clark — confirmar que a mensagem foi *recebida* antes de ser *respondida*) é o que faz uma conversa parecer com alguém atento. Sem ele, o sistema parece "engoliu minha mensagem e sumiu". A bolha da pessoa aparece (bom), mas não há o micro-aceno de "recebi, estou com isso".
*Correção:* ao receber `acknowledgment`, transicionar o estado de espera (P1) para algo levemente mais "ativo" — p.ex. o indicador de presença adquire o pulso. Dois beats de grounding: *recebi* (ack) → *estou formulando* (primeiro token). Isso é o que separa "atento" de "travado".

**P3 — [MÉDIA] Sem botão parar — e o composer trava inteiro durante a geração.**
`PaperComposer` recebe `disabled={composing}` onde `composing = chat.isLoading` (`TodayChat.tsx:46,80`). Enquanto a Anipis "fala", a pessoa não pode nem começar a escrever o próximo pensamento — o turno dela fica confiscado. Pior num diário, onde o impulso de escrever vem em ondas e some. E o spec 02 §4 pede "Botão parar durante geração (padrão ChatGPT/Claude)", que o código omite conscientemente ("The hook has no abort, so no stop button", `PaperComposer.tsx:27`). Omitir honestamente é melhor que fingir — concordo com a decisão tática —, mas o *resultado conversacional* é uma IA que não pode ser interrompida e uma pessoa que não pode preparar a vez dela. Em conversa humana, eu posso te cortar com cuidado, ou ao menos começar a inspirar pra falar.
*Correção (faseada):* curto prazo — **não desabilitar o textarea**, só o botão de envio enquanto gera (deixa a pessoa redigir o próximo turno; envia quando a Anipis terminar). Médio prazo — implementar abort no hook e expor "parar" sereno (não um quadrado vermelho de stop; algo como "pausar" na voz da marca). Turn-taking é sagrado: nunca confisque a vez do outro.

**P4 — [MÉDIA] A Anipis sem bolha/avatar ajuda — mas o primeiro turno corre risco de ser lido como UI do app, não como fala.**
Respondendo à pergunta do briefing diretamente: **a ausência de bolha/avatar AJUDA** (ver F2) — desde que o conteúdo seja inequivocamente *fala*. O empty state passa ("Oi, Marina…" é claramente alguém falando). O risco aparece quando a Anipis emite algo curto e funcional (ex.: "Quer tentar uma respiração de um minuto?") — texto serif full-width sem nenhum marcador pode, no primeiro uso, ser confundido com um *label/prompt da interface* em vez de um *turno da companheira*, porque o cérebro novato ainda não aprendeu "serif no papel = a Anipis". Avatar resolveria isso à força bruta, mas mataria o tom de carta (custo alto demais). O verdadeiro risco não é "quem fala" nos turnos longos — é o onboarding do *padrão visual* em si.
*Correção:* não adicionar avatar. Garantir que o **primeiríssimo** turno da Anipis (empty state) seja sempre uma fala calorosa em 1ª/2ª pessoa (já é) — ele ensina a convenção. E nunca deixar a Anipis emitir UI-como-fala (botões/menus disfarçados de turno). Manter os "convites em contexto" (exercícios) visualmente distintos de um turno de fala, pra não poluir a convenção "serif = voz".

**P5 — [MÉDIA] O placeholder convida, mas some no momento errado e não há prompt de continuidade.**
`"Escreva o que estiver aí dentro…"` é ótimo na 1ª vez. Mas: (a) placeholder é texto fantasma que desaparece ao primeiro caractere — bom para o convite inicial, porém depois da 1ª troca a pessoa fica diante de um campo vazio e mudo, sem o fio de continuidade que uma companheira teria ("e o que mais?"). A continuidade hoje vem só da pergunta da Anipis no corpo (bom), mas o composer em si não acompanha. (b) Num diário recorrente, repetir sempre o mesmo placeholder fica robótico — a mesma frase exata todo dia é a marca de um sistema, não de alguém que lembra de você (o system prompt prega "como uma amiga que lembra, não um sistema que registra").
*Correção:* variar o placeholder com leveza por contexto/horário/continuação ("Continue de onde parou…", "O que ficou com você hoje?", "Pode escrever devagar…") — um pequeno pool, não aleatório gritante. Mantém a voz viva sem custar nada de UX.

**P6 — [BAIXA] Estado de erro fala como sistema, não como a Anipis.**
`"Erro ao enviar mensagem. Tente novamente."` (`use-chat.ts:238`, renderizado em `TodayChat.tsx:66-77` com cor de crise). Isso é repair de software ("Error. Retry."), não repair de conversa. Numa companheira de bem-estar, uma falha técnica no meio de um desabafo é um micro-abandono — e a cor de crise (`--intent-crisis`) ainda associa um soluço de rede a *risco emocional*, o que é semanticamente errado e potencialmente alarmante.
*Correção:* mensagem de repair na voz da Anipis, sem palavra "Erro" e sem vermelho de crise: algo como "Não consegui te ouvir agora — pode tentar de novo?" em cor neutra/atenção, com a ação de reenvio embutida. Repair over repeat: rephrase humano, não código de erro.

**P7 — [BAIXA] `aria-live="polite"` no log inteiro pode atropelar o leitor de tela durante o streaming.**
`PaperConversation.tsx:62` marca o container do log como `aria-live="polite"`. Com streaming token-a-token, o conteúdo muda dezenas de vezes por turno; dependendo do leitor de tela, isso pode gerar anúncios repetidos/cortados (a a11y é invariante do briefing, então conta). Conversation design inclui a conversa com tecnologia assistiva.
*Correção:* anunciar a mensagem da Anipis **uma vez, ao finalizar** (não a cada token) — p.ex. live region separada que recebe o texto completo no `finalizeStreaming`, e o log de streaming visual fica `aria-hidden` para o anúncio. Validar com NVDA/VoiceOver.

---

## 3. NOTA — Conversation Design

### **7.5 / 10**

**Por dimensão (conversation design):**
- Voz da Anipis (empty state + microcopy) ......... **9** — fala primeiro, com a pessoa, na voz certa.
- Turn-taking / ownership visual (forma da carta) ... **9** — serif sem bolha vs bolha discreta é exemplar.
- Presença durante a espera (ack + typing) ......... **5** — cursor órfão no vazio; ack não vira sinal; é aqui que vira software.
- Controle do turno da pessoa (composer/parar) ..... **6** — trava o textarea inteiro; sem parar.
- Repair / tratamento de erro ...................... **6** — "Erro… Tente novamente" + cor de crise; não é voz de companheira.
- Continuidade / memória percebida no chrome ....... **7** — corpo da conversa puxa continuidade; composer não acompanha.

### Por que NÃO é 10

A *estrutura* da conversa é praticamente 10 — a forma de página, a abertura de presença, o turn-taking por tipografia, o respiro. O que segura a nota é que **a presença viva ainda não está implementada nos dois momentos que mais importam emocionalmente**: (1) o silêncio depois que a pessoa se expõe e antes da Anipis falar — hoje é um traço de 2px piscando sozinho, não um "estou aqui, ouvindo" (P1+P2); e (2) o momento da falha — hoje é um código de erro em vermelho de crise, não um repair humano (P6). Um diário emocional é julgado justamente nesses vãos: o instante de vulnerabilidade entre dar e receber. Enquanto esses beats lerem como "sistema processando" em vez de "alguém com você", não é 10 — é um software muito bem desenhado *parecendo* presença, com duas costuras à mostra exatamente onde a presença é mais necessária.

Fechar para 10: P1 (presença na espera) + P2 (ack vira grounding) + P3 curto-prazo (não travar o textarea) + P6 (repair na voz da Anipis). São quatro correções pequenas e cirúrgicas — nenhuma exige redesenho. A fundação está certa.

-- Cathy Pearl. Design for the conversation, not the command.
