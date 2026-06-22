"use client";

/**
 * EmissorApp — casca client que dá ESTADO COMPARTILHADO ao emissor (CONTEXT §3.1).
 *
 * Lifting state up: o fluxo (EmissorFluxo) e a lista/KPIs vivem na mesma árvore client
 * para que, ao confirmar uma emissão, a nota entre na lista da SESSÃO na hora e os KPIs
 * (emitidas / rascunhos / emissores) atualizem. A lista nasce do seed sintético
 * (NOTAS_EMITIDAS) e a sessão adiciona por cima — sem persistência real (demo).
 *
 * Autocontido em app/emissor/: usa Card/StatusBadge/Table e os tokens globais por
 * leitura; não toca lib/api.ts, packages/* nem outros módulos.
 *
 * G6: tudo é demonstração com base sintética; a tributação é SUGERIDA e sujeita à
 * confirmação do contador — nada promete apuração definitiva.
 */

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, type Column } from "@/components/Table";
import { brl, dataHora } from "@/lib/format";
import { EmissorFluxo } from "./EmissorFluxo";
import { RevendaCalculadora } from "./RevendaCalculadora";
import {
  NOTAS_EMITIDAS,
  PACOTE_REVENDA_EXEMPLO,
  STATUS_NOTA,
  type NotaEmitida,
} from "./emissor-model";
import styles from "./emissor.module.css";

const COLUMNS: Column<NotaEmitida>[] = [
  {
    key: "numero",
    header: "Número",
    render: (n) => <span className="mono num">{n.numero}</span>,
  },
  {
    key: "cliente",
    header: "Cliente",
    render: (n) => (
      <span className={styles.notaCliente}>
        <span style={{ fontWeight: 600 }}>{n.clienteNome}</span>
        <span className="muted">{n.servico}</span>
      </span>
    ),
  },
  {
    key: "cclasstrib",
    header: "cClassTrib",
    render: (n) => <span className="mono num">{n.cclasstrib}</span>,
  },
  {
    key: "valor",
    header: "Valor",
    align: "num",
    render: (n) => <span className="num">{brl(n.valor)}</span>,
  },
  {
    key: "confirmado",
    header: "Confirmado por",
    render: (n) =>
      n.confirmadoPor ? (
        <span style={{ fontSize: 12 }}>{n.confirmadoPor}</span>
      ) : (
        <span className="muted" style={{ fontSize: 12 }}>
          aguardando confirmação do contador
        </span>
      ),
  },
  {
    key: "gerado",
    header: "Gerado em",
    align: "num",
    render: (n) => <span className="num">{dataHora(n.geradoEm)}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (n) => <StatusBadge view={STATUS_NOTA[n.status]} />,
  },
];

export function EmissorApp() {
  // Lista da sessão: começa no seed sintético; emissões confirmadas entram no topo.
  const [notas, setNotas] = useState<NotaEmitida[]>(() => [...NOTAS_EMITIDAS]);
  // Marca quais ids vieram da sessão atual (para destacar "novas" na lista).
  const [novas, setNovas] = useState<Set<string>>(() => new Set());

  const pacote = PACOTE_REVENDA_EXEMPLO;

  const emitidas = useMemo(
    () => notas.filter((n) => n.status === "emitida_demo").length,
    [notas],
  );
  const rascunhos = useMemo(
    () => notas.filter((n) => n.status === "rascunho").length,
    [notas],
  );

  function handleEmitir(nota: NotaEmitida) {
    setNotas((prev) => [nota, ...prev]);
    setNovas((prev) => new Set(prev).add(nota.id));
  }

  return (
    <>
      <div className={styles.layout}>
        {/* Fluxo de emissão guiado (client, estado partilhado via callback). */}
        <div className={styles.main}>
          <Card
            title="Emitir uma NFS-e (fluxo guiado)"
            sub="Cliente → serviço + valor → tributação sugerida + auto-auditoria → confirmação do contador → rascunho de DANFSe (demo)."
          >
            <EmissorFluxo onEmitir={handleEmitir} />
          </Card>
        </div>

        {/* Painel de revenda interativo (lateral). */}
        <aside className={styles.side}>
          <Card
            title="Modelo de revenda"
            sub="Simule o pacote: nº de emissores × preço de revenda → margem ilustrativa."
          >
            <p className={styles.revendaTexto}>
              O contador compra um <strong>pacote de emissores</strong> e revende aos
              clientes dele — paga a própria mensalidade e lucra em cima. Mexa nos controles
              abaixo para ver a margem (<strong>exemplo ilustrativo</strong>, não preço
              fechado).
            </p>
            <RevendaCalculadora />
          </Card>
        </aside>
      </div>

      {/* KPIs — atualizam ao confirmar uma emissão na sessão. */}
      <div className="grid grid-3" style={{ marginTop: 16 }}>
        <Card>
          <div className="kpi">
            <span className="kpi-value num">{emitidas}</span>
            <span className="kpi-label">Emitidas (demo)</span>
          </div>
        </Card>
        <Card>
          <div className="kpi">
            <span className="kpi-value num">{rascunhos}</span>
            <span className="kpi-label">Rascunhos (pendentes de confirmação)</span>
          </div>
        </Card>
        <Card>
          <div className="kpi">
            <span className="kpi-value num">{pacote.emissores}</span>
            <span className="kpi-label">Emissores no pacote</span>
          </div>
        </Card>
      </div>

      <Card
        title="Notas no emissor"
        sub="Base sintética + emissões desta sessão. Rascunho = gerado mas ainda não confirmado. Emitida (demo) = confirmada no fluxo (não transmitida a fisco)."
      >
        <Table<NotaEmitida>
          columns={COLUMNS}
          rows={notas}
          rowKey={(n) => n.id}
          rowClassName={(n) =>
            novas.has(n.id)
              ? styles.notaNova
              : n.status === "rascunho"
                ? "revisar"
                : undefined
          }
          empty="Nenhuma nota no emissor ainda."
        />
      </Card>
    </>
  );
}
