import Link from "next/link";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, type Column } from "@/components/Table";
import { TopBar } from "@/components/TopBar";
import { getApi, ESCRITORIO_ID } from "@/lib/api";
import { brl } from "@/lib/format";
import { carregarFilaPendente, type FilaLinha } from "@/lib/fila-model";

/**
 * Fila do dia (F1.3) — tabela data-dense (DESIGN §6.5) dos indícios PENDENTES.
 * Colunas: Produto · NCM · cClassTrib aplicado → referência · Natureza ·
 * Confiança (banda) · Materialidade (R$, tabular-nums, à direita) · Status.
 * Ordenada por materialidade desc. Linha disputado/baixa-confiança = destaque
 * âmbar "revisar antes de aprovar"; linha de risco = faixa esquerda (DESIGN §6.5).
 * Cada linha linka para /aprovacao/[id] (a tela de aprovação chega na F1.4).
 *
 * G6: indício / base sintética / revisão humana — nunca "crédito garantido".
 */
export default async function FilaPage() {
  const api = await getApi();
  const linhas = await carregarFilaPendente(api, ESCRITORIO_ID);

  const total = linhas.length;
  const materialidadeTotal = linhas.reduce((acc, l) => acc + l.materialidade, 0);
  const bloqueados = linhas.filter((l) => l.bloqueiaAutoAprovacao).length;

  const columns: Column<FilaLinha>[] = [
    {
      key: "produto",
      header: "Produto",
      render: (l) => (
        <Link href={`/aprovacao/${l.id}`} className="fila-link">
          <span className="fila-produto">{l.produto}</span>
          <span className="fila-cliente muted">{l.clienteNome}</span>
        </Link>
      ),
    },
    {
      key: "ncm",
      header: "NCM",
      render: (l) => <span className="mono num">{l.ncm ?? "—"}</span>,
    },
    {
      key: "cclasstrib",
      header: "cClassTrib aplicado → referência",
      render: (l) => (
        <span className="fila-cclass">
          <span className="mono num">{l.cclasstribInformado ?? "—"}</span>
          <span aria-hidden="true" className="fila-arrow">
            →
          </span>
          {l.cclasstribReferencia ? (
            <span className="mono num">{l.cclasstribReferencia}</span>
          ) : (
            <span className="muted" title="Régua em controvérsia — sem referência fixa (G6)">
              em disputa
            </span>
          )}
        </span>
      ),
    },
    {
      key: "natureza",
      header: "Natureza da divergência",
      render: (l) => <span>{l.naturezaLabel}</span>,
    },
    {
      key: "confianca",
      header: "Confiança",
      render: (l) => <StatusBadge view={l.bandaView} />,
    },
    {
      key: "materialidade",
      header: "Materialidade",
      align: "num",
      render: (l) => <span className="num">{brl(l.materialidade)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (l) =>
        l.bloqueiaAutoAprovacao ? (
          <span className="fila-flag" title={l.semaforo.hint}>
            revisar antes de aprovar
          </span>
        ) : (
          <StatusBadge view={l.semaforo} />
        ),
    },
  ];

  return (
    <>
      <TopBar
        title="Fila do dia"
        sub="Indícios pendentes de revisão — ordenados por materialidade. Aprovação é ato privativo do contador (CRC)."
      />
      <div className="content">
        <div className="notice" role="status">
          <span aria-hidden="true">◇</span>
          <span>
            <strong>Base sintética</strong> (Fase 1). Cada linha é um{" "}
            <strong>indício</strong> sujeito a <strong>revisão humana</strong> — nada aqui é
            crédito garantido, apuração correta nem prova jurídica plena.
          </span>
        </div>

        <div className="grid grid-3" style={{ marginTop: 16 }}>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{total}</span>
              <span className="kpi-label">Indícios na fila</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{bloqueados}</span>
              <span className="kpi-label">Bloqueiam auto-aprovação</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{brl(materialidadeTotal)}</span>
              <span className="kpi-label">Materialidade total (em revisão)</span>
            </div>
          </Card>
        </div>

        <Card
          title="Indícios pendentes"
          sub="Linha âmbar = bloqueia auto-aprovação (disputado/baixa confiança). Faixa vermelha à esquerda = risco. Clique no produto para abrir a aprovação."
        >
          <Table<FilaLinha>
            columns={columns}
            rows={linhas}
            rowKey={(l) => l.id}
            rowClassName={(l) =>
              [l.risco ? "risco" : "", l.bloqueiaAutoAprovacao ? "revisar" : ""]
                .filter(Boolean)
                .join(" ") || undefined
            }
            empty="Nenhum indício pendente — fila zerada."
          />
        </Card>

        <Card title="Linguagem segura (G6)">
          <p className="disclaimer">
            <strong>indício</strong> · base sintética (Fase 1) · insumo XML/OCR ·{" "}
            sujeito a <strong>revisão humana</strong> · trilha <strong>verificável</strong>.
            Esta plataforma não promete crédito garantido, apuração correta nem eliminação de multa.
          </p>
        </Card>
      </div>
    </>
  );
}
