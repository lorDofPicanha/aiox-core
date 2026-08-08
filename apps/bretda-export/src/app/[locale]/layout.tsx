import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Bodoni_Moda, Raleway } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Analytics } from "@/components/Analytics";
import "../globals.css";

// Absolute URLs for og/canonical. Set NEXT_PUBLIC_SITE_URL once the custom
// domain is live so the tags stop pointing at the preview host.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bretda-export.vercel.app";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});
const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const META: Record<string, { title: string; description: string }> = {
  en: { title: "Tocks — Luxury Billiards Tables · Made to Order in Brazil", description: "Hand-crafted luxury billiards tables, made to order in Brazil and delivered white-glove to the US & Europe." },
  es: { title: "Tocks — Mesas de Billar de Lujo · Hechas a Medida en Brasil", description: "Mesas de billar de lujo hechas a mano, fabricadas a medida en Brasil y entregadas con guante blanco en EE. UU. y Europa." },
  de: { title: "Tocks — Luxus-Billardtische · Auf Bestellung aus Brasilien", description: "Handgefertigte Luxus-Billardtische, auf Bestellung in Brasilien gefertigt und weltweit mit White-Glove-Service geliefert." },
  fr: { title: "Tocks — Tables de Billard de Luxe · Sur Commande au Brésil", description: "Tables de billard de luxe fabriquées à la main, sur commande au Brésil et livrées en gants blancs aux États-Unis et en Europe." },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.en;
  const path = locale === "en" ? "/" : `/${locale}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: m.title,
    description: m.description,
    alternates: {
      canonical: path,
      languages: { en: "/", es: "/es", de: "/de", fr: "/fr", "x-default": "/" },
    },
    openGraph: { title: m.title, description: m.description, locale, type: "website", url: path },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${bodoni.variable} ${raleway.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
