const stats = [
  {
    value: '11.000+',
    label: 'tineri introduși la dans',
    desc: 'De-a lungul istoriei Quasar',
  },
  {
    value: '600+',
    label: 'membri activi',
    desc: 'În acest moment, în cele 3 locații',
  },
  {
    value: '200+',
    label: 'trofee & premii',
    desc: 'La concursuri naționale și internaționale',
  },
  {
    value: '50+',
    label: 'spectacole Quasar',
    desc: 'Producții complete, pe scene mari din Iași',
  },
]

const highlights = [
  'Dansatorii Quasar au reprezentat România la competiții internaționale',
  'Quasar deține recordul național pentru cel mai mare flashmob simultân',
  'Cea mai veche școală de street dance din Moldova',
  'Instructori formați timp de zeci de ani în sistemul Quasar',
]

export default function StatsSection() {
  return (
    <section className="bg-[#f8ef21] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div
            className="inline-flex items-center gap-2 text-[#231f20] bg-[#231f20]/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Impactul nostru
          </div>
          <h2
            className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Cifrele vorbesc
            <br />
            mai tare decât cuvintele.
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 stagger">
          {stats.map((stat) => (
            <div
              key={stat.value}
              className="flex flex-col gap-2 bg-[#231f20] rounded-2xl p-7 card-lift"
            >
              <span
                className="text-[#f8ef21] text-4xl md:text-5xl font-extrabold leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {stat.value}
              </span>
              <span
                className="text-white text-sm font-semibold leading-snug"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {stat.label}
              </span>
              <span className="text-white/50 text-xs leading-relaxed">{stat.desc}</span>
            </div>
          ))}
        </div>

        {/* Highlights strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-[#231f20]/10 rounded-xl px-5 py-4"
            >
              <span
                className="w-2 h-2 rounded-full bg-[#231f20] flex-shrink-0 mt-1.5"
                aria-hidden="true"
              />
              <p
                className="text-[#231f20] text-sm font-semibold leading-relaxed"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {h}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
