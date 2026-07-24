# Revisão Final — gate pro deploy (founder: "tudo no devido lugar + zero erro de português → pode pôr no ar")

## A. Auditoria PT-BR (em progresso — fazer pass limpo após polimento)

⚠️ Filtrar falsos positivos: "privacidade", "bem-estar", "aplicativo", "criptografia" são CORRETOS sem acento. "esta" pode ser demonstrativo (correto) ou verbo "está" (errado) — context-aware.

**Erros reais a corrigir (acentos) — arquivos que SHIPam:**
- `data/disclaimer-data.ts` — nao→não, saude→saúde (linhas 8,13,22)
- `data/beta-guide-data.ts` — voce→você, nao→não, sao→são, ja→já, esta→está(verbo), saude→saúde, emocoes→emoções, experiencia→experiência, video→vídeo (várias)
- `data/legal-data.ts` — disponivel→disponível, seguranca→segurança
- `data/landing-data.ts` + `data/landing-v3-content.ts` — landing ANTIGA (voce/nao/sao/saude/historico/disponivel...) — **DECISÃO: a landing pública não foi reconstruída no v2 (escopo = app). Confirmar com founder se entra no deploy ou fica como está.** Se shipa, corrigir acentos.
- `consent-flow-texts.ts` / `onboarding-texts.ts` — já corrigidos no fix-pass (verificado no screenshot). Re-confirmar.

**Método do pass:** ler cada string, corrigir acento SÓ onde é erro real (verbo está/são/é, substantivos saúde/emoções/experiência/vídeo/histórico/segurança/disponível), NUNCA quebrar demonstrativos (esta/este) nem palavras corretas. Depois grep de verificação.

## B. "Tudo no devido lugar" (checklist pós-polimento)
- [ ] Build/lint/contraste verdes
- [ ] Rotas: /hoje /diario /voce /login /onboarding wired; /chat→/hoje redirect; nav 3 abas
- [ ] Contratos API/WS/consent/legais intactos (inventário research/00)
- [ ] Sem links mortos pra rotas antigas (/mood /dashboard /breathing)
- [ ] Crise: tel: reais, 2ª via em Você, ícone no header
- [ ] Dark mode madrugada coerente nas 5 telas
- [ ] **Remover rotas /dev-preview/* antes do deploy**
- [ ] Decisão landing pública (escopo)

## B2. ACHADO ESTRUTURAL — rotas antigas coexistem (corrigir antes do deploy)
O v2 criou `/hoje /diario /voce` mas as rotas ANTIGAS seguem com design velho, e todas usam o shell novo → dá pra cair numa tela inconsistente. Plano de redirect (server) pra deixar o beta 100% no design novo:
- `/mood` → `/hoje` (check-in virou o chip do Hoje)
- `/dashboard` → `/diario` ("seu caminhar" absorveu o dashboard)
- `/breathing` → `/hoje` (era placeholder morto)
- `/settings` → `/voce` (substituída)
- `/settings/emergency-contacts` → `/voce` (Você já embute o EmergencyContactsManager)
- `/settings/link-professional` → **MANTER** (Você linka pra cá; fluxo single-purpose; design velho aceitável p/ beta, restyle depois)
- `/exercises/*` (PHQ-9/GAD-7/respiração/registro de pensamento) → **MANTER, mas NÃO linkadas** no nav novo (CBT tools reais, design velho; arq. previu "convites em contexto" = pós-beta). Harmless porque o nav de 3 não aponta pra elas. NOTA AO FOUNDER.
- `/chat` → `/hoje` (já feito). Corrigir redirects velhos `/chat`→`/hoje` em: `(professional)/layout.tsx`, `(professional)/painel`, `(app)/beta-guide` (2×). `OnboardingFlow.tsx` velho = morto (substituído por V2).
- `/beta-guide` → MANTER (isBetaTester); só corrigir o redirect /chat.
- `(legal)/privacy` + `(legal)/terms` (aliases EN) → conferir se redirecionam pros PT; senão remover.
- **dev-preview/* → REMOVER antes do deploy.**

## DECISÃO PRO FOUNDER
- **Landing pública `/`**: NÃO reconstruída no v2 (escopo = app). Design antigo + tinha erros PT (agente corrigindo acentos). Beta fechado entra por /login, então a landing é secundária. Opções: (a) deixar como está p/ o beta (testers não passam por ela), (b) eu reconstruo no Editorial Notebook depois. Recomendo (a) agora.
- **Exercícios CBT**: manter acessíveis (úteis) mas sem link no v2, ou esconder? Recomendo manter sem link (não quebram nada).

## C. Deploy (founder autorizou pós-validação)
Após PT-audit + redirects + remover dev-preview → build final → commit → push (auto-deploy Vercel+Railway) → validar prod ao vivo (login, hoje, diario, voce, onboarding, dark, rotas antigas redirecionando).
