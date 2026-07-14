# ToolHub Project Memory

This file serves as a persistent record of the development progress, completed features, architecture decisions, and remaining roadmap for **ToolHub**.

---

## 1. Project Overview
* **Name:** ToolHub (Calculators & Converters Suite)
* **Framework:** Astro (Latest stable, hybrid output mode)
* **Styling:** Tailwind CSS (shadcn/ui adapted for Astro via `@astrojs/react`)
* **Database & ORM:** Neon Postgres (serverless) + Drizzle ORM (used exclusively for metadata management like custom intro copy, display order, active/inactive flags, and FAQs).
* **Calculator Logic:** 100% browser-rendered (pure Client-side React components) for speed, caching, and privacy.

---

## 2. Completed Milestones & Built Tools
We have successfully mapped, built, and verified **94 out of 94** total planned tools across **14 categories**. All built tools compile cleanly during the Astro static route pre-rendering phase.

### Mapped and Custom-Built Tools (94/94)

#### A. Initial Tools (16)
* **Finance:**
  * `emi-calculator` (EMI Calculator)
  * `sip-calculator` (SIP Calculator)
  * `sip-step-up-calculator` (SIP Step-up Calculator)
  * `lumpsum-calculator` (Lumpsum Calculator)
  * `fd-calculator` (FD Calculator)
  * `rd-calculator` (RD Calculator)
  * `compound-interest-calculator` (Compound Interest Calculator)
  * `simple-interest-calculator` (Simple Interest Calculator)
  * `salary-to-in-hand-calculator` (Salary to In-Hand Calculator)
  * `gst-calculator` (GST Calculator)
  * `inflation-calculator` (Inflation Calculator)
* **Health & Fitness:**
  * `bmi-calculator` (BMI Calculator)
* **Education & Career:**
  * `gpa-calculator` (GPA Calculator)
  * `percentage-calculator` (Percentage Calculator)
* **Unit & General Converters:**
  * `unit-converter` (Unit Converter)
* **Math & Utility:**
  * `scientific-calculator` (Scientific Calculator)

#### B. Newly Implemented Finance & Loans Category (14)
* **Finance:**
  * `ppf-calculator` (PPF Calculator)
  * `income-tax-calculator` (Income Tax Calculator - side-by-side New vs Old Regime comparison with FY 2025-26 & FY 2026-27 tax rates)
  * `hra-calculator` (HRA Exemption Calculator)
  * `gratuity-calculator` (Gratuity Calculator)
  * `epf-calculator` (EPF Maturity Calculator)
  * `capital-gains-tax-calculator` (Capital Gains Tax Calculator - Equity/STCG/LTCG, Debt, Real Estate)
  * `loan-eligibility-calculator` (Loan Eligibility Calculator)
  * `loan-prepayment-calculator` (Loan Prepayment / Tenure-reduction Calculator)
  * `credit-card-interest-calculator` (Credit Card Interest Payoff Simulator)
  * `rent-vs-buy-calculator` (Rent vs Buy Verdict Tool)
  * `retirement-corpus-calculator` (Retirement Corpus SIP Estimator)
  * `net-worth-calculator` (Assets & Liabilities Net Worth Tracker)
  * `business-loan-emi-calculator` (Commercial Business EMI Calculator)
  * `currency-converter` (Live Currency Converter fetching open.er-api.com exchanges rates)

