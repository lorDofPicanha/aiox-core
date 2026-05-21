---
name: Anipis Redesign Session - Design Squad
description: Sessao de redesign Anipis com MCP Design Studio ativada. Proximo passo apos reinicio: orquestrar design squad com 24 tools MCP.
type: project
originSessionId: abbc4b49-a457-4bdb-98d9-3d8c9f873719
---
## Sessao Redesign Anipis (10/Abr/2026)

**Contexto:** Usuario pediu para ver todo o redesign feito, revisamos TODOS os arquivos, e decidiu implementar o redesign completo usando o design squad + MCP Design Studio.

### O que foi revisado nesta sessao

Todos os arquivos do redesign foram lidos e analisados:

- **design-tokens.css** (457 linhas) — paleta completa light/dark, chat bubbles, mood scale, legacy aliases
- **tailwind.config.ts** (227 linhas) — mapeamento CSS vars → Tailwind, animacoes custom
- **10 componentes landing** — Hero, Header, BetaSignupForm, Benefits, HowItWorks, ProblemSection, PrivacySection, FAQ, CrisisFooter, LandingFooter
- **landing-data.ts** — conteudo separado em pt-BR
- **8 UI atoms** — Button, Input, EmojiScale, Avatar, ConsentCheckbox, ErrorBanner, LoadingSkeleton, TypingIndicator
- **ChatBubble.tsx** — molecule com chat tokens, Framer Motion
- **ChatWindow.tsx** — organism integrando header, messages, crisis, typing, disclaimer
- **MoodCheckin.tsx** — card wellness com MoodSelector
- **OnboardingFlow.tsx** — 6 steps (Welcome, AgeGate, Context, Consent, GranularConsent, Completion)
- **BreathingExercise.tsx** — 4-7-8 com circulo animado via requestAnimationFrame
- **ThoughtRecordExercise.tsx** — 5 steps TCC guiado
- **PHQ9Assessment.tsx** — 9 questoes validadas, Q9 alerta CVV 188
- **GAD7Assessment.tsx** — 7 questoes ansiedade
- **DashboardStats.tsx** — 4 cards metricas
- **ExerciseCard.tsx** — card catalogo com badge categoria
- **BRANDBOOK-ANIPIS-v1.0.md** (627 linhas) — identidade completa
- **SAI-100-design-terapeutico.md** — story Done, 20 ACs

### Divergencia Identificada: Brandbook vs Implementacao

| Aspecto | Brandbook v1.0 | Implementacao Atual |
|---------|---------------|-------------------|
| **Cor primaria** | Coral quente #E8764B (Aurora) | Teal #4A9BA8 (Therapeutic) |
| **Font heading** | Nunito Bold | DM Sans |
| **Paleta secundaria** | Salvia #4A9672 | Sage Green #6B9E7A |
| **Acento** | Dourado #E6AE2C (Luz) | Warm Peach #D4926E |

**Decisao pendente:** Alinhar brandbook com implementacao ou vice-versa.

### MCP Design Studio — CONFIGURADA (precisa restart)

- **Servidor:** `D:/jarvis/mcp-design-studio/dist/index.js` (build OK)
- **Config anterior:** `.mcp.json` e `settings.local.json` (file-history confirma registro)
- **Status 10/Abr/2026 sessao 2:** Server NÃO aparece nos deferred tools. Processo não rodando. Necessário re-registrar no `.claude/settings.json` ou reiniciar sessão para carregar.
- **24 tools em 7 providers:**
  - Figma (5 tools) — precisa FIGMA_TOKEN
  - Iconify (3 tools) — pronto
  - WCAG Contrast (2 tools) — pronto
  - Google Fonts (3 tools) — pronto
  - Unsplash (3 tools) — precisa UNSPLASH_ACCESS_KEY
  - Color Utils (4 tools) — pronto
  - Style Dictionary / Tokens (3 tools) — pronto
- **5 de 7 providers funcionam sem API key**
- **Fix:** Adicionar `mcpServers.mcp-design-studio` em `.claude/settings.json` com `command: node, args: [D:/jarvis/mcp-design-studio/dist/index.js]`

### Plano de Execucao (apos reinicio)

Comando: `*design-squad go` para orquestrar:

1. **Color Utils** — validar/gerar paleta definitiva (resolver divergencia brandbook vs tokens)
2. **WCAG Contrast** — auditar todos os pares fg/bg atuais
3. **Google Fonts** — comparar Nunito vs DM Sans para heading
4. **Iconify** — buscar icones terapeuticos para o app
5. **Token Provider** — transformar tokens para multi-plataforma
6. **Rebrand completo** no codigo (Serenity AI → Anipis em todos os arquivos)
7. **Alinhar tipografia** com decisao final (Nunito ou DM Sans)

### Design Squad Envolvido

| Agente | Papel |
|--------|-------|
| @ux-design-expert | Lider — decisoes visuais, paleta, tipografia |
| @dev | Implementacao — tokens, componentes, rebrand |
| @qa | Validacao — WCAG, contraste, testes visuais |
| Mind Clones | Don Norman, Dieter Rams (UX), Rafael Calvo (wellbeing) |

**Why:** Brandbook e implementacao divergem em cores e tipografia. MCP Design Studio fornece ferramentas para tomar decisoes baseadas em dados (contraste WCAG, font metrics, color harmony).
**How to apply:** Ao reiniciar, usuario vai pedir `*design-squad go`. Carregar este contexto, ativar design squad, usar MCP tools para cada decisao.
