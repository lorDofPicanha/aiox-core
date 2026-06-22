/**
 * Seed sintético END-TO-END gerado pelo MOTOR REAL (F1.2).
 *
 * Fluxo (o que liga motor → régua → registrarAnalise → trilha):
 *   1. Carrega a RÉGUA autorada pelos clones (ruleset-cclasstrib-v0-draft.json) via
 *      carregarRuleset() → BaseReferencia do motor + regras disputadas (banda).
 *   2. Monta o universo sintético: 1 escritório, 1 contador-CRC ativo, 3 clientes de
 *      alto SKU (farmácia, posto, mercado/bebidas), notas e itens cobrindo os casos da
 *      régua — incluindo de propósito os casos disputado/baixa-confiança do golden-set.
 *   3. Cria um MockApiClient com store VAZIO de apontamentos (só escritório/clientes/
 *      notas/itens/base/motor) — a trilha nasce só com `nota_recebida`.
 *   4. Roda o MOTOR REAL (classificar) sobre cada item com a base da régua. Para cada
 *      divergência → chama api.registrarAnalise → apontamento pendente + evento
 *      `analise_executada` na trilha (hash-chain real).
 *   5. Itens disputado/baixa-confiança (régua marca DISPUTADO): o motor v0 NÃO sabe
 *      abster (limitação documentada no README do motor). A camada de seed casa o item
 *      pela régua e registra um indício com confianca=null → o MockApiClient deriva
 *      banda_confianca="disputado" → a UI trata como "revisar antes de aprovar / bloqueia
 *      auto-aprovação" (DESIGN §6.3). NÃO afirma certeza onde a régua diz disputado (G6).
 *
 * Fase 2 (Supabase): a MESMA régua e os MESMOS itens rodam contra o client supabase —
 * o ponto de troca é só a factory (createApiClient({mode:"supabase"})); o
 * registrarAnalise vira a RPC core_api_v1.registrar_analise real.
 *
 * Tudo SINTÉTICO e G6-safe. Régua é DRAFT pendente de validação tributarista.
 */

import { classificar, type BaseReferencia, type ItemFiscal } from "@synkra/contador-motor-fiscal";
import { MockApiClient } from "./mock-client";
import type { SeedDataset } from "./mock-data";
import {
  carregarRuleset,
  casarRegra,
  isRegraDisputada,
  type RegraRuleset,
  type RulesetCarregado,
  type RulesetDocumento,
} from "./ruleset";
import type {
  BaseVersao,
  Cliente,
  Escritorio,
  MotorVersao,
  Nota,
  NotaItem,
  TipoDivergencia,
  Usuario,
} from "./types";

// IDs determinísticos sintéticos (compatíveis com lib/api.ts e os smokes existentes).
const ESC = "00000000-0000-4000-8000-000000000001";
const CONTADOR = "00000000-0000-4000-8000-0000000000c0";
const CLI_FARM = "00000000-0000-4000-8000-0000000000a1";
const CLI_POSTO = "00000000-0000-4000-8000-0000000000a2";
const CLI_MERC = "00000000-0000-4000-8000-0000000000a3";
const BASE = "00000000-0000-4000-8000-0000000000b0";
const MOTOR = "00000000-0000-4000-8000-0000000000d0";

const COMP_2026_03 = "2026-03-01";

/** Item sintético + de qual cliente/nota ele vem (espelha um caso da régua/golden-set). */
interface CasoSintetico {
  cliente: string;
  /** Descrição (rótulo de produto, estilo golden-set — sem dado real). */
  descricao: string;
  ncm: string;
  cfop: string;
  cst: string;
  /** cClassTrib que veio "informado" na nota (o que o contribuinte lançou). */
  cclasstribInformado: string;
  valor: number;
  /** Rótulo do caso (rastreabilidade contra o golden-set). */
  caseRef: string;
}

