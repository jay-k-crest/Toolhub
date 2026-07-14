import React, { useState, useEffect } from "react";
import {
  calculateCgpaToPercent,
  calculateGrade,
  calculateRequiredFinal,
  calculateAttendance,
  calculateSalaryHike,
  calculateNoticePeriod,
} from "../../lib/calculators/education-calculators";

interface EducationProps {
  slug: string;
}

export default function EducationCalculators({ slug }: EducationProps) {
  const [activeSlug, setActiveSlug] = useState(slug);

  useEffect(() => {
    setActiveSlug(slug);
  }, [slug]);

  // CGPA states
  const [cgpa, setCgpa] = useState(8.5);
  const [cgpaScale, setCgpaScale] = useState(10);
  const [cgpaMultiplier, setCgpaMultiplier] = useState(9.5);

  // Grade states
  const [gradeItems, setGradeItems] = useState([
    { name: "Assignments", score: 85, weight: 30 },
    { name: "Midterm Exam", score: 78, weight: 30 },
  ]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemScore, setNewItemScore] = useState(80);
  const [newItemWeight, setNewItemWeight] = useState(20);
  // required final states
  const [targetGrade, setTargetGrade] = useState(80);
  const [finalWeight, setFinalWeight] = useState(20);

  // Attendance states
  const [attendedClasses, setAttendedClasses] = useState(30);
  const [totalClasses, setTotalClasses] = useState(40);
  const [targetAttendance, setTargetAttendance] = useState(75);

  // Salary Hike states
  const [oldSalary, setOldSalary] = useState(500000);
  const [newSalary, setNewSalary] = useState(650000);

  // Notice Period states
  const [noticeStartDate, setNoticeStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [noticeValue, setNoticeValue] = useState(30);
  const [noticeUnit, setNoticeUnit] = useState<"days" | "weeks" | "months">("days");

  // Calculations
  const cgpaResult = calculateCgpaToPercent(cgpa, cgpaScale, cgpaMultiplier);
  const { currentGrade, totalWeight } = calculateGrade(gradeItems);
  const requiredFinalScore = calculateRequiredFinal(currentGrade, totalWeight, targetGrade, finalWeight);
  const attendanceResult = calculateAttendance(attendedClasses, totalClasses, targetAttendance);
  const salaryHikeResult = calculateSalaryHike(oldSalary, newSalary);
  const noticeEndDate = calculateNoticePeriod(new Date(noticeStartDate), noticeValue, noticeUnit);

  const educationTools = [
    { slug: "cgpa-to-percentage-converter", label: "CGPA to Percentage" },
    { slug: "grade-calculator", label: "Grade Calculator" },
    { slug: "attendance-percentage-calculator", label: "Attendance Calculator" },
    { slug: "salary-hike-percentage-calculator", label: "Salary Hike" },
    { slug: "notice-period-calculator", label: "Notice Period" },
  ];

  return (
    <div className="space-y-6">
      {/* Mini Switcher */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
        {educationTools.map((t) => (
          <a
            key={t.slug}
            href={`/education/${t.slug}/`}
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
        {/* INPUTS PANEL */}
        <div className="space-y-4 bg-card border border-border p-6 rounded-xl">
          <h3 className="text-lg font-bold text-foreground mb-4">Inputs</h3>

          {/* 1. CGPA to Percentage */}
          {activeSlug === "cgpa-to-percentage-converter" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="cgpa-val" className="text-sm font-medium text-foreground">CGPA Obtained</label>
                <input
                  id="cgpa-val"
                  type="number"
                  step="0.01"
                  value={cgpa}
                  onChange={(e) => setCgpa(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="scale-val" className="text-sm font-medium text-foreground">Out of Scale</label>
                  <input
                    id="scale-val"
                    type="number"
                    value={cgpaScale}
                    onChange={(e) => setCgpaScale(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="mul-val" className="text-sm font-medium text-foreground">Formula Multiplier</label>
                  <input
                    id="mul-val"
                    type="number"
                    step="0.1"
                    value={cgpaMultiplier}
                    onChange={(e) => setCgpaMultiplier(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Grade Calculator */}
          {activeSlug === "grade-calculator" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Current Assessments</label>
                <div className="space-y-2">
                  {gradeItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-xs text-foreground flex-1 font-semibold">{item.name || "Assessment"}</span>
                      <span className="text-xs text-muted tabular-nums">Score: {item.score}%</span>
                      <span className="text-xs text-muted tabular-nums">Weight: {item.weight}%</span>
                      <button
                        onClick={() => setGradeItems(gradeItems.filter((_, i) => i !== idx))}
                        className="text-destructive hover:text-destructive/80 text-xs px-2 py-1 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Item */}
              <div className="border-t border-border pt-4 space-y-3">
                <span className="text-xs font-bold text-muted uppercase block">Add Grade Item</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    placeholder="Name (e.g. Quiz)"
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="rounded-md border border-input bg-secondary/35 px-2 py-1 text-xs text-foreground focus:outline-none"
                  />
                  <input
                    placeholder="Score (%)"
                    type="number"
                    value={newItemScore}
                    onChange={(e) => setNewItemScore(Number(e.target.value))}
                    className="rounded-md border border-input bg-secondary/35 px-2 py-1 text-xs text-foreground focus:outline-none"
                  />
                  <input
                    placeholder="Weight (%)"
                    type="number"
                    value={newItemWeight}
                    onChange={(e) => setNewItemWeight(Number(e.target.value))}
                    className="rounded-md border border-input bg-secondary/35 px-2 py-1 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    setGradeItems([...gradeItems, { name: newItemName || `Assessment ${gradeItems.length + 1}`, score: newItemScore, weight: newItemWeight }]);
                    setNewItemName("");
                  }}
                  className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-md font-semibold"
                >
                  Add Item
                </button>
              </div>

              {/* Required Final Target */}
              <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="target-val" className="text-sm font-medium text-foreground">Target Final Grade (%)</label>
                  <input
                    id="target-val"
                    type="number"
                    value={targetGrade}
                    onChange={(e) => setTargetGrade(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="final-weight-val" className="text-sm font-medium text-foreground">Final Exam Weight (%)</label>
                  <input
                    id="final-weight-val"
                    type="number"
                    value={finalWeight}
                    onChange={(e) => setFinalWeight(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Attendance Calculator */}
          {activeSlug === "attendance-percentage-calculator" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="att-val" className="text-sm font-medium text-foreground">Classes Attended</label>
                  <input
                    id="att-val"
                    type="number"
                    value={attendedClasses}
                    onChange={(e) => setAttendedClasses(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="tot-classes" className="text-sm font-medium text-foreground">Total Classes held</label>
                  <input
                    id="tot-classes"
                    type="number"
                    value={totalClasses}
                    onChange={(e) => setTotalClasses(Math.max(attendedClasses, Number(e.target.value)))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="target-att" className="text-sm font-medium text-foreground">Target Attendance (%)</label>
                <input
                  id="target-att"
                  type="number"
                  value={targetAttendance}
                  onChange={(e) => setTargetAttendance(Math.max(1, Math.min(100, Number(e.target.value))))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 4. Salary Hike Calculator */}
          {activeSlug === "salary-hike-percentage-calculator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="old-sal" className="text-sm font-medium text-foreground">Previous Salary (Annual/Monthly)</label>
                <input
                  id="old-sal"
                  type="number"
                  value={oldSalary}
                  onChange={(e) => setOldSalary(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="new-sal" className="text-sm font-medium text-foreground">New Salary</label>
                <input
                  id="new-sal"
                  type="number"
                  value={newSalary}
                  onChange={(e) => setNewSalary(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 5. Notice Period Calculator */}
          {activeSlug === "notice-period-calculator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="not-start" className="text-sm font-medium text-foreground">Resignation Submission Date</label>
                <input
                  id="not-start"
                  type="date"
                  value={noticeStartDate}
                  onChange={(e) => setNoticeStartDate(e.target.value)}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="not-dur" className="text-sm font-medium text-foreground">Notice Duration</label>
                  <input
                    id="not-dur"
                    type="number"
                    value={noticeValue}
                    onChange={(e) => setNoticeValue(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="not-unit" className="text-sm font-medium text-foreground">Unit</label>
                  <select
                    id="not-unit"
                    value={noticeUnit}
                    onChange={(e) => setNoticeUnit(e.target.value as any)}
                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RESULTS PANEL */}
        <div className="bg-secondary/30 border border-border p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Results</h3>

            {/* 1. CGPA Results */}
            {activeSlug === "cgpa-to-percentage-converter" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Equivalent Percentage</span>
                  <span className="text-4xl font-heading font-extrabold text-primary tabular-nums">
                    {cgpaResult}%
                  </span>
                </div>
                <div className="text-sm text-muted border-t border-border pt-4">
                  Using multiplier <span className="font-bold text-foreground">{cgpaMultiplier}</span>. Formula: {cgpa} × {cgpaMultiplier} = {cgpaResult}%.
                </div>
              </div>
            )}

            {/* 2. Grade Results */}
            {activeSlug === "grade-calculator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Current Class Grade</span>
                  <span className="text-4xl font-heading font-extrabold text-primary tabular-nums">
                    {currentGrade}%
                  </span>
                  <span className="text-xs text-muted block mt-1">Based on {totalWeight}% of total coursework weight.</span>
                </div>
                {finalWeight > 0 && (
                  <div className="border-t border-border pt-4">
                    <span className="text-xs text-muted block mb-1">To achieve target of {targetGrade}%:</span>
                    <p className="text-sm font-semibold text-foreground">
                      You need a score of{" "}
                      <span className="text-accent text-lg font-bold tabular-nums">
                        {requiredFinalScore}%
                      </span>{" "}
                      on the final exam (weighted {finalWeight}%).
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. Attendance Results */}
            {activeSlug === "attendance-percentage-calculator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Current Attendance</span>
                  <span className="text-4xl font-heading font-extrabold text-primary tabular-nums">
                    {attendanceResult.currentPercentage}%
                  </span>
                </div>
                <div className={`border-t border-border pt-4 p-3 rounded-lg text-sm font-semibold ${
                  attendanceResult.currentPercentage >= targetAttendance
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-600 border border-red-500/20"
                }`}>
                  {attendanceResult.status}
                </div>
              </div>
            )}

            {/* 4. Salary Hike Results */}
            {activeSlug === "salary-hike-percentage-calculator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Salary Hike Percentage</span>
                  <span className="text-4xl font-heading font-extrabold text-primary tabular-nums">
                    {salaryHikeResult.percentage}%
                  </span>
                </div>
                <div className="border-t border-border pt-4 text-sm text-foreground flex justify-between">
                  <span>Absolute Hike Amount:</span>
                  <span className="font-bold tabular-nums">+{salaryHikeResult.diff.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* 5. Notice Period Results */}
            {activeSlug === "notice-period-calculator" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Last Working Day (LWD)</span>
                  <span className="text-2xl font-bold text-primary">
                    {noticeEndDate.toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="text-xs text-muted border-t border-border pt-4">
                  Calculated by adding {noticeValue} {noticeUnit} to your resignation date.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
