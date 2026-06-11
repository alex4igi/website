// Validări partajate între client (UX imediat) și server (sursa de adevăr).

// Normalizează un telefon mobil RO la formatul +40… sau întoarce null dacă e invalid.
// Reguli: după eliminarea prefixului trebuie să rămână 9 cifre care încep cu 7.
export function normalizePhoneRO(raw: string): string | null {
  let d = raw.replace(/[^\d+]/g, '').replace(/^\+/, '')
  if (d.startsWith('0040')) d = d.slice(4)
  else if (d.startsWith('40')) d = d.slice(2)
  else if (d.startsWith('0')) d = d.slice(1)
  return /^7\d{8}$/.test(d) ? `+40${d}` : null
}

// Validare email simplă, suficientă pentru un formular public.
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}
