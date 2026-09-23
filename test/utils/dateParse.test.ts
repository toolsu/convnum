import { describe, expect, test } from 'bun:test'
import { formatDateString, formatMonthString } from '../../src/utils/dateFormat'
import { parseDateString } from '../../src/utils/dateParse'

describe('parseDateString function', () => {
  describe('Y-M-D format variants', () => {
    test('should parse Y-M-D format with all format combinations', () => {
      const result = parseDateString('2023-12-25')
      expect(result).toHaveLength(4) // All M1/M2 × D1/D2 combinations

      // Check all combinations exist with same timestamp
      const formats = result.map((r) => r.format)
      expect(formats).toContain('Y-M2-D2')
      expect(formats).toContain('Y-M2-D1')
      expect(formats).toContain('Y-M1-D2')
      expect(formats).toContain('Y-M1-D1')

      // All should have same timestamp (same date)
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 11, 25))
    })

    test('should parse Y-M-D format without position ambiguity (year first)', () => {
      const result = parseDateString('2023-01-05')
      // No Y-D-M ambiguity when year is first - only Y-M-D is valid
      // But should have format combinations for 01 and 05 (M1/M2 × D1/D2)
      expect(result).toHaveLength(4)

      const formats = result.map((i) => i.format)
      expect(formats).toContain('Y-M2-D2')
      expect(formats).toContain('Y-M2-D1')
      expect(formats).toContain('Y-M1-D2')
      expect(formats).toContain('Y-M1-D1')

      // All should have same timestamp (January 5th, 2023)
      const timestamps = result.map((i) => i.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 0, 5))
    })

    test('should parse Y-M-D format with dot separator (all combinations)', () => {
      const result = parseDateString('2023.12.25')
      expect(result).toHaveLength(4) // All M1/M2 × D1/D2 combinations

      const formats = result.map((r) => r.format)
      expect(formats).toContain('Y.M2.D2')
      expect(formats).toContain('Y.M2.D1')
      expect(formats).toContain('Y.M1.D2')
      expect(formats).toContain('Y.M1.D1')

      // All should have same timestamp
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 11, 25))
    })

    test('should parse Y-M-D format with slash separator (all combinations)', () => {
      const result = parseDateString('2023/12/25')
      expect(result).toHaveLength(4) // All M1/M2 × D1/D2 combinations

      const formats = result.map((r) => r.format)
      expect(formats).toContain('Y/M2/D2')
      expect(formats).toContain('Y/M2/D1')
      expect(formats).toContain('Y/M1/D2')
      expect(formats).toContain('Y/M1/D1')

      // All should have same timestamp
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 11, 25))
    })

    test('should parse Y-M-D format with comma separator (all combinations)', () => {
      const result = parseDateString('2023,12,25')
      expect(result).toHaveLength(4) // All M1/M2 × D1/D2 combinations

      const formats = result.map((r) => r.format)
      expect(formats).toContain('Y,M2,D2')
      expect(formats).toContain('Y,M2,D1')
      expect(formats).toContain('Y,M1,D2')
      expect(formats).toContain('Y,M1,D1')

      // All should have same timestamp
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 11, 25))
    })
  })

  describe('D-M-Y format variants', () => {
    test('should parse D-M-Y format (all combinations)', () => {
      const result = parseDateString('25-12-2023')
      expect(result).toHaveLength(4) // All D1/D2 × M1/M2 combinations

      const formats = result.map((r) => r.format)
      expect(formats).toContain('D2-M2-Y')
      expect(formats).toContain('D2-M1-Y')
      expect(formats).toContain('D1-M2-Y')
      expect(formats).toContain('D1-M1-Y')

      // All should have same timestamp
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 11, 25))
    })

    test('should parse ambiguous date with positional and format combinations', () => {
      const result = parseDateString('05.01.2023')
      expect(result).toHaveLength(8) // 2 positional × 4 format combinations

      // Check that we have exactly two different timestamps (dates)
      const timestamps = result.map((r) => r.timestamp)
      const uniqueTimestamps = timestamps.filter(
        (ts, index) => timestamps.indexOf(ts) === index
      )
      expect(uniqueTimestamps).toHaveLength(2) // Two different dates

      expect(uniqueTimestamps).toContain(new Date(2023, 4, 1).getTime()) // May 1st (M-D interpretation)
      expect(uniqueTimestamps).toContain(new Date(2023, 0, 5).getTime()) // Jan 5th (D-M interpretation)

      // Each timestamp should have 4 format combinations
      uniqueTimestamps.forEach((timestamp) => {
        const groupForTimestamp = result.filter(
          (r) => r.timestamp === timestamp
        )
        expect(groupForTimestamp).toHaveLength(4)
      })
    })

    test('should parse unambiguous D/M/Y format (31 cannot be month)', () => {
      const result = parseDateString('31/1/2023')
      expect(result).toHaveLength(2) // Only D-M order valid, but 2 format combinations for day

      const formats = result.map((r) => r.format)
      expect(formats).toContain('D2/M1/Y')
      expect(formats).toContain('D1/M1/Y')
      // Note: 31 matches both D1 and D2 patterns, 1 only matches M1 pattern (not M2 since it's not zero-padded)

      // All should have same timestamp (January 31st, 2023)
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 0, 31))
    })
  })

  describe('M-D-Y format variants', () => {
    test('should parse unambiguous M-D-Y format (25 cannot be month)', () => {
      const result = parseDateString('12-25-2023')
      expect(result).toHaveLength(4) // Only M-D order valid, but all format combinations available

      const formats = result.map((r) => r.format)
      expect(formats).toContain('M2-D2-Y')
      expect(formats).toContain('M2-D1-Y')
      expect(formats).toContain('M1-D2-Y')
      expect(formats).toContain('M1-D1-Y')

      // All should have same timestamp (December 25th, 2023)
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 11, 25))
    })

    test('should parse ambiguous date with positional and format combinations', () => {
      const result = parseDateString('01/05/2023')
      expect(result).toHaveLength(8) // 2 positional × 4 format combinations

      // Check that we have exactly two different timestamps (dates)
      const timestamps = result.map((r) => r.timestamp)
      const uniqueTimestamps = timestamps.filter(
        (ts, index) => timestamps.indexOf(ts) === index
      )
      expect(uniqueTimestamps).toHaveLength(2) // Two different dates

      expect(uniqueTimestamps).toContain(new Date(2023, 0, 5).getTime()) // Jan 5th (M-D interpretation)
      expect(uniqueTimestamps).toContain(new Date(2023, 4, 1).getTime()) // May 1st (D-M interpretation)

      // Each timestamp should have 4 format combinations
      uniqueTimestamps.forEach((timestamp) => {
        const groupForTimestamp = result.filter(
          (r) => r.timestamp === timestamp
        )
        expect(groupForTimestamp).toHaveLength(4)
      })
    })
  })

  describe('Y-M format (no day)', () => {
    test('should parse Y-M format and default day to 1', () => {
      const result = parseDateString('2023-12')
      expect(result).toHaveLength(2) // Both M1 and M2 formats

      const formats = result.map((r) => r.format)
      expect(formats).toContain('Y-M2')
      expect(formats).toContain('Y-M1')

      // All should have same timestamp and months property
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 11, 1))

      // Should have months property
      result.forEach((interp) => {
        expect(interp.months).toBe(647) // (2023-1970)*12 + (12-1)
      })
    })

    test('should parse Y.M format and default day to 1', () => {
      const result = parseDateString('2023.01')
      expect(result).toHaveLength(2) // Both M1 and M2 formats (01 matches both)

      const formats = result.map((r) => r.format)
      expect(formats).toContain('Y.M2')
      expect(formats).toContain('Y.M1')

      // All should have same timestamp and months property
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 0, 1))

      // Should have months property
      result.forEach((interp) => {
        expect(interp.months).toBe(636) // (2023-1970)*12 + (1-1)
      })
    })
  })

  describe('M-Y format (no day)', () => {
    test('should parse M-Y format and default day to 1', () => {
      const result = parseDateString('12-2023')
      expect(result).toHaveLength(2) // Both M1 and M2 formats

      const formats = result.map((r) => r.format)
      expect(formats).toContain('M2-Y')
      expect(formats).toContain('M1-Y')

      // All should have same timestamp and months property
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 11, 1))

      // Should have months property
      result.forEach((interp) => {
        expect(interp.months).toBe(647) // (2023-1970)*12 + (12-1)
      })
    })

    test('should parse M/Y format and default day to 1', () => {
      const result = parseDateString('01/2023')
      expect(result).toHaveLength(2) // Both M1 and M2 formats (01 matches both)

      const formats = result.map((r) => r.format)
      expect(formats).toContain('M2/Y')
      expect(formats).toContain('M1/Y')

      // All should have same timestamp and months property
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 0, 1))

      // Should have months property
      result.forEach((interp) => {
        expect(interp.months).toBe(636) // (2023-1970)*12 + (1-1)
      })
    })
  })

  describe('M-D format (no year)', () => {
    test('should parse unambiguous M-D format and default year to 1970 (25 cannot be month)', () => {
      const result = parseDateString('12-25')
      expect(result).toHaveLength(4) // Only M-D order valid, but all format combinations available

      const formats = result.map((r) => r.format)
      expect(formats).toContain('M2-D2')
      expect(formats).toContain('M2-D1')
      expect(formats).toContain('M1-D2')
      expect(formats).toContain('M1-D1')

      // All should have same timestamp (December 25th, 1970)
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(1970, 11, 25))

      // Should have days property (Dec 25, 1970 = 358 days from Jan 1, 1970)
      result.forEach((interp) => {
        expect(interp.days).toBe(358)
        expect(interp.months).toBeUndefined() // Should not have months for day-containing dates
      })
    })

    test('should parse ambiguous M/D format with positional and format combinations', () => {
      const result = parseDateString('01.05')
      expect(result).toHaveLength(8) // 2 positional × 4 format combinations

      // Check that we have exactly two different timestamps (dates)
      const timestamps = result.map((r) => r.timestamp)
      const uniqueTimestamps = timestamps.filter(
        (ts, index) => timestamps.indexOf(ts) === index
      )
      expect(uniqueTimestamps).toHaveLength(2) // Two different dates

      expect(uniqueTimestamps).toContain(new Date(1970, 0, 5).getTime()) // Jan 5th (M-D interpretation)
      expect(uniqueTimestamps).toContain(new Date(1970, 4, 1).getTime()) // May 1st (D-M interpretation)

      // Each timestamp should have 4 format combinations
      uniqueTimestamps.forEach((timestamp) => {
        const groupForTimestamp = result.filter(
          (r) => r.timestamp === timestamp
        )
        expect(groupForTimestamp).toHaveLength(4)
      })
    })
  })

  describe('D-M format (no year)', () => {
    test('should parse unambiguous D-M format and default year to 1970 (25 cannot be month)', () => {
      const result = parseDateString('25-12')
      expect(result).toHaveLength(4) // Only D-M order valid, but all format combinations available

      const formats = result.map((r) => r.format)
      expect(formats).toContain('D2-M2')
      expect(formats).toContain('D2-M1')
      expect(formats).toContain('D1-M2')
      expect(formats).toContain('D1-M1')

      // All should have same timestamp (December 25th, 1970)
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(1970, 11, 25))
    })

    test('should parse ambiguous D/M format with positional and format combinations', () => {
      const result = parseDateString('05/01')
      expect(result).toHaveLength(8) // 2 positional × 4 format combinations

      // Check that we have exactly two different timestamps (dates)
      const timestamps = result.map((r) => r.timestamp)
      const uniqueTimestamps = timestamps.filter(
        (ts, index) => timestamps.indexOf(ts) === index
      )
      expect(uniqueTimestamps).toHaveLength(2) // Two different dates

      expect(uniqueTimestamps).toContain(new Date(1970, 0, 5).getTime()) // Jan 5th (M-D interpretation)
      expect(uniqueTimestamps).toContain(new Date(1970, 4, 1).getTime()) // May 1st (D-M interpretation)

      // Each timestamp should have 4 format combinations
      uniqueTimestamps.forEach((timestamp) => {
        const groupForTimestamp = result.filter(
          (r) => r.timestamp === timestamp
        )
        expect(groupForTimestamp).toHaveLength(4)
      })
    })
  })

  describe('Named month formats', () => {
    test('should parse full month name with title case', () => {
      const result = parseDateString('December 25, 2023')
      expect(result).toHaveLength(2) // D1 and D2 format combinations

      const formats = result.map((r) => r.format)
      expect(formats).toContain('Mf D2, Y')
      expect(formats).toContain('Mf D1, Y')

      // All should have same timestamp
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 11, 25))
    })

    test('should parse full month name with lowercase', () => {
      const result = parseDateString('december 25, 2023')
      expect(result).toHaveLength(2) // D1 and D2 format combinations

      const formats = result.map((r) => r.format)
      expect(formats).toContain('Mfl D2, Y')
      expect(formats).toContain('Mfl D1, Y')

      // All should have same timestamp
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 11, 25))
    })

    test('should parse full month name with uppercase', () => {
      const result = parseDateString('DECEMBER 25, 2023')
      expect(result).toHaveLength(2) // D1 and D2 format combinations

      const formats = result.map((r) => r.format)
      expect(formats).toContain('Mfu D2, Y')
      expect(formats).toContain('Mfu D1, Y')

      // All should have same timestamp
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 11, 25))
    })

    test('should parse short month name with title case', () => {
      const result = parseDateString('Dec 25, 2023')
      expect(result).toHaveLength(2) // D1 and D2 format combinations

      const formats = result.map((r) => r.format)
      expect(formats).toContain('Ms D2, Y')
      expect(formats).toContain('Ms D1, Y')

      // All should have same timestamp
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 11, 25))
    })

    test('should parse short month name with lowercase', () => {
      const result = parseDateString('dec 25, 2023')
      expect(result).toHaveLength(2) // D1 and D2 format combinations

      const formats = result.map((r) => r.format)
      expect(formats).toContain('Msl D2, Y')
      expect(formats).toContain('Msl D1, Y')

      // All should have same timestamp
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 11, 25))
    })

    test('should parse short month name with uppercase', () => {
      const result = parseDateString('DEC 25, 2023')
      expect(result).toHaveLength(2) // D1 and D2 format combinations

      const formats = result.map((r) => r.format)
      expect(formats).toContain('Msu D2, Y')
      expect(formats).toContain('Msu D1, Y')

      // All should have same timestamp
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 11, 25))
    })

    test('should parse Y-Month format', () => {
      const result = parseDateString('2023-December')
      expect(result).toHaveLength(1)
      expect(result[0].format).toBe('Y-Mf')
      expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 1))
    })

    test('should parse Month-Y format', () => {
      const result = parseDateString('January-2023')
      expect(result).toHaveLength(1)
      expect(result[0].format).toBe('Mf-Y')
      expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 0, 1))
    })
  })

  describe('Leap year handling', () => {
    test('should handle leap year February 29th correctly', () => {
      const result = parseDateString('2024-02-29')
      expect(result.length).toBeGreaterThan(0)

      // Check that at least one interpretation accepts Feb 29, 2024
      const feb29Interp = result.find(
        (interp) => interp.timestamp === new Date(2024, 1, 29).getTime()
      )
      expect(feb29Interp).toBeDefined()
    })

    test('should reject invalid dates', () => {
      // February 29th in non-leap year should fail
      expect(() => parseDateString('2023-02-29')).toThrow(
        'Unable to parse date string'
      )
      expect(() => parseDateString('2023-13-15')).toThrow(
        'Unable to parse date string'
      )
      expect(() => parseDateString('2023-12-32')).toThrow(
        'Unable to parse date string'
      )
    })

    test('should reject invalid month names', () => {
      expect(() => parseDateString('Decembor 25, 2023')).toThrow(
        'Unable to parse date string'
      )
      expect(() => parseDateString('13th 25, 2023')).toThrow(
        'Unable to parse date string'
      )
    })
  })

  describe('Input normalization', () => {
    test('should handle whitespace trimming', () => {
      const result = parseDateString('  2023-12-25  ')
      expect(result).toHaveLength(4) // All M1/M2 × D1/D2 combinations

      const formats = result.map((r) => r.format)
      expect(formats).toContain('Y-M2-D2')
      expect(formats).toContain('Y-M2-D1')
      expect(formats).toContain('Y-M1-D2')
      expect(formats).toContain('Y-M1-D1')

      // All should have same timestamp
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 11, 25))
    })

    test('should reject completely invalid input', () => {
      expect(() => parseDateString('invalid-date')).toThrow(
        'Unable to parse date string'
      )
      expect(() => parseDateString('2023')).toThrow(
        'Unable to parse date string'
      )
      expect(() => parseDateString('2023-12-25-extra')).toThrow(
        'Unable to parse date string'
      )
    })
  })
})

