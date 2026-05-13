import SprayLabel from '@/components/ui/spray-label'

const pricingPlans = [
  {
    name: 'Lunar',
    price: '200 lei',
    period: '/lună',
    desc: '8 ore de curs pe lună, acces la spectacole',
    features: ['2 ore/săptămână', 'Acces 1 locație', 'Spectacol anual inclus'],
    highlight: false,
  },
  {
    name: 'Semestrial',
    price: '1.100 lei',
    period: '/6 luni',
    desc: 'Cel mai popular. Economisești față de plata lunară.',
    features: ['2 ore/săptămână', 'Acces toate locațiile', 'Spectacol + competiție inclusă', 'Evaluare progres'],
    highlight: true,
  },
  {
    name: 'Anual',
    price: '1.900 lei',
    period: '/an',
    desc: 'Cel mai bun preț. Experiență completă Quasar.',
    features: ['2 ore/săptămână', 'Acces toate locațiile', 'Spectacole + competiții', 'Camp de vară inclus', 'Prioritate la casting'],
    highlight: false,
  },
]

export default function PricingSection() {
  return (
    <section id="preturi" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-4"><SprayLabel>Prețuri</SprayLabel></div>
          <h2
            className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Alege pachetul
            <br />
            potrivit pentru tine
          </h2>
          <p className="text-[#6b6b6b] mt-4 max-w-2xl">
            Fără costuri ascunse. Plătești o singură dată și ai acces la tot ce ai nevoie.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col gap-5 border-2 card-lift ${
                plan.highlight
                  ? 'bg-[#231f20] border-[#f8ef21]'
                  : 'bg-white border-[#e5e5e5]'
              }`}
            >
              {plan.highlight && (
                <div className="self-start">
                  <SprayLabel>Cel mai ales</SprayLabel>
                </div>
              )}
              <div>
                <div
                  className={`text-sm font-bold uppercase tracking-wider mb-1 ${
                    plan.highlight ? 'text-white/60' : 'text-[#6b6b6b]'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {plan.name}
                </div>
                <div className="flex items-end gap-1">
                  <span
                    className={`text-4xl font-extrabold ${
                      plan.highlight ? 'text-[#f8ef21]' : 'text-[#231f20]'
                    }`}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm mb-1 ${
                      plan.highlight ? 'text-white/50' : 'text-[#6b6b6b]'
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>
              </div>

              <p
                className={`text-sm leading-relaxed ${
                  plan.highlight ? 'text-white/65' : 'text-[#6b6b6b]'
                }`}
              >
                {plan.desc}
              </p>

              <ul className="flex flex-col gap-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-[#f8ef21]"
                      aria-hidden="true"
                    />
                    <span className={plan.highlight ? 'text-white/80' : 'text-[#231f20]'}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#inscriere"
                className={`mt-2 text-center font-bold text-sm px-5 py-3 rounded-full transition-all duration-200 ${
                  plan.highlight
                    ? 'bg-[#f8ef21] text-[#231f20] hover:bg-white'
                    : 'bg-[#231f20] text-white hover:bg-[#3a3637]'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Înscrie-te acum
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
