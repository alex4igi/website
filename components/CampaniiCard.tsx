'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, MapPin, Sparkles, X } from 'lucide-react'
import { loadConsent } from '@/lib/consent'
import { amana, citeste, esteAmanat, type CampanieCard } from '@/lib/campanii-vizite'
import { CAMPANIE_RECOMANDARI, formatDataRo } from '@/lib/recomandari'
import {
  CAMPAIGN_ID as VL_CAMPAIGN_ID,
  LP_PATH as VL_LP_PATH,
  SCOALA_PARTENERA,
} from '@/app/valea-lupului/campaign'

/**
 * Cardul lateral al campaniilor pornite din qapp. Un singur card pe vizită, chiar dacă
 * rulează mai multe campanii deodată, în ordinea:
 *   1. DANCE WITH ME, revenire — doar pentru cine a fost deja pe /dance-with-me;
 *   2. Valea Lupului, revenire — pentru cine a fost deja pe pagina de preînscriere;
 *   3. Valea Lupului, anunț — pentru oricine altcineva.
 * Cine s-a înscris la o campanie nu-i mai vede cardul; cine l-a închis nu-l mai vede câteva
 * zile și nu primește alt card în aceeași sesiune.
 *
 * Intenționat discret: fără fundal întunecat, în colțul din dreapta (WhatsApp stă în stânga),
 * după câteva secunde sau după ce omul a derulat.
 */
const DELAY_MS = 8000
const SCROLL_TRIGGER = 0.3
const SESIUNE_KEY = 'qd_card_inchis'
const EXCLUDED_PREFIXES = ['/dance-with-me', '/recomandari', '/valea-lupului', '/admin', '/back-to-dance-school']

type Stare = { dance_with_me: boolean; dance_with_me_pana: string | null; valea_lupului: string }
type Varianta = { campanie: CampanieCard; revenire: boolean }

function alege(s: Stare): Varianta | null {
  const dwm = citeste('dance_with_me')
  if (s.dance_with_me && dwm.vizitat && !dwm.inscris && !esteAmanat(dwm))
    return { campanie: 'dance_with_me', revenire: true }
  const vl = citeste('valea_lupului')
  if (s.valea_lupului === 'activa' && !vl.inscris && !esteAmanat(vl))
    return { campanie: 'valea_lupului', revenire: !!vl.vizitat }
  return null
}

function inchisInSesiune(): boolean {
  try {
    return window.sessionStorage.getItem(SESIUNE_KEY) === '1'
  } catch {
    return false
  }
}

function track(event: string, v: Varianta) {
  const w = window as Window & { dataLayer?: unknown[] }
  w.dataLayer?.push({
    event,
    campaign_id: v.campanie === 'valea_lupului' ? VL_CAMPAIGN_ID : 'dance_with_me',
    promo_slot: v.revenire ? 'revenire' : 'popup',
  })
}

// Revenirea merge fără UTM-uri: landing-ul Valea Lupului păstrează în sesiune sursa cu care
// a venit omul prima dată (lotul de flyere), iar un UTM nou ar suprascrie-o.
const VL_ANUNT_HREF = `${VL_LP_PATH}?${new URLSearchParams({
  utm_source: 'site',
  utm_medium: 'popup',
  utm_campaign: VL_CAMPAIGN_ID,
}).toString()}`

export default function CampaniiCard() {
  const pathname = usePathname()
  const [stare, setStare] = useState<Stare | null>(null)
  const [varianta, setVarianta] = useState<Varianta | null>(null)
  const [open, setOpen] = useState(false)

  const exclus = EXCLUDED_PREFIXES.some((p) => pathname?.startsWith(p))

  useEffect(() => {
    if (exclus || stare) return
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
  }, [exclus, stare])

  useEffect(() => {
    if (!stare || exclus || varianta || inchisInSesiune()) return
    const v = alege(stare)
    if (!v) return

    let timer: ReturnType<typeof setTimeout> | undefined
    let consentPoll: ReturnType<typeof setInterval> | undefined
    let cleanupScroll: (() => void) | undefined

    const start = () => {
      const fire = () => {
        cleanupScroll?.()
        clearTimeout(timer)
        setVarianta(v)
        setOpen(true)
        track(v.campanie === 'valea_lupului' ? 'vl_promo_view' : 'dwm_promo_view', v)
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
  }, [stare, exclus, varianta])

  if (!open || exclus || !varianta || !stare) return null

  const prefix = varianta.campanie === 'valea_lupului' ? 'vl' : 'dwm'

  const close = () => {
    setOpen(false)
    amana(varianta.campanie)
    try {
      window.sessionStorage.setItem(SESIUNE_KEY, '1')
    } catch {
      /* fără sesiune, cel mult mai apare un card la următoarea pagină */
    }
    track(`${prefix}_promo_dismiss`, varianta)
  }

  const onClick = () => {
    setOpen(false)
    track(`${prefix}_promo_click`, varianta)
  }

  const continut =
    varianta.campanie === 'dance_with_me'
      ? {
          aria: CAMPANIE_RECOMANDARI,
          icon: Sparkles,
          eyebrow: CAMPANIE_RECOMANDARI,
          titlu: (
            <>
              Te-a invitat <span className="text-[#f8ef21]">un prieten?</span>
            </>
          ),
          text: `Prima oră la Quasar e gratuită${
            stare.dance_with_me_pana ? `, până pe ${formatDataRo(stare.dance_with_me_pana)}` : ''
          }. Completează cererea și te sună recepția.`,
          href: '/dance-with-me',
          buton: 'Înapoi la invitație',
        }
      : {
          aria: 'Preînscrieri Valea Lupului',
          icon: MapPin,
          eyebrow: varianta.revenire ? 'Preînscrieri deschise' : 'Nou · din noiembrie',
          titlu: (
            <>
              Quasar Dance vine în <span className="text-[#f8ef21]">Valea Lupului</span>
            </>
          ),
          text: `Dans, gimnastică și K-pop pentru copii, la Școala Verde, în parteneriat cu ${SCOALA_PARTENERA}. Spune-ne ce vi s-ar potrivi — preînscrierea nu te obligă la nimic.`,
          href: varianta.revenire ? VL_LP_PATH : VL_ANUNT_HREF,
          buton: varianta.revenire ? 'Înapoi la preînscriere' : 'Preînscrie-te',
        }
  const Icon = continut.icon

  return (
    <aside
      role="complementary"
      aria-label={continut.aria}
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
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {continut.eyebrow}
        </span>
        <p className="mt-2 text-lg leading-tight font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
          {continut.titlu}
        </p>
        {/* Pe telefon doar titlul și butonul: cardul nu are voie să acopere pagina. */}
        <p className="mt-2 hidden text-xs leading-relaxed text-white/65 sm:block">{continut.text}</p>
        <Link
          href={continut.href}
          onClick={onClick}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#f8ef21] sm:mt-4 px-4 py-2 text-sm font-bold text-[#231f20] transition-colors hover:bg-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {continut.buton}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  )
}
