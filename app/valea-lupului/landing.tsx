"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { newEventId } from "@/lib/track";
import { loadConsent } from "@/lib/consent";
import { gclidForLead } from "@/lib/attribution";
import { TurnstileWidget, turnstileActivClient, type TurnstileHandle } from "@/components/TurnstileWidget";
import { ArrowRight, Check, ChevronDown, Eye, Loader2, MapPin, MessageCircle, Phone, Plus, X } from "lucide-react";
import type { StarePreinscriere } from "@/lib/preinscrieri";
import { marcheazaInscriere } from "@/lib/campanii-vizite";

import {
  ACORD_VERSIUNE,
  ACTIVITATI,
  GRILE,
  LEAD_ENDPOINT,
  LEAD_FLAG_KEY,
  PHONE_MAIN,
  PERIOADA_CONTACT,
  PHONE_MAIN_TEL,
  PRETURI_ANCHOR,
  PRETURI_ORIENTATIVE,
  QAPP_CAMPAIGN,
  QAPP_LOCATIE,
  SCOALA_PARTENERA,
  SOCIAL_LINKS,
  THANK_YOU_PATH,
  VARSTE_COPII,
  WHATSAPP_NUMBER,
  normalizeRoMobile,
  resolveUtm,
} from "./campaign";
import { WA_TEXT_STANDARD } from "@/lib/whatsapp";

const display = {
  fontFamily: 'var(--font-display, "Sora", ui-sans-serif, system-ui, sans-serif)',
};

