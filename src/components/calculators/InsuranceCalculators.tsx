import React, { useState, useEffect } from "react";
import {
  calculateTermInsurance,
  calculateHLV,
  calculateCarIDV,
  calculateHealthCoverage,
} from "../../lib/calculators/insurance-calculators";

interface InsuranceProps {
  slug: string;
}

export default function InsuranceCalculators({ slug }: InsuranceProps) {
  const [activeSlug, setActiveSlug] = useState(slug);

  useEffect(() => {
    setActiveSlug(slug);
  }, [slug]);

  // Term states
  const [termAge, setTermAge] = useState(30);
  const [termSum, setTermSum] = useState(10000000); // 1 Crore
  const [termTenure, setTermTenure] = useState(25);
  const [termSmoker, setTermSmoker] = useState(false);
  const [termGender, setTermGender] = useState<"male" | "female">("male");

  // HLV states
  const [hlvIncome, setHlvIncome] = useState(1200000);
  const [hlvYears, setHlvYears] = useState(25);
  const [hlvCoverage, setHlvCoverage] = useState(2000000);
  const [hlvLiabilities, setHlvLiabilities] = useState(5000000);
  const [hlvExpensesPct, setHlvExpensesPct] = useState(75);

  // Car IDV states
  const [carPrice, setCarPrice] = useState(1200000);
  const [carAge, setCarAge] = useState(2.5);

  // Health states
  const [healthCityTier, setHealthCityTier] = useState<1 | 2 | 3>(1);
  const [healthSelf, setHealthSelf] = useState(true);
  const [healthSpouse, setHealthSpouse] = useState(true);
  const [healthChildren, setHealthChildren] = useState(2);
  const [healthParents, setHealthParents] = useState(0);
  const [healthMaxAge, setHealthMaxAge] = useState(35);

  // Calculations
  const termResult = calculateTermInsurance(termAge, termSum, termTenure, termSmoker, termGender);
  const hlvResult = calculateHLV(hlvIncome, hlvYears, hlvCoverage, hlvLiabilities, hlvExpensesPct);
  const carIdvResult = calculateCarIDV(carPrice, carAge);
  const healthResult = calculateHealthCoverage(
    healthCityTier,
    { self: healthSelf, spouse: healthSpouse, childrenCount: healthChildren, parentsCount: healthParents },
    healthMaxAge
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const insuranceTools = [
    { slug: "term-insurance-calculator", label: "Term Insurance" },
    { slug: "life-insurance-calculator", label: "Human Life Value" },
    { slug: "car-insurance-idv-calculator", label: "Car IDV Depreciation" },
    { slug: "health-insurance-calculator", label: "Health Coverage" },
  ];

  return (
    <div className="space-y-6">
      {/* Switcher */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
        {insuranceTools.map((t) => (
          <a
            key={t.slug}
            href={`/insurance/${t.slug}/`}
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

          {/* 1. Term Insurance */}
          {activeSlug === "term-insurance-calculator" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="term-age-inp" className="text-sm font-medium text-foreground">Age</label>
                  <input
                    id="term-age-inp"
                    type="number"
                    value={termAge}
                    onChange={(e) => setTermAge(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="term-ten-inp" className="text-sm font-medium text-foreground">Term Policy Period (Years)</label>
                  <input
                    id="term-ten-inp"
                    type="number"
                    value={termTenure}
                    onChange={(e) => setTermTenure(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="term-sum-inp" className="text-sm font-medium text-foreground">Sum Assured (₹)</label>
                <input
                  id="term-sum-inp"
                  type="number"
                  value={termSum}
                  onChange={(e) => setTermSum(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Gender</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTermGender("male")}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md border ${
                        termGender === "male" ? "bg-primary text-primary-foreground" : "bg-card border-input text-muted"
                      }`}
                    >
                      Male
                    </button>
                    <button
                      onClick={() => setTermGender("female")}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md border ${
                        termGender === "female" ? "bg-primary text-primary-foreground" : "bg-card border-input text-muted"
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    id="smoker-check"
                    type="checkbox"
                    checked={termSmoker}
                    onChange={(e) => setTermSmoker(e.target.checked)}
                    className="h-4 w-4 bg-secondary border-input accent-primary"
                  />
                  <label htmlFor="smoker-check" className="text-sm font-medium text-foreground">Do you smoke?</label>
                </div>
              </div>
            </div>
          )}

          {/* 2. HLV / Life Insurance Coverage */}
          {activeSlug === "life-insurance-calculator" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="hlv-inc-inp" className="text-sm font-medium text-foreground">Annual Income (₹)</label>
                  <input
                    id="hlv-inc-inp"
                    type="number"
                    value={hlvIncome}
                    onChange={(e) => setHlvIncome(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="hlv-yrs-inp" className="text-sm font-medium text-foreground">Years to Retirement</label>
                  <input
                    id="hlv-yrs-inp"
                    type="number"
                    value={hlvYears}
                    onChange={(e) => setHlvYears(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="hlv-lia-inp" className="text-sm font-medium text-foreground">Outstanding Liabilities (₹)</label>
                  <input
                    id="hlv-lia-inp"
                    type="number"
                    value={hlvLiabilities}
                    onChange={(e) => setHlvLiabilities(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="hlv-cov-inp" className="text-sm font-medium text-foreground">Existing Life Cover (₹)</label>
                  <input
                    id="hlv-cov-inp"
                    type="number"
                    value={hlvCoverage}
                    onChange={(e) => setHlvCoverage(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Car IDV */}
          {activeSlug === "car-insurance-idv-calculator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="car-price-inp" className="text-sm font-medium text-foreground">Manufacturer Ex-Showroom Price (₹)</label>
                <input
                  id="car-price-inp"
                  type="number"
                  value={carPrice}
                  onChange={(e) => setCarPrice(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label htmlFor="car-age-range" className="text-sm font-medium text-foreground">Vehicle Age (Years)</label>
                  <span className="text-sm font-bold text-foreground">{carAge} Year(s)</span>
                </div>
                <input
                  id="car-age-range"
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.5"
                  value={carAge}
                  onChange={(e) => setCarAge(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          )}

          {/* 4. Health Insurance */}
          {activeSlug === "health-insurance-calculator" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="city-tier-sel" className="text-sm font-medium text-foreground">City Tier</label>
                  <select
                    id="city-tier-sel"
                    value={healthCityTier}
                    onChange={(e) => setHealthCityTier(Number(e.target.value) as any)}
                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    <option value={1}>Tier 1 (Metro Cities)</option>
                    <option value={2}>Tier 2 (Semi-Urban)</option>
                    <option value={3}>Tier 3 (Rural/Towns)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="health-max-age" className="text-sm font-medium text-foreground">Age of Eldest Member</label>
                  <input
                    id="health-max-age"
                    type="number"
                    value={healthMaxAge}
                    onChange={(e) => setHealthMaxAge(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={healthSelf}
                    onChange={(e) => setHealthSelf(e.target.checked)}
                    className="accent-primary h-4 w-4"
                  />
                  Cover Self
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={healthSpouse}
                    onChange={(e) => setHealthSpouse(e.target.checked)}
                    className="accent-primary h-4 w-4"
                  />
                  Cover Spouse
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="health-child-cnt" className="text-sm font-medium text-foreground">Children Count</label>
                  <input
                    id="health-child-cnt"
                    type="number"
                    value={healthChildren}
                    onChange={(e) => setHealthChildren(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="health-parent-cnt" className="text-sm font-medium text-foreground">Parents Count</label>
                  <input
                    id="health-parent-cnt"
                    type="number"
                    value={healthParents}
                    onChange={(e) => setHealthParents(Number(e.target.value))}
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

            {/* 1. Term Insurance Results */}
            {activeSlug === "term-insurance-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Est. Annual Premium</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {formatCurrency(termResult.estimatedAnnualPremium)}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between font-semibold text-accent">
                    <span>Est. Monthly Premium:</span>
                    <span className="tabular-nums">{formatCurrency(termResult.estimatedMonthlyPremium)}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Life Cover:</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(termResult.sumAssured)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. HLV Results */}
            {activeSlug === "life-insurance-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Recommended Life Cover Need</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {formatCurrency(hlvResult.requiredCoverage)}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Human Life Value Needs:</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(hlvResult.incomeReplacementNeeds)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Liabilities to Cover:</span>
                    <span className="font-semibold tabular-nums">+{formatCurrency(hlvResult.totalLiabilities)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Car IDV Results */}
            {activeSlug === "car-insurance-idv-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Insured Declared Value (IDV)</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {formatCurrency(carIdvResult.idv)}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Depreciation Applied ({carIdvResult.depreciationPct}%):</span>
                    <span className="font-semibold text-red-600 tabular-nums">-{formatCurrency(carIdvResult.depreciationAmount)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-2 font-semibold">
                    <span>Ex-Showroom Purchase Cost:</span>
                    <span className="tabular-nums">{formatCurrency(carPrice)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Health Insurance Results */}
            {activeSlug === "health-insurance-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Recommended Health Cover</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {formatCurrency(healthResult.recommendedSumInsured)}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between font-semibold text-accent">
                    <span>Estimated Annual Premium:</span>
                    <span className="tabular-nums">{formatCurrency(healthResult.estimatedAnnualPremium)}</span>
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
