/**
 * Evenimentele de marketing ale site-ului, într-un singur loc.
 *
 * Înlocuiește ce făcea PixelYourSite pe WordPress: fiecare eveniment pleacă simultan
 * către dataLayer (pentru GTM), GA4 (gtag), Meta Pixel (fbq) și, pentru lead-uri,
 * conversia Google Ads. Componentele nu apelează niciodată fbq/gtag direct — cheamă o
 * funcție de aici, ca numele evenimentelor și parametrii să rămână consecvenți
 * indiferent de unde pornesc.
 *
 * Consimțământul nu se verifică aici: Meta Pixel pornește pe `revoke` și ține evenimentele
 * în coadă până la acceptare, iar gtag stă sub Consent Mode v2 (vezi ConsentMode.tsx).
 * Toate funcțiile sunt tăcute când scripturile nu s-au încărcat (adblocker, SSR).
 */

/**
 * Conversia Google Ads pentru lead, format "AW-XXXXXXXXX/AbC-D_efG" (Ads › Goals ›
 * Conversions › acțiunea de lead › Tag setup › „Use Google tag" › conversion ID + label).
 * Goală = nu se trimite nimic la Ads; GA4 și Meta merg oricum.
 * Variabila e NEXT_PUBLIC_ pentru că valoarea trebuie să ajungă în browser.
 */
export const GOOGLE_ADS_CONVERSION = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION || ''
/** Partea „AW-XXXXXXXXX", pe care gtag trebuie s-o aibă configurată ca să accepte conversia. */
export const GOOGLE_ADS_ID = GOOGLE_ADS_CONVERSION.split('/')[0] || ''

type Params = Record<string, string | number | boolean | null | undefined>

type TrackingWindow = Window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
  fbq?: (...args: unknown[]) => void
}

function win(): TrackingWindow | null {
  return typeof window === 'undefined' ? null : (window as TrackingWindow)
}

/**
 * ID unic pentru un eveniment care pleacă și din browser, și de pe server (Meta CAPI).
 * Meta le potrivește după el și numără o singură dată.
 */
export function newEventId(): string {
  const c = typeof crypto !== 'undefined' ? crypto : null
  if (c?.randomUUID) return c.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

/** Trimite același eveniment pe toate canalele. */
function send(opts: { dataLayer: string; ga: string; meta: string; params: Params; eventId?: string }) {
  const w = win()
  if (!w) return
  const params = opts.eventId ? { ...opts.params, event_id: opts.eventId } : opts.params
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event: opts.dataLayer, ...params })
  w.gtag?.('event', opts.ga, params)
  const metaData = { content_name: opts.params.source ?? opts.params.method }
  if (opts.eventId) w.fbq?.('track', opts.meta, metaData, { eventID: opts.eventId })
  else w.fbq?.('track', opts.meta, metaData)
}

/**
 * Lead: cineva a trimis un formular de înscriere. `source` spune care formular
 * (homepage, LP), ca în Meta și GA4 să se vadă separat. `eventId` e același trimis
 * serverului în corpul cererii, ca Meta să nu numere lead-ul de două ori.
 */
export function trackLead(params: Params & { source: string }, eventId?: string) {
  send({ dataLayer: 'lead', ga: 'generate_lead', meta: 'Lead', params, eventId })
  if (GOOGLE_ADS_CONVERSION) {
    win()?.gtag?.('event', 'conversion', {
      send_to: GOOGLE_ADS_CONVERSION,
      ...(eventId ? { transaction_id: eventId } : {}),
    })
  }
}

export type ContactMethod = 'telefon' | 'whatsapp' | 'email'

/**
 * Contact: click pe un număr de telefon, pe WhatsApp sau pe o adresă de email.
 * Nu e o conversie confirmată (nu știm dacă omul a și sunat), dar e cel mai
 * puternic semnal de intenție de pe site și Meta îl folosește la optimizare.
 */
export function trackContact(method: ContactMethod, params: Params = {}) {
  send({ dataLayer: 'contact_click', ga: 'contact_click', meta: 'Contact', params: { method, ...params } })
}

/** Ce fel de contact e un link, după href. `null` dacă nu e link de contact. */
export function contactMethodForHref(href: string): ContactMethod | null {
  const h = href.trim().toLowerCase()
  if (h.startsWith('tel:')) return 'telefon'
  if (h.startsWith('mailto:')) return 'email'
  if (h.includes('wa.me/') || h.includes('api.whatsapp.com/') || h.startsWith('whatsapp:')) return 'whatsapp'
  return null
}
