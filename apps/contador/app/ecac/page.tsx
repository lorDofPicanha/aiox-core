/**
 * e-CAC ("a mina", D9 · CONTEXT §3) — ADD-ON premium, NÃO o core.
 *
 * Diagnóstico READ-ONLY em lote da SITUAÇÃO FISCAL DA CARTEIRA (não da nota):
 * caixa postal, CNDs/certidões e ausência de declarações de TODAS as empresas numa
 * tela só. Resolve a dor de entrar no e-CAC cliente-por-cliente (procuração), 100×.
 *
 * Server Component (espelha /fila e /laudos). Auto-contido: dados sintéticos vêm de
 * ecac-model.ts (co-localizado). NÃO toca lib/api.ts, packages/contador-api-client,
 * components/* nem globals.css — só LÊ os componentes compartilhados.
 *
 * G6 (doc 45): e-CAC só MOSTRA a situação extraída do portal. Nada aqui afirma
 * "crédito garantido", "apuração correta", "elimina multa" nem "prova jurídica plena":
 * a consulta é leitura; a ação (parcelar, declarar, contestar) é ato do contador.
 * Selo de honestidade: base sintética; consulta real via Integra Contador (SERPRO)
 * chega na Fase 7 (exige contrato SERPRO + procurações eletrônicas homologadas).
 */
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, type Column } from "@/components/Table";
import { TopBar } from "@/components/TopBar";
import { cnpjMasked } from "@/lib/format";
import {
  CARTEIRA_ECAC,
  SITUACAO_VIEW,
  ausenciaView,
  caixaView,
  motivosPendencia,
  piorSituacao,
  resumoCarteira,
  temPendencia,
  type EcacLinha,
} from "./ecac-model";
import styles from "./ecac.module.css";

