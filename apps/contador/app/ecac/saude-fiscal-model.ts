/**
 * S3 + S5 — Engines PUROS de saúde fiscal da carteira (e-CAC · add-on premium, D9).
 *
 * Estende o módulo e-CAC existente (cockpit sintético) com a camada PROATIVA que a
 * pesquisa (handoff 58 §4) elegeu como diferencial: triagem da caixa postal por relevância
 * (S3) e renovação proativa de CND amarrada à trilha de boa-fé (S5). Aqui mora SÓ a regra
 * pura e testável; a origem do dado fica no contrato (saude-fiscal-provider.ts) e a
 * apresentação no feed (AlertasSaudeFiscal.tsx).
 *
 * Co-localizado em app/ecac/ DE PROPÓSITO (auto-contido, bounded context FF-1): reusa
 * apenas tipos compartilhados via `import type` (StatusView de @/lib/status, stripado em
 * runtime) e o vocabulário de certidão já definido em ecac-model.ts. NÃO toca lib/api.ts,
 * packages/* nem o motor de auditoria do core — e-CAC é produto/bolso SEPARADO (D9), então
 * o evento de trilha de S5 é modelado como DADO PURO aqui, sem acoplar ao registrarAnalise
 * do core (ver SugestaoSaudeFiscal + TODO de wiring no fim deste arquivo).
 *
 * Pureza (CONTEXT §5): nenhuma função consulta rede/filesystem nem chama Date.now(). O
 * "hoje" entra SEMPRE por parâmetro (`refIso`) — determinístico e testável, exatamente como
 * parcelamentos-model.ts. As datas-limite de intimação também entram como dado, não são
 * inferidas de relógio.
 *
 * G6 (CONTEXT §5 #4; doc 45): nada aqui afirma "regularizado", "garantido", "resolvido" nem
 * "em dia" como promessa. A plataforma TRIA e SUGERE; renovar a CND / responder a intimação é
 * ação CONFIRMADA pelo contador (human-in-loop). Linguagem: "indício de pendência",
 * "CND a vencer", "renovação sugerida".
 */
import type { StatusView } from "@/lib/status";
import type { CndChave, SituacaoCertidao } from "./ecac-model";

// ===========================================================================
// S3 — Triagem de relevância da caixa postal
// ===========================================================================

/**
 * Nível de triagem de uma mensagem da caixa postal (semáforo). SEMPRE redundante
 * (cor + glyph + label — DESIGN §3). As labels descrevem a RELEVÂNCIA da mensagem para
 * a decisão do contador; nenhuma promete desfecho.
 *
 * - critico    → intimação/exigência com possível prazo correndo (ou prazo já no limite/expirado).
 * - atencao    → comunicado da Receita (marca "!") ou aviso de pendência sem prazo cravado.
 * - informativo→ recibo/confirmação/informe sem ação imediata.
 */
export type NivelTriagem = "critico" | "atencao" | "informativo";

export interface NivelTriagemView extends StatusView {
  nivel: NivelTriagem;
  /** Frase curta e G6-safe (o "por que importa"). */
  hint: string;
}

export const NIVEL_TRIAGEM: Record<NivelTriagem, NivelTriagemView> = {
  critico: {
    nivel: "critico",
    variant: "danger",
    glyph: "▼",
    label: "Crítico",
    hint: "Indício de intimação/exigência com prazo. Sugerimos abrir e revisar com prioridade.",
  },
  atencao: {
    nivel: "atencao",
    variant: "warning",
    glyph: "!",
    label: "Atenção",
    hint: "Comunicado da Receita (marca “!”) ou aviso de pendência. Sugerimos revisar.",
  },
  informativo: {
    nivel: "informativo",
    variant: "neutral",
    glyph: "✓",
    label: "Informativo",
    hint: "Recibo/confirmação sem ação imediata aparente. Leitura quando possível.",
  },
};

