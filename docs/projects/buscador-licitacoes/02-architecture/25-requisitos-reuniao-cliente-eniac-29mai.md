# Requisitos da reunião com o cliente (ENIAC / Stéfane) — 29/Mai/2026

**Fonte:** 2 reuniões (16:10 + 16:26), notas do Gemini (`Downloads/Reunião...29 16_10/16_26...docx`) + gravação `.mp4` (verbatim disponível via faster-whisper se preciso). Apresentação pela Bretda demonstrando o V1 do Noyce. Decisora: **Stéfani** (nas notas do Gemini aparece como "tefa"/"stefane" — **é a mesma pessoa**); técnica: **Alice** (ENIAC). ⚠️ **Giovana é de OUTRA empresa** (não ENIAC) — citada como contato operacional, não confundir com a equipe da ENIAC.

**Veredito do cliente:** V1 **aprovado** (design + cores ENIAC OK). Pediu logo "mais autêntica" + animação. Confirmou o rumo (moat + revisão humana) e **adicionou requisitos concretos** que mudam o modelo de dados e a análise.

---

## A. Requisitos NOVOS (explícitos do cliente) — não estavam no roadmap

| # | Requisito | O que é | Aba | Dependência |
|---|-----------|---------|-----|-------------|
| **R1** | **CAT/CAO na probabilidade de vitória** | A probabilidade REAL de ganhar depende de **Certidão de Acervo Técnico (CAT, do engenheiro)** + **Certidão de Acervo Operacional (CAO, da empresa)** — não dos critérios gerais. Integrar ao score de viabilidade. | Analisar/Habilitar | CATs/CAOs (Stéfane envia) |
| **R2** | **Modo Consórcio** | Empresa atua em 2 modos: (a) **independente** (acervo próprio); (b) **consórcio** (2 empresas por contrato, uma é a **líder** responsável por documentação/acervo). Sistema deve suportar ambos na análise de habilitação/viabilidade. | Habilitar/Analisar | modelo de dados |
| **R3** | **Detector de licitação SUSPEITA (direcionamento)** 🟢 | Comparar exigências do edital atual vs **padrões históricos** do órgão/objeto → sinalizar discrepâncias significativas (exigência exótica/direcionada). Investigar se vitórias recorrentes de um concorrente têm **fundamento técnico OU indício de influência externa**. **Interesse da liderança.** | Analisar/Monitorar | histórico PNCP (já temos) |
| **R4** | **Automação da Habilitação Técnica** | Auto-preencher **declarações** exigidas pelo edital; buscar **certidões negativas ("nada consta")**; verificar requisitos de qualificação **técnica/fiscal/trabalhista**. **Sempre com revisão humana.** | Habilitar | edital parsing + vault |
| **R5** | **IA de propostas/planilhas + revisão Alice** | IA gera proposta/planilha; **Alice corrige 100% (humano obrigatório)** — "as entregas da IA não são 100% verídicas". | Habilitar | balancetes + base |
| **R6** | **Econômico-financeira via balancetes** | Equipe envia balancetes (input humano) → dados no sistema → IA processa a parte econômico-financeira. | Habilitar | balancetes (Stéfane) |
| **R7** | **Base de conhecimento = histórico real de licitações** 🟢 | Stéfane fornece **arquivo no Mega** com histórico de licitações participadas → base de conhecimento da IA. **(É o que faltava: histórico de DERROTA da ENIAC + perfil de capacidade — que o PNCP não dá.)** | transversal | arquivo Mega (Stéfane) |
| **R8** | **Logo "mais autêntica" + animação de engrenagens** | Manter padrão/cores; tornar a logo mais autêntica + **animar as engrenagens** (giro) pra dar "vida" ao elemento visual. | UI/brand | nenhuma (fazer já) |

## B. Requisitos que CONFIRMAM o roadmap/conclave

- **R9 · Recorrer com análise jurídica por IA** — IA faz análise jurídica inicial de processos perdidos + prepara o insight; **humano revisa e protocola** (decisão final humana). → **Confirma moat #8 + o modelo de segurança** (ato externo bloqueado, revisão humana). Cronograma: ~1 semana de preparação técnica.
- **R10 · Inteligência competitiva** (quem ganha mais) → **confirma #6 Raio-X do Órgão**, agora com o ângulo de **direcionamento** (R3).
- **R11 · Aba de acompanhamento** com linhas do tempo, prazos de proposta e janelas → **confirma Acompanhar**.
- **R12 · Triagem por prazo + probabilidade** → confirma o score/triagem atual; cliente quer que evolua com CAT/CAO (R1).

## C. Dependências que o cliente vai entregar (Stéfane se comprometeu)
- **CATs/CAOs** (acervo técnico-operacional) → R1, R4.
- **Arquivo Mega** com histórico de licitações participadas → R7 (base IA, perfil de capacidade, histórico de derrota, treino do detector R3).
- **Balancetes** → R6.
- Contato da **Alice** (requisitos técnicos, ENIAC). ⚠️ Giovana = **outra empresa** (não ENIAC), não confundir.

## D. 🎯 Teste de validação marcado pelo cliente
- **Reforma de escola em Valparaíso (de Goiás) — dia 3 de junho.** Stéfane vai usar essa licitação real pra testar a capacidade de análise da ferramenta. → **Forcing function.** Preparar a análise desse órgão (Valparaíso GO, IBGE 5221858) no discovery + Raio-X + detector de suspeita até 03/Jun.

## E. Plano de implementação (reconciliado conclave + cliente)

1. **JÁ (sem dependência):** R8 logo + **animação de engrenagens**. Adicionar **Valparaíso** ao seed de discovery/competitor (pro teste de 03/Jun).
2. **Buildável agora (dado PNCP que já temos):** **R3 detector de licitação suspeita/direcionamento** (compara exigências do edital vs normas históricas do órgão) — alto valor, interesse da liderança, sem depender de doc do cliente. + **R2 modo consórcio** (modelo de dados).
3. **Quando CATs/CAOs + Mega history chegarem:** R1 (CAT/CAO no score) + R7 (perfil de capacidade + base) + R4 (automação habilitação) + R6 (econômico-financeira).
4. **Moat jurídico:** R9 Recorrer (IA analisa + humano decide) + guardrail anti-alucinação.
5. **R5** IA propostas/planilhas com revisão Alice (depois da base R7).

**Princípio reforçado pelo cliente (e pelo conclave):** **revisão humana obrigatória** em tudo que a IA gera (proposta, recurso, habilitação). A responsabilidade final é humana. O guardrail anti-alucinação (#10) é exigência do próprio cliente ("IA não é 100% verídica").

---
*Extraído das atas Gemini 16:10 + 16:26. Backlog reconcilia com docs `23` (abas) + `24` (pesquisa/conclave). Próximo concreto: animação engrenagens + Valparaíso no seed + detector de suspeita (R3).*
