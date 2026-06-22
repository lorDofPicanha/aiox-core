"use client";

/**
 * EcacCockpit — cockpit fiscal interativo da carteira (demo navegável, autocontido).
 *
 * Torna o e-CAC FUNCIONAL no teste: o contador clica num cliente e abre o drill-down
 * (caixa postal com "marcar como lida", cada CND com botão "baixar" que gera um preview
 * sintético, situação das declarações), filtra "só pendências" e gera "CND em lote".
 * Os KPIs do topo recalculam conforme ele marca mensagens como lidas.
 *
 * 100% client-side e sem persistência: estado vive aqui (React useState). NÃO chama
 * Server Actions, NÃO toca lib/api.ts nem packages/* — espelha a interatividade do
 * EmissorFluxo do core. Dados sintéticos vêm de ecac-model.ts (co-localizado).
 *
 * G6 (doc 45): o e-CAC só MOSTRA a situação extraída do portal. Nada aqui afirma
 * "crédito garantido", "apuração correta" nem "elimina multa". O preview "baixado" é
 * uma pré-visualização de demonstração — não é certidão oficial. A regularização
 * (parcelar, declarar, contestar) é ato do contador. Consulta real: Fase 7 (SERPRO).
 */

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, type Column } from "@/components/Table";
import { cnpjMasked, dataHora } from "@/lib/format";
import {
  CARTEIRA_ECAC,
  CND_CHAVES,
  CND_LABEL,
  SITUACAO_VIEW,
  ausenciaView,
  caixaView,
  declaracaoView,
  gerarCndLote,
  gerarCndPreview,
  motivosPendencia,
  piorSituacao,
  resumoCarteira,
  temPendencia,
  type CndChave,
  type CndLoteItem,
  type CndPreview,
  type EcacLinha,
} from "./ecac-model";
import styles from "./ecac.module.css";

/** True se a linha tem ALGUMA certidão vencida (faixa esquerda vermelha — DESIGN §6.5). */
function certidoesVencidas(l: EcacLinha): boolean {
  return CND_CHAVES.some((c) => l[c] === "vencida");
}

