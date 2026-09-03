'use client'

import { useEffect } from 'react'
import { contactMethodForHref, trackContact } from '@/lib/track'

/**
 * Trackingul automat al site-ului, montat o singură dată din layout. Face ce făcea
 * PixelYourSite singur pe WordPress: click pe telefon / WhatsApp / email, prins pe
 * `document`, oriunde ar fi linkul — navbar, footer, contact, locații, LP. Un singur
 * ascultător, în loc să atingem fiecare din cele ~20 de linkuri de contact din site.
 *
 * NU trimite PageView la navigările interne: fbevents.js urmărește singur
 * `history.pushState` și trimite PageView la fiecare schimbare de rută (verificat pe
 * producție, 3 sept 2026: al doilea PageView pleacă fără niciun cod al nostru). Un
 * PageView manual aici ar dubla fiecare pagină. GA4 la fel, prin Enhanced Measurement.
 * Dacă Meta nu vede PageView-uri, cauza e altundeva — vezi MetaPixel.tsx, punctul 4.
 */
export default function SiteTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest?.('a[href]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      const method = contactMethodForHref(anchor.getAttribute('href') ?? '')
      if (!method) return
      trackContact(method, {
        page: window.location.pathname,
        // Textul linkului spune de unde s-a apăsat („Sună”, „Scrie-ne pe WhatsApp”, numărul).
        label: (anchor.getAttribute('aria-label') || anchor.textContent || '').trim().slice(0, 80),
      })
    }
    // `capture`, ca să prindem clickul și când React oprește propagarea mai jos.
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return null
}
