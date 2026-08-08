import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "de", "fr"],
  defaultLocale: "en",
  // Locale prefix: default locale (en) has no prefix; others do (/es, /de, /fr)
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
