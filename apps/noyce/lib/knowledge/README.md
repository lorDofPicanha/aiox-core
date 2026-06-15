# Noyce Knowledge Base (RAG)

Base de conhecimento que os **agentes que operam dentro do Noyce** (busca, análise, dossiê,
habilitação) consultam para entender **o que fazer** e ter **base de domínio** (legal +
procedimental) ao trabalhar.

## Como funciona

- **Corpus** — markdown curado em [`../data/knowledge-base/`](../data/knowledge-base/). Cada
  doc tem frontmatter (`title`/`docId`/`tags`/`sourceRefs`) e é dividido em **chunks por
  heading** (`##`/`###`), então cada seção é uma unidade recuperável auto-contida.
- **Retrieval** — **BM25 léxico**, sem dependência externa (sem embeddings/API). Escolha
  deliberada: determinístico, testável e **nunca "volta vazio" em silêncio** — quando nada
  casa, `RetrievalResponse.empty === true` e o contexto emite um aviso honesto em vez de
  inventar. Heading e tags têm peso extra no índice.
- **Citação de fonte** — cada chunk carrega `sourceRefs` (doc/arquivo que o embasa), incluído
  no bloco de contexto. Mantém o ethos do Noyce: evidência rastreável, sem alucinação.

## Uso pelos agentes

```ts
import { retrieveContext } from "@/lib/knowledge/knowledge-base";

// Bloco pronto pra injetar no prompt do agente, com citações.
const context = retrieveContext("quais certidões preciso atualizar todo mês", { topK: 4 });
```

API de baixo nível (quando precisar dos resultados estruturados):

```ts
import { getKnowledgeIndex, retrieve } from "@/lib/knowledge/knowledge-base";
const res = retrieve(getKnowledgeIndex(), "consórcio art 15", 5);
// res.results[].chunk.{docId, heading, headingPath, text, sourceRefs}, res.results[].score, res.empty
```

## Uso pelo terminal (humano ou agente via CLI)

```bash
node --experimental-strip-types scripts/noyce/kb-query.mjs "documental da empresa parceira"
node --experimental-strip-types scripts/noyce/kb-query.mjs --top 6 --raw "prazo vencido"
```

## Manutenção

- Adicionar conhecimento = adicionar/editar um `.md` em `data/knowledge-base/` (frontmatter +
  seções `##`). O índice reconstrói no próximo processo; em testes use `resetKnowledgeCache()`.
- **Não invente regra jurídica** no corpus — ancore em doc do repositório e cite em `sourceRefs`.
- Para plugar embeddings depois: adicionar um scorer paralelo e combinar em `retrieve()`. A
  superfície (`retrieveContext`) não muda.

## Evolução futura (embeddings)

O retrieval léxico cobre bem um corpus curado. Se o corpus crescer muito ou exigir match
semântico além de sinônimos, dá pra blendar embeddings — mantendo o BM25 como piso robusto
(o léxico garante que uma key morta de embedding não derrube a recuperação).
