const items = [
  {
    num: '01',
    title: 'Rădăcini autentice de street dance',
    desc: 'Quasar a adus street dance-ul în România înainte ca termenul să existe în dicționar. Metodologia noastră vine din sursă directă — nu din trend-uri importate.',
  },
  {
    num: '02',
    title: 'Metodologie academică',
    desc: 'Fiecare instructor Quasar urmează o pregătire pedagogică specifică. Nu improvizăm. Construim cursuri cu structură, progresie și rezultate măsurabile.',
  },
  {
    num: '03',
    title: 'Muzică & coregrafii actuale',
    desc: 'Programele sunt actualizate constant cu cele mai noi tendințe. Coregrafiile reflectă ce se întâmplă în dans astăzi, nu acum 10 ani.',
  },
  {
    num: '04',
    title: 'Instructori formați în sistem Quasar',
    desc: 'Mulți dintre instructorii noștri au crescut în Quasar. Ei cunosc sistemul din interior și transmit mai mult decât pași — transmit spiritul Quasar.',
  },
  {
    num: '05',
    title: 'Siguranță & infrastructură',
    desc: 'Sălile noastre sunt dotate profesionist: podele pentru dans, oglinzi, sistem audio, vestiare. Mediu sigur, curat, pregătit pentru performanță.',
  },
  {
    num: '06',
    title: 'Organizare transparentă',
    desc: 'Program clar, comunicare deschisă cu părinții, contracte, factori de plată flexibili. Funcționăm ca o instituție, nu ca un cerc informal.',
  },
]

import SprayLabel from '@/components/ui/spray-label'

export default function DifferentiatorsSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          <div>
            <div className="mb-4"><SprayLabel>De ce Quasar?</SprayLabel></div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Nu orice școală
              <br />
              <span className="text-[#f8ef21] [-webkit-text-stroke:1px_#231f20]">
                e Quasar.
              </span>
            </h2>
          </div>
          <div className="md:pt-4">
            <p className="text-[#6b6b6b] text-base leading-relaxed">
              Suntem cei mai vechi. Suntem cei mai consistenți. Am format mii de dansatori, câteva
              generații de instructori și o comunitate care se recunoaște oriunde în România.
              Aceasta nu e marketing — aceasta e istorie.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="bar-yellow" aria-hidden="true" />
              <span
                className="text-[#231f20] font-bold text-sm"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Școală de dans în Iași din 1981
              </span>
            </div>
          </div>
        </div>

        {/* Differentiators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-[#e5e5e5] rounded-2xl overflow-hidden">
          {items.map((item, i) => (
            <div
              key={item.num}
              className={`group p-8 flex flex-col gap-4 border-b border-r border-[#e5e5e5] hover:bg-[#231f20] transition-colors duration-300 ${
                // Remove right border from last in each row
                (i + 1) % 3 === 0 ? 'border-r-0' : ''
              } ${
                // Remove bottom border from last row
                i >= items.length - 3 ? 'border-b-0' : ''
              }`}
            >
              <span
                className="text-[#f8ef21] text-sm font-black"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {item.num}
              </span>
              <h3
                className="text-[#231f20] group-hover:text-white text-lg font-bold leading-snug transition-colors duration-300"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {item.title}
              </h3>
              <p className="text-[#6b6b6b] group-hover:text-white/65 text-sm leading-relaxed transition-colors duration-300">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
