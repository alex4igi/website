const groups = [
  {
    id: 'tiny',
    label: 'Tiny',
    age: '4 – 7 ani',
    desc: 'Primii pași în dans prin joc, muzică și mișcare liberă. Grupuri mici, instructori dedicați.',
    color: '#f8ef21',
    textColor: '#231f20',
    courses: ['Street Dance', 'Gimnastică acrobatică'],
  },
  {
    id: 'junior',
    label: 'Junior',
    age: '7 – 10 ani',
    desc: 'Baza tehnică se consolidează. Ritm, coordonare, primele coregrafii de grup.',
    color: '#231f20',
    textColor: '#ffffff',
    courses: ['Street Dance', 'KPOP Dance', 'Gimnastică acrobatică'],
  },
  {
    id: 'varsity',
    label: 'Varsity',
    age: '11 – 15 ani',
    desc: 'Stil personal, expresie artistică și primele competiții. Energia la maximum.',
    color: '#3a3637',
    textColor: '#ffffff',
    courses: ['Street Dance', 'KPOP Dance', 'Gimnastică acrobatică'],
  },
  {
    id: 'teens',
    label: 'Teens',
    age: '15 – 18 ani',
    desc: 'Performanță, spectacole Quasar și concursuri naționale. Comunitate strânsă.',
    color: '#f8ef21',
    textColor: '#231f20',
    courses: ['Street Dance', 'KPOP Dance', 'Gimnastică acrobatică'],
  },
  {
    id: 'students',
    label: 'Students',
    age: '19 – 25 ani',
    desc: 'Program flexibil, vibe tânăr, coregrafii actuale. Cel mai bun workout social din Iași.',
    color: '#231f20',
    textColor: '#ffffff',
    courses: ['Street Dance', 'KPOP Dance'],
  },
  {
    id: 'adults',
    label: 'Adults',
    age: '25+ ani',
    desc: 'Fără vârstă maximă. Dans pentru bucurie, sănătate și comunitate la orice vârstă.',
    color: '#3a3637',
    textColor: '#ffffff',
    courses: ['Street Dance', 'Zumba'],
  },
]

import SprayLabel from '@/components/ui/spray-label'

export default function AgeGroupsSection() {
  return (
    <section className="bg-[#231f20] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="mb-4"><SprayLabel>Grupele de vârstă</SprayLabel></div>
          <h2
            className="text-white text-3xl md:text-5xl font-extrabold leading-tight text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Există un loc pentru tine,
            <br />
            <span className="text-[#f8ef21]">indiferent de vârstă.</span>
          </h2>
          <p className="text-white/60 mt-5 text-base leading-relaxed">
            Quasar acoperă toate grupele de vârstă cu cursuri gândite specific pentru fiecare etapă de dezvoltare.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {groups.map((g) => (
            <div
              key={g.id}
              className="rounded-2xl p-7 flex flex-col gap-4 card-lift transition-all duration-300 hover:ring-2 hover:ring-[#f8ef21]/40"
              style={{ background: g.color, color: g.textColor }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-2xl font-extrabold"
                  style={{ fontFamily: 'var(--font-display)', color: g.textColor }}
                >
                  {g.label}
                </span>
                <span
                  className="text-sm font-bold px-3 py-1 rounded-full"
                  style={{
                    background:
                      g.color === '#f8ef21' ? 'rgba(35,31,32,0.12)' : 'rgba(248,239,33,0.15)',
                    color: g.color === '#f8ef21' ? '#231f20' : '#f8ef21',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {g.age}
                </span>
              </div>

              <p
                className="text-sm leading-relaxed"
                style={{ color: g.textColor, opacity: g.textColor === '#ffffff' ? 0.75 : 0.7 }}
              >
                {g.desc}
              </p>

              <div className="mt-auto flex flex-col gap-1.5">
                {g.courses.map((c) => (
                  <div
                    key={c}
                    className="flex items-center gap-2 text-xs font-semibold"
                    style={{ color: g.textColor, opacity: 0.9, fontFamily: 'var(--font-display)' }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        background: g.color === '#f8ef21' ? '#231f20' : '#f8ef21',
                      }}
                      aria-hidden="true"
                    />
                    {c}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
