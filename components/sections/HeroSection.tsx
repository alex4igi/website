'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

const trustBadges = [
  { value: '600+', label: 'membri activi' },
  { value: '11.000+', label: 'participanți' },
  { value: 'din 1981', label: 'experiență' },
  { value: '3', label: 'locații în Iași' },
]

const YT_VIDEO_ID = 'OxbQBMHyYXM'

const YT_EMBED_SRC =
  `https://www.youtube.com/embed/${YT_VIDEO_ID}` +
  `?autoplay=1&mute=1&loop=1&playlist=${YT_VIDEO_ID}` +
  `&controls=0&showinfo=0&rel=0` +
  `&modestbranding=1&playsinline=1&iv_load_policy=3` +
  `&disablekb=1&fs=0&cc_load_policy=0&enablejsapi=0`

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section
      id="hero"
      className="relative w-full bg-[#231f20]"
      style={{ minHeight: '100svh' }}
    >
      {/* ── Background ─────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {/* Poster — shown only before iframe mounts to prevent flash of black */}
        {!mounted && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/hero-poster.jpg')" }}
          />
        )}

        {/* iframe — only injected client-side, never touches SSR HTML */}
        {mounted && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              /* 16:9 cover math */
              width: 'max(100vw, 177.78vh)',
              height: 'max(56.25vw, 100vh)',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <iframe
              src={YT_EMBED_SRC}
              title="Quasar Dance — background video"
              allow="autoplay; fullscreen"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none', opacity: 0.72 }}
            />
          </div>
        )}
      </div>

      {/* ── Gradient overlay ───────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(35,31,32,0.72) 0%, rgba(35,31,32,0.28) 30%, rgba(35,31,32,0.18) 55%, rgba(35,31,32,0.70) 80%, rgba(35,31,32,0.97) 100%)',
        }}
      />

      {/* ── Content ────────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex flex-col justify-end"
        style={{ minHeight: '100svh' }}
      >
        <div className="max-w-7xl mx-auto w-full px-5 md:px-10 pb-12 md:pb-24 pt-24 md:pt-20">
          <div className="max-w-3xl">

            {/* Label */}
            <div
              className="inline-block bg-[#f8ef21] text-[#231f20] text-xs font-black uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-5 md:mb-6 animate-fade-in"
              style={{ fontFamily: 'var(--font-display)', animationDelay: '200ms' }}
            >
              Școală de Dans · Iași · din 1981
            </div>

            {/* Headline */}
            <h1
              className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[1.05] text-balance mb-5 md:mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="block animate-fade-in-up" style={{ animationDelay: '350ms' }}>
                De la primul pas,
              </span>
              <span className="block text-[#f8ef21] animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                direct pe scenă.
              </span>
            </h1>

            {/* Sub */}
            <p
              className="text-white/75 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mb-8 md:mb-10 animate-fade-in-up"
              style={{ animationDelay: '650ms' }}
            >
              Mai mult decât cursuri de dans. O experiență completă: spectacole, concursuri,
              flashmob-uri și progres real — pentru copii, studenți și adulți.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8 md:mb-12 animate-fade-in-up"
              style={{ animationDelay: '780ms' }}
            >
              <Link
                href="#inscriere"
                className="btn-yellow inline-flex items-center justify-center text-[#231f20] font-black text-base px-8 py-3.5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Înscrie-te acum
              </Link>
              <Link
                href="#cursuri"
                className="inline-flex items-center justify-center border-2 border-white/30 text-white font-bold text-base px-8 py-3.5 rounded-full hover:border-[#f8ef21] hover:text-[#f8ef21] transition-all duration-300"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Vezi cursurile
              </Link>
              <Link
                href="#quiz"
                className="hidden sm:inline-flex items-center text-white/50 font-medium text-sm hover:text-[#f8ef21] transition-colors duration-200 self-center ml-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Găsește cursul potrivit &rarr;
              </Link>
            </div>

            {/* Trust badges */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 animate-fade-in-up"
              style={{ animationDelay: '900ms' }}
            >
              {trustBadges.map((badge) => (
                <div
                  key={badge.value}
                  className="flex flex-col gap-0.5 border border-white/15 rounded-2xl px-4 py-3.5 bg-white/5 backdrop-blur-sm hover:border-[#f8ef21]/40 transition-all duration-300"
                >
                  <span
                    className="text-[#f8ef21] text-2xl font-black leading-none"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {badge.value}
                  </span>
                  <span className="text-white/55 text-[10px] font-semibold uppercase tracking-widest mt-1">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40 animate-bounce pointer-events-none" aria-hidden="true">
        <span className="text-[10px] font-semibold tracking-widest uppercase">Scroll</span>
        <ChevronDown size={14} />
      </div>
    </section>
  )
}
