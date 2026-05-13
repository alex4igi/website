'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from '@/hooks/use-in-view'

const stats = [
  { raw: 11000, display: '11.000+', label: 'tineri introduși la dans', desc: 'De-a lungul istoriei Quasar' },
  { raw: 600,   display: '600+',    label: 'membri activi',            desc: 'În cele 3 locații Quasar' },
  { raw: 200,   display: '200+',    label: 'trofee & premii',          desc: 'Național și internațional' },
  { raw: 50,    display: '50+',     label: 'spectacole Quasar',        desc: 'Pe scene mari din Iași' },
]

const highlights = [
  'Dansatorii Quasar au reprezentat România la competiții internaționale',
  'Quasar deține recordul național pentru cel mai mare flashmob simultan',
  'Cea mai veche școală de street dance din Moldova',
  'Instructori formați timp de zeci de ani în sistemul Quasar',
]

function AnimatedNumber({ target, started }: { target: number; started: boolean }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!started) return
    const duration = 1400
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { setValue(target); clearInterval(timer) }
      else setValue(Math.floor(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [started, target])
  return <>{value.toLocaleString('ro-RO')}</>
}

export default function StatsSection() {
  const [sectionRef, inView] = useInView<HTMLElement>({ threshold: 0.2 })

  return (
    <section ref={sectionRef} className="bg-[#f8ef21] py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto mb-14 reveal ${inView ? 'in-view' : ''}`}>
          <div
            className="inline-flex items-center gap-2 text-[#231f20] bg-[#231f20]/10 px-3 py-1 rounded-full text-xs font-black uppercase tracking-[0.16em] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Impactul nostru
          </div>
          <h2
            className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Cifrele vorbesc
            <br />
            mai tare decât cuvintele.
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 stagger">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-2 bg-[#231f20] rounded-2xl p-4 sm:p-6 md:p-8 card-lift reveal ${inView ? 'in-view' : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span
                className="text-[#f8ef21] text-[clamp(1.1rem,5.5vw,3rem)] font-extrabold leading-none tabular-nums"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <AnimatedNumber target={stat.raw} started={inView} />+
              </span>
              <span
                className="text-white text-sm font-bold leading-snug mt-1"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {stat.label}
              </span>
              <span className="text-white/45 text-xs leading-relaxed">{stat.desc}</span>
            </div>
          ))}
        </div>

        {/* Highlights strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {highlights.map((h, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 bg-[#231f20]/10 hover:bg-[#231f20]/18 rounded-xl px-5 py-4 transition-colors duration-200 reveal ${inView ? 'in-view' : ''}`}
              style={{ transitionDelay: `${400 + i * 80}ms` }}
            >
              <span
                className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-[#231f20] text-[#f8ef21] text-[10px] font-black mt-0.5"
                aria-hidden="true"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <p
                className="text-[#231f20] text-sm font-semibold leading-relaxed"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {h}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
