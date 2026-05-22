# Tocks T5 — Stealth Luxury Copy v3 (C007 V+E)

**Data:** 12/Mai/2026
**Origem:** HYDRA Tocks tactic T5
**Owner:** @copy + @ralph-burns
**Prazo:** D+5 (17/Mai) — rodar PARALELO a v2, não substituir
**Fontes HYDRA:** #73 Stealth Luxury Fashion Capital Sci Direct 2025 + #94 303 London Luxury Meta HNW Guide + #47 Mili HNWI Mind

---

## Hipótese a testar

**Copy v2 atual:** "Mesa de bilhar Vértice R$15.990. Madeira nobre brasileira, base inox..." — direta, mostra preço, vende features.

**Copy v3 stealth:** zero preço no creative, referências culturais (designers/movimentos), tom editorial. **Qualifica HNW real** (filtra curioso preço-shopping → quem responde já sabe que vai pagar).

Hipótese: CTR pode **cair** (volume↓), mas Qualified rate Sales AI **sobe** (qualidade↑↑). Trade-off correto pra high-ticket.

---

## 4 Copy Variations (Vértice + Elipse, ambiente + close)

### AD-V3-V1 — Vértice Ambiente (Donald Judd reference)

**Title:** *Vértice. Disciplina geométrica.*

**Body:**
*"Inspirada na disciplina geométrica de Donald Judd.*

*Base trapezoidal monolítica em nogueira americana. Caçapa bronze maciço. Lã italiana preta.*

*Feita à mão em Itajaí. Sob encomenda.*

*— Tocks, desde 1998."*

**CTA:** `Send Message` (WhatsApp)

---

### AD-V3-V2 — Vértice Close (Bauhaus minimalism)

**Title:** *Forma segue função. Tocks segue forma.*

**Body:**
*"A Vértice não tem decoração. Tem geometria.*

*Cada ângulo serve a uma função: jogar, ou contemplar.*

*Atelier Tocks · Itajaí · 26 anos."*

**CTA:** `Send Message`

---

### AD-V3-E1 — Elipse Ambiente (Sottsass/Memphis heritage)

**Title:** *Elipse. Para quem herda peças, não compra móveis.*

**Body:**
*"Ipê champagne, cap bronze envelhecido, lã italiana creme.*

*Concebida como peça única — produção limitada a 12 unidades/ano.*

*Itajaí-SC, atelier desde 1998."*

**CTA:** `Send Message`

---

### AD-V3-E2 — Elipse Close (Quiet luxury / Loro Piana tone)

**Title:** *A próxima geração vai usar essa mesa.*

**Body:**
*"Não somos rápidos. Somos exatos.*

*60 dias de produção. 5 anos de garantia estrutural. Uma vida de uso.*

*Tocks Atelier."*

**CTA:** `Send Message`

---

## Princípios stealth luxury (HYDRA-derivados)

### O que REMOVER de v2 → v3

❌ **Preço explícito** ("R$15.990") — move para Sales AI no qualifier
❌ **Features lista** ("madeira nobre + base inox + lã italiana") — mantém SÓ uma feature por ad
❌ **Adjetivos genéricos** ("luxuoso", "premium", "exclusivo")
❌ **CTAs urgentes** ("Garanta o seu hoje", "Vagas limitadas")
❌ **Emojis** (✨💎🔥) — destroem registro editorial

### O que ADICIONAR

✅ **Referência cultural** (designer/movimento/era) por ad — Judd, Bauhaus, Sottsass, Loro Piana
✅ **Origem geográfica explícita** ("Itajaí-SC desde 1998")
✅ **Escassez DISCRETA** ("produção limitada 12u/ano" — verificável + ético)
✅ **Tom de manifesto** — afirmações curtas, sem qualificadores
✅ **Heritage** ("26 anos", "herdar", "próxima geração")

---

## Anti-padrões guru-trap evitados (HYDRA Quinn checklist)

- ✅ NÃO "como eu fiz R$1MM em 6 meses" — não aplica a luxo físico
- ✅ NÃO countdown timer fake
- ✅ NÃO testimonial inventado
- ✅ NÃO "garantia retorno 100%" sem lastro
- ✅ NÃO claim não-verificável (todos os dados são verificáveis no atelier ou são citações culturais públicas)

---

## Setup A/B teste (PARALELO, não substituir)

### Estrutura
- Adset **C007 Premium V+E** mantém R$60/d com 4 ads v2 ATUAIS (não tocar)
- **Criar adset paralelo `C007-V3-STEALTH`** R$30/d (pós-PIX) com mesmos 4 ads V3 acima
- Mesma audience cirúrgica (Art Collecting + Architecture + Bens Luxo)
- Mesma geo (Sudeste+Sul 7 estados PRESENCE)

### Métricas comparativas (14d)

| Métrica | v2 (controle) | v3 stealth (teste) | Vencedor |
|---|---|---|---|
| CTR | ~2,3% | esperado ~1,5-2% | secundário |
| CPL/msg | ~R$6 | esperado R$8-12 | NÃO decide |
| **Qualified rate (Sales AI)** | ~10% | esperado **25-40%** | **DECIDE** |
| **CAC real Qualified→Sale** | ? | esperado **-30-50%** | **DECIDE** |

### Gate D+14 (26/Mai)
- Se Qualified rate v3 ≥ 2× v2 → migrar 80% spend para v3
- Se Qualified rate v3 < 1,5× v2 → kill v3, manter v2
- Se v3 zero leads em 5d → diagnostic (creative muito hermético?)

---

## Tracking IDs futuros (post-creation)

```
adset_id_v3: <TBD após criação>
ad_ids_v3:
  V1: <TBD>
  V2: <TBD>
  E1: <TBD>
  E2: <TBD>
```

Salvar em `D:/jarvis/mcp-ads-bridge/data/tocks-c007-v3-ads.json`

---

## Bloqueadores antes de executar

1. **PIX user** — adset paralelo R$30/d incremental, total Meta R$130/d, runway R$2k/15d
2. **CAPI Sales AI deployed** — sem isso, Qualified rate só é medível manualmente no spreadsheet (não automated)
3. **6 novos image hashes** (P0-D) — v3 deveria usar hashes editoriais novos (E3 detalhe macro é perfeito para Elipse stealth)

Sem (1) e (2), v3 fica teórico. Sem (3), v3 usa mesma imagem v2 e teste perde 50% do sinal.
