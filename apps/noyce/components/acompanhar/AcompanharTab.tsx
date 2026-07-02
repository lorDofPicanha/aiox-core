"use client";

// Acompanhar (estágio 5) — a DOR #1 do cliente: perder por NÃO acompanhar a movimentação/prazo.
// Painel "Vigilância de prazo" READ-ONLY: o Sentinela (maestro-runtime) arma um relógio por
// evento preclusivo (proposta, intenção/razões de recurso, contrarrazões, impugnação…) e o
// sentinelaWatch ordena por urgência (vencido→t-0→t-1→t-3→ok). O countdown usa o relógio REAL
// (atualiza sozinho) — é vigilância de verdade, não um snapshot. Nada é mutado aqui.
import { useEffect, useState } from "react";
import type { Opportunity } from "@/lib/noyce-model";
import type { SessionResult } from "@/lib/agents/maestro-types";
import { sentinelaWatch, clockKindLabel, type SentinelaAlert } from "@/lib/agents/maestro-runtime";
import { eniacCcp } from "@/lib/noyce-data";
import { isMeEpp } from "@/lib/noyce-me-advantages";

// Mesma chave usada pela RecorrerTab — o relógio de recurso registrado lá entra na vigilância aqui.
const SESSION_RESULT_PREFIX = "noyce.session-result.v1.";

const LEVEL_LABEL: Record<SentinelaAlert["level"], string> = {
  vencido: "VENCIDO",
  "t-0": "VENCE HOJE",
  "t-1": "vence amanhã",
  "t-3": "≤ 3 dias",
  ok: "no prazo",
};
const LEVEL_COLOR: Record<SentinelaAlert["level"], string> = {
  vencido: "#a33",
  "t-0": "#a33",
  "t-1": "#8a6516",
  "t-3": "#8a6516",
  ok: "#1c6c44",
};

function humanRemaining(msUntil: number): string {
  const abs = Math.abs(msUntil);
  const d = Math.floor(abs / 86_400_000);
  const h = Math.floor((abs % 86_400_000) / 3_600_000);
  const corpo = d > 0 ? `${d}d ${h}h` : `${h}h`;
  return msUntil <= 0 ? `há ${corpo}` : `faltam ${corpo}`;
}

function fmtBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

