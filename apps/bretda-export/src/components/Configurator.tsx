"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Header from "./Header";
import Footer from "./Footer";
import {
  TABLE_MODELS,
  FABRICS,
  WOODS,
  METALS,
  type TableCategory,
} from "@/lib/configurador/tables";
import { catalog, formatPrice } from "@/data/catalog";
import { useCurrency } from "@/lib/currency";
import { waUrl } from "@/lib/inquiry";

/* eslint-disable @typescript-eslint/no-explicit-any */

// bretda-export catalog slug -> engine model key
const SLUG_TO_KEY: Record<string, string> = {
  aurora: "aurora", espinela: "espinela", opal: "opal", citrino: "citrino", ambar: "ambar", zurita: "zurita",
  "ambar-foosball": "pimbolim-ambar", "opal-foosball": "pimbolim-opal", "berilo-foosball": "pimbolim-berilo",
  "citrino-pingpong": "tenis-citrino", "cobal-pingpong": "tenis-cobal", "ambar-shuffleboard": "shuffleboard",
};
// engine model key -> bretda-export catalog slug (for thumbnail + price)
const KEY_TO_SLUG: Record<string, string> = {
  opal: "opal", aurora: "aurora", zurita: "zurita", espinela: "espinela", citrino: "citrino", ambar: "ambar",
  "pimbolim-ambar": "ambar-foosball", "pimbolim-opal": "opal-foosball", "pimbolim-berilo": "berilo-foosball",
  "tenis-citrino": "citrino-pingpong", "tenis-cobal": "cobal-pingpong", shuffleboard: "ambar-shuffleboard",
};
const catFor = (key: string) => catalog.find((p) => p.slug === KEY_TO_SLUG[key]);