/**
 * Casos sintéticos cobrindo a régua. Espelham os fixtures do golden-set candidato
 * (case-farm-001 etc.), incluindo de PROPÓSITO os disputado/abster (etanol, cerveja,
 * NCM residual). Sem nota fiscal real — rótulos ilustrativos autorados pelos clones.
 */
const CASOS: CasoSintetico[] = [
  // FARMÁCIA — divergência monofásica clara (motor aponta). Régua: farm-3004 (media).
  {
    cliente: CLI_FARM,
    descricao: "DIPIRONA SODICA 500MG 10 COMPRIMIDOS",
    ncm: "30049069",
    cfop: "5405",
    cst: "01",
    cclasstribInformado: "200999",
    valor: 38.9,
    caseRef: "case-farm-001-monofasico-claro",
  },
  // FARMÁCIA — já correto (motor NÃO aponta; controle de falso-positivo). Régua: farm-3004.
  {
    cliente: CLI_FARM,
    descricao: "AMOXICILINA 500MG 21 CAPSULAS",
    ncm: "30042029",
    cfop: "5405",
    cst: "04",
    cclasstribInformado: "200001",
    valor: 42.5,
    caseRef: "case-farm-002-ja-correto",
  },
  // FARMÁCIA — NCM residual 3004.90.99: DISPUTADO/baixa confiança → banda "disputado".
  {
    cliente: CLI_FARM,
    descricao: "PRODUTO SAUDE LINHA XYZ (descricao generica)",
    ncm: "30049099",
    cfop: "5405",
    cst: "01",
    cclasstribInformado: "200001",
    valor: 89.0,
    caseRef: "case-farm-003-ncm-residual-abster",
  },
  // POSTO — gasolina monofásica clara (motor aponta). Régua: posto-2710-gasolina.
  {
    cliente: CLI_POSTO,
    descricao: "GASOLINA COMUM",
    ncm: "27101259",
    cfop: "5656",
    cst: "01",
    cclasstribInformado: "000000",
    valor: 4500.0,
    caseRef: "case-posto-001-gasolina-monofasico",
  },
  // POSTO — etanol: zona cinzenta DISPUTADA → banda "disputado".
  {
    cliente: CLI_POSTO,
    descricao: "ETANOL HIDRATADO COMBUSTIVEL",
    ncm: "22072011",
    cfop: "5656",
    cst: "01",
    cclasstribInformado: "000000",
    valor: 3200.0,
    caseRef: "case-posto-002-etanol-disputado",
  },
  // MERCADO/BEBIDAS — água classificada como refrigerante (motor aponta). Régua: beb-2201.
  {
    cliente: CLI_MERC,
    descricao: "AGUA MINERAL NATURAL SEM GAS 500ML (CAIXA)",
    ncm: "22011000",
    cfop: "5405",
    cst: "01",
    cclasstribInformado: "200100",
    valor: 340.0,
    caseRef: "case-beb-001-agua-vs-refri",
  },
  // MERCADO/BEBIDAS — cerveja / Imposto Seletivo DISPUTADO → banda "disputado".
  {
    cliente: CLI_MERC,
    descricao: "CERVEJA PILSEN LATA 350ML (FARDO 12UN)",
    ncm: "22030000",
    cfop: "5405",
    cst: "01",
    cclasstribInformado: "000000",
    valor: 91.2,
    caseRef: "case-beb-002-cerveja-imposto-seletivo-disputado",
  },
];

function uuidFromIndex(prefix: string, i: number): string {
  // Último grupo do UUID = 12 hex chars (prefixo + índice zero-padded).
  const suffix = `${prefix}${String(i)}`.padStart(12, "0");
  return `00000000-0000-4000-8000-${suffix}`;
}

