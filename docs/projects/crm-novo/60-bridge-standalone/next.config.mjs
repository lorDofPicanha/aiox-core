import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: projectRoot,
  },
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000'] },
  },
  // Inngest functions são server-only — sem build-time evaluation
  serverExternalPackages: ['inngest', 'google-ads-api'],
};

export default nextConfig;
