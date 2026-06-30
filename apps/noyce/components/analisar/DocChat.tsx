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
    <div className="doc-chat">
      <div className="doc-chat-log">
        {/* Versão atual do documento, como ponto de partida da conversa. */}
        <div className="doc-chat-current">
          <strong>DOCUMENTO ATUAL</strong>
          <div className="body">{item.valorFinal}</div>
        </div>

        {bubbles.map((b, i) =>
          b.role === "user" ? (
            <div key={i} className="doc-chat-bubble user">
              {b.text}
            </div>
          ) : (
            <div key={i} className="doc-chat-bubble assistant">
              <em>{b.text}</em>
              {b.doc && <div className="doc-rewrite">{b.doc}</div>}
            </div>
          ),
        )}
        {loading && <div className="doc-chat-typing">IA reescrevendo…</div>}
      </div>

      {error && <small className="doc-chat-error">⚠️ {error}</small>}

      <textarea
        className="doc-chat-input"
        aria-label="Instrução de correção"
        placeholder={'Descreva o que ajustar — ex.: "esse atestado é só corresponsável, ajuste o texto"  (Enter envia · Shift+Enter quebra linha)'}
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        disabled={loading}
        rows={3}
      />

      <div className="doc-chat-actions">
        <button type="button" className="doc-chat-send" onClick={send} disabled={loading || !instruction.trim()}>
          {loading ? "Enviando…" : "Enviar"}
        </button>
        <span className="spacer" />
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
