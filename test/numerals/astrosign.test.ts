import { describe, expect, test } from 'bun:test'
import { fromAstroSign, toAstroSign } from '../../src'

describe('Astrological Sign Conversions', () => {
  describe('toAstroSign', () => {
    test('converts valid numbers to astrological signs', () => {
      expect(toAstroSign(1)).toBe('Aries')
      expect(toAstroSign(2)).toBe('Taurus')
      expect(toAstroSign(3)).toBe('Gemini')
      expect(toAstroSign(4)).toBe('Cancer')
      expect(toAstroSign(5)).toBe('Leo')
      expect(toAstroSign(6)).toBe('Virgo')
      expect(toAstroSign(7)).toBe('Libra')
      expect(toAstroSign(8)).toBe('Scorpio')
      expect(toAstroSign(9)).toBe('Sagittarius')
      expect(toAstroSign(10)).toBe('Capricorn')
      expect(toAstroSign(11)).toBe('Aquarius')
      expect(toAstroSign(12)).toBe('Pisces')
    })

    test('throws error for out of range numbers', () => {
      // Below range
      expect(() => toAstroSign(0)).toThrow()
      expect(() => toAstroSign(-1)).toThrow()

      // Above range
      expect(() => toAstroSign(13)).toThrow()
      expect(() => toAstroSign(100)).toThrow()
    })

    test('throws error for non-integer numbers', () => {
      expect(() => toAstroSign(1.5)).toThrow()
      expect(() => toAstroSign(3.14)).toThrow()
    })

    test('throws error for non-number inputs', () => {
      // @ts-expect-error Testing invalid input type
      expect(() => toAstroSign('Aries')).toThrow()
      // @ts-expect-error Testing invalid input type
      expect(() => toAstroSign(null)).toThrow()
      // @ts-expect-error Testing invalid input type
      expect(() => toAstroSign(undefined)).toThrow()
      // @ts-expect-error Testing invalid input type
      expect(() => toAstroSign({})).toThrow()
    })

    test('handles circular indexing correctly', () => {
      // Same as regular indexing for in-range values
      expect(toAstroSign(1, true)).toBe('Aries')
      expect(toAstroSign(12, true)).toBe('Pisces')

      // Wraps around for values > 12
      expect(toAstroSign(13, true)).toBe('Aries')
      expect(toAstroSign(14, true)).toBe('Taurus')
      expect(toAstroSign(24, true)).toBe('Pisces')
      expect(toAstroSign(25, true)).toBe('Aries')

      // // Wraps around for large values
      expect(toAstroSign(1201, true)).toBe('Aries') // 1201 % 12 = 1
      expect(toAstroSign(1202, true)).toBe('Taurus') // 1202 % 12 = 2

      // // Handles negative numbers with circular indexing
      expect(toAstroSign(-1, true)).toBe('Aquarius') // -1 % 12 = 11 (modNoZero)
      expect(toAstroSign(-12, true)).toBe('Pisces') // -12 % 12 = 12 (modNoZero)
      expect(toAstroSign(-13, true)).toBe('Aquarius') // -13 % 12 = 11 (modNoZero)
    })

    test('still checks for integer with circular indexing', () => {
      expect(() => toAstroSign(1.5, true)).toThrow()
    })
  })

  describe('fromAstroSign', () => {
    test('converts valid astrological signs to numbers', () => {
      expect(fromAstroSign('Aries')).toBe(1)
      expect(fromAstroSign('Taurus')).toBe(2)
      expect(fromAstroSign('Gemini')).toBe(3)
      expect(fromAstroSign('Cancer')).toBe(4)
      expect(fromAstroSign('Leo')).toBe(5)
      expect(fromAstroSign('Virgo')).toBe(6)
      expect(fromAstroSign('Libra')).toBe(7)
      expect(fromAstroSign('Scorpio')).toBe(8)
      expect(fromAstroSign('Sagittarius')).toBe(9)
      expect(fromAstroSign('Capricorn')).toBe(10)
      expect(fromAstroSign('Aquarius')).toBe(11)
      expect(fromAstroSign('Pisces')).toBe(12)
    })

    test('converts case-insensitive valid astrological signs to numbers', () => {
      expect(fromAstroSign('libra')).toBe(7)
      expect(fromAstroSign('sCorpio')).toBe(8)
      expect(fromAstroSign('SAGITTARIUS')).toBe(9)
    })

    test('throws error for invalid astrological signs', () => {
      expect(() => fromAstroSign('Invalid')).toThrow()
      expect(() => fromAstroSign('Sign')).toThrow()
      expect(() => fromAstroSign('')).toThrow()
      expect(() => fromAstroSign('AriesTaurus')).toThrow()
    })

    test('throws error for non-string inputs', () => {
      // @ts-expect-error Testing invalid input type
      expect(() => fromAstroSign(1)).toThrow()
      // @ts-expect-error Testing invalid input type
      expect(() => fromAstroSign(null)).toThrow()
      // @ts-expect-error Testing invalid input type
      expect(() => fromAstroSign(undefined)).toThrow()
      // @ts-expect-error Testing invalid input type
      expect(() => fromAstroSign({})).toThrow()
    })
  })

  describe('Bidirectional conversion', () => {
    test('converting back and forth works for all signs', () => {
      for (let i = 1; i <= 12; i++) {
        const sign = toAstroSign(i)
        expect(fromAstroSign(sign)).toBe(i)
      }
    })

    test('converting back and forth works with circular indexing', () => {
      for (let i = 1; i <= 36; i++) {
        const sign = toAstroSign(i, true)
        const num = fromAstroSign(sign)
        expect(num).toBe(((i - 1) % 12) + 1)
      }
    })
  })

  describe('Edge cases and special scenarios', () => {
    test('throws appropriate errors for boundary conditions', () => {
      // Just at the boundaries
      expect(toAstroSign(1)).toBe('Aries')
      expect(toAstroSign(12)).toBe('Pisces')
      expect(() => toAstroSign(0)).toThrow()
      expect(() => toAstroSign(13)).toThrow()
    })

    test('handles circular indexing at boundaries', () => {
      expect(toAstroSign(0, true)).toBe('Pisces') // 0 is valid
      expect(toAstroSign(12, true)).toBe('Pisces')
      expect(toAstroSign(13, true)).toBe('Aries')
      expect(toAstroSign(24, true)).toBe('Pisces')
      expect(toAstroSign(25, true)).toBe('Aries')
    })

    test('performance with large numbers when using circular indexing', () => {
      // This should still work efficiently with large numbers
      expect(toAstroSign(1000000 + 1, true)).toBe('Leo') // 5
      expect(toAstroSign(1000000 + 6, true)).toBe('Capricorn') // 10
      expect(toAstroSign(1000000 + 12, true)).toBe('Cancer') // 4
    })
  })

  describe('Integration and practical uses', () => {
    test('mapping month numbers to signs', () => {
      const monthToSignMap = {
        1: 'Capricorn', // Jan mostly Capricorn
        2: 'Aquarius', // Feb mostly Aquarius
        3: 'Pisces', // Mar mostly Pisces
        4: 'Aries', // Apr mostly Aries
        5: 'Taurus', // May mostly Taurus
        6: 'Gemini', // Jun mostly Gemini
        7: 'Cancer', // Jul mostly Cancer
        8: 'Leo', // Aug mostly Leo
        9: 'Virgo', // Sep mostly Virgo
        10: 'Libra', // Oct mostly Libra
        11: 'Scorpio', // Nov mostly Scorpio
        12: 'Sagittarius', // Dec mostly Sagittarius
      }

      // Test that we can convert months to approximate signs
      // (this is simplified - real astrology considers day of month)
      Object.entries(monthToSignMap).forEach(([, sign]) => {
        expect(typeof sign).toBe('string')
        expect(() => fromAstroSign(sign)).not.toThrow()
      })
    })

    test('creating a complete zodiac cycle', () => {
      // Create a complete zodiac cycle
      const zodiacCycle: string[] = []
      for (let i = 1; i <= 12; i++) {
        zodiacCycle.push(toAstroSign(i))
      }

      expect(zodiacCycle).toEqual([
        'Aries',
        'Taurus',
        'Gemini',
        'Cancer',
        'Leo',
        'Virgo',
        'Libra',
        'Scorpio',
        'Sagittarius',
        'Capricorn',
        'Aquarius',
        'Pisces',
      ])

      // Verify each sign maps back to its correct position
      zodiacCycle.forEach((sign, index) => {
        expect(fromAstroSign(sign)).toBe(index + 1)
      })
    })
  })
})
