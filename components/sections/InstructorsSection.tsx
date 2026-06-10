'use client'

import Link from 'next/link'
import SprayLabel from '@/components/ui/spray-label'
import InstructorDeckCarousel from '@/components/InstructorDeckCarousel'
import { useInView } from '@/hooks/use-in-view'

export default function InstructorsSection() {
  const [sectionRef, sectionInView] = useInView<HTMLElement>()

  return (
    <section id="instructori" ref={sectionRef} className="bg-white py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center"><SprayLabel>Echipa noastră</SprayLabel></div>
          <h2
            className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Nu suntem doar instructori.
            <br />
            <span className="text-[#231f20]/40">Suntem mentori.</span>
          </h2>
          <p className="text-[#6b6b6b] mt-4 max-w-2xl mx-auto">
            Fiecare membru al echipei Quasar aduce pasiune, experiență și personalitate unică.
          </p>
        </div>

        {/* Instructor Carousel */}
        <InstructorDeckCarousel inView={sectionInView} />

        {/* CTA to full team page */}
        <div className="text-center mt-12">
          <Link
            href="/despre-noi#echipa"
            className="inline-flex items-center gap-2 bg-[#f8ef21] text-[#231f20] font-bold text-sm px-6 py-3 rounded-full hover:bg-[#231f20] hover:text-[#f8ef21] transition-all duration-200"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Descoperă întreaga echipă
          </Link>
        </div>
      </div>
    </section>
  )
}
