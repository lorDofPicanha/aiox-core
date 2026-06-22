"use client";

/**
 * CapturaModulo — o módulo Captura (#1) INTERATIVO (demo navegável, autocontido).
 *
 * Espelha a cerimônia client-side do EmissorFluxo: todo o estado vive aqui (useState),
 * sem Server Actions, sem lib/api.ts, sem packages/*. A SEMENTE (CLIENTES_SEED /
 * NOTAS_SEED) é copiada para o estado de sessão no mount; a partir daí o contador USA:
 *
 *  1. Subir nota (manual) — abre um form e ADICIONA uma nota sintética à lista na hora.
 *  2. Filtro/busca — por cliente, por tipo (NF-e/CT-e) e por período (datas).
 *  3. Toggle "captura ativa" por cliente — alterna o estado e reflete em status/KPIs.
 *  4. Drill-down do cliente — clicar num cliente filtra as notas dele + mostra resumo.
 *  5. KPIs — recalculam conforme filtros e ações.
 *
 * G6 (doc 45 §5): a Captura só COLETA e ARMAZENA o insumo fiscal — nenhum juízo de
 * mérito aqui. Nada promete crédito garantido, apuração correta, eliminação de multa
 * nem prova jurídica plena. A varredura automática real (certificado/provider) chega na
 * Fase 5 (precisa provider + DPA — Art. 39 LGPD). Base SINTÉTICA, em memória de sessão.
 */

import { useId, useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, type Column } from "@/components/Table";
import { brl, cnpjMasked, dataHora } from "@/lib/format";
import {
  classeInsumoView,
  ESTAGIO_VIEW,
  MODO_VIEW,
  NATUREZA_LABEL,
  TIPO_LABEL,
  type CapturaClienteLinha,
  type NaturezaNota,
  type NotaCapturadaLinha,
  type TipoDocumento,
} from "./captura-model";
import {
  CLIENTES_SEED,
  NOTAS_SEED,
  derivarStatusClientes,
  hidratarNotas,
  novoIdNota,
  type ClienteMeta,
  type NotaSeed,
} from "./captura-data";
import styles from "./captura.module.css";

/** Filtro de tipo na busca: todos | nfe | cte. */
type FiltroTipo = "todos" | TipoDocumento;

interface FormNota {
  clienteId: string;
  tipo: TipoDocumento;
  natureza: NaturezaNota;
  valorTexto: string;
  data: string; // yyyy-mm-dd (input date)
}

/** Data de hoje em yyyy-mm-dd (default do form de nova nota). */
function hojeISOData(): string {
  return new Date().toISOString().slice(0, 10);
}

const FORM_VAZIO = (): FormNota => ({
  clienteId: "",
  tipo: "nfe",
  natureza: "compra",
  valorTexto: "",
  data: hojeISOData(),
});

