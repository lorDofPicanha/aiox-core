import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  // pdf-parse usa require dinâmico + assets (fontes/worker) que o bundler do Next quebra;
  // mantê-lo externo faz a rota /api/edital-erm carregá-lo do node_modules em runtime.
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
