import "server-only";

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

/**
 * Amostras REAIS pré-carregadas (fixtures do próprio parser) — servidas do
 * SERVIDOR. São os XML de teste que validam o motor (`__fixtures__/`), expostos
 * aqui como "amostra para reconhecer" — a prova de que o motor roda sobre nota
 * de verdade (não dado sintético escrito à mão na UI).
 *
 * Resolução robusta do caminho: usa createRequire para localizar o pacote
 * @synkra/contador-parser (esteja ele hoisted no root ou symlinkado no app) e
 * lê os fixtures de `src/__fixtures__/` relativos ao package.json resolvido.
 * Assim não dependemos de cwd nem de copiar XML para dentro do app.
 *
 * G6: amostra sintética; o selo de honestidade vive na UI. A captura automática
 * (Fase B) é o que substitui colar/selecionar amostra por ingestão real.
 */

export interface FixtureAmostra {
  id: string;
  rotulo: string;
  /** Descrição curta do que a amostra demonstra (para o seletor). */
  descricao: string;
  /** Caminho do arquivo de fixture dentro do pacote do parser. */
  arquivo: string;
}

/** Catálogo das amostras (ordem = ordem de exibição no seletor). */
export const FIXTURES: FixtureAmostra[] = [
  {
    id: "nfe-55-monofasico-tributado-normal",
    rotulo: "NF-e 55 — combustível monofásico tributado como normal",
    descricao:
      "Revenda de gasolina (NCM monofásico) lançada com CST PIS/COFINS 01 (regime normal). Caso-alvo: indício de crédito potencialmente recuperável.",
    arquivo: "nfe-55-monofasico-tributado-normal.xml",
  },
  {
    id: "nfe-55-monofasico",
    rotulo: "NF-e 55 — combustível monofásico tributado corretamente",
    descricao:
      "Revenda de gasolina com CST PIS/COFINS 04 (monofásico). Tributação correta — o motor NÃO deve gerar indício.",
    arquivo: "nfe-55-monofasico.xml",
  },
  {
    id: "nfe-55-normal",
    rotulo: "NF-e 55 — venda de mercadoria comum (2 itens)",
    descricao:
      "Parafuso/porca de aço inox (NCM 7318). Mercadoria de regime normal — sem indício esperado.",
    arquivo: "nfe-55-normal.xml",
  },
  {
    id: "nfce-65-simples",
    rotulo: "NFC-e 65 — varejo Simples Nacional (sem assinatura)",
    descricao:
      "Pão francês emitido por ME no Simples (CSOSN). Sem bloco de assinatura — proveniência mais fraca.",
    arquivo: "nfce-65-simples.xml",
  },
];

let baseDir: string | null = null;

/** Resolve o diretório __fixtures__ do pacote do parser uma única vez. */
function resolverBaseDir(): string {
  if (baseDir) return baseDir;
  const requireFromHere = createRequire(import.meta.url);
  // Resolve o package.json do parser (segue o symlink/hoist) e sobe para src/__fixtures__.
  const pkgJson = requireFromHere.resolve("@synkra/contador-parser/package.json");
  const pkgRoot = pkgJson.slice(0, pkgJson.lastIndexOf("package.json"));
  baseDir = `${pkgRoot}src/__fixtures__/`;
  return baseDir;
}

/** Lê o XML de uma amostra (server-side). Lança se o id for desconhecido. */
export function lerFixture(id: string): { rotulo: string; xml: string } {
  const fx = FIXTURES.find((f) => f.id === id);
  if (!fx) {
    throw new Error(`Amostra desconhecida: ${id}`);
  }
  const xml = readFileSync(`${resolverBaseDir()}${fx.arquivo}`, "utf8");
  return { rotulo: fx.rotulo, xml };
}
