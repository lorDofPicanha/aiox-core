import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Pdp from "@/components/Pdp";
import { catalog, getProduct } from "@/data/catalog";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    catalog.map((p) => ({ locale, slug: p.slug }))
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = getProduct(slug);
  if (!product) notFound();
  return <Pdp product={product} />;
}
