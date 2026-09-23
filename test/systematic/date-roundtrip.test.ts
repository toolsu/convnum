import { describe, expect, test } from 'bun:test'
import {
  formatDateString,
  formatDayString,
  formatMonthString,
  fromJulianDay,
  parseDateString,
  toJulianDay,
} from '../../src'

/**
 * Systematic, timezone-robust date tests. Run under a matrix of timezones in CI
 * (see .github/workflows/test.yml). The `days`/`months` calendar counts are
 * UTC-based and must be timezone-independent.
 */

describe('parse -> formatDayString roundtrip (timezone-robust)', () => {
  test('every day across a leap and non-leap year round-trips via days', () => {
    // Iterate calendar dates directly to avoid DST off-by-one in the test itself
    for (const year of [2023, 2024]) {
      for (let month = 1; month <= 12; month++) {
        const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
        for (let day = 1; day <= daysInMonth; day++) {
          const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const interps = parseDateString(iso)
          const ymd = interps.find(
            (i) => i.format === 'Y-M2-D2' && i.days !== undefined
          )
          expect(ymd).toBeDefined()
          // days is the UTC calendar day count, timezone-independent
          expect(ymd!.days).toBe(Date.UTC(year, month - 1, day) / 86400000)
          // format it back to the same ISO date
          expect(formatDayString(ymd!.days!, 'Y-M2-D2')).toBe(iso)
        }
      }
    }
  })
})

describe('parse -> formatMonthString roundtrip incl. pre-1970 (negative months)', () => {
  test('year-month strings round-trip 1960..2030', () => {
    for (let year = 1960; year <= 2030; year++) {
      for (let month = 1; month <= 12; month++) {
        const str = `${year}-${String(month).padStart(2, '0')}`
        const interp = parseDateString(str).find((i) => i.months !== undefined)
        expect(interp).toBeDefined()
        expect(interp!.months).toBe((year - 1970) * 12 + (month - 1))
        expect(formatMonthString(interp!.months!, 'Y-M2')).toBe(str)
      }
    }
  })

  test('negative months format correctly (no garbage/crash)', () => {
    expect(formatMonthString(-1, 'Y-M2')).toBe('1969-12')
    expect(formatMonthString(-1, 'Mfl Y')).toBe('december 1969')
    expect(formatMonthString(-13, 'Y-M1')).toBe('1968-12')
    expect(formatMonthString(-24, 'Y-M2')).toBe('1968-01')
  })
})

describe('"May" full-name format round-trips', () => {
  test('formatDateString(Mf) output parses back to May', () => {
    const interps = parseDateString('May 1, 2023')
    const formats = interps.map((i) => i.format)
    expect(formats).toContain('Mf D1, Y')
    expect(formats).toContain('Ms D1, Y')
    const mf = interps.find((i) => i.format.includes('Mf'))
    expect(mf).toBeDefined()
    expect(formatDateString(mf!.timestamp, mf!.format)).toBe('May 1, 2023')
  })

  test('lowercase and uppercase May full names too', () => {
    expect(parseDateString('may 2023').map((i) => i.format)).toContain('Mfl Y')
    expect(parseDateString('MAY 2023').map((i) => i.format)).toContain('Mfu Y')
  })
})

describe('formatDateString validates format tokens', () => {
  test('invalid month tokens throw', () => {
    const ts = Date.UTC(2023, 0, 15)
    expect(() => formatDateString(ts, 'Y-M3')).toThrow('Invalid month format')
    expect(() => formatDateString(ts, 'Y-Mzz')).toThrow('Invalid month format')
    expect(() => formatDateString(ts, 'Y-M')).toThrow('Invalid month format')
  })
})

describe('Julian Day — wide-range roundtrip incl. years 0-99', () => {
  test('toJulianDay(fromJulianDay(jd)) === jd across 1721060..3000000', () => {
    for (let jd = 1721060; jd <= 3000000; jd += 211) {
      expect(toJulianDay(fromJulianDay(jd))).toBe(jd)
    }
  })

  test('known anchors', () => {
    // J2000.0 noon = JDN 2451545 (Jan 1, 2000)
    expect(toJulianDay(new Date(2000, 0, 1))).toBe(2451545)
    // Unix epoch = JDN 2440588 (Jan 1, 1970)
    expect(toJulianDay(new Date(1970, 0, 1))).toBe(2440588)
    // Proleptic Gregorian year 50 must not be remapped to 1950
    expect(fromJulianDay(1739323).getFullYear()).toBe(50)
  })
})

describe('malformed date strings are rejected cleanly (no crash)', () => {
  test('invalid dates throw a parse error', () => {
    for (const bad of [
      '30/02/2023',
      '31/04/2023',
      '2023-13-01',
      '00/01/2023',
      'not a date',
      '2023',
      '',
    ]) {
      expect(() => parseDateString(bad)).toThrow()
    }
  })

  test('leap-year February handling', () => {
    expect(() => parseDateString('2024-02-29')).not.toThrow() // 2024 is a leap year
    expect(() => parseDateString('2023-02-29')).toThrow() // 2023 is not
    expect(() => parseDateString('1900-02-29')).toThrow() // century non-leap
    expect(() => parseDateString('2000-02-29')).not.toThrow() // 400-divisible leap
  })
})
