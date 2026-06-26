import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import en from "../../messages/en.json";

type Dict = Record<string, unknown>;

// Deep-merge locale messages over the English base so partial translations
// (es/de/fr) fall back to EN for any missing key.
function merge(base: Dict, over: Dict): Dict {
  const out: Dict = { ...base };
  for (const k of Object.keys(over)) {
    const b = base[k];
    const o = over[k];
    out[k] =
      b && o && typeof b === "object" && typeof o === "object" && !Array.isArray(b)
        ? merge(b as Dict, o as Dict)
        : o;
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages =
    locale === "en"
      ? en
      : merge(
          en as Dict,
          (await import(`../../messages/${locale}.json`)).default as Dict
        );

  return { locale, messages };
});
