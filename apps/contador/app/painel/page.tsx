/**
 * Painel do Escritório — cockpit unificado (a PORTA DE ENTRADA).
 *
 * Uma tela só que AGREGA o sinal-manchete de cada frente já construída e dá deep-link para
 * o módulo de origem. É COMPOSIÇÃO READ-ONLY (CONTEXT §5): lê os engines/data-layers
 * existentes e exibe — não recalcula regra, não escreve, não chama write-path de nenhuma
 * frente (nem registrarAnalise, nem evento de trilha, nem sugestão). Cada frente já é pura;
 * esta page é só o ponto de injeção do "hoje" (refIso), como as demais pages fazem.
 *
 * ┌─ POR QUE NÃO HÁ JOIN POR-CLIENTE AQUI (id drift conhecido — D9 / FF-1) ───────────────────┐
 * │ As frentes usam 3 esquemas de id diferentes: core (UUID) × e-CAC (curto) × parcelamento/   │
 * │ transação ("cli-*"). Um join por igualdade de id casaria 0 cliente — ou fingiria casar.    │
 * │ Por isso o painel agrega POR MÓDULO: cada frente traz o SEU próprio "top item" a partir do  │
 * │ que o seu engine expõe. A visão por-cliente cross-módulo é FOLLOW-UP (quando a identidade   │
 * │ unificar por CNPJ nos adapters reais). Aqui não reconciliamos — só compomos manchetes.      │
 * └──────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * G6 (CONTEXT §5 #4): linguagem de atenção/indício. Nada aqui afirma "regularizado",
 * "garantido", "em dia" nem "sem risco". O painel INFORMA e PRIORIZA; a ação (revisar,
 * renovar, responder, negociar) é do contador (human-in-loop). O selo de trilha é leitura
 * (re-verificação ≠ re-execução); a base é sintética e os adapters reais são gate.
 */
import { verificarCadeia } from "@synkra/contador-trilha-verifier";
import Link from "next/link";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { TopBar } from "@/components/TopBar";
import { getApi, ESCRITORIO_ID } from "@/lib/api";
import { brl } from "@/lib/format";
import { carregarFilaPendente } from "@/lib/fila-model";
import type { StatusView } from "@/lib/status";

// --- Frente 2: Health Score (S12) ---
import { carregarEntradasHealth } from "@/app/saude-carteira/health-score-data";
import { rankearCarteira, resumirHealth } from "@/app/saude-carteira/health-score-model";

// --- Frente 3: Saúde fiscal e-CAC (S3/S5) ---
import {
  detectarCndsAVencer,
  resumirRenovacao,
  resumirTriagem,
  triarMensagens,
  type MensagemTriada,
  type ItemRenovacaoCnd,
} from "@/app/ecac/saude-fiscal-model";
import { saudeFiscalProvider, ESCRITORIO_SAUDE_DEMO } from "@/app/ecac/saude-fiscal-provider";

// --- Frente 4: Parcelamentos (risco de rescisão) ---
import {
  classificarCarteira,
  resumirCarteira,
  ehRisco,
} from "@/app/parcelamentos/parcelamentos-model";
import {
  ESCRITORIO_DEMO as ESCRITORIO_PARCELAMENTOS,
  parcelamentoProvider,
} from "@/app/parcelamentos/parcelamentos-provider";

// --- Frente 5: Transação tributária (PAR-7) ---
import {
  classificarCarteiraTransacao,
  resumirTransacao,
  ehOportunidade,
} from "@/app/transacao/transacao-model";
import {
  ESCRITORIO_DEMO as ESCRITORIO_TRANSACAO,
  transacaoProvider,
} from "@/app/transacao/transacao-provider";

import styles from "./painel.module.css";

/** Render sob demanda: triagem de prazos / idade de dívida derivam da data atual. */
export const dynamic = "force-dynamic";

/** Severidade da manchete (define a cor — sempre acompanhada de label, nunca só matiz). */
type Tom = "critico" | "atencao" | "neutro";

