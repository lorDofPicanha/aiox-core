# JurisControl — Security Assessment (Black-Box, Passive Recon)

**Alvo:** https://juriscontrol.app.br (landing em `/landing`, app SPA inteiro)
**Data:** 2026-06-08
**Tipo:** Pentest caixa-preta autorizado — recon passivo + análise de configuração
**Operador:** Squad Security (recon: @hd-moore · web/appsec: @jim-manico + @troy-hunt · validação: @georgia-weidman)
**Escopo:** Recon passivo, headers, TLS, DNS, análise de bundle JS client-side, fingerprint de stack, mapeamento de superfície. **SEM** exploração ativa de dados (respeitado à risca).

> **Nota de escopo crítica:** A confirmação definitiva do achado de maior severidade (postura de RLS no Supabase) **NÃO foi executada** porque exigiria consultar a base de produção do cliente com a chave `anon` — o que cai fora do recon passivo e viola a regra "não pivote pra exploração ativa de dados". O teste está documentado conceitualmente em "Próximos Passos" e requer autorização explícita por escrito do cliente para ser executado de forma controlada.

---

## 1. Sumário Executivo

JurisControl é um SaaS jurídico brasileiro (gestão de escritórios de advocacia) construído na plataforma **Lovable.dev** (gerador de apps com IA), servido como **SPA React/Vite** atrás de **Cloudflare**, com backend **Supabase** (Postgres + PostgREST + Auth + Storage + Edge Functions). A aplicação lida com dados altamente sensíveis e regulados pela LGPD: clientes, processos judiciais, prazos, honorários financeiros e documentos.

**Postura geral:** **MÉDIA-BAIXA / requer atenção urgente.**

A higiene de transporte e infraestrutura é **boa** (Cloudflare, TLS 1.2/1.3, HSTS, sem source maps, sem secrets indevidos no bundle). Porém a arquitetura herdada do Lovable (anon key pública + PostgREST direto + auto-cadastro habilitado) concentra **todo o risco de segurança na camada de autorização do banco (Row Level Security)**, que **não pôde ser confirmada como correta** no escopo passivo. Esse é o padrão de falha nº 1 em apps Lovable+Supabase e a maior fonte de risco agregado aqui.

**Risco agregado dominado por dois fatores combinados:**
1. **Auto-cadastro aberto com e-mail auto-confirmado** (`disable_signup:false`, `mailer_autoconfirm:true`) — qualquer um cria conta autenticada instantaneamente.
2. **RLS de postura desconhecida** — se uma única tabela sensível não tiver política RLS escopada por escritório (`office_id`), o atacante autenticado lê/escreve dados de TODOS os tenants.

Esses dois juntos formam o vetor crítico a validar imediatamente.

---

## 2. Stack / Fingerprint

| Camada | Tecnologia | Evidência |
|---|---|---|
| Build/Front | **React SPA + Vite** | `<div id="root">`, `/assets/index-B2qv308E.js` (módulo ES, 1.47 MB), `/assets/index-D6i6jKyn.css` |
| Plataforma | **Lovable.dev** | og:image em `*.lovable.app`, `twitter:site=@Lovable`, `/~flock.js` + `/__l5e/events.js` (telemetria Lovable), R2 bucket `pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev` |
| CDN/Edge | **Cloudflare** | `Server: cloudflare`, `CF-RAY: ...-GRU` (São Paulo), cookie `__cf_bm` (bot management) |
| Hosting origin | provável **Vercel** | header `x-deployment-id: b66aff0e-...` |
| Backend | **Supabase** | projeto `gyhcgxcmjaeaycqkdhyg.supabase.co` (PostgREST + Auth + Storage + Edge Functions) |
| Auth | Supabase Auth (e-mail/senha) | `/auth/v1/settings`: só `email:true`, sem OAuth social |
| Pagamento | **Nexano** | `checkout.nexano.com.br/checkout/...` |
| Libs detectadas | date-fns, pako, pdfkit/pdfobject, radix-ui, Supabase JS | strings no bundle |
| Integração | **ViaCEP** (`viacep.com.br/ws/`) — lookup de endereço | bundle |
| IP origem | `185.158.133.1` (mascarado por Cloudflare) | nslookup |
| Cert TLS | Google Trust Services (WE1), válido 10/Mai–08/Ago/2026, SAN só apex | openssl |

---

## 3. Achados por Severidade

### 🔴 CRÍTICO (a confirmar — vetor de maior risco)

