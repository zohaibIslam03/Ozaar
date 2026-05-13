"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileImage,
  Check,
  Layers,
  FileText,
  User,
  Mail,
  Coins,
  Clock,
  Minimize2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const spotlights = [
  {
    slug: "image-compressor",
    eyebrow: "Images",
    headline: "Compress without compromise.",
    desc: "Shrink PNG, JPG, and GIF files by up to 90% and convert to WebP — all without visible quality loss. Zero uploads, zero server contact.",
    bullets: ["Up to 90% smaller file size", "PNG, JPG, GIF → WebP", "100% offline processing"],
    visual: "compressor",
  },
  {
    slug: "resume-builder",
    eyebrow: "Career",
    headline: "Your next job starts here.",
    desc: "Build an ATS-friendly resume in minutes. Live preview, one-click PDF export, and auto-save to your browser. No account ever needed.",
    bullets: ["ATS-optimized templates", "Live side-by-side preview", "One-click PDF export"],
    visual: "resume",
  },
  {
    slug: "currency-converter",
    eyebrow: "Finance",
    headline: "Live rates. Zero delays.",
    desc: "Convert between 150+ world currencies with exchange rates updated every hour. Multi-currency comparison table included.",
    bullets: ["150+ currencies supported", "Hourly rate updates", "Multi-currency comparison"],
    visual: "currency",
  },
  {
    slug: "bg-remover",
    eyebrow: "Images",
    headline: "Erase. Replace. Download.",
    desc: "AI-powered background removal that runs entirely in your browser via WebAssembly. Your photos never touch a server.",
    bullets: ["AI model runs client-side", "Replace or keep transparent", "Professional edge quality"],
    visual: "bgremover",
  },
];

