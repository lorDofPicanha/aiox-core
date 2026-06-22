/**
 * F1.4 — Índice de Aprovação CRC: indícios PENDENTES de decisão do contador.
 *
 * Cada linha linka para /aprovacao/[id] (a cerimônia graduada). NÃO há ação em
 * lote aqui — a decisão é individual, item-a-item, na tela de detalhe (DESIGN §6.4).
 *
 * G6: cada linha é um indício sujeito a revisão humana; base sintética (Fase 1).
 */
import Link from "next/link";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, type Column } from "@/components/Table";
import { TopBar } from "@/components/TopBar";
import { getApi, ESCRITORIO_ID } from "@/lib/api";
import { brl } from "@/lib/format";
import {
  carregarPendentesAprovacao,
  type AprovacaoPendente,
} from "@/app/aprovacao/aprovacao-model";

export default async function AprovacaoIndexPage() {
  const api = await getApi();
  const linhas = await carregarPendentesAprovacao(api, ESCRITORIO_ID);

  const total = linhas.length;
  const bloqueados = linhas.filter((l) => l.bloqueiaAutoAprovacao).length;

  const columns: Column<AprovacaoPendente>[] = [
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
      key: "acao",
      header: "Ação",
      render: (l) => (
        <Link href={`/aprovacao/${l.id}`} className="fila-link">
          <span className="fila-produto">Revisar e decidir →</span>
        </Link>
      ),
    },
  ];

  return (
    <>
      <TopBar
        title="Aprovação CRC"
        sub="Indícios pendentes de decisão — aprovar/rejeitar é ato privativo do contador (CRC ativo), um a um."
      />
      <div className="content">
        <div className="notice" role="status">
          <span aria-hidden="true">◇</span>
          <span>
            <strong>Decisão individual.</strong> Não há aprovação em lote: cada indício é
            decidido na sua tela com confirmação explícita (cerimônia graduada, DESIGN §6.4).
          </span>
        </div>

        <div className="grid grid-2" style={{ marginTop: 16 }}>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{total}</span>
              <span className="kpi-label">Pendentes de decisão</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{bloqueados}</span>
              <span className="kpi-label">Bloqueiam auto-aprovação (revisar antes)</span>
            </div>
          </Card>
        </div>

        <Card
          title="Indícios pendentes"
          sub="Ordenados por materialidade. Clique para abrir a cerimônia de decisão."
        >
          <Table<AprovacaoPendente>
            columns={columns}
            rows={linhas}
            rowKey={(l) => l.id}
            rowClassName={(l) => (l.bloqueiaAutoAprovacao ? "revisar" : undefined)}
            empty="Nenhum indício pendente — fila de aprovação zerada."
          />
        </Card>
      </div>
    </>
  );
}
