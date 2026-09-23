import { parseSuffixDate } from './cjkDate'
import {
  type DateInterpretation,
  MONTH_NAMES,
  type ParseDateResult,
  SEPARATORS,
} from './dateFormat'
import { compareDateFormatOrder } from './orders'

/**
 * Month format types and their patterns
 * @category Date
 */
const MONTH_FORMATS = {
  M2: {
    pattern: /^(0[1-9]|1[0-2])$/,
    min: 1,
    max: 12,
    requireZeroPadded: true,
  }, // 01-12 (zero-padded format)
  M1: { pattern: /^(0?[1-9]|1[0-2])$/, min: 1, max: 12 }, // 1-12 or 01-12 (flexible format)
  Mf: { pattern: /^([A-Z][a-z]{3,})$/ }, // January (4+ letters after capital)
  Mfl: { pattern: /^([a-z]{4,})$/ }, // january (4+ lowercase letters)
  Mfu: { pattern: /^([A-Z]{4,})$/ }, // JANUARY (4+ uppercase letters)
  Ms: { pattern: /^([A-Z][a-z]{2})$/ }, // Jan (exactly 3 letters, starting with capital)
  Msl: { pattern: /^([a-z]{3})$/ }, // jan (exactly 3 lowercase)
  Msu: { pattern: /^([A-Z]{3})$/ }, // JAN (exactly 3 uppercase)
} as const

/**
 * Day format types and their patterns
 * @category Date
 */
const DAY_FORMATS = {
  D2: {
    pattern: /^(0[1-9]|[1-2][0-9]|3[01])$/,
    min: 1,
    max: 31,
    requireZeroPadded: true,
  }, // 01-31 (zero-padded format)
  D1: {
    pattern: /^(0?[1-9]|[1-2][0-9]|3[01])$/,
    min: 1,
    max: 31,
  }, // 1-31 or 01-31 (flexible format)
} as const

/**
 * Year format pattern
 * @category Date
 */
const YEAR_PATTERN = /^(\d{4})$/

/**
 * Converts a month name to month number (1-12)
 * @category Date
 */
function monthNameToNumber(monthStr: string): number | null {
  const lowerMonth = monthStr.toLowerCase()

  // Check full month names
  const fullIndex = MONTH_NAMES.full.findIndex(
    (name) => name.toLowerCase() === lowerMonth
  )
  if (fullIndex !== -1) {
    return fullIndex + 1
  }

  // Check short month names
  const shortIndex = MONTH_NAMES.short.findIndex(
    (name) => name.toLowerCase() === lowerMonth
  )
  if (shortIndex !== -1) {
    return shortIndex + 1
  }

  return null
}

type DateComponent = { type: 'Y' | 'M' | 'D'; value: number; format: string }

/**
 * Gets all possible interpretations for a date component
 * @category Date
 */
