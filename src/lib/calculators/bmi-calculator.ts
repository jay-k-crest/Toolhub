export interface BMICalculationResult {
  bmi: number;
  category: "Underweight" | "Normal" | "Overweight" | "Obese";
  healthyRange: string;
}

export function calculateBMI(
  weight: number, // in kg or lbs
  height: number, // in cm or inches
  isMetric: boolean = true
): BMICalculationResult {
  if (weight <= 0 || height <= 0) {
    return {
      bmi: 0,
      category: "Normal",
      healthyRange: "Please check your inputs.",
    };
  }

  let bmi = 0;
  if (isMetric) {
    // height is in cm, convert to meters
    const heightM = height / 100;
    bmi = weight / (heightM * heightM);
  } else {
    // Imperial: weight in lbs, height in inches
    bmi = (weight / (height * height)) * 703;
  }

  let category: "Underweight" | "Normal" | "Overweight" | "Obese" = "Normal";
  if (bmi < 18.5) {
    category = "Underweight";
  } else if (bmi >= 18.5 && bmi < 25) {
    category = "Normal";
  } else if (bmi >= 25 && bmi < 30) {
    category = "Overweight";
  } else {
    category = "Obese";
  }

  let healthyRange = "";
  if (isMetric) {
    const minWeight = 18.5 * Math.pow(height / 100, 2);
    const maxWeight = 24.9 * Math.pow(height / 100, 2);
    healthyRange = `${minWeight.toFixed(1)} kg - ${maxWeight.toFixed(1)} kg`;
  } else {
    const minWeight = (18.5 * Math.pow(height, 2)) / 703;
    const maxWeight = (24.9 * Math.pow(height, 2)) / 703;
    healthyRange = `${minWeight.toFixed(1)} lbs - ${maxWeight.toFixed(1)} lbs`;
  }

  return {
    bmi,
    category,
    healthyRange,
  };
}
