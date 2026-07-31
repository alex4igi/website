import Script from 'next/script'

// Google Tag Manager (container GTM-NCPGG3N7).
// 1. Snippet-ul din <head> rulează `beforeInteractive`, DAR după <ConsentMode />,
//    care setează Consent Mode v2 pe `denied` — deci tag-urile din container
//    pornesc blocate până când utilizatorul acceptă în banner-ul GDPR.
// 2. Actualizarea pe `granted` o face CookieConsent prin gtag('consent','update')
//    + evenimentul `cookie_consent_update` în dataLayer (vezi lib/consent.ts).
// 3. <GTMNoScript /> trebuie randat imediat după <body> (fallback fără JavaScript).

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NCPGG3N7'

export default function GoogleTagManager() {
  if (!GTM_ID) return null

  return (
    <Script id="gtm-init" strategy="beforeInteractive">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `}
    </Script>
  )
}

export function GTMNoScript() {
  if (!GTM_ID) return null

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}
