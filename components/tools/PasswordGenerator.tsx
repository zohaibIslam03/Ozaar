"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Copy, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/components/Toast";
import confetti from "canvas-confetti";

const CHARS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?",
} as const;

type CharKey = keyof typeof CHARS;
type BulkCount = 1 | 5 | 10 | 25;

interface Options {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

function buildCharset(opts: Options): string {
  return (Object.keys(CHARS) as CharKey[])
    .filter((k) => opts[k])
    .map((k) => CHARS[k])
    .join("");
}

function cryptoPassword(charset: string, length: number): string {
  const buf = new Uint32Array(length);
  window.crypto.getRandomValues(buf);
  return Array.from(buf, (n) => charset[n % charset.length]).join("");
}

type StrengthLevel = 0 | 1 | 2 | 3;
interface Strength { label: string; level: StrengthLevel; }

function calcStrength(pw: string, opts: Options): Strength {
  if (!pw) return { label: "—", level: 0 };
  const types = (Object.keys(opts) as CharKey[]).filter((k) => opts[k]).length;
  const len = pw.length;
  if (len < 8 || types < 2) return { label: "Weak", level: 0 };
  if (len < 12 || types < 3) return { label: "Fair", level: 1 };
  if (len < 16 || types < 4) return { label: "Strong", level: 2 };
  return { label: "Very Strong", level: 3 };
}

const STRENGTH_TEXT = ["text-red-500", "text-yellow-500", "text-blue-500", "text-green-500"];
const STRENGTH_BAR  = ["bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
const BULK_COUNTS: BulkCount[] = [1, 5, 10, 25];

const OPT_LIST: { key: CharKey; label: string; sample: string }[] = [
  { key: "uppercase", label: "Uppercase", sample: "A–Z" },
  { key: "lowercase", label: "Lowercase", sample: "a–z" },
  { key: "numbers",   label: "Numbers",   sample: "0–9" },
  { key: "symbols",   label: "Symbols",   sample: "!@#…" },
];

// Per-character color coding
function charColor(ch: string): string {
  if (/[A-Z]/.test(ch)) return "text-brand-red";
  if (/[0-9]/.test(ch)) return "text-blue-500";
  if (/[^a-zA-Z0-9]/.test(ch)) return "text-green-600";
  return "text-brand-text";
}

// Strength arc SVG
function StrengthArc({ level }: { level: StrengthLevel }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const angles = [0, 0.33, 0.66, 1.0];
  const frac = angles[level];
  const colors = ["#ef4444", "#eab308", "#3b82f6", "#22c55e"];

  return (
    <svg width="72" height="40" viewBox="0 0 72 40">
      <path
        d="M 4 36 A 32 32 0 0 1 68 36"
        fill="none" stroke="#E8E8E8" strokeWidth="5" strokeLinecap="round"
      />
      <path
        d="M 4 36 A 32 32 0 0 1 68 36"
        fill="none"
        stroke={colors[level]}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${circ / 2}`}
        strokeDashoffset={`${(circ / 2) * (1 - frac)}`}
        style={{ transition: "stroke-dashoffset 0.4s ease, stroke 0.3s ease" }}
      />
    </svg>
  );
}

export default function PasswordGenerator() {
  const toast = useToast();
  const copyBtnRef = useRef<HTMLButtonElement>(null);
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState<Options>({
    uppercase: true, lowercase: true, numbers: true, symbols: false,
  });
  const [password, setPassword] = useState("");
  const [displayPw, setDisplayPw] = useState("");
  const [bulk, setBulk] = useState<string[]>([]);
  const [bulkCount, setBulkCount] = useState<BulkCount>(5);
  const [error, setError] = useState<string | null>(null);
  const scrambleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const charset = buildCharset(opts);

  const scrambleThenSet = useCallback((final: string) => {
    if (scrambleRef.current) clearTimeout(scrambleRef.current);
    const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^";
    let step = 0;
    const steps = 6;
    const tick = () => {
      step++;
      if (step >= steps) { setDisplayPw(final); return; }
      const scrambled = Array.from(final, (c, i) =>
        i < (step / steps) * final.length
          ? c
          : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      ).join("");
      setDisplayPw(scrambled);
      scrambleRef.current = setTimeout(tick, 40);
    };
    tick();
  }, []);

  const generate = useCallback(() => {
    if (!charset) { setError("Select at least one character type."); return; }
    setError(null); setBulk([]);
    const pw = cryptoPassword(charset, length);
    setPassword(pw);
    scrambleThenSet(pw);
  }, [charset, length, scrambleThenSet]);

  const generateBulk = useCallback(() => {
    if (!charset) { setError("Select at least one character type."); return; }
    setError(null); setPassword(""); setDisplayPw("");
    setBulk(Array.from({ length: bulkCount }, () => cryptoPassword(charset, length)));
  }, [charset, length, bulkCount]);

  const copy = async (text: string, label = "Password", btn?: HTMLButtonElement | null) => {
    await navigator.clipboard.writeText(text);
    toast(`${label} copied!`, "success");
    if (btn) {
      const rect = btn.getBoundingClientRect();
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { x: rect.left / window.innerWidth, y: rect.top / window.innerHeight },
        colors: ["#DF0A09", "#FF5151", "#B30807"],
        scalar: 0.7,
      });
    }
  };

  const toggle = (key: CharKey) => {
    setOpts((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!Object.values(next).some(Boolean)) return prev;
      return next;
    });
    setPassword(""); setDisplayPw(""); setBulk([]); setError(null);
  };

  // Cleanup scramble on unmount
  useEffect(() => () => { if (scrambleRef.current) clearTimeout(scrambleRef.current); }, []);

  const strength = calcStrength(password, opts);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      {/* Password display with character coloring */}
      <div className="relative bg-brand-surface border border-brand-border rounded-xl px-5 py-6 flex items-center gap-4 min-h-[80px]">
        <p className="flex-1 font-mono text-lg sm:text-xl break-all select-all leading-relaxed">
          {displayPw ? (
            Array.from(displayPw).map((ch, i) => (
              <span key={i} className={charColor(ch)}>{ch}</span>
            ))
          ) : (
            <span className="text-brand-muted/40">Click Generate →</span>
          )}
        </p>
        {password && (
          <button
            ref={copyBtnRef}
            onClick={() => copy(password, "Password", copyBtnRef.current)}
            aria-label="Copy password"
            className="shrink-0 p-2 rounded-lg border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-text/30 transition-all duration-200"
          >
            <Copy className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Strength gauge */}
      {password && (
        <div className="flex items-center gap-4">
          <StrengthArc level={strength.level} />
          <div className="flex flex-col gap-1">
            <span className={`text-sm font-semibold ${STRENGTH_TEXT[strength.level]}`}>{strength.label}</span>
            <div className="flex gap-1">
              {([0, 1, 2, 3] as StrengthLevel[]).map((i) => (
                <div
                  key={i}
                  className={`h-1 w-8 rounded-full transition-all duration-300 ${
                    i <= strength.level ? STRENGTH_BAR[strength.level] : "bg-brand-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Length slider */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-brand-text font-medium flex justify-between">
          <span>Length</span>
          <span className="text-brand-red font-mono">{length}</span>
        </label>
        <input
          type="range" min={8} max={64} value={length}
          onChange={(e) => { setLength(Number(e.target.value)); setPassword(""); setDisplayPw(""); setBulk([]); }}
          className="w-full accent-brand-red"
        />
        <div className="flex justify-between text-xs text-brand-muted/60">
          <span>8</span><span>64</span>
        </div>
      </div>

      {/* Character set toggles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {OPT_LIST.map(({ key, label, sample }) => (
          <button
            key={key} onClick={() => toggle(key)} aria-pressed={opts[key]}
            className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all duration-200 ${
              opts[key]
                ? "bg-brand-redLight border-brand-red/30 text-brand-text"
                : "border-brand-border text-brand-muted hover:border-brand-text/30 hover:text-brand-text"
            }`}
          >
            <span className="text-xs font-medium">{label}</span>
            <span className="text-[10px] opacity-60 font-mono">{sample}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      {/* Generate button */}
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={generate}
        className="inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-red text-white text-sm font-medium hover:bg-brand-redDark transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Generate Password
      </motion.button>

      {/* Bulk generate */}
      <div className="border-t border-brand-border pt-5 flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="text-sm text-brand-text font-medium">Bulk Generate</span>
          <div className="flex items-center gap-1.5">
            {BULK_COUNTS.map((n) => (
              <button
                key={n} onClick={() => setBulkCount(n)}
                className={`w-9 h-9 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  bulkCount === n
                    ? "bg-brand-redLight border-brand-red/30 text-brand-red"
                    : "border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-text/30"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={generateBulk}
              className="px-4 h-9 rounded-lg bg-brand-surface border border-brand-border text-brand-muted text-xs font-medium hover:text-brand-text hover:border-brand-text/30 transition-colors"
            >
              Go
            </button>
          </div>
        </div>

        {bulk.length > 0 && (
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
            {bulk.map((pw, i) => (
              <div key={i} className="flex items-center gap-3 bg-brand-surface border border-brand-border rounded-lg px-4 py-2.5 group">
                <span className="text-xs text-brand-muted/60 font-mono w-5 shrink-0 tabular-nums">{i + 1}.</span>
                <span className="flex-1 font-mono text-sm text-brand-text break-all">{pw}</span>
                <button
                  onClick={() => copy(pw, `Password ${i + 1}`)}
                  aria-label={`Copy password ${i + 1}`}
                  className="shrink-0 p-1 text-brand-muted hover:text-brand-text opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
