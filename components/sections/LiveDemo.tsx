"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "compressor" | "qr" | "password";

function fullToolHref(tab: Tab): string {
  if (tab === "compressor") return "/tools/image-compressor";
  if (tab === "qr") return "/tools/qr-generator";
  return "/tools/password-generator";
}

function ImgIcon({ color = "#555" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="12" rx="2" stroke={color} strokeWidth="1.5"/>
      <circle cx="7" cy="9" r="1.5" fill={color}/>
      <path d="M2 14l4.5-4.5 3 3 2.5-2 6 5" stroke={color} strokeWidth="1.3" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function QrIcon({ color = "#555" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5"/>
      <rect x="4" y="4" width="3" height="3" fill={color}/>
      <rect x="11" y="2" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5"/>
      <rect x="13" y="4" width="3" height="3" fill={color}/>
      <rect x="2" y="11" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5"/>
      <rect x="4" y="13" width="3" height="3" fill={color}/>
      <rect x="11" y="11" width="3" height="3" fill={color}/>
      <rect x="16" y="11" width="2" height="2" fill={color}/>
      <rect x="11" y="16" width="2" height="2" fill={color}/>
      <rect x="15" y="15" width="3" height="3" fill={color} opacity="0.7"/>
    </svg>
  );
}

function LockIcon({ color = "#555" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="4" y="9" width="12" height="9" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M7 9V6.5a3 3 0 016 0V9" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="13.5" r="1.5" fill={color}/>
    </svg>
  );
}

function PhotoBigIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="4" y="8" width="32" height="24" rx="4" stroke="#444" strokeWidth="1.5"/>
      <circle cx="13" cy="16" r="3" fill="#444"/>
      <path d="M4 26l8-8 6 6 4-4 14 10" stroke="#444" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

const TOOLS = [
  { id: "compressor" as Tab, name: "Image Compressor", desc: "Shrink images up to 90%" },
  { id: "qr" as Tab, name: "QR Generator", desc: "Any URL to a QR code" },
  { id: "password" as Tab, name: "Password Generator", desc: "Crypto-secure passwords" },
];

const TOOL_DESCS: Record<Tab, string> = {
  compressor: "Compress JPEG, PNG & WebP images without losing quality. Fully in-browser.",
  qr: "Generate a QR code from any URL, text, or contact — downloadable as PNG or SVG.",
  password: "Generate cryptographically secure passwords. Customizable length and character sets.",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function charColor(ch: string): string {
  if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(ch)) return "#fff";
  if ("0123456789".includes(ch)) return "#60A5FA";
  if ("abcdefghijklmnopqrstuvwxyz".includes(ch)) return "#777";
  return "#DF0A09";
}

function genPassword(len: number, upper: boolean, nums: boolean, syms: boolean): string {
  if (typeof window === "undefined") return "K$9mPx#2vRqN7!e";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numset = "0123456789";
  const symset = "!@#$%^&*_+-=";
  let pool = lower;
  if (upper) pool += uppers;
  if (nums) pool += numset;
  if (syms) pool += symset;
  const bytes = new Uint8Array(len);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => pool[b % pool.length])
    .join("");
}

function getStrength(len: number): string {
  if (len < 8) return "Weak";
  if (len < 12) return "Fair";
  if (len < 16) return "Strong";
  return "Very Strong";
}

// ── Compressor Panel ──────────────────────────────────────────────────────

function CompressorPanel() {
  const [quality, setQuality] = useState(80);
  const [downloading, setDownloading] = useState(false);
  const originalMB = 4.2;
  const compressedMB = +(originalMB * Math.max(0.04, 1 - quality * 0.0095 - 0.04)).toFixed(1);
  const reduction = Math.round((1 - compressedMB / originalMB) * 100);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 1800);
  };

  const boxStyle = { background: "#1A1A1A", border: "1px solid #222", borderRadius: 14 } as const;

  return (
    <div className="flex flex-col gap-5">
      {/* Mobile: stacked panels + desktop: side‑by‑side */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-3">
        <div className="flex-1 px-4 py-4 sm:px-5 sm:py-5" style={boxStyle}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
            Original
          </p>
          <div
            className="flex h-[92px] items-center justify-center sm:h-[120px]"
            style={{ background: "#222", borderRadius: 10 }}
          >
            <PhotoBigIcon />
          </div>
          <p
            className="mt-3 text-[clamp(1.35rem,7vw,1.75rem)] leading-none"
            style={{ fontFamily: "var(--font-jakarta)", fontWeight: 900, color: "#fff" }}
          >
            {originalMB} MB
          </p>
          <p style={{ fontSize: 12, color: "#444", marginTop: 4 }}>PNG · Original</p>
        </div>

        <div className="flex shrink-0 flex-row items-center justify-center gap-3 py-1 sm:flex-col sm:px-2 sm:py-0">
          <span className="select-none text-[22px] font-black leading-none text-[#DF0A09] rotate-90 sm:rotate-0" aria-hidden>
            →
          </span>
          <motion.span
            key={reduction}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-extrabold text-white sm:text-[12px]"
            style={{ background: "#DF0A09" }}
          >
            {reduction}% off
          </motion.span>
        </div>

        <div className="flex-1 px-4 py-4 sm:px-5 sm:py-5" style={boxStyle}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
            Compressed
          </p>
          <div
            className="flex h-[92px] items-center justify-center sm:h-[120px]"
            style={{ background: "#2A2A2A", borderRadius: 10 }}
          >
            <PhotoBigIcon />
          </div>
          <motion.p
            key={compressedMB}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-[clamp(1.35rem,7vw,1.75rem)] leading-none"
            style={{ fontFamily: "var(--font-jakarta)", fontWeight: 900, color: "#DF0A09" }}
          >
            {compressedMB} MB
          </motion.p>
          <p style={{ fontSize: 12, color: "#444", marginTop: 4 }}>WebP · Compressed</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <span className="shrink-0 text-[13px] text-[#555]">Quality</span>
        <div className="flex min-h-[44px] flex-1 items-center gap-3">
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="h-11 w-full flex-1 cursor-pointer touch-manipulation accent-[#DF0A09]"
            style={{ accentColor: "#DF0A09" }}
            aria-valuemin={10}
            aria-valuemax={100}
            aria-valuenow={quality}
            aria-label="Compression quality"
          />
          <span className="w-11 shrink-0 text-right text-sm font-bold text-white tabular-nums">{quality}%</span>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={handleDownload}
        whileHover={{ backgroundColor: "#B30807", y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className="min-h-[52px] w-full touch-manipulation rounded-xl px-4 py-3.5 text-[15px] font-bold text-white transition-colors"
        style={{
          background: downloading ? "#22c55e" : "#DF0A09",
          border: "none",
          cursor: "pointer",
        }}
      >
        {downloading ? "✓ Downloaded!" : "Download Compressed Image"}
      </motion.button>
    </div>
  );
}

// ── QR Panel ──────────────────────────────────────────────────────────────

function QrPanel() {
  const [url, setUrl] = useState("https://ozaar.theinnovations.tech");
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL or text…"
        className="min-h-[52px] w-full touch-manipulation rounded-xl px-4 py-3.5 text-[15px] text-white outline-none"
        style={{
          background: "#1A1A1A",
          border: "1px solid #333",
        }}
      />

      <div className="flex justify-center px-1">
        <div className="inline-block rounded-2xl bg-white p-4 sm:p-6">
          <svg className="h-auto w-[min(140px,72vw)]" viewBox="0 0 80 80" fill="none" aria-hidden>
            <rect x="5" y="5" width="22" height="22" rx="3" fill="#111"/>
            <rect x="9" y="9" width="14" height="14" rx="1.5" fill="white"/>
            <rect x="12" y="12" width="8" height="8" rx="1" fill="#111"/>
            <rect x="53" y="5" width="22" height="22" rx="3" fill="#111"/>
            <rect x="57" y="9" width="14" height="14" rx="1.5" fill="white"/>
            <rect x="60" y="12" width="8" height="8" rx="1" fill="#111"/>
            <rect x="5" y="53" width="22" height="22" rx="3" fill="#111"/>
            <rect x="9" y="57" width="14" height="14" rx="1.5" fill="white"/>
            <rect x="12" y="60" width="8" height="8" rx="1" fill="#111"/>
            {/* finder corners in red */}
            <rect x="5" y="5" width="4" height="4" rx="1" fill="#DF0A09"/>
            <rect x="23" y="5" width="4" height="4" rx="1" fill="#DF0A09"/>
            <rect x="5" y="23" width="4" height="4" rx="1" fill="#DF0A09"/>
            <rect x="53" y="5" width="4" height="4" rx="1" fill="#DF0A09"/>
            {[32,36,40,44,48,52,56,60,64,68,72].map(x =>
              [32,36,40,44,48,52,56,60,64,68,72].map(y =>
                (x * 3 + y * 7) % 11 > 4
                  ? <rect key={`${x}-${y}`} x={x} y={y} width="3.5" height="3.5" rx="0.5" fill="#111"/>
                  : null
              )
            )}
          </svg>
        </div>
      </div>

      <p className="text-center text-[13px] text-[#555]">Scan to test ↑</p>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="min-h-[48px] touch-manipulation rounded-xl py-3.5 text-[14px] font-bold text-white"
          style={{
            background: "#DF0A09",
            border: "none",
            cursor: "pointer",
          }}
        >
          {copied ? "✓ Copied!" : "Download PNG"}
        </button>
        <button
          type="button"
          className="min-h-[48px] touch-manipulation rounded-xl py-3.5 text-[14px] font-bold text-white"
          style={{
            background: "#DF0A09",
            border: "none",
            cursor: "pointer",
          }}
        >
          Download SVG
        </button>
      </div>
    </div>
  );
}

// ── Password Panel ─────────────────────────────────────────────────────────

const ARC_R = 72;
const HALF_CIRC = Math.PI * ARC_R;

function StrengthArc({ strength }: { strength: string }) {
  const pct = strength === "Weak" ? 0.2 : strength === "Fair" ? 0.45 : strength === "Strong" ? 0.72 : 1;
  const offset = HALF_CIRC * (1 - pct);

  return (
    <div className="relative mx-auto h-[100px] w-full max-w-[180px]">
      <svg className="h-full w-full" viewBox="0 0 180 100" aria-hidden>
        <path d={`M 18 92 A ${ARC_R} ${ARC_R} 0 0 1 162 92`} fill="none" stroke="#222" strokeWidth="10" strokeLinecap="round"/>
        <motion.path
          d={`M 18 92 A ${ARC_R} ${ARC_R} 0 0 1 162 92`}
          fill="none"
          stroke="#DF0A09"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={HALF_CIRC}
          initial={{ strokeDashoffset: HALF_CIRC }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div style={{ position: "absolute", bottom: 0, width: "100%", textAlign: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{strength}</span>
      </div>
    </div>
  );
}

function PasswordPanel() {
  const [length, setLength] = useState(14);
  const [useUpper, setUseUpper] = useState(true);
  const [useNums, setUseNums] = useState(true);
  const [useSyms, setUseSyms] = useState(true);
  const [password, setPassword] = useState(() => genPassword(14, true, true, true));
  const [copied, setCopied] = useState(false);

  const regenerate = useCallback(() => {
    setPassword(genPassword(length, useUpper, useNums, useSyms));
  }, [length, useUpper, useNums, useSyms]);

  const strength = getStrength(length);

  const handleCopy = () => {
    navigator.clipboard?.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Password display */}
      <div className="relative rounded-2xl border border-[#222] bg-[#111] p-4 sm:p-5">
        <p
          className="pr-24 font-mono text-[clamp(13px,3.8vw,18px)] leading-relaxed tracking-wide [word-break:break-all] sm:pr-28"
        >
          {password.slice(0, length).split("").map((ch, i) => (
            <span key={i} style={{ color: charColor(ch) }}>{ch}</span>
          ))}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-3 top-3 min-h-[44px] min-w-[44px] touch-manipulation rounded-lg px-3 text-xs font-bold text-white sm:right-4 sm:top-4"
          style={{
            background: copied ? "#22c55e" : "#222",
            border: "none",
            cursor: "pointer",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Strength arc */}
      <StrengthArc strength={strength} />

      {/* Length slider */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs">
          <span style={{ color: "#555" }}>Length: {length} characters</span>
          <span style={{ color: "#DF0A09", fontWeight: 700 }}>{strength}</span>
        </div>
        <input
          type="range"
          min={6}
          max={32}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="h-11 w-full touch-manipulation"
          style={{ accentColor: "#DF0A09" }}
          aria-label="Password length"
        />
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Uppercase", val: useUpper, set: setUseUpper },
          { label: "Numbers", val: useNums, set: setUseNums },
          { label: "Symbols", val: useSyms, set: setUseSyms },
        ].map(({ label, val, set }) => (
          <button
            key={label}
            type="button"
            onClick={() => set(!val)}
            className="flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold touch-manipulation"
            style={{
              background: val ? "#DF0A09" : "#1A1A1A",
              color: val ? "#fff" : "#555",
              border: `1px solid ${val ? "#DF0A09" : "#2A2A2A"}`,
              cursor: "pointer",
            }}
          >
            {val && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
            {label}
          </button>
        ))}
      </div>

      {/* Generate */}
      <motion.button
        type="button"
        onClick={regenerate}
        whileHover={{ backgroundColor: "#B30807", y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="min-h-[52px] w-full touch-manipulation rounded-xl py-3.5 text-[15px] font-bold text-white"
        style={{
          background: "#DF0A09",
          border: "none",
          cursor: "pointer",
        }}
      >
        Generate New Password
      </motion.button>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

function ToolIcon({ id, active }: { id: Tab; active: boolean }) {
  const color = active ? "#fff" : "#555";
  if (id === "compressor") return <ImgIcon color={color} />;
  if (id === "qr") return <QrIcon color={color} />;
  return <LockIcon color={color} />;
}

function PanelBody({ active }: { active: Tab }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={active}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {active === "compressor" && <CompressorPanel />}
        {active === "qr" && <QrPanel />}
        {active === "password" && <PasswordPanel />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function LiveDemo() {
  const [active, setActive] = useState<Tab>("compressor");

  return (
    <section style={{ background: "#0A0A0A" }}>
      {/* ── Mobile layout ── */}
      <div className="lg:hidden pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <header className="px-4 pb-5 pt-10 sm:px-5 sm:pt-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#DF0A09]">Try it live</p>
          <h2 className="mt-2 font-heading text-[clamp(1.35rem,5vw,1.75rem)] font-black leading-tight tracking-tight text-white">
            Interact with the tools.
          </h2>
          <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-[#666]">
            No signup — these previews run in your browser. Pick a tab, try the controls, then open the full tool when you want more.
          </p>
        </header>

        <div
          role="tablist"
          aria-label="Choose a demo"
          className="flex snap-x snap-mandatory gap-1 overflow-x-auto border-b border-[#1E1E1E] bg-[#111] px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:px-3"
        >
          {TOOLS.map((t) => {
            const isOn = active === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={isOn}
                onClick={() => setActive(t.id)}
                className={`min-h-[52px] shrink-0 snap-start touch-manipulation rounded-t-lg px-4 py-3.5 text-left text-[13px] font-bold transition-colors sm:min-h-[56px] sm:px-6 ${
                  isOn ? "text-[#DF0A09]" : "text-[#555] active:bg-[#161616]"
                }`}
                style={{
                  borderBottom: isOn ? "2px solid #DF0A09" : "2px solid transparent",
                  background: "transparent",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {t.name}
              </button>
            );
          })}
        </div>

        <div className="px-4 py-8 sm:px-5 sm:py-10">
          <div className="rounded-[22px] border border-[#222] bg-[#161616] p-5 shadow-[0_28px_56px_-32px_rgba(0,0,0,0.75)] sm:p-7">
            <PanelBody active={active} />
          </div>
          <Link
            href={fullToolHref(active)}
            className="mt-5 flex min-h-[52px] w-full items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#141414] text-[15px] font-bold text-white transition-colors active:bg-[#1a1a1a] touch-manipulation"
          >
            Open full tool →
          </Link>
          <p className="mt-3 text-center text-[12px] leading-snug text-[#444]">
            Full tools add batch actions, exports, and anything you need for real workflows.
          </p>
        </div>
      </div>

      {/* ── Desktop layout ── */}
      <div
        className="hidden lg:grid"
        style={{ gridTemplateColumns: "380px 1fr", minHeight: "100vh" }}
      >
        {/* Sidebar */}
        <aside
          style={{
            background: "#111111",
            borderRight: "1px solid #1E1E1E",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            padding: "56px 36px",
          }}
        >
          {/* Header */}
          <p style={{ fontSize: 11, fontWeight: 700, color: "#DF0A09", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
            Try it live
          </p>
          <h2
            style={{
              fontFamily: "var(--font-jakarta)",
              fontSize: 28, fontWeight: 900, color: "#fff",
              lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 8,
            }}
          >
            Interact with the tools.
          </h2>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 24 }}>
            No signup. Everything runs in your browser.
          </p>

          {/* Tool list */}
          <div className="flex flex-col gap-3">
            {TOOLS.map((t) => {
              const isActive = active === t.id;
              return (
                <motion.button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  whileHover={!isActive ? { borderColor: "#2A2A2A", backgroundColor: "#161616" } : {}}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "16px 20px", borderRadius: 12,
                    border: `1px solid ${isActive ? "#DF0A09" : "transparent"}`,
                    background: isActive ? "#1A1A1A" : "transparent",
                    cursor: "pointer", textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      background: isActive ? "#DF0A09" : "#1A1A1A",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <ToolIcon id={t.id} active={isActive} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: isActive ? "#fff" : "#444" }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: isActive ? "#888" : "#333", marginTop: 2 }}>{t.desc}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Bottom badge */}
          <div style={{ marginTop: "auto", paddingTop: 40 }}>
            <div
              style={{
                background: "#0D2818", border: "1px solid #1A4A2A", borderRadius: 8,
                padding: "10px 14px", display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <span
                style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#4ADE80",
                  flexShrink: 0, animation: "pulse 1.5s infinite",
                }}
              />
              <span style={{ color: "#4ADE80", fontSize: 12 }}>All tools run in your browser</span>
            </div>
          </div>
        </aside>

        {/* Demo panel area */}
        <div
          style={{
            background: "#0A0A0A",
            padding: "clamp(64px, 7vw, 80px) clamp(40px, 5vw, 60px)",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
            minHeight: "100vh",
          }}
        >
          {/* Panel header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active + "-hdr"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32, width: "100%", maxWidth: 680 }}
            >
              <div
                style={{
                  width: 52, height: 52, borderRadius: 12, background: "#DF0A09",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <ToolIcon id={active} active={true} />
              </div>
              <div>
                <p style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>
                  {TOOLS.find((t) => t.id === active)?.name}
                </p>
                <p style={{ fontSize: 13, color: "#555", marginTop: 2 }}>{TOOL_DESCS[active]}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Panel body */}
          <div
            style={{
              background: "#161616", border: "1px solid #222", borderRadius: 20,
              padding: 36, width: "100%", maxWidth: 680,
            }}
          >
            <PanelBody active={active} />
          </div>

          {/* Open full tool link */}
          <Link
            href={fullToolHref(active)}
            className="mt-5 inline-flex w-full max-w-[680px] items-center gap-2 text-[13px] text-[#888] transition-colors hover:text-white"
          >
            Open full tool →
          </Link>
        </div>
      </div>
    </section>
  );
}
