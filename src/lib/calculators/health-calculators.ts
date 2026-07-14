/**
 * Health & Fitness Calculators Logic
 */

// 1. Calorie Needs (BMR & TDEE)
export interface CalorieResult {
  bmr: number;
  tdee: number;
  goals: {
    maintain: number;
    mildLoss: number; // -250 kcal
    weightLoss: number; // -500 kcal
    extremeLoss: number; // -1000 kcal
    mildGain: number; // +250 kcal
    weightGain: number; // +500 kcal
  };
}

export function calculateCalories(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: "male" | "female",
  activityLevel: number // 1.2 (sedentary) to 1.9 (extra active)
): CalorieResult {
  // Mifflin-St Jeor Equation
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  if (gender === "male") {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  const tdee = bmr * activityLevel;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    goals: {
      maintain: Math.round(tdee),
      mildLoss: Math.max(1200, Math.round(tdee - 250)),
      weightLoss: Math.max(1200, Math.round(tdee - 500)),
      extremeLoss: Math.max(1000, Math.round(tdee - 1000)),
      mildGain: Math.round(tdee + 250),
      weightGain: Math.round(tdee + 500),
    },
  };
}

// 2. Body Fat % (US Navy Method)
export interface BodyFatResult {
  bodyFatPercentage: number;
  fatMass: number;
  leanMass: number;
  category: string;
}

export function calculateBodyFat(
  gender: "male" | "female",
  heightCm: number,
  neckCm: number,
  waistCm: number,
  hipCm?: number, // Required for female
  weightKg?: number
): BodyFatResult {
  let bfp = 0;

  if (gender === "male") {
    // US Navy Formula for Men (all in cm, using log10)
    bfp = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
  } else {
    // US Navy Formula for Women
    const hip = hipCm || 90;
    bfp = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hip - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
  }

  bfp = Math.max(2, Math.min(60, bfp)); // Sanity limits
  const bodyFatPercentage = parseFloat(bfp.toFixed(1));

  let fatMass = 0;
  let leanMass = 0;
  if (weightKg) {
    fatMass = parseFloat((weightKg * (bodyFatPercentage / 100)).toFixed(1));
    leanMass = parseFloat((weightKg - fatMass).toFixed(1));
  }

  // Categories
  let category = "Normal";
  if (gender === "male") {
    if (bfp < 6) category = "Essential fat";
    else if (bfp < 14) category = "Athletes";
    else if (bfp < 18) category = "Fitness";
    else if (bfp < 25) category = "Average";
    else category = "Obese";
  } else {
    if (bfp < 14) category = "Essential fat";
    else if (bfp < 21) category = "Athletes";
    else if (bfp < 25) category = "Fitness";
    else if (bfp < 32) category = "Average";
    else category = "Obese";
  }

  return {
    bodyFatPercentage,
    fatMass,
    leanMass,
    category,
  };
}

// 3. Ideal Weight (Devine, Robinson, Miller formulas)
export interface IdealWeightResult {
  devine: number;
  robinson: number;
  miller: number;
  healthyRangeMin: number;
  healthyRangeMax: number;
}

export function calculateIdealWeight(gender: "male" | "female", heightCm: number): IdealWeightResult {
  const inchesOver5Ft = Math.max(0, (heightCm / 2.54) - 60);

  let devine = 0;
  let robinson = 0;
  let miller = 0;

  if (gender === "male") {
    devine = 50.0 + 2.3 * inchesOver5Ft;
    robinson = 52.0 + 1.9 * inchesOver5Ft;
    miller = 56.2 + 1.41 * inchesOver5Ft;
  } else {
    devine = 45.5 + 2.3 * inchesOver5Ft;
    robinson = 49.0 + 1.7 * inchesOver5Ft;
    miller = 53.1 + 1.36 * inchesOver5Ft;
  }

  // Healthy range based on BMI 18.5 to 24.9
  const heightMeters = heightCm / 100;
  const healthyRangeMin = 18.5 * (heightMeters * heightMeters);
  const healthyRangeMax = 24.9 * (heightMeters * heightMeters);

  return {
    devine: parseFloat(devine.toFixed(1)),
    robinson: parseFloat(robinson.toFixed(1)),
    miller: parseFloat(miller.toFixed(1)),
    healthyRangeMin: parseFloat(healthyRangeMin.toFixed(1)),
    healthyRangeMax: parseFloat(healthyRangeMax.toFixed(1)),
  };
}

// 4. Water Intake
export function calculateWaterIntake(weightKg: number, exerciseMinutes: number = 0): { liters: number; ounces: number } {
  // Base requirement: 33ml per kg of body weight
  let ml = weightKg * 33;
  // Add 350ml for every 30 minutes of exercise
  ml += (exerciseMinutes / 30) * 350;

  const liters = parseFloat((ml / 1000).toFixed(2));
  const ounces = parseFloat((ml * 0.033814).toFixed(1));

  return { liters, ounces };
}

// 5. Pregnancy Due Date (Naegele's Rule)
export interface PregnancyResult {
  dueDate: Date;
  daysRemaining: number;
  gestationalAgeWeeks: number;
  gestationalAgeDays: number;
  trimester: number;
}

