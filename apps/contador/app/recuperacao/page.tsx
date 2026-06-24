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
import { TopBar } from "@/components/TopBar";
import { brl } from "@/lib/format";
import { ANO_BASE } from "./recuperacao-data";
import { computarCasosRecuperacao } from "./recuperacao-engine";
import { VIA_RECEBIMENTO, diasAteSunset } from "./recuperacao-model";
import { RecuperacaoExplorer } from "./RecuperacaoExplorer";
import styles from "./recuperacao.module.css";

/** Render sob demanda: a contagem regressiva ao sunset depende da data atual. */
export const dynamic = "force-dynamic";

export default function RecuperacaoPage() {
  const agoraIso = new Date().toISOString();
  const dias = diasAteSunset(agoraIso);

  // MOTOR REAL: o indício de crédito monofásico é COMPUTADO pelo engine (server-side)
  // — parseNFe → paraItensFiscais → detectarMonofasicoLote sobre notas-amostra (seeds/).
  // O parse + motor rodam só no servidor (LGPD); a page recebe o view-model serializável.
  const casos = computarCasosRecuperacao(ANO_BASE);
  const totalIndicios = casos.reduce(
    (acc, c) => acc + c.indicios.filter((i) => i.temIndicioMotor).length,
    0,
  );
  const estimativaTotal = casos.reduce((acc, c) => acc + c.estimativaTotal, 0);

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
          Cada linha é um <strong>indício computado pelo motor fiscal</strong> sobre uma
          nota-amostra (parse do XML + detecção monofásica), com confiança calibrada. A
          projeção retroativa de 5 anos é <strong>estimativa ilustrativa</strong>. Quem analisa
          e assina o pedido é o tributarista habilitado.
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

        {/* Selo de honestidade (motor real sobre notas-amostra / ingestão real na Fase C). */}
        <div className="notice" role="status">
          <span aria-hidden="true">◇</span>
          <span>
            <strong>Motor real sobre notas-amostra.</strong> O indício de crédito monofásico é{" "}
            <strong>computado pelo motor fiscal</strong> sobre notas-amostra sintéticas (parse do
            XML + detecção monofásica). A ingestão real de documentos do cliente é a{" "}
            <strong>Fase C</strong>. Nada aqui é crédito garantido, recuperação garantida nem
            dinheiro certo — são <strong>indícios de crédito potencialmente recuperável</strong>{" "}
            sujeitos a análise. A execução real (PER/DCOMP) chega na <strong>Fase 7</strong> e quem
            assina é o tributarista habilitado.
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
              <span className="kpi-label">Indícios computados pelo motor</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">~{brl(estimativaTotal)}</span>
              <span className="kpi-label">
                Faixa retroativa em 5 anos (ilustrativa, se o volume se mantiver · exclui Simples)
              </span>
            </div>
          </Card>
        </div>

        {/* Um bloco por cliente — corpo interativo (drill-down + dossiê + calculadora). */}
        <RecuperacaoExplorer casos={casos} anoBase={ANO_BASE} />

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
            <strong>indício computado pelo motor</strong> · projeção retroativa ilustrativa ·
            motor real sobre notas-amostra (ingestão real = Fase C) · sujeito a{" "}
            <strong>análise e revisão do tributarista habilitado</strong>. Esta tela não promete
            crédito garantido, recuperação garantida, dinheiro certo, apuração correta,
            eliminação de multa nem prova jurídica plena. O software organiza o{" "}
            <strong>dossiê de evidências</strong>; quem analisa e assina a PER/DCOMP é o
            tributarista habilitado (execução real na Fase 7).
          </p>
        </Card>
      </div>
    </>
  );
}