**C-01 — Postura de Row Level Security (RLS) não verificada em base com PII jurídica + financeira**
- **Descrição:** O app expõe a API PostgREST do Supabase diretamente ao cliente com a chave `anon` (pública por design). A segurança de TODA a leitura/escrita depende exclusivamente de políticas RLS corretas em cada uma das 21 tabelas. Em apps Lovable, é comum tabelas serem criadas sem RLS, com RLS desabilitada, ou com políticas frouxas (ex.: `USING (true)`), tornando a base inteira legível/gravável por qualquer portador da anon key ou por qualquer usuário autenticado.
- **Evidência:** Tabelas sensíveis referenciadas no bundle: `clients`, `casos`, `processes`, `processos_atualizacao`, `fees`, `documents`, `profiles`, `deadlines`, `subscriptions`, `offices`, `relatorios_iniciais`, `ficha_compartilhamento`, etc. Endpoint base ativo: `https://gyhcgxcmjaeaycqkdhyg.supabase.co/rest/v1/`. Anon key válida (exp 2036) embutida no bundle.
- **Impacto:** Se confirmada falha de RLS → vazamento massivo de dados de clientes de escritórios de advocacia (sigilo profissional + LGPD art. 11 dados sensíveis), processos, valores de honorários, documentos. Potencial escrita/adulteração. Incidente de notificação obrigatória ANPD.
- **PoC (conceitual, NÃO executado):** Cadastrar conta gratuita (ver C-02) → obter JWT autenticado → `GET /rest/v1/clients?select=*` com o JWT. Se retornar linhas de outros escritórios, RLS está quebrada. Alternativa anônima: a mesma chamada só com a anon key.
- **Recomendação:** Auditar `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` em TODAS as 21 tabelas + criar políticas escopadas por `office_id`/`auth.uid()`. Rodar o Supabase Security Advisor. **Validar com teste controlado autorizado (ver §8).**

### 🟠 ALTO

**A-01 — Auto-cadastro aberto com e-mail auto-confirmado**
- **Evidência:** `GET /auth/v1/settings` → `"disable_signup": false`, `"mailer_autoconfirm": true`.
- **Impacto:** Qualquer pessoa cria conta autenticada e válida instantaneamente, sem verificar e-mail. É o "pé na porta" que transforma qualquer falha de RLS de "autenticado" em exploração trivial por estranhos. Também viabiliza abuso das Edge Functions de IA (custo) e enumeração interna.
- **Recomendação:** Se o cadastro é destinado só a clientes pagantes/convidados → `disable_signup: true` e onboarding via convite/admin. Se cadastro público é necessário → exigir confirmação de e-mail (`mailer_autoconfirm: false`) + rate limiting + isolar contas novas até ativação de assinatura.

**A-02 — Link público de compartilhamento de ficha (`/ficha/:token`) — risco de IDOR/token fraco**
- **Evidência:** Rota client-side `/ficha/:token` + tabela `ficha_compartilhamento`. Acesso sem autenticação por token.
- **Impacto:** Se o token for sequencial/curto/previsível, ou se a tabela `ficha_compartilhamento` não tiver RLS adequada, um atacante enumera/adivinha tokens e acessa fichas de clientes de qualquer escritório. Tokens em URL também vazam por Referer/logs/histórico.
- **Recomendação:** Garantir token aleatório ≥128 bits (UUIDv4/random), expiração, revogação, e RLS que valide o token server-side. Considerar senha/expiração no link. **Validar com PoC autorizado** (gerar uma ficha de teste no ambiente do cliente e tentar acesso cruzado).

**A-03 — Edge Functions administrativas expostas ao cliente (`admin-create-user`, `admin-update-user`)**
- **Evidência:** `functions.invoke("admin-create-user")`, `functions.invoke("admin-update-user")`, `manage-subscription`, `import-process`, `fetch-process-data`, `analyze-document`, `generate-ai-document`, `generate-ai-context`. Preflight OPTIONS responde 200 (esperado; não confirma falha por si só).
- **Impacto:** Se essas funções não revalidarem o papel do chamador server-side (confiando no front para "esconder" o botão admin), um usuário comum autenticado pode criar/alterar usuários ou manipular assinaturas (privilege escalation). Funções de IA sem rate-limit = abuso de custo.
- **Recomendação:** Cada Edge Function deve verificar o JWT e o papel/admin do chamador internamente (nunca confiar no client). Adicionar rate limiting nas funções de IA. **NÃO foram invocadas neste assessment** (fora de escopo passivo); validar autorização em teste controlado.

