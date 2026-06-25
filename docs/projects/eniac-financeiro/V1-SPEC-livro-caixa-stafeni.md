# V1 SPEC — Livro Caixa ENIAC (Núcleo Stafeni)

> Spec da PRIMEIRA versão. Escopo deliberadamente enxuto, calibrado pela fala da
> usuária real (Stafeni), não pela visão completa da plataforma.
> Criado: 2026-06-25 · Agente líder: @aios-master (Orion) · Owner produto: founder (Breno)
> Liga: [[CONTEXT]] · proposta R$2,5k (`docs/projects/buscador-licitacoes/08-apresentacao-cliente/proposta-construcao-livrocaixa-2.5k.md`)

## Fala da usuária (fonte de verdade do escopo)
> "registrar as entradas e saídas, que tudo seja de fácil acesso, e que ela possa olhar
> rapidamente pelo telefone — otimizar para fácil entendimento e usabilidade."

Tradução de produto:
- **Núcleo P0:** lançar entrada/saída e ver o saldo. Nada além disso é obrigatório na v1.
- **Plataforma:** **mobile-first de verdade** (não desktop adaptado). Ela vive no celular.
- **Critério de sucesso = UX, não feature.** "Olhar rápido" = dashboard glanceável; lançar em 2-3 toques.

## Decisões travadas (2026-06-25)
- **Escopo v1:** Núcleo Stafeni — entradas/saídas + dashboard mobile. (Contas a pagar/receber,
  import OFX, relatórios, Open Finance, copiloto IA, conciliação = **fase 2+**, fora da v1.)
- **Multi-empresa:** 3 empresas ENIAC via **seletor** (cada uma seu livro-caixa separado).
  **Sem visão consolidada** na v1 (evita o risco "grupo econômico" e complexidade desnecessária).
- **Schema multi-empresa-ready:** `company_id` em tudo desde já; consolidado é só uma query depois.
- **App novo:** `apps/eniac-financeiro` (Next 15 + React 19 + TS + Tailwind + Supabase).
  `apps/crm-novo` NÃO é base de financeiro (é CRM de WhatsApp); só serve de referência de auth/Supabase wiring.

## Escopo v1 (o que entra)
1. **Auth** — login por usuário (Supabase Auth). Usuários: Stafeni + founder (admin).
2. **Seletor de empresa** — topo da tela, troca o contexto do livro-caixa (3 empresas ENIAC).
3. **Dashboard glanceável (home)** — saldo atual (destaque), total de entradas e saídas do mês,
   últimos lançamentos. Tudo acima da dobra no celular.
4. **Lançar (quick-add)** — botão flutuante → folha inferior: toggle entrada/saída, valor (teclado
   numérico grande), categoria (chips), descrição opcional, data (default = hoje) → salvar. Meta: 2-3 toques.
5. **Lista de lançamentos** — agrupada por dia, sinal +/− colorido, editar/excluir.
6. **Filtro simples** — por categoria e por mês.

## Fora da v1 (fase 2+, já previsto na proposta como "fora do MVP")
- Contas a pagar/receber com vencimentos
- Import OFX/CSV
- Open Finance (Pluggy/Belvo) + conciliação automática
- Copiloto conversacional + previsão de fluxo + alertas proativos
- Visão consolidada do grupo + geração de anexos de licitação (sinergia Noyce)
- Relatórios gerenciais avançados

## Schema mínimo (Supabase / Postgres + RLS)
```sql
-- empresas do grupo (3 ENIAC; nomes a confirmar com founder)
create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- vínculo usuário ↔ empresas que pode ver (RLS)
create table company_members (
  user_id uuid references auth.users(id),
  company_id uuid references companies(id),
  role text default 'member',
  primary key (user_id, company_id)
);

-- lançamentos do livro-caixa
create table entries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id),
  entry_date date not null default current_date,
  type text not null check (type in ('in','out')),  -- entrada / saída
  amount numeric(15,2) not null check (amount > 0),
  category text,
  description text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);
create index idx_entries_company_date on entries(company_id, entry_date desc);
-- RLS: usuário só vê/edita entries de companies em company_members.
```
Saldo = soma(in) − soma(out) por empresa (computado, nunca "inventado" — princípio do CONTEXT).

## Categorias default (editáveis)
- **Entradas:** Vendas, Serviços, Recebimentos, Outros
- **Saídas:** Fornecedores, Salários, Impostos, Aluguel, Operacional, Outros

