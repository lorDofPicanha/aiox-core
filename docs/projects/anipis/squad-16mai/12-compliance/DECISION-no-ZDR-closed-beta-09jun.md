# Registro de Decisão — Closed Beta sem ZDR (OpenAI)

**Data:** 09/Jun/2026
**Decisão de:** Breno de Cerqueira Pinheiro (controlador — Pessoa Física)
**Natureza:** Decisão consciente do controlador, revisada sob a ótica LGPD (parecer patricia-peck).
**Status:** APROVADA para o Closed Beta (~20 titulares).

---

## Decisão

O Closed Beta da Anipis **operará sem Zero Data Retention (ZDR)** na operadora de IA ativa (OpenAI). A contratação de ZDR em tier enterprise fica **mantida no roadmap pós-Beta**.

Motivação: não atrasar o lançamento do Closed Beta. ZDR não estava ativo/contratado no momento da decisão.

## O que NÃO foi feito (vedação expressa)

- **NÃO** se falsificou a flag `OPENAI_ZDR_CONFIRMED`. Falsificá-la seria atestação falsa do controlador, infringindo Art. 6º, X (responsabilização) e Art. 41 (cooperação com a ANPD) da LGPD — o mesmo vício que a revisão de 18/Mai já havia barrado no caso Anthropic.

## Caminho honesto adotado (3 condições — parecer patricia-peck)

1. **Renúncia consciente, não falsificação.** Criada a flag explícita `OPENAI_ZDR_WAIVED_ACK` (enforcement `apps/serenity-ai/apps/api/src/config/env-zdr.ts`). O boot de produção segue **fail-closed**: aborta sem ZDR confirmado **OU** renúncia explicitamente reconhecida. Em modo renúncia, emite WARNING no boot. `OPENAI_ZDR_CONFIRMED` permanece intocado e falso.
2. **Base legal da transferência (Art. 33).** A base **primária** é o **consentimento específico e destacado do titular (Art. 33, VIII)** — base completa e suficiente por si só na LGPD. Reforçada por: **Termos de API/Usage Policies da OpenAI** (dados **não** usados para treinamento; retenção temporária de até 30 dias só para monitoramento de abuso, depois eliminação) + **pseudonimização/filtragem de PII na origem** (sem identificadores diretos). **DPA formal também adiado** — a conta OpenAI não é Business; o DPA self-serve exige conta Business, que depende da abertura do **CNPJ**. DPA será executado quando o CNPJ sair.
3. **Documentos alinhados à realidade.** Atualizados nesta data:
   - `anipis-RIPD-DPIA-v2.md` — tabela de operadoras (linha OpenAI → "ATIVA (sem ZDR)") e 4 trechos de risco residual (R2/R5/R8/§8.3).
   - `Privacy-Policy-v2-draft.md` — item (h) das medidas de segurança.
   - Página renderizada `apps/web/src/app/(legal)/privacidade/page.tsx` §6.2 — frase de transparência sobre retenção temporária da OpenAI.

## Risco residual (parecer)

**Baixo-moderado** para um Closed Beta de ~20 titulares com consentimento informado. A transferência tem base própria suficiente no consentimento (Art. 33, VIII); o vetor de treinamento é endereçado pelos Termos de API da OpenAI independentemente de ZDR/DPA; o vetor de retenção/requisição estrangeira é mitigado por pseudonimização + retenção temporária limitada. Aceitável para a fase, com **DPA e ZDR ambos no roadmap pós-CNPJ**.

## Pendência founder (lado OpenAI)

- [ ] **Executar o DPA da OpenAI quando o CNPJ sair** (o DPA self-serve exige conta Business). Adiado — no Closed Beta a base é consentimento (Art. 33, VIII) + Termos de API + pseudonimização.
- [ ] Setar `OPENAI_ZDR_WAIVED_ACK=true` no ambiente de **produção** (decisão consciente; não setar `OPENAI_ZDR_CONFIRMED`).

— Parecer: patricia-peck (LGPD). Execução: Orion + agentes AIOS.
