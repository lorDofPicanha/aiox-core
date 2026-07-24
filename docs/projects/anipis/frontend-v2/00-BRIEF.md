# Anipis Frontend v2 — Brief & Quality Bar

**Data:** 11/Jun/2026 · **Mandato do founder:** rebuild completo do frontend.

## Mandato (verbatim do founder)

> "quero um front end perfeito, este que voce me trouxe não serve, me faça um do zero incluindo o flow do usuario e o chat estão horriveis, faz tudo novo, quero apenas as cores usadas, use tudo que precisar e faça pesquisas estensas antes, nada que fez da para aproveitar, faça conclave toda vez que terminar fazendo uma analise geral de tudo, so ficara pronto quando tira 10/10"

## O que FICA (invariantes)

1. **Cores** — única coisa do design atual que sobrevive: verde floresta `#2f5235`, creme `#f7f4ed` e a ramp de tokens derivada (design-tokens.css §cores). Tipografia, componentes, layout, motion: tudo novo.
2. **Contratos de API** — REST + WS do backend (auth Supabase, /auth/sync, /chat/conversations, ws /chat/ws com types auth/message/acknowledgment/assistant_message/error, mood, export, delete).
3. **Obrigações legais** — consent LGPD Art.11 ANTES do chat (conteúdo jurídico preservado; apresentação pode e deve melhorar), terminologia (nunca "terapia/tratamento/cura"), recursos de crise (CVV 188, SAMU 192) sempre alcançáveis, tema crise SEM motion, export e delete Art.18 acessíveis.
4. **A11y** — WCAG AA mínimo (alvo AAA nos pares já validados), touch targets 44px, focus visible, prefers-reduced-motion.

## O que MORRE

- Landing v3 atual (Hero/Manifesto/etc), telas de auth, onboarding atual, chat atual, navegação atual, todos os componentes visuais. Arte botânica de 11/Jun: descartada salvo o conclave pedir de volta.

## Processo (ordem obrigatória)

1. **Pesquisa extensa** (fontes primárias: Pi.ai, Wysa, Woebot, Finch, Headspace, Calm, ChatGPT/Claude) → dossiês em `research/`.
2. **UX architecture** — user flow completo novo, IA de navegação, spec por tela.
3. **Build** — chat primeiro (peça central), depois onboarding, shell, demais áreas.
4. **Conclave profundo** após CADA entrega (regra do founder, ver abaixo).
5. Iterar até **10/10 unânime**.

## Protocolo do Conclave (regra dura do founder — feedback 09/Jun)

- Cada expert = **agente independente** que recebe os artefatos REAIS (screenshots das telas buildadas, flows navegáveis) e analisa sozinho, puxando dado ao vivo se precisar.
- Painel: don-norman (usabilidade), dieter-rams (forma/redução), cathy-pearl (conversation design), rafael-calvo (wellbeing tech/ética), julie-zhuo (produto/coerência).
- **Rodada adversarial**: os pareceres circulam e cada um refuta os demais.
- Síntese: CONSENSO / DISSENSO / PONTOS CEGOS / NOTA 0-10 por dimensão + nota geral.
- Velocidade NÃO é critério. Conclave raso = retrabalho.

## Definição de 10/10

- Conclave unânime ≥ 10 nas dimensões: clareza do flow, qualidade do chat, coerência visual, calma/cuidado percebido, acessibilidade, microcopy PT-BR.
- Build/lint/contrast verdes, smoke e2e real (login → onboarding → chat com resposta de IA → mood → export) passando em produção.
