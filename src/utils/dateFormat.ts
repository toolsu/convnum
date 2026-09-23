import { formatSuffixDate, isSuffixFormat } from './cjkDate'
import { freeze } from './freeze'

/**
 * Supported separators for date strings
 * @category Date
 */
export const SEPARATORS = freeze(['-', '.', '/', ',', ', ', ' '] as const)

/**
 * Month names for conversion
 * @category Date
 */
export const MONTH_NAMES = freeze({
  full: freeze([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]),
  short: freeze([
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]),
})

/**
 * Individual interpretation of a date string
 * @category Date
 */
export interface DateInterpretation {
  /** Unix timestamp in milliseconds for this interpretation * @category Date
   */
  timestamp: number
  /** Format string for this interpretation (e.g., "Y-M2-D2") * @category Date
   */
  format: string
  /** Number of months after 1970-01 (only present for year-month only dates) * @category Date
   */
  months?: number
  /** Number of days after 1970-01-01 (only present for dates with day components) * @category Date
   */
  days?: number
}

/**
 * Result of date string parsing containing all possible interpretations
 * @category Date
 */
export type ParseDateResult = DateInterpretation[]

/**
 * Converts month number to formatted month string
 * @category Date
 */
function numberToMonthName(monthNum: number, format: string): string {
  const monthIndex = monthNum - 1

  switch (format) {
    case 'M1':
      return monthNum.toString()
    case 'M2':
      return monthNum.toString().padStart(2, '0')
    case 'Mf':
      return MONTH_NAMES.full[monthIndex]
    case 'Mfl':
      return MONTH_NAMES.full[monthIndex].toLowerCase()
    case 'Mfu':
      return MONTH_NAMES.full[monthIndex].toUpperCase()
    case 'Ms':
      return MONTH_NAMES.short[monthIndex]
    case 'Msl':
      return MONTH_NAMES.short[monthIndex].toLowerCase()
    case 'Msu':
      return MONTH_NAMES.short[monthIndex].toUpperCase()
    default:
      throw new Error(`Invalid month format: "${format}"`)
  }
}

/**
 * Formats a Unix timestamp according to the specified format string.
 * This is the reverse operation of parseDateString.
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @param format - Format string (e.g., "Y-M1-D1", "D2.M2.Y", "Ms D1, Y")
 * @returns Formatted date string matching the original input format
 * @throws Error if the format string is invalid
 *
 * @example
 * ```ts
 * formatDateString(1703462400000, 'Y-M1-D1') // '2023-12-25'
 * formatDateString(1703462400000, 'D1.M1.Y') // '25.12.2023'
 * formatDateString(1703462400000, 'Ms D1, Y') // 'Dec 25, 2023'
 * formatDateString(1701388800000, 'Y-M1') // '2023-12'
 * formatDateString(1640390400000, 'M1-D1') // '12-25'
 * formatDateString(1703462400000, 'D2/M2/Y') // '25/12/2023'
 * formatDateString(1703462400000, 'Mf D1, Y') // 'December 25, 2023'
 * ```
 * @category Date
 */