describe('formatDateString function', () => {
  describe('Basic date formatting', () => {
    test('should format Y-M1-D1 pattern correctly', () => {
      const timestamp = new Date(2023, 11, 25).getTime()
      expect(formatDateString(timestamp, 'Y-M1-D1')).toBe('2023-12-25')
    })

    test('should format Y-M2-D2 pattern with zero-padding', () => {
      const timestamp = new Date(2023, 0, 5).getTime()
      expect(formatDateString(timestamp, 'Y-M2-D2')).toBe('2023-01-05')
    })

    test('should format D1.M1.Y pattern correctly', () => {
      const timestamp = new Date(2023, 11, 25).getTime()
      expect(formatDateString(timestamp, 'D1.M1.Y')).toBe('25.12.2023')
    })

    test('should format D2/M2/Y pattern with zero-padding', () => {
      const timestamp = new Date(2023, 0, 5).getTime()
      expect(formatDateString(timestamp, 'D2/M2/Y')).toBe('05/01/2023')
    })

    test('should format M1-D1-Y pattern correctly', () => {
      const timestamp = new Date(2023, 11, 25).getTime()
      expect(formatDateString(timestamp, 'M1-D1-Y')).toBe('12-25-2023')
    })
  })

  describe('Month name formatting', () => {
    test('should format full month names correctly', () => {
      const timestamp = new Date(2023, 11, 25).getTime()
      expect(formatDateString(timestamp, 'Mf D1, Y')).toBe('December 25, 2023')
      expect(formatDateString(timestamp, 'Mfl D1, Y')).toBe('december 25, 2023')
      expect(formatDateString(timestamp, 'Mfu D1, Y')).toBe('DECEMBER 25, 2023')
    })

    test('should format short month names correctly', () => {
      const timestamp = new Date(2023, 11, 25).getTime()
      expect(formatDateString(timestamp, 'Ms D1, Y')).toBe('Dec 25, 2023')
      expect(formatDateString(timestamp, 'Msl D1, Y')).toBe('dec 25, 2023')
      expect(formatDateString(timestamp, 'Msu D1, Y')).toBe('DEC 25, 2023')
    })

    test('should format year-month patterns', () => {
      const timestamp = new Date(2023, 0, 1).getTime()
      expect(formatDateString(timestamp, 'Y-Mf')).toBe('2023-January')
      expect(formatDateString(timestamp, 'Ms-Y')).toBe('Jan-2023')
    })
  })

  describe('Partial date formatting', () => {
    test('should format year-month only patterns', () => {
      const timestamp = new Date(2023, 11, 1).getTime()
      expect(formatDateString(timestamp, 'Y-M1')).toBe('2023-12')
      expect(formatDateString(timestamp, 'Y.M2')).toBe('2023.12')
    })

    test('should format month-year only patterns', () => {
      const timestamp = new Date(2023, 11, 1).getTime()
      expect(formatDateString(timestamp, 'M1-Y')).toBe('12-2023')
      expect(formatDateString(timestamp, 'M2/Y')).toBe('12/2023')
    })

    test('should format month-day only patterns', () => {
      const timestamp = new Date(1970, 11, 25).getTime()
      expect(formatDateString(timestamp, 'M1-D1')).toBe('12-25')
      expect(formatDateString(timestamp, 'M2.D2')).toBe('12.25')
    })

    test('should format day-month only patterns', () => {
      const timestamp = new Date(1970, 11, 25).getTime()
      expect(formatDateString(timestamp, 'D1-M1')).toBe('25-12')
      expect(formatDateString(timestamp, 'D2/M2')).toBe('25/12')
    })
  })

  describe('Error handling for formatDateString', () => {
    test('should throw error for invalid format strings', () => {
      const timestamp = new Date(2023, 11, 25).getTime()
      expect(() => formatDateString(timestamp, 'invalid-format')).toThrow(
        'Invalid format'
      )
      expect(() => formatDateString(timestamp, 'Y-X-D1')).toThrow(
        'Invalid format component'
      )
      expect(() => formatDateString(timestamp, 'Y-M1-D3')).toThrow(
        'Invalid day format'
      )
    })
  })
})

