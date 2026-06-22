/**
 * Read model + dados SINTÉTICOS do módulo e-CAC ("a mina", D9 · CONTEXT §3).
 *
 * e-CAC é um ADD-ON premium, NÃO o core. A tela é um DIAGNÓSTICO READ-ONLY em lote
 * da SITUAÇÃO FISCAL DA CARTEIRA (não da nota): caixa postal, CNDs/certidões e
 * ausência de declarações de TODAS as empresas numa tela só. Resolve a dor de o
 * contador entrar no e-CAC cliente-por-cliente (procuração), 100×.
 *
 * Co-localizado em app/ecac/ de PROPÓSITO: este módulo é AUTO-CONTIDO. NÃO toca
 * lib/api.ts, packages/contador-api-client, components/* nem globals.css. Os dados
 * são sintéticos e vivem aqui — a consulta real (Integra Contador / SERPRO) só chega
 * na Fase 7 (exige contrato SERPRO + procurações eletrônicas homologadas).
 *
 * G6 (linguagem segura, doc 45): nada aqui afirma "crédito garantido", "apuração
 * correta", "elimina multa" nem "prova jurídica plena". e-CAC só MOSTRA a situação
 * fiscal extraída do portal; não promete resolver, regularizar nem zerar risco. É
 * leitura — a ação (parcelar, contestar, declarar) é ato do contador.
 */
import { BANDA_CONFIANCA, type StatusView } from "@/lib/status";

/** Situação de uma certidão (CND) ou obrigação no e-CAC — sempre redundante (cor+ícone+label). */
export type SituacaoCertidao = "regular" | "pendente" | "vencida";

/** Apresentação de cada situação (DESIGN §3: cor + glyph + label; nunca só matiz). */
export const SITUACAO_VIEW: Record<SituacaoCertidao, StatusView> = {
  regular: { variant: "success", glyph: "▲", label: "Regular" },
  pendente: { variant: "warning", glyph: "●", label: "Pendente" },
  vencida: { variant: "danger", glyph: "▼", label: "Vencida" },
};

/** Severidade (pior primeiro) para detectar "tem pendência" e contar KPIs. */
const SITUACAO_SEVERIDADE: Record<SituacaoCertidao, number> = {
  vencida: 0,
  pendente: 1,
  regular: 2,
};

/** As 4 certidões de uma linha, na ordem canônica de exibição. */
export type CndChave = "cndFederal" | "cndEstadual" | "cndTrabalhista" | "fgts";

/** Rótulos legíveis de cada certidão (cabeçalho + tela de detalhe). */
export const CND_LABEL: Record<CndChave, string> = {
  cndFederal: "CND Federal / PGFN",
  cndEstadual: "CND Estadual (ICMS)",
  cndTrabalhista: "CND Trabalhista (CNDT)",
  fgts: "Regularidade FGTS (CRF)",
};

/** Órgão emissor de cada certidão (preview sintético da certidão). */
export const CND_ORGAO: Record<CndChave, string> = {
  cndFederal: "Receita Federal do Brasil · PGFN",
  cndEstadual: "Secretaria da Fazenda Estadual",
  cndTrabalhista: "Tribunal Superior do Trabalho",
  fgts: "Caixa Econômica Federal",
};

/** Uma mensagem sintética da caixa postal do e-CAC. */
export interface EcacMensagem {
  id: string;
  assunto: string;
  remetente: string;
  recebidaEm: string;
  /** Estado inicial — a tela controla "lida" no estado do componente. */
  lida: boolean;
}

/** Situação de uma obrigação acessória (declaração) no e-CAC. */
export interface EcacDeclaracao {
  id: string;
  nome: string;
  competencia: string;
  situacao: SituacaoCertidao;
  nota: string;
}

/** Detalhe sintético de UMA certidão (para o preview "baixar"). */
export interface EcacCndDetalhe {
  situacao: SituacaoCertidao;
  /** Texto livre G6-safe que descreve a situação extraída do portal. */
  observacao: string;
}

