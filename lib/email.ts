// Emailuri tranzacționale prin theMarketer — același furnizor și același cont ca
// qapp v2 (vezi `supabase/functions/_shared/messaging.ts` acolo).
//
//   POST https://t.themarketer.com/api/v1/transactional/send-email?k={REST_KEY}&u={CUSTOMER_ID}
//     body: { to, subject, from, body, reply_to? }
//     succes: { result: 'success', message_id }
//
// Domeniul `quasardance.ro` e deja validat în theMarketer (SPF `include:amazonses.com`
// pe apex, 6 CNAME-uri DKIM, subdomeniul `nwl` pentru bounce-uri). Nu e nevoie de
// nimic în DNS pentru trimiterea de aici.

const TM_ENDPOINT = 'https://t.themarketer.com/api/v1/transactional/send-email'

// Formularul de înscriere așteaptă răspunsul acestui apel, deci nu-l lăsăm să atârne.
const TIMEOUT_MS = 8000

export const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@quasardance.ro'
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || 'office@quasardance.ro'

type SendArgs = {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

type TmResponse = {
  result?: string
  message?: string
  message_id?: string
}

// theMarketer acceptă un singur destinatar per apel.
export async function sendEmail({ to, subject, html, replyTo }: SendArgs) {
  const restKey = process.env.THEMARKETER_REST_KEY
  const customerId = process.env.THEMARKETER_CUSTOMER_ID
  if (!restKey || !customerId) {
    throw new Error('THEMARKETER_REST_KEY / THEMARKETER_CUSTOMER_ID lipsesc din mediu')
  }

  const recipients = Array.isArray(to) ? to : [to]
  const url = `${TM_ENDPOINT}?k=${encodeURIComponent(restKey)}&u=${encodeURIComponent(customerId)}`

  const results: TmResponse[] = []
  for (const recipient of recipients) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: recipient,
        subject,
        from: EMAIL_FROM,
        body: html,
        reply_to: replyTo || EMAIL_REPLY_TO,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })

    const text = await res.text()
    let parsed: TmResponse = {}
    try {
      parsed = JSON.parse(text)
    } catch {
      // răspuns non-JSON — păstrăm textul brut pentru mesajul de eroare
    }

    // HTTP 200 nu înseamnă trimis: theMarketer raportează eșecul în `result`.
    if (!res.ok || parsed.result !== 'success') {
      throw new Error(`theMarketer a refuzat trimiterea (${res.status}): ${parsed.message ?? text}`)
    }
    results.push(parsed)
  }

  return results.length === 1 ? results[0] : results
}
