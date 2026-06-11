'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Cookie, ShieldCheck } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import {
  applyConsent,
  DENIED_CATEGORIES,
  GRANTED_CATEGORIES,
  loadConsent,
  OPEN_SETTINGS_EVENT,
  saveConsent,
  type ConsentCategories,
  type ConsentCategory,
} from '@/lib/consent'

// Descrierile categoriilor — în acord cu pagina /politica-cookies.
const CATEGORY_INFO: {
  key: ConsentCategory
  title: string
  desc: string
}[] = [
  {
    key: 'analytics',
    title: 'Analiză',
    desc: 'Ne ajută să înțelegem cum este folosit site-ul (ce pagini se vizitează, cât timp) ca să îl putem îmbunătăți. Ex: Google Analytics.',
  },
  {
    key: 'functional',
    title: 'Funcționale',
    desc: 'Memorează preferințele tale (ex: opțiuni alese pe site) pentru o experiență mai bună.',
  },
  {
    key: 'marketing',
    title: 'Marketing',
    desc: 'Folosite pentru a măsura impactul campaniilor noastre de publicitate și a afișa conținut relevant.',
  },
]

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false)
  const [bannerOpen, setBannerOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [prefs, setPrefs] = useState<ConsentCategories>(DENIED_CATEGORIES)

  // La montare: aplicăm consimțământul salvat sau afișăm banner-ul.
  useEffect(() => {
    setMounted(true)
    const stored = loadConsent()
    if (stored) {
      setPrefs(stored.categories)
      applyConsent(stored.categories)
    } else {
      setBannerOpen(true)
    }
  }, [])

  // Permite redeschiderea setărilor din footer (sau orice buton) prin eveniment custom.
  useEffect(() => {
    const open = () => {
      setPrefs(loadConsent()?.categories ?? DENIED_CATEGORIES)
      setDialogOpen(true)
    }
    window.addEventListener(OPEN_SETTINGS_EVENT, open)
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open)
  }, [])

  function persist(categories: ConsentCategories) {
    saveConsent(categories)
    applyConsent(categories)
    setPrefs(categories)
    setBannerOpen(false)
    setDialogOpen(false)
  }

  const acceptAll = () => persist(GRANTED_CATEGORIES)
  const rejectAll = () => persist(DENIED_CATEGORIES)
  const saveChoices = () => persist(prefs)

  if (!mounted) return null

  return (
    <>
      {/* ─── Banner ─────────────────────────────────────────────── */}
      {bannerOpen && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Consimțământ cookie-uri"
          className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-5 animate-fade-in-up"
        >
          <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#231f20] text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:gap-7 md:p-7">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Cookie size={18} className="text-[#f8ef21]" />
                  <h2
                    className="text-base font-extrabold text-white"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Folosim cookie-uri
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-white/65">
                  Folosim cookie-uri esențiale pentru funcționarea site-ului și, cu acordul
                  tău, cookie-uri de analiză, funcționale și de marketing. Poți accepta tot,
                  refuza sau alege ce permiți. Detalii în{' '}
                  <Link
                    href="/politica-cookies"
                    className="font-semibold text-[#f8ef21] underline underline-offset-2 hover:text-[#f8ef21]/80"
                  >
                    Politica de cookies
                  </Link>
                  .
                </p>
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row md:flex-col lg:flex-row md:w-auto">
                <button
                  type="button"
                  onClick={acceptAll}
                  className="btn-yellow order-1 px-5 py-2.5 text-sm whitespace-nowrap"
                >
                  Accept toate
                </button>
                <button
                  type="button"
                  onClick={rejectAll}
                  className="order-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-bold whitespace-nowrap text-white transition-colors hover:bg-white/10"
                >
                  Refuz
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPrefs(loadConsent()?.categories ?? DENIED_CATEGORIES)
                    setDialogOpen(true)
                  }}
                  className="order-3 rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white/70 transition-colors hover:text-white"
                >
                  Personalizează
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Dialog preferințe ──────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle
              className="flex items-center gap-2 text-xl font-extrabold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <Cookie size={20} className="text-[#231f20]" />
              Preferințe cookie-uri
            </DialogTitle>
            <DialogDescription>
              Alege ce categorii de cookie-uri permiți. Le poți schimba oricând din subsolul
              site-ului.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col divide-y divide-[#e5e5e5]">
            {/* Esențiale — mereu active */}
            <div className="flex items-start justify-between gap-4 py-4">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-[#231f20]" />
                  <p className="text-sm font-bold text-[#231f20]">Esențiale</p>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[#6b6b6b]">
                  Necesare pentru funcționarea de bază și securitatea site-ului. Nu pot fi
                  dezactivate.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#f5f5f5] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#6b6b6b]">
                Mereu active
              </span>
            </div>

            {CATEGORY_INFO.map(({ key, title, desc }) => (
              <div key={key} className="flex items-start justify-between gap-4 py-4">
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#231f20]">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#6b6b6b]">{desc}</p>
                </div>
                <Switch
                  checked={prefs[key]}
                  onCheckedChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}
                  aria-label={`Activează cookie-uri de ${title.toLowerCase()}`}
                  className="mt-0.5 shrink-0"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={rejectAll}
              className="order-2 rounded-full border border-[#e5e5e5] px-5 py-2.5 text-sm font-bold text-[#231f20] transition-colors hover:bg-[#f5f5f5] sm:order-1"
            >
              Refuz toate
            </button>
            <button
              type="button"
              onClick={saveChoices}
              className="order-1 rounded-full border border-[#231f20] px-5 py-2.5 text-sm font-bold text-[#231f20] transition-colors hover:bg-[#231f20] hover:text-white sm:order-2"
            >
              Salvează alegerile
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="btn-yellow order-3 px-5 py-2.5 text-sm"
            >
              Accept toate
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
