"use client";

/**
 * RecuperacaoExplorer — corpo interativo do overlay RECUPERAÇÃO (demo navegável).
 *
 * Recebe os casos SINTÉTICOS já montados no Server Component (page.tsx) e adiciona
 * a interatividade do módulo:
 *   1. DRILL-DOWN por cliente: clicar no caso abre o detalhe — quebra ANO A ANO
 *      (5 anos) da estimativa de crédito monofásico, lista de evidências ligadas à
 *      auditoria e confiança calibrada por item/período.
 *   2. DOSSIÊ de evidências: "gerar dossiê" produz um PREVIEW ESTRUTURADO (cabeçalho
 *      do cliente, período, itens, estimativa, base normativa e a ressalva de que o
 *      tributarista habilitado é quem assina a PER/DCOMP — Fase 7).
 *   3. DISTRIBUIÇÃO DO ÊXITO (RepasseSplit): split multi-parte em VALORES ABSOLUTOS
 *      (empresa→contador→indicador→plataforma) com % como legenda — ajustar o valor
 *      recuperado recalcula tudo (rotulado "estimativa ilustrativa"). Ver repasse-model.ts.
 *
 * 100% client-side, sem persistência: é demonstração com base sintética. Reusa apenas
 * componentes/tokens globais (Card/StatusBadge/Table) + o CSS module local. Não toca
 * lib/api.ts, packages/* nem outros módulos (CONSTRAINT autocontido). G6: nenhuma
 * promessa de resultado — só indícios/estimativas sujeitos a análise do tributarista.
 */

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, type Column } from "@/components/Table";
import { brl } from "@/lib/format";
import {
  BANDA_RECUPERACAO,
  formatarFaixaProjecao,
  montarDossie,
  rotuloRegime,
  type AnoEstimativa,
  type CasoRecuperacao,
  type IndicioRecuperacao,
} from "./recuperacao-model";
import { RepasseSplit } from "./RepasseSplit";
import styles from "./recuperacao.module.css";

/** Banda calibrada do indício (mapa local — auto-contido, espelha BANDA_RECUPERACAO). */
function bandaView(banda: IndicioRecuperacao["banda"]) {
  return BANDA_RECUPERACAO[banda];
}

/** Formata a confiança calibrada do motor (0..1) como percentual pt-BR (ex.: "82%"). */
function pctConfianca(confianca: number): string {
  return `${Math.round(confianca * 100)}%`;
}

/**
 * Faixa retroativa ILUSTRATIVA (🟡-1): em vez de um número-herói cravado, exibe a FAIXA
 * com a PREMISSA explícita ("~R$11k/ano · ~R$55k em 5 anos, se o volume se mantiver").
 * Regime-aware (🟡-2): no Simples mostra "requer apuração (segregação de receita)";
 * onde o motor abstém, "— sem indício". Nunca ancora valor recuperável garantido (G6).
 */
function FaixaEstimativa({ indicio }: { indicio: IndicioRecuperacao }) {
  const proj = indicio.proveniencia;
  // Sem projeção (retrocompat) → cai no comportamento de abstenção.
  if (!indicio.projecao) {
    return (
      <span className="muted" style={{ fontSize: 11 }} title="Sem projeção disponível">
        — sem indício
      </span>
    );
  }

  // Motor abstém (sem indício monofásico) → sem crédito a projetar.
  if (!indicio.temIndicioMotor) {
    return (
      <span
        className="muted"
        style={{ fontSize: 11 }}
        title="Motor não identificou indício monofásico — sem crédito a projetar"
      >
        — sem indício
      </span>
    );
  }

  // Simples Nacional → crédito por segregação de receita: requer apuração, sem número.
  if (indicio.projecao.requerApuracao) {
    return (
      <span
        className={styles.requerApuracao}
        title="Simples Nacional: o crédito monofásico é por segregação de receita, não por alíquota federal — requer apuração do tributarista"
      >
        — requer apuração (Simples: segregação de receita)
      </span>
    );
  }

  // Faixa com premissa explícita (não número-herói cravado).
  return (
    <span
      className={styles.faixaEstimativa}
      title={`Projeção ilustrativa (${rotuloRegime(indicio.projecao.regime)}) sobre o valor que o motor leu da nota-amostra — sujeita a análise do tributarista`}
    >
      {formatarFaixaProjecao(indicio.projecao)}
    </span>
  );
}

export function RecuperacaoExplorer({
  casos,
  anoBase,
}: {
  casos: CasoRecuperacao[];
  anoBase: number;
}) {
  return (
    <div className={styles.explorer}>
      {casos.map((caso) => (
        <CasoCard key={caso.clienteId} caso={caso} anoBase={anoBase} />
      ))}
    </div>
  );
}

