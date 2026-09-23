import { describe, expect, test } from 'bun:test'
import {
  formatDateString,
  formatDayString,
  formatMonthString,
} from '../../src/utils/dateFormat'
import { parseDateString } from '../../src/utils/dateParse'

describe('Basic day formatting', () => {
  test('should format day 0 (1970-01-01) correctly', () => {
    expect(formatDayString(0, 'Y-M1-D1')).toBe('1970-1-1')
    expect(formatDayString(0, 'Y-M2-D2')).toBe('1970-01-01')
    expect(formatDayString(0, 'D1.M1.Y')).toBe('1.1.1970')
    expect(formatDayString(0, 'D2/M2/Y')).toBe('01/01/1970')
  })

  test('should format day 1 (1970-01-02) correctly', () => {
    expect(formatDayString(1, 'Y-M2-D2')).toBe('1970-01-02')
    expect(formatDayString(1, 'D1-M1-Y')).toBe('2-1-1970')
    expect(formatDayString(1, 'M1-D1-Y')).toBe('1-2-1970')
  })

  test('should format day 31 (1970-02-01) correctly', () => {
    expect(formatDayString(31, 'Y-M1-D1')).toBe('1970-2-1')
    expect(formatDayString(31, 'D1.M1.Y')).toBe('1.2.1970')
    expect(formatDayString(31, 'M2/D2/Y')).toBe('02/01/1970')
  })

  test('should format day 358 (1970-12-25) correctly', () => {
    expect(formatDayString(358, 'Y-M1-D1')).toBe('1970-12-25')
    expect(formatDayString(358, 'D2.M2.Y')).toBe('25.12.1970')
    expect(formatDayString(358, 'M1-D1-Y')).toBe('12-25-1970')
  })

  test('should format day 19716 (2023-12-25) correctly', () => {
    expect(formatDayString(19716, 'Y-M1-D1')).toBe('2023-12-25')
    expect(formatDayString(19716, 'D1/M1/Y')).toBe('25/12/2023')
    expect(formatDayString(19716, 'M2-D2-Y')).toBe('12-25-2023')
  })
})

describe('Named month formatting', () => {
  test('should format with full month names', () => {
    // Day 358 = Dec 25, 1970
    expect(formatDayString(358, 'Mf D1, Y')).toBe('December 25, 1970')
    expect(formatDayString(358, 'Mfl D1, Y')).toBe('december 25, 1970')
    expect(formatDayString(358, 'Mfu D1, Y')).toBe('DECEMBER 25, 1970')
  })

  test('should format with short month names', () => {
    // Day 358 = Dec 25, 1970
    expect(formatDayString(358, 'Ms D1, Y')).toBe('Dec 25, 1970')
    expect(formatDayString(358, 'Msl D1, Y')).toBe('dec 25, 1970')
    expect(formatDayString(358, 'Msu D1, Y')).toBe('DEC 25, 1970')
  })

  test('should format various named month patterns', () => {
    // Day 365 = Jan 1, 1971
    expect(formatDayString(365, 'Y-Mf-D1')).toBe('1971-January-1')
    expect(formatDayString(365, 'Ms-D2-Y')).toBe('Jan-01-1971')
    expect(formatDayString(365, 'D1 Mf Y')).toBe('1 January 1971')
  })
})

describe('Various separators', () => {
  test('should handle different separators correctly', () => {
    // Day 100 = April 11, 1970
    expect(formatDayString(100, 'Y-M1-D1')).toBe('1970-4-11')
    expect(formatDayString(100, 'Y.M2.D2')).toBe('1970.04.11')
    expect(formatDayString(100, 'Y/M1/D1')).toBe('1970/4/11')
    expect(formatDayString(100, 'Y,M2,D2')).toBe('1970,04,11')
  })

  test('should handle space and comma-space separators', () => {
    // Day 200 = July 20, 1970
    expect(formatDayString(200, 'Ms D1 Y')).toBe('Jul 20 1970')
    expect(formatDayString(200, 'Mf D2, Y')).toBe('July 20, 1970')
  })
})

describe('Leap year handling', () => {
  test('should handle leap year dates correctly', () => {
    // Day 19782 = Feb 29, 2024 (leap year)
    expect(formatDayString(19782, 'Y-M2-D2')).toBe('2024-02-29')
    expect(formatDayString(19782, 'D1.M1.Y')).toBe('29.2.2024')
    expect(formatDayString(19782, 'Mf D1, Y')).toBe('February 29, 2024')
  })
})