## Princípios de UX (o pedido real da Stafeni)
- Mobile-first; nada essencial fora da dobra no celular.
- Lançar deve ser a ação mais fácil do app (FAB sempre acessível, teclado numérico grande).
- Valor e saldo em tipografia grande; cores semânticas (verde entrada / vermelho saída).
- Zero jargão contábil na tela (sem "débito/crédito", "partida dobrada").
- Carregamento instantâneo na home (dado pré-agregado).

## Fase 2 (CONSTRUÍDA 25/Jun — founder pediu "todos")
Migration `0002_fase2.sql` (scheduled + entries.source/external_ref + bank_connections + RLS + RPC
`scheduled_open_totals`). Navegação inferior (Início/Vencimentos/Relatórios/Mais) + grupo `(app)`.
1. **Relatórios** (`/relatorios`) — resultado do mês, quebra por categoria (barras), export CSV + imprimir/PDF. Sem deps externas.
2. **Contas a pagar/receber** (`/vencimentos`) — abas a pagar/a receber, grupos vencidas/próx.7d/depois, totais, baixa que GERA lançamento real, excluir. Sem deps externas.
3. **Import OFX/CSV** (`/importar`) — parser OFX+CSV client-side, categorização heurística, preview editável, import em lote com **dedup por external_ref**. Sem API externa.
4. **Open Finance / Pluggy** (`/conexoes`) — cliente server-side completo (auth→connect_token→accounts→transactions), connect widget via CDN, sync com dedup, remover. **Fallback gracioso**: sem `PLUGGY_CLIENT_ID/SECRET` mostra "não configurado", não quebra.

build/typecheck/lint VERDES; smoke das 6 rotas = 200, zero erros. Tudo em `apps/eniac-financeiro`, ainda NÃO commitado.
🔴 **Pendente p/ Open Finance funcionar de fato:** chaves Pluggy (trial grátis 14d) + v1 no ar.

## Fase 3 (CONSTRUÍDA 25/Jun)
Navegação "Mais" vira hub. **4 entregas:**
1. **Consolidado** (`/consolidado`) — saldo somado das 3 empresas + por empresa, nav de mês. Determinístico. ⚠️ nota legal: somatório derivado/não-persistido, não constitui demonstração contábil nem caracteriza grupo econômico (conclave G3).
2. **Previsão de caixa** (`/previsao`) — projeção DETERMINÍSTICA do saldo (atual + vencimentos em aberto por data), snapshots 30/60/90d, alerta se ficar negativo. `lib/forecast.ts` puro.
3. **Alertas proativos** — `lib/alerts.ts` puro (regras: saldo negativo / contas vencidas / vence em ≤3d / projeção negativa), faixa na home acima da dobra. Sem IA.
4. **Copiloto** (`/assistente`) — chat que responde sobre as finanças. **Tools tipadas / function calling** (get_balance / month_totals / category_breakdown / scheduled_totals), número SEMPRE computado pelo banco (nunca gerado pelo LLM), **guard G8** (informa, não aplica imposto/atesta conformidade → manda pro contador), escopo por empresa via RLS. **Provider: OpenAI** (`gpt-4o-mini` default, env `OPENAI_MODEL`) via REST — founder vai prover a chave OpenAI (HYDRA já usa gpt-4o-mini). ⚠️ diverge do CONTEXT ("família Claude 4.x") por decisão do founder. **Fallback gracioso** sem `OPENAI_API_KEY` ("não configurado").

build/typecheck/lint VERDES; 9 rotas smoke=200 zero-erro. NÃO commitado.
🔴 **ADIADO com justificativa — Anexos de licitação (BP/DRE+índices):** o livro é partida SIMPLES (caixa); BP/DRE real exige partida dobrada (veredito A do conclave) — não derivável sem inventar número. Sub-projeto à parte, ligado ao Noyce. Ressalva: o copiloto deveria ter eval-gate adversarial antes de produção (conclave).
🔴 **Pendente p/ copiloto rodar:** `OPENAI_API_KEY` no servidor (founder vai prover).

## Inputs pendentes do founder (não bloqueiam o scaffold)
- [ ] Nomes reais das 3 empresas ENIAC (placeholder até lá: ENIAC 1 / 2 / 3).
- [ ] Ajustes nas categorias default.
- [ ] Confirmar usuários iniciais (Stafeni + founder?).
