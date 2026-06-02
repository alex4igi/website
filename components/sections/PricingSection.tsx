import SprayLabel from '@/components/ui/spray-label'
import { getPricing } from '@/lib/db'
import { defaultPricingData } from '@/lib/db/defaults'
import type { PricingData } from '@/lib/db/types'

async function fetchPricing(): Promise<PricingData> {
  try {
    return await getPricing()
  } catch (err) {
    console.error('[PricingSection] fallback to defaults:', err)
    return defaultPricingData
  }
}

function formatPrice(lei: number) {
  return lei.toLocaleString('ro-RO')
}

// Preț lunar afișat mare. Fallback: preț anual / 10 luni (sept–iunie).
function monthlyPrice(plan: { priceMonthly?: number; priceStandard: number }) {
  return plan.priceMonthly && plan.priceMonthly > 0
    ? plan.priceMonthly
    : Math.round(plan.priceStandard / 10)
}

// Preț per ședință — „ca la magazine, preț/100g": preț anual / nr. ședințe.
function pricePerSession(plan: { priceStandard: number; sessionsPerYear: number }) {
  if (!plan.sessionsPerYear) return 0
  return Math.round(plan.priceStandard / plan.sessionsPerYear)
}

export default async function PricingSection() {
  const data = await fetchPricing()
  const sortedPlans = [...data.plans].sort((a, b) => a.displayOrder - b.displayOrder)

  return (
    <section id="preturi" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-4"><SprayLabel>Prețuri</SprayLabel></div>
          <h2
            className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Oferta educațională
            <br />
            <span className="text-[#231f20]/40">{data.academicYearLabel}</span>
          </h2>
          <p className="text-[#6b6b6b] mt-4 max-w-2xl">
            Prețuri afișate <strong className="text-[#231f20]">lunar</strong>, cu prețul per
            ședință alături — transparent, ca să compari ușor. Taxă rezervare loc în grupă:{' '}
            <strong className="text-[#231f20]">{formatPrice(data.reservationFee)} lei</strong>.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {sortedPlans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl p-6 flex flex-col gap-4 border-2 border-[#e5e5e5] bg-white card-lift"
            >
              <div>
                <div
                  className="text-xs font-bold uppercase tracking-wider text-[#6b6b6b] mb-1"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {plan.ageGroup} · {plan.level}
                </div>
                <h3
                  className="text-[#231f20] text-xl font-extrabold leading-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {plan.name}
                </h3>
              </div>

              <p className="text-[#6b6b6b] text-sm leading-relaxed flex-1">{plan.description}</p>

              <div className="border-t border-[#e5e5e5] pt-4 flex flex-col gap-1">
                {/* Preț lunar — headline */}
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="text-4xl font-extrabold text-[#231f20] leading-none"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {formatPrice(monthlyPrice(plan))}
                  </span>
                  <span
                    className="text-base font-bold text-[#231f20]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    lei
                  </span>
                  <span className="text-sm font-semibold text-[#6b6b6b]">/ lună</span>
                </div>
                {/* Preț per ședință — unitate transparentă, ca preț/100g */}
                <div className="text-sm font-medium text-[#6b6b6b]">
                  ≈ {formatPrice(pricePerSession(plan))} lei / ședință
                </div>
              </div>

              <a
                href="/#inscriere"
                className="mt-2 text-center font-bold text-sm px-5 py-3 rounded-full bg-[#231f20] text-white hover:bg-[#3a3637] transition-all duration-200"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Rezervă loc
              </a>
            </div>
          ))}
        </div>

        {sortedPlans.length === 0 && (
          <div className="text-center py-12 text-[#6b6b6b]">
            Planurile vor fi disponibile în curând.
          </div>
        )}
      </div>
    </section>
  )
}
