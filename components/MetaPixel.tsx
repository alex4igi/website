import Script from 'next/script'
import { CONSENT_MAX_AGE_MS, CONSENT_VERSION, STORAGE_KEY } from '@/lib/consent'

// Meta (Facebook) Pixel cu Consent Mode propriu, în acord cu banner-ul GDPR.
// 1. Definim stub-ul `fbq` și REVOCĂM consimțământul ÎNAINTE de init (beforeInteractive),
//    deci nu se trimite niciun eveniment / nu se setează cookie până când utilizatorul
//    nu acceptă categoria „marketing”. `track('PageView')` rămâne în coadă până la grant.
// 2. Trecerea pe `grant`/`revoke` o face componenta CookieConsent prin applyConsent()
//    → fbq('consent', …) (vezi lib/consent.ts), mapat pe categoria marketing.
// 3. Scriptul extern fbevents.js se încarcă afterInteractive (perf), apoi golește coada.
// 4. EXCEPȚIE la (1): dacă vizitatorul a acceptat deja marketingul într-o vizită anterioară,
//    NU revocăm. fbevents.js golește coada stub-ului doar cât timp consimțământul nu e
//    revocat, iar `grant`-ul pe care CookieConsent îl trimite la montare ajunge în coadă
//    DUPĂ `revoke` și nu mai e procesat niciodată. Efectul, măsurat pe 3 sept 2026: toți
//    vizitatorii care reveneau cu consimțământ salvat nu trimiteau NIMIC la Meta — nici
//    PageView, nici Lead. Citim deci consimțământul sincron, cu aceleași reguli ca
//    `loadConsent()` (versiune, vechime), și revocăm doar dacă lipsește sau e refuzat.
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
          var qdMarketingGranted=false;
          try{var c=JSON.parse(localStorage.getItem('${STORAGE_KEY}'));
            qdMarketingGranted=!!(c&&c.version===${CONSENT_VERSION}&&typeof c.timestamp==='number'
              &&Date.now()-c.timestamp<=${CONSENT_MAX_AGE_MS}&&c.categories&&c.categories.marketing===true);
          }catch(e){}
          if(!qdMarketingGranted){fbq('consent', 'revoke');}
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
