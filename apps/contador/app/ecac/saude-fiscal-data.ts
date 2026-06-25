/**
 * Dados SINTÉTICOS da SAÚDE FISCAL da carteira (e-CAC, D9) — demo navegável.
 *
 * Auto-contido em app/ecac/: NÃO importa do mock real (lib/api.ts) nem do core. Reaproveita
 * os 3 clientes da CARTEIRA_ECAC (ecac-model.ts) para o feed S3/S5 conversar com o cockpit
 * existente (mesmos nomes/documentos), mas modela os campos novos que a triagem (marca "!",
 * intimação, prazo-limite) e a renovação (validade da CND) precisam.
 *
 * Tudo é derivado de uma DATA DE REFERÊNCIA (passada pela page) para que o spread fique
 * determinístico e estável no tempo — a demo sempre mostra uma intimação no limite, uma
 * expirada, uma folgada, uma CND vencida, uma a vencer, etc. Valores ILUSTRATIVOS.
 *
 * G6 (CONTEXT §5 #4): nada aqui promete "regularizado"/"garantido". Cada item carrega um
 * INDÍCIO; a triagem e a renovação SUGEREM — a ação é decisão do contador.
 */
import type { CndBruta, EsferaCnd, MensagemCaixaBruta } from "./saude-fiscal-model";
import { CARTEIRA_ECAC } from "./ecac-model";

/** Subtrai `n` dias de um ISO e devolve ISO (helper sintético determinístico). */
function menosDias(refIso: string, n: number): string {
  const d = new Date(refIso);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString();
}

/** Soma `n` dias a um ISO e devolve ISO. */
function maisDias(refIso: string, n: number): string {
  return menosDias(refIso, -n);
}

/** Nome do cliente pelo ID (a partir da carteira e-CAC existente). */
function nomeCliente(clienteId: string): string {
  return CARTEIRA_ECAC.find((l) => l.clienteId === clienteId)?.clienteNome ?? clienteId;
}

/** Documento do cliente pelo ID. */
function docCliente(clienteId: string): string {
  return CARTEIRA_ECAC.find((l) => l.clienteId === clienteId)?.documento ?? "";
}

// ===========================================================================
// S3 — Caixa postal sintética (cobre todo o espectro de triagem)
// ===========================================================================

/**
 * Spec de mensagem: o offset (em dias) que ANCORA a mensagem a partir do refIso. `prazoDias`
 * é o offset da data-limite da intimação (positivo = futuro, negativo = passado, null = sem
 * prazo). Mantém o spread determinístico.
 */
interface MsgSpec {
  id: string;
  clienteId: string;
  assunto: string;
  remetente: string;
  recebidaHaDias: number;
  lida: boolean;
  marcaReceita: boolean;
  intimacao: boolean;
  /** Offset (dias a partir do refIso) da data-limite; null = sem prazo cravado. */
  prazoDias: number | null;
}

const MSG_SPECS: MsgSpec[] = [
  // CRÍTICA · intimação com prazo EXPIRADO (data-limite no passado). Pior caso do feed.
  {
    id: "msg-brasa-intima-omissao",
    clienteId: "a2",
    assunto: "Intimação — omissão de entrega de declaração (DCTFWeb 05/2026)",
    remetente: "Receita Federal do Brasil",
    recebidaHaDias: 20,
    lida: false,
    marcaReceita: true,
    intimacao: true,
    prazoDias: -3, // já passou há 3 dias
  },
  // CRÍTICA · intimação que VENCE HOJE (no limite). Destaque máximo de urgência.
  {
    id: "msg-cedro-intima-icms",
    clienteId: "a3",
    assunto: "Intimação fiscal — esclarecimentos sobre débito de ICMS",
    remetente: "Secretaria da Fazenda Estadual",
    recebidaHaDias: 25,
    lida: false,
    marcaReceita: false,
    intimacao: true,
    prazoDias: 0, // vence hoje
  },
  // CRÍTICA · intimação com prazo CURTO (dentro de 7 dias → urgente).
  {
    id: "msg-brasa-intima-divida",
    clienteId: "a2",
    assunto: "Intimação — manifestação sobre inscrição em dívida ativa da União",
    remetente: "PGFN",
    recebidaHaDias: 6,
    lida: false,
    marcaReceita: true,
    intimacao: true,
    prazoDias: 5, // vence em 5 dias
  },
  // CRÍTICA · intimação com prazo FOLGADO (>7 dias).
  {
    id: "msg-aurora-intima-malha",
    clienteId: "a1",
    assunto: "Intimação — esclarecimento sobre divergência em DCTFWeb",
    remetente: "Receita Federal do Brasil",
    recebidaHaDias: 4,
    lida: false,
    marcaReceita: true,
    intimacao: true,
    prazoDias: 18, // vence em 18 dias
  },
  // ATENÇÃO · comunicado da Receita com marca "!", SEM ser intimação (sem prazo cravado).
  {
    id: "msg-aurora-dte",
    clienteId: "a1",
    assunto: "Comunicado — opção pelo Domicílio Tributário Eletrônico (DTE)",
    remetente: "Receita Federal do Brasil",
    recebidaHaDias: 7,
    lida: false,
    marcaReceita: true,
    intimacao: false,
    prazoDias: null,
  },
  // ATENÇÃO · aviso de vencimento de certidão (marca "!"), sem prazo de resposta.
  {
    id: "msg-brasa-aviso-cnd",
    clienteId: "a2",
    assunto: "Aviso de vencimento de certidão (CND Federal)",
    remetente: "Receita Federal do Brasil",
    recebidaHaDias: 17,
    lida: false,
    marcaReceita: true,
    intimacao: false,
    prazoDias: null,
  },
  // INFORMATIVO · recibo de entrega (sem marca, sem intimação).
  {
    id: "msg-cedro-recibo-efd",
    clienteId: "a3",
    assunto: "Recibo de entrega da EFD ICMS/IPI (05/2026)",
    remetente: "Secretaria da Fazenda Estadual",
    recebidaHaDias: 11,
    lida: true,
    marcaReceita: false,
    intimacao: false,
    prazoDias: null,
  },
  // INFORMATIVO · confirmação de adesão a parcelamento (lida).
  {
    id: "msg-aurora-confirma-parc",
    clienteId: "a1",
    assunto: "Confirmação de adesão ao parcelamento simplificado",
    remetente: "PGFN",
    recebidaHaDias: 28,
    lida: true,
    marcaReceita: false,
    intimacao: false,
    prazoDias: null,
  },
];

