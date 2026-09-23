import { describe, expect, test } from 'bun:test'
import { numeralLength, toBasicRange } from '../../src/utils/circular'
import { convertTo } from '../../src/utils/converters'
import { modNoZero } from '../../src/utils/modNoZero'
import type { NumType } from '../../src/utils/types'

describe('modNoZero function', () => {
  describe('Basic modular arithmetic', () => {
    test('should work like normal modulo for positive numbers within range', () => {
      expect(modNoZero(5, 10)).toBe(5)
      expect(modNoZero(7, 12)).toBe(7)
      expect(modNoZero(1, 26)).toBe(1)
      expect(modNoZero(25, 26)).toBe(25)
    })

    test('should wrap around for positive numbers larger than modulus', () => {
      expect(modNoZero(13, 12)).toBe(1) // 13 % 12 = 1
      expect(modNoZero(27, 26)).toBe(1) // 27 % 26 = 1
      expect(modNoZero(25, 12)).toBe(1) // 25 % 12 = 1
      expect(modNoZero(52, 26)).toBe(26) // 52 % 26 = 0, but returns 26
    })

    test('should handle zero by returning the modulus', () => {
      expect(modNoZero(0, 12)).toBe(12)
      expect(modNoZero(0, 26)).toBe(26)
      expect(modNoZero(0, 10)).toBe(10)
      expect(modNoZero(0, 1)).toBe(1)
    })

    test('should handle negative numbers correctly', () => {
      expect(modNoZero(-1, 12)).toBe(11) // -1 wraps to second-to-last
      expect(modNoZero(-2, 12)).toBe(10) // -2 wraps to third-to-last
      expect(modNoZero(-12, 12)).toBe(12) // -12 wraps to last
      expect(modNoZero(-13, 12)).toBe(11) // -13 wraps to second-to-last
      expect(modNoZero(-1, 26)).toBe(25)
      expect(modNoZero(-26, 26)).toBe(26)
    })

    test('should handle large negative numbers', () => {
      expect(modNoZero(-25, 12)).toBe(11) // -25 % 12 = -1, adjusted to 11
      expect(modNoZero(-52, 26)).toBe(26) // -52 % 26 = 0, returns 26
      expect(modNoZero(-53, 26)).toBe(25) // -53 % 26 = -1, adjusted to 25
    })
  })

  describe('Edge cases', () => {
    test('should handle modulus of 1', () => {
      expect(modNoZero(0, 1)).toBe(1)
      expect(modNoZero(5, 1)).toBe(1)
      expect(modNoZero(-3, 1)).toBe(1)
    })

    test('should handle exact multiples', () => {
      expect(modNoZero(24, 12)).toBe(12) // 24 % 12 = 0, returns 12
      expect(modNoZero(36, 12)).toBe(12) // 36 % 12 = 0, returns 12
      expect(modNoZero(78, 26)).toBe(26) // 78 % 26 = 0, returns 26
    })

    test('should work with decimal results that become integers', () => {
      expect(modNoZero(15, 7)).toBe(1) // 15 % 7 = 1
      expect(modNoZero(22, 7)).toBe(1) // 22 % 7 = 1
      expect(modNoZero(21, 7)).toBe(7) // 21 % 7 = 0, returns 7
    })
  })

  describe('Mathematical properties', () => {
    test('should maintain the property that result is always between 1 and modulus (inclusive)', () => {
      const testCases = [
        { n: -100, m: 12 },
        { n: -1, m: 12 },
        { n: 0, m: 12 },
        { n: 1, m: 12 },
        { n: 12, m: 12 },
        { n: 13, m: 12 },
        { n: 100, m: 12 },
      ]

      testCases.forEach(({ n, m }) => {
        const result = modNoZero(n, m)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(m)
      })
    })

    test('should be consistent for equivalent inputs', () => {
      // n and n + m should give same result
      expect(modNoZero(5, 12)).toBe(modNoZero(5 + 12, 12))
      expect(modNoZero(5, 12)).toBe(modNoZero(5 + 24, 12))
      expect(modNoZero(-1, 12)).toBe(modNoZero(-1 + 12, 12))
      expect(modNoZero(-1, 12)).toBe(modNoZero(-1 + 24, 12))
    })
  })
})

