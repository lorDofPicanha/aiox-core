# R1 — Railway BR Setup (Founder Runbook)

**Quem executa:** Founder
**Tempo estimado:** 30-45min
**Deadline:** D-11 (19/Mai) — desbloqueia deploy pré-Beta
**Decisão referenciada:** D1 Founder Decisions 18/Mai → Railway BR region

---

## Pré-requisitos

- [ ] Conta GitHub com acesso ao repo `serenity-ai` (você já tem)
- [ ] Cartão de crédito (Railway aceita brasileiro; cobrança em USD ~$5-20/mês na fase Beta)
- [ ] Email `dev@anipis.com.br` ou similar (para invites de team)

---

## Passo 1 — Criar conta Railway (5min)

1. Acesse https://railway.com
2. Click **"Start a New Project"** → **"Login with GitHub"**
3. Autorize Railway no GitHub (org/conta pessoal)
4. Confirme email se solicitado

> Já tem conta? Skip pro Passo 2.

---

## Passo 2 — Criar novo projeto (5min)

1. Click **"New Project"** (dashboard)
2. Selecione **"Deploy from GitHub repo"**
3. Escolha o repo `apps/serenity-ai` (ou monorepo correspondente — vai pedir path subdir)
4. **Branch:** `main` (ou `staging` se preferir promover via PR primeiro)
5. **Name:** `anipis-api-beta` (sugestão; será visível em URLs)
6. Click **"Deploy"** (vai falhar primeiro deploy — esperado, sem env vars)

---

## Passo 3 — Configurar região BR (CRÍTICO — 2min)

1. No projeto → **Settings** (sidebar)
2. Procure **"Region"** ou **"Deployment Region"**
3. Selecione **`São Paulo, Brazil (sa-east-1)`** ou **`Latam BR`** (varia o label)
4. Click **"Save Changes"**

> **Por que importa:** latência <50ms para usuárias BR (vs 200-300ms US-east) + reduz uma transferência internacional (RIPD §5).

---

## Passo 4 — Adicionar Postgres (se Supabase fora, opcional Beta — 5min)

Você vai usar Supabase como DB primário. Pule este passo.

> **Não criar Railway Postgres** — vai duplicar gastos e não sincroniza com Supabase migrations atuais.

---

## Passo 5 — Configurar Environment Variables (15min) ⚠️

Em **Variables** (sidebar), adicione TODAS as variáveis abaixo (copy do `.env.example` atual + valores prod):

### Obrigatórias

```bash
NODE_ENV=production
PORT=3000

# Database (Supabase)
SUPABASE_URL=https://[your-project].supabase.co
SUPABASE_ANON_KEY=[from Supabase dashboard → Settings → API]
SUPABASE_SERVICE_ROLE_KEY=[from Supabase dashboard — SECRET]
DATABASE_URL=[from Supabase dashboard → Settings → Database → Connection string]

# CORS
CORS_ORIGIN=https://anipis.com.br,https://www.anipis.com.br

# Rate limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000

# OpenAI (LLM principal — ZRT enterprise)
OPENAI_API_KEY=[from OpenAI dashboard]
OPENAI_ZDR_CONFIRMED=true  # ⚠️ só após enrollar ZRT no dashboard (R2)

# Anthropic — DEFERIDA (D2 founder decision)
# DEIXAR EM BRANCO ou OMITIR:
# ANTHROPIC_API_KEY=
# ANTHROPIC_ZDR_CONFIRMED=

# Upstash Redis (rate-limit + cache)
UPSTASH_REDIS_URL=https://[your-instance].upstash.io
UPSTASH_REDIS_TOKEN=[from Upstash dashboard]

# Sentry
SENTRY_DSN=https://[hash]@o[org].ingest.sentry.io/[project]
SENTRY_ENVIRONMENT=production
SENTRY_RELEASE=[git sha auto-injected by Railway]

# Langfuse
LANGFUSE_PUBLIC_KEY=[from Langfuse dashboard]
LANGFUSE_SECRET_KEY=[from Langfuse dashboard]
LANGFUSE_HOST=https://cloud.langfuse.com  # EU Frankfurt

# Internal API auth
INTERNAL_API_KEY=[gerar 64 chars random: openssl rand -hex 32]

# JWT (Supabase)
JWT_SECRET=[from Supabase dashboard → Settings → API → JWT Secret]
```

### Opcionais (podem ficar para depois)

