import React, { useState } from "react";
import { calculateSalaryInHand } from "../../lib/calculators/more-calculators";

export default function SalaryToInHandCalculator() {
  const [ctc, setCtc] = useState(1200000);
  const [basicPercent, setBasicPercent] = useState(50);
  const [professionalTax, setProfessionalTax] = useState(200);
  const [regime, setRegime] = useState<"old" | "new">("new");
  
  // Old regime specific deductions
  const [deductions80C, setDeductions80C] = useState(150000);
  const [otherDeductions, setOtherDeductions] = useState(50000);

  const breakdown = calculateSalaryInHand(
    ctc,
    basicPercent,
    professionalTax,
    regime,
    deductions80C,
    otherDeductions
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const monthlyGross = (ctc - (ctc * (basicPercent / 100) * 0.12)) / 12; // Gross / 12
  const basicSalary = ctc * (basicPercent / 100);
  const employeePF = basicSalary * 0.12;
  const employerPF = basicSalary * 0.12;

  // Percentage shares for take-home, taxes, PF
  const takeHomeAnnual = breakdown.takeHomeMonthly * 12;
  const pfAnnual = employeePF;
  const taxAnnual = breakdown.totalTax;
  const ptAnnual = professionalTax * 12;

  const totalPie = takeHomeAnnual + pfAnnual + taxAnnual + ptAnnual + employerPF;
  const takeHomePercent = totalPie > 0 ? (takeHomeAnnual / totalPie) * 100 : 0;
  const taxPercent = totalPie > 0 ? (taxAnnual / totalPie) * 100 : 0;
  const pfPercent = totalPie > 0 ? ((pfAnnual + employerPF) / totalPie) * 100 : 0;
  const otherPercent = totalPie > 0 ? (ptAnnual / totalPie) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Regime Selector */}
      <div className="flex rounded-lg bg-secondary p-1 w-full sm:w-fit">
        <button
          onClick={() => setRegime("new")}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            regime === "new" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          New Tax Regime (FY 2025-26 Standard)
        </button>
        <button
          onClick={() => setRegime("old")}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            regime === "old" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Old Tax Regime
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Inputs */}
        <div className="space-y-5">
          {/* CTC input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="ctc-input" className="text-sm font-medium text-foreground">Annual CTC (₹)</label>
              <input
                id="ctc-input"
                type="number"
                value={ctc}
                onChange={(e) => setCtc(Math.max(100000, Number(e.target.value)))}
                className="w-36 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="150000"
              max="10000000"
              step="50000"
              value={ctc}
              onChange={(e) => setCtc(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>₹1.5 Lakh</span>
              <span>₹1 Crore</span>
            </div>
          </div>

          {/* Basic Salary percentage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="basic-pct" className="text-sm font-medium text-foreground">Basic Salary (% of CTC)</label>
              <input
                id="basic-pct"
                type="number"
                value={basicPercent}
                onChange={(e) => setBasicPercent(Math.max(10, Math.min(100, Number(e.target.value))))}
                className="w-20 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="30"
              max="70"
              step="5"
              value={basicPercent}
              onChange={(e) => setBasicPercent(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>30%</span>
              <span>70% (Standard is 50%)</span>
            </div>
          </div>

          {/* Professional Tax monthly */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="pt-input" className="text-sm font-medium text-foreground">Professional Tax (₹ / month)</label>
              <select
                id="pt-input"
                value={professionalTax}
                onChange={(e) => setProfessionalTax(Number(e.target.value))}
                className="w-36 rounded-md border border-input bg-card px-3 py-1.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value={200}>₹200 / month (Standard)</option>
                <option value={0}>₹0 / month</option>
                <option value={150}>₹150 / month</option>
                <option value={208}>₹208 / month</option>
              </select>
            </div>
          </div>

          {/* Old Regime Exemptions (only shown for Old tax regime) */}
          {regime === "old" && (
            <div className="p-4 border border-border bg-secondary/20 rounded-lg space-y-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Exemptions & Deductions (Old Regime)</h4>
              
              {/* 80C */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label htmlFor="80c-ded">Section 80C Deductions (PPF, ELSS, EPF, LIC)</label>
                  <span className="font-semibold">{formatCurrency(deductions80C)}</span>
                </div>
                <input
                  id="80c-ded"
                  type="number"
                  value={deductions80C}
                  onChange={(e) => setDeductions80C(Math.min(150000, Math.max(0, Number(e.target.value))))}
                  className="w-full rounded-md border border-input bg-card px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <span className="text-[10px] text-muted block">Maximum allowed is ₹1,50,000</span>
              </div>

              {/* Other deductions (80D, HRA etc) */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label htmlFor="other-ded">Other Deductions (Medical, HRA Exemption, Home Loan Interest)</label>
                  <span className="font-semibold">{formatCurrency(otherDeductions)}</span>
                </div>
                <input
                  id="other-ded"
                  type="number"
                  value={otherDeductions}
                  onChange={(e) => setOtherDeductions(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-md border border-input bg-card px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Results Display */}
        <div className="rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">Estimated Monthly Take-Home (In-Hand)</span>
              <p className="mt-1 text-3xl sm:text-4xl font-heading font-extrabold text-primary tabular-nums">
                {formatCurrency(breakdown.takeHomeMonthly)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <span className="text-xs text-muted">Annual Take-Home</span>
                <p className="font-semibold text-foreground tabular-nums">{formatCurrency(breakdown.takeHomeMonthly * 12)}</p>
              </div>
              <div>
                <span className="text-xs text-muted">Annual Income Tax</span>
                <p className="font-semibold text-foreground tabular-nums">{formatCurrency(breakdown.totalTax)}</p>
              </div>
              <div>
                <span className="text-xs text-muted">Total Monthly PF (Emp + Empr)</span>
                <p className="font-semibold text-foreground tabular-nums">{formatCurrency((employeePF + employerPF) / 12)}</p>
              </div>
              <div>
                <span className="text-xs text-muted">Taxable Income</span>
                <p className="font-semibold text-foreground tabular-nums">{formatCurrency(breakdown.taxableIncome)}</p>
              </div>
            </div>
          </div>

          {/* CTC Share distribution bar */}
          <div className="mt-6 space-y-2">
            <div className="flex h-3.5 w-full rounded-full overflow-hidden bg-muted">
              <div style={{ width: `${takeHomePercent}%` }} className="bg-primary" title="In-Hand Take-Home" />
              <div style={{ width: `${taxPercent}%` }} className="bg-destructive" title="Income Tax & Cess" />
              <div style={{ width: `${pfPercent}%` }} className="bg-accent" title="Provident Fund (EPF)" />
              <div style={{ width: `${otherPercent}%` }} className="bg-amber-500" title="Professional Tax" />
            </div>
            <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-muted font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                Take-Home: {takeHomePercent.toFixed(1)}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-destructive inline-block" />
                Tax: {taxPercent.toFixed(1)}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent inline-block" />
                PF (EPF): {pfPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Slabs breakdown list */}
      {breakdown.slabs.length > 0 && (
        <div className="mt-8 border-t border-border pt-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Indian Income Tax Slab Computations</h3>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-secondary/40 font-medium text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">Tax Slab</th>
                  <th scope="col" className="px-4 py-3 text-right">Tax Rate (%)</th>
                  <th scope="col" className="px-4 py-3 text-right">Tax Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card tabular-nums">
                {breakdown.slabs.map((slabRow, idx) => (
                  <tr key={idx} className="hover:bg-secondary/20">
                    <td className="px-4 py-3 font-medium text-foreground">{slabRow.slab}</td>
                    <td className="px-4 py-3 text-right text-foreground">{slabRow.rate}%</td>
                    <td className="px-4 py-3 text-right text-foreground font-semibold">{formatCurrency(slabRow.tax)}</td>
                  </tr>
                ))}
                {breakdown.cess > 0 && (
                  <tr className="bg-secondary/10 font-medium text-muted">
                    <td className="px-4 py-3">Health & Education Cess</td>
                    <td className="px-4 py-3 text-right">4% of tax</td>
                    <td className="px-4 py-3 text-right text-foreground font-semibold">{formatCurrency(breakdown.cess)}</td>
                  </tr>
                )}
                <tr className="bg-secondary/30 font-bold border-t-2 border-border">
                  <td className="px-4 py-3 text-foreground">Total Income Tax Liability</td>
                  <td className="px-4 py-3 text-right text-muted">-</td>
                  <td className="px-4 py-3 text-right text-primary">{formatCurrency(breakdown.totalTax)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
