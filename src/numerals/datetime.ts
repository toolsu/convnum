/**
 * Converts a month number to a month name in the specified locale and format.
 *
 * @param monthNumber - Integer between 1-12 representing the month (1 = January, 12 = December)
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @param type - The format type, either 'long' (e.g., 'January') or 'short' (e.g., 'Jan') (default: 'long')
 * @returns The localized month name as a string
 *
 * @example
 * ```ts
 * toMonth(1) // Returns "January"
 * toMonth(1, 'fr-FR') // Returns "janvier"
 * toMonth(1, 'en-US', 'short') // Returns "Jan"
 * ```
 * @throws Will throw an error if monthNumber is not between 1 and 12
 * @category Date
 */
export function toMonth(
  monthNumber: number,
  locale = 'en-US',
  type: 'long' | 'short' | 'narrow' = 'long'
): string {
  if (monthNumber < 1 || monthNumber > 12 || !Number.isInteger(monthNumber)) {
    throw new Error('Month number must be an integer between 1 and 12')
  }

  const date = new Date(2000, monthNumber - 1) // Use any year, set month (0-based)
  return new Intl.DateTimeFormat(locale, { month: type }).format(date)
}

/**
 * Converts a month name to its corresponding number in the specified locale.
 * Performs a case-insensitive comparison with both long and short month names.
 *
 * @param monthName - The name of the month to convert (e.g., "January", "Jan", "janvier")
 * @param locale - The locale to use for parsing (default: 'en-US')
 * @returns The month number (1-12) or null if not found
 *
 * @example
 * ```ts
 * fromMonth('January') // Returns 1
 * fromMonth('jan', 'fr-FR') // Returns 1
 * fromMonth('Dez', 'de-DE') // Returns 12
 * ```
 * @category Date
 */
export function fromMonth(monthName: string, locale = 'en-US'): number | null {
  if (!monthName || typeof monthName !== 'string') {
    return null
  }

  // Locale-aware, normalized comparison so that uppercase forms in locales with
  // special casing (e.g. Turkish "MAYIS", Greek accented names) still match.
  const norm = (s: string) =>
    s.normalize('NFC').toLocaleLowerCase(locale).replace(/\.$/, '')
  const target = norm(monthName)

  for (let i = 1; i <= 12; i++) {
    if (
      norm(toMonth(i, locale, 'long')) === target ||
      norm(toMonth(i, locale, 'short')) === target
    ) {
      return i
    }
  }
  return null // Not found
}

/**
 * Converts a day number to a day name in the specified locale and format.
 * Uses 0-based indexing for days (0 = Sunday, 6 = Saturday).
 *
 * @param dayNumber - Integer between 0-6 representing the day of the week (0 = Sunday, 6 = Saturday)
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @param type - The format type, either 'long' (e.g., 'Sunday') or 'short' (e.g., 'Sun') (default: 'long')
 * @returns The localized day name as a string
 *
 * @example
 * ```ts
 * toDayOfWeek(0) // Returns "Sunday"
 * toDayOfWeek(1, 'fr-FR') // Returns "lundi"
 * toDayOfWeek(2, 'de-DE', 'short') // Returns "Di"
 * ```
 * @throws Will throw an error if dayNumber is not between 0 and 6
 * @category Date
 */
export function toDayOfWeek(
  dayNumber: number,
  locale = 'en-US',
  type: 'long' | 'short' | 'narrow' = 'long'
): string {
  if (dayNumber < 0 || dayNumber > 6 || !Number.isInteger(dayNumber)) {
    throw new Error('Day number must be an integer between 0 and 6')
  }

  const date = new Date(2000, 0, 2 + dayNumber) // Ensure Sunday (0) aligns with ISO weekdays
  return new Intl.DateTimeFormat(locale, { weekday: type }).format(date)
}

/**
 * Converts a day name to its corresponding number in the specified locale.
 * Performs a case-insensitive comparison with both long and short day names.
 * Returns the day number using 0-based indexing (0 = Sunday, 6 = Saturday).
 *
 * @param dayName - The name of the day to convert (e.g., "Sunday", "Sun", "Dimanche")
 * @param locale - The locale to use for parsing (default: 'en-US')
 * @returns The day number (0-6) or null if not found
 *
 * @example
 * ```ts
 * fromDayOfWeek('Monday') // Returns 1
 * fromDayOfWeek('Lundi', 'fr-FR') // Returns 1
 * fromDayOfWeek('Di', 'de-DE') // Returns 2
 * ```
 * @category Date
 */
export function fromDayOfWeek(
  dayName: string,
  locale = 'en-US'
): number | null {
  if (!dayName || typeof dayName !== 'string') {
    return null
  }

  const norm = (s: string) =>
    s.normalize('NFC').toLocaleLowerCase(locale).replace(/\.$/, '')
  const target = norm(dayName)

  for (let i = 0; i < 7; i++) {
    if (
      norm(toDayOfWeek(i, locale, 'long')) === target ||
      norm(toDayOfWeek(i, locale, 'short')) === target
    ) {
      return i
    }
  }
  return null // Not found
}

/**
 * Converts a Date object to Julian Day Number
 * @param date - The Date object
 * @returns The Julian Day Number
 * @category Date
 */
export function toJulianDay(date: Date): number {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3

  const jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045

  return jd
}

/**
 * Converts Julian Day Number to a Date object
 * @param julianDay - The Julian Day Number
 * @returns A JavaScript Date object
 * @category Date
 */
export function fromJulianDay(julianDay: number): Date {
  // Calculate the date components
  const a = julianDay + 32044
  const b = Math.floor((4 * a + 3) / 146097)
  const c = a - Math.floor((146097 * b) / 4)

  const d = Math.floor((4 * c + 3) / 1461)
  const e = c - Math.floor((1461 * d) / 4)
  const m = Math.floor((5 * e + 2) / 153)

  const day = e - Math.floor((153 * m + 2) / 5) + 1
  const month = m + 3 - 12 * Math.floor(m / 10)
  const year = 100 * b + d - 4800 + Math.floor(m / 10)

  // Use setFullYear rather than the Date(year, ...) constructor, whose two-digit
  // year remapping would turn proleptic-Gregorian years 0-99 into 1900-1999.
  const date = new Date(2000, 0, 1)
  date.setFullYear(year, month - 1, day)
  date.setHours(0, 0, 0, 0)
  return date
}
