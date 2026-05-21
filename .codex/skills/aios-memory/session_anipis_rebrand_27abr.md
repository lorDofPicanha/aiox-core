---
name: Sessão Anipis Rebrand 27/Abr
description: Diagnóstico Alex (analyst) escolheu Cenário B (MVP Launch R$2-6k 14d). User aprovou rebrand completo via design-squad ANTES de código. Logo + Brandbook completo + revisão antes de implantar.
type: project
originSessionId: 1c3ebae7-8eb1-477b-872e-af2386e11573
---
## Sessão Anipis Rebrand — 27/Abr/2026

### Contexto
- Anipis estava parado há 19 dias (última atividade 08/Abr)
- Orion fez status report → user pediu @analyst diagnosticar
- Alex (analyst) recomendou **Cenário B (MVP Launch)** R$2-6k em 14 dias
- Doc completo: `docs/projects/serenity-ai/diagnostic-2026-04-27.md`

### Decisão do user (27/Abr noite)
- **Continuar com rebrand** Serenity AI → Anipis
- **Brainstorm design-squad ANTES** de qualquer criação (regra "Visual Before Code")
- Quer logo + brandbook completo
- **NÃO IMPLANTAR** sem revisão do user

### Estado conhecido divergência brandbook vs implementação
| Aspecto | BRANDBOOK-ANIPIS.md (627 linhas) | Código atual |
|---------|---------------------------------|--------------|
| Cor primária | Coral quente #E8764B (Aurora) | Teal #4A9BA8 (Therapeutic) |
| Font heading | Nunito Bold | DM Sans |
| Paleta secundária | Salvia #4A9672 | Sage Green #6B9E7A |
| Acento | Dourado #E6AE2C (Luz) | Warm Peach #D4926E |

### Arquivos brand existentes
- `apps/serenity-ai/docs/brand/BRANDBOOK-ANIPIS.md` (627 LoC, v1.0)
- `apps/serenity-ai/docs/brand/BRAND-VOICE-ANIPIS.md`
- `apps/serenity-ai/docs/brand/BRAND-STORYTELLING-ANIPIS.md`
- `apps/serenity-ai/docs/brand/figma-tokens.json`
- `apps/serenity-ai/docs/brand/rebrand-audit-anipis.md`
- `apps/serenity-ai/apps/web/src/styles/design-tokens.css` (457 linhas)

### Etimologia ANIPIS
ANIPIS = anima (alma, latim) + elpis (esperança, grego) = "alma de esperança"
- Campo TOTALMENTE LIMPO (zero conflito wellness/tech/saúde mental)
- Domínios: anipis.com, anipis.app, anipis.ai (NÃO REGISTRADOS — risco Wysa BR)
- INPI: nenhum resultado encontrado — campo livre

### Plano de execução autorizado
1. **Design-chief** orquestra Tier 0 (briefing) → Tier 1 (masters) → Tier 2 (specialists)
2. **Brainstorm primeiro** com mind clones:
   - Dieter Rams, Don Norman (UX)
   - Marty Neumeier (brand)
   - Tobias van Schneider, Erik Spiekermann (visual/typography)
   - Refika Anadol (generative art / motion potential)
   - Rafael Calvo (positive computing/wellbeing — clone do projeto)
   - Donald Miller (storytelling)
3. **Outputs esperados:**
   - Brainstorm doc (3-5 direções de identidade exploradas)
   - 3+ direções de logo (concept rationale + sketches)
   - Brandbook completo v2 (cores, tipografia, voz, ícones, ilustrações, motion, do/dont, accessibility WCAG AA, exemplos aplicados)
   - Tokens (CSS vars + figma-tokens.json + Tailwind config preview)
4. **NÃO IMPLANTAR** — entregar para user revisar
5. Após aprovação user, abrir story SAI-RB-001 para implantação

### Mind Clone Consultation Bug (não-bloqueante mas relevante)
- `.aios-core/core/jarvis/self-consultation.js` NÃO EXISTE
- Reportado 23/Abr Tocks; Alex confirmou hoje 27/Abr
- Workaround: agentes consultam clones via leitura direta de `.aios-core/development/agents/{clone-id}.md`

### Estado final entregue (27/Abr noite)

