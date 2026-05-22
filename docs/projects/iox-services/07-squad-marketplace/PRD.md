# #07 — Squad Marketplace

**Tier:** B
**Status:** ⚪ pending (aguarda 3-4 squads validados em produção dos #01-06)

---

## DSPC

**D — Dor cara:**
Builders/devs AIOS criam squads para próprios clientes. Cada squad bom é replicável em outros clientes do mesmo vertical. Hoje cada um reinventa. Não há marketplace, não há rev-share, conhecimento fica em silos.

**Custo semanal visível (interno):** 5 builders × 3-5h/sem reinventando squad similar = 15-25h/sem desperdício × R$300/h = R$4.5-7.5k/sem.

**S — Squad:**
- `agent-squad-publisher` — empacota squad (`agents/` + `skills/` + tests + docs) em pacote portátil
- `agent-vertical-tagger` — categoriza por vertical (jurídico bancário, contabilidade EC, fisio clínico, etc.)
- `agent-license-handler` — assina pacote + DRM leve + tracking de uso
- `agent-discover-engine` — busca/filtra squad por dor/vertical
- `agent-installer` — instala squad no AIOS do comprador com 1 comando
- `agent-revshare-tracker` — métricas de uso → rev-share automático

**P — Pitch (interno):**
> "AIOS Squad Marketplace permite a builders monetizar squads validados, recebendo rev-share quando outros builders implementam a versão deles em clientes — escalando conhecimento sem perder controle"

**C — Modelo:**
- Comprador paga preço fixo OU MRR pelo squad
- Builder original recebe 70%, AIOS recebe 30%
- AIOS curadoria + infra + DRM

---

## Vertical inicial sugerido

**Internal-first:** começar como **internal marketplace** entre nossos 5-10 primeiros builders parceiros. Validar economia + curadoria. Depois abrir externo.

---

## Reuse de assets AIOS

| Asset | Função |
|---|---|
| `squad-creator` | Já cria squads — falta packaging + publishing |
| `entity-registry` | Index de squads publicados |
| `IDS` (Incremental Development System) | Anti-duplicação na marketplace |
| `db-sage` | Schema multi-tenant pra licensing tracking |
| `legal-chief` | Termos de uso, royalty, IP |

---

## Stack proposto

- **Backend:** Next.js + Supabase
- **Pacote portátil:** ZIP com `agents/` + `skills/` + `commands/` + `tests/` + `LICENSE.md` + `README.md`
- **DRM leve:** signature check + telemetria de uso (não bloqueia, mas tracks)
- **Pagamento:** Stripe Connect (rev-share automático) ou Paddle

---

## Hipóteses

1. ❓ Builders aceitam compartilhar squads se receberem rev-share?
2. ❓ Compradores confiam em squad de "outro builder"? Curadoria importa.
3. ❓ DRM leve é suficiente ou builders vão clonar e revender?

---

## Quando começar

Só começar quando tivermos:
- 3+ squads validados em produção (#01, #02, #03 minimamente)
- 5+ builders parceiros interessados
- Caso de demanda repetida ("outro escritório jurídico quer squad similar ao do Rodrigo Lins")

Trigger: `kickoff squad-marketplace`
