export type Line = "atelier" | "signature";
export type Category =
  | "billiards"
  | "convertible"
  | "pingpong"
  | "foosball"
  | "shuffleboard";

export interface Product {
  slug: string;
  name: string;
  line: Line;
  category: Category;
  /** product image (atelier = black-bg render; signature = transparent cut-out) */
  img: string;
  /** optional hero video */
  video?: string;
  /** gallery images (PDP) */
  gallery?: string[];
  priceUSD: number;
  priceEUR: number;
  flagship?: boolean;
  /** glb model for the 3D configurator, if available */
  model?: string;
}

// ATELIER — Bretda black-background product renders (real galleries + GLB + video)
const g3 = (s: string) => [`/img/${s}-1.jpg`, `/img/${s}-2.jpg`, `/img/${s}-3.jpg`];
export const atelier: Product[] = [
  { slug: "aurora", name: "Aurora", line: "atelier", category: "billiards", img: "/img/aurora-1.jpg", gallery: g3("aurora"), video: "/video/aurora.mp4", model: "/models/aurora.glb", priceUSD: 23800, priceEUR: 22200, flagship: true },
  { slug: "espinela", name: "Espinela", line: "atelier", category: "billiards", img: "/img/espinela-1.jpg", gallery: g3("espinela"), video: "/video/espinela.mp4", model: "/models/espinela.glb", priceUSD: 18500, priceEUR: 17300 },
  { slug: "zurita", name: "Zurita", line: "atelier", category: "billiards", img: "/img/zurita-1.jpg", gallery: g3("zurita"), video: "/video/zurita.mp4", model: "/models/zurita.glb", priceUSD: 14500, priceEUR: 13500 },
  { slug: "opal", name: "Opal", line: "atelier", category: "billiards", img: "/img/opal-1.jpg", gallery: g3("opal"), video: "/video/opal.mp4", model: "/models/opal.glb", priceUSD: 12900, priceEUR: 12050 },
  { slug: "citrino", name: "Citrino", line: "atelier", category: "billiards", img: "/img/citrino-1.jpg", gallery: g3("citrino"), model: "/models/citrino.glb", priceUSD: 9800, priceEUR: 9150 },
  { slug: "ambar", name: "Âmbar", line: "atelier", category: "billiards", img: "/img/ambar-1.jpg", gallery: g3("ambar"), model: "/models/ambar.glb", priceUSD: 8200, priceEUR: 7650 },
  // Convertible / other games — real GLB, single render
  { slug: "ambar-shuffleboard", name: "Âmbar Shuffleboard", line: "atelier", category: "shuffleboard", img: "/img/ambar-shuffleboard-1.jpg", model: "/models/ambar-shuffleboard.glb", priceUSD: 6900, priceEUR: 6450 },
  { slug: "opal-foosball", name: "Opal Foosball", line: "atelier", category: "foosball", img: "/img/opal-foosball-1.jpg", model: "/models/opal-foosball.glb", priceUSD: 4800, priceEUR: 4500 },
  { slug: "ambar-foosball", name: "Âmbar Foosball", line: "atelier", category: "foosball", img: "/img/ambar-foosball-1.jpg", model: "/models/ambar-foosball.glb", priceUSD: 4600, priceEUR: 4300 },
  { slug: "berilo-foosball", name: "Berilo Foosball", line: "atelier", category: "foosball", img: "/img/berilo-foosball-1.jpg", model: "/models/berilo-foosball.glb", priceUSD: 4500, priceEUR: 4200 },
  { slug: "citrino-pingpong", name: "Citrino Ping-Pong", line: "atelier", category: "pingpong", img: "/img/citrino-pingpong-1.jpg", model: "/models/citrino-pingpong.glb", priceUSD: 3800, priceEUR: 3550 },
  { slug: "cobal-pingpong", name: "Cobal Ping-Pong", line: "atelier", category: "pingpong", img: "/img/cobal-pingpong-1.jpg", model: "/models/cobal-pingpong.glb", priceUSD: 3900, priceEUR: 3650 },
];

