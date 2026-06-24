/**
 * Módulo PARCELAMENTOS — alerta de rescisão iminente (whitespace #1 da pesquisa, doc 55).
 *
 * Server Component. Demo navegável com base SINTÉTICA. Mostra a carteira de parcelamentos
 * do escritório com semáforo de risco de rescisão, KPIs (ativos, em atenção, em risco,
 * desconto sob risco) e DESTAQUE para os parcelamentos em risco de rescisão iminente — o
 * diferencial que nenhum concorrente cravou: "este parcelamento pode ser cancelado em N
 * parcelas; o cliente perde o desconto" + a janela de salvamento de ~30 dias.
 *
 * Regra modelada (doc 55 §A): Simples Nacional (PARCSN/PARCMEI) é rescindido com 3 parcelas
 * em atraso (consecutivas ou não). PGFN/estadual ficam em "monitoramento manual" (sem API,
 * regra fragmentada) — sem inferência automática de rescisão (doc 55 §E).
 *
 * G6 (CONTEXT §5 #4; doc 45): a plataforma SINALIZA o indício de risco; a ação (regularizar)
 * é DECISÃO DO CONTADOR — não automatiza nem promete evitar o cancelamento ou garantir o
 * desconto. Linguagem de boa-fé: "indício de risco de rescisão", "sugerimos revisar".
 *
 * Auto-contido: dados/model em app/parcelamentos/. NÃO edita Nav.tsx, layout.tsx,
 * globals.css, lib/api.ts nem outros módulos — só lê os componentes e tokens globais.
 */
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { TopBar } from "@/components/TopBar";
import { brl } from "@/lib/format";
import { getParcelamentosSinteticos } from "./parcelamentos-data";
import {
  JANELA_SALVAMENTO_DIAS,
  LIMITE_RESCISAO_SN,
  classificarCarteira,
  ehRisco,
  resumirCarteira,
} from "./parcelamentos-model";
import { ParcelamentosExplorer } from "./ParcelamentosExplorer";
import styles from "./parcelamentos.module.css";

/** Render sob demanda: o spread de risco é derivado da data atual (vencimentos relativos). */
export const dynamic = "force-dynamic";

export default function ParcelamentosPage() {
  const refIso = new Date().toISOString();
  const carteira = classificarCarteira(getParcelamentosSinteticos(refIso), refIso);
  const resumo = resumirCarteira(carteira);
  const emRisco = carteira.filter((p) => ehRisco(p.risco.nivel.nivel));

  return (
    <>
      <TopBar
        title="Parcelamentos"
        sub="Monitor de risco de rescisão · Simples Nacional / MEI · indício sinalizado para a decisão do contador"
      />
      <div className="content">
        {/* Subtítulo em português simples. */}
        <p className={styles.lead}>
          A maioria das ferramentas só avisa "parcela vencida". Aqui o foco é o{" "}
          <strong>risco de rescisão</strong>: pela regra do Simples Nacional, o parcelamento
          é cancelado com <strong>{LIMITE_RESCISAO_SN} parcelas em atraso</strong> (consecutivas
          ou não) — e o cliente perde o desconto e a regularidade. Cada linha traz um{" "}
          <strong>indício</strong>; quem decide regularizar é o contador.
        </p>

        {/* Selo de honestidade (demo / base sintética / integração = Fase B). */}
        <div className="notice" role="status">
          <span aria-hidden="true">◇</span>
          <span>
            <strong>Demo — base sintética.</strong> Integração com SERPRO / Integra Contador
            (consulta de parcelamentos e emissão de DAS) chega na <strong>Fase B</strong>. Nada
            aqui é consulta real ao Fisco; os valores e situações são ilustrativos. A plataforma
            sinaliza o indício de risco — não regulariza nem promete evitar o cancelamento.
          </span>
        </div>

        {/* KPIs. */}
        <div className={`grid ${styles.kpiGrid}`} style={{ marginTop: 16 }}>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{resumo.ativos}</span>
              <span className="kpi-label">Parcelamentos ativos</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{resumo.emAtencao}</span>
              <span className="kpi-label">Em atenção (com atraso)</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className={`kpi-value num ${resumo.emRisco > 0 ? styles.kpiRisco : ""}`}>
                {resumo.emRisco}
              </span>
              <span className="kpi-label">Em risco de rescisão</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{brl(resumo.descontoSobRisco)}</span>
              <span className="kpi-label">Desconto sob risco (ilustrativo)</span>
            </div>
          </Card>
        </div>

        {/* Faixa-destaque do whitespace: os em risco de rescisão, no topo. */}
        {emRisco.length > 0 ? (
          <Card
            title="Risco de rescisão — revisar primeiro"
            sub="Parcelamentos cujo indício de atraso se aproxima ou atingiu o limite de rescisão do Simples Nacional. Sugerimos priorizar a revisão com o cliente."
          >
            <ul className={styles.riscoList} aria-label="Parcelamentos em risco de rescisão">
              {emRisco.map((p) => (
                <li key={p.id} className={styles.riscoRow}>
                  <span className="semaforo-dot dot-risco" aria-hidden="true" />
                  <div className={styles.riscoMain}>
                    <div className={styles.riscoHead}>
                      <strong>{p.clienteNome}</strong>
                      <StatusBadge view={p.risco.nivel} />
                    </div>
                    <span className="muted" style={{ fontSize: 11.5 }}>
                      {p.programa} ·{" "}
                      {p.risco.parcelasAteRescisao != null
                        ? `faltam ${p.risco.parcelasAteRescisao} parcela(s) em atraso para o limite`
                        : "limite de parcelas em atraso atingido — conferir no Fisco"}
                      {p.risco.parcelasNaJanela > 0
                        ? ` · ${p.risco.parcelasNaJanela} na janela de ${JANELA_SALVAMENTO_DIAS} dias`
                        : ""}
                    </span>
                  </div>
                  <div className={styles.riscoRight}>
                    {p.descontoEmRisco > 0 ? (
                      <>
                        <span className="num">{brl(p.descontoEmRisco)}</span>
                        <span className="kpi-label">desconto sob risco</span>
                      </>
                    ) : (
                      <>
                        <span className="num">{p.risco.parcelasEmAtraso}</span>
                        <span className="kpi-label">parcela(s) em atraso</span>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {/* Carteira completa — corpo interativo (drill-down + ação human-in-loop). */}
        <Card
          title="Carteira de parcelamentos"
          sub="Todos os parcelamentos da carteira, do maior risco para o menor. Clique para abrir o histórico de parcelas."
        >
          <ParcelamentosExplorer parcelamentos={carteira} refIso={refIso} />
        </Card>

        {/* Disclaimer-credencial G6. */}
        <Card title="Linguagem segura (G6)">
          <p className="disclaimer">
            <strong>indício de risco de rescisão</strong> · base sintética (Fase 1) · regra do
            Simples Nacional (3 parcelas em atraso) · janela de salvamento de ~{JANELA_SALVAMENTO_DIAS}{" "}
            dias. Esta tela não promete evitar o cancelamento, não garante o desconto e não
            regulariza nada automaticamente — a plataforma sinaliza; a revisão e a decisão de
            regularizar são do <strong>contador</strong>, junto ao cliente. PGFN e estadual ficam
            em monitoramento manual (sem regra de rescisão inferida aqui).
          </p>
        </Card>
      </div>
    </>
  );
}
