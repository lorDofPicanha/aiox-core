"use client";

/**
 * ParcelamentosExplorer — corpo interativo do módulo PARCELAMENTOS (demo navegável).
 *
 * Recebe os parcelamentos SINTÉTICOS já classificados no Server Component (page.tsx) e
 * adiciona a interatividade:
 *   1. DRILL-DOWN por parcelamento: clicar no cliente abre o histórico de parcelas
 *      (pagas, a vencer, em atraso, em janela de salvamento) com o semáforo de cada uma.
 *   2. AÇÃO human-in-loop: "sugerir revisão" NÃO automatiza nem promete — apenas registra
 *      (na demo, em memória) que o contador foi sinalizado. A decisão de regularizar é do
 *      contador (CONTEXT §5 #1, doc 45). O texto deixa explícito: a plataforma SINALIZA o
 *      indício de risco; quem age é o profissional.
 *
 * 100% client-side, sem persistência real: é demonstração com base sintética. Reusa apenas
 * componentes/tokens globais (Card/StatusBadge/Table) + o CSS module local. Não toca
 * lib/api.ts, packages/* nem outros módulos (CONSTRAINT autocontido).
 *
 * G6: nenhuma promessa de evitar cancelamento ou garantir desconto — só indício de risco
 * de rescisão + sugestão de revisão sujeita à decisão do contador.
 */

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, type Column } from "@/components/Table";
import { brl } from "@/lib/format";
import {
  SITUACAO_PARCELA,
  ehRisco,
  situacaoEfetiva,
  type Parcela,
  type ParcelamentoView,
} from "./parcelamentos-model";
import styles from "./parcelamentos.module.css";

