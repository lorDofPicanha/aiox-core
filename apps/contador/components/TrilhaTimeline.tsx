"use client";

/**
 * TrilhaTimeline — timeline vertical APPEND-ONLY da trilha de boa-fé (DESIGN §6.2).
 *
 * Recebe os nós JÁ enriquecidos pelo server (app/trilha/page.tsx): ator+papel/CRC,
 * classe de insumo, glyph/label semânticos e o hash verificável. Este componente é
 * client SÓ pela interação de copiar o hash (clipboard) e o toggle de relativo —
 * nada de edição/exclusão (a trilha é visualmente "selada", DESIGN §6.2).
 *
 * G6: não performa prova que não existe. O carimbo de tempo aparece como
 * "pendente (ACT ICP-Brasil)" porque o token formal é Fase 4.
 */

import { useState } from "react";

export interface TrilhaNo {
  id: number;
  seq: number;
  glyph: string;
  /** Categoria semântica (captura/análise · apontamento · decisão/aprovação · carimbo). */
  categoria: "captura" | "apontamento" | "decisao" | "carimbo" | "outro";
  tipoLabel: string;
  /** Ator: nome + papel/CRC já resolvidos no server. */
  atorNome: string;
  atorDetalhe: string | null;
  acao: string;
  /** Timestamp ABSOLUTO (auditoria) + relativo pré-formatado. */
  absoluto: string;
  relativo: string;
  /** Classe do insumo de prova (◆ XML 1ª · ◇ OCR 2ª). null = evento sem insumo. */
  classeInsumo: "xml" | "ocr" | null;
  hashEvento: string;
  /** Carimbo de tempo: Fase 1 sempre pendente (honesto). */
  carimbo: "pendente";
}

export interface DiaGrupo {
  dia: string;
  diaLabel: string;
  nos: TrilhaNo[];
}

const CATEGORIA_CLASS: Record<TrilhaNo["categoria"], string> = {
  captura: "no-captura",
  apontamento: "no-apontamento",
  decisao: "no-decisao",
  carimbo: "no-carimbo",
  outro: "no-outro",
};

function InsumoBadge({ classe }: { classe: "xml" | "ocr" }) {
  // ◆ XML = 1ª classe de prova · ◇ OCR = 2ª classe (DESIGN §1 princípio 6).
  const glyph = classe === "xml" ? "◆" : "◇";
  const label = classe === "xml" ? "XML (1ª classe)" : "OCR (2ª classe)";
  return (
    <span className="insumo" title={label}>
      <span aria-hidden="true">{glyph}</span>
      {label}
    </span>
  );
}

function HashCopiavel({ hash }: { hash: string }) {
  const [copiado, setCopiado] = useState(false);
  const curto = hash.length > 20 ? `${hash.slice(0, 10)}…${hash.slice(-8)}` : hash;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1400);
    } catch {
      // Clipboard indisponível (ex.: contexto não-seguro): seleção manual abaixo.
      setCopiado(false);
    }
  }

  return (
    <button
      type="button"
      className="hash-chip mono num"
      onClick={copiar}
      title={`Copiar hash verificável\n${hash}`}
      aria-label={`Copiar hash do evento ${hash}`}
    >
      <span aria-hidden="true">{copiado ? "✓" : "⧉"}</span>
      {copiado ? "copiado" : curto}
    </button>
  );
}

export function TrilhaTimeline({ grupos }: { grupos: DiaGrupo[] }) {
  return (
    <div className="trilha" aria-label="Trilha de boa-fé (append-only, somente leitura)">
      {grupos.map((g) => (
        <section key={g.dia} className="trilha-dia">
          <div className="trilha-dia-head">
            <span className="trilha-dia-label">{g.diaLabel}</span>
            <span className="trilha-dia-count muted">{g.nos.length} evento(s)</span>
          </div>
          <ol className="trilha-list">
            {g.nos.map((no) => (
              <li key={no.id} className={`trilha-no ${CATEGORIA_CLASS[no.categoria]}`}>
                <span className="trilha-node-glyph" aria-hidden="true">
                  {no.glyph}
                </span>
                <div className="trilha-node-body">
                  <div className="trilha-node-line">
                    <span className="trilha-tipo">{no.tipoLabel}</span>
                    <span className="trilha-seq muted mono num">#{no.seq}</span>
                  </div>
                  <div className="trilha-ator">
                    <strong>{no.atorNome}</strong>
                    {no.atorDetalhe ? (
                      <span className="muted"> · {no.atorDetalhe}</span>
                    ) : null}
                  </div>
                  <p className="trilha-acao">{no.acao}</p>
                  <div className="trilha-meta">
                    <span className="trilha-ts" title="Timestamp absoluto (auditoria)">
                      {no.absoluto}{" "}
                      <span className="muted">({no.relativo})</span>
                    </span>
                    {no.classeInsumo ? <InsumoBadge classe={no.classeInsumo} /> : null}
                    <span className="trilha-carimbo muted" title="Carimbo de tempo formal chega na Fase 4">
                      <span aria-hidden="true">⧗</span> carimbo pendente (ACT ICP-Brasil)
                    </span>
                  </div>
                  <div className="trilha-hash">
                    <HashCopiavel hash={no.hashEvento} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
