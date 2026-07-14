import React, { useState } from "react";
import { calculateIncomeTax } from "../../lib/calculators/finance-calculators";

export default function IncomeTaxCalculator() {
  const [grossIncome, setGrossIncome] = useState(1200000);
  const [deductions80C, setDeductions80C] = useState(150000);
  const [hraExempt, setHraExempt] = useState(50000);
  const [otherDeductions, setOtherDeductions] = useState(50000);

  const newRegime = calculateIncomeTax(grossIncome, "new", deductions80C, hraExempt, otherDeductions);
  const oldRegime = calculateIncomeTax(grossIncome, "old", deductions80C, hraExempt, otherDeductions);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const betterRegime = newRegime.totalTax < oldRegime.totalTax ? "New Regime" : "Old Regime";
  const taxDifference = Math.abs(newRegime.totalTax - oldRegime.totalTax);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Inputs (2 cols equivalent if we use grid-cols-3, else let's use 1 col for inputs, 2 for outputs) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Gross Annual Income */}
          <div className="space-y-2">
            <label htmlFor="gross-income-input" className="text-sm font-medium text-foreground block">
              Gross Annual Income (₹)
            </label>
            <input
              id="gross-income-input"
              type="number"
              value={grossIncome}
              onChange={(e) => setGrossIncome(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <input
              type="range"
              min="100000"
              max="5000000"
              step="25000"
              value={grossIncome}
              onChange={(e) => setGrossIncome(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted">
              <span>₹1 Lakh</span>
              <span>₹50 Lakh</span>
            </div>
          </div>

          {/* Deductions (only apply to Old Regime) */}
          <div className="rounded-lg border border-border p-4 bg-secondary/10 space-y-4">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
              Old Regime Deductions
            </h4>
            
            {/* Section 80C */}
            <div className="space-y-1">
              <label htmlFor="deductions-80c-input" className="text-xs text-muted">Section 80C (PPF, EPF, ELSS, etc.) (₹)</label>
              <input
                id="deductions-80c-input"
                type="number"
                value={deductions80C}
                max={150000}
                onChange={(e) => setDeductions80C(Math.min(150000, Math.max(0, Number(e.target.value))))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-[10px] text-muted block">Max limit ₹1.5 Lakh</span>
            </div>

            {/* HRA Exemption */}
            <div className="space-y-1">
              <label htmlFor="hra-exempt-input" className="text-xs text-muted">HRA Exemption (₹)</label>
              <input
                id="hra-exempt-input"
                type="number"
                value={hraExempt}
                onChange={(e) => setHraExempt(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Other Deductions */}
            <div className="space-y-1">
              <label htmlFor="other-deductions-input" className="text-xs text-muted">Other Deductions (80D, Section 24b, etc.) (₹)</label>
              <input
                id="other-deductions-input"
                type="number"
                value={otherDeductions}
                onChange={(e) => setOtherDeductions(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Right Output: Side-by-Side Comparison */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-base font-semibold text-foreground mb-4 text-center">
              Regime Comparison
            </h3>

            {taxDifference > 0 ? (
              <div className="mb-6 p-4 rounded-lg bg-accent/10 border border-accent/20 text-center">
                <p className="text-sm font-semibold text-foreground">
                  🎉 You save <span className="text-accent font-extrabold">{formatCurrency(taxDifference)}</span> under the <span className="font-extrabold">{betterRegime}</span>!
                </p>
              </div>
            ) : (
              <div className="mb-6 p-4 rounded-lg bg-secondary/40 text-center">
                <p className="text-sm font-semibold text-foreground">
                  Your tax is the same under both regimes (₹0).
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* New Tax Regime Card */}
              <div className={`p-4 rounded-xl border transition-all ${
                betterRegime === "New Regime" || taxDifference === 0
                  ? "border-accent/40 bg-accent/5 ring-1 ring-accent/30"
                  : "border-border bg-secondary/10"
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-foreground">New Tax Regime</h4>
                  {betterRegime === "New Regime" && taxDifference > 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/20 px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-xs text-muted">
                  <div className="flex justify-between">
                    <span>Gross Income:</span>
                    <span className="font-semibold text-foreground tabular-nums">{formatCurrency(grossIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standard Deduction:</span>
                    <span className="font-semibold text-foreground tabular-nums">-{formatCurrency(newRegime.standardDeduction)}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-1">
                    <span>Taxable Income:</span>
                    <span className="font-semibold text-foreground tabular-nums">{formatCurrency(newRegime.taxableIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax before Rebate:</span>
                    <span className="font-semibold text-foreground tabular-nums">{formatCurrency(newRegime.baseTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rebate (Section 87A):</span>
                    <span className="font-semibold text-foreground tabular-nums">-{formatCurrency(newRegime.rebate87A)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Health & Education Cess (4%):</span>
                    <span className="font-semibold text-foreground tabular-nums">{formatCurrency(newRegime.cess)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 text-sm text-foreground">
                    <span className="font-bold">Total Tax:</span>
                    <span className={`font-extrabold tabular-nums ${betterRegime === "New Regime" && taxDifference > 0 ? "text-accent text-lg" : ""}`}>
                      {formatCurrency(newRegime.totalTax)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Old Tax Regime Card */}
              <div className={`p-4 rounded-xl border transition-all ${
                betterRegime === "Old Regime"
                  ? "border-accent/40 bg-accent/5 ring-1 ring-accent/30"
                  : "border-border bg-secondary/10"
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-foreground">Old Tax Regime</h4>
                  {betterRegime === "Old Regime" && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/20 px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-xs text-muted">
                  <div className="flex justify-between">
                    <span>Gross Income:</span>
                    <span className="font-semibold text-foreground tabular-nums">{formatCurrency(grossIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Deductions:</span>
                    <span className="font-semibold text-foreground tabular-nums">-{formatCurrency(oldRegime.totalDeductions)}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-1">
                    <span>Taxable Income:</span>
                    <span className="font-semibold text-foreground tabular-nums">{formatCurrency(oldRegime.taxableIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax before Rebate:</span>
                    <span className="font-semibold text-foreground tabular-nums">{formatCurrency(oldRegime.baseTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rebate (Section 87A):</span>
                    <span className="font-semibold text-foreground tabular-nums">-{formatCurrency(oldRegime.rebate87A)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Health & Education Cess (4%):</span>
                    <span className="font-semibold text-foreground tabular-nums">{formatCurrency(oldRegime.cess)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 text-sm text-foreground">
                    <span className="font-bold">Total Tax:</span>
                    <span className={`font-extrabold tabular-nums ${betterRegime === "Old Regime" ? "text-accent text-lg" : ""}`}>
                      {formatCurrency(oldRegime.totalTax)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slabs breakdown details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border pt-6 mt-8">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">New Regime Slab Breakdown</h4>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border text-xs">
              <thead className="bg-secondary/40 font-medium text-muted">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left">Income Bracket</th>
                  <th scope="col" className="px-3 py-2 text-center">Tax Rate</th>
                  <th scope="col" className="px-3 py-2 text-right">Tax Charged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card tabular-nums">
                {newRegime.slabs.map((row, idx) => (
                  <tr key={idx} className="hover:bg-secondary/20">
                    <td className="px-3 py-2 text-foreground">{row.slab}</td>
                    <td className="px-3 py-2 text-center text-foreground">{row.rate}%</td>
                    <td className="px-3 py-2 text-right text-foreground">{formatCurrency(row.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Old Regime Slab Breakdown</h4>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border text-xs">
              <thead className="bg-secondary/40 font-medium text-muted">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left">Income Bracket</th>
                  <th scope="col" className="px-3 py-2 text-center">Tax Rate</th>
                  <th scope="col" className="px-3 py-2 text-right">Tax Charged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card tabular-nums">
                {oldRegime.slabs.map((row, idx) => (
                  <tr key={idx} className="hover:bg-secondary/20">
                    <td className="px-3 py-2 text-foreground">{row.slab}</td>
                    <td className="px-3 py-2 text-center text-foreground">{row.rate}%</td>
                    <td className="px-3 py-2 text-right text-foreground">{formatCurrency(row.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
