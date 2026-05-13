const COOKIE_NAME = 'qd_admin'

function getSecret() {
  const secret = process.env.ADMIN_AUTH_SECRET
  if (!secret) throw new Error('ADMIN_AUTH_SECRET is not set')
  return secret
}

export function adminCookieName() {
  return COOKIE_NAME
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) throw new Error('ADMIN_PASSWORD is not set')
  return constantTimeEqual(input, expected)
}

async function hmacHex(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function issueSessionToken(): Promise<string> {
  const issuedAt = Date.now().toString()
  const sig = await hmacHex(issuedAt, getSecret())
  return `${issuedAt}.${sig}`
}

export async function verifySessionToken(
  token: string | undefined,
  maxAgeMs = 1000 * 60 * 60 * 24 * 30,
): Promise<boolean> {
  if (!token) return false
  const [issuedAt, sig] = token.split('.')
  if (!issuedAt || !sig) return false
  let expected: string
  try {
    expected = await hmacHex(issuedAt, getSecret())
  } catch {
    return false
  }
  if (!constantTimeEqual(sig, expected)) return false
  const age = Date.now() - Number(issuedAt)
  return age >= 0 && age < maxAgeMs
}