### 🟡 MÉDIO

**M-01 — Ausência total de Content-Security-Policy (CSP)**
- **Evidência:** Nenhum header `Content-Security-Policy` em `/` nem nos assets.
- **Impacto:** Sem mitigação de XSS em profundidade. Em um SPA que renderiza dados de clientes/documentos, um XSS (ex.: nome de cliente/nota de processo malicioso) roubaria os tokens Supabase do `localStorage` → sequestro de sessão. CSP é a principal defesa secundária.
- **Recomendação:** Implementar CSP restritiva (`default-src 'self'`; permitir explicitamente supabase.co, r2.dev, checkout.nexano, viacep, lovable telemetry). Adicionar `frame-ancestors 'none'`.

**M-02 — `X-Frame-Options` / `frame-ancestors` ausentes (clickjacking)**
- **Evidência:** Sem `X-Frame-Options` nem `frame-ancestors` na CSP.
- **Impacto:** App pode ser embutido em iframe → clickjacking contra ações autenticadas.
- **Recomendação:** `X-Frame-Options: DENY` + `frame-ancestors 'none'`.

**M-03 — `Permissions-Policy` ausente**
- **Evidência:** Header não presente.
- **Recomendação:** Adicionar `Permissions-Policy` negando câmera/microfone/geolocalização não usados.

**M-04 — Tokens de sessão Supabase em `localStorage` (padrão do SDK)**
- **Descrição:** Supabase JS persiste o access/refresh token em `localStorage`, acessível por qualquer JS na página (sem proteção HttpOnly).
- **Impacto:** Amplifica M-01: qualquer XSS = exfiltração de sessão completa. Refresh token de longa duração no localStorage é particularmente perigoso.
- **Recomendação:** Mitigar via CSP forte (M-01) + sanitização rigorosa de toda entrada renderizada. Avaliar storage mais seguro se suportado.

### 🔵 BAIXO

**B-01 — Cookie `__cf_bm` com `SameSite=None`** — é cookie do Cloudflare Bot Management (não é sessão da app), `HttpOnly`+`Secure` presentes. Baixo impacto direto; informativo.

**B-02 — Certificado TLS cobre só o apex (`juriscontrol.app.br`)** — `www.juriscontrol.app.br` faz 302 com `ssl_verify=0` (cert não cobre www). Usuários acessando `www` veem aviso de cert. Adicionar `www` à SAN ou redirecionar no edge antes do TLS handshake.

### ⚪ INFO

- **I-01** — `commit_sha` exposto no HTML (`4267a66ca30c864e4bb785304a56c71fe0d84df3`) via `data-commit-sha` da telemetria Lovable. Vaza versão exata do código (facilita correlação com vulns conhecidas de dependências). Baixo, mas pode ser removido no build de produção.
- **I-02** — Telemetria Lovable ativa em produção (`/~flock.js`, `/__l5e/events.js`, `data-proxy-url=/~api/analytics`). Indica que o app pode ainda estar no "modo preview/dev" do Lovable em vez de export self-hosted limpo. Revisar se telemetria de terceiros é aceitável sob LGPD.
- **I-03** — `robots.txt` presente, permite tudo (sem disallow sensível — ok). Sem `sitemap.xml`, sem `security.txt`.
- **I-04** — Project ID Lovable e R2 bucket público de previews expostos (og:image). Imagens de preview do app acessíveis publicamente no bucket R2.

---

## 4. Headers de Segurança

| Header | Status | Observação |
|---|---|---|
| `Strict-Transport-Security` | ✅ Presente | `max-age=31536000; includeSubDomains` — bom (faltaria `preload`) |
| `X-Content-Type-Options` | ✅ Presente | `nosniff` |
| `Referrer-Policy` | ✅ Presente | `strict-origin-when-cross-origin` |
| `Content-Security-Policy` | ❌ **AUSENTE** | M-01 — crítico para SPA com PII |
| `X-Frame-Options` | ❌ **AUSENTE** | M-02 — clickjacking |
| `Permissions-Policy` | ❌ **AUSENTE** | M-03 |
| `Cross-Origin-*` (COOP/COEP/CORP) | ❌ Ausentes | endurecimento opcional |
| CORS na SPA | ✅ Sem reflexão | Origin malicioso não recebe `Access-Control-Allow-Origin` |

