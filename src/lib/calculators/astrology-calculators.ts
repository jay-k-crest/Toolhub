/**
 * Numerology & Astrology-adjacent Calculators Logic
 */

// Pythagorean letter values
const pythagoreanMap: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

// Reduce number to single digit (excluding master numbers 11, 22, 33 unless specified)
export function reduceNumber(num: number, keepMasterNumbers: boolean = true): number {
  let val = num;
  while (val > 9) {
    if (keepMasterNumbers && (val === 11 || val === 22 || val === 33)) {
      return val;
    }
    val = val.toString().split("").reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return val;
}

// 1. Calculate Life Path Number from Birthdate
export function calculateLifePathNumber(dob: Date): {
  lifePathNumber: number;
  breakdown: string;
} {
  const day = dob.getDate();
  const month = dob.getMonth() + 1; // 1-indexed
  const year = dob.getFullYear();

  const rDay = reduceNumber(day, true);
  const rMonth = reduceNumber(month, true);
  const rYear = reduceNumber(year, true);

  const sum = rDay + rMonth + rYear;
  const lifePathNumber = reduceNumber(sum, true);

  return {
    lifePathNumber,
    breakdown: `Month: ${rMonth}, Day: ${rDay}, Year: ${rYear} -> Sum: ${sum} -> Life Path: ${lifePathNumber}`,
  };
}

// 2. Calculate Expression/Destiny Number from Name
export function calculateNameNumerology(name: string): {
  expressionNumber: number;
  letterValues: number[];
  sum: number;
} {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, "");
  const letterValues: number[] = [];
  let sum = 0;

  for (let i = 0; i < letters.length; i++) {
    const val = pythagoreanMap[letters[i]] || 0;
    letterValues.push(val);
    sum += val;
  }

  const expressionNumber = reduceNumber(sum, true);

  return {
    expressionNumber,
    letterValues,
    sum,
  };
}

// Numerology descriptions
export const numerologyMeanings: Record<number, { title: string; desc: string }> = {
  1: { title: "The Leader", desc: "Independent, pioneering, ambitious, proactive, and strong-willed." },
  2: { title: "The Peacemaker", desc: "Cooperative, sensitive, diplomatic, intuitive, and supportive." },
  3: { title: "The Creative", desc: "Expressive, artistic, social, optimistic, and highly communicative." },
  4: { title: "The Builder", desc: "Practical, disciplined, orderly, loyal, stable, and hardworking." },
  5: { title: "The Free Spirit", desc: "Adaptable, adventurous, dynamic, curious, and freedom-loving." },
  6: { title: "The Nurturer", desc: "Responsible, compassionate, loving, family-oriented, and harmonious." },
  7: { title: "The Seeker", desc: "Analytical, intellectual, spiritual, contemplative, and truth-seeking." },
  8: { title: "The Powerhouse", desc: "Authoritative, goal-oriented, practical, successful, and financially savvy." },
  9: { title: "The Humanitarian", desc: "Compassionate, selfless, creative, generous, and globally conscious." },
  11: { title: "Master Number 11: The Visionary", desc: "Intuitive, charismatic, inspiring, spiritual, and highly creative." },
  22: { title: "Master Number 22: The Master Builder", desc: "Powerful, visionary, practical, capable of manifesting large-scale dreams." },
  33: { title: "Master Number 33: The Master Teacher", desc: "Altruistic, compassionate, healing, protective, and spiritually guiding." }
};
