"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "compressor" | "qr" | "password";

// ── SVG Icons ──────────────────────────────────────────────────────────────

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

  return (
    <div className="flex flex-col gap-5">
      {/* Two boxes + arrow */}
      <div className="flex items-center gap-3">
        {/* Original */}
        <div className="flex-1" style={{ background: "#1A1A1A", border: "1px solid #222", borderRadius: 14, padding: 20 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            Original
          </p>
          <div style={{ height: 120, background: "#222", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PhotoBigIcon />
          </div>
          <p style={{ fontFamily: "var(--font-jakarta)", fontSize: 28, fontWeight: 900, color: "#fff", marginTop: 12 }}>
            {originalMB} MB
          </p>
          <p style={{ fontSize: 12, color: "#444", marginTop: 2 }}>PNG · Original</p>
        </div>

        {/* Center arrow */}
        <div className="flex flex-col items-center gap-2 shrink-0" style={{ padding: "0 8px" }}>
          <span style={{ fontSize: 22, color: "#DF0A09", fontWeight: 900 }}>→</span>
          <motion.span
            key={reduction}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "#DF0A09", color: "#fff", fontSize: 12, fontWeight: 800,
              padding: "5px 12px", borderRadius: 999,
            }}
          >
            {reduction}% off
          </motion.span>
        </div>

        {/* Compressed */}
        <div className="flex-1" style={{ background: "#1A1A1A", border: "1px solid #222", borderRadius: 14, padding: 20 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            Compressed
          </p>
          <div style={{ height: 120, background: "#2A2A2A", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PhotoBigIcon />
          </div>
          <motion.p
            key={compressedMB}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            style={{ fontFamily: "var(--font-jakarta)", fontSize: 28, fontWeight: 900, color: "#DF0A09", marginTop: 12 }}
          >
            {compressedMB} MB
          </motion.p>
          <p style={{ fontSize: 12, color: "#444", marginTop: 2 }}>WebP · Compressed</p>
        </div>
      </div>

      {/* Quality slider */}
      <div className="flex items-center gap-4">
        <span style={{ fontSize: 13, color: "#555", flexShrink: 0 }}>Quality</span>
        <input
          type="range" min={10} max={100} value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="flex-1 accent-[#DF0A09]"
          style={{ accentColor: "#DF0A09" }}
        />
        <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", minWidth: 36, textAlign: "right" }}>{quality}%</span>
      </div>

      {/* Download */}
      <motion.button
        onClick={handleDownload}
        whileHover={{ backgroundColor: "#B30807", y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15 }}
        style={{
          width: "100%", background: downloading ? "#22c55e" : "#DF0A09",
          color: "#fff", border: "none", borderRadius: 12,
          padding: "15px", fontSize: 15, fontWeight: 700, cursor: "pointer",
          transition: "background 0.3s",
        }}
      >
        {downloading ? "✓ Downloaded!" : "Download Compressed Image"}
      </motion.button>
    </div>
  );
}

// ── QR Panel ──────────────────────────────────────────────────────────────

function QrPanel() {
  const [url, setUrl] = useState("https://tools.theinnovations.tech");
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL or text…"
        style={{
          width: "100%", background: "#1A1A1A", border: "1px solid #333",
          borderRadius: 12, padding: "14px 18px", fontSize: 14,
          color: "#fff", outline: "none",
        }}
      />

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, display: "inline-block" }}>
          <svg width="140" height="140" viewBox="0 0 80 80" fill="none">
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

      <p style={{ fontSize: 13, color: "#555", textAlign: "center" }}>Scan to test ↑</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: 10 }}>
        <button
          onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          style={{
            background: "#DF0A09", color: "#fff", border: "none",
            borderRadius: 10, padding: "12px", fontSize: 13,
            fontWeight: 700, cursor: "pointer",
          }}
        >
          {copied ? "✓ Copied!" : "Download PNG"}
        </button>
        <button
          style={{
            background: "#DF0A09", color: "#fff", border: "none",
            borderRadius: 10, padding: "12px", fontSize: 13,
            fontWeight: 700, cursor: "pointer",
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
    <div style={{ position: "relative", width: 180, height: 100, margin: "0 auto" }}>
      <svg width="180" height="100" viewBox="0 0 180 100">
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
      <div style={{ background: "#111", border: "1px solid #222", borderRadius: 14, padding: "20px 24px", position: "relative" }}>
        <p style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "2px", lineHeight: 1.6, wordBreak: "break-all" }}>
          {password.slice(0, length).split("").map((ch, i) => (
            <span key={i} style={{ color: charColor(ch) }}>{ch}</span>
          ))}
        </p>
        <button
          onClick={handleCopy}
          style={{
            position: "absolute", top: 12, right: 12,
            background: copied ? "#22c55e" : "#222",
            border: "none", borderRadius: 6, padding: "5px 10px",
            fontSize: 11, fontWeight: 700, color: "#fff", cursor: "pointer",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Strength arc */}
      <StrengthArc strength={strength} />

      {/* Length slider */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between" style={{ fontSize: 12 }}>
          <span style={{ color: "#555" }}>Length: {length} characters</span>
          <span style={{ color: "#DF0A09", fontWeight: 700 }}>{strength}</span>
        </div>
        <input
          type="range" min={6} max={32} value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#DF0A09" }}
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
            onClick={() => set(!val)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, padding: "7px 12px", borderRadius: 8,
              background: val ? "#DF0A09" : "#1A1A1A",
              color: val ? "#fff" : "#555",
              border: `1px solid ${val ? "#DF0A09" : "#2A2A2A"}`,
              cursor: "pointer", fontWeight: 600,
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
        onClick={regenerate}
        whileHover={{ backgroundColor: "#B30807", y: -2 }}
        whileTap={{ scale: 0.97 }}
        style={{
          width: "100%", background: "#DF0A09", color: "#fff",
          border: "none", borderRadius: 12, padding: "15px",
          fontSize: 15, fontWeight: 700, cursor: "pointer",
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
      <div className="lg:hidden">
        {/* Tab strip */}
        <div style={{ background: "#111111", borderBottom: "1px solid #1E1E1E", display: "flex", overflowX: "auto" }}>
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              style={{
                padding: "16px 24px",
                color: active === t.id ? "#DF0A09" : "#444",
                borderTop: "none", borderLeft: "none", borderRight: "none",
                borderBottom: active === t.id ? "2px solid #DF0A09" : "2px solid transparent",
                fontWeight: 700, fontSize: 13, whiteSpace: "nowrap",
                background: "none",
                cursor: "pointer",
              }}
            >
              {t.name}
            </button>
          ))}
        </div>
        {/* Panel */}
        <div style={{ padding: "clamp(32px, 8vw, 40px) clamp(16px, 5vw, 20px)" }}>
          <div style={{ background: "#161616", border: "1px solid #222", borderRadius: 20, padding: "clamp(20px, 5vw, 28px)" }}>
            <PanelBody active={active} />
          </div>
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
          <a
            href={`/tools/${active === "compressor" ? "image-compressor" : active === "qr" ? "qr-generator" : "password-generator"}`}
            style={{ fontSize: 13, color: "#444", marginTop: 20, display: "inline-flex", alignItems: "center", gap: 6, width: "100%", maxWidth: 680 }}
          >
            Open full tool →
          </a>
        </div>
      </div>
    </section>
  );
}
