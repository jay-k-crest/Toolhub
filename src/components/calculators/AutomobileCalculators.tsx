import React, { useState, useEffect } from "react";
import {
  calculateCarLoanEMI,
  calculateFuelCost,
  calculateCarDepreciation,
} from "../../lib/calculators/automobile-calculators";

interface AutomobileProps {
  slug: string;
}

export default function AutomobileCalculators({ slug }: AutomobileProps) {
  const [activeSlug, setActiveSlug] = useState(slug);

  useEffect(() => {
    setActiveSlug(slug);
  }, [slug]);

  // Car loan states
  const [carPrice, setCarPrice] = useState(800000);
  const [downPayment, setDownPayment] = useState(150000);
  const [loanRate, setLoanRate] = useState(9.5);
  const [loanTenure, setLoanTenure] = useState(5);

  // Fuel states
  const [distance, setDistance] = useState(250);
  const [mileage, setMileage] = useState(16);
  const [fuelPrice, setFuelPrice] = useState(96.5);

  // Depreciation states
  const [buyCost, setBuyCost] = useState(1000000);
  const [depRate, setDepRate] = useState(15);
  const [depYears, setDepYears] = useState(5);

  // Calculations
  const loanResult = calculateCarLoanEMI(carPrice, downPayment, loanRate, loanTenure);
  const fuelResult = calculateFuelCost(distance, mileage, fuelPrice);
  const depResult = calculateCarDepreciation(buyCost, depRate, depYears);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const automobileTools = [
    { slug: "car-loan-emi-calculator", label: "Car Loan EMI" },
    { slug: "fuel-cost-calculator", label: "Fuel Cost" },
    { slug: "car-depreciation-calculator", label: "Car Depreciation" },
  ];

  return (
    <div className="space-y-6">
      {/* Switcher */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
        {automobileTools.map((t) => (
          <a
            key={t.slug}
            href={`/automobile/${t.slug}/`}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeSlug === t.slug
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/40 text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* INPUT PANEL */}
        <div className="space-y-4 bg-card border border-border p-6 rounded-xl">
          <h3 className="text-lg font-bold text-foreground mb-4">Inputs</h3>

          {/* 1. Car Loan EMI */}
          {activeSlug === "car-loan-emi-calculator" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="car-prc-inp" className="text-sm font-medium text-foreground">On-Road Car Price (₹)</label>
                  <input
                    id="car-prc-inp"
                    type="number"
                    value={carPrice}
                    onChange={(e) => setCarPrice(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="car-dp-inp" className="text-sm font-medium text-foreground">Down Payment (₹)</label>
                  <input
                    id="car-dp-inp"
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="car-loan-rate" className="text-sm font-medium text-foreground">Annual Interest Rate (%)</label>
                  <input
                    id="car-loan-rate"
                    type="number"
                    step="0.1"
                    value={loanRate}
                    onChange={(e) => setLoanRate(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="car-loan-ten" className="text-sm font-medium text-foreground">Tenure (Years)</label>
                  <input
                    id="car-loan-ten"
                    type="number"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Fuel Cost */}
          {activeSlug === "fuel-cost-calculator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="dist-inp" className="text-sm font-medium text-foreground">Trip Distance (km)</label>
                <input
                  id="dist-inp"
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="mil-inp" className="text-sm font-medium text-foreground">Fuel Economy (km/l)</label>
                  <input
                    id="mil-inp"
                    type="number"
                    step="0.1"
                    value={mileage}
                    onChange={(e) => setMileage(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="prc-inp" className="text-sm font-medium text-foreground">Fuel Price per Liter (₹)</label>
                  <input
                    id="prc-inp"
                    type="number"
                    step="0.01"
                    value={fuelPrice}
                    onChange={(e) => setFuelPrice(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Car Depreciation */}
          {activeSlug === "car-depreciation-calculator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="dep-cost-inp" className="text-sm font-medium text-foreground">Car Purchase Cost (Ex-Showroom) (₹)</label>
                <input
                  id="dep-cost-inp"
                  type="number"
                  value={buyCost}
                  onChange={(e) => setBuyCost(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="dep-rate-inp" className="text-sm font-medium text-foreground">Annual Depreciation (%)</label>
                  <input
                    id="dep-rate-inp"
                    type="number"
                    value={depRate}
                    onChange={(e) => setDepRate(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="dep-yrs-inp" className="text-sm font-medium text-foreground">Time Period (Years)</label>
                  <input
                    id="dep-yrs-inp"
                    type="number"
                    value={depYears}
                    onChange={(e) => setDepYears(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RESULTS PANEL */}
        <div className="bg-secondary/30 border border-border p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Results</h3>

            {/* 1. Car Loan Results */}
            {activeSlug === "car-loan-emi-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Monthly Car Loan EMI</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {formatCurrency(loanResult.monthlyEMI)}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Total Interest Payable:</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(loanResult.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount (Principal + Interest):</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(loanResult.totalPayment)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-2 font-bold text-accent">
                    <span>Net Loan Amount:</span>
                    <span className="tabular-nums">{formatCurrency(loanResult.loanAmount)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Fuel Cost Results */}
            {activeSlug === "fuel-cost-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Estimated Trip Fuel Cost</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {formatCurrency(fuelResult.totalCost)}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Required Fuel:</span>
                    <span className="font-semibold tabular-nums">{fuelResult.totalFuelLiters} Liters</span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-2 font-semibold">
                    <span>Running Cost per km:</span>
                    <span className="tabular-nums">{formatCurrency(fuelResult.costPerKm)}/km</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Car Depreciation Results */}
            {activeSlug === "car-depreciation-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Residual Value (After {depYears} Years)</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {formatCurrency(depResult.finalValue)}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between text-red-600 font-semibold">
                    <span>Total Depreciated Amount:</span>
                    <span className="tabular-nums">-{formatCurrency(depResult.totalDepreciation)}</span>
                  </div>
                </div>
                {depResult.schedule && depResult.schedule.length > 0 && (
                  <div className="mt-4 border-t border-border/50 pt-4 text-xs">
                    <span className="font-bold text-muted block mb-2">Depreciation Schedule</span>
                    <div className="space-y-1">
                      {depResult.schedule.map((entry) => (
                        <div key={entry.year} className="flex justify-between tabular-nums">
                          <span>Year {entry.year}:</span>
                          <span className="text-muted">{formatCurrency(entry.endingValue)} (-{formatCurrency(entry.depreciationAmount)})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
