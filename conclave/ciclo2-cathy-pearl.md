# Conclave Ciclo 2 — Cathy Pearl (Conversation Design)

**Produto:** Anipis frontend v2
**Lente:** Conversation design / voice UX — Grice's maxims, turn-taking, grounding, repair, persona
**Nota ciclo 1:** 7,0
**Nota ciclo 2 (revisada):** **8,7 / 10**

> Nota: os arquivos `round1-cathy-pearl.md` e `SYNTHESIS-r1.md` não existem mais em disco (`D:\AIOS\conclave` foi recriado para este ciclo). A verificação abaixo é ancorada nos cinco pontos do meu parecer ciclo 1 conforme registrados no brief: (P1) indicador de digitação perdido na migração, (P2) acknowledgment sem grounding, (P3) composer travando, (P4) erro pintado em cor de crise, (P5) humor como carimbo.

---

## 1. VERIFICAÇÃO DOS PONTOS DO CICLO 1

### P1 — Indicador "Anipis está escrevendo" perdido na migração → **RESOLVIDO**

A presença na espera voltou, e voltou *na voz do lugar* — não um balão genérico de messenger.

Evidência em `src/components/hoje/PaperConversation.tsx`:
- `AnipisTurn` detecta o gap entre o envio da pessoa e o 1º token: `if (streaming && content.length === 0) return <AnipisWriting />` (linha 103). Esse é exatamente o vão que no ciclo 1 lia como abandono.
- `AnipisWriting` (linhas 129–148) escreve literalmente **"Anipis está escrevendo"** em serif Newsreader, `--text-muted`, com três pontos calmos. Assim que o 1º token chega, o `<span className="stream-cursor">` assume (linha 118) — handoff limpo presença → streaming.
- Acessibilidade tratada com cuidado de turn-taking: a label é anunciada **uma vez** pelo `role="log" aria-live="polite"` do contêiner pai (linha 62–63); os pontos são `aria-hidden`. O comentário no código (linhas 130–132) confirma a decisão de **não** aninhar uma segunda live region — exatamente o que eu teria pedido para não atropelar o leitor de tela.
- O comentário de `AnipisWriting` ainda diz que o movimento desliga sob `prefers-reduced-motion` e nos temas crise/redução-de-estímulo. Correto: a presença não pode pulsar agressivamente para quem está em sofrimento.

**Veredicto:** presença na espera restaurada, com voz, sem regressão de a11y. Forte.

### P5 — Humor como carimbo → **RESOLVIDO** (e é o melhor acerto do ciclo)

Esta era minha objeção mais conversacional: um chip estático de humor *declara* como a pessoa se sente e pode contradizê-la (ruminação, e violação da máxima de qualidade — afirmar o que não se sabe). A correção tem duas camadas e ambas estão certas.

**Camada 1 — humor reconhecido na PRIMEIRA FALA, como convite.** Em `TodayChat.tsx` → `buildGreeting()` (linhas 166–183):
- Humor baixo (1–2): "Vi que você chegou se sentindo pra baixo hoje. Estou aqui — quer me contar o que está pesando?"
- Humor bom (4–5): "Que bom que você chegou se sentindo bem hoje. Quer me contar mais sobre o seu dia?"
- Neutro (3) e sem-humor: convites abertos.

Em todos os ramos a Anipis **acolhe e pergunta** — nunca fecha um veredicto. O comentário do código é explícito: "INVITES (...), never declares how the person feels (anti-ruminação)". É grounding correto: ela mostra que registrou o sinal e devolve o turno para a pessoa.

A screenshot `c2-hoje-light-820.png` confirma ao vivo: *"Oi, Marina. Que bom que você chegou se sentindo bem hoje. Estou aqui — pode começar por onde quiser, ou só desabafar."* (a cópia visível é uma variação ainda mais aberta que a do código atual — ambas honram o padrão convite).

**Camada 2 — o chip deixou de ser carimbo.** Em `MoodChipToday.tsx`, o chip resolvido ganha lápis + "editar" (linhas 119–121) e a microcópia **"Só um convite — toque se quiser revisar como você está."** (linha 137). Isso o reposiciona de *verdict* para *registro editável* — visível em ambas as screenshots de Hoje. O humor agora aparece **duas vezes** com a mesma postura (na fala e no chip), o que é coerência de persona, não redundância.

**Veredicto:** carimbo virou convite, na fala e no chip. Exatamente o que pedi.

