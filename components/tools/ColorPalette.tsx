"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Shuffle, Copy, AlertCircle } from "lucide-react";
import {
  generatePalette, hexToRgb, randomHex,
  type ColorSwatch, type HarmonyMode,
} from "@/lib/colorUtils";
import { useToast } from "@/components/Toast";

const MODES: { value: HarmonyMode; label: string }[] = [
  { value: "shades",              label: "Shades" },
  { value: "analogous",           label: "Analogous" },
  { value: "complementary",       label: "Complementary" },
  { value: "triadic",             label: "Triadic" },
  { value: "split-complementary", label: "Split-Comp" },
];

function normHex(hex: string): string {
  const clean = hex.replace("#", "").toLowerCase();
  return `#${clean}`;
}

function isSameHex(a: string, b: string): boolean {
  return normHex(a) === normHex(b);
}

/** Pick readable text colour for a background swatch. */
function contrastText(swatch: ColorSwatch): string {
  return swatch.hsl.l <= 55 ? "#ffffff" : "#111111";
}

function findBaseIndex(palette: ColorSwatch[], baseHex: string): number {
  const exact = palette.findIndex((s) => isSameHex(s.hex, baseHex));
  if (exact >= 0) return exact;
  const base = hexToRgb(baseHex);
  if (!base) return Math.floor(palette.length / 2);
  // Closest by RGB distance
  let best = 0;
  let dist = Infinity;
  palette.forEach((s, i) => {
    const d =
      (s.rgb.r - base.r) ** 2 + (s.rgb.g - base.g) ** 2 + (s.rgb.b - base.b) ** 2;
    if (d < dist) { dist = d; best = i; }
  });
  return best;
}