export function EcacCockpit() {
  const linhas = CARTEIRA_ECAC;

  // --- Estado vivo da tela ---
  // IDs de mensagens marcadas como lidas pelo contador (estende o seed `lida`).
  const [lidasExtra, setLidasExtra] = useState<Set<string>>(new Set());
  // Cliente aberto no drill-down (null = nenhum).
  const [abertoId, setAbertoId] = useState<string | null>(null);
  // Filtro "só pendências".
  const [soPendencias, setSoPendencias] = useState(false);
  // Preview de certidão "baixada" no drill-down (uma por vez).
  const [preview, setPreview] = useState<CndPreview | null>(null);
  // Resultado da geração de CND em lote (null = não gerado).
  const [lote, setLote] = useState<CndLoteItem[] | null>(null);

  // Nº de mensagens não lidas por cliente, no estado VIVO (seed + marcações da tela).
  const naoLidasPorCliente = useMemo(() => {
    const map: Record<string, number> = {};
    for (const l of linhas) {
      map[l.clienteId] = l.mensagens.filter(
        (m) => !m.lida && !lidasExtra.has(m.id),
      ).length;
    }
    return map;
  }, [linhas, lidasExtra]);

  // KPIs recalculam conforme o contador marca mensagens como lidas.
  const resumo = useMemo(
    () => resumoCarteira(linhas, naoLidasPorCliente),
    [linhas, naoLidasPorCliente],
  );

  // Linhas exibidas na tabela (filtro "só pendências" usa o estado vivo).
  const linhasView = useMemo(
    () =>
      soPendencias
        ? linhas.filter((l) => temPendencia(l, naoLidasPorCliente[l.clienteId]))
        : linhas,
    [linhas, soPendencias, naoLidasPorCliente],
  );

  const aberto = linhas.find((l) => l.clienteId === abertoId) ?? null;

  function abrirCliente(id: string) {
    setAbertoId((atual) => (atual === id ? null : id));
    setPreview(null);
  }

  function marcarLida(msgId: string) {
    setLidasExtra((s) => {
      const next = new Set(s);
      next.add(msgId);
      return next;
    });
  }

  function marcarTodasLidas(l: EcacLinha) {
    setLidasExtra((s) => {
      const next = new Set(s);
      for (const m of l.mensagens) next.add(m.id);
      return next;
    });
  }

  function baixarCnd(l: EcacLinha, chave: CndChave) {
    setPreview(gerarCndPreview(l, chave));
  }

  const columns: Column<EcacLinha>[] = [
    {
      key: "cliente",
      header: "Cliente",
      render: (l) => (
        <span className={styles.cli}>
          <span className={styles.cliNome}>{l.clienteNome}</span>
          <span className={`${styles.cliDoc} mono`}>{cnpjMasked(l.documento)}</span>
        </span>
      ),
    },
    {
      key: "caixa",
      header: "Caixa postal",
      render: (l) => <StatusBadge view={caixaView(naoLidasPorCliente[l.clienteId])} />,
    },
    {
      key: "federal",
      header: "CND Federal / PGFN",
      render: (l) => <StatusBadge view={SITUACAO_VIEW[l.cndFederal]} />,
    },
    {
      key: "estadual",
      header: "CND Estadual",
      render: (l) => <StatusBadge view={SITUACAO_VIEW[l.cndEstadual]} />,
    },
    {
      key: "trabalhista",
      header: "CND Trabalhista",
      render: (l) => <StatusBadge view={SITUACAO_VIEW[l.cndTrabalhista]} />,
    },
    {
      key: "fgts",
      header: "FGTS",
      render: (l) => <StatusBadge view={SITUACAO_VIEW[l.fgts]} />,
    },
    {
      key: "ausencia",
      header: "Ausência de declaração",
      render: (l) => <StatusBadge view={ausenciaView(l.ausenciaDeclaracao)} />,
    },
    {
      key: "acao",
      header: "",
      render: (l) => (
        <button
          type="button"
          className={styles.btnAbrir}
          onClick={() => abrirCliente(l.clienteId)}
          aria-expanded={abertoId === l.clienteId}
        >
          {abertoId === l.clienteId ? "Fechar" : "Abrir"}
          <span aria-hidden="true">{abertoId === l.clienteId ? " ▲" : " ▾"}</span>
        </button>
      ),
    },
  ];

  return (
    <>
      {/* KPIs da dor (recalculam com "marcar como lida"). */}
      <div className="grid grid-3" style={{ marginTop: 16 }}>
        <Card>
          <div className="kpi">
            <span className="kpi-value num">{resumo.comCaixaNaoLida}</span>
            <span className="kpi-label">Com caixa postal não lida</span>
          </div>
        </Card>
        <Card>
          <div className="kpi">
            <span className="kpi-value num">{resumo.comCndIrregular}</span>
            <span className="kpi-label">Com CND vencida / pendente</span>
          </div>
        </Card>
        <Card>
          <div className="kpi">
            <span className="kpi-value num">{resumo.comAusenciaDeclaracao}</span>
            <span className="kpi-label">Com ausência de declaração</span>
          </div>
        </Card>
      </div>

      {/* Painel da carteira + filtro "só pendências" + drill-down. */}
      <Card
        title="Painel da carteira"
        sub="Uma linha por cliente. Clique em Abrir para ver caixa postal, certidões e declarações. Linha vermelha à esquerda = alguma certidão vencida."
      >
        <div className={styles.toolbar}>
          <label className={styles.filtro}>
            <input
              type="checkbox"
              checked={soPendencias}
              onChange={(e) => setSoPendencias(e.target.checked)}
            />
            <span>
              Só pendências{" "}
              <span className="muted" style={{ fontSize: 11 }}>
                ({linhas.filter((l) => temPendencia(l, naoLidasPorCliente[l.clienteId])).length} de{" "}
                {linhas.length})
              </span>
            </span>
          </label>
        </div>

        <Table<EcacLinha>
          columns={columns}
          rows={linhasView}
          rowKey={(l) => l.clienteId}
          rowClassName={(l) =>
            certidoesVencidas(l)
              ? "risco"
              : temPendencia(l, naoLidasPorCliente[l.clienteId])
                ? "revisar"
                : undefined
          }
          empty={
            soPendencias
              ? "Nenhuma pendência na carteira — todos os clientes regulares."
              : "Nenhum cliente com procuração ativa no e-CAC."
          }
        />

        {/* Drill-down do cliente aberto. */}
        {aberto ? (
          <ClienteDetalhe
            l={aberto}
            naoLidas={naoLidasPorCliente[aberto.clienteId]}
            estaLida={(id) =>
              aberto.mensagens.find((m) => m.id === id)?.lida || lidasExtra.has(id)
            }
            onMarcarLida={marcarLida}
            onMarcarTodas={() => marcarTodasLidas(aberto)}
            preview={preview}
            onBaixar={(chave) => baixarCnd(aberto, chave)}
            onFecharPreview={() => setPreview(null)}
          />
        ) : null}
      </Card>

      {/* Ação em lote — agora FUNCIONAL (resultado sintético). */}
      <Card title="Certidões em lote">
        <div className={styles.acaoBar}>
          <button
            type="button"
            className={styles.btnLote}
            onClick={() => setLote(gerarCndLote(linhas))}
          >
            <span aria-hidden="true">⊞</span>
            Gerar CND em lote
          </button>
          <span className={styles.acaoNota}>
            demo — gera uma certidão consolidada por cliente de uma vez. O resultado é
            sintético; a consulta/emissão real (Integra Contador) chega na Fase 7.
          </span>
        </div>

        {lote ? (
          <div className={styles.loteResultado} role="status" aria-live="polite">
            <p className={styles.loteHead}>
              <strong>{lote.length} certidão(ões) geradas</strong>{" "}
              <span className="muted">— pré-visualização sintética por cliente.</span>
            </p>
            <ul className={styles.loteList}>
              {lote.map((it) => (
                <li key={it.clienteId} className={styles.loteRow}>
                  <span className={styles.loteCli}>
                    <strong>{it.clienteNome}</strong>
                    <span className="mono muted" style={{ fontSize: 11 }}>
                      {cnpjMasked(it.documento)}
                    </span>
                  </span>
                  <span className={styles.loteTipo}>{it.tipoCertidao}</span>
                  <span className="mono muted" style={{ fontSize: 11 }}>
                    {it.codigoControle}
                  </span>
                  <StatusBadge view={SITUACAO_VIEW[it.situacao]} />
                </li>
              ))}
            </ul>
            <p className={styles.loteNota}>
              Pré-visualização de demonstração — nenhuma certidão oficial foi emitida. O
              resultado reflete a situação sintética; a ação (parcelar, regularizar) segue
              sendo do contador.
            </p>
          </div>
        ) : null}
      </Card>
    </>
  );
}