### P3 — Composer travando durante a geração → **RESOLVIDO**

Turn-taking é sagrado: a pessoa nunca pode perder a vez enquanto a Anipis responde. Em `PaperComposer.tsx`:
- O contrato do prop está documentado (linhas 9–14): *"the textarea stays editable — the person never loses their turn while the Anipis is still answering"*.
- Na prática: o `<textarea>` (linha 106) **não** recebe `disabled`. Apenas o botão de enviar é desabilitado (`disabled={!canSend}`, linha 129) e `submit()` faz guard `if (!trimmed || sending) return` (linha 63). Ou seja: a pessoa pode continuar digitando/editando o próximo turno durante o streaming; o sistema só impede o **envio** interleaved.
- `TodayChat.tsx` passa `sending={composing}` onde `composing = chat.isLoading` (linhas 86, 126) — a gate é só no botão.

**Veredicto:** travamento removido sem abrir a porta para sends sobrepostos. Decisão correta.

### P4 — Erro pintado em cor de crise → **RESOLVIDO**

Era um erro de gravidade conversacional: um soluço de rede vestido de vermelho de crise faz a pessoa ler risco emocional onde só houve falha técnica — uma violação séria da máxima de qualidade/relevância. Em `TodayChat.tsx` (linhas 110–124):
- A mensagem de erro usa **voz neutra acolhedora**: *"Algo não saiu como esperado — pode tentar de novo?"* com `color: 'var(--text-muted)'` e `role="status"` (não `alert`).
- Comentário explícito (linhas 113–114): *"Repair in the Anipis' voice, NEUTRAL color — never crisis red. A network hiccup must not read as emotional risk."*
- O caminho de crise real permanece separado e intocado: `CrisisBanner` (amarelo/laranja), `CrisisAlert` (laranja), `CrisisFullScreen` (vermelho), disparados pelo `crisisModal` do store via WS — não pelo `chat.error`. A separação dos dois canais é arquitetural, não cosmética. Bom.

**Veredicto:** reparo é "repair over repeat" na voz certa, na cor certa, com a severidade certa.

### P2 — Acknowledgment sem grounding → **PARCIAL** (forte no que dá para ver estático; falta o AO VIVO)

Este é o único que não posso fechar como 100% resolvido pela evidência estática.

O que melhorou e dá para verificar:
- **Grounding agora é instrução de sistema de primeira ordem.** `apps/api/prompts/v2.md`, "Como você conversa": *"Concreto. Reflita o que a pessoa disse com as palavras dela antes de oferecer qualquer coisa."* e *"Sem positividade tóxica. (...) Valide o que dói antes de qualquer convite a mudar de perspectiva."* Isso é exatamente o anti-padrão que eu apontei no ciclo 1 (acknowledgment vazio do tipo "entendo, sinto muito" sem espelhar o conteúdo). O prompt agora **força** o espelhamento antes da oferta.
- A screenshot `c2-hoje-light-820.png` mostra a Anipis respondendo "Hoje foi um dia pesado no trabalho, não consegui desligar a cabeça." com *"Sinto muito que tenha sido assim. O que mais está pesando no seu pensamento agora?"* — há acolhimento + pergunta aberta, mas é uma resposta **mockada/estática**; o espelhamento concreto ("desligar a cabeça", "trabalho") não aparece nela. Não posso saber se o modelo real faz o grounding lexical até ver streaming com IA de verdade.

**Veredicto:** o *contrato* (system prompt) corrige a causa-raiz; a *evidência de runtime* ainda não comprova o comportamento. Por isso PARCIAL — vira RESOLVIDO assim que eu ver 3–4 turnos reais.

---

## 2. PROBLEMAS RESIDUAIS DE CONVERSA

Nenhum bloqueador. Refinamentos:

1. **Drift de cópia fala-vs-código no greeting.** A screenshot mostra "...pode começar por onde quiser, ou só desabafar" no ramo de humor bom, enquanto o `buildGreeting` atual fecha com "Quer me contar mais sobre o seu dia?". São duas variações boas, mas indicam que a screenshot foi tirada de um build anterior. Não é problema de design — só alinhe a screenshot do QA com o código vigente para não confundir reviewers. (Eu prefiro levemente a versão do código: pergunta única e específica > convite genérico.)

