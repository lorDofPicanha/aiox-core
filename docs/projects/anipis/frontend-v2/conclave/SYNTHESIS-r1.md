# Síntese do Conclave — Ciclo 1 (Fase A)

> 5 pareceres independentes + 5 adversariais. Defs reais. Protocolo do founder honrado (independente → adversarial → síntese). Média final **~6.6/10**.

## VEREDITO

**A fundação está certa — não reconceber.** Unânime nos 5: navegação Hoje/Diário/Você, "página não mensageiro" (Anipis serif sem bolha), sistema tonal flat, base ética. O caminho ao 10 é **construção + correção cirúrgica**. As notas caíram no adversarial (7.0→6.6) porque três lentes independentes provaram que a porta de entrada e a rede de segurança estão mais frágeis do que o R1 generoso refletia — não porque a direção esteja errada.

## CONSENSO (o que todos confirmam)
1. **Login está quebrado e é o item nº1** — visual de outro produto (sombra vs flat), botão que parece disabled, e dois caminhos falsos (signup/magic-link) que o beta fechado não honra. É o PRIMEIRO turno do produto e está rompido antes do "Oi".
2. **Composer obstruído pela tab bar no mobile** = teto duro (ato central quebrado no device principal).
3. **Rede de crise = fio único truncável** = single point of failure numa superfície de crise. Inaceitável (SAFETY).
4. **Presença na espera é regressão** — o TypingIndicator existia e sumiu na migração; o silêncio após a pessoa se expor lê como abandono.
5. **Chip de humor pode contradizer a pessoa** (5/5) — risco de ruminação.

## DISSENSO RESOLVIDO (votos)
- **Inputs → LINHA** (hairline inferior, foco verde 1.5px) — 4-1. Norman cede; pílula colide com a bolha da fala.
- **Chip de humor → DISSOLVER na primeira fala da Anipis** ("Você chegou se sentindo bem…") em vez de carimbo fixo. Decisivo o argumento anti-ruminação (Pearl+Calvo) sobre o "metadado bem-formatado" (Rams/Zhuo). Manter um jeito discreto e OPCIONAL de registrar/mudar humor — nunca um veredito estático.
- **Crise → ÍCONE + rótulo, 44px, nunca trunca, tom tijolo calmo, zero motion, 2ª via persistente** (4-1; Rams discorda do ícone mas perde). Calma = cor/movimento; proeminência = tamanho/ícone/constância.
- **Login → REMOVER signup/magic-link da UI** (unânime; único secundário aceitável: "Tem um convite?").
- **Empty state → SEM nome até o onboarding capturá-lo de verdade** (unânime). Saudar "Marina" sem ela ter dado o nome = intimidade não-conquistada / vigilância. Degrada pra "Oi. Estou aqui com você."
- **Botão Entrar → estado disabled HONESTO** (não "sempre habilitado + erro no submit").

## PONTOS CEGOS (ninguém checou — verificar mecanicamente)
- Contraste dos NOVOS elementos (chip, inputs-linha, link de crise) — rodar lint:contrast após o fix.
- Dark mode "madrugada" das telas novas (a pessoa às 2h).
- Os contratos de API/consent intactos (Fase B preserva — validar).

## ORDEM DE EXECUÇÃO (pós-Fase B)
1. Login no sistema (flat real, sem sombra, inputs-linha, botão honesto, remover desvios). [coerência nº1]
2. Composer mobile desobstruído + botão enviar sempre 44px visível. [teto duro]
3. Crise inconfundível (ícone+rótulo+44px+nunca trunca) + 2ª via em Você. [safety]
4. Presença na espera: indicador "Anipis está escrevendo" + grounding do acknowledgment; erro na voz da Anipis (cor neutra, não crise). [regressão]
5. Humor dissolvido na fala; chip vira registro discreto opcional. [unânime]
6. Coluna de leitura centrada no desktop; empty state sem nome. [polimento]

## GATE PRO 10/10
Aplicar 1-6 → rebuild → **conclave FRESCO no produto completo** (Hoje+onboarding+Diário+Você), incluindo dark mode e smoke com IA real. Norman registra gate humano: observar 5 pessoas reais entrando/escrevendo/achando socorro antes de declarar perfeito (nota pro founder; não bloqueia o design).
