'use client'

import { useRef, useEffect, useState } from 'react'
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
  const playerRef = useRef<HTMLDivElement>(null)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    // Load the YouTube IFrame API script once
    if (document.getElementById('yt-iframe-api')) {
      initPlayer()
      return
    }
    const script = document.createElement('script')
    script.id = 'yt-iframe-api'
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)
    ;(window as any).onYouTubeIframeAPIReady = initPlayer
  }, [])

  function initPlayer() {
    if (!playerRef.current) return
    new (window as any).YT.Player(playerRef.current, {
      videoId: YT_VIDEO_ID,
      playerVars: {
        autoplay: 1,
        mute: 1,
        loop: 1,
        playlist: YT_VIDEO_ID,
        start: YT_START,
        controls: 0,
        showinfo: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        iv_load_policy: 3,
        disablekb: 1,
        fs: 0,
        cc_load_policy: 0,
      },
      events: {
        onReady: (e: any) => {
          e.target.mute()
          e.target.playVideo()
          setVideoReady(true)
        },
        onStateChange: (e: any) => {
          // Keep looping: if ended (0) restart
          if (e.data === 0) e.target.seekTo(YT_START, true)
        },
      },
    })
  }

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-[#231f20]"
      style={{ height: '100svh', minHeight: '600px' }}
    >
      {/* ── YouTube video background ── */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {/*
          Classic "cover" technique for 16:9 video in any viewport:
          Width  = max(100vw, 177.78vh)  [177.78 = 100 * 16/9]
          Height = max(56.25vw, 100%)    [56.25  = 100 * 9/16]
          Centred with translate(-50%, -50%).
        */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 'max(100vw, 177.78vh)',
            height: 'max(56.25vw, 100vh)',
            transform: 'translate(-50%, -50%)',
            opacity: videoReady ? 0.72 : 0,
            transition: 'opacity 1s ease',
          }}
        >
          {/* YT Player mounts here */}
          <div ref={playerRef} className="w-full h-full" />
        </div>

        {/* Dark fallback while video loads */}
        <div
          className="absolute inset-0 bg-[#231f20] transition-opacity duration-1000"
          style={{ opacity: videoReady ? 0 : 1 }}
        />
      </div>

      {/* ── Gradient overlay — bottom-heavy so text stays readable ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to bottom, rgba(35,31,32,0.55) 0%, rgba(35,31,32,0.30) 40%, rgba(35,31,32,0.75) 80%, rgba(35,31,32,0.95) 100%)',
        }}
      />

      {/* ── Hero content ── */}
      <div className="relative z-10 flex flex-col justify-end h-full">
        <div className="max-w-7xl mx-auto w-full px-5 md:px-8 pb-10 md:pb-20">
          <div className="max-w-3xl">
            {/* Label pill */}
            <div className="inline-block bg-[#f8ef21] text-[#231f20] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 md:mb-7">
              Școală de Dans · Iași · din 1981
            </div>

            {/* Headline */}
            <h1
              className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] text-balance mb-5 md:mb-7"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              De la primul pas,
              <br />
              <span className="text-[#f8ef21]">direct pe scenă.</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-white/80 text-base md:text-xl leading-relaxed max-w-2xl mb-8 md:mb-10">
              Mai mult decât cursuri de dans. O experiență completă: spectacole, concursuri,
              flashmob-uri și progres real — pentru copii, studenți și adulți.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-8 md:mb-12">
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
                className="hidden sm:inline-flex items-center text-white/60 font-medium text-sm underline decoration-white/30 hover:text-[#f8ef21] hover:decoration-[#f8ef21] transition-colors duration-200 self-center"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Găsește cursul potrivit pentru tine &rarr;
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
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
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40 animate-bounce">
        <span className="text-xs font-medium tracking-widest uppercase" style={{ fontFamily: 'var(--font-display)' }}>
          Scroll
        </span>
        <ChevronDown size={16} />
      </div>
    </section>
  )
}
