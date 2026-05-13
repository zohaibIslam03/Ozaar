"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Upload, X, Download, Lock, Unlock, AlertCircle } from "lucide-react";

type ResizeMode = "custom" | "presets" | "scale";
type OutputFormat = "image/png" | "image/jpeg";

interface OriginalImage {
  file: File;
  img: HTMLImageElement;
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

function resizeBlob(
  img: HTMLImageElement,
  w: number,
  h: number,
  fmt: OutputFormat,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) { reject(new Error("Canvas not supported")); return; }
    if (fmt === "image/jpeg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h); }
    ctx.drawImage(img, 0, 0, w, h);
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("Failed")),
      fmt,
      fmt === "image/png" ? undefined : quality / 100
    );
  });
}

export default function ImageResizer() {
  const [original, setOriginal] = useState<OriginalImage | null>(null);
  const [mode, setMode] = useState<ResizeMode>("custom");
  const [targetW, setTargetW] = useState(0);
  const [targetH, setTargetH] = useState(0);
  const [scale, setScale] = useState(100);
  const [locked, setLocked] = useState(true);
  const [format, setFormat] = useState<OutputFormat>("image/png");
  const [quality, setQuality] = useState(85);
  const [isDragging, setIsDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectRatio = original ? original.width / original.height : 1;

  const load = (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Please upload a PNG, JPG, WEBP, or GIF image."); return; }
    if (original) URL.revokeObjectURL(original.url);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOriginal({ file, img, url, width: img.naturalWidth, height: img.naturalHeight });
      setTargetW(img.naturalWidth);
      setTargetH(img.naturalHeight);
      setScale(100);
      setError(null);
    };
    img.onerror = () => { URL.revokeObjectURL(url); setError("Failed to load image."); };
    img.src = url;
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0]; if (f) load(f);
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (f) load(f); e.target.value = "";
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
    setTargetW(Math.round(original.width * s / 100));
    setTargetH(Math.round(original.height * s / 100));
  };

  const applyPreset = (w: number, h: number) => { setTargetW(w); setTargetH(h); };

  const displayW = mode === "scale" && original ? Math.round(original.width * scale / 100) : targetW;
  const displayH = mode === "scale" && original ? Math.round(original.height * scale / 100) : targetH;

  const download = async () => {
    if (!original) return;
    setBusy(true); setError(null);
    try {
      const blob = await resizeBlob(original.img, displayW, displayH, format, quality);
      const ext = format === "image/png" ? "png" : "jpg";
      const base = original.file.name.replace(/\.[^.]+$/, "");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${base}_${displayW}x${displayH}.${ext}`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resize image.");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    if (original) URL.revokeObjectURL(original.url);
    setOriginal(null); setError(null); setScale(100);
  };

  const TABS: { id: ResizeMode; label: string }[] = [
    { id: "custom", label: "Custom Size" },
    { id: "presets", label: "Social Presets" },
    { id: "scale", label: "Scale %" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      {!original ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-12 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
            isDragging ? "border-brand-red bg-brand-red/5" : "border-brand-border hover:border-brand-red/50 hover:bg-white/[0.02]"
          }`}
        >
          <Upload className="w-8 h-8 text-brand-muted" />
          <p className="text-sm text-brand-muted text-center">Drop an image here or click to upload</p>
          <p className="text-xs text-brand-muted/60">PNG, JPG, WEBP, GIF supported</p>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
        </div>
      ) : (
        <>
          {/* Original info */}
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
                  type="number"
                  min={1}
                  value={targetW}
                  onChange={(e) => changeW(Number(e.target.value))}
                  className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text
                    focus:outline-none focus:border-brand-red transition-colors"
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
                  type="number"
                  min={1}
                  value={targetH}
                  onChange={(e) => changeH(Number(e.target.value))}
                  className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text
                    focus:outline-none focus:border-brand-red transition-colors"
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
                type="range"
                min={10}
                max={200}
                value={scale}
                onChange={(e) => applyScale(Number(e.target.value))}
                className="w-full accent-brand-red"
              />
              <div className="flex justify-between text-xs text-brand-muted/60">
                <span>10%</span><span>100%</span><span>200%</span>
              </div>
            </div>
          )}

          {/* Output preview */}
          <div className="flex flex-wrap items-center gap-3 bg-brand-surface border border-brand-border rounded-xl px-4 sm:px-5 py-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-brand-muted/60 uppercase tracking-wider">Original</span>
              <span className="text-sm text-brand-muted font-mono break-all">{original.width} × {original.height}</span>
            </div>
            <span className="text-brand-muted/50 mx-2">→</span>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-brand-muted/60 uppercase tracking-wider">Output</span>
              <span className="text-sm text-brand-text font-mono font-semibold break-all">{displayW} × {displayH}</span>
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
                    type="range"
                    min={10}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-brand-red"
                  />
                </div>
              )}
            </div>
            <button
              onClick={download}
              disabled={busy || displayW < 1 || displayH < 1}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg bg-brand-red text-white text-sm font-medium
                hover:bg-brand-red/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              {busy ? "Resizing…" : `Download ${format === "image/png" ? "PNG" : "JPEG"}`}
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