**TLS:** TLS 1.0/1.1 **desabilitados** (✅), TLS 1.2 (ECDHE-ECDSA-CHACHA20) e 1.3 (AES-256-GCM) ativos. Cert Google Trust Services válido. Postura de transporte boa.

---

## 5. Secrets / Exposições no Client-Side

| Item | Achado | Severidade |
|---|---|---|
| Supabase URL | `gyhcgxcmjaeaycqkdhyg.supabase.co` | Info (esperado) |
| Supabase **anon key** (JWT) | Exposta no bundle | **Esperado/aceitável** — é pública por design; o risco real é RLS (C-01), não a chave em si |
| **service_role key** | ✅ **NÃO encontrada** no client (bom — seria crítico se vazasse) | — |
| Stripe/AWS/Google/GitHub keys | ✅ Nenhuma (`sk_`, `AKIA`, `AIza`, `ghp_` ausentes) | — |
| Source maps (`.js.map`/`.css.map`) | ✅ **404 — não expostos** (bom) | — |
| `data-context-token` (JWT Lovable preview) | Exposto no HTML, expira ~horas, escopo só preview | Baixo |
| Comentários HTML sensíveis | Nenhum | — |
| `.env` / `.git` | Falsos-positivos (catch-all SPA devolve 200 com HTML; conteúdo NÃO é git real) | — |

**Conclusão:** Higiene de secrets **boa**. A única "chave" no client é a anon key, que é pública por natureza — o problema nunca é a chave, é a autorização (RLS) atrás dela.

---

## 6. Superfície de Ataque

**Rotas client-side (SPA):** `/`, `/landing`, `/login`, `/reset-password`, `/dashboard`, `/clientes`, `/casos` + `/casos/:id`, `/processos` + `/processos/:id`, `/prazos`, `/agenda`, `/documentos`, `/modelos`, `/financeiro`, `/relatorios` (+ `/financeiro`, `/prazos`, `/processos`), `/usuarios`, `/notificacoes`, `/minha-assinatura`, `/assinatura-bloqueada`, `/assinatura-expirada`, **`/ficha/:token` (público, sem auth)**.

**API de dados (PostgREST):** `https://gyhcgxcmjaeaycqkdhyg.supabase.co/rest/v1/` — 21 tabelas:
`profiles, offices, clients, casos, processes, processos_atualizacao, process_movements, process_notes, deadlines, deadline_history, events, fees, documents, document_templates, ai_document_generations, notifications, status_changes, timeline_entries, subscriptions, relatorios_iniciais, ficha_compartilhamento`.

**RPCs:** `get_ai_usage_current_month`, `get_office_profiles`.

**Storage buckets:** `documents`, `office-logos` (ambos existem; política de acesso a validar).

**Edge Functions:** `admin-create-user`, `admin-update-user`, `analyze-document`, `fetch-process-data`, `generate-ai-context`, `generate-ai-document`, `import-process`, `manage-subscription`.

**Auth:** `https://gyhcgxcmjaeaycqkdhyg.supabase.co/auth/v1/` — e-mail/senha; **signup aberto + autoconfirm** (A-01).

**Integrações externas:** Nexano (checkout/pagamento), ViaCEP (endereço), Cloudflare R2 (imagens), telemetria Lovable.

---

## 7. LGPD / Exposição de Dados

JurisControl processa **dados pessoais sensíveis** (LGPD Art. 11) e dados sob **sigilo profissional advogado-cliente**: identificação de clientes, processos judiciais, situação financeira/honorários, documentos jurídicos.

- **Base legal e minimização:** fora de escopo técnico, mas relevante: o link `/ficha/:token` compartilha dados de cliente por URL — avaliar consentimento e minimização (@ann-cavoukian / Privacy by Design).
- **Risco de incidente notificável (ANPD):** Se C-01 (RLS) ou A-02 (IDOR de ficha) se confirmarem, configura vazamento de dados sensíveis → **notificação obrigatória à ANPD + titulares** (LGPD Art. 48), com risco reputacional e sanção.
- **Telemetria de terceiros (Lovable):** transferência de dados de uso a terceiros — verificar adequação contratual/LGPD (I-02).
- **Auto-confirm de e-mail (A-01):** permite cadastro com e-mail de terceiros sem verificação — risco de cadastro indevido/abuso de identidade.

---

## 8. Próximos Passos Recomendados (para o cliente)

