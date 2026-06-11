// Template-uri HTML pentru emailuri tranzacționale Quasar Dance.
// Stil email-safe (tabele + inline styles), branding Quasar (negru #231f20 / galben #f8ef21).

const DARK = '#231f20'
const YELLOW = '#f8ef21'
const SITE_URL = 'https://quasardance.ro'

const CONTACT_PHONE = '0730 534 172'
const CONTACT_EMAIL = 'contact@quasardance.ro'

// Escape minimal pentru a preveni injectarea de HTML din inputul utilizatorului.
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

type LayoutArgs = {
  preheader: string
  heading: string
  bodyHtml: string
}

function baseLayout({ preheader, heading, bodyHtml }: LayoutArgs): string {
  return `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>${esc(heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e8e8;">
          <!-- Header -->
          <tr>
            <td style="background-color:${DARK};padding:28px 32px;">
              <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:0.5px;">QUASAR<span style="color:${YELLOW};">DANCE</span></span>
            </td>
          </tr>
          <!-- Yellow accent bar -->
          <tr><td style="height:4px;background-color:${YELLOW};line-height:4px;font-size:0;">&nbsp;</td></tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 28px 32px;">
              <h1 style="margin:0 0 16px 0;color:${DARK};font-size:24px;line-height:1.3;font-weight:800;">${heading}</h1>
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 32px 32px;border-top:1px solid #eeeeee;">
              <p style="margin:0 0 6px 0;color:#6b6b6b;font-size:13px;line-height:1.6;">
                <strong style="color:${DARK};">Quasar Dance</strong> · Cursuri de dans în Iași
              </p>
              <p style="margin:0;color:#6b6b6b;font-size:13px;line-height:1.6;">
                Telefon: <a href="tel:+40730534172" style="color:${DARK};text-decoration:none;">${CONTACT_PHONE}</a> ·
                Email: <a href="mailto:${CONTACT_EMAIL}" style="color:${DARK};text-decoration:none;">${CONTACT_EMAIL}</a><br>
                <a href="${SITE_URL}" style="color:#6b6b6b;text-decoration:underline;">quasardance.ro</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0 0;color:#9a9a9a;font-size:11px;">Acest email a fost trimis automat. Te rugăm să nu răspunzi direct.</p>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// Rând „etichetă: valoare” reutilizabil în corpul emailului.
function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;color:#6b6b6b;font-size:14px;width:130px;vertical-align:top;">${esc(label)}</td>
    <td style="padding:8px 0;color:${DARK};font-size:14px;font-weight:600;vertical-align:top;">${esc(value)}</td>
  </tr>`
}

// ─── 1. Confirmare înscriere (ședință demo) → către vizitator ──────────────
type InscriereArgs = {
  name: string
  interest?: string | null
  ageGroup?: string | null
  location?: string | null
}

export function inscriereConfirmationEmail({ name, interest, ageGroup, location }: InscriereArgs) {
  const rows = [
    interest ? detailRow('Interes', interest) : '',
    ageGroup ? detailRow('Grupă de vârstă', ageGroup) : '',
    location ? detailRow('Locație', location) : '',
  ].join('')

  const detailsBlock = rows
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f8f8;border-radius:12px;padding:8px 16px;margin:0 0 24px 0;">${rows}</table>`
    : ''

  const bodyHtml = `
    <p style="margin:0 0 16px 0;color:#444;font-size:15px;line-height:1.6;">
      Salut${name ? ` ${esc(name)}` : ''}, 👋
    </p>
    <p style="margin:0 0 16px 0;color:#444;font-size:15px;line-height:1.6;">
      Am primit cererea ta pentru o <strong>ședință demo gratuită</strong>. Unul dintre instructorii
      noștri te va contacta în maximum <strong>24 de ore</strong> pentru a stabili detaliile.
    </p>
    ${detailsBlock}
    <p style="margin:0 0 24px 0;color:#444;font-size:15px;line-height:1.6;">
      Până atunci, dacă ai întrebări, ne poți suna la <a href="tel:+40730534172" style="color:${DARK};font-weight:600;">${CONTACT_PHONE}</a>.
      Ne vedem la dans! 💃🕺
    </p>
    <a href="${SITE_URL}" style="display:inline-block;background-color:${YELLOW};color:${DARK};font-size:15px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:999px;">Vezi cursurile noastre</a>
  `

  return {
    subject: 'Am primit cererea ta — Quasar Dance',
    html: baseLayout({
      preheader: 'Te contactăm în maximum 24 de ore pentru ședința demo gratuită.',
      heading: 'Cererea ta a fost înregistrată! 🎉',
      bodyHtml,
    }),
  }
}

// ─── 2. Confirmare contact → către vizitator ──────────────────────────────
export function contactConfirmationEmail({ name }: { name: string }) {
  const bodyHtml = `
    <p style="margin:0 0 16px 0;color:#444;font-size:15px;line-height:1.6;">
      Salut${name ? ` ${esc(name)}` : ''}, 👋
    </p>
    <p style="margin:0 0 16px 0;color:#444;font-size:15px;line-height:1.6;">
      Îți mulțumim că ne-ai scris! Am primit mesajul tău și îți vom răspunde în cel mai scurt timp posibil,
      de regulă în câteva ore în intervalul nostru de program.
    </p>
    <p style="margin:0 0 24px 0;color:#444;font-size:15px;line-height:1.6;">
      Dacă e ceva urgent, ne poți suna direct la <a href="tel:+40730534172" style="color:${DARK};font-weight:600;">${CONTACT_PHONE}</a>
      (Luni–Sâmbătă, 15:00–21:00).
    </p>
    <a href="${SITE_URL}" style="display:inline-block;background-color:${YELLOW};color:${DARK};font-size:15px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:999px;">Înapoi la site</a>
  `

  return {
    subject: 'Am primit mesajul tău — Quasar Dance',
    html: baseLayout({
      preheader: 'Îți răspundem în cel mai scurt timp posibil.',
      heading: 'Mulțumim pentru mesaj! ✉️',
      bodyHtml,
    }),
  }
}

// ─── 3. Notificare contact → către echipa Quasar ──────────────────────────
type ContactNotificationArgs = {
  name: string
  email: string
  phone?: string | null
  message: string
}

export function contactNotificationEmail({ name, email, phone, message }: ContactNotificationArgs) {
  const rows = [
    detailRow('Nume', name),
    detailRow('Email', email),
    phone ? detailRow('Telefon', phone) : '',
  ].join('')

  const bodyHtml = `
    <p style="margin:0 0 20px 0;color:#444;font-size:15px;line-height:1.6;">
      Ai primit un mesaj nou prin formularul de contact de pe site:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f8f8;border-radius:12px;padding:8px 16px;margin:0 0 20px 0;">${rows}</table>
    <p style="margin:0 0 8px 0;color:#6b6b6b;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Mesaj</p>
    <div style="background-color:#ffffff;border:1px solid #e8e8e8;border-radius:12px;padding:16px;color:${DARK};font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(message)}</div>
    <p style="margin:20px 0 0 0;color:#6b6b6b;font-size:13px;line-height:1.6;">
      Poți răspunde direct la acest email pentru a-i scrie lui ${esc(name)}.
    </p>
  `

  return {
    subject: `Mesaj nou de contact: ${name}`,
    html: baseLayout({
      preheader: `${name} ți-a trimis un mesaj prin formularul de contact.`,
      heading: 'Mesaj nou de contact 📬',
      bodyHtml,
    }),
  }
}