function getAllPossibleComponents(component: string): DateComponent[] {
  const results: DateComponent[] = []

  // Check if it's a year
  if (YEAR_PATTERN.test(component)) {
    results.push({
      type: 'Y',
      value: Number.parseInt(component, 10),
      format: 'Y',
    })
  }

  // Check month formats (both M1 and M2 can match the same value to generate all format combinations)
  const monthFormats: Array<{
    key: string
    info: (typeof MONTH_FORMATS)[keyof typeof MONTH_FORMATS]
  }> = [
    { key: 'M2', info: MONTH_FORMATS.M2 }, // Zero-padded format
    { key: 'M1', info: MONTH_FORMATS.M1 }, // Flexible format
    { key: 'Mf', info: MONTH_FORMATS.Mf },
    { key: 'Mfl', info: MONTH_FORMATS.Mfl },
    { key: 'Mfu', info: MONTH_FORMATS.Mfu },
    { key: 'Ms', info: MONTH_FORMATS.Ms },
    { key: 'Msl', info: MONTH_FORMATS.Msl },
    { key: 'Msu', info: MONTH_FORMATS.Msu },
  ]

  for (const { key: formatKey, info: formatInfo } of monthFormats) {
    if (formatInfo.pattern.test(component)) {
      let value: number

      if ('min' in formatInfo) {
        // Numeric month
        value = Number.parseInt(component, 10)
        if (value < formatInfo.min || value > formatInfo.max) continue

        // Special check for M1: allow zero-padded numbers to be interpreted as non-padded
        // We should allow both M1 and M2 interpretations for the same numeric value
        // No exclusion logic needed here - let both formats coexist

        // Special check for M2: require that single-digit months are zero-padded
        if ('requireZeroPadded' in formatInfo && formatInfo.requireZeroPadded) {
          // For M2, single-digit values (1-9) are not allowed without zero-padding
          if (value >= 1 && value <= 9 && component.length === 1) continue
          // Note: We allow both M1 and M2 for naturally two-digit values (10-12)
          // to generate all valid format combinations
        }
      } else {
        // Named month
        const monthValue = monthNameToNumber(component)
        if (monthValue === null) continue
        value = monthValue
      }

      results.push({ type: 'M', value, format: formatKey })
    }
  }

  // "May" is the only month whose short and full names are identical, so the
  // Mf-family patterns (which require 4+ letters) never match it. Emit the
  // matching full-name interpretation too, so that formatDateString(ts, 'Mf …')
  // output round-trips back through parseDateString.
  const mayFullFormat: Record<string, string> = {
    May: 'Mf',
    may: 'Mfl',
    MAY: 'Mfu',
  }
  if (mayFullFormat[component]) {
    results.push({ type: 'M', value: 5, format: mayFullFormat[component] })
  }

  // Check day formats (both D1 and D2 can match the same value to generate all format combinations)
  const dayFormats: Array<{
    key: string
    info: (typeof DAY_FORMATS)[keyof typeof DAY_FORMATS]
  }> = [
    { key: 'D2', info: DAY_FORMATS.D2 }, // Zero-padded format
    { key: 'D1', info: DAY_FORMATS.D1 }, // Flexible format
  ]

  for (const { key: formatKey, info: formatInfo } of dayFormats) {
    if (formatInfo.pattern.test(component)) {
      const value = Number.parseInt(component, 10)
      if (value < formatInfo.min || value > formatInfo.max) continue

      // Special check for D1: allow zero-padded numbers to be interpreted as non-padded
      // We should allow both D1 and D2 interpretations for the same numeric value
      // No exclusion logic needed here - let both formats coexist

      // Special check for D2: require that single-digit days are zero-padded
      if ('requireZeroPadded' in formatInfo && formatInfo.requireZeroPadded) {
        // For D2, single-digit values (1-9) are not allowed without zero-padding
        if (value >= 1 && value <= 9 && component.length === 1) continue
        // Note: We allow both D1 and D2 for naturally two-digit values (10-31)
        // to generate all valid format combinations
      }

      results.push({ type: 'D', value, format: formatKey })
    }
  }

  return results
}

/**
 * Generates all possible combinations from arrays of possibilities
 * @category Date
 */
function generateAllCombinations(arrays: DateComponent[][]): DateComponent[][] {
  if (arrays.length === 0) {
    return []
  }
  if (arrays.length === 1) {
    return arrays[0].map((item) => [item])
  }

  const result: DateComponent[][] = []
  const restCombinations = generateAllCombinations(arrays.slice(1))

  for (const firstItem of arrays[0]) {
    for (const restCombination of restCombinations) {
      result.push([firstItem, ...restCombination])
    }
  }

  return result
}

