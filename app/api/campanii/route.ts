import { NextResponse } from 'next/server'
import { QAPP_CAMPAIGN } from '@/app/valea-lupului/campaign'
import { getStarePreinscriere } from '@/lib/preinscrieri'
import { getCampanieRecomandare } from '@/lib/recomandari'

// Pentru linkurile din footer: paginile sunt prerandate, deci starea campaniilor se cere din
// browser. Ambele vin din același GET al CRM-ului; aici doar le punem laolaltă.
export const revalidate = 60

export async function GET() {
  const [recomandare, valeaLupului] = await Promise.all([
    getCampanieRecomandare(),
    getStarePreinscriere(QAPP_CAMPAIGN),
  ])
  return NextResponse.json({
    dance_with_me: recomandare !== null,
    dance_with_me_pana: recomandare?.data_limita ?? null,
    valea_lupului: valeaLupului ?? 'nepornita',
  })
}
