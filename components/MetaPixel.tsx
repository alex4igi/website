import Script from 'next/script'

// Meta (Facebook) Pixel cu Consent Mode propriu, în acord cu banner-ul GDPR.
// 1. Definim stub-ul `fbq` și REVOCĂM consimțământul ÎNAINTE de init (beforeInteractive),
//    deci nu se trimite niciun eveniment / nu se setează cookie până când utilizatorul
//    nu acceptă categoria „marketing”. `track('PageView')` rămâne în coadă până la grant.
// 2. Trecerea pe `grant`/`revoke` o face componenta CookieConsent prin applyConsent()
//    → fbq('consent', …) (vezi lib/consent.ts), mapat pe categoria marketing.
// 3. Scriptul extern fbevents.js se încarcă afterInteractive (perf), apoi golește coada.
// Pixel-ul se încarcă DOAR dacă există un ID (implicit cel furnizat de client).

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '318398430675684'

export default function MetaPixel() {
  if (!FB_PIXEL_ID) return null

  return (
    <>
      {/* Stub fbq + consimțământ implicit REVOKE + init, înainte de orice tracking. */}
      <Script id="meta-pixel-init" strategy="beforeInteractive">
        {`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}(window,document,'script');
          fbq('consent', 'revoke');
          fbq('init', '${FB_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>

      {/* Încarcă biblioteca Meta și golește coada (revoke → init → PageView). */}
      <Script
        id="meta-pixel-src"
        strategy="afterInteractive"
        src="https://connect.facebook.net/en_US/fbevents.js"
      />

      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  )
}
