/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000'] },
  },
  // Inngest functions são server-only — sem build-time evaluation
  serverExternalPackages: ['inngest', 'google-ads-api'],
};

export default nextConfig;
