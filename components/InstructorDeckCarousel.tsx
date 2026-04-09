'use client'

import { useState } from 'react'
import { ArrowRight, Award, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export const instructorsData = [
  {
    name: 'Andrei',
    slug: 'andrei',
    role: 'Hip-Hop · Breaking',
    specialization: 'Street Dance & Urban Choreography',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Andrei-PXdPdsp6SFs2eVUesKfeO47s8DPxxo.jpg',
    years: '15+ ani',
    bio: 'Versatilitatea este cuvântul cheie când vine vorba de Andrei! Indiferent dacă vorbim de Hip-hop, House, New-Style sau Breakdance, Andrei stăpânește tehnicile tuturor acestor stiluri. Pasiunea sa pentru muzică și dans îl face să fie mereu la curent cu ultimele trenduri, iar acest lucru se reflectă în cursurile sale. Andrei crede cu tărie că dansul este mai mult decât mișcare - este un mod de exprimare și de conectare cu muzica și cu comunitatea. El pune un accent deosebit pe energie, iar în cursurile sale vei simți mereu o atmosferă vibrantă și plină de viață.',
  },
  {
    name: 'Ioana',
    slug: 'ioana',
    role: 'Commercial Dance · Heels',
    specialization: 'Commercial Dance & Feminine Style',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ioana-WvaR3IMrq1hEswy1rawgFZGntm4Y5u.jpg',
    years: '10+ ani',
    bio: 'Ioana sau instructorul care te face să te simți puternic și încrezător pe ringul de dans! Fiecare clasă pe care o predă este plină de energie pozitivă, astfel încât o să fii mereu inspirat de creativitatea și încrederea ei. Pe Ioana o găsiți la cursurile de Ladies Style unde îmbină dans cu elemente de gimnastică, ceea ce face fiecare clasă o provocare fizică, dar și mentală. Ioana crede cu tărie că dansul este despre exprimare și împuternicire și se asigură că fiecare elev își poate găsi stilul propriu în cadrul cursurilor.',
  },
  {
    name: 'Igi',
    slug: 'igi',
    role: 'Coregraf · All Styles',
    specialization: 'Coregrafie & Battle',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Igi-Ky2f9IvmGM6865GMiA5ya9qyutPEqK.jpg',
    years: '12+ ani',
    bio: 'Igi sau coregraf extraordinar. Cu o experiență vastă în dans, Igi are un stil unic care combină mai multe genuri de dans, de la hip-hop la contemporan. Creativitatea și atenția sa la detalii fac din fiecare clasă o experiență de neuitat. Elevii săi apreciază pasiunea și dedicarea cu care predă, iar energia pe care o aduce în fiecare sesiune îi motivează să se depășească pe ei înșiși. Igi nu predă doar pași de dans, ci inspiră o comunitate de dansatori pasionați și devotați.',
  },
  {
    name: 'Eva',
    slug: 'eva',
    role: 'Contemporary · Lyrical',
    specialization: 'Dans contemporan & expresie artistică',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Eva-IIkBssUfQtT7G1uSLRF13mljPe0gTa.jpg',
    years: '8+ ani',
    bio: 'Eva sau dansatoarea care îmbină tehnica cu emoția! Stilul ei contemporan este plin de expresivitate, iar fiecare mișcare spune o poveste. În cursurile sale, Eva te învață să te conectezi cu muzica și să îți exprimi emoțiile prin dans. Atmosfera din clasele ei este calmă, dar intens emotivă, iar elevii ei apreciază modul în care îi ajută să găsească propria lor voce artistică. Pentru Eva, dansul este o formă de terapie și o modalitate de a explora identitatea personală.',
  },
  {
    name: 'Mara',
    slug: 'mara',
    role: 'K-Pop · Commercial',
    specialization: 'K-Pop & Commercial Dance',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mara-csKNoHPfic8ThWuLdoOsgHvd4o0UV3.jpg',
    years: '7+ ani',
    bio: 'Mara sau cel mai cool instructor de K-Pop! Dansul K-Pop este mai mult decât mișcare - este o combinație de energie, atitudine și prezență scenică, iar Mara stăpânește perfect aceste elemente. În clasele ei, vei învăța coregrafiile celor mai populare piese K-Pop, dar și tehnici de dans care îți vor crește încrederea și carisma pe scenă. Mara pune accent pe sincronizare și pe lucrul în echipă, iar atmosfera din cursurile ei este mereu plină de distracție și entuziasm.',
  },
  {
    name: 'Roxana',
    slug: 'roxana',
    role: 'Girly Hip-Hop · Commercial',
    specialization: 'Feminine Hip-Hop & Commercial',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Roxana-LGLGA2B2CDwnsm9JaCICQ1AZFQBwCH.jpg',
    years: '9+ ani',
    bio: 'Roxana sau instructorul care îți arată că feminitatea și puterea merg mână în mână! În clasele sale de Girly Hip-Hop, vei învăța să îmbini mișcări puternice de hip-hop cu elemente de dans feminin și elegant. Roxana crede că dansul este o modalitate de a-ți celebra individualitatea și de a-ți exprima stilul unic. Atmosfera din cursurile ei este pozitivă și motivantă, iar elevii ei apreciază modul în care îi încurajează să fie ei înșiși și să se simtă încrezători pe ringul de dans.',
  },
  {
    name: 'Alin',
    slug: 'alin',
    role: 'Hip-Hop · House',
    specialization: 'Old School & Hip-Hop Foundations',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Alin-FneSXWpD1hwq3Nroa8YXV9Hmv4ys46.jpg',
    years: '13+ ani',
    bio: 'Alin sau instructorul care îți arată ce înseamnă să ai "flow"! Cu o pasiune profundă pentru hip-hop și house, Alin aduce autenticitate și energie pozitivă în fiecare clasă. Stilul său de predare pune accent pe fundamentele dansului urban și pe dezvoltarea propriului stil. Pentru Alin, dansul este despre libertate de exprimare și bucurie, iar elevii săi apreciază atmosfera relaxată și prietenoasă din cursurile sale. Vei învăța nu doar tehnici, ci și spiritul autentic al culturii hip-hop.',
  },
  {
    name: 'Bianca',
    slug: 'bianca',
    role: 'Dans pentru copii',
    specialization: 'Cursuri pentru copii & Adolescenți',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bianca-3pOfsgUQDTKnBAeRaTWK7yWGRc2XqY.jpg',
    years: '11+ ani',
    bio: 'Bianca sau instructorul preferat al copiilor, cum ne mai place nouă să o numim, este dansatoare, coregraf și fondatoare atât a trupei de copii, MiniQ\'s, cat și a trupei de adolescenți, TheQoolKids. Pe Bianca o întâlniți la cursurile pentru copii și adolescenți, unde alege cele mai energice piese, astfel încât le este imposibil copiilor să se plictisească!',
  },
  {
    name: 'Ana',
    slug: 'ana',
    role: 'Hip-Hop · Popping',
    specialization: 'Hip-Hop & Funk Styles',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ana-T9q0FBI0ly5P22wdrFFoWuXJEnb8iB.jpg',
    years: '6+ ani',
    bio: 'Ana sau dansatoarea care îți arată că dansul este despre pasiune și dedicare! Cu un stil dinamic și plin de energie, Ana predă hip-hop și popping cu aceeași intensitate și entuziasm. În clasele ei, vei învăța tehnici de dans urban și vei lucra la dezvoltarea propriului flow. Ana crede că fiecare elev are potențialul de a deveni un dansator extraordinar, iar abordarea ei pozitivă și încurajatoare face din fiecare clasă o experiență memorabilă.',
  },
]

interface InstructorDeckCarouselProps {
  instructors?: typeof instructorsData
  inView?: boolean
}

export default function InstructorDeckCarousel({ 
  instructors = instructorsData, 
  inView = true 
}: InstructorDeckCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [selectedInstructor, setSelectedInstructor] = useState<typeof instructorsData[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handlePrev = () => setActiveIndex((prev) => (prev === 0 ? instructors.length - 1 : prev - 1))
  const handleNext = () => setActiveIndex((prev) => (prev === instructors.length - 1 ? 0 : prev + 1))

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX)
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) handleNext()
    if (touchStart - touchEnd < -75) handlePrev()
  }

  return (
    <div className="relative">
      {/* Card deck container */}
      <div 
        className="relative mx-auto max-w-4xl"
        style={{ height: '600px' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background stacked cards - fanned out when in view */}
        {instructors.map((instructor, i) => {
          const offset = i - activeIndex
          const isActive = i === activeIndex
          const isBehind = offset < 0
          const isAhead = offset > 0
          
          // Calculate fan-out position
          let transform = ''
          let zIndex = 0
          let opacity = 0
          
          if (isActive) {
            transform = 'translateX(0) translateY(0) scale(1) rotate(0deg)'
            zIndex = 10
            opacity = 1
          } else if (isBehind) {
            // Cards behind (already shown) - fan to the left
            const fanOffset = Math.min(Math.abs(offset), 3)
            transform = `translateX(${-80 * fanOffset}%) translateY(${20 * fanOffset}px) scale(${1 - fanOffset * 0.1}) rotate(${-8 * fanOffset}deg)`
            zIndex = 10 - Math.abs(offset)
            opacity = inView ? 0.4 : 0
          } else if (isAhead) {
            // Cards ahead - fan to the right
            const fanOffset = Math.min(offset, 3)
            transform = `translateX(${80 * fanOffset}%) translateY(${20 * fanOffset}px) scale(${1 - fanOffset * 0.1}) rotate(${8 * fanOffset}deg)`
            zIndex = 10 - offset
            opacity = inView ? 0.4 : 0
          }

          return (
            <div
              key={instructor.slug}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm transition-all duration-700 ease-out cursor-pointer"
              style={{
                transform,
                zIndex,
                opacity,
                transitionDelay: inView ? `${Math.abs(offset) * 60}ms` : '0ms',
              }}
              onClick={() => !isActive && setActiveIndex(i)}
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border-4 border-[#231f20] shadow-2xl bg-white">
                {/* Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${instructor.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#231f20] via-transparent to-transparent" />
                
                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  {/* Top: Name badge */}
                  <div>
                    <div
                      className="inline-block bg-[#f8ef21] text-[#231f20] font-black text-xl md:text-2xl px-4 py-2 rounded-xl shadow-lg"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {instructor.name}
                    </div>
                  </div>

                  {/* Bottom: Bio card */}
                  <div className="bg-[#231f20]/95 backdrop-blur-md rounded-2xl p-4 border-2 border-[#f8ef21]/20">
                    <div className="text-[#f8ef21] text-sm font-bold mb-1 uppercase tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                      {instructor.role}
                    </div>
                    <div className="text-white/60 text-xs mb-3">{instructor.specialization}</div>
                    <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
                      {instructor.bio}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#f8ef21] text-xs font-bold">
                        <Award size={14} />
                        {instructor.years} experiență
                      </div>
                      {isActive && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedInstructor(instructor)
                            setIsDialogOpen(true)
                          }}
                          className="text-[#f8ef21] text-xs font-bold hover:text-white transition-colors flex items-center gap-1"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          Vezi detalii
                          <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-[#231f20] text-[#f8ef21] p-3 md:p-4 rounded-full hover:bg-[#f8ef21] hover:text-[#231f20] transition-all duration-200 shadow-xl"
        aria-label="Instructor anterior"
      >
        <ArrowRight size={24} className="rotate-180" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-[#231f20] text-[#f8ef21] p-3 md:p-4 rounded-full hover:bg-[#f8ef21] hover:text-[#231f20] transition-all duration-200 shadow-xl"
        aria-label="Instructor următor"
      >
        <ArrowRight size={24} />
      </button>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {instructors.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'bg-[#f8ef21] w-8' : 'bg-[#231f20]/20'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Card counter */}
      <div className="text-center mt-4">
        <span className="text-[#231f20] font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
          {activeIndex + 1} / {instructors.length}
        </span>
      </div>

      {/* Instructor Detail Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          {selectedInstructor && (
            <>
              <DialogHeader>
                <DialogTitle className="sr-only">{selectedInstructor.name}</DialogTitle>
              </DialogHeader>
              
              <div className="flex flex-col gap-6">
                {/* Instructor Image & Name */}
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 rounded-2xl overflow-hidden border-4 border-[#231f20] shadow-lg">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${selectedInstructor.image}')` }}
                    />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h2
                      className="text-[#231f20] text-3xl md:text-4xl font-black mb-2"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {selectedInstructor.name}
                    </h2>
                    <div
                      className="inline-block bg-[#f8ef21] text-[#231f20] text-sm font-bold px-4 py-2 rounded-full mb-2"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {selectedInstructor.role}
                    </div>
                    <div className="text-[#6b6b6b] text-sm mb-3">
                      {selectedInstructor.specialization}
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-[#231f20] text-sm font-bold">
                      <Award size={16} />
                      {selectedInstructor.years} experiență
                    </div>
                  </div>
                </div>

                {/* Full Bio */}
                <div className="prose prose-sm max-w-none">
                  <p className="text-[#231f20] leading-relaxed text-base">
                    {selectedInstructor.bio}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
