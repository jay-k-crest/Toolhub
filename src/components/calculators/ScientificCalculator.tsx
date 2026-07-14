import React, { useState } from "react";

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");

  const handleDigit = (digit: string) => {
    if (display === "0") {
      setDisplay(digit);
    } else {
      setDisplay(display + digit);
    }
    setEquation(equation + digit);
  };

  const handleOperator = (op: string) => {
    setDisplay("0");
    setEquation(equation + " " + op + " ");
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
  };

  const evaluateEquation = () => {
    try {
      // Basic expression parser that avoids eval()
      // For simplicity, we split and compute simple binary calculations or use a safe parser.
      // Let's implement a safe parser for basic arithmetic.
      const tokens = equation.trim().split(/\s+/);
      if (tokens.length === 0 || tokens[0] === "") return;

      let result = parseFloat(tokens[0]);
      for (let i = 1; i < tokens.length; i += 2) {
        const op = tokens[i];
        const val = parseFloat(tokens[i + 1]);
        if (isNaN(val)) break;

        if (op === "+") result += val;
        else if (op === "-") result -= val;
        else if (op === "*") result *= val;
        else if (op === "/") result = val !== 0 ? result / val : 0;
      }

      setDisplay(result.toString());
      setEquation(result.toString());
    } catch {
      setDisplay("Error");
      setEquation("");
    }
  };

  return (
    <div className="max-w-xs mx-auto p-4 border border-border rounded-xl bg-card shadow-sm">
      <div className="bg-secondary/40 border border-border rounded-lg p-3 text-right mb-4">
        <div className="text-xs text-muted h-4 overflow-hidden truncate">{equation || "0"}</div>
        <div className="text-2xl font-bold font-mono text-foreground truncate mt-1">{display}</div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button onClick={handleClear} className="col-span-2 p-3 text-sm font-bold bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors">C</button>
        <button onClick={() => handleOperator("/")} className="p-3 text-sm font-bold bg-secondary hover:bg-secondary/80 rounded-md text-foreground transition-colors">/</button>
        <button onClick={() => handleOperator("*")} className="p-3 text-sm font-bold bg-secondary hover:bg-secondary/80 rounded-md text-foreground transition-colors">*</button>

        {["7", "8", "9"].map(d => (
          <button key={d} onClick={() => handleDigit(d)} className="p-3 text-sm font-semibold bg-card border border-border hover:bg-secondary rounded-md text-foreground transition-colors">{d}</button>
        ))}
        <button onClick={() => handleOperator("-")} className="p-3 text-sm font-bold bg-secondary hover:bg-secondary/80 rounded-md text-foreground transition-colors">-</button>

        {["4", "5", "6"].map(d => (
          <button key={d} onClick={() => handleDigit(d)} className="p-3 text-sm font-semibold bg-card border border-border hover:bg-secondary rounded-md text-foreground transition-colors">{d}</button>
        ))}
        <button onClick={() => handleOperator("+")} className="p-3 text-sm font-bold bg-secondary hover:bg-secondary/80 rounded-md text-foreground transition-colors">+</button>

        {["1", "2", "3"].map(d => (
          <button key={d} onClick={() => handleDigit(d)} className="p-3 text-sm font-semibold bg-card border border-border hover:bg-secondary rounded-md text-foreground transition-colors">{d}</button>
        ))}
        <button onClick={evaluateEquation} className="row-span-2 p-3 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors">=</button>

        <button onClick={() => handleDigit("0")} className="col-span-2 p-3 text-sm font-semibold bg-card border border-border hover:bg-secondary rounded-md text-foreground transition-colors">0</button>
        <button onClick={() => handleDigit(".")} className="p-3 text-sm font-semibold bg-card border border-border hover:bg-secondary rounded-md text-foreground transition-colors">.</button>
      </div>
    </div>
  );
}
