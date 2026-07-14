import React, { useState } from "react";
import { calculateRetirementCorpus } from "../../lib/calculators/finance-calculators";

export default function RetirementCorpusCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [expenses, setExpenses] = useState(40000);
  const [inflationRate, setInflationRate] = useState(6);
  const [preReturn, setPreReturn] = useState(12);
  const [postReturn, setPostReturn] = useState(7);

  const result = calculateRetirementCorpus(
    currentAge,
    retirementAge,
    lifeExpectancy,
    expenses,
    inflationRate,
    preReturn,
    postReturn
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
          {/* Ages Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="curr-age-input" className="text-xs font-semibold text-muted uppercase">Current Age</label>
              <input
                id="curr-age-input"
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="retire-age-input" className="text-xs font-semibold text-muted uppercase">Retirement Age</label>
              <input
                id="retire-age-input"
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Math.max(currentAge + 1, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="life-input" className="text-xs font-semibold text-muted uppercase">Life Expectancy</label>
              <input
                id="life-input"
                type="number"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Math.max(retirementAge + 1, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          {/* Expenses */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="expenses-input" className="text-sm font-medium text-foreground">
                Current Monthly Expenses (₹)
              </label>
              <input
                id="expenses-input"
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(Math.max(0, Number(e.target.value)))}
                className="w-32 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              value={expenses}
              onChange={(e) => setExpenses(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Inflation */}
            <div className="space-y-1">
              <label htmlFor="inflation-input" className="text-[10px] font-bold text-muted uppercase">Inflation (%)</label>
              <input
                id="inflation-input"
                type="number"
                step="0.1"
                value={inflationRate}
                onChange={(e) => setInflationRate(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            {/* Pre Return */}
            <div className="space-y-1">
              <label htmlFor="pre-return-input" className="text-[10px] font-bold text-muted uppercase">Pre-Retire Return (%)</label>
              <input
                id="pre-return-input"
                type="number"
                step="0.1"
                value={preReturn}
                onChange={(e) => setPreReturn(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            {/* Post Return */}
            <div className="space-y-1">
              <label htmlFor="post-return-input" className="text-[10px] font-bold text-muted uppercase">Post-Retire Return (%)</label>
              <input
                id="post-return-input"
                type="number"
                step="0.1"
                value={postReturn}
                onChange={(e) => setPostReturn(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Right Results Display */}
        <div className="rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">Target Retirement Corpus</span>
              <p className="mt-1 text-3xl sm:text-4xl font-heading font-extrabold text-primary tabular-nums">
                {formatCurrency(result.retirementCorpusNeeded)}
              </p>
            </div>

            <div className="border-t border-border pt-4 text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">Required Monthly SIP</span>
              <p className="mt-1 text-2xl font-heading font-bold text-accent tabular-nums">
                {formatCurrency(result.monthlySipRequired)}
              </p>
            </div>

            <div className="border-t border-border pt-4 text-xs text-muted space-y-1">
              <div className="flex justify-between">
                <span>Years to Retire:</span>
                <span className="font-semibold text-foreground">{retirementAge - currentAge} Years</span>
              </div>
              <div className="flex justify-between">
                <span>Years in Retirement:</span>
                <span className="font-semibold text-foreground">{lifeExpectancy - retirementAge} Years</span>
              </div>
              <div className="flex justify-between">
                <span>Inflation-adjusted Expense:</span>
                <span className="font-semibold text-foreground tabular-nums">{formatCurrency(result.inflationAdjustedExpense)} /mo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
