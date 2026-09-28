// Campania de recomandări din CRM (qapp). CRM-ul e sursa unică pentru termen și sumă:
// la începutul primei vacanțe campania se închide singură — pagina /recomandari face
// redirect, iar câmpul „Cine te-a invitat?" dispare din formulare, fără redeploy.
const CRM_ENDPOINT =
  'https://cbftxkwvoboqahzsldcp.supabase.co/functions/v1/intake-website-lead'

// Trebuie să fie identic cu numele din `ALLOWED_CAMPAIGNS` (app/api/inscriere/route.ts).
export const CAMPANIE_RECOMANDARI = 'Recomandări toamna 2026'

export type CampanieRecomandare = {
  activa: true
  nume: string
  data_limita: string
  recompensa_lei: number
}

export async function getCampanieRecomandare(): Promise<CampanieRecomandare | null> {
  try {
    const res = await fetch(CRM_ENDPOINT, {
      method: 'GET',
      headers: process.env.INTAKE_SECRET ? { 'x-intake-secret': process.env.INTAKE_SECRET } : {},
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.activa === true ? (data as CampanieRecomandare) : null
  } catch {
    // CRM-ul nu răspunde → câmpul nu apare. Un formular fără el nu pierde leadul.
    return null
  }
}

export function formatDataRo(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
