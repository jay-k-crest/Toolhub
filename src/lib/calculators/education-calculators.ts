/**
 * Education & Career Calculators Logic
 */

// 1. CGPA to Percentage
export function calculateCgpaToPercent(cgpa: number, scale: number = 10, multiplier: number = 9.5): number {
  if (cgpa <= 0 || scale <= 0) return 0;
  // Convert CGPA to equivalent percentage
  const pct = (cgpa / scale) * 10 * multiplier;
  return parseFloat(Math.min(100, Math.max(0, pct)).toFixed(2));
}

// 2. Grade Calculator
export interface GradeItem {
  name: string;
  score: number; // e.g. 85%
  weight: number; // e.g. 20%
}

export function calculateGrade(items: GradeItem[]): { currentGrade: number; totalWeight: number } {
  let weightedSum = 0;
  let totalWeight = 0;

  items.forEach((item) => {
    if (item.weight > 0) {
      weightedSum += (item.score * item.weight);
      totalWeight += item.weight;
    }
  });

  const currentGrade = totalWeight > 0 ? parseFloat((weightedSum / totalWeight).toFixed(2)) : 0;
  return { currentGrade, totalWeight };
}

export function calculateRequiredFinal(
  currentGrade: number,
  currentWeight: number,
  targetGrade: number,
  finalExamWeight: number
): number {
  // Formula: Target = CurrentGrade * (CurrentWeight/100) + FinalGrade * (FinalWeight/100)
  // Therefore: FinalGrade = (Target - CurrentGrade * (CurrentWeight/100)) / (FinalWeight/100)
  if (finalExamWeight <= 0) return 0;
  const currentPortion = currentGrade * (currentWeight / 100);
  const required = (targetGrade - currentPortion) / (finalExamWeight / 100);
  return parseFloat(required.toFixed(2));
}

// 3. Attendance Calculator
export interface AttendanceResult {
  currentPercentage: number;
  status: string;
  classesToAttend: number;
  classesToSkip: number;
}

export function calculateAttendance(
  attended: number,
  total: number,
  targetPercentage: number = 75
): AttendanceResult {
  if (total <= 0) {
    return { currentPercentage: 0, status: "Enter valid total classes", classesToAttend: 0, classesToSkip: 0 };
  }

  const currentPercentage = parseFloat(((attended / total) * 100).toFixed(2));

  let classesToAttend = 0;
  let classesToSkip = 0;

  if (currentPercentage < targetPercentage) {
    // How many more classes to attend consecutively to reach target%?
    // (attended + x) / (total + x) >= target / 100
    // attended + x >= (target/100) * total + (target/100) * x
    // x * (1 - target/100) >= (target/100) * total - attended
    // x >= (target * total - 100 * attended) / (100 - target)
    const factor = targetPercentage / 100;
    classesToAttend = Math.ceil((targetPercentage * total - 100 * attended) / (100 - targetPercentage));
    classesToAttend = Math.max(0, classesToAttend);
  } else {
    // How many classes can be skipped consecutively without going below target%?
    // attended / (total + y) >= target / 100
    // attended >= (target/100) * total + (target/100) * y
    // y <= (100 * attended - target * total) / target
    classesToSkip = Math.floor((100 * attended - targetPercentage * total) / targetPercentage);
    classesToSkip = Math.max(0, classesToSkip);
  }

  const status = currentPercentage >= targetPercentage 
    ? `On track! You can skip ${classesToSkip} more class(es).`
    : `Behind! You need to attend ${classesToAttend} class(es) consecutively to reach ${targetPercentage}%.`;

  return {
    currentPercentage,
    status,
    classesToAttend,
    classesToSkip,
  };
}

// 4. Salary Hike
export function calculateSalaryHike(oldSalary: number, newSalary: number): { percentage: number; diff: number } {
  if (oldSalary <= 0) return { percentage: 0, diff: 0 };
  const diff = newSalary - oldSalary;
  const percentage = parseFloat(((diff / oldSalary) * 100).toFixed(2));
  return { percentage, diff };
}

// 5. Notice Period
export function calculateNoticePeriod(startDate: Date, durationValue: number, durationUnit: "days" | "weeks" | "months"): Date {
  const resultDate = new Date(startDate);
  if (durationUnit === "days") {
    resultDate.setDate(resultDate.getDate() + durationValue);
  } else if (durationUnit === "weeks") {
    resultDate.setDate(resultDate.getDate() + durationValue * 7);
  } else if (durationUnit === "months") {
    resultDate.setMonth(resultDate.getMonth() + durationValue);
  }
  return resultDate;
}
