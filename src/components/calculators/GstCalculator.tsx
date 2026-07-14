import React, { useState } from "react";
import { calculateGST } from "../../lib/calculators/more-calculators";

export default function GstCalculator() {
  const [amount, setAmount] = useState(10000);
  const [gstRate, setGstRate] = useState(18);
  const [isInclusive, setIsInclusive] = useState(false);

  const result = calculateGST(amount, gstRate, isInclusive);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(val);
  };

  const gstRatesPreset = [5, 12, 18, 28];

  return (
    <div className="space-y-6">
      {/* Inclusive vs Exclusive selector tabs */}
      <div className="flex rounded-lg bg-secondary p-1 w-full sm:w-fit">
        <button
          onClick={() => setIsInclusive(false)}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            !isInclusive ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Add GST (Exclusive)
        </button>
        <button
          onClick={() => setIsInclusive(true)}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            isInclusive ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Remove GST (Inclusive)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Inputs */}
        <div className="space-y-6">
          {/* Amount input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="amount-input" className="text-sm font-medium text-foreground">
                {isInclusive ? "Total Price (Inclusive of GST)" : "Net Price (Exclusive of GST)"}
              </label>
              <input
                id="amount-input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                className="w-32 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="100"
              max="500000"
              step="100"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>₹100</span>
              <span>₹5 Lakh</span>
            </div>
          </div>

          {/* Preset buttons & Custom Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground block">GST Rate (%)</label>
            <div className="flex flex-wrap gap-2">
              {gstRatesPreset.map((rate) => (
                <button
                  key={rate}
                  onClick={() => setGstRate(rate)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md border transition-all ${
                    gstRate === rate
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground hover:bg-secondary border-border"
                  }`}
                >
                  {rate}%
                </button>
              ))}
              <div className="flex items-center gap-1 border border-border rounded-md bg-card px-2 py-0.5 w-28">
                <input
                  type="number"
                  placeholder="Custom"
                  value={gstRate}
                  onChange={(e) => setGstRate(Math.max(0.1, Math.min(100, Number(e.target.value))))}
                  className="w-full bg-transparent border-none text-right text-xs focus:ring-0 focus:outline-none font-bold text-foreground"
                />
                <span className="text-xs text-muted font-bold">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Results Display */}
        <div className="rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">
                {isInclusive ? "Original Price (Before Tax)" : "Total Price (Including Tax)"}
              </span>
              <p className="mt-1 text-3xl sm:text-4xl font-heading font-extrabold text-primary tabular-nums">
                {formatCurrency(isInclusive ? result.originalAmount : result.finalAmount)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <span className="text-xs text-muted">
                  {isInclusive ? "Post-Tax Gross Price" : "Pre-Tax Net Price"}
                </span>
                <p className="font-semibold text-foreground tabular-nums">{formatCurrency(amount)}</p>
              </div>
              <div>
                <span className="text-xs text-muted">Total GST Amount ({gstRate}%)</span>
                <p className="font-semibold text-foreground tabular-nums">{formatCurrency(result.gstAmount)}</p>
              </div>
            </div>

            {/* Split breakdown showing CGST & SGST */}
            <div className="border-t border-border pt-4 grid grid-cols-2 gap-4 text-xs text-muted leading-relaxed">
              <div>
                <span>CGST (Central Tax: {gstRate / 2}%)</span>
                <p className="font-medium text-foreground tabular-nums">{formatCurrency(result.gstAmount / 2)}</p>
              </div>
              <div>
                <span>SGST (State Tax: {gstRate / 2}%)</span>
                <p className="font-medium text-foreground tabular-nums">{formatCurrency(result.gstAmount / 2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
