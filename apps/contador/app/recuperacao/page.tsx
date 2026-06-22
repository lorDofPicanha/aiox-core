/**
 * Overlay RECUPERAÇÃO / RESTITUIÇÃO (módulo #4 — CONTEXT §3, doc 05 §4).
 *
 * Server Component. Demo navegável com base SINTÉTICA. Mostra, por cliente de foco
 * alto-SKU/monofásico (farmácia, posto, mercado), indícios de crédito POTENCIALMENTE
 * recuperável ligados à auditoria, com estimativa retroativa ilustrativa (5 anos),
 * confiança calibrada, estágio do caso, via de recebimento (RT default — D5), split
 * ILUSTRATIVO do success-fee em linha separada (D6), e um botão de gerar dossiê (demo).
 *
 * Relógio: a janela do monofásico PIS/COFINS fecha no sunset de 1º/jan/2027 (CONTEXT §9).
 *
 * G6 (CONTEXT §5 #4; doc 45 §5) — módulo de MAIOR risco de linguagem:
 *   NUNCA "crédito garantido", "recuperação garantida", "apuração correta", "elimina
 *   multa", "dinheiro certo", "prova jurídica plena". SEMPRE "indícios de crédito
 *   POTENCIALMENTE recuperável", "estimativa", "sujeito a análise/revisão do tributarista".
 *   A execução real (PER/DCOMP) chega na Fase 7 e quem assina é o tributarista habilitado.
 *
 * Auto-contido: dados/model em app/recuperacao/. NÃO edita lib/api.ts, lib/, packages/*,
 * componentes, globals.css nem Nav.tsx — só lê os componentes e tokens globais.
 */
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, type Column } from "@/components/Table";
import { TopBar } from "@/components/TopBar";
import { brl } from "@/lib/format";
import { CASOS_RECUPERACAO } from "./recuperacao-data";
import {
  VIA_RECEBIMENTO,
  diasAteSunset,
  type CasoRecuperacao,
  type IndicioRecuperacao,
} from "./recuperacao-model";
import { DossieButton } from "./DossieButton";
import styles from "./recuperacao.module.css";

/** Render sob demanda: a contagem regressiva ao sunset depende da data atual. */
export const dynamic = "force-dynamic";

