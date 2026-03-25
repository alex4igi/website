'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import SprayLabel from '@/components/ui/spray-label'

type Tab = 'schedule' | 'pricing'

const scheduleItems = [
  {
    day: 'Luni',
    course: 'Street Dance Kids',
    time: '16:00 – 17:30',
    location: 'Centru',
    age: '6–10 ani',
    level: 'Începător',
  },
  {
    day: 'Marți',
    course: 'Gimnastică artistică',
    time: '15:30 – 17:00',
    location: 'Quasar for Kids',
    age: '4–8 ani',
    level: 'Toate nivelele',
  },
  {
    day: 'Miercuri',
    course: 'KPOP Dance',
    time: '18:00 – 19:30',
    location: 'Nicolina',
    age: '11–18 ani',
    level: 'Intermediar',
  },
  {
    day: 'Joi',
    course: 'Dans Studenți',
    time: '19:30 – 21:00',
    location: 'Centru',
    age: '19–25 ani',
    level: 'Toate nivelele',
  },
  {
    day: 'Vineri',
    course: 'Street Dance Varsity',
    time: '17:00 – 18:30',
    location: 'Centru',
    age: '11–14 ani',
    level: 'Intermediar',
  },
]

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

const locationChips = ['Toate', 'Centru', 'Nicolina', 'Quasar for Kids']
const ageChips = ['Toate vârstele', '4–10 ani', '11–18 ani', '19+ ani']

export default function SchedulePreviewSection() {
  const [activeTab, setActiveTab] = useState<Tab>('schedule')
  const [activeLocation, setActiveLocation] = useState('Toate')
  const [activeAge, setActiveAge] = useState('Toate vârstele')

  const filteredSchedule = scheduleItems.filter((item) => {
    const locMatch = activeLocation === 'Toate' || item.location === activeLocation
    const ageMatch = activeAge === 'Toate vârstele' || true // simplified
    return locMatch && ageMatch
  })

  return (
    <section id="program" className="bg-[#f5f5f5] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="mb-4"><SprayLabel>Program & Prețuri</SprayLabel></div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Găsește cursul
              <br />
              potrivit pentru tine
            </h2>
          </div>

          {/* Tab toggle */}
          <div className="flex items-center bg-[#231f20] rounded-full p-1 self-start md:self-auto">
            {(['schedule', 'pricing'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-[#f8ef21] text-[#231f20]'
                    : 'text-white/60 hover:text-white'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {tab === 'schedule' ? 'Program' : 'Prețuri'}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule tab */}
        {activeTab === 'schedule' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex flex-wrap gap-2">
                {locationChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setActiveLocation(chip)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                      activeLocation === chip
                        ? 'bg-[#231f20] text-[#f8ef21] border-[#231f20]'
                        : 'bg-white text-[#231f20] border-[#e5e5e5] hover:border-[#231f20]'
                    }`}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {ageChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setActiveAge(chip)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                      activeAge === chip
                        ? 'bg-[#231f20] text-[#f8ef21] border-[#231f20]'
                        : 'bg-white text-[#231f20] border-[#e5e5e5] hover:border-[#231f20]'
                    }`}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule table */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#e5e5e5]">
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#e5e5e5] bg-[#f5f5f5]">
                      {['Zi', 'Curs', 'Orar', 'Locație', 'Vârstă', 'Nivel'].map((h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3 text-[#231f20] text-xs font-bold uppercase tracking-wider"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchedule.map((item, i) => (
                      <tr
                        key={i}
                        className="border-b border-[#e5e5e5] last:border-0 hover:bg-[#f5f5f5] transition-colors"
                      >
                        <td
                          className="px-5 py-4 font-semibold text-[#231f20]"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {item.day}
                        </td>
                        <td
                          className="px-5 py-4 font-semibold text-[#231f20]"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {item.course}
                        </td>
                        <td className="px-5 py-4 text-[#6b6b6b]">{item.time}</td>
                        <td className="px-5 py-4">
                          <span className="section-label text-[10px]">{item.location}</span>
                        </td>
                        <td className="px-5 py-4 text-[#6b6b6b]">{item.age}</td>
                        <td className="px-5 py-4">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f5f5f5] text-[#6b6b6b]">
                            {item.level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden flex flex-col divide-y divide-[#e5e5e5]">
                {filteredSchedule.map((item, i) => (
                  <div key={i} className="p-5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[#231f20] font-bold"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {item.course}
                      </span>
                      <span className="section-label text-[10px]">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#6b6b6b]">
                      <span>{item.day}</span>
                      <span>·</span>
                      <span>{item.time}</span>
                      <span>·</span>
                      <span>{item.age}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview note */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[#6b6b6b] text-xs">
                Acesta este un preview. Programul complet conține 30+ cursuri săptămânale.
              </p>
              <a
                href="#program-complet"
                className="inline-flex items-center gap-1 text-[#231f20] text-sm font-bold hover:text-[#231f20]/70 transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Program complet <ArrowRight size={14} />
              </a>
            </div>
          </div>
        )}

        {/* Pricing tab */}
        {activeTab === 'pricing' && (
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
        )}
      </div>
    </section>
  )
}
