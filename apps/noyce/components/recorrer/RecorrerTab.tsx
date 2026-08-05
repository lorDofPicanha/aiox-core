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
import { buildRecursoMinuta, type RecursoMinuta } from "@/lib/noyce-recurso-minuta";
import { parseAtaResult } from "@/lib/noyce-ata";
import { eniacCcp } from "@/lib/noyce-data";
import { generateDeclarationBlob, declarationFileName } from "@/lib/noyce-docgen";

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
  const [ataText, setAtaText] = useState("");
  const [fundamentos, setFundamentos] = useState("");
  const [minuta, setMinuta] = useState<RecursoMinuta | null>(null);

  useEffect(() => {
    setResult(loadResult(opportunity.id));
    setOutcome("inabilitada");
    setSessionAt("");
    setMotivo("");
    setAtaText("");
    setFundamentos("");
    setMinuta(null);
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
    setMinuta(null);
    globalThis.localStorage?.removeItem(RESULT_PREFIX + opportunity.id);
  }

  // Cola a ata → pré-preenche o formulário (heurística; humano confere).
  function preencherDaAta() {
    const a = parseAtaResult(ataText);
    setOutcome(a.eniacOutcome);
    if (a.sessionAt) setSessionAt(a.sessionAt.slice(0, 16)); // ISO → datetime-local
    if (a.motivo) setMotivo(a.motivo);
  }

  function gerarMinuta() {
    if (!result) return;
    setMinuta(
      buildRecursoMinuta({
        result,
        plan: buildRecursoPlan(result),
        ccp: eniacCcp,
        certame: { titulo: opportunity.title, orgao: `${opportunity.buyer} · ${opportunity.city}/${opportunity.uf}` },
        fundamentos,
      }),
    );
  }

  async function baixarMinuta() {
    if (!minuta) return;
    const item = {
      id: `recurso-${opportunity.id}`,
      secao: "Recurso",
      label: minuta.titulo,
      valorMotor: minuta.texto,
      proveniencia: "Tribuno (minuta) — revisar/assinar (advogado)",
      status: "aprovado" as const,
      valorFinal: minuta.texto,
    };
    const blob = await generateDeclarationBlob({
      item,
      ccp: eniacCcp,
      certame: { titulo: opportunity.title, orgao: opportunity.buyer },
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = declarationFileName(item, eniacCcp.identity.cnpj);
    link.click();
    URL.revokeObjectURL(url);
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
            <details style={{ margin: "6px 0" }}>
              <summary style={{ cursor: "pointer", fontSize: 13 }}>📄 Colar ata/resultado p/ pré-preencher (opcional)</summary>
              <textarea value={ataText} onChange={(e) => setAtaText(e.target.value)} rows={4} placeholder="Cole aqui o texto da ata da sessão…" style={{ width: "100%", marginTop: 6 }} />
              <button type="button" onClick={preencherDaAta} disabled={!ataText.trim()}>Pré-preencher da ata</button>
              <small className="meta" style={{ display: "block" }}>Heurística — confira os campos antes de registrar.</small>
            </details>
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

            {/* Minuta do Tribuno (recurso/contrarrazões) — preparada pelo Noyce, advogado assina. */}
            {plan?.path !== "indefinido" && plan?.path !== "cobrir_lance_meepp" && (
              <div style={{ marginTop: 12, borderTop: "1px solid #ccc", paddingTop: 10 }}>
                <strong>✍️ Minuta da peça (Tribuno)</strong>
                <p className="meta">Cole os FUNDAMENTOS jurídicos (o cerne da peça). Sem eles, a minuta sai bloqueada p/ assinatura.</p>
                <textarea value={fundamentos} onChange={(e) => setFundamentos(e.target.value)} rows={4} placeholder="Fundamentação: o vício da decisão, base legal (Lei 14.133/TCU), provas…" style={{ width: "100%" }} />
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <button type="button" onClick={gerarMinuta}>Gerar minuta</button>
                  {minuta && <button type="button" onClick={baixarMinuta}>Baixar .docx</button>}
                </div>
                {minuta && (
                  <div style={{ marginTop: 8 }}>
                    <div className="meta" style={{ color: "#8a6516" }}>
                      {minuta.avisos.map((a, i) => (<div key={i}>⚠️ {a}</div>))}
                    </div>
                    <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, background: "#f6f5f0", padding: 10, borderRadius: 8, marginTop: 6 }}>{minuta.texto}</pre>
                  </div>
                )}
              </div>
            )}
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