// SIGNATURE — Tocks line, real product photography (light cards + multi-image galleries)
const tg = (slug: string, ...files: string[]) => files.map((f) => `/tocks/${slug}/${f}`);
export const signature: Product[] = [
  { slug: "modern-inox", name: "Modern Inox", line: "signature", category: "billiards", img: "/tocks/modern-inox.png", priceUSD: 17800, priceEUR: 16600 },
  { slug: "master", name: "Master", line: "signature", category: "convertible", img: "/tocks/master/hero.jpg", gallery: tg("master", "hero.jpg", "gallery-01.jpg"), priceUSD: 16500, priceEUR: 15400 },
  { slug: "modern-premium", name: "Modern Premium", line: "signature", category: "billiards", img: "/tocks/modern-premium.jpg", priceUSD: 16200, priceEUR: 15100 },
  { slug: "monaco", name: "Mônaco", line: "signature", category: "convertible", img: "/tocks/monaco/hero.png", gallery: tg("monaco", "hero.png", "gallery-01.jpg", "gallery-02.jpg", "gallery-03.jpg", "gallery-04.png"), priceUSD: 15800, priceEUR: 14700 },
  { slug: "harley", name: "Harley", line: "signature", category: "billiards", img: "/tocks/harley/hero.png", gallery: tg("harley", "hero.png", "gallery-01.jpg", "gallery-02.jpg", "gallery-03.jpg"), priceUSD: 15400, priceEUR: 14400 },
  { slug: "aparato", name: "Aparato", line: "signature", category: "billiards", img: "/tocks/aparato/hero.jpg", gallery: tg("aparato", "hero.jpg", "lifestyle.jpg", "detail-base.jpg"), priceUSD: 14900, priceEUR: 13900 },
  { slug: "dubai", name: "Dubai", line: "signature", category: "convertible", img: "/tocks/dubai.jpg", priceUSD: 14200, priceEUR: 13250 },
  { slug: "tenro", name: "Tenro", line: "signature", category: "billiards", img: "/tocks/tenro/hero.jpg", gallery: tg("tenro", "hero.jpg", "gallery-01.jpg", "gallery-02.jpg"), priceUSD: 13600, priceEUR: 12700 },
  { slug: "curve", name: "Curve", line: "signature", category: "billiards", img: "/tocks/curve.jpg", priceUSD: 13200, priceEUR: 12300 },
  { slug: "design", name: "Design", line: "signature", category: "billiards", img: "/tocks/design.jpg", priceUSD: 12800, priceEUR: 11950 },
  { slug: "rustic", name: "Rustic", line: "signature", category: "billiards", img: "/tocks/rustic/hero.jpg", gallery: tg("rustic", "hero.jpg", "gallery-01.jpg", "gallery-02.jpg"), priceUSD: 12400, priceEUR: 11600 },
  { slug: "berlin", name: "Berlin", line: "signature", category: "billiards", img: "/tocks/berlin.jpg", priceUSD: 11900, priceEUR: 11100 },
  { slug: "vertice", name: "Vértice", line: "signature", category: "billiards", img: "/tocks/vertice/hero.jpg", gallery: tg("vertice", "hero.jpg", "gallery-01.jpg", "gallery-02.jpg", "gallery-03.jpg", "gallery-04.jpg", "lifestyle.jpg"), priceUSD: 11500, priceEUR: 10750 },
  { slug: "contemporanea", name: "Contemporânea", line: "signature", category: "billiards", img: "/tocks/contemporanea.jpg", priceUSD: 11200, priceEUR: 10450 },
  { slug: "elipse", name: "Elipse", line: "signature", category: "billiards", img: "/tocks/elipse/hero.jpg", gallery: tg("elipse", "hero.jpg", "gallery-01.jpg", "gallery-02.jpg", "gallery-03.jpg", "gallery-04.jpg", "lifestyle.jpg"), priceUSD: 10900, priceEUR: 10200 },
  { slug: "nobus", name: "Nobus", line: "signature", category: "billiards", img: "/tocks/nobus/hero.png", gallery: tg("nobus", "hero.png", "gallery-01.jpg", "gallery-02.jpg", "gallery-03.jpg"), priceUSD: 10600, priceEUR: 9900 },
  { slug: "elemento", name: "Elemento", line: "signature", category: "billiards", img: "/tocks/elemento/hero.jpg", gallery: tg("elemento", "hero.jpg", "gallery-01.jpg"), priceUSD: 9900, priceEUR: 9250 },
  { slug: "gabe", name: "Gabe", line: "signature", category: "billiards", img: "/tocks/gabe/hero.jpg", gallery: tg("gabe", "hero.jpg", "gallery-02.png", "gallery-04.jpg", "lifestyle.jpg"), priceUSD: 9400, priceEUR: 8800 },
];

