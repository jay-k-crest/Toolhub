export interface CategoryFallback {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  displayOrder: number;
}

export interface ToolFallback {
  slug: string;
  name: string;
  categorySlug: string;
  shortDesc: string;
  metaTitle: string;
  metaDescription: string;
  introContent: string;
  faq: Array<{ q: string; a: string }>;
  displayOrder: number;
}

export const categoriesFallback: CategoryFallback[] = [
  {
    id: 1,
    slug: "finance",
    name: "Finance & Loans",
    description: "Calculate EMIs, investments, interest, compound interest, HRA, and tax comparisons.",
    icon: "Landmark",
    displayOrder: 1,
  },
  {
    id: 2,
    slug: "health",
    name: "Health & Fitness",
    description: "Assess your BMI, ideal weight, daily calories, and check due dates or heart rate zones.",
    icon: "HeartPulse",
    displayOrder: 2,
  },
  {
    id: 3,
    slug: "education",
    name: "Education & Career",
    description: "GPA, CGPA to percentage, attendance trackers, and grade calculation tools.",
    icon: "GraduationCap",
    displayOrder: 3,
  },
  {
    id: 4,
    slug: "converters",
    name: "Unit & General Converters",
    description: "Convert lengths, temperatures, weights, numbers to words, roman numerals, and time zones.",
    icon: "Ruler",
    displayOrder: 4,
  },
  {
    id: 5,
    slug: "math",
    name: "Math & Utility",
    description: "Work with percentages, averages, fractions, random numbers, standard deviations, and generate secure passwords.",
    icon: "Calculator",
    displayOrder: 5,
  },
  {
    id: 6,
    slug: "real-estate",
    name: "Real Estate",
    description: "Stamp duty calculators, home affordability estimators, property tax, and rental yields.",
    icon: "Home",
    displayOrder: 6,
  },
  {
    id: 7,
    slug: "business",
    name: "Business & Freelance",
    description: "Estimate freelance rates, profit margins, markups, ROIs, break-even points, and generate client invoices.",
    icon: "Briefcase",
    displayOrder: 7,
  },
  {
    id: 8,
    slug: "insurance",
    name: "Insurance & IDV",
    description: "Check life insurance needs, term insurance premiums, and vehicle IDV deprecations.",
    icon: "ShieldCheck",
    displayOrder: 8,
  },
  {
    id: 9,
    slug: "crypto-stocks",
    name: "Crypto & Stocks",
    description: "Analyze stock DCA entries, calculate crypto profits, dividend yields, and P/E ratios.",
    icon: "TrendingUp",
    displayOrder: 9,
  },
  {
    id: 10,
    slug: "seo-text",
    name: "Text & SEO Tools",
    description: "Live word counters, slug converters, case switchers, SERP length checkers, and QR generators.",
    icon: "FileText",
    displayOrder: 10,
  },
  {
    id: 11,
    slug: "date-time",
    name: "Date & Time",
    description: "Calculate date differences, workdays, meeting planners, and custom countdowns.",
    icon: "Clock",
    displayOrder: 11,
  },
  {
    id: 12,
    slug: "automobile",
    name: "Automobile & Travel",
    description: "Car loan calculations, fuel cost estimates, and car depreciation schedules.",
    icon: "Car",
    displayOrder: 12,
  },
  {
    id: 13,
    slug: "astrology",
    name: "Numerology & Names",
    description: "Numerology number reductions and baby name matching calculators.",
    icon: "Sparkles",
    displayOrder: 13,
  },
  {
    id: 14,
    slug: "developer-ai",
    name: "Developer & AI Tools",
    description: "Generate JWT keys, export public shared AI chats to JSON, and inspect data payloads.",
    icon: "Terminal",
    displayOrder: 14,
  }
];