/**
 * Mensagem BRUTA da caixa postal — a ENTRADA da triagem, antes de classificar. É o que um
 * adapter real (Integra Contador / CAIXAPOSTAL — handoff 58 §3) precisa entregar.
 *
 * `prazoLimiteIso` é a data-limite quando a mensagem É uma intimação com prazo cravado
 * (extraída do corpo pelo adapter real; aqui vem do seed). Quando a mensagem não tem prazo,
 * fica null — a triagem NÃO inventa prazo. `marcaReceita` reflete a marca "!" que o e-CAC
 * usa para sinalizar comunicado oficial da Receita.
 */
export interface MensagemCaixaBruta {
  id: string;
  clienteId: string;
  clienteNome: string;
  assunto: string;
  remetente: string;
  recebidaEmIso: string;
  /** Estado inicial de leitura (a UI controla o "lida" vivo). */
  lida: boolean;
  /** Marca "!" da Receita (comunicado oficial) — sinal de relevância do próprio e-CAC. */
  marcaReceita: boolean;
  /** true quando a mensagem é uma intimação/exigência (gera dever de resposta). */
  intimacao: boolean;
  /** Data-limite ISO da intimação, quando houver. null = sem prazo cravado (não inferir). */
  prazoLimiteIso: string | null;
}

/** Janela (dias) a partir da qual uma intimação com prazo é considerada "urgente". */
export const JANELA_PRAZO_URGENTE_DIAS = 7;

/** Situação do prazo de uma intimação, derivada do "hoje" e da data-limite. */
export type SituacaoPrazo =
  | "expirado"
  | "no_limite"
  | "urgente"
  | "folgado"
  | "sem_prazo"
  | "ilegivel";

export interface SituacaoPrazoView extends StatusView {
  situacao: SituacaoPrazo;
}

export const SITUACAO_PRAZO: Record<SituacaoPrazo, SituacaoPrazoView> = {
  expirado: { situacao: "expirado", variant: "danger", glyph: "✕", label: "Prazo expirado" },
  no_limite: { situacao: "no_limite", variant: "danger", glyph: "▼", label: "Vence hoje" },
  urgente: { situacao: "urgente", variant: "warning", glyph: "⧗", label: "Prazo curto" },
  folgado: { situacao: "folgado", variant: "neutral", glyph: "◷", label: "Prazo em aberto" },
  sem_prazo: { situacao: "sem_prazo", variant: "neutral", glyph: "—", label: "Sem prazo cravado" },
  ilegivel: { situacao: "ilegivel", variant: "danger", glyph: "!", label: "Prazo ilegível — conferir no portal" },
};

/** Brasília = UTC-3 (sem horário de verão desde 2019). */
const OFFSET_BRT_MS = -3 * 60 * 60 * 1000;
const DIA_MS = 1000 * 60 * 60 * 24;

/**
 * Nº do dia-calendário em BRT de um instante ISO (`NaN` se a data for ilegível).
 *
 * Prazo fiscal é dia-CALENDÁRIO no fuso de Brasília. Comparar timestamps crus (com
 * hora-do-dia) faz a classe deslocar ±1 dia conforme a hora — off-by-one real quando
 * um adapter entrega a data à meia-noite UTC ou em `-03:00`. Normalizamos ao dia BRT
 * antes do diff: wall-clock BRT = t + OFFSET_BRT_MS; o nº do dia = floor(wall / DIA_MS).
 */
function diaCalendarioBRT(iso: string): number {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return NaN;
  return Math.floor((t + OFFSET_BRT_MS) / DIA_MS);
}

/**
 * Diferença em DIAS-CALENDÁRIO BRT (b - a). `NaN` se alguma data for ilegível —
 * o chamador deve tratar NaN como banda de erro VISÍVEL, nunca como prazo folgado.
 */
function diffDias(aIso: string, bIso: string): number {
  return diaCalendarioBRT(bIso) - diaCalendarioBRT(aIso);
}

