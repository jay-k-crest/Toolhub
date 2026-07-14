export interface SIPResult {
  totalInvestment: number;
  estimatedReturns: number;
  totalValue: number;
  yearlySchedule: Array<{
    year: number;
    investmentAmount: number;
    interestEarned: number;
    endingBalance: number;
  }>;
}

export function calculateSIP(
  monthlyInvestment: number,
  expectedReturnRate: number,
  tenureYears: number,
  stepUpPercent: number = 0
): SIPResult {
  const years = Math.max(1, Math.min(40, tenureYears));
  const rate = expectedReturnRate / 100;
  
  let currentMonthlyInvestment = monthlyInvestment;
  let totalValue = 0;
  let totalInvestment = 0;
  
  const yearlySchedule = [];
  let cumInvestment = 0;
  let cumInterest = 0;
  let balance = 0;

  for (let year = 1; year <= years; year++) {
    let yearInvestment = 0;
    let yearStartBalance = balance;

    // Monthly compounding calculations
    for (let month = 1; month <= 12; month++) {
      // SIP investment happens at the beginning of each month
      balance += currentMonthlyInvestment;
      yearInvestment += currentMonthlyInvestment;
      totalInvestment += currentMonthlyInvestment;

      // Apply 1 month of interest
      const monthlyRate = rate / 12;
      const interest = balance * monthlyRate;
      balance += interest;
    }

    const yearInterest = balance - yearStartBalance - yearInvestment;
    cumInvestment = totalInvestment;
    cumInterest = balance - totalInvestment;

    yearlySchedule.push({
      year,
      investmentAmount: Math.round(cumInvestment),
      interestEarned: Math.round(cumInterest),
      endingBalance: Math.round(balance),
    });

    // Apply step up at the end of the year
    if (stepUpPercent > 0) {
      currentMonthlyInvestment = currentMonthlyInvestment * (1 + stepUpPercent / 100);
    }
  }

  return {
    totalInvestment: Math.round(totalInvestment),
    estimatedReturns: Math.round(balance - totalInvestment),
    totalValue: Math.round(balance),
    yearlySchedule,
  };
}

export interface LumpsumResult {
  totalInvestment: number;
  estimatedReturns: number;
  totalValue: number;
  yearlySchedule: Array<{
    year: number;
    investmentAmount: number;
    interestEarned: number;
    endingBalance: number;
  }>;
}

export function calculateLumpsum(
  amount: number,
  expectedReturnRate: number,
  tenureYears: number
): LumpsumResult {
  const years = Math.max(1, Math.min(40, tenureYears));
  const rate = expectedReturnRate / 100;
  
  const yearlySchedule = [];
  let balance = amount;

  for (let year = 1; year <= years; year++) {
    balance = balance * (1 + rate);
    
    yearlySchedule.push({
      year,
      investmentAmount: amount,
      interestEarned: Math.round(balance - amount),
      endingBalance: Math.round(balance),
    });
  }

  return {
    totalInvestment: amount,
    estimatedReturns: Math.round(balance - amount),
    totalValue: Math.round(balance),
    yearlySchedule,
  };
}

export interface FDResult {
  principal: number;
  interestEarned: number;
  totalValue: number;
  schedule: Array<{
    year: number;
    interestEarned: number;
    endingBalance: number;
  }>;
}

export function calculateFD(
  principal: number,
  rate: number,
  tenureYears: number,
  compoundingFrequency: number = 4 // 4 = Quarterly, 1 = Annually, 12 = Monthly
): FDResult {
  const r = rate / 100;
  const n = compoundingFrequency;
  const t = tenureYears;
  
  const totalValue = principal * Math.pow(1 + r / n, n * t);
  const interestEarned = totalValue - principal;
  
  const schedule = [];
  for (let year = 1; year <= t; year++) {
    const yearEndBalance = principal * Math.pow(1 + r / n, n * year);
    schedule.push({
      year,
      interestEarned: Math.round(yearEndBalance - principal),
      endingBalance: Math.round(yearEndBalance),
    });
  }

  return {
    principal,
    interestEarned: Math.round(interestEarned),
    totalValue: Math.round(totalValue),
    schedule,
  };
}

export interface RDResult {
  totalInvestment: number;
  interestEarned: number;
  totalValue: number;
  schedule: Array<{
    month: number;
    investmentAmount: number;
    interestEarned: number;
    endingBalance: number;
  }>;
}

export function calculateRD(
  monthlyInvestment: number,
  rate: number,
  tenureMonths: number
): RDResult {
  const r = rate / 100;
  const schedule = [];
  let balance = 0;
  let totalInvestment = 0;
  let accruedInterest = 0;

  for (let m = 1; m <= tenureMonths; m++) {
    balance += monthlyInvestment;
    totalInvestment += monthlyInvestment;
    
    const monthlyRate = r / 12;
    accruedInterest += balance * monthlyRate;

    schedule.push({
      month: m,
      investmentAmount: totalInvestment,
      interestEarned: Math.round(accruedInterest),
      endingBalance: Math.round(totalInvestment + accruedInterest),
    });
  }

  return {
    totalInvestment,
    interestEarned: Math.round(accruedInterest),
    totalValue: Math.round(totalInvestment + accruedInterest),
    schedule: schedule.filter((_, idx) => (idx + 1) % 12 === 0 || idx === tenureMonths - 1),
  };
}

export interface InflationResult {
  initialValue: number;
  adjustedValue: number;
  difference: number;
  schedule: Array<{
    year: number;
    value: number;
  }>;
}

