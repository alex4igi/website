'use client'

import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import {
  PROMO_COPY,
  promoHref,
  trackPromo,
  useCampaignPromo,
} from '@/lib/campaign-promo'

/**
 * Banda care duce de pe homepage la LP-ul campaniei, cât timp campania e în fereastra
 * din `lib/campaign-promo.ts`. E perechea permanentă a pop-up-ului: cine îl închide,
 * sau cine îl are blocat, tot dă peste campanie derulând pagina.
 *
 * În afara ferestrei nu randează nimic, deci homepage-ul revine singur la forma lui.
 */
export default function CampaignStripSection() {
  const active = useCampaignPromo()
  if (!active) return null

  return (
    <section className="bg-[#231f20] px-5 py-10 md:px-8 md:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-3xl border border-[#f8ef21]/25 bg-[#f8ef21]/[0.06] p-7 md:flex-row md:items-center md:justify-between md:p-9">
        <div>
          <span
            className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.14em] text-[#f8ef21] uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {PROMO_COPY.eyebrow}
          </span>
          <h2
            className="mt-3 text-2xl leading-tight font-extrabold text-white md:text-3xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Back to Dance School — <span className="text-[#f8ef21]">săptămâna porților deschise</span>
          </h2>
          <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
            {PROMO_COPY.short} Fără plată, fără contract — hotărâți după ce copilul a dansat o oră.
          </p>
        </div>

        <Link
          href={promoHref('homepage')}
          onClick={() => trackPromo('btds_promo_click', 'homepage')}
          className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-full bg-[#f8ef21] px-7 py-3.5 text-sm font-bold text-[#231f20] transition-colors hover:bg-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {PROMO_COPY.cta}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
