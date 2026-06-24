import "server-only";

/**
 * Motor REAL da RECUPERAÇÃO (módulo #4) — liga `detectarMonofasicoLote` sobre
 * notas-amostra parseadas para que o INDÍCIO de crédito monofásico seja COMPUTADO
 * (não mais hard-coded).
 *
 *   XML seed (app/recuperacao/seeds/, sintético por cliente)
 *     → parseNFe                (@synkra/contador-parser: doc + proveniência)
 *     → paraItensFiscais        (@synkra/contador-parser: itens tipados c/ PIS/COFINS)
 *     → detectarMonofasicoLote  (@synkra/contador-motor-fiscal: crédito potencial real)
 *
 * É "MOTOR REAL sobre notas-amostra": cada cliente do dossiê tem 1+ seed XML; o motor
 * lê o valor envolvido, calcula a confiança calibrada e a banda, e marca o que bloqueia
 * auto-aprovação. A extrapolação retroativa (5 anos) e o split do success-fee seguem
 * ILUSTRATIVOS e claramente rotulados — o que mudou é a FONTE do indício (agora o motor).
 *
 * `import "server-only"` (LGPD — CONTEXT §7): parse + motor SÓ no servidor. O cliente
 * recebe apenas o view-model serializável (CasoRecuperacao), nunca o XML cru.
 *
 * REUSO (IDS): mesma técnica de wiring de `app/reconhecimento/recognize.ts` —
 * deep import da base DRAFT (monofasico-ncm-v0-draft.json → ReferenciaMonofasico) e
 * resolução do seed via createRequire (como `app/reconhecimento/fixtures.ts`). Nenhuma
 * régua nova é inventada aqui; nenhuma dependência circular (engine não importa data).
 *
 * G6: o motor produz INDÍCIOS. Baixa confiança bloqueia auto-aprovação e vai para
 * revisão humana (CRC). Nada aqui é crédito garantido nem apuração correta.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parseNFe, paraItensFiscais, ParseError } from "@synkra/contador-parser";
import type { DocumentoFiscal, ItemFiscalRecuperacao } from "@synkra/contador-parser";
import { detectarMonofasicoLote } from "@synkra/contador-motor-fiscal";
import type {
  ApontamentoCandidato,
  ContextoMotor,
  ItemComTributo,
  ReferenciaMonofasico,
} from "@synkra/contador-motor-fiscal";

// Mesma base DRAFT que o módulo #5 (Reconhecimento) já consome (deep import de data/).
import refMonofasicoDoc from "@synkra/contador-motor-fiscal/data/monofasico-ncm-v0-draft.json";

import {
  BANDA_RECUPERACAO,
  ESTAGIO_RECUPERACAO,
  VIA_RECEBIMENTO,
  bandaDoMotor,
  calcularSplit,
  projetarRetroativoIlustrativo,
  type AnoEstimativa,
  type BandaRecuperacao,
  type CasoRecuperacao,
  type EvidenciaItem,
  type IndicioRecuperacao,
  type ProjecaoRetroativa,
  type RegimeTributario,
} from "./recuperacao-model";
import { CLIENTES_SEED, type ClienteSeed, type ItemSeed } from "./recuperacao-seeds";

const MOTOR_VERSAO_ID = "motor-fiscal-v0-recuperacao";

/** Base monofásica DRAFT carregada UMA vez (régua → ReferenciaMonofasico do motor). */
const refMonofasico = refMonofasicoDoc as ReferenciaMonofasico;

/** Contexto compartilhado do motor (threshold default 0.7 = §5.3 "onde NÃO sei"). */
const contexto: ContextoMotor = { motorVersaoId: MOTOR_VERSAO_ID };

/**
 * Pesos (mais recente → mais antigo) da distribuição ILUSTRATIVA do retroativo por ano.
 * A quebra ano a ano NÃO é produzida pelo motor (ele é por-item, não por-ano): mantemos
 * a agregação sintética determinística e claramente rotulada como ilustrativa.
 */
const PESOS_ANO = [0.27, 0.23, 0.2, 0.17, 0.13];

