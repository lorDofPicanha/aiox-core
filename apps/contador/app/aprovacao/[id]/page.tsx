/**
 * F1.4 — Tela de Aprovação CRC (cerimônia graduada · DESIGN §6.4 + §6.3).
 *
 * Detalhe de UM indício: produto · NCM · cClassTrib aplicado → referência ·
 * natureza da divergência · confiança calibrada (banda) · base normativa
 * (proveniência) · materialidade (R$, tabular-nums). Mostra honestamente quando
 * é disputado/baixa-confiança ("revisar antes de aprovar · auto-aprovação
 * bloqueada"). O ato de decidir é privativo do contador (CRC ativo) e PESADO —
 * a cerimônia graduada vive em AprovacaoForm (client). Já decidido = read-only
 * com carimbo (quem · CRC · habilitação · quando).
 *
 * G6: indício · base sintética (Fase 1) · revisão humana · trilha verificável —
 * nunca crédito garantido / apuração correta / prova jurídica plena.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { TopBar } from "@/components/TopBar";
import { AprovacaoForm } from "@/components/AprovacaoForm";
import { getApi, ESCRITORIO_ID } from "@/lib/api";
import { brl, pct, dataHora, cnpjMasked } from "@/lib/format";
import { carregarAprovacao } from "@/app/aprovacao/aprovacao-model";
import { MOTIVOS_REJEICAO } from "@/app/aprovacao/decision-config";
import styles from "@/app/aprovacao/aprovacao.module.css";

export default async function AprovacaoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const api = await getApi();
  const d = await carregarAprovacao(api, ESCRITORIO_ID, id);

  if (!d) notFound();

  const insumoGlyph = d.classeInsumo === "xml" ? "◆" : "◇";
  const insumoLabel = d.classeInsumo === "xml" ? "XML (1ª classe)" : "OCR (2ª classe)";
  const motivoLabel = d.motivoCodigo
    ? MOTIVOS_REJEICAO.find((m) => m.codigo === d.motivoCodigo)?.label ?? d.motivoCodigo
    : null;

  return (
    <>
      <TopBar
        title="Aprovação CRC"
        sub="Ato privativo do contador (CRC ativo) — cerimônia graduada, decisão individual."
      />
      <div className="content">
        <div className={styles.breadcrumb}>
          <Link href="/aprovacao">← Pendentes de aprovação</Link>
          <span aria-hidden="true">·</span>
          <Link href="/fila">Fila do dia</Link>
        </div>

        <div className="notice" role="status">
          <span aria-hidden="true">◇</span>
          <span>
            <strong>Base sintética</strong> (Fase 1). Este é um <strong>indício</strong>{" "}
            sujeito a <strong>revisão humana</strong> — nada aqui é crédito garantido,
            apuração correta nem prova jurídica plena.
          </span>
        </div>

        <div className={styles.layout}>
          {/* ---- Coluna principal: os fatos do indício ---- */}
          <div className={styles.main}>
            <Card>
              <div className={styles.detHead}>
                <div>
                  <h2 className="card-title" style={{ marginBottom: 2 }}>
                    {d.produto}
                  </h2>
                  <p className="card-sub" style={{ margin: 0 }}>
                    {d.clienteNome}
                    {d.clienteDocumento ? (
                      <>
                        {" "}
                        · <span className="mono num">{cnpjMasked(d.clienteDocumento)}</span>
                      </>
                    ) : null}
                  </p>
                </div>
                <StatusBadge view={d.statusView} />
              </div>

              {d.bloqueiaAutoAprovacao ? (
                <p className={styles.bloqueio} role="note">
                  <strong>Revisar antes de aprovar.</strong> Confiança baixa / régua em
                  disputa — <strong>auto-aprovação bloqueada</strong> (DESIGN §6.3). O
                  bloqueio fica registrado na trilha; só a revisão humana decide.
                </p>
              ) : null}

              <dl className={styles.factGrid}>
                <div>
                  <dt>NCM</dt>
                  <dd className="mono num">{d.ncm ?? "—"}</dd>
                </div>
                <div>
                  <dt>cClassTrib aplicado → referência</dt>
                  <dd className={styles.cclass}>
                    <span className="mono num">{d.cclasstribInformado ?? "—"}</span>
                    <span aria-hidden="true" className={styles.arrow}>
                      →
                    </span>
                    {d.cclasstribReferencia ? (
                      <span className="mono num">{d.cclasstribReferencia}</span>
                    ) : (
                      <span
                        className="muted"
                        title="Régua em controvérsia — sem referência fixa (G6)"
                      >
                        em disputa
                      </span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Natureza da divergência</dt>
                  <dd>{d.naturezaLabel}</dd>
                </div>
                <div>
                  <dt>Materialidade</dt>
                  <dd className="num" style={{ fontWeight: 700 }}>
                    {brl(d.materialidade)}
                  </dd>
                </div>
                <div>
                  <dt>Nota / insumo de prova</dt>
                  <dd>
                    {d.notaNumero ? (
                      <span className="mono num">nº {d.notaNumero}</span>
                    ) : (
                      "—"
                    )}{" "}
                    <span className="insumo" title={insumoLabel}>
                      <span aria-hidden="true">{insumoGlyph}</span>
                      {insumoLabel}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Competência</dt>
                  <dd className="num">{d.competencia || "—"}</dd>
                </div>
              </dl>

              <p className={styles.descricao}>{d.descricao}</p>
            </Card>

            {/* ---- Confiança calibrada (DESIGN §6.3) ---- */}
            <Card
              title="Confiança calibrada"
              sub="Rótulo acionável + banda — nunca um selo binário 'correto'."
            >
              <div className={styles.confLinha}>
                <StatusBadge view={d.bandaView} />
                <StatusBadge view={d.semaforo} />
                <span className={styles.confPct}>
                  Confiança calibrada:{" "}
                  <span className="num" style={{ fontWeight: 700 }}>
                    {pct(d.confianca)}
                  </span>
                </span>
              </div>
              <p className="muted" style={{ marginBottom: 0, fontSize: 12 }}>
                {d.semaforo.hint}
              </p>
            </Card>

            {/* ---- Base normativa / proveniência (DESIGN §6.1) ---- */}
            <Card
              title="Base normativa (proveniência)"
              sub="Contra qual referência versionada · com qual motor · com que classe de insumo."
            >
              <ul className="list-reset">
                {d.fundamento.length > 0 ? (
                  d.fundamento.map((f, i) => <li key={i}>{f}</li>)
                ) : (
                  <li className="muted">Sem fundamento normativo registrado.</li>
                )}
              </ul>
              <dl className={styles.provDl}>
                <div>
                  <dt>Base de referência</dt>
                  <dd>
                    {d.baseRotulo}{" "}
                    {d.baseSintetica ? (
                      <span className="badge badge-neutral">
                        <span className="badge-glyph" aria-hidden="true">
                          ◇
                        </span>
                        sintética
                      </span>
                    ) : null}
                  </dd>
                </div>
                <div>
                  <dt>Fonte</dt>
                  <dd>{d.baseFonte}</dd>
                </div>
                <div>
                  <dt>Vigente desde</dt>
                  <dd className="num">{d.baseVigenteDesde}</dd>
                </div>
                <div>
                  <dt>Motor</dt>
                  <dd>
                    {d.motorRotulo} · <span className="mono num">v{d.motorVersao}</span>
                  </dd>
                </div>
              </dl>
            </Card>

            <Card title="Linguagem segura (G6)">
              <p className="disclaimer">
                <strong>indício</strong> · base sintética (Fase 1) · insumo{" "}
                {d.classeInsumo.toUpperCase()} · sujeito a <strong>revisão humana</strong>{" "}
                · trilha <strong>verificável</strong>. Aprovar/rejeitar é ato privativo do
                contador com CRC ativo. Esta plataforma não promete crédito garantido,
                apuração correta nem eliminação de multa.
              </p>
            </Card>
          </div>

          {/* ---- Lateral: a cerimônia (ou o carimbo, se já decidido) ---- */}
          <aside className={styles.side}>
            <Card
              title="Decisão do contador"
              sub="Ato privativo · pesado · individual (DESIGN §6.4)."
            >
              {d.decidivel ? (
                <AprovacaoForm
                  apontamentoId={d.id}
                  contador={d.contador}
                  bloqueiaAutoAprovacao={d.bloqueiaAutoAprovacao}
                  produto={d.produto}
                />
              ) : (
                <div
                  className={`${styles.carimbo} ${
                    d.status === "aprovado" || d.status === "regularizado"
                      ? styles.carimboAprovado
                      : styles.carimboRejeitado
                  }`}
                  role="status"
                >
                  <div className={styles.carimboHead}>
                    <span className={styles.carimboGlyph} aria-hidden="true">
                      {d.statusView.glyph}
                    </span>
                    <span>
                      {d.statusView.label} — decisão já registrada na trilha (somente
                      leitura).
                    </span>
                  </div>
                  {d.carimbo ? (
                    <dl className={styles.carimboDl}>
                      <div>
                        <dt>Quem</dt>
                        <dd>{d.carimbo.nome}</dd>
                      </div>
                      <div>
                        <dt>CRC</dt>
                        <dd className="mono num">
                          {d.carimbo.crc}
                          {d.carimbo.crcUf ? `/${d.carimbo.crcUf}` : ""}
                        </dd>
                      </div>
                      <div>
                        <dt>Habilitação</dt>
                        <dd>{d.carimbo.habilitacao}</dd>
                      </div>
                      <div>
                        <dt>Quando</dt>
                        <dd className="num">
                          {d.carimbo.revisadoEm ? dataHora(d.carimbo.revisadoEm) : "—"}
                        </dd>
                      </div>
                      {motivoLabel ? (
                        <div>
                          <dt>Motivo</dt>
                          <dd>{motivoLabel}</dd>
                        </div>
                      ) : null}
                    </dl>
                  ) : (
                    <p className="muted" style={{ fontSize: 12, margin: 0 }}>
                      Revisor não resolvido no seed atual.
                    </p>
                  )}
                  <p className={styles.carimboNota}>
                    Ver o evento na{" "}
                    <Link href="/trilha">trilha de boa-fé</Link> (hash-chain verificável).
                  </p>
                </div>
              )}
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
