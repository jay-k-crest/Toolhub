import React, { useState, useEffect } from "react";

const POPULAR_CURRENCIES = [
  { code: "USD", name: "US Dollar ($)" },
  { code: "INR", name: "Indian Rupee (₹)" },
  { code: "EUR", name: "Euro (€)" },
  { code: "GBP", name: "British Pound (£)" },
  { code: "AUD", name: "Australian Dollar (A$)" },
  { code: "CAD", name: "Canadian Dollar (C$)" },
  { code: "JPY", name: "Japanese Yen (¥)" },
  { code: "SGD", name: "Singapore Dollar (S$)" },
  { code: "AED", name: "UAE Dirham (AED)" },
  { code: "CNY", name: "Chinese Yuan (元)" },
];

// Fallback rates relative to USD if API fails
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.78,
  AUD: 1.51,
  CAD: 1.37,
  JPY: 158.2,
  SGD: 1.35,
  AED: 3.67,
  CNY: 7.26,
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("INR");
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchRates() {
      try {
        setLoading(true);
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        if (!res.ok) throw new Error("Failed to fetch exchange rates");
        const data = await res.json();
        
        if (data && data.rates) {
          setRates(data.rates);
          // format last updated time
          const dateStr = new Date(data.time_last_update_utc).toLocaleString();
          setLastUpdated(dateStr);
          setError("");
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.warn("Exchange rate API failed. Using fallback local rates.", err);
        setError("Unable to load real-time rates. Using local fallback values.");
        setRates(FALLBACK_RATES);
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, []);

  // Convert amount: From -> USD -> To
  const rateFromUsd = rates[fromCurrency] || FALLBACK_RATES[fromCurrency] || 1;
  const rateToUsd = rates[toCurrency] || FALLBACK_RATES[toCurrency] || 1;
  
  // amount in USD = amount / rateFromUsd
  // amount in Target = amountInUsd * rateToUsd
  const convertedValue = (amount / rateFromUsd) * rateToUsd;
  const exchangeRate = rateToUsd / rateFromUsd;

  const formatCurrency = (val: number, code: string) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: code,
        maximumFractionDigits: 2,
      }).format(val);
    } catch {
      return `${code} ${val.toFixed(2)}`;
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Inputs */}
        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label htmlFor="amount-input" className="text-sm font-medium text-foreground block">
              Enter Amount
            </label>
            <input
              id="amount-input"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="grid grid-cols-5 gap-2 items-center">
            {/* From Selector */}
            <div className="col-span-2 space-y-1">
              <label htmlFor="from-currency-select" className="text-xs font-semibold text-muted uppercase">From</label>
              <select
                id="from-currency-select"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full rounded-md border border-input bg-card px-2 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {POPULAR_CURRENCIES.map((cur) => (
                  <option key={cur.code} value={cur.code}>
                    {cur.code} - {cur.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="col-span-1 flex justify-center pt-5">
              <button
                onClick={handleSwap}
                title="Swap Currencies"
                className="h-8 w-8 rounded-full border border-border bg-secondary hover:bg-secondary/80 flex items-center justify-center text-foreground transition-colors"
              >
                ⇄
              </button>
            </div>

            {/* To Selector */}
            <div className="col-span-2 space-y-1">
              <label htmlFor="to-currency-select" className="text-xs font-semibold text-muted uppercase">To</label>
              <select
                id="to-currency-select"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full rounded-md border border-input bg-card px-2 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {POPULAR_CURRENCIES.map((cur) => (
                  <option key={cur.code} value={cur.code}>
                    {cur.code} - {cur.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Results Display */}
        <div className="rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase block">
                Converted Amount ({toCurrency})
              </span>
              <p className="mt-1 text-3xl sm:text-4xl font-heading font-extrabold text-accent tabular-nums">
                {formatCurrency(convertedValue, toCurrency)}
              </p>
            </div>

            <div className="border-t border-border pt-4 text-xs text-muted">
              <div className="flex justify-between">
                <span>Exchange Rate:</span>
                <span className="font-semibold text-foreground tabular-nums">
                  1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Status:</span>
                <span className="font-semibold text-foreground">
                  {loading ? "Fetching rates..." : error ? "Fallback rates active" : "Live rates active"}
                </span>
              </div>
              {lastUpdated && !loading && (
                <div className="flex justify-between mt-1">
                  <span>Last Updated (UTC):</span>
                  <span className="font-semibold text-foreground tabular-nums">{lastUpdated}</span>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-2 text-[10px] text-destructive leading-relaxed font-semibold">
                ⚠️ {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
