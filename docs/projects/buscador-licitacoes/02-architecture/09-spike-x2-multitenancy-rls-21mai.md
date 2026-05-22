# Spike — X2: Multi-CNPJ + 4 usuários (RLS multi-tenant) — 21/Mai/2026

**Prioridade:** P1 · **Advisors:** data-engineer, ann-cavoukian (LGPD) · **Depende de:** D5 (papéis dos 4 usuários)

## Job
Modelar **multi-tenant** (3 empresas / múltiplos CNPJs) com **RLS** no Supabase + **4 papéis** no módulo licitação (busca / habilita / dá lance / recorre — D5).

## Contexto (CONTEXT §10.3 + v3)
- **3 empresas reais**, 1 delas licita. **4 usuários** no buscador (não single-user).
- Isolamento entre empresas é requisito LGPD (dados de CNPJs/credenciais).

## Desconhecido técnico
- **RLS multi-tenant correto** — garantir zero vazamento cross-tenant.
- **Matriz de papéis** — quem vê/edita o quê dentro de uma empresa.

## Abordagem proposta (schema preliminar)
```sql
organizacoes (id, nome)                          -- a conta (cliente)
empresas (id, org_id, cnpj, razao_social)        -- as 3 empresas (1+ CNPJ cada)
usuarios (id, org_id, auth_user_id, nome)         -- os 4 usuários
papeis (id, usuario_id, empresa_id, papel)        -- papel POR empresa
   -- papel ∈ {buscador, habilitador, pregoeiro, recursal, admin}
```
- **RLS:** toda tabela de dados (licitacoes_seguidas, dossies, matches) escopada por `org_id` + `empresa_id`; policy `auth.uid()` → org/empresa permitidas.
- **Papéis** via tabela `papeis` + policies por ação (SELECT/INSERT/UPDATE).

## Experimento (antes de build)
- Criar schema + policies RLS no Supabase + **teste de isolamento**: usuário da empresa A não enxerga dados da empresa B nem de outra org.

## Gate
- ✅ **PASSA** se o teste de isolamento cross-tenant retornar **0 vazamentos** em todas as tabelas.
- ⚠️ LGPD: minimização de dados + log de acesso (Ann Cavoukian).

## Decisões pendentes
- [ ] D-X2.1 — **D5:** papéis reais dos 4 usuários (mapear quem faz o quê).
- [ ] D-X2.2 — Uma empresa pode ter >1 CNPJ (filiais)? (afeta cardinalidade)
- [ ] D-X2.3 — Admin/master é o cliente (CONTEXT §10.3 mencionou RBAC Master/Receita/Despesa — aquilo era do módulo financeiro; aqui é só licitação).

---
*Spike por Orion (aios-master). RLS-first. Isolamento cross-tenant é gate duro (LGPD).*