2. **Reparo de erro é "tente de novo" sem retry visível.** *"Algo não saiu como esperado — pode tentar de novo?"* convida a pessoa a reenviar, mas o último turno dela pode ter sumido do composer (que limpa em `submit`). Repair-over-repeat ideal: preservar/reinjetar o texto não-entregue, ou oferecer um affordance de "reenviar" em vez de pedir que ela redigite o desabafo. Hoje ela teria que reescrever — atrito num momento vulnerável. **Recomendo** guardar o último input falho e reidratar o composer.

3. **A presença "Anipis está escrevendo" depende do 1º token demorar.** Se o backend bufferiza e solta tudo de uma vez, o estado `content.length === 0 && streaming` pode piscar rápido demais (flash) ou nem aparecer. Conferir AO VIVO se a presença tem dwell-time mínimo perceptível; senão considerar um piso de ~300–400ms para não piscar.

4. **Sem "stop"/abort.** O código é honesto sobre isso (comentário em `PaperComposer`: o hook não tem abort, então não fingem um botão). Concordo com não fingir. Mas num diário emocional, gerar uma resposta longa que a pessoa não quer mais ler e não poder interromper é um pequeno desrespeito ao turn-taking. Backlog, não bloqueador.

5. **`role="log"` para a conversa inteira.** Funciona, mas leitores de tela em log mode podem ficar verbosos com streaming token-a-token. Validar com NVDA/VoiceOver que o streaming não vira tagarelice — possivelmente anunciar só o turno final, não cada chunk.

---

## 3. O QUE BLOQUEIA 10/10 (pela lente de conversation design)

A camada estática está essencialmente certa. O que falta é **ver a conversa acontecer com IA real**, porque conversation design só se prova no tempo, no turno, na falha:

1. **Grounding ao vivo (fecha P2).** Preciso ler 3–4 turnos reais e confirmar que a Anipis espelha as *palavras da pessoa* antes de ofertar (como o v2.md manda), e que não cai em acknowledgment genérico sob pressão. Sem isso, P2 fica PARCIAL e segura a nota.

2. **Streaming + presença no fio real.** Ver o handoff "Anipis está escrevendo" → cursor → texto com latência de rede de verdade: a presença aparece, tem dwell perceptível, não pisca, e o cursor não trava no fim.

3. **Erro ao vivo.** Forçar uma falha de rede e confirmar que aparece a voz neutra (`--text-muted`, `role=status`) e **nunca** o vermelho de crise — e idealmente que o texto da pessoa não se perdeu (residual #2).

4. **Crise ao vivo (o mais crítico de todos).** A separação canal-erro vs. canal-crise é o coração da segurança deste produto. Preciso ver os três níveis dispararem pelo WS: amarelo (`CrisisBanner`) → laranja (`CrisisAlert`) → vermelho (`CrisisFullScreen`), confirmar a cópia-ponte (CVV 188 / SAMU 192, "nunca resolver a crise sozinha") e que o erro técnico jamais escala para esses estados. Num app de saúde mental, um falso-positivo de crise ou um falso-negativo são ambos danos reais.

5. **Anti-ruminação no humor baixo ao vivo.** Quando o humor logado é 1–2, a 1ª fala convida "quer me contar o que está pesando?". Ver com IA real que isso não vira escavação forçada de quem só queria registrar e seguir.

Em suma: **10/10 exige uma sessão de runtime com IA real cobrindo streaming, erro e os três níveis de crise.** Tudo o que é verificável em código/estático está no lugar.

---

## 4. NOTA REVISADA

**8,7 / 10** (era 7,0)

| Ponto ciclo 1 | Status |
|---|---|
| P1 — indicador de digitação | RESOLVIDO |
| P2 — acknowledgment sem grounding | PARCIAL (contrato corrigido no v2.md; falta runtime) |
| P3 — composer travando | RESOLVIDO |
| P4 — erro em cor de crise | RESOLVIDO |
| P5 — humor como carimbo | RESOLVIDO |

Quatro dos cinco pontos fechados, e o quinto teve sua causa-raiz corrigida no system prompt — o que resta é evidência de runtime, não trabalho de design. Subo de 7,0 para 8,7. A retenção dos ~1,3 não é desconfiança do trabalho: é a disciplina de não dar 10 num produto de saúde mental sem ter visto o streaming, o reparo de erro e — sobretudo — os três níveis de crise dispararem com IA real. Mostre-me essa sessão e eu fecho em 9,5+.

-- Cathy Pearl. Design for the conversation, not the command.
