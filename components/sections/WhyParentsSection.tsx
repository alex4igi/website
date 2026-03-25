const benefits = [
  {
    icon: '★',
    title: 'Încredere în sine',
    desc: 'Fiecare pas pe scenă construiește curaj real. Copiii descoperă că pot — și asta îi schimbă.',
  },
  {
    icon: '◆',
    title: 'Disciplină & perseverență',
    desc: 'Repetițiile, răbdarea și progresul constant formează caracterul, nu doar dansatorul.',
  },
  {
    icon: '●',
    title: 'Muncă în echipă',
    desc: 'Dans sincronizat, respect față de colegi, coregrafii colective — comunitate de la prima zi.',
  },
  {
    icon: '▲',
    title: 'Coordonare & sănătate',
    desc: 'Mișcarea regulată îmbunătățește postura, concentrarea și starea generală a copilului.',
  },
  {
    icon: '✦',
    title: 'Apartenență & comunitate',
    desc: 'Quasar nu e o sală. Este o familie. Prietenii de la dans devin prietenii pentru viață.',
  },
  {
    icon: '◉',
    title: 'Experiență pe scenă',
    desc: 'Spectacole, concursuri, flashmob-uri — emoția scenei transformă copiii în artiști.',
  },
]

export default function WhyParentsSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <div className="section-label mb-4">De ce părinții aleg Quasar</div>
          <h2
            className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Mai mult decât dans.
            <br />
            <span className="text-[#231f20] opacity-40">O investiție în viitorul copilului.</span>
          </h2>
          <p className="text-[#6b6b6b] mt-5 text-base md:text-lg leading-relaxed">
            La Quasar, copiii nu învață doar mișcări. Ei construiesc o versiune mai bună a lor — pas cu pas, spectacol cu spectacol.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="group flex flex-col gap-4 p-7 rounded-2xl bg-[#f5f5f5] hover:bg-[#231f20] transition-colors duration-300 card-lift"
            >
              {/* Icon */}
              <div
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#f8ef21] text-[#231f20] text-lg font-black flex-shrink-0 group-hover:bg-white transition-colors duration-300"
                aria-hidden="true"
              >
                {b.icon}
              </div>
              <h3
                className="text-[#231f20] group-hover:text-white text-lg font-bold transition-colors duration-300"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {b.title}
              </h3>
              <p className="text-[#6b6b6b] group-hover:text-white/70 text-sm leading-relaxed transition-colors duration-300">
                {b.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Pull-quote */}
        <div className="mt-16 flex flex-col md:flex-row items-center gap-6 bg-[#231f20] rounded-2xl p-8 md:p-12">
          <div className="flex-shrink-0 w-1 h-16 bg-[#f8ef21] rounded-full hidden md:block" aria-hidden="true" />
          <blockquote
            className="text-white text-xl md:text-2xl font-semibold leading-relaxed text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            &ldquo;Cel mai bun lucru pe care l-am făcut pentru copilul meu a fost să îl aduc la Quasar.
            A crescut nu doar ca dansator, ci ca om.&rdquo;
          </blockquote>
          <div className="md:ml-auto flex-shrink-0 text-right">
            <div
              className="text-[#f8ef21] font-bold text-sm"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Maria D.
            </div>
            <div className="text-white/50 text-xs mt-0.5">Părinte, membru din 2018</div>
          </div>
        </div>
      </div>
    </section>
  )
}
