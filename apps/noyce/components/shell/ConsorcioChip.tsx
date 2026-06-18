// Story 30.1 — chip reutilizável que sinaliza, no discovery (Mesa/Monitorar),
// se o edital permite participação em consórcio.
//   permiteConsorcio === true  → verde    "Consórcio: Sim"
//   permiteConsorcio === false → vermelho  "Consórcio: Não"
//   permiteConsorcio == null    → cinza     "Consórcio: N/I"  (edital silente — não bloqueia)
// Estilo via classes em app/globals.css (.consorcio-chip.*), seguindo o padrão dos demais badges.

const CHIP = {
  sim: { cls: "consorcio-sim", label: "Consórcio: Sim", title: "O edital admite participação em consórcio." },
  nao: { cls: "consorcio-nao", label: "Consórcio: Não", title: "O edital veda participação em consórcio." },
  ni: { cls: "consorcio-ni", label: "Consórcio: N/I", title: "Edital não informou sobre consórcio." },
} as const;

export function ConsorcioChip({ value }: { value: boolean | null | undefined }) {
  const variant = value === true ? CHIP.sim : value === false ? CHIP.nao : CHIP.ni;
  return (
    <span className={`consorcio-chip ${variant.cls}`} title={variant.title}>
      {variant.label}
    </span>
  );
}
