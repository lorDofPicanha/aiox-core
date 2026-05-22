# Iconography v2

**Data:** 2026-05-16
**Autor:** Uma (@ux-design-expert)
**Mudança vs v1:** Lucide → **Phosphor Icons** (base) + 4 ícones **proprietários** Anipis (signature)
**Razão:** Lucide é lingua-franca de SaaS; Anipis precisa de signature visual ownable em pelo menos 4 momentos críticos. Phosphor tem variantes (regular/duotone/fill) que dão flexibilidade sem precisar gerenciar 3 bibliotecas.

---

## Estratégia: Phosphor base + 4 custom

### Por que Phosphor?

| Critério | Lucide (v1) | Phosphor (v2) |
|----------|-------------|---------------|
| License | ISC | MIT |
| Total icons | ~1400 | ~9000 |
| Style variants | 1 (outline) | 6 (thin/light/regular/bold/duotone/fill) |
| Stroke consistency | OK | Excelente |
| React package | lucide-react | @phosphor-icons/react |
| Tree-shaking | OK | OK |
| Tamanho bundle | ~3KB/icon | ~3KB/icon |
| Brand match | Genérico SaaS | Mais humanista, organic curves |

Phosphor é **menos comum em apps SaaS** = menos cliché. Bedrock para signature.

### Style padrão

- **Variant default**: `regular` (não outline pure, regular tem fill leve em alguns ícones)
- **Stroke width interno**: 1.5px em 24px base
- **Rounded caps/joins**: sim (alinhado com border-radius "wellness" da UI)
- **Corner radius interno**: 1px (Phosphor já vem assim)

### Sizes (mantidos vs v1)

| Token | Tamanho | Uso | Stroke effective |
|-------|---------|-----|------------------|
| `--icon-xs` | 16px | Inline com texto, metadata | 1.25px |
| `--icon-sm` | 20px | Botões small, badges | 1.5px |
| `--icon-md` | 24px | **Padrão** — menus, actions | 1.5px |
| `--icon-lg` | 32px | Destaque, card icon | 1.75px |
| `--icon-xl` | 48px | Empty states, onboarding | 2px |

---

## Mapeamento Phosphor → uso Anipis

Mapeamento curated (não todos os 9000 — apenas o set canon de ~40 ícones que cobre 95% das interfaces).

### Navigation & Actions

| Função | Phosphor name | Variant | Notes |
|--------|---------------|---------|-------|
| Voltar | `ArrowLeft` | regular | Header navigation |
| Fechar / Cancelar | `X` | regular | Modais, toasts |
| Menu hamburguer | `List` | regular | Mobile nav |
| Configurações | `GearSix` | regular | Settings entry |
| Perfil | `UserCircle` | regular | Profile entry |
| Buscar | `MagnifyingGlass` | regular | Search |
| Filtrar | `FunnelSimple` | regular | Filter |
| Mais opções | `DotsThreeVertical` | regular | Overflow menu |
| Enviar mensagem | `PaperPlaneRight` | regular | Send button (chat) |
| Microfone (voice input) | `Microphone` | regular | Voice input button |
| Anexar | `Paperclip` | regular | (roadmap fase 2 — anexar imagem) |

### Communication

| Função | Phosphor name | Variant | Notes |
|--------|---------------|---------|-------|
| Chat / conversa | `ChatCircleDots` | regular | Chat tab, history list |
| Mensagem nova | `EnvelopeSimple` | regular | (raro — Anipis não tem email push) |
| Telefone (crisis CTA) | `Phone` | **fill** | Crisis ResourceCard CTA — fill para impacto |
| Phone-x (recusar) | `PhoneX` | regular | Cancel call confirmation |

### Status & Feedback

| Função | Phosphor name | Variant | Notes |
|--------|---------------|---------|-------|
| Sucesso | `CheckCircle` | regular | Form validation, exercise complete |
| Erro | `XCircle` | regular | Form error |
| Atenção | `WarningCircle` | regular | Warning state |
| Informação | `Info` | regular | Tooltip, helper text |
| Crisis alerta | `Warning` | **fill** | Crisis banner orange — fill para gravidade |
| Crisis urgência | `WarningOctagon` | **fill** | Crisis banner red — fill para urgência |
| Loading | `CircleNotch` | regular | Spinning loader (com prefers-reduced-motion fallback texto) |

### Privacy & Trust

| Função | Phosphor name | Variant | Notes |
|--------|---------------|---------|-------|
| Cadeado (privacidade) | `Lock` | regular | Privacy section settings |
| Olho (visualizar) | `Eye` | regular | Show password, show memory |
| Olho fechado | `EyeSlash` | regular | Hide password, hide memory |
| Escudo (segurança) | `ShieldCheck` | regular | Disclaimer, security badge |
| Lixeira (deletar) | `Trash` | regular | Delete memory, delete account |
| Download | `DownloadSimple` | regular | Export PDF |

