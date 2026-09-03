"use client";

import { useEffect, useState } from "react";
import { CalendarPlus, CheckCircle2, MessageCircle, Phone, Share2 } from "lucide-react";

import {
  CAMPAIGN_ID,
  GOOGLE_ADS_CONVERSION,
  LEAD_FLAG_KEY,
  LP_PATH,
  PHONE_MAIN,
  PHONE_MAIN_TEL,
  SITE_URL,
} from "../campaign";

const display = {
  fontFamily: 'var(--font-display, "Sora", ui-sans-serif, system-ui, sans-serif)',
};

const SHARE_URL = `${SITE_URL}${LP_PATH}?utm_source=whatsapp&utm_medium=share&utm_campaign=${CAMPAIGN_ID}`;
const SHARE_TEXT = `Quasar Dance organizează Săptămâna Porților Deschise: cursuri de dans gratuite pentru copii, 7–11 septembrie, la Ștefan cel Mare și Nicolina. Ne-am înscris deja — poate vă interesează și pe voi: ${SHARE_URL}`;
const WHATSAPP_SHARE = `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT)}`;

/**
 * Evenimentul din calendar acoperă toată săptămâna, nu o oră anume: ziua și ora exactă
 * se stabilesc la telefon. Rostul lui e să nu uite nimeni săptămâna — neprezentarea e
 * pierderea reală într-o campanie de porți deschise, nu lipsa înscrierilor.
 */
const EVENT = {
  title: "Ora demonstrativă gratuită — Quasar Dance",
  // Formatul de dată all-day din iCalendar; ziua de final e exclusivă, deci 12 include 11 septembrie.
  start: "20260907",
  end: "20260912",
  details: `Săptămâna Porților Deschise la Quasar Dance. Te sunăm de la ${PHONE_MAIN} ca să-ți confirmăm ziua și ora exactă a grupei.\n\nDe luat: haine lejere, adidași de schimb, o sticlă de apă.\n\nDetalii: ${SITE_URL}${LP_PATH}`,
  location: "Quasar Dance Iași — Ștefan cel Mare sau Nicolina",
};

const GOOGLE_CALENDAR_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(EVENT.title)}` +
  `&dates=${EVENT.start}/${EVENT.end}` +
  `&details=${encodeURIComponent(EVENT.details)}` +
  `&location=${encodeURIComponent(EVENT.location)}`;

/** Textele din iCalendar cer escaparea acestor caractere, altfel fișierul se strică. */
function icsEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function buildIcs() {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  // RFC 5545 cere terminatori de linie CRLF.
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Quasar Dance//Back to Dance School//RO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${CAMPAIGN_ID}-${stamp}@quasardance.ro`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${EVENT.start}`,
    `DTEND;VALUE=DATE:${EVENT.end}`,
    `SUMMARY:${icsEscape(EVENT.title)}`,
    `DESCRIPTION:${icsEscape(EVENT.details)}`,
    `LOCATION:${icsEscape(EVENT.location)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape("Mâine începe Săptămâna Porților Deschise la Quasar Dance")}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

