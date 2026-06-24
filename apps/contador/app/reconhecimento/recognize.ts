import "server-only";

/**
 * Motor de RECONHECIMENTO — wiring REAL do pipeline end-to-end (módulo #5).
 *
 *   XML (NF-e / NFC-e)
 *     → parseNFe            (@synkra/contador-parser, R1/R2: doc + proveniência)
 *     → paraItensFiscais    (@synkra/contador-parser, R3: itens tipados)
 *     → classificarLote     (@synkra/contador-motor-fiscal: cClassTrib divergente)
 *     → detectarMonofasicoLote (@synkra/contador-motor-fiscal: crédito potencial)
 *
 * `import "server-only"`: este módulo SÓ pode ser importado do servidor (Server
 * Component / Server Action). O XML fiscal cru e o processamento NÃO trafegam
 * para o browser (LGPD — CONTEXT §7). O cliente recebe apenas o view-model
 * serializável (ReconhecimentoView), nunca o XML nem o documento parseado cru.
 *
 * REUSO (IDS): as bases de referência são as MESMAS que o resto do app já usa —
 *   - cClassTrib: carregarRuleset() adapta a régua DRAFT (ruleset-cclasstrib-v0-draft.json)
 *     -> BaseReferencia do motor (mesmo adaptador de @synkra/contador-api-client).
 *   - monofásico: monofasico-ncm-v0-draft.json -> ReferenciaMonofasico do motor.
 * Nenhuma régua nova é inventada aqui (G6 / consistência da trilha).
 *
 * G6: o motor produz INDÍCIOS. Baixa confiança bloqueia auto-aprovação e vai
 * para revisão humana (CRC). Nada aqui é crédito garantido nem apuração correta.
 */

import { parseNFe, paraItensFiscais, ParseError } from "@synkra/contador-parser";
import type { DocumentoFiscal, ItemFiscalRecuperacao } from "@synkra/contador-parser";
import {
  classificarLote,
  detectarMonofasicoLote,
} from "@synkra/contador-motor-fiscal";
import type {
  ApontamentoCandidato,
  ContextoMotor,
  ReferenciaMonofasico,
  ItemComTributo,
} from "@synkra/contador-motor-fiscal";

import { carregarRuleset, type RulesetDocumento } from "@synkra/contador-api-client";
// Mesmas bases DRAFT que o app já consome (deep import de data/, como lib/api.ts).
import rulesetDoc from "@synkra/contador-motor-fiscal/data/ruleset-cclasstrib-v0-draft.json";
import refMonofasicoDoc from "@synkra/contador-motor-fiscal/data/monofasico-ncm-v0-draft.json";

import {
  type ApontamentoView,
  type DocumentoView,
  type FatorView,
  type ItemView,
  type ProvenienciaView,
  type ReconhecimentoView,
  rotuloDivergencia,
  rotuloModelo,
} from "./recognize-view";

const MOTOR_VERSAO_ID = "motor-fiscal-v0-reconhecimento";

/** Carrega a base cClassTrib UMA vez (régua DRAFT -> BaseReferencia do motor). */
const ruleset = carregarRuleset(rulesetDoc as RulesetDocumento);
const refMonofasico = refMonofasicoDoc as ReferenciaMonofasico;

/** Contexto compartilhado do motor (threshold default 0.7 = §5.3 "onde NÃO sei"). */
const contexto: ContextoMotor = { motorVersaoId: MOTOR_VERSAO_ID };

/**
 * Reconhece UM XML: parse real -> classificação real -> view-model serializável.
 * Erro de parsing (ParseError) é capturado e devolvido TIPADO (G1) — não lança.
 */
export function reconhecerXml(xml: string, origem: string): ReconhecimentoView {
  let doc: DocumentoFiscal;
  try {
    doc = parseNFe(xml);
  } catch (err) {
    return resultadoComErro(origem, err);
  }

  const itens: ItemFiscalRecuperacao[] = paraItensFiscais(doc);

  // Motor real — DUAS análises sobre os MESMOS itens parseados:
  //  (1) cClassTrib divergente (classificarLote consome o subtipo ItemFiscal);
  //  (2) crédito potencial monofásico (detectarMonofasicoLote consome o item
  //      com bloco PIS/COFINS — ItemFiscalRecuperacao é atribuível a ItemComTributo).
  const apClass: ApontamentoCandidato[] = classificarLote(itens, ruleset.base, contexto);
  const apMono: ApontamentoCandidato[] = detectarMonofasicoLote(
    itens as unknown as ItemComTributo[],
    refMonofasico,
    contexto,
  );

  const descricaoPorItem = new Map(itens.map((i) => [i.id, i.descricao]));

  const apontamentos: ApontamentoView[] = [
    ...apClass.map((a) => paraApontamentoView(a, "classificacao", descricaoPorItem)),
    ...apMono.map((a) => paraApontamentoView(a, "monofasico", descricaoPorItem)),
  ];

  const valorEnvolvidoTotal = apontamentos.reduce((acc, a) => acc + a.valorEnvolvido, 0);

  return {
    ok: true,
    origem,
    documento: paraDocumentoView(doc),
    itens: itens.map(paraItemView),
    apontamentos,
    proveniencia: paraProvenienciaView(itens[0]),
    valorEnvolvidoTotal,
    erro: null,
  };
}