/**
 * Classifica a situação do prazo de uma intimação a partir do "hoje" (PURO).
 * `prazoLimiteIso` null → "sem_prazo" (a triagem não inventa janela).
 *  data ilegível → "ilegivel" (banda de erro VISÍVEL; nunca degrada para folgado).
 *  dias < 0  → expirado · dias = 0 → no_limite · 0<dias≤7 → urgente · >7 → folgado.
 */
export function situacaoPrazo(prazoLimiteIso: string | null, refIso: string): SituacaoPrazo {
  if (!prazoLimiteIso) return "sem_prazo";
  const dias = diffDias(refIso, prazoLimiteIso);
  if (Number.isNaN(dias)) return "ilegivel";
  if (dias < 0) return "expirado";
  if (dias === 0) return "no_limite";
  if (dias <= JANELA_PRAZO_URGENTE_DIAS) return "urgente";
  return "folgado";
}

/** Uma mensagem já triada — o que o feed/UI consome. */
export interface MensagemTriada extends MensagemCaixaBruta {
  nivel: NivelTriagemView;
  situacaoPrazo: SituacaoPrazoView;
  /**
   * Dias restantes até a data-limite da intimação (negativo = já passou). null quando não
   * há prazo cravado. Calculado a partir do "hoje" passado por parâmetro.
   */
  diasRestantes: number | null;
}

/** Severidade da banda de triagem (pior primeiro) — ordenação e KPIs. */
const PESO_TRIAGEM: Record<NivelTriagem, number> = {
  critico: 0,
  atencao: 1,
  informativo: 2,
};

/**
 * Classifica UMA mensagem (PURO). Regra de relevância (handoff 58 §4, S3):
 *  - intimação (gera dever de resposta) → "critico" (independe de já estar no limite/folgado;
 *    o que muda é a situacaoPrazo derivada).
 *  - marca "!" da Receita OU remetente da Receita sem ser intimação → "atencao".
 *  - demais (recibos/confirmações) → "informativo".
 *
 * @param refIso "hoje" (passado pela page) — ancora o cálculo do prazo restante.
 */
export function triarMensagem(m: MensagemCaixaBruta, refIso: string): MensagemTriada {
  const sit = situacaoPrazo(m.prazoLimiteIso, refIso);
  const diasBrutos = m.prazoLimiteIso ? diffDias(refIso, m.prazoLimiteIso) : null;
  // Data ilegível (NaN) não vira número silencioso — vira null (a banda "ilegivel" sinaliza).
  const diasRestantes = diasBrutos !== null && Number.isNaN(diasBrutos) ? null : diasBrutos;

  let nivel: NivelTriagem;
  if (m.intimacao) {
    nivel = "critico";
  } else if (m.marcaReceita) {
    nivel = "atencao";
  } else {
    nivel = "informativo";
  }

  return {
    ...m,
    nivel: NIVEL_TRIAGEM[nivel],
    situacaoPrazo: SITUACAO_PRAZO[sit],
    diasRestantes,
  };
}

/**
 * Tria e ORDENA a caixa postal (PURO). Crítico primeiro; dentro do mesmo nível, prazo mais
 * apertado primeiro (expirado/no_limite acima de folgado), depois mais recente. Mensagens
 * sem prazo vão para o fim do seu nível. Determinístico a partir de refIso.
 *
 * @param mensagens lista bruta da caixa postal (de qualquer cliente).
 * @param refIso    "hoje".
 */
export function triarMensagens(mensagens: MensagemCaixaBruta[], refIso: string): MensagemTriada[] {
  return mensagens
    .map((m) => triarMensagem(m, refIso))
    .sort((a, b) => {
      const d = PESO_TRIAGEM[a.nivel.nivel] - PESO_TRIAGEM[b.nivel.nivel];
      if (d !== 0) return d;
      // Mesmo nível: prazo mais apertado primeiro. Sem prazo (null) vai para o fim.
      const da = a.diasRestantes ?? Number.POSITIVE_INFINITY;
      const db = b.diasRestantes ?? Number.POSITIVE_INFINITY;
      if (da !== db) return da - db;
      // Empate: mais recente primeiro (recebidaEm desc), depois id (estável).
      const t = new Date(b.recebidaEmIso).getTime() - new Date(a.recebidaEmIso).getTime();
      if (t !== 0) return t;
      return a.id.localeCompare(b.id);
    });
}

