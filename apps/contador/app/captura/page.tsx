/**
 * Captura (#1) — a "porta de entrada" do ciclo da nota fiscal (CONTEXT §3).
 *
 * Server Component, espelhando a estrutura de /fila. A tela demonstra a VARREDURA de
 * notas do cliente em duas camadas:
 *  1. Status de captura POR CLIENTE (toggle visual capturaAtiva — default OFF é D2,
 *     captura seletiva; modo upload/XML ◆ 1ª classe vs provider/OCR ◇ 2ª classe).
 *  2. Lista data-dense de notas capturadas (NF-e/CT-e · compra/venda · estágio).
 * Mais: botão honesto "subir nota" (sem upload real na Fase 1) e a caixa do módulo #2
 * (Armazenamento XML 15 anos — obrigação legal, XML ~7KB, storage barato).
 *
 * G6 (doc 45 §5): a Captura só COLETA e ARMAZENA o insumo fiscal — nenhum juízo de
 * mérito aqui. Nada promete crédito garantido, apuração correta, eliminação de multa
 * nem prova jurídica plena. A captura automática real (certificado/provider) chega na
 * Fase 5 (precisa provider + DPA — Art. 39 LGPD). Base SINTÉTICA (Fase 1).
 */
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, type Column } from "@/components/Table";
import { TopBar } from "@/components/TopBar";
import { brl, cnpjMasked, dataHora } from "@/lib/format";
import {
  classeInsumoView,
  ESTAGIO_VIEW,
  MODO_VIEW,
  NATUREZA_LABEL,
  TIPO_LABEL,
  type CapturaClienteLinha,
  type NotaCapturadaLinha,
} from "./captura-model";
import { listarNotasCapturadas, statusCapturaPorCliente } from "./captura-data";
import styles from "./captura.module.css";

/** Estática: a base é sintética e local (nenhuma I/O), pode prerender. */
export const dynamic = "force-static";

