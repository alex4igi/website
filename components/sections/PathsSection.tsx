'use client'

import { useInView } from '@/hooks/use-in-view'
import SprayLabel from '@/components/ui/spray-label'

const paths = [
  {
    id: 'street-dance',
    label: 'Street Dance',
    title: 'Street Dance',
    desc: 'Hip-Hop, breaking, popping, locking. Dansul urban autentic, pentru toate vârstele — de la Tiny la Adults.',
    age: 'Tiny → Adults · 4–99 ani',
    accent: '#f8ef21',
    accentText: '#231f20',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2148169349-ZC3rzFu9PcjgYnky1R8QTixywntVwU.jpg',
    href: '/program-si-preturi',
  },
  {
    id: 'kpop-dance',
    label: 'KPOP',
    title: 'KPOP Dance',
    desc: 'Coregrafii K-Pop actuale, energie maximă, comunitate vibrantă. De la Junior până la Students.',
    age: 'Junior → Students · 7–25 ani',
    accent: '#231f20',
    accentText: '#f8ef21',
    image: 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=600&q=80',
    href: '/program-si-preturi',
  },
  {
    id: 'gimnastica',
    label: 'Gimnastică',
    title: 'Gimnastică artistică',
    desc: 'Flexibilitate, echilibru și eleganță. Program structurat cu metodologie profesionistă pentru copii și adolescenți.',
    age: 'Tiny → Teens · 4–18 ani',
    accent: '#3a3637',
    accentText: '#f8ef21',
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=80',
    href: '/program-si-preturi',
  },
  {
    id: 'zumba',
    label: 'Zumba',
    title: 'Zumba (Adults)',
    desc: 'Workout cu ritmuri latino, distractiv și intens. Energie pură pentru adulți, fără presiune tehnică.',
    age: 'Adults · 25+ ani',
    accent: '#f8ef21',
    accentText: '#231f20',
    image: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=600&q=80',
    href: '/program-si-preturi',
  },
]

export default function PathsSection() {
  const [sectionRef, inView] = useInView<HTMLElement>({ threshold: 0.1 })

  return (
    <section ref={sectionRef} id="cursuri" className="bg-[#231f20] py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Header */}
        <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 reveal ${inView ? 'in-view' : ''}`}>
          <div>
            <div className="mb-4"><SprayLabel>Alege drumul tău</SprayLabel></div>
            <h2
              className="text-white text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Cursuri pentru
              <span className="text-[#f8ef21]"> fiecare</span>
            </h2>
          </div>
          <a
            href="/program-si-preturi"
            className="inline-flex items-center gap-2 text-white/40 hover:text-[#f8ef21] text-sm font-bold transition-colors duration-200"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Toate cursurile &rarr;
          </a>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paths.map((path, i) => (
            <a
              key={path.id}
              href={path.href}
              className={`group relative flex flex-col overflow-hidden rounded-2xl cursor-pointer min-h-[360px] reveal ${inView ? 'in-view' : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
              aria-label={`Cursuri ${path.title}`}
            >
              {/* Image with zoom on hover */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                style={{ backgroundImage: `url('${path.image}')` }}
                aria-hidden="true"
              />
              {/* Overlay — darkens more on hover */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(to top, rgba(35,31,32,0.96) 0%, rgba(35,31,32,0.45) 55%, rgba(35,31,32,0.2) 100%)',
                }}
                aria-hidden="true"
              />

              {/* Accent bottom border revealed on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                style={{ background: path.accent }}
                aria-hidden="true"
              />

              {/* Label badge */}
              <div className="relative z-10 p-5">
                <span
                  className="inline-block text-xs font-black uppercase tracking-[0.14em] px-3 py-1 rounded-full"
                  style={{ background: path.accent, color: path.accentText, fontFamily: 'var(--font-display)' }}
                >
                  {path.label}
                </span>
              </div>

              {/* Bottom content */}
              <div className="relative z-10 mt-auto p-5 flex flex-col gap-2">
                <div
                  className="text-white/45 text-xs font-semibold uppercase tracking-widest"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {path.age}
                </div>
                <h3
                  className="text-white text-xl font-extrabold leading-snug group-hover:text-[#f8ef21] transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {path.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">{path.desc}</p>
                <span
                  className="mt-3 inline-flex items-center gap-1 text-[#f8ef21] text-sm font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Descoperă &rarr;
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
