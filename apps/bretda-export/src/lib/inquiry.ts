// Conversion path — the brand transacts via WhatsApp inquiry (no cart/checkout).
export const WHATSAPP = "5547992259554";

export function waUrl(message: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}
