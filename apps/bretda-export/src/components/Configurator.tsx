"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
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
import { waUrl, mailUrl } from "@/lib/inquiry";
import { trackLead } from "@/lib/track";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Tocks export catalog slug -> engine model key
const SLUG_TO_KEY: Record<string, string> = {
  aurora: "aurora", opal: "opal", citrino: "citrino", zurita: "zurita",
  "ambar-foosball": "pimbolim-ambar", "opal-foosball": "pimbolim-opal", "berilo-foosball": "pimbolim-berilo",
  "citrino-pingpong": "tenis-citrino", "cobal-pingpong": "tenis-cobal", "ambar-shuffleboard": "shuffleboard",
};
// engine model key -> Tocks export catalog slug (for thumbnail + price)
const KEY_TO_SLUG: Record<string, string> = {
  opal: "opal", aurora: "aurora", zurita: "zurita", citrino: "citrino",
  "pimbolim-ambar": "ambar-foosball", "pimbolim-opal": "opal-foosball", "pimbolim-berilo": "berilo-foosball",
  "tenis-citrino": "citrino-pingpong", "tenis-cobal": "cobal-pingpong", shuffleboard: "ambar-shuffleboard",
};
const catFor = (key: string) => catalog.find((p) => p.slug === KEY_TO_SLUG[key]);

export default function Configurator({ initialSlug }: { initialSlug?: string }) {
  const t = useTranslations("cfg");
  const tw = useTranslations("wa");

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
  const [customize, setCustomize] = useState(false);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [selectedCls, setSelectedCls] = useState<string | null>(null);
  // armed finish waiting for the user to tap a part (guided 1-touch flow)
  const [pending, setPending] = useState<null | { cls: "madeira" | "metal" | "tecido"; texture: string; color?: number; label: string }>(null);
  const pendingRef = useRef<typeof pending>(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  }, []);

  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  // Applies the armed finish to a freshly tapped part (kept in a ref so the
  // engine callback always sees the current translations/pending state).
  const applyPendingRef = useRef<(part: string) => void>(() => {});
  useEffect(() => {
    applyPendingRef.current = (part: string) => {
      const p = pendingRef.current;
      if (!part || !p || !sceneRef.current) return;
      if (sceneRef.current.applyToSelected(p.cls, p.texture, p.color)) {
        showToast(t("applied", { name: p.label }));
        setPending(null);
      }
    };
  }, [showToast, t]);

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
        onToast: (msg: string) => showToast(msg),
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
        onMaterialSelected: (name: string | null, cls: string | null) => {
          setSelectedPart(name);
          setSelectedCls(cls);
          if (name) applyPendingRef.current(name);
        },
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
    setCustomize(false);
    setSelectedPart(null);
    setSelectedCls(null);
    setEpoch((e) => e + 1);
  }, []);

  const toggleCustomize = () => {
    const on = sceneRef.current?.toggleCustomizeMode() ?? false;
    setCustomize(on);
    if (!on) { setSelectedPart(null); setSelectedCls(null); }
  };

  const classifyPart = (c: "madeira" | "metal" | "tecido") => {
    sceneRef.current?.classifySelection(c);
    setSelectedCls(c);
  };

  // Guided 1-touch: paint every surface already known to be this class; if the
  // model has none yet, arm the finish and ask the buyer to tap the part once
  // (which classifies it, so subsequent clicks of that class are single-touch).
  const armOrApply = (
    cls: "madeira" | "metal" | "tecido",
    texture: string,
    color: number | undefined,
    label: string,
    setLocal: () => void
  ) => {
    setLocal();
    if (sceneRef.current?.applyToClass(cls, texture, color)) {
      showToast(t("applied", { name: label }));
      setPending(null);
      return;
    }
    setPending({ cls, texture, color, label });
    sceneRef.current?.ensureCustomizeOn();
    setCustomize(true);
    sceneRef.current?.clearSelection();
    setSelectedPart(null);
    setSelectedCls(null);
    showToast(t("armedTap", { name: label }));
  };
  const onWood = (s: (typeof WOODS)[number]) => armOrApply("madeira", s.texture, s.fallbackColor, s.name, () => setWood(s.name));
  const onMetal = (s: (typeof METALS)[number]) => armOrApply("metal", s.texture, s.fallbackColor, s.name, () => setMetal(s.name));
  const onFab = (s: (typeof FABRICS)[number]) => armOrApply("tecido", s.texture, s.fallbackColor, s.name, () => setFab(s.name));

  const prod = catFor(activeKey);
  const price = prod ? formatPrice(prod.priceUSD) : null;
  const fromStyle = { fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase" as const, color: "var(--muted)", marginRight: 8 };

  return (
    <>
      <Header />
      <div className="wrap">
        {/* model selector */}
        <div className="cfg-models">
          {Object.values(TABLE_MODELS).filter((m) => catFor(m.key)).map((m) => {
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
            {toast && <div className="cfg-toast">{toast}</div>}
            {customize && (
              <div className="cfg-customize">
                {pending && !selectedPart ? (
                  <div className="cc-lbl">{t("armedTap", { name: pending.label })}</div>
                ) : selectedPart ? (
                  <>
                    <div className="cc-lbl">{t("ccSelected")}</div>
                    <div className="cc-row">
                      <button type="button" className={selectedCls === "madeira" ? "on" : ""} onClick={() => classifyPart("madeira")}>{t("ccWood")}</button>
                      <button type="button" className={selectedCls === "metal" ? "on" : ""} onClick={() => classifyPart("metal")}>{t("ccMetal")}</button>
                      <button type="button" className={selectedCls === "tecido" ? "on" : ""} onClick={() => classifyPart("tecido")}>{t("ccCloth")}</button>
                    </div>
                    <div className="cc-hint">{t("ccThen")}</div>
                  </>
                ) : (
                  <div className="cc-lbl">{t("ccClick")}</div>
                )}
              </div>
            )}
            <div className="bar">
              <span className="hint">{pending ? t("armedTap", { name: pending.label }) : customize ? (selectedPart ? `${selectedPart} — ${t("pickFinish")}` : t("customizeOn")) : t("hint")}</span>
              <div className="cfg-tools">
                <button className={`arbtn${customize ? " on" : ""}`} onClick={toggleCustomize}>{t("customize")}</button>
                <button className="arbtn" onClick={() => sceneRef.current?.resetCamera()}>Reset</button>
                <button className="arbtn" onClick={() => sceneRef.current?.toggleGrid()}>Grid</button>
                <button className="arbtn" onClick={() => sceneRef.current?.exportScreenshot(`tocks-${activeKey}.png`)}>Photo</button>
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
              <a className="cta" style={{ width: "100%", textAlign: "center" }} href={waUrl(tw("config", { name: activeLabel, wood, metal: metal ?? "—", cloth: activeCategory === "sinuca" ? fab : "—", price: price ?? "—" }))} target="_blank" rel="noopener noreferrer" onClick={() => trackLead({ channel: "whatsapp", source: "configurator", content_name: activeLabel })}>{t("reserve")}</a>
              <a className="cfg-email" href={mailUrl(t("emailSubj", { name: activeLabel }), tw("config", { name: activeLabel, wood, metal: metal ?? "—", cloth: activeCategory === "sinuca" ? fab : "—", price: price ?? "—" }))} onClick={() => trackLead({ channel: "email", source: "configurator", content_name: activeLabel })}>{t("email")}</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