export default function EcacPage() {
  const linhas = CARTEIRA_ECAC;
  const resumo = resumoCarteira(linhas);
  const comPendencia = linhas.filter(temPendencia);

  const columns: Column<EcacLinha>[] = [
    {
      key: "cliente",
      header: "Cliente",
      render: (l) => (
        <span className={styles.cli}>
          <span className={styles.cliNome}>{l.clienteNome}</span>
          <span className={`${styles.cliDoc} mono`}>{cnpjMasked(l.documento)}</span>
        </span>
      ),
    },
    {
      key: "caixa",
      header: "Caixa postal",
      render: (l) => <StatusBadge view={caixaView(l.mensagensNovas)} />,
    },
    {
      key: "federal",
      header: "CND Federal / PGFN",
      render: (l) => <StatusBadge view={SITUACAO_VIEW[l.cndFederal]} />,
    },
    {
      key: "estadual",
      header: "CND Estadual",
      render: (l) => <StatusBadge view={SITUACAO_VIEW[l.cndEstadual]} />,
    },
    {
      key: "trabalhista",
      header: "CND Trabalhista",
      render: (l) => <StatusBadge view={SITUACAO_VIEW[l.cndTrabalhista]} />,
    },
    {
      key: "fgts",
      header: "FGTS",
      render: (l) => <StatusBadge view={SITUACAO_VIEW[l.fgts]} />,
    },
    {
      key: "ausencia",
      header: "Ausência de declaração",
      render: (l) => <StatusBadge view={ausenciaView(l.ausenciaDeclaracao)} />,
    },
  ];

  return (
    <>
      <TopBar
        title="e-CAC — carteira"
        sub="Situação fiscal de toda a carteira numa tela só — caixa postal, CNDs e declarações. Add-on premium · diagnóstico de leitura."
      />
      <div className="content">
        {/* O que o módulo resolve (português simples). */}
        <Card title="O que esta tela faz">
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-dim)" }}>
            Em vez de entrar no e-CAC <strong>cliente por cliente</strong> (uma procuração de
            cada vez) para olhar caixa postal, certidões e declarações, o módulo reúne a{" "}
            <strong>situação fiscal de toda a carteira</strong> num só painel. Ele{" "}
            <strong>mostra</strong> onde há pendência — não regulariza, não promete crédito nem
            elimina multa. A decisão e a ação (parcelar, declarar, contestar) seguem sendo do
            contador.
          </p>
        </Card>

        {/* Selo de honestidade (base sintética · Integra Contador na Fase 7). */}
        <div className={styles.selo} role="status" style={{ marginTop: 16 }}>
          <span className={styles.seloGlyph} aria-hidden="true">
            ◇
          </span>
          <span className={styles.seloBody}>
            <span className={styles.seloTitulo}>Demo — base sintética</span>
            <span>
              Os dados desta tela são fictícios. A consulta real via{" "}
              <strong>Integra Contador (SERPRO)</strong> chega na <strong>Fase 7</strong> —
              depende de contrato SERPRO + procurações eletrônicas homologadas. É um diagnóstico{" "}
              <strong>somente-leitura</strong> da situação fiscal: o e-CAC não promete crédito
              garantido, apuração correta nem ausência de multa.
            </span>
          </span>
        </div>

        {/* KPIs da dor: caixa postal não lida · CND irregular · ausência de declaração. */}
        <div className="grid grid-3" style={{ marginTop: 16 }}>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{resumo.comCaixaNaoLida}</span>
              <span className="kpi-label">Com caixa postal não lida</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{resumo.comCndIrregular}</span>
              <span className="kpi-label">Com CND vencida / pendente</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{resumo.comAusenciaDeclaracao}</span>
              <span className="kpi-label">Com ausência de declaração</span>
            </div>
          </Card>
        </div>

        {/* Painel da carteira: 1 linha por cliente, data-dense. */}
        <Card
          title="Painel da carteira"
          sub="Uma linha por cliente. Cada situação é redundante (cor + ícone + texto). Linha vermelha à esquerda = alguma certidão vencida."
        >
          <Table<EcacLinha>
            columns={columns}
            rows={linhas}
            rowKey={(l) => l.clienteId}
            rowClassName={(l) =>
              certidoesVencidas(l) ? "risco" : temPendencia(l) ? "revisar" : undefined
            }
            empty="Nenhum cliente com procuração ativa no e-CAC."
          />
        </Card>

        {/* Filtro/destaque "quem tem pendência". */}
        <Card
          title="Quem tem pendência"
          sub="Somente os clientes com alguma pendência — caixa postal não lida, certidão vencida/pendente ou ausência de declaração. Os demais estão regulares."
        >
          {comPendencia.length > 0 ? (
            <ul className={styles.pendList}>
              {comPendencia.map((l) => {
                const pior = piorSituacao(l);
                return (
                  <li key={l.clienteId} className={styles.pendRow}>
                    <span
                      className={`${styles.pendDot} ${styles[`pendDot_${pior}`]}`}
                      aria-hidden="true"
                    />
                    <span className={styles.pendMain}>
                      <span className={styles.pendHead}>
                        <strong>{l.clienteNome}</strong>
                        <span className="mono muted" style={{ fontSize: 11 }}>
                          {cnpjMasked(l.documento)}
                        </span>
                        <StatusBadge view={SITUACAO_VIEW[pior]} />
                      </span>
                      <ul className={styles.pendMotivos}>
                        {motivosPendencia(l).map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="muted">Nenhuma pendência na carteira — todos os clientes regulares.</p>
          )}
        </Card>

        {/* Ação em lote (synthetic — sem ação real na Fase 1). */}
        <Card title="Certidões em lote">
          <div className={styles.acaoBar}>
            <button
              type="button"
              className={styles.btnLote}
              disabled
              aria-disabled="true"
              title="Disponível quando a integração Integra Contador (SERPRO) entrar na Fase 7"
            >
              <span aria-hidden="true">⊞</span>
              Gerar CND em lote
            </button>
            <span className={styles.acaoNota}>
              demo — gera certidões de toda a carteira de uma vez quando a consulta real
              (Integra Contador) estiver ativa na Fase 7.
            </span>
          </div>
        </Card>

        {/* Disclaimer-credencial (G6). */}
        <Card title="Disclaimer-credencial (G6)">
          <p className="disclaimer">
            Demonstração com dados <strong>sintéticos</strong>. O e-CAC é um diagnóstico{" "}
            <strong>somente-leitura</strong> da situação fiscal da carteira (caixa postal · CNDs
            · declarações). Ele <strong>mostra</strong> a situação extraída do portal e{" "}
            <strong>não</strong> promete crédito garantido, apuração correta, ausência de multa
            nem prova jurídica plena. A regularização (parcelar, declarar, contestar) é ato do
            contador. A consulta real via Integra Contador (SERPRO) chega na Fase 7.
          </p>
        </Card>
      </div>
    </>
  );
}

/** True se a linha tem ALGUMA certidão vencida (faixa esquerda vermelha — DESIGN §6.5). */
function certidoesVencidas(l: EcacLinha): boolean {
  return (
    l.cndFederal === "vencida" ||
    l.cndEstadual === "vencida" ||
    l.cndTrabalhista === "vencida" ||
    l.fgts === "vencida"
  );
}
