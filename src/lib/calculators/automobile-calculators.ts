/**
 * Automobile & Travel Calculators Logic
 */

// 1. Car Loan EMI Calculator
export interface CarLoanResult {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  loanAmount: number;
}

export function calculateCarLoanEMI(
  onRoadPrice: number,
  downPayment: number,
  interestRateAnnual: number,
  tenureYears: number
): CarLoanResult {
  const loanAmount = Math.max(0, onRoadPrice - downPayment);
  const r = interestRateAnnual / 12 / 100;
  const n = tenureYears * 12;

  if (loanAmount <= 0 || r <= 0 || n <= 0) {
    return { monthlyEMI: 0, totalInterest: 0, totalPayment: 0, loanAmount };
  }

  // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyEMI = Math.round((loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  const totalPayment = monthlyEMI * n;
  const totalInterest = totalPayment - loanAmount;

  return {
    monthlyEMI,
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    loanAmount,
  };
}

// 2. Fuel Cost Calculator
export interface FuelCostResult {
  totalFuelLiters: number;
  totalCost: number;
  costPerKm: number;
}

export function calculateFuelCost(
  distanceKm: number,
  mileageKmpl: number,
  fuelPricePerLiter: number
): FuelCostResult {
  if (mileageKmpl <= 0) return { totalFuelLiters: 0, totalCost: 0, costPerKm: 0 };

  const totalFuelLiters = distanceKm / mileageKmpl;
  const totalCost = totalFuelLiters * fuelPricePerLiter;
  const costPerKm = fuelPricePerLiter / mileageKmpl;

  return {
    totalFuelLiters: parseFloat(totalFuelLiters.toFixed(2)),
    totalCost: Math.round(totalCost),
    costPerKm: parseFloat(costPerKm.toFixed(2)),
  };
}

// 3. Car Depreciation (Declining Balance Method)
export interface DepreciationScheduleEntry {
  year: number;
  depreciationAmount: number;
  endingValue: number;
}

export function calculateCarDepreciation(
  purchasePrice: number,
  depreciationRatePct: number = 15,
  years: number = 5
): {
  finalValue: number;
  totalDepreciation: number;
  schedule: DepreciationScheduleEntry[];
} {
  const schedule: DepreciationScheduleEntry[] = [];
  let currentValue = purchasePrice;
  const rate = depreciationRatePct / 100;

  for (let year = 1; year <= years; year++) {
    const depAmt = currentValue * rate;
    const endingValue = currentValue - depAmt;
    
    schedule.push({
      year,
      depreciationAmount: Math.round(depAmt),
      endingValue: Math.round(endingValue),
    });

    currentValue = endingValue;
  }

  return {
    finalValue: Math.round(currentValue),
    totalDepreciation: Math.round(purchasePrice - currentValue),
    schedule,
  };
}
