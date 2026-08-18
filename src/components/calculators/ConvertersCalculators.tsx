import React, { useState, useEffect } from "react";
import {
  convertTimeZone,
  calculateDateDifference,
  integerToRoman,
  romanToInteger,
  numberToWords,
  convertDataStorage,
  dataStorageUnits,
  convertSpeed,
  speedUnits,
} from "../../lib/calculators/converters-calculators";
import { convertColor } from "../../lib/calculators/developer-tools";
import { ArrowRightLeft, Copy, Check, Clock, Calendar, Hash, Ruler, Palette, Sparkles } from "lucide-react";

interface ConvertersProps {
  slug: string;
}

const WORLD_TIMEZONES = [
  { value: "UTC", label: "UTC / GMT (Universal)" },
  { value: "America/New_York", label: "EST / EDT (New York, USA)" },
  { value: "America/Chicago", label: "CST / CDT (Chicago, USA)" },
  { value: "America/Denver", label: "MST / MDT (Denver, USA)" },
  { value: "America/Los_Angeles", label: "PST / PDT (Los Angeles, USA)" },
  { value: "America/Sao_Paulo", label: "BRT (São Paulo, Brazil)" },
  { value: "Europe/London", label: "GMT / BST (London, UK)" },
  { value: "Europe/Paris", label: "CET / CEST (Paris, France)" },
  { value: "Europe/Berlin", label: "CET / CEST (Berlin, Germany)" },
  { value: "Africa/Cairo", label: "EET (Cairo, Egypt)" },
  { value: "Asia/Dubai", label: "GST (Dubai, UAE)" },
  { value: "Asia/Kolkata", label: "IST (India Standard Time)" },
  { value: "Asia/Bangkok", label: "ICT (Bangkok, Thailand)" },
  { value: "Asia/Singapore", label: "SGT (Singapore)" },
  { value: "Asia/Shanghai", label: "CST (Beijing, China)" },
  { value: "Asia/Tokyo", label: "JST (Tokyo, Japan)" },
  { value: "Australia/Sydney", label: "AEST / AEDT (Sydney, Australia)" },
  { value: "Pacific/Auckland", label: "NZST / NZDT (Auckland, NZ)" },
];

