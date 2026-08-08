"use client";
import { useLocale, useTranslations } from "next-intl";
import { waUrl } from "@/lib/inquiry";
import { trackLead } from "@/lib/track";

const lp = (p: string, l: string) => (l === "en" ? p : `/${l}${p}`);

export default function Footer() {
  const t = useTranslations("footer");
  const n = useTranslations("nav");
  const tw = useTranslations("wa");
  const l = useLocale();
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-top">
          <div className="ftr-brand">
            <div className="logo">TOCKS</div>
            <p>{t("tagline")}</p>
            <div className="since">{t("since")}</div>
          </div>
          <div className="ftr-col">
            <h5>{n("collection")}</h5>
            <a href={lp("/collection", l)}>{n("collection")}</a>
            <a href={lp("/atelier", l)}>{n("atelier")}</a>
            <a href={lp("/configurator", l)}>{n("configurator")}</a>
          </div>
          <div className="ftr-col">
            <h5>{t("contact")}</h5>
            <a href={lp("/contact", l)}>{n("contact")}</a>
            <a href={waUrl(tw("contact"))} target="_blank" rel="noopener noreferrer" onClick={() => trackLead({ channel: "whatsapp", source: "footer" })}>WhatsApp</a>
            <a href="mailto:contato@tockscustom.com.br" onClick={() => trackLead({ channel: "email", source: "footer" })}>contato@tockscustom.com.br</a>
          </div>
        </div>
        <div className="ftr-base">
          <span>© 2026 · {t("rights")}</span>
          <span className="meta">Signed &amp; numbered · Insured worldwide delivery</span>
        </div>
      </div>
      <div className="ftr-sign" aria-hidden="true">TOCKS</div>
    </footer>
  );
}
