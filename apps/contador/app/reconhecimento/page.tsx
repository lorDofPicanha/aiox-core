/**
 * Módulo #5 — RECONHECIMENTO (pipeline REAL end-to-end).
 *
 * A prova viva do moat: motor REAL sobre NOTA REAL. Cola/seleciona um XML de
 * NF-e/NFC-e → parser determinístico (@synkra/contador-parser) → motor de
 * classificação (@synkra/contador-motor-fiscal: classificarLote +
 * detectarMonofasicoLote) → apontamentos com confiança calibrada, banda e
 * fatores explícitos. Substitui a percepção de "tudo sintético": aqui o
 * pipeline roda de verdade (a captura automática de documentos é Fase B).
 *
 * Server Component. O parsing/classificação rodam no SERVIDOR via Server Action
 * (recognize.ts é `server-only`) — o XML fiscal cru não trafega processado pro
 * browser (LGPD — CONTEXT §7). O cliente recebe só o view-model serializável.
 *
 * G6 (CONTEXT §5 #4; doc 45 §5): indício / sugerimos revisão (CRC) / NUNCA
 * crédito garantido. Baixa confiança → revisar antes de aprovar. Human-in-loop:
 * a tela SINALIZA; nada é aprovado automaticamente.
 *
 * Auto-contido em app/reconhecimento/ (+ package.json/next.config do app para o
 * wire dos pacotes). NÃO edita Nav.tsx, layout.tsx, globals.css nem outros módulos.
 */
import { TopBar } from "@/components/TopBar";
import { Card } from "@/components/Card";
import { FIXTURES } from "./fixtures";
import { ReconhecimentoForm } from "./ReconhecimentoForm";
import styles from "./reconhecimento.module.css";

/** Catálogo serializável das amostras (sem o XML — esse fica no servidor). */
const AMOSTRAS = FIXTURES.map(({ id, rotulo, descricao, arquivo }) => ({
  id,
  rotulo,
  descricao,
  arquivo,
}));

export default function ReconhecimentoPage() {
  return (
    <>
      <TopBar
        title="Reconhecimento"
        sub="Motor real sobre nota real · parser determinístico + classificação · indícios sujeitos a revisão do tributarista habilitado"
      />
      <div className="content">
        <p className={styles.lead}>
          Esta tela liga o pipeline de verdade, ponta a ponta: um XML de NF-e/NFC-e entra,
          o <strong>parser determinístico</strong> o transforma em entidades tipadas, e o{" "}
          <strong>motor de classificação</strong> levanta os indícios — cClassTrib divergente e
          crédito potencialmente recuperável (monofásico) — com <strong>confiança calibrada</strong>{" "}
          e os fatores que a sustentam. É o motor real sobre nota real.
        </p>

        {/* Selo de honestidade — motor real / amostra / captura = Fase B. */}
        <div className="notice" role="status">
          <span aria-hidden="true">◆</span>
          <span>
            <strong>Motor real sobre amostra.</strong> O parser e o motor rodam de verdade aqui;
            o que é Fase B é a <strong>captura automática</strong> de documentos (ingestão em
            volume). Cada apontamento é um <strong>indício</strong> potencialmente recuperável —
            nada é crédito garantido, e baixa confiança vai para revisão humana (CRC).
          </span>
        </div>

        {/* Como funciona — o pipeline em quatro passos. */}
        <Card title="Como o reconhecimento funciona" sub="Quatro estágios determinísticos, no servidor.">
          <ol className={styles.pipeline}>
            <li>
              <span className={styles.pipeNum}>1</span>
              <div>
                <strong>Parser (XML → documento)</strong>
                <span className={styles.pipeDesc}>
                  NF-e/NFC-e 4.00 vira entidades tipadas (chave, partes, itens, PIS/COFINS) —
                  sem vazar dialeto de fornecedor.
                </span>
              </div>
            </li>
            <li>
              <span className={styles.pipeNum}>2</span>
              <div>
                <strong>Proveniência</strong>
                <span className={styles.pipeDesc}>
                  Detecta a classe de insumo: XML assinado é evidência mais forte que documento
                  extraído (OCR).
                </span>
              </div>
            </li>
            <li>
              <span className={styles.pipeNum}>3</span>
              <div>
                <strong>Classificação cClassTrib</strong>
                <span className={styles.pipeDesc}>
                  Compara o item com a régua de referência (DRAFT) e levanta divergências.
                </span>
              </div>
            </li>
            <li>
              <span className={styles.pipeNum}>4</span>
              <div>
                <strong>Crédito potencial monofásico</strong>
                <span className={styles.pipeDesc}>
                  NCM de família monofásica tributado como normal → indício de PIS/COFINS pago
                  a mais. Confiança calibrada por fatores explícitos.
                </span>
              </div>
            </li>
          </ol>
        </Card>

        {/* Corpo interativo. */}
        <ReconhecimentoForm amostras={AMOSTRAS} />
      </div>
    </>
  );
}
