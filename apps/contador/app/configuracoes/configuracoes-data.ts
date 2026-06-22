/**
 * Base SINTÉTICA da tela CONFIGURAÇÕES (Fase 1) — co-localizada de propósito.
 *
 * Espelha os IDs/nomes do seed do core (Farmácia Aurora …a1, Posto Brasa …a2,
 * Mercado Cedro …a3) para manter consistência entre as telas, mas NÃO importa o core:
 * a administração real (equipe, billing, versionamento da régua) é Fase 2+. Os números
 * de pricing seguem o corredor travado em CONTEXT §10 / doc 05 (value metric = nota
 * auditada, D7; entrada barata via valor empacotado, nunca desconto, CONTEXT §5.6).
 *
 * G6: nada aqui afirma crédito/apuração/multa/prova. A régua cClassTrib é RASCUNHO
 * pendente de validação por tributarista (gate Fase 3); só o contador com CRC ativo
 * aprova apuração (humano no loop é design, D8).
 */
import type {
  CapturaClienteConfig,
  CobrancaResumo,
  PerfilEscritorio,
  PlanoTier,
  ReguaReferencia,
  UsuarioEquipe,
} from "./configuracoes-model";

/** IDs do seed (consistência com captura-data.ts / seed-from-motor.ts). */
const CLI_FARM = "00000000-0000-4000-8000-0000000000a1";
const CLI_POSTO = "00000000-0000-4000-8000-0000000000a2";
const CLI_MERC = "00000000-0000-4000-8000-0000000000a3";

/* ── 1. Perfil do escritório ───────────────────────────────────────────────── */

export function perfilEscritorio(): PerfilEscritorio {
  return {
    nome: "Contabilidade Cedro & Associados (demo)",
    documento: "44555666000154",
    responsavelTecnico: "Renata Camargo",
    crcResponsavel: "CRC-SP 1ABC234/O-5",
    crcUf: "SP",
    endereco: "Av. Paulista, 1842 — cj. 1207",
    cidadeUf: "São Paulo / SP",
    regimeTributario: "Lucro Presumido",
  };
}

/* ── 2. Equipe / usuários ──────────────────────────────────────────────────── */

export function listarEquipe(): UsuarioEquipe[] {
  return [
    {
      id: "usr-001",
      nome: "Renata Camargo",
      papel: "contador",
      crc: "CRC-SP 1ABC234/O-5",
      crcUf: "SP",
      email: "renata.camargo@cedro.demo",
      ativo: true,
    },
    {
      id: "usr-002",
      nome: "Paulo Henrique Lima",
      papel: "contador",
      crc: "CRC-SP 1DEF567/O-2",
      crcUf: "SP",
      email: "paulo.lima@cedro.demo",
      ativo: true,
    },
    {
      id: "usr-003",
      nome: "Beatriz Nunes",
      papel: "analista",
      crc: null,
      crcUf: null,
      email: "beatriz.nunes@cedro.demo",
      ativo: true,
    },
    {
      id: "usr-004",
      nome: "Diego Fontes",
      papel: "analista",
      crc: null,
      crcUf: null,
      email: "diego.fontes@cedro.demo",
      ativo: true,
    },
    {
      id: "usr-005",
      nome: "Marcos Aurélio (TI)",
      papel: "admin",
      crc: null,
      crcUf: null,
      email: "ti@cedro.demo",
      ativo: false,
    },
  ];
}

/* ── 3. Base de referência — régua cClassTrib (DRAFT, gate Fase 3) ─────────────── */

export function reguaReferencia(): ReguaReferencia {
  return {
    versao: "cClassTrib v0 — draft",
    estado: "draft",
    dataPublicacaoIso: "2026-06-12T00:00:00-03:00",
    numeroRegras: 312,
    numeroNcmCobertos: 1487,
    autoria: "Autorada pelos clones fiscais (heleno-taveira-torres · roberto-dias-duarte)",
    pendencias: [
      "Revisão por tributarista habilitado (gate Fase 3 — CONTEXT §5.4).",
      "Golden-set + observabilidade antes de escalar a auditoria (Chip Huyen, §5.3).",
      "Confidence calibrada — marcar explicitamente onde a régua NÃO sabe (D8).",
    ],
  };
}

/* ── 4. Captura por cliente (default OFF = D2; espelha o módulo Captura) ────────── */

export function capturaPorCliente(): CapturaClienteConfig[] {
  return [
    {
      clienteId: CLI_FARM,
      clienteNome: "Farmácia Aurora Ltda (demo)",
      documento: "11222333000181",
      capturaAtiva: true,
      modo: "upload",
    },
    {
      clienteId: CLI_POSTO,
      clienteNome: "Posto Brasa Combustíveis ME (demo)",
      documento: "22333444000172",
      capturaAtiva: true,
      modo: "provider",
    },
    {
      clienteId: CLI_MERC,
      clienteNome: "Mercado Cedro — Bebidas SA (demo)",
      documento: "33444555000163",
      capturaAtiva: false,
      modo: "upload",
    },
  ];
}

/* ── 5. Plano & cobrança (corredor CONTEXT §10 / doc 05) ───────────────────────── */

/**
 * Tiers por VOLUME DE NOTA AUDITADA (value metric = nota, D7 — nunca faixa de CNPJ).
 * Mensalidades dentro do corredor R$200–R$400+ (CONTEXT §10); âncoras CIEG no doc 05
 * (R$139 base / R$189 com emissores / R$800 emissão sem limite). Entrada barata via
 * valor empacotado, NÃO via desconto (CONTEXT §5.6).
 */
export function planosTiers(): PlanoTier[] {
  return [
    {
      id: "tier-entrada",
      nome: "Entrada",
      mensalidade: 249,
      faixaNotas: "até 2.000 notas auditadas / mês",
      inclui: [
        "Captura seletiva por cliente (◆ XML / ◇ provider)",
        "Auditoria cClassTrib com trilha de boa-fé",
        "Aprovação por contador com CRC (ato privativo)",
      ],
      atual: true,
    },
    {
      id: "tier-escala",
      nome: "Escala",
      mensalidade: 399,
      faixaNotas: "2.001–10.000 notas auditadas / mês",
      inclui: [
        "Tudo do Entrada",
        "Armazenamento XML 15 anos (obrigação legal)",
        "Laudos white-label para o cliente final",
      ],
      atual: false,
    },
    {
      id: "tier-carteira",
      nome: "Carteira",
      mensalidade: 690,
      faixaNotas: "acima de 10.000 notas auditadas / mês",
      inclui: [
        "Tudo do Escala",
        "e-CAC em lote da carteira (add-on premium — D9)",
        "Prioridade na fila de validação da régua",
      ],
      atual: false,
    },
  ];
}

export function cobrancaResumo(): CobrancaResumo {
  return {
    implantacao: 990,
    fidelidade: "Sem fidelidade — aviso prévio de 30 a 60 dias (CONTEXT §10).",
    successFeeRecuperacao:
      "Recuperação monofásico: success-fee separado da mensalidade, dividido com o contador (overlay — D6).",
    emissorRevenda:
      "Emissor revendido pelo contador (ex.: pacote de emissores) paga a própria assinatura (doc 05).",
  };
}