function buildUniverso(rs: RulesetCarregado): {
  dataset: SeedDataset;
  itens: NotaItem[];
} {
  const escritorio: Escritorio = {
    id: ESC,
    nome: "Escritório Demonstração (sintético)",
    plano: "concierge",
    createdAt: "2026-03-02T09:00:00.000Z",
  };

  const contador: Usuario = {
    id: CONTADOR,
    escritorioId: ESC,
    nome: "Marina Couto (demo)",
    email: "marina.couto@demo.contador.local",
    papel: "contador",
    cpf: "12345678901",
    crc: "1SP-099999/O-0",
    crcUf: "SP",
    crcSituacao: "ativo",
    ativo: true,
  };

  const clientes: Cliente[] = [
    { id: CLI_FARM, escritorioId: ESC, nome: "Farmácia Aurora Ltda (demo)", documento: "11222333000181" },
    { id: CLI_POSTO, escritorioId: ESC, nome: "Posto Brasa Combustíveis ME (demo)", documento: "22333444000172" },
    { id: CLI_MERC, escritorioId: ESC, nome: "Mercado Cedro — Bebidas SA (demo)", documento: "33444555000163" },
  ];

  const baseReferencia: BaseVersao = {
    id: BASE,
    rotulo: `${rs.baseVersaoRotulo} (sintética — DRAFT pendente validação tributarista)`,
    fonte: "regua-clones-draft",
    vigenteDesde: "2026-01-01",
    sintetica: true,
  };

  const motor: MotorVersao = {
    id: MOTOR,
    rotulo: "motor-f1-regras-deterministicas (demo)",
    codigoVersao: "0.1.0",
    tipoInferencia: "regra_deterministica",
    status: "vigente",
  };

  // Uma nota por caso (granularidade simples e auditável na demo).
  const notas: Nota[] = [];
  const itens: NotaItem[] = [];
  CASOS.forEach((caso, i) => {
    const notaId = uuidFromIndex("f", i + 1);
    const itemId = uuidFromIndex("1", i + 1);
    const origem: Nota["origem"] = caso.cliente === CLI_POSTO ? "provider_ocr" : "upload";
    notas.push({
      id: notaId,
      escritorioId: ESC,
      clienteId: caso.cliente,
      competencia: COMP_2026_03,
      tipo: "nfe",
      direcao: "venda",
      numero: String(1000 + i + 1),
      serie: "1",
      emitidaEm: "2026-03-15",
      emitenteCnpj: "11222333000181",
      destinatarioDoc: "99888777000166",
      valorTotal: caso.valor,
      origem,
      classeInsumo: origem === "provider_ocr" ? "ocr" : "xml",
      statusAuditoria: "analisada",
    });
    itens.push({
      id: itemId,
      escritorioId: ESC,
      notaId,
      competencia: COMP_2026_03,
      numeroItem: 1,
      descricao: caso.descricao,
      ncm: caso.ncm,
      cfop: caso.cfop,
      cst: caso.cst,
      cclasstribInformado: caso.cclasstribInformado,
      quantidade: 1,
      valorItem: caso.valor,
    });
  });

  const dataset: SeedDataset = {
    escritorio,
    contador,
    clientes,
    notas,
    itens,
    baseReferencia,
    motor,
    apontamentos: [], // VAZIO de propósito: tudo nasce do motor via registrarAnalise.
  };

  return { dataset, itens };
}

/** Estatística do seed (reportada pelo script e pelo smoke). */
export interface SeedEstatistica {
  clientes: number;
  notas: number;
  itens: number;
  apontamentos: number;
  disputados: number;
  /** Apontamentos produzidos pelo motor por divergência de cClassTrib. */
  porMotorDivergencia: number;
}

/**
 * Constrói o MockApiClient JÁ POPULADO pelo motor.
 *
 * @param doc régua parseada (ruleset-cclasstrib-v0-draft.json).
 * @returns o client + a estatística do seed.
 */
