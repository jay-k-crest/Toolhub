import React, { useState } from "react";
import { calculateHRA } from "../../lib/calculators/finance-calculators";

export default function HraCalculator() {
  const [basicSalary, setBasicSalary] = useState(500000);
  const [hraReceived, setHraReceived] = useState(250000);
  const [rentPaid, setRentPaid] = useState(180000);
  const [isMetro, setIsMetro] = useState(true);

  const result = calculateHRA(basicSalary, hraReceived, rentPaid, isMetro);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const exemptPercent = hraReceived > 0 ? (result.exemptHRA / hraReceived) * 100 : 0;
  const taxablePercent = hraReceived > 0 ? (result.taxableHRA / hraReceived) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Metro vs Non-metro Toggle */}
      <div className="flex rounded-lg bg-secondary p-1 w-full sm:w-fit">
        <button
          onClick={() => setIsMetro(true)}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            isMetro ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Metro City (Delhi, Mumbai, Kolkata, Chennai)
        </button>
        <button
          onClick={() => setIsMetro(false)}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            !isMetro ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Non-Metro City
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Inputs */}
        <div className="space-y-6">
          {/* Basic Salary */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="basic-salary-input" className="text-sm font-medium text-foreground">
                Basic Annual Salary + DA (₹)
              </label>
              <input
                id="basic-salary-input"
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Math.max(0, Number(e.target.value)))}
                className="w-36 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="50000"
              max="5000000"
              step="10000"
              value={basicSalary}
              onChange={(e) => setBasicSalary(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>₹50,000</span>
              <span>₹50 Lakh</span>
            </div>
          </div>

          {/* HRA Received */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="hra-received-input" className="text-sm font-medium text-foreground">
                Annual HRA Received (₹)
              </label>
              <input
                id="hra-received-input"
                type="number"
                value={hraReceived}
                onChange={(e) => setHraReceived(Math.max(0, Number(e.target.value)))}
                className="w-36 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="10000"
              max="2000000"
              step="5000"
              value={hraReceived}
              onChange={(e) => setHraReceived(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>₹10,000</span>
              <span>₹20 Lakh</span>
            </div>
          </div>

          {/* Rent Paid */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="rent-paid-input" className="text-sm font-medium text-foreground">
                Annual Rent Paid (₹)
              </label>
              <input
                id="rent-paid-input"
                type="number"
                value={rentPaid}
                onChange={(e) => setRentPaid(Math.max(0, Number(e.target.value)))}
                className="w-36 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="10000"
              max="2000000"
              step="5000"
              value={rentPaid}
              onChange={(e) => setRentPaid(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>₹10,000</span>
              <span>₹20 Lakh</span>
            </div>
          </div>
        </div>

        {/* Right Results Display */}
        <div className="rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">Exempt HRA (Tax Free)</span>
              <p className="mt-1 text-3xl sm:text-4xl font-heading font-extrabold text-accent tabular-nums">
                {formatCurrency(result.exemptHRA)}
              </p>
            </div>

            <div className="border-t border-border pt-4 text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">Taxable HRA</span>
              <p className="mt-1 text-2xl font-heading font-bold text-destructive tabular-nums">
                {formatCurrency(result.taxableHRA)}
              </p>
            </div>

            {/* Calculations logic breakdown for SEO transparency */}
            <div className="border-t border-border pt-4 space-y-2 text-xs text-muted">
              <p className="font-semibold text-foreground">HRA Exemption Criteria Comparison:</p>
              <div className="flex justify-between">
                <span>1. Actual HRA Received:</span>
                <span className="font-semibold text-foreground tabular-nums">{formatCurrency(result.actualHraReceived)}</span>
              </div>
              <div className="flex justify-between">
                <span>2. Rent Paid minus 10% of Basic:</span>
                <span className="font-semibold text-foreground tabular-nums">{formatCurrency(result.rentMinus10PercentBasic)}</span>
              </div>
              <div className="flex justify-between">
                <span>3. {isMetro ? "50%" : "40%"} of Basic Salary:</span>
                <span className="font-semibold text-foreground tabular-nums">{formatCurrency(result.percentBasicCap)}</span>
              </div>
              <p className="text-[10px] italic mt-2">
                *The minimum of the three amounts is exempt from income tax.
              </p>
            </div>
          </div>

          {/* Simple breakdown bar */}
          <div className="mt-6 space-y-2">
            <div className="flex h-3 w-full rounded-full overflow-hidden bg-muted">
              <div style={{ width: `${exemptPercent}%` }} className="bg-accent" title="Exempt HRA" />
              <div style={{ width: `${taxablePercent}%` }} className="bg-destructive" title="Taxable HRA" />
            </div>
            <div className="flex justify-between text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent inline-block" />
                Exempt: {exemptPercent.toFixed(1)}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-destructive inline-block" />
                Taxable: {taxablePercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
