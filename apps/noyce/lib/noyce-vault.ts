// Vault de documentos client-side (Sprint D1, 12/Jun): o usuário sobe certidões/balanço/CATs/edital,
// os blobs ficam no IndexedDB e os METADADOS (tipo, validade) viram RegularityDoc[] que alimenta
// o motor — a frente fiscal do checklist passa a conferir documentos REAIS contra a data da sessão.
// Regra de segurança do projeto (CONTEXT §12): arquivos ficam SÓ neste navegador; nada sobe pra
// git/doc/nuvem. Credenciais NUNCA entram aqui.
import type { RegularityDoc } from "./noyce-model";

export const DOC_TYPES = [
  "CND Federal",
  "CND Estadual",
  "CND Municipal",
  "CRF-FGTS",
  "CNDT",
  "Certidão de Falência",
  "Contrato Social",
  "Balanço Patrimonial",
  "CAT / Atestado",
  "Edital (PDF)",
  "Outro",
] as const;
export type VaultDocType = (typeof DOC_TYPES)[number];

/** Tipos que entram na conferência fiscal/jurídica automática (RegularityDoc). */
const REGULARITY_TYPES: ReadonlySet<string> = new Set([
  "CND Federal",
  "CND Estadual",
  "CND Municipal",
  "CRF-FGTS",
  "CNDT",
  "Certidão de Falência",
  "Contrato Social",
]);

export interface VaultDocMeta {
  id: string;
  tipo: VaultDocType;
  fileName: string;
  byteLength: number;
  /** ISO date — null para docs sem validade (contrato social, CAT). */
  validade: string | null;
  uploadedAt: string;
}

const META_KEY = "noyce.vault.meta.v1";
const DB_NAME = "noyce-vault";
const STORE = "files";

export function loadVaultMeta(): VaultDocMeta[] {
  try {
    const raw = globalThis.localStorage?.getItem(META_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveVaultMeta(meta: VaultDocMeta[]) {
  globalThis.localStorage?.setItem(META_KEY, JSON.stringify(meta));
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = globalThis.indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function vaultPut(id: string, file: Blob): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(file, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function vaultGet(id: string): Promise<Blob | null> {
  const db = await openDb();
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve((req.result as Blob) ?? null);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return blob;
}

export async function vaultDelete(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function addVaultDoc(file: File, tipo: VaultDocType, validade: string | null): Promise<VaultDocMeta> {
  const id = `vault-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await vaultPut(id, file);
  const meta: VaultDocMeta = {
    id,
    tipo,
    fileName: file.name,
    byteLength: file.size,
    validade,
    uploadedAt: new Date().toISOString(),
  };
  const all = [...loadVaultMeta(), meta];
  saveVaultMeta(all);
  return meta;
}

export async function removeVaultDoc(id: string): Promise<void> {
  await vaultDelete(id);
  saveVaultMeta(loadVaultMeta().filter((m) => m.id !== id));
}

/**
 * Download individual de um documento do vault (Story 30.4, AC5): lê o blob do IndexedDB
 * pelo id e dispara o download local via URL de objeto temporária — NUNCA via rede
 * (invariante de segurança do vault, doc 26 §9). Retorna false se o blob não existe.
 * Centraliza o padrão já usado em VaultUpload.tsx para reuso no IndividualDocsPanel.
 */
export async function downloadVaultDoc(id: string, fileName: string): Promise<boolean> {
  const blob = await vaultGet(id);
  if (!blob) return false;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}

/** Converte os docs do vault em RegularityDoc[] para o motor (pura — testável em node). */
export function vaultToRegularity(meta: readonly VaultDocMeta[], asOf: string): RegularityDoc[] {
  return meta
    .filter((m) => REGULARITY_TYPES.has(m.tipo))
    .map((m) => ({
      id: m.id,
      tipo: m.tipo,
      status:
        m.validade === null
          ? ("vigente" as const)
          : new Date(m.validade).getTime() >= new Date(asOf).getTime()
            ? ("vigente" as const)
            : ("vencido" as const),
      validade: m.validade,
      fonte: `upload do usuário (${m.fileName})`,
    }));
}
