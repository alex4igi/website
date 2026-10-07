/**
 * Configurația campaniei „Quasar Dance vine în Valea Lupului" (deschidere noiembrie 2026,
 * la Școala Verde). Formularul e o PREÎNSCRIERE: strângem ce activități, vârste și ore
 * le-ar conveni familiilor, ca să construim programul și să cerem sala. Nu promitem loc,
 * grupă sau oră.
 *
 * În QApp fiecare participant devine un rând în `preinscrieri_campanie` (pagina
 * /preinscrieri) — regulile în qapp v2/docs/reguli-domeniu.md §11.
 */

export const CAMPAIGN_ID = "valea_lupului_deschidere";

/** Numele campaniei în QApp (`campanii_promovare`). Identic cu linia din `ALLOWED_CAMPAIGNS`. */
export const QAPP_CAMPAIGN = "Valea Lupului 2026";

/**
 * Cursurile se țin la Școala Verde; parteneriatul e cu Școala „Profesor Mihai Dumitriu"
 * (Alex, 30.09.2026). Acolo se face promovarea, deci formularul întreabă de ea.
 */
export const SCOALA_PARTENERA = "Școala „Profesor Mihai Dumitriu”";

/** Locația trimisă în preînscriere — alias recunoscut de QApp. */
export const QAPP_LOCATIE = "Valea Lupului";

/**
 * Versiunea textelor de informare și acord de sub formular. Se schimbă de fiecare dată
 * când se schimbă textul, ca în QApp să se știe ce a acceptat fiecare familie.
 */
export const ACORD_VERSIUNE = "vl-2026-09-29";

export const LP_PATH = "/valea-lupului";
export const THANK_YOU_PATH = "/valea-lupului/multumim";
export const SITE_URL = "https://www.quasardance.ro";
export const LEAD_ENDPOINT = "/api/inscriere";

export const LEAD_FLAG_KEY = "qd_vl_lead";
export const UTM_STORAGE_KEY = "qd_vl_utm";

// Locația nouă n-are încă telefon propriu: întrebările merg la numărul principal.
export const PHONE_MAIN = "0730 534 172";
export const PHONE_MAIN_TEL = "+40730534172";
export const WHATSAPP_NUMBER = "40730534172";

/**
 * Valorile trimise în `stiluri` — vocabularul închis din QApp (`cursuri.stil`).
 * Deocamdată doar pentru copii: dans, gimnastică, K-pop (Zumba scoasă, Alex 30.09.2026).
 */
export const ACTIVITATI = [
  {
    value: "Street Dance",
    name: "Dans",
    detail: "Street Dance · Hip-Hop",
    blurb: "Ritm, coordonare și primele coregrafii învățate în grup. Stilul cu care Quasar a început, în 1981.",
  },
  {
    value: "Gimnastica",
    name: "Gimnastică",
    detail: "acrobatică",
    blurb: "Roata, stând în mâini și primele elemente acrobatice, învățate pas cu pas, în siguranță.",
  },
  {
    value: "K-Pop",
    name: "K-pop",
    detail: "coregrafii K-pop",
    blurb: "Coregrafiile trupelor preferate, energie multă și o gașcă în care copiii se regăsesc imediat.",
  },
] as const;

/**
 * Prețuri ORIENTATIVE (Alex, 07.10.2026): orarul nu e stabilit, deci arătăm ambele frecvențe.
 * Fixate aici, nu citite din /program-si-preturi: o schimbare de preț la studiourile existente
 * nu se mută automat și pe locația nouă.
 */
export const PRETURI_ORIENTATIVE = [
  { frecventa: "1× / săptămână", detaliu: "o ședință pe săptămână", lei: 180 },
  { frecventa: "2× / săptămână", detaliu: "două ședințe pe săptămână", lei: 270 },
] as const;

export const PRETURI_ANCHOR = "preturi";

/**
 * Până atunci strângem preînscrieri (sondaj); în vacanța de toamnă sunăm familiile ca să stabilim
 * orarul și ședințele demonstrative gratuite (Alex, 07.10.2026).
 */
export const PERIOADA_CONTACT = "26–30 octombrie";

/**
 * Când ar putea veni: după școală în timpul săptămânii, dimineața în weekend (Alex, 30.09.2026).
 * Cheile (`Lu 13-15`, `Sa 10-12`…) trebuie să fie identice cu lista din QApp
 * (CHECK-ul din `preinscrieri_campanie` și `_shared/preinscriere.ts`).
 */
export const GRILE = [
  {
    titlu: "Luni – Vineri",
    zile: [
      { key: "Lu", name: "Luni" },
      { key: "Ma", name: "Marți" },
      { key: "Mi", name: "Miercuri" },
      { key: "Jo", name: "Joi" },
      { key: "Vi", name: "Vineri" },
    ],
    intervale: [
      { key: "13-15", name: "13–15" },
      { key: "15-17", name: "15–17" },
      { key: "17-19", name: "17–19" },
    ],
  },
  {
    titlu: "Weekend",
    zile: [
      { key: "Sa", name: "Sâmbătă" },
      { key: "Du", name: "Duminică" },
    ],
    intervale: [
      { key: "10-12", name: "10–12" },
      { key: "12-14", name: "12–14" },
    ],
  },
] as const;

/** Vârstele din formular pentru copii. Grupa (Tiny/Junior/…) o derivă QApp. */
export const VARSTE_COPII = Array.from({ length: 15 }, (_, i) => i + 4);

export const SOCIAL_LINKS = [
  { label: "Instagram", url: "https://www.instagram.com/quasar_dance/" },
  { label: "TikTok", url: "https://www.tiktok.com/@quasar.dance" },
  { label: "Facebook", url: "https://www.facebook.com/quasardanceIasi" },
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
  /** Lotul de flyere / varianta de reclamă. Vine din QR (`/vl/<lot>`) sau din reclamă. */
  utm_content: string | null;
};

/** Citește UTM-urile din URL și le ține în sessionStorage, ca să supraviețuiască unui refresh. */
export function resolveUtm(): Utm {
  const fallback: Utm = {
    utm_source: "direct",
    utm_medium: "(none)",
    utm_campaign: CAMPAIGN_ID,
    utm_content: null,
  };
  if (typeof window === "undefined") return fallback;

  const params = new URLSearchParams(window.location.search);
  const fromUrl = {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
  };

  if (fromUrl.utm_source || fromUrl.utm_medium || fromUrl.utm_campaign || fromUrl.utm_content) {
    const resolved: Utm = {
      utm_source: fromUrl.utm_source || fallback.utm_source,
      utm_medium: fromUrl.utm_medium || fallback.utm_medium,
      utm_campaign: fromUrl.utm_campaign || fallback.utm_campaign,
      utm_content: fromUrl.utm_content || null,
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
