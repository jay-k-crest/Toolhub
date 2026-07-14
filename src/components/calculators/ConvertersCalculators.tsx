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

interface ConvertersProps {
  slug: string;
}

export default function ConvertersCalculators({ slug }: ConvertersProps) {
  const [activeSlug, setActiveSlug] = useState(slug);

  useEffect(() => {
    setActiveSlug(slug);
  }, [slug]);

  // Timezone states
  const [dateTimeStr, setDateTimeStr] = useState(new Date().toISOString().slice(0, 16));
  const [fromZone, setFromZone] = useState("UTC");
  const [toZone, setToZone] = useState("Asia/Kolkata");

  // Date Diff states
  const [date1, setDate1] = useState(new Date().toISOString().split("T")[0]);
  const [date2, setDate2] = useState(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);

  // Age in Days/Weeks states
  const [birthDate, setBirthDate] = useState("1995-01-01");

  // Number to Words states
  const [numberInput, setNumberInput] = useState(12345);
  const [isIndianSystem, setIsIndianSystem] = useState(true);

  // Roman Numeral states
  const [romanInt, setRomanInt] = useState(14);
  const [romanStr, setRomanStr] = useState("XIV");

  // Data storage states
  const [dataVal, setDataVal] = useState(10);
  const [dataFrom, setDataFrom] = useState("gb");
  const [dataTo, setDataTo] = useState("mb");

  // Speed states
  const [speedVal, setSpeedVal] = useState(60);
  const [speedFrom, setSpeedFrom] = useState("mph");
  const [speedTo, setSpeedTo] = useState("kmh");

  // Calculations
  const tzResult = convertTimeZone(dateTimeStr, fromZone, toZone);
  const dateDiffResult = calculateDateDifference(new Date(date1), new Date(date2));
  const ageDaysResult = calculateDateDifference(new Date(birthDate), new Date());
  const wordsResult = numberToWords(numberInput, isIndianSystem);
  const romanResult = integerToRoman(romanInt);
  const parsedRomanResult = romanToInteger(romanStr);
  const dataResult = convertDataStorage(dataVal, dataFrom, dataTo);
  const speedResult = convertSpeed(speedVal, speedFrom, speedTo);

  const converterTools = [
    { slug: "time-zone-converter", label: "Time Zone" },
    { slug: "date-difference-calculator", label: "Date Difference" },
    { slug: "age-in-days-calculator", label: "Age in Days/Weeks" },
    { slug: "number-to-words-converter", label: "Number to Words" },
    { slug: "roman-numeral-converter", label: "Roman Numeral" },
    { slug: "data-storage-converter", label: "Data Storage" },
    { slug: "speed-converter", label: "Speed" },
  ];

  return (
    <div className="space-y-6">
      {/* Switcher */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
        {converterTools.map((t) => (
          <a
            key={t.slug}
            href={`/converters/${t.slug}/`}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeSlug === t.slug
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/40 text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* INPUT PANEL */}
        <div className="space-y-4 bg-card border border-border p-6 rounded-xl">
          <h3 className="text-lg font-bold text-foreground mb-4">Inputs</h3>

          {/* 1. Timezone */}
          {activeSlug === "time-zone-converter" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="tz-time" className="text-sm font-medium text-foreground">Date & Time</label>
                <input
                  id="tz-time"
                  type="datetime-local"
                  value={dateTimeStr}
                  onChange={(e) => setDateTimeStr(e.target.value)}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="tz-from" className="text-sm font-medium text-foreground">From Zone</label>
                  <select
                    id="tz-from"
                    value={fromZone}
                    onChange={(e) => setFromZone(e.target.value)}
                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    <option value="UTC">UTC/GMT</option>
                    <option value="America/New_York">EST/EDT (New York)</option>
                    <option value="Europe/London">GMT/BST (London)</option>
                    <option value="Asia/Kolkata">IST (India)</option>
                    <option value="Asia/Singapore">SGT (Singapore)</option>
                    <option value="Australia/Sydney">AEST/AEDT (Sydney)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="tz-to" className="text-sm font-medium text-foreground">To Zone</label>
                  <select
                    id="tz-to"
                    value={toZone}
                    onChange={(e) => setToZone(e.target.value)}
                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    <option value="Asia/Kolkata">IST (India)</option>
                    <option value="UTC">UTC/GMT</option>
                    <option value="America/New_York">EST/EDT (New York)</option>
                    <option value="Europe/London">GMT/BST (London)</option>
                    <option value="Asia/Singapore">SGT (Singapore)</option>
                    <option value="Australia/Sydney">AEST/AEDT (Sydney)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 2. Date Difference */}
          {activeSlug === "date-difference-calculator" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="date1-val" className="text-sm font-medium text-foreground">Start Date</label>
                <input
                  id="date1-val"
                  type="date"
                  value={date1}
                  onChange={(e) => setDate1(e.target.value)}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="date2-val" className="text-sm font-medium text-foreground">End Date</label>
                <input
                  id="date2-val"
                  type="date"
                  value={date2}
                  onChange={(e) => setDate2(e.target.value)}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 3. Age in Days/Weeks */}
          {activeSlug === "age-in-days-calculator" && (
            <div className="space-y-1.5">
              <label htmlFor="birthdate-val" className="text-sm font-medium text-foreground">Enter Date of Birth / Event Date</label>
              <input
                id="birthdate-val"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
              />
            </div>
          )}

          {/* 4. Number to Words */}
          {activeSlug === "number-to-words-converter" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="num-input-val" className="text-sm font-medium text-foreground">Number</label>
                <input
                  id="num-input-val"
                  type="number"
                  value={numberInput}
                  onChange={(e) => setNumberInput(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="system-toggle"
                  type="checkbox"
                  checked={isIndianSystem}
                  onChange={(e) => setIsIndianSystem(e.target.checked)}
                  className="h-4 w-4 bg-secondary border-input accent-primary"
                />
                <label htmlFor="system-toggle" className="text-sm font-medium text-foreground">Use Indian System (Lakh/Crore)</label>
              </div>
            </div>
          )}

          {/* 5. Roman Numeral */}
          {activeSlug === "roman-numeral-converter" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="roman-int-val" className="text-sm font-medium text-foreground">Number to Roman (1-3999)</label>
                <input
                  id="roman-int-val"
                  type="number"
                  min="1"
                  max="3999"
                  value={romanInt}
                  onChange={(e) => setRomanInt(Math.max(1, Math.min(3999, Number(e.target.value))))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="roman-str-val" className="text-sm font-medium text-foreground">Roman to Number</label>
                <input
                  id="roman-str-val"
                  type="text"
                  value={romanStr}
                  onChange={(e) => setRomanStr(e.target.value)}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none uppercase"
                />
              </div>
            </div>
          )}

          {/* 6. Data Storage */}
          {activeSlug === "data-storage-converter" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="data-val-inp" className="text-sm font-medium text-foreground">Value</label>
                <input
                  id="data-val-inp"
                  type="number"
                  value={dataVal}
                  onChange={(e) => setDataVal(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="data-from-sel" className="text-sm font-medium text-foreground">From</label>
                  <select
                    id="data-from-sel"
                    value={dataFrom}
                    onChange={(e) => setDataFrom(e.target.value)}
                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    {dataStorageUnits.map(u => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="data-to-sel" className="text-sm font-medium text-foreground">To</label>
                  <select
                    id="data-to-sel"
                    value={dataTo}
                    onChange={(e) => setDataTo(e.target.value)}
                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    {dataStorageUnits.map(u => (
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
                <label htmlFor="speed-val-inp" className="text-sm font-medium text-foreground">Speed Value</label>
                <input
                  id="speed-val-inp"
                  type="number"
                  value={speedVal}
                  onChange={(e) => setSpeedVal(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="speed-from-sel" className="text-sm font-medium text-foreground">From</label>
                  <select
                    id="speed-from-sel"
                    value={speedFrom}
                    onChange={(e) => setSpeedFrom(e.target.value)}
                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    {speedUnits.map(u => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="speed-to-sel" className="text-sm font-medium text-foreground">To</label>
                  <select
                    id="speed-to-sel"
                    value={speedTo}
                    onChange={(e) => setSpeedTo(e.target.value)}
                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    {speedUnits.map(u => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RESULTS PANEL */}
        <div className="bg-secondary/30 border border-border p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Results</h3>

            {/* 1. Timezone Results */}
            {activeSlug === "time-zone-converter" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Converted Date & Time</span>
                  <span className="text-2xl font-bold text-primary">
                    {tzResult}
                  </span>
                </div>
                <div className="text-xs text-muted border-t border-border pt-4">
                  Formatted in standard 12-hour format of target timezone ({toZone}).
                </div>
              </div>
            )}

            {/* 2. Date Difference Results */}
            {activeSlug === "date-difference-calculator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Calendar Gap</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {dateDiffResult.days}
                  </span>{" "}
                  <span className="text-lg font-bold text-foreground">Days</span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Breakdown:</span>
                    <span className="font-semibold">{dateDiffResult.breakdown}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Weeks:</span>
                    <span className="font-semibold tabular-nums">{dateDiffResult.weeks} weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Months:</span>
                    <span className="font-semibold tabular-nums">{dateDiffResult.months} months</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Age in Days Results */}
            {activeSlug === "age-in-days-calculator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Total Age in Days</span>
                  <span className="text-4xl font-heading font-extrabold text-primary tabular-nums">
                    {ageDaysResult.days.toLocaleString()}
                  </span>{" "}
                  <span className="text-lg font-bold text-foreground">Days</span>
                </div>
                <div className="text-sm text-muted border-t border-border pt-4">
                  Equivalent to <span className="font-bold text-foreground tabular-nums">{ageDaysResult.weeks.toLocaleString()} weeks</span> or{" "}
                  <span className="font-bold text-foreground tabular-nums">{ageDaysResult.months} months</span>.
                </div>
              </div>
            )}

            {/* 4. Number to Words Results */}
            {activeSlug === "number-to-words-converter" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Spelled Words</span>
                  <p className="text-lg font-bold text-primary leading-snug">
                    {wordsResult}
                  </p>
                </div>
              </div>
            )}

            {/* 5. Roman Numeral Results */}
            {activeSlug === "roman-numeral-converter" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Roman Numeral of {romanInt}</span>
                  <span className="text-3xl font-bold text-primary tracking-widest">{romanResult}</span>
                </div>
                <div className="border-t border-border pt-4">
                  <span className="text-xs text-muted block uppercase tracking-wider mb-1">Standard Decimal value of "{romanStr}"</span>
                  <span className="text-2xl font-bold text-foreground tabular-nums">{parsedRomanResult || "Invalid Roman Numeral"}</span>
                </div>
              </div>
            )}

            {/* 6. Data Storage Results */}
            {activeSlug === "data-storage-converter" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Converted Storage</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {dataResult.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  </span>{" "}
                  <span className="text-lg font-bold text-foreground">
                    {dataStorageUnits.find(u => u.value === dataTo)?.label.split(" (")[0]}
                  </span>
                </div>
              </div>
            )}

            {/* 7. Speed Results */}
            {activeSlug === "speed-converter" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Converted Speed</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {speedResult.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                  </span>{" "}
                  <span className="text-lg font-bold text-foreground">
                    {speedUnits.find(u => u.value === speedTo)?.label.split(" (")[0]}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