type LeadFlag = {
  ts?: number;
  /** Marcat după ce evenimentele s-au trimis, ca un refresh să nu numere conversia a doua oară. */
  fired?: boolean;
  /** ID-ul trimis și serverului; Meta deduplică Lead-ul din browser cu cel din CAPI după el. */
  event_id?: string;
  grupa_varsta?: string;
  locatia?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export default function ThankYou() {
  const [confirmed, setConfirmed] = useState(false);

  /** Fișierul se creează la click, nu la randare, ca să nu ținem un blob deschis degeaba. */
  function downloadIcs() {
    const blob = new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quasar-porti-deschise.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    // Conversia se numără o singură dată și doar dacă utilizatorul chiar a trimis formularul.
    // O vizită directă pe pagina asta nu declanșează nimic, altfel raportările s-ar umfla.
    let lead: LeadFlag | null = null;
    try {
      const raw = window.sessionStorage.getItem(LEAD_FLAG_KEY);
      if (raw) {
        lead = JSON.parse(raw) as LeadFlag;
        window.sessionStorage.setItem(LEAD_FLAG_KEY, JSON.stringify({ ...lead, fired: true }));
      }
    } catch {
      /* sessionStorage blocat */
    }
    if (!lead) return;
    // Un refresh păstrează mesajul de confirmare, dar nu retrimite evenimentele.
    setConfirmed(true);
    if (lead.fired) return;

    const payload = {
      campaign: CAMPAIGN_ID,
      grupa_varsta: lead.grupa_varsta ?? null,
      locatia: lead.locatia ?? null,
      utm_source: lead.utm_source ?? null,
      utm_medium: lead.utm_medium ?? null,
      utm_campaign: lead.utm_campaign ?? CAMPAIGN_ID,
    };

    window.gtag?.("event", "generate_lead", payload);
    if (GOOGLE_ADS_CONVERSION) {
      window.gtag?.("event", "conversion", { send_to: GOOGLE_ADS_CONVERSION });
    }
    if (lead.event_id) window.fbq?.("track", "Lead", { content_name: CAMPAIGN_ID }, { eventID: lead.event_id });
    else window.fbq?.("track", "Lead", { content_name: CAMPAIGN_ID });
    window.dataLayer?.push({ event: "btds_lead", ...payload });
  }, []);

  return (
    <main
      className="flex min-h-screen flex-col bg-[#231f20] px-5 py-14 md:px-8"
      style={{ fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)" }}
    >
      <div className="mx-auto w-full max-w-2xl">
        <a href="https://www.quasardance.ro" className="inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-q-a-l-1-1-5mBGGYfcxPgI3jR7NJvjH9WHuLVG7l.png"
            alt="Quasar Dance"
            width={120}
            height={32}
            className="h-8 w-auto"
          />
        </a>

        <div className="mt-12 flex h-16 w-16 items-center justify-center rounded-full bg-[#f8ef21]" aria-hidden="true">
          <CheckCircle2 className="h-9 w-9 text-[#231f20]" strokeWidth={2.2} />
        </div>

        <h1 className="mt-8 text-4xl leading-tight font-extrabold text-balance text-white md:text-6xl" style={display}>
          Gata! Locul e <span className="text-[#f8ef21]">rezervat.</span>
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-white/70">
          {confirmed
            ? "Ți-am primit înscrierea la Săptămâna Porților Deschise. Te sunăm în cel mult 24 de ore ca să-ți confirmăm grupa și ora la care vă așteptăm în sală."
            : "Dacă ai completat formularul, te sunăm în cel mult 24 de ore ca să-ți confirmăm grupa și ora. Dacă ai ajuns aici din greșeală, întoarce-te la pagina campaniei ca să te înscrii."}
        </p>

        <ol className="mt-10 flex flex-col gap-4">
          {[
            { n: "01", text: `Te sunăm de la ${PHONE_MAIN} — salvează numărul, ca să știi cine te caută.` },
            { n: "02", text: "Îți confirmăm grupa de vârstă, locația și ziua în care are loc ora ei demonstrativă." },
            { n: "03", text: "Vii cu copilul între 7 și 11 septembrie. Haine lejere, adidași de schimb, o sticlă de apă." },
          ].map((step) => (
            <li key={step.n} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
              <span className="text-sm font-black text-[#f8ef21]" style={display} aria-hidden="true">
                {step.n}
              </span>
              <p className="text-sm leading-relaxed text-white/75">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-7">
          <div className="flex items-center gap-3">
            <CalendarPlus className="h-5 w-5 flex-shrink-0 text-[#f8ef21]" aria-hidden="true" />
            <h2 className="text-xl font-extrabold text-white" style={display}>
              Pune-ți săptămâna în calendar.
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            Îți notăm 7–11 septembrie ca zile libere de dans. Ziua și ora grupei ți le confirmăm la telefon, apoi
            ajustezi evenimentul. Primești o notificare cu o zi înainte.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={GOOGLE_CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#f8ef21] px-6 py-3.5 text-sm font-bold text-[#231f20] transition-colors hover:bg-white"
              style={display}
            >
              <CalendarPlus className="h-4 w-4" aria-hidden="true" />
              Google Calendar
            </a>
            <button
              type="button"
              onClick={downloadIcs}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:border-[#f8ef21] hover:text-[#f8ef21]"
              style={display}
            >
              Apple Calendar
            </button>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-[#f8ef21] p-7">
          <div className="flex items-center gap-3">
            <Share2 className="h-5 w-5 flex-shrink-0 text-[#231f20]" aria-hidden="true" />
            <h2 className="text-xl font-extrabold text-[#231f20]" style={display}>
              Cunoști un părinte căruia i-ar prinde bine?
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#231f20]/75">
            Trimite-i linkul campaniei. Orele demonstrative sunt gratuite pentru oricine, iar copiii vin oricum mai
            curajoși la sală când au un prieten alături.
          </p>
          <a
            href={WHATSAPP_SHARE}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#231f20] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#231f20]"
            style={display}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Trimite pe WhatsApp
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={`tel:${PHONE_MAIN_TEL}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:border-[#f8ef21] hover:text-[#f8ef21]"
            style={display}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {PHONE_MAIN}
          </a>
          <a
            href={LP_PATH}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white/60 transition-colors hover:text-[#f8ef21]"
            style={display}
          >
            Înapoi la campanie
          </a>
        </div>

        <p className="mt-12 text-xs leading-relaxed text-white/35">
          QUASAR DANCE STUDIO S.R.L. · CUI RO49361270 · Iași · Ștefan cel Mare și Nicolina
        </p>
      </div>
    </main>
  );
}
