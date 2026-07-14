import React, { useState } from "react";
import { calculateCapitalGains } from "../../lib/calculators/finance-calculators";

export default function CapitalGainsTaxCalculator() {
  const [buyPrice, setBuyPrice] = useState(100);
  const [sellPrice, setSellPrice] = useState(150);
  const [quantity, setQuantity] = useState(1000);
  const [assetType, setAssetType] = useState<"equity" | "debt" | "realestate">("equity");
  const [holdingPeriod, setHoldingPeriod] = useState(18);

  const result = calculateCapitalGains(buyPrice, sellPrice, quantity, assetType, holdingPeriod);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Asset type selector tabs */}
      <div className="flex rounded-lg bg-secondary p-1 w-full sm:w-fit">
        <button
          onClick={() => {
            setAssetType("equity");
            setHoldingPeriod(18); // Default LTCG for equity
          }}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            assetType === "equity" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Equity / Mutual Fund
        </button>
        <button
          onClick={() => {
            setAssetType("realestate");
            setHoldingPeriod(30); // Default LTCG for real estate
          }}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            assetType === "realestate" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Real Estate
        </button>
        <button
          onClick={() => {
            setAssetType("debt");
            setHoldingPeriod(12); // Always slab rates for specified debt MFs
          }}
          className={`flex-1 sm:flex-initial px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
            assetType === "debt" ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
          }`}
        >
          Debt Mutual Fund
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Inputs */}
        <div className="space-y-6">
          {/* Prices input */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="buy-price-input" className="text-sm font-medium text-foreground block">Buy Price (₹)</label>
              <input
                id="buy-price-input"
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="sell-price-input" className="text-sm font-medium text-foreground block">Sell Price (₹)</label>
              <input
                id="sell-price-input"
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="qty-input" className="text-sm font-medium text-foreground">Quantity</label>
              <input
                id="qty-input"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-28 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="1"
              max="10000"
              step="10"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Holding Period (Months) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="holding-input" className="text-sm font-medium text-foreground">
                Holding Period (Months)
              </label>
              <input
                id="holding-input"
                type="number"
                value={holdingPeriod}
                onChange={(e) => setHoldingPeriod(Math.max(1, Number(e.target.value)))}
                className="w-24 rounded-md border border-input bg-card px-3 py-1.5 text-right text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <input
              type="range"
              min="1"
              max="120"
              step="1"
              value={holdingPeriod}
              onChange={(e) => setHoldingPeriod(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>1 Month</span>
              <span>10 Years (120 m)</span>
            </div>
          </div>
        </div>

        {/* Right Results Display */}
        <div className="rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">Net Profit (Post Tax)</span>
              <p className="mt-1 text-3xl sm:text-4xl font-heading font-extrabold text-accent tabular-nums">
                {formatCurrency(result.netProfit)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm text-foreground">
              <div>
                <span className="text-xs text-muted block">Gross Gain</span>
                <span className="font-semibold tabular-nums">{formatCurrency(result.gains)}</span>
              </div>
              <div>
                <span className="text-xs text-muted block">Tax Type</span>
                <span className="font-semibold uppercase text-foreground">
                  {assetType === "debt" ? "Slab Rate" : result.isLtcg ? "LTCG" : "STCG"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm text-foreground">
              <div>
                <span className="text-xs text-muted block">Tax Rate</span>
                <span className="font-semibold tabular-nums">{result.taxRate}%</span>
              </div>
              <div>
                <span className="text-xs text-muted block">Tax Amount</span>
                <span className="font-semibold text-destructive tabular-nums">{formatCurrency(result.taxAmount)}</span>
              </div>
            </div>

            {/* Explanatory notes based on latest rules */}
            <div className="border-t border-border pt-4 text-[10px] text-muted space-y-1 leading-relaxed">
              <p className="font-semibold text-foreground">Latest Capital Gains Rules Applied:</p>
              {assetType === "equity" && (
                <p>
                  * Equity LTCG (&gt;12 months holding) is taxed at 12.5% with an annual aggregate exemption of ₹1.25 Lakh. STCG is taxed at 20%.
                </p>
              )}
              {assetType === "realestate" && (
                <p>
                  * Real Estate LTCG (&gt;24 months holding) is taxed at 12.5% without indexation benefits. STCG is taxed at slab rates (assumed 30% standard here).
                </p>
              )}
              {assetType === "debt" && (
                <p>
                  * Debt mutual funds purchased after April 1, 2023 are always taxed at individual slab rates (assumed 30% standard here), regardless of holding duration.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
