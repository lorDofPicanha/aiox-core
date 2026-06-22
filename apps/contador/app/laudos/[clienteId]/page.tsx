/**
 * F1.6 — LAUDO defensável de um cliente (DESIGN §6.1).
 *
 * Server Component. Layout de "documento de fé pública" + control surface:
 *  - Cabeçalho "trust center": verificado contra régua vX · classe de insumo · nº de
 *    notas · quando · por quem (contador + CRC ativo) — o ato privativo é design.
 *  - Faixa de status no topo (defensável / requer revisão / risco).
 *  - KPIs (indícios, materialidade, bloqueiam auto-aprovação).
 *  - Tabela de divergências por item: produto · NCM · cClassTrib aplicado vs ref ·
 *    natureza · confiança calibrada · base normativa · classe de insumo. Disputados
 *    marcados (âmbar "revisar antes de aprovar"; risco = faixa esquerda).
 *  - Trilha resumo (REUSA TrilhaTimeline da F1.5) + verificador no loop (server) e
 *    botão "verificar cadeia" (client, VerificadorCadeia).
 *  - Rodapé disclaimer-credencial (G6) + selo de carimbo de tempo PENDENTE (honesto).
 *
 * G6 (doc 45): indício · evidência técnica · trilha verificável · revisão humana.
 * NUNCA crédito garantido / apuração correta / elimina multa / prova jurídica plena.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  verificarCadeia,
  type EventoBoaFeDump,
} from "@synkra/contador-trilha-verifier";
import type { EventoBoaFe } from "@synkra/contador-api-client";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, type Column } from "@/components/Table";
import { TopBar } from "@/components/TopBar";
import { TrilhaTimeline } from "@/components/TrilhaTimeline";
import { getApi, ESCRITORIO_ID } from "@/lib/api";
import { brl, cnpjMasked, dataHora, pct } from "@/lib/format";
import { REGUA_VERSAO, REGUA_STATUS } from "../regua";
import { carregarLaudo, type LaudoItem } from "../laudo-model";
import { montarTrilhaResumo } from "../trilha-resumo";
import { VerificadorCadeia } from "../VerificadorCadeia";
import styles from "../laudo.module.css";

/**
 * Rota dinâmica por cliente: renderizada sob demanda (não há lista fechada de clientes
 * para prerender e o laudo recomputa o verificador a cada acesso). Evita também tentar
 * prerender estático de uma rota que depende do verificador server-only (node:crypto).
 */
export const dynamic = "force-dynamic";

const VERIFIER_VERSION = "contador-trilha-verifier@0.1.0 (hash_ver=1)";

/** Serializa um EventoBoaFe (camelCase) → EventoBoaFeDump (snake_case do verificador). */
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