/** Bloco de um cliente: cabeçalho, tabela de indícios, drill-down, split e dossiê. */
function CasoCard({ caso, anoBase }: { caso: CasoRecuperacao; anoBase: number }) {
  // Indício aberto no drill-down (NCM+produto como chave; null = fechado).
  const [aberto, setAberto] = useState<string | null>(null);
  // Estado do dossiê: idle → gerando → pronto (preview estruturado).
  const [dossie, setDossie] = useState<"idle" | "gerando" | "pronto">("idle");

  const dossiePreview = useMemo(
    () => montarDossie(caso, anoBase),
    [caso, anoBase],
  );

  function toggle(chave: string) {
    setAberto((atual) => (atual === chave ? null : chave));
  }

  function gerarDossie() {
    if (dossie === "gerando") return;
    setDossie("gerando");
    // Demo: simula a montagem do dossiê (synthetic). Nenhuma chamada real.
    setTimeout(() => setDossie("pronto"), 650);
  }

  const colunas: Column<IndicioRecuperacao>[] = [
    {
      key: "produto",
      header: "Item (ligado à auditoria)",
      render: (i) => {
        const chave = `${i.ncm}-${i.produto}`;
        const expandido = aberto === chave;
        return (
          <button
            type="button"
            className={styles.itemBtn}
            aria-expanded={expandido}
            onClick={() => toggle(chave)}
          >
            <span aria-hidden="true" className={styles.itemCaret}>
              {expandido ? "▾" : "▸"}
            </span>
            <span className={styles.itemCell}>
              <span style={{ fontWeight: 600 }}>{i.produto}</span>
              <span className="muted" style={{ fontSize: 11 }}>
                {i.natureza}
              </span>
            </span>
          </button>
        );
      },
    },
    {
      key: "ncm",
      header: "NCM",
      render: (i) => <span className="mono num">{i.ncm}</span>,
    },
    {
      key: "banda",
      header: "Confiança (motor)",
      render: (i) => (
        <div className={styles.confCell}>
          <StatusBadge view={bandaView(i.banda)} />
          {i.proveniencia?.fonte === "motor" && i.temIndicioMotor ? (
            <span
              className="muted mono num"
              style={{ fontSize: 11 }}
              title="Confiança calibrada computada pelo motor (0–1), sujeita a revisão"
            >
              {pctConfianca(i.proveniencia.confianca)}
            </span>
          ) : null}
          {i.proveniencia?.bloqueiaAutoAprovacao ? (
            <span className={styles.revisarTag} title="Confiança abaixo do limiar — bloqueia auto-aprovação">
              revisar (CRC)
            </span>
          ) : null}
        </div>
      ),
    },
    {
      key: "fundamento",
      header: "Base normativa",
      render: (i) => (
        <span className="muted" style={{ fontSize: 11 }}>
          {i.fundamento}
        </span>
      ),
    },
    {
      key: "estimativa",
      header: "Faixa retroativa (ilustrativa)",
      align: "num",
      render: (i) => <FaixaEstimativa indicio={i} />,
    },
  ];

  return (
    <Card>
      <div className={styles.casoHead}>
        <div className={styles.casoIdent}>
          <h2 className={styles.casoNome}>{caso.clienteNome}</h2>
          <span className="muted" style={{ fontSize: 12 }}>
            {caso.segmento}
          </span>
        </div>
        <div className={styles.casoBadges}>
          <StatusBadge view={caso.estagio} />
          <StatusBadge view={caso.bandaCaso} />
        </div>
      </div>
      <p className={styles.casoHint}>{caso.estagio.hint}</p>
      <p className={styles.drillHint}>
        <span aria-hidden="true">▸</span> Clique em um item para abrir o detalhe do caso
        (quebra ano a ano e evidências).
      </p>

      <Table<IndicioRecuperacao>
        columns={colunas}
        rows={caso.indicios}
        rowKey={(i) => `${caso.clienteId}-${i.ncm}-${i.produto}`}
        rowClassName={(i) => {
          const chave = `${i.ncm}-${i.produto}`;
          return [i.banda === "baixa" ? "risco" : "", aberto === chave ? styles.linhaAberta : ""]
            .filter(Boolean)
            .join(" ") || undefined;
        }}
        empty="Sem indícios ligados à auditoria neste cliente."
      />

      {/* Drill-down do indício aberto. */}
      {caso.indicios.map((i) => {
        const chave = `${i.ncm}-${i.produto}`;
        if (aberto !== chave) return null;
        return <DrillDown key={chave} indicio={i} />;
      })}

      <div className={styles.casoRodape}>
        <div className={styles.estimativaBox}>
          <span className={styles.estimativaLabel}>
            Faixa retroativa do caso (5 anos, ilustrativa)
          </span>
          {caso.regime === "simples" ? (
            <span
              className={styles.requerApuracao}
              title="Simples Nacional: crédito por segregação de receita — requer apuração do tributarista"
            >
              — requer apuração (Simples: segregação de receita)
            </span>
          ) : (
            <span
              className={`num ${styles.estimativaValor}`}
              title="Projeção ilustrativa — não é valor recuperável garantido"
            >
              ~{brl(caso.estimativaTotal)} em 5 anos
            </span>
          )}
          <span className="muted" style={{ fontSize: 11 }}>
            {rotuloRegime(caso.regime)} · ilustrativa, se o volume se mantiver · via sugerida:{" "}
            {caso.viaSugerida.rotulo}
          </span>
        </div>

        {/* Distribuição do êxito em valores absolutos (split multi-parte).
            No Simples a base é R$0 (sem projeção) — o split fica zerado coerentemente. */}
        <RepasseSplit baseInicial={caso.estimativaTotal} />
      </div>

      <div className={styles.casoAcao}>
        <div className={styles.dossie}>
          <button
            type="button"
            className={styles.dossieBtn}
            onClick={gerarDossie}
            disabled={dossie === "gerando"}
          >
            <span aria-hidden="true">▤</span>
            {dossie === "gerando"
              ? "Montando dossiê…"
              : dossie === "pronto"
                ? "Atualizar dossiê de evidências (demo)"
                : "Gerar dossiê de evidências (demo)"}
          </button>
          <span className="muted" style={{ fontSize: 11 }}>
            O software entrega o dossiê de evidências; quem analisa e assina a PER/DCOMP é o
            tributarista habilitado (Fase 7).
          </span>
        </div>
      </div>

      {/* Preview estruturado do dossiê. */}
      {dossie === "pronto" ? <DossiePainel preview={dossiePreview} /> : null}
    </Card>
  );
}

