"use client";
import { useEffect } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Header from "./Header";
import Footer from "./Footer";
import { waUrl } from "@/lib/inquiry";
import { trackLead } from "@/lib/track";

const lp = (p: string, l: string) => (l === "en" ? p : `/${l}${p}`);

export default function Home() {
  const t = useTranslations("home");
  const tw = useTranslations("wa");
  const locale = useLocale();
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
      <Header solidOnScroll />
      <section className="hero">
        <Image
          src="/tocks/elipse/lifestyle.jpg"
          alt="Tocks Elipse"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", zIndex: 0 }}
        />
        <div className="scrim" />
        <div className="vig" />
        <div className="in">
          <div className="eyebrow reveal in">{t("origin")}</div>
          <h1 className="reveal in">
            {t("h1a")}<br />
            <em>{t("h1b")}</em>
          </h1>
          <p className="sub reveal in">{t("sub")}</p>
          <div className="cta-row reveal in">
            <a className="cta" href={viewing} target="_blank" rel="noopener noreferrer" onClick={() => trackLead({ channel: "whatsapp", source: "home_hero" })}>{t("book")}</a>
            <a className="ghostlink" href={lp("/collection", locale)}>{t("cta")}</a>
          </div>
        </div>
        <div className="scrollcue"><span className="line" /><span>{t("scroll")}</span></div>
      </section>

      <section className="sec">
        <div className="chapter">
          <div className="ph reveal"><Image src="/img/espinela-1.jpg" alt="Craft" width={1200} height={900} sizes="(max-width: 900px) 100vw, 50vw" style={{ width: "100%", height: "auto" }} /></div>
          <div className="reveal">
            <div className="k">{t("c1k")}</div>
            <h2>{t("c1h")}</h2>
            <p>{t("c1p")}</p>
            <a className="more" href={lp("/collection", locale)}>{t("c1m")}</a>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="k reveal" style={{ marginBottom: 28 }}>{t("linesk")}</div>
        <div className="lines reveal">
          <a className="line" href={lp("/collection", locale)}>
            <Image src="/img/aurora-1.jpg" alt="Atelier" fill sizes="(max-width: 900px) 100vw, 50vw" />
            <div className="ov"><div className="t">Atelier</div><div className="d">{t("atelierD")}</div></div>
          </a>
          <a className="line" href={lp("/collection", locale)}>
            <Image src="/tocks/vertice/hero.jpg" alt="Signature" fill sizes="(max-width: 900px) 100vw, 50vw" />
            <div className="ov"><div className="t">Signature</div><div className="d">{t("signatureD")}</div></div>
          </a>
        </div>
      </section>

      <section className="sec craft">
        <div className="q reveal">{t("quote")}</div>
        <div className="stats reveal">
          <div className="stat"><div className="n">600+</div><div className="l">{t("s1")}</div></div>
          <div className="stat"><div className="n">2009</div><div className="l">{t("s2")}</div></div>
          <div className="stat"><div className="n">23</div><div className="l">{t("s3")}</div></div>
        </div>
      </section>

      <section className="ctaband">
        <div className="eyebrow">{t("ctaEb")}</div>
        <h2 className="reveal">{t("ctaH")}</h2>
        <a className="cta reveal" href={viewing} target="_blank" rel="noopener noreferrer" onClick={() => trackLead({ channel: "whatsapp", source: "home_footer_cta" })}>{t("ctaBtn")}</a>
      </section>
      <Footer />
    </>
  );
}
