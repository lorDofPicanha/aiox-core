/**
 * e-CAC ("a mina", D9 · CONTEXT §3) — ADD-ON premium, NÃO o core.
 *
 * Cockpit fiscal INTERATIVO da SITUAÇÃO FISCAL DA CARTEIRA (não da nota): caixa postal,
 * CNDs/certidões e ausência de declarações de TODAS as empresas numa tela só, com
 * drill-down por cliente. Resolve a dor de entrar no e-CAC cliente-por-cliente
 * (procuração), 100×.
 *
 * Esta página é um Server Component fino (espelha /emissor): monta o cabeçalho honesto
 * e delega a interatividade ao EcacCockpit (client). Auto-contido: dados sintéticos vêm
 * de ecac-model.ts (co-localizado). NÃO toca lib/api.ts, packages/contador-api-client,
 * components/* nem globals.css — só LÊ os componentes compartilhados.
 *
 * G6 (doc 45): e-CAC só MOSTRA a situação extraída do portal. Nada aqui afirma
 * "crédito garantido", "apuração correta", "elimina multa" nem "prova jurídica plena":
 * a consulta é leitura; a ação (parcelar, declarar, contestar) é ato do contador.
 * Honestidade calibrada: base sintética; consulta real via Integra Contador (SERPRO)
 * chega na Fase 7 (exige contrato SERPRO + procurações eletrônicas homologadas).
 */
import { Card } from "@/components/Card";
import { TopBar } from "@/components/TopBar";
import { EcacCockpit } from "./EcacCockpit";
import styles from "./ecac.module.css";

export default function EcacPage() {
  return (
    <>
      <TopBar
        title="e-CAC — carteira"
        sub="Situação fiscal de toda a carteira numa tela só — caixa postal, CNDs e declarações. Add-on premium · diagnóstico de leitura."
      />
      <div className="content">
        {/* O que o módulo resolve (português simples). */}
        <Card title="O que esta tela faz">
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-dim)" }}>
            Em vez de entrar no e-CAC <strong>cliente por cliente</strong> (uma procuração de
            cada vez) para olhar caixa postal, certidões e declarações, o módulo reúne a{" "}
            <strong>situação fiscal de toda a carteira</strong> num só painel. Clique em{" "}
            <strong>Abrir</strong> para ver a caixa postal (marcar como lida), cada certidão
            (com pré-visualização) e as declarações de um cliente. O painel{" "}
            <strong>mostra</strong> onde há pendência — não regulariza, não promete crédito nem
            elimina multa. A decisão e a ação (parcelar, declarar, contestar) seguem sendo do
            contador.
          </p>
        </Card>

        {/* Cockpit interativo (KPIs · tabela com drill-down · filtro · lote). */}
        <EcacCockpit />

        {/* Disclaimer-credencial (G6). */}
        <Card title="Disclaimer-credencial (G6)">
          <p className="disclaimer">
            Demonstração com dados <strong>sintéticos</strong>. O e-CAC é um diagnóstico{" "}
            <strong>somente-leitura</strong> da situação fiscal da carteira (caixa postal · CNDs
            · declarações). Ele <strong>mostra</strong> a situação extraída do portal e{" "}
            <strong>não</strong> promete crédito garantido, apuração correta, ausência de multa
            nem prova jurídica plena. A regularização (parcelar, declarar, contestar) é ato do
            contador. A consulta real via Integra Contador (SERPRO) chega na Fase 7.
          </p>
        </Card>

        {/* Selo discreto de honestidade (rodapé sutil — não banner alarmista). */}
        <p className={styles.rodapeSelo} role="note">
          <span className={styles.rodapeGlyph} aria-hidden="true">
            ◇
          </span>
          Dados de demonstração (base sintética). Consulta real via Integra Contador (SERPRO)
          na Fase 7.
        </p>
      </div>
    </>
  );
}
