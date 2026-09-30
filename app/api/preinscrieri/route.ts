import { NextResponse } from 'next/server'
import { QAPP_CAMPAIGN } from '@/app/valea-lupului/campaign'
import { getStarePreinscriere } from '@/lib/preinscrieri'

// Pentru pop-up-ul de pe tot site-ul: paginile sunt prerandate, deci starea se cere din
// browser. Răspunsul se ține în cache un minut — cât durează și propagarea din qapp.
export const revalidate = 60

export async function GET() {
  const stare = (await getStarePreinscriere(QAPP_CAMPAIGN)) ?? 'nepornita'
  return NextResponse.json({ valea_lupului: stare })
}
