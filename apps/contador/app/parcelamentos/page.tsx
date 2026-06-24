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
import { TopBar } from "@/components/TopBar";
import { brl } from "@/lib/format";
import { AlertasRescisao, type AlertaRescisao } from "./AlertasRescisao";
import {
  JANELA_SALVAMENTO_DIAS,
  LIMITE_RESCISAO_SN,
  classificarCarteira,
  ehRisco,
  resumirCarteira,
} from "./parcelamentos-model";
import { detectarTransicoes, idsNovosEmRisco } from "./parcelamentos-monitor";
import { ESCRITORIO_DEMO, parcelamentoProvider } from "./parcelamentos-provider";
import { ParcelamentosExplorer } from "./ParcelamentosExplorer";
import styles from "./parcelamentos.module.css";

/** Render sob demanda: o spread de risco é derivado da data atual (vencimentos relativos). */
export const dynamic = "force-dynamic";

export default async function ParcelamentosPage() {
  const refIso = new Date().toISOString();

  // PAR-1: o dado vem do CONTRATO (provider), não do seed direto. Hoje é o mock; amanhã o
  // adapter real do Integra Contador preenche o mesmo contrato sem mexer aqui.
  const leituraAtual = await parcelamentoProvider.listarParcelamentos(ESCRITORIO_DEMO, refIso);
  const leituraAnterior = await parcelamentoProvider.listarSnapshotAnterior(ESCRITORIO_DEMO, refIso);

  const carteira = classificarCarteira(leituraAtual.parcelamentos, leituraAtual.refIso);
  const resumo = resumirCarteira(carteira);
  const emRisco = carteira.filter((p) => ehRisco(p.risco.nivel.nivel));

  // PAR-3: monitor de transições — quem entrou/avançou em risco desde a última leitura.
  const transicoes = detectarTransicoes(
    leituraAnterior?.parcelamentos ?? null,
    leituraAtual.parcelamentos,
    leituraAnterior?.refIso ?? leituraAtual.refIso,
    leituraAtual.refIso,
  );
  const novosEmRisco = idsNovosEmRisco(transicoes);

  // PAR-4: feed de alertas (em risco, com selo "NOVO hoje" para os do monitor).
  const alertas: AlertaRescisao[] = emRisco.map((parc) => ({
    parc,
    novoHoje: novosEmRisco.has(parc.id),
  }));

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

        {/* PAR-4 — Feed de alertas proativos de rescisão, no TOPO ("revisar primeiro").
            Os que viraram risco desde a última leitura (monitor PAR-3) vêm com "NOVO hoje". */}
        <div style={{ marginTop: 16 }}>
          <AlertasRescisao alertas={alertas} />
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
