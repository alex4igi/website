'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Clock,
  MapPin,
  Trophy,
  Sparkles,
  Flame,
  HeartPulse,
  Brain,
  Users,
  Music2,
  Dumbbell,
  ShieldCheck,
  Smile,
  Activity,
  Target,
  Star,
  type LucideIcon,
} from 'lucide-react'
import SprayLabel from '@/components/ui/spray-label'
import { useInView } from '@/hooks/use-in-view'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { CourseConfig, CourseIcon } from '@/lib/courses'

const icons: Record<CourseIcon, LucideIcon> = {
  heart: HeartPulse,
  brain: Brain,
  users: Users,
  music: Music2,
  dumbbell: Dumbbell,
  shield: ShieldCheck,
  smile: Smile,
  activity: Activity,
  flame: Flame,
  target: Target,
  sparkles: Sparkles,
  trophy: Trophy,
  star: Star,
}

// 16:9 background-video embed, autoplay + muted + looped, mobile-safe (playsinline).
function ytEmbedSrc(id: string, start = 0) {
  return (
    `https://www.youtube.com/embed/${id}` +
    `?autoplay=1&mute=1&loop=1&playlist=${id}` +
    `&start=${start}&controls=0&showinfo=0&rel=0` +
    `&modestbranding=1&playsinline=1&iv_load_policy=3` +
    `&disablekb=1&fs=0&cc_load_policy=0&enablejsapi=0`
  )
}

