'use client'

import { useInView } from '@/hooks/use-in-view'
import { ArrowRight, Calendar, Award, Users, Heart } from 'lucide-react'
import SprayLabel from '@/components/ui/spray-label'

const timeline = [
  { year: '1981', event: 'Primul curs de dans modern în Iași', highlight: true },
  { year: '1995', event: 'Introducerea stilurilor street dance', highlight: false },
  { year: '2003', event: 'Primul spectacol Quasar cu 200+ dansatori', highlight: false },
  { year: '2010', event: 'Expansiune — trei locații în Iași', highlight: false },
  { year: '2015', event: 'Peste 5.000 de membri activi', highlight: false },
  { year: '2024', event: '43 de ani de dans continuu', highlight: true },
]

const values = [
  {
    icon: Heart,
    title: 'Pasiune & Autenticitate',
    desc: 'Dansul nu e doar mișcare — e expresie. Fiecare curs începe cu inima, nu doar cu pașii.',
  },
  {
    icon: Users,
    title: 'Comunitate solidă',
    desc: 'Nu formăm doar dansatori, ci o familie. Legăturile create aici durează ani de zile.',
  },
  {
    icon: Award,
    title: 'Excelență pedagogică',
    desc: 'Metodologie structurată, progresie clară, rezultate măsurabile. Facem dans serios.',
  },
  {
    icon: Calendar,
    title: 'Consistență & Dedicare',
    desc: '43 de ani de activitate neîntreruptă. Nu suntem un trend — suntem o instituție.',
  },
]

const instructors = [
  {
    name: 'Alexandru Munteanu',
    role: 'Fondator & Director Artistic',
    specialization: 'Street Dance · Hip-Hop',
    desc: 'Co-fondator al stilului urban Quasar. Peste 20 de ani de dans, coregrafie și mentorat. A format sute de dansatori de la zero.',
    image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=600&q=80',
    years: '40+ ani',
    isFounder: true,
  },
  {
    name: 'Ioana Popescu',
    role: 'Instructor Principal',
    specialization: 'Gimnastică artistică · Flexibilitate',
    desc: 'Fostă gimnastă de performanță, acum instructor de top. Metodologia ei îmbină rigoarea cu bucuria mișcării.',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80',
    years: '12+ ani',
    isFounder: false,
  },
  {
    name: 'Cristina Neagu',
    role: 'Instructor KPOP',
    specialization: 'KPOP · Commercial Dance',
    desc: 'Specialistă în K-POP și commercial dance. Coregrafiile ei sunt imediat recunoscute în comunitatea Quasar.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80',
    years: '8+ ani',
    isFounder: false,
  },
  {
    name: 'Andrei Stoica',
    role: 'Instructor Breaking',
    specialization: 'Breaking · Acrobatică',
    desc: 'Campion național de breaking. Aduce energia competițiilor în sala de curs și formează noua generație.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    years: '6+ ani',
    isFounder: false,
  },
  {
    name: 'Maria Ionescu',
    role: 'Instructor Copii',
    specialization: 'Dans pentru copii 4-8 ani',
    desc: 'Specialist în pedagogie pentru copii. Transformă energia lor în mișcare creativă și disciplinată.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
    years: '10+ ani',
    isFounder: false,
  },
  {
    name: 'David Radu',
    role: 'Instructor Contemporary',
    specialization: 'Dans contemporan · Improvizație',
    desc: 'Absolvent de coregrafie la București. Aduce dans contemporan autentic în Quasar.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
    years: '5+ ani',
    isFounder: false,
  },
]

const differentiators = [
  {
    num: '01',
    title: 'Rădăcini autentice de street dance',
    desc: 'Quasar a adus street dance-ul în România înainte ca termenul să existe în dicționar. Metodologia vine din sursă directă.',
  },
  {
    num: '02',
    title: 'Metodologie academică',
    desc: 'Fiecare instructor urmează o pregătire pedagogică specifică. Construim cursuri cu structură, progresie și rezultate măsurabile.',
  },
  {
    num: '03',
    title: 'Instructori formați în sistem Quasar',
    desc: 'Mulți dintre instructorii noștri au crescut în Quasar. Ei transmit mai mult decât pași — transmit spiritul Quasar.',
  },
]

