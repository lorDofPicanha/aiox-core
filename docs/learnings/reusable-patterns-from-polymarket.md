# Reusable Patterns from Polymarket Trader (extracted on kill, 2026-05-18)

Quando o Polymarket Trader foi morto em 18/Mai/2026, 6 padrões da infra+governança valiam reciclar. Documentados aqui pra Anipis, CRM-novo, ou qualquer bot/feature 24/7 futuro.

---

## Pattern 1 — Heartbeat JSON simples

**Origem:** `apps/polymarket-trader/data/heartbeat.json`

```json
{
  "ts": 1779142939107,
  "scanCount": 79,
  "eligibleReal": 1,
  "signals": 1,
  "lastTradeTs": 1779142939107
}
```

**Por quê funciona:** Um único arquivo JSON sobrescrito a cada loop. Timestamp + métricas operacionais mínimas. Watchdog externo lê e calcula age.

**Quando usar:** Qualquer processo long-running onde "está vivo?" precisa ser checável sem inspecionar logs nem PIDs.

**Implementação recomendada (genérica):**

```typescript
function writeHeartbeat(metrics: Record<string, unknown>) {
  fs.writeFileSync(
    HEARTBEAT_PATH,
    JSON.stringify({ ts: Date.now(), ...metrics })
  );
}
```

Anti-pattern observado: confiar no `lastWriteTime` do log file. Logs com I/O bufferizado mentem; heartbeat é write síncrono pequeno.

---

## Pattern 2 — Kill criteria framework (PF × sample × tempo)

**Origem:** Conclave 27/Abr → reforçado 15/Mai

Estrutura de gates obrigatórios para validação de qualquer produto/feature/strategy:

| Gate | Threshold | Janela | Ação se atingido |
|---|---|---|---|
| Mid-verdict | Métrica-chave abaixo de threshold neutro | ~66% do prazo total | KILL antecipado |
| Pre-final | Métrica-chave ainda abaixo de threshold mínimo | ~83% do prazo total | KILL antecipado |
| Final | Métrica-chave acima de threshold de continuação | 100% do prazo | Continue ou kill |

**No caso Polymarket:**
- Mid-verdict D+20: PF<0,9 com ≥10 resolved → KILL
- Pre-final D+25: PF<1,0 com ≥20 resolved → KILL
- Final D+30: PF≥1,0 com ≥30 resolved → continue

**Princípio:** sample size é *condição necessária* — sem mínimo de N, gate não dispara (evita killar por azar estatístico). Threshold cai ao longo do tempo (mais rigor próximo do final).

**Reusabilidade:** Direto pra qualquer projeto novo. Ajusta a métrica-chave (ex.: WR para sales, retention para SaaS, completion rate para onboarding) e os thresholds.

**Anti-pattern aprendido:** O mid-verdict do Polymarket foi atingido com 6 dias de antecedência (PF<0,6 com 16 resolved) e ninguém disparou. Lição: **gates devem ser checados periodicamente, não só na data alvo.** Criar daily check que aciona alarm se threshold violado em qualquer momento da janela.

---

## Pattern 3 — Watchdog com auto-restart (versão corrigida)

**Origem:** `apps/polymarket-trader/scripts/watchdog.ps1` (versão que NÃO funcionou — documentamos os erros)

**O que estava errado:**
1. `Start-Process -WindowStyle Hidden` sem `-PassThru` → não detectava se restart falhou
2. Log path possivelmente quebrado → silêncio total por 3 dias
3. Não tinha "dead-man-switch externo" — se watchdog morresse, ninguém notava

**Versão recomendada (pseudocódigo):**

```powershell
$heartbeat = Get-Content $HEARTBEAT_PATH | ConvertFrom-Json
$ageMin = ((Get-Date) - (Get-Date '1970-01-01').AddMilliseconds($heartbeat.ts)).TotalMinutes

# CRÍTICO: sempre escreve log, mesmo "OK"
Add-Content $LOG_PATH "[$(Get-Date -Format o)] tick — age=$ageMin min, scans=$($heartbeat.scanCount)"

if ($ageMin -gt 10) {
    # 1. Notifica externo PRIMEIRO (Telegram/email)
    Send-Alert "Bot stale — attempting restart"

    # 2. Tenta restart e CAPTURA exit code
    $proc = Start-Process -FilePath "start-bot.bat" -PassThru -NoNewWindow -Wait:$false
    Start-Sleep -Seconds 30

    # 3. VERIFICA se restart funcionou (novo heartbeat?)
    $newHb = Get-Content $HEARTBEAT_PATH | ConvertFrom-Json
    $newAge = ((Get-Date) - (Get-Date '1970-01-01').AddMilliseconds($newHb.ts)).TotalMinutes
    if ($newAge -lt 1) {
        Send-Alert "Bot restarted OK"
    } else {
        Send-Alert "RESTART FAILED — heartbeat still stale ($newAge min). PID=$($proc.Id)"
    }
}
```

