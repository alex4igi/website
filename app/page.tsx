import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import MarqueeTicker from '@/components/sections/MarqueeTicker'
import PathsSection from '@/components/sections/PathsSection'
import WhyParentsSection from '@/components/sections/WhyParentsSection'
import JourneySection from '@/components/sections/JourneySection'
// import CoursesGridSection from '@/components/sections/CoursesGridSection'
import AgeGroupsSection from '@/components/sections/AgeGroupsSection'
import DifferentiatorsSection from '@/components/sections/DifferentiatorsSection'
import StatsSection from '@/components/sections/StatsSection'
import SchedulePreviewSection from '@/components/sections/SchedulePreviewSection'
import PricingSection from '@/components/sections/PricingSection'
import InstructorsSection from '@/components/sections/InstructorsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import LocationsSection from '@/components/sections/LocationsSection'
import QuizCtaSection from '@/components/sections/QuizCtaSection'
import LeadFormSection from '@/components/sections/LeadFormSection'
import Footer from '@/components/sections/Footer'

export const metadata: Metadata = {
  title: 'Quasar Dance - Cursuri de dans în Iași',
  description:
    'Cursuri de dans în Iași pentru copii și adulți: Street Dance, KPOP, Gimnastică artistică și Zumba. Școală cu tradiție din 1981, 3 locații.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Quasar Dance - Cursuri de dans în Iași',
    description:
      'Cursuri de dans în Iași pentru copii și adulți: Street Dance, KPOP, Gimnastică artistică și Zumba. Tradiție din 1981.',
    url: 'https://quasardance.ro',
    siteName: 'Quasar Dance',
    locale: 'ro_RO',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <main>
      {/* Sticky nav — sits above everything */}
      <Navbar />

      {/* 1. Hero — full-screen cinematic */}
      <HeroSection />

      {/* Marquee ticker — seamless scroll of course/brand names */}
      <MarqueeTicker />

      {/* 2. Choose your path — 4 course categories */}
      <PathsSection />

      {/* 3. Why parents choose Quasar — trust & emotion */}
      <WhyParentsSection />

      {/* 4. Journey / Growth system — beginner → pro */}
      <JourneySection />

      {/* 5. Courses preview grid — 4 highlighted courses */}
      {/* <CoursesGridSection /> */}

      {/* 6. Age groups — who is it for */}
      <AgeGroupsSection />

      {/* 7. Differentiators — why Quasar is different */}
      <DifferentiatorsSection />

      {/* 8. Stats / Impact / Social proof */}
      <StatsSection />

      {/* 9. Schedule preview */}
      <SchedulePreviewSection />

      {/* 10. Pricing plans */}
      <PricingSection />

      {/* 11. Instructors preview — 3 cards */}
      <InstructorsSection />

      {/* 11. Testimonials — carousel */}
      <TestimonialsSection />

      {/* 12. Locations — 3 location cards */}
      <LocationsSection />

      {/* 13. Quiz CTA — help undecided users */}
      <QuizCtaSection />

      {/* 14. Lead capture form — demo session */}
      <LeadFormSection />

      {/* 15. Footer */}
      <Footer />
    </main>
  )
}
