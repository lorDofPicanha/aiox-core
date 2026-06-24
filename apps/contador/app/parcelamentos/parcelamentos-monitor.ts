/**
 * PAR-3 — Monitor de transições de risco de rescisão (lógica PURA).
 *
 * Compara DUAS leituras da carteira (snapshot anterior × snapshot atual) e identifica quem
 * MUDOU de banda de risco — em especial quem PIOROU (ex.: entrou em "risco de rescisão
 * iminente" ou atingiu o limite). É o coração do alerta proativo (PAR-4): só o que mudou
 * desde a última leitura merece destaque "NOVO hoje".
 *
 * Garantias (handoff 57 §4, DoD PAR-3):
 *   - IDEMPOTENTE: a mesma entrada produz a mesma saída; sem efeito colateral.
 *   - SEM Date.now() embutido: a data de referência entra por parâmetro (vinda das leituras).
 *   - PURA: não consulta rede, não persiste, não muta as entradas.
 *
 * O monitor NÃO age (não regulariza, não adere — handoff 57 §3/§5/§6): só DETECTA a
 * transição. A decisão é do contador (human-in-loop, CONTEXT §5 #1). Linguagem G6: o que
 * sai daqui é "indício" de mudança de risco, nunca promessa.
 */
import {
  classificarRisco,
  type NivelRisco,
  type ParcelamentoSeed,
  type RiscoRescisao,
} from "./parcelamentos-model";

/**
 * Severidade da banda de risco (quanto MENOR, pior). Espelha o PESO_RISCO do model, mas é
 * declarado aqui para o monitor não depender de detalhe interno do model — o monitor só
 * precisa saber "qual banda é pior" para decidir o que é uma PIORA.
 *
 * Ordem (pior → melhor): rescindido < iminente < atencao < manual ≈ ok.
 * "manual" (PGFN/estadual) fica fora da escala de piora modelável — tratado à parte.
 */
const SEVERIDADE: Record<NivelRisco, number> = {
  rescindido: 0,
  iminente: 1,
  atencao: 2,
  manual: 3,
  ok: 4,
};

/** Direção da transição entre duas leituras. */
export type DirecaoTransicao = "piorou" | "melhorou" | "estavel" | "novo";

/**
 * Uma transição detectada para um parcelamento entre o snapshot anterior e o atual.
 * Carrega o suficiente para o feed PAR-4 montar a mensagem sem reclassificar nada.
 */
export interface TransicaoRisco {
  /** ID estável do parcelamento (mesmo nos dois snapshots). */
  id: string;
  clienteNome: string;
  programa: string;
  /** Banda de risco no snapshot anterior (null se o parcelamento não existia antes). */
  nivelAnterior: NivelRisco | null;
  /** Banda de risco no snapshot atual. */
  nivelAtual: NivelRisco;
  /** Risco completo atual (parcelas em atraso, faltam p/ limite, janela) — p/ a mensagem. */
  riscoAtual: RiscoRescisao;
  direcao: DirecaoTransicao;
  /**
   * true quando a transição representa uma PIORA para uma banda de risco de rescisão
   * (entrou/avançou em iminente ou rescindido) — é o que o feed marca como "NOVO hoje".
   */
  entrouEmRisco: boolean;
}

/** True se o nível é uma banda de risco de rescisão modelável (iminente ou limite atingido). */
function ehBandaDeRisco(nivel: NivelRisco): boolean {
  return nivel === "iminente" || nivel === "rescindido";
}

/**
 * Detecta as transições de banda de risco entre dois snapshots da carteira (PURO).
 *
 * @param snapshotAnterior  leitura anterior (ex.: a de ontem). Pode ser null/[] (1ª leitura).
 * @param snapshotAtual     leitura corrente.
 * @param refIsoAnterior    data de referência do snapshot anterior (ancora seus vencimentos).
 * @param refIsoAtual       data de referência do snapshot atual.
 * @returns                 uma transição por parcelamento do snapshot atual, com a direção.
 *                          Ordenada: piores e mais recentes primeiro (entrouEmRisco no topo).
 *
 * Idempotente: chamar de novo com as mesmas entradas devolve o mesmo array.
 */
export function detectarTransicoes(
  snapshotAnterior: ParcelamentoSeed[] | null,
  snapshotAtual: ParcelamentoSeed[],
  refIsoAnterior: string,
  refIsoAtual: string,
): TransicaoRisco[] {
  // Mapa do estado anterior por id, para lookup O(1) sem mutar a entrada.
  const anteriorPorId = new Map<string, ParcelamentoSeed>();
  for (const p of snapshotAnterior ?? []) anteriorPorId.set(p.id, p);

  const transicoes: TransicaoRisco[] = snapshotAtual.map((atual) => {
    const riscoAtual = classificarRisco(atual, refIsoAtual);
    const nivelAtual = riscoAtual.nivel.nivel;

    const antes = anteriorPorId.get(atual.id);
    if (!antes) {
      // Parcelamento que não existia no snapshot anterior: é NOVO na carteira.
      return {
        id: atual.id,
        clienteNome: atual.clienteNome,
        programa: atual.programa,
        nivelAnterior: null,
        nivelAtual,
        riscoAtual,
        direcao: "novo" as DirecaoTransicao,
        entrouEmRisco: ehBandaDeRisco(nivelAtual),
      };
    }

    const nivelAnterior = classificarRisco(antes, refIsoAnterior).nivel.nivel;
    const delta = SEVERIDADE[nivelAtual] - SEVERIDADE[nivelAnterior];
    // delta < 0 → ficou MAIS severo (piorou). delta > 0 → melhorou. 0 → estável.
    const direcao: DirecaoTransicao = delta < 0 ? "piorou" : delta > 0 ? "melhorou" : "estavel";

    // "Entrou em risco" = piorou E agora está numa banda de rescisão (e antes não estava,
    // ou avançou de iminente p/ rescindido). É o gatilho do destaque "NOVO hoje" no feed.
    const entrouEmRisco =
      direcao === "piorou" && ehBandaDeRisco(nivelAtual) && !ehBandaDeRisco(nivelAnterior)
        ? true
        : direcao === "piorou" && nivelAnterior === "iminente" && nivelAtual === "rescindido";

    return {
      id: atual.id,
      clienteNome: atual.clienteNome,
      programa: atual.programa,
      nivelAnterior,
      nivelAtual,
      riscoAtual,
      direcao,
      entrouEmRisco,
    };
  });

  // Ordena: quem entrou em risco hoje primeiro; depois por severidade da banda atual;
  // empate por nome (estável para reprodutibilidade).
  return transicoes.sort((a, b) => {
    if (a.entrouEmRisco !== b.entrouEmRisco) return a.entrouEmRisco ? -1 : 1;
    const d = SEVERIDADE[a.nivelAtual] - SEVERIDADE[b.nivelAtual];
    if (d !== 0) return d;
    return a.clienteNome.localeCompare(b.clienteNome, "pt-BR");
  });
}

/**
 * Filtra só as transições que entraram/avançaram em risco de rescisão DESDE a última
 * leitura — o conjunto "novidades de hoje" que o feed PAR-4 marca como NOVO. Puro.
 */
export function transicoesNovasEmRisco(transicoes: TransicaoRisco[]): TransicaoRisco[] {
  return transicoes.filter((t) => t.entrouEmRisco);
}

/** Conjunto de IDs que viraram risco hoje (lookup rápido para a UI marcar "NOVO"). */
export function idsNovosEmRisco(transicoes: TransicaoRisco[]): Set<string> {
  return new Set(transicoesNovasEmRisco(transicoes).map((t) => t.id));
}
