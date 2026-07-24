'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { trackWhatsAppClick } from '@/lib/analytics/trackers'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
const GOOGLE_AW_CONVERSION_ID = process.env.NEXT_PUBLIC_GOOGLE_AW_CONVERSION_ID

function resolveGoogleConfigIds(): string[] {
  const ids = new Set<string>()
  if (GA_ID) ids.add(GA_ID)
  if (GOOGLE_ADS_ID) ids.add(GOOGLE_ADS_ID)
  if (GOOGLE_AW_CONVERSION_ID?.startsWith('AW-')) {
    ids.add(GOOGLE_AW_CONVERSION_ID.split('/')[0])
  }
  return Array.from(ids)
}

export function AnalyticsProvider() {
  const googleConfigIds = resolveGoogleConfigIds()
  const primaryGoogleId = googleConfigIds[0]

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Element)) return

      const link = target.closest('a[href*="wa.me/554730419811"]')
      if (!link) return

      const source =
        link.getAttribute('aria-label') ||
        link.textContent?.trim().slice(0, 80) ||
        'whatsapp-link'

      trackWhatsAppClick({ source })
    }

    document.addEventListener('click', handleDocumentClick, { capture: true })
    return () => document.removeEventListener('click', handleDocumentClick, { capture: true })
  }, [])

  return (
    <>
      {primaryGoogleId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${primaryGoogleId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = window.gtag || gtag;
              gtag('js', new Date());
              ${googleConfigIds.map((id) => `gtag('config', '${id}');`).join('\n')}
            `}
          </Script>
        </>
      )}

      {META_PIXEL_ID && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  )
}
