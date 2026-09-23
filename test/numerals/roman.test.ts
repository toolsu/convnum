import { describe, expect, test } from 'bun:test'
import { fromRoman, toRoman } from '../../src'

describe('Standard Roman numerals', () => {
  test('toRoman should convert numbers to Roman numerals', () => {
    expect(toRoman(1)).toBe('I')
    expect(toRoman(4)).toBe('IV')
    expect(toRoman(9)).toBe('IX')
    expect(toRoman(42)).toBe('XLII')
    expect(toRoman(99)).toBe('XCIX')
    expect(toRoman(1999)).toBe('MCMXCIX')
    expect(toRoman(3999)).toBe('MMMCMXCIX')
  })

  test('fromRoman should convert Roman numerals to numbers', () => {
    expect(fromRoman('I')).toBe(1)
    expect(fromRoman('IV')).toBe(4)
    expect(fromRoman('IX')).toBe(9)
    expect(fromRoman('XLII')).toBe(42)
    expect(fromRoman('XCIX')).toBe(99)
    expect(fromRoman('MCMXCIX')).toBe(1999)
    expect(fromRoman('MMMCMXCIX')).toBe(3999)
  })

  test('should handle invalid Roman numerals', () => {
    expect(() => fromRoman('ABC')).toThrow()
    expect(() => fromRoman('IIII')).toThrow()
  })

  test('should convert all single-character Roman numerals correctly', () => {
    expect(fromRoman('I')).toBe(1)
    expect(fromRoman('V')).toBe(5)
    expect(fromRoman('X')).toBe(10)
    expect(fromRoman('L')).toBe(50)
    expect(fromRoman('C')).toBe(100)
    expect(fromRoman('D')).toBe(500)
    expect(fromRoman('M')).toBe(1000)
  })

  test('should handle all subtractive pairs correctly', () => {
    expect(fromRoman('IV')).toBe(4)
    expect(fromRoman('IX')).toBe(9)
    expect(fromRoman('XL')).toBe(40)
    expect(fromRoman('XC')).toBe(90)
    expect(fromRoman('CD')).toBe(400)
    expect(fromRoman('CM')).toBe(900)

    expect(toRoman(4)).toBe('IV')
    expect(toRoman(9)).toBe('IX')
    expect(toRoman(40)).toBe('XL')
    expect(toRoman(90)).toBe('XC')
    expect(toRoman(400)).toBe('CD')
    expect(toRoman(900)).toBe('CM')
  })

  test('should be case-insensitive when converting from Roman numerals', () => {
    expect(fromRoman('i')).toBe(1)
    expect(fromRoman('iv')).toBe(4)
    expect(fromRoman('mCmXcIx')).toBe(1999)
    expect(fromRoman('MMMCMXCIX')).toBe(3999)
  })

  test('should handle complex combinations of numerals', () => {
    expect(fromRoman('MMMDCCCLXXXVIII')).toBe(3888)
    expect(toRoman(3888)).toBe('MMMDCCCLXXXVIII')

    expect(fromRoman('CDXLIV')).toBe(444)
    expect(toRoman(444)).toBe('CDXLIV')

    expect(fromRoman('MCMLXXVI')).toBe(1976)
    expect(toRoman(1976)).toBe('MCMLXXVI')
  })

  // Test invalid Roman numeral patterns
  test('should reject invalid Roman numeral patterns', () => {
    // Invalid repeats
    expect(() => fromRoman('IIII')).toThrow()
    expect(() => fromRoman('VV')).toThrow()
    expect(() => fromRoman('XXXX')).toThrow()
    expect(() => fromRoman('LL')).toThrow()
    expect(() => fromRoman('CCCC')).toThrow()
    expect(() => fromRoman('DD')).toThrow()
    expect(() => fromRoman('MMMM')).toThrow()

    // Invalid subtractive patterns
    expect(() => fromRoman('IIV')).toThrow()
    expect(() => fromRoman('IIX')).toThrow()
    expect(() => fromRoman('VX')).toThrow()
    expect(() => fromRoman('IL')).toThrow()
    expect(() => fromRoman('IC')).toThrow()
    expect(() => fromRoman('ID')).toThrow()
    expect(() => fromRoman('IM')).toThrow()
    expect(() => fromRoman('XD')).toThrow()
    expect(() => fromRoman('XM')).toThrow()

    // Invalid ordering
    expect(() => fromRoman('IVIV')).toThrow()
    expect(() => fromRoman('XCXC')).toThrow()
  })

  // Test out-of-range inputs for toRoman
  test('should reject out-of-range numbers for toRoman', () => {
    expect(() => toRoman(0)).toThrow()
    expect(() => toRoman(-1)).toThrow()
    expect(() => toRoman(4000)).toThrow()
    expect(() => toRoman(10000)).toThrow()
  })

  // Test empty strings and non-string inputs for fromRoman
  test('should reject invalid inputs for fromRoman', () => {
    expect(() => fromRoman('')).toThrow()
    expect(() => fromRoman('  ')).toThrow()
    expect(() => fromRoman('MCMXCIX ')).toThrow() // Space at the end
    expect(() => fromRoman(' MCMXCIX')).toThrow() // Space at the beginning
    expect(() => fromRoman('MC MXCIX')).toThrow() // Space in the middle
    expect(() => fromRoman('123')).toThrow()
    expect(() => fromRoman('M1X')).toThrow()
  })

  // Property-based test: round-trip conversion should yield the original value
  test('round-trip conversion should yield the original value', () => {
    for (let num = 1; num <= 3999; num += 123) {
      // Test a sample of values
      expect(fromRoman(toRoman(num))).toBe(num)
    }
  })

  // Test specific historical years to ensure readability and correctness
  test('should correctly convert historically significant years', () => {
    expect(toRoman(753)).toBe('DCCLIII') // Traditional founding of Rome
    expect(toRoman(1066)).toBe('MLXVI') // Battle of Hastings
    expect(toRoman(1492)).toBe('MCDXCII') // Columbus reaches Americas
    expect(toRoman(1776)).toBe('MDCCLXXVI') // American Declaration of Independence
    expect(toRoman(1945)).toBe('MCMXLV') // End of World War II
    expect(toRoman(2000)).toBe('MM') // Millennium

    expect(fromRoman('DCCLIII')).toBe(753)
    expect(fromRoman('MLXVI')).toBe(1066)
    expect(fromRoman('MCDXCII')).toBe(1492)
    expect(fromRoman('MDCCLXXVI')).toBe(1776)
    expect(fromRoman('MCMXLV')).toBe(1945)
    expect(fromRoman('MM')).toBe(2000)
  })
})
