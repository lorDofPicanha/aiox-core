"use client";

/**
 * PAR-7 — TransacaoExplorer: corpo interativo do Radar de Transação Tributária.
 *
 * Recebe as oportunidades já classificadas e ordenadas no Server Component (page.tsx) e
 * adiciona:
 *   1. TABELA de oportunidades (ranking por gancho de honorário) com semáforo de elegibilidade.
 *   2. DRILL-DOWN por cliente: abre o BREAKDOWN explicável (por que é elegível em tese, qual a
 *      faixa de desconto PERMITIDA pelo edital em tese, e os CAVEATS) + o gancho de honorário.
 *   3. AÇÃO human-in-loop: "encaminhar ao tributarista" NÃO automatiza, NÃO adere e NÃO
 *      promete — apenas registra (na demo, em memória) que a oportunidade foi sinalizada para
 *      a análise do profissional. A adesão é ato do tributarista (handoff 57 §5/§6).
 *
 * G6 EXTRA-RIGOROSO: nada de "garante desconto"/"reduz a dívida"/"regulariza". Só "indício",
 * "potencialmente elegível", "em tese", "gancho de honorário", "depende de análise". Auto-
 * contido: lê Card/StatusBadge/Table + brl + o CSS module local.
 */

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, type Column } from "@/components/Table";
import { brl, pct } from "@/lib/format";
import {
  PORTE_ROTULO,
  REGIME_ROTULO,
  ehOportunidade,
  type FatorBreakdown,
  type OportunidadeTransacao,
} from "./transacao-model";
import styles from "./transacao.module.css";

export function TransacaoExplorer({
  oportunidades,
}: {
  oportunidades: OportunidadeTransacao[];
}) {
  return (
    <div className={styles.explorer}>
      <p className={styles.drillHint}>
        <span aria-hidden="true">▸</span> Clique em um cliente para abrir o detalhe explicável
        (por que é potencialmente elegível em tese, as ressalvas e o gancho de honorário).
      </p>
      {oportunidades.map((o) => (
        <OportunidadeCard key={o.perfil.clienteId} op={o} />
      ))}
    </div>
  );
}

/** Bloco de uma oportunidade: cabeçalho com semáforo, resumo, drill-down e ação. */
function OportunidadeCard({ op }: { op: OportunidadeTransacao }) {
  const [aberto, setAberto] = useState(false);
  // Ação human-in-loop: idle → encaminhado (demo, em memória). NÃO é automação/adesão.
  const [encaminhado, setEncaminhado] = useState(false);

  const ehOp = ehOportunidade(op.nivel.nivel);

  return (
    <Card>
      <div className={`${styles.opHead} ${ehOp ? styles.opHeadOportunidade : ""}`}>
        <button
          type="button"
          className={styles.opToggle}
          aria-expanded={aberto}
          onClick={() => setAberto((a) => !a)}
        >
          <span aria-hidden="true" className={styles.opCaret}>
            {aberto ? "▾" : "▸"}
          </span>
          <span className={styles.opIdent}>
            <span className={styles.opNome}>{op.perfil.clienteNome}</span>
            <span className="muted" style={{ fontSize: 12 }}>
              {op.perfil.segmento} · {REGIME_ROTULO[op.perfil.regime]}
            </span>
          </span>
        </button>
        <div className={styles.opBadges}>
          <StatusBadge view={op.nivel} />
        </div>
      </div>

      <p className={styles.opHint}>{op.nivel.hint}</p>

      {/* Resumo (números-cidadãos de 1ª classe — DESIGN §3). */}
      <div className={styles.opResumo}>
        <div className={styles.resumoItem}>
          <span className={styles.resumoLabel}>Dívida ativa (PGFN)</span>
          <span className="num">
            {op.perfil.inscritoDividaAtiva ? brl(op.perfil.valorDividaAtiva) : "—"}
          </span>
        </div>
        <div className={styles.resumoItem}>
          <span className={styles.resumoLabel}>Porte</span>
          <span className="num">{op.porte ? PORTE_ROTULO[op.porte] : "—"}</span>
        </div>
        <div className={styles.resumoItem}>
          {/* Teto GERAL do edital (não deste caso) — descola o % do cliente p/ não virar âncora
              de "desconto provável". Revisão legal Heleno (🔴-L2). */}
          <span className={styles.resumoLabel}>Teto do edital (geral, não deste caso)</span>
          <span className="num">
            {op.descontoPermitidoEmTese ? `até ${pct(op.descontoPermitidoEmTese.max)}` : "—"}
          </span>
        </div>
        <div className={styles.resumoItem}>
          <span className={styles.resumoLabel}>Gancho de honorário potencial</span>
          <span className={`num ${op.gancho.estimavel ? styles.resumoGancho : ""}`}>
            {op.gancho.estimavel ? `${brl(op.gancho.min)} – ${brl(op.gancho.max)}` : "—"}
          </span>
        </div>
      </div>

      {/* Destaque da oportunidade: o gancho de honorário (D6). */}
      {ehOp && op.gancho.estimavel ? (
        <GanchoBox op={op} encaminhado={encaminhado} onEncaminhar={() => setEncaminhado(true)} />
      ) : null}

      {/* Drill-down: breakdown explicável + caveats. */}
      {aberto ? <BreakdownDetalhe op={op} /> : null}
    </Card>
  );
}