export const catalog: Product[] = [...atelier, ...signature];
export const flagship = atelier.find((p) => p.flagship)!;

export function getProduct(slug: string): Product | undefined {
  return catalog.find((p) => p.slug === slug);
}

// Real wood finishes (frame) — from the atelier's material library
export const woods = [
  { slug: "angelim", name: "Angelim", hex: "#b98a5a" },
  { slug: "canelao", name: "Canelão", hex: "#6e4a2f" },
  { slug: "carvalho", name: "Carvalho", hex: "#d9c6a5" },
  { slug: "cerejeira", name: "Cerejeira", hex: "#8a4f33" },
  { slug: "ebano", name: "Ébano", hex: "#2c241f" },
  { slug: "freijo", name: "Freijó", hex: "#8c6a45" },
  { slug: "goiabao", name: "Goiabão", hex: "#5a3a28" },
  { slug: "itauba", name: "Itaúba", hex: "#7a5638" },
  { slug: "marupa", name: "Marupá", hex: "#c9b48a" },
  { slug: "wengue", name: "Wengué", hex: "#3a2c24" },
];

// Real felt cloths
export const fabrics = [
  { slug: "fabric-1", name: "Bordeaux" },
  { slug: "fabric-2", name: "Forest" },
  { slug: "fabric-3", name: "Charcoal" },
  { slug: "fabric-4", name: "Camel" },
  { slug: "fabric-5", name: "Slate" },
  { slug: "fabric-6", name: "Navy" },
  { slug: "fabric-7", name: "Olive" },
  { slug: "fabric-8", name: "Sand" },
  { slug: "fabric-9", name: "Wine" },
  { slug: "fabric-10", name: "Stone" },
  { slug: "fabric-11", name: "Moss" },
  { slug: "fabric-12", name: "Ivory" },
];

// Real metallic finishes (base / structure) — steel + metallic paint
export const metals = [
  { slug: "paint-dourado", name: "Gold", hex: "#c9a961" },
  { slug: "paint-dourado-light", name: "Light Gold", hex: "#ddc488" },
  { slug: "paint-cobre", name: "Copper", hex: "#b06a44" },
  { slug: "paint-prata", name: "Silver", hex: "#c0c4c8" },
  { slug: "paint-prata-light", name: "Light Silver", hex: "#d8dadd" },
  { slug: "paint-grafite", name: "Graphite", hex: "#3a3c3e" },
  { slug: "paint-marrom", name: "Brown", hex: "#5a3f2c" },
  { slug: "paint-terracota", name: "Terracotta", hex: "#9c5a3c" },
  { slug: "inox-polido", name: "Polished Steel", hex: "#d4d8dc" },
  { slug: "inox-escovado", name: "Brushed Steel", hex: "#b8bcc0" },
  { slug: "inox-preto", name: "Black Steel", hex: "#2a2c2e" },
  { slug: "inox-off-white", name: "Off-White Steel", hex: "#e8e6e0" },
];

// Which material categories a model offers (billiards tables have a metal base)
export function finishesFor(category: Category): ("wood" | "metal" | "fabric")[] {
  return category === "billiards" ? ["wood", "metal", "fabric"] : ["wood", "fabric"];
}

export const configurable = catalog.filter((p) => p.model);

export function formatPrice(
  usd: number,
  eur: number,
  currency: "usd" | "eur",
  locale: string
): string {
  if (currency === "usd") return "$" + usd.toLocaleString("en-US");
  const loc = locale === "de" ? "de-DE" : locale === "fr" ? "fr-FR" : "es-ES";
  return eur.toLocaleString(loc) + " €";
}