/** Uma linha da carteira: a situação fiscal consolidada de UM cliente no e-CAC. */
export interface EcacLinha {
  clienteId: string;
  clienteNome: string;
  documento: string;
  /** Caixa postal e-CAC: nº de mensagens novas (não lidas). */
  mensagensNovas: number;
  /** CND Federal / PGFN (Receita + dívida ativa da União). */
  cndFederal: SituacaoCertidao;
  /** CND Estadual (ICMS/SEFAZ). */
  cndEstadual: SituacaoCertidao;
  /** CND Trabalhista (CNDT/TST). */
  cndTrabalhista: SituacaoCertidao;
  /** Regularidade FGTS (CRF/Caixa). */
  fgts: SituacaoCertidao;
  /** Ausência de declaração(ões) detectada(s) no e-CAC (omissão de DCTF/EFD/etc.). */
  ausenciaDeclaracao: boolean;
  /** Quando esta situação foi lida do portal (sintético — render). */
  consultadoEm: string;
  /** Município/UF do estabelecimento (preview da certidão). */
  municipio: string;
  /** Mensagens sintéticas da caixa postal (drill-down). */
  mensagens: EcacMensagem[];
  /** Observação G6-safe por certidão (preview "baixar"). */
  detalhesCnd: Record<CndChave, EcacCndDetalhe>;
  /** Situação das declarações/obrigações acessórias (drill-down). */
  declaracoes: EcacDeclaracao[];
}