function resultadoComErro(origem: string, err: unknown): ReconhecimentoView {
  if (err instanceof ParseError) {
    return {
      ok: false,
      origem,
      documento: null,
      itens: [],
      apontamentos: [],
      proveniencia: null,
      valorEnvolvidoTotal: 0,
      erro: {
        codigo: err.codigo,
        mensagem: err.message,
        campo: err.campo ?? null,
      },
    };
  }
  // Erro inesperado (não-ParseError): degrada sem expor stack ao cliente.
  return {
    ok: false,
    origem,
    documento: null,
    itens: [],
    apontamentos: [],
    proveniencia: null,
    valorEnvolvidoTotal: 0,
    erro: {
      codigo: "ERRO_INESPERADO",
      mensagem:
        "Não foi possível reconhecer este conteúdo. Confira se o XML é uma NF-e/NFC-e 4.00 válida.",
      campo: null,
    },
  };
}

function paraDocumentoView(doc: DocumentoFiscal): DocumentoView {
  return {
    chaveAcesso: doc.chaveAcesso,
    modelo: doc.modelo,
    modeloRotulo: rotuloModelo(doc.modelo),
    serie: doc.serie,
    numero: doc.numero,
    dataEmissao: doc.dataEmissao,
    emitenteNome: doc.emitente.nome ?? "—",
    emitenteDoc: doc.emitente.cnpj ?? doc.emitente.cpf ?? null,
    destinatarioNome: doc.destinatario.nome ?? "Consumidor / não identificado",
    destinatarioDoc: doc.destinatario.cnpj ?? doc.destinatario.cpf ?? null,
    valorTotal: doc.valorTotal,
    qtdItens: doc.itens.length,
    temAssinatura: doc.temAssinatura,
  };
}

function paraItemView(item: ItemFiscalRecuperacao): ItemView {
  // O `id` do parser é {chave}-{nItem}; extrai o nº do item para exibição.
  const numero = Number(item.id.split("-").pop()) || 0;
  return {
    id: item.id,
    numero,
    descricao: item.descricao,
    ncm: item.ncm ?? null,
    cfop: item.cfop ?? null,
    cstIcms: item.cst ?? null,
    cstPis: item.recuperacao.pis.cst ?? null,
    cstCofins: item.recuperacao.cofins.cst ?? null,
    valor: item.valor,
  };
}

function paraProvenienciaView(item: ItemFiscalRecuperacao | undefined): ProvenienciaView | null {
  if (!item) return null;
  return {
    classeInsumo: item.proveniencia.classeInsumo,
    chaveAcesso: item.proveniencia.chaveAcesso,
    assinado: item.proveniencia.assinado,
  };
}

/** Traduz os fatores de confiança do motor (A3) em rótulos legíveis (explicabilidade). */
function paraFatoresView(ap: ApontamentoCandidato): FatorView[] {
  const c = ap.fatoresConfianca.contribuicoes;
  const especificidade =
    ap.fatoresConfianca.especificidadeMatch === "ncm_exato"
      ? "match NCM exato (mais específico)"
      : ap.fatoresConfianca.especificidadeMatch === "ncm_prefixo"
        ? "match por prefixo NCM"
        : "sem NCM (match fraco)";

  const fatores: FatorView[] = [
    {
      rotulo: "Especificidade do match",
      valor: c.base,
      explica: `Ponto de partida pela ${especificidade}.`,
    },
  ];
  if (c.cstCoerente !== 0) {
    fatores.push({
      rotulo: "Coerência do CST PIS/COFINS",
      valor: c.cstCoerente,
      explica:
        c.cstCoerente > 0
          ? "O CST observado é justamente o indício da divergência — reforça a certeza."
          : "CST não reforça o indício.",
    });
  }
  if (c.statusRegra !== 0) {
    fatores.push({
      rotulo: "Status da regra de referência",
      valor: c.statusRegra,
      explica:
        "Base DRAFT / disputada (pendente de validação por tributarista) — puxa a confiança para baixo.",
    });
  }
  if (c.materialidade !== 0) {
    fatores.push({
      rotulo: "Materialidade do item",
      valor: c.materialidade,
      explica: "Item de valor relevante reforça o sinal (mais materialidade = mais confiança).",
    });
  }
  return fatores;
}

function paraApontamentoView(
  ap: ApontamentoCandidato,
  origem: "classificacao" | "monofasico",
  descricoes: Map<string, string>,
): ApontamentoView {
  return {
    itemId: ap.itemId,
    itemDescricao: descricoes.get(ap.itemId) ?? ap.itemId,
    tipoDivergencia: ap.tipoDivergencia,
    tipoDivergenciaRotulo: rotuloDivergencia(ap.tipoDivergencia),
    origem,
    cclasstribReferencia: ap.cclasstribReferencia,
    descricao: ap.descricao,
    valorEnvolvido: ap.valorEnvolvido,
    confianca: ap.confianca,
    bandaConfianca: ap.bandaConfianca,
    bloqueiaAutoAprovacao: ap.bloqueiaAutoAprovacao,
    fatores: paraFatoresView(ap),
    fundamento: ap.fundamento,
    baseVersaoId: ap.baseVersaoId,
    motorVersaoId: ap.motorVersaoId,
  };
}