export default function RecuperacaoPage() {
  const agoraIso = new Date().toISOString();
  const dias = diasAteSunset(agoraIso);

  const casos = CASOS_RECUPERACAO;
  const totalIndicios = casos.reduce((acc, c) => acc + c.indicios.length, 0);
  const estimativaTotal = casos.reduce((acc, c) => acc + c.estimativaTotal, 0);

  const colunas: Column<IndicioRecuperacao>[] = [
    {
      key: "produto",
      header: "Item (ligado à auditoria)",
      render: (i) => (
        <span className={styles.itemCell}>
          <span style={{ fontWeight: 600 }}>{i.produto}</span>
          <span className="muted" style={{ fontSize: 11 }}>
            {i.natureza}
          </span>
        </span>
      ),
    },
    {
      key: "ncm",
      header: "NCM",
      render: (i) => <span className="mono num">{i.ncm}</span>,
    },
    {
      key: "banda",
      header: "Confiança",
      render: (i) => {
        const view = bandaView(i);
        return <StatusBadge view={view} />;
      },
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
      header: "Estimativa retroativa (5 anos)",
      align: "num",
      render: (i) => (
        <span className="num" title="Estimativa ilustrativa — sujeita a análise do tributarista">
          {brl(i.estimativaRetroativo)}
        </span>
      ),
    },
  ];

  return (
    <>
      <TopBar
        title="Recuperação / Restituição"
        sub="Overlay de crédito monofásico PIS/COFINS · ligado à auditoria · indícios sujeitos a análise e revisão do tributarista habilitado"
      />
      <div className="content">
        {/* Subtítulo em português simples. */}
        <p className={styles.lead}>
          Onde a auditoria aponta imposto monofásico pago a mais hoje, os últimos cinco anos
          provavelmente também — abrindo uma janela para tentar recuperar valor retroativo.
          Cada linha é um <strong>indício</strong>, e os valores são <strong>estimativas
          ilustrativas</strong>. Quem analisa e assina o pedido é o tributarista habilitado.
        </p>

        {/* Banner do relógio (urgência real, sem exagero) — sunset 1º/jan/2027. */}
        <div className={styles.relogio} role="status">
          <span className={styles.relogioGlyph} aria-hidden="true">
            ⧗
          </span>
          <div className={styles.relogioTexto}>
            <strong>A janela do monofásico fecha em 2027.</strong> O PIS/COFINS é extinto em
            1º/jan/2027 (Reforma Tributária). Depois disso, resta apenas a janela retroativa
            dos cinco anos anteriores — que também se encerra com o tempo.
          </div>
          <span className={styles.relogioContador}>
            <span className="num">{dias}</span>
            <span className={styles.relogioContadorLabel}>dias até o sunset</span>
          </span>
        </div>

        {/* Selo de honestidade (demo / base sintética / execução real na Fase 7). */}
        <div className="notice" role="status">
          <span aria-hidden="true">◇</span>
          <span>
            <strong>Demo — base sintética / estimativas ilustrativas.</strong> Nada aqui é
            crédito garantido, recuperação garantida nem dinheiro certo — são{" "}
            <strong>indícios de crédito potencialmente recuperável</strong> sujeitos a análise.
            A execução real chega na <strong>Fase 7</strong> (precisa de estrutura jurídica e de
            tributarista habilitado, que é quem assina a PER/DCOMP).
          </span>
        </div>

        {/* KPIs. */}
        <div className="grid grid-3" style={{ marginTop: 16 }}>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{casos.length}</span>
              <span className="kpi-label">Clientes com indícios</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{totalIndicios}</span>
              <span className="kpi-label">Indícios potencialmente recuperáveis</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{brl(estimativaTotal)}</span>
              <span className="kpi-label">Estimativa retroativa (ilustrativa)</span>
            </div>
          </Card>
        </div>

        {/* Um bloco por cliente. */}
        {casos.map((caso) => (
          <CasoCard key={caso.clienteId} caso={caso} colunas={colunas} />
        ))}

        {/* Via de recebimento — RT default (D5). */}
        <Card
          title="Via de recebimento"
          sub="Caminho sugerido para tentar reaver o valor. A escolha final é do tributarista habilitado, caso a caso."
        >
          <div className={styles.vias}>
            {Object.values(VIA_RECEBIMENTO).map((via) => (
              <div
                key={via.via}
                className={`${styles.via} ${via.default ? styles.viaDefault : ""}`}
              >
                <div className={styles.viaHead}>
                  <span className={styles.viaRotulo}>{via.rotulo}</span>
                  <StatusBadge view={via.badge} />
                </div>
                <p className={styles.viaDesc}>{via.descricao}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Disclaimer-credencial G6. */}
        <Card title="Linguagem segura (G6)">
          <p className="disclaimer">
            <strong>indício</strong> · estimativa ilustrativa · base sintética (Fase 1) ·
            sujeito a <strong>análise e revisão do tributarista habilitado</strong>. Esta tela
            não promete crédito garantido, recuperação garantida, dinheiro certo, apuração
            correta, eliminação de multa nem prova jurídica plena. O software organiza o{" "}
            <strong>dossiê de evidências</strong>; quem analisa e assina a PER/DCOMP é o
            tributarista habilitado (execução real na Fase 7).
          </p>
        </Card>
      </div>
    </>
  );
}

/** Bloco de um cliente: cabeçalho, tabela de indícios, split e botão de dossiê. */
function CasoCard({
  caso,
  colunas,
}: {
  caso: CasoRecuperacao;
  colunas: Column<IndicioRecuperacao>[];
}) {
  const { split } = caso;
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

      <Table<IndicioRecuperacao>
        columns={colunas}
        rows={caso.indicios}
        rowKey={(i) => `${caso.clienteId}-${i.ncm}-${i.produto}`}
        rowClassName={(i) => (i.banda === "baixa" ? "risco" : undefined)}
        empty="Sem indícios ligados à auditoria neste cliente."
      />

      <div className={styles.casoRodape}>
        <div className={styles.estimativaBox}>
          <span className={styles.estimativaLabel}>
            Estimativa retroativa do caso (5 anos, ilustrativa)
          </span>
          <span className={`num ${styles.estimativaValor}`}>{brl(caso.estimativaTotal)}</span>
          <span className="muted" style={{ fontSize: 11 }}>
            Via sugerida: {caso.viaSugerida.rotulo}
          </span>
        </div>

        {/* Split ILUSTRATIVO do success-fee — linha separada, NÃO no recorrente (D6). */}
        <div className={styles.splitBox}>
          <span className={styles.splitTitulo}>
            Split ilustrativo do success-fee{" "}
            <span className="muted" style={{ fontWeight: 400 }}>
              (exemplo, não promessa de valor)
            </span>
          </span>
          <table className={styles.splitTabela}>
            <tbody>
              <tr>
                <td>Empresa cliente</td>
                <td className="num muted">{split.empresaPct}%</td>
                <td className="num">{brl(split.empresaValor)}</td>
              </tr>
              <tr>
                <td>Plataforma</td>
                <td className="num muted">{split.plataformaPct}%</td>
                <td className="num">{brl(split.plataformaValor)}</td>
              </tr>
              <tr>
                <td>Contador parceiro</td>
                <td className="num muted">{split.contadorPct}%</td>
                <td className="num">{brl(split.contadorValor)}</td>
              </tr>
            </tbody>
          </table>
          <span className="muted" style={{ fontSize: 11 }}>
            Sobre base hipotética de {brl(split.baseHipotetica)}. Success-fee cobrado à parte,
            fora da mensalidade recorrente.
          </span>
        </div>
      </div>

      <div className={styles.casoAcao}>
        <DossieButton clienteNome={caso.clienteNome} indicios={caso.indicios.length} />
        <span className="muted" style={{ fontSize: 11 }}>
          O software entrega o dossiê de evidências; quem assina a PER/DCOMP é o tributarista
          habilitado (Fase 7).
        </span>
      </div>
    </Card>
  );
}

/** Banda calibrada do indício (mapa local — não importa de lib/status para auto-contenção). */
function bandaView(i: IndicioRecuperacao) {
  switch (i.banda) {
    case "alta":
      return { variant: "success" as const, glyph: "▲", label: "Confiança alta" };
    case "media":
      return { variant: "warning" as const, glyph: "◆", label: "Confiança média" };
    case "baixa":
    default:
      return { variant: "danger" as const, glyph: "▼", label: "Confiança baixa" };
  }
}