export function formatDateString(timestamp: number, format: string): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  // A suffix-labelled layout carries its own literals and spacing, so writing it back is
  // substitution rather than joining parts with a separator.
  if (isSuffixFormat(format)) {
    return formatSuffixDate(format, year, month, day)
  }

  // Find the separator used in the format - prioritize comma-space
  let separator = ''
  let formatParts: string[]

  // Check for comma-space pattern first (like "Month Day, Year")
  if (format.includes(', ')) {
    separator = ', '
    const commaParts = format.split(', ')
    if (commaParts.length === 2) {
      const spaceParts = commaParts[0].split(' ')
      if (spaceParts.length === 2) {
        formatParts = [spaceParts[0], spaceParts[1], commaParts[1]]
      } else {
        formatParts = commaParts
      }
    } else {
      formatParts = [format] // Fallback
    }
  } else {
    // Try other separators
    for (const sep of SEPARATORS) {
      if (sep !== ', ' && format.includes(sep)) {
        separator = sep
        break
      }
    }

    if (!separator) {
      throw new Error(
        `Invalid format: no recognized separator found in "${format}"`
      )
    }

    formatParts = format.split(separator)
  }

  // Convert each part (trim spaces from each part)
  const resultParts = formatParts.map((part) => {
    const trimmedPart = part.trim()
    if (trimmedPart === 'Y') {
      return year.toString()
    }
    if (trimmedPart.startsWith('M')) {
      return numberToMonthName(month, trimmedPart)
    }
    if (trimmedPart.startsWith('D')) {
      switch (trimmedPart) {
        case 'D1':
          return day.toString()
        case 'D2':
          return day.toString().padStart(2, '0')
        default:
          throw new Error(`Invalid day format: "${trimmedPart}"`)
      }
    }
    throw new Error(`Invalid format component: "${trimmedPart}"`)
  })

  // Reconstruct the result with proper separator handling
  if (separator === ', ' && formatParts.length === 3) {
    // Handle "Month Day, Year" format by joining as "month day, year"
    return `${resultParts[0]} ${resultParts[1]}, ${resultParts[2]}`
  }
  return resultParts.join(separator)
}

/**
 * Formats a day number (days since 1970-01-01) according to the specified format string.
 * This function only works with date formats that include day components.
 *
 * @param days - Number of days since 1970-01-01 (1970-01-01 = 0, 1970-01-02 = 1, etc.)
 * @param format - Format string for dates with day components (e.g., "Y-M1-D1", "D2.M2.Y", "Ms D1, Y")
 * @returns Formatted date string containing year, month, and day
 * @throws Error if the format string contains only year-month components or is invalid
 *
 * @example
 * ```ts
 * formatDayString(0, 'Y-M1-D1') // '1970-1-1'
 * formatDayString(0, 'D2/M2/Y') // '01/01/1970'
 * formatDayString(1, 'Y-M2-D2') // '1970-01-02'
 * formatDayString(31, 'D1.M1.Y') // '1.2.1970'
 * formatDayString(358, 'Ms D1, Y') // 'Dec 25, 1970'
 * formatDayString(19723, 'Mf D1, Y') // 'December 25, 2023'
 * ```
 * @category Date
 */
export function formatDayString(days: number, format: string): string {
  // `days` is a UTC day count. Recover the calendar date via UTC, then rebuild
  // it as a LOCAL-midnight timestamp so formatDateString (which reads local
  // components) prints the correct day in every timezone, including zones where
  // 1970-01-01 was in DST. Adding exact 24h multiples to a local base date would
  // drift by a day across DST boundaries.
  const utc = new Date(days * 86400000)
  const local = new Date(
    utc.getUTCFullYear(),
    utc.getUTCMonth(),
    utc.getUTCDate()
  )
  const timestamp = local.getTime()

  if (isSuffixFormat(format)) {
    return formatSuffixDate(
      format,
      utc.getUTCFullYear(),
      utc.getUTCMonth() + 1,
      utc.getUTCDate()
    )
  }

  // Validate that format contains day components
  // Find the separator used in the format
  let separator = ''
  let formatParts: string[]

  // Check for comma-space pattern first (like "Month Day, Year")
  if (format.includes(', ')) {
    separator = ', '
    const commaParts = format.split(', ')
    if (commaParts.length === 2) {
      const spaceParts = commaParts[0].split(' ')
      if (spaceParts.length === 2) {
        formatParts = [spaceParts[0], spaceParts[1], commaParts[1]]
      } else {
        formatParts = commaParts
      }
    } else {
      formatParts = [format] // Fallback
    }
  } else if (format.includes(' ')) {
    // Check for space separator (like "Month Day")
    separator = ' '
    formatParts = format.split(' ')
  } else {
    // Try other separators
    for (const sep of SEPARATORS) {
      if (sep !== ', ' && format.includes(sep)) {
        separator = sep
        break
      }
    }

    if (!separator) {
      throw new Error(
        `Invalid format: no recognized separator found in "${format}"`
      )
    }

    formatParts = format.split(separator)
  }

  // Validate that format contains day components
  let hasDayComponent = false
  for (const part of formatParts) {
    const trimmedPart = part.trim()
    if (trimmedPart.startsWith('D')) {
      hasDayComponent = true
      break
    }
  }

  if (!hasDayComponent) {
    throw new Error(
      `Invalid format for day string: format "${format}" must contain day component (D1 or D2)`
    )
  }

  // Use formatDateString to do the actual formatting (it will handle invalid format components)
  return formatDateString(timestamp, format)
}

