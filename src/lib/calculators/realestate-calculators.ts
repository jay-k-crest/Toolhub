/**
 * Real Estate Calculators Logic
 */

// 1. Home Loan Affordability (Reverse EMI)
export interface AffordabilityResult {
  maxLoanAmount: number;
  maxPropertyPrice: number;
  downPaymentNeeded: number;
  monthlyEMI: number;
}

export function calculateHomeAffordability(
  monthlyIncome: number,
  interestRateAnnual: number,
  tenureYears: number,
  existingEMIs: number = 0,
  foirPct: number = 45, // Fixed Obligation to Income Ratio
  downPaymentPct: number = 20
): AffordabilityResult {
  const r = interestRateAnnual / 12 / 100;
  const n = tenureYears * 12;

  // Max EMI borrower can pay
  const maxEMI = (monthlyIncome * (foirPct / 100)) - existingEMIs;
  const monthlyEMI = Math.max(0, maxEMI);

  if (monthlyEMI <= 0 || r <= 0 || n <= 0) {
    return { maxLoanAmount: 0, maxPropertyPrice: 0, downPaymentNeeded: 0, monthlyEMI: 0 };
  }

  // Reverse EMI formula: P = EMI * [ (1+r)^n - 1 ] / [ r * (1+r)^n ]
  const num = Math.pow(1 + r, n) - 1;
  const den = r * Math.pow(1 + r, n);
  const maxLoanAmount = Math.round(monthlyEMI * (num / den));

  // Max property price = Loan / (1 - downPaymentPct/100)
  const maxPropertyPrice = Math.round(maxLoanAmount / (1 - downPaymentPct / 100));
  const downPaymentNeeded = Math.round(maxPropertyPrice * (downPaymentPct / 100));

  return {
    maxLoanAmount,
    maxPropertyPrice,
    downPaymentNeeded,
    monthlyEMI: Math.round(monthlyEMI),
  };
}

// 2. Stamp Duty Calculator
export const stateStampDutyRates: Record<string, { male: number; female: number; joint: number }> = {
  maharashtra: { male: 6, female: 5, joint: 5.5 },
  karnataka: { male: 5, female: 5, joint: 5 },
  delhi: { male: 6, female: 4, joint: 5 },
  tamilnadu: { male: 7, female: 7, joint: 7 },
  telangana: { male: 5.5, female: 5.5, joint: 5.5 },
  uttarpradesh: { male: 7, female: 6, joint: 6.5 },
  custom: { male: 5, female: 5, joint: 5 }
};

export function calculateStampDuty(
  propertyValue: number,
  stateKey: string,
  gender: "male" | "female" | "joint",
  customRatePct: number = 5
): { stampDuty: number; registrationFee: number; totalCost: number } {
  let rate = customRatePct;
  const stateData = stateStampDutyRates[stateKey.toLowerCase()];
  if (stateData) {
    rate = stateData[gender] || stateData.male;
  }

  const stampDuty = Math.round(propertyValue * (rate / 100));
  // Registration fee is typically 1% of property value, capped at standard thresholds or just flat 1% in most places
  const registrationFee = Math.round(Math.min(30000, propertyValue * 0.01));
  const totalCost = propertyValue + stampDuty + registrationFee;

  return {
    stampDuty,
    registrationFee,
    totalCost,
  };
}

// 3. Property Tax
export function calculatePropertyTax(
  propertyValue: number,
  taxRatePct: number = 0.5,
  rebatePct: number = 0
): { annualTax: number; rebateAmount: number; finalTax: number } {
  const annualTax = propertyValue * (taxRatePct / 100);
  const rebateAmount = annualTax * (rebatePct / 100);
  const finalTax = Math.max(0, annualTax - rebateAmount);

  return {
    annualTax: Math.round(annualTax),
    rebateAmount: Math.round(rebateAmount),
    finalTax: Math.round(finalTax),
  };
}

// 4. Rental Yield
export interface RentalYieldResult {
  grossYield: number;
  netYield: number;
  annualRent: number;
  netAnnualIncome: number;
}

export function calculateRentalYield(
  propertyValue: number,
  monthlyRent: number,
  annualExpenses: number = 0
): RentalYieldResult {
  const annualRent = monthlyRent * 12;
  const netAnnualIncome = annualRent - annualExpenses;

  if (propertyValue <= 0) {
    return { grossYield: 0, netYield: 0, annualRent: 0, netAnnualIncome: 0 };
  }

  const grossYield = parseFloat(((annualRent / propertyValue) * 100).toFixed(2));
  const netYield = parseFloat(((netAnnualIncome / propertyValue) * 100).toFixed(2));

  return {
    grossYield,
    netYield,
    annualRent,
    netAnnualIncome,
  };
}
