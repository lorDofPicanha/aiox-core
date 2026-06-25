/**
 * S12 — Camada de DADOS do Health Score: reconciliação de carteira + agregação READ-ONLY dos
 * dois lados em EntradaHealthScore[] (consumida pelo engine puro health-score-model.ts).
 *
 * Esta é a única peça do S12 que TOCA as duas origens. Ela é READ-ONLY e compõe na CAMADA DE
 * SCORE (D9): LÊ o core (apontamentos pendentes via carregarFilaPendente) e LÊ o e-CAC (triagem
 * S3 + renovação S5 via os engines existentes), mas NÃO chama nenhum write-path — nem
 * registrarAnalise do core, nem o evento de trilha do e-CAC. O score é uma VIEW; não funde as
 * trilhas (handoff 58 §5, constraint D9).
 *
 * ┌─ 🔴 RECONCILIAÇÃO DE CARTEIRA — a decisão honesta (brief S12, "ponto de integração") ──────┐
 * │ Os dois lados usam ESQUEMAS DE clienteId DIFERENTES, descobertos lendo o código-fonte:     │
 * │   • LADO A (core): UUIDs sintéticos do seed-from-motor.ts —                                │
 * │       "00000000-0000-4000-8000-0000000000a1" (Farmácia Aurora),                            │
 * │       "...00a2" (Posto Brasa), "...00a3" (Mercado Cedro).                                   │
 * │   • LADO B (e-CAC): ids curtos do CARTEIRA_ECAC (ecac-model.ts) — "a1" / "a2" / "a3",       │
 * │       para as MESMAS três empresas (Aurora / Brasa / Cedro).                                │
 * │ Os ids NÃO batem (e os documentos sintéticos dos dois seeds também divergem em a2/a3), então│
 * │ um join silencioso por igualdade de id casaria 0 cliente — ou, pior, fingiria casar. Em vez │
 * │ de inventar isso, declaramos um MAPA DE RECONCILIAÇÃO EXPLÍCITO (MAPA_CLIENTE_ECAC_CORE):   │
 * │ core-UUID → id-curto-eCAC. O score keia pelo clienteId do CORE (a apuração é o moat-âncora).│
 * │                                                                                             │
 * │ ⚠️ TODO (produção): a identidade do cliente é ÚNICA — o CNPJ. Quando os adapters reais      │
 * │ (S1 SERPRO / S4 Infosimples) e o core compartilharem a mesma chave de cliente (CNPJ          │
 * │ normalizado, 14 dígitos), ESTE MAPA SOME e o join vira `core.documento === ecac.documento`.  │
 * │ Gate: adapters reais + unificação da identidade de cliente por CNPJ. Até lá, o mapa é a      │
 * │ ponte honesta entre os dois seeds sintéticos — não um join real disfarçado.                  │
 * └──────────────────────────────────────────────────────────────────────────────────────────┘
 */
import type { ContadorApiClient } from "@synkra/contador-api-client";
import { carregarFilaPendente } from "@/lib/fila-model";
import { CARTEIRA_ECAC } from "@/app/ecac/ecac-model";
import {
  detectarCndsAVencer,
  resumirRenovacao,
  resumirTriagem,
  triarMensagens,
} from "@/app/ecac/saude-fiscal-model";
import { saudeFiscalProvider, ESCRITORIO_SAUDE_DEMO } from "@/app/ecac/saude-fiscal-provider";
import type { EntradaHealthScore, SinalEcacCliente } from "./health-score-model";
import { montarEntradas, type RotuloCliente } from "./health-score-reconcile";

/**
 * 🔴 MAPA DE RECONCILIAÇÃO DE CARTEIRA (core-UUID → id-curto-eCAC). EXPLÍCITO de propósito:
 * documenta que os dois lados são seeds distintos com identidades distintas. Em produção, a
 * identidade é o CNPJ e este mapa some (ver TODO no cabeçalho). Mantido fora do engine puro
 * porque é GLUE de dados (qual id de um lado corresponde ao do outro), não regra de score.
 */
export const MAPA_CLIENTE_ECAC_CORE: Record<string, string> = {
  "00000000-0000-4000-8000-0000000000a1": "a1", // Farmácia Aurora
  "00000000-0000-4000-8000-0000000000a2": "a2", // Posto Brasa
  "00000000-0000-4000-8000-0000000000a3": "a3", // Mercado Cedro
};

// ---------------------------------------------------------------------------
// LADO B — síntese do e-CAC (triagem S3 + renovação S5) por cliente
// ---------------------------------------------------------------------------