/* ============================================================================
   Drill-down de um cliente: caixa postal · certidões · declarações
   ============================================================================ */
function ClienteDetalhe({
  l,
  naoLidas,
  estaLida,
  onMarcarLida,
  onMarcarTodas,
  preview,
  onBaixar,
  onFecharPreview,
}: {
  l: EcacLinha;
  naoLidas: number;
  estaLida: (id: string) => boolean;
  onMarcarLida: (id: string) => void;
  onMarcarTodas: () => void;
  preview: CndPreview | null;
  onBaixar: (chave: CndChave) => void;
  onFecharPreview: () => void;
}) {
  const pior = piorSituacao(l);
  const motivos = motivosPendencia(l, naoLidas);

  return (
    <div className={styles.detalhe} role="region" aria-label={`Detalhe de ${l.clienteNome}`}>
      <div className={styles.detalheHead}>
        <span className={`${styles.pendDot} ${styles[`pendDot_${pior}`]}`} aria-hidden="true" />
        <div className={styles.detalheTitulo}>
          <strong>{l.clienteNome}</strong>
          <span className="mono muted" style={{ fontSize: 11 }}>
            {cnpjMasked(l.documento)} · {l.municipio}
          </span>
        </div>
        <span className={styles.detalheConsulta}>
          situação lida em {dataHora(l.consultadoEm)}
        </span>
      </div>

      {motivos.length > 0 ? (
        <ul className={styles.pendMotivos} style={{ marginBottom: 8 }}>
          {motivos.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      ) : (
        <p className="muted" style={{ marginTop: 0 }}>
          Sem pendências no estado atual — cliente regular.
        </p>
      )}

      <div className={styles.detalheGrid}>
        {/* ---- Caixa postal ---- */}
        <section className={styles.bloco}>
          <header className={styles.blocoHead}>
            <h3 className={styles.blocoTitulo}>
              Caixa postal{" "}
              <StatusBadge view={caixaView(naoLidas)} />
            </h3>
            <button
              type="button"
              className={styles.btnMini}
              onClick={onMarcarTodas}
              disabled={naoLidas === 0}
            >
              Marcar todas como lidas
            </button>
          </header>
          {l.mensagens.length === 0 ? (
            <p className="muted">Sem mensagens na caixa postal.</p>
          ) : (
            <ul className={styles.msgList}>
              {l.mensagens.map((m) => {
                const lida = estaLida(m.id);
                return (
                  <li key={m.id} className={`${styles.msgRow} ${lida ? styles.msgLida : ""}`}>
                    <span
                      className={`${styles.msgDot} ${lida ? styles.msgDotLida : ""}`}
                      aria-hidden="true"
                    />
                    <span className={styles.msgMain}>
                      <span className={styles.msgAssunto}>{m.assunto}</span>
                      <span className={styles.msgMeta}>
                        {m.remetente} · {dataHora(m.recebidaEm)}
                      </span>
                    </span>
                    {lida ? (
                      <span className={styles.msgEstado}>lida</span>
                    ) : (
                      <button
                        type="button"
                        className={styles.btnMini}
                        onClick={() => onMarcarLida(m.id)}
                      >
                        Marcar como lida
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ---- Certidões (CND) com "baixar" ---- */}
        <section className={styles.bloco}>
          <header className={styles.blocoHead}>
            <h3 className={styles.blocoTitulo}>Certidões (CND)</h3>
          </header>
          <ul className={styles.cndList}>
            {CND_CHAVES.map((chave) => {
              const det = l.detalhesCnd[chave];
              return (
                <li key={chave} className={styles.cndRow}>
                  <span className={styles.cndNome}>{CND_LABEL[chave]}</span>
                  <StatusBadge view={SITUACAO_VIEW[det.situacao]} />
                  <button
                    type="button"
                    className={styles.btnMini}
                    onClick={() => onBaixar(chave)}
                  >
                    ▤ Baixar
                  </button>
                </li>
              );
            })}
          </ul>

          {preview ? (
            <div className={styles.cndPreview} role="status" aria-live="polite">
              <div className={styles.cndPreviewHead}>
                <strong>{preview.titulo}</strong>
                <button
                  type="button"
                  className={styles.btnMini}
                  onClick={onFecharPreview}
                  aria-label="Fechar pré-visualização"
                >
                  ✕
                </button>
              </div>
              <dl className={styles.cndPreviewDl}>
                <div>
                  <dt>Órgão</dt>
                  <dd>{preview.orgao}</dd>
                </div>
                <div>
                  <dt>Contribuinte</dt>
                  <dd>{preview.cliente}</dd>
                </div>
                <div>
                  <dt>CNPJ</dt>
                  <dd className="mono">{cnpjMasked(preview.documento)}</dd>
                </div>
                <div>
                  <dt>Município</dt>
                  <dd>{preview.municipio}</dd>
                </div>
                <div>
                  <dt>Tipo de certidão</dt>
                  <dd>
                    {preview.tipoCertidao} <StatusBadge view={SITUACAO_VIEW[preview.situacao]} />
                  </dd>
                </div>
                <div>
                  <dt>Código de controle</dt>
                  <dd className="mono num">{preview.codigoControle}</dd>
                </div>
              </dl>
              <p className={styles.cndPreviewObs}>{preview.observacao}</p>
              <p className={styles.cndPreviewNota}>
                Pré-visualização de demonstração — não é certidão oficial e não foi emitida
                por nenhum órgão. Mostra a situação sintética extraída; a regularização é ato
                do contador. Emissão real: Fase 7 (Integra Contador / SERPRO).
              </p>
            </div>
          ) : null}
        </section>

        {/* ---- Declarações / obrigações acessórias ---- */}
        <section className={styles.bloco}>
          <header className={styles.blocoHead}>
            <h3 className={styles.blocoTitulo}>Declarações</h3>
          </header>
          {l.declaracoes.length === 0 ? (
            <p className="muted">Sem declarações na base sintética.</p>
          ) : (
            <ul className={styles.declList}>
              {l.declaracoes.map((d) => (
                <li key={d.id} className={styles.declRow}>
                  <span className={styles.declNome}>
                    {d.nome}{" "}
                    <span className="mono muted" style={{ fontSize: 11 }}>
                      {d.competencia}
                    </span>
                  </span>
                  <StatusBadge view={declaracaoView(d.situacao)} />
                  <span className={styles.declNota}>{d.nota}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