/** Resumo da triagem da caixa postal (KPIs do feed). */
export interface ResumoTriagem {
  total: number;
  criticas: number;
  atencao: number;
  informativas: number;
  /** Intimações com prazo expirado OU vencendo hoje — o subconjunto mais urgente. */
  prazosNoLimite: number;
}

/** Agrega o resumo da triagem (PURO). */
export function resumirTriagem(triadas: MensagemTriada[]): ResumoTriagem {
  let criticas = 0;
  let atencaoN = 0;
  let informativas = 0;
  let prazosNoLimite = 0;
  for (const m of triadas) {
    if (m.nivel.nivel === "critico") criticas += 1;
    else if (m.nivel.nivel === "atencao") atencaoN += 1;
    else informativas += 1;
    if (m.situacaoPrazo.situacao === "expirado" || m.situacaoPrazo.situacao === "no_limite") {
      prazosNoLimite += 1;
    }
  }
  return {
    total: triadas.length,
    criticas,
    atencao: atencaoN,
    informativas,
    prazosNoLimite,
  };
}

/** True se a mensagem merece destaque no feed (crítica ou de atenção). Puro. */
export function ehRelevante(nivel: NivelTriagem): boolean {
  return nivel === "critico" || nivel === "atencao";
}

// ===========================================================================
// S5 — Renovação proativa de CND
// ===========================================================================

/**
 * Esfera de uma certidão (CND) — espelha o vocabulário das 4 certidões do e-CAC
 * (ecac-model.ts) e acrescenta o eixo "municipal", que a pesquisa (handoff 58 §3) lista
 * como cobertura Infosimples (CND municipal). Mantemos um tipo PRÓPRIO aqui (não reusamos
 * CndChave direto) porque o eixo de renovação é por ESFERA, não pela coluna da tabela.
 */
export type EsferaCnd = "federal" | "estadual" | "municipal" | "trabalhista" | "fgts";

export interface EsferaCndView {
  esfera: EsferaCnd;
  rotulo: string;
  /** Provedor que cobre a consulta real (handoff 58 §3) — só para o selo honesto/header. */
  provedor: string;
}

export const ESFERA_CND: Record<EsferaCnd, EsferaCndView> = {
  federal: { esfera: "federal", rotulo: "CND Federal / PGFN", provedor: "Infosimples (Fase)" },
  estadual: { esfera: "estadual", rotulo: "CND Estadual (ICMS)", provedor: "Infosimples (Fase)" },
  municipal: { esfera: "municipal", rotulo: "CND Municipal (ISS)", provedor: "Infosimples (Fase)" },
  trabalhista: {
    esfera: "trabalhista",
    rotulo: "CND Trabalhista (CNDT)",
    provedor: "Infosimples (Fase)",
  },
  fgts: { esfera: "fgts", rotulo: "Regularidade FGTS (CRF)", provedor: "Infosimples (Fase)" },
};

/** Mapa opcional de uma esfera de renovação para a coluna do cockpit e-CAC (quando há). */
export const ESFERA_PARA_CND_CHAVE: Partial<Record<EsferaCnd, CndChave>> = {
  federal: "cndFederal",
  estadual: "cndEstadual",
  trabalhista: "cndTrabalhista",
  fgts: "fgts",
};

/** Banda de prioridade de renovação de uma CND (semáforo). Sempre redundante (cor+glyph+label). */
export type PrioridadeRenovacao = "vencida" | "vence_em_breve" | "vigente";

export interface PrioridadeRenovacaoView extends StatusView {
  prioridade: PrioridadeRenovacao;
  hint: string;
}