/** Síntese e-CAC por cliente (id-curto da CARTEIRA_ECAC) a partir da leitura de saúde fiscal. */
export interface SinalEcacPorCliente {
  porCliente: Map<string, SinalEcacCliente>;
}

/**
 * Agrega a leitura de saúde fiscal (caixa postal + CNDs) em SinalEcacCliente por id-curto. Roda
 * a triagem S3 e a detecção de renovação S5 (engines existentes) e conta por cliente. READ-ONLY:
 * não gera evento de trilha do e-CAC (montarSugestaoRenovacao NÃO é chamado aqui — D9).
 *
 * @param refIso "hoje" — repassado aos engines do e-CAC (prazos/validades determinísticos).
 */
export async function agregarSinalEcac(refIso: string): Promise<Map<string, SinalEcacCliente>> {
  const leitura = await saudeFiscalProvider.listarSaudeFiscal(ESCRITORIO_SAUDE_DEMO, refIso);

  const porCliente = new Map<string, SinalEcacCliente>();
  const garantir = (id: string): SinalEcacCliente => {
    const existente = porCliente.get(id);
    if (existente) return existente;
    const novo: SinalEcacCliente = {
      prazosNoLimite: 0,
      prazosUrgentes: 0,
      cndsVencidas: 0,
      cndsAVencer: 0,
      mensagensCriticasNaoLidas: 0,
    };
    porCliente.set(id, novo);
    return novo;
  };

  // S3 — triagem da caixa postal por cliente.
  const triadas = triarMensagens(leitura.mensagens, leitura.refIso);
  for (const m of triadas) {
    const s = garantir(m.clienteId);
    const sit = m.situacaoPrazo.situacao;
    if (sit === "expirado" || sit === "no_limite") s.prazosNoLimite += 1;
    else if (sit === "urgente") s.prazosUrgentes += 1;
    // Mensagem "!" (intimação/comunicado da Receita) ainda não lida — sinal de atenção.
    const critica = m.nivel.nivel === "critico" || m.nivel.nivel === "atencao";
    if (critica && !m.lida) s.mensagensCriticasNaoLidas += 1;
  }

  // S5 — fila de renovação de CND por cliente (vencidas + a vencer).
  const fila = detectarCndsAVencer(leitura.cnds, leitura.refIso);
  for (const item of fila) {
    const s = garantir(item.cnd.clienteId);
    if (item.prioridade.prioridade === "vencida") s.cndsVencidas += 1;
    else if (item.prioridade.prioridade === "vence_em_breve") s.cndsAVencer += 1;
  }

  return porCliente;
}

// ---------------------------------------------------------------------------
// Reconciliação + montagem das entradas do score
// ---------------------------------------------------------------------------

/** Rótulos (nome/documento) do e-CAC por id-curto — para nomear clientes só-eCAC. */
function rotulosEcac(): Map<string, RotuloCliente> {
  return new Map(
    CARTEIRA_ECAC.map((l) => [l.clienteId, { nome: l.clienteNome, documento: l.documento }]),
  );
}

/**
 * Carrega TUDO (READ-ONLY) e devolve as entradas reconciliadas prontas para rankearCarteira.
 * Junta o lado do core (api) e o lado do e-CAC (provider) — sem tocar write-paths. A junção em si
 * é pura (montarEntradas em health-score-reconcile.ts); aqui só injetamos o mapa + os rótulos.
 *
 * @param api          client do core (mock na Fase 1).
 * @param escritorioId tenant do core.
 * @param refIso       "hoje" para os engines do e-CAC (determinístico — vem da page).
 */
export async function carregarEntradasHealth(
  api: ContadorApiClient,
  escritorioId: string,
  refIso: string,
): Promise<EntradaHealthScore[]> {
  const [clientes, fila, sinalEcac] = await Promise.all([
    api.listarClientes(escritorioId),
    carregarFilaPendente(api, escritorioId),
    agregarSinalEcac(refIso),
  ]);

  const nomesCore = new Map<string, RotuloCliente>(
    clientes.map((c) => [c.id, { nome: c.nome, documento: c.documento }]),
  );

  return montarEntradas(fila, nomesCore, sinalEcac, MAPA_CLIENTE_ECAC_CORE, rotulosEcac());
}

/** Re-export do resumo de triagem/renovação caso a page queira KPIs adicionais do e-CAC. */
export { resumirTriagem, resumirRenovacao };
