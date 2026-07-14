import React, { useState, useEffect } from "react";
import {
  calculateCalories,
  calculateBodyFat,
  calculateIdealWeight,
  calculateWaterIntake,
  calculatePregnancyDueDate,
  calculateOvulation,
  calculateAge,
  calculateHeartRateZones,
  calculateMacros,
} from "../../lib/calculators/health-calculators";

interface HealthProps {
  slug: string;
}

export default function HealthCalculators({ slug }: HealthProps) {
  const [activeSlug, setActiveSlug] = useState(slug);

  useEffect(() => {
    setActiveSlug(slug);
  }, [slug]);

  // States for calorie / macro / ideal weight
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState(30);
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(70);
  const [activity, setActivity] = useState(1.2); // sedentary

  // Body fat states
  const [neckCm, setNeckCm] = useState(38);
  const [waistCm, setWaistCm] = useState(88);
  const [hipCm, setHipCm] = useState(95);

  // Water intake
  const [exerciseMin, setExerciseMin] = useState(30);

  // Date states
  const [lmpDate, setLmpDate] = useState(new Date().toISOString().split("T")[0]);
  const [cycleLength, setCycleLength] = useState(28);
  const [dob, setDob] = useState("1995-01-01");
  const [restingHr, setRestingHr] = useState(70);

  // Macro goal
  const [macroGoal, setMacroGoal] = useState<"maintain" | "cut" | "bulk">("maintain");
  const [macroSplit, setMacroSplit] = useState<"balanced" | "lowCarb" | "highProtein" | "keto">("balanced");

  // Calculations
  const calResult = calculateCalories(weightKg, heightCm, age, gender, activity);
  const bodyFatResult = calculateBodyFat(gender, heightCm, neckCm, waistCm, hipCm, weightKg);
  const idealWeightResult = calculateIdealWeight(gender, heightCm);
  const waterResult = calculateWaterIntake(weightKg, exerciseMin);
  const pregnancyResult = calculatePregnancyDueDate(new Date(lmpDate));
  const ovulationResult = calculateOvulation(new Date(lmpDate), cycleLength);
  const ageResult = calculateAge(new Date(dob));
  const hrResult = calculateHeartRateZones(age, restingHr);
  const macroResult = calculateMacros(calResult.tdee, macroGoal, macroSplit);

  // Menu items list
  const healthTools = [
    { slug: "calorie-calculator", label: "Calorie Needs (BMR/TDEE)" },
    { slug: "body-fat-calculator", label: "Body Fat %" },
    { slug: "ideal-weight-calculator", label: "Ideal Weight" },
    { slug: "water-intake-calculator", label: "Water Intake" },
    { slug: "pregnancy-due-date-calculator", label: "Pregnancy Due Date" },
    { slug: "ovulation-calculator", label: "Ovulation Calendar" },
    { slug: "age-calculator", label: "Age Calculator" },
    { slug: "heart-rate-zone-calculator", label: "Heart Rate Zones" },
    { slug: "macro-calculator", label: "Macro Split" },
  ];

  return (
    <div className="space-y-6">
      {/* Category Mini Switcher */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
        {healthTools.map((t) => (
          <a
            key={t.slug}
            href={`/health/${t.slug}/`}
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
        {/* INPUTS COLUMN */}
        <div className="space-y-4 bg-card border border-border p-6 rounded-xl">
          <h3 className="text-lg font-bold text-foreground mb-4">Inputs</h3>

          {/* Shared demographic selectors */}
          {["calorie-calculator", "body-fat-calculator", "ideal-weight-calculator", "macro-calculator"].includes(activeSlug) && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Gender</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setGender("male")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-md border ${
                      gender === "male" ? "bg-primary text-primary-foreground" : "bg-card border-input text-muted"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => setGender("female")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-md border ${
                      gender === "female" ? "bg-primary text-primary-foreground" : "bg-card border-input text-muted"
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {!["ideal-weight-calculator"].includes(activeSlug) && (
                <div className="space-y-1.5">
                  <label htmlFor="age-input" className="text-sm font-medium text-foreground">Age (Years)</label>
                  <input
                    id="age-input"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Height and Weight standard inputs */}
          {["calorie-calculator", "body-fat-calculator", "ideal-weight-calculator", "water-intake-calculator", "macro-calculator"].includes(activeSlug) && (
            <div className="grid grid-cols-2 gap-4">
              {activeSlug !== "water-intake-calculator" && (
                <div className="space-y-1.5">
                  <label htmlFor="height-input" className="text-sm font-medium text-foreground">Height (cm)</label>
                  <input
                    id="height-input"
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Math.max(50, Number(e.target.value)))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="weight-input" className="text-sm font-medium text-foreground">Weight (kg)</label>
                <input
                  id="weight-input"
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Math.max(10, Number(e.target.value)))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Calorie specific inputs */}
          {["calorie-calculator", "macro-calculator"].includes(activeSlug) && (
            <div className="space-y-1.5">
              <label htmlFor="activity-select" className="text-sm font-medium text-foreground">Activity Level</label>
              <select
                id="activity-select"
                value={activity}
                onChange={(e) => setActivity(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
              >
                <option value={1.2}>Sedentary (Little or no exercise)</option>
                <option value={1.375}>Lightly Active (Light exercise 1-3 days/week)</option>
                <option value={1.55}>Moderately Active (Moderate exercise 3-5 days/week)</option>
                <option value={1.725}>Very Active (Hard exercise 6-7 days/week)</option>
                <option value={1.9}>Extra Active (Very hard daily exercise & physical job)</option>
              </select>
            </div>
          )}

          {/* Body Fat specific inputs */}
          {activeSlug === "body-fat-calculator" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="neck-input" className="text-sm font-medium text-foreground">Neck (cm)</label>
                  <input
                    id="neck-input"
                    type="number"
                    value={neckCm}
                    onChange={(e) => setNeckCm(Math.max(10, Number(e.target.value)))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="waist-input" className="text-sm font-medium text-foreground">Waist (cm)</label>
                  <input
                    id="waist-input"
                    type="number"
                    value={waistCm}
                    onChange={(e) => setWaistCm(Math.max(10, Number(e.target.value)))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
              {gender === "female" && (
                <div className="space-y-1.5">
                  <label htmlFor="hip-input" className="text-sm font-medium text-foreground">Hips (cm)</label>
                  <input
                    id="hip-input"
                    type="number"
                    value={hipCm}
                    onChange={(e) => setHipCm(Math.max(10, Number(e.target.value)))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Water Intake exercise minutes */}
          {activeSlug === "water-intake-calculator" && (
            <div className="space-y-1.5">
              <label htmlFor="ex-input" className="text-sm font-medium text-foreground">Daily Exercise (Minutes)</label>
              <input
                id="ex-input"
                type="number"
                value={exerciseMin}
                onChange={(e) => setExerciseMin(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
              />
            </div>
          )}

          {/* Pregnancy and Ovulation */}
          {["pregnancy-due-date-calculator", "ovulation-calculator"].includes(activeSlug) && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="lmp-input" className="text-sm font-medium text-foreground">
                  {activeSlug === "pregnancy-due-date-calculator" ? "Last Menstrual Period (LMP)" : "First day of Last Period"}
                </label>
                <input
                  id="lmp-input"
                  type="date"
                  value={lmpDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              {activeSlug === "ovulation-calculator" && (
                <div className="space-y-1.5">
                  <label htmlFor="cycle-input" className="text-sm font-medium text-foreground">Average Cycle Length (Days)</label>
                  <input
                    id="cycle-input"
                    type="number"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(Math.max(20, Number(e.target.value)))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Age Calculator DOB */}
          {activeSlug === "age-calculator" && (
            <div className="space-y-1.5">
              <label htmlFor="dob-input" className="text-sm font-medium text-foreground">Date of Birth</label>
              <input
                id="dob-input"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
              />
            </div>
          )}

          {/* Heart rate zones */}
          {activeSlug === "heart-rate-zone-calculator" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="hr-age" className="text-sm font-medium text-foreground">Age</label>
                <input
                  id="hr-age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="rest-hr" className="text-sm font-medium text-foreground">Resting Heart Rate (BPM)</label>
                <input
                  id="rest-hr"
                  type="number"
                  value={restingHr}
                  onChange={(e) => setRestingHr(Math.max(30, Number(e.target.value)))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Macro Split options */}
          {activeSlug === "macro-calculator" && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label htmlFor="goal-select" className="text-sm font-medium text-foreground">Goal</label>
                <select
                  id="goal-select"
                  value={macroGoal}
                  onChange={(e) => setMacroGoal(e.target.value as any)}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                >
                  <option value="maintain">Maintain Weight</option>
                  <option value="cut">Lose Weight (Deficit)</option>
                  <option value="bulk">Gain Weight (Surplus)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="split-select" className="text-sm font-medium text-foreground">Macro Ratio</label>
                <select
                  id="split-select"
                  value={macroSplit}
                  onChange={(e) => setMacroSplit(e.target.value as any)}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                >
                  <option value="balanced">Balanced (30/40/30)</option>
                  <option value="lowCarb">Low Carb (40/20/40)</option>
                  <option value="highProtein">High Protein (45/30/25)</option>
                  <option value="keto">Keto (25/5/70)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* RESULTS COLUMN */}
        <div className="bg-secondary/30 border border-border p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Results</h3>

            {/* A. Calorie needs result */}
            {activeSlug === "calorie-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Maintenance Calories (TDEE)</span>
                  <span className="text-4xl font-heading font-extrabold text-primary tabular-nums">
                    {calResult.tdee}
                  </span>{" "}
                  <span className="text-sm text-muted">kcal/day</span>
                </div>
                <div className="border-t border-border pt-4 space-y-3 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Basal Metabolic Rate (BMR):</span>
                    <span className="font-semibold tabular-nums">{calResult.bmr} kcal/day</span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-2">
                    <span className="text-emerald-600 font-semibold">Weight Loss (-500 kcal):</span>
                    <span className="font-bold text-emerald-600 tabular-nums">{calResult.goals.weightLoss} kcal</span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-2">
                    <span className="text-indigo-600 font-semibold">Weight Gain (+500 kcal):</span>
                    <span className="font-bold text-indigo-600 tabular-nums">{calResult.goals.weightGain} kcal</span>
                  </div>
                </div>
              </div>
            )}

            {/* B. Body fat results */}
            {activeSlug === "body-fat-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Body Fat Percentage</span>
                  <span className="text-4xl font-heading font-extrabold text-primary tabular-nums">
                    {bodyFatResult.bodyFatPercentage}%
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-3 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Classification:</span>
                    <span className="font-semibold text-accent">{bodyFatResult.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fat Mass:</span>
                    <span className="font-semibold tabular-nums">{bodyFatResult.fatMass} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lean Body Mass:</span>
                    <span className="font-semibold tabular-nums">{bodyFatResult.leanMass} kg</span>
                  </div>
                </div>
              </div>
            )}

            {/* C. Ideal Weight results */}
            {activeSlug === "ideal-weight-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Ideal Weight (Devine Formula)</span>
                  <span className="text-4xl font-heading font-extrabold text-primary tabular-nums">
                    {idealWeightResult.devine} kg
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-3 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Robinson Formula:</span>
                    <span className="font-semibold tabular-nums">{idealWeightResult.robinson} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Miller Formula:</span>
                    <span className="font-semibold tabular-nums">{idealWeightResult.miller} kg</span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-2 font-semibold">
                    <span>Healthy Weight Range:</span>
                    <span className="text-accent tabular-nums">{idealWeightResult.healthyRangeMin} - {idealWeightResult.healthyRangeMax} kg</span>
                  </div>
                </div>
              </div>
            )}

            {/* D. Water Intake result */}
            {activeSlug === "water-intake-calculator" && (
              <div className="space-y-4 text-center md:text-left">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Recommended Daily Water</span>
                  <span className="text-4xl font-heading font-extrabold text-primary tabular-nums">
                    {waterResult.liters}
                  </span>{" "}
                  <span className="text-lg font-bold text-foreground">Liters</span>
                </div>
                <div className="text-sm text-muted">
                  Equal to roughly <span className="font-bold text-foreground tabular-nums">{waterResult.ounces} oz</span> of fluids.
                </div>
              </div>
            )}

            {/* E. Pregnancy Due Date results */}
            {activeSlug === "pregnancy-due-date-calculator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Estimated Due Date</span>
                  <span className="text-2xl font-bold text-primary">
                    {pregnancyResult.dueDate.toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Days Remaining:</span>
                    <span className="font-semibold tabular-nums">{pregnancyResult.daysRemaining} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Gestation:</span>
                    <span className="font-semibold tabular-nums">
                      {pregnancyResult.gestationalAgeWeeks} Weeks, {pregnancyResult.gestationalAgeDays} Days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trimester:</span>
                    <span className="font-semibold text-accent">Trimester {pregnancyResult.trimester}</span>
                  </div>
                </div>
              </div>
            )}

            {/* F. Ovulation Finder results */}
            {activeSlug === "ovulation-calculator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Next Ovulation Date</span>
                  <span className="text-2xl font-bold text-primary">
                    {ovulationResult.nextOvulationDate.toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="font-semibold text-accent block">Estimated Fertile Window:</div>
                  <p className="text-sm text-muted leading-relaxed">
                    {ovulationResult.fertileWindowStart.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    {" - to - "}
                    {ovulationResult.fertileWindowEnd.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
            )}

            {/* G. Age Calculator results */}
            {activeSlug === "age-calculator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Your Exact Age</span>
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    {ageResult.years} Years, {ageResult.months} Months, {ageResult.days} Days
                  </p>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Total Weeks:</span>
                    <span className="font-semibold tabular-nums">{ageResult.totalWeeks.toLocaleString()} weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Days:</span>
                    <span className="font-semibold tabular-nums">{ageResult.totalDays.toLocaleString()} days</span>
                  </div>
                </div>
              </div>
            )}

            {/* H. Heart Rate Zones table */}
            {activeSlug === "heart-rate-zone-calculator" && (
              <div className="space-y-4">
                <span className="text-xs text-muted block uppercase tracking-wider mb-2">Target Training Zones</span>
                <div className="space-y-2.5 text-xs text-foreground">
                  {hrResult.map((z) => (
                    <div key={z.zone} className="border border-border/50 rounded-lg p-2 bg-card">
                      <div className="flex justify-between font-semibold mb-1">
                        <span>Zone {z.zone}: {z.name}</span>
                        <span className="text-primary tabular-nums">{z.minHr} - {z.maxHr} BPM</span>
                      </div>
                      <p className="text-[10px] text-muted">{z.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* I. Macro Calculator results */}
            {activeSlug === "macro-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Target Calories</span>
                  <span className="text-4xl font-heading font-extrabold text-primary tabular-nums">
                    {macroResult.proteinCalories + macroResult.carbCalories + macroResult.fatCalories}
                  </span>{" "}
                  <span className="text-sm text-muted">kcal/day</span>
                </div>
                <div className="border-t border-border pt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-card p-3 rounded-lg border border-border">
                    <span className="text-[10px] text-muted uppercase block mb-1">Protein</span>
                    <span className="font-bold text-sm text-foreground tabular-nums">{macroResult.proteinGrams}g</span>
                    <span className="text-[10px] text-muted block mt-0.5">({macroResult.proteinCalories} kcal)</span>
                  </div>
                  <div className="bg-card p-3 rounded-lg border border-border">
                    <span className="text-[10px] text-muted uppercase block mb-1">Carbs</span>
                    <span className="font-bold text-sm text-foreground tabular-nums">{macroResult.carbGrams}g</span>
                    <span className="text-[10px] text-muted block mt-0.5">({macroResult.carbCalories} kcal)</span>
                  </div>
                  <div className="bg-card p-3 rounded-lg border border-border">
                    <span className="text-[10px] text-muted uppercase block mb-1">Fats</span>
                    <span className="font-bold text-sm text-foreground tabular-nums">{macroResult.fatGrams}g</span>
                    <span className="text-[10px] text-muted block mt-0.5">({macroResult.fatCalories} kcal)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