export function calculateInflation(
  amount: number,
  rate: number,
  years: number,
  isFuture: boolean = true
): InflationResult {
  const r = rate / 100;
  let adjustedValue = amount;
  
  const schedule = [];
  for (let year = 1; year <= years; year++) {
    if (isFuture) {
      adjustedValue = amount * Math.pow(1 + r, year);
    } else {
      adjustedValue = amount / Math.pow(1 + r, year);
    }
    schedule.push({
      year,
      value: Math.round(adjustedValue),
    });
  }

  return {
    initialValue: amount,
    adjustedValue: Math.round(adjustedValue),
    difference: Math.round(Math.abs(adjustedValue - amount)),
    schedule,
  };
}

export interface TaxBreakdown {
  regime: "old" | "new";
  grossSalary: number;
  deductions: number;
  taxableIncome: number;
  slabs: Array<{ slab: string; rate: number; tax: number }>;
  cess: number;
  totalTax: number;
  takeHomeMonthly: number;
}

export function calculateSalaryInHand(
  ctc: number,
  basicPercent: number = 50,
  professionalTax: number = 200,
  regime: "old" | "new" = "new",
  deductions80C: number = 150000,
  otherDeductions: number = 50000
): TaxBreakdown {
  const basic = ctc * (basicPercent / 100);
  
  const employeePF = basic * 0.12;
  const employerPF = basic * 0.12;

  const grossSalary = ctc - employerPF;

  const standardDeduction = regime === "new" ? 75000 : 50000;
  
  let totalDeductions = standardDeduction;
  if (regime === "old") {
    totalDeductions += Math.min(150000, deductions80C) + otherDeductions;
  }
  
  const taxableIncome = Math.max(0, grossSalary - totalDeductions);

  let tax = 0;
  const slabs: Array<{ slab: string; rate: number; tax: number }> = [];

  if (regime === "new") {
    const limits = [300000, 600000, 900000, 1200000, 1500000];
    const rates = [0, 0.05, 0.10, 0.15, 0.20, 0.30];
    let prevLimit = 0;

    for (let i = 0; i < limits.length; i++) {
      const limit = limits[i];
      if (taxableIncome > prevLimit) {
        const taxableAmtInSlab = Math.min(taxableIncome, limit) - prevLimit;
        const slabTax = taxableAmtInSlab * rates[i];
        tax += slabTax;
        slabs.push({
          slab: `₹${prevLimit / 100000}L - ₹${limit / 100000}L`,
          rate: rates[i] * 100,
          tax: Math.round(slabTax),
        });
        prevLimit = limit;
      }
    }
    if (taxableIncome > 1500000) {
      const slabTax = (taxableIncome - 1500000) * 0.30;
      tax += slabTax;
      slabs.push({
        slab: `Above ₹15L`,
        rate: 30,
        tax: Math.round(slabTax),
      });
    }

    if (taxableIncome <= 700000) {
      tax = 0;
      slabs.forEach(s => s.tax = 0);
    }
  } else {
    const limits = [250000, 500000, 1000000];
    const rates = [0, 0.05, 0.20, 0.30];
    let prevLimit = 0;

    for (let i = 0; i < limits.length; i++) {
      const limit = limits[i];
      if (taxableIncome > prevLimit) {
        const taxableAmtInSlab = Math.min(taxableIncome, limit) - prevLimit;
        const slabTax = taxableAmtInSlab * rates[i];
        tax += slabTax;
        slabs.push({
          slab: `₹${prevLimit / 100000}L - ₹${limit / 100000}L`,
          rate: rates[i] * 100,
          tax: Math.round(slabTax),
        });
        prevLimit = limit;
      }
    }
    if (taxableIncome > 1000000) {
      const slabTax = (taxableIncome - 1000000) * 0.30;
      tax += slabTax;
      slabs.push({
        slab: `Above ₹10L`,
        rate: 30,
        tax: Math.round(slabTax),
      });
    }

    if (taxableIncome <= 500000) {
      tax = 0;
      slabs.forEach(s => s.tax = 0);
    }
  }

  const cess = tax * 0.04;
  const totalTax = tax + cess;

  const monthlyGross = grossSalary / 12;
  const monthlyPF = employeePF / 12;
  const monthlyTax = totalTax / 12;
  const monthlyPT = professionalTax;

  const takeHomeMonthly = Math.max(0, monthlyGross - monthlyPF - monthlyTax - monthlyPT);

  return {
    regime,
    grossSalary,
    deductions: totalDeductions,
    taxableIncome,
    slabs,
    cess: Math.round(cess),
    totalTax: Math.round(totalTax),
    takeHomeMonthly: Math.round(takeHomeMonthly),
  };
}

export function calculateGST(
  amount: number,
  rate: number,
  isInclusive: boolean = false
): {
  originalAmount: number;
  gstAmount: number;
  finalAmount: number;
} {
  if (isInclusive) {
    const originalAmount = amount * (100 / (100 + rate));
    const gstAmount = amount - originalAmount;
    return {
      originalAmount: parseFloat(originalAmount.toFixed(2)),
      gstAmount: parseFloat(gstAmount.toFixed(2)),
      finalAmount: amount,
    };
  } else {
    const gstAmount = amount * (rate / 100);
    const finalAmount = amount + gstAmount;
    return {
      originalAmount: amount,
      gstAmount: parseFloat(gstAmount.toFixed(2)),
      finalAmount: parseFloat(finalAmount.toFixed(2)),
    };
  }
}
