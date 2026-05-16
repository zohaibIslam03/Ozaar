"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { stagger, fadeUp, slideLeft, slideRight } from "@/lib/animations";

// ── Browser Window Mockup Component ──────────────────────────────────────────

interface BrowserWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

function BrowserWindow({ title, children, className = "", style, delay = 0 }: BrowserWindowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-white rounded-2xl border border-[#E8E8E8] shadow-[0_8px_40px_rgba(0,0,0,0.10)] overflow-hidden ${className}`}
      style={style}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#F0F0F0] bg-[#FAFAFA]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <div className="flex-1 mx-3 bg-[#EFEFEF] rounded-full h-5 flex items-center px-3">
          <span className="text-[10px] text-[#999] truncate">{title}</span>
        </div>
      </div>
      {/* Content */}
      <div className="p-4">{children}</div>
    </motion.div>
  );
}

// ── Per-tool mockup content ───────────────────────────────────────────────────

function ImageCompressorMockup() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 bg-[#F7F7F7] rounded-lg p-3">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="6" fill="#E8E8E8"/>
          <path d="M7 20l5-6 3 4 2-2 4 4H7z" fill="#93C5FD"/>
          <circle cx="20" cy="10" r="2.5" fill="#60A5FA"/>
        </svg>
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-[#111]">photo.jpg</p>
          <p className="text-[10px] text-[#999]">4.2 MB → 380 KB</p>
        </div>
        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">−91%</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[["Original", "4.2 MB"], ["Compressed", "380 KB"]].map(([label, size]) => (
          <div key={label} className="bg-[#F7F7F7] rounded-lg p-2 text-center">
            <p className="text-[11px] font-bold text-[#111]">{size}</p>
            <p className="text-[10px] text-[#999]">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QrMockup() {
  return (
    <div className="flex items-center gap-3">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect width="64" height="64" rx="4" fill="#111"/>
        {[0,1,2,4,5,6].map(x => <rect key={`tl-${x}`} x={4+x*4} y={4} width="3" height="3" fill="#fff" rx="0.5"/>)}
        {[0,6].map(x => [1,2,3,4,5].map(y => <rect key={`tls-${x}-${y}`} x={4+x*4} y={4+y*4} width="3" height="3" fill="#fff" rx="0.5"/>))}
        {[1,2,3,4,5].map(x => <rect key={`tlb-${x}`} x={4+x*4} y={28} width="3" height="3" fill="#fff" rx="0.5"/>)}
        <rect x="12" y="12" width="11" height="11" rx="2" fill="#fff"/>
        {[32,36,40,44,48,52].map(x => [32,36,40,44,48].map(y => (x+y)%10===0 ? <rect key={`d-${x}-${y}`} x={x} y={y} width="3" height="3" fill="#fff" rx="0.5"/> : null))}
        {[0,1,2,4,5,6].map(x => <rect key={`bl-${x}`} x={4+x*4} y={36} width="3" height="3" fill="#fff" rx="0.5"/>)}
        {[0,6].map(x => [1,2,3,4,5].map(y => <rect key={`bls-${x}-${y}`} x={4+x*4} y={36+y*4} width="3" height="3" fill="#fff" rx="0.5"/>))}
        {[0,1,2,4,5,6].map(x => <rect key={`blb-${x}`} x={4+x*4} y={60} width="3" height="3" fill="#fff" rx="0.5"/>)}
        <rect x="12" y="44" width="11" height="11" rx="2" fill="#fff"/>
      </svg>
      <div className="flex flex-col gap-1.5 flex-1">
        <p className="text-[11px] font-semibold text-[#111]">QR Generated</p>
        <p className="text-[10px] text-[#999] break-all">ozaar.theinnovations.tech</p>
        <div className="flex gap-1.5 mt-1">
          <span className="text-[9px] bg-[#DF0A09]/10 text-[#DF0A09] font-semibold px-2 py-0.5 rounded-full">PNG</span>
          <span className="text-[9px] bg-[#F7F7F7] text-[#666] font-semibold px-2 py-0.5 rounded-full">SVG</span>
        </div>
      </div>
    </div>
  );
}

function ResumeBuilderMockup() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-full bg-[#DF0A09]/10 flex items-center justify-center">
          <span className="text-[10px] font-bold text-[#DF0A09]">JD</span>
        </div>
        <div>
          <p className="text-[11px] font-bold text-[#111]">Jane Doe</p>
          <p className="text-[10px] text-[#999]">Product Designer</p>
        </div>
      </div>
      {["Experience", "Education", "Skills"].map((section) => (
        <div key={section} className="flex flex-col gap-1">
          <p className="text-[9px] font-bold text-[#DF0A09] uppercase tracking-wide">{section}</p>
          <div className="h-1.5 bg-[#F0F0F0] rounded-full w-full" />
          <div className="h-1.5 bg-[#F0F0F0] rounded-full w-3/4" />
        </div>
      ))}
    </div>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────

export default function HeroSection() {
  const { scrollY } = useScroll();

  // Parallax transforms
  const bgY = useTransform(scrollY, [0, 200], [0, -60]);
  const headingY = useTransform(scrollY, [0, 200], [0, -20]);
  const windowsY = useTransform(scrollY, [0, 200], [0, 30]);

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-white pt-[72px]">
      {/* Parallax grid-line background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#E8E8E8 1px, transparent 1px), linear-gradient(90deg, #E8E8E8 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.5,
          y: bgY,
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,0,0,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="container relative z-10 py-14 sm:py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left column, text */}
          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6 sm:gap-7"
            style={{ y: headingY }}
          >
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-border text-xs text-brand-muted bg-white shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                12 free tools · No signup · No ads
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div variants={fadeUp} className="flex flex-col gap-2">
              <h1
                className="font-heading leading-[1.05] tracking-tight text-brand-text"
                  style={{ fontSize: "clamp(34px, 11vw, 72px)", fontWeight: 900 }}
              >
                Every tool you need,
              </h1>
              <h1
                className="font-heading leading-[1.05] tracking-tight text-brand-red"
                  style={{ fontSize: "clamp(34px, 11vw, 72px)", fontWeight: 900 }}
              >
                completely free.
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.p
              variants={fadeUp}
              className="text-[15px] sm:text-[17px] text-brand-muted leading-relaxed max-w-[480px]"
            >
              Compress images, build resumes, convert currencies, generate QR codes, all in your browser. No account. No data sent anywhere.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col min-[420px]:flex-row flex-wrap items-stretch min-[420px]:items-center gap-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/#tools"
                  className="inline-flex w-full min-[420px]:w-auto items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-brand-red text-white text-[15px] font-semibold hover:bg-brand-redDark transition-colors duration-200 shadow-[0_4px_16px_rgba(223,10,9,0.3)]"
                >
                  Explore all tools
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M2.5 7h9M8.5 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <a
                  href="https://github.com/zohaibIslam03/Ozaar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full min-[420px]:w-auto items-center justify-center gap-2 px-7 py-3.5 rounded-full border-[1.5px] border-brand-border text-brand-text text-[15px] font-semibold hover:border-brand-text/40 hover:bg-[#F7F7F7] transition-all duration-200"
                >
                  View on GitHub
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M4 10L10 4M10 4H5M10 4v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-5 pt-2">
              {[["12", "Tools"], ["0", "Signups needed"], ["100%", "Browser-based"]].map(([n, l]) => (
                <div key={l} className="flex flex-col gap-0.5">
                  <span className="font-heading font-bold text-brand-text text-lg leading-none">{n}</span>
                  <span className="text-[11px] text-brand-muted">{l}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column, floating browser windows */}
          <motion.div
            className="relative hidden lg:flex items-center justify-center h-[480px]"
            style={{ y: windowsY }}
          >
            {/* Main window, Image Compressor */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute left-0 top-8 w-[240px] z-10"
            >
              <BrowserWindow title="ozaar.theinnovations.tech/tools/image-compressor" delay={0.1}>
                <ImageCompressorMockup />
              </BrowserWindow>
            </motion.div>

            {/* Center window, Resume Builder */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
              className="absolute left-1/2 -translate-x-1/2 top-0 w-[220px] z-20"
            >
              <BrowserWindow title="ozaar.theinnovations.tech/tools/resume-builder" delay={0.25}>
                <ResumeBuilderMockup />
              </BrowserWindow>
            </motion.div>

            {/* Right window, QR Generator */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
              className="absolute right-0 bottom-16 w-[200px] z-10"
            >
              <BrowserWindow title="ozaar.theinnovations.tech/tools/qr-generator" delay={0.4}>
                <QrMockup />
              </BrowserWindow>
            </motion.div>

            {/* Decorative blur blob */}
            <div className="absolute w-64 h-64 rounded-full bg-brand-red/5 blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-brand-muted/40"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      >
        <div className="w-[1px] h-8 bg-gradient-to-b from-transparent to-brand-muted/30" />
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}