describe('Round-trip consistency', () => {
  describe('Simple round-trip tests', () => {
    test('should round-trip unambiguous dates correctly', () => {
      // Test cases that should have only one positional interpretation
      const testCases = [
        {
          input: '2023-01-31',
          expectedTimestamp: new Date(2023, 0, 31).getTime(),
        }, // Y-M-D only
        {
          input: '31.01.2023',
          expectedTimestamp: new Date(2023, 0, 31).getTime(),
        }, // D-M-Y only (31 can't be month)
        {
          input: '01/31/2023',
          expectedTimestamp: new Date(2023, 0, 31).getTime(),
        }, // M-D-Y only (31 can't be month)
        {
          input: 'December 05, 2023',
          expectedTimestamp: new Date(2023, 11, 5).getTime(),
        }, // Named month, unambiguous
      ]

      testCases.forEach(({ input, expectedTimestamp }) => {
        const parsed = parseDateString(input)

        // All interpretations should have the same timestamp (same date)
        const timestamps = parsed.map((r) => r.timestamp)
        expect(timestamps.every((t) => t === expectedTimestamp)).toBe(true)

        // Each interpretation should round-trip correctly
        parsed.forEach((interpretation) => {
          const formatted = formatDateString(
            interpretation.timestamp,
            interpretation.format
          )
          const reparsed = parseDateString(formatted)

          // The reparsed result should contain the original interpretation
          const matchingInterp = reparsed.find(
            (i) =>
              i.format === interpretation.format &&
              i.timestamp === interpretation.timestamp
          )
          expect(matchingInterp).toBeDefined()
        })
      })
    })

    test('should round-trip year-month only dates correctly', () => {
      const testCases = [
        {
          input: '2023-01',
          expectedTimestamp: new Date(2023, 0, 1).getTime(),
          expectedMonths: 636,
        },
        {
          input: '01-31',
          expectedTimestamp: new Date(1970, 0, 31).getTime(),
        }, // M-D format, no months property
      ]

      testCases.forEach(({ input, expectedTimestamp, expectedMonths }) => {
        const parsed = parseDateString(input)

        // All interpretations should have the same timestamp
        const timestamps = parsed.map((r) => r.timestamp)
        expect(timestamps.every((t) => t === expectedTimestamp)).toBe(true)

        // Check months property if expected
        if (expectedMonths !== undefined) {
          parsed.forEach((interp) => {
            expect(interp.months).toBe(expectedMonths)
          })
        }

        // Each interpretation should round-trip correctly
        parsed.forEach((interpretation) => {
          const formatted = formatDateString(
            interpretation.timestamp,
            interpretation.format
          )
          const reparsed = parseDateString(formatted)

          const matchingInterp = reparsed.find(
            (i) =>
              i.format === interpretation.format &&
              i.timestamp === interpretation.timestamp
          )
          expect(matchingInterp).toBeDefined()
        })
      })
    })
  })

  describe('Complex round-trip tests', () => {
    test('should handle ambiguous inputs with multiple interpretations', () => {
      const input = '01/05/2023'
      const parsed = parseDateString(input)
      expect(parsed.length).toBe(8) // 2 positional × 4 format combinations

      // Check that we have exactly two different timestamps (dates)
      const timestamps = parsed.map((r) => r.timestamp)
      const uniqueTimestamps = timestamps.filter(
        (ts, index) => timestamps.indexOf(ts) === index
      )
      expect(uniqueTimestamps).toHaveLength(2) // Two different dates

      expect(uniqueTimestamps).toContain(new Date(2023, 0, 5).getTime()) // Jan 5th (M-D interpretation)
      expect(uniqueTimestamps).toContain(new Date(2023, 4, 1).getTime()) // May 1st (D-M interpretation)

      // Each interpretation should round-trip correctly
      parsed.forEach((interpretation) => {
        const formatted = formatDateString(
          interpretation.timestamp,
          interpretation.format
        )
        const reparsed = parseDateString(formatted)
        const matchingInterp = reparsed.find(
          (i) =>
            i.format === interpretation.format &&
            i.timestamp === interpretation.timestamp
        )
        expect(matchingInterp).toBeDefined()
      })
    })
  })

  describe('Edge cases and boundaries', () => {
    test('should handle epoch date correctly', () => {
      const result = parseDateString('1970-01-01')
      expect(result.length).toBeGreaterThan(0)

      // 1970-01-01 is day 0 (the `days` count is a timezone-independent UTC
      // calendar count; the raw timestamp is a local midnight and is only 0 in
      // UTC, so assert via `days` to stay timezone-robust)
      const epochInterp = result.find((i) => i.days === 0)
      expect(epochInterp).toBeDefined()

      if (epochInterp) {
        const formatted = formatDateString(
          epochInterp.timestamp,
          epochInterp.format
        )
        expect(formatted).toBe('1970-01-01')
      }
    })

    test('should handle future dates correctly', () => {
      const input = '2050-06-15'
      const result = parseDateString(input)
      expect(result.length).toBeGreaterThan(0)

      const hasExpectedYear = result.some(
        (i) => new Date(i.timestamp).getFullYear() === 2050
      )
      expect(hasExpectedYear).toBe(true)
    })

    test('should handle different months correctly', () => {
      const dateStr = 'February-2023'
      const result = parseDateString(dateStr)
      expect(result.length).toBeGreaterThan(0)

      const hasExpectedMonth = result.some(
        (i) => new Date(i.timestamp).getMonth() === 1 // February is month 1 (0-indexed)
      )
      expect(hasExpectedMonth).toBe(true)
    })

    test('should handle Y-M-D format with multiple format combinations', () => {
      const result = parseDateString('2023-01-05')
      expect(result).toHaveLength(4) // All M1/M2 × D1/D2 combinations, no positional ambiguity

      // All should have same timestamp (January 5th, 2023) - no Y-D-M ambiguity when year is first
      const timestamps = result.map((r) => r.timestamp)
      expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
      expect(new Date(timestamps[0])).toEqual(new Date(2023, 0, 5))

      // Should have all format combinations
      const formats = result.map((i) => i.format)
      expect(formats).toContain('Y-M2-D2')
      expect(formats).toContain('Y-M2-D1')
      expect(formats).toContain('Y-M1-D2')
      expect(formats).toContain('Y-M1-D1')

      // Each interpretation should round-trip correctly
      result.forEach((interpretation) => {
        const formatted = formatDateString(
          interpretation.timestamp,
          interpretation.format
        )
        const reparsed = parseDateString(formatted)
        const matchingInterp = reparsed.find(
          (i) =>
            i.format === interpretation.format &&
            i.timestamp === interpretation.timestamp
        )
        expect(matchingInterp).toBeDefined()
      })
    })
  })
})

