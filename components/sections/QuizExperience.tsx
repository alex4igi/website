'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, RotateCcw, Sparkles, Music, Dumbbell, Zap } from 'lucide-react'

/* ──────────────────────────────────────────────────────────────────────────
   Quiz data
   Each answer carries a "letter" that maps to a personality axis:
     A → DANS         (artistic / rhythmic / expressive)
     B → GIMNASTICĂ   (physical / technical / strength)
     C → spirit liber (social / spontaneous / for-the-fun-of-it)
   ────────────────────────────────────────────────────────────────────────── */

type Letter = 'A' | 'B' | 'C'

interface Answer {
  letter: Letter
  text: string
}

interface Question {
  id: number
  kicker: string
  question: string
  answers: Answer[]
}

const questions: Question[] = [
  {
    id: 1,
    kicker: 'Instinctul',
    question: 'Cum reacționează copilul tău când aude muzica preferată la radio?',
    answers: [
      { letter: 'A', text: 'Începe imediat să improvizeze mișcări și să prindă ritmul.' },
      { letter: 'B', text: 'Începe să facă roata, să sară sau să stea în mâini prin casă.' },
      { letter: 'C', text: 'Se bucură de vibe, cântă și dansează liber, fără să îi pese de tehnică.' },
    ],
  },
  {
    id: 2,
    kicker: 'Superputerea',
    question: 'Care este „superputerea" lui/ei naturală?',
    answers: [
      { letter: 'A', text: 'Memoria vizuală — reține ușor pași de dans de pe TikTok/YouTube.' },
      { letter: 'B', text: 'Agilitatea și forța — se urcă peste tot, are multă energie fizică.' },
      { letter: 'C', text: 'Dezinvoltura — curaj să încerce și să se exprime.' },
    ],
  },
  {
    id: 3,
    kicker: 'În grup',
    question: 'Ce tip de activitate preferă într-un grup?',
    answers: [
      { letter: 'A', text: 'Să facă parte dintr-o echipă care creează un moment artistic (spectacol).' },
      { letter: 'B', text: 'Să își depășească propriile limite și să învețe elemente tehnice noi.' },
      { letter: 'C', text: 'Să socializeze, indiferent de mediu.' },
    ],
  },
  {
    id: 4,
    kicker: 'Energia',
    question: 'Cum descrii energia copilului tău?',
    answers: [
      { letter: 'A', text: 'Creativă și expresivă — îi place să atragă atenția prin stil.' },
      { letter: 'B', text: 'Explozivă și tehnică — îi place să vadă exact ce poate face corpul lui.' },
      { letter: 'C', text: 'Imprevizibilă și spontană — se adaptează mediului și contextului.' },
    ],
  },
  {
    id: 5,
    kicker: 'Răsplata',
    question: 'Ce îl/o entuziasmează mai mult la finalul unei ore de curs?',
    answers: [
      { letter: 'A', text: 'Să fi învățat o coregrafie întreagă pe o piesă cool.' },
      { letter: 'B', text: 'Să fi reușit o mișcare grea (podul, stândul în mâini, sfoara).' },
      { letter: 'C', text: 'Să se bucure de moment împreună cu colegii lui/ei.' },
    ],
  },
]

/* ── Results ──────────────────────────────────────────────────────────────── */

type ResultKey = 'dans' | 'gimnastica' | 'combo'

interface ResultData {
  key: ResultKey
  emoji: string
  Icon: typeof Music
  badge: string
  title: string
  description: string
  tags: string[]
}

const results: Record<ResultKey, ResultData> = {
  dans: {
    key: 'dans',
    emoji: '🕺',
    Icon: Music,
    badge: 'Destinația lui',
    title: 'DANS',
    description:
      'Copilul tău are simț artistic și o conexiune naturală cu ritmul. Programul nostru de DANS pe module îi va oferi încredere pe scenă și un vocabular de mișcări actual.',
    tags: ['Coregrafie', 'Ritm & stil', 'Scenă'],
  },
  gimnastica: {
    key: 'gimnastica',
    emoji: '🤸',
    Icon: Dumbbell,
    badge: 'Destinația lui',
    title: 'GIMNASTICĂ ACROBATICĂ',
    description:
      'Copilul tău are nevoie de provocări fizice și de un cadru sigur unde să-și testeze limitele. Focusul pe forță și mobilitate este alegerea ideală.',
    tags: ['Forță', 'Mobilitate', 'Tehnică'],
  },
  combo: {
    key: 'combo',
    emoji: '⚡',
    Icon: Zap,
    badge: 'Pentru el/ea',
    title: 'COMBO-UL PERFECT',
    description:
      'Mulți dintre cursanții noștri aleg ambele variante pentru o dezvoltare completă. Gimnastica oferă forța necesară pentru mișcări de dans spectaculoase, iar dansul aduce cursivitate mișcărilor acrobatice.',
    tags: ['Dans', 'Gimnastică', 'Dezvoltare completă'],
  },
}

