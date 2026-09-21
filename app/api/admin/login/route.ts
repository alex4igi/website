import { NextResponse } from 'next/server'
import { adminCookieName, checkPassword, issueSessionToken } from '@/lib/auth'
import { turnstileActiv, verificaTurnstile } from '@/lib/turnstile'

export async function POST(req: Request) {
  let body: { password?: string; turnstile_token?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  // Fail-closed: e o parolă unică pentru tot adminul site-ului. Dacă nu putem verifica,
  // nu intră nimeni — mai bine un admin care reîncearcă decât o ușă nepăzită.
  if (turnstileActiv) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null
    const verdict = await verificaTurnstile(body.turnstile_token, ip)
    if (verdict === 'respins') {
      return NextResponse.json({ error: 'turnstile' }, { status: 400 })
    }
    if (verdict === 'indisponibil') {
      return NextResponse.json({ error: 'turnstile_indisponibil' }, { status: 503 })
    }
  }

  if (!body.password || !checkPassword(body.password)) {
    return NextResponse.json({ error: 'invalid_password' }, { status: 401 })
  }

  const token = await issueSessionToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: adminCookieName(),
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return res
}
