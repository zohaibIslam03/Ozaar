"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/animations";

interface ZodiacSign { name: string; symbol: string; traits: string; }

function getZodiac(month: number, day: number): ZodiacSign {
  const signs = [
    { name: "Capricorn",   symbol: "♑", traits: "Ambitious, disciplined, patient",        end: [1,  19] },
    { name: "Aquarius",    symbol: "♒", traits: "Innovative, independent, humanitarian",  end: [2,  18] },
    { name: "Pisces",      symbol: "♓", traits: "Empathetic, creative, intuitive",        end: [3,  20] },
    { name: "Aries",       symbol: "♈", traits: "Courageous, energetic, enthusiastic",    end: [4,  19] },
    { name: "Taurus",      symbol: "♉", traits: "Reliable, patient, practical",           end: [5,  20] },
    { name: "Gemini",      symbol: "♊", traits: "Adaptable, curious, communicative",      end: [6,  20] },
    { name: "Cancer",      symbol: "♋", traits: "Nurturing, intuitive, loyal",            end: [7,  22] },
    { name: "Leo",         symbol: "♌", traits: "Generous, creative, enthusiastic",       end: [8,  22] },
    { name: "Virgo",       symbol: "♍", traits: "Analytical, practical, diligent",        end: [9,  22] },
    { name: "Libra",       symbol: "♎", traits: "Diplomatic, fair-minded, social",        end: [10, 22] },
    { name: "Scorpio",     symbol: "♏", traits: "Passionate, resourceful, determined",    end: [11, 21] },
    { name: "Sagittarius", symbol: "♐", traits: "Optimistic, adventurous, philosophical", end: [12, 21] },
    { name: "Capricorn",   symbol: "♑", traits: "Ambitious, disciplined, patient",        end: [12, 31] },
  ] as const;
  const sign = signs.find(({ end: [em, ed] }) => month < em || (month === em && day <= ed));
  return sign ?? signs[signs.length - 1];
}

interface AgeData {
  years: number; months: number; days: number;
  totalDays: number; totalHours: number; totalMinutes: number;
  dayOfWeek: string; weekNumber: number; zodiac: ZodiacSign;
}

function weekNum(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function computeAge(birth: Date, now: Date): AgeData {
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();
  if (days < 0) { months -= 1; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (months < 0) { years -= 1; months += 12; }
  const diffMs = now.getTime() - birth.getTime();
  const totalDays = Math.floor(diffMs / 86400000);
  const DOW = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return { years, months, days, totalDays, totalHours: totalDays * 24, totalMinutes: totalDays * 1440,
    dayOfWeek: DOW[birth.getDay()], weekNumber: weekNum(birth), zodiac: getZodiac(birth.getMonth() + 1, birth.getDate()) };
}

function nextBirthday(birth: Date, now: Date): Date {
  const next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (next.getTime() <= now.getTime()) next.setFullYear(now.getFullYear() + 1);
  return next;
}

function pad(n: number) { return String(n).padStart(2, "0"); }

function Countdown({ ms }: { ms: number }) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const days  = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins  = Math.floor((s % 3600) / 60);
  const secs  = s % 60;

  const units = [
    { label: "days",  value: days  },
    { label: "hrs",   value: hours },
    { label: "min",   value: mins  },
    { label: "sec",   value: secs  },
  ];

  return (
    <div className="flex gap-3 flex-wrap">
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center bg-brand-surface border border-brand-border rounded-xl px-4 py-3 min-w-[64px]">
          <span className="text-2xl font-bold text-brand-text tabular-nums font-mono">{pad(value)}</span>
          <span className="text-[10px] text-brand-muted uppercase tracking-wider mt-1">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const maxDate = now.toISOString().split("T")[0];
  const birth = dob ? new Date(dob + "T00:00:00") : null;
  const isValid = birth !== null && !isNaN(birth.getTime()) && birth <= now;
  const age = isValid && birth ? computeAge(birth, now) : null;
  const bdayMs = isValid && birth ? nextBirthday(birth, now).getTime() - now.getTime() : null;
  const isBirthdayToday = bdayMs !== null && bdayMs < 86400000 && birth !== null
    && new Date().getMonth() === birth.getMonth() && new Date().getDate() === birth.getDate();

  const statCards = age ? [
    { label: "Total days",    value: age.totalDays.toLocaleString() },
    { label: "Total hours",   value: age.totalHours.toLocaleString() },
    { label: "Total minutes", value: age.totalMinutes.toLocaleString() },
    { label: "Born on",       value: age.dayOfWeek },
    { label: "Birth week",    value: `Week ${age.weekNumber}` },
  ] : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8"
    >
      {/* Date input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-brand-text font-medium">Date of Birth</label>
        <input
          type="date" value={dob} max={maxDate}
          onChange={(e) => setDob(e.target.value)}
          className="w-full sm:w-64 bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text
            focus:outline-none focus:border-brand-red transition-colors [color-scheme:light]"
        />
      </div>

      {!age && (
        <p className="text-sm text-brand-muted">Enter your date of birth to see your age breakdown.</p>
      )}

      <AnimatePresence>
        {age && (
          <motion.div
            key="age-result"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden" animate="visible"
            className="flex flex-col gap-8"
          >
            {/* Birthday banner */}
            {isBirthdayToday && (
              <motion.div variants={fadeUp} className="bg-brand-redLight border border-brand-red/30 rounded-xl px-4 py-3 text-sm text-brand-red font-semibold">
                🎉 Happy Birthday!
              </motion.div>
            )}

            {/* Primary age display */}
            <motion.div variants={fadeUp} className="text-center py-6 bg-brand-surface rounded-2xl border border-brand-border">
              <p className="text-xs text-brand-muted uppercase tracking-widest mb-3">You are</p>
              <div className="flex items-end justify-center gap-3 flex-wrap">
                <span className="font-heading font-black text-brand-red leading-none" style={{ fontSize: "80px" }}>
                  {age.years}
                </span>
                <div className="flex flex-col gap-0.5 mb-3 text-left">
                  <span className="text-lg font-semibold text-brand-text">{age.months} months</span>
                  <span className="text-base text-brand-muted">{age.days} days old</span>
                </div>
              </div>
            </motion.div>

            {/* Stat cards */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {statCards.map((s) => (
                <div key={s.label} className="bg-brand-surface border border-brand-border rounded-xl p-4 flex flex-col gap-1">
                  <span className="text-[11px] text-brand-muted uppercase tracking-wider">{s.label}</span>
                  <span className="text-xl font-bold text-brand-text tabular-nums">{s.value}</span>
                </div>
              ))}
            </motion.div>

            {/* Countdown to next birthday */}
            {bdayMs !== null && !isBirthdayToday && (
              <motion.div variants={fadeUp} className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-brand-text">Next Birthday Countdown</h3>
                <Countdown ms={bdayMs} />
              </motion.div>
            )}

            {/* Zodiac */}
            <motion.div
              variants={fadeUp}
              className="bg-brand-redLight border border-brand-red/20 rounded-xl px-5 py-4 flex items-center gap-4"
            >
              <span className="text-4xl select-none">{age.zodiac.symbol}</span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-brand-text">{age.zodiac.name}</span>
                <span className="text-xs text-brand-muted">{age.zodiac.traits}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
