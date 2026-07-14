export interface GPACourseInput {
  gradeName: string;
  credits: number;
}

export const gradePointsMap: Record<string, number> = {
  "A+": 4.0,
  "A": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C": 2.0,
  "C-": 1.7,
  "D+": 1.3,
  "D": 1.0,
  "F": 0.0,
};

export function calculateGPA(courses: GPACourseInput[]): number {
  let totalGradePoints = 0;
  let totalCredits = 0;

  for (const course of courses) {
    const points = gradePointsMap[course.gradeName.toUpperCase()];
    if (points !== undefined && course.credits > 0) {
      totalGradePoints += points * course.credits;
      totalCredits += course.credits;
    }
  }

  if (totalCredits === 0) return 0;
  return totalGradePoints / totalCredits;
}
