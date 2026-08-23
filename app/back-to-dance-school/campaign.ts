/**
 * Configurația campaniei "Back to Dance School" (Săptămâna Porților Deschise, 7–11 sept. 2026).
 *
 * Tot ce se poate schimba fără să umbli în JSX stă aici: valorile trimise către
 * /api/inscriere, ID-urile de conversie și textele de contact.
 */

export const CAMPAIGN_ID = "btds-2026";

/**
 * Numele campaniei trimis către QApp. Se regăsește în `campanii_promovare` și devine
 * `leads.sursa`, deci după el se filtrează lead-urile campaniei în board-ul de lead-uri.
 * Dacă nu există, QApp o creează automat la primul lead.
 */
export const QAPP_CAMPAIGN = "ZPD 2026";

export const LP_PATH = "/back-to-dance-school";
export const THANK_YOU_PATH = "/back-to-dance-school/multumim";
export const SITE_URL = "https://www.quasardance.ro";

/** Endpoint-ul existent al site-ului, care livrează lead-urile în QApp. */
export const LEAD_ENDPOINT = "/api/inscriere";

/**
 * ID-ul de conversie Google Ads, format "AW-XXXXXXXXX/AbC-D_efG".
 * Lăsat gol => evenimentul Google Ads nu se declanșează (GA4 și Meta merg oricum).
 */
export const GOOGLE_ADS_CONVERSION = "";

/** Cheia sub care marcăm un lead trimis, ca pagina de mulțumire să numere doar conversiile reale. */
export const LEAD_FLAG_KEY = "qd_btds_lead";
/** Cheia sub care păstrăm UTM-urile, ca atribuirea să supraviețuiască unui refresh. */
export const UTM_STORAGE_KEY = "qd_btds_utm";

export const PHONE_MAIN = "0730 534 172";
export const PHONE_MAIN_TEL = "+40730534172";
export const WHATSAPP_NUMBER = "40730534172";

export const AGE_GROUPS = [
  {
    key: "tiny",
    /** Valoare trimisă ca `grupa_varsta`. QApp o validează strict pe enum-ul `grupa_lead`. */
    value: "Tiny",
    name: "Tiny",
    age: "4 – 6 ani",
    ageShort: "4–6 ani",
    blurb:
      "Primii pași prin joc, muzică și mișcare liberă. Grupe mici, instructori care au răbdare cu cei mici.",
  },
  {
    key: "junior",
    value: "Junior",
    name: "Junior",
    age: "7 – 10 ani",
    ageShort: "7–10 ani",
    blurb:
      "Se așază baza tehnică: ritm, coordonare și primele coregrafii învățate în grup.",
  },
  {
    key: "varsity",
    value: "Varsity",
    name: "Varsity",
    age: "11 – 14 ani",
    ageShort: "11–14 ani",
    blurb:
      "Stil personal, expresie artistică și primele competiții. Vârsta la care dansul devine pasiune serioasă.",
  },
  {
    key: "teens",
    value: "Teens",
    name: "Teens",
    age: "15 – 19 ani",
    ageShort: "15–19 ani",
    blurb:
      "Performanță, spectacole Quasar și concursuri naționale, într-o comunitate strânsă.",
  },
] as const;

export const LOCATIONS = [
  {
    key: "stefan",
    /** Valoare trimisă ca `locatia` — alias recunoscut de QApp (`mapLocatie`). */
    value: "Ștefan cel Mare",
    name: "Ștefan cel Mare",
    address: "Bd. Ștefan cel Mare și Sfânt nr. 10, et. 1",
    addressExtra: "Galerii Comerciale, Iași",
    /** Reper pentru cineva care vine prima dată — adresa singură nu e suficientă. */
    access: "În Galeriile Comerciale, la etajul 1. Intrarea e din bulevard, urci o scară.",
    phone: "0730 534 172",
    phoneTel: "+40730534172",
    styles: ["Street Dance", "KPOP Dance"],
    maps: "https://www.google.com/maps/search/?api=1&query=Quasar+Dance+Stefan+cel+Mare+Iasi",
  },
  {
    key: "nicolina",
    value: "Nicolina",
    name: "Nicolina",
    address: "Strada Izvor 14",
    addressExtra: "Iași",
    access: "Stradă laterală din cartierul Nicolina, cu loc de parcare în fața sălii.",
    phone: "0770 227 580",
    phoneTel: "+40770227580",
    styles: ["Street Dance", "KPOP Dance", "Gimnastică acrobatică"],
    maps: "https://www.google.com/maps/search/?api=1&query=Quasar+Dance+Nicolina+Strada+Izvor+14+Iasi",
  },
] as const;

