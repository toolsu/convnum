import type { DateInterpretation } from './dateFormat'

/**
 * Date layouts that label each field with a suffix instead of separating them.
 *
 * `2023年12月25日` and `2023년 12월 25일` are not "a year, a separator, a month": each
 * number carries a character saying what it is. That makes them unambiguous in a way no
 * infix layout is — there is no D-M-Y-versus-M-D-Y question to get wrong — but it also
 * means the separator machinery the other formats use cannot express them, so they get
 * their own path.
 *
 * Japanese and Chinese share 年月日; Korean uses 년월일 and conventionally puts a space
 * after each field, which is preserved rather than normalised.
 */
const SUFFIX_LAYOUTS = [
  { year: '年', month: '月', day: '日' },
  { year: '년', month: '월', day: '일' },
] as const

type SuffixLayout = (typeof SUFFIX_LAYOUTS)[number]

/** A field as it was written: its value, and whether it was padded to two digits. */
interface Field {
  readonly value: number
  readonly padded: boolean
}

function field(text: string): Field {
  return { value: Number.parseInt(text, 10), padded: text.length === 2 }
}

/**
 * A year and how wide it was written.
 *
 * These layouts are used for years of any length — `8年`, `08年`, `208年`, `1208年` — so
 * the width is carried through and reproduced, and a year that outgrows it simply gets
 * longer: `999年` counting on gives `1000年`, never a truncated one.
 */
function yearToken(text: string): string {
  return `Y${Math.min(text.length, 4)}`
}

/**
 * Builds a UTC timestamp for a date, safely for years 0–99.
 *
 * `Date.UTC(8, 2, 9)` is 1908, not the year 8 — the two-digit-year rule from the language's
 * first decade. `setUTCFullYear` is the only way to say what you mean.
 */
function utcOf(year: number, month: number, day: number): number {
  const date = new Date(0)
  date.setUTCFullYear(year, month - 1, day)
  date.setUTCHours(0, 0, 0, 0)
  return date.getTime()
}

