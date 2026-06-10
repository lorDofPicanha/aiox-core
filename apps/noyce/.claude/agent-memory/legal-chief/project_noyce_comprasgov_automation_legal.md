---
name: noyce-comprasgov-automation-legal
description: Veredito jurídico automação Noyce no Compras.gov.br/PNCP (sistema PÚBLICO federal) — API oficial pública encorajada por lei; leitura é o mais permissivo; act-side = humano confirma
metadata:
  type: project
---

Parecer Legal Chief 2026-06-09 — Noyce (agente licitações da ENIAC) no **Compras.gov.br + PNCP** (sistema PÚBLICO FEDERAL, SEGES/Delog/MGI; ≠ BLL privado). Relatório: `D:\AIOS\docs\projects\buscador-licitacoes\03-legal\comprasgov-tos-automacao-review.md`. Companion de [[noyce-bll-automation-legal]].

**Régua nova do cliente (calibra tudo):** autônomo = descobrir/ler/monitorar/baixar/analisar/triar/habilitação/RASCUNHAR; humano confirma = LANCE, envio de declaração, envio de proposta, protocolo de impugnação/recurso.

**Achado central — DIFERENTE do BLL:** sistema público tem **API OFICIAL pública e gratuita, ENCORAJADA por lei** (LAI 12.527/2011 + art.174 Lei 14.133). Leitura automatizada não está no silêncio (como BLL) — é a finalidade declarada da política de dados abertos. Logo, "LER/MONITORAR" é o nível MAIS PERMISSIVO dos dois: encorajado, sem login, sem risco contratual.

**APIs oficiais confirmadas (sem auth p/ consulta):**
- PNCP `https://pncp.gov.br/api/consulta`: `/v1/contratacoes/publicacao` (editais novos), `/v1/contratacoes/proposta` (propostas em aberto), `/v1/atas`, `/v1/contratos`, `/v1/pca/`. JSON, paginação tamanhoPagina≤500.
- Compras Dados Abertos `https://dadosabertos.compras.gov.br/swagger-ui/index.html` (+ Postman view/13166820/2sA3XJjPpR): Módulo 7 Contratações (dispensa/pregão/concorrência/inexigibilidade, lançado 26/07/2024 MGI, gratuito LAI), CATMAT/CATSER, SICAF, Resultados.
- Comprasnet Contratos `https://contratos.comprasnet.gov.br/api/docs`.

**Recomendação de arquitetura:** discovery/monitoramento/leitura federal do Noyce roda 100% sobre API pública (API-first), NÃO sobre login. Itens ler/analisar/rascunhar = allowedNow, não dependem de vault.

**Lance:** ComprasGov tem **robô de lances NATIVO** na plataforma (IN SEGES 67/2021 dispensa + IN 73/2022 art.19/22§1 pregão): humano parametriza valor mínimo sigiloso + intervalo mínimo, sistema dispara. Logo NÃO precisa robô externo — humano define parâmetro (ato vinculante), plataforma executa. TCU Ac.2071/2025 favorável.

**Act-side converge com BLL:** lance/declaração/proposta/recurso = ato vinculante do licitante, irretratável, risco criminal (Lei 14.133 art.155/156 + tipos penais 337-E ss.; ME/EPP falsa, fé pública). Política da ENIAC (humano confirma) bate exatamente na linha jurídica. Intenção de recurso = registrar no momento (anti-preclusão, Niebuhr); razões+decisão de recorrer = humano.

**vs BLL:** leitura MUITO mais segura no público (API oficial vs silêncio/scraping). Atuar = mesmo regime severo nos dois.

**Why:** ENIAC quer Noyce autônomo exceto atos vinculantes; no público a lei já encoraja a leitura e oferece lance nativo, então o produto destrava mais cedo e mais limpo que no BLL.
**How to apply:** ao construir discovery federal do Noyce, usar PNCP/dadosabertos como fonte primária (já é o que o app faz — confirma a escolha). Humano-no-clique em lance/declaração/proposta/recurso = gate de produto. Mind clones: marcal-justen-filho, joel-de-menezes-niebuhr.
