---
name: Bretda DNS Switch 24/Abr manhã
description: Runbook pro user executar ao acordar — DNS switch bretda.com.br do Hostinger/Lovable para Vercel prototype.
type: project
originSessionId: 22cb696e-58e9-4c59-b4a5-f04df9db5ed4
---
## 🔴 DNS Switch Bretda — User Executa ao Acordar

### Contexto
Sprint 4 dias completo (22/Abr noite → 23/Abr madrugada). Deploy Vercel produção OK em `prototype-tawny-omega.vercel.app`. Domínio `bretda.com.br` ainda aponta para Hostinger/Lovable (IP 185.158.133.1) — SITE ERRADO no ar.

### Autônomo bloqueado por
`vercel domains add bretda.com.br` retornou 403 `domain_not_owned`. Vercel exige ownership verification manual.

### Passo-a-Passo (5-10min + 1-4h propagação)

#### Passo 1 — Adicionar domínio no Vercel (2min)
1. Abrir https://vercel.com/dashboard/domains
2. Login (conta brenodecerqueira-4418)
3. Selecionar projeto `prototype`
4. Menu **Settings → Domains → Add**
5. Digitar `bretda.com.br`
6. **Also add www** ✓
7. Save

Vercel vai mostrar 2 opções:
- **Opção A:** Apontar NS (nameservers) para Vercel — mais radical
- **Opção B:** Apontar A/CNAME records — recomendado

**Escolher Opção B** (menos radical, reversível).

#### Passo 2 — Verificar ownership (TXT record)
Vercel vai pedir TXT record tipo:
```
_vercel.bretda.com.br  TXT  vc-domain-verify=bretda.com.br,abc123xyz...
```

Adicionar no DNS atual. **ONDE está registrado bretda.com.br?**
- Se Cloudflare: dashboard Cloudflare → DNS → Add TXT
- Se Registro.br: painel registro.br → Zona DNS → TXT
- Se Hostinger: painel Hostinger → Domínios → DNS → TXT

Após adicionar, clicar **Verify** no Vercel (pode levar 5-60min de propagação).

#### Passo 3 — Trocar A/CNAME records
Após verificação:

**APEX `bretda.com.br`:**
```
TROCAR: A 185.158.133.1 (Hostinger/Lovable)
PARA:   A 76.76.21.21 (Vercel)
```

**Subdomínio `www.bretda.com.br`:**
```
TROCAR: (qualquer record existente)
PARA:   CNAME cname.vercel-dns.com
```

#### Passo 4 — Aguardar propagação (1-4h típico, 48h worst case)
Testar com:
```bash
nslookup bretda.com.br
# deve retornar 76.76.21.21

curl -sI https://bretda.com.br
# deve retornar 200 OK com headers Vercel (Server: Vercel)
```

#### Passo 5 — Validações finais pós-propagação
1. Acessar https://bretda.com.br — deve mostrar site novo (TAN Aegean dark theme)
2. Testar https://bretda.com.br/privacidade — deve abrir política LGPD
3. Testar https://bretda.com.br/mesa-bilhar-jantar — rewrite para LP ads
4. Testar https://bretda.com.br/configurador — 3D viewer
5. Cookie banner aparece na primeira visita

#### Passo 6 — HSTS preload (opcional, pós-24h)
Submeter em https://hstspreload.org/?domain=bretda.com.br

### Rollback de emergência
Se algo der errado, restaurar A record apontando para 185.158.133.1 (Hostinger). Propagação reversa 1-4h.

### Contatos de Suporte
- Vercel support: https://vercel.com/help
- Cloudflare: support.cloudflare.com
- Se bretda.com.br está no Hostinger: painel cPanel

### Status Final Esperado
- `bretda.com.br` → Vercel deployment (site correto)
- `www.bretda.com.br` → Vercel deployment
- `prototype-tawny-omega.vercel.app` → continua funcionando (alias Vercel)
- Site Lovable antigo Hostinger: pode ser cancelado após 48h de sucesso