describe('Months property for year-month only dates', () => {
  test('should add months property for Y-M format', () => {
    const result = parseDateString('2023-12')
    expect(result).toHaveLength(2) // Both M1 and M2 formats

    // All should have same timestamp and months property
    const timestamps = result.map((r) => r.timestamp)
    expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
    expect(new Date(timestamps[0])).toEqual(new Date(2023, 11, 1))

    result.forEach((interp) => {
      expect(interp.months).toBe(647) // (2023-1970)*12 + (12-1) = 53*12 + 11 = 636 + 11 = 647
    })
  })

  test('should add months property for M-Y format', () => {
    const result = parseDateString('01-2023')
    expect(result).toHaveLength(2) // Both M1 and M2 formats (01 matches both)

    // All should have same timestamp and months property
    const timestamps = result.map((r) => r.timestamp)
    expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
    expect(new Date(timestamps[0])).toEqual(new Date(2023, 0, 1))

    result.forEach((interp) => {
      expect(interp.months).toBe(636) // (2023-1970)*12 + (1-1) = 53*12 + 0 = 636
    })
  })

  test('should add months property for named month formats', () => {
    const result = parseDateString('January 2024')
    expect(result).toHaveLength(1)
    expect(result[0].format).toBe('Mf Y')
    expect(result[0].months).toBe(648) // (2024-1970)*12 + (1-1) = 54*12 + 0 = 648
    expect(new Date(result[0].timestamp)).toEqual(new Date(2024, 0, 1))
  })

  test('should add months property for Y-NamedMonth format', () => {
    const result = parseDateString('2024-February')
    expect(result).toHaveLength(1)
    expect(result[0].format).toBe('Y-Mf')
    expect(result[0].months).toBe(649) // (2024-1970)*12 + (2-1) = 54*12 + 1 = 649
    expect(new Date(result[0].timestamp)).toEqual(new Date(2024, 1, 1))
  })

  test('should NOT add months property for dates with day component', () => {
    const result = parseDateString('2023-12-25')
    expect(result).toHaveLength(4) // All M1/M2 × D1/D2 combinations

    // All should have same timestamp and no months property
    const timestamps = result.map((r) => r.timestamp)
    expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
    expect(new Date(timestamps[0])).toEqual(new Date(2023, 11, 25))

    result.forEach((interp) => {
      expect(interp.months).toBeUndefined()
    })
  })

  test('should NOT add months property for M-D format (no year)', () => {
    const result = parseDateString('12-25')
    expect(result).toHaveLength(4) // All M1/M2 × D1/D2 combinations

    // All should have same timestamp and no months property
    const timestamps = result.map((r) => r.timestamp)
    expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
    expect(new Date(timestamps[0])).toEqual(new Date(1970, 11, 25))

    result.forEach((interp) => {
      expect(interp.months).toBeUndefined()
    })
  })

  test('should handle edge case: 1970-01 (months = 0)', () => {
    const result = parseDateString('1970-01')
    expect(result).toHaveLength(2) // Both M1 and M2 formats (01 matches both)

    // All should have same timestamp and months property
    const timestamps = result.map((r) => r.timestamp)
    expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
    expect(new Date(timestamps[0])).toEqual(new Date(1970, 0, 1))

    result.forEach((interp) => {
      expect(interp.months).toBe(0) // (1970-1970)*12 + (1-1) = 0
    })
  })

  test('should handle edge case: 1970-02 (months = 1)', () => {
    const result = parseDateString('1970-02')
    expect(result).toHaveLength(2) // Both M1 and M2 formats (02 matches both)

    // All should have same timestamp and months property
    const timestamps = result.map((r) => r.timestamp)
    expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
    expect(new Date(timestamps[0])).toEqual(new Date(1970, 1, 1))

    result.forEach((interp) => {
      expect(interp.months).toBe(1) // (1970-1970)*12 + (2-1) = 1
    })
  })

  test('should handle various month name formats with months property', () => {
    const testCases = [
      { input: 'Dec 2023', expectedMonths: 647, expectedFormat: 'Ms Y' },
      { input: 'dec 2023', expectedMonths: 647, expectedFormat: 'Msl Y' },
      { input: 'DEC 2023', expectedMonths: 647, expectedFormat: 'Msu Y' },
      { input: 'December 2023', expectedMonths: 647, expectedFormat: 'Mf Y' },
      {
        input: 'december 2023',
        expectedMonths: 647,
        expectedFormat: 'Mfl Y',
      },
      {
        input: 'DECEMBER 2023',
        expectedMonths: 647,
        expectedFormat: 'Mfu Y',
      },
    ]

    testCases.forEach(({ input, expectedMonths, expectedFormat }) => {
      const result = parseDateString(input)
      expect(result).toHaveLength(1)
      expect(result[0].format).toBe(expectedFormat)
      expect(result[0].months).toBe(expectedMonths)
      expect(new Date(result[0].timestamp)).toEqual(new Date(2023, 11, 1))
    })
  })
})

