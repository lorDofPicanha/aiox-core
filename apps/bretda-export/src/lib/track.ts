// Ad tracking — Meta Pixel + Google tag, both optional and driven by env vars.
// If an id is absent the corresponding script never loads and every call here
// is a no-op, so the site works untracked in dev and preview.
//
// Conversion events carry NO monetary value on purpose: the conversion is an
// inquiry handled by a concierge (WhatsApp / e-mail), not a purchase, and Meta
// forbids a value on business-messaging leads.

type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

// Tocks tracking is opt-in. No fallback pixel is allowed because a stale
// cross-brand id would contaminate both attribution and audience optimisation.
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID ?? "";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";
export const GOOGLE_ADS_LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL ?? "";

/** Meta standard events we emit; anything else goes out as a custom event. */
const META_STANDARD = new Set(["PageView", "ViewContent", "Lead", "Contact", "CustomizeProduct"]);

function defined(params: Params): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(params)) if (v !== undefined) out[k] = v;
  return out;
}

type Queued = { event: string; params: Record<string, string | number> };
const pending: Queued[] = [];
let waiting = false;

function send({ event, params }: Queued): void {
  window.fbq?.(META_STANDARD.has(event) ? "track" : "trackCustom", event, params);
  window.gtag?.("event", event, params);
}

/**
 * The pixel snippet loads after hydration, so an effect that runs on mount —
 * the PDP's ViewContent — can fire before window.fbq exists and vanish
 * silently. Hold those events and replay them once the pixel is up; give up
 * after ten seconds so a blocked script never leaks a growing queue.
 */
function flushWhenReady(): void {
  if (waiting) return;
  waiting = true;
  const startedAt = Date.now();
  const timer = window.setInterval(() => {
    if (window.fbq) {
      window.clearInterval(timer);
      waiting = false;
      while (pending.length) send(pending.shift()!);
    } else if (Date.now() - startedAt > 10_000) {
      window.clearInterval(timer);
      waiting = false;
      pending.length = 0;
    }
  }, 150);
}

export function track(event: string, params: Params = {}): void {
  if (typeof window === "undefined") return;
  const queued: Queued = { event, params: defined(params) };
  if (FB_PIXEL_ID && !window.fbq) {
    pending.push(queued);
    flushWhenReady();
    return;
  }
  send(queued);
}

/**
 * An inquiry started — the only conversion this site has. Fires the Meta Lead
 * event and, when configured, the Google Ads conversion action.
 */
export function trackLead(params: Params = {}): void {
  if (typeof window === "undefined") return;
  track("Lead", params);
  if (GOOGLE_ADS_ID && GOOGLE_ADS_LEAD_LABEL) {
    window.gtag?.("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`,
    });
  }
}
