"use server";

/**
 * Server Action do Reconhecimento (módulo #5 — pipeline REAL).
 *
 * O parsing e a classificação rodam AQUI, no servidor (recognize.ts é
 * `server-only`). O cliente envia só (a) o id da amostra a reconhecer OU (b) o
 * XML colado; recebe de volta o view-model serializável. O XML cru não é
 * re-processado no browser (LGPD — CONTEXT §7) e nunca é persistido nesta tela
 * (Fase 1 = reconhecimento ao vivo; captura/persistência é Fase B).
 *
 * G6: a Action devolve INDÍCIOS calibrados (com banda/fatores). Nada é aprovado
 * automaticamente — a tela sinaliza; a decisão é humana (CRC).
 */

import { reconhecerXml } from "./recognize";
import { lerFixture } from "./fixtures";
import { RECONHECIMENTO_VAZIO, type ReconhecimentoView } from "./recognize-view";

const TAMANHO_MAX_XML = 2_000_000; // ~2 MB: NF-e/NFC-e cabem com folga; corta abuso.

export async function reconhecerAction(
  _prev: ReconhecimentoView,
  formData: FormData,
): Promise<ReconhecimentoView> {
  const fixtureId = String(formData.get("fixtureId") ?? "").trim();
  const xmlColado = String(formData.get("xml") ?? "").trim();

  // Caminho A — amostra pré-carregada (fixture real do parser).
  if (fixtureId) {
    try {
      const { rotulo, xml } = lerFixture(fixtureId);
      return reconhecerXml(xml, rotulo);
    } catch {
      return {
        ...RECONHECIMENTO_VAZIO,
        origem: fixtureId,
        erro: {
          codigo: "AMOSTRA_INDISPONIVEL",
          mensagem: "Amostra não encontrada. Selecione outra ou cole um XML próprio.",
          campo: null,
        },
      };
    }
  }

  // Caminho B — XML colado pelo usuário.
  if (!xmlColado) {
    return {
      ...RECONHECIMENTO_VAZIO,
      erro: {
        codigo: "ENTRADA_VAZIA",
        mensagem: "Selecione uma amostra ou cole o XML de uma NF-e / NFC-e para reconhecer.",
        campo: null,
      },
    };
  }
  if (xmlColado.length > TAMANHO_MAX_XML) {
    return {
      ...RECONHECIMENTO_VAZIO,
      origem: "XML colado",
      erro: {
        codigo: "XML_GRANDE_DEMAIS",
        mensagem: "O conteúdo é grande demais para uma NF-e/NFC-e. Confira se colou só um documento.",
        campo: null,
      },
    };
  }

  return reconhecerXml(xmlColado, "XML colado");
}
