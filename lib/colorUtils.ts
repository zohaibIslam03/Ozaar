// Pure HSL-based colour harmony utilities, no external dependencies

export interface RGB { r: number; g: number; b: number }
export interface HSL { h: number; s: number; l: number }
export interface ColorSwatch { hex: string; rgb: RGB; hsl: HSL; label?: string }
export type HarmonyMode =
  | "shades"
  | "analogous"
  | "complementary"
  | "triadic"
  | "split-complementary";

export function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const nr = r / 255, ng = g / 255, nb = b / 255;
  const max = Math.max(nr, ng, nb), min = Math.min(nr, ng, nb);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === nr) h = ((ng - nb) / d + (ng < nb ? 6 : 0)) / 6;
  else if (max === ng) h = ((nb - nr) / d + 2) / 6;
  else h = ((nr - ng) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const hs = s / 100, hl = l / 100;
  const a = hs * Math.min(hl, 1 - hl);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return hl - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
}

export function randomHex(): string {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
}

function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)); }
function norm(h: number) { return ((h % 360) + 360) % 360; }

function sw(h: number, s: number, l: number, label?: string): ColorSwatch {
  const hsl = { h: norm(h), s: clamp(s, 0, 100), l: clamp(l, 5, 97) };
  const rgb = hslToRgb(hsl);
  return { hex: rgbToHex(rgb), rgb, hsl, label };
}

/** Tailwind-like shade stops (50 → 950) for a single hue. */
const SHADE_STOPS: { label: string; l: number; sMul: number }[] = [
  { label: "50",  l: 97, sMul: 0.35 },
  { label: "100", l: 94, sMul: 0.5 },
  { label: "200", l: 86, sMul: 0.7 },
  { label: "300", l: 76, sMul: 0.85 },
  { label: "400", l: 64, sMul: 0.95 },
  { label: "500", l: 52, sMul: 1 },
  { label: "600", l: 42, sMul: 1 },
  { label: "700", l: 33, sMul: 0.95 },
  { label: "800", l: 24, sMul: 0.9 },
  { label: "900", l: 16, sMul: 0.85 },
  { label: "950", l: 9,  sMul: 0.75 },
];

/** Full tint → shade ramp of the entered colour (same hue). */
export function generateShades(baseHex: string): ColorSwatch[] {
  const rgb = hexToRgb(baseHex);
  if (!rgb) return [];
  const { h, s, l: baseL } = rgbToHsl(rgb);

  const ramp = SHADE_STOPS.map(({ label, l, sMul }) =>
    sw(h, Math.round(s * sMul), l, label)
  );

  // Ensure the exact entered colour appears (replace closest stop by lightness)
  let closest = 0;
  let best = Infinity;
  ramp.forEach((c, i) => {
    const d = Math.abs(c.hsl.l - baseL);
    if (d < best) { best = d; closest = i; }
  });

  const cleanHex = `#${baseHex.replace("#", "").toLowerCase()}`;
  const exactRgb = hexToRgb(cleanHex)!;
  ramp[closest] = {
    hex: cleanHex,
    rgb: exactRgb,
    hsl: rgbToHsl(exactRgb),
    label: SHADE_STOPS[closest].label,
  };

  return ramp;
}

export function generatePalette(baseHex: string, mode: HarmonyMode): ColorSwatch[] {
  if (mode === "shades") return generateShades(baseHex);

  const rgb = hexToRgb(baseHex);
  if (!rgb) return [];
  const { h, s, l } = rgbToHsl(rgb);

  switch (mode) {
    case "analogous":
      return [sw(h - 60, s, l), sw(h - 30, s, l), sw(h, s, l), sw(h + 30, s, l), sw(h + 60, s, l)];
    case "complementary":
      return [sw(h, s, l + 15), sw(h, s, l), sw(h, s, l - 15), sw(h + 180, s, l), sw(h + 180, s, l - 15)];
    case "triadic":
      return [sw(h, s, l), sw(h + 120, s, l), sw(h + 240, s, l), sw(h, s - 20, l + 20), sw(h + 120, s - 20, l + 20)];
    case "split-complementary":
      return [sw(h, s, l), sw(h + 150, s, l), sw(h + 210, s, l), sw(h + 150, s, l - 20), sw(h + 210, s, l - 20)];
  }
}
