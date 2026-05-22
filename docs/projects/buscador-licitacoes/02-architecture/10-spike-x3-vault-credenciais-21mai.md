# Spike — X3: Vault de Credenciais + Documentos da Cliente — 21/Mai/2026

**Prioridade:** P1 · **Advisors:** bruce-schneier (segurança), ann-cavoukian (LGPD) · **Habilita:** Stage 5 (authenticated-poll) + Stage 4 (matching de docs)

## Job
Guardar com segurança (a) os **logins da cliente nos portais** (necessário p/ monitorar sessão autenticada no Stage 5) e (b) os **documentos da cliente** (atestados/CAT/CRF/CND) para o matching do Stage 4.

## Desconhecido técnico / risco
1. **Guardar credenciais de terceiros** — superfície de ataque crítica; vazamento = comprometer contas da cliente nos portais.
2. **LGPD** — dados sensíveis de empresas/CNPJs; minimização + consentimento.
3. **🚨 ToS das plataformas** — algumas **proíbem automação/scraping autenticado**. Risco **legal**, não só técnico. Pode bloquear o Stage 5 como projetado.

## Abordagem proposta
- **Credenciais:** cifrar em repouso com **Supabase Vault / pgsodium** (ou KMS externo); descriptografar só no worker, em memória, no momento do poll. Nunca logar.
- **Escopo mínimo:** guardar só o necessário; rotação; revogação fácil.
- **Documentos:** Supabase Storage privado + RLS por empresa (liga em X2); extração de metadados (tipo/validade do atestado) p/ o matcher.
- **Consentimento LGPD:** termo explícito de uso das credenciais + finalidade; log de cada acesso.
- **Revisão de ToS:** auditar ToS de PCP/BLL/BNC/SISLOG quanto a automação autenticada **antes** de construir o Stage 5 autenticado.

## Experimento (antes de build)
- PoC de vault cifrado (escrever/ler credencial cifrada via worker) + fluxo de consentimento.
- **Auditoria de ToS** das plataformas (entregável jurídico) → classificar cada fonte: automação permitida / cinza / proibida.

## Gate
- ✅ **PASSA** (técnico) se credencial nunca trafega/loga em claro e só é lida no worker.
- 🚨 **GATE LEGAL:** se a ToS de uma plataforma proíbe automação autenticada → Stage 5 nessa fonte só via **robô-parceiro oficial** (ex.: Lance Fácil em BLL — D3) ou descartado. **Pode reescopar o Stage 5.**

## Decisões pendentes
- [ ] D-X3.1 — Vault: Supabase Vault/pgsodium vs KMS externo?
- [ ] D-X3.2 — Auditoria de ToS por plataforma (quem faz — advisor jurídico).
- [ ] D-X3.3 — Stage 5 autenticado vs integração com robô-parceiro (cruza com D3).

---
*Spike por Orion (aios-master). Segurança + LGPD + ToS. O gate legal pode redefinir o Stage 5.*