describe('toBasicRange function', () => {
  describe('Basic functionality', () => {
    test('should handle numbers within valid range', () => {
      expect(toBasicRange(1, 'latin_letter')).toBe(1)
      expect(toBasicRange(26, 'latin_letter')).toBe(26)
      expect(toBasicRange(5, 'astrological_sign')).toBe(5)
      expect(toBasicRange(12, 'astrological_sign')).toBe(12)
      expect(toBasicRange(1, 'chinese_heavenly_stem')).toBe(1)
      expect(toBasicRange(10, 'chinese_heavenly_stem')).toBe(10)
    })

    test('should wrap numbers greater than range', () => {
      expect(toBasicRange(27, 'latin_letter')).toBe(1) // 27 % 26 = 1
      expect(toBasicRange(52, 'latin_letter')).toBe(26) // 52 % 26 = 0 -> 26
      expect(toBasicRange(53, 'latin_letter')).toBe(1) // 53 % 26 = 1

      expect(toBasicRange(13, 'astrological_sign')).toBe(1) // 13 % 12 = 1
      expect(toBasicRange(25, 'astrological_sign')).toBe(1) // 25 % 12 = 1
      expect(toBasicRange(24, 'astrological_sign')).toBe(12) // 24 % 12 = 0 -> 12

      expect(toBasicRange(11, 'chinese_heavenly_stem')).toBe(1) // 11 % 10 = 1
      expect(toBasicRange(20, 'chinese_heavenly_stem')).toBe(10) // 20 % 10 = 0 -> 10
    })

    test('should handle zero by wrapping to end', () => {
      expect(toBasicRange(0, 'latin_letter')).toBe(26)
      expect(toBasicRange(0, 'astrological_sign')).toBe(12)
      expect(toBasicRange(0, 'chinese_heavenly_stem')).toBe(10)
      expect(toBasicRange(0, 'greek_letter')).toBe(24)
      expect(toBasicRange(0, 'day_of_week')).toBe(7)
    })

    test('should handle negative numbers by wrapping backwards', () => {
      expect(toBasicRange(-1, 'latin_letter')).toBe(25) // wraps to second-to-last
      expect(toBasicRange(-2, 'latin_letter')).toBe(24) // wraps to third-to-last
      expect(toBasicRange(-26, 'latin_letter')).toBe(26) // wraps to last
      expect(toBasicRange(-27, 'latin_letter')).toBe(25) // wraps to second-to-last

      expect(toBasicRange(-1, 'astrological_sign')).toBe(11)
      expect(toBasicRange(-12, 'astrological_sign')).toBe(12)
      expect(toBasicRange(-13, 'astrological_sign')).toBe(11)
    })
  })

  describe('All numeral types', () => {
    test('should work with all defined numeral types', () => {
      const typesToTest = Object.keys(numeralLength) as NumType[]

      typesToTest.forEach((numType) => {
        const length = numeralLength[numType]
        if (!length) {
          throw new Error()
        }
        // Test basic range
        expect(toBasicRange(1, numType)).toBe(1)
        expect(toBasicRange(length, numType)).toBe(length)

        // Test circular (length + 1 should wrap to 1)
        expect(toBasicRange(length + 1, numType)).toBe(1)

        // Test zero wraps to end
        expect(toBasicRange(0, numType)).toBe(length)

        // Test negative wraps backwards
        expect(toBasicRange(-1, numType)).toBe(length - 1)
      })
    })
  })

  describe('Error handling', () => {
    test('should throw error for non-integer input', () => {
      expect(() => toBasicRange(1.5, 'latin_letter')).toThrow(
        'Input must be an integer'
      )
      expect(() => toBasicRange(2.7, 'astrological_sign')).toThrow(
        'Input must be an integer'
      )
      expect(() => toBasicRange(Number.NaN, 'latin_letter')).toThrow(
        'Input must be an integer'
      )
      expect(() =>
        toBasicRange(Number.POSITIVE_INFINITY, 'latin_letter')
      ).toThrow('Input must be an integer')
      expect(() =>
        toBasicRange(Number.NEGATIVE_INFINITY, 'latin_letter')
      ).toThrow('Input must be an integer')
    })

    test('should throw error for types without defined length', () => {
      expect(() => toBasicRange(1, 'decimal')).toThrow(
        'does not have a defined length'
      )
      expect(() => toBasicRange(1, 'binary')).toThrow(
        'does not have a defined length'
      )
      expect(() => toBasicRange(1, 'hexadecimal')).toThrow(
        'does not have a defined length'
      )
      expect(() => toBasicRange(1, 'invalid')).toThrow(
        'does not have a defined length'
      )
      expect(() => toBasicRange(1, 'empty')).toThrow(
        'does not have a defined length'
      )
      expect(() => toBasicRange(1, 'unknown')).toThrow(
        'does not have a defined length'
      )
    })
  })

  describe('Practical examples and edge cases', () => {
    test('should handle large numbers correctly', () => {
      expect(toBasicRange(1000, 'latin_letter')).toBe(12) // 1000 % 26 = 12
      expect(toBasicRange(9999, 'astrological_sign')).toBe(3) // 9999 % 12 = 3
    })

    test('should handle large negative numbers correctly', () => {
      expect(toBasicRange(-1000, 'latin_letter')).toBe(14) // (-1000 % 26 + 26) % 26 = 14
      expect(toBasicRange(-9999, 'astrological_sign')).toBe(9) // (-9999 % 12 + 12) % 12 = 9
    })

    test('should be consistent with modNoZero behavior', () => {
      const testNumbers = [-50, -1, 0, 1, 13, 27, 100]
      const testTypes = [
        'latin_letter',
        'astrological_sign',
        'chinese_heavenly_stem',
      ] as const

      testTypes.forEach((type) => {
        const length = numeralLength[type]
        if (!length) {
          throw new Error()
        }
        testNumbers.forEach((num) => {
          expect(toBasicRange(num, type)).toBe(modNoZero(num, length))
        })
      })
    })

    test('should handle calendar-like use cases', () => {
      // Day of week examples (7 days)
      expect(toBasicRange(8, 'day_of_week')).toBe(1) // Next week's Monday
      expect(toBasicRange(14, 'day_of_week')).toBe(7) // Two weeks later's Sunday
      expect(toBasicRange(-1, 'day_of_week')).toBe(6) // Yesterday from Sunday

      // Month examples (12 months)
      expect(toBasicRange(13, 'month_name')).toBe(1) // Next year's January
      expect(toBasicRange(24, 'month_name')).toBe(12) // Two years later's December
      expect(toBasicRange(-1, 'month_name')).toBe(11) // Previous year's November
    })

    test('should handle alphabet-like use cases', () => {
      // Latin alphabet (26 letters)
      expect(toBasicRange(27, 'latin_letter')).toBe(1) // A after Z
      expect(toBasicRange(52, 'latin_letter')).toBe(26) // Z of second cycle
      expect(toBasicRange(-1, 'latin_letter')).toBe(25) // Y before A

      // Greek alphabet (24 letters)
      expect(toBasicRange(25, 'greek_letter')).toBe(1) // α after ω
      expect(toBasicRange(48, 'greek_letter')).toBe(24) // ω of second cycle

      // Hebrew alphabet (22 letters)
      expect(toBasicRange(23, 'hebrew_letter')).toBe(1) // א after ת
      expect(toBasicRange(44, 'hebrew_letter')).toBe(22) // ת of second cycle
      expect(toBasicRange(-1, 'hebrew_letter')).toBe(21) // ש before א

      // Greek letter English names (24 names)
      expect(toBasicRange(25, 'greek_letter_english_name')).toBe(1) // Alpha after Omega
      expect(toBasicRange(48, 'greek_letter_english_name')).toBe(24) // Omega of second cycle
      expect(toBasicRange(-1, 'greek_letter_english_name')).toBe(23) // Psi before Alpha
    })
  })
})

