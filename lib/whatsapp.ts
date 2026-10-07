/** Numărul nostru de WhatsApp (recepția Ștefan, 0730 534 172), în formatul wa.me. */
export const WA_NUMBER = '40730534172'

export const WA_TEXT_STANDARD = 'Bună! Aș dori mai multe detalii despre cursurile Quasar Dance.'

/**
 * Cine a intrat pe site din QR-ul flyerelor Valea Lupului primește textul ăsta pe ORICE
 * buton de WhatsApp, cât ține tabul (Alex, 07.10.2026) — recepția vede din primul mesaj
 * despre ce e vorba. Ceilalți primesc textul standard, inclusiv pe /valea-lupului.
 */
export const WA_TEXT_FLYER_VL =
  'Bună! Am primit flyerul Quasar Dance de la Școala Verde și aș vrea detalii despre cursurile din Valea Lupului.'

/** UTM-urile puse de redirectul `/vl/<lot>` din next.config.mjs. */
export const VL_FLYER_UTM = { source: 'flyer', campaign: 'valea_lupului_deschidere' } as const
