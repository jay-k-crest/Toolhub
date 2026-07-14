export interface PPFResult {
  totalInvestment: number;
  totalInterest: number;
  maturityAmount: number;
  schedule: Array<{
    year: number;
    openingBalance: number;
    deposit: number;
    interestEarned: number;
    closingBalance: number;
  }>;
}

export function calculatePPF(
  annualDeposit: number,
  interestRate: number = 7.1,
  tenureYears: number = 15
): PPFResult {
  const rate = interestRate / 100;
  let balance = 0;
  let totalInvestment = 0;
  const schedule = [];

  for (let year = 1; year <= tenureYears; year++) {
    const openingBalance = balance;
    const deposit = annualDeposit;
    totalInvestment += deposit;

    // PPF interest is calculated annually
    const interestEarned = (openingBalance + deposit) * rate;
    balance = openingBalance + deposit + interestEarned;

    schedule.push({
      year,
      openingBalance: Math.round(openingBalance),
      deposit: Math.round(deposit),
      interestEarned: Math.round(interestEarned),
      closingBalance: Math.round(balance),
    });
  }

  return {
    totalInvestment: Math.round(totalInvestment),
    totalInterest: Math.round(balance - totalInvestment),
    maturityAmount: Math.round(balance),
    schedule,
  };
}

export interface HRAResult {
  exemptHRA: number;
  taxableHRA: number;
  actualHraReceived: number;
  rentMinus10PercentBasic: number;
  percentBasicCap: number;
}

export function calculateHRA(
  basicSalaryAnnual: number,
  hraReceivedAnnual: number,
  rentPaidAnnual: number,
  isMetro: boolean = true
): HRAResult {
  const rentMinus10PercentBasic = Math.max(0, rentPaidAnnual - basicSalaryAnnual * 0.1);
  const percentBasicCap = basicSalaryAnnual * (isMetro ? 0.5 : 0.4);

  const exemptHRA = Math.min(
    hraReceivedAnnual,
    rentMinus10PercentBasic,
    percentBasicCap
  );

  const taxableHRA = Math.max(0, hraReceivedAnnual - exemptHRA);

  return {
    exemptHRA: Math.round(exemptHRA),
    taxableHRA: Math.round(taxableHRA),
    actualHraReceived: Math.round(hraReceivedAnnual),
    rentMinus10PercentBasic: Math.round(rentMinus10PercentBasic),
    percentBasicCap: Math.round(percentBasicCap),
  };
}

export interface GratuityResult {
  gratuityAmount: number;
  isEligible: boolean;
}

export function calculateGratuity(
  lastDrawnSalary: number, // Basic + DA
  yearsOfService: number,
  isCovered: boolean = true
): GratuityResult {
  const isEligible = yearsOfService >= 5;
  const factor = isCovered ? 26 : 30;
  const gratuityAmount = isEligible ? Math.round((15 * lastDrawnSalary * yearsOfService) / factor) : 0;

  return {
    gratuityAmount,
    isEligible,
  };
}

export interface EPFResult {
  employeeContribution: number;
  employerContribution: number;
  totalInterest: number;
  maturityAmount: number;
  schedule: Array<{
    year: number;
    openingBalance: number;
    employeeContributions: number;
    employerContributions: number;
    interestEarned: number;
    closingBalance: number;
  }>;
}

