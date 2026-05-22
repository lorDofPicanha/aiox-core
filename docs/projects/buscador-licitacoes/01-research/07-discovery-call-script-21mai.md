# Roteiro de Discovery Call — Noyce (cliente: operação de 3 empresas) — 21/Mai/2026

**Objetivo:** fechar **C1 + D1–D6** com a cliente — as decisões humanas que bloqueiam os sprints. **Duração alvo:** 45-60min.
**Princípio:** a cliente já validou o workflow nos áudios (CONTEXT §10.1). A call é para **dados operacionais e prioridade**, não para revalidar o problema.

## Material para levar
- Os **11 editais já analisados** (prova que entendemos o negócio de obras dela — gera confiança).
- O **mapa das 5 fontes** (PCP/BLL/BNC/ComprasGov/SISLOG) + workflow 6 estágios.
- A marca **Noyce** (se for momento de apresentar).

---

## Bloco A — Empresas & usuários  → destrava **C1, D5** (RLS/vault, Sprint 0)
- **A1.** Quais são as 3 empresas (razão social + CNPJ)? Qual delas faz licitação pública?
- **A2.** Confirmando: as outras 2 são só operação financeira (livro caixa), fora do buscador?
- **A3.** Quem são os **4 usuários** do buscador e o que cada um faz? (quem **busca** / quem **habilita** / quem **dá lance** / quem **recorre**)
- **A4.** Alguma empresa tem mais de um CNPJ/filial? (define cardinalidade do schema)

## Bloco B — Fontes & disputa  → destrava **D2, D3** (ordem dos adapters, Stage 5)
- **B1.** Em quais plataformas vocês disputam hoje, e **com que frequência cada uma**? (PCP / BLL / BNC / ComprasGov / SISLOG / outras) → define a prioridade real P0/P1.
- **B2.** Usam algum **robô de lance** hoje (Lance Fácil ou similar)? Se sim, qual, em quais portais, e o que ele cobre? (pesquisa mostra: Lance Fácil cobre BLL/BNC/PCP via automação com a credencial de vocês)
- **B3.** Como ficam sabendo de um edital novo hoje? (refresh manual? e-mail da BNC? alguém garimpa?) → confirma a dor do Stage 1.
- **B4.** No dia do certame, como acompanham os lances? Já perderam por não acompanhar? → confirma DOR #1 (Stage 5).
- **B5.** Vocês têm **certificado digital e-CNPJ (A1/A3)**? Quem opera? → o Stage 5 autenticado roda **sob a credencial/identidade de vocês, com consentimento** (achado da pesquisa: não há API de sessão; automação usa o login do licitante).

## Bloco C — Geografia  → destrava **D1, D6** (filtro de raio)
- **C1.** Confirmando: sede em Águas Lindas e vocês atendem num **raio de ~500km**? (mantemos esse raio como escopo)
- **C2.** Esse raio é **fixo** ou muda conforme o tipo de obra/logística? (D6)
- **C3.** Em quais **UFs/regiões** vocês já têm contrato ou cadastro hoje? (refina onde priorizar cobertura — a amostra deu 100% GO ≤170km, mas é só amostra)

## Bloco D — Livro caixa  → destrava **D4** (confirma fora do build)
- **D1.** O livro caixa das 3 empresas é separado do buscador. Vocês usam alguma ferramenta hoje (Granatum / Conta Azul / Bling / contador)? → confirma adotar SaaS BR, não construir.

## Bloco E — Operação de habilitação  → alimenta **Stage 4 + vault (X3)**
- **E1.** Como montam a habilitação hoje, e quanto tempo leva? → baseline do Stage 4.
- **E2.** Quais **atestados / CAT / acervo técnico** vocês têm? → corpus do matcher (X3).
- **E3.** Quais documentos rotineiros (CND / CRF / SICAF) e suas validades? → vault.

## Bloco F — Prioridade & dor  → define ordem de sprint / MVP
- **F1.** Dos 6 estágios, **qual dói mais hoje**? (Monitorar / Analisar / Indicar / Habilitar / Acompanhar / Recorrer)
- **F2.** Se entregássemos **só UMA coisa primeiro**, qual seria? → escopo do MVP.

---

## Mapa pergunta → decisão → sprint
| Bloco | Decisão destravada | Sprint que libera |
|---|---|---|
| A1-A2 | C1 (empresas) | Sprint 0 (onboarding/vault) |
| A3-A4 | D5 (papéis), cardinalidade | Sprint 0 (RLS / X2) |
| B1 | D2 (prioridade fontes) | Sprint 1 (ordem adapters) |
| B2, B4-B5 | D3 (build-vs-integrate Stage 5) + consentimento | Sprint 4 (Stage 5) |
| C1-C2 | D1, D6 (raio) | Sprint 0 (filtro geo) |
| D1 | D4 (livro caixa) | escopo (fora do build) |
| E1-E3 | corpus + vault | Sprint 2 (Stage 4 / X3) |
| F1-F2 | ordem de sprint / MVP | sequenciamento geral |

## Pós-call
- Atualizar o CONTEXT.md (§10.6 / §11.4) com as respostas → fecha C1 e D1–D6.
- Se PCP confirmar P0: **solicitar a chave da API já** (lead ~7 dias úteis — `01-research/05-pcp-api`).
- Coletar atestados/CAT da cliente para o experimento de parsing do Stage 4.

---
*Roteiro por Orion (aios-master). Foco em dado operacional + prioridade; o problema já foi validado nos áudios.*
