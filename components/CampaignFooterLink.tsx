'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import {
  PROMO_COPY,
  promoHref,
  trackPromo,
  useCampaignPromo,
} from '@/lib/campaign-promo'

/**
 * Linkul campaniei din footer — a patra intrare către LP, prezentă pe toate paginile.
 *
 * Footer-ul e o componentă de server, dar fereastra campaniei se poate verifica doar pe
 * client (vezi lib/campaign-promo.ts), de aceea linkul stă separat, într-un `<li>` al lui.
 * În afara ferestrei nu randează nimic, deci nu rămâne agățat în footer un link către o
 * campanie încheiată.
 */
export default function CampaignFooterLink() {
  const active = useCampaignPromo()
  if (!active) return null

  return (
    <li>
      <Link
        href={promoHref('footer')}
        onClick={() => trackPromo('btds_promo_click', 'footer')}
        className="inline-flex items-center gap-1.5 text-[#f8ef21]/85 hover:text-[#f8ef21] text-sm font-semibold transition-colors duration-200"
      >
        <Sparkles size={13} aria-hidden="true" />
        {PROMO_COPY.navLabel} · {PROMO_COPY.dateShort}
      </Link>
    </li>
  )
}
