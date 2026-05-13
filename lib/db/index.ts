import { neon } from '@neondatabase/serverless'
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http'
import { eq } from 'drizzle-orm'
import * as schema from './schema'
import { defaultCalendarData, defaultPricingData } from './defaults'
import type { CalendarData, PricingData } from './types'

let _db: NeonHttpDatabase<typeof schema> | null = null

function getDb() {
  if (_db) return _db
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not set. Provision Neon via Vercel Marketplace and add the connection string to .env.local',
    )
  }
  const sql = neon(process.env.DATABASE_URL)
  _db = drizzle(sql, { schema })
  return _db
}

export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop) {
    return Reflect.get(getDb(), prop)
  },
})

export async function getPricing(): Promise<PricingData> {
  const rows = await getDb().select().from(schema.pricing).where(eq(schema.pricing.id, 1)).limit(1)
  return rows[0]?.data ?? defaultPricingData
}

export async function getCalendar(): Promise<CalendarData> {
  const rows = await getDb().select().from(schema.calendar).where(eq(schema.calendar.id, 1)).limit(1)
  return rows[0]?.data ?? defaultCalendarData
}

export async function savePricing(data: PricingData) {
  await getDb()
    .insert(schema.pricing)
    .values({ id: 1, data, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: schema.pricing.id,
      set: { data, updatedAt: new Date() },
    })
}

export async function saveCalendar(data: CalendarData) {
  await getDb()
    .insert(schema.calendar)
    .values({ id: 1, data, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: schema.calendar.id,
      set: { data, updatedAt: new Date() },
    })
}
