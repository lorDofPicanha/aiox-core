/**
 * Dataset SINTÉTICO da Fase 1 (G6-safe). Sem XML real, sem dados de cliente reais.
 *
 * Linguagem segura: descrições falam em "indício" / "referência determinística sintética";
 * nunca "crédito garantido", "apuração correta", "elimina multa", "prova jurídica plena".
 */

import type {
  Apontamento,
  BaseVersao,
  Cliente,
  Escritorio,
  MotorVersao,
  Nota,
  NotaItem,
  Usuario,
} from "./types";

export interface SeedDataset {
  escritorio: Escritorio;
  contador: Usuario;
  clientes: Cliente[];
  notas: Nota[];
  itens: NotaItem[];
  baseReferencia: BaseVersao;
  motor: MotorVersao;
  /** Apontamentos iniciais já materializados (indícios pendentes de revisão). */
  apontamentos: Apontamento[];
}

// IDs determinísticos (sintéticos) para a Fase 1.
const ESC = "00000000-0000-4000-8000-000000000001";
const CONTADOR = "00000000-0000-4000-8000-0000000000c0";
const CLI_A = "00000000-0000-4000-8000-0000000000a1";
const CLI_B = "00000000-0000-4000-8000-0000000000a2";
const CLI_C = "00000000-0000-4000-8000-0000000000a3";
const BASE = "00000000-0000-4000-8000-0000000000b0";
const MOTOR = "00000000-0000-4000-8000-0000000000d0";

function nota(
  id: string,
  clienteId: string,
  numero: string,
  emitidaEm: string,
  valorTotal: number,
  origem: Nota["origem"],
): Nota {
  return {
    id,
    escritorioId: ESC,
    clienteId,
    competencia: `${emitidaEm.slice(0, 7)}-01`,
    tipo: "nfe",
    direcao: "venda",
    numero,
    serie: "1",
    emitidaEm,
    emitenteCnpj: "11222333000181",
    destinatarioDoc: "99888777000166",
    valorTotal,
    origem,
    classeInsumo: origem === "provider_ocr" ? "ocr" : "xml",
    statusAuditoria: "analisada",
  };
}

function item(
  id: string,
  notaId: string,
  competencia: string,
  numeroItem: number,
  descricao: string,
  ncm: string,
  cclasstribInformado: string,
  valorItem: number,
): NotaItem {
  return {
    id,
    escritorioId: ESC,
    notaId,
    competencia,
    numeroItem,
    descricao,
    ncm,
    cfop: "5102",
    cst: "00",
    cclasstribInformado,
    quantidade: 1,
    valorItem,
  };
}

function apontamento(
  id: string,
  clienteId: string,
  itemId: string,
  tipoDivergencia: Apontamento["tipoDivergencia"],
  cclasstribReferencia: string,
  descricao: string,
  valorEnvolvido: number,
  confianca: number,
  bandaConfianca: Apontamento["bandaConfianca"],
): Apontamento {
  return {
    id,
    escritorioId: ESC,
    clienteId,
    itemId,
    baseVersaoId: BASE,
    motorVersaoId: MOTOR,
    analiseExecucaoId: null,
    tipoInferencia: "regra_deterministica",
    origem: "motor",
    tipoDivergencia,
    cclasstribReferencia,
    descricao,
    valorEnvolvido,
    confianca,
    bandaConfianca,
    fundamento: ["Referência determinística sintética (base de demonstração — Fase 1)."],
    status: "pendente",
    revisorId: null,
    revisadoEm: null,
    motivoCodigo: null,
    motivoTexto: null,
  };
}

const COMP_2026_01 = "2026-01-01";

export function buildDefaultSeed(): SeedDataset {
  const escritorio: Escritorio = {
    id: ESC,
    nome: "Escritório Demonstração (sintético)",
    plano: "concierge",
    createdAt: "2026-01-02T09:00:00.000Z",
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
    { id: CLI_A, escritorioId: ESC, nome: "Aurora Comércio Ltda (demo)", documento: "11222333000181" },
    { id: CLI_B, escritorioId: ESC, nome: "Brasa Distribuidora ME (demo)", documento: "22333444000172" },
    { id: CLI_C, escritorioId: ESC, nome: "Cedro Indústria SA (demo)", documento: "33444555000163" },
  ];

  const notas: Nota[] = [
    nota("00000000-0000-4000-8000-0000000000f1", CLI_A, "1001", "2026-01-08", 4200.0, "upload"),
    nota("00000000-0000-4000-8000-0000000000f2", CLI_A, "1002", "2026-01-15", 980.5, "upload"),
    nota("00000000-0000-4000-8000-0000000000f3", CLI_B, "2050", "2026-01-11", 15600.0, "provider_ocr"),
    nota("00000000-0000-4000-8000-0000000000f4", CLI_C, "3777", "2026-01-20", 32100.0, "manual"),
  ];

  const itens: NotaItem[] = [
    item("00000000-0000-4000-8000-000000000101", notas[0].id, COMP_2026_01, 1, "Refrigerante lata 350ml", "22021000", "000001", 2200.0),
    item("00000000-0000-4000-8000-000000000102", notas[0].id, COMP_2026_01, 2, "Água mineral 500ml", "22011000", "000001", 2000.0),
    item("00000000-0000-4000-8000-000000000103", notas[1].id, COMP_2026_01, 1, "Caderno capa dura", "48201000", "000001", 980.5),
    item("00000000-0000-4000-8000-000000000104", notas[2].id, COMP_2026_01, 1, "Óleo lubrificante automotivo", "27101259", "000001", 15600.0),
    item("00000000-0000-4000-8000-000000000105", notas[3].id, COMP_2026_01, 1, "Pneu radial 205/55", "40111000", "000001", 32100.0),
  ];

  const baseReferencia: BaseVersao = {
    id: BASE,
    rotulo: "base-demo-cclasstrib-v0 (sintética)",
    fonte: "sintetica",
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

  const apontamentos: Apontamento[] = [
    apontamento(
      "00000000-0000-4000-8000-000000000201",
      CLI_A,
      itens[0].id,
      "monofasico_tributado",
      "200002",
      'Indício: item "Refrigerante lata 350ml" pode envolver regime monofásico; referência determinística sintética sugere revisão do cClassTrib.',
      2200.0,
      0.82,
      "media",
    ),
    apontamento(
      "00000000-0000-4000-8000-000000000202",
      CLI_B,
      itens[3].id,
      "cclasstrib_divergente",
      "200003",
      'Indício: item "Óleo lubrificante automotivo" com cClassTrib informado divergente da referência determinística sintética. Sujeito a revisão humana.',
      15600.0,
      0.6,
      "baixa",
    ),
    apontamento(
      "00000000-0000-4000-8000-000000000203",
      CLI_C,
      itens[4].id,
      "ncm_suspeito",
      "200004",
      'Indício: NCM do item "Pneu radial 205/55" merece evidência adicional antes de qualquer decisão. Trilha verificável registra a abstenção.',
      32100.0,
      0.95,
      "alta",
    ),
  ];

  return { escritorio, contador, clientes, notas, itens, baseReferencia, motor, apontamentos };
}
