import React, { useState, useEffect } from "react";
import { unitCategories, convertUnits } from "../../lib/calculators/unit-calculator";
import { ArrowRightLeft, Copy, Check, Sparkles } from "lucide-react";

export default function UnitConverter() {
  const [activeCategory, setActiveCategory] = useState<string>("length");
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>("m");
  const [toUnit, setToUnit] = useState<string>("foot");
  const [copied, setCopied] = useState(false);

  const categoryData = unitCategories[activeCategory];

  useEffect(() => {
    const data = unitCategories[activeCategory];
    if (data && data.units.length >= 2) {
      setFromUnit(data.units[0].value);
      setToUnit(data.units[1].value);
    }
  }, [activeCategory]);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const result = convertUnits(inputValue, fromUnit, toUnit, activeCategory);

  const copyResult = () => {
    navigator.clipboard.writeText(result.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fromLabel = categoryData?.units.find((u) => u.value === fromUnit)?.label || fromUnit;
  const toLabel = categoryData?.units.find((u) => u.value === toUnit)?.label || toUnit;

  return (
    <div className="space-y-6">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
        {Object.keys(unitCategories).map((key) => {
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-secondary/40 text-muted hover:text-foreground hover:bg-secondary/70"
              }`}
            >
              {unitCategories[key].label}
            </button>
          );
        })}
      </div>

      {/* Main Converter Card */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* From Side */}
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="from-unit-select" className="text-xs font-bold uppercase tracking-wider text-muted block">
              From
            </label>
            <select
              id="from-unit-select"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categoryData?.units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              placeholder="Enter value"
              className="w-full rounded-lg border border-input bg-secondary/20 px-3.5 py-2.5 text-base font-bold font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Swap Action in Middle */}
          <div className="md:col-span-1 flex justify-center py-2 md:py-0">
            <button
              onClick={handleSwap}
              title="Swap units"
              className="h-11 w-11 rounded-full border border-border bg-secondary/50 hover:bg-primary hover:text-primary-foreground text-foreground flex items-center justify-center transition-all cursor-pointer shadow-xs hover:rotate-180 duration-200"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
          </div>

          {/* To Side */}
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="to-unit-select" className="text-xs font-bold uppercase tracking-wider text-muted block">
              To
            </label>
            <select
              id="to-unit-select"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categoryData?.units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
            <div className="w-full rounded-lg border border-input bg-primary/5 px-3.5 py-2.5 text-base font-bold font-mono text-primary flex items-center justify-between min-h-[46px]">
              <span className="truncate select-all">
                {result.toLocaleString(undefined, { maximumFractionDigits: 7 })}
              </span>
              <button
                onClick={copyResult}
                className="shrink-0 p-1 rounded hover:bg-primary/10 transition-colors cursor-pointer text-muted hover:text-primary"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Formula Breakdown Summary */}
        <div className="rounded-xl bg-secondary/30 border border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-0.5">
              Exact Conversion Equation
            </span>
            <div className="text-sm font-semibold text-foreground">
              <span className="font-mono text-primary font-bold">{inputValue}</span> {fromLabel.split(" (")[0]} ={" "}
              <span className="font-mono text-emerald-600 font-extrabold">
                {result.toLocaleString(undefined, { maximumFractionDigits: 7 })}
              </span>{" "}
              {toLabel.split(" (")[0]}
            </div>
          </div>
          <button
            onClick={() => {
              setInputValue(1);
            }}
            className="text-xs text-muted hover:text-primary font-medium flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="h-3 w-3" /> Reset to 1
          </button>
        </div>
      </div>
    </div>
  );
}
