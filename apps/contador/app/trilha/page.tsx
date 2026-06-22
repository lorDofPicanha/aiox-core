/**
 * F1.5 — Tela "Trilha de boa-fé" (timeline vertical append-only, DESIGN §6.2).
 *
 * Server Component: lê a cadeia REAL do seed (api-client/F1.2) via listarEventos,
 * resolve os atores (motor/contador/sistema → nome + papel/CRC), enriquece cada nó
 * e RODA o verificador (verificarCadeia) no loop — re-verificação ≠ re-execução.
 *
 * A interação (copiar hash) vive em TrilhaTimeline (client). Esta página é só leitura:
 * sem botões editar/excluir — a trilha é visualmente SELADA (append-only).
 *
 * G6 (linguagem segura): trilha técnica verificável ≠ prova jurídica plena; o carimbo
 * de tempo formal (ACT ICP-Brasil) é Fase 4 — mostrado como pendente, sem performar
 * prova que não existe.
 */

import { verificarCadeia, type EventoBoaFeDump } from "@synkra/contador-trilha-verifier";
import type { EventoBoaFe, MotorVersao, Usuario } from "@synkra/contador-api-client";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { TopBar } from "@/components/TopBar";
import { TrilhaTimeline, type DiaGrupo, type TrilhaNo } from "@/components/TrilhaTimeline";
import { getApi, ESCRITORIO_ID } from "@/lib/api";
import { dataHora } from "@/lib/format";
import { eventoGlyph, eventoLabel } from "@/lib/status";

const VERIFIER_VERSION = "contador-trilha-verifier@0.1.0 (hash_ver=1)";

/** Categoria semântica do nó (DESIGN §6.2: captura · apontamento · decisão/aprovação · carimbo). */
function categoriaDe(tipo: EventoBoaFe["tipoEvento"]): TrilhaNo["categoria"] {
  switch (tipo) {
    case "nota_recebida":
    case "analise_executada":
      return "captura";
    case "apontamento_gerado":
    case "apontamento_retificado":
    case "apontamento_regularizado":
    case "apontamento_escalado":
    case "apontamento_superado":
      return "apontamento";
    case "apontamento_aprovado":
    case "apontamento_rejeitado":
    case "decisao_lote":
    case "laudo_emitido":
    case "laudo_substituido":
      return "decisao";
    case "ancora_temporal":
      return "carimbo";
    default:
      return "outro";
  }
}

/** Ação legível por tipo de evento (descrição do nó). */
function acaoDe(e: EventoBoaFe): string {
  switch (e.tipoEvento) {
    case "nota_recebida":
      return "Documento capturado e registrado na trilha (insumo de prova).";
    case "analise_executada":
      return "Motor de regras analisou o item e registrou o indício (sujeito a revisão humana).";
    case "apontamento_aprovado":
      return "Apontamento aprovado — ato privativo do contador (CRC ativo).";
    case "apontamento_rejeitado":
      return "Apontamento rejeitado com motivo registrado.";
    case "ancora_temporal":
      return "Âncora temporal aplicada à cadeia.";
    default:
      return eventoLabel(e.tipoEvento);
  }
}

/** Resolve ator → nome + detalhe (papel/CRC). Mantém honesto quando não há vínculo. */
function resolverAtor(
  e: EventoBoaFe,
  contadores: Usuario[],
  motores: MotorVersao[],
): { nome: string; detalhe: string | null } {
  if (e.atorTipo === "motor") {
    const m = motores.find((x) => x.id === e.atorId);
    return {
      nome: m?.rotulo ?? "Motor de regras",
      detalhe: m ? `motor determinístico · v${m.codigoVersao}` : "motor determinístico",
    };
  }
  if (e.atorTipo === "usuario") {
    const u = contadores.find((x) => x.id === e.atorId);
    if (u) {
      const crc = u.crc ? `CRC ${u.crc}${u.crcUf ? `/${u.crcUf}` : ""}` : "sem CRC";
      const sit = u.crcSituacao ? ` (${u.crcSituacao})` : "";
      return { nome: u.nome, detalhe: `${u.papel} · ${crc}${sit}` };
    }
    return { nome: "Usuário", detalhe: "papel não resolvido" };
  }
  // sistema
  return { nome: "Sistema", detalhe: "ingestão automática" };
}

