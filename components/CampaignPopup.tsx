'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { loadConsent } from '@/lib/consent'
import {
  PROMO_COPY,
  PROMO_DISMISS_KEY,
  PROMO_SNOOZE_DAYS,
  promoHref,
  trackPromo,
  useCampaignPromo,
} from '@/lib/campaign-promo'

/** După atâtea milisecunde pe pagină apare pop-up-ul, dacă nu s-a derulat destul înainte. */
const DELAY_MS = 7000
/** …sau imediat ce vizitatorul a derulat atâta din pagină: a rămas, deci merită întrerupt. */
const SCROLL_TRIGGER = 0.35

/**
 * Paginile pe care pop-up-ul nu are ce căuta: LP-ul campaniei (omul e deja acolo),
 * pagina de mulțumire (tocmai a lăsat lead-ul) și adminul.
 */
const EXCLUDED_PREFIXES = ['/back-to-dance-school', '/admin']

type Dismissal = { at: number; converted?: boolean }

function isSnoozed(): boolean {
  try {
    const raw = window.localStorage.getItem(PROMO_DISMISS_KEY)
    if (!raw) return false
    const d = JSON.parse(raw) as Dismissal
    // Cine a apăsat pe CTA a văzut deja LP-ul — nu-l mai oprim a doua oară.
    if (d.converted) return true
    return Date.now() - d.at < PROMO_SNOOZE_DAYS * 24 * 60 * 60 * 1000
  } catch {
    // localStorage blocat (mod privat, setări stricte): mai bine nu deranjăm deloc.
    return true
  }
}

function remember(converted: boolean) {
  try {
    const value: Dismissal = { at: Date.now(), converted }
    window.localStorage.setItem(PROMO_DISMISS_KEY, JSON.stringify(value))
  } catch {
    /* fără memorie locală pop-up-ul reapare la următoarea sesiune — acceptabil */
  }
}

/**
 * Pop-up-ul care duce traficul organic al site-ului către campania „Back to Dance School",
 * între datele din `lib/campaign-promo.ts`.
 *
 * Nu se deschide decât după ce vizitatorul a răspuns la banner-ul de cookie-uri: acela
 * stă pe z-[60], adică peste dialog, așa că două ferestre suprapuse s-ar bloca reciproc.
 */
export default function CampaignPopup() {
  const active = useCampaignPromo()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const eligible =
    active && !EXCLUDED_PREFIXES.some((p) => pathname?.startsWith(p))

  useEffect(() => {
    if (!eligible || isSnoozed()) return

    let timer: ReturnType<typeof setTimeout> | undefined
    let consentPoll: ReturnType<typeof setInterval> | undefined
    let cleanupScroll: (() => void) | undefined

    // Pop-up-ul se deschide la primul dintre cele două semnale: fie a stat destul pe
    // pagină, fie a derulat destul cât să arate că îl interesează ce citește.
    const start = () => {
      const fire = () => {
        cleanupScroll?.()
        clearTimeout(timer)
        setOpen(true)
        trackPromo('btds_promo_view', 'popup')
      }
      const onScroll = () => {
        const scrollable = document.body.scrollHeight - window.innerHeight
        if (scrollable > 0 && window.scrollY / scrollable >= SCROLL_TRIGGER) fire()
      }
      timer = setTimeout(fire, DELAY_MS)
      window.addEventListener('scroll', onScroll, { passive: true })
      cleanupScroll = () => window.removeEventListener('scroll', onScroll)
    }

    // Așteptăm decizia pe cookie-uri; dacă e deja luată, pornim direct.
    if (loadConsent()) start()
    else
      consentPoll = setInterval(() => {
        if (!loadConsent()) return
        clearInterval(consentPoll)
        start()
      }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(consentPoll)
      cleanupScroll?.()
    }
  }, [eligible])

  function close() {
    setOpen(false)
    remember(false)
    trackPromo('btds_promo_dismiss', 'popup')
  }

  function follow() {
    setOpen(false)
    remember(true)
    trackPromo('btds_promo_click', 'popup')
  }

  if (!eligible) return null

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent
        className="max-w-[calc(100%-2rem)] overflow-hidden rounded-3xl border-white/10 bg-[#231f20] p-0 text-white sm:max-w-md [&>button]:z-10 [&>button]:text-white [&>button]:opacity-60 [&>button]:hover:opacity-100"
      >
        {/* Aceeași fotografie neclară din hero-ul LP-ului: continuitate vizuală între
            pop-up și pagina în care aterizează omul. Neclaritatea e deja în fișier. */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/back-to-dance-school-hero.jpg"
            alt=""
            className="h-full w-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#231f20]/85 via-[#231f20]/92 to-[#231f20]" />
        </div>

        <div className="relative p-7 sm:p-8">
          <span
            className="inline-flex items-center gap-2 rounded-full border border-[#f8ef21]/30 bg-[#f8ef21]/10 px-3 py-1.5 text-[11px] font-black tracking-[0.14em] text-[#f8ef21] uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {PROMO_COPY.eyebrow}
          </span>

          <DialogTitle
            className="mt-5 text-3xl leading-[1.05] font-extrabold text-balance sm:text-4xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="block">Back to</span>
            <span className="block text-[#f8ef21]">Dance School.</span>
          </DialogTitle>

          <DialogDescription className="mt-4 text-sm leading-relaxed text-white/70">
            {PROMO_COPY.lead}
          </DialogDescription>

          <div className="mt-7 flex flex-col gap-3">
            <Link
              href={promoHref('popup')}
              onClick={follow}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f8ef21] px-6 py-3.5 text-sm font-bold text-[#231f20] transition-colors hover:bg-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {PROMO_COPY.cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={close}
              className="text-sm font-semibold text-white/45 transition-colors hover:text-white/80"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {PROMO_COPY.dismiss}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
