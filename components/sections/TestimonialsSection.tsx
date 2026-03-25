'use client'

import { useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SprayLabel from '@/components/ui/spray-label'

const testimonials = [
  {
    type: 'parent',
    name: 'Elena V.',
    role: 'Mamă · fiul la Street Dance Kids',
    quote:
      'Fiul meu a venit prima dată timid și fără nicio experiență. Acum urcă pe scenă cu zâmbetul pe față și discipol de câțiva ani. Quasar l-a schimbat cu adevărat.',
    stars: 5,
  },
  {
    type: 'student',
    name: 'Radu C.',
    role: 'Dansator · Studenți',
    quote:
      'Am venit la Quasar fără să fi dansat niciodată. În 6 luni eram pe scenă la spectacolul anual. Echipa asta e altceva — energie, pasiune și spirit real.',
    stars: 5,
  },
  {
    type: 'parent',
    name: 'Mihaela D.',
    role: 'Mamă · fiica la Gimnastică',
    quote:
      'Am ales Quasar pentru structura lor. Nu e haotic, nu e improvizat. E un program real, cu instructori atenți și progres vizibil din lună în lună.',
    stars: 5,
  },
  {
    type: 'teen',
    name: 'Andreea M.',
    role: 'Dansatoare · KPOP',
    quote:
      'KPOP-ul la Quasar nu e doar dans. E o familie. Am cunoscut oameni cu care vorbesc și în afara sălii. Cel mai bun lucru din viața mea de liceu.',
    stars: 5,
  },
  {
    type: 'parent',
    name: 'Ionuț R.',
    role: 'Tată · fiica la Street Dance',
    quote:
      'Eram sceptic. Acum sunt cel mai vocal susținător al lui Quasar în anturajul meu. Dacă ai un copil în Iași, nu există alternativă mai bună.',
    stars: 5,
  },
  {
    type: 'student',
    name: 'Laura S.',
    role: 'Dansatoare · Adults',
    quote:
      'Am început la 28 de ani, convinsă că e prea târziu. Quasar m-a convins că nu există prea târziu — există doar primul pas pe care nu l-ai făcut încă.',
    stars: 5,
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} stele din 5`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-[#f8ef21] text-sm" aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  })

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()

  return (
    <section className="bg-[#231f20] py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <div className="mb-4"><SprayLabel>Ce spun membrii</SprayLabel></div>
            <h2
              className="text-white text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Vibrația Quasar,
              <br />
              <span className="text-[#f8ef21]">în cuvintele lor.</span>
            </h2>
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#f8ef21] hover:text-[#f8ef21] transition-colors"
              aria-label="Testimonial anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollNext}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#f8ef21] hover:text-[#f8ef21] transition-colors"
              aria-label="Testimonial următor"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="embla" ref={emblaRef}>
          <div className="embla__container gap-4" style={{ display: 'flex' }}>
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="embla__slide flex-shrink-0 w-[85vw] sm:w-[360px] md:w-[380px]"
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col gap-4 h-full hover:border-white/20 transition-colors">
                  <StarRating count={t.stars} />
                  <blockquote
                    className="text-white/85 text-sm leading-relaxed flex-1"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                    <div
                      className="w-9 h-9 rounded-full bg-[#f8ef21] flex items-center justify-center text-[#231f20] font-extrabold text-sm flex-shrink-0"
                      aria-hidden="true"
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <div
                        className="text-white text-sm font-bold"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {t.name}
                      </div>
                      <div className="text-white/40 text-xs">{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
