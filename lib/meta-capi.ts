import { createHash } from 'crypto'

/**
 * Meta Conversions API (CAPI): trimite evenimentul `Lead` și de pe server, nu doar din
 * browser. Pixelul din browser pierde cam o treime din evenimente (adblockere, iOS,
 * Safari cu ITP); serverul nu poate fi blocat, iar Meta le potrivește pe cele două
 * după `event_id` și numără o singură dată. Fără CAPI, reclamele se optimizează pe
 * două treimi din lead-urile reale.
 *
 * Ce făcea PixelYourSite Pro pe WordPress; aici sunt ~80 de linii.
 *
 * Datele personale pleacă exclusiv hash-uite (SHA-256), după normalizarea cerută de
 * Meta, iar apelul se face doar dacă persoana a acceptat cookie-urile de marketing —
 * verificarea o face apelantul (route.ts), nu modulul ăsta.
 *
 * Variabile de mediu (Vercel, sensitive):
 *   META_CAPI_ACCESS_TOKEN   — token de sistem generat în Events Manager › Settings ›
 *                              Conversions API › Generate access token. Lipsă = CAPI oprit.
 *   META_PIXEL_ID            — opțional; implicit același pixel ca în MetaPixel.tsx.
 *   META_CAPI_TEST_EVENT_CODE — opțional; codul din Events Manager › Test events, ca să
 *                              vezi evenimentele live în timp ce verifici. Se scoate după.
 */

const GRAPH_VERSION = 'v23.0'
const PIXEL_ID = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_FB_PIXEL_ID || '318398430675684'
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN
const TEST_EVENT_CODE = process.env.META_CAPI_TEST_EVENT_CODE
/** Cât așteptăm Meta înainte să răspundem oricum formularului. Lead-ul e deja în CRM. */
const TIMEOUT_MS = 3000

export const metaCapiEnabled = Boolean(ACCESS_TOKEN)

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex')
}

/** Telefon: doar cifre, cu prefixul de țară, fără `+`. `+40730534172` → `40730534172`. */
export function hashPhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  return digits ? sha256(digits) : null
}

/** Email: fără spații, litere mici. */
export function hashEmail(email: string | null | undefined): string | null {
  const v = (email || '').trim().toLowerCase()
  return v ? sha256(v) : null
}

/** Nume: litere mici, fără spații și punctuație. Diacriticele rămân (Meta acceptă UTF-8). */
export function hashName(name: string | null | undefined): string | null {
  const v = (name || '').toLowerCase().replace(/[\s\p{P}]+/gu, '')
  return v ? sha256(v) : null
}

export type MetaLead = {
  /** Același ID pe care browserul îl dă lui fbq('track','Lead',…,{eventID}) — cheia deduplicării. */
  eventId: string
  phone: string
  email?: string | null
  /** Numele complet din formular; îl împărțim în prenume/nume după primul spațiu. */
  fullName?: string | null
  /** Din request: ajută potrivirea, nu se hash-uiesc (așa cere Meta). */
  clientIp?: string | null
  userAgent?: string | null
  /** Cookie-urile `_fbp` / `_fbc`, dacă există (doar cu consimțământ de marketing). */
  fbp?: string | null
  fbc?: string | null
  /** URL-ul paginii de pe care s-a trimis formularul. */
  sourceUrl?: string | null
  /** Ce ajunge în `content_name`, ca în browser: sursa/campania. */
  contentName: string
  /** Lead nou vs. telefon deja în CRM. Stă aici fiindcă browserul nu mai află răspunsul. */
  leadNew?: boolean | null
}

export type MetaResult = { ok: boolean; reason?: string; eventsReceived?: number }

/** Construiește payload-ul, exportat separat ca să poată fi testat fără rețea. */
export function buildLeadPayload(lead: MetaLead) {
  const [firstName, ...rest] = (lead.fullName || '').trim().split(/\s+/)
  const lastName = rest.join(' ')
  const userData: Record<string, string> = {}
  const ph = hashPhone(lead.phone)
  const em = hashEmail(lead.email)
  const fn = hashName(firstName)
  const ln = hashName(lastName)
  if (ph) userData.ph = ph
  if (em) userData.em = em
  if (fn) userData.fn = fn
  if (ln) userData.ln = ln
  if (lead.clientIp) userData.client_ip_address = lead.clientIp
  if (lead.userAgent) userData.client_user_agent = lead.userAgent
  if (lead.fbp) userData.fbp = lead.fbp
  if (lead.fbc) userData.fbc = lead.fbc

  return {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: lead.eventId,
        action_source: 'website',
        ...(lead.sourceUrl ? { event_source_url: lead.sourceUrl } : {}),
        user_data: userData,
        custom_data: {
          content_name: lead.contentName,
          ...(typeof lead.leadNew === 'boolean' ? { lead_new: lead.leadNew } : {}),
        },
      },
    ],
    ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
  }
}

/** Trimite lead-ul la Meta. Nu aruncă niciodată: un eșec aici nu are voie să strice formularul. */
export async function sendLeadToMeta(lead: MetaLead): Promise<MetaResult> {
  if (!ACCESS_TOKEN) return { ok: false, reason: 'disabled' }
  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildLeadPayload(lead)),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      },
    )
    const data = (await res.json().catch(() => ({}))) as {
      events_received?: number
      error?: { message?: string }
    }
    if (!res.ok) return { ok: false, reason: data.error?.message || `HTTP ${res.status}` }
    return { ok: true, eventsReceived: data.events_received }
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : 'unknown' }
  }
}

/** Ia un cookie după nume din header-ul `Cookie`. */
export function readCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null
  for (const part of cookieHeader.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return decodeURIComponent(v.join('=')) || null
  }
  return null
}
