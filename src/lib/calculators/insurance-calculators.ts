/**
 * Insurance & IDV Calculators Logic
 */

// 1. Term Insurance Premium Estimator
export interface TermInsuranceResult {
  estimatedAnnualPremium: number;
  estimatedMonthlyPremium: number;
  sumAssured: number;
}

export function calculateTermInsurance(
  age: number,
  sumAssured: number,
  termYears: number,
  isSmoker: boolean = false,
  gender: "male" | "female" = "male"
): TermInsuranceResult {
  // Base premium rate per 1 Lakh of sum assured
  let baseRate = 8.5; // at age 25

  if (age > 25) {
    // Increase rate by 7% per year of age above 25
    baseRate = baseRate * Math.pow(1.07, age - 25);
  } else if (age < 25) {
    baseRate = baseRate * Math.pow(0.97, 25 - age);
  }

  // Smoker surcharge: +60%
  if (isSmoker) {
    baseRate *= 1.6;
  }

  // Female discount: -10%
  if (gender === "female") {
    baseRate *= 0.9;
  }

  // Term discount/surcharge: longer term slightly increases risk factor
  if (termYears > 20) {
    baseRate *= (1 + (termYears - 20) * 0.015);
  }

  const lakhs = sumAssured / 100000;
  const annualPremium = Math.round(baseRate * lakhs);
  const monthlyPremium = Math.round(annualPremium / 12);

  return {
    estimatedAnnualPremium: annualPremium,
    estimatedMonthlyPremium: monthlyPremium,
    sumAssured,
  };
}

// 2. Life Insurance Coverage (Human Life Value Method)
export interface HlvResult {
  requiredCoverage: number;
  incomeReplacementNeeds: number;
  totalLiabilities: number;
}

export function calculateHLV(
  annualIncome: number,
  yearsToRetire: number,
  existingCoverage: number = 0,
  outstandingLiabilities: number = 0,
  monthlyExpensesToReplacePct: number = 75
): HlvResult {
  // Human Life Value = Income to be replaced over remaining working years
  const incomeReplacementNeeds = annualIncome * (monthlyExpensesToReplacePct / 100) * yearsToRetire;
  const grossNeeds = incomeReplacementNeeds + outstandingLiabilities;
  const requiredCoverage = Math.max(0, grossNeeds - existingCoverage);

  return {
    requiredCoverage,
    incomeReplacementNeeds,
    totalLiabilities: outstandingLiabilities,
  };
}

// 3. Car Insurance IDV (Insured Declared Value)
export function calculateCarIDV(
  exShowroomPrice: number,
  vehicleAgeYears: number
): { idv: number; depreciationPct: number; depreciationAmount: number } {
  let depreciationPct = 5;

  if (vehicleAgeYears <= 0.5) {
    depreciationPct = 5;
  } else if (vehicleAgeYears <= 1.0) {
    depreciationPct = 15;
  } else if (vehicleAgeYears <= 2.0) {
    depreciationPct = 20;
  } else if (vehicleAgeYears <= 3.0) {
    depreciationPct = 30;
  } else if (vehicleAgeYears <= 4.0) {
    depreciationPct = 40;
  } else if (vehicleAgeYears <= 5.0) {
    depreciationPct = 50;
  } else {
    // 5+ years: Mutual agreement, standard is 55% to 60%
    depreciationPct = 55 + Math.min(20, (vehicleAgeYears - 5) * 5);
  }

  depreciationPct = Math.min(90, depreciationPct);
  const depreciationAmount = Math.round(exShowroomPrice * (depreciationPct / 100));
  const idv = Math.round(exShowroomPrice - depreciationAmount);

  return {
    idv,
    depreciationPct,
    depreciationAmount,
  };
}

// 4. Health Insurance Coverage Estimator
export interface HealthCoverageResult {
  recommendedSumInsured: number;
  estimatedAnnualPremium: number;
}

export function calculateHealthCoverage(
  cityTier: 1 | 2 | 3,
  familySize: {
    self: boolean;
    spouse: boolean;
    childrenCount: number;
    parentsCount: number;
  },
  maxAgeOfMember: number
): HealthCoverageResult {
  // Base coverage values in Lakhs
  let baseSum = 500000; // 5 Lakh

  if (familySize.spouse) baseSum += 200000;
  baseSum += (familySize.childrenCount * 100000);
  baseSum += (familySize.parentsCount * 300000);

  // Apply City Tier multiplier (tier 1: costly medical bills)
  let tierMultiplier = 1.0;
  if (cityTier === 1) tierMultiplier = 1.25;
  else if (cityTier === 2) tierMultiplier = 1.1;

  // Apply Age factor
  let ageMultiplier = 1.0;
  if (maxAgeOfMember > 60) ageMultiplier = 1.5;
  else if (maxAgeOfMember > 45) ageMultiplier = 1.25;

  const recommendedSumInsured = Math.round(baseSum * tierMultiplier * ageMultiplier);

  // Rough premium multiplier per 1 Lakh of sum insured
  let premiumRate = 1800; // base rate
  if (maxAgeOfMember > 60) premiumRate = 4500;
  else if (maxAgeOfMember > 45) premiumRate = 2800;

  const estimatedAnnualPremium = Math.round((recommendedSumInsured / 100000) * premiumRate * (familySize.self ? 1.0 : 0.8));

  return {
    recommendedSumInsured,
    estimatedAnnualPremium,
  };
}
