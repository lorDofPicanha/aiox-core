---
name: noyce-agent-knowledge-base
description: Where the RAG knowledge base for Noyce's workflow agents lives, and what grounds it
metadata:
  type: project
---

O corpus de conhecimento (RAG) para os AGENTES de IA do Noyce fica em `apps/noyce/lib/data/knowledge-base/` (8 arquivos markdown com frontmatter YAML: 00-overview, 01-workflow-abas, 02-legal-lei-14133, 03-habilitacao-documentos, 04-fontes-e-legalidade, 05-eniac-perfil, 06-consorcio, 07-regras-de-negocio). O motor de retrieval faz chunk por heading `##`/`###`.

**Why:** a cliente ENIAC quer que os agentes do workflow (busca/análise/dossiê/habilitação) saibam O QUE FAZER em cada etapa + tenham base de domínio legal+procedimental.

**How to apply:** ao editar regra de negócio/legal do Noyce, atualizar o KB junto. REGRA DE OURO: ancorar tudo em material que já existe no repo, nunca inventar regra jurídica nova. Fontes-âncora canônicas: docs 23/25/26/29 em `docs/projects/buscador-licitacoes/02-architecture/` (caminho relativo ao REPO ROOT D:\AIOS, não a apps/noyce) + `lib/noyce-source-registry.ts` (HUMAN_REQUIRED_ACTS, calibração legal das fontes) + `lib/noyce-habilitation.ts` + `lib/noyce-operational.ts` + `lib/data/legal-constants.json`. Constantes legais já calibradas: art. 15 consórcio (soma integral §2º / proporcional §3º / +30% §4º isento ME/EPP), art. 67+Súmula TCU 263 (teto 50% parcela maior relevância), art. 69 (10% PL, teto solo ENIAC R$9,19mi), art. 55 (prazos publicação), art. 58 (garantia 1%), art. 164 (impugnação 3 dias úteis). Liga a [[noyce-doc-paths]].