export function calculatePregnancyDueDate(lmpDate: Date): PregnancyResult {
  const today = new Date();
  // Naegele's rule: LMP + 280 days
  const dueDate = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000);

  const diffMs = dueDate.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));

  const totalDaysPregnant = 280 - daysRemaining;
  const gestationalAgeWeeks = Math.max(0, Math.floor(totalDaysPregnant / 7));
  const gestationalAgeDays = Math.max(0, totalDaysPregnant % 7);

  let trimester = 1;
  if (gestationalAgeWeeks >= 28) {
    trimester = 3;
  } else if (gestationalAgeWeeks >= 13) {
    trimester = 2;
  }

  return {
    dueDate,
    daysRemaining,
    gestationalAgeWeeks,
    gestationalAgeDays,
    trimester,
  };
}

// 6. Ovulation Window Finder
export interface OvulationResult {
  nextOvulationDate: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
}

export function calculateOvulation(lastPeriodDate: Date, cycleLengthDays: number): OvulationResult {
  // Ovulation is usually 14 days before the next period
  // Next period start = lastPeriodDate + cycleLengthDays
  // Ovulation date = lastPeriodDate + cycleLengthDays - 14
  const nextPeriodTime = lastPeriodDate.getTime() + cycleLengthDays * 24 * 60 * 60 * 1000;
  const ovulationTime = nextPeriodTime - 14 * 24 * 60 * 60 * 1000;

  const nextOvulationDate = new Date(ovulationTime);
  const fertileWindowStart = new Date(ovulationTime - 5 * 24 * 60 * 60 * 1000); // 5 days before ovulation
  const fertileWindowEnd = new Date(ovulationTime + 1 * 24 * 60 * 60 * 1000); // Day after ovulation

  return {
    nextOvulationDate,
    fertileWindowStart,
    fertileWindowEnd,
  };
}

// 7. Age Calculator (Exact Diff)
export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
}

export function calculateAge(dob: Date, targetDate: Date = new Date()): AgeResult {
  const birthYear = dob.getFullYear();
  const birthMonth = dob.getMonth();
  const birthDay = dob.getDate();

  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth();
  const targetDay = targetDate.getDate();

  let years = targetYear - birthYear;
  let months = targetMonth - birthMonth;
  let days = targetDay - birthDay;

  if (days < 0) {
    months -= 1;
    // Get days in previous month
    const prevMonthDate = new Date(targetYear, targetMonth, 0);
    days += prevMonthDate.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.max(0, Math.floor((targetDate.getTime() - dob.getTime()) / (24 * 60 * 60 * 1000)));
  const totalWeeks = Math.max(0, Math.floor(totalDays / 7));

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
  };
}

// 8. Heart Rate Zones
export interface HeartRateZone {
  zone: number;
  name: string;
  minHr: number;
  maxHr: number;
  description: string;
}

export function calculateHeartRateZones(age: number, restingHr: number = 60): HeartRateZone[] {
  // Using Karvonen Formula (Heart Rate Reserve)
  const maxHr = 220 - age;
  const hrr = maxHr - restingHr; // Heart Rate Reserve

  const zonesConfig = [
    { zone: 1, name: "Warm Up", minPct: 0.50, maxPct: 0.60, desc: "Light aerobic activity, ideal for recovery and active rest." },
    { zone: 2, name: "Fat Burn", minPct: 0.60, maxPct: 0.70, desc: "Easy building pace, burns high ratio of fat, builds base endurance." },
    { zone: 3, name: "Aerobic", minPct: 0.70, maxPct: 0.80, desc: "Moderate tempo, improves cardiovascular capacity and lung efficiency." },
    { zone: 4, name: "Anaerobic", minPct: 0.80, maxPct: 0.90, desc: "Hard effort, increases lactate threshold and speed endurance." },
    { zone: 5, name: "Red Line", minPct: 0.90, maxPct: 1.00, desc: "Maximal effort, improves raw power, only sustainable for short sprints." },
  ];

  return zonesConfig.map((z) => ({
    zone: z.zone,
    name: z.name,
    minHr: Math.round(restingHr + hrr * z.minPct),
    maxHr: Math.round(restingHr + hrr * z.maxPct),
    description: z.desc,
  }));
}

// 9. Macro Split
export interface MacroResult {
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  proteinCalories: number;
  carbCalories: number;
  fatCalories: number;
}

export function calculateMacros(
  tdee: number,
  goal: "maintain" | "cut" | "bulk",
  splitType: "balanced" | "lowCarb" | "highProtein" | "keto"
): MacroResult {
  let targetCalories = tdee;
  if (goal === "cut") {
    targetCalories = Math.max(1200, tdee - 500);
  } else if (goal === "bulk") {
    targetCalories = tdee + 500;
  }

  let pPct = 0.30;
  let cPct = 0.40;
  let fPct = 0.30;

  if (splitType === "lowCarb") {
    pPct = 0.40;
    cPct = 0.20;
    fPct = 0.40;
  } else if (splitType === "highProtein") {
    pPct = 0.45;
    cPct = 0.30;
    fPct = 0.25;
  } else if (splitType === "keto") {
    pPct = 0.25;
    cPct = 0.05;
    fPct = 0.70;
  }

  const proteinCalories = targetCalories * pPct;
  const carbCalories = targetCalories * cPct;
  const fatCalories = targetCalories * fPct;

  return {
    proteinGrams: Math.round(proteinCalories / 4),
    carbGrams: Math.round(carbCalories / 4),
    fatGrams: Math.round(fatCalories / 9),
    proteinCalories: Math.round(proteinCalories),
    carbCalories: Math.round(carbCalories),
    fatCalories: Math.round(fatCalories),
  };
}
