'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, MapPin, X } from 'lucide-react'
import { loadConsent } from '@/lib/consent'
import { CAMPAIGN_ID, LP_PATH, SCOALA_PARTENERA } from '@/app/valea-lupului/campaign'

/**
 * Cardul lateral care anunță preînscrierile pentru Valea Lupului. Apare DOAR cât campania
 * e pornită din qapp (Alex o pornește și o închide) — starea vine din /api/preinscrieri.
 *
 * Intenționat discret: fără fundal întunecat și fără să blocheze pagina, în colțul din
 * dreapta (butonul de WhatsApp stă în stânga), după câteva secunde sau după ce omul a
 * derulat. Închis o dată, nu mai revine câteva zile.
 */
const DELAY_MS = 8000
const SCROLL_TRIGGER = 0.3
const SNOOZE_DAYS = 4
const DISMISS_KEY = 'qd_vl_promo'
const EXCLUDED_PREFIXES = ['/valea-lupului', '/admin', '/back-to-dance-school']

type Dismissal = { at: number; converted?: boolean }

function isSnoozed(): boolean {
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY)
    if (!raw) return false
    const d = JSON.parse(raw) as Dismissal
    if (d.converted) return true
    return Date.now() - d.at < SNOOZE_DAYS * 24 * 60 * 60 * 1000
  } catch {
    return true
  }
}

function remember(converted: boolean) {
  try {
    window.localStorage.setItem(DISMISS_KEY, JSON.stringify({ at: Date.now(), converted }))
  } catch {
    /* fără memorie locală, cardul reapare la următoarea vizită — acceptabil */
  }
}

function track(event: string) {
  const w = window as Window & { dataLayer?: unknown[] }
  w.dataLayer?.push({ event, campaign_id: CAMPAIGN_ID, promo_slot: 'popup' })
}

const HREF = `${LP_PATH}?${new URLSearchParams({
  utm_source: 'site',
  utm_medium: 'popup',
  utm_campaign: CAMPAIGN_ID,
}).toString()}`

export default function PreinscrierePopup() {
  const pathname = usePathname()
  const [activa, setActiva] = useState(false)
  const [open, setOpen] = useState(false)

  const exclus = EXCLUDED_PREFIXES.some((p) => pathname?.startsWith(p))

  useEffect(() => {
    if (exclus) return
    let anulat = false
    fetch('/api/preinscrieri')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!anulat && d?.valea_lupului === 'activa') setActiva(true)
      })
      .catch(() => {})
    return () => {
      anulat = true
    }
  }, [exclus])

  useEffect(() => {
    if (!activa || exclus || isSnoozed()) return

    let timer: ReturnType<typeof setTimeout> | undefined
    let consentPoll: ReturnType<typeof setInterval> | undefined
    let cleanupScroll: (() => void) | undefined

    const start = () => {
      const fire = () => {
        cleanupScroll?.()
        clearTimeout(timer)
        setOpen(true)
        track('vl_promo_view')
      }
      const onScroll = () => {
        const scrollable = document.body.scrollHeight - window.innerHeight
        if (scrollable > 0 && window.scrollY / scrollable >= SCROLL_TRIGGER) fire()
      }
      timer = setTimeout(fire, DELAY_MS)
      window.addEventListener('scroll', onScroll, { passive: true })
      cleanupScroll = () => window.removeEventListener('scroll', onScroll)
    }

    // Bannerul de cookie-uri ocupă partea de jos a ecranului: așteptăm întâi decizia.
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
  }, [activa, exclus])

  if (!open || exclus) return null

  const close = () => {
    setOpen(false)
    remember(false)
    track('vl_promo_dismiss')
  }

  return (
    <aside
      role="complementary"
      aria-label="Preînscrieri Valea Lupului"
      className="animate-fade-in-up fixed right-3 bottom-3 left-20 z-50 overflow-hidden rounded-2xl border border-white/10 bg-[#231f20] text-white shadow-2xl sm:right-6 sm:bottom-6 sm:left-auto sm:w-80"
    >
      <button
        type="button"
        onClick={close}
        aria-label="Închide"
        className="absolute top-2.5 right-2.5 rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
      <div className="p-4 pr-10 sm:p-5 sm:pr-10">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-[0.14em] text-[#f8ef21] uppercase"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          Nou · din noiembrie
        </span>
        <p className="mt-2 text-lg leading-tight font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
          Quasar Dance vine în <span className="text-[#f8ef21]">Valea Lupului</span>
        </p>
        {/* Pe telefon doar titlul și butonul: cardul nu are voie să acopere pagina. */}
        <p className="mt-2 hidden text-xs leading-relaxed text-white/65 sm:block">
          Dans, gimnastică și K-pop pentru copii, la Școala Verde, în parteneriat cu {SCOALA_PARTENERA}. Spune-ne ce
          vi s-ar potrivi — preînscrierea nu te obligă la nimic.
        </p>
        <Link
          href={HREF}
          onClick={() => {
            setOpen(false)
            remember(true)
            track('vl_promo_click')
          }}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#f8ef21] sm:mt-4 px-4 py-2 text-sm font-bold text-[#231f20] transition-colors hover:bg-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Preînscrie-te
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  )
}
