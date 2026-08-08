"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Header from "./Header";
import Footer from "./Footer";
import { atelier, signature, formatPrice, type Product, type Category } from "@/data/catalog";

const lp = (p: string, l: string) => (l === "en" ? p : `/${l}${p}`);

export default function Collection() {
  const t = useTranslations("col");
  const locale = useLocale();
  const [filter, setFilter] = useState<Category | "all">("all");

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".card").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filter]);

  const catLabel = (c: Category) =>
    t.has(c) ? t(c) : c;
  const price = (p: Product) => formatPrice(p.priceUSD);
  const show = (p: Product) => filter === "all" || p.category === filter;
  // Number within each line (Atelier 01.., Signature 01..) rather than across the whole catalog.
  const anum = (p: Product) => String(atelier.indexOf(p) + 1).padStart(2, "0");
  const snum = (p: Product) => String(signature.indexOf(p) + 1).padStart(2, "0");
  const atelierShown = atelier.filter(show);
  const signatureShown = signature.filter(show);
  const flag = atelier.find((p) => p.flagship)!;

  const chips: (Category | "all")[] = ["all", "billiards", "convertible", "pingpong", "foosball", "shuffleboard"];

  return (
    <>
      <Header />
      <div className="wrap">
        <div className="col-head">
          <div className="eyebrow">{t("eyebrow")}</div>
          <h1>{t("titleA")}<br /><em>{t("titleB")}</em></h1>
          <div className="chips">
            {chips.map((c) => (
              <button key={c} className={`chip${filter === c ? " active" : ""}`} onClick={() => setFilter(c)}>
                {c === "all" ? t("all") : catLabel(c)}
              </button>
            ))}
          </div>
        </div>

        {/* ATELIER */}
        {atelierShown.length > 0 && (
          <>
            <div className="section-label"><span className="t">{t("atelier")}</span><span className="ln" /><span className="c">{t("atelierC")}</span></div>
            {show(flag) && (
              <a className="feature" href={lp(`/mesa/${flag.slug}`, locale)}>
                <div className="gn">01</div>
                <div className="ph"><Image src={flag.img} alt={flag.name} width={1200} height={900} sizes="(max-width: 900px) 100vw, 55vw" /></div>
                <div className="meta">
                  <div className="flag">{t("flagship")}</div>
                  <div className="name">{flag.name}</div>
                  <div className="cat">{catLabel(flag.category)} · Solid hardwood</div>
                  <div className="price"><span className="from">{t("from")}</span>{price(flag)}</div>
                  <div className="more">{t("discover")} {flag.name} →</div>
                </div>
              </a>
            )}
            {atelierShown.filter((p) => !p.flagship).length > 0 && (
              <div className="grid">
                {atelierShown.filter((p) => !p.flagship).map((p) => (
                  <a key={p.slug} className="card" href={lp(`/mesa/${p.slug}`, locale)}>
                    <div className="num">N° {anum(p)}</div>
                    <div className="ph"><Image src={p.img} alt={p.name} width={1200} height={900} sizes="(max-width: 900px) 50vw, 25vw" /></div>
                    <div className="body">
                      <div className="name">{p.name}</div>
                      <div className="cat">{catLabel(p.category)}</div>
                      <div className="price"><span className="from">{t("from")}</span>{price(p)}</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}

        {/* SIGNATURE */}
        {signatureShown.length > 0 && (
          <>
            <div className="section-label"><span className="t">{t("signature")}</span><span className="ln" /><span className="c">{t("signatureC")}</span></div>
            <div className="grid three light-grid">
              {signatureShown.map((p) => (
                <a key={p.slug} className="card light" href={lp(`/mesa/${p.slug}`, locale)}>
                  <div className="num">N° {snum(p)}</div>
                  <div className="ph"><Image src={p.img} alt={p.name} width={1200} height={900} sizes="(max-width: 900px) 50vw, 33vw" /></div>
                  <div className="body">
                    <div className="name">{p.name}</div>
                    <div className="cat">{catLabel(p.category)}</div>
                    <div className="price"><span className="from">{t("from")}</span>{price(p)}</div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}

        <p className="note">{t("note")}</p>
      </div>
      <Footer />
    </>
  );
}