export function calculateEPF(
  monthlyBasic: number,
  employeeContributionPercent: number = 12,
  employerContributionPercent: number = 12,
  salaryGrowthPercent: number = 5,
  epfInterestRate: number = 8.15,
  tenureYears: number = 30
): EPFResult {
  let balance = 0;
  let currentMonthlyBasic = monthlyBasic;
  let totalEmployeeContrib = 0;
  let totalEmployerContrib = 0;
  const monthlyRate = epfInterestRate / 100 / 12;

  const schedule = [];

  for (let year = 1; year <= tenureYears; year++) {
    const openingBalance = balance;
    let yearEmployeeContrib = 0;
    let yearEmployerContrib = 0;
    let accumulatedInterest = 0;

    for (let month = 1; month <= 12; month++) {
      // Employee EPF = 12% of basic
      const empContrib = currentMonthlyBasic * (employeeContributionPercent / 100);
      
      // Employer EPF = 3.67% of basic (8.33% goes to EPS, capped at 15000 basic = 1250)
      const maxEpsBasic = 15000;
      const epsContrib = Math.min(currentMonthlyBasic, maxEpsBasic) * 0.0833;
      const totalEmployer12 = currentMonthlyBasic * (employerContributionPercent / 100);
      const empEPFContrib = Math.max(0, totalEmployer12 - epsContrib);

      balance += empContrib + empEPFContrib;
      yearEmployeeContrib += empContrib;
      yearEmployerContrib += empEPFContrib;
      
      // Interest is calculated monthly on the running balance
      accumulatedInterest += balance * monthlyRate;
    }

    balance += accumulatedInterest;
    totalEmployeeContrib += yearEmployeeContrib;
    totalEmployerContrib += yearEmployerContrib;

    schedule.push({
      year,
      openingBalance: Math.round(openingBalance),
      employeeContributions: Math.round(yearEmployeeContrib),
      employerContributions: Math.round(yearEmployerContrib),
      interestEarned: Math.round(accumulatedInterest),
      closingBalance: Math.round(balance),
    });

    // Apply annual salary increment
    currentMonthlyBasic = currentMonthlyBasic * (1 + salaryGrowthPercent / 100);
  }

  return {
    employeeContribution: Math.round(totalEmployeeContrib),
    employerContribution: Math.round(totalEmployerContrib),
    totalInterest: Math.round(balance - (totalEmployeeContrib + totalEmployerContrib)),
    maturityAmount: Math.round(balance),
    schedule,
  };
}

export interface CapitalGainsResult {
  gains: number;
  taxRate: number;
  taxAmount: number;
  netProfit: number;
  isLtcg: boolean;
}

export function calculateCapitalGains(
  buyPrice: number,
  sellPrice: number,
  quantity: number,
  assetType: "equity" | "debt" | "realestate",
  holdingPeriodMonths: number
): CapitalGainsResult {
  const gains = (sellPrice - buyPrice) * quantity;
  if (gains <= 0) {
    return { gains: Math.round(gains), taxRate: 0, taxAmount: 0, netProfit: Math.round(gains), isLtcg: false };
  }

  let isLtcg = false;
  let taxRate = 0;
  let exemption = 0;

  if (assetType === "equity") {
    isLtcg = holdingPeriodMonths > 12;
    // Current Indian budget rule: LTCG is 12.5% with 1.25L exemption, STCG is 20%
    taxRate = isLtcg ? 0.125 : 0.20;
    exemption = isLtcg ? 125000 : 0;
  } else if (assetType === "realestate") {
    isLtcg = holdingPeriodMonths > 24;
    // Current rule: LTCG is 12.5% without indexation, STCG at slab rates (approx. 30%)
    taxRate = isLtcg ? 0.125 : 0.30;
  } else {
    // Debt Mutual Funds
    isLtcg = holdingPeriodMonths > 36;
    // Debt gains taxed at slab rates (assume 30% for simple calculation)
    taxRate = 0.30;
  }

  const taxableGains = Math.max(0, gains - exemption);
  const taxAmount = taxableGains * taxRate;
  const netProfit = gains - taxAmount;

  return {
    gains: Math.round(gains),
    taxRate: taxRate * 100,
    taxAmount: Math.round(taxAmount),
    netProfit: Math.round(netProfit),
    isLtcg,
  };
}

export interface LoanEligibilityResult {
  maxEmiAllowed: number;
  eligibleLoanAmount: number;
}

export function calculateLoanEligibility(
  monthlyIncome: number,
  existingEmi: number,
  interestRatePercent: number = 8.5,
  tenureYears: number = 20,
  foirPercent: number = 50
): LoanEligibilityResult {
  const maxEmiAllowed = Math.max(0, monthlyIncome * (foirPercent / 100) - existingEmi);
  if (maxEmiAllowed <= 0) {
    return { maxEmiAllowed: 0, eligibleLoanAmount: 0 };
  }

  const r = interestRatePercent / 100 / 12;
  const n = tenureYears * 12;

  // Loan Amount = EMI * [(1 + r)^n - 1] / [r * (1 + r)^n]
  const eligibleLoanAmount = maxEmiAllowed * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));

  return {
    maxEmiAllowed: Math.round(maxEmiAllowed),
    eligibleLoanAmount: Math.round(eligibleLoanAmount),
  };
}

export interface LoanPrepaymentResult {
  originalTotalPayment: number;
  originalTotalInterest: number;
  newTotalPayment: number;
  newTotalInterest: number;
  interestSaved: number;
  monthsSaved: number;
  revisedTenureMonths: number;
  revisedEmi: number;
}

