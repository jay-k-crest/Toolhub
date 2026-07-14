import React, { useState } from "react";
import { calculatePercentOf, calculatePercentIsOf, calculatePercentChange } from "../../lib/calculators/percentage-calculator";

export default function PercentageCalculator() {
  const [activeTab, setActiveTab] = useState<"of" | "isOf" | "change">("of");

  // Tab 1 state: What is X% of Y?
  const [percentOfX, setPercentOfX] = useState(15);
  const [percentOfY, setPercentOfY] = useState(200);

  // Tab 2 state: X is what % of Y?
  const [isOfX, setIsOfX] = useState(30);
  const [isOfY, setIsOfY] = useState(150);

  // Tab 3 state: % Increase/Decrease from X to Y
  const [changeX, setChangeX] = useState(100);
  const [changeY, setChangeY] = useState(125);

  const renderTabContent = () => {
    switch (activeTab) {
      case "of": {
        const result = calculatePercentOf(percentOfX, percentOfY);
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="percent-of-x" className="text-sm font-medium text-foreground">Percentage (%)</label>
                <input
                  id="percent-of-x"
                  type="number"
                  value={percentOfX}
                  onChange={(e) => setPercentOfX(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="percent-of-y" className="text-sm font-medium text-foreground">Total Value</label>
                <input
                  id="percent-of-y"
                  type="number"
                  value={percentOfY}
                  onChange={(e) => setPercentOfY(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="rounded-lg bg-secondary/35 border border-border p-4 mt-6 flex justify-between items-center">
              <div>
                <span className="text-xs text-muted block">Result:</span>
                <span className="text-xl font-bold text-foreground">
                  {percentOfX}% of {percentOfY} is:
                </span>
              </div>
              <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                {result.toFixed(2).replace(/\.00$/, "")}
              </span>
            </div>
          </div>
        );
      }
      case "isOf": {
        const result = calculatePercentIsOf(isOfX, isOfY);
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="isof-x" className="text-sm font-medium text-foreground">Value X</label>
                <input
                  id="isof-x"
                  type="number"
                  value={isOfX}
                  onChange={(e) => setIsOfX(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="isof-y" className="text-sm font-medium text-foreground">Value Y</label>
                <input
                  id="isof-y"
                  type="number"
                  value={isOfY}
                  onChange={(e) => setIsOfY(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="rounded-lg bg-secondary/35 border border-border p-4 mt-6 flex justify-between items-center">
              <div>
                <span className="text-xs text-muted block">Result:</span>
                <span className="text-xl font-bold text-foreground">
                  {isOfX} is what % of {isOfY}?
                </span>
              </div>
              <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                {result.toFixed(2).replace(/\.00$/, "")}%
              </span>
            </div>
          </div>
        );
      }
      case "change": {
        const result = calculatePercentChange(changeX, changeY);
        const isIncrease = result >= 0;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="change-x" className="text-sm font-medium text-foreground">Original Value</label>
                <input
                  id="change-x"
                  type="number"
                  value={changeX}
                  onChange={(e) => setChangeX(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="change-y" className="text-sm font-medium text-foreground">New Value</label>
                <input
                  id="change-y"
                  type="number"
                  value={changeY}
                  onChange={(e) => setChangeY(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="rounded-lg bg-secondary/35 border border-border p-4 mt-6 flex justify-between items-center">
              <div>
                <span className="text-xs text-muted block">Result:</span>
                <span className="text-xl font-bold text-foreground">
                  Percentage {isIncrease ? "Increase" : "Decrease"}:
                </span>
              </div>
              <span className={`text-3xl font-heading font-extrabold tabular-nums ${isIncrease ? "text-emerald-500" : "text-red-500"}`}>
                {isIncrease ? "+" : ""}{result.toFixed(2).replace(/\.00$/, "")}%
              </span>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub tabs selector */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("of")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "of" 
              ? "border-primary text-primary font-bold" 
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          Find X% of Y
        </button>
        <button
          onClick={() => setActiveTab("isOf")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "isOf" 
              ? "border-primary text-primary font-bold" 
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          X is what % of Y
        </button>
        <button
          onClick={() => setActiveTab("change")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "change" 
              ? "border-primary text-primary font-bold" 
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          % Increase/Decrease
        </button>
      </div>

      <div className="pt-2">
        {renderTabContent()}
      </div>
    </div>
  );
}
