"use client";

import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import { Upload, X, FileText, GripVertical, Download, AlertCircle } from "lucide-react";

type Tab = "merge" | "split" | "compress";

interface PdfEntry {
  id: string;
  file: File;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function downloadPdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
      <AlertCircle className="w-4 h-4 shrink-0" />
      {message}
    </div>
  );
}

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
}

function DropZone({ onFiles, multiple = false }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = useCallback(
    (incoming: File[]) => {
      const pdfs = incoming.filter((f) => f.type === "application/pdf");
      if (pdfs.length) onFiles(pdfs);
    },
    [onFiles]
  );

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handle(Array.from(e.dataTransfer.files));
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    handle(Array.from(e.target.files ?? []));
    e.target.value = "";
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-6 sm:p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
        isDragging
          ? "border-brand-red bg-brand-red/5"
          : "border-brand-border hover:border-brand-red/50 hover:bg-white/[0.02]"
      }`}
    >
      <Upload className="w-8 h-8 text-brand-muted" />
      <p className="text-sm text-brand-muted text-center">
        {multiple ? "Drop PDFs here or click to upload" : "Drop a PDF here or click to upload"}
      </p>
      <span className="text-xs text-brand-muted/60">PDF files only</span>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple={multiple}
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
}

// ── Merge ──────────────────────────────────────────────────────────────────

function MergeTab() {
  const [files, setFiles] = useState<PdfEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dragIdx = useRef<number | null>(null);

  const add = (incoming: File[]) => {
    setError(null);
    setFiles((prev) => [
      ...prev,
      ...incoming.map((f) => ({ id: crypto.randomUUID(), file: f })),
    ]);
  };

  const remove = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const onDragStart = (i: number) => { dragIdx.current = i; };

  const onDrop = (e: DragEvent<HTMLDivElement>, targetIdx: number) => {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === targetIdx) return;
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx.current!, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
    dragIdx.current = null;
  };

  const merge = async () => {
    if (files.length < 2) { setError("Add at least 2 PDF files to merge."); return; }
    setBusy(true);
    setError(null);
    try {
      const merged = await PDFDocument.create();
      for (const entry of files) {
        const buf = await entry.file.arrayBuffer();
        const doc = await PDFDocument.load(buf);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      downloadPdf(await merged.save(), "merged.pdf");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to merge PDFs.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <DropZone onFiles={add} multiple />

      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-brand-muted">Drag rows to reorder</p>
          {files.map((entry, i) => (
            <div
              key={entry.id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, i)}
              className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-brand-surface border border-brand-border rounded-lg px-3 py-2.5 cursor-grab active:cursor-grabbing select-none"
            >
              <GripVertical className="w-4 h-4 text-brand-muted/50 shrink-0" />
              <FileText className="w-4 h-4 text-brand-red shrink-0" />
              <span className="text-sm text-brand-text flex-1 truncate">{entry.file.name}</span>
              <span className="text-xs text-brand-muted shrink-0 ml-7 sm:ml-0">{formatBytes(entry.file.size)}</span>
              <button
                onClick={() => remove(entry.id)}
                aria-label={`Remove ${entry.file.name}`}
                className="text-brand-muted/60 hover:text-brand-text transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <ErrorBanner message={error} />}

      <button
        onClick={merge}
        disabled={busy || files.length < 2}
        className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg bg-brand-red text-white text-sm font-medium
          hover:bg-brand-red/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Download className="w-4 h-4" />
        {busy ? "Merging…" : `Merge ${files.length > 1 ? files.length + " " : ""}PDFs & Download`}
      </button>
    </div>
  );
}

// ── Split ──────────────────────────────────────────────────────────────────

/** Parse "2-4, 6, 8-9" into 0-based page indices. Ranges are inclusive. */
function parseRange(input: string, total: number): number[] {
  const indices: number[] = [];
  const normalized = input.replace(/[–—−]/g, "-");

  for (const part of normalized.split(",").map((s) => s.trim()).filter(Boolean)) {
    if (part.includes("-")) {
      const ends = part.split("-").map((s) => s.trim()).filter(Boolean);
      if (ends.length !== 2) {
        throw new Error(`Invalid range "${part}". Use forms like 2-4.`);
      }
      let a = parseInt(ends[0], 10);
      let b = parseInt(ends[1], 10);
      if (isNaN(a) || isNaN(b)) {
        throw new Error(`Invalid range "${part}". Use forms like 2-4.`);
      }
      if (a > b) [a, b] = [b, a];
      if (a < 1 || b > total) {
        throw new Error(`Invalid range "${part}", pages are 1-${total}.`);
      }
      // Inclusive: 2-4 → pages 2, 3, 4
      for (let p = a; p <= b; p++) indices.push(p - 1);
    } else {
      const n = parseInt(part, 10);
      if (isNaN(n) || n < 1 || n > total) {
        throw new Error(`Page "${part}" is out of range, PDF has ${total} pages.`);
      }
      indices.push(n - 1);
    }
  }

  // Keep order, drop duplicates
  return Array.from(new Set(indices));
}

function formatPageList(indices: number[]): string {
  if (!indices.length) return "";
  const pages = indices.map((i) => i + 1);
  if (pages.length <= 12) return pages.join(", ");
  return `${pages.slice(0, 10).join(", ")} … +${pages.length - 10} more`;
}

function tryParseRange(input: string, total: number): { pages: number[]; error: string | null } {
  if (!input.trim() || total < 1) return { pages: [], error: null };
  try {
    return { pages: parseRange(input, total), error: null };
  } catch (err) {
    return { pages: [], error: err instanceof Error ? err.message : "Invalid range." };
  }
}

function SplitTab() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = tryParseRange(range, pageCount);

  const load = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError(null);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const count = doc.getPageCount();
      setPdfFile(file);
      setPageCount(count);
      setRange(count === 1 ? "1" : `1-${count}`);
    } catch {
      setError("Could not read PDF, it may be encrypted or corrupted.");
    }
  };

  const split = async () => {
    if (!pdfFile) return;
    setBusy(true);
    setError(null);
    try {
      const indices = parseRange(range, pageCount);
      if (!indices.length) throw new Error("Enter at least one page or range.");
      const source = await PDFDocument.load(await pdfFile.arrayBuffer(), { ignoreEncryption: true });
      const output = await PDFDocument.create();
      const pages = await output.copyPages(source, indices);
      pages.forEach((p) => output.addPage(p));
      const label =
        indices.length === 1
          ? `page_${indices[0] + 1}.pdf`
          : `pages_${indices[0] + 1}-${indices[indices.length - 1] + 1}.pdf`;
      downloadPdf(await output.save(), label);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to split PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {!pdfFile ? (
        <DropZone onFiles={load} />
      ) : (
        <div className="flex items-center gap-3 bg-brand-surface border border-brand-border rounded-lg px-4 py-3">
          <FileText className="w-5 h-5 text-brand-red shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-brand-text truncate">{pdfFile.name}</p>
            <p className="text-xs text-brand-muted">
              {pageCount} {pageCount === 1 ? "page" : "pages"} · {formatBytes(pdfFile.size)}
            </p>
          </div>
          <button
            onClick={() => { setPdfFile(null); setPageCount(0); setRange(""); setError(null); }}
            aria-label="Remove PDF"
            className="text-brand-muted/60 hover:text-brand-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {pdfFile && (
        <>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-brand-text font-medium">
              Page range{" "}
              <span className="text-brand-muted font-normal">(e.g. 2-4 extracts pages 2, 3 and 4)</span>
            </label>
            <input
              value={range}
              onChange={(e) => { setRange(e.target.value); setError(null); }}
              placeholder={pageCount === 1 ? "1" : `1-${pageCount}`}
              className="bg-brand-surface border border-brand-border rounded-lg px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/60
                focus:outline-none focus:border-brand-red transition-colors"
            />
            <p className="text-xs text-brand-muted">
              This PDF has {pageCount} {pageCount === 1 ? "page" : "pages"}.
              Use inclusive ranges and commas, like <span className="text-brand-text">2-4, 7, 9-10</span>.
            </p>
            {preview.error ? (
              <p className="text-xs text-red-500">{preview.error}</p>
            ) : preview.pages.length > 0 ? (
              <p className="text-xs text-brand-text">
                Will extract {preview.pages.length}{" "}
                {preview.pages.length === 1 ? "page" : "pages"}:{" "}
                <span className="font-medium">{formatPageList(preview.pages)}</span>
              </p>
            ) : null}
          </div>

          {error && <ErrorBanner message={error} />}

          <button
            onClick={split}
            disabled={busy || !range.trim() || !!preview.error || preview.pages.length === 0}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg bg-brand-red text-white text-sm font-medium
              hover:bg-brand-red/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            {busy ? "Extracting…" : "Extract Pages & Download"}
          </button>
        </>
      )}
    </div>
  );
}

// ── Compress ───────────────────────────────────────────────────────────────

type CompressQuality = "high" | "medium" | "low";

const COMPRESS_PRESETS: Record<
  CompressQuality,
  { label: string; hint: string; scale: number; jpeg: number }
> = {
  // Scales stay ≤ 1 so rasterization does not inflate already-efficient PDFs.
  high: { label: "High quality", hint: "Light shrink, sharper look", scale: 1.0, jpeg: 0.72 },
  medium: { label: "Balanced", hint: "Solid shrink, good look", scale: 0.85, jpeg: 0.55 },
  low: { label: "Smallest file", hint: "Max shrink", scale: 0.7, jpeg: 0.38 },
};

async function canvasToJpegBytes(canvas: HTMLCanvasElement, quality: number): Promise<Uint8Array> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("JPEG encoding failed."))),
      "image/jpeg",
      quality
    );
  });
  return new Uint8Array(await blob.arrayBuffer());
}

async function renderPdfToCompressedBytes(
  // pdf.js page proxy; keep loose to avoid brittle version-specific typing
  pdf: { numPages: number; getPage: (n: number) => Promise<any> },
  scale: number,
  jpeg: number,
  onProgress?: (msg: string) => void
): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  const total = pdf.numPages;

  for (let i = 1; i <= total; i++) {
    onProgress?.(`Compressing page ${i} of ${total}…`);
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported in this browser.");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;

    const jpegBytes = await canvasToJpegBytes(canvas, jpeg);
    const image = await out.embedJpg(jpegBytes);
    const base = page.getViewport({ scale: 1 });
    const embedded = out.addPage([base.width, base.height]);
    embedded.drawImage(image, { x: 0, y: 0, width: base.width, height: base.height });

    canvas.width = 0;
    canvas.height = 0;
  }

  onProgress?.("Finalising PDF…");
  return out.save({ useObjectStreams: true });
}

/** Build stronger attempts from a preset until the result is smaller than the original. */
function buildShrinkAttempts(preset: CompressQuality): { scale: number; jpeg: number }[] {
  const base = COMPRESS_PRESETS[preset];
  const attempts = [
    { scale: base.scale, jpeg: base.jpeg },
    { scale: base.scale * 0.9, jpeg: Math.max(0.28, base.jpeg * 0.85) },
    { scale: base.scale * 0.78, jpeg: Math.max(0.24, base.jpeg * 0.7) },
    { scale: Math.min(base.scale, 0.7), jpeg: 0.38 },
    { scale: 0.6, jpeg: 0.32 },
    { scale: 0.5, jpeg: 0.28 },
  ];

  // De-dupe near-identical attempts
  const seen = new Set<string>();
  return attempts.filter(({ scale, jpeg }) => {
    const key = `${scale.toFixed(2)}:${jpeg.toFixed(2)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function compressPdfFile(
  file: File,
  preset: CompressQuality,
  onProgress?: (msg: string) => void
): Promise<{ bytes: Uint8Array; note: string | null }> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const original = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data: original.slice() }).promise;
  const attempts = buildShrinkAttempts(preset);

  let best: Uint8Array | null = null;

  for (let i = 0; i < attempts.length; i++) {
    const { scale, jpeg } = attempts[i];
    if (i > 0) onProgress?.(`Still too large, tightening compression (${i + 1}/${attempts.length})…`);
    const bytes = await renderPdfToCompressedBytes(pdf, scale, jpeg, onProgress);

    if (!best || bytes.byteLength < best.byteLength) best = bytes;
    if (bytes.byteLength < original.byteLength) {
      return { bytes, note: null };
    }
  }

  // Never return a larger file. If we cannot beat the original, keep it.
  if (!best || best.byteLength >= original.byteLength) {
    return {
      bytes: original,
      note: "This PDF is already efficient. No further size reduction was possible without a big quality drop.",
    };
  }

  return { bytes: best, note: null };
}

