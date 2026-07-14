import React, { useState } from "react";
import { calculateGratuity } from "../../lib/calculators/finance-calculators";

export default function GratuityCalculator() {
  const [salary, setSalary] = useState(75000);
  const [years, setYears] = useState(8);
  const [isCovered, setIsCovered] = useState(true);

  const result = calculateGratuity(salary, years, isCovered);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Gratuity Act coverage toggle */}
      <div className="flex rounded-lg bg-secondary p-1 w-full sm:w-fit">
        <button
          onClick={() => setIsCovered(true)}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            isCovered ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Covered under Payment of Gratuity Act
        </button>
        <button
          onClick={() => setIsCovered(false)}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            !isCovered ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Not Covered under Gratuity Act
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Inputs */}
        <div className="space-y-6">
          {/* Monthly Salary */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="salary-input" className="text-sm font-medium text-foreground">
                Last Drawn Monthly Salary (Basic + DA) (₹)
              </label>
              <input
                id="salary-input"
                type="number"
                value={salary}
                onChange={(e) => setSalary(Math.max(1000, Number(e.target.value)))}
                className="w-32 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="5000"
              max="1000000"
              step="5000"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>₹5,000</span>
              <span>₹10 Lakh</span>
            </div>
          </div>

          {/* Years of Service */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="years-input" className="text-sm font-medium text-foreground">
                Years of Continuous Service
              </label>
              <input
                id="years-input"
                type="number"
                value={years}
                onChange={(e) => setYears(Math.max(0, Number(e.target.value)))}
                className="w-24 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>1 Year</span>
              <span>50 Years</span>
            </div>
          </div>
        </div>

        {/* Right Results Display */}
        <div className="rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">Estimated Gratuity Payable</span>
              {result.isEligible ? (
                <p className="mt-1 text-3xl sm:text-4xl font-heading font-extrabold text-accent tabular-nums">
                  {formatCurrency(result.gratuityAmount)}
                </p>
              ) : (
                <div>
                  <p className="mt-1 text-xl font-heading font-bold text-destructive">Not Eligible (₹0)</p>
                  <p className="text-xs text-muted mt-2">
                    An employee is typically eligible for gratuity only after completing **5 years** of continuous service with the same employer.
                  </p>
                </div>
              )}
            </div>

            {/* Calculations logic breakdown for SEO transparency */}
            {result.isEligible && (
              <div className="border-t border-border pt-4 space-y-2 text-xs text-muted">
                <p className="font-semibold text-foreground">Gratuity Calculation Formula:</p>
                <p className="leading-relaxed">
                  Formula: `(15 × Last Drawn Salary × Tenure) / Factor`
                </p>
                <div className="flex justify-between">
                  <span>Last Drawn Salary:</span>
                  <span className="font-semibold text-foreground tabular-nums">{formatCurrency(salary)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tenure (Years of Service):</span>
                  <span className="font-semibold text-foreground tabular-nums">{years} Years</span>
                </div>
                <div className="flex justify-between">
                  <span>Calculation Factor:</span>
                  <span className="font-semibold text-foreground">{isCovered ? "26 (Covered)" : "30 (Not Covered)"}</span>
                </div>
                <p className="text-[10px] italic mt-2">
                  *Under the Gratuity Act, a month is calculated as 26 working days. For non-covered employees, it is standard 30 days.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
