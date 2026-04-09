'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Award, Users, Heart, Target, Calendar, MapPin } from 'lucide-react'
import SprayLabel from '@/components/ui/spray-label'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'

// Timeline data
const timelineEvents = [
  { year: '1981', title: 'Începutul', desc: 'Prima sală de dans în Iași — clubul Quasar se naște din pasiune pură pentru mișcare.' },
  { year: '1995', title: 'Street Dance în România', desc: 'Aducem primele stiluri de street dance în România — Hip-Hop, Breaking, Popping.' },
  { year: '2003', title: 'Primul Campionat', desc: 'Organizăm prima competiție urbană de dans din Moldova — Quasar Battle.' },
  { year: '2010', title: 'Școlile Quasar', desc: 'Extindere: deschidere sălii de pe Str. Sărăriei — infrastructură profesională.' },
  { year: '2018', title: 'K-POP & Commercial', desc: 'Programele se diversifică: K-POP, Commercial Dance, Waacking, Voguing.' },
  { year: '2024', title: 'Astăzi', desc: 'Peste 500 de elevi activi, 25+ instructori, 3 săli. 43 de ani de dans.' },
]

// Values
const values = [
  { icon: Heart, title: 'Pasiune autentică', desc: 'Dansul nu e job. E identitate.' },
  { icon: Users, title: 'Comunitate', desc: 'Quasar e o familie. Nu doar o școală.' },
  { icon: Award, title: 'Excelență', desc: 'Standard ridicat — de la nivel 1 la pro.' },
  { icon: Target, title: 'Evoluție', desc: 'Nu repetăm formule. Inovăm constant.' },
]

// Instructors data
const instructors = [
  {
    slug: 'alexandru-miron',
    name: 'Alexandru Miron',
    role: 'Fondator & Head Instructor',
    specialization: 'Street Dance · Hip-Hop · Breaking',
    bio: 'Co-fondator Quasar Dance în 1981. Peste 40 de ani dedicați dansului urban. A format sute de dansatori profesioniști și a adus primele stiluri street în România. Viziunea sa a transformat o pasiune locală într-o instituție națională.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
    years: '40+ ani în dans',
    courses: ['Street Dance Kids', 'Hip-Hop Adulți', 'Breaking Workshop'],
    achievements: ['Fondator Quasar Dance', 'Pioneer Street Dance în România', 'Coregraf 100+ spectacole'],
    isFounder: true,
  },
  {
    slug: 'ioana-popescu',
    name: 'Ioana Popescu',
    role: 'Instructor Principal',
    specialization: 'Gimnastică Artistică · Acrobație',
    bio: 'Fostă gimnastă de performanță, acum instructor de top la Quasar. Metodologia ei îmbină rigoarea sportivă cu bucuria mișcării. Specializată în pregătire tehnică pentru copii 4-12 ani.',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80',
    years: '12+ ani în Quasar',
    courses: ['Gimnastică Copii 4-7 ani', 'Gimnastică Avansați', 'Acrobație pentru Dans'],
    achievements: ['Fostă gimnastă lotul național', 'Certificare FPTR', '500+ elevi formați'],
    isFounder: false,
  },
  {
    slug: 'cristina-nedelcu',
    name: 'Cristina Nedelcu',
    role: 'Instructor K-POP & Commercial',
    specialization: 'K-POP · Commercial Dance · Choreography',
    bio: 'Specialistă în K-POP și commercial dance. Coregrafiile ei sunt imediat recunoscute în comunitatea Quasar. A studiat în Seul și aduce influențe directe din industria coreeană.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80',
    years: '8+ ani în Quasar',
    courses: ['K-POP Teens', 'K-POP Adulți', 'Commercial Dance'],
    achievements: ['Training în Seul (1MILLION Dance)', 'Coregraf oficial Quasar', 'Viral TikTok 2M+ views'],
    isFounder: false,
  },
  {
    slug: 'andrei-stan',
    name: 'Andrei Stan',
    role: 'Instructor Hip-Hop',
    specialization: 'Hip-Hop · House · Locking',
    bio: 'Crescut în Quasar de la 8 ani, acum instructor de Hip-Hop și House. Stilul lui e o fuziune între old-school și contemporary urban. Mentor pentru generația tânără.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    years: '15+ ani în Quasar (6 ca instructor)',
    courses: ['Hip-Hop Kids', 'Hip-Hop Intermediar', 'House Dance'],
    achievements: ['Campion național Street Dance', 'Battle organizer', 'Quasar Alumni → Instructor'],
    isFounder: false,
  },
  {
    slug: 'maria-ionescu',
    name: 'Maria Ionescu',
    role: 'Instructor Contemporary',
    specialization: 'Contemporary · Modern Jazz · Improvisation',
    bio: 'Background în balet clasic și modern jazz, acum specializată în contemporary. Predă tehnici de improvizație și expresie corporală. Stilul ei e fluid, emoțional, profund.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
    years: '10+ ani în Quasar',
    courses: ['Contemporary Teens', 'Modern Jazz', 'Improvisation Lab'],
    achievements: ['Diplomă Royal Academy of Dance', 'Coregraf spectacole teatru', 'Guest teacher EU workshops'],
    isFounder: false,
  },
]

