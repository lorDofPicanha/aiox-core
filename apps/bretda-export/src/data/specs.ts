// Real Tocks product data — dimensions, structure and editorial description.
// Source of truth: the founder's legacy catalog copy.
// Descriptions translated to English, faithful to the original (no invention).
// NOTE: the source carries NO weight figures — `weightKg` is intentionally
// absent until the atelier provides them; the PDP shows "On request".

export interface Size {
  readonly label: string; // English size name
  readonly l: number; // length, cm
  readonly w: number; // width, cm
}

export interface Spec {
  readonly description: readonly string[];
  readonly sizes?: readonly Size[]; // several sizes (Tocks billiards) or modes (convertible)
  readonly dim?: { readonly l: number; readonly w: number; readonly h?: number }; // single size (cm); h optional
  readonly base?: string;
  readonly structure?: string; // material / structure
  readonly cloth?: string;
  readonly slate?: string; // Tocks: included slate bed
  readonly legs?: string; // Tocks: leg style
  readonly top?: boolean; // optional dining top on request
  readonly weightKg?: number;
}

const SIZES_FULL: readonly Size[] = [
  { label: "Compact", l: 200, w: 110 },
  { label: "Standard", l: 230, w: 130 },
  { label: "House", l: 240, w: 140 },
  { label: "Semi-pro", l: 260, w: 150 },
];
const SIZES_AMBAR: readonly Size[] = SIZES_FULL.slice(0, 3);

const BASE_STEEL = "Stainless steel — polished, brushed, off-white, black or grey";
const STRUCT_PREMIUM = "Premium hardwood — pau-ferro, garapeira, marupá";
const STRUCT_VENEER = "Wood veneer (samples)";
const STRUCT_VENEER_LACQUER = "Wood veneer (samples) or lacquer — off-white, black, grey";
const CLOTH = "By sample";

const TOCKS_CLOTH = "10+ imported cloth options";
const SLATE_25 = "Italian slate, 25 mm (included)";
const SLATE_30 = "Italian slate, 30 mm (included)";