/* ── Scoring ──────────────────────────────────────────────────────────────────
   A vs B decides the destination (Dans vs Gimnastică).
   A tie between A and B → Combo. But if the child is mostly a "free spirit"
   (C is the dominant bucket on a tie), the expressive / social path — Dans —
   suits best.
   ──────────────────────────────────────────────────────────────────────────── */

function computeResult(answers: Letter[]): ResultKey {
  const counts: Record<Letter, number> = { A: 0, B: 0, C: 0 }
  for (const a of answers) counts[a]++

  if (counts.A > counts.B) return 'dans'
  if (counts.B > counts.A) return 'gimnastica'
  // counts.A === counts.B → balanced
  return counts.C > counts.A ? 'dans' : 'combo'
}

/* ── Component ─────────────────────────────────────────────────────────────── */

type Stage = 'intro' | 'quiz' | 'result'

export default function QuizExperience() {
  const [stage, setStage] = useState<Stage>('intro')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Letter[]>([])
  const [picked, setPicked] = useState<Letter | null>(null)

  const total = questions.length

  const start = useCallback(() => {
    setAnswers([])
    setCurrent(0)
    setPicked(null)
    setStage('quiz')
  }, [])

  const select = useCallback(
    (letter: Letter) => {
      if (picked) return
      setPicked(letter)
      const next = [...answers]
      next[current] = letter
      // brief pause so the selected state is visible before advancing
      window.setTimeout(() => {
        setAnswers(next)
        if (current + 1 < total) {
          setCurrent((c) => c + 1)
          setPicked(null)
        } else {
          setStage('result')
        }
      }, 360)
    },
    [answers, current, picked, total],
  )

  const goBack = useCallback(() => {
    if (current === 0) {
      setStage('intro')
      return
    }
    setCurrent((c) => c - 1)
    setPicked(null)
  }, [current])

  // keep the picked highlight in sync when navigating back to an answered question
  useEffect(() => {
    setPicked(answers[current] ?? null)
  }, [current, answers])

  return (
    <section className="relative min-h-screen bg-[#231f20] overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      {/* decorative glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(248,239,33,0.18), transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 w-[32rem] h-[32rem] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(248,239,33,0.10), transparent 70%)' }}
      />

      <div className="relative max-w-3xl mx-auto px-5 md:px-8">
        {stage === 'intro' && <Intro onStart={start} total={total} />}
        {stage === 'quiz' && (
          <QuizStep
            key={current}
            q={questions[current]}
            index={current}
            total={total}
            picked={picked}
            onSelect={select}
            onBack={goBack}
          />
        )}
        {stage === 'result' && (
          <Result data={results[computeResult(answers)]} onRestart={start} />
        )}
      </div>
    </section>
  )
}

/* ── Intro ────────────────────────────────────────────────────────────────── */

function Intro({ onStart, total }: { onStart: () => void; total: number }) {
  return (
    <div className="text-center" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.22,1,0.36,1) both' }}>
      <div
        className="inline-flex items-center gap-2 text-[#231f20] bg-[#f8ef21] px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-8"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        Quiz interactiv · {total} întrebări
      </div>

      <h1
        className="text-white text-4xl md:text-6xl font-extrabold leading-[1.05] text-balance mb-6"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Dans sau gimnastică?
        <br />
        <span className="text-[#f8ef21]">Hai să aflăm.</span>
      </h1>

      <p className="text-white/65 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
        Răspunde la {total} întrebări rapide despre copilul tău și îți spunem exact ce
        program i se potrivește cel mai bine. Gratuit, instant, fără apel de vânzări.
      </p>

      <button
        onClick={onStart}
        className="group inline-flex items-center gap-2 bg-[#f8ef21] text-[#231f20] font-extrabold text-base md:text-lg px-9 py-4 rounded-full hover:bg-white transition-all duration-200 shadow-xl shadow-[#f8ef21]/20"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Începe quiz-ul
        <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
      </button>

      <div className="flex items-center justify-center gap-6 mt-12 text-white/40 text-xs font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
        <span>⏱️ ~1 minut</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span>🎯 Rezultat personalizat</span>
      </div>
    </div>
  )
}

/* ── Quiz step ────────────────────────────────────────────────────────────── */

