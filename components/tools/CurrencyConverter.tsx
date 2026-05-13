"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, AlertCircle, RefreshCw } from "lucide-react";

// ── Cache ────────────────────────────────────────────────────────────────────

const CACHE_KEY = "currency_rates_v1";
const CACHE_TTL = 3600 * 1000; // 1 hour

interface CacheEntry {
  rates: Record<string, number>;
  base: string;
  updatedAt: number;
  timestamp: number;
}

function loadCache(): CacheEntry | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() - entry.timestamp > CACHE_TTL) { sessionStorage.removeItem(CACHE_KEY); return null; }
    return entry;
  } catch { return null; }
}

function saveCache(entry: CacheEntry) {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry)); } catch {}
}

// ── Currency data ─────────────────────────────────────────────────────────────

const ALL_CURRENCIES: { code: string; name: string; flag: string }[] = [
  { code: "USD", name: "US Dollar",          flag: "🇺🇸" },
  { code: "EUR", name: "Euro",               flag: "🇪🇺" },
  { code: "GBP", name: "British Pound",      flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen",       flag: "🇯🇵" },
  { code: "CNY", name: "Chinese Yuan",       flag: "🇨🇳" },
  { code: "CAD", name: "Canadian Dollar",    flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar",  flag: "🇦🇺" },
  { code: "CHF", name: "Swiss Franc",        flag: "🇨🇭" },
  { code: "INR", name: "Indian Rupee",       flag: "🇮🇳" },
  { code: "MXN", name: "Mexican Peso",       flag: "🇲🇽" },
  { code: "BRL", name: "Brazilian Real",     flag: "🇧🇷" },
  { code: "KRW", name: "South Korean Won",   flag: "🇰🇷" },
  { code: "SGD", name: "Singapore Dollar",   flag: "🇸🇬" },
  { code: "HKD", name: "Hong Kong Dollar",   flag: "🇭🇰" },
  { code: "NOK", name: "Norwegian Krone",    flag: "🇳🇴" },
  { code: "SEK", name: "Swedish Krona",      flag: "🇸🇪" },
  { code: "DKK", name: "Danish Krone",       flag: "🇩🇰" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
  { code: "AED", name: "UAE Dirham",         flag: "🇦🇪" },
  { code: "SAR", name: "Saudi Riyal",        flag: "🇸🇦" },
  { code: "TRY", name: "Turkish Lira",       flag: "🇹🇷" },
  { code: "RUB", name: "Russian Ruble",      flag: "🇷🇺" },
  { code: "PLN", name: "Polish Zloty",       flag: "🇵🇱" },
  { code: "THB", name: "Thai Baht",          flag: "🇹🇭" },
  { code: "IDR", name: "Indonesian Rupiah",  flag: "🇮🇩" },
  { code: "MYR", name: "Malaysian Ringgit",  flag: "🇲🇾" },
  { code: "PHP", name: "Philippine Peso",    flag: "🇵🇭" },
  { code: "PKR", name: "Pakistani Rupee",    flag: "🇵🇰" },
  { code: "EGP", name: "Egyptian Pound",     flag: "🇪🇬" },
];

const TOP_10 = ["EUR","GBP","JPY","CNY","CAD","AUD","CHF","INR","MXN","KRW"];

function formatRate(n: number): string {
  if (!isFinite(n)) return "—";
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (n >= 1)    return n.toFixed(4);
  return n.toFixed(6);
}

// ── Searchable select ─────────────────────────────────────────────────────────

function CurrencySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const cur = ALL_CURRENCIES.find((c) => c.code === value);
  const filtered = q.trim()
    ? ALL_CURRENCIES.filter(
        (c) =>
          c.code.toLowerCase().includes(q.toLowerCase()) ||
          c.name.toLowerCase().includes(q.toLowerCase())
      )
    : ALL_CURRENCIES;

  return (
    <div className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full min-w-0 flex items-center gap-2 bg-brand-surface border border-brand-border rounded-lg px-3 py-2.5 text-sm text-brand-text
          hover:border-brand-text/30 transition-colors text-left"
      >
        <span className="text-base">{cur?.flag}</span>
        <span className="font-mono font-semibold">{cur?.code}</span>
        <span className="text-brand-muted truncate flex-1">{cur?.name}</span>
        <span className="text-brand-muted/60 ml-1">▾</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-brand-surface border border-brand-border rounded-xl shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-brand-border">
            <input
              autoFocus
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search currency…"
              className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-1.5 text-sm text-brand-text
                placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto">
            {filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => { onChange(c.code); setOpen(false); setQ(""); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                    c.code === value ? "bg-brand-red/10 text-brand-red" : "text-brand-text hover:bg-white/5"
                  }`}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="font-mono font-semibold w-10 shrink-0">{c.code}</span>
                <span className="text-brand-muted truncate min-w-0">{c.name}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-4 text-sm text-brand-muted/60 text-center">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────

export default function CurrencyConverter() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [from, setFrom] = useState("USD");
  const [to, setTo]     = useState("EUR");
  const [amount, setAmount] = useState("1");

  const fetchRates = useCallback(async (force = false) => {
    if (!force) {
      const cached = loadCache();
      if (cached) {
        setRates(cached.rates);
        setUpdatedAt(new Date(cached.updatedAt * 1000).toLocaleString());
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as { rates: Record<string, number>; time_last_update_unix: number };
      const entry: CacheEntry = {
        rates: data.rates,
        base: "USD",
        updatedAt: data.time_last_update_unix,
        timestamp: Date.now(),
      };
      saveCache(entry);
      setRates(data.rates);
      setUpdatedAt(new Date(data.time_last_update_unix * 1000).toLocaleString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRates(); }, [fetchRates]);

  const swap = () => { setFrom(to); setTo(from); };

  function convertAmount(amt: number, f: string, t: string): number {
    if (!rates) return NaN;
    const fromRate = rates[f] ?? NaN;
    const toRate   = rates[t]  ?? NaN;
    return (amt / fromRate) * toRate;
  }

  const numericAmount = parseFloat(amount);
  const result = isNaN(numericAmount) || !rates ? NaN : convertAmount(numericAmount, from, to);
  const fromCur = ALL_CURRENCIES.find((c) => c.code === from);
  const toCur   = ALL_CURRENCIES.find((c) => c.code === to);

  const rate1 = rates ? convertAmount(1, from, to) : NaN;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {updatedAt && (
          <p className="text-xs text-brand-muted/60">Rates updated: {updatedAt}</p>
        )}
        <button
          onClick={() => fetchRates(true)}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-text transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !rates && (
        <div className="flex flex-col gap-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 bg-brand-surface rounded-xl" />
          ))}
        </div>
      )}

      {/* Converter */}
      {rates && (
        <>
          <div className="flex flex-col gap-3">
            {/* Amount input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-muted uppercase tracking-wider">Amount</label>
              <input
                type="number"
                value={amount}
                min={0}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2.5 text-sm text-brand-text
                  placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-red transition-colors"
              />
            </div>

            {/* From / swap / to */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs text-brand-muted uppercase tracking-wider">From</label>
                <CurrencySelect value={from} onChange={setFrom} />
              </div>
              <motion.button
                onClick={swap}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="self-end sm:mb-0.5 p-2.5 rounded-full bg-brand-surface border border-brand-border text-brand-muted
                  hover:text-brand-text hover:border-brand-text/30 transition-colors rotate-90 sm:rotate-0"
                aria-label="Swap currencies"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </motion.button>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs text-brand-muted uppercase tracking-wider">To</label>
                <CurrencySelect value={to} onChange={setTo} />
              </div>
            </div>
          </div>

          {/* Result */}
          {!isNaN(result) && (
            <div className="bg-brand-surface border border-brand-border rounded-xl px-5 py-4 flex flex-col gap-2">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm text-brand-muted">
                  {numericAmount.toLocaleString()} {fromCur?.code}
                </span>
                <span className="text-[#444]">=</span>
                <span className="text-2xl sm:text-3xl font-bold text-brand-red tabular-nums break-all">
                  {result.toLocaleString("en-US", { maximumFractionDigits: 4 })}
                </span>
                <span className="text-lg text-brand-text font-medium">{toCur?.code}</span>
              </div>
              <p className="text-xs text-brand-muted/60">
                1 {from} = {formatRate(rate1)} {to}
              </p>
            </div>
          )}

          {/* Multi-currency table */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm text-brand-text font-medium">
              {numericAmount || 1} {from} in major currencies
            </h3>
            <div className="flex flex-col divide-y divide-[#1a1a1a] overflow-hidden">
              {TOP_10.filter((c) => c !== from).map((code) => {
                const cur = ALL_CURRENCIES.find((c2) => c2.code === code);
                const val = convertAmount(isNaN(numericAmount) ? 1 : numericAmount, from, code);
                return (
                  <div key={code} className="flex items-center justify-between gap-3 py-2.5 px-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base">{cur?.flag}</span>
                      <span className="text-sm font-mono text-brand-text">{code}</span>
                      <span className="text-xs text-brand-muted/60 hidden sm:block">{cur?.name}</span>
                    </div>
                    <span className="text-sm text-[#cccccc] font-mono tabular-nums text-right break-all">
                      {val.toLocaleString("en-US", { maximumFractionDigits: 4 })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
