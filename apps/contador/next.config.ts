import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  // O api-client é um pacote local (file:) compilado para dist/. Sem transpile aqui.
};

export default nextConfig;
