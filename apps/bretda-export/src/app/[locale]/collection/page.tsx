import { setRequestLocale } from "next-intl/server";
import Collection from "@/components/Collection";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Collection />;
}
