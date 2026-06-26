import { setRequestLocale } from "next-intl/server";
import Atelier from "@/components/Atelier";

export default async function AtelierPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Atelier />;
}