/**
 * Parses a date string and returns all possible interpretations with their corresponding timestamps.
 * Each ambiguous date string may have multiple valid interpretations, each with its own timestamp.
 * Supports various date formats including Y-M-D, D-M-Y, M-D-Y, Y-M, M-Y, M-D, D-M.
 * Separators can be "-", ".", "/", ",", or ", ".
 *
 * Default values:
 * - Y-M format: day defaults to 1
 * - Y-M-D format: time defaults to 00:00:00.000
 * - M-D format: year defaults to 1970
 *
 * @param dateStr - The date string to parse (e.g., "2023-01-05", "25.12.2023", "Jan 15, 2023")
 * @returns Array of all possible interpretations, each with timestamp, format, and optionally months,
 * sorted by format priority (see {@link compareDateFormatOrder} function)
 * @throws Error if the date string format is not recognized or invalid
 *
 * @remarks
 * - For year-month only dates (no day component), the result includes a `months` property
 *   representing the number of months since 1970-01 (where 1970-01 = 0, 1970-02 = 1, etc.).
 * - Timestamps are local-timezone midnights of each interpreted date. The
 *   `days`/`months` properties are timezone-independent calendar counts
 *   (UTC-based), and are negative for pre-1970 dates.
 *
 * @example
 * ```ts
 * parseDateString('2023-01-05')
 * // [
 * //   { timestamp: ..., format: 'Y-M2-D2', days: ... },  // Jan 5, 2023
 * //   { timestamp: ..., format: 'Y-M2-D1', days: ... },
 * //   { timestamp: ..., format: 'Y-M1-D2', days: ... },
 * //   { timestamp: ..., format: 'Y-M1-D1', days: ... }
 * // ]  // all Jan 5, 2023 (YDM is not a recognized layout)
 *
 * parseDateString('25.12.2023')
 * // [{ timestamp: 1703462400000, format: 'D1.M1.Y' }]  // Dec 25, 2023
 *
 * parseDateString('Dec 25, 2023')
 * // [{ timestamp: 1703462400000, format: 'Ms D1, Y' }]  // Dec 25, 2023
 *
 * parseDateString('2023-12')
 * // [{ timestamp: 1701388800000, format: 'Y-M1', months: 647 }]  // Dec 1, 2023, 647 months since 1970-01
 *
 * parseDateString('Jan 2024')
 * // [{ timestamp: 1704067200000, format: 'Ms Y', months: 648 }]  // Jan 1, 2024, 648 months since 1970-01
 * ```
 * @category Date
 */
