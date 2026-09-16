"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Upload, X, Download, AlertCircle, Info } from "lucide-react";
import { removeBackgroundInWorker } from "@/lib/bg-removal-client";

interface OriginalImage {
  file: File;
  url: string;
}

function addSolidBackground(transparentBlob: Blob, color: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const src = URL.createObjectURL(transparentBlob);
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
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Failed to export PNG"))),
        "image/png"
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error("Failed to composite background colour"));
    };
    img.src = src;
  });
}

const CHECKERBOARD: React.CSSProperties = {
  backgroundImage: `
    linear-gradient(45deg, #d0d0d0 25%, transparent 25%),
    linear-gradient(-45deg, #d0d0d0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #d0d0d0 75%),
    linear-gradient(-45deg, transparent 75%, #d0d0d0 75%)
  `,
  backgroundSize: "16px 16px",
  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
  backgroundColor: "#F7F7F7",
};

function toUserError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();

  if (
    lower.includes("failed to fetch") ||
    lower.includes("network") ||
    lower.includes("publicpath") ||
    lower.includes("resource metadata") ||
    (lower.includes("resource ") && lower.includes("not found")) ||
    lower.includes("load the ai model") ||
    lower.includes("create session")
  ) {
    return "Failed to load the AI model. Please check your internet connection and try again.";
  }

  if (
    lower.includes("unsupported") ||
    lower.includes("decode") ||
    lower.includes("corrupt") ||
    lower.includes("invalid image") ||
    lower.includes("mime")
  ) {
    return "This image format isn’t supported or the file looks corrupted. Try a PNG, JPG, or WEBP.";
  }

  if (lower.includes("canvas") || lower.includes("memory") || lower.includes("allocation")) {
    return "Couldn’t process this image on your device. Try a smaller image.";
  }

  return "Background removal failed. Please try a different image.";
}

