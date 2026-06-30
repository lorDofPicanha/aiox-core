// The 7 areas of Noyce. 6 are workflow verbs (Mesa is the router/overview),
// 1 is config/governance. "Indicar Diferencial" (Stage 3) is NOT a tab — it is the
// delivery of the Analisar tab (the 5 prescriptive phrases).
export type TabId =
  | "mesa"
  | "monitorar"
  | "analisar"
  | "habilitar"
  | "acompanhar"
  | "recorrer"
  | "governanca";

export interface TabDef {
  id: TabId;
  label: string;
  group: "operacao" | "config";
  responsibility: string;
}

export const TABS: TabDef[] = [
  { id: "mesa", label: "Mesa", group: "operacao", responsibility: "Trabalho do dia priorizado + rota para a próxima ação" },
  { id: "monitorar", label: "Monitorar", group: "operacao", responsibility: "Acompanhar TODO o processo: descobrir editais, pipeline das que sigo e vigilância de prazo (dor #1)" },
  { id: "analisar", label: "Analisar", group: "operacao", responsibility: "Veredito vai/não-vai + 5 frases prescritivas" },
  { id: "habilitar", label: "Habilitar", group: "operacao", responsibility: "Casar requisitos × acervo e montar o dossiê" },
  { id: "recorrer", label: "Recorrer", group: "operacao", responsibility: "Decidir recurso e minutar as razões" },
  { id: "governanca", label: "Acessos & Governança", group: "config", responsibility: "Portais, vault, ToS e readiness do piloto" },
];

// Maps an opportunity's workflow stage to the operational tab that owns it.
export function stageToTab(stage: string): TabId {
  if (stage === "monitorar" || stage === "acompanhar") return "monitorar"; // Acompanhar fundido em Monitorar
  if (stage === "analisar" || stage === "indicar") return "analisar";
  if (stage === "habilitar") return "habilitar";
  if (stage === "recorrer") return "recorrer";
  return "analisar";
}
