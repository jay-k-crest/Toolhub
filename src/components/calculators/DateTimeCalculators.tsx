import React, { useState, useEffect } from "react";
import {
  calculateWorkingDays,
  planMeetingOverlap,
} from "../../lib/calculators/datetime-calculators";

interface DateTimeProps {
  slug: string;
}

export default function DateTimeCalculators({ slug }: DateTimeProps) {
  const [activeSlug, setActiveSlug] = useState(slug);

  useEffect(() => {
    setActiveSlug(slug);
  }, [slug]);

  // Countdown timer states
  const [targetDateStr, setTargetDateStr] = useState(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
  const [countdownResult, setCountdownResult] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // Working Days states
  const [workStart, setWorkStart] = useState(new Date().toISOString().split("T")[0]);
  const [workEnd, setWorkEnd] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [excludeWeekends, setExcludeWeekends] = useState(true);
  const [holidaysText, setHolidaysText] = useState("");

  // Timezone Meeting states
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedZones, setSelectedZones] = useState(["UTC", "Asia/Kolkata", "America/New_York"]);

  // Interval hook for countdown
  useEffect(() => {
    if (activeSlug !== "countdown-timer") return;

    const timer = setInterval(() => {
      const target = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setCountdownResult({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdownResult({ days, hours, mins, secs });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateStr, activeSlug]);

  // Working Days calculations
  const parsedHolidays = holidaysText
    .split(/[\s,]+/)
    .map(h => h.trim())
    .filter(h => h.length > 0);
  const workingDaysResult = calculateWorkingDays(new Date(workStart), new Date(workEnd), excludeWeekends, parsedHolidays);

  // Timezone Planner calculations
  const meetingSlots = planMeetingOverlap(new Date(meetingDate), selectedZones);

  const dateTimeTools = [
    { slug: "countdown-timer", label: "Countdown Timer" },
    { slug: "working-days-calculator", label: "Working Days" },
    { slug: "timezone-meeting-planner", label: "Meeting Planner" },
  ];

  return (
    <div className="space-y-6">
      {/* Switcher */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
        {dateTimeTools.map((t) => (
          <a
            key={t.slug}
            href={`/date-time/${t.slug}/`}
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

          {/* 1. Countdown Timer */}
          {activeSlug === "countdown-timer" && (
            <div className="space-y-1.5">
              <label htmlFor="target-dt" className="text-sm font-medium text-foreground">Target Date & Time</label>
              <input
                id="target-dt"
                type="datetime-local"
                value={targetDateStr}
                onChange={(e) => setTargetDateStr(e.target.value)}
                className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
              />
            </div>
          )}

          {/* 2. Working Days */}
          {activeSlug === "working-days-calculator" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="wrk-start" className="text-sm font-medium text-foreground">Start Date</label>
                  <input
                    id="wrk-start"
                    type="date"
                    value={workStart}
                    onChange={(e) => setWorkStart(e.target.value)}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="wrk-end" className="text-sm font-medium text-foreground">End Date</label>
                  <input
                    id="wrk-end"
                    type="date"
                    value={workEnd}
                    onChange={(e) => setWorkEnd(e.target.value)}
                    className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="wknd-check"
                  type="checkbox"
                  checked={excludeWeekends}
                  onChange={(e) => setExcludeWeekends(e.target.checked)}
                  className="h-4 w-4 bg-secondary border-input accent-primary"
                />
                <label htmlFor="wknd-check" className="text-sm font-medium text-foreground">Exclude Weekends (Sat/Sun)</label>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="hols-txt" className="text-sm font-medium text-foreground">Holidays List (optional, "YYYY-MM-DD" separated by spaces)</label>
                <textarea
                  id="hols-txt"
                  value={holidaysText}
                  onChange={(e) => setHolidaysText(e.target.value)}
                  placeholder="2026-08-15, 2026-12-25"
                  rows={3}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-2 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 3. Meeting Planner */}
          {activeSlug === "timezone-meeting-planner" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="mt-date" className="text-sm font-medium text-foreground">Proposed Date</label>
                <input
                  id="mt-date"
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">Select Timezones to Compare</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {["UTC", "Asia/Kolkata", "America/New_York", "Europe/London", "Asia/Singapore", "Australia/Sydney"].map((zone) => (
                    <label key={zone} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedZones.includes(zone)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedZones([...selectedZones, zone]);
                          } else {
                            setSelectedZones(selectedZones.filter(z => z !== zone));
                          }
                        }}
                        className="accent-primary h-4 w-4"
                      />
                      {zone}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RESULTS PANEL */}
        <div className="bg-secondary/30 border border-border p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Results</h3>

            {/* 1. Countdown results */}
            {activeSlug === "countdown-timer" && (
              <div className="space-y-4 text-center">
                <span className="text-xs text-muted block uppercase tracking-wider mb-2">Time Remaining</span>
                <div className="grid grid-cols-4 gap-2 text-foreground">
                  <div className="bg-card border border-border p-3 rounded-lg">
                    <span className="text-3xl font-heading font-extrabold text-primary block tabular-nums">{countdownResult.days}</span>
                    <span className="text-[10px] text-muted font-semibold uppercase">Days</span>
                  </div>
                  <div className="bg-card border border-border p-3 rounded-lg">
                    <span className="text-3xl font-heading font-extrabold text-primary block tabular-nums">{countdownResult.hours}</span>
                    <span className="text-[10px] text-muted font-semibold uppercase">Hours</span>
                  </div>
                  <div className="bg-card border border-border p-3 rounded-lg">
                    <span className="text-3xl font-heading font-extrabold text-primary block tabular-nums">{countdownResult.mins}</span>
                    <span className="text-[10px] text-muted font-semibold uppercase">Mins</span>
                  </div>
                  <div className="bg-card border border-border p-3 rounded-lg">
                    <span className="text-3xl font-heading font-extrabold text-primary block tabular-nums">{countdownResult.secs}</span>
                    <span className="text-[10px] text-muted font-semibold uppercase">Secs</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Working Days results */}
            {activeSlug === "working-days-calculator" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted block uppercase tracking-wider">Total Working Days</span>
                  <span className="text-4xl font-heading font-extrabold text-primary tabular-nums">
                    {workingDaysResult.workingDays}
                  </span>{" "}
                  <span className="text-sm text-muted">days</span>
                </div>
                <div className="border-t border-border pt-4 space-y-2 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Total Calendar Days:</span>
                    <span className="font-semibold tabular-nums">{workingDaysResult.totalDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekend Days Excluded:</span>
                    <span className="font-semibold text-red-600 tabular-nums">-{workingDaysResult.weekends}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Holidays Excluded:</span>
                    <span className="font-semibold text-red-600 tabular-nums">-{workingDaysResult.holidaysCount}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Meeting Planner Overlap grid */}
            {activeSlug === "timezone-meeting-planner" && (
              <div className="space-y-4">
                <span className="text-xs text-muted block uppercase tracking-wider mb-2">Overlapping Work Hours</span>
                <div className="max-h-60 overflow-y-auto pr-1 space-y-1.5 text-xs text-foreground">
                  {meetingSlots.map((slot) => (
                    <div key={slot.hour24} className="border border-border/50 rounded-lg p-2 bg-card flex justify-between items-center">
                      <span className="font-bold w-16 text-muted">{slot.label}</span>
                      <div className="flex-1 grid grid-cols-3 gap-1">
                        {slot.zones.map((z, idx) => (
                          <div
                            key={idx}
                            className={`p-1 rounded text-center font-semibold text-[10px] ${
                              z.status === "business"
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : z.status === "overlap"
                                ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                : "bg-red-500/10 text-red-600 border border-red-500/20"
                            }`}
                          >
                            <span className="block text-[8px] uppercase font-bold text-muted">{z.zone.split("/")[1] || z.zone}</span>
                            <span className="tabular-nums">{z.formattedTime.split(" ")[0]} {z.formattedTime.split(" ")[1]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 justify-center text-[10px] text-muted font-bold pt-2 border-t border-border/50">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-emerald-500 inline-block" /> Business (9AM-6PM)</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-amber-500 inline-block" /> Personal/Overlap</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-red-500 inline-block" /> Sleep Hours</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