/** Classe do insumo a partir do payload do evento (◆ XML / ◇ OCR). */
function classeInsumoDe(e: EventoBoaFe): "xml" | "ocr" | null {
  const c = e.payload?.["classe_insumo"];
  return c === "xml" || c === "ocr" ? c : null;
}

/** Relativo PT-BR estável (server-side; âncora = momento do render). */
function relativoDe(iso: string, agora: number): string {
  const diffMs = agora - new Date(iso).getTime();
  const futuro = diffMs < 0;
  const s = Math.abs(diffMs) / 1000;
  const prefixo = futuro ? "em " : "há ";
  let valor: string;
  if (s < 60) valor = "menos de 1 min";
  else if (s < 3600) valor = `${Math.round(s / 60)} min`;
  else if (s < 86400) valor = `${Math.round(s / 3600)} h`;
  else if (s < 2592000) valor = `${Math.round(s / 86400)} dia(s)`;
  else valor = `${Math.round(s / 2592000)} mês(es)`;
  return `${prefixo}${valor}`;
}

/** Rótulo do dia: "qua, 22 jan 2026". */
function diaLabelDe(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toDump(e: EventoBoaFe): EventoBoaFeDump {
  return {
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
  };
}

export default async function TrilhaPage() {
  const api = await getApi();

  const [escritorio, eventos, contadores, motores] = await Promise.all([
    api.getEscritorio(ESCRITORIO_ID),
    api.listarEventos({ escritorioId: ESCRITORIO_ID }),
    api.listarContadores(ESCRITORIO_ID),
    api.listarMotores(ESCRITORIO_ID),
  ]);

  // Ordem canônica da cadeia (append-only): por seq_tenant crescente.
  const ordenados = [...eventos].sort((a, b) => a.seqTenant - b.seqTenant);

  // Verificador no loop: recomputa o hash-chain real (re-verificação ≠ re-execução).
  const verif = verificarCadeia(ordenados.map(toDump));

  // Período coberto pela cadeia (header).
  const primeiro = ordenados[0]?.ocorridoEm;
  const ultimo = ordenados.at(-1)?.ocorridoEm;
  const periodo =
    primeiro && ultimo
      ? primeiro.slice(0, 10) === ultimo.slice(0, 10)
        ? diaLabelDe(primeiro)
        : `${diaLabelDe(primeiro)} — ${diaLabelDe(ultimo)}`
      : "—";

  const agora = Date.now();

  // Enriquece + agrupa por dia (mantendo a ordem da cadeia dentro do dia).
  const grupos: DiaGrupo[] = [];
  for (const e of ordenados) {
    const ator = resolverAtor(e, contadores, motores);
    const no: TrilhaNo = {
      id: e.id,
      seq: e.seqTenant,
      glyph: eventoGlyph(e.tipoEvento),
      categoria: categoriaDe(e.tipoEvento),
      tipoLabel: eventoLabel(e.tipoEvento),
      atorNome: ator.nome,
      atorDetalhe: ator.detalhe,
      acao: acaoDe(e),
      absoluto: dataHora(e.ocorridoEm),
      relativo: relativoDe(e.ocorridoEm, agora),
      classeInsumo: classeInsumoDe(e),
      hashEvento: e.hashEvento,
      carimbo: "pendente",
    };
    const dia = e.ocorridoEm.slice(0, 10);
    const grupo = grupos.find((g) => g.dia === dia);
    if (grupo) {
      grupo.nos.push(no);
    } else {
      grupos.push({ dia, diaLabel: diaLabelDe(e.ocorridoEm), nos: [no] });
    }
  }

  return (
    <>
      <TopBar
        title={`Trilha de boa-fé · ${escritorio?.nome ?? "—"}`}
        sub={`Período coberto: ${periodo} · evidência verificável (append-only)`}
      />
      <div className="content">
        <div className="trilha-layout">
          <div className="trilha-main">
            <Card>
              <div className="trilha-header">
                <div>
                  <h2 className="card-title">Cadeia de eventos (somente leitura)</h2>
                  <p className="card-sub" style={{ margin: 0 }}>
                    Cada nó carimba quem · papel/CRC · ação · quando · classe de insumo ·
                    hash verificável. Sem editar/excluir — a trilha é selada.
                  </p>
                </div>
                <span className="badge badge-neutral seal" title="Registro append-only, imutável">
                  <span className="badge-glyph" aria-hidden="true">
                    🔒
                  </span>
                  Selada (append-only)
                </span>
              </div>

              {grupos.length > 0 ? (
                <TrilhaTimeline grupos={grupos} />
              ) : (
                <p className="muted">Nenhum evento na trilha do seed atual.</p>
              )}

              <div className="trilha-corretivo">
                <button type="button" className="btn-ghost" disabled title="Disponível em fase posterior">
                  + Adicionar evento corretivo versionado
                </button>
                <span className="muted" style={{ fontSize: 11 }}>
                  Correções nunca apagam o histórico — geram um novo nó versionado (placeholder).
                </span>
              </div>
            </Card>

            <Card title="Linguagem segura (G6)">
              <p className="disclaimer">
                Esta é uma <strong>trilha técnica verificável</strong> (hash-chain
                recomputável) — a <strong>prova jurídica plena</strong> depende de gates
                posteriores (carimbo de tempo ACT ICP-Brasil, base oficial validada). Os
                eventos são <strong>indícios/registros</strong> sujeitos a revisão humana;
                nada aqui promete crédito garantido nem apuração correta.
              </p>
            </Card>
          </div>

          <aside className="trilha-side">
            <Card title="Verificação da cadeia">
              <p className="card-sub">
                O verificador recomputa o hash-chain dos eventos. Re-verificação ≠
                re-execução.
              </p>
              <p style={{ margin: "0 0 var(--space-3)" }}>
                {verif.ok ? (
                  <StatusBadge view={{ variant: "success", glyph: "✓", label: "Cadeia íntegra" }} />
                ) : (
                  <StatusBadge
                    view={{ variant: "danger", glyph: "!", label: "Cadeia inconsistente" }}
                  />
                )}
              </p>
              <dl className="verif-dl">
                <div>
                  <dt>Eventos verificados</dt>
                  <dd className="num mono">{verif.checked}</dd>
                </div>
                <div>
                  <dt>Falhas</dt>
                  <dd className="num mono">{verif.failures.length}</dd>
                </div>
                <div>
                  <dt>Verificador</dt>
                  <dd className="mono" style={{ fontSize: 11 }}>
                    {VERIFIER_VERSION}
                  </dd>
                </div>
                <div>
                  <dt>Hash da cabeça</dt>
                  <dd className="mono num" style={{ fontSize: 11, wordBreak: "break-all" }}>
                    {verif.headHash ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt>Carimbo de tempo</dt>
                  <dd className="muted" style={{ fontSize: 12 }}>
                    pendente (ACT ICP-Brasil — Fase 4)
                  </dd>
                </div>
              </dl>

              {!verif.ok ? (
                <ul className="list-reset" style={{ marginTop: "var(--space-3)" }}>
                  {verif.failures.map((f) => (
                    <li key={`${f.seq}-${f.code}`} className="verif-fail">
                      <strong className="mono">#{f.seq}</strong> {f.code}: {f.message}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
