import React, { useState, useEffect } from "react";
import { ArrowRightLeft, RefreshCw, TrendingUp, Sparkles, Check, Copy } from "lucide-react";

const CURRENCIES = [
  { code: "USD", name: "US Dollar ($)", symbol: "$" },
  { code: "INR", name: "Indian Rupee (₹)", symbol: "₹" },
  { code: "EUR", name: "Euro (€)", symbol: "€" },
  { code: "GBP", name: "British Pound (£)", symbol: "£" },
  { code: "AUD", name: "Australian Dollar (A$)", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar (C$)", symbol: "C$" },
  { code: "JPY", name: "Japanese Yen (¥)", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar (S$)", symbol: "S$" },
  { code: "AED", name: "UAE Dirham (AED)", symbol: "د.إ" },
  { code: "CNY", name: "Chinese Yuan (¥)", symbol: "¥" },
  { code: "CHF", name: "Swiss Franc (CHF)", symbol: "CHF" },
  { code: "HKD", name: "Hong Kong Dollar (HK$)", symbol: "HK$" },
  { code: "NZD", name: "New Zealand Dollar (NZ$)", symbol: "NZ$" },
  { code: "SEK", name: "Swedish Krona (kr)", symbol: "kr" },
  { code: "KRW", name: "South Korean Won (₩)", symbol: "₩" },
  { code: "THB", name: "Thai Baht (฿)", symbol: "฿" },
  { code: "MYR", name: "Malaysian Ringgit (RM)", symbol: "RM" },
  { code: "SAR", name: "Saudi Riyal (SAR)", symbol: "﷼" },
  { code: "BRL", name: "Brazilian Real (R$)", symbol: "R$" },
  { code: "ZAR", name: "South African Rand (R)", symbol: "R" },
  { code: "MXN", name: "Mexican Peso (Mex$)", symbol: "$" },
  { code: "IDR", name: "Indonesian Rupiah (Rp)", symbol: "Rp" },
  { code: "TRY", name: "Turkish Lira (₺)", symbol: "₺" },
  { code: "PHP", name: "Philippine Peso (₱)", symbol: "₱" },
  { code: "NOK", name: "Norwegian Krone (kr)", symbol: "kr" },
];

const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  INR: 83.54,
  EUR: 0.924,
  GBP: 0.789,
  AUD: 1.518,
  CAD: 1.372,
  JPY: 157.8,
  SGD: 1.352,
  AED: 3.673,
  CNY: 7.265,
  CHF: 0.902,
  HKD: 7.812,
  NZD: 1.638,
  SEK: 10.55,
  KRW: 1380.5,
  THB: 36.75,
  MYR: 4.71,
  SAR: 3.75,
  BRL: 5.42,
  ZAR: 18.25,
  MXN: 18.15,
  IDR: 16400,
  TRY: 32.85,
  PHP: 58.65,
  NOK: 10.62,
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(1000);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("INR");
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      if (!res.ok) throw new Error("Rates API unreachable");
      const data = await res.json();
      if (data && data.rates) {
        setRates(data.rates);
        const dt = new Date(data.time_last_update_utc || Date.now());
        setLastUpdated(dt.toLocaleDateString() + " " + dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }
    } catch {
      setRates(FALLBACK_RATES);
      setLastUpdated("Live fallback mode");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const rateFromUsd = rates[fromCurrency] || FALLBACK_RATES[fromCurrency] || 1;
  const rateToUsd = rates[toCurrency] || FALLBACK_RATES[toCurrency] || 1;
  const exchangeRate = rateToUsd / rateFromUsd;
  const convertedValue = (amount / rateFromUsd) * rateToUsd;

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(convertedValue.toFixed(2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border p-6 rounded-2xl shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* From */}
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="from-curr-sel" className="text-xs font-bold uppercase tracking-wider text-muted block">
              You Pay (From)
            </label>
            <select
              id="from-curr-sel"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              className="w-full rounded-lg border border-input bg-secondary/20 px-3.5 py-2.5 text-base font-bold font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Swap */}
          <div className="md:col-span-1 flex justify-center py-2 md:py-0">
            <button
              onClick={handleSwap}
              title="Swap currencies"
              className="h-11 w-11 rounded-full border border-border bg-secondary/50 hover:bg-primary hover:text-primary-foreground text-foreground flex items-center justify-center transition-all cursor-pointer shadow-xs hover:rotate-180 duration-200"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
          </div>

          {/* To */}
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="to-curr-sel" className="text-xs font-bold uppercase tracking-wider text-muted block">
              You Receive (To)
            </label>
            <select
              id="to-curr-sel"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
            <div className="w-full rounded-lg border border-input bg-primary/5 px-3.5 py-2.5 text-base font-bold font-mono text-primary flex items-center justify-between min-h-[46px]">
              <span className="truncate select-all">
                {convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
              </span>
              <button
                onClick={copyResult}
                className="shrink-0 p-1 rounded hover:bg-primary/10 transition-colors cursor-pointer text-muted hover:text-primary"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Live Rate Summary */}
        <div className="rounded-xl bg-secondary/30 border border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-0.5">
              Current Exchange Rate
            </span>
            <div className="text-sm font-semibold text-foreground">
              1 {fromCurrency} ={" "}
              <span className="font-mono text-primary font-bold">
                {exchangeRate.toFixed(4)}
              </span>{" "}
              {toCurrency}
            </div>
            {lastUpdated && (
              <span className="text-[10px] text-muted block mt-0.5">
                Market rates updated: {lastUpdated}
              </span>
            )}
          </div>
          <button
            onClick={fetchRates}
            disabled={loading}
            className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Rates
          </button>
        </div>
      </div>
    </div>
  );
}
