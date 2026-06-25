/**
 * S12 — Health Score cross-módulo da carteira (o diferencial nº1 da frente e-CAC).
 *
 * "Só nós temos os 2 lados" (handoff 58 §6): esta tela cruza, por cliente, a SITUAÇÃO FISCAL da
 * carteira (e-CAC: caixa postal / CNDs) com a DIVERGÊNCIA DE CLASSIFICAÇÃO (core: cClassTrib /
 * apontamentos) num único score de exposição + ranking por risco. Ninguém mais junta os dois.
 *
 * Server Component fino (espelha /ecac e /): carrega os dois lados READ-ONLY, reconcilia a
 * carteira (mapa explícito — health-score-data.ts), roda o engine puro (health-score-model.ts)
 * e delega a interação ao HealthScoreCockpit (client). NÃO toca write-paths de nenhum dos lados
 * (D9): o score é uma VIEW, não funde as trilhas.
 *
 * G6 (CONTEXT §5 · doc 45): "health score" exige cuidado redobrado. Nada aqui afirma
 * "regularizado", "em dia", "sem risco", "garantido" nem "aprovado". O score é um INDICADOR DE
 * ATENÇÃO que prioriza a carteira — não promete desfecho fiscal. A ação (revisar, renovar,
 * responder) é do contador (human-in-loop).
 */
import { Card } from "@/components/Card";
import { TopBar } from "@/components/TopBar";
import { getApi, ESCRITORIO_ID } from "@/lib/api";
import { carregarEntradasHealth } from "./health-score-data";
import { rankearCarteira, resumirHealth } from "./health-score-model";
import { HealthScoreCockpit } from "./HealthScoreCockpit";
import styles from "./saude-carteira.module.css";

/** Render sob demanda: a triagem de prazos do e-CAC deriva da data atual (prazos relativos). */
export const dynamic = "force-dynamic";

export default async function SaudeCarteiraPage() {
  const refIso = new Date().toISOString();
  const api = await getApi();

  // Reconciliação de carteira + leitura dos 2 lados (READ-ONLY) — ver health-score-data.ts.
  const entradas = await carregarEntradasHealth(api, ESCRITORIO_ID, refIso);

  // Engine puro: score 0–100 + banda + breakdown explicável, ranking por risco (pior primeiro).
  const ranking = rankearCarteira(entradas);
  const resumo = resumirHealth(ranking);

  return (
    <>
      <TopBar
        title="Saúde da carteira — health score"
        sub="Score de exposição por cliente cruzando auditoria (core · cClassTrib) e situação fiscal (e-CAC · caixa postal / CNDs). Indicador de atenção, não desfecho fiscal."
      />
      <div className="content">
        <Card title="O que esta tela faz">
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-dim)" }}>
            Esta é a leitura que <strong>cruza os dois lados</strong> que normalmente moram em
            sistemas separados: de um lado, as <strong>divergências de classificação</strong>{" "}
            (cClassTrib) e os indícios de auditoria do core; do outro, a{" "}
            <strong>situação fiscal</strong> da carteira no e-CAC (intimações com prazo, CNDs
            vencidas / a vencer, mensagens da Receita). O resultado é um{" "}
            <strong>score de exposição</strong> por cliente (0–100) e um ranking por risco para o
            contador <strong>saber por quem começar</strong>. O score é um indicador que{" "}
            <strong>prioriza</strong> — ele não regulariza, não promete crédito nem atesta
            situação fiscal. A decisão e a ação seguem sendo do contador.
          </p>
        </Card>

        {/* KPIs do topo (4): críticos / atenção / saudáveis / score médio. */}
        <div className={`grid ${styles.kpiGrid}`} style={{ marginTop: 16 }}>
          <Card>
            <div className="kpi">
              <span className={`kpi-value num ${styles.kpiCritico}`}>{resumo.criticos}</span>
              <span className="kpi-label">Clientes em banda crítica</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className={`kpi-value num ${styles.kpiAtencao}`}>{resumo.atencao}</span>
              <span className="kpi-label">Clientes em atenção</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{resumo.saudaveis}</span>
              <span className="kpi-label">Clientes em banda saudável</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{resumo.scoreMedio ?? "—"}</span>
              <span className="kpi-label">Score médio da carteira</span>
            </div>
          </Card>
        </div>

        <Card
          title="Carteira por score de exposição"
          sub="Pior score no topo. Abra um cliente para ver o breakdown: o que puxa o score, separado por lado (auditoria do core × situação fiscal do e-CAC), com peso e número-fonte."
        >
          <HealthScoreCockpit scores={ranking} />
          {resumo.semLadoEcac > 0 ? (
            <p className={styles.notaReconciliacao} role="note">
              <span aria-hidden="true">◇</span>{" "}
              {resumo.semLadoEcac} cliente(s) pontuados só pelo lado da auditoria — sem leitura
              e-CAC reconciliada (a identidade do cliente é unificada por CNPJ no adapter real). O
              score sinaliza o lado ausente em vez de inventá-lo.
            </p>
          ) : null}
        </Card>

        <Card title="Como o score é calculado (transparente)">
          <p className="card-sub">
            Cada cliente começa em <strong>100</strong> e <strong>perde pontos</strong> por
            indício — com <strong>peso nomeado</strong> e teto por fator (sem número mágico). Os
            fatores de prazo fiscal correndo (intimação no limite, CND vencida) pesam mais que
            indícios pendentes de auditoria, porque têm relógio externo. Bandas:{" "}
            <strong>≥ 80 saudável</strong> · <strong>50–79 atenção</strong> ·{" "}
            <strong>&lt; 50 crítico</strong>.
          </p>
          <p className="disclaimer" style={{ marginTop: 8 }}>
            A régua de pesos é uma <strong>priorização</strong>, não um veredito fiscal — a
            recalibração com dados reais é etapa posterior (golden-set + adapters). Esta é a única
            tela que <strong>compõe</strong> os dois lados, e ela é <strong>somente-leitura</strong>:
            não altera a trilha da auditoria nem a do e-CAC.
          </p>
        </Card>

        <Card title="Disclaimer-credencial (G6)">
          <p className="disclaimer">
            Demonstração com dados <strong>sintéticos</strong>. O health score é um{" "}
            <strong>indicador de atenção</strong> que cruza a situação fiscal da carteira (e-CAC) e
            as divergências de classificação (auditoria) para priorizar a revisão. Ele{" "}
            <strong>não</strong> promete crédito garantido, apuração correta, ausência de multa nem
            prova jurídica plena; <strong>não</strong> declara cliente "regular" nem "sem risco". A
            revisão e a ação (renovar CND, responder intimação, aprovar apontamento) são atos do
            contador. As leituras reais via Integra Contador (SERPRO) / Infosimples e a unificação
            de identidade por CNPJ são gate do founder (adapters S1/S4).
          </p>
        </Card>

        <p className={styles.rodapeSelo} role="note">
          <span className={styles.rodapeGlyph} aria-hidden="true">
            ◇
          </span>
          Dados de demonstração (base sintética). Score cross-módulo é leitura; adapters reais e
          unificação de cliente por CNPJ = gate.
        </p>
      </div>
    </>
  );
}
