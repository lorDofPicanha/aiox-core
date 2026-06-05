import type { CapabilityByService, CompanyCapabilityProfile } from "./noyce-model";

interface CapabilitySource {
  acervoId: string;
  qtd: number;
  unidade: string;
}

export function buildCapabilityByService(
  ccp: Pick<CompanyCapabilityProfile, "acervo">,
): Record<string, CapabilityByService> {
  const grouped = new Map<string, CapabilitySource[]>();

  for (const acervo of ccp.acervo) {
    for (const item of acervo.itens) {
      const current = grouped.get(item.servicoCanonico) ?? [];
      current.push({
        acervoId: acervo.id,
        qtd: item.qtd,
        unidade: item.unidade,
      });
      grouped.set(item.servicoCanonico, current);
    }
  }

  return Object.fromEntries(
    Array.from(grouped.entries()).map(([servicoCanonico, sources]) => {
      const ordered = [...sources].sort((a, b) => b.qtd - a.qtd);
      const topTwo = ordered.slice(0, 2);

      return [
        servicoCanonico,
        {
          maxSingle: roundQuantity(ordered[0]?.qtd ?? 0),
          somaTop2: roundQuantity(topTwo.reduce((sum, source) => sum + source.qtd, 0)),
          unidade: ordered[0]?.unidade ?? "",
          fontes: ordered.map((source) => source.acervoId),
        },
      ];
    }),
  );
}

export function withComputedCapabilities<T extends CompanyCapabilityProfile>(ccp: T): T {
  return {
    ...ccp,
    derived: {
      ...ccp.derived,
      capabilityByService: buildCapabilityByService(ccp),
    },
  };
}

function roundQuantity(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
