import React, { useState, useEffect } from "react";
import { unitCategories, convertUnits } from "../../lib/calculators/unit-calculator";

export default function UnitConverter() {
  const [activeCategory, setActiveCategory] = useState<string>("length");
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>("m");
  const [toUnit, setToUnit] = useState<string>("foot");

  const categoryData = unitCategories[activeCategory];

  // Sync units when category changes
  useEffect(() => {
    const data = unitCategories[activeCategory];
    if (data && data.units.length >= 2) {
      setFromUnit(data.units[0].value);
      setToUnit(data.units[1].value);
    }
  }, [activeCategory]);

  const result = convertUnits(inputValue, fromUnit, toUnit, activeCategory);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Category selector */}
        <div className="space-y-1.5 col-span-1 md:col-span-3">
          <label htmlFor="cat-select" className="text-sm font-medium text-foreground">Select Conversion Category</label>
          <select
            id="cat-select"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {Object.keys(unitCategories).map((key) => (
              <option key={key} value={key}>
                {unitCategories[key].label}
              </option>
            ))}
          </select>
        </div>

        {/* 2. From Unit and Input */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="from-unit-select" className="text-sm font-medium text-foreground">From Unit</label>
            <select
              id="from-unit-select"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categoryData?.units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="unit-input-val" className="text-sm font-medium text-foreground">Value to Convert</label>
            <input
              id="unit-input-val"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Arrow / Divider on Desktop */}
        <div className="hidden md:flex items-center justify-center pt-6">
          <div className="text-2xl font-bold text-muted-foreground">⇄</div>
        </div>

        {/* 3. To Unit and Output */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="to-unit-select" className="text-sm font-medium text-foreground">To Unit</label>
            <select
              id="to-unit-select"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categoryData?.units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1.5">
            <span className="text-sm font-medium text-foreground block">Converted Result</span>
            <div className="w-full rounded-md border border-input bg-secondary/30 px-3 py-2 text-sm text-foreground select-all tabular-nums font-semibold h-10 flex items-center">
              {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
            </div>
          </div>
        </div>

      </div>

      <div className="rounded-lg bg-secondary/35 border border-border p-4 mt-6 text-center">
        <span className="text-xs text-muted block uppercase tracking-wider mb-1">Conversion Formula Summary</span>
        <p className="text-sm text-foreground font-semibold">
          {inputValue} {categoryData?.units.find(u => u.value === fromUnit)?.label.split(" (")[0]} = {" "}
          <span className="text-primary text-base font-bold underline">
            {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </span>{" "}
          {categoryData?.units.find(u => u.value === toUnit)?.label.split(" (")[0]}
        </p>
      </div>
    </div>
  );
}
