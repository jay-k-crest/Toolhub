import React, { useState } from "react";
import { calculateCreditCardPayoff } from "../../lib/calculators/finance-calculators";

export default function CreditCardInterestCalculator() {
  const [balance, setBalance] = useState(100000);
  const [annualRate, setAnnualRate] = useState(42); // 42% standard credit card APR (3.5% monthly)
  const [monthlyPayment, setMonthlyPayment] = useState(5000);
  const [monthlySpending, setMonthlySpending] = useState(0);

  const result = calculateCreditCardPayoff(balance, annualRate, monthlyPayment, monthlySpending);

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
          {/* Outstanding Balance */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="balance-input" className="text-sm font-medium text-foreground">
                Outstanding Balance (₹)
              </label>
              <input
                id="balance-input"
                type="number"
                value={balance}
                onChange={(e) => setBalance(Math.max(0, Number(e.target.value)))}
                className="w-32 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="5000"
              max="1000000"
              step="5000"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>₹5,000</span>
              <span>₹10 Lakh</span>
            </div>
          </div>

          {/* Monthly Payment */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="payment-input" className="text-sm font-medium text-foreground">
                Monthly Payment Amount (₹)
              </label>
              <input
                id="payment-input"
                type="number"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(Math.max(0, Number(e.target.value)))}
                className="w-32 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="500"
              max="100000"
              step="500"
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>₹500</span>
              <span>₹1 Lakh</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Interest Rate (APR) */}
            <div className="space-y-1">
              <label htmlFor="rate-input" className="text-xs font-semibold text-muted uppercase">Annual Interest Rate (APR %)</label>
              <input
                id="rate-input"
                type="number"
                value={annualRate}
                onChange={(e) => setAnnualRate(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            {/* New Monthly Spending */}
            <div className="space-y-1">
              <label htmlFor="spending-input" className="text-xs font-semibold text-muted uppercase">New Monthly Spending (₹)</label>
              <input
                id="spending-input"
                type="number"
                value={monthlySpending}
                onChange={(e) => setMonthlySpending(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Right Results Display */}
        <div className="rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">Time to Pay Off</span>
              {result.monthsToPayoff === -1 ? (
                <div>
                  <p className="mt-1 text-2xl font-heading font-bold text-destructive">Never (Balance is growing)</p>
                  <p className="text-xs text-muted mt-2 leading-relaxed">
                    Your monthly payment is too low. It does not cover the accumulated monthly interest and new spending. Increase your payment or reduce spending.
                  </p>
                </div>
              ) : (
                <p className="mt-1 text-3xl sm:text-4xl font-heading font-extrabold text-primary tabular-nums">
                  {result.monthsToPayoff} Months
                </p>
              )}
            </div>

            {result.monthsToPayoff !== -1 && (
              <>
                <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm text-foreground">
                  <div>
                    <span className="text-xs text-muted block">Total Interest Paid</span>
                    <span className="font-semibold text-destructive tabular-nums">{formatCurrency(result.totalInterest)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted block">Total Amount Paid</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(result.totalPayment)}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 text-[10px] text-muted leading-relaxed">
                  <p className="font-semibold text-foreground">Interest Warning:</p>
                  <p>
                    Credit card debt compounds monthly at extremely high rates (typically 36%-45% p.a.). Paying only the minimum amount causes debt to accumulate rapidly.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
