import React, { useState } from "react";
import { calculateNetWorth } from "../../lib/calculators/finance-calculators";

export default function NetWorthCalculator() {
  const [assets, setAssets] = useState([
    { name: "Cash & Bank Balance", value: 150000 },
    { name: "Mutual Funds / Stocks", value: 450000 },
    { name: "Real Estate (Home/Land)", value: 5000000 },
    { name: "Gold / Jewellery", value: 300000 },
  ]);

  const [liabilities, setLiabilities] = useState([
    { name: "Home Loan", value: 2000000 },
    { name: "Car / Personal Loan", value: 300000 },
    { name: "Credit Card Outstanding", value: 25000 },
  ]);

  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetVal, setNewAssetVal] = useState("");
  const [newLiabilityName, setNewLiabilityName] = useState("");
  const [newLiabilityVal, setNewLiabilityVal] = useState("");

  const result = calculateNetWorth(assets, liabilities);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName || !newAssetVal) return;
    setAssets([...assets, { name: newAssetName, value: Number(newAssetVal) }]);
    setNewAssetName("");
    setNewAssetVal("");
  };

  const handleAddLiability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLiabilityName || !newLiabilityVal) return;
    setLiabilities([...liabilities, { name: newLiabilityName, value: Number(newLiabilityVal) }]);
    setNewLiabilityName("");
    setNewLiabilityVal("");
  };

  const handleRemoveAsset = (idx: number) => {
    setAssets(assets.filter((_, i) => i !== idx));
  };

  const handleRemoveLiability = (idx: number) => {
    setLiabilities(liabilities.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assets Form & List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide border-b border-border pb-2 flex justify-between">
            <span>Assets (+)</span>
            <span className="text-accent">{formatCurrency(result.totalAssets)}</span>
          </h3>

          <form onSubmit={handleAddAsset} className="grid grid-cols-5 gap-2">
            <input
              type="text"
              placeholder="Asset description"
              value={newAssetName}
              onChange={(e) => setNewAssetName(e.target.value)}
              className="col-span-3 rounded-md border border-input bg-card px-2 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <input
              type="number"
              placeholder="Value"
              value={newAssetVal}
              onChange={(e) => setNewAssetVal(e.target.value)}
              className="col-span-2 rounded-md border border-input bg-card px-2 py-1 text-right text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <button type="submit" className="col-span-5 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground font-semibold py-1 rounded text-xs transition-colors">
              + Add Asset Row
            </button>
          </form>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {assets.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs p-2 rounded bg-secondary/20 hover:bg-secondary/40">
                <span className="truncate max-w-[120px] font-medium">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold tabular-nums text-foreground">{formatCurrency(item.value)}</span>
                  <button onClick={() => handleRemoveAsset(idx)} className="text-destructive hover:text-destructive/80 font-bold px-1">
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Liabilities Form & List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide border-b border-border pb-2 flex justify-between">
            <span>Liabilities (-)</span>
            <span className="text-destructive">{formatCurrency(result.totalLiabilities)}</span>
          </h3>

          <form onSubmit={handleAddLiability} className="grid grid-cols-5 gap-2">
            <input
              type="text"
              placeholder="Liability description"
              value={newLiabilityName}
              onChange={(e) => setNewLiabilityName(e.target.value)}
              className="col-span-3 rounded-md border border-input bg-card px-2 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <input
              type="number"
              placeholder="Value"
              value={newLiabilityVal}
              onChange={(e) => setNewLiabilityVal(e.target.value)}
              className="col-span-2 rounded-md border border-input bg-card px-2 py-1 text-right text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <button type="submit" className="col-span-5 bg-secondary text-foreground hover:bg-destructive hover:text-destructive-foreground font-semibold py-1 rounded text-xs transition-colors">
              + Add Liability Row
            </button>
          </form>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {liabilities.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs p-2 rounded bg-secondary/20 hover:bg-secondary/40">
                <span className="truncate max-w-[120px] font-medium">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold tabular-nums text-foreground">{formatCurrency(item.value)}</span>
                  <button onClick={() => handleRemoveLiability(idx)} className="text-destructive hover:text-destructive/80 font-bold px-1">
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Net Worth Panel */}
        <div className="rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-center text-center">
          <span className="text-xs font-semibold tracking-wider text-muted uppercase">Your Net Worth</span>
          <p className={`mt-2 text-3xl sm:text-4xl font-heading font-extrabold tabular-nums ${
            result.netWorth >= 0 ? "text-accent" : "text-destructive"
          }`}>
            {formatCurrency(result.netWorth)}
          </p>
          <p className="text-xs text-muted mt-4 leading-relaxed">
            Net worth represents the total value of your financial assets minus your total outstanding debts.
          </p>
        </div>
      </div>
    </div>
  );
}
