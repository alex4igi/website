import { NextResponse } from 'next/server'
import { normalizePhoneRO, isValidEmail } from '@/lib/validation'
import { sendEmail } from '@/lib/email'
import { inscriereConfirmationEmail } from '@/lib/email-templates'

// Endpoint-ul public al CRM-ului Quasar Dance (Qapp).
const CRM_ENDPOINT =
  'https://cbftxkwvoboqahzsldcp.supabase.co/functions/v1/intake-website-lead'

// Maparea grupelor afișate la enum-ul exact (case-sensitive) cerut de CRM.
const ageGroupToEnum: Record<string, string> = {
  'Tiny (4–6)': 'Tiny',
  'Junior (7–10)': 'Junior',
  'Varsity (11–14)': 'Varsity',
  'Teens (15–19)': 'Teens',
  'Students (20–25)': 'Students',
  'Adulți (>25)': 'Adults',
}

type Body = {
  nume?: string
  telefon?: string
  email?: string
  interes?: string
  grupa_varsta?: string
  locatia?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  company?: string // honeypot
}

export async function POST(req: Request) {
  let body: Body = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 })
  }

  // Anti-spam: honeypot completat → ne prefacem că am reușit, fără să facem nimic.
  if (body.company) {
    return NextResponse.json({ created: false, reason: 'ignored' })
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

  const interes = body.interes?.trim() || null
  const locatia = body.locatia?.trim() || null
  const grupaLabel = body.grupa_varsta?.trim() || null

  // Trimitem lead-ul la CRM — FĂRĂ email (confirmarea o trimitem noi, branded,
  // ca să evităm dublarea cu emailul automat al CRM-ului).
  let crmData: { created?: boolean; leadId?: string; reason?: string } = {}
  try {
    const crmRes = await fetch(CRM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nume,
        telefon,
        interes,
        grupa_varsta: grupaLabel ? ageGroupToEnum[grupaLabel] || null : null,
        locatia,
        campanie: 'Website – Înscriere',
        utm_source: body.utm_source || null,
        utm_medium: body.utm_medium || null,
        utm_campaign: body.utm_campaign || null,
      }),
    })
    crmData = await crmRes.json().catch(() => ({}))

    if (!crmRes.ok) {
      return NextResponse.json(
        { error: crmData && 'error' in crmData ? (crmData as { error: string }).error : 'Nu am putut trimite cererea.' },
        { status: crmRes.status },
      )
    }
  } catch {
    return NextResponse.json(
      { error: 'Nu am putut contacta serverul. Te rugăm să încerci din nou.' },
      { status: 502 },
    )
  }

  // Confirmare branded prin Resend (best-effort — nu blocăm lead-ul dacă pică emailul).
  const email = body.email?.trim()
  if (email && isValidEmail(email)) {
    try {
      const { subject, html } = inscriereConfirmationEmail({
        name: nume,
        interest: interes,
        ageGroup: grupaLabel,
        location: locatia,
      })
      await sendEmail({ to: email, subject, html })
    } catch (err) {
      console.error('[inscriere] Trimiterea emailului de confirmare a eșuat:', err)
    }
  }

  return NextResponse.json({
    created: crmData.created ?? true,
    leadId: crmData.leadId,
  })
}
