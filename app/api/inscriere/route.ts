import { NextResponse } from 'next/server'
import { normalizePhoneRO, isValidEmail } from '@/lib/validation'
import { sendEmail } from '@/lib/email'
import { inscriereConfirmationEmail } from '@/lib/email-templates'
import { metaCapiEnabled, readCookie, sendLeadToMeta } from '@/lib/meta-capi'
import { turnstileActiv, verificaTurnstile } from '@/lib/turnstile'

// Endpoint-ul CRM-ului Quasar Dance (Qapp). NU mai e public: acceptă doar apeluri
// server-server, cu secretul de mai jos. Dacă `INTAKE_SECRET` lipsește, apelul pleacă
// fără header și va fi refuzat cu 403 de îndată ce CRM-ul pune obligativitatea.
const CRM_ENDPOINT =
  'https://cbftxkwvoboqahzsldcp.supabase.co/functions/v1/intake-website-lead'

// Enum-ul `grupa_lead` din CRM, în forma exactă (case-sensitive) pe care o acceptă.
const ageGroupEnum = ['Tiny', 'Junior', 'Varsity', 'Teens', 'Students', 'Adults']

// Maparea etichetelor afișate în formularul de pe homepage la enum-ul de mai sus.
const ageGroupToEnum: Record<string, string> = {
  'Tiny (4–6)': 'Tiny',
  'Junior (7–10)': 'Junior',
  'Varsity (11–14)': 'Varsity',
  'Teens (15–19)': 'Teens',
  'Students (20–25)': 'Students',
  'Adulți (>25)': 'Adults',
}

// Formularele trimit fie eticheta afișată („Junior (7–10)” — homepage), fie direct
// valoarea de enum („Junior” — landing page-ul de campanie, care o are deja normalizată).
// Le acceptăm pe amândouă: până acum a doua variantă cădea pe `undefined` și lead-ul
// ajungea în CRM fără grupă, fără nicio eroare vizibilă în formular.
function toAgeGroupEnum(value: string | null): string | null {
  if (!value) return null
  if (ageGroupToEnum[value]) return ageGroupToEnum[value]
  return ageGroupEnum.includes(value) ? value : null
}

// Campania implicită, pentru formularele care nu trimit `campanie`.
const DEFAULT_CAMPAIGN = 'Website – Înscriere'

// Campaniile pe care le poate declara clientul. Valoarea ajunge în `campanii_promovare`
// din CRM, care creează automat intrarea dacă lipsește — deci fără listă fixă oricine
// poate umple tabelul cu un POST. Ca să adaugi o campanie nouă, adaugă o linie aici
// și folosește exact același text în configurația landing page-ului.
const ALLOWED_CAMPAIGNS = [
  DEFAULT_CAMPAIGN,
  'ZPD 2026', // Back to Dance School — Săptămâna Porților Deschise, 7–11 sept. 2026
]

// Plafoane pentru textele libere: CRM-ul le stochează ca atare, iar endpoint-ul e public.
const MAX_MESAJ = 1000
const MAX_SHORT = 200

function trimTo(value: string | undefined, max: number): string | null {
  const v = (value || '').trim()
  return v ? v.slice(0, max) : null
}

type Body = {
  nume?: string
  telefon?: string
  email?: string
  interes?: string
  grupa_varsta?: string
  locatia?: string
  mesaj?: string
  campanie?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  company?: string // honeypot
  /** ID-ul cu care browserul a trimis Lead la Meta Pixel; îl refolosim la CAPI pentru deduplicare. */
  event_id?: string
  /** `true` doar dacă persoana a acceptat cookie-urile de marketing. Fără el nu trimitem nimic la Meta. */
  marketing_consent?: boolean
  /** Tokenul Cloudflare Turnstile. Cerut doar când cheile sunt configurate. */
  turnstile_token?: string
}

/** Formatul acceptat pentru event_id: UUID sau ce produce `newEventId()` din lib/track.ts. */
const EVENT_ID_RE = /^[A-Za-z0-9-]{8,64}$/

