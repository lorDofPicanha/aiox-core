---
name: Railway Domain TargetPort Trap
description: Se rodar `railway domain` ANTES do primeiro deploy succeed, targetPort fica null e proxy nunca roteia → healthcheck fail eterno mesmo com app boot OK.
type: feedback
originSessionId: 60020527-c949-4341-81da-1aa3cc54a729
---
# Railway domain `targetPort=None` Trap

**Rule:** NÃO rode `railway domain` ANTES do primeiro deploy succeed. Se rodar antes, o domain criado fica com `targetPort=None` e Railway proxy nunca roteia → healthcheck retorna sempre "service unavailable" mesmo com app boot 100% OK.

**Why:** Railway auto-detecta target port quando o primeiro deploy fica healthy (via PORT env var ou Dockerfile EXPOSE). Se o domain já existe MAS nenhum deploy chegou a healthy, o auto-detection nunca dispara. Ciclo: deploy precisa de routing pra healthcheck passar → routing precisa de deploy healthy pra targetPort autoset → chicken-and-egg.

Confirmado em Tocks 04-05/Mai (3 deployments seguidos falharam mesmo com `js-yaml` fix aplicado e app server up em :3100).

**How to apply:**
- Ordem CORRETA: `railway up` → aguarda primeiro deploy ficar `SUCCESS` → `railway domain` (auto-set port via deploy verde) ✓
- Se você rodou `railway domain` cedo demais (igual eu fiz): NÃO TEM `railway domain remove` no CLI v4.36.0 → tem que ir pro dashboard
- **Dashboard fix:** railway.com/project/{id} → Service → Settings → Public Networking → edit domain → Target Port = (porta que app listen) → Save
- Alternativa: remove + recreate domain via dashboard com `Generate Domain` → no prompt de target port, coloca a certa

**Diagnostic:** rodar `railway status --json | jq '.environments.edges[].node.serviceInstances.edges[].node.domains.serviceDomains[].targetPort'` — se `null`, é o trap.

**Sintoma exato:**
```
Build PASS
Image push PASS
Healthcheck Path: /health
Attempt #1-5 failed with service unavailable
1/1 replicas never became healthy!
```

Mas runtime logs mostram server up e listening. Bug é routing, não app.
