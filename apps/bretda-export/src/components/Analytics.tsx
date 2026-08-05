"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { FB_PIXEL_ID, GA_ID, GOOGLE_ADS_ID } from "@/lib/track";

/**
 * Loads the ad platforms' base tags. Each one is skipped when its env var is
 * missing, so an untracked build stays clean instead of shipping dead scripts.
 *
 * The pixel init fires the first PageView itself; this component re-fires it on
 * client-side navigation, which the App Router does without a page load.
 * Google's tag handles history changes on its own, so it is left alone.
 */
export function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);
  const googleId = GOOGLE_ADS_ID || GA_ID;

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return (
    <>
      {FB_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${FB_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}

      {googleId && (
        <>
          <Script
            id="google-tag-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${googleId}`}
          />
          <Script id="google-tag" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());${GA_ID ? `gtag('config','${GA_ID}');` : ""}${
              GOOGLE_ADS_ID ? `gtag('config','${GOOGLE_ADS_ID}');` : ""
            }`}
          </Script>
        </>
      )}
    </>
  );
}