/** Dados SINTÉTICOS da carteira (3 clientes demo — IDs/nomes exatos do brief). */
export const CARTEIRA_ECAC: EcacLinha[] = [
  {
    clienteId: "a1",
    clienteNome: "Farmácia Aurora",
    documento: "11222333000181",
    mensagensNovas: 2,
    cndFederal: "regular",
    cndEstadual: "regular",
    cndTrabalhista: "regular",
    fgts: "regular",
    ausenciaDeclaracao: false,
    consultadoEm: "2026-06-22T08:10:00-03:00",
    municipio: "Ribeirão Preto / SP",
    mensagens: [
      {
        id: "a1-m1",
        assunto: "Comunicado — opção pelo Domicílio Tributário Eletrônico (DTE)",
        remetente: "Receita Federal do Brasil",
        recebidaEm: "2026-06-18T09:32:00-03:00",
        lida: false,
      },
      {
        id: "a1-m2",
        assunto: "Aviso de processamento da DCTFWeb (06/2026)",
        remetente: "Receita Federal do Brasil",
        recebidaEm: "2026-06-15T14:05:00-03:00",
        lida: false,
      },
      {
        id: "a1-m3",
        assunto: "Confirmação de adesão ao parcelamento simplificado",
        remetente: "PGFN",
        recebidaEm: "2026-05-28T11:20:00-03:00",
        lida: true,
      },
    ],
    detalhesCnd: {
      cndFederal: {
        situacao: "regular",
        observacao:
          "Sem pendências de débitos perante a Receita Federal e a dívida ativa da União na consulta sintética.",
      },
      cndEstadual: {
        situacao: "regular",
        observacao: "Sem débitos de ICMS em aberto na base sintética da SEFAZ.",
      },
      cndTrabalhista: {
        situacao: "regular",
        observacao: "Sem débitos trabalhistas inscritos na consulta sintética (CNDT).",
      },
      fgts: {
        situacao: "regular",
        observacao: "Recolhimentos de FGTS em situação regular na base sintética (CRF).",
      },
    },
    declaracoes: [
      {
        id: "a1-d1",
        nome: "DCTFWeb",
        competencia: "06/2026",
        situacao: "regular",
        nota: "Transmitida no prazo na base sintética.",
      },
      {
        id: "a1-d2",
        nome: "EFD-Contribuições",
        competencia: "05/2026",
        situacao: "regular",
        nota: "Sem omissão detectada.",
      },
    ],
  },
  {
    clienteId: "a2",
    clienteNome: "Posto Brasa Combustíveis ME",
    documento: "44555666000172",
    mensagensNovas: 5,
    cndFederal: "vencida",
    cndEstadual: "pendente",
    cndTrabalhista: "regular",
    fgts: "pendente",
    ausenciaDeclaracao: true,
    consultadoEm: "2026-06-22T08:10:00-03:00",
    municipio: "Uberlândia / MG",
    mensagens: [
      {
        id: "a2-m1",
        assunto: "Intimação — omissão de entrega de declaração (DCTFWeb 05/2026)",
        remetente: "Receita Federal do Brasil",
        recebidaEm: "2026-06-20T08:11:00-03:00",
        lida: false,
      },
      {
        id: "a2-m2",
        assunto: "Aviso de débito inscrito em dívida ativa da União",
        remetente: "PGFN",
        recebidaEm: "2026-06-19T16:40:00-03:00",
        lida: false,
      },
      {
        id: "a2-m3",
        assunto: "Notificação de pendência de ICMS (parcela em atraso)",
        remetente: "Secretaria da Fazenda Estadual",
        recebidaEm: "2026-06-17T10:02:00-03:00",
        lida: false,
      },
      {
        id: "a2-m4",
        assunto: "Comunicado de irregularidade no recolhimento de FGTS",
        remetente: "Caixa Econômica Federal",
        recebidaEm: "2026-06-12T13:55:00-03:00",
        lida: false,
      },
      {
        id: "a2-m5",
        assunto: "Aviso de vencimento de certidão (CND Federal)",
        remetente: "Receita Federal do Brasil",
        recebidaEm: "2026-06-05T09:00:00-03:00",
        lida: false,
      },
    ],
    detalhesCnd: {
      cndFederal: {
        situacao: "vencida",
        observacao:
          "Consulta sintética aponta débitos federais em aberto e certidão vencida. A regularização (parcelar, pagar, contestar) é decisão do contador.",
      },
      cndEstadual: {
        situacao: "pendente",
        observacao:
          "Parcela de ICMS em atraso na base sintética; situação pendente de análise pelo contador.",
      },
      cndTrabalhista: {
        situacao: "regular",
        observacao: "Sem débitos trabalhistas inscritos na consulta sintética (CNDT).",
      },
      fgts: {
        situacao: "pendente",
        observacao:
          "Indício de recolhimento de FGTS em atraso na base sintética; verificar competências em aberto.",
      },
    },
    declaracoes: [
      {
        id: "a2-d1",
        nome: "DCTFWeb",
        competencia: "05/2026",
        situacao: "vencida",
        nota: "Omissão de entrega detectada na base sintética — sujeita à análise do contador.",
      },
      {
        id: "a2-d2",
        nome: "EFD ICMS/IPI",
        competencia: "05/2026",
        situacao: "pendente",
        nota: "Entrega em atraso na base sintética.",
      },
      {
        id: "a2-d3",
        nome: "EFD-Contribuições",
        competencia: "05/2026",
        situacao: "regular",
        nota: "Sem omissão detectada.",
      },
    ],
  },
  {
    clienteId: "a3",
    clienteNome: "Mercado Cedro Bebidas SA",
    documento: "77888999000163",
    mensagensNovas: 0,
    cndFederal: "regular",
    cndEstadual: "vencida",
    cndTrabalhista: "pendente",
    fgts: "regular",
    ausenciaDeclaracao: false,
    consultadoEm: "2026-06-22T08:10:00-03:00",
    municipio: "Londrina / PR",
    mensagens: [
      {
        id: "a3-m1",
        assunto: "Recibo de entrega da EFD ICMS/IPI (05/2026)",
        remetente: "Secretaria da Fazenda Estadual",
        recebidaEm: "2026-06-14T17:30:00-03:00",
        lida: true,
      },
      {
        id: "a3-m2",
        assunto: "Notificação de débito estadual em aberto (ICMS)",
        remetente: "Secretaria da Fazenda Estadual",
        recebidaEm: "2026-06-10T08:45:00-03:00",
        lida: true,
      },
    ],
    detalhesCnd: {
      cndFederal: {
        situacao: "regular",
        observacao: "Sem pendências federais na consulta sintética.",
      },
      cndEstadual: {
        situacao: "vencida",
        observacao:
          "Débito de ICMS em aberto e certidão estadual vencida na base sintética. Ação de regularização é do contador.",
      },
      cndTrabalhista: {
        situacao: "pendente",
        observacao:
          "Indício de processo trabalhista em andamento na consulta sintética; situação pendente de análise.",
      },
      fgts: {
        situacao: "regular",
        observacao: "Recolhimentos de FGTS em situação regular na base sintética (CRF).",
      },
    },
    declaracoes: [
      {
        id: "a3-d1",
        nome: "DCTFWeb",
        competencia: "06/2026",
        situacao: "regular",
        nota: "Transmitida no prazo na base sintética.",
      },
      {
        id: "a3-d2",
        nome: "EFD ICMS/IPI",
        competencia: "05/2026",
        situacao: "regular",
        nota: "Entregue com recibo na base sintética.",
      },
    ],
  },
];