export async function POST(req: Request) {
  let body: Body = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 })
  }

  // Anti-spam: honeypot completat → ne prefacem că am reușit, fără să facem nimic.
  // Răspunsul e IDENTIC cu cel de succes; orice diferență i-ar spune botului că e prins.
  if (body.company) {
    return NextResponse.json({ ok: true })
  }

  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip')

  if (turnstileActiv) {
    const verdict = await verificaTurnstile(body.turnstile_token, clientIp)
    if (verdict === 'respins') {
      return NextResponse.json({ error: 'Nu am putut confirma că nu ești robot. Reîncarcă pagina și încearcă din nou, sau sună-ne la 0730 534 172.', field: 'turnstile' }, { status: 400 })
    }
    // Fail-open DOAR când Cloudflare nu răspunde: un lead pierdut costă mai mult decât
    // un bot care trece. Poarta nu rămâne deschisă — în spate stă plafonul CRM-ului
    // (5 înscrieri / 10 minute pe vizitator).
    if (verdict === 'indisponibil') console.warn('[inscriere] Turnstile indisponibil — fail-open')
  }

  const nume = (body.nume || '').trim()
  if (nume.length < 2) {
    return NextResponse.json({ error: 'Numele este obligatoriu.', field: 'nume' }, { status: 400 })
  }

  const telefon = normalizePhoneRO(body.telefon || '')
  if (!telefon) {
    return NextResponse.json(
      { error: 'Număr de telefon invalid. Folosește un mobil românesc (ex: 07XXXXXXXX).', field: 'telefon' },
      { status: 400 },
    )
  }

  const interes = trimTo(body.interes, MAX_SHORT)
  const locatia = trimTo(body.locatia, MAX_SHORT)
  const grupaLabel = trimTo(body.grupa_varsta, MAX_SHORT)
  const mesaj = trimTo(body.mesaj, MAX_MESAJ)

  // O campanie necunoscută nu blochează lead-ul — l-am pierde degeaba. Cade pe cea
  // implicită, iar linia din log spune de ce lead-ul n-a ajuns sub campania așteptată.
  const campanieCeruta = trimTo(body.campanie, MAX_SHORT)
  if (campanieCeruta && !ALLOWED_CAMPAIGNS.includes(campanieCeruta)) {
    console.warn('[inscriere] Campanie necunoscută, ignorată:', campanieCeruta)
  }
  const campanie =
    campanieCeruta && ALLOWED_CAMPAIGNS.includes(campanieCeruta) ? campanieCeruta : DEFAULT_CAMPAIGN

  const emailInput = body.email?.trim()
  const email = emailInput && isValidEmail(emailInput) ? emailInput : null

  // Trimitem lead-ul la CRM, inclusiv email (cerut de client). CRM-ul are auto-reply-ul
  // dezactivat intenționat (`intake-website-lead`), tocmai pentru că trimitem noi
  // confirmarea mai jos — deci e singurul email pe care îl primește cel înscris.
  let crmData: { created?: boolean; leadId?: string; reason?: string } = {}
  try {
    const crmRes = await fetch(CRM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.INTAKE_SECRET ? { 'x-intake-secret': process.env.INTAKE_SECRET } : {}),
        // IP-ul vizitatorului, nu al serverului: CRM-ul îl folosește ca cheie de plafonare
        // și îl crede DOAR pentru că apelul vine cu secretul de mai sus.
        ...(clientIp ? { 'x-client-ip': clientIp } : {}),
      },
      body: JSON.stringify({
        nume,
        telefon,
        email,
        interes,
        grupa_varsta: toAgeGroupEnum(grupaLabel),
        locatia,
        mesaj,
        campanie,
        utm_source: body.utm_source || null,
        utm_medium: body.utm_medium || null,
        utm_campaign: body.utm_campaign || null,
      }),
    })
    crmData = await crmRes.json().catch(() => ({}))

    if (!crmRes.ok) {
      // Mesajele de validare (400) sunt despre ce a scris omul în formular și îl ajută.
      // Orice altceva (403/5xx) e despre noi — omul primește un text generic.
      const detaliu =
        crmRes.status === 400 && crmData && 'error' in crmData
          ? (crmData as { error: string }).error
          : 'Nu am putut trimite cererea.'
      if (crmRes.status !== 400) console.error(`[inscriere] CRM ${crmRes.status}:`, crmData)
      return NextResponse.json({ error: detaliu }, { status: crmRes.status === 400 ? 400 : 502 })
    }
  } catch {
    return NextResponse.json(
      { error: 'Nu am putut contacta serverul. Te rugăm să încerci din nou.' },
      { status: 502 },
    )
  }

  // Meta Conversions API, în paralel cu emailul. Doar cu consimțământ de marketing și
  // doar dacă tokenul e setat (vezi lib/meta-capi.ts). Un eșec aici nu afectează
  // răspunsul — lead-ul e deja în CRM — dar apare în `metaSent` și în log.
  const eventId = body.event_id && EVENT_ID_RE.test(body.event_id) ? body.event_id : crypto.randomUUID()
  const metaPromise =
    metaCapiEnabled && body.marketing_consent === true
      ? sendLeadToMeta({
          eventId,
          phone: telefon,
          email,
          fullName: nume,
          clientIp,
          userAgent: req.headers.get('user-agent'),
          fbp: readCookie(req.headers.get('cookie'), '_fbp'),
          fbc: readCookie(req.headers.get('cookie'), '_fbc'),
          sourceUrl: req.headers.get('referer'),
          contentName: campanie === DEFAULT_CAMPAIGN ? 'homepage' : campanie,
          leadNew: crmData.created ?? true,
        })
      : null

  // Confirmare branded prin theMarketer. Best-effort: un email picat nu pierde lead-ul,
  // care e deja în CRM. Dar nu îl înghițim tăcut — `emailSent: false` în răspuns și o
  // linie de log distinctă, ca eșecul să fie vizibil fără să sape cineva prin Vercel.
  let emailSent: boolean | null = null
  if (email) {
    try {
      const { subject, html } = inscriereConfirmationEmail({
        name: nume,
        interest: interes,
        ageGroup: grupaLabel,
        location: locatia,
      })
      await sendEmail({ to: email, subject, html })
      emailSent = true
    } catch (err) {
      emailSent = false
      console.error(
        `[inscriere] EMAIL EȘUAT — lead ${crmData.leadId ?? '(fără id)'} nu a primit confirmarea:`,
        err instanceof Error ? err.message : err,
      )
    }
  }

  let metaSent: boolean | null = null
  if (metaPromise) {
    const meta = await metaPromise
    metaSent = meta.ok
    if (!meta.ok) console.error(`[inscriere] META CAPI EȘUAT — lead ${crmData.leadId ?? '(fără id)'}:`, meta.reason)
  }

  // Răspuns neutru: `created`/`leadId` ar fi spus oricui dacă un telefon e deja în CRM.
  // Ce era nevoie de ele (evenimentul `lead_new`) se trimite acum de pe server, prin CAPI.
  if (emailSent === false || metaSent === false) {
    console.warn(`[inscriere] lead ${crmData.leadId ?? '(fără id)'}: email=${emailSent} meta=${metaSent}`)
  }
  return NextResponse.json({ ok: true })
}
