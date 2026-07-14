import React, { useState, useEffect } from "react";
import {
  calculateFreelanceRate,
  calculateBreakEven,
  calculateMarginAndMarkup,
  calculateROI,
  calculateCAGR,
} from "../../lib/calculators/business-calculators";

interface BusinessProps {
  slug: string;
}

export default function BusinessCalculators({ slug }: BusinessProps) {
  const [activeSlug, setActiveSlug] = useState(slug);

  useEffect(() => {
    setActiveSlug(slug);
  }, [slug]);

  // Freelance Rate states
  const [desiredIncome, setDesiredIncome] = useState(1000000);
  const [annualExpenses, setAnnualExpenses] = useState(200000);
  const [workWeeks, setWorkWeeks] = useState(48);
  const [workDaysWeek, setWorkDaysWeek] = useState(5);
  const [billablePct, setBillablePct] = useState(70);

  // Break-even states
  const [fixedCosts, setFixedCosts] = useState(150000);
  const [pricePerUnit, setPricePerUnit] = useState(150);
  const [costPerUnit, setCostPerUnit] = useState(90);

  // Margin & Markup states
  const [costVal, setCostVal] = useState(100);
  const [marginInput, setMarginInput] = useState<number>(30);
  const [priceInput, setPriceInput] = useState<number | null>(null);
  const [calcMode, setCalcMode] = useState<"margin" | "price">("margin");

  // ROI states
  const [initialInv, setInitialInv] = useState(100000);
  const [finalVal, setFinalVal] = useState(135000);
  const [roiYears, setRoiYears] = useState(3);

  // CAGR states
  const [cagrStart, setCagrStart] = useState(100000);
  const [cagrEnd, setCagrEnd] = useState(250000);
  const [cagrYears, setCagrYears] = useState(5);

  // Invoice Generator states
  const [invNum, setInvNum] = useState("INV-2026-001");
  const [invDate, setInvDate] = useState(new Date().toISOString().split("T")[0]);
  const [fromName, setFromName] = useState("Your Company Name");
  const [toName, setToName] = useState("Client Company Name");
  const [taxPct, setTaxPct] = useState(18);
  const [invoiceItems, setInvoiceItems] = useState([
    { description: "Web Development Services", quantity: 1, rate: 45000 },
    { description: "UI/UX Consultations", quantity: 5, rate: 3000 },
  ]);
  const [newDesc, setNewDesc] = useState("");
  const [newQty, setNewQty] = useState(1);
  const [newRate, setNewRate] = useState(1000);

  // Calculations
  const rateResult = calculateFreelanceRate(desiredIncome, annualExpenses, workWeeks, true, workDaysWeek, billablePct);
  const breakResult = calculateBreakEven(fixedCosts, pricePerUnit, costPerUnit);
  
  // Margin and Markup calculation helper
  const marginResult = calculateMarginAndMarkup(
    costVal,
    calcMode === "price" ? priceInput : null,
    calcMode === "margin" ? marginInput : null,
    null
  );

  const roiResult = calculateROI(initialInv, finalVal, roiYears);
  const cagrValue = calculateCAGR(cagrStart, cagrEnd, cagrYears);

  // Invoice calculations
  const invoiceSubtotal = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const invoiceTax = invoiceSubtotal * (taxPct / 100);
  const invoiceTotal = invoiceSubtotal + invoiceTax;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Generate Invoice PDF
  const downloadInvoicePDF = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      // Simple clean Invoice layout
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(30, 79, 216); // ToolHub Primary Indigo
      doc.text("INVOICE", 14, 25);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.setFont("Helvetica", "normal");
      doc.text(`Invoice No: ${invNum}`, 140, 20);
      doc.text(`Date: ${invDate}`, 140, 25);

      doc.setDrawColor(220);
      doc.line(14, 30, 196, 30);

      doc.setFont("Helvetica", "bold");
      doc.text("From:", 14, 40);
      doc.setFont("Helvetica", "normal");
      doc.text(fromName, 14, 45);

      doc.setFont("Helvetica", "bold");
      doc.text("Bill To:", 14, 60);
      doc.setFont("Helvetica", "normal");
      doc.text(toName, 14, 65);

      // Table Header
      let y = 85;
      doc.setFont("Helvetica", "bold");
      doc.setFillColor(240, 240, 240);
      doc.rect(14, y, 182, 8, "F");
      doc.text("Description", 16, y + 6);
      doc.text("Qty", 120, y + 6);
      doc.text("Rate (INR)", 140, y + 6);
      doc.text("Amount (INR)", 170, y + 6);

      doc.setFont("Helvetica", "normal");
      invoiceItems.forEach((item) => {
        y += 10;
        doc.text(item.description, 16, y + 6);
        doc.text(item.quantity.toString(), 120, y + 6);
        doc.text(item.rate.toLocaleString(), 140, y + 6);
        doc.text((item.quantity * item.rate).toLocaleString(), 170, y + 6);
      });

      y += 15;
      doc.line(14, y, 196, y);

      y += 10;
      doc.text("Subtotal:", 130, y);
      doc.text(invoiceSubtotal.toLocaleString(), 170, y);

      y += 6;
      doc.text(`Tax (${taxPct}%):`, 130, y);
      doc.text(invoiceTax.toLocaleString(), 170, y);

      y += 8;
      doc.setFont("Helvetica", "bold");
      doc.text("Grand Total:", 130, y);
      doc.text(invoiceTotal.toLocaleString(), 170, y);

      doc.save(`invoice_${invNum}.pdf`);
    } catch (e) {
      alert("Failed to load PDF library. Please try again.");
    }
  };

  const businessTools = [
    { slug: "freelance-rate-calculator", label: "Freelance Rate" },
    { slug: "invoice-generator", label: "Invoice Builder" },
    { slug: "break-even-calculator", label: "Break-even Point" },
    { slug: "profit-margin-calculator", label: "Profit Margin/Markup" },
    { slug: "roi-calculator", label: "ROI Calculator" },
    { slug: "cagr-calculator", label: "CAGR Growth" },
  ];

  return (
    <div className="space-y-6">
      {/* Switcher */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
        {businessTools.map((t) => (
          <a
            key={t.slug}
            href={`/business/${t.slug}/`}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeSlug === t.slug
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/40 text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* INPUT PANEL */}
        <div className="space-y-4 bg-card border border-border p-6 rounded-xl">
          <h3 className="text-lg font-bold text-foreground mb-4">Inputs</h3>

          {/* 1. Freelance Rate */}
          {activeSlug === "freelance-rate-calculator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="des-inc" className="text-sm font-medium text-foreground">Desired Annual Net Income (₹)</label>
                <input
                  id="des-inc"
                  type="number"
                  value={desiredIncome}
                  onChange={(e) => setDesiredIncome(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="ann-exp" className="text-sm font-medium text-foreground">Annual Business Expenses (Software, Office) (₹)</label>
                <input
                  id="ann-exp"
                  type="number"
                  value={annualExpenses}
                  onChange={(e) => setAnnualExpenses(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1.5">
                  <label htmlFor="work-wks" className="text-xs text-muted">Work Weeks/Year</label>
                  <input
                    id="work-wks"
                    type="number"
                    value={workWeeks}
                    onChange={(e) => setWorkWeeks(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 p-1 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="work-dys" className="text-xs text-muted">Days/Week</label>
                  <input
                    id="work-dys"
                    type="number"
                    value={workDaysWeek}
                    onChange={(e) => setWorkDaysWeek(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 p-1 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="bill-pct" className="text-xs text-muted">Billable %</label>
                  <input
                    id="bill-pct"
                    type="number"
                    value={billablePct}
                    onChange={(e) => setBillablePct(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 p-1 text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Break-even */}
          {activeSlug === "break-even-calculator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="fix-cost-inp" className="text-sm font-medium text-foreground">Total Fixed Costs (₹)</label>
                <input
                  id="fix-cost-inp"
                  type="number"
                  value={fixedCosts}
                  onChange={(e) => setFixedCosts(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="sell-prc-inp" className="text-sm font-medium text-foreground">Selling Price per Unit (₹)</label>
                  <input
                    id="sell-prc-inp"
                    type="number"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="var-cost-inp" className="text-sm font-medium text-foreground">Variable Cost per Unit (₹)</label>
                  <input
                    id="var-cost-inp"
                    type="number"
                    value={costPerUnit}
                    onChange={(e) => setCostPerUnit(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Margin & Markup */}
          {activeSlug === "profit-margin-calculator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="item-cost-inp" className="text-sm font-medium text-foreground">Cost of Item (₹)</label>
                <input
                  id="item-cost-inp"
                  type="number"
                  value={costVal}
                  onChange={(e) => setCostVal(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Calculate Mode</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCalcMode("margin")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md border ${
                      calcMode === "margin" ? "bg-primary text-primary-foreground" : "bg-card border-input text-muted"
                    }`}
                  >
                    Target Margin %
                  </button>
                  <button
                    onClick={() => setCalcMode("price")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md border ${
                      calcMode === "price" ? "bg-primary text-primary-foreground" : "bg-card border-input text-muted"
                    }`}
                  >
                    Expected Selling Price
                  </button>
                </div>
              </div>
              {calcMode === "margin" ? (
                <div className="space-y-1.5">
                  <label htmlFor="target-margin" className="text-sm font-medium text-foreground">Target Gross Margin (%)</label>
                  <input
                    id="target-margin"
                    type="number"
                    value={marginInput}
                    onChange={(e) => setMarginInput(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label htmlFor="expected-price" className="text-sm font-medium text-foreground">Selling Price (₹)</label>
                  <input
                    id="expected-price"
                    type="number"
                    value={priceInput ?? ""}
                    onChange={(e) => setPriceInput(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* 4. ROI */}
          {activeSlug === "roi-calculator" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="roi-init" className="text-sm font-medium text-foreground">Initial Invested (₹)</label>
                  <input
                    id="roi-init"
                    type="number"
                    value={initialInv}
                    onChange={(e) => setInitialInv(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="roi-fin" className="text-sm font-medium text-foreground">Maturity/Final Value (₹)</label>
                  <input
                    id="roi-fin"
                    type="number"
                    value={finalVal}
                    onChange={(e) => setFinalVal(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="roi-ten" className="text-sm font-medium text-foreground">Investment Period (Years)</label>
                <input
                  id="roi-ten"
                  type="number"
                  value={roiYears}
                  onChange={(e) => setRoiYears(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 5. CAGR */}
          {activeSlug === "cagr-calculator" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="cagr-start" className="text-sm font-medium text-foreground">Starting Value (₹)</label>
                  <input
                    id="cagr-start"
                    type="number"
                    value={cagrStart}
                    onChange={(e) => setCagrStart(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="cagr-end" className="text-sm font-medium text-foreground">Ending Value (₹)</label>
                  <input
                    id="cagr-end"
                    type="number"
                    value={cagrEnd}
                    onChange={(e) => setCagrEnd(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="cagr-ten" className="text-sm font-medium text-foreground">Duration (Years)</label>
                <input
                  id="cagr-ten"
                  type="number"
                  value={cagrYears}
                  onChange={(e) => setCagrYears(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 6. Invoice Generator */}
          {activeSlug === "invoice-generator" && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="inv-no-txt" className="block text-[10px] text-muted">Invoice #</label>
                  <input
                    id="inv-no-txt"
                    type="text"
                    value={invNum}
                    onChange={(e) => setInvNum(e.target.value)}
                    className="w-full rounded border border-input bg-secondary/35 p-1 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="inv-date-txt" className="block text-[10px] text-muted">Date</label>
                  <input
                    id="inv-date-txt"
                    type="date"
                    value={invDate}
                    onChange={(e) => setInvDate(e.target.value)}
                    className="w-full rounded border border-input bg-secondary/35 p-1 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="inv-from-txt" className="block text-[10px] text-muted">From Company</label>
                <input
                  id="inv-from-txt"
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="w-full rounded border border-input bg-secondary/35 p-1 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="inv-to-txt" className="block text-[10px] text-muted">Bill To Client</label>
                <input
                  id="inv-to-txt"
                  type="text"
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  className="w-full rounded border border-input bg-secondary/35 p-1 focus:outline-none"
                />
              </div>

              {/* Items List */}
              <div className="border-t border-border pt-2">
                <span className="font-bold text-muted block mb-1">Invoice Items</span>
                <div className="space-y-1">
                  {invoiceItems.map((item, idx) => (
                    <div key={idx} className="flex gap-1 items-center">
                      <span className="flex-1 font-semibold">{item.description}</span>
                      <span className="text-[10px] text-muted">{item.quantity} × {item.rate}</span>
                      <button
                        onClick={() => setInvoiceItems(invoiceItems.filter((_, i) => i !== idx))}
                        className="text-destructive font-bold px-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Invoice Item */}
              <div className="grid grid-cols-3 gap-1.5 border-t border-border/50 pt-2">
                <input
                  placeholder="Desc"
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="rounded border border-input bg-secondary/40 p-1 focus:outline-none col-span-2"
                />
                <input
                  placeholder="Qty"
                  type="number"
                  value={newQty}
                  onChange={(e) => setNewQty(Number(e.target.value))}
                  className="rounded border border-input bg-secondary/40 p-1 focus:outline-none"
                />
                <input
                  placeholder="Rate (₹)"
                  type="number"
                  value={newRate}
                  onChange={(e) => setNewRate(Number(e.target.value))}
                  className="rounded border border-input bg-secondary/40 p-1 focus:outline-none col-span-2"
                />
                <button
                  onClick={() => {
                    setInvoiceItems([...invoiceItems, { description: newDesc || "Services", quantity: newQty, rate: newRate }]);
                    setNewDesc("");
                  }}
                  className="bg-primary text-primary-foreground rounded p-1 font-semibold text-center"
                >
                  + Add
                </button>
              </div>

              <div className="space-y-1 pt-1">
                <label htmlFor="inv-tax-inp" className="block text-[10px] text-muted">Tax Rate (%)</label>
                <input
                  id="inv-tax-inp"
                  type="number"
                  value={taxPct}
                  onChange={(e) => setTaxPct(Number(e.target.value))}
                  className="w-full rounded border border-input bg-secondary/35 p-1 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* RESULTS PANEL */}
        <div className="bg-secondary/30 border border-border p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Results</h3>

            {/* 1. Freelance Rate Results */}
            {activeSlug === "freelance-rate-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Recommended Hourly Rate</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {formatCurrency(rateResult.hourlyRate)}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Recommended Daily Rate:</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(rateResult.dailyRate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Billable Hours per Year:</span>
                    <span className="font-semibold tabular-nums">{rateResult.billableHoursPerYear} hours</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Break-even Results */}
            {activeSlug === "break-even-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Break-even Units Needed</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {breakResult.breakEvenUnits.toLocaleString()} units
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between font-bold text-accent">
                    <span>Break-even Sales Revenue:</span>
                    <span className="tabular-nums">{formatCurrency(breakResult.breakEvenRevenue)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Profit Margin / Markup Results */}
            {activeSlug === "profit-margin-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Selling Price</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {formatCurrency(marginResult.sellingPrice)}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between font-semibold text-emerald-600">
                    <span>Gross Profit:</span>
                    <span className="tabular-nums">+{formatCurrency(marginResult.profit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gross Margin:</span>
                    <span className="font-semibold tabular-nums">{marginResult.marginPct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Markup Percentage:</span>
                    <span className="font-semibold tabular-nums">{marginResult.markupPct}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. ROI Results */}
            {activeSlug === "roi-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Total Return on Investment</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {roiResult.roiPct}%
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Net Profit Earned:</span>
                    <span className="tabular-nums">+{formatCurrency(roiResult.netProfit)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-2 font-bold text-accent">
                    <span>Annualized ROI (CAGR):</span>
                    <span className="tabular-nums">{roiResult.annualizedRoiPct}% p.a.</span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. CAGR Results */}
            {activeSlug === "cagr-calculator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">CAGR (Annual Growth Rate)</span>
                  <span className="text-4xl font-heading font-extrabold text-primary tabular-nums">
                    {cagrValue}%
                  </span>
                </div>
              </div>
            )}

            {/* 6. Invoice Builder Output preview & download */}
            {activeSlug === "invoice-generator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Invoice Summary</span>
                  <span className="text-3xl font-heading font-extrabold text-primary tabular-nums">
                    {formatCurrency(invoiceTotal)}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(invoiceSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST/Tax ({taxPct}%):</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(invoiceTax)}</span>
                  </div>
                </div>
                <button
                  onClick={downloadInvoicePDF}
                  className="bg-accent text-accent-foreground text-sm font-bold px-4 py-2.5 rounded-md w-full mt-4 flex items-center justify-center gap-2 hover:bg-accent/90"
                >
                  Download PDF Invoice
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
