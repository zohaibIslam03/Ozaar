// Pure HSL-based colour harmony utilities — no external dependencies

export interface RGB { r: number; g: number; b: number }
export interface HSL { h: number; s: number; l: number }
export interface ColorSwatch { hex: string; rgb: RGB; hsl: HSL }
export type HarmonyMode = "analogous" | "complementary" | "triadic" | "split-complementary";

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

function sw(h: number, s: number, l: number): ColorSwatch {
  const hsl = { h: norm(h), s: clamp(s, 0, 100), l: clamp(l, 5, 95) };
  const rgb = hslToRgb(hsl);
  return { hex: rgbToHex(rgb), rgb, hsl };
}

export function generatePalette(baseHex: string, mode: HarmonyMode): ColorSwatch[] {
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
