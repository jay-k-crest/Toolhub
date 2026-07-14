import React, { useState } from "react";
import { calculateInflation } from "../../lib/calculators/more-calculators";

export default function InflationCalculator() {
  const [amount, setAmount] = useState(100000);
  const [inflationRate, setInflationRate] = useState(6.0);
  const [years, setYears] = useState(10);
  const [isFuture, setIsFuture] = useState(true);

  const result = calculateInflation(amount, inflationRate, years, isFuture);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector Tabs */}
      <div className="flex rounded-lg bg-secondary p-1 w-full sm:w-fit">
        <button
          onClick={() => setIsFuture(true)}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            isFuture ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Future Value (Purchasing Power)
        </button>
        <button
          onClick={() => setIsFuture(false)}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            !isFuture ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Past Value (Historical Value)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Inputs */}
        <div className="space-y-6">
          {/* Amount input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="amount-input" className="text-sm font-medium text-foreground">Current Money Value (₹)</label>
              <input
                id="amount-input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                className="w-32 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="1000"
              max="10000000"
              step="5000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>₹1,000</span>
              <span>₹1 Crore</span>
            </div>
          </div>

          {/* Inflation Rate input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="rate-input" className="text-sm font-medium text-foreground">Inflation Rate (% p.a.)</label>
              <input
                id="rate-input"
                type="number"
                step="0.1"
                value={inflationRate}
                onChange={(e) => setInflationRate(Math.max(0.1, Math.min(25, Number(e.target.value))))}
                className="w-24 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="0.5"
              max="25"
              step="0.1"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>0.5%</span>
              <span>25%</span>
            </div>
          </div>

          {/* Time Period in years */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="years-input" className="text-sm font-medium text-foreground">Time Period (Years)</label>
              <input
                id="years-input"
                type="number"
                value={years}
                onChange={(e) => setYears(Math.max(1, Math.min(40, Number(e.target.value))))}
                className="w-24 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>1 Year</span>
              <span>40 Years</span>
            </div>
          </div>
        </div>

        {/* Right Results Display */}
        <div className="rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">
                {isFuture ? "Future Purchasing Power equivalent" : "Past Purchasing Power equivalent"}
              </span>
              <p className="mt-1 text-3xl sm:text-4xl font-heading font-extrabold text-primary tabular-nums">
                {formatCurrency(result.adjustedValue)}
              </p>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                {isFuture
                  ? `Due to ${inflationRate}% annual inflation, items costing ${formatCurrency(amount)} today will cost ${formatCurrency(result.adjustedValue)} in ${years} years.`
                  : `With ${inflationRate}% annual inflation, a purchasing power of ${formatCurrency(amount)} today was equivalent to ${formatCurrency(result.adjustedValue)} ${years} years ago.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <span className="text-xs text-muted">Initial Value</span>
                <p className="font-semibold text-foreground tabular-nums">{formatCurrency(amount)}</p>
              </div>
              <div>
                <span className="text-xs text-muted">Purchasing Power Difference</span>
                <p className="font-semibold text-foreground tabular-nums">{formatCurrency(result.difference)}</p>
              </div>
            </div>
          </div>

          {/* Graphic slider indicator for decay or appreciation */}
          <div className="mt-6 p-4 rounded-lg bg-card border border-border">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-muted">Today: 100%</span>
              <span className="text-primary font-bold">
                {isFuture 
                  ? `Cost multiplier: x${(result.adjustedValue / amount).toFixed(2)}`
                  : `Value decay: -${((1 - result.adjustedValue / amount) * 100).toFixed(0)}%`}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div
                style={{ 
                  width: `${isFuture 
                    ? Math.min(100, (amount / result.adjustedValue) * 100)
                    : Math.min(100, (result.adjustedValue / amount) * 100)}%` 
                }} 
                className="h-full bg-primary" 
              />
            </div>
            <span className="text-[10px] text-muted block mt-1">Real value of today's amount over time</span>
          </div>
        </div>
      </div>

      {/* Yearly inflation schedule */}
      {result.schedule.length > 0 && (
        <div className="mt-8 border-t border-border pt-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Yearly Price Slices</h3>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-secondary/40 font-medium text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">Year</th>
                  <th scope="col" className="px-4 py-3 text-right">Equivalent Worth</th>
                  <th scope="col" className="px-4 py-3 text-right">Difference Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card tabular-nums">
                {result.schedule.map((row) => (
                  <tr key={row.year} className="hover:bg-secondary/20">
                    <td className="px-4 py-3 font-medium text-foreground">Year {row.year}</td>
                    <td className="px-4 py-3 text-right text-foreground font-semibold">{formatCurrency(row.value)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatCurrency(Math.abs(row.value - amount))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
