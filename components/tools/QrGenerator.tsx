"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import { Download, AlertCircle } from "lucide-react";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const SIZES = [128, 256, 512] as const;
type QrSize = (typeof SIZES)[number];

export default function QrGenerator() {
  const [text, setText] = useState("https://ozaar.theinnovations.tech");
  const [size, setSize] = useState<QrSize>(256);
  const [fgColor, setFgColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#000000");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [svgString, setSvgString] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const debouncedText = useDebounce(text, 300);

  const generate = useCallback(
    async (value: string) => {
      if (!value.trim()) {
        setDataUrl(null);
        setSvgString(null);
        return;
      }
      setError(null);
      try {
        const opts = {
          margin: 2,
          color: { dark: fgColor, light: bgColor },
          errorCorrectionLevel: "M" as const,
        };
        const [png, svg] = await Promise.all([
          QRCode.toDataURL(value, { ...opts, width: size }),
          QRCode.toString(value, { ...opts, type: "svg" as const }),
        ]);
        setDataUrl(png);
        setSvgString(svg);
      } catch {
        setError("Could not generate QR code, check your input.");
      }
    },
    [size, fgColor, bgColor]
  );

  useEffect(() => {
    generate(debouncedText);
  }, [debouncedText, generate]);

  const downloadPng = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qrcode.png";
    a.click();
  };

  const downloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const previewSize = Math.min(size, 260);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      {/* Text input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-brand-text font-medium">URL or Text</label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="https://example.com"
          className="bg-brand-surface border border-brand-border rounded-lg px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/60
            focus:outline-none focus:border-brand-red transition-colors"
        />
      </div>

      {/* Color presets */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-brand-text font-medium">Quick Presets</label>
        <div className="flex flex-wrap gap-2">
          {[
            { fg: "#000000", bg: "#FFFFFF", label: "Classic" },
            { fg: "#FFFFFF", bg: "#000000", label: "Inverted" },
            { fg: "#DF0A09", bg: "#FFFFFF", label: "Red" },
            { fg: "#FFFFFF", bg: "#DF0A09", label: "Red BG" },
            { fg: "#1e3a5f", bg: "#f5f0e8", label: "Navy/Cream" },
          ].map((p) => (
            <button
              key={p.label}
              onClick={() => { setFgColor(p.fg); setBgColor(p.bg); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-border text-xs font-medium text-brand-muted hover:text-brand-text hover:border-brand-text/30 transition-all duration-200"
            >
              <span className="flex gap-0.5">
                <span className="w-3 h-3 rounded-sm border border-brand-border/50" style={{ backgroundColor: p.fg }} />
                <span className="w-3 h-3 rounded-sm border border-brand-border/50" style={{ backgroundColor: p.bg }} />
              </span>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Options row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Size */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-brand-text font-medium">Size</label>
          <div className="flex gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  size === s
                    ? "bg-brand-red/10 border-brand-red/30 text-brand-red"
                    : "border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-text/30"
                }`}
              >
                {s}px
              </button>
            ))}
          </div>
        </div>

        {/* Foreground */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-brand-text font-medium">Foreground</label>
          <label className="flex items-center gap-3 bg-brand-surface border border-brand-border rounded-lg px-3 py-2 cursor-pointer hover:border-brand-text/30 transition-colors">
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
            />
            <span className="text-sm text-brand-text font-mono">{fgColor.toUpperCase()}</span>
          </label>
        </div>

        {/* Background */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-brand-text font-medium">Background</label>
          <label className="flex items-center gap-3 bg-brand-surface border border-brand-border rounded-lg px-3 py-2 cursor-pointer hover:border-brand-text/30 transition-colors">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
            />
            <span className="text-sm text-brand-text font-mono">{bgColor.toUpperCase()}</span>
          </label>
        </div>
      </div>

      {/* QR preview */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-8 flex items-center justify-center min-h-[280px]">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt="Generated QR code"
            width={previewSize}
            height={previewSize}
            className="rounded-lg"
          />
        ) : (
          <p className="text-sm text-brand-muted/60">
            {text.trim() ? "Generating…" : "Enter text above to generate a QR code"}
          </p>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Download buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={downloadPng}
          disabled={!dataUrl}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-red text-white text-sm font-medium
            hover:bg-brand-red/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PNG
        </button>
        <button
          onClick={downloadSvg}
          disabled={!svgString}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-brand-border text-brand-muted text-sm font-medium
            hover:text-brand-text hover:border-brand-text/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          Download SVG
        </button>
      </div>
    </motion.div>
  );
}
