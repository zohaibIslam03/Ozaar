"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, RefreshCw, AlertCircle, Loader2, Check } from "lucide-react";
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
interface Strength { label: string; level: StrengthLevel }

function calcStrength(pw: string, opts: Options): Strength {
  if (!pw) return { label: "-", level: 0 };
  const types = (Object.keys(opts) as CharKey[]).filter((k) => opts[k]).length;
  const len = pw.length;
  if (len < 8 || types < 2) return { label: "Weak", level: 0 };
  if (len < 12 || types < 3) return { label: "Fair", level: 1 };
  if (len < 16 || types < 4) return { label: "Strong", level: 2 };
  return { label: "Very Strong", level: 3 };
}

const STRENGTH_TEXT = ["text-red-500", "text-yellow-500", "text-blue-500", "text-green-500"];
const STRENGTH_BAR = ["bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
const BULK_COUNTS: BulkCount[] = [1, 5, 10, 25];

const OPT_LIST: { key: CharKey; label: string; sample: string }[] = [
  { key: "uppercase", label: "Uppercase", sample: "A-Z" },
  { key: "lowercase", label: "Lowercase", sample: "a-z" },
  { key: "numbers", label: "Numbers", sample: "0-9" },
  { key: "symbols", label: "Symbols", sample: "!@#…" },
];

/** Main display + bulk rows: neutral uppercase (no red “dot” artifacts). */
function charColorClass(ch: string): string {
  if (/[A-Z]/.test(ch)) return "text-gray-900";
  if (/[0-9]/.test(ch)) return "text-blue-500";
  if (/[^a-zA-Z0-9]/.test(ch)) return "text-red-600";
  return "text-gray-500";
}

function StrengthArc({ level }: { level: StrengthLevel }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const angles = [0, 0.33, 0.66, 1.0];
  const frac = angles[level];
  const colors = ["#ef4444", "#eab308", "#3b82f6", "#22c55e"];

  return (
    <svg width="72" height="40" viewBox="0 0 72 40" className="shrink-0">
      <path
        d="M 4 36 A 32 32 0 0 1 68 36"
        fill="none"
        stroke="#E8E8E8"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M 4 36 A 32 32 0 0 1 68 36"
        fill="none"
        stroke={colors[level]}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${circ / 2}`}
        strokeDashoffset={`${(circ / 2) * (1 - frac)}`}
        className="transition-[stroke-dashoffset,stroke] duration-300 ease-out"
      />
    </svg>
  );
}

export default function PasswordGenerator() {
  const toast = useToast();
  const copyBtnRef = useRef<HTMLButtonElement>(null);
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState<Options>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });
  const [password, setPassword] = useState("");
  const [displayPw, setDisplayPw] = useState("");
  const [bulkPasswords, setBulkPasswords] = useState<string[]>([]);
  const [bulkListKey, setBulkListKey] = useState(0);
  const [bulkCount, setBulkCount] = useState<BulkCount>(5);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [copyAllLabel, setCopyAllLabel] = useState<"Copy All" | "Copied ✓">("Copy All");
  const [copyAllCopied, setCopyAllCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrambleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrambleDeadRef = useRef(false);
  const postSingleGenBulkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const singleGenBulkIdRef = useRef(0);
  const copyAllTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rowCopyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bulkCountRef = useRef<BulkCount>(bulkCount);
  const lengthRef = useRef(length);
  const charsetRef = useRef("");

  bulkCountRef.current = bulkCount;
  lengthRef.current = length;

  const charset = buildCharset(opts);
  charsetRef.current = charset;

  const cancelScramble = useCallback(() => {
    scrambleDeadRef.current = true;
    if (scrambleRef.current) {
      clearTimeout(scrambleRef.current);
      scrambleRef.current = null;
    }
    if (postSingleGenBulkTimeoutRef.current) {
      clearTimeout(postSingleGenBulkTimeoutRef.current);
      postSingleGenBulkTimeoutRef.current = null;
    }
  }, []);

  const scrambleThenSet = useCallback(
    (final: string) => {
      cancelScramble();
      scrambleDeadRef.current = false;
      const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^";
      let step = 0;
      const steps = 6;
      const tick = () => {
        if (scrambleDeadRef.current) return;
        step++;
        if (step >= steps) {
          if (!scrambleDeadRef.current) setDisplayPw(final);
          return;
        }
        const scrambled = Array.from(final, (c, i) =>
          i < (step / steps) * final.length
            ? c
            : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        ).join("");
        if (!scrambleDeadRef.current) setDisplayPw(scrambled);
        scrambleRef.current = setTimeout(tick, 40);
      };
      tick();
    },
    [cancelScramble]
  );

  const generate = useCallback(() => {
    if (!charset) {
      setError("Select at least one character type.");
      return;
    }
    setError(null);
    singleGenBulkIdRef.current += 1;
    const fillId = singleGenBulkIdRef.current;
    setBulkPasswords([]);
    cancelScramble();
    const pw = cryptoPassword(charset, length);
    setPassword(pw);
    scrambleThenSet(pw);

    postSingleGenBulkTimeoutRef.current = setTimeout(() => {
      if (fillId !== singleGenBulkIdRef.current) return;
      const cs = charsetRef.current;
      const len = lengthRef.current;
      const n = bulkCountRef.current;
      if (!cs) return;
      const list: string[] = [pw];
      for (let i = 1; i < n; i++) {
        list.push(cryptoPassword(cs, len));
      }
      setBulkPasswords(list);
      setBulkListKey((k) => k + 1);
      postSingleGenBulkTimeoutRef.current = null;
    }, 280);
  }, [charset, length, scrambleThenSet, cancelScramble]);

  const generateBulk = useCallback(async () => {
    const cs = charsetRef.current;
    if (!cs) {
      setError("Select at least one character type.");
      return;
    }
    const count = bulkCountRef.current;
    const pwLen = lengthRef.current;

    singleGenBulkIdRef.current += 1;
    cancelScramble();
    setError(null);
    setPassword("");
    setDisplayPw("");
    setCopyAllLabel("Copy All");
    setCopyAllCopied(false);
    setCopiedIndex(null);
    if (copyAllTimeoutRef.current) clearTimeout(copyAllTimeoutRef.current);
    if (rowCopyTimeoutRef.current) clearTimeout(rowCopyTimeoutRef.current);
    setBulkLoading(true);
    await new Promise((r) => setTimeout(r, 300));

    const next: string[] = [];
    for (let i = 0; i < count; i++) {
      next.push(cryptoPassword(cs, pwLen));
    }
    setBulkPasswords(next);
    setBulkListKey((k) => k + 1);
    setBulkLoading(false);
  }, [cancelScramble]);

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

  const copyAll = useCallback(async () => {
    if (bulkPasswords.length === 0) return;
    await navigator.clipboard.writeText(bulkPasswords.join("\n"));
    if (copyAllTimeoutRef.current) clearTimeout(copyAllTimeoutRef.current);
    setCopyAllLabel("Copied ✓");
    setCopyAllCopied(true);
    copyAllTimeoutRef.current = setTimeout(() => {
      setCopyAllLabel("Copy All");
      setCopyAllCopied(false);
    }, 1500);
  }, [bulkPasswords]);

  const copyRow = useCallback(async (pw: string, index: number) => {
    await navigator.clipboard.writeText(pw);
    if (rowCopyTimeoutRef.current) clearTimeout(rowCopyTimeoutRef.current);
    setCopiedIndex(index);
    rowCopyTimeoutRef.current = setTimeout(() => setCopiedIndex(null), 1000);
  }, []);

  const toggle = (key: CharKey) => {
    cancelScramble();
    singleGenBulkIdRef.current += 1;
    setOpts((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!Object.values(next).some(Boolean)) return prev;
      return next;
    });
    setPassword("");
    setDisplayPw("");
    setBulkPasswords([]);
    setError(null);
  };

  useEffect(
    () => () => {
      scrambleDeadRef.current = true;
      if (scrambleRef.current) clearTimeout(scrambleRef.current);
      if (copyAllTimeoutRef.current) clearTimeout(copyAllTimeoutRef.current);
      if (rowCopyTimeoutRef.current) clearTimeout(rowCopyTimeoutRef.current);
      if (postSingleGenBulkTimeoutRef.current) clearTimeout(postSingleGenBulkTimeoutRef.current);
    },
    []
  );

  const strength = calcStrength(password, opts);
  const bulkHasResults = bulkPasswords.length > 0;
  const showBulkOnlyHint = bulkHasResults && !displayPw && !password;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      <div className="relative flex min-h-[80px] items-center gap-4 overflow-hidden rounded-xl border border-brand-border bg-brand-surface px-5 py-6">
        <p className="flex-1 select-all break-all font-mono text-lg leading-relaxed sm:text-xl">
          {showBulkOnlyHint ? (
            <span className="block text-center text-sm font-medium leading-snug text-brand-muted sm:text-base">
              {bulkPasswords.length} passwords are listed below. Use{" "}
              <span className="text-brand-text">Copy All</span> or each row&apos;s copy button.
            </span>
          ) : displayPw ? (
            Array.from(displayPw).map((ch, i) => (
              <span key={i} className={charColorClass(ch)}>
                {ch}
              </span>
            ))
          ) : password ? (
            Array.from(password).map((ch, i) => (
              <span key={i} className={charColorClass(ch)}>
                {ch}
              </span>
            ))
          ) : (
            <span className="text-brand-muted/40">Click Generate →</span>
          )}
        </p>
        {password ? (
          <button
            ref={copyBtnRef}
            type="button"
            onClick={() => copy(password, "Password", copyBtnRef.current)}
            aria-label="Copy password"
            className="shrink-0 rounded-lg border border-brand-border p-2 text-brand-muted transition-all duration-200 hover:border-brand-text/30 hover:text-brand-text"
          >
            <Copy className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {password ? (
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
      ) : null}

      <div className="flex flex-col gap-2">
        <label className="flex justify-between text-sm font-medium text-brand-text">
          <span>Length</span>
          <span className="font-mono text-brand-red">{length}</span>
        </label>
        <input
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(e) => {
            cancelScramble();
            singleGenBulkIdRef.current += 1;
            setLength(Number(e.target.value));
            setPassword("");
            setDisplayPw("");
            setBulkPasswords([]);
          }}
          className="pg-range-slider w-full accent-brand-red"
        />
        <div className="flex justify-between text-xs text-brand-muted/60">
          <span>8</span>
          <span>64</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {OPT_LIST.map(({ key, label, sample }) => (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            aria-pressed={opts[key]}
            className={`flex flex-col items-start rounded-lg border p-3 text-left transition-all duration-200 ${
              opts[key]
                ? "border-brand-red/30 bg-brand-redLight text-brand-text"
                : "border-brand-border text-brand-muted hover:border-brand-text/30 hover:text-brand-text"
            }`}
          >
            <span className="text-xs font-medium">{label}</span>
            <span className="font-mono text-[10px] opacity-60">{sample}</span>
          </button>
        ))}
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : null}

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={generate}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-red py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-redDark"
      >
        <RefreshCw className="h-4 w-4" />
        Generate Password
      </motion.button>

      <div className="flex flex-col gap-4 border-t border-brand-border pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-semibold text-gray-700">Bulk Generate</span>
          <div className="flex items-center gap-1.5">
            {BULK_COUNTS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setBulkCount(n)}
                className={`h-10 w-10 rounded-lg text-sm font-semibold transition-all ${
                  bulkCount === n
                    ? "border-2 border-red-600 bg-red-600 font-bold text-white"
                    : "border border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-600"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              disabled={bulkLoading}
              onClick={() => void generateBulk()}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-sm font-bold text-white transition-all hover:bg-red-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-90"
              aria-label="Generate bulk passwords"
            >
              {bulkLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin text-white" aria-hidden /> : "Go"}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {bulkPasswords.length > 0 ? (
            <motion.div
              key={bulkListKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden rounded-xl border border-gray-200"
            >
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
                <span className="text-sm font-semibold text-gray-700">
                  {bulkPasswords.length} passwords generated
                </span>
                <button
                  type="button"
                  onClick={() => void copyAll()}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition-all active:scale-95 ${
                    copyAllCopied ? "bg-green-600" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  <Copy className="h-3.5 w-3.5 shrink-0 text-white" strokeWidth={2} aria-hidden />
                  {copyAllLabel}
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-track-rounded-full scrollbar-thumb-gray-300 scrollbar-thumb-rounded-full hover:scrollbar-thumb-red-500">
                {bulkPasswords.map((pw, index) => (
                  <motion.div
                    key={`${bulkListKey}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="group flex items-center justify-between border-b border-gray-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-gray-50"
                  >
                    <div className="mr-3 flex min-w-0 flex-1 items-start gap-3">
                      <span className="w-6 shrink-0 pt-0.5 text-xs font-bold tabular-nums text-gray-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="min-w-0 flex-1 break-all font-mono text-sm font-normal tracking-wide">
                        {Array.from(pw).map((ch, ci) => (
                          <span key={ci} className={charColorClass(ch)}>
                            {ch}
                          </span>
                        ))}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void copyRow(pw, index)}
                      aria-label={`Copy password ${index + 1}`}
                      className="ml-3 shrink-0 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200 active:scale-95"
                    >
                      {copiedIndex === index ? (
                        <Check className="h-3.5 w-3.5 text-green-600" strokeWidth={2.5} aria-hidden />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-gray-600" strokeWidth={2} aria-hidden />
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <style>{`
        input.pg-range-slider:focus {
          box-shadow: none !important;
          border-color: transparent !important;
        }
      `}</style>
    </motion.div>
  );
}
