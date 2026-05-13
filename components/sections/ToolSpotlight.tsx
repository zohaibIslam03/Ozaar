"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[280px] h-[160px] rounded-2xl overflow-hidden border border-[#E8E8E8] shadow-lg relative">
        <div className="absolute inset-0 flex">
          <div className="flex-1 bg-[#EEF2FF] flex items-center justify-center flex-col gap-1">
            <p className="text-[11px] font-bold text-[#6366F1]">Original</p>
            <p className="text-[18px] font-black text-[#4338CA]">4.2 MB</p>
          </div>
          <div className="w-[2px] bg-[#DF0A09] relative z-10" />
          <div className="flex-1 bg-[#F5F5F5] flex items-center justify-center flex-col gap-1">
            <p className="text-[11px] font-bold text-[#DF0A09]">Compressed</p>
            <p className="text-[18px] font-black text-[#DF0A09]">380 KB</p>
          </div>
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#DF0A09] text-white text-[10px] font-bold px-3 py-1 rounded-full">
          −91% smaller
        </div>
      </div>
    </div>
  );
}

function ResumeVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[200px] h-[260px] bg-white rounded-xl border border-[#E8E8E8] shadow-lg p-4 flex flex-col gap-2">
        <div className="w-full h-12 bg-[#DF0A09] rounded-lg flex items-center px-3 gap-2">
          <div className="w-7 h-7 rounded-full bg-white/30" />
          <div className="flex flex-col gap-1">
            <div className="h-2 w-16 bg-white/80 rounded-full" />
            <div className="h-1.5 w-10 bg-white/50 rounded-full" />
          </div>
        </div>
        {["Experience", "Education", "Skills"].map((s) => (
          <div key={s} className="flex flex-col gap-1">
            <p className="text-[8px] font-bold text-[#DF0A09] uppercase tracking-wide">{s}</p>
            <div className="h-1.5 bg-[#F0F0F0] rounded-full w-full" />
            <div className="h-1.5 bg-[#F0F0F0] rounded-full w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CurrencyVisual() {
  const pairs = ["USD / EUR", "GBP / USD", "JPY / USD", "AUD / USD", "CAD / USD", "CHF / USD"];
  const rates = ["0.9182", "1.2641", "0.0067", "0.6529", "0.7381", "1.1234"];
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[260px] bg-[#0A0A0A] rounded-2xl p-4 shadow-xl">
        <p className="text-[10px] font-bold text-[#DF0A09] uppercase tracking-widest mb-3">Live Rates</p>
        <div className="flex flex-col gap-1.5">
          {pairs.map((pair, i) => (
            <div key={pair} className="flex items-center justify-between">
              <span className="text-[11px] text-[#888] font-mono">{pair}</span>
              <span className="text-[11px] text-[#eee] font-mono font-bold">{rates[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BgRemoverVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center gap-3">
      <div className="w-[120px] h-[140px] rounded-xl overflow-hidden border border-[#E8E8E8] shadow">
        <div className="w-full h-full bg-[#E8E8E8] flex items-end justify-center pb-2">
          <div className="w-12 h-20 rounded-full bg-[#BBBBBB]" />
        </div>
      </div>
      <div className="text-[#DF0A09] font-bold text-lg">→</div>
      <div className="w-[120px] h-[140px] rounded-xl overflow-hidden border border-[#E8E8E8] shadow checkerboard flex items-end justify-center pb-2">
        <div className="w-12 h-20 rounded-full bg-[#BBBBBB]" />
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

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
        },
        {
          rootMargin: "-42% 0px -42% 0px",
          threshold: 0,
        }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const tool = spotlights[active];

  return (
    <section ref={sectionRef} className="relative bg-[#0A0A0A]" style={{ padding: "clamp(72px, 10vw, 120px) 0" }}>
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          {/* Sticky left panel */}
          <div className="hidden lg:flex flex-col gap-2 w-4 shrink-0 sticky top-32 self-start">
            {dots.map((i) => (
              <button
                key={i}
                onClick={() => {
                  itemRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className="w-2 rounded-full transition-all duration-300 mx-auto"
                style={{
                  height: active === i ? 24 : 8,
                  background: active === i ? "#DF0A09" : "#333",
                }}
                aria-label={`Go to ${spotlights[i].eyebrow}`}
              />
            ))}
          </div>

          {/* Sticky content left */}
          <div className="hidden lg:block w-[380px] shrink-0 sticky top-32 self-start">
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

          {/* Scrollable items */}
          <div className="flex-1 flex flex-col gap-8 lg:gap-0">
            {spotlights.map((s, i) => (
              <div
                key={s.slug}
                ref={(el) => { itemRefs.current[i] = el; }}
                className="relative w-full lg:min-h-[72vh] lg:flex lg:items-center"
                style={{ scrollMarginTop: 120 }}
              >
                <motion.div
                  initial={{ opacity: 0.72, scale: 0.97, y: 36 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ amount: 0.5, once: false, margin: "-12% 0px -12% 0px" }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="min-h-[320px] lg:h-[360px] w-full rounded-3xl border border-[#1A1A1A] bg-[#111] flex items-center justify-center relative overflow-hidden"
                >
                  {/* Mobile: show content inline */}
                  <div className="lg:hidden flex flex-col gap-4 p-5 sm:p-8 w-full">
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#DF0A09" }}>
                      {s.eyebrow}
                    </span>
                    <h3 style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(24px, 7vw, 28px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>
                      {s.headline}
                    </h3>
                    <p style={{ fontSize: "14px", color: "#888" }}>{s.desc}</p>
                  </div>
                  <div className="w-full h-[260px] sm:h-[320px] flex items-center justify-center overflow-hidden">
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
