'use client'

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

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-[#231f20]"
    >
      {/* YouTube iframe background — covers the full viewport on all devices */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {/*
          The iframe needs to be oversized so the 16:9 video fully covers any
          viewport aspect ratio. We position it centred and scale it with a
          min-width / min-height trick identical to the classic "video cover"
          technique.  The wrapper clips everything that spills outside.
        */}
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            width: 'max(100vw, 177.78vh)',   /* 177.78vh = 100vh * (16/9) */
            height: 'max(56.25vw, 100vh)',   /* 56.25vw = 100vw * (9/16) */
            transform: 'translate(-50%, -50%)',
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${YT_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${YT_VIDEO_ID}&start=${YT_START}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=0&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0`}
            allow="autoplay; fullscreen"
            title="Quasar Dance background video"
            className="w-full h-full border-0"
            style={{ opacity: 0.65 }}
          />
        </div>
      </div>

      {/* Overlay */}
      <div className="video-overlay absolute inset-0" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pb-24 pt-40 md:pt-48 w-full">
        <div className="max-w-3xl">
          {/* Label */}
          <div className="section-label mb-6 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            Școală de Dans · Iași · din 1981
          </div>

          {/* Headline */}
          <h1
            className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-balance animate-fade-in-up mb-6"
            style={{ fontFamily: 'var(--font-display)', animationDelay: '80ms' }}
          >
            De la primul pas,
            <br />
            <span className="text-[#f8ef21]">direct pe scenă.</span>
          </h1>

          {/* Sub-headline */}
          <p
            className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl animate-fade-in-up mb-10"
            style={{ animationDelay: '160ms' }}
          >
            Mai mult decât cursuri de dans. O experiență completă: spectacole, concursuri,
            flashmob-uri și progres real — pentru copii, studenți și adulți.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-3 animate-fade-in-up mb-16"
            style={{ animationDelay: '240ms' }}
          >
            <Link
              href="#inscriere"
              className="bg-[#f8ef21] text-[#231f20] font-bold text-base px-7 py-3.5 rounded-full hover:bg-white transition-all duration-200 shadow-lg shadow-[#f8ef21]/20"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Înscrie-te acum
            </Link>
            <Link
              href="#cursuri"
              className="border-2 border-white/40 text-white font-semibold text-base px-7 py-3.5 rounded-full hover:border-[#f8ef21] hover:text-[#f8ef21] transition-all duration-200"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Vezi cursurile
            </Link>
            <Link
              href="#quiz"
              className="text-white/60 font-medium text-sm underline decoration-white/30 hover:text-[#f8ef21] hover:decoration-[#f8ef21] transition-colors duration-200 self-center"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Găsește cursul potrivit pentru tine &rarr;
            </Link>
          </div>

          {/* Trust badges */}
          <div
            className="flex flex-wrap gap-4 animate-fade-in-up"
            style={{ animationDelay: '320ms' }}
          >
            {trustBadges.map((badge) => (
              <div
                key={badge.value}
                className="flex flex-col gap-0.5 border border-white/20 rounded-xl px-4 py-3 bg-white/5 backdrop-blur-sm"
              >
                <span
                  className="text-[#f8ef21] text-xl font-extrabold leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {badge.value}
                </span>
                <span className="text-white/60 text-xs font-medium uppercase tracking-wider">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40 animate-bounce">
        <span className="text-xs font-medium tracking-widest uppercase" style={{ fontFamily: 'var(--font-display)' }}>
          Scroll
        </span>
        <ChevronDown size={18} />
      </div>
    </section>
  )
}
