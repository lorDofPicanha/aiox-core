/**
 * Service worker do Livro Caixa ENIAC.
 *
 * Regra inegociável: NENHUM dado financeiro é cacheado. Saldo, lançamentos,
 * vencimentos e respostas do copiloto vêm sempre da rede. O cache guarda só a
 * casca estática (bundles do Next, ícones) e a página de offline.
 *
 * Suba VERSION ao mudar a estratégia — o activate limpa os caches antigos.
 */

const VERSION = "v1";
const SHELL = `shell-${VERSION}`;
const OFFLINE_URL = "/offline.html";
const PRECACHE = [OFFLINE_URL, "/icon-192.png"];

/** Só estes caminhos podem entrar no cache. */
function isCacheableAsset(pathname) {
  return pathname.startsWith("/_next/static/") || /^\/(icon-\d+|apple-touch-icon)\.png$/.test(pathname);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== SHELL).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Supabase, OpenAI, Pluggy: sempre rede, nunca tocados pelo SW.
  if (url.origin !== self.location.origin) return;
  // Rotas de API e de auth carregam estado sensível — passam direto.
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) return;

  // Navegação: rede primeiro; sem sinal, cai na página de offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match(OFFLINE_URL);
        return (
          cached ??
          new Response("Sem conexão.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          })
        );
      }),
    );
    return;
  }

  // Casca estática (hashes imutáveis): cache primeiro.
  if (isCacheableAsset(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ??
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(SHELL).then((cache) => cache.put(request, copy));
            }
            return response;
          }),
      ),
    );
  }
});
