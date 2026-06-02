import 'dotenv/config'
import { savePricing, saveCalendar, saveSchedule, getPricing, getCalendar, getSchedule } from '../lib/db'
import { defaultPricingData, defaultCalendarData, defaultScheduleData } from '../lib/db/defaults'

async function main() {
  console.log('Seeding pricing + calendar + schedule with default Quasar data...')

  const existingPricing = await getPricing().catch(() => null)
  const existingCalendar = await getCalendar().catch(() => null)
  const existingSchedule = await getSchedule().catch(() => null)

  if (existingPricing && existingPricing.plans.length > 0) {
    console.log('• Pricing already has data — skipping.')
  } else {
    await savePricing(defaultPricingData)
    console.log(`• Seeded pricing with ${defaultPricingData.plans.length} plans.`)
  }

  if (existingCalendar && existingCalendar.modules.length > 0) {
    console.log('• Calendar already has data — skipping.')
  } else {
    await saveCalendar(defaultCalendarData)
    console.log(
      `• Seeded calendar: ${defaultCalendarData.modules.length} modules, ${defaultCalendarData.vacations.length} vacations, ${defaultCalendarData.events.length} events.`,
    )
  }

  if (existingSchedule && existingSchedule.locations.length > 0) {
    console.log('• Schedule already has data — skipping.')
  } else {
    await saveSchedule(defaultScheduleData)
    console.log(`• Seeded schedule: ${defaultScheduleData.locations.length} locations.`)
  }

  console.log('Done.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
