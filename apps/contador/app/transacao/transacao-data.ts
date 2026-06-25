/**
 * PAR-7 — Dados SINTÉTICOS do Radar de Transação Tributária (demo navegável).
 *
 * Auto-contido em app/transacao/: NÃO importa do mock real (lib/api.ts) nem do seed de
 * parcelamentos — deixa óbvio que é base sintética. ~8 clientes cobrindo o espectro de
 * elegibilidade a editais de transação (forte, condicional, requer-análise, não-elegível) e
 * faixas de gancho de honorário (pequeno/médio/grande porte de dívida ativa).
 *
 * A dívida ativa REAL viria de um adapter S6 (Infosimples / PGFN-Regularize — gate do
 * founder). Aqui é seed sintético ancorado numa DATA DE REFERÊNCIA (passada pela page) para
 * que a idade das inscrições seja determinística e estável no tempo. Tudo ILUSTRATIVO.
 *
 * clienteId reusa o ESQUEMA do parcelamentos ("cli-*") — NÃO inventamos um 4º esquema de id
 * (handoff 57 item 2). Alguns clientes coincidem com os de parcelamentos (mesmo cli-id) DE
 * PROPÓSITO, demonstrando o cruzamento futuro (parcelamento ativo × dívida ativa). A
 * unificação por CNPJ entre os módulos é FOLLOW-UP, não reconciliada aqui.
 *
 * G6 (frente legal): nada aqui promete desconto/quitação/regularização — cada perfil carrega
 * um INDÍCIO de elegibilidade e um GANCHO de honorário potencial (D6); a adesão é ato do
 * tributarista.
 */
import type {
  CapacidadePagamento,
  PerfilFiscalSeed,
  RegimeTributario,
  SituacaoParcelamento,
} from "./transacao-model";

/** Subtrai `n` dias de um ISO e devolve ISO (helper sintético determinístico). */
function menosDias(refIso: string, n: number): string {
  const d = new Date(refIso);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString();
}

interface PerfilSpec {
  clienteId: string;
  clienteNome: string;
  segmento: string;
  regime: RegimeTributario;
  inscritoDividaAtiva: boolean;
  valorDividaAtiva: number;
  /** Idade da inscrição mais antiga, em DIAS antes da refIso. null = não inscrito. */
  inscricaoIdadeDias: number | null;
  situacaoParcelamento: SituacaoParcelamento;
  capacidadePagamento: CapacidadePagamento;
}

/**
 * Especificações dos perfis sintéticos (~8 clientes). O spread cobre todos os níveis de
 * elegibilidade e portes de dívida. IDs estáveis. Valores ILUSTRATIVOS.
 */