const TOM_CLASS: Record<Tom, string> = {
  critico: styles.vCritico,
  atencao: styles.vAtencao,
  neutro: styles.vNeutro,
};

/** Um item da lista "O que revisar primeiro" — o top item de UMA frente (sem join cross-módulo). */
interface ItemRevisar {
  /** Rótulo da frente de origem. */
  frente: string;
  /** Badge G6-safe reaproveitado do engine de origem (cor + glyph + label). */
  badge: StatusView;
  /** Frase curta do item mais urgente da frente. */
  texto: string;
  /** Deep-link para o módulo de origem. */
  href: string;
  /** Rótulo do link. */
  linkLabel: string;
}

export default async function PainelPage() {
  // "Hoje" injetado pela page (Server Component) e repassado aos engines que precisam.
  const refIso = new Date().toISOString();
  const api = await getApi();

  // ===========================================================================
  // Leitura READ-ONLY de todas as frentes em paralelo (cada uma com seu provider/engine).
  // ===========================================================================
  const [
    apontamentos,
    eventos,
    fila,
    entradasHealth,
    leituraEcac,
    leituraParcelamentos,
    leituraTransacao,
  ] = await Promise.all([
    api.listarApontamentos({ escritorioId: ESCRITORIO_ID }),
    api.listarEventos({ escritorioId: ESCRITORIO_ID }),
    carregarFilaPendente(api, ESCRITORIO_ID),
    carregarEntradasHealth(api, ESCRITORIO_ID, refIso),
    saudeFiscalProvider.listarSaudeFiscal(ESCRITORIO_SAUDE_DEMO, refIso),
    parcelamentoProvider.listarParcelamentos(ESCRITORIO_PARCELAMENTOS, refIso),
    transacaoProvider.listarPerfisFiscais(ESCRITORIO_TRANSACAO, refIso),
  ]);

  // --- Frente 1: Auditoria (core) ---
  const pendentes = apontamentos.filter((a) => a.status === "pendente");
  const valorEmRevisao = pendentes.reduce((acc, a) => acc + (a.valorEnvolvido ?? 0), 0);
  // Top item da auditoria p/ "revisar primeiro": o de maior materialidade ENTRE OS QUE BLOQUEIAM
  // auto-aprovação (a fila vem ordenada por materialidade desc). Usar fila[0] cru esconderia um
  // indício que bloqueia atrás de um de banda alta que não bloqueia (QA 🟡-1).
  const topFila = fila.find((l) => l.bloqueiaAutoAprovacao) ?? null;

  // --- Frente 2: Health Score (S12) ---
  const ranking = rankearCarteira(entradasHealth);
  const resumoHealth = resumirHealth(ranking);
  // Top item: o pior cliente (rankearCarteira já põe o pior no topo).
  const piorCliente = ranking[0] ?? null;

  // --- Frente 3: Saúde fiscal e-CAC (S3/S5) ---
  const triadas = triarMensagens(leituraEcac.mensagens, leituraEcac.refIso);
  const resumoTriagem = resumirTriagem(triadas);
  const filaRenovacao = detectarCndsAVencer(leituraEcac.cnds, leituraEcac.refIso);
  const resumoRenovacao = resumirRenovacao(filaRenovacao);
  // Top item: a intimação com prazo mais apertado (expirado/no_limite) OU a CND vencida no topo.
  const topPrazo: MensagemTriada | null =
    triadas.find(
      (m) =>
        m.situacaoPrazo.situacao === "expirado" || m.situacaoPrazo.situacao === "no_limite",
    ) ?? null;
  const topCnd: ItemRenovacaoCnd | null =
    filaRenovacao.find((i) => i.prioridade.prioridade === "vencida") ?? filaRenovacao[0] ?? null;

  // --- Frente 4: Parcelamentos (risco de rescisão) ---
  const carteiraParc = classificarCarteira(leituraParcelamentos.parcelamentos, leituraParcelamentos.refIso);
  const resumoParc = resumirCarteira(carteiraParc);
  // Top item: o parcelamento em risco no topo do ranking (pior risco primeiro).
  const topParc = carteiraParc.find((p) => ehRisco(p.risco.nivel.nivel)) ?? null;

  // --- Frente 5: Transação tributária (PAR-7) ---
  const carteiraTransacao = classificarCarteiraTransacao(leituraTransacao.perfis, leituraTransacao.refIso);
  const resumoTransacao = resumirTransacao(carteiraTransacao);
  // Top item: a oportunidade de maior gancho (ranking já é por gancho.meio desc).
  const topTransacao = carteiraTransacao.find((o) => ehOportunidade(o.nivel.nivel)) ?? null;

  // --- Frente 6: Trilha de boa-fé (verificador no loop, igual à Carteira F1.6) ---
  const verif = verificarCadeia(
    eventos.map((e) => ({
      id: e.id,
      escritorio_id: e.escritorioId,
      seq_tenant: e.seqTenant,
      hash_ver: e.hashVer,
      tipo_evento: e.tipoEvento,
      ator_tipo: e.atorTipo,
      ator_id: e.atorId,
      referente_tipo: e.referenteTipo,
      referente_id: e.referenteId,
      nota_id: e.notaId,
      apontamento_id: e.apontamentoId,
      laudo_id: e.laudoId,
      payload: e.payload,
      ocorrido_em: e.ocorridoEm,
      hash_anterior: e.hashAnterior,
      hash_evento: e.hashEvento,
    })),
  );

  // ===========================================================================
  // Manchetes (1 número por frente) — cada uma com deep-link e tom de severidade.
  // ===========================================================================
  const prazosCriticosEcac = resumoTriagem.prazosNoLimite + resumoRenovacao.vencidas;

  interface Manchete {
    frente: string;
    href: string;
    valor: string;
    tom: Tom;
    manchete: string;
  }

  const manchetes: Manchete[] = [
    {
      frente: "Auditoria",
      href: "/fila",
      valor: String(pendentes.length),
      tom: pendentes.length > 0 ? "atencao" : "neutro",
      manchete: `indício(s) pendente(s) de revisão · ${brl(valorEmRevisao)} em revisão`,
    },
    {
      frente: "Saúde da carteira",
      href: "/saude-carteira",
      valor: String(resumoHealth.criticos),
      tom: resumoHealth.criticos > 0 ? "critico" : resumoHealth.atencao > 0 ? "atencao" : "neutro",
      manchete: `cliente(s) em banda crítica · ${resumoHealth.atencao} em atenção · score médio ${resumoHealth.scoreMedio ?? "—"}`,
    },
    {
      frente: "e-CAC · situação fiscal",
      href: "/ecac",
      valor: String(prazosCriticosEcac),
      tom: prazosCriticosEcac > 0 ? "critico" : resumoRenovacao.aVencer > 0 ? "atencao" : "neutro",
      manchete: `prazo(s) no limite + CND(s) vencida(s) · ${resumoRenovacao.aVencer} CND(s) a vencer`,
    },
    {
      frente: "Parcelamentos",
      href: "/parcelamentos",
      valor: String(resumoParc.emRisco),
      tom: resumoParc.emRisco > 0 ? "critico" : resumoParc.emAtencao > 0 ? "atencao" : "neutro",
      manchete: `em risco de rescisão · ${resumoParc.emAtencao} em atenção (com atraso)`,
    },
    {
      frente: "Transação tributária",
      href: "/transacao",
      valor: String(resumoTransacao.fortes + resumoTransacao.condicionais),
      tom: "neutro",
      manchete: `indício(s) de oportunidade em tese · gancho potencial ${brl(resumoTransacao.ganchoPotencialTotal)} (ilustrativo)`,
    },
    {
      frente: "Trilha de boa-fé",
      href: "/trilha",
      valor: verif.ok ? "íntegra" : "conferir",
      tom: verif.ok ? "neutro" : "critico",
      manchete: `${verif.checked} evento(s) verificado(s) · ${verif.failures.length} falha(s)`,
    },
  ];

  // ===========================================================================
  // "O que revisar primeiro" — top item de cada frente (sem join cross-módulo).
  // Cada item reaproveita o badge G6-safe do engine de origem.
  // ===========================================================================
  const revisar: ItemRevisar[] = [];

  if (topPrazo) {
    revisar.push({
      frente: "e-CAC · caixa postal",
      badge: { variant: topPrazo.situacaoPrazo.variant, glyph: topPrazo.situacaoPrazo.glyph, label: topPrazo.situacaoPrazo.label },
      texto: `${topPrazo.clienteNome}: ${topPrazo.assunto} — ${topPrazo.situacaoPrazo.label.toLowerCase()}.`,
      href: "/ecac",
      linkLabel: "Abrir caixa postal",
    });
  } else if (topCnd && topCnd.prioridade.prioridade === "vencida") {
    revisar.push({
      frente: "e-CAC · CND",
      badge: { variant: topCnd.prioridade.variant, glyph: topCnd.prioridade.glyph, label: topCnd.prioridade.label },
      texto: `${topCnd.cnd.clienteNome}: ${topCnd.esferaView.rotulo} — ${topCnd.prioridade.label.toLowerCase()}.`,
      href: "/ecac",
      linkLabel: "Abrir e-CAC",
    });
  }

  if (topParc) {
    revisar.push({
      frente: "Parcelamentos",
      badge: { variant: topParc.risco.nivel.variant, glyph: topParc.risco.nivel.glyph, label: topParc.risco.nivel.label },
      texto: `${topParc.clienteNome} (${topParc.esferaView.rotulo}): ${topParc.risco.nivel.label.toLowerCase()} — ${topParc.risco.parcelasEmAtraso} parcela(s) em atraso.`,
      href: "/parcelamentos",
      linkLabel: "Abrir parcelamentos",
    });
  }

  if (piorCliente && piorCliente.banda.banda !== "saudavel") {
    revisar.push({
      frente: "Saúde da carteira",
      badge: { variant: piorCliente.banda.variant, glyph: piorCliente.banda.glyph, label: piorCliente.banda.label },
      texto: `Pior score da carteira: ${piorCliente.clienteNome} — ${piorCliente.score}/100 (${piorCliente.banda.label.toLowerCase()}).`,
      href: "/saude-carteira",
      linkLabel: "Abrir health score",
    });
  }

  if (topFila) {
    revisar.push({
      frente: "Auditoria · fila",
      badge: topFila.bandaView,
      texto: `${topFila.clienteNome}: ${topFila.naturezaLabel} — ${brl(topFila.materialidade)} envolvido (bloqueia auto-aprovação).`,
      href: "/fila",
      linkLabel: "Abrir fila do dia",
    });
  }

  if (topTransacao) {
    revisar.push({
      frente: "Transação tributária",
      badge: { variant: topTransacao.nivel.variant, glyph: topTransacao.nivel.glyph, label: topTransacao.nivel.label },
      texto: `${topTransacao.perfil.clienteNome}: ${topTransacao.nivel.label.toLowerCase()} — gancho potencial ${brl(topTransacao.gancho.min)} – ${brl(topTransacao.gancho.max)} (ilustrativo).`,
      href: "/transacao",
      linkLabel: "Abrir radar de transação",
    });
  }

  return (
    <>
      <TopBar
        title="Painel do escritório"
        sub="A saúde da operação inteira numa tela só — cada frente traz seu sinal-manchete e o atalho para o módulo. Leitura: o painel prioriza; a ação é do contador."
      />
      <div className="content">
        <div className="notice" role="status">
          <span aria-hidden="true">◇</span>
          <span>
            Painel de <strong>leitura</strong> sobre <strong>base sintética</strong> (Fase 1).
            Ele <strong>agrega</strong> os indícios de cada frente e aponta por onde começar —
            não regulariza, não promete crédito nem atesta situação fiscal. Os{" "}
            <strong>adapters reais</strong> (Integra Contador / SERPRO, Infosimples / PGFN) e a
            unificação de identidade por CNPJ são gate do founder.
          </span>
        </div>

        {/* Faixa de KPIs-manchete (1 número por frente, deep-linkável). */}
        <div className={`grid ${styles.kpiFaixa}`} style={{ marginTop: 16 }}>
          {manchetes.map((m) => (
            <Link key={m.frente} href={m.href} className={styles.kpiLink}>
              <section className={`card ${styles.kpiCard}`}>
                <div className={styles.kpiTopo}>
                  <span className={styles.kpiFrente}>{m.frente}</span>
                  <span className={styles.kpiSeta} aria-hidden="true">
                    →
                  </span>
                </div>
                <span className={`kpi-value num ${TOM_CLASS[m.tom]}`}>{m.valor}</span>
                <span className={styles.kpiManchete}>{m.manchete}</span>
              </section>
            </Link>
          ))}
        </div>

        {/* O que revisar primeiro — top item de cada frente (agregado por módulo). */}
        <Card
          title="O que revisar primeiro"
          sub="Os itens mais urgentes de cada frente, lado a lado. Cada linha leva ao módulo de origem. Não há cruzamento por cliente entre frentes (identidades distintas) — cada módulo traz o seu próprio item mais urgente."
        >
          {revisar.length > 0 ? (
            <ul className={styles.revisarLista}>
              {revisar.map((it) => (
                <li key={`${it.frente}-${it.href}`} className={styles.revisarItem}>
                  <span className={styles.revisarBadge}>
                    <StatusBadge view={it.badge} />
                  </span>
                  <div className={styles.revisarCorpo}>
                    <div className={styles.revisarFrente}>{it.frente}</div>
                    <p className={styles.revisarTexto}>{it.texto}</p>
                    <Link href={it.href} className={styles.revisarLink}>
                      {it.linkLabel} →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.revisarVazio}>
              Nenhum indício urgente nas frentes monitoradas no seed atual. As manchetes acima
              seguem com os números de cada módulo.
            </p>
          )}
        </Card>

        {/* Selo de trilha + disclaimer honesto. */}
        <Card title="Trilha de boa-fé — verificação de integridade">
          <p className="card-sub">
            O verificador recomputa o hash-chain dos eventos da auditoria. Re-verificação ≠
            re-execução — o painel apenas lê o selo.
          </p>
          <p className={styles.selo}>
            {verif.ok ? (
              <StatusBadge view={{ variant: "success", glyph: "✓", label: "Cadeia íntegra" }} />
            ) : (
              <StatusBadge view={{ variant: "danger", glyph: "!", label: "Cadeia inconsistente — conferir" }} />
            )}
            <span className={styles.seloMeta}>
              {verif.checked} evento(s) verificado(s); {verif.failures.length} falha(s). head:{" "}
              <span className="mono num">{verif.headHash ?? "—"}</span>
            </span>
          </p>
        </Card>

        <Card title="Linguagem segura (G6) e limites">
          <p className="disclaimer">
            <strong>indício</strong> · base sintética (Fase 1) · leitura que{" "}
            <strong>agrega e prioriza</strong> as frentes — sem cruzar clientes entre módulos
            (identidades distintas até a unificação por CNPJ). Este painel não promete crédito
            garantido, apuração correta, ausência de multa nem prova jurídica plena; não declara
            cliente "regular" nem "sem risco". A revisão e a ação (responder intimação, renovar
            CND, regularizar parcelamento, conduzir transação) são atos do{" "}
            <strong>contador / tributarista</strong>. As consultas reais via Integra Contador
            (SERPRO) / Infosimples e a unificação de identidade por CNPJ são gate do founder.
          </p>
        </Card>

        <p className={styles.rodapeSelo} role="note">
          <span className={styles.rodapeGlyph} aria-hidden="true">
            ◇
          </span>
          Dados de demonstração (base sintética). O painel é leitura cross-módulo; adapters reais
          e unificação de cliente por CNPJ = gate.
        </p>
      </div>
    </>
  );
}
