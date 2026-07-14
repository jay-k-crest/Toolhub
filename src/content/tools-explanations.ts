export function getExplanationFor(slug: string, name: string): string {
  switch (slug) {
    case "emi-calculator":
      return `
        <h2>How does the EMI Calculator Work?</h2>
        <p>An Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are used to pay off both interest and principal each month, so that over a specified period, the loan is fully paid off.</p>
        
        <h3>The EMI Formula</h3>
        <p>The mathematical formula used to calculate EMIs is:</p>
        <div class="bg-secondary/40 border border-border p-4 rounded-lg font-mono text-center text-lg my-4">
          EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
        </div>
        <p>Where:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>P:</strong> Principal loan amount (the original sum borrowed).</li>
          <li><strong>R:</strong> Monthly interest rate. It is calculated as <code>Annual Rate of Interest / 12 / 100</code>. For instance, if the annual rate is 12%, R will be 12/12/100 = 0.01.</li>
          <li><strong>N:</strong> Number of monthly installments or loan tenure in months. For instance, a 5-year loan tenure has 5 x 12 = 60 installments.</li>
        </ul>

        <h3>Step-by-Step Worked Example</h3>
        <p>Let's say you take a personal loan of <strong>₹1,00,000</strong> (Principal P) at an annual interest rate of <strong>12%</strong> (Annual Rate) for a tenure of <strong>1 Year</strong> (12 months, N).</p>
        <ol class="list-decimal pl-6 space-y-2">
          <li>Convert annual rate to monthly: R = 12 / 12 / 100 = 0.01.</li>
          <li>Number of months: N = 12.</li>
          <li>Apply the formula: <br/>
            <code>EMI = [1,00,000 x 0.01 x (1 + 0.01)^12] / [(1 + 0.01)^12 - 1]</code><br/>
            <code>EMI = [1,000 x 1.126825] / [1.126825 - 1]</code><br/>
            <code>EMI = 1,126.825 / 0.126825</code><br/>
            <code>EMI = ₹8,885</code> (approx).
          </li>
          <li>Total Amount Payable: ₹8,885 x 12 = ₹1,06,620.</li>
          <li>Total Interest Payable: ₹1,06,620 - ₹1,00,000 = ₹6,620.</li>
        </ol>
      `;
    case "bmi-calculator":
      return `
        <h2>How does the Body Mass Index (BMI) Calculator Work?</h2>
        <p>Body Mass Index (BMI) is a simple indicator of body fatness, used as a screening tool to identify whether an individual is underweight, normal weight, overweight, or obese. It is defined as a person's weight in kilograms divided by the square of their height in meters.</p>
        
        <h3>The BMI Formula</h3>
        <p>The formula differs slightly depending on whether you use the metric system or the imperial system:</p>
        
        <h4>1. Metric System</h4>
        <div class="bg-secondary/40 border border-border p-4 rounded-lg font-mono text-center text-lg my-4">
          BMI = Weight (kg) / [Height (m)]²
        </div>
        
        <h4>2. Imperial System</h4>
        <div class="bg-secondary/40 border border-border p-4 rounded-lg font-mono text-center text-lg my-4">
          BMI = [Weight (lbs) / (Height (in))²] x 703
        </div>

        <h3>WHO Classification Table</h3>
        <p>The World Health Organization (WHO) classifies weight status based on BMI scores for adults:</p>
        <table class="min-w-full border-collapse border border-border text-sm my-4">
          <thead>
            <tr class="bg-secondary/40 text-left">
              <th class="border border-border p-2">BMI Range</th>
              <th class="border border-border p-2">Weight Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-border p-2">Below 18.5</td>
              <td class="border border-border p-2 text-amber-500 font-semibold">Underweight</td>
            </tr>
            <tr>
              <td class="border border-border p-2">18.5 – 24.9</td>
              <td class="border border-border p-2 text-emerald-500 font-semibold">Normal weight</td>
            </tr>
            <tr>
              <td class="border border-border p-2">25.0 – 29.9</td>
              <td class="border border-border p-2 text-orange-500 font-semibold">Overweight</td>
            </tr>
            <tr>
              <td class="border border-border p-2">30.0 and above</td>
              <td class="border border-border p-2 text-red-500 font-semibold">Obese</td>
            </tr>
          </tbody>
        </table>

        <h3>Worked Example</h3>
        <p>Suppose an adult male weighs <strong>75 kg</strong> and has a height of <strong>1.80 meters</strong> (180 cm).</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>Height squared: 1.80 x 1.80 = 3.24.</li>
          <li>Apply formula: <code>BMI = 75 / 3.24 = 23.15</code>.</li>
          <li>According to WHO, 23.15 places him in the <strong>Normal weight</strong> category.</li>
        </ul>
      `;
    case "gpa-calculator":
      return `
        <h2>How does the GPA Calculator Work?</h2>
        <p>Grade Point Average (GPA) is a standard method of measuring academic achievement in schools and universities. Your GPA represents the average value of your accumulated final grades over a semester or complete course of study.</p>

        <h3>The GPA Formula</h3>
        <p>GPA is calculated as a weighted average where each course's grade points are multiplied by its credit value, summed, and then divided by the total credits:</p>
        <div class="bg-secondary/40 border border-border p-4 rounded-lg font-mono text-center text-lg my-4">
          GPA = Σ(Grade Points x Credits) / Σ(Total Credits)
        </div>

        <h3>Standard 4.0 Grade Point Scale</h3>
        <p>Most universities use a standard 4.0 scale to convert letter grades to numerical points:</p>
        <ul class="list-disc pl-6 space-y-1">
          <li><strong>A+ / A:</strong> 4.0 points</li>
          <li><strong>A-:</strong> 3.7 points</li>
          <li><strong>B+:</strong> 3.3 points</li>
          <li><strong>B:</strong> 3.0 points</li>
          <li><strong>B-:</strong> 2.7 points</li>
          <li><strong>C+:</strong> 2.3 points</li>
          <li><strong>C:</strong> 2.0 points</li>
          <li><strong>D:</strong> 1.0 point</li>
          <li><strong>F:</strong> 0.0 points</li>
        </ul>

        <h3>Step-by-Step Worked Example</h3>
        <p>Suppose you are taking 3 courses in a semester:</p>
        <ol class="list-decimal pl-6 space-y-2">
          <li><strong>Course 1:</strong> Grade A (4.0 points), 3 Credits. Grade points = 4.0 x 3 = 12.0.</li>
          <li><strong>Course 2:</strong> Grade B (3.0 points), 4 Credits. Grade points = 3.0 x 4 = 12.0.</li>
          <li><strong>Course 3:</strong> Grade C (2.0 points), 2 Credits. Grade points = 2.0 x 2 = 4.0.</li>
          <li>Total Grade Points: 12.0 + 12.0 + 4.0 = 28.0.</li>
          <li>Total Credits: 3 + 4 + 2 = 9.</li>
          <li>Apply formula: <code>GPA = 28.0 / 9 = 3.11</code>.</li>
        </ol>
      `;
    case "percentage-calculator":
      return `
        <h2>How do Percentages Work?</h2>
        <p>A percentage is a number or ratio expressed as a fraction of 100. It is denoted using the percent sign (%). The term percentage comes from the Latin phrase 'per centum', meaning 'by the hundred'.</p>

        <h3>Common Percentage Formulas</h3>
        <p>Depending on what you are trying to solve, different mathematical representations are used:</p>

        <h4>1. Finding X% of Y</h4>
        <p>This is the most basic calculation. Use this formula:</p>
        <div class="bg-secondary/40 border border-border p-4 rounded-lg font-mono text-center text-sm my-2">
          Result = (X / 100) x Y
        </div>
        <p><em>Example:</em> 15% of 200 = (15 / 100) x 200 = 30.</p>

        <h4>2. Finding What Percentage X is of Y</h4>
        <p>To find the proportion of one value to another, use:</p>
        <div class="bg-secondary/40 border border-border p-4 rounded-lg font-mono text-center text-sm my-2">
          Percentage = (X / Y) x 100
        </div>
        <p><em>Example:</em> 30 is what percent of 150? = (30 / 150) x 100 = 20%.</p>

        <h4>3. Percentage Change (Increase/Decrease)</h4>
        <p>To find the percentage growth or reduction between an older value and a newer value, use:</p>
        <div class="bg-secondary/40 border border-border p-4 rounded-lg font-mono text-center text-sm my-2">
          Percent Change = [(New Value - Old Value) / Old Value] x 100
        </div>
        <p><em>Example:</em> If a stock price goes from $100 to $125, the change is: [(125 - 100) / 100] x 100 = 25% increase.</p>
      `;
    case "unit-converter":
      return `
        <h2>Understanding Units of Measurement</h2>
        <p>A unit of measurement is a definite magnitude of a quantity, defined and adopted by convention or by law, that is used as a standard for measurement of the same kind of quantity. Conversions allow translating values between different regional systems (like metric and imperial).</p>

        <h3>Conversion Methods</h3>
        <p>Units are converted by multiplying or dividing by conversion factors. The conversion factor is the numerical ratio of base units in one system to another.</p>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>Length:</strong> Standardized on the meter (m). 1 foot equals exactly 0.3048 meters.</li>
          <li><strong>Weight & Mass:</strong> Standardized on the kilogram (kg). 1 pound (lb) equals exactly 0.45359237 kilograms.</li>
          <li><strong>Volume:</strong> Standardized on the liter (L). 1 US gallon is equivalent to 3.78541178 liters.</li>
          <li><strong>Temperature:</strong> Conversions use offsets in addition to ratios: <code>Fahrenheit = (Celsius x 9/5) + 32</code>.</li>
        </ul>

        <h3>Example Calculation</h3>
        <p>To convert <strong>5 feet</strong> into meters, multiply by the conversion factor (0.3048):</p>
        <div class="bg-secondary/40 border border-border p-3 rounded-lg font-mono text-center my-2">
          5 ft x 0.3048 m/ft = 1.524 meters
        </div>
      `;
    default:
      return `
        <h2>Understanding the ${name}</h2>
        <p>The ${name} is designed to provide quick, reliable, and automated estimations based on mathematical and scientific formulas. It runs entirely inside your web browser, ensuring complete data privacy and security. None of your entered values are ever stored or sent to remote servers.</p>
        
        <h3>Why Use this Calculator?</h3>
        <p>Performing these equations manually can lead to mathematical mistakes. By using our tool, you receive instant, verified outputs backed by industry-standard calculation tables. We suggest verifying all results when utilizing them for formal financial, legal, or health purposes.</p>

        <h3>Key Features:</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>Instant Processing:</strong> Outputs update dynamically as you modify inputs.</li>
          <li><strong>Offline Compatibility:</strong> Since the logic runs locally, it works even with unstable connections.</li>
          <li><strong>SEO Responsive:</strong> Accessible across all touch devices and screen widths.</li>
        </ul>
      `;
  }
}
