/**
 * EMISSOR de NFS-e (módulo #4 · CONTEXT §3) — add-on / gancho de margem (revenda).
 *
 * Tela autocontida (dados sintéticos em app/emissor/), demo navegável. Estrutura:
 *  1. Subtítulo curto em português simples + selo de honestidade (não emite de verdade).
 *  2. Fluxo de emissão guiado (EmissorFluxo, client): cliente → serviço + valor → o
 *     sistema SUGERE cClassTrib/tributação → AUTO-AUDITORIA (✓ confere / ⚠ revisar) →
 *     o contador CONFIRMA (ato humano) → gera RASCUNHO de DANFSe sintético.
 *  3. Painel de revenda (contador compra pacote e revende aos clientes dele).
 *  4. Lista de notas emitidas (sintéticas) com status (rascunho / emitida-demo).
 *
 * G6 (doc 45): a tributação é SUGERIDA, sujeita à confirmação do contador. Nunca
 * "tributação correta" / "apuração correta" / "crédito garantido": indício
 * auto-auditado + revisão humana + base sintética (Fase 1). Emissão real = Fase 7.
 *
 * Server Component; NÃO toca lib/api.ts, components/*, globals.css, Nav.tsx nem
 * outros módulos — reusa Card/StatusBadge/Table/TopBar e os tokens globais por leitura.
 */

import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, type Column } from "@/components/Table";
import { TopBar } from "@/components/TopBar";
import { brl, dataHora } from "@/lib/format";
import { EmissorFluxo } from "./EmissorFluxo";
import {
  NOTAS_EMITIDAS,
  PACOTE_REVENDA_EXEMPLO,
  STATUS_NOTA,
  margemRevenda,
  type NotaEmitida,
} from "./emissor-model";
import styles from "./emissor.module.css";

export default function EmissorPage() {
  const pacote = PACOTE_REVENDA_EXEMPLO;
  const rev = margemRevenda(pacote);

  const emitidas = NOTAS_EMITIDAS.filter((n) => n.status === "emitida_demo").length;
  const rascunhos = NOTAS_EMITIDAS.filter((n) => n.status === "rascunho").length;

  const columns: Column<NotaEmitida>[] = [
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

  return (
    <>
      <TopBar
        title="Emissor de NFS-e"
        sub="Emita uma nota de serviço já com a tributação sugerida e auto-auditada — o contador confirma antes de gerar."
      />
      <div className="content">
        {/* 1 · Subtítulo simples + selo de honestidade. */}
        <p className={styles.intro}>
          Em vez de digitar a tributação na mão (e errar quando troca o funcionário que
          sabia o macete), o emissor <strong>sugere</strong> o cClassTrib e os tributos do
          serviço, <strong>confere</strong> contra uma base de referência e deixa o{" "}
          <strong>contador confirmar</strong>. É um add-on de revenda: o escritório compra
          um pacote de emissores e oferece aos clientes dele.
        </p>

        <div className={styles.selos}>
          <span className="badge badge-warning" role="note">
            <span className="badge-glyph" aria-hidden="true">
              !
            </span>
            demo — não emite de verdade
          </span>
          <span className="badge badge-neutral" title="Credenciamento ADN / NFS-e Nacional">
            <span className="badge-glyph" aria-hidden="true">
              ⧗
            </span>
            emissão real chega na Fase 7 (precisa credenciamento ADN / NFS-e Nacional)
          </span>
        </div>

        <div className={styles.layout}>
          {/* 2 · Fluxo de emissão guiado (client). */}
          <div className={styles.main}>
            <Card
              title="Emitir uma NFS-e (fluxo guiado)"
              sub="Cliente → serviço + valor → tributação sugerida + auto-auditoria → confirmação do contador → rascunho de DANFSe (demo)."
            >
              <EmissorFluxo />
            </Card>
          </div>

          {/* 3 · Painel de revenda (lateral). */}
          <aside className={styles.side}>
            <Card
              title="Modelo de revenda"
              sub="Como o emissor vira margem para o escritório."
            >
              <p className={styles.revendaTexto}>
                O contador compra um <strong>pacote de emissores</strong> e revende aos
                clientes dele — paga a própria mensalidade e lucra em cima. Os números
                abaixo são <strong>exemplo ilustrativo</strong>, não um preço fechado.
              </p>

              <div className={styles.revendaQuadro}>
                <div className={styles.revendaLinha}>
                  <span>Pacote</span>
                  <span className="num">
                    {pacote.emissores} emissores · {brl(pacote.custoPacoteMes)}/mês
                  </span>
                </div>
                <div className={styles.revendaLinha}>
                  <span>Revende cada</span>
                  <span className="num">{brl(pacote.precoSugeridoRevendaMes)}/mês</span>
                </div>
                <div className={styles.revendaLinha}>
                  <span>Receita de revenda</span>
                  <span className="num">{brl(rev.receitaRevenda)}/mês</span>
                </div>
                <div className={`${styles.revendaLinha} ${styles.revendaMargem}`}>
                  <span>Margem ilustrativa</span>
                  <span className="num">{brl(rev.margem)}/mês</span>
                </div>
              </div>

              <p className={styles.revendaNota}>
                Exemplo comercial. Preços reais escalam por volume de nota / nº de CNPJ e
                serão definidos na contratação.
              </p>
            </Card>
          </aside>
        </div>

        {/* 4 · Lista de notas emitidas (sintéticas). */}
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
          sub="Base sintética. Rascunho = gerado mas ainda não confirmado pelo contador. Emitida (demo) = confirmada no fluxo (não transmitida a fisco)."
        >
          <Table<NotaEmitida>
            columns={columns}
            rows={[...NOTAS_EMITIDAS]}
            rowKey={(n) => n.id}
            rowClassName={(n) => (n.status === "rascunho" ? "revisar" : undefined)}
            empty="Nenhuma nota no emissor ainda."
          />
        </Card>

        {/* Disclaimer-credencial (G6). */}
        <Card title="Linguagem segura (G6)">
          <p className="disclaimer">
            <strong>Demonstração com dados sintéticos.</strong> O emissor{" "}
            <strong>sugere</strong> a tributação e roda uma <strong>auto-auditoria</strong>{" "}
            contra uma base de referência; a decisão é um <strong>ato humano</strong> — o
            contador <strong>confirma</strong> antes de gerar o documento. Esta tela{" "}
            <strong>não emite</strong> nota de verdade e <strong>não promete</strong>{" "}
            tributação garantida, apuração correta nem ausência de multa. A emissão real
            depende de credenciamento ADN / NFS-e Nacional (Fase 7).
          </p>
        </Card>
      </div>
    </>
  );
}
