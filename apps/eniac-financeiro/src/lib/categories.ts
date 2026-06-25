/**
 * Categorias default do livro-caixa. Editáveis no futuro; por ora fixas para
 * manter o lançamento rápido (chips de 1 toque). Sem jargão contábil.
 */

export type EntryType = "in" | "out";

export const CATEGORIES: Record<EntryType, string[]> = {
  in: ["Vendas", "Serviços", "Recebimentos", "Outros"],
  out: ["Fornecedores", "Salários", "Impostos", "Aluguel", "Operacional", "Outros"],
};

export function categoriesFor(type: EntryType): string[] {
  return CATEGORIES[type];
}
