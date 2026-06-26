"use client";
import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Header from "./Header";
import Footer from "./Footer";
import { woods, fabrics, formatPrice, type Product } from "@/data/catalog";
import { useCurrency } from "@/lib/currency";
import { waUrl } from "@/lib/inquiry";

const lp = (p: string, l: string) => (l === "en" ? p : `/${l}${p}`);

export default function Pdp({ product }: { product: Product }) {
  const t = useTranslations("pdp");
  const tw = useTranslations("wa");
  const locale = useLocale();
  const { cur } = useCurrency();
  const gallery = product.gallery ?? [product.img];
  const [main, setMain] = useState<{ kind: "img" | "vid"; src: string }>({ kind: "img", src: gallery[0] });
  const [wood, setWood] = useState(woods[0].name);
  const [fab, setFab] = useState(fabrics[0].name);

  const price = formatPrice(product.priceUSD, product.priceEUR, cur, locale);

  return (
    <>
      <Header />
      <div className="wrap">
        <div className="breadcrumb"><a href={lp("/collection", locale)}>{t("crumb")}</a> / {product.name}</div>
        <div className="pdp">
          <div className="ghost">{product.name}</div>
          <div className="gallery">
            <div className={`gmain${product.line === "signature" ? " light" : ""}`}>
              {main.kind === "vid" && product.video ? (
                <video src={product.video} autoPlay muted loop playsInline />
              ) : (
                <Image src={main.src} alt={product.name} width={1400} height={1050} priority sizes="(max-width: 900px) 100vw, 55vw" style={{ width: "100%", height: "auto" }} />
              )}
            </div>
            <div className="thumbs">
              {gallery.map((g, gi) => (
                <button type="button" key={g} aria-label={`View ${product.name} photo ${gi + 1}`} className={`thumb${main.kind === "img" && main.src === g ? " active" : ""}`} onClick={() => setMain({ kind: "img", src: g })}>
                  <img src={g} alt="" />
                </button>
              ))}
              {product.video && (
                <button type="button" aria-label={`Play ${product.name} video`} className={`thumb${main.kind === "vid" ? " active" : ""}`} onClick={() => setMain({ kind: "vid", src: product.video! })}>
                  <img src={gallery[0]} alt="" /><span className="play">▶</span>
                </button>
              )}
            </div>
          </div>

          <div className="info">
            <div className="eyebrow">{product.flagship ? t("flag") + " · " : ""}{t("flagship")}</div>
            <h1 className="name2">{product.name}</h1>

            <div className="acts">
              <div className="act"><div className="ak">{t("object")}</div><div className="av">{t("objectV")}</div></div>
              <div className="act"><div className="ak">{t("house")}</div><div className="av">{t("houseV")}</div></div>
              <div className="act"><div className="ak">{t("now")}</div><div className="av">{t("nowV")}</div></div>
            </div>

            <div className="mat">
              <div className="lbl"><span>{t("frame")}</span><b>{wood}</b></div>
              <div className="swatches">
                {woods.slice(0, 6).map((w) => (
                  <button type="button" key={w.slug} aria-label={w.name} aria-pressed={wood === w.name} className={`sw${wood === w.name ? " active" : ""}`} onClick={() => setWood(w.name)}>
                    <img src={`/wood/${w.slug}.png`} alt="" />
                  </button>
                ))}
              </div>
            </div>
            <div className="mat">
              <div className="lbl"><span>{t("cloth")}</span><b>{fab}</b></div>
              <div className="swatches">
                {fabrics.slice(0, 6).map((f) => (
                  <button type="button" key={f.slug} aria-label={f.name} aria-pressed={fab === f.name} className={`sw${fab === f.name ? " active" : ""}`} onClick={() => setFab(f.name)}>
                    <img src={`/fabric/${f.slug}.png`} alt="" />
                  </button>
                ))}
              </div>
              {product.model && (
                <div style={{ marginTop: 14 }}>
                  <a className="cta-sec" href={lp(`/configurator/${product.slug}`, locale)} style={{ display: "inline-block" }}>{t("open3d")}</a>
                </div>
              )}
            </div>

            <div className="price2"><span className="from" style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)", marginRight: 8 }}>{t("from")}</span>{price}</div>
            <div className="ddp">{t("ddp")}</div>

            <div className="trust">
              <div className="t"><svg viewBox="0 0 24 24"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" /></svg><span>{t("t1")}</span></div>
              <div className="t"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg><span>{t("t2")}</span></div>
              <div className="t"><svg viewBox="0 0 24 24"><path d="M4 12h16M4 12l4-4M4 12l4 4" /><path d="M20 6v12" /></svg><span>{t("t3")}</span></div>
              <div className="t"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg><span>{t("t4")}</span></div>
            </div>

            <div className="cta-row2">
              <a className="cta" href={waUrl(tw("reserve", { name: product.name, price }))} target="_blank" rel="noopener noreferrer">{t("reserve")}</a>
              <a className="cta-sec" href={waUrl(tw("talk", { name: product.name }))} target="_blank" rel="noopener noreferrer">{t("talk")}</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
