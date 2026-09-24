import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

// Colectorul de rapoarte CSP pentru site, qapp v2 și portal. Endpoint public (browserele
// trimit fără autentificare), deci: păstrăm doar originea blocată și calea paginii (niciun
// query string — acolo stau gclid/fbclid și tokenurile de semnare), agregăm într-un rând
// pe cheie și nu mai creăm chei noi peste MAX_ROWS, ca să nu poată fi umflat.

const MAX_ROWS = 500
const MAX_BODY = 64 * 1024

const APPS: Record<string, string> = {
  'www.quasardance.ro': 'site',
  'quasardance.ro': 'site',
  'qapp-v2.vercel.app': 'qapp',
  'membri.quasardance.ro': 'portal',
}
const CROSS_ORIGINS = ['https://qapp-v2.vercel.app', 'https://membri.quasardance.ro']

type Report = { page: string; directive: string; blocked: string }

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? ''
  if (!CROSS_ORIGINS.includes(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
    Vary: 'Origin',
  }
}

// Tokenurile din cale (`/semneaza/<token>`, id-uri) ar face din fiecare vizită o cheie nouă
// și ar ajunge în bază; le reducem la un marcaj.
function normalizePath(pathname: string): string {
  const segs = pathname.split('/').map((seg, i, all) => {
    if (i > 0 && ['semneaza', 's'].includes(all[i - 1])) return ':token'
    if (/^[0-9a-f-]{16,}$/i.test(seg) || /^\d+$/.test(seg) || seg.length > 40) return ':id'
    return seg
  })
  return segs.join('/').slice(0, 120) || '/'
}

function normalizeBlocked(raw: string): string | null {
  const v = raw.trim()
  if (!v) return 'necunoscut'
  if (/^(chrome|moz|safari-web|ms-browser)-extension:/i.test(v)) return null
  try {
    const u = new URL(v)
    if (u.protocol === 'http:' || u.protocol === 'https:' || u.protocol === 'wss:') return u.origin
    return u.protocol.replace(':', '')
  } catch {
    return v.toLowerCase().replace(/[^a-z-]/g, '').slice(0, 40) || 'necunoscut'
  }
}

function toReport(page: unknown, directive: unknown, blocked: unknown): (Report & { app: string }) | null {
  if (typeof page !== 'string') return null
  let url: URL
  try {
    url = new URL(page)
  } catch {
    return null
  }
  const app = APPS[url.hostname]
  if (!app) return null
  const dir = String(directive ?? '').split(' ')[0].toLowerCase()
  if (!/^[a-z-]{3,40}$/.test(dir)) return null
  const b = normalizeBlocked(String(blocked ?? ''))
  if (!b) return null
  return { app, page: normalizePath(url.pathname), directive: dir, blocked: b }
}

// Două formate: `report-uri` (application/csp-report, un obiect) și Reporting API
// (application/reports+json, o listă).
function parse(body: unknown): (Report & { app: string })[] {
  if (Array.isArray(body)) {
    return body
      .filter((r) => r?.type === 'csp-violation' && r.body)
      .map((r) => toReport(r.body.documentURL ?? r.url, r.body.effectiveDirective, r.body.blockedURL))
      .filter((r): r is Report & { app: string } => r !== null)
      .slice(0, 20)
  }
  const r = (body as { 'csp-report'?: Record<string, unknown> })?.['csp-report']
  if (!r) return []
  const one = toReport(
    r['document-uri'],
    r['effective-directive'] ?? r['violated-directive'],
    r['blocked-uri'],
  )
  return one ? [one] : []
}

export async function OPTIONS(req: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(req) })
}

export async function POST(req: Request) {
  const headers = corsHeaders(req)
  try {
    const text = await req.text()
    if (text.length > MAX_BODY) return new Response(null, { status: 204, headers })
    for (const r of parse(JSON.parse(text))) {
      await db.execute(sql`
        with upd as (
          update csp_reports set n = n + 1, last_seen = now()
          where app = ${r.app} and directive = ${r.directive} and blocked = ${r.blocked} and page = ${r.page}
          returning 1
        )
        insert into csp_reports (app, directive, blocked, page)
        select ${r.app}, ${r.directive}, ${r.blocked}, ${r.page}
        where not exists (select 1 from upd)
          and (select count(*) from csp_reports) < ${MAX_ROWS}
        on conflict do nothing
      `)
    }
  } catch (e) {
    console.error('[csp-report]', e instanceof Error ? e.message : e)
  }
  return new Response(null, { status: 204, headers })
}
