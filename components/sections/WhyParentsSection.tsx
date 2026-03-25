'use client'

import { useInView } from '@/hooks/use-in-view'
import SprayLabel from '@/components/ui/spray-label'

const benefits = [
  {
    title: 'Încredere în sine',
    desc: 'Fiecare pas pe scenă construiește curaj real. Copiii descoperă că pot — și asta îi schimbă.',
  },
  {
    title: 'Disciplină & perseverență',
    desc: 'Repetițiile, răbdarea și progresul constant formează caracterul, nu doar dansatorul.',
  },
  {
    title: 'Muncă în echipă',
    desc: 'Dans sincronizat, respect față de colegi, coregrafii colective — comunitate de la prima zi.',
  },
  {
    title: 'Coordonare & sănătate',
    desc: 'Mișcarea regulată îmbunătățește postura, concentrarea și starea generală a copilului.',
  },
  {
    title: 'Apartenență & comunitate',
    desc: 'Quasar nu e o sală. Este o familie. Prietenii de la dans devin prietenii pentru viață.',
  },
  {
    title: 'Experiență pe scenă',
    desc: 'Spectacole, concursuri, flashmob-uri — emoția scenei transformă copiii în artiști.',
  },
]

export default function WhyParentsSection() {
  const [sectionRef, inView] = useInView<HTMLElement>({ threshold: 0.1 })

  return (
    <section ref={sectionRef} className="bg-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Header */}
        <div className={`max-w-2xl mb-14 reveal ${inView ? 'in-view' : ''}`}>
          <div className="mb-4"><SprayLabel>De ce părinții aleg Quasar</SprayLabel></div>
          <h2
            className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Mai mult decât dans.
            <br />
            <span className="text-[#231f20]/35">O investiție în viitorul copilului.</span>
          </h2>
          <p className="text-[#6b6b6b] mt-5 text-base md:text-lg leading-relaxed">
            La Quasar, copiii nu învață doar mișcări. Ei construiesc o versiune mai bună a lor — pas cu pas, spectacol cu spectacol.
          </p>
        </div>

        {/* Grid — numbered cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <div
              key={i}
              className={`group relative flex flex-col gap-4 p-7 rounded-2xl bg-[#f5f5f5] hover:bg-[#231f20] transition-all duration-400 overflow-hidden cursor-default reveal ${inView ? 'in-view' : ''}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Number — large faded background */}
              <span
                className="absolute -top-3 -right-2 text-[80px] font-black text-[#231f20]/5 group-hover:text-white/5 leading-none select-none transition-colors duration-400 pointer-events-none"
                style={{ fontFamily: 'var(--font-display)' }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Yellow accent line — grows on hover */}
              <div
                className="w-8 h-1 rounded-full bg-[#f8ef21] origin-left scale-x-100 group-hover:w-12 transition-all duration-300"
                aria-hidden="true"
              />

              <h3
                className="text-[#231f20] group-hover:text-white text-lg font-extrabold transition-colors duration-300 relative z-10"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {b.title}
              </h3>
              <p className="text-[#6b6b6b] group-hover:text-white/65 text-sm leading-relaxed transition-colors duration-300 relative z-10">
                {b.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Pull-quote */}
        <div className={`mt-14 relative flex flex-col md:flex-row items-center gap-8 bg-[#231f20] rounded-2xl p-8 md:p-12 overflow-hidden reveal ${inView ? 'in-view' : ''}`} style={{ transitionDelay: '550ms' }}>
          {/* Yellow decorative blob */}
          <div
            className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-[#f8ef21] opacity-10 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="text-[#f8ef21] text-7xl font-black leading-none select-none flex-shrink-0 hidden md:block"
            style={{ fontFamily: 'var(--font-display)' }}
            aria-hidden="true"
          >
            &ldquo;
          </div>
          <blockquote
            className="text-white text-xl md:text-2xl font-semibold leading-relaxed text-balance flex-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Cel mai bun lucru pe care l-am făcut pentru copilul meu a fost să îl aduc la Quasar.
            A crescut nu doar ca dansator, ci ca om.
          </blockquote>
          <div className="md:ml-auto flex-shrink-0 text-center md:text-right">
            <div
              className="text-[#f8ef21] font-black text-sm tracking-wide"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Maria D.
            </div>
            <div className="text-white/45 text-xs mt-1">Părinte · Membru din 2018</div>
          </div>
        </div>
      </div>
    </section>
  )
}