function useInView() {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, inView] as const
}

export default function DespreNoiPage() {
  const [heroRef, heroInView] = useInView()
  const [timelineRef, timelineInView] = useInView()
  const [teamRef, teamInView] = useInView()

  const founder = instructors.find(i => i.isFounder)
  const team = instructors.filter(i => !i.isFounder)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#231f20] overflow-hidden">
        {/* Background photo overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('/images/quasar-team.jpg')" }}
          aria-hidden="true"
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-3xl">
            <div className="mb-6">
              <SprayLabel>Despre noi</SprayLabel>
            </div>
            <h1
              className={`text-white text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 reveal ${heroInView ? 'in-view' : ''}`}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              43 de ani de dans.
              <br />
              <span className="text-[#f8ef21]">O singură poveste.</span>
            </h1>
            <p className={`text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl reveal ${heroInView ? 'in-view' : ''}`} style={{ transitionDelay: '100ms' }}>
              De la un club underground în 1981 până la cea mai longevivă școală de dans din România. 
              Quasar nu e doar dans — e identitate, comunitate, familie.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Mission */}
            <div>
              <div className="mb-4"><SprayLabel>Misiunea noastră</SprayLabel></div>
              <h2
                className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight mb-6 text-balance"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Formăm dansatori.
                <br />
                <span className="text-[#231f20]/40">Construim caracter.</span>
              </h2>
              <p className="text-[#6b6b6b] text-base leading-relaxed mb-4">
                Quasar nu e doar despre pași. E despre disciplină, respect, auto-expresie și comunitate. 
                Credem că dansul dezvoltă mai mult decât tehnica — dezvoltă încredere, creativitate și reziliență.
              </p>
              <p className="text-[#6b6b6b] text-base leading-relaxed">
                Fiecare curs e construit să te facă să evoluezi — nu doar ca dansator, ci ca om. 
                De aceea părinții aleg Quasar și de aceea elevii rămân ani de zile.
              </p>
            </div>

            {/* Values */}
            <div>
              <h3
                className="text-[#231f20] text-2xl font-bold mb-8"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Valorile care ne definesc
              </h3>
              <div className="grid gap-6">
                {values.map((val, i) => (
                  <div key={val.title} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#f8ef21] flex items-center justify-center">
                      <val.icon size={22} className="text-[#231f20]" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4
                        className="text-[#231f20] text-lg font-bold mb-1"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {val.title}
                      </h4>
                      <p className="text-[#6b6b6b] text-sm leading-relaxed">{val.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section ref={timelineRef} className="py-20 md:py-28 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12">
            <div className="mb-4"><SprayLabel>Istoria noastră</SprayLabel></div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              De la underground
              <br />
              <span className="text-[#f8ef21] [-webkit-text-stroke:1px_#231f20]">la instituție.</span>
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[2px] bg-[#f8ef21]" aria-hidden="true" />

            {/* Events */}
            <div className="space-y-12">
              {timelineEvents.map((event, i) => (
                <div
                  key={event.year}
                  className={`relative flex flex-col md:flex-row items-start gap-8 ${
                    i % 2 === 0 ? 'md:flex-row-reverse' : ''
                  } reveal ${timelineInView ? 'in-view' : ''}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {/* Year badge */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 -translate-y-1 md:translate-y-0">
                    <div
                      className="bg-[#f8ef21] text-[#231f20] font-black text-sm px-4 py-2 rounded-full border-4 border-[#f5f5f5]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {event.year}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:w-1/2 pl-16 md:pl-0">
                    <div className={`bg-white p-6 rounded-2xl border border-[#e5e5e5] ${i % 2 === 0 ? 'md:mr-16' : 'md:ml-16'}`}>
                      <h3
                        className="text-[#231f20] text-xl font-bold mb-2"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {event.title}
                      </h3>
                      <p className="text-[#6b6b6b] text-sm leading-relaxed">{event.desc}</p>
                    </div>
                  </div>

                  {/* Spacer for the other side */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators (compact) */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12">
            <div className="mb-4"><SprayLabel>De ce Quasar?</SprayLabel></div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Nu orice școală
              <br />
              <span className="text-[#f8ef21] [-webkit-text-stroke:1px_#231f20]">e Quasar.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#231f20] p-8 rounded-2xl">
              <h3 className="text-[#f8ef21] text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Rădăcini autentice
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Street dance-ul românesc a început la Quasar. Nu importăm trend-uri — noi le-am adus primii.
              </p>
            </div>
            <div className="bg-[#231f20] p-8 rounded-2xl">
              <h3 className="text-[#f8ef21] text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Metodologie academică
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Structură, progresie, evaluare. Nu improvizăm — construim sistematic.
              </p>
            </div>
            <div className="bg-[#231f20] p-8 rounded-2xl">
              <h3 className="text-[#f8ef21] text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Comunitate reală
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Nu clienți — familie. Generații întregi au crescut în Quasar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      {founder && (
        <section className="py-20 md:py-28 bg-[#f5f5f5]">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="mb-12">
              <div className="mb-4"><SprayLabel>Fondator</SprayLabel></div>
              <h2
                className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Omul din spatele
                <br />
                <span className="text-[#f8ef21] [-webkit-text-stroke:1px_#231f20]">mișcării.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-5 gap-8 items-start">
              {/* Photo */}
              <div className="md:col-span-2">
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#231f20]">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${founder.image}')` }}
                  />
                  <div className="absolute bottom-4 left-4">
                    <span
                      className="text-xs font-bold bg-[#f8ef21] text-[#231f20] px-3 py-1.5 rounded-full"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {founder.years}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="md:col-span-3">
                <h3
                  className="text-[#231f20] text-3xl font-black mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {founder.name}
                </h3>
                <div
                  className="text-[#f8ef21] text-sm font-bold uppercase tracking-wider bg-[#231f20] rounded-full px-4 py-1.5 inline-block mb-6"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {founder.role}
                </div>
                <p className="text-[#6b6b6b] text-base leading-relaxed mb-6">{founder.bio}</p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4
                      className="text-[#231f20] text-sm font-bold mb-3 uppercase tracking-wide"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Specializări
                    </h4>
                    <p className="text-[#6b6b6b] text-sm">{founder.specialization}</p>
                  </div>
                  <div>
                    <h4
                      className="text-[#231f20] text-sm font-bold mb-3 uppercase tracking-wide"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Realizări
                    </h4>
                    <ul className="space-y-1">
                      {founder.achievements.map((ach, i) => (
                        <li key={i} className="text-[#6b6b6b] text-sm flex items-start gap-2">
                          <span className="text-[#f8ef21] mt-1">→</span>
                          {ach}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  href={`/despre-noi/${founder.slug}`}
                  className="inline-flex items-center gap-2 bg-[#f8ef21] text-[#231f20] font-bold text-sm px-6 py-3 rounded-full hover:bg-[#231f20] hover:text-[#f8ef21] transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Vezi profil complet <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      <section ref={teamRef} className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12">
            <div className="mb-4"><SprayLabel>Echipa Quasar</SprayLabel></div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Instructorii tăi.
              <br />
              <span className="text-[#231f20]/40">Mentorii tăi.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((inst, i) => (
              <Link
                key={inst.slug}
                href={`/despre-noi/${inst.slug}`}
                className={`group rounded-2xl overflow-hidden border border-[#e5e5e5] card-lift reveal ${teamInView ? 'in-view' : ''}`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                {/* Photo */}
                <div className="relative h-80 overflow-hidden bg-[#f5f5f5]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${inst.image}')` }}
                  />
                  <div className="absolute inset-0 bg-[#231f20]/0 group-hover:bg-[#231f20]/20 transition-all duration-300" />
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
                <div className="p-5 flex flex-col gap-2">
                  <h3
                    className="text-[#231f20] text-lg font-bold group-hover:text-[#f8ef21] transition-colors"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {inst.name}
                  </h3>
                  <div
                    className="text-[#f8ef21] text-[0.65rem] font-bold uppercase tracking-wider bg-[#231f20] rounded-full px-3 py-1 self-start"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {inst.role}
                  </div>
                  <p className="text-[#6b6b6b] text-xs leading-relaxed mt-1 line-clamp-2">
                    {inst.specialization}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="py-20 md:py-28 bg-[#231f20]">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <h2
            className="text-white text-3xl md:text-5xl font-black leading-tight mb-6 text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Gata să faci parte
            <br />
            <span className="text-[#f8ef21]">din Quasar?</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Alege cursul potrivit sau lasă-ne să te ajutăm să-l descoperi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#cursuri"
              className="btn-yellow inline-flex items-center justify-center text-[#231f20] font-black text-base px-8 py-3.5 w-full sm:w-auto"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Vezi toate cursurile
            </Link>
            <Link
              href="/#quiz"
              className="inline-flex items-center justify-center border-2 border-white/30 text-white font-bold text-base px-8 py-3.5 rounded-full hover:border-[#f8ef21] hover:text-[#f8ef21] transition-all duration-300 w-full sm:w-auto"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Găsește cursul tău
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