const SPECS: PerfilSpec[] = [
  // FORTE + GRANDE porte: DA alta, consolidada, sem parcelamento, CAPAG moderada → topo do ranking.
  {
    clienteId: "cli-gerez-a7", // coincide com o estadual do parcelamentos (cruzamento futuro)
    clienteNome: "Metalúrgica Gerês",
    segmento: "Indústria · Lucro Real",
    regime: "real",
    inscritoDividaAtiva: true,
    valorDividaAtiva: 2_400_000,
    inscricaoIdadeDias: 900, // consolidada (> 540)
    situacaoParcelamento: "sem_parcelamento",
    capacidadePagamento: "moderada",
  },
  // FORTE + MÉDIO porte: DA média, consolidada, parcelamento inadimplente (favorece), CAPAG boa.
  {
    clienteId: "cli-faro-a6", // coincide com o PGFN do parcelamentos
    clienteNome: "Transportes Faro",
    segmento: "Logística · Lucro Presumido",
    regime: "presumido",
    inscritoDividaAtiva: true,
    valorDividaAtiva: 1_500_000, // médio porte (≥ tetoPequeno, < tetoMedio)
    inscricaoIdadeDias: 720,
    situacaoParcelamento: "parcelamento_inadimplente",
    capacidadePagamento: "boa",
  },
  // CONDICIONAL + PEQUENO porte (capacidade de pagamento): consolidada, parcelamento ATIVO (ressalva).
  {
    clienteId: "cli-helva-b1",
    clienteNome: "Construtora Helva",
    segmento: "Construção civil · Lucro Presumido",
    regime: "presumido",
    inscritoDividaAtiva: true,
    valorDividaAtiva: 320_000,
    inscricaoIdadeDias: 650,
    situacaoParcelamento: "parcelamento_ativo",
    capacidadePagamento: "moderada",
  },
  // CONDICIONAL + PEQUENO porte: DA pequena, consolidada, CAPAG restrita (ressalva).
  {
    clienteId: "cli-ipane-b2",
    clienteNome: "Restaurante Ipanema",
    segmento: "Alimentação · Simples Nacional",
    regime: "simples",
    inscritoDividaAtiva: true,
    valorDividaAtiva: 42_000,
    inscricaoIdadeDias: 600,
    situacaoParcelamento: "sem_parcelamento",
    capacidadePagamento: "restrita",
  },
  // CONDICIONAL + PEQUENO porte: DA pequena, RECENTE (≥ mínima, < consolidada) → ressalva de maturidade.
  {
    clienteId: "cli-jundi-b3",
    clienteNome: "Auto Peças Jundiá",
    segmento: "Autopeças · Simples Nacional",
    regime: "simples",
    inscritoDividaAtiva: true,
    valorDividaAtiva: 28_000,
    inscricaoIdadeDias: 200, // ≥ 90 (mínima) e < 540 (consolidada)
    situacaoParcelamento: "sem_parcelamento",
    capacidadePagamento: "boa",
  },
  // REQUER ANÁLISE: DA relevante mas CAPAG desconhecida → falta sinal p/ indicar.
  {
    clienteId: "cli-kaeta-b4",
    clienteNome: "Distribuidora Caeté",
    segmento: "Atacado · Lucro Real",
    regime: "real",
    inscritoDividaAtiva: true,
    valorDividaAtiva: 180_000,
    inscricaoIdadeDias: 800,
    situacaoParcelamento: "sem_parcelamento",
    capacidadePagamento: "desconhecida",
  },
  // REQUER ANÁLISE: DA relevante mas inscrição MUITO RECENTE (< mínima) → pode ser outra via.
  {
    clienteId: "cli-lapa-b5",
    clienteNome: "Gráfica Lapa",
    segmento: "Gráfica · Lucro Presumido",
    regime: "presumido",
    inscritoDividaAtiva: true,
    valorDividaAtiva: 95_000,
    inscricaoIdadeDias: 40, // < 90 (mínima)
    situacaoParcelamento: "sem_parcelamento",
    capacidadePagamento: "moderada",
  },
  // NÃO ELEGÍVEL: sem dívida ativa.
  {
    clienteId: "cli-evora-a5", // coincide com a "em dia" do parcelamentos
    clienteNome: "Ótica Évora",
    segmento: "Comércio · Simples Nacional",
    regime: "simples",
    inscritoDividaAtiva: false,
    valorDividaAtiva: 0,
    inscricaoIdadeDias: null,
    situacaoParcelamento: "parcelamento_ativo",
    capacidadePagamento: "boa",
  },
  // NÃO ELEGÍVEL: DA abaixo do piso de materialidade (R$ 5.000).
  {
    clienteId: "cli-morro-b6",
    clienteNome: "Papelaria Morro",
    segmento: "Varejo · Simples Nacional",
    regime: "simples",
    inscritoDividaAtiva: true,
    valorDividaAtiva: 1_800, // < piso 5.000
    inscricaoIdadeDias: 400,
    situacaoParcelamento: "sem_parcelamento",
    capacidadePagamento: "moderada",
  },
];

/** Converte um PerfilSpec num PerfilFiscalSeed, ancorando a idade da inscrição na refIso. */
function specParaPerfil(s: PerfilSpec, refIso: string): PerfilFiscalSeed {
  return {
    clienteId: s.clienteId,
    clienteNome: s.clienteNome,
    segmento: s.segmento,
    regime: s.regime,
    inscritoDividaAtiva: s.inscritoDividaAtiva,
    valorDividaAtiva: s.valorDividaAtiva,
    inscricaoMaisAntigaIso:
      s.inscricaoIdadeDias == null ? null : menosDias(refIso, s.inscricaoIdadeDias),
    situacaoParcelamento: s.situacaoParcelamento,
    capacidadePagamento: s.capacidadePagamento,
  };
}

/**
 * Monta a lista de perfis fiscais SINTÉTICOS a partir de uma data de referência. Chamada
 * pela page (Server Component) com a data atual — o spread de elegibilidade fica estável no
 * tempo (a idade das inscrições é relativa à refIso). Determinístico.
 */
export function getPerfisFiscaisSinteticos(refIso: string): PerfilFiscalSeed[] {
  return SPECS.map((s) => specParaPerfil(s, refIso));
}
