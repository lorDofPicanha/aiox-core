"use client";

// Fase 3 (29/Jun, simplificado): CORRIGIR é SÓ um chat com a IA. O usuário descreve o problema em
// linguagem natural; a IA (/api/doc-chat) reescreve o documento e a nova versão aparece DENTRO da
// conversa. "Salvar" grava a última versão da IA e TRAVA o item (o motor nunca sobrescreve humano).
import { useState } from "react";

export interface DocChatItem {
  id: string;
  label: string;
  secao: string;
  valorFinal: string;
  proveniencia: string;
}

interface Bubble {
  role: "user" | "assistant";
  text: string; // user: instrução; assistant: explicação do que mudou
  doc?: string; // assistant: documento reescrito (mostrado no balão)
}

export function DocChat({
  item,
  certame,
  onSave,
  onCancel,
}: {
  item: DocChatItem;
  certame: { titulo?: string; orgao?: string; empresa?: string };
  onSave: (correctedText: string) => void;
  onCancel: () => void;
}) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [current, setCurrent] = useState(item.valorFinal); // última versão (vai pro save)
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    const instr = instruction.trim();
    if (!instr || loading) return;
    setLoading(true);
    setError(null);
    const history = bubbles.map((b) => ({ role: b.role, content: b.role === "assistant" ? b.doc ?? b.text : b.text }));
    setBubbles((b) => [...b, { role: "user", text: instr }]);
    setInstruction("");
    try {
      const res = await fetch("/api/doc-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docLabel: item.label,
          secao: item.secao,
          currentText: current,
          proveniencia: item.proveniencia,
          instruction: instr,
          certame,
          history,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? `erro ${res.status}`);
        return;
      }
      setCurrent(data.correctedText);
      setBubbles((b) => [...b, { role: "assistant", text: data.explanation || "Documento reescrito.", doc: data.correctedText }]);
    } catch (e) {
      setError(String((e as Error)?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="doc-chat" style={{ marginTop: 8, borderTop: "1px solid #ccc", paddingTop: 8 }}>
      <p className="meta" style={{ marginTop: 0 }}>
        💬 Corrigir conversando — descreva o que está errado; a IA reescreve o documento citando a fonte e sem inventar número.
      </p>

      <div
        className="doc-chat-log"
        style={{ display: "flex", flexDirection: "column", gap: 8, margin: "8px 0", maxHeight: 320, overflowY: "auto" }}
      >
        {/* Versão atual do documento, como ponto de partida da conversa. */}
        <div style={{ background: "#f6f5f0", borderRadius: 8, padding: "6px 10px", fontSize: 12 }}>
          <strong style={{ fontSize: 11, color: "#666" }}>DOCUMENTO ATUAL</strong>
          <div style={{ whiteSpace: "pre-wrap", marginTop: 2 }}>{item.valorFinal}</div>
        </div>

        {bubbles.map((b, i) =>
          b.role === "user" ? (
            <div key={i} style={{ alignSelf: "flex-end", background: "#e7eefc", borderRadius: 8, padding: "6px 10px", fontSize: 13, maxWidth: "85%" }}>
              {b.text}
            </div>
          ) : (
            <div key={i} style={{ alignSelf: "flex-start", background: "#eef7f0", borderRadius: 8, padding: "6px 10px", fontSize: 13, maxWidth: "92%" }}>
              <em style={{ color: "#1c6c44" }}>{b.text}</em>
              {b.doc && (
                <div style={{ whiteSpace: "pre-wrap", marginTop: 6, paddingTop: 6, borderTop: "1px dashed #b6d4c2", fontSize: 12 }}>
                  {b.doc}
                </div>
              )}
            </div>
          ),
        )}
        {loading && <div style={{ alignSelf: "flex-start", fontSize: 12, color: "#666" }}>IA reescrevendo…</div>}
      </div>

      {error && <small style={{ display: "block", color: "#a33", marginBottom: 4 }}>⚠️ {error}</small>}

      <div style={{ display: "flex", gap: 6 }}>
        <input
          type="text"
          aria-label="Instrução de correção"
          placeholder='ex.: "esse atestado é só corresponsável, ajuste o texto"'
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          disabled={loading}
          style={{ flex: 1 }}
        />
        <button type="button" onClick={send} disabled={loading || !instruction.trim()}>
          {loading ? "…" : "Enviar"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <button
          type="button"
          className="approve"
          onClick={() => onSave(current.trim())}
          disabled={bubbles.length === 0 || !current.trim()}
          title={bubbles.length === 0 ? "Converse com a IA para gerar uma correção antes de salvar." : undefined}
        >
          Salvar correção
        </button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
