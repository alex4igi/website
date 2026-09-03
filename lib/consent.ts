// Logica de consimțământ pentru cookie-uri (GDPR / EU) + maparea la
// Google Consent Mode v2. Fără UI aici — doar tipuri și helperi pe localStorage.

export type ConsentCategory = 'analytics' | 'functional' | 'marketing'

export type ConsentCategories = Record<ConsentCategory, boolean>

export type ConsentRecord = {
  version: number
  // timestamp (ms) când a fost dat/actualizat consimțământul
  timestamp: number
  categories: ConsentCategories
}

// Bump-uiește versiunea dacă schimbi categoriile/semnificația lor → re-întreabă utilizatorii.
export const CONSENT_VERSION = 1

// Re-întrebăm utilizatorul după 6 luni (recomandarea CNIL/EU).
export const CONSENT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30 * 6

// Exportată pentru MetaPixel.tsx, care citește consimțământul sincron, înainte de init.
export const STORAGE_KEY = 'qd-cookie-consent'

// Eveniment custom prin care footer-ul (sau orice link) redeschide setările.
export const OPEN_SETTINGS_EVENT = 'qd:open-cookie-settings'

export const DENIED_CATEGORIES: ConsentCategories = {
  analytics: false,
  functional: false,
  marketing: false,
}

export const GRANTED_CATEGORIES: ConsentCategories = {
  analytics: true,
  functional: true,
  marketing: true,
}

// Semnalele Google Consent Mode v2. `security_storage` rămâne mereu granted.
type GoogleConsentValue = 'granted' | 'denied'
export type GoogleConsentState = {
  ad_storage: GoogleConsentValue
  ad_user_data: GoogleConsentValue
  ad_personalization: GoogleConsentValue
  analytics_storage: GoogleConsentValue
  functionality_storage: GoogleConsentValue
  personalization_storage: GoogleConsentValue
  security_storage: GoogleConsentValue
}

const yn = (v: boolean): GoogleConsentValue => (v ? 'granted' : 'denied')

// Maparea celor 4 categorii (vezi /politica-cookies) la semnalele Consent Mode v2.
export function toGoogleConsent(c: ConsentCategories): GoogleConsentState {
  return {
    analytics_storage: yn(c.analytics),
    ad_storage: yn(c.marketing),
    ad_user_data: yn(c.marketing),
    ad_personalization: yn(c.marketing),
    functionality_storage: yn(c.functional),
    personalization_storage: yn(c.functional),
    security_storage: 'granted',
  }
}

// Citește consimțământul stocat. Returnează `null` dacă lipsește, e expirat,
// e dintr-o versiune veche sau e corupt → caz în care se re-afișează banner-ul.
export function loadConsent(): ConsentRecord | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentRecord
    if (parsed.version !== CONSENT_VERSION) return null
    if (typeof parsed.timestamp !== 'number') return null
    if (Date.now() - parsed.timestamp > CONSENT_MAX_AGE_MS) return null
    if (!parsed.categories || typeof parsed.categories !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

export function saveConsent(categories: ConsentCategories): ConsentRecord {
  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    timestamp: Date.now(),
    categories,
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch {
    // localStorage indisponibil (mod privat etc.) — ignorăm, consimțământul ține pe sesiune.
  }
  return record
}

// Trimite semnalele către Google (Consent Mode v2) + un eveniment în dataLayer.
export function applyConsent(categories: ConsentCategories) {
  if (typeof window === 'undefined') return
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
    fbq?: (...args: unknown[]) => void
  }
  if (typeof w.gtag === 'function') {
    w.gtag('consent', 'update', toGoogleConsent(categories))
  }
  // Meta Pixel — categoria „marketing” controlează tracking-ul (grant/revoke).
  if (typeof w.fbq === 'function') {
    w.fbq('consent', categories.marketing ? 'grant' : 'revoke')
    if (categories.marketing) regrantMetaAfterLoad()
  }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event: 'cookie_consent_update', consent: categories })
}

/**
 * Ocolește un blocaj din fbevents.js: biblioteca golește coada stub-ului doar cât timp
 * consimțământul nu e revocat. Dacă `grant` a intrat în coadă ÎNAINTE să se încarce
 * biblioteca (vizitator care apasă „Accept” foarte repede), rămâne după `revoke` și nu e
 * procesat niciodată — pixelul nu se mai inițializează deloc. Un `grant` dat DUPĂ ce
 * biblioteca e încărcată (când `fbq.callMethod` există) deblochează coada. Deci, dacă
 * biblioteca nu e încă aici, repetăm grant-ul când apare.
 */
function regrantMetaAfterLoad() {
  const w = window as unknown as { fbq?: { (...args: unknown[]): void; callMethod?: unknown } }
  if (w.fbq?.callMethod) return
  let attempts = 0
  const timer = window.setInterval(() => {
    attempts += 1
    if (w.fbq?.callMethod) {
      window.clearInterval(timer)
      w.fbq('consent', 'grant')
    } else if (attempts >= 60) {
      window.clearInterval(timer) // 15 s: biblioteca e blocată (adblocker) — nu mai insistăm
    }
  }, 250)
}