export default function CoursePage({ course }: { course: CourseConfig }) {
  const firstPicker = course.picker?.items[0]?.id ?? ''
  const [activeItem, setActiveItem] = useState(firstPicker)
  const [pickerRef, pickerIn] = useInView<HTMLDivElement>({ threshold: 0.15 })
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const BadgeIcon = icons[course.heroBadgeIcon]
  const current = course.picker?.items.find((i) => i.id === activeItem) ?? course.picker?.items[0]
  const hasGroupDesc = !!course.ageGroups?.groups.some((g) => g.theme || g.desc)
  const levelCols = course.levels && course.levels.items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#231f20] overflow-hidden">
        {/* ── Background video (same principle as homepage hero) ───────── */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Poster — shown before the iframe mounts to avoid a flash of black */}
          {!mounted && (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${course.heroImage ?? '/images/quasar-team.jpg'}')` }}
            />
          )}

          {/* iframe — client-only, sized to cover (16:9 cover math) */}
          {mounted && course.heroVideoId && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 'max(100vw, 177.78vh)',
                height: 'max(56.25vw, 100vh)',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <iframe
                src={ytEmbedSrc(course.heroVideoId)}
                title={`${course.sprayLabel} — background video`}
                allow="autoplay; fullscreen"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none', opacity: 0.5 }}
              />
            </div>
          )}
        </div>

        {/* ── Gradient overlay — keeps the text readable over the video ── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(35,31,32,0.82) 0%, rgba(35,31,32,0.55) 38%, rgba(35,31,32,0.68) 72%, rgba(35,31,32,0.97) 100%)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <SprayLabel>{course.sprayLabel}</SprayLabel>
              <span
                className="inline-flex items-center gap-1.5 text-[#f8ef21] text-xs font-bold uppercase tracking-widest border border-[#f8ef21]/30 rounded-full px-3 py-1"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <BadgeIcon size={12} /> {course.heroBadge}
              </span>
            </div>
            <h1
              className="text-white text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {course.titleLine1}
              <br />
              <span className="text-[#f8ef21]">{course.titleAccent}</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
              {course.heroDesc}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 bg-[#f8ef21] text-[#231f20] font-extrabold text-sm md:text-base px-7 py-3.5 rounded-full hover:bg-white transition-colors shadow-xl shadow-[#f8ef21]/20"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Înscrie-te acum
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/orar"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold text-sm md:text-base px-7 py-3.5 rounded-full hover:bg-white hover:text-[#231f20] hover:border-white transition-all"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <Clock size={17} /> Vezi orarul
              </Link>
            </div>

            {/* Mini stats */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-10">
              {course.stats.map((s) => (
                <div key={s.l}>
                  <div
                    className="text-[#f8ef21] text-2xl md:text-3xl font-extrabold leading-none"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {s.v}
                  </div>
                  <div className="text-white/60 text-xs font-semibold mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Picker (stiluri / elemente / ritmuri) ──────────────────────── */}
      {course.picker && current && (
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="mb-10">
              <div className="mb-4"><SprayLabel>{course.picker.label}</SprayLabel></div>
              <h2
                className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {course.picker.title}
                <br />
                <span className="text-[#231f20]/40">{course.picker.titleAccent}</span>
              </h2>
              <p className="text-[#6b6b6b] mt-4 max-w-2xl">{course.picker.intro}</p>
            </div>

            <div ref={pickerRef} className="grid lg:grid-cols-[1fr_1.3fr] gap-5 items-stretch">
              {/* Tabs */}
              <div className="flex flex-wrap lg:flex-col gap-2.5">
                {course.picker.items.map((s) => {
                  const active = s.id === activeItem
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveItem(s.id)}
                      className={`flex items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left transition-all duration-200 flex-1 lg:flex-none ${
                        active ? 'bg-[#231f20] shadow-lg' : 'bg-[#f5f5f5] hover:bg-[#ececec]'
                      }`}
                    >
                      <span
                        className={`text-base md:text-lg font-extrabold ${active ? 'text-[#f8ef21]' : 'text-[#231f20]'}`}
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {s.name}
                      </span>
                      <ArrowRight
                        size={18}
                        className={`transition-all duration-200 ${
                          active
                            ? 'text-[#f8ef21] translate-x-0 opacity-100'
                            : 'text-[#6b6b6b] -translate-x-1 opacity-0'
                        }`}
                      />
                    </button>
                  )
                })}
              </div>

              {/* Active detail */}
              <div
                key={current.id}
                className={`rounded-3xl bg-[#231f20] p-8 md:p-10 flex flex-col ${pickerIn ? 'in-view' : ''}`}
                style={{ animation: 'fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) both' }}
              >
                <div
                  className="text-[#f8ef21] text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {current.kicker}
                </div>
                <h3
                  className="text-white text-3xl md:text-4xl font-extrabold mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {current.name}
                </h3>
                <p className="text-white/70 text-base md:text-lg leading-relaxed flex-1">{current.desc}</p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {current.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-bold bg-[#f8ef21]/10 text-[#f8ef21] px-3.5 py-1.5 rounded-full"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Benefits ───────────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f5] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="mb-4"><SprayLabel>{course.benefits.label}</SprayLabel></div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {course.benefits.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {course.benefits.items.map((b) => {
              const Icon = icons[b.icon]
              return (
                <div
                  key={b.title}
                  className="bg-white rounded-2xl p-6 flex flex-col gap-3 border border-[#e5e5e5] card-lift"
                >
                  <div className="w-11 h-11 rounded-full bg-[#f8ef21] flex items-center justify-center">
                    <Icon size={20} className="text-[#231f20]" />
                  </div>
                  <h3 className="text-[#231f20] text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    {b.title}
                  </h3>
                  <p className="text-[#6b6b6b] text-sm leading-relaxed">{b.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Age groups ─────────────────────────────────────────────────── */}
      {course.ageGroups && course.ageGroups.groups.length > 0 && (
        <section className="bg-[#231f20] py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div
              className={`grid gap-10 items-center ${course.ageGroups.image ? 'lg:grid-cols-[0.85fr_1.15fr]' : ''}`}
            >
              {/* Optional image */}
              {course.ageGroups.image && (
                <div className="rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-2xl aspect-[4/3] lg:aspect-[4/5] order-2 lg:order-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.ageGroups.image}
                    alt={course.ageGroups.imageAlt ?? course.ageGroups.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              <div className={course.ageGroups.image ? 'order-1 lg:order-2' : ''}>
                <div className="mb-4"><SprayLabel>{course.ageGroups.label}</SprayLabel></div>
                <h2
                  className="text-white text-3xl md:text-5xl font-extrabold leading-tight text-balance"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {course.ageGroups.title}
                </h2>
                <p className="text-white/60 mt-4 mb-8 max-w-xl">{course.ageGroups.desc}</p>
                <div className={`grid gap-3 ${hasGroupDesc ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
                  {course.ageGroups.groups.map((g) => (
                    <div
                      key={g.label + g.age}
                      className="rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col gap-1.5 hover:bg-[#f8ef21] hover:border-[#f8ef21] transition-colors duration-200 group"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className="text-white group-hover:text-[#231f20] text-xl font-extrabold transition-colors"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {g.label}
                        </span>
                        <span className="text-white/50 group-hover:text-[#231f20]/70 text-sm font-semibold transition-colors whitespace-nowrap">
                          {g.age}
                        </span>
                      </div>
                      {g.theme && (
                        <span
                          className="text-[#f8ef21] group-hover:text-[#231f20] text-sm font-bold transition-colors"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {g.theme}
                        </span>
                      )}
                      {g.desc && (
                        <p className="text-white/55 group-hover:text-[#231f20]/80 text-sm leading-relaxed transition-colors">
                          {g.desc}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Levels ─────────────────────────────────────────────────────── */}
      {course.levels && course.levels.items.length > 0 && (
        <section className="bg-white py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="mb-12 max-w-2xl">
              <div className="mb-4"><SprayLabel>{course.levels.label}</SprayLabel></div>
              <h2
                className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {course.levels.title}
              </h2>
            </div>
            <div className={`grid grid-cols-1 ${levelCols} gap-4`}>
              {course.levels.items.map((l) => (
                <div
                  key={l.num}
                  className="rounded-2xl bg-[#f5f5f5] p-6 flex flex-col gap-3 border border-[#e5e5e5]"
                >
                  <span
                    className="text-[#f8ef21] text-3xl font-black"
                    style={{ fontFamily: 'var(--font-display)', WebkitTextStroke: '1px #231f20' }}
                  >
                    {l.num}
                  </span>
                  <h3 className="text-[#231f20] text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    {l.title}
                  </h3>
                  <p className="text-[#6b6b6b] text-sm leading-relaxed">{l.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f5] py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <div className="mb-10 text-center">
            <div className="mb-4 flex justify-center"><SprayLabel>Întrebări frecvente</SprayLabel></div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Bun de știut
            </h2>
          </div>
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {course.faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-white border border-[#e5e5e5] rounded-2xl px-5 data-[state=open]:border-[#231f20]"
              >
                <AccordionTrigger
                  className="text-[#231f20] text-base font-bold hover:no-underline text-left"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#6b6b6b] text-sm leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA final ──────────────────────────────────────────────────── */}
      <section className="bg-[#f8ef21] py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <div className="flex justify-center mb-6">
            <span
              className="inline-flex items-center gap-2 bg-[#231f20] text-[#f8ef21] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <Sparkles size={13} /> Locuri limitate pe grupă
            </span>
          </div>
          <h2
            className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {course.ctaTitle}
          </h2>
          <p className="text-[#231f20]/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-9">
            {course.ctaDesc}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 bg-[#231f20] text-white font-extrabold text-base px-9 py-4 rounded-full hover:bg-[#3a3637] transition-colors shadow-xl shadow-[#231f20]/20"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Înscrie-te acum
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/orar"
              className="inline-flex items-center gap-2 border-2 border-[#231f20]/30 text-[#231f20] font-bold text-base px-9 py-4 rounded-full hover:border-[#231f20] transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <MapPin size={17} /> Locații & orar
            </Link>
          </div>

          <div
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10 text-[#231f20]/60 text-xs font-semibold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="inline-flex items-center gap-1.5"><Trophy size={13} /> 200+ trofee</span>
            <span className="w-1 h-1 rounded-full bg-[#231f20]/30" />
            <span>Instructori formați în sistem Quasar</span>
            <span className="w-1 h-1 rounded-full bg-[#231f20]/30" />
            <span className="font-bold">Ședință de probă GRATUITĂ</span>
          </div>
        </div>
      </section>
    </div>
  )
}
