import { describe, expect, test } from 'bun:test'
import { fromArabicNumerals, toArabicNumerals } from '../../src'

describe('Eastern Arabic numeral conversions', () => {
  describe('toArabicNumerals', () => {
    test('converts single digits correctly', () => {
      expect(toArabicNumerals(0)).toBe('٠')
      expect(toArabicNumerals(1)).toBe('١')
      expect(toArabicNumerals(9)).toBe('٩')
    })

    test('converts multi-digit numbers correctly', () => {
      expect(toArabicNumerals(123)).toBe('١٢٣')
      expect(toArabicNumerals(9876)).toBe('٩٨٧٦')
      expect(toArabicNumerals(1000000)).toBe('١٠٠٠٠٠٠')
    })

    test('handles negative numbers correctly', () => {
      expect(toArabicNumerals(-42)).toBe('-٤٢')
      expect(toArabicNumerals(-1234)).toBe('-١٢٣٤')
    })

    test('handles decimal numbers correctly', () => {
      expect(toArabicNumerals(3.14)).toBe('٣.١٤')
      expect(toArabicNumerals(-0.5)).toBe('-٠.٥')
      expect(toArabicNumerals(123.456)).toBe('١٢٣.٤٥٦')
    })

    test('throws error for invalid inputs', () => {
      expect(() => toArabicNumerals(Number.POSITIVE_INFINITY)).toThrow(
        'Input must be a finite number'
      )
      expect(() => toArabicNumerals(Number.NaN)).toThrow(
        'Input must be a finite number'
      )
    })
  })

  describe('fromArabicNumerals', () => {
    test('converts single digits correctly', () => {
      expect(fromArabicNumerals('٠')).toBe(0)
      expect(fromArabicNumerals('١')).toBe(1)
      expect(fromArabicNumerals('٩')).toBe(9)
    })

    test('converts multi-digit numbers correctly', () => {
      expect(fromArabicNumerals('١٢٣')).toBe(123)
      expect(fromArabicNumerals('٩٨٧٦')).toBe(9876)
      expect(fromArabicNumerals('١٠٠٠٠٠٠')).toBe(1000000)
    })

    test('handles negative numbers correctly', () => {
      expect(fromArabicNumerals('-٤٢')).toBe(-42)
      expect(fromArabicNumerals('-١٢٣٤')).toBe(-1234)
    })

    test('handles decimal numbers correctly', () => {
      expect(fromArabicNumerals('٣.١٤')).toBe(3.14)
      expect(fromArabicNumerals('-٠.٥')).toBe(-0.5)
      expect(fromArabicNumerals('١٢٣.٤٥٦')).toBe(123.456)
    })

    test('throws error for invalid characters', () => {
      expect(() => fromArabicNumerals('١٢٣a')).toThrow(
        'Invalid character in number: "a"'
      )
      expect(() => fromArabicNumerals('٤٢+')).toThrow(
        'Invalid character in number: "+"'
      )
      expect(() => fromArabicNumerals('abc')).toThrow(
        'Invalid character in number: "a"'
      )
    })

    test('handles empty string', () => {
      expect(() => fromArabicNumerals('')).toThrow()
    })

    test('roundtrip conversion works correctly', () => {
      const numbers = [0, 42, -123, 3.14, -0.5, 1000000]
      for (const num of numbers) {
        expect(fromArabicNumerals(toArabicNumerals(num))).toBe(num)
      }
    })
  })
})