/**
 * Monta a caixa postal SINTÉTICA a partir de uma data de referência. Chamada pela page com
 * a data atual — o spread de triagem fica estável no tempo (sempre há uma expirada, uma no
 * limite, uma urgente, uma folgada, comunicados e informativos).
 */
export function getMensagensCaixaSinteticas(refIso: string): MensagemCaixaBruta[] {
  return MSG_SPECS.map((s) => ({
    id: s.id,
    clienteId: s.clienteId,
    clienteNome: nomeCliente(s.clienteId),
    assunto: s.assunto,
    remetente: s.remetente,
    recebidaEmIso: menosDias(refIso, s.recebidaHaDias),
    lida: s.lida,
    marcaReceita: s.marcaReceita,
    intimacao: s.intimacao,
    prazoLimiteIso: s.prazoDias == null ? null : maisDias(refIso, s.prazoDias),
  }));
}

// ===========================================================================
// S5 — CNDs sintéticas por cliente/esfera (cobre todo o espectro de renovação)
// ===========================================================================

/**
 * Spec de CND: `validadeDias` é o offset (dias a partir do refIso) da validade da certidão
 * emitida — negativo = vencida, dentro de 0..30 = a vencer, >30 = vigente, null = sem
 * certidão vigente conhecida (cai em "vencida" se a situação não for regular).
 */
interface CndSpec {
  id: string;
  clienteId: string;
  esfera: EsferaCnd;
  situacao: CndBruta["situacao"];
  /** Offset (dias a partir do refIso) da validade; null = sem validade conhecida. */
  validadeDias: number | null;
}

const CND_SPECS: CndSpec[] = [
  // --- Farmácia Aurora (a1): carteira saudável, mas uma a vencer (a renovar na janela). ---
  { id: "cnd-a1-federal", clienteId: "a1", esfera: "federal", situacao: "regular", validadeDias: 12 }, // a vencer
  { id: "cnd-a1-estadual", clienteId: "a1", esfera: "estadual", situacao: "regular", validadeDias: 95 }, // vigente
  { id: "cnd-a1-municipal", clienteId: "a1", esfera: "municipal", situacao: "regular", validadeDias: 60 }, // vigente
  { id: "cnd-a1-trabalhista", clienteId: "a1", esfera: "trabalhista", situacao: "regular", validadeDias: 140 }, // vigente
  { id: "cnd-a1-fgts", clienteId: "a1", esfera: "fgts", situacao: "regular", validadeDias: 25 }, // a vencer

  // --- Posto Brasa (a2): carteira problemática — vencidas e pendência sem certidão vigente. ---
  { id: "cnd-a2-federal", clienteId: "a2", esfera: "federal", situacao: "vencida", validadeDias: -10 }, // vencida
  { id: "cnd-a2-estadual", clienteId: "a2", esfera: "estadual", situacao: "pendente", validadeDias: null }, // sem validade + não-regular → vencida
  { id: "cnd-a2-municipal", clienteId: "a2", esfera: "municipal", situacao: "regular", validadeDias: 50 }, // vigente
  { id: "cnd-a2-trabalhista", clienteId: "a2", esfera: "trabalhista", situacao: "regular", validadeDias: 4 }, // a vencer (curto)
  { id: "cnd-a2-fgts", clienteId: "a2", esfera: "fgts", situacao: "pendente", validadeDias: -2 }, // vencida

  // --- Mercado Cedro (a3): mista — uma estadual vencida + trabalhista a vencer. ---
  { id: "cnd-a3-federal", clienteId: "a3", esfera: "federal", situacao: "regular", validadeDias: 110 }, // vigente
  { id: "cnd-a3-estadual", clienteId: "a3", esfera: "estadual", situacao: "vencida", validadeDias: -30 }, // vencida (mais antiga)
  { id: "cnd-a3-municipal", clienteId: "a3", esfera: "municipal", situacao: "regular", validadeDias: 80 }, // vigente
  { id: "cnd-a3-trabalhista", clienteId: "a3", esfera: "trabalhista", situacao: "pendente", validadeDias: 20 }, // a vencer
  { id: "cnd-a3-fgts", clienteId: "a3", esfera: "fgts", situacao: "regular", validadeDias: 70 }, // vigente
];

/**
 * Monta as CNDs SINTÉTICAS por cliente/esfera a partir de uma data de referência. O spread
 * cobre vencidas, a vencer (incl. curtíssimo prazo), vigentes e o caso "sem validade + não
 * regular". IDs estáveis. Valores ILUSTRATIVOS.
 */
export function getCndsSinteticas(refIso: string): CndBruta[] {
  return CND_SPECS.map((s) => ({
    id: s.id,
    clienteId: s.clienteId,
    clienteNome: nomeCliente(s.clienteId),
    documento: docCliente(s.clienteId),
    esfera: s.esfera,
    situacao: s.situacao,
    validadeIso: s.validadeDias == null ? null : maisDias(refIso, s.validadeDias),
  }));
}
