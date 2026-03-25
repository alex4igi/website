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

const YT_VIDEO_ID = 'r80uCmXEdqk'
const YT_START = 16

const YT_EMBED_SRC =
  `https://www.youtube.com/embed/${YT_VIDEO_ID}` +
  `?autoplay=1&mute=1&loop=1&playlist=${YT_VIDEO_ID}` +
  `&start=${YT_START}&controls=0&showinfo=0&rel=0` +
  `&modestbranding=1&playsinline=1&iv_load_policy=3` +
  `&disablekb=1&fs=0&cc_load_policy=0&enablejsapi=0`

export default function HeroSection() {
  // Mount flag: only set the iframe src after client hydration to prevent
  // the React SSR/hydration mismatch that triggers the src="" warning.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  return (
    /*
      The section is position:relative and sits at the top of the document
      (page.tsx has no padding-top on <main>). The fixed Navbar overlays it
      from z-50. The iframe cover fills the full viewport including behind
      the navbar.
    */
    <section
      id="hero"
      className="relative w-full bg-[#231f20]"
      style={{ minHeight: '100svh' }}
    >
      {/* ── Background layer ────────────────────────────────────────────
          YouTube iframe cover — all screen sizes including mobile.
          muted=1 + playsinline=1 + allow="autoplay" are the three
          requirements for autoplay on iOS Safari and Android Chrome.
          The poster image is shown as a background on the section
          so there is never a flash of plain black while the iframe loads.
          16:9 cover math:
            width  = max(100vw, 177.78vh)   (= 100vh × 16/9)
            height = max(56.25vw, 100vh)    (= 100vw × 9/16)
      ──────────────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {/* Poster shown immediately while iframe loads */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-poster.jpg')" }}
        />

        {/* iframe rendered only after client mount to avoid src="" SSR warning */}
        {mounted && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 'max(100vw, 177.78vh)',
              height: 'max(56.25vw, 100vh)',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <iframe
              src={YT_EMBED_SRC}
              title="Quasar Dance — background video"
              allow="autoplay; fullscreen"
              className="w-full h-full border-0 opacity-75"
            />
          </div>
        )}
      </div>

      {/* ── Gradient overlay — top dark band for nav legibility ─────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            /* top band — keeps nav readable even when video is bright */
            'linear-gradient(to bottom,',
            '  rgba(35,31,32,0.70) 0%,',
            '  rgba(35,31,32,0.35) 25%,',
            '  rgba(35,31,32,0.20) 50%,',
            '  rgba(35,31,32,0.65) 75%,',
            '  rgba(35,31,32,0.96) 100%)',
          ].join(' '),
        }}
      />

      {/* ── Hero content ────────────────────────────────────────────────
          height: 100svh + flex + justify-end puts the copy at the bottom
          of the screen (like a film title card).
          pt-20 md:pt-24 ensures nothing is hidden behind the fixed navbar
          on small screens where the content might reach the top.
      ──────────────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex flex-col justify-end"
        style={{ minHeight: '100svh' }}
      >
        <div className="max-w-7xl mx-auto w-full px-5 md:px-10 pb-12 md:pb-24 pt-24 md:pt-20">
          <div className="max-w-3xl">
            {/* Label pill */}
            <div className="inline-block bg-[#f8ef21] text-[#231f20] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 md:mb-6">
              Școală de Dans · Iași · din 1981
            </div>

            {/* Headline */}
            <h1 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[1.05] text-balance mb-5 md:mb-6 font-sans">
              De la primul pas,
              <br />
              <span className="text-[#f8ef21]">direct pe scenă.</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-white/80 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mb-8 md:mb-10">
              Mai mult decât cursuri de dans. O experiență completă: spectacole, concursuri,
              flashmob-uri și progres real — pentru copii, studenți și adulți.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8 md:mb-12">
              <Link
                href="#inscriere"
                className="inline-flex items-center justify-center bg-[#f8ef21] text-[#231f20] font-bold text-base px-8 py-3.5 rounded-full hover:bg-white transition-all duration-200 shadow-lg shadow-[#f8ef21]/20 font-sans"
              >
                Înscrie-te acum
              </Link>
              <Link
                href="#cursuri"
                className="inline-flex items-center justify-center border-2 border-white/40 text-white font-semibold text-base px-8 py-3.5 rounded-full hover:border-[#f8ef21] hover:text-[#f8ef21] transition-all duration-200 font-sans"
              >
                Vezi cursurile
              </Link>
              <Link
                href="#quiz"
                className="hidden sm:inline-flex items-center text-white/60 font-medium text-sm underline decoration-white/30 hover:text-[#f8ef21] hover:decoration-[#f8ef21] transition-colors duration-200 self-center ml-1 font-sans"
              >
                Găsește cursul potrivit pentru tine &rarr;
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {trustBadges.map((badge) => (
                <div
                  key={badge.value}
                  className="flex flex-col gap-0.5 border border-white/20 rounded-xl px-4 py-3 bg-white/5 backdrop-blur-sm"
                >
                  <span className="text-[#f8ef21] text-xl font-extrabold leading-none font-sans">
                    {badge.value}
                  </span>
                  <span className="text-white/60 text-[10px] font-medium uppercase tracking-wider">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40 animate-bounce pointer-events-none">
        <span className="text-[10px] font-semibold tracking-widest uppercase font-sans">
          Scroll
        </span>
        <ChevronDown size={14} />
      </div>
    </section>
  )
}
