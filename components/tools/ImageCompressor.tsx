"use client";

import { useState, useRef, useEffect, useCallback, type DragEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Download, AlertCircle, X } from "lucide-react";

type OutputFormat =
  | "image/webp"
  | "image/jpeg"
  | "image/png"
  | "image/avif"
  | "image/bmp";

interface CompressResult {
  url: string;
  size: number;
  format: OutputFormat;
}

interface FormatOption {
  value: OutputFormat;
  label: string;
  lossy: boolean;
  hint: string;
}

const OUTPUT_FORMATS: FormatOption[] = [
  { value: "image/webp", label: "WebP", lossy: true, hint: "Best size for web" },
  { value: "image/jpeg", label: "JPEG", lossy: true, hint: "Photos, wide support" },
  { value: "image/png", label: "PNG", lossy: false, hint: "Lossless + transparency" },
  { value: "image/avif", label: "AVIF", lossy: true, hint: "Smallest modern format" },
  { value: "image/bmp", label: "BMP", lossy: false, hint: "Uncompressed bitmap" },
];

const ACCEPT_INPUT =
  "image/png,image/jpeg,image/jpg,image/webp,image/gif,image/bmp,image/avif,image/svg+xml,.png,.jpg,.jpeg,.webp,.gif,.bmp,.avif,.svg";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatExt(fmt: OutputFormat): string {
  return {
    "image/webp": "webp",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/avif": "avif",
    "image/bmp": "bmp",
  }[fmt];
}

function canEncodeFormat(mime: string): Promise<boolean> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 2;
    try {
      canvas.toBlob(
        (blob) => resolve(!!blob && blob.type === mime),
        mime,
        0.8
      );
    } catch {
      resolve(false);
    }
  });
}

