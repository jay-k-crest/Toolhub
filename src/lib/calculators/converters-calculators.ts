/**
 * Converters & Date Difference Calculators Logic
 */

// 1. Time Zone Converter
export function convertTimeZone(
  dateTimeStr: string, // "YYYY-MM-DDTHH:MM"
  fromZone: string,
  toZone: string
): string {
  try {
    const fromDate = new Date(dateTimeStr);
    if (isNaN(fromDate.getTime())) return "Invalid Date";
    
    // Format using Intl.DateTimeFormat
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: toZone,
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
    
    return formatter.format(fromDate);
  } catch (e) {
    return "Unsupported Time Zone";
  }
}

// 2. Date Difference
export interface DateDiffResult {
  days: number;
  weeks: number;
  months: number;
  years: number;
  breakdown: string;
}

export function calculateDateDifference(d1: Date, d2: Date): DateDiffResult {
  const t1 = d1.getTime();
  const t2 = d2.getTime();
  const diffMs = Math.abs(t2 - t1);
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = parseFloat((days / 7).toFixed(1));
  const months = parseFloat((days / 30.437).toFixed(1));
  const years = parseFloat((days / 365.25).toFixed(1));

  // Calendar difference breakdown
  const start = t1 < t2 ? d1 : d2;
  const end = t1 < t2 ? d2 : d1;
  
  let yDiff = end.getFullYear() - start.getFullYear();
  let mDiff = end.getMonth() - start.getMonth();
  let dDiff = end.getDate() - start.getDate();

  if (dDiff < 0) {
    mDiff -= 1;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    dDiff += prevMonth.getDate();
  }
  if (mDiff < 0) {
    yDiff -= 1;
    mDiff += 12;
  }

  return {
    days,
    weeks,
    months,
    years,
    breakdown: `${yDiff} year(s), ${mDiff} month(s), ${dDiff} day(s)`,
  };
}

// 3. Number to Words (Supports International & Indian Numbering)
export function numberToWords(num: number, isIndianSystem: boolean = false): string {
  if (num === 0) return "Zero";
  if (num < 0) return "Minus " + numberToWords(Math.abs(num), isIndianSystem);

  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", 
                 "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const helper = (n: number): string => {
    if (n < 20) return units[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + units[n % 10] : "");
    if (n < 1000) return units[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + helper(n % 100) : "");
    return "";
  };

  if (isIndianSystem) {
    // Indian: Thousand, Lakh, Crore
    // Groups: Crores (10,00,00,000), Lakhs (1,00,000), Thousands (1,000), Hundreds (100)
    let temp = Math.floor(num);
    let result = "";

    const crore = Math.floor(temp / 10000000);
    temp %= 10000000;

    const lakh = Math.floor(temp / 100000);
    temp %= 100000;

    const thousand = Math.floor(temp / 1000);
    temp %= 1000;

    if (crore > 0) {
      result += numberToWords(crore, true) + " Crore ";
    }
    if (lakh > 0) {
      result += helper(lakh) + " Lakh ";
    }
    if (thousand > 0) {
      result += helper(thousand) + " Thousand ";
    }
    if (temp > 0) {
      result += helper(temp);
    }
    return result.trim();
  } else {
    // International: Million, Billion
    const billion = Math.floor(num / 1000000000);
    let temp = num % 1000000000;

    const million = Math.floor(temp / 1000000);
    temp %= 1000000;

    const thousand = Math.floor(temp / 1000);
    temp %= 1000;

    let result = "";
    if (billion > 0) {
      result += helper(billion) + " Billion ";
    }
    if (million > 0) {
      result += helper(million) + " Million ";
    }
    if (thousand > 0) {
      result += helper(thousand) + " Thousand ";
    }
    if (temp > 0) {
      result += helper(temp);
    }
    return result.trim();
  }
}

// 4. Roman Numeral Converter
export function integerToRoman(num: number): string {
  if (num < 1 || num > 3999) return "OutOfRange (1-3999)";
  const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syb = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let roman = "";
  for (let i = 0; i < val.length; i++) {
    while (num >= val[i]) {
      roman += syb[i];
      num -= val[i];
    }
  }
  return roman;
}

export function romanToInteger(roman: string): number {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let sum = 0;
  const str = roman.toUpperCase();
  for (let i = 0; i < str.length; i++) {
    const current = map[str[i]];
    const next = map[str[i + 1]];
    if (current === undefined) return 0; // Invalid char
    if (next && current < next) {
      sum += (next - current);
      i++; // Skip next
    } else {
      sum += current;
    }
  }
  return sum;
}

// 5. Data Storage Converter
export const dataStorageUnits = [
  { value: "bit", label: "Bits (b)", bits: 1 },
  { value: "byte", label: "Bytes (B)", bits: 8 },
  { value: "kb", label: "Kilobytes (KB)", bits: 8 * 1000 },
  { value: "mb", label: "Megabytes (MB)", bits: 8 * 1000 * 1000 },
  { value: "gb", label: "Gigabytes (GB)", bits: 8 * 1000 * 1000 * 1000 },
  { value: "tb", label: "Terabytes (TB)", bits: 8 * 1000 * 1000 * 1000 * 1000 },
  { value: "pb", label: "Petabytes (PB)", bits: 8 * 1000 * 1000 * 1000 * 1000 * 1000 },
  // Binary prefixes (base-2)
  { value: "kib", label: "Kibibytes (KiB)", bits: 8 * 1024 },
  { value: "mib", label: "Mebibytes (MiB)", bits: 8 * 1024 * 1024 },
  { value: "gib", label: "Gibibytes (GiB)", bits: 8 * 1024 * 1024 * 1024 },
  { value: "tib", label: "Tebibytes (TiB)", bits: 8 * 1024 * 1024 * 1024 * 1024 },
];

export function convertDataStorage(value: number, from: string, to: string): number {
  if (isNaN(value)) return 0;
  const fCfg = dataStorageUnits.find(u => u.value === from);
  const tCfg = dataStorageUnits.find(u => u.value === to);
  if (!fCfg || !tCfg) return 0;
  
  const totalBits = value * fCfg.bits;
  return totalBits / tCfg.bits;
}

// 6. Speed Converter
export const speedUnits = [
  { value: "kmh", label: "Kilometers per hour (km/h)", mps: 1 / 3.6 },
  { value: "mph", label: "Miles per hour (mph)", mps: 0.44704 },
  { value: "mps", label: "Meters per second (m/s)", mps: 1 },
  { value: "knot", label: "Knots (kt)", mps: 0.514444 },
];

export function convertSpeed(value: number, from: string, to: string): number {
  if (isNaN(value)) return 0;
  const fCfg = speedUnits.find(u => u.value === from);
  const tCfg = speedUnits.find(u => u.value === to);
  if (!fCfg || !tCfg) return 0;

  const mpsVal = value * fCfg.mps;
  return mpsVal / tCfg.mps;
}
