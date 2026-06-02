import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import QuizExperience from '@/components/sections/QuizExperience'

export const metadata: Metadata = {
  title: 'Quiz: Dans sau Gimnastică? | Quasar Dance Iași',
  description:
    'Nu știi ce curs i se potrivește copilului tău? Răspunde la 5 întrebări rapide și află dacă destinația lui este dansul, gimnastica acrobatică sau combo-ul perfect. Gratuit și instant.',
  alternates: { canonical: '/quiz' },
  openGraph: {
    title: 'Quiz: Dans sau Gimnastică? | Quasar Dance',
    description:
      'Răspunde la 5 întrebări rapide și descoperă programul perfect pentru copilul tău la Quasar Dance Iași.',
    url: 'https://quasardance.ro/quiz',
    siteName: 'Quasar Dance',
    locale: 'ro_RO',
    type: 'website',
  },
}

export default function QuizPage() {
  return (
    <main>
      <Navbar />
      <QuizExperience />
      <Footer />
    </main>
  )
}