// Keyed by Tocks export catalog slug.
export const SPECS: Readonly<Record<string, Spec>> = {
  aurora: {
    description: [
      "With a metal base shaped like gently inclined butterfly wings and a hardwood top with rounded corners and mother-of-pearl inlays for contrast, the Aurora billiards table radiates modern sophistication while evoking a sense of artistic design.",
      "It is a confluence of style — built to meet the demands of today and appeal to tomorrow's taste, while still echoing the past.",
    ],
    sizes: SIZES_FULL, base: BASE_STEEL, structure: STRUCT_VENEER_LACQUER, cloth: CLOTH, top: true,
  },
  espinela: {
    description: [
      "An asymmetric base creates a free, floating silhouette, making the Espinela billiards table — wrapped in fine hardwood with mother-of-pearl inlays — a striking, contemporary addition to the modern home.",
      "Crafted from durable metal within and clad in hardwood, this hand-built luxury game table carries a distinctive, thought-provoking design: an angular, offset base that seems to defy the laws of gravity and logic.",
    ],
    sizes: SIZES_FULL, structure: STRUCT_VENEER_LACQUER, cloth: CLOTH, top: true,
  },
  zurita: {
    description: [
      "The Zurita billiards table is inspired by the aerodynamic lines of high-end European cars. Designed with sleek, V-shaped lines, it carries an energetic spirit while embodying a luxurious look and a sense of speed.",
      "A perfect catalyst for hours of friendly or competitive play, this handcrafted design comes in your choice of fine hardwoods, custom lacquer finishes, and mother-of-pearl inlays.",
    ],
    sizes: SIZES_FULL, structure: STRUCT_VENEER, cloth: CLOTH, top: true,
  },
  opal: {
    description: [
      "The Opal billiards table — in brushed stainless steel and fine hardwood with mother-of-pearl inlays — is a superior example of contrasting geometric forms, with an angular base that frames an exuberant beauty.",
      "From the side, it offers a perspective reminiscent of Santiago Calatrava's 'Puente de la Mujer' in Buenos Aires, with unexpected dimensional details that command attention. The result is a clean, modern design offering equal parts style, sophistication and superior playability.",
    ],
    sizes: SIZES_FULL, base: BASE_STEEL, structure: STRUCT_VENEER_LACQUER, cloth: CLOTH, top: true,
  },
  citrino: {
    description: [
      "Handcrafted with meticulous detail and a precisely curved base, the Citrino billiards table in acrylic brings together a series of soft, joined edges, with silver-chrome or black-nickel connectors, natural-leather rails and unconventional elements in a singular expression of luxury design.",
      "Built by hand, its hardwood base, acrylic field and mother-of-pearl inlays give this contemporary game table a distinctive blend of specialist craftsmanship and innovative composition.",
    ],
    sizes: SIZES_FULL, structure: STRUCT_VENEER, cloth: CLOTH,
  },
  ["ambar"]: {
    description: [
      "The laser-cut details on the curves of the stainless steel add undeniable elegance to this billiards table of unmistakable style; mother-of-pearl elements on the fine-hardwood rails bring a delicacy to the piece while keeping it perfect for professional play.",
      "The sides are artistically trimmed to create a beautiful contrast with the soft, sculpted legs, supported by fine hardwood in organic detail. With its distinct combination of form and function, this table is a remarkable addition to any space.",
    ],
    sizes: SIZES_AMBAR, base: BASE_STEEL, structure: STRUCT_PREMIUM, cloth: CLOTH, top: true,
  },
  "ambar-shuffleboard": {
    description: [
      "The perfect game for friendly competition among family and friends. From the same family as the Âmbar billiards table, it was created to anchor your game room.",
      "Detailed with a professional surface for endless play, its distinct combination of form and function makes this shuffleboard a remarkable addition to any space.",
    ],
    dim: { l: 274, w: 152, h: 76 }, base: BASE_STEEL, structure: STRUCT_PREMIUM,
  },
  "ambar-foosball": {
    description: [
      "From the same family as the Âmbar billiards table, the laser-cut details on the stainless-steel curves add undeniable elegance to this foosball table of unmistakable style.",
      "Players and handles in chrome, black or off-white bring a delicacy to the piece while keeping it perfect for professional play. The sides are artistically trimmed for a beautiful contrast with the soft, sculpted legs.",
    ],
    dim: { l: 160, w: 80, h: 87 }, base: BASE_STEEL, structure: STRUCT_PREMIUM,
  },
  "opal-foosball": {
    description: [
      "From the same family as the Âmbar, with a base in brushed stainless steel, fine hardwood and hand-crafted players and handles in hardwood — a superior example of contrasting geometric forms.",
      "It features an angular base of exuberant beauty; from the side it recalls Santiago Calatrava's 'Puente de la Mujer' in Buenos Aires. The result is a clean, modern design offering equal parts style, sophistication and superior play.",
    ],
    dim: { l: 160, w: 80, h: 87 }, base: BASE_STEEL, structure: STRUCT_PREMIUM,
  },
  "berilo-foosball": {
    description: [
      "An open base with broad curves and soft edges lends a light, airy feel to the Berilo foosball table in curved fine hardwood.",
      "With players, handles and goals hand-crafted in hardwood — evoking a sense of speed and continuous motion — this distinctive wooden game table features a beautifully detailed acrylic playfield made to encourage endless play.",
    ],
    dim: { l: 160, w: 80, h: 87 }, structure: STRUCT_PREMIUM,
  },
  "citrino-pingpong": {
    description: [
      "From the same family as the Citrino billiards table, the table-tennis edition was created to complete your game room at Olympic size; made from 15 mm acrylic for a crystalline, strong and durable aesthetic.",
      "With a modern aesthetic, it is carefully engineered for high-performance play, featuring silver-chrome or black-nickel connectors and a natural-leather net.",
    ],
    dim: { l: 274, w: 152, h: 76 }, structure: STRUCT_VENEER, cloth: CLOTH,
  },
  "cobal-pingpong": {
    description: [
      "Minimalist design meets versatility in the Cobal table-tennis table. Detailed with a professional surface for endless play, this contemporary table is expertly crafted.",
      "Square block legs give it an austere, geometric look that adds to its timeless appeal, together with a natural-leather net and a choice of lacquer or fine-hardwood finishes.",
    ],
    dim: { l: 274, w: 152, h: 76 }, base: "Hardwood or stainless steel", structure: STRUCT_VENEER, cloth: CLOTH,
  },

  // ---------- SIGNATURE (Tocks) ----------
  // Source: apps/tocks-lp/src/data/products.ts. Descriptions translated to EN.
  // Tocks tables are solid wood, ship with an Italian slate bed and 10+ cloths.
  ...buildTocks(),
};

