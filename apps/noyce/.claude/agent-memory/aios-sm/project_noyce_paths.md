---
name: project-noyce-paths
description: Caminhos reais de docs e stories do projeto Noyce (buscador de licitações)
metadata:
  type: project
---

Docs de arquitetura e requisitos do Noyce ficam em `D:\AIOS\docs\projects\buscador-licitacoes\` (NÃO dentro de `apps/noyce/docs/`).

Stories criadas em sprint 15/Jun em `D:\AIOS\docs\projects\buscador-licitacoes\30-stories-reuniao-15jun\`.

**Why:** O repo AIOS é um monorepo. Os docs de produto/arquitetura vivem no root de D:\AIOS\docs\, não dentro do app Next.js.

**How to apply:** Ao criar novas stories do Noyce, usar o path `D:\AIOS\docs\projects\buscador-licitacoes\` como base. O `devStoryLocation` do core-config.yaml aponta para `docs/stories` (relativo ao app), mas o projeto Noyce usa pasta de projeto própria por convenção estabelecida no doc 29.

Relacionado: CCP real em `D:\AIOS\apps\noyce\lib\data\eniac-ccp.json`. Service taxonomy em `D:\AIOS\apps\noyce\lib\data\service-taxonomy.json`.
