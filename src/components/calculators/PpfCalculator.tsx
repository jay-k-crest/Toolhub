import React, { useState } from "react";
import { calculatePPF } from "../../lib/calculators/finance-calculators";

export default function PpfCalculator() {
  const [annualDeposit, setAnnualDeposit] = useState(150000);
  const [interestRate, setInterestRate] = useState(7.1);
  const [tenureYears, setTenureYears] = useState(15);

  const result = calculatePPF(annualDeposit, interestRate, tenureYears);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalAmount = result.maturityAmount;
  const principalPercent = totalAmount > 0 ? (result.totalInvestment / totalAmount) * 100 : 0;
  const interestPercent = totalAmount > 0 ? (result.totalInterest / totalAmount) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Inputs */}
        <div className="space-y-6">
          {/* Annual Deposit */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="annual-deposit-input" className="text-sm font-medium text-foreground">
                Yearly Investment (₹)
              </label>
              <input
                id="annual-deposit-input"
                type="number"
                value={annualDeposit}
                min={500}
                max={150000}
                onChange={(e) => setAnnualDeposit(Math.min(150000, Math.max(500, Number(e.target.value))))}
                className="w-36 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="500"
              max="150000"
              step="500"
              value={annualDeposit}
              onChange={(e) => setAnnualDeposit(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>₹500</span>
              <span>₹1.5 Lakh (Max Limit)</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="rate-input" className="text-sm font-medium text-foreground">
                Interest Rate (% p.a.)
              </label>
              <input
                id="rate-input"
                type="number"
                step="0.05"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(1, Number(e.target.value)))}
                className="w-24 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="5"
              max="15"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>5%</span>
              <span>15%</span>
            </div>
          </div>

          {/* Tenure */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="tenure-input" className="text-sm font-medium text-foreground">
                Tenure (Years)
              </label>
              <input
                id="tenure-input"
                type="number"
                value={tenureYears}
                min={15}
                max={50}
                onChange={(e) => setTenureYears(Math.max(15, Number(e.target.value)))}
                className="w-24 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="15"
              max="50"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>15 Years (Min)</span>
              <span>50 Years</span>
            </div>
          </div>
        </div>

        {/* Right Results Display */}
        <div className="rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">Maturity Amount</span>
              <p className="mt-1 text-3xl sm:text-4xl font-heading font-extrabold text-primary tabular-nums">
                {formatCurrency(result.maturityAmount)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <span className="text-xs text-muted">Total Investment</span>
                <p className="font-semibold text-foreground tabular-nums">{formatCurrency(result.totalInvestment)}</p>
              </div>
              <div>
                <span className="text-xs text-muted">Total Interest Earned</span>
                <p className="font-semibold text-foreground tabular-nums">{formatCurrency(result.totalInterest)}</p>
              </div>
            </div>
          </div>

          {/* simple distribution bar */}
          <div className="mt-6 space-y-2">
            <div className="flex h-3 w-full rounded-full overflow-hidden bg-muted">
              <div style={{ width: `${principalPercent}%` }} className="bg-primary" title="Invested Amount" />
              <div style={{ width: `${interestPercent}%` }} className="bg-accent" title="Interest Earned" />
            </div>
            <div className="flex justify-between text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                Invested: {principalPercent.toFixed(1)}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent inline-block" />
                Interest: {interestPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Yearly schedule breakdown */}
      {result.schedule.length > 0 && (
        <div className="mt-8 border-t border-border pt-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Yearly Growth Schedule</h3>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-secondary/40 font-medium text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">Year</th>
                  <th scope="col" className="px-4 py-3 text-right">Opening Balance</th>
                  <th scope="col" className="px-4 py-3 text-right">Annual Deposit</th>
                  <th scope="col" className="px-4 py-3 text-right">Interest Earned</th>
                  <th scope="col" className="px-4 py-3 text-right">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card tabular-nums">
                {result.schedule.map((row) => (
                  <tr key={row.year} className="hover:bg-secondary/20">
                    <td className="px-4 py-3 font-medium text-foreground">{row.year}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatCurrency(row.openingBalance)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatCurrency(row.deposit)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatCurrency(row.interestEarned)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatCurrency(row.closingBalance)}</td>
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