describe('formatMonthString function', () => {
  describe('Basic month string formatting', () => {
    test('should format months 0 (1970-01) correctly', () => {
      expect(formatMonthString(0, 'Y-M1')).toBe('1970-1')
      expect(formatMonthString(0, 'Y-M2')).toBe('1970-01')
      expect(formatMonthString(0, 'Y.M1')).toBe('1970.1')
      expect(formatMonthString(0, 'Y/M2')).toBe('1970/01')
    })

    test('should format months 1 (1970-02) correctly', () => {
      expect(formatMonthString(1, 'Y-M1')).toBe('1970-2')
      expect(formatMonthString(1, 'Y-M2')).toBe('1970-02')
      expect(formatMonthString(1, 'M1-Y')).toBe('2-1970')
      expect(formatMonthString(1, 'M2/Y')).toBe('02/1970')
    })

    test('should format months 12 (1971-01) correctly', () => {
      expect(formatMonthString(12, 'Y-M1')).toBe('1971-1')
      expect(formatMonthString(12, 'Y-M2')).toBe('1971-01')
      expect(formatMonthString(12, 'M1-Y')).toBe('1-1971')
      expect(formatMonthString(12, 'M2.Y')).toBe('01.1971')
    })

    test('should format large month numbers correctly', () => {
      // 636 months = 2023-01
      expect(formatMonthString(636, 'Y-M1')).toBe('2023-1')
      expect(formatMonthString(636, 'Y-M2')).toBe('2023-01')

      // 647 months = 2023-12
      expect(formatMonthString(647, 'Y-M1')).toBe('2023-12')
      expect(formatMonthString(647, 'Y-M2')).toBe('2023-12')

      // 648 months = 2024-01
      expect(formatMonthString(648, 'Y-M1')).toBe('2024-1')
      expect(formatMonthString(648, 'M2-Y')).toBe('01-2024')
    })
  })

  describe('Named month formatting', () => {
    test('should format named months correctly', () => {
      // 0 months = 1970-01 = January 1970
      expect(formatMonthString(0, 'Mf Y')).toBe('January 1970')
      expect(formatMonthString(0, 'Mfl Y')).toBe('january 1970')
      expect(formatMonthString(0, 'Mfu Y')).toBe('JANUARY 1970')
      expect(formatMonthString(0, 'Ms Y')).toBe('Jan 1970')
      expect(formatMonthString(0, 'Msl Y')).toBe('jan 1970')
      expect(formatMonthString(0, 'Msu Y')).toBe('JAN 1970')
    })

    test('should format named months with Y-M order', () => {
      // 11 months = 1970-12 = December 1970
      expect(formatMonthString(11, 'Y Mf')).toBe('1970 December')
      expect(formatMonthString(11, 'Y-Ms')).toBe('1970-Dec')
      expect(formatMonthString(11, 'Y.Msl')).toBe('1970.dec')
    })

    test('should handle all 12 months correctly', () => {
      const monthNames = [
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
      ]

      const shortNames = [
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
      ]

      for (let i = 0; i < 12; i++) {
        expect(formatMonthString(i, 'Mf Y')).toBe(`${monthNames[i]} 1970`)
        expect(formatMonthString(i, 'Ms Y')).toBe(`${shortNames[i]} 1970`)
      }
    })
  })

  describe('Error handling for formatMonthString', () => {
    test('should throw error for formats containing day components', () => {
      expect(() => formatMonthString(0, 'Y-M1-D1')).toThrow(
        'Invalid format for month string: day component "D1" not allowed'
      )
      expect(() => formatMonthString(0, 'D2.M2.Y')).toThrow(
        'Invalid format for month string: day component "D2" not allowed'
      )
      expect(() => formatMonthString(0, 'M1 D1, Y')).toThrow(
        'Invalid format for month string: day component "D1" not allowed'
      )
    })

    test('should throw error for invalid format components', () => {
      expect(() => formatMonthString(0, 'Y-X-M1')).toThrow(
        'Invalid format component: "X"'
      )
      expect(() => formatMonthString(0, 'invalid format')).toThrow(
        'Invalid format component'
      )
    })

    test('should throw error for formats without separators', () => {
      expect(() => formatMonthString(0, 'YM1')).toThrow(
        'Invalid format: no recognized separator found'
      )
    })
  })

  describe('Round-trip consistency with months', () => {
    test('should round-trip with parseDateString for year-month formats', () => {
      const testCases = [
        { months: 0, format: 'Y-M1', expectedString: '1970-1' },
        { months: 1, format: 'Y-M2', expectedString: '1970-02' },
        { months: 12, format: 'M1-Y', expectedString: '1-1971' },
        { months: 636, format: 'Y-M1', expectedString: '2023-1' },
        { months: 647, format: 'Y-M1', expectedString: '2023-12' },
        { months: 0, format: 'Mf Y', expectedString: 'January 1970' },
        { months: 11, format: 'Ms Y', expectedString: 'Dec 1970' },
      ]

      testCases.forEach(({ months, format, expectedString }) => {
        // Format months to string
        const formatted = formatMonthString(months, format)
        expect(formatted).toBe(expectedString)

        // Parse the formatted string back
        const parsed = parseDateString(formatted)
        expect(parsed.length).toBeGreaterThan(0)

        // Find the matching interpretation
        const matchingInterp = parsed.find(
          (i) => i.format === format && i.months === months
        )
        expect(matchingInterp).toBeDefined()
      })
    })

    test('should handle edge cases in round-trip', () => {
      // Test various edge cases
      const edgeCases = [
        { months: 0, format: 'Y-M2' }, // 1970-01
        { months: 11, format: 'Y-M1' }, // 1970-12
        { months: 12, format: 'Y-M1' }, // 1971-01
        { months: 8, format: 'M2-Y' }, // 1970-09 (will format as "09-1970" and round-trip as M2-Y)
        { months: 600, format: 'Mf Y' }, // 2020-01
      ]

      edgeCases.forEach(({ months, format }) => {
        const formatted = formatMonthString(months, format)
        const parsed = parseDateString(formatted)
        expect(parsed.length).toBeGreaterThan(0)

        // Find the matching interpretation
        const matchingInterp = parsed.find(
          (i) => i.format === format && i.months === months
        )
        expect(matchingInterp).toBeDefined()
      })
    })
  })
})