/** As 4 certidões de uma linha, em ordem de exibição (para varrer pior situação). */
export function certidoesDe(l: EcacLinha): SituacaoCertidao[] {
  return [l.cndFederal, l.cndEstadual, l.cndTrabalhista, l.fgts];
}

/** Pior situação de certidão da linha (define o resumo do cliente). */
export function piorSituacao(l: EcacLinha): SituacaoCertidao {
  return certidoesDe(l).reduce((pior, s) =>
    SITUACAO_SEVERIDADE[s] < SITUACAO_SEVERIDADE[pior] ? s : pior,
  );
}

/**
 * Tem alguma pendência fiscal? (qualquer CND vencida/pendente, caixa postal não lida
 * ou ausência de declaração). É o filtro/destaque "quem tem pendência" do brief.
 *
 * `naoLidas` é o nº de mensagens AINDA não lidas no estado vivo da tela (o contador
 * marca como lida e a pendência some). Sem o argumento, cai no valor inicial do seed.
 */
export function temPendencia(l: EcacLinha, naoLidas?: number): boolean {
  const novas = naoLidas ?? l.mensagensNovas;
  return (
    novas > 0 ||
    l.ausenciaDeclaracao ||
    certidoesDe(l).some((s) => s !== "regular")
  );
}

/** Resumo da pendência da linha em frases curtas e G6-safe (o "por quê"). */
export function motivosPendencia(l: EcacLinha, naoLidas?: number): string[] {
  const out: string[] = [];
  const novas = naoLidas ?? l.mensagensNovas;
  if (novas > 0) {
    out.push(`${novas} mensagem(ns) não lida(s) na caixa postal`);
  }
  const vencidas = certidoesDe(l).filter((s) => s === "vencida").length;
  const pendentes = certidoesDe(l).filter((s) => s === "pendente").length;
  if (vencidas > 0) out.push(`${vencidas} certidão(ões) vencida(s)`);
  if (pendentes > 0) out.push(`${pendentes} certidão(ões) pendente(s)`);
  if (l.ausenciaDeclaracao) out.push("ausência de declaração detectada");
  return out;
}

/** KPIs do topo: contagens da dor (caixa postal, CNDs, ausência de declaração). */
export interface EcacResumo {
  total: number;
  comCaixaNaoLida: number;
  comCndIrregular: number;
  comAusenciaDeclaracao: number;
}

/**
 * Resumo da carteira. `naoLidasPorCliente` mapeia clienteId → nº de mensagens ainda
 * não lidas no estado vivo da tela; quando ausente, usa o seed. É o que faz o KPI
 * "com caixa postal não lida" recalcular conforme o contador marca mensagens.
 */
export function resumoCarteira(
  linhas: EcacLinha[],
  naoLidasPorCliente?: Record<string, number>,
): EcacResumo {
  const naoLidas = (l: EcacLinha) =>
    naoLidasPorCliente?.[l.clienteId] ?? l.mensagensNovas;
  return {
    total: linhas.length,
    comCaixaNaoLida: linhas.filter((l) => naoLidas(l) > 0).length,
    comCndIrregular: linhas.filter((l) =>
      certidoesDe(l).some((s) => s !== "regular"),
    ).length,
    comAusenciaDeclaracao: linhas.filter((l) => l.ausenciaDeclaracao).length,
  };
}

/** Apresentação da caixa postal (badge redundante: nº + estado lido/não-lido). */
export function caixaView(mensagensNovas: number): StatusView {
  return mensagensNovas > 0
    ? { variant: "warning", glyph: "✉", label: `${mensagensNovas} nova(s)` }
    : { variant: "neutral", glyph: "✓", label: "Lida" };
}

/** Apresentação de ausência de declaração (badge redundante). */
export function ausenciaView(ausente: boolean): StatusView {
  return ausente
    ? { variant: "danger", glyph: "!", label: "Sim" }
    : { variant: "success", glyph: "▲", label: "Não" };
}

