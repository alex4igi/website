'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import SprayLabel from '@/components/ui/spray-label'
import { normalizePhoneRO } from '@/lib/validation'

const ageGroups = ['Tiny (4–6)', 'Junior (7–10)', 'Varsity (11–14)', 'Teens (15–19)', 'Students (20–25)', 'Adulți (>25)']
const interestTypes = ['Street Dance', 'KPOP Dance', 'Gimnastică acrobatică', 'Zumba (Adulți)', 'Nu știu încă']
const locationsList = ['Quasar Centru', 'Quasar Nicolina', 'Quasar for Kids', 'Orice locație']

export default function LeadFormSection() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    ageGroup: '',
    interest: '',
    location: '',
    // Honeypot anti-spam: câmp ascuns vizual, completat doar de boți.
    company: '',
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Anti-spam: dacă honeypot-ul e completat, ne prefacem că am trimis.
    if (form.company) {
      setSubmitted(true)
      return
    }

    // Validare telefon client-side, ca vizitatorul să vadă eroarea imediat.
    const phone = normalizePhoneRO(form.phone)
    if (!phone) {
      setError('Număr de telefon invalid. Folosește un mobil românesc (ex: 07XXXXXXXX).')
      return
    }

    setLoading(true)
    try {
      // Captură UTM din URL (opțional, pentru tracking ROI).
      const params =
        typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null

      const res = await fetch('/api/inscriere', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nume: form.name.trim(),
          telefon: phone,
          email: form.email.trim() || null,
          interes: form.interest || null,
          grupa_varsta: form.ageGroup || null,
          locatia: form.location || null,
          utm_source: params?.get('utm_source') || null,
          utm_medium: params?.get('utm_medium') || null,
          utm_campaign: params?.get('utm_campaign') || null,
          company: form.company,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        // created: true (lead nou) sau false (telefon deja existent) — ambele OK.
        setSubmitted(true)
      } else {
        setError(data?.error || 'A apărut o eroare. Te rugăm să încerci din nou.')
      }
    } catch {
      setError('Nu am putut trimite cererea. Verifică conexiunea și încearcă din nou.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="inscriere" className="bg-[#231f20] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: copy */}
          <div className="md:pt-4">
            <div className="mb-6"><SprayLabel>Ședință demo gratuită</SprayLabel></div>
            <h2
              className="text-white text-3xl md:text-5xl font-extrabold leading-tight text-balance mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Programează-te la
              <br />
              <span className="text-[#f8ef21]">prima ședință gratuită.</span>
            </h2>
            <p className="text-white/65 text-base leading-relaxed mb-8">
              Completează formularul și unul din instructorii noștri te va contacta în 24 de ore
              pentru a stabili detaliile. Fără obligații, fără presiuni.
            </p>

            <div className="flex flex-col gap-4">
              {[
                { icon: '✓', text: 'Prima ședință complet gratuită' },
                { icon: '✓', text: 'Evaluare de nivel inclusă' },
                { icon: '✓', text: 'Instructor dedicat din prima zi' },
                { icon: '✓', text: 'Fără contract obligatoriu inițial' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-full bg-[#f8ef21] text-[#231f20] flex items-center justify-center text-xs font-bold flex-shrink-0"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <span
                    className="text-white/80 text-sm font-medium"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-white rounded-3xl p-8 md:p-10">
            {submitted ? (
              <div className="flex flex-col items-center gap-5 py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#f8ef21] flex items-center justify-center">
                  <CheckCircle size={32} className="text-[#231f20]" />
                </div>
                <h3
                  className="text-[#231f20] text-2xl font-extrabold"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Cerere trimisă!
                </h3>
                <p className="text-[#6b6b6b] text-sm leading-relaxed max-w-xs">
                  Te vom contacta în maxim 24 de ore pentru a stabili prima ta ședință demo.
                  Bine ai venit în comunitatea Quasar!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <div>
                  <h3
                    className="text-[#231f20] text-xl font-extrabold mb-1"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Trimite-ne un mesaj
                  </h3>
                  <p className="text-[#6b6b6b] text-sm">Completează datele de mai jos.</p>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="lead-name"
                    className="text-xs font-bold text-[#231f20] uppercase tracking-wider"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Nume complet *
                  </label>
                  <input
                    id="lead-name"
                    type="text"
                    required
                    placeholder="Ion Popescu"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm text-[#231f20] placeholder-[#6b6b6b]/50 focus:outline-none focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="lead-phone"
                    className="text-xs font-bold text-[#231f20] uppercase tracking-wider"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Telefon *
                  </label>
                  <input
                    id="lead-phone"
                    type="tel"
                    required
                    placeholder="07xx xxx xxx"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm text-[#231f20] placeholder-[#6b6b6b]/50 focus:outline-none focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] transition-all"
                  />
                </div>

                {/* Email (opțional — pentru confirmare automată) */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="lead-email"
                    className="text-xs font-bold text-[#231f20] uppercase tracking-wider"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Email
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    placeholder="ion@email.ro"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm text-[#231f20] placeholder-[#6b6b6b]/50 focus:outline-none focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] transition-all"
                  />
                  <span className="text-[11px] text-[#6b6b6b]">Îți trimitem o confirmare pe email.</span>
                </div>

                {/* Age group */}
                <div className="flex flex-col gap-1.5">
                  <span
                    className="text-xs font-bold text-[#231f20] uppercase tracking-wider"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Grupă de vârstă *
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {ageGroups.map((ag) => (
                      <button
                        key={ag}
                        type="button"
                        onClick={() => handleChange('ageGroup', ag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                          form.ageGroup === ag
                            ? 'bg-[#231f20] text-[#f8ef21] border-[#231f20]'
                            : 'bg-white text-[#231f20] border-[#e5e5e5] hover:border-[#231f20]'
                        }`}
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {ag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest */}
                <div className="flex flex-col gap-1.5">
                  <span
                    className="text-xs font-bold text-[#231f20] uppercase tracking-wider"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Interes *
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {interestTypes.map((it) => (
                      <button
                        key={it}
                        type="button"
                        onClick={() => handleChange('interest', it)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                          form.interest === it
                            ? 'bg-[#231f20] text-[#f8ef21] border-[#231f20]'
                            : 'bg-white text-[#231f20] border-[#e5e5e5] hover:border-[#231f20]'
                        }`}
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {it}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1.5">
                  <span
                    className="text-xs font-bold text-[#231f20] uppercase tracking-wider"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Locație preferată
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {locationsList.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleChange('location', loc)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                          form.location === loc
                            ? 'bg-[#231f20] text-[#f8ef21] border-[#231f20]'
                            : 'bg-white text-[#231f20] border-[#e5e5e5] hover:border-[#231f20]'
                        }`}
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Honeypot anti-spam — ascuns pentru utilizatori, capcană pentru boți */}
                <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="lead-company">Companie</label>
                  <input
                    id="lead-company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                  />
                </div>

                {error && (
                  <p
                    role="alert"
                    className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !form.name || !form.phone || !form.ageGroup || !form.interest}
                  className="mt-2 w-full bg-[#231f20] text-white font-bold text-base py-4 rounded-xl hover:bg-[#3a3637] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Se trimite...
                    </>
                  ) : (
                    'Programează ședința demo'
                  )}
                </button>

                <p className="text-center text-xs text-[#6b6b6b]">
                  Prin trimiterea formularului, ești de acord cu politica noastră de confidențialitate.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