export function calculateLoanPrepayment(
  loanAmount: number,
  interestRatePercent: number,
  originalTenureYears: number,
  monthsPaid: number,
  prepaymentAmount: number,
  isReduceEmi: boolean = false
): LoanPrepaymentResult {
  const r = interestRatePercent / 100 / 12;
  const n = originalTenureYears * 12;

  // Calculate original EMI
  const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const originalTotalPayment = emi * n;
  const originalTotalInterest = originalTotalPayment - loanAmount;

  // Run amortization schedule until prepayment month
  let balance = loanAmount;
  let accumulatedPaid = 0;
  let accumulatedInterest = 0;

  for (let m = 1; m <= monthsPaid; m++) {
    const interestComponent = balance * r;
    const principalComponent = emi - interestComponent;
    balance -= principalComponent;
    accumulatedPaid += emi;
    accumulatedInterest += interestComponent;
  }

  // Apply prepayment
  balance = Math.max(0, balance - prepaymentAmount);
  
  let newTotalPayment = accumulatedPaid + prepaymentAmount;
  let newTotalInterest = accumulatedInterest;
  let revisedEmi = emi;
  let revisedTenureMonths = monthsPaid;
  let monthsSaved = 0;

  if (balance > 0) {
    if (isReduceEmi) {
      // Recalculate EMI for remaining tenure
      const remainingMonths = n - monthsPaid;
      revisedEmi = (balance * r * Math.pow(1 + r, remainingMonths)) / (Math.pow(1 + r, remainingMonths) - 1);
      
      const newFuturePayment = revisedEmi * remainingMonths;
      newTotalPayment += newFuturePayment;
      newTotalInterest += newFuturePayment - balance;
      revisedTenureMonths = n;
    } else {
      // Keep EMI same, reduce tenure
      let m = monthsPaid;
      while (balance > 0) {
        m++;
        const interestComponent = balance * r;
        newTotalInterest += interestComponent;
        
        if (balance + interestComponent <= emi) {
          newTotalPayment += balance + interestComponent;
          balance = 0;
        } else {
          newTotalPayment += emi;
          balance = balance + interestComponent - emi;
        }
      }
      revisedTenureMonths = m;
      monthsSaved = n - revisedTenureMonths;
    }
  }

  const interestSaved = Math.max(0, originalTotalInterest - newTotalInterest);

  return {
    originalTotalPayment: Math.round(originalTotalPayment),
    originalTotalInterest: Math.round(originalTotalInterest),
    newTotalPayment: Math.round(newTotalPayment),
    newTotalInterest: Math.round(newTotalInterest),
    interestSaved: Math.round(interestSaved),
    monthsSaved: Math.max(0, Math.round(monthsSaved)),
    revisedTenureMonths,
    revisedEmi: Math.round(revisedEmi),
  };
}

export interface CreditCardResult {
  monthsToPayoff: number;
  totalInterest: number;
  totalPayment: number;
  schedule: Array<{
    month: number;
    interestPaid: number;
    principalPaid: number;
    endingBalance: number;
  }>;
}

export function calculateCreditCardPayoff(
  balance: number,
  annualInterestRatePercent: number,
  monthlyPayment: number,
  monthlySpending: number = 0
): CreditCardResult {
  const monthlyRate = annualInterestRatePercent / 100 / 12;
  let currentBalance = balance;
  let totalInterest = 0;
  let totalPayment = 0;
  const schedule = [];
  let month = 0;

  // Max 600 months (50 years) loop to prevent infinite loops
  while (currentBalance > 0 && month < 600) {
    month++;
    const interest = currentBalance * monthlyRate;
    totalInterest += interest;
    
    // Total balance before payment
    const balanceBeforePayment = currentBalance + interest + monthlySpending;
    
    let payment = Math.min(monthlyPayment, balanceBeforePayment);
    if (payment < interest + monthlySpending && balanceBeforePayment > 0) {
      // Balance is growing, cannot payoff with this payment
      return {
        monthsToPayoff: -1, // Indicates infinite payoff time
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment),
        schedule: [],
      };
    }

    currentBalance = balanceBeforePayment - payment;
    totalPayment += payment;

    schedule.push({
      month,
      interestPaid: Math.round(interest),
      principalPaid: Math.round(payment - interest - monthlySpending),
      endingBalance: Math.round(currentBalance),
    });
  }

  return {
    monthsToPayoff: month,
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    schedule: schedule.slice(0, 12), // return first year monthly view
  };
}