export const PRIORIDADE_RENOVACAO: Record<PrioridadeRenovacao, PrioridadeRenovacaoView> = {
  vencida: {
    prioridade: "vencida",
    variant: "danger",
    glyph: "✕",
    label: "CND vencida",
    hint: "A validade da certidão já passou. Renovação sugerida com prioridade.",
  },
  vence_em_breve: {
    prioridade: "vence_em_breve",
    variant: "warning",
    glyph: "⧗",
    label: "CND a vencer",
    hint: "A validade da certidão está próxima do fim. Renovação sugerida na janela.",
  },
  vigente: {
    prioridade: "vigente",
    variant: "success",
    glyph: "✓",
    label: "CND vigente",
    hint: "Validade ainda em aberto na consulta sintética. Sem renovação sugerida agora.",
  },
};

/**
 * CND BRUTA por cliente/esfera — a ENTRADA do detector. É o que um adapter real (Infosimples
 * — handoff 58 §3) precisaria entregar: cliente, esfera, situação extraída e a data de
 * validade da certidão emitida. `situacao` reusa o vocabulário do e-CAC (SituacaoCertidao).
 */
export interface CndBruta {
  id: string;
  clienteId: string;
  clienteNome: string;
  documento: string;
  esfera: EsferaCnd;
  /** Situação fiscal extraída (regular / pendente / vencida) — vocabulário e-CAC. */
  situacao: SituacaoCertidao;
  /** Validade ISO da certidão atualmente emitida. null = não há certidão vigente conhecida. */
  validadeIso: string | null;
}

/** Janela default (dias) para considerar uma CND "a vencer" e sugerir renovação. */
export const JANELA_RENOVACAO_DIAS = 30;

/** Um item da fila de renovação — uma CND priorizada para renovação sugerida. */
export interface ItemRenovacaoCnd {
  cnd: CndBruta;
  esferaView: EsferaCndView;
  prioridade: PrioridadeRenovacaoView;
  /**
   * Dias até a validade (negativo = já vencida). null quando não há validade conhecida —
   * nesse caso, se a situação fiscal não for "regular", entra como "vencida" por precaução
   * (indício de pendência sem certidão vigente). Calculado a partir do "hoje".
   */
  diasAteVencer: number | null;
}

/** Severidade da prioridade (pior primeiro). */
const PESO_PRIORIDADE: Record<PrioridadeRenovacao, number> = {
  vencida: 0,
  vence_em_breve: 1,
  vigente: 2,
};

/**
 * Deriva a prioridade de renovação de UMA CND (PURO).
 *
 * Regra (handoff 58 §4, S5):
 *  - sem validade conhecida (null):
 *      • situação não-regular → "vencida" (indício de pendência sem certidão vigente);
 *      • situação regular     → "vigente" (nada a renovar agora).
 *  - validade no passado (dias < 0)          → "vencida".
 *  - validade dentro da janela (0..N dias)   → "vence_em_breve".
 *  - validade além da janela                 → "vigente".
 *
 * @param janelaDias janela "a vencer" (default 30).
 */
export function prioridadeRenovacao(
  cnd: CndBruta,
  refIso: string,
  janelaDias: number = JANELA_RENOVACAO_DIAS,
): { prioridade: PrioridadeRenovacao; diasAteVencer: number | null } {
  if (cnd.validadeIso == null) {
    const prioridade: PrioridadeRenovacao = cnd.situacao === "regular" ? "vigente" : "vencida";
    return { prioridade, diasAteVencer: null };
  }
  const dias = diffDias(refIso, cnd.validadeIso);
  // Validade presente mas ilegível (NaN): fail-safe → entra na fila como "vencida"
  // (indício a conferir), nunca degrada para "vigente" e some do radar.
  if (Number.isNaN(dias)) {
    return { prioridade: "vencida", diasAteVencer: null };
  }
  let prioridade: PrioridadeRenovacao;
  if (dias < 0) prioridade = "vencida";
  else if (dias <= janelaDias) prioridade = "vence_em_breve";
  else prioridade = "vigente";
  return { prioridade, diasAteVencer: dias };
}