**Brainstorm + brand exploration:** ✅ 13 docs (5.861 linhas) em `D:\AIOS\docs\projects\serenity-ai\rebrand-2026-04-27\`
- 00-BRAINSTORM-CONCLAVE.md (315) — 9 mind clones simulados (Marty Neumeier, Tobias van Schneider, Erik Spiekermann, Dieter Rams, Don Norman, Refika Anadol, Rafael Calvo, Donald Miller, John Maeda) — NÃO EXISTEM como arquivo, foram simulados
- 01-LOGO-DIRECTIONS.md (298) — D1/D2/D3 specs + prompts
- 02-COLOR-SYSTEM.md (353) — Multi-theme + WCAG validado
- 03-TYPOGRAPHY.md (394)
- 04-ICONOGRAPHY.md (349) — Phosphor + 4 customizados
- 05-MOTION-PRINCIPLES.md (455)
- 06-ILLUSTRATION-PHOTO.md (341)
- 07-VOICE-REFINED.md (454) — delta sobre v1.0
- 08-COMPONENT-PREVIEWS.md (1188) — HTML/CSS specs 5 mockups
- 09-TOKENS-DRAFT.md (774) — design-tokens-v2.css + figma-tokens-v2.json + tailwind preview
- 10-BRANDBOOK-V2.md (617) — Brandbook v2.0-DRAFT consolidado
- 11-DECISIONS-LOG.md (174) — 18 decisões fechadas + 5 abertas
- 12-EXEC-SUMMARY.md (149) — ponto de partida user

**Mind clones reais consultados (existem):** acacia-parks, bj-fogg, alison-darcy

**PNGs gerados:** ✅ 22/22 via Flux 1.1 Pro (Replicate API direto, ~$1.10 saldo Bretda, 6min)
- 12 logos: `logos/direction-{1,2,3}/logo-{light,dark,mono}.png` + `favicon.png` cada
- 10 component previews: `component-previews/{01-chatwindow,02-moodcheckin,03-breathing,04-onboarding,05-hero}-{light,dark}.png`
- Aux: `.render-script.mjs` (reutilizável) + `.render-report.json`

**Pitfalls Flux 1.1 Pro:**
- Width/height ≤ 1440 hard limit
- Aspect_ratio só aceita valores fixos (1:1, 16:9, 3:2, 2:3, 4:5, 5:4, 9:16, 3:4, 4:3, custom)
- Rate limit conta Bretda <$5: throttle 6 req/min, concorrência 1, gap 11s, retry com backoff
- Texto multi-frase em PT garbled (limitação Flux) — usar PNGs pra layout/cor/hierarquia, NÃO copy

**Ressalvas visuais (re-render ~$0.05 cada se user pedir):**
- D2 Aurora arc saiu como crescent multi-line layered (coral+gold+navy+sage) em vez de stroke gradient único 200°
- D3 Breathing form saiu como swirl/yin-yang em vez de blob orgânico
- D1 wordmark saiu navy ao invés de coral (design-chief avalia "até melhor")
- Hero/ChatWindow têm copy parcialmente garbled (Flux)
- MoodCheckin/Breathing/Onboarding fiéis ao brief

### Decisões dominantes (aguardando user confirmar)

| Item | v2 escolhido | Substitui | Aprovação user |
|------|-------------|-----------|----------------|
| Cor primária | #DC6B3A Aurora Coral refinado | #E8764B v1 / Teal #4A9BA8 impl | PENDENTE |
| Heading font | General Sans | Nunito v1 / DM Sans impl | PENDENTE |
| Body font | Inter (mantém) | Inter | PENDENTE |
| Italic accent | Fraunces Italic (pull-quotes) | n/a | PENDENTE |
| Logo | D2 Aurora arc + D3 Breathing form combinado | n/a | PENDENTE |
| Multi-theme | Warm + Calm + Soft tokens (switcher v2) | single | PENDENTE |

### Próximos passos pós-aprovação user

1. Story SAI-RB-001 abrir com 9 fases (50-80h dev / 1.5-2 sprints)
2. @design-systems-engineer implementa tokens + fonts
3. @ui-designer cria 4 ícones customizados + 5 ilustrações tier 1
4. @design-lead quality gate
5. @dev migra 5 componentes principais

### Reminder próxima sessão

User vai revisar:
- 12-EXEC-SUMMARY.md (já aberto)
- 11-DECISIONS-LOG.md (já aberto)
- Logos D1/D2/D3 light + 5 component previews light (todos abertos)

Esperar resposta sobre:
1. Logo direction principal
2. Cor primária confirmada
3. Fraunces Italic sim/não
4. Theme switcher MVP ou v2
5. Re-renderizar D2/D3 com prompt mais cirúrgico?

### 3 Quick Wins paralelos (não bloqueiam rebrand)
- Registrar `anipis.com.br` + `.app` (R$80, precisa CNPJ user)
- Iniciar INPI classes 9+42+44 (R$660-1320, gov.br/inpi)
- Cotar advogado OAB review Privacy+Terms (R$2-5k)

**Why:** User quer Anipis lançado em ~14 dias com brand consistente. Divergência atual brandbook vs implementação bloqueia coerência. Design squad-first é regra do user (Visual Before Code).
**How to apply:** Próxima sessão, ler este memo + diagnostic-2026-04-27.md + revisar deliverables design-squad. NÃO implantar sem aprovação explícita user.
