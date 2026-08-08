// Legacy 3D model library used by the Tocks configurator.
// Paths are absolute-from-public (served by Next.js /public).
// Ported 1:1 from prototype-tawny-omega.vercel.app/arquiteto.html

export type TableCategory = "sinuca" | "pebolim" | "tenis" | "shuffleboard";

export interface TableModel {
  readonly key: string;
  readonly label: string;
  readonly glb: string;
  readonly category: TableCategory;
}

export const TABLE_MODELS: Readonly<Record<string, TableModel>> = {
  opal:             { key: "opal",             label: "Opal",          glb: "/models/mesa-bretda-sinuca-opal.glb",          category: "sinuca" },
  aurora:           { key: "aurora",           label: "Aurora",        glb: "/models/mesa-bretda-sinuca-aurora.glb",        category: "sinuca" },
  zurita:           { key: "zurita",           label: "Zurita",        glb: "/models/mesa-bretda-sinuca-zurita.glb",        category: "sinuca" },
  citrino:          { key: "citrino",          label: "Citrino",       glb: "/models/mesa-bretda-sinuca-citrino.glb",       category: "sinuca" },
  "pimbolim-ambar": { key: "pimbolim-ambar",   label: "Pebolim Ambar", glb: "/models/mesa-bretda-pimbolim-ambar.glb",       category: "pebolim" },
  "pimbolim-berilo":{ key: "pimbolim-berilo",  label: "Pebolim Berilo",glb: "/models/mesa-bretda-pimbolim-berilo.glb",      category: "pebolim" },
  "pimbolim-opal":  { key: "pimbolim-opal",    label: "Pebolim Opal",  glb: "/models/mesa-bretda-pimbolim-opal.glb",        category: "pebolim" },
  "tenis-citrino":  { key: "tenis-citrino",    label: "Tenis Citrino", glb: "/models/mesa-bretda-tenis-de-mesa-citrino.glb",category: "tenis" },
  "tenis-cobal":    { key: "tenis-cobal",      label: "Tenis Cobal",   glb: "/models/mesa-bretda-tenis-de-mesa-cobal.glb",  category: "tenis" },
  shuffleboard:     { key: "shuffleboard",     label: "Shuffleboard",  glb: "/models/mesa-bretda-shufflebooard.glb",        category: "shuffleboard" },
} as const;

export const CATEGORIES: ReadonlyArray<{ id: TableCategory; label: string; short: string }> = [
  { id: "sinuca",       label: "Sinuca",       short: "Sinuca" },
  { id: "pebolim",      label: "Pebolim",      short: "Pebolim" },
  { id: "tenis",        label: "Tenis",        short: "Tenis" },
  { id: "shuffleboard", label: "Shuffle",      short: "Shuffle" },
];

export function getTablesByCategory(cat: TableCategory): TableModel[] {
  return Object.values(TABLE_MODELS).filter((t) => t.category === cat);
}

// ------------ Finish swatches (textures live under /img/acabamentos/*) ------------
// Round 4.5 fix: paths now match real on-disk kebab-case ASCII filenames
// (Round 3 optimization renamed Portuguese-accent files to plain ASCII;
//  prior URL-encoded paths like Cabre%C3%BAva.jpg returned 404 silently,
//  leaving WOOD + METAL swatches as empty bordered circles).
// fallbackColor values preserve the approved material library.

export interface Swatch {
  readonly name: string;
  readonly texture: string;
  readonly fallbackColor: number; // hex int
}

export const FABRICS: ReadonlyArray<Swatch> = [
  { name: "Off White",       texture: "/img/acabamentos/tecidos/102.png",     fallbackColor: 0xF0EDE8 },
  { name: "Creme",           texture: "/img/acabamentos/tecidos/103-91.png",  fallbackColor: 0xEDE5D5 },
  { name: "Purpura",         texture: "/img/acabamentos/tecidos/143-1.png",   fallbackColor: 0x8B1A6C },
  { name: "Vermelho",        texture: "/img/acabamentos/tecidos/145-9.png",   fallbackColor: 0xC94040 },
  { name: "Laranja",         texture: "/img/acabamentos/tecidos/154-9.png",   fallbackColor: 0xD4834A },
  { name: "Marrom",          texture: "/img/acabamentos/tecidos/191-801.png", fallbackColor: 0x6B4D3A },
  { name: "Azul Petroleo",   texture: "/img/acabamentos/tecidos/212-23.png",  fallbackColor: 0x1E5F7A },
  { name: "Verde Esmeralda", texture: "/img/acabamentos/tecidos/247-24.png",  fallbackColor: 0x007B4F },
  { name: "Cinza Claro",     texture: "/img/acabamentos/tecidos/269-9.png",   fallbackColor: 0xBDB9B0 },
  { name: "Camel",           texture: "/img/acabamentos/tecidos/269-21.png",  fallbackColor: 0xC49A3C },
  { name: "Terracota",       texture: "/img/acabamentos/tecidos/275-9.png",   fallbackColor: 0xC75A3A },
  { name: "Cinza Rosado",    texture: "/img/acabamentos/tecidos/284.png",     fallbackColor: 0x9E9590 },
  { name: "Cinza Chumbo",    texture: "/img/acabamentos/tecidos/300-1.png",   fallbackColor: 0x7A7A7A },
];

