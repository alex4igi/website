'use client'

import { useEffect } from 'react'
import { contactMethodForHref, trackContact } from '@/lib/track'
import { attributionForWaClick, captureAttribution, invisibleWaCode, newWaCode } from '@/lib/attribution'

// Numărul nostru de WhatsApp. Linkurile de „trimite prietenilor" (wa.me/?text=) nu-l au
// și nu primesc cod.
const WA_NUMBER = '40730534172'

const DEFAULT_TEXT = 'Bună! Aș dori mai multe detalii despre cursurile Quasar Dance.'

/**
 * Pune un cod nou, INVIZIBIL, în mesajul precompletat și salvează click-ul cu
 * atribuirea lui (/api/wa-click → CRM). Recepția lipește mesajul în fișa leadului și
 * CRM-ul află de unde a venit omul. `data-wa-base` ține linkul original, ca un al doilea
 * click să nu adauge încă un cod peste primul.
 */
function tagWhatsAppLink(anchor: HTMLAnchorElement): string | null {
  const base = anchor.dataset.waBase ?? anchor.href
  let url: URL
  try {
    url = new URL(base)
  } catch {
    return null
  }
  const phone = url.hostname === 'wa.me' ? url.pathname.replace(/\//g, '') : url.searchParams.get('phone')
  if (phone !== WA_NUMBER) return null

  const code = newWaCode()
  // După primul „!" (sau primul cuvânt), nu la final: unele aplicații taie ce e la capăt,
  // iar începutul mesajului e partea pe care omul o șterge cel mai rar.
  const text = url.searchParams.get('text') || DEFAULT_TEXT
  const cut = text.indexOf('!') >= 0 ? text.indexOf('!') + 1 : Math.max(text.indexOf(' '), 0) || text.length
  url.searchParams.set('text', text.slice(0, cut) + invisibleWaCode(code) + text.slice(cut))
  // URLSearchParams scrie spațiile ca „+", pe care WhatsApp le poate lăsa ca atare în mesaj.
  url.search = url.search.replace(/\+/g, '%20')
  anchor.dataset.waBase = base
  // Schimbat în faza de capture, înainte de navigare: browserul deschide linkul nou.
  anchor.href = url.toString()

  const payload = JSON.stringify({ cod: code, pagina: window.location.pathname, ...attributionForWaClick() })
  try {
    // sendBeacon supraviețuiește plecării de pe pagină (pe mobil WhatsApp preia ecranul).
    const sent = navigator.sendBeacon?.('/api/wa-click', new Blob([payload], { type: 'application/json' }))
    if (!sent) {
      void fetch('/api/wa-click', { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' }, keepalive: true })
    }
  } catch {
    /* fără atribuire pentru click-ul ăsta — mesajul pleacă oricum */
  }
  return code
}

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
    captureAttribution()
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest?.('a[href]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      const method = contactMethodForHref(anchor.getAttribute('href') ?? '')
      if (!method) return
      const waRef = method === 'whatsapp' ? tagWhatsAppLink(anchor) : null
      trackContact(method, {
        ...(waRef ? { wa_ref: waRef } : {}),
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
