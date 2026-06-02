import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import CoursePage from '@/components/cursuri/CoursePage'
import { courses, courseMetadata, courseJsonLd } from '@/lib/courses'

const SLUG = 'street-dance'

export const metadata: Metadata = courseMetadata(SLUG)

export default function StreetDancePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd(SLUG)) }}
      />
      <Navbar />
      <CoursePage course={courses[SLUG]} />
      <Footer />
    </main>
  )
}
