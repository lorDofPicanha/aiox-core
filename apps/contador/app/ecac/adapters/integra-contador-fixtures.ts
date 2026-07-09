/**
 * S1 — Fixtures do adapter Integra Contador (SERPRO), em arquivo separado (handoff 58 §4).
 *
 * Payloads CRUS no dialeto SERPRO (wire types de integra-contador-adapter.ts) que o adapter
 * traduz em MODO FIXTURE — ZERO rede. Espelham o espectro do seed S3/S5 (uma intimação no
 * limite, uma expirada, uma urgente, comunicados, recibos; pendências SITFIS por cliente).
 *
 * Datas derivadas de uma DATA DE REFERÊNCIA (refIso) — determinístico e estável no tempo, igual
 * a saude-fiscal-data.ts. Os 3 CNPJs batem com a CARTEIRA_ECAC (join por documento).
 *
 * G6: cada item carrega um INDÍCIO; nada aqui afirma "regularizado". Valores ILUSTRATIVOS.
 */
import type { SerproEvento, SerproMensagemCaixa, SerproSitfis } from "./integra-contador-adapter";

/** Registro documento(CNPJ) → identidade de cliente (mesma carteira demo do e-CAC). */
export const CARTEIRA_FIXTURE: Record<string, { clienteId: string; clienteNome: string }> = {
  "11222333000181": { clienteId: "a1", clienteNome: "Farmácia Aurora" },
  "22333444000172": { clienteId: "a2", clienteNome: "Posto Brasa Combustíveis ME" },
  "33444555000163": { clienteId: "a3", clienteNome: "Mercado Cedro Bebidas SA" },
};

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

/**
 * Caixa postal crua (CAIXAPOSTAL) por contribuinte (ni = CNPJ), relativa ao refIso. Cobre
 * intimação expirada / no limite / urgente / folgada, comunicado "!" e recibo informativo.
 */
export function getFixtureCaixaPostalRaw(
  refIso: string,
): Array<{ ni: string; mensagens: SerproMensagemCaixa[] }> {
  return [
    {
      ni: "22333444000172", // Posto Brasa
      mensagens: [
        {
          isn: "brasa-intima-omissao",
          assunto: "Intimação — omissão de entrega de declaração (DCTFWeb 05/2026)",
          origem: "Receita Federal do Brasil",
          dataEnvio: menosDias(refIso, 20),
          indicadorLida: "N",
          indicadorRelevancia: "S",
          categoria: "INTIMACAO",
          dataLimiteResposta: maisDias(refIso, -3), // prazo já passou → expirado
        },
        {
          isn: "brasa-intima-divida",
          assunto: "Intimação — manifestação sobre inscrição em dívida ativa da União",
          origem: "PGFN",
          dataEnvio: menosDias(refIso, 6),
          indicadorLida: "N",
          indicadorRelevancia: "S",
          categoria: "EXIGENCIA",
          dataLimiteResposta: maisDias(refIso, 5), // urgente (≤7)
        },
        {
          isn: "brasa-aviso-cnd",
          assunto: "Aviso de vencimento de certidão (CND Federal)",
          origem: "Receita Federal do Brasil",
          dataEnvio: menosDias(refIso, 17),
          indicadorLida: "N",
          indicadorRelevancia: "S",
          categoria: "COMUNICADO", // marca "!" sem prazo → atenção
        },
      ],
    },
    {
      ni: "33444555000163", // Mercado Cedro
      mensagens: [
        {
          isn: "cedro-intima-icms",
          assunto: "Intimação fiscal — esclarecimentos sobre débito de ICMS",
          origem: "Secretaria da Fazenda Estadual",
          dataEnvio: menosDias(refIso, 25),
          indicadorLida: "N",
          indicadorRelevancia: "N",
          categoria: "INTIMACAO",
          dataLimiteResposta: refIso, // vence hoje → no_limite
        },
        {
          isn: "cedro-recibo-efd",
          assunto: "Recibo de entrega da EFD ICMS/IPI (05/2026)",
          origem: "Secretaria da Fazenda Estadual",
          dataEnvio: menosDias(refIso, 11),
          indicadorLida: "S",
          indicadorRelevancia: "N",
          categoria: "RECIBO", // informativo
        },
      ],
    },
    {
      ni: "11222333000181", // Farmácia Aurora
      mensagens: [
        {
          isn: "aurora-intima-malha",
          assunto: "Intimação — esclarecimento sobre divergência em DCTFWeb",
          origem: "Receita Federal do Brasil",
          dataEnvio: menosDias(refIso, 4),
          indicadorLida: "N",
          indicadorRelevancia: "S",
          categoria: "INTIMACAO",
          dataLimiteResposta: maisDias(refIso, 18), // folgado (>7)
        },
        {
          isn: "aurora-dte",
          assunto: "Comunicado — opção pelo Domicílio Tributário Eletrônico (DTE)",
          origem: "Receita Federal do Brasil",
          dataEnvio: menosDias(refIso, 7),
          indicadorLida: "N",
          indicadorRelevancia: "S",
          categoria: "COMUNICADO", // marca "!" sem prazo → atenção
        },
      ],
    },
  ];
}

/** Relatórios SITFIS crus por contribuinte, relativos ao refIso. */
export function getFixtureSitfisRaw(refIso: string): SerproSitfis[] {
  return [
    {
      ni: "11222333000181", // Aurora — sem pendência no relatório
      protocolo: "SITFIS-A1-0001",
      dataHora: menosDias(refIso, 1),
      pendencias: [],
    },
    {
      ni: "22333444000172", // Brasa — pendências (débito + omissão)
      protocolo: "SITFIS-A2-0001",
      dataHora: menosDias(refIso, 1),
      pendencias: [
        {
          codigo: "SIEF",
          tipo: "Débito (SIEF)",
          descricao: "Indício de débito federal em aberto conforme relatório de situação fiscal.",
        },
        {
          codigo: "DCTF",
          tipo: "Omissão de declaração",
          descricao: "Indício de omissão de entrega de DCTFWeb na competência 05/2026.",
        },
      ],
    },
    {
      ni: "33444555000163", // Cedro — pendência estadual/ICMS
      protocolo: "SITFIS-A3-0001",
      dataHora: menosDias(refIso, 1),
      pendencias: [
        {
          codigo: "SIEF",
          tipo: "Débito (SIEF)",
          descricao: "Indício de débito de ICMS em aberto conforme relatório de situação fiscal.",
        },
      ],
    },
  ];
}

/** Eventos crus de atualização (mudanças recentes), relativos ao refIso. */
export function getFixtureEventosRaw(refIso: string): SerproEvento[] {
  return [
    { ni: "22333444000172", evento: "CAIXAPOSTAL", dataHora: menosDias(refIso, 0) },
    { ni: "33444555000163", evento: "SITFIS", dataHora: menosDias(refIso, 1) },
  ];
}
