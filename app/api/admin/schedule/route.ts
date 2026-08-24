import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSchedule, saveSchedule } from '@/lib/db'
import { scheduleDataSchema } from '@/lib/db/types'

export async function GET() {
  const data = await getSchedule()
  return NextResponse.json(data)
}

export async function PUT(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = scheduleDataSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation_failed', details: parsed.error.flatten() }, { status: 400 })
  }

  await saveSchedule(parsed.data)
  // Orarul e randat doar aici; împingem noua versiune în cache-ul de edge imediat.
  revalidatePath('/orar')
  return NextResponse.json({ ok: true })
}
