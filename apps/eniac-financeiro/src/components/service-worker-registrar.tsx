"use client";

import { useEffect } from "react";

/**
 * Registra o service worker apenas em produção — em dev ele serviria bundles
 * velhos e mascararia mudanças de código.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registro é progressive enhancement: falhar aqui não pode quebrar o app.
    });
  }, []);

  return null;
}
