import React, { useState } from "react";
import { calculateBMI } from "../../lib/calculators/bmi-calculator";

export default function BmiCalculator() {
  const [isMetric, setIsMetric] = useState(true);
  const [weight, setWeight] = useState(70);
  const [heightCm, setHeightCm] = useState(175);
  
  // Imperial inputs
  const [weightLbs, setWeightLbs] = useState(154);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);

  const activeWeight = isMetric ? weight : weightLbs;
  const activeHeight = isMetric ? heightCm : (heightFt * 12 + heightIn);

  const result = calculateBMI(activeWeight, activeHeight, isMetric);

  const categoryColorMap: Record<string, string> = {
    Underweight: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    Normal: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    Overweight: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    Obese: "text-red-500 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className="space-y-6">
      {/* Unit Selector tabs */}
      <div className="flex rounded-md bg-secondary p-1 w-fit">
        <button
          onClick={() => setIsMetric(true)}
          className={`px-4 py-1.5 text-xs font-semibold rounded-sm transition-all ${
            isMetric ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Metric (kg/cm)
        </button>
        <button
          onClick={() => setIsMetric(false)}
          className={`px-4 py-1.5 text-xs font-semibold rounded-sm transition-all ${
            !isMetric ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Imperial (lbs/ft)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Inputs */}
        <div className="space-y-4">
          {isMetric ? (
            <>
              {/* Weight Metric */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="metric-weight" className="text-sm font-medium text-foreground">Weight (kg)</label>
                  <span className="text-sm font-bold text-foreground">{weight} kg</span>
                </div>
                <input
                  id="metric-weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <input
                  type="range"
                  min="30"
                  max="150"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Height Metric */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="metric-height" className="text-sm font-medium text-foreground">Height (cm)</label>
                  <span className="text-sm font-bold text-foreground">{heightCm} cm</span>
                </div>
                <input
                  id="metric-height"
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <input
                  type="range"
                  min="100"
                  max="220"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </>
          ) : (
            <>
              {/* Weight Imperial */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="imp-weight" className="text-sm font-medium text-foreground">Weight (lbs)</label>
                  <span className="text-sm font-bold text-foreground">{weightLbs} lbs</span>
                </div>
                <input
                  id="imp-weight"
                  type="number"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <input
                  type="range"
                  min="60"
                  max="330"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Height Imperial */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Height</label>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <label htmlFor="height-ft" className="text-xs text-muted">Feet</label>
                    <input
                      id="height-ft"
                      type="number"
                      min="3"
                      max="8"
                      value={heightFt}
                      onChange={(e) => setHeightFt(Number(e.target.value))}
                      className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label htmlFor="height-in" className="text-xs text-muted">Inches</label>
                    <input
                      id="height-in"
                      type="number"
                      min="0"
                      max="11"
                      value={heightIn}
                      onChange={(e) => setHeightIn(Number(e.target.value))}
                      className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Display Results */}
        <div className="rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">Your BMI</span>
              <p className="mt-1 text-4xl sm:text-5xl font-heading font-extrabold text-foreground tabular-nums">
                {result.bmi.toFixed(1)}
              </p>
            </div>

            {result.bmi > 0 && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${categoryColorMap[result.category]}`}>
                Category: {result.category}
              </div>
            )}
          </div>

          <div className="border-t border-border pt-4 mt-6">
            <span className="text-xs text-muted block mb-1">Healthy Weight Range for your height:</span>
            <p className="text-base font-bold text-foreground tabular-nums">
              {result.healthyRange}
            </p>
          </div>

          {/* Simple category ruler */}
          <div className="mt-6 space-y-1">
            <div className="relative flex h-3 w-full rounded-full overflow-hidden bg-muted">
              <div className="w-[18.5%] bg-amber-500/70" title="Underweight" />
              <div className="w-[6.5%] bg-emerald-500" title="Normal" />
              <div className="w-[5%] bg-orange-500/70" title="Overweight" />
              <div className="w-[70%] bg-red-500/70" title="Obese" />
              {/* Pointer indicator */}
              {result.bmi > 0 && (
                <div
                  style={{ left: `${Math.min(100, (result.bmi / 40) * 100)}%` }}
                  className="absolute top-0 bottom-0 w-1 bg-foreground shadow-md transition-all duration-300"
                />
              )}
            </div>
            <div className="flex justify-between text-[10px] text-muted font-semibold">
              <span>18.5</span>
              <span>25.0</span>
              <span>30.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
