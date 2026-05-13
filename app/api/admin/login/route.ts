import { NextResponse } from 'next/server'
import { adminCookieName, checkPassword, issueSessionToken } from '@/lib/auth'

export async function POST(req: Request) {
  let body: { password?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  if (!body.password || !checkPassword(body.password)) {
    return NextResponse.json({ error: 'invalid_password' }, { status: 401 })
  }

  const token = issueSessionToken()
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
