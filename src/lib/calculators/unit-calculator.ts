export interface UnitConfig {
  value: string;
  label: string;
  factor: number; // Multiply by this to convert to base unit
}

export const unitCategories: Record<string, {
  label: string;
  baseUnit: string;
  units: UnitConfig[];
}> = {
  length: {
    label: "Length",
    baseUnit: "m",
    units: [
      { value: "m", label: "Meters (m)", factor: 1 },
      { value: "cm", label: "Centimeters (cm)", factor: 0.01 },
      { value: "mm", label: "Millimeters (mm)", factor: 0.001 },
      { value: "km", label: "Kilometers (km)", factor: 1000 },
      { value: "inch", label: "Inches (in)", factor: 0.0254 },
      { value: "foot", label: "Feet (ft)", factor: 0.3048 },
      { value: "yard", label: "Yards (yd)", factor: 0.9144 },
      { value: "mile", label: "Miles (mi)", factor: 1609.344 },
    ],
  },
  weight: {
    label: "Weight & Mass",
    baseUnit: "kg",
    units: [
      { value: "kg", label: "Kilograms (kg)", factor: 1 },
      { value: "g", label: "Grams (g)", factor: 0.001 },
      { value: "mg", label: "Milligrams (mg)", factor: 0.000001 },
      { value: "pound", label: "Pounds (lbs)", factor: 0.45359237 },
      { value: "ounce", label: "Ounces (oz)", factor: 0.028349523 },
    ],
  },
  area: {
    label: "Area",
    baseUnit: "m2",
    units: [
      { value: "m2", label: "Square Meters (m²)", factor: 1 },
      { value: "cm2", label: "Square Centimeters (cm²)", factor: 0.0001 },
      { value: "km2", label: "Square Kilometers (km²)", factor: 1000000 },
      { value: "ft2", label: "Square Feet (ft²)", factor: 0.09290304 },
      { value: "inch2", label: "Square Inches (in²)", factor: 0.00064516 },
      { value: "acre", label: "Acres (ac)", factor: 4046.8564224 },
      { value: "hectare", label: "Hectares (ha)", factor: 10000 },
    ],
  },
  volume: {
    label: "Volume",
    baseUnit: "l",
    units: [
      { value: "l", label: "Liters (L)", factor: 1 },
      { value: "ml", label: "Milliliters (mL)", factor: 0.001 },
      { value: "m3", label: "Cubic Meters (m³)", factor: 1000 },
      { value: "gallon", label: "Gallons (US gal)", factor: 3.78541178 },
      { value: "quart", label: "Quarts (US qt)", factor: 0.946352946 },
      { value: "cup", label: "Cups (US cup)", factor: 0.24 },
    ],
  },
  temperature: {
    label: "Temperature",
    baseUnit: "c",
    units: [
      { value: "c", label: "Celsius (°C)", factor: 1 },
      { value: "f", label: "Fahrenheit (°F)", factor: 1 },
      { value: "k", label: "Kelvin (K)", factor: 1 },
    ],
  },
};

export function convertUnits(
  value: number,
  fromUnit: string,
  toUnit: string,
  category: string
): number {
  if (isNaN(value)) return 0;
  if (fromUnit === toUnit) return value;

  const cat = unitCategories[category];
  if (!cat) return 0;

  // Custom temperature handling
  if (category === "temperature") {
    // 1. Convert from source to Celsius
    let celsiusVal = value;
    if (fromUnit === "f") {
      celsiusVal = ((value - 32) * 5) / 9;
    } else if (fromUnit === "k") {
      celsiusVal = value - 273.15;
    }

    // 2. Convert from Celsius to target
    if (toUnit === "c") {
      return celsiusVal;
    } else if (toUnit === "f") {
      return (celsiusVal * 9) / 5 + 32;
    } else if (toUnit === "k") {
      return celsiusVal + 273.15;
    }
    return 0;
  }

  // Standard multiplicative conversion
  const fromCfg = cat.units.find((u) => u.value === fromUnit);
  const toCfg = cat.units.find((u) => u.value === toUnit);

  if (!fromCfg || !toCfg) return 0;

  // Convert to base unit then to target
  const baseValue = value * fromCfg.factor;
  return baseValue / toCfg.factor;
}