// Textul standard; cine vine din QR-ul flyerului primește altul, pus la click de SiteTracking.
const WHATSAPP_ASK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WA_TEXT_STANDARD)}`;

const MAX_PARTICIPANTI = 5;

type Participant = {
  nume: string;
  varsta: string;
  /** null = nu a răspuns (întrebarea e opțională). */
  elev: boolean | null;
  stiluri: string[];
  grila: string[];
};

const copilNou = (): Participant => ({ nume: "", varsta: "", elev: null, stiluri: [], grila: [] });

type FormState = {
  name: string;
  phone: string;
  email: string;
  participanti: Participant[];
  observatii: string;
  marketingOptIn: boolean;
  company: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  participanti: [copilNou()],
  observatii: "",
  marketingOptIn: false,
  company: "",
};

const inputClass =
  "rounded-xl border border-[#e5e5e5] bg-[#f5f5f5] px-4 py-3.5 text-base text-[#231f20] outline-none transition-colors focus:border-[#231f20] focus:bg-white";

export default function ValeaLupuluiLanding({ stare }: { stare: StarePreinscriere }) {
  // Campania o pornește Alex din qapp. Până atunci pagina arată „în curând"; cu
  // `?previzualizare` în link se vede toată, dar intake-ul refuză orice trimitere.
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    setPreview(new URLSearchParams(window.location.search).has("previzualizare"));
  }, []);
  const deschis = stare === "activa";
  const arataFormular = deschis || preview;
  const router = useRouter();
  const formRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  // Un formular = o trimitere. Același id la reîncercare => QApp nu dublează nimic.
  const [trimitereId] = useState(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : "",
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileEroare, setTurnstileEroare] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const target = formRef.current;
    if (!target) return;
    const onScroll = () => {
      const formTop = target.getBoundingClientRect().top;
      setShowStickyCta(window.scrollY > 420 && formTop > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const update = (patch: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setError(null);
  };

  const updateP = (index: number, patch: Partial<Participant>) => {
    setForm((prev) => ({
      ...prev,
      participanti: prev.participanti.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    }));
    setError(null);
  };

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const scrollToForm = (stil?: string) => {
    if (stil) {
      setForm((prev) => {
        const [first, ...rest] = prev.participanti;
        return first.stiluri.includes(stil)
          ? prev
          : { ...prev, participanti: [{ ...first, stiluri: [...first.stiluri, stil] }, ...rest] };
      });
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    formRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    if (!stil) window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), reduce ? 0 : 600);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (form.company) {
      marcheazaInscriere("valea_lupului");
      router.push(THANK_YOU_PATH);
      return;
    }
    if (form.name.trim().length < 3) {
      setError("Scrie numele tău complet, ca să știm cu cine vorbim.");
      return;
    }
    const phone = normalizeRoMobile(form.phone);
    if (!phone) {
      setError("Număr de telefon invalid. Folosește un mobil românesc (ex: 07XXXXXXXX).");
      return;
    }
    for (const [i, p] of form.participanti.entries()) {
      const cine = form.participanti.length > 1 ? ` (${i + 1})` : "";
      if (p.nume.trim().length < 2) {
        setError(`Scrie numele copilului${cine}.`);
        return;
      }
      if (!p.varsta) {
        setError(`Alege vârsta copilului${cine}, ca să știm în ce grupă s-ar potrivi.`);
        return;
      }
      if (!p.stiluri.length) {
        setError(`Alege cel puțin o activitate pentru ${p.nume.trim() || `copilul${cine}`}.`);
        return;
      }
      if (!p.grila.length) {
        setError(`Bifează cel puțin un interval în care ${p.nume.trim() || "copilul"} ar putea veni.`);
        return;
      }
    }
    if (!trimitereId) {
      setError("Browserul tău nu poate trimite formularul. Sună-ne la 0730 534 172.");
      return;
    }

    setSending(true);
    const utm = resolveUtm();
    try {
      const eventId = newEventId();
      const response = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          marketing_consent: loadConsent()?.categories.marketing ?? false,
          turnstile_token: turnstileToken,
          nume: form.name.trim(),
          telefon: phone,
          email: form.email.trim() || null,
          locatia: QAPP_LOCATIE,
          campanie: QAPP_CAMPAIGN,
          ...utm,
          gclid: gclidForLead(),
          company: form.company,
          preinscriere: {
            trimitere_id: trimitereId,
            locatie: QAPP_LOCATIE,
            acord_marketing: form.marketingOptIn,
            acord_text_versiune: ACORD_VERSIUNE,
            observatii: form.observatii.trim() || null,
            participanti: form.participanti.map((p) => ({
              participant: "copil",
              nume: p.nume.trim(),
              varsta: p.varsta ? Number(p.varsta) : null,
              elev_scoala_partenera: p.elev,
              stiluri: p.stiluri,
              disponibilitate: p.grila,
            })),
          },
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(
          response.status === 429
            ? "Prea multe încercări. Reîncearcă peste un minut sau sună-ne la 0730 534 172."
            : data?.error || "A apărut o eroare. Te rugăm să încerci din nou.",
        );
        turnstileRef.current?.reset();
        setSending(false);
        return;
      }
      try {
        window.sessionStorage.setItem(
          LEAD_FLAG_KEY,
          JSON.stringify({ ts: Date.now(), event_id: eventId, participanti: form.participanti.length, ...utm }),
        );
      } catch {
        /* sessionStorage blocat — cererea e trimisă, doar evenimentul de conversie se pierde */
      }
      marcheazaInscriere("valea_lupului");
      router.push(THANK_YOU_PATH);
    } catch {
      setError("Nu am putut trimite cererea. Verifică conexiunea și încearcă din nou.");
      turnstileRef.current?.reset();
      setSending(false);
    }
  }

  return (
    <main className="bg-white" style={{ fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)' }}>
      <style>{`
        @keyframes qdUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
        .qd-up { animation: qdUp .7s cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) { .qd-up { animation: none; } }
        .qd-hero-text { text-shadow: 0 1px 16px rgba(35,31,32,.9), 0 1px 4px rgba(35,31,32,.75); }
        .qd-faq[open] .qd-faq-icon { transform: rotate(180deg); }
      `}</style>

      {preview && !deschis ? (
        <div className="flex items-center justify-center gap-2 bg-[#f8ef21] px-4 py-2 text-center text-xs font-bold text-[#231f20]" style={display}>
          <Eye className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          Previzualizare — campania nu e pornită din qapp{stare === "inchisa" ? " (e închisă)" : ""}. Formularul nu salvează nimic.
        </div>
      ) : null}

      <header className="bg-[#231f20]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <a href="https://www.quasardance.ro" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-q-a-l-1-1-5mBGGYfcxPgI3jR7NJvjH9WHuLVG7l.png"
              alt="Quasar Dance"
              width={132}
              height={36}
              className="h-8 w-auto md:h-9"
            />
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`#${PRETURI_ANCHOR}`}
              className="rounded-full px-3 py-2 text-sm font-bold text-white transition-colors hover:text-[#f8ef21]"
              style={display}
            >
              Prețuri
            </a>
            <a
              href={`tel:${PHONE_MAIN_TEL}`}
              className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#f8ef21] hover:text-[#231f20]"
              style={display}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{PHONE_MAIN}</span>
              <span className="sm:hidden">Sună</span>
            </a>
          </div>
        </div>
      </header>

      {/* ————— Hero ————— */}
      <section className="relative overflow-hidden bg-[#231f20] px-5 pt-12 pb-14 md:px-8 md:pt-16 md:pb-20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <picture className="contents">
            <source media="(max-width: 767px)" srcSet="/back-to-dance-school-hero-mobile.jpg" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/back-to-dance-school-hero.jpg" alt="" className="h-full w-full object-cover object-center opacity-[0.85]" />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-[#231f20]/94 via-[#231f20]/62 to-[#231f20]/45 md:bg-gradient-to-br md:from-[#231f20] md:via-[#231f20]/72 md:to-[#231f20]/32" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#231f20] to-transparent" />
        </div>
        {/* Sub 1280px coloana stângă e prea îngustă pentru cele două butoane, deci stivuim. */}
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:gap-14">
          <div className="qd-hero-text max-w-2xl">
            <div
              className="qd-up inline-flex flex-wrap items-center gap-2 rounded-full border border-[#f8ef21]/30 bg-[#f8ef21]/10 px-4 py-2 text-xs font-black tracking-[0.14em] text-[#f8ef21] uppercase"
              style={display}
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Din noiembrie · la Școala Verde
            </div>
            <h1
              className="qd-up mt-6 text-5xl leading-[1.02] font-extrabold text-balance text-white sm:text-6xl lg:text-[4.25rem]"
              style={{ ...display, animationDelay: "120ms" }}
            >
              Quasar Dance vine
              <span className="block text-[#f8ef21]">în Valea Lupului.</span>
            </h1>
            <p className="qd-up mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg" style={{ animationDelay: "240ms" }}>
              Dans, gimnastică și K-pop pentru copii — aproape de casă, după școală sau în weekend, la Școala Verde, în
              parteneriat cu {SCOALA_PARTENERA}.{" "}
              <strong className="font-semibold text-white">Spune-ne ce îți dorești și când — noi venim cu soluțiile.</strong>
            </p>
            {arataFormular ? (
              <>
              <div className="qd-up mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: "340ms" }}>
                <button
                  type="button"
                  onClick={() => scrollToForm()}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f8ef21] px-8 py-4 text-base font-bold text-[#231f20] transition-transform hover:scale-[1.02] hover:bg-white active:scale-100"
                  style={display}
                >
                  Vreau să aflu când începem
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
                <a
                  href={WHATSAPP_ASK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-base font-bold text-white transition-colors hover:border-[#f8ef21] hover:text-[#f8ef21]"
                  style={display}
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  Întreabă pe WhatsApp
                </a>
              </div>
              <p className="qd-up mt-5 text-sm text-white/65" style={{ animationDelay: "420ms" }}>
                Te sunăm în vacanța de toamnă, {PERIOADA_CONTACT}, pentru orar și ședința demonstrativă gratuită. Preînscrierea nu te
                obligă la nimic.
              </p>
              </>
            ) : (
              <div className="qd-up mt-8 max-w-xl rounded-2xl border border-[#f8ef21]/30 bg-[#231f20]/70 p-5" style={{ animationDelay: "340ms" }}>
                <p className="text-base font-bold text-[#f8ef21]" style={display}>
                  {stare === "inchisa" ? "Preînscrierile s-au încheiat." : "Preînscrierile se deschid în curând."}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  {stare === "inchisa"
                    ? "Mulțumim tuturor familiilor care ne-au răspuns. Pentru detalii despre cursuri, sună-ne sau scrie-ne pe WhatsApp."
                    : "Revino în câteva zile — sau scrie-ne pe WhatsApp și te anunțăm noi când pornim."}
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <a href={WHATSAPP_ASK} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f8ef21] px-6 py-3 text-sm font-bold text-[#231f20]" style={display}>
                    <MessageCircle className="h-4 w-4" aria-hidden="true" /> Scrie-ne pe WhatsApp
                  </a>
                  <a href={`tel:${PHONE_MAIN_TEL}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white" style={display}>
                    <Phone className="h-4 w-4" aria-hidden="true" /> {PHONE_MAIN}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Aceleași cifre ca pe Back to Dance School: pe ecrane late ocupă coloana din dreapta,
              ca hero-ul să nu rămână pe jumătate gol. */}
          <dl className="qd-up grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-2 xl:gap-4" style={{ animationDelay: "460ms" }}>
            {[
              { value: "1981", label: "anul în care am început" },
              { value: "11.000+", label: "copii au dansat la Quasar" },
              { value: "700+", label: "membri activi acum" },
              { value: "200+", label: "trofee & premii" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5 xl:p-6">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-2xl leading-none font-extrabold text-[#f8ef21] md:text-3xl xl:text-4xl" style={display}>
                    {stat.value}
                  </span>
                  <span className="mt-2 block text-xs leading-snug text-white/55">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ————— De ce Quasar ————— */}
      <section className="bg-white px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>De ce Quasar</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-extrabold text-balance text-[#231f20] md:text-5xl" style={display}>
            Mișcare aproape de casă, cu o echipă care face asta din 1981.
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Aproape de casă", text: `Cursurile se țin la Școala Verde, în Valea Lupului, în parteneriat cu ${SCOALA_PARTENERA}. Fără drumuri prin oraș după o zi de școală.` },
              { title: "Coordonare și încredere", text: "Copiii învață să se miște, să-și țină ritmul și să apară fără emoții în fața celorlalți." },
              { title: "Prieteni noi", text: "Grupe pe vârste, cu copii din zonă. Dansul se face împreună, nu în competiție unul cu altul." },
              { title: "Instructori Quasar", text: "Aceeași școală, aceleași standarde ca la Ștefan cel Mare și Nicolina, unde dansează sute de copii." },
            ].map((b) => (
              <div key={b.title} className="flex flex-col gap-3 rounded-2xl bg-[#f5f5f5] p-7">
                <div className="h-1 w-8 rounded-full bg-[#f8ef21]" aria-hidden="true" />
                <h3 className="text-xl font-extrabold text-[#231f20]" style={display}>{b.title}</h3>
                <p className="text-sm leading-relaxed text-[#6b6b6b]">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Activități ————— */}
      <section className="bg-[#f5f5f5] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Ce aducem în Valea Lupului</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-extrabold text-balance text-[#231f20] md:text-5xl" style={display}>
            Trei activități. Voi ne spuneți care.
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ACTIVITATI.map((a) => (
              <div key={a.value} className="group flex flex-col gap-4 rounded-2xl bg-white p-7 transition-colors hover:bg-[#231f20]">
                <span
                  className="self-start rounded-full bg-[#231f20] px-3 py-1 text-[11px] font-black tracking-wide text-[#f8ef21] uppercase transition-colors group-hover:bg-[#f8ef21] group-hover:text-[#231f20]"
                  style={display}
                >
                  {a.detail}
                </span>
                <h3 className="text-2xl font-extrabold text-[#231f20] transition-colors group-hover:text-white" style={display}>
                  {a.name}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-[#6b6b6b] transition-colors group-hover:text-white/70">{a.blurb}</p>
                {arataFormular ? (
                <button
                  type="button"
                  onClick={() => scrollToForm(a.value)}
                  className="inline-flex items-center gap-2 self-start text-sm font-bold text-[#231f20] transition-colors group-hover:text-[#f8ef21]"
                  style={display}
                >
                  Mă interesează
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Cum funcționează ————— */}
      <section className="bg-white px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Cum funcționează</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-extrabold text-balance text-[#231f20] md:text-5xl" style={display}>
            Programul îl facem după răspunsurile voastre.
          </h2>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { n: "01", title: "Completezi formularul", text: "Ne spui pentru cine e, ce activități v-ar interesa și în ce zile și intervale ați putea ajunge." },
              { n: "02", title: "Te sunăm în vacanță", text: `Din răspunsuri facem grupele. În vacanța de toamnă, ${PERIOADA_CONTACT}, te sunăm să stabilim împreună orarul și ședința demonstrativă gratuită.` },
              { n: "03", title: "Prima oră, gratuit", text: "Copilul vine la ședința demonstrativă gratuită. Abia apoi hotărâți dacă rămâneți." },
            ].map((step) => (
              <li key={step.n} className="relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-[#f5f5f5] p-7">
                <span
                  className="pointer-events-none absolute -top-4 -right-1 text-[86px] leading-none font-black text-[#231f20]/[0.06] select-none"
                  style={display}
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <div className="h-1 w-8 rounded-full bg-[#f8ef21]" aria-hidden="true" />
                <h3 className="relative z-10 text-xl font-extrabold text-[#231f20]" style={display}>{step.title}</h3>
                <p className="relative z-10 text-sm leading-relaxed text-[#6b6b6b]">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ————— Prețuri orientative ————— */}
      <section id={PRETURI_ANCHOR} className="scroll-mt-4 bg-[#f5f5f5] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Prețuri orientative</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-extrabold text-balance text-[#231f20] md:text-5xl" style={display}>
            Cât costă.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#6b6b6b]">
            Dacă grupele se țin o dată sau de două ori pe săptămână stabilim după preînscrieri, așa că îți arătăm ambele
            variante. Prețul final îl confirmăm odată cu orarul.
          </p>
          <div className="mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
            {PRETURI_ORIENTATIVE.map((p) => (
              <div key={p.frecventa} className="flex flex-col gap-4 rounded-2xl bg-white p-7">
                <span
                  className="self-start rounded-full bg-[#231f20] px-3 py-1 text-[11px] font-black tracking-wide text-[#f8ef21] uppercase"
                  style={display}
                >
                  {p.frecventa}
                </span>
                <p className="flex items-baseline gap-2 text-[#231f20]" style={display}>
                  <span className="text-5xl leading-none font-extrabold">{p.lei}</span>
                  <span className="text-base font-bold">lei / lună</span>
                </p>
                <p className="text-sm leading-relaxed text-[#6b6b6b]">Orientativ, pentru {p.detaliu}.</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <p className="flex items-center gap-3 text-sm font-semibold text-[#231f20]">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#f8ef21]" aria-hidden="true">
                <Check className="h-3.5 w-3.5 text-[#231f20]" strokeWidth={3} />
              </span>
              Prima oră este gratuită.
            </p>
            {arataFormular ? (
              <button
                type="button"
                onClick={() => scrollToForm()}
                className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#231f20] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#f8ef21] hover:text-[#231f20] sm:ml-auto"
                style={display}
              >
                Mă preînscriu
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* ————— Formular (doar cât campania e pornită, sau în previzualizare) ————— */}
      {arataFormular ? (
      <section id="preinscriere" ref={formRef} className="scroll-mt-4 bg-[#231f20] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:pt-4">
            <span className="inline-flex rounded-full bg-[#f8ef21]/10 px-3 py-1 text-xs font-black tracking-[0.16em] text-[#f8ef21] uppercase" style={display}>
              Preînscriere · fără obligații
            </span>
            <h2 className="mt-5 text-3xl leading-tight font-extrabold text-balance text-white md:text-5xl" style={display}>
              Spune-ne ce
              <br />
              <span className="text-[#f8ef21]">vi s-ar potrivi.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/65">
              Cu răspunsurile voastre construim programul noii locații. Orele bifate sunt preferințe, nu un orar
              publicat. În vacanța de toamnă, {PERIOADA_CONTACT}, te sunăm să stabilim împreună orarul și ședința demonstrativă
              gratuită.
            </p>
            <ul className="mt-8 flex flex-col gap-4">
              {[
                "Preînscrierea e gratuită și nu te obligă la nimic",
                "Poți înscrie mai mulți copii din aceeași familie",
                "Prima oră este GRATUITĂ",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#f8ef21]" aria-hidden="true">
                    <Check className="h-3.5 w-3.5 text-[#231f20]" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-white/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-6 rounded-2xl bg-white p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="vl-name" className="text-sm font-bold text-[#231f20]" style={display}>
                  Numele tău <span className="text-[#6b6b6b]">*</span>
                </label>
                <input id="vl-name" ref={nameRef} type="text" autoComplete="name" value={form.name}
                  onChange={(e) => update({ name: e.target.value })} placeholder="Ex: Maria Popescu" className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="vl-phone" className="text-sm font-bold text-[#231f20]" style={display}>
                  Telefon <span className="text-[#6b6b6b]">*</span>
                </label>
                <input id="vl-phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone}
                  onChange={(e) => update({ phone: e.target.value })} placeholder="07XX XXX XXX" className={inputClass} />
              </div>
            </div>

            {form.participanti.map((p, i) => (
              <fieldset key={i} className="flex flex-col gap-5 rounded-2xl border border-[#e5e5e5] p-4 md:p-5">
                <legend className="px-2 text-sm font-black tracking-wide text-[#231f20] uppercase" style={display}>
                  {form.participanti.length > 1 ? `Copilul ${i + 1}` : "Copilul"}
                </legend>
                {form.participanti.length > 1 ? (
                <div className="-mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => update({ participanti: form.participanti.filter((_, j) => j !== i) })}
                      className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#6b6b6b] hover:text-[#231f20]"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" /> Scoate
                    </button>
                </div>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`vl-p${i}-nume`} className="text-sm font-bold text-[#231f20]" style={display}>
                      Numele copilului <span className="text-[#6b6b6b]">*</span>
                    </label>
                    <input id={`vl-p${i}-nume`} type="text" value={p.nume}
                      onChange={(e) => updateP(i, { nume: e.target.value })}
                      placeholder="Ex: Ana Popescu" className={inputClass} />
                  </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor={`vl-p${i}-varsta`} className="text-sm font-bold text-[#231f20]" style={display}>
                        Vârsta <span className="text-[#6b6b6b]">*</span>
                      </label>
                      <select id={`vl-p${i}-varsta`} value={p.varsta} onChange={(e) => updateP(i, { varsta: e.target.value })}
                        className={`${inputClass} min-w-32`}>
                        <option value="">Alege</option>
                        {VARSTE_COPII.map((v) => <option key={v} value={v}>{v} ani</option>)}
                      </select>
                    </div>
                </div>

                  <PillRow label={`Învață la ${SCOALA_PARTENERA}?`} optional>
                    {[{ v: true, l: "Da" }, { v: false, l: "Nu" }].map((o) => (
                      <button key={o.l} type="button" aria-pressed={p.elev === o.v}
                        onClick={() => updateP(i, { elev: p.elev === o.v ? null : o.v })}
                        className={pill(p.elev === o.v)} style={display}>
                        {o.l}
                      </button>
                    ))}
                  </PillRow>

                  <PillRow label="Ce l-ar interesa" note="— poți alege mai multe">
                    {ACTIVITATI.map((a) => {
                      const on = p.stiluri.includes(a.value);
                      return (
                        <button key={a.value} type="button" aria-pressed={on}
                          onClick={() => updateP(i, { stiluri: toggle(p.stiluri, a.value) })}
                          className={pill(on)} style={display}>
                          {on ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : null}
                          {a.name}
                        </button>
                      );
                    })}
                  </PillRow>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-sm font-bold text-[#231f20]" style={display}>
                      Când ar putea veni <span className="text-[#6b6b6b]">*</span>
                      <span className="ml-1 font-normal text-[#6b6b6b]">— bifează toate variantele posibile</span>
                    </span>
                    {i > 0 && form.participanti[0].grila.length ? (
                      <button type="button" onClick={() => updateP(i, { grila: [...form.participanti[0].grila] })}
                        className="text-xs font-semibold text-[#231f20] underline">
                        La fel ca primul copil
                      </button>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-4">
                    {GRILE.map((g) => (
                      <table key={g.titlu} className="w-full min-w-[260px] border-separate border-spacing-1 text-sm">
                        <thead>
                          <tr>
                            <th className="w-24 pb-1 text-left text-xs font-black tracking-wide text-[#231f20] uppercase" style={display}>
                              {g.titlu}
                            </th>
                            {g.intervale.map((iv) => (
                              <th key={iv.key} className="pb-1 text-xs font-semibold text-[#6b6b6b]">{iv.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {g.zile.map((z) => (
                            <tr key={z.key}>
                              <td className="pr-2 text-xs font-semibold text-[#231f20]">{z.name}</td>
                              {g.intervale.map((iv) => {
                                const slot = `${z.key} ${iv.key}`;
                                const on = p.grila.includes(slot);
                                return (
                                  <td key={iv.key}>
                                    <button
                                      type="button"
                                      aria-pressed={on}
                                      aria-label={`${z.name}, ${iv.name}`}
                                      onClick={() => updateP(i, { grila: toggle(p.grila, slot) })}
                                      className={`flex h-10 w-full items-center justify-center rounded-lg border transition-colors ${
                                        on ? "border-[#231f20] bg-[#231f20] text-[#f8ef21]" : "border-[#e5e5e5] bg-[#f5f5f5] hover:border-[#231f20]"
                                      }`}
                                    >
                                      {on ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> : null}
                                    </button>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ))}
                  </div>
                </div>
              </fieldset>
            ))}

            {form.participanti.length < MAX_PARTICIPANTI ? (
              <button
                type="button"
                onClick={() => update({ participanti: [...form.participanti, copilNou()] })}
                className="inline-flex items-center gap-2 self-start rounded-full border border-dashed border-[#231f20]/40 px-5 py-2.5 text-sm font-bold text-[#231f20] hover:border-[#231f20]"
                style={display}
              >
                <Plus className="h-4 w-4" aria-hidden="true" /> Mai adaug un copil
              </button>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="vl-email" className="text-sm font-bold text-[#231f20]" style={display}>
                  Email <span className="font-normal text-[#6b6b6b]">(opțional)</span>
                </label>
                <input id="vl-email" type="email" autoComplete="email" value={form.email}
                  onChange={(e) => update({ email: e.target.value })} placeholder="maria@exemplu.ro" className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="vl-obs" className="text-sm font-bold text-[#231f20]" style={display}>
                  Observații <span className="font-normal text-[#6b6b6b]">(opțional)</span>
                </label>
                <input id="vl-obs" type="text" value={form.observatii} maxLength={500}
                  onChange={(e) => update({ observatii: e.target.value })} placeholder="Program școlar, experiență, frați…" className={inputClass} />
              </div>
            </div>

            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="vl-company">Companie</label>
              <input id="vl-company" type="text" tabIndex={-1} autoComplete="off" value={form.company}
                onChange={(e) => update({ company: e.target.value })} />
            </div>

            <TurnstileWidget ref={turnstileRef} onToken={setTurnstileToken} onError={() => setTurnstileEroare(true)} />
            {turnstileEroare && !turnstileToken ? (
              <p role="alert" className="rounded-xl bg-[#231f20] px-4 py-3 text-sm font-semibold text-[#f8ef21]">
                Nu am putut încărca verificarea anti-robot. Reîncarcă pagina sau sună-ne la 0730 534 172.
              </p>
            ) : null}
            {error ? (
              <p role="alert" className="rounded-xl bg-[#231f20] px-4 py-3 text-sm font-semibold text-[#f8ef21]">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={sending || (turnstileActivClient && !turnstileToken)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#231f20] px-8 py-4 text-base font-bold text-white transition-colors hover:bg-[#f8ef21] hover:text-[#231f20] disabled:cursor-not-allowed disabled:opacity-60"
              style={display}
            >
              {sending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  Se trimite…
                </>
              ) : (
                <>
                  Trimite preînscrierea
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </>
              )}
            </button>

            {/* Nebifat și opțional: scopul preînscrierii nu depinde de el. */}
            <label htmlFor="vl-optin" className="flex cursor-pointer items-start gap-3">
              <input id="vl-optin" type="checkbox" checked={form.marketingOptIn}
                onChange={(e) => update({ marketingOptIn: e.target.checked })}
                className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#231f20]" />
              <span className="text-xs leading-relaxed text-[#6b6b6b]">
                Vreau să aflu și despre alte cursuri, spectacole și evenimente Quasar. (opțional)
              </span>
            </label>
            <p className="text-xs leading-relaxed text-[#6b6b6b]">
              Folosim datele din formular ca să construim programul locației din Valea Lupului și ca să te contactăm
              despre el. Fără bifa de mai sus nu îți trimitem alte mesaje promoționale. Detalii în{" "}
              <a href="/politica-de-confidentialitate" className="underline hover:text-[#231f20]">politica de confidențialitate</a>.
            </p>
          </form>
        </div>
      </section>
      ) : null}

      {/* ————— Întrebări ————— */}
      <section className="bg-white px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionLabel>Întrebări</SectionLabel>
          <h2 className="mt-4 text-3xl leading-tight font-extrabold text-balance text-[#231f20] md:text-5xl" style={display}>
            Ce ne întreabă părinții.
          </h2>
          <div className="mt-10 flex flex-col gap-3">
            {[
              {
                q: "Cât costă?",
                a: (
                  <>
                    Orientativ, {PRETURI_ORIENTATIVE.map((p) => `${p.lei} lei / lună pentru ${p.detaliu}`).join(" și ")}.
                    Prețul final îl confirmăm odată cu orarul, iar prima oră este gratuită.{" "}
                    <a href={`#${PRETURI_ANCHOR}`} className="font-semibold text-[#231f20] underline">
                      Vezi prețurile orientative
                    </a>
                  </>
                ),
              },
              { q: "Când încep cursurile?", a: `Din noiembrie. Acum strângem preînscrierile, iar în vacanța de toamnă, ${PERIOADA_CONTACT}, sunăm fiecare familie ca să stabilim împreună orarul și ședința demonstrativă gratuită.` },
              { q: "Unde se țin?", a: `La Școala Verde, în Valea Lupului, în parteneriat cu ${SCOALA_PARTENERA}. Detaliile de acces le primești odată cu programul.` },
              { q: `Trebuie să fie copilul elev la ${SCOALA_PARTENERA}?`, a: "Nu. Cursurile sunt deschise tuturor copiilor din zonă." },
              { q: "Preînscrierea mă obligă la ceva?", a: "Nu. E doar o exprimare a interesului, ca să știm ce grupe să deschidem. Prima oră la sală este gratuită, iar după ea hotărâți dacă rămâneți." },
              { q: "Pot înscrie doi copii?", a: "Da. Apasă „Mai adaug un copil” și completezi vârsta, activitățile și orele fiecăruia." },
              { q: "De ce întrebați de ore și zile?", a: "Ca să punem grupele când vă convine vouă — în timpul săptămânii după școală sau în weekend dimineața. Bifează toate intervalele în care ați putea ajunge — cu cât mai multe, cu atât e mai ușor să găsim o grupă potrivită." },
            ].map((item) => (
              <details key={item.q} className="qd-faq group rounded-2xl bg-[#f5f5f5] px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-[#231f20]" style={display}>
                  {item.q}
                  <ChevronDown className="qd-faq-icon h-5 w-5 flex-shrink-0 transition-transform" aria-hidden="true" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#6b6b6b]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#231f20] px-5 pt-10 pb-24 md:px-8 md:pb-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 border-t border-white/10 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-q-a-l-1-1-5mBGGYfcxPgI3jR7NJvjH9WHuLVG7l.png"
              alt="Quasar Dance"
              width={110}
              height={30}
              className="h-7 w-auto"
            />
            <a href={`tel:${PHONE_MAIN_TEL}`} className="text-sm font-bold text-[#f8ef21] hover:underline" style={display}>
              {PHONE_MAIN}
            </a>
          </div>
          <p className="text-xs leading-relaxed text-white/40">
            QUASAR DANCE STUDIO S.R.L. · CUI RO49361270 · Reg. Com. J22/15/2024 · Sediul social: Str. Vasile Lupu 96,
            Bl. G2, Et. 7, Ap. 20, Iași 700360
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {SOCIAL_LINKS.map((social) => (
              <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer"
                className="text-sm font-bold text-white/70 transition-colors hover:text-[#f8ef21]" style={display}>
                {social.label}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/40">
            <a href="/politica-de-confidentialitate" className="hover:text-[#f8ef21]">Politică de confidențialitate</a>
            <a href="/politica-cookies" className="hover:text-[#f8ef21]">Politică cookies</a>
            <a href="https://www.quasardance.ro" className="hover:text-[#f8ef21]">quasardance.ro</a>
          </div>
        </div>
      </footer>

      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#231f20]/95 p-3 backdrop-blur transition-transform duration-300 md:hidden ${
          showStickyCta && arataFormular ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => scrollToForm()}
            className="flex-1 rounded-full bg-[#f8ef21] px-5 py-3.5 text-sm font-bold text-[#231f20]" style={display}>
            Vreau să aflu când începem
          </button>
          <a href={`tel:${PHONE_MAIN_TEL}`} aria-label={`Sună la ${PHONE_MAIN}`}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-white/20 text-white">
            <Phone className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </main>
  );
}

function pill(on: boolean) {
  return `flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
    on ? "border-[#231f20] bg-[#231f20] text-[#f8ef21]" : "border-[#e5e5e5] bg-[#f5f5f5] text-[#231f20] hover:border-[#231f20]"
  }`;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-[#231f20]/[0.06] px-3 py-1 text-xs font-black tracking-[0.16em] text-[#6b6b6b] uppercase" style={display}>
      {children}
    </span>
  );
}

function PillRow({
  label,
  note,
  optional,
  children,
}: {
  label: string;
  note?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-sm font-bold text-[#231f20]" style={display}>
        {label}{" "}
        {optional ? <span className="font-normal text-[#6b6b6b]">(opțional)</span> : <span className="text-[#6b6b6b]">*</span>}
        {note ? <span className="ml-1 font-normal text-[#6b6b6b]">{note}</span> : null}
      </span>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {children}
      </div>
    </div>
  );
}