function buildTocks(): Record<string, Spec> {
  return {
    design: {
      description: [
        "The Design table unites industrial lines with the nobility of solid wood — a carbon-steel frame with electrostatic paint and a top in reforested timber.",
        "Ideal for contemporary spaces that call for personality.",
      ],
      dim: { l: 220, w: 122 }, structure: "Solid wood + carbon steel", cloth: TOCKS_CLOTH, slate: SLATE_25, legs: "4 steel levelling feet", weightKg: 280,
    },
    curve: {
      description: [
        "The Curve is pure functional sculpture. Its organic edges are carved by hand, creating a silhouette that defies convention.",
        "Each curve is unique — the result of weeks of artisanal work.",
      ],
      dim: { l: 253, w: 143 }, structure: "Solid Tauari wood", cloth: TOCKS_CLOTH, slate: SLATE_25, legs: "4 organic turned legs", weightKg: 320,
    },
    vertice: {
      description: [
        "Pure geometry translated into wood. The Vértice brings inclined angles that create an illusion of lightness over a robust structure.",
        "An original design that becomes the centrepiece of any room.",
      ],
      dim: { l: 230, w: 130 }, structure: "Solid Freijó wood", cloth: TOCKS_CLOTH, slate: SLATE_25, legs: "4 angular wood legs", weightKg: 300,
    },
    elipse: {
      description: [
        "The Elipse reinterprets classic elegance with soft curves and a flawless finish.",
        "Every detail conveys refinement — from the turned legs to the leather-trimmed sides.",
      ],
      dim: { l: 253, w: 143 }, structure: "Solid Cerejeira wood", cloth: TOCKS_CLOTH, slate: SLATE_25, legs: "4 classic turned legs", weightKg: 340,
    },
    tenro: {
      description: [
        "The Tenro Luxo is for those who value sophisticated simplicity — straight lines, balanced proportions and a finish that speaks for itself.",
        "A table that complements the room without competing with it.",
      ],
      dim: { l: 220, w: 122 }, structure: "Solid Tauari wood", cloth: TOCKS_CLOTH, slate: SLATE_25, legs: "4 straight legs with levelling glides", weightKg: 270,
    },
    gabe: {
      description: [
        "The Gabe combines a robust structure with refined details. Wide solid-wood legs ensure absolute stability.",
        "The satin finish reveals the natural beauty of the wood grain.",
      ],
      dim: { l: 230, w: 130 }, structure: "Solid Freijó wood", cloth: TOCKS_CLOTH, slate: SLATE_25, legs: "4 wide stabilising legs", weightKg: 310,
    },
    "modern-inox": {
      description: [
        "The Modern Inox unites two noble materials: brushed stainless steel and solid wood.",
        "The contrast between the metal's shine and the wood's texture creates a contemporary piece that stands out anywhere.",
      ],
      dim: { l: 230, w: 130 }, structure: "Solid wood + brushed stainless steel", cloth: TOCKS_CLOTH, slate: SLATE_25, legs: "4 brushed stainless-steel legs", weightKg: 295,
    },
    elemento: {
      description: [
        "The Elemento is Tocks's blank canvas, designed for maximum personalisation: choose the wood, the finish, the cloth, the legs and even the frame colour.",
        "Your table, exactly as you imagined it.",
      ],
      dim: { l: 220, w: 122 }, structure: "Solid wood (client's choice)", cloth: TOCKS_CLOTH, slate: SLATE_25, legs: "Customisable (4 styles)", weightKg: 280,
    },
    aparato: {
      description: [
        "The Aparato is the top of the Tocks line — a monumental solid-wood structure with metal details and a premium finish.",
        "Designed for spaces that demand presence: a piece that defines the entire room.",
      ],
      dim: { l: 253, w: 143 }, structure: "Solid Cerejeira wood + metal", cloth: TOCKS_CLOTH, slate: SLATE_30, legs: "6 reinforced turned legs", weightKg: 380,
    },
    harley: {
      description: [
        "The Harley brings modern attitude to the tradition of billiards — a bold design with sharp corners and a finish that highlights the natural grain.",
        "For those who want a table with personality.",
      ],
      dim: { l: 230, w: 130 }, structure: "Solid Tauari wood", cloth: TOCKS_CLOTH, slate: SLATE_25, legs: "4 straight modern legs", weightKg: 310,
    },
    monaco: {
      description: [
        "The Mônaco solves the space dilemma with elegance: a removable top transforms the billiards table into a dining table for up to eight.",
        "Two functions in a single piece of premium furniture.",
      ],
      sizes: [
        { label: "Billiards", l: 220, w: 122 },
        { label: "Dining", l: 240, w: 140 },
      ],
      structure: "Solid Freijó wood", cloth: TOCKS_CLOTH, slate: SLATE_25, legs: "4 legs with levelling glides", weightKg: 290,
    },
    master: {
      description: [
        "The Master is the entry point to the Tocks Custom universe — a billiards table with a solid-wood dining top.",
        "It unites functionality and artisanal quality at an accessible price.",
      ],
      dim: { l: 220, w: 122 }, structure: "Solid Tauari wood", cloth: TOCKS_CLOTH, slate: SLATE_25, legs: "4 classic turned legs", top: true, weightKg: 260,
    },
    nobus: {
      description: [
        "The Nobus has presence — a wide, solid structure, an impeccable finish and proportions that command the room.",
        "For those seeking a billiards table that is also a statement of style.",
      ],
      dim: { l: 230, w: 130 }, structure: "Solid Freijó wood", cloth: TOCKS_CLOTH, slate: SLATE_25, legs: "4 wide turned legs", weightKg: 320,
    },
    rustic: {
      description: [
        "The Rustic celebrates the imperfection of nature — a finish that preserves the grain, knots and textures of raw wood.",
        "Each table is unique, because each log is unique. For those who value authenticity.",
      ],
      dim: { l: 230, w: 130 }, structure: "Rustic solid wood (natural grain)", cloth: TOCKS_CLOTH, slate: SLATE_25, legs: "4 rustic turned legs", weightKg: 300,
    },
  };
}

export function getSpec(slug: string): Spec | undefined {
  return SPECS[slug];
}
