---
name: Caminho de QUALIDADE, nunca o caminho FÁCIL
description: Regra estratégica vinculante — squads/agentes DEVEM sempre escolher a solução de maior qualidade, mesmo que mais trabalhosa. Nunca simplificar, refazer ou portar pela metade quando a versão completa já existe e pode ser integrada.
type: feedback
originSessionId: bb85b8f8-d435-4773-9afc-8d088cc62d39
---
# Regra: Qualidade > Facilidade — SEMPRE

**MUST:** Quando existe uma versão completa/pronta de algo (programa, componente, módulo, design) e a tarefa é "integrar no site/projeto", a resposta correta é **INTEGRAR A VERSÃO EXISTENTE COMPLETA**, nunca fazer um port simplificado, uma reescrita "equivalente" ou um placeholder.

**MUST NOT:** Nenhum agente/squad pode optar pelo caminho mais rápido quando isso sacrifica qualidade visual, completude funcional ou fidelidade ao produto existente.

## Incidente que gerou a regra (17/Abr/2026)

**Contexto:** Bretda tinha `arquiteto.html` (2478 LoC) funcionando em `localhost:8080` com configurador 3D completo — tabs CATEGORIA/MODELO/TECIDO/MADEIRA/METAL+PINTURA, GLBs reais de qualidade, click-to-classify, controles MOVER/RESET/GRADE/AMBIENTE/PERSONALIZAR, EXPORTAR SCREENSHOT, SOLICITAR ORÇAMENTO. Era o "programa já criado".

**Pedido do usuário:** "inserir no site novo" (`localhost:8787`).

**O que o squad fez (ERRADO):** Port simplificado inline — `scene.js` 682 LoC + `configurador-init.js` + `tables.js`. Resultado: mesa procedural de aparência amadora, sem a UI completa, sem os controles profissionais, perdeu qualidade cinematográfica. "Caminho fácil."

**O que deveria ter sido feito:** Copiar `arquiteto.html` (e seus GLBs, fonts, texturas) para o diretório do site novo e servir same-origin em `:8787`, com iframe ou rota direta. O programa completo inserido, não recriado.

## Why

1. **Respeito ao trabalho anterior:** Se uma versão polida já existe, descartá-la é destruir valor.
2. **Fidelidade à marca:** High-ticket luxury (Bretda R$33k+) não tolera "versão light". Experiência amadora mata conversão.
3. **Awwwards-level requer original:** Não há como atingir SOTD com reescrita apressada de algo que já estava pronto.
4. **Usuário sempre sabe qual é a versão boa:** Quando ele diz "o programa já está criado, só inserir", essa frase é vinculante — não é para reinterpretar como "port".

## How to apply

### Ao receber qualquer tarefa de integração/inserção/migração:

1. **Pergunta obrigatória ANTES de planejar:** "Existe uma versão completa pronta? Se sim, onde?"
2. **Se existe:** a primeira opção DEVE ser integração direta (iframe same-origin, copy+serve, import, symlink). Reescrita só é admissível se houver incompatibilidade técnica irreparável — e nesse caso o usuário decide, não o squad.
3. **Se squad propuser reescrita/port/simplificação:** flag imediato ao usuário com os trade-offs explícitos. Nunca decidir sozinho por "mais fácil".
4. **Em caso de dúvida entre duas soluções:** escolher a que preserva MAIS qualidade/completude, mesmo que exija mais trabalho.

### Nos briefings para squads/mind clones:

- Incluir explicitamente: "Solução de qualidade máxima obrigatória. Se encontrar versão pronta, integrar completa. Não simplificar."
- Exigir que o squad liste o que está preservando vs o que está descartando.
- Rejeitar entregas que "simplificaram por conveniência".

## Casos que contam como violação

- Port simplificado quando o original completo existe
- "Versão light" de algo que deveria ser idêntico ao produto
- Placeholder procedural onde existem assets reais
- Reescrever em outra stack "porque é mais limpo" sem validar com o usuário
- Remover features "que não eram críticas" sem autorização explícita
- Reduzir fidelidade visual/funcional em nome de performance sem autorização
