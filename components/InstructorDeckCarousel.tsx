'use client'

import { useRef, useState } from 'react'
import { ArrowRight, Award, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export const instructorsData = [
  {
    name: 'Igi',
    slug: 'igi',
    role: 'Fondator · All Styles',
    specialization: 'Street Dance · toate stilurile',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Igi-Ky2f9IvmGM6865GMiA5ya9qyutPEqK.jpg',
    years: '20+ ani',
    bio: 'Igi (Alex) este fondatorul și sufletul comunității Quasar Dance. Dansează de peste 20 de ani și a studiat toate stilurile de street dance, așa că poate preda orice stil — de la primii pași ai unui începător până la nivel avansat. Nu vorbește despre trofee, ci despre ceva mai greu de câștigat: a ținut sus steagul street dance-ului în Iași timp de peste două decenii. Sau, cum spunea un prieten, „a scris istoria street dance-ului în Iași". Pentru Igi, dansul e mai mult decât mișcare — e cultura urbană pe care o transmite mai departe, generație după generație. La cursurile lui, fiecare începător se simte binevenit, indiferent de vârstă sau experiență, pentru că el crede cu tărie că oricine poate dansa și că cel mai important e primul pas. Cu răbdare, energie și pasiune, Igi construiește o comunitate în care dansul înseamnă libertate, respect și apartenență.',
  },
  {
    name: 'Andrei',
    slug: 'andrei',
    role: 'Choreo Class · Zumba',
    specialization: 'Coregraf UNIQ Crew & RockOnQ',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Andrei-PXdPdsp6SFs2eVUesKfeO47s8DPxxo.jpg',
    years: '15+ ani',
    bio: 'Andrei — pe scenă, ANDRW — este coregraf al trupelor UNIQ Crew și QTheCrew și coordonator al trupei profesionale RockOnQ. Predă grupele noastre de studenți (Choreo Class), unde energia debordantă și coregrafiile dinamice sunt mereu vedeta serii. Este, totodată, instructor de Zumba, cu certificări în Core Training, Afro Rhythms și Cue Like a Pro. La Quasar For Kids îi îndrumă pe cei mici din grupele Tiny și Junior, ajutând, alături de colegii săi, la formarea noilor generații de dansatori. Pentru Andrei, dansul e mult mai mult decât o activitate — este felul lui de a transmite energie, motivație și bucurie. La cursurile lui atmosfera e mereu plină de viață, iar visul lui e ca fiecare om din sală să simtă libertatea și fericirea pe care le aduce dansul.',
  },
  {
    name: 'Bianca',
    slug: 'bianca',
    role: 'Instructor adolescenți',
    specialization: 'Coregrafă MiniQ\'s · RockOnQ',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bianca-3pOfsgUQDTKnBAeRaTWK7yWGRc2XqY.jpg',
    years: '11+ ani',
    bio: 'Bianca este instructorul de suflet al adolescenților. Cu o adevărată armată de peste 80 de fete în jurul ei, reușește de fiecare dată să le cucerească prin coregrafiile sale și să le ofere un vibe bun din clipa în care pășesc în Quasar Dance. Este fondatoarea, coregrafa și liderul trupei de copii MiniQ\'s, care a adunat premii precum Locul 1 la Dance Star București \'25 și Locul 1 la World Dance Masters Croația \'25 — și lista continuă. Bianca este și membră a trupei RockOnQ și te așteaptă să-ți descoperi stilul, corpul și un nou cerc de prieteni la clubul nostru de dans Quasar Dance.',
  },
  {
    name: 'Eva',
    slug: 'eva',
    role: 'Dancehall · Tutting',
    specialization: 'Hip-Hop groove · tehnică & flow',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Eva-IIkBssUfQtT7G1uSLRF13mljPe0gTa.jpg',
    years: '9 ani',
    bio: 'Eva are 9 ani de experiență continuă în dans și se regăsește cel mai bine în stiluri bazate pe flow — dancehall și tutting — dar și în groove-ul de hip-hop. Îi place să exploreze creativ forme abstracte și mișcări noi. Primul ei camp de dans, Lemon Dance Camp, a fost experiența care i-a definit pasiunea și a ajutat-o să crească tehnic și să rețină coregrafii și detalii cu ușurință. Punctele ei forte sunt tehnica și acuratețea — execuția precisă a mișcărilor, muzicalitatea și atenția la detalii. Are un flow natural și molipsitor, prin care integrează mișcările armonios și expresiv; așa a acumulat experiență scenică și se adaptează ușor la contexte artistice diferite. Predă dans pentru copii și adolescenți, cu răbdare, creativitate și deschidere. Lucrul cu cei tineri i-a întărit dorința de a învăța mereu și de a crea un spațiu în care dansul devine mod de exprimare, încredere și dezvoltare personală.',
  },
  {
    name: 'Ioana',
    slug: 'ioana',
    role: 'Street Dance · Copii',
    specialization: 'Fondatoare Q Motion · RockOnQ',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ioana-WvaR3IMrq1hEswy1rawgFZGntm4Y5u.jpg',
    years: '10+ ani',
    bio: 'Ioana este o tânără plină de energie, pentru care dansul este cel mai autentic mod de a-și exprima vitalitatea și bucuria de a trăi. Instructoare dedicată și iubitoare de copii, ea emană căldură, grijă și o energie molipsitoare, care o transformă repede în prietena și sprijinul celor mici. Cu peste 10 ani de experiență în dans, Ioana a explorat numeroase stiluri, de la dansuri de societate până la dansuri tematice inspirate din culturi diferite, însă cea mai mare pasiune a ei rămâne street dance-ul. Drumul ei artistic a început la Dance Factory Vaslui, iar odată ajunsă la Iași pentru studii, a pornit o colaborare frumoasă și plină de succes cu Quasar Dance. Astăzi este membră a trupei RockOnQ, coordonează mai multe grupe de copii și este fondatoarea Q Motion, una dintre cele mai tinere trupe care au obținut titlul de trupă. Prin energie, empatie și pasiune, Ioana reușește să fie nu doar instructoare, ci și cea mai bună prietenă a celor mici.',
  },
  {
    name: 'Adrian',
    slug: 'adrian',
    role: 'Popping · Tutting · House',
    specialization: 'Hip-Hop · sincroane & tehnică',
    image: '/placeholder-user.jpg',
    years: '15 ani',
    bio: 'Adrian dansează de 15 ani. În România a câștigat locul 1 cu toate momentele solo pregătite pentru concursuri precum BDF, SDF sau Dance Star România și s-a calificat în Finala Dance Star Croația, unde a concurat alături de cei mai buni dansatori ai lumii și a obținut locul 5 din 14. Experiența aceea l-a făcut să înțeleagă cât de multe mai are de învățat — și exact asta își dorește să facă toată viața: să muncească din greu ca să devină unul dintre cei mai buni dansatori ai României. Pe acest drum și-a dat seama că vrea să împărtășească tot ce știe cu toți cei dornici și pasionați să-și exprime emoțiile prin dans, ca să evolueze împreună. Stilurile lui preferate sunt Popping, Tutting, House și Hip-Hop, iar pe scenă se simte cel mai bine creând sincroane cu grupuri mari, cu accent pe tehnică, accente și energie. Îi place să simtă cum muzica îi dictează mișcările și să-și spună povestea și emoțiile prin ceea ce arată publicului — astfel încât oamenii să plece nu doar cu amintirea unei coregrafii faine, ci și cu un mesaj.',
  },
  {
    name: 'Giulia',
    slug: 'giulia',
    role: 'K-Pop Covers',
    specialization: '1-Up Crew · dans pentru copii',
    image: '/placeholder-user.jpg',
    years: '15+ ani',
    bio: 'Giulia este una dintre membrele originare ale trupei de K-pop covers 1-Up Crew și dansează de peste 15 ani. Iubește K-pop-ul din toată inima și pune această pasiune în fiecare coregrafie pe care o predă. Are un talent aparte de a se conecta cu cei mici — intră ușor în lumea lor, le vorbește pe limba lor și transformă fiecare oră într-o joacă plină de energie. Atentă la detalii și mereu în căutarea mișcării perfecte, Giulia este instructorul ideal pentru cei care vor să descopere universul vibrant al K-pop-ului.',
  },
  {
    name: 'Roxana',
    slug: 'roxana',
    role: 'Fondatoare Quasar for Kids',
    specialization: 'Administrativ & comunitate',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Roxana-LGLGA2B2CDwnsm9JaCICQ1AZFQBwCH.jpg',
    years: '',
    bio: 'Roxana este mintea administrativă a Quasarului — omul structurat care ține totul la locul lui și dă formă culturii noastre organizaționale. Este fondatoarea Quasar for Kids și a comunității care a crescut în jurul acestuia, iar grija ei se simte în tot: are grijă de angajați, de comunitate și de valorile care ne țin împreună. Iubește felul în care se simte atunci când dansează și pune exact această bucurie în tot ceea ce construiește pentru Quasar.',
  },
  {
    name: 'Alin',
    slug: 'alin',
    role: 'Gimnastică acrobatică · Parkour',
    specialization: 'Absolvent FEFS Iași',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Alin-FneSXWpD1hwq3Nroa8YXV9Hmv4ys46.jpg',
    years: '15+ ani',
    bio: 'Alin este instructorul nostru specializat în gimnastică acrobatică și parkour. Absolvent al Facultății de Educație Fizică și Sport din Iași (FEFS), predă dans și gimnastică de peste 15 ani. Și-a început drumul la Roman și Botoșani, înainte să se stabilească la Iași. Diminețile și le petrece dansând prin școli și grădinițe, iar serile și weekendurile, la sediul din Nicolina. Mereu vesel și cu gluma la el, Alin este un membru de nelipsit al comunității Quasar.',
  },
  {
    name: 'Theo',
    slug: 'theo',
    role: 'Instructor dans',
    specialization: 'Muzică & energie bună',
    image: '/placeholder-user.jpg',
    years: '',
    bio: 'Theo este o persoană calmă și foarte răbdătoare, mereu curioasă să descopere lucruri noi, chiar și din domenii complet diferite. Muzica a fost dintotdeauna o parte importantă din viața sa, iar dansul vine firesc odată cu ea. Îi place să creeze, să găsească soluții și să fie alături de cei din jur atunci când au nevoie. Și, mai presus de toate, îi place să aducă energie bună în tot ceea ce face.',
  },
  {
    name: 'Mara',
    slug: 'mara',
    role: 'Street Dance',
    specialization: '1-Up Crew · RockOnQ',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mara-csKNoHPfic8ThWuLdoOsgHvd4o0UV3.jpg',
    years: '6+ ani',
    bio: 'Cunoscută pentru energia ei molipsitoare și pentru felul incredibil în care reușește să jongleze cu un program plin, Mara face totul din pasiune pură pentru dans și pentru comunitatea Quasar. Cu peste 6 ani de experiență în care îmbină street dance-ul cu disciplina sportivă, ea este omul care îi motivează pe cei din jur să-și depășească limitele. După parcursul în trupa 1-Up Crew și succesul actual alături de RockOnQ pe scene internaționale precum World of Dance, Mara te așteaptă în sala din Nicolina ca să descoperi împreună bucuria dansului. Stilul ei de predare e un echilibru perfect între relaxare și ambiție — locul unde fiecare cursant învață să fie activ, pozitiv și sigur pe propriile mișcări.',
  },
  {
    name: 'Ana',
    slug: 'ana',
    role: 'Street Dance · Copii',
    specialization: 'Membră RockOnQ',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ana-T9q0FBI0ly5P22wdrFFoWuXJEnb8iB.jpg',
    years: '10+ ani',
    bio: 'Ana face parte din familia Quasar Dance de peste 10 ani — a început să danseze chiar în sala din Nicolina. Este membră a trupei RockOnQ, alături de care a participat la numeroase concursuri internaționale, a câștigat premii și a învățat de la coregrafi diferiți. Ana este o fire prietenoasă, calmă și caldă, iar lucrul cu copiii îi aduce multă bucurie. Prin rolul ei de instructoare își dorește să transmită mai departe pasiunea pentru dans și să-i ajute pe cei mici să crească prin mișcare și creativitate.',
  },
  {
    name: 'Petruța',
    slug: 'petruta',
    role: 'Recepție · Trupa UniQ',
    specialization: 'Comunitatea Quasar',
    image: '/placeholder-user.jpg',
    years: '',
    bio: 'Cu un zâmbet cald, voie bună și veșnica întrebare „cash sau card?", Petruța te întâmpină la recepția din Ștefan. A intrat în comunitatea Quasar acum 3 ani, la cursul de studenți, acolo unde dansul a devenit pentru ea o formă de terapie. Pasiunea i-a crescut an de an, iar acum face parte din trupa UniQ.',
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
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const touchMoved = useRef(false)
  const [selectedInstructor, setSelectedInstructor] = useState<typeof instructorsData[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handlePrev = () => setActiveIndex((prev) => (prev === 0 ? instructors.length - 1 : prev - 1))
  const handleNext = () => setActiveIndex((prev) => (prev === instructors.length - 1 ? 0 : prev + 1))

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = e.targetTouches[0].clientX
    touchMoved.current = false
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
    touchMoved.current = true
  }
  const handleTouchEnd = () => {
    if (!touchMoved.current) return
    const delta = touchStartX.current - touchEndX.current
    if (delta > 75) handleNext()
    else if (delta < -75) handlePrev()
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
                      {instructor.years ? (
                        <div className="flex items-center gap-2 text-[#f8ef21] text-xs font-bold">
                          <Award size={14} />
                          {instructor.years} experiență
                        </div>
                      ) : (
                        <span />
                      )}
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
                    {selectedInstructor.years && (
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-[#231f20] text-sm font-bold">
                        <Award size={16} />
                        {selectedInstructor.years} experiență
                      </div>
                    )}
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
