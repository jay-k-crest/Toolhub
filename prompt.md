# ToolHub — Master Build Prompt

Paste this entire document into your code agent (Antigravity / Gemini CLI / Claude Code) as the build spec. It is self-contained: architecture, design system, SEO rules, database schema, admin panel spec, and the full tool list with calculation logic.

---

## 1. Project Overview

Build a multi-tool calculator website called **ToolHub** (placeholder name — replace with final domain name) using **Astro**. The site hosts 60+ free browser-based calculators/converters across Finance, Health, Education, Converters, Math/Utility, Real Estate, Business, Insurance, Crypto/Stocks, Text/SEO tools, Date/Time, and Automobile categories.

Primary goals, in priority order:
1. **SEO** — every tool page must be independently rankable in Google for its target keyword.
2. **Speed** — near-zero JS on pages that don't need it; Core Web Vitals in the green.
3. **AdSense-ready layout** — content-first, ad slots that don't violate Google's policies (no ads above calculator, no accidental clicks).
4. **Low maintenance** — admin can edit tool copy/FAQ/status without a redeploy.

---

## 2. Tech Stack

- **Framework:** Astro (latest stable), output mode: **hybrid** (static by default, server-rendered only for `/admin/*` and API routes)
- **UI components:** shadcn/ui, adapted for Astro via the React integration (`@astrojs/react`) — use shadcn components only inside islands that need interactivity (calculators, admin forms). Static content (headers, footers, FAQ text, category pages) stays plain Astro components with zero JS.
- **Styling:** Tailwind CSS (shadcn's default), with a custom design token layer (see Section 6)
- **Icons:** `lucide-react` (shadcn's default icon set) for interactive islands; inline SVG or `lucide-astro` for static markup
- **Database:** Neon Postgres (serverless Postgres) — see Section 3
- **ORM:** Drizzle ORM (lightweight, works cleanly with Neon's serverless driver and Astro's server endpoints)
- **Hosting:** Vercel or Netlify (both support Astro hybrid rendering + edge functions well)
- **Analytics:** Google Analytics 4 + Google Search Console verification
- **Ads:** Google AdSense (auto ads disabled — use manual placements per Section 8)
- **No authentication library** — see Section 4 for the minimal admin gate

---

## 3. Database — What It's For and What It's Not For

**Do NOT use the database for calculator logic.** Every calculation (EMI, BMI, GPA, etc.) runs 100% client-side in the browser. No user inputs are ever sent to a server. This keeps tool pages fast, cacheable, and privacy-friendly (relevant for AdSense trust signals).

**Use Neon Postgres only for:**
- Tool metadata that admin can edit without redeploying: title, meta description, intro copy, FAQ items, category, `is_active` flag, display order
- Category metadata: name, slug, description, icon
- Contact/feedback form submissions
- (Optional, future) blog/article content if you add a content marketing layer later

### Schema (Drizzle)

```
tools
  id            serial primary key
  slug          text unique not null        -- "emi-calculator"
  name          text not null                -- "EMI Calculator"
  category_id   integer references categories(id)
  short_desc    text                         -- for card/listing use
  meta_title    text
  meta_description text
  intro_content text                         -- rendered above the calculator
  faq           jsonb                        -- [{q, a}, ...]
  is_active     boolean default true
  display_order integer default 0
  created_at    timestamp default now()
  updated_at    timestamp default now()

categories
  id            serial primary key
  slug          text unique not null         -- "finance"
  name          text not null                -- "Finance & Loans"
  description   text
  icon          text                         -- lucide icon name
  display_order integer default 0

contact_submissions
  id            serial primary key
  name          text
  email         text
  message       text
  created_at    timestamp default now()
  is_read       boolean default false
```

At build time, static tool pages fetch their metadata from Neon (via Astro's server-side data fetching at build, using ISR/on-demand revalidation on Vercel, or a simple cache-and-rebuild webhook triggered when admin saves changes). Fall back to hardcoded defaults if a tool row doesn't exist yet, so the site works even before the DB is seeded.

---

## 4. Admin Panel & Access Control

No user accounts, no signup flow. Single admin gate:

- Route: `/admin` (Astro server-rendered, not statically generated)
- Login: single password field, checked against `ADMIN_PASSWORD` env variable
- On success, set an HttpOnly, Secure, signed session cookie (use a small HMAC signing helper, not a full auth library) with a reasonable expiry (e.g. 7 days)
- Middleware on all `/admin/*` routes checks the cookie signature server-side; redirect to `/admin/login` if invalid/missing
- No password reset flow needed — it's a single owner-operated panel; rotate the env var manually if needed

### Admin panel screens
1. **Dashboard** — tool count, active/inactive count, recent contact submissions, quick links
2. **Tools list** — table (shadcn `Table`) with search/filter by category, toggle `is_active` inline, edit button
3. **Tool editor** — form (shadcn `Form` + `Input` + `Textarea`) to edit name, slugs, meta title/description, intro content (markdown textarea), FAQ (repeatable q/a fields), category, display order
4. **Categories** — simple CRUD list
5. **Contact submissions** — read-only inbox, mark as read

Keep this panel visually plain — it's a tool, not a marketing surface. Use shadcn defaults with minimal custom styling, dark sidebar nav, light content area.

---

## 5. SEO — Non-Negotiable Requirements

- **URL structure:** `/{category-slug}/{tool-slug}` — e.g. `/finance/emi-calculator`. No query params, no IDs in URLs.
- **One `<h1>` per page**, matching the primary keyword (e.g. "EMI Calculator — Calculate Loan EMI Online").
- **Meta title/description** unique per page, pulled from the DB, with sane fallback templates: `{Tool Name} — Free Online {Category} Tool | ToolHub`.
- **Canonical tags** on every page, self-referencing.
- **Open Graph + Twitter Card** meta tags on every page (title, description, a generated OG image per category is fine — doesn't need to be per-tool).
- **JSON-LD structured data:**
  - `WebApplication` or `SoftwareApplication` schema on every tool page (name, description, applicationCategory, operatingSystem: "Any", offers with price 0)
  - `FAQPage` schema on every tool page, generated from the tool's `faq` jsonb field — this is your featured-snippet play
  - `BreadcrumbList` schema on every page (Home → Category → Tool)
  - `Organization` schema on the homepage
- **Sitemap:** auto-generated via `@astrojs/sitemap`, submitted to Search Console. Include all tool pages, category pages, and static pages. Exclude `/admin/*`.
- **robots.txt:** allow all except `/admin/*` and `/api/*`.
- **Internal linking:** every tool page has a "Related Tools" section (3-4 tools from the same category) and every category page lists all its tools. No orphan pages.
- **Heading hierarchy:** H1 (tool name) → H2 (how it works / formula explanation / FAQ heading) → H3 (individual FAQ questions). Never skip levels.
- **Image alt text:** required on every image, descriptive, includes relevant keyword naturally (not stuffed).
- **Content minimum:** every tool page needs 300-500 words of genuinely useful surrounding content (what it is, how the formula works, a worked example) — thin calculator-with-no-context pages get filtered by Google's quality systems and also get rejected by AdSense review.
- **Core Web Vitals:** LCP < 2.5s, CLS near 0 (reserve space for ad slots so they don't shift layout on load), INP < 200ms. Achieved by: static HTML for all non-interactive content, islands hydrated with `client:visible` (not `client:load`) wherever the calculator isn't immediately above the fold, no render-blocking web fonts (use `font-display: swap` + self-hosted fonts via `@fontsource`).
- **Required static pages for AdSense approval:** `/about`, `/contact`, `/privacy-policy`, `/terms-of-service`. AdSense will reject the site without these.

---

## 6. Design System

### Colors
Finance-adjacent tool sites should read as **trustworthy, clean, calm** — not flashy. Use a restrained palette:

```
--background:      #FAFAFA (light) / #0B0F14 (dark)
--foreground:      #14181F (light) / #E7EAEE (dark)
--primary:         #1E4FD8   (deep indigo-blue — trust, finance)
--primary-foreground: #FFFFFF
--accent:          #10B981   (emerald — used for "positive" results, success states)
--muted:           #6B7280   (neutral gray for secondary text)
--border:          #E5E7EB (light) / #1F2937 (dark)
--destructive:     #DC2626   (used sparingly — validation errors only)
--card:            #FFFFFF (light) / #111827 (dark)
```

Implement both light and dark mode via Tailwind's `dark:` classes + shadcn's theme provider. Default to system preference. Toggle in the header.

### Typography
- **Body/UI font:** Inter (via `@fontsource/inter`) — excellent readability at small sizes, standard for data-heavy UI
- **Heading font:** Manrope or Geist (via `@fontsource`) — slightly more distinctive than Inter for H1/H2, still highly legible
- Base size 16px, line-height 1.6 for body copy, tighter (1.2-1.3) for headings
- Numeric results in calculators use `font-variant-numeric: tabular-nums` so digits don't jitter as values update

### Icons
`lucide-react` / `lucide-astro`, 20-24px in UI chrome, 32-40px for category cards. One consistent icon per category (e.g. `Landmark` for Finance, `HeartPulse` for Health, `GraduationCap` for Education, `Ruler` for Converters, `Calculator` for Math, `Home` for Real Estate).

### Buttons
Use shadcn `Button` variants as-is:
- `default` (primary indigo) — main calculate/submit actions
- `outline` — secondary actions (reset, clear)
- `ghost` — tertiary/nav actions
- `destructive` — only for delete actions in admin
Rounded corners: `rounded-lg` (8px), consistent across all interactive elements.

### Animation
Keep it minimal and functional, not decorative:
- Astro's native **View Transitions API** (`<ViewTransitions />`) for page-to-page navigation — smooth cross-fade, no custom JS needed
- Result values animate with a brief count-up/fade-in when a calculator produces a new result (small `framer-motion`-free CSS transition or a tiny custom hook — don't pull in a full animation library for this)
- Hover states: subtle `transition-colors duration-150` on buttons/links, no bouncing or scaling effects
- No auto-playing animations, no scroll-triggered reveals — they hurt perceived performance and add nothing for a utility site

### Layout & Spacing
- Max content width: `1200px` container, centered
- Tool page layout: single column, max `720px` width for the calculator + content itself (readability), with a `300px` sticky sidebar ad slot on desktop (hidden below `lg` breakpoint)
- Consistent spacing scale: Tailwind defaults (4px base unit), sections separated by `py-12` to `py-16`
- Cards (shadcn `Card`) for: calculator container, related-tools grid items, category grid items, FAQ accordion wrapper

---

## 7. Site Architecture / Routes

```
/                                  → Homepage
/{category}/                      → Category landing page (e.g. /finance/)
/{category}/{tool-slug}/          → Individual tool page
/about/
/contact/
/privacy-policy/
/terms-of-service/
/sitemap.xml                      → auto-generated
/robots.txt

/admin/login/                     → admin password gate
/admin/                           → dashboard (protected)
/admin/tools/                     → tools list (protected)
/admin/tools/[id]/                → tool editor (protected)
/admin/categories/                → categories CRUD (protected)
/admin/contact/                   → contact inbox (protected)

/api/admin/*                      → server endpoints for admin CRUD (protected, session-checked)
/api/contact                      → public POST endpoint for contact form
```

Folder structure:
```
src/
  components/
    ui/              ← shadcn components live here (generated via shadcn CLI)
    calculators/     ← one component per tool's interactive logic
    layout/          ← Header, Footer, Sidebar, AdSlot, Breadcrumbs
    shared/          ← ToolCard, CategoryCard, FaqAccordion, RelatedTools
  layouts/
    BaseLayout.astro     ← html shell, meta tags, fonts, header/footer
    ToolLayout.astro     ← wraps BaseLayout, adds breadcrumb, ad slots, FAQ schema
    AdminLayout.astro
  pages/
    (routes as above)
  lib/
    db.ts             ← Drizzle + Neon client
    schema.ts         ← Drizzle schema (Section 3)
    auth.ts           ← admin session sign/verify helpers
    calculators/       ← pure calculation functions, one file per tool, framework-agnostic and unit-testable
  content/
    tools-static-fallback.ts  ← hardcoded fallback copy if DB is empty
```

---

## 8. Page-by-Page Layout Specs

### Homepage (`/`)
- Hero: H1 "Free Online Calculators & Tools", subheading, search bar (client-side fuzzy search across all tool names — no backend needed, ship a small JSON index)
- Category grid: 12 cards (icon, name, tool count, short description), 3-4 per row responsive
- "Most Popular Tools" section: 8-10 tool cards, manually curated or sorted by (future) view count
- Ad slot: one in-feed unit after the category grid
- Footer: sitemap-style link list of every category, About/Contact/Privacy links, copyright

### Category page (`/{category}/`)
- H1: category name, 200-300 word intro paragraph (SEO content, explains what these tools are for)
- Grid of all tools in that category (shadcn `Card`, icon + name + one-line description)
- Ad slot: sidebar (desktop) or in-feed (mobile) after every 6 tool cards
- Breadcrumb: Home → Category

### Tool page (`/{category}/{tool}/`) — the core template
1. Breadcrumb (Home → Category → Tool)
2. H1: tool name
3. **The calculator itself**, above the fold, no ads before it
4. Result display area with the animated count-up value, `tabular-nums`
5. Ad slot #1: directly below the calculator result (highest-engagement placement, compliant since it's after functional content)
6. "How it works" section (H2) — formula explanation + one worked example, 300-500 words
7. Ad slot #2: mid-content, after the explanation
8. FAQ accordion (shadcn `Accordion`) — 4-6 Q&As, feeds the FAQPage schema
9. Related Tools grid (3-4 cards from same category)
10. Ad slot #3: sidebar, sticky on desktop, hidden on mobile

### Admin pages
Plain, functional, shadcn defaults, dark sidebar nav with category/tools/contact links, no marketing polish needed.

---

## 9. shadcn/ui Components to Install

```
button, card, input, textarea, label, select, tabs, accordion, table,
form, dialog, dropdown-menu, badge, separator, tooltip, sonner (toast),
switch, slider
```

Install via `npx shadcn@latest add [component]` after setting up `@astrojs/react` and Tailwind. Use React islands (`client:visible` / `client:idle`) only for components needing interactivity — static shadcn markup (e.g. `Badge`, `Card` wrapping static content) should render as plain Astro/HTML with Tailwind classes copied from shadcn's output, not shipped as React, to avoid unnecessary JS.

---

## 10. Full Tool List with Calculation Logic

> Note for the agent: implement each calculation as a pure function in `src/lib/calculators/{slug}.ts`, fully unit-testable, no side effects. UI components call these functions on input change.

### Finance & Loans

- **EMI Calculator** — `EMI = P × r × (1+r)^n / ((1+r)^n − 1)` where P = principal, r = monthly interest rate (annual/12/100), n = tenure in months. Show total interest = (EMI × n) − P.
- **SIP Calculator** — Future value = `P × ({[1 + i]^n – 1} / i) × (1 + i)` where P = monthly investment, i = expected monthly return rate, n = number of months.
- **SIP Step-up Calculator** — same as above but P increases by a fixed % annually; calculate year-by-year, compounding the increased contribution.
- **Lumpsum Calculator** — `FV = P × (1 + r)^n`, P = principal, r = annual rate, n = years (compounding annually or per selected frequency).
- **FD Calculator** — `A = P × (1 + r/n)^(n×t)`, standard compound interest with selectable compounding frequency (quarterly is typical for Indian FDs).
- **RD Calculator** — `M = R × [(1+i)^n – 1] / (1 – (1+i)^(-1/3))` (standard Indian RD formula) — or implement via month-by-month simulation for clarity/accuracy, which is easier to verify.
- **PPF Calculator** — year-by-year simulation: each year's balance = previous balance + annual contribution, then apply the current PPF interest rate (keep this as an editable constant since it changes by government notification).
- **Compound Interest Calculator** — `A = P(1 + r/n)^(nt)`, generic, user selects compounding frequency.
- **Simple Interest Calculator** — `SI = P × r × t / 100`.
- **Income Tax Calculator (Old vs New Regime)** — implement current slab structures for both regimes as configurable arrays (tax brackets change yearly — store as a config object, not hardcoded inline, so it's a one-line update each budget cycle). Compute tax for both regimes, show side-by-side comparison and which is better for the entered income.
- **HRA Calculator** — exemption = minimum of (actual HRA received, rent paid − 10% of basic salary, 50%/40% of basic salary depending on metro/non-metro).
- **Gratuity Calculator** — `Gratuity = (15 × last drawn salary × years of service) / 26` (for employees covered under the Payment of Gratuity Act).
- **EPF Calculator** — simulate month-by-month: employee contributes 12% of basic, employer contributes 12% (split between EPF/EPS per rules), apply current EPF interest rate monthly/annually.
- **Capital Gains Tax Calculator (LTCG/STCG)** — differentiate by asset type (equity vs debt vs real estate) and holding period thresholds; apply current LTCG/STCG rates (configurable constants).
- **GST Calculator** — `GST amount = (Original price × GST rate) / 100`; support both "add GST" and "remove GST from inclusive price" modes.
- **Loan Eligibility Calculator** — based on income, existing EMIs, and a configurable FOIR (Fixed Obligation to Income Ratio, typically 40-50%): `Max EMI = (Income × FOIR%) − existing EMIs`, then reverse-calculate max loan amount from that EMI using the EMI formula.
- **Loan Prepayment/Foreclosure Calculator** — recompute remaining tenure or remaining EMI given a lump-sum prepayment against outstanding principal, using standard amortization schedule logic.
- **Credit Card Interest Calculator** — daily/monthly compounding on outstanding balance, typically `Interest = Outstanding × (Annual rate/365) × days`, simulate minimum-payment scenarios.
- **Rent vs Buy Calculator** — compare total cost of renting (rent × years, with annual rent increase %) vs buying (down payment + EMI × years + maintenance − appreciation), show breakeven point.
- **Retirement Corpus Calculator** — future value needed = `(annual expenses at retirement × (1 − (1+inflation)^-years_in_retirement / real_return))`, standard retirement-corpus formula; then back-calculate required monthly SIP to reach that corpus.
- **Inflation Calculator** — `Future value = Present value × (1 + inflation rate)^years`.
- **Net Worth Calculator** — simple sum: total assets − total liabilities, with a form for multiple line items each.
- **Currency Converter** — client-side fetch from a free exchange-rate API (e.g. exchangerate-api.com or open.er-api.com) at request time, cache for a few hours client-side to limit API calls.
- **Salary/CTC to In-Hand Calculator** — deduct PF, professional tax, and tax (using the income tax calculator logic) from CTC to estimate monthly take-home; clearly label as an estimate since actual structures vary by employer.

### Health & Fitness

- **BMI Calculator** — `BMI = weight(kg) / height(m)²`, show WHO category (underweight/normal/overweight/obese).
- **Calorie Needs (BMR/TDEE)** — Mifflin-St Jeor: `BMR = 10×weight(kg) + 6.25×height(cm) − 5×age + 5` (men) or `−161` (women); `TDEE = BMR × activity multiplier` (1.2 sedentary through 1.9 very active).
- **Body Fat % Calculator** — US Navy method using neck/waist/height (and hip for women) circumference measurements, standard logarithmic formula.
- **Ideal Weight Calculator** — Devine formula: men `50kg + 2.3kg × (height in inches − 60)`; women `45.5kg + 2.3kg × (height in inches − 60)`.
- **Water Intake Calculator** — simple: `weight(kg) × 0.033 = liters/day`, adjustable for activity level.
- **Pregnancy Due Date Calculator** — Naegele's rule: last menstrual period date + 280 days.
- **Ovulation Calculator** — estimate ovulation as cycle length − 14 days from next period start; show fertile window.
- **Age Calculator** — exact years/months/days between DOB and today (careful with leap years — use a date library, don't hand-roll).
- **Heart Rate Zone Calculator** — max HR = `220 − age` (or Tanaka formula `208 − 0.7×age`), zones as percentages of max HR.
- **Macro Calculator** — split TDEE into protein/carb/fat grams based on selected goal (cut/maintain/bulk) and macro ratio.

### Education & Career

- **GPA Calculator** — weighted average: `Σ(grade points × credit hours) / Σ(credit hours)`, user adds course rows dynamically.
- **CGPA to Percentage Converter** — standard Indian formula `Percentage = CGPA × 9.5` (note: this varies by university — flag as an estimate).
- **Percentage Calculator** — general purpose: X is what % of Y, and % of X, and % increase between X and Y — build as one multi-mode tool.
- **Grade Calculator** — given scores and weights per assessment, compute weighted final grade; also support "what score do I need on the final" reverse mode.
- **Attendance Percentage Calculator** — `attended/total × 100`, plus reverse mode: "how many more classes can I miss and stay above X%".
- **Salary Hike Percentage Calculator** — `((New − Old)/Old) × 100`.
- **Notice Period Calculator** — add notice period days/months to last working day, account for weekends/holidays if a calendar is provided (keep v1 simple — calendar days only).

### Unit & General Converters

- **Length/Weight/Temperature/Area/Volume converters** — standard conversion factor tables; build as one generic `UnitConverter` component parameterized by a units config object per category, not 5 separate components.
- **Time Zone Converter** — use `Intl.DateTimeFormat` with timeZone options, no external API needed.
- **Date Difference Calculator** — days/weeks/months/years between two dates.
- **Age in Days/Months/Years** — subset of Age Calculator, can share the same underlying function.
- **Number to Words Converter** — standard recursive number-to-words algorithm, support Indian (lakh/crore) and international (million/billion) numbering systems as a toggle.
- **Roman Numeral Converter** — standard bidirectional algorithm (integer ↔ Roman numeral), range 1-3999.
- **Data Storage Converter** — bit/byte/KB/MB/GB/TB/PB, powers of 1024 (clarify binary vs decimal — offer both).
- **Speed Converter** — km/h, mph, m/s, knots — simple factor table.

### Math & Utility

- **Percentage Increase/Decrease Calculator** — `((New − Old)/Old) × 100`, signed result.
- **Ratio Calculator** — simplify A:B via GCD, and solve proportions (A:B = C:?).
- **Average Calculator** — mean, median, mode from a list of numbers entered.
- **Standard Deviation Calculator** — population and sample SD, show formula breakdown step-by-step (good for the "how it works" SEO content).
- **Fraction Calculator** — add/subtract/multiply/divide fractions, simplify results via GCD.
- **Scientific Calculator** — standard operator precedence, use a small expression-parser (e.g. write a simple recursive-descent parser — do not use `eval()`).
- **Random Number Generator** — min/max range, integer or decimal, optional "no repeats" mode for generating a set.
- **Password Generator** — configurable length + character sets (upper/lower/numbers/symbols), use `crypto.getRandomValues()` not `Math.random()` for actual randomness quality.
- **Word/Character Counter** — live count of words, characters (with/without spaces), sentences, paragraphs, and estimated reading time as you type.

### Real Estate

- **Home Loan Affordability Calculator** — reverse-EMI: given desired monthly payment and rate/tenure, back-calculate max loan amount.
- **Stamp Duty Calculator** — property value × state-specific stamp duty rate (store rates as a configurable per-state table — these change by state government notification).
- **Property Tax Calculator** — varies heavily by municipality; implement a generic `(Annual value × rate%)` formula with a disclaimer that actual local rules vary, and show it as an estimate tool.
- **Rental Yield Calculator** — `Gross yield = (Annual rent / Property value) × 100`; also compute net yield subtracting annual expenses.

### Business & Freelance

- **Freelance Rate Calculator** — `Hourly rate = (Desired annual income + annual expenses) / billable hours per year`, with a billable-hours estimator (working days − time off − non-billable admin time).
- **Invoice Generator** — client-side form (client name, line items, tax, totals) that generates a downloadable PDF using a lightweight client-side PDF library (e.g. `jspdf`) — no backend storage needed, purely client-side generation and download.
- **Break-even Point Calculator** — `Break-even units = Fixed costs / (Price per unit − Variable cost per unit)`.
- **Profit Margin Calculator** — `Margin % = (Revenue − Cost) / Revenue × 100`.
- **Markup Calculator** — `Markup % = (Selling price − Cost) / Cost × 100`.
- **ROI Calculator** — `ROI % = (Gain − Cost) / Cost × 100`, with optional annualized ROI for multi-year investments.
- **CAGR Calculator** — `CAGR = (End value / Start value)^(1/years) − 1`.
- **Business Loan EMI Calculator** — same formula as EMI Calculator, separate page for keyword targeting ("business loan emi calculator" ranks separately from "home loan emi calculator").

### Insurance

- **Term Insurance Premium Estimator** — rough estimate based on age, sum assured, term, and smoker status against a simplified rate table (clearly labeled as an estimate, not a quote).
- **Life Insurance Coverage Calculator** — Human Life Value method: `(Annual income × years to retirement) − existing coverage + outstanding liabilities`.
- **Car Insurance / IDV Calculator** — IDV = manufacturer's listed selling price − depreciation (depreciation % by vehicle age, standard IRDAI table).
- **Health Insurance Coverage Calculator** — simple rule-of-thumb estimator based on city tier, family size, and age of oldest member against a coverage-multiplier table.

### Crypto & Stocks

- **Crypto Profit/Loss Calculator** — `(Sell price − Buy price) × quantity − fees`, show % return.
- **Stock DCA (Dollar-Cost Averaging) Calculator** — running weighted average price across multiple buy entries the user adds.
- **Dividend Yield Calculator** — `(Annual dividend per share / Current share price) × 100`.
- **P/E Ratio Calculator** — `Share price / Earnings per share`.

### Text/SEO Tools

- **Case Converter** — upper/lower/title/sentence case transformations, pure string functions.
- **Text to Slug/URL Converter** — lowercase, replace spaces with hyphens, strip special characters, standard slugify function.
- **Lorem Ipsum Generator** — configurable paragraphs/words/sentences from a fixed Latin word bank.
- **Reading Time Calculator** — `words / average WPM (225)` = minutes.
- **Meta Tag Length Checker** — count characters for title (~60 char limit) and description (~155-160 char limit), show visual pixel-width approximation and Google SERP preview.
- **QR Code Generator** — client-side generation via a small QR library (e.g. `qrcode`), download as PNG/SVG.

### Date & Time

- **Countdown Timer** — target date/time input, live countdown display.
- **Working Days Calculator** — count days between two dates excluding weekends, optional public holiday list input.
- **Time Zone Meeting Planner** — grid showing overlapping working hours across selected time zones.

### Automobile

- **Car Loan EMI Calculator** — same EMI formula, dedicated page.
- **Fuel Cost Calculator** — `(Distance / Mileage) × Fuel price per liter`.
- **Car Depreciation Calculator** — apply a standard declining-balance depreciation table by vehicle age (configurable %/year).

### Marriage/Astrology-adjacent (optional Phase 2 — high India-specific search volume)

- **Numerology Calculator** — reduce birth date/name letters to a single digit via standard numerology reduction rules.
- **Baby Name Numerology Generator** — filter a name list by matching numerology number.

---

## 11. Non-Functional Requirements

- **Accessibility:** all interactive elements keyboard-navigable, proper `label`/`aria-label` on all inputs, color contrast AA-compliant minimum, focus-visible states on all interactive elements
- **Mobile-first:** every calculator must be fully usable on a 360px-wide screen — no horizontal scroll, inputs large enough for touch (min 44px tap targets)
- **Ad slot reservation:** every ad container has a fixed min-height set before the ad script loads, to prevent CLS
- **Error handling:** calculators validate input ranges (no negative loan amounts, no age > 150, etc.) with inline, non-blocking error messages — never a browser `alert()`
- **No console errors, no unused JS shipped to pages that don't need it**
- **Legal:** Privacy Policy must disclose AdSense/Google's use of cookies for personalized ads and link to Google's own privacy policy, per AdSense program policy requirements

---

## 12. Build Instructions for the Agent

Build in this order:
1. Scaffold Astro project, install Tailwind + shadcn + `@astrojs/react` + Drizzle + Neon driver
2. Build `BaseLayout` and `ToolLayout` with all meta tag / JSON-LD scaffolding wired to accept props (don't hardcode per-page — this is the SEO backbone, get it right once)
3. Build the Neon schema + Drizzle client + seed script with fallback static content for all tools listed above
4. Build 5 calculators end-to-end first (EMI, BMI, GPA, Percentage, Unit Converter) as the template pattern — get layout, ad slots, FAQ schema, and related-tools working fully on these before mass-producing the rest
5. Build homepage + category pages
6. Build remaining calculators from Section 10, reusing the established pattern
7. Build admin panel (login gate → dashboard → tools CRUD → categories CRUD → contact inbox)
8. Add sitemap, robots.txt, static legal pages
9. Run Lighthouse/PageSpeed Insights on a sample of tool pages, fix any CLS/LCP issues before considering done

Confirm the design system (Section 6) and database schema (Section 3) before writing calculator components, since the `ToolLayout` and all 60+ pages depend on those being locked first.