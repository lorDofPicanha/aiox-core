/**
 * S4 — Fixtures do adapter Infosimples (CNDs), em arquivo separado.
 *
 * Itens CRUS no dialeto Infosimples (situação como TEXTO + validade "dd/mm/aaaa" ou ISO) que o
 * adapter traduz em MODO FIXTURE — ZERO rede. Cobre os 4 casos exigidos (handoff 58 §4, S4):
 *   - VÁLIDA           → "Negativa" + validade folgada          → regular (vigente)
 *   - A VENCER         → "Negativa" + validade na janela        → regular (vence em breve)
 *   - VENCIDA          → "Positiva" + validade no passado       → vencida
 *   - COM PENDÊNCIA    → "Positiva com efeito de negativa" (CPEN)→ pendente
 *
 * Datas relativas ao refIso (determinístico). Usa "dd/mm/aaaa" em alguns casos para exercitar o
 * parser e ISO normalizado em outros. G6: descreve situação extraída do portal; não afirma
 * "regularizado". Valores ILUSTRATIVOS.
 */
import type { EsferaCnd } from "../saude-fiscal-model";
import type { InfosimplesCertidaoData, TraducaoCndCtx } from "./infosimples-adapter";

/** Registro documento(CNPJ) → identidade de cliente (mesma carteira demo do e-CAC). */
export const CARTEIRA_INFOSIMPLES: Record<string, { clienteId: string; clienteNome: string }> = {
  "11222333000181": { clienteId: "a1", clienteNome: "Farmácia Aurora" },
  "22333444000172": { clienteId: "a2", clienteNome: "Posto Brasa Combustíveis ME" },
  "33444555000163": { clienteId: "a3", clienteNome: "Mercado Cedro Bebidas SA" },
};

/** Data relativa ao refIso em ISO. */
function isoRelativo(refIso: string, dias: number): string {
  const d = new Date(refIso);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString();
}

/** Data relativa ao refIso formatada como "dd/mm/aaaa" (UTC). */
function ddmmaaaaRelativo(refIso: string, dias: number): string {
  const d = new Date(refIso);
  d.setUTCDate(d.getUTCDate() + dias);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

interface CndFixtureSpec {
  clienteId: string;
  clienteNome: string;
  documento: string;
  esfera: EsferaCnd;
  data: InfosimplesCertidaoData;
}

/**
 * Itens crus (dialeto Infosimples) + contexto de tradução, relativos ao refIso. Um por
 * cliente/esfera cobrindo o espectro dos 4 casos.
 */
export function getFixtureCndsRaw(
  refIso: string,
): Array<{ data: InfosimplesCertidaoData; ctx: TraducaoCndCtx }> {
  const specs: CndFixtureSpec[] = [
    // VÁLIDA — Negativa, validade folgada (ISO normalizado).
    {
      clienteId: "a1",
      clienteNome: "Farmácia Aurora",
      documento: "11222333000181",
      esfera: "federal",
      data: {
        situacao: "Negativa",
        tipo_certidao: "Certidão Negativa de Débitos",
        normalizado_validade_data: isoRelativo(refIso, 120),
        codigo_controle: "A1B2.C3D4.E5F6.7890",
        data_emissao: isoRelativo(refIso, -60),
      },
    },
    // A VENCER — Negativa, validade na janela (dd/mm/aaaa, exercita o parser).
    {
      clienteId: "a1",
      clienteNome: "Farmácia Aurora",
      documento: "11222333000181",
      esfera: "fgts",
      data: {
        situacao: "Negativa",
        tipo_certidao: "Certificado de Regularidade do FGTS (CRF)",
        validade: ddmmaaaaRelativo(refIso, 15),
        codigo_controle: "2026000112233",
      },
    },
    // VENCIDA — Positiva de débitos, validade no passado.
    {
      clienteId: "a2",
      clienteNome: "Posto Brasa Combustíveis ME",
      documento: "22333444000172",
      esfera: "federal",
      data: {
        situacao: "Positiva",
        tipo_certidao: "Certidão Positiva de Débitos",
        validade: ddmmaaaaRelativo(refIso, -10),
        codigo_controle: "9988.7766.5544.3210",
      },
    },
    // COM PENDÊNCIA — Positiva com efeito de negativa (CPEN) → pendente.
    {
      clienteId: "a2",
      clienteNome: "Posto Brasa Combustíveis ME",
      documento: "22333444000172",
      esfera: "estadual",
      data: {
        situacao: "Positiva com efeito de negativa",
        tipo_certidao: "Certidão Positiva com Efeito de Negativa",
        normalizado_validade_data: isoRelativo(refIso, 40),
        codigo_controle: "SEFAZ-CPEN-0001",
      },
    },
    // A VENCER — trabalhista Cedro (dd/mm/aaaa curto).
    {
      clienteId: "a3",
      clienteNome: "Mercado Cedro Bebidas SA",
      documento: "33444555000163",
      esfera: "trabalhista",
      data: {
        situacao: "Negativa",
        tipo_certidao: "Certidão Negativa de Débitos Trabalhistas (CNDT)",
        validade: ddmmaaaaRelativo(refIso, 20),
        codigo_controle: "CNDT-0001-2026",
      },
    },
    // VENCIDA — estadual Cedro (ICMS) no passado.
    {
      clienteId: "a3",
      clienteNome: "Mercado Cedro Bebidas SA",
      documento: "33444555000163",
      esfera: "estadual",
      data: {
        situacao: "Positiva",
        tipo_certidao: "Certidão Positiva de Débitos (ICMS)",
        validade: ddmmaaaaRelativo(refIso, -30),
        codigo_controle: "SEFAZ-PR-9090",
      },
    },
  ];

  return specs.map((s) => ({
    data: s.data,
    ctx: {
      id: `cnd-${s.clienteId}-${s.esfera}`,
      clienteId: s.clienteId,
      clienteNome: s.clienteNome,
      documento: s.documento,
      esfera: s.esfera,
    },
  }));
}