export interface RentVsBuyResult {
  totalRentCost: number;
  totalBuyCost: number;
  isBuyingBetter: boolean;
  difference: number;
  propertyAppreciatedValue: number;
  schedule: Array<{
    year: number;
    cumulativeRent: number;
    cumulativeBuy: number;
    propertyValue: number;
  }>;
}

export function calculateRentVsBuy(
  propertyValue: number,
  monthlyRent: number,
  annualRentIncreasePercent: number = 5,
  loanInterestRatePercent: number = 8.5,
  loanTenureYears: number = 20,
  downPayment: number = 400000,
  annualAppreciationRatePercent: number = 5
): RentVsBuyResult {
  // Buying calculations
  const loanAmount = Math.max(0, propertyValue - downPayment);
  const r = loanInterestRatePercent / 100 / 12;
  const n = loanTenureYears * 12;
  const monthlyEmi = loanAmount > 0 ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;

  let totalBuyCost = downPayment + monthlyEmi * n; // Simple buy cost (ignoring registry/tax/maintenance for clear comparisons)
  let currentPropertyValue = propertyValue;

  // Renting calculations
  let totalRentCost = 0;
  let currentMonthlyRent = monthlyRent;

  const schedule = [];

  for (let year = 1; year <= loanTenureYears; year++) {
    // Annual rent paid
    const annualRentPaid = currentMonthlyRent * 12;
    totalRentCost += annualRentPaid;

    // Property appreciation
    currentPropertyValue = currentPropertyValue * (1 + annualAppreciationRatePercent / 100);

    // Yearly rent escalation
    currentMonthlyRent = currentMonthlyRent * (1 + annualRentIncreasePercent / 100);

    schedule.push({
      year,
      cumulativeRent: Math.round(totalRentCost),
      cumulativeBuy: Math.round(downPayment + (monthlyEmi * 12 * Math.min(year, loanTenureYears))),
      propertyValue: Math.round(currentPropertyValue),
    });
  }

  // Net buy cost accounts for asset equity value at end of tenure
  const netBuyCost = totalBuyCost - currentPropertyValue;
  const isBuyingBetter = netBuyCost < totalRentCost;
  const difference = Math.abs(totalRentCost - netBuyCost);

  return {
    totalRentCost: Math.round(totalRentCost),
    totalBuyCost: Math.round(totalBuyCost),
    isBuyingBetter,
    difference: Math.round(difference),
    propertyAppreciatedValue: Math.round(currentPropertyValue),
    schedule,
  };
}

export interface RetirementResult {
  inflationAdjustedExpense: number;
  retirementCorpusNeeded: number;
  monthlySipRequired: number;
}

export function calculateRetirementCorpus(
  currentAge: number,
  retirementAge: number,
  lifeExpectancy: number,
  currentMonthlyExpenses: number,
  inflationRate: number = 6,
  preRetireReturnPercent: number = 12,
  postRetireReturnPercent: number = 7
): RetirementResult {
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const yearsInRetirement = Math.max(0, lifeExpectancy - retirementAge);

  if (yearsToRetirement <= 0) {
    return { inflationAdjustedExpense: currentMonthlyExpenses, retirementCorpusNeeded: 0, monthlySipRequired: 0 };
  }

  // 1. Inflation-adjusted monthly expense at retirement
  const inflationAdjustedExpense = currentMonthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);

  // 2. Compute retirement corpus needed
  // Post-retirement inflation-adjusted return rate (Real Return Rate)
  const rPost = postRetireReturnPercent / 100;
  const inf = inflationRate / 100;
  const realReturnRate = (1 + rPost) / (1 + inf) - 1; // Fisher equation
  const monthlyRealReturn = realReturnRate / 12;
  const totalMonthsInRetirement = yearsInRetirement * 12;

  // Present Value of Annuity formula using real return rate
  let retirementCorpusNeeded = 0;
  if (monthlyRealReturn === 0) {
    retirementCorpusNeeded = inflationAdjustedExpense * totalMonthsInRetirement;
  } else {
    retirementCorpusNeeded = inflationAdjustedExpense * (1 - Math.pow(1 + monthlyRealReturn, -totalMonthsInRetirement)) / monthlyRealReturn;
    // Adjust for beginning-of-month withdrawals
    retirementCorpusNeeded = retirementCorpusNeeded * (1 + monthlyRealReturn);
  }

  // 3. Compute Monthly SIP needed to reach the corpus
  const rPre = preRetireReturnPercent / 100;
  const monthlyPreReturn = rPre / 12;
  const totalSipMonths = yearsToRetirement * 12;

  let monthlySipRequired = 0;
  if (monthlyPreReturn === 0) {
    monthlySipRequired = retirementCorpusNeeded / totalSipMonths;
  } else {
    // SIP Future Value formula: FV = P * [ (1+i)^n - 1 ] / i * (1+i)
    monthlySipRequired = retirementCorpusNeeded / (((Math.pow(1 + monthlyPreReturn, totalSipMonths) - 1) / monthlyPreReturn) * (1 + monthlyPreReturn));
  }

  return {
    inflationAdjustedExpense: Math.round(inflationAdjustedExpense),
    retirementCorpusNeeded: Math.round(retirementCorpusNeeded),
    monthlySipRequired: Math.round(monthlySipRequired),
  };
}

