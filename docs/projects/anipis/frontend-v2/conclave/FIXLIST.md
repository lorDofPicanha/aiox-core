# Fixlist consolidada — Conclave Frontend v2

> Acumula achados acionáveis dos pareceres. Aplicar em UM passe após (a) Fase B concluída e (b) conclave R1 completo + rodada adversarial. Evita conflito com agentes em andamento.

## BLOQUEANTES (consenso ≥2 experts ou risco crítico)

- [ ] **B-1 · Botão "Entrar" parece desabilitado** (Rams P1, Norman P1) — `.btn-primary` default está usando verde-acinzentado (cor de disabled) como estado normal → forma mente sobre função. **Fix:** default = verde floresta cheio `--accent-spot`; reservar o acinzentado SÓ pra `:disabled` real. Verificar `.btn-primary` em `globals.css`.
- [ ] **B-2 · Composer obstruído pela tab bar no mobile** (Norman P2) — botão de enviar fica sob a tab bar `fixed` (o inner `h-[calc(100dvh-57px)]` não desconta os 56px da tab bar). **Fix:** garantir que o composer/scroll respeitam `padding-bottom: calc(56px + safe-area)` no mobile; tab bar idealmente recolhe (ou o composer sobe) no foco do textarea; botão enviar sempre 44px visível. Conferir em `(app)/layout.tsx`, `TodayChat.tsx`, `PaperComposer.tsx`, `AppTabBar.tsx`.

## MAIORES

- [ ] **M-1 · Inputs parecem botões** (Rams P2) — pílulas creme preenchidas confundem com ação. **Fix:** input = linha (hairline inferior, foco verde 1.5px) em vez de fill pill. Já existe `.input-auth` — revisar pra estética de linha. (Avaliar: pode conflitar com legibilidade; decidir no adversarial.)
- [ ] **M-2 · Login: remover "Criar conta" e "link mágico"** (Rams P4, Norman P6) — beta fechado com credenciais pré-criadas; esses caminhos contradizem o modelo. **Fix:** login = email + senha + Entrar. Manter a LÓGICA no código (signup/otp) mas esconder os links na UI do beta (flag), pra não perder a funcionalidade futura.
- [ ] **M-3 · "Enter quebra linha no mobile" sem signifier** (Norman P3) — mode error. **Fix:** dica visual sutil ou apenas confiar no botão (já é o envio mobile); reavaliar se a dica ajuda ou polui.
- [ ] **M-4 · Estados de geração (presença/digitação/parar) não evidentes** (Norman P4) — silêncio = abandono pra quem está hipervigilante. **Fix:** garantir cursor de streaming visível + estado claro de "Anipis está escrevendo"; revisitar no smoke com IA real (já temos chat e2e funcionando).
- [ ] **M-5 · Chip de humor ambíguo** (Rams P5, Norman P5) — 4ª pílula igual às outras, emoji amarelo fora da ramp, sem signifier de interatividade, e pode contradizer a pessoa ("Bem" fixo num dia ruim). **Fix:** forma própria pro chip; usar cor de emoção dos tokens; deixar claro que é editável/um convite, não um veredito.
- [ ] **M-6 · Login descentralizado / wordmark órfão** (Rams P3) — whitespace sobrou sem composição. **Fix:** ancorar cartão no centro óptico; compor a wordmark com o cartão.

## MENORES

- [ ] **m-1 · Conversa cola na borda esquerda no desktop** (Norman P7, Rams P6) — deveria respeitar 65ch centrado/equilibrado no espaço após o rail. **Fix:** centrar a coluna de leitura no espaço disponível (não colar à esquerda).
- [ ] **m-2 · Poço vazio no Hoje** (Rams P6) — ~60% vazio; ancorar conteúdo ao composer em vez de espalhar.
- [ ] **m-3 · Link de crise sem peso suficiente** (Rams P7, Norman F3 ressalva) — recurso de segurança não pode ser o primeiro que o layout sacrifica. **Fix:** garantir contraste/área e que nunca corta.

