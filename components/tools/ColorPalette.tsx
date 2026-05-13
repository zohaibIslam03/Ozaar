"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shuffle, Copy, AlertCircle } from "lucide-react";
import {
  generatePalette, hexToRgb, randomHex,
  type ColorSwatch, type HarmonyMode,
} from "@/lib/colorUtils";
import { useToast } from "@/components/Toast";

const MODES: { value: HarmonyMode; label: string }[] = [
  { value: "analogous",          label: "Analogous" },
  { value: "complementary",      label: "Complementary" },
  { value: "triadic",            label: "Triadic" },
  { value: "split-complementary",label: "Split-Comp" },
];

function SwatchCard({ swatch, index }: { swatch: ColorSwatch; index: number }) {
  const toast = useToast();
  const [expanded, setExpanded] = useState(false);

  const copy = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    toast(`${label} copied!`, "success");
  };

  const { hex, rgb, hsl } = swatch;
  const textClass = hsl.l > 55 ? "text-black/70" : "text-white/90";
  const values = [
    { label: "HEX", value: hex },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
  ];

  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl border border-brand-border cursor-pointer"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <motion.button
        onClick={() => copy(hex, "HEX")}
        style={{ backgroundColor: hex }}
        animate={{ height: expanded ? 220 : 180 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        aria-label={`Copy hex ${hex}`}
        className="relative w-full flex items-center justify-center group overflow-hidden"
      >
        <span className={`absolute top-2 right-2 text-[10px] font-mono opacity-40 ${textClass}`}>
          {index + 1}
        </span>
        <span className={`text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${textClass}`}>
          Copy HEX
        </span>
      </motion.button>

      <div className="bg-white p-3 flex flex-col gap-1.5">
        {values.map(({ label, value }) => (
          <button
            key={label}
            onClick={() => copy(value, label)}
            aria-label={`Copy ${label} value`}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-brand-surface transition-colors group text-left"
          >
            <span className="text-[10px] text-brand-muted/60 font-mono w-7 shrink-0">{label}</span>
            <span className="text-[10px] text-brand-muted font-mono truncate flex-1 group-hover:text-brand-text transition-colors">
              {value}
            </span>
            <Copy className="w-3 h-3 text-brand-muted/40 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
}

// Mini brand preview using the palette
function BrandPreview({ palette }: { palette: ColorSwatch[] }) {
  if (palette.length < 3) return null;
  const [h1, , btn, , body] = palette;

  return (
    <div className="mt-4 rounded-xl border border-brand-border overflow-hidden">
      <div className="h-10 flex items-center px-4" style={{ backgroundColor: h1.hex }}>
        <span className="text-xs font-semibold" style={{ color: h1.hsl.l > 55 ? "#111" : "#fff" }}>
          Brand Preview
        </span>
      </div>
      <div className="p-4 bg-white flex items-center gap-4">
        <p className="text-sm flex-1" style={{ color: body?.hex ?? "#111" }}>
          This is how your palette looks in a real UI.
        </p>
        <button
          className="px-3 py-1.5 rounded-md text-xs font-semibold"
          style={{ backgroundColor: btn.hex, color: btn.hsl.l > 55 ? "#111" : "#fff" }}
        >
          Button
        </button>
      </div>
    </div>
  );
}

export default function ColorPalette() {
  const toast = useToast();
  const [baseHex, setBaseHex] = useState("#3B82F6");
  const [inputHex, setInputHex] = useState("#3B82F6");
  const [mode, setMode] = useState<HarmonyMode>("analogous");
  const [palette, setPalette] = useState<ColorSwatch[]>(() => generatePalette("#3B82F6", "analogous"));
  const [error, setError] = useState<string | null>(null);

  const apply = (hex: string, harmony: HarmonyMode) => {
    if (!hexToRgb(hex)) { setError("Invalid hex — enter a 6-digit hex code."); return; }
    setError(null); setBaseHex(hex); setPalette(generatePalette(hex, harmony));
  };

  const handleTextInput = (value: string) => {
    setInputHex(value);
    const clean = value.startsWith("#") ? value : `#${value}`;
    if (/^#[0-9a-f]{6}$/i.test(clean)) apply(clean, mode);
  };

  const handlePicker = (value: string) => { setInputHex(value); apply(value, mode); };
  const handleMode = (m: HarmonyMode) => { setMode(m); apply(baseHex, m); };

  const randomize = () => {
    const hex = randomHex(); setInputHex(hex); apply(hex, mode);
  };

  const copyExport = async (type: "css" | "tw") => {
    const text =
      type === "css"
        ? `:root {\n${palette.map((s, i) => `  --color-${i + 1}: ${s.hex};`).join("\n")}\n}`
        : `extend: {\n  colors: {\n${palette.map((s, i) => `    'palette-${i + 1}': '${s.hex}',`).join("\n")}\n  },\n}`;
    await navigator.clipboard.writeText(text);
    toast(type === "css" ? "CSS variables copied!" : "Tailwind config copied!", "success");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      {/* Controls row */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-2 flex-1 min-w-full sm:min-w-[180px]">
          <label className="text-sm text-brand-text font-medium">Base Colour</label>
          <div className="flex items-center gap-2 bg-brand-surface border border-brand-border rounded-lg px-3 py-2 hover:border-brand-text/30 transition-colors">
            <input
              type="color" value={baseHex}
              onChange={(e) => handlePicker(e.target.value)}
              aria-label="Pick base colour"
              className="w-6 h-6 cursor-pointer bg-transparent border-0 p-0 rounded shrink-0"
            />
            <input
              type="text" value={inputHex}
              onChange={(e) => handleTextInput(e.target.value)}
              placeholder="#3B82F6" maxLength={7}
              aria-label="Hex colour value"
              className="flex-1 bg-transparent text-sm text-brand-text font-mono placeholder:text-brand-muted/40 focus:outline-none min-w-0"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-brand-text font-medium">Harmony</label>
          <div className="flex flex-wrap gap-1">
            {MODES.map((m) => (
              <button
                key={m.value} onClick={() => handleMode(m.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  mode === m.value
                    ? "bg-brand-redLight border-brand-red/30 text-brand-red"
                    : "border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-text/30"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={randomize}
          className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 rounded-lg border border-brand-border text-brand-muted text-sm hover:text-brand-text hover:border-brand-text/30 transition-all duration-200 self-end"
        >
          <Shuffle className="w-4 h-4" /> Randomize
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      {/* Swatch grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {palette.map((swatch, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            <SwatchCard swatch={swatch} index={i} />
          </motion.div>
        ))}
      </div>

      {/* Brand preview */}
      <BrandPreview palette={palette} />

      {/* Export buttons */}
      <div className="flex flex-col sm:flex-row gap-3 border-t border-brand-border pt-5">
        <button
          onClick={() => copyExport("css")}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-red text-white text-sm font-medium hover:bg-brand-redDark transition-colors"
        >
          <Copy className="w-4 h-4" /> Export CSS Variables
        </button>
        <button
          onClick={() => copyExport("tw")}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-brand-border text-brand-muted text-sm font-medium hover:text-brand-text hover:border-brand-text/30 transition-colors"
        >
          <Copy className="w-4 h-4" /> Export Tailwind Config
        </button>
      </div>
    </motion.div>
  );
}