/** Resolve o diretório seeds/ deste módulo (server-side), uma única vez. */
let seedsDir: string | null = null;
function resolverSeedsDir(): string {
  if (seedsDir) return seedsDir;
  const aqui = path.dirname(fileURLToPath(import.meta.url));
  seedsDir = path.join(aqui, "seeds");
  return seedsDir;
}

/** Lê o XML de um seed (server-side). Lança se o arquivo não existir. */
function lerSeedXml(arquivo: string): string {
  // Seeds são locais ao módulo (app/recuperacao/seeds/), resolvidos via import.meta.url
  // — não dependem de cwd. Diferente de fixtures.ts, que resolve o PACOTE do parser.
  return readFileSync(path.join(resolverSeedsDir(), arquivo), "utf8");
}

/**
 * Quebra ILUSTRATIVA ano a ano (5 anos) de uma estimativa retroativa. Determinística:
 * anos recentes concentram mais valor e têm mais notas/maior confiança; anos antigos
 * rebaixam a banda (menos evidência). Espelha a derivação sintética anterior — é a
 * camada ILUSTRATIVA por cima do número-base do motor.
 */
function derivarPorAno(
  estimativaTotal: number,
  bandaIndicio: BandaRecuperacao,
  anoBase: number,
): AnoEstimativa[] {
  const severidade: Record<BandaRecuperacao, number> = { baixa: 0, media: 1, alta: 2 };
  const escala: BandaRecuperacao[] = ["baixa", "media", "alta"];
  const anos: AnoEstimativa[] = [];
  let alocado = 0;
  for (let k = 0; k < PESOS_ANO.length; k++) {
    const ano = anoBase - k;
    const ultimo = k === PESOS_ANO.length - 1;
    const estimativa = ultimo
      ? Math.max(0, estimativaTotal - alocado)
      : Math.round(estimativaTotal * PESOS_ANO[k]);
    alocado += estimativa;
    const degrau = k >= 3 ? 1 : 0;
    const idx = Math.max(0, severidade[bandaIndicio] - degrau);
    anos.push({ ano, estimativa, notas: 18 - k * 3, banda: escala[idx] });
  }
  return anos;
}

/**
 * Evidências do dossiê para um indício COMPUTADO pelo motor. A 1ª classe (XML
 * estruturado/assinado) é REAL (veio do parse); as demais espelham o que o dossiê
 * reúne para revisão. Banda da 1ª evidência reflete a proveniência do parser.
 */
function montarEvidencias(
  item: ItemFiscalRecuperacao,
  bandaIndicio: BandaRecuperacao,
): EvidenciaItem[] {
  const assinado = item.proveniencia.assinado;
  const evidencias: EvidenciaItem[] = [
    {
      rotulo: "Nota-amostra de entrada (XML parseado pelo motor)",
      detalhe: assinado
        ? "NF-e com CST/NCM lidos pelo parser e bloco de assinatura presente — base de 1ª classe do indício."
        : "NF-e com CST/NCM lidos pelo parser, sem bloco de assinatura — proveniência mais fraca.",
      banda: assinado ? "alta" : "media",
    },
    {
      rotulo: "Memória de apuração PIS/COFINS",
      detalhe: "Recolhimento do período cruzado com o regime do item (indício de duplicidade).",
      banda: "media",
    },
    {
      rotulo: "Enquadramento de NCM (família monofásica)",
      detalhe: "NCM da nota conferido contra a lista monofásica DRAFT — a confirmar item a item (CRC).",
      banda: bandaIndicio === "baixa" ? "baixa" : "media",
    },
  ];
  return evidencias;
}

/** Evidência para um item que o MOTOR NÃO flagrou (abstenção honesta). */
function evidenciasAbstencao(): EvidenciaItem[] {
  return [
    {
      rotulo: "Nota-amostra de entrada (XML parseado pelo motor)",
      detalhe:
        "NF-e lida pelo parser; o motor NÃO identificou família monofásica para o NCM — sem indício de crédito a projetar.",
      banda: "baixa",
    },
    {
      rotulo: "Revisão de produto pendente (CRC)",
      detalhe:
        "Classificação do item a verificar pelo contador habilitado: provável tributação normal, não monofásico.",
      banda: "baixa",
    },
  ];
}

