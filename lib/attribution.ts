/**
 * De unde a venit vizitatorul — reținut la intrarea pe site, ca să-l putem lega de un
 * click pe WhatsApp făcut câteva pagini mai târziu. Fără el, click-ul de pe /contact al
 * cuiva venit din Google Ads ar arăta „direct".
 *
 * Ce ține: UTM-urile din URL, gclid (doar cu consimțământ de marketing, vezi `forWaClick`)
 * și domeniul de pe care a venit. În sessionStorage — moare cu tabul.
 */
import { loadConsent } from '@/lib/consent'

const STORAGE_KEY = 'qd-atribuire'

export type Attribution = {
  utm_source: string
  utm_medium: string
  utm_campaign: string | null
  utm_content: string | null
  gclid: string | null
  referrer_host: string | null
  landing: string
}

const SEARCH = ['google', 'bing', 'yahoo', 'duckduckgo', 'yandex', 'ecosia']
const SOCIAL = ['facebook', 'instagram', 'tiktok', 'youtube', 'linkedin']

function fromReferrer(host: string | null): { utm_source: string; utm_medium: string } {
  if (!host) return { utm_source: 'direct', utm_medium: '(none)' }
  const h = host.replace(/^www\.|^m\.|^l\.|^lm\./, '')
  const search = SEARCH.find((s) => h.includes(`${s}.`))
  if (search) return { utm_source: search, utm_medium: 'organic' }
  const social = SOCIAL.find((s) => h.includes(`${s}.`))
  if (social) return { utm_source: social, utm_medium: 'social' }
  return { utm_source: h, utm_medium: 'referral' }
}

function read(): Attribution | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Attribution) : null
  } catch {
    return null
  }
}

/**
 * Se cheamă o dată la încărcarea site-ului. O vizită nouă cu UTM/gclid în URL suprascrie
 * ce era (ultima reclamă câștigă); o navigare fără ele păstrează atribuirea de la intrare.
 */
export function captureAttribution() {
  if (typeof window === 'undefined') return
  const p = new URLSearchParams(window.location.search)
  const cap = (v: string | null) => (v ? v.slice(0, 200) : null)
  const gclid = cap(p.get('gclid'))
  // gbraid/wbraid: click-urile Google Ads de pe iOS, fără gclid.
  const googleAds = Boolean(gclid || p.get('gbraid') || p.get('wbraid'))
  const utmSource = cap(p.get('utm_source'))

  let referrerHost: string | null = null
  try {
    const r = document.referrer ? new URL(document.referrer).hostname : null
    referrerHost = r && r !== window.location.hostname ? r : null
  } catch {
    /* referrer invalid */
  }

  const hasCampaign = Boolean(utmSource || googleAds)
  if (!hasCampaign && read()) return

  const base = utmSource
    ? { utm_source: utmSource, utm_medium: cap(p.get('utm_medium')) ?? '(none)' }
    : googleAds
      ? { utm_source: 'google', utm_medium: 'cpc' }
      : fromReferrer(referrerHost)

  const a: Attribution = {
    ...base,
    utm_campaign: cap(p.get('utm_campaign')),
    utm_content: cap(p.get('utm_content')),
    gclid,
    referrer_host: referrerHost,
    landing: window.location.pathname.slice(0, 200),
  }
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(a))
  } catch {
    /* sessionStorage blocat — click-ul va pleca fără atribuire */
  }
}

/** Atribuirea de trimis la un click pe WhatsApp. gclid doar cu consimțământ de marketing. */
export function attributionForWaClick(): Omit<Attribution, 'landing'> & { landing: string | null } {
  const a = read()
  const marketing = loadConsent()?.categories.marketing === true
  if (!a) {
    return {
      utm_source: 'direct',
      utm_medium: '(none)',
      utm_campaign: null,
      utm_content: null,
      gclid: null,
      referrer_host: null,
      landing: null,
    }
  }
  return { ...a, gclid: marketing ? a.gclid : null }
}

// Fără 0/O, 1/I/L: codul se poate citi și dicta.
const ALFABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

/** Codul pus în mesajul de WhatsApp: 5 caractere, afișat „Q-XXXXX". */
export function newWaCode(): string {
  const bytes = new Uint8Array(5)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => ALFABET[b % ALFABET.length]).join('')
}
