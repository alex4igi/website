'use client'

import { useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SprayLabel from '@/components/ui/spray-label'

const testimonials = [
  {
    name: 'Andreea M.',
    role: 'Mamă · 38 de ani',
    quote:
      'Sincer, la început mi s-au părut scumpe. Dar când am împărțit la numărul de ședințe, mi-am dat seama că e chiar avantajos — mai ales că în preț intră și spectacole, concursuri și o grămadă de alte evenimente. Merită fiecare leu.',
    stars: 5,
  },
  {
    name: 'Raluca D.',
    role: 'Mamă · 42 de ani',
    quote:
      'Al meu e un pic retras, așa că m-am temut că o să fie copleșit. La prima ședință a fost lăsat pur și simplu să stea și să asculte muzică — fără nicio presiune. Până la urmă el singur a cerut să încerce.',
    stars: 5,
  },
  {
    name: 'Mihaela T.',
    role: 'Mamă · 36 de ani',
    quote:
      'Când se formează grupurile se fac niște jocuri între copii, ca să spargă gheața. Când am luat-o acasă după primul curs, îmi povestea entuziasmată că și-a făcut prieteni noi. Le știa chiar și numele. 😄',
    stars: 5,
  },
  {
    name: 'Ioana C.',
    role: 'Mamă · 44 de ani',
    quote:
      'Acum vine acasă cu mișcări noi — și fiecare pas are o poveste și un nume. Pe unele mișcări le observă și prin videoclipuri. Nu mai e doar "dans", e ceva ce înțelege și poate explica. Este foarte mândră fetița mea!',
    stars: 5,
  },
  {
    name: 'Cristina B.',
    role: 'Mamă · 39 de ani',
    quote:
      'A ajuns să aștepte ora de dans cu atâta nerăbdare, că am renunțat să mai plecăm în concediu când pică cursuri sau evenimente. Acum noi ne facem programul după ea — nu invers.',
    stars: 5,
  },
  {
    name: 'Simona R.',
    role: 'Mamă · 47 de ani',
    quote:
      'Se închide în cameră, pune videoclipurile cu coregrafiile lui și repetă ore întregi. Singur, din proprie inițiativă. Ca părinte, eu sunt mulțumită.',
    stars: 5,
  },
  {
    name: 'Elena P.',
    role: 'Mamă · 41 de ani',
    quote:
      'Se vede că au ani de experiență cu copii. Au răbdare, știu cum să le vorbească, cum să-i motiveze. Dau toți în mintea lor — în sensul cel mai bun.',
    stars: 5,
  },
  {
    name: 'Diana F.',
    role: 'Mamă · 35 de ani',
    quote:
      'Instructorul dansează efectiv alături de copii. Nu stă deoparte și dă indicații de la distanță — e acolo, cu ei, pas cu pas.',
    stars: 5,
  },
  {
    name: 'Gabriela N.',
    role: 'Mamă · 46 de ani',
    quote:
      'Dacă o pedepsesc cu telefonul, ridică din umeri. Dar dacă îi spun că nu merge la dans? Avem o dramă în toată casa. 😂',
    stars: 5,
  },
  {
    name: 'Loredana S.',
    role: 'Mamă · 50 de ani',
    quote:
      'Suntem de 5 ani în această comunitate — înainte a mai făcut dans sportiv, dar aici a găsit cu adevărat locul lui. Dansul a devenit identitatea lui. Acum vrea să dea la facultatea de coregrafie din București. Dacă nu era Quasarul, copilul meu ar fi renunțat la dans de mult. Mulțumesc din suflet.',
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
            <div className="mb-4"><SprayLabel>Testimoniale</SprayLabel></div>
            <h2
              className="text-white text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Ce spun părinții
              <br />
              <span className="text-[#f8ef21]">despre noi.</span>
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
