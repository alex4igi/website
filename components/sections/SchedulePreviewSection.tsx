'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import SprayLabel from '@/components/ui/spray-label'

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

const locationChips = ['Toate', 'Centru', 'Nicolina', 'Quasar for Kids']
const ageChips = ['Toate vârstele', '4–10 ani', '11–18 ani', '19+ ani']

export default function SchedulePreviewSection() {
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
        <div className="mb-10">
          <div className="mb-4"><SprayLabel>Program</SprayLabel></div>
          <h2
            className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Găsește cursul
            <br />
            potrivit pentru tine
          </h2>
        </div>

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
    </section>
  )
}
