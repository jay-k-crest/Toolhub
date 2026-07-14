import React, { useState, useEffect } from "react";
import { calculateEMI } from "../../lib/calculators/emi-calculator";

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState(2500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const result = calculateEMI(principal, interestRate, tenureYears);

  // Interest vs Principal percentage
  const totalAmount = result.totalPayment;
  const principalPercent = totalAmount > 0 ? (principal / totalAmount) * 100 : 0;
  const interestPercent = totalAmount > 0 ? (result.totalInterest / totalAmount) * 100 : 0;

  // Format currency (INR formatting standard or standard USD)
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
        {/* Inputs */}
        <div className="space-y-6">
          {/* Loan Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="principal-input" className="text-sm font-medium text-foreground">Loan Amount (₹)</label>
              <input
                id="principal-input"
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-36 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="100000"
              max="20000000"
              step="50000"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>₹1 Lakh</span>
              <span>₹2 Crore</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="interest-input" className="text-sm font-medium text-foreground">Interest Rate (% p.a.)</label>
              <input
                id="interest-input"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-24 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>1%</span>
              <span>20%</span>
            </div>
          </div>

          {/* Tenure */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="tenure-input" className="text-sm font-medium text-foreground">Loan Tenure (Years)</label>
              <input
                id="tenure-input"
                type="number"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-24 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>1 Year</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Results display */}
        <div className="rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">Monthly EMI</span>
              <p className="mt-1 text-3xl sm:text-4xl font-heading font-extrabold text-primary tabular-nums">
                {formatCurrency(result.emi)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <span className="text-xs text-muted">Principal Amount</span>
                <p className="font-semibold text-foreground tabular-nums">{formatCurrency(principal)}</p>
              </div>
              <div>
                <span className="text-xs text-muted">Total Interest</span>
                <p className="font-semibold text-foreground tabular-nums">{formatCurrency(result.totalInterest)}</p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <span className="text-xs text-muted font-medium">Total Amount Payable</span>
              <p className="text-lg font-bold text-foreground tabular-nums">{formatCurrency(result.totalPayment)}</p>
            </div>
          </div>

          {/* Simple distribution bar */}
          <div className="mt-6 space-y-2">
            <div className="flex h-3 w-full rounded-full overflow-hidden bg-muted">
              <div style={{ width: `${principalPercent}%` }} className="bg-primary" title="Principal" />
              <div style={{ width: `${interestPercent}%` }} className="bg-accent" title="Interest" />
            </div>
            <div className="flex justify-between text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                Principal: {principalPercent.toFixed(1)}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent inline-block" />
                Interest: {interestPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Collapsible Schedule preview */}
      {result.amortizationSchedule.length > 0 && (
        <div className="mt-8 border-t border-border pt-6">
          <h3 className="text-base font-semibold text-foreground mb-4">First 12 Months Amortization Schedule</h3>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-secondary/40 font-medium text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">Month</th>
                  <th scope="col" className="px-4 py-3 text-right">Principal Paid</th>
                  <th scope="col" className="px-4 py-3 text-right">Interest Paid</th>
                  <th scope="col" className="px-4 py-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card tabular-nums">
                {result.amortizationSchedule.slice(0, 12).map((row) => (
                  <tr key={row.month} className="hover:bg-secondary/20">
                    <td className="px-4 py-3 font-medium text-foreground">{row.month}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatCurrency(row.principalPaid)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatCurrency(row.interestPaid)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{formatCurrency(row.remainingPrincipal)}</td>
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
