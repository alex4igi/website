import 'dotenv/config'
import { savePricing, saveCalendar, getPricing, getCalendar } from '../lib/db'
import { defaultPricingData, defaultCalendarData } from '../lib/db/defaults'

async function main() {
  console.log('Seeding pricing + calendar with default Quasar data...')

  const existingPricing = await getPricing().catch(() => null)
  const existingCalendar = await getCalendar().catch(() => null)

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

  console.log('Done.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
