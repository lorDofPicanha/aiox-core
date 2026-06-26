// Measurement units by locale.
// English (US market) → inches; everyone else (Europe) → centimetres.

const inch = (cm: number) => Math.round(cm / 2.54);

export function dim2(l: number, w: number, locale: string): string {
  return locale === "en" ? `${inch(l)} × ${inch(w)} in` : `${l} × ${w} cm`;
}

export function dim3(l: number, w: number, h: number, locale: string): string {
  return locale === "en"
    ? `${inch(l)} × ${inch(w)} × ${inch(h)} in`
    : `${l} × ${w} × ${h} cm`;
}

// Weight: kg (Europe) / lb (US). Returns null when no figure is on record.
export function weight(kg: number | undefined, locale: string): string | null {
  if (kg == null) return null;
  return locale === "en" ? `${Math.round(kg * 2.20462)} lb` : `${kg} kg`;
}
