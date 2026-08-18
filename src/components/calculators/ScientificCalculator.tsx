import React, { useState, useEffect } from "react";
import {
  evaluateScientificExpression,
  type AngleMode,
  type CalcHistoryItem,
} from "../../lib/calculators/scientific-calculator";
import { Copy, Check, RotateCcw, Delete, History } from "lucide-react";

export default function ScientificCalculator() {
  const [expression, setExpression] = useState("");
  const [displayValue, setDisplayValue] = useState("0");
  const [angleMode, setAngleMode] = useState<AngleMode>("deg");
  const [history, setHistory] = useState<CalcHistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleInput = (token: string) => {
    if (hasCalculated) {
      if (["+", "-", "×", "÷", "^", "%"].includes(token)) {
        setExpression(displayValue + token);
      } else {
        setExpression(token);
      }
      setHasCalculated(false);
    } else {
      setExpression((prev) => prev + token);
    }
  };

  const handleClear = () => {
    setExpression("");
    setDisplayValue("0");
    setHasCalculated(false);
  };

  const handleBackspace = () => {
    if (hasCalculated) {
      handleClear();
    } else {
      setExpression((prev) => prev.slice(0, -1));
    }
  };

  const handleEvaluate = () => {
    if (!expression.trim()) return;

    const { result, error } = evaluateScientificExpression(expression, angleMode);
    if (error) {
      setDisplayValue("Error");
    } else {
      const formatted = Number.isInteger(result)
        ? result.toString()
        : parseFloat(result.toFixed(8)).toString();

      setDisplayValue(formatted);
      setHasCalculated(true);

      const historyItem: CalcHistoryItem = {
        id: `${Date.now()}`,
        expression,
        result: formatted,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setHistory((prev) => [historyItem, ...prev.slice(0, 7)]);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(displayValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Calculator Main Unit */}
      <div className="bg-card border border-border rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
        {/* LCD Screen Display */}
        <div className="bg-secondary/40 border border-border rounded-xl p-4 text-right space-y-1">
          <div className="flex items-center justify-between text-xs text-muted mb-1 font-mono">
            <button
              onClick={() => setAngleMode((m) => (m === "deg" ? "rad" : "deg"))}
              className="px-2 py-0.5 rounded bg-card border border-border text-[10px] font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-secondary transition-colors"
            >
              {angleMode.toUpperCase()}
            </button>
            <div className="h-5 overflow-x-auto truncate max-w-[280px]">
              {expression || "0"}
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-foreground tracking-tight truncate select-all">
            {displayValue}
          </div>
        </div>

        {/* Function Keys Grid */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {/* Row 1: Scientific Specials */}
          <button
            onClick={() => handleInput("sin(")}
            className="p-2.5 sm:p-3 text-xs font-bold rounded-lg bg-secondary/60 hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            sin
          </button>
          <button
            onClick={() => handleInput("cos(")}
            className="p-2.5 sm:p-3 text-xs font-bold rounded-lg bg-secondary/60 hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            cos
          </button>
          <button
            onClick={() => handleInput("tan(")}
            className="p-2.5 sm:p-3 text-xs font-bold rounded-lg bg-secondary/60 hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            tan
          </button>
          <button
            onClick={() => handleInput("log(")}
            className="p-2.5 sm:p-3 text-xs font-bold rounded-lg bg-secondary/60 hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            log
          </button>
          <button
            onClick={() => handleInput("ln(")}
            className="p-2.5 sm:p-3 text-xs font-bold rounded-lg bg-secondary/60 hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            ln
          </button>

          {/* Row 2: Powers & Roots */}
          <button
            onClick={() => handleInput("sqrt(")}
            className="p-2.5 sm:p-3 text-xs font-bold rounded-lg bg-secondary/60 hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            √
          </button>
          <button
            onClick={() => handleInput("^")}
            className="p-2.5 sm:p-3 text-xs font-bold rounded-lg bg-secondary/60 hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            xʸ
          </button>
          <button
            onClick={() => handleInput("!")}
            className="p-2.5 sm:p-3 text-xs font-bold rounded-lg bg-secondary/60 hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            n!
          </button>
          <button
            onClick={() => handleInput("(")}
            className="p-2.5 sm:p-3 text-xs font-bold rounded-lg bg-secondary/60 hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            (
          </button>
          <button
            onClick={() => handleInput(")")}
            className="p-2.5 sm:p-3 text-xs font-bold rounded-lg bg-secondary/60 hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            )
          </button>

          {/* Row 3: Constants & Clears */}
          <button
            onClick={() => handleInput("π")}
            className="p-2.5 sm:p-3 text-xs font-bold rounded-lg bg-secondary/60 hover:bg-secondary text-foreground transition-all cursor-pointer font-serif"
          >
            π
          </button>
          <button
            onClick={() => handleInput("e")}
            className="p-2.5 sm:p-3 text-xs font-bold rounded-lg bg-secondary/60 hover:bg-secondary text-foreground transition-all cursor-pointer font-serif"
          >
            e
          </button>
          <button
            onClick={handleClear}
            className="p-2.5 sm:p-3 text-xs font-bold rounded-lg bg-destructive/15 hover:bg-destructive/25 text-destructive transition-all cursor-pointer"
          >
            AC
          </button>
          <button
            onClick={handleBackspace}
            className="p-2.5 sm:p-3 text-xs font-bold rounded-lg bg-secondary/80 hover:bg-secondary text-foreground transition-all cursor-pointer flex items-center justify-center"
          >
            <Delete className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleInput("÷")}
            className="p-2.5 sm:p-3 text-base font-bold rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all cursor-pointer"
          >
            ÷
          </button>

          {/* Row 4: 7, 8, 9, x, % */}
          <button
            onClick={() => handleInput("7")}
            className="p-3 sm:p-3.5 text-sm sm:text-base font-semibold rounded-lg bg-card border border-border hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            7
          </button>
          <button
            onClick={() => handleInput("8")}
            className="p-3 sm:p-3.5 text-sm sm:text-base font-semibold rounded-lg bg-card border border-border hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            8
          </button>
          <button
            onClick={() => handleInput("9")}
            className="p-3 sm:p-3.5 text-sm sm:text-base font-semibold rounded-lg bg-card border border-border hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            9
          </button>
          <button
            onClick={() => handleInput("×")}
            className="p-2.5 sm:p-3 text-base font-bold rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all cursor-pointer"
          >
            ×
          </button>
          <button
            onClick={() => handleInput("%")}
            className="p-2.5 sm:p-3 text-xs font-bold rounded-lg bg-secondary/60 hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            %
          </button>

          {/* Row 5: 4, 5, 6, - */}
          <button
            onClick={() => handleInput("4")}
            className="p-3 sm:p-3.5 text-sm sm:text-base font-semibold rounded-lg bg-card border border-border hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            4
          </button>
          <button
            onClick={() => handleInput("5")}
            className="p-3 sm:p-3.5 text-sm sm:text-base font-semibold rounded-lg bg-card border border-border hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            5
          </button>
          <button
            onClick={() => handleInput("6")}
            className="p-3 sm:p-3.5 text-sm sm:text-base font-semibold rounded-lg bg-card border border-border hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            6
          </button>
          <button
            onClick={() => handleInput("-")}
            className="p-2.5 sm:p-3 text-base font-bold rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all cursor-pointer"
          >
            −
          </button>
          <button
            onClick={copyResult}
            className="p-2.5 sm:p-3 text-xs font-bold rounded-lg bg-secondary/60 hover:bg-secondary text-foreground transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>

          {/* Row 6: 1, 2, 3, + */}
          <button
            onClick={() => handleInput("1")}
            className="p-3 sm:p-3.5 text-sm sm:text-base font-semibold rounded-lg bg-card border border-border hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            1
          </button>
          <button
            onClick={() => handleInput("2")}
            className="p-3 sm:p-3.5 text-sm sm:text-base font-semibold rounded-lg bg-card border border-border hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            2
          </button>
          <button
            onClick={() => handleInput("3")}
            className="p-3 sm:p-3.5 text-sm sm:text-base font-semibold rounded-lg bg-card border border-border hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            3
          </button>
          <button
            onClick={() => handleInput("+")}
            className="p-2.5 sm:p-3 text-base font-bold rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all cursor-pointer"
          >
            +
          </button>
          <button
            onClick={handleEvaluate}
            className="row-span-2 p-3 sm:p-4 text-lg font-extrabold rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground transition-all cursor-pointer flex items-center justify-center shadow-md shadow-primary/25"
          >
            =
          </button>

          {/* Row 7: 0, ., ± */}
          <button
            onClick={() => handleInput("0")}
            className="col-span-2 p-3 sm:p-3.5 text-sm sm:text-base font-semibold rounded-lg bg-card border border-border hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            0
          </button>
          <button
            onClick={() => handleInput(".")}
            className="p-3 sm:p-3.5 text-sm sm:text-base font-bold rounded-lg bg-card border border-border hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            .
          </button>
          <button
            onClick={() => {
              if (expression.startsWith("-")) setExpression(expression.slice(1));
              else setExpression("-" + expression);
            }}
            className="p-2.5 sm:p-3 text-xs font-bold rounded-lg bg-secondary/60 hover:bg-secondary text-foreground transition-all cursor-pointer"
          >
            ±
          </button>
        </div>
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-muted">
              <History className="h-3.5 w-3.5 text-primary" />
              Calculation History
            </span>
            <button
              onClick={() => setHistory([])}
              className="text-[11px] text-muted hover:text-destructive cursor-pointer"
            >
              Clear Log
            </button>
          </div>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {history.map((h) => (
              <div
                key={h.id}
                onClick={() => {
                  setExpression(h.expression);
                  setDisplayValue(h.result);
                }}
                className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 hover:bg-secondary/60 text-xs font-mono transition-colors cursor-pointer"
              >
                <span className="text-muted truncate max-w-[200px]">{h.expression}</span>
                <span className="font-bold text-primary">{h.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
