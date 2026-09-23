import { expect, test } from 'bun:test'
import { fromLetter } from '../../src/utils/letterFns'

test('fromLetter covers else branch with valid letter', () => {
  // baseCharCode = 65 (ASCII for 'A'), length = 26, letter = 'C'
  // 'C'.charCodeAt(0) = 67, so 67 >= 65 && 67 < 91 ✓
  expect(fromLetter('C', 65, 26)).toBe(3)

  // Another example: baseCharCode = 97 (ASCII for 'a'), length = 26, letter = 'z'
  // 'z'.charCodeAt(0) = 122, so 122 >= 97 && 122 < 123 ✓
  expect(fromLetter('z', 97, 26)).toBe(26)
})
