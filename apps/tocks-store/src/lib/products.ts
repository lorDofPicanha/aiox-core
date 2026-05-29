// Catálogo canônico Tocks Custom — 16 modelos vivos, preços e linhas reais
// (cross-validados com tockscustom.com.br + MANIFEST do master library).
// Fotos reais em /public/produtos/{slug}. Modelos sem foto usam placeholder de marca.

export type Linha = "Original" | "Premium" | "Pebolim";
export type Categoria = "Bilhar" | "Sinuca" | "Sinuca e Jantar" | "Pebolim";

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  linha: Linha;
  categoria: Categoria;
  price: number;
  tagline: string;
  description: string;
  highlights: string[];
  images: string[];
  featured?: boolean;
};

const base = "/produtos";

export const products: Product[] = [
  // ───────────────────────── Linha Original ─────────────────────────
  {
    slug: "ark",
    name: "Mesa de Bilhar Ark",
    shortName: "Ark",
    linha: "Original",
    categoria: "Bilhar",
    price: 13990,
    tagline: "Geometria limpa, presença absoluta.",
    description:
      "A Ark abre a Linha Original com um desenho arquitetônico: arcos contínuos em madeira maciça que sustentam o tampo como uma ponte. Uma peça que organiza o ambiente ao redor dela.",
    highlights: ["Madeira maciça selecionada", "Tampo profissional homologado", "Acabamento sob encomenda"],
    images: [],
  },
  {
    slug: "vertice",
    name: "Mesa de Bilhar Vértice",
    shortName: "Vértice",
    linha: "Original",
    categoria: "Bilhar",
    price: 15900,
    tagline: "O recorte arqueado que virou assinatura.",
    description:
      "Base em madeira maciça com recorte arqueado e bordas cromadas. A Vértice equilibra rigor industrial e calor artesanal — a peça que melhor traduz a transição da Skara para a Tocks Custom.",
    highlights: ["Base em madeira maciça", "Recorte arqueado característico", "Bordas cromadas", "10 madeiras · 16 tecidos"],
    images: [`${base}/vertice/hero.jpg`, `${base}/vertice/gallery-02.jpg`, `${base}/vertice/gallery-03.jpg`, `${base}/vertice/gallery-04.jpg`, `${base}/vertice/gallery-05.jpg`],
    featured: true,
  },
  {
    slug: "curve",
    name: "Mesa de Bilhar Curve",
    shortName: "Curve",
    linha: "Original",
    categoria: "Bilhar",
    price: 17900,
    tagline: "A linha que se curva e nunca quebra.",
    description:
      "Curvas contínuas percorrem toda a estrutura da Curve, suavizando o volume de uma mesa profissional. Movimento e solidez no mesmo gesto.",
    highlights: ["Estrutura de linhas curvas", "Madeira maciça", "Acabamento sob encomenda"],
    images: [],
  },
  {
    slug: "elipse",
    name: "Mesa de Bilhar Elipse",
    shortName: "Elipse",
    linha: "Original",
    categoria: "Bilhar",
    price: 19900,
    tagline: "Formato elíptico, detalhes em ouro.",
    description:
      "Formato elíptico, pernas estriadas cilíndricas e detalhes dourados. A Elipse é a expressão mais ornamental da Linha Original — uma escultura que também é mesa de jogo.",
    highlights: ["Silhueta elíptica", "Pernas estriadas cilíndricas", "Detalhes dourados", "10 madeiras · 16 tecidos"],
    images: [`${base}/elipse/hero.jpg`, `${base}/elipse/gallery-02.jpg`, `${base}/elipse/gallery-03.jpg`, `${base}/elipse/gallery-04.jpg`, `${base}/elipse/detail-base.jpg`],
    featured: true,
  },

  // ───────────────────────── Linha Premium ─────────────────────────
  {
    slug: "master-madeira-macica",
    name: "Mesa de Sinuca e Jantar Master Madeira Maciça",
    shortName: "Master",
    linha: "Premium",
    categoria: "Sinuca e Jantar",
    price: 10990,
    tagline: "Jantar para oito, jogo para todos.",
    description:
      "Dois móveis em um: mesa de jantar em madeira maciça que revela um campo de sinuca profissional. A Master entrega versatilidade sem abrir mão da imponência.",
    highlights: ["Conversível jantar ⇄ sinuca", "Tampo de jantar em madeira maciça", "Acabamento sob encomenda"],
    images: [`${base}/master-madeira-macica/hero.jpg`, `${base}/master-madeira-macica/gallery-01.jpg`],
  },
  {
    slug: "tenro-luxo",
    name: "Mesa de Bilhar Tenro Luxo",
    shortName: "Tenro Luxo",
    linha: "Premium",
    categoria: "Bilhar",
    price: 12990,
    tagline: "Suavidade que se sente ao toque.",
    description:
      "A Tenro Luxo trabalha volumes macios e madeiras quentes para criar uma mesa acolhedora, de presença discreta e acabamento impecável.",
    highlights: ["Volumes suaves", "Madeiras quentes", "10 madeiras · 16 tecidos"],
    images: [`${base}/tenro-luxo/hero.jpg`, `${base}/tenro-luxo/gallery-01.jpg`, `${base}/tenro-luxo/gallery-02.jpg`],
  },
  {
    slug: "monaco-premium",
    name: "Mesa de Sinuca e Jantar Mônaco Premium",
    shortName: "Mônaco",
    linha: "Premium",
    categoria: "Sinuca e Jantar",
    price: 12990,
    tagline: "A 2 em 1 que conquistou o Brasil.",
    description:
      "Nossa peça mais celebrada. A Mônaco Premium é mesa de jantar e sinuca profissional na mesma estrutura — desenho atemporal, engenharia precisa e o melhor custo de presença da linha.",
    highlights: ["Conversível jantar ⇄ sinuca", "Best-seller histórico", "Engenharia de conversão precisa", "10 madeiras · 16 tecidos"],
    images: [`${base}/monaco-premium/hero.png`, `${base}/monaco-premium/gallery-01.jpg`, `${base}/monaco-premium/gallery-02.jpg`, `${base}/monaco-premium/gallery-03.jpg`, `${base}/monaco-premium/gallery-04.png`],
    featured: true,
  },
  {
    slug: "elemento-personalizada",
    name: "Mesa de Bilhar Elemento Personalizada",
    shortName: "Elemento",
    linha: "Premium",
    categoria: "Bilhar",
    price: 13990,
    tagline: "Seu projeto, do tampo às pernas.",
    description:
      "A Elemento nasce em branco para receber o seu projeto. Personalização total de madeira, tecido e detalhes — uma mesa única, feita à medida do seu ambiente.",
    highlights: ["Personalização total", "Madeira maciça", "Projeto sob medida"],
    images: [`${base}/elemento-personalizada/hero.jpg`, `${base}/elemento-personalizada/gallery-01.jpg`],
  },
  {
    slug: "gabe",
    name: "Mesa de Bilhar Gabe Madeira Maciça",
    shortName: "Gabe",
    linha: "Premium",
    categoria: "Bilhar",
    price: 14990,
    tagline: "Madeira maciça em estado bruto e nobre.",
    description:
      "A Gabe celebra a madeira maciça: veios à mostra, massa generosa e um acabamento que envelhece com elegância. Robustez de atelier para durar gerações.",
    highlights: ["Madeira maciça integral", "Veios naturais à mostra", "10 madeiras · 16 tecidos"],
    images: [`${base}/gabe/hero.jpg`, `${base}/gabe/gallery-02.png`, `${base}/gabe/lifestyle.jpg`],
    featured: true,
  },
  {
    slug: "nobus-premium",
    name: "Mesa de Sinuca Nobus Premium",
    shortName: "Nobus",
    linha: "Premium",
    categoria: "Sinuca",
    price: 14990,
    tagline: "Contemporânea, nobre, definitiva.",
    description:
      "A Nobus Premium combina linhas contemporâneas com a nobreza dos materiais Tocks. Uma mesa de sinuca pensada para ambientes de design assinado.",
    highlights: ["Desenho contemporâneo", "Materiais nobres", "10 madeiras · 16 tecidos"],
    images: [`${base}/nobus-premium/hero.png`, `${base}/nobus-premium/gallery-01.jpg`, `${base}/nobus-premium/gallery-02.jpg`, `${base}/nobus-premium/gallery-03.jpg`],
  },
  {
    slug: "rustic-madeira-macica",
    name: "Mesa de Sinuca Rustic Madeira Maciça",
    shortName: "Rustic",
    linha: "Premium",
    categoria: "Sinuca",
    price: 14990,
    tagline: "O rústico que virou refinado.",
    description:
      "Madeira maciça com tratamento rústico-refinado: textura, caráter e calor. A Rustic traz a alma do interior brasileiro para o jogo.",
    highlights: ["Tratamento rústico-refinado", "Madeira maciça", "10 madeiras · 16 tecidos"],
    images: [`${base}/rustic-madeira-macica/hero.jpg`, `${base}/rustic-madeira-macica/gallery-01.jpg`, `${base}/rustic-madeira-macica/gallery-02.jpg`],
  },
  {
    slug: "harley-moderna",
    name: "Mesa de Sinuca Harley Moderna",
    shortName: "Harley",
    linha: "Premium",
    categoria: "Sinuca",
    price: 19990,
    tagline: "Atitude moderna, execução impecável.",
    description:
      "Linhas decididas e contrastes marcantes definem a Harley Moderna — para quem quer uma mesa de sinuca com personalidade forte e acabamento de alta joalheria.",
    highlights: ["Design moderno de alto contraste", "Acabamento de precisão", "10 madeiras · 16 tecidos"],
    images: [`${base}/harley-moderna/hero.png`, `${base}/harley-moderna/gallery-01.jpg`, `${base}/harley-moderna/gallery-02.jpg`, `${base}/harley-moderna/gallery-03.jpg`],
  },
  {
    slug: "aparato",
    name: "Mesa de Bilhar Aparato Alto Padrão",
    shortName: "Aparato",
    linha: "Premium",
    categoria: "Bilhar",
    price: 26900,
    tagline: "O topo da Tocks Custom.",
    description:
      "A peça mais alto padrão do atelier. A Aparato reúne os melhores materiais, a engenharia mais refinada e um desenho escultórico — para o ambiente que não admite o segundo melhor.",
    highlights: ["Topo de linha", "Materiais de exceção", "Desenho escultórico", "10 madeiras · 16 tecidos"],
    images: [`${base}/aparato/hero.jpg`, `${base}/aparato/lifestyle.jpg`],
    featured: true,
  },

  // ───────────────────────── Linha Pebolim ─────────────────────────
  {
    slug: "pebolim-nobus",
    name: "Mesa de Pebolim Nobus",
    shortName: "Pebolim Nobus",
    linha: "Pebolim",
    categoria: "Pebolim",
    price: 10990,
    tagline: "O pebolim que combina com sala de estar.",
    description:
      "A elegância da linha Nobus aplicada ao pebolim. Madeira nobre, jogadores de qualidade e um desenho que pertence a um ambiente de design.",
    highlights: ["Madeira nobre", "Acabamento de design", "Sob encomenda"],
    images: [],
  },
  {
    slug: "pebolim-elemento",
    name: "Mesa de Pebolim Elemento",
    shortName: "Pebolim Elemento",
    linha: "Pebolim",
    categoria: "Pebolim",
    price: 10990,
    tagline: "Pebolim em branco para o seu projeto.",
    description:
      "Como a mesa Elemento, o Pebolim Elemento é uma tela em branco para personalização total — cores, madeiras e detalhes à sua escolha.",
    highlights: ["Personalização total", "Projeto sob medida", "Sob encomenda"],
    images: [],
  },
  {
    slug: "pebolim-rustic",
    name: "Mesa de Pebolim Rustic",
    shortName: "Pebolim Rustic",
    linha: "Pebolim",
    categoria: "Pebolim",
    price: 10990,
    tagline: "Calor rústico, diversão sem fim.",
    description:
      "O acabamento rústico-refinado da Tocks no formato pebolim. Robusto, caloroso e pronto para receber a casa cheia.",
    highlights: ["Tratamento rústico-refinado", "Madeira maciça", "Sob encomenda"],
    images: [],
  },
];

export const linhas: Linha[] = ["Original", "Premium", "Pebolim"];

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getByLinha(linha: Linha): Product[] {
  return products.filter((p) => p.linha === linha);
}

export const featuredProducts = products.filter((p) => p.featured);
