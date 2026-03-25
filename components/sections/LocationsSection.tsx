import Link from 'next/link'
import { MapPin, Clock, Users } from 'lucide-react'

const locations = [
  {
    id: 'centru',
    name: 'Quasar Centru',
    address: 'Strada Lăpușneanu 14, Iași',
    desc: 'Sediul principal. Cel mai mare spațiu, cu săli multiple, vestiare complete și echipament profesionist.',
    courses: ['Street Dance', 'KPOP', 'Dans Studenți', 'Dans Adulți'],
    schedule: 'Lun–Sâm: 15:00–21:00',
    highlight: true,
    mapLink: '#',
  },
  {
    id: 'nicolina',
    name: 'Quasar Nicolina',
    address: 'Bulevardul Nicolina 50, Iași',
    desc: 'Locație modernă în cartierul Nicolina, ideală pentru familiile din sudul orașului.',
    courses: ['Street Dance Kids', 'Gimnastică', 'KPOP'],
    schedule: 'Lun–Vin: 15:00–20:00',
    highlight: false,
    mapLink: '#',
  },
  {
    id: 'kids',
    name: 'Quasar for Kids',
    address: 'Strada Sfântul Lazăr 7, Iași',
    desc: 'Spațiu dedicat exclusiv copiilor mici. Mediu sigur, colorat, adaptat pentru vârste 4–10 ani.',
    courses: ['Tiny Dance', 'Gimnastică Mică', 'Junior Street'],
    schedule: 'Lun–Sâm: 09:00–18:00',
    highlight: false,
    mapLink: '#',
  },
]

export default function LocationsSection() {
  return (
    <section id="locatii" className="bg-[#f5f5f5] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="section-label mb-4">Locațiile noastre</div>
          <h2
            className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            3 locații în Iași.
            <br />
            <span className="text-[#231f20]/40">Una aproape de tine.</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className={`rounded-2xl p-7 flex flex-col gap-5 card-lift border-2 ${
                loc.highlight
                  ? 'bg-[#231f20] border-[#f8ef21]'
                  : 'bg-white border-[#e5e5e5]'
              }`}
            >
              {loc.highlight && (
                <span
                  className="section-label self-start"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Sediu principal
                </span>
              )}

              <div>
                <h3
                  className={`text-xl font-bold mb-1 ${loc.highlight ? 'text-white' : 'text-[#231f20]'}`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {loc.name}
                </h3>
                <div
                  className={`flex items-center gap-1.5 text-xs ${
                    loc.highlight ? 'text-white/50' : 'text-[#6b6b6b]'
                  }`}
                >
                  <MapPin size={11} />
                  <span>{loc.address}</span>
                </div>
              </div>

              <p
                className={`text-sm leading-relaxed ${
                  loc.highlight ? 'text-white/70' : 'text-[#6b6b6b]'
                }`}
              >
                {loc.desc}
              </p>

              {/* Courses */}
              <div className="flex flex-wrap gap-1.5">
                {loc.courses.map((c) => (
                  <span
                    key={c}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      loc.highlight
                        ? 'bg-white/10 text-white/80'
                        : 'bg-[#f5f5f5] text-[#231f20]'
                    }`}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* Schedule */}
              <div
                className={`flex items-center gap-2 text-xs ${
                  loc.highlight ? 'text-white/50' : 'text-[#6b6b6b]'
                }`}
              >
                <Clock size={11} />
                <span>{loc.schedule}</span>
              </div>

              {/* CTA */}
              <div className="flex gap-3 mt-auto pt-2">
                <Link
                  href={loc.mapLink}
                  className={`flex-1 text-center text-xs font-bold py-2.5 rounded-full transition-all duration-200 border ${
                    loc.highlight
                      ? 'border-white/20 text-white hover:border-[#f8ef21] hover:text-[#f8ef21]'
                      : 'border-[#e5e5e5] text-[#231f20] hover:bg-[#231f20] hover:text-white hover:border-[#231f20]'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Hartă
                </Link>
                <Link
                  href="#inscriere"
                  className={`flex-1 text-center text-xs font-bold py-2.5 rounded-full transition-all duration-200 ${
                    loc.highlight
                      ? 'bg-[#f8ef21] text-[#231f20] hover:bg-white'
                      : 'bg-[#231f20] text-white hover:bg-[#3a3637]'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Înscrie-te
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
