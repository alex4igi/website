import { integer, jsonb, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
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

// Rapoartele CSP de la site, qapp v2 și portal (colector `/api/csp-report`). Agregate:
// un rând pe (aplicație, directivă, origine blocată, pagină), cu numărătoare — nu un rând pe vizită.
export const cspReports = pgTable(
  'csp_reports',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    app: text('app').notNull(),
    directive: text('directive').notNull(),
    blocked: text('blocked').notNull(),
    page: text('page').notNull(),
    n: integer('n').notNull().default(1),
    firstSeen: timestamp('first_seen', { withTimezone: true }).defaultNow().notNull(),
    lastSeen: timestamp('last_seen', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex('csp_reports_key').on(t.app, t.directive, t.blocked, t.page)],
)
