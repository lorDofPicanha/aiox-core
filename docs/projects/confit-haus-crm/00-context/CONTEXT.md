# CONTEXT — Confit Haus CRM

> Carregue este arquivo ANTES de propor ou implementar qualquer coisa no projeto.
> Glossário, IDs, decisões travadas e becos-sem-saída. Atualizado: 29/Mai/2026.

## O cliente

**Confit Haus** — marca artesanal de **geleias e molhos** (feitos à mão, sem conservantes,
"sabor de fruta de verdade"). Linhas: Tradicional, Zero Açúcar, Molhos. Manual de marca v01,
fev/2026. Fundada por família (origem no quintal de casa). Posicionamento: acolhedora,
cuidadosa, verdadeira, afetiva, simples. Tagline: **"Sabores que criam memórias."**

## A dor (por que ele comprou)

Falta de relacionamento/atendimento/tracking/análise com os clientes. Vendeu-se a ele um
**CRM + bot de apoio**, tudo num **dashboard único conectado ao WhatsApp**.

## Os "vários nichos"

Confit Haus vende para tipos de cliente diferentes — é isso que o vendedor classifica:
`Restaurantes/Gastronomia`, `Cafés & Padarias`, `Empórios & Lojas de Presente`,
`Corporativo (brindes/kits)`, `Consumidor Final`, `Revendedores`. (Lista editável no app.)

## Decisões TRAVADAS (não reabrir sem motivo)

| # | Decisão | Escolha | Motivo |
|---|---|---|---|
| D1 | Build approach | **Híbrido**: Chatwoot (inbox WhatsApp + bot) + dashboard custom Next.js/Supabase (pipeline/análise) | Chatwoot resolve o WhatsApp (commodity caro) de graça; o pipeline de vendas é a diferenciação e o Chatwoot NÃO tem |
| D2 | Tenancy | **Single-tenant** (só Confit Haus) | Não vai revender. AGPL não é problema (self-host). RLS mesmo assim, pra deixar porta aberta barata |
| D3 | WhatsApp | **Cloud API OFICIAL, direto (sem BSP)** | Libs não-oficiais (Baileys/Evolution) têm ondas de ban em 2025; cicatriz Tocks "circumventing systems". Inbox reativo é ~grátis (msg de serviço livre na janela 24h) |
| D4 | Bot | **Híbrido regras-primeiro + LLM copilot** (rascunha, humano aprova). NUNCA auto-envia preço/compromisso | Hallucination = risco de receita/jurídico em venda |
| D5 | Fonte da verdade do estado | **Postgres (CRM)**, Redis só cache de contexto | Evita split-brain bot↔CRM |
| D6 | LGPD | by design desde o dia 1: consent_log, audit_log, export/exclusão por titular, retenção c/ purge | Base = legítimo interesse; marketing = opt-in. Dosimetria ANPD dá desconto por compliance documentado |

## Becos-sem-saída (NÃO propor)

- ❌ WhatsApp não-oficial (Evolution/Baileys/wppconnect) em número de cliente — ban sem recurso.
- ❌ Bot autônomo enviando preço/proposta sem aprovação humana.
- ❌ Chatwoot como CRM de vendas (ele é inbox de atendimento — sem pipeline nativo).
- ❌ Postgres Changes do Supabase pro inbox em tempo real (gargalo conhecido — usar **Broadcast**).
- ❌ Forkar Chatwoot (perde upgrades semanais). Usar via **API/webhook + custom attributes**, não fork.

## Stack travada

Chatwoot (self-host, MIT) · WhatsApp Cloud API · Next.js (App Router) · Supabase
(Postgres + Auth + RLS + Realtime/Broadcast) · LLM BYOK (modelo barato→caro, tiered).

## Marca / Design

Ver `BRAND-SYSTEM.md`. Resumo: dashboard usa **azul institucional** como UI base
(o manual define azul = organização/dados/credibilidade), **verde** como cor-alma da marca,
**amarelo** como acento/destaque, **off-white** como respiro. Fontes: Newsreader (títulos) +
Inter Tight (corpo/UI).

## Mockups (cliente)

Telas geradas via **Stitch** (projeto `12837086164234401415`, design system `caa1ec474ad2493fb86c8c851b7ebb83`)
a partir do BRAND-SYSTEM. 4 telas: Inbox WhatsApp+copilot, Pipeline kanban, Ficha do contato, Análise.
**Entregável client-facing PRINCIPAL:** `03-mockups/Confit-Haus-CRM-Apresentacao-site.html` (landing page
scrollável, tema custom Confit Haus via theme-factory, nav fixa, mockups em moldura de browser, funil em
scroll horizontal com 7 etapas, narrativa "dia a dia" + 6 passos + checklist de ajustes). Versão PDF tb existe
(`...-Apresentacao.pdf` — 8pp, mais limitada no funil). Builders: `build_site.py` (HTML) e `build_apresentacao.py` (PDF).
Telas corrigidas: menu PT-BR, botão "+ Novo lead", inbox sem corte, funil c/ 7 colunas (Ganho+Recompra). PNGs `0X-*.png`.
**Aguardando feedback/adaptações do cliente antes de travar PRD/schema.**

## Pesquisa-fonte

Tech-research completa (4 eixos, fontes 2025-26 trianguladas) + conclave HYDRA
(werner-vogels, lead-qualifier, erik-nymanczuk/LGPD) → ver `../02-architecture/01-arquitetura-crm.md`.
