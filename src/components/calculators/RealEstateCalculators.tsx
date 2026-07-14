import React, { useState, useEffect } from "react";
import {
  calculateHomeAffordability,
  calculateStampDuty,
  calculatePropertyTax,
  calculateRentalYield,
  stateStampDutyRates,
} from "../../lib/calculators/realestate-calculators";

interface RealEstateProps {
  slug: string;
}

export default function RealEstateCalculators({ slug }: RealEstateProps) {
  const [activeSlug, setActiveSlug] = useState(slug);

  useEffect(() => {
    setActiveSlug(slug);
  }, [slug]);

  // Affordability states
  const [monthlyIncome, setMonthlyIncome] = useState(120000);
  const [affordRate, setAffordRate] = useState(8.5);
  const [affordTenure, setAffordTenure] = useState(20);
  const [existingEMIs, setExistingEMIs] = useState(15000);
  const [foirPct, setFoirPct] = useState(45);
  const [downPaymentPct, setDownPaymentPct] = useState(20);

  // Stamp Duty states
  const [propValue, setPropValue] = useState(5000000);
  const [selectedState, setSelectedState] = useState("maharashtra");
  const [buyerGender, setBuyerGender] = useState<"male" | "female" | "joint">("male");
  const [customStampRate, setCustomStampRate] = useState(5);

  // Property Tax states
  const [taxPropVal, setTaxPropVal] = useState(4000000);
  const [taxRate, setTaxRate] = useState(0.5);
  const [taxRebate, setTaxRebate] = useState(10);

  // Rental Yield states
  const [rentalPropVal, setRentalPropVal] = useState(6000000);
  const [monthlyRent, setMonthlyRent] = useState(22000);
  const [annualExp, setAnnualExp] = useState(25000);

  // Calculations
  const affordResult = calculateHomeAffordability(monthlyIncome, affordRate, affordTenure, existingEMIs, foirPct, downPaymentPct);
  const stampResult = calculateStampDuty(propValue, selectedState, buyerGender, customStampRate);
  const taxResult = calculatePropertyTax(taxPropVal, taxRate, taxRebate);
  const rentalResult = calculateRentalYield(rentalPropVal, monthlyRent, annualExp);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const realEstateTools = [
    { slug: "home-loan-affordability-calculator", label: "Home Affordability" },
    { slug: "stamp-duty-calculator", label: "Stamp Duty" },
    { slug: "property-tax-calculator", label: "Property Tax" },
    { slug: "rental-yield-calculator", label: "Rental Yield" },
  ];

  return (
    <div className="space-y-6">
      {/* Switcher */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
        {realEstateTools.map((t) => (
          <a
            key={t.slug}
            href={`/real-estate/${t.slug}/`}
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

          {/* 1. Affordability */}
          {activeSlug === "home-loan-affordability-calculator" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="aff-inc" className="text-sm font-medium text-foreground">Monthly Income (₹)</label>
                  <input
                    id="aff-inc"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="aff-emi" className="text-sm font-medium text-foreground">Existing EMIs (₹)</label>
                  <input
                    id="aff-emi"
                    type="number"
                    value={existingEMIs}
                    onChange={(e) => setExistingEMIs(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="aff-rate" className="text-sm font-medium text-foreground">Rate of Interest (% p.a.)</label>
                  <input
                    id="aff-rate"
                    type="number"
                    step="0.1"
                    value={affordRate}
                    onChange={(e) => setAffordRate(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="aff-ten" className="text-sm font-medium text-foreground">Tenure (Years)</label>
                  <input
                    id="aff-ten"
                    type="number"
                    value={affordTenure}
                    onChange={(e) => setAffordTenure(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="foir-pct" className="text-sm font-medium text-foreground">FOIR Limit (%)</label>
                  <input
                    id="foir-pct"
                    type="number"
                    value={foirPct}
                    onChange={(e) => setFoirPct(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="dp-pct" className="text-sm font-medium text-foreground">Down Payment (%)</label>
                  <input
                    id="dp-pct"
                    type="number"
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Stamp Duty */}
          {activeSlug === "stamp-duty-calculator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="prop-val-inp" className="text-sm font-medium text-foreground">Property Value (₹)</label>
                <input
                  id="prop-val-inp"
                  type="number"
                  value={propValue}
                  onChange={(e) => setPropValue(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="state-sel" className="text-sm font-medium text-foreground">Select State</label>
                  <select
                    id="state-sel"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    <option value="maharashtra">Maharashtra</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="delhi">Delhi</option>
                    <option value="tamilnadu">Tamil Nadu</option>
                    <option value="telangana">Telangana</option>
                    <option value="uttarpradesh">Uttar Pradesh</option>
                    <option value="custom">Custom Percentage</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="gender-sel" className="text-sm font-medium text-foreground">Buyer Type</label>
                  <select
                    id="gender-sel"
                    value={buyerGender}
                    onChange={(e) => setBuyerGender(e.target.value as any)}
                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="joint">Joint (Male + Female)</option>
                  </select>
                </div>
              </div>
              {selectedState === "custom" && (
                <div className="space-y-1.5">
                  <label htmlFor="custom-stamp-rate" className="text-sm font-medium text-foreground">Custom Stamp Duty Rate (%)</label>
                  <input
                    id="custom-stamp-rate"
                    type="number"
                    step="0.1"
                    value={customStampRate}
                    onChange={(e) => setCustomStampRate(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* 3. Property Tax */}
          {activeSlug === "property-tax-calculator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="tax-prop-val-inp" className="text-sm font-medium text-foreground">Property Assessed Value (₹)</label>
                <input
                  id="tax-prop-val-inp"
                  type="number"
                  value={taxPropVal}
                  onChange={(e) => setTaxPropVal(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="tax-rate-inp" className="text-sm font-medium text-foreground">Tax Rate (% p.a.)</label>
                  <input
                    id="tax-rate-inp"
                    type="number"
                    step="0.05"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="tax-rebate-inp" className="text-sm font-medium text-foreground">Rebate/Discount (%)</label>
                  <input
                    id="tax-rebate-inp"
                    type="number"
                    value={taxRebate}
                    onChange={(e) => setTaxRebate(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Rental Yield */}
          {activeSlug === "rental-yield-calculator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="rent-prop-val-inp" className="text-sm font-medium text-foreground">Total Property Cost (₹)</label>
                <input
                  id="rent-prop-val-inp"
                  type="number"
                  value={rentalPropVal}
                  onChange={(e) => setRentalPropVal(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="monthly-rent-inp" className="text-sm font-medium text-foreground">Monthly Rent (₹)</label>
                  <input
                    id="monthly-rent-inp"
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="annual-exp-inp" className="text-sm font-medium text-foreground">Annual Expenses (Taxes, Maintenance)</label>
                  <input
                    id="annual-exp-inp"
                    type="number"
                    value={annualExp}
                    onChange={(e) => setAnnualExp(Number(e.target.value))}
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

            {/* 1. Affordability Results */}
            {activeSlug === "home-loan-affordability-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Affordable Property Price</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {formatCurrency(affordResult.maxPropertyPrice)}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Maximum Loan Eligible:</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(affordResult.maxLoanAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Down Payment Required ({downPaymentPct}%):</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(affordResult.downPaymentNeeded)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-2 font-bold text-accent">
                    <span>Target Monthly EMI Cap:</span>
                    <span className="tabular-nums">{formatCurrency(affordResult.monthlyEMI)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Stamp Duty Results */}
            {activeSlug === "stamp-duty-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Estimated Stamp Duty</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {formatCurrency(stampResult.stampDuty)}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Registration Fee:</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(stampResult.registrationFee)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-2 font-bold text-accent">
                    <span>Total Acquisition Cost:</span>
                    <span className="tabular-nums">{formatCurrency(stampResult.totalCost)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Property Tax Results */}
            {activeSlug === "property-tax-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Net Annual Property Tax</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {formatCurrency(taxResult.finalTax)}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Gross Annual Tax:</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(taxResult.annualTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rebate/Discount Allowed ({taxRebate}%):</span>
                    <span className="font-semibold text-emerald-600 tabular-nums">-{formatCurrency(taxResult.rebateAmount)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Rental Yield Results */}
            {activeSlug === "rental-yield-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Net Rental Yield (% p.a.)</span>
                  <span className="text-3xl font-heading font-extrabold text-accent tabular-nums">
                    {rentalResult.netYield}%
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Gross Rental Yield:</span>
                    <span className="font-semibold text-primary tabular-nums">{rentalResult.grossYield}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Rental Income:</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(rentalResult.annualRent)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-2 font-semibold">
                    <span>Net Annual Cashflow:</span>
                    <span className="tabular-nums">{formatCurrency(rentalResult.netAnnualIncome)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