/** The same, in local time, for the `timestamp` an interpretation carries. */
function localOf(year: number, month: number, day: number): number {
  const date = new Date(0)
  date.setFullYear(year, month - 1, day)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

/**
 * The format tokens a field could have been written with.
 *
 * Two digits is ambiguous whenever the value needs two anyway: `12月` may be a padded
 * `M2` or an unpadded `M1`, and only the other end of a range can say which — `2023年12月`
 * to `2024年3月` is unpadded, `2023年01月` to `2023年12月` is padded. Both readings are
 * reported, exactly as the infix formats do for `2023-12`, and `findCommonDateFormat`
 * picks. A single digit can only be unpadded, and a leading zero can only be padded.
 */
function tokens(letter: 'M' | 'D', part: Field): string[] {
  if (!part.padded) {
    return [`${letter}1`]
  }
  // Unpadded first: `2023年1月1日` is how these layouts are normally written, so that is
  // what a lone value should count on as, while an explicit `01月` still pins the padding.
  return part.value < 10 ? [`${letter}2`] : [`${letter}1`, `${letter}2`]
}

/**
 * Reads a suffix-labelled date.
 *
 * Recognises a full date, a year and month, and a month and day — the same three shapes
 * the infix formats support — with any spacing between the fields.
 */
export function parseSuffixDate(trimmed: string): DateInterpretation[] {
  const interpretations: DateInterpretation[] = []

  for (const layout of SUFFIX_LAYOUTS) {
    const { year: y, month: m, day: d } = layout
    const gap = '\\s*'
    const patterns: {
      readonly regex: RegExp
      readonly shape: 'ymd' | 'ym' | 'md'
    }[] = [
      {
        regex: new RegExp(
          `^(\\d{1,4})${y}(${gap})(\\d{1,2})${m}(${gap})(\\d{1,2})${d}$`
        ),
        shape: 'ymd',
      },
      {
        regex: new RegExp(`^(\\d{1,4})${y}(${gap})(\\d{1,2})${m}$`),
        shape: 'ym',
      },
      {
        regex: new RegExp(`^(\\d{1,2})${m}(${gap})(\\d{1,2})${d}$`),
        shape: 'md',
      },
    ]

    for (const { regex, shape } of patterns) {
      const match = regex.exec(trimmed)
      if (!match) {
        continue
      }

      interpretations.push(...readMatch(match, shape, layout))
    }
  }

  return interpretations
}

/** Turns one matched layout into every reading of it, or nothing if it is not a date. */
function readMatch(
  match: RegExpExecArray,
  shape: 'ymd' | 'ym' | 'md',
  layout: SuffixLayout
): DateInterpretation[] {
  // A month-and-day date has no year of its own; 1970 is what the infix formats use so
  // that the day count lines up with the epoch.
  const yearText = shape === 'md' ? '1970' : (match[1] as string)
  const year = Number.parseInt(yearText, 10)
  const monthText = (shape === 'md' ? match[1] : match[3]) as string
  const month = field(monthText)
  const day =
    shape === 'ym'
      ? null
      : field((shape === 'md' ? match[3] : match[5]) as string)

  if (month.value < 1 || month.value > 12) {
    return []
  }
  if (day && (day.value < 1 || day.value > 31)) {
    return []
  }
  // Reject a day the month does not have, so 2023年2月30日 is not silently rolled over.
  if (
    day &&
    new Date(utcOf(year, month.value, day.value)).getUTCDate() !== day.value
  ) {
    return []
  }

  const gaps =
    shape === 'md' ? [match[2] as string] : [match[2] as string, match[4] ?? '']
  const timestamp = localOf(year, month.value, day ? day.value : 1)

  const readings: DateInterpretation[] = []
  for (const monthToken of tokens('M', month)) {
    for (const dayToken of day ? tokens('D', day) : [null]) {
      const interpretation: DateInterpretation = {
        timestamp,
        format: buildFormat(
          shape,
          layout,
          yearToken(yearText),
          monthToken,
          dayToken,
          gaps
        ),
      }
      if (day) {
        interpretation.days = utcOf(year, month.value, day.value) / 86400000
      } else {
        interpretation.months = (year - 1970) * 12 + (month.value - 1)
      }
      readings.push(interpretation)
    }
  }
  return readings
}

/** The format string that reproduces exactly what was read, spacing included. */
function buildFormat(
  shape: 'ymd' | 'ym' | 'md',
  layout: SuffixLayout,
  year: string,
  monthToken: string,
  dayToken: string | null,
  gaps: readonly string[]
): string {
  const monthPart = `${monthToken}${layout.month}`
  const dayPart = dayToken ? `${dayToken}${layout.day}` : ''

  if (shape === 'md') {
    return `${monthPart}${gaps[0]}${dayPart}`
  }
  const yearPart = `${year}${layout.year}${gaps[0]}`
  if (shape === 'ym') {
    return `${yearPart}${monthPart}`
  }
  return `${yearPart}${monthPart}${gaps[1] ?? ''}${dayPart}`
}

/** Whether `format` is one of the suffix-labelled layouts. */
export function isSuffixFormat(format: string): boolean {
  return SUFFIX_LAYOUTS.some(
    (layout) =>
      format.includes(layout.month) &&
      (format.includes(layout.year) || format.includes(layout.day))
  )
}

/**
 * Writes a date back in a suffix-labelled layout.
 *
 * The format string carries the literal suffixes and the spacing, so this only has to
 * substitute the numbers back into it.
 */
export function formatSuffixDate(
  format: string,
  year: number,
  month: number,
  day: number
): string {
  // One pass, longest tokens matched whole, so `Y2` is never mistaken for `Y` followed by
  // a literal `2`. The width is a minimum, never a truncation: a year written `999年`
  // becomes `1000年` rather than losing its leading digit.
  return format.replace(/Y[1-4]|[MD][12]/g, (token) => {
    const width = Number.parseInt(token.slice(1), 10)
    const value = token[0] === 'Y' ? year : token[0] === 'M' ? month : day
    return String(value).padStart(width, '0')
  })
}
