import React, { useState, useEffect } from "react";
import {
  calculateCryptoProfit,
  calculateDca,
  calculateDividendYield,
  calculatePeRatio,
} from "../../lib/calculators/crypto-stocks-calculators";

interface CryptoStocksProps {
  slug: string;
}

export default function CryptoStocksCalculators({ slug }: CryptoStocksProps) {
  const [activeSlug, setActiveSlug] = useState(slug);

  useEffect(() => {
    setActiveSlug(slug);
  }, [slug]);

  // Crypto states
  const [buyPrice, setBuyPrice] = useState(50000);
  const [sellPrice, setSellPrice] = useState(58000);
  const [cryptoQty, setCryptoQty] = useState(0.25);
  const [buyFee, setBuyFee] = useState(0.1);
  const [sellFee, setSellFee] = useState(0.1);

  // Stock DCA states
  const [dcaEntries, setDcaEntries] = useState([
    { price: 150, shares: 10 },
    { price: 140, shares: 15 },
    { price: 160, shares: 8 },
  ]);
  const [newPrice, setNewPrice] = useState(150);
  const [newShares, setNewShares] = useState(10);

  // Dividend Yield states
  const [divPerShare, setDivPerShare] = useState(5);
  const [sharePrice, setSharePrice] = useState(120);

  // PE Ratio states
  const [peSharePrice, setPeSharePrice] = useState(150);
  const [eps, setEps] = useState(7.5);

  // Calculations
  const cryptoResult = calculateCryptoProfit(buyPrice, sellPrice, cryptoQty, buyFee, sellFee);
  const dcaResult = calculateDca(dcaEntries);
  const divYieldResult = calculateDividendYield(divPerShare, sharePrice);
  const peResult = calculatePeRatio(peSharePrice, eps);

  const formatCurrency = (val: number, isCrypto: boolean = false) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: isCrypto ? 4 : 2,
    }).format(val);
  };

  const cryptoStocksTools = [
    { slug: "crypto-profit-calculator", label: "Crypto Profit/Loss" },
    { slug: "stock-dca-calculator", label: "Stock DCA Average" },
    { slug: "dividend-yield-calculator", label: "Dividend Yield" },
    { slug: "pe-ratio-calculator", label: "P/E Ratio" },
  ];

  return (
    <div className="space-y-6">
      {/* Switcher */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
        {cryptoStocksTools.map((t) => (
          <a
            key={t.slug}
            href={`/crypto-stocks/${t.slug}/`}
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

          {/* 1. Crypto Profit */}
          {activeSlug === "crypto-profit-calculator" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="cry-buy-prc" className="text-sm font-medium text-foreground">Buy Price ($)</label>
                  <input
                    id="cry-buy-prc"
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="cry-sell-prc" className="text-sm font-medium text-foreground">Sell Price ($)</label>
                  <input
                    id="cry-sell-prc"
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="cry-qty" className="text-sm font-medium text-foreground">Quantity / Coins</label>
                <input
                  id="cry-qty"
                  type="number"
                  step="0.0001"
                  value={cryptoQty}
                  onChange={(e) => setCryptoQty(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="cry-buy-fee" className="text-xs text-muted">Buy Fee (%)</label>
                  <input
                    id="cry-buy-fee"
                    type="number"
                    step="0.05"
                    value={buyFee}
                    onChange={(e) => setBuyFee(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="cry-sell-fee" className="text-xs text-muted">Sell Fee (%)</label>
                  <input
                    id="cry-sell-fee"
                    type="number"
                    step="0.05"
                    value={sellFee}
                    onChange={(e) => setSellFee(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Stock DCA */}
          {activeSlug === "stock-dca-calculator" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Purchased Batches</label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {dcaEntries.map((entry, idx) => (
                    <div key={idx} className="flex gap-2 items-center text-xs">
                      <span className="flex-1 font-semibold">Batch {idx + 1}</span>
                      <span className="tabular-nums">Shares: {entry.shares}</span>
                      <span className="tabular-nums">Price: ${entry.price}</span>
                      <button
                        onClick={() => setDcaEntries(dcaEntries.filter((_, i) => i !== idx))}
                        className="text-destructive font-bold text-xs px-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-border pt-4 space-y-3">
                <span className="text-xs font-bold text-muted uppercase block">Add Purchase Batch</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Price per Share ($)"
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="rounded-md border border-input bg-secondary/35 p-1.5 text-xs text-foreground focus:outline-none"
                  />
                  <input
                    placeholder="Shares Count"
                    type="number"
                    value={newShares}
                    onChange={(e) => setNewShares(Number(e.target.value))}
                    className="rounded-md border border-input bg-secondary/35 p-1.5 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    setDcaEntries([...dcaEntries, { price: newPrice, shares: newShares }]);
                  }}
                  className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-md"
                >
                  Add Purchase
                </button>
              </div>
            </div>
          )}

          {/* 3. Dividend Yield */}
          {activeSlug === "dividend-yield-calculator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="div-share" className="text-sm font-medium text-foreground">Annual Dividend per Share ($)</label>
                <input
                  id="div-share"
                  type="number"
                  value={divPerShare}
                  onChange={(e) => setDivPerShare(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="div-share-prc" className="text-sm font-medium text-foreground">Current Share Price ($)</label>
                <input
                  id="div-share-prc"
                  type="number"
                  value={sharePrice}
                  onChange={(e) => setSharePrice(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 4. PE Ratio */}
          {activeSlug === "pe-ratio-calculator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="pe-prc-inp" className="text-sm font-medium text-foreground">Current Share Price ($)</label>
                <input
                  id="pe-prc-inp"
                  type="number"
                  value={peSharePrice}
                  onChange={(e) => setPeSharePrice(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="pe-eps-inp" className="text-sm font-medium text-foreground">Earnings Per Share (EPS) ($)</label>
                <input
                  id="pe-eps-inp"
                  type="number"
                  value={eps}
                  onChange={(e) => setEps(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* RESULTS PANEL */}
        <div className="bg-secondary/30 border border-border p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Results</h3>

            {/* 1. Crypto Profit Results */}
            {activeSlug === "crypto-profit-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Net Crypto Profit/Loss</span>
                  <span className={`text-3xl font-heading font-extrabold tabular-nums ${
                    cryptoResult.netProfit >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}>
                    {cryptoResult.netProfit >= 0 ? "+" : ""}{formatCurrency(cryptoResult.netProfit)}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Investment Value:</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(cryptoResult.investment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Transaction Fees:</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(cryptoResult.fees)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-2 font-bold text-accent">
                    <span>ROI (Return Rate):</span>
                    <span className="tabular-nums">{cryptoResult.roiPct}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Stock DCA Results */}
            {activeSlug === "stock-dca-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Average Purchase Price</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {formatCurrency(dcaResult.averagePrice)}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between font-bold">
                    <span>Total Accumulated Shares:</span>
                    <span className="tabular-nums">{dcaResult.totalShares}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-2">
                    <span>Total Money Invested:</span>
                    <span className="font-bold tabular-nums">{formatCurrency(dcaResult.totalInvestment)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Dividend Yield Results */}
            {activeSlug === "dividend-yield-calculator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Dividend Yield</span>
                  <span className="text-4xl font-heading font-extrabold text-accent tabular-nums">
                    {divYieldResult}%
                  </span>
                </div>
              </div>
            )}

            {/* 4. PE Ratio Results */}
            {activeSlug === "pe-ratio-calculator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">P/E Ratio</span>
                  <span className="text-4xl font-heading font-extrabold text-primary tabular-nums">
                    {peResult}x
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
