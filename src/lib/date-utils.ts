/**
 * Date utilities to prevent timezone shift issues across client & server.
 * Standardizes local calendar formatting and UTC-midnight DayRecord formatting.
 */

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatLocalDate(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return "";
  }
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/**
 * Formats a Date stored at UTC midnight (such as DayRecord.date) as YYYY-MM-DD
 * using UTC calendar components so negative timezone offsets never shift it back a day.
 */
export function formatUTCDate(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return "";
  }
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

/**
 * Parses a YYYY-MM-DD or ISO date string into UTC midnight (00:00:00Z).
 * Returns null when the input is malformed or represents an impossible calendar date.
 */
export function parseUTCDate(dateInput: string): Date | null {
  const cleanDateStr = String(dateInput).includes("T")
    ? String(dateInput).split("T")[0]
    : String(dateInput).trim();

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(cleanDateStr);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return parsed;
}

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0); // Noon local time to safely avoid any midnight timezone shifts
}

export function getTodayLocalDateStr(): string {
  return formatLocalDate(new Date());
}