export default function BgRemover() {
  const [original, setOriginal] = useState<OriginalImage | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  /** null = indeterminate (no fake 0% during inference) */
  const [progress, setProgress] = useState<number | null>(null);
  const [progressLabel, setProgressLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useSolidBg, setUseSolidBg] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inFlightRef = useRef(false);

  const load = (file: File) => {
    if (inFlightRef.current || busy) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    if (original) URL.revokeObjectURL(original.url);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setOriginal({ file, url: URL.createObjectURL(file) });
    setResultBlob(null);
    setResultUrl(null);
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

  const process = async () => {
    if (!original || inFlightRef.current || busy) return;
    inFlightRef.current = true;
    setBusy(true);
    setError(null);
    setProgress(null);
    setProgressLabel("Initialising…");

    try {
      const blob = await removeBackgroundInWorker(original.file, {
        onProgress: ({ phase, percent }) => {
          if (phase === "download") {
            setProgressLabel("Downloading AI model…");
            setProgress(typeof percent === "number" ? percent : null);
          } else {
            setProgressLabel("Removing background…");
            // Only show a percentage when IMG.LY reports a real total
            setProgress(typeof percent === "number" ? percent : null);
          }
        },
      });

      const url = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultUrl(url);
    } catch (err) {
      console.error("[Ozaar BgRemover]", err);
      setError(toUserError(err));
    } finally {
      inFlightRef.current = false;
      setBusy(false);
    }
  };

  const download = async () => {
    if (!resultBlob || !original) return;
    try {
      let blob = resultBlob;
      if (useSolidBg) blob = await addSolidBackground(resultBlob, bgColor);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bg-removed-${original.file.name.replace(/\.[^.]+$/, "")}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[Ozaar BgRemover] download", err);
      setError(toUserError(err));
    }
  };

  const reset = () => {
    if (inFlightRef.current || busy) return;
    if (original) URL.revokeObjectURL(original.url);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setOriginal(null);
    setResultBlob(null);
    setResultUrl(null);
    setError(null);
    setBusy(false);
  };

  const circumference = 2 * Math.PI * 28;
  const determinate = typeof progress === "number";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-start gap-3 text-sm text-brand-muted bg-brand-surface border border-brand-border rounded-xl px-4 py-3">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-brand-red" />
        <p>
          Processing happens entirely in your browser using WebAssembly.{" "}
          <strong className="text-brand-text font-medium">
            First load downloads the AI model (~40 MB)
          </strong>{" "}
          , subsequent uses are instant.
        </p>
      </div>

      {!original && !busy && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-12 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-brand-red bg-brand-red/5"
              : "border-brand-border hover:border-brand-red/50 hover:bg-white/[0.02]"
          }`}
        >
          <Upload className="w-8 h-8 text-brand-muted" />
          <p className="text-sm text-brand-muted text-center">
            Drop an image here or click to upload
          </p>
          <p className="text-xs text-brand-muted/60">PNG, JPG, WEBP supported</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={onChange}
          />
        </div>
      )}

      {original && !busy && !resultUrl && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 bg-brand-surface border border-brand-border rounded-lg px-4 py-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={original.url}
              alt="preview"
              className="w-12 h-12 object-cover rounded-md shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-brand-text truncate">{original.file.name}</p>
              <p className="text-xs text-brand-muted">
                {(original.file.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <button
              onClick={reset}
              aria-label="Remove file"
              className="text-brand-muted/60 hover:text-brand-text transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={process}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg bg-brand-red text-white text-sm font-medium
              hover:bg-brand-red/90 transition-colors disabled:opacity-60 disabled:pointer-events-none"
          >
            Remove Background
          </button>
        </div>
      )}

      {busy && (
        <div className="flex flex-col items-center justify-center gap-5 py-14">
          <div className="relative w-16 h-16">
            <svg
              className={`w-full h-full ${determinate ? "-rotate-90" : "animate-spin"}`}
              viewBox="0 0 64 64"
              aria-hidden
            >
              <circle cx="32" cy="32" r="28" fill="none" stroke="#E8E8E8" strokeWidth="4" />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#DF0A09"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={
                  determinate
                    ? `${circumference}`
                    : `${circumference * 0.25} ${circumference}`
                }
                strokeDashoffset={
                  determinate ? `${circumference * (1 - (progress ?? 0) / 100)}` : 0
                }
                style={determinate ? { transition: "stroke-dashoffset 0.3s ease" } : undefined}
              />
            </svg>
            {determinate && (
              <span className="absolute inset-0 flex items-center justify-center text-xs font-mono text-brand-text">
                {progress}%
              </span>
            )}
          </div>
          <p className="text-sm text-brand-muted">{progressLabel}</p>
        </div>
      )}

      {resultUrl && original && !busy && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-brand-muted">Original</span>
              <div className="rounded-xl overflow-hidden aspect-square bg-brand-surface flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={original.url}
                  alt="Original"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-brand-muted">Background removed</span>
              <div
                className="rounded-xl overflow-hidden aspect-square flex items-center justify-center"
                style={CHECKERBOARD}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resultUrl}
                  alt="Result"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 bg-brand-surface border border-brand-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <input
                id="solid-bg"
                type="checkbox"
                checked={useSolidBg}
                onChange={(e) => setUseSolidBg(e.target.checked)}
                className="w-4 h-4 accent-brand-red cursor-pointer"
              />
              <label htmlFor="solid-bg" className="text-sm text-brand-text cursor-pointer">
                Replace with solid colour
              </label>
            </div>
            {useSolidBg && (
              <label className="flex items-center gap-3 w-fit cursor-pointer">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-sm text-brand-text font-mono">
                  {bgColor.toUpperCase()}
                </span>
              </label>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={download}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-red text-white text-sm font-medium
                hover:bg-brand-red/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>
            <button
              onClick={reset}
              className="px-4 py-2.5 rounded-lg border border-brand-border text-brand-muted text-sm hover:text-brand-text hover:border-brand-text/30 transition-colors"
            >
              New image
            </button>
          </div>
        </>
      )}

      {error && !busy && !resultUrl && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
    </motion.div>
  );
}
