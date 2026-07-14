/**
 * Math & Utility Calculators Logic
 */

// 1. Percentage Increase/Decrease
export function calculatePercentageChange(oldVal: number, newVal: number): { percentage: number; isIncrease: boolean; difference: number } {
  if (oldVal === 0) return { percentage: 0, isIncrease: true, difference: newVal };
  const difference = newVal - oldVal;
  const percentage = parseFloat(((difference / Math.abs(oldVal)) * 100).toFixed(2));
  return {
    percentage: Math.abs(percentage),
    isIncrease: difference >= 0,
    difference: Math.abs(difference),
  };
}

// 2. Ratio Calculator
export function getGCD(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function simplifyRatio(a: number, b: number): { simplifiedA: number; simplifiedB: number } {
  if (a === 0 || b === 0) return { simplifiedA: a, simplifiedB: b };
  const gcd = getGCD(a, b);
  return {
    simplifiedA: a / gcd,
    simplifiedB: b / gcd,
  };
}

export function solveProportion(a: number | null, b: number | null, c: number | null, d: number | null): number {
  // A : B = C : D  =>  A/B = C/D
  if (a !== null && b !== null && c !== null) return (b * c) / a; // D
  if (a !== null && b !== null && d !== null) return (a * d) / b; // C
  if (a !== null && c !== null && d !== null) return (a * d) / c; // B
  if (b !== null && c !== null && d !== null) return (b * c) / d; // A
  return 0;
}

// 3. Average & Stats (Mean, Median, Mode)
export interface StatsResult {
  mean: number;
  median: number;
  mode: number[];
  range: number;
  sortedNumbers: number[];
}

export function calculateStats(numbers: number[]): StatsResult {
  if (numbers.length === 0) return { mean: 0, median: 0, mode: [], range: 0, sortedNumbers: [] };

  const sorted = [...numbers].sort((a, b) => a - b);
  const count = sorted.length;

  // Mean
  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = parseFloat((sum / count).toFixed(4));

  // Median
  let median = 0;
  if (count % 2 === 0) {
    median = (sorted[count / 2 - 1] + sorted[count / 2]) / 2;
  } else {
    median = sorted[Math.floor(count / 2)];
  }
  median = parseFloat(median.toFixed(4));

  // Mode
  const freqs: Record<number, number> = {};
  let maxFreq = 0;
  numbers.forEach((num) => {
    freqs[num] = (freqs[num] || 0) + 1;
    if (freqs[num] > maxFreq) {
      maxFreq = freqs[num];
    }
  });

  const mode: number[] = [];
  if (maxFreq > 1) {
    Object.keys(freqs).forEach((key) => {
      const val = Number(key);
      if (freqs[val] === maxFreq) {
        mode.push(val);
      }
    });
  }

  // Range
  const range = sorted[count - 1] - sorted[0];

  return { mean, median, mode, range, sortedNumbers: sorted };
}

// 4. Standard Deviation
export interface SdResult {
  mean: number;
  variancePopulation: number;
  varianceSample: number;
  sdPopulation: number;
  sdSample: number;
}

export function calculateStandardDeviation(numbers: number[]): SdResult {
  const stats = calculateStats(numbers);
  const mean = stats.mean;
  const count = numbers.length;

  if (count === 0) return { mean: 0, variancePopulation: 0, varianceSample: 0, sdPopulation: 0, sdSample: 0 };

  const squaredDiffsSum = numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);

  const variancePopulation = squaredDiffsSum / count;
  const varianceSample = count > 1 ? squaredDiffsSum / (count - 1) : 0;

  return {
    mean,
    variancePopulation: parseFloat(variancePopulation.toFixed(4)),
    varianceSample: parseFloat(varianceSample.toFixed(4)),
    sdPopulation: parseFloat(Math.sqrt(variancePopulation).toFixed(4)),
    sdSample: parseFloat(Math.sqrt(varianceSample).toFixed(4)),
  };
}

// 5. Fraction Calculator
export interface Fraction {
  numerator: number;
  denominator: number;
}

export function simplifyFraction(frac: Fraction): Fraction {
  if (frac.denominator === 0) return frac; // Division by zero
  const gcd = getGCD(frac.numerator, frac.denominator);
  let num = frac.numerator / gcd;
  let den = frac.denominator / gcd;
  if (den < 0) {
    num = -num;
    den = -den;
  }
  return { numerator: num, denominator: den };
}