function compressCanvas(file: File, quality: number, fmt: OutputFormat): Promise<CompressResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(src);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }

      if (fmt === "image/jpeg" || fmt === "image/bmp") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const isLossy = fmt === "image/webp" || fmt === "image/jpeg" || fmt === "image/avif";
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error(`This browser cannot encode ${formatExt(fmt).toUpperCase()}.`));
            return;
          }
          resolve({
            url: URL.createObjectURL(blob),
            size: blob.size,
            format: fmt,
          });
        },
        fmt,
        isLossy ? quality / 100 : undefined
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error("Failed to load image"));
    };
    img.src = src;
  });
}

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>("image/webp");
  const [supported, setSupported] = useState<Record<OutputFormat, boolean>>({
    "image/webp": true,
    "image/jpeg": true,
    "image/png": true,
    "image/avif": false,
    "image/bmp": false,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultUrlRef = useRef<string | null>(null);
  const runIdRef = useRef(0);

  const activeMeta = OUTPUT_FORMATS.find((f) => f.value === format) ?? OUTPUT_FORMATS[0];
  const qualityEnabled = activeMeta.lossy;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        OUTPUT_FORMATS.map(async (f) => [f.value, await canEncodeFormat(f.value)] as const)
      );
      if (cancelled) return;
      const next = Object.fromEntries(entries) as Record<OutputFormat, boolean>;
      // Core formats stay available even if detection flakes
      next["image/webp"] = true;
      next["image/jpeg"] = true;
      next["image/png"] = true;
      setSupported(next);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const revokeResult = useCallback(() => {
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
  }, []);

  // Live compression whenever file, quality, or format changes
  useEffect(() => {
    if (!file) return;
    if (!supported[format]) {
      setError(`${activeMeta.label} is not supported in this browser. Pick another format.`);
      setResult(null);
      setBusy(false);
      return;
    }

    const runId = ++runIdRef.current;
    const delay = qualityEnabled ? 180 : 40;
    setBusy(true);
    setError(null);

    const timer = window.setTimeout(async () => {
      try {
        const next = await compressCanvas(file, quality, format);
        if (runId !== runIdRef.current) {
          URL.revokeObjectURL(next.url);
          return;
        }
        revokeResult();
        resultUrlRef.current = next.url;
        setResult(next);
      } catch (err) {
        if (runId !== runIdRef.current) return;
        revokeResult();
        setResult(null);
        setError(err instanceof Error ? err.message : "Compression failed.");
      } finally {
        if (runId === runIdRef.current) setBusy(false);
      }
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [file, quality, format, supported, qualityEnabled, activeMeta.label, revokeResult]);

  useEffect(() => {
    return () => {
      revokeResult();
    };
  }, [revokeResult]);

  const load = (incoming: File) => {
    const okType =
      incoming.type.startsWith("image/") ||
      /\.(png|jpe?g|webp|gif|bmp|avif|svg)$/i.test(incoming.name);
    if (!okType) {
      setError("Please upload a PNG, JPG, WEBP, GIF, BMP, AVIF, or SVG image.");
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    revokeResult();
    setResult(null);
    setFile(incoming);
    setPreviewUrl(URL.createObjectURL(incoming));
    setError(null);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) load(f);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) load(f);
    e.target.value = "";
  };

  const download = () => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `${file.name.replace(/\.[^.]+$/, "")}_compressed.${formatExt(result.format)}`;
    a.click();
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    revokeResult();
    runIdRef.current += 1;
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setBusy(false);
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
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          animate={{ scale: isDragging ? 1.02 : 1 }}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-12 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-brand-red bg-brand-redLight"
              : "border-brand-border hover:border-brand-red/50 hover:bg-brand-surface"
          }`}
        >
          <Upload className="w-8 h-8 text-brand-muted" />
          <p className="text-sm text-brand-muted text-center">Drop an image here or click to upload</p>
          <p className="text-xs text-brand-muted/60">PNG, JPG, WEBP, GIF, BMP, AVIF, SVG</p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_INPUT}
            className="hidden"
            onChange={onChange}
          />
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-brand-text font-medium flex justify-between">
                <span>Quality</span>
                <span className="text-brand-red">
                  {qualityEnabled ? `${quality}%` : "Lossless"}
                </span>
              </label>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                disabled={!qualityEnabled}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-brand-red disabled:opacity-40"
              />
              <p className="text-xs text-brand-muted">
                {qualityEnabled
                  ? "Updates live as you drag. ~70–85% usually gives the best size."
                  : "PNG and BMP are lossless, so quality does not apply."}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-brand-text font-medium">Output Format</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {OUTPUT_FORMATS.map((f) => {
                  const enabled = supported[f.value];
                  const active = format === f.value;
                  return (
                    <button
                      key={f.value}
                      type="button"
                      title={enabled ? f.hint : `${f.label} not supported in this browser`}
                      disabled={!enabled}
                      onClick={() => setFormat(f.value)}
                      className={`py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${
                        !enabled
                          ? "border-brand-border/60 text-brand-muted/40 cursor-not-allowed"
                          : active
                            ? "bg-brand-redLight border-brand-red/30 text-brand-red"
                            : "border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-text/30"
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-brand-muted">
                {activeMeta.label}: {activeMeta.hint}. Preview updates instantly.
              </p>
            </div>
          </div>

          {busy && (
            <div className="h-1 bg-brand-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-brand-red rounded-full"
                initial={{ width: "20%" }}
                animate={{ width: "90%" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(
              [
                {
                  label: "Original",
                  url: previewUrl,
                  size: file.size,
                  badge: null as string | null,
                },
                {
                  label: `Output (${activeMeta.label})`,
                  url: result?.url ?? null,
                  size: result?.size ?? null,
                  badge:
                    result && reduction > 0
                      ? `-${reduction}%`
                      : result && reduction < 0
                        ? `+${Math.abs(reduction)}%`
                        : result
                          ? "same"
                          : null,
                },
              ] as const
            ).map(({ label, url, size, badge }) => (
              <div key={label} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-brand-muted">{label}</span>
                  {size !== null && (
                    <span className="text-xs text-brand-text flex items-center gap-1">
                      {formatBytes(size)}
                      {badge && badge !== "same" && (
                        <span
                          className={`ml-1 font-semibold ${
                            badge.startsWith("-") ? "text-green-600" : "text-amber-600"
                          }`}
                        >
                          {badge}
                        </span>
                      )}
                    </span>
                  )}
                  {size === null && busy && (
                    <span className="text-xs text-brand-muted">Compressing…</span>
                  )}
                </div>
                <div className="bg-brand-surface rounded-xl overflow-hidden aspect-video flex items-center justify-center border border-brand-border">
                  {url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt={label} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <p className="text-xs text-brand-muted/60">
                      {busy ? "Updating preview…" : ""}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <AnimatePresence>
              {result && (
                <motion.button
                  key="download"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={download}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-red text-white text-sm font-medium hover:bg-brand-redDark transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download {activeMeta.label} ({formatBytes(result.size)})
                </motion.button>
              )}
            </AnimatePresence>
            <button
              onClick={reset}
              aria-label="Remove image"
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
