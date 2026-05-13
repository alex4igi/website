import { getPricing } from '@/lib/db'
import PricingEditor from './pricing-editor'

export default async function AdminPricingPage() {
  const data = await getPricing()
  return <PricingEditor initialData={data} />
}
