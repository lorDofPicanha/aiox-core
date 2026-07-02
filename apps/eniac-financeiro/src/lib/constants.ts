/** Constantes/tipos compartilhados (módulo neutro — não é "use server"). */

export const SELECTED_COMPANY_COOKIE = "eniac_company";

export interface ActionResult {
  status: "ok" | "error";
  message?: string;
}