### Wellness & Domain

| Função | Phosphor name | Variant | Notes |
|--------|---------------|---------|-------|
| Coração (favoritar, like) | `Heart` | regular | Save, favorite |
| Coração preenchido | `Heart` | **fill** | Active favorited state |
| Diário | `BookOpenText` | regular | Mood log, journal entries |
| Calendário | `CalendarBlank` | regular | Date picker, history |
| Gráfico mood | `ChartLine` | regular | Mood analytics |
| Estrela (avaliar) | `Star` | regular | Rating exercise effectiveness |
| Lua (noite/dark) | `MoonStars` | regular | Dark mode toggle |
| Sol (claro/light) | `Sun` | regular | Light mode toggle |
| Globo (idioma) | `Globe` | regular | Language settings (roadmap) |

### Edge cases

| Função | Phosphor name | Variant | Notes |
|--------|---------------|---------|-------|
| Sem internet | `WifiSlash` | regular | Offline indicator |
| Recarregar | `ArrowsClockwise` | regular | Retry, refresh |
| Compartilhar | `Share` | regular | Share resource link |
| Expandir | `ArrowsOut` | regular | Fullscreen modal |
| Colapsar | `ArrowsIn` | regular | Close fullscreen |

---

## Os 4 ícones proprietários Anipis (signature)

Estes 4 NUNCA são substituídos por Phosphor. São **brand signature** — quando user vê, lê "Anipis".

### Custom 1 — `anipis-flame` (Symbol of Anima)

**Conceito:** Forma orgânica que evoca **chama suave** + **pétala** + **gota** simultaneamente. Referencia o conceito "anima" (sopro vital) sem ser literal.

**Construction (24px base):**
- Viewbox: `0 0 24 24`
- Path: Bezier curves simétricas formando shape "flame-petal"
- Base width: 12 (centralizada)
- Altura total: 22 (margem 1px top/bottom)
- Curvatura: ponto inferior em (12, 22), ascende com Bezier control points (8, 18) e (8, 10), pico arredondado em (12, 2), espelhado lado direito
- Stroke: 1.5px regular, ou fill em variant
- Variants: outline (regular) / fill / duotone (chamapétala outer + inner glow)

**SVG draft:**
```xml
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2C8 6 6 10 6 14C6 18 8 22 12 22C16 22 18 18 18 14C18 10 16 6 12 2Z"
        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

**Uso:**
- Logo símbolo (versão small/favicon)
- Splash screen
- About / "Sobre o Anipis" page
- Loading state premium
- Sticker em materiais marketing

**Do/Dont:**
| Do | Dont |
|----|------|
| Manter ratio 12:22 (largura:altura) | Não inverter (chama é up-pointing) |
| Stroke 1.5px ou fill solid | Não usar duplo stroke |
| Animation breathing 8s ciclo permitida | Não animar com flickering (clichê chama) |

### Custom 2 — `anipis-breath` (Breathing Cycle)

**Conceito:** Visualização do ciclo respiratório — círculo central com 4 arcs concêntricos que sugerem expansão. Usado no exercício de respiração + como wayfinding "isto é exercício".

**Construction (24px base):**
- Círculo central preenchido: raio 4, centro (12, 12)
- Arc 1 (concêntrico interno): raio 7, stroke 1.5, 240° (top arc)
- Arc 2: raio 10, stroke 1.5, 180° (semi-circle bottom)
- Inverso ou simétrico OK
- Variant duotone: círculo central preenchido + arcs outline

**Uso:**
- Botão "Iniciar exercício de respiração" no chat
- Card de exercício respiração
- Onboarding "explicando exercícios"
- Settings → "Notificação respire?" toggle

### Custom 3 — `anipis-companion` (The Companion Orb)

**Conceito:** Ícone-versão do orbe principal do Anipis. Forma orgânica circular com leve assimetria (não círculo perfeito) que sugere "presença viva". Usado quando UI precisa referir ao Anipis como entidade (não brand institucional, mas "o companion ali").

**Construction (24px base):**
- Forma blob orgânica, simétrica vertical, ligeiramente assimétrica horizontal
- Construction: 8-point bezier path com curvatura suave
- Centro deslocado 0.5px para left (sutileza orgânica)
- Variants: outline / fill / duotone (outer organic + inner small circle "core")

**Uso:**
- Chat header (avatar do Anipis, vs avatar do user)
- Notifications "Anipis te respondeu" (raro)
- Memory inspector — "memória do Anipis"
- Empty states — versão grande (xl 48px) anima com breathing

### Custom 4 — `anipis-bridge` (Handoff to Human)

**Conceito:** Símbolo de **ponte/conexão** entre dois pontos. Representa transição da IA para apoio humano. Não é seta direcional — é arco-ponte (conexão lateral, não hierarquia).

**Construction (24px base):**
- Dois círculos pequenos (raio 2.5) em (4, 12) e (20, 12)
- Arco conectando-os, peak em (12, 5), curvatura suave Bezier
- Stroke 1.5 outline; variant fill preenche círculos + linha arco
- Sentido: nunca direcional (não seta) — bidirecional emphasis (relação humana)

**Uso:**
- Botão "Falar com pessoa real" no header chat
- Resource handoff cards (CVV/SAMU/CAPS)
- Onboarding "explicando handoff humano"
- Settings → "Profissionais parceiros" (roadmap fase 2)

---

## Implementação técnica

### Package structure

```
apps/serenity-ai/src/components/icons/
├── index.ts             ← exports todos
├── phosphor-wrapper.tsx ← typed wrapper para Phosphor
├── custom/
│   ├── AnipisFlame.tsx
│   ├── AnipisBreath.tsx
│   ├── AnipisCompanion.tsx
│   └── AnipisBridge.tsx
└── README.md            ← guia de uso
```

### Typed wrapper exemplo

```tsx
// phosphor-wrapper.tsx
import { Icon, IconProps } from '@phosphor-icons/react';
import { forwardRef } from 'react';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconVariant = 'regular' | 'fill' | 'duotone';

