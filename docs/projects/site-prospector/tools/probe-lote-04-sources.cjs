const urls = [
  "https://wandacardoso.com/",
  "https://wandacardoso.com/produtos-e-orcamento/",
  "https://paraibacriativa.com.br/artista/atelie-de-ceramica-isa-machado/",
  "https://catalogobandasdemusicape.wordpress.com/paulo-sergio-nunes-luthier/",
  "https://pe.agenciasebrae.com.br/cultura-empreendedora/o-unico-luthier-diplomado-em-pernambuco/",
  "https://linktr.ee/geconfeitariagourmet",
  "https://linktr.ee/cheirodovento",
  "https://linktr.ee/psluthier",
  "https://thechayi.in/",
  "https://thechayi.in/collections/all",
  "https://linktr.ee/the.chayi",
  "https://www.canva.com/design/DAGbdjTOO_8/rLEsjVVuLUbBqUUTE0e74Q/view",
];

async function main() {
  for (const url of urls) {
    try {
      const response = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
      const html = await response.text();
      const images = [...html.matchAll(/(?:src|content)=["']([^"']+\.(?:jpe?g|png|webp)(?:\?[^"']*)?)/gi)]
        .map((match) => match[1].replaceAll("&amp;", "&"));
      process.stdout.write(`\n${response.status} ${url} bytes=${html.length} images=${new Set(images).size}\n`);
      process.stdout.write(`${[...new Set(images)].slice(0, 20).join("\n")}\n`);
      if (url.includes("wandacardoso.com")) {
        const links = [...html.matchAll(/href=["']([^"']+)["']/gi)]
          .map((match) => match[1].replaceAll("&amp;", "&"))
          .filter((value) => /(?:bolo|doces|bem|massa|produto)/i.test(value));
        process.stdout.write(`PRODUCT LINKS\n${[...new Set(links)].join("\n")}\n`);
      }
    } catch (error) {
      process.stdout.write(`ERROR ${url} ${error.message}\n`);
    }
  }
}

main();