/** Texto curto de natureza do indício a partir do apontamento do motor (regime-aware). */
function naturezaDoApontamento(
  item: ItemSeed,
  ap: ApontamentoCandidato | null,
  regime: RegimeTributario,
): string {
  if (!ap) {
    return "Motor abstém — NCM fora de família monofásica conhecida (provável tributação normal; revisar produto).";
  }
  const apuracaoSimples =
    regime === "simples"
      ? " No Simples Nacional o crédito é por SEGREGAÇÃO DE RECEITA (não por alíquota federal):" +
        " requer apuração — não projetamos número."
      : "";
  return (
    `Família monofásica "${ap.cclasstribReferencia}" tributada com CST PIS/COFINS de regime normal ` +
    `na revenda — indício de crédito potencialmente recuperável (computado pelo motor).` +
    (item.naturezaExtra ? ` ${item.naturezaExtra}` : "") +
    apuracaoSimples
  );
}

/**
 * Constrói um IndicioRecuperacao a partir de UM item-seed: parseia o XML, roda o motor
 * monofásico e usa o apontamento real (valor/confiança/banda/fundamento/proveniência).
 * A projeção retroativa é REGIME-AWARE (alíquota por regime; Simples = requer apuração).
 * Quando o motor abstém (item não-monofásico), devolve um indício SEM crédito (honesto).
 */
function construirIndicio(
  item: ItemSeed,
  regime: RegimeTributario,
  anoBase: number,
): IndicioRecuperacao {
  let doc: DocumentoFiscal;
  try {
    const xml = lerSeedXml(item.arquivo);
    doc = parseNFe(xml);
  } catch (err) {
    // Seed corrompida/ausente: degrada para indício ilustrativo zerado (não quebra a tela).
    if (!(err instanceof ParseError) && !(err instanceof Error)) throw err;
    return indicioVazio(item, regime, anoBase, "ilustrativo");
  }

  const itens: ItemFiscalRecuperacao[] = paraItensFiscais(doc);
  const itemFiscal = itens[0];
  if (!itemFiscal) return indicioVazio(item, regime, anoBase, "ilustrativo");

  const apontamentos = detectarMonofasicoLote(
    itens as unknown as ItemComTributo[],
    refMonofasico,
    contexto,
  );
  const ap = apontamentos.find((a) => a.itemId === itemFiscal.id) ?? apontamentos[0] ?? null;

  // --- Caso A: motor abstém (sem apontamento monofásico) → indício honesto sem crédito.
  if (!ap) {
    return {
      produto: item.produto,
      ncm: itemFiscal.ncm ?? item.ncmEsperado,
      natureza: naturezaDoApontamento(item, null, regime),
      banda: "baixa",
      estimativaRetroativo: 0,
      fundamento: item.fundamentoFallback,
      porAno: derivarPorAno(0, "baixa", anoBase),
      evidencias: evidenciasAbstencao(),
      temIndicioMotor: false,
      // Projeção zerada SEM requerApuracao: aqui o motor não achou indício (não é Simples-bloqueio).
      projecao: projetarRetroativoIlustrativo(0, regime),
      proveniencia: {
        fonte: "motor",
        classeInsumo: itemFiscal.proveniencia.classeInsumo,
        amostra: item.arquivo,
        assinado: itemFiscal.proveniencia.assinado,
        confianca: 0,
        bloqueiaAutoAprovacao: true,
        valorEnvolvidoBase: itemFiscal.valor,
      },
    };
  }

  // --- Caso B: motor computou o indício → tudo deriva do apontamento real.
  const banda: BandaRecuperacao = bandaDoMotor(ap.bandaConfianca);
  // Projeção REGIME-AWARE: real=9,25% / presumido=3,65% / simples=requer apuração (R$0).
  const projecao: ProjecaoRetroativa = projetarRetroativoIlustrativo(ap.valorEnvolvido, regime);
  const estimativaRetroativo = projecao.estimativa5Anos; // 0 no Simples (não contribui ao KPI)
  // Fundamento real do apontamento (família monofásica) com fallback se a base não trouxer.
  const fundamento =
    ap.fundamento.length > 0 ? ap.fundamento[0] : item.fundamentoFallback;

  return {
    produto: item.produto,
    ncm: itemFiscal.ncm ?? item.ncmEsperado,
    natureza: naturezaDoApontamento(item, ap, regime),
    banda,
    estimativaRetroativo,
    fundamento,
    porAno: derivarPorAno(estimativaRetroativo, banda, anoBase),
    evidencias: montarEvidencias(itemFiscal, banda),
    temIndicioMotor: true, // o motor DETECTOU o indício; no Simples só a projeção requer apuração
    projecao,
    proveniencia: {
      fonte: "motor",
      classeInsumo: itemFiscal.proveniencia.classeInsumo,
      amostra: item.arquivo,
      assinado: itemFiscal.proveniencia.assinado,
      confianca: ap.confianca,
      bloqueiaAutoAprovacao: ap.bloqueiaAutoAprovacao,
      valorEnvolvidoBase: ap.valorEnvolvido,
    },
  };
}

