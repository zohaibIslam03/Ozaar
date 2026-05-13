"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ImageCompressorVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-[320px] rounded-2xl overflow-hidden border border-[#E8E8E8] shadow-xl bg-white">
        <div className="flex h-[160px] relative">
          <div className="flex-1 bg-[#E8E8E8] flex flex-col items-center justify-center gap-1 border-r border-[#E0E0E0]">
            <p className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Original</p>
            <p className="text-[24px] font-black text-[#111]">4.2 MB</p>
            <p className="text-[10px] text-[#999]">photo.jpg</p>
          </div>
          <div className="flex-1 bg-[#F5F5F5] flex flex-col items-center justify-center gap-1">
            <p className="text-[10px] font-bold text-[#DF0A09] uppercase tracking-wider">Compressed</p>
            <p className="text-[24px] font-black text-[#DF0A09]">380 KB</p>
            <p className="text-[10px] text-[#999]">photo.webp</p>
          </div>
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center">
            <div className="w-1 h-full bg-white shadow-lg" />
            <div className="absolute w-6 h-6 rounded-full bg-white border-2 border-[#DF0A09] shadow-md flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M3 5h4M1 3l2 2-2 2M7 3l2 2-2 2" stroke="#DF0A09" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#F0F0F0]">
          <span className="text-[12px] text-[#888]">Size reduced by</span>
          <span className="text-[14px] font-black text-[#DF0A09]">−91%</span>
        </div>
        <div className="px-4 pb-4">
          <div className="h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full bg-[#DF0A09]" initial={{ width: "0%" }} animate={{ width: "91%" }} transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ResumeBuilderVisual() {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setVisible((v) => Math.min(v + 1, 3)), 600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-[200px] bg-white rounded-xl border border-[#E8E8E8] shadow-xl overflow-hidden" style={{ aspectRatio: "210/297" }}>
        <div className="h-16 bg-[#DF0A09] flex items-center px-3 gap-2">
          <div className="w-8 h-8 rounded-full bg-white/30 shrink-0" />
          <div className="flex flex-col gap-1 flex-1">
            <div className="h-2 bg-white/80 rounded-full w-full" />
            {visible >= 1 && <div className="h-1.5 bg-white/50 rounded-full w-3/4" />}
          </div>
        </div>
        <div className="p-3 flex flex-col gap-3">
          {["Experience", "Education", "Skills"].map((s, i) => (
            <div key={s} className="flex flex-col gap-1">
              <p className="text-[7px] font-bold text-[#DF0A09] uppercase tracking-wide">{s}</p>
              <div className={`h-1.5 bg-[#F0F0F0] rounded-full transition-all duration-500 ${visible >= i + 1 ? "w-full" : "w-0"}`} />
              <div className={`h-1.5 bg-[#F0F0F0] rounded-full transition-all duration-500 delay-150 ${visible >= i + 1 ? "w-3/4" : "w-0"}`} />
            </div>
          ))}
          <div className="mt-2 self-end bg-[#DF0A09] text-white text-[8px] font-bold px-2 py-1 rounded-full">Export PDF →</div>
        </div>
      </div>
    </div>
  );
}

