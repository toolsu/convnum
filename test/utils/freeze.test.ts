import { describe, expect, test } from 'bun:test'
import { freeze } from '../../src/utils/freeze'

describe('freeze utility', () => {
  test('should freeze objects when Object.freeze is available', () => {
    const obj = { a: 1, b: 2 }
    const frozen = freeze(obj)

    expect(Object.isFrozen(frozen)).toBe(true)
    expect(frozen.a).toBe(1)
    expect(frozen.b).toBe(2)
  })

  test('should return object unchanged when Object.freeze is not available', () => {
    // Temporarily remove Object.freeze to test fallback
    const originalFreeze = Object.freeze
    Object.freeze = undefined as unknown as typeof Object.freeze

    try {
      const obj = { a: 1, b: 2 }
      const result = freeze(obj)

      expect(result).toBe(obj)
      expect(result.a).toBe(1)
      expect(result.b).toBe(2)
    } finally {
      // Restore Object.freeze
      Object.freeze = originalFreeze
    }
  })

  test('should handle null and undefined', () => {
    expect(freeze(null)).toBe(null)
    expect(freeze(undefined)).toBe(undefined)
  })

  test('should handle primitive values', () => {
    expect(freeze(123)).toBe(123)
    expect(freeze('test')).toBe('test')
    expect(freeze(true)).toBe(true)
  })
})
