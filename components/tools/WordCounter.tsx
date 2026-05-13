"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const STOP = new Set([
  "the","be","to","of","and","a","in","that","have","it","for","not","on",
  "with","he","as","you","do","at","this","but","his","by","from","they","we",
  "say","her","she","or","an","will","my","one","all","would","there","their",
  "what","so","up","out","if","about","who","get","which","go","me","when",
  "make","can","like","time","no","just","him","know","take","into","your",
  "good","some","could","them","see","than","then","now","look","only","come",
  "its","over","think","also","back","after","use","two","how","our","work",
  "first","well","way","even","new","want","because","any","these","give","day",
  "most","us","is","was","are","has","had","been","were","did","does","i","am",
]);

interface TopWord { word: string; count: number; density: number }
interface Stats {
  words: number; chars: number; charsNoSpace: number;
  sentences: number; paragraphs: number; uniqueWords: number;
  readMin: number; speakMin: number; topWords: TopWord[];
}

function computeStats(text: string): Stats {
  const trimmed = text.trim();
  if (!trimmed) return { words: 0, chars: 0, charsNoSpace: 0, sentences: 0, paragraphs: 0, uniqueWords: 0, readMin: 0, speakMin: 0, topWords: [] };
  const wordList = trimmed.split(/\s+/);
  const words = wordList.length;
  const sentences = (trimmed.match(/[^.!?]*[.!?]+/g) ?? []).length || 1;
  const paragraphs = trimmed.split(/\n+/).filter((p) => p.trim().length > 0).length;
  const freq = new Map<string, number>();
  for (const w of wordList) {
    const clean = w.toLowerCase().replace(/[^a-z]/g, "");
    if (clean.length >= 2 && !STOP.has(clean)) freq.set(clean, (freq.get(clean) ?? 0) + 1);
  }
  const uniqueWords = new Set(wordList.map((w) => w.toLowerCase().replace(/[^a-z]/g, "")).filter(Boolean)).size;
  const topWords = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([word, count]) => ({ word, count, density: +((count / words) * 100).toFixed(1) }));
  return { words, chars: text.length, charsNoSpace: text.replace(/\s/g, "").length, sentences, paragraphs, uniqueWords, readMin: words / 200, speakMin: words / 130, topWords };
}

function formatTime(min: number): string {
  if (min < 1) return "< 1 min";
  const m = Math.round(min);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function useDebounce<T>(value: T, delay: number): T {
  const [v, setV] = useState<T>(value);
  useEffect(() => { const t = setTimeout(() => setV(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return v;
}

function AnimatedNumber({ value }: { value: string | number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={String(value)}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.15 }}
        className="text-xl font-bold text-brand-text tabular-nums"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-brand-surface border border-brand-border rounded-xl p-4 flex flex-col gap-1">
      <span className="text-[11px] text-brand-muted uppercase tracking-wider">{label}</span>
      <AnimatedNumber value={value} />
    </div>
  );
}

export default function WordCounter() {
  const [text, setText] = useState("");
  const [limit, setLimit] = useState<number | "">("");
  const debouncedText = useDebounce(text, 100);
  const stats = computeStats(debouncedText);

  const limitNum = typeof limit === "number" ? limit : null;
  const pct = limitNum ? Math.min(100, (stats.chars / limitNum) * 100) : 0;
  const limitExceeded = limitNum !== null && stats.chars > limitNum;

  const metrics = [
    { label: "Words",         value: stats.words.toLocaleString() },
    { label: "Characters",    value: stats.chars.toLocaleString() },
    { label: "No-space chars",value: stats.charsNoSpace.toLocaleString() },
    { label: "Sentences",     value: stats.sentences.toLocaleString() },
    { label: "Paragraphs",    value: stats.paragraphs.toLocaleString() },
    { label: "Unique words",  value: stats.uniqueWords.toLocaleString() },
    { label: "Reading time",  value: formatTime(stats.readMin) },
    { label: "Speaking time", value: formatTime(stats.speakMin) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      {/* Character limit */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <label className="text-sm text-brand-text font-medium shrink-0">Character limit</label>
          <input
            type="number" min={1} value={limit}
            onChange={(e) => setLimit(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="None"
            className="w-28 bg-brand-surface border border-brand-border rounded-lg px-3 py-1.5 text-sm text-brand-text placeholder:text-brand-muted/40 focus:outline-none transition-colors"
          />
          {limitNum !== null && (
            <span className={`text-sm font-mono tabular-nums ${limitExceeded ? "text-red-500" : "text-brand-muted"}`}>
              {stats.chars} / {limitNum}
            </span>
          )}
        </div>
        <button
          onClick={() => setText("")}
          className="flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-text transition-colors"
        >
          <X className="w-4 h-4" /> Clear
        </button>
      </div>

      {/* Char limit progress bar */}
      {limitNum !== null && (
        <div className="h-1 bg-brand-border rounded-full overflow-hidden -mt-4">
          <motion.div
            className={`h-full rounded-full transition-colors duration-300 ${
              pct >= 95 ? "bg-red-500" : pct >= 80 ? "bg-orange-400" : "bg-brand-red"
            }`}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here…"
        className={`w-full min-h-[200px] bg-brand-surface border rounded-xl px-4 py-3 text-sm text-brand-text placeholder:text-brand-muted/40
          resize-y focus:outline-none transition-colors leading-relaxed ${
            limitExceeded ? "border-red-400 focus:border-red-500" : "border-brand-border focus:border-brand-red"
          }`}
      />
      {limitExceeded && (
        <p className="text-xs text-red-500 -mt-4">
          {stats.chars - (limitNum ?? 0)} character{stats.chars - (limitNum ?? 0) !== 1 ? "s" : ""} over the limit.
        </p>
      )}

      {/* Metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m) => <Metric key={m.label} label={m.label} value={m.value} />)}
      </div>

      {/* Top keywords */}
      {stats.topWords.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm text-brand-text font-semibold">Top Keywords</h3>
          <div className="flex flex-col gap-2">
            {stats.topWords.map(({ word, count, density }) => (
              <div key={word} className="flex items-center gap-3">
                <span className="text-sm text-brand-text font-mono w-28 shrink-0 truncate">{word}</span>
                <div className="flex-1 bg-brand-border rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-red rounded-full"
                    animate={{ width: `${Math.min(density * 5, 100)}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="text-xs text-brand-muted tabular-nums w-16 text-right shrink-0">
                  {count}× · {density}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
