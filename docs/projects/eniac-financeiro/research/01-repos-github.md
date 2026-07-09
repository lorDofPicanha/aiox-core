# Frente 1 — Scouting de Repositórios OSS (GitHub)

> Data: 2026-06-20 · Stack alvo: Next.js 15 / React 19 / TS / Supabase (Postgres)
> Postura de licença: SaaS futuro → MIT/Apache/BSD preferidos; AGPL/Elastic/BSL = traps.
> Veredito: FORK (copia e evolui) · LIBRARY (depende) · REFERENCE (estuda, não importa) · SKIP.

## Shortlist (verificado via GitHub API em 2026-06-20)

| # | Repo | Stars | Licença | Stack | Atividade | Veredito |
|---|------|------:|---------|-------|-----------|----------|
| 1 | formancehq/ledger | 1.3k | **MIT** ✅ | Go | Ativo | LIBRARY/REFERENCE — núcleo partida-dobrada programável |
| 2 | pluggyai/pluggy-node (+quickstart) | 18/62 | ⚠️ sem LICENSE (SDK oficial) | TS | Ativo | LIBRARY — caminho primário Open Finance Brasil |
| 3 | actualbudget/actual | 27.1k | **MIT** ✅ | TS | Ativo | REFERENCE/FORK — minerar ledger/import/sync |
| 4 | tigerbeetle/tigerbeetle | 16.3k | **Apache-2.0** ✅ | Zig | Ativo | REFERENCE — invariantes de partida-dobrada |
| 5 | midday-ai/midday | 14.5k | **AGPL-3.0** ⛔ | Next+Supabase+TS | Ativo | REFERENCE-ONLY — gêmeo do stack; blueprint de arquitetura/UX |
| 6 | flash-oss/medici | 349 | **MIT** ✅ | TS | Ativo | REFERENCE — ledger lib, mas Mongoose (≠ Postgres) |
| 7 | firefly-iii/firefly-iii | 23.8k | **AGPL-3.0** ⛔ | PHP/Laravel | Ativo | REFERENCE-ONLY — modelo de regras/categorização |
| 8 | getlago/lago | 10.0k | **AGPL-3.0** ⛔ | Go | Ativo | REFERENCE-ONLY — billing usage-based (se produtizar) |
| 9 | beancount/fava | 2.5k | MIT (engine beancount=GPL-2.0 ⛔) | Python | Ativo | REFERENCE — semântica partida-dobrada |
| 10 | belvo-finance/belvo-js | n/a | (era MIT) | TS | 🔴 REPOS PRIVADOS | SKIP — saiu do OSS; usar Pluggy |
| 11 | maybe-finance/maybe | 54.2k | **AGPL-3.0** ⛔ | Ruby/Rails | 🟠 STALE (jul/2025) | REFERENCE-ONLY — inspiração UX |
| 12 | akaunting/akaunting | 9.9k | **BSL 1.1** ⛔ | PHP/Laravel | Ativo | REFERENCE-ONLY — schema multi-empresa (licença proíbe reuso) |

**Menções:** formancehq/numscript (MIT, DSL de postings) · juspay/hyperswitch (Apache, pagamentos — SKIP p/ escopo) · invoiceninja (Elastic ⛔) · hledger (GPL ⛔ referência) · erpnext (GPL, pesado, SKIP) · **pluggy-mcp** (tool de dados bancários p/ agentes IA — diretamente útil) · meu-pluggy (181⭐, demo OFB connect).

**IA-em-finanças OSS = raso** (nenhum repo com tração p/ categorização/NL-to-SQL financeiro). → Construir in-house; ativo reusável = `pluggy-mcp` como superfície de dados pros agentes.

## Fundação recomendada (compor 3 peças MIT/Apache, NÃO forkar AGPL)

- **A. Núcleo financeiro →** Formance Ledger (MIT) + Numscript (MIT) como microserviço de ledger ao lado do Supabase. Supabase = dados de app (empresas, users, categorias, docs); Formance = fonte da verdade de movimentação (atômico, imutável, auditável, multi-empresa/consolidação). *Fallback single-stack:* padrão medici reimplementado em Postgres, com invariantes do TigerBeetle como checklist.
- **B. Open Finance →** Pluggy (pluggy-node + quickstart Vercel + pluggy-mcp). Único caminho TS-nativo de produção (Belvo fechou OSS).
- **C. Skeleton/UX →** Midday como referência (AGPL, não forkar) + Actual (MIT) como poço de código copiável.

**Caminho de build:** Supabase (dados + RLS multi-empresa) → Formance (ledger MIT) → Pluggy SDK (feeds OFB) → agentes IA (AI SDK) ligados a pluggy-mcp + categorizador próprio em Postgres → UI no padrão Midday, código do Actual. Zero AGPL/BSL/Elastic no produto entregue.

## Traps de licença (evitar)
- AGPL (Midday/Firefly/Lago/Maybe): cláusula de rede obriga abrir TODO o código do produto servido. Só referência.
- BSL 1.1 (Akaunting): proíbe explicitamente >1 empresa, >2 users, >1000 invoices, white-label, rodar como serviço — exatamente o que queremos. Só estudar schema.
- Elastic 2.0 (Invoice Ninja): proíbe serviço hospedado. SKIP.
- GPL (beancount engine, hledger, erpnext): copyleft forte. Só referência.
- Belvo: repos privados — padronizar em Pluggy.
- Pluggy: SDKs sem LICENSE SPDX (oficiais, p/ integradores pagos) → confirmar termos comerciais antes de depender.

**Blocos de licença limpa usáveis:** Formance+Numscript (MIT), Actual (MIT), TigerBeetle (Apache), Fava UI (MIT), Hyperswitch (Apache, se pagamentos entrarem).
