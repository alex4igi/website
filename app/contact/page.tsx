'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import SprayLabel from '@/components/ui/spray-label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const locations = [
  {
    id: 'stefan',
    name: 'Quasar Dance - Ștefan cel Mare',
    address: 'Blvd. Ștefan cel Mare și Sfânt, Nr. 10, et. 1',
    city: 'Galerii Comerciale, Iași',
    phone: '0730 534 172',
    coordinates: { lat: 47.1635894529357, lng: 27.5810635107931 },
  },
  {
    id: 'nicolina',
    name: 'Quasar Dance - Nicolina',
    address: 'Strada Izvor 14',
    city: 'Iași',
    phone: '0770 227 580',
    coordinates: { lat: 47.14095492580996, lng: 27.583403997298678 },
  },
  {
    id: 'kids',
    name: 'Quasar for Kids',
    address: 'Strada Clopoțari 24',
    city: 'Nicolina, Iași',
    phone: '0745 371 200',
    coordinates: { lat: 47.13719333961962, lng: 27.580221653120905 },
  },
]

const faqs = [
  {
    question: 'Cum mă pot înscrie la cursuri?',
    answer:
      'Înscrierile la cursurile de dans se pot face direct de pe site, completând acest formular, telefonic la 0730 534 172 sau direct la sală.',
  },
  {
    question: 'Oferiți cursuri private?',
    answer:
      'Da, oferim cursuri private personalizate pentru toate vârstele și nivelurile. Contactează-ne pentru mai multe detalii și pentru a stabili un program potrivit!',
  },
  {
    question: 'Care este prețul?',
    answer:
      'Prețurile variază în funcție de tipul de curs, frecvența și durata sesiunilor. Verifică secțiunea "Program & Prețuri" sau contactează-ne direct pentru o ofertă personalizată.',
  },
  {
    question: 'Nu am dansat niciodată până acum, pot să mă înscriu chiar și așa?',
    answer:
      'Absolut da! Majoritatea cursanților noștri pornesc de la nivel începător. Avem cursuri dedicate începătorilor, cu instructori care te vor ghida pas cu pas și îți vor construi încrederea în dans.',
  },
  {
    question: 'Cum pot intra în trupa Quasar Dance?',
    answer:
      'Pentru a intra în trupa Quasar Dance, trebuie să participi la cursuri și să atingi un nivel avansat. Periodic organizăm audiții pentru trupă. Vorbește cu instructorul tău pentru mai multe detalii.',
  },
  {
    question: 'Mă pot alătura grupelor chiar dacă am pierdut perioada de înscriere?',
    answer:
      'Da, înscrierile sunt deschise tot timpul anului! Poți să te alături oricând, iar instructorul te va ajuta să te integrezi rapid în grup.',
  },
  {
    question: 'Oferiți și cursuri online de dans?',
    answer:
      'Momentan ne concentrăm pe experiența fizică la sală, dar organizăm ocazional workshopuri online. Abonează-te la newsletter pentru a fi la curent cu toate noutățile!',
  },
  {
    question: 'Ce stiluri de dans se predau?',
    answer:
      'Predăm o varietate largă de stiluri: Street Dance, Hip-Hop, KPOP, Breaking, Commercial Dance, dans pentru copii, gimnastică artistică și acrobatică. Explorează secțiunea "Cursuri" pentru detalii complete.',
  },
  {
    question: 'Dacă nu mă înscriu online, pot veni direct la sală?',
    answer:
      'Da, poți veni direct la sală în timpul programului și te vom ajuta cu plăcere să te înscrii. Totuși, recomandăm să anunți telefonic pentru a fi sigur că mai sunt locuri disponibile.',
  },
  {
    question: 'Cum trebuie să mă îmbrac la cursurile de dans?',
    answer:
      'Recomandăm haine comode și elastice (tricou, pantaloni de trening sau leggings) și adidași de dans sau sport cu talpă plată. Evită bijuteriile mari sau hainele prea largi.',
  },
  {
    question: 'Se poate plăti cash și/sau card?',
    answer:
      'Da, acceptăm atât plata cash cât și plata cu cardul. De asemenea, poți face plata online prin formularele de înscriere de pe site.',
  },
  {
    question: 'Am nevoie de papuci de schimb?',
    answer:
      'Da, este obligatoriu să ai papuci de schimb pentru sala de dans. Aceștia trebuie să fie curați și dedicați exclusiv pentru interior, pentru a menține igiena și siguranța tuturor.',
  },
  {
    question: 'Există spectacole sau concursuri la care pot participa?',
    answer:
      'Da! Organizăm spectacole anuale, participăm la concursuri naționale și internaționale, și organizăm evenimente pentru comunitatea Quasar. Toți cursanții sunt încurajați să participe.',
  },
  {
    question: 'Se poate închiria sala pentru diverse activități?',
    answer:
      'Da, salele noastre pot fi închiriate pentru evenimente private, workshopuri, filmări sau alte activități. Contactează-ne pentru disponibilitate și tarife.',
  },
  {
    question: 'Dacă am mai dansat înainte, pot merge direct la cursurile de nivel 2?',
    answer:
      'Da, dacă ai experiență anterioară, te încurajăm să vii la o oră de probă pentru a evalua nivelul tău. Instructorul îți va recomanda grupul potrivit pentru a continua evoluția.',
  },
  {
    question: 'Pot participa în tabără chiar dacă nu sunt cursant?',
    answer:
      'Da, taberele noastre sunt deschise atât cursanților Quasar cât și altor pasionați de dans. Verifică secțiunea "Evenimente" sau contactează-ne pentru detalii despre următoarea tabără.',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic here
    console.log('[v0] Contact form submitted:', formData)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-[#231f20] via-[#2a2527] to-[#231f20] overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f8ef21' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 text-center">
          <div className="mb-6 flex justify-center">
            <SprayLabel>Contact</SprayLabel>
          </div>
          <h1
            className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-balance mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Hai să vorbim!
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Never miss a chance to dance! Pentru mai multe informații, nu ezita să ne contactezi.
          </p>

          {/* Quick contact pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            <a
              href="tel:0730534172"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-3 rounded-full hover:bg-[#f8ef21] hover:text-[#231f20] transition-all duration-200 border border-white/20"
            >
              <Phone size={16} />
              <span className="font-semibold text-sm">0730 534 172</span>
            </a>
            <a
              href="mailto:contact@quasardance.ro"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-3 rounded-full hover:bg-[#f8ef21] hover:text-[#231f20] transition-all duration-200 border border-white/20"
            >
              <Mail size={16} />
              <span className="font-semibold text-sm">Email</span>
            </a>
          </div>
        </div>
      </section>

      {/* Locations with Map */}
      <section className="py-20 md:py-32 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12">
            <div className="mb-4 flex justify-center">
              <SprayLabel>Locațiile noastre</SprayLabel>
            </div>
            <h2
              className="text-[#231f20] text-3xl md:text-5xl font-extrabold leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              3 locații în Iași.
              <br />
              <span className="text-[#231f20]/40">Una aproape de tine.</span>
            </h2>
          </div>

          {/* Map Container */}
          <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#231f20]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2712.345!2d27.5810635107931!3d47.1635894529357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40cafb7d34e0e5b7%3A0x1234567890!2sQuasar%20Dance%20Stefan%20cel%20Mare!5e0!3m2!1sen!2sro!4v1234567890123!5m2!1sen!2sro&z=16"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Quasar Dance Stefan cel Mare - Locație principală"
            />
          </div>

          {/* Location Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {locations.map((location, i) => (
              <div
                key={location.id}
                className="bg-white rounded-2xl p-6 border-2 border-[#e5e5e5] hover:border-[#f8ef21] transition-all duration-300 hover:shadow-xl"
              >
                {i === 0 && (
                  <div className="mb-4">
                    <SprayLabel>Sediu principal</SprayLabel>
                  </div>
                )}
                <h3
                  className="text-[#231f20] text-xl font-bold mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {location.name}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#f8ef21] flex-shrink-0 mt-0.5" />
                    <div className="text-[#6b6b6b] text-sm">
                      <div>{location.address}</div>
                      <div>{location.city}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-[#f8ef21] flex-shrink-0" />
                    <a
                      href={`tel:${location.phone.replace(/\s/g, '')}`}
                      className="text-[#231f20] font-semibold text-sm hover:text-[#f8ef21] transition-colors"
                    >
                      {location.phone}
                    </a>
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#231f20] text-white font-bold text-sm px-4 py-3 rounded-full hover:bg-[#f8ef21] hover:text-[#231f20] transition-all duration-200"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Deschide în Maps
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <div className="mb-6">
                <SprayLabel>Trimite-ne un mesaj</SprayLabel>
              </div>
              <h2
                className="text-[#231f20] text-3xl md:text-4xl font-extrabold leading-tight mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Hai să începem o conversație!
              </h2>
              <p className="text-[#6b6b6b] mb-8">
                Completează formularul de mai jos și îți vom răspunde în cel mai scurt timp posibil.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[#231f20] font-bold text-sm mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Nume complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e5e5] focus:border-[#f8ef21] focus:outline-none transition-colors"
                    placeholder="Ion Popescu"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-[#231f20] font-bold text-sm mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e5e5] focus:border-[#f8ef21] focus:outline-none transition-colors"
                    placeholder="ion@email.ro"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-[#231f20] font-bold text-sm mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e5e5] focus:border-[#f8ef21] focus:outline-none transition-colors"
                    placeholder="07XX XXX XXX"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-[#231f20] font-bold text-sm mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Mesajul tău *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#e5e5e5] focus:border-[#f8ef21] focus:outline-none transition-colors resize-none"
                    placeholder="Spune-ne cum te putem ajuta..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#f8ef21] text-[#231f20] font-black text-base px-6 py-4 rounded-full hover:bg-[#231f20] hover:text-[#f8ef21] transition-all duration-200 shadow-lg hover:shadow-xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <Send size={18} />
                  Trimite mesajul
                </button>
              </form>

              {/* Alternative contact */}
              <div className="mt-8 p-6 bg-[#f5f5f5] rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="bg-[#f8ef21] p-3 rounded-full">
                    <MessageCircle size={20} className="text-[#231f20]" />
                  </div>
                  <div>
                    <h4
                      className="text-[#231f20] font-bold mb-1"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Preferi să vorbim direct?
                    </h4>
                    <p className="text-[#6b6b6b] text-sm mb-3">
                      Suntem disponibili de Luni până Sâmbătă, 15:00 - 21:00
                    </p>
                    <a
                      href="tel:0730534172"
                      className="text-[#231f20] font-bold hover:text-[#f8ef21] transition-colors"
                    >
                      📞 0730 534 172
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <div className="mb-6">
                <SprayLabel>FAQ</SprayLabel>
              </div>
              <h2
                className="text-[#231f20] text-3xl md:text-4xl font-extrabold leading-tight mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Întrebări frecvente
              </h2>
              <p className="text-[#6b6b6b] mb-8">
                Răspunsuri la cele mai des întâlnite întrebări. Nu găsești ce cauți? Contactează-ne!
              </p>

              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`item-${i}`}
                    className="bg-[#f5f5f5] rounded-xl px-5 border-2 border-transparent data-[state=open]:border-[#f8ef21] data-[state=open]:bg-white transition-all"
                  >
                    <AccordionTrigger
                      className="text-left hover:no-underline"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      <span className="text-[#231f20] font-bold pr-4">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-[#6b6b6b] leading-relaxed">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .reveal.in-view {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}
