import React, { useState } from "react";
import { calculateGPA, gradePointsMap } from "../../lib/calculators/gpa-calculator";
import { Plus, Trash2, RotateCcw } from "lucide-react";

interface CourseRow {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

export default function GpaCalculator() {
  const [courses, setCourses] = useState<CourseRow[]>([
    { id: "1", name: "Course 1", grade: "A", credits: 3 },
    { id: "2", name: "Course 2", grade: "B", credits: 4 },
    { id: "3", name: "Course 3", grade: "A-", credits: 3 },
  ]);

  const addCourse = () => {
    const newId = (courses.length > 0 ? Math.max(...courses.map(c => Number(c.id))) + 1 : 1).toString();
    setCourses([
      ...courses,
      { id: newId, name: `Course ${newId}`, grade: "A", credits: 3 },
    ]);
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof CourseRow, value: any) => {
    setCourses(
      courses.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const resetCalculator = () => {
    setCourses([
      { id: "1", name: "Course 1", grade: "A", credits: 3 },
    ]);
  };

  const gpaInput = courses.map(c => ({
    gradeName: c.grade,
    credits: c.credits,
  }));

  const gpa = calculateGPA(gpaInput);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 class="text-lg font-heading font-semibold text-foreground">Course Grades</h3>
        <button
          onClick={resetCalculator}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-input hover:bg-secondary text-muted hover:text-foreground transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="space-y-3">
        {courses.map((course) => (
          <div key={course.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Course Name */}
            <input
              type="text"
              placeholder="Course name"
              value={course.name}
              onChange={(e) => updateCourse(course.id, "name", e.target.value)}
              className="w-full sm:flex-1 rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring"
            />

            <div className="flex gap-3 w-full sm:w-auto">
              {/* Grade */}
              <select
                value={course.grade}
                onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                className="w-24 rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {Object.keys(gradePointsMap).map((g) => (
                  <option key={g} value={g}>
                    {g} ({gradePointsMap[g].toFixed(1)})
                  </option>
                ))}
              </select>

              {/* Credits */}
              <input
                type="number"
                min="1"
                max="10"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, "credits", Math.max(1, Number(e.target.value)))}
                className="w-20 rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground text-center focus:outline-none focus:ring-2 focus:ring-ring"
              />

              {/* Delete Button */}
              {courses.length > 1 && (
                <button
                  onClick={() => removeCourse(course.id)}
                  aria-label="Delete course"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-destructive/20 hover:border-destructive text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-6 pt-4 items-stretch sm:items-center justify-between border-t border-border mt-6">
        <button
          onClick={addCourse}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Course
        </button>

        {/* Output */}
        <div className="rounded-xl bg-secondary/30 border border-border p-4 flex items-center justify-between gap-6 sm:w-72">
          <div>
            <span className="text-xs font-semibold text-muted uppercase">GPA (4.0 Scale)</span>
            <p className="text-3xl font-heading font-extrabold text-foreground tabular-nums mt-0.5">
              {gpa.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted block">Total Credits:</span>
            <span className="text-sm font-bold text-foreground tabular-nums">
              {courses.reduce((sum, c) => sum + c.credits, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
