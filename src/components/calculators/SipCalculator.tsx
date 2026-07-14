import React, { useState } from "react";
import { calculateSIP, calculateLumpsum } from "../../lib/calculators/more-calculators";

type Mode = "sip" | "stepup" | "lumpsum";

export default function SipCalculator() {
  const [mode, setMode] = useState<Mode>("sip");
  const [monthlyInvestment, setMonthlyInvestment] = useState(25000);
  const [expectedReturnRate, setExpectedReturnRate] = useState(12);
  const [tenureYears, setTenureYears] = useState(10);
  const [stepUpPercent, setStepUpPercent] = useState(10);
  const [lumpsumAmount, setLumpsumAmount] = useState(1000000);

  const isLumpsum = mode === "lumpsum";
  const isStepUp = mode === "stepup";

  const sipResult = calculateSIP(
    monthlyInvestment,
    expectedReturnRate,
    tenureYears,
    isStepUp ? stepUpPercent : 0
  );

  const lumpsumResult = calculateLumpsum(
    lumpsumAmount,
    expectedReturnRate,
    tenureYears
  );

  const activeResult = isLumpsum ? lumpsumResult : sipResult;

  const totalInvestment = activeResult.totalInvestment;
  const estimatedReturns = activeResult.estimatedReturns;
  const totalValue = activeResult.totalValue;

  const investmentPercent = totalValue > 0 ? (totalInvestment / totalValue) * 100 : 0;
  const returnsPercent = totalValue > 0 ? (estimatedReturns / totalValue) * 100 : 0;

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
          onClick={() => setMode("sip")}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            mode === "sip" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Monthly SIP
        </button>
        <button
          onClick={() => setMode("stepup")}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            mode === "stepup" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Step-up SIP
        </button>
        <button
          onClick={() => setMode("lumpsum")}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            mode === "lumpsum" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Lumpsum (One-Time)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input sliders */}
        <div className="space-y-6">
          {isLumpsum ? (
            /* Lumpsum Amount input */
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="lumpsum-input" className="text-sm font-medium text-foreground">Total Investment (₹)</label>
                <input
                  id="lumpsum-input"
                  type="number"
                  value={lumpsumAmount}
                  onChange={(e) => setLumpsumAmount(Math.max(1000, Number(e.target.value)))}
                  className="w-36 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <input
                type="range"
                min="5000"
                max="50000000"
                step="5000"
                value={lumpsumAmount}
                onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted">
                <span>₹5,000</span>
                <span>₹5 Crore</span>
              </div>
            </div>
          ) : (
            /* Monthly Investment input */
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="sip-input" className="text-sm font-medium text-foreground">Monthly Investment (₹)</label>
                <input
                  id="sip-input"
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Math.max(500, Number(e.target.value)))}
                  className="w-32 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <input
                type="range"
                min="500"
                max="1000000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted">
                <span>₹500</span>
                <span>₹10 Lakh</span>
              </div>
            </div>
          )}

          {/* Expected Return Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="return-input" className="text-sm font-medium text-foreground">Expected Return Rate (% p.a.)</label>
              <input
                id="return-input"
                type="number"
                step="0.5"
                value={expectedReturnRate}
                onChange={(e) => setExpectedReturnRate(Math.max(1, Math.min(30, Number(e.target.value))))}
                className="w-24 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={expectedReturnRate}
              onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Tenure Years */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="tenure-input" className="text-sm font-medium text-foreground">Time Period (Years)</label>
              <input
                id="tenure-input"
                type="number"
                value={tenureYears}
                onChange={(e) => setTenureYears(Math.max(1, Math.min(40, Number(e.target.value))))}
                className="w-24 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>1 Year</span>
              <span>40 Years</span>
            </div>
          </div>

          {/* Annual Step-Up Slider (only shown if step-up mode is active) */}
          {isStepUp && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="step-up-input" className="text-sm font-medium text-foreground">Annual Step-up (% rate)</label>
                <input
                  id="step-up-input"
                  type="number"
                  value={stepUpPercent}
                  onChange={(e) => setStepUpPercent(Math.max(1, Math.min(50, Number(e.target.value))))}
                  className="w-24 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={stepUpPercent}
                onChange={(e) => setStepUpPercent(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted">
                <span>1%</span>
                <span>50%</span>
              </div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">Estimated Future Wealth</span>
              <p className="mt-1 text-3xl sm:text-4xl font-heading font-extrabold text-primary tabular-nums">
                {formatCurrency(totalValue)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <span className="text-xs text-muted">Invested Amount</span>
                <p className="font-semibold text-foreground tabular-nums">{formatCurrency(totalInvestment)}</p>
              </div>
              <div>
                <span className="text-xs text-muted">Est. Wealth Gain</span>
                <p className="font-semibold text-foreground tabular-nums">{formatCurrency(estimatedReturns)}</p>
              </div>
            </div>
          </div>

          {/* Simple distribution bar */}
          <div className="mt-6 space-y-2">
            <div className="flex h-3 w-full rounded-full overflow-hidden bg-muted">
              <div style={{ width: `${investmentPercent}%` }} className="bg-primary" title="Invested Amount" />
              <div style={{ width: `${returnsPercent}%` }} className="bg-accent" title="Wealth Gain" />
            </div>
            <div className="flex justify-between text-xs text-muted font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                Invested: {investmentPercent.toFixed(1)}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent inline-block" />
                Gain: {returnsPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Yearly Projection Schedule */}
      {activeResult.yearlySchedule && activeResult.yearlySchedule.length > 0 && (
        <div className="mt-8 border-t border-border pt-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Yearly Growth Projections</h3>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-secondary/40 font-medium text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">Year</th>
                  <th scope="col" className="px-4 py-3 text-right">Total Invested</th>
                  <th scope="col" className="px-4 py-3 text-right">Wealth Gained</th>
                  <th scope="col" className="px-4 py-3 text-right">Estimated Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card tabular-nums">
                {activeResult.yearlySchedule.map((row) => (
                  <tr key={row.year} className="hover:bg-secondary/20">
                    <td className="px-4 py-3 font-medium text-foreground">Year {row.year}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatCurrency(row.investmentAmount)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatCurrency(row.interestEarned)}</td>
                    <td className="px-4 py-3 text-right text-foreground font-bold">{formatCurrency(row.endingBalance)}</td>
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
