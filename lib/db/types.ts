import { z } from 'zod'

// --- Pricing ---

export const pricingPlanSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
  ageGroup: z.string().min(1),
  // Level/difficulty. Optional — for summer per-session courses (Open, KPOP,
  // Zumba) the level may not apply, so the admin can leave it blank.
  level: z.string().default(''),
  // Headline price unit. 'lunar' shows „/ lună", 'sedinta' shows „/ ședință".
  priceMode: z.enum(['lunar', 'sedinta']).default('lunar'),
  // Headline price (large font on the card). Meaning follows priceMode:
  // lei/lună for 'lunar', lei/ședință for 'sedinta'.
  priceMonthly: z.number().int().nonnegative().default(0),
  // Manual price subtitle shown under the headline (e.g. „≈ 45 lei / ședință").
  // Free text written by the admin — nothing is computed. Empty = hidden.
  priceNote: z.string().default(''),
  // Annual price + sessions/year — informational only, detailed by the admin
  // inside the description. No longer drive any displayed value.
  sessionsPerYear: z.number().int().positive().optional(),
  durationMinutes: z.number().int().positive(),
  priceStandard: z.number().int().nonnegative().optional(),
  // Re-enrollment ("early-bird") price. Not shown publicly — reserved for the
  // separate re-enrollment landing page (May). Kept so the data persists.
  priceEarlyBird: z.number().int().nonnegative().default(0),
  displayOrder: z.number().int(),
})

export const pricingDataSchema = z.object({
  // Anul școlar nu se mai afișează public — păstrat opțional pentru compat.
  academicYearLabel: z.string().default(''),
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
  // Anul școlar nu se mai afișează public — păstrat opțional pentru compat.
  yearLabel: z.string().default(''),
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

// --- Weekly schedule (orar săptămânal) ---
// Locație → studio(uri) → ore. Fiecare oră are un nivel (culoare în orar).

export const scheduleDays = ['lu', 'ma', 'mi', 'jo', 'vi', 'sa', 'du'] as const
export const scheduleLevels = ['incepator', 'intermediar', 'mixt', 'avansat'] as const

export const scheduleDaySchema = z.enum(scheduleDays)
export const scheduleLevelSchema = z.enum(scheduleLevels)

export const scheduleClassSchema = z.object({
  id: z.string(),
  day: scheduleDaySchema,
  discipline: z.string().min(1),
  ageGroup: z.string().default(''),
  startTime: z.string().default(''),
  endTime: z.string().default(''),
  level: scheduleLevelSchema.default('incepator'),
})

export const scheduleStudioSchema = z.object({
  id: z.string(),
  name: z.string().default(''),
  classes: z.array(scheduleClassSchema),
})

export const scheduleLocationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  phone: z.string().default(''),
  displayOrder: z.number().int().default(0),
  studios: z.array(scheduleStudioSchema),
})

export const scheduleDataSchema = z.object({
  note: z.string().default(''),
  locations: z.array(scheduleLocationSchema),
})

export type ScheduleDay = z.infer<typeof scheduleDaySchema>
export type ScheduleLevel = z.infer<typeof scheduleLevelSchema>
export type ScheduleClass = z.infer<typeof scheduleClassSchema>
export type ScheduleStudio = z.infer<typeof scheduleStudioSchema>
export type ScheduleLocation = z.infer<typeof scheduleLocationSchema>
export type ScheduleData = z.infer<typeof scheduleDataSchema>