/**
 * Detecta as CNDs a vencer/vencidas e devolve a FILA DE RENOVAÇÃO priorizada (PURO).
 *
 * Já vencidas no topo, depois as que vencem mais cedo; empate por cliente/esfera (estável).
 * As vigentes (fora da janela) NÃO entram na fila — só o que merece renovação sugerida.
 *
 * @param cnds      lista bruta de CNDs por cliente/esfera.
 * @param refIso    "hoje".
 * @param janelaDias janela "a vencer" (default 30).
 */
export function detectarCndsAVencer(
  cnds: CndBruta[],
  refIso: string,
  janelaDias: number = JANELA_RENOVACAO_DIAS,
): ItemRenovacaoCnd[] {
  return cnds
    .map((cnd) => {
      const { prioridade, diasAteVencer } = prioridadeRenovacao(cnd, refIso, janelaDias);
      return {
        cnd,
        esferaView: ESFERA_CND[cnd.esfera],
        prioridade: PRIORIDADE_RENOVACAO[prioridade],
        diasAteVencer,
      };
    })
    .filter((item) => item.prioridade.prioridade !== "vigente")
    .sort((a, b) => {
      const d = PESO_PRIORIDADE[a.prioridade.prioridade] - PESO_PRIORIDADE[b.prioridade.prioridade];
      if (d !== 0) return d;
      // Mesma banda: vence mais cedo primeiro. null (sem validade) vai para o fim da banda.
      const da = a.diasAteVencer ?? Number.POSITIVE_INFINITY;
      const db = b.diasAteVencer ?? Number.POSITIVE_INFINITY;
      if (da !== db) return da - db;
      const c = a.cnd.clienteNome.localeCompare(b.cnd.clienteNome, "pt-BR");
      if (c !== 0) return c;
      return a.cnd.esfera.localeCompare(b.cnd.esfera);
    });
}

/** Resumo da fila de renovação (KPIs). */
export interface ResumoRenovacao {
  /** Total de CNDs na fila (vencidas + a vencer). */
  naFila: number;
  vencidas: number;
  aVencer: number;
  /** Nº de clientes distintos com ao menos uma CND na fila. */
  clientesAfetados: number;
}

/** Agrega o resumo da fila de renovação (PURO). */
export function resumirRenovacao(fila: ItemRenovacaoCnd[]): ResumoRenovacao {
  let vencidas = 0;
  let aVencer = 0;
  const clientes = new Set<string>();
  for (const item of fila) {
    if (item.prioridade.prioridade === "vencida") vencidas += 1;
    else if (item.prioridade.prioridade === "vence_em_breve") aVencer += 1;
    clientes.add(item.cnd.clienteId);
  }
  return { naFila: fila.length, vencidas, aVencer, clientesAfetados: clientes.size };
}

// ===========================================================================
// S5 — Evento de trilha (SUGESTÃO, não execução)
// ===========================================================================

/**
 * Evento de TRILHA de boa-fé gerado ao enfileirar uma renovação de CND (S5). É uma
 * SUGESTÃO — não uma execução: registra que a plataforma SINALIZOU o indício e que a
 * decisão de renovar é do contador (human-in-loop, CONTEXT §5 #1). Nada aqui renova,
 * emite ou paga.
 *
 * ┌─ POR QUE É DADO PURO E NÃO registrarAnalise DO CORE (D9 / handoff 58 §5) ──────────────┐
 * │ e-CAC é ADD-ON premium, produto/bolso SEPARADO do core (D9). Acoplar este evento ao    │
 * │ motor de auditoria do core (@synkra/contador-api-client registrarAnalise) violaria a   │
 * │ separação — misturaria a trilha da NOTA (core) com a trilha da SITUAÇÃO FISCAL da       │
 * │ carteira (add-on). Por isso o evento é modelado AQUI como dado puro, com a MESMA FORMA  │
 * │ do evento de boa-fé do core (ator/tipo/referente/payload) para que, quando o wiring     │
 * │ real existir (Fase — trilha própria do add-on e-CAC ou um tópico separado em            │
 * │ core_api_v1), baste mapear este shape → o gravador, sem reescrever a regra.             │
 * │ ⚠️ TODO (wiring real): persistir via a trilha do ADD-ON e-CAC (hash-chain própria),     │
 * │ NÃO via registrarAnalise do core. Gate: definição da trilha do add-on (Fase).           │
 * └────────────────────────────────────────────────────────────────────────────────────────┘
 *
 * Linguagem G6: tipo "renovacao_cnd_sugerida" — SUGERIDA, nunca "renovada"/"regularizada".
 */
