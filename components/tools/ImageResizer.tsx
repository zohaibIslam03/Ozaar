"use client";

import {
  useState,
  useRef,
  useEffect,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { motion } from "framer-motion";
import { Upload, X, Download, Lock, Unlock, AlertCircle } from "lucide-react";

type ResizeMode = "custom" | "presets" | "scale";
type OutputFormat = "image/png" | "image/jpeg";

interface OriginalImage {
  file: File;
  url: string;
  width: number;
  height: number;
}

const PRESETS = [
  { label: "Instagram Post", w: 1080, h: 1080 },
  { label: "Twitter Header", w: 1500, h: 500 },
  { label: "LinkedIn Cover", w: 1584, h: 396 },
  { label: "YouTube Thumbnail", w: 1280, h: 720 },
  { label: "Facebook Cover", w: 820, h: 312 },
] as const;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function calcCropNatural(
  origW: number,
  origH: number,
  outW: number,
  outH: number
): { w: number; h: number } {
  if (!outW || !outH) return { w: origW, h: origH };
  if (outW <= origW && outH <= origH) return { w: outW, h: outH };
  const s = Math.min(origW / outW, origH / outH);
  return { w: Math.round(outW * s), h: Math.round(outH * s) };
}

const TABS: { id: ResizeMode; label: string }[] = [
  { id: "custom", label: "Custom Size" },
  { id: "presets", label: "Social Presets" },
  { id: "scale", label: "Scale %" },
];

export default function ImageResizer() {
  // ── File state ───────────────────────────────────────────────────────────────
  const [original, setOriginal] = useState<OriginalImage | null>(null);
  const [isFileDragging, setIsFileDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // ── Resize controls ──────────────────────────────────────────────────────────
  const [mode, setMode] = useState<ResizeMode>("custom");
  const [targetW, setTargetW] = useState(0);
  const [targetH, setTargetH] = useState(0);
  const [scale, setScale] = useState(100);
  const [locked, setLocked] = useState(true);
  const [format, setFormat] = useState<OutputFormat>("image/png");
  const [quality, setQuality] = useState(85);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Crop state ───────────────────────────────────────────────────────────────
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [isCropDragging, setIsCropDragging] = useState(false);
  const [cropDragStart, setCropDragStart] = useState({ x: 0, y: 0 });
  const [cropDragStartCrop, setCropDragStartCrop] = useState({ x: 0, y: 0 });
  const [containerWidth, setContainerWidth] = useState(600);

  // ── Container width measurement ──────────────────────────────────────────────
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.offsetWidth || 600);
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Derived values ───────────────────────────────────────────────────────────
  const aspectRatio = original ? original.width / original.height : 1;

  const displayW =
    mode === "scale" && original
      ? Math.round(original.width * (scale / 100))
      : targetW;
  const displayH =
    mode === "scale" && original
      ? Math.round(original.height * (scale / 100))
      : targetH;

  const origW = original?.width ?? 0;
  const origH = original?.height ?? 0;
  const outputWidth = displayW;
  const outputHeight = displayH;

  const origAspect = origW > 0 && origH > 0 ? origW / origH : 1;
  const outAspect =
    outputWidth > 0 && outputHeight > 0 ? outputWidth / outputHeight : 1;
  const sameAspect = Math.abs(origAspect - outAspect) < 0.005;

  const { w: cropNaturalW, h: cropNaturalH } =
    original && !sameAspect
      ? calcCropNatural(origW, origH, outputWidth, outputHeight)
      : { w: origW, h: origH };

  const clampedCropX = sameAspect
    ? 0
    : clamp(cropX, 0, Math.max(0, origW - cropNaturalW));
  const clampedCropY = sameAspect
    ? 0
    : clamp(cropY, 0, Math.max(0, origH - cropNaturalH));

  const MAX_DISP_H = 300;
  const displayScale = original
    ? Math.min(containerWidth / origW, MAX_DISP_H / origH, 1)
    : 1;
  const displayImgW = Math.round(origW * displayScale);
  const displayImgH = Math.round(origH * displayScale);

  // ── Auto-center crop when output size changes ────────────────────────────────
  useEffect(() => {
    if (!origW || !origH || !outputWidth || !outputHeight) return;
    const localSame =
      Math.abs(origW / origH - outputWidth / outputHeight) < 0.005;
    if (localSame) return;
    const { w: cnw, h: cnh } = calcCropNatural(
      origW, origH, outputWidth, outputHeight
    );
    setCropX(Math.max(0, (origW - cnw) / 2));
    setCropY(Math.max(0, (origH - cnh) / 2));
  }, [outputWidth, outputHeight, origW, origH]);

  // ── Crop drag handlers ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isCropDragging) return;

    const move = (clientX: number, clientY: number) => {
      const dx = (clientX - cropDragStart.x) / displayScale;
      const dy = (clientY - cropDragStart.y) / displayScale;
      setCropX(clamp(cropDragStartCrop.x + dx, 0, Math.max(0, origW - cropNaturalW)));
      setCropY(clamp(cropDragStartCrop.y + dy, 0, Math.max(0, origH - cropNaturalH)));
    };

    const onMouseMove = (e: MouseEvent) => move(e.clientX, e.clientY);
    const onMouseUp = () => setIsCropDragging(false);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) move(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => setIsCropDragging(false);

    document.body.style.cursor = "grabbing";
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [
    isCropDragging, cropDragStart, cropDragStartCrop,
    displayScale, origW, origH, cropNaturalW, cropNaturalH,
  ]);

  // ── File loading ─────────────────────────────────────────────────────────────
  const load = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a PNG, JPG, WEBP, or GIF image.");
      return;
    }
    if (original) URL.revokeObjectURL(original.url);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOriginal({ file, url, width: img.naturalWidth, height: img.naturalHeight });
      setTargetW(img.naturalWidth);
      setTargetH(img.naturalHeight);
      setScale(100);
      setCropX(0);
      setCropY(0);
      setError(null);
    };
    img.onerror = () => { URL.revokeObjectURL(url); setError("Failed to load image."); };
    img.src = url;
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsFileDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) load(f);
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) load(f);
    e.target.value = "";
  };

  const changeW = (v: number) => {
    setTargetW(v);
    if (locked) setTargetH(Math.round(v / aspectRatio));
  };
  const changeH = (v: number) => {
    setTargetH(v);
    if (locked) setTargetW(Math.round(v * aspectRatio));
  };
  const applyScale = (s: number) => {
    if (!original) return;
    setScale(s);
    setTargetW(Math.round(original.width * (s / 100)));
    setTargetH(Math.round(original.height * (s / 100)));
  };
  const applyPreset = (w: number, h: number) => { setTargetW(w); setTargetH(h); };

  const handleCropDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCropDragging(true);
    setCropDragStart({ x: e.clientX, y: e.clientY });
    setCropDragStartCrop({ x: clampedCropX, y: clampedCropY });
  };
  const handleCropTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    setIsCropDragging(true);
    setCropDragStart({ x: t.clientX, y: t.clientY });
    setCropDragStartCrop({ x: clampedCropX, y: clampedCropY });
  };

  // ── Download with crop ───────────────────────────────────────────────────────
  const download = () => {
    if (!original) return;
    setBusy(true);
    setError(null);
    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) { setError("Canvas not supported."); setBusy(false); return; }
    if (format === "image/jpeg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, outputWidth, outputHeight); }
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, clampedCropX, clampedCropY, cropNaturalW, cropNaturalH, 0, 0, outputWidth, outputHeight);
      canvas.toBlob(
        (blob) => {
          if (!blob) { setError("Failed to export image."); setBusy(false); return; }
          const ext = format === "image/png" ? "png" : "jpg";
          const base = original.file.name.replace(/\.[^.]+$/, "");
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${base}_${outputWidth}x${outputHeight}.${ext}`;
          a.click();
          URL.revokeObjectURL(url);
          setBusy(false);
        },
        format,
        format === "image/png" ? undefined : quality / 100
      );
    };
    img.onerror = () => { setError("Failed to load image for export."); setBusy(false); };
    img.src = original.url;
  };

  const reset = () => {
    if (original) URL.revokeObjectURL(original.url);
    setOriginal(null);
    setError(null);
    setScale(100);
    setCropX(0);
    setCropY(0);
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <motion.div
      ref={mainRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      {!original ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsFileDragging(true); }}
          onDragLeave={() => setIsFileDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-12 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
            isFileDragging
              ? "border-brand-red bg-brand-red/5"
              : "border-brand-border hover:border-brand-red/50 hover:bg-white/[0.02]"
          }`}
        >
          <Upload className="w-8 h-8 text-brand-muted" />
          <p className="text-sm text-brand-muted text-center">Drop an image here or click to upload</p>
          <p className="text-xs text-brand-muted/60">PNG, JPG, WEBP, GIF supported</p>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
        </div>
      ) : (
        <>
          {/* File info bar */}
          <div className="flex items-center gap-3 bg-brand-surface border border-brand-border rounded-lg px-4 py-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={original.url} alt="preview" className="w-12 h-12 object-cover rounded-md shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-brand-text truncate">{original.file.name}</p>
              <p className="text-xs text-brand-muted">
                {original.width} × {original.height}px · {formatBytes(original.file.size)}
              </p>
            </div>
            <button onClick={reset} aria-label="Remove image" className="text-brand-muted/60 hover:text-brand-text transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode tabs */}
          <div className="flex flex-wrap gap-1 bg-brand-surface p-1 rounded-lg w-full sm:w-fit">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setMode(t.id)}
                className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                  mode === t.id ? "bg-brand-red text-white" : "text-brand-muted hover:text-brand-text"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Custom mode */}
          {mode === "custom" && (
            <div className="flex items-end gap-3 flex-wrap">
              <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
                <label className="text-xs text-brand-muted">Width (px)</label>
                <input
                  type="number" min={1} value={targetW}
                  onChange={(e) => changeW(Number(e.target.value))}
                  className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors"
                />
              </div>
              <button
                onClick={() => setLocked((v) => !v)}
                className="p-2 rounded-lg border border-brand-border text-brand-muted hover:text-brand-text transition-colors"
                aria-label={locked ? "Unlock aspect ratio" : "Lock aspect ratio"}
              >
                {locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
              <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
                <label className="text-xs text-brand-muted">Height (px)</label>
                <input
                  type="number" min={1} value={targetH}
                  onChange={(e) => changeH(Number(e.target.value))}
                  className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors"
                />
              </div>
              <p className="text-xs text-brand-muted/60 w-full sm:w-auto">
                {locked ? "Aspect ratio locked" : "Aspect ratio unlocked"}
              </p>
            </div>
          )}

          {/* Presets mode */}
          {mode === "presets" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p.w, p.h)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                    targetW === p.w && targetH === p.h
                      ? "bg-brand-red/10 border-brand-red/30 text-brand-text"
                      : "border-brand-border text-brand-muted hover:border-brand-text/30 hover:text-brand-text"
                  }`}
                >
                  <span className="text-sm font-medium">{p.label}</span>
                  <span className="text-xs font-mono">{p.w} × {p.h}</span>
                </button>
              ))}
            </div>
          )}

          {/* Scale mode */}
          {mode === "scale" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-brand-text font-medium flex justify-between">
                <span>Scale</span>
                <span className="text-brand-red">{scale}%</span>
              </label>
              <input
                type="range" min={10} max={200} value={scale}
                onChange={(e) => applyScale(Number(e.target.value))}
                className="w-full accent-brand-red"
              />
              <div className="flex justify-between text-xs text-brand-muted/60">
                <span>10%</span><span>100%</span><span>200%</span>
              </div>
            </div>
          )}

          {/* ── CROP SELECTOR ──────────────────────────────────────────────────── */}
          {sameAspect ? (
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
              <p className="text-sm text-gray-600">
                Same aspect ratio — no cropping needed. Image will be scaled to {outputWidth} × {outputHeight}.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-800">Drag to select crop area</p>
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  Drag the box to choose which part to keep
                </span>
              </div>

              <div
                className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 select-none"
                style={{ width: displayImgW, height: displayImgH }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={original.url}
                  alt="Crop preview"
                  className="block pointer-events-none"
                  style={{ width: displayImgW, height: displayImgH, objectFit: "cover" }}
                />

                {/* SVG dark overlay with hole cut out at crop box */}
                <div className="absolute inset-0 pointer-events-none">
                  <svg
                    className="absolute inset-0"
                    style={{ width: displayImgW, height: displayImgH }}
                  >
                    <defs>
                      <mask id="ir-crop-mask">
                        <rect width="100%" height="100%" fill="white" />
                        <rect
                          x={clampedCropX * displayScale}
                          y={clampedCropY * displayScale}
                          width={cropNaturalW * displayScale}
                          height={cropNaturalH * displayScale}
                          fill="black"
                        />
                      </mask>
                    </defs>
                    <rect width="100%" height="100%" fill="rgba(0,0,0,0.5)" mask="url(#ir-crop-mask)" />
                  </svg>
                </div>

                {/* Draggable crop box */}
                <div
                  className="absolute border-2 border-white cursor-move shadow-lg"
                  style={{
                    left: clampedCropX * displayScale,
                    top: clampedCropY * displayScale,
                    width: cropNaturalW * displayScale,
                    height: cropNaturalH * displayScale,
                  }}
                  onMouseDown={handleCropDragStart}
                  onTouchStart={handleCropTouchStart}
                >
                  {/* Corner handles */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-white border-2 border-brand-red rounded-sm pointer-events-none" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-brand-red rounded-sm pointer-events-none" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border-2 border-brand-red rounded-sm pointer-events-none" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-brand-red rounded-sm pointer-events-none" />

                  {/* Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-6 h-px bg-white opacity-60" />
                    <div className="absolute h-6 w-px bg-white opacity-60" />
                  </div>

                  {/* Dimension label */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md pointer-events-none whitespace-nowrap">
                    {outputWidth} × {outputHeight}
                  </div>

                  {/* Rule of thirds */}
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-0 bottom-0 border-r border-white" style={{ left: "33.33%" }} />
                    <div className="absolute top-0 bottom-0 border-r border-white" style={{ left: "66.66%" }} />
                    <div className="absolute left-0 right-0 border-b border-white" style={{ top: "33.33%" }} />
                    <div className="absolute left-0 right-0 border-b border-white" style={{ top: "66.66%" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Output info row — no floating dots */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Original</p>
              <p className="text-sm font-bold text-gray-700">{origW} × {origH}</p>
            </div>
            <span className="text-gray-300 text-lg">→</span>
            {!sameAspect && (
              <>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Crop area</p>
                  <p className="text-sm font-semibold text-gray-500">
                    from ({Math.round(clampedCropX)}, {Math.round(clampedCropY)})
                  </p>
                </div>
                <span className="text-gray-300 text-lg">→</span>
              </>
            )}
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Output</p>
              <p className="text-sm font-bold" style={{ color: "#DF0A09" }}>{outputWidth} × {outputHeight}</p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Format + quality + download */}
          <div className="flex flex-col gap-4 border-t border-brand-border pt-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <label className="text-sm text-brand-text font-medium">Format</label>
                <div className="flex gap-2">
                  {(["image/png", "image/jpeg"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${
                        format === f
                          ? "bg-brand-red/10 border-brand-red/30 text-brand-red"
                          : "border-brand-border text-brand-muted hover:text-brand-text"
                      }`}
                    >
                      {f === "image/png" ? "PNG" : "JPEG"}
                    </button>
                  ))}
                </div>
              </div>
              {format === "image/jpeg" && (
                <div className="flex flex-col gap-2 flex-1 min-w-[160px]">
                  <label className="text-sm text-brand-text font-medium flex justify-between">
                    <span>Quality</span>
                    <span className="text-brand-red">{quality}%</span>
                  </label>
                  <input
                    type="range" min={10} max={100} value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-brand-red"
                  />
                </div>
              )}
            </div>
            <button
              onClick={download}
              disabled={busy || outputWidth < 1 || outputHeight < 1}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg bg-brand-red text-white text-sm font-medium
                hover:bg-brand-red/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              {busy ? "Exporting…" : `Download ${format === "image/png" ? "PNG" : "JPEG"}`}
            </button>
          </div>
        </>
      )}

      {error && !original && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
    </motion.div>
  );
}
