// Starea campaniilor de preînscriere (Valea Lupului, 2026). Sursa e CRM-ul (qapp): acolo
// Alex pornește și închide campania, fără redeploy. Pagina, pop-up-ul și formularul
// ascultă toate de starea asta; intake-ul refuză oricum o preînscriere în afara ei.
const CRM_ENDPOINT =
  'https://cbftxkwvoboqahzsldcp.supabase.co/functions/v1/intake-website-lead'

export type StarePreinscriere = 'nepornita' | 'activa' | 'inchisa'

/**
 * `null` = CRM-ul nu a răspuns. Apelanții îl tratează ca „nepornită": mai bine un pop-up
 * care lipsește un minut decât un formular care promite ce nu putem primi.
 */
export async function getStarePreinscriere(nume: string): Promise<StarePreinscriere | null> {
  try {
    const res = await fetch(CRM_ENDPOINT, {
      method: 'GET',
      headers: process.env.INTAKE_SECRET ? { 'x-intake-secret': process.env.INTAKE_SECRET } : {},
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const data = (await res.json()) as { preinscrieri?: { nume: string; stare: StarePreinscriere }[] }
    return data.preinscrieri?.find((c) => c.nume === nume)?.stare ?? null
  } catch {
    return null
  }
}
