import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SprayLabel from '@/components/ui/spray-label'

const instructors = [
  {
    name: 'Alexandru M.',
    role: 'Street Dance · Hip-Hop',
    desc: 'Co-fondator al stilului urban Quasar. Peste 20 de ani de dans, coregrafie și mentorat. A format sute de dansatori de la zero.',
    image: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&q=80',
    years: '20+ ani în Quasar',
  },
  {
    name: 'Ioana P.',
    role: 'Gimnastică artistică',
    desc: 'Fostă gimnastă de performanță, acum instructor de top. Metodologia ei îmbină rigoarea cu bucuria mișcării.',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80',
    years: '12+ ani în Quasar',
  },
  {
    name: 'Cristina N.',
    role: 'KPOP · Commercial Dance',
    desc: 'Specialistă în K-POP și commercial dance. Coregrafiile ei sunt imediat recunoscute în comunitatea Quasar.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    years: '8+ ani în Quasar',
  },
]

export default function InstructorsSection() {
  return (
    <section id="instructori" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <div className="mb-4"><SprayLabel>Echipa noastră</SprayLabel></div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Nu suntem doar instructori.
              <br />
              <span className="text-[#231f20]/40">Suntem mentori.</span>
            </h2>
          </div>
          <Link
            href="#echipa"
            className="inline-flex items-center gap-2 text-[#231f20]/50 hover:text-[#231f20] text-sm font-semibold transition-colors self-start md:self-auto"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Vezi echipa completă <ArrowRight size={14} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
          {instructors.map((inst) => (
            <div
              key={inst.name}
              className="group rounded-2xl overflow-hidden border border-[#e5e5e5] card-lift"
            >
              {/* Photo */}
              <div className="relative h-72 overflow-hidden bg-[#f5f5f5]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${inst.image}')` }}
                  aria-hidden="true"
                />
                {/* Overlay on hover */}
                <div
                  className="absolute inset-0 bg-[#231f20]/0 group-hover:bg-[#231f20]/20 transition-all duration-300"
                  aria-hidden="true"
                />
                {/* Years badge */}
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
                  className="text-[#f8ef21] text-xs font-bold uppercase tracking-wider bg-[#231f20] rounded-full px-3 py-1 self-start"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {inst.role}
                </div>
                <p className="text-[#6b6b6b] text-sm leading-relaxed mt-1">{inst.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