/**
 * Caixa do GANCHO DE HONORÁRIO (D6) — o destaque da oportunidade. G6-safe: descreve o gancho
 * como remuneração POTENCIAL do profissional (success-fee), com a faixa de desconto PERMITIDA
 * pelo edital em tese (não concedida) e a ação human-in-loop (encaminha, não adere).
 */
function GanchoBox({
  op,
  encaminhado,
  onEncaminhar,
}: {
  op: OportunidadeTransacao;
  encaminhado: boolean;
  onEncaminhar: () => void;
}) {
  return (
    <div className={styles.gancho} role="status">
      <div className={styles.ganchoTopo}>
        <span aria-hidden="true" className={styles.ganchoGlyph}>
          ◈
        </span>
        <div className={styles.ganchoTexto}>
          <p className={styles.ganchoTitulo}>
            Gancho de honorário potencial:{" "}
            <strong className="num">
              {brl(op.gancho.min)} – {brl(op.gancho.max)}
            </strong>{" "}
            — remuneração potencial do escritório/tributarista pela condução da negociação
            (modelo de êxito, linha separada). Não é economia garantida do cliente. O honorário
            decorre do <strong>contrato entre o cliente e o tributarista</strong> — o sistema não
            o cobra, não o arbitra e não capta o serviço.
          </p>
          {op.descontoPermitidoEmTese ? (
            <p className={styles.ganchoDesconto}>
              Teto de desconto que o edital <strong>permite em tese</strong> (faixa geral da
              modalidade, <strong>não deste caso</strong>): até{" "}
              <strong className="num">{pct(op.descontoPermitidoEmTese.max)}</strong>. Não é desconto
              concedido nem previsto para este cliente — depende da capacidade de pagamento apurada
              e do edital vigente.
            </p>
          ) : null}
        </div>
      </div>

      {/* Ação human-in-loop: ENCAMINHA ao tributarista; quem analisa/adere é o profissional. */}
      <div className={styles.ganchoAcao}>
        {encaminhado ? (
          <p className={styles.ganchoEncaminhado} role="status" aria-live="polite">
            <span aria-hidden="true">✓</span> Encaminhado ao tributarista para análise (demo — em
            memória). O sistema apenas registra o indício de oportunidade; a análise, a
            negociação e a adesão são do profissional, sem promessa de resultado.
          </p>
        ) : (
          <>
            <button type="button" className={styles.ganchoBtn} onClick={onEncaminhar}>
              <span aria-hidden="true">⚑</span> Encaminhar ao tributarista
            </button>
            <span className="muted" style={{ fontSize: 11 }}>
              Não adere, não negocia nem promete o desconto — só marca a oportunidade para a
              análise do profissional.
            </span>
          </>
        )}
      </div>
    </div>
  );
}

/** Direção de efeito → apresentação redundante (cor + glyph + rótulo). */
const EFEITO_VIEW: Record<FatorBreakdown["efeito"], { glyph: string; rotulo: string; cls: string }> = {
  favorece: { glyph: "▲", rotulo: "favorece", cls: styles.efeitoFavorece },
  ressalva: { glyph: "◆", rotulo: "ressalva", cls: styles.efeitoRessalva },
  bloqueia: { glyph: "▼", rotulo: "bloqueia", cls: styles.efeitoBloqueia },
  neutro: { glyph: "·", rotulo: "neutro", cls: styles.efeitoNeutro },
};

/** Drill-down: breakdown explicável (tabela de fatores) + caveats da frente legal. */
function BreakdownDetalhe({ op }: { op: OportunidadeTransacao }) {
  const colunas: Column<FatorBreakdown>[] = useMemo(
    () => [
      {
        key: "fator",
        header: "Fator",
        render: (f) => <span style={{ fontWeight: 600 }}>{f.rotulo}</span>,
      },
      {
        key: "valor",
        header: "Valor",
        render: (f) => <span className="num">{f.valor}</span>,
      },
      {
        key: "efeito",
        header: "Efeito",
        render: (f) => {
          const v = EFEITO_VIEW[f.efeito];
          return (
            <span className={`${styles.efeito} ${v.cls}`}>
              <span aria-hidden="true">{v.glyph}</span> {v.rotulo}
            </span>
          );
        },
      },
      {
        key: "nota",
        header: "Por quê (em tese)",
        render: (f) => <span className={styles.fatorNota}>{f.nota}</span>,
      },
    ],
    [],
  );

  return (
    <div className={styles.drill} role="region" aria-label="Detalhe explicável da oportunidade">
      <h3 className={styles.drillTitulo}>Por que esta classificação (breakdown explicável)</h3>
      <p className={styles.drillSub}>
        Cada fator com seu efeito na elegibilidade <strong>em tese</strong>. Heurística com
        regras nomeadas; o tributarista decide caso a caso. Dados sintéticos.
      </p>
      <Table<FatorBreakdown>
        columns={colunas}
        rows={op.breakdown}
        rowKey={(f) => f.rotulo}
        empty="Sem fatores a exibir."
      />

      <h3 className={`${styles.drillTitulo} ${styles.caveatTitulo}`}>Caveats (limites jurídicos)</h3>
      <ul className={styles.caveatList}>
        {op.caveats.map((c) => (
          <li key={c} className={styles.caveatItem}>
            <span aria-hidden="true" className={styles.caveatGlyph}>
              ⚠
            </span>
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