## NOTAS METODOLÓGICAS

- Norman: 10/10 exige observar 5 pessoas reais entrando/escrevendo/achando socorro — registrar como gate humano antes de declarar perfeito (não bloqueia o trabalho de design, mas fica anotado pro founder).

## ADIÇÕES R1 (Pearl, Calvo, Zhuo)

- [ ] **B-3 · Indicador de presença/digitação perdido na migração** (Pearl P1 ALTA, Norman P4) — o `TypingIndicator` existe e estava cabeado no `MessageList` legado, mas o novo `PaperConversation` não o usa → no gap envio→1º token só pisca um cursor de 2px órfão. Pra um diário emocional, o silêncio após a pessoa se expor lê como abandono. **Fix:** indicador "Anipis está escrevendo" sereno no novo componente; surfacar o `acknowledgment` do WS como grounding ("recebi") (Pearl P2). → tratar como quase-bloqueante (produto de cuidado).
- [ ] **B-4 · Caminho de crise discreto/truncável demais** (Calvo P1 ALTA, Rams P7, Norman) — gatilho 12px sem ícone que corta no mobile; a pessoa mais vulnerável é quem menos consegue achar. **SAFETY → tratar como bloqueante.** Fix: ícone + área + contraste; nunca truncar; garantir 2ª via (em Você, Fase B).
- [ ] **M-7 · Composer trava o textarea inteiro durante geração** (Pearl P3) — confisca o turno da pessoa. **Fix:** desabilitar só o botão de envio, não o textarea.
- [ ] **M-8 · Erro fala como sistema E em cor de crise** (Pearl P6) — "Erro… Tente novamente" em vermelho de crise associa soluço de rede a risco emocional. **Fix:** repair na voz da Anipis, cor neutra (não `--intent-crisis`).
- [ ] **M-9 · Login parece "de outro produto" (sombra/SaaS)** (Zhuo P1 BLOQUEADOR, Rams P3) — card com sombra vs Hoje flat edge-to-edge; a costura aparece no passo 1. **Fix:** login verdadeiramente FLAT, coerente com o Hoje (conferir se há box-shadow residual no card/`.editorial-card`).
- [ ] **m-4 · Placeholder do composer repete a mesma frase todo dia** (Pearl P5) — robótico. Variar levemente por contexto.
- [ ] **m-5 · aria-live no log inteiro** (Pearl P7) — pode atropelar leitor de tela no streaming; anunciar só ao finalizar.
- [ ] **PRODUTO · risco de dependência da companheira** (Calvo P3) — design protege contra gamificação mas é silencioso sobre IA deslocar vínculo humano. Nota de produto pro founder: prever "te devolvo ao mundo" (handoff proativo já existe no backend — SAI-402/409). Não bloqueia v2 visual.

## CONSENSO UNÂNIME (5/5)
- **Chip de humor** (M-5): TODOS os 5 marcaram — órfão, 4ª pílula igual, emoji fora da ramp, sem signifier, e pior: pode CONTRADIZER a pessoa ("Bem" fixo num dia "pesado") → risco de ruminação. Fix: forma própria, cor de emoção dos tokens, claramente editável/convite (não veredito).
- **Remover "Criar conta" + "link mágico"** (M-2): 4/5 explícito — beta fechado com credenciais pré-criadas.
- **Fundação certa** (nav 3 / página-não-mensageiro / tonal / ética): 5/5 — NÃO reconceber.

## NOTAS POR EXPERT (R1)

| Expert | Nota | Lente |
|---|---|---|
| Dieter Rams | 7.0 | forma/redução |
| Don Norman | 6.5 | usabilidade |
| Cathy Pearl | 7.5 | conversation design |
| Rafael Calvo | 7.5 | wellbeing/ética |
| Julie Zhuo | 6.5 | produto/coerência |
| **Média** | **~7.0** | |