describe('Specific format combination tests', () => {
  test('should return exact format combinations for 2023-12-25', () => {
    const result = parseDateString('2023-12-25')
    expect(result).toHaveLength(4)

    // Check exact format combinations in expected order
    const expectedFormats = ['Y-M2-D2', 'Y-M2-D1', 'Y-M1-D2', 'Y-M1-D1']
    const actualFormats = result.map((r) => r.format)

    expectedFormats.forEach((format) => {
      expect(actualFormats).toContain(format)
    })

    // All should have same timestamp (December 25, 2023)
    const timestamps = result.map((r) => r.timestamp)
    expect(timestamps.every((t) => t === timestamps[0])).toBe(true)
    expect(new Date(timestamps[0])).toEqual(new Date(2023, 11, 25))
  })

  test('should return exact format combinations for 12.11.2023', () => {
    const result = parseDateString('12.11.2023')
    expect(result).toHaveLength(8)

    // Group by timestamp to verify the two interpretations
    const timestamps = result.map((r) => r.timestamp)
    const uniqueTimestamps = timestamps.filter(
      (ts, index) => timestamps.indexOf(ts) === index
    )
    expect(uniqueTimestamps).toHaveLength(2)

    // Check December 11, 2023 interpretation (M.D format - 12 = month, 11 = day)
    const dec11Timestamp = new Date(2023, 11, 11).getTime()
    const dec11Results = result.filter((r) => r.timestamp === dec11Timestamp)
    expect(dec11Results).toHaveLength(4)

    const dec11Formats = dec11Results.map((r) => r.format)
    expect(dec11Formats).toContain('M2.D2.Y')
    expect(dec11Formats).toContain('M2.D1.Y')
    expect(dec11Formats).toContain('M1.D2.Y')
    expect(dec11Formats).toContain('M1.D1.Y')

    // Check November 12, 2023 interpretation (D.M format - 12 = day, 11 = month)
    const nov12Timestamp = new Date(2023, 10, 12).getTime()
    const nov12Results = result.filter((r) => r.timestamp === nov12Timestamp)
    expect(nov12Results).toHaveLength(4)

    const nov12Formats = nov12Results.map((r) => r.format)
    expect(nov12Formats).toContain('D2.M2.Y')
    expect(nov12Formats).toContain('D2.M1.Y')
    expect(nov12Formats).toContain('D1.M2.Y')
    expect(nov12Formats).toContain('D1.M1.Y')
  })
})