/** Formata um ISO como data curta pt-BR (vencimentos do histórico). */
function dataCurta(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function ParcelamentosExplorer({
  parcelamentos,
  refIso,
}: {
  parcelamentos: ParcelamentoView[];
  refIso: string;
}) {
  return (
    <div className={styles.explorer}>
      <p className={styles.drillHint}>
        <span aria-hidden="true">▸</span> Clique em um parcelamento para abrir o histórico de
        parcelas e o detalhe do indício de risco de rescisão.
      </p>
      {parcelamentos.map((p) => (
        <ParcelamentoCard key={p.id} parc={p} refIso={refIso} />
      ))}
    </div>
  );
}

/** Bloco de um parcelamento: cabeçalho com semáforo, resumo, drill-down e ação. */
function ParcelamentoCard({ parc, refIso }: { parc: ParcelamentoView; refIso: string }) {
  const [aberto, setAberto] = useState(false);
  // Ação human-in-loop: idle → sinalizado (demo, em memória). NÃO é automação.
  const [sinalizado, setSinalizado] = useState(false);

  const risco = parc.risco;
  const emRisco = ehRisco(risco.nivel.nivel);

  return (
    <Card>
      <div className={`${styles.parcHead} ${emRisco ? styles.parcHeadRisco : ""}`}>
        <button
          type="button"
          className={styles.parcToggle}
          aria-expanded={aberto}
          onClick={() => setAberto((a) => !a)}
        >
          <span aria-hidden="true" className={styles.parcCaret}>
            {aberto ? "▾" : "▸"}
          </span>
          <span className={styles.parcIdent}>
            <span className={styles.parcNome}>{parc.clienteNome}</span>
            <span className="muted" style={{ fontSize: 12 }}>
              {parc.programa} · {parc.esferaView.rotulo}
            </span>
          </span>
        </button>
        <div className={styles.parcBadges}>
          <StatusBadge view={risco.nivel} />
        </div>
      </div>

      <p className={styles.parcHint}>{risco.nivel.hint}</p>

      {/* Resumo do parcelamento (números-cidadãos de 1ª classe — DESIGN §3). */}
      <div className={styles.parcResumo}>
        <div className={styles.resumoItem}>
          <span className={styles.resumoLabel}>Parcelas pagas</span>
          <span className="num">
            {parc.parcelasPagas} / {parc.totalParcelas}
          </span>
        </div>
        <div className={styles.resumoItem}>
          <span className={styles.resumoLabel}>Em atraso</span>
          <span className={`num ${risco.parcelasEmAtraso > 0 ? styles.resumoAlerta : ""}`}>
            {risco.parcelasEmAtraso}
          </span>
        </div>
        <div className={styles.resumoItem}>
          <span className={styles.resumoLabel}>Valor da parcela</span>
          <span className="num">{brl(parc.valorParcela)}</span>
        </div>
        <div className={styles.resumoItem}>
          <span className={styles.resumoLabel}>Saldo a pagar (ilustrativo)</span>
          <span className="num">{brl(parc.valorSaldo)}</span>
        </div>
      </div>

      {/* DESTAQUE do whitespace: o aviso de rescisão iminente (o diferencial). */}
      {emRisco ? <AvisoRescisao parc={parc} sinalizado={sinalizado} onSinalizar={() => setSinalizado(true)} /> : null}

      {/* Drill-down: histórico de parcelas. */}
      {aberto ? <HistoricoParcelas parcelas={parc.parcelas} refIso={refIso} /> : null}
    </Card>
  );
}

/**
 * Aviso de RISCO DE RESCISÃO — o whitespace #1 visível na tela. G6-safe: descreve o
 * INDÍCIO ("será cancelado em N parcelas" como cenário-regra, não promessa) e a janela de
 * salvamento, e oferece uma AÇÃO que é decisão do contador, nunca automatizada.
 */
function AvisoRescisao({
  parc,
  sinalizado,
  onSinalizar,
}: {
  parc: ParcelamentoView;
  sinalizado: boolean;
  onSinalizar: () => void;
}) {
  const { risco } = parc;
  const limiteAtingido = risco.nivel.nivel === "rescindido";
  const faltam = risco.parcelasAteRescisao;

  return (
    <div className={styles.aviso} role="status">
      <div className={styles.avisoTopo}>
        <span aria-hidden="true" className={styles.avisoGlyph}>
          ▼
        </span>
        <div className={styles.avisoTexto}>
          {limiteAtingido ? (
            <p className={styles.avisoTitulo}>
              Indício de rescisão: o nº de parcelas em atraso atingiu o limite indicado para
              cancelamento do parcelamento. Sugerimos conferir a situação no Fisco.
            </p>
          ) : (
            <p className={styles.avisoTitulo}>
              Indício de risco de rescisão iminente: pela regra do Simples Nacional, faltam{" "}
              <strong className="num">{faltam}</strong> parcela(s) em atraso para o limite que
              pode levar ao cancelamento. Sugerimos revisar com o cliente.
            </p>
          )}

          {parc.descontoEmRisco > 0 ? (
            <p className={styles.avisoDesconto}>
              Programa especial: caso o parcelamento seja rescindido, há indício de perda de
              cerca de <strong className="num">{brl(parc.descontoEmRisco)}</strong> em desconto
              (estimativa ilustrativa — confirmar na consolidação do programa).
            </p>
          ) : null}

          {risco.parcelasNaJanela > 0 ? (
            <p className={styles.avisoJanela}>
              <span aria-hidden="true">⧗</span> Janela de salvamento: há{" "}
              <strong className="num">{risco.parcelasNaJanela}</strong> parcela(s) com atraso
              recente (até ~30 dias). Pela regra, regularizar dentro dessa janela tende a não
              contar como descumprimento — a decisão e a conferência são do contador.
            </p>
          ) : null}
        </div>
      </div>

      {/* Ação human-in-loop: SINALIZA; quem age é o contador. */}
      <div className={styles.avisoAcao}>
        {sinalizado ? (
          <p className={styles.avisoSinalizado} role="status" aria-live="polite">
            <span aria-hidden="true">✓</span> Sinalizado para revisão do contador (demo — em
            memória). A plataforma apenas registra o indício; regularizar é decisão do
            profissional, junto ao cliente.
          </p>
        ) : (
          <>
            <button type="button" className={styles.avisoBtn} onClick={onSinalizar}>
              <span aria-hidden="true">⚑</span> Sugerir revisão ao contador
            </button>
            <span className="muted" style={{ fontSize: 11 }}>
              Não regulariza nem promete evitar o cancelamento — só marca o caso para a
              decisão do contador.
            </span>
          </>
        )}
      </div>
    </div>
  );
}

/** Histórico de parcelas (drill-down): cada parcela com seu semáforo efetivo. */
function HistoricoParcelas({ parcelas, refIso }: { parcelas: Parcela[]; refIso: string }) {
  // Mostra as mais relevantes: as não pagas + as últimas pagas (contexto), ordenadas.
  const linhas = useMemo(() => {
    const naoPagas = parcelas.filter((p) => p.situacao !== "paga");
    const ultimasPagas = parcelas.filter((p) => p.situacao === "paga").slice(-3);
    return [...ultimasPagas, ...naoPagas].sort((a, b) => a.numero - b.numero);
  }, [parcelas]);

  const colunas: Column<Parcela>[] = [
    {
      key: "numero",
      header: "Parcela",
      render: (p) => (
        <span className="num" style={{ fontWeight: 600 }}>
          {p.numero}
        </span>
      ),
    },
    {
      key: "venc",
      header: "Vencimento",
      render: (p) => <span className="num">{dataCurta(p.vencimentoIso)}</span>,
    },
    {
      key: "valor",
      header: "Valor",
      align: "num",
      render: (p) => <span className="num">{brl(p.valor)}</span>,
    },
    {
      key: "situacao",
      header: "Situação",
      render: (p) => <StatusBadge view={SITUACAO_PARCELA[situacaoEfetiva(p, refIso)]} />,
    },
  ];

  return (
    <div className={styles.drill} role="region" aria-label="Histórico de parcelas">
      <h3 className={styles.drillTitulo}>Histórico de parcelas</h3>
      <p className={styles.drillSub}>
        Mostrando as parcelas em aberto e as três últimas pagas (contexto). Uma parcela com
        atraso recente (até ~30 dias) aparece como <strong>dentro da janela</strong> — onde a
        regularização ainda tende a não contar como descumprimento. Dados sintéticos.
      </p>
      <Table<Parcela>
        columns={colunas}
        rows={linhas}
        rowKey={(p) => String(p.numero)}
        rowClassName={(p) => {
          const sit = situacaoEfetiva(p, refIso);
          if (sit === "atrasada") return "risco";
          if (sit === "em_janela") return "revisar";
          return undefined;
        }}
        empty="Sem parcelas a exibir."
      />
    </div>
  );
}
