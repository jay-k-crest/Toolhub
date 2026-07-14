import React, { useState } from "react";
import { calculateFD, calculateRD, calculateInflation } from "../../lib/calculators/more-calculators";

type Mode = "fd" | "rd" | "compound" | "simple";

export default function DepositCalculator() {
  const [mode, setMode] = useState<Mode>("fd");
  
  // States
  const [principal, setPrincipal] = useState(100000);
  const [interestRate, setInterestRate] = useState(7.1);
  const [tenureYears, setTenureYears] = useState(5);
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [tenureMonths, setTenureMonths] = useState(36);
  const [frequency, setFrequency] = useState(4); // 4 = Quarterly, 12 = Monthly, 1 = Annually

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  let totalInvestment = 0;
  let interestEarned = 0;
  let totalValue = 0;
  let schedule: Array<{ period: string; investment: number; interest: number; balance: number }> = [];

  if (mode === "fd") {
    const res = calculateFD(principal, interestRate, tenureYears, frequency);
    totalInvestment = res.principal;
    interestEarned = res.interestEarned;
    totalValue = res.totalValue;
    schedule = res.schedule.map(s => ({
      period: `Year ${s.year}`,
      investment: principal,
      interest: s.interestEarned,
      balance: s.endingBalance,
    }));
  } else if (mode === "rd") {
    const res = calculateRD(monthlyInvestment, interestRate, tenureMonths);
    totalInvestment = res.totalInvestment;
    interestEarned = res.interestEarned;
    totalValue = res.totalValue;
    schedule = res.schedule.map(s => ({
      period: `Month ${s.month}`,
      investment: s.investmentAmount,
      interest: s.interestEarned,
      balance: s.endingBalance,
    }));
  } else if (mode === "compound") {
    // Compound interest standard:
    // A = P(1 + r/n)^nt
    const res = calculateFD(principal, interestRate, tenureYears, frequency);
    totalInvestment = res.principal;
    interestEarned = res.interestEarned;
    totalValue = res.totalValue;
    schedule = res.schedule.map(s => ({
      period: `Year ${s.year}`,
      investment: principal,
      interest: s.interestEarned,
      balance: s.endingBalance,
    }));
  } else if (mode === "simple") {
    // Simple Interest: SI = P * R * T / 100
    const SI = (principal * interestRate * tenureYears) / 100;
    totalInvestment = principal;
    interestEarned = Math.round(SI);
    totalValue = Math.round(principal + SI);
    
    // Create schedule
    for (let year = 1; year <= tenureYears; year++) {
      const yearSI = (principal * interestRate * year) / 100;
      schedule.push({
        period: `Year ${year}`,
        investment: principal,
        interest: Math.round(yearSI),
        balance: Math.round(principal + yearSI),
      });
    }
  }

  const investmentPercent = totalValue > 0 ? (totalInvestment / totalValue) * 100 : 0;
  const returnsPercent = totalValue > 0 ? (interestEarned / totalValue) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Deposit Mode selector tabs */}
      <div className="flex flex-wrap rounded-lg bg-secondary p-1 gap-1 w-full sm:w-fit">
        <button
          onClick={() => setMode("fd")}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            mode === "fd" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Fixed Deposit (FD)
        </button>
        <button
          onClick={() => setMode("rd")}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            mode === "rd" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Recurring Deposit (RD)
        </button>
        <button
          onClick={() => setMode("compound")}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            mode === "compound" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Compound Interest
        </button>
        <button
          onClick={() => setMode("simple")}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            mode === "simple" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Simple Interest
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Inputs */}
        <div className="space-y-6">
          {mode === "rd" ? (
            /* RD monthly amount */
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="rd-investment" className="text-sm font-medium text-foreground">Monthly Deposit (₹)</label>
                <input
                  id="rd-investment"
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Math.max(500, Number(e.target.value)))}
                  className="w-32 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <input
                type="range"
                min="500"
                max="500000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted">
                <span>₹500</span>
                <span>₹5 Lakh</span>
              </div>
            </div>
          ) : (
            /* Principal amount */
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="principal-amount" className="text-sm font-medium text-foreground">Principal Amount (₹)</label>
                <input
                  id="principal-amount"
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Math.max(1000, Number(e.target.value)))}
                  className="w-36 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <input
                type="range"
                min="5000"
                max="10000000"
                step="5000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted">
                <span>₹5,000</span>
                <span>₹1 Crore</span>
              </div>
            </div>
          )}

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="rate-input" className="text-sm font-medium text-foreground">Rate of Interest (% p.a.)</label>
              <input
                id="rate-input"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(1, Math.min(25, Number(e.target.value))))}
                className="w-24 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>1%</span>
              <span>25%</span>
            </div>
          </div>

          {/* Tenure */}
          {mode === "rd" ? (
            /* RD Months tenure */
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="tenure-months" className="text-sm font-medium text-foreground">Time Period (Months)</label>
                <input
                  id="tenure-months"
                  type="number"
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Math.max(3, Math.min(120, Number(e.target.value))))}
                  className="w-24 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <input
                type="range"
                min="3"
                max="120"
                step="3"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted">
                <span>3 Months</span>
                <span>120 Months (10 Years)</span>
              </div>
            </div>
          ) : (
            /* FD/Compound/Simple Years tenure */
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="tenure-years" className="text-sm font-medium text-foreground">Time Period (Years)</label>
                <input
                  id="tenure-years"
                  type="number"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Math.max(1, Math.min(25, Number(e.target.value))))}
                  className="w-24 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted">
                <span>1 Year</span>
                <span>25 Years</span>
              </div>
            </div>
          )}

          {/* Compounding Frequency dropdown (only for FD and Compound) */}
          {(mode === "fd" || mode === "compound") && (
            <div className="space-y-2">
              <label htmlFor="compounding-freq" className="text-sm font-medium text-foreground">Compounding Interval</label>
              <select
                id="compounding-freq"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value={12}>Monthly (12 times/year)</option>
                <option value={4}>Quarterly (4 times/year - Bank Standard)</option>
                <option value={2}>Half-Yearly (2 times/year)</option>
                <option value={1}>Yearly (1 time/year)</option>
              </select>
            </div>
          )}
        </div>

        {/* Right Results Display */}
        <div className="rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">Maturity Value</span>
              <p className="mt-1 text-3xl sm:text-4xl font-heading font-extrabold text-primary tabular-nums">
                {formatCurrency(totalValue)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <span className="text-xs text-muted">Invested Principal</span>
                <p className="font-semibold text-foreground tabular-nums">{formatCurrency(totalInvestment)}</p>
              </div>
              <div>
                <span className="text-xs text-muted">Interest Earned</span>
                <p className="font-semibold text-foreground tabular-nums">{formatCurrency(interestEarned)}</p>
              </div>
            </div>
          </div>

          {/* Distribution bar */}
          <div className="mt-6 space-y-2">
            <div className="flex h-3 w-full rounded-full overflow-hidden bg-muted">
              <div style={{ width: `${investmentPercent}%` }} className="bg-primary" title="Principal Amount" />
              <div style={{ width: `${returnsPercent}%` }} className="bg-accent" title="Interest Earned" />
            </div>
            <div className="flex justify-between text-xs text-muted font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                Principal: {investmentPercent.toFixed(1)}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent inline-block" />
                Interest: {returnsPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Projection schedule table */}
      {schedule.length > 0 && (
        <div className="mt-8 border-t border-border pt-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Maturity Progress Schedule</h3>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-secondary/40 font-medium text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">Period</th>
                  <th scope="col" className="px-4 py-3 text-right">Invested</th>
                  <th scope="col" className="px-4 py-3 text-right">Accrued Interest</th>
                  <th scope="col" className="px-4 py-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card tabular-nums">
                {schedule.map((row, idx) => (
                  <tr key={idx} className="hover:bg-secondary/20">
                    <td className="px-4 py-3 font-medium text-foreground">{row.period}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatCurrency(row.investment)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatCurrency(row.interest)}</td>
                    <td className="px-4 py-3 text-right text-foreground font-bold">{formatCurrency(row.balance)}</td>
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