export default function ConvertersCalculators({ slug }: ConvertersProps) {
  const [activeSlug, setActiveSlug] = useState(slug);

  useEffect(() => {
    setActiveSlug(slug);
  }, [slug]);

  // Copy state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const triggerCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Timezone states
  const [dateTimeStr, setDateTimeStr] = useState(new Date().toISOString().slice(0, 16));
  const [fromZone, setFromZone] = useState("UTC");
  const [toZone, setToZone] = useState("Asia/Kolkata");

  // Date Diff states
  const [date1, setDate1] = useState(new Date().toISOString().split("T")[0]);
  const [date2, setDate2] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);

  // Age in Days/Weeks states
  const [birthDate, setBirthDate] = useState("1998-05-15");

  // Number to Words states
  const [numberInput, setNumberInput] = useState(1250000);
  const [isIndianSystem, setIsIndianSystem] = useState(true);

  // Roman Numeral states
  const [romanInt, setRomanInt] = useState(2026);
  const [romanStr, setRomanStr] = useState("MMXXVI");

  // Data storage states
  const [dataVal, setDataVal] = useState(256);
  const [dataFrom, setDataFrom] = useState("gb");
  const [dataTo, setDataTo] = useState("mb");

  // Speed states
  const [speedVal, setSpeedVal] = useState(100);
  const [speedFrom, setSpeedFrom] = useState("kmh");
  const [speedTo, setSpeedTo] = useState("mph");

  // Color Converter states
  const [hexColor, setHexColor] = useState("#1E4FD8");

  // Calculations
  const tzResult = convertTimeZone(dateTimeStr, fromZone, toZone);
  const dateDiffResult = calculateDateDifference(new Date(date1), new Date(date2));
  const ageDaysResult = calculateDateDifference(new Date(birthDate), new Date());
  const wordsResult = numberToWords(numberInput, isIndianSystem);
  const romanResult = integerToRoman(romanInt);
  const parsedRomanResult = romanToInteger(romanStr);
  const dataResult = convertDataStorage(dataVal, dataFrom, dataTo);
  const speedResult = convertSpeed(speedVal, speedFrom, speedTo);
  const colorResult = convertColor(hexColor);

  const converterTools = [
    { slug: "time-zone-converter", label: "Time Zone", icon: Clock },
    { slug: "date-difference-calculator", label: "Date Difference", icon: Calendar },
    { slug: "age-in-days-calculator", label: "Age in Days/Weeks", icon: Calendar },
    { slug: "number-to-words-converter", label: "Number to Words", icon: Hash },
    { slug: "roman-numeral-converter", label: "Roman Numeral", icon: Hash },
    { slug: "data-storage-converter", label: "Data Storage", icon: Ruler },
    { slug: "speed-converter", label: "Speed", icon: Ruler },
    { slug: "color-converter", label: "Color Converter & WCAG", icon: Palette },
  ];

  return (
    <div className="space-y-6">
      {/* Switcher Navigation */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
        {converterTools.map((t) => {
          const Icon = t.icon;
          const isActive = activeSlug === t.slug;
          return (
            <a
              key={t.slug}
              href={`/converters/${t.slug}/`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-secondary/40 text-muted hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
            </a>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* INPUT PANEL */}
        <div className="space-y-4 bg-card border border-border p-6 rounded-2xl shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-2">Input Parameters</h3>

          {/* 1. Timezone */}
          {activeSlug === "time-zone-converter" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="tz-time" className="text-xs font-medium text-foreground">
                  Date & Time
                </label>
                <input
                  id="tz-time"
                  type="datetime-local"
                  value={dateTimeStr}
                  onChange={(e) => setDateTimeStr(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="tz-from" className="text-xs font-medium text-foreground">
                  Source Time Zone (From)
                </label>
                <select
                  id="tz-from"
                  value={fromZone}
                  onChange={(e) => setFromZone(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {WORLD_TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const temp = fromZone;
                    setFromZone(toZone);
                    setToZone(temp);
                  }}
                  className="p-2 rounded-full border border-border bg-secondary/40 hover:bg-primary hover:text-primary-foreground text-foreground transition-all cursor-pointer"
                  title="Swap time zones"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="tz-to" className="text-xs font-medium text-foreground">
                  Target Time Zone (To)
                </label>
                <select
                  id="tz-to"
                  value={toZone}
                  onChange={(e) => setToZone(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {WORLD_TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* 2. Date Difference */}
          {activeSlug === "date-difference-calculator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="date1-val" className="text-xs font-medium text-foreground">Start Date</label>
                <input
                  id="date1-val"
                  type="date"
                  value={date1}
                  onChange={(e) => setDate1(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="date2-val" className="text-xs font-medium text-foreground">End Date</label>
                <input
                  id="date2-val"
                  type="date"
                  value={date2}
                  onChange={(e) => setDate2(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}

          {/* 3. Age in Days/Weeks */}
          {activeSlug === "age-in-days-calculator" && (
            <div className="space-y-3">
              <label htmlFor="birthdate-val" className="text-xs font-medium text-foreground">Date of Birth or Target Event Date</label>
              <input
                id="birthdate-val"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          {/* 4. Number to Words */}
          {activeSlug === "number-to-words-converter" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="num-input-val" className="text-xs font-medium text-foreground">Number to Spell</label>
                <input
                  id="num-input-val"
                  type="number"
                  value={numberInput}
                  onChange={(e) => setNumberInput(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-base font-bold font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={isIndianSystem}
                  onChange={(e) => setIsIndianSystem(e.target.checked)}
                  className="rounded accent-primary"
                />
                Use Indian Numbering System (Lakhs & Crores)
              </label>
            </div>
          )}

          {/* 5. Roman Numeral */}
          {activeSlug === "roman-numeral-converter" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="roman-int-val" className="text-xs font-medium text-foreground">Standard Integer (1 – 3999)</label>
                <input
                  id="roman-int-val"
                  type="number"
                  min="1"
                  max="3999"
                  value={romanInt}
                  onChange={(e) => setRomanInt(Math.max(1, Math.min(3999, Number(e.target.value))))}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="roman-str-val" className="text-xs font-medium text-foreground">Roman Numeral to Decode</label>
                <input
                  id="roman-str-val"
                  type="text"
                  value={romanStr}
                  onChange={(e) => setRomanStr(e.target.value.toUpperCase())}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm font-mono uppercase text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}

          {/* 6. Data Storage */}
          {activeSlug === "data-storage-converter" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="data-val-inp" className="text-xs font-medium text-foreground">Size Value</label>
                <input
                  id="data-val-inp"
                  type="number"
                  value={dataVal}
                  onChange={(e) => setDataVal(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-base font-bold font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="data-from-sel" className="text-xs font-medium text-foreground">From</label>
                  <select
                    id="data-from-sel"
                    value={dataFrom}
                    onChange={(e) => setDataFrom(e.target.value)}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                  >
                    {dataStorageUnits.map((u) => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="data-to-sel" className="text-xs font-medium text-foreground">To</label>
                  <select
                    id="data-to-sel"
                    value={dataTo}
                    onChange={(e) => setDataTo(e.target.value)}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                  >
                    {dataStorageUnits.map((u) => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 7. Speed */}
          {activeSlug === "speed-converter" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="speed-val-inp" className="text-xs font-medium text-foreground">Speed Value</label>
                <input
                  id="speed-val-inp"
                  type="number"
                  value={speedVal}
                  onChange={(e) => setSpeedVal(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-base font-bold font-mono text-foreground focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="speed-from-sel" className="text-xs font-medium text-foreground">From</label>
                  <select
                    id="speed-from-sel"
                    value={speedFrom}
                    onChange={(e) => setSpeedFrom(e.target.value)}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                  >
                    {speedUnits.map((u) => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="speed-to-sel" className="text-xs font-medium text-foreground">To</label>
                  <select
                    id="speed-to-sel"
                    value={speedTo}
                    onChange={(e) => setSpeedTo(e.target.value)}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus:outline-none"
                  >
                    {speedUnits.map((u) => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 8. Color Converter */}
          {activeSlug === "color-converter" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="hex-color-inp" className="text-xs font-medium text-foreground">HEX Color Code</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colorResult ? colorResult.hex : "#1E4FD8"}
                    onChange={(e) => setHexColor(e.target.value)}
                    className="h-10 w-14 rounded-lg border border-input cursor-pointer bg-card p-0.5"
                  />
                  <input
                    id="hex-color-inp"
                    type="text"
                    value={hexColor}
                    onChange={(e) => setHexColor(e.target.value)}
                    placeholder="#1E4FD8"
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm font-mono font-bold text-foreground focus:outline-none uppercase"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RESULTS PANEL */}
        <div className="bg-secondary/30 border border-border p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">Calculated Result</h3>

            {/* Timezone Results */}
            {activeSlug === "time-zone-converter" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                  <span className="text-xs text-muted block uppercase tracking-wider">Converted Local Time in {toZone}</span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-primary select-all">
                    {tzResult}
                  </div>
                </div>
                <div className="text-xs text-muted leading-relaxed">
                  Formula adjusts automatically for daylight saving time (DST) and standard astronomical offsets.
                </div>
              </div>
            )}

            {/* Date Diff Results */}
            {activeSlug === "date-difference-calculator" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card border border-border p-3 rounded-lg text-center">
                    <span className="text-[10px] uppercase font-bold text-muted block">Total Days</span>
                    <span className="text-2xl font-heading font-extrabold text-primary tabular-nums">{dateDiffResult.days}</span>
                  </div>
                  <div className="bg-card border border-border p-3 rounded-lg text-center">
                    <span className="text-[10px] uppercase font-bold text-muted block">Total Weeks</span>
                    <span className="text-2xl font-heading font-extrabold text-foreground tabular-nums">{dateDiffResult.weeks}</span>
                  </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-lg">
                  <span className="text-xs text-muted block uppercase tracking-wider mb-1">Calendar Gap</span>
                  <span className="text-sm font-bold text-foreground">{dateDiffResult.breakdown}</span>
                </div>
              </div>
            )}

            {/* Age in Days */}
            {activeSlug === "age-in-days-calculator" && (
              <div className="space-y-3">
                <div className="bg-card border border-border p-4 rounded-lg space-y-1">
                  <span className="text-xs text-muted block uppercase tracking-wider">Exact Days Lived</span>
                  <span className="text-3xl font-heading font-black text-primary tabular-nums">
                    {ageDaysResult.days.toLocaleString()} Days
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card border border-border p-3 rounded-lg text-center">
                    <span className="text-[10px] uppercase font-bold text-muted block">Weeks</span>
                    <span className="text-lg font-bold text-foreground tabular-nums">{ageDaysResult.weeks.toLocaleString()}</span>
                  </div>
                  <div className="bg-card border border-border p-3 rounded-lg text-center">
                    <span className="text-[10px] uppercase font-bold text-muted block">Months</span>
                    <span className="text-lg font-bold text-foreground tabular-nums">{ageDaysResult.months.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Number to Words */}
            {activeSlug === "number-to-words-converter" && (
              <div className="space-y-3">
                <span className="text-xs text-muted block uppercase tracking-wider">Spelled Words</span>
                <div className="bg-card border border-border p-4 rounded-lg text-sm sm:text-base font-bold text-foreground leading-relaxed select-all">
                  {wordsResult}
                </div>
                <button
                  onClick={() => triggerCopy(wordsResult, "words-copy")}
                  className="w-full py-2 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedKey === "words-copy" ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey === "words-copy" ? "Copied Words!" : "Copy Words"}
                </button>
              </div>
            )}

            {/* Roman Numeral */}
            {activeSlug === "roman-numeral-converter" && (
              <div className="space-y-3">
                <div className="bg-card border border-border p-3 rounded-lg">
                  <span className="text-xs text-muted block uppercase tracking-wider mb-1">Roman Numeral</span>
                  <span className="text-2xl font-mono font-extrabold text-primary select-all">{romanResult}</span>
                </div>
                <div className="bg-card border border-border p-3 rounded-lg">
                  <span className="text-xs text-muted block uppercase tracking-wider mb-1">Parsed Integer from &ldquo;{romanStr}&rdquo;</span>
                  <span className="text-2xl font-mono font-extrabold text-emerald-600 select-all">{parsedRomanResult}</span>
                </div>
              </div>
            )}

            {/* Data Storage */}
            {activeSlug === "data-storage-converter" && (
              <div className="space-y-3">
                <span className="text-xs text-muted block uppercase tracking-wider">Converted Size</span>
                <div className="bg-card border border-border p-4 rounded-lg text-2xl font-mono font-black text-primary select-all">
                  {dataResult.toLocaleString(undefined, { maximumFractionDigits: 6 })} {dataTo.toUpperCase()}
                </div>
              </div>
            )}

            {/* Speed */}
            {activeSlug === "speed-converter" && (
              <div className="space-y-3">
                <span className="text-xs text-muted block uppercase tracking-wider">Converted Velocity</span>
                <div className="bg-card border border-border p-4 rounded-lg text-2xl font-mono font-black text-primary select-all">
                  {speedResult.toLocaleString(undefined, { maximumFractionDigits: 4 })} {speedTo.toUpperCase()}
                </div>
              </div>
            )}

            {/* Color Converter */}
            {activeSlug === "color-converter" && colorResult && (
              <div className="space-y-4">
                <div
                  className="h-16 rounded-xl border border-border shadow-xs flex items-center justify-center font-mono font-bold text-sm"
                  style={{
                    backgroundColor: colorResult.hex,
                    color: colorResult.contrastWithWhite >= 4.5 ? "#ffffff" : "#000000",
                  }}
                >
                  {colorResult.hex}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-card border border-border p-2 rounded">
                    <span className="text-[10px] text-muted block">RGB</span>
                    <span className="font-bold text-foreground">rgb({colorResult.rgb.r}, {colorResult.rgb.g}, {colorResult.rgb.b})</span>
                  </div>
                  <div className="bg-card border border-border p-2 rounded">
                    <span className="text-[10px] text-muted block">HSL</span>
                    <span className="font-bold text-foreground">hsl({colorResult.hsl.h}, {colorResult.hsl.s}%, {colorResult.hsl.l}%)</span>
                  </div>
                  <div className="bg-card border border-border p-2 rounded col-span-2">
                    <span className="text-[10px] text-muted block">CMYK</span>
                    <span className="font-bold text-foreground">cmyk({colorResult.cmyk.c}%, {colorResult.cmyk.m}%, {colorResult.cmyk.y}%, {colorResult.cmyk.k}%)</span>
                  </div>
                </div>

                <div className="bg-card border border-border p-3 rounded-lg space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-muted block">WCAG 2.1 Contrast Ratings</span>
                  <div className="flex justify-between items-center">
                    <span>On White Background: <strong>{colorResult.contrastWithWhite}:1</strong></span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colorResult.wcagWhiteRating !== "Fail" ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"}`}>
                      {colorResult.wcagWhiteRating}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
