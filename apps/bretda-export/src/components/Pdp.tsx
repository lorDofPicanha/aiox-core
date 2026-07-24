"use client";
import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Header from "./Header";
import Footer from "./Footer";
import { woods, fabrics, formatPrice, type Product } from "@/data/catalog";
import { getSpec } from "@/data/specs";
import { dim2, dim3, weight } from "@/lib/units";
import { useCurrency } from "@/lib/currency";
import { waUrl, mailUrl } from "@/lib/inquiry";

const lp = (p: string, l: string) => (l === "en" ? p : `/${l}${p}`);

export default function Pdp({ product }: { product: Product }) {
  const t = useTranslations("pdp");
  const tw = useTranslations("wa");
  const locale = useLocale();
  const { cur } = useCurrency();
  const gallery = product.gallery ?? [product.img];
  const [main, setMain] = useState<{ kind: "img" | "vid"; src: string }>({ kind: "img", src: gallery[0] });
  const sig = product.line === "signature";

  const price = formatPrice(product.priceUSD, product.priceEUR, cur, locale);
  const spec = getSpec(product.slug);

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
              <div className="act"><div className="ak">{t("object")}</div><div className="av">{t(sig ? "objectVsig" : "objectV")}</div></div>
              <div className="act"><div className="ak">{t(sig ? "houseSig" : "house")}</div><div className="av">{t(sig ? "houseVsig" : "houseV")}</div></div>
              <div className="act"><div className="ak">{t("now")}</div><div className="av">{t(sig ? "nowVsig" : "nowV")}</div></div>
            </div>

            <div className="mat">
              <div className="lbl"><span>{t("finishes")}</span></div>
              <div className="finish-display" aria-hidden="true">
                {woods.slice(0, 6).map((w) => (
                  <span key={w.slug} className="swd" title={`${t("frame")} · ${w.name}`}>
                    <img src={`/wood/${w.slug}.png`} alt="" />
                  </span>
                ))}
                {fabrics.slice(0, 6).map((f) => (
                  <span key={f.slug} className="swd" title={`${t("cloth")} · ${f.name}`}>
                    <img src={`/fabric/${f.slug}.png`} alt="" />
                  </span>
                ))}
              </div>
              <p className="finish-note">{t("finishesNote")}</p>
              {product.model && (
                <a className="cta-sec" href={lp(`/configurator/${product.slug}`, locale)} style={{ display: "inline-block", marginTop: 4 }}>{t("open3d")}</a>
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
              <a className="cta-sec" href={mailUrl(t("emailSubj", { name: product.name }), tw("reserve", { name: product.name, price }))}>{t("email")}</a>
            </div>
          </div>
        </div>

        {spec && (
          <section className="pdp-details">
            <div className="pd-desc">
              <div className="k">{t("about")}</div>
              {spec.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="pd-specs">
              <div className="k">{t("specs")}</div>
              <dl>
                <div className="row">
                  <dt>{t("sDim")}</dt>
                  <dd>
                    {spec.sizes ? (
                      <ul className="sizes">
                        {spec.sizes.map((s) => (
                          <li key={s.label}><span>{s.label}</span>{dim2(s.l, s.w, locale)}</li>
                        ))}
                      </ul>
                    ) : spec.dim ? (
                      spec.dim.h != null
                        ? dim3(spec.dim.l, spec.dim.w, spec.dim.h, locale)
                        : dim2(spec.dim.l, spec.dim.w, locale)
                    ) : "—"}
                  </dd>
                </div>
                {spec.base && <div className="row"><dt>{t("sBase")}</dt><dd>{spec.base}</dd></div>}
                {spec.structure && <div className="row"><dt>{t("sStructure")}</dt><dd>{spec.structure}</dd></div>}
                {spec.cloth && <div className="row"><dt>{t("sCloth")}</dt><dd>{spec.cloth}</dd></div>}
                {spec.slate && <div className="row"><dt>{t("sSlate")}</dt><dd>{spec.slate}</dd></div>}
                {spec.legs && <div className="row"><dt>{t("sLegs")}</dt><dd>{spec.legs}</dd></div>}
                {spec.top && <div className="row"><dt>{t("sTop")}</dt><dd>{t("sTopV")}</dd></div>}
                <div className="row"><dt>{t("sWeight")}</dt><dd>{weight(spec.weightKg, locale) ?? t("onRequest")}</dd></div>
                <div className="row"><dt>{t("sLead")}</dt><dd>{t("sLeadV")}</dd></div>
              </dl>
            </div>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}