const sizeMap: Record<IconSize, number> = {
  xs: 16, sm: 20, md: 24, lg: 32, xl: 48
};

interface AnipisIconProps extends Omit<IconProps, 'size'> {
  size?: IconSize;
  variant?: IconVariant;
}

export const createAnipisIcon = (PhosphorIcon: Icon) =>
  forwardRef<SVGSVGElement, AnipisIconProps>(
    ({ size = 'md', variant = 'regular', ...props }, ref) => (
      <PhosphorIcon
        ref={ref}
        size={sizeMap[size]}
        weight={variant === 'duotone' ? 'duotone' : variant === 'fill' ? 'fill' : 'regular'}
        {...props}
      />
    )
  );
```

### Uso no app

```tsx
import { Phone, ChatCircleDots } from '@phosphor-icons/react';
import { AnipisFlame, AnipisCompanion } from '@/components/icons';

// Phosphor
<Phone size={24} weight="fill" className="text-crisis-red" />

// Custom
<AnipisCompanion size="lg" variant="duotone" className="text-anipis-500" />
```

### A11y

- Todos os ícones decorativos: `aria-hidden="true"`
- Ícones com semântica (button único com icon): `aria-label="..."` no botão pai
- Mood scale icons: aria-label descreve nível ("Muito difícil", "Difícil", etc.)
- Custom icons exposed com `<title>` interno SVG para screen readers (fallback)

---

## Regras

1. **Phosphor regular** é default. Fill/duotone só para crise, brand moments, ou ênfase visual proposital.
2. **Custom icons NUNCA em ícones de UI genéricos** (Phosphor cobre 95%). Custom é signature reservada aos 4 momentos.
3. **Nunca misturar bibliotecas** — não usar Heroicons + Lucide + Phosphor. Só Phosphor + Custom.
4. **Stroke consistency** validada em CI (lint rule: ícones devem usar `weight="regular"` ou listed exceptions).
5. **Color via `currentColor`** — todos os ícones herdam cor do parent text. Permite theming sem refactor.

---

## Quantidade total

| Categoria | Count |
|-----------|-------|
| Phosphor icons curated | ~40 |
| Custom Anipis icons | 4 |
| **Total set** | **44** |

vs v1: Lucide tinha ~30 explicitamente usados, mas ~150 disponíveis "se precisar" — descontrole. v2 é set fechado, qualquer icon novo precisa PR review.

---

## Próximos passos

1. Install: `pnpm add @phosphor-icons/react` (substitui `lucide-react`)
2. Criar 4 custom icons em `apps/serenity-ai/src/components/icons/custom/`
3. Refactor todos imports Lucide → Phosphor (estimativa: ~50 arquivos)
4. Adicionar lint rule eslint-plugin-anipis (custom): bloqueia imports lucide-react
5. Storybook section "Iconography" com galeria de uso

---

*Uma — UX Design Expert · 2026-05-16*
*"Ícone genérico é interface invisível. Ícone signature é marca."*
