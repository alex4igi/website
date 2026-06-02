import { integer, jsonb, pgTable, timestamp } from 'drizzle-orm/pg-core'
import type { CalendarData, PricingData, ScheduleData } from './types'

// Singleton tables: each holds a single row (id = 1) with the entire section as JSON.
// This keeps the schema stable and lets the admin UI edit the whole section atomically.

export const pricing = pgTable('pricing', {
  id: integer('id').primaryKey().default(1),
  data: jsonb('data').$type<PricingData>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const calendar = pgTable('calendar', {
  id: integer('id').primaryKey().default(1),
  data: jsonb('data').$type<CalendarData>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const schedule = pgTable('schedule', {
  id: integer('id').primaryKey().default(1),
  data: jsonb('data').$type<ScheduleData>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})