#### C. Newly Implemented Health, Education, Converters, Math, Real Estate, Business, Insurance, Crypto/Stocks, Text/SEO, Date/Time, Auto, Astrology, & Developer-AI Categories (64)
* **Health & Fitness (9):**
  * `calorie-calculator` (Calorie Needs BMR/TDEE)
  * `body-fat-calculator` (Body Fat % Calculator using US Navy Method)
  * `ideal-weight-calculator` (Ideal Weight Calculator using Devine/Robinson/Miller formulas)
  * `water-intake-calculator` (Water Intake Calculator with activity offset)
  * `pregnancy-due-date-calculator` (Pregnancy Due Date Naegele's rule)
  * `ovulation-calculator` (Ovulation fertile window Finder)
  * `age-calculator` (Age Calculator)
  * `heart-rate-zone-calculator` (Heart Rate Zone Karvonen tracker)
  * `macro-calculator` (Macro split calculator by goals)
* **Education & Career (5):**
  * `cgpa-to-percentage-converter` (CGPA to Percentage)
  * `grade-calculator` (Grade Calculator & reverse-final need check)
  * `attendance-percentage-calculator` (Attendance Calculator - target skips/attends)
  * `salary-hike-percentage-calculator` (Salary Hike calculator)
  * `notice-period-calculator` (Notice Period Date Calculator)
* **Unit & General Converters (7):**
  * `time-zone-converter` (Time Zone Converter using Intl standard offset)
  * `date-difference-calculator` (Date Difference Calendar days gap)
  * `age-in-days-calculator` (Age in Days/Weeks/Months)
  * `number-to-words-converter` (Number to Words Converter - Indian & International scales)
  * `roman-numeral-converter` (Bidirectional Roman Numeral Converter)
  * `data-storage-converter` (Data Storage base-2 & base-10 converter)
  * `speed-converter` (Speed Converter)
* **Math & Utility (8):**
  * `percentage-increase-calculator` (Percentage Increase/Decrease)
  * `ratio-calculator` (Ratio Simplifier & Proportion solver)
  * `average-calculator` (Mean, Median, Mode, Range)
  * `standard-deviation-calculator` (Standard Deviation sample & population)
  * `fraction-calculator` (Fraction arithmetic & simplifier)
  * `random-number-generator` (Random Number Generator)
  * `password-generator` (Configurable cryptographically-random Password Generator)
  * `word-counter` (Word, character, sentence, paragraph & reading-time counter)
* **Real Estate (4):**
  * `home-loan-affordability-calculator` (Home Loan Affordability reverse EMI)
  * `stamp-duty-calculator` (State-wise Indian Stamp Duty and Registration)
  * `property-tax-calculator` (Property Tax with rebate discount)
  * `rental-yield-calculator` (Gross & Net Rental Yield)
* **Business & Freelance (7):**
  * `freelance-rate-calculator` (Freelance hourly/daily rate calculator)
  * `invoice-generator` (PDF-download Invoice Builder using client-side jsPDF)
  * `break-even-calculator` (Break-even Point Calculator)
  * `profit-margin-calculator` (Profit Margin & Markup Calculator)
  * `roi-calculator` (ROI & Annualized ROI Calculator)
  * `cagr-calculator` (CAGR growth Calculator)
* **Insurance (4):**
  * `term-insurance-calculator` (Term Insurance Premium lookup)
  * `life-insurance-calculator` (Human Life Value Calculator)
  * `car-insurance-idv-calculator` (Car Insurance IDV Depreciation schedules)
  * `health-insurance-calculator` (Health Insurance Coverage need index)
* **Crypto & Stocks (4):**
  * `crypto-profit-calculator` (Crypto Profit/Loss with buy/sell fees)
  * `stock-dca-calculator` (Stock DCA running average)
  * `dividend-yield-calculator` (Dividend Yield)
  * `pe-ratio-calculator` (P/E Ratio)
* **Text & SEO Tools (6):**
  * `case-converter` (Uppercase, Lowercase, Title Case, Sentence Case)
  * `text-to-slug-converter` (URL slugify)
  * `lorem-ipsum-generator` (Lorem Ipsum latin generator)
  * `reading-time-calculator` (Content reading duration)
  * `meta-tag-length-checker` (SERP meta title & description width preview)
  * `qr-code-generator` (Online QR Code Generator with image download)
* **Date & Time (3):**
  * `countdown-timer` (Live countdown timer)
  * `working-days-calculator` (Workdays date diff excluding weekends/holidays)
  * `timezone-meeting-planner` (Time Zone Meeting Planner grid)
* **Automobile & Travel (3):**
  * `car-loan-emi-calculator` (Car Loan EMI Calculator)
  * `fuel-cost-calculator` (Fuel Cost Estimator)
  * `car-depreciation-calculator` (Car Depreciation declining-balance schedule)
* **Numerology & Astrology-adjacent (2):**
  * `numerology-calculator` (Numerology Life Path DOB & expression calculations)
  * `baby-name-numerology-generator` (Baby Name Numerology vibration matching)
* **Developer & AI Tools (2):**
  * `ai-chat-to-json` (Parses public shared AI links like ChatGPT, Claude, and xAI and downloads as clean JSON)
  * `jwt-secret-generator` (Generates secure high-entropy JWT secrets in Base64, Hex, or UTF-8 formats)

---

## 3. Architecture & Implementation Decisions
1. **URL-Driven Route Navigation:** All 13 combined category switchers (e.g. `HealthCalculators.tsx`, `DateTimeCalculators.tsx`, etc.) use native HTML `<a>` routing links instead of state-based buttons. They sync the slug prop via `useEffect`. This ensures search engine crawlers discover and index all 94 tools, allows deep bookmarking, and preserves back/forward browser history while utilizing Astro's Client Router (View Transitions) for instant, seamless page loads.
2. **Modular Business Logic:** Logic formulas are separated into clean, framework-agnostic helper libraries under `src/lib/calculators/` (e.g. `health-calculators.ts`, `converters-calculators.ts`), enabling 100% client-side computing.
3. **Adaptive Sponsor Banners:** The `AdSlot.astro` component features 4 custom-tailored layouts (Skyscraper 300x600, Rectangle 300x250, Horizontal Banner 728x90, In-Feed Strip 728x70) promoting DevHub AI and InterviewGenie with premium animated gradient themes. An inline client script detects active Google AdSense iframe injection to dynamically collapse sponsor banners when live ads are served.
