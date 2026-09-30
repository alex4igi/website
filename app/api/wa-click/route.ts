// Un click pe WhatsApp: codul pus în mesajul precompletat + de unde a venit vizitatorul
// (vezi components/SiteTracking.tsx). Trece mai departe la CRM, server-server, cu același
// secret ca înscrierile; recepția leagă apoi leadul de click după cod.
// Răspunde mereu 204: browserul (sendBeacon) oricum nu citește răspunsul, iar mesajul
// de WhatsApp pleacă și fără atribuire.

const CRM_ENDPOINT = 'https://cbftxkwvoboqahzsldcp.supabase.co/functions/v1/intake-wa-click'

const COD_RE = /^[A-HJ-NP-Z2-9]{5}$/

const cap = (v: unknown, max = 200): string | null => {
  const t = typeof v === 'string' ? v.trim() : ''
  return t ? t.slice(0, max) : null
}

export async function POST(req: Request) {
  const done = new Response(null, { status: 204 })
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return done
  }
  const cod = typeof body.cod === 'string' ? body.cod.trim().toUpperCase() : ''
  if (!COD_RE.test(cod) || !process.env.INTAKE_SECRET) return done

  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip')
  try {
    const res = await fetch(CRM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-intake-secret': process.env.INTAKE_SECRET,
        ...(clientIp ? { 'x-client-ip': clientIp } : {}),
      },
      body: JSON.stringify({
        cod,
        pagina: cap(body.pagina),
        referrer_host: cap(body.referrer_host),
        utm_source: cap(body.utm_source),
        utm_medium: cap(body.utm_medium),
        utm_campaign: cap(body.utm_campaign),
        utm_content: cap(body.utm_content),
        gclid: cap(body.gclid, 300),
      }),
    })
    if (!res.ok) console.error(`[wa-click] CRM ${res.status}:`, await res.text().catch(() => ''))
  } catch (err) {
    console.error('[wa-click] CRM indisponibil:', err instanceof Error ? err.message : err)
  }
  return done
}