function SwatchCard({
  swatch,
  index,
  isBase,
  isSelected,
  onSelect,
}: {
  swatch: ColorSwatch;
  index: number;
  isBase: boolean;
  isSelected: boolean;
  onSelect: (swatch: ColorSwatch) => void;
}) {
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
      className={`flex flex-col overflow-hidden rounded-xl border cursor-pointer transition-shadow ${
        isSelected
          ? "border-brand-red ring-2 ring-brand-red/30 shadow-md"
          : isBase
            ? "border-brand-red/50 ring-1 ring-brand-red/20"
            : "border-brand-border"
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <motion.button
        type="button"
        onClick={() => onSelect(swatch)}
        style={{ backgroundColor: hex }}
        animate={{ height: expanded ? 200 : 140 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        aria-label={`Preview ${hex}${isBase ? " (base colour)" : ""}`}
        aria-pressed={isSelected}
        className="relative w-full flex items-center justify-center group overflow-hidden"
      >
        <span className={`absolute top-2 right-2 text-[10px] font-mono opacity-50 ${textClass}`}>
          {swatch.label ?? index + 1}
        </span>
        {isBase && (
          <span
            className={`absolute top-2 left-2 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
              hsl.l > 55 ? "bg-black/70 text-white" : "bg-white/90 text-black"
            }`}
          >
            Base
          </span>
        )}
        <span className={`text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${textClass}`}>
          {isSelected ? "In preview" : "Use in preview"}
        </span>
      </motion.button>

      <div className="bg-white p-3 flex flex-col gap-1.5">
        {values.map(({ label, value }) => (
          <button
            key={label}
            type="button"
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

function BrandPreview({
  selected,
  palette,
}: {
  selected: ColorSwatch | null;
  palette: ColorSwatch[];
}) {
  if (!selected || palette.length === 0) return null;

  const headerBg = selected.hex;
  const headerFg = contrastText(selected);
  const buttonBg = selected.hex;
  const buttonFg = contrastText(selected);

  // Body text: a darker/lighter companion from the palette for readable copy on white
  const body =
    palette.find((s) => s.hsl.l < 35) ??
    palette[palette.length - 1] ??
    selected;

  return (
    <div className="mt-4 rounded-xl border border-brand-border overflow-hidden">
      <div
        className="h-10 flex items-center justify-between gap-3 px-4 transition-colors duration-200"
        style={{ backgroundColor: headerBg }}
      >
        <span className="text-xs font-semibold" style={{ color: headerFg }}>
          Brand Preview
        </span>
        <span className="text-[10px] font-mono opacity-80" style={{ color: headerFg }}>
          {selected.label ? `${selected.label} · ` : ""}
          {selected.hex}
        </span>
      </div>
      <div className="p-4 bg-white flex items-center gap-4">
        <p className="text-sm flex-1" style={{ color: body.hex }}>
          This is how your palette looks in a real UI. Click any swatch to update this preview.
        </p>
        <button
          type="button"
          className="px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200"
          style={{ backgroundColor: buttonBg, color: buttonFg }}
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
  const [mode, setMode] = useState<HarmonyMode>("shades");
  const [palette, setPalette] = useState<ColorSwatch[]>(() => generatePalette("#3B82F6", "shades"));
  const [previewHex, setPreviewHex] = useState("#3b82f6");
  const [error, setError] = useState<string | null>(null);

  const baseIndex = useMemo(() => findBaseIndex(palette, baseHex), [palette, baseHex]);

  const selected = useMemo(() => {
    const match = palette.find((s) => isSameHex(s.hex, previewHex));
    return match ?? palette[baseIndex] ?? palette[0] ?? null;
  }, [palette, previewHex, baseIndex]);

  const apply = (hex: string, harmony: HarmonyMode) => {
    if (!hexToRgb(hex)) { setError("Invalid hex, enter a 6-digit hex code."); return; }
    const next = generatePalette(hex, harmony);
    setError(null);
    setBaseHex(hex);
    setPalette(next);
    // Preview follows the base colour in the new palette
    const idx = findBaseIndex(next, hex);
    setPreviewHex(next[idx]?.hex ?? normHex(hex));
  };

  // Keep preview valid when palette changes externally
  useEffect(() => {
    if (!palette.length) return;
    if (!palette.some((s) => isSameHex(s.hex, previewHex))) {
      setPreviewHex(palette[baseIndex]?.hex ?? palette[0].hex);
    }
  }, [palette, previewHex, baseIndex]);

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
    const isShades = mode === "shades" && palette.every((s) => s.label);
    const text =
      type === "css"
        ? isShades
          ? `:root {\n${palette.map((s) => `  --color-${s.label}: ${s.hex};`).join("\n")}\n}`
          : `:root {\n${palette.map((s, i) => `  --color-${i + 1}: ${s.hex};`).join("\n")}\n}`
        : isShades
          ? `extend: {\n  colors: {\n    brand: {\n${palette.map((s) => `      ${s.label}: '${s.hex}',`).join("\n")}\n    },\n  },\n}`
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
          <label className="text-sm text-brand-text font-medium">Mode</label>
          <div className="flex flex-wrap gap-1">
            {MODES.map((m) => (
              <button
                key={m.value} type="button" onClick={() => handleMode(m.value)}
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
          type="button"
          onClick={randomize}
          className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 rounded-lg border border-brand-border text-brand-muted text-sm hover:text-brand-text hover:border-brand-text/30 transition-all duration-200 self-end"
        >
          <Shuffle className="w-4 h-4" /> Randomize
        </button>
      </div>

      <p className="text-xs text-brand-muted m-0 -mt-2">
        {mode === "shades"
          ? "Your base colour is marked on the scale. Click any swatch to drive the brand preview — dark colours get white text."
          : "Your base colour is marked in the palette. Click any swatch to update the brand preview."}
      </p>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      <div className={`grid gap-3 ${mode === "shades" ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"}`}>
        {palette.map((swatch, i) => (
          <motion.div
            key={`${swatch.hex}-${swatch.label ?? i}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
          >
            <SwatchCard
              swatch={swatch}
              index={i}
              isBase={i === baseIndex}
              isSelected={selected ? isSameHex(swatch.hex, selected.hex) : false}
              onSelect={(s) => setPreviewHex(s.hex)}
            />
          </motion.div>
        ))}
      </div>

      <BrandPreview selected={selected} palette={palette} />

      <div className="flex flex-col sm:flex-row gap-3 border-t border-brand-border pt-5">
        <button
          type="button"
          onClick={() => copyExport("css")}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-red text-white text-sm font-medium hover:bg-brand-redDark transition-colors"
        >
          <Copy className="w-4 h-4" /> Export CSS Variables
        </button>
        <button
          type="button"
          onClick={() => copyExport("tw")}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-brand-border text-brand-muted text-sm font-medium hover:text-brand-text hover:border-brand-text/30 transition-colors"
        >
          <Copy className="w-4 h-4" /> Export Tailwind Config
        </button>
      </div>
    </motion.div>
  );
}