/** Detalhe expandido de um indício: quebra ano a ano + evidências técnicas. */
function DrillDown({ indicio }: { indicio: IndicioRecuperacao }) {
  const colunasAno: Column<AnoEstimativa>[] = [
    {
      key: "ano",
      header: "Ano",
      render: (a) => <span className="num" style={{ fontWeight: 600 }}>{a.ano}</span>,
    },
    {
      key: "notas",
      header: "Notas/itens",
      align: "num",
      render: (a) => <span className="num">{a.notas}</span>,
    },
    {
      key: "banda",
      header: "Confiança do período",
      render: (a) => <StatusBadge view={BANDA_RECUPERACAO[a.banda]} />,
    },
    {
      key: "estimativa",
      header: "Estimativa do ano (ilustrativa)",
      align: "num",
      render: (a) => (
        <span className="num" title="Estimativa ilustrativa — sujeita a análise do tributarista">
          {brl(a.estimativa)}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.drill} role="region" aria-label={`Detalhe de ${indicio.produto}`}>
      <div className={styles.drillGrid}>
        <div className={styles.drillCol}>
          <h3 className={styles.drillTitulo}>Quebra ano a ano (5 anos)</h3>
          <p className={styles.drillSub}>
            Como a estimativa retroativa se distribui pelos últimos cinco anos. Anos mais antigos
            costumam ter menos evidência disponível — por isso a confiança cai. Valores são{" "}
            <strong>estimativas ilustrativas</strong>, sujeitas a análise do tributarista.
          </p>
          <Table<AnoEstimativa>
            columns={colunasAno}
            rows={indicio.porAno}
            rowKey={(a) => String(a.ano)}
            rowClassName={(a) => (a.banda === "baixa" ? "risco" : undefined)}
            empty="Sem quebra anual disponível."
          />
        </div>

        <div className={styles.drillCol}>
          <h3 className={styles.drillTitulo}>Evidências ligadas à auditoria</h3>
          <p className={styles.drillSub}>
            O que o dossiê reúne para sustentar este indício. Cada evidência tem confiança própria —
            nunca um selo binário de prova.
          </p>
          <ul className={styles.evidenciaLista}>
            {indicio.evidencias.map((e, k) => (
              <li key={k} className={styles.evidenciaItem}>
                <div className={styles.evidenciaHead}>
                  <span className={styles.evidenciaRotulo}>{e.rotulo}</span>
                  <StatusBadge view={BANDA_RECUPERACAO[e.banda]} />
                </div>
                <p className={styles.evidenciaDetalhe}>{e.detalhe}</p>
              </li>
            ))}
          </ul>
          <p className={styles.drillFundamento}>
            <strong>Base normativa:</strong> {indicio.fundamento}
          </p>
          {indicio.proveniencia ? (
            <p className={styles.drillProveniencia}>
              <strong>Proveniência (motor real):</strong>{" "}
              {indicio.proveniencia.fonte === "motor"
                ? `indício ${indicio.temIndicioMotor ? "computado" : "avaliado (sem crédito)"} pelo motor fiscal sobre a nota-amostra `
                : "derivação ilustrativa "}
              <span className="mono" style={{ fontSize: 11 }}>
                {indicio.proveniencia.amostra}
              </span>{" "}
              · classe do insumo:{" "}
              {indicio.proveniencia.classeInsumo === "xml"
                ? "XML estruturado"
                : "documento extraído (OCR)"}
              {indicio.proveniencia.assinado ? " (com assinatura presente)" : " (sem assinatura)"}
              {indicio.temIndicioMotor
                ? ` · confiança calibrada ${pctConfianca(indicio.proveniencia.confianca)} · valor lido na nota ${brl(indicio.proveniencia.valorEnvolvidoBase)}`
                : ""}
              {indicio.proveniencia.bloqueiaAutoAprovacao
                ? " · baixa confiança bloqueia auto-aprovação → revisão humana (CRC)"
                : ""}
              . Sujeito a análise e revisão do tributarista habilitado.
            </p>
          ) : null}
          {indicio.projecao ? (
            <p className={styles.drillProveniencia}>
              <strong>Projeção (regime-aware):</strong> {rotuloRegime(indicio.projecao.regime)}
              {indicio.projecao.requerApuracao
                ? " — no Simples o crédito monofásico é por SEGREGAÇÃO DE RECEITA, não por alíquota federal; requer apuração do tributarista (não projetamos número)."
                : ` — projeção ${formatarFaixaProjecao(indicio.projecao)}. A premissa é a recorrência do volume; a janela e a apuração reais só o tributarista habilitado afere.`}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Painel do preview ESTRUTURADO do dossiê de evidências (demo). */
function DossiePainel({ preview }: { preview: ReturnType<typeof montarDossie> }) {
  const { cabecalho, itens, estimativaTotal, basesNormativas, ressalva } = preview;
  return (
    <div className={styles.dossiePainel} role="status" aria-live="polite">
      <div className={styles.dossieHead}>
        <span className={styles.dossieGlyph} aria-hidden="true">
          ▤
        </span>
        <div>
          <strong>Dossiê de evidências — preview (demonstração).</strong>
          <p className={styles.dossieSub}>
            Organização estruturada das evidências para revisão profissional. Base sintética; não foi
            protocolado a nenhum fisco.
          </p>
        </div>
      </div>

      <dl className={styles.dossieDl}>
        <div>
          <dt>Cliente</dt>
          <dd>{cabecalho.clienteNome}</dd>
        </div>
        <div>
          <dt>Segmento</dt>
          <dd>{cabecalho.segmento}</dd>
        </div>
        <div>
          <dt>Período retroativo</dt>
          <dd className="num">{cabecalho.periodo}</dd>
        </div>
        <div>
          <dt>Via de recebimento sugerida</dt>
          <dd>{cabecalho.viaSugerida}</dd>
        </div>
        <div>
          <dt>Estágio do caso</dt>
          <dd>{cabecalho.estagioLabel}</dd>
        </div>
        <div>
          <dt>Estimativa retroativa (ilustrativa)</dt>
          <dd className="num" style={{ fontWeight: 700 }}>
            {brl(estimativaTotal)}
          </dd>
        </div>
      </dl>

      <h4 className={styles.dossieSecao}>Itens do dossiê (indícios)</h4>
      <div className="table-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Item</th>
              <th>NCM</th>
              <th>Confiança</th>
              <th>Evidências</th>
              <th className="num">Estimativa (ilustrativa)</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((it, k) => (
              <tr key={k}>
                <td>{it.produto}</td>
                <td className="mono num">{it.ncm}</td>
                <td>{it.bandaLabel}</td>
                <td className="num">{it.evidencias}</td>
                <td className="num">{brl(it.estimativa)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 className={styles.dossieSecao}>Base normativa citada (sujeita a revisão)</h4>
      <ul className={styles.dossieBases}>
        {basesNormativas.map((b, k) => (
          <li key={k}>{b}</li>
        ))}
      </ul>

      <p className={styles.dossieRessalva}>
        <span aria-hidden="true">◇</span> {ressalva}
      </p>
    </div>
  );
}