/** Indício vazio (fallback defensivo): sem crédito, marcado como não-computado. */
function indicioVazio(
  item: ItemSeed,
  regime: RegimeTributario,
  anoBase: number,
  fonte: "motor" | "ilustrativo",
): IndicioRecuperacao {
  return {
    produto: item.produto,
    ncm: item.ncmEsperado,
    natureza: "Nota-amostra indisponível — sem indício a computar.",
    banda: "baixa",
    estimativaRetroativo: 0,
    fundamento: item.fundamentoFallback,
    porAno: derivarPorAno(0, "baixa", anoBase),
    evidencias: evidenciasAbstencao(),
    temIndicioMotor: false,
    projecao: projetarRetroativoIlustrativo(0, regime),
    proveniencia: {
      fonte,
      classeInsumo: "xml",
      amostra: item.arquivo,
      assinado: false,
      confianca: 0,
      bloqueiaAutoAprovacao: true,
      valorEnvolvidoBase: 0,
    },
  };
}

/** Pior banda entre os indícios COM crédito (mais conservadora). */
function piorBanda(indicios: IndicioRecuperacao[]): BandaRecuperacao {
  const severidade: Record<BandaRecuperacao, number> = { baixa: 0, media: 1, alta: 2 };
  const comCredito = indicios.filter((i) => i.estimativaRetroativo > 0);
  const alvo = comCredito.length > 0 ? comCredito : indicios;
  let pior: BandaRecuperacao = "alta";
  for (const i of alvo) {
    if (severidade[i.banda] < severidade[pior]) pior = i.banda;
  }
  return pior;
}

/** Monta o caso de um cliente: roda o motor em cada seed e agrega (regime-aware). */
function construirCaso(cliente: ClienteSeed, anoBase: number): CasoRecuperacao {
  const indicios = cliente.itens.map((it) =>
    construirIndicio(it, cliente.regime, anoBase),
  );
  // No Simples, estimativaRetroativo é 0 em todos (segregação de receita): KPI/split = R$0.
  const estimativaTotal = indicios.reduce((acc, i) => acc + i.estimativaRetroativo, 0);
  const pior = piorBanda(indicios);
  return {
    clienteId: cliente.clienteId,
    clienteNome: cliente.clienteNome,
    segmento: cliente.segmento,
    regime: cliente.regime,
    estagio: ESTAGIO_RECUPERACAO[cliente.estagio],
    bandaCaso: BANDA_RECUPERACAO[pior],
    indicios,
    estimativaTotal,
    viaSugerida: VIA_RECEBIMENTO[cliente.via],
    split: calcularSplit(estimativaTotal),
  };
}

/**
 * Entrada PÚBLICA do engine (server-side): roda o MOTOR REAL sobre os seeds de todos
 * os clientes e devolve os casos prontos para a UI. `anoBase` vem da page (Server) para
 * manter a quebra ano a ano reproduzível.
 */
export function computarCasosRecuperacao(anoBase: number): CasoRecuperacao[] {
  return CLIENTES_SEED.map((cliente) => construirCaso(cliente, anoBase));
}
