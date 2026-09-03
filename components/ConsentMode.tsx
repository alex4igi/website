import Script from 'next/script'

// Google Consent Mode v2.
// 1. Înainte de orice tag Google setăm consimțământul implicit pe `denied`
//    (singura excepție: security_storage). Astfel respectăm GDPR „opt-in”.
// 2. GA4 se încarcă DOAR dacă există NEXT_PUBLIC_GA_ID — altfel nu se schimbă nimic.
// Actualizarea pe `granted` o face componenta CookieConsent prin gtag('consent','update').

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
// Conversia Google Ads („AW-XXXXXXXXX/eticheta") merge prin același gtag.js, dar gtag
// ignoră `event: conversion` dacă nu are contul AW configurat — de aici `config` mai jos.
const ADS_ID = (process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION || '').split('/')[0]
const GTAG_ID = GA_ID || ADS_ID

export default function ConsentMode() {
  return (
    <>
      {/* Trebuie să ruleze ÎNAINTE de gtag.js → strategy beforeInteractive. */}
      <Script id="consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            functionality_storage: 'denied',
            personalization_storage: 'denied',
            security_storage: 'granted',
            wait_for_update: 500
          });
          gtag('set', 'url_passthrough', true);
          gtag('set', 'ads_data_redaction', true);
        `}
      </Script>

      {GTAG_ID ? (
        <>
          <Script
            id="ga-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              gtag('js', new Date());
              ${GA_ID ? `gtag('config', '${GA_ID}');` : ''}
              ${ADS_ID ? `gtag('config', '${ADS_ID}');` : ''}
            `}
          </Script>
        </>
      ) : null}
    </>
  )
}
