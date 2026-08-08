"use client";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const LANG_LABEL: Record<string, string> = {
  en: "English",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
};

export default function Header({ solidOnScroll = false }: { solidOnScroll?: boolean }) {
  const t = useTranslations("nav");
  const tsw = useTranslations("sw");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solid, setSolid] = useState(!solidOnScroll);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!solidOnScroll) return;
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solidOnScroll]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function switchLocale(l: Locale) {
    router.replace(pathname, { locale: l });
    setOpen(false);
  }

  return (
    <div className={`hdr${solid ? " solid" : ""}`}>
      <div className="in">
        <a href={`/${locale === "en" ? "" : locale}`} className="logo">TOCKS</a>
        <nav className="nav">
          <a href={localized("/collection", locale)}>{t("collection")}</a>
          <a href={localized("/atelier", locale)}>{t("atelier")}</a>
          <a href={localized("/configurator", locale)}>{t("configurator")}</a>
          <a href={localized("/contact", locale)}>{t("contact")}</a>
        </nav>
        <div className="mark-wrap" ref={wrapRef}>
          <button className={`mark${open ? " open" : ""}`} onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}>
            <span>{locale.toUpperCase()}</span>
            <span className="sep">·</span>
            <span>$</span>
            <span className="chev" />
          </button>
          <div className={`panel${open ? " open" : ""}`}>
            <div>
              <h4>{tsw("language")}</h4>
              {routing.locales.map((l) => (
                <button key={l} className={`opt${l === locale ? " active" : ""}`} onClick={() => switchLocale(l)}>
                  <span className="dot" />{LANG_LABEL[l]}
                </button>
              ))}
            </div>
            <div>
              <h4>{tsw("currency")}</h4>
              <div className="opt active"><span className="dot" />$ USD</div>
            </div>
          </div>
        </div>
        <button className={`burger${mobileOpen ? " open" : ""}`} aria-label="Menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen((v) => !v)}>
          <span /><span /><span />
        </button>
      </div>
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`}>
        <a href={localized("/collection", locale)} onClick={() => setMobileOpen(false)}>{t("collection")}</a>
        <a href={localized("/atelier", locale)} onClick={() => setMobileOpen(false)}>{t("atelier")}</a>
        <a href={localized("/configurator", locale)} onClick={() => setMobileOpen(false)}>{t("configurator")}</a>
        <a href={localized("/contact", locale)} onClick={() => setMobileOpen(false)}>{t("contact")}</a>
      </div>
    </div>
  );
}

function localized(path: string, locale: string) {
  return locale === "en" ? path : `/${locale}${path}`;
}