```bash
# Email transactional (após R4)
RESEND_API_KEY=
RESEND_FROM=Anipis <noreply@anipis.com.br>

# Beta invite codes
INVITE_CODE_LENGTH=8
```

> **Não cole valores reais neste markdown — só no Railway dashboard.** Esses tokens são secrets.

---

## Passo 6 — Configurar Build & Start commands (3min)

Em **Settings → Build**:
- **Builder:** Nixpacks (default OK)
- **Build Command:** `npm install && npm run build` (verificar `package.json` da api)
- **Start Command:** `npm start` ou `node dist/server.js`
- **Watch Paths:** `apps/serenity-ai/apps/api/**` (se monorepo)
- **Root Directory:** `apps/serenity-ai/apps/api` (se monorepo)

---

## Passo 7 — Adicionar domínio customizado (10min, async)

1. **Settings → Domains** → **"Add Custom Domain"**
2. Inserir `api.anipis.com.br`
3. Railway vai mostrar **CNAME** target (algo como `xxxx.up.railway.app`)
4. No seu provedor DNS (Cloudflare/Registro.br):
   - Adicionar registro **CNAME** `api.anipis.com.br` → `[target]`
   - **Proxy DESLIGADO** se Cloudflare (Railway gerencia SSL)
5. Aguardar propagação (5-30min, até 24h pior caso)
6. Railway emitirá SSL Let's Encrypt automaticamente após DNS resolver

---

## Passo 8 — Testar deploy (5min)

1. Em **Deployments** → ver último deploy
2. Click **"View Logs"** — esperar até ver `[serenity-ai] Server listening on 0.0.0.0:3000`
3. Em outro terminal:
   ```bash
   curl https://[seu-railway-domain].up.railway.app/health
   # Deve retornar: {"status":"ok","timestamp":"..."}
   ```
4. Se 502/500: olhar logs, normalmente env var faltando

---

## Passo 9 — Configurar Sentry release tracking (3min)

1. Em **Settings → Environment**:
   - Adicionar `SENTRY_RELEASE=${{RAILWAY_GIT_COMMIT_SHA}}` (Railway injeta auto)
2. Próximo deploy: Sentry vai mostrar erros associados ao commit SHA

---

## Passo 10 — Habilitar auto-deploy (1min)

**Settings → Service → Source**:
- ✅ **Auto Deploy** ON (deploy automático em push pra branch escolhida)
- **Production Branch:** `main`

> Você ainda pode promover via PR; auto-deploy só dispara após merge.

---

## Checklist final

- [ ] Conta Railway criada
- [ ] Projeto `anipis-api-beta` criado em região São Paulo (sa-east-1)
- [ ] 20+ env vars configuradas (sem ANTHROPIC_API_KEY)
- [ ] Build & Start commands corretos
- [ ] Health check `/health` retorna 200
- [ ] DNS `api.anipis.com.br` apontado e SSL ativo
- [ ] Auto-deploy ligado em `main`
- [ ] Custo mensal estimado <$30 (verificar billing após 7d)

---

## Troubleshooting

**Build falha com "module not found":**
→ Root Directory provavelmente errado. Confirmar caminho subdir.

**App sobe mas 500 em todos endpoints:**
→ Provavelmente `JWT_SECRET` ou `DATABASE_URL` errado. Veja logs Railway → procura "Invalid JWT" ou "ECONNREFUSED".

**Sentry não recebe erros:**
→ Faltou `SENTRY_DSN` ou DNS de Sentry bloqueado. Tentar `curl https://o[org].ingest.sentry.io/api/[project]/store/`.

**CORS error no browser:**
→ `CORS_ORIGIN` env não cobre o domínio frontend. Adicionar e redeploy.

---

## Custo esperado

| Item | Custo/mês |
|---|---|
| Web service (Hobby, ~512MB) | ~$5 |
| Bandwidth (Beta 20 usuárias) | ~$0-2 |
| **Total Beta** | **~$5-10** |
| Total pós-crescimento (100+ users) | ~$20-50 |

---

## Próximo passo

Após R1 completo:
→ **R2** — OpenAI ZRT enrollment (precisa do `OPENAI_ZDR_CONFIRMED=true` em Railway env)
→ **R3** — Refactor `env.ts` (já feito em DEV-5/6, mas confirmar que prod boot passa sem ANTHROPIC_API_KEY)

**Trigger Orion:** `r1 railway feito` → confirma + atualiza Closed-Beta-Checklist
