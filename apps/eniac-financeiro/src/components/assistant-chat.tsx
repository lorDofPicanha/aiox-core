"use client";

import { useRef, useState, useTransition } from "react";
import { Send, Sparkles, Info } from "lucide-react";
import { askAssistant } from "@/app/(app)/assistente/actions";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = [
  "Qual o saldo atual?",
  "Quanto entrou e saiu este mês?",
  "Quais minhas maiores saídas do mês?",
  "Quanto tenho a pagar e a receber?",
];

export function AssistantChat({ companyId }: { companyId: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);

  function send(text: string) {
    const clean = text.trim();
    if (!clean || pending) return;
    const next = [...messages, { role: "user" as const, text: clean }];
    setMessages(next);
    setInput("");
    setNotice(null);

    startTransition(async () => {
      const res = await askAssistant({
        companyId,
        messages: next.map((m) => ({ role: m.role, text: m.text })),
      });
      if (res.status === "ok" && res.reply) {
        setMessages((cur) => [...cur, { role: "assistant", text: res.reply! }]);
      } else if (res.code === "not_configured") {
        setNotice("O assistente ainda não está configurado (falta a chave OPENAI_API_KEY no servidor).");
      } else {
        setNotice(res.message ?? "Não consegui responder agora.");
      }
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    });
  }

  return (
    <div className="flex min-h-[60vh] flex-col">
      {messages.length === 0 ? (
        <div className="flex-1 space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-accent" />
            <p className="mt-2 text-sm font-semibold">Pergunte sobre suas finanças</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Eu respondo com os números reais desta empresa. Não dou conselho de imposto — isso é com
              o contador.
            </p>
          </div>
          <div className="grid gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm font-medium hover:bg-muted"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-surface text-foreground",
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
          {pending && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm text-muted-foreground">
                pensando…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}

      {notice && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          {notice}
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="sticky bottom-20 mt-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte algo…"
          className="h-12 flex-1 rounded-xl border border-border bg-surface px-4 text-base placeholder:text-muted-foreground focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-white disabled:opacity-40"
          aria-label="Enviar"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
