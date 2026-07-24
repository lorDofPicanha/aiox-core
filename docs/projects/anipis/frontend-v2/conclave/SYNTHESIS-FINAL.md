# Síntese Final do Conclave — Frontend v2 Anipis

> 2 ciclos completos, 20 análises de experts independentes + adversariais (defs reais), 2 passes de correção. Protocolo do founder honrado integralmente.

## Trajetória das notas

| Expert | Ciclo 1 (indep→advers) | Ciclo 2 (produto completo + fixes) |
|---|---|---|
| Don Norman (usabilidade) | 6.5 → 6.0 | **9.0** |
| Dieter Rams (forma/redução) | 7.0 → 6.5 | **7.5** |
| Cathy Pearl (conversation design) | 7.5 → 7.0 | **8.7** |
| Rafael Calvo (wellbeing/ética) | 7.5 → 7.0 | **8.7** |
| Julie Zhuo (produto/coerência) | 6.5 → 6.5 | **8.5** |
| **Média** | **6.6** | **8.5** |

## Veredito

**Toda a crítica acionável dos 5 experts foi endereçada e verificada no código-fonte.** A fundação (nav Hoje/Diário/Você, "página não mensageiro", sistema tonal flat, ética) foi unânime desde o início. Os bloqueantes do Ciclo 1 estão resolvidos (Norman verificou 6/7 + 1 parcial no código real). O passe final fechou os resíduos menores e o ponto cego de contraste no dark.

### Bloqueantes do Ciclo 1 → todos resolvidos
- Login coerente (flat real, inputs-linha, sem desvios de auth, botão honesto ghost→verde) ✅
- Composer mobile desobstruído ✅
- Crise inconfundível (ícone+44px+nunca-trunca+2ª via persistente em Você) ✅
- Presença na espera ("Anipis está escrevendo") ✅
- Humor dissolvido na fala como convite, nunca carimbo ✅
- Erro em voz neutra, separado do canal de crise ✅

### Decisões votadas aplicadas
Inputs=linha · humor=dissolvido+chip-convite · crise=ícone+rótulo+44px+2ª-via · remover signup/magic · saudar sem nome até onboarding · botão honesto (disabled ghost / enabled verde cheio).

### Polimento final
Login flat de verdade · botão disabled "à espera" (ghost) vs enabled verde cheio · Diário empty + first-day · texto preservado no erro · tel: nos botões de crise (verificado) · contraste de segurança AAA/AA nos DOIS temas.

## Contraste de segurança (ponto cego fechado)
Link de crise/CVV/SAMU: 7.51 (claro) / 7.29 (madrugada) = AAA. Disclaimer: 5.44 / 6.13 = AA. 30/30 no lint:contrast.

## Estados de cuidado (evidência segura — ver evidencia-estados-crise.md)
Caminho feliz REAL em prod (verde, sem escalar) + 183 testes de crise/segurança PASS (níveis verde/amarelo/laranja/vermelho) + render por-cor verificado no código + canal de crise arquiteturalmente separado do erro técnico. Disparo do vermelho AO VIVO não capturado por segurança (acionaria alerta real) — fica pro staging/beta com plantão.

## O QUE SEPARA 8.5 DE 10 — convergência unânime dos 5

**Não é mais design.** Os experts são explícitos: o último 1.5 ponto é **PROVA**, não projeto:
1. **Smoke com IA viva** dos estados de cuidado em latência real (streaming, presença, e os 3 níveis de crise com a copy-ponte) — parcialmente provado por testes; o visual ao vivo precisa de staging isolado ou do próprio beta.
2. **Gate humano** (Norman, explícito): "usabilidade para sofrimento não se declara perfeita sem observar gente real". Os **20 beta testers são exatamente esse gate.**
3. Fase C (Calvo): mitigar dependência da companheira (handoff afetivo) — backend SAI-402/409 já existe; não bloqueia o v2 nem o beta.

## Recomendação ao founder

O frontend foi reconstruído do zero, fundamentado em pesquisa de fontes primárias, endurecido por dois ciclos de conclave adversarial, e levado de "horrível" (palavra do founder) a **8.5/10 de consenso de experts** — o teto que revisão de design+código consegue certificar. O ponto que falta pro 10 é, pela palavra dos próprios experts, **colocar na frente de pessoas reais** — que é literalmente para o que servem os 20 logins do beta. 

Decisão do founder: (a) aprovar o visual e **deployar o v2 + rodar o beta** (que É o gate dos 10), ou (b) seguir lustrando detalhes de menor retorno. A honestidade do conclave manda dizer: mais ciclos de revisão estática rendem pouco; o aprendizado real agora vem do uso.
