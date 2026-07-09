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
import { AlertasSaudeFiscal } from "./AlertasSaudeFiscal";
import { AlertasDividaAtiva } from "./AlertasDividaAtiva";
import { EcacCockpit } from "./EcacCockpit";
import {
  detectarCndsAVencer,
  ehRelevante,
  resumirRenovacao,
  resumirTriagem,
  triarMensagens,
} from "./saude-fiscal-model";
import {
  analisarDividasAtivas,
  filtrarComAlertaExclusao,
  resumirDividaAtiva,
} from "./divida-ativa-model";
import { getDividasAtivasSinteticas } from "./divida-ativa-data";
import { ESCRITORIO_SAUDE_DEMO, saudeFiscalProvider } from "./saude-fiscal-provider";
import {
  criarSaudeFiscalProviderComposto,
  temCredenciaisSaudeFiscal,
} from "./adapters/composed-saude-fiscal-provider";
import styles from "./ecac.module.css";

/** Render sob demanda: triagem/renovação derivam da data atual (prazos e validades relativos). */
export const dynamic = "force-dynamic";

export default async function EcacPage() {
  const refIso = new Date().toISOString();

  // S3/S5: o dado vem do CONTRATO (provider), não do seed direto. DEFAULT = Mock (comportamento
  // atual do app). Quando há credencial SERPRO/Infosimples (gate do founder — handoff 58 §2), usa
  // a composição REAL dos adapters S1+S4 — SEM mudar nada quando não há env (o app se comporta
  // exatamente como hoje).
  const provider = temCredenciaisSaudeFiscal()
    ? criarSaudeFiscalProviderComposto()
    : saudeFiscalProvider;
  const leitura = await provider.listarSaudeFiscal(ESCRITORIO_SAUDE_DEMO, refIso);

  // S3: triagem da caixa postal — só as relevantes (crítico/atenção) vão para o feed.
  const triadas = triarMensagens(leitura.mensagens, leitura.refIso);
  const triadasRelevantes = triadas.filter((m) => ehRelevante(m.nivel.nivel));
  const resumoTriagem = resumirTriagem(triadas);

  // S5: fila de renovação de CND (vencidas + a vencer), priorizada.
  const filaRenovacao = detectarCndsAVencer(leitura.cnds, leitura.refIso);
  const resumoRenovacao = resumirRenovacao(filaRenovacao);

  // S6: dívida ativa (PGFN/Regularize) — inscrições com indício de exclusão automática de
  // parcelamento por inadimplência. Fonte sintética (o adapter real Regularize é gate do
  // founder). Só as inscrições com alerta ativo (crítico/aviso/excluído) vão para o feed.
  const dividas = getDividasAtivasSinteticas(refIso);
  const dividasComAlerta = filtrarComAlertaExclusao(analisarDividasAtivas(dividas, refIso));
  const resumoDivida = resumirDividaAtiva(dividas, refIso);

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

        {/* S3 + S5 — Feed proativo no TOPO ("revisar primeiro"): caixa postal triada por
            relevância (intimações com prazo + comunicados da Receita) e fila de renovação de
            CND (vencidas + a vencer). A plataforma sinaliza o indício; a ação é do contador. */}
        <div style={{ marginTop: 16 }}>
          <AlertasSaudeFiscal
            mensagens={triadasRelevantes}
            renovacoes={filaRenovacao}
            prazosNoLimite={resumoTriagem.prazosNoLimite}
            cndsVencidas={resumoRenovacao.vencidas}
          />
        </div>

        {/* S6 — Dívida ativa (PGFN/Regularize): inscrições com indício de exclusão automática de
            parcelamento por inadimplência (≤7d crítico · ≤75d aviso). A plataforma sinaliza; a
            negociação/pagamento é decisão do contador, no Regularize. */}
        <div style={{ marginTop: 16 }}>
          <AlertasDividaAtiva itens={dividasComAlerta} resumo={resumoDivida} />
        </div>

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
