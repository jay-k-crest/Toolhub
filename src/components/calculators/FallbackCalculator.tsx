import React from "react";
import ScientificCalculator from "./ScientificCalculator";

interface FallbackCalculatorProps {
  name: string;
}

export default function FallbackCalculator({ name }: FallbackCalculatorProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="max-w-md mx-auto p-6 rounded-lg border border-border bg-card">
        <h3 className="text-lg font-heading font-bold text-foreground mb-2">
          {name} is Active
        </h3>
        <p className="text-sm text-muted mb-4 leading-relaxed">
          The full custom interface for {name} is being prepared. In the meantime, you can use our built-in utility calculator below to perform your equations:
        </p>
        <ScientificCalculator />
      </div>
    </div>
  );
}