export default function DespreNoiSection() {
  const [sectionRef, inView] = useInView<HTMLElement>()

  return (
    <section id="despre" ref={sectionRef} className="bg-white">
      {/* Hero intro cu background photo */}
      <div className="relative bg-[#231f20] py-20 md:py-32 overflow-hidden">
        {/* Background photo — team photo with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/quasar-team.jpg')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#231f20]/80 via-[#231f20]/60 to-[#231f20]" aria-hidden="true" />

        <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
          <div className="mb-6 inline-block"><SprayLabel>Povestea Quasar</SprayLabel></div>
          <h1
            className={`text-white text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-balance mb-6 reveal ${inView ? 'in-view' : ''}`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            43 de ani de dans.
            <br />
            <span className="text-[#f8ef21]">O singură familie.</span>
          </h1>
          <p className={`text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto reveal ${inView ? 'in-view' : ''}`} style={{ transitionDelay: '100ms' }}>
            De la primul curs în 1981 până astăzi, Quasar a crescut generații întregi de dansatori.
            Nu suntem doar o școală — suntem o mișcare culturală care a schimbat scena de dans din România.
          </p>
        </div>
      </div>

      {/* Misiune & Valori */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          <div>
            <div className="mb-4"><SprayLabel>Misiunea noastră</SprayLabel></div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Formăm dansatori.
              <br />
              <span className="text-[#231f20]/40">Construim caractere.</span>
            </h2>
            <p className="text-[#6b6b6b] text-base leading-relaxed">
              Quasar a fost fondat cu o convingere simplă: dansul poate schimba vieți. Nu predăm doar pași —
              predăm disciplină, creativitate, încredere, munca în echipă. Fiecare elev care trece pragul nostru
              pleacă cu mai mult decât tehnicii de dans. Pleacă cu o filozofie de viață.
            </p>
          </div>
          <div className="md:pt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((value, i) => (
                <div
                  key={value.title}
                  className={`border border-[#e5e5e5] rounded-2xl p-6 hover:border-[#f8ef21] hover:bg-[#f8ef21]/5 transition-all duration-300 reveal ${inView ? 'in-view' : ''}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <value.icon size={28} className="text-[#f8ef21] mb-3" strokeWidth={2} />
                  <h3
                    className="text-[#231f20] text-base font-bold mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {value.title}
                  </h3>
                  <p className="text-[#6b6b6b] text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline istoric */}
      <div className="bg-[#f8f8f8] py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div className="text-center mb-16">
            <div className="mb-4 inline-block"><SprayLabel>Istoric · Timeline</SprayLabel></div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Fiecare an a contat.
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] md:left-1/2 md:-ml-[1px] top-0 bottom-0 w-[2px] bg-[#e5e5e5]" aria-hidden="true" />

            {timeline.map((item, i) => (
              <div
                key={item.year}
                className={`relative flex items-center mb-12 last:mb-0 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Year badge */}
                <div className="absolute left-0 md:left-1/2 md:-ml-10 z-10">
                  <div
                    className={`w-20 h-10 flex items-center justify-center rounded-full font-black text-sm transition-all duration-300 ${
                      item.highlight
                        ? 'bg-[#f8ef21] text-[#231f20] scale-110'
                        : 'bg-white border-2 border-[#e5e5e5] text-[#6b6b6b]'
                    }`}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {item.year}
                  </div>
                </div>

                {/* Content */}
                <div className={`ml-28 md:ml-0 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'} md:w-1/2`}>
                  <div
                    className={`inline-block border border-[#e5e5e5] bg-white rounded-xl p-5 hover:border-[#f8ef21] hover:shadow-lg transition-all duration-300 ${
                      item.highlight ? 'border-[#f8ef21] shadow-md' : ''
                    }`}
                  >
                    <p
                      className="text-[#231f20] text-base font-bold leading-snug"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {item.event}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* De ce Quasar — Differentiators compact */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="text-center mb-12">
          <div className="mb-4 inline-block"><SprayLabel>De ce Quasar</SprayLabel></div>
          <h2
            className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance mx-auto"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Nu orice școală e Quasar.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {differentiators.map((item) => (
            <div
              key={item.num}
              className="border border-[#e5e5e5] rounded-2xl p-8 hover:bg-[#231f20] group transition-all duration-300"
            >
              <span
                className="text-[#f8ef21] text-sm font-black block mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {item.num}
              </span>
              <h3
                className="text-[#231f20] group-hover:text-white text-xl font-bold mb-3 transition-colors duration-300"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {item.title}
              </h3>
              <p className="text-[#6b6b6b] group-hover:text-white/70 text-sm leading-relaxed transition-colors duration-300">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Fondator + Echipa */}
      <div className="bg-[#f8f8f8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-16">
            <div className="mb-4 inline-block"><SprayLabel>Echipa Quasar</SprayLabel></div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Nu suntem doar instructori.
              <br />
              <span className="text-[#231f20]/40">Suntem mentori.</span>
            </h2>
          </div>

          {/* Founder spotlight */}
          {instructors
            .filter((inst) => inst.isFounder)
            .map((founder) => (
              <div key={founder.name} className="mb-16 bg-white border border-[#e5e5e5] rounded-3xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Photo */}
                  <div className="relative h-96 md:h-auto overflow-hidden bg-[#f5f5f5]">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${founder.image}')` }}
                      aria-hidden="true"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className="bg-[#f8ef21] text-[#231f20] text-xs font-black px-4 py-2 rounded-full"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        Fondator
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h3
                      className="text-[#231f20] text-3xl md:text-4xl font-black mb-2"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {founder.name}
                    </h3>
                    <div
                      className="text-[#f8ef21] text-sm font-bold uppercase tracking-wider mb-1"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {founder.role}
                    </div>
                    <div className="text-[#6b6b6b] text-xs font-semibold uppercase tracking-wider mb-6">
                      {founder.specialization}
                    </div>
                    <p className="text-[#6b6b6b] text-base leading-relaxed mb-6">{founder.desc}</p>
                    <div className="flex items-center gap-3">
                      <div className="bar-yellow" aria-hidden="true" />
                      <span
                        className="text-[#231f20] font-bold text-sm"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {founder.years} în Quasar
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {/* Instructor grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors
              .filter((inst) => !inst.isFounder)
              .map((inst) => (
                <div
                  key={inst.name}
                  className="group rounded-2xl overflow-hidden border border-[#e5e5e5] bg-white hover:shadow-xl transition-all duration-300"
                >
                  {/* Photo */}
                  <div className="relative h-80 overflow-hidden bg-[#f5f5f5]">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${inst.image}')` }}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-[#231f20]/0 group-hover:bg-[#231f20]/20 transition-all duration-300" aria-hidden="true" />
                    <div className="absolute bottom-3 left-3">
                      <span
                        className="text-xs font-bold bg-[#f8ef21] text-[#231f20] px-3 py-1 rounded-full"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {inst.years}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col gap-2">
                    <h3
                      className="text-[#231f20] text-xl font-bold"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {inst.name}
                    </h3>
                    <div
                      className="text-[#f8ef21] text-xs font-bold uppercase tracking-wider"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {inst.role}
                    </div>
                    <div className="text-[#6b6b6b] text-xs font-semibold uppercase tracking-wider mb-2">
                      {inst.specialization}
                    </div>
                    <p className="text-[#6b6b6b] text-sm leading-relaxed">{inst.desc}</p>
                  </div>
                </div>
              ))}
          </div>

          {/* CTA către cursuri */}
          <div className="mt-16 text-center">
            <p className="text-[#6b6b6b] text-base mb-6">
              Gata să începi? Descoperă cursul perfect pentru tine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#cursuri"
                className="inline-flex items-center justify-center gap-2 bg-[#f8ef21] text-[#231f20] text-base font-black px-8 py-4 rounded-full hover:bg-white transition-all duration-200"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Vezi toate cursurile <ArrowRight size={16} />
              </a>
              <a
                href="#quiz"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#231f20] text-[#231f20] text-base font-bold px-8 py-4 rounded-full hover:bg-[#231f20] hover:text-white transition-all duration-200"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Găsește cursul tău <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