export interface SugestaoSaudeFiscal {
  /** Tipo do evento — espelha o vocabulário de TipoEvento do core, no eixo do add-on e-CAC. */
  tipo: "renovacao_cnd_sugerida";
  /** Quem originou o sinal: o monitor (motor) detectou; o ator humano confirma depois. */
  atorTipo: "motor";
  /** O que o evento referencia. */
  referenteTipo: "cnd";
  /** ID estável da CND referenciada (o item da fila). */
  referenteId: string;
  clienteId: string;
  clienteNome: string;
  esfera: EsferaCnd;
  /** Banda que disparou a sugestão (vencida / a vencer). Nunca "vigente". */
  prioridade: Exclude<PrioridadeRenovacao, "vigente">;
  /** Dias até a validade no momento da sugestão (negativo = já vencida; null = sem validade). */
  diasAteVencer: number | null;
  /** "Hoje" em que a sugestão foi gerada (determinístico — vem por parâmetro). */
  refIso: string;
  /** Descrição G6-safe do indício (o "por que sugerimos"). */
  descricao: string;
}

/**
 * Monta o evento de trilha (PURO) para um item da fila de renovação. NÃO persiste — só
 * produz o dado. O gravador real (TODO acima) consome este shape.
 *
 * Itens vigentes não deveriam chegar aqui (a fila já os excluiu); por segurança, tratamos
 * "vigente" como ausência de sugestão devolvendo null.
 *
 * @param item   item da fila de renovação.
 * @param refIso "hoje" em que a sugestão é gerada (determinístico — vem por parâmetro).
 */
export function montarSugestaoRenovacao(
  item: ItemRenovacaoCnd,
  refIso: string,
): SugestaoSaudeFiscal | null {
  const banda = item.prioridade.prioridade;
  if (banda === "vigente") return null;

  const esferaRotulo = item.esferaView.rotulo;
  const descricao =
    banda === "vencida"
      ? `Indício: a ${esferaRotulo} de ${item.cnd.clienteNome} consta vencida na consulta sintética. ` +
        "Renovação sugerida — a decisão e a emissão são do contador."
      : `Indício: a ${esferaRotulo} de ${item.cnd.clienteNome} está a vencer na janela monitorada. ` +
        "Renovação sugerida — a decisão e a emissão são do contador.";

  return {
    tipo: "renovacao_cnd_sugerida",
    atorTipo: "motor",
    referenteTipo: "cnd",
    referenteId: item.cnd.id,
    clienteId: item.cnd.clienteId,
    clienteNome: item.cnd.clienteNome,
    esfera: item.cnd.esfera,
    prioridade: banda,
    diasAteVencer: item.diasAteVencer,
    refIso,
    descricao,
  };
}

/**
 * Gera UM evento de SUGESTÃO de trilha por item da fila de renovação (PURO). É o lote de
 * eventos que o wiring real persistiria ao "abrir" a fila do dia. Determinístico.
 *
 * @param fila   fila de renovação priorizada (saída de detectarCndsAVencer).
 * @param refIso "hoje" em que as sugestões são geradas.
 */
export function gerarSugestoesTrilha(
  fila: ItemRenovacaoCnd[],
  refIso: string,
): SugestaoSaudeFiscal[] {
  return fila
    .map((item) => montarSugestaoRenovacao(item, refIso))
    .filter((e): e is SugestaoSaudeFiscal => e !== null);
}