/**
 * Formats a month number (months since 1970-01) according to the specified format string.
 * This function only works with year-month formats (no day component).
 *
 * @param months - Number of months since 1970-01 (1970-01 = 0, 1970-02 = 1, etc.)
 * @param format - Format string for year-month only (e.g., "Y-M1", "Y.M2", "Mf Y")
 * @returns Formatted date string containing only year and month
 * @throws Error if the format string contains day components or is invalid
 *
 * @example
 * ```ts
 * formatMonthString(0, 'Y-M1') // '1970-1'
 * formatMonthString(1, 'Y-M2') // '1970-02'
 * formatMonthString(12, 'Y-M1') // '1971-1'
 * formatMonthString(0, 'Mf Y') // 'January 1970'
 * formatMonthString(11, 'Ms Y') // 'Dec 1970'
 * ```
 * @category Date
 */
export function formatMonthString(months: number, format: string): string {
  // Convert months to year and month using floored modulo so pre-1970 dates
  // (negative `months`, which parseDateString emits) format correctly.
  const year = Math.floor(months / 12) + 1970
  const month = (((months % 12) + 12) % 12) + 1

  if (isSuffixFormat(format)) {
    return formatSuffixDate(format, year, month, 1)
  }

  // Find the separator used in the format
  let separator = ''
  let formatParts: string[]

  // Check for comma-space pattern first (like "Month Day, Year")
  if (format.includes(', ')) {
    separator = ', '
    const commaParts = format.split(', ')
    if (commaParts.length === 2) {
      const spaceParts = commaParts[0].split(' ')
      if (spaceParts.length === 2) {
        formatParts = [spaceParts[0], spaceParts[1], commaParts[1]]
      } else {
        formatParts = commaParts
      }
    } else {
      formatParts = [format] // Fallback
    }
  } else if (format.includes(' ')) {
    // Check for space separator (like "Month Year")
    separator = ' '
    formatParts = format.split(' ')
  } else {
    // Try other separators
    for (const sep of SEPARATORS) {
      if (sep !== ', ' && format.includes(sep)) {
        separator = sep
        break
      }
    }

    if (!separator) {
      throw new Error(
        `Invalid format: no recognized separator found in "${format}"`
      )
    }

    formatParts = format.split(separator)
  }

  // Validate that format only contains year and month components
  for (const part of formatParts) {
    const trimmedPart = part.trim()
    if (trimmedPart.startsWith('D')) {
      throw new Error(
        `Invalid format for month string: day component "${trimmedPart}" not allowed`
      )
    }
    if (!trimmedPart.startsWith('Y') && !trimmedPart.startsWith('M')) {
      throw new Error(`Invalid format component: "${trimmedPart}"`)
    }
  }

  // Convert each part
  const resultParts = formatParts.map((part) => {
    const trimmedPart = part.trim()
    if (trimmedPart === 'Y') {
      return year.toString()
    }
    if (trimmedPart.startsWith('M')) {
      return numberToMonthName(month, trimmedPart)
    }
    throw new Error(`Invalid format component: "${trimmedPart}"`)
  })

  // Reconstruct the result with proper separator handling
  if (separator === ', ' && formatParts.length === 3) {
    // Handle "Month Day, Year" format by joining as "month day, year"
    return `${resultParts[0]} ${resultParts[1]}, ${resultParts[2]}`
  }
  return resultParts.join(separator)
}
