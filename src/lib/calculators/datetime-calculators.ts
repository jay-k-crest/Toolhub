/**
 * Date & Time Calculators Logic
 */

// 1. Working Days Calculator
export function calculateWorkingDays(
  startDate: Date,
  endDate: Date,
  excludeWeekends: boolean = true,
  holidaysList: string[] = [] // Array of "YYYY-MM-DD"
): {
  totalDays: number;
  workingDays: number;
  weekends: number;
  holidaysCount: number;
} {
  const start = new Date(startDate.getTime());
  const end = new Date(endDate.getTime());
  
  if (start.getTime() > end.getTime()) {
    // Swap
    const temp = new Date(start.getTime());
    start.setTime(end.getTime());
    end.setTime(temp.getTime());
  }

  // Normalize hours
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const oneDayMs = 24 * 60 * 60 * 1000;
  const totalDays = Math.round((end.getTime() - start.getTime()) / oneDayMs) + 1; // Inclusive

  let workingDays = 0;
  let weekends = 0;
  let holidaysCount = 0;

  const parsedHolidays = holidaysList.map(h => {
    const d = new Date(h);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  });

  const current = new Date(start.getTime());
  while (current.getTime() <= end.getTime()) {
    const dayOfWeek = current.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = excludeWeekends && (dayOfWeek === 0 || dayOfWeek === 6);
    
    if (isWeekend) {
      weekends++;
    } else {
      const isHoliday = parsedHolidays.includes(current.getTime());
      if (isHoliday) {
        holidaysCount++;
      } else {
        workingDays++;
      }
    }
    
    current.setTime(current.getTime() + oneDayMs);
  }

  return {
    totalDays,
    workingDays,
    weekends,
    holidaysCount,
  };
}

// 2. Timezone Meeting Planner
export interface HourOverlapSlot {
  hour24: number;
  label: string;
  zones: Array<{
    zone: string;
    formattedTime: string;
    status: "business" | "overlap" | "sleep"; // green, yellow, red
  }>;
}

export function planMeetingOverlap(
  baseDate: Date,
  selectedZones: string[]
): HourOverlapSlot[] {
  const slots: HourOverlapSlot[] = [];

  // Loop through 24 hours of the day
  for (let h = 0; h < 24; h++) {
    const checkDate = new Date(baseDate.getTime());
    checkDate.setHours(h, 0, 0, 0);

    const zonesData = selectedZones.map((zone) => {
      // Get hour in target zone
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: zone,
        hour: "numeric",
        hour12: false,
      });
      const formattedHour = parseInt(formatter.format(checkDate), 10);
      
      const timeFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: zone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const formattedTime = timeFormatter.format(checkDate);

      // Determine status
      let status: "business" | "overlap" | "sleep" = "sleep";
      if (formattedHour >= 9 && formattedHour < 18) {
        status = "business"; // 9 AM - 6 PM
      } else if ((formattedHour >= 7 && formattedHour < 9) || (formattedHour >= 18 && formattedHour < 22)) {
        status = "overlap";  // 7-9 AM or 6-10 PM
      }

      return {
        zone,
        formattedTime,
        status,
      };
    });

    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 === 0 ? 12 : h % 12;

    slots.push({
      hour24: h,
      label: `${displayHour}:00 ${ampm}`,
      zones: zonesData,
    });
  }

  return slots;
}
