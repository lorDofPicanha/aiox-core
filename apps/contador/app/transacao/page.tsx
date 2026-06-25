/**
 * PAR-7 — Radar de Transação Tributária (página). Server Component, demo navegável.
 *
 * INTELIGÊNCIA + GANCHO DE HONORÁRIO, NÃO AUTOMAÇÃO. Sinaliza quais clientes da carteira são
 * POTENCIALMENTE elegíveis, em tese, a editais de transação tributária / feirões de desconto
 * (Lei 13.988/2020; PGFN/Regularize — doc 55 §C), priorizados pelo GANCHO DE HONORÁRIO
 * potencial do escritório/tributarista (modelo D6 — success-fee, linha separada).
 *
 * ⚠️ FRENTE JURIDICAMENTE SENSÍVEL: a adesão à transação é ato MANUAL conduzido por
 * tributarista — NÃO há API de adesão (handoff 57 §3/§6). A plataforma apenas SINALIZA a
 * oportunidade; não adere, não negocia, não promete resultado nem aprovação. Faixas de
 * desconto = as PERMITIDAS pelo edital em tese (teto legal), nunca concedidas.
 *
 * Auto-contido: dados/engine em app/transacao/. Só lê componentes/tokens globais. Edita o
 * Nav.tsx com adição mínima de 1 rota (autorizado pelo escopo para rota nova).
 */
import { Card } from "@/components/Card";
import { TopBar } from "@/components/TopBar";
import { brl } from "@/lib/format";
import { TransacaoExplorer } from "./TransacaoExplorer";
import {
  classificarCarteiraTransacao,
  resumirTransacao,
} from "./transacao-model";
import { ESCRITORIO_DEMO, transacaoProvider } from "./transacao-provider";
import styles from "./transacao.module.css";

/** Render sob demanda: a idade das inscrições é derivada da data atual (determinística). */
export const dynamic = "force-dynamic";

export default async function TransacaoPage() {
  const refIso = new Date().toISOString();

  // O dado vem do CONTRATO (provider), não do seed direto. Hoje é o mock; amanhã o adapter
  // S6 real (Infosimples / PGFN-Regularize) preenche o mesmo contrato sem mexer aqui.
  const leitura = await transacaoProvider.listarPerfisFiscais(ESCRITORIO_DEMO, refIso);
  const carteira = classificarCarteiraTransacao(leitura.perfis, leitura.refIso);
  const resumo = resumirTransacao(carteira);

  return (
    <>
      <TopBar
        title="Radar de transação tributária"
        sub="Inteligência (não automação) · sinaliza oportunidades de transação em tese · gancho de honorário · o tributarista conduz a adesão"
      />
      <div className="content">
        {/* Subtítulo em português simples — o que é e o que NÃO é. */}
        <p className={styles.lead}>
          A transação tributária (Lei 13.988/2020; editais PGFN / Regularize) permite{" "}
          <strong>negociar</strong> débitos inscritos em dívida ativa. <strong>Não há API de
          adesão</strong>: a adesão é ato manual conduzido por tributarista. Aqui o radar apenas{" "}
          <strong>sinaliza</strong> clientes potencialmente elegíveis em tese e estima um{" "}
          <strong>gancho de honorário</strong> do escritório — sem promessa de resultado, sem
          economia garantida. Quem analisa, negocia e adere é o profissional.
        </p>

        {/* Selo de honestidade (demo / base sintética / adapter S6 = gate do founder). */}
        <div className="notice" role="status">
          <span aria-hidden="true">◇</span>
          <span>
            <strong>Demo — base sintética.</strong> A consulta real de dívida ativa (Infosimples
            / PGFN-Regularize) chega como adapter S6 (gate do founder). Nada aqui é consulta real
            ao Fisco; valores, prazos e elegibilidade são ilustrativos. O radar sinaliza o
            indício — não adere, não negocia, não promete desconto nem aprovação.
          </span>
        </div>

        {/* KPIs. */}
        <div className={`grid ${styles.kpiGrid}`} style={{ marginTop: 16 }}>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{resumo.fortes}</span>
              <span className="kpi-label">Elegíveis em tese (forte)</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{resumo.condicionais}</span>
              <span className="kpi-label">Elegíveis em tese (condicional)</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{resumo.requerAnalise}</span>
              <span className="kpi-label">Requer análise</span>
            </div>
          </Card>
          <Card>
            <div className="kpi">
              <span className="kpi-value num">{brl(resumo.ganchoPotencialTotal)}</span>
              <span className="kpi-label">Gancho de honorário potencial (ilustrativo)</span>
            </div>
          </Card>
        </div>

        {/* Carteira — corpo interativo (ranking por gancho + drill-down do breakdown). */}
        <Card
          title="Oportunidades de transação (ranking por gancho de honorário)"
          sub="Da maior para a menor oportunidade de honorário potencial. Clique para abrir o detalhe explicável (por que é elegível em tese e as ressalvas)."
        >
          <TransacaoExplorer oportunidades={carteira} />
        </Card>

        {/* Disclaimer-credencial G6 (frente legal — forte e visível). */}
        <Card title="Linguagem segura (G6) e limites jurídicos">
          <p className="disclaimer">
            <strong>Não é automação de transação.</strong> A adesão à transação tributária é ato
            MANUAL conduzido por <strong>tributarista habilitado</strong>; o sistema apenas
            sinaliza oportunidades em tese. Não há promessa de resultado nem de aprovação. As
            faixas de desconto exibidas são as <strong>permitidas pelo edital em tese</strong>{" "}
            (teto legal), não concedidas — dependem da análise de capacidade de pagamento e do
            edital vigente. O gancho é <strong>honorário potencial do escritório/tributarista</strong>{" "}
            (modelo de êxito, linha separada), não economia garantida do cliente. Esta tela não
            adere, não negocia, não regulariza e não quita nada automaticamente. Base sintética
            (Fase 1); a consulta real de dívida ativa depende de adapter S6 (gate do founder).
          </p>
        </Card>
      </div>
    </>
  );
}
