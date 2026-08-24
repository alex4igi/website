import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getPricing, savePricing } from '@/lib/db'
import { pricingDataSchema } from '@/lib/db/types'

export async function GET() {
  const data = await getPricing()
  return NextResponse.json(data)
}

export async function PUT(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = pricingDataSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation_failed', details: parsed.error.flatten() }, { status: 400 })
  }

  await savePricing(parsed.data)
  // <PricingSection /> e randată în ambele pagini — altfel una rămâne cu prețuri vechi.
  revalidatePath('/')
  revalidatePath('/program-si-preturi')
  return NextResponse.json({ ok: true })
}