**Imediato (esta semana):**
1. **Validar RLS (C-01)** — rodar o **Supabase Security Advisor** no projeto e confirmar `RLS ENABLED` + política escopada por `office_id` em TODAS as 21 tabelas. Este é o item nº 1.
2. **Fechar/endurecer signup (A-01)** — `disable_signup:true` (se onboarding é por convite) ou ativar confirmação de e-mail.
3. **Revisar autorização das Edge Functions admin (A-03)** — confirmar verificação de papel server-side em `admin-create-user`/`admin-update-user`/`manage-subscription`.
4. **Auditar token de `/ficha/:token` (A-02)** — confirmar aleatoriedade ≥128 bits, expiração e RLS na `ficha_compartilhamento`.

**Curto prazo:**
5. Implementar **CSP** (M-01) + `X-Frame-Options`/`Permissions-Policy` (M-02/M-03) — via Cloudflare Transform Rules ou config do host.
6. Corrigir cobertura TLS do `www` (B-02).
7. Revisar buckets `documents`/`office-logos` (acesso público vs assinado).

**Teste autorizado de validação (requer sign-off por escrito do cliente — atualmente fora do escopo passivo executado):**
- Pentest autenticado controlado: criar 2 contas de teste em escritórios distintos no ambiente do cliente e tentar acesso cruzado a dados (confirma C-01 e A-02 com PoC real, sem tocar em dados de clientes reais).
- Teste de autorização das Edge Functions admin com conta de papel "comum".
- Recomenda-se executar em **staging** ou com dados sintéticos, com janela acordada.

---

## Apêndice — Metodologia e Limites

- **Executado (passivo/in-scope):** DNS, headers HTTP, métodos (OPTIONS 200 / TRACE 405), TLS/cipher/protocolos, robots/sitemap/security.txt, sondagem de arquivos sensíveis (`.git`/`.env` = falsos-positivos de SPA), download e análise estática do bundle JS (1.47 MB), extração de rotas/tabelas/RPCs/funções/integrações, config pública de Auth (`/auth/v1/settings`), preflight CORS das Edge Functions (sem invocação), checagem de source maps.
- **NÃO executado (respeitando ROE "não pivote pra exploração ativa de dados"):** qualquer query que retorne linhas da base de produção (incluindo `count`/`limit 1`), invocação de Edge Functions, criação de contas, enumeração de tokens de ficha. Esses passos foram **documentados conceitualmente** e listados como teste autorizado em §8.
- **Sem ações destrutivas, sem DoS, sem brute-force, sem exfiltração.** Serviço não foi impactado.

---

## ADENDO — Verificação focada de exposição de ENV/secrets (recon ativo não-destrutivo)

**Data:** 2026-06-08 · **Método:** enumeração de caminhos + análise do bundle `/assets/index-B2qv308E.js` (1,47 MB) + index.html.

### Caminhos de config/env testados
| Caminho | Resultado |
|---|---|
| `/.env`, `.env.local/.production/.development/.prod` | 404 (não expostos) |
| `/env.js`, `/config.js`, `/config.json`, `/app-config.json` | 404 |
| `/.git/config`, `/.git/HEAD` | **200 = FALSO-POSITIVO** (SPA serve `index.html`, Content-Type text/html — sem repo .git real) |
| `/Dockerfile` | **200 = FALSO-POSITIVO** (mesmo fallback SPA) |
| `/.npmrc`, `/package.json`, `/vercel.json`, `/docker-compose.yml` | 404 |

### Análise do bundle JS (build-time embeds do Vite)
- **Source map:** ausente (`.map` → 404). ✅
- **VITE_* vars:** nenhuma exposta como nome. ✅
- **JWTs no bundle:** apenas 1 → `role:anon` (chave pública por design Supabase). **Nenhuma `service_role` key vazada.** ✅ ← verificação mais importante, PASSA.
- **Stripe / Google API / OpenAI / AWS / private keys / GitHub/Slack tokens:** zero matches. ✅
- **`access_token:"access_token"`** = nome de campo da lib Supabase (OAuth), não credencial. ✅
- **Nexano:** apenas URL pública de checkout (`checkout.nexano.com.br/...`), não secret.

### index.html inline
- Token inline = **metadado de build do Lovable** decodificado: `{project_id, artifact_kind:preview_commit_sha, commit_sha, exp}`. Não é credencial — vazamento de **info** (revela project UUID Lovable + commit SHA).
- **`/__l5e/events.js` = session replay do Lovable ativo em produção** (parâmetros `maxReplay*` confirmam captura de replay de sessão). ⚠️ LGPD: replay numa SaaS jurídica pode capturar PII/sigilo. Revisar adequação/consentimento.

