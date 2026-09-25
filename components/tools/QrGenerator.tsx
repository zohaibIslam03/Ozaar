"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "qrcode";
import {
  Download,
  AlertCircle,
  Link2,
  Phone,
  Mail,
  MessageCircle,
  Wallet,
} from "lucide-react";

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

type QrMode = "url" | "phone" | "email" | "whatsapp" | "payment";

const MODES: { id: QrMode; label: string; icon: typeof Link2 }[] = [
  { id: "url", label: "URL / Text", icon: Link2 },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "email", label: "Email", icon: Mail },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "payment", label: "Payment", icon: Wallet },
];

/** Digits only, keeps leading + for international. */
function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

/** WhatsApp / tel links want digits only (no +). */
function phoneDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

function buildPayload(opts: {
  mode: QrMode;
  text: string;
  phone: string;
  email: string;
  emailSubject: string;
  emailBody: string;
  waPhone: string;
  waMessage: string;
  paymentLink: string;
}): { value: string; error: string | null } {
  switch (opts.mode) {
    case "url": {
      const v = opts.text.trim();
      if (!v) return { value: "", error: null };
      return { value: v, error: null };
    }
    case "phone": {
      const digits = phoneDigits(opts.phone);
      if (!digits) return { value: "", error: null };
      if (digits.length < 7) {
        return { value: "", error: "Enter a valid phone number." };
      }
      return { value: `tel:${normalizePhone(opts.phone)}`, error: null };
    }
    case "email": {
      const email = opts.email.trim();
      if (!email) return { value: "", error: null };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { value: "", error: "Enter a valid email address." };
      }
      const params = new URLSearchParams();
      if (opts.emailSubject.trim()) params.set("subject", opts.emailSubject.trim());
      if (opts.emailBody.trim()) params.set("body", opts.emailBody.trim());
      const q = params.toString();
      return { value: `mailto:${email}${q ? `?${q}` : ""}`, error: null };
    }
    case "whatsapp": {
      const digits = phoneDigits(opts.waPhone);
      if (!digits) return { value: "", error: null };
      if (digits.length < 7) {
        return { value: "", error: "Enter a WhatsApp number with country code (e.g. 15551234567)." };
      }
      const msg = opts.waMessage.trim();
      const base = `https://wa.me/${digits}`;
      return {
        value: msg ? `${base}?text=${encodeURIComponent(msg)}` : base,
        error: null,
      };
    }
    case "payment": {
      const link = opts.paymentLink.trim();
      if (!link) return { value: "", error: null };
      return { value: link, error: null };
    }
  }
}

const fieldClass =
  "bg-brand-surface border border-brand-border rounded-lg px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-red transition-colors w-full";