/**
 * Orarul orelor demonstrative.
 *
 * `SCHEDULE` e indexat pe cheia locației, apoi pe cheia zilei din `CAMPAIGN_DAYS`.
 * O locație care lipsește de aici — sau care n-are nicio oră — primește automat cardul
 * „În curând" pe landing page, fără nicio modificare în JSX. O zi fără ore rămâne o
 * casetă goală în grilă, ca zilele să stea aliniate între cele două locații.
 */
export type ScheduleSlot = {
  time: string;
  /** Grupa, exact ca `name` din AGE_GROUPS — de acolo se ia intervalul de vârstă afișat. */
  group: string | null;
  /** Stilul, exact ca `name` din STYLES. */
  style: string;
  instructor: string;
};

/** Zilele campaniei, în ordine. Orarul fiecărei locații se raportează la ele. */
export const CAMPAIGN_DAYS = [
  { key: "lun", weekday: "Luni", day: 7 },
  { key: "mar", weekday: "Marți", day: 8 },
  { key: "mie", weekday: "Miercuri", day: 9 },
  { key: "joi", weekday: "Joi", day: 10 },
  { key: "vin", weekday: "Vineri", day: 11 },
] as const;

export const SCHEDULE: Record<string, Record<string, ScheduleSlot[]>> = {
  stefan: {
    lun: [
      { time: "17:00", group: "Junior", style: "Street Dance", instructor: "Eva" },
      { time: "18:30", group: "Teens", style: "Street Dance", instructor: "Eva" },
    ],
    mar: [
      { time: "16:30", group: "Tiny", style: "Street Dance", instructor: "Ioana" },
      { time: "18:00", group: "Junior", style: "Street Dance", instructor: "Ioana" },
    ],
    mie: [
      { time: "17:00", group: null, style: "KPOP Dance", instructor: "Laura" },
      { time: "18:30", group: "Varsity", style: "Street Dance", instructor: "Bianca" },
    ],
    joi: [
      { time: "17:00", group: "Varsity", style: "Street Dance", instructor: "Adrian" },
      { time: "18:30", group: "Teens", style: "Street Dance", instructor: "Adrian" },
    ],
    vin: [{ time: "17:00", group: null, style: "KPOP Dance", instructor: "Giulia" }],
  },
  nicolina: {
    mie: [
      { time: "17:30", group: "Junior", style: "Gimnastică acrobatică", instructor: "Alin" },
      { time: "18:30", group: "Varsity", style: "Gimnastică acrobatică", instructor: "Alin" },
      { time: "19:30", group: "Teens", style: "Street Dance", instructor: "Alin" },
    ],
    joi: [
      { time: "17:30", group: "Junior", style: "Street Dance", instructor: "Ana" },
      { time: "18:30", group: "Tiny", style: "Street Dance", instructor: "Ana" },
      { time: "19:30", group: null, style: "KPOP Dance", instructor: "Ana" },
    ],
    vin: [{ time: "18:30", group: "Varsity", style: "Street Dance", instructor: "Mara" }],
  },
};

/**
 * Nota publică de pe Google, folosită ca dovadă externă — părinții care verifică
 * o caută oricum. Se actualizează manual; verifică valoarea înainte de publicare.
 */
export const GOOGLE_RATING = {
  score: "4,8",
  url: "https://www.google.com/maps/search/?api=1&query=Quasar+Dance+Iasi",
} as const;

/** Profilurile pe care le verifică lumea înainte să vină prima dată. */
export const SOCIAL_LINKS = [
  { label: "Instagram", url: "https://www.instagram.com/quasar_dance/" },
  { label: "TikTok", url: "https://www.tiktok.com/@quasar.dance" },
  { label: "Facebook", url: "https://www.facebook.com/quasardanceIasi" },
] as const;

/** Etichetă doar pentru interfață. Către QApp se trimite `null` — nu e o locație reală. */
export const ANY_LOCATION_VALUE = "Orice locație";

