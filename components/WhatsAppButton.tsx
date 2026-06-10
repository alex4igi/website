import { FaWhatsapp } from 'react-icons/fa'

const WHATSAPP_NUMBER = '40730534172' // 0730 534 172 în format internațional
const PREFILL = 'Bună! Aș dori mai multe detalii despre cursurile Quasar Dance.'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILL)}`

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Scrie-ne pe WhatsApp"
      className="group fixed bottom-5 left-5 md:bottom-6 md:left-6 z-50 flex items-center justify-center"
    >
      {/* Pulse ring */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping"
      />

      {/* Button */}
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30 transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
        <FaWhatsapp className="text-white" size={30} aria-hidden="true" />
      </span>
    </a>
  )
}
