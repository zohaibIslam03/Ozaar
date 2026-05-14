"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";
import {
  CATEGORIES, UNITS, TEMPERATURE_UNITS, convert,
  type Category, type SimpleUnit,
} from "@/lib/unitConversions";

const CATEGORY_ICONS: Record<string, string> = {
  Length:      "📏",
  Weight:      "⚖️",
  Temperature: "🌡",
  Speed:       "💨",
  Area:        "📐",
  Volume:      "💧",
};

interface TemperatureUnit { label: string; symbol: string; }

function getUnits(cat: Category): (SimpleUnit | TemperatureUnit)[] {
  if (cat === "Temperature") return TEMPERATURE_UNITS;
  return UNITS[cat as Exclude<Category, "Temperature">];
}

function formatResult(n: number): string {
  if (!isFinite(n)) return "-";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e15 || (abs > 0 && abs < 1e-9)) return n.toExponential(6);
  if (abs >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 6 });
  return n.toPrecision(8).replace(/\.?0+$/, "");
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("Length");
  const units = getUnits(category);
  const [fromSymbol, setFromSymbol] = useState(units[0].symbol);
  const [toSymbol, setToSymbol]     = useState(units[1].symbol);
  const [inputValue, setInputValue] = useState("1");

  const switchCategory = (cat: Category) => {
    const newUnits = getUnits(cat);
    setCategory(cat); setFromSymbol(newUnits[0].symbol);
    setToSymbol(newUnits[1].symbol); setInputValue("1");
  };

  const swap = () => { setFromSymbol(toSymbol); setToSymbol(fromSymbol); };

  const numericInput = parseFloat(inputValue);
  const result = isNaN(numericInput) ? NaN : convert(numericInput, fromSymbol, toSymbol, category);
  const fromUnit = units.find((u) => u.symbol === fromSymbol);
  const toUnit   = units.find((u) => u.symbol === toSymbol);

  const displayResult = inputValue === "" ? "-" : isNaN(result) ? "Invalid" : formatResult(result);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      {/* Category icon tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => switchCategory(cat)}
            className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-medium transition-all duration-200 ${
              category === cat
                ? "bg-brand-red text-white border-brand-red"
                : "bg-brand-surface border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-text/30"
            }`}
          >
            <span className="text-xl">{CATEGORY_ICONS[cat] ?? "🔢"}</span>
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="flex flex-col gap-4">
        {/* From row */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-brand-muted uppercase tracking-wider">From</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={fromSymbol}
              onChange={(e) => setFromSymbol(e.target.value)}
              className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2.5 text-sm text-brand-text
                focus:outline-none focus:border-brand-red transition-colors min-w-0 flex-1 sm:flex-none sm:w-52"
            >
              {units.map((u) => (
                <option key={u.symbol} value={u.symbol}>{u.label} ({u.symbol})</option>
              ))}
            </select>
            <input
              type="number" value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Value"
              className="w-full flex-1 bg-brand-surface border border-brand-border rounded-lg px-3 py-2.5 text-sm text-brand-text
                placeholder:text-brand-muted/40 focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>
        </div>

        {/* Swap */}
        <div className="flex justify-center">
          <motion.button
            onClick={swap}
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="p-2.5 rounded-full bg-brand-surface border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-text/30 transition-colors"
            aria-label="Swap units"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* To row */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-brand-muted uppercase tracking-wider">To</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={toSymbol}
              onChange={(e) => setToSymbol(e.target.value)}
              className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2.5 text-sm text-brand-text
                focus:outline-none focus:border-brand-red transition-colors min-w-0 flex-1 sm:flex-none sm:w-52"
            >
              {units.map((u) => (
                <option key={u.symbol} value={u.symbol}>{u.label} ({u.symbol})</option>
              ))}
            </select>
            <div className="w-full flex-1 bg-brand-redLight border border-brand-red/20 rounded-lg px-3 py-2.5 flex items-center min-w-0">
              <motion.span
                key={displayResult}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-mono text-brand-red font-bold break-all"
              >
                {displayResult}
              </motion.span>
            </div>
          </div>
        </div>
      </div>

      {/* Formula readout */}
      {inputValue !== "" && !isNaN(numericInput) && fromUnit && toUnit && isFinite(result) && (
        <div className="bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-muted">
          <span className="text-brand-text font-mono">{inputValue}</span>
          {" "}{fromUnit.label} ({fromSymbol}) ={" "}
          <span className="text-brand-red font-mono">{formatResult(result)}</span>
          {" "}{toUnit.label} ({toSymbol})
        </div>
      )}
    </motion.div>
  );
}