export default function CapturaPage() {
  const clientes = statusCapturaPorCliente();
  const notas = listarNotasCapturadas();

  const totalCapturadas = notas.length;
  const clientesAtivos = clientes.filter((c) => c.capturaAtiva).length;
  const valorTotal = notas.reduce((acc, n) => acc + n.valor, 0);

  const clienteColumns: Column<CapturaClienteLinha>[] = [
    {
      key: "cliente",
      header: "Cliente",
      render: (c) => (
        <span className={styles.cliente}>
          <span className={styles.clienteNome}>{c.clienteNome}</span>
          <span className={`${styles.clienteDoc} mono muted`}>{cnpjMasked(c.documento)}</span>
        </span>
      ),
    },
    {
      key: "captura_ativa",
      header: "Captura automática",
      render: (c) => {
        const v = classeInsumoView(c.classePredominante);
        return (
          <span
            className={`${styles.toggle} ${c.capturaAtiva ? styles.toggleOn : ""}`}
            title={
              c.capturaAtiva
                ? `Captura ativa (demo) — modo ${MODO_VIEW[c.modo].label}`
                : "Captura recolhida (default seletivo). Toggle ilustrativo — a varredura automática real chega na Fase 5."
            }
          >
            <span className={styles.track} aria-hidden="true">
              <span className={styles.knob} />
            </span>
            <span className={c.capturaAtiva ? styles.toggleLabelOn : styles.toggleLabelOff}>
              {c.capturaAtiva ? "ON" : "OFF"}
            </span>
            <span className="insumo" aria-hidden="true" style={{ marginLeft: 2 }}>
              {v.glyph}
            </span>
          </span>
        );
      },
    },
    {
      key: "modo",
      header: "Modo",
      render: (c) => <StatusBadge view={MODO_VIEW[c.modo]} />,
    },
    {
      key: "notas",
      header: "Notas capturadas",
      align: "num",
      render: (c) => <span className="num">{c.notasCapturadas}</span>,
    },
    {
      key: "ultima",
      header: "Última captura",
      render: (c) =>
        c.ultimaCapturaIso ? (
          <span className="num muted">{dataHora(c.ultimaCapturaIso)}</span>
        ) : (
          <span className="muted">— sem captura</span>
        ),
    },
    {
      key: "classe",
      header: "Classe de insumo",
      render: (c) => {
        const v = classeInsumoView(c.classePredominante);
        return (
          <span className={styles.classe}>
            <span aria-hidden="true">{v.glyph}</span>
            {v.label}
          </span>
        );
      },
    },
  ];

  const notaColumns: Column<NotaCapturadaLinha>[] = [
    {
      key: "cliente",
      header: "Cliente",
      render: (n) => <span className="muted">{n.clienteNome}</span>,
    },
    {
      key: "tipo",
      header: "Tipo",
      render: (n) => <span className="badge badge-neutral">{TIPO_LABEL[n.tipo]}</span>,
    },
    {
      key: "natureza",
      header: "Natureza",
      render: (n) => <span>{NATUREZA_LABEL[n.natureza]}</span>,
    },
    {
      key: "numero",
      header: "Nº / Série",
      render: (n) => <span className="mono num">{n.numeroSerie}</span>,
    },
    {
      key: "valor",
      header: "Valor",
      align: "num",
      render: (n) => <span className="num">{brl(n.valor)}</span>,
    },
    {
      key: "data",
      header: "Data",
      render: (n) => <span className="num muted">{dataHora(n.dataIso)}</span>,
    },
    {
      key: "classe",
      header: "Classe",
      render: (n) => {
        const v = classeInsumoView(n.classeInsumo);
        return (
          <span className="insumo">
            <span aria-hidden="true">{v.glyph}</span>
            {v.label}
          </span>
        );
      },
    },
    {
      key: "estagio",
      header: "Status",
      render: (n) => <StatusBadge view={ESTAGIO_VIEW[n.estagio]} />,
    },
  ];

  return (
    <>
      <TopBar
        title="Captura de notas"
        sub="Porta de entrada do ciclo da nota fiscal — varredura de NF-e e CT-e por cliente. A Captura coleta e armazena o insumo; a análise vive nos módulos seguintes."
      />
      <div className="content">
        <div className="notice" role="status">
          <span aria-hidden="true">◇</span>
          <span>
            <strong>Demo — base sintética</strong> (Fase 1). A captura automática real
            (certificado/provider) chega na <strong>Fase 5</strong> — depende de provider +
            DPA (Art. 39 LGPD). Aqui os toggles e a varredura são ilustrativos; nada aqui é
            crédito garantido, apuração correta nem prova jurídica plena.
          </span>
        </div>

        <div className="grid grid-3" style={{ marginTop: 16 }}>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{totalCapturadas}</span>
              <span className="kpi-label">Notas capturadas (demo)</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">
                {clientesAtivos}/{clientes.length}
              </span>
              <span className="kpi-label">Clientes com captura ativa</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{brl(valorTotal)}</span>
              <span className="kpi-label">Valor capturado (sintético)</span>
            </div>
          </Card>
        </div>

        <Card
          title="Status de captura por cliente"
          sub="Toggle de captura automática (◆ XML 1ª classe via upload · ◇ provider/OCR 2ª classe). O default OFF é seletivo por design (captura indiscriminada tem custo por CNPJ) — toggle ilustrativo na Fase 1."
        >
          <Table<CapturaClienteLinha>
            columns={clienteColumns}
            rows={clientes}
            rowKey={(c) => c.clienteId}
            empty="Nenhum cliente cadastrado para captura."
          />
        </Card>

        <Card
          title="Notas capturadas"
          sub="NF-e e CT-e coletadas, ordenadas por data (mais recente primeiro). Natureza (compra/venda) derivada de emitente/destinatário. Estágio: capturada → processada (leitura concluída) — sem juízo fiscal aqui."
        >
          <div className={styles.acoes} style={{ marginBottom: "var(--space-4)" }}>
            <button
              type="button"
              className={styles.btnSubir}
              disabled
              aria-disabled="true"
              title="Upload manual de XML chega na Fase 5 (placeholder honesto — sem upload real na demo)."
            >
              <span aria-hidden="true">↥</span>
              Subir nota (manual)
            </button>
            <span className={styles.acoesHint}>
              Upload manual de XML é um placeholder honesto na Fase 1 — sem envio real na demo.
            </span>
          </div>
          <Table<NotaCapturadaLinha>
            columns={notaColumns}
            rows={notas}
            rowKey={(n) => n.id}
            empty="Nenhuma nota capturada — ative a captura de um cliente."
          />
        </Card>

        <Card
          title="Armazenamento XML — 15 anos (módulo #2)"
          sub="Guardar o XML da nota é obrigação legal (prazo ampliado para 15 anos) e quase ninguém faz. O XML é leve e o storage é barato — vira um plus do ciclo, cobrado por pacote de notas."
        >
          <dl className={styles.armazenamento}>
            <div>
              <dt>Prazo de guarda</dt>
              <dd className="num">
                15 <span className="unidade">anos (obrigação legal)</span>
              </dd>
            </div>
            <div>
              <dt>Tamanho médio por XML</dt>
              <dd className="num">
                ~7 <span className="unidade">KB por documento</span>
              </dd>
            </div>
            <div>
              <dt>Notas guardadas (demo)</dt>
              <dd className="num">
                {totalCapturadas} <span className="unidade">XML sintéticos</span>
              </dd>
            </div>
            <div>
              <dt>Custo de storage</dt>
              <dd className="num">
                baixo <span className="unidade">~$2 / 500 GB</span>
              </dd>
            </div>
          </dl>
          <p className="disclaimer">
            O armazenamento de 15 anos é um <strong>plus</strong> do ciclo — guarda o insumo
            (◆ XML 1ª classe). Não constitui, por si, crédito garantido, apuração correta nem
            prova jurídica plena: é o documento fiscal preservado para revisão humana.
          </p>
        </Card>

        <Card title="Linguagem segura (G6)">
          <p className="disclaimer">
            <strong>Captura = coleta + armazenamento</strong> do insumo fiscal · base sintética
            (Fase 1) · insumo ◆ XML / ◇ OCR · sujeito a <strong>revisão humana</strong> nos
            módulos seguintes. A varredura automática real (certificado/provider) chega na Fase 5
            (precisa provider + DPA, Art. 39 LGPD). Esta plataforma não promete crédito garantido,
            apuração correta nem eliminação de multa.
          </p>
        </Card>
      </div>
    </>
  );
}