export function CapturaModulo() {
  // Estado de SESSÃO: cópias rasas da semente (não mutam os módulos originais).
  const [clientes, setClientes] = useState<ClienteMeta[]>(() =>
    CLIENTES_SEED.map((c) => ({ ...c })),
  );
  const [notas, setNotas] = useState<NotaSeed[]>(() => NOTAS_SEED.map((n) => ({ ...n })));

  // Filtros / busca.
  const [filtroCliente, setFiltroCliente] = useState<string>(""); // "" = todos
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todos");
  const [dataDe, setDataDe] = useState<string>("");
  const [dataAte, setDataAte] = useState<string>("");

  // Form "subir nota (manual)".
  const [formAberto, setFormAberto] = useState(false);
  const [form, setForm] = useState<FormNota>(FORM_VAZIO);
  const [erro, setErro] = useState<string | null>(null);
  const [ultimaCriada, setUltimaCriada] = useState<string | null>(null);

  const fCliId = useId();
  const fTipoId = useId();
  const fNatId = useId();
  const fValorId = useId();
  const fDataId = useId();
  const buscaCliId = useId();
  const buscaTipoId = useId();
  const buscaDeId = useId();
  const buscaAteId = useId();

  // ---- Status por cliente (derivado do estado vivo) ----
  const statusClientes = useMemo(
    () => derivarStatusClientes(clientes, notas),
    [clientes, notas],
  );

  // ---- Notas hidratadas + filtradas (uma fonte: estado) ----
  const notasHidratadas = useMemo(() => hidratarNotas(notas, clientes), [notas, clientes]);

  const notasFiltradas = useMemo(() => {
    const deMs = dataDe ? new Date(`${dataDe}T00:00:00-03:00`).getTime() : -Infinity;
    const ateMs = dataAte ? new Date(`${dataAte}T23:59:59-03:00`).getTime() : Infinity;
    return notasHidratadas.filter((n) => {
      if (filtroCliente && n.clienteId !== filtroCliente) return false;
      if (filtroTipo !== "todos" && n.tipo !== filtroTipo) return false;
      const t = new Date(n.dataIso).getTime();
      if (t < deMs || t > ateMs) return false;
      return true;
    });
  }, [notasHidratadas, filtroCliente, filtroTipo, dataDe, dataAte]);

  const filtroAtivo =
    Boolean(filtroCliente) || filtroTipo !== "todos" || Boolean(dataDe) || Boolean(dataAte);

  // ---- KPIs (recalculam conforme filtro) ----
  const totalFiltradas = notasFiltradas.length;
  const valorFiltrado = notasFiltradas.reduce((acc, n) => acc + n.valor, 0);
  const clientesAtivos = statusClientes.filter((c) => c.capturaAtiva).length;

  // Cliente em drill-down (se houver filtro por um cliente único).
  const clienteDrill = filtroCliente
    ? statusClientes.find((c) => c.clienteId === filtroCliente) ?? null
    : null;

  // ---- Ações ----
  function alternarCaptura(clienteId: string) {
    setClientes((prev) =>
      prev.map((c) => (c.id === clienteId ? { ...c, capturaAtiva: !c.capturaAtiva } : c)),
    );
  }

  function selecionarCliente(clienteId: string) {
    // Toggle de drill-down: clicar de novo no mesmo cliente limpa o foco.
    setFiltroCliente((atual) => (atual === clienteId ? "" : clienteId));
  }

  function limparFiltros() {
    setFiltroCliente("");
    setFiltroTipo("todos");
    setDataDe("");
    setDataAte("");
  }

  function abrirForm() {
    setForm({ ...FORM_VAZIO(), clienteId: filtroCliente || "" });
    setErro(null);
    setUltimaCriada(null);
    setFormAberto(true);
  }

  function submeterNota(e: React.FormEvent) {
    e.preventDefault();
    const cliente = clientes.find((c) => c.id === form.clienteId);
    if (!cliente) {
      setErro("Selecione um cliente.");
      return;
    }
    const valor = Number(form.valorTexto.replace(/\./g, "").replace(",", "."));
    if (!Number.isFinite(valor) || valor <= 0) {
      setErro("Informe um valor maior que zero (ex.: 1.240,00).");
      return;
    }
    if (!form.data) {
      setErro("Informe a data da nota.");
      return;
    }

    // Upload manual = XML (◆ 1ª classe), estágio inicial "capturada".
    const id = novoIdNota(notas);
    const seq = String(((Math.floor(valor) % 900000) + 100000)).slice(0, 6);
    const nova: NotaSeed = {
      id,
      clienteId: cliente.id,
      tipo: form.tipo,
      natureza: form.natureza,
      numeroSerie: `${seq} / 1`,
      valor,
      dataIso: new Date(`${form.data}T${new Date().toTimeString().slice(0, 8)}-03:00`).toISOString(),
      classeInsumo: "xml",
      estagio: "capturada",
    };
    setNotas((prev) => [nova, ...prev]);
    setUltimaCriada(`${TIPO_LABEL[form.tipo]} ${nova.numeroSerie} de ${cliente.nome} adicionada.`);
    setErro(null);
    // Reabre o form limpo (mesmo cliente) para lançamentos em sequência.
    setForm({ ...FORM_VAZIO(), clienteId: cliente.id });
  }

  // ============================================================ colunas

  const clienteColumns: Column<CapturaClienteLinha>[] = [
    {
      key: "cliente",
      header: "Cliente",
      render: (c) => (
        <button
          type="button"
          className={`${styles.clienteBtn} ${
            filtroCliente === c.clienteId ? styles.clienteBtnAtivo : ""
          }`}
          onClick={() => selecionarCliente(c.clienteId)}
          title={
            filtroCliente === c.clienteId
              ? "Cliente em foco — clique para limpar"
              : "Ver só as notas deste cliente"
          }
        >
          <span className={styles.cliente}>
            <span className={styles.clienteNome}>{c.clienteNome}</span>
            <span className={`${styles.clienteDoc} mono muted`}>{cnpjMasked(c.documento)}</span>
          </span>
          <span aria-hidden="true" className={styles.clienteChevron}>
            {filtroCliente === c.clienteId ? "◉" : "›"}
          </span>
        </button>
      ),
    },
    {
      key: "captura_ativa",
      header: "Captura automática",
      render: (c) => {
        const v = classeInsumoView(c.classePredominante);
        return (
          <button
            type="button"
            className={`${styles.toggle} ${c.capturaAtiva ? styles.toggleOn : ""}`}
            onClick={() => alternarCaptura(c.clienteId)}
            aria-pressed={c.capturaAtiva}
            title={
              c.capturaAtiva
                ? `Captura ativa — modo ${MODO_VIEW[c.modo].label}. Clique para recolher.`
                : "Captura recolhida (default seletivo). Clique para ativar a varredura desta carteira."
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
          </button>
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

  // ============================================================ render

  return (
    <>
      {/* KPIs — recalculam conforme filtro/ações. */}
      <div className="grid grid-3" style={{ marginTop: 16 }}>
        <Card>
          <div className="kpi">
            <span className="kpi-value num">{totalFiltradas}</span>
            <span className="kpi-label">
              {filtroAtivo ? "Notas no filtro" : "Notas capturadas (demo)"}
            </span>
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
            <span className="kpi-value num">{brl(valorFiltrado)}</span>
            <span className="kpi-label">
              {filtroAtivo ? "Valor no filtro" : "Valor capturado (sintético)"}
            </span>
          </div>
        </Card>
      </div>

      {/* Status por cliente — toggle funcional + drill-down ao clicar. */}
      <Card
        title="Status de captura por cliente"
        sub="Clique no nome para ver só as notas do cliente. O toggle liga/desliga a captura automática da carteira (◆ XML 1ª classe via upload · ◇ provider/OCR 2ª) — o default OFF é seletivo por design."
      >
        <Table<CapturaClienteLinha>
          columns={clienteColumns}
          rows={statusClientes}
          rowKey={(c) => c.clienteId}
          rowClassName={(c) => (filtroCliente === c.clienteId ? "revisar" : undefined)}
          empty="Nenhum cliente cadastrado para captura."
        />
      </Card>

      {/* Drill-down: resumo do cliente em foco. */}
      {clienteDrill ? (
        <Card title={`Foco: ${clienteDrill.clienteNome}`} sub="Resumo da carteira em foco (somente leitura). Os filtros abaixo já estão restritos a este cliente.">
          <dl className={styles.resumoDrill}>
            <div>
              <dt>Documento</dt>
              <dd className="mono num">{cnpjMasked(clienteDrill.documento)}</dd>
            </div>
            <div>
              <dt>Captura automática</dt>
              <dd>{clienteDrill.capturaAtiva ? "Ativa" : "Recolhida (OFF)"}</dd>
            </div>
            <div>
              <dt>Modo</dt>
              <dd>{MODO_VIEW[clienteDrill.modo].label}</dd>
            </div>
            <div>
              <dt>Notas no filtro</dt>
              <dd className="num">{totalFiltradas}</dd>
            </div>
            <div>
              <dt>Valor no filtro</dt>
              <dd className="num">{brl(valorFiltrado)}</dd>
            </div>
            <div>
              <dt>Última captura</dt>
              <dd className="num">
                {clienteDrill.ultimaCapturaIso ? dataHora(clienteDrill.ultimaCapturaIso) : "—"}
              </dd>
            </div>
          </dl>
          <button type="button" className={styles.btnLink} onClick={() => setFiltroCliente("")}>
            ← limpar foco do cliente
          </button>
        </Card>
      ) : null}

      {/* Lista de notas + ações (subir nota) + filtros. */}
      <Card
        title="Notas capturadas"
        sub="NF-e e CT-e coletadas, ordenadas por data (mais recente primeiro). Natureza (compra/venda) derivada de emitente/destinatário. Estágio: capturada → processada (leitura concluída) — sem juízo fiscal aqui."
      >
        {/* Barra de ações. */}
        <div className={styles.acoes}>
          <button
            type="button"
            className={styles.btnSubir}
            onClick={formAberto ? () => setFormAberto(false) : abrirForm}
            aria-expanded={formAberto}
          >
            <span aria-hidden="true">{formAberto ? "×" : "↥"}</span>
            {formAberto ? "Fechar lançamento" : "Subir nota (manual)"}
          </button>
          {ultimaCriada ? (
            <span className={styles.acoesOk} role="status">
              <span aria-hidden="true">✓</span> {ultimaCriada}
            </span>
          ) : (
            <span className={styles.acoesHint}>
              Lança uma nota sintética na sessão (◆ XML). Não transmite nada a fisco.
            </span>
          )}
        </div>

        {/* Form de lançamento (subir nota). */}
        {formAberto ? (
          <form className={styles.formNota} onSubmit={submeterNota}>
            <div className={styles.formGrid}>
              <div className={styles.campo}>
                <label htmlFor={fCliId} className={styles.label}>
                  Cliente <span aria-hidden="true">*</span>
                </label>
                <select
                  id={fCliId}
                  className={styles.select}
                  value={form.clienteId}
                  onChange={(e) => setForm((f) => ({ ...f, clienteId: e.target.value }))}
                  required
                >
                  <option value="">— selecione —</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.campo}>
                <label htmlFor={fTipoId} className={styles.label}>
                  Tipo <span aria-hidden="true">*</span>
                </label>
                <select
                  id={fTipoId}
                  className={styles.select}
                  value={form.tipo}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tipo: e.target.value as TipoDocumento }))
                  }
                >
                  <option value="nfe">{TIPO_LABEL.nfe}</option>
                  <option value="cte">{TIPO_LABEL.cte}</option>
                </select>
              </div>

              <div className={styles.campo}>
                <label htmlFor={fNatId} className={styles.label}>
                  Natureza <span aria-hidden="true">*</span>
                </label>
                <select
                  id={fNatId}
                  className={styles.select}
                  value={form.natureza}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, natureza: e.target.value as NaturezaNota }))
                  }
                >
                  <option value="compra">{NATUREZA_LABEL.compra}</option>
                  <option value="venda">{NATUREZA_LABEL.venda}</option>
                </select>
              </div>

              <div className={styles.campo}>
                <label htmlFor={fValorId} className={styles.label}>
                  Valor (R$) <span aria-hidden="true">*</span>
                </label>
                <input
                  id={fValorId}
                  type="text"
                  inputMode="decimal"
                  className={styles.input}
                  value={form.valorTexto}
                  onChange={(e) => setForm((f) => ({ ...f, valorTexto: e.target.value }))}
                  placeholder="1.240,00"
                  required
                />
              </div>

              <div className={styles.campo}>
                <label htmlFor={fDataId} className={styles.label}>
                  Data <span aria-hidden="true">*</span>
                </label>
                <input
                  id={fDataId}
                  type="date"
                  className={styles.input}
                  value={form.data}
                  max={hojeISOData()}
                  onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}
                  required
                />
              </div>
            </div>

            {erro ? (
              <p className={styles.formErro} role="alert">
                {erro}
              </p>
            ) : null}

            <div className={styles.formAcoes}>
              <button type="submit" className={styles.btnPrimario}>
                ↥ Adicionar nota (demo)
              </button>
              <span className={styles.formHint}>
                Lançamento manual entra como ◆ XML, estágio “capturada”.
              </span>
            </div>
          </form>
        ) : null}

        {/* Filtros / busca. */}
        <div className={styles.filtros}>
          <div className={styles.filtroCampo}>
            <label htmlFor={buscaCliId} className={styles.filtroLabel}>
              Cliente
            </label>
            <select
              id={buscaCliId}
              className={styles.filtroSelect}
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
            >
              <option value="">Todos os clientes</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filtroCampo}>
            <label htmlFor={buscaTipoId} className={styles.filtroLabel}>
              Tipo
            </label>
            <select
              id={buscaTipoId}
              className={styles.filtroSelect}
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as FiltroTipo)}
            >
              <option value="todos">Todos</option>
              <option value="nfe">{TIPO_LABEL.nfe}</option>
              <option value="cte">{TIPO_LABEL.cte}</option>
            </select>
          </div>

          <div className={styles.filtroCampo}>
            <label htmlFor={buscaDeId} className={styles.filtroLabel}>
              De
            </label>
            <input
              id={buscaDeId}
              type="date"
              className={styles.filtroSelect}
              value={dataDe}
              onChange={(e) => setDataDe(e.target.value)}
            />
          </div>

          <div className={styles.filtroCampo}>
            <label htmlFor={buscaAteId} className={styles.filtroLabel}>
              Até
            </label>
            <input
              id={buscaAteId}
              type="date"
              className={styles.filtroSelect}
              value={dataAte}
              onChange={(e) => setDataAte(e.target.value)}
            />
          </div>

          {filtroAtivo ? (
            <button type="button" className={styles.btnLink} onClick={limparFiltros}>
              limpar filtros ({totalFiltradas} de {notas.length})
            </button>
          ) : (
            <span className={styles.filtroContagem}>
              {notas.length} nota{notas.length === 1 ? "" : "s"} na sessão
            </span>
          )}
        </div>

        <Table<NotaCapturadaLinha>
          columns={notaColumns}
          rows={notasFiltradas}
          rowKey={(n) => n.id}
          empty={
            filtroAtivo
              ? "Nenhuma nota bate com o filtro — ajuste cliente, tipo ou período."
              : "Nenhuma nota capturada — suba uma nota ou ative a captura de um cliente."
          }
        />
      </Card>
    </>
  );
}
