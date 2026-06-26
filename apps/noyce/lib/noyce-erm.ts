import type { EditalRequirementsModel } from "./noyce-model";
// Imports ESM estáticos (browser/Next-safe) — substituem createRequire (node-only), pois este
// módulo agora é consumido por um client component (ReviewDossier). Mesmo padrão do noyce-data.
import curatedIndexJson from "./data/erms/index.json" with { type: "json" };
import novoGamaEdital7 from "./data/erms/novo-gama-edital-7.json" with { type: "json" };
import novoGamaEdital8 from "./data/erms/novo-gama-edital-8.json" with { type: "json" };

export type CuratedErmStatus = "curado_parcial";

export interface CuratedErmIndexEntry {
  editalId: string;
  file: string;
  arquivoOriginal: string;
  orgao: string;
  municipioIbge: string;
  aliases: string[];
  status: CuratedErmStatus;
}

export interface CuratedErmRegistryEntry extends CuratedErmIndexEntry {
  erm: EditalRequirementsModel;
}

export interface EditalLookupInput {
  id?: string | null;
  editalId?: string | null;
  arquivo?: string | null;
  file?: string | null;
  pncpId?: string | null;
}

interface CuratedErmIndex {
  version: string;
  source: string;
  note: string;
  editais: CuratedErmIndexEntry[];
}

const curatedIndex = curatedIndexJson as unknown as CuratedErmIndex;
const ermsByFile: Record<string, EditalRequirementsModel> = {
  "novo-gama-edital-7.json": novoGamaEdital7 as unknown as EditalRequirementsModel,
  "novo-gama-edital-8.json": novoGamaEdital8 as unknown as EditalRequirementsModel,
};

export const curatedErmRegistry: CuratedErmRegistryEntry[] = curatedIndex.editais.map((entry) => ({
  ...entry,
  erm: ermsByFile[entry.file],
}));

export function listCuratedErms(): CuratedErmRegistryEntry[] {
  return curatedErmRegistry;
}

export function getCuratedErmById(editalId: string): EditalRequirementsModel | null {
  return findRegistryEntry(editalId)?.erm ?? null;
}

export function getCuratedErmForEdital(input: EditalLookupInput): EditalRequirementsModel | null {
  const candidates = [input.editalId, input.id, input.arquivo, input.file, input.pncpId]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .map(normalizeKey);

  const match = curatedErmRegistry.find((entry) => {
    const keys = [entry.editalId, entry.file, entry.arquivoOriginal, ...entry.aliases].map(normalizeKey);
    return candidates.some((candidate) => keys.includes(candidate));
  });

  return match?.erm ?? null;
}

function findRegistryEntry(editalId: string): CuratedErmRegistryEntry | null {
  const normalized = normalizeKey(editalId);
  return (
    curatedErmRegistry.find((entry) =>
      [entry.editalId, entry.file, entry.arquivoOriginal, ...entry.aliases].map(normalizeKey).includes(normalized),
    ) ?? null
  );
}

function normalizeKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
