---
name: Projeto HYDRA
description: Sistema autonomo de Content Intelligence que alimenta Jarvis/Mega Brain diariamente sem intervencao humana
type: project
---

## HYDRA — Autonomous Content Intelligence System

**Status:** v1.0.0 COMPLETO + Telegram Bot + Cybersecurity Expansion. Pipeline ATIVO.
**Atualizado:** 02/Abr/2026
**Local:** `D:/AIOS/tools/hydra/` | Docs: `docs/projects/hydra-content-intel/`

### Stack Atual
Node.js, Commander CLI, rss-parser, yt-dlp, Whisper, DeepSeek API (via OpenAI SDK), js-yaml, Jest, better-sqlite3, node-cron, pino

### LLM Provider
- **DeepSeek** (deepseek-chat) como provider principal
- Multi-provider: suporta Anthropic, DeepSeek, OpenAI (auto-detect via env vars)
- API key em `tools/hydra/.env` (DEEPSEEK_API_KEY)

### Epics Status — TODOS COMPLETOS
1. **Foundation MVP (P0)** — ✅ COMPLETO
2. **Multi-Source (P1)** — ✅ COMPLETO
3. **Intelligence (P1)** — ✅ COMPLETO (semantic dedup, scoring cache, vector store)
4. **Automation (P1)** — ✅ COMPLETO (node-cron, circuit breaker, checkpoint, lock, Telegram, health)
5. **Distribution (P2)** — ✅ COMPLETO (mind-clone router, feed writer, entity graph, search, digest, feedback)
6. **Security (P2)** — ✅ COMPLETO (input sanitizer, content validator, output filter, audit logger, env validator)
7. **Anti-Hallucination (P0)** — ✅ COMPLETO

### Automacao (Epic 4)
- **Scheduler:** node-cron (2x/dia full pipeline, RSS a cada 4h)
- **Logging:** pino (JSON estruturado, redaction de API keys)
- **Alertas:** Telegram bot API
- **Resiliencia:** RetryPolicy + CircuitBreaker per-source + RateLimiter
- **Recovery:** Checkpoint em disco + lock file com TTL
- **CLI novos:** `hydra schedule start|stop|status`, `hydra health [--json]`, `hydra sources list|add|remove`

### SQLite Migration (01/Abr/2026)
- Dedup index migrado de JSON monolitico para better-sqlite3
- DB: `hydra-data/hydra.db` (tabelas: urls, content_hashes, pipeline_runs)
- 209 URLs + 209 hashes migrados, ~500x mais rapido que JSON
- Fallback para JSON se SQLite indisponivel

### Bug Fixes (01/Abr/2026)
- jarvis-writer.js: path relativo corrigido (anti-hallucination restaurado)
- Jest: wrapper bin/jest.js para ESM compatibility
- detectLanguage(): extraido para src/utils/language.js (era duplicado 6x)

### Distribution (Epic 5)
- Content router: keyword matching com pesos (keyword 0.6, department 0.3, tier 0.1)
- Feed writer: append-only em `D:/jarvis/mega brain/knowledge-feed/{clone-id}/YYYY-MM-DD.md`
- Entity graph: SQLite co-occurrence tracking
- Semantic search: `hydra search "query" [--domain] [--limit]`
- Digest: `hydra digest [--days 7]`
- Feedback loop: `hydra feedback <id> <clone> useful|irrelevant` (ajuste automatico de pesos)

### Security (Epic 6)
- Input sanitizer: HTML clean, prompt injection (16 patterns), encoding normalization
- Content validator: URL blocklist, size limits, encoding check
- Output filter: PII redact (CPF, CNPJ, email, phone, CC), copyright flag
- Audit logger: SQLite trail, `hydra audit [--severity] [--since]`, retention 90 dias
- Env validator: API key format check na startup
- Hardening: shell injection fix (execFile), path traversal prevention, TLS fix

### Testes
- **509 testes passando** (34 suites) — era 65, agora 509
- Cobertura: todos os modulos (scheduler, monitoring, dedup, security, distribution, chunker, etc.)

