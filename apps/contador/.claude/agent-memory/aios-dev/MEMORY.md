# Agent Memory — aios-dev (apps/contador)

## Project
- [Contador module pattern](project_contador_module_pattern.md) — how self-contained demo modules under app/{modulo}/ are structured + the typecheck/banlist/build gates
- [Contador G6 language](project_contador_g6_language.md) — the banlist-g6 safe-fiscal-language gate and safe vocabulary
- [Contador e-CAC saúde fiscal](project_contador_ecac_saude_fiscal.md) — S3 triagem caixa postal + S5 renovação CND (engines puros/provider/feed); Node24 .mjs→.ts test trick; .mjs eslint globals gotcha
- [Contador PAR-7 radar transação](project_contador_transacao_radar.md) — app/transacao/ engine elegibilidade+gancho honorário D6; frente legal: G6 regex NÃO cobre "garante desconto/regulariza/quita" → ler à mão
- [Contador Painel cockpit](project_contador_painel_cockpit.md) — app/painel/ porta de entrada read-only que agrega manchete+top-item de 6 frentes; NÃO join cross-módulo (3 id schemas); refIso injetado pela page
