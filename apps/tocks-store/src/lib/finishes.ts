// Acabamentos oficiais Tocks Custom — catálogo canônico (10 madeiras + 16 tecidos).
// Swatches reais em /public/acabamentos. Cross-validados com as páginas de produto.

export type WoodFinish = { id: string; name: string; swatch: string };
export type FabricFinish = { id: string; code: string; name: string; swatch: string };

export const woods: WoodFinish[] = [
  { id: "carvalho-branco-linheiro", name: "Carvalho Branco Linheiro", swatch: "/acabamentos/madeiras/carvalho-branco-linheiro.png" },
  { id: "ebano-linheiro", name: "Ébano Linheiro", swatch: "/acabamentos/madeiras/ebano-linheiro.png" },
  { id: "freijo", name: "Freijó", swatch: "/acabamentos/madeiras/freijo.png" },
  { id: "goiabao-escuro", name: "Goiabão Escuro", swatch: "/acabamentos/madeiras/goiabao-escuro.png" },
  { id: "itauba", name: "Itaúba", swatch: "/acabamentos/madeiras/itauba.png" },
  { id: "wengue", name: "Wengue", swatch: "/acabamentos/madeiras/wengue.png" },
  { id: "canelao", name: "Canelão", swatch: "/acabamentos/madeiras/canelao.png" },
  { id: "marupa", name: "Marupá", swatch: "/acabamentos/madeiras/marupa.png" },
  { id: "cerejeira", name: "Cerejeira", swatch: "/acabamentos/madeiras/cerejeira.png" },
  { id: "angelin", name: "Angelin", swatch: "/acabamentos/madeiras/angelin.png" },
];

const fabricCodes = [
  "102", "103-91", "143-1", "145-9", "148-91", "154-9", "191-801", "212-23",
  "247-24", "269-9", "269-21", "275-9", "284", "300-1", "309", "310",
];

export const fabrics: FabricFinish[] = fabricCodes.map((code) => ({
  id: code,
  code,
  name: `Tecido ${code}`,
  swatch: `/acabamentos/tecidos/${code}.png`,
}));
