import { getPricing } from '@/lib/db'
import PricingEditor from './pricing-editor'

export const dynamic = 'force-dynamic'

export default async function AdminPricingPage() {
  const data = await getPricing()
  return <PricingEditor initialData={data} />
}
