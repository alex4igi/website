import { Resend } from 'resend'

// Clientul Resend e instanțiat lazy ca să nu arunce la build dacă lipsește cheia.
let client: Resend | null = null

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY lipsește din mediu')
  if (!client) client = new Resend(key)
  return client
}

// Adresa expeditor — un domeniu verificat în Resend (ex: noreply@websitefactory.ro).
export const EMAIL_FROM = process.env.EMAIL_FROM || 'Quasar Dance <noreply@websitefactory.ro>'

// Inbox-ul care primește mesajele de la formularul de contact.
export const CONTACT_INBOX = process.env.CONTACT_INBOX || 'contact@quasardance.ro'

type SendArgs = {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, replyTo }: SendArgs) {
  const { data, error } = await getResend().emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html,
    replyTo,
  })
  if (error) throw new Error(error.message)
  return data
}
