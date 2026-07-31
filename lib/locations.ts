// Sursa unică de adevăr pentru locațiile Quasar Dance.
// Datele au fost confirmate de client (2026-07-31) și coincid cu telefoanele din
// orarul oficial (vezi `defaultScheduleData` în lib/db/defaults.ts).
//
// IMPORTANT: nu duplica lista asta în componente. Orice pagină care afișează
// locații (homepage, /contact) și orice formular care le trimite mai departe
// (LeadFormSection → CRM) trebuie să importe de aici, ca variantele să nu mai
// poată devia una de alta.

export type Location = {
  id: string
  /** Numele oficial — folosit identic în UI și în valoarea trimisă către CRM. */
  name: string
  address: string
  city: string
  phone: string
  coordinates: { lat: number; lng: number }
  /** Cardul evidențiat (sediul principal) pe homepage. */
  highlight?: boolean
}

export const locations: Location[] = [
  {
    id: 'stefan',
    name: 'Quasar Dance - Ștefan cel Mare',
    address: 'Blvd. Ștefan cel Mare și Sfânt, Nr. 10, et. 1',
    city: 'Galerii Comerciale, Iași',
    phone: '0730 534 172',
    coordinates: { lat: 47.1635894529357, lng: 27.5810635107931 },
    highlight: true,
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

/** Link către Google Maps pentru butoanele „Hartă”. */
export function mapUrl(loc: Location): string {
  return `https://www.google.com/maps/search/?api=1&query=${loc.coordinates.lat},${loc.coordinates.lng}`
}

/** `tel:` normalizat (fără spații) pentru linkurile de telefon. */
export function telHref(loc: Location): string {
  return `tel:${loc.phone.replace(/\s/g, '')}`
}

/** Opțiunile din dropdown-ul formularului de înscriere (valorile ajung în CRM). */
export const locationOptions = [...locations.map((l) => l.name), 'Orice locație']