export async function seedFromMotor(
  doc: RulesetDocumento,
): Promise<{ api: MockApiClient; stats: SeedEstatistica }> {
  const rs = carregarRuleset(doc);
  const { dataset, itens } = buildUniverso(rs);

  // Base do motor carimba a VERSÃO da régua no baseVersaoId (P22 / trilha).
  const baseMotor: BaseReferencia = rs.base;
  const baseVersaoIdSeed = dataset.baseReferencia.id;

  const api = new MockApiClient(dataset);

  let porMotorDivergencia = 0;
  let disputados = 0;

  for (const item of itens) {
    const itemFiscal: ItemFiscal = {
      id: item.id,
      descricao: item.descricao,
      ncm: item.ncm ?? undefined,
      cfop: item.cfop ?? undefined,
      cst: item.cst ?? undefined,
      cclasstribInformado: item.cclasstribInformado ?? undefined,
      valor: item.valorItem,
    };
    const clienteId = notaClienteDoItem(dataset, item.id);

    // (a) Item disputado/baixa-confiança: o motor v0 não abstém — a CAMADA DE SEED
    //     registra um indício com confianca=null → banda "disputado" na UI.
    const regraCasada = casarRegra(item.ncm ?? undefined, rs.regras);
    if (regraCasada && isRegraDisputada(regraCasada)) {
      await api.registrarAnalise({
        escritorioId: ESC,
        clienteId,
        itemId: item.id,
        motorVersaoId: MOTOR,
        baseVersaoId: baseVersaoIdSeed,
        tipoDivergencia: (regraCasada.tipoDivergencia ?? "outro") as TipoDivergencia,
        descricao: descricaoDisputado(item, regraCasada),
        confianca: null, // → banda_confianca "disputado": revisar antes de aprovar (DESIGN §6.3)
        fundamento: [
          ...(regraCasada.fundamento ?? []),
          "Indício DISPUTADO (regime/cClassTrib em controvérsia) — não afirmar certeza; revisão humana obrigatória.",
        ],
        cclasstribReferencia: null, // régua diz DISPUTADO: sem referência fixa (G6).
        valorEnvolvido: item.valorItem,
        regraId: regraCasada.id,
        tipoInferencia: "regra_deterministica",
      });
      disputados += 1;
      continue;
    }

    // (b) Caso normal: roda o MOTOR REAL contra a base da régua.
    const candidatos = classificar(itemFiscal, baseMotor, { motorVersaoId: MOTOR });
    for (const cand of candidatos) {
      await api.registrarAnalise({
        escritorioId: ESC,
        clienteId,
        itemId: item.id,
        motorVersaoId: cand.motorVersaoId,
        baseVersaoId: baseVersaoIdSeed,
        tipoDivergencia: cand.tipoDivergencia as TipoDivergencia,
        descricao: cand.descricao,
        confianca: cand.confianca, // 0.95/0.82/0.6 → banda alta/media/baixa
        fundamento: cand.fundamento,
        cclasstribReferencia: cand.cclasstribReferencia,
        valorEnvolvido: cand.valorEnvolvido,
        regraId: cand.criteriosDesempate.regraId,
        tipoInferencia: "regra_deterministica",
      });
      porMotorDivergencia += 1;
    }
  }

  const stats: SeedEstatistica = {
    clientes: dataset.clientes.length,
    notas: dataset.notas.length,
    itens: dataset.itens.length,
    apontamentos: porMotorDivergencia + disputados,
    disputados,
    porMotorDivergencia,
  };

  return { api, stats };
}

function notaClienteDoItem(dataset: SeedDataset, itemId: string): string {
  const item = dataset.itens.find((i) => i.id === itemId);
  const nota = dataset.notas.find((n) => n.id === item?.notaId);
  return nota?.clienteId ?? ESC;
}

function descricaoDisputado(item: NotaItem, regra: RegraRuleset): string {
  return (
    `Indício DISPUTADO: item "${item.descricao}" (NCM ${item.ncm ?? "—"}) cai em regime/cClassTrib ` +
    `em controvérsia (régua: ${regra.id}). O motor não fixa referência — revisar antes de aprovar; ` +
    `auto-aprovação bloqueada. Trilha verificável registra a abstenção.`
  );
}
