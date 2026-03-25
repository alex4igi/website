import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const courses = [
  {
    id: 'street-kids',
    category: 'Street Dance',
    title: 'Street Dance Kids',
    desc: 'Urban dance styles — hip-hop, breakdance, popping & locking — pentru copii cu energie și stil propriu.',
    audience: 'Copii 6–14 ani',
    tags: ['Hip-Hop', 'Breakdance', 'Urban'],
    image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=600&q=80',
    href: '#copii',
  },
  {
    id: 'studenti',
    category: 'Studenți',
    title: 'Dans pentru Studenți',
    desc: 'Coregrafii dinamice, muzică actuală, echipă vibrantă. Cel mai fresh curs pentru tinerii din Iași.',
    audience: 'Studenți 19–25 ani',
    tags: ['Commercial', 'Freestyle', 'Comunitate'],
    image: 'https://images.unsplash.com/photo-1554844347-c0c37cd35ef0?w=600&q=80',
    href: '#studenti',
  },
  {
    id: 'gimnastica',
    category: 'Gimnastică',
    title: 'Gimnastică artistică',
    desc: 'Metodologie completă pentru dezvoltarea flexibilității, forței și eleganței la orice vârstă.',
    audience: 'Copii 4–18 ani',
    tags: ['Flexibilitate', 'Acrobatică', 'Echilibru'],
    image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=600&q=80',
    href: '#gimnastica',
  },
  {
    id: 'kpop',
    category: 'KPOP',
    title: 'KPOP Dance',
    desc: 'Intri în universul K-POP cu coregrafii exacte, muzică trending și energie de grup totală.',
    audience: 'Teens & studenți',
    tags: ['K-POP', 'Grup', 'Performance'],
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    href: '#kpop',
  },
]

export default function CoursesGridSection() {
  return (
    <section id="cursuri-all" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="section-label mb-4">Cursurile noastre</div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Ce predăm la Quasar
            </h2>
          </div>
          <Link
            href="#program"
            className="inline-flex items-center gap-2 text-[#231f20]/50 hover:text-[#231f20] text-sm font-semibold transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Vezi programul complet <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group flex flex-col rounded-2xl overflow-hidden border border-[#e5e5e5] card-lift bg-white"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${course.image}')` }}
                  aria-hidden="true"
                />
                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className="section-label text-xs"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {course.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-3 p-5 flex-1">
                <div
                  className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {course.audience}
                </div>
                <h3
                  className="text-[#231f20] text-lg font-bold leading-snug"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {course.title}
                </h3>
                <p className="text-[#6b6b6b] text-sm leading-relaxed flex-1">{course.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold bg-[#f5f5f5] text-[#6b6b6b] px-2.5 py-1 rounded-full"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={course.href}
                  className="mt-2 inline-flex items-center gap-1 text-[#231f20] font-semibold text-sm hover:text-[#f8ef21] hover:bg-[#231f20] bg-[#f8ef21] px-4 py-2 rounded-full transition-all duration-200 self-start"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Detalii curs <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