// Cartão da sessão (D-0) — empate ficto NA HORA DO LANCE, não só na análise.
// O snapshot de discovery não carrega a modalidade → mostramos as DUAS janelas
// (5% pregão · 10% demais) em vez de chutar; o direito precisa ser exercido no prazo.
function SessionPrepCard({ opportunity }: { opportunity: Opportunity }) {
  if (!isMeEpp(eniacCcp)) return null;
  const ref = opportunity.market?.priceBand?.medianBRL ?? null;
  return (
    <section className="legal-process" aria-labelledby="d0-title">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">🎯 Cartão da sessão — trunfo ME/EPP no lance</p>
          <h3 id="d0-title">Empate ficto: direito de cobrir e vencer</h3>
        </div>
        <span>LC 123 arts. 44-45</span>
      </div>
      <div className="legal-panel">
        <div className="legal-event" style={{ borderLeft: "4px solid #E8932E" }}>
          <div>
            <strong>Na sessão, ao ver o menor lance (L):</strong>
            <p className="meta">
              Se sua proposta ficar até <strong>5%</strong> (pregão) ou <strong>10%</strong> (demais modalidades)
              acima de L, você tem o DIREITO de apresentar proposta inferior e ser adjudicada — antes dos demais
              critérios de desempate. Exercer no prazo ({"pregão eletrônico: 5 min"}); não exercer PRECLUI.
              {ref !== null ? (
                <>
                  {" "}Referência deste órgão (mediana dos vencedores): <strong>{fmtBRL(ref)}</strong> — janela até{" "}
                  <strong>{fmtBRL(ref * 1.05)}</strong> no pregão · <strong>{fmtBRL(ref * 1.1)}</strong> nas demais.
                </>
              ) : (
                <> Sem histórico de preço deste órgão — a janela vale sobre o menor lance da sessão.</>
              )}
              {" "}Confirme a modalidade no edital antes da sessão.
            </p>
          </div>
        </div>
        <div className="legal-event" style={{ borderLeft: "4px solid #1c6c44" }}>
          <div>
            <strong>Certidão vencida não te derruba na hora</strong>
            <p className="meta">
              Como ME/EPP, restrição fiscal/trabalhista só precisa ser sanada em 5 dias úteis APÓS ser declarada
              vencedora (LC 123 art. 43 §1º) — não desista da sessão por CND vencível.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AcompanharTab({ opportunity }: { opportunity: Opportunity }) {
  // `now` só no cliente (evita mismatch de hydration); atualiza a cada minuto p/ o countdown viver.
  const [now, setNow] = useState<string | null>(null);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date().toISOString());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    try {
      const raw = globalThis.localStorage?.getItem(SESSION_RESULT_PREFIX + opportunity.id);
      setSessionResult(raw ? (JSON.parse(raw) as SessionResult) : null);
    } catch {
      setSessionResult(null);
    }
  }, [opportunity.id]);

  const alerts = now ? sentinelaWatch(opportunity, now, sessionResult) : [];
  const algumVencidoFatal = alerts.some((a) => a.level === "vencido" && a.fatalOnMiss);

  return (
    <section className="area area-acompanhar">
      <section className="legal-process" aria-labelledby="vigilancia-title">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">🛡️ Vigilância de prazo — Sentinela</p>
            <h3 id="vigilancia-title">Relógios preclusivos armados</h3>
          </div>
          <span style={{ color: algumVencidoFatal ? "#a33" : undefined }}>
            {algumVencidoFatal ? "⚠️ prazo fatal vencido" : "Movimentação = dor #1"}
          </span>
        </div>

        <div className="legal-panel">
          {!now ? (
            <p className="meta">Carregando vigilância…</p>
          ) : alerts.length === 0 ? (
            <p className="meta">Nenhum relógio preclusivo armado (sem prazo de proposta nem evento processual com data).</p>
          ) : (
            alerts.map((a) => (
              <div className={`legal-event`} key={`${a.kind}-${a.dueAt}`} style={{ borderLeft: `4px solid ${LEVEL_COLOR[a.level]}` }}>
                <div>
                  <strong>{clockKindLabel(a.kind)}</strong>
                  <p className="meta">
                    {new Date(a.dueAt).toLocaleString("pt-BR")} · {humanRemaining(a.msUntil)}
                    {a.fatalOnMiss && <span style={{ color: "#a33" }}> · FATAL (perde se passar)</span>}
                    {a.dateConfidence === "inferred" && <span style={{ color: "#8a6516" }}> · ⚠️ CONFIRMAR DATA</span>}
                  </p>
                </div>
                <span style={{ color: LEVEL_COLOR[a.level], fontWeight: 600 }}>{LEVEL_LABEL[a.level]}</span>
              </div>
            ))
          )}
        </div>
      </section>

      <SessionPrepCard opportunity={opportunity} />

      <section className="legal-process" aria-labelledby="windows-title">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Janelas processuais</p>
            <h3 id="windows-title">Prazo, risco e consequência</h3>
          </div>
        </div>
        <div className="legal-panel">
          {opportunity.legalProcess.events.map((event) => (
            <div className={`legal-event ${event.riskLevel}`} key={event.id}>
              <div>
                <strong>{event.label}</strong>
                <p>{event.consequenceIfMissed}</p>
              </div>
              <span>{event.riskLevel}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="timeline">
        <h3>Linha do tempo</h3>
        {opportunity.timeline.map((event) => (
          <div className={`time-row ${event.status}`} key={event.label}>
            <span />
            <div>
              <strong>{event.label}</strong>
              <p>{event.date}</p>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}
