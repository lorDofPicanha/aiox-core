// Types for the Noyce knowledge base (RAG) consumed by the in-system agents.

// A retrievable unit: one heading-delimited section of a knowledge doc.
export interface KnowledgeChunk {
  id: string; // `${docId}#${slug}`
  docId: string;
  title: string; // doc title
  heading: string; // the section heading (or doc title for the intro chunk)
  headingPath: string[]; // breadcrumb of enclosing headings
  text: string; // section body (heading stripped)
  tags: string[];
  sourceRefs: string[]; // docs/files that ground this knowledge
}

// Parsed knowledge document (frontmatter + chunks).
export interface KnowledgeDoc {
  docId: string;
  title: string;
  tags: string[];
  audience: string | null;
  sourceRefs: string[];
  chunks: KnowledgeChunk[];
}

// BM25 index over all chunks.
export interface KnowledgeIndex {
  chunks: KnowledgeChunk[];
  // term -> number of chunks containing it
  docFreq: Map<string, number>;
  // per-chunk term frequencies, aligned with `chunks`
  termFreqs: Array<Map<string, number>>;
  // per-chunk token length, aligned with `chunks`
  lengths: number[];
  avgLength: number;
  builtAt: string;
}

export interface RetrievalResult {
  chunk: KnowledgeChunk;
  score: number;
}

export interface RetrievalResponse {
  query: string;
  results: RetrievalResult[];
  // true when no chunk matched any query term — caller should NOT treat the
  // (empty) result set as "nothing relevant exists" silently.
  empty: boolean;
}