**Princípio:** *Cada step do watchdog deve ter verificação posterior + alert se falhar.* Telegram alert "Auto-restarting..." sem follow-up confirmando sucesso é teatro de monitoring.

---

## Pattern 4 — Dead-man-switch externo (lição negativa)

**O que faltou no Polymarket:**

Não havia nenhum sistema externo monitorando o watchdog em si. Quando watchdog parou de logar em 15/Mai, ninguém soube por 3 dias.

**Pattern recomendado:**

```
[Bot]  →  heartbeat.json
[Watchdog (local task)]  →  watchdog.log + Telegram alerts
[Dead-man (external)]  →  reads BOTH heartbeat AGE and watchdog.log AGE; if either >2× expected interval, alert
```

Implementação barata:
- Cron remoto (GitHub Actions a cada 15min OR Uptime Robot free) faz HTTP GET num endpoint local exposto via Tailscale/ngrok que retorna heartbeat.json
- Se age > threshold → SMS/email/Discord

**Custo:** $0 (GitHub Actions free tier + Tailscale free). **Valor:** detecta cenários "monitoring of monitoring failed" que destruíram o Polymarket.

---

## Pattern 5 — Data archival pattern (para qualquer projeto morto)

**Origem:** `docs/projects/polymarket-trader/archive-18mai/`

Estrutura padrão quando matar projeto:

```
docs/projects/{project}/archive-{date}/
├── PolymarketBotWatchdog.xml          # Scheduled task export (reversível)
├── PolymarketDailyCheckup.xml
└── data-snapshot/
    ├── trades-final.json              # Dataset principal
    ├── open-positions.json            # State final
    ├── journal.md                     # Histórico humano-legível
    ├── heartbeat.json                 # Última heartbeat
    └── bot-final-500lines.log         # Tail do log (não o log inteiro 5MB)
```

**Critério "o que vai pro snapshot":**
- ✅ Dataset principal (trades/sales/users/whatever)
- ✅ State files críticos
- ✅ Journal/log humano-legível (se existir)
- ✅ Heartbeat/last-state
- ✅ TAIL do log operacional (500-1000 linhas — não o log gigante)
- ✅ Scheduled task XMLs (Windows) ou systemd unit files (Linux)
- ❌ NÃO copiar logs gigantes (>10MB)
- ❌ NÃO copiar backups duplicados (`*.bak`)
- ❌ NÃO commitar segredos/keys

**Por quê útil:** Permite ressuscitação sem código novo + permite post-mortem fora do projeto + cabe no git.

---

## Pattern 6 — Conclave protocol para extend/kill decisions

**Origem:** Sessão 15/Mai (consulta implícita a chip-huyen, andrew-ng, aswath-damodaran, nate-silver)

**Protocolo:**

1. Antes de extend/kill decisão estrutural, consultar **≥3 mind clones** com perspectivas divergentes
2. Pesar veredictos: se ≥75% apontarem para mesmo gap estrutural → esse gap é o **sinal**, não o ruído
3. Documentar dissent + votos no memo da sessão
4. Se decisão final for contra a maioria do conclave, **explicar o porquê** no memo (não deixar implícito)

**Anti-pattern observado no Polymarket:** 3/4 clones (chip-huyen, andrew-ng, aswath-damodaran) implicitamente votavam KILL ("structural problem", "scope-collapse rigor", "sample size matters"). Só nate-silver ("weather still good") apoiava extend. User foi com o lado minoritário sem explicar o porquê — e os 3 clones estavam certos.

**Reusabilidade:** Direto para Anipis go/no-go decisions, CRM-novo gate decisions, qualquer pivot.

---

## TL;DR para próxima sessão

Quando montar **qualquer bot/agent/produto 24/7** novo:

1. **Heartbeat JSON + watchdog com auto-restart verificado + dead-man externo** (Patterns 1, 3, 4) — não negocie isso
2. **Kill criteria pré-definido com checagem diária** (Pattern 2) — escreva *antes* de começar, não no meio
3. **Conclave ≥3 clones antes de extend** (Pattern 6) — minoria pode ganhar, mas tem que explicar
4. **Archive pattern padrão** (Pattern 5) — quando matar, mata limpo

---

*Extraído por Orion em 18/Mai/2026 durante kill do projeto Polymarket Trader.*
