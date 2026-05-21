---
name: meta-budget-jump-max-2x-day
description: Não saltar budget Meta >2x em um dia em conta em learning phase. Esperado +20-30%/dia para preservar audience learning.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 408314f9-a076-48f1-b605-334f97dc0860
---

# Meta Budget Jump — Max 2× em 1 dia

## Regra
**Em conta Meta em learning phase, NÃO saltar daily_budget >2× em uma noite. Crescimento ideal: +20-30%/dia até target.**

## Why
12/Mai/2026: smoking gun real Bretda pós-28/Abr (depois descoberta da "Instant Form trap" estar errada) — foi **budget jump R$27/d → R$120/d (+344%)** na noite de 28/Abr 22h que destruiu o learning algorítmico.

Mecanismo:
1. Budget +344% em uma noite faz Meta expandir audience aggressivamente
2. Algoritmo entra em "modo aquisição" → puxa lookalike mais frio
3. AD05 (winner pré-28 com CPL R$5,21) perde peso no learning
4. Quando volta a dominar, é com público contaminado
5. CPL aparente cai (R$11), MAS qualidade de lead colapsa
6. Recuperação leva ~14d e ~50-100 conversões corretas

Mesmo padrão visto em Tocks (R$110/d → R$170/d com C007 launch 30/Abr, +55%) — não destrutivo pelo % menor mas adicionou variância no learning.

## How to apply

### ✅ Crescimento saudável
- Budget jump máximo: **+30% por dia** (ex: R$27 → R$35 → R$45 → R$58 → R$75)
- Para chegar de R$27 → R$120: ~7 dias (não 1 noite)
- Após cada ajuste, observar 48-72h para algoritmo estabilizar antes do próximo

### ❌ Quando NÃO saltar agressivo
- Conta com <100 conv totais no spend_cap atual (learning frágil)
- Adset recém-criado (<7 dias)
- Após mudança estrutural recente (geo, audience, creative)
- Antes de gate de validação CPL+volume

### ⚠️ Exceções aceitáveis
- Conta MADURA com >300 conv/mês estável: pode saltar +50-100% se justificado por evento
- Black Friday / Casacor / sazonalidade conhecida: planejado com 7d antecedência
- Test isolado em adset NOVO PARALELO (não substitui original): mid-jump OK porque algoritmo learning do zero

### Como reverter um budget jump destruído
Caso já tenha saltado agressivo e qualidade colapsou:
1. **Voltar pra budget original** (NÃO ficar no meio do caminho)
2. **Pausar criativos novos** introduzidos no salto
3. **Aceitar 14d de "limbo"** enquanto algoritmo recalibra
4. Medir Qualified rate (NÃO CPL) como métrica de recuperação

## Triggers
- `restore budget pre-jump {projeto}` — reverter budget para baseline pré-spike
- `gate qualidade {projeto}` — comparar Qualified rate atual vs baseline (não CPL)
