"use server";

/**
 * Server Actions da Aprovação CRC (F1.4 — cerimônia graduada, DESIGN §6.4).
 *
 * O ato de decidir é PRIVATIVO do contador (CRC ativo) e PESADO: a confirmação
 * explícita (digitar CONFIRMO ou o nº do CRC) é validada AQUI no servidor, não só
 * na UI. Isso torna "aprovação em lote silenciosa" impossível mesmo se o client
 * for contornado — cada chamada decide UM apontamento e exige a confirmação
 * individual. A mutação chama a RPC do core (aprovar/rejeitar_apontamento), que
 * grava o nó na trilha de boa-fé (hash-chain real) com o snapshot do revisor.
 *
 * G6: nada aqui promete crédito garantido nem apuração correta.
 */

import { revalidatePath } from "next/cache";
import { getApi, ESCRITORIO_ID } from "@/lib/api";
import { MOTIVOS_VALIDOS, type AcaoState } from "@/app/aprovacao/decision-config";

/** Confirmações aceitas: a palavra CONFIRMO (case-insensitive) OU o nº exato do CRC. */
function confirmacaoValida(digitado: string, crc: string): boolean {
  const v = digitado.trim();
  if (v.length === 0) return false;
  if (v.toUpperCase() === "CONFIRMO") return true;
  // Comparação robusta do CRC (ignora pontuação/caixa — o "1SP-099999/O-0" tem variações).
  const norm = (s: string) => s.replace(/[\s./-]/g, "").toUpperCase();
  return norm(v) === norm(crc);
}

/** Resolve o contador habilitado (CRC ativo) que assina o ato. */
async function resolverContador() {
  const api = await getApi();
  const contadores = await api.listarContadores(ESCRITORIO_ID);
  const ativo = contadores.find((u) => u.crc != null && u.crcSituacao === "ativo");
  return { api, contador: ativo ?? null };
}

/**
 * Aprovar UM apontamento (ato privativo · cerimônia graduada).
 * Exige confirmação digitada (CONFIRMO ou CRC) — sem ela, NÃO aprova.
 */
export async function aprovarAction(
  _prev: AcaoState,
  formData: FormData,
): Promise<AcaoState> {
  const apontamentoId = String(formData.get("apontamentoId") ?? "");
  const confirmacao = String(formData.get("confirmacao") ?? "");

  if (!apontamentoId) {
    return { ok: false, message: "Apontamento não identificado.", carimbo: null };
  }

  const { api, contador } = await resolverContador();
  if (!contador) {
    return {
      ok: false,
      message: "Nenhum contador com CRC ativo disponível — ato privativo bloqueado.",
      carimbo: null,
    };
  }

  if (!confirmacaoValida(confirmacao, contador.crc!)) {
    return {
      ok: false,
      message:
        'Confirmação inválida. Digite a palavra CONFIRMO ou o número do seu CRC para assinar este ato individualmente.',
      carimbo: null,
    };
  }

  try {
    await api.aprovarApontamento({
      apontamentoId,
      revisorId: contador.id,
      motivoCodigo: "aprovado",
      motivoTexto: `Aprovado individualmente por ${contador.nome} (CRC ${contador.crc}).`,
    });
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Falha ao aprovar o apontamento.",
      carimbo: null,
    };
  }

  revalidatePath(`/aprovacao/${apontamentoId}`);
  revalidatePath("/aprovacao");
  revalidatePath("/trilha");
  revalidatePath("/fila");
  revalidatePath("/");

  return {
    ok: true,
    message: "Apontamento aprovado e carimbado na trilha de boa-fé.",
    carimbo: {
      decisao: "aprovado",
      nome: contador.nome,
      crc: contador.crc!,
      crcUf: contador.crcUf,
      habilitacao: `Contador habilitado · CRC ${contador.crcSituacao ?? "ativo"}`,
      quando: new Date().toISOString(),
      motivoCodigo: null,
    },
  };
}

/**
 * Rejeitar UM apontamento (rejeição MOTIVADA · ck_rejeicao_motivada).
 * Exige motivoCodigo de um vocabulário fechado + confirmação digitada.
 */
export async function rejeitarAction(
  _prev: AcaoState,
  formData: FormData,
): Promise<AcaoState> {
  const apontamentoId = String(formData.get("apontamentoId") ?? "");
  const motivoCodigo = String(formData.get("motivoCodigo") ?? "");
  const motivoTexto = String(formData.get("motivoTexto") ?? "").trim();
  const confirmacao = String(formData.get("confirmacao") ?? "");

  if (!apontamentoId) {
    return { ok: false, message: "Apontamento não identificado.", carimbo: null };
  }
  if (!motivoCodigo || !MOTIVOS_VALIDOS.has(motivoCodigo)) {
    return {
      ok: false,
      message: "Selecione um motivo de rejeição (rejeição não pode ser silenciosa).",
      carimbo: null,
    };
  }

  const { api, contador } = await resolverContador();
  if (!contador) {
    return {
      ok: false,
      message: "Nenhum contador com CRC ativo disponível — ato privativo bloqueado.",
      carimbo: null,
    };
  }

  if (!confirmacaoValida(confirmacao, contador.crc!)) {
    return {
      ok: false,
      message:
        'Confirmação inválida. Digite a palavra CONFIRMO ou o número do seu CRC para assinar a rejeição.',
      carimbo: null,
    };
  }

  try {
    await api.rejeitarApontamento({
      apontamentoId,
      revisorId: contador.id,
      motivoCodigo,
      motivoTexto: motivoTexto.length > 0 ? motivoTexto : null,
    });
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Falha ao rejeitar o apontamento.",
      carimbo: null,
    };
  }

  revalidatePath(`/aprovacao/${apontamentoId}`);
  revalidatePath("/aprovacao");
  revalidatePath("/trilha");
  revalidatePath("/fila");
  revalidatePath("/");

  return {
    ok: true,
    message: "Apontamento rejeitado com motivo registrado na trilha de boa-fé.",
    carimbo: {
      decisao: "rejeitado",
      nome: contador.nome,
      crc: contador.crc!,
      crcUf: contador.crcUf,
      habilitacao: `Contador habilitado · CRC ${contador.crcSituacao ?? "ativo"}`,
      quando: new Date().toISOString(),
      motivoCodigo,
    },
  };
}
