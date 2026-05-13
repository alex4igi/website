import Link from 'next/link'

const steps = [
  { num: '1', label: 'Răspunzi la 7 întrebări rapide' },
  { num: '2', label: 'Îți descoperim stilul potrivit' },
  { num: '3', label: 'Primești recomandarea personalizată' },
]

export default function QuizCtaSection() {
  return (
    <section id="quiz" className="bg-[#f8ef21] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left text */}
          <div>
            <div
              className="inline-flex items-center gap-2 text-[#231f20] bg-[#231f20]/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Quiz interactiv
            </div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Nu știi ce curs
              <br />
              ți se potrivește?
            </h2>
            <p className="text-[#231f20]/70 text-base leading-relaxed mb-8">
              Răspunde la 7 întrebări simple și îți recomandăm cursul perfect pentru
              tine sau pentru copilul tău. Gratuit, instant, fără apel de vânzări.
            </p>

            {/* Steps */}
            <div className="flex flex-col gap-3 mb-8">
              {steps.map((step) => (
                <div key={step.num} className="flex items-center gap-4">
                  <div
                    className="w-8 h-8 rounded-full bg-[#231f20] text-[#f8ef21] flex items-center justify-center text-sm font-extrabold flex-shrink-0"
                    aria-hidden="true"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {step.num}
                  </div>
                  <span
                    className="text-[#231f20] text-sm font-semibold"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 bg-[#231f20] text-white font-bold text-base px-8 py-4 rounded-full hover:bg-[#3a3637] transition-all duration-200 shadow-xl shadow-[#231f20]/20"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Fă quiz-ul acum &rarr;
            </Link>
          </div>

          {/* Right: decorative card */}
          <div className="relative hidden md:block">
            <div className="bg-[#231f20] rounded-3xl p-10 flex flex-col gap-6">
              <div
                className="text-[#f8ef21] text-sm font-bold uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Exemplu de recomandare
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-white text-2xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
                  Street Dance · Junior
                </div>
                <div className="text-white/50 text-sm">8 ani · Nivel începător · Locație: Centru</div>
              </div>
              <div className="h-px bg-white/10" />
              <p className="text-white/70 text-sm leading-relaxed">
                Bazat pe răspunsurile tale, recomandăm Street Dance pentru grupa Junior la Quasar Centru,
                marți și joi de la 16:00. Clasa perfectă pentru energia și personalitatea sa.
              </p>
              <div className="flex gap-3">
                <span className="text-xs font-semibold bg-[#f8ef21] text-[#231f20] px-3 py-1.5 rounded-full" style={{ fontFamily: 'var(--font-display)' }}>
                  Începător
                </span>
                <span className="text-xs font-semibold bg-white/10 text-white px-3 py-1.5 rounded-full" style={{ fontFamily: 'var(--font-display)' }}>
                  Junior 7–10
                </span>
                <span className="text-xs font-semibold bg-white/10 text-white px-3 py-1.5 rounded-full" style={{ fontFamily: 'var(--font-display)' }}>
                  Urban
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