export function parseDateString(dateStr: string): ParseDateResult {
  const trimmed = dateStr.trim()
  const interpretations: DateInterpretation[] = []

  // Suffix-labelled layouts first. Each field says what it is, so there is exactly one
  // reading and no separator to guess at — and none of the separator patterns below can
  // match them anyway.
  const suffixed = parseSuffixDate(trimmed)
  if (suffixed.length > 0) {
    return suffixed
  }

  // Try each separator
  for (const separator of SEPARATORS) {
    let parts: string[]

    if (separator === ', ') {
      // Special handling for comma-space: split by comma-space first
      parts = trimmed.split(', ')
      if (parts.length === 2) {
        // For patterns like "December 25, 2023", further split the first part by space
        const firstPartSplit = parts[0].split(' ')
        if (firstPartSplit.length === 2) {
          parts = [firstPartSplit[0], firstPartSplit[1], parts[1]]
        }
      }
    } else {
      parts = trimmed.split(separator)
    }

    if (parts.length < 2 || parts.length > 3) continue

    // Get all possible interpretations for each part
    const allPossibleComponents = parts.map((part) =>
      getAllPossibleComponents(part.trim())
    )

    // Check if all parts have valid interpretations
    if (
      allPossibleComponents.some((possibilities) => possibilities.length === 0)
    )
      continue

    // Generate all combinations
    const allCombinations = generateAllCombinations(allPossibleComponents)

    for (const components of allCombinations) {
      // Group components by type and position
      const yearComps = components.filter((c) => c.type === 'Y')
      const monthComps = components.filter((c) => c.type === 'M')
      const dayComps = components.filter((c) => c.type === 'D')

      // Valid combinations must have exactly one of each required type
      if (yearComps.length > 1 || monthComps.length > 1 || dayComps.length > 1)
        continue
      if (monthComps.length === 0) continue // Month is required

      // Determine valid component arrangements based on position and values
      const componentTypes = components.map((c) => c.type)
      const componentValues = components.map((c) => c.value)

      // Check if this arrangement is valid based on position and values
      let isValidArrangement = true

      if (componentTypes.length === 3) {
        // Three components: Y, M, D
        const [type1, type2, type3] = componentTypes
        const [val1, val2] = componentValues

        if (type1 === 'Y') {
          // Year first: Y-M-D is always valid, Y-D-M is not
          if (!(type2 === 'M' && type3 === 'D')) {
            isValidArrangement = false
          }
        } else if (type3 === 'Y') {
          // Year last: both D-M-Y and M-D-Y could be valid
          // Check if arrangement makes sense based on values
          if (type1 === 'D' && type2 === 'M') {
            // D-M-Y: valid if day > 12 OR month <= 12
            if (val1 <= 12 && val2 <= 12) {
              // Ambiguous case - both could be valid, keep this arrangement
            } else if (val1 > 12) {
              // Definitely day-month-year
            } else {
              // val2 > 12, impossible month
              isValidArrangement = false
            }
          } else if (type1 === 'M' && type2 === 'D') {
            // M-D-Y: valid if month <= 12 AND (day > 12 OR both <= 12)
            if (val1 > 12) {
              // Impossible month
              isValidArrangement = false
            } else if (val2 > 12) {
              // Definitely month-day-year
            } else {
              // Both <= 12, ambiguous case - keep this arrangement
            }
          } else {
            isValidArrangement = false
          }
        } else {
          // Year in middle - not a standard format
          isValidArrangement = false
        }
      } else if (componentTypes.length === 2) {
        // Two components: could be Y-M, M-Y, M-D, D-M
        const [type1, type2] = componentTypes
        const [val1, val2] = componentValues

        if (type1 === 'Y' || type2 === 'Y') {
          // Has year: Y-M or M-Y are both valid
        } else {
          // M-D or D-M: both could be valid based on values
          if (val1 > 12 && val2 <= 12) {
            // First is definitely day, second is month: D-M
            if (!(type1 === 'D' && type2 === 'M')) {
              isValidArrangement = false
            }
          } else if (val1 <= 12 && val2 > 12) {
            // First is month, second is definitely day: M-D
            if (!(type1 === 'M' && type2 === 'D')) {
              isValidArrangement = false
            }
          } else {
            // Both <= 12: ambiguous, both M-D and D-M could be valid
          }
        }
      }

      if (!isValidArrangement) continue

      const yearComp = yearComps[0]
      const monthComp = monthComps[0]
      const dayComp = dayComps[0]

      // Apply defaults
      const year = yearComp ? yearComp.value : 1970
      const month = monthComp.value
      const day = dayComp ? dayComp.value : 1

      // Validate date
      const date = new Date(year, month - 1, day)
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        continue // Invalid date
      }

      // Build format string
      const formatParts = components.map((comp) => comp.format)
      let format: string

      if (separator === ', ' && formatParts.length === 3) {
        // Special handling for comma-space: rejoin as "month day, year"
        format = `${formatParts[0]} ${formatParts[1]}, ${formatParts[2]}`
      } else {
        format = formatParts.join(separator)
      }

      // Create interpretation with corresponding timestamp
      const interpretation: DateInterpretation = {
        timestamp: date.getTime(),
        format: format,
      }

      // Add months property if this is a year-month only date (no day)
      if (!dayComp) {
        interpretation.months = (year - 1970) * 12 + (month - 1)
      } else {
        // Add days property if this is NOT a year-month only date (has day).
        // Use UTC calendar arithmetic: local-midnight subtraction is off by one
        // across DST transitions (a spring-forward day is only 23h long).
        interpretation.days = Date.UTC(year, month - 1, day) / 86400000
      }

      // Avoid duplicates (same format and timestamp)
      const isDuplicate = interpretations.some(
        (interp) =>
          interp.format === interpretation.format &&
          interp.timestamp === interpretation.timestamp
      )

      if (!isDuplicate) {
        interpretations.push(interpretation)
      }
    }
  }

  if (interpretations.length === 0) {
    throw new Error(`Unable to parse date string: "${dateStr}"`)
  }

  // Sort interpretations by format in the specified order
  interpretations.sort((a, b) => {
    return compareDateFormatOrder(a.format, b.format)
  })

  return interpretations
}
