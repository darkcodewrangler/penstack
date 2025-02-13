interface CronJobSchedule {
  timezone?: string;
  hours?: number[];
  mdays?: number[];
  minutes?: number[];
  months?: number[];
  wdays?: number[];
}

/**
 * Converts a datetime or array of datetimes into cron-job.org schedule format
 * @param dates - Single Date object or array of Date objects
 * @param timezone - Optional timezone (defaults to locale timezone)
 * @returns CronJob schedule object
 */
export function dateTimeToCronJobSchedule(
  dates: Date,
  timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
): CronJobSchedule {
  // Convert single date to array
  const dateArray = Array.isArray(dates) ? dates : [dates];

  if (dateArray.length === 0) {
    throw new Error("At least one date must be provided");
  }

  const schedule: CronJobSchedule = { timezone };

  // For one-time schedules, just use the exact times
  schedule.minutes = [...new Set(dateArray.map((date) => date.getMinutes()))];
  schedule.hours = [...new Set(dateArray.map((date) => date.getHours()))];
  schedule.mdays = [...new Set(dateArray.map((date) => date.getDate()))];
  schedule.months = [...new Set(dateArray.map((date) => date.getMonth() + 1))];
  schedule.wdays = [...new Set(dateArray.map((date) => date.getDay()))];

  return schedule;
}

/**
 * Helper function to create a schedule for a specific interval
 * @param interval - Interval in minutes
 * @returns Array of minute values for the schedule
 */
export function createIntervalSchedule(interval: number): number[] {
  if (interval < 1 || interval > 60) {
    throw new Error("Interval must be between 1 and 60 minutes");
  }

  const minutes: number[] = [];
  for (let i = 0; i < 60; i += interval) {
    minutes.push(i);
  }
  return minutes;
}
export function extractFullTimeString(date: Date): string {
  if (!date) return "";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
export function mergeTimeStringWithDate(
  timeString: string,
  dateObject: Date
): Date {
  const [hours, minutes] = timeString.split(":").map(Number);

  // Create new Date object, preserving original date but replacing time
  return new Date(
    dateObject.getFullYear(),
    dateObject.getMonth(),
    dateObject.getDate(),
    hours,
    minutes
  );
}
