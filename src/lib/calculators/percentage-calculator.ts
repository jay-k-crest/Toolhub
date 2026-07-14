export function calculatePercentOf(percent: number, total: number): number {
  if (total === 0) return 0;
  return (percent / 100) * total;
}

export function calculatePercentIsOf(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

export function calculatePercentChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}
