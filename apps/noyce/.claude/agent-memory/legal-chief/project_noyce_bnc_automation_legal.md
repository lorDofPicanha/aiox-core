---
name: noyce-bnc-automation-legal
description: Veredito jurídico sobre automação autônoma do Noyce no portal privado BNC (bnccompras) — calibrado pela régua "humano só clica o ato vinculante"; BNC roda sobre a BLL
metadata:
  type: project
---

Parecer Legal Chief 2026-06-09 sobre o Noyce (agente de licitações da ENIAC, CNPJ 36.819.268/0001-05) atuar no **BNC — Bolsa Nacional de Compras** (bnccompras.com). Relatório: `D:\AIOS\docs\projects\buscador-licitacoes\03-legal\bnc-tos-automacao-review.md`. Mesmo framework do [[noyce-bll-automation-legal]].

**Fato estrutural nº 1:** a **BNC roda SOBRE a BLL COMPRAS** (mesmo motor de software + mesmo template regulamentar). Por isso o parecer BLL se transporta quase integral. Diferença material única: acesso público.

**Régua nova do cliente (calibrar por ela):** Noyce faz ~95% sozinho (descobrir→ler→monitorar→baixar→analisar→habilitar→**RASCUNHAR** proposta/declaração/recurso). Humano só dá o **clique vinculante** em: LANCE, envio de declaração, envio de proposta, protocolo de impugnação/recurso. **Cliente JÁ tirou o lance autônomo da mesa** (mais conservador que a lei, que admite lance automático via IN 73/2022 + TCU 2071/2025 → há folga de segurança).

**Cláusulas BNC (citadas de edital que reproduz o regulamento + Anexo X lido na íntegra):** Cl. 2.12/3.3/3.5 (senha pessoal/intransferível, BNC se exime "ainda que por terceiros") · Cl. 2.14 (licitante responsável, atos "firmes e verdadeiras (...) diretamente ou por seu representante" — linguagem ACOMODA preposto/ferramenta) · Cl. 2.13/4.4 (dever de acompanhar a sessão = humano-no-loop exigido) · Cl. 3.2/3.6 (credenciamento = vinculação ao edital + presunção de capacidade) · Anexo X item iv (designar PESSOA responsável p/ operar). **SILÊNCIO sobre robô/scraping/API** (igual BLL). Política priv = LGPD + Marco Civil, sem cláusula anti-scraping.

**Acesso público (sondado AO VIVO, HTTP 200 sem login):** `bnccompras.com/Process/ProcessSearchPublic?param1=0` (lista ~100 processos), `/Process/ProcessView?param1=...` (detalhe), `ProcessSearchPublicByLocation`, `DirectBuySearchPublic`. **→ ADAPTER PÚBLICO DE DESCOBERTA/MONITORAMENTO LIBERÁVEL HOJE, sem vault.** RESSALVA: download da íntegra do edital NÃO confirmado público (provável login → tratar como item autenticado pós-vault). Isto é a diferença vs BLL.

**Diferença BNC vs BLL:** BLL tem Art. 5º/9º ESCRITOS garantindo consulta+download público da íntegra. BNC NÃO tem cláusula escrita; acesso público confirmado tecnicamente mas íntegra provavelmente atrás de login. Em todo o resto = idênticos (mesmo motor). Lance Fácil integra com BNC = tolerância de fato a robô.

**Veredito calibrado:** itens 1-5 (descobrir/ler/monitorar/baixar público/RASCUNHAR) = PODE SOZINHO, allowedNow hoje. Itens 6-8 (login/coleta autenticada/registro de intenção de recurso) = PODE C/ MITIGAÇÃO pós-vault. Itens 9-12 (LANCE/envio declaração/envio proposta/protocolo recurso) = HUMANO CLICA (régua do cliente). Itens 13-14 (raspagem de dado pessoal de terceiros; burlar regra/intervalo) = NUNCA.

**Why:** ENIAC quer máquina fazendo 95% mas reservando o ato vinculante ao humano; responsabilidade objetiva irretratável (Cl. 2.14) recai no CNPJ da ENIAC, não no Noyce.
**How to apply:** ao desenhar o adapter BNC do Noyce, soltar descoberta/monitoramento públicos JÁ (paralelo ao PNCP); pôr download-da-íntegra e login atrás do vault; humano-no-loop nos 4 atos vinculantes é gate de produto. bnc.org.br dá 403 a fetch — usar bnccompras.com (endpoints públicos) e editais municipais que reproduzem o regulamento. Pendências p/ confirmar c/ a BNC (contato@bnc.org.br): API/parceiro + se íntegra é pública.
