"use client";
import { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Header from "./Header";
import Footer from "./Footer";
import { waUrl } from "@/lib/inquiry";

export default function Atelier() {
  const t = useTranslations("atelier");
  const tw = useTranslations("wa");
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

      <section className="sec">
        <div className="chapter">
          <div className="ph reveal"><Image src="/img/espinela-1.jpg" alt="" width={1200} height={900} sizes="(max-width: 900px) 100vw, 50vw" style={{ width: "100%", height: "auto" }} /></div>
          <div className="reveal">
            <div className="k">{t("c1k")}</div>
            <h2>{t("c1h")}</h2>
            <p>{t("c1p")}</p>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="chapter">
          <div className="reveal">
            <div className="k">{t("c2k")}</div>
            <h2>{t("c2h")}</h2>
            <p>{t("c2p")}</p>
          </div>
          <div className="ph reveal"><Image src="/img/aurora-1.jpg" alt="" width={1200} height={900} sizes="(max-width: 900px) 100vw, 50vw" style={{ width: "100%", height: "auto" }} /></div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="k reveal" style={{ marginBottom: 18 }}>{t("procK")}</div>
        <div className="process reveal">
          {[1, 2, 3, 4].map((i) => (
            <div className="pstep" key={i}>
              <div className="pn">{t(`p${i}n`)}</div>
              <h3>{t(`p${i}h`)}</h3>
              <p>{t(`p${i}p`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="sec craft">
        <div className="q reveal">{t("quote")}</div>
        <div className="stats reveal">
          <div className="stat"><div className="n">600+</div><div className="l">{t("s1")}</div></div>
          <div className="stat"><div className="n">2009</div><div className="l">{t("s2")}</div></div>
          <div className="stat"><div className="n">~40</div><div className="l">{t("s3")}</div></div>
        </div>
      </section>

      <section className="ctaband">
        <div className="eyebrow">{t("ctaEb")}</div>
        <h2 className="reveal">{t("ctaH")}</h2>
        <a className="cta reveal" href={viewing} target="_blank" rel="noopener noreferrer">{t("ctaBtn")}</a>
      </section>
      <Footer />
    </>
  );
}
