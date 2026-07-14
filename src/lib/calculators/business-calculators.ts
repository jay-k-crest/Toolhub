/**
 * Business & Freelance Calculators Logic
 */

// 1. Freelance Rate
export interface FreelanceRateResult {
  hourlyRate: number;
  dailyRate: number;
  billableHoursPerYear: number;
}

export function calculateFreelanceRate(
  desiredIncome: number,
  annualExpenses: number,
  workWeeksPerYear: number = 48, // 4 weeks off
  hoursPerWeek: boolean = true, // true if hourly, false if daily
  workDaysPerWeek: number = 5,
  billablePercentage: number = 70 // 30% admin/overhead/meetings
): FreelanceRateResult {
  const totalNeeded = desiredIncome + annualExpenses;
  
  // Total work days in year
  const totalDays = workWeeksPerYear * workDaysPerWeek;
  // Billable days
  const billableDays = totalDays * (billablePercentage / 100);
  
  // Total hours (assuming 8 hours/day)
  const totalHours = totalDays * 8;
  const billableHours = totalHours * (billablePercentage / 100);

  const hourlyRate = Math.round(totalNeeded / Math.max(1, billableHours));
  const dailyRate = Math.round(totalNeeded / Math.max(1, billableDays));

  return {
    hourlyRate,
    dailyRate,
    billableHoursPerYear: Math.round(billableHours),
  };
}

// 2. Break-even Point
export interface BreakEvenResult {
  breakEvenUnits: number;
  breakEvenRevenue: number;
}

export function calculateBreakEven(
  fixedCosts: number,
  sellingPricePerUnit: number,
  variableCostPerUnit: number
): BreakEvenResult {
  const contributionMargin = sellingPricePerUnit - variableCostPerUnit;
  if (contributionMargin <= 0) {
    return { breakEvenUnits: 0, breakEvenRevenue: 0 };
  }

  const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);
  const breakEvenRevenue = breakEvenUnits * sellingPricePerUnit;

  return {
    breakEvenUnits,
    breakEvenRevenue,
  };
}

// 3. Profit Margin & Markup
export interface MarginMarkupResult {
  sellingPrice: number;
  profit: number;
  marginPct: number;
  markupPct: number;
}

export function calculateMarginAndMarkup(
  cost: number,
  sellingPrice: number | null,
  marginPct: number | null,
  markupPct: number | null
): MarginMarkupResult {
  let finalPrice = sellingPrice || 0;
  let profit = 0;
  let finalMargin = 0;
  let finalMarkup = 0;

  if (sellingPrice !== null && sellingPrice > 0) {
    profit = sellingPrice - cost;
    finalMargin = cost > 0 ? (profit / sellingPrice) * 100 : 100;
    finalMarkup = cost > 0 ? (profit / cost) * 100 : 100;
    finalPrice = sellingPrice;
  } else if (marginPct !== null && marginPct < 100) {
    // marginPct = (Price - Cost) / Price => Cost = Price * (1 - marginPct/100) => Price = Cost / (1 - marginPct/100)
    finalPrice = cost / (1 - marginPct / 100);
    profit = finalPrice - cost;
    finalMargin = marginPct;
    finalMarkup = cost > 0 ? (profit / cost) * 100 : 100;
  } else if (markupPct !== null) {
    // markupPct = (Price - Cost) / Cost => Price = Cost * (1 + markupPct/100)
    finalPrice = cost * (1 + markupPct / 100);
    profit = finalPrice - cost;
    finalMarkup = markupPct;
    finalMargin = finalPrice > 0 ? (profit / finalPrice) * 100 : 0;
  }

  return {
    sellingPrice: parseFloat(finalPrice.toFixed(2)),
    profit: parseFloat(profit.toFixed(2)),
    marginPct: parseFloat(finalMargin.toFixed(2)),
    markupPct: parseFloat(finalMarkup.toFixed(2)),
  };
}

// 4. ROI (Return on Investment)
export interface RoiResult {
  totalGain: number;
  netProfit: number;
  roiPct: number;
  annualizedRoiPct: number;
}

export function calculateROI(
  initialInvestment: number,
  finalValue: number,
  tenureYears: number = 1
): RoiResult {
  const netProfit = finalValue - initialInvestment;
  if (initialInvestment <= 0) {
    return { totalGain: finalValue, netProfit, roiPct: 0, annualizedRoiPct: 0 };
  }

  const roiPct = (netProfit / initialInvestment) * 100;
  
  // Annualized ROI = ((Final / Initial) ^ (1 / years) - 1) * 100
  let annualizedRoiPct = roiPct;
  if (tenureYears > 0) {
    annualizedRoiPct = (Math.pow(finalValue / initialInvestment, 1 / tenureYears) - 1) * 100;
  }

  return {
    totalGain: finalValue,
    netProfit,
    roiPct: parseFloat(roiPct.toFixed(2)),
    annualizedRoiPct: parseFloat(annualizedRoiPct.toFixed(2)),
  };
}

// 5. CAGR (Compound Annual Growth Rate)
export function calculateCAGR(
  startValue: number,
  endValue: number,
  years: number
): number {
  if (startValue <= 0 || endValue <= 0 || years <= 0) return 0;
  const cagr = Math.pow(endValue / startValue, 1 / years) - 1;
  return parseFloat((cagr * 100).toFixed(2));
}