export const toolsFallback: ToolFallback[] = [
  // FINANCE & LOANS
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    categorySlug: "finance",
    shortDesc: "Calculate your Equated Monthly Installment (EMI) for home loans, personal loans, or car loans.",
    metaTitle: "EMI Calculator — Calculate Loan EMI Online",
    metaDescription: "Calculate your monthly home, car, or personal loan Equated Monthly Installment (EMI) instantly with our free online calculator. View complete breakups.",
    introContent: "An Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are applied to both interest and principal each month so that over a specified number of years, the loan is fully paid off.",
    faq: [
      { q: "What is an EMI?", a: "An Equated Monthly Installment (EMI) is a fixed payment made by a borrower to a lender at a specified date each calendar month." },
      { q: "How is EMI calculated?", a: "It is calculated using the formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1], where P is Principal, R is monthly interest rate, and N is monthly tenure." },
      { q: "Does prepaying a loan reduce the EMI?", a: "Yes, prepaying a portion of the principal can either reduce your future EMI amount or shorten your loan tenure, depending on your choice." }
    ],
    displayOrder: 1,
  },
  {
    slug: "sip-calculator",
    name: "SIP Calculator",
    categorySlug: "finance",
    shortDesc: "Calculate the future value of your Mutual Fund investments via Systematic Investment Plan (SIP).",
    metaTitle: "SIP Calculator — Estimate Mutual Fund Returns",
    metaDescription: "Calculate the future value of your monthly mutual fund investments via Systematic Investment Plans (SIP) easily. Plan your financial goals.",
    introContent: "A Systematic Investment Plan (SIP) is an investment route offered by mutual funds wherein one can invest a fixed amount in a chosen scheme periodically. This tool helps you estimate the maturity value of your wealth based on estimated returns.",
    faq: [
      { q: "What is SIP?", a: "Systematic Investment Plan (SIP) is a method of investing a fixed sum regularly in mutual funds." },
      { q: "What are the benefits of SIP?", a: "Key benefits include rupee cost averaging, disciplined saving, and the power of compounding over time." }
    ],
    displayOrder: 2,
  },
  {
    slug: "sip-step-up-calculator",
    name: "SIP Step-up Calculator",
    categorySlug: "finance",
    shortDesc: "Calculate SIP returns when you increase your monthly investment by a fixed percentage every year.",
    metaTitle: "SIP Step-up Calculator — Grow Investments Annually",
    metaDescription: "Calculate maturity amounts when you increase your monthly SIP investment by a fixed percentage yearly. Maximize your financial growth potential.",
    introContent: "An annual step-up or top-up in your SIP investment aligns your savings with salary increases. By adding a small percentage increase annually, you can reach your corpus goals much faster.",
    faq: [
      { q: "What is a Step-up SIP?", a: "It is a strategy where you increase your monthly SIP contribution by a fixed amount or percentage every year." },
      { q: "Why use a Step-up SIP?", a: "It dramatically increases the final corpus compared to a flat SIP because your contribution grows alongside your income." }
    ],
    displayOrder: 3,
  },
  {
    slug: "lumpsum-calculator",
    name: "Lumpsum Calculator",
    categorySlug: "finance",
    shortDesc: "Calculate the maturity value of your one-time mutual fund or stock investments.",
    metaTitle: "Lumpsum Calculator — Calculate Mutual Fund Returns",
    metaDescription: "Calculate the future value of your one-time lumpsum mutual fund or equity investments with our easy-to-use tool.",
    introContent: "Lumpsum investment means investing a significant chunk of money in a scheme at one go. It is common for windfalls, bonuses, or long-term holdings.",
    faq: [
      { q: "What is a lumpsum investment?", a: "A single, one-time investment in a mutual fund or security, rather than recurring weekly or monthly payments." }
    ],
    displayOrder: 4,
  },
  {
    slug: "fd-calculator",
    name: "FD Calculator",
    categorySlug: "finance",
    shortDesc: "Calculate maturity amount and interest earned on Fixed Deposits (FD) with quarterly or monthly compounding.",
    metaTitle: "FD Calculator — Fixed Deposit Interest Calculator",
    metaDescription: "Calculate interest earned and final maturity amount for your bank Fixed Deposits (FD) instantly. Compounding options supported.",
    introContent: "Fixed Deposit is a secure financial instrument offered by banks and NBFCs, offering guaranteed interest rates higher than regular savings accounts until maturity.",
    faq: [
      { q: "How is FD interest calculated?", a: "Most banks calculate interest quarterly using compound interest: A = P(1 + r/n)^(nt), compounding 4 times a year." }
    ],
    displayOrder: 5,
  },
  {
    slug: "rd-calculator",
    name: "RD Calculator",
    categorySlug: "finance",
    shortDesc: "Estimate the maturity value of your Recurring Deposits (RD) with monthly contributions.",
    metaTitle: "RD Calculator — Recurring Deposit Maturity Calculator",
    metaDescription: "Estimate maturity value and interest earned on your bank Recurring Deposit (RD) accounts with standard quarterly compounding.",
    introContent: "Recurring Deposit (RD) is a service provided by banks which helps people with regular incomes to deposit a fixed amount every month and earn interest rates similar to FDs.",
    faq: [
      { q: "How does compounding work in RD?", a: "RD interest compounding is done quarterly in India, even though deposits are made monthly. This is computed using standard banker formulas." }
    ],
    displayOrder: 6,
  },
  {
    slug: "ppf-calculator",
    name: "PPF Calculator",
    categorySlug: "finance",
    shortDesc: "Calculate interest and maturity amount of Public Provident Fund (PPF) accounts over 15 years.",
    metaTitle: "PPF Calculator — Public Provident Fund Returns",
    metaDescription: "Calculate your Public Provident Fund (PPF) interest, maturity value, and loan options over the mandatory 15-year lock-in period.",
    introContent: "Public Provident Fund (PPF) is a popular tax-free savings scheme in India, offering high-security returns backed by the central government. Deposits qualify for tax deductions under Section 80C.",
    faq: [
      { q: "What is the lock-in period for PPF?", a: "PPF accounts have a mandatory lock-in period of 15 years, which can be extended in blocks of 5 years." }
    ],
    displayOrder: 7,
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    categorySlug: "finance",
    shortDesc: "Calculate compound interest with options for daily, monthly, quarterly, or annual compounding.",
    metaTitle: "Compound Interest Calculator — Compound Growth Online",
    metaDescription: "Calculate compound interest online. Choose compounding intervals: daily, monthly, quarterly, half-yearly, or annually, and see compound schedules.",
    introContent: "Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods.",
    faq: [
      { q: "What is compound interest?", a: "Interest earned on interest, which makes investments grow exponentially over time compared to simple interest." }
    ],
    displayOrder: 8,
  },
  {
    slug: "simple-interest-calculator",
    name: "Simple Interest Calculator",
    categorySlug: "finance",
    shortDesc: "Calculate basic simple interest earned or paid on a principal sum over time.",
    metaTitle: "Simple Interest Calculator — Calculate SI Online",
    metaDescription: "Calculate simple interest earned or paid on principal. Free online calculator using the SI = P * R * T / 100 formula.",
    introContent: "Simple interest is a quick method of calculating the interest charge on a loan, determined by multiplying the daily interest rate by the principal by the number of days that elapse between payments.",
    faq: [
      { q: "What is the simple interest formula?", a: "The formula is: Interest = Principal × Rate × Time / 100." }
    ],
    displayOrder: 9,
  },
  {
    slug: "income-tax-calculator",
    name: "Income Tax Calculator",
    categorySlug: "finance",
    shortDesc: "Compare tax liability under the Old vs New Tax Regimes in India with slabs.",
    metaTitle: "Income Tax Calculator — Old vs New Regime Comparison",
    metaDescription: "Compare your income tax liability under the Old and New tax regimes side-by-side. Free tax slab estimator.",
    introContent: "Select your financial year and income details to estimate your tax liability under the Indian income tax slabs for both regimes.",
    faq: [
      { q: "What is the difference between Old and New Regimes?", a: "The Old Regime offers various exemptions (80C, HRA, LTA) with higher rates, while the New Regime has lower rates but eliminates most exemptions." }
    ],
    displayOrder: 10,
  },
  {
    slug: "hra-calculator",
    name: "HRA Calculator",
    categorySlug: "finance",
    shortDesc: "Calculate the tax-exempt portion of your House Rent Allowance (HRA) under Section 10(13A).",
    metaTitle: "HRA Calculator — House Rent Allowance Tax Exemption",
    metaDescription: "Calculate your HRA tax exemption amount under Section 10(13A) of the Income Tax Act. Save tax by submitting rent details.",
    introContent: "House Rent Allowance (HRA) is paid by employers to employees to meet rent expenses. Tax exemption on HRA is calculated under Section 10(13A) based on rent paid, basic salary, and metro/non-metro rules.",
    faq: [
      { q: "How is HRA exemption calculated?", a: "It is the minimum of: 1) Actual HRA received, 2) Rent paid minus 10% of basic salary, 3) 50% of basic (for metros) or 40% (for non-metros)." }
    ],
    displayOrder: 11,
  },
  {
    slug: "gratuity-calculator",
    name: "Gratuity Calculator",
    categorySlug: "finance",
    shortDesc: "Estimate the gratuity amount payable to you upon retirement or resignation after 5 years of service.",
    metaTitle: "Gratuity Calculator — Calculate Gratuity Online",
    metaDescription: "Calculate the gratuity amount payable to employees covered under the Payment of Gratuity Act after 5+ years of continuous service.",
    introContent: "Gratuity is a lump sum payment made by employers to employees as a gesture of appreciation for their service, mandated after 5 years of continuous employment.",
    faq: [
      { q: "Is 5 years mandatory for gratuity?", a: "Yes, an employee must complete a minimum of 5 years of continuous service with an employer to be eligible for gratuity payment." }
    ],
    displayOrder: 12,
  },
  {
    slug: "epf-calculator",
    name: "EPF Calculator",
    categorySlug: "finance",
    shortDesc: "Calculate the maturity corpus of your Employees' Provident Fund (EPF) account at retirement.",
    metaTitle: "EPF Calculator — Employees' Provident Fund Corpus",
    metaDescription: "Calculate the accumulated corpus in your EPF account at retirement based on your current salary, employer contributions, and interest rate.",
    introContent: "Employees' Provident Fund (EPF) is a retirement benefit scheme where both the employee and employer contribute 12% of basic salary. The corpus grows tax-free at rates declared annually by EPFO.",
    faq: [
      { q: "What is the employer's contribution division?", a: "Out of the employer's 12% contribution, 8.33% goes to the Pension Scheme (EPS) and the remaining 3.67% goes to the Provident Fund (EPF)." }
    ],
    displayOrder: 13,
  },
  {
    slug: "capital-gains-tax-calculator",
    name: "Capital Gains Tax Calculator",
    categorySlug: "finance",
    shortDesc: "Estimate LTCG and STCG tax liability for equities, debt mutual funds, or real estate properties.",
    metaTitle: "Capital Gains Tax Calculator — LTCG & STCG Estimator",
    metaDescription: "Calculate Long-Term (LTCG) and Short-Term (STCG) Capital Gains tax on shares, mutual funds, or gold/property sales.",
    introContent: "Capital gains tax is levied on profits from selling capital assets. Rates differ based on the type of asset (shares, debt, real estate) and holding period (short vs long term).",
    faq: [
      { q: "What is STCG vs LTCG?", a: "Short-Term Capital Gains (STCG) occur when assets are sold within a short holding period. Long-Term (LTCG) apply to longer holdings and often have lower tax rates." }
    ],
    displayOrder: 14,
  },
  {
    slug: "gst-calculator",
    name: "GST Calculator",
    categorySlug: "finance",
    shortDesc: "Add or remove GST (Goods and Services Tax) from net prices instantly.",
    metaTitle: "GST Calculator — Calculate Goods & Services Tax Online",
    metaDescription: "Calculate GST amount. Add GST to net price or remove GST from inclusive gross price using customized or pre-defined tax rates.",
    introContent: "GST is an indirect tax used in many countries. This calculator lets you input an initial price and tax slab (5%, 12%, 18%, 28%) to find either the tax-inclusive or tax-exclusive amount.",
    faq: [
      { q: "How do I calculate GST removal?", a: "Formula: GST Amount = Original Cost - [Original Cost × (100 / (100 + GST%))]." }
    ],
    displayOrder: 15,
  },
  {
    slug: "loan-eligibility-calculator",
    name: "Loan Eligibility Calculator",
    categorySlug: "finance",
    shortDesc: "Check maximum loan amount you are eligible for based on income, interest rate, and existing EMIs.",
    metaTitle: "Loan Eligibility Calculator — Check Eligible Loan Amount",
    metaDescription: "Check your maximum eligible home or personal loan amount based on your monthly income, current age, tenure, and existing liabilities.",
    introContent: "Lenders check your debt-to-income ratio (FOIR) to evaluate your loan repayment capacity. Use this tool to find your maximum monthly EMI cap and loan amount.",
    faq: [
      { q: "What is FOIR?", a: "Fixed Obligation to Income Ratio (FOIR) is the percentage of monthly income used to pay active debts. Lenders limit it to 40-50%." }
    ],
    displayOrder: 16,
  },
  {
    slug: "loan-prepayment-calculator",
    name: "Loan Prepayment Calculator",
    categorySlug: "finance",
    shortDesc: "Estimate savings in total interest and reduction in tenure when making lump-sum prepayments.",
    metaTitle: "Loan Prepayment Calculator — Calculate Interest Savings",
    metaDescription: "See how much interest and tenure you save by prepaying principal on your loan. Supports monthly or one-time prepayments.",
    introContent: "Prepaying a part of your outstanding loan principal reduces your outstanding balance, saving significant interest costs and decreasing the remaining loan tenure.",
    faq: [
      { q: "Should I reduce EMI or Tenure?", a: "Reducing tenure usually saves more interest over the long run, whereas reducing EMI decreases immediate monthly pressure." }
    ],
    displayOrder: 17,
  },
  {
    slug: "credit-card-interest-calculator",
    name: "Credit Card Interest Calculator",
    categorySlug: "finance",
    shortDesc: "See how long it will take to pay off credit card debt by paying only the minimum vs extra.",
    metaTitle: "Credit Card Interest Calculator — Payoff Timeline",
    metaDescription: "Calculate how credit card interest builds up and see how long it takes to pay off credit card balances under different monthly payments.",
    introContent: "Credit card companies charge compounding interest rates (often 30-45% annually) on unpaid balances. Learn how paying more than the minimum payment accelerates payoff.",
    faq: [
      { q: "What is the grace period?", a: "The interest-free period between the purchase date and the bill due date. It applies only if the previous statement was paid in full." }
    ],
    displayOrder: 18,
  },
  {
    slug: "rent-vs-buy-calculator",
    name: "Rent vs Buy Calculator",
    categorySlug: "finance",
    shortDesc: "Compare cost of renting a house vs buying it with a home loan over a set term.",
    metaTitle: "Rent vs Buy Calculator — Home Buying Comparison Tool",
    metaDescription: "Compare the net cost of buying a house (principal, interest, maintenance) vs renting it (compounding rent, investing downpayment) to find the breakeven.",
    introContent: "Deciding to buy a home or rent involves comparing loan EMIs, property appreciation, down payments, rent increases, and alternative investment returns.",
    faq: [
      { q: "Is buying always better than renting?", a: "Not necessarily. If property prices appreciate slowly or if loan interest is high, renting and investing the difference can yield higher net worth." }
    ],
    displayOrder: 19,
  },
  {
    slug: "retirement-corpus-calculator",
    name: "Retirement Corpus Calculator",
    categorySlug: "finance",
    shortDesc: "Estimate the nest egg corpus you need at retirement and monthly savings needed to reach it.",
    metaTitle: "Retirement Corpus Calculator — Find Retirement Savings",
    metaDescription: "Calculate the exact financial corpus you will need for retirement based on current expenses, inflation, and estimated life expectancy.",
    introContent: "Inflation erodes purchasing power. A retirement corpus calculator projects your monthly expenses into the future and tells you the exact corpus needed to support yourself.",
    faq: [
      { q: "How is inflation factored into retirement?", a: "Expenses are compounded at an inflation rate (e.g., 6% annually) until retirement, which increases the required corpus." }
    ],
    displayOrder: 20,
  },
  {
    slug: "inflation-calculator",
    name: "Inflation Calculator",
    categorySlug: "finance",
    shortDesc: "Calculate the future value of purchasing power over time given inflation rates.",
    metaTitle: "Inflation Calculator — Historical & Future Purchasing Power",
    metaDescription: "Calculate how inflation affects the value of money over time. Estimate future costs of products or historic purchasing power.",
    introContent: "Inflation is the rate at which the general level of prices for goods and services is rising. This tool computes how the purchasing power of your money changes.",
    faq: [
      { q: "What is average inflation?", a: "Historically, inflation ranges from 2% to 7% depending on the country. India averages around 5-6%." }
    ],
    displayOrder: 21,
  },
  {
    slug: "net-worth-calculator",
    name: "Net Worth Calculator",
    categorySlug: "finance",
    shortDesc: "Summarize your total assets and liabilities to calculate your net worth.",
    metaTitle: "Net Worth Calculator — Calculate Your Net Worth",
    metaDescription: "Calculate your net worth by adding cash, real estate, mutual funds, and subtracting home loans, credit card balances, and other debts.",
    introContent: "Net worth is the value of all the non-financial and financial assets owned by an institutional unit or individual minus the value of all its outstanding liabilities.",
    faq: [
      { q: "How often should I calculate net worth?", a: "Updating it quarterly or semi-annually is sufficient to track your long-term wealth trends." }
    ],
    displayOrder: 22,
  },
  {
    slug: "currency-converter",
    name: "Currency Converter",
    categorySlug: "finance",
    shortDesc: "Convert major global currencies with real-time exchange rates.",
    metaTitle: "Currency Converter — Real-Time Exchange Rates",
    metaDescription: "Convert USD, EUR, INR, GBP, and other global currencies using real-time exchange rates. Free currency converter.",
    introContent: "Convert currency rates using live APIs. Rates update hourly and are cached client-side for performance.",
    faq: [
      { q: "How accurate are the rates?", a: "Rates are pulled from open-source exchange rate APIs. They represent mid-market interbank rates and are not exact retail trading rates." }
    ],
    displayOrder: 23,
  },
  {
    slug: "salary-to-in-hand-calculator",
    name: "Salary/CTC to In-Hand Calculator",
    categorySlug: "finance",
    shortDesc: "Estimate monthly take-home salary from your Cost to Company (CTC) after deductions.",
    metaTitle: "Salary to In-Hand Calculator — CTC Take-Home Estimator",
    metaDescription: "Estimate your monthly in-hand take-home salary from your CTC after deducting Provident Fund (EPF), Professional Tax, and Income Tax.",
    introContent: "Cost to Company (CTC) represents the total expense an employer incurs on an employee. Take-home salary is what you receive in your bank account after mandatory deductions.",
    faq: [
      { q: "Why is in-hand salary lower than CTC?", a: "CTC includes non-cash perks, gratuity provisions, employer PF contributions, and taxes that are deducted before payouts." }
    ],
    displayOrder: 24,
  },
  {
    slug: "business-loan-emi-calculator",
    name: "Business Loan EMI Calculator",
    categorySlug: "finance",
    shortDesc: "Estimate EMIs and total interest payable on business expansion or working capital loans.",
    metaTitle: "Business Loan EMI Calculator — Estimate Business Loan Payments",
    metaDescription: "Calculate monthly installments (EMIs) and interest payable on business loans. Plan working capital budgets.",
    introContent: "Business loans help finance expansion, payroll, or raw materials. Monthly EMIs depend on the business interest rate, which is typically higher than home loans.",
    faq: [
      { q: "Are business loan EMIs tax-deductible?", a: "The interest component of a business loan EMI is treated as a business expense and is tax-deductible." }
    ],
    displayOrder: 25,
  },

  // HEALTH & FITNESS
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    categorySlug: "health",
    shortDesc: "Calculate your Body Mass Index (BMI) to check if you are within a healthy weight range.",
    metaTitle: "BMI Calculator — Check Body Mass Index Online",
    metaDescription: "Calculate your Body Mass Index (BMI) instantly based on height and weight. Free WHO range classifications.",
    introContent: "Body Mass Index (BMI) is a value derived from the mass and height of a person. The BMI is defined as the body mass divided by the square of the body height.",
    faq: [
      { q: "What is a healthy BMI?", a: "According to the WHO, a healthy BMI range is between 18.5 and 24.9." }
    ],
    displayOrder: 26,
  },
  {
    slug: "calorie-calculator",
    name: "Calorie Needs (BMR/TDEE) Calculator",
    categorySlug: "health",
    shortDesc: "Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).",
    metaTitle: "Calorie Calculator — Find BMR & TDEE Online",
    metaDescription: "Calculate daily calorie needs to maintain, lose, or gain weight. Uses Mifflin-St Jeor equation to find TDEE.",
    introContent: "Total Daily Energy Expenditure (TDEE) represents the total amount of calories you burn per day based on your basal metabolism and active physical level.",
    faq: [
      { q: "What is BMR?", a: "Basal Metabolic Rate (BMR) is the minimum energy required to keep your body functioning at rest." }
    ],
    displayOrder: 27,
  },
  {
    slug: "body-fat-calculator",
    name: "Body Fat % Calculator",
    categorySlug: "health",
    shortDesc: "Estimate body fat percentage using US Navy circumference measurements.",
    metaTitle: "Body Fat Calculator — Estimate Body Fat Percentage",
    metaDescription: "Estimate body fat percentage using the US Navy method based on waist, neck, hip, and height measurements.",
    introContent: "The U.S. Navy body fat calculator estimate uses body dimensions to calculate percentage body fat, a key indicator of metabolic fitness.",
    faq: [
      { q: "Is the Navy method accurate?", a: "It is a reliable estimation within 3-4% error margin compared to hydrostatic weighing or DEXA scans, and is highly accessible." }
    ],
    displayOrder: 28,
  },
  {
    slug: "ideal-weight-calculator",
    name: "Ideal Weight Calculator",
    categorySlug: "health",
    shortDesc: "Check your healthy ideal body weight range based on height and gender.",
    metaTitle: "Ideal Weight Calculator — Ideal Weight range by Height",
    metaDescription: "Check your ideal body weight range based on height, age, and gender using classic medical formulas (Devine & Robinson).",
    introContent: "Ideal body weight formulas are used in clinical settings to calculate dosages. They provide a general benchmark for healthy weights.",
    faq: [
      { q: "Which formula is used?", a: "This tool provides results using the Devine formula, which is the clinical standard." }
    ],
    displayOrder: 29,
  },
  {
    slug: "water-intake-calculator",
    name: "Water Intake Calculator",
    categorySlug: "health",
    shortDesc: "Calculate how much water you should drink daily based on weight and activity level.",
    metaTitle: "Water Intake Calculator — Daily Hydration Goal",
    metaDescription: "Calculate how many liters or ounces of water you should drink daily to stay properly hydrated based on body weight and exercise.",
    introContent: "Proper hydration is crucial for energy, brain function, and joint health. Find your customized daily target.",
    faq: [
      { q: "Does coffee count towards hydration?", a: "Yes, mild caffeinated beverages contribute to your total liquid intake, though plain water is preferred." }
    ],
    displayOrder: 30,
  },
  {
    slug: "pregnancy-due-date-calculator",
    name: "Pregnancy Due Date Calculator",
    categorySlug: "health",
    shortDesc: "Estimate pregnancy due date and track baby growth timelines.",
    metaTitle: "Pregnancy Due Date Calculator — Estimate Birth Date",
    metaDescription: "Estimate your baby's due date using Naegele's rule based on your last menstrual period (LMP) date.",
    introContent: "Naegele's rule is a standard way of calculating the due date for a pregnancy by adding 280 days (40 weeks) to the first day of the last menstrual period.",
    faq: [
      { q: "Are due dates exact?", a: "No, only about 4% of babies are born on their exact due date. Most are born within a week before or after." }
    ],
    displayOrder: 31,
  },
  {
    slug: "ovulation-calculator",
    name: "Ovulation Calculator",
    categorySlug: "health",
    shortDesc: "Estimate fertile window and next ovulation cycle dates.",
    metaTitle: "Ovulation Calculator — Find Fertile Days Window",
    metaDescription: "Track your cycle to find your fertile window and estimate ovulation days. Plan conception timelines.",
    introContent: "Ovulation occurs roughly 14 days before the start of the next period. Finding this window helps couples identify peak fertility days.",
    faq: [
      { q: "What is the fertile window?", a: "The 6-day period ending on ovulation day. Conception is most likely during these days." }
    ],
    displayOrder: 32,
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    categorySlug: "health",
    shortDesc: "Calculate age in years, months, weeks, and days based on date of birth.",
    metaTitle: "Age Calculator — Calculate Exact Age Online",
    metaDescription: "Find your exact age in years, months, weeks, days, hours, and minutes from your date of birth to today.",
    introContent: "Find exact dates or age differences between two time periods. Supports leap years and month lengths automatically.",
    faq: [
      { q: "Does this account for leap years?", a: "Yes, the calendar engine tracks leap years and varying month lengths for exact age calculations." }
    ],
    displayOrder: 33,
  },
  {
    slug: "heart-rate-zone-calculator",
    name: "Heart Rate Zone Calculator",
    categorySlug: "health",
    shortDesc: "Calculate target training heart rate zones for burning fat or building endurance.",
    metaTitle: "Heart Rate Zone Calculator — Find Training Zones",
    metaDescription: "Calculate target cardiovascular training zones (Zone 1 to 5) based on your age and resting heart rate.",
    introContent: "Cardio training zones represent intensities of exercise calculated as percentages of your maximum heart rate (Max HR).",
    faq: [
      { q: "What is the fat-burning zone?", a: "Usually Zone 2 (60-70% of Max HR), where the body uses a higher proportion of fat for fuel." }
    ],
    displayOrder: 34,
  },
  {
    slug: "macro-calculator",
    name: "Macro Calculator",
    categorySlug: "health",
    shortDesc: "Calculate daily protein, carbohydrate, and fat targets based on calorie needs.",
    metaTitle: "Macro Calculator — Protein, Carbs, & Fat Targets",
    metaDescription: "Split your TDEE calories into custom gram targets of protein, carbohydrates, and fats to meet muscle-building or fat-loss goals.",
    introContent: "Macronutrient splits help tune body composition. Select your target calorie intake and choose splits like high protein, low carb, or balanced diets.",
    faq: [
      { q: "How many calories are in macros?", a: "Protein and carbs contain 4 calories per gram, while fats contain 9 calories per gram." }
    ],
    displayOrder: 35,
  },

  // EDUCATION & CAREER
  {
    slug: "gpa-calculator",
    name: "GPA Calculator",
    categorySlug: "education",
    shortDesc: "Calculate your semester or cumulative GPA based on course grades and credit hours.",
    metaTitle: "GPA Calculator — Calculate Semester & Cumulative GPA",
    metaDescription: "Calculate your college or high school grade point average (GPA) using custom letter grades and course credits.",
    introContent: "Grade Point Average (GPA) is the average of your accumulated grade points divided by total credits. Add classes to compute sem or cumulative scores.",
    faq: [
      { q: "What is a weighted GPA?", a: "Weighted GPAs account for class difficulty (e.g. AP/IB classes giving 5.0 points instead of 4.0)." }
    ],
    displayOrder: 36,
  },
  {
    slug: "cgpa-to-percentage-converter",
    name: "CGPA to Percentage Converter",
    categorySlug: "education",
    shortDesc: "Convert CGPA to percentage using standard Indian and university formulas.",
    metaTitle: "CGPA to Percentage Converter — CBSE & University Formula",
    metaDescription: "Convert CGPA (Cumulative Grade Point Average) to equivalent percentages. Supports CBSE 9.5 multiplier and custom formulas.",
    introContent: "CBSE and various universities convert CGPA to percentages. This tool applies standard formulas like multiplying CGPA by 9.5.",
    faq: [
      { q: "Why is CBSE multiplier 9.5?", a: "Research of previous board scores mapped average marks matching CGPA ranges to a 9.5 proportion factor." }
    ],
    displayOrder: 37,
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    categorySlug: "education",
    shortDesc: "General purpose percentage calculator for increases, decreases, fractions, and proportions.",
    metaTitle: "Percentage Calculator — Common Percent Operations",
    metaDescription: "Find percentage changes, what X is of Y, percentage discount values, and fractional rates with one simple multi-tool.",
    introContent: "Percentages are dimensions out of 100. This multi-mode calculator helps solve simple percent queries instantly.",
    faq: [
      { q: "How do I calculate percent change?", a: "Formula: [(New Value - Old Value) / Old Value] * 100." }
    ],
    displayOrder: 38,
  },
  {
    slug: "grade-calculator",
    name: "Grade Calculator",
    categorySlug: "education",
    shortDesc: "Calculate current course grade and what score you need on final exams.",
    metaTitle: "Grade Calculator — Find Current & Required Exam Grades",
    metaDescription: "Calculate your weighted class grade using current assignments, tests, and quizzes. Determine required score on finals.",
    introContent: "Input assignment categories and weights (e.g., homework 20%, tests 50%) to track your grade standing or plan final exam efforts.",
    faq: [
      { q: "How are weighted grades computed?", a: "Sum of (Grade earned × Category Weight) divided by total category weights." }
    ],
    displayOrder: 39,
  },
  {
    slug: "attendance-percentage-calculator",
    name: "Attendance Calculator",
    categorySlug: "education",
    shortDesc: "Track your attendance rate and see how many classes you can skip/attend to hit goals.",
    metaTitle: "Attendance Percentage Calculator — Stay Eligible",
    metaDescription: "Calculate attendance percentages. Find how many more lectures you must attend, or can skip, to maintain minimum limits (e.g., 75%).",
    introContent: "Many colleges require a minimum 75% attendance. This calculator helps you manage class attendance without getting debarred.",
    faq: [
      { q: "How do I find classes I can skip?", a: "If current attendance is above target, find maximum skips that keep current present / (total + skips) >= target." }
    ],
    displayOrder: 40,
  },
  {
    slug: "salary-hike-percentage-calculator",
    name: "Salary Hike Calculator",
    categorySlug: "education",
    shortDesc: "Calculate hike percentages from old to new salaries.",
    metaTitle: "Salary Hike Percentage Calculator — Hike Estimator",
    metaDescription: "Calculate your appraisal salary hike percentage or check hike amount based on an expected percentage.",
    introContent: "Calculate the exact percentage increment of your appraisal hike by entering your pre-hike and post-hike salary packages.",
    faq: [
      { q: "What is hike percentage formula?", a: "Formula: [(New Salary - Old Salary) / Old Salary] * 100." }
    ],
    displayOrder: 41,
  },
  {
    slug: "notice-period-calculator",
    name: "Notice Period Calculator",
    categorySlug: "education",
    shortDesc: "Calculate last working day and notice duration left.",
    metaTitle: "Notice Period Calculator — Last Working Day Estimator",
    metaDescription: "Input resignation dates and notice periods in days or months to calculate your exact last working day.",
    introContent: "Resigning from a company requires completing a notice period. Calculate your exit date correctly, taking calendar days into account.",
    faq: [
      { q: "Are holidays counted in notice periods?", a: "Usually notice periods include calendar days (including weekends and holidays), but check your contract." }
    ],
    displayOrder: 42,
  },

  // UNIT & GENERAL CONVERTERS
  {
    slug: "unit-converter",
    name: "Universal Unit Converter",
    categorySlug: "converters",
    shortDesc: "Convert lengths, weights, areas, volume, and temperatures.",
    metaTitle: "Unit Converter — Length, Weight, Area, Temp Conversion",
    metaDescription: "Convert metric and imperial units of length (m, ft, in), weight (kg, lbs), area, volume, and temperatures easily.",
    introContent: "Select a measurement category and input source values to convert them to equivalent international standard units.",
    faq: [
      { q: "What is the difference between Metric and Imperial?", a: "Metric (SI) uses meters and grams based on powers of 10. Imperial uses feet and pounds historically established in the UK/US." }
    ],
    displayOrder: 43,
  },
  {
    slug: "time-zone-converter",
    name: "Time Zone Converter",
    categorySlug: "converters",
    shortDesc: "Convert time between UTC, EST, IST, GMT, and other global zones.",
    metaTitle: "Time Zone Converter — Convert Times Globally",
    metaDescription: "Convert times across multiple local and international time zones. Standardize meeting times.",
    introContent: "Convert local times using standard web localization engines to check time differences.",
    faq: [
      { q: "Does this handle Daylight Saving Time (DST)?", a: "Yes, the standard Intl time engine updates offsets automatically based on DST rules per location." }
    ],
    displayOrder: 44,
  },
  {
    slug: "date-difference-calculator",
    name: "Date Difference Calculator",
    categorySlug: "converters",
    shortDesc: "Count number of days, weeks, months, or years between two dates.",
    metaTitle: "Date Difference Calculator — Count Days Between Dates",
    metaDescription: "Calculate exact duration in days, weeks, months, or years between two selected calendar dates.",
    introContent: "Count the distance between events, anniversaries, or business project sprints easily.",
    faq: [
      { q: "Are start and end dates included?", a: "By default, this counts the net days in between (end date excluded). You can toggle including the end date." }
    ],
    displayOrder: 45,
  },
  {
    slug: "age-in-days-calculator",
    name: "Age in Days/Weeks Converter",
    categorySlug: "converters",
    shortDesc: "See your age expressed entirely in days, weeks, or months.",
    metaTitle: "Age in Days/Weeks/Months Calculator",
    metaDescription: "Convert your age or any duration into total days, total weeks, or total months. Ideal for baby growth or fun milestones.",
    introContent: "See your life length expressed in alternative units like weeks or days. Check off your next 10,000-day birthday!",
    faq: [
      { q: "How many weeks are in a year?", a: "Exactly 52 weeks and 1 day (or 2 days in a leap year)." }
    ],
    displayOrder: 46,
  },
  {
    slug: "number-to-words-converter",
    name: "Number to Words Converter",
    categorySlug: "converters",
    shortDesc: "Convert numbers or currency sums into plain text spelling.",
    metaTitle: "Number to Words Converter — Spelling numbers",
    metaDescription: "Convert digit numbers (e.g. 15420) into spelled text English words. Indian (Lakhs) and International (Millions) scales supported.",
    introContent: "Writing cheques or banking slips requires writing currency amounts in words. Avoid errors by converting digit entries to written words.",
    faq: [
      { q: "What is the difference between Indian and Western scales?", a: "Western scale groups digits in thousands (million, billion). Indian scale groups digits in pairs after the first thousand (lakh, crore)." }
    ],
    displayOrder: 47,
  },
  {
    slug: "roman-numeral-converter",
    name: "Roman Numeral Converter",
    categorySlug: "converters",
    shortDesc: "Convert Roman letters (like XIV) to normal numbers and vice-versa.",
    metaTitle: "Roman Numeral Converter — Decimals to Roman Numerals",
    metaDescription: "Convert decimal integers (1-3999) to Roman numerals, or parse Roman letters back into standard numbers.",
    introContent: "Roman numerals were used in ancient Rome. They use combinations of letters from the Latin alphabet (I, V, X, L, C, D, M).",
    faq: [
      { q: "What is XIV in numbers?", a: "XIV is 14. X = 10, IV = 4." }
    ],
    displayOrder: 48,
  },
  {
    slug: "data-storage-converter",
    name: "Data Storage Converter",
    categorySlug: "converters",
    shortDesc: "Convert bytes, KB, MB, GB, TB, and PB in binary or decimal scales.",
    metaTitle: "Data Storage Converter — Bytes to Megabytes/Gigabytes",
    metaDescription: "Convert storage metrics. Understand difference between base-2 binary units (KiB, MiB) and base-10 decimal units (KB, MB).",
    introContent: "Hard drive manufacturers use decimal scales (1 GB = 1,000,000,000 bytes) while operating systems use binary scales (1 GiB = 1,073,741,824 bytes).",
    faq: [
      { q: "What is a GiB vs GB?", a: "GB is gigabyte (10^9 bytes), while GiB is gibibyte (2^30 bytes). GiB is larger by about 7%." }
    ],
    displayOrder: 49,
  },
  {
    slug: "speed-converter",
    name: "Speed Converter",
    categorySlug: "converters",
    shortDesc: "Convert speeds between km/h, mph, m/s, and knots.",
    metaTitle: "Speed Converter — km/h, mph, m/s Conversion",
    metaDescription: "Convert speed values between kilometers per hour (km/h), miles per hour (mph), meters per second (m/s), and nautical knots.",
    introContent: "Convert speeds for automotive travel, physics calculations, or nautical navigation wind metrics.",
    faq: [
      { q: "What is 1 knot?", a: "One knot is 1 nautical mile per hour, which equals exactly 1.852 km/h or approximately 1.15 mph." }
    ],
    displayOrder: 50,
  },

  // MATH & UTILITY
  {
    slug: "percentage-increase-calculator",
    name: "Percentage Increase/Decrease Calculator",
    categorySlug: "math",
    shortDesc: "Find percentage changes between an old value and a new value.",
    metaTitle: "Percentage Increase Calculator — Percent Difference",
    metaDescription: "Calculate the percentage increase or decrease from one value to another. Ideal for stock prices, weight changes, and metrics.",
    introContent: "Compute rate ratios or percentage additions between two dates or values.",
    faq: [
      { q: "How is percentage decrease calculated?", a: "Formula: [(Old Value - New Value) / Old Value] * 100." }
    ],
    displayOrder: 51,
  },
  {
    slug: "ratio-calculator",
    name: "Ratio Calculator",
    categorySlug: "math",
    shortDesc: "Simplify ratios or solve for missing values in proportions.",
    metaTitle: "Ratio Calculator — Simplify & Solve Proportions",
    metaDescription: "Simplify ratio proportions (e.g. 10:15 to 2:3) or find missing variables (e.g. A:B = C:D).",
    introContent: "Ratios compare the sizes of two or more values. Simplify ratios using Greatest Common Divisors (GCD).",
    faq: [
      { q: "What is a proportion?", a: "A statement that two ratios are equal, written as A:B = C:D." }
    ],
    displayOrder: 52,
  },
  {
    slug: "average-calculator",
    name: "Average Calculator",
    categorySlug: "math",
    shortDesc: "Find Mean, Median, and Mode of a set of numbers.",
    metaTitle: "Average Calculator — Find Mean, Median, & Mode",
    metaDescription: "Calculate the arithmetic mean, median value, and popular modes from a list of numbers. Step-by-step breakdowns.",
    introContent: "Averages find central points in datasets. This tool calculates mean, median, mode, and ranges of input sets.",
    faq: [
      { q: "What is the difference between Mean and Median?", a: "Mean is the sum of items divided by count. Median is the middle number when items are sorted." }
    ],
    displayOrder: 53,
  },
  {
    slug: "standard-deviation-calculator",
    name: "Standard Deviation Calculator",
    categorySlug: "math",
    shortDesc: "Calculate population and sample standard deviation and variance.",
    metaTitle: "Standard Deviation Calculator — Step-by-Step",
    metaDescription: "Calculate standard deviation and variance for sample or population datasets. View step-by-step deviations.",
    introContent: "Standard deviation measures dispersion in a dataset. Low deviation means numbers are close to the mean, while high deviation means values spread out.",
    faq: [
      { q: "When do I use sample vs population standard deviation?", a: "Use sample SD when your data is a small subset of a larger population. Use population SD when you have every data point." }
    ],
    displayOrder: 54,
  },
  {
    slug: "fraction-calculator",
    name: "Fraction Calculator",
    categorySlug: "math",
    shortDesc: "Add, subtract, multiply, and divide fractions and simplify.",
    metaTitle: "Fraction Calculator — Add, Subtract, & Divide Fractions",
    metaDescription: "Perform arithmetic on fractions. Add, subtract, multiply, or divide common fractions and get simplified results.",
    introContent: "Perform calculations on proper and improper fractions. View step-by-step common denominators.",
    faq: [
      { q: "What is a proper fraction?", a: "A fraction where the numerator (top) is smaller than the denominator (bottom), like 3/4." }
    ],
    displayOrder: 55,
  },
  {
    slug: "scientific-calculator",
    name: "Scientific Calculator",
    categorySlug: "math",
    shortDesc: "Advanced browser-based scientific calculator for algebraic and trigonometric functions.",
    metaTitle: "Scientific Calculator — Free Online Math Tool",
    metaDescription: "Use our advanced online scientific calculator. Supports sine, cosine, tangents, log, brackets, and exponents.",
    introContent: "Perform advanced mathematical operations client-side with proper algebraic operator precedence.",
    faq: [
      { q: "Is this secure?", a: "Yes, all calculation logic runs in your browser without communicating with any external servers." }
    ],
    displayOrder: 56,
  },
  {
    slug: "random-number-generator",
    name: "Random Number Generator",
    categorySlug: "math",
    shortDesc: "Generate random numbers within a custom range, with or without repeats.",
    metaTitle: "Random Number Generator — Pick Numbers Randomly",
    metaDescription: "Generate random integer or decimal numbers within a custom range. Ideal for sweepstakes, games, or math.",
    introContent: "Pick random numbers using cryptographically secure random number generators.",
    faq: [
      { q: "Are these numbers truly random?", a: "They use standard browser crypto generators which are cryptographically secure, unlike basic pseudorandom scripts." }
    ],
    displayOrder: 57,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    categorySlug: "math",
    shortDesc: "Generate secure, random passwords with custom lengths and characters.",
    metaTitle: "Password Generator — Secure Passwords Online",
    metaDescription: "Create strong random passwords with custom lengths. Toggle capital letters, lowercase, numbers, and special symbols.",
    introContent: "Password security is crucial. Generate passwords client-side. No passwords are sent to or saved on any servers.",
    faq: [
      { q: "What makes a password strong?", a: "A length of 12+ characters, combining letters, digits, and symbols, and avoiding dictionary words." }
    ],
    displayOrder: 58,
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    categorySlug: "math",
    shortDesc: "Count words, characters, sentences, paragraphs, and reading times live.",
    metaTitle: "Word Counter — Count Words & Characters Online",
    metaDescription: "Count words, characters, sentences, paragraphs, and reading times for your text files or copy-paste content.",
    introContent: "Get real-time word statistics for SEO tags, essays, or social media text boundaries.",
    faq: [
      { q: "How is reading time computed?", a: "Calculated based on an average reading speed of 225 words per minute." }
    ],
    displayOrder: 59,
  },

  // REAL ESTATE
  {
    slug: "home-loan-affordability-calculator",
    name: "Home Loan Affordability Calculator",
    categorySlug: "real-estate",
    shortDesc: "Calculate how much house you can afford based on monthly income and down payments.",
    metaTitle: "Home Loan Affordability Calculator — How Much House Can I Afford?",
    metaDescription: "Estimate your home buying budget. Calculate affordable home purchase price based on income, monthly liabilities, and cash reserves.",
    introContent: "Check your maximum home purchase limit using rent-to-income benchmarks.",
    faq: [
      { q: "What is the 28/36 rule?", a: "A guideline stating that households should spend maximum 28% of gross income on housing costs, and maximum 36% on total debt payments." }
    ],
    displayOrder: 60,
  },
  {
    slug: "stamp-duty-calculator",
    name: "Stamp Duty Calculator",
    categorySlug: "real-estate",
    shortDesc: "Estimate stamp duty and registration fees on property purchases by state.",
    metaTitle: "Stamp Duty Calculator — Property Registration Fees",
    metaDescription: "Estimate stamp duty and registration charges on real estate property purchases across major Indian states.",
    introContent: "Stamp duty is a tax transaction fee levied by state governments when you buy a property. Charges vary by gender, location (urban/rural), and state.",
    faq: [
      { q: "Are stamp duty fees tax-deductible?", a: "Yes, under Section 80C, individual buyers can claim tax benefits on stamp duty and registration costs up to 1.5 Lakhs in the year of purchase." }
    ],
    displayOrder: 61,
  },
  {
    slug: "property-tax-calculator",
    name: "Property Tax Calculator",
    categorySlug: "real-estate",
    shortDesc: "Estimate property tax based on annual rental value and rate guidelines.",
    metaTitle: "Property Tax Calculator — Estimate Municipal Tax",
    metaDescription: "Estimate municipal property taxes. General calculation template based on property value, built-up area, and location tier.",
    introContent: "Property tax is paid by property owners to local municipal corporations. Rules vary by city, building type, and occupancy status.",
    faq: [
      { q: "How is property tax computed?", a: "Municipalities use various methods including Unit Area System, Capital Value System, or Annual Rental Value System." }
    ],
    displayOrder: 62,
  },
  {
    slug: "rental-yield-calculator",
    name: "Rental Yield Calculator",
    categorySlug: "real-estate",
    shortDesc: "Calculate gross and net rental yields on real estate property investments.",
    metaTitle: "Rental Yield Calculator — Property Investment Returns",
    metaDescription: "Calculate gross and net rental yields for real estate investments. Subtract maintenance, taxes, and empty months.",
    introContent: "Rental yield measures the cash return of a rental property relative to its purchase value. Compare properties to find high yields.",
    faq: [
      { q: "What is a good rental yield?", a: "Residential yields typically average 2-3% in India, whereas commercial properties can range from 7% to 10%." }
    ],
    displayOrder: 63,
  },

  // BUSINESS & FREELANCE
  {
    slug: "freelance-rate-calculator",
    name: "Freelance Rate Calculator",
    categorySlug: "business",
    shortDesc: "Calculate what hourly or project rate you should charge as a freelancer to meet goals.",
    metaTitle: "Freelance Rate Calculator — Hourly & Project Rates",
    metaDescription: "Determine what hourly rate to charge based on your desired salary, annual expenses, billable hours, and tax obligations.",
    introContent: "Freelancing requires budgeting for taxes, health insurance, vacations, and unbillable admin days. Check your necessary rates.",
    faq: [
      { q: "How do I find billable hours?", a: "Subtract vacations, public holidays, sick days, and non-billable hours (marketing, admin, proposals) from total working hours." }
    ],
    displayOrder: 64,
  },
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    categorySlug: "business",
    shortDesc: "Generate downloadable PDF invoices for clients, 100% in your browser.",
    metaTitle: "Free Invoice Generator — Download PDF Invoices",
    metaDescription: "Create clean professional PDF invoices client-side. Fill out items, tax percentages, and download directly without signup.",
    introContent: "Fill in company details, client info, billable tasks, and tax rates. Download a print-ready PDF invoice instantly.",
    faq: [
      { q: "Is my invoice data saved?", a: "No, all invoice details stay in your browser memory and are never saved to external servers." }
    ],
    displayOrder: 65,
  },
  {
    slug: "break-even-calculator",
    name: "Break-even Point Calculator",
    categorySlug: "business",
    shortDesc: "Calculate how many sales you need to cover your fixed and variable costs.",
    metaTitle: "Break-even Point Calculator — Business Sales Volume",
    metaDescription: "Calculate your business break-even volume (units to sell) or break-even revenue based on fixed costs and unit margins.",
    introContent: "The break-even point is the level of sales at which total revenues equal total expenses, resulting in zero profit or loss.",
    faq: [
      { q: "What is contribution margin?", a: "The unit selling price minus unit variable costs. It is the portion of sales revenue that helps cover fixed expenses." }
    ],
    displayOrder: 66,
  },
  {
    slug: "profit-margin-calculator",
    name: "Profit Margin Calculator",
    categorySlug: "business",
    shortDesc: "Calculate gross, operating, and net profit margins based on revenue and costs.",
    metaTitle: "Profit Margin Calculator — Calculate Business Margins",
    metaDescription: "Find your gross profit margin percentage based on cost of goods sold (COGS) and sales revenue.",
    introContent: "Profit margin represents what percentage of sales revenue becomes profit. It is a key indicator of business health.",
    faq: [
      { q: "What is gross profit margin?", a: "Formula: [(Revenue - Cost of Goods Sold) / Revenue] * 100." }
    ],
    displayOrder: 67,
  },
  {
    slug: "markup-calculator",
    name: "Markup Calculator",
    categorySlug: "business",
    shortDesc: "Calculate selling prices or markup percentages based on cost prices.",
    metaTitle: "Markup Calculator — Cost Markup to Selling Price",
    metaDescription: "Calculate markup percentages or find selling prices based on product cost. Understand difference between markup and margin.",
    introContent: "Markup is the ratio of profit to cost, while profit margin is the ratio of profit to selling price. Use this tool to prevent margins mistakes.",
    faq: [
      { q: "What is the difference between markup and margin?", a: "Markup is calculated relative to cost price, while margin is calculated relative to selling price." }
    ],
    displayOrder: 68,
  },
  {
    slug: "roi-calculator",
    name: "ROI (Return on Investment) Calculator",
    categorySlug: "business",
    shortDesc: "Calculate total and annualized returns on assets or projects.",
    metaTitle: "ROI Calculator — Return on Investment Return",
    metaDescription: "Calculate total Return on Investment (ROI) and annualized ROI for projects, stocks, or marketing campaigns.",
    introContent: "Return on Investment (ROI) is a ratio used to evaluate the efficiency or profitability of an investment.",
    faq: [
      { q: "How is annualized ROI calculated?", a: "Annualized ROI accounts for holding periods, calculated as: [(Ending Value / Starting Value)^(1 / Years)] - 1." }
    ],
    displayOrder: 69,
  },
  {
    slug: "cagr-calculator",
    name: "CAGR Calculator",
    categorySlug: "business",
    shortDesc: "Calculate the Compound Annual Growth Rate (CAGR) of investments over time.",
    metaTitle: "CAGR Calculator — Compound Annual Growth Rate",
    metaDescription: "Calculate the Compound Annual Growth Rate (CAGR) for stocks, business revenues, or investment growth over years.",
    introContent: "CAGR represents the smoothed annual rate of return that would be required for an investment to grow from its beginning balance to its ending balance, assuming profits compound.",
    faq: [
      { q: "What does CAGR tell you?", a: "It represents a geometric progression ratio that provides a single smoothed annual return rate, making it easier to compare investments." }
    ],
    displayOrder: 70,
  },

  // INSURANCE
  {
    slug: "term-insurance-calculator",
    name: "Term Insurance Estimator",
    categorySlug: "insurance",
    shortDesc: "Estimate monthly premiums for term life insurance based on coverage requirements.",
    metaTitle: "Term Insurance Premium Calculator — Estimate Quotes",
    metaDescription: "Estimate monthly premium charges for term insurance coverages based on age, lifestyle, and sum assured requirements.",
    introContent: "Term life insurance provides financial coverage to beneficiaries for a set term. Get a preliminary premium estimate.",
    faq: [
      { q: "Why do smokers pay higher premiums?", a: "Smokers have higher actuarial mortality risks, leading insurers to charge higher risk premiums." }
    ],
    displayOrder: 71,
  },
  {
    slug: "life-insurance-calculator",
    name: "Life Insurance Coverage Calculator",
    categorySlug: "insurance",
    shortDesc: "Calculate how much life insurance coverage you need to secure your family's future.",
    metaTitle: "Life Insurance Calculator — How Much Cover Do I Need?",
    metaDescription: "Calculate your recommended life insurance cover amount using the Human Life Value (HLV) method based on income and debts.",
    introContent: "Calculate necessary coverage amounts to replace income, pay off active loans, and secure college funds for kids.",
    faq: [
      { q: "What is the Human Life Value method?", a: "A method calculating cover based on future earnings potential, taking annual income, active years, and inflation into account." }
    ],
    displayOrder: 72,
  },
  {
    slug: "car-insurance-idv-calculator",
    name: "Car Insurance IDV Calculator",
    categorySlug: "insurance",
    shortDesc: "Calculate Insured Declared Value (IDV) of your car based on age and price.",
    metaTitle: "Car Insurance IDV Calculator — Calculate IDV Online",
    metaDescription: "Find your car's Insured Declared Value (IDV) based on age depreciation rates. Essential for policy renewals.",
    introContent: "Insured Declared Value (IDV) is the maximum sum assured fixed by insurers, reflecting the market value of your vehicle after depreciation.",
    faq: [
      { q: "What is IDV depreciation scale?", a: "Standard scales: Up to 6 months: 5%, 1 year: 15%, 2 years: 20%, 3 years: 30%, 4 years: 40%, 5 years: 50%." }
    ],
    displayOrder: 73,
  },
  {
    slug: "health-insurance-calculator",
    name: "Health Insurance Coverage Calculator",
    categorySlug: "insurance",
    shortDesc: "Check recommended health insurance coverage limits based on family size.",
    metaTitle: "Health Insurance Calculator — Recommended Cover limits",
    metaDescription: "Calculate recommended family health insurance coverage amounts based on age, city tier, and size.",
    introContent: "Calculate suggested family floater coverages to manage medical inflation and rising treatment costs in your city tier.",
    faq: [
      { q: "What is a family floater plan?", a: "A plan covering multiple family members under a single shared sum assured pool." }
    ],
    displayOrder: 74,
  },

  // CRYPTO & STOCKS
  {
    slug: "crypto-profit-calculator",
    name: "Crypto Profit Calculator",
    categorySlug: "crypto-stocks",
    shortDesc: "Calculate return on investment (ROI) and profits for cryptocurrency trades.",
    metaTitle: "Crypto Profit Calculator — Calculate returns",
    metaDescription: "Calculate profits or losses for Bitcoin, Ethereum, and crypto tokens. Add purchase price, sell price, and transaction fees.",
    introContent: "Calculate net returns on cryptocurrency trades after subtracting buy and sell transaction fees.",
    faq: [
      { q: "Are crypto profits taxed?", a: "Yes, in many jurisdictions (such as India's 30% VDA tax), crypto profits are taxed at flat rates without deductions." }
    ],
    displayOrder: 75,
  },
  {
    slug: "stock-dca-calculator",
    name: "Stock DCA Calculator",
    categorySlug: "crypto-stocks",
    shortDesc: "Calculate average purchase price for stocks or crypto across multiple buy entries.",
    metaTitle: "Stock DCA Calculator — Average Buy Price",
    metaDescription: "Calculate average cost basis across multiple buy entries. Track stock and crypto dollar-cost averaging.",
    introContent: "Dollar-cost averaging (DCA) averages out purchase prices across market cycles. Enter transaction logs to find weighted cost bases.",
    faq: [
      { q: "What is the benefit of DCA?", a: "It removes emotional timing mistakes and lowers average purchase costs when markets fall." }
    ],
    displayOrder: 76,
  },
  {
    slug: "dividend-yield-calculator",
    name: "Dividend Yield Calculator",
    categorySlug: "crypto-stocks",
    shortDesc: "Calculate dividend yields of stocks based on payout rates.",
    metaTitle: "Dividend Yield Calculator — Stock Dividend Returns",
    metaDescription: "Calculate dividend yield percentages based on annual dividends paid per share and current stock market price.",
    introContent: "Dividend yield measures cash returns paid by a company relative to its share price.",
    faq: [
      { q: "Is a higher dividend yield always better?", a: "Not always. Extremely high yields can indicate a falling stock price or unsustainable dividend payouts." }
    ],
    displayOrder: 77,
  },
  {
    slug: "pe-ratio-calculator",
    name: "P/E Ratio Calculator",
    categorySlug: "crypto-stocks",
    shortDesc: "Calculate Price-to-Earnings (P/E) ratio to evaluate stock valuations.",
    metaTitle: "P/E Ratio Calculator — Stock Valuation Tool",
    metaDescription: "Calculate Price-to-Earnings (P/E) ratios for stocks based on share price and Earnings Per Share (EPS).",
    introContent: "P/E ratio evaluates if a stock is overvalued or undervalued relative to its peer averages.",
    faq: [
      { q: "What is trailing vs forward P/E?", a: "Trailing P/E uses previous year earnings. Forward P/E uses estimated analyst forecasts of next year earnings." }
    ],
    displayOrder: 78,
  },

  // TEXT & SEO TOOLS
  {
    slug: "case-converter",
    name: "Case Converter",
    categorySlug: "seo-text",
    shortDesc: "Convert text cases between UPPERCASE, lowercase, Title Case, and Sentence case.",
    metaTitle: "Case Converter — UPPERCASE, lowercase, Title Case",
    metaDescription: "Convert text case formats online. Support sentence case, title cases, upper and lowercase transformations.",
    introContent: "Change capitalization formats easily. Clear, copy, or convert text inputs in your browser.",
    faq: [
      { q: "Is my text private?", a: "Yes, all case conversions are processed locally in your browser and are never transmitted to external servers." }
    ],
    displayOrder: 79,
  },
  {
    slug: "text-to-slug-converter",
    name: "Text to Slug/URL Converter",
    categorySlug: "seo-text",
    shortDesc: "Generate SEO-friendly URL slugs from normal text.",
    metaTitle: "Text to Slug Converter — Generate URL Slugs Online",
    metaDescription: "Convert title text strings into SEO-friendly, clean URL slugs. Replaces spaces with hyphens and strips special characters.",
    introContent: "Slugs are lowercase, URL-safe identifiers used in blog posts and page paths.",
    faq: [
      { q: "What makes a slug SEO friendly?", a: "Being lowercase, short, using hyphens instead of spaces, and incorporating primary keywords." }
    ],
    displayOrder: 80,
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    categorySlug: "seo-text",
    shortDesc: "Generate placeholder Latin dummy text for layouts and mocks.",
    metaTitle: "Lorem Ipsum Generator — Placeholder Text Generator",
    metaDescription: "Generate standard Lorem Ipsum placeholder paragraphs, sentences, or word sets for web design layouts.",
    introContent: "Lorem Ipsum is standard dummy text used in printing and typesetting since the 1500s.",
    faq: [
      { q: "Why is Lorem Ipsum used?", a: "It distributes letters normally, avoiding distractions caused by readable copy." }
    ],
    displayOrder: 81,
  },
  {
    slug: "reading-time-calculator",
    name: "Reading Time Calculator",
    categorySlug: "seo-text",
    shortDesc: "Calculate estimated reading time based on text word count.",
    metaTitle: "Reading Time Calculator — Estimate Reading Speeds",
    metaDescription: "Estimate reading times for blog posts, essays, or articles based on total word count and custom reading speeds.",
    introContent: "Find out how long it will take readers to consume your written content.",
    faq: [
      { q: "What is the average reading speed?", a: "Most adults read between 200 and 250 words per minute (WPM)." }
    ],
    displayOrder: 82,
  },
  {
    slug: "meta-tag-length-checker",
    name: "Meta Tag Length Checker",
    categorySlug: "seo-text",
    shortDesc: "Check character counts and preview Google SERP layouts.",
    metaTitle: "Meta Tag Length Checker — Google SERP Preview Tool",
    metaDescription: "Check character lengths for page title and meta description tags. Preview snippets in desktop Google search mocks.",
    introContent: "Avoid snippet truncation in search rankings by keeping titles under 60 characters and descriptions under 160 characters.",
    faq: [
      { q: "Why does Google truncate snippets?", a: "Google limits titles based on pixel width (~600px) which maps to roughly 60 characters." }
    ],
    displayOrder: 83,
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    categorySlug: "seo-text",
    shortDesc: "Create custom QR codes for URLs, text, or phone numbers.",
    metaTitle: "QR Code Generator — Free Online QR Code Maker",
    metaDescription: "Generate custom QR codes for text, URLs, and phone numbers in your browser. Download as high-quality PNGs.",
    introContent: "Quick Response (QR) codes store data scanned by mobile cameras. Generate QR images instantly.",
    faq: [
      { q: "Do these QR codes expire?", a: "No, these are static QR codes that contain direct text data. They will function forever as long as the destination URL is active." }
    ],
    displayOrder: 84,
  },

  // DATE & TIME
  {
    slug: "countdown-timer",
    name: "Countdown Timer",
    categorySlug: "date-time",
    shortDesc: "Create live countdown timers for deadlines or events.",
    metaTitle: "Countdown Timer — Custom Event Countdown",
    metaDescription: "Create a live countdown timer showing remaining days, hours, minutes, and seconds to a selected date.",
    introContent: "Create customizable screens to count down to holidays, exams, launches, or deadlines.",
    faq: [
      { q: "Is this persistent?", a: "Yes, you can bookmark the URL with your target time query to share countdowns with colleagues." }
    ],
    displayOrder: 85,
  },
  {
    slug: "working-days-calculator",
    name: "Working Days Calculator",
    categorySlug: "date-time",
    shortDesc: "Calculate net working days between dates, excluding weekends.",
    metaTitle: "Working Days Calculator — Net Business Days",
    metaDescription: "Calculate net business working days between two dates, excluding Saturdays, Sundays, and custom holidays.",
    introContent: "Calculate project durations or payroll periods by finding the net working days in a date range.",
    faq: [
      { q: "Are Saturdays counted as working days?", a: "By default, this tool excludes both Saturdays and Sundays, but you can customize weekend rules." }
    ],
    displayOrder: 86,
  },
  {
    slug: "timezone-meeting-planner",
    name: "Time Zone Meeting Planner",
    categorySlug: "date-time",
    shortDesc: "Find overlapping working hours across multiple time zones.",
    metaTitle: "Time Zone Meeting Planner — Plan International Meetings",
    metaDescription: "Map global working hour overlaps across time zones (EST, IST, GMT, PST) to find convenient meeting hours.",
    introContent: "Planning meetings across distributed teams requires finding overlapping business hours. Clear visual grids make it simple.",
    faq: [
      { q: "What are typical business hours?", a: "Standard overlaps are calculated matching typical 9 AM to 5 PM shifts per location." }
    ],
    displayOrder: 87,
  },

  // AUTOMOBILE
  {
    slug: "car-loan-emi-calculator",
    name: "Car Loan EMI Calculator",
    categorySlug: "automobile",
    shortDesc: "Calculate EMIs and interest amortization tables for vehicle financing.",
    metaTitle: "Car Loan EMI Calculator — Estimate Auto Loans",
    metaDescription: "Calculate Equated Monthly Installments (EMIs) for car loans. Review amortization schedules.",
    introContent: "Estimate auto loan payments. Car loans often have fixed terms from 3 to 7 years with interest rates matching vehicle risk.",
    faq: [
      { q: "Can I prepay car loans?", a: "Many banks allow prepayments after 12 months, though some charge prepayment fees." }
    ],
    displayOrder: 88,
  },
  {
    slug: "fuel-cost-calculator",
    name: "Fuel Cost Calculator",
    categorySlug: "automobile",
    shortDesc: "Calculate total fuel costs and volumes needed for road trips.",
    metaTitle: "Fuel Cost Calculator — Estimate Trip Expenses",
    metaDescription: "Calculate necessary fuel volumes and costs for journeys based on travel distance, fuel price, and vehicle mileage.",
    introContent: "Estimate travel costs for business travel billing or budget road trip fuel spending.",
    faq: [
      { q: "How is fuel cost calculated?", a: "Formula: (Distance / Mileage) × Fuel Price." }
    ],
    displayOrder: 89,
  },
  {
    slug: "car-depreciation-calculator",
    name: "Car Depreciation Calculator",
    categorySlug: "automobile",
    shortDesc: "Estimate your vehicle's resale value and yearly depreciation schedule.",
    metaTitle: "Car Depreciation Calculator — Resale Value Estimator",
    metaDescription: "Estimate car value depreciation over time. Compute resale values using standard declining balance methods.",
    introContent: "Cars lose value rapidly. Calculate estimated resale values based on age and standard depreciation percentages.",
    faq: [
      { q: "How fast do new cars deprecate?", a: "Usually 15-20% in the first year, and roughly 10% each year after that." }
    ],
    displayOrder: 90,
  },

  // ASTROLOGY / ADJACENT
  {
    slug: "numerology-calculator",
    name: "Numerology Calculator",
    categorySlug: "astrology",
    shortDesc: "Calculate your Life Path Number and expression values based on birthdates.",
    metaTitle: "Numerology Calculator — Life Path & Name Numbers",
    metaDescription: "Calculate your numerology Life Path numbers based on birth dates, or name letters using Pythagorean methods.",
    introContent: "Numerology translates birthdates and names into numbers (1-9, 11, 22) representing characteristics and pathways.",
    faq: [
      { q: "What is a Life Path Number?", a: "The sum of your birth month, day, and year reduced to a single digit or master number." }
    ],
    displayOrder: 91,
  },
  {
    slug: "baby-name-numerology-generator",
    name: "Baby Name Numerology Generator",
    categorySlug: "astrology",
    shortDesc: "Analyze name numerology numbers to select lucky baby names.",
    metaTitle: "Baby Name Numerology Calculator",
    metaDescription: "Calculate names' numerological numbers to check alignments with birth dates. Pick numerology-friendly baby names.",
    introContent: "Enter proposed baby names to calculate their expression numbers and check fits with target destiny values.",
    faq: [
      { q: "What does name numerology represent?", a: "Each letter is assigned a number (A=1, B=2, etc.). The sum represents personality expression potential." }
    ],
    displayOrder: 92,
  },
  {
    slug: "ai-chat-to-json",
    name: "AI Chat Exporter",
    categorySlug: "developer-ai",
    shortDesc: "Export public shared AI chats (ChatGPT, Claude, xAI) into a downloadable structured JSON file.",
    metaTitle: "AI Chat Exporter — Convert Public AI Shared Link to JSON",
    metaDescription: "Convert public shared conversation links from ChatGPT, Claude, and xAI into clean, downloadable JSON structures instantly.",
    introContent: "Enter a public shared link from any major AI chat platform to parse the conversation thread and download it as structured JSON data.",
    faq: [
      { q: "Which platforms are supported?", a: "ChatGPT, Claude, and xAI share links. You can also paste raw HTML or transcript text if CORS blocks direct fetches." },
      { q: "Is my data private?", a: "Yes. All parsing happens entirely in your browser; no links or conversation content are ever sent to our servers." }
    ],
    displayOrder: 93,
  },
  {
    slug: "jwt-secret-generator",
    name: "JWT Secret Generator",
    categorySlug: "developer-ai",
    shortDesc: "Generate cryptographically secure high-entropy secrets for JWT validation.",
    metaTitle: "JWT Secret Generator — Secure Keys for Token Authentication",
    metaDescription: "Generate cryptographically secure 256-bit, 384-bit, or 512-bit secrets encoded in Base64, Hex, or Plain text for JWT.",
    introContent: "JWT authentication requires secure, high-entropy secret keys. Generate random, cryptographically secure keys of custom lengths and encodings.",
    faq: [
      { q: "What key size is recommended for HS256?", a: "HMAC-SHA256 requires a key size of at least 256 bits (32 bytes). Larger keys are even more secure." },
      { q: "How are these keys generated?", a: "The tool uses your browser's window.crypto API for cryptographically secure pseudo-random number generation." }
    ],
    displayOrder: 94,
  }
];
