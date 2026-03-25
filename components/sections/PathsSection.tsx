import Link from 'next/link'

const paths = [
  {
    id: 'copii',
    label: 'Copii',
    title: 'Dans pentru copii',
    desc: 'Discipline, coordonare și multă distracție pentru micii dansatori. Grupe de vârstă de la 4 ani.',
    age: '4 – 14 ani',
    color: '#f8ef21',
    textColor: '#231f20',
    image:
      'https://images.unsplash.com/photo-1544717305-996b815c338c?w=600&q=80',
    href: '#copii',
  },
  {
    id: 'studenti',
    label: 'Studenți',
    title: 'Dans pentru studenți',
    desc: 'Comunitate, energie și coregrafii moderne. Cursuri gândite pentru stilul de viață al tinerilor.',
    age: '19 – 25 ani',
    color: '#231f20',
    textColor: '#ffffff',
    image:
      'https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=600&q=80',
    href: '#studenti',
  },
  {
    id: 'gimnastica',
    label: 'Gimnastică',
    title: 'Gimnastică artistică',
    desc: 'Flexibilitate, echilibru și eleganță. Program structurat cu metodologie profesionistă.',
    age: '4 – 18 ani',
    color: '#3a3637',
    textColor: '#ffffff',
    image:
      'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=80',
    href: '#gimnastica',
  },
  {
    id: 'kpop',
    label: 'KPOP',
    title: 'KPOP Dance',
    desc: 'Coregrafii K-POP actuale, muzică fresh și o comunitate vibrantă. Trend-aware, energie maximă.',
    age: '11 – 25 ani',
    color: '#f8ef21',
    textColor: '#231f20',
    image:
      'https://images.unsplash.com/photo-1520256862855-398228c41684?w=600&q=80',
    href: '#kpop',
  },
]

export default function PathsSection() {
  return (
    <section id="cursuri" className="bg-[#231f20] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="section-label mb-4">Alege drumul tău</div>
            <h2
              className="text-white text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Cursuri pentru
              <span className="text-[#f8ef21]"> fiecare</span>
            </h2>
          </div>
          <Link
            href="#cursuri-all"
            className="inline-flex items-center gap-2 text-white/60 hover:text-[#f8ef21] text-sm font-semibold transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Toate cursurile &rarr;
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          {paths.map((path) => (
            <Link
              key={path.id}
              href={path.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl card-lift cursor-pointer min-h-[340px]"
              aria-label={`Cursuri ${path.title}`}
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${path.image}')` }}
                aria-hidden="true"
              />
              {/* Dark overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(35,31,32,0.92) 0%, rgba(35,31,32,0.4) 55%, rgba(35,31,32,0.15) 100%)',
                }}
                aria-hidden="true"
              />

              {/* Label badge */}
              <div className="relative z-10 p-5">
                <span
                  className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{
                    background: path.color,
                    color: path.textColor,
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {path.label}
                </span>
              </div>

              {/* Bottom content */}
              <div className="relative z-10 mt-auto p-5 flex flex-col gap-2">
                <div
                  className="text-white/50 text-xs font-medium uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {path.age}
                </div>
                <h3
                  className="text-white text-xl font-bold leading-snug"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {path.title}
                </h3>
                <p className="text-white/65 text-sm leading-relaxed">{path.desc}</p>
                <span
                  className="mt-2 inline-flex items-center gap-1 text-[#f8ef21] text-sm font-semibold group-hover:gap-2 transition-all"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Descoperă &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
