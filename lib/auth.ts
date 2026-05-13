import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'qd_admin'

function getSecret() {
  const secret = process.env.ADMIN_AUTH_SECRET
  if (!secret) throw new Error('ADMIN_AUTH_SECRET is not set')
  return secret
}

export function adminCookieName() {
  return COOKIE_NAME
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) throw new Error('ADMIN_PASSWORD is not set')
  const a = Buffer.from(input)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export function issueSessionToken() {
  const issuedAt = Date.now().toString()
  const sig = createHmac('sha256', getSecret()).update(issuedAt).digest('hex')
  return `${issuedAt}.${sig}`
}

export function verifySessionToken(token: string | undefined, maxAgeMs = 1000 * 60 * 60 * 24 * 30) {
  if (!token) return false
  const [issuedAt, sig] = token.split('.')
  if (!issuedAt || !sig) return false
  const expected = createHmac('sha256', getSecret()).update(issuedAt).digest('hex')
  try {
    const a = Buffer.from(sig, 'hex')
    const b = Buffer.from(expected, 'hex')
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false
  } catch {
    return false
  }
  const age = Date.now() - Number(issuedAt)
  return age >= 0 && age < maxAgeMs
}