### Pipeline Operacional (02/Abr/2026)
- **Melhor run:** 3.771 fetched, 810 ingeridos, 386 S-tier, 424 A-tier
- **88 fontes totais** (15+18 RSS, 41 GitHub, 6 YouTube, 2 Podcasts, 4 Twitter, 2 Web)
- YouTube via RSS feed (bypassa bot detection), yt-dlp para subtitles
- Whisper: faster-whisper (CTranslate2, int8, CPU), fallback tiny, cache em D:
- `--sources` flag para filtrar por tipo
- ArXiv domina content (38-52%) — precisa rate limiting

### Raio X — Black Box Outlier (02/Abr/2026)
- 18 aulas processadas e ingeridas em `D:/jarvis/mega brain/knowledge/marketing/raio-x/`
- Tiago Finch, Ricardo Morbi, Lucas Wisky, Paulo Lacerda
- Domínios: marketing, negocios | Projeto: low-ticket-10k

### Fontes Configuradas
- 15 RSS + 45+ GitHub + 6 YouTube + 2 Podcasts + 4 Twitter + 2 Web (74+ total)

### Key Files
- CLI: `bin/hydra.js`
- Pipeline: `src/pipeline.js`
- Scheduler: `src/scheduler/scheduler.js`
- SQLite store: `src/dedup/dedup-store.js`
- Distribution: `src/distribution/mind-clone-router.js`
- Security: `src/security/input-sanitizer.js`
- Config: `src/config/scheduler.yaml`, `src/config/thresholds.yaml`, `src/config/routing.yaml`
- Health: `src/monitoring/health-reporter.js`
- Alerts: `src/monitoring/telegram-alerter.js`

### Documentacao
- `docs/projects/hydra-content-intel/epic4-architecture.md`
- `docs/projects/hydra-content-intel/epic5-architecture.md`
- `docs/projects/hydra-content-intel/epic6-architecture.md`
- `docs/projects/hydra-content-intel/data-architecture-review.md`
- `docs/projects/hydra-content-intel/quality-review-test-strategy.md`
- `docs/projects/hydra-content-intel/deep-research-content-intel.md`

### Telegram Bot (02/Abr/2026)
- Bot: **@hydra_aios_bot** (token/chatId em `.env`)
- Comandos: `/health`, `/status`, `/run`, `/digest`, `/sources`, `/stats`, `/last`, `/help`
- Report automatico pos-pipeline no Telegram
- `telegram-bot.js` (polling), `telegram-alerter.js` (native Telegram API)
- `hydra bot` standalone ou integrado no `hydra schedule start`

### Cybersecurity Expansion (02/Abr/2026)
- **18 fontes RSS** de cybersecurity adicionadas (6 tiers)
- Dominio "cybersecurity" criado em `domains.yaml` (20 keywords)
- Conclave com 5 experts: `docs/research/conclave-cybersecurity-2026.md`
- Top 3: Agentic AI Security, Supply Chain Attacks, Deepfakes
- Fontes removidas: Sophos (timeout), Socket.dev (403)

### Rate Limiting (02/Abr/2026)
- `max_items` suportado no rss-adapter.js
- ArXiv: 20/feed, HuggingFace: 30, DeepMind: 30, Hacker News: 25, Dark Reading: 25

### Scheduler ATIVO (02/Abr/2026)
- Full pipeline: 6h e 18h (America/Sao_Paulo)
- RSS only: cada 4h
- Bot Telegram: polling continuo
- Rodar: `hydra schedule start` (ou `run-pipeline.bat` para run unico)

**Why:** Mind clones respondem com conhecimento estagnado. HYDRA resolve latencia (< 24h).

**How to apply:** Pipeline ATIVO. Monitorar via Telegram (`/health`, `/stats`). Para run manual: `/run` no Telegram ou `hydra run`. Log em `hydra-data/`. Novas fontes: editar `src/config/sources.yaml`.