function PdfToolkitVisual() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative w-[220px] h-[280px]">
        {[
          { rotate: -8, z: 0, x: -20, y: 10, bg: "#fff", border: "#E0E0E0" },
          { rotate: 0, z: 10, x: 0, y: 0, bg: "#fff", border: "#CCCCCC" },
          { rotate: 8, z: 5, x: 20, y: 10, bg: "#F7F7F7", border: "#E0E0E0" },
        ].map((card, i) => (
          <motion.div key={i} className="absolute top-1/2 left-1/2 w-[140px] h-[180px] rounded-xl border-2 flex flex-col justify-between p-4 shadow-lg cursor-default"
            style={{ background: card.bg, borderColor: card.border, zIndex: card.z }}
            initial={{ rotate: card.rotate, x: "-50%", y: "-50%", translateX: card.x, translateY: card.y }}
            whileHover={{ rotate: card.rotate * 1.5, y: -10 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}>
            <div className="flex flex-col gap-1.5">
              {[100, 75, 60, 80, 40].map((w, j) => <div key={j} className="h-1.5 bg-white/60 rounded-full" style={{ width: `${w}%` }} />)}
            </div>
            <div className="self-start bg-[#DF0A09] text-white text-[9px] font-bold px-2 py-0.5 rounded">PDF</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function QrGeneratorVisual() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#E8E8E8] shadow-lg">
          <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
            <rect width="160" height="160" rx="4" fill="#111"/>
            {[0,1,2,3,4,5,6].map(x => [0,1,2,3,4,5,6].map(y => {
              const isEdge = x===0||x===6||y===0||y===6; const isInner = x>=2&&x<=4&&y>=2&&y<=4;
              return (isEdge||isInner) ? <rect key={`tl-${x}-${y}`} x={8+x*9} y={8+y*9} width="8" height="8" rx="1" fill="white"/> : null;
            }))}
            {[0,1,2,3,4,5,6].map(x => [0,1,2,3,4,5,6].map(y => {
              const isEdge = x===0||x===6||y===0||y===6; const isInner = x>=2&&x<=4&&y>=2&&y<=4;
              return (isEdge||isInner) ? <rect key={`tr-${x}-${y}`} x={100+x*9} y={8+y*9} width="8" height="8" rx="1" fill="white"/> : null;
            }))}
            {[0,1,2,3,4,5,6].map(x => [0,1,2,3,4,5,6].map(y => {
              const isEdge = x===0||x===6||y===0||y===6; const isInner = x>=2&&x<=4&&y>=2&&y<=4;
              return (isEdge||isInner) ? <rect key={`bl-${x}-${y}`} x={8+x*9} y={100+y*9} width="8" height="8" rx="1" fill="white"/> : null;
            }))}
            {[72,81,90,99,108,117,126].map(x => [72,81,90,99,108,117,126].map(y => {
              const hash = (x * 17 + y * 31) % 3;
              return hash === 0 ? <rect key={`d-${x}-${y}`} x={x} y={y} width="8" height="8" rx="1" fill="white"/> : null;
            }))}
          </svg>
        </div>
        <p className="text-[12px] text-[#888] font-medium">Scan to visit →</p>
      </div>
    </div>
  );
}

function PasswordGeneratorVisual() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&";
  const [password, setPassword] = useState("K#9mP$vX2qR@nL8w");
  useEffect(() => {
    const generate = () => Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    const t = setInterval(() => setPassword(generate()), 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-[300px] bg-[#0A0A0A] rounded-2xl p-6 border border-[#1A1A1A] shadow-2xl">
        <p className="text-[11px] font-bold text-[#DF0A09] uppercase tracking-widest mb-3">Generated Password</p>
        <div className="bg-[#111] rounded-xl px-4 py-3 mb-4 border border-[#222]">
          <p className="font-mono text-[14px] text-[#eee] tracking-wider break-all">{password}</p>
        </div>
        <p className="text-[10px] text-[#555] uppercase tracking-widest mb-2">Strength</p>
        <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full bg-[#DF0A09]" animate={{ width: "92%" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[#555]">Very Strong</span>
          <span className="text-[10px] text-[#DF0A09] font-bold">128-bit entropy</span>
        </div>
      </div>
    </div>
  );
}

const PALETTE_COLORS = ["#E8E8E8", "#D0D0D0", "#DF0A09", "#B30807", "#111111"];

function ColorPaletteVisual() {
  const [heights, setHeights] = useState([60, 80, 100, 75, 50]);
  useEffect(() => {
    const t = setInterval(() => setHeights(PALETTE_COLORS.map(() => 40 + Math.random() * 60)), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex items-end gap-2 h-[160px]">
        {PALETTE_COLORS.map((color, i) => (
          <motion.div key={color} className="w-14 rounded-t-xl" style={{ background: color, border: "1px solid rgba(0,0,0,0.05)" }}
            animate={{ height: `${heights[i]}%` }} transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }} />
        ))}
      </div>
    </div>
  );
}

function WordCounterVisual() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const target = 247;
    const timer = setTimeout(() => {
      const step = setInterval(() => setCount((v) => { if (v >= target) { clearInterval(step); return target; } return v + 3; }), 16);
      return () => clearInterval(step);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-[300px] flex flex-col gap-3">
        <div className="bg-[#F7F7F7] rounded-xl p-3 border border-[#E8E8E8] min-h-[80px]">
          <p className="text-[12px] text-[#555] leading-relaxed">The quick brown fox jumps over the lazy dog. Sample text to demonstrate the word counter...</p>
          <span className="inline-block w-0.5 h-3 bg-[#DF0A09] animate-pulse ml-0.5" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[["Words", count], ["Characters", Math.round(count * 5.1)], ["Reading time", "~1 min"], ["Sentences", Math.round(count / 12)]].map(([label, val]) => (
            <div key={String(label)} className="bg-white rounded-xl p-3 border border-[#E8E8E8] text-center">
              <p className="text-[18px] font-black text-[#111]">{val}</p>
              <p className="text-[10px] text-[#888]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const RESIZER_PRESETS = ["1080×1080", "1200×630", "1500×500", "800×800"];
const RESIZER_DIMS = [{ w: 160, h: 160 }, { w: 200, h: 105 }, { w: 200, h: 67 }, { w: 140, h: 140 }];

function ImageResizerVisual() {
  const [preset, setPreset] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPreset((v) => (v + 1) % RESIZER_PRESETS.length), 2000);
    return () => clearInterval(t);
  }, []);
  const dims = RESIZER_DIMS;
  const presets = RESIZER_PRESETS;
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <motion.div className="bg-[#F0F0F0] rounded-xl border-2 border-dashed border-[#DF0A09] overflow-hidden flex items-center justify-center"
            animate={{ width: dims[preset].w, height: dims[preset].h }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <div className="w-full h-full bg-gradient-to-br from-[#E8E8E8] to-[#C8C8C8]" />
          </motion.div>
          {[["top-0 left-0", "-translate-x-1/2 -translate-y-1/2"], ["top-0 right-0", "translate-x-1/2 -translate-y-1/2"], ["bottom-0 left-0", "-translate-x-1/2 translate-y-1/2"], ["bottom-0 right-0", "translate-x-1/2 translate-y-1/2"]].map(([pos, translate], i) => (
            <div key={i} className={`absolute ${pos} w-3 h-3 bg-[#DF0A09] rounded-sm ${translate}`} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={preset} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="bg-[#DF0A09] text-white text-[12px] font-bold px-4 py-1.5 rounded-full">
            {presets[preset]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function BgRemoverVisual() {
  return (
    <div className="flex items-center justify-center w-full h-full gap-4">
      <div className="flex flex-col items-center gap-2">
        <div className="w-[120px] h-[140px] rounded-xl overflow-hidden border border-[#E8E8E8] shadow-md bg-[#E8E8E8] flex items-end justify-center pb-3">
          <div className="w-14 h-24 rounded-full bg-[#AAAAAA]" />
        </div>
        <p className="text-[11px] text-[#888] font-medium">Before</p>
      </div>
      <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-[#DF0A09] text-xl font-bold">→</motion.div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-[120px] h-[140px] rounded-xl overflow-hidden border border-[#E8E8E8] shadow-md checkerboard flex items-end justify-center pb-3">
          <div className="w-14 h-24 rounded-full bg-[#AAAAAA]" />
        </div>
        <p className="text-[11px] text-[#888] font-medium">After</p>
      </div>
    </div>
  );
}

function AgeCalculatorVisual() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const totalSecs = 857304182 + seconds;
  const days = Math.floor(totalSecs / 86400);
  const hrs = Math.floor((totalSecs % 86400) / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-[140px] h-[140px]">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="60" fill="none" stroke="#F0F0F0" strokeWidth="8"/>
            <motion.circle cx="70" cy="70" r="60" fill="none" stroke="#DF0A09" strokeWidth="8" strokeLinecap="round"
              strokeDasharray="376.99" initial={{ strokeDashoffset: 376.99 }} animate={{ strokeDashoffset: 376.99 * 0.18 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} transform="rotate(-90 70 70)" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[28px] font-black text-[#111]">27</span>
            <span className="text-[11px] text-[#888]">years old</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[["Days", days.toLocaleString()], ["Hrs", String(hrs).padStart(2, "0")], ["Mins", String(mins).padStart(2, "0")], ["Secs", String(secs).padStart(2, "0")]].map(([label, val]) => (
            <div key={String(label)} className="flex flex-col items-center gap-0.5 bg-[#F7F7F7] rounded-xl p-2 min-w-[56px]">
              <span className="text-[14px] font-black text-[#111] font-mono">{val}</span>
              <span className="text-[9px] text-[#888]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const CURRENCY_PAIRS = [
  { pair: "USD / EUR", rate: "0.9182" }, { pair: "GBP / USD", rate: "1.2641" },
  { pair: "USD / JPY", rate: "149.82" }, { pair: "AUD / USD", rate: "0.6529" },
  { pair: "USD / CHF", rate: "0.8834" }, { pair: "CAD / USD", rate: "0.7381" },
];

function CurrencyConverterVisual() {
  const [highlighted, setHighlighted] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setHighlighted((v) => (v + 1) % CURRENCY_PAIRS.length), 1500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-[260px] bg-[#0A0A0A] rounded-2xl overflow-hidden border border-[#1A1A1A] shadow-2xl">
        <div className="px-4 py-3 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#DF0A09] animate-pulse" />
            <span className="text-[11px] font-bold text-[#DF0A09] uppercase tracking-widest">Live Rates</span>
          </div>
        </div>
        <div className="flex flex-col">
          {CURRENCY_PAIRS.map((p, i) => (
            <motion.div key={p.pair} className="flex items-center justify-between px-4 py-2.5 border-b border-[#111]"
              animate={{ background: highlighted === i ? "#1A1A1A" : "transparent" }} transition={{ duration: 0.3 }}>
              <span className="text-[12px] text-[#666] font-mono">{p.pair}</span>
              <span className="text-[12px] font-bold text-[#eee] font-mono">{p.rate}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

const UNIT_CONVERSIONS = [
  { from: "1 km", to: "0.621 mi" }, { from: "100°C", to: "212°F" },
  { from: "1 kg", to: "2.205 lb" }, { from: "1 L", to: "0.264 gal" },
];

function UnitConverterVisual() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % UNIT_CONVERSIONS.length), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-[280px] flex flex-col gap-3">
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-3">
            <div className="flex-1 bg-white rounded-2xl border border-[#E8E8E8] shadow-sm p-4 text-center">
              <p className="text-[28px] font-black text-[#111]">{UNIT_CONVERSIONS[idx].from.split(" ")[0]}</p>
              <p className="text-[12px] text-[#DF0A09] font-bold">{UNIT_CONVERSIONS[idx].from.split(" ").slice(1).join(" ")}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#DF0A09] flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 4l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1 bg-[#F5F5F5] rounded-2xl border border-[#E0E0E0] shadow-sm p-4 text-center">
              <p className="text-[28px] font-black text-[#DF0A09]">{UNIT_CONVERSIONS[idx].to.split(" ")[0]}</p>
              <p className="text-[12px] text-[#888] font-bold">{UNIT_CONVERSIONS[idx].to.split(" ").slice(1).join(" ")}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <p className="text-[11px] text-center text-[#888]">Converts instantly as you type</p>
      </div>
    </div>
  );
}

const VISUAL_MAP: Record<string, React.ComponentType> = {
  "image-compressor": ImageCompressorVisual,
  "resume-builder": ResumeBuilderVisual,
  "pdf-toolkit": PdfToolkitVisual,
  "qr-generator": QrGeneratorVisual,
  "password-generator": PasswordGeneratorVisual,
  "color-palette": ColorPaletteVisual,
  "word-counter": WordCounterVisual,
  "image-resizer": ImageResizerVisual,
  "bg-remover": BgRemoverVisual,
  "age-calculator": AgeCalculatorVisual,
  "currency-converter": CurrencyConverterVisual,
  "unit-converter": UnitConverterVisual,
};

interface ToolHeroVisualProps {
  slug: string;
}

export default function ToolHeroVisual({ slug }: ToolHeroVisualProps) {
  const Visual = VISUAL_MAP[slug];
  if (!Visual) return null;
  return <Visual />;
}
