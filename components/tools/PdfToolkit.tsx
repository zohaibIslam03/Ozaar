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

function parseRange(input: string, total: number): number[] {
  const indices: number[] = [];
  for (const part of input.split(",").map((s) => s.trim()).filter(Boolean)) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map((s) => parseInt(s, 10));
      if (isNaN(a) || isNaN(b) || a < 1 || b > total || a > b)
        throw new Error(`Invalid range "${part}" — pages are 1–${total}.`);
      for (let p = a; p <= b; p++) indices.push(p - 1);
    } else {
      const n = parseInt(part, 10);
      if (isNaN(n) || n < 1 || n > total)
        throw new Error(`Page "${part}" is out of range — PDF has ${total} pages.`);
      indices.push(n - 1);
    }
  }
  return Array.from(new Set(indices));
}

function SplitTab() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError(null);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      setPdfFile(file);
      setPageCount(doc.getPageCount());
      setRange(`1-${doc.getPageCount()}`);
    } catch {
      setError("Could not read PDF — it may be encrypted or corrupted.");
    }
  };

  const split = async () => {
    if (!pdfFile) return;
    setBusy(true);
    setError(null);
    try {
      const indices = parseRange(range, pageCount);
      const source = await PDFDocument.load(await pdfFile.arrayBuffer());
      const output = await PDFDocument.create();
      const pages = await output.copyPages(source, indices);
      pages.forEach((p) => output.addPage(p));
      downloadPdf(await output.save(), "split_pages.pdf");
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
            <p className="text-xs text-brand-muted">{pageCount} pages · {formatBytes(pdfFile.size)}</p>
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
              <span className="text-brand-muted font-normal">(e.g. 1-3, 5, 7-9)</span>
            </label>
            <input
              value={range}
              onChange={(e) => { setRange(e.target.value); setError(null); }}
              placeholder={`1-${pageCount}`}
              className="bg-brand-surface border border-brand-border rounded-lg px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/60
                focus:outline-none focus:border-brand-red transition-colors"
            />
            <p className="text-xs text-brand-muted">
              This PDF has {pageCount} pages. Separate ranges or pages with commas.
            </p>
          </div>

          {error && <ErrorBanner message={error} />}

          <button
            onClick={split}
            disabled={busy || !range.trim()}
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

function CompressTab() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [compressed, setCompressed] = useState<Uint8Array | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setPdfFile(file);
    setCompressed(null);
    setError(null);
  };

  const compress = async () => {
    if (!pdfFile) return;
    setBusy(true);
    setError(null);
    try {
      const doc = await PDFDocument.load(await pdfFile.arrayBuffer());
      setCompressed(await doc.save({ useObjectStreams: true }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to compress PDF.");
    } finally {
      setBusy(false);
    }
  };

  const originalSize = pdfFile?.size ?? 0;
  const compressedSize = compressed?.byteLength ?? 0;
  const saved = originalSize - compressedSize;
  const savedPct = originalSize > 0 ? Math.round((saved / originalSize) * 100) : 0;

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
            onClick={() => { setPdfFile(null); setCompressed(null); setError(null); }}
            aria-label="Remove PDF"
            className="text-brand-muted/60 hover:text-brand-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {compressed && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Original", value: formatBytes(originalSize), color: "" },
            { label: "Compressed", value: formatBytes(compressedSize), color: "" },
            {
              label: "Saved",
              value: saved > 0 ? `${savedPct}%` : "—",
              color: saved > 0 ? "text-green-400" : "text-brand-muted",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-brand-surface border border-brand-border rounded-lg p-4 text-center">
              <p className="text-xs text-brand-muted mb-1">{label}</p>
              <p className={`text-base font-semibold ${color || "text-brand-text"}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {error && <ErrorBanner message={error} />}

      {pdfFile && (
        <div className="flex flex-col sm:flex-row gap-3">
          {!compressed ? (
            <button
              onClick={compress}
              disabled={busy}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-red text-white text-sm font-medium
                hover:bg-brand-red/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {busy ? "Optimising…" : "Compress PDF"}
            </button>
          ) : (
            <button
              onClick={() => downloadPdf(compressed, `compressed_${pdfFile.name}`)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-red text-white text-sm font-medium
                hover:bg-brand-red/90 transition-colors"
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
