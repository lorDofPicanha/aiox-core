/**
 * Categorização heurística por palavra-chave no histórico. Apenas um chute
 * inicial — o usuário ajusta no preview antes de importar. Sem LLM aqui.
 */

import type { EntryType } from "@/lib/categories";

const RULES_OUT: { re: RegExp; category: string }[] = [
  { re: /\b(sal[aá]rio|folha|pgto func|pro.?labore)\b/i, category: "Salários" },
  { re: /\b(imposto|das|darf|gps|fgts|inss|icms|iss|tribut)\b/i, category: "Impostos" },
  { re: /\b(aluguel|condom[ií]nio|loca[cç][aã]o)\b/i, category: "Aluguel" },
  { re: /\b(fornecedor|compra|nota fiscal|nf-?e|boleto)\b/i, category: "Fornecedores" },
  { re: /\b(energia|luz|[aá]gua|internet|telefone|conta de|tarifa|taxa)\b/i, category: "Operacional" },
];

const RULES_IN: { re: RegExp; category: string }[] = [
  { re: /\b(venda|vendas|pdv|cart[aã]o|cielo|stone|getnet|rede)\b/i, category: "Vendas" },
  { re: /\b(servi[cç]o|presta[cç][aã]o|honor[aá]rio)\b/i, category: "Serviços" },
  { re: /\b(pix|ted|doc|transfer|dep[oó]sito|recebimento)\b/i, category: "Recebimentos" },
];

export function guessCategory(description: string, type: EntryType): string | null {
  const rules = type === "in" ? RULES_IN : RULES_OUT;
  for (const { re, category } of rules) {
    if (re.test(description)) return category;
  }
  return null;
}
