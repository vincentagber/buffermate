/**
 * Timezone utilities for BufferMate
 * Special emphasis on Africa/Lagos (West Africa Time, WAT = UTC+1 year-round, no DST)
 */

export const DEFAULT_TIMEZONE = 'Africa/Lagos';

/**
 * Parse a datetime string entered by a user into a reliable UTC ISO 8601 string.
 *
 * Handles:
 * - HTML datetime-local input: "2026-10-20T14:30" (16 chars)
 * - Timezone-aware ISO strings: "2026-10-20T14:30:00Z" or "...+01:00"
 * - Human-friendly strings: returns standard UTC
 *
 * @param dateTimeStr The input date string
 * @param timeZone Target timezone name, defaults to 'Africa/Lagos'
 * @returns Standard UTC ISO string (e.g. "2026-10-20T13:30:00.000Z")
 */
export function parseLocalToUtcIso(dateTimeStr?: string, timeZone: string = DEFAULT_TIMEZONE): string {
  if (!dateTimeStr || dateTimeStr.trim().length === 0) {
    return new Date().toISOString();
  }

  const trimmed = dateTimeStr.trim();

  // If already contains UTC 'Z' or an explicit timezone offset like '+01:00' or '-05:00'
  if (trimmed.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(trimmed)) {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  }

  // Format standard YYYY-MM-DDTHH:mm(:ss)?
  const standardTime = trimmed.length === 16 ? `${trimmed}:00` : trimmed;

  if (timeZone === 'Africa/Lagos') {
    // Africa/Lagos is consistently West Africa Time (WAT = UTC+1) all year round with no Daylight Saving Time.
    // Appending +01:00 ensures exact UTC mapping regardless of server/browser host timezone.
    const lagosIsoWithOffset = `${standardTime}+01:00`;
    const parsed = new Date(lagosIsoWithOffset);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  // General fallback using Date parser
  const fallback = new Date(standardTime);
  if (!isNaN(fallback.getTime())) {
    return fallback.toISOString();
  }

  return new Date().toISOString();
}

/**
 * Format a UTC ISO timestamp into the local time in Africa/Lagos.
 */
export function formatToLagosTime(isoString: string, options?: Intl.DateTimeFormatOptions): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const defaultOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Africa/Lagos',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      ...options,
    };

    return new Intl.DateTimeFormat('en-GB', defaultOptions).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Get current hour in Africa/Lagos (0-23)
 */
export function getLagosHour(date: Date = new Date()): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Lagos',
    hour: 'numeric',
    hour12: false,
  });
  return parseInt(formatter.format(date), 10);
}

/**
 * Calculate the next optimal peak engagement posting slot in Africa/Lagos.
 * Peak windows for social media engagement:
 * - Morning: 09:00 WAT
 * - Midday: 13:15 WAT
 * - Evening: 18:30 WAT
 */
export function getNextPeakEngagementSlot(timeZone: string = DEFAULT_TIMEZONE): string {
  const now = new Date();
  const lagosHour = getLagosHour(now);

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const todayLagosYmd = formatter.format(now); // "YYYY-MM-DD"

  let targetYmd = todayLagosYmd;
  let targetTime = '09:00:00';

  if (lagosHour < 9) {
    targetTime = '09:00:00';
  } else if (lagosHour < 13) {
    targetTime = '13:15:00';
  } else if (lagosHour < 18) {
    targetTime = '18:30:00';
  } else {
    // Tomorrow morning at 09:00
    const tomorrow = new Date(now.getTime() + 24 * 3600 * 1000);
    targetYmd = formatter.format(tomorrow);
    targetTime = '09:00:00';
  }

  const localSlotStr = `${targetYmd}T${targetTime}`;
  return parseLocalToUtcIso(localSlotStr, timeZone);
}
