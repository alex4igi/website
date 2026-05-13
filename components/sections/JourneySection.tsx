const steps = [
  {
    num: '01',
    title: 'Începător',
    subtitle: 'Primii pași',
    desc: 'Fundamente de dans, coordonare, ritm, muzicalitate. Grupă prietenoasă, fără presiune.',
    tags: ['Baza tehnică', 'Ritm', 'Comunicare'],
  },
  {
    num: '02',
    title: 'Intermediar',
    subtitle: 'Stil & expresie',
    desc: 'Tehnica avansează, apar primele coregrafii complexe și primele apariții pe scenă.',
    tags: ['Coregrafie', 'Scenă', 'Stil personal'],
  },
  {
    num: '03',
    title: 'Avansat',
    subtitle: 'Tehnică & precizie',
    desc: 'Stăpânești stilul ales — Street Dance, KPOP, Gimnastică artistică sau Zumba. Pregătit pentru orice provocare.',
    tags: ['Tehnică', 'Specializare', 'Mentorat'],
  },
  {
    num: '04',
    title: 'Performanță',
    subtitle: 'Hobby sau pro',
    desc: 'Concursuri naționale, spectacole Quasar, flashmob-uri. Treci din sală pe orice scenă din România.',
    tags: ['Spectacole', 'Concursuri', 'Flashmob'],
  },
]

export default function JourneySection() {
  return (
    <section className="bg-[#f5f5f5] py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="max-w-xl mb-14">
          <div className="section-label mb-4">Sistemul de progres</div>
          <h2
            className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Drumul tău la Quasar
          </h2>
          <p className="text-[#6b6b6b] mt-4 text-base leading-relaxed">
            Fiecare dansator are propriul ritm. Sistemul Quasar asigură progres structurat la fiecare nivel.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Horizontal connector line (desktop) */}
          <div
            className="hidden md:block absolute top-[52px] left-0 right-0 h-px bg-[#e5e5e5] z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10 stagger">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col gap-4">
                {/* Number circle */}
                <div className="flex md:flex-col gap-4 md:gap-3 items-start md:items-start">
                  <div
                    className="w-14 h-14 rounded-full bg-[#231f20] flex items-center justify-center flex-shrink-0 relative"
                    aria-hidden="true"
                  >
                    <span
                      className="text-[#f8ef21] text-sm font-extrabold"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {step.num}
                    </span>
                    {/* Yellow dot connector */}
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#f8ef21]" />
                  </div>
                </div>

                {/* Content card */}
                <div className="bg-white rounded-2xl p-6 flex flex-col gap-3 card-lift border border-[#e5e5e5] flex-1">
                  <div
                    className="text-[#6b6b6b] text-xs font-semibold uppercase tracking-widest"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {step.subtitle}
                  </div>
                  <h3
                    className="text-[#231f20] text-xl font-bold"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-[#6b6b6b] text-sm leading-relaxed">{step.desc}</p>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-auto pt-3">
                    {step.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold bg-[#f5f5f5] text-[#231f20] px-3 py-1 rounded-full border border-[#e5e5e5]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA strip */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 bg-[#231f20] rounded-2xl px-8 py-6">
          <p
            className="text-white text-base font-semibold flex-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Nu ești sigur de unde să începi? Facem noi evaluarea gratuită.
          </p>
          <a
            href="#inscriere"
            className="bg-[#f8ef21] text-[#231f20] font-bold text-sm px-6 py-3 rounded-full hover:bg-white transition-colors whitespace-nowrap"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Programează evaluare
          </a>
        </div>
      </div>
    </section>
  )
}
