/**
 * Crypto & Stocks Calculators Logic
 */

// 1. Crypto Profit/Loss
export interface CryptoProfitResult {
  investment: number;
  revenue: number;
  fees: number;
  netProfit: number;
  roiPct: number;
}

export function calculateCryptoProfit(
  buyPrice: number,
  sellPrice: number,
  quantity: number,
  buyFeePct: number = 0.1,
  sellFeePct: number = 0.1
): CryptoProfitResult {
  const buyCost = buyPrice * quantity;
  const sellValue = sellPrice * quantity;

  const buyFee = buyCost * (buyFeePct / 100);
  const sellFee = sellValue * (sellFeePct / 100);
  const totalFees = buyFee + sellFee;

  const investment = buyCost + buyFee;
  const revenue = sellValue - sellFee;
  const netProfit = revenue - investment;
  const roiPct = investment > 0 ? (netProfit / investment) * 100 : 0;

  return {
    investment: parseFloat(investment.toFixed(2)),
    revenue: parseFloat(revenue.toFixed(2)),
    fees: parseFloat(totalFees.toFixed(2)),
    netProfit: parseFloat(netProfit.toFixed(2)),
    roiPct: parseFloat(roiPct.toFixed(2)),
  };
}

// 2. Stock DCA (Dollar Cost Average)
export interface DcaEntry {
  price: number;
  shares: number;
}

export interface DcaResult {
  totalShares: number;
  totalInvestment: number;
  averagePrice: number;
}

export function calculateDca(entries: DcaEntry[]): DcaResult {
  let totalShares = 0;
  let totalInvestment = 0;

  entries.forEach((entry) => {
    if (entry.price > 0 && entry.shares > 0) {
      totalShares += entry.shares;
      totalInvestment += entry.price * entry.shares;
    }
  });

  const averagePrice = totalShares > 0 ? totalInvestment / totalShares : 0;

  return {
    totalShares: parseFloat(totalShares.toFixed(4)),
    totalInvestment: parseFloat(totalInvestment.toFixed(2)),
    averagePrice: parseFloat(averagePrice.toFixed(2)),
  };
}

// 3. Dividend Yield
export function calculateDividendYield(annualDividendPerShare: number, sharePrice: number): number {
  if (sharePrice <= 0) return 0;
  return parseFloat(((annualDividendPerShare / sharePrice) * 100).toFixed(2));
}

// 4. P/E Ratio
export function calculatePeRatio(sharePrice: number, eps: number): number {
  if (eps === 0) return 0;
  return parseFloat((sharePrice / eps).toFixed(2));
}