export interface NetWorthResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

export function calculateNetWorth(
  assets: Array<{ value: number }>,
  liabilities: Array<{ value: number }>
): NetWorthResult {
  const totalAssets = assets.reduce((sum, item) => sum + item.value, 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + item.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
  };
}

export interface IncomeTaxResult {
  regime: "old" | "new";
  grossIncome: number;
  standardDeduction: number;
  totalDeductions: number;
  taxableIncome: number;
  slabs: Array<{ slab: string; rate: number; tax: number }>;
  baseTax: number;
  rebate87A: number;
  taxAfterRebate: number;
  cess: number;
  totalTax: number;
}

export function calculateIncomeTax(
  grossIncome: number,
  regime: "new" | "old" = "new",
  deductions80C: number = 150000,
  hraExempt: number = 0,
  otherDeductions: number = 50000
): IncomeTaxResult {
  const standardDeduction = regime === "new" ? 75000 : 50000;
  let totalDeductions = standardDeduction;

  if (regime === "old") {
    totalDeductions += Math.min(150000, deductions80C) + hraExempt + otherDeductions;
  }

  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  let tax = 0;
  const slabs: Array<{ slab: string; rate: number; tax: number }> = [];

  if (regime === "new") {
    // New regime slabs FY 2025-26 & FY 2026-27
    // Up to 4L: Nil
    // 4L - 8L: 5%
    // 8L - 12L: 10%
    // 12L - 16L: 15%
    // 16L - 20L: 20%
    // 20L - 24L: 25%
    // Above 24L: 30%
    const limits = [400000, 800000, 1200000, 1600000, 2000000, 2400000];
    const rates = [0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30];
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
    if (taxableIncome > 2400000) {
      const slabTax = (taxableIncome - 2400000) * 0.30;
      tax += slabTax;
      slabs.push({
        slab: "Above ₹24L",
        rate: 30,
        tax: Math.round(slabTax),
      });
    }

    // Section 87A Rebate for New Regime:
    // Taxable income up to 12L gets 100% rebate (maximum ₹60,000 tax liability rebate)
    let rebate87A = 0;
    if (taxableIncome <= 1200000) {
      rebate87A = tax;
    }

    const taxAfterRebate = Math.max(0, tax - rebate87A);
    const cess = taxAfterRebate * 0.04;
    const totalTax = taxAfterRebate + cess;

    return {
      regime,
      grossIncome,
      standardDeduction,
      totalDeductions,
      taxableIncome: Math.round(taxableIncome),
      slabs,
      baseTax: Math.round(tax),
      rebate87A: Math.round(rebate87A),
      taxAfterRebate: Math.round(taxAfterRebate),
      cess: Math.round(cess),
      totalTax: Math.round(totalTax),
    };
  } else {
    // Old regime slabs (for under 60 years)
    // Up to 2.5L: Nil
    // 2.5L - 5L: 5%
    // 5L - 10L: 20%
    // Above 10L: 30%
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
        slab: "Above ₹10L",
        rate: 30,
        tax: Math.round(slabTax),
      });
    }

    // Section 87A Rebate for Old Regime:
    // Taxable income up to 5L gets rebate (maximum ₹12,500)
    let rebate87A = 0;
    if (taxableIncome <= 500000) {
      rebate87A = tax;
    }

    const taxAfterRebate = Math.max(0, tax - rebate87A);
    const cess = taxAfterRebate * 0.04;
    const totalTax = taxAfterRebate + cess;

    return {
      regime,
      grossIncome,
      standardDeduction,
      totalDeductions,
      taxableIncome: Math.round(taxableIncome),
      slabs,
      baseTax: Math.round(tax),
      rebate87A: Math.round(rebate87A),
      taxAfterRebate: Math.round(taxAfterRebate),
      cess: Math.round(cess),
      totalTax: Math.round(totalTax),
    };
  }
}

