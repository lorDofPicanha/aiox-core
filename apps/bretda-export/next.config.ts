import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  // Pin the workspace root to this app (silences the multi-lockfile warning).
  turbopack: { root: __dirname },
};

export default withNextIntl(nextConfig);