function CompressorVisual() {
  return (
    <div className="flex h-full w-full items-center justify-center p-2">
      <div className="relative grid w-max max-w-[calc(100vw-1.5rem)] grid-cols-[104px_1px_104px] overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white pb-5 shadow-xl sm:grid-cols-[114px_1px_114px]">
        <div className="col-span-3 flex items-center justify-between gap-2 border-b border-[#ECECEC] bg-[#FAFAFA] px-2 py-1.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <FileImage className="h-3.5 w-3.5 shrink-0 text-[#6366F1] sm:h-4 sm:w-4" strokeWidth={2} />
            <span className="truncate text-[10px] font-semibold text-[#333] sm:text-[11px]">hero-banner.png</span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <span className="rounded bg-[#EEF2FF] px-1 py-0.5 text-[8px] font-bold text-[#4338CA] sm:text-[9px]">PNG</span>
            <span className="rounded bg-[#F5F5F5] px-1 py-0.5 text-[8px] font-medium text-[#888] sm:text-[9px]">sRGB</span>
          </div>
        </div>

        <div className="flex flex-col bg-[#EEF2FF] px-2 pb-6 pt-2 sm:px-2.5 sm:pb-7 sm:pt-2.5">
          <p className="text-[9px] font-bold uppercase tracking-wider text-[#6366F1] sm:text-[10px]">Original</p>
          <div className="mt-1.5 flex flex-col gap-1.5">
            <div className="flex h-[48px] w-full items-center justify-center rounded-md border border-[#C7D2FE] bg-gradient-to-br from-white to-[#E0E7FF] sm:h-[54px]">
              <Layers className="h-5 w-5 text-[#818CF8] opacity-80 sm:h-6 sm:w-6" strokeWidth={1.5} />
            </div>
            <p className="text-[16px] font-black leading-none text-[#4338CA] sm:text-[18px]">4.2 MB</p>
            <p className="text-[8px] text-[#6366F1]/80 sm:text-[9px]">1920×1080</p>
            <span className="w-fit rounded border border-[#C7D2FE] bg-white/80 px-1.5 py-0.5 text-[8px] font-semibold text-[#4338CA]">Lossless</span>
            <div className="h-1 w-full overflow-hidden rounded-full bg-[#C7D2FE]/50">
              <div className="h-full w-full rounded-full bg-[#6366F1]/40" />
            </div>
            <p className="text-[8px] font-medium leading-tight text-[#6366F1]/75">Full quality</p>
          </div>
        </div>

        <div className="min-h-full w-px bg-[#DF0A09] sm:self-stretch" aria-hidden />

        <div className="relative flex flex-col bg-[#FAFAFA] px-2 pb-6 pt-2 sm:px-2.5 sm:pb-7 sm:pt-2.5">
          <div className="absolute right-1 top-1 flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700 sm:text-[9px]">
            <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" strokeWidth={3} />
            WebP
          </div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-[#DF0A09] sm:text-[10px]">Compressed</p>
          <div className="mt-1.5 flex flex-col gap-1.5">
            <div className="flex h-[48px] w-full items-center justify-center rounded-md border border-[#FEE2E2] bg-gradient-to-br from-white to-[#FFF1F1] sm:h-[54px]">
              <Sparkles className="h-5 w-5 text-[#DF0A09] opacity-90 sm:h-6 sm:w-6" strokeWidth={1.5} />
            </div>
            <p className="text-[16px] font-black leading-none text-[#DF0A09] sm:text-[18px]">380 KB</p>
            <p className="text-[8px] leading-tight text-[#888] sm:text-[9px]">Smarter codec</p>
            <div className="h-1 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
              <div className="h-full w-[11%] rounded-full bg-[#DF0A09]" />
            </div>
            <p className="text-[8px] font-medium leading-tight text-[#999]">~85% quality</p>
          </div>
        </div>

        <div className="absolute bottom-1 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#DF0A09] px-2.5 py-1 text-[9px] font-bold text-white shadow-md sm:bottom-1.5 sm:gap-1.5 sm:px-3 sm:text-[10px]">
          <Minimize2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />
          −91% smaller
        </div>
      </div>
    </div>
  );
}

function ResumeVisual() {
  return (
    <div className="flex h-full w-full items-center justify-center px-2 py-1">
      <div className="flex w-[min(230px,90vw)] min-h-[260px] max-w-[260px] flex-col overflow-hidden rounded-xl border border-[#E8E8E8] bg-white shadow-xl sm:min-h-[280px]">
        <div className="flex items-center justify-between border-b border-[#F0F0F0] px-3 py-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#AAA]">Live preview</span>
          <span className="rounded-md bg-[#ECFDF5] px-2 py-0.5 text-[8px] font-bold text-emerald-700">ATS-safe</span>
        </div>
        <div className="flex h-14 shrink-0 items-center gap-2 bg-[#DF0A09] px-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/25 text-white">
            <User className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <div className="h-2 w-24 max-w-full rounded-full bg-white/90" />
            <div className="h-1.5 w-14 rounded-full bg-white/50" />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2.5 overflow-hidden p-3">
          <div className="flex items-center gap-2 rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] px-2.5 py-2 text-[9px] text-[#666]">
            <Mail className="h-3.5 w-3.5 shrink-0 text-[#DF0A09]" strokeWidth={2} />
            <span className="truncate font-medium">you@email.com</span>
          </div>
          {["Experience", "Education", "Skills"].map((s) => (
            <div key={s} className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[8px] font-bold uppercase tracking-wide text-[#DF0A09]">{s}</p>
                <FileText className="h-3 w-3 shrink-0 text-[#DDD]" strokeWidth={2} />
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#F0F0F0]" />
              <div className="h-1.5 w-[88%] rounded-full bg-[#F0F0F0]" />
              <div className="h-1.5 w-[55%] rounded-full bg-[#F5F5F5]" />
            </div>
          ))}
        </div>
        <div className="flex shrink-0 items-center justify-between border-t border-[#F0F0F0] bg-[#FAFAFA] px-3 py-2.5">
          <span className="text-[9px] font-medium text-[#888]">Auto-saved locally</span>
          <span className="flex items-center gap-1 text-[9px] font-bold text-[#DF0A09]">
            <Check className="h-3 w-3" strokeWidth={3} />
            PDF ready
          </span>
        </div>
      </div>
    </div>
  );
}

function CurrencyVisual() {
  const pairs = ["USD / EUR", "GBP / USD", "JPY / USD", "AUD / USD", "CAD / USD", "CHF / USD"];
  const rates = ["0.9182", "1.2641", "0.0067", "0.6529", "0.7381", "1.1234"];
  const hints = ["-0.04%", "+0.12%", "flat", "+0.02%", "-0.01%", "+0.08%"];
  return (
    <div className="flex h-full w-full items-center justify-center px-2 py-1">
      <div className="w-full max-w-[min(288px,94vw)] overflow-hidden rounded-2xl border border-[#222] bg-gradient-to-b from-[#151515] to-[#0A0A0A] p-3 shadow-xl sm:p-4">
        <div className="flex items-start justify-between gap-3 border-b border-[#222] pb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#DF0A09]">Live rates</p>
            <p className="mt-1 max-w-[180px] text-[11px] leading-snug text-[#666]">Mid-market snapshot · multi-currency compare</p>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full border border-[#2A2A2A] bg-[#111] px-2.5 py-1.5 text-[9px] font-semibold text-[#AAA]">
            <Clock className="h-3.5 w-3.5 text-[#DF0A09]" strokeWidth={2} />
            hourly
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-[#222] bg-[#111] p-2.5 text-center">
            <Coins className="mx-auto h-5 w-5 text-[#DF0A09]" strokeWidth={2} />
            <p className="mt-1.5 text-[11px] font-black text-white">150+</p>
            <p className="text-[8px] font-medium text-[#555]">currencies</p>
          </div>
          <div className="rounded-xl border border-[#222] bg-[#111] p-2.5 text-center">
            <TrendingUp className="mx-auto h-5 w-5 text-emerald-400" strokeWidth={2} />
            <p className="mt-1.5 text-[11px] font-black text-white">FX</p>
            <p className="text-[8px] font-medium text-[#555]">live feed</p>
          </div>
        </div>

        <div className="mt-3 flex max-h-[140px] flex-col gap-1 overflow-y-auto pr-0.5 [scrollbar-width:thin]">
          {pairs.map((pair, i) => (
            <div
              key={pair}
              className="flex items-center justify-between gap-2 rounded-lg border border-[#1A1A1A] bg-[#111] px-2.5 py-2"
            >
              <span className="truncate font-mono text-[11px] text-[#888]">{pair}</span>
              <div className="shrink-0 text-right">
                <span className="font-mono text-[11px] font-bold text-[#eee]">{rates[i]}</span>
                <p className={`text-[8px] font-medium ${hints[i].startsWith("+") ? "text-emerald-600/90" : hints[i].startsWith("-") ? "text-rose-500/80" : "text-[#555]"}`}>
                  {hints[i]}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-2.5 text-center text-[9px] font-medium text-[#444]">Tap a row in the real tool for full history</p>
      </div>
    </div>
  );
}

function BgRemoverVisual() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-2 py-2 sm:flex-row sm:gap-5">
      <div className="relative w-[min(132px,42vw)] shrink-0">
        <span className="absolute -top-1 left-1 z-10 rounded-md bg-[#2A2A2A] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white shadow">
          Before
        </span>
        <div className="mt-3 flex h-[138px] flex-col items-center justify-end overflow-hidden rounded-xl border border-[#D4D4D4] bg-gradient-to-b from-[#E8E8E8] via-[#DDD] to-[#CFCFCF] pb-3 pt-6 shadow-md sm:h-[148px]">
          <div className="h-[72px] w-[58px] rounded-full bg-gradient-to-b from-[#C0C0C0] to-[#9A9A9A] shadow-inner ring-1 ring-black/5" />
          <p className="mt-2 text-center text-[8px] font-medium text-[#666]">Noisy studio bg</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full border border-[#DF0A09]/35 bg-[#DF0A09]/12 px-3 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#DF0A09]" strokeWidth={2} />
          <span className="text-[9px] font-bold text-[#DF0A09]">WASM model</span>
        </div>
        <span className="select-none text-2xl font-black leading-none text-[#DF0A09] rotate-90 sm:rotate-0" aria-hidden>
          →
        </span>
      </div>

      <div className="relative w-[min(132px,42vw)] shrink-0">
        <span className="absolute -top-1 left-1 z-10 rounded-md bg-[#DF0A09] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white shadow">
          After
        </span>
        <div className="checkerboard mt-3 flex h-[138px] flex-col items-center justify-end overflow-hidden rounded-xl border border-[#E0E0E0] bg-white/90 pb-3 pt-6 shadow-md sm:h-[148px]">
          <div className="h-[72px] w-[58px] rounded-full bg-gradient-to-b from-[#BEBEBE] to-[#8E8E8E] shadow-md ring-2 ring-white/90" />
          <p className="mt-2 text-center text-[8px] font-medium text-[#555]">Transparent PNG</p>
        </div>
      </div>
    </div>
  );
}

const visuals: Record<string, React.ReactNode> = {
  compressor: <CompressorVisual />,
  resume: <ResumeVisual />,
  currency: <CurrencyVisual />,
  bgremover: <BgRemoverVisual />,
};

const dots = spotlights.map((_, i) => i);

export default function ToolSpotlight() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  /** Pick the card whose vertical center is closest to the viewport “focus” line (stable with Lenis; avoids racing IntersectionObservers). */
  useLayoutEffect(() => {
    let raf = 0;

    const pickActiveFromScroll = () => {
      const els = itemRefs.current.filter((n): n is HTMLDivElement => n !== null);
      if (els.length === 0) return;

      const focusY = window.innerHeight * 0.42;
      let bestIdx = 0;
      let bestDist = Infinity;

      for (let i = 0; i < els.length; i++) {
        const r = els[i].getBoundingClientRect();
        const midY = r.top + r.height / 2;
        const dist = Math.abs(midY - focusY);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }

      setActive((prev) => (prev === bestIdx ? prev : bestIdx));
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(pickActiveFromScroll);
    };

    pickActiveFromScroll();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  const tool = spotlights[active];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-visible bg-[#0A0A0A]"
      style={{ padding: "clamp(72px, 10vw, 120px) 0" }}
    >
      <div className="container">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start lg:gap-16">
          {/* Mobile: sticky progress + large tap targets */}
          <div className="lg:hidden sticky top-16 z-20 mb-2 rounded-2xl border border-[#1A1A1A] bg-[#111]/95 px-3 py-3 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-[#111]/88">
            <div className="flex items-center justify-between gap-3 px-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#666]">Featured</p>
              <span className="tabular-nums text-[12px] font-bold text-[#888]">
                {active + 1}
                <span className="font-normal text-[#555]"> / </span>
                {spotlights.length}
              </span>
            </div>
            <p className="mt-0.5 px-1 text-[11px] leading-snug text-[#555]">Tap a step or scroll to explore each tool.</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {dots.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    itemRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl active:scale-95 touch-manipulation"
                  aria-label={`Jump to ${spotlights[i].headline}`}
                  aria-current={active === i ? "step" : undefined}
                >
                  <span
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: active === i ? 32 : 10,
                      height: active === i ? 10 : 10,
                      background: active === i ? "#DF0A09" : "#333",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <aside className="hidden lg:flex lg:flex-row lg:items-start lg:gap-6 lg:shrink-0 lg:sticky lg:top-32 lg:z-10 lg:self-start">
            <div className="flex flex-col gap-2 w-4 shrink-0 pt-1">
              {dots.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    itemRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="w-2 rounded-full transition-all duration-300 mx-auto"
                  style={{
                    height: active === i ? 24 : 8,
                    background: active === i ? "#DF0A09" : "#333",
                  }}
                  aria-label={`Go to ${spotlights[i].eyebrow}`}
                  aria-current={active === i ? "true" : undefined}
                />
              ))}
            </div>
            <div className="w-full max-w-[380px] min-w-0 shrink-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-5"
                >
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: "#DF0A09" }}
                  >
                    {tool.eyebrow}
                  </span>
                  <h2
                    style={{
                      fontFamily: "var(--font-jakarta)",
                      fontSize: "clamp(32px, 3vw, 44px)",
                      fontWeight: 900,
                      color: "#fff",
                      letterSpacing: "-0.03em",
                      lineHeight: 1.08,
                    }}
                  >
                    {tool.headline}
                  </h2>
                  <p style={{ fontSize: "15px", color: "#888", lineHeight: 1.65 }}>
                    {tool.desc}
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {tool.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2.5">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" fill="#DF0A09" fillOpacity="0.15" />
                          <path d="M5 8l2 2 4-4" stroke="#DF0A09" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ fontSize: "14px", color: "#aaa" }}>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="inline-flex items-center gap-2 text-[14px] font-bold mt-2"
                    style={{ color: "#DF0A09" }}
                  >
                    Try it free →
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </aside>

          <div className="flex min-w-0 flex-col gap-10 lg:gap-0">
            {spotlights.map((s, i) => (
              <div
                key={s.slug}
                ref={(el) => { itemRefs.current[i] = el; }}
                className="relative w-full lg:min-h-[72vh] lg:flex lg:items-center"
                style={{ scrollMarginTop: "max(7rem, env(safe-area-inset-top, 0px))" }}
              >
                <motion.div
                  initial={{ opacity: 0.75, scale: 0.98, y: 24 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ amount: 0.35, once: false, margin: "-8% 0px -8% 0px" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex w-full flex-col overflow-hidden rounded-3xl border border-[#1A1A1A] shadow-[0_28px_56px_-28px_rgba(0,0,0,0.75)] lg:mx-auto lg:w-fit lg:max-w-full lg:min-h-0 lg:px-8 lg:py-8 xl:px-10"
                  style={{
                    backgroundColor: "#111",
                    backgroundImage: `radial-gradient(ellipse 85% 55% at 90% 12%, rgba(223, 10, 9, 0.11), transparent 52%),
                      radial-gradient(ellipse 70% 45% at 8% 88%, rgba(255, 255, 255, 0.04), transparent 50%),
                      linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 28%, transparent 72%, rgba(0,0,0,0.25) 100%)`,
                  }}
                >
                  <div className="lg:hidden flex w-full flex-col gap-4 px-5 pb-2 pt-6 sm:px-7 sm:pt-8">
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#DF0A09" }}>
                      {s.eyebrow}
                    </span>
                    <h3
                      style={{
                        fontFamily: "var(--font-jakarta)",
                        fontSize: "clamp(1.35rem, 5.5vw, 1.75rem)",
                        fontWeight: 900,
                        color: "#fff",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.12,
                      }}
                    >
                      {s.headline}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-[#9a9a9a]">{s.desc}</p>
                    <ul className="flex flex-col gap-3 pt-1">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex gap-3">
                          <span className="mt-0.5 shrink-0">
                            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
                              <circle cx="8" cy="8" r="7" fill="#DF0A09" fillOpacity="0.18" />
                              <path d="M5 8l2 2 4-4" stroke="#DF0A09" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span className="text-[14px] leading-snug text-[#b5b5b5]">{b}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/tools/${s.slug}`}
                      className="mt-2 inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#DF0A09] px-4 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-[#DF0A09]/25 transition-transform active:scale-[0.98] touch-manipulation"
                    >
                      Try it free →
                    </Link>
                  </div>
                  <div className="relative z-[1] flex min-h-[200px] flex-1 items-center justify-center px-3 pb-8 pt-3 sm:min-h-[220px] lg:min-h-0 lg:flex-none lg:px-2 lg:pb-0 lg:pt-0">
                    {visuals[s.visual]}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
