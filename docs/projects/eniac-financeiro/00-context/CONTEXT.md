# CONTEXT — ENIAC Financeiro (plataforma de gestão financeira multi-empresa)

> Carregue este arquivo ANTES de propor/implementar qualquer coisa neste projeto.
> Criado: 2026-06-20 · Owner produto: founder (Breno) · Agente líder: @aios-master (Orion)

## O que é
Plataforma de **gestão financeira completa** (não só livro-caixa entradas/saídas) para o
**grupo ENIAC** — **3 empresas de segmentos diferentes**. Mesmo cliente do projeto **Noyce**
(buscador de licitações). Internamente para a ENIAC agora; arquitetar pensando em **produtizar
depois** (modelo Noyce / workflow-as-a-service).

## Pilares
1. **Núcleo financeiro multi-empresa** — livro-caixa + contas a pagar/receber + fluxo de caixa
   + visão consolidada das 3 empresas + por empresa. (Decidir: caixa simples vs partida dobrada.)
2. **Open Finance (Brasil)** — puxar dados bancários (saldo, extrato, Pix, boletos, recebíveis).
   Decisão de **agregador vs participante regulado = SAIR DA PESQUISA** (comparar Pluggy/Belvo/Klavi).
3. **4 agentes de IA embutidos:**
   - Categorização + **conciliação** (extrato Open Finance × lançamentos)
   - **Previsão de fluxo de caixa** (projeção de saldo, risco de caixa)
   - **Copiloto conversacional** (perguntas em linguagem natural → resposta + gráfico)
   - **Alertas + insights proativos** (anomalia, vencimento, oportunidade)

## Decisões travadas (2026-06-20)
- Destino: **interno ENIAC (3 empresas)**, arquitetar para virar SaaS depois.
- Open Finance: **comparar agregadores na pesquisa**, recomendar (não cravado).
- Agentes IA: **os 4** (todos).

## Constraints / princípios
- **Números SEMPRE computados, nunca gerados pelo LLM** (copiloto chama tools/SQL; modelo não inventa valor).
- Stack base do ecossistema: **Next.js 15 + React 19 + TypeScript + Supabase (Postgres + RLS)**.
- LLM: família **Claude 4.x** (Opus/Sonnet/Haiku) — padrão do projeto.
- LGPD by design (dado bancário sensível + consentimento Open Finance).
- Isolamento por empresa (RLS / tenant) entre as 3 empresas.

## Reaproveitar (já existe no monorepo)
- `docs/projects/contador/` — pesquisa de mercado contábil BR já feita (tech-research, comparativo Gestorize/Conta Azul, mega-pesquisa-hydra). **Adjacente, reaproveitar.**
- `apps/crm-novo/` — esqueleto Next + **Supabase wired** (.env.example, supabase/) → base de skeleton.
- `apps/radar-fiscal/`, `apps/contador` (radar-fiscal :3007) — apps fiscais adjacentes.
- `apps/noyce/` — mesmo cliente (ENIAC), padrão de squad LLM Claude.

## Glossário / IDs
- "as 3 empresas" = grupo ENIAC (segmentos diferentes — nomes a confirmar com founder).
- Agregador OF candidatos: Pluggy, Belvo, Klavi.

## Status
- 2026-06-20: kickoff. 4 frentes de pesquisa disparadas (repos GitHub, Open Finance+mercado,
  arquitetura agentes IA, mineração corpus HYDRA). Síntese → `research/`. Próximo: PRD + arquitetura.

## Dead-ends conhecidos
- (vazio — preencher conforme a pesquisa eliminar caminhos, ex.: "participante regulado direto = caro/lento" se confirmado.)
