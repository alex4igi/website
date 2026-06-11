import { NextResponse } from 'next/server'
import { isValidEmail } from '@/lib/validation'
import { sendEmail, CONTACT_INBOX } from '@/lib/email'
import { contactConfirmationEmail, contactNotificationEmail } from '@/lib/email-templates'

type Body = {
  name?: string
  email?: string
  phone?: string
  message?: string
  company?: string // honeypot
}

export async function POST(req: Request) {
  let body: Body = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 })
  }

  // Anti-spam: honeypot completat → ne prefacem că am reușit.
  if (body.company) {
    return NextResponse.json({ ok: true })
  }

  const name = (body.name || '').trim()
  const email = (body.email || '').trim()
  const phone = body.phone?.trim() || null
  const message = (body.message || '').trim()

  if (name.length < 2) {
    return NextResponse.json({ error: 'Numele este obligatoriu.', field: 'name' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Adresă de email invalidă.', field: 'email' }, { status: 400 })
  }
  if (message.length < 2) {
    return NextResponse.json({ error: 'Mesajul este obligatoriu.', field: 'message' }, { status: 400 })
  }

  // Notificarea către echipă e esențială (formularul de contact nu merge în CRM).
  try {
    const notification = contactNotificationEmail({ name, email, phone, message })
    await sendEmail({
      to: CONTACT_INBOX,
      subject: notification.subject,
      html: notification.html,
      replyTo: email,
    })
  } catch (err) {
    console.error('[contact] Trimiterea notificării a eșuat:', err)
    return NextResponse.json(
      { error: 'Nu am putut trimite mesajul. Te rugăm să încerci din nou.' },
      { status: 502 },
    )
  }

  // Confirmarea către vizitator e best-effort — nu blocăm dacă pică.
  try {
    const confirmation = contactConfirmationEmail({ name })
    await sendEmail({ to: email, subject: confirmation.subject, html: confirmation.html })
  } catch (err) {
    console.error('[contact] Trimiterea confirmării a eșuat:', err)
  }

  return NextResponse.json({ ok: true })
}
