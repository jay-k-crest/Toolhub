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
      { value: "nautical_mile", label: "Nautical Miles (NM)", factor: 1852 },
    ],
  },
  weight: {
    label: "Weight & Mass",
    baseUnit: "kg",
    units: [
      { value: "kg", label: "Kilograms (kg)", factor: 1 },
      { value: "g", label: "Grams (g)", factor: 0.001 },
      { value: "mg", label: "Milligrams (mg)", factor: 0.000001 },
      { value: "metric_ton", label: "Metric Tonnes (t)", factor: 1000 },
      { value: "pound", label: "Pounds (lbs)", factor: 0.45359237 },
      { value: "ounce", label: "Ounces (oz)", factor: 0.028349523 },
      { value: "carat", label: "Carats (ct)", factor: 0.0002 },
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
      { value: "sq_yard", label: "Square Yards (yd²)", factor: 0.836127 },
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
      { value: "gallon_uk", label: "Gallons (UK gal)", factor: 4.54609 },
      { value: "quart", label: "Quarts (US qt)", factor: 0.946352946 },
      { value: "pint", label: "Pints (US pt)", factor: 0.473176473 },
      { value: "cup", label: "Cups (US cup)", factor: 0.24 },
      { value: "fluid_oz", label: "Fluid Ounces (fl oz)", factor: 0.0295735 },
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
  speed: {
    label: "Speed",
    baseUnit: "mps",
    units: [
      { value: "kmh", label: "Kilometers per hour (km/h)", factor: 1 / 3.6 },
      { value: "mph", label: "Miles per hour (mph)", factor: 0.44704 },
      { value: "mps", label: "Meters per second (m/s)", factor: 1 },
      { value: "knot", label: "Knots (kt)", factor: 0.514444 },
      { value: "fps", label: "Feet per second (ft/s)", factor: 0.3048 },
    ],
  },
  time: {
    label: "Time",
    baseUnit: "s",
    units: [
      { value: "ms", label: "Milliseconds (ms)", factor: 0.001 },
      { value: "s", label: "Seconds (s)", factor: 1 },
      { value: "min", label: "Minutes (min)", factor: 60 },
      { value: "hour", label: "Hours (h)", factor: 3600 },
      { value: "day", label: "Days (d)", factor: 86400 },
      { value: "week", label: "Weeks (wk)", factor: 604800 },
      { value: "year", label: "Years (yr)", factor: 31536000 },
    ],
  },
  digital: {
    label: "Data Storage",
    baseUnit: "b",
    units: [
      { value: "b", label: "Bits (b)", factor: 1 },
      { value: "B", label: "Bytes (B)", factor: 8 },
      { value: "KB", label: "Kilobytes (KB)", factor: 8 * 1000 },
      { value: "MB", label: "Megabytes (MB)", factor: 8 * 1000 * 1000 },
      { value: "GB", label: "Gigabytes (GB)", factor: 8 * 1000 * 1000 * 1000 },
      { value: "TB", label: "Terabytes (TB)", factor: 8 * 1000 * 1000 * 1000 * 1000 },
      { value: "KiB", label: "Kibibytes (KiB - Binary)", factor: 8 * 1024 },
      { value: "MiB", label: "Mebibytes (MiB - Binary)", factor: 8 * 1024 * 1024 },
      { value: "GiB", label: "Gibibytes (GiB - Binary)", factor: 8 * 1024 * 1024 * 1024 },
    ],
  },
  pressure: {
    label: "Pressure",
    baseUnit: "pa",
    units: [
      { value: "pa", label: "Pascals (Pa)", factor: 1 },
      { value: "kpa", label: "Kilopascals (kPa)", factor: 1000 },
      { value: "bar", label: "Bar (bar)", factor: 100000 },
      { value: "psi", label: "Pounds per sq inch (psi)", factor: 6894.757 },
      { value: "atm", label: "Standard Atmospheres (atm)", factor: 101325 },
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
    let celsiusVal = value;
    if (fromUnit === "f") {
      celsiusVal = ((value - 32) * 5) / 9;
    } else if (fromUnit === "k") {
      celsiusVal = value - 273.15;
    }

    if (toUnit === "c") {
      return celsiusVal;
    } else if (toUnit === "f") {
      return (celsiusVal * 9) / 5 + 32;
    } else if (toUnit === "k") {
      return celsiusVal + 273.15;
    }
    return 0;
  }

  const fromCfg = cat.units.find((u) => u.value === fromUnit);
  const toCfg = cat.units.find((u) => u.value === toUnit);

  if (!fromCfg || !toCfg) return 0;

  const baseValue = value * fromCfg.factor;
  return baseValue / toCfg.factor;
}
