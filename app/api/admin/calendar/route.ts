import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { getCalendar, saveCalendar } from '@/lib/db'
import { calendarDataSchema } from '@/lib/db/types'

export async function GET() {
  const data = await getCalendar()
  return NextResponse.json(data)
}

export async function PUT(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = calendarDataSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation_failed', details: parsed.error.flatten() }, { status: 400 })
  }

  await saveCalendar(parsed.data)
  revalidateTag('calendar', 'max')
  return NextResponse.json({ ok: true })
}