describe('convertTo function', () => {
  describe('Can handle out-of-range circular numerals', () => {
    for (const numType of Object.keys(numeralLength) as NumType[]) {
      test(`convertTo can handle out-of-range for ${numType}`, () => {
        const len = numeralLength[numType]
        if (!len) {
          throw new Error()
        }
        expect(convertTo(len + 2, { type: numType })).toBe(
          convertTo(2, { type: numType })
        )
        expect(convertTo(len + 1, { type: numType })).toBe(
          convertTo(1, { type: numType })
        )
        expect(convertTo(len, { type: numType })).toBe(
          convertTo(0, { type: numType })
        )
        expect(convertTo(len - 1, { type: numType })).toBe(
          convertTo(-1, { type: numType })
        )
        expect(convertTo(len - 2, { type: numType })).toBe(
          convertTo(-2, { type: numType })
        )
      })
    }
  })

  describe('Circular wrapping examples', () => {
    test('Latin letters wrap around correctly', () => {
      // 27th letter wraps to 1st (a)
      expect(convertTo(27, { type: 'latin_letter' })).toBe('a')
      expect(convertTo(27, { type: 'latin_letter', case: 'upper' })).toBe('A')

      // 52nd letter wraps to 26th (z)
      expect(convertTo(52, { type: 'latin_letter' })).toBe('z')
      expect(convertTo(52, { type: 'latin_letter', case: 'upper' })).toBe('Z')

      // Negative numbers wrap backwards
      expect(convertTo(-1, { type: 'latin_letter' })).toBe('y')
      expect(convertTo(0, { type: 'latin_letter' })).toBe('z')
    })

    test('Month names wrap around correctly', () => {
      // 13th month wraps to 1st (January)
      expect(convertTo(13, { type: 'month_name' })).toBe('January')
      expect(convertTo(13, { type: 'month_name', format: 'short' })).toBe('Jan')

      // 24th month wraps to 12th (December)
      expect(convertTo(24, { type: 'month_name' })).toBe('December')
      expect(convertTo(24, { type: 'month_name', format: 'short' })).toBe('Dec')

      // Negative numbers wrap backwards
      expect(convertTo(-1, { type: 'month_name' })).toBe('November')
      expect(convertTo(0, { type: 'month_name' })).toBe('December')
    })

    test('Astrological signs wrap around correctly', () => {
      // 13th sign wraps to 1st (Aries)
      expect(convertTo(13, { type: 'astrological_sign' })).toBe('Aries')
      expect(convertTo(13, { type: 'astrological_sign', case: 'lower' })).toBe(
        'aries'
      )

      // 25th sign wraps to 1st (Aries)
      expect(convertTo(25, { type: 'astrological_sign' })).toBe('Aries')

      // 24th sign wraps to 12th (Pisces)
      expect(convertTo(24, { type: 'astrological_sign' })).toBe('Pisces')
    })

    test('Day of week wraps around correctly (0-based indexing)', () => {
      // 7th day wraps to 0th (Sunday)
      expect(convertTo(7, { type: 'day_of_week' })).toBe('Sunday')
      expect(convertTo(7, { type: 'day_of_week', format: 'short' })).toBe('Sun')

      // 14th day wraps to 0th (Sunday)
      expect(convertTo(14, { type: 'day_of_week' })).toBe('Sunday')

      // 13th day wraps to 6th (Saturday)
      expect(convertTo(13, { type: 'day_of_week' })).toBe('Saturday')

      // Negative numbers wrap backwards
      expect(convertTo(-1, { type: 'day_of_week' })).toBe('Saturday')
      expect(convertTo(-7, { type: 'day_of_week' })).toBe('Sunday')
    })

    test('Chinese zodiac elements wrap around correctly', () => {
      // Heavenly stems (10 elements)
      expect(convertTo(11, { type: 'chinese_heavenly_stem' })).toBe('甲') // wraps to 1st
      expect(convertTo(20, { type: 'chinese_heavenly_stem' })).toBe('癸') // wraps to 10th

      // Earthly branches (12 elements)
      expect(convertTo(13, { type: 'chinese_earthly_branch' })).toBe('子') // wraps to 1st
      expect(convertTo(24, { type: 'chinese_earthly_branch' })).toBe('亥') // wraps to 12th
    })

    test('Hebrew letters wrap around correctly', () => {
      // 23rd letter wraps to 1st (א)
      expect(convertTo(23, { type: 'hebrew_letter' })).toBe('א')

      // 44th letter wraps to 22nd (ת)
      expect(convertTo(44, { type: 'hebrew_letter' })).toBe('ת')

      // Negative numbers wrap backwards
      expect(convertTo(-1, { type: 'hebrew_letter' })).toBe('ש') // 21st letter
      expect(convertTo(0, { type: 'hebrew_letter' })).toBe('ת') // 22nd letter
    })

    test('Greek letter English names wrap around correctly', () => {
      // 25th name wraps to 1st (Alpha)
      expect(convertTo(25, { type: 'greek_letter_english_name' })).toBe('Alpha')
      expect(
        convertTo(25, { type: 'greek_letter_english_name', case: 'lower' })
      ).toBe('alpha')

      // 48th name wraps to 24th (Omega)
      expect(convertTo(48, { type: 'greek_letter_english_name' })).toBe('Omega')
      expect(
        convertTo(48, { type: 'greek_letter_english_name', case: 'upper' })
      ).toBe('OMEGA')

      // Negative numbers wrap backwards
      expect(convertTo(-1, { type: 'greek_letter_english_name' })).toBe('Psi') // 23rd name
      expect(convertTo(0, { type: 'greek_letter_english_name' })).toBe('Omega') // 24th name
    })

    test('Roman numerals do not wrap for invalid values', () => {
      // Roman numerals should still throw errors for 0 and negative numbers
      expect(() => convertTo(0, { type: 'roman' })).toThrow(
        'Input must be a positive integer between 1 and 3999'
      )
      expect(() => convertTo(-1, { type: 'roman' })).toThrow(
        'Input must be a positive integer between 1 and 3999'
      )
      expect(() => convertTo(4000, { type: 'roman' })).toThrow(
        'Input must be a positive integer between 1 and 3999'
      )
      expect(() => convertTo(7998, { type: 'roman' })).toThrow(
        'Input must be a positive integer between 1 and 3999'
      )
    })
  })

  describe('Non-circular types should not wrap', () => {
    test('Decimal numbers do not wrap', () => {
      expect(convertTo(123, { type: 'decimal' })).toBe('123')
      expect(convertTo(-456, { type: 'decimal' })).toBe('-456')
      expect(convertTo(0, { type: 'decimal' })).toBe('0')
    })

    test('Binary numbers do not wrap', () => {
      expect(convertTo(8, { type: 'binary' })).toBe('1000')
      expect(convertTo(255, { type: 'binary' })).toBe('11111111')
    })

    test('English words do not wrap', () => {
      expect(convertTo(100, { type: 'english_words' })).toBe('one hundred')
      expect(convertTo(1000, { type: 'english_words' })).toBe('one thousand')
    })
  })
})
