import { describe, expect, test } from 'bun:test'
import { findCommonType } from '../../src/utils/findCommonType'
import { compareNumTypeOrder } from '../../src/utils/orders'
import type { NumType } from '../../src/utils/types'

// Helper function to sort arrays by compareNumTypeOrder (mutating the original)
const sortByPriority = (types: NumType[]) => {
  types.sort((a, b) => compareNumTypeOrder(a, b))
}

describe('findCommonType function', () => {
  describe('Basic functionality', () => {
    test('should return highest priority common type', () => {
      const startTypes: NumType[] = ['binary', 'decimal', 'roman']
      const stopTypes: NumType[] = ['decimal', 'roman', 'octal']
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe('decimal')
    })

    test('should return single common type', () => {
      const startTypes: NumType[] = ['roman']
      const stopTypes: NumType[] = ['roman']
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe('roman')
    })

    test('should return null when no common types exist', () => {
      const startTypes: NumType[] = ['roman']
      const stopTypes: NumType[] = ['binary']
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe(null)
    })
  })

  describe('Priority ordering', () => {
    test('should prefer decimal over other types', () => {
      const startTypes: NumType[] = ['roman', 'decimal', 'binary']
      const stopTypes: NumType[] = ['binary', 'decimal', 'octal']
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe('decimal')
    })

    test('should prefer roman over binary when decimal not available', () => {
      const startTypes: NumType[] = ['roman', 'binary']
      const stopTypes: NumType[] = ['binary', 'roman']
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe('roman')
    })

    test('should follow convnum order strictly', () => {
      const startTypes: NumType[] = [
        'latin_letter',
        'greek_letter',
        'cyrillic_letter',
      ]
      const stopTypes: NumType[] = [
        'latin_letter',
        'greek_letter',
        'cyrillic_letter',
      ]
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe('latin_letter') // determined by convnum's VALID_NUM_TYPES order
    })
  })

  describe('Edge cases', () => {
    test('should use startTypes when stopTypes is empty array', () => {
      const startTypes: NumType[] = ['decimal', 'roman']
      const stopTypes: NumType[] = []
      sortByPriority(startTypes)
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe('decimal')
    })

    test('should use startTypes when stopTypes is empty array (a-f)', () => {
      const startTypes: NumType[] = ['latin_letter', 'hexadecimal']
      const stopTypes: NumType[] = []
      sortByPriority(startTypes)
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe('latin_letter')
    })

    test('should return null when startTypes is empty array', () => {
      const startTypes: NumType[] = []
      const stopTypes: NumType[] = ['decimal', 'roman']
      sortByPriority(stopTypes)
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe(null)
    })

    test('should return null when both arrays are empty', () => {
      const startTypes: NumType[] = []
      const stopTypes: NumType[] = []
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe(null)
    })

    test('should handle single element arrays', () => {
      const startTypes: NumType[] = ['decimal']
      const stopTypes: NumType[] = ['decimal']
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe('decimal')
    })

    test('should handle large arrays with many common types', () => {
      const startTypes: NumType[] = [
        'decimal',
        'binary',
        'octal',
        'hexadecimal',
        'roman',
      ]
      const stopTypes: NumType[] = [
        'roman',
        'hexadecimal',
        'octal',
        'binary',
        'decimal',
      ]
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe('decimal')
    })
  })

  describe('Type combinations', () => {
    test('should handle numeric types correctly', () => {
      const startTypes: NumType[] = ['binary', 'octal', 'hexadecimal']
      const stopTypes: NumType[] = ['hexadecimal', 'decimal']
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe('hexadecimal')
    })

    test('should handle letter types correctly', () => {
      const startTypes: NumType[] = ['latin_letter', 'greek_letter']
      const stopTypes: NumType[] = ['greek_letter', 'cyrillic_letter']
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe('greek_letter')
    })

    test('should handle word types correctly', () => {
      const startTypes: NumType[] = ['english_words', 'french_words']
      const stopTypes: NumType[] = ['french_words', 'chinese_words']
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe('french_words')
    })

    test('should handle date/time types correctly', () => {
      const startTypes: NumType[] = ['month_name', 'day_of_week']
      const stopTypes: NumType[] = ['day_of_week', 'astrological_sign']
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe('day_of_week')
    })
  })

  describe('Real-world scenarios', () => {
    test('should handle "1" and "5" (both detected as decimal)', () => {
      const startTypes: NumType[] = ['decimal']
      const stopTypes: NumType[] = ['decimal']
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe('decimal')
    })

    test('should handle "a" and "z" (both detected as latin_letter)', () => {
      const startTypes: NumType[] = ['latin_letter']
      const stopTypes: NumType[] = ['latin_letter']
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe('latin_letter')
    })

    test('should handle "I" and "V" (both detected as latin_letter)', () => {
      const startTypes: NumType[] = ['latin_letter', 'roman']
      const stopTypes: NumType[] = ['latin_letter', 'roman']
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe('latin_letter')
    })

    test('should handle incompatible types like "1" and "a"', () => {
      const startTypes: NumType[] = ['decimal']
      const stopTypes: NumType[] = ['latin_letter']
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe(null)
    })

    test('should handle ambiguous values with multiple type matches', () => {
      // Example: "C" could be hexadecimal, roman numeral, or latin letter
      const startTypes: NumType[] = ['latin_letter', 'roman', 'hexadecimal']
      const stopTypes: NumType[] = ['latin_letter', 'roman']
      const result = findCommonType(startTypes, stopTypes)
      expect(result).toBe('latin_letter')
    })
  })
})
