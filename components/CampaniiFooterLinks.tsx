'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { CAMPANIE_RECOMANDARI } from '@/lib/recomandari'
import { CAMPAIGN_ID as VL_CAMPAIGN_ID, LP_PATH as VL_LP_PATH } from '@/app/valea-lupului/campaign'

/**
 * Linkurile din footer către campaniile pornite din qapp (DANCE WITH ME, preînscrierile
 * Valea Lupului) — ca cine a plecat de pe landing să aibă pe orice pagină drumul înapoi.
 *
 * Fiecare apare doar cât campania ei e deschisă în CRM; se închide acolo și dispare de aici,
 * fără redeploy. Starea se cere din browser (/api/campanii), pentru că footer-ul e prerandat.
 */
type Stare = { dance_with_me: boolean; valea_lupului: string }

const VL_HREF = `${VL_LP_PATH}?${new URLSearchParams({
  utm_source: 'site',
  utm_medium: 'footer',
  utm_campaign: VL_CAMPAIGN_ID,
}).toString()}`

const linkClass =
  'inline-flex items-center gap-1.5 text-[#f8ef21]/85 hover:text-[#f8ef21] text-sm font-semibold transition-colors duration-200'

export default function CampaniiFooterLinks() {
  const [stare, setStare] = useState<Stare | null>(null)

  useEffect(() => {
    let anulat = false
    fetch('/api/campanii')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!anulat && d) setStare(d as Stare)
      })
      .catch(() => {})
    return () => {
      anulat = true
    }
  }, [])

  if (!stare) return null

  return (
    <>
      {stare.dance_with_me && (
        <li>
          <Link href="/dance-with-me" className={linkClass}>
            <Sparkles size={13} aria-hidden="true" />
            {CAMPANIE_RECOMANDARI}
          </Link>
        </li>
      )}
      {stare.valea_lupului === 'activa' && (
        <li>
          <Link href={VL_HREF} className={linkClass}>
            <Sparkles size={13} aria-hidden="true" />
            Valea Lupului · preînscrieri
          </Link>
        </li>
      )}
    </>
  )
}