export default async function LaudoClientePage({
  params,
}: {
  params: Promise<{ clienteId: string }>;
}) {
  const { clienteId } = await params;
  const api = await getApi();

  const [laudo, contadores, motores] = await Promise.all([
    carregarLaudo(api, ESCRITORIO_ID, clienteId, REGUA_VERSAO),
    api.listarContadores(ESCRITORIO_ID),
    api.listarMotores(ESCRITORIO_ID),
  ]);

  if (!laudo) notFound();

  const { cliente, faixa, cabecalho, resumo, itens, eventos } = laudo;

  // Verificador no loop (server): a trilha de boa-fé é um hash-chain ÚNICO por tenant.
  // Integridade só é verificável sobre a cadeia COMPLETA e contígua — reverificar a fatia
  // de um cliente (seqs não-contíguos) falharia SEQ_GAP por construção. Verificamos o
  // tenant inteiro; a fatia do cliente (eventos/grupos abaixo) é apenas visualização.
  const cadeiaTenant = await api.listarEventos({ escritorioId: ESCRITORIO_ID });
  const verif = verificarCadeia(
    [...cadeiaTenant].sort((a, b) => a.seqTenant - b.seqTenant).map(toDump),
  );

  // Trilha resumo (REUSA TrilhaTimeline da F1.5).
  const grupos = montarTrilhaResumo(eventos, contadores, motores);

  const classesLabel = cabecalho.classesInsumo
    .map((c) => (c === "xml" ? "◆ XML (1ª classe)" : "◇ OCR (2ª classe)"))
    .join(" · ");

  const columns: Column<LaudoItem>[] = [
    {
      key: "produto",
      header: "Produto",
      render: (l) => (
        <span className={styles.itemProduto}>
          <span style={{ fontWeight: 600 }}>{l.produto}</span>
          <span className="insumo">
            <span aria-hidden="true">{l.classeInsumo === "xml" ? "◆" : "◇"}</span>
            {l.classeInsumo === "xml" ? "XML (1ª classe)" : "OCR (2ª classe)"}
          </span>
        </span>
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
        <span className={styles.cclass}>
          <span className="mono num">{l.cclasstribInformado ?? "—"}</span>
          <span aria-hidden="true" className={styles.arrow}>
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
      render: (l) => (
        <span className={styles.confCell}>
          <StatusBadge view={l.bandaView} />
          <span className="muted num" style={{ fontSize: 11 }}>
            {l.confianca != null ? pct(l.confianca) : "sem referência fixa"}
          </span>
        </span>
      ),
    },
    {
      key: "fundamento",
      header: "Base normativa",
      render: (l) =>
        l.fundamento.length > 0 ? (
          <ul className={styles.fundamentoList}>
            {l.fundamento.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        ) : (
          <span className="muted">—</span>
        ),
    },
    {
      key: "materialidade",
      header: "Materialidade",
      align: "num",
      render: (l) => <span className="num">{brl(l.materialidade)}</span>,
    },
  ];

  return (
    <>
      <TopBar
        title={`Laudo — ${cliente.nome}`}
        sub={`Documento técnico para revisão profissional · ${cnpjMasked(cliente.documento)} · indícios sujeitos a revisão humana (CRC)`}
      />
      <div className="content">
        <p style={{ marginTop: 0 }}>
          <Link href="/laudos" className="badge badge-neutral">
            <span className="badge-glyph" aria-hidden="true">
              ←
            </span>
            Todos os laudos
          </Link>
        </p>

        {/* Faixa de status do laudo (DESIGN §6.1). */}
        <div className={`${styles.faixa} ${styles[`faixa_${faixa.faixa}`]}`} role="status">
          <StatusBadge view={faixa} />
          <span className={styles.faixaHint}>{faixa.hint}</span>
        </div>

        {/* Cabeçalho "trust center" (DESIGN §6.1). */}
        <Card title="O que foi verificado">
          <dl className={styles.trust}>
            <div>
              <dt>Contra a régua</dt>
              <dd className="mono num">
                {cabecalho.reguaVersao}{" "}
                <span className="badge badge-neutral" style={{ marginLeft: 6 }}>
                  <span className="badge-glyph" aria-hidden="true">
                    ◇
                  </span>
                  {REGUA_STATUS} · {cabecalho.reguaSintetica ? "sintética" : "real"}
                </span>
              </dd>
            </div>
            <div>
              <dt>Classe de insumo</dt>
              <dd>{classesLabel || "—"}</dd>
            </div>
            <div>
              <dt>Notas · itens cobertos</dt>
              <dd className="num">
                {cabecalho.notas} nota(s) · {cabecalho.itens} item(ns)
              </dd>
            </div>
            <div>
              <dt>Verificado em</dt>
              <dd className="num">{dataHora(cabecalho.verificadoEm)}</dd>
            </div>
            <div>
              <dt>Por quem (ato privativo)</dt>
              <dd>
                <strong>{cabecalho.contadorNome}</strong>
                {cabecalho.contadorCrc ? (
                  <>
                    {" · "}
                    <span className="mono">CRC {cabecalho.contadorCrc}</span>
                    {cabecalho.contadorCrcSituacao ? (
                      <>
                        {" "}
                        <StatusBadge
                          view={
                            cabecalho.contadorCrcSituacao === "ativo"
                              ? { variant: "success", glyph: "✓", label: "CRC ativo" }
                              : { variant: "warning", glyph: "!", label: `CRC ${cabecalho.contadorCrcSituacao}` }
                          }
                        />
                      </>
                    ) : null}
                  </>
                ) : (
                  <span className="muted"> · sem CRC vinculado</span>
                )}
              </dd>
            </div>
          </dl>
        </Card>

        {/* KPIs. */}
        <div className="grid grid-3" style={{ marginTop: 16 }}>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{resumo.total}</span>
              <span className="kpi-label">Indícios no laudo</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{resumo.disputados}</span>
              <span className="kpi-label">Bloqueiam auto-aprovação</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{brl(resumo.materialidadeTotal)}</span>
              <span className="kpi-label">Materialidade (em revisão)</span>
            </div>
          </Card>
        </div>

        {/* Corpo: divergências por item (DESIGN §6.1). */}
        <Card
          title="Divergências por item"
          sub="Cada linha é um indício. Linha âmbar = bloqueia auto-aprovação (disputado/baixa confiança). Faixa vermelha à esquerda = risco. Confiança calibrada — nunca selo binário 'correto'."
        >
          <Table<LaudoItem>
            columns={columns}
            rows={itens}
            rowKey={(l) => l.id}
            rowClassName={(l) =>
              [l.risco ? "risco" : "", l.disputado ? "revisar" : ""].filter(Boolean).join(" ") ||
              undefined
            }
            empty="Nenhum indício pendente — nada a revisar neste cliente."
          />
        </Card>

        {/* Trilha resumo (REUSA TrilhaTimeline F1.5) + verificador no loop. */}
        <div className={styles.trilhaLayout}>
          <Card title="Trilha de boa-fé (resumo deste laudo)">
            <p className="card-sub">
              Eventos que sustentam este laudo (captura → análise → indício), em ordem
              canônica. Cada nó carimba ator · papel/CRC · quando · classe de insumo · hash
              verificável. Selada (append-only).
            </p>
            {grupos.length > 0 ? (
              <TrilhaTimeline grupos={grupos} />
            ) : (
              <p className="muted">Sem eventos de trilha vinculados a este cliente no seed.</p>
            )}
            <p style={{ marginTop: 12 }}>
              <Link href="/trilha" className="badge badge-info">
                <span className="badge-glyph" aria-hidden="true">
                  ↗
                </span>
                Abrir trilha completa do escritório
              </Link>
            </p>
          </Card>

          <aside className={styles.verifSide}>
            <Card title="Verificação da cadeia">
              <p className="card-sub">
                Integridade técnica recomputada no servidor; clique para reconferir no
                navegador.
              </p>
              <p style={{ margin: "0 0 var(--space-3)" }}>
                {verif.ok ? (
                  <StatusBadge view={{ variant: "success", glyph: "✓", label: "Cadeia íntegra" }} />
                ) : (
                  <StatusBadge
                    view={{ variant: "danger", glyph: "!", label: "Cadeia inconsistente" }}
                  />
                )}{" "}
                <span className="muted">
                  {verif.checked} evento(s); {verif.failures.length} falha(s).
                </span>
              </p>
              <VerificadorCadeia
                inicial={verif}
                verifierVersion={VERIFIER_VERSION}
              />

              <div className={styles.carimbo}>
                <span className="badge badge-neutral" title="Carimbo de tempo formal chega na Fase 4">
                  <span className="badge-glyph" aria-hidden="true">
                    ⧗
                  </span>
                  carimbo de tempo: pendente (ACT ICP-Brasil — Fase 4)
                </span>
              </div>
            </Card>
          </aside>
        </div>

        {/* Rodapé: disclaimer-credencial G6 (DESIGN §6.6). */}
        <Card title="Disclaimer-credencial (G6)">
          <p className="disclaimer">
            <strong>indício</strong> · base {cabecalho.reguaVersao} (
            {cabecalho.reguaSintetica ? "sintética, Fase 1" : "validada"}) · insumo{" "}
            {classesLabel || "XML/OCR"} · verificado {dataHora(cabecalho.verificadoEm)} · por{" "}
            <strong>{cabecalho.contadorNome}</strong>
            {cabecalho.contadorCrc ? (
              <>
                {" "}
                (<span className="mono">CRC {cabecalho.contadorCrc}</span>)
              </>
            ) : null}
            .
          </p>
          <p className="disclaimer" style={{ marginTop: 8 }}>
            Demonstração com dados sintéticos. O Contador aponta <strong>indícios</strong> e
            organiza <strong>evidências técnicas</strong> para <strong>revisão profissional</strong>.
            A ferramenta não substitui contador, tributarista ou advogado, e não promete crédito,
            economia, ausência de multa, apuração correta nem prova jurídica plena. A trilha é uma{" "}
            <strong>evidência técnica verificável</strong> (hash-chain recomputável); o carimbo de
            tempo formal (ACT ICP-Brasil) chega na Fase 4.
          </p>
        </Card>
      </div>
    </>
  );
}
