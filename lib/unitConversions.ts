export type Category = "Length" | "Weight" | "Temperature" | "Speed" | "Area" | "Volume";

export interface Unit {
  label: string;
  symbol: string;
  toBase: number | null; // null means temperature (special formula)
  fromBase: number | null;
}

export type ConversionFn = (v: number) => number;

// For Temperature we use special functions
export function toKelvin(value: number, from: string): number {
  switch (from) {
    case "°C": return value + 273.15;
    case "°F": return (value + 459.67) * (5 / 9);
    case "K":  return value;
    case "°R": return value * (5 / 9);
    default:   return value;
  }
}
export function fromKelvin(value: number, to: string): number {
  switch (to) {
    case "°C": return value - 273.15;
    case "°F": return value * (9 / 5) - 459.67;
    case "K":  return value;
    case "°R": return value * (9 / 5);
    default:   return value;
  }
}

export interface SimpleUnit {
  label: string;
  symbol: string;
  toBase: number;
}

export const CATEGORIES: Category[] = ["Length", "Weight", "Temperature", "Speed", "Area", "Volume"];

// All non-temperature categories: toBase converts to SI base unit
export const UNITS: Record<Exclude<Category, "Temperature">, SimpleUnit[]> = {
  Length: [
    { label: "Millimetre",  symbol: "mm",  toBase: 0.001 },
    { label: "Centimetre",  symbol: "cm",  toBase: 0.01 },
    { label: "Metre",       symbol: "m",   toBase: 1 },
    { label: "Kilometre",   symbol: "km",  toBase: 1000 },
    { label: "Inch",        symbol: "in",  toBase: 0.0254 },
    { label: "Foot",        symbol: "ft",  toBase: 0.3048 },
    { label: "Yard",        symbol: "yd",  toBase: 0.9144 },
    { label: "Mile",        symbol: "mi",  toBase: 1609.344 },
    { label: "Nautical mi", symbol: "nmi", toBase: 1852 },
  ],
  Weight: [
    { label: "Milligram",  symbol: "mg",  toBase: 0.000001 },
    { label: "Gram",       symbol: "g",   toBase: 0.001 },
    { label: "Kilogram",   symbol: "kg",  toBase: 1 },
    { label: "Tonne",      symbol: "t",   toBase: 1000 },
    { label: "Ounce",      symbol: "oz",  toBase: 0.028349523 },
    { label: "Pound",      symbol: "lb",  toBase: 0.45359237 },
    { label: "Stone",      symbol: "st",  toBase: 6.35029318 },
    { label: "US Ton",     symbol: "tn",  toBase: 907.18474 },
  ],
  Speed: [
    { label: "m/s",          symbol: "m/s",  toBase: 1 },
    { label: "km/h",         symbol: "km/h", toBase: 1 / 3.6 },
    { label: "mph",          symbol: "mph",  toBase: 0.44704 },
    { label: "Knot",         symbol: "kn",   toBase: 0.514444 },
    { label: "Mach (std)",   symbol: "M",    toBase: 340.29 },
    { label: "ft/s",         symbol: "ft/s", toBase: 0.3048 },
  ],
  Area: [
    { label: "mm²",       symbol: "mm²",  toBase: 0.000001 },
    { label: "cm²",       symbol: "cm²",  toBase: 0.0001 },
    { label: "m²",        symbol: "m²",   toBase: 1 },
    { label: "km²",       symbol: "km²",  toBase: 1e6 },
    { label: "Hectare",   symbol: "ha",   toBase: 10000 },
    { label: "Acre",      symbol: "ac",   toBase: 4046.856 },
    { label: "in²",       symbol: "in²",  toBase: 0.00064516 },
    { label: "ft²",       symbol: "ft²",  toBase: 0.092903 },
    { label: "mi²",       symbol: "mi²",  toBase: 2589988.11 },
  ],
  Volume: [
    { label: "Millilitre",   symbol: "mL",   toBase: 0.001 },
    { label: "Litre",        symbol: "L",    toBase: 1 },
    { label: "Cubic metre",  symbol: "m³",   toBase: 1000 },
    { label: "Teaspoon",     symbol: "tsp",  toBase: 0.00492892 },
    { label: "Tablespoon",   symbol: "tbsp", toBase: 0.01478676 },
    { label: "Fluid oz",     symbol: "fl oz",toBase: 0.02957353 },
    { label: "Cup",          symbol: "cup",  toBase: 0.2365882 },
    { label: "Pint (US)",    symbol: "pt",   toBase: 0.4731765 },
    { label: "Quart (US)",   symbol: "qt",   toBase: 0.9463529 },
    { label: "Gallon (US)",  symbol: "gal",  toBase: 3.785412 },
    { label: "Cubic inch",   symbol: "in³",  toBase: 0.016387 },
    { label: "Cubic foot",   symbol: "ft³",  toBase: 28.3168 },
  ],
};

export const TEMPERATURE_UNITS = [
  { label: "Celsius",    symbol: "°C" },
  { label: "Fahrenheit", symbol: "°F" },
  { label: "Kelvin",     symbol: "K" },
  { label: "Rankine",    symbol: "°R" },
];

export function convert(value: number, fromSymbol: string, toSymbol: string, category: Category): number {
  if (category === "Temperature") {
    const kelvin = toKelvin(value, fromSymbol);
    return fromKelvin(kelvin, toSymbol);
  }
  const units = UNITS[category as Exclude<Category, "Temperature">];
  const from = units.find((u) => u.symbol === fromSymbol);
  const to = units.find((u) => u.symbol === toSymbol);
  if (!from || !to) return NaN;
  return (value * from.toBase) / to.toBase;
}
