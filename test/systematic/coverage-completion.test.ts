import { describe, expect, test } from 'bun:test'
import {
  convertFrom,
  convertTo,
  formatDateString,
  formatDayString,
  formatMonthString,
  frenchWordsToOrdinalWords,
  getTypes,
  hasType,
  parseDateString,
} from '../../src'
import { modNoZero } from '../../src/utils/modNoZero'

/**
 * Targeted tests for edge branches, to complete line coverage and pin the
 * behavior of defensive paths.
 */

describe('hasType', () => {
  test('a recognized string is not "unknown"', () => {
    expect(hasType('123', 'unknown')).toBe(false)
    expect(hasType('IV', 'unknown')).toBe(false)
  })
  test('an unrecognized string is "unknown"', () => {
    expect(hasType('!@#$', 'unknown')).toBe(true)
  })
  test('empty and invalid special types', () => {
    expect(hasType('', 'empty')).toBe(true)
    expect(hasType('   ', 'empty')).toBe(true)
    expect(hasType(null as unknown as string, 'invalid')).toBe(true)
  })
})

describe('modNoZero', () => {
  test('wraps into [1, m] and never returns 0', () => {
    expect(modNoZero(0, 12)).toBe(12)
    expect(modNoZero(12, 12)).toBe(12)
    expect(modNoZero(13, 12)).toBe(1)
    expect(modNoZero(-1, 12)).toBe(11)
    expect(modNoZero(-12, 12)).toBe(12)
    expect(modNoZero(25, 12)).toBe(1)
  })
  test('rejects a non-positive modulus', () => {
    expect(() => modNoZero(5, 0)).toThrow('positive')
    expect(() => modNoZero(5, -3)).toThrow('positive')
  })
})

describe('convertFrom month_name / day_of_week reject invalid names', () => {
  test('invalid month/day names throw', () => {
    expect(() => convertFrom('NotAMonth', 'month_name')).toThrow()
    expect(() => convertFrom('Funday', 'day_of_week')).toThrow()
  })
  test('valid names convert', () => {
    expect(convertFrom('January', 'month_name')).toBe(1)
    expect(convertFrom('Monday', 'day_of_week')).toBe(1)
  })
})

describe('convertTo french_ordinal_abbr', () => {
  test('produces 1er and Ne with case applied', () => {
    expect(convertTo(1, 'french_ordinal_abbr')).toBe('1er')
    expect(convertTo(2, { type: 'french_ordinal_abbr', case: 'upper' })).toBe(
      '2E'
    )
  })
})

describe('day-of-week and month-name format detection', () => {
  test('getTypes detects day names with format', () => {
    expect(getTypes('Monday')).toContainEqual({
      type: 'day_of_week',
      case: 'sentence',
      format: 'long',
    })
    expect(getTypes('Mon')).toContainEqual({
      type: 'day_of_week',
      case: 'sentence',
      format: 'short',
    })
  })
  test('getTypes detects month names with format', () => {
    expect(getTypes('March')).toContainEqual({
      type: 'month_name',
      case: 'sentence',
      format: 'long',
    })
  })
})

describe('frenchWordsToOrdinalWords branches', () => {
  test('standalone "un" -> "premier"', () => {
    expect(frenchWordsToOrdinalWords('un')).toBe('premier')
  })
  test('irregular map word (vingt -> vingtième)', () => {
    expect(frenchWordsToOrdinalWords('vingt')).toBe('vingtième')
  })
  test('already-ordinal input is returned unchanged', () => {
    expect(frenchWordsToOrdinalWords('vingtième')).toBe('vingtième')
  })
  test('non-number input is returned unchanged', () => {
    expect(frenchWordsToOrdinalWords('xyz!')).toBe('xyz!')
  })
})

describe('date arrangement disambiguation branches', () => {
  test('unambiguous D-M-Y when day > 12', () => {
    const r = parseDateString('25/12/2023')
    expect(r.some((i) => i.format === 'D2/M2/Y')).toBe(true)
    // 25 cannot be a month, so no M-D-Y interpretation
    expect(r.some((i) => i.format.startsWith('M'))).toBe(false)
  })
  test('unambiguous M-D-Y when second value > 12', () => {
    const r = parseDateString('12/25/2023')
    expect(r.some((i) => i.format === 'M2/D2/Y')).toBe(true)
    expect(r.some((i) => i.format === 'D2/M2/Y')).toBe(false)
  })
  test('impossible month is rejected (no interpretation)', () => {
    // 13/25/2023: 13 can't be a month and neither arrangement works cleanly
    expect(() => parseDateString('13/25/2023')).toThrow()
  })
  test('ambiguous both<=12 yields both D-M-Y and M-D-Y', () => {
    const r = parseDateString('05/06/2023')
    expect(r.some((i) => i.format === 'D2/M2/Y')).toBe(true)
    expect(r.some((i) => i.format === 'M2/D2/Y')).toBe(true)
  })
  test('two-component M-D vs D-M disambiguation', () => {
    expect(parseDateString('25/12').some((i) => i.format === 'D2/M2')).toBe(
      true
    )
    expect(parseDateString('12/25').some((i) => i.format === 'M2/D2')).toBe(
      true
    )
  })
})

describe('validator catch paths', () => {
  test('multi-letter non-Greek-name words are not greek_letter_english_name', () => {
    // "hello" matches the /^[A-Za-z]+$/ pre-filter but fromGreekLetterEnglishName throws
    expect(getTypes('hello').map((t) => t.type)).not.toContain(
      'greek_letter_english_name'
    )
    // "beta" IS a Greek letter name
    expect(getTypes('beta').map((t) => t.type)).toContain(
      'greek_letter_english_name'
    )
  })
})

describe('comma-space month/year format', () => {
  test('formatMonthString / formatDateString handle "Mf, Y"', () => {
    // parseDateString for a comma-space month-year input
    const r = parseDateString('March, 2023')
    expect(r.length).toBeGreaterThan(0)
    // formatDateString reads local components, so build a local-midnight ts
    const ts = new Date(2023, 2, 1).getTime()
    expect(formatDateString(ts, 'Mf, Y')).toBe('March, 2023')
  })
})

describe('format-string separator handling and errors', () => {
  test('no recognized separator throws in all three formatters', () => {
    const ts = Date.UTC(2023, 2, 15)
    expect(() => formatDateString(ts, 'YMD')).toThrow()
    expect(() => formatDayString(100, 'YMD')).toThrow()
    expect(() => formatMonthString(100, 'YM')).toThrow()
  })
  test('formatDayString requires a day component', () => {
    expect(() => formatDayString(100, 'Y-M2')).toThrow('day component')
  })
  test('formatMonthString rejects a day component', () => {
    expect(() => formatMonthString(100, 'Y-M2-D2')).toThrow()
  })
  test('named-month comma-space formats round-trip', () => {
    const r = parseDateString('December 25, 2023')
    const mf = r.find((i) => i.format === 'Mf D1, Y')
    expect(mf).toBeDefined()
    expect(formatDateString(mf!.timestamp, mf!.format)).toBe(
      'December 25, 2023'
    )
  })
})