/** A ordem canônica das 4 certidões (para iterar o detalhe do cliente). */
export const CND_CHAVES: CndChave[] = [
  "cndFederal",
  "cndEstadual",
  "cndTrabalhista",
  "fgts",
];

/**
 * Preview SINTÉTICO de uma certidão "baixada" — o cabeçalho honesto de uma certidão
 * negativa/positiva-com-efeito. Não é um documento oficial: é uma pré-visualização de
 * demonstração. G6: descreve a situação extraída do portal; não emite certidão real
 * nem promete regularidade — a consulta real chega na Fase 7 (Integra Contador/SERPRO).
 */
export interface CndPreview {
  titulo: string;
  cliente: string;
  documento: string;
  municipio: string;
  orgao: string;
  /** "Negativa" (regular) · "Positiva com efeito de negativa" (pendente) · "Positiva" (vencida). */
  tipoCertidao: string;
  situacao: SituacaoCertidao;
  observacao: string;
  codigoControle: string;
  geradaEm: string;
}

/** Mapeia situação → o "tipo" de certidão que o portal devolveria (vocabulário fiscal real). */
const TIPO_CERTIDAO: Record<SituacaoCertidao, string> = {
  regular: "Negativa de débitos (CND)",
  pendente: "Positiva com efeito de negativa (CPEN)",
  vencida: "Positiva de débitos",
};

/** Código de controle sintético determinístico (parece um protocolo, mas é demo). */
function codigoControleSintetico(clienteId: string, chave: CndChave): string {
  const base = `${clienteId}-${chave}`;
  let h = 0;
  for (let i = 0; i < base.length; i++) h = (h * 31 + base.charCodeAt(i)) >>> 0;
  const bloco = (n: number) => String((h >> (n * 4)) % 10000).padStart(4, "0");
  return `DEMO.${bloco(0)}.${bloco(1)}.${bloco(2)}`;
}

/** Monta o preview sintético de uma certidão para o botão "baixar" do drill-down. */
export function gerarCndPreview(l: EcacLinha, chave: CndChave): CndPreview {
  const det = l.detalhesCnd[chave];
  return {
    titulo: CND_LABEL[chave],
    cliente: l.clienteNome,
    documento: l.documento,
    municipio: l.municipio,
    orgao: CND_ORGAO[chave],
    tipoCertidao: TIPO_CERTIDAO[det.situacao],
    situacao: det.situacao,
    observacao: det.observacao,
    codigoControle: codigoControleSintetico(l.clienteId, chave),
    geradaEm: new Date().toISOString(),
  };
}

/** Resultado da geração em lote de uma certidão por cliente (ação "Gerar CND em lote"). */
export interface CndLoteItem {
  clienteId: string;
  clienteNome: string;
  documento: string;
  /** A pior situação entre as 4 certidões — define o resultado consolidado do cliente. */
  situacao: SituacaoCertidao;
  tipoCertidao: string;
  codigoControle: string;
}

/**
 * Simula "Gerar CND em lote": uma certidão consolidada por cliente, refletindo a pior
 * situação das 4 certidões. É um resultado SINTÉTICO de demonstração — nenhuma certidão
 * real é emitida. A consulta/emissão real chega na Fase 7 (Integra Contador/SERPRO).
 */
export function gerarCndLote(linhas: EcacLinha[]): CndLoteItem[] {
  return linhas.map((l) => {
    const pior = piorSituacao(l);
    return {
      clienteId: l.clienteId,
      clienteNome: l.clienteNome,
      documento: l.documento,
      situacao: pior,
      tipoCertidao: TIPO_CERTIDAO[pior],
      codigoControle: codigoControleSintetico(l.clienteId, "cndFederal"),
    };
  });
}

/** Apresentação de uma declaração/obrigação acessória (badge redundante). */
export function declaracaoView(s: SituacaoCertidao): StatusView {
  return SITUACAO_VIEW[s];
}

// Reexporta para a tela poder usar a paleta de bandas se precisar (mantém consistência
// visual com Carteira/Fila sem duplicar o mapa de status).
export { BANDA_CONFIANCA };