### VEREDICTO — Exposição de ENV
**NÃO há vazamento de segredos sensíveis no client-side.** A higiene de build está correta (sem source maps, sem service_role, sem keys de terceiros). Exposições residuais são apenas **informacionais** (anon key pública por design, project_id Lovable, commit SHA) — severidade INFO. O risco do produto **não** está em env vazado; permanece concentrado na **autorização do banco (RLS — achado C-01)** e na telemetria/replay de terceiros (LGPD).

---

## ADENDO 2 — Superfícies adicionais (recon ativo não-destrutivo, OPTIONS/GET apenas)

### Mapa de superfície extraído do bundle (sem tocar a base)
- **Edge Functions (10):** `admin-create-user`, `admin-update-user`, `manage-subscription`, `analyze-document`, `generate-ai-context`, `generate-ai-document`, `fetch-process-data`, `import-process`, `submit-public-ficha`, `validate-ficha-token`. Todas respondem OPTIONS 200 com `Access-Control-Allow-Origin: *` (existem e são alcançáveis de qualquer origem).
- **RPCs:** `get_ai_usage_current_month`, `get_office_profiles`.
- **Buckets:** `documents`, `office-logos`, `offices`.
- **Tabelas (21):** ai_document_generations, casos, clients, deadline_history, deadlines, document_templates, documents, events, fees, ficha_compartilhamento, notifications, offices, process_movements, process_notes, processes, processos_atualizacao, profiles, relatorios_iniciais, status_changes, subscriptions, timeline_entries.

### Novos achados
| Sev | ID | Achado |
|---|---|---|
| 🟠 ALTO | N-01 | **2 Edge Functions sem auth confirmadas vivas:** `submit-public-ficha` + `validate-ficha-token` (fluxo /ficha). Superfície anônima → IDOR/brute de token + insert/spam não-autenticado. Liga ao A-02. |
| 🟡 MÉDIO | N-02 | **Sem CAPTCHA** em auth + `disable_signup:false` + `mailer_autoconfirm:true` → criação automatizada de contas em massa / credential stuffing, zero defesa de bot. |
| 🟡 MÉDIO | N-03 | **AI Edge Functions** (`analyze-document`, `generate-ai-document`, `generate-ai-context`) → exaustão de custo/abuso de LLM + prompt injection via documento não-confiável se a cota (`get_ai_usage_current_month`) não for imposta server-side. |
| 🟡 MÉDIO | N-04 | **`import-process` / `fetch-process-data`** = fetch server-side de dados externos → possível SSRF / scraping se o identificador/URL for controlável pelo atacante. |
| 🟡 MÉDIO | N-05 | **RPC `get_office_profiles`** — se for SECURITY DEFINER sem escopo de `office_id` → vazamento cross-tenant de perfis/e-mails. (Requer teste ativo.) |
| 🟢 BAIXO | N-06 | **Clickjacking** confirmado — sem `X-Frame-Options`/CSP `frame-ancestors` → app embutível em iframe (UI redress). |
| ⚪ INFO | N-07 | Supabase REST `Access-Control-Allow-Origin: *` (default; amplifica risco se token for roubado). |

### Achados POSITIVOS (higiene correta)
- ✅ **Bucket `documents` (docs jurídicos) é PRIVADO** — `Bucket not found` no endpoint público (buckets públicos retornariam "Object not found"). Crítico e correto.
- ✅ `office-logos` é público — aceitável (logos), mas confirmar que nada sensível é upado lá.
- ✅ Sem `service_role` vazada · HSTS+includeSubDomains · CORS do app não reflete origem.

### Restante NÃO explorado — exige sign-off para teste ATIVO
1. **RLS data-access (C-01)** — o teste que vale o engajamento.
2. **Authz interna das Edge Functions** — invocar `admin-*` como usuário comum/anônimo (privilege escalation).
3. **Entropia/expiração do token `validate-ficha-token`** (brute) + insert via `submit-public-ficha`.
4. **Auth:** rate-limit em login/reset, enumeração de e-mail (resposta diferencial), open-redirect em `redirect_to`, força da política de senha, abuso de refresh/expiração de JWT.
5. **Prompt injection** real nas funções de IA + verificação de imposição de cota.
6. **SSRF** em `import-process`/`fetch-process-data`.
