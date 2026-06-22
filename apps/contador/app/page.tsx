import { verificarCadeia } from "@synkra/contador-trilha-verifier";
import Link from "next/link";
import { Card } from "@/components/Card";
import { SemaforoCarteira } from "@/components/SemaforoCarteira";
import { StatusBadge } from "@/components/StatusBadge";
import { TopBar } from "@/components/TopBar";
import { getApi, ESCRITORIO_ID } from "@/lib/api";
import { brl } from "@/lib/format";
import { carregarCarteira } from "@/lib/fila-model";
import { BANDA_CONFIANCA } from "@/lib/status";

export default async function HomePage() {
  const api = await getApi();

  const [escritorio, clientes, apontamentos, contadores, eventos, carteira] = await Promise.all([
    api.getEscritorio(ESCRITORIO_ID),
    api.listarClientes(ESCRITORIO_ID),
    api.listarApontamentos({ escritorioId: ESCRITORIO_ID }),
    api.listarContadores(ESCRITORIO_ID),
    api.listarEventos({ escritorioId: ESCRITORIO_ID }),
    carregarCarteira(api, ESCRITORIO_ID),
  ]);

  const pendentes = apontamentos.filter((a) => a.status === "pendente");
  const valorEmRevisao = pendentes.reduce((acc, a) => acc + (a.valorEnvolvido ?? 0), 0);

  // Verificador no loop (F1.6): a trilha do mock é um hash-chain real.
  const verif = verificarCadeia(
    eventos.map((e) => ({
      id: e.id,
      escritorio_id: e.escritorioId,
      seq_tenant: e.seqTenant,
      hash_ver: e.hashVer,
      tipo_evento: e.tipoEvento,
      ator_tipo: e.atorTipo,
      ator_id: e.atorId,
      referente_tipo: e.referenteTipo,
      referente_id: e.referenteId,
      nota_id: e.notaId,
      apontamento_id: e.apontamentoId,
      laudo_id: e.laudoId,
      payload: e.payload,
      ocorrido_em: e.ocorridoEm,
      hash_anterior: e.hashAnterior,
      hash_evento: e.hashEvento,
    })),
  );

  const proximas = [
    "F1.3 — Carteira (semáforo) + Fila do dia (tabela data-dense).",
    "F1.4 — Aprovação CRC (cerimônia graduada, ato privativo).",
    "F1.5 — Trilha de boa-fé (timeline append-only, hash copiável).",
    "F1.6 — Laudo + banlist G6 + verificador no loop.",
  ];

  const disputados = pendentes.filter((a) => a.bandaConfianca === "disputado");

  return (
    <>
      <TopBar
        title="Carteira"
        sub={`${escritorio?.nome ?? "—"} · semáforo de defensabilidade por cliente · cliente final recebe apenas o relatório white-label`}
      />
      <div className="content">
        <div className="notice" role="status">
          <span aria-hidden="true">◇</span>
          <span>
            Fase 1 com <strong>base sintética</strong>. Os apontamentos são{" "}
            <strong>indícios</strong> sujeitos a revisão humana — nada aqui é prova
            jurídica plena. O carimbo de tempo formal chega na Fase 4.
          </span>
        </div>

        <div className="grid grid-3" style={{ marginTop: 16 }}>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{clientes.length}</span>
              <span className="kpi-label">Clientes na carteira</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{pendentes.length}</span>
              <span className="kpi-label">Indícios pendentes de revisão</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{brl(valorEmRevisao)}</span>
              <span className="kpi-label">Valor envolvido (em revisão)</span>
            </div>
          </Card>
        </div>

        <Card
          title="Carteira — semáforo por cliente"
          sub="Cada cliente classificado pelo PIOR indício pendente (cor + ícone + label — nunca só matiz, DESIGN §3). Risco e 'requer revisão' bloqueiam auto-aprovação."
        >
          <SemaforoCarteira linhas={carteira} />
          <p style={{ marginTop: 12 }}>
            <Link href="/fila" className="badge badge-info">
              <span className="badge-glyph" aria-hidden="true">
                ≣
              </span>
              Abrir Fila do dia ({pendentes.length} indícios)
            </Link>
          </p>
        </Card>

        <Card title="Indícios que bloqueiam auto-aprovação (revisar antes)">
          <p className="card-sub">
            Casos disputado/baixa confiança da régua — o motor não fixa referência;
            exigem revisão humana (DESIGN §6.3). A abstenção fica registrada na trilha.
          </p>
          {disputados.length > 0 ? (
            <ul className="list-reset">
              {disputados.map((a) => (
                <li key={a.id}>
                  <StatusBadge view={BANDA_CONFIANCA[a.bandaConfianca]} />{" "}
                  <span className="muted">{a.descricao}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Nenhum indício disputado no seed atual.</p>
          )}
        </Card>

        <Card title="Trilha de boa-fé — verificação de integridade">
          <p className="card-sub">
            O verificador recomputa o hash-chain dos eventos. Re-verificação ≠ re-execução.
          </p>
          <p>
            {verif.ok ? (
              <StatusBadge view={{ variant: "success", glyph: "✓", label: "Cadeia íntegra" }} />
            ) : (
              <StatusBadge view={{ variant: "danger", glyph: "!", label: "Cadeia inconsistente" }} />
            )}{" "}
            <span className="muted">
              {verif.checked} evento(s) verificado(s); {verif.failures.length} falha(s).
            </span>
          </p>
          <p className="mono num muted" style={{ fontSize: 12 }}>
            head: {verif.headHash ?? "—"}
          </p>
        </Card>

        <div className="grid grid-2">
          <Card title="Contador habilitado (ato privativo)">
            <p className="card-sub">
              A aprovação carimba quem, quando e com qual CRC ativo — design, não rodapé.
            </p>
            {contadores.length > 0 ? (
              <ul className="list-reset">
                {contadores.map((c) => (
                  <li key={c.id}>
                    <strong>{c.nome}</strong> ·{" "}
                    <span className="mono">{c.crc}</span> ({c.crcUf}) ·{" "}
                    <StatusBadge view={BANDA_CONFIANCA.alta} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">Nenhum contador com CRC ativo.</p>
            )}
          </Card>

          <Card title="Próximas stories (Fase 1)">
            <p className="card-sub">A base está ligada; estas telas vêm a seguir.</p>
            <ul className="list-reset">
              {proximas.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Card>
        </div>

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
