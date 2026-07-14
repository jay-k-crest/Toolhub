import React, { useState } from "react";
import { calculateLoanPrepayment } from "../../lib/calculators/finance-calculators";

export default function LoanPrepaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [monthsPaid, setMonthsPaid] = useState(36);
  const [prepaymentAmount, setPrepaymentAmount] = useState(500000);
  const [isReduceEmi, setIsReduceEmi] = useState(false);

  const result = calculateLoanPrepayment(
    loanAmount,
    interestRate,
    tenureYears,
    monthsPaid,
    prepaymentAmount,
    isReduceEmi
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
      {/* Option selector tabs */}
      <div className="flex rounded-lg bg-secondary p-1 w-full sm:w-fit">
        <button
          onClick={() => setIsReduceEmi(false)}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            !isReduceEmi ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Reduce Tenure (Keep EMI Same)
        </button>
        <button
          onClick={() => setIsReduceEmi(true)}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            isReduceEmi ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Reduce EMI (Keep Tenure Same)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Inputs */}
        <div className="space-y-6">
          {/* Loan Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="loan-amount-input" className="text-sm font-medium text-foreground">
                Original Loan Amount (₹)
              </label>
              <input
                id="loan-amount-input"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Math.max(100000, Number(e.target.value)))}
                className="w-36 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="100000"
              max="20000000"
              step="100000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Interest Rate */}
            <div className="space-y-2">
              <label htmlFor="rate-input" className="text-xs font-semibold text-muted uppercase">Interest Rate (%)</label>
              <input
                id="rate-input"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            {/* Original Tenure */}
            <div className="space-y-2">
              <label htmlFor="tenure-input" className="text-xs font-semibold text-muted uppercase">Original Tenure (Yrs)</label>
              <input
                id="tenure-input"
                type="number"
                value={tenureYears}
                onChange={(e) => setTenureYears(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          {/* EMIs Paid so far */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="months-paid-input" className="text-sm font-medium text-foreground">
                EMIs Paid (Months)
              </label>
              <input
                id="months-paid-input"
                type="number"
                value={monthsPaid}
                onChange={(e) => setMonthsPaid(Math.min(tenureYears * 12 - 1, Math.max(0, Number(e.target.value))))}
                className="w-24 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="0"
              max={tenureYears * 12 - 1}
              step="1"
              value={monthsPaid}
              onChange={(e) => setMonthsPaid(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Prepayment Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="prepayment-input" className="text-sm font-medium text-foreground">
                Prepayment Amount (₹)
              </label>
              <input
                id="prepayment-input"
                type="number"
                value={prepaymentAmount}
                onChange={(e) => setPrepaymentAmount(Math.max(0, Number(e.target.value)))}
                className="w-36 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="10000"
              max="5000000"
              step="10000"
              value={prepaymentAmount}
              onChange={(e) => setPrepaymentAmount(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>

        {/* Right Results Display */}
        <div className="rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">Total Interest Saved</span>
              <p className="mt-1 text-3xl sm:text-4xl font-heading font-extrabold text-accent tabular-nums">
                {formatCurrency(result.interestSaved)}
              </p>
            </div>

            {!isReduceEmi ? (
              <div className="border-t border-border pt-4 text-center md:text-left">
                <span className="text-xs font-semibold tracking-wider text-muted uppercase">Tenure Saved</span>
                <p className="mt-1 text-2xl font-heading font-bold text-foreground tabular-nums">
                  {result.monthsSaved} Months (~{(result.monthsSaved / 12).toFixed(1)} Years)
                </p>
              </div>
            ) : (
              <div className="border-t border-border pt-4 text-center md:text-left">
                <span className="text-xs font-semibold tracking-wider text-muted uppercase">Revised Monthly EMI</span>
                <p className="mt-1 text-2xl font-heading font-bold text-primary tabular-nums">
                  {formatCurrency(result.revisedEmi)}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs text-muted">
              <div>
                <span>Original Total Cost:</span>
                <p className="font-semibold text-foreground tabular-nums">{formatCurrency(result.originalTotalPayment)}</p>
              </div>
              <div>
                <span>Revised Total Cost:</span>
                <p className="font-semibold text-foreground tabular-nums">{formatCurrency(result.newTotalPayment)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
