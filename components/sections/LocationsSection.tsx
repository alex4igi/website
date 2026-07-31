import { MapPin, Phone } from 'lucide-react'
import SprayLabel from '@/components/ui/spray-label'
import { locations, mapUrl, telHref } from '@/lib/locations'

export default function LocationsSection() {
  return (
    <section id="locatii" className="bg-[#f5f5f5] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="mb-4"><SprayLabel>Locațiile noastre</SprayLabel></div>
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
              <h3
                className={`text-xl font-bold ${loc.highlight ? 'text-white' : 'text-[#231f20]'}`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {loc.name}
              </h3>

              <div className="flex flex-col gap-3">
                <div
                  className={`flex items-start gap-2 text-sm ${
                    loc.highlight ? 'text-white/60' : 'text-[#6b6b6b]'
                  }`}
                >
                  <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                  <span>
                    {loc.address}
                    <br />
                    {loc.city}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone
                    size={14}
                    className={`flex-shrink-0 ${loc.highlight ? 'text-white/60' : 'text-[#6b6b6b]'}`}
                  />
                  <a
                    href={telHref(loc)}
                    className={`font-semibold transition-colors ${
                      loc.highlight
                        ? 'text-white hover:text-[#f8ef21]'
                        : 'text-[#231f20] hover:text-[#6b6b6b]'
                    }`}
                  >
                    {loc.phone}
                  </a>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3 mt-auto pt-2">
                <a
                  href={mapUrl(loc)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 text-center text-xs font-bold py-2.5 rounded-full transition-all duration-200 border ${
                    loc.highlight
                      ? 'border-white/20 text-white hover:border-[#f8ef21] hover:text-[#f8ef21]'
                      : 'border-[#e5e5e5] text-[#231f20] hover:bg-[#231f20] hover:text-white hover:border-[#231f20]'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Hartă
                </a>
                <a
                  href="/#inscriere"
                  className={`flex-1 text-center text-xs font-bold py-2.5 rounded-full transition-all duration-200 ${
                    loc.highlight
                      ? 'bg-[#f8ef21] text-[#231f20] hover:bg-white'
                      : 'bg-[#231f20] text-white hover:bg-[#3a3637]'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Înscrie-te
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
