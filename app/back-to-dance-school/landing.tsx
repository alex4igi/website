"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { newEventId } from "@/lib/track";
import { loadConsent } from "@/lib/consent";
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  Star,
} from "lucide-react";

import {
  AGE_GROUPS,
  ANY_LOCATION_VALUE,
  GOOGLE_RATING,
  INSTRUCTORS,
  INTEREST_SEPARATOR,
  QAPP_CAMPAIGN,
  LEAD_ENDPOINT,
  LEAD_FLAG_KEY,
  LOCATIONS,
  PHONE_MAIN,
  CAMPAIGN_DAYS,
  PHONE_MAIN_TEL,
  SCHEDULE,
  SOCIAL_LINKS,
  STYLES,
  THANK_YOU_PATH,
  UNSURE_STYLE_VALUE,
  WHATSAPP_NUMBER,
  normalizeRoMobile,
  resolveUtm,
} from "./campaign";

const display = {
  fontFamily: 'var(--font-display, "Sora", ui-sans-serif, system-ui, sans-serif)',
};

const WHATSAPP_ASK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Bună! Am văzut Back to Dance School și aș vrea detalii despre ora demonstrativă gratuită.",
)}`;

/** Intervalul de vârstă al fiecărei grupe, ca orarul să nu-l repete de mână. */
const AGE_BY_GROUP = new Map<string, string>(AGE_GROUPS.map((group) => [group.name, group.ageShort]));

/** Stilurile care se țin doar la Nicolina: bifarea oricăruia fixează locația în formular. */
const NICOLINA_ONLY_STYLES: string[] = STYLES.filter((s) => s.onlyAt === "nicolina").map((s) => s.value);
const NICOLINA_VALUE = LOCATIONS.find((l) => l.key === "nicolina")!.value;

type FormState = {
  name: string;
  phone: string;
  email: string;
  ageGroup: string;
  location: string;
  /** Se pot bifa mai multe stiluri deodată. */
  interests: string[];
  /** Acord separat pentru comunicări viitoare, dincolo de scopul campaniei. */
  marketingOptIn: boolean;
  company: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  ageGroup: "",
  location: "",
  interests: [],
  marketingOptIn: false,
  company: "",
};

export default function BackToDanceSchoolLanding() {
  const router = useRouter();
  const formRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStickyCta, setShowStickyCta] = useState(false);

  const nicolinaOnlyPicked = form.interests.filter((value) => NICOLINA_ONLY_STYLES.includes(value));

  /** Bifează/debifează un stil. „Nu știu încă" se exclude reciproc cu stilurile concrete. */
  const toggleInterest = (value: string) => {
    setForm((prev) => {
      const has = prev.interests.includes(value);
      let interests: string[];
      if (has) {
        interests = prev.interests.filter((item) => item !== value);
      } else if (value === UNSURE_STYLE_VALUE) {
        interests = [UNSURE_STYLE_VALUE];
      } else {
        interests = [...prev.interests.filter((item) => item !== UNSURE_STYLE_VALUE), value];
      }
      const picksNicolinaOnly = !has && NICOLINA_ONLY_STYLES.includes(value);
      return { ...prev, interests, ...(picksNicolinaOnly ? { location: NICOLINA_VALUE } : {}) };
    });
    setError(null);
  };

  // Bara sticky de pe mobil apare după hero și dispare când formularul e pe ecran.
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

  const scrollToForm = (patch?: Partial<FormState>) => {
    if (patch) update(patch);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    formRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
    if (!patch) window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), reduce ? 0 : 600);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    // Honeypot: botul primește "succes", dar nu marcăm nimic, deci nu se numără nicio conversie.
    if (form.company) {
      router.push(THANK_YOU_PATH);
      return;
    }

    if (form.name.trim().length < 3) {
      setError("Scrie numele complet, ca să știm cu cine vorbim.");
      return;
    }
    const phone = normalizeRoMobile(form.phone);
    if (!phone) {
      setError("Număr de telefon invalid. Folosește un mobil românesc (ex: 07XXXXXXXX).");
      return;
    }
    if (!form.ageGroup) {
      setError("Alege grupa de vârstă, ca să te programăm la ora potrivită.");
      return;
    }
    // Fără locație nu putem programa ora — „Oricare" e o alegere validă, absența nu.
    if (!form.location) {
      setError("Alege locația. Dacă îți convin amândouă, apasă „Oricare”.");
      return;
    }

    setSending(true);
    const utm = resolveUtm();
    try {
      // QApp ține `interes` ca enum cu o singură valoare. Trimitem prima bifă acolo,
      // iar selecția completă ca text, ca recepția să vadă tot ce a cerut părintele.
      const [primaryInterest = null] = form.interests;
      const notes = [
        form.interests.length > 1
          ? `Stiluri bifate pe landing page: ${form.interests.join(INTEREST_SEPARATOR)}`
          : null,
        // Acordul se consemnează în lead, ca să se știe cine poate fi contactat și după campanie.
        form.marketingOptIn ? "Acceptă comunicări viitoare (nu doar despre ZPD)." : null,
      ].filter(Boolean);
      const interestNote = notes.length ? notes.join(" ") : null;
      // Același ID îl primește Meta din browser (pagina de mulțumire) și de pe server (CAPI).
      const eventId = newEventId();
      const response = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: eventId,
          marketing_consent: loadConsent()?.categories.marketing ?? false,
          nume: form.name.trim(),
          telefon: phone,
          email: form.email.trim() || null,
          interes: primaryInterest,
          grupa_varsta: form.ageGroup,
          // „Orice locație" nu e o locație reală în QApp — se trimite gol.
          locatia: form.location && form.location !== ANY_LOCATION_VALUE ? form.location : null,
          mesaj: interestNote,
          campanie: QAPP_CAMPAIGN,
          ...utm,
          company: form.company,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.error || "A apărut o eroare. Te rugăm să încerci din nou.");
        setSending(false);
        return;
      }
      try {
        window.sessionStorage.setItem(
          LEAD_FLAG_KEY,
          JSON.stringify({
            ts: Date.now(),
            event_id: eventId,
            grupa_varsta: form.ageGroup,
            locatia: form.location || ANY_LOCATION_VALUE,
            interes: form.interests.join(INTEREST_SEPARATOR) || null,
            ...utm,
          }),
        );
      } catch {
        /* sessionStorage blocat — lead-ul e trimis, doar evenimentul de conversie se pierde */
      }
      router.push(THANK_YOU_PATH);
    } catch {
      setError("Nu am putut trimite cererea. Verifică conexiunea și încearcă din nou.");
      setSending(false);
    }
  }

  return (
    <main className="bg-white" style={{ fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)' }}>
      <style>{`
        @keyframes qdUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
        .qd-up { animation: qdUp .7s cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) { .qd-up { animation: none; } }
        /* Ridică local contrastul textului peste fotografie, ca fundalul să poată rămâne vizibil. */
        .qd-hero-text { text-shadow: 0 1px 16px rgba(35,31,32,.9), 0 1px 4px rgba(35,31,32,.75); }
        .qd-faq[open] .qd-faq-icon { transform: rotate(180deg); }
      `}</style>

      {/* ————— Header minimal: fără navigație, ca traficul plătit să aibă un singur drum ————— */}
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
      </header>

      {/* ————— Hero ————— */}
      <section className="relative overflow-hidden bg-[#231f20] px-5 pt-12 pb-14 md:px-8 md:pt-16 md:pb-20">
        {/* Fotografie dintr-un curs, împinsă adânc în fundal: neclară și întunecată,
            cât să dea atmosferă fără să concureze cu titlul sau cu butoanele. */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {/* Pe ecrane înguste, decupajul lat s-ar reduce la o fâșie din mijlocul sălii,
              în care nu se distinge nimic — de aceea un cadru vertical separat.
              Neclaritatea e deja aplicată în fișiere: un filtru CSS ar fi recalculat
              la fiecare cadru de scroll, ceea ce se simte pe telefoanele mai slabe. */}
          <picture className="contents">
            <source media="(max-width: 767px)" srcSet="/back-to-dance-school-hero-mobile.jpg" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/back-to-dance-school-hero.jpg"
              alt=""
              className="h-full w-full object-cover object-center opacity-[0.85]"
            />
          </picture>
          {/* Pe lat, gradientul diagonal ține textul din stânga pe fundal aproape opac.
              Pe îngust, textul ocupă toată lățimea, așa că protejăm banda de sus. */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#231f20]/94 via-[#231f20]/62 to-[#231f20]/45 md:bg-gradient-to-br md:from-[#231f20] md:via-[#231f20]/72 md:to-[#231f20]/32" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#231f20] to-transparent" />
        </div>
        <div
          className="pointer-events-none absolute -top-32 -right-24 h-[26rem] w-[26rem] rounded-full bg-[#f8ef21] opacity-[0.08] blur-3xl"
          aria-hidden="true"
        />
        {/* Sub 1280px coloana stângă e prea îngustă pentru cele două butoane, deci stivuim. */}
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:gap-14">
          <div className="qd-hero-text">
            <div className="qd-up inline-flex flex-wrap items-center gap-2 rounded-full border border-[#f8ef21]/30 bg-[#f8ef21]/10 px-4 py-2 text-xs font-black tracking-[0.14em] text-[#f8ef21] uppercase" style={display}>
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              Luni – Vineri · 7–11 septembrie 2026
            </div>

            <h1
              className="qd-up mt-6 text-5xl leading-[1.02] font-extrabold text-balance text-white sm:text-6xl lg:text-[4.25rem] xl:text-[4.75rem]"
              style={{ ...display, animationDelay: "120ms" }}
            >
              <span className="block">Back to</span>
              <span className="block text-[#f8ef21]">Dance School.</span>
            </h1>

            <p
              className="qd-up mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg"
              style={{ animationDelay: "240ms" }}
            >
              O săptămână întreagă de <strong className="font-semibold text-white">cursuri demonstrative gratuite</strong>,
              la Ștefan cel Mare și Nicolina. Copilul tău intră în sală, dansează o oră cu instructorii noștri — și abia
              apoi hotărâți dacă rămâne. Fără plată, fără contract, fără presiune.
            </p>

            <div className="qd-up mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ animationDelay: "340ms" }}>
              <button
                type="button"
                onClick={() => scrollToForm()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f8ef21] px-8 py-4 text-base font-bold text-[#231f20] transition-transform hover:scale-[1.02] hover:bg-white active:scale-100"
                style={display}
              >
                Rezervă locul gratuit
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

            {/* /65 și nu mai puțin: peste zonele luminoase ale fotografiei, /50 scădea sub pragul WCAG AA. */}
            <p className="qd-up mt-5 text-sm text-white/65" style={{ animationDelay: "420ms" }}>
              Te sunăm în cel mult 24 de ore. Locurile la orele demonstrative sunt limitate — grupele se formează în
              ordinea înscrierilor.
            </p>
          </div>

          {/* Pe ecrane late cifrele ocupă coloana din dreapta, ca hero-ul să nu rămână pe jumătate gol.
              Când primim fotografii de la cursuri, ele intră aici și cifrele revin sub text. */}
          <dl className="qd-up grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-2 xl:gap-4" style={{ animationDelay: "460ms" }}>
            {[
              { value: "1981", label: "anul în care am început" },
              { value: "11.000+", label: "copii au dansat la Quasar" },
              { value: "600+", label: "membri activi acum" },
              { value: "2", label: "locații în campanie" },
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

      {/* ————— Cum funcționează ————— */}
      <section className="bg-white px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Cum funcționează</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-extrabold text-balance text-[#231f20] md:text-5xl" style={display}>
            Trei pași până la prima oră de dans.
          </h2>

          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Te înscrii online",
                text: "Completezi formularul de mai jos în mai puțin de un minut: nume, telefon, vârsta copilului și locația care vă convine.",
              },
              {
                n: "02",
                title: "Te sunăm noi",
                text: "În maximum 24 de ore te contactăm, îți confirmăm grupa potrivită și ora la care vă așteptăm în sală.",
              },
              {
                n: "03",
                title: "Veniți la sală",
                text: "Între 7 și 11 septembrie, copilul participă la o oră de curs, gratuit. Dacă la început e timid, nu-l grăbește nimeni — poate sta pe margine cât are nevoie, până se hotărăște singur să intre în joc.",
              },
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
                <h3 className="relative z-10 text-xl font-extrabold text-[#231f20]" style={display}>
                  {step.title}
                </h3>
                <p className="relative z-10 text-sm leading-relaxed text-[#6b6b6b]">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ————— Grupe de vârstă ————— */}
      <section className="bg-[#f5f5f5] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Grupe de vârstă</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-extrabold text-balance text-[#231f20] md:text-5xl" style={display}>
            Fiecare vârstă are ora ei.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#6b6b6b]">
            În Săptămâna Porților Deschise organizăm ore demonstrative separate pentru fiecare grupă, ca fiecare să
            danseze alături de cei de vârsta lui.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AGE_GROUPS.map((group) => (
              <div
                key={group.key}
                className="flex flex-col gap-3 rounded-2xl border border-[#e5e5e5] bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <span className="text-xs font-black tracking-[0.14em] text-[#6b6b6b] uppercase" style={display}>
                  {group.age}
                </span>
                <h3 className="text-2xl font-extrabold text-[#231f20]" style={display}>
                  {group.name}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-[#6b6b6b]">{group.blurb}</p>
                <button
                  type="button"
                  onClick={() => scrollToForm({ ageGroup: group.value })}
                  className="mt-2 inline-flex items-center gap-2 self-start rounded-full bg-[#231f20] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#f8ef21] hover:text-[#231f20]"
                  style={display}
                >
                  Rezervă la {group.name}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Stiluri ————— */}
      <section className="bg-white px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Ce se dansează</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-extrabold text-balance text-[#231f20] md:text-5xl" style={display}>
            Patru cursuri pe care le poți încerca gratuit.
          </h2>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STYLES.map((style) => (
              <div key={style.key} className="group flex flex-col gap-4 rounded-2xl bg-[#f5f5f5] p-7 transition-colors hover:bg-[#231f20]">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full bg-[#231f20] px-3 py-1 text-[11px] font-black tracking-wide text-[#f8ef21] uppercase transition-colors group-hover:bg-[#f8ef21] group-hover:text-[#231f20]"
                    style={display}
                  >
                    {style.ages}
                  </span>
                  {style.onlyAt ? (
                    <span
                      className="rounded-full border border-[#231f20]/20 px-3 py-1 text-[11px] font-bold text-[#6b6b6b] transition-colors group-hover:border-white/25 group-hover:text-white/70"
                      style={display}
                    >
                      doar la Nicolina
                    </span>
                  ) : (
                    <span
                      className="rounded-full border border-[#231f20]/20 px-3 py-1 text-[11px] font-bold text-[#6b6b6b] transition-colors group-hover:border-white/25 group-hover:text-white/70"
                      style={display}
                    >
                      ambele locații
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-extrabold text-[#231f20] transition-colors group-hover:text-white" style={display}>
                  {style.name}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-[#6b6b6b] transition-colors group-hover:text-white/70">
                  {style.blurb}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    // Din card doar adăugăm stilul — un al doilea click nu trebuie să-l scoată.
                    if (!form.interests.includes(style.value)) toggleInterest(style.value);
                    scrollToForm();
                  }}
                  className="inline-flex items-center gap-2 self-start text-sm font-bold text-[#231f20] transition-colors group-hover:text-[#f8ef21]"
                  style={display}
                >
                  Vreau să încerc
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— De ce Quasar ————— */}
      <section className="bg-[#f8ef21] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex rounded-full bg-[#231f20]/10 px-3 py-1 text-xs font-black tracking-[0.16em] text-[#231f20] uppercase" style={display}>
            De ce Quasar
          </span>
          <h2 className="mt-4 max-w-3xl text-3xl leading-tight font-extrabold text-balance text-[#231f20] md:text-5xl" style={display}>
            45 de ani de dans în Iași. Nu improvizăm.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#231f20]/70">
            Quasar a adus street dance-ul în Iași înainte ca termenul să existe în dicționar. De atunci am format
            generații de dansatori — și, la fel de important, generații de instructori.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { value: "45", suffix: " ani", label: "de școală de dans, neîntrerupt" },
              { value: "11.000+", suffix: "", label: "tineri introduși la dans" },
              { value: "600+", suffix: "", label: "membri activi în acest moment" },
              { value: "zeci", suffix: "", label: "de trofee naționale și internaționale" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-[#231f20] p-5 md:p-7">
                <span className="block text-[clamp(1.5rem,5vw,2.5rem)] leading-none font-extrabold text-[#f8ef21]" style={display}>
                  {stat.value}
                  {stat.suffix}
                </span>
                <span className="mt-3 block text-xs leading-snug text-white/60">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Dovadă din afara paginii: cifrele de mai sus sunt afirmațiile noastre, asta e verificabilă. */}
          <a
            href={GOOGLE_RATING.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-[#231f20] px-6 py-4 transition-colors hover:bg-[#231f20]/85"
          >
            <span className="flex gap-1" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-[#f8ef21] text-[#f8ef21]" />
              ))}
            </span>
            <span className="text-sm font-bold text-white" style={display}>
              {GOOGLE_RATING.score} din 5 pe Google
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#f8ef21]" style={display}>
              Citește recenziile
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </a>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Cea mai veche școală de street dance din Moldova",
              "Instructori formați în sistemul Quasar",
              "Spectacole proprii, concursuri naționale și flashmob-uri",
              "Săli dotate profesionist: podea de dans, oglinzi, vestiare",
            ].map((item, index) => (
              <li key={item} className="flex items-start gap-4 rounded-xl bg-[#231f20]/10 px-5 py-4">
                <span
                  className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#231f20] text-[10px] font-black text-[#f8ef21]"
                  style={display}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed font-semibold text-[#231f20]" style={display}>
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ————— Ce ia copilul acasă ————— */}
      <section className="bg-white px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>De ce merită</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-extrabold text-balance text-[#231f20] md:text-5xl" style={display}>
            Ce ia copilul acasă, în afară de pași de dans.
          </h2>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Încredere în sine", text: "Fiecare apariție pe scenă construiește curaj real. Copiii descoperă că pot — și asta îi schimbă." },
              { title: "Disciplină", text: "Repetițiile, răbdarea și progresul constant formează caracterul, nu doar dansatorul." },
              { title: "Prieteni", text: "Grupa devine cerc de prieteni. De cele mai multe ori, pentru mulți ani de acum înainte." },
              { title: "Sănătate", text: "Postură, coordonare și condiție fizică — fără plictiseala unei săli de sport." },
            ].map((benefit) => (
              <div key={benefit.title} className="flex flex-col gap-3 border-t-2 border-[#f8ef21] pt-5">
                <h3 className="text-lg font-extrabold text-[#231f20]" style={display}>
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#6b6b6b]">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Instructori ————— */}
      <section className="bg-[#f5f5f5] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Cine te așteaptă în sală</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-extrabold text-balance text-[#231f20] md:text-5xl" style={display}>
            Oamenii cu care va dansa copilul tău.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#6b6b6b]">
            La ora demonstrativă nu vine cineva „să suplinească". Sunt o parte dintre instructorii care țin grupele
            tot anul — mulți dintre ei crescuți chiar în Quasar.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {INSTRUCTORS.map((person) => (
              <figure key={person.key} className="flex flex-col gap-3">
                <div className="overflow-hidden rounded-2xl bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={person.photo}
                    alt={person.name}
                    width={480}
                    height={480}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                </div>
                <figcaption>
                  <span className="block text-sm font-extrabold text-[#231f20] md:text-base" style={display}>
                    {person.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-[#6b6b6b] md:text-xs">{person.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Testimoniale ————— */}
      <section className="bg-[#231f20] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black tracking-[0.16em] text-[#f8ef21] uppercase" style={display}>
            Ce spun părinții
          </span>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-extrabold text-balance text-white md:text-5xl" style={display}>
            Nu ne credeți pe cuvânt.
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                quote:
                  "Al meu e un pic retras, așa că m-am temut că o să fie copleșit. La prima ședință a fost lăsat pur și simplu să stea și să asculte muzică — fără nicio presiune. Până la urmă el singur a cerut să încerce.",
                name: "Raluca D.",
                role: "Mamă · 42 de ani",
              },
              {
                quote:
                  "Când se formează grupurile se fac niște jocuri între copii, ca să spargă gheața. Când am luat-o acasă după primul curs, îmi povestea entuziasmată că și-a făcut prieteni noi. Le știa chiar și numele.",
                name: "Mihaela T.",
                role: "Mamă · 36 de ani",
              },
              {
                quote:
                  "A ajuns să aștepte ora de dans cu atâta nerăbdare, că am renunțat să mai plecăm în concediu când pică cursuri sau evenimente. Acum noi ne facem programul după ea — nu invers.",
                name: "Cristina B.",
                role: "Mamă · 39 de ani",
              },
            ].map((testimonial) => (
              <figure key={testimonial.name} className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-7">
                <div className="flex gap-1" aria-label="5 din 5 stele">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-[#f8ef21] text-[#f8ef21]" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="flex-1 text-sm leading-relaxed text-white/80">“{testimonial.quote}”</blockquote>
                <figcaption>
                  <span className="block text-sm font-black text-[#f8ef21]" style={display}>
                    {testimonial.name}
                  </span>
                  <span className="mt-1 block text-xs text-white/45">{testimonial.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Locații ————— */}
      <section className="bg-[#f5f5f5] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Unde ne găsiți</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-extrabold text-balance text-[#231f20] md:text-5xl" style={display}>
            Două locații în Iași. Alege-o pe cea mai apropiată.
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {LOCATIONS.map((location) => (
              <div key={location.key} className="flex flex-col gap-5 rounded-2xl border border-[#e5e5e5] bg-white p-7">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#f8ef21]" aria-hidden="true">
                    <MapPin className="h-5 w-5 text-[#231f20]" />
                  </span>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#231f20]" style={display}>
                      Quasar {location.name}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#6b6b6b]">
                      {location.address}
                      <br />
                      {location.addressExtra}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#231f20]/70">{location.access}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {location.styles.map((style) => (
                    <span
                      key={style}
                      className="rounded-full bg-[#f5f5f5] px-3 py-1 text-xs font-semibold text-[#231f20]"
                      style={display}
                    >
                      {style}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex flex-wrap gap-3">
                  <a
                    href={location.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#231f20] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#f8ef21] hover:text-[#231f20]"
                    style={display}
                  >
                    Deschide în Maps
                  </a>
                  <a
                    href={`tel:${location.phoneTel}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] px-5 py-2.5 text-sm font-bold text-[#231f20] transition-colors hover:border-[#231f20]"
                    style={display}
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {location.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Orar ————— */}
      <section className="bg-white px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionLabel>Orarul orelor demonstrative</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-extrabold text-balance text-[#231f20] md:text-5xl" style={display}>
            Fiecare grupă are ziua și ora ei.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#6b6b6b]">
            Orele demonstrative se țin în intervalul obișnuit al cursurilor, cu instructorul care va lucra cu grupa
            tot anul. Mai jos găsești ziua și ora fiecărei grupe; după înscriere te sunăm ca să confirmăm prezența.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            {LOCATIONS.map((location) => {
              const byDay = SCHEDULE[location.key] ?? {};
              const activeDays = CAMPAIGN_DAYS.filter((day) => (byDay[day.key] ?? []).length > 0);
              const published = activeDays.length > 0;
              /* Nicolina nu ține ore în toate cele cinci zile — eticheta arată intervalul real. */
              const range =
                activeDays.length > 1
                  ? `${activeDays[0].day}–${activeDays[activeDays.length - 1].day} septembrie`
                  : activeDays.length === 1
                    ? `${activeDays[0].day} septembrie`
                    : null;

              return (
                <div
                  key={location.key}
                  className={`rounded-2xl border p-6 md:p-8 ${
                    published ? "border-[#e5e5e5] bg-white" : "border-dashed border-[#e5e5e5] bg-[#f5f5f5]"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-[#231f20]" style={display}>
                        Quasar {location.name}
                      </h3>
                      <p className="mt-1.5 flex items-center gap-2 text-sm text-[#6b6b6b]">
                        <MapPin className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                        {location.address}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-black tracking-wide uppercase ${
                        published ? "bg-[#f8ef21] text-[#231f20]" : "bg-[#231f20] text-[#f8ef21]"
                      }`}
                      style={display}
                    >
                      {range ?? "În curând"}
                    </span>
                  </div>

                  {published ? (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                      {CAMPAIGN_DAYS.map((day) => {
                        const slots = byDay[day.key] ?? [];
                        return (
                          <div
                            key={day.key}
                            /* Ziua fără ore contează doar ca să țină coloanele aliniate — pe mobil, unde
                               casetele sunt stivuite, nu are ce alinia și doar ar lungi lista. */
                            className={`rounded-xl bg-[#f5f5f5] p-4 ${slots.length ? "" : "hidden lg:block"}`}
                          >
                            <div className="flex items-baseline gap-2 border-b border-[#e5e5e5] pb-3">
                              <span className="text-sm font-extrabold text-[#231f20]" style={display}>
                                {day.weekday}
                              </span>
                              <span className="text-xs text-[#6b6b6b]">{day.day} sept.</span>
                            </div>

                            {slots.length ? (
                              <ul className="mt-4 flex flex-col gap-4">
                                {slots.map((slot) => {
                                  /* O oră comună mai multor grupe le arată împreună; vârsta rămâne
                                     doar unde e o singură grupă, deci un singur interval de afișat. */
                                  const groups =
                                    slot.group == null ? [] : Array.isArray(slot.group) ? slot.group : [slot.group];
                                  const age = groups.length === 1 ? AGE_BY_GROUP.get(groups[0]) : null;

                                  return (
                                    <li key={slot.time}>
                                      <p className="flex items-center gap-1.5 text-base font-extrabold text-[#231f20]" style={display}>
                                        <Clock className="h-3.5 w-3.5 flex-shrink-0 text-[#6b6b6b]" aria-hidden="true" />
                                        {slot.time}
                                      </p>
                                      <p className="mt-1.5 text-sm font-bold text-[#231f20]">
                                        {groups.length ? groups.join(" + ") : slot.style}
                                      </p>
                                      {groups.length ? (
                                        <p className="text-xs leading-relaxed text-[#6b6b6b]">
                                          {age ? `${age} · ${slot.style}` : slot.style}
                                        </p>
                                      ) : null}
                                      <p className="mt-0.5 text-xs font-semibold text-[#6b6b6b]">cu {slot.instructor}</p>
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <p className="mt-4 text-xs text-[#6b6b6b]">Fără ore</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-[#6b6b6b]">
                      <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                      <span>
                        7–11 septembrie · orarul pe grupe se publică zilele acestea. Înscrie-te și ți-l trimitem
                        înaintea publicării.
                      </span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollToForm()}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#f8ef21] px-7 py-3.5 text-base font-bold text-[#231f20] transition-transform hover:scale-[1.02] hover:bg-[#231f20] hover:text-[#f8ef21]"
            style={display}
          >
            Rezervă locul la ora demonstrativă
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* ————— FAQ ————— */}
      <section className="bg-[#f5f5f5] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionLabel>Întrebări frecvente</SectionLabel>
          <h2 className="mt-4 text-3xl leading-tight font-extrabold text-balance text-[#231f20] md:text-5xl" style={display}>
            Ce ne întreabă cel mai des părinții.
          </h2>

          <div className="mt-10 flex flex-col gap-3">
            {[
              {
                q: "Chiar este gratuit?",
                a: "Da. Ora demonstrativă din 7–11 septembrie este complet gratuită. Nu plătești nimic ca să vii și nu ești obligat să te înscrii după.",
              },
              {
                q: "Copilul meu nu a dansat niciodată. E o problemă?",
                a: "Nu, dimpotrivă — exact pentru asta există săptămâna aceasta. Orele demonstrative sunt gândite pentru începători, iar instructorii sunt obișnuiți cu copii care intră prima dată într-o sală de dans.",
              },
              {
                q: "Pot să rămân cu el în sală?",
                a: "În sală intră doar copiii, iar asta e spre binele lor: fără părinte în cameră se integrează mult mai repede în grup și ascultă instructorul, nu se uită după tine. Îl lași la ușă și îl aștepți la recepție — ora trece repede, iar la final instructorul îți spune cum s-a descurcat.",
              },
              {
                q: "Ce trebuie să aducă la ora demonstrativă?",
                a: "Haine lejere, adidași sau papuci de schimb și o sticlă de apă. Atât. Nu e nevoie de niciun echipament special.",
              },
              {
                q: "Dacă nu putem veni în ziua propusă?",
                a: "Ne spui la telefon și căutăm altă zi din aceeași săptămână, la grupa potrivită. Dacă niciun interval din 7–11 septembrie nu vă convine, îți ținem locul pentru începutul anului de cursuri și te sunăm din nou.",
              },
              {
                q: "Putem veni la mai multe ore demonstrative?",
                a: "Da, dacă mai sunt locuri libere. Spune-ne la telefon ce stiluri vă interesează și încercăm să vă programăm la toate.",
              },
              {
                q: "Ce se întâmplă după 11 septembrie?",
                a: "Anul de cursuri începe pe 12 septembrie. Dacă i-a plăcut, îi rezervi locul în grupă și vorbim despre abonament. Dacă nu, nu datorezi nimic și rămânem cu bine.",
              },
              {
                q: "La ce locație e mai bine să venim?",
                a: "Alegeți locația cea mai apropiată de casă sau de școală — programul se ține mult mai ușor așa. Singura diferență: gimnastica acrobatică se face doar la Nicolina.",
              },
            ].map((item) => (
              <details key={item.q} className="qd-faq group rounded-2xl border border-[#e5e5e5] bg-white px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-[#231f20]" style={display}>
                  {item.q}
                  <ChevronDown className="qd-faq-icon h-5 w-5 flex-shrink-0 text-[#6b6b6b] transition-transform duration-200" aria-hidden="true" />
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-[#6b6b6b]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Formular ————— */}
      <section id="inscriere" ref={formRef} className="scroll-mt-4 bg-[#231f20] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl items-start gap-12 md:grid-cols-2">
          <div className="md:pt-4">
            <span className="inline-flex rounded-full bg-[#f8ef21]/10 px-3 py-1 text-xs font-black tracking-[0.16em] text-[#f8ef21] uppercase" style={display}>
              Înscriere · gratuit
            </span>
            <h2 className="mt-5 text-3xl leading-tight font-extrabold text-balance text-white md:text-5xl" style={display}>
              Rezervă locul la ora
              <br />
              <span className="text-[#f8ef21]">demonstrativă gratuită.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/65">
              Completezi în mai puțin de un minut. Te sunăm în cel mult 24 de ore ca să-ți confirmăm grupa și ora.
            </p>

            <ul className="mt-8 flex flex-col gap-4">
              {[
                "Ora demonstrativă e 100% gratuită",
                "Fără contract și fără plată în avans",
                "Îți ținem locul în grupa potrivită",
                "Poți anula printr-un simplu mesaj",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#f8ef21]" aria-hidden="true">
                    <Check className="h-3.5 w-3.5 text-[#231f20]" strokeWidth={3} />
                  </span>
                  <span className="text-sm text-white/80">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm leading-relaxed text-white/60">
                Preferi să vorbim direct? Sună-ne la{" "}
                <a href={`tel:${PHONE_MAIN_TEL}`} className="font-bold text-[#f8ef21] hover:underline">
                  {PHONE_MAIN}
                </a>{" "}
                sau scrie-ne pe{" "}
                <a href={WHATSAPP_ASK} target="_blank" rel="noopener noreferrer" className="font-bold text-[#f8ef21] hover:underline">
                  WhatsApp
                </a>
                .
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-6 rounded-2xl bg-white p-6 md:p-8">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="btds-name" className="text-sm font-bold text-[#231f20]" style={display}>
                Nume complet <span className="text-[#6b6b6b]">*</span>
              </label>
              <input
                id="btds-name"
                ref={nameRef}
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={(event) => update({ name: event.target.value })}
                placeholder="Ex: Maria Popescu"
                className="rounded-xl border border-[#e5e5e5] bg-[#f5f5f5] px-4 py-3.5 text-base text-[#231f20] outline-none transition-colors focus:border-[#231f20] focus:bg-white"
              />
              <p className="text-xs text-[#6b6b6b]">Numele părintelui e suficient — restul detaliilor le luăm la telefon.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="btds-phone" className="text-sm font-bold text-[#231f20]" style={display}>
                Telefon <span className="text-[#6b6b6b]">*</span>
              </label>
              <input
                id="btds-phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(event) => update({ phone: event.target.value })}
                placeholder="07XX XXX XXX"
                className="rounded-xl border border-[#e5e5e5] bg-[#f5f5f5] px-4 py-3.5 text-base text-[#231f20] outline-none transition-colors focus:border-[#231f20] focus:bg-white"
              />
              <p className="text-xs text-[#6b6b6b]">Te sunăm doar în legătură cu ora demonstrativă.</p>
            </div>

            <PillGroup
              label="Grupa de vârstă"
              required
              options={AGE_GROUPS.map((group) => ({
                value: group.value,
                label: `${group.name} · ${group.ageShort}`,
              }))}
              selected={form.ageGroup}
              onSelect={(value) => update({ ageGroup: value })}
            />

            <PillGroup
              label="Locația preferată"
              required
              options={[
                ...LOCATIONS.map((location) => ({ value: location.value, label: location.name })),
                { value: ANY_LOCATION_VALUE, label: "Oricare" },
              ]}
              selected={form.location}
              onSelect={(value) => update({ location: value })}
              hint={
                nicolinaOnlyPicked.length
                  ? `${nicolinaOnlyPicked.join(" și ")} ${
                      nicolinaOnlyPicked.length > 1 ? "se țin" : "se ține"
                    } doar la Nicolina, așa că am selectat locația pentru tine.`
                  : undefined
              }
            />

            <PillGroup
              label="Ce v-ar interesa"
              note="— poți alege mai multe"
              options={[
                ...STYLES.map((style) => ({ value: style.value, label: style.name })),
                { value: UNSURE_STYLE_VALUE, label: UNSURE_STYLE_VALUE },
              ]}
              selected={form.interests}
              onSelect={toggleInterest}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="btds-email" className="text-sm font-bold text-[#231f20]" style={display}>
                Email <span className="font-normal text-[#6b6b6b]">(opțional)</span>
              </label>
              <input
                id="btds-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(event) => update({ email: event.target.value })}
                placeholder="maria@exemplu.ro"
                className="rounded-xl border border-[#e5e5e5] bg-[#f5f5f5] px-4 py-3.5 text-base text-[#231f20] outline-none transition-colors focus:border-[#231f20] focus:bg-white"
              />
              <p className="text-xs text-[#6b6b6b]">Îți trimitem confirmarea și orarul și pe email.</p>
            </div>

            {/* Honeypot anti-spam — invizibil pentru oameni. */}
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="btds-company">Companie</label>
              <input
                id="btds-company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.company}
                onChange={(event) => update({ company: event.target.value })}
              />
            </div>

            {error ? (
              <p role="alert" className="rounded-xl bg-[#231f20] px-4 py-3 text-sm font-semibold text-[#f8ef21]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={sending}
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
                  Rezervă locul gratuit
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </>
              )}
            </button>

            {/* Nebifat și opțional: scopul campaniei nu depinde de el, deci nu poate fi presupus. */}
            <label htmlFor="btds-optin" className="flex cursor-pointer items-start gap-3">
              <input
                id="btds-optin"
                type="checkbox"
                checked={form.marketingOptIn}
                onChange={(event) => update({ marketingOptIn: event.target.checked })}
                className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#231f20]"
              />
              <span className="text-xs leading-relaxed text-[#6b6b6b]">
                Vreau să aflu și despre alte cursuri, spectacole și evenimente Quasar. (opțional)
              </span>
            </label>

            <p className="text-xs leading-relaxed text-[#6b6b6b]">
              Prin trimiterea formularului ești de acord cu{" "}
              <a href="/politica-de-confidentialitate" className="underline hover:text-[#231f20]">
                politica de confidențialitate
              </a>
              . Fără bifa de mai sus, folosim datele exclusiv ca să te contactăm despre Săptămâna Porților Deschise.
            </p>
          </form>
        </div>
      </section>

      {/* ————— Footer minimal ————— */}
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
          {/* Profilurile se verifică înainte de prima vizită — mai ales de către adolescenți. */}
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-white/70 transition-colors hover:text-[#f8ef21]"
                style={display}
              >
                {social.label}
              </a>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/40">
            <a href="/politica-de-confidentialitate" className="hover:text-[#f8ef21]">
              Politică de confidențialitate
            </a>
            <a href="/politica-cookies" className="hover:text-[#f8ef21]">
              Politică cookies
            </a>
            <a href="https://www.quasardance.ro" className="hover:text-[#f8ef21]">
              quasardance.ro
            </a>
          </div>
        </div>
      </footer>

      {/* ————— Bară sticky pe mobil ————— */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#231f20]/95 p-3 backdrop-blur transition-transform duration-300 md:hidden ${
          showStickyCta ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollToForm()}
            className="flex-1 rounded-full bg-[#f8ef21] px-5 py-3.5 text-sm font-bold text-[#231f20]"
            style={display}
          >
            Rezervă locul gratuit
          </button>
          <a
            href={`tel:${PHONE_MAIN_TEL}`}
            aria-label={`Sună la ${PHONE_MAIN}`}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-white/20 text-white"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-[#231f20]/[0.06] px-3 py-1 text-xs font-black tracking-[0.16em] text-[#6b6b6b] uppercase" style={display}>
      {children}
    </span>
  );
}

function PillGroup({
  label,
  options,
  selected,
  onSelect,
  required,
  hint,
  note,
}: {
  label: string;
  options: { value: string; label: string }[];
  /** Un singur text pentru alegere unică, o listă pentru alegere multiplă. */
  selected: string | string[];
  onSelect: (value: string) => void;
  required?: boolean;
  hint?: string;
  note?: string;
}) {
  const groupId = useMemo(() => `pill-${label.replace(/\s+/g, "-").toLowerCase()}`, [label]);
  const multiple = Array.isArray(selected);
  const isOn = (value: string) => (multiple ? selected.includes(value) : selected === value);
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend id={groupId} className="mb-2.5 text-sm font-bold text-[#231f20]" style={display}>
        {label} {required ? <span className="text-[#6b6b6b]">*</span> : <span className="font-normal text-[#6b6b6b]">(opțional)</span>}
        {note ? <span className="ml-1 font-normal text-[#6b6b6b]">{note}</span> : null}
      </legend>
      <div className="flex flex-wrap gap-2" role="group" aria-labelledby={groupId}>
        {options.map((option) => {
          const on = isOn(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={on}
              onClick={() => onSelect(multiple ? option.value : on ? "" : option.value)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                on
                  ? "border-[#231f20] bg-[#231f20] text-[#f8ef21]"
                  : "border-[#e5e5e5] bg-[#f5f5f5] text-[#231f20] hover:border-[#231f20]"
              }`}
              style={display}
            >
              {multiple && on ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : null}
              {option.label}
            </button>
          );
        })}
      </div>
      {hint ? <p className="text-xs text-[#6b6b6b]">{hint}</p> : null}
    </fieldset>
  );
}
