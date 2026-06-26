"use client";

// Recorrer (estágio 6) — a dor #1: perder e o sistema NÃO deixar recorrer a tempo.
// O humano INGERE o resultado da sessão (ata) → o Maestro deriva o CAMINHO e ARMA o relógio
// PRECLUSIVO de razões/contrarrazões (3 d.u., art. 165 — conferir edital). Vigilância em tempo
// real do prazo fatal. Todo ato vinculante (intenção, protocolo, assinatura) é HUMANO.
import { useEffect, useState } from "react";
import type { Opportunity } from "@/lib/noyce-model";
import type { EniacOutcome, SessionResult } from "@/lib/agents/maestro-types";
import { buildRecursoPlan } from "@/lib/agents/maestro-runtime";
import { deadlineAlertLevel } from "@/lib/noyce-deadline";
import { legalDecisionAction } from "@/lib/noyce-operational";

const RESULT_PREFIX = "noyce.session-result.v1.";
const OUTCOMES: { v: EniacOutcome; label: string }[] = [
  { v: "vencedora", label: "Vencedora (provisória)" },
  { v: "inabilitada", label: "Inabilitada" },
  { v: "derrotada_julgamento", label: "Derrotada no julgamento" },
  { v: "desclassificada", label: "Desclassificada" },
  { v: "empate_ficto_meepp", label: "Empate ficto ME/EPP" },
  { v: "indefinido", label: "Indefinido (aguardando ata)" },
];
const LEVEL_COLOR = { vencido: "#a33", "t-0": "#a33", "t-1": "#8a6516", "t-3": "#8a6516", ok: "#1c6c44" };
const LEVEL_LABEL = { vencido: "VENCIDO", "t-0": "VENCE HOJE", "t-1": "vence amanhã", "t-3": "≤ 3 dias", ok: "no prazo" };

function loadResult(id: string): SessionResult | null {
  try {
    const raw = globalThis.localStorage?.getItem(RESULT_PREFIX + id);
    return raw ? (JSON.parse(raw) as SessionResult) : null;
  } catch {
    return null;
  }
}

export function RecorrerTab({ opportunity }: { opportunity: Opportunity }) {
  const { appealIntent, appealReasons, decisionPoints } = opportunity.legalProcess;
  const [result, setResult] = useState<SessionResult | null>(null);
  const [outcome, setOutcome] = useState<EniacOutcome>("inabilitada");
  const [sessionAt, setSessionAt] = useState("");
  const [motivo, setMotivo] = useState("");
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    setResult(loadResult(opportunity.id));
  }, [opportunity.id]);
  useEffect(() => {
    const tick = () => setNow(new Date().toISOString());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  function registrar() {
    if (!sessionAt) return;
    // datetime-local → ISO com fuso BR (−03:00) p/ não deslizar o instante (preclusão).
    const iso = sessionAt.length === 16 ? `${sessionAt}:00-03:00` : sessionAt;
    const r: SessionResult = {
      editalId: opportunity.id,
      editalVersionHash: opportunity.id,
      sessionAt: iso,
      eniacOutcome: outcome,
      motivo: motivo || undefined,
      source: "manual",
      confidence: "observed",
    };
    setResult(r);
    globalThis.localStorage?.setItem(RESULT_PREFIX + opportunity.id, JSON.stringify(r));
  }

  function limpar() {
    setResult(null);
    globalThis.localStorage?.removeItem(RESULT_PREFIX + opportunity.id);
  }

  const plan = result ? buildRecursoPlan(result) : null;
  const fatalLevel =
    plan?.fatalClock && now ? deadlineAlertLevel(plan.fatalClock.dueAt, now) : null;

  return (
    <section className="area area-recorrer">
      <section className="legal-process" aria-labelledby="recorrer-title">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">⚖️ Recorrer (estágio 6) — resultado da sessão</p>
            <h3 id="recorrer-title">Caminho de recurso + prazo fatal</h3>
          </div>
          <span>Copiloto, não representante</span>
        </div>

        {/* Ingestão do resultado da sessão (ata) */}
        {!result ? (
          <div className="appeal-box" style={{ display: "block" }}>
            <p className="meta">Registre o resultado da sessão para o Noyce armar o relógio de recurso:</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 8 }}>
              <select value={outcome} onChange={(e) => setOutcome(e.target.value as EniacOutcome)}>
                {OUTCOMES.map((o) => (
                  <option key={o.v} value={o.v}>{o.label}</option>
                ))}
              </select>
              <input type="datetime-local" value={sessionAt} onChange={(e) => setSessionAt(e.target.value)} aria-label="Data/hora da sessão" />
              <input type="text" placeholder="motivo (com fonte)" value={motivo} onChange={(e) => setMotivo(e.target.value)} style={{ minWidth: 220 }} />
              <button type="button" onClick={registrar} disabled={!sessionAt}>Registrar resultado</button>
            </div>
          </div>
        ) : (
          <div className="appeal-box" style={{ display: "block" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h4 style={{ margin: 0 }}>{plan?.title}</h4>
              <button type="button" onClick={limpar}>refazer</button>
            </div>
            <p className="meta">{plan?.resumo}</p>

            {plan?.fatalClock && (
              <div style={{ margin: "8px 0", padding: "8px 12px", borderRadius: 8, borderLeft: `4px solid ${fatalLevel ? LEVEL_COLOR[fatalLevel] : "#999"}`, background: "#f6f5f0" }}>
                <strong>⏳ Prazo fatal — {plan.fatalClock.label}</strong>{" "}
                {fatalLevel && <span style={{ color: LEVEL_COLOR[fatalLevel], fontWeight: 600 }}>{LEVEL_LABEL[fatalLevel]}</span>}
                <div className="meta">{new Date(plan.fatalClock.dueAt).toLocaleString("pt-BR")} · perder este prazo = perde o direito de recorrer.</div>
              </div>
            )}

            <ol style={{ margin: "8px 0 0", paddingLeft: 18 }}>
              {plan?.steps.map((s, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  <strong>{s.label}</strong>{" "}
                  <span className="chip">{s.humanAct ? "ato humano" : "preparo Noyce"}</span>
                  <div className="meta">
                    {s.dueAt ? `${new Date(s.dueAt).toLocaleString("pt-BR")} · ` : ""}{s.basis} — {s.note}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Estado processual (dados duráveis) + pontos de decisão — preservado */}
        <div className="appeal-box" style={{ marginTop: 12 }}>
          <div>
            <p className="eyebrow">Recurso (estado durável)</p>
            <h4>Intenção separada das razões</h4>
            <span>{appealIntent.groundsSummary}</span>
          </div>
          <div className="appeal-status">
            <strong>{appealIntent.submissionStatus}</strong>
            <small>Intenção: {appealIntent.windowStatus}</small>
            <small>Razões: {appealReasons.draftStatus}</small>
          </div>
        </div>

        <div className="decision-points">
          {decisionPoints.map((decision) => {
            const da = legalDecisionAction(decision);
            return (
              <div className="decision-point" key={decision.id}>
                <div>
                  <strong>{da.action}</strong>
                  <p>
                    <strong>{da.owner}</strong> — {da.note}
                  </p>
                </div>
                <span>{da.externalBlocked ? "ato externo bloqueado" : "preparo interno"}</span>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}