export default function Configurator({ initialSlug }: { initialSlug?: string }) {
  const t = useTranslations("cfg");
  const tw = useTranslations("wa");
  const locale = useLocale();
  const { cur } = useCurrency();

  const initialKey = (initialSlug && SLUG_TO_KEY[initialSlug]) || "aurora";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<any>(null);

  const [activeKey, setActiveKey] = useState(initialKey);
  const [activeLabel, setActiveLabel] = useState(TABLE_MODELS[initialKey]?.label ?? "Aurora");
  const [activeCategory, setActiveCategory] = useState<TableCategory>(TABLE_MODELS[initialKey]?.category ?? "sinuca");
  const [epoch, setEpoch] = useState(0);
  const [loading, setLoading] = useState<{ on: boolean; text: string }>({ on: true, text: "" });
  const [wood, setWood] = useState(WOODS[1].name);
  const [metal, setMetal] = useState<string | null>(null);
  const [fab, setFab] = useState(FABRICS[7].name);

  // scene lifecycle — epoch-driven remount (mirrors the original engine usage)
  useEffect(() => {
    let disposed = false;
    let scene: any = null;
    const desired = activeKey;
    let pending: string | null = desired !== "opal" ? desired : null;
    let opalSwapped = false;

    import("@/lib/configurador/scene").then(({ ConfiguradorScene }) => {
      if (disposed || !canvasRef.current) return;
      scene = new ConfiguradorScene(canvasRef.current, {
        onLoadingChange: (on: boolean, text?: string) => setLoading({ on, text: text ?? "" }),
        onToast: () => {},
        onModelChange: (label: string, cat: TableCategory) => {
          setActiveLabel(label);
          setActiveCategory(cat);
          if (!opalSwapped && pending && cat === "sinuca" && label === "Opal") {
            opalSwapped = true;
            const target = pending;
            pending = null;
            scene.buildTable(target);
          }
        },
        onMaterialSelected: () => {},
      });
      sceneRef.current = scene;
    });

    return () => {
      disposed = true;
      scene?.dispose?.();
      sceneRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epoch]);

  const selectModel = useCallback((key: string) => {
    setActiveKey(key);
    setEpoch((e) => e + 1);
  }, []);

  const onWood = (s: (typeof WOODS)[number]) => { setWood(s.name); sceneRef.current?.applyWood(s.texture, s.fallbackColor, s.name); };
  const onMetal = (s: (typeof METALS)[number]) => { setMetal(s.name); sceneRef.current?.applyMetal(s.texture, s.name); };
  const onFab = (s: (typeof FABRICS)[number]) => { setFab(s.name); sceneRef.current?.applyFabric(s.texture, s.fallbackColor, s.name); };

  const prod = catFor(activeKey);
  const price = prod ? formatPrice(prod.priceUSD, prod.priceEUR, cur, locale) : null;
  const fromStyle = { fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase" as const, color: "var(--muted)", marginRight: 8 };

  return (
    <>
      <Header />
      <div className="wrap">
        {/* model selector */}
        <div className="cfg-models">
          {Object.values(TABLE_MODELS).map((m) => {
            const c = catalog.find((p) => p.slug === KEY_TO_SLUG[m.key]);
            return (
              <button key={m.key} className={`cfg-model${m.key === activeKey ? " active" : ""}`} onClick={() => selectModel(m.key)}>
                <span className="thumb">{c ? <Image src={c.img} alt={m.label} width={118} height={82} /> : null}</span>
                <span className="nm">{m.label}</span>
              </button>
            );
          })}
        </div>

        <div className="config">
          <div className="stage">
            <canvas ref={canvasRef} key={`cv-${epoch}`} className="cfg-canvas" data-3d-interact="canvas" />
            {loading.on && (
              <div className="cfg-loading"><span className="spin" /><span className="lt">{loading.text || t("hint")}</span></div>
            )}
            <div className="bar">
              <span className="hint">{t("hint")}</span>
              <div className="cfg-tools">
                <button className="arbtn" onClick={() => sceneRef.current?.resetCamera()}>Reset</button>
                <button className="arbtn" onClick={() => sceneRef.current?.toggleGrid()}>Grid</button>
                <button className="arbtn" onClick={() => sceneRef.current?.exportScreenshot(`bretda-${activeKey}.png`)}>Photo</button>
              </div>
            </div>
          </div>

          <div className="cfg-ctrl">
            <div className="eyebrow">{t("eyebrow")}</div>
            <h1>{activeLabel}</h1>
            <div className="sub">{t("sub")}</div>

            <div className="step">
              <div className="top"><div className="slbl"><span className="n">01</span>{t("frame")}</div><div className="sel">{wood}</div></div>
              <div className="swatches">
                {WOODS.map((s) => (
                  <button type="button" key={s.name} aria-label={s.name} aria-pressed={wood === s.name} className={`sw${wood === s.name ? " active" : ""}`} onClick={() => onWood(s)}>
                    <img src={s.texture} alt="" />
                  </button>
                ))}
              </div>
            </div>

            <div className="step">
              <div className="top"><div className="slbl"><span className="n">02</span>{t("metal")}</div><div className="sel">{metal ?? "—"}</div></div>
              <div className="swatches">
                {METALS.map((s) => (
                  <button type="button" key={s.name} aria-label={s.name} aria-pressed={metal === s.name} className={`sw${metal === s.name ? " active" : ""}`} onClick={() => onMetal(s)}>
                    <img src={s.texture} alt="" />
                  </button>
                ))}
              </div>
            </div>

            {activeCategory === "sinuca" && (
              <div className="step">
                <div className="top"><div className="slbl"><span className="n">03</span>{t("cloth")}</div><div className="sel">{fab}</div></div>
                <div className="swatches">
                  {FABRICS.map((s) => (
                    <button type="button" key={s.name} aria-label={s.name} aria-pressed={fab === s.name} className={`sw${fab === s.name ? " active" : ""}`} onClick={() => onFab(s)}>
                      <img src={s.texture} alt="" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="summary">
              {price && <div className="price2"><span style={fromStyle}>{t("from")}</span>{price}</div>}
              <div className="ddp">{t("ddp")}</div>
              <a className="cta" style={{ width: "100%", textAlign: "center" }} href={waUrl(tw("config", { name: activeLabel, wood, metal: metal ?? "—", cloth: activeCategory === "sinuca" ? fab : "—", price: price ?? "—" }))} target="_blank" rel="noopener noreferrer">{t("reserve")}</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
