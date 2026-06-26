import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Configurator from "@/components/Configurator";
import { catalog, getProduct } from "@/data/catalog";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    catalog.filter((p) => p.model).map((p) => ({ locale, slug: p.slug }))
  );
}

export default async function ConfiguratorSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = getProduct(slug);
  if (!product || !product.model) notFound();
  return <Configurator initialSlug={product.slug} />;
}
