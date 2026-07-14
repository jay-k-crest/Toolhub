import React, { useState } from "react";
import { calculateLoanEligibility } from "../../lib/calculators/finance-calculators";

export default function LoanEligibilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(80000);
  const [existingEmi, setExistingEmi] = useState(10000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [foirPercent, setFoirPercent] = useState(50); // Fixed Obligation to Income Ratio

  const result = calculateLoanEligibility(
    monthlyIncome,
    existingEmi,
    interestRate,
    tenureYears,
    foirPercent
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Inputs */}
        <div className="space-y-6">
          {/* Monthly Income */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="income-input" className="text-sm font-medium text-foreground">
                Net Monthly Income (₹)
              </label>
              <input
                id="income-input"
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value)))}
                className="w-32 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>₹10,000</span>
              <span>₹5 Lakh</span>
            </div>
          </div>

          {/* Existing EMIs */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="existing-emi-input" className="text-sm font-medium text-foreground">
                Existing Monthly EMIs (₹)
              </label>
              <input
                id="existing-emi-input"
                type="number"
                value={existingEmi}
                onChange={(e) => setExistingEmi(Math.max(0, Number(e.target.value)))}
                className="w-32 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="0"
              max="200000"
              step="1000"
              value={existingEmi}
              onChange={(e) => setExistingEmi(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>₹0</span>
              <span>₹2 Lakh</span>
            </div>
          </div>

          {/* Interest Rate & Tenure */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="rate-input" className="text-xs font-semibold text-muted uppercase">Interest Rate (% p.a.)</label>
              <input
                id="rate-input"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tenure-input" className="text-xs font-semibold text-muted uppercase">Tenure (Years)</label>
              <input
                id="tenure-input"
                type="number"
                value={tenureYears}
                onChange={(e) => setTenureYears(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          {/* FOIR Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="foir-input" className="text-sm font-medium text-foreground">
                FOIR (Fixed Obligation to Income Ratio: {foirPercent}%)
              </label>
            </div>
            <input
              type="range"
              min="30"
              max="70"
              step="5"
              value={foirPercent}
              onChange={(e) => setFoirPercent(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-[10px] text-muted leading-relaxed block">
              *FOIR is the percentage of income that banks assume can go towards loan payments (standard is 50%).
            </span>
          </div>
        </div>

        {/* Right Results Display */}
        <div className="rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">Eligible Loan Amount</span>
              <p className="mt-1 text-3xl sm:text-4xl font-heading font-extrabold text-primary tabular-nums">
                {formatCurrency(result.eligibleLoanAmount)}
              </p>
            </div>

            <div className="border-t border-border pt-4 text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">Maximum Allowed Monthly EMI</span>
              <p className="mt-1 text-2xl font-heading font-bold text-foreground tabular-nums">
                {formatCurrency(result.maxEmiAllowed)}
              </p>
            </div>

            <div className="border-t border-border pt-4 text-xs text-muted space-y-1">
              <p className="font-semibold text-foreground">Eligibility Breakdown:</p>
              <div className="flex justify-between">
                <span>Monthly Income (after FOIR):</span>
                <span className="font-semibold text-foreground tabular-nums">{formatCurrency(monthlyIncome * (foirPercent / 100))}</span>
              </div>
              <div className="flex justify-between">
                <span>Minus Existing EMIs:</span>
                <span className="font-semibold text-foreground tabular-nums">-{formatCurrency(existingEmi)}</span>
              </div>
              <div className="flex justify-between border-t border-border/60 pt-1">
                <span>Disposable EMI budget:</span>
                <span className="font-semibold text-foreground tabular-nums">{formatCurrency(result.maxEmiAllowed)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