function CompressTab() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [compressed, setCompressed] = useState<Uint8Array | null>(null);
  const [quality, setQuality] = useState<CompressQuality>("medium");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setPdfFile(file);
    setCompressed(null);
    setError(null);
    setProgress(null);
    setNote(null);
  };

  const compress = async () => {
    if (!pdfFile) return;
    setBusy(true);
    setError(null);
    setCompressed(null);
    setNote(null);
    setProgress("Preparing…");
    try {
      const { bytes, note: resultNote } = await compressPdfFile(pdfFile, quality, setProgress);
      setCompressed(bytes);
      setNote(resultNote);
      setProgress(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to compress PDF.");
      setProgress(null);
    } finally {
      setBusy(false);
    }
  };

  const originalSize = pdfFile?.size ?? 0;
  const compressedSize = compressed?.byteLength ?? 0;
  const saved = originalSize - compressedSize;
  const savedPct = originalSize > 0 ? Math.round((saved / originalSize) * 100) : 0;
  const didShrink = saved > 0;

  return (
    <div className="flex flex-col gap-5">
      {!pdfFile ? (
        <DropZone onFiles={load} />
      ) : (
        <div className="flex items-center gap-3 bg-brand-surface border border-brand-border rounded-lg px-4 py-3">
          <FileText className="w-5 h-5 text-brand-red shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-brand-text truncate">{pdfFile.name}</p>
            <p className="text-xs text-brand-muted">{formatBytes(originalSize)}</p>
          </div>
          <button
            onClick={() => {
              setPdfFile(null);
              setCompressed(null);
              setError(null);
              setProgress(null);
              setNote(null);
            }}
            aria-label="Remove PDF"
            className="text-brand-muted/60 hover:text-brand-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {pdfFile && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-brand-text font-medium">Compression level</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(Object.keys(COMPRESS_PRESETS) as CompressQuality[]).map((key) => {
              const preset = COMPRESS_PRESETS[key];
              const active = quality === key;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={busy}
                  onClick={() => { setQuality(key); setCompressed(null); setNote(null); }}
                  className={`text-left rounded-lg border px-3 py-2.5 transition-colors ${
                    active
                      ? "border-brand-red bg-brand-red/5"
                      : "border-brand-border bg-brand-surface hover:border-brand-red/40"
                  }`}
                >
                  <p className={`text-sm font-medium ${active ? "text-brand-red" : "text-brand-text"}`}>
                    {preset.label}
                  </p>
                  <p className="text-xs text-brand-muted mt-0.5">{preset.hint}</p>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-brand-muted">
            Always aims to shrink the file. If a setting would make it larger, compression is tightened automatically.
          </p>
        </div>
      )}

      {compressed && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Original", value: formatBytes(originalSize), color: "" },
            { label: "Compressed", value: formatBytes(compressedSize), color: "" },
            {
              label: "Saved",
              value: didShrink ? `${formatBytes(saved)} (${savedPct}%)` : "0%",
              color: didShrink ? "text-green-500" : "text-brand-muted",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-brand-surface border border-brand-border rounded-lg p-4 text-center">
              <p className="text-xs text-brand-muted mb-1">{label}</p>
              <p className={`text-base font-semibold ${color || "text-brand-text"}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {note && (
        <p className="text-xs text-brand-muted bg-brand-surface border border-brand-border rounded-lg px-4 py-3">
          {note}
        </p>
      )}
      {error && <ErrorBanner message={error} />}
      {progress && <p className="text-xs text-brand-muted">{progress}</p>}

      {pdfFile && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={compress}
            disabled={busy}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-red text-white text-sm font-medium
              hover:bg-brand-red/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {busy ? "Compressing…" : compressed ? "Compress again" : "Compress PDF"}
          </button>
          {compressed && didShrink && (
            <button
              onClick={() => downloadPdf(compressed, `compressed_${pdfFile.name}`)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-brand-border bg-brand-surface text-brand-text text-sm font-medium
                hover:border-brand-red/50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Compressed PDF
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: "merge", label: "Merge" },
  { id: "split", label: "Split" },
  { id: "compress", label: "Compress" },
];

export default function PdfToolkit() {
  const [tab, setTab] = useState<Tab>("merge");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      <div className="flex gap-1 bg-brand-surface p-1 rounded-lg w-full sm:w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              tab === t.id
                ? "bg-brand-red text-white"
                : "text-brand-muted hover:text-brand-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "merge" && <MergeTab />}
      {tab === "split" && <SplitTab />}
      {tab === "compress" && <CompressTab />}
    </motion.div>
  );
}
