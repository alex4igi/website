"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle, Phone } from "lucide-react";

import { GOOGLE_ADS_CONVERSION } from "@/lib/track";
import { CAMPAIGN_ID, LEAD_FLAG_KEY, LP_PATH, PHONE_MAIN, PHONE_MAIN_TEL, SITE_URL } from "../campaign";

const display = {
  fontFamily: 'var(--font-display, "Sora", ui-sans-serif, system-ui, sans-serif)',
};

const SHARE_URL = `${SITE_URL}${LP_PATH}?utm_source=whatsapp&utm_medium=share&utm_campaign=${CAMPAIGN_ID}`;
const SHARE_TEXT = `Quasar Dance deschide cursuri de dans, gimnastică, K-pop și Zumba în Valea Lupului, la Școala Verde (în parteneriat cu Școala „Profesor Mihai Dumitriu”), din noiembrie. Programul îl fac după preferințele familiilor — completează și voi: ${SHARE_URL}`;
const WHATSAPP_SHARE = `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT)}`;

type LeadFlag = {
  fired?: boolean;
  event_id?: string;
  participanti?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string | null;
};

type Trackers = {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

export default function ThankYou() {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    // Conversia se numără o singură dată și doar după un formular trimis efectiv.
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
    setConfirmed(true);
    if (lead.fired) return;

    const w = window as unknown as Trackers;
    const payload = {
      campaign: CAMPAIGN_ID,
      participanti: lead.participanti ?? 1,
      utm_source: lead.utm_source ?? null,
      utm_medium: lead.utm_medium ?? null,
      utm_campaign: lead.utm_campaign ?? CAMPAIGN_ID,
      utm_content: lead.utm_content ?? null,
    };
    w.gtag?.("event", "generate_lead", payload);
    if (GOOGLE_ADS_CONVERSION) w.gtag?.("event", "conversion", { send_to: GOOGLE_ADS_CONVERSION });
    if (lead.event_id) w.fbq?.("track", "Lead", { content_name: CAMPAIGN_ID }, { eventID: lead.event_id });
    else w.fbq?.("track", "Lead", { content_name: CAMPAIGN_ID });
    w.dataLayer?.push({ event: "valea_lupului_lead", ...payload });
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
          Mulțumim! Am primit <span className="text-[#f8ef21]">preînscrierea.</span>
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-white/70">
          {confirmed
            ? "Am primit cererea pentru Valea Lupului. Te contactăm pentru detalii și îți comunicăm programul când este confirmat."
            : "Dacă ai completat formularul, te contactăm când programul este confirmat. Dacă ai ajuns aici din greșeală, întoarce-te la pagina Valea Lupului."}
        </p>

        <ol className="mt-10 flex flex-col gap-4">
          {[
            { n: "01", text: "Adunăm preferințele familiilor și stabilim grupele și orarul noii locații." },
            { n: "02", text: `Te sunăm de la ${PHONE_MAIN} ca să verificăm împreună că programul vi se potrivește.` },
            { n: "03", text: "Vă invităm la prima oră, gratuit. Abia după ea hotărâți dacă rămâneți." },
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
          <h2 className="text-xl font-extrabold text-white" style={display}>
            Mai știi familii din zonă?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Cu cât răspund mai mulți părinți, cu atât găsim mai ușor grupe la orele potrivite.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href={WHATSAPP_SHARE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f8ef21] px-6 py-3 text-sm font-bold text-[#231f20]"
              style={display}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Trimite pe WhatsApp
            </a>
            <a
              href={`tel:${PHONE_MAIN_TEL}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white"
              style={display}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {PHONE_MAIN}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
