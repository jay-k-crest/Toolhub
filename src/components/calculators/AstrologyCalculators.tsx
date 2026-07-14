import React, { useState, useEffect } from "react";
import {
  calculateLifePathNumber,
  calculateNameNumerology,
  numerologyMeanings,
} from "../../lib/calculators/astrology-calculators";

interface AstrologyProps {
  slug: string;
}

export default function AstrologyCalculators({ slug }: AstrologyProps) {
  const [activeSlug, setActiveSlug] = useState(slug);

  useEffect(() => {
    setActiveSlug(slug);
  }, [slug]);

  // Life Path states
  const [birthdateStr, setBirthdateStr] = useState("1995-10-15");

  // Name Numerology states
  const [fullName, setFullName] = useState("John Doe");

  // Baby Name states
  const [babyNamesInput, setBabyNamesInput] = useState("Liam, Noah, Oliver, Elijah, William, James, Benjamin");
  const [targetNum, setTargetNum] = useState(7);

  // Calculations
  const lifePathResult = calculateLifePathNumber(new Date(birthdateStr));
  const nameResult = calculateNameNumerology(fullName);

  // Baby Name matching
  const parsedNames = babyNamesInput
    .split(/[\s,]+/)
    .map(name => name.trim())
    .filter(name => name.length > 0);

  const matchedNames = parsedNames.map((name) => {
    const numData = calculateNameNumerology(name);
    return {
      name,
      number: numData.expressionNumber,
      isMatch: numData.expressionNumber === targetNum,
    };
  });

  const pathMeaning = numerologyMeanings[lifePathResult.lifePathNumber] || { title: "Unknown", desc: "" };
  const nameMeaning = numerologyMeanings[nameResult.expressionNumber] || { title: "Unknown", desc: "" };
  const targetMeaning = numerologyMeanings[targetNum] || { title: "Unknown", desc: "" };

  const astrologyTools = [
    { slug: "numerology-calculator", label: "Numerology Calculator" },
    { slug: "baby-name-numerology-generator", label: "Baby Name Matcher" },
  ];

  return (
    <div className="space-y-6">
      {/* Switcher */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
        {astrologyTools.map((t) => (
          <a
            key={t.slug}
            href={`/astrology/${t.slug}/`}
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

          {/* 1. Numerology (Life Path & Expression) */}
          {activeSlug === "numerology-calculator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="birthdate-val-inp" className="text-sm font-medium text-foreground">Date of Birth</label>
                <input
                  id="birthdate-val-inp"
                  type="date"
                  value={birthdateStr}
                  onChange={(e) => setBirthdateStr(e.target.value)}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="fullname-val-inp" className="text-sm font-medium text-foreground">Full Name</label>
                <input
                  id="fullname-val-inp"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 2. Baby Name Numerology */}
          {activeSlug === "baby-name-numerology-generator" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="target-num-inp" className="text-sm font-medium text-foreground">Target Numerology Number (1-9)</label>
                <input
                  id="target-num-inp"
                  type="number"
                  min="1"
                  max="9"
                  value={targetNum}
                  onChange={(e) => setTargetNum(Math.max(1, Math.min(9, Number(e.target.value))))}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="babynames-txt" className="text-sm font-medium text-foreground">Baby Names List (comma separated)</label>
                <textarea
                  id="babynames-txt"
                  value={babyNamesInput}
                  onChange={(e) => setBabyNamesInput(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-2 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* RESULTS PANEL */}
        <div className="bg-secondary/30 border border-border p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Results</h3>

            {/* 1. Numerology Results */}
            {activeSlug === "numerology-calculator" && (
              <div className="space-y-6 text-left">
                {/* Life path */}
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Life Path Number</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-heading font-extrabold text-primary tabular-nums">
                      {lifePathResult.lifePathNumber}
                    </span>
                    <span className="text-base font-bold text-foreground">- {pathMeaning.title}</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed mt-1">{pathMeaning.desc}</p>
                </div>

                {/* Name destiny */}
                <div className="border-t border-border pt-4">
                  <span className="text-xs text-muted block uppercase tracking-wider">Destiny / Expression Number</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-heading font-extrabold text-accent tabular-nums">
                      {nameResult.expressionNumber}
                    </span>
                    <span className="text-base font-bold text-foreground">- {nameMeaning.title}</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed mt-1">{nameMeaning.desc}</p>
                </div>
              </div>
            )}

            {/* 2. Baby Name Results */}
            {activeSlug === "baby-name-numerology-generator" && (
              <div className="space-y-4 text-left">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider mb-2">
                    Names Matching Number {targetNum} ({targetMeaning.title})
                  </span>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                    {matchedNames.map((item, idx) => (
                      <span
                        key={idx}
                        className={`rounded px-2.5 py-1 text-xs font-semibold border tabular-nums ${
                          item.isMatch
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold"
                            : "bg-secondary/40 text-muted border-border/40"
                        }`}
                      >
                        {item.name} ({item.number})
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-[10px] text-muted border-t border-border/50 pt-2 leading-relaxed">
                  Green colored names exactly match your target numerology vibrations of number <span className="font-bold text-foreground">{targetNum}</span>.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
