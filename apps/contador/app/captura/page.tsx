/**
 * Captura (#1) — a "porta de entrada" do ciclo da nota fiscal (CONTEXT §3).
 *
 * Server Component (casca) que monta o módulo INTERATIVO (CapturaModulo, client), no
 * mesmo padrão de /emissor (page server → fluxo client). A tela é de uso real para o
 * contador avaliar: subir nota manual, filtrar/buscar, ligar/desligar a captura por
 * cliente e fazer drill-down — tudo em estado de sessão, base sintética em memória.
 *
 * Em volta do módulo, a casca server mantém o que é estático: a caixa do módulo #2
 * (Armazenamento XML 15 anos), o disclaimer G6 e um rótulo DISCRETO de demonstração.
 *
 * G6 (doc 45 §5): a Captura só COLETA e ARMAZENA o insumo fiscal — nenhum juízo de
 * mérito aqui. Nada promete crédito garantido, apuração correta, eliminação de multa
 * nem prova jurídica plena. A captura automática real (certificado/provider) chega na
 * Fase 5 (precisa provider + DPA — Art. 39 LGPD). Base SINTÉTICA (Fase 1).
 */
import { Card } from "@/components/Card";
import { TopBar } from "@/components/TopBar";
import { CapturaModulo } from "./CapturaModulo";
import { NOTAS_SEED } from "./captura-data";
import styles from "./captura.module.css";

export default function CapturaPage() {
  const totalSemente = NOTAS_SEED.length;

  return (
    <>
      <TopBar
        title="Captura de notas"
        sub="Porta de entrada do ciclo da nota fiscal — varredura de NF-e e CT-e por cliente. A Captura coleta e armazena o insumo; a análise vive nos módulos seguintes."
      />
      <div className="content">
        {/* Rótulo DISCRETO de demonstração (uma linha sutil, não um alarme). */}
        <p className={styles.demoTag} role="note">
          <span aria-hidden="true">◇</span> Dados de demonstração — base sintética em
          sessão. A captura automática via provider chega na Fase 5; aqui o lançamento
          manual, os toggles e os filtros funcionam sobre dados de exemplo.
        </p>

        {/* Módulo interativo (KPIs, status por cliente, lançamento, filtros, drill-down). */}
        <CapturaModulo />

        <Card
          title="Armazenamento XML — guarda fundamentada (módulo #2)"
          sub="Guardar o XML da nota é obrigação legal — regra geral 5 anos (CTN), com extensões seletivas fundamentadas por documento. Quase ninguém faz. O XML é leve e o storage é barato — vira um plus do ciclo (retenção estendida como serviço), cobrado por pacote de notas."
        >
          <dl className={styles.armazenamento}>
            <div>
              <dt>Prazo de guarda</dt>
              <dd className="num">
                5 <span className="unidade">anos (regra CTN) + extensões fundamentadas</span>
              </dd>
            </div>
            <div>
              <dt>Tamanho médio por XML</dt>
              <dd className="num">
                ~7 <span className="unidade">KB por documento</span>
              </dd>
            </div>
            <div>
              <dt>Notas na base demo</dt>
              <dd className="num">
                {totalSemente} <span className="unidade">XML sintéticos (semente)</span>
              </dd>
            </div>
            <div>
              <dt>Custo de storage</dt>
              <dd className="num">
                baixo <span className="unidade">~$2 / 500 GB</span>
              </dd>
            </div>
          </dl>
          <p className="disclaimer">
            O armazenamento fundamentado (mínimo legal de 5 anos pelo CTN, com extensões
            seletivas e retenção estendida como serviço) é um <strong>plus</strong> do ciclo —
            guarda o insumo (◆ XML 1ª classe). Não constitui, por si, crédito garantido,
            apuração correta nem prova jurídica plena: é o documento fiscal preservado para
            revisão humana.
          </p>
        </Card>

        <Card title="Linguagem segura (G6)">
          <p className="disclaimer">
            <strong>Captura = coleta + armazenamento</strong> do insumo fiscal · base sintética
            (Fase 1) · insumo ◆ XML / ◇ OCR · sujeito a <strong>revisão humana</strong> nos
            módulos seguintes. A varredura automática real (certificado/provider) chega na Fase 5
            (precisa provider + DPA, Art. 39 LGPD). Esta plataforma não promete crédito garantido,
            apuração correta nem eliminação de multa.
          </p>
        </Card>
      </div>
    </>
  );
}
