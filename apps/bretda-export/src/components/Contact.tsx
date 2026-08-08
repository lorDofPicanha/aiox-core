"use client";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import Header from "./Header";
import Footer from "./Footer";
import { waUrl } from "@/lib/inquiry";
import { trackLead } from "@/lib/track";

export default function Contact() {
  const t = useTranslations("contact");
  const tw = useTranslations("wa");
  const wa = waUrl(tw("contact"));
  const viewing = waUrl(tw("viewing"));

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.18 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Header />
      <header className="pagehead">
        <span className="eyebrow reveal in">{t("eyebrow")}</span>
        <h1 className="reveal in">{t("h1a")}<br /><em>{t("h1b")}</em></h1>
        <p className="lead reveal in">{t("lead")}</p>
      </header>

      <section className="sec" style={{ paddingTop: 80 }}>
        <div className="contact-grid reveal">
          <div className="ccard">
            <div className="ck">{t("waK")}</div>
            <h3>{t("waH")}</h3>
            <p>{t("waP")}</p>
            <a className="clink" href={wa} target="_blank" rel="noopener noreferrer" onClick={() => trackLead({ channel: "whatsapp", source: "contact" })}>{t("waL")}</a>
          </div>
          <div className="ccard">
            <div className="ck">{t("emK")}</div>
            <h3>{t("emH")}</h3>
            <p>{t("emP")}</p>
            <a className="clink" href="mailto:contato@tockscustom.com.br" onClick={() => trackLead({ channel: "email", source: "contact" })}>{t("emL")}</a>
          </div>
          <div className="ccard">
            <div className="ck">{t("viK")}</div>
            <h3>{t("viH")}</h3>
            <p>{t("viP")}</p>
            <a className="clink" href={viewing} target="_blank" rel="noopener noreferrer" onClick={() => trackLead({ channel: "whatsapp", source: "contact_viewing" })}>{t("viL")}</a>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="k reveal" style={{ marginBottom: 18 }}>{t("stepsK")}</div>
        <div className="process reveal">
          {[1, 2, 3, 4].map((i) => (
            <div className="pstep" key={i}>
              <div className="pn">{t(`f${i}n`)}</div>
              <h3>{t(`f${i}h`)}</h3>
              <p>{t(`f${i}p`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="k reveal" style={{ marginBottom: 8 }}>{t("servedK")}</div>
        <div className="served reveal">
          {[1, 2, 3].map((i) => (
            <div className="reg" key={i}>
              <div className="rn">{t(`r${i}n`)}</div>
              <div className="rd">{t(`r${i}d`)}</div>
            </div>
          ))}
        </div>
        <p className="note reveal" style={{ marginTop: 34 }}>
          <b style={{ color: "var(--champagne)" }}>{t("respK")}</b> · {t("respV")}
        </p>
      </section>

      <section className="ctaband">
        <div className="eyebrow">{t("ctaEb")}</div>
        <h2 className="reveal">{t("ctaH")}</h2>
        <a className="cta reveal" href={viewing} target="_blank" rel="noopener noreferrer" onClick={() => trackLead({ channel: "whatsapp", source: "contact_footer_cta" })}>{t("ctaBtn")}</a>
      </section>
      <Footer />
    </>
  );
}
