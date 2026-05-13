import { z } from 'zod'

// --- Pricing ---

export const pricingPlanSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
  ageGroup: z.string().min(1),
  level: z.string().min(1),
  sessionsPerYear: z.number().int().positive(),
  durationMinutes: z.number().int().positive(),
  priceEarlyBird: z.number().int().nonnegative(),
  priceStandard: z.number().int().nonnegative(),
  displayOrder: z.number().int(),
})

export const pricingDataSchema = z.object({
  academicYearLabel: z.string().min(1),
  earlyBirdDeadline: z.string(),
  reservationFee: z.number().int().nonnegative(),
  plans: z.array(pricingPlanSchema),
})

export type PricingPlan = z.infer<typeof pricingPlanSchema>
export type PricingData = z.infer<typeof pricingDataSchema>

// --- Calendar ---

export const calendarModuleSchema = z.object({
  id: z.string(),
  number: z.number().int().min(1).max(20),
  label: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  weeks: z.number().int().positive(),
})

export const calendarVacationSchema = z.object({
  id: z.string(),
  label: z.string(),
  startDate: z.string(),
  endDate: z.string(),
})

export const calendarEventSchema = z.object({
  id: z.string(),
  date: z.string(),
  type: z.enum(['spectacol', 'concurs', 'special']),
  title: z.string().min(1),
  description: z.string().optional().default(''),
})

export const calendarDataSchema = z.object({
  yearLabel: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  modules: z.array(calendarModuleSchema),
  vacations: z.array(calendarVacationSchema),
  events: z.array(calendarEventSchema),
})

export type CalendarModule = z.infer<typeof calendarModuleSchema>
export type CalendarVacation = z.infer<typeof calendarVacationSchema>
export type CalendarEvent = z.infer<typeof calendarEventSchema>
export type CalendarData = z.infer<typeof calendarDataSchema>
