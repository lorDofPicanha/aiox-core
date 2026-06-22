"use server";

/**
 * F1.6 — Server Action do verificador da cadeia.
 *
 * O verificador (@synkra/contador-trilha-verifier) usa node:crypto e é SERVER-ONLY —
 * não pode ir pro bundle do browser. Esta action roda verificarCadeia() no servidor a
 * pedido do botão (VerificadorCadeia, client) e devolve só o resultado serializável.
 * Re-verificação ≠ re-execução: não toca o motor nem cria eventos.
 *
 * Segurança/honestidade: a action recarrega a trilha REAL do tenant a partir do client
 * (não confia em eventos vindos do browser) e reverifica a cadeia COMPLETA do tenant.
 * Assim o "verificar" confirma a integridade do que está no backend, não de um payload
 * forjado — e não uma fatia, que por ser não-contígua falharia por construção.
 *
 * G6: confirma integridade técnica da trilha; não é prova jurídica plena (carimbo de
 * tempo formal ACT ICP-Brasil é Fase 4).
 */

import {
  verificarCadeia,
  type EventoBoaFeDump,
  type VerificacaoResultado,
} from "@synkra/contador-trilha-verifier";
import type { EventoBoaFe } from "@synkra/contador-api-client";
import { getApi, ESCRITORIO_ID } from "@/lib/api";

function toDump(e: EventoBoaFe): EventoBoaFeDump {
  return {
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
  };
}

/**
 * Reverifica a cadeia de boa-fé do TENANT (server-side). A trilha é um hash-chain único
 * por escritório; integridade só é verificável sobre a cadeia COMPLETA e contígua. Uma
 * fatia por cliente tem seqs não-contíguos e falharia SEQ_GAP por construção — por isso
 * verificamos o tenant inteiro. (A fatia do cliente aparece como visualização no laudo.)
 */
export async function verificarCadeiaTenant(): Promise<VerificacaoResultado> {
  const api = await getApi();
  const eventos = await api.listarEventos({ escritorioId: ESCRITORIO_ID });
  const cadeia = [...eventos]
    .sort((a, b) => a.seqTenant - b.seqTenant)
    .map(toDump);
  return verificarCadeia(cadeia);
}
