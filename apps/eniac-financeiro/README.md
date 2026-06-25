# Livro Caixa ENIAC

Gestão financeira **mobile-first** do grupo ENIAC — registrar **entradas e saídas**,
com **olhar rápido pelo celular**. v1 deliberadamente enxuta (Núcleo Stafeni).

> Spec: `docs/projects/eniac-financeiro/V1-SPEC-livro-caixa-stafeni.md`
> Contexto: `docs/projects/eniac-financeiro/00-context/CONTEXT.md`

## Stack
Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 · Supabase (Postgres + RLS).

## Escopo v1
- Login por email (magic link, Supabase Auth)
- Seletor de empresa (3 empresas ENIAC; cada uma seu livro-caixa)
- Dashboard glanceável: **saldo atual** + entradas/saídas do mês
- Lançar entrada/saída em 2-3 toques (folha inferior + teclado numérico)
- Lista por dia, navegação por mês, excluir lançamento

Fora da v1 (fase 2+): contas a pagar/receber, import OFX, Open Finance/Pluggy,
copiloto IA, conciliação, visão consolidada, anexos de licitação.

## Rodar local
```bash
cp .env.example .env.local   # preencher chaves do Supabase
npm install
npm run dev                  # http://localhost:3010
```

## Banco
Migrations em `supabase/migrations/`. Aplicar:
```bash
supabase db push     # projeto linkado
# ou supabase db reset para recriar local
```
`0001_init.sql` cria `companies`, `company_members`, `entries`, RLS por membership,
RPCs de saldo/totais, trigger que vincula todo novo usuário às 3 empresas e seed
(`Sentinela`, `ENIAC 2`, `ENIAC 3` — renomear quando os nomes forem confirmados).

## Princípios
- Números **sempre computados** (RPCs SQL), nunca gerados/“inventados”.
- Isolamento por empresa garantido por **RLS** (nunca por filtro client-side).
- Mobile-first: nada essencial fora da dobra; lançar é a ação mais fácil do app.
- Zero jargão contábil na tela.