const optionStyles = ['A', 'B', 'C'] as const

function QuizStep({
  q,
  index,
  total,
  picked,
  onSelect,
  onBack,
}: {
  q: Question
  index: number
  total: number
  picked: Letter | null
  onSelect: (l: Letter) => void
  onBack: () => void
}) {
  const progress = ((index + 1) / total) * 100

  return (
    <div style={{ animation: 'fadeInUp 0.45s cubic-bezier(0.22,1,0.36,1) both' }}>
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-[#f8ef21] text-xs font-bold uppercase tracking-widest transition-colors duration-200"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Înapoi
          </button>
          <span
            className="text-white/50 text-xs font-bold uppercase tracking-widest tabular-nums"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#f8ef21] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Kicker + question */}
      <div
        className="text-[#f8ef21] text-xs font-extrabold uppercase tracking-[0.2em] mb-3"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {q.kicker}
      </div>
      <h2
        className="text-white text-2xl md:text-4xl font-extrabold leading-tight text-balance mb-8"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {q.question}
      </h2>

      {/* Answers */}
      <div className="flex flex-col gap-3">
        {q.answers.map((a, i) => {
          const isPicked = picked === a.letter
          return (
            <button
              key={a.letter}
              onClick={() => onSelect(a.letter)}
              disabled={picked !== null}
              className={`group flex items-center gap-4 text-left rounded-2xl border p-4 md:p-5 transition-all duration-200 ${
                isPicked
                  ? 'border-[#f8ef21] bg-[#f8ef21] shadow-xl shadow-[#f8ef21]/20'
                  : 'border-white/10 bg-white/[0.03] hover:border-[#f8ef21]/50 hover:bg-white/[0.06]'
              } disabled:cursor-default`}
              style={{ animation: `fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) ${120 + i * 80}ms both` }}
            >
              <span
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-base font-extrabold transition-colors duration-200 ${
                  isPicked
                    ? 'bg-[#231f20] text-[#f8ef21]'
                    : 'bg-[#f8ef21]/10 text-[#f8ef21] group-hover:bg-[#f8ef21] group-hover:text-[#231f20]'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {optionStyles[i]}
              </span>
              <span
                className={`text-sm md:text-base font-semibold leading-snug transition-colors duration-200 ${
                  isPicked ? 'text-[#231f20]' : 'text-white/85'
                }`}
              >
                {a.text}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Result ───────────────────────────────────────────────────────────────── */

function Result({ data, onRestart }: { data: ResultData; onRestart: () => void }) {
  const { Icon } = data
  return (
    <div className="text-center" style={{ animation: 'scaleIn 0.55s cubic-bezier(0.22,1,0.36,1) both' }}>
      <div
        className="inline-flex items-center gap-2 text-[#f8ef21] bg-[#f8ef21]/10 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-8"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        Rezultatul tău
      </div>

      <div className="text-6xl md:text-7xl mb-6" aria-hidden="true">
        {data.emoji}
      </div>

      <div
        className="text-white/50 text-sm font-bold uppercase tracking-widest mb-2"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {data.badge}
      </div>
      <h1
        className="text-[#f8ef21] text-3xl md:text-5xl font-extrabold leading-tight text-balance mb-6"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {data.title}
      </h1>

      <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-8">
        {data.description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
        {data.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 px-3.5 py-2 rounded-full"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <Icon className="w-3.5 h-3.5 text-[#f8ef21]" />
            {tag}
          </span>
        ))}
      </div>

      {/* CTA card */}
      <div className="bg-[#f8ef21] rounded-3xl p-8 md:p-10">
        <h2
          className="text-[#231f20] text-2xl md:text-3xl font-extrabold leading-tight text-balance mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Gata să facă primul pas?
        </h2>
        <p className="text-[#231f20]/70 text-sm md:text-base leading-relaxed max-w-md mx-auto mb-7">
          Rezervă-i un loc acum. Echipa Quasar te ajută să alegi grupa și locația potrivită
          pentru copilul tău.
        </p>
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 bg-[#231f20] text-white font-extrabold text-base md:text-lg px-9 py-4 rounded-full hover:bg-[#3a3637] transition-all duration-200 shadow-xl shadow-[#231f20]/20"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Înscrie-ți copilul acum
          <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      <button
        onClick={onRestart}
        className="inline-flex items-center gap-2 mt-8 text-white/50 hover:text-[#f8ef21] text-sm font-bold transition-colors duration-200"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <RotateCcw className="w-4 h-4" />
        Refă quiz-ul
      </button>
    </div>
  )
}