export function calculateFractions(
  f1: Fraction,
  f2: Fraction,
  op: "+" | "-" | "*" | "/"
): Fraction {
  let num = 0;
  let den = 1;

  switch (op) {
    case "+":
      num = f1.numerator * f2.denominator + f2.numerator * f1.denominator;
      den = f1.denominator * f2.denominator;
      break;
    case "-":
      num = f1.numerator * f2.denominator - f2.numerator * f1.denominator;
      den = f1.denominator * f2.denominator;
      break;
    case "*":
      num = f1.numerator * f2.numerator;
      den = f1.denominator * f2.denominator;
      break;
    case "/":
      num = f1.numerator * f2.denominator;
      den = f1.denominator * f2.numerator;
      break;
  }

  return simplifyFraction({ numerator: num, denominator: den });
}

// 6. Secure Random Number Generator
export function generateRandomNumbers(
  min: number,
  max: number,
  count: number = 1,
  allowDuplicates: boolean = true
): number[] {
  if (min > max) {
    const temp = min;
    min = max;
    max = temp;
  }

  const range = max - min + 1;
  if (!allowDuplicates && range < count) {
    count = range; // Cap to max possible unique numbers
  }

  const results: number[] = [];
  const seen = new Set<number>();

  while (results.length < count) {
    // Generate pseudo-random
    const val = Math.floor(Math.random() * (max - min + 1)) + min;
    if (allowDuplicates) {
      results.push(val);
    } else {
      if (!seen.has(val)) {
        seen.add(val);
        results.push(val);
      }
    }
  }

  return results;
}

// 7. Secure Password Generator
export function generateSecurePassword(
  length: number = 12,
  options: {
    upper: boolean;
    lower: boolean;
    numbers: boolean;
    symbols: boolean;
  }
): string {
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const numChars = "0123456789";
  const symChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  let allChars = "";
  let mandatory: string[] = [];

  if (options.upper) {
    allChars += upperChars;
    mandatory.push(upperChars[Math.floor(Math.random() * upperChars.length)]);
  }
  if (options.lower) {
    allChars += lowerChars;
    mandatory.push(lowerChars[Math.floor(Math.random() * lowerChars.length)]);
  }
  if (options.numbers) {
    allChars += numChars;
    mandatory.push(numChars[Math.floor(Math.random() * numChars.length)]);
  }
  if (options.symbols) {
    allChars += symChars;
    mandatory.push(symChars[Math.floor(Math.random() * symChars.length)]);
  }

  if (allChars.length === 0) {
    return ""; // Default fail
  }

  const passwordArr: string[] = [...mandatory];
  const remainingLength = length - passwordArr.length;

  try {
    const randomBuffer = new Uint32Array(remainingLength);
    crypto.getRandomValues(randomBuffer);
    for (let i = 0; i < remainingLength; i++) {
      const idx = randomBuffer[i] % allChars.length;
      passwordArr.push(allChars[idx]);
    }
  } catch (e) {
    // Fallback if window.crypto is not available
    for (let i = 0; i < remainingLength; i++) {
      const idx = Math.floor(Math.random() * allChars.length);
      passwordArr.push(allChars[idx]);
    }
  }

  // Shuffle the final array
  return passwordArr.sort(() => Math.random() - 0.5).join("");
}

// 8. Word Counter
export interface TextStats {
  charactersWithSpaces: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
}

export function analyzeText(text: string): TextStats {
  const charactersWithSpaces = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;

  const trimmed = text.trim();
  const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;

  // Sentences split by ., !, ?
  const sentences = trimmed === "" ? 0 : trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  // Paragraphs split by double linebreaks
  const paragraphs = trimmed === "" ? 0 : trimmed.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

  // 225 WPM average reading speed
  const readingTimeMinutes = parseFloat((words / 225).toFixed(1));

  return {
    charactersWithSpaces,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    readingTimeMinutes,
  };
}

// 9. JWT Secret Generator
export function generateJWTSecret(
  bits: 256 | 384 | 512 = 256,
  encoding: "base64" | "base64url" | "hex" | "plain" = "base64"
): string {
  const bytesCount = bits / 8;
  const bytes = new Uint8Array(bytesCount);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytesCount; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  if (encoding === "hex") {
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  if (encoding === "base64" || encoding === "base64url") {
    let binary = "";
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    let base64 = btoa(binary);
    if (encoding === "base64url") {
      base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
    return base64;
  }

  // Plain Text (printable ASCII characters)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?";
  let result = "";
  for (let i = 0; i < bytesCount; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

