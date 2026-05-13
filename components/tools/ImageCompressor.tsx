"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Download, AlertCircle, X } from "lucide-react";

type OutputFormat = "image/webp" | "image/jpeg" | "image/png";
interface CompressResult { url: string; size: number; }

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatExt(fmt: OutputFormat): string {
  return { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" }[fmt];
}

function compressCanvas(file: File, quality: number, fmt: OutputFormat): Promise<CompressResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(src);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }
      if (fmt === "image/jpeg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => { if (!blob) { reject(new Error("Compression failed")); return; } resolve({ url: URL.createObjectURL(blob), size: blob.size }); },
        fmt, fmt === "image/png" ? undefined : quality / 100
      );
    };
    img.onerror = () => { URL.revokeObjectURL(src); reject(new Error("Failed to load image")); };
    img.src = src;
  });
}

const FORMATS: { value: OutputFormat; label: string }[] = [
  { value: "image/webp", label: "WebP" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png",  label: "PNG" },
];

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>("image/webp");
  const [isDragging, setIsDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = (incoming: File) => {
    if (!incoming.type.startsWith("image/")) { setError("Please upload a PNG, JPG, or WEBP image."); return; }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (result) URL.revokeObjectURL(result.url);
    setFile(incoming); setPreviewUrl(URL.createObjectURL(incoming)); setResult(null); setError(null);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) load(f); };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) load(f); e.target.value = ""; };

  const compress = async () => {
    if (!file) return;
    setBusy(true); setError(null);
    if (result) URL.revokeObjectURL(result.url);
    try { setResult(await compressCanvas(file, quality, format)); }
    catch (err) { setError(err instanceof Error ? err.message : "Compression failed."); }
    finally { setBusy(false); }
  };

  const download = () => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result.url; a.download = `${file.name.replace(/\.[^.]+$/, "")}_compressed.${formatExt(format)}`; a.click();
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (result) URL.revokeObjectURL(result.url);
    setFile(null); setPreviewUrl(null); setResult(null); setError(null);
  };

  const reduction = result && file ? Math.round((1 - result.size / file.size) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      {!file ? (
        <motion.div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          animate={{ scale: isDragging ? 1.02 : 1 }}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-12 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
            isDragging ? "border-brand-red bg-brand-redLight" : "border-brand-border hover:border-brand-red/50 hover:bg-brand-surface"
          }`}
        >
          <Upload className="w-8 h-8 text-brand-muted" />
          <p className="text-sm text-brand-muted text-center">Drop an image here or click to upload</p>
          <p className="text-xs text-brand-muted/60">PNG, JPG, WEBP supported</p>
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onChange} />
        </motion.div>
      ) : (
        <>
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-brand-text font-medium flex justify-between">
                <span>Quality</span>
                <span className="text-brand-red">{quality}%</span>
              </label>
              <input
                type="range" min={10} max={100} value={quality}
                onChange={(e) => { setQuality(Number(e.target.value)); setResult(null); }}
                className="w-full accent-brand-red"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-brand-text font-medium">Output Format</label>
              <div className="flex gap-2">
                {FORMATS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => { setFormat(f.value); setResult(null); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${
                      format === f.value
                        ? "bg-brand-redLight border-brand-red/30 text-brand-red"
                        : "border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-text/30"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Processing bar */}
          {busy && (
            <div className="h-1 bg-brand-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-brand-red rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </div>
          )}

          {/* Two-column preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([ { label: "Original", url: previewUrl, size: file.size, badge: null },
               { label: "Compressed", url: result?.url ?? null, size: result?.size ?? null, badge: result && reduction > 0 ? `-${reduction}%` : null } ] as const
            ).map(({ label, url, size, badge }) => (
              <div key={label} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-brand-muted">{label}</span>
                  {size !== null && (
                    <span className="text-xs text-brand-text flex items-center gap-1">
                      {formatBytes(size)}
                      {badge && <span className="text-green-600 ml-1 font-semibold">{badge}</span>}
                    </span>
                  )}
                </div>
                <div className="bg-brand-surface rounded-xl overflow-hidden aspect-video flex items-center justify-center border border-brand-border">
                  {url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt={label} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <p className="text-xs text-brand-muted/60">
                      {label === "Compressed" ? `Click "Compress" to preview` : ""}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={compress} disabled={busy}
              className="flex-1 inline-flex items-center justify-center py-2.5 rounded-lg bg-brand-red text-white text-sm font-medium hover:bg-brand-redDark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {busy ? "Compressing…" : "Compress"}
            </motion.button>
            <AnimatePresence>
              {result && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  onClick={download}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-brand-red/30 text-brand-red text-sm font-medium hover:bg-brand-redLight transition-colors"
                >
                  <Download className="w-4 h-4" /> Download
                </motion.button>
              )}
            </AnimatePresence>
            <button
              onClick={reset} aria-label="Remove image"
              className="p-2.5 rounded-lg border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-text/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
