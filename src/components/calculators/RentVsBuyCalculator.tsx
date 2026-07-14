import React, { useState } from "react";
import { calculateRentVsBuy } from "../../lib/calculators/finance-calculators";

export default function RentVsBuyCalculator() {
  const [propertyValue, setPropertyValue] = useState(6000000);
  const [monthlyRent, setMonthlyRent] = useState(25000);
  const [annualRentIncrease, setAnnualRentIncrease] = useState(5);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [downPayment, setDownPayment] = useState(1200000);
  const [appreciationRate, setAppreciationRate] = useState(5);

  const result = calculateRentVsBuy(
    propertyValue,
    monthlyRent,
    annualRentIncrease,
    interestRate,
    tenureYears,
    downPayment,
    appreciationRate
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Inputs (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Property Value */}
          <div className="space-y-1">
            <label htmlFor="property-value-input" className="text-xs font-semibold text-muted uppercase">Property Price (₹)</label>
            <input
              id="property-value-input"
              type="number"
              value={propertyValue}
              onChange={(e) => setPropertyValue(Math.max(100000, Number(e.target.value)))}
              className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Down Payment */}
          <div className="space-y-1">
            <label htmlFor="downpayment-input" className="text-xs font-semibold text-muted uppercase">Down Payment (₹)</label>
            <input
              id="downpayment-input"
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Math.min(propertyValue, Math.max(0, Number(e.target.value))))}
              className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {/* Monthly Rent */}
          <div className="space-y-1">
            <label htmlFor="rent-input" className="text-xs font-semibold text-muted uppercase">Current Monthly Rent (₹)</label>
            <input
              id="rent-input"
              type="number"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Rent Increase */}
            <div className="space-y-1">
              <label htmlFor="rent-inc-input" className="text-[10px] font-bold text-muted uppercase">Rent Rise (%/yr)</label>
              <input
                id="rent-inc-input"
                type="number"
                value={annualRentIncrease}
                onChange={(e) => setAnnualRentIncrease(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            {/* Property Appreciation */}
            <div className="space-y-1">
              <label htmlFor="appreciation-input" className="text-[10px] font-bold text-muted uppercase">Home Rise (%/yr)</label>
              <input
                id="appreciation-input"
                type="number"
                value={appreciationRate}
                onChange={(e) => setAppreciationRate(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Interest Rate */}
            <div className="space-y-1">
              <label htmlFor="rate-input" className="text-[10px] font-bold text-muted uppercase">Loan Rate (%)</label>
              <input
                id="rate-input"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            {/* Tenure */}
            <div className="space-y-1">
              <label htmlFor="tenure-input" className="text-[10px] font-bold text-muted uppercase">Tenure (Years)</label>
              <input
                id="tenure-input"
                type="number"
                value={tenureYears}
                onChange={(e) => setTenureYears(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Right Output (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-4 text-center">
                Financial Verdict
              </h3>
              
              <div className={`p-4 rounded-lg border text-center mb-6 ${
                result.isBuyingBetter
                  ? "bg-accent/10 border-accent/20"
                  : "bg-primary/10 border-primary/20"
              }`}>
                <p className="text-sm font-semibold text-foreground">
                  🔑 {result.isBuyingBetter ? "Buying" : "Renting"} is financially better for you!
                </p>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  You save approximately <span className="font-bold text-foreground">{formatCurrency(result.difference)}</span> over {tenureYears} years.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rent Option Summary */}
                <div className="p-4 rounded-lg bg-secondary/20 border border-border">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wide mb-2">If You Rent</h4>
                  <div className="space-y-1 text-xs text-muted">
                    <div className="flex justify-between">
                      <span>Total Rent Paid:</span>
                      <span className="font-semibold text-foreground tabular-nums">{formatCurrency(result.totalRentCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rent (End of {tenureYears} yrs):</span>
                      <span className="font-semibold text-foreground tabular-nums">
                        {formatCurrency(monthlyRent * Math.pow(1 + annualRentIncrease/100, tenureYears))} /mo
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buy Option Summary */}
                <div className="p-4 rounded-lg bg-secondary/20 border border-border">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wide mb-2">If You Buy</h4>
                  <div className="space-y-1 text-xs text-muted">
                    <div className="flex justify-between">
                      <span>Total Outflow (EMI + Down):</span>
                      <span className="font-semibold text-foreground tabular-nums">{formatCurrency(result.totalBuyCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Appreciated Home Value:</span>
                      <span className="font-semibold text-accent tabular-nums">{formatCurrency(result.propertyAppreciatedValue)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