describe('Result ordering', () => {
  test('should return formats in correct priority order', () => {
    // Test an ambiguous date that can be interpreted multiple ways
    const result = parseDateString('01.05.2023')

    // Should have interpretations for both M.D.Y and D.M.Y arrangements
    expect(result.length).toBeGreaterThan(0)

    // Group by pattern type to check ordering
    const formats = result.map((r) => r.format)

    // Y-M-D patterns should not be present for this input (year is last)
    expect(formats.some((f) => f.startsWith('Y'))).toBe(false)

    // D-M-Y should come before M-D-Y
    const firstDMYIndex = formats.findIndex((f) => f.startsWith('D'))
    const firstMDYIndex = formats.findIndex((f) => f.startsWith('M'))

    if (firstDMYIndex !== -1 && firstMDYIndex !== -1) {
      expect(firstDMYIndex).toBeLessThan(firstMDYIndex)
    }
  })

  test('should return Y-M-D variations first', () => {
    const result = parseDateString('2023-01-05')

    // All results should be Y-M-D format (year first means no ambiguity)
    const formats = result.map((r) => r.format)
    expect(formats.every((f) => f.startsWith('Y-'))).toBe(true)

    // Should be ordered by specificity (M2-D2 before M1-D1)
    const expectedOrder = ['Y-M2-D2', 'Y-M2-D1', 'Y-M1-D2', 'Y-M1-D1']
    expectedOrder.forEach((expectedFormat) => {
      expect(formats).toContain(expectedFormat)
    })

    // Check that M2-D2 comes before M1-D1
    const m2d2Index = formats.indexOf('Y-M2-D2')
    const m1d1Index = formats.indexOf('Y-M1-D1')
    expect(m2d2Index).toBeLessThan(m1d1Index)
  })

  test('should order separators correctly within same pattern', () => {
    // Test with different separators for same date
    const dashResult = parseDateString('2023-12-25')
    const dotResult = parseDateString('2023.12.25')
    const slashResult = parseDateString('2023/12/25')

    // All should have same timestamp but different formats
    expect(dashResult[0].timestamp).toBe(dotResult[0].timestamp)
    expect(dotResult[0].timestamp).toBe(slashResult[0].timestamp)

    // Dash should come first in format string (priority 0)
    expect(dashResult[0].format).toMatch(/^Y-/)
    expect(dotResult[0].format).toMatch(/^Y\./)
    expect(slashResult[0].format).toMatch(/^Y\//)
  })

  test('should sort Y-M formats before M-Y formats', () => {
    const testCases = [
      { input: '2023-01', expectedFirst: 'Y-' },
      { input: '01-2023', expectedFirst: 'M' },
    ]

    testCases.forEach(({ input, expectedFirst }) => {
      const result = parseDateString(input)
      expect(result[0].format.startsWith(expectedFirst)).toBe(true)
    })
  })
})