describe('Error handling for formatDayString', () => {
  test('should throw error for formats without day components', () => {
    expect(() => formatDayString(0, 'Y-M1')).toThrow(
      'Invalid format for day string: format "Y-M1" must contain day component (D1 or D2)'
    )
    expect(() => formatDayString(0, 'M2-Y')).toThrow(
      'Invalid format for day string: format "M2-Y" must contain day component (D1 or D2)'
    )
    expect(() => formatDayString(0, 'Mf Y')).toThrow(
      'Invalid format for day string: format "Mf Y" must contain day component (D1 or D2)'
    )
  })

  test('should throw error for invalid format components', () => {
    expect(() => formatDayString(0, 'Y-M1-X')).toThrow(
      'Invalid format for day string: format "Y-M1-X" must contain day component (D1 or D2)'
    )
    expect(() => formatDayString(0, 'invalid-D1-format')).toThrow(
      'Invalid format component'
    )
  })

  test('should throw error for formats without separators', () => {
    expect(() => formatDayString(0, 'YMD')).toThrow(
      'Invalid format: no recognized separator found in "YMD"'
    )
    expect(() => formatMonthString(0, 'YM')).toThrow(
      'Invalid format: no recognized separator found in "YM"'
    )
  })

  test('should throw error for invalid format components', () => {
    expect(() => formatDayString(0, 'Y-M1-D1-X')).toThrow(
      'Invalid format component: "X"'
    )
    expect(() => formatMonthString(0, 'Y-M1-X')).toThrow(
      'Invalid format component: "X"'
    )
  })

  test('should throw error for invalid day formats', () => {
    expect(() => formatDayString(0, 'Y-M1-D3')).toThrow(
      'Invalid day format: "D3"'
    )
  })

  test('should throw error for day components in month formats', () => {
    expect(() => formatMonthString(0, 'Y-M1-D1')).toThrow(
      'Invalid format for month string: day component "D1" not allowed'
    )
  })
})

describe('Round-trip consistency with days', () => {
  test('should round-trip with parseDateString for day formats', () => {
    const testCases = [
      { days: 0, format: 'Y-M1-D1', expectedString: '1970-1-1' },
      { days: 1, format: 'Y-M2-D2', expectedString: '1970-01-02' },
      { days: 31, format: 'D1-M1-Y', expectedString: '1-2-1970' },
      { days: 100, format: 'M2/D2/Y', expectedString: '04/11/1970' },
      { days: 358, format: 'D2.M2.Y', expectedString: '25.12.1970' },
      { days: 358, format: 'Ms D1, Y', expectedString: 'Dec 25, 1970' },
      {
        days: 19716,
        format: 'Mf D1, Y',
        expectedString: 'December 25, 2023',
      },
    ]

    testCases.forEach(({ days, format, expectedString }) => {
      // Format days to string
      const formatted = formatDayString(days, format)
      expect(formatted).toBe(expectedString)

      // Parse the formatted string back
      const parsed = parseDateString(formatted)
      expect(parsed.length).toBeGreaterThan(0)

      // Find the matching interpretation
      const matchingInterp = parsed.find(
        (i) => i.format === format && i.days === days
      )
      expect(matchingInterp).toBeDefined()
    })
  })

  test('should handle edge cases in round-trip', () => {
    // Test various edge cases
    const edgeCases = [
      { days: 0, format: 'Y-M2-D2' }, // 1970-01-01
      { days: 365, format: 'Y-M1-D1' }, // 1971-01-01
      { days: 1000, format: 'D2/M2/Y' }, // September 27, 1972
      { days: 9998, format: 'Ms D1, Y' }, // May 18, 1997 (May is both short and full, so parser prefers short)
      { days: 19716, format: 'Ms D1, Y' }, // Dec 25, 2023
    ]

    edgeCases.forEach(({ days, format }) => {
      const formatted = formatDayString(days, format)
      const parsed = parseDateString(formatted)
      expect(parsed.length).toBeGreaterThan(0)

      // Find the matching interpretation
      const matchingInterp = parsed.find(
        (i) => i.format === format && i.days === days
      )
      expect(matchingInterp).toBeDefined()
    })
  })
})

describe('Cross-validation with formatDateString', () => {
  test('should produce same results as formatDateString for equivalent inputs', () => {
    const testCases = [
      { days: 0, timestamp: new Date(1970, 0, 1).getTime() },
      { days: 100, timestamp: new Date(1970, 3, 11).getTime() },
      { days: 358, timestamp: new Date(1970, 11, 25).getTime() },
      { days: 19716, timestamp: new Date(2023, 11, 25).getTime() },
    ]

    const formats = ['Y-M1-D1', 'D2.M2.Y', 'M1-D1-Y', 'Ms D1, Y']

    testCases.forEach(({ days, timestamp }) => {
      formats.forEach((format) => {
        const fromDays = formatDayString(days, format)
        const fromTimestamp = formatDateString(timestamp, format)
        expect(fromDays).toBe(fromTimestamp)
      })
    })
  })
})

describe('Days property validation in parseDateString', () => {
  test('should include days property for dates with day components', () => {
    const result = parseDateString('2023-12-25')
    expect(result.length).toBeGreaterThan(0)

    result.forEach((interp) => {
      expect(interp.days).toBe(19716) // Dec 25, 2023 = 19716 days from Jan 1, 1970
      expect(interp.months).toBeUndefined() // Should not have months for day-containing dates
    })
  })

  test('should include days property for M-D format (defaulting year to 1970)', () => {
    const result = parseDateString('12-25')
    expect(result.length).toBeGreaterThan(0)

    // All interpretations should be Dec 25, 1970
    result.forEach((interp) => {
      expect(interp.days).toBe(358) // Dec 25, 1970 = 358 days from Jan 1, 1970
      expect(interp.months).toBeUndefined() // Should not have months for day-containing dates
    })
  })

  test('should NOT include days property for year-month only dates', () => {
    const result = parseDateString('2023-12')
    expect(result.length).toBeGreaterThan(0)

    result.forEach((interp) => {
      expect(interp.days).toBeUndefined() // Should not have days for year-month only dates
      expect(interp.months).toBe(647) // Should have months property
    })
  })
})
