import { FaWhatsapp } from 'react-icons/fa'
import { WA_NUMBER, WA_TEXT_STANDARD } from '@/lib/whatsapp'

const WHATSAPP_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_TEXT_STANDARD)}`

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