export const STYLES = [
  {
    key: "street",
    /** Valoare trimisă ca `interes` — identică cu enum-ul formularului de pe site. */
    value: "Street Dance",
    name: "Street Dance",
    blurb:
      "Hip-Hop, Dancehall, House, Waacking, Popping. Dansul urban autentic — stilul cu care Quasar a început, în 1981.",
    ages: "4 – 19 ani",
    onlyAt: null,
  },
  {
    key: "kpop",
    value: "KPOP Dance",
    name: "KPOP Dance",
    blurb:
      "Coregrafii K-pop actuale, energie maximă și o comunitate în care adolescenții se regăsesc imediat.",
    ages: "7 – 19 ani",
    onlyAt: null,
  },
  {
    key: "gimnastica",
    value: "Gimnastică acrobatică",
    name: "Gimnastică acrobatică",
    blurb:
      "Stând în mâini, roata, salturi și flick-uri, învățate în siguranță, cu antrenori licențiați FEFS.",
    ages: "7 – 19 ani",
    onlyAt: "nicolina",
  },
] as const;

export const UNSURE_STYLE_VALUE = "Nu știu încă";

/** Separatorul folosit când cineva bifează mai multe stiluri (câmpul `interes` e un singur text). */
export const INTEREST_SEPARATOR = ", ";

/**
 * Instructorii care predau grupelor din campanie.
 *
 * Portretele sunt cele de pe quasardance.ro, decupate pe cap și bust: originalele sunt
 * cadre întregi, în care la 120px pe ecran nu se distinge nicio figură. Fișierele stau
 * în `public/instructori/` (480×480, ~15 KB fiecare). Când vin fotografii noi, se
 * înlocuiesc fișierele păstrând numele.
 */
export const INSTRUCTORS = [
  {
    key: "bianca",
    name: "Bianca",
    role: "Instructor adolescenți",
    photo: "/instructori/bianca.jpg",
  },
  {
    key: "ioana",
    name: "Ioana",
    role: "Street Dance · grupele de copii",
    photo: "/instructori/ioana.jpg",
  },
  {
    key: "andrei",
    name: "Andrei",
    role: "Grupele Tiny & Junior",
    photo: "/instructori/andrei.jpg",
  },
  {
    key: "alin",
    name: "Alin",
    role: "Gimnastică acrobatică · Nicolina",
    photo: "/instructori/alin.jpg",
  },
  {
    key: "eva",
    name: "Eva",
    role: "Dancehall · Tutting",
    photo: "/instructori/eva.jpg",
  },
] as const;

/** Normalizează un număr de telefon românesc la formatul +407XXXXXXXX. Întoarce null dacă e invalid. */
export function normalizeRoMobile(raw: string): string | null {
  let digits = raw.replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (digits.startsWith("0040")) digits = digits.slice(4);
  else if (digits.startsWith("40")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  return /^7\d{8}$/.test(digits) ? `+40${digits}` : null;
}

export type Utm = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
};

/**
 * Citește UTM-urile din URL, le ține în sessionStorage (ca să supraviețuiască unui refresh)
 * și pune valori implicite, ca orice lead venit din LP să fie identificabil în QApp.
 */
export function resolveUtm(): Utm {
  const fallback: Utm = {
    utm_source: "direct",
    utm_medium: "(none)",
    utm_campaign: CAMPAIGN_ID,
  };
  if (typeof window === "undefined") return fallback;

  const params = new URLSearchParams(window.location.search);
  const fromUrl = {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
  };

  if (fromUrl.utm_source || fromUrl.utm_medium || fromUrl.utm_campaign) {
    const resolved: Utm = {
      utm_source: fromUrl.utm_source || fallback.utm_source,
      utm_medium: fromUrl.utm_medium || fallback.utm_medium,
      utm_campaign: fromUrl.utm_campaign || fallback.utm_campaign,
    };
    try {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(resolved));
    } catch {
      /* sessionStorage blocat — mergem mai departe cu ce am citit din URL */
    }
    return resolved;
  }

  try {
    const stored = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) return { ...fallback, ...(JSON.parse(stored) as Partial<Utm>) };
  } catch {
    /* ignorăm */
  }
  return fallback;
}
