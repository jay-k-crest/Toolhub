import React, { useState, useEffect } from "react";
import {
  calculatePercentageChange,
  simplifyRatio,
  solveProportion,
  calculateStats,
  calculateStandardDeviation,
  calculateFractions,
  generateRandomNumbers,
  generateSecurePassword,
  analyzeText,
  generateJWTSecret,
  type Fraction,
} from "../../lib/calculators/math-calculators";

interface MathProps {
  slug: string;
}

export default function MathCalculators({ slug }: MathProps) {
  const [activeSlug, setActiveSlug] = useState(slug);

  useEffect(() => {
    setActiveSlug(slug);
  }, [slug]);

  // Percentage Change states
  const [oldVal, setOldVal] = useState(100);
  const [newVal, setNewVal] = useState(125);

  // Ratio states
  const [ratioA, setRatioA] = useState(12);
  const [ratioB, setRatioB] = useState(16);
  // Proportion states
  const [propA, setPropA] = useState<number | null>(3);
  const [propB, setPropB] = useState<number | null>(4);
  const [propC, setPropC] = useState<number | null>(9);
  const [propD, setPropD] = useState<number | null>(null);

  // Stats / SD states
  const [numSeries, setNumSeries] = useState("10, 15, 23, 12, 18, 30");

  // Fraction states
  const [f1Num, setF1Num] = useState(1);
  const [f1Den, setF1Den] = useState(2);
  const [f2Num, setF2Num] = useState(1);
  const [f2Den, setF2Den] = useState(3);
  const [fracOp, setFracOp] = useState<"+" | "-" | "*" | "/">("+");

  // Random number states
  const [randMin, setRandMin] = useState(1);
  const [randMax, setRandMax] = useState(100);
  const [randCount, setRandCount] = useState(1);
  const [randDup, setRandDup] = useState(true);
  const [randResults, setRandResults] = useState<number[]>([]);

  // Password states
  const [passLen, setPassLen] = useState(16);
  const [passUpper, setPassUpper] = useState(true);
  const [passLower, setPassLower] = useState(true);
  const [passNum, setPassNum] = useState(true);
  const [passSym, setPassSym] = useState(true);
  const [passResult, setPassResult] = useState("");

  // Word Counter states
  const [wordText, setWordText] = useState("Type or paste your text here to analyze words, characters, and reading speed.");

  // JWT Secret states
  const [jwtBits, setJwtBits] = useState<256 | 384 | 512>(256);
  const [jwtEncoding, setJwtEncoding] = useState<"base64" | "base64url" | "hex" | "plain">("base64");
  const [jwtResult, setJwtResult] = useState("");

  // Calculations
  const pctResult = calculatePercentageChange(oldVal, newVal);
  const ratioResult = simplifyRatio(ratioA, ratioB);
  
  // Solve proportion
  const solvedProp = solveProportion(propA, propB, propC, propD);

  // Parse list of numbers
  const parseNumbers = (str: string): number[] => {
    return str
      .split(/[\s,]+/)
      .map(Number)
      .filter(n => !isNaN(n));
  };
  const numbersList = parseNumbers(numSeries);
  const statsResult = calculateStats(numbersList);
  const sdResult = calculateStandardDeviation(numbersList);

  // Fractions
  const fracResult = calculateFractions(
    { numerator: f1Num, denominator: f1Den },
    { numerator: f2Num, denominator: f2Den },
    fracOp
  );

  // Word Counter
  const textAnalysis = analyzeText(wordText);

  const mathTools = [
    { slug: "percentage-increase-calculator", label: "Percentage Change" },
    { slug: "ratio-calculator", label: "Ratio & Proportions" },
    { slug: "average-calculator", label: "Averages (Mean/Median)" },
    { slug: "standard-deviation-calculator", label: "Standard Deviation" },
    { slug: "fraction-calculator", label: "Fraction Calculator" },
    { slug: "random-number-generator", label: "Random Generator" },
    { slug: "password-generator", label: "Password Generator" },
    { slug: "word-counter", label: "Word Counter" },
    { slug: "jwt-secret-generator", label: "JWT Secret Generator" },
  ];

  return (
    <div className="space-y-6">
      {/* Switcher */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
        {mathTools.map((t) => (
          <a
            key={t.slug}
            href={`/math/${t.slug}/`}
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

          {/* 1. Percentage Change */}
          {activeSlug === "percentage-increase-calculator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="old-val" className="text-sm font-medium text-foreground">Old Value</label>
                <input
                  id="old-val"
                  type="number"
                  value={oldVal}
                  onChange={(e) => setOldVal(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="new-val" className="text-sm font-medium text-foreground">New Value</label>
                <input
                  id="new-val"
                  type="number"
                  value={newVal}
                  onChange={(e) => setNewVal(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 2. Ratio & Proportions */}
          {activeSlug === "ratio-calculator" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold text-muted uppercase block border-b border-border pb-1">Simplify Ratio (A : B)</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="ratio-a" className="text-sm font-medium text-foreground">Value A</label>
                    <input
                      id="ratio-a"
                      type="number"
                      value={ratioA}
                      onChange={(e) => setRatioA(Number(e.target.value))}
                      className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="ratio-b" className="text-sm font-medium text-foreground">Value B</label>
                    <input
                      id="ratio-b"
                      type="number"
                      value={ratioB}
                      onChange={(e) => setRatioB(Number(e.target.value))}
                      className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Proportions */}
              <div className="space-y-4 pt-2">
                <span className="text-xs font-bold text-muted uppercase block border-b border-border pb-1">Solve Proportions (A : B = C : D)</span>
                <p className="text-xs text-muted">Enter any 3 values and leave one empty to calculate it.</p>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label htmlFor="prop-a" className="text-[10px] text-muted block mb-1">A</label>
                    <input
                      id="prop-a"
                      type="number"
                      placeholder="Empty"
                      value={propA ?? ""}
                      onChange={(e) => setPropA(e.target.value ? Number(e.target.value) : null)}
                      className="w-full rounded-md border border-input bg-secondary/35 p-1.5 text-xs text-center text-foreground focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="prop-b" className="text-[10px] text-muted block mb-1">B</label>
                    <input
                      id="prop-b"
                      type="number"
                      placeholder="Empty"
                      value={propB ?? ""}
                      onChange={(e) => setPropB(e.target.value ? Number(e.target.value) : null)}
                      className="w-full rounded-md border border-input bg-secondary/35 p-1.5 text-xs text-center text-foreground focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="prop-c" className="text-[10px] text-muted block mb-1">C</label>
                    <input
                      id="prop-c"
                      type="number"
                      placeholder="Empty"
                      value={propC ?? ""}
                      onChange={(e) => setPropC(e.target.value ? Number(e.target.value) : null)}
                      className="w-full rounded-md border border-input bg-secondary/35 p-1.5 text-xs text-center text-foreground focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="prop-d" className="text-[10px] text-muted block mb-1">D</label>
                    <input
                      id="prop-d"
                      type="number"
                      placeholder="Empty"
                      value={propD ?? ""}
                      onChange={(e) => setPropD(e.target.value ? Number(e.target.value) : null)}
                      className="w-full rounded-md border border-input bg-secondary/35 p-1.5 text-xs text-center text-foreground focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Averages / SD Series */}
          {["average-calculator", "standard-deviation-calculator"].includes(activeSlug) && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="series-val" className="text-sm font-medium text-foreground">Enter Numbers (comma or space separated)</label>
                <textarea
                  id="series-val"
                  value={numSeries}
                  onChange={(e) => setNumSeries(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-2 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="text-xs text-muted font-semibold tabular-nums">
                Parsed Numbers Count: {numbersList.length}
              </div>
            </div>
          )}

          {/* 4. Fraction Calculator */}
          {activeSlug === "fraction-calculator" && (
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                {/* Fraction 1 */}
                <div className="flex flex-col gap-1 w-20 text-center">
                  <input
                    aria-label="Fraction 1 Numerator"
                    type="number"
                    value={f1Num}
                    onChange={(e) => setF1Num(Number(e.target.value))}
                    className="rounded-md border border-input bg-secondary/30 p-1.5 text-center text-sm font-semibold focus:outline-none"
                  />
                  <div className="border-t border-foreground my-1" />
                  <input
                    aria-label="Fraction 1 Denominator"
                    type="number"
                    value={f1Den}
                    onChange={(e) => setF1Den(Number(e.target.value))}
                    className="rounded-md border border-input bg-secondary/30 p-1.5 text-center text-sm font-semibold focus:outline-none"
                  />
                </div>

                {/* Operator */}
                <select
                  aria-label="Fraction Operator"
                  value={fracOp}
                  onChange={(e) => setFracOp(e.target.value as any)}
                  className="rounded-md border border-input bg-card p-1.5 text-sm font-semibold focus:outline-none"
                >
                  <option value="+">+</option>
                  <option value="-">-</option>
                  <option value="*">×</option>
                  <option value="/">÷</option>
                </select>

                {/* Fraction 2 */}
                <div className="flex flex-col gap-1 w-20 text-center">
                  <input
                    aria-label="Fraction 2 Numerator"
                    type="number"
                    value={f2Num}
                    onChange={(e) => setF2Num(Number(e.target.value))}
                    className="rounded-md border border-input bg-secondary/30 p-1.5 text-center text-sm font-semibold focus:outline-none"
                  />
                  <div className="border-t border-foreground my-1" />
                  <input
                    aria-label="Fraction 2 Denominator"
                    type="number"
                    value={f2Den}
                    onChange={(e) => setF2Den(Number(e.target.value))}
                    className="rounded-md border border-input bg-secondary/30 p-1.5 text-center text-sm font-semibold focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. Random Generator */}
          {activeSlug === "random-number-generator" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="rand-min" className="text-sm font-medium text-foreground">Min Range</label>
                  <input
                    id="rand-min"
                    type="number"
                    value={randMin}
                    onChange={(e) => setRandMin(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="rand-max" className="text-sm font-medium text-foreground">Max Range</label>
                  <input
                    id="rand-max"
                    type="number"
                    value={randMax}
                    onChange={(e) => setRandMax(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="rand-cnt" className="text-sm font-medium text-foreground">How many numbers?</label>
                  <input
                    id="rand-cnt"
                    type="number"
                    min="1"
                    value={randCount}
                    onChange={(e) => setRandCount(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    id="dup-check"
                    type="checkbox"
                    checked={randDup}
                    onChange={(e) => setRandDup(e.target.checked)}
                    className="h-4 w-4 bg-secondary border-input accent-primary"
                  />
                  <label htmlFor="dup-check" className="text-sm font-medium text-foreground">Allow Duplicates</label>
                </div>
              </div>
              <button
                onClick={() => setRandResults(generateRandomNumbers(randMin, randMax, randCount, randDup))}
                className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-md w-full"
              >
                Generate Numbers
              </button>
            </div>
          )}

          {/* 6. Password Generator */}
          {activeSlug === "password-generator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="pass-len" className="text-sm font-medium text-foreground">Password Length ({passLen})</label>
                <input
                  id="pass-len"
                  type="range"
                  min="6"
                  max="32"
                  value={passLen}
                  onChange={(e) => setPassLen(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={passUpper}
                    onChange={(e) => setPassUpper(e.target.checked)}
                    className="accent-primary h-4 w-4"
                  />
                  Uppercase (A-Z)
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={passLower}
                    onChange={(e) => setPassLower(e.target.checked)}
                    className="accent-primary h-4 w-4"
                  />
                  Lowercase (a-z)
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={passNum}
                    onChange={(e) => setPassNum(e.target.checked)}
                    className="accent-primary h-4 w-4"
                  />
                  Numbers (0-9)
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={passSym}
                    onChange={(e) => setPassSym(e.target.checked)}
                    className="accent-primary h-4 w-4"
                  />
                  Symbols (@#$%)
                </label>
              </div>
              <button
                onClick={() => setPassResult(generateSecurePassword(passLen, { upper: passUpper, lower: passLower, numbers: passNum, symbols: passSym }))}
                className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-md w-full"
              >
                Generate Password
              </button>
            </div>
          )}

          {/* 7. Word Counter */}
          {activeSlug === "word-counter" && (
            <div className="space-y-1.5">
              <label htmlFor="counter-txt" className="text-sm font-medium text-foreground">Type text to analyze</label>
              <textarea
                id="counter-txt"
                value={wordText}
                onChange={(e) => setWordText(e.target.value)}
                rows={6}
                className="w-full rounded-md border border-input bg-secondary/30 px-3 py-2 text-sm font-semibold text-foreground focus:outline-none"
              />
            </div>
          )}

          {/* 8. JWT Secret Generator */}
          {activeSlug === "jwt-secret-generator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="jwt-bits-sel" className="text-sm font-medium text-foreground">Secret Key Length</label>
                <select
                  id="jwt-bits-sel"
                  value={jwtBits}
                  onChange={(e) => setJwtBits(Number(e.target.value) as any)}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                >
                  <option value="256">256-bit (32 bytes - HS256 recommended)</option>
                  <option value="384">384-bit (48 bytes - HS384)</option>
                  <option value="512">512-bit (64 bytes - HS512)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="jwt-enc-sel" className="text-sm font-medium text-foreground">Encoding Format</label>
                <select
                  id="jwt-enc-sel"
                  value={jwtEncoding}
                  onChange={(e) => setJwtEncoding(e.target.value as any)}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                >
                  <option value="base64">Base64 Standard</option>
                  <option value="base64url">Base64URL (URL-safe, no padding)</option>
                  <option value="hex">Hexadecimal (0-9, a-f)</option>
                  <option value="plain">Plain Text (ASCII Printable characters)</option>
                </select>
              </div>
              <button
                onClick={() => setJwtResult(generateJWTSecret(jwtBits, jwtEncoding))}
                className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-md w-full"
              >
                Generate JWT Secret
              </button>
            </div>
          )}
        </div>

        {/* RESULTS PANEL */}
        <div className="bg-secondary/30 border border-border p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Results</h3>

            {/* 1. Percentage Change Results */}
            {activeSlug === "percentage-increase-calculator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Percentage Difference</span>
                  <span className="text-4xl font-heading font-extrabold text-primary tabular-nums">
                    {pctResult.percentage}%
                  </span>
                </div>
                <div className="border-t border-border pt-4 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Direction:</span>
                    <span className={`font-semibold ${pctResult.isIncrease ? "text-emerald-600" : "text-red-600"}`}>
                      {pctResult.isIncrease ? "Increase (▲)" : "Decrease (▼)"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-2">
                    <span>Absolute Difference:</span>
                    <span className="font-bold tabular-nums">{pctResult.difference.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Ratio & Proportions Results */}
            {activeSlug === "ratio-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Simplified Ratio</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {ratioResult.simplifiedA} : {ratioResult.simplifiedB}
                  </span>
                </div>

                <div className="border-t border-border pt-4">
                  <span className="text-xs text-muted block uppercase tracking-wider mb-1">Solved Proportion Value</span>
                  <span className="text-2xl font-bold text-foreground tabular-nums">
                    {solvedProp.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                  </span>
                </div>
              </div>
            )}

            {/* 3. Average Results */}
            {activeSlug === "average-calculator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Mean (Average)</span>
                  <span className="text-4xl font-heading font-extrabold text-primary tabular-nums">
                    {statsResult.mean.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Median:</span>
                    <span className="font-semibold tabular-nums">{statsResult.median}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mode:</span>
                    <span className="font-semibold tabular-nums">{statsResult.mode.length > 0 ? statsResult.mode.join(", ") : "No repeating mode"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Range:</span>
                    <span className="font-semibold tabular-nums">{statsResult.range}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Standard Deviation Results */}
            {activeSlug === "standard-deviation-calculator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Sample Std. Dev (s)</span>
                  <span className="text-4xl font-heading font-extrabold text-primary tabular-nums">
                    {sdResult.sdSample}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Population Std. Dev (σ):</span>
                    <span className="font-semibold tabular-nums">{sdResult.sdPopulation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sample Variance (s²):</span>
                    <span className="font-semibold tabular-nums">{sdResult.varianceSample}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Mean (Average):</span>
                    <span className="tabular-nums">{sdResult.mean}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Fraction Results */}
            {activeSlug === "fraction-calculator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Result Fraction</span>
                  <div className="flex flex-col gap-1 w-20 text-center pt-2">
                    <span className="text-xl font-bold text-primary tabular-nums">{fracResult.numerator}</span>
                    <div className="border-t border-primary my-1" />
                    <span className="text-xl font-bold text-primary tabular-nums">{fracResult.denominator}</span>
                  </div>
                </div>
                <div className="text-sm text-muted border-t border-border pt-4">
                  Decimal Value: <span className="font-bold text-foreground tabular-nums">{(fracResult.numerator / fracResult.denominator).toFixed(4)}</span>
                </div>
              </div>
            )}

            {/* 6. Random Numbers Results */}
            {activeSlug === "random-number-generator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider mb-2">Generated Output</span>
                  <div className="flex flex-wrap gap-2">
                    {randResults.length > 0 ? (
                      randResults.map((r, i) => (
                        <span key={i} className="bg-primary/10 text-primary border border-primary/20 rounded-md px-3 py-1 font-extrabold text-base tabular-nums">
                          {r}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted">Click generate button on input panel</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 7. Password Results */}
            {activeSlug === "password-generator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider mb-2">Generated Password</span>
                  <div className="bg-card border border-border rounded-md px-3 py-2 text-sm font-semibold select-all font-mono break-all text-primary">
                    {passResult || "Click generate button"}
                  </div>
                </div>
              </div>
            )}

            {/* 8. Word Counter Results */}
            {activeSlug === "word-counter" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted">Words</span>
                    <p className="text-2xl font-bold text-primary tabular-nums">{textAnalysis.words}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted">Characters</span>
                    <p className="text-2xl font-bold text-primary tabular-nums">{textAnalysis.charactersWithSpaces}</p>
                  </div>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Characters (no spaces):</span>
                    <span className="font-semibold tabular-nums">{textAnalysis.charactersNoSpaces}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sentences:</span>
                    <span className="font-semibold tabular-nums">{textAnalysis.sentences}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paragraphs:</span>
                    <span className="font-semibold tabular-nums">{textAnalysis.paragraphs}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-2 font-bold text-accent">
                    <span>Reading Time (~225 WPM):</span>
                    <span className="tabular-nums">{textAnalysis.readingTimeMinutes} mins</span>
                  </div>
                </div>
              </div>
            )}

            {/* 9. JWT Secret Results */}
            {activeSlug === "jwt-secret-generator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider mb-2">Cryptographic Secret</span>
                  <div className="bg-card border border-border rounded-md px-3 py-2 text-sm font-semibold select-all font-mono break-all text-primary">
                    {jwtResult || "Click generate button"}
                  </div>
                </div>
                <div className="text-[10px] text-muted border-t border-border/50 pt-2 leading-relaxed">
                  Tip: Copy this secret directly into your `.env` or JWT auth settings. Keep it confidential.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
