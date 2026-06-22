/**
 * F1.6 — Índice de LAUDOS por cliente.
 *
 * Server Component. Lista cada cliente do tenant com a FAIXA do laudo (derivada do
 * pior indício pendente) e linka para o laudo defensável (/laudos/[clienteId]).
 * Reusa o read model (carregarIndiceLaudos) e os componentes globais (Card, TopBar,
 * StatusBadge) — IDS: REUSE/ADAPT, nada de UI nova além do necessário.
 *
 * G6 (doc 45): cada cliente carrega INDÍCIOS sujeitos a revisão humana; a faixa verde
 * significa "pronto para revisão" (sem bloqueio), nunca "apuração correta". Base
 * sintética (Fase 1); carimbo de tempo formal é Fase 4.
 */
import Link from "next/link";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { TopBar } from "@/components/TopBar";
import { getApi, ESCRITORIO_ID } from "@/lib/api";
import { brl } from "@/lib/format";
import { REGUA_VERSAO } from "./regua";
import { carregarIndiceLaudos } from "./laudo-model";
import styles from "./laudo.module.css";

export default async function LaudosPage() {
  const api = await getApi();
  const linhas = await carregarIndiceLaudos(api, ESCRITORIO_ID);

  const totalIndicios = linhas.reduce((acc, l) => acc + l.totalIndicios, 0);
  const totalDisputados = linhas.reduce((acc, l) => acc + l.disputados, 0);
  const materialidadeTotal = linhas.reduce((acc, l) => acc + l.materialidadeTotal, 0);

  return (
    <>
      <TopBar
        title="Laudos"
        sub={`Laudo defensável por cliente · verificado contra régua ${REGUA_VERSAO} · indícios sujeitos a revisão humana (CRC)`}
      />
      <div className="content">
        <div className="notice" role="status">
          <span aria-hidden="true">◇</span>
          <span>
            <strong>Base sintética</strong> (Fase 1). Cada laudo organiza{" "}
            <strong>indícios</strong> e <strong>evidências técnicas</strong> para a{" "}
            <strong>revisão profissional</strong> — não promete crédito, economia, ausência
            de multa, apuração correta nem prova jurídica plena. Carimbo de tempo formal: Fase 4.
          </span>
        </div>

        <div className="grid grid-3" style={{ marginTop: 16 }}>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{linhas.length}</span>
              <span className="kpi-label">Clientes com laudo</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{totalIndicios}</span>
              <span className="kpi-label">Indícios pendentes (total)</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{brl(materialidadeTotal)}</span>
              <span className="kpi-label">Materialidade em revisão</span>
            </div>
          </Card>
        </div>

        <Card
          title="Laudos por cliente"
          sub="Faixa derivada do pior indício pendente (cor + ícone + label — DESIGN §3). Abra para ver as divergências por item, a trilha verificável e o disclaimer-credencial."
        >
          <ul className={styles.indice}>
            {linhas.map((l) => (
              <li key={l.clienteId} className={styles.indiceRow}>
                <Link href={`/laudos/${l.clienteId}`} className={styles.indiceLink}>
                  <span className={`${styles.faixaDot} ${styles[`dot_${l.faixa.faixa}`]}`} aria-hidden="true" />
                  <span className={styles.indiceMain}>
                    <span className={styles.indiceHead}>
                      <strong className={styles.indiceNome}>{l.clienteNome}</strong>
                      <StatusBadge view={l.faixa} />
                    </span>
                    <span className="muted" style={{ fontSize: 11 }}>
                      {l.faixa.hint}
                    </span>
                  </span>
                  <span className={styles.indiceRight}>
                    <span className={styles.indiceValor}>{brl(l.materialidadeTotal)}</span>
                    <span className="muted" style={{ fontSize: 11 }}>
                      <span className="num">{l.totalIndicios}</span> indício(s)
                      {l.disputados > 0 ? (
                        <>
                          {" · "}
                          <span className="num">{l.disputados}</span> bloqueia(m) auto-aprovação
                        </>
                      ) : null}
                    </span>
                  </span>
                  <span className={styles.indiceArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {linhas.length === 0 ? (
            <p className="muted">Nenhum cliente na carteira do seed atual.</p>
          ) : null}
          {totalDisputados > 0 ? (
            <p className="muted" style={{ marginTop: 12, fontSize: 12 }}>
              <span className="num">{totalDisputados}</span> indício(s) disputado/baixa confiança
              bloqueiam auto-aprovação — exigem revisão humana antes de qualquer ação (DESIGN §6.3).
            </p>
          ) : null}
        </Card>

        <Card title="Linguagem segura (G6)">
          <p className="disclaimer">
            <strong>indício</strong> · base sintética (Fase 1) · insumo XML/OCR ·{" "}
            sujeito a <strong>revisão humana</strong> · trilha <strong>verificável</strong>.
            Esta plataforma organiza evidências técnicas para revisão profissional; não substitui
            contador, tributarista ou advogado.
          </p>
        </Card>
      </div>
    </>
  );
}