export const WOODS: ReadonlyArray<Swatch> = [
  { name: "Cabreuva",         texture: "/img/acabamentos/madeiras-lamina/cabreuva.jpg",        fallbackColor: 0x7A4F2A },
  { name: "Carvalho Europeu", texture: "/img/acabamentos/madeiras-lamina/carvalho-europeu.jpg", fallbackColor: 0xC9A879 },
  { name: "Cinamomo",         texture: "/img/acabamentos/madeiras-lamina/cinamomo.jpg",         fallbackColor: 0xB8985A },
  { name: "Freijo",           texture: "/img/acabamentos/madeiras-lamina/freijo.jpg",           fallbackColor: 0xA36B3D },
  { name: "Nogueira",         texture: "/img/acabamentos/madeiras-lamina/nogueira.jpg",         fallbackColor: 0x5C3A22 },
  { name: "Pau de Ferro",     texture: "/img/acabamentos/madeiras-lamina/pau-de-ferro.jpg",     fallbackColor: 0x3A1F0E },
  { name: "Rovere",           texture: "/img/acabamentos/madeiras-lamina/rovere.jpg",           fallbackColor: 0xB8A37A },
  { name: "Teca",             texture: "/img/acabamentos/madeiras-lamina/teca.jpg",             fallbackColor: 0x9C6B3A },
  { name: "Ebano-Linheiro",   texture: "/img/acabamentos/madeiras-lamina/ebano-linheiro.jpg",   fallbackColor: 0x1A1410 },
  { name: "Guarapeira",       texture: "/img/acabamentos/madeiras-nobres/guarapeira.jpg",       fallbackColor: 0x8A5A2A },
  { name: "Ipe Champagne",    texture: "/img/acabamentos/madeiras-nobres/ipe-champagne.jpg",    fallbackColor: 0xA36B3D },
  { name: "Marupa",           texture: "/img/acabamentos/madeiras-nobres/marupa.jpg",           fallbackColor: 0xD4B98A },
  { name: "Pau de Ferro Nobre", texture: "/img/acabamentos/madeiras-nobres/pau-de-ferro.jpg",   fallbackColor: 0x3A1F0E },
];

export const METALS: ReadonlyArray<Swatch> = [
  // Pinturas Metalizadas
  { name: "Grafite",         texture: "/img/acabamentos/pintura-metalizada/grafite.jpg",       fallbackColor: 0x3A3838 },
  { name: "Prata Light",     texture: "/img/acabamentos/pintura-metalizada/prata-light.jpg",   fallbackColor: 0xD2D2D6 },
  { name: "Prata",           texture: "/img/acabamentos/pintura-metalizada/prata.jpg",         fallbackColor: 0xB5B5BA },
  { name: "Terracota",       texture: "/img/acabamentos/pintura-metalizada/terracota.jpg",     fallbackColor: 0xA05838 },
  { name: "Cobre",           texture: "/img/acabamentos/pintura-metalizada/cobre.jpg",         fallbackColor: 0xA86842 },
  { name: "Dourado Light",   texture: "/img/acabamentos/pintura-metalizada/dourado-light.jpg", fallbackColor: 0xC9A979 },
  { name: "Dourado",         texture: "/img/acabamentos/pintura-metalizada/dourado.jpg",       fallbackColor: 0xA88A5C },
  { name: "Marrom",          texture: "/img/acabamentos/pintura-metalizada/marrom.jpg",        fallbackColor: 0x5C3A22 },
  // Microtextura
  { name: "Microtex Off White", texture: "/img/acabamentos/pintura-microtextura/off-white.jpg", fallbackColor: 0xF0E8D8 },
  { name: "Microtex Preto",  texture: "/img/acabamentos/pintura-microtextura/preto.jpg",        fallbackColor: 0x0A0A0A },
  // Aco Inox
  { name: "Inox Escovado",   texture: "/img/acabamentos/aco-inox/escovado.jpg",                 fallbackColor: 0xC9A979 },
  { name: "Inox Polido",     texture: "/img/acabamentos/aco-inox/polido.jpg",                   fallbackColor: 0xD9D9DA },
  { name: "Inox Preto",      texture: "/img/acabamentos/aco-inox/preto.jpg",                    fallbackColor: 0x1A1A18 },
];
