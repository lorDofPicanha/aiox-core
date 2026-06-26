import { setRequestLocale } from "next-intl/server";
import Configurator from "@/components/Configurator";
import { flagship } from "@/data/catalog";

export default async function ConfiguratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Configurator initialSlug={flagship.slug} />;
}
