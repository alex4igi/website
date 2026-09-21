// Verificarea Cloudflare Turnstile, pe server. Un token e de UNICĂ folosință: a doua
// verificare a aceluiași token întoarce `timeout-or-duplicate`. De-aia se validează
// într-un singur loc (aici) și formularul își reîncarcă widgetul după orice trimitere.
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

// Activ doar cu AMBELE chei. Cu doar secretul, serverul ar cere un token pe care
// formularul — fără cheia publică, deci fără widget — nu l-ar genera niciodată:
// toate înscrierile ar pica. Fără chei, codul e adormit și totul merge ca înainte.
export const turnstileActiv = Boolean(
  process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
)

/**
 * - `ok`: token valid, cererea merge mai departe.
 * - `respins`: token lipsă, invalid, expirat sau deja folosit. Se refuză MEREU.
 * - `indisponibil`: nu am putut întreba Cloudflare (rețea, 5xx, `internal-error`).
 *   Doar aici fiecare endpoint decide singur: fail-open sau fail-closed.
 */
export type VerdictTurnstile = 'ok' | 'respins' | 'indisponibil'

export async function verificaTurnstile(
  token: unknown,
  ip?: string | null,
): Promise<VerdictTurnstile> {
  if (typeof token !== 'string' || !token || token.length > 2048) return 'respins'
  try {
    const res = await fetch(SITEVERIFY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY ?? '',
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) {
      console.error(`[turnstile] siteverify HTTP ${res.status}`)
      return 'indisponibil'
    }
    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] }
    if (data.success) return 'ok'
    const coduri = data['error-codes'] ?? []
    if (coduri.includes('internal-error')) return 'indisponibil'
    console.warn('[turnstile] respins:', coduri.join(', ') || '(fără cod)')
    return 'respins'
  } catch (e) {
    console.error('[turnstile] siteverify indisponibil:', e instanceof Error ? e.message : e)
    return 'indisponibil'
  }
}
