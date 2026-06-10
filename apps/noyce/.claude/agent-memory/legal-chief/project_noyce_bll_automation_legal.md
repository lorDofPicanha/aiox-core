---
name: noyce-bll-automation-legal
description: Veredito jurídico sobre automação autônoma do Noyce no portal privado BLL (bllcompras) — níveis pode/mitiga/proibido e onde humano é obrigatório
metadata:
  type: project
---

Parecer Legal Chief 2026-06-09 sobre o Noyce (buscador/agente de licitações da ENIAC, CNPJ 36.819.268/0001-05, ME obras GO) atuar autonomamente no **BLL — Bolsa de Licitações e Leilões** (operadora PRIVADA, regulamento de adesão prevalece; ≠ PNCP que é dado aberto). Relatório: `D:\AIOS\docs\projects\buscador-licitacoes\03-legal\bll-tos-automacao-review.md`.

**Achado central:** Regulamento BLL 2024 (lido na íntegra; original bll.org.br dá 403, usei espelho guapirama.pr.gov.br) **NÃO veda robôs/scraping/API** — silêncio. O que governa é RESPONSABILIDADE, não proibição.

**Cláusulas-chave:** Art. 5º/9º (consulta+download de edital público = PERMITIDO) · Art. 14 + def.XV (senha pessoal/intransferível, risco no titular) · Art. 13 §3 + Art. 27 (licitante responsável por TODA ação no sistema, "firme e verdadeira", IRRETRATÁVEL) · Art. 32 II (declaração falsa → suspensão + CRIMINAL) · Art. 26 (dever do licitante acompanhar a sessão).

**Veredito por nível:**
- LER/monitorar/baixar edital público = PODE SOZINHO (baixo). Já é allowedNow, não depende de vault.
- Login autenticado leitura + lance automatizado = PODE C/ MITIGAÇÃO (vault, rate-limit, intervalo+valor mínimo por humano, ler edital do certame).
- DECLARAR (ME/EPP, habilitação), PROPOR (proposta final), RECORRER (impugnação/recurso) autônomo = PROIBIDO (humano-no-loop obrigatório, risco criminal/irretratável recai na ENIAC, não no Noyce).

**Marco legal:** lance automático é DISCIPLINADO (IN 67/2021 dispensa; IN 73/2022 art.19 pregão — valor mínimo + intervalo). TCU virou favorável: **Acórdão 2071/2025 (1ª Câmara)** sem vícios em robô, superando restritivos 2601/2011 e 1216/2014. Limite = cumprir edital + regras do sistema. Fraude ao caráter competitivo = Lei 14.133 art.155/337-E.

**Gatilho blocked_until_vault → allowedNow:** vault cifrado de credenciais = o próprio bloqueio. Pedir API/autorização formal à BLL (existe mercado de robôs integrados: Lance Fácil/Licitei/LanceBot = tolerância de fato). Atos declaratórios/recursais ficam bloqueados POR DESIGN, não por falta de vault.

**Why:** cliente ENIAC quer "fazer tudo sozinho"; o risco do act-side recai sobre o CNPJ da ENIAC (responsabilidade objetiva irretratável), não sobre a ferramenta.
**How to apply:** ao desenhar login/automação do Noyce no BLL, separar os 3 níveis; humano-no-loop em declarar/propor/recorrer é gate de produto, não opção. Distinto do trabalho de [[noyce]] no PNCP (dado aberto, sem essa trava). Mind clones jurídicos disponíveis: marcal-justen-filho (doutrina), joel-de-menezes-niebuhr (prática pregão/preclusão).
