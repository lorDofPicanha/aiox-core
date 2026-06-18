"use client";

// Upload de documentos da empresa (D1, 12/Jun): certidões/balanço/CATs/edital sobem aqui,
// ficam SÓ neste navegador (IndexedDB) e alimentam a conferência automática do motor.
import { useState } from "react";
import {
  addVaultDoc,
  DOC_TYPES,
  downloadVaultDoc,
  removeVaultDoc,
  type VaultDocType,
} from "@/lib/noyce-vault";
import { useVaultMeta, VAULT_CHANGED_EVENT } from "@/components/shell/useLiveChecklist";

const NEEDS_VALIDADE: ReadonlySet<string> = new Set([
  "CND Federal",
  "CND Estadual",
  "CND Municipal",
  "CRF-FGTS",
  "CNDT",
  "Certidão de Falência",
]);

export function VaultUpload() {
  const meta = useVaultMeta();
  const [tipo, setTipo] = useState<VaultDocType>("CND Federal");
  const [validade, setValidade] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function upload() {
    if (!file) return;
    setBusy(true);
    try {
      await addVaultDoc(file, tipo, NEEDS_VALIDADE.has(tipo) && validade ? validade : null);
      globalThis.dispatchEvent?.(new Event(VAULT_CHANGED_EVENT));
      setFile(null);
      setValidade("");
    } finally {
      setBusy(false);
    }
  }

  async function download(id: string, fileName: string) {
    await downloadVaultDoc(id, fileName);
  }

  async function remove(id: string) {
    await removeVaultDoc(id);
    globalThis.dispatchEvent?.(new Event(VAULT_CHANGED_EVENT));
  }

  return (
    <section className="vault-upload" aria-labelledby="vault-title">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Vault de documentos</p>
          <h3 id="vault-title">Suba certidões, balanço, CATs e editais</h3>
        </div>
        <span>{meta.length} documento(s)</span>
      </div>
      <p className="vault-note">
        Certidões com validade entram na conferência automática (frente fiscal) na hora. Arquivos ficam{" "}
        <strong>somente neste navegador</strong> — nada sobe para nuvem ou portal.
      </p>

      <div className="vault-form">
        <label>
          <span>Tipo</span>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as VaultDocType)}>
            {DOC_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        {NEEDS_VALIDADE.has(tipo) ? (
          <label>
            <span>Validade</span>
            <input type="date" value={validade} onChange={(e) => setValidade(e.target.value)} />
          </label>
        ) : null}
        <label className="vault-file">
          <span>Arquivo</span>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        <button type="button" className="approve" disabled={!file || busy} onClick={upload}>
          {busy ? "Enviando…" : "⬆ Subir documento"}
        </button>
      </div>

      {meta.length > 0 ? (
        <div className="vault-list">
          {meta.map((doc) => (
            <div className="vault-row" key={doc.id}>
              <div>
                <strong>{doc.tipo}</strong>
                <p>
                  {doc.fileName} · {(doc.byteLength / 1024).toFixed(0)} KB
                  {doc.validade ? ` · validade ${doc.validade}` : ""}
                </p>
              </div>
              <div className="vault-actions">
                <button type="button" onClick={() => download(doc.id, doc.fileName)}>
                  ⬇ baixar
                </button>
                <button type="button" className="danger" onClick={() => remove(doc.id)}>
                  remover
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
