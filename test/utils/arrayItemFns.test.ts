import { describe, expect, test } from 'bun:test'
import {
  fromArrayItem,
  toArrayItem,
  toFromArrayItemFn,
  toToArrayItemFn,
} from '../../src/utils/arrayItemFns'

describe('Array Item Functions', () => {
  // Sample array for testing
  const testArray = ['apple', 'banana', 'cherry', 'date', 'elderberry']

  describe('toArrayItem', () => {
    test('returns correct item for valid indices', () => {
      expect(toArrayItem(1, testArray)).toBe('apple')
      expect(toArrayItem(2, testArray)).toBe('banana')
      expect(toArrayItem(3, testArray)).toBe('cherry')
      expect(toArrayItem(4, testArray)).toBe('date')
      expect(toArrayItem(5, testArray)).toBe('elderberry')
    })

    test('throws error for index below 1', () => {
      expect(() => toArrayItem(0, testArray)).toThrow(
        'Input must be an integer between 1 and 5'
      )
      expect(() => toArrayItem(-1, testArray)).toThrow(
        'Input must be an integer between 1 and 5'
      )
    })

    test('throws error for index above array length', () => {
      expect(() => toArrayItem(6, testArray)).toThrow(
        'Input must be an integer between 1 and 5'
      )
      expect(() => toArrayItem(10, testArray)).toThrow(
        'Input must be an integer between 1 and 5'
      )
    })

    test('throws error for non-integer indices', () => {
      expect(() => toArrayItem(1.5, testArray)).toThrow()
      expect(() => toArrayItem(Number.NaN, testArray)).toThrow()
    })

    test('handles circular indexing correctly', () => {
      // Within normal range
      expect(toArrayItem(1, testArray, true)).toBe('apple')
      expect(toArrayItem(5, testArray, true)).toBe('elderberry')

      // Beyond normal range
      expect(toArrayItem(6, testArray, true)).toBe('apple') // 6 % 5 = 1
      expect(toArrayItem(7, testArray, true)).toBe('banana') // 7 % 5 = 2
      expect(toArrayItem(8, testArray, true)).toBe('cherry') // 8 % 5 = 3
      expect(toArrayItem(9, testArray, true)).toBe('date') // 9 % 5 = 4
      expect(toArrayItem(10, testArray, true)).toBe('elderberry') // 10 % 5 = 0 + 5 = 5

      // Large numbers
      expect(toArrayItem(16, testArray, true)).toBe('apple') // 16 % 5 = 1
      expect(toArrayItem(107, testArray, true)).toBe('banana') // 107 % 5 = 2
    })

    test('can be 0 or negative with circular indexing', () => {
      expect(toArrayItem(0, testArray, true)).toBe('elderberry')
      expect(toArrayItem(-1, testArray, true)).toBe('date')
      expect(toArrayItem(-5, testArray, true)).toBe('elderberry')
    })

    test('still requires integer indices with circular indexing', () => {
      expect(() => toArrayItem(1.5, testArray, true)).toThrow()
    })

    test('handles empty arrays', () => {
      expect(() => toArrayItem(1, [])).toThrow('Cannot map to an empty array')
    })
  })

  describe('fromArrayItem', () => {
    test('returns correct index for valid items', () => {
      expect(fromArrayItem('apple', testArray)).toBe(1)
      expect(fromArrayItem('banana', testArray)).toBe(2)
      expect(fromArrayItem('cherry', testArray)).toBe(3)
      expect(fromArrayItem('date', testArray)).toBe(4)
      expect(fromArrayItem('elderberry', testArray)).toBe(5)
    })

    test('throws error for non-existent items', () => {
      expect(() => fromArrayItem('fig', testArray)).toThrow('Input is invalid')
      expect(() => fromArrayItem('', testArray)).toThrow('Input is invalid')
    })

    test('is case sensitive', () => {
      expect(() => fromArrayItem('Apple', testArray)).toThrow(
        'Input is invalid'
      )
      expect(() => fromArrayItem('BANANA', testArray)).toThrow(
        'Input is invalid'
      )
    })

    test('handles empty arrays', () => {
      expect(() => fromArrayItem('anything', [])).toThrow('Input is invalid')
    })
  })

  describe('toToArrayItemFn', () => {
    test('creates a function that correctly converts numbers to array items', () => {
      const fruitsToNumber = toToArrayItemFn(testArray)

      expect(typeof fruitsToNumber).toBe('function')
      expect(fruitsToNumber(1)).toBe('apple')
      expect(fruitsToNumber(3)).toBe('cherry')
      expect(fruitsToNumber(5)).toBe('elderberry')
    })

    test('created function throws error for invalid inputs', () => {
      const fruitsToNumber = toToArrayItemFn(testArray)

      expect(() => fruitsToNumber(0)).toThrow()
      expect(() => fruitsToNumber(6)).toThrow()
      expect(() => fruitsToNumber(1.5)).toThrow()
    })

    test('created function handles circular parameter correctly', () => {
      const fruitsToNumber = toToArrayItemFn(testArray)

      expect(fruitsToNumber(6, true)).toBe('apple')
      expect(fruitsToNumber(8, true)).toBe('cherry')
      expect(() => fruitsToNumber(0)).toThrow()
      expect(fruitsToNumber(0, true)).toBe('elderberry')
    })

    test('works with empty arrays', () => {
      const emptyToNumber = toToArrayItemFn([])
      expect(() => emptyToNumber(1)).toThrow()
    })
  })

  describe('toFromArrayItemFn', () => {
    test('creates a function that correctly converts array items to numbers', () => {
      const numberToFruits = toFromArrayItemFn(testArray)

      expect(typeof numberToFruits).toBe('function')
      expect(numberToFruits('apple')).toBe(1)
      expect(numberToFruits('cherry')).toBe(3)
      expect(numberToFruits('elderberry')).toBe(5)
    })

    test('created function throws error for invalid inputs', () => {
      const numberToFruits = toFromArrayItemFn(testArray)

      expect(() => numberToFruits('fig')).toThrow()
      expect(() => numberToFruits('')).toThrow()
      expect(() => numberToFruits('Apple')).toThrow() // Case sensitive
    })

    test('works with empty arrays', () => {
      const numberToEmpty = toFromArrayItemFn([])
      expect(() => numberToEmpty('anything')).toThrow()
    })
  })

  describe('Integration tests', () => {
    test('converting back and forth between indices and items', () => {
      for (let i = 1; i <= testArray.length; i++) {
        const item = toArrayItem(i, testArray)
        expect(fromArrayItem(item, testArray)).toBe(i)
      }
    })

    test('factory functions produce equivalent results to direct functions', () => {
      const toFruit = toToArrayItemFn(testArray)
      const fromFruit = toFromArrayItemFn(testArray)

      for (let i = 1; i <= testArray.length; i++) {
        expect(toFruit(i)).toBe(toArrayItem(i, testArray))

        const fruit = testArray[i - 1]
        expect(fromFruit(fruit)).toBe(fromArrayItem(fruit, testArray))
      }
    })

    test('circular indexing with various ranges', () => {
      // Test with different sized arrays to ensure modular arithmetic works
      const smallArray = ['a', 'b', 'c']
      const toSmall = toToArrayItemFn(smallArray)

      expect(toSmall(1)).toBe('a')
      expect(toSmall(4, true)).toBe('a') // 4 % 3 = 1
      expect(toSmall(5, true)).toBe('b') // 5 % 3 = 2
      expect(toSmall(6, true)).toBe('c') // 6 % 3 = 0 + 3 = 3

      // Large array
      const largeArray = Array.from({ length: 20 }, (_, i) => `item-${i + 1}`)
      const toLarge = toToArrayItemFn(largeArray)

      expect(toLarge(1)).toBe('item-1')
      expect(toLarge(20)).toBe('item-20')
      expect(toLarge(21, true)).toBe('item-1')
      expect(toLarge(40, true)).toBe('item-20')
    })

    test('example usage in real-world scenarios', () => {
      // Example: Weekdays
      const weekdays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ]
      const toWeekday = toToArrayItemFn(weekdays)
      const fromWeekday = toFromArrayItemFn(weekdays)

      // Get day for day number
      expect(toWeekday(1)).toBe('Monday')
      expect(toWeekday(5)).toBe('Friday')

      // Get day number for day
      expect(fromWeekday('Sunday')).toBe(7)

      // Using circular indexing for repeating weeks
      expect(toWeekday(8, true)).toBe('Monday')
      expect(toWeekday(9, true)).toBe('Tuesday')

      // Get day for nth day of the year
      expect(toWeekday(365, true)).toBe('Monday')
    })
  })
})