export default function QrGenerator() {
  const [mode, setMode] = useState<QrMode>("url");

  // URL / text
  const [text, setText] = useState("https://ozaar.involiq.tech");

  // Phone
  const [phone, setPhone] = useState("");

  // Email
  const [email, setEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // WhatsApp
  const [waPhone, setWaPhone] = useState("");
  const [waMessage, setWaMessage] = useState("");

  // Payment link (any checkout / payment URL)
  const [paymentLink, setPaymentLink] = useState("");

  const [size, setSize] = useState<QrSize>(256);
  const [fgColor, setFgColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#000000");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [svgString, setSvgString] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const payload = useMemo(
    () =>
      buildPayload({
        mode,
        text,
        phone,
        email,
        emailSubject,
        emailBody,
        waPhone,
        waMessage,
        paymentLink,
      }),
    [mode, text, phone, email, emailSubject, emailBody, waPhone, waMessage, paymentLink]
  );

  const debouncedValue = useDebounce(payload.value, 300);
  const debouncedPayloadError = useDebounce(payload.error, 300);

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
    if (debouncedPayloadError) {
      setError(debouncedPayloadError);
      setDataUrl(null);
      setSvgString(null);
      return;
    }
    setError(null);
    generate(debouncedValue);
  }, [debouncedValue, debouncedPayloadError, generate]);

  const downloadPng = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qrcode-${mode}.png`;
    a.click();
  };

  const downloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qrcode-${mode}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const previewSize = Math.min(size, 260);
  const emptyHint =
    mode === "url"
      ? "Enter a URL or text to generate a QR code"
      : mode === "phone"
        ? "Enter a phone number to generate a QR code"
        : mode === "email"
          ? "Enter an email address to generate a QR code"
          : mode === "whatsapp"
            ? "Enter a WhatsApp number to generate a QR code"
            : "Enter payment details to generate a QR code";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      {/* Mode tabs */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-brand-text font-medium">QR Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {MODES.map(({ id, label, icon: Icon }) => {
            const active = mode === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => { setMode(id); setError(null); }}
                className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  active
                    ? "bg-brand-red/10 border-brand-red/30 text-brand-red"
                    : "border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-text/30"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode-specific fields */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-4"
        >
          {mode === "url" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-brand-text font-medium">URL or Text</label>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://example.com or any text"
                className={fieldClass}
              />
            </div>
          )}

          {mode === "phone" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-brand-text font-medium">Phone number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 123 4567"
                className={fieldClass}
              />
              <p className="text-xs text-brand-muted">
                Creates a <span className="font-mono text-brand-text">tel:</span> link. Scanning opens the dialer.
              </p>
            </div>
          )}

          {mode === "email" && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-brand-text font-medium">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className={fieldClass}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-brand-text font-medium">Subject (optional)</label>
                  <input
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Hello from Ozaar"
                    className={fieldClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-brand-text font-medium">Body (optional)</label>
                  <input
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Message draft…"
                    className={fieldClass}
                  />
                </div>
              </div>
              <p className="text-xs text-brand-muted">
                Creates a <span className="font-mono text-brand-text">mailto:</span> link that opens the mail app.
              </p>
            </>
          )}

          {mode === "whatsapp" && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-brand-text font-medium">WhatsApp number</label>
                <input
                  type="tel"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="15551234567"
                  className={fieldClass}
                />
                <p className="text-xs text-brand-muted">
                  Include the country calling code with digits only (no + or spaces).
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-brand-text font-medium">Pre-filled message (optional)</label>
                <textarea
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  placeholder="Hi! I scanned your QR code…"
                  rows={3}
                  className={`${fieldClass} resize-y min-h-[80px]`}
                />
              </div>
            </>
          )}

          {mode === "payment" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm text-brand-text font-medium">Payment link</label>
              <input
                value={paymentLink}
                onChange={(e) => setPaymentLink(e.target.value)}
                placeholder="https://… any payment or checkout link"
                className={fieldClass}
              />
              <p className="text-xs text-brand-muted">
                Paste any payment URL. Scanning opens that link on the device.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

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
              type="button"
              onClick={() => {
                setFgColor(p.fg);
                setBgColor(p.bg);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-border text-xs font-medium text-brand-muted hover:text-brand-text hover:border-brand-text/30 transition-all duration-200"
            >
              <span className="flex gap-0.5">
                <span
                  className="w-3 h-3 rounded-sm border border-brand-border/50"
                  style={{ backgroundColor: p.fg }}
                />
                <span
                  className="w-3 h-3 rounded-sm border border-brand-border/50"
                  style={{ backgroundColor: p.bg }}
                />
              </span>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Options row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-brand-text font-medium">Size</label>
          <div className="flex gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
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

      {/* Encoded payload preview */}
      {debouncedValue && !debouncedPayloadError && (
        <p className="text-xs text-brand-muted break-all">
          Encoded: <span className="font-mono text-brand-text">{debouncedValue}</span>
        </p>
      )}

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
          <p className="text-sm text-brand-muted/60 text-center px-4">
            {debouncedValue.trim() && !debouncedPayloadError ? "Generating…" : emptyHint}
          </p>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={downloadPng}
          disabled={!dataUrl}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-red text-white text-sm font-medium
            hover:bg-brand-red/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PNG
        </button>
        <button
          type="button"
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
