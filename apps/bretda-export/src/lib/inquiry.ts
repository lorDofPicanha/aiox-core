// Conversion path — the brand transacts via WhatsApp (concierge) with an
// email fallback for buyers who don't use WhatsApp (notably the US market).
export const WHATSAPP = "5547992259554";
export const EMAIL = "atelier@bretda.com";

export function waUrl(message: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function mailUrl(subject: string, body: string): string {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
