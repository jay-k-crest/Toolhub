export interface EMICalculationResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  amortizationSchedule: Array<{
    month: number;
    principalPaid: number;
    interestPaid: number;
    remainingPrincipal: number;
  }>;
}

export function calculateEMI(principal: number, annualRate: number, tenureYears: number): EMICalculationResult {
  const P = principal;
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;

  if (P <= 0 || annualRate <= 0 || tenureYears <= 0) {
    return {
      emi: 0,
      totalInterest: 0,
      totalPayment: 0,
      amortizationSchedule: [],
    };
  }

  // Monthly EMI Formula
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;

  const amortizationSchedule = [];
  let remainingPrincipal = P;

  for (let i = 1; i <= n; i++) {
    const interestPaid = remainingPrincipal * r;
    const principalPaid = emi - interestPaid;
    remainingPrincipal = Math.max(0, remainingPrincipal - principalPaid);

    amortizationSchedule.push({
      month: i,
      principalPaid,
      interestPaid,
      remainingPrincipal,
    });
  }

  return {
    emi,
    totalInterest,
    totalPayment,
    amortizationSchedule,
  };
}
