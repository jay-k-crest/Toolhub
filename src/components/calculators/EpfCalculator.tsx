import React, { useState } from "react";
import { calculateEPF } from "../../lib/calculators/finance-calculators";

export default function EpfCalculator() {
  const [monthlyBasic, setMonthlyBasic] = useState(30000);
  const [employeeRate, setEmployeeRate] = useState(12);
  const [employerRate, setEmployerRate] = useState(12);
  const [incrementRate, setIncrementRate] = useState(5);
  const [interestRate, setInterestRate] = useState(8.15);
  const [tenureYears, setTenureYears] = useState(30);

  const result = calculateEPF(
    monthlyBasic,
    employeeRate,
    employerRate,
    incrementRate,
    interestRate,
    tenureYears
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalContributions = result.employeeContribution + result.employerContribution;
  const employeePercent = totalContributions > 0 ? (result.employeeContribution / totalContributions) * 100 : 0;
  const employerPercent = totalContributions > 0 ? (result.employerContribution / totalContributions) * 100 : 0;

  const totalAccumulated = result.maturityAmount;
  const contribPercentOfTotal = totalAccumulated > 0 ? (totalContributions / totalAccumulated) * 100 : 0;
  const interestPercentOfTotal = totalAccumulated > 0 ? (result.totalInterest / totalAccumulated) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Inputs */}
        <div className="space-y-6">
          {/* Monthly Basic + DA */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="basic-salary-input" className="text-sm font-medium text-foreground">
                Monthly Basic Salary + DA (₹)
              </label>
              <input
                id="basic-salary-input"
                type="number"
                value={monthlyBasic}
                onChange={(e) => setMonthlyBasic(Math.max(1000, Number(e.target.value)))}
                className="w-36 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="5000"
              max="250000"
              step="1000"
              value={monthlyBasic}
              onChange={(e) => setMonthlyBasic(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>₹5,000</span>
              <span>₹2.5 Lakh</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Employee Contribution */}
            <div className="space-y-2">
              <label htmlFor="emp-contrib-input" className="text-xs font-semibold text-muted uppercase">Employee Share (%)</label>
              <input
                id="emp-contrib-input"
                type="number"
                value={employeeRate}
                min={1}
                max={20}
                onChange={(e) => setEmployeeRate(Math.min(20, Math.max(1, Number(e.target.value))))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            {/* Employer Contribution */}
            <div className="space-y-2">
              <label htmlFor="employer-contrib-input" className="text-xs font-semibold text-muted uppercase">Employer Share (%)</label>
              <input
                id="employer-contrib-input"
                type="number"
                value={employerRate}
                min={1}
                max={20}
                onChange={(e) => setEmployerRate(Math.min(20, Math.max(1, Number(e.target.value))))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Salary Growth */}
            <div className="space-y-2">
              <label htmlFor="increment-input" className="text-xs font-semibold text-muted uppercase">Annual Hike (%)</label>
              <input
                id="increment-input"
                type="number"
                value={incrementRate}
                onChange={(e) => setIncrementRate(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            {/* Interest Rate */}
            <div className="space-y-2">
              <label htmlFor="interest-input" className="text-xs font-semibold text-muted uppercase">EPF Interest (%)</label>
              <input
                id="interest-input"
                type="number"
                step="0.05"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            {/* Tenure */}
            <div className="space-y-2">
              <label htmlFor="tenure-input" className="text-xs font-semibold text-muted uppercase">Tenure (Years)</label>
              <input
                id="tenure-input"
                type="number"
                value={tenureYears}
                onChange={(e) => setTenureYears(Math.min(50, Math.max(1, Number(e.target.value))))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Right Results Display */}
        <div className="rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">Accumulated EPF Corpus</span>
              <p className="mt-1 text-3xl sm:text-4xl font-heading font-extrabold text-primary tabular-nums">
                {formatCurrency(result.maturityAmount)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm text-foreground">
              <div>
                <span className="text-xs text-muted block">Employee Share</span>
                <span className="font-semibold tabular-nums">{formatCurrency(result.employeeContribution)}</span>
              </div>
              <div>
                <span className="text-xs text-muted block">Employer Share (EPF component)</span>
                <span className="font-semibold tabular-nums">{formatCurrency(result.employerContribution)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm text-foreground">
              <div>
                <span className="text-xs text-muted block">Total Contributions</span>
                <span className="font-bold tabular-nums">{formatCurrency(totalContributions)}</span>
              </div>
              <div>
                <span className="text-xs text-muted block">Total Interest Earned</span>
                <span className="font-bold text-accent tabular-nums">{formatCurrency(result.totalInterest)}</span>
              </div>
            </div>
          </div>

          {/* Simple breakdown bar */}
          <div className="mt-6 space-y-2">
            <div className="flex h-3 w-full rounded-full overflow-hidden bg-muted">
              <div style={{ width: `${contribPercentOfTotal}%` }} className="bg-primary" title="Contributions" />
              <div style={{ width: `${interestPercentOfTotal}%` }} className="bg-accent" title="Interest Earned" />
            </div>
            <div className="flex justify-between text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                Contributions: {contribPercentOfTotal.toFixed(1)}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent inline-block" />
                Interest: {interestPercentOfTotal.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Yearly Growth Table */}
      {result.schedule.length > 0 && (
        <div className="mt-8 border-t border-border pt-6">
          <h3 className="text-base font-semibold text-foreground mb-4">EPF Yearly Growth Schedule</h3>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-secondary/40 font-medium text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">Year</th>
                  <th scope="col" className="px-4 py-3 text-right">Opening Balance</th>
                  <th scope="col" className="px-4 py-3 text-right">Employee Share</th>
                  <th scope="col" className="px-4 py-3 text-right">Employer Share</th>
                  <th scope="col" className="px-4 py-3 text-right">Interest Earned</th>
                  <th scope="col" className="px-4 py-3 text-right">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card tabular-nums">
                {result.schedule.map((row) => (
                  <tr key={row.year} className="hover:bg-secondary/20">
                    <td className="px-4 py-3 font-medium text-foreground">{row.year}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatCurrency(row.openingBalance)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatCurrency(row.employeeContributions)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatCurrency(row.employerContributions)}</td>
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
